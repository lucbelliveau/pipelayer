import { type ResourceOptions } from "@pulumi/pulumi";

import { createPod } from "../../..";
import { type PlatformPipelayerConfiguration } from "..";

export default function deployKsqlDB(
  config: PlatformPipelayerConfiguration,
  options?: ResourceOptions
) {
  createPod(
    {
      name: "ksqldb-cli",
      containers: [
        {
          name: 'ksqldb-cli',
          image: "confluentinc/cp-ksqldb-cli:7.3.2",
          tty: true,
          volumes: [{ name: "scripts", mountPath: "/data/scripts" }],
        },
      ],
    },
    options
  );
}
