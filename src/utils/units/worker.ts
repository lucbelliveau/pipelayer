const __comment = () => `
##############################################################################
#
#  Each of the services below correspond to a pipelayer flow
# 
##############################################################################
`;

const python = ({ name }: { name: string }) => `
############${"#".repeat(name.length)}
# ${name}  (python)
############${"#".repeat(name.length)}
${name}:
    image: ${name}:latest
    container_name: ${name}
    build:
      context: ./
      dockerfile: conf/docker/pipeline/Dockerfile
      args:
        - BASE_IMAGE=python:3.11
        - PYTHON_REQUIREMENTS=conf/std-requirements.txt
        - AVRO_DIR=conf/avro
        - WORKFLOW_FILE=workflow.yaml
        - WORKFLOW_NAME=main
        - STEP_NAME=${name}
    depends_on:
      - broker
      - init-kafka
      - connect
    networks:
      - backend
    restart: always
`;

const pytorch = ({
  name,
  device_ids,
}: {
  name: string;
  device_ids: string[];
}) => `
#############${"#".repeat(name.length)}
# ${name}  (pytorch)
#############${"#".repeat(name.length)}
${name}:
    image: ${name}:latest
    container_name: ${name}
    build:
      context: ./
      dockerfile: conf/docker/pipeline/Dockerfile
      shm_size: '2gb'
      args:
        - BASE_IMAGE=nvcr.io/nvidia/pytorch:23.02-py3
        - PYTHON_REQUIREMENTS=conf/huggingface-requirements.txt
        - AVRO_DIR=conf/avro
        - WORKFLOW_FILE=workflow.yaml
        - WORKFLOW_NAME=main
        - STEP_NAME=${name}
    shm_size: '2gb'
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              device_ids: ${
                (JSON.stringify(device_ids))
              }
              capabilities: [gpu]
    depends_on:
      - broker
      - init-kafka
      - connect
    volumes:
      - $PWD/nlp-tasks/${name}/cache:/root/.cache
    networks:
      - backend
    restart: always
`;

const workerUnit = { __comment, python, pytorch };
export default workerUnit;
