import { type ProviderResource, type ResourceOptions } from "@pulumi/pulumi";
import { Document } from "yaml";
import * as kubernetes from "@pulumi/kubernetes";
import * as pulumi from "@pulumi/pulumi";

import {
  type ProvidedResource,
  type BlockConfig,
  type BlockConfiguration,
  type StackContext,
} from "~/types";
import logo from "./logo.png";
import { createDeployment } from "../..";
import { type ConfigMap } from "@pulumi/kubernetes/core/v1";
import { deletedWith, provider } from "../../utils";

type DedupByIdWorkerConfiguration = BlockConfiguration<{
  kubernetes: string;
  postgres: string;
}>;

const image =
  "northamerica-northeast1-docker.pkg.dev/phx-lucbeliveau/gphin/dedup_by_id";

const program = async (
  config: DedupByIdWorkerConfiguration,
  links: ProvidedResource[],
  context: StackContext,
  options?: ResourceOptions
  //eslint-disable-next-line @typescript-eslint/require-await
) => {
  const name = config.name.toLowerCase().replaceAll(" ", "_");
  const k8s_name = name.replaceAll("_", "-");
  const kafka = links
    .find((l) => l.type === "kafka-topic")
    ?.references?.find((r) => r.type === "provider-kafka");
  if (!kafka || kafka.type !== "provider-kafka")
    throw new Error("Topic without linked kafka.");

  const postgres = links.find((l) => l.type === "postgres") || [];
  if (!postgres || !("type" in postgres) || postgres.type !== "postgres")
    throw new Error("No postgres defined.");

  const k8s_provider = links.find((l) => l.type === "provider-kubernetes")
    ?.resource as ProviderResource;
  if (!k8s_provider)
    throw new Error("Workers require a configured kubernetes cluster.");

  const data_contracts = links
    .filter((l) => l.type === "kafka-topic")
    .reduce((p, c) => {
      const dc = c.references?.find((r) => r.type === "data-contract");
      if (dc && !p.includes(dc)) p.push(dc);
      return p;
    }, [] as ProvidedResource[]);

  if (data_contracts.length > 1)
    throw new Error("Multiple data contracts not yet supported.");

  const dc =
    data_contracts.length === 1
      ? (data_contracts[0]?.resource as ConfigMap)
      : undefined;

  const doc = pulumi
    .all([
      kafka.configuration.broker.host,
      kafka.configuration.broker.port,
      kafka.configuration.schema_registry.host,
      kafka.configuration.schema_registry.port,
      postgres.configuration.host,
      postgres.configuration.port,
      postgres.configuration.username,
      postgres.configuration.password,
    ])
    .apply(
      ([
        broker_host,
        broker_port,
        schema_registry_host,
        schema_registry_port,
        host,
        port,
        user,
        pass,
      ]) =>
        new Document({
          main: {
            steps: [
              {
                dedup_by_id: {
                  consumer: {
                    broker_host,
                    broker_port,
                    schema_registry_host,
                    schema_registry_port,
                    poll_time: "1.0",
                    auto_offset_reset: "earliest",
                    consumer_group_id: "dedup_by_id",
                    source_topic: config["consumer.topics"]?.map((topic) => ({
                      [topic]: {
                        avro_key_schema_file: "/data-contracts/key.avsc",
                        avro_val_schema_file: "/data-contracts/val.avsc",
                      },
                    })),
                  },
                  worker: {
                    postgres: { host, port, user, pass, database: "postgres" },
                  },
                  producer: {
                    broker_host,
                    broker_port,
                    schema_registry_host,
                    schema_registry_port,
                    poll_time: "0.0",
                    destination_topic: config["producer.topics"]?.map(
                      (topic) => ({
                        [topic]: {
                          avro_key_schema_file: "/data-contracts/key.avsc",
                          avro_val_schema_file: "/data-contracts/val.avsc",
                        },
                      })
                    ),
                  },
                },
              },
            ],
          },
        }).toString()
    );

  const commonOptions = deletedWith(
    k8s_provider,
    provider(k8s_provider, options)
  );

  const configmap = new kubernetes.core.v1.ConfigMap(
    `${config.id}-workflow`,
    {
      data: {
        "workflow.yaml": doc,
      },
    },
    commonOptions
  );

  createDeployment(
    {
      // id: config.id,
      name: k8s_name,
      enableServiceLinks: false,
      noService: true,
      containers: [
        {
          image,
          volumes: [
            {
              mountPath: "/workflow.yaml",
              name: "workflow",
              configMap: configmap.metadata.name,
              subPath: "workflow.yaml",
            },
            {
              mountPath: "/data-contracts",
              name: "data-contracts",
              configMap: dc?.metadata.name,
            },
          ],
        },
      ],
    },
    commonOptions
  );
};

const Block: BlockConfig<DedupByIdWorkerConfiguration> = {
  name: "dedup_by_id",
  label: "Debup by ID",
  type: "worker",
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  image: { data: logo, width: 140, height: 140 },
  program,
  configuration: [
    {
      name: "pipelayer",
      title: "Pipelayer",
      fields: [
        {
          name: "kubernetes",
          title: "Kubernetes Cluster",
          type: "dropdown",
          provides: "provider-kubernetes",
          required: true,
          direction: "in",
        },
        {
          name: "postgres",
          title: "Postgres",
          type: "dropdown",
          provides: "postgres",
          required: true,
          direction: "in",
        },
      ],
    },
    {
      name: "consumer",
      title: "Consumer",
      fields: [
        {
          name: "consumer.topics",
          title: "Topics",
          description: "Which topics will this worker read messages from?",
          type: "multiple",
          provides: "kafka-topic",
          direction: "in",
        },
      ],
    },
    {
      name: "producer",
      title: "Producer",
      fields: [
        {
          name: "producer.topics",
          title: "Topics",
          description: "To which topics will this worker write messages to?",
          type: "multiple",
          provides: "kafka-topic",
          direction: "out",
        },
      ],
    },
  ],
};

export default Block;
