"""Record the tested bounded successor; preserve all earlier verdict bytes."""
from pathlib import Path
import json
P=Path('docs/planning'); D=P/'values-integration-matrix-rev1'
c=json.loads((D/'closure.json').read_text());assert c['status']=='PASS' and c['runs']==125
report=P/'CAMPAIGN3_VALUES_INTEGRATION_QUALIFICATION.md'
assert not report.exists(),'record once'
report.write_text('''# Values integration qualification — 2026-10-11

**VER-C3-VALUES-INTEGRATION-001 — QUALIFIED BOUNDED NATIVE INTEGRATION.**
LOCAL DISPOSITION; values-integration-component/0.1-candidate and
values-integration-public/0.1-candidate. Counters **1529 /0**. No owner ruling.

## What the experiment earns

Actual reason/dice choice60 produces intent70, expression80, plan90 and attempt100.
World110 independently executes or blocks that attempt. Observation120 admits,
withholds or misrepresents its outcome; goal130, Value consolidation140 and the
causally following forecast140 each have separate sole mutation authority. The next
appraisal50 reads retained Value, admitted forecast and current goal. It cannot read
world truth or use the evidence that the same instant has not yet produced.

The primary sequence is no opportunity/adopt, chosen B/completion, then A and A.
The first admitted positive outcome produces preference1/2. Goal fulfillment retains
that preference; later appraisal becomes1/2 and then2/3. Withholding that outcome
prevents Value acquisition even though the B attempt succeeds and the goal criterion
is separately visible. Observed neutral is known zero; missing evidence/category and
absent opportunity remain distinct. Observed execution failure is negative evidence.

Fixed positive outcome and goal displays yield identical complete character rows
under successful, blocked and negative-outcome physical worlds. A false report can
therefore produce mistaken fulfillment and positive Value despite no execution.
Physical truth is not retroactively rewritten to match character belief.

Matched retirement and maintained-goal controls retain the same preference1/2.
The next appraisal keeps that Value meaning while goal relevance changes1 to0;
the primary later action changes B to A. Completion and retirement are actual owned
lifecycle transitions, not the old Task deadline. Adoption/withdrawal commands and
category links remain controlled inputs, not learned strategy or category discovery.

With belief/context/goal fixed, positive versus neutral acquired Value changes the
declared appraisal output. Unknown forecast differs from known0; reversing context
reverses benefit/cost at fixed Value. NoValueAppraisal removes this appraisal effect
while preserving Value learning, forecast and baseline actions across all eight seeds.
This is a read-only Value-relative appraisal seam, not a general affect law, new
affect-to-action route or shared currency between goals and Values.

## Comparison and replay evidence

values-integration-matrix-rev1/plan.json froze5 model profiles and125 distinct runs:
each profile has8 baseline seeds and17 interventions at seed0. All500 published
native rows match the component. All625 public Save132 prefixes restore exactly;
500 advancing successors and125 terminal successors preserve entire save bytes.
Thirteen scheduled stages per instant give6500 native stages. This is one successor
per prefix over four-instant programs, not arbitrary horizons or complete replay tails.

Accumulated, Refold, Latest and NoConsolidation remain distinct models. Stored and
Refold agree in all25 matched programs; Refold has no stored projection leaf. Latest
reacts differently to the contrary receipt. NeedOnly/Joint equal ValuesOnly under
the three consolidating laws' complete overlap. NoConsolidation retains expectation
diagnostics, so NeedOnly/Joint can still differ from its zero Value contributor.
That result is preserved rather than relabelled a failed ablation.

47 affected tests,328 reference tests, boundary checks, TypeScript and production
build pass. Eight supplemental native trajectories compare physical state against
the component and exact inherited RNG addresses; per-run report `world` is explicitly
the component diagnostic. Every native stage and commit has a reached rollback test.
Cross-owner writes, invalid ingress, forged saves, original-input changes, caller
mutation and both asynchronous publication barriers are tested. The extension checks
56 producers/59 factories and all previous audit scopes without editing their sources.

The initial Vite launch failed before assertions because of filesystem access; the
authorized retry passed. A later ingress test used unregistered phase41, causing
construction rejection before its settlement assertion. The frozen test source and
failed receipt remain preserved. Its phase50 successor tests registered-but-wrong
phase rejection and passes. No production model/run identity changed. The matrix
checker explicitly authenticates both versions; it does not pretend the frozen
failing test passed. A uniform-CRLF registry recovery attempt failed; the exact mixed
line-ending predecessor was subsequently hash-matched and is retained separately.

## Disposition and limits

HQ012-VALUES-OUTCOME, HQ012-VALUES-GOAL and HQ012-VALUES-APPRAISAL are discharged in
this bounded scope. Earlier Values component/public verdicts are unchanged. No law
is selected, comparator retired or irreducible Value storage claimed. Controlled
binary forecasts do not qualify causal inference, calibrated uncertainty, richer
category acquisition, age-weighted Values or lifetime scaling. All-seed baseline
coverage does not imply all-seed intervention coverage.

RO010/019/020/021 preserve these distinctions and exit accounting; RO022 extends
publication closure to56/59. This adds one verdict, for109 named/103 Campaign3
entries;132 bounded clauses and corpus0.29.0/21 are unchanged. Final Campaign3
disposition belongs to CAMPAIGN3_VALUES_EXIT_REFRESH.md and its validation receipt,
not to the count of passing native programs alone.
''',encoding='utf-8')
ledger=P/'VERDICT_LEDGER.md'
with ledger.open('ab') as f:f.write('''

## `VER-C3-VALUES-INTEGRATION-001` — physical evidence, goal lifecycle and appraisal (2026-10-11)

QUALIFIED BOUNDED NATIVE / LOCAL DISPOSITION. values-integration-public/0.1-candidate.
5 profiles/125 runs/625 original Save132 prefixes;500 advancing/125 terminal;
6500 native stages/500 exact component rows;47 affected/328 reference tests/build.
Independent world/evidence, actual goal fulfillment/retirement with retained Value,
and later read-only Value-relative appraisal discharge the three HQ012 Values gates.
Stored/Refold25 pairs equal; four learning laws and NoValueAppraisal retained.
Eight baseline seeds/profile;17 interventions at seed0/profile. No general affect,
category learning, age-weighted Values or storage-necessity claim. Preserve phase41
test failure/corrected50 and startup access failure; frozen model/run bytes unchanged.
56 producers/59 factories checked; earlier scopes unchanged. Counters1529/0;
109 named verdicts; no clause promotion. Evidence: CAMPAIGN3_VALUES_INTEGRATION_QUALIFICATION.md,
values-integration-matrix-rev1/closure.json, VALUES_INTEGRATION_WRAPPER_EXTENSION_REV1.json.
RO-C3-010/019/020/021/022. Final exit disposition is a separate refreshed review.
'''.encode('utf-8'))
plan=Path('CharacterLab — Reference Architecture Build & Research Campaign Plan.md')
with plan.open('ab') as f:f.write('''

## Bounded integrated Values closure — 2026-10-11
VER-C3-VALUES-INTEGRATION-001 qualifies physical/admitted-evidence separation,
actual goal fulfillment/retirement preserving Value and later Value-relative appraisal.
5 models/125 runs/625 native prefixes/6500 stages;47 affected/328 reference tests/build.
Four Value laws and NoValueAppraisal remain; Stored/Refold and overlap equalities survive.
No natural category, general affect, age-weighted Value or lifetime law is implied.
Counters1529/0;109 verdicts;56/59 wrappers;132 bounded clauses/corpus0.29.0/21 unchanged.
Next the explicit final disposition in docs/planning/CAMPAIGN3_VALUES_EXIT_REFRESH.md.
Dedicated inspection UI belongs between Campaigns3 and4; no reduction ranking starts here.
'''.encode('utf-8'))
registry=Path('docs/formal/CANONICAL_RECORD_REGISTRY.md')
with registry.open('ab') as f:f.write(b'\nValues integrated native closure: VER-C3-VALUES-INTEGRATION-001; records1520..1529 unchanged; counters1529/0.\n')
rpath=P/'RESEARCH_OBLIGATIONS.json';r=json.loads(rpath.read_text(encoding='utf-8-sig'))
ids=['RO-C3-010','RO-C3-019','RO-C3-020','RO-C3-021','RO-C3-022']
r['verdictReviews'].append({'verdict':'VER-C3-VALUES-INTEGRATION-001','obligations':ids})
for o in r['obligations']:
 if o['id'] in ids:
  o['verdicts'].append('VER-C3-VALUES-INTEGRATION-001');o['evidence'].append(report.as_posix())
  o['established']+=' VER-C3-VALUES-INTEGRATION-001 qualifies the three HQ012 Values integration gates with5 models/125 native runs/625 prefixes; earlier laws and equalities remain. Controlled categories/binary forecasts and17 seed0 interventions limit generality.'
  if o['id']=='RO-C3-022':o['closure']['evidence'].append('docs/planning/VALUES_INTEGRATION_WRAPPER_EXTENSION_REV1.json')
paths=[report,*D.glob('*.json'),*(P/'values-integration-development-rev1').iterdir(),Path('docs/formal/VALUES_INTEGRATION_COMPONENT_CONTRACT.md'),Path('docs/formal/VALUES_INTEGRATION_PUBLIC_CONTRACT.md'),Path('docs/formal/VALUES_INTEGRATION_PUBLIC_ALLOCATION_TABLE.json'),P/'VALUES_INTEGRATION_WRAPPER_EXTENSION_REV1.json']
known={x['path'] for x in r['reportReviews']}
for p in paths:
 if p.is_file() and p.as_posix() not in known:
  r['reportReviews'].append({'path':p.as_posix(),'obligations':ids});known.add(p.as_posix())
  for o in r['obligations']:
   if o['id'] in ids:o['evidence'].append(p.as_posix())
rpath.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print('Recorded bounded Values verdict; final exit review remains separate.')
