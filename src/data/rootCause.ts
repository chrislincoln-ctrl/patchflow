import type { RootCause } from '../types';
import { AFFECTED_FILES, CANONICAL_INCIDENT, CANONICAL_SCENARIO } from './canonical';

export const rootCause: RootCause = {
  summary:
    'Checkout pipeline aggregates tax before applying the coupon discount, inverting the order required by API specification §4.3.1.',
  confidence: 'high',
  explanation: `In checkout.ts, calculateFinalTotal() calls aggregateTaxByJurisdiction() with the raw, undiscounted line items. The coupon discount is only computed afterwards, so tax is calculated on the full subtotal. API specification §4.3.1 requires the reverse: apply the discount to the subtotal first, then compute each jurisdiction's tax on the discounted base. The result is a systematic overcharge of ${CANONICAL_SCENARIO.discrepancyLabel} on the canonical scenario — matching the production-log pattern exactly.`,
  affectedFiles: AFFECTED_FILES.map(f => ({
    path: f.path,
    role: f.role,
    linesAffected: f.linesAffected,
  })),
  evidenceChain: [
    {
      label: 'Incident Report',
      description: `Payments team reports checkout total mismatch on coupon + multi-tax orders (${CANONICAL_INCIDENT.id}, ${CANONICAL_INCIDENT.incidentDateLabel}).`,
      type: 'incident',
    },
    {
      label: 'Observed Symptom',
      description: `Production logs show systematic overcharge (${CANONICAL_INCIDENT.overchargeRange}) across ${CANONICAL_INCIDENT.affectedOrders} orders since ${CANONICAL_INCIDENT.commitDate.split(' ')[0]}.`,
      type: 'symptom',
    },
    {
      label: 'Code Path',
      description:
        'calculateFinalTotal() calls aggregateTaxByJurisdiction() before computeDiscount() — tax on the undiscounted subtotal.',
      type: 'codepath',
    },
    {
      label: 'Business Rule',
      description: `API spec ${CANONICAL_INCIDENT.specSection}: discount must reduce the taxable base before tax is calculated.`,
      type: 'rule',
    },
    {
      label: 'Root Cause',
      description: `Discount applied post-tax in commit ${CANONICAL_INCIDENT.commit} (${CANONICAL_INCIDENT.commitDescription}), violating the spec and over-taxing every affected order.`,
      type: 'cause',
    },
  ],
  whyBelieve: [
    'Log correlation is total: every failure has a coupon plus heterogeneous tax rates; no failures in any other combination.',
    `API spec ${CANONICAL_INCIDENT.specSection} unambiguously requires discount-before-tax; the current code does the opposite.`,
    `Commit ${CANONICAL_INCIDENT.commit} (${CANONICAL_INCIDENT.commitDate}) is the only pricing-pipeline change in the window; the first failure appeared 27 minutes after deployment.`,
    'All four investigators converge on the same function independently.',
    `Executable check: applying the discount first yields ₹${CANONICAL_SCENARIO.fixedTotal.toFixed(2)}; applying it after yields ₹${CANONICAL_SCENARIO.buggyTotal.toFixed(2)} — an overcharge of exactly ${CANONICAL_SCENARIO.discrepancyLabel} per order, reproducible via npm run reproduce.`,
  ],
};
