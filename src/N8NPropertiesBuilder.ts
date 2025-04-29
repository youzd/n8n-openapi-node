import * as lodash from "lodash";
import { INodeProperties } from "n8n-workflow";
import { OpenAPIV3 } from "openapi-types";
import pino from "pino";
import { OpenAPIWalker } from "./openapi/OpenAPIWalker";
import { DefaultOperationParser, IOperationParser } from "./OperationParser";
import {
  BaseOperationsCollector,
  OperationsCollector as OperationsCollectorImpl,
} from "./OperationsCollector";
import { ResourceCollector as ResourcePropertiesCollector } from "./ResourceCollector";
import { DefaultResourceParser, IResourceParser } from "./ResourceParser";

export interface Override {
  find: any;
  replace: any;
}

export interface N8NPropertiesBuilderConfig {
  logger?: pino.Logger;
  OperationsCollector?: typeof BaseOperationsCollector;
  ResourcePropertiesCollector?: typeof ResourcePropertiesCollector;
  operation?: IOperationParser;
  resource?: IResourceParser;
  useAdditionalFields?: boolean;
}

/**
 *
 * Builds n8n node "properties" from an OpenAPI document.
 * It uses a walker to traverse the OpenAPI document and collect the necessary information.
 * The collected information is then used to build the n8n node properties.
 * The class uses a set of parsers to parse the OpenAPI document and build the n8n node properties.
 *
 */
export class N8NPropertiesBuilder {
  private readonly doc: OpenAPIV3.Document;
  private readonly logger: pino.Logger;
  private readonly walker: OpenAPIWalker;

  // DI
  private readonly operationParser: IOperationParser;
  private readonly resourceParser: IResourceParser;
  private readonly OperationsCollector: typeof BaseOperationsCollector;
  private readonly ResourcePropertiesCollector: typeof ResourcePropertiesCollector;
  private readonly useAdditionalFields: boolean;

  constructor(doc: any, config?: N8NPropertiesBuilderConfig) {
    this.doc = doc;
    this.logger =
      config?.logger || pino({ transport: { target: "pino-pretty" } });
    this.walker = new OpenAPIWalker(this.doc);

    // DI
    this.operationParser = config?.operation || new DefaultOperationParser();
    this.resourceParser = config?.resource || new DefaultResourceParser();
    this.OperationsCollector = config?.OperationsCollector
      ? config.OperationsCollector
      : OperationsCollectorImpl;
    this.ResourcePropertiesCollector = config?.ResourcePropertiesCollector
      ? config.ResourcePropertiesCollector
      : ResourcePropertiesCollector;
    this.useAdditionalFields = config?.useAdditionalFields || false;
  }

  build(overrides: Override[] = []): INodeProperties[] {
    const resourcePropertiesCollector = new this.ResourcePropertiesCollector(
      this.resourceParser
    );
    this.walker.walk(resourcePropertiesCollector);
    const resourceNode = resourcePropertiesCollector.resources;

    const operationsCollector = new this.OperationsCollector(
      this.doc,
      this.operationParser,
      this.resourceParser,
      this.logger,
      this.useAdditionalFields
    );
    this.walker.walk(operationsCollector);
    const operations = operationsCollector.operations;
    const fields = operationsCollector.fields;

    const properties = [resourceNode, ...operations, ...fields];
    return this.update(properties, overrides);
  }

  private update(fields: any[], patterns: Override[]) {
    for (const pattern of patterns) {
      for (const element of lodash.filter(fields, pattern.find)) {
        Object.assign(element, pattern.replace);
      }
    }
    return fields;
  }
}
