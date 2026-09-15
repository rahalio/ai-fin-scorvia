/**
 * Audits Domain Types
 *
 * Auto-generated from OpenAPI spec
 * Generator: types-generator v2.0.0
 *
 * This file re-exports types from generated OpenAPI types and adds
 * convenient type aliases for handlers (response types, etc.)
 *
 * ⚠️ DO NOT EDIT MANUALLY - this file is auto-generated
 */

import type { components, operations } from "../openapi/audits.openapi.types";

// ============================================================================
// Re-export all generated types
// ============================================================================
// Note: components and operations are exported here but should be accessed via namespace
// in main index.ts to avoid duplicate export errors (e.g., blockchain.types.components)

export type { components, operations };


// ============================================================================
// Convenient Type Aliases for Schemas
// ============================================================================

export type AuditExport = components["schemas"]["AuditExport"];
export type AuditExportCreate = components["schemas"]["AuditExportCreate"];
export type AuditExportId = components["schemas"]["AuditExportId"];
export type AuditExportStatus = components["schemas"]["AuditExportStatus"];
export type Export = operations["listAuditExports"]["responses"]["200"]["content"]["application/json"]["data"];


// ============================================================================
// Operation Input Types (Request Bodies)
// ============================================================================

// These types represent the input data for create/update operations

export type CreateScorviaAuditExportRequestInput = NonNullable<operations["createScorviaAuditExport"]["requestBody"]>["content"]["application/json"];


// ============================================================================
// Operation Parameter Types (Query/Path Parameters)
// ============================================================================

// These types represent parameters for operations without request bodies.
// Aligned with get_input_schema_or_type_name for consistent naming across generators.

export type ListAuditExportsParams = NonNullable<operations["listAuditExports"]["parameters"]["query"]>;
export type GetAuditExportParams = operations["getAuditExport"]["parameters"]["path"];


// ============================================================================
// Operation Response Types
// ============================================================================

// These types are used by handlers for type-safe response envelopes

export type ListAuditExportsResponse = operations["listAuditExports"]["responses"]["200"]["content"]["application/json"];
export type CreateScorviaAuditExportResponse = operations["createScorviaAuditExport"]["responses"]["201"]["content"]["application/json"];
export type GetAuditExportResponse = operations["getAuditExport"]["responses"]["200"]["content"]["application/json"];


