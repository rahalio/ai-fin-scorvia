/**
 * Monitoring Domain Types
 *
 * Auto-generated from OpenAPI spec
 * Generator: types-generator v2.0.0
 *
 * This file re-exports types from generated OpenAPI types and adds
 * convenient type aliases for handlers (response types, etc.)
 *
 * ⚠️ DO NOT EDIT MANUALLY - this file is auto-generated
 */

import type { components, operations } from "../openapi/monitoring.openapi.types";

// ============================================================================
// Re-export all generated types
// ============================================================================
// Note: components and operations are exported here but should be accessed via namespace
// in main index.ts to avoid duplicate export errors (e.g., blockchain.types.components)

export type { components, operations };


// ============================================================================
// Convenient Type Aliases for Schemas
// ============================================================================

export type IncidentStatus = components["schemas"]["IncidentStatus"];
export type IncidentType = components["schemas"]["IncidentType"];
export type MonitoringIncident = components["schemas"]["MonitoringIncident"];
export type MonitoringIncidentCreate = components["schemas"]["MonitoringIncidentCreate"];
export type MonitoringIncidentDisposition = components["schemas"]["MonitoringIncidentDisposition"];
export type MonitoringIncidentId = components["schemas"]["MonitoringIncidentId"];
export type Incident = operations["listMonitoringIncidents"]["responses"]["200"]["content"]["application/json"]["data"];


// ============================================================================
// Operation Input Types (Request Bodies)
// ============================================================================

// These types represent the input data for create/update operations

export type OpenMonitoringIncidentRequestInput = NonNullable<operations["openMonitoringIncident"]["requestBody"]>["content"]["application/json"];
export type DisposeMonitoringIncidentRequestInput = NonNullable<operations["disposeMonitoringIncident"]["requestBody"]>["content"]["application/json"];


// ============================================================================
// Operation Parameter Types (Query/Path Parameters)
// ============================================================================

// These types represent parameters for operations without request bodies.
// Aligned with get_input_schema_or_type_name for consistent naming across generators.

export type ListMonitoringIncidentsParams = NonNullable<operations["listMonitoringIncidents"]["parameters"]["query"]>;
export type DisposeMonitoringIncidentParams = operations["disposeMonitoringIncident"]["parameters"]["path"];


// ============================================================================
// Operation Response Types
// ============================================================================

// These types are used by handlers for type-safe response envelopes

export type ListMonitoringIncidentsResponse = operations["listMonitoringIncidents"]["responses"]["200"]["content"]["application/json"];
export type OpenMonitoringIncidentResponse = operations["openMonitoringIncident"]["responses"]["201"]["content"]["application/json"];
export type DisposeMonitoringIncidentResponse = operations["disposeMonitoringIncident"]["responses"]["200"]["content"]["application/json"];


