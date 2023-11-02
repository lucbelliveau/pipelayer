import { MarkerType, type Edge, type Node, type Connection } from "reactflow";
import YAML, { Document } from "yaml";
import { Model, type ITheme } from "survey-core";
import { v4 as uuidv4 } from "uuid";

import { type PipeLayerFlow } from "./workflow.d";

import { createModelFromBlockConfig } from "~/pipelayer";
import {
  type NodeDataPayload,
  type NodeData,
  type NodeDataPayloadPrivateStorageNode,
  type PipelayerWorkflow,
  type BlockConfig,
  type BlockConfiguration,
  type NodeDataPayloadPrivateStorage,
  type BlockConfigurationField,
  type ProvidedResourceType,
} from "~/types";

import ModelTheme from "survey-core/themes/flat-light-panelless";
import { type Workflow } from "@prisma/client";

const edgeType = "smoothstep";

const NODE_START_POSITION = {
  x: 150,
  y: 5,
};

const isValidConnection = (conn: Connection) => {
  return conn.sourceHandle === conn.targetHandle;
  return false;
};

const update_connected_field_values = (
  payload: NodeDataPayload<unknown>,
  prop: "producer.topics" | "consumer.topics",
  sources: (Node<NodeData> | undefined)[],
  type: "multiple" | "dropdown"
) => {
  const values: string[] = [];
  for (const source of sources) {
    if (source) values.push(source.data.payload.name);
  }
  payload[prop] =
    values.length > 0
      ? type === "dropdown"
        ? (values[0] as unknown as string[])
        : values
      : undefined;
};

const updateWorkflowFromEdges = (
  nodes: Node<NodeData>[],
  edges: Edge[]
): Node[] => {
  return nodes.map((node) => {
    const fields = node.data.block.configuration?.reduce(
      (p, conf) =>
        p.concat(
          conf.fields.filter((field) => "provides" in field && field.provides)
        ),
      [] as BlockConfigurationField<unknown>[]
    );
    if (fields) {
      const nn = Object.assign({}, node);
      fields.forEach((field) => {
        if ("direction" in field) {
          const dir = field.direction === "in" ? "target" : "source";
          const odir = dir === "target" ? "source" : "target";
          const links = edges
            .filter(
              (e) => e[dir] === node.id && e.sourceHandle === field.provides
            )
            .map((e) => nodes.find((n) => n.id === e[odir]));
          update_connected_field_values(
            nn.data.payload,
            field.name,
            links,
            field.type
          );
          nn.data.model.data = nn.data.payload;
        }
      });
      return nn;
    }
    return node;
  });
};

const filterPrivateData = (
  data: Partial<NodeDataPayload<unknown>>,
  block: BlockConfig<BlockConfiguration<never>>
): NodeDataPayload<unknown> => {
  const filteredData: NodeDataPayloadPrivateStorageNode<typeof data> = [];
  let key: keyof typeof data;
  // Any keys in the payload marked with @private should be removed, as well
  // as any fields marked as @private from the field configuration.
  const private_keys = Object.keys(data)
    .filter((key: string) => key.endsWith("@private"))
    .map((key) => key.substring(0, key.length - 8))
    .concat(
      block.configuration?.reduce(
        (p, conf) =>
          p.concat(
            conf.fields
              .filter((field) => (field.name as string).endsWith("@private"))
              .map((field) =>
                (field.name as string).substring(
                  0,
                  (field.name as string).length - 8
                )
              )
          ),
        [] as string[]
      ) || []
    );
  for (key in data) {
    if (key.endsWith("@private") || private_keys.includes(key)) {
      console.debug(`-- removing private data -- [${key}]`);
    } else {
      if (key !== "pipelayer") filteredData.push([key, data[key]]);
    }
  }
  const d = Object.fromEntries(filteredData);
  return Object.assign(d, {
    pipelayer: data.pipelayer,
  }) as unknown as NodeDataPayload<unknown>;
};

const getPrivateData = (nodes: Node<NodeData>[]): string => {
  const storage: NodeDataPayloadPrivateStorage<never> = {};
  nodes.forEach((node) => {
    const privateData: NodeDataPayloadPrivateStorageNode<
      typeof node.data.payload
    > = [];
    let key: keyof typeof node.data.payload;
    for (key in node.data.payload) {
      if (key === "pipelayer") continue;
      if (key.endsWith("@private")) {
        const dataKey = key.substring(
          0,
          key.length - 8
        ) as keyof typeof node.data.payload;
        privateData.push([dataKey, node.data.payload[key]]);
      }
    }
    if (privateData.length > 0) storage[node.id] = privateData;
  });
  return JSON.stringify(storage);
};

