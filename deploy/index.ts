import * as pulumi from "@pulumi/pulumi";
import * as gcp from "@pulumi/gcp";
import * as kubernetes from "@pulumi/kubernetes";
import * as certmanager from "@pulumi/kubernetes-cert-manager";
import * as docker from "@pulumi/docker";

import { config } from "dotenv";

config({ path: "../.env" });

const location = "northamerica-northeast1-c";
const region = "northamerica-northeast1";
const project = "phx-lucbeliveau";

const URL = "pipelayer.science.cloud-nuage.canada.ca";

// Enable Artifact Registry API
const registry_api = new gcp.projects.Service("artifact-api", {
  disableDependentServices: true,
  project,
  service: "artifactregistry.googleapis.com",
});

// Enable Container API
const kubernetes_api = new gcp.projects.Service("kubernetes-api", {
  disableDependentServices: true,
  project,
  service: "container.googleapis.com",
});

// Create a new network
const network = new gcp.compute.Network("pipelayer-gke-network", {
  autoCreateSubnetworks: false,
  description: "VPC for cluster",
});

// Create a new subnet in the network created above
const subnet = new gcp.compute.Subnetwork("pipelayer-gke-subnet", {
  ipCidrRange: "10.128.0.0/12",
  network: network.id,
  privateIpGoogleAccess: true,
});

//create CloudRouter to give private GKE Cluster Nodes access to the internet -> Docker Hub
const router = new gcp.compute.Router("gke-nat", {
  network: network.id,
});

//create CloudNAT to give private GKE Cluster Nodes access to the internet -> Docker Hub
new gcp.compute.RouterNat("gke-nat", {
  router: router.name,
  natIpAllocateOption: "AUTO_ONLY",
  sourceSubnetworkIpRangesToNat: "ALL_SUBNETWORKS_ALL_IP_RANGES",
});

// Create a new GKE cluster with filestore CSI driver
const cluster = new gcp.container.Cluster("pipelayer-system", {
  binaryAuthorization: {
    evaluationMode: "PROJECT_SINGLETON_POLICY_ENFORCE",
  },
  datapathProvider: "ADVANCED_DATAPATH",
  description: "Pipelayer System Cluster",
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
  minMasterVersion: "1.27.4-gke.900",
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
});

// Create a service account for the node pool
const gkeNodepoolSa = new gcp.serviceaccount.Account("gke-nodepool-sa", {
  accountId: pulumi.interpolate`${cluster.name}-np`,
  displayName: "Nodepool 1 Service Account",
});

new gcp.projects.IAMMember("allow_image_pull", {
  project,
  role: "roles/artifactregistry.reader",
  member: pulumi.interpolate`serviceAccount:${gkeNodepoolSa.email}`,
});

// Create a nodepool for the GKE cluster
const nodepool = new gcp.container.NodePool("gke-nodepool", {
  cluster: cluster.id,
  nodeCount: 1,
  nodeConfig: {
    machineType: "n1-standard-16",
    oauthScopes: [
      "https://www.googleapis.com/auth/cloud-platform",
      "https://www.googleapis.com/auth/devstorage.read_only",
    ],
    serviceAccount: gkeNodepoolSa.email,
    diskSizeGb: 512,
  },
});

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
  { dependsOn: [nodepool, kubernetes_api] }
);

const registry = new gcp.artifactregistry.Repository(
  "pipelayer-registry",
  {
    description: "Registry for pipelayer docker containers",
    // dockerConfig: {
    //   immutableTags: true,
    // },
    format: "DOCKER",
    location: region,
    repositoryId: "pipelayer-deployment",
  },
  { dependsOn: [registry_api] }
);

const imageName = pulumi.interpolate`${registry.location}-docker.pkg.dev/${registry.project}/${registry.name}/pipelayer:latest`;

const image = new docker.Image(
  "pipelayer",
  {
    imageName,
    build: {
      platform: "linux/amd64",
      context: "..",
      dockerfile: "../Dockerfile",
    },
  },
  { dependsOn: [registry] }
);

// Create a static external IP address
const ip_address = new gcp.compute.GlobalAddress("pipelayer-ip-address", {});

// Create DNS zone for pipelayer
const dns_zone = new gcp.dns.ManagedZone(
  "pipelayer-science-cloud-nuage-canada-ca",
  {
    description: "Pipelayer DNS Zone",
    dnsName: `${URL}.`,
  }
);

const dnsRecord = new gcp.dns.RecordSet("frontendRecordSet", {
  name: pulumi.interpolate`${dns_zone.dnsName}`,
  type: "A",
  ttl: 300,
  managedZone: dns_zone.name,
  rrdatas: [ip_address.address],
});

new gcp.dns.RecordSet("pipesRecordSet", {
  name: pulumi.interpolate`dev.${dns_zone.dnsName}`,
  type: "A",
  ttl: 300,
  managedZone: dns_zone.name,
  rrdatas: [ip_address.address],
});

// // Install cert-manager into our cluster.
const cert_man = new certmanager.CertManager(
  "cert-manager",
  {
    installCRDs: true,
    helmOptions: {
      namespace: "default",
    },
  },
  { provider: k8s_provider }
);

