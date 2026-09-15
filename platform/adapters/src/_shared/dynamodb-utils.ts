/**
 * DynamoDB Utilities
 *
 * Table name resolvers and shared helpers for DynamoDB repository adapters.
 * Entity-specific key building is done via each adapter's private buildPK/buildSK.
 */

export { sanitizeItem } from "./dynamodb-key-helpers.js";

/**
 * Get the core DynamoDB table name from environment variables
 */
export function getCoreTableName(): string {
  const tableName = process.env.TABLE_NAME || process.env.DYNAMODB_CORE_TABLE_NAME;
  if (!tableName) {
    return "scorvia-core-sandbox";
  }
  return tableName;
}

/**
 * Get the base DynamoDB table name from environment variables
 */
export function getBaseTableName(): string {
  const tableName = process.env.BASE_TABLE_NAME || process.env.DYNAMODB_BASE_TABLE_NAME;
  if (!tableName) {
    return "scorvia-base-sandbox";
  }
  return tableName;
}

/**
 * Get the analytics DynamoDB table name from environment variables
 */
export function getAnalyticsTableName(): string {
  const tableName = process.env.ANALYTICS_TABLE_NAME || process.env.DYNAMODB_ANALYTICS_TABLE_NAME;
  if (!tableName) {
    return "scorvia-analytics-sandbox";
  }
  return tableName;
}

/**
 * Get the realtime DynamoDB table name from environment variables
 */
export function getRealtimeTableName(): string {
  const tableName =
    process.env.REALTIME_TABLE_NAME || process.env.DYNAMODB_REALTIME_TABLE_NAME;
  if (!tableName) {
    return "scorvia-realtime-sandbox";
  }
  return tableName;
}
