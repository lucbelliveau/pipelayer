import { type PlatformPipelayerConfiguration } from "../../..";

const s = (config: PlatformPipelayerConfiguration) => {
  const neo4j_username = config["neo4j.username"];
  const neo4j_password = config["neo4j.password"];
  const json = {
    name: "pending_review_article_sink_connector",
    config: {
      _comment: "Sink configuration forpending review articles",
      "connector.class": "streams.kafka.connect.sink.Neo4jSinkConnector",
      "key.converter": "io.confluent.connect.avro.AvroConverter",
      "key.converter.schema.registry.url": "http://schema-reg:8081",
      "value.converter": "io.confluent.connect.avro.AvroConverter",
      "value.converter.schema.registry.url": "http://schema-reg:8081",
      "errors.retry.timeout": "-1",
      "errors.retry.delay.max.ms": "1000",
      "errors.tolerance": "all",
      "errors.log.enable": true,
      "errors.log.include.messages": true,
      "neo4j.server.uri": "bolt://neo4j:7687",
      "neo4j.authentication.basic.username": neo4j_username,
      "neo4j.authentication.basic.password": neo4j_password,
      "neo4j.encryption.enabled": false,
      topics: "pending-review-articles",
      "neo4j.topic.cypher.pending-review-articles":
        "MERGE (n:Article {doc_id: event.doc_id}) SET n:PIPE, n.doc_type = event.doc_type, n.dates = event.dates, n.dup_id_list = event.dup_id_list, n.folder_name = event.folder_name, n.full_text = event.full_text, n.headline = event.headline, n.headline_original = event.headline_original, n.key_phrases_json = event.key_phrases_json, n.lang_id = event.lang_id, n.lang_name = event.lang_name, n.named_entities_json = event.named_entities_json, n.sentences = event.sentences, n.sentences_original = event.sentences_original, n.sim_id_list = event.sim_id_list, n.source = event.source, n.snippet = event.snippet, n.snippet_original = event.snippet_original, n.summary_text = event.summary_text, n.topics = event.topics WITH n FOREACH ( dup_id IN n.dup_id_list |  MERGE (m:Article {doc_id: dup_id}) MERGE (m)-[:IDENTICAL]-(n)) WITH n FOREACH ( ner IN apoc.convert.fromJsonList(n.key_phrases_json) | MERGE (e:NE {text: ner[0]}) MERGE (n)-[r:CTM_NE]->(e) ON CREATE SET r.tf = ner[2] ON MATCH SET r.tf = r.tf + ner[2] ) WITH n UNWIND apoc.convert.fromJsonList(n.named_entities_json) AS ner CALL apoc.merge.node([ner[1]], {text: ner[0]}) YIELD node WITH n, ner, node MERGE (n)-[r:STD_NE]->(node) ON CREATE SET r.tf = ner[2] ON MATCH SET r.tf = r.tf + ner[2] WITH n FOREACH (sim_id IN n.sim_id_list | MERGE (m:Article {doc_id: sim_id}) MERGE (n)-[:SIMILAR]-(m))",
    },
  };
  return JSON.stringify(json);
};

export default s;
