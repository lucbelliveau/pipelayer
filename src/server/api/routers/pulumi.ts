import { spawn } from "child_process";
import { unlinkSync, writeFileSync } from "fs";

import * as pulumi from "@pulumi/pulumi";
import type * as k8s from "@pulumi/kubernetes";
import {
  type PreviewResult,
  type DiagnosticEvent,
  type Stack,
  type UpResult,
  type DestroyResult,
} from "@pulumi/pulumi/automation";

import { type Workflow, type PrismaClient } from "@prisma/client";

import { type Session } from "next-auth";

import YAML, { type ParsedNode } from "yaml";

import { getStack } from "~/server/pulumi";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { blocks } from "~/server/blocks";

import {
  type ProvidedResource,
  type BlockConfig,
  type BlockConfiguration,
  type NodeDataPayload,
  type ProvidedResourceReturn,
  type StackContext,
  type NodeDataPayloadPrivateStorage,
  type WorkflowOperationResult,
} from "~/types";
import { withBlockDefaults } from "~/utils/workflow";

type LinkedResources = {
  name: string;
  resources: ProvidedResourceReturn;
};

type readyFunc = (resources: LinkedResources[]) => boolean;

interface PromPortForwardOpts {
  localPort: number;
  targetPort?: number;
}

let pulumi_operation: Promise<
  pulumi.automation.UpResult | pulumi.automation.PreviewResult
>;

function forwardService(
  service: pulumi.Input<k8s.core.v1.Service | string> | string,
  deployment: pulumi.Input<
    k8s.extensions.v1beta1.Deployment | k8s.apps.v1.StatefulSet
  >,
  provider: pulumi.Input<pulumi.ProviderResource & { kubeconfig: string }>,
  opts: PromPortForwardOpts
): pulumi.Output<() => void> {
  return pulumi
    .all([service, deployment, provider])
    .apply(([s, d, p]) =>
      pulumi.all([
        typeof s === "string" ? undefined : s.metadata,
        d.urn,
        p.kubeconfig,
      ])
    )
    .apply(([meta, _, kubeconfig]) => {
      return new Promise<() => void>((resolve, reject) => {
        const kubePath = "/tmp/pipelayer.kubeconfig";
        writeFileSync(kubePath, kubeconfig);
        if (typeof service !== "string" && !meta)
          throw new Error("Invalid service specified for port-forward.");
        const svc =
          typeof service === "string"
            ? service
            : typeof meta === "string" || !meta
            ? meta || "UNKNOWN"
            : `service/${meta.name}`;
        const fwd_str = `${svc}:${opts.targetPort || 80} --> localhost:${
          opts.localPort
        }`;
        console.log(`Setting up port forward [${fwd_str}]...`);

        const forwarderHandle = spawn(
          "kubectl",
          ["port-forward", svc, `${opts.localPort}:${opts.targetPort || 80}`],
          { env: { KUBECONFIG: kubePath, ...process.env } }
        );

        // NOTE: we need to wrap `forwarderHandle.kill` because of JavaScript's `this`
        // semantics.
        forwarderHandle.stdout.on("data", () =>
          resolve(() => {
            console.log(`Cleaning up port forward [${fwd_str}]...`);
            try {
              unlinkSync(kubePath);
            } catch (e) {
              console.log("Error while trying to delete kubeconfig.");
              console.error(e);
            } finally {
              return forwarderHandle.kill();
            }
          })
        );
        forwarderHandle.stderr.on("data", () => reject());
      });
    });
}

const getLinkedResources = (
  block: BlockConfig<BlockConfiguration<never>>,
  payload: NodeDataPayload<never>,
  resources: LinkedResources[]
): ProvidedResource[] => {
  const ret: ProvidedResource[] = [];
  const conf = block.configuration;
  if (!conf) return ret;
  for (const page of conf) {
    for (const field of page.fields) {
      if (
        (field.type !== "multiple" && field.type !== "dropdown") ||
        !("provides" in field) ||
        !(field.name in payload)
      )
        continue;
      const a: string[] = payload[field.name] as unknown as string[];

      for (const val of !Array.isArray(a) ? [a] : a) {
        const r = resources.find((r) => r.name === val);
        if (!r) continue;
        const p = r.resources.provided.find((p) => p.type === field.provides);
        if (p) ret.push(p);
      }
    }
  }
  return ret;
};

