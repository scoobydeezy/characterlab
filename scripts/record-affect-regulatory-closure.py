"""One-time bounded regulatory reduction bookkeeping, after the frozen result passes."""
from pathlib import Path
import json
p=Path('docs/planning');r=json.loads((p/'AFFECT_REGULATORY_RESULT_REV1.json').read_text())
assert r['status']=='PASS' and r['componentPrefixes']==832 and r['nativePrefixes']==16
assert not (p/'CAMPAIGN3_AFFECT_REGULATORY_QUALIFICATION.md').exists()
def write(path,s):Path(path).write_text(s,encoding='utf-8',newline='\n')
table='\n'.join(f"| {x['law']} | {x['matches']}/64 |" for x in r['comparison'])
report='''# Affect versus bodily regulatory reduction — 2026-10-03

**VER-C3-AFFECT-REGULATORY-001. QUALIFIED BOUNDED.**
Stages A–E; LOCAL DISPOSITION — no owner ruling required. Counters **1508 /0**.
Contract affect-regulatory-reduction/0.1-candidate. Unchanged biological-integration,
biological-dynamics and biology-public/0.1-candidate implementations.
Authoritative AFFECT_REGULATORY_PLAN_REV1.json, RESULT_REV1 and CLOSURE_REV1.

## Precisely qualified reduction failure

Identical complete bodily histories can support different belief/goal-relative threat
and different later bodily regulation. In the matched primary pair the constitution,
executed actions, complete physical states/transition terms through2 and current safe
sensations2 are identical. Admitted first-consequence evidence differs: harm0 versus600.
The independently retained harm belief yields threat0 versus270, at identical pleasure0
and distress0. The existing delayed consumer applies that prior threat at consequence3:
stress remains0 versus rises135. It cannot retroactively change the earlier body.

Any deterministic projection of that identical bodily history and fixed constitution
must give the same packet in the primary pair. It therefore cannot preserve both distinct
required consequences without additional psychological information. This is a concrete
failure of body-only affect reduction, stronger than a collision in one selected meter.
It is not a proof against a scalar that already encodes learned threat, goal-relative
meaning or arbitrary lossless information. The declared learned-threat scalar succeeds.

This supplies a bounded regulatory-axis witness for Brief12.5-8. It does **not** establish
general psychological vector necessity. The earlier VER-C3-AFFECT-REDUCTION-001 result
remains intact: ScalarUncontrolled suffices for all14 existing retrieval cases. Different
consumers need not share one representation, and neither scalar equality retires the
other appraisal coordinates, factors, goals or belief owners.

## Source, receiver and native evidence

Two component source models execute64 fresh trajectories:8 declared conditions crossed
with all8 seeds. Each begins with empty learned history. A single instructed drug action
is physically inert; later instructed withholding is inert too. Real elapsed/consequence
biology continues under the existing constitution, with no resource/sleep drain or healing
in this controlled fixture. First-consequence sensory pain bias600 is the admitted false
harm report; current sensing2 is ordinary. This is lawful fallible sensing, not truth
readback or a supplied emotion label. The biological initial state is not a dummy axis.

All **832 complete component prefixes** restore exact original save bytes and immediate
successors:768 advancing/64 terminal. Five receiving models define320 frozen substitution
trials, each run twice:640 exact receiving executions with input immutability checks.
Every model/run/experiment/comparison identity and transitive source/test/contract hash
was frozen before qualification. Receiving trials are not320 additional full-runtime
replay qualifications, and no entire future tail is claimed after every prefix.

The substitution boundary is consequence3. The unchanged actual advanceBiology function
receives a reduced packet, its lawful physical state/constitution, empty action input
and the already declared NoAppraisalImpulse switch. The receiver cannot access discarded
psychological history or a hidden source label. It uses the existing half-threat impulse
and compares complete physical state plus consequence terms against the full source.
The allowed physical arguments cannot rescue the primary collision: they also match.

Four fresh native public sentinels (NoHarm, FalseHarm, NoGoal, NoImpulse;seed0) execute
all12 instants, under two actual native model identities. All **48 native instants**
match component appraisals, beliefs, goals/control, grounds, decisions/draws, receipts,
execution and physical consequences. **16 actual native Save132 restores** at0/2/3/12
pass exact save and immediate successor comparisons:12 advancing/4 terminal. Public
model/run identities and original bytes are prospectively bound through the accepted
factory compilation. These are selected native prefixes, not832 native restore calls.
Existing typed sources, scheduling and state owners are unchanged; wrapper54/57 stays.

Five focused tests, all328 reference tests and a fresh build pass. Tests cover exact
matched histories, strictly later feedback, goal/evidence controls, hidden observer
invariance, decisive prefix replay and two precommit fault sites. No production source
changed and no failed development/qualification cohort occurred. Earlier biological,
affect-reduction and personal-loss evidence is preserved without reclassifying it as
freshly rerun behavioral evidence.

## Results and preserved comparators

| Receiving projection | Exact full source consequences preserved |
|---|---|
'''+table+'''

All three body projections fail FalseHarm in all8 seeds. ScalarPain also fails HiddenB:
hidden damage does not manufacture an admitted threat signal in the original receiver.
Their other equalities remain valid; the experiment does not select a universal law.
FullAffect and ScalarThreat agree in all64 cases, including unknown-versus-known-zero
inputs that both currently produce no impulse. ScalarThreat retains null versus0 in
its packet even though this particular consumer gives both the same physical result.

NoGoal preserves the primary learned harm history and physical prehistory but gives
threat0. DeniedHarm and NoReceipt retain unknown harm/threat rather than treating missing
evidence as a negative sample. NoImpulse retains threat270 at2 but preserves the complete
NoHarm physical trajectory through12, confirming the old feedback edge's causal role.
HiddenA/HiddenB differ in initial damage0/200 with all sensing denied; their complete
component observer histories match. All64 sources retain the same instructed action
sequence; no free-choice difference or stochastic necessity is claimed. All seeds remain.

## Local disposition and transfer

The experiment reuses an independently qualified downstream consumer: appraisal-to-stress
feedback. No new exposure-sensitive consumer, affect state, regulatory axis or causal edge
was invented to force a desired result. Biological state, safe sensing, learned harm,
current goal relevance, threat and later bodily regulation remain separately accountable.

The first impulse and all subsequent feedback remain the existing candidate law. Sensory
bias, instructed inert action, fixed constitutional calibration,12-step horizon and a
controlled protective goal bound the claim. No clinical chemistry, natural testimony,
general emotional basis, minimal dimensionality, universal gain law, compressed learned
history or arbitrary scalar impossibility is qualified. A model permitted to read belief
and goals is not the body-only reduction tested here. A stronger psychological-necessity
claim remains CONDITIONAL and must earn its own independently motivated experiment.

AuditREV111 promotes only Brief12.5-8: **132 bounded /0 partial /0 blocked** clauses,
106 named verdicts. This completes bounded clause coverage, not Campaign3 exit or the
wider15-family scope. Corpus0.29.0/21 and native wrapper54/57 remain unchanged;1508/0.
RO002/003/006/007/008/010/011/019/020/021 preserve the successes, failures and limits.
No obligation automatically closes. RO019 ACTIVE;RO021 historical gate unsatisfied;
RO022 CLOSED only for its existing inventory. Campaign3 remains NOT EXIT-READY.

Next CAMPAIGN3_EXIT_RECONCILIATION_READINESS.md: freeze the canonical history universe,
extract and reconcile findings independently of the RO registry, and review corpus,
family and component/public admission obligations before final exit. No owner ruling.
'''
write(p/'CAMPAIGN3_AFFECT_REGULATORY_QUALIFICATION.md',report)
summary='''VER-C3-AFFECT-REGULATORY-001: bounded body-only regulatory reduction QUALIFIED.
64 fresh component runs/832 original-prefix restores;320 substitutions/640 executions;
4 native public sentinels/48 matching instants/16 Save132 restores;5+328 tests/build.
Identical whole body history/current sensations, different admitted harm belief produce
threat0/270 and later stress0/135. FullAffect/ScalarThreat preserve64/64;Stress56/64,
Pain48/64,RewardDeviation56/64. Preserve scalar successes and unchanged actions.
No new production mechanism or psychological vector-necessity claim. AuditREV111:
132 bounded/0 partial/0 blocked;106 verdicts. Bounded clause coverage complete;Campaign3
NOT EXIT-READY. Counters1508/0;corpus0.29.0/21;wrappers54/57 unchanged. RO019 ACTIVE;
RO021 historical reconciliation unsatisfied;RO022 CLOSED. No owner ruling.
Start CAMPAIGN3_AFFECT_REGULATORY_QUALIFICATION.md;next
CAMPAIGN3_EXIT_RECONCILIATION_READINESS.md.'''
with (p/'VERDICT_LEDGER.md').open('a',encoding='utf-8',newline='\n') as f:f.write('\n\n## `VER-C3-AFFECT-REGULATORY-001` — bounded body-only regulatory reduction (2026-10-03)\n\nQUALIFIED BOUNDED / LOCAL DISPOSITION.\n'+summary+'\nEvidence: AFFECT_REGULATORY_RESULT_REV1.json and AFFECT_REGULATORY_CLOSURE_REV1.json.\nRO-C3-002/003/006/007/008/010/011/019/020/021. Only Brief12.5-8 promoted.\n')
for dest in [p/'SEAM_LEDGER.md',p/'CAMPAIGN3_EXIT_AUDIT_2026_09_21.md',Path('CharacterLab — Reference Architecture Build & Research Campaign Plan.md')]:
 with dest.open('a',encoding='utf-8',newline='\n') as f:f.write('\n\n## Bounded affect regulatory reduction closure — 2026-10-03\n\n'+summary+'\n')
