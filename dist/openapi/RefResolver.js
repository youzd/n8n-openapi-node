"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefResolver = void 0;
const lodash = __importStar(require("lodash"));
class RefResolver {
    constructor(doc) {
        this.doc = doc;
    }
    /**
     * Resolve ref and return it if found
     * @param schema
     */
    resolveRef(schema) {
        // @ts-ignore
        if ("properties" in schema) {
            return [schema, undefined];
        }
        // @ts-ignore
        if ("oneOf" in schema) {
            // @ts-ignore
            schema = schema.oneOf[0];
        }
        // @ts-ignore
        if ("anyOf" in schema) {
            // @ts-ignore
            schema = schema.anyOf[0];
        }
        // @ts-ignore
        if ("allOf" in schema) {
            // @ts-ignore
            const results = schema.allOf.map((s) => this.resolveRef(s));
            const schemas = results.map((r) => r[0]);
            const refs = results.map((r) => r[1]);
            const refsFlat = lodash.flatten(refs);
            const object = Object.assign({}, ...schemas);
            return [object, refsFlat];
        }
        // @ts-ignore
        if ("$ref" in schema) {
            const schemaResolved = this.findRef(schema["$ref"]);
            // Remove $ref from schema, add all other properties
            const { $ref, ...rest } = schema;
            Object.assign(rest, schemaResolved);
            return [rest, [$ref]];
        }
        if (schema && typeof schema === "object" && "type" in schema && schema.type === "array" && "items" in schema) {
            const { items, ...rest } = schema;
            const itemsSchema = this.resolveRef(items)[0];
            // Remove $ref from schema, add all other properties
            const object = Object.assign({ items: itemsSchema }, rest);
            return [object, undefined];
        }
        return [schema, undefined];
    }
    resolve(schema) {
        return this.resolveRef(schema)[0];
    }
    findRef(ref) {
        const refPath = ref.split("/").slice(1);
        let schema = this.doc;
        for (const path of refPath) {
            // @ts-ignore
            schema = schema[path];
            if (!schema) {
                throw new Error(`Schema not found for ref '${ref}'`);
            }
        }
        if ("$ref" in schema) {
            return this.findRef(schema["$ref"]);
        }
        return schema;
    }
}
exports.RefResolver = RefResolver;
//# sourceMappingURL=RefResolver.js.map