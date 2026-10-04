# fear-guilt-public/0.1-candidate

ACCEPTED LOCAL DISPOSITION,2026-09-24, before implementation. Architecture9/13.4,
Brief12.10 clause3. Preserve private affect, display, evidence and attributed cause.
No owner ruling. This profile exercises inference and appraisal, not chosen action.

## Source and keys
One controlled target, two observers, one named incident; authored identity channels
establish target/incident, not causal responsibility. Empty S0;1..8 requests at
strictly increasing instants1..16. Wrongdoing is a constant hidden Boolean incident
fact, not the target's guilt emotion. Two independent private perceived threat signals
(animal threat and anticipated accusation) are Boolean controlled evidence. Their
disjunction is a bounded threat likelihood, with severity1/vulnerability1/control0.
SplitExposure yields E=U=likelihood at50. This is a controlled appraisal source,
not a learned fear model. Neither threat signal reads wrongdoing. At110 enabled
display produces nervousness=(U>0), including observed false; disabled is absent.
No intentional communication, suppression, or decision/execution claim.

At120 each observer independently receives the produced cue through its own access,
plus optional perceived animal threat and possession of an incident-relevant object.
Context values are admitted observations, can be misleading, and never encode a
guilt/cause label. Possession does not logically entail wrongdoing. Every observation
names observer, target and incident. The single incident scope supplies grouping;
unguided recognition and event segmentation remain unqualified.

## Retention, inference and consumer
Each observer owns one history leaf. At140 append a nonempty observation; absence
does not create a sample or erase prior evidence. At40 infer using the latest admitted
value of each channel in that incident. Repeated probes do not multiply support.
Old immutable judgments remain unchanged. Learning140 affects only later40/50.

Candidate1 ContextOdds: prior odds1; nervousness true multiplies3, false1/3;
animal threat true multiplies1/5, false1; possession true multiplies5, false1/5.
Product O gives guilt-attribution weight p=O/(1+O). No admitted channel means unknown,
not prior1/2. These are explicit experimental weights, not calibrated probabilities,
identified causal likelihoods or independent real-world evidence assumptions.
Competing explanations are wrongdoing-linked nervousness versus another threat;
animal evidence shifts support, never supplies the correct explanation as a label.
Candidate2 CueOnly uses only the nervousness factor. Candidate3 NoLearning retains
no observations. Candidate4 TruthOracle returns hidden wrongdoing0/1 at40, an explicit
epistemic violation, not a lawful correction. Its odds field is absent; it bypasses
the evidence inference. Candidate1 with goal2 is an additional model control.

At50 appraisal consumes the frozen judgment and adopted observer goal: goal1 values
avoiding wrongdoing exposure, adverse=p; goal2 values avoiding mistaken exclusion,
adverse=1-p. SplitExposure with s=v=1,c=0 yields E=U=adverse. This deliberately bounded
goal contrast does not model adjudication, trust or downstream behavior. Unknown
judgment yields unknown appraisal. Attribution contains no goal operand.

## Runtime contract
source0 -> private10 -> infer-a40 -> infer-b40 -> fear50 -> appraise-a50 ->
appraise-b50 -> display110 -> observe-a120 -> observe-b120 -> learn-a140 -> learn-b140.
All stages reserve the same occurrence counts, including absent channels. Only infer
and learn read their own leaf; only learn writes it. Oracle's truth read is explicit
in its infer input projection. Lawful infer receives no private source. Source/private
and receiving stages project only their defined world fields. Appraisal consumes
judgment payload, fear consumes private observation, display consumes fear output.
Max settlement32. Complete-prefix persistence, whole-save equality and replay required.
Records1165..1177/schema1, namespace1174, exact allocation table is authoritative.

Freeze five models: laws1..4 goal1 and law1 goal2, seed13 (no random draws in this
profile). Freeze run identities/experiment/comparison before public execution.
Require innocent fear, later contextual revision and contradictory possession,
two observers, missing cue/context, known calm, unknown, no learning, goal-only
intervention, cue-only comparator and Oracle violation. Compare whole later views
under hidden wrongdoing, changed private threat cause with equal display, and other
observer receipt changes; use common subsequent received observations. Test every
stage/commit rollback, ownership, malformed model/input/save and exact prefix advances.

MEC-004 controlled identity/projection and MEC-022 immutable judgments execute.
MEC-012..019 remain preserved in prior actual-choice profiles; no choice mechanism is
retired or replaced here. P3-007/008/009 retain trust, social threat and belief/affect
separation. RO-C3-011/014/019/020 carry calibration, causal identification, source
trust/correlation, broader social affect, unguided recognition and later privacy
horizons. No general guilt detection, moral identity or whole social qualification.
