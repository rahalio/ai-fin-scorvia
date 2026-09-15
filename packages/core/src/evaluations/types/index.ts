/**
 * Evaluations Domain Types
 *
 * Auto-generated from OpenAPI spec
 * Generator: types-generator v2.0.0
 *
 * This file re-exports types from generated OpenAPI types and adds
 * convenient type aliases for handlers (response types, etc.)
 *
 * ⚠️ DO NOT EDIT MANUALLY - this file is auto-generated
 */

import type { components, operations } from "../openapi/evaluations.openapi.types";

// ============================================================================
// Re-export all generated types
// ============================================================================
// Note: components and operations are exported here but should be accessed via namespace
// in main index.ts to avoid duplicate export errors (e.g., blockchain.types.components)

export type { components, operations };


// ============================================================================
// Convenient Type Aliases for Schemas
// ============================================================================

export type EvaluationCreate = components["schemas"]["EvaluationCreate"];
export type EvaluationReport = components["schemas"]["EvaluationReport"];
export type EvaluationReportId = components["schemas"]["EvaluationReportId"];
export type InterpretabilityPack = components["schemas"]["InterpretabilityPack"];
export type InterpretabilityPackCreate = components["schemas"]["InterpretabilityPackCreate"];
export type InterpretabilityPackId = components["schemas"]["InterpretabilityPackId"];
export type Evaluation = operations["listEvaluations"]["responses"]["200"]["content"]["application/json"]["data"];


// ============================================================================
// Operation Input Types (Request Bodies)
// ============================================================================

// These types represent the input data for create/update operations

export type RunEvaluationRequestInput = NonNullable<operations["runEvaluation"]["requestBody"]>["content"]["application/json"];
export type AttachInterpretabilityPackRequestInput = NonNullable<operations["attachInterpretabilityPack"]["requestBody"]>["content"]["application/json"];


// ============================================================================
// Operation Parameter Types (Query/Path Parameters)
// ============================================================================

// These types represent parameters for operations without request bodies.
// Aligned with get_input_schema_or_type_name for consistent naming across generators.

export type RunEvaluationParams = operations["runEvaluation"]["parameters"]["path"];
export type ListEvaluationsParams = NonNullable<operations["listEvaluations"]["parameters"]["query"]>;
export type GetEvaluationParams = operations["getEvaluation"]["parameters"]["path"];
export type AttachInterpretabilityPackParams = operations["attachInterpretabilityPack"]["parameters"]["path"];


// ============================================================================
// Operation Response Types
// ============================================================================

// These types are used by handlers for type-safe response envelopes

export type RunEvaluationResponse = operations["runEvaluation"]["responses"]["201"]["content"]["application/json"];
export type ListEvaluationsResponse = operations["listEvaluations"]["responses"]["200"]["content"]["application/json"];
export type GetEvaluationResponse = operations["getEvaluation"]["responses"]["200"]["content"]["application/json"];
export type AttachInterpretabilityPackResponse = operations["attachInterpretabilityPack"]["responses"]["201"]["content"]["application/json"];


