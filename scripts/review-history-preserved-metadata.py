from pathlib import Path
import json,hashlib
P=Path('docs/planning');O=P/'campaign3-history-preserved-metadata-rev1';B=P/'campaign3-history-universe-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def ref(p):return dict(path=Path(p).as_posix(),sha256=sha(p))
def save(p,v):
 if p.exists():assert load(p)==v
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
def walk(v,p=''):
 if isinstance(v,dict):
  for k,x in v.items():yield from walk(x,p+'/'+k)
 elif isinstance(v,list):
  for i,x in enumerate(v):yield from walk(x,p+'/'+str(i))
 elif isinstance(v,str):yield p,v
plan=load(P/'BIO_COMPARISON_PLAN_REV3.json');prior=load(P/'BIO_COMPARISON_PLAN_REV2.json')
assert set(k for k in plan if plan[k]!=prior.get(k))=={'status','artifacts','predecessor'}
assert sha(plan['predecessor']['path'])==plan['predecessor']['sha256']
for a in plan['artifacts']:assert sha(a['path'])==a['sha256']
changed=[a['path'] for a,b in zip(plan['artifacts'],prior['artifacts']) if a!=b];assert changed==['docs/formal/BIO_COMPARISON_CONTRACT.md','scripts/qualify-bio-comparison.mjs']
save(O/'bio-plan-check.json',dict(status='EXACT CASE/CALIBRATION EQUALITY; CURRENT ARTIFACT REFERENCES MATCH',source=ref(P/'BIO_COMPARISON_PLAN_REV3.json'),predecessor=ref(P/'BIO_COMPARISON_PLAN_REV2.json'),changedKeys=['status','artifacts','predecessor'],changedArtifactPaths=changed,scope='Editorial successor retains all13 cases and calibration data. This comparison does not claim old/current executable byte equality or rerun BIO qualification.'))
specs={
(P/'BIO_COMPARISON_PLAN_REV3.json').as_posix():('BIO comparison plan editorial successor:cases,calibration,seeds and contrary attempts identical to REV2. Component-only comparison retains six candidates;no public scheduler qualification. Two artifact fingerprints changed and verified;predecessor identity explicit.',O/'bio-plan-check.json'),
(P/'CRAVING_SOURCES_REV1.json').as_posix():('Five BODY source executions and15 prefixes exactly reproduced,including canonical save/state/trace and run identities. Hidden6/9 share admitted packets despite different physical conditions;full pressure0 differs from denied null. These source receipts do not establish learned craving,action or physiological recovery.',O/'craving-source-check.json'),
(P/'campaign2-task-commitment-model/CONTROLS.json').as_posix():('192 control commitments:three task specimens by64 Boolean flag combinations. Exact ordered identity/content/registry digests reconstruct and current declaration/state admission succeeds. No runtime deadlines,restore,activation or historical source-byte equivalence follows from declaration controls.',O/'task-controls-check.json')}
artifacts={a['original']:a for a in load(P/'public-wrapper-quiescence-rev1/PRESERVATION.json')['artifacts']};entries={e['path']:e for e in load(B/'manifest.json')['entries']};roles=[];sources={};pairs={}
for p,(judgment,evidence) in specs.items():
 a=artifacts[p]
 for q in [p,a['archive']]:
  assert sha(q)==entries[q]['sha256']==a['sha256'];sources[q]=load(q)
  if q!=p:pairs[q]=p
  roles.append(dict(path=q,sha256=sha(q),role='WHOLE PRESERVED TYPED METADATA / EXACT ARCHIVE',judgment=judgment,acceptanceChain=[ref(evidence)]))
strings={(p,ptr):s for p,v in sources.items() for ptr,s in walk(v)};units=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in sources:continue
  assert u['sourceSha256']==entries[u['source']]['sha256'] and strings[u['source'],u['location']['pointer']]==u['text'];units.append(u)
lookup={(u['source'],u['location']['pointer'],u['text']):u['id'] for u in units};rows=[]
for u in units:
 ptr=u['location']['pointer'];narrative=ptr in ['/status','/scope','/predecessor/reason'];r=dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],role='NARRATIVE SCOPE / SUCCESSOR' if narrative else 'TYPED BACKING',judgment=next(x['judgment'] for x in roles if x['path']==u['source']))
 if u['source'] in pairs:r['originalOccurrenceId']=lookup[pairs[u['source']],ptr,u['text']]
 rows.append(r)
obs=['RO-C3-008','RO-C3-009','RO-C3-019','RO-C3-020','RO-C3-021','RO-C3-022']
save(O/'review.json',dict(status='SIX PRESERVED METADATA SOURCES RECONCILED; HQ011 OPEN',sourceRoles=roles,rows=rows,stringLeaves=len(strings),obligations=obs,limits=['Fresh192 declaration commitments and5 public BODY runs/15 prefixes;not a new task-runtime or craving-action qualification.','BIO cases/calibration unchanged;two artifact reference updates are explicit,not assumed identical historical bytes.']))
c=dict(status='PASS; HQ011 OPEN',sources=len(roles),originalNarrativeOccurrences=sum(r['role'].startswith('NARRATIVE') for r in rows),originalBackingOccurrences=sum(r['role']=='TYPED BACKING' for r in rows),stringLeaves=len(strings),archiveOccurrenceJoins=sum('originalOccurrenceId'in r for r in rows),reviewSha256=sha(O/'review.json'),checkerSha256=sha(__file__))
save(O/'check.json',c);print(json.dumps(c))
