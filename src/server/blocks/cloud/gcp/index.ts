import * as pulumi from "@pulumi/pulumi";
import * as gcp from "@pulumi/gcp";
import * as kubernetes from "@pulumi/kubernetes";

import { type NodePool } from "@pulumi/gcp/container";
import { type ResourceOptions } from "@pulumi/pulumi";
import { dependsOn, provider } from "../../utils";
import {
  type StackPrepare,
  type BlockConfig,
  type BlockConfiguration,
  type ProvidedResourceReturn,
  type ProvidedResource,
  type StackContext,
} from "~/types";

import logo from "./logo.png";

type GoogleCloudConfiguration = BlockConfiguration<{
  projectId: string;
  region: string;
  location: string;
  clusterName?: string;
  credentials: string;
  nodeCountCpu: number;
  nodeCountGpu: number;
  scaledDown: boolean;
}>;

const prepare: StackPrepare<GoogleCloudConfiguration> = async (
  stack: pulumi.automation.Stack,
  ctx: StackContext,
  config: GoogleCloudConfiguration
) => {
  const { region, projectId: project } = config;

  await stack.setConfig("gcp:project", { value: project });
  await stack.setConfig("gcp:region", { value: region });
  await stack.setConfig("gcp:credentials", { value: config.credentials });

  // const user = ctx.session.user;
  // const account = await ctx.prisma.account.findFirst({
  //   where: { userId: user.id },
  // });
  // if (account && account.access_token) {
  //   // await stack.setConfig("gcp:accessToken", { value: account.access_token });
  // }
};

