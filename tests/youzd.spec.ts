import { INodeProperties } from "n8n-workflow";
import { N8NPropertiesBuilder, N8NPropertiesBuilderConfig } from "../src/N8NPropertiesBuilder";

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
                    {
                        default: "usedLessThan14Days",
                        description: `Possible values :<br />
<br />
<dl>
<dt>usedLessThan14Days</dt>
<dd>Product returned within 14 days after purchase </dd>
<dt>refurbished</dt>
<dd>Refurbished products</dd>
<dt>neverUnpacked</dt><dd>Product that has not been used because it was refused at delivery (damaged) or was never delivered because lost and found, any product that has never been used nor fixed if it was damaged</dd>
</dl>`,
                        displayName: "Advantage",
                        name: "advantage",
                        options: [
                            {
                                name: "Used Less Than 14 Days",
                                value: "usedLessThan14Days",
                            },
                            {
                                name: "Never Unpacked",
                                value: "neverUnpacked",
                            },
                            {
                                name: "Refurbished",
                                value: "refurbished",
                            },
                        ],
                        routing: {
                            send: {
                                property: "advantage",
                                propertyInDotNotation: false,
                                type: "body",
                                value: "={{ $value }}",
                            },
                        },
                        type: "options",
                    },
                    {
                        default: [],
                        options: [
                            { name: "Noir", value: "Noir" },
                            { name: "Blanc", value: "Blanc" },
                            { name: "Beige", value: "Beige" },
                            { name: "Gris", value: "Gris" },
                            { name: "Rouge", value: "Rouge" },
                            { name: "Rose", value: "Rose" },
                            { name: "Orange", value: "Orange" },
                            { name: "Jaune", value: "Jaune" },
                            { name: "Vert", value: "Vert" },
                            { name: "Bleu", value: "Bleu" },
                            { name: "Violet", value: "Violet" },
                            { name: "Marron", value: "Marron" },
                            { name: "Bois Clair", value: "Bois clair" },
                            { name: "Bois Fonce", value: "Bois foncé" },
                            { name: "Transparent", value: "Transparent" },
                            { name: "Cuivre", value: "Cuivré" },
                            { name: "Argente", value: "Argenté" },
                            { name: "Dore", value: "Doré" },
                        ],
                        description:
                            "At least one and up to three colors can be specified on a product. They should be sorted in order of importance on the product.",
                        displayName: "Colors",
                        name: "colors",
                        routing: {
                            send: {
                                property: "colors",
                                propertyInDotNotation: false,
                                type: "body",
                                value: "={{ $value }}",
                            },
                        },
                        type: "multiOptions",
                    },
                    {
                        default: [],
                        description:
                            "Urls of photos for the product. These urls need to be puvblic to allow downloading the photos.",
                        displayName: "Photos",
                        name: "photos",
                        routing: {
                            send: {
                                property: "photos",
                                propertyInDotNotation: false,
                                type: "body",
                                value: "={{ $value }}",
                            },
                        },
                        type: "string",
                        typeOptions: {
                            multipleValueButtonText: "Add",
                            multipleValues: true,
                        },
                    },
                ],
            },
        ];
        expect(result).toEqual(expected);
    });
});
