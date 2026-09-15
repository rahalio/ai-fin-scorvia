import { makeApi, Zodios, type ZodiosOptions } from '@zodios/core';
import { z } from 'zod';

const scoreApplication_Body = z
  .object({
    applicationId: z.string(),
    deploymentId: z
      .string()
      .regex(/^dep_[0-9A-HJKMNP-TV-Z]{26}$/)
      .optional(),
    features: z.object({}).partial().passthrough(),
  })
  .passthrough();
const ProductionDeploymentId = z.string();
const ScoreRequest = z
  .object({
    applicationId: z.string(),
    deploymentId: z
      .string()
      .regex(/^dep_[0-9A-HJKMNP-TV-Z]{26}$/)
      .optional(),
    features: z.object({}).partial().passthrough(),
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
const ScoreResultId = z.string();
const TenantId = z.string();
const ScoreDecision = z.enum(['grant', 'refer', 'deny']);
const EnvironmentLabel = z.enum(['poc', 'production']);
const ScoreResult = z
  .object({
    id: z.string().regex(/^scr_[0-9A-HJKMNP-TV-Z]{26}$/),
    tenantId: z.string().regex(/^tnt_[0-9A-HJKMNP-TV-Z]{26}$/),
    applicationId: z.string(),
    pd: z.number(),
    decision: z.enum(['grant', 'refer', 'deny']),
    explanation: z.string().optional(),
    modelId: z.string().optional(),
    deploymentId: z
      .string()
      .regex(/^dep_[0-9A-HJKMNP-TV-Z]{26}$/)
      .optional(),
    environment: z.enum(['poc', 'production']).optional(),
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
const ScoreResultResponse = z
  .object({
    data: z
      .object({
        id: z.string().regex(/^scr_[0-9A-HJKMNP-TV-Z]{26}$/),
        tenantId: z.string().regex(/^tnt_[0-9A-HJKMNP-TV-Z]{26}$/),
        applicationId: z.string(),
        pd: z.number(),
        decision: z.enum(['grant', 'refer', 'deny']),
        explanation: z.string().optional(),
        modelId: z.string().optional(),
        deploymentId: z
          .string()
          .regex(/^dep_[0-9A-HJKMNP-TV-Z]{26}$/)
          .optional(),
        environment: z.enum(['poc', 'production']).optional(),
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
const ProductionDeployment = z
  .object({
    id: z.string().regex(/^dep_[0-9A-HJKMNP-TV-Z]{26}$/),
    tenantId: z.string().regex(/^tnt_[0-9A-HJKMNP-TV-Z]{26}$/),
    modelId: z.string(),
    candidateId: z.string().optional(),
    environment: z.enum(['poc', 'production']),
    endpointLabel: z.string().optional(),
    active: z.boolean(),
    policyMapId: z.string().optional(),
    createdAt: z.string().datetime({ offset: true }),
    updatedAt: z.string().datetime({ offset: true }),
  })
  .passthrough();
const ProductionDeploymentListResponse = z
  .object({
    data: z
      .object({
        items: z.array(
          z
            .object({
              id: z.string().regex(/^dep_[0-9A-HJKMNP-TV-Z]{26}$/),
              tenantId: z.string().regex(/^tnt_[0-9A-HJKMNP-TV-Z]{26}$/),
              modelId: z.string(),
              candidateId: z.string().optional(),
              environment: z.enum(['poc', 'production']),
              endpointLabel: z.string().optional(),
              active: z.boolean(),
              policyMapId: z.string().optional(),
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

export const schemas: any = {
  scoreApplication_Body,
  ProductionDeploymentId,
  ScoreRequest,
  Problem,
  ScoreResultId,
  TenantId,
  ScoreDecision,
  EnvironmentLabel,
  ScoreResult,
  ResponseMeta,
  ScoreResultResponse,
  ProductionDeployment,
  ProductionDeploymentListResponse,
};

const endpoints = makeApi([
  {
    method: 'get',
    path: '/v1/scoring/deployments',
    alias: 'listDeployments',
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
                  id: z.string().regex(/^dep_[0-9A-HJKMNP-TV-Z]{26}$/),
                  tenantId: z.string().regex(/^tnt_[0-9A-HJKMNP-TV-Z]{26}$/),
                  modelId: z.string(),
                  candidateId: z.string().optional(),
                  environment: z.enum(['poc', 'production']),
                  endpointLabel: z.string().optional(),
                  active: z.boolean(),
                  policyMapId: z.string().optional(),
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
    path: '/v1/scoring/score',
    alias: 'scoreApplication',
    requestFormat: 'json',
    parameters: [
      {
        name: 'body',
        type: 'Body',
        schema: scoreApplication_Body,
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
            id: z.string().regex(/^scr_[0-9A-HJKMNP-TV-Z]{26}$/),
            tenantId: z.string().regex(/^tnt_[0-9A-HJKMNP-TV-Z]{26}$/),
            applicationId: z.string(),
            pd: z.number(),
            decision: z.enum(['grant', 'refer', 'deny']),
            explanation: z.string().optional(),
            modelId: z.string().optional(),
            deploymentId: z
              .string()
              .regex(/^dep_[0-9A-HJKMNP-TV-Z]{26}$/)
              .optional(),
            environment: z.enum(['poc', 'production']).optional(),
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
