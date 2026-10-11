from pathlib import Path
import json,hashlib
P=Path('docs/planning');O=P/'campaign3-history-grief-rev1';B=P/'campaign3-history-universe-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def walk(v,p=''):
 if isinstance(v,dict):
  for k,x in v.items():yield from walk(x,p+'/'+k)
 elif isinstance(v,list):
  for i,x in enumerate(v):yield from walk(x,p+'/'+str(i))
 elif isinstance(v,str):yield p,v
specs={'docs/formal/GRIEF_PUBLIC_CONTRACT.md': 'Accepted grief-public0.1: acquired Bond, observed absence, admitted future-contact estimate and practical utility independently represented. Loss=Bond*(1-presence)*(1-return), reunion uses return. Three report codes map0/half/1 without calibration; missing unknown. Six laws plus modifier-disabled comparator; prospective consumers only.', 'docs/planning/GRIEF_LOSS_READINESS.md': 'Prospective loss frontier requires belief-relative enduring separation versus temporary absence, history and substitute controls, false reports/correction and privacy. Does not demand clinical grief stages or new universal emotion owner.', 'docs/planning/CAMPAIGN3_GRIEF_QUALIFICATION.md': 'VER-C3-GRIEF-001:7 models31 runs279 prefixes248 advancing31 terminal;27/328 tests/build historical. Identical history with loss/uncertain/return yields loss1/half/0 and reunion0/half/1; keepsake probabilities7/9,47/72,1/2. False return report under fixed adverse truth revises later appraisal without rewriting history. All relationship clauses bounded separately, not joint integration.', 'docs/planning/GRIEF_IMPLEMENTATION_FINDINGS.md': 'No failed cohort overwritten. Absence does not establish permanent loss; missing report distinct from uncertainty/no-return. Report-only updates cannot enter support means/history; later support cannot erase future-contact estimate. Complementary arithmetic candidate only; adequate substitute removes utility not loss. All13 stages+commit during support update and3 report-only faults. No clinical stages, distress, actual mourning/search, universal history law or time-course claim.', 'docs/planning/GRIEF_PUBLIC_PLAN_REV1.json': 'Frozen7 models31 original run identities and exact source/contract/test/experiment/comparison bindings; controlled fallible future-contact testimony, not hidden death or natural recognition. No original writer rerun.', 'docs/planning/GRIEF_PUBLIC_RESULT_REV1.json': 'All31 rows and279 historical prefix checks authenticated against plan and four partitions. Fresh decoded stored assertions verify history, absence/report, substitute, correction, journal independence, unknown and whole later privacy. No new runtime replay.', 'docs/planning/GRIEF_CLOSURE_REV1.json': 'Original read-only closure freshly passes exact artifact/model/allocation and31-run/279-prefix/test/build commitments. Historical records1278..1291 namespace1182,1291/0. Integrity validation is not fresh simulation.', 'docs/planning/GRIEF_PRESERVATION_REV1.json': 'Three exact artifacts preserve first passing27 tests, semantic limitations and frozen model. Prior grief/mean learning remain controls; no precision/decay/saturation finding retired.', 'docs/planning/GRIEF_TESTS_REV1.json': 'Historical27 PASS assertions include13 stages+commit during real second support/history update and three report-only person-a/person-b/commit faults. Actual phases, authority and malformed input/model/save checks; finite coverage, not fresh tests.', 'docs/planning/GRIEF_REFERENCE_TESTS_REV1.json': 'Historical328 reference PASS leaves individually authenticated; test metadata is evidence backing, not new grief findings or fresh tests.', 'docs/planning/GRIEF_BUILD_REV1.json': 'Historical successful production build and exact artifact bindings, not fresh build or whole active-suite claim.', 'docs/planning/grief-public-workers-rev1/0.json': 'Worker0: exact modulo4 roster,31 total stored output/two observer views and aggregate hashes authenticated. Fresh original semantic assertions;279 runtime prefix restores remain historical. Whole later privacy includes common support; TruthOracle fails hidden-return boundary.', 'docs/planning/grief-public-workers-rev1/1.json': 'Worker1: exact modulo4 roster,31 total stored output/two observer views and aggregate hashes authenticated. Fresh original semantic assertions;279 runtime prefix restores remain historical. Whole later privacy includes common support; TruthOracle fails hidden-return boundary.', 'docs/planning/grief-public-workers-rev1/2.json': 'Worker2: exact modulo4 roster,31 total stored output/two observer views and aggregate hashes authenticated. Fresh original semantic assertions;279 runtime prefix restores remain historical. Whole later privacy includes common support; TruthOracle fails hidden-return boundary.', 'docs/planning/grief-public-workers-rev1/3.json': 'Worker3: exact modulo4 roster,31 total stored output/two observer views and aggregate hashes authenticated. Fresh original semantic assertions;279 runtime prefix restores remain historical. Whole later privacy includes common support; TruthOracle fails hidden-return boundary.'}
entries={e['path']:e for e in load(B/'manifest.json')['entries']};roles=[];strings={}
chain=[ref(O/'closure-check.json'),ref(O/'view-check.json'),ref(P/'GRIEF_CLOSURE_REV1.json'),ref('scripts/qualify-grief-public.mjs')]
for p,j in specs.items():
 assert ref(p)['sha256']==entries[p]['sha256'];roles.append(dict(**ref(p),role='GRIEF AUTHORITY / FINDING / TYPED EVIDENCE',judgment=j,acceptanceChain=chain))
 if p.endswith('.json'):
  for ptr,s in walk(load(p)):strings[p,ptr]=s
