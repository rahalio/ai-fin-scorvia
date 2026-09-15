import { makeApi, Zodios, type ZodiosOptions } from '@zodios/core';
import { z } from 'zod';

const openMonitoringIncident_Body = z
  .object({
    deploymentId: z.string(),
    incidentType: z.enum(['drift', 'performance', 'overrideSpike']),
    detail: z.string().optional(),
  })
  .passthrough();
const disposeMonitoringIncident_Body = z
  .object({
    status: z.enum(['open', 'investigating', 'closed']),
    disposition: z.string().optional(),
  })
  .passthrough();
const Problem = z
  .object({
    type: z.string().url(),
    title: z.string(),
    status: z.number().int(),
    detail: z.string(),
    instance: z.string().url(),
    code: z.string(),
  })
  .partial()
  .passthrough();
const MonitoringIncidentId = z.string();
const TenantId = z.string();
const IncidentStatus = z.enum(['open', 'investigating', 'closed']);
const IncidentType = z.enum(['drift', 'performance', 'overrideSpike']);
const MonitoringIncident = z
  .object({
    id: z.string().regex(/^mon_[0-9A-HJKMNP-TV-Z]{26}$/),
    tenantId: z.string().regex(/^tnt_[0-9A-HJKMNP-TV-Z]{26}$/),
    deploymentId: z.string(),
    status: z.enum(['open', 'investigating', 'closed']),
    incidentType: z.enum(['drift', 'performance', 'overrideSpike']),
    detail: z.string().optional(),
    disposition: z.string().optional(),
    createdAt: z.string().datetime({ offset: true }),
    updatedAt: z.string().datetime({ offset: true }),
  })
  .passthrough();
const ResponseMeta = z
  .object({
    requestId: z.string().uuid(),
    correlationId: z.string(),
    generatedAt: z.string().datetime({ offset: true }),
  })
  .partial()
  .passthrough();
const MonitoringIncidentListResponse = z
  .object({
    data: z
      .object({
        items: z.array(
          z
            .object({
              id: z.string().regex(/^mon_[0-9A-HJKMNP-TV-Z]{26}$/),
              tenantId: z.string().regex(/^tnt_[0-9A-HJKMNP-TV-Z]{26}$/),
              deploymentId: z.string(),
              status: z.enum(['open', 'investigating', 'closed']),
              incidentType: z.enum(['drift', 'performance', 'overrideSpike']),
              detail: z.string().optional(),
              disposition: z.string().optional(),
              createdAt: z.string().datetime({ offset: true }),
              updatedAt: z.string().datetime({ offset: true }),
            })
            .passthrough()
        ),
        nextCursor: z.string().optional(),
      })
      .passthrough(),
    meta: z
      .object({
        requestId: z.string().uuid(),
        correlationId: z.string(),
        generatedAt: z.string().datetime({ offset: true }),
      })
      .partial()
      .passthrough()
      .optional(),
  })
  .passthrough();
const MonitoringIncidentCreate = z
  .object({
    deploymentId: z.string(),
    incidentType: z.enum(['drift', 'performance', 'overrideSpike']),
    detail: z.string().optional(),
  })
  .passthrough();
const MonitoringIncidentResponse = z
  .object({
    data: z
      .object({
        id: z.string().regex(/^mon_[0-9A-HJKMNP-TV-Z]{26}$/),
        tenantId: z.string().regex(/^tnt_[0-9A-HJKMNP-TV-Z]{26}$/),
        deploymentId: z.string(),
        status: z.enum(['open', 'investigating', 'closed']),
        incidentType: z.enum(['drift', 'performance', 'overrideSpike']),
        detail: z.string().optional(),
        disposition: z.string().optional(),
        createdAt: z.string().datetime({ offset: true }),
        updatedAt: z.string().datetime({ offset: true }),
      })
      .passthrough(),
    meta: z
      .object({
        requestId: z.string().uuid(),
        correlationId: z.string(),
        generatedAt: z.string().datetime({ offset: true }),
      })
      .partial()
      .passthrough()
      .optional(),
  })
  .passthrough();
const MonitoringIncidentDisposition = z
  .object({
    status: z.enum(['open', 'investigating', 'closed']),
    disposition: z.string().optional(),
  })
  .passthrough();

export const schemas: any = {
  openMonitoringIncident_Body,
  disposeMonitoringIncident_Body,
  Problem,
  MonitoringIncidentId,
  TenantId,
  IncidentStatus,
  IncidentType,
  MonitoringIncident,
  ResponseMeta,
  MonitoringIncidentListResponse,
  MonitoringIncidentCreate,
  MonitoringIncidentResponse,
  MonitoringIncidentDisposition,
};

