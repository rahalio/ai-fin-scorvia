/**
 * Process-local DynamoDB DocumentClient stand-in for sandbox/dev without Docker.
 * Supports the put/get/query patterns used by generated DDB repositories.
 */

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
import type { AdapterDynamoDBClient } from "./dynamodb-client-types.js";

type Item = Record<string, unknown>;

function itemKey(table: string, pk: unknown, sk: unknown): string {
  return `${table}::${String(pk)}::${String(sk)}`;
}

export class InMemoryDynamoClient implements AdapterDynamoDBClient {
  private readonly items = new Map<string, Item>();

  async put(input: PutCommandInput): Promise<PutCommandOutput> {
    const table = String(input.TableName);
    const item = { ...(input.Item as Item) };
    const key = itemKey(table, item.PK, item.SK);
    if (input.ConditionExpression?.includes("attribute_not_exists") && this.items.has(key)) {
      const err = new Error("ConditionalCheckFailedException") as Error & {
        name: string;
      };
      err.name = "ConditionalCheckFailedException";
      throw err;
    }
    this.items.set(key, item);
    return {} as PutCommandOutput;
  }

  async get(input: GetCommandInput): Promise<GetCommandOutput> {
    const table = String(input.TableName);
    const key = input.Key as Item;
    const found = this.items.get(itemKey(table, key.PK, key.SK));
    return { Item: found } as GetCommandOutput;
  }

  async delete(input: DeleteCommandInput): Promise<DeleteCommandOutput> {
    const table = String(input.TableName);
    const key = input.Key as Item;
    this.items.delete(itemKey(table, key.PK, key.SK));
    return {} as DeleteCommandOutput;
  }

  async query(input: QueryCommandInput): Promise<QueryCommandOutput> {
    const table = String(input.TableName);
    const values = (input.ExpressionAttributeValues || {}) as Item;
    const names = (input.ExpressionAttributeNames || {}) as Record<string, string>;

    let items = [...this.items.entries()]
      .filter(([k]) => k.startsWith(`${table}::`))
      .map(([, item]) => item);

    const expr = input.KeyConditionExpression || "";
    if (expr.includes("begins_with") && values[":skPrefix"] != null) {
      const pkValue = values[":pk"];
      const skPrefix = String(values[":skPrefix"]);
      items = items.filter(
        (item) => item.PK === pkValue && String(item.SK || "").startsWith(skPrefix),
      );
    } else {
      const pkValue =
        values[":pk"] ??
        values[":PK"] ??
        values[":gsi2pk"] ??
        Object.values(values)[0];

      let attr = "PK";
      if (input.IndexName === "GSI2") attr = "GSI2-PK";
      if (expr) {
        const match = expr.match(/#(\w+)/);
        if (match && names[`#${match[1]}`]) attr = names[`#${match[1]}`];
        else if (expr.includes("GSI2-PK")) attr = "GSI2-PK";
        else if (expr.includes("PK")) attr = "PK";
      }
      items = items.filter((item) => item[attr] === pkValue);
    }

    if (input.ScanIndexForward === false) {
      items = [...items].reverse();
    }

    const limit = input.Limit ?? items.length;
    const slice = items.slice(0, limit);
    return {
      Items: slice,
      Count: slice.length,
      ScannedCount: items.length,
    } as QueryCommandOutput;
  }

  async scan(input: ScanCommandInput): Promise<ScanCommandOutput> {
    const table = String(input.TableName);
    const items = [...this.items.entries()]
      .filter(([k]) => k.startsWith(`${table}::`))
      .map(([, item]) => item);
    return { Items: items, Count: items.length } as ScanCommandOutput;
  }

  async update(input: UpdateCommandInput): Promise<UpdateCommandOutput> {
    const table = String(input.TableName);
    const key = input.Key as Item;
    const mapKey = itemKey(table, key.PK, key.SK);
    const existing = this.items.get(mapKey) || { ...key };
    const names = (input.ExpressionAttributeNames || {}) as Record<string, string>;
    const values = (input.ExpressionAttributeValues || {}) as Item;
    // Support SET #a = :a, #b = :b
    const setClause = (input.UpdateExpression || "").replace(/^SET\s+/i, "");
    for (const part of setClause.split(",")) {
      const [left, right] = part.split("=").map((s) => s.trim());
      if (!left || !right) continue;
      const field = left.startsWith("#") ? names[left] || left.slice(1) : left;
      const value = right.startsWith(":") ? values[right] : right;
      existing[field] = value;
    }
    this.items.set(mapKey, existing);
    return { Attributes: existing } as UpdateCommandOutput;
  }

  async batchWrite(
    _input: BatchWriteItemCommandInput,
  ): Promise<BatchWriteItemCommandOutput> {
    return { UnprocessedItems: {} } as BatchWriteItemCommandOutput;
  }

  async transactWrite(
    _input: TransactWriteCommandInput,
  ): Promise<TransactWriteCommandOutput> {
    return {} as TransactWriteCommandOutput;
  }

  async send<T>(command: T): Promise<any> {
    const anyCmd = command as { constructor?: { name?: string }; input?: any };
    const name = anyCmd?.constructor?.name || "";
    const input = anyCmd.input ?? anyCmd;
    if (name.includes("Put")) return this.put(input);
    if (name.includes("Get")) return this.get(input);
    if (name.includes("Query")) return this.query(input);
    if (name.includes("Update")) return this.update(input);
    if (name.includes("Delete")) return this.delete(input);
    if (name.includes("Scan")) return this.scan(input);
    return {};
  }
}

let sandboxClient: InMemoryDynamoClient | null = null;

export function getInMemoryDynamoClient(): InMemoryDynamoClient {
  if (!sandboxClient) sandboxClient = new InMemoryDynamoClient();
  return sandboxClient;
}

export function isSandboxDynamoMode(): boolean {
  if (process.env.USE_SANDBOX_STORE === "false") return false;
  if (process.env.USE_SANDBOX_STORE === "true") return true;
  return !(process.env.TABLE_NAME || process.env.DYNAMODB_CORE_TABLE_NAME);
}
