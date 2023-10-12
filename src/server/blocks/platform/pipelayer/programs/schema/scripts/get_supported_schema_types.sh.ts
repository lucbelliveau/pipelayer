import { type PlatformPipelayerConfiguration } from "../../..";

const s = (_: PlatformPipelayerConfiguration) => {
  const schema_registry_host = "schema-reg";
  const schema_registry_port = "8081";

  return `#!/bin/bash

sh ./deps.sh

schema_registry_host="${schema_registry_host}"
schema_registry_port="${schema_registry_port}"

curl --silent http://\${schema_registry_host}:\${schema_registry_port}/schemas/types
`;
};
export default s;
