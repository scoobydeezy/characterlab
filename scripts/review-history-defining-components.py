"""Whole component claim spine and preserved development findings."""
from pathlib import Path
import json,hashlib,subprocess
P=Path('docs/planning');B=P/'campaign3-history-universe-rev1';O=P/'campaign3-history-defining-components-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def ref(p):return dict(path=Path(p).as_posix(),sha256=sha(p))
def save(p,v):
 if p.exists():assert load(p)==v,p
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
specs={
 'docs/planning/CAMPAIGN3_DEFINING_MEMORY_BRIDGE_QUALIFICATION.md':'4 laws/288 cases/864 repeated component stages, not native restores. Actual GA37/38 acquisition, equal content/time/use with only earned significance admission differing. SignificanceFirst wins under capacity1; three simpler laws coincide and remain. Capacity8 retention is not recall; absent cue/no read, capacity0/no archive fallback, unrelated cue may still recall. Idle40/400/4000 not active horizon. No different-goal, exact-use, later-report or standing experiment in this bridge.13/328 historical tests; no full clause promotion.',
 'docs/planning/CAMPAIGN3_DEFINING_MEANING_QUALIFICATION.md':'4 laws/68 cases/308 component stages;15 new/28 affected/328 reference. Same actual GA37 evidence re-attributed, not GA38 significance injection. High progress/Low deterioration both protect; Wide neutral/Absent unavailable. Three rehearsals each16 publications/uses and8 event presentations. Later report changes current interpretation, not old payload/credit; lost events stay lost.12 pass/3 failed uncertainty expectations preserved. Native qualification came later; no source trust, narrative self or general importance revision.',
 'docs/planning/DEFINING_MEMORY_BRIDGE_FINDINGS.md':'Earlier roomy GA equality and LONG/recollection exclusions cannot qualify defining episode retrieval. Tight capacity discriminates separate significance tier only boundedly. Three simpler laws still coincide. No significance accessibility bonus or invented positive-score threshold; unrelated cue can recall. First13 tests failed Set/List admission before psychological assertions; unused earlier helper tsc failure has no claimed receipt. Broader goal/meaning/native gates were still open.',
 'docs/planning/DEFINING_MEANING_FINDINGS.md':'Later interpretation goal does not rewrite assessment6. Supported16-child join and original endpoint attribution precede significance. Rehearsal body key child is an operation-local alias, not recognition channel. Equal uncertain9..10 ranges imply IndeterminateRelation, unlike Wide known zero distances; absent/missing distinct. False/contrary report cannot rewrite history or recreate loss. Monotone historical direction credit is not a general current-importance law. No standing/self-belief route, trust learning or ordinary consolidation.',
 'docs/formal/DEFINING_MEMORY_EXPERIMENT_CONTRACT.md':'Accepted composed candidate over frozen GA. Only memory630/graph631/presentation632 cross into continuation; retained child bytes copied, no researcher target or archive fallback. Withheld join is explicit component intervention, not new source authority. Four laws,join0/1,capacity0/1/4/8,times40/400/4000,cues matching/absent/unrelated yield288. Recall beta0/scale100/lambda1/exponent1/omegaB1/omegaA1/k1 with empty graph; zero-score ranking retained. Three component stages, not Save132. Metadata is preserved even when a law ignores it.',
 'docs/formal/DEFINING_MEANING_CONTRACT.md':'GA37 actual recalled/attributed sources only. Adopt goal38,domain0..100,expiry5001; supported targets earn direction before retention42. Real rehearsal39/40/41 and consumed-address use; no count from use bit. Later independent report43 cannot replace episode. Recall50/400/4000 from retained evidence/history only; no importance access bonus. Compact discriminating68 roster, not full domain product. Historical credit separate from current interpretation; no identity route or native claim.',
 'docs/planning/DEFINING_MEMORY_READINESS.md':'Historical planning intake after embarrassment. Required old acquired episode and later cognitive consequence; identity standing/archive existence/frequent access do not substitute for recollection/significance. Requested age/use/meaning/later-evidence/standing comparisons guide scope but are not all claimed executed. Later bounded public closure does not supply the still-unearned standing-to-importance intervention or autobiography. Escalation and corpus/history obligations remain.',
 'docs/planning/DEFINING_MEMORY_INTEGRATION_READINESS.md':'Bridge-to-meaning work order requires independently goal-relative meaning rather than withheld bit. Separate content/report/credit/appraisal/use/standing and forbid invented significance recall bonus. Native scheduler/save explicitly owed after components. Later meaning/public results discharge bounded immediate gates; no general standing or current-importance law. Historical1484/0 and52/55 are not current status.',
 'docs/planning/DEFINING_MEMORY_PUBLIC_READINESS.md':'Native gate after68 component cases; empty-S0 original lineage, owned transitions, actual Save132 and publication extension required. No wrapping a component around a save or injecting research memory. Preserve exact uncertainty/absence/loss/use controls and four laws. Do not invent identity-derived importance to justify defining. Later public qualification supersedes OPEN routing without erasing component/public distinction.',
 'docs/planning/defining-memory-development-rev1/PRESERVATION.json':'Canonical Set/List adapter mismatch rejected13 tests before psychological assertions. Exact archived source/test/contract/receipt identities preserved. Earlier unused helper typecheck failed before tests, no behavioral receipt claimed.',
 'docs/planning/defining-meaning-development-rev1/PRESERVATION.json':'12 passes/3 failures exposed incorrect SameDistance expectation for uncertain intervals. Corrected tests preserve mathematics. Readonly test mutation and earlier syntax/import/type annotations are separate pre-behavioral fixes, not hidden scientific cohorts.'
}
O.mkdir(exist_ok=True);cp=O/'commands.json'
if not cp.exists():
 r=subprocess.run(['node','scripts/check-defining-meaning.mjs'],capture_output=True,text=True);assert r.returncode==0,(r.stdout,r.stderr)
 save(cp,dict(command='node scripts/check-defining-meaning.mjs',exitCode=r.returncode,stdout=r.stdout,stderr=r.stderr,checker=ref('scripts/check-defining-meaning.mjs'),scope='Read-only stored bridge and meaning closure checks; no new component execution, tests or build.'))
