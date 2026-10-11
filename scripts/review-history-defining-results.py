"""Whole original defining result/training schemas and occurrence reconciliation."""
from pathlib import Path
import json,hashlib,re
P=Path('docs/planning');B=P/'campaign3-history-universe-rev1';O=P/'campaign3-history-defining-results-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def ref(p):return dict(path=Path(p).as_posix(),sha256=sha(p))
def save(p,v):
 if p.exists():assert load(p)==v,p
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
def keys(v,s):assert set(v)==set(s.split()),set(v)
def walk(v,p=''):
 if isinstance(v,dict):
  for k,x in v.items():yield from walk(x,p+'/'+k)
 elif isinstance(v,list):
  for i,x in enumerate(v):yield from walk(x,p+'/'+str(i))
 elif isinstance(v,str):yield p,v
commands=load(O/'commands.json')
for c in commands['commands']:assert c['exitCode']==0 and sha(c['checker']['path'])==c['checker']['sha256']
entries={e['path']:e for e in load(B/'manifest.json')['entries']};sources={};roles=[]
for a in commands['sources']:
 p=a['path'];assert sha(p)==a['sha256']==entries[p]['sha256'];v=load(p);sources[p]=v
 if 'TRAINING' in p:
  keys(v,'scope recipe modelIdentity runIdentity seed initialState orderedInputs snapshots script')
  assert v['recipe']=='credit-significance-first' and v['seed']=='00'*32
  assert [s['clock'] for s in v['snapshots']]==['37','38']
  for s in v['snapshots']:
   keys(s,'clock state outputs trace')
   for k in ['state','outputs','trace']:assert re.fullmatch('(?:[0-9a-f]{2})+',s[k])
  assert sha(v['script']['path'])==v['script']['sha256']
  judgment='Actual GA acquisition through38 freshly reproduced: exact model/run, original initial state, original ordered inputs, zero32 seed and complete37/38 state/output/trace. These are the original public GA acquisition snapshots, not native defining continuation or Save132 restore evidence.'
  chain=[ref(O/'commands.json'),ref(P/'campaign3-history-defining-plans-rev1/canonical-check.json')]
 else:
  keys(v,'status scope models cases replayedStages planSha256 target results');lane='MEMORY' if 'MEMORY' in p else 'MEANING';plan=P/f'DEFINING_{lane}_PLAN_REV1.json';pv=load(plan)
  assert v['status']=='PASS' and v['models']==4 and v['planSha256']==sha(plan)
  assert v['cases']==len(v['results'])==len(pv['runs']);assert v['replayedStages']==sum(len(r['stages']) for r in v['results'])
  for r,pr in zip(v['results'],pv['runs']):
   assert all(r[k]==pr[k] for k in ['index','spec','runIdentity'])
   assert all(re.fullmatch('[0-9a-f]{64}',h) for h in r['stages'])
   if lane=='MEMORY':
    keys(r,'index runIdentity stages spec retained reads disposition scores publication presentation');assert len(r['stages'])==3
    for a in r['retained']:keys(a,'id at kind units')
   else:
    keys(r,'index runIdentity spec stages viewSha256 view');assert len(r['stages'])==4+r['spec']['rehearsals'];assert r['viewSha256']==r['stages'][-1]
    keys(r['view'],'goals historical attribution rehearsals current report memory history scores publication');assert len(r['view']['rehearsals'])==r['spec']['rehearsals']
  judgment=('Whole stored rows freshly reproduced twice from authenticated acquisition with exact plan identities and stage bytes. Memory288/864 retains distinct significance/use/age laws, admission, capacity, cue and idle-time controls. Retained does not imply selected; unrelated cue can rank zero; absent cue prevents reads. Final presentation is returned, not settled into a native history owner.' if lane=='MEMORY' else 'Whole68 rows/308 stages freshly reproduced twice: goal-relative historical meaning, supported attribution, actual scheduled rehearsal/use, later current report, retained children, exact scores and final publication. worldAfter is diagnostic only; final presentation is taken but not appended to component history. Native successor separately settles it. Child is a bounded alias; carried cue and empty graph remain controls, not learned recognition or autonomous rehearsal intent.')
  chain=[ref(O/'commands.json'),ref(plan),ref(P/'campaign3-history-defining-components-rev1/review.json')]
 roles.append(dict(path=p,sha256=sha(p),role='WHOLE ACQUISITION OR COMPONENT RESULT SCHEMA',judgment=judgment,acceptanceChain=chain))
strings={(p,ptr):x for p,v in sources.items() for ptr,x in walk(v)};rows=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in sources:continue
  assert u['sourceSha256']==entries[u['source']]['sha256'] and strings[u['source'],u['location']['pointer']]==u['text']
  narrative=u['location']['pointer']=='/scope'
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],role='SCOPE CLAIM' if narrative else 'TYPED RESULT BACKING',judgment=next(s['judgment'] for s in roles if s['path']==u['source'])))
obs=['RO-C3-005','RO-C3-006','RO-C3-007','RO-C3-009','RO-C3-010','RO-C3-019','RO-C3-020','RO-C3-021','RO-C3-022']
save(O/'review.json',dict(status='THREE WHOLE SOURCES RECONCILED; HQ011 OPEN',sourceRoles=roles,rows=rows,stringLeaves=len(strings),omittedStringLeaves=len(strings)-len(rows),obligations=obs,limits=commands['scope']))
c=dict(status='PASS; HQ011 OPEN',sources=3,originalNarrativeOccurrences=sum(r['role']=='SCOPE CLAIM' for r in rows),originalBackingOccurrences=sum(r['role']!='SCOPE CLAIM' for r in rows),stringLeaves=len(strings),omittedStringLeaves=len(strings)-len(rows),reviewSha256=sha(O/'review.json'),checkerSha256=sha(__file__))
save(O/'check.json',c);print(json.dumps(c))
