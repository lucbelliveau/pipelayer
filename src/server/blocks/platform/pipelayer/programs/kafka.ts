import * as kubernetes from "@pulumi/kubernetes";
import * as kafka from "@pulumi/kafka";

import { type ResourceOptions } from "@pulumi/pulumi";
import { type PlatformPipelayerConfiguration } from "..";
import { type ProvidedResourceReturn } from "~/types";
import { dependsOn } from "~/server/blocks/utils";

export default function deployKafka(
  config: PlatformPipelayerConfiguration,
  options?: ResourceOptions
) {
  const brokerLabels = { app: "kafka-broker" };

  const replicas = config["kafka.replicas"];

  const zookeeper_replicas = config["zookeeper.replicas"];
  const zookeeper_hosts = [...(Array(zookeeper_replicas) as undefined[])]
    .map((_, i) => `zookeeper-${i}.zookeeper:22181`)
    .join(",");

  const saslUsername = "kafkabroker";
  const saslPassword = "password";

  const conf = `
KafkaServer {
    org.apache.kafka.common.security.plain.PlainLoginModule required
    username="admin"
    password="${saslPassword}"
    user_${saslUsername}="${saslPassword}";
};
`;
  // `Client {
  //   org.apache.kafka.common.security.plain.PlainLoginModule required
  //   username="admin"
  //   password="password";
  // };
  // `;
  const configmap = new kubernetes.core.v1.ConfigMap(
    "broker-conf",
    {
      metadata: {
        labels: brokerLabels,
        name: "broker-conf",
      },
      data: {
        "kafka_server_jaas.conf": conf,
      },
    },
    options
  );

  const statefulset = new kubernetes.apps.v1.StatefulSet(
    "broker",
    {
      metadata: {
        name: "broker",
      },
      spec: {
        selector: { matchLabels: brokerLabels },
        replicas,
        serviceName: "kafka-internal",
        volumeClaimTemplates: [
          {
            metadata: {
              name: "broker-claim",
            },
            spec: {
              accessModes: ["ReadWriteOnce"],
              resources: {
                requests: {
                  storage: "16Gi",
                },
              },
            },
          },
        ],
        template: {
          metadata: { labels: brokerLabels },
          spec: {
            restartPolicy: "Always",
            securityContext: {
              runAsGroup: 0,
              runAsUser: 0,
            },
            volumes: [
              {
                name: "broker-config",
                configMap: { name: configmap.metadata.name },
              },
            ],
            containers: [
              {
                image: "confluentinc/cp-kafka:7.3.2",
                name: "broker",
                ports: [
                  { containerPort: 9101, name: "jmx" },
                  { containerPort: 29092, name: "client" },
                  { containerPort: 29093, name: "sasl-client" },
                ],

                volumeMounts: [
                  {
                    mountPath: "/var/lib/kafka/data",
                    name: "broker-claim",
                    subPath: "data",
                  },
                  {
                    mountPath: "/var/lib/kafka/pipelayer-conf",
                    name: "broker-config",
                  },
                ],
                command: [
                  "/bin/sh",
                  "-c",
                  'export KAFKA_ADVERTISED_LISTENERS="SASL_PLAINTEXT://$(expr $(hostname)).kafka-internal:29093,PLAINTEXT://$(expr $(hostname)).kafka-internal:29092" && export KAFKA_JMX_HOSTNAME="$(expr $(hostname)).kafka-internal" && /etc/confluent/docker/run',
                ],
                env: [
                  // {
                  //   name: "KAFKA_LISTENER_NAME_SASL___PLAINTEXT_PLAIN_SASL_JAAS_CONFIG",
                  //   value:
                  //     "org.apache.kafka.common.security.plain.PlainLoginModule required " +
                  //     'username="admin" ' +
                  //     'password="admin-secret" ' +
                  //     'user_admin="admin-secret" ' +
                  //     'user_alice="alice-secret";',
                  // },
                  {
                    name: "KAFKA_OPTS",
                    value:
                      "-Djava.security.auth.login.config=/var/lib/kafka/pipelayer-conf/kafka_server_jaas.conf",
                  },
                  { name: "KAFKA_SASL_ENABLED_MECHANISMS", value: "PLAIN" },

                  {
                    name: "KAFKA_CONFLUENT_BALANCER_TOPIC_REPLICATION_FACTOR",
                    value: `${replicas}`,
                  },
                  {
                    name: "KAFKA_CONFLUENT_LICENSE_TOPIC_REPLICATION_FACTOR",
                    value: `${replicas}`,
                  },
                  {
                    name: "KAFKA_CONFLUENT_SCHEMA_REGISTRY_URL",
                    value: "http://schema-reg:8081",
                  },
                  { name: "KAFKA_DELETE_TOPIC_ENABLE", value: "true" },
                  {
                    name: "KAFKA_GROUP_INITIAL_REBALANCE_DELAY_MS",
                    value: "1000",
                  },
                  { name: "KAFKA_JMX_PORT", value: "9101" },
                  {
                    name: "KAFKA_LISTENER_SECURITY_PROTOCOL_MAP",
                    value:
                      "PLAINTEXT:PLAINTEXT,PLAINTEXT_HOST:PLAINTEXT,OUTSIDE:PLAINTEXT,SASL_PLAINTEXT:SASL_PLAINTEXT",
                  },
                  {
                    name: "KAFKA_LOG4J_LOGGERS",
                    value:
                      "org.apache.zookeeper=WARN,org.apache.kafka=WARN,kafka=WARN,kafka.cluster=WARN,kafka.controller=WARN,kafka.coordinator=WARN,kafka.log=WARN,kafka.server=WARN,kafka.zookeeper=WARN,state.change.logger=WARN",
                  },
                  { name: "KAFKA_LOG4J_ROOT_LOGLEVEL", value: "WARN" },
                  { name: "KAFKA_LOG_RETENTION_MS", value: "-1" },
                  {
                    name: "KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR",
                    value: `${replicas}`,
                  },
                  { name: "KAFKA_TOOLS_LOG4J_LOGLEVEL", value: "ERROR" },
                  {
                    name: "KAFKA_TRANSACTION_STATE_LOG_MIN_ISR",
                    value: `${replicas}`,
                  },
                  {
                    name: "KAFKA_TRANSACTION_STATE_LOG_REPLICATION_FACTOR",
                    value: `${replicas}`,
                  },
                  {
                    name: "KAFKA_ZOOKEEPER_CONNECT",
                    value: zookeeper_hosts,
                  },
                  {
                    name: "ZOOKEEPER_SASL_ENABLED",
                    value: "FALSE",
                  },
                ],
              },
            ],
          },
        },
      },
    },
    options
  );

  const kafka_service = new kubernetes.core.v1.Service(
    "kafka-internal",
    {
      metadata: {
        name: "kafka-internal",
      },
      spec: {
        selector: brokerLabels,
        clusterIP: "None",
        ports: [
          { port: 9101, name: "jmx" },
          { port: 29092, name: "client" },
          { port: 29093, name: "sasl-client" },
        ],
      },
    },
    options
  );

  new kubernetes.policy.v1.PodDisruptionBudget(
    "kafka-pdb",
    {
      spec: {
        minAvailable: 2,
        selector: { matchLabels: brokerLabels },
      },
    },
    options
  );

  const kafka_provider = new kafka.Provider(
    `${config.name}-kafka-provider`,
    {
      bootstrapServers: ["localhost:29093"],
      saslUsername,
      saslPassword,
      saslMechanism: "plain",
      tlsEnabled: false,
    },
    dependsOn([kafka_service])
  );

  return {
    provided: [
      {
        type: "provider-kafka",
        configuration: {
          broker: {
            host: kafka_service.metadata.name,
            port: kafka_service.spec.ports.apply(
              (p) => p.find((port) => port.name === "client")?.port
            ),
          },
          schema_registry: {
            host: "schema-reg",
            port: 8081,
          }
        },
        resource: kafka_provider,
        forward: options?.provider
          ? {
              provider: options?.provider,
              localPort: 29093,
              targetPort: 29093,
              // service: "pod/broker-0",
              service: kafka_service,
              statefulset,
            }
          : undefined,
      },
    ],
  } as ProvidedResourceReturn;
}
