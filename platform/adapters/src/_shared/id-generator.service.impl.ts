/**
 * ID Generator Service Implementation — Scorvia prefixes.
 */

import type { DomainCode } from '@scorvia/core/_shared/helpers';
import { DOMAIN_PREFIX_MAP, isValidDomainId } from '@scorvia/core';
import { ulid } from 'ulid';
import type { IdGeneratorService } from '@scorvia/services/_shared';

export function generateIdWithPrefix(prefix: string): string {
  if (!prefix || prefix.length !== 3 || !/^[a-z]{3}$/.test(prefix)) {
    throw new Error(
      `Invalid domain prefix: "${prefix}". Must be exactly 3 lowercase letters.`
    );
  }
  const id = `${prefix}_${ulid().toLowerCase()}`;
  if (!isValidDomainId(id)) {
    throw new Error(`Generated ID "${id}" failed validation.`);
  }
  return id;
}

export class DefaultIdGeneratorService implements IdGeneratorService {
  tntId(): string {
    return generateIdWithPrefix(DOMAIN_PREFIX_MAP.tenant);
  }
  keyId(): string {
    return generateIdWithPrefix(DOMAIN_PREFIX_MAP.apiKey);
  }
  idnId(): string {
    return generateIdWithPrefix(DOMAIN_PREFIX_MAP.identity);
  }
  autId(): string {
    return generateIdWithPrefix(DOMAIN_PREFIX_MAP.auth);
  }
  prjId(): string {
    return generateIdWithPrefix(DOMAIN_PREFIX_MAP.creditProject);
  }
  dstId(): string {
    return generateIdWithPrefix(DOMAIN_PREFIX_MAP.dataset);
  }
  amlId(): string {
    return generateIdWithPrefix(DOMAIN_PREFIX_MAP.automlRun);
  }
  cndId(): string {
    return generateIdWithPrefix(DOMAIN_PREFIX_MAP.candidateModel);
  }
  evlId(): string {
    return generateIdWithPrefix(DOMAIN_PREFIX_MAP.evaluationReport);
  }
  inpId(): string {
    return generateIdWithPrefix(DOMAIN_PREFIX_MAP.interpretabilityPack);
  }
  prmId(): string {
    return generateIdWithPrefix(DOMAIN_PREFIX_MAP.promotionGate);
  }
  polId(): string {
    return generateIdWithPrefix(DOMAIN_PREFIX_MAP.policyMap);
  }
  scrId(): string {
    return generateIdWithPrefix(DOMAIN_PREFIX_MAP.scoreResult);
  }
  depId(): string {
    return generateIdWithPrefix(DOMAIN_PREFIX_MAP.productionDeployment);
  }
  refId(): string {
    return generateIdWithPrefix(DOMAIN_PREFIX_MAP.referral);
  }
  monId(): string {
    return generateIdWithPrefix(DOMAIN_PREFIX_MAP.monitoringIncident);
  }
  audId(): string {
    return generateIdWithPrefix(DOMAIN_PREFIX_MAP.auditExport);
  }
  generateIdForDomain(domainCode: DomainCode): string {
    return generateIdWithPrefix(DOMAIN_PREFIX_MAP[domainCode]);
  }
}

let idGeneratorService: DefaultIdGeneratorService | null = null;

export function getIdGeneratorService(): DefaultIdGeneratorService {
  if (!idGeneratorService) {
    idGeneratorService = new DefaultIdGeneratorService();
  }
  return idGeneratorService;
}
