"""Review both interference packages without merging their replay surfaces."""
from pathlib import Path
import json,hashlib,subprocess,copy
from fractions import Fraction as F
P=Path('docs/planning');O=P/'campaign3-history-interference-expectation-rev1';B=P/'campaign3-history-universe-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def walk(v,p=''):
 if isinstance(v,dict):
  for k,x in v.items():yield from walk(x,p+'/'+k)
 elif isinstance(v,list):
  for i,x in enumerate(v):yield from walk(x,p+'/'+str(i))
 elif isinstance(v,str):yield p,v
specs={}
def add(n,j):specs[(P/n).as_posix()]=j
specs['docs/formal/INTERFERENCE_EXPECTATION_COMPONENT_CONTRACT.md']='Accepted interference-expectation0.1: actual agency0.3 public observer A evidence, explicit route and current goal. Observed outcome establishes opportunity, not interference polarity. Unique source mean within each episode, then equal episode weights; prior completed learning before current updates. Four laws, source-bound identities, separate producer/component replay; no combined native wrapper.'
add('INTERFERENCE_EXPECTATION_READINESS.md','Prospective gap: episode-local attribution and alternative diagnosis do not earn across-attempt expectation. Requires actual distinct attempts and safe grouping, opportunity denominator, missing/negative distinction, duplicate controls and real later consumer. Readiness is not execution; later package earns only controlled grouping and appraisal.')
add('CAMPAIGN3_INTERFERENCE_EXPECTATION_QUALIFICATION.md','VER-C3-INTERFERENCE-EXPECTATION-001: primary plus successor4 models60 comparisons540 component prefixes;12 deduplicated native sources108 prefixes. Main positive/positive/negative gives2/3 vsLatest0; no new expectation-driven choice. Preserve initial missing denied pair and primary terminal-report coverage limitation. Fixed limited competence makes all attempts fail independently of blocker; this is not necessary-cause identification.')
add('INTERFERENCE_EXPECTATION_SUCCESSOR_CONTROL.md','Prospectively separate correction to coverage: primary terminal8 duplicate/repeat reports prove stored support only, no later consumer. Move reports to7 and probe8 in two additional sources/eight comparisons, same four component models. Pooled2/4 is diagnostic arithmetic, not a qualified runtime competitor. Do not rewrite primary plans or results.')
add('INTERFERENCE_EXPECTATION_SOURCE_PLAN_REV1.json','Preserved initial12-case source plan before discovery of missing changed-denied pair. Artifacts resolve through exact development archives. No source result had yet executed; not a failed behavioral cohort or final13-case qualification.')
add('INTERFERENCE_EXPECTATION_SOURCE_PLAN_REV2.json','Final13 cases10 unique native source identities freshly reconstruct from original inputs, seed and agency recipe. Route/goal cases alias producers and are not distinct native runs. Sources froze before execution; component freezes occur after actual views exist.')
for pre,native,comparisons,prefixes in [('',10,52,468),('SUCCESSOR_',2,8,72)]:
 if pre:add('INTERFERENCE_EXPECTATION_'+pre+'SOURCE_PLAN_REV1.json','Two separately frozen native originals reconstruct; report moved before final probe. Same producer recipe, new inputs, no earlier source-plan mutation.')
 add('INTERFERENCE_EXPECTATION_'+pre+'SOURCE_RESULT_REV1.json',f'Fresh{native} native source runs/{native*9} complete prefixes, eight views each and immutable actual intent/expression history. Whole original receipt reproduced; saved RNG/source decisions preserved. Not a native expectation runtime.')
 add('INTERFERENCE_EXPECTATION_'+pre+'PLAN_REV1.json',f'Fresh canonical four model/{comparisons} source-bound run/experiment/comparison identities and original exact public-view inputs reconstruct. Successor models equal primary; input identity includes lineage even where safe frames coincide.')
 add('INTERFERENCE_EXPECTATION_'+pre+'RESULT_REV1.json',f'Whole original{comparisons} component results/{prefixes} prefixes freshly reproduced. One successor per prefix; no full tails. Independent prior-state row calculations use decoded actual public observations, route, goal and per-episode/source identity, not hidden world or source episode knowledge.')
 add('INTERFERENCE_EXPECTATION_'+pre+'BUILD_REV1.json','Historical PASS/exit0 with bound source hashes and reported completed process; not raw build log or fresh build. Source/component matrix is a separate gate.')
