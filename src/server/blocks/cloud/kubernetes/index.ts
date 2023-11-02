import * as kubernetes from "@pulumi/kubernetes";

import {
  type BlockConfig,
  type BlockConfiguration,
  type ProvidedResourceReturn,
} from "~/types";

import logo from "./logo.png";

type KubernetesConfiguration = BlockConfiguration<{
  useLocal: boolean;
  kubeconfig: string;
  namespace: string;
}>;

const program = async (
  config: KubernetesConfiguration
  // eslint-disable-next-line @typescript-eslint/require-await
) => {
  const { kubeconfig, namespace } = config;

  const k8s_provider = new kubernetes.Provider("k8s", {
    kubeconfig,
    namespace,
  });

  new kubernetes.core.v1.Namespace("k8s-namespace", {
    metadata: { name: namespace },
  }, { provider: k8s_provider});

  // consider using rook.io or something
  // new kubernetes.storage.v1.StorageClass(
  //   "pipelayer-readwritemany",
  //   {
  //     metadata: {
  //       name: "pipelayer-readwritemany",
  //     },
  //     provisioner: "filestore.csi.storage.gke.io",
  //     volumeBindingMode: "Immediate",
  //     allowVolumeExpansion: true,
  //     parameters: {
  //       tier: "enterprise",
  //       multishare: "true",
  //       "max-volume-size": "128Gi",
  //       network: network.name,
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

const Block: BlockConfig<KubernetesConfiguration> = {
  name: "Kubernetes",
  type: "cloud",
  label: "Kubernetes",
  image: { data: logo, width: 3840, height: 2160 },
  program,
  provides: ["provider-kubernetes"],
  configuration: [
    {
      name: "gcp",
      fields: [

        {
          name: "namespace",
          title: "Namespace",
          type: "text",
          required: true,
          description: "Kubernetes namespace to create resources into.",
        },

        {
          name: "useLocal",
          title: "Use local kubectl context",
          type: "boolean",
          required: true,
          description: "Selected context is controlled manually by kubectl",
        },

        {
          name: "kubeconfig@private",
          title: "kubeconfig (JSON)",
          type: "comment",
          required: true,
          description:
            "Use `kubectl config view --minify --flatten` to generate",
          visibleIf: "{useLocal} = 'false'",
        },
      ],
    },
  ],
};

export default Block;