const endpoints = makeApi([
  {
    method: 'get',
    path: '/v1/monitoring/incidents',
    alias: 'listMonitoringIncidents',
    requestFormat: 'json',
    parameters: [
      {
        name: 'cursor',
        type: 'Query',
        schema: z.string().optional(),
      },
      {
        name: 'limit',
        type: 'Query',
        schema: z.number().int().gte(1).lte(200).optional().default(50),
      },
    ],
    response: z
      .object({
        data: z
          .object({
            items: z.array(
              z
                .object({
                  id: z.string().regex(/^mon_[0-9A-HJKMNP-TV-Z]{26}$/),
                  tenantId: z.string().regex(/^tnt_[0-9A-HJKMNP-TV-Z]{26}$/),
                  deploymentId: z.string(),
                  status: z.enum(['open', 'investigating', 'closed']),
                  incidentType: z.enum([
                    'drift',
                    'performance',
                    'overrideSpike',
                  ]),
                  detail: z.string().optional(),
                  disposition: z.string().optional(),
                  createdAt: z.string().datetime({ offset: true }),
                  updatedAt: z.string().datetime({ offset: true }),
                })
                .passthrough()
            ),
            nextCursor: z.string().optional(),
          })
          .passthrough(),
        meta: z
          .object({
            requestId: z.string().uuid(),
            correlationId: z.string(),
            generatedAt: z.string().datetime({ offset: true }),
          })
          .partial()
          .passthrough()
          .optional(),
      })
      .passthrough(),
    errors: [
      {
        status: 401,
        description: `Missing or invalid API key`,
        schema: z
          .object({
            type: z.string().url(),
            title: z.string(),
            status: z.number().int(),
            detail: z.string(),
            instance: z.string().url(),
            code: z.string(),
          })
          .partial()
          .passthrough(),
      },
    ],
  },
  {
    method: 'post',
    path: '/v1/monitoring/incidents',
    alias: 'openMonitoringIncident',
    requestFormat: 'json',
    parameters: [
      {
        name: 'body',
        type: 'Body',
        schema: openMonitoringIncident_Body,
      },
      {
        name: 'Idempotency-Key',
        type: 'Header',
        schema: z.string().min(1).max(128),
      },
    ],
    response: z
      .object({
        data: z
          .object({
            id: z.string().regex(/^mon_[0-9A-HJKMNP-TV-Z]{26}$/),
            tenantId: z.string().regex(/^tnt_[0-9A-HJKMNP-TV-Z]{26}$/),
            deploymentId: z.string(),
            status: z.enum(['open', 'investigating', 'closed']),
            incidentType: z.enum(['drift', 'performance', 'overrideSpike']),
            detail: z.string().optional(),
            disposition: z.string().optional(),
            createdAt: z.string().datetime({ offset: true }),
            updatedAt: z.string().datetime({ offset: true }),
          })
          .passthrough(),
        meta: z
          .object({
            requestId: z.string().uuid(),
            correlationId: z.string(),
            generatedAt: z.string().datetime({ offset: true }),
          })
          .partial()
          .passthrough()
          .optional(),
      })
      .passthrough(),
    errors: [
      {
        status: 401,
        description: `Missing or invalid API key`,
        schema: z
          .object({
            type: z.string().url(),
            title: z.string(),
            status: z.number().int(),
            detail: z.string(),
            instance: z.string().url(),
            code: z.string(),
          })
          .partial()
          .passthrough(),
      },
      {
        status: 422,
        description: `Semantically invalid request (e.g. PACK_EMPTY)`,
        schema: z
          .object({
            type: z.string().url(),
            title: z.string(),
            status: z.number().int(),
            detail: z.string(),
            instance: z.string().url(),
            code: z.string(),
          })
          .partial()
          .passthrough(),
      },
    ],
  },
  {
    method: 'post',
    path: '/v1/monitoring/incidents/:incidentId/dispose',
    alias: 'disposeMonitoringIncident',
    requestFormat: 'json',
    parameters: [
      {
        name: 'body',
        type: 'Body',
        schema: disposeMonitoringIncident_Body,
      },
      {
        name: 'incidentId',
        type: 'Path',
        schema: z.string().regex(/^mon_[0-9A-HJKMNP-TV-Z]{26}$/),
      },
      {
        name: 'Idempotency-Key',
        type: 'Header',
        schema: z.string().min(1).max(128),
      },
    ],
    response: z
      .object({
        data: z
          .object({
            id: z.string().regex(/^mon_[0-9A-HJKMNP-TV-Z]{26}$/),
            tenantId: z.string().regex(/^tnt_[0-9A-HJKMNP-TV-Z]{26}$/),
            deploymentId: z.string(),
            status: z.enum(['open', 'investigating', 'closed']),
            incidentType: z.enum(['drift', 'performance', 'overrideSpike']),
            detail: z.string().optional(),
            disposition: z.string().optional(),
            createdAt: z.string().datetime({ offset: true }),
            updatedAt: z.string().datetime({ offset: true }),
          })
          .passthrough(),
        meta: z
          .object({
            requestId: z.string().uuid(),
            correlationId: z.string(),
            generatedAt: z.string().datetime({ offset: true }),
          })
          .partial()
          .passthrough()
          .optional(),
      })
      .passthrough(),
    errors: [
      {
        status: 404,
        description: `Resource not found`,
        schema: z
          .object({
            type: z.string().url(),
            title: z.string(),
            status: z.number().int(),
            detail: z.string(),
            instance: z.string().url(),
            code: z.string(),
          })
          .partial()
          .passthrough(),
      },
    ],
  },
]);

export const api: any = new Zodios(
  'https://api.ddd-codegen-starter.local/v1',
  endpoints
);

export function createApiClient(baseUrl: string, options?: ZodiosOptions): any {
  return new Zodios(baseUrl, endpoints, options);
}
