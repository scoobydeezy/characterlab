"""Whole historical importance-urgency authority and independent consequence/credit audit."""
from pathlib import Path
import json,hashlib,subprocess
from fractions import Fraction as F
P=Path('docs/planning');O=P/'campaign3-history-importance-urgency-rev1';B=P/'campaign3-history-universe-rev1'
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
specs['docs/formal/IMPORTANCE_URGENCY_COMPONENT_CONTRACT.md']='Accepted importance-urgency-component0.1: one adopted importance, current admitted urgency, same motive/options/efficacy/fixed competitor. Candidate residual product I*(1000+U)/2000; absent operands exclude current target ground. Five comparators, controlled source-first six frames, exact reason dice. No natural source/deadline inference, native admission or physical execution.'
add('CAMPAIGN3_IMPORTANCE_URGENCY_QUALIFICATION.md','VER-C3-IMPORTANCE-URGENCY-001 bounded component. Fresh5 models195 cases1365 prefixes; equal initial products diverge after common urgency0. Seven divergent full sequences and seed0 equality retained. Complete-history Refold exactly preserves safe behavior without cached importance. Rejects FrozenProduct only, not every scalar representation or universal motivational law.')
add('IMPORTANCE_URGENCY_PLAN_REV1.json','Whole canonical model/run/experiment/comparison plan freshly reconstructed: four crossed importance/urgency cases all five laws/eight seeds, seven controls all laws seed7.195 distinct identities, original artifact hashes and resolved dice/arbitration content. No new plan publication.')
add('IMPORTANCE_URGENCY_RESULT_REV1.json','Whole result freshly reproduced195 cases1365 prefixes1170 advancing195 terminal. Independent1170 adopted-history/current-urgency/strength rows and complete snapshots; addressed draws remain actual runtime evidence. One immediate successor per original-input restore, not every tail or native Save132.')
add('IMPORTANCE_URGENCY_CLOSURE_REV1.json','Original read-only closure freshly checks canonical identities, source hashes, complete results, hidden/denied safe equality,32 refold equalities and historical tests/build/preservation. No new native producer or law selected.')
add('IMPORTANCE_URGENCY_BUILD_REV1.json','Historical PASS/exit0 and exact artifact commitments; narrative records observed completed boundary/TypeScript/Vite process, not raw log or fresh build. Earlier test-only extra-field literal rejection separately preserved.')
add('IMPORTANCE_URGENCY_TESTS_REV1.json','Historical14 passing assertions:9 component plus5 existing choice-kernel. Tests cover independent factors, later collision, refold, absent/zero, hidden/denied ingress, all-law prefixes, two faults, overlap, copied strict inputs and forged/changed-original saves. Not freshly rerun.')
add('IMPORTANCE_URGENCY_REFERENCE_TESTS_REV1.json','Historical328 passing reference assertion leaves; authenticated not freshly rerun.')
add('IMPORTANCE_URGENCY_TESTS_DEV1.json','Initial14 passing tests after reported sandbox config startup denial. Passing runtime tests did not prevent later test-only TS2353 compile failure. No failed behavioral cohort or original frozen plan overwritten.')
add('importance-urgency-development-rev1/IMPORTANCE_URGENCY_TESTS_DEV1.json','Exact archived alias of initial passing14-test receipt, not an additional cohort or independent behavioral confirmation.')
add('importance-urgency-development-rev1/PRESERVATION.json','Five exact archives preserve initial component/fixture/test/harness/receipt. Three reported failures are startup permissions, test-only TS2353, and prefreeze ?raw import collector. Exact source comparison confirms only test declaration and loader-query stripping changed; component and fixtures unchanged. No seed/law/assertion substitution.')
prior={x['path']:x for x in load(P/'campaign3-history-source-roles-rev124/index.json')['roleAssignments']};assert not set(prior)&set(specs)
for name in ['identities','replay']:
 r=load(O/(name+'.json'));assert r['status']=='PASS' and ref(r['original'])['sha256']==r['originalSha256'] and ref('scripts/replay-history-importance-urgency.mjs')['sha256']==r['checkerSha256']
output=subprocess.check_output(['node','scripts/check-importance-urgency-closure.mjs'],text=True).strip()
plan=load(P/'IMPORTANCE_URGENCY_PLAN_REV1.json');result=load(P/'IMPORTANCE_URGENCY_RESULT_REV1.json')
for a in plan['artifacts']+load(P/'IMPORTANCE_URGENCY_CLOSURE_REV1.json')['artifacts']+load(P/'IMPORTANCE_URGENCY_BUILD_REV1.json')['artifacts']:assert ref(a['path'])['sha256']==a['sha256']
for name,n in [('TESTS_REV1',14),('TESTS_DEV1',14),('REFERENCE_TESTS_REV1',328)]:
 t=load(P/f'IMPORTANCE_URGENCY_{name}.json');leaves=[a for f in t['testResults'] for a in f['assertionResults']];assert t['success'] and t['numPassedTests']==len(leaves)==n and t['numFailedTests']==t['numPendingTests']==0 and all(a['status']=='passed' and not a['failureMessages'] for a in leaves)
assert load(P/'IMPORTANCE_URGENCY_TESTS_DEV1.json')==load(P/'importance-urgency-development-rev1/IMPORTANCE_URGENCY_TESTS_DEV1.json')
preserved=[]
for a in load(P/'importance-urgency-development-rev1/PRESERVATION.json')['artifacts']:
 assert ref(a['path'])['sha256']==a['sha256'];preserved.append(ref(a['path']))
