import { type ResourceOptions } from "@pulumi/pulumi";

import { createDeployment } from "../../..";
import { type PlatformPipelayerConfiguration } from "..";

export default function deployRestProxy(
  config: PlatformPipelayerConfiguration,
  options?: ResourceOptions
) {
  createDeployment(
    {
      name: "rest-proxy",
      containers: [
        {
          image: "confluentinc/cp-kafka-rest:7.3.2",
          ports: [{ containerPort: 8082 }],
          env: [
            {
              name: "KAFKA_REST_BOOTSTRAP_SERVERS",
              value: "kafka-internal:29092",
            },
            { name: "KAFKA_REST_HOST_NAME", value: "rest-proxy" },
            { name: "KAFKA_REST_LISTENERS", value: "http://0.0.0.0:8082" },
            { name: "KAFKA_REST_LOG4J_ROOT_LOGLEVEL", value: "WARN" },
            {
              name: "KAFKA_REST_SCHEMA_REGISTRY_URL",
              value: "http://schema-reg:8081",
            },
            { name: "KAFKA_REST_TOOLS_LOG4J_LOGLEVEL", value: "ERROR" },
          ],
        },
      ],
    },
    options
  );
}