entries={x['path']:x for x in load(B/'manifest.json')['entries']};bindings=[]
for n in ['DEFINING_MEMORY_BRIDGE_CLOSURE_REV1.json','DEFINING_MEANING_CLOSURE_REV1.json']:
 for a in load(P/n)['files']:assert sha(a['path'])==a['sha256'];bindings.append(a)
archiveBindings=[]
for n in ['defining-memory-development-rev1','defining-meaning-development-rev1']:
 v=load(P/n/'PRESERVATION.json');assert set(v)=={'finding','files'}
 for a in v['files']:assert set(a)=={'original','path','sha256'} and sha(a['path'])==a['sha256'];archiveBindings.append(a)
roles=[]
for p,j in specs.items():
 assert sha(p)==entries[p]['sha256'];roles.append(dict(**ref(p),role='WHOLE COMPONENT CLAIM / CONTRACT / FINDING',judgment=j,acceptanceChain=[ref(P/'DEFINING_MEMORY_BRIDGE_CLOSURE_REV1.json'),ref(P/'DEFINING_MEANING_CLOSURE_REV1.json'),ref(cp),ref(P/'CAMPAIGN3_DEFINING_PUBLIC_QUALIFICATION.md')]))
rows=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in specs:continue
  assert u['sourceSha256']==entries[u['source']]['sha256']
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],role='SCOPED CLAIM / FINDING / HISTORICAL ROUTING',judgment=specs[u['source']]))
obs=['RO-C3-005','RO-C3-006','RO-C3-007','RO-C3-009','RO-C3-010','RO-C3-019','RO-C3-020','RO-C3-021','RO-C3-022']
save(O/'review.json',dict(status='11 DEFINING COMPONENT SOURCES RECONCILED; HQ011 OPEN',sourceRoles=roles,rows=rows,archiveBindings=archiveBindings,obligations=obs,limits=['Later native closure does not retroactively execute every intake suggestion: standing-to-importance, genuine consolidation and active long horizons remain unearned.','Exact referenced archives and result bindings are not whole transitive schema review; test and component result schemas retain separate work.','Current report does not revise monotone historical credit in this candidate; no importance-update law selected.']))
c=dict(status='PASS; HQ011 OPEN',sources=len(roles),originalNarrativeOccurrences=len(rows),archiveBindings=len(archiveBindings),reviewSha256=sha(O/'review.json'),checkerSha256=sha(__file__))
save(O/'check.json',c);print(json.dumps(c))
