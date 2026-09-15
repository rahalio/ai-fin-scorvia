import { makeApi, Zodios, type ZodiosOptions } from '@zodios/core';
import { z } from 'zod';

const requestPromotion_Body = z
  .object({
    interpretabilityUri: z.string().url(),
    notes: z.string().optional(),
    monitoringPlanUri: z.string().url().optional(),
  })
  .passthrough();
const decidePromotion_Body = z
  .object({
    decision: z.enum(['approve', 'reject', 'waive']),
    rationale: z.string().optional(),
  })
  .passthrough();
const PromotionRequest = z
  .object({
    interpretabilityUri: z.string().url(),
    notes: z.string().optional(),
    monitoringPlanUri: z.string().url().optional(),
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
const PromotionGateId = z.string();
const TenantId = z.string();
const PromotionStatus = z.enum([
  'pending',
  'approved',
  'rejected',
  'waiverRequested',
]);
const PromotionGate = z
  .object({
    id: z.string().regex(/^prm_[0-9A-HJKMNP-TV-Z]{26}$/),
    tenantId: z.string().regex(/^tnt_[0-9A-HJKMNP-TV-Z]{26}$/),
    candidateId: z.string(),
    status: z.enum(['pending', 'approved', 'rejected', 'waiverRequested']),
    interpretabilityAttached: z.boolean().optional(),
    dataSufficiencyPassed: z.boolean().optional(),
    imbalanceGatePassed: z.boolean().optional(),
    regimeGatePassed: z.boolean().optional(),
    monitoringPlanAttached: z.boolean().optional(),
    biasGatePassed: z.boolean().optional(),
    gates: z.object({}).partial().passthrough().optional(),
    interpretabilityUri: z.string().url().optional(),
    notes: z.string().optional(),
    decidedBy: z.string().optional(),
    rationale: z.string().optional(),
    waiverGranted: z.boolean().optional(),
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
const PromotionGateResponse = z
  .object({
    data: z
      .object({
        id: z.string().regex(/^prm_[0-9A-HJKMNP-TV-Z]{26}$/),
        tenantId: z.string().regex(/^tnt_[0-9A-HJKMNP-TV-Z]{26}$/),
        candidateId: z.string(),
        status: z.enum(['pending', 'approved', 'rejected', 'waiverRequested']),
        interpretabilityAttached: z.boolean().optional(),
        dataSufficiencyPassed: z.boolean().optional(),
        imbalanceGatePassed: z.boolean().optional(),
        regimeGatePassed: z.boolean().optional(),
        monitoringPlanAttached: z.boolean().optional(),
        biasGatePassed: z.boolean().optional(),
        gates: z.object({}).partial().passthrough().optional(),
        interpretabilityUri: z.string().url().optional(),
        notes: z.string().optional(),
        decidedBy: z.string().optional(),
        rationale: z.string().optional(),
        waiverGranted: z.boolean().optional(),
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
const PromotionGateListResponse = z
  .object({
    data: z
      .object({
        items: z.array(
          z
            .object({
              id: z.string().regex(/^prm_[0-9A-HJKMNP-TV-Z]{26}$/),
              tenantId: z.string().regex(/^tnt_[0-9A-HJKMNP-TV-Z]{26}$/),
              candidateId: z.string(),
              status: z.enum([
                'pending',
                'approved',
                'rejected',
                'waiverRequested',
              ]),
              interpretabilityAttached: z.boolean().optional(),
              dataSufficiencyPassed: z.boolean().optional(),
              imbalanceGatePassed: z.boolean().optional(),
              regimeGatePassed: z.boolean().optional(),
              monitoringPlanAttached: z.boolean().optional(),
              biasGatePassed: z.boolean().optional(),
              gates: z.object({}).partial().passthrough().optional(),
              interpretabilityUri: z.string().url().optional(),
              notes: z.string().optional(),
              decidedBy: z.string().optional(),
              rationale: z.string().optional(),
              waiverGranted: z.boolean().optional(),
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
const PromotionDecisionKind = z.enum(['approve', 'reject', 'waive']);
const PromotionDecision = z
  .object({
    decision: z.enum(['approve', 'reject', 'waive']),
    rationale: z.string().optional(),
  })
  .passthrough();

export const schemas: any = {
  requestPromotion_Body,
  decidePromotion_Body,
  PromotionRequest,
  Problem,
  PromotionGateId,
  TenantId,
  PromotionStatus,
  PromotionGate,
  ResponseMeta,
  PromotionGateResponse,
  PromotionGateListResponse,
  PromotionDecisionKind,
  PromotionDecision,
};

const endpoints = makeApi([
  {
    method: 'post',
    path: '/v1/candidates/:candidateId/promotions',
    alias: 'requestPromotion',
    requestFormat: 'json',
    parameters: [
      {
        name: 'body',
        type: 'Body',
        schema: requestPromotion_Body,
      },
      {
        name: 'candidateId',
        type: 'Path',
        schema: z.string(),
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
            id: z.string().regex(/^prm_[0-9A-HJKMNP-TV-Z]{26}$/),
            tenantId: z.string().regex(/^tnt_[0-9A-HJKMNP-TV-Z]{26}$/),
            candidateId: z.string(),
            status: z.enum([
              'pending',
              'approved',
              'rejected',
              'waiverRequested',
            ]),
            interpretabilityAttached: z.boolean().optional(),
            dataSufficiencyPassed: z.boolean().optional(),
            imbalanceGatePassed: z.boolean().optional(),
            regimeGatePassed: z.boolean().optional(),
            monitoringPlanAttached: z.boolean().optional(),
            biasGatePassed: z.boolean().optional(),
            gates: z.object({}).partial().passthrough().optional(),
            interpretabilityUri: z.string().url().optional(),
            notes: z.string().optional(),
            decidedBy: z.string().optional(),
            rationale: z.string().optional(),
            waiverGranted: z.boolean().optional(),
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
    method: 'get',
    path: '/v1/promotions',
    alias: 'listPromotions',
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
                  id: z.string().regex(/^prm_[0-9A-HJKMNP-TV-Z]{26}$/),
                  tenantId: z.string().regex(/^tnt_[0-9A-HJKMNP-TV-Z]{26}$/),
                  candidateId: z.string(),
                  status: z.enum([
                    'pending',
                    'approved',
                    'rejected',
                    'waiverRequested',
                  ]),
                  interpretabilityAttached: z.boolean().optional(),
                  dataSufficiencyPassed: z.boolean().optional(),
                  imbalanceGatePassed: z.boolean().optional(),
                  regimeGatePassed: z.boolean().optional(),
                  monitoringPlanAttached: z.boolean().optional(),
                  biasGatePassed: z.boolean().optional(),
                  gates: z.object({}).partial().passthrough().optional(),
                  interpretabilityUri: z.string().url().optional(),
                  notes: z.string().optional(),
                  decidedBy: z.string().optional(),
                  rationale: z.string().optional(),
                  waiverGranted: z.boolean().optional(),
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
    method: 'get',
    path: '/v1/promotions/:promotionId',
    alias: 'getPromotion',
    requestFormat: 'json',
    parameters: [
      {
        name: 'promotionId',
        type: 'Path',
        schema: z.string().regex(/^prm_[0-9A-HJKMNP-TV-Z]{26}$/),
      },
    ],
    response: z
      .object({
        data: z
          .object({
            id: z.string().regex(/^prm_[0-9A-HJKMNP-TV-Z]{26}$/),
            tenantId: z.string().regex(/^tnt_[0-9A-HJKMNP-TV-Z]{26}$/),
            candidateId: z.string(),
            status: z.enum([
              'pending',
              'approved',
              'rejected',
              'waiverRequested',
            ]),
            interpretabilityAttached: z.boolean().optional(),
            dataSufficiencyPassed: z.boolean().optional(),
            imbalanceGatePassed: z.boolean().optional(),
            regimeGatePassed: z.boolean().optional(),
            monitoringPlanAttached: z.boolean().optional(),
            biasGatePassed: z.boolean().optional(),
            gates: z.object({}).partial().passthrough().optional(),
            interpretabilityUri: z.string().url().optional(),
            notes: z.string().optional(),
            decidedBy: z.string().optional(),
            rationale: z.string().optional(),
            waiverGranted: z.boolean().optional(),
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
  {
    method: 'post',
    path: '/v1/promotions/:promotionId/decide',
    alias: 'decidePromotion',
    requestFormat: 'json',
    parameters: [
      {
        name: 'body',
        type: 'Body',
        schema: decidePromotion_Body,
      },
      {
        name: 'promotionId',
        type: 'Path',
        schema: z.string().regex(/^prm_[0-9A-HJKMNP-TV-Z]{26}$/),
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
            id: z.string().regex(/^prm_[0-9A-HJKMNP-TV-Z]{26}$/),
            tenantId: z.string().regex(/^tnt_[0-9A-HJKMNP-TV-Z]{26}$/),
            candidateId: z.string(),
            status: z.enum([
              'pending',
              'approved',
              'rejected',
              'waiverRequested',
            ]),
            interpretabilityAttached: z.boolean().optional(),
            dataSufficiencyPassed: z.boolean().optional(),
            imbalanceGatePassed: z.boolean().optional(),
            regimeGatePassed: z.boolean().optional(),
            monitoringPlanAttached: z.boolean().optional(),
            biasGatePassed: z.boolean().optional(),
            gates: z.object({}).partial().passthrough().optional(),
            interpretabilityUri: z.string().url().optional(),
            notes: z.string().optional(),
            decidedBy: z.string().optional(),
            rationale: z.string().optional(),
            waiverGranted: z.boolean().optional(),
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
]);

export const api: any = new Zodios(
  'https://api.ddd-codegen-starter.local/v1',
  endpoints
);

export function createApiClient(baseUrl: string, options?: ZodiosOptions): any {
  return new Zodios(baseUrl, endpoints, options);
}