add('INTERFERENCE_EXPECTATION_CLOSURE_REV1.json','Original read-only checker freshly passes both packages, source aliases, exact view bindings, same models, prior intents/expressions, development archives and historical tests/build. No combined scheduler/public admission or new wrapper claim.')
for name,n in [('TESTS_REV1',16),('TESTS_REV2',17),('SUCCESSOR_TESTS_REV1',1),('REFERENCE_TESTS_REV1',328)]:add('INTERFERENCE_EXPECTATION_'+name+'.json',f'Historical{n} passing assertion leaves, authenticated not rerun. Initial16 is preserved; corrected17 includes changed-denied pair, separate successor1 gives18 distinct focused tests. No double counting repeated factor/reference tests as new behavioral qualification.')
add('interference-expectation-development-rev1/PRESERVATION.json','Seven immutable archives preserve initial contract/component/fixture/test/harness/12-case plan/16-test receipt. Missing changed-denied pair discovered before source execution despite passing tests/build; final component body unchanged.')
add('interference-expectation-development-rev1/INTERFERENCE_EXPECTATION_COMPONENT_CONTRACT.md','Superseded initial12-case contract, preserved before adding paired denied-content case. Grouping/update law unchanged; final13-case contract supplies missing coverage obligation.')
for name in ['SOURCE_PLAN','TESTS']:add(f'interference-expectation-development-rev1/INTERFERENCE_EXPECTATION_{name}_REV1.json','Exact duplicate archived initial plan/test receipt; not extra cases or independent test confirmation. First cohort remains insufficient for final denied-pair scope.')
prior={x['path']:x for x in load(P/'campaign3-history-source-roles-rev122/index.json')['roleAssignments']};assert not set(specs)&set(prior)
output=subprocess.check_output(['node','scripts/check-interference-expectation-closure.mjs'],text=True).strip()
preserved=[]
for a in load(P/'interference-expectation-development-rev1/PRESERVATION.json')['artifacts']:
 assert ref(a['path'])['sha256']==a['sha256'];preserved.append(ref(a['path']))
assert (P/'interference-expectation-development-rev1/interferenceExpectation.ts').read_bytes()==Path('src/campaign3/interferenceExpectation.ts').read_bytes()
for name in ['SOURCE_PLAN','TESTS']:assert load(P/f'INTERFERENCE_EXPECTATION_{name}_REV1.json')==load(P/f'interference-expectation-development-rev1/INTERFERENCE_EXPECTATION_{name}_REV1.json')
old=load(P/'INTERFERENCE_EXPECTATION_SOURCE_PLAN_REV1.json');new=load(P/'INTERFERENCE_EXPECTATION_SOURCE_PLAN_REV2.json');assert len(old['producers'])==12 and len(new['producers'])==13
assert all(x in new['producers'] for x in old['producers'])
for a in old['artifacts']:
 archived=P/'interference-expectation-development-rev1'/Path(a['path']).name;path=archived if archived.exists() else Path(a['path']);assert ref(path)['sha256']==a['sha256']
for name,n in [('TESTS_REV1',16),('TESTS_REV2',17),('SUCCESSOR_TESTS_REV1',1),('REFERENCE_TESTS_REV1',328)]:
 t=load(P/('INTERFERENCE_EXPECTATION_'+name+'.json'));leaves=[a for f in t['testResults'] for a in f['assertionResults']];assert t['success'] and t['numPassedTests']==len(leaves)==n and t['numFailedTests']==t['numPendingTests']==0 and all(a['status']=='passed' and not a['failureMessages'] for a in leaves)
for pre in ['', 'SUCCESSOR_']:
 b=load(P/f'INTERFERENCE_EXPECTATION_{pre}BUILD_REV1.json');assert b['status']=='PASS' and b['exitCode']==0
 for a in b['artifacts']:assert ref(a['path'])['sha256']==a['sha256']
