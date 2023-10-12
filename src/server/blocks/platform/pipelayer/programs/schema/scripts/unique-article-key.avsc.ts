import { type PlatformPipelayerConfiguration } from "../../..";

const s = (_: PlatformPipelayerConfiguration) => {
  return `{
	"type": "record",
	"name": "unique_article_key",
	"fields": [
		{
			"name": "doc_id",
			"type": "string"
		}
	]
}`;
};

export default s;
