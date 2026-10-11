"""Final bounded exit disposition after Values qualification, with explicit delta review."""
from pathlib import Path
from collections import Counter
import hashlib,json
P=Path('docs/planning');O=P/'campaign3-values-exit-refresh-rev1'
def load(p):return json.loads(p.read_text(encoding='utf-8-sig'))
def sha(p):
 h=hashlib.sha256()
 with p.open('rb') as f:
  for b in iter(lambda:f.read(1024*1024),b''):h.update(b)
 return h.hexdigest()
def ref(p):return {'path':p.as_posix(),'sha256':sha(p)}
def save(p,x):
 assert not p.exists(),p
 p.write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
assert load(P/'values-integration-matrix-rev1/closure.json')['status']=='PASS'
assert (P/'CAMPAIGN3_VALUES_INTEGRATION_QUALIFICATION.md').exists()
assert not (O/'review.json').exists()
report=P/'CAMPAIGN3_VALUES_EXIT_REFRESH.md'
report.write_text('''# Campaign3 bounded exit acceptance — 2026-10-11

**LOCAL DISPOSITION: Campaign3 is EXIT-READY in its declared bounded research scope.**
This disposition is effective with campaign3-values-exit-refresh-rev1/validation.json
PASS. No architecture-owner ruling, law selection or mechanism retirement is required.

HQ011's accepted historical reconciliation and HQ012's exact21-member corpus and
15-family/132-clause review are retained. The three named HQ012 Values gaps now have
their own native experiment: physical outcomes versus admitted evidence; actual goal
fulfillment/retirement preserving Value; and later Value-relative appraisal. See
VER-C3-VALUES-INTEGRATION-001 and its5-model/125-run/625-prefix qualification.

The updated source inventory is enumerated independently of the RO registry under
the same canonical discovery domain as HQ012. Every delta has a scoped disposition;
the current registry is an output of that review, not the source selector. The current
source graph and exact public-model evidence are checked separately from document
discovery. Frozen earlier reports remain unchanged; changed append-only authorities
retain exact prior byte snapshots. The registry's mixed line-ending predecessor was
recovered by matching its earlier hash, not by asserting normalized bytes were equal.

The prior108-verdict prefix is preserved byte-for-byte and one new verdict appended.
Earlier mandatory corpus/family requirements are not rewritten. No new native BIO
seed-routing gate is invented: the accepted Campaign Plan already qualifies the
bounded composed early-decision/third-seed comparison. Refold equality is retained
research evidence, not a claim every control is behaviorally different. Component
comparisons remain components; this Values successor alone gains native qualification.

RO019's required bounded family/integration coverage and RO021's declared-universe
final reconciliation are CLOSED by retained distinctions and explicit evidence.
The18 other conditional obligations remain owned, including law selection, broader
causal/category acquisition, age-weighted Values and wider scaling. Zero active exit
gates does not mean zero unresolved scientific questions. RO022 covers the newly
checked56-producer/59-factory publication inventory.

All208 unavailable historical identities, including the74-version exit subset, retain
their per-claim restrictions. No missing bytes are treated as empty findings or used
to prove source-exact behavior. The owner's RESEARCH.md succession decision remains
effective; missing legacy-log recovery is not reintroduced as a gate. Failed and equal
cohorts, fixed forecasts/categories, finite horizons and original replay limits survive.

Counters1529/0;109 named/103 Campaign3 verdicts;132 bounded clauses;corpus0.29.0/21.
47 affected and328 reference tests, production build, full new native matrix, wrapper
extension and source/obligation checks pass. Older corpus checks are preserved and
their source relevance rechecked; they are not represented as fresh behavioral runs.

The next large work item is the dedicated inspection UI between Campaigns3 and4,
as the owner directed. This checkpoint starts neither UI implementation nor Campaign4
reduction ranking. The UI should expose truth/evidence/belief/appraisal/reasons/action
and ownership/replay distinctions without turning diagnostics into character evidence.
''',encoding='utf-8')
current=P/'CURRENT.md';before=current.read_bytes()
with (P/'CAMPAIGN3_LOG.md').open('ab') as f:f.write(b'\n\n<!-- Previous CURRENT before Values integration / final exit refresh -->\n'+before)
current.write_text('''# Current research entry point

**Updated2026-10-11. Replace this index; chronology belongs in CAMPAIGN3_LOG.md.**

**Campaign3 bounded exit acceptance; see the final validation receipt.**

| Counter | Value |
|---|---|
| Highest permanently allocated record type | **1529** |
| Allocated since last verdict/corpus member | **0** |
| Research obligations | **0 active / 18 conditional / 0 unowned** |
| Closed obligations | **4: RO-C3-018 /019 /021 /022** |
| Corpus /named verdict entries | **0.29.0 -21 members /109 verdicts** |
| Brief clauses /families | **132 /15** |
| Brief clause dispositions | **132 bounded /0 partial /0 blocked** |
| Public wrapper inventory | **56 producers /59 factories; extension checked** |

Start CAMPAIGN3_VALUES_INTEGRATION_QUALIFICATION.md and CAMPAIGN3_VALUES_EXIT_REFRESH.md.
VER-C3-VALUES-INTEGRATION-001 closes the three HQ012 Values integration gates:
5 profiles/125 runs/625 Save132 prefixes/6500 stages;47 affected/328 reference tests/build.
Physical outcome, admitted evidence, goal lifecycle, Value and later appraisal stay separate.
Stored/Refold and overlap equalities remain; no law selected or comparator retired.
The frozen phase41 test failure and corrected50 receipt both remain accounted.
Final acceptance is bound by campaign3-values-exit-refresh-rev1/validation.json.
HQ011 source restrictions, all18 conditional obligations and all21 corpus scopes survive.
Next dedicated inspection UI between Campaigns3 and4; no UI or reduction work started.
Counters1529/0; no owner ruling.
''',encoding='utf-8')
agents=Path('AGENTS.md');s=agents.read_text(encoding='utf-8');mark='## Active direction';assert mark in s
route='''

**Current routing (2026-10-11):** Values integrated native qualification COMPLETE;
Campaign3 bounded exit acceptance (final validation receipt required).
Start CURRENT.md, CAMPAIGN3_VALUES_INTEGRATION_QUALIFICATION.md and
CAMPAIGN3_VALUES_EXIT_REFRESH.md. VER-C3-VALUES-INTEGRATION-001:5 models/125 runs/
625 native prefixes/6500 stages;47 affected/328 reference tests/build;1529/0.
HQ012 outcome/evidence, actual goal lifecycle and Values-to-appraisal gaps closed.
56/59 wrapper inventory;109 verdicts;132 bounded clauses/21 corpus members retained.
RO019/021 CLOSED within declared bounded scope;18 conditional obligations remain.
No law selected, comparator retired, missing historical byte recovered by assumption,
or general category/forecast/age/scaling claim. Preserve test phase41/corrected50 cohorts.
Next dedicated inspection UI between Campaigns3 and4. No owner ruling or reduction work.
'''
s=s.replace('**Current routing (','**Prior routing (');s=s.replace(mark,mark+route,1);agents.write_text(s,encoding='utf-8')
with Path('CharacterLab — Reference Architecture Build & Research Campaign Plan.md').open('ab') as f:f.write('''

## Campaign3 bounded exit disposition — 2026-10-11
CAMPAIGN3_VALUES_EXIT_REFRESH.md and campaign3-values-exit-refresh-rev1/validation.json
record bounded exit acceptance after final source freshness and the three Values gates.
All21 corpus scopes/15 families/132 bounded clauses and18 conditional debts remain.
109 verdicts;1529/0;56/59 publication inventory. No law or comparator retired.
Dedicated inspection UI is next between Campaigns3 and4; reduction ranking is separate.
'''.encode('utf-8'))
rpath=P/'RESEARCH_OBLIGATIONS.json';r=load(rpath)
finalPaths=[report,O/'inventory.json',O/'review.json',O/'validation.json',O/'prior-sources.json',O/'registry-byte-recovery.json',*list((O/'prior-sources').glob('*'))]
for o in r['obligations']:
 if o['id'] in ['RO-C3-019','RO-C3-021']:
  o['status']='CLOSED';o['closure']={'disposition':'RETAINED_DISTINCTION','rationale':'HQ011 scoped historical reconciliation, HQ012 exact corpus/family dispositions and the new native Values integration discharge declared bounded exit gates. General laws, controls, excluded claims and all other conditional obligations remain. Final freshness validation binds this scope.','evidence':[report.as_posix(),(O/'review.json').as_posix(),(O/'validation.json').as_posix(),'docs/planning/values-integration-matrix-rev1/closure.json']}
  o['established']+=' Final2026-10-11 Values exit refresh closes the declared bounded coverage/history gate. Earlier ACTIVE/unsatisfied chronology is superseded only in that scope; future canonical changes require freshness review.'
  o['unresolved']+=' Final disposition2026-10-11: preceding gap descriptions are historical where explicitly discharged by VER-C3-VALUES-INTEGRATION-001 and CAMPAIGN3_VALUES_EXIT_REFRESH.md. General laws and wider unqualified claims remain conditional under named other obligations; no general scientific completion claim.'
