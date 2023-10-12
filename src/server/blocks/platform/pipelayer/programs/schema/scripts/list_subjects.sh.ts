import { type PlatformPipelayerConfiguration } from "../../..";

const s = (_: PlatformPipelayerConfiguration) => {
  const schema_registry_host = "schema-reg";
  const schema_registry_port = "8081";

  return `#!/bin/bash

sh ./deps.sh

schema_registry_host="${schema_registry_host}"
schema_registry_port="${schema_registry_port}"

echo "List all current subjects ..." 
echo "curl --silent -X GET http://\${schema_registry_host}:\${schema_registry_port}/subjects | jq .[]"
curl --silent -X GET http://\${schema_registry_host}:\${schema_registry_port}/subjects | jq .[]
echo ''
`;
};
export default s;
