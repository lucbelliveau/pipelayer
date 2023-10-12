import { type PlatformPipelayerConfiguration } from "../../..";

const s = (config: PlatformPipelayerConfiguration) => {
  const neo4j_username = config["neo4j.username"];
  const neo4j_password = config["neo4j.password"];

  return `#!/bin/bash

    neo4j_username=${neo4j_username}
    neo4j_password=${neo4j_password}


    echo 'Creating constraints and indexes ...'
    cp /configmap/neo4j_constraints.cql /import/.
    cypher-shell -u \${neo4j_username} -p \${neo4j_password} --file /import/neo4j_constraints.cql
    echo 'Constraints and indexes are created ✅'
    
    echo 'Importing named entities and categories ...'
    cp /configmap/neo4j_ne_ct_import.cql /import/.
    cp /configmap/keyword_mappings.tsv /import/.
    cypher-shell -u \${neo4j_username} -p \${neo4j_password} --file /import/neo4j_ne_ct_import.cql
    echo 'Named entities and categories imported ✅'
    `;
};

export default s;
