import { type ResourceOptions } from "@pulumi/pulumi";

import { createDeployment } from "../../..";
import { type PlatformPipelayerConfiguration } from "..";

export default function deployConnect(
  config: PlatformPipelayerConfiguration,
  options?: ResourceOptions
) {
  const replicas = config["kafka.replicas"];

  createDeployment(
    {
      name: "connect",
      containers: [
        {
          image: "confluentinc/cp-kafka-connect:7.3.2",
          securityContext: {
            runAsUser: 0,
            runAsGroup: 0,
          },
          ports: [{ containerPort: 8083 }],
          args: [
            "bash",
            "-c",
            `echo "Installing connector plugins"
confluent-hub install --no-prompt confluentinc/kafka-connect-jdbc:10.6.3
confluent-hub install --no-prompt streamthoughts/kafka-connect-file-pulse:2.10.0
confluent-hub install --no-prompt neo4j/kafka-connect-neo4j:5.0.2
#
# -----------
# Launch the Kafka Connect worker
/etc/confluent/docker/run &
#
# Don't exit
sleep infinity
`,
          ],

          volumes: [
            {
              mountPath: "/usr/share/confluent-hub-components",
              name: "components",
              subPath: "components",
            },
            {
              mountPath: "/data",
              name: "data",
              subPath: "data",
            },
          ],
          env: [
            {
              name: "CLASSPATH",
              value:
                "/usr/share/java/monitoring-interceptors/monitoring-interceptors-7.3.2.jar",
            },
            {
              name: "CONNECT_BOOTSTRAP_SERVERS",
              value: "kafka-internal:29092",
            },
            {
              name: "CONNECT_CONFIG_STORAGE_REPLICATION_FACTOR",
              value: `${replicas}`,
            },
            {
              name: "CONNECT_CONFIG_STORAGE_TOPIC",
              value: "_kafka-connect-configs",
            },
            {
              name: "CONNECT_CONSUMER_INTERCEPTOR_CLASSES",
              value:
                "io.confluent.monitoring.clients.interceptor.MonitoringConsumerInterceptor",
            },
            {
              name: "CONNECT_GROUP_ID",
              value: "connect-distributed-group",
            },
            {
              name: "CONNECT_INTERNAL_KEY_CONVERTER",
              value: "org.apache.kafka.connect.json.JsonConverter",
            },
            {
              name: "CONNECT_INTERNAL_VALUE_CONVERTER",
              value: "org.apache.kafka.connect.json.JsonConverter",
            },
            {
              name: "CONNECT_KEY_CONVERTER",
              value: "io.confluent.connect.avro.AvroConverter",
            },
            {
              name: "CONNECT_KEY_CONVERTER_SCHEMA_REGISTRY_URL",
              value: "http://schema-reg:8081",
            },
            {
              name: "CONNECT_LOG4J_LOGGERS",
              value:
                "org.apache.zookeeper=ERROR,org.I0Itec.zkclient=ERROR,org.reflections=ERROR",
            },
            { name: "CONNECT_LOG4J_ROOT_LOGLEVEL", value: "WARN" },
            { name: "CONNECT_OFFSET_FLUSH_INTERVAL_MS", value: "1000" },
            {
              name: "CONNECT_OFFSET_STORAGE_REPLICATION_FACTOR",
              value: `${replicas}`,
            },
            {
              name: "CONNECT_OFFSET_STORAGE_TOPIC",
              value: "_kafka-connect-offsets",
            },
            {
              name: "CONNECT_PLUGIN_PATH",
              value: "/usr/share/java,/usr/share/confluent-hub-components",
            },
            {
              name: "CONNECT_PRODUCER_INTERCEPTOR_CLASSES",
              value:
                "io.confluent.monitoring.clients.interceptor.MonitoringProducerInterceptor",
            },
            { name: "CONNECT_REST_ADVERTISED_HOST_NAME", value: "connect" },
            { name: "CONNECT_REST_PORT", value: "8083" },
            {
              name: "CONNECT_STATUS_STORAGE_REPLICATION_FACTOR",
              value: `${replicas}`,
            },
            {
              name: "CONNECT_STATUS_STORAGE_TOPIC",
              value: "_kafka-connect-status",
            },
            { name: "CONNECT_TOOLS_LOG4J_LOGLEVEL", value: "ERROR" },
            {
              name: "CONNECT_VALUE_CONVERTER",
              value: "io.confluent.connect.avro.AvroConverter",
            },
            {
              name: "CONNECT_VALUE_CONVERTER_SCHEMA_REGISTRY_URL",
              value: "http://schema-reg:8081",
            },
          ],
        },
      ],
    },
    options
  );
}
