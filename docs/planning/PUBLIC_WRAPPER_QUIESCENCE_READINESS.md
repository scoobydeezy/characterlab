# Public wrapper quiescence audit — 2026-09-26

ACTIVE follow-up, RO-C3-022. No owner ruling. This precedes new psychological work.
The identity-belief integration exposed a native serialization window after scheduler
commit but before wrapper RNG-ledger commit. Ordinary polling missed it; a nonmutating
microtask scheduled at the precommit boundary produced a torn accepted save.
IDENTITY_PUBLIC_QUIESCENCE_PROBE_REV1 also proves the same window in the prior native
identity Task runtime. Preserve all probes and serial cohorts; do not treat serial
complete-prefix equality as proof of arbitrary public-read quiescence.

Audit public factories and their runtime wrappers for externally readable state,
trace, output, queue, allocation and continuation/RNG bookkeeping. Guard the whole
wrapper operation, including failure cleanup and concurrent-call rejection. Do not
change character semantics, source laws or old record schemas to solve protocol
publication. A narrow read barrier is the first conservative candidate; broader
shared-substrate redesign is not implied.

Begin with actual prior identity Task/Biological public handles and other matching
wrappers, using deterministic boundary probes. The test-only hook must schedule a
read without mutating authoritative state. Public production APIs remain callback-free.
Classify every candidate as exposed, independently guarded, or inapplicable with
source evidence. Preserve old implementation/receipt graphs before patches; verify
serial bytes, model/run identity, complete-prefix restores and fault cleanup for each
corrected profile. Do not silently invalidate frozen qualifications or broaden their
original concurrent-read claims. Source-only similarity is a lead, not a proved failure.

RO-C3-022 closes only when this declared public-wrapper inventory is accounted and
confirmed exposures are repaired/qualified. Existing serial behavioral verdicts stand
in their tested scope; unrestricted concurrent-public-save claims remain blocked.
RO-C3-021 includes this finding in mandatory historical reconciliation before exit.
After this protocol seam, resume IDENTITY_RECOVERY_READINESS.md. No psychological
clause is promoted by the protocol repair.