const flowToYaml = (nodes: Node<NodeData>[]): string => {
  const workflow: PipelayerWorkflow = {
    main: { flows: [], topics: {}, platform: [], cloud: [], avro: [] },
  };
  nodes.forEach((node) => {
    if (node.type === "blockNode") {
      const record = {
        ...filterPrivateData(
          withoutBlockDefaults(node.data.payload, node.data.block),
          node.data.block
        ),
        pipelayer: { x: node.position.x, y: node.position.y },
      };
      if (
        node.data.block.type === "cloud" ||
        node.data.block.type === "platform" ||
        node.data.block.type === "avro"
      ) {
        workflow.main[node.data.block.type]?.push(record);
      } else if (
        node.data.block.type === "worker" ||
        node.data.block.type === "gpu-worker"
      ) {
        workflow.main.flows.push(record);
      } else if (node.data.block.type === "topic") {
        workflow.main.topics[node.data.payload.name] = record;
      }
    }
  });

  const doc = new Document(workflow);

  // Restore comments
  // const topics = doc.getIn(["main", "topics"], true) as YAMLSeq;
  // const workers = doc.getIn(["main", "workers"], true) as YAMLSeq;
  // if (topics && workers) {
  //   nodes
  //     .filter((n) => n.data.comment)
  //     .forEach((node) => {
  //       let root: YAMLSeq | undefined = undefined;
  //       if (node.type === "topicNode") root = topics;
  //       if (node.type === "workerNode" || node.type === "joinNode") root = workers;
  //       const id = Object.keys(node.data.payload)[0];
  //       if (root && id) {
  //         const obj = root.get(id, true);
  //         if
  //         root.get(id, true).commentBefore = node.data.comment;

  //       }
  //     });
  // }
  // return JSON.stringify(nodes, null, 2);
  return doc.toString();
};

const edgeColors: { [key in ProvidedResourceType]: string } = {
  ["kafka-topic"]: "orange",
  ["provider-kubernetes"]: "lime",
  ["provider-kafka"]: "blue",
  ["data-contract"]: "orangered",
  postgres: "blueviolet",
};

const edgeStyles: { [key in ProvidedResourceType]: React.CSSProperties } = {
  ["kafka-topic"]: { strokeWidth: 2, stroke: edgeColors["kafka-topic"] },
  ["provider-kubernetes"]: {
    strokeWidth: 1,
    stroke: edgeColors["provider-kubernetes"],
  },
  ["provider-kafka"]: { strokeWidth: 1, stroke: edgeColors["provider-kafka"] },
  ["data-contract"]: { strokeWidth: 1, stroke: edgeColors["data-contract"] },
  postgres: { strokeWidth: 1, stroke: edgeColors["postgres"] },
};

const createFieldEdge = (
  node: Node<NodeData>,
  field: BlockConfigurationField<unknown>,
  nodes: Node<NodeData>[],
  edges: Edge[]
) => {
  if (!("direction" in field)) return;
  const subject = node.id;

  const names = Array.isArray(node.data.payload[field.name])
    ? node.data.payload[field.name]
    : [node.data.payload[field.name]];

  names.forEach((name) => {
    const linked = nodes.find((n) => n.data.payload.name === name);
    if (!linked) return; // TODO; handle validation error
    const edge_id = `${subject}--${field.direction}--${linked.id}`;

    if (edges.map((edge) => edge.id).includes(edge_id)) return;

    edges.push({
      id: edge_id,
      source: field.direction === "in" ? linked.id : subject,
      sourceHandle: field.provides,
      target: field.direction === "in" ? subject : linked.id,
      targetHandle: field.provides,
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: edgeColors[field.provides],
      },
      style: edgeStyles[field.provides],
      type: edgeType,
    });
  });
};

let { x: node_x, y: node_y } = NODE_START_POSITION;
const addNode = (
  payload: Partial<Omit<NodeDataPayload<unknown>, "model">>,
  nodes: Node<Partial<NodeData>>[],
  blocks: BlockConfig<BlockConfiguration<never>>[],
  storage: NodeDataPayloadPrivateStorage<never>
) => {
  if (!payload.name || !payload.type) return;

  node_x = payload.pipelayer?.x || node_x + 10 * payload.name.length;
  node_y = payload.pipelayer?.y || node_y + 75 * payload.name.length;
  const pipelayer = { x: node_x, y: node_y };

  const partial_payload: Omit<NodeDataPayload<unknown>, "model" | "id"> = {
    ...payload,
    name: payload.name,
    type: payload.type,
    pipelayer,
  };
  const node = createNode(payload.id, partial_payload, blocks, storage);
  nodes.push(node);
};

