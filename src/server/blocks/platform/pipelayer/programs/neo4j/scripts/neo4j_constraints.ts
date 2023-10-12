import { type PlatformPipelayerConfiguration } from "../../..";

const s = (_: PlatformPipelayerConfiguration) => {

  return `// Constraints

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //
  // Constraints
  CREATE CONSTRAINT article_doc_id IF NOT EXISTS FOR (n: \`Article\`) REQUIRE n.\`doc_id\` IS UNIQUE;
  //CREATE CONSTRAINT piped_doc_id IF NOT EXISTS FOR (n: \`PIPED\`) REQUIRE n.\`doc_id\` IS UNIQUE;
  
  CREATE CONSTRAINT cause_of_death_text IF NOT EXISTS FOR (n: \`CAUSE_OF_DEATH\`) REQUIRE n.\`text\` IS UNIQUE;
  CREATE CONSTRAINT city_text IF NOT EXISTS FOR (n: \`CITY\`) REQUIRE n.\`text\` IS UNIQUE;
  CREATE CONSTRAINT country_text IF NOT EXISTS FOR (n: \`COUNTRY\`) REQUIRE n.\`text\` IS UNIQUE;
  CREATE CONSTRAINT crime_charge_text IF NOT EXISTS FOR (n: \`CRIME_CHARGE\`) REQUIRE n.\`text\` IS UNIQUE;
  CREATE CONSTRAINT date_text IF NOT EXISTS FOR (n: \`DATE\`) REQUIRE n.\`text\` IS UNIQUE;
  CREATE CONSTRAINT duration_text IF NOT EXISTS FOR (n: \`DURATION\`) REQUIRE n.\`text\` IS UNIQUE;
  CREATE CONSTRAINT email_text IF NOT EXISTS FOR (n: \`EMAIL\`) REQUIRE n.\`text\` IS UNIQUE;
  CREATE CONSTRAINT handle_text IF NOT EXISTS FOR (n: \`HANDLE\`) REQUIRE n.\`text\` IS UNIQUE;
  CREATE CONSTRAINT ideology_text IF NOT EXISTS FOR (n: \`IDEOLOGY\`) REQUIRE n.\`text\` IS UNIQUE;
  CREATE CONSTRAINT location_text IF NOT EXISTS FOR (n: \`LOCATION\`) REQUIRE n.\`text\` IS UNIQUE;
  CREATE CONSTRAINT misc_text IF NOT EXISTS FOR (n: \`MISC\`) REQUIRE n.\`text\` IS UNIQUE;
  CREATE CONSTRAINT money_text IF NOT EXISTS FOR (n: \`MONEY\`) REQUIRE n.\`text\` IS UNIQUE;
  CREATE CONSTRAINT nationality_text IF NOT EXISTS FOR (n: \`NATIONALITY\`) REQUIRE n.\`text\` IS UNIQUE;
  CREATE CONSTRAINT number_text IF NOT EXISTS FOR (n: \`NUMBER\`) REQUIRE n.\`text\` IS UNIQUE;
  CREATE CONSTRAINT ordinal_text IF NOT EXISTS FOR (n: \`ORDINAL\`) REQUIRE n.\`text\` IS UNIQUE;
  CREATE CONSTRAINT organization_text IF NOT EXISTS FOR (n: \`ORGANIZATION\`) REQUIRE n.\`text\` IS UNIQUE;
  CREATE CONSTRAINT percent_text IF NOT EXISTS FOR (n: \`PERCENT\`) REQUIRE n.\`text\` IS UNIQUE;
  CREATE CONSTRAINT person_text IF NOT EXISTS FOR (n: \`PERSON\`) REQUIRE n.\`text\` IS UNIQUE;
  CREATE CONSTRAINT religion_text IF NOT EXISTS FOR (n: \`RELIGION\`) REQUIRE n.\`text\` IS UNIQUE;
  CREATE CONSTRAINT set_text IF NOT EXISTS FOR (n: \`SET\`) REQUIRE n.\`text\` IS UNIQUE;
  CREATE CONSTRAINT state_or_province_text IF NOT EXISTS FOR (n: \`STATE_OR_PROVINCE\`) REQUIRE n.\`text\` IS UNIQUE;
  CREATE CONSTRAINT time_text IF NOT EXISTS FOR (n: \`TIME\`) REQUIRE n.\`text\` IS UNIQUE;
  CREATE CONSTRAINT title_text IF NOT EXISTS FOR (n: \`TITLE\`) REQUIRE n.\`text\` IS UNIQUE;
  CREATE CONSTRAINT url_text IF NOT EXISTS FOR (n: \`URL\`) REQUIRE n.\`text\` IS UNIQUE;
  
  CREATE CONSTRAINT NE_text IF NOT EXISTS FOR (n: \`NE\`) REQUIRE n.\`text\` IS UNIQUE;
  CREATE CONSTRAINT ct_text IF NOT EXISTS FOR (n: \`CT\`) REQUIRE n.\`text\` IS UNIQUE;
  //
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  `;
};

export default s;
