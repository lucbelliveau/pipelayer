import { type Node, type Edge } from "reactflow";
import { create } from "zustand";
import { yamlToFlow } from "./utils/workflow";
import {
  type NodeData,
  type BlockConfig,
  type BlockConfiguration,
  type WorkflowOperationResult,
  type ProvidedResourceType,
} from "./types";
import { type Workflow } from "@prisma/client";
import { type PreviewResult, type UpResult } from "@pulumi/pulumi/automation";

export type EdgeHiddenHandles = {
  k8s: boolean;
  kafka: boolean;
  avro: boolean;
  topic: boolean;
  postgres: boolean;
};
interface PipeLayerState {
  busy: boolean;
  workflow?: Workflow;
  preview?: WorkflowOperationResult<PreviewResult>;
  updatePreview: (preview: WorkflowOperationResult<PreviewResult>) => void;
  isPreviewLoading: boolean;
  setPreviewLoading: (isPreviewLoading: boolean) => void;
  isPreviewDirty: boolean;
  setPreviewDirty: (dirty: boolean) => void;
  up?: WorkflowOperationResult<UpResult>;
  updateUp: (up?: WorkflowOperationResult<UpResult>) => void;
  isUpLoading: boolean;
  setUpLoading: (isUpLoading: boolean) => void;
  compose: string;
  status: {
    error?: string;
  };
  hiddenHandles: EdgeHiddenHandles;
  setHiddenHandles: (hiddenHandles: EdgeHiddenHandles) => void;
  toggleHiddenHandle: (
    handle: "k8s" | "kafka" | "avro" | "topic" | "postgres",
    state?: boolean
  ) => void;
  nodes: Node<NodeData>[];
  edges: Edge[];
  selectedNode: string;
  showEditor: boolean;
  showErrorDialog: string;
  tab: "pipelayer" | "compose" | "config";
  setTab: (tab: "pipelayer" | "compose" | "config") => void;
  update: (
    workflow: Workflow,
    blocks: BlockConfig<BlockConfiguration<never>>[]
  ) => boolean;
  updateNodes: (nodes: Node[]) => void;
  updateEdges: (edges: Edge[]) => void;
  updateNodeAndEdges: (nodes: Node[], edges: Edge[]) => void;
  setSelectedNode: (selectedNode: string) => void;
  setShowEditor: (showEditor: boolean) => void;
  toggleShowEditor: () => void;
  setShowErrorDialog: (show: string) => void;
}

const isTypeHidden = (
  type: ProvidedResourceType,
  hiddenHandles: EdgeHiddenHandles
) => {
  switch (type) {
    case "data-contract":
      return hiddenHandles.avro;
    case "kafka-topic":
      return hiddenHandles.topic;
    case "postgres":
      return hiddenHandles.postgres;
    case "provider-kafka":
      return hiddenHandles.kafka;
    case "provider-kubernetes":
      return hiddenHandles.k8s;
  }
};

const withHiddenEdges = (edges: Edge[], hiddenHandles: EdgeHiddenHandles) => {
  return edges.map((edge) => ({
    ...edge,
    hidden:
      isTypeHidden(edge.sourceHandle as ProvidedResourceType, hiddenHandles) ||
      isTypeHidden(edge.targetHandle as ProvidedResourceType, hiddenHandles),
  }));
};

const usePipeLayer = create<PipeLayerState>((set) => ({
  busy: false,
  hiddenHandles: {
    k8s: true,
    kafka: true,
    avro: true,
    topic: false,
    postgres: true,
  },
  setHiddenHandles: (hiddenHandles: EdgeHiddenHandles) =>
    set(() => ({
      hiddenHandles,
    })),
  toggleHiddenHandle: (
    handle: "k8s" | "kafka" | "avro" | "topic" | "postgres",
    state?: boolean
  ) =>
    set(({ hiddenHandles, edges }) => {
      const val = typeof state === "boolean" ? state : !hiddenHandles[handle];
      const _hiddenHandles = Object.assign({}, hiddenHandles, {
        [handle]: val,
      });

      return {
        hiddenHandles: _hiddenHandles,
        edges: withHiddenEdges(edges, _hiddenHandles),
      };
    }),

  workflow: undefined,
  preview: undefined,
  updatePreview: (preview) =>
    set(() => ({
      preview,
      showErrorDialog: (preview.status === "error" && preview.exception) || "",
    })),
  isPreviewLoading: false,
  setPreviewLoading: (isPreviewLoading) =>
    set((state) => ({
      isPreviewLoading,
      busy: isPreviewLoading || state.isUpLoading,
    })),
  isPreviewDirty: true,
  setPreviewDirty: (dirty: boolean) => set(() => ({ isPreviewDirty: dirty })),
  up: undefined,
  updateUp: (up) => set(() => ({ up })),
  isUpLoading: false,
  setUpLoading: (isUpLoading) =>
    set((state) => ({
      isUpLoading,
      busy: isUpLoading || state.isPreviewLoading,
    })),
  compose: "",
  selectedNode: "",
  status: {},
  nodes: [],
  edges: [],
  showEditor: false,
  showErrorDialog: "",
  tab: "pipelayer",
  setTab: (tab: "pipelayer" | "compose" | "config") => {
    set(() => ({ tab }));
  },
  setShowEditor: (showEditor: boolean) => set(() => ({ showEditor })),
  toggleShowEditor: () => set((state) => ({ showEditor: !state.showEditor })),
  setSelectedNode: (selectedNode: string) => set(() => ({ selectedNode })),
  update: (
    workflow: Workflow,
    blocks: BlockConfig<BlockConfiguration<never>>[]
  ) => {
    try {
      // validatePipelayerYaml(workflow.yaml);
      set(({ hiddenHandles }) => {
        const { edges, nodes } = yamlToFlow(workflow, blocks);
        // const compose = toDocker(workflow.yaml);
        console.log("-- workflow updated --");
        return {
          workflow,
          nodes,
          edges: withHiddenEdges(edges, hiddenHandles),
          status: {},
        };
      });
      return true;
    } catch (e: unknown) {
      set(() => ({ workflow, status: { error: String(e) } }));
      console.error(e);
    }
    return false;
  },
  updateNodes: (nodes: Node<NodeData>[]) => set(() => ({ nodes })),
  updateEdges: (edges: Edge[]) =>
    set(({ hiddenHandles }) => ({
      edges: withHiddenEdges(edges, hiddenHandles),
    })),
  updateNodeAndEdges: (nodes: Node<NodeData>[], edges: Edge[]) =>
    set(({ hiddenHandles }) => ({
      nodes,
      edges: withHiddenEdges(edges, hiddenHandles),
    })),
  setShowErrorDialog: (showErrorDialog: string) =>
    set(() => ({ showErrorDialog })),
}));

export default usePipeLayer;
