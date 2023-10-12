const __comment = () => `
##############################################################################
#
# Kafka Cluster, Community Edition, Starter version
# -------------------------------------------------
# - zookeeper
# - broker
# - schema-registry
# - connect
# - ksqldb-server
# - ksqldb-cli
# - rest-proxy
# - kafka-ui
# - init-kafka
#
##############################################################################
`;

const zookeeper = () => `
####################
# zookeeper
####################
zookeeper:
  image: confluentinc/cp-zookeeper:\${KAFKA_VERSION}
  hostname: zookeeper
  container_name: zookeeper
  networks:
    - backend
  ports:
    - \${ZOOKEEPER_CLIENT_PORT}:2181
  environment:
    ZOOKEEPER_CLIENT_PORT: \${ZOOKEEPER_CLIENT_PORT}
    ZOOKEEPER_TICK_TIME: \${ZOOKEEPER_TICK_TIME}
    ZOOKEEPER_LOG4J_ROOT_LOGLEVEL: WARN
    ZOOKEEPER_TOOLS_LOG4J_LOGLEVEL: ERROR
  volumes:
    - $PWD/kafka-ce/zk/data:/var/lib/zookeeper/data
    - $PWD/kafka-ce/zk/txn-logs:/var/lib/zookeeper/log
  restart: always

`;
const broker = () => `
####################
# broker
####################
broker:
  image: confluentinc/cp-kafka:\${KAFKA_VERSION}
  hostname: broker
  container_name: broker
  depends_on:
    - zookeeper
  networks:
    - backend
  ports:
    - \${BROKER_EXTERNAL_PORT}:\${BROKER_EXTERNAL_PORT}
    - \${BROKER_LOCAL_PORT}:\${BROKER_LOCAL_PORT}
    - \${BROKER_JMX_PORT}:9101
  environment:
    KAFKA_BROKER_ID: 1
    KAFKA_ZOOKEEPER_CONNECT: zookeeper:\${ZOOKEEPER_CLIENT_PORT}
    KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: PLAINTEXT:PLAINTEXT,PLAINTEXT_HOST:PLAINTEXT
    KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://broker:\${BROKER_INTERNAL_PORT},PLAINTEXT_HOST://localhost:\${BROKER_LOCAL_PORT}
    KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: \${REPLICATION_FACTOR}
    KAFKA_GROUP_INITIAL_REBALANCE_DELAY_MS: 1000
    KAFKA_CONFLUENT_LICENSE_TOPIC_REPLICATION_FACTOR: \${REPLICATION_FACTOR}
    KAFKA_CONFLUENT_BALANCER_TOPIC_REPLICATION_FACTOR: \${REPLICATION_FACTOR}
    KAFKA_TRANSACTION_STATE_LOG_MIN_ISR: \${REPLICATION_FACTOR}
    KAFKA_TRANSACTION_STATE_LOG_REPLICATION_FACTOR: \${REPLICATION_FACTOR}
    KAFKA_DELETE_TOPIC_ENABLE: true
    KAFKA_JMX_PORT: 9101
    KAFKA_JMX_HOSTNAME: broker
    KAFKA_CONFLUENT_SCHEMA_REGISTRY_URL: http://schema-registry:\${SCHEMA_REGISTRY_PORT}
    KAFKA_LOG4J_ROOT_LOGLEVEL: WARN
    KAFKA_TOOLS_LOG4J_LOGLEVEL: ERROR
    KAFKA_LOG_RETENTION_MS: -1
    KAFKA_LOG4J_LOGGERS: org.apache.zookeeper=WARN,org.apache.kafka=WARN,kafka=WARN,kafka.cluster=WARN,kafka.controller=WARN,kafka.coordinator=WARN,kafka.log=WARN,kafka.server=WARN,kafka.zookeeper=WARN,state.change.logger=WARN
  volumes:
    - $PWD/kafka-ce/broker/data:/var/lib/kafka/data
  restart: always
`
const broker2 = () => `
####################
# broker2
####################
broker2:
  image: confluentinc/cp-kafka:\${KAFKA_VERSION}
  hostname: broker2
  container_name: broker2
  depends_on:
    - zookeeper
    - broker
  networks:
    - backend
  ports:
    - \${BROKER2_EXTERNAL_PORT}:\${BROKER2_EXTERNAL_PORT}
    - \${BROKER2_LOCAL_PORT}:\${BROKER2_LOCAL_PORT}
    - \${BROKER2_JMX_PORT}:9101
  environment:
    KAFKA_BROKER_ID: 2
    KAFKA_ZOOKEEPER_CONNECT: zookeeper:\${ZOOKEEPER_CLIENT_PORT}
    # KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: PLAINTEXT:PLAINTEXT,PLAINTEXT_HOST:PLAINTEXT,OUTSIDE:PLAINTEXT
    # KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://broker2:\${BROKER2_INTERNAL_PORT},PLAINTEXT_HOST://localhost:\${BROKER2_LOCAL_PORT},OUTSIDE://\${VM_IP}:\${BROKER2_EXTERNAL_PORT}
    KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: PLAINTEXT:PLAINTEXT,PLAINTEXT_HOST:PLAINTEXT
    KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://broker2:\${BROKER2_INTERNAL_PORT},PLAINTEXT_HOST://localhost:\${BROKER2_LOCAL_PORT}
    KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: \${REPLICATION_FACTOR}
    KAFKA_GROUP_INITIAL_REBALANCE_DELAY_MS: 1000
    KAFKA_CONFLUENT_LICENSE_TOPIC_REPLICATION_FACTOR: \${REPLICATION_FACTOR}
    KAFKA_CONFLUENT_BALANCER_TOPIC_REPLICATION_FACTOR: \${REPLICATION_FACTOR}
    KAFKA_TRANSACTION_STATE_LOG_MIN_ISR: \${REPLICATION_FACTOR}
    KAFKA_TRANSACTION_STATE_LOG_REPLICATION_FACTOR: \${REPLICATION_FACTOR}
    KAFKA_JMX_PORT: 9101
    KAFKA_JMX_HOSTNAME: broker2
    KAFKA_CONFLUENT_SCHEMA_REGISTRY_URL: http://schema-registry:\${SCHEMA_REGISTRY_PORT}
    KAFKA_LOG4J_ROOT_LOGLEVEL: WARN
    KAFKA_TOOLS_LOG4J_LOGLEVEL: ERROR
    KAFKA_LOG_RETENTION_MS: -1
    KAFKA_LOG4J_LOGGERS: org.apache.zookeeper=WARN,org.apache.kafka=WARN,kafka=WARN,kafka.cluster=WARN,kafka.controller=WARN,kafka.coordinator=WARN,kafka.log=WARN,kafka.server=WARN,kafka.zookeeper=WARN,state.change.logger=WARN
  volumes:
    - $PWD/kafka-ce/broker2/data:/var/lib/kafka/data
  restart: always
`
const broker3 = () => `
####################
# broker3
####################
broker3:
  image: confluentinc/cp-kafka:\${KAFKA_VERSION}
  hostname: broker3
  container_name: broker3
  depends_on:
    - zookeeper
    - broker
  networks:
    - backend
  ports:
    - \${BROKER3_EXTERNAL_PORT}:\${BROKER3_EXTERNAL_PORT}
    - \${BROKER3_LOCAL_PORT}:\${BROKER3_LOCAL_PORT}
    - \${BROKER3_JMX_PORT}:9101
  environment:
    KAFKA_BROKER_ID: 3
    KAFKA_ZOOKEEPER_CONNECT: zookeeper:\${ZOOKEEPER_CLIENT_PORT}
    # KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: PLAINTEXT:PLAINTEXT,PLAINTEXT_HOST:PLAINTEXT,OUTSIDE:PLAINTEXT
    # KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://broker3:\${BROKER3_INTERNAL_PORT},PLAINTEXT_HOST://localhost:\${BROKER3_LOCAL_PORT},OUTSIDE://\${VM_IP}:\${BROKER3_EXTERNAL_PORT}
    KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: PLAINTEXT:PLAINTEXT,PLAINTEXT_HOST:PLAINTEXT
    KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://broker3:\${BROKER3_INTERNAL_PORT},PLAINTEXT_HOST://localhost:\${BROKER3_LOCAL_PORT}
    KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: \${REPLICATION_FACTOR}
    KAFKA_GROUP_INITIAL_REBALANCE_DELAY_MS: 1000
    KAFKA_CONFLUENT_LICENSE_TOPIC_REPLICATION_FACTOR: \${REPLICATION_FACTOR}
    KAFKA_CONFLUENT_BALANCER_TOPIC_REPLICATION_FACTOR: \${REPLICATION_FACTOR}
    KAFKA_TRANSACTION_STATE_LOG_MIN_ISR: \${REPLICATION_FACTOR}
    KAFKA_TRANSACTION_STATE_LOG_REPLICATION_FACTOR: \${REPLICATION_FACTOR}
    KAFKA_JMX_PORT: 9101
    KAFKA_JMX_HOSTNAME: broker3
    KAFKA_CONFLUENT_SCHEMA_REGISTRY_URL: http://schema-registry:\${SCHEMA_REGISTRY_PORT}
    KAFKA_LOG4J_ROOT_LOGLEVEL: WARN
    KAFKA_TOOLS_LOG4J_LOGLEVEL: ERROR
    KAFKA_LOG_RETENTION_MS: -1
    KAFKA_LOG4J_LOGGERS: org.apache.zookeeper=WARN,org.apache.kafka=WARN,kafka=WARN,kafka.cluster=WARN,kafka.controller=WARN,kafka.coordinator=WARN,kafka.log=WARN,kafka.server=WARN,kafka.zookeeper=WARN,state.change.logger=WARN
  volumes:
    - $PWD/kafka-ce/broker3/data:/var/lib/kafka/data
  restart: always
`;
const schemaRegistry = () => `
####################
# schema-registry
####################
schema-registry:
  image: confluentinc/cp-schema-registry:\${KAFKA_VERSION}
  hostname: schema-registry
  container_name: schema-registry
  depends_on:
    - zookeeper
    - broker
  networks:
    - backend
  ports:
    - \${SCHEMA_REGISTRY_PORT}:8081
  environment:
    SCHEMA_REGISTRY_HOST_NAME: schema-registry
    SCHEMA_REGISTRY_KAFKASTORE_BOOTSTRAP_SERVERS: 'broker:\${BROKER_INTERNAL_PORT}'
    SCHEMA_REGISTRY_LISTENERS: http://\${SCHEMA_REGISTRY_PUBLIC_HOST}:\${SCHEMA_REGISTRY_PORT}
    SCHEMA_REGISTRY_LOG4J_ROOT_LOGLEVEL: WARN
    SCHEMA_REGISTRY_TOOLS_LOG4J_LOGLEVEL: ERROR
  volumes:
    - $PWD/kafka-ce/schema-registry/data:/data
  restart: always
`;