const yamlToProgram = (
  workflow: Workflow,
  blocks: BlockConfig[],
  options?: pulumi.ResourceOptions
) => {
  const doc = YAML.parseDocument(workflow.yaml);
  const contents = doc.contents;

  if (!contents || !("get" in contents)) return;

  const main = contents.get("main");

  if (!main || !("has" in main) || !("get" in main)) return;

  const storage: NodeDataPayloadPrivateStorage<never> = JSON.parse(
    workflow.storage || "{}"
  ) as NodeDataPayloadPrivateStorage<never>;

  const prepareFunctions: ((
    stack: Stack,
    ctx: StackContext
  ) => Promise<void | ProvidedResourceReturn>)[] = [];
  const programFunctions: {
    ready: readyFunc;
    func: (ctx: StackContext) => Promise<void | ProvidedResourceReturn>;
  }[] = [];
  const forwardedConnections: {
    service: pulumi.Input<k8s.core.v1.Service | string> | string;
    kill: pulumi.Output<() => void>;
    resources: pulumi.Resource[];
  }[] = [];

  const providedResources: {
    name: string;
    resources: ProvidedResourceReturn;
  }[] = [];

  const getPayload = (
    node: ParsedNode
  ): NodeDataPayload<unknown> | undefined => {
    let n = undefined;
    if ("value" in node) {
      n = (node.value as ParsedNode).toJSON() as NodeDataPayload<unknown>;
    } else if ("toJSON" in node) {
      n = node.toJSON() as NodeDataPayload<unknown>;
    }
    if (typeof n !== "undefined" && n.id) {
      const p_stor = storage[n.id];
      if (p_stor) {
        n = Object.assign(n, Object.fromEntries(p_stor));
      }
    }
    return n;
  };

  const addSection = (section: string) => {
    const value = main.has(section) && main.get(section, true);
    const items: ParsedNode[] | undefined =
      typeof value === "object" && "items" in value
        ? (value.items as ParsedNode[])
        : undefined;

    if (items) {
      items.forEach((node) => {
        const payload = getPayload(node);
        if (!payload) return;

        const block = blocks.find((b) => b.name === payload.type);
        if (block) {
          const ready: readyFunc = (resources) => {
            const conf = block.configuration;
            if (!conf) return true;
            for (const page of conf) {
              for (const field of page.fields) {
                if (
                  field.type !== "multiple" ||
                  !("provides" in field) ||
                  !(field.name in payload)
                )
                  continue;
                const a: string[] = (payload as NodeDataPayload<never>)[
                  field.name
                ] as unknown as string[];
                if (!Array.isArray(a)) continue;
                for (const val of a) {
                  const r = resources.find((r) => r.name === val);
                  if (!r) return false;
                  const p = r.resources.provided.find(
                    (p) => p.type === field.provides
                  );
                  if (!p) return false;
                }
              }
            }
            return true;
          };

          const payloadWithDefaults: BlockConfiguration<never> =
            withBlockDefaults(payload, block) as BlockConfiguration<never>;

          const prepare = block.prepare;
          if (prepare) {
            prepareFunctions.push(async (stack: Stack, ctx: StackContext) => {
              const resources = await prepare(stack, ctx, payloadWithDefaults);
              if (resources) {
                providedResources.push({ name: payload.name, resources });
              }
            });
          }
          if (block.program) {
            // Make sure there are no lingering port forwards
            // TODO: Make this more robust (or get rid of port forwards)
            spawn("killall", ["kubectl"]);
            programFunctions.push({
              ready,
              func: async (ctx: StackContext) => {
                const links = getLinkedResources(
                  block,
                  payloadWithDefaults,
                  providedResources
                );
                const forwards = links
                  .filter((lnk) => lnk.forward)
                  .map((lnk) => {
                    const fwd = lnk.forward;
                    if (!fwd) return;
                    const existingForward = forwardedConnections.find(
                      (fc) => fc.service === fwd.service
                    );
                    if (existingForward) return existingForward;
                    const dep =
                      "statefulset" in fwd ? fwd.statefulset : fwd.deployment;
                    const conn = {
                      service: fwd.service,
                      kill: forwardService(fwd.service, dep, fwd.provider, {
                        localPort: fwd.localPort,
                        targetPort: fwd.targetPort,
                      }),
                      resources: [],
                    };
                    forwardedConnections.push(conn);
                    return conn;
                  });
                const resources = await block.program(
                  payloadWithDefaults,
                  links,
                  ctx,
                  options
                );
                if (resources) {
                  providedResources.push({ name: payload.name, resources });
                  forwards.forEach((conn) => {
                    resources.provided.forEach((res) => {
                      conn?.resources.push(res.resource);
                    });
                  });
                }
              },
            });
          }
        }
      });
    }
  };

  addSection("cloud");
  addSection("platform");
  addSection("avro");
  addSection("topics");
  addSection("flows");

  return {
    program: (ctx: StackContext) => async () => {
      for (let x = 0; x < programFunctions.length; x += 1) {
        const pFunc = programFunctions[x];
        if (!pFunc) continue;
        const { ready, func } = pFunc;
        if (!ready(providedResources))
          throw new Error("NOT READY!!! - TODO sort");
        await func(ctx);
      }
      forwardedConnections.forEach((conn) => {
        pulumi.all(conn.resources).apply(async () => {
          try {
            await pulumi_operation;
          } catch (e) {
          } finally {
            conn.kill.apply((kill) => kill());
          }
        });
      });
    },
    prepare: async (stack: Stack, ctx: StackContext) => {
      for (let x = 0; x < prepareFunctions.length; x += 1) {
        const func = prepareFunctions[x];
        if (!func) continue;
        await func(stack, ctx);
      }
    },
  };
};

