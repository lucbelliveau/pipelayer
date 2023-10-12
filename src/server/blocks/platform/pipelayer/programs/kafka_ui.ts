import { type ResourceOptions } from "@pulumi/pulumi";

import { createDeployment } from "../../..";
import { type PlatformPipelayerConfiguration } from "..";

export default function deployKafkaUi(
  config: PlatformPipelayerConfiguration,
  options?: ResourceOptions
) {
  const username = config["kafka.ui.username"];
  const password = config["kafka.ui.password"];

  createDeployment(
    {
      name: "kafka-ui",
      containers: [
        {
          image: "provectuslabs/kafka-ui:latest",
          ports: [{ containerPort: 8080 }],
          env: [
            { name: "AUTH_TYPE", value: "LOGIN_FORM" },
            {
              name: "KAFKA_CLUSTERS_0_BOOTSTRAPSERVERS",
              value: "kafka-internal:29092",
            },
            {
              name: "KAFKA_CLUSTERS_0_KAFKACONNECT_0_ADDRESS",
              value: "http://connect:8083",
            },
            {
              name: "KAFKA_CLUSTERS_0_KAFKACONNECT_0_NAME",
              value: "connect",
            },
            {
              name: "KAFKA_CLUSTERS_0_KSQLDBSERVER",
              value: "http://ksqldb-server:8088",
            },
            { name: "KAFKA_CLUSTERS_0_METRICS_PORT", value: "9101" },
            { name: "KAFKA_CLUSTERS_0_NAME", value: "local" },
            { name: "KAFKA_CLUSTERS_0_READONLY", value: "false" },
            {
              name: "KAFKA_CLUSTERS_0_SCHEMAREGISTRY",
              value: "http://schema-reg:8081",
            },
            { name: "SPRING_SECURITY_USER_NAME", value: username },
            { name: "SPRING_SECURITY_USER_PASSWORD", value: password },
          ],
        },
      ],
    },
    options
  );
}