const connect = () => `
####################
# connect
####################
connect:
  image: confluentinc/cp-kafka-connect:\${KAFKA_VERSION}
  hostname: connect
  container_name: connect
  depends_on:
    - zookeeper
    - broker
    - schema-registry
  networks:
    - backend
  ports:
    - \${CONNECT_PORT}:8083
  environment:
    CONNECT_BOOTSTRAP_SERVERS: broker:\${BROKER_INTERNAL_PORT}
    CONNECT_REST_PORT: 8083
    CONNECT_REST_ADVERTISED_HOST_NAME: connect
    CONNECT_GROUP_ID: connect-distributed-group
    CONNECT_CONFIG_STORAGE_TOPIC: _kafka-connect-configs
    CONNECT_OFFSET_STORAGE_TOPIC: _kafka-connect-offsets
    CONNECT_STATUS_STORAGE_TOPIC: _kafka-connect-status
    CONNECT_CONFIG_STORAGE_REPLICATION_FACTOR: \${REPLICATION_FACTOR}
    CONNECT_OFFSET_STORAGE_REPLICATION_FACTOR: \${REPLICATION_FACTOR}
    CONNECT_STATUS_STORAGE_REPLICATION_FACTOR: \${REPLICATION_FACTOR}
    CONNECT_OFFSET_FLUSH_INTERVAL_MS: 1000
    CONNECT_KEY_CONVERTER: io.confluent.connect.avro.AvroConverter
    CONNECT_KEY_CONVERTER_SCHEMA_REGISTRY_URL: 'http://schema-registry:\${SCHEMA_REGISTRY_PORT}'
    CONNECT_VALUE_CONVERTER: io.confluent.connect.avro.AvroConverter
    CONNECT_VALUE_CONVERTER_SCHEMA_REGISTRY_URL: http://schema-registry:\${SCHEMA_REGISTRY_PORT}
    CONNECT_INTERNAL_KEY_CONVERTER: org.apache.kafka.connect.json.JsonConverter
    CONNECT_INTERNAL_VALUE_CONVERTER: org.apache.kafka.connect.json.JsonConverter
    # CLASSPATH required due to CC-2422
    CLASSPATH: /usr/share/java/monitoring-interceptors/monitoring-interceptors-\${KAFKA_VERSION}.jar
    CONNECT_PRODUCER_INTERCEPTOR_CLASSES: io.confluent.monitoring.clients.interceptor.MonitoringProducerInterceptor
    CONNECT_CONSUMER_INTERCEPTOR_CLASSES: io.confluent.monitoring.clients.interceptor.MonitoringConsumerInterceptor
    CONNECT_PLUGIN_PATH: /usr/share/java,/usr/share/confluent-hub-components
    CONNECT_LOG4J_LOGGERS: org.apache.zookeeper=ERROR,org.I0Itec.zkclient=ERROR,org.reflections=ERROR
    CONNECT_LOG4J_ROOT_LOGLEVEL: WARN
    CONNECT_TOOLS_LOG4J_LOGLEVEL: ERROR
  command: 
    - bash 
    - -c 
    - |
      echo "Installing connector plugins"
      confluent-hub install --no-prompt confluentinc/kafka-connect-jdbc:\${KAFKA_CONNECT_JDBC_VERSION}
      confluent-hub install --no-prompt streamthoughts/kafka-connect-file-pulse:\${KAFKA_CONNECT_FILEPULSE_VERSION}
      confluent-hub install --no-prompt neo4j/kafka-connect-neo4j:\${KAFKA_CONNECT_NEO4J_VERSION}
      #
      # -----------
      # Launch the Kafka Connect worker
      /etc/confluent/docker/run &
      #
      # Don't exit
      sleep infinity
  volumes:
    - $PWD/kafka-ce/connect/plugins:/usr/share/confluent-hub-components
    - $PWD/kafka-ce/connect/data:/data
  restart: always
`;
const connect2 = () => `
####################
# connect2
####################
connect2:
  image: confluentinc/cp-kafka-connect:\${KAFKA_VERSION}
  hostname: connect2
  container_name: connect2
  depends_on:
    - zookeeper
    - broker
    - schema-registry
    - connect
  networks:
    - backend
  ports:
    - \${CONNECT2_PORT}:8083
  environment:
    CONNECT_BOOTSTRAP_SERVERS: broker:\${BROKER_INTERNAL_PORT}
    CONNECT_REST_PORT: 8083
    CONNECT_REST_ADVERTISED_HOST_NAME: connect2
    CONNECT_GROUP_ID: connect-distributed-group
    CONNECT_CONFIG_STORAGE_TOPIC: _kafka-connect-configs
    CONNECT_OFFSET_STORAGE_TOPIC: _kafka-connect-offsets
    CONNECT_STATUS_STORAGE_TOPIC: _kafka-connect-status
    CONNECT_CONFIG_STORAGE_REPLICATION_FACTOR: \${REPLICATION_FACTOR}
    CONNECT_OFFSET_STORAGE_REPLICATION_FACTOR: \${REPLICATION_FACTOR}
    CONNECT_STATUS_STORAGE_REPLICATION_FACTOR: \${REPLICATION_FACTOR}
    CONNECT_OFFSET_FLUSH_INTERVAL_MS: 1000
    CONNECT_KEY_CONVERTER: io.confluent.connect.avro.AvroConverter
    CONNECT_KEY_CONVERTER_SCHEMA_REGISTRY_URL: 'http://schema-registry:\${SCHEMA_REGISTRY_PORT}'
    CONNECT_VALUE_CONVERTER: io.confluent.connect.avro.AvroConverter
    CONNECT_VALUE_CONVERTER_SCHEMA_REGISTRY_URL: http://schema-registry:\${SCHEMA_REGISTRY_PORT}
    CONNECT_INTERNAL_KEY_CONVERTER: org.apache.kafka.connect.json.JsonConverter
    CONNECT_INTERNAL_VALUE_CONVERTER: org.apache.kafka.connect.json.JsonConverter
    # CLASSPATH required due to CC-2422
    CLASSPATH: /usr/share/java/monitoring-interceptors/monitoring-interceptors-\${KAFKA_VERSION}.jar
    CONNECT_PRODUCER_INTERCEPTOR_CLASSES: io.confluent.monitoring.clients.interceptor.MonitoringProducerInterceptor
    CONNECT_CONSUMER_INTERCEPTOR_CLASSES: io.confluent.monitoring.clients.interceptor.MonitoringConsumerInterceptor
    CONNECT_PLUGIN_PATH: /usr/share/java,/usr/share/confluent-hub-components
    CONNECT_LOG4J_LOGGERS: org.apache.zookeeper=ERROR,org.I0Itec.zkclient=ERROR,org.reflections=ERROR
    CONNECT_LOG4J_ROOT_LOGLEVEL: WARN
    CONNECT_TOOLS_LOG4J_LOGLEVEL: ERROR
  command: 
    - bash 
    - -c 
    - |
      echo "Installing connector plugins"
      confluent-hub install --no-prompt confluentinc/kafka-connect-jdbc:\${KAFKA_CONNECT_JDBC_VERSION}
      confluent-hub install --no-prompt streamthoughts/kafka-connect-file-pulse:\${KAFKA_CONNECT_FILEPULSE_VERSION}
      confluent-hub install --no-prompt neo4j/kafka-connect-neo4j:\${KAFKA_CONNECT_NEO4J_VERSION}
      #
      # -----------
      # Launch the Kafka Connect worker
      /etc/confluent/docker/run &
      #
      # Don't exit
      sleep infinity
  volumes:
    - $PWD/kafka-ce/connect/plugins:/usr/share/confluent-hub-components
    - $PWD/kafka-ce/connect/data:/data
  restart: always
`;
const connect3 = () => `
####################
# connect3
####################
connect3:
  image: confluentinc/cp-kafka-connect:\${KAFKA_VERSION}
  hostname: connect3
  container_name: connect3
  depends_on:
    - zookeeper
    - broker
    - schema-registry
    - connect
  networks:
    - backend
  ports:
    - \${CONNECT3_PORT}:8083
  environment:
    CONNECT_BOOTSTRAP_SERVERS: broker:\${BROKER_INTERNAL_PORT}
    CONNECT_REST_PORT: 8083
    CONNECT_REST_ADVERTISED_HOST_NAME: connect3
    CONNECT_GROUP_ID: connect-distributed-group
    CONNECT_CONFIG_STORAGE_TOPIC: _kafka-connect-configs
    CONNECT_OFFSET_STORAGE_TOPIC: _kafka-connect-offsets
    CONNECT_STATUS_STORAGE_TOPIC: _kafka-connect-status
    CONNECT_CONFIG_STORAGE_REPLICATION_FACTOR: \${REPLICATION_FACTOR}
    CONNECT_OFFSET_STORAGE_REPLICATION_FACTOR: \${REPLICATION_FACTOR}
    CONNECT_STATUS_STORAGE_REPLICATION_FACTOR: \${REPLICATION_FACTOR}
    CONNECT_OFFSET_FLUSH_INTERVAL_MS: 1000
    CONNECT_KEY_CONVERTER: io.confluent.connect.avro.AvroConverter
    CONNECT_KEY_CONVERTER_SCHEMA_REGISTRY_URL: 'http://schema-registry:\${SCHEMA_REGISTRY_PORT}'
    CONNECT_VALUE_CONVERTER: io.confluent.connect.avro.AvroConverter
    CONNECT_VALUE_CONVERTER_SCHEMA_REGISTRY_URL: http://schema-registry:\${SCHEMA_REGISTRY_PORT}
    CONNECT_INTERNAL_KEY_CONVERTER: org.apache.kafka.connect.json.JsonConverter
    CONNECT_INTERNAL_VALUE_CONVERTER: org.apache.kafka.connect.json.JsonConverter
    # CLASSPATH required due to CC-2422
    CLASSPATH: /usr/share/java/monitoring-interceptors/monitoring-interceptors-\${KAFKA_VERSION}.jar
    CONNECT_PRODUCER_INTERCEPTOR_CLASSES: io.confluent.monitoring.clients.interceptor.MonitoringProducerInterceptor
    CONNECT_CONSUMER_INTERCEPTOR_CLASSES: io.confluent.monitoring.clients.interceptor.MonitoringConsumerInterceptor
    CONNECT_PLUGIN_PATH: /usr/share/java,/usr/share/confluent-hub-components
    CONNECT_LOG4J_LOGGERS: org.apache.zookeeper=ERROR,org.I0Itec.zkclient=ERROR,org.reflections=ERROR
    CONNECT_LOG4J_ROOT_LOGLEVEL: WARN
    CONNECT_TOOLS_LOG4J_LOGLEVEL: ERROR
  command: 
    - bash 
    - -c 
    - |
      echo "Installing connector plugins"
      confluent-hub install --no-prompt confluentinc/kafka-connect-jdbc:\${KAFKA_CONNECT_JDBC_VERSION}
      confluent-hub install --no-prompt streamthoughts/kafka-connect-file-pulse:\${KAFKA_CONNECT_FILEPULSE_VERSION}
      confluent-hub install --no-prompt neo4j/kafka-connect-neo4j:\${KAFKA_CONNECT_NEO4J_VERSION}
      #
      # -----------
      # Launch the Kafka Connect worker
      /etc/confluent/docker/run &
      #
      # Don't exit
      sleep infinity
  volumes:
    - $PWD/kafka-ce/connect/plugins:/usr/share/confluent-hub-components
    - $PWD/kafka-ce/connect/data:/data
  restart: always
`;
const ksqldbServer = () => `
####################
# ksqldb-server
####################
ksqldb-server:
  image: confluentinc/cp-ksqldb-server:\${KAFKA_VERSION}
  hostname: ksqldb-server
  container_name: ksqldb-server
  depends_on:
    - zookeeper
    - broker
    - connect
  networks:
    - backend
  ports:
    - \${KSQLDB_PORT}:8088
  environment:
    KSQL_CONFIG_DIR: /etc/ksql
    KSQL_BOOTSTRAP_SERVERS: broker:\${BROKER_INTERNAL_PORT}
    KSQL_HOST_NAME: ksqldb-server
    KSQL_LISTENERS: http://0.0.0.0:\${KSQLDB_PORT}
    KSQL_CACHE_MAX_BYTES_BUFFERING: 0
    KSQL_KSQL_SCHEMA_REGISTRY_URL: http://schema-registry:\${SCHEMA_REGISTRY_PORT}
    KSQL_PRODUCER_INTERCEPTOR_CLASSES: io.confluent.monitoring.clients.interceptor.MonitoringProducerInterceptor
    KSQL_CONSUMER_INTERCEPTOR_CLASSES: io.confluent.monitoring.clients.interceptor.MonitoringConsumerInterceptor
    KSQL_KSQL_CONNECT_URL: http://connect:\${CONNECT_PORT}
    KSQL_KSQL_LOGGING_PROCESSING_TOPIC_REPLICATION_FACTOR: \${REPLICATION_FACTOR}
    KSQL_KSQL_LOGGING_PROCESSING_TOPIC_AUTO_CREATE: true
    KSQL_KSQL_LOGGING_PROCESSING_STREAM_AUTO_CREATE: true
    KSQL_LOG4J_ROOT_LOGLEVEL: WARN
    KSQL_TOOLS_LOG4J_LOGLEVEL: ERROR
  restart: always
`;
const ksqldbCli = () => `
####################
# ksqldb-cli
####################
ksqldb-cli:
  # *-----------------------------------------------------------*
  # To connect to the DB: 
  #   docker exec -it ksqldb-cli ksql http://ksqldb-server:8088
  # *-----------------------------------------------------------*
  image: confluentinc/cp-ksqldb-cli:\${KAFKA_VERSION}
  hostname: ksqldb-cli
  container_name: ksqldb-cli
  depends_on:
    - zookeeper
    - broker
    - connect
    - ksqldb-server
  networks:
    - backend
  entrypoint: /bin/sh
  tty: true
  volumes:
    - $PWD/kafka-ce/ksqldb-cli/scripts:/data/scripts
  restart: always    
`;
const restProxy = () => `
####################
# rest-proxy
####################
rest-proxy:
  image: confluentinc/cp-kafka-rest:\${KAFKA_VERSION}
  hostname: rest-proxy
  container_name: rest-proxy
  depends_on:
    - broker
    - schema-registry
  networks:
    - backend
  ports:
    - \${REST_PROXY_PORT}:8082
  environment:
    KAFKA_REST_HOST_NAME: rest-proxy
    KAFKA_REST_BOOTSTRAP_SERVERS: 'broker:\${BROKER_INTERNAL_PORT}'
    KAFKA_REST_LISTENERS: http://0.0.0.0:\${REST_PROXY_PORT}
    KAFKA_REST_SCHEMA_REGISTRY_URL: http://schema-registry:\${SCHEMA_REGISTRY_PORT}
    KAFKA_REST_LOG4J_ROOT_LOGLEVEL: WARN
    KAFKA_REST_TOOLS_LOG4J_LOGLEVEL: ERROR
  restart: always
`
const kafkaUi = () => `  
####################
# kafka-ui
####################
kafka-ui:
  hostname: kafka-ui
  container_name: kafka-ui
  image: provectuslabs/kafka-ui:latest
  ports:
    - \${KAFKA_UI_PORT}:8080
  networks:
    - backend
  depends_on:
    - zookeeper
    - broker
    - schema-registry
    - connect
  environment:
    KAFKA_CLUSTERS_0_NAME: local
    KAFKA_CLUSTERS_0_BOOTSTRAPSERVERS: broker:\${BROKER_INTERNAL_PORT}
    KAFKA_CLUSTERS_0_METRICS_PORT: \${KAFKA_UI_METRIC_PORT}
    KAFKA_CLUSTERS_0_SCHEMAREGISTRY: http://schema-registry:\${SCHEMA_REGISTRY_PORT}
    KAFKA_CLUSTERS_0_KAFKACONNECT_0_NAME: connect
    KAFKA_CLUSTERS_0_KAFKACONNECT_0_ADDRESS: http://connect:\${CONNECT_PORT}
    KAFKA_CLUSTERS_0_KSQLDBSERVER: http://ksqldb-server:\${KSQLDB_PORT}
    KAFKA_CLUSTERS_0_READONLY: \${KAFKA_UI_READONLY}
    AUTH_TYPE: \${KAFKA_UI_AUTH_TYPE}
    SPRING_SECURITY_USER_NAME: \${KAFKA_UI_SPRING_SECURITY_USER_NAME}
    SPRING_SECURITY_USER_PASSWORD: \${KAFKA_UI_SPRING_SECURITY_USER_PASSWORD}
  restart: always
`;

