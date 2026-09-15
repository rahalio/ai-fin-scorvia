/**
 * Scoring Domain Types
 *
 * Auto-generated from OpenAPI spec
 * Generator: types-generator v2.0.0
 *
 * This file re-exports types from generated OpenAPI types and adds
 * convenient type aliases for handlers (response types, etc.)
 *
 * ⚠️ DO NOT EDIT MANUALLY - this file is auto-generated
 */

import type { components, operations } from "../openapi/scoring.openapi.types";

// ============================================================================
// Re-export all generated types
// ============================================================================
// Note: components and operations are exported here but should be accessed via namespace
// in main index.ts to avoid duplicate export errors (e.g., blockchain.types.components)

export type { components, operations };


// ============================================================================
// Convenient Type Aliases for Schemas
// ============================================================================

export type EnvironmentLabel = components["schemas"]["EnvironmentLabel"];
export type ProductionDeployment = components["schemas"]["ProductionDeployment"];
export type ProductionDeploymentId = components["schemas"]["ProductionDeploymentId"];
export type ScoreDecision = components["schemas"]["ScoreDecision"];
export type ScoreResult = components["schemas"]["ScoreResult"];
export type ScoreResultId = components["schemas"]["ScoreResultId"];
export type ScoreRequest = components["schemas"]["ScoreRequest"];
export type Deployment = operations["listDeployments"]["responses"]["200"]["content"]["application/json"]["data"];


// ============================================================================
// Operation Input Types (Request Bodies)
// ============================================================================

// These types represent the input data for create/update operations

export type ScoreApplicationRequestInput = NonNullable<operations["scoreApplication"]["requestBody"]>["content"]["application/json"];


// ============================================================================
// Operation Parameter Types (Query/Path Parameters)
// ============================================================================

// These types represent parameters for operations without request bodies.
// Aligned with get_input_schema_or_type_name for consistent naming across generators.

export type ListDeploymentsParams = NonNullable<operations["listDeployments"]["parameters"]["query"]>;


// ============================================================================
// Operation Response Types
// ============================================================================

// These types are used by handlers for type-safe response envelopes

export type ScoreApplicationResponse = operations["scoreApplication"]["responses"]["200"]["content"]["application/json"];
export type ListDeploymentsResponse = operations["listDeployments"]["responses"]["200"]["content"]["application/json"];


