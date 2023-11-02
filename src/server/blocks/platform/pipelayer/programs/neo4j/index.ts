import * as kubernetes from "@pulumi/kubernetes";

import { type ResourceOptions } from "@pulumi/pulumi";
import { createDeployment } from "../../../..";
import { type PlatformPipelayerConfiguration } from "../..";

import create_neo4j_connectors from "./scripts/create_neo4j_connectors";
import create_neo4j_database from "./scripts/create_neo4j_database";
import download_neo4j_plugins from "./scripts/download_neo4j_plugins";
import keyword_mappings from "./scripts/keyword_mappings";
import neo4j_constraints from "./scripts/neo4j_constraints";
import neo4j_ne_ct_import from "./scripts/neo4j_ne_ct_import";
import prasc from "./scripts/pending_review_article_sink_connector";

export default function deployNeo4J(
  config: PlatformPipelayerConfiguration,
  options?: ResourceOptions
) {
  const neo4j_username = config["neo4j.username"];
  const neo4j_password = config["neo4j.password"];

  const configMap = new kubernetes.core.v1.ConfigMap(
    "neo4j-scripts",
    {
      metadata: {
        labels: { app: "neo4j" },
        name: "neo4j-scripts",
      },
      data: {
        "create_neo4j_connectors.sh": create_neo4j_connectors(config),
        "create_neo4j_database.sh": create_neo4j_database(config),
        "download_neo4j_plugins.sh": download_neo4j_plugins(config),
        "keyword_mappings.tsv": keyword_mappings(config),
        "neo4j_constraints.cql": neo4j_constraints(config),
        "neo4j_ne_ct_import.cql": neo4j_ne_ct_import(config),
        "pending_review_article_sink_connector.json": prasc(config),
      },
    },
    options
  );

  createDeployment(
    {
      name: "neo4j",
      enableServiceLinks: false,
      containers: [
        {
          image: "neo4j:5.8.0",
          ports: [
            { name: "http", containerPort: 7474 },
            { name: "https", containerPort: 7473 },
            { name: "bolt", containerPort: 7687 },
          ],
          volumes: [
            { name: "import", mountPath: "/import", readWriteMany: true },
            { name: "data", mountPath: "/data", readWriteMany: true },
            { name: "logs", mountPath: "/logs", readWriteMany: true },
            { name: "plugins", mountPath: "/plugins", readWriteMany: true },
            {
              name: "scripts",
              mountPath: "/configmap",
              configMap: configMap.metadata.name,
            },
          ],
          readinessProbe: {
            timeoutSeconds: 10,
            failureThreshold: 20,
            exec: {
              command: [
                "/var/lib/neo4j/bin/cypher-shell",
                "-u",
                neo4j_username,
                "-p",
                neo4j_password,
                "MATCH () RETURN count(*) as count",
              ],
            },
          },
          env: [
            { name: "NEO4J_ACCEPT_LICENSE_AGREEMENT", value: "yes" },
            {
              name: "NEO4J_AUTH",
              value: `${neo4j_username}/${neo4j_password}`,
            },
            {
              name: "NEO4J_server_default__advertised__address",
              value: "neo4j",
            },
            { name: "NEO4j_server_bolt_advertised_address", value: ":7687" },
            { name: "NEO4j_server_http_advertised_address", value: ":7474" },
            { name: "NEO4J_server_default__listen__address", value: "0.0.0.0" },
            { name: "NEO4j_server_bolt_listen_address", value: ":7687" },
            { name: "NEO4j_server_http_listen_address", value: ":7474" },
            { name: "NEO4J_server_memory_pagecache_size", value: "8G" },
            { name: "NEO4J_server_memory_heap.initial__size", value: "8G" },
            { name: "NEO4J_server_memory_heap_max__size", value: "16G" },
            { name: "NEO4J_apoc_export_file_enabled", value: "true" },
            { name: "NEO4J_apoc_import_file_enabled", value: "true" },
            {
              name: "NEO4J_apoc_import_file_use__neo4j__config",
              value: "true",
            },
            {
              name: "NEO4J_dbms_security_procedures_unrestricted",
              value: "apoc.*,gds.*",
            },
          ],
        },
      ],
    },
    options
  );

  // createJob({
  //   name: "init-neo4j",
  //   containers: [
  //     {
  //       name: "create-database",
  //       image: "neo4j:5.8.0",
  //       volumes: [
  //         {
  //           name: "create-database-import",
  //           mountPath: "/import",
  //           pvc: neo4jDeployment.volumes.import.metadata.name,
  //         },
  //         {
  //           name: "create-database-data",
  //           mountPath: "/data",
  //           pvc: neo4jDeployment.volumes.data.metadata.name,
  //         },
  //         {
  //           name: "create-database-logs",
  //           mountPath: "/logs",
  //           pvc: neo4jDeployment.volumes.logs.metadata.name,
  //         },
  //         {
  //           name: "create-database-plugins",
  //           mountPath: "/plugins",
  //           pvc: neo4jDeployment.volumes.plugins.metadata.name,
  //         },
  //         {
  //           name: "create-database-scripts",
  //           mountPath: "/configmap",
  //           configMap: configMap.metadata.name,
  //         },
  //       ],
  //       command: ["/configmap/create_neo4j_database.sh"],
  //     },

  //     {
  //       name: "create-connectors",
  //       image: "neo4j:5.8.0",
  //       volumes: [
  //         {
  //           name: "create-connectors-import",
  //           mountPath: "/import",
  //           pvc: neo4jDeployment.volumes.import.metadata.name,
  //         },
  //         {
  //           name: "create-connectors-data",
  //           mountPath: "/data",
  //           pvc: neo4jDeployment.volumes.data.metadata.name,
  //         },
  //         {
  //           name: "create-connectors-logs",
  //           mountPath: "/logs",
  //           pvc: neo4jDeployment.volumes.logs.metadata.name,
  //         },
  //         {
  //           name: "create-connectors-plugins",
  //           mountPath: "/plugins",
  //           pvc: neo4jDeployment.volumes.plugins.metadata.name,
  //         },
  //         {
  //           name: "create-connectors-scripts",
  //           mountPath: "/configmap",
  //           configMap: configMap.metadata.name,
  //         },
  //       ],
  //       command: ["/configmap/create_neo4j_connectors.sh"],
  //     },
  //     {
  //       name: "download-plugins",
  //       image: "neo4j:5.8.0",
  //       volumes: [
  //         {
  //           name: "download-plugins-import",
  //           mountPath: "/import",
  //           pvc: neo4jDeployment.volumes.import.metadata.name,
  //         },
  //         {
  //           name: "download-plugins-data",
  //           mountPath: "/data",
  //           pvc: neo4jDeployment.volumes.data.metadata.name,
  //         },
  //         {
  //           name: "download-plugins-logs",
  //           mountPath: "/logs",
  //           pvc: neo4jDeployment.volumes.logs.metadata.name,
  //         },
  //         {
  //           name: "download-plugins-plugins",
  //           mountPath: "/plugins",
  //           pvc: neo4jDeployment.volumes.plugins.metadata.name,
  //         },
  //         {
  //           name: "download-plugins-scripts",
  //           mountPath: "/configmap",
  //           configMap: configMap.metadata.name,
  //         },
  //       ],
  //       command: ["/configmap/download_neo4j_plugins.sh"],
  //     },
  //   ],
  // }, options);

  createDeployment(
    {
      name: "neodash",
      containers: [
        {
          image: "nielsdejong/neodash:2.2.5",
          ports: [{ name: "http", containerPort: 5005 }],
          env: [
            { name: "ssoEnabled", value: "false" },
            { name: "ssoDiscoveryUrl", value: "" },
            { name: "standalone", value: "true" },
            { name: "standaloneProtocol", value: "bolt" },
            { name: "standaloneHost", value: "neodash" },
            { name: "standalonePort", value: "7687" },
            { name: "standaloneDatabase", value: "neo4j" },
            { name: "standaloneDashboardName", value: "News Articles" },
            { name: "standaloneDashboardDatabase", value: "neo4j" },
          ],
        },
      ],
    },
    options
  );

  createDeployment(
    {
      name: "neodash-designer",
      containers: [
        {
          image: "nielsdejong/neodash:2.2.5",
          ports: [{ name: "http", containerPort: 5005 }],
        },
      ],
    },
    options
  );
}
