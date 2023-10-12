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
} from "~/types";

import ModelTheme from "survey-core/themes/flat-light-panelless";
import { type Workflow } from "@prisma/client";

const edgeType = "smoothstep";

const NODE_START_POSITION = {
  x: 150,
  y: 5,
};

const isWorkerNode = (node?: Node<NodeData>) =>
  node &&
  node.type === "blockNode" &&
  (node.data.block.type === "worker" || node.data.block.type === "gpu-worker");

const isTopicNode = (node?: Node<NodeData>) =>
  node && node.type === "blockNode" && node.data.payload.type === "topic";

const isValidConnection = (conn: Connection, nodes: Node[]) => {
  const source = nodes.find((n) => n.id === conn.source);
  const target = nodes.find((n) => n.id == conn.target);

  return (
    (isWorkerNode(source) && isTopicNode(target)) ||
    (isTopicNode(source) && isWorkerNode(target))
  );
};

const add_topic_array = (
  payload: NodeDataPayload<unknown>,
  prop: "producer.topics" | "consumer.topics",
  sources: (Node<NodeData> | undefined)[]
) => {
  const topics: string[] = [];
  for (const source of sources) {
    if (source) topics.push(source.data.payload.name);
  }
  payload[prop] = topics.length > 0 ? topics : undefined;
};

const topicLinkNodesFromEdges = (
  nodes: Node<NodeData>[],
  edges: Edge[]
): Node[] => {
  return nodes.map((node) => {
    if (node.type === "blockNode") {
      if (isWorkerNode(node)) {
        const nn = Object.assign({}, node);
        const producers = edges
          .filter((e) => e.source === nn.id)
          .map((e) => nodes.find((n) => n.id === e.target));
        const consumers = edges
          .filter((e) => e.target === nn.id)
          .map((e) => nodes.find((n) => n.id === e.source));

        add_topic_array(nn.data.payload, "producer.topics", producers);
        add_topic_array(nn.data.payload, "consumer.topics", consumers);

        nn.data.model.data = nn.data.payload;
        return nn;
      }
    }
    return node;
  });
};

const filterPrivateData = (
  data: Partial<NodeDataPayload<unknown>>
): NodeDataPayload<unknown> => {
  const filteredData: NodeDataPayloadPrivateStorageNode<typeof data> = [];
  let key: keyof typeof data;
  const private_keys = Object.keys(data)
    .filter((key: string) => key.endsWith("@private"))
    .map((key) => key.substring(0, key.length - 8));
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
          withoutBlockDefaults(node.data.payload, node.data.block)
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
    const linked = nodes.find((n) => n.data.payload.name === name)?.id;
    if (!linked) return; // TODO; handle validation error
    const edge_id = `${subject}--${field.direction}--${linked}`;
    edges.push({
      id: edge_id,
      source: field.direction === "in" ? linked : subject,
      target: field.direction === "in" ? subject : linked,
      markerEnd: { type: MarkerType.ArrowClosed },
      style: {
        strokeWidth: 2,
      },
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

// const isMapEmpty = (path: string[], node: any) =>
//   !node.getIn ||
//   !node.hasIn(path) ||
//   !node.getIn(path) ||
//   !node.getIn(path).items ||
//   node.getIn(path).items.length === 0 ||
//   node.getIn(path).items[0].value === null;

// const validatePipelayerYaml = (yaml: string, strict?: boolean) => {
//   const doc = YAML.parseDocument<any>(yaml);
//   // Validation
//   const contents = doc.contents;
//   if (!contents) {
//     throw new Error("Empty document");
//   }
//   if (!contents.has("main")) {
//     throw new Error("No main defined!");
//   }

//   const topics: string[] = [];

//   if (
//     contents.hasIn(["main", "topics"]) &&
//     contents.getIn(["main", "topics"], true).items
//   ) {
//     contents.getIn(["main", "topics"], true).items.forEach((topic) => {
//       const line =
//         (yaml.slice(0, topic.key.range[0]).match(/\n/g)?.length || 0) + 1;
//       if (!topic.value) {
//         throw new Error(
//           `Malformed topic on line ${line} near "${topic.key.source}"`
//         );
//         // } else if (
//         //   topic.value.value !== null &&
//         //   topic.value.constructor.name !== "YAMLMap"
//         // ) {
//         //   throw new Error(
//         //     `Malformed topic map on line ${line} near "${topic.key.source}"`
//         //   );
//       }
//       topics.push(topic.key.value);
//     });
//   }

//   if (
//     contents.hasIn(["main", "flows"]) &&
//     contents.getIn(["main", "flows"], true).items
//   ) {
//     contents.getIn(["main", "flows"], true).items.forEach((flow: any) => {
//       if (flow.value === null) {
//         const line =
//           (yaml.slice(0, flow.range[0]).match(/\n/g)?.length || 0) + 1;
//         throw new Error(`Malformed flow on line ${line} near "${flow.source}"`);
//       }
//       contents.getIn(["main", "flows"], true).items.forEach((node: any) => {
//         const line =
//           (yaml.slice(0, node.range[0]).match(/\n/g)?.length || 0) + 1;
//         if (
//           !node.get ||
//           (node.value && node.value.constructor.name !== "YAMLMap")
//         ) {
//           throw new Error(
//             `Malformed flow object on line ${line} near "${node.source}"`
//           );
//         }
//         if (node.value !== null && !node.get("name")) {
//           throw new Error(`Flow is missing name property, line ${line}.`);
//         }
//         if (strict && isMapEmpty(["consumer", "topics"], node)) {
//           throw new Error(`flow has no consumer topics, line ${line}.`);
//         }
//         if (!isMapEmpty(["consumer", "topics"], node)) {
//           node.getIn(["consumer", "topics"]).items.forEach((topic: any) => {
//             if (topic.items) {
//               if (!topics.includes(topic.items[0].key.value)) {
//                 throw new Error(
//                   `producer references topic ${topic.value} but topic does not exist, line ${line}.`
//                 );
//               }
//               return;
//             }
//             if (!topics.includes(topic.value)) {
//               throw new Error(
//                 `consumer references topic ${topic.value} but topic does not exist, line ${line}.`
//               );
//             }
//           });
//         }
//         if (strict && isMapEmpty(["producer", "topics"], node)) {
//           throw new Error(`flow has no producer topics, line ${line}.`);
//         }
//         if (!isMapEmpty(["producer", "topics"], node)) {
//           node.getIn(["producer", "topics"]).items.forEach((topic: any) => {
//             if (topic.items) {
//               if (!topics.includes(topic.items[0].key.value)) {
//                 throw new Error(
//                   `producer references topic ${topic.value} but topic does not exist, line ${line}.`
//                 );
//               }
//               return;
//             }
//             if (!topics.includes(topic.value)) {
//               throw new Error(
//                 `producer references topic ${topic.value} but topic does not exist, line ${line}.`
//               );
//             }
//           });
//         }
//       });
//     });
//     // throw new Error("No topics steps defined!");
//   }
// };

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
          if ("provides" in field && field.provides === "kafka-topic") {
            createFieldEdge(node, field, nodes, edges);
          }
        }
      });
    });
  });

  return { nodes, edges };
};

