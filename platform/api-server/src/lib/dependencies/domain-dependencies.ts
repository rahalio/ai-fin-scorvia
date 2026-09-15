/**
 * Domain Dependency Injection Hook
 *
 * Hand-fitted after codegen for Scorvia domain path matching + sandbox Dynamo.
 */

import type { FastifyRequest, FastifyReply } from "fastify";
import type { AdapterDynamoDBClient } from "@scorvia/adapters";
import {
  getInMemoryDynamoClient,
  isSandboxDynamoMode,
} from "@scorvia/adapters";
import {
  DynamoDBClient,
  BatchWriteItemCommand,
} from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  QueryCommand,
  GetCommand,
  PutCommand,
  UpdateCommand,
  DeleteCommand,
  ScanCommand,
  TransactWriteCommand,
} from "@aws-sdk/lib-dynamodb";
import type {
  QueryCommandInput,
  QueryCommandOutput,
  GetCommandInput,
  GetCommandOutput,
  PutCommandInput,
  PutCommandOutput,
  UpdateCommandInput,
  UpdateCommandOutput,
  DeleteCommandInput,
  DeleteCommandOutput,
  ScanCommandInput,
  ScanCommandOutput,
  TransactWriteCommandInput,
  TransactWriteCommandOutput,
} from "@aws-sdk/lib-dynamodb";
import type {
  BatchWriteItemCommandInput,
  BatchWriteItemCommandOutput,
} from "@aws-sdk/client-dynamodb";
import { getAwsCredentialProvider } from "../infrastructure/aws-credentials.js";

import {
  buildAuditsDomainModule,
  buildAutomlDomainModule,
  buildEvaluationsDomainModule,
  buildIdentityDomainModule,
  buildMonitoringDomainModule,
  buildPolicyDomainModule,
  buildProjectsDomainModule,
  buildPromotionsDomainModule,
  buildReferralsDomainModule,
  buildScoringDomainModule,
} from "../../domains/index.js";
import type {
  AuditsDomainModule,
  AutomlDomainModule,
  EvaluationsDomainModule,
  IdentityDomainModule,
  MonitoringDomainModule,
  PolicyDomainModule,
  ProjectsDomainModule,
  PromotionsDomainModule,
  ReferralsDomainModule,
  ScoringDomainModule,
} from "../../domains/index.js";

const dependencyCache = new Map<string, any>();

function getCacheKey(domain: string): string {
  return domain;
}

class DynamoDBClientAdapter implements AdapterDynamoDBClient {
  constructor(private readonly docClient: DynamoDBDocumentClient) {}

  async query(input: QueryCommandInput): Promise<QueryCommandOutput> {
    return this.docClient.send(new QueryCommand(input));
  }

  async get(input: GetCommandInput): Promise<GetCommandOutput> {
    return this.docClient.send(new GetCommand(input));
  }

  async put(input: PutCommandInput): Promise<PutCommandOutput> {
    return this.docClient.send(new PutCommand(input));
  }

  async update(input: UpdateCommandInput): Promise<UpdateCommandOutput> {
    return this.docClient.send(new UpdateCommand(input));
  }

  async delete(input: DeleteCommandInput): Promise<DeleteCommandOutput> {
    return this.docClient.send(new DeleteCommand(input));
  }

  async scan(input: ScanCommandInput): Promise<ScanCommandOutput> {
    return this.docClient.send(new ScanCommand(input));
  }

  async batchWrite(
    input: BatchWriteItemCommandInput,
  ): Promise<BatchWriteItemCommandOutput> {
    return this.docClient.send(new BatchWriteItemCommand(input));
  }

  async transactWrite(
    input: TransactWriteCommandInput,
  ): Promise<TransactWriteCommandOutput> {
    return this.docClient.send(new TransactWriteCommand(input));
  }

  async send<T>(command: T): Promise<any> {
    return this.docClient.send(command as any);
  }
}

let dynamoClientInstance: AdapterDynamoDBClient | null = null;

export function getDynamoClientInstance(): AdapterDynamoDBClient {
  if (!dynamoClientInstance) {
    if (isSandboxDynamoMode()) {
      dynamoClientInstance = getInMemoryDynamoClient();
      return dynamoClientInstance;
    }

    const region =
      process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION || "us-east-1";
    const clientConfig: {
      region: string;
      endpoint?: string;
      credentials?: import("@aws-sdk/types").AwsCredentialIdentityProvider;
    } = { region };

    const credentialProvider = getAwsCredentialProvider();
    if (credentialProvider) clientConfig.credentials = credentialProvider;

    if (process.env.AWS_ENDPOINT_URL || process.env.LOCALSTACK_ENDPOINT) {
      clientConfig.endpoint =
        process.env.AWS_ENDPOINT_URL || process.env.LOCALSTACK_ENDPOINT;
    }

    const client = new DynamoDBClient(clientConfig);
    const docClient = DynamoDBDocumentClient.from(client);
    dynamoClientInstance = new DynamoDBClientAdapter(docClient);
  }
  return dynamoClientInstance;
}

