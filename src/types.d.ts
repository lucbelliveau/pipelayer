import type * as pulumi from "@pulumi/pulumi";
import type * as k8s from "@pulumi/kubernetes";

import { type StaticImageData } from "next/image";
import { type PrismaClient } from "@prisma/client";
import { type Session } from "next-auth";
import { type XYPosition } from "reactflow";
import { type DiagnosticEvent } from "@pulumi/pulumi/automation";

export interface BlockConfigurationFieldValidatorRegex {
  type: "regex";
  regex: string | RegExp;
}

export interface BlockConfigurationFieldValidatorText {
  type: "text";
  maxLength: number;
}

export type BlockConfigurationFieldValidator = {
  errorMessage: string;
} & (
  | BlockConfigurationFieldValidatorRegex
  | BlockConfigurationFieldValidatorText
);

export interface BlockConfigurationFieldSignin {
  type: "signin-google";
}

export interface BlockConfigurationFieldText {
  type: "text";
  default?: string;
  minLength?: number;
  maxLength?: number;
  regexp?: RegExp;
  inputType?: "password";
}

export interface BlockConfigurationFieldComment {
  type: "comment";
  default?: string;
}

export interface BlockConfigurationFieldNumber {
  type: "number";
  default?: number;
  min?: number;
  max?: number;
}

export interface BlockConfigurationFieldBoolean {
  type: "boolean";
  default?: boolean;
}


export type FlowDirection = "in" | "out" | "bidirectional";
export type BlockConfigurationFieldMultiple = {
  type: "multiple";
} & (
  | {
      choices: string[];
    }
  | { provides: ProvidedResourceType; direction: FlowDirection }
);

export type BlockConfigurationFieldDropdown = {
  type: "dropdown";
} & (
  | {
      choices: string[];
    }
  | { provides: ProvidedResourceType; direction: FlowDirection }
);

export type BlockConfigurationField<
  Name,
  T =
    | BlockConfigurationFieldSignin
    | BlockConfigurationFieldText
    | BlockConfigurationFieldNumber
    | BlockConfigurationFieldComment
    | BlockConfigurationFieldMultiple
    | BlockConfigurationFieldDropdown
    | BlockConfigurationFieldBoolean
> = {
  name: keyof Name | Concat<[keyof Name, "@private"]>;
  description?: string;
  title: string;
  required?: boolean;
  validators?: BlockConfigurationFieldValidator[];
} & T;

export type BlockTypes =
  | "cloud"
  | "platform"
  | "topic"
  | "avro"
  | "worker"
  | "gpu-worker";

export type SurveyJSModelElementValidator = { text: string } & (
  | {
      type: "regex";
      regex: RegExp;
    }
  | { type: "text"; maxLength?: number; minLength?: number }
  | { type: "numeric" }
);

export interface SurveyJSModelElementTextSchema {
  name: string;
  title: string;
  type: "text";
  isRequired?: boolean;
  requiredErrorText?: string;
  validators?: SurveyJSModelElementValidator[];
  description?: string;
}

export interface SurveyJSModelElementCommentSchema {
  name: string;
  title: string;
  type: "comment";
  isRequired?: boolean;
  requiredErrorText?: string;
  validators?: SurveyJSModelElementValidator[];
  description?: string;
}

export interface SurveyJSModelElementBooleanSchema {
  name: string;
  title: string;
  type: "boolean";
  isRequired?: boolean;
  requiredErrorText?: string;
  description?: string;
}


export type SurveyJSModelElementNumberSchema =
  SurveyJSModelElementTextSchema & {
    inputType: "number";
    min?: number;
    max?: number;
  };

export type SurveyJSModelElementPasswordSchema =
  SurveyJSModelElementTextSchema & {
    inputType: "password";
  };

export interface SurveyJSModelElementMultipleSchema {
  name: string;
  title: string;
  type: "tagbox";
  isRequired?: boolean;
  requiredErrorText?: string;
  validators?: SurveyJSModelElementValidator[];
  choices?: string[];
  description?: string;
}

export interface SurveyJSModelElementDropdownSchema {
  name: string;
  title: string;
  type: "dropdown";
  isRequired?: boolean;
  requiredErrorText?: string;
  validators?: SurveyJSModelElementValidator[];
  choices?: string[];
  description?: string;
}

export interface SurveyJSModelElementSigninSchema {
  name: string;
  title: string;
  type: "signin-google";
  isRequired?: boolean;
  requiredErrorText?: string;
  validators?: SurveyJSModelElementValidator[];
  description?: string;
}

export type SurveyJSModelElementSchema =
  | SurveyJSModelElementTextSchema
  | SurveyJSModelElementNumberSchema
  | SurveyJSModelElementPasswordSchema
  | SurveyJSModelElementCommentSchema
  | SurveyJSModelElementMultipleSchema
  | SurveyJSModelElementDropdownSchema
  | SurveyJSModelElementSigninSchema
  | SurveyJSModelElementBooleanSchema;

