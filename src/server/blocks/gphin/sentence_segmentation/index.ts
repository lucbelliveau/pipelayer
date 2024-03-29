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

type SentenceSegmentationWorkerConfiguration = BlockConfiguration<{
  kubernetes: string;
}>;

const image =
  "northamerica-northeast1-docker.pkg.dev/phx-lucbeliveau/gphin/sentence_segmentation";

const program = async (
  config: SentenceSegmentationWorkerConfiguration,
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
    ])
    .apply(
      ([
        broker_host,
        broker_port,
        schema_registry_host,
        schema_registry_port,
      ]) =>
        new Document({
          main: {
            steps: [
              {
                sentence_segmentation: {
                  consumer: {
                    broker_host,
                    broker_port,
                    schema_registry_host,
                    schema_registry_port,
                    poll_time: "1.0",
                    auto_offset_reset: "earliest",
                    consumer_group_id: "sentence_segmentation",
                    source_topic: config["consumer.topics"]?.map((topic) => ({
                      [topic]: {
                        avro_key_schema_file: "/data-contracts/key.avsc",
                        avro_val_schema_file: "/data-contracts/val.avsc",
                      },
                    })),
                  },
                  worker: {
                    language_map: [
                      { ar: "ar" },
                      { en: "en" },
                      { es: "es" },
                      { fr: "fr" },
                      { pt: "pt" },
                      { ru: "ru" },
                      { "zh,zhcn": "zh-hans" },
                      { zhtw: "zh-hant" },
                    ],
                    max_length: 512,
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

const Block: BlockConfig<SentenceSegmentationWorkerConfiguration> = {
  name: "sentence_segmentation",
  label: "Sentence segmentation",
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
