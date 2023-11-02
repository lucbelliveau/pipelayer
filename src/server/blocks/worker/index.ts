import { type ProviderResource, type ResourceOptions } from "@pulumi/pulumi";
import * as kubernetes from "@pulumi/kubernetes";

import {
  type BlockConfiguration,
  type BlockConfig,
  type ProvidedResource,
  type StackContext,
} from "~/types";

import logo from "./logo.svg";
import { deletedWith, provider } from "../utils";
import { createDeployment } from "..";

type PlatformTopicConfiguration = BlockConfiguration<{
  cron: boolean;
  schedule?: string;
  image: string;
  kubernetes: string;
  env?: { keyvalue: { key: string; value: string } }[];
}>;

const program = async (
  config: PlatformTopicConfiguration,
  links: ProvidedResource[],
  _: StackContext,
  options?: ResourceOptions
  // eslint-disable-next-line @typescript-eslint/require-await
) => {
  const name = config.name.toLowerCase().replaceAll(" ", "_");
  const k8s_name = name.replaceAll("_", "-");
  const k8s_provider = links.find((l) => l.type === "provider-kubernetes")
    ?.resource as ProviderResource;
  if (!k8s_provider)
    throw new Error("Workers require a configured kubernetes cluster.");

  const commonOptions = deletedWith(
    k8s_provider,
    provider(k8s_provider, options)
  );

  if (!config.cron) {
    createDeployment(
      {
        name: k8s_name,
        enableServiceLinks: false,
        noService: true,
        containers: [
          {
            image: config.image,
          },
        ],
      },
      commonOptions
    );
  } else {
    const { schedule } = config;
    if (!schedule) throw new Error("Schedule is not set!");
    new kubernetes.batch.v1.CronJob(
      k8s_name,
      {
        metadata: {
          name: k8s_name,
        },
        spec: {
          schedule,
          jobTemplate: {
            spec: {
              template: {
                spec: {
                  restartPolicy: "OnFailure",
                  containers: [
                    {
                      name: `${k8s_name}-container`,
                      image: config.image,
                      env: config.env?.map(({ keyvalue }) => ({
                        name: keyvalue.key,
                        value: keyvalue.value,
                      })),
                    },
                  ],
                },
              },
            },
          },
        },
      },
      commonOptions
    );
  }
};

const Block: BlockConfig<PlatformTopicConfiguration> = {
  name: "worker",
  label: "Worker",
  type: "worker",
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  image: { data: logo, width: 800, height: 800 },
  program: program,
  configuration: [
    {
      name: "Worker",
      fields: [
        {
          name: "kubernetes",
          title: "Kubernetes Cluster",
          type: "dropdown",
          provides: "provider-kubernetes",
          required: true,
          direction: "in",
        },

        {
          name: "image",
          title: "Image name",
          type: "text",
          required: true,
        },

        {
          name: "cron",
          title: "Run this worker periodically?",
          type: "boolean",
          required: true,
          description:
            "If true the worker will be run according to the defined schedule.",
        },

        {
          name: "schedule",
          title: "Schedule",
          description: "Use crontab syntax to define the schedule",
          type: "text",
          required: true,
          visibleIf: "{cron} = 'true'",
        },

        {
          name: "env",
          title: "Environment variables",
          type: "keyvalue-list",
          required: false,
        },
      ],
    },
  ],
};

export default Block;
