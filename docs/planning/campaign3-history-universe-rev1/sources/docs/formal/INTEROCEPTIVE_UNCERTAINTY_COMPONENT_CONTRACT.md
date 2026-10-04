# Interoceptive interval belief — 2026-10-02

ACCEPTED LOCAL DISPOSITION. interoceptive-uncertainty-component/0.1-candidate.
Architecture evidence-quality boundary (proposition-local intervals, not generic
confidence), interoception and belief/appraisal ownership support this bounded seam.
Brief12.1-4 and12.4-1 are the targets. No permanent allocation or native admission.

The controlled external source samples one static reserve in[0,1000]. Sensor bias
is in[-1000,1000]; sensed=clamp(actual+bias,0,1000). Width is0,200 or600. Width0 emits
[sensed,sensed]. Otherwise center=500+width*floor((sensed-500+width/2)/width), and
the emitted bounds are [max(0,center-width/2),min(1000,center+width/2)]. These clipped
bins cover the entire domain; upper-edge ties enter the next bin. Unavailable emits
null and exposes neither width nor bias. Bounds themselves are admitted quality,
not a hidden sensor setting read by cognition. Actual reserve and bias never enter
the learner or consumer. This is a new controlled source, not a change to EMB bins.

The belief owner keeps the latest admitted interval, initially unknown. Missing
evidence makes no update. Repeated equal intervals do not narrow it. Bounds describe
values compatible with the admitted measurement model; bias can make them wrong.
No probability mass, calibrated confidence, independence or trust claim is made.
Midpoint is the operational estimate; half-width is unresolved range, not frequency
confidence. Approximate accuracy is predeclared as absolute midpoint error<=100;
the accurate uncertain witness also requires true reserve within the interval and
strictly positive width. The omniscient audit alone evaluates those criteria.

At each of four steps, choice reads the prior belief, then source emits evidence,
then learning commits. No same-step or retrospective update. Prior belief yields
deficit interval [max(0,600-upper),max(0,600-lower)]/1000. A fixed unit importance
and fixed500/1000 competitor use this finite candidate scaling: target ground is
2*selected deficit, bounded0..1000. This is an explicit precaution calibration,
not a universal utility, uncertainty law or claim that uncertainty always motivates.

Five models: UpperRisk selects the upper deficit bound; MidpointRisk selects the
deficit at midpoint; LowerRisk selects the lower bound; PointBelief collapses each
admitted interval to its midpoint before UpperRisk; NoLearning retains unknown.
Unknown creates no target ground. Known high reserve may yield zero deficit and
remains distinct from unknown. The unchanged biologicalChoice adapter supplies
actual reason nuclei, exact probabilities and addressed dice; it supplies selection,
not physical action or scheduler DecisionExpression. No body replenishment or
counterfactual truth read is added. Source truth is researcher-owned static context.

Primary actual550 yields midpoint500 under widths200/600: identical central value
and truth, bounds400..600 versus200..800. The candidate upper-risk ground is400
versus800; midpoint consumer remains200. Both estimates have error50<=100 and
nonzero uncertainty. Changed actual580 retains identical admitted intervals; bias400
yields a confident-looking but wrong interval (no confidence-in-correctness inference).
Actual500 with width0 supplies a point control. Actual900 supplies known no deficit.
Absent/denied/hidden/duplicate/corrective evidence controls preserve causal timing.
All seeds0..7 are declared for the three primary narrow/wide/biased profiles before
qualification; equal sampled sequences must remain reported.

Component frames are strict copied plain data. Commit includes prior/new belief,
source observation and choice, while diagnostics stay outside observerView. Faults
after choice/before commit preserve prior bytes and retry draws. Canonical component
saves bind version, law, originals, seed and complete state; restoration reexecutes
every prefix and checks whole bytes plus one successor. No native Save132 claim.

Freeze canonical model/run/experiment/comparison identities and source hashes before
the full matrix. Retain all comparators, zero/unknown distinctions and failed cohorts.
RO008/010/011/019/020/021 retain natural sensing, correlation, evidence fusion, stale
belief under changing physiology, general confidence and native integration. No
ontology reduction or owner ruling is required for this existing evidence seam.
