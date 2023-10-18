import type * as pulumi from "@pulumi/pulumi";
import * as kubernetes from "@pulumi/kubernetes";

import { type ResourceOptions } from "@pulumi/pulumi";
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
  kubeconfig: string;
}>;

const program = async (
  config: GoogleCloudConfiguration,
  // eslint-disable-next-line @typescript-eslint/require-await
) => {
  const {
    kubeconfig
  } = config;

  const k8s_provider = new kubernetes.Provider(
    "gke",
    { kubeconfig },
  );

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

const Block: BlockConfig<GoogleCloudConfiguration> = {
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
          name: "kubeconfig@private",
          title: "kubeconfig (JSON)",
          type: "comment",
          required: true,
          description: "Use `kubectl config view --minify --flatten` to generate",
        },
      ],
    },
  ],
};

export default Block;
