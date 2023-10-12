import { type PlatformPipelayerConfiguration } from "../../..";

const s = (_: PlatformPipelayerConfiguration) => {
  const schema_registry_host = "schema-reg";
  const schema_registry_port = "8081";

  return `#!/bin/bash

sh ./deps.sh

schema_registry_host="${schema_registry_host}"
schema_registry_port="${schema_registry_port}"

echo "Top level schema compatibility configuration ..." 
curl --silent -X GET http://\${schema_registry_host}:\${schema_registry_port}/config | jq .[]
echo ''
`;
};
export default s;
