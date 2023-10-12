import * as kubernetes from "@pulumi/kubernetes";

import { type ResourceOptions } from "@pulumi/pulumi";
import { type PlatformPipelayerConfiguration } from "..";

export default function deployZookeeper(
  config: PlatformPipelayerConfiguration,
  options?: ResourceOptions
) {
  const replicas = config["zookeeper.replicas"];
  const zookeeper_hosts = [...(Array(replicas) as undefined[])]
    .map((_, i) => `zookeeper-${i}.zookeeper:22888:23888`)
    .join(";");

  const zookeeperLabels = { app: "zookeeper" };
//   const client_conf = `
// Client {
//   org.apache.zookeeper.server.auth.DigestLoginModule required
//   username="admin"
//   password="password";
// };`;

//   const server_conf = `
// Server {
//   org.apache.zookeeper.server.auth.DigestLoginModule required
//   user_admin="password";
// };
// QuorumServer {
//   org.apache.zookeeper.server.auth.DigestLoginModule required
//   user_zookeeper="password";
// };
// QuorumLearner {
//   org.apache.zookeeper.server.auth.DigestLoginModule required
//   username="zookeeper"
//   password="password";
// };
// `;

  // const configmap = new kubernetes.core.v1.ConfigMap(
  //   "zookeeper-conf",
  //   {
  //     metadata: {
  //       labels: zookeeperLabels,
  //       name: "zookeeper-conf",
  //     },
  //     data: {
  //       "client.conf": client_conf,
  //       "server.conf": server_conf,
  //     },
  //   },
  //   options
  // );

  new kubernetes.apps.v1.StatefulSet(
    "zookeeper",
    {
      metadata: {
        name: "zookeeper",
      },
      spec: {
        selector: { matchLabels: zookeeperLabels },
        replicas,
        serviceName: "zookeeper",
        volumeClaimTemplates: [
          {
            metadata: {
              name: "zookeeper-volume-claim-data",
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
          {
            metadata: {
              name: "zookeeper-volume-claim-log",
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
          metadata: { labels: zookeeperLabels },
          spec: {
            restartPolicy: "Always",
            securityContext: {
              runAsGroup: 0,
              runAsUser: 0,
            },
            // volumes: [
            //   {
            //     name: "zookeeper-config",
            //     configMap: { name: configmap.metadata.name },
            //   },
            // ],
            containers: [
              {
                image: "confluentinc/cp-zookeeper:7.3.2",
                name: "zookeeper",
                command: [
                  "/bin/sh",
                  "-c",
                  'export ZOOKEEPER_SERVER_ID=$(expr $(hostname | grep -o "[[:digit:]]*$") + 1) && /etc/confluent/docker/run',
                ],
                ports: [
                  { containerPort: 22181, name: "client" },
                  { containerPort: 22888, name: "server" },
                  { containerPort: 23888, name: "leader-election" },
                ],
                volumeMounts: [
                  {
                    mountPath: "/var/lib/zookeeper/data",
                    name: "zookeeper-volume-claim-data",
                  },
                  {
                    mountPath: "/var/lib/zookeeper/log",
                    name: "zookeeper-volume-claim-log",
                  },
                  // {
                  //   mountPath: "/var/lib/zookeeper/pipelayer-conf",
                  //   name: "zookeeper-config",
                  // },
                ],
                env: [
                  { name: "ZOOKEEPER_CLIENT_PORT", value: "22181" },
                  { name: "ZOOKEEPER_TICK_TIME", value: "2000" },
                  { name: "ZOOKEEPER_LOG4J_ROOT_LOGLEVEL", value: "WARN" },
                  { name: "ZOOKEEPER_TOOLS_LOG4J_LOGLEVEL", value: "ERROR" },
                  {
                    name: "ZOOKEEPER_SERVERS",
                    value: zookeeper_hosts,
                  },
                  // {
                  //   name: "KAFKA_OPTS",
                  //   value:
                  //     "-Djava.security.auth.login.config=/var/lib/zookeeper/pipelayer-conf/server.conf" +
                  //     "-Dquorum.auth.enableSasl=true" +
                  //     "-Dquorum.auth.learnerRequireSasl=true" +
                  //     "-Dquorum.auth.serverRequireSasl=true" +
                  //     "-Dquorum.cnxn.threads.size=20" +
                  //     "-Dzookeeper.authProvider.1=org.apache.zookeeper.server.auth.SASLAuthenticationProvider" +
                  //     "-Dzookeeper.authProvider.2=org.apache.zookeeper.server.auth.DigestAuthenticationProvider" +
                  //     "-DjaasLoginRenew=3600000" +
                  //     "-DrequireClientAuthScheme=sasl" +
                  //     "-Dquorum.auth.learner.loginContext=QuorumLearner" +
                  //     "-Dquorum.auth.server.loginContext=QuorumServer",
                  // },
                ],
              },
            ],
          },
        },
      },
    },
    options
  );

  new kubernetes.core.v1.Service(
    "zookeeper",
    {
      metadata: {
        name: "zookeeper",
      },
      spec: {
        selector: zookeeperLabels,
        clusterIP: "None",
        ports: [
          { port: 22181, name: "client" },
          { port: 22888, name: "server" },
          { port: 23888, name: "leader-election" },
        ],
      },
    },
    options
  );

  new kubernetes.policy.v1.PodDisruptionBudget(
    "zookeeper",
    {
      spec: {
        minAvailable: 2,
        selector: { matchLabels: zookeeperLabels },
      },
    },
    options
  );
}
