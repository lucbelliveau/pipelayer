import * as kubernetes from "@pulumi/kubernetes";

import {
  type BlockConfiguration,
  type BlockConfig,
  type ProvidedResourceReturn,
  type ProvidedResource,
  type StackContext,
} from "~/types";

import logo from "./logo.png";
import { type ProviderResource, type ResourceOptions } from "@pulumi/pulumi";
import { provider } from "../utils";

type AvroConfiguration = BlockConfiguration<{
  kubernetes: string;
  key: string;
  value: string;
}>;

const program = async (
  config: AvroConfiguration,
  links: ProvidedResource[],
  context: StackContext,
  options?: ResourceOptions
  // eslint-disable-next-line @typescript-eslint/require-await
) => {
  const k8s_provider = links.find((l) => l.type === "provider-kubernetes")
    ?.resource as ProviderResource;
  if (!k8s_provider)
    throw new Error("Data contracts require a configured kubernetes cluster.");

  const { name, key, value } = config;
  const configmap = new kubernetes.core.v1.ConfigMap(
    name.toLowerCase(),
    {
      data: {
        "key.avsc": key,
        "val.avsc": value,
      },
    },
    provider(k8s_provider, options)
  );

  return {
    provided: [
      {
        type: "data-contract",
        resource: configmap,
      },
    ],
  } as ProvidedResourceReturn;
};

const Block: BlockConfig<AvroConfiguration> = {
  name: "avro",
  label: "Data Contract",
  type: "avro",
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  image: { data: logo, width: 140, height: 140 },
  program: program,
  provides: ["data-contract"],
  configuration: [
    {
      name: "pipelayer",
      title: "Pipelayer",
      fields: [
        {
          name: "kubernetes",
          title: "Kubernetes",
          type: "multiple",
          provides: "provider-kubernetes",
          required: true,
          direction: "out",
        },
      ],
    },
    {
      name: "avro",
      title: "Avro",
      fields: [
        {
          name: "key",
          title: "Key",
          description: "Avro Key Definition",
          type: "comment",
          required: true,
        },
        {
          name: "value",
          title: "Value",
          description: "Avro Value Definition",
          type: "comment",
          required: true,
        },
      ],
    },
  ],
};

export default Block;
