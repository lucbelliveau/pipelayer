import { type PlatformPipelayerConfiguration } from "../../..";

const s = (_: PlatformPipelayerConfiguration) => {
  const schema_registry_host = "schema-reg";
  const schema_registry_port = "8081";

  return `#!/bin/bash

if [ -z "$1" ]; then
    echo "Usage ./scripts/kafka/get_subject_info.sh <subject>";
    exit 1
fi

sh ./deps.sh

subject=$1

schema_registry_host="${schema_registry_host}"
schema_registry_port="${schema_registry_port}"

echo "Find ID of the \${subject}..." 
schema_id=$(curl --silent -X GET http://\${schema_registry_host}:\${schema_registry_port}/subjects/\${subject}/versions/latest | jq .id)
echo schema_id=\${schema_id}
echo ''
echo ''

echo "Find details of the \${subject}..." 
echo "curl --silent -X GET http://\${schema_registry_host}:\${schema_registry_port}/subjects/\${subject}/versions/latest"
curl --silent -X GET http://\${schema_registry_host}:\${schema_registry_port}/subjects/\${subject}/versions/latest
echo ''
echo ''

echo "List all versions of \${subject}..." 
echo "curl --silent -X GET http://\${schema_registry_host}:\${schema_registry_port}/subjects/\${subject}/versions | jq"
curl --silent -X GET http://\${schema_registry_host}:\${schema_registry_port}/subjects/\${subject}/versions | jq
echo ''
`;
};
export default s;
