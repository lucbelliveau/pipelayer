import { type PlatformPipelayerConfiguration } from "../../..";

const s = (_: PlatformPipelayerConfiguration) => {
  return `if ! command -v curl >/dev/null 2>&1
then
    yum install -y curl
fi

if ! command -v yq >/dev/null 2>&1
then
    wget https://github.com/mikefarah/yq/releases/latest/download/yq_linux_amd64 -O /usr/bin/yq && \
    chmod +x /usr/bin/yq
fi

if ! command -v jq >/dev/null 2>&1
then
    yum install -y jq
fi
`;
};
export default s;