const init = ({ topics }: { topics: string[] } = { topics: [] }) => `
####################
  # init-kafka
  ####################
  init-kafka:
    image: confluentinc/cp-kafka:\${KAFKA_VERSION}
    container_name: init-kafka
    depends_on:
      - zookeeper
      - broker
      - schema-registry
      - connect
    networks:
      - backend
    entrypoint: [ '/bin/sh', '-c' ]
    command: |
      "
      # blocks until kafka is reachable
      kafka-topics --bootstrap-server broker:\${BROKER_INTERNAL_PORT} --list

      echo -e 'Creating kafka topics'
      ${topics.reduce(
        (p, t) => `${p}
      kafka-topics --bootstrap-server broker:\${BROKER_INTERNAL_PORT} --create --if-not-exists --topic ${t} --replication-factor \${REPLICATION_FACTOR} --partitions \${PARTITIONS}`,
        ""
      )}
      
      echo -e 'Successfully created the following topics:'
      kafka-topics --bootstrap-server broker:\${BROKER_INTERNAL_PORT} --list
      "
`;

const stanford_corenlp = () => `
################################################################################
#
# supporting services
# - stanford_corenlp
# - neo4j
# - neodash (for dashboard viewers)
# - neodash_designer (for dashboard designers)
#
################################################################################

  ####################
  # stanford_corenlp:
  #
  ####################
  stanford_corenlp:
    # *-----------------------------------------------------------------------*
    # To use ass standalone: 
    #   docker run --rm -v $(pwd)/conf/tsv:/conf -p 9000:9000 -it stanford_corenlp 
    # *-----------------------------------------------------------------------*
    image: stanford_corenlp:latest
    container_name: stanford_corenlp
    build:
      context: ./
      dockerfile: conf/stanford_corenlp/Dockerfile
    networks:
      - backend
    ports:
      - \${STANFORD_CORENLP_PORT}:9000
    volumes:
      - $PWD/conf/tsv:/conf
    restart: always
`
const neo4j = () => `
  ####################
  # neo4j
  ####################
  neo4j:
    image: neo4j:\${NEO4J_VERSION}
    hostname: neo4j
    container_name: neo4j
    networks:
      - backend
    ports:
      - \${NEO4J_HTTP_PORT}:7474
      - \${NEO4J_HTTPS_PORT}:7473
      - \${NEO4J_BOLT_PORT}:7687
    environment:
      - NEO4J_ACCEPT_LICENSE_AGREEMENT=yes
      - NEO4J_AUTH=\${NEO4J_USERNAME}/\${NEO4J_PASSWORD}
      - NEO4J_server_default__advertised__address=localhost
      - NEO4j_server_bolt_advertised_address=:\${NEO4J_BOLT_PORT}
      - NEO4j_server_http_advertised_address=:\${NEO4J_HTTP_PORT}
      - NEO4J_server_default__listen__address=0.0.0.0
      - NEO4j_server_bolt_listen_address=:\${NEO4J_BOLT_PORT}
      - NEO4j_server_http_listen_address=:\${NEO4J_HTTP_PORT}
      - NEO4J_server_memory_pagecache_size=\${NEO4J_SERVER_MEMORY_PAGECACHE_SIZE}
      - NEO4J_server_memory_heap.initial__size=\${NEO4J_SERVER_MEMORY_HEAP_INITIAL_SIZE}
      - NEO4J_server_memory_heap_max__size=\${NEO4J_SERVER_MEMORY_HEAP_MAX_SIZE}
      - NEO4J_apoc_export_file_enabled=true
      - NEO4J_apoc_import_file_enabled=true
      - NEO4J_apoc_import_file_use__neo4j__config=true
      # - NEO4J_PLUGINS=["apoc-extended"]
      - NEO4J_dbms_security_procedures_unrestricted=apoc.*,gds.*
    healthcheck:
      test: [ "CMD", "/var/lib/neo4j/bin/cypher-shell", "-u", "\${NEO4J_USERNAME}", "-p", "\${NEO4J_PASSWORD}", "MATCH () RETURN count(*) as count" ]
      interval: 10s
      timeout: 10s
      retries: 20
    volumes:
      - $PWD/neo4j/import:/import 
      - $PWD/neo4j/data:/data
      - $PWD/neo4j/logs:/logs
      - $PWD/neo4j/plugins:/plugins
    restart: always
`
const neodash = () => `
  ####################
  # neodash
  ####################
  neodash: 
    image: nielsdejong/neodash:\${NEODASH_VERSION}
    hostname: neodash
    container_name: neodash
    depends_on:
      - neo4j
    networks:
      - backend
    ports:
      - \${NEODASH_PORT}:5005
    environment:
      - ssoEnabled=false
      - ssoDiscoveryUrl=
      - standalone=true
      - standaloneProtocol=bolt
      - standaloneHost=\${PUBLIC_IP}
      - standalonePort=7687
      - standaloneDatabase=neo4j
      - standaloneDashboardName=News Articles
      - standaloneDashboardDatabase=neo4j
    restart: always
`
const neodashDesigner = () => `
  ####################
  # neodash_designer
  ####################
  neodash_designer: 
    image: nielsdejong/neodash:\${NEODASH_VERSION}
    hostname: neodash_designer
    container_name: neodash_designer
    depends_on:
      - neo4j
    networks:
      - backend
    ports:
      - \${NEODASH_DESIGNER_PORT}:5005
    restart: always
`

const mainUnit = {
  __comment,
  zookeeper,
  broker,
  broker2,
  broker3,
  schemaRegistry,
  connect,
  connect2,
  connect3,
  ksqldbServer,
  ksqldbCli,
  restProxy,
  kafkaUi,
  init,
  stanford_corenlp,
  neo4j,
  neodash,
  neodashDesigner,
};

export default mainUnit;
