/**
 * Projects Domain Types
 *
 * Auto-generated from OpenAPI spec
 * Generator: types-generator v2.0.0
 *
 * This file re-exports types from generated OpenAPI types and adds
 * convenient type aliases for handlers (response types, etc.)
 *
 * ⚠️ DO NOT EDIT MANUALLY - this file is auto-generated
 */

import type { components, operations } from "../openapi/projects.openapi.types";

// ============================================================================
// Re-export all generated types
// ============================================================================
// Note: components and operations are exported here but should be accessed via namespace
// in main index.ts to avoid duplicate export errors (e.g., blockchain.types.components)

export type { components, operations };


// ============================================================================
// Convenient Type Aliases for Schemas
// ============================================================================

export type CreditProject = components["schemas"]["CreditProject"];
export type CreditProjectCreate = components["schemas"]["CreditProjectCreate"];
export type CreditProjectId = components["schemas"]["CreditProjectId"];
export type Dataset = components["schemas"]["Dataset"];
export type DatasetAttach = components["schemas"]["DatasetAttach"];
export type DatasetId = components["schemas"]["DatasetId"];
export type EnvironmentLabel = components["schemas"]["EnvironmentLabel"];
export type ProjectStatus = components["schemas"]["ProjectStatus"];
export type Project = operations["listCreditProjects"]["responses"]["200"]["content"]["application/json"]["data"];


// ============================================================================
// Operation Input Types (Request Bodies)
// ============================================================================

// These types represent the input data for create/update operations

export type CreateCreditProjectRequestInput = NonNullable<operations["createCreditProject"]["requestBody"]>["content"]["application/json"];
export type AttachDatasetRequestInput = NonNullable<operations["attachDataset"]["requestBody"]>["content"]["application/json"];


// ============================================================================
// Operation Parameter Types (Query/Path Parameters)
// ============================================================================

// These types represent parameters for operations without request bodies.
// Aligned with get_input_schema_or_type_name for consistent naming across generators.

export type ListCreditProjectsParams = NonNullable<operations["listCreditProjects"]["parameters"]["query"]>;
export type GetCreditProjectParams = operations["getCreditProject"]["parameters"]["path"];
export type AttachDatasetParams = operations["attachDataset"]["parameters"]["path"];


// ============================================================================
// Operation Response Types
// ============================================================================

// These types are used by handlers for type-safe response envelopes

export type ListCreditProjectsResponse = operations["listCreditProjects"]["responses"]["200"]["content"]["application/json"];
export type CreateCreditProjectResponse = operations["createCreditProject"]["responses"]["201"]["content"]["application/json"];
export type GetCreditProjectResponse = operations["getCreditProject"]["responses"]["200"]["content"]["application/json"];
export type AttachDatasetResponse = operations["attachDataset"]["responses"]["201"]["content"]["application/json"];