const getPulumi = async (session: Session, prisma: PrismaClient) => {
  const workflow = await prisma.workflow.findFirst({
    where: { userId: session.user.id },
  });
  if (workflow) {
    const stackConfig = yamlToProgram(workflow, blocks);
    if (!stackConfig) throw new Error("Nothing to do");
    const stack = await getStack(stackConfig.program({ session, prisma }));
    await stackConfig.prepare(stack, { session, prisma });
    return stack;
  }
  throw new Error("No workflow found.");
};

export const pulumiRouter = createTRPCRouter({
  cancel: protectedProcedure.mutation(async ({ ctx }) => {
    console.log("-- pulumi cancel --");
    let exception: string;
    try {
      await (await getPulumi(ctx.session, ctx.prisma)).cancel();
      return { status: "ok" };
    } catch (e) {
      console.log("an error has occured.");
      exception = (e as Error).message;
    }
    return { status: "error", exception };
  }),
  refresh: protectedProcedure.mutation(async ({ ctx }) => {
    console.log("-- pulumi refresh --");
    const diagnostics: DiagnosticEvent[] = [];
    let exception: string;
    try {
      const ret = await (
        await getPulumi(ctx.session, ctx.prisma)
      ).refresh({
        onEvent: (event) => {
          if (
            event.diagnosticEvent &&
            event.diagnosticEvent.prefix === "error: "
          ) {
            // console.error(event.diagnosticEvent);
            diagnostics.push(event.diagnosticEvent);
          }
        },
      });
      return { status: "ok", ...ret, diagnostics };
    } catch (e) {
      console.log("an error has occured.");
      exception = (e as Error).message;
    }
    return { status: "error", diagnostics, exception };
  }),

  preview: protectedProcedure.mutation(
    async ({ ctx }): Promise<WorkflowOperationResult<PreviewResult>> => {
      console.log("-- pulumi preview --");
      const diagnostics: DiagnosticEvent[] = [];
      let exception: string;
      try {
        pulumi_operation = (await getPulumi(ctx.session, ctx.prisma)).preview({
          onEvent: (event) => {
            if (
              event.diagnosticEvent &&
              event.diagnosticEvent.prefix === "error: "
            ) {
              console.log("error...");
              // diagnostics.push(event.diagnosticEvent);
            } else {
              // console.log(event);
            }
          },
        });
        const payload =
          (await pulumi_operation) as pulumi.automation.PreviewResult;
        return { status: "ok", payload, diagnostics };
      } catch (e) {
        console.error("an exception has occurred.");
        exception = (e as Error).message;
      }
      return { status: "error", diagnostics, exception };
    }
  ),

  up: protectedProcedure.mutation(
    async ({ ctx }): Promise<WorkflowOperationResult<UpResult>> => {
      console.log("-- pulumi up --");
      const diagnostics: DiagnosticEvent[] = [];
      let exception: string;
      try {
        await (await getPulumi(ctx.session, ctx.prisma)).cancel();
        pulumi_operation = (await getPulumi(ctx.session, ctx.prisma)).up({
          onEvent: (event) => {
            if (
              event.diagnosticEvent &&
              event.diagnosticEvent.prefix === "error: "
            ) {
              console.log("error...");
              diagnostics.push(event.diagnosticEvent);
            } else {
              // console.log(event);
            }
          },
        });
        const payload = (await pulumi_operation) as pulumi.automation.UpResult;
        return { status: "ok", payload, diagnostics };
      } catch (e) {
        console.log("An error was captured.");
        exception = (e as Error).message;
        // console.error(e);
      }
      return { status: "error", diagnostics, exception };
    }
  ),

  destroy: protectedProcedure.mutation(
    async ({ ctx }): Promise<WorkflowOperationResult<DestroyResult>> => {
      console.log("-- pulumi destroy --");
      const diagnostics: DiagnosticEvent[] = [];
      let exception: string;
      try {
        const ret = await (
          await getPulumi(ctx.session, ctx.prisma)
        ).destroy({
          onEvent: (event) => {
            if (
              event.diagnosticEvent &&
              event.diagnosticEvent.prefix === "error: "
            ) {
              console.log("error...");
              diagnostics.push(event.diagnosticEvent);
            } else {
              // console.log(event);
            }
          },
        });
        console.log(
          `Destroy complete, ${diagnostics.length} diagnostic events.`
        );
        return { status: "ok", payload: ret, diagnostics };
      } catch (e) {
        console.error("Exception occurred...");
        exception = (e as Error).message;
      }
      console.log(
        `Exception during destroy.  ${diagnostics.length} diagnostic events.`
      );
      return { status: "error", diagnostics, exception };
    }
  ),
});