const program = async (
  config: GoogleCloudConfiguration,
  links: ProvidedResource[],
  ctx: StackContext,
  options: ResourceOptions | undefined
  // eslint-disable-next-line @typescript-eslint/require-await
) => {
  const {
    region,
    location,
    clusterName,
    projectId: project,
    nodeCountCpu,
    nodeCountGpu,
    scaledDown,
  } = config;

  // const user = ctx.session.user;
  // const account = await ctx.prisma.account.findFirst({
  //   where: { userId: user.id },
  // });
  // let accessToken = "";
  // if (account && account.access_token) {
  //   accessToken = account.access_token;
  // }

  const pipelayerClusterName = clusterName || "pipelayer-k8s";
  const gcp_provider = new gcp.Provider("gcp-provider", {
    // has to be set globally AND here
    // accessToken,
    credentials: config.credentials,
    project,
    region,
  });

  // Enable compute API
  const compute_api = new gcp.projects.Service(
    "compute-api",
    {
      disableDependentServices: true,
      project,
      service: "compute.googleapis.com",
    },
    provider(gcp_provider, options)
  );

  // Enable Container API
  const kubernetes_api = new gcp.projects.Service(
    "kubernetes-api",
    {
      disableDependentServices: true,
      project,
      service: "container.googleapis.com",
    },
    provider(gcp_provider, options)
  );

  // Enable Artifact Registry API
  const artifact_api = new gcp.projects.Service(
    "artifact-api",
    {
      disableDependentServices: true,
      project,
      service: "artifactregistry.googleapis.com",
    },
    provider(gcp_provider, options)
  );

  // Enable Cloud Filestore API
  const file_api = new gcp.projects.Service(
    "file-api",
    {
      disableDependentServices: true,
      project,
      service: "file.googleapis.com",
    },
    provider(gcp_provider, options)
  );

  // Enable Cloud Filestore API
  const resource_manager_api = new gcp.projects.Service(
    "resource-manager-api",
    {
      disableDependentServices: true,
      project,
      service: "cloudresourcemanager.googleapis.com",
    },
    provider(gcp_provider, options)
  );

  // Create a new network
  const network = new gcp.compute.Network(
    "gke-network",
    {
      autoCreateSubnetworks: false,
      description: "A virtual network for your GKE cluster(s)",
    },
    provider(gcp_provider, options)
  );

  // Create a new subnet in the network created above
  const subnet = new gcp.compute.Subnetwork(
    "gke-subnet",
    {
      ipCidrRange: "10.128.0.0/12",
      network: network.id,
      privateIpGoogleAccess: true,
    },
    provider(gcp_provider, options)
  );

  //create CloudRouter to give private GKE Cluster Nodes access to the internet -> Docker Hub
  const router = new gcp.compute.Router(
    "gke-nat",
    {
      network: network.id,
    },
    provider(gcp_provider, options)
  );

  //create CloudNAT to give private GKE Cluster Nodes access to the internet -> Docker Hub
  const nat = new gcp.compute.RouterNat(
    "gke-nat",
    {
      router: router.name,
      natIpAllocateOption: "AUTO_ONLY",
      sourceSubnetworkIpRangesToNat: "ALL_SUBNETWORKS_ALL_IP_RANGES",
    },
    provider(gcp_provider, options)
  );

  // Create a new GKE cluster with filestore CSI driver
  const cluster = new gcp.container.Cluster(
    pipelayerClusterName,
    {
      addonsConfig: {
        gcpFilestoreCsiDriverConfig: {
          enabled: true,
        },
        dnsCacheConfig: {
          enabled: true,
        },
      },
      binaryAuthorization: {
        evaluationMode: "PROJECT_SINGLETON_POLICY_ENFORCE",
      },
      datapathProvider: "ADVANCED_DATAPATH",
      description: "A GKE cluster",
      initialNodeCount: 1,
      ipAllocationPolicy: {
        clusterIpv4CidrBlock: "/14",
        servicesIpv4CidrBlock: "/20",
      },
      location,
      masterAuthorizedNetworksConfig: {
        cidrBlocks: [
          {
            cidrBlock: "0.0.0.0/0",
            displayName: "All networks",
          },
        ],
      },
      minMasterVersion: "1.27.3-gke.100",
      network: network.name,
      networkingMode: "VPC_NATIVE",
      privateClusterConfig: {
        enablePrivateNodes: true,
        enablePrivateEndpoint: false,
        masterIpv4CidrBlock: "10.100.0.0/28",
      },
      removeDefaultNodePool: true,
      releaseChannel: {
        channel: "STABLE",
      },
      subnetwork: subnet.name,
      workloadIdentityConfig: {
        workloadPool: `${project}.svc.id.goog`,
      },
    },
    dependsOn([compute_api, kubernetes_api], options)
  );

  // Create a service account for the node pool
  const gkeNodepoolSa = new gcp.serviceaccount.Account(
    "gke-nodepool-sa",
    {
      accountId: pulumi.interpolate`${cluster.name}-np-1-sa`,
      displayName: "Nodepool 1 Service Account",
    },
    provider(gcp_provider, options)
  );

  // Allow the k8s member nodes to pull images from artifact registry
  new gcp.projects.IAMMember(
    "allow_image_pull",
    {
      project,
      role: "roles/artifactregistry.reader",
      member: pulumi.interpolate`serviceAccount:${gkeNodepoolSa.email}`,
    },
    provider(gcp_provider, dependsOn([resource_manager_api], options))
  );

  // Create the node pools.  (Sets of VMs that run containers)
  const nodePools: NodePool[] = [];

  // Create a nodepool for regular CPU workloads
  nodePools.push(
    new gcp.container.NodePool(
      "gke-nodepool",
      {
        cluster: cluster.id,
        nodeCount: scaledDown ? 0 : nodeCountCpu,
        nodeConfig: {
          machineType: "n1-standard-16",
          oauthScopes: [
            "https://www.googleapis.com/auth/cloud-platform",
            "https://www.googleapis.com/auth/devstorage.read_only",
          ],
          serviceAccount: gkeNodepoolSa.email,
          diskSizeGb: 512,
        },
      },
      dependsOn([nat], options)
    )
  );

  // Create a nodepool for GPU workloads
  nodePools.push(
    new gcp.container.NodePool(
      "gke-nodepool-gpu-exclusive",
      {
        cluster: cluster.id,
        nodeCount: scaledDown ? 0 : nodeCountGpu,
        nodeConfig: {
          machineType: "n1-standard-8",
          diskSizeGb: 512,
          oauthScopes: ["https://www.googleapis.com/auth/cloud-platform"],
          serviceAccount: gkeNodepoolSa.email,
          taints: [
            {
              effect: "NO_SCHEDULE",
              key: "nvidia.com/gpu",
              value: "present",
            },
          ],
          guestAccelerators: [
            {
              count: 4,
              type: "nvidia-tesla-t4",
              gpuDriverInstallationConfig: {
                gpuDriverVersion: "DEFAULT",
              },
            },
          ],
        },
      },
      dependsOn([nat], options)
    )
  );

  const clusterKubeconfig = pulumi
    .all([cluster.name, cluster.endpoint, cluster.masterAuth])
    .apply(([name, endpoint, masterAuth]) => {
      const context = `${project}_${region}_${name}`;
      return `apiVersion: v1
clusters:
- cluster:
    certificate-authority-data: ${masterAuth.clusterCaCertificate}
    server: https://${endpoint}
  name: ${context}
contexts:
- context:
    cluster: ${context}
    user: ${context}
  name: ${context}
current-context: ${context}
kind: Config
preferences: {}
users:
- name: ${context}
  user:
    exec:
      apiVersion: client.authentication.k8s.io/v1beta1
      command: gke-gcloud-auth-plugin
      installHint: Install gke-gcloud-auth-plugin for use with kubectl by following
        https://cloud.google.com/blog/products/containers-kubernetes/kubectl-auth-changes-in-gke
      provideClusterInfo: true
`;
    });

  const k8s_provider = new kubernetes.Provider(
    "gke",
    { kubeconfig: clusterKubeconfig },
    { dependsOn: nodePools }
  );

  new gcp.artifactregistry.Repository(
    "registry",
    {
      description: "Registry for pipelayer docker containers",
      // dockerConfig: {
      //   immutableTags: true,
      // },
      format: "DOCKER",
      location: region,
      repositoryId: "pipelayer",
    },
    dependsOn([artifact_api], options)
  );

  new kubernetes.storage.v1.StorageClass(
    "filestore-pipelayer",
    {
      metadata: {
        name: "filestore-pipelayer",
      },
      provisioner: "filestore.csi.storage.gke.io",
      volumeBindingMode: "Immediate",
      allowVolumeExpansion: true,
      parameters: {
        tier: "enterprise",
        multishare: "true",
        "max-volume-size": "128Gi",
        network: network.name,
      },
    },
    provider(k8s_provider, options)
  );

  return {
    provided: [
      {
        type: "provider-kubernetes",
        resource: k8s_provider,
      },
    ],
  } as ProvidedResourceReturn;
};