known={x['path'] for x in r['reportReviews']}
for p in finalPaths:
 if p.as_posix() not in known:
  r['reportReviews'].append({'path':p.as_posix(),'obligations':['RO-C3-019','RO-C3-020','RO-C3-021']});known.add(p.as_posix())
  for o in r['obligations']:
   if o['id'] in ['RO-C3-019','RO-C3-020','RO-C3-021']:o['evidence'].append(p.as_posix())
rpath.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
base=P/'campaign3-hq012-freshness-rev1/inventory.json';old={e['path']:e for e in load(base)['entries']}
files=set(Path('.').glob('*.md'))
for folder in ['docs/planning','docs/formal','reference']:files.update(p for p in Path(folder).rglob('*') if p.is_file() and p.suffix.lower() in ['.md','.json'])
excluded=['docs/planning/campaign3-history-universe-rev1/',O.as_posix()+'/']
files=sorted(p for p in files if not any(p.as_posix().startswith(x) for x in excluded))
rows=[]
for p in files:
 row=ref(p);prior=old.get(row['path']);row['bytes']=p.stat().st_size;row['change']='ADDED' if prior is None else 'UNCHANGED' if prior['sha256']==row['sha256'] else 'CHANGED';rows.append(row)
missing=[k for k in old if not Path(k).exists()];assert not missing,missing
save(O/'inventory.json',{'status':'FROZEN CURRENT INVENTORY','baseline':ref(base),'selector':'Root Markdown and recursive docs/planning, docs/formal and reference Markdown/JSON, independent of RO registry. Original historical universe mirror and this terminal review bundle excluded; terminal files are explicitly bound by validation.','excludedPrefixes':excluded,'registryUsedForSelection':False,'entries':rows,'missing':missing,'counts':dict(Counter(x['change'] for x in rows))})
rules={
 'AGENTS.md':'Current routing replaces prior routing only; original route retained in prior-sources.',
 'docs/planning/CURRENT.md':'Current one-page exit projection; previous exact bytes appended to CAMPAIGN3_LOG.',
 'docs/planning/CAMPAIGN3_LOG.md':'Append-only current-index chronology; no new experimental authority.',
 'docs/planning/RESEARCH_OBLIGATIONS.json':'Reciprocal registration of new evidence and bounded closure of019/021;18 conditional debts retained.',
 'docs/planning/VERDICT_LEDGER.md':'One new bounded Values integration verdict; original108-verdict byte prefix preserved.',
 'CharacterLab — Reference Architecture Build & Research Campaign Plan.md':'Append-only accepted Values checkpoint/exit routing; corpus requirements unchanged.',
 'docs/formal/CANONICAL_RECORD_REGISTRY.md':'Ten successor records; exact prior mixed-line-ending snapshot retained. Textual prefix unchanged; CRLF normalization is not byte equality.',
 'docs/formal/VALUES_INTEGRATION_COMPONENT_CONTRACT.md':'Conservative prospective integration semantics; controlled reports/category, four laws and appraisal comparator retained.',
 'docs/formal/VALUES_INTEGRATION_PUBLIC_CONTRACT.md':'Native ownership/order/replay obligations; thirteen stages, no hidden truth read by cognition.',
 'docs/formal/VALUES_INTEGRATION_PUBLIC_ALLOCATION_TABLE.json':'1520..1529 allocation binds accepted contract; old types unchanged.',
 'docs/planning/CAMPAIGN3_VALUES_INTEGRATION_QUALIFICATION.md':'New bounded scientific qualification; outcome/evidence, lifecycle and appraisal findings linked to010/019/020/021/022.',
 'docs/planning/CAMPAIGN3_VALUES_EXIT_REFRESH.md':'Explicit bounded final disposition, conditional research debt and historical restrictions retained.',
 'docs/planning/VALUES_INTEGRATION_WRAPPER_EXTENSION_REV1.json':'Current56/59 inventory with earlier audit scopes preserved.',
 'docs/planning/CAMPAIGN3_HQ012_EXIT_REVIEW.md':'Prior review remains NOT EXIT-READY at that checkpoint; three gaps discharged only by new successor.',
 'docs/planning/VALUES_INTEGRATED_CLOSURE_WORK_ORDER.md':'Prospective work order now discharged in its declared bounded scope.'}
