# Assembled decision read views — 0.1-candidate

Version: assembled-decision-view/0.1-candidate. Read-only API beneath the existing
decision/observation contracts; no simulation-state, trace, RNG or save-schema change.
Implements bounded correspondence to decision-public/0.1-candidate character history
and player projection. Original controls remain unchanged.

## Authority and inputs
Only createCharacterRun/restoreCharacterRun's own committed runtime snapshot feeds
the public methods. No external trace, history or outcome is admitted through them.
decisionHistory() and decisionPresentation() return fresh canonical bytes.
Historical reads never recompute reasons, probabilities or meaning using current state.
No learned memory store or new cognitive input is introduced; these are closed
projections of retained committed records, not a general memory/attention policy.
The raw snapshot/save remains a researcher surface, never a character-safe view.

## Character history grammar
Canonical list [text(version+'/history'), list(entries)] in committed expression order.
An entry is [decisionId, at, intentId, expression, list(permittedOutcomes)].
expression is [expressionId, chosenCandidate, list(reasonSources), list(nuclei),
list(probabilities), margin, contest, conflictMass, stake, authorship, mode,
list(meaningChannels), frozenInterpretationVersion].
reasonSources flatten each actual raw402 as [sourceKey, signedStrength, evidenceBasis].
nuclei flatten407 as [nucleusKey, roleSummaryWithoutCoverageTrace, die,
standingModifier, situationModifier, completeDistribution].
roleSummaryWithoutCoverageTrace is [base,standing,situation].
probabilities retain421 [candidate,probability]; meaning channels retain427
[channelId,alignment]. Frozen interpretation428 is retained; no new evaluation.
No draw/address/seed, actual outcome, execution permission, hidden source payload,
model/run identity, research trace or player face presentation appears in this view.
Allow only the structural record types needed by those selected fields:
237,371,395,399,400,404,424,428 and permitted evidence203/204/205.
Every nested record must have an admitted schema version (404 allows1/2; others1);
traverse lists/sets/maps AND typed-identifier payloads. Unknown types/versions reject.
Scalar schema/role validation already occurs at model execution; projection adds this
strict recursive closure. Never pass an entire context, intent or expression tree.

Outcome evidence203 is copied only from an actual protocol-observation event at120,
whose single causal parent identifies the protocol-execution event at110 of the same
instant. Parent trace output433 resolves attempt432->plan431->intent425->decision409;
its decisionId must identify the historical expression. Validate evidence closure,
protocol transformation version and occurredAt, and exact membership in committed
outputs. Use this private association solely for joining, never expose or interpret
actual count/permission/world truth. Ambiguous, missing or foreign joins reject.
No observation means an empty list; a present zero measurement remains a present
record. Cognitive operations with no protocol consequence simply have no observation.

## Player projection grammar
[text(version+'/player'), list([decisionId, chosenCandidate, list(faces), tieWinner])].
Only mode3 (PlayerFacingRoll) is included. Each face is
[nucleusKey, die, standingModifier, situationModifier, actualFace, contribution],
copied from the committed reason422; tieWinner is [] or [the selected tie candidate].
No RNG call occurs; raw draw411/address110/effective key/seed is not exposed.
Auto and QuietRoll have no player presentation. Player projection is never included
in character history or treated as character evidence.

## Persistence and controls
Both views derive from original committed records after deterministic restore.
Repeated reads must not mutate any authoritative bytes or identifiers.
Expressions retain their original fields after later outcomes/decisions.
The IntentEqualsOutcome comparator is test-only: from a safe history entry alone,
omit expression only when a present protocol observation reports completed count0.
Absent outcome cannot trigger it. No predicate on physical permission or actual433.
Prove failure of this collapse without replacing the reference character's history.
Privacy claims are scoped to this decision view; independent permitted body/learning
channels may disclose later physical consequences and are not suppressed by this API.
