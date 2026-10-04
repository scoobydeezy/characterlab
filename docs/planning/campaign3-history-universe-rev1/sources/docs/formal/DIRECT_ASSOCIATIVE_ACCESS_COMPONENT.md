# Direct and associative access composition

2026-09-12. `direct-associative-access-component/0.1-candidate`.
**Numeric component shape accepted by primary-agent review under autonomous authority.**
This is a bounded reference composition of the accepted semantic separation, not a
public cue contract, final weighting theory or graph-lifecycle qualification.

Inputs: distinct current retained semantic keys E, independently declared learned
graph keys G and EAM-valid matrix W, a nonnegative exact current-cue map c, beta in
[0,1), and positive quantization scale D. Each key set/cue map and E union G is bounded
by32. Keys are nonempty NFC component strings; no new public identity grammar follows.
Cues outside the union are validated but have no contribution or target here.

Use the actual EAM solve on G with b=c restricted to G (missing cue=0). Obtain exact
a=(I-beta W)^-1 b. For each union key k define:

- CueSeed(k)=c(k), or0 if absent.
- DirectMatch(k)=c(k) when k is episodically retained; otherwise0.
- LearnedSpread(k)=a(k)-b(k) for graph keys; otherwise0.
- Contribution(k)=DirectMatch(k)+LearnedSpread(k).

This component uses unit coefficients; separately weighted direct/spread hypotheses
require a later declared comparison. Subtract exact values before quantization.
Nonnegative W and beta imply a-b>=0; a negative residual rejects as an invariant
failure, never clips. Positive-length cycles returning influence to the cued key are
association-mediated spread, not a second zero-hop term. No acyclic-path replacement
or loop suppression is introduced by this decomposition.

Quantize Contribution once with RoundEven(D*Contribution)/D. Do not round direct
and spread separately before summing; do not compute spread by subtracting an exact
cue from rounded a. EAM's already returned quantized values are not used for this
subtraction. For a key in both E and G the combined exact value equals EAM's a.

Return detached immutable row values in canonical text-byte key order, with membership
flags, exact components and the quantized contribution. These are computation/diagnostic
values, not persistent nodes, acquisition targets or cue evidence. Return no new
graph or occurrence identity. Inputs remain unchanged. Existing episode ranking may
consume the contribution map only for actual surviving episodes; rows do not authorize
manufacturing an episode from graph-only membership.

Required tests: isolated-node membership independence, W=0 no double count, beta0,
graph-only mediation, exact decomposition sum, one final quantization, out-of-domain
cue no-op, empty sets, input permutations and invalid cue/graph domains. Actual cue
producer binding, subject reads, learned state resources and public retrieval remain
open. Previous EAM and graph-only adapter contracts are preserved unchanged.
