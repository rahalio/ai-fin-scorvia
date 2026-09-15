import { makeApi, Zodios, type ZodiosOptions } from '@zodios/core';
import { z } from 'zod';

const resolveReferral_Body = z
  .object({ decision: z.enum(['grant', 'deny']), reasonCode: z.string() })
  .passthrough();
const ReferralStatus = z.enum(['open', 'resolved']);
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
const ReferralId = z.string();
const TenantId = z.string();
const Referral = z
  .object({
    id: z.string().regex(/^ref_[0-9A-HJKMNP-TV-Z]{26}$/),
    tenantId: z.string().regex(/^tnt_[0-9A-HJKMNP-TV-Z]{26}$/),
    applicationId: z.string(),
    status: z.enum(['open', 'resolved']),
    pd: z.number().optional(),
    expectedLossImpact: z.number().optional(),
    scoreResultId: z.string().optional(),
    explanation: z.string().optional(),
    resolvedDecision: z.enum(['grant', 'deny']).optional(),
    reasonCode: z.string().optional(),
    resolvedBy: z.string().optional(),
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
const ReferralListResponse = z
  .object({
    data: z
      .object({
        items: z.array(
          z
            .object({
              id: z.string().regex(/^ref_[0-9A-HJKMNP-TV-Z]{26}$/),
              tenantId: z.string().regex(/^tnt_[0-9A-HJKMNP-TV-Z]{26}$/),
              applicationId: z.string(),
              status: z.enum(['open', 'resolved']),
              pd: z.number().optional(),
              expectedLossImpact: z.number().optional(),
              scoreResultId: z.string().optional(),
              explanation: z.string().optional(),
              resolvedDecision: z.enum(['grant', 'deny']).optional(),
              reasonCode: z.string().optional(),
              resolvedBy: z.string().optional(),
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
const ReferralResponse = z
  .object({
    data: z
      .object({
        id: z.string().regex(/^ref_[0-9A-HJKMNP-TV-Z]{26}$/),
        tenantId: z.string().regex(/^tnt_[0-9A-HJKMNP-TV-Z]{26}$/),
        applicationId: z.string(),
        status: z.enum(['open', 'resolved']),
        pd: z.number().optional(),
        expectedLossImpact: z.number().optional(),
        scoreResultId: z.string().optional(),
        explanation: z.string().optional(),
        resolvedDecision: z.enum(['grant', 'deny']).optional(),
        reasonCode: z.string().optional(),
        resolvedBy: z.string().optional(),
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
const ReferralResolve = z
  .object({ decision: z.enum(['grant', 'deny']), reasonCode: z.string() })
  .passthrough();

export const schemas: any = {
  resolveReferral_Body,
  ReferralStatus,
  Problem,
  ReferralId,
  TenantId,
  Referral,
  ResponseMeta,
  ReferralListResponse,
  ReferralResponse,
  ReferralResolve,
};

const endpoints = makeApi([
  {
    method: 'get',
    path: '/v1/referrals',
    alias: 'listReferrals',
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
      {
        name: 'status',
        type: 'Query',
        schema: z.enum(['open', 'resolved']).optional(),
      },
    ],
    response: z
      .object({
        data: z
          .object({
            items: z.array(
              z
                .object({
                  id: z.string().regex(/^ref_[0-9A-HJKMNP-TV-Z]{26}$/),
                  tenantId: z.string().regex(/^tnt_[0-9A-HJKMNP-TV-Z]{26}$/),
                  applicationId: z.string(),
                  status: z.enum(['open', 'resolved']),
                  pd: z.number().optional(),
                  expectedLossImpact: z.number().optional(),
                  scoreResultId: z.string().optional(),
                  explanation: z.string().optional(),
                  resolvedDecision: z.enum(['grant', 'deny']).optional(),
                  reasonCode: z.string().optional(),
                  resolvedBy: z.string().optional(),
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
    path: '/v1/referrals/:referralId',
    alias: 'getReferral',
    requestFormat: 'json',
    parameters: [
      {
        name: 'referralId',
        type: 'Path',
        schema: z.string().regex(/^ref_[0-9A-HJKMNP-TV-Z]{26}$/),
      },
    ],
    response: z
      .object({
        data: z
          .object({
            id: z.string().regex(/^ref_[0-9A-HJKMNP-TV-Z]{26}$/),
            tenantId: z.string().regex(/^tnt_[0-9A-HJKMNP-TV-Z]{26}$/),
            applicationId: z.string(),
            status: z.enum(['open', 'resolved']),
            pd: z.number().optional(),
            expectedLossImpact: z.number().optional(),
            scoreResultId: z.string().optional(),
            explanation: z.string().optional(),
            resolvedDecision: z.enum(['grant', 'deny']).optional(),
            reasonCode: z.string().optional(),
            resolvedBy: z.string().optional(),
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
    path: '/v1/referrals/:referralId/resolve',
    alias: 'resolveReferral',
    requestFormat: 'json',
    parameters: [
      {
        name: 'body',
        type: 'Body',
        schema: resolveReferral_Body,
      },
      {
        name: 'referralId',
        type: 'Path',
        schema: z.string().regex(/^ref_[0-9A-HJKMNP-TV-Z]{26}$/),
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
            id: z.string().regex(/^ref_[0-9A-HJKMNP-TV-Z]{26}$/),
            tenantId: z.string().regex(/^tnt_[0-9A-HJKMNP-TV-Z]{26}$/),
            applicationId: z.string(),
            status: z.enum(['open', 'resolved']),
            pd: z.number().optional(),
            expectedLossImpact: z.number().optional(),
            scoreResultId: z.string().optional(),
            explanation: z.string().optional(),
            resolvedDecision: z.enum(['grant', 'deny']).optional(),
            reasonCode: z.string().optional(),
            resolvedBy: z.string().optional(),
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
