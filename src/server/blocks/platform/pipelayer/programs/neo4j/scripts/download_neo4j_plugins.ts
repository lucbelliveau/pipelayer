import { type PlatformPipelayerConfiguration } from "../../..";

const s = (_: PlatformPipelayerConfiguration) => {
  const NEO4J_VERSION = "5.8.0";
  const NEO4J_GDS_VERSION = "2.4.0";

  return `#!/bin/bash

  NEO4J_VERSION=${NEO4J_VERSION}
  NEO4J_GDS_VERSION=${NEO4J_GDS_VERSION}
  
  echo Installing unzip
  apt-get update
  apt-get install -f unzip
  
  echo Downloading plugins...
  echo 
  
  cd /tmp
  
  if [ -f /plugins/apoc-\${NEO4J_VERSION}-core.jar ]; then
      echo /plugins/apoc-\${NEO4J_VERSION}-core.jar already downloaded.
      continue
  fi
  wget https://github.com/neo4j/apoc/releases/download/\${NEO4J_VERSION}/apoc-\${NEO4J_VERSION}-core.jar 
  mv apoc-\${NEO4J_VERSION}-core.jar /plugins/.
  echo 
  
  if [ -f /plugins/apoc-\${NEO4J_VERSION}-extended.jar ]; then
      echo /plugins/apoc-\${NEO4J_VERSION}-extended.jar already downloaded.
      continue
  fi
  wget https://github.com/neo4j-contrib/neo4j-apoc-procedures/releases/download/\${NEO4J_VERSION}/apoc-\${NEO4J_VERSION}-extended.jar 
  mv apoc-\${NEO4J_VERSION}-extended.jar /plugins/.
  echo 
  
  echo Downloading plugins...
  if [ -f /plugins/neo4j-graph-data-science-\${NEO4J_GDS_VERSION}.jar ]; then
      echo /plugins/neo4j-graph-data-science-\${NEO4J_GDS_VERSION}.jar already downloaded.
      continue
  fi
  wget https://graphdatascience.ninja/neo4j-graph-data-science-\${NEO4J_GDS_VERSION}.zip
  unzip neo4j-graph-data-science-\${NEO4J_GDS_VERSION}.zip
  mv neo4j-graph-data-science-\${NEO4J_GDS_VERSION}.jar /plugins/.
  rm neo4j-graph-data-science-\${NEO4J_GDS_VERSION}.zip
  echo 
  
  echo Plugins downloaded ✅
  echo 
  
`;
};

export default s;
