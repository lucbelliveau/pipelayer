import * as fs from "fs";
import * as path from "path";

import type * as pulumi from "@pulumi/pulumi";
import * as kubernetes from "@pulumi/kubernetes";

import { type PersistentVolumeClaim } from "@pulumi/kubernetes/core/v1";

import { type ResourceOptions } from "@pulumi/pulumi";

import PipelayerBlock from "./platform/pipelayer";
import TopicBlock from "./topic";
import GcpBlock from "./cloud/gcp";
import AzureBlock from "./cloud/azure";
import AvroBlock from "./avro";
import DedupByIdBlock from "./gphin/dedup_by_id";
import SentenceSegmentation from "./gphin/sentence_segmentation";
import NamedEntityRecognizer from "./gphin/named_entity_recognizer";
import DedupByContentBlock from "./gphin/dedup_by_content";
import MachineTranslatorBlock from "./gphin/machine_translator";
import TopicClassifierBlock from "./gphin/topic_classifier";
import TextSummarizerBlock from "./gphin/text_summarizer";

export const blocks = [
  GcpBlock,
  AzureBlock,
  PipelayerBlock,
  TopicBlock,
  AvroBlock,
  DedupByIdBlock,
  DedupByContentBlock,
  SentenceSegmentation,
  NamedEntityRecognizer,
  MachineTranslatorBlock,
  TopicClassifierBlock,
  TextSummarizerBlock,
];

type Volume = {
  name: string;
  mountPath: string;
  storage?: string;
  subPath?: string;
  configMap?: pulumi.Input<string>;
  emptyDir?: kubernetes.types.input.core.v1.EmptyDirVolumeSource;
  nfs?: pulumi.Input<kubernetes.types.input.core.v1.NFSVolumeSource>;
  filestore?: boolean;
  pvc?: pulumi.Input<string>;
};

interface DeploymentOptions {
  noService?: boolean;
  name: string;
  replicas?: number;
  enableServiceLinks?: boolean;
  containers: {
    name?: string;
    securityContext?: kubernetes.types.input.core.v1.SecurityContext;
    image: pulumi.Input<string>;
    args?: string[];
    ports?: kubernetes.types.input.core.v1.ContainerPort[];
    volumes?: Volume[];
    env?: kubernetes.types.input.core.v1.EnvVar[];
    readinessProbe?: pulumi.Input<kubernetes.types.input.core.v1.Probe>;
    livenessProbe?: pulumi.Input<kubernetes.types.input.core.v1.Probe>;
    startupProbe?: pulumi.Input<kubernetes.types.input.core.v1.Probe>;
    resources?: kubernetes.types.input.core.v1.ResourceRequirements;
  }[];
}

interface ConfigMapDirectoryOptions {
  name: string;
  directory: string;
  cwd?: string;
  labels?: pulumi.Input<{
    [key: string]: pulumi.Input<string>;
  }>;
}

const toVolumeMounts = (base_name: string, volumes?: Volume[]) =>
  volumes?.map((volume) => ({
    name: `${base_name}-pvc-${volume.name}`,
    mountPath: volume.mountPath,
    subPath: volume.subPath,
  }));

const toVolumes = (base_name: string, volumes?: Volume[]) =>
  volumes?.map((volume) => ({
    name: `${base_name}-pvc-${volume.name}`,
    configMap: volume.configMap
      ? {
          name: volume.configMap,
        }
      : undefined,
    emptyDir: volume.emptyDir,
    nfs: volume.nfs,
    persistentVolumeClaim:
      volume.configMap || volume.emptyDir || volume.nfs
        ? undefined
        : {
            claimName: volume.pvc || `${base_name}-pvc-${volume.name}`,
          },
  }));

export function createConfigMapDirectory(
  config: ConfigMapDirectoryOptions,
  options?: ResourceOptions
) {
  const configMapDir = config.cwd
    ? path.join(config.cwd, config.directory)
    : config.directory;
  const configFiles = fs.readdirSync(configMapDir);
  const configMapData = Object.fromEntries(
    configFiles.map((file) => [
      file,
      fs.readFileSync(path.join(configMapDir, file)).toString(),
    ])
  );

  const configMap = new kubernetes.core.v1.ConfigMap(
    config.name,
    {
      metadata: {
        labels: config.labels,
        name: config.name,
      },
      data: configMapData,
    },
    options
  );

  return configMap;
}

export function createPvc(
  base_name: string,
  volumes: Volume[],
  options?: ResourceOptions
) {
  const vols: { [name: string]: PersistentVolumeClaim } = {};
  volumes
    .filter(
      (volume) =>
        !volume.configMap && !volume.emptyDir && !volume.nfs && !volume.pvc
    )
    .forEach((volume) => {
      vols[volume.name] = new kubernetes.core.v1.PersistentVolumeClaim(
        `${base_name}-pvc-${volume.name}`,
        {
          metadata: {
            name: `${base_name}-pvc-${volume.name}`,
            annotations: {
              "pulumi.com/skipAwait": "true",
            },
          },
          spec: {
            accessModes: [volume.filestore ? "ReadWriteMany" : "ReadWriteOnce"],
            storageClassName: volume.filestore
              ? "filestore-pipelayer"
              : undefined,
            resources: {
              requests: {
                storage: volume.storage || "16Gi",
              },
            },
          },
        },
        options
      );
    });
  return vols;
}

