import { type Node } from "reactflow";
import {
  type BlockConfigurationFieldText,
  type BlockConfig,
  type BlockConfigurationField,
  type SurveyJSModelElementSchema,
  type SurveyJSModelSchema,
  type SurveyJSModelElementValidator,
  type BlockConfigurationFieldNumber,
  type SurveyJSModelSchemaPage,
  type BlockConfigurationFieldComment,
  type BlockConfigurationFieldMultiple,
  type BlockConfiguration,
  type NodeData,
  type BlockConfigurationFieldDropdown,
  type BlockConfigurationFieldSignin,
  type BlockConfigurationFieldBoolean,
  BlockConfigurationFieldKeyValueList,
} from "./types";

export const createModelFromBlockConfig = (
  config: BlockConfig<BlockConfiguration<unknown>>,
  nodes: Node<NodeData>[]
): SurveyJSModelSchema => {
  const TextElement = (
    field: BlockConfigurationField<never, BlockConfigurationFieldText>
  ): SurveyJSModelElementSchema => {
    const validators: SurveyJSModelElementValidator[] = [];

    if (
      typeof field.maxLength === "number" ||
      typeof field.minLength === "number"
    ) {
      const errText = [];
      if (typeof field.minLength === "number")
        errText.push(`Must have at least ${field.minLength} characters.`);
      if (typeof field.maxLength === "number")
        errText.push(`Must have no more than ${field.maxLength} characters.`);
      validators.push({
        type: "text",
        maxLength: field.maxLength,
        minLength: field.minLength,
        text: errText.join("\n"),
      });
    }

    if (field.regexp) {
      validators.push({
        type: "regex",
        regex: field.regexp,
        text: `Value must match the regular expression [${field.regexp.toString()}].`,
      });
    }

    return {
      name: String(field.name),
      title: field.title,
      isRequired: field.required,
      requiredErrorText: "This value is required",
      type: "text",
      validators,
      inputType: field.inputType,
      description: field.description,
      visibleIf: field.visibleIf,
    };
  };

  const NumberElement = (
    field: BlockConfigurationField<never, BlockConfigurationFieldNumber>
  ): SurveyJSModelElementSchema => {
    return {
      name: String(field.name),
      title: field.title,
      isRequired: field.required,
      requiredErrorText: "This value is required",
      type: "text",
      inputType: "number",
      min: field.min,
      max: field.max,
      description: field.description,
      visibleIf: field.visibleIf,
    };
  };

  const BooleanElement = (
    field: BlockConfigurationField<never, BlockConfigurationFieldBoolean>
  ): SurveyJSModelElementSchema => ({
    name: String(field.name),
    title: field.title,
    isRequired: field.required,
    requiredErrorText: "This value is required",
    type: "boolean",
    description: field.description,
    visibleIf: field.visibleIf,
  });

  const KeyValueListElement = (
    field: BlockConfigurationField<never, BlockConfigurationFieldKeyValueList>
  ): SurveyJSModelElementSchema => ({
    name: String(field.name),
    title: field.title,
    isRequired: field.required,
    requiredErrorText: "This value is required",
    type: "paneldynamic",
    description: field.description,
    visibleIf: field.visibleIf,
    templateElements: [
      {
        type: "multipletext",
        name: "keyvalue",
        items: [
          { name: "key", title: "Key" },
          { name: "value", title: "Value" },
        ]
      }
    ]
  });


  const CommentElement = (
    field: BlockConfigurationField<never, BlockConfigurationFieldComment>
  ): SurveyJSModelElementSchema => {
    return {
      name: String(field.name),
      title: field.title,
      isRequired: field.required,
      requiredErrorText: "This value is required",
      type: "comment",
      description: field.description,
      visibleIf: field.visibleIf,
    };
  };

  const MultipleElement = (
    field: BlockConfigurationField<never, BlockConfigurationFieldMultiple>
  ): SurveyJSModelElementSchema => {
    const choices: string[] = [];
    if ("source" in field) {
      nodes
        .filter((n) => n.data.block.type === field.source)
        .forEach((n) => choices.push(n.data.payload.name));
    } else if ("choices" in field) {
      field.choices.forEach((c) => choices.push(c));
    } else if ("provides" in field) {
      nodes
        .filter(
          (n) =>
            n.data.block.provides &&
            n.data.block.provides.includes(field.provides)
        )
        .forEach((n) => choices.push(n.data.payload.name));
    }
    return {
      name: String(field.name),
      title: field.title,
      isRequired: field.required,
      requiredErrorText: "This value is required",
      type: "tagbox",
      description: field.description,
      choices,
      visibleIf: field.visibleIf,
    };
  };

  const DropdownElement = (
    field: BlockConfigurationField<never, BlockConfigurationFieldDropdown>
  ): SurveyJSModelElementSchema => {
    const choices: string[] = [];
    if ("source" in field) {
      nodes
        .filter((n) => n.data.block.type === field.source)
        .forEach((n) => choices.push(n.data.payload.name));
    } else if ("choices" in field) {
      field.choices.forEach((c) => choices.push(c));
    } else if ("provides" in field) {
      nodes
        .filter(
          (n) =>
            n.data.block.provides &&
            n.data.block.provides.includes(field.provides)
        )
        .forEach((n) => choices.push(n.data.payload.name));
    }
    return {
      name: String(field.name),
      title: field.title,
      isRequired: field.required,
      requiredErrorText: "This value is required",
      type: "dropdown",
      choices,
      description: field.description,
      visibleIf: field.visibleIf,
    };
  };

  const SigninElement = (
    field: BlockConfigurationField<never, BlockConfigurationFieldSignin>
  ): SurveyJSModelElementSchema => {
    return {
      name: String(field.name),
      title: field.title,
      isRequired: field.required,
      requiredErrorText: "This value is required",
      type: "signin-google",
      description: field.description,
      visibleIf: field.visibleIf,
    };
  };

  const model: SurveyJSModelSchema = {
    showQuestionNumbers: "off",
    completeText: "Save",
    textUpdateMode: "onTyping",
    showCompletedPage: false,
    questionsOnPageMode: "singlePage",
    pages: [],
  };

  config.configuration &&
    config.configuration.forEach((page) => {
      const p: SurveyJSModelSchemaPage = {
        name: page.name,
        description: page.description,
        title: page.title,
        elements: [],
      };
      page.fields.forEach((field) => {
        if (field.type === "text") {
          p.elements.push(TextElement(field));
        } else if (field.type === "number") {
          p.elements.push(NumberElement(field));
        } else if (field.type === "boolean") {
          p.elements.push(BooleanElement(field));
        } else if (field.type === "comment") {
          p.elements.push(CommentElement(field));
        } else if (field.type === "multiple") {
          p.elements.push(MultipleElement(field));
        } else if (field.type === "dropdown") {
          p.elements.push(DropdownElement(field));
        } else if (field.type === "keyvalue-list") {
          p.elements.push(KeyValueListElement(field));
        } else if (field.type === "signin-google")
          p.elements.push(SigninElement(field));
      });
      model.pages.push(p);
    });

  if (model.pages.length === 0 || model.pages[0]?.title)
    model.pages.unshift({ name: "node", elements: [] });

  // if (!config.excludeDefaults?.includes("name"))
  model.pages[0]?.elements.unshift(
    TextElement({
      name: "name",
      title: "Name",
      description: "Name of this node",
      type: "text",
      required: true,
      maxLength: 255,
    })
  );

  // const hasConsumerTopics = model.pages.reduce(
  //   (p, page) =>
  //     p || Boolean(page.elements.find((el) => el.name === "consumer.topics")),
  //   false
  // );
  // const hasProducerTopics = model.pages.reduce(
  //   (p, page) =>
  //     p || Boolean(page.elements.find((el) => el.name === "producer.topics")),
  //   false
  // );

  // if (
  //   !hasConsumerTopics &&
  //   !config.excludeDefaults?.includes("consumer.topics")
  // )
  //   model.pages.push({
  //     name: "consumer",
  //     title: "Consumer",
  //     elements: [
  //       MultipleElement({
  //         name: "consumer.topics",
  //         title: "Topics",
  //         description: "Which topics will this worker read messages from?",
  //         type: "multiple",
  //         provides: "kafka-topic",
  //         direction: "in",
  //       }),
  //     ],
  //   });
  // if (
  //   !hasProducerTopics &&
  //   !config.excludeDefaults?.includes("producer.topics")
  // )
  //   model.pages.push({
  //     name: "producer",
  //     title: "Producer",
  //     elements: [
  //       MultipleElement({
  //         name: "producer.topics",
  //         title: "Topics",
  //         description: "To which topics will this worker write messages to?",
  //         type: "multiple",
  //         provides: "kafka-topic",
  //         direction: "out",
  //       }),
  //     ],
  //   });

  return model;
};
