# Encoding and accessibility mathematical controls

Version: `encoding-access-math/0.1-candidate`.
Status: SHAPE ACCEPTED by primary-agent mathematical review under autonomous-work
authorization, 2026-09-11. Component-only: no allocated record, runtime transition,
identity, provenance system, public source admission or persistent writer is defined.

Authority and intake: [closure inventory](../planning/GENERAL_ATTENTION_CLOSURE_PLAN.md),
MEC-005/007/008/009/010 and CTL-004. These are comparison laws, not psychological
invariants. New implementation must use substrate ExactRational/roundEven and must
not import reference code. Keys are distinct nonempty opaque ordering labels; they
provide equality and deterministic ties only, never role, category or similarity.
All vectors are finite with at most32 entries. Reject malformed dimensions, unknown
keys, duplicate keys, negative operands and out-of-domain configuration.

## EAM laws

EAM-1: B,R,A,N,S in[0,1], alphaN/alphaS>=0. Raw=B*R*A*(1+alphaN*N)*(1+alphaS*S).
Bounded response f(x)=x/(1+x) for x>=0. Positive residual membership is supplied by
an eventual separately admitted semantic producer; component division pool/count
requires count>0, pool in[0,1]. Empty membership allocates nothing.

EAM-2: independent z_i=f(raw_i). Historical shared z_i=raw_i/max(B,sum raw), with
zero denominator giving zero and B>=0. Hybrid threshold>=0 partitions raw>=threshold;
important units use f(raw), low units use raw/max(max(0,B-sum important z),sum low raw).
Retired flat control yields1 per admitted entry. Each z in[0,1]; no conserved total B
claim is made. Hidden/unadmitted entries must be removed by the future source seam,
not supplied to this kernel as zero-valued competitors. Empty input yields empty output.

EAM-3: graph W is square, nonnegative, zero diagonal, row sums<=1 and every entry
lies on scale D>0. z in[0,1]; eta,lambda,dt>=0. For each off-diagonal entry compute
q=RoundEven(D*(W/(1+lambda*dt)+eta*z_i*z_j)). If S=sum q<=D, retain q. Otherwise
allocate floor(D*q/S), then one unit to the D-sum floor entries with greatest remainder,
ties by canonical key. Omit no positive mass; zero remains zero. Validate input graph
before calculation. Exact row sum<=D and no diagonal learning follow constructively.
Returned rows are detached candidate values, not mutation authority.

EAM-4: W row-substochastic, beta in[0,1), b>=0, D>0. Solve exactly
(I-beta W)a=b using rational elimination, then RoundEven(D*a)/D once per output.
Strict diagonal dominance supplies uniqueness and nonzero pivots. Return both exact
and quantized values so premature quantization can be distinguished. A beta=0 control
has no spreading; it is a distinct alternative, not a replacement claimed equivalent.

EAM-5: ordered presentation times r<=t; lambda>=0, positive integer d<=16.
Base=sum 1/(1+lambda*(t-r))^d. Future or unsorted history rejects. Associative pull is
the arithmetic mean of activation over the episode's distinct retained keys (empty=0).
RetrievalScore=omegaB*Base+omegaA*pull for nonnegative weights. Canonical descending
score, key tie break, K integer0..32. Ranking reads inputs only. Recording a successful
retrieval is a later writer obligation, not an effect of scoring.

## Frozen component proof vectors (not yet passed)

EAM-A exact raw factors/zero; B independent footprint invariance; C shared/hybrid
denominator semantics and threshold equality; D positive residual division; E row
decay/Hebbian/lattice stages; F overflow/largest-remainder tie; G no-self/mass and
input immutability; H exact two-node solve and beta0 alternative; I late versus early
quantization; J future history rejection/recency/frequency; K canonical retrieval
ties/K0/averaged pull; L malformed domains/dimensions/unknown and duplicate keys.

Self-review: factor bounds prove raw>=0 and independent output<1; each shared low
denominator dominates that entry, proving per-entry bounds but not sum<=B. Largest
remainders conserve exactly D under overflow. Strict diagonal dominance and beta<1
ensure an exact unique activation solve. No formula turns opaque keys into evidence.
Symbolic source binding, runtime proof, corpus membership and ATTN closure remain OPEN.
