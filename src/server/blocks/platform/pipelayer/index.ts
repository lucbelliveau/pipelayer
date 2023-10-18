import {
  type StackContext,
  type BlockConfig,
  type BlockConfiguration,
  type ProvidedResource,
} from "~/types";

import deployKafka from "./programs/kafka";
import deployZookeeper from "./programs/zookeeper";
import deploySchema from "./programs/schema";
import deployConnect from "./programs/connect";
import deployKafkaUi from "./programs/kafka_ui";
import deployKsqlDB from "./programs/ksqldb";
import deployKsqlDBCli from "./programs/ksqldb_cli";
import deployRestProxy from "./programs/restProxy";
import deployPostgres from "./programs/postgres";
import deployNeo4J from "./programs/neo4j";

import logo from "./pipelayer.png";
import { type ProviderResource, type ResourceOptions } from "@pulumi/pulumi";
import { deletedWith, provider } from "../../utils";

export type PlatformPipelayerConfiguration = BlockConfiguration<{
  cluster: string;
  "kafka.replicas": number;
  "zookeeper.replicas": number;
  "kafka.ui.username": string;
  "kafka.ui.password": string;
  "postgres.username": string;
  "postgres.password": string;
  "neo4j.username": string;
  "neo4j.password": string;
}>;

const program = async (
  config: PlatformPipelayerConfiguration,
  links: ProvidedResource[],
  context: StackContext,
  options?: ResourceOptions
  // eslint-disable-next-line @typescript-eslint/require-await
) => {
  const k8s_provider = links.find((l) => l.type === "provider-kubernetes")
    ?.resource as ProviderResource;
  if (!k8s_provider)
    throw new Error("Platform requires a configured kubernetes cluster.");

  const commonOptions = deletedWith(
    k8s_provider,
    provider(k8s_provider, options)
  );

  const ret = deployKafka(config, commonOptions);
  deployZookeeper(config, commonOptions);
  deploySchema(config, commonOptions);
  deployConnect(config, commonOptions);
  deployKsqlDB(config, commonOptions);
  deployKsqlDBCli(config, commonOptions);
  deployRestProxy(config, commonOptions);
  deployKafkaUi(config, commonOptions);
  const postgres = deployPostgres(config, commonOptions);
  deployNeo4J(config, commonOptions);

  return { provided: [...ret.provided, ...postgres.provided] };
};

const Block: BlockConfig<PlatformPipelayerConfiguration> = {
  name: "pipelayer",
  label: "Pipelayer",
  type: "platform",
  image: { data: logo, width: 140, height: 140 },
  program: program,
  provides: ["provider-kafka", "postgres"],
  configuration: [
    {
      name: "k8s",
      title: "Kubernetes",
      fields: [
        {
          name: "cluster",
          title: "Cluster",
          description: "Kubernetes cluster used for deploy",
          required: true,
          type: "multiple",
          provides: "provider-kubernetes",
          direction: "out",
        },
      ],
    },
    {
      name: "kafka",
      title: "Kafka",
      fields: [
        {
          name: "kafka.ui.username",
          title: "Username",
          description: "Username to use for Kafka UI",
          type: "text",
          required: true,
          maxLength: 255,
          minLength: 3,
        },
        {
          name: "kafka.ui.password",
          title: "Password",
          inputType: "password",
          description: "Password to use for Kafka UI",
          type: "text",
          required: true,
          maxLength: 255,
          minLength: 3,
        },
        {
          name: "kafka.replicas",
          title: "Kafka replicas",
          description: "How many kafka brokers should be running.",
          type: "number",
          required: true,
          min: 1,
          max: 99,
        },
        {
          name: "zookeeper.replicas",
          title: "Zookeeper replicas",
          description: "How many zookeeper instances should be running.",
          type: "number",
          required: true,
          min: 1,
          max: 99,
        },
      ],
    },
    {
      name: "postgres",
      title: "Postgres",
      fields: [
        {
          name: "postgres.username",
          title: "Username",
          description: "Username to use for Postgres",
          type: "text",
          required: true,
          maxLength: 255,
          minLength: 3,
        },
        {
          name: "postgres.password",
          title: "Password",
          description: "Password to use for Postgres",
          type: "text",
          inputType: "password",
          required: true,
          maxLength: 255,
          minLength: 3,
        },
      ],
    },
    {
      name: "neo4j",
      title: "Neo4J",
      fields: [
        {
          name: "neo4j.username",
          title: "Username",
          description: "Username to use for Neo4J",
          type: "text",
          required: true,
          maxLength: 255,
          minLength: 3,
        },
        {
          name: "neo4j.password",
          title: "Password",
          description: "Password to use for Neo4J",
          type: "text",
          inputType: "password",
          required: true,
          maxLength: 255,
          minLength: 3,
        },
      ],
    },
  ],
};

export default Block;
