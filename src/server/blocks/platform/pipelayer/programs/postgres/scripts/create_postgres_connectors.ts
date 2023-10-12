import { type PlatformPipelayerConfiguration } from "../../..";

const s = (config: PlatformPipelayerConfiguration) => {
  const connect_host = "connect";
  const connect_port = "8083";

  const postgres_host = "postgres";
  const postgres_port = "5432";

  const postgres_user = config["postgres.username"];
  const postgres_pass = config["postgres.password"];

  const sink_connector = "pending-review";
  const sink_topic = "pending-review-articles";
  const sink_pk_fields = "doc_id";
  const sink_table = "pending_review";

  const source_topic_prefix = "review-";
  const source_connector = "review-complete";
  const source_table = "status";

  return `#!/bin/bash

apt-get update
apt-get install -y curl jq

connect_host=${connect_host}
connect_port=${connect_port}

postgres_host=${postgres_host}
postgres_port=${postgres_port}

postgres_user=${postgres_user}
postgres_pass=${postgres_pass}

sink_connector=${sink_connector}
sink_topic=${sink_topic}
sink_pk_fields=${sink_pk_fields}
sink_table=${sink_table}

source_topic_prefix=${source_topic_prefix}
source_connector=${source_connector}
source_table=${source_table}


echo Create table \${sink_table} ...;
psql -U postgres -d postgres -c 'CREATE TABLE IF NOT EXISTS '\${sink_table}' (doc_id TEXT PRIMARY KEY, doc_file TEXT, doc_type TEXT, dates TEXT[], dup_id_list TEXT[], folder_name TEXT[], full_text TEXT, headline TEXT, headline_original TEXT, key_phrases_json TEXT, lang_id TEXT, lang_name TEXT, named_entities_json TEXT, sentences TEXT[], sentences_original TEXT[], sim_id_list TEXT[], source TEXT, snippet TEXT[], snippet_original TEXT[], summary_text TEXT, topics TEXT, is_reviewed BOOLEAN DEFAULT FALSE);'
psql -U postgres -d postgres -c 'CREATE INDEX IF NOT EXISTS doc_id_idx ON '\${sink_table}' (doc_id);' 
echo Table \${sink_table} created ✅;
echo ''

echo Creating Posrgres sink connector \${sink_connector} for topic \${sink_topic} ...;
curl -X PUT http://\${connect_host}:\${connect_port}/connectors/\${sink_connector}/config \
    -H "Content-Type: application/json" \
    -d '{
        "connector.class": "io.confluent.connect.jdbc.JdbcSinkConnector",
        "connection.url": "jdbc:postgresql://'\${postgres_host}':'\${postgres_port}'/",
        "connection.user": "'\${postgres_user}'",
        "connection.password": "'\${postgres_pass}'",
        "tasks.max": "1",
        "topics": "'\${sink_topic}'",
        "auto.create": "true",
        "auto.evolve":"false",
        "pk.mode":"record_value",
        "pk.fields":"'\${sink_pk_fields}'",
        "insert.mode": "upsert",
        "table.name.format":"'\${sink_table}'"
    }'
echo ''
echo Postgres sink connector \${sink_connector} for topic \${sink_topic} created ✅
echo ''

echo Create table \${source_connector} for \${source_topic_prefix}-\${source_table} created ...
psql -U postgres -d postgres -c 'CREATE TABLE IF NOT EXISTS '\${source_table}'(sequence_id SERIAL PRIMARY KEY, doc_id TEXT, is_relevant BOOLEAN);' 
echo Table \${source_connector} created ✅;
echo ''

echo Creating Posrgres source connector \${source_connector} for topic \${source_topic_prefix} ...;
curl -X PUT http://\${connect_host}:\${connect_port}/connectors/\${source_connector}/config \
    -H "Content-Type: application/json" \
    -d '{
        "connector.class": "io.confluent.connect.jdbc.JdbcSourceConnector",
        "connection.url": "jdbc:postgresql://'\${postgres_host}':'\${postgres_port}'/",
        "connection.user": "'\${postgres_user}'",
        "connection.password": "'\${postgres_pass}'",
        "tasks.max": "1",
        "topic.prefix": "'\${source_topic_prefix}'",
        "mode":"incrementing",
        "table.whitelist":"'\${source_table}'",
        "incrementing.column.name":"sequence_id",
        "output.data.format":"AVRO"
    }'
echo ''
echo Postgres source connector \${source_connector} for topic \${source_topic_prefix}-\${source_table} created ✅
echo ''

# https://phac.retool.com/apps/4a92e650-fc32-11ed-907b-87a421a42551/Review%20pending%20articles
# psql -U postgres -d postgres -c 'UPDATE pending_review SET is_reviewed=FALSE;'
# psql -U postgres -d postgres -c 'DELETE FROM status;'
`;
};

export default s;