current=p/'CURRENT.md'
with (p/'CAMPAIGN3_LOG.md').open('ab') as f:f.write(b'\n\n'+current.read_bytes())
write(current,'''# Current research entry point

**Updated2026-10-03. Replace this index; chronology belongs in CAMPAIGN3_LOG.md.**

**Bounded Brief clause coverage complete; Campaign3 NOT EXIT-READY.**

| Counter | Value |
|---|---|
| Highest permanently allocated record type | **1508** |
| Allocated since last verdict/corpus member | **0** |
| Research obligations | **1 active / 19 conditional / 0 unowned** |
| Closed obligations | **2: RO-C3-018 /RO-C3-022** |
| Corpus /named verdict entries | **0.29.0 -21 members /106 verdicts** |
| Brief clauses /families | **132 /15** |
| Brief clause dispositions | **132 bounded /0 partial /0 blocked** |
| Public wrapper inventory | **54 producers /57 factories; unchanged** |

'''+summary+'''

All execution jobs finished; do not relaunch prior matrices. Psychological scalar
necessity remains conditional despite body-only failure. Do not begin Campaign4
ranking or declare whole-campaign PASS before final history/corpus/family review.
Prior index-format and verbatim-log whitespace findings remain preserved unchanged.
''')
a=Path('AGENTS.md');s=a.read_text(encoding='utf-8');s=s.replace('**Current routing (2026-10-03):** VER-C3-LONGITUDINAL-LOSS-001','**Prior routing (2026-10-03):** VER-C3-LONGITUDINAL-LOSS-001',1);s=s.replace('## Active direction\n','## Active direction\n\n**Current routing (2026-10-03):** '+summary+'\n',1);write(a,s)
registry=p/'RESEARCH_OBLIGATIONS.json';ro=json.loads(registry.read_text(encoding='utf-8'));obs=['RO-C3-'+str(n).zfill(3) for n in [2,3,6,7,8,10,11,19,20,21]];verdict='VER-C3-AFFECT-REGULATORY-001';ro['verdictReviews'].append({'verdict':verdict,'obligations':obs})
reports=['docs/formal/AFFECT_REGULATORY_REDUCTION_CONTRACT.md']+['docs/planning/'+n for n in ['CAMPAIGN3_AFFECT_REGULATORY_QUALIFICATION.md','AFFECT_REGULATORY_PLAN_REV1.json','AFFECT_REGULATORY_RESULT_REV1.json','AFFECT_REGULATORY_CLOSURE_REV1.json']]
for name in reports:ro['reportReviews'].append({'path':name,'obligations':obs})
nextpath='docs/planning/CAMPAIGN3_EXIT_RECONCILIATION_READINESS.md';nextobs=['RO-C3-'+str(n).zfill(3) for n in [19,20,21,22]];ro['reportReviews'].append({'path':nextpath,'obligations':nextobs})
for o in ro['obligations']:
 if o['id'] in obs:
  if verdict not in o['verdicts']:o['verdicts'].append(verdict)
  for name in reports:
   if name not in o['evidence']:o['evidence'].append(name)
 if o['id'] in nextobs and nextpath not in o['evidence']:o['evidence'].append(nextpath)
 if o['id'] in ['RO-C3-008','RO-C3-011','RO-C3-019']:
  o['established']+=' VER-C3-AFFECT-REGULATORY-001 rejects body-only reduction under identical full body history/current sensing but different admitted harm belief, through the existing delayed stress consumer.64 source runs/832 component restores;320 substitutions/640 executions;4 native sentinels/48 instants/16 Save132 restores;5+328 tests/build. ScalarThreat preserves64/64 and prior ScalarUncontrolled retrieval equality remains. Brief12.5-8 bounded;132 bounded clauses is not whole Campaign3 exit.'
  o['unresolved']+=' General psychological dimensional necessity, arbitrary scalar impossibility, natural sensing, universal feedback/calibration and lifetime scope remain unearned. Body-only projection excludes belief/goals; a contextual learned-threat scalar is a different successful competitor. RO019 remains active for final corpus/family/native-scope dispositions;RO021 canonical history reconciliation still mandatory.'
