import { type Node, type Edge } from "reactflow";
import { create } from "zustand";
import { yamlToFlow } from "./utils/workflow";
import {
  type NodeData,
  type BlockConfig,
  type BlockConfiguration,
  type WorkflowOperationResult,
} from "./types";
import { type Workflow } from "@prisma/client";
import { type PreviewResult, type UpResult } from "@pulumi/pulumi/automation";

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

const usePipeLayer = create<PipeLayerState>((set) => ({
  busy: false,
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
      set(() => {
        const { edges, nodes } = yamlToFlow(workflow, blocks);
        // const compose = toDocker(workflow.yaml);
        console.log("-- workflow updated --");
        return { workflow, nodes, edges, status: {} };
      });
      return true;
    } catch (e: unknown) {
      set(() => ({ workflow, status: { error: String(e) } }));
      console.error(e);
    }
    return false;
  },
  updateNodes: (nodes: Node<NodeData>[]) => set(() => ({ nodes })),
  updateEdges: (edges: Edge[]) => set(() => ({ edges })),
  updateNodeAndEdges: (nodes: Node<NodeData>[], edges: Edge[]) =>
    set(() => ({ nodes, edges })),
  setShowErrorDialog: (showErrorDialog: string) =>
    set(() => ({ showErrorDialog })),
}));

export default usePipeLayer;