const DOMAIN_PATH_PATTERNS: Array<{ pattern: RegExp; domain: string }> = [
  { pattern: /\/auth\//, domain: "identity" },
  { pattern: /\/tenants\//, domain: "identity" },
  { pattern: /\/projects/, domain: "projects" },
  { pattern: /\/automl-runs/, domain: "automl" },
  { pattern: /\/candidates/, domain: "automl" },
  { pattern: /\/evaluations/, domain: "evaluations" },
  { pattern: /\/interpretability/, domain: "evaluations" },
  { pattern: /\/promotions/, domain: "promotions" },
  { pattern: /\/policy-maps/, domain: "policy" },
  { pattern: /\/scoring/, domain: "scoring" },
  { pattern: /\/referrals/, domain: "referrals" },
  { pattern: /\/monitoring/, domain: "monitoring" },
  { pattern: /\/audits/, domain: "audits" },
];

function detectDomainFromPath(path: string): string | null {
  for (const { pattern, domain } of DOMAIN_PATH_PATTERNS) {
    if (pattern.test(path)) {
      return domain;
    }
  }
  return null;
}

export async function injectDomainDependencies(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const orgId = (request as any).effectiveOrgId;

  if (!orgId) {
    reply.status(401).send({
      error: "Unauthorized",
      message:
        "Missing orgId. setOrgContext hook must run before injectDomainDependencies.",
    });
    return;
  }

  const path = request.url;
  const domain = detectDomainFromPath(path);

  if (!domain) {
    return;
  }

  if (!(request as any).deps) {
    (request as any).deps = {};
  }

  const cacheKey = getCacheKey(domain);
  let domainDeps = dependencyCache.get(cacheKey);

  if (!domainDeps) {
    const dynamoClient = getDynamoClientInstance();

    switch (domain) {
      case "audits":
        domainDeps = buildAuditsDomainModule(dynamoClient);
        break;
      case "automl":
        domainDeps = buildAutomlDomainModule(dynamoClient);
        break;
      case "evaluations":
        domainDeps = buildEvaluationsDomainModule(dynamoClient);
        break;
      case "identity":
        domainDeps = buildIdentityDomainModule(dynamoClient);
        break;
      case "monitoring":
        domainDeps = buildMonitoringDomainModule(dynamoClient);
        break;
      case "policy":
        domainDeps = buildPolicyDomainModule(dynamoClient);
        break;
      case "projects":
        domainDeps = buildProjectsDomainModule(dynamoClient);
        break;
      case "promotions":
        domainDeps = buildPromotionsDomainModule(dynamoClient);
        break;
      case "referrals":
        domainDeps = buildReferralsDomainModule(dynamoClient);
        break;
      case "scoring":
        domainDeps = buildScoringDomainModule(dynamoClient);
        break;
      default:
        return;
    }

    dependencyCache.set(cacheKey, domainDeps);
  }

  (request as any).deps[domain] = domainDeps;
}

export function getDomainDeps(
  request: FastifyRequest,
  domain: "audits",
): AuditsDomainModule;
export function getDomainDeps(
  request: FastifyRequest,
  domain: "automl",
): AutomlDomainModule;
export function getDomainDeps(
  request: FastifyRequest,
  domain: "evaluations",
): EvaluationsDomainModule;
export function getDomainDeps(
  request: FastifyRequest,
  domain: "identity",
): IdentityDomainModule;
export function getDomainDeps(
  request: FastifyRequest,
  domain: "monitoring",
): MonitoringDomainModule;
export function getDomainDeps(
  request: FastifyRequest,
  domain: "policy",
): PolicyDomainModule;
export function getDomainDeps(
  request: FastifyRequest,
  domain: "projects",
): ProjectsDomainModule;
export function getDomainDeps(
  request: FastifyRequest,
  domain: "promotions",
): PromotionsDomainModule;
export function getDomainDeps(
  request: FastifyRequest,
  domain: "referrals",
): ReferralsDomainModule;
export function getDomainDeps(
  request: FastifyRequest,
  domain: "scoring",
): ScoringDomainModule;
export function getDomainDeps(request: FastifyRequest, domain: string): any {
  const deps = (request as any).deps?.[domain];
  if (!deps) {
    throw new Error(
      `Domain dependencies for "${domain}" not found. Ensure injectDomainDependencies ran.`,
    );
  }
  return deps;
}

export function clearDependencyCache(): void {
  dependencyCache.clear();
}
