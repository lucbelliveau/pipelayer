import * as kubernetes from "@pulumi/kubernetes";

import { type ResourceOptions } from "@pulumi/pulumi";

import { createDeployment } from "../../../..";
import { type PlatformPipelayerConfiguration } from "../..";

import create_subject_sh from "./scripts/create_subject.sh";
import deps_sh from "./scripts/deps.sh";
import get_schema_registry_config_sh from "./scripts/get_schema_registry_config.sh";
import get_subject_info_sh from "./scripts/get_subject_info.sh";
import get_supported_schema_types_sh from "./scripts/get_supported_schema_types.sh";
import list_subjects_sh from "./scripts/list_subjects.sh";
import produce_factiva_articles_sh from "./scripts/produce_factiva_articles.sh";
import unique_article_key_avsc from "./scripts/unique-article-key.avsc";
import unique_article_val_avsc from "./scripts/unique-article-val.avsc";

export default function deploySchema(
  config: PlatformPipelayerConfiguration,
  options?: ResourceOptions
) {
  const kafka_replicas = config["kafka.replicas"];
  const brokers = [...(Array(kafka_replicas) as undefined[])]
    .map((_, i) => `broker-${i}.kafka-internal:29092`)
    .join(",");

  const configMap = new kubernetes.core.v1.ConfigMap(
    "schema-registry-scripts",
    {
      metadata: {
        labels: { app: "schema-reg" },
        name: "schema-registry-scripts",
      },
      data: {
        "create_subject.sh": create_subject_sh(config),
        "deps.sh": deps_sh(config),
        "get_schema_registry_config.sh": get_schema_registry_config_sh(config),
        "get_subject_info.sh": get_subject_info_sh(config),
        "get_supported_schema_types.sh": get_supported_schema_types_sh(config),
        "list_subjects.sh": list_subjects_sh(config),
        "produce_factiva_articles.sh": produce_factiva_articles_sh(config),
        "unique_article_key.avsc": unique_article_key_avsc(config),
        "unique_article_val.avsc": unique_article_val_avsc(config),
      },
    },
    options
  );

  createDeployment(
    {
      name: "schema-reg",
      containers: [
        {
          image: "confluentinc/cp-schema-registry:7.3.2",
          securityContext: {
            runAsGroup: 0,
            runAsUser: 0,
          },
          ports: [{ containerPort: 8081 }],
          volumes: [
            {
              mountPath: "/data/",
              name: "data",
            },
            {
              mountPath: "/prototype/",
              name: "prototype",
            },
            {
              name: "scripts",
              mountPath: "/configmap",
              configMap: configMap.metadata.name,
            },
          ],
          env: [
            { name: "SCHEMA_REGISTRY_HOST_NAME", value: "schema-reg" },
            {
              name: "SCHEMA_REGISTRY_KAFKASTORE_BOOTSTRAP_SERVERS",
              value: brokers,
            },
            {
              name: "SCHEMA_REGISTRY_LISTENERS",
              value: "http://0.0.0.0:8081",
            },
            {
              name: "SCHEMA_REGISTRY_LOG4J_ROOT_LOGLEVEL",
              value: "WARN",
            },
            {
              name: "SCHEMA_REGISTRY_TOOLS_LOG4J_LOGLEVEL",
              value: "ERROR",
            },
          ],
        },
      ],
    },
    options
  );
}
