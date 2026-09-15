/**
 * Policy Domain Types
 *
 * Auto-generated from OpenAPI spec
 * Generator: types-generator v2.0.0
 *
 * This file re-exports types from generated OpenAPI types and adds
 * convenient type aliases for handlers (response types, etc.)
 *
 * ⚠️ DO NOT EDIT MANUALLY - this file is auto-generated
 */

import type { components, operations } from "../openapi/policy.openapi.types";

// ============================================================================
// Re-export all generated types
// ============================================================================
// Note: components and operations are exported here but should be accessed via namespace
// in main index.ts to avoid duplicate export errors (e.g., blockchain.types.components)

export type { components, operations };


// ============================================================================
// Convenient Type Aliases for Schemas
// ============================================================================

export type PdBand = components["schemas"]["PdBand"];
export type PolicyMap = components["schemas"]["PolicyMap"];
export type PolicyMapCreate = components["schemas"]["PolicyMapCreate"];
export type PolicyMapId = components["schemas"]["PolicyMapId"];
export type PolicyMapStatus = components["schemas"]["PolicyMapStatus"];
export type PolicySimulateResult = components["schemas"]["PolicySimulateResult"];
export type PolicySimulateRequest = components["schemas"]["PolicySimulateRequest"];


// ============================================================================
// Operation Input Types (Request Bodies)
// ============================================================================

// These types represent the input data for create/update operations

export type CreatePolicyMapRequestInput = NonNullable<operations["createPolicyMap"]["requestBody"]>["content"]["application/json"];
export type SimulatePolicyMapRequestInput = NonNullable<operations["simulatePolicyMap"]["requestBody"]>["content"]["application/json"];


// ============================================================================
// Operation Parameter Types (Query/Path Parameters)
// ============================================================================

// These types represent parameters for operations without request bodies.
// Aligned with get_input_schema_or_type_name for consistent naming across generators.

export type ListPolicyMapsParams = NonNullable<operations["listPolicyMaps"]["parameters"]["query"]>;
export type GetPolicyMapParams = operations["getPolicyMap"]["parameters"]["path"];
export type PublishPolicyMapParams = operations["publishPolicyMap"]["parameters"]["path"];
export type SimulatePolicyMapParams = operations["simulatePolicyMap"]["parameters"]["path"];


// ============================================================================
// Operation Response Types
// ============================================================================

// These types are used by handlers for type-safe response envelopes

export type ListPolicyMapsResponse = operations["listPolicyMaps"]["responses"]["200"]["content"]["application/json"];
export type CreatePolicyMapResponse = operations["createPolicyMap"]["responses"]["201"]["content"]["application/json"];
export type GetPolicyMapResponse = operations["getPolicyMap"]["responses"]["200"]["content"]["application/json"];
export type PublishPolicyMapResponse = operations["publishPolicyMap"]["responses"]["200"]["content"]["application/json"];
export type SimulatePolicyMapResponse = operations["simulatePolicyMap"]["responses"]["200"]["content"]["application/json"];