v=load(P/'GRIEF_PUBLIC_RESULT_REV1.json');plan=load(P/'GRIEF_PUBLIC_PLAN_REV1.json')
assert v['planSha256']==ref(P/'GRIEF_PUBLIC_PLAN_REV1.json')['sha256']
assert len(v['results'])==len(plan['runs'])==31 and sum(r['prefixes'] for r in v['results'])==279
for i,r in enumerate(v['results']):
 assert set(r)==set('law goal name modelIdentity runIdentity orderedInputs prefixes saveSha256 stateSha256 outputSha256 observerSha256'.split())
 for k,val in plan['runs'][i].items():assert r[k]==val
 assert len(r['observerSha256'])==2
for n,count in [('GRIEF_TESTS_REV1.json',27),('GRIEF_REFERENCE_TESTS_REV1.json',328)]:
 t=load(P/n);assert t['success'] and t['numPassedTests']==count
 leaves=[a for f in t['testResults'] for a in f['assertionResults']];assert len(leaves)==count and all(a['status']=='passed' and not a['failureMessages'] for a in leaves)
for a in load(P/'GRIEF_BUILD_REV1.json')['artifacts']:assert ref(a['path'])==a
for a in load(P/'GRIEF_PRESERVATION_REV1.json')['artifacts']:assert ref(a['path'])==a
rows=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in specs:continue
  assert u['sourceSha256']==entries[u['source']]['sha256'];ptr=u['location'].get('pointer','')
  if u['source'].endswith('.json'):assert strings[u['source'],ptr]==u['text']
  narrative=u['source'].endswith('.md') or '/failureMessages/' in ptr or ptr.startswith(('/status','/reason','/claims','/limits','/limitations','/error','/gates','/scope'))
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],role='NARRATIVE AUTHORITY/FINDING' if narrative else 'TYPED EVIDENCE BACKING',judgment=specs[u['source']]))
obs=['RO-C3-010','RO-C3-011','RO-C3-016','RO-C3-019','RO-C3-020','RO-C3-021']
v=dict(status='FIFTEEN GRIEF SOURCES REVIEWED; HQ011 OPEN',sourceRoles=roles,rows=rows,stringLeaves=len(strings),obligations=obs,limits=['Fresh31 stored-view contrasts, not31-run/279-prefix runtime replay or27/328 tests/build.','Absence, admitted future-contact belief, acquired Bond and utility remain separate; report0/half/1 uncalibrated.','False correction may mislead; prospective keepsake/reunion probabilities not enacted mourning/search.','No physiological distress, clinical stages, general time course, natural testimony/recognition or joint relationship-family integration.'])
for n,x in [('review.json',v),('check.json',dict(status='PASS; HQ011 OPEN',sources=len(specs),originalNarrativeOccurrences=sum(r['role'].startswith('NARRATIVE') for r in rows),originalBackingOccurrences=sum(r['role'].startswith('TYPED') for r in rows),stringLeaves=len(strings),checker=ref(__file__)))]:
 f=O/n
 if f.exists():assert load(f)==x
 else:f.write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
print(json.dumps(load(O/'check.json')))
