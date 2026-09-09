# Accepted PHEN-ADAPT verdict and corpus version reconciliation

**Resolution: PROMOTION APPROVED; reconciliation CLOSED, 2026-09-08.** Current fixture1.11.0 /
corpus0.27.0 uses3cb09115...;181ce571... retains the exact historical1.11.0-draft commitment.
See [accepted promotion](PHEN_ADAPT_CORPUS_PROMOTION_ACCEPTED.json). The analysis below is the
retained pre-resolution review, not a pending request.

2026-09-08. The user **ACCEPTS the fixture amendment** and **PASSES PHEN-ADAPT-001 in bounded
frozen-model scope**. ADAPT-9a, ADAPT-9b and parent control9 are PASS. The historical single-rule
fixture interpretation is superseded explicitly by the accepted addendum; its source remains intact.

The accepted domain is the same-S0 count0/1 pair with four matched single-path rules, independently
specified changed-path sets, distinguished D-only diagnostic read, later permitted measurement,
persistent episode and usable recall. Control3 remains mechanically satisfied but non-discriminating
at leaf-family granularity; exact-path/key/WRT protections carry isolation. Accepted memory/probe/EVC
component scope qualifications and the scheduler-ancestry/state-dependency distinction remain binding.

This verdict does not qualify arbitrary N-rule configurations, every adaptation consumer, blanket
ADAPT/factory/VAL correctness, general memory or PHEN-MEM-001. Campaign2 remains ACTIVE / OPEN.

## Sole remaining bookkeeping conflict

The verdict explicitly requests both the suffix-free fixture version and the reviewed digest:

| Exact serialized PHEN-ADAPT version | Actual canonical manifest digest |
|---|---|
| `1.11.0-draft` | `181ce5711aee0eef8e7089e914906098e1183f7a592bce7d9096192993a57315` |
| `1.11.0` | `3cb09115d90485d5975968ffca419a4960a398326b6b6339a5b1e8e8fdcec276` |

CorpusManifestEntry/174 field2 serializes the exact phenomenon-version string. Removing `-draft`
therefore changes canonical bytes and their digest. Renaming the aggregate label to corpus/0.27.0
alone would not change these bytes; it would leave the fixture member serialized as1.11.0-draft.
No other member changes, and no model/runtime/allocation change is involved.

[The reconciliation packet](PHEN_ADAPT_CORPUS_PROMOTION_REVIEW.json) contains both complete canonical
manifests, independently compiled through the existing substrate, and the exact one-member delta.
The current manifest table/commitment is preserved pending resolution. Its former pending-amendment
wording is historical status, superseded by the accepted research verdict above; only canonical
version/digest promotion remains unresolved. This does not reopen PHEN-ADAPT's research PASS.

Recommended resolution: keep the explicitly requested1.11.0 and corpus/0.27.0 promotion, accept
the mechanically resulting3cb09115... digest, and retain181ce571... as the reviewed draft commitment.
The alternative is to retain181ce571... and its exact1.11.0-draft member bytes. Those two canonical
commitments cannot be treated as aliases or made equal by relabeling the digest.

The user's final version/digest choice is required before publishing the reconciled current manifest.
No additional behavioral proof or semantic redesign is needed.
