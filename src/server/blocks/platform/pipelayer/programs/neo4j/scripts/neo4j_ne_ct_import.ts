import { type PlatformPipelayerConfiguration } from "../../..";

const s = (_: PlatformPipelayerConfiguration) => {
  return `/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //
  LOAD CSV WITH HEADERS FROM  "file:///keyword_mappings.tsv" AS row FIELDTERMINATOR "\\t"
  WITH row
      MERGE (e:NE {text: row.key_phrase})
          ON CREATE SET e.type = toBoolean(row.generic)
      MERGE (c:CT {text: row.category})
      MERGE (e)-[r:IN]->(c)
  RETURN COUNT(*);
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    `;
};

export default s;