write(registry,json.dumps(ro,ensure_ascii=False,indent=2)+'\n')
audit=Path('scripts/check-campaign3-exit-audit.mjs');s=audit.read_text(encoding='utf-8');s=s.replace("const output=p+'CAMPAIGN3_EXIT_AUDIT_REV110.json';","const output=p+'CAMPAIGN3_EXIT_AUDIT_REV111.json';").replace('result.snapshotRevision=110;','result.snapshotRevision=111;')
s=s.replace("result.predecessor={path:p+'CAMPAIGN3_EXIT_AUDIT_REV109.json',sha256:sha(p+'CAMPAIGN3_EXIT_AUDIT_REV109.json'),disposition:'Bounded habit/relearning closure;130 bounded/2 partial/0 blocked;104 verdicts;1508/0.'};","result.predecessor={path:p+'CAMPAIGN3_EXIT_AUDIT_REV110.json',sha256:sha(p+'CAMPAIGN3_EXIT_AUDIT_REV110.json'),disposition:'Bounded personal-loss closure;131 bounded/1 partial/0 blocked;105 verdicts;1508/0.'};")
addition="""// REV111: bounded regulatory-axis reduction failure; cognitive scalar sufficiency preserved.
{const c=families[4].clauses[7];c.status=Q;c.evidence.push(p+'CAMPAIGN3_AFFECT_REGULATORY_QUALIFICATION.md',p+'AFFECT_REGULATORY_CLOSURE_REV1.json');c.obligations=[...new Set([...c.obligations,...[2,3,6,7,8,10,11,19,20,21].map(ro)])];c.rationale='REV111 bounded-qualified body-only regulatory reduction failure:identical full physical history/current sensation with different admitted harm evidence produces threat0/270 and strictly later stress0/135 through existing feedback.64 source runs/832 exact component prefixes;320 substitutions/640 repeated receivers;4 native sentinels/48 matching instants/16 Save132 restores;5+328 tests/build. FullAffect/ScalarThreat64/64;Stress56/64,Pain48/64,RewardDeviation56/64. No new consumer or production mechanism. Prior ScalarUncontrolled retrieval equality retained. This qualifies regulatory-state insufficiency,not general psychological vector necessity or arbitrary scalar impossibility. Controlled inert instructions/sensing/calibration;unchanged choices. Wider claims conditional;history/corpus/family exit gates remain.';}
supplemental.push('CAMPAIGN3_AFFECT_REGULATORY_QUALIFICATION.md','AFFECT_REGULATORY_CLOSURE_REV1.json','AFFECT_REGULATORY_PLAN_REV1.json','AFFECT_REGULATORY_RESULT_REV1.json','AFFECT_REGULATORY_BUILD_REV1.json','CAMPAIGN3_EXIT_RECONCILIATION_READINESS.md');
"""
assert 'const inventory=[' in s;s=s.replace('const inventory=[',addition+'const inventory=[',1);write(audit,s)
print(summary)
