# Scorvia — User stories

**Product:** [PRODUCT.md](./PRODUCT.md)


### Credit data scientist

- As a data scientist, I want AutoML to search pipelines on a governed feature set, so that I spend time on problem framing rather than brute-force scripting.
- As a data scientist, I want failed gates explained with remediation hints, so that I can fix imbalance or interpretability gaps quickly.
- As a data scientist, I want to compare parametric and tree/ensemble challengers on the same evaluation suite, so that I do not overfit to one fashion.

### Model validator

- As a validator, I want a complete interpretability and lineage pack before I start review, so that I am not reverse-engineering notebooks.
- As a validator, I want to reject promotions that only cite accuracy, so that policy matches the organisation’s risk appetite.
- As a validator, I want regime-test results stored immutably, so that later performance disputes have a baseline.

### Credit policy analyst

- As a policy analyst, I want PD bands mapped to grant/refer/deny actions, so that policy—not the model alone—owns the decision.
- As a policy analyst, I want override reasons captured when RMs deviate, so that we can detect model or policy failure.

### Lending operations

- As a lending ops lead, I want referral queues prioritised by expected loss impact, so that human capacity focuses where it matters.
- As a lending ops lead, I want clear separation of PoC scores from production scores in downstream systems, so that we never underwrite on sandbox output.

### Model risk / audit

- As a model-risk officer, I want production monitoring breaches to open cases automatically, so that drift cannot linger unnoticed.
- As an auditor, I want a period export of promotions, waivers, and monitoring incidents, so that examinations are evidence-based.
