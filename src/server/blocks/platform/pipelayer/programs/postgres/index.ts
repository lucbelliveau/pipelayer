import { type ResourceOptions } from "@pulumi/pulumi";
import * as kubernetes from "@pulumi/kubernetes";

import { createDeployment } from "../../../..";
import { type PlatformPipelayerConfiguration } from "../..";

import create_postgres_connectors from "./scripts/create_postgres_connectors";
import { type ProvidedResourceReturn } from "~/types";

export default function deployPostgres(
  config: PlatformPipelayerConfiguration,
  options?: ResourceOptions
) {
  const username = config["postgres.username"];
  const password = config["postgres.password"];

  const configMap = new kubernetes.core.v1.ConfigMap(
    "postgres-scripts",
    {
      metadata: {
        labels: { app: "postgres" },
        name: "postgres-scripts",
      },
      data: {
        "create_postgres_connectors.sh": create_postgres_connectors(config),
      },
    },
    options
  );

  const { service } = createDeployment(
    {
      name: "postgres",
      containers: [
        {
          image: "postgres:15",
          ports: [{ containerPort: 5432, name: "client" }],
          volumes: [
            {
              name: "scripts",
              mountPath: "/configmap",
              configMap: configMap.metadata.name,
            },
          ],
          env: [
            { name: "ON_DEMAND_RECORD_COUNT", value: "10000" },
            { name: "POSTGRES_PASSWORD", value: password },
            { name: "POSTGRES_USER", value: username },
          ],
        },
      ],
    },
    options
  );

  if (!service) throw new Error("unable to create postgres.");

  return {
    provided: [
      {
        type: "postgres",
        configuration: {
          host: service.metadata.name,
          port: service.spec.ports.apply(
            (p) => p.find((port) => port.name === "client")?.port
          ),
          username,
          password,
        },
      },
    ],
  } as ProvidedResourceReturn;
}
