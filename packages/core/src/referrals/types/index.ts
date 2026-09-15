/**
 * Referrals Domain Types
 *
 * Auto-generated from OpenAPI spec
 * Generator: types-generator v2.0.0
 *
 * This file re-exports types from generated OpenAPI types and adds
 * convenient type aliases for handlers (response types, etc.)
 *
 * ⚠️ DO NOT EDIT MANUALLY - this file is auto-generated
 */

import type { components, operations } from "../openapi/referrals.openapi.types";

// ============================================================================
// Re-export all generated types
// ============================================================================
// Note: components and operations are exported here but should be accessed via namespace
// in main index.ts to avoid duplicate export errors (e.g., blockchain.types.components)

export type { components, operations };


// ============================================================================
// Convenient Type Aliases for Schemas
// ============================================================================

export type Referral = components["schemas"]["Referral"];
export type ReferralId = components["schemas"]["ReferralId"];
export type ReferralResolve = components["schemas"]["ReferralResolve"];
export type ReferralStatus = components["schemas"]["ReferralStatus"];


// ============================================================================
// Operation Input Types (Request Bodies)
// ============================================================================

// These types represent the input data for create/update operations

export type ResolveReferralRequestInput = NonNullable<operations["resolveReferral"]["requestBody"]>["content"]["application/json"];


// ============================================================================
// Operation Parameter Types (Query/Path Parameters)
// ============================================================================

// These types represent parameters for operations without request bodies.
// Aligned with get_input_schema_or_type_name for consistent naming across generators.

export type ListReferralsParams = NonNullable<operations["listReferrals"]["parameters"]["query"]>;
export type GetReferralParams = operations["getReferral"]["parameters"]["path"];
export type ResolveReferralParams = operations["resolveReferral"]["parameters"]["path"];


// ============================================================================
// Operation Response Types
// ============================================================================

// These types are used by handlers for type-safe response envelopes

export type ListReferralsResponse = operations["listReferrals"]["responses"]["200"]["content"]["application/json"];
export type GetReferralResponse = operations["getReferral"]["responses"]["200"]["content"]["application/json"];
export type ResolveReferralResponse = operations["resolveReferral"]["responses"]["200"]["content"]["application/json"];


