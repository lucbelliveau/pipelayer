#!/usr/bin/env node
console.log("testing 1234678!");
import * as pulumi from "@pulumi/pulumi";

// import { type Workflow } from "@prisma/client";
// import { yamlToProgram } from "~/server/api/routers/pulumi";
// import { blocks } from "~/server/blocks";

// const workflow: Workflow = {
//   id: "--cli-input--",
//   userId: "CLI",
//   name: "cli",
//   storage: "", // We could add env vars here
//   createdAt: new Date(),
//   updatedAt: new Date(),
//   yaml: `
// main:
//   flows: []
//   topics: {}
//   platform:
//     - id: d8acb695-a255-4031-9190-4118a007474f
//       type: pipelayer
//       name: NB
//       cluster:
//         - Local
//       kafka.ui.username: kafkaui
//       kafka.ui.password: phac@2023
//       kafka.replicas: 4
//       zookeeper.replicas: 4
//       postgres.username: admin
//       postgres.password: admin
//       neo4j.username: admin
//       neo4j.password: admin
//       pipelayer:
//         x: -374.47396930700927
//         y: -2287.410915385568
//     - id: 1a176eda-e609-43c4-bffc-55e45aa3b435
//       type: pipelayer
//       name: NL
//       cluster:
//         - Local
//       kafka.ui.username: kafkaui
//       kafka.ui.password: phac@2023
//       kafka.replicas: 4
//       zookeeper.replicas: 4
//       postgres.username: admin
//       postgres.password: admin
//       neo4j.username: admin
//       neo4j.password: admin
//       pipelayer:
//         x: -377.17674842405
//         y: -2409.035975652403
//     - id: 87cbd88a-172d-4b02-a27c-b1ae637a9f65
//       type: pipelayer
//       name: PEI
//       cluster:
//         - Local
//       kafka.ui.username: kafkaui
//       kafka.ui.password: phac@2023
//       kafka.replicas: 4
//       zookeeper.replicas: 4
//       postgres.username: admin
//       postgres.password: admin
//       neo4j.username: admin
//       neo4j.password: admin
//       pipelayer:
//         x: -425.82677253078407
//         y: -2113.081662336437
//     - id: 2fd366d5-0168-40be-aad5-fced11f82a90
//       type: pipelayer
//       name: NS
//       cluster:
//         - Local
//       kafka.ui.username: kafkaui
//       kafka.ui.password: phac@2023
//       kafka.replicas: 4
//       zookeeper.replicas: 4
//       postgres.username: admin
//       postgres.password: admin
//       neo4j.username: admin
//       neo4j.password: admin
//       pipelayer:
//         x: -377.17674842405
//         y: -1904.9676703242967
//   cloud:
//     - id: bb8a2739-b07a-4fe8-b5bc-4f20bc40b127
//       type: Kubernetes
//       name: Local
//       useLocal: true
//       pipelayer:
//         x: 273.5845231045581
//         y: -2339.6834669476784
//   avro: []

// `,
// };

// const program = yamlToProgram(workflow, blocks);

// console.log("testing 1234678!");

// console.log(program);
