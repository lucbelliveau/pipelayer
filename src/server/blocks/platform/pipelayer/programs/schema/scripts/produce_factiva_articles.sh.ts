import { type PlatformPipelayerConfiguration } from "../../..";

const s = (_: PlatformPipelayerConfiguration) => {
  const schema_registry_host = "schema-reg";
  const schema_registry_port = "8081";

  const broker_host="kafka-internal"
  const broker_external_port="29092"

  const topic = "factiva-articles";
  
  return `#!/bin/bash

sh ./deps.sh

topic="${topic}"

avro_dir=.

tar_file=/prototype/factiva_5k_avro.tar.gz
data_file=factiva-articles.txt
no_messages=4825

broker_host="${broker_host}"
broker_external_port="${broker_external_port}"

schema_registry_host="${schema_registry_host}"
schema_registry_port="${schema_registry_port}"

echo "Check if avro is one of supported schema types ...";
supported_types=$(sh ./get_supported_schema_types.sh)
echo $supported_types "are supported ✅";
if [ -z "$(echo $supported_types} | grep AVRO)" ]; then
    echo 'AVRO is not supported ❌'
    exit 1
else
    echo 'AVRO is supported ✅'
fi
echo ''

sh ./get_schema_registry_config.sh

sh ./list_subjects.sh

sh ./create_subject.sh \${topic}-key \${avro_dir}/unique_article_key.avsc
sh ./create_subject.sh \${topic}-value \${avro_dir}/unique_article_val.avsc

sh ./list_subjects.sh

sh ./get_subject_info.sh \${topic}-key
sh ./get_subject_info.sh \${topic}-value

tar xzvf $tar_file -C /data/.

key_schema_id=$(curl --silent -X GET http://\${schema_registry_host}:\${schema_registry_port}/subjects/\${topic}-key/versions/latest | jq .id)
value_schema_id=$(curl --silent -X GET http://\${schema_registry_host}:\${schema_registry_port}/subjects/\${topic}-value/versions/latest | jq .id)

echo "Produce \${no_messages} messages ..." 

kafka-avro-console-producer  --broker-list $broker_host:$broker_external_port --topic $topic --property key.separator='|' --property parse.key=true --property key.schema.id=$key_schema_id --property value.schema.id=$value_schema_id < /data/$data_file

echo ''
`;
};

export default s;