export function createDeployment(
  deploymentOptions: DeploymentOptions,
  options?: ResourceOptions
) {
  let volumes: { [name: string]: PersistentVolumeClaim } = {};

  deploymentOptions.containers.forEach((container) => {
    if (container.volumes) {
      volumes = Object.assign(
        {},
        volumes,
        createPvc(
          `${deploymentOptions.name}-${container.name || "def"}`,
          container.volumes,
          options
        )
      );
    }
  });

  const appLabels = { app: `app-label-${deploymentOptions.name}` };
  const deployment = new kubernetes.apps.v1.Deployment(
    deploymentOptions.name,
    {
      metadata: {
        labels: appLabels,
        name: deploymentOptions.name,
      },
      spec: {
        selector: { matchLabels: appLabels },
        replicas: deploymentOptions.replicas,
        template: {
          metadata: {
            labels: appLabels,
          },
          spec: {
            enableServiceLinks: deploymentOptions.enableServiceLinks,
            hostname: deploymentOptions.name,
            restartPolicy: "Always",
            containers: deploymentOptions.containers.map((container) => ({
              name: container.name || deploymentOptions.name,
              securityContext: container.securityContext,
              image: container.image,
              args: container.args,
              ports: container.ports,
              volumeMounts: toVolumeMounts(
                `${deploymentOptions.name}-${container.name || "def"}`,
                container.volumes
              ),
              env: container.env,
              readinessProbe: container.readinessProbe,
              livenessProbe: container.livenessProbe,
              startupProbe: container.startupProbe,
              resources: container.resources,
            })),
            volumes: deploymentOptions.containers.reduce((prev, container) => {
              toVolumes(
                `${deploymentOptions.name}-${container.name || "def"}`,
                container.volumes
              )?.forEach((vol) => prev.push(vol));
              return prev;
            }, [] as pulumi.Input<kubernetes.types.input.core.v1.Volume>[]),
          },
        },
      },
    },
    options
  );

  const service =
    !deploymentOptions.noService &&
    new kubernetes.core.v1.Service(
      deploymentOptions.name,
      {
        metadata: {
          name: deploymentOptions.name,
        },
        spec: {
          selector: appLabels,
          ports: deploymentOptions.containers
            .reduce((prev, container) => {
              container.ports?.forEach((port) => prev.push(port));
              return prev;
            }, [] as kubernetes.types.input.core.v1.ContainerPort[])
            .map((port) => ({
              port: port.containerPort,
              name: port.name,
            })),
        },
      },
      options
    );

  return { volumes, service, deployment };
}

interface PodOptions {
  name: string;
  containers: {
    name?: string;
    image: pulumi.Input<string>;
    command?: string[];
    args?: string[];
    tty?: boolean;
    volumes?: Volume[];
    env?: kubernetes.types.input.core.v1.EnvVar[];
    resources?: kubernetes.types.input.core.v1.ResourceRequirements;
  }[];
}

export function createPod(podOptions: PodOptions, options?: ResourceOptions) {
  const volumes: Volume[] = podOptions.containers.reduce(
    (pv, cv) => pv.concat(cv.volumes || []),
    [] as Volume[]
  );
  if (volumes.length > 0) createPvc(podOptions.name, volumes, options);
  new kubernetes.core.v1.Pod(
    podOptions.name,
    {
      metadata: {
        name: podOptions.name,
      },
      spec: {
        hostname: podOptions.name,
        volumes: toVolumes(podOptions.name, volumes),
        containers: podOptions.containers.map((container, idx) => ({
          name: container.name || `${podOptions.name}-${idx}`,
          image: container.image,
          command: container.command,
          args: container.args,
          tty: container.tty,
          volumeMounts: toVolumeMounts(podOptions.name, container.volumes),
          env: container.env,
          resources: container.resources,
        })),
      },
    },
    options
  );
}

export function createJob(podOptions: PodOptions, options?: ResourceOptions) {
  const volumes: Volume[] = podOptions.containers.reduce(
    (pv, cv) => pv.concat(cv.volumes || []),
    [] as Volume[]
  );
  if (volumes.length > 0) createPvc(podOptions.name, volumes, options);

  new kubernetes.batch.v1.Job(
    podOptions.name,
    {
      metadata: {
        name: podOptions.name,
      },
      spec: {
        backoffLimit: 4,
        template: {
          spec: {
            hostname: podOptions.name,
            volumes: toVolumes(podOptions.name, volumes),
            restartPolicy: "Never",
            containers: podOptions.containers.map((container, idx) => ({
              name: `${podOptions.name}-${container.name || idx}`,
              image: container.image,
              command: container.command,
              args: container.args,
              tty: container.tty,
              volumeMounts: toVolumeMounts(podOptions.name, container.volumes),
              env: container.env,
            })),
          },
        },
      },
    },
    options
  );
}