const Block: BlockConfig<GoogleCloudConfiguration> = {
  name: "GCP",
  type: "cloud",
  label: "GCP",
  image: { data: logo, width: 3840, height: 2160 },
  program,
  prepare,
  provides: ["provider-kubernetes"],
  configuration: [
    {
      name: "gcp",
      fields: [
        {
          title: "Scaled down",
          name: "scaledDown",
          description: "If enabled scales down to 0 nodes.",
          default: false,
          type: "boolean",
        },
        {
          name: "projectId",
          title: "Project Id",
          description: "The unique, user-assigned ID of the Project.",
          type: "text",
          required: true,
          regexp: /^[a-z][-a-z0-9]{4,28}[a-z0-9]{1}$/gm,
        },
        {
          name: "credentials@private",
          title: "Credentials (JSON)",
          type: "comment",
          required: true,
          description: "Credentials JSON file contents used for authentication",
        },
        {
          title: "Region",
          name: "region",
          description: "Geographical region where to host pipelayer resources.",
          type: "text",
          required: true,
          maxLength: 255,
        },
        {
          title: "Location",
          name: "location",
          description:
            "Specific geographical location where to host resources when a region is not suitable.",
          type: "text",
          required: true,
          maxLength: 255,
        },
        {
          title: "Cluster name",
          name: "clusterName",
          description: "Name of kubernetes cluster to use",
          default: "pipelayer-k8s",
          type: "text",
          required: true,
          maxLength: 255,
        },
        {
          title: "CPU node count",
          name: "nodeCountCpu",
          description: "How many nodes to include in the CPU each pool.",
          default: 3,
          type: "number",
          required: true,
        },
        {
          title: "GPU node count",
          name: "nodeCountGpu",
          description: "How many nodes to include in the GPU each pool.",
          default: 3,
          type: "number",
          required: true,
        },
      ],
    },
  ],
};

export default Block;