export interface SurveyJSModelSchemaPage {
  name: string;
  description?: string;
  title?: string;
  elements: SurveyJSModelElementSchema[];
}
export interface SurveyJSModelSchema {
  showQuestionNumbers?: "off" | "on";
  completeText?: string;
  textUpdateMode?: "onTyping" | "onBlur" | "default";
  showCompletedPage?: boolean;
  questionsOnPageMode?: "singlePage" | "questionPerPage" | "standard";
  pages: SurveyJSModelSchemaPage[];
}

type ProvidedResourceForward = {
  provider: pulumi.ProviderResource & { kubeconfig: string };
  targetPort?: number;
  localPort: number;
  service: pulumi.Input<k8s.core.v1.Service> | string;
} & (
  | {
      deployment: pulumi.Input<k8s.extensions.v1beta1.Deployment>;
    }
  | {
      statefulset: pulumi.Input<k8s.apps.v1.StatefulSet>;
    }
);

export type ProvidedResource = (
  | {
      type: Exclude<ProvidedResourceType, "provider-kafka" | "postgres">;
    }
  | {
      type: "postgres";
      configuration: {
        host: pulumi.Output<string> | string;
        port: pulumi.Output<number> | number;
        username: pulumi.Output<string> | string;
        password: pulumi.Output<string> | string;
      };
    }
  | {
      type: "provider-kafka";
      configuration: {
        broker: {
          host: pulumi.Output<string> | string;
          port: pulumi.Output<number> | number;
        };
        schema_registry: {
          host: pulumi.Output<string> | string;
          port: pulumi.Output<number> | number;
        };
      };
    }
) & {
  resource: pulumi.Resource;
  references?: ProvidedResource[];
  forward?: ProvidedResourceForward;
};

export type ProvidedResourceReturn = { provided: ProvidedResource[] };

export type Concat<T extends string[]> = T extends [
  infer F extends string,
  ...infer R extends string[]
]
  ? `${F}${Concat<R>}`
  : "";

export type StackContext = { session: Session; prisma: PrismaClient };
export type StackPrepare<ConfigType> = (
  stack: pulumi.automation.Stack,
  context: StackContext,
  config: ConfigType
) => Promise<void | ProvidedResourceReturn>;

export type BlockConfigurationFieldPage<T> = {
  name: string;
  description?: string;
  title?: string;
  fields: BlockConfigurationField<T>[];
};

export type ProvidedResourceType =
  | "provider-kubernetes"
  | "provider-kafka"
  | "data-contract"
  | "kafka-topic"
  | "postgres";

export type BlockConfig<T = BlockConfiguration<never>> = {
  name: string;
  type: BlockTypes;
  label?: string;
  program: (
    config: BlockConfiguration<T>,
    links: ProvidedResource[],
    context: StackContext,
    options?: pulumi.ResourceOptions
  ) => Promise<void | ProvidedResourceReturn>;
  prepare?: StackPrepare<BlockConfiguration<T>>;
  image?: { data: StaticImageData; width: number; height: number };
  configuration?: BlockConfigurationFieldPage<T>[];
  // excludeDefaults?: ("name" | "consumer.topics" | "producer.topics")[];
  provides?: ProvidedResourceType[];
};

export type BlockCommonConfiguration = {
  name: string;
};

export type BlockConfiguration<T> = {
  id: string;
  name: string;
  "consumer.topics"?: string[];
  "producer.topics"?: string[];
} & T;

export type NodeDataPayload<T> = {
  id: string;
  type: BlockTypes | string;
  pipelayer: XYPosition;
} & BlockConfiguration<T>;

export type NodeDataPayloadPrivateStorageNode<T> = [
  keyof T,
  string | undefined | string[]
][];

export type NodeDataPayloadPrivateStorage<T> = {
  [key: string]: NodeDataPayloadPrivateStorageNode<T>;
};

// Type for SurveyJS...
export type SurveyModel<T> = {
  data: BlockConfiguration<T>;
  validate: () => boolean;
};

export type NodeData<T = unknown> = {
  block: BlockConfig<T>;
  payload: NodeDataPayload<T>;
  model: SurveyModel<T>;
};

export type NodeDragDropTransferObject = {
  type: BlockTypes;
  blockName: string;
};

export type PipelayerWorkflow = {
  main: {
    flows: NodeDataPayload<unknown>[];
    topics: {
      [name: string]: Omit<NodeDataPayload<unknown>, "name">;
    };
    platform: NodeDataPayload<unknown>[];
    cloud?: NodeDataPayload<unknown>[];
    avro?: NodeDataPayload<unknown>[];
  };
};

export interface WorkflowOperationResultSuccess<T> {
  status: "ok";
  payload: T;
}
export interface WorkflowOperationResultError {
  status: "error";
  exception: string;
}

export type WorkflowOperationResult<T> = {
  diagnostics: DiagnosticEvent[];
} & (WorkflowOperationResultError | WorkflowOperationResultSuccess<T>);