// const addYaml = (yaml: string, path: string[], doc: any) => {
//   const blk = YAML.parseDocument(yaml);
//   const key = blk.contents.items[0].key.value;
//   doc.addIn(path.concat(key), "tmp");
//   const parent = doc.getIn(path);
//   parent.items[parent.items.length - 1] = blk.contents.items[0];
//   return key;
// };

// const toDocker = (yaml: string) => {
//   const workflow = YAML.parseDocument<any>(yaml);
//   const contents = workflow.contents;
//   if (!contents) throw new Error("Empty document");

//   const compose = {
//     version: "3.8",
//     services: {},
//     networks: { backend: { name: "backend" } },
//   };
//   const doc = new Document(compose);

//   // TODO: link depends_on based on flow

//   const topics: string[] = [];
//   contents.getIn(["main", "topics"])?.items?.forEach((topic) => {
//     topics.push(topic.key.value);
//   });

//   let last_main_service = "";

//   if (contents.has("main")) {
//     for (const unit in mainUnit) {
//       if (!unit.startsWith("__")) {
//         last_main_service = addYaml(
//           mainUnit[unit]({ topics }),
//           ["services"],
//           doc
//         );
//       }
//     }

//     doc.contents.get("services", true).commentBefore = mainUnit.__comment();

//     if (contents.hasIn(["main", "flows"])) {
//       // services.get(services.items.length - 1, true).value.comment = workerUnit.__comment();
//       doc.getIn(["services", last_main_service], true).comment =
//         workerUnit.__comment();

//       // services.items[services.items.length - 1].value.comment= workerUnit.__comment();

//       contents.getIn(["main", "flows"], true)?.items?.forEach((flow) => {
//         const name = flow.get("name");
//         if (flow.hasIn(["worker", "type"])) {
//           const type = flow.getIn(["worker", "type"]);
//           if (type === "python") {
//             addYaml(workerUnit.python({ name }), ["services"], doc);
//           } else if (type === "pytorch") {
//             const device_ids = flow.get("device_ids") || ["0"];
//             addYaml(
//               workerUnit.pytorch({ name, device_ids }),
//               ["services"],
//               doc
//             );
//           }
//         }
//       });
//     }

//     // if (contents.hasIn(["main", "workers"])) {
//     //   // services.get(services.items.length - 1, true).value.comment = workerUnit.__comment();
//     //   doc.getIn(["services", last_main_service], true).comment =
//     //     workerUnit.__comment();

//     //   // services.items[services.items.length - 1].value.comment= workerUnit.__comment();

//     //   contents.getIn(["main", "workers"], true)?.items.forEach((worker) => {
//     //     // if (worker.get("type")) {
//     //     const name = worker.key.value;
//     //     if (worker.value.has("type")) {
//     //       if (worker.value.get("type") === "python") {
//     //         addYaml(workerUnit.python({ name }), ["services"], doc);
//     //       } else if (worker.value.get("type") === "pytorch") {
//     //         const device_ids = worker.value.get("device_ids") || ["0"];
//     //         addYaml(
//     //           workerUnit.pytorch({ name, device_ids }),
//     //           ["services"],
//     //           doc
//     //         );
//     //       }
//     //     }
//     //     // }
//     //   });
//     // }
//   }

//   doc.contents.get("networks", true).commentBefore = `
// ################################################################################

//   networks
//   - backend

// ################################################################################`;
//   doc.contents.commentBefore = `
//   This file was automatically generated by PipeLayer.

//   Its contents cannot be modified within this interface.
//   `;
//   return doc.toString();
// };

export {
  topicLinkNodesFromEdges,
  yamlToFlow,
  flowToYaml,
  withBlockDefaults,
  withoutBlockDefaults,
  // toDocker,
  // validatePipelayerYaml,
  isValidConnection,
  getPrivateData,
  createNode,
};
