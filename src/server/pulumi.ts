import fs from "fs";
import { parse } from "url";
import { resolve } from "path";

import { LocalWorkspace, type PulumiFn } from "@pulumi/pulumi/automation";

import { env } from "~/env.mjs";

let backend_url = env.PULUMI_STATE_URL;
export const getStack = async (program: PulumiFn) => {
  const parsedBackend = parse(env.PULUMI_STATE_URL);

  if (parsedBackend.protocol === "file:" && parsedBackend.path) {
    
    // Use an absolute path for the backend location.
    const stateDir = resolve(parsedBackend.path);

    if (!fs.existsSync(stateDir)) {
      fs.mkdirSync(stateDir);
      console.info(`Created [${stateDir}] directory.`);
    }
    backend_url = `file://${stateDir}`;
  }

  console.debug(`Pulumi backend: ${backend_url}`);

  const stack = await LocalWorkspace.createOrSelectStack(
    {
      stackName: "dev",
      projectName: "pipelayer",
      program,
    },
    {
      envVars: {
        PULUMI_BACKEND_URL: backend_url,
        PULUMI_CONFIG_PASSPHRASE: "",
        // TODO look above
        PULUMI_K8S_DELETE_UNREACHABLE: "true",
      },
    }
  );
  return stack;
};