const b64 = (str?: string) => Buffer.from(str || "").toString("base64");

const secrets = new kubernetes.core.v1.Secret(
  "pipelayer-secrets",
  {
    data: {
      DATABASE_URL: b64("file:/state/db.sqlite"),
      PULUMI_STATE_URL: b64("file:/state/pipelayer.state"),
      NEXTAUTH_SECRET: b64(process.env.NEXTAUTH_SECRET),
      NEXTAUTH_URL: b64(`https://${URL}/`),
      GITHUB_CLIENT_ID: b64(process.env.GITHUB_CLIENT_ID),
      GITHUB_CLIENT_SECRET: b64(process.env.GITHUB_CLIENT_SECRET),
      GOOGLE_CLIENT_ID: b64(process.env.GOOGLE_CLIENT_ID),
      GOOGLE_CLIENT_SECRET: b64(process.env.GOOGLE_CLIENT_SECRET),
    },
  },
  { provider: k8s_provider }
);

const pvc = new kubernetes.core.v1.PersistentVolumeClaim(
  "pipelayer-state-vol",
  {
    metadata: {
      annotations: {
        "pulumi.com/skipAwait": "true",
      },
    },
    spec: {
      accessModes: ["ReadWriteOnce"],
      resources: {
        requests: {
          storage: "16Gi",
        },
      },
    },
  },
  { provider: k8s_provider }
);

const labels = { pipelayer: "system" };
new kubernetes.apps.v1.Deployment(
  "pipelayer",
  {
    metadata: {
      name: "pipelayer",
      labels,
    },
    spec: {
      selector: { matchLabels: labels },
      replicas: 1,
      template: {
        metadata: { labels },
        spec: {
          securityContext: {
            runAsGroup: 0,
            runAsUser: 0,
          },
          enableServiceLinks: false,
          restartPolicy: "Always",
          volumes: [
            {
              name: "state",
              persistentVolumeClaim: {
                claimName: pvc.metadata.name,
              },
            },
          ],
          containers: [
            {
              name: "pipelayer",
              image: image.repoDigest,
              envFrom: [
                {
                  secretRef: {
                    name: secrets.metadata.name,
                  },
                },
              ],
              volumeMounts: [{ name: "state", mountPath: "/state" }],
            },
          ],
        },
      },
    },
  },
  { provider: k8s_provider }
);

new kubernetes.core.v1.Service(
  "pipelayer",
  {
    metadata: {
      name: "pipelayer",
    },
    spec: {
      selector: labels,
      ports: [{ name: "http", port: 3000 }],
    },
  },
  { provider: k8s_provider }
);

const frontendconfig = new kubernetes.apiextensions.CustomResource(
  "pipelayer-frontendconfig",
  {
    apiVersion: "networking.gke.io/v1beta1",
    kind: "FrontendConfig",
    metadata: {
      name: "pipelayer-frontendconfig",
    },
    spec: {
      redirectToHttps: {
        enabled: true,
        responseCodeName: "MOVED_PERMANENTLY_DEFAULT",
      },
    },
  },
  { provider: k8s_provider }
);

new kubernetes.apiextensions.CustomResource(
  "letsencrypt-production",
  {
    apiVersion: "cert-manager.io/v1",
    kind: "ClusterIssuer",
    metadata: {
      name: "letsencrypt-production",
    },
    spec: {
      acme: {
        server: "https://acme-v02.api.letsencrypt.org/directory",
        email: "luc.belliveau@canada.ca",
        privateKeySecretRef: {
          name: "letsencrypt-production",
        },
        solvers: [
          {
            http01: {
              ingress: {
                class: "ingress-gce",
              },
            },
          },
        ],
      },
    },
  },
  { provider: k8s_provider, dependsOn: [cert_man] }
);

const fake_secret = new kubernetes.core.v1.Secret(
  "pipelayer-ssl",
  {
    metadata: {
      name: "pipelayer-ssl",
    },
    type: "kubernetes.io/tls",
    stringData: {
      "tls.key": "",
      "tls.crt": "",
    },
  },
  { provider: k8s_provider, ignoreChanges: ["data"] }
);

new kubernetes.networking.v1.Ingress(
  "pipelayer",
  {
    metadata: {
      name: "pipelayer",
      labels,
      annotations: {
        "kubernetes.io/ingress.global-static-ip-name": pulumi.interpolate`${ip_address.name}`,
        "cert-manager.io/cluster-issuer": "letsencrypt-production",
        "kubernetes.io/ingress.class": "gce",
        "acme.cert-manager.io/http01-edit-in-place": "true",
        "networking.gke.io/v1beta1.FrontendConfig": pulumi.interpolate`${frontendconfig.metadata.name}`,
        "kubernetes.io/ingress.allow-http": "true",
      },
    },
    spec: {
      tls: [{ secretName: "pipelayer-ssl", hosts: [URL, `dev.${URL}`] }],
      defaultBackend: {
        service: { name: "pipelayer", port: { number: 3000 } },
      },
    },
  },
  { provider: k8s_provider, dependsOn: [fake_secret, dnsRecord] }
);

const output = {
  nameServers: dns_zone.nameServers,
};

export default output;
