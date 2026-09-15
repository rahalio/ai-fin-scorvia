/**
 * IdGeneratorService Port — Scorvia prefixes.
 */

import type { DomainCode } from '@scorvia/core/_shared/helpers';

export interface IdGeneratorService {
  tntId(): string;
  keyId(): string;
  idnId(): string;
  autId(): string;
  prjId(): string;
  dstId(): string;
  amlId(): string;
  cndId(): string;
  evlId(): string;
  inpId(): string;
  prmId(): string;
  polId(): string;
  scrId(): string;
  depId(): string;
  refId(): string;
  monId(): string;
  audId(): string;
  generateIdForDomain(domainCode: DomainCode): string;
}
