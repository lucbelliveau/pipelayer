import { type PlatformPipelayerConfiguration } from "../../..";

const s = (_: PlatformPipelayerConfiguration) => {
  const connect_host = "connect";
  const connect_port = "8083";

  return `#!/bin/bash

    connect_host="${connect_host}"
    connect_port="${connect_port}"
    
    apt-get update
    apt-get install -y curl
    
    curl -X POST http://\${connect_host}:\${connect_port}/connectors \
      -H 'Content-Type:application/json' \
      -H 'Accept:application/json' \
      -d @pending_review_article_sink_connector.json
    echo
    
    `;
};

export default s;
