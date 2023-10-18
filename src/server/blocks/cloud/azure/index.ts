import * as pulumi from "@pulumi/pulumi";
import * as azure from "@pulumi/azure-native";
import * as kubernetes from "@pulumi/kubernetes";
import { local } from "@pulumi/command";

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
  resourceGroupName: string;
  tenantId: string;
  subscriptionId: string;
  appid: string;
  password: string;

  location: string;
  clusterName?: string;

  nodeCountCpu: number;
  nodeCountGpu: number;
  scaledDown: boolean;
}>;

const prepare: StackPrepare<GoogleCloudConfiguration> = async (
  stack: pulumi.automation.Stack,
  ctx: StackContext,
  config: GoogleCloudConfiguration
) => {
  const { location } = config;
  await stack.setConfig("azure-native:location", { value: location });
};

const program = async (
  config: GoogleCloudConfiguration,
  links: ProvidedResource[],
  ctx: StackContext,
  options: ResourceOptions | undefined
  // eslint-disable-next-line @typescript-eslint/require-await
) => {
  const {
    resourceGroupName,
    appid,
    password,
    tenantId,
    subscriptionId,
    clusterName,
    location,
    nodeCountCpu,
    nodeCountGpu,
    scaledDown,
  } = config;
  const pipelayerClusterName = clusterName;

  const Ephemerality = "1 day";

  const tags = {
    ClientOrganization: "Ph",
    Environment: "Sandbox",
    Ephemerality,
  };

  const azure_provider = new azure.Provider("azure-provider", {
    subscriptionId,
    tenantId,
    clientId: appid,
    clientSecret: password,
  });

  const azure_options = provider(azure_provider, options);

  const rg = new azure.resources.ResourceGroup(resourceGroupName);

  // const factiva_storage = new azure.storage.StorageAccount(
  //   "factiva",
  //   {
  //     location,
  //     resourceGroupName: rg.name,
  //     kind: azure.storage.Kind.StorageV2,
  //     sku: {
  //       name: azure.storage.SkuName.Standard_LRS,
  //     },
  //     tags,
  //   },
  //   azure_options
  // );

  // new azure.storage.BlobContainer(
  //   "factiva-articles",
  //   {
  //     containerName: "articles",
  //     accountName: factiva_storage.name,
  //     resourceGroupName: rg.name,
  //   },
  //   azure_options
  // );

  const cluster = new azure.containerservice.ManagedCluster(
    "k8s-cluster",
    {
      resourceName: pipelayerClusterName,
      location,
      resourceGroupName: rg.name,
      dnsPrefix: "gphin",
      identity: {
        type: azure.containerservice.ResourceIdentityType.SystemAssigned,
      },
      agentPoolProfiles: [
        {
          name: "cpu",
          count: scaledDown ? 0 : nodeCountCpu,
          mode: azure.containerservice.AgentPoolMode.System,
          maxPods: 110,
          osDiskSizeGB: 512,
          osType: azure.containerservice.OSType.Linux,
          type: azure.containerservice.AgentPoolType.VirtualMachineScaleSets,
          vmSize: "Standard_DS2_v2",
        },
        // {
        //   name: "gpu",
        //   count: scaledDown ? 0 : nodeCountGpu,
        //   mode: azure.containerservice.AgentPoolMode.User,
        //   maxPods: 110,
        //   osDiskSizeGB: 512,
        //   osType: azure.containerservice.OSType.Linux,
        //   type: azure.containerservice.AgentPoolType.VirtualMachineScaleSets,
        //   vmSize: "standard_nc6s_v3",
        //   nodeTaints: ["sku=gpu:NoSchedule"],
        //   workloadRuntime: "UseGPUDedicatedVHD",
        // },
      ],
      // kubernetesVersion: "1.28.0",
      tags,
    },
    azure_options
  );

  // new local.Command(
  //   "create-gpu-node-pool",
  //   {
  //     create: pulumi.interpolate`az aks nodepool add --resource-group ${rg.name} --cluster-name ${cluster.name} --name gpu --node-count ${nodeCountGpu} --node-vm-size standard_nc6s_v3 --node-taints sku=gpu:NoSchedule --aks-custom-headers UseGPUDedicatedVHD=true`,
  //     delete: "az aks nodepool delete gpu",
  //   },
  //   { deleteBeforeReplace: true }
  // );

  const creds = azure.containerservice.listManagedClusterUserCredentialsOutput(
    {
      resourceGroupName: rg.name,
      resourceName: cluster.name,
    },
    azure_options
  );

  let kubeconfig: pulumi.Output<string> | null = null;
  if (creds.kubeconfigs) {
    const config = creds.kubeconfigs[0];
    if (config) {
      kubeconfig = config.value.apply((enc: string) =>
        Buffer.from(enc, "base64").toString()
      );
    }
  }

  if (kubeconfig === null) throw new Error("Unable to create kubeconfig");

  const k8s_provider = new kubernetes.Provider(
    "gke",
    { kubeconfig },
    { dependsOn: [cluster] }
  );

  new kubernetes.storage.v1.StorageClass(
    "pipelayer-readwritemany",
    {
      metadata: {
        name: "pipelayer-readwritemany",
      },
      provisioner: "file.csi.azure.com",
      volumeBindingMode: "Immediate",
      allowVolumeExpansion: true,
      parameters: {
        skuName: "Standard",
      },
    },
    provider(k8s_provider, options)
  );

  // Setup NVIDIA drivers
  // const gpu_namespace = new kubernetes.core.v1.Namespace("gpu-resources", {
  //   metadata: { name: "gpu-resources" },
  // });

  // new kubernetes.apps.v1.DaemonSet(
  //   "nvidia-drivers",
  //   {
  //     metadata: {
  //       name: "nvidia-device-plugin-daemonset",
  //       namespace: gpu_namespace.metadata.name,
  //     },
  //     spec: {
  //       selector: {
  //         matchLabels: {
  //           name: "nvidia-device-plugin-ds",
  //         },
  //       },
  //       updateStrategy: {
  //         type: "RollingUpdate",
  //       },
  //       template: {
  //         metadata: {
  //           annotations: {
  //             "scheduler.alpha.kubernetes.io/critical-pod": "",
  //           },
  //           labels: {
  //             name: "nvidia-device-plugin-ds",
  //           },
  //         },
  //         spec: {
  //           tolerations: [
  //             { key: "CriticalAddonsOnly", operator: "Exists" },
  //             {
  //               key: "nvidia.com/gpu",
  //               operator: "Exists",
  //               effect: "NoSchedule",
  //             },
  //             {
  //               key: "sku",
  //               operator: "Equal",
  //               value: "gpu",
  //               effect: "NoSchedule",
  //             },
  //           ],
  //           containers: [
  //             {
  //               image: "mcr.microsoft.com/oss/nvidia/k8s-device-plugin:v0.14.1",
  //               name: "nvidia-device-plugin-ctr",
  //               securityContext: {
  //                 allowPrivilegeEscalation: false,
  //                 capabilities: { drop: ["ALL"] },
  //               },
  //               volumeMounts: [
  //                 {
  //                   name: "device-plugin",
  //                   mountPath: " /var/lib/kubelet/device-plugins",
  //                 },
  //               ],
  //             },
  //           ],
  //           volumes: [
  //             {
  //               name: "device-plugin",
  //               hostPath: { path: "/var/lib/kubelet/device-plugins" },
  //             },
  //           ],
  //         },
  //       },
  //     },
  //   },
  //   provider(k8s_provider, options)
  // );

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
  name: "Azure",
  type: "cloud",
  label: "Azure",
  image: { data: logo, width: 512, height: 396 },
  program,
  prepare,
  provides: ["provider-kubernetes"],
  configuration: [
    {
      name: "azure",
      fields: [
        {
          name: "appid",
          title: "Service principal",
          description: "Service principal account",
          type: "text",
          required: true,
        },
        {
          name: "password@private",
          title: "Password",
          type: "text",
          inputType: "password",
          required: true,
          description: "Service Principal password",
        },
        {
          title: "Scaled down",
          name: "scaledDown",
          description: "If enabled scales down to 0 nodes.",
          default: false,
          type: "boolean",
        },
        {
          name: "resourceGroupName",
          title: "Resource group name",
          description: "Azure resource group to create resources in.",
          type: "text",
          required: true,
        },
        {
          name: "tenantId@private",
          title: "Tenant id",
          description: "Azure tenant id.",
          type: "text",
          required: true,
        },
        {
          name: "subscriptionId@private",
          title: "Subscription id",
          description: "Azure subscription id.",
          type: "text",
          required: true,
        },
        {
          title: "Location",
          name: "location",
          description: "Geographical location where to host resources.",
          type: "text",
          required: true,
          maxLength: 255,
          default: "canadacentral",
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