decoded=load(O/'decoded-evidence.json');assert decoded['status']=='PASS'
for a in decoded['artifacts']:assert ref(a['path'])['sha256']==a['sha256']
sources={s['sourceIdentity']:s for s in decoded['sources']};assert len(sources)==12
for s in sources.values():assert ref(s['original']['path'])['sha256']==s['original']['sha256']
count=0;fmt=lambda x:f'{x.numerator}/{x.denominator}'
for pre in ['', 'SUCCESSOR_']:
 for suffix in [('SOURCE_PLAN_REV2' if not pre else 'SOURCE_PLAN_REV1'),'SOURCE_RESULT_REV1','PLAN_REV1','RESULT_REV1']:
  name=f'INTERFERENCE_EXPECTATION_{pre}{suffix}.json';receipt=load(O/name);assert receipt['status']=='PASS' and ref(P/name)['sha256']==receipt['originalSha256'];assert ref('scripts/replay-history-interference-expectation'+('-successor' if pre else '')+'.mjs')['sha256']==receipt['checkerSha256']
 plan=load(P/f'INTERFERENCE_EXPECTATION_{pre}PLAN_REV1.json');result=load(P/f'INTERFERENCE_EXPECTATION_{pre}RESULT_REV1.json')
 for case,res in zip(plan['runs'],result['results']):
  episodes=[];seen=[];rows=[];law=case['law']
  for i,(frame,observations,row) in enumerate(zip(case['frames'],sources[case['sourceIdentity']]['frames'],res['safe']['rows'])):
   eligible=[e for e in episodes if frame['context'] is not None and e['context']==frame['context'] and e['support']]
   values=[F(sum(s['positive'] for s in e['support']),len(e['support'])) for e in eligible]
   estimate=None if not values or law in ['EpisodeOnly','NoLearning'] else values[-1] if law=='LatestEpisode' else sum(values,F(0))/len(values)
   expected=dict(at=i+1,context=frame['context'],goal=frame['goal'],eligible=len(eligible),expectation=fmt(estimate) if estimate is not None else None,affect=[fmt(estimate*frame['goal'])]*2 if estimate is not None else None)
   assert row==expected;rows.append(expected)
   for o in observations:
    if o['id'] in seen:continue
    seen.append(o['id']);episode=next((e for e in episodes if e['key']==o['episode']),None)
    if o['kind']==1 and episode is None:episode=dict(key=o['episode'],context=frame['context'],order=len(episodes),support=[]);episodes.append(episode)
    if o['kind']!=1 and episode is not None and law!='NoLearning' and not any(s['source']==o['source'] for s in episode['support']):episode['support'].append(dict(source=o['source'],positive=o['positive']))
   count+=1
  assert res['safe']==dict(prefix=8,episodes=episodes,seen=seen,rows=rows)
assert count==480
entries={e['path']:e for e in load(B/'manifest.json')['entries']};roles=[];strings={}
chain=[ref(x) for x in sorted(O.glob('*.json')) if x.name not in ['review.json','check.json']]+[ref(p) for p in ['scripts/replay-history-interference-expectation.mjs','scripts/replay-history-interference-expectation-successor.mjs','scripts/decode-history-interference-evidence.mjs','scripts/check-interference-expectation-closure.mjs','src/campaign3/interferenceExpectation.ts']]
for p,j in specs.items():
 assert ref(p)['sha256']==entries[p]['sha256'];roles.append(dict(**ref(p),role='INTERFERENCE EXPECTATION AUTHORITY / SOURCE / COMPONENT / COVERAGE FINDING',judgment=j,acceptanceChain=chain))
 if p.endswith('.json'):
  for ptr,text in walk(load(p)):strings[p,ptr]=text
rows=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in specs:continue
  assert u['sourceSha256']==entries[u['source']]['sha256'];ptr=u['location'].get('pointer','')
  if u['source'].endswith('.json'):assert strings[u['source'],ptr]==u['text']
  narrative=u['source'].endswith('.md') or ptr.startswith(('/status','/scope','/evidence','/finding')) or '/failureMessages/' in ptr
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],role='NARRATIVE AUTHORITY/FINDING' if narrative else 'TYPED EVIDENCE BACKING',judgment=specs[u['source']]))
obs=[f'RO-C3-{n:03}' for n in [10,11,14,19,20,21]]
r=dict(status='INTERFERENCE EXPECTATION SOURCES REVIEWED; HQ011 OPEN',sourceRoles=roles,rows=rows,stringLeaves=len(strings),preservedArtifacts=preserved,obligations=obs,independentArithmeticRows=count,originalCheckerOutput=output,limits=['Fresh12 native source runs108 prefixes and60 component comparisons540 prefixes; separate replay surfaces, no atomic combined native scheduler or full tails.','Native source identities deduplicated across primary and successor; route/goal aliases not new producers. All60 source-bound comparison identities retained even when safe frames coincide.','Observed outcome establishes opportunity, not obstruction; unsupported reports stay excluded and cannot recover absent context from hidden provenance.','Fixed competence makes failure occur with and without blocking; no necessary-cause, expectation-driven source choice or population claim.','Same-episode repeated source support is not another attempt; pooled2/4 remains arithmetic diagnostic, not qualified runtime competitor.','Primary terminal8 reports did not prove later appraisal; separate moved7/probe8 successor closes that bounded coverage gap without rewriting primary sources.','Initial12-case/16-test plan missed changed-denied pair despite passing tests/build; no failed behavioral result claimed. Component byte-identical across correction.','Historical18 distinct focused/328 reference tests and builds authenticated, not rerun. No new native wrapper, law or record allocation.'])
c=dict(status='PASS; HQ011 OPEN',sources=len(specs),originalNarrativeOccurrences=sum(x['role'].startswith('NARRATIVE') for x in rows),originalBackingOccurrences=sum(x['role'].startswith('TYPED') for x in rows),stringLeaves=len(strings),checker=ref(__file__))
for name,value in [('review.json',r),('check.json',c)]:
 path=O/name
 if path.exists():assert load(path)==value
 else:path.write_text(json.dumps(value,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
print(json.dumps(c))
