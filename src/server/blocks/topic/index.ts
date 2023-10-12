import {
  type BlockConfiguration,
  type BlockConfig,
  type ProvidedResource,
  type ProvidedResourceReturn,
  type StackContext,
} from "~/types";

import logo from "./logo.svg";
import { type ProviderResource, type ResourceOptions } from "@pulumi/pulumi";
import * as kafka from "@pulumi/kafka";
import { deletedWith, provider } from "../utils";

type PlatformTopicConfiguration = BlockConfiguration<{
  kafka: string;
  dataContract: string;
  replicationFactor: number;
  partitions: number;
}>;

const program = async (
  config: PlatformTopicConfiguration,
  links: ProvidedResource[],
  context: StackContext,
  options?: ResourceOptions
  // eslint-disable-next-line @typescript-eslint/require-await
) => {
  const { name, replicationFactor, partitions } = config;

  const kafka_provider = links.find((l) => l.type === "provider-kafka");
  if (!kafka_provider) {
    console.error("Topics require a configured kafka cluster.");
    return;
  }

  const data_contract = links.find((l) => l.type === "data-contract");
  if (!data_contract) {
    console.error("Topics require a data contract.");
    return;
  }

  const topic = new kafka.Topic(
    name,
    {
      replicationFactor,
      partitions,
    },
    deletedWith(
      kafka_provider.resource,
      provider(kafka_provider.resource as ProviderResource, options)
    )
  );

  return {
    provided: [
      {
        type: "kafka-topic",
        references: [kafka_provider, data_contract],
        resource: topic,
      },
    ],
  } as ProvidedResourceReturn;
};

const Block: BlockConfig<PlatformTopicConfiguration> = {
  name: "topic",
  label: "Topic",
  type: "topic",
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  image: { data: logo, width: 140, height: 140 },
  program: program,
  provides: ["kafka-topic"],
  configuration: [
    {
      name: "Topic",
      fields: [
        {
          name: "kafka",
          title: "Kafka",
          type: "dropdown",
          provides: "provider-kafka",
          required: true,
          direction: "in",
        },
        {
          name: "dataContract",
          title: "Data contract",
          type: "dropdown",
          provides: "data-contract",
          required: true,
          direction: "in",
        },
        {
          name: "replicationFactor",
          title: "Replication Factor",
          description:
            "In Kafka, all topics must have a replication factor configuration value. The replication factor includes the total number of replicas including the leader, which means that topics with a replication factor of one (1) are topics that are not replicated. All reads and writes go to the leader of the partition.",
          type: "number",
          required: true,
          min: 1,
          max: 99,
          default: 3,
        },
        {
          name: "partitions",
          title: "Partitions",
          description:
            "Kafka’s topics are divided into several partitions. While the topic is a logical concept in Kafka, a partition is the smallest storage unit that holds a subset of records owned by a topic. Each partition is a single log file where records are written to it in an append-only fashion.",
          type: "number",
          required: true,
          min: 1,
          max: 99,
          default: 8,
        },
      ],
    },
  ],
};

export default Block;
