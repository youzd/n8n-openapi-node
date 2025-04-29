import { INodeProperties } from "n8n-workflow";
import {
  N8NPropertiesBuilder,
  N8NPropertiesBuilderConfig,
} from "../src/N8NPropertiesBuilder";

describe("youzd spec parsing", () => {
  it("should place not required fields as additionnal data", () => {
    //GIVEN
    const doc = require("./samples/youzd.json");
    const config: N8NPropertiesBuilderConfig = {
      useAdditionalFields: true,
    };
    const parser = new N8NPropertiesBuilder(doc, config);

    //WHEN
    const result = parser.build();

    //THEN
    const expected: INodeProperties[] = [
      {
        default: "",
        displayName: "Resource",
        name: "resource",
        noDataExpression: true,
        options: [
          {
            description: "",
            name: "Default",
            value: "Default",
          },
        ],
        type: "options",
      },
      {
        default: "",
        displayName: "Operation",
        displayOptions: {
          show: {
            resource: ["Default"],
          },
        },
        name: "operation",
        noDataExpression: true,
        options: [
          {
            action: "Create Product",
            description: "Create a new product",
            name: "Create Product",
            routing: {
              request: {
                method: "POST",
                url: "=/catalog",
              },
            },
            value: "Create Product",
          },
        ],
        type: "options",
      },
      {
        default: "",
        displayName: "POST /catalog",
        displayOptions: {
          show: {
            operation: ["Create Product"],
            resource: ["Default"],
          },
        },
        name: "operation",
        type: "notice",
        typeOptions: {
          theme: "info",
        },
      },
      {
        default: "4 seater convertible sofa",
        description: undefined,
        displayName: "Title",
        displayOptions: {
          show: {
            operation: ["Create Product"],
            resource: ["Default"],
          },
        },
        name: "title",
        required: true,
        routing: {
          send: {
            property: "title",
            propertyInDotNotation: false,
            type: "body",
            value: "={{ $value }}",
          },
        },
        type: "string",
      },
      {
        displayName: "Additional Fields",
        name: "additionalFields",
        type: "collection",
        placeholder: "Add Field",
        default: {},
        displayOptions: {
          show: {
            operation: ["Create Product"],
            resource: ["Default"],
          },
        },
        options: [
          {
            default: "",
            description: "Brand of the product",
            displayName: "Brand",
            name: "brand",
            routing: {
              send: {
                property: "brand",
                propertyInDotNotation: false,
                type: "body",
                value: "={{ $value }}",
              },
            },
            type: "string",
          },
        ],
      },
    ];
    expect(result).toEqual(expected);
  });
});
