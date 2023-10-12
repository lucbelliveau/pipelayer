import { type PlatformPipelayerConfiguration } from "../../..";

const s = (_: PlatformPipelayerConfiguration) => {
  return `{
    "type": "record",
    "name": "unique_article_value",
    "fields": [
        {"name": "doc_id",  "type": ["null", "string"], "default": null},
        {"name": "doc_file",  "type": ["null", "string"], "default": null},
        {"name": "doc_type", "type": ["null",	"string"], "default": null},
        {"name": "dates", "type": ["null", {"type": "array", "items": "string"}], "default": null},
        {"name": "dup_id_list", "type": ["null", {"type": "array", "items": "string"}], "default": null},
        {"name": "folder_name", "type": ["null", {"type": "array", "items": "string"}], "default": null},
        {"name": "full_text", "type": ["null", "string"], "default": null},
        {"name": "headline", "type": ["null", "string"], "default": null},
        {"name": "headline_original", "type": ["null",	"string"], "default": null},
        {"name": "key_phrases_json", "type": ["null", "string"], "default": null},
        {"name": "lang_id", "type": ["null", "string"], "default": null},
        {"name": "lang_name", "type": ["null", "string"], "default": null},
        {"name": "named_entities_json", "type": ["null", "string"], "default": null},
        {"name": "sentences", "type": ["null", {"type": "array", "items": "string"}], "default": null},
        {"name": "sentences_original", "type": ["null", {"type": "array", "items": "string"}], "default": null},
        {"name": "sim_id_list", "type": ["null", {"type": "array", "items": "string"}], "default": null},
        {"name": "source", "type": ["null", "string"], "default": null},
        {"name": "snippet", "type": ["null", {"type": "array", "items": "string"}], "default": null},
        {"name": "snippet_original", "type": ["null", {"type": "array", "items": "string"}], "default": null},
        {"name": "summary_text", "type": ["null", "string"], "default": null},
        {"name": "topics", "type": ["null", "string"], "default": null}
    ]
}
`;
};
export default s;