const createNode = (
  node_id: string | undefined,
  payload: Omit<NodeDataPayload<unknown>, "model" | "id">,
  blocks: BlockConfig[],
  storage: NodeDataPayloadPrivateStorage<never>
) => {
  const block = blocks.find((b) => b.name === payload.type) as
    | BlockConfig<unknown>
    | undefined;

  if (!block) {
    throw new Error(`Unknown block type: ${payload.type}`);
  }

  const id = node_id || uuidv4();

  const nodeStorage = storage[id] || [];
  for (let x = nodeStorage.length - 1; x >= 0; x -= 1) {
    const entry = nodeStorage[x];
    if (entry) nodeStorage.push([`${String(entry[0])}@private`, entry[1]]);
  }

  const ret: Node<Partial<NodeData>> = {
    id,
    position: { x: payload.pipelayer.x, y: payload.pipelayer.y },
    type: "blockNode",
    data: {
      block,
      payload: { id, ...payload, ...Object.fromEntries(nodeStorage) },
    },
  };

  return ret;
};

const withoutBlockDefaults = (
  payload: NodeDataPayload<unknown>,
  block: BlockConfig<BlockConfiguration<never>>
) => {
  const obj = Object.assign({}, payload);
  block.configuration?.forEach((conf) => {
    conf.fields.forEach((field) => {
      const k = field.name as keyof typeof payload;
      if (k in payload && "default" in field && payload[k] === field.default) {
        delete obj[k];
        // obj = Object.assign({}, obj, {
        //   [field.name]: field.default,
        // });
      }
    });
  });
  return obj;
};

const withBlockDefaults = (
  payload: NodeDataPayload<unknown>,
  block: BlockConfig<BlockConfiguration<never>>
) => {
  let obj = Object.assign({}, payload);
  block.configuration?.forEach((conf) => {
    conf.fields.forEach((field) => {
      if (!(field.name in payload) && "default" in field) {
        obj = Object.assign({}, obj, {
          [field.name]: field.default,
        });
      }
    });
  });
  return obj;
};

const yamlToFlow = (
  workflow: Workflow,
  blocks: BlockConfig<BlockConfiguration<never>>[]
): PipeLayerFlow => {
  const nodes: Node<NodeData>[] = [];
  const edges: Edge[] = [];

  const doc = YAML.parseDocument(workflow.yaml);
  const contents = doc.contents;
  if (!contents) return { nodes, edges };

  // const comment = idx === 0 ? topics.commentBefore : node.commentBefore;

  const json: PipelayerWorkflow = contents.toJSON() as PipelayerWorkflow;

  const storage = JSON.parse(
    workflow.storage || "{}"
  ) as NodeDataPayloadPrivateStorage<never>;

  node_x = NODE_START_POSITION.x;
  node_y = NODE_START_POSITION.y;

  const topics: Partial<Omit<NodeDataPayload<unknown>, "model">>[] = [];
  for (const topicName in json.main.topics) {
    topics.push({ name: topicName, ...json.main.topics[topicName] });
  }
  [
    ...topics,
    ...json.main.flows,
    ...json.main.platform,
    ...(json.main.cloud || []),
    ...(json.main.avro || []),
  ].forEach((node) => {
    addNode(node, nodes, blocks, storage);
  });
  nodes.forEach((node) => {
    const model = new Model(createModelFromBlockConfig(node.data.block, nodes));

    model.applyTheme(ModelTheme as ITheme);
    node.data.model = model;
    model.data = node.data.payload;

    model.data = withBlockDefaults(
      model.data as NodeDataPayload<unknown>,
      node.data.block
    );

    node.data.block.configuration?.forEach((conf) => {
      conf.fields.forEach((field) => {
        if (field.type === "multiple" || field.type === "dropdown") {
          if ("provides" in field) {
            createFieldEdge(node, field, nodes, edges);
          }
        }
      });
    });
  });

  return { nodes, edges };
};

export {
  updateWorkflowFromEdges,
  yamlToFlow,
  flowToYaml,
  withBlockDefaults,
  withoutBlockDefaults,
  // toDocker,
  // validatePipelayerYaml,
  isValidConnection,
  getPrivateData,
  createNode,
  edgeStyles,
  edgeColors,
  edgeType,
};
