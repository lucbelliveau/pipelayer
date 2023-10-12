import { type ResourceOptions } from "@pulumi/pulumi";

import { createDeployment } from "../../..";
import { type PlatformPipelayerConfiguration } from "..";

export default function deployKsqlDB(
  config: PlatformPipelayerConfiguration,
  options?: ResourceOptions
) {
  const replicas = config["kafka.replicas"];

  createDeployment(
    {
      name: "ksqldb-server",
      containers: [
        {
          image: "confluentinc/cp-ksqldb-server:7.3.2",
          ports: [{ containerPort: 8088 }],
          env: [
            { name: "KSQL_BOOTSTRAP_SERVERS", value: "kafka-internal:29092" },
            { name: "KSQL_CACHE_MAX_BYTES_BUFFERING", value: "0" },
            { name: "KSQL_CONFIG_DIR", value: "/etc/ksql" },
            {
              name: "KSQL_CONSUMER_INTERCEPTOR_CLASSES",
              value:
                "io.confluent.monitoring.clients.interceptor.MonitoringConsumerInterceptor",
            },
            { name: "KSQL_HOST_NAME", value: "ksqldb-server" },
            { name: "KSQL_KSQL_CONNECT_URL", value: "http://connect:8083" },
            {
              name: "KSQL_KSQL_LOGGING_PROCESSING_STREAM_AUTO_CREATE",
              value: "true",
            },
            {
              name: "KSQL_KSQL_LOGGING_PROCESSING_TOPIC_AUTO_CREATE",
              value: "true",
            },
            {
              name: "KSQL_KSQL_LOGGING_PROCESSING_TOPIC_REPLICATION_FACTOR",
              value: `${replicas}`,
            },
            {
              name: "KSQL_KSQL_SCHEMA_REGISTRY_URL",
              value: "http://schema-reg:8081",
            },
            { name: "KSQL_LISTENERS", value: "http://0.0.0.0:8088" },
            { name: "KSQL_LOG4J_ROOT_LOGLEVEL", value: "WARN" },
            {
              name: "KSQL_PRODUCER_INTERCEPTOR_CLASSES",
              value:
                "io.confluent.monitoring.clients.interceptor.MonitoringProducerInterceptor",
            },
            { name: "KSQL_TOOLS_LOG4J_LOGLEVEL", value: "ERROR" },
          ],
        },
      ],
    },
    options
  );
}
