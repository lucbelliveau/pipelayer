import { type PlatformPipelayerConfiguration } from "../../..";

const s = (_: PlatformPipelayerConfiguration) => {
  return `#!/bin/bash


if [ "$#" -ne 2 ]; then
    echo "Usage ./scripts/kafka/create_subject.sh <subject> <schema_file>";
    exit 1
fi

sh ./deps.sh

subject=$1
schema_file=$2

schema_registry_host=schema-reg
schema_registry_port=8081

echo "Creating subject \${subject} with schema \${schema_file} ..." 
escaped_avsc=$(cat $schema_file | sed 's/\\t/ /g' | sed -e ':a' -e 'N' -e '$!ba' -e 's/\\n/ /g' | sed 's/\\"/\\\\"/g' )
escaped_avsc=$(echo {\\"schema\\": \\"$escaped_avsc\\"})
curl --silent -X POST -H "Content-Type: application/vnd.schemaregistry.v1+json" \\
    --data "$escaped_avsc" \\
    http://\${schema_registry_host}:\${schema_registry_port}/subjects/\${subject}/versions | jq .[]
echo ''
`;
};

export default s;