dispositions=[]
for x in rows:
 if x['change']=='UNCHANGED':continue
 p=x['path'];reason=rules.get(p)
 if reason is None:
  if p.startswith('docs/planning/values-integration-matrix-rev1/'):
   reason='Frozen exact model/run/source plan, full native replay result or independently checked comparison closure. All125 identities retained; per-run world is a component diagnostic.'
  elif p.startswith('docs/planning/values-integration-development-rev1/'):
   reason='Development/test evidence: preserve startup access failure, phase41 fixture rejection and exact corrected50 successor; no model identity or failed receipt rewritten.'
  elif any(p.startswith('docs/planning/'+n+'/') for n in ['campaign3-hq012-freshness-rev1','campaign3-hq012-corpus-checks-rev1','campaign3-hq012-exit-review-rev1']):
   reason='Prior HQ012 review bundle generated after its own inventory; accepted by its bound validation and exact corpus/family/three-gate report. Not a new psychological result.'
 assert reason is not None,('UNACCOUNTED_DELTA',p)
 dispositions.append({'source':x,'disposition':reason,'obligations':['RO-C3-019','RO-C3-020','RO-C3-021']})
prior=load(P/'campaign3-hq012-exit-review-rev1/open-gates.json')
save(O/'review.json',{'status':'BOUNDED CAMPAIGN3 EXIT ACCEPTED; VALIDATION REQUIRED','disposition':'LOCAL DISPOSITION; no law selection, reduction or owner ruling','inventory':ref(O/'inventory.json'),'priorReview':ref(P/'campaign3-hq012-exit-review-rev1/review.json'),'historyHandoff':ref(P/'campaign3-history-hq011-handoff-rev1/review.json'),'corpus':ref(P/'campaign3-hq012-exit-review-rev1/corpus.json'),'families':ref(P/'campaign3-hq012-exit-review-rev1/families.json'),'values':ref(P/'values-integration-matrix-rev1/closure.json'),'gates':[{'id':g['id'],'status':'CLOSED BOUNDED','evidence':ref(P/'CAMPAIGN3_VALUES_INTEGRATION_QUALIFICATION.md')} for g in prior['gates']],'deltaDispositions':dispositions,'pending':[],'sourceLimit':'208 unavailable versions/74 exit subset retain per-claim limits; legacy log successor follows owner decision. No unavailable identity supports a new exact-source claim.','retainedComparators':['Accumulated','Refold','Latest','NoConsolidation','NoValueAppraisal','NeedOnly','ValuesOnly','Joint'],'scientificReview':'Separation of admitted evidence from actual consequences is behaviorally tested, not inferred from field rejection. Fulfillment and withdrawal have owned terminal identities. Value appraisal does not become a reason or own goals. Refold equality and Need overlap constrain necessity claims; binary forecasts/category/age/generalization remain unqualified. Earlier exact corpus and15-family dispositions are unchanged.','counts':{'corpus':21,'families':15,'clauses':132,'verdicts':109,'campaign3Verdicts':103,'producers':56,'factories':59,'active':0,'conditional':18,'closed':4,'unowned':0,'highestAllocated':1529,'sinceVerdict':0},'checker':ref(Path('scripts/check-values-exit-refresh.py'))})
print(json.dumps({'frozen':len(rows),'counts':dict(Counter(x['change'] for x in rows)),'deltaDispositions':len(dispositions),'pending':0}))
