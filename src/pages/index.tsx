import {
  useRef,
  useCallback,
  useState,
  useMemo,
  useEffect,
  type DragEvent,
  type ChangeEventHandler,
} from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";

import {
  ExclamationCircleIcon,
  InformationCircleIcon,
  ArrowDownOnSquareIcon,
  RocketLaunchIcon,
} from "@heroicons/react/24/outline";
import {
  ServerStackIcon,
  TrashIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/solid";

import ReactFlow, {
  ReactFlowProvider,
  type ReactFlowInstance,
  // MiniMap,
  Controls,
  Background,
  addEdge,
  updateEdge,
  MarkerType,
  type Edge,
  type Connection,
  ConnectionLineType,
  Handle,
  Position,
  type NodeChange,
  applyNodeChanges,
  type EdgeChange,
  applyEdgeChanges,
  type Node,
  type NodeProps,
} from "reactflow";
import "reactflow/dist/style.css";

import { Survey } from "survey-react-ui";
import "survey-core/defaultV2.min.css";

import Editor from "@monaco-editor/react";

import { api } from "~/utils/api";

import usePipeLayer from "~/store";
import {
  createNode,
  isValidConnection,
  topicLinkNodesFromEdges,
} from "~/utils/workflow";
import React from "react";
import { flowToYaml, getPrivateData } from "../utils/workflow";
import {
  type SurveyModel,
  type BlockTypes,
  type BlockConfig,
  type NodeData,
  type NodeDragDropTransferObject,
  NodeDataPayload,
  BlockCommonConfiguration,
} from "~/types";

// TODO - move this to the GCP block
import { Question, ElementFactory, Serializer } from "survey-core";
import ErrorModal from "~/components/ErrorModal";
import { type Workflow } from "@prisma/client";

class GCPLoginButtonModel extends Question {
  getType() {
    return "signin-google";
  }
}

function registerGCPLoginButton() {
  ElementFactory.Instance.registerElement("signin-google", (name) => {
    return new GCPLoginButtonModel(name);
  });
}

registerGCPLoginButton();

Serializer.addClass(
  "signin-google",
  [],
  () => new GCPLoginButtonModel(""),
  "question"
);

// class GCPLoginButton extends SurveyQuestionElementBase {
//   constructor(props) {
//     super(props);
//   }
//   get question() {
//     return this.questionBase;
//   }
//   get value() {
//     return this.question.value;
//   }
//   // Support the read-only and design modes
//   get style() {
//     return this.question.getPropertyValue("readOnly") ||
//       this.question.isDesignMode
//       ? { pointerEvents: "none" }
//       : undefined;
//   }
//   renderElement() {
//     return <button onClick={() => void signIn("google")}>Signin</button>;
//   }
// }

// ReactQuestionFactory.Instance.registerQuestion("signin-google", (props) => {
//   return createElement(GCPLoginButton, props);
// });

const getBlockStyle = (type: BlockTypes) => {
  if (type === "cloud") return "bg-lime-100";
  if (type === "platform") return "bg-blue-100";
  if (type === "topic") return "bg-orange-300";
  if (type === "avro") return "bg-orange-100";
  if (type === "worker") return "bg-green-100";
  if (type === "gpu-worker") return "bg-green-300";
  return "bg-slate-300";
};

export default function Home() {
  const [createWorkflowName, setCreateWorkflowName] = useState("");
  const { data: sessionData } = useSession();
  const saveWorkflow = api.workflow.set.useMutation();
  const workflows = api.workflow.getAll.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  const { update, showErrorDialog, setShowErrorDialog, setPreviewDirty } =
    usePipeLayer((state) => state);

  const { isLoading: isBlocksLoading, data: blocks } = api.blocks.list.useQuery(
    undefined,
    {
      refetchOnWindowFocus: false,
    }
  );

  const onDragStart = useCallback(
    (event: DragEvent<HTMLDivElement>, nodeType: string) => {
      event.dataTransfer.setData("application/reactflow", nodeType);
      event.dataTransfer.effectAllowed = "move";
    },
    []
  );

  const onWorkflowCreateClick = useCallback(() => {
    saveWorkflow.mutate({
      id: "",
      name: createWorkflowName,
      yaml: "",
      storage: "",
    });
    void workflows.refetch();
  }, [createWorkflowName, saveWorkflow, workflows]);

  const onCreateWorkflowNameChange: ChangeEventHandler<HTMLInputElement> =
    useCallback((event) => {
      setCreateWorkflowName(event.target.value);
    }, []);

  const onErrorDialogOkClick = useCallback(
    () => setShowErrorDialog(""),
    [setShowErrorDialog]
  );

  useEffect(() => {
    // Responsible for the initial loading from the server
    const workflow = workflows.data && workflows.data[0];
    if (update && blocks && workflow) {
      console.debug("---- EFFECT [Update workflow yaml] ----");
      update(workflow, blocks);
      setPreviewDirty(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blocks, update, workflows.data]);

  return (
    <>
      <Head>
        <title>Pipelayer</title>
        <meta
          name="description"
          content="Tool to visually design data streams"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center">
        <header className="relative flex flex w-full items-center justify-center border-b-2 bg-gray-100 pr-10">
          <Image
            className="absolute left-0 top-0 w-[75px]"
            src="/pipelayer.png"
            alt="Pipelayer Logo"
            width={100}
            height={100}
            priority
          />
          <div className="h-[100px] w-[100px] rounded-br-full border-b-2 border-r-2 bg-white" />
          <h1 className="flex-1 text-3xl">Pipelayer</h1>
          <AuthShowcase />
        </header>
        <ErrorModal show={showErrorDialog} onOkClick={onErrorDialogOkClick} />
        {!sessionData && (
          <div className="flex w-full flex-1 items-center justify-center">
            Sign in to continue
          </div>
        )}
        {sessionData && workflows.data && workflows.data.length === 0 && (
          <div className="flex w-full flex-1 items-center justify-center">
            <div className="flex flex-col">
              <b>Workflow name</b>
              <input
                type="text"
                className="border-2"
                value={createWorkflowName}
                onChange={onCreateWorkflowNameChange}
              />

              <button
                onClick={onWorkflowCreateClick}
                className="m-1 rounded bg-blue-100 p-1 text-sm"
              >
                Create Workflow
              </button>
            </div>
          </div>
        )}
        {sessionData && workflows.data && workflows.data.length > 0 && (
          <>
            <div className="flex w-full flex-wrap space-x-2 space-y-2 border-2 p-3">
              <div></div>
              {!isBlocksLoading &&
                blocks &&
                blocks.map((block) => (
                  <div
                    key={`block-${block.name}`}
                    className={`flex items-center space-x-2 border-[1px] border-black ${getBlockStyle(
                      block.type
                    )} p-2`}
                    onDragStart={(event) =>
                      onDragStart(
                        event,
                        JSON.stringify({
                          type: "blockNode",
                          blockName: block.name,
                        })
                      )
                    }
                    draggable
                  >
                    <div className="h-10">
                      {block.type === "gpu-worker" && (
                        <span className="flex justify-center text-xs font-bold">
                          GPU
                        </span>
                      )}
                      {block.image && (
                        <Image
                          className={`h-${
                            block.type === "gpu-worker" ? "6" : "10"
                          } w-auto`}
                          src={block.image.data}
                          alt={`${block.label || block.name} logo`}
                          width={block.image.width}
                          height={block.image.height}
                        />
                      )}
                    </div>
                    <span>{block.label}</span>
                  </div>
                ))}
            </div>
            <div className="flex w-full flex-1">
              <WorkflowProvider />
            </div>
          </>
        )}
      </main>
    </>
  );
}

function WorkflowProvider() {
  const {
    workflow,
    status,
    update,
    selectedNode,
    showEditor,
    toggleShowEditor,
    tab,
    setTab,
    nodes,
    updatePreview,
    setPreviewLoading,
    setPreviewDirty,
  } = usePipeLayer((state) => state);
  const saveWorkflow = api.workflow.set.useMutation();
  const fetchPreview = api.pulumi.preview.useMutation();

  const editorDedup = useRef<NodeJS.Timeout>();

  const { data: blocks } = api.blocks.list.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  const switchTab = useCallback(
    (tab: "pipelayer" | "config") => () => {
      setTab(tab);
    },
    [setTab]
  );

  const toggleEditor = useCallback(() => {
    toggleShowEditor();
  }, [toggleShowEditor]);

  const onChange = useCallback(
    (yaml: string | undefined) => {
      if (editorDedup.current) {
        clearTimeout(editorDedup.current);
      }
      editorDedup.current = setTimeout(() => {
        if (blocks)
          update(Object.assign({}, workflow, { yaml: yaml || "" }), blocks);
        editorDedup.current = undefined;
      }, 1000);
    },
    [blocks, update, workflow]
  );

  const sNode = useMemo(
    () => nodes.find((n) => n.id === selectedNode),
    [nodes, selectedNode]
  );

  const persistWorkflow = useCallback(
    async (workflowCandidate: Workflow) => {
      console.log("---- saving workflow ---");
      if (
        workflow &&
        workflow.yaml === workflowCandidate.yaml &&
        workflow.storage === workflowCandidate.storage
      ) {
        console.log("-- no changes, abort --");
        return;
      }
      await saveWorkflow.mutateAsync(workflowCandidate);
      setPreviewDirty(true);
      console.log("--- workflow saved ---");
    },
    [saveWorkflow, setPreviewDirty, workflow]
  );

  const onCompleteCallback = useCallback(
    // eslint-disable-next-line @typescript-eslint/require-await
    async (sender: SurveyModel<unknown>) => {
      if (!sNode || !blocks) return false;
      console.debug("----- onCompleteCallback ---");
      const renamed =
        sender.data.name !== sNode.data.payload.name &&
        Boolean(sNode.data.block.provides);

      const original_name = sNode.data.payload.name;

      const updatedNodes = nodes.map((n) => {
        if (n.id !== selectedNode && !renamed) return n;
        if (n.id !== selectedNode) {
          const newPayload = Object.assign({}, n.data.payload);
          n.data.block.configuration?.forEach((conf) => {
            conf.fields.forEach((field) => {
              const fn = field.name as keyof BlockCommonConfiguration;
              const val = n.data.payload[fn];
              if (
                (field.type === "multiple" || field.type === "dropdown") &&
                "provides" in field &&
                sNode.data.block.provides?.includes(field.provides) &&
                ((Array.isArray(val) && val.includes(original_name)) ||
                  val === original_name)
              ) {
                if (Array.isArray(val)) {
                  // Quiet the compiler... we know it's an array here.
                  const afn = fn as "consumer.topics";
                  newPayload[afn] = val.map((v: string) =>
                    v === original_name ? `${sender.data.name}` : v
                  );
                } else newPayload[fn] = sender.data.name;
              }
            });
          });
          return Object.assign({}, n, {
            data: Object.assign({}, n.data, {
              payload: newPayload,
            }),
          });
        }
        return Object.assign({}, n, {
          data: Object.assign({}, n.data, {
            payload: Object.assign({}, sender.data),
          }),
        });
      });
      const newWorkflow = Object.assign({}, workflow, {
        yaml: flowToYaml(updatedNodes),
        storage: getPrivateData(updatedNodes),
      });
      void persistWorkflow(newWorkflow);
      update(newWorkflow, blocks);
      return true;
    },
    [blocks, nodes, persistWorkflow, sNode, selectedNode, update, workflow]
  );

  if (!workflow)
    return (
      <div className="flex-1">
        <div className="flex h-full flex-col justify-center">
          <div className="text-center">
            <div
              className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-sky-500 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
              role="status"
            ></div>
            <div>Loading workflow...</div>
          </div>
        </div>
      </div>
    );

  const activeTabClass = "tab tab-lifted tab-active";
  const tabClass = "tab tab-lifted";

  return (
    <>
      {status.error && (
        <div className="absolute bottom-10 right-10 z-50 rounded-full bg-red-100 p-3">
          {status.error}
        </div>
      )}
      <div className="flex-1">
        <Flow />
      </div>
      <div className="divider divider-horizontal" onClick={toggleEditor}>
        <span className="btn p-1">{showEditor ? <>&gt;</> : <>&lt;</>}</span>
      </div>
      <div className={`flex flex-col ${showEditor ? "flex-1" : "shrink"}`}>
        <div className="flex flex-1 flex-col">
          <div
            className={`${
              showEditor ? "" : "hidden"
            } flex flex-1 flex-col border-[1px]`}
          >
            <div className="tabs">
              <div className={tab === "pipelayer" ? activeTabClass : tabClass}>
                <button onClick={switchTab("pipelayer")}>pipelayer.yml</button>
              </div>
              <div className={tab === "config" ? activeTabClass : tabClass}>
                <button onClick={switchTab("config")}>Configuration</button>
              </div>
            </div>
            <div className="flex-1 border-[1px]">
              <div className={tab !== "pipelayer" ? "hidden" : "h-full"}>
                <Editor
                  defaultLanguage="yaml"
                  value={workflow.yaml}
                  onChange={onChange}
                  options={{
                    language: "yaml",
                    minimap: { enabled: false },
                  }}
                />
              </div>
              <div className={tab !== "config" ? "hidden" : "flex h-full"}>
                {!selectedNode && <div className="p-3">Select a node</div>}
                {sNode && (
                  <div className="h-0 min-h-full flex-grow overflow-auto">
                    <Survey
                      model={sNode.data.model}
                      onComplete={onCompleteCallback}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function BlockNode(node: NodeProps<NodeData>) {
  const {
    workflow,
    nodes,
    edges,
    updateNodeAndEdges,
    selectedNode,
    setSelectedNode,
    setShowEditor,
    setTab,
  } = usePipeLayer((state) => state);
  const saveWorkflow = api.workflow.set.useMutation();

  const deleteNode = useCallback(
    (event: React.SyntheticEvent) => {
      // TODO: delete private data
      const updatedNodes = nodes.filter((n) => n.id !== node.id);
      updateNodeAndEdges(
        updatedNodes,
        edges.filter((n) => n.source !== node.id && n.target !== node.id)
      );
      saveWorkflow.mutate(
        Object.assign({}, workflow, { yaml: flowToYaml(updatedNodes) })
      );

      event.stopPropagation();
    },
    [nodes, updateNodeAndEdges, edges, saveWorkflow, workflow, node.id]
  );

  const onNodeClick = useCallback(
    (event: React.SyntheticEvent) => {
      console.debug("-- onNodeClick --");
      event.stopPropagation();
      setSelectedNode(node.id);
      setShowEditor(true);
      setTab("config");
    },
    [node, setSelectedNode, setShowEditor, setTab]
  );

  const block: BlockConfig = node.data.block;
  const model = node.data.model;

  const valid = useMemo(() => {
    return model.validate();
  }, [model]);
  // TODO: use title?

  const selectRing: string[] = [
    "flex",
    "items-center",
    "space-x-2",
    getBlockStyle(block.type),
    "p-1",
    "pr-5",
  ];
  if (selectedNode === node.id) {
    selectRing.push(valid ? "border-2" : "border-[1px]", "border-blue-400");
  } else {
    selectRing.push(valid ? "border-2" : "border-[1px]", "border-black");
  }

  const errorRing: string[] = [];
  if (!valid) {
    errorRing.push("border-2", "border-red-400");
  }

  return (
    <>
      <Handle type="target" position={Position.Left} />
      <div className={errorRing.join(" ")}>
        <div
          className={selectRing.join(" ")}
          title="TODO: Use title text?"
          onClick={onNodeClick}
        >
          {block.image && (
            <Image
              className="h-10 w-auto"
              src={block.image.data}
              alt={`${block.label || block.name} logo`}
              width={block.image.width}
              height={block.image.height}
            />
          )}
          <div>
            <h5 className="text-xs font-bold">{block.label}</h5>
            <span>{node.data.payload.name}</span>
          </div>
          {!valid && (
            <div
              className="absolute bottom-[3px] right-[3px]"
              title="Configuration of this block is not valid."
            >
              <ExclamationCircleIcon className="h-4 w-4 text-red-500" />
            </div>
          )}
          <div className="absolute -top-6 right-[-3px]">
            <button onClick={deleteNode}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-4 w-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <Handle type="source" position={Position.Right} />
    </>
  );
}

function Flow() {
  const reactFlowWrapper = useRef<HTMLDivElement | null>(null);
  const edgeUpdateSuccessful = useRef(true);

  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance | null>(null);

  const {
    updateNodeAndEdges,
    updateEdges,
    updateNodes,
    update,
    workflow,
    nodes,
    edges,
    setSelectedNode,
    setShowEditor,
    setPreviewDirty,
  } = usePipeLayer((state) => state);

  const { data: blocks } = api.blocks.list.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  const dedupSave = useRef<NodeJS.Timeout>();

  const newNodeId = useRef(0);

  const saveWorkflow = api.workflow.set.useMutation();

  const persistWorkflow = useCallback(
    async (workflowCandidate: Workflow) => {
      console.log("---- saving workflow ---");
      if (
        workflow &&
        workflow.yaml === workflowCandidate.yaml &&
        workflow.storage === workflowCandidate.storage
      ) {
        console.log("-- no changes, abort --");
        return;
      }
      await saveWorkflow.mutateAsync(workflowCandidate);
      setPreviewDirty(true);
      console.log("--- workflow saved ---");
    },
    [saveWorkflow, setPreviewDirty, workflow]
  );

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      console.debug("-- onNodesChange --");
      const n = applyNodeChanges(changes, nodes);
      updateNodes(n);
      if (dedupSave.current) clearTimeout(dedupSave.current);
      dedupSave.current = setTimeout(() => {
        dedupSave.current = undefined;
        void persistWorkflow(
          Object.assign({}, workflow, {
            yaml: flowToYaml(n),
            storage: getPrivateData(n),
          })
        );
      }, 1000);
    },
    [nodes, persistWorkflow, updateNodes, workflow]
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      console.debug("-- onEdgesChange --");
      const e = applyEdgeChanges(changes, edges);
      updateEdges(e);
      if (dedupSave.current) clearTimeout(dedupSave.current);
      dedupSave.current = setTimeout(() => {
        dedupSave.current = undefined;
        saveWorkflow.mutate(
          Object.assign({}, workflow, { yaml: flowToYaml(nodes) })
        );
      }, 1000);
    },
    [edges, nodes, saveWorkflow, updateEdges, workflow]
  );

  const onEdgeUpdateStart = useCallback(() => {
    console.debug("-- onEdgeUpdateStart --");
    edgeUpdateSuccessful.current = false;
  }, []);

  const onEdgeUpdate = useCallback(
    (oldEdge: Edge, newConnection: Connection) => {
      console.debug("-- onEdgeUpdate --");
      edgeUpdateSuccessful.current = true;
      const newEdges = updateEdge(oldEdge, newConnection, edges);
      const updatedNodes = topicLinkNodesFromEdges(nodes, newEdges);
      updateNodeAndEdges(updatedNodes, newEdges);
      saveWorkflow.mutate(
        Object.assign({}, workflow, { yaml: flowToYaml(updatedNodes) })
      );
    },
    [edges, updateNodeAndEdges, nodes, saveWorkflow, workflow]
  );

  const onEdgeUpdateEnd = useCallback(
    (_: Event, edge: Edge) => {
      console.debug("-- onEdgeUpdateEnd --");
      if (!edgeUpdateSuccessful.current) {
        const newEdges = edges.filter((e) => e.id !== edge.id);
        const updatedNodes = topicLinkNodesFromEdges(nodes, newEdges);
        updateNodeAndEdges(updatedNodes, newEdges);
        saveWorkflow.mutate(
          Object.assign({}, workflow, { yaml: flowToYaml(updatedNodes) })
        );
      }
      edgeUpdateSuccessful.current = true;
    },
    [edges, nodes, updateNodeAndEdges, saveWorkflow, workflow]
  );

  const onConnect = useCallback(
    (conn: Connection) => {
      console.debug("--- onConnect ---");
      if (!isValidConnection(conn, nodes)) return false;
      conn = Object.assign({}, conn, {
        markerEnd: { type: MarkerType.ArrowClosed },
        type: "smoothstep",
        style: {
          strokeWidth: 2,
        },
      });
      const newEdges = addEdge(conn, edges);
      const updatedNodes = topicLinkNodesFromEdges(nodes, newEdges);
      updateNodeAndEdges(updatedNodes, newEdges);
      saveWorkflow.mutate(
        Object.assign({}, workflow, { yaml: flowToYaml(updatedNodes) })
      );
    },
    [nodes, edges, updateNodeAndEdges, saveWorkflow, workflow]
  );

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    console.debug("-- onDragOver --");
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      console.debug("-- onDrop --");
      event.preventDefault();

      if (
        !reactFlowWrapper.current ||
        !reactFlowInstance ||
        !blocks ||
        !workflow
      )
        return false;

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const transferData = event.dataTransfer.getData("application/reactflow");

      try {
        const transferObj = JSON.parse(
          transferData
        ) as NodeDragDropTransferObject;
        const { type, blockName } = transferObj;

        // check if the dropped element is valid
        if (typeof type === "undefined" || !type) {
          return;
        }

        const position = reactFlowInstance.project({
          x: event.clientX - reactFlowBounds.left,
          y: event.clientY - reactFlowBounds.top,
        });

        const id = newNodeId.current;
        newNodeId.current++;

        const nodeName = `${(() => {
          return `new-${id}`;
        })()}`;

        const block = blocks?.find((b) => b.name === blockName);

        if (!block) throw new Error("Unknown object type.");

        update(
          Object.assign({}, workflow, {
            yaml: flowToYaml(
              nodes.concat([
                createNode(
                  undefined,
                  {
                    pipelayer: position,
                    type: block.name,
                    name: nodeName,
                  },
                  blocks,
                  {}
                ) as unknown as Node<NodeData>,
              ])
            ),
          }),
          blocks
        );
        console.log("update complete.");
      } catch (e) {
        //
        console.error(e);
      }
    },
    [blocks, nodes, reactFlowInstance, update, workflow]
  );

  const nodeTypes = useMemo(
    () => ({
      blockNode: BlockNode,
    }),
    []
  );

  const onEmptyClick = useCallback(() => {
    setSelectedNode("");
    setShowEditor(false);
  }, [setSelectedNode, setShowEditor]);

  return (
    <ReactFlowProvider>
      <div className="h-full" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onInit={setReactFlowInstance}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onEdgeUpdateStart={onEdgeUpdateStart}
          onEdgeUpdate={onEdgeUpdate}
          onEdgeUpdateEnd={onEdgeUpdateEnd}
          onConnect={onConnect}
          onDragOver={onDragOver}
          onDrop={onDrop}
          nodeTypes={nodeTypes}
          connectionLineType={ConnectionLineType.SmoothStep}
          fitView
          onClick={onEmptyClick}
        >
          {/* <MiniMap /> */}
          <Controls />
          <Background />
        </ReactFlow>
      </div>
    </ReactFlowProvider>
  );
}

function AuthShowcase() {
  const { data: sessionData } = useSession();

  const fetchPreview = api.pulumi.preview.useMutation();
  const fetchUp = api.pulumi.up.useMutation();
  const fetchRefresh = api.pulumi.refresh.useMutation();
  const fetchDestroy = api.pulumi.destroy.useMutation();
  const cancelDeploy = api.pulumi.cancel.useMutation();

  const {
    busy,
    preview,
    isPreviewLoading,
    updatePreview,
    setPreviewLoading,
    setUpLoading,
    updateUp,
    up,
    isUpLoading,
    isPreviewDirty,
    setPreviewDirty,
    setShowErrorDialog,
  } = usePipeLayer((state) => state);

  const [showDeploy, setShowDeploy] = useState(false);
  const [showDestroy, setShowDestroy] = useState(false);

  const userBtn = useRef<HTMLDetailsElement>(null);
  const stackButton = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const closeButtons = () => {
      const buttons: HTMLElement[] = [];
      if (userBtn && userBtn.current) buttons.push(userBtn.current);
      if (stackButton && stackButton.current) buttons.push(stackButton.current);
      buttons.forEach((btn) => btn.removeAttribute("open"));
    };
    document.body.addEventListener("click", closeButtons);
    return () => {
      document.body.removeEventListener("click", closeButtons);
    };
  }, []);

  const showDeployModal = useCallback(
    (show: boolean) => () => {
      updateUp();
      setShowDeploy(show);
    },
    [updateUp]
  );

  const showDestroyModal = useCallback(
    (show: boolean) => () => setShowDestroy(show),
    []
  );

  const cancelDeployCb = useCallback(() => {
    const cb = async () => {
      const cancelled = await cancelDeploy.mutateAsync();
      if (cancelled.status === "error") {
        setShowErrorDialog(cancelled.exception || "");
      }
    };
    void cb();
  }, [cancelDeploy, setShowErrorDialog]);

  const stack: React.MouseEventHandler<HTMLButtonElement> = useCallback(
    (event) => {
      console.log("-- stack click --");
      const deploy = async () => {
        setUpLoading(true);
        setPreviewLoading(true);
        updateUp(await fetchUp.mutateAsync());
        updatePreview(await fetchPreview.mutateAsync());
        setPreviewDirty(false);
        setUpLoading(false);
        setPreviewLoading(false);
      };
      void deploy();
      event.preventDefault();
    },
    [
      fetchPreview,
      fetchUp,
      setPreviewDirty,
      setPreviewLoading,
      setUpLoading,
      updatePreview,
      updateUp,
    ]
  );

  const refreshCb = useCallback(
    (event?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      const prev = async () => {
        setPreviewLoading(true);
        updatePreview(await fetchPreview.mutateAsync());
        setPreviewDirty(false);
        setPreviewLoading(false);
        if (event) event.preventDefault();
      };
      void prev();
    },
    [fetchPreview, setPreviewDirty, setPreviewLoading, updatePreview]
  );

  const onSynchronizeClick = useCallback(() => {
    const sync = async () => {
      setPreviewLoading(true);
      await fetchRefresh.mutateAsync();
      refreshCb();
    };
    void sync();
  }, [fetchRefresh, refreshCb, setPreviewLoading]);

  const destroyCb = useCallback(() => {
    const des = async () => {
      setPreviewLoading(true);
      const destroy = await fetchDestroy.mutateAsync();
      console.log(destroy);
      if (destroy.status === "error") {
        setShowErrorDialog(destroy.exception);
      } else setShowDestroy(false);
      refreshCb();
    };
    void des();
  }, [fetchDestroy, refreshCb, setPreviewLoading, setShowErrorDialog]);

  const onSignOutClick: React.MouseEventHandler<HTMLAnchorElement> =
    useCallback((event) => {
      event.stopPropagation();
      void signOut();
    }, []);

  const stopPropagation: React.MouseEventHandler<unknown> = useCallback(
    (event) => event.stopPropagation(),
    []
  );

  const changes = useMemo(() => {
    if (!preview || preview.status !== "ok") return 0;
    return (
      (preview.payload.changeSummary.create || 0) +
      (preview.payload.changeSummary.update || 0) +
      (preview.payload.changeSummary.replace || 0) +
      (preview.payload.changeSummary.delete || 0)
    );
  }, [preview]);

  const deployTexts = useMemo(() => {
    if (!preview || preview.status !== "ok")
      return { summary: [], details: [] };
    const summary: string[] = [];
    if (preview.payload.changeSummary.create)
      summary.push(
        `${preview.payload.changeSummary.create} new resources will be created`
      );
    if (preview.payload.changeSummary.update)
      summary.push(
        `${preview.payload.changeSummary.update} resources will be modified`
      );
    if (preview.payload.changeSummary.replace)
      summary.push(
        `${preview.payload.changeSummary.replace} resources will be replaced`
      );
    if (preview.payload.changeSummary.delete)
      summary.push(
        `${preview.payload.changeSummary.delete} resources will be deleted`
      );
    if (preview.payload.changeSummary.same)
      summary.push(
        `${preview.payload.changeSummary.same} resources are unchanged`
      );
    return { summary, details: preview.payload.stdout.split("\n") };
  }, [preview]);

  return (
    <div className="flex items-center justify-center gap-4">
      {sessionData && (
        <>
          {/* <a
            className="flex items-center rounded-full bg-sky-500 px-5 py-3 font-semibold text-white no-underline transition hover:bg-sky-500"
            href="http://localhost:57932/"
            target="_blank"
          >
            <Image
              className="mr-2"
              src="/kafka.svg"
              alt="Kafka Topic"
              width={12.5}
              height={20}
            />
            Kafka UI
          </a> */}

          <details ref={stackButton} className="dropdown-end dropdown">
            <summary className="btn m-1 bg-blue-200">
              <ServerStackIcon className="h-7 w-7 text-sky-500" />
              <span className="sr-only">Active Changes</span>
              {!isPreviewLoading && !isPreviewDirty && changes > 0 && (
                <div className="absolute -right-2 -top-2 inline-flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-green-500 text-xs font-bold text-white dark:border-gray-900">
                  {changes}
                </div>
              )}
              {isPreviewLoading && (
                <div className="absolute -right-2 -top-2 inline-flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-blue-100 text-xs font-bold text-white dark:border-gray-900">
                  <span className="loading loading-spinner loading-xs text-blue-800" />
                </div>
              )}
              {!isPreviewLoading && isPreviewDirty && (
                <div className="absolute -right-2 -top-2 inline-flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-yellow-500 text-xs font-bold text-white dark:border-gray-900">
                  !
                </div>
              )}
            </summary>
            <ul className="menu dropdown-content rounded-box z-[1] w-52 bg-base-100 p-2 shadow">
              <li>
                <button
                  className="disabled:opacity-40"
                  onClick={showDeployModal(true)}
                  disabled={changes === 0 || busy}
                >
                  <RocketLaunchIcon className="h-5 w-5" />
                  Deploy
                </button>
              </li>
              <li>
                <button
                  className="disabled:opacity-40"
                  onClick={refreshCb}
                  disabled={busy}
                >
                  <ArrowPathIcon className="h-5 w-5" />
                  Refresh
                  {isPreviewDirty && (
                    <div className="absolute right-2 inline-flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-yellow-500 text-xs font-bold text-white dark:border-gray-900">
                      !
                    </div>
                  )}
                </button>
              </li>
              <li>
                <div className="divider pointer-events-none m-0 p-2" />
              </li>
              <li>
                <button
                  className="disabled:opacity-40"
                  onClick={onSynchronizeClick}
                  disabled={busy}
                >
                  <ArrowDownOnSquareIcon className="h-5 w-5" />
                  Synchronize
                </button>
              </li>
              <li>
                <button
                  className="hover:bg-red-200 disabled:opacity-40"
                  onClick={showDestroyModal(true)}
                  disabled={busy}
                >
                  <TrashIcon className="h-5 w-5" />
                  Destroy
                </button>
              </li>
            </ul>
          </details>

          <details
            ref={userBtn}
            className="dropdown-end dropdown"
            onClick={stopPropagation}
          >
            <summary className="btn m-1">
              {(sessionData.user.image && (
                <Image
                  src={sessionData.user.image}
                  className="rounded-full"
                  width={32}
                  height={32}
                  alt="User Profile Picture"
                />
              )) ||
                sessionData.user.name}
            </summary>
            <ul className="menu dropdown-content rounded-box z-[1] w-52 bg-base-100 p-2 shadow">
              <li>
                <a onClick={onSignOutClick}>Sign out</a>
              </li>
            </ul>
          </details>
        </>
      )}
      {!sessionData && (
        <div className="">
          <button
            className="rounded-full bg-sky-500/50 px-5 py-3 font-semibold text-white no-underline transition hover:bg-sky-500"
            onClick={() => void signIn()}
          >
            Sign in
          </button>
        </div>
      )}

      <dialog className={`modal ${showDeploy ? "modal-open" : ""}`}>
        <div className="prose modal-box w-11/12 max-w-5xl">
          <h3>Deploy</h3>
          {!isUpLoading && !up && (
            <>
              <div className="alert alert-warning">
                <ExclamationCircleIcon className="h-6 w-6" />
                WARNING: You are about to make changes to your infrastructure.
              </div>
              <div className="collapse-arrow collapse mt-2 bg-base-200">
                <input
                  type="radio"
                  name="deploy-summary-details"
                  checked
                  readOnly
                />
                <h4 className="collapse-title m-0">Summary of changes</h4>
                <div className="collapse-content border-t-[1px] bg-white p-0">
                  <ul className="m-0 ml-5 mt-2">
                    {deployTexts.summary.map((text, idx) => (
                      <li key={idx} className="m-0 text-sm">
                        {text}
                        {idx === deployTexts.summary.length - 1 ? "." : ","}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="collapse-arrow collapse mt-2 bg-base-200">
                <input type="radio" name="deploy-summary-details" />
                <h4 className="collapse-title m-0">Details</h4>
                <div className="collapse-content border-t-[1px] bg-white p-0">
                  <div className="mockup-code max-h-[500px] overflow-scroll">
                    {deployTexts.details.map((text, idx) => (
                      <pre key={idx}>
                        <code>{text}</code>
                      </pre>
                    ))}
                  </div>
                </div>
              </div>
              <div className="modal-action">
                <form method="dialog" className="space-x-2">
                  <button className="btn btn-primary" onClick={stack}>
                    Deploy
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={showDeployModal(false)}
                  >
                    Cancel
                  </button>
                </form>
              </div>
            </>
          )}
          {isUpLoading && (
            <div className="flex flex-col items-center">
              <div className="alert alert-info">
                <InformationCircleIcon className="h-6 w-6" />
                Deployment is underway, the backend does not keep track of jobs
                so if you are disconnected or if the request times out, it may
                still be active on the server. Backend jobs are not yet
                implemented.
              </div>
              <p>This may take awhile.</p>
              <span className="loading loading-infinity loading-lg"></span>
              <div className="modal-action">
                <form method="dialog" className="space-x-2">
                  <button
                    className="btn btn-secondary disabled:opacity-40"
                    onClick={cancelDeployCb}
                    disabled={cancelDeploy.isLoading}
                  >
                    Cancel
                  </button>
                </form>
              </div>
            </div>
          )}
          {!isUpLoading && up && up.status === "error" && (
            <>
              <div className="flex flex-col items-center">
                <div className="alert alert-error">
                  <InformationCircleIcon className="h-6 w-6" />
                  Deployment failure.
                </div>
                <ul className="max-h-[500px] overflow-scroll">
                  {up.diagnostics
                    .reduce((p, c) => {
                      if (!p.includes(`${c.prefix || ""} ${c.message}`))
                        p.push(`${c.prefix || ""} ${c.message}`);
                      return p;
                    }, [] as string[])
                    .map((message, idx) => (
                      <li key={idx}>{message}</li>
                    ))}
                </ul>
              </div>
              <div className="modal-action">
                <form method="dialog" className="space-x-2">
                  <button
                    className="btn btn-primary disabled:opacity-40"
                    onClick={stack}
                    disabled={busy}
                  >
                    Try Again
                  </button>
                  <button
                    className="btn disabled:opacity-40"
                    onClick={onSynchronizeClick}
                    disabled={busy}
                  >
                    Synchronize
                  </button>
                  <button
                    className="btn btn-secondary disabled:opacity-40"
                    onClick={showDeployModal(false)}
                    disabled={busy}
                  >
                    Cancel
                  </button>
                </form>
              </div>
            </>
          )}
          {!isUpLoading && up && up.status !== "error" && (
            <>
              <div className="flex flex-col items-center">
                <div className="alert alert-success">
                  <RocketLaunchIcon className="h-6 w-6" />
                  Deployment successful.
                </div>
              </div>
              <div className="modal-action">
                <form method="dialog" className="space-x-2">
                  <button
                    className="btn btn-primary disabled:opacity-40"
                    onClick={showDeployModal(false)}
                    disabled={busy}
                  >
                    Ok
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      </dialog>

      <dialog className={`modal ${showDestroy ? "modal-open" : ""}`}>
        <div className="prose modal-box w-11/12 max-w-5xl">
          <h3>Down</h3>
          <p>This will delete all infrastructure created by Pipelayer.</p>
          <div className="alert alert-error">
            <ExclamationCircleIcon className="h-6 w-6" />
            WARNING: This action is irreversible.
          </div>
          {fetchDestroy.isLoading && (
            <div className="mt-5 flex flex-col items-center">
              <div className="alert alert-info">
                <InformationCircleIcon className="h-6 w-6" />
                Destroy operation is underway, the backend does not keep track
                of jobs so if you are disconnected or if the request times out,
                it may still be active on the server. Backend jobs are not yet
                implemented.
              </div>
              <p>This may take awhile.</p>
              <span className="loading loading-infinity loading-lg"></span>
            </div>
          )}
          <div className="modal-action">
            <form method="dialog" className="space-x-2">
              <button
                className="btn btn-error"
                onClick={destroyCb}
                disabled={fetchDestroy.isLoading}
              >
                Down
              </button>
              <button
                className="btn"
                onClick={showDestroyModal(false)}
                disabled={fetchDestroy.isLoading}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
}
