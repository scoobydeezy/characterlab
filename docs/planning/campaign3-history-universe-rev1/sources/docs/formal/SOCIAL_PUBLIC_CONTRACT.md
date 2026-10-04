# Bounded observer-specific commitment belief

Version: social-public/0.1-candidate. ACCEPTED before implementation, 2026-09-21.
LOCAL DISPOSITION — no owner ruling required. Implements bounded PHEN-SOCIAL-001,
Architecture9, Brief12.10/12.13/12.14. Includes the bounded ORD-002 fan-out and
TRC-003 observer-view contracts below; neither general decision is globally closed.

## Population and sources

Two distinct observer1000/character1002 pairs A/B and one target with a private
concrete support commitment371. Private=true means its Open372 leaf exists in373;
private=false means it was not adopted and the leaf is absent. No lifecycle changes
occur during the bounded episode. The observer proposition is whether that target
holds this commitment; it is neither general disposition nor relationship history.
Each observer has a different local target1002 reference from an explicitly identified
controlled catalogue. This is an identity-establishing channel, not general recognition
or cross-observer continuant linkage. Target truth keys never enter observer evidence.

At most eight originals at strictly increasing integer instants1..10. Each carries
kind1 expression /2 later explanation, mode0 silent /1 truthful /2 inverted /
3 positive claim /4 negative claim, visible receipt serial0..8, independent A/B access
flags, and a physical delivered-outcome Boolean. The shared outcome may be identical
under opposite private commitments: delivery can have another cause. No inference
from delivery alone is licensed by this first source. Claim generation at110 reads
the target commitment; mode selects the display, not the observer's conclusion.
Explanations are claims about the same fixed episode/commitment and may be misleading.
No caller supplies a person model, learned mean or another agent's private belief.

Receipt0 means correlation unavailable and supplies no accepted belief update.
Nonzero kind/serial identifies one visibly marked statement. Repeated kind/serial
must preserve its displayed claim (including silence); contradictory reuse rejects
at source admission. This finite immutable receipt channel does not solve ordinary
hearsay correlation or source credibility. Repeated visible exposure preserves the
statement key, regardless of runtime event IDs; a different receipt is an independent
source only within this controlled apparatus.

## Exact multi-character order and authority

Compile two original probe40 events per source instant, then one target-source110.
Source110 generates two observe120 children; each generates its own evidence130 and
update140. All generated children authenticate full private event fingerprints and
parents. Every stage has one fixed occurrence reservation, including unavailable
branches, so changing A's access does not change B's opaque occurrence bytes.
At40 both probes use state committed before the instant. At120 both projections use
the same immutable display. At140 baseline observers write disjoint person-model keys;
they never read each other. The model commits A-first or B-first scheduling as a
representation comparator. Semantic comparison remaps occurrence provenance but
requires equal per-observer means, counts, statement support and classifications.
No current-lane belief update or same-instant recursive interaction is introduced.

Root810 maps808(observer character, local target) to809(mean,count,support806).
Exactly authority/person-model owns both disjoint leaves. Only source110 reads the
private task leaf. Probe40 reads its own belief; update140 reads/writes its own belief.
The declared violating controls explicitly widen their own read/write registrations;
their permissions never appear in the baseline. No target state is mutated here.

## Safe evidence and learning

Observe120 projects own observer ID, own local target, time, kind/serial, public claim
and delivered outcome only when access is permitted. Denied branches produce a
research-only unavailable marker, omitted from the observer view. They produce no
belief evidence. Kind/serial and claim come from the admitted public display, not
target truth, caller psychological labels or dispatch ancestry. Profile-local1154
records do not masquerade as SEM experiences or inherited ObservationRef237.

Evidence130 accepts only permitted, non-silent claims with nonzero receipt. Candidate
SourceGroupedMean: if the kind/serial key is already in support, no change. Otherwise
n'=n+1, mean'=(n*mean+x)/(n+1), x=positive claim1 or negative claim0. LastStatement
instead sets mean'=x with the same deduplicated support. NoLearning leaves state absent.
Maximum eight source presentations/support entries. No calibrated correctness or
universal credibility interpretation is given to mean or count. Unknown is absent;
known mean0 differs. Classification:0 Unknown,1 Negative (<1/2),2 Indeterminate (=1/2),
3 Positive (>1/2). Probe40 sees only prior completed updates; view after settlement may
show newer owned belief. One positive explanation after a negative expression gives
mean1/2, not automatic truth; two distinct positive claims give2/3. False explanations
can sustain a wrong model. No trait, relationship, affect, reputation or motive update.

## Competitors and diagnostic controls

Model parameters: private commitment Boolean, learning law1..3, control1..4,
reverse observer processing Boolean. Control1 is safe baseline. Control2 GlobalPersonModel
updates the receiving observer then copies its result to the other key, deliberately
violating independent access. Control3 DirectPrivateReader retains normal learning but
sets probe classification from private commitment, deliberately reading truth.
Control4 PresentationCounting accepts duplicate presentations, increments n and
recomputes the mean on each, while support remains a unique source set; this
deliberately overcounts correlation. Controls must fail distinct public contrasts.
SourceGroupedMean and LastStatement remain serious alternatives; no final law is chosen.

## Trace, observer views, failure and persistence

Trace160 records observer viewpoint, registrations/actual reads, projected claims,
correlation key, before/after update, patches and causal children. TargetTruth805 is
research-only; observer records use local target references. ObserverView814 contains
only the requested observer ID/local target, its permitted observations, its probe
history and its own optional current belief. It excludes private commitment, source
mode, denied event markers, other observers, complete trace, global clock, model/run
identity and hashes. The researcher snapshot/save is explicitly omniscient; character
consumers use only their capability-scoped projections, never the trace or saved world.
Invalid observer handles/IDs reject rather than default to A or global state.

SOCIAL_PUBLIC_ALLOCATION_TABLE.json fixes803..816, namespace1154, schema1. Exact
canonical encoding and rational arithmetic; no rounding or RNG. Model identity commits
parameters/content/ownership/stage registrations. Public model preparation is allowlisted
to the frozen cohort; exact S0 and source bytes are committed in run identity. No
callback/getter/source-state injection. Nine stages per source instant (two probes,
one source, two observations, two evidence and two updates); max work9. Instant failure
rolls back both observers, outputs, children and allocators and remains terminal.
Complete-prefix restore reexecutes and requires whole-save equality; partial or forged
prefixes reject. Character views are also compared before/after restore.

## Qualification gates and reopen scope

Freeze private-only, access-only and explanation-only pairs before verdict. Require
wrong initial inference, later recipient-only correction, exact unchanged nonrecipient
view/state, same physical outcome/opposite commitment, false explanation, duplicate
correlation and missing-receipt controls. Require swapped-order semantic equality,
exact source/observer isolation, forbidden-view-field audit, ownership, rollback at
both observers' stages and prefix persistence. No whole ORD-002/TRC-003 closure;
reopen for reciprocal same-instant interaction, general privacy tooling, ordinary
recognition, new communication channels, credibility, hearsay, uncertain correlation,
nested belief, broader person-model domains or downstream social appraisal/actions.
