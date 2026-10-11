"""Whole schema and original-occurrence reconciliation of historical comparison metadata."""
from pathlib import Path
import json,hashlib,collections
P=Path('docs/planning');O=P/'campaign3-history-biology-comparisons-rev1';B=P/'campaign3-history-universe-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def ref(p):return dict(path=Path(p).as_posix(),sha256=sha(p))
def save(p,v):
 if p.exists():assert load(p)==v,p
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
check=load(O/'canonical-check.json');assert len(check['sources'])==2
entries={e['path']:e for e in load(B/'manifest.json')['entries']};closure=P/'BIOLOGY_PUBLIC_CLOSURE_REV2.json'
roles=[];leaves=[];rows=[];obs=['RO-C3-008','RO-C3-019','RO-C3-020','RO-C3-021','RO-C3-022']
for rev,rec in enumerate(check['sources'],1):
 p=Path(rec['path']);v=load(p);assert set(v)=={'status','version','planSha256','harnessSha256','experimentIdentity','comparisonCase','coupling','disclosure'}
 assert sha(p)==rec['sha256']==entries[p.as_posix()]['sha256']
 assert any(a['path']==p.as_posix() and a['sha256']==sha(p) for a in load(closure)['artifacts'])
 for x in [rec['plan'],rec['harness']]:assert sha(x['path'])==x['sha256']
 judgment=('REV1 late ComparisonCase packaging remains disclosed; exact derivation binds the original REV2 roster but does not retroactively establish pre-execution wrapper publication.' if rev==1 else 'REV2 final wrapper binds REV3 roster; pre-execution timing is the historical disclosure, not independently proven by deterministic reconstruction.')
 roles.append(dict(**ref(p),role='WHOLE CANONICAL COMPARISON METADATA',judgment=judgment,acceptanceChain=[ref(closure),ref(p)],canonicalEvidence=ref(O/'canonical-check.json')))
 for k,s in v.items():
  assert isinstance(s,str) and s
  if k in ['planSha256','harnessSha256','experimentIdentity','comparisonCase']:assert len(s)%2==0 and bytes.fromhex(s)
  narrative=k in ['status','coupling','disclosure']
  meaning={'status':'Derivation is not execution or selection; no fresh trajectory claim.','version':'Exact version label, not independent scientific acceptance.','planSha256':'Exact historical cohort plan commitment.','harnessSha256':'Exact preserved producer bytes; REV1 uses archived producer, REV2 current unchanged producer.','experimentIdentity':'Matches the named plan; identity equality does not prove timing.','comparisonCase':'Reconstructed ordered model/run/coupling bytes exactly; four mutation controls reject reordered runs or altered coupling.','coupling':'Same original config/source/seed for component match; deliberate equal-learning dependence contrast, cue-only access and safe-observation hidden-state controls. All eight main/noLoad seeds retained; no inferred unbiased acquisition or causal population estimate.','disclosure':judgment}[k]
  leaves.append(dict(source=p.as_posix(),pointer='/'+k,role='NARRATIVE CLAIM / LIMIT' if narrative else 'TYPED CANONICAL BACKING',value=s if narrative or len(s)<200 else None,valueSha256=hashlib.sha256(s.encode()).hexdigest(),stringLength=len(s),judgment=meaning))
by={(x['source'],x['pointer']):x for x in leaves};selected={r['path'] for r in roles}
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in selected:continue
  a=by[(u['source'],u['location']['pointer'])]
  assert hashlib.sha256(u['text'].encode()).hexdigest()==a['valueSha256']
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],role=a['role'],judgment=a['judgment']))
v=dict(status='BOTH HISTORICAL COMPARISON METADATA SOURCES RECONCILED; HQ011 OPEN',sourceRoles=roles,rows=rows,allStringLeaves=leaves,canonicalEvidence=ref(O/'canonical-check.json'),obligations=obs,limits=['Canonical derivation verifies bytes, not independent historical timestamps or outcome truth.','REV1 late packaging is not relabeled as prospectively frozen; final REV2 retains its distinct source/plan identity.','Plan and trajectory fields are not whole-reviewed by identity reconstruction; source-role adequacy remains open.'])
save(O/'review.json',v)
c=dict(status=v['status'],sources=2,stringLeaves=len(leaves),originalOccurrences=len(rows),originalNarrativeOccurrences=sum(r['role']=='NARRATIVE CLAIM / LIMIT' for r in rows),originalBackingOccurrences=sum(r['role']=='TYPED CANONICAL BACKING' for r in rows),reviewSha256=sha(O/'review.json'),checkerSha256=sha(__file__))
save(O/'check.json',c)
base=P/'campaign3-history-source-roles-rev7/index.json';index=load(base);existing={r['path']:r for r in index['roleAssignments']}
for r in roles:
 assert r['path'] not in existing
 existing[r['path']]=dict(**r,category='WHOLE_CANONICAL_COMPARISON_METADATA_REVIEWED',evidence=[ref(O/'review.json')])
index['version']='campaign3-history-source-roles/0.8';index['predecessor']=ref(base);index['roleAssignments']=[existing[p] for p in sorted(existing)];index['unassignedCandidatePaths']=sorted(set(entries)-set(existing));index['reviewedInputs'].append(ref(O/'review.json'))
index['originalNarrativeOrFindingOccurrences']+=c['originalNarrativeOccurrences'];index['originalBackingFieldOccurrences']+=c['originalBackingOccurrences']
index['rules'].append('REV8 adds two complete comparison schemas with exact byte reconstruction, preserving late/pre-execution disclosure distinction. No plan/trajectory whole-review or retrospective timing proof.')
out=P/'campaign3-history-source-roles-rev8';out.mkdir(exist_ok=True);save(out/'index.json',index)
save(out/'check.json',dict(status=index['status'],assignedSources=len(existing),unassignedWithinThisIndex=len(index['unassignedCandidatePaths']),originalNarrativeOrFindingOccurrences=index['originalNarrativeOrFindingOccurrences'],originalBackingOccurrences=index['originalBackingFieldOccurrences'],indexSha256=sha(out/'index.json'),checkerSha256=sha(__file__)))
print(json.dumps(c));print(json.dumps(load(out/'check.json')))