for name,folder in [('importanceUrgency.ts','src/campaign3'),('importanceUrgencyFixtures.ts','src/test')]:assert (P/'importance-urgency-development-rev1'/name).read_bytes()==Path(folder,name).read_bytes()
old=(P/'importance-urgency-development-rev1/qualify-importance-urgency.mjs').read_text(encoding='utf-8');assert old.replace('match[1]);const child',"match[1].split('?')[0]);const child")==Path('scripts/qualify-importance-urgency.mjs').read_text(encoding='utf-8')
old=(P/'importance-urgency-development-rev1/importanceUrgency.test.ts').read_text(encoding='utf-8');assert old.replace("expect(()=>create('Factored',[{...frames()[0],extra:true},...frames().slice(1)])).toThrow('IU_DATA');","const extra=[{...frames()[0],extra:true},...frames().slice(1)];expect(()=>create('Factored',extra)).toThrow('IU_DATA');")==Path('src/test/importanceUrgency.test.ts').read_text(encoding='utf-8')
count=0
for case,res in zip(plan['runs'],result['results']):
 importance=None;frozen=None;history=[];rows=[];law=case['law']
 for frame,row in zip(case['inputs'],res['safe']['rows']):
  if frame['adoptionVisible'] and frame['adopt'] is not None:history.append(frame['adopt'])
  effective=(history[0] if history else None) if law=='RefoldImportance' else frame['adopt'] if frame['adoptionVisible'] and frame['adopt'] is not None else importance
  urgency=frame['urgency'] if frame['urgencyVisible'] else None;known=effective is not None and urgency is not None
  factored=F(effective*(1000+urgency),2000) if known else F(0);assert factored.denominator==1
  nextFrozen=frozen if frozen is not None else int(factored) if known else None
  strength=0 if not known else effective//2 if law=='ImportanceOnly' else urgency if law=='UrgencyOnly' else nextFrozen if law=='FrozenProduct' else int(factored)
  expected=dict(at=frame['at'],importance=effective,urgency=urgency,strength=strength,choice=row['choice']);assert row==expected;rows.append(expected)
  importance=None if law=='RefoldImportance' else effective;frozen=nextFrozen if law=='FrozenProduct' else None;count+=1
 assert res['safe']==dict(history=history,rows=rows) and res['snapshot']==dict(prefix=6,importance=importance,frozen=frozen,history=history,rows=rows)
assert count==1170
entries={e['path']:e for e in load(B/'manifest.json')['entries']};roles=[];strings={}
chain=[ref(O/(n+'.json')) for n in ['identities','replay']]+[ref(p) for p in ['scripts/replay-history-importance-urgency.mjs','scripts/check-importance-urgency-closure.mjs','src/campaign3/importanceUrgency.ts','src/campaign3/biologicalChoice.ts']]
for p,j in specs.items():
 assert ref(p)['sha256']==entries[p]['sha256'];roles.append(dict(**ref(p),role='IMPORTANCE/URGENCY AUTHORITY / QUALIFICATION / LIMIT',judgment=j,acceptanceChain=chain))
 if p.endswith('.json'):
  for ptr,text in walk(load(p)):strings[p,ptr]=text
rows=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in specs:continue
  assert u['sourceSha256']==entries[u['source']]['sha256'];ptr=u['location'].get('pointer','')
  if u['source'].endswith('.json'):assert strings[u['source'],ptr]==u['text']
  narrative=u['source'].endswith('.md') or ptr.startswith(('/status','/scope','/output')) or '/failureMessages/' in ptr
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],role='NARRATIVE AUTHORITY/FINDING' if narrative else 'TYPED EVIDENCE BACKING',judgment=specs[u['source']]))
obs=[f'RO-C3-{n:03}' for n in [1,8,14,19,20,21]]
r=dict(status='IMPORTANCE/URGENCY SOURCES REVIEWED; HQ011 OPEN',sourceRoles=roles,rows=rows,stringLeaves=len(strings),preservedArtifacts=preserved,obligations=obs,independentArithmeticRows=count,originalCheckerOutput=output,limits=['Fresh195 component cases1365 prefixes1170 advancing195 terminal; whole original canonical plans/results equal.','Independent1170 adopted-history/current-urgency/strength transitions; reason-dice/RNG bytes freshly replayed, not independently derived.','I1000/U0 andI500/U1000 have equal initial strength500/choice, then commonU0 yields500/250; seeds1..7 diverge,0 equal.','Refold equals Factored safe views in32 crossed cases while omitting cached importance; full history preserves semantic distinction. No general lossy compression result.','ImportanceOnly/UrgencyOnly/FrozenProduct remain named comparators; rejection of FrozenProduct is not rejection of all scalar encodings or proof of universal formula.','Hidden/denied source changes preserve safe views all laws; absent/zero operands remain distinct. Source precedes choice, not consequence learning.','Component pending reads can expose the complete old committed state; no public quiescence guard claimed. Whole commit occurs synchronously after choice; original faults/overlap tests are historical.','Historical14 focused328 reference and14 development tests/build authenticated, not rerun; permission/compiler/collector failures preserved with exact source deltas.','No physical action, public scheduler, native Save132, natural importance acquisition or general urgency/Need law.'])
c=dict(status='PASS; HQ011 OPEN',sources=len(specs),originalNarrativeOccurrences=sum(x['role'].startswith('NARRATIVE') for x in rows),originalBackingOccurrences=sum(x['role'].startswith('TYPED') for x in rows),stringLeaves=len(strings),checker=ref(__file__))
for name,value in [('review.json',r),('check.json',c)]:
 path=O/name
 if path.exists():assert load(path)==value
 else:path.write_text(json.dumps(value,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
print(json.dumps(c))
