/**
 * Automl Domain Types
 *
 * Auto-generated from OpenAPI spec
 * Generator: types-generator v2.0.0
 *
 * This file re-exports types from generated OpenAPI types and adds
 * convenient type aliases for handlers (response types, etc.)
 *
 * ⚠️ DO NOT EDIT MANUALLY - this file is auto-generated
 */

import type { components, operations } from "../openapi/automl.openapi.types";

// ============================================================================
// Domain Types Export - Domain-specific types only (excludes components/operations)
// ============================================================================
// This file exports domain-specific types for use in main index.ts
// components and operations are NOT exported here to avoid duplicate export errors
// Access components/operations via namespace: domain.types.components

// ============================================================================
// Convenient Type Aliases for Schemas
// ============================================================================

export type AutoMLRun = components["schemas"]["AutoMLRun"];
export type AutoMLRunCreate = components["schemas"]["AutoMLRunCreate"];
export type AutoMLRunId = components["schemas"]["AutoMLRunId"];
export type CandidateModel = components["schemas"]["CandidateModel"];
export type CandidateModelId = components["schemas"]["CandidateModelId"];
export type RunStatus = components["schemas"]["RunStatus"];
export type AutomlRun = operations["listAutoMLRuns"]["responses"]["200"]["content"]["application/json"]["data"];
export type Candidate = operations["listCandidates"]["responses"]["200"]["content"]["application/json"]["data"];


// ============================================================================
// Operation Input Types (Request Bodies)
// ============================================================================

// These types represent the input data for create/update operations

export type StartAutoMLRunRequestInput = NonNullable<operations["startAutoMLRun"]["requestBody"]>["content"]["application/json"];


// ============================================================================
// Operation Parameter Types (Query/Path Parameters)
// ============================================================================

// These types represent parameters for operations without request bodies.
// Aligned with get_input_schema_or_type_name for consistent naming across generators.

export type ListAutoMLRunsParams = NonNullable<operations["listAutoMLRuns"]["parameters"]["query"]>;
export type StartAutoMLRunParams = operations["startAutoMLRun"]["parameters"]["path"];
export type GetAutoMLRunParams = operations["getAutoMLRun"]["parameters"]["path"];
export type ListCandidatesParams = NonNullable<operations["listCandidates"]["parameters"]["query"]>;
export type GetCandidateParams = operations["getCandidate"]["parameters"]["path"];


// ============================================================================
// Operation Response Types
// ============================================================================

// These types are used by handlers for type-safe response envelopes

export type ListAutoMLRunsResponse = operations["listAutoMLRuns"]["responses"]["200"]["content"]["application/json"];
export type StartAutoMLRunResponse = operations["startAutoMLRun"]["responses"]["202"]["content"]["application/json"];
export type GetAutoMLRunResponse = operations["getAutoMLRun"]["responses"]["200"]["content"]["application/json"];
export type ListCandidatesResponse = operations["listCandidates"]["responses"]["200"]["content"]["application/json"];
export type GetCandidateResponse = operations["getCandidate"]["responses"]["200"]["content"]["application/json"];


