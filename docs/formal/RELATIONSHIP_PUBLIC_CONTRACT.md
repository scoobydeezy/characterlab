# relationship-public/0.1-candidate

Accepted local successor, 2026-09-21, before implementation and model freeze.
Authority: Architecture9, Brief12.11, PHEN-REL-001 and the Campaign3 escalation policy.

## Controlled source and ordering

Two observers/actors, one target represented by separate observer-local identified
target IDs. Each person estimate is one proposition: the target's stated current
willingness to cooperate. It is not reputation, calibrated trust or private truth.
Max12 original instants, strictly increasing integer1..24. Original843 fields:
At; physical Kind0none/1cooperation/2breach/3statement; participant Mask0none/1A/2B/3both;
AccessA,AccessB; Display0actual/1cooperation/2breach/3statement; Claim0none/1positive/
2negative; ContactA,ContactB. Source at110 materializes physical844;120 projects each
observer's own access, perceived kind, own participant role and optional claim. Observer
role uses the controlled participant mask, not hidden private mental state. A witness
who did not participate cannot acquire the other's dyadic history. Display and Claim
are fallible apparatus interventions, not full communication generation or attribution.

Appraise40, raw51, reasons52, response60 occur independently for both observers before
source110, observe120 for both, then history/person/cache140 for both:17 events per
instant, one1156 occurrence each. All branches allocate equally. Normal and reversed
observer fan-out must agree semantically; no reciprocal current-instant decisions.
140 writes affect only later40. Per-observer cache executes after its own history.
No input directly supplies a person estimate, relationship value or response.

## Owned history and person estimate

Root848 maps existing808(holder,localTarget) keys to847 journals of846 entries
(observationOccurrence,time,perceivedKind1/2). Only authority/relationship-history
appends admitted own-participant cooperation/breach, max12 unique strictly ordered
entries. Statements, denied observations, mere witnessing and absence append nothing.
Root850 maps the same keys to849(value,source) latest admitted claim, solely
authority/person-model. Unknown is absent. A claim can update the current estimate
without altering prior dyadic history. No explanation automatically proves or repairs
the original breach. This is not general causal attribution correction.

Fold851 contains cooperation count and rupture Boolean. Law1 StickyRupture counts
all cooperation and retains true after any breach. Law2 LatestInteraction counts all
cooperation but sets rupture true on breach and false on later cooperation. Empty
history is (0,false). These are finite symbolic candidates, not a general trust law.
DerivedHistory(candidate1) computes this fold from own journal. StoredSummary(2)
reads an equal cache in root852 owned by authority/relationship-summary, recomputed
at140 and checked against the journal at every committed boundary. PersonEstimateOnly(3)
uses (0,false) and ignores history for appraisal, retaining the same person-learning path.

SharedHistory(4) copies each accepted participant history result into the other key,
explicitly violating directionality. DirectTruth(5) uses its derived history but sets
current rupture true if this original's hidden physical breach names that participant,
even without admitted observation. Both are labelled diagnostic controls only.

## Appraisal and response probe

Appraisal853 records own fold and optional person estimate, contact feasibility and
three distinct Boolean coordinates: Comfort=(count>=2 AND NOT rupture), Caution=rupture,
MissingContact=(count>=2 AND NOT contact). The latter is a bounded history-relative
absence signal, not a grief or distress intensity law. No automatic history decay.

Two options: contact target and continue own activity. Both have independent genuine
base motive strength1 when contact is available; own activity always remains available.
No-contact omits the contact option and its signals. This models a standing desire
for social contact versus a competing activity, not a relationship-generated new Need.
For contact only, a known-positive person claim supplies situational role2 strength+1,
known-negative supplies-1, unknown supplies no modifier. Comfort supplies standing
role3 +1; Caution supplies-1; neither supplies0. These existing402/401 roles consolidate
through437 into two407 nuclei using the frozen task-reason dice. No raw trust score
or independent relationship die is added. Opposite signs and contexts remain traceable.
Analyze exact option distributions with thetaRoll=1,thetaPlayer=1. Auto uses the ranked
winner; unresolved modes roll each nucleus's addressed signed die and use uniform
addressed ties, emitting411 records. Response856 preserves probabilities, mode, draws
and selected option. This is a prospective probe, not intent/expression/action execution.
Identity/body modifiers are fixed0, skill1 in immutable content; no dynamic integration.
Random causal roots are the48 authored fixture IDs content/relationship/probe/{observer
index}/{instant1..24}, enumerated in content861. Each purpose uses drawIndex0 and
actor/action/ground bindings as applicable. Roots identify public probe opportunities,
not evidence or target truth; sibling order/access never changes a probe's draw address.

## Boundaries and qualification

Records842..862/schema1 and namespace1156 are fixed by the allocation table. Only
data-only frozen model preparation and exact S0/original inputs are admitted. Read/write
registrations name exact observer keys; trace160 is omniscient research evidence.
ObserverView860 contains only its own permitted observations, appraisals, responses,
person estimate and journal. Denied markers, other actor/target IDs, physical844,
original843, model/run IDs and omniscient traces are excluded. Research save/snapshot
is explicitly omniscient; view routing is not authentication or a security sandbox.

Every complete prefix reexecutes and authenticates whole save bytes and observer views;
all17 stage kinds plus commit must rollback transactionally after a learned prefix.
Frozen comparisons must include matched person estimates/different own histories,
contact and rupture, positive explanation without erased history, later absence,
nonparticipant witnessing, nonrecipient exact equality under own access interventions,
hidden physical changes/fixed displays, person-only failure, derived/cache equality,
different rupture laws and reversed-order semantic equality. Broader relational
dimensions, attribution, reconciliation, attachment asymmetry, grief, long separation,
compression and enacted interaction remain conditional. No global ORD-002/TRC-003 closure.
