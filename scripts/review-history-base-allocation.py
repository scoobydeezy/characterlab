"""Base/VAL/probe/multisource allocation scopes and original archive joins."""
from pathlib import Path
import json,hashlib,re
P=Path('docs/planning');F=Path('docs/formal');B=P/'campaign3-history-universe-rev1';O=P/'campaign3-history-base-allocation-rev1';O.mkdir(exist_ok=True)
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def ref(p):return dict(path=Path(p).as_posix(),sha256=sha(p))
def save(p,v):
 if p.exists():assert load(p)==v,p
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
def walk(v,p=''):
 if isinstance(v,dict):
  for k,x in v.items():yield from walk(x,p+'/'+k)
 elif isinstance(v,list):
  for i,x in enumerate(v):yield from walk(x,p+'/'+str(i))
 elif isinstance(v,str):yield p,v
specs={
'CAMPAIGN2_ALLOCATION_TABLE':'69 records260..328,18 namespaces,58 members,32 union variants,10 finite values. Original record/union/finite hashes plus first16 namespaces/53 members remain exact. SemanticKind1004 is CONTENT/shared without changing IDN predicate;Seam1036 is shared trace/transition,not new seam registry/global legacy trace narrowing. Both ADAPT V06 consumers use adaptation-input/0.31. Accepted append-only allocation does not pass VAL or runtime gates.',
'VAL_ALLOCATION_TABLE':'329/330 add governed content-schema and semantic-kind role-validator definitions,two fields,two registry members and two exact bindings. Stable IDs reuse1004/1021;registry-kind1023 is distinct. No namespaces,unions,finite values or unresolved allocation fields added. Frozen base hash remains exact;numeric final machine gate does not qualify VAL-A..W or canonical activation.',
'REGULATORY_PROBE_ALLOCATION_TABLE':'331..335 preserve truth occurrence1123 shared runtime allocator,observer channel and carrier Suppressed/Observing/Supporting distinctions. Three governed259 union definitions partition required/forbidden fields. No state roots or save fields. Historical240 allocation checks reproduced with exact recovered registry/authority bytes and declared historical inventory;not a claim of present directory completeness or runtime PROBE qualification. Later authority header is qualified,not original accepted-shape text.',
'MULTISOURCE_PUBLIC_ALLOCATION_TABLE':'707..733/namespace1149 append27 records after706 with shared runtime ordinal and schema-specific stage roles. Inherited649/373 state owners remain,no new state root. Explicit718/720 unions retained. MS-ALLOC-CORR-001 replaces711/6,7 selector141 with StatePathPattern149 before first model admission,without changing IDs/schema. Correction claim is historical source assertion;allocation alone does not prove behavioral qualification or models under rejected shape.'}
base=load(F/'CAMPAIGN2_ALLOCATION_TABLE.json');val=load(F/'VAL_ALLOCATION_TABLE.json');probe=load(F/'REGULATORY_PROBE_ALLOCATION_TABLE.json');multi=load(F/'MULTISOURCE_PUBLIC_ALLOCATION_TABLE.json')
for v,lo,hi in [(base,260,328),(val,329,330),(probe,331,335),(multi,707,733)]:
 assert [r['typeId'] for r in v['records']]==list(range(lo,hi+1))
 for r in v['records']:assert r['schemaVersion']==1 and len({f['id'] for f in r['fields']})==len(r['fields'])
assert val['baseAllocation']['sha256']==sha(F/'CAMPAIGN2_ALLOCATION_TABLE.json')
assert probe['stateRoots']==probe['saveFields']==[]
assert multi['priorHighest']==706 and multi['newHighest']==733 and multi['allocatedSinceVerdictOrMember']==27
stage=next(r for r in multi['records'] if r['typeId']==711)
for fid in [6,7]:assert next(f for f in stage['fields'] if f['id']==fid)['type']['list']=='ref:149'
for u in multi['unions']:
 fields=[f['id'] for f in next(r for r in multi['records'] if r['typeId']==u['typeId'])['fields']]
 for variant in u['variants']:assert sorted(variant['required']+variant['forbidden'])==fields and not set(variant['required'])&set(variant['forbidden'])
assert multi['corrections'][0]['id']=='MS-ALLOC-CORR-001'
commands=load(O/'commands.json');assert len(commands['rows'])==3 and all(r['exitCode']==0 and sha(r['command'][1])==r['scriptSha256'] for r in commands['rows'])
archive={a['original']:a for a in load(P/'public-wrapper-quiescence-rev1/PRESERVATION.json')['artifacts']};entries={e['path']:e for e in load(B/'manifest.json')['entries']};sources={};roles=[];pairs={};bindings=[]
def scan(v):
 if isinstance(v,dict):
  if 'path'in v and 'sha256'in v:
   actual=v['path']
   if actual=='docs/formal/CANONICAL_RECORD_REGISTRY.md' and v['sha256']=='6f95e9f59ce3a66e4acd6de9cdc1b1a77e4893ca537a6286577d54717ea82474':actual=(P/'campaign3-history-allocation-corrections-rev1/CANONICAL_RECORD_REGISTRY.historical.md').as_posix()
   assert sha(actual)==v['sha256'];bindings.append(dict(path=v['path'],sha256=v['sha256'],resolvedPath=actual))
  for x in v.values():scan(x)
 elif isinstance(v,list):
  for x in v:scan(x)
for stem,j in specs.items():
 p=(F/(stem+'.json')).as_posix();v=load(p);a=archive[p];scan(v)
 for q in [p,a['archive']]:
  assert sha(q)==a['sha256']==entries[q]['sha256'];sources[q]=v
  roles.append(dict(path=q,sha256=sha(q),role='WHOLE BASE ALLOCATION/POLICY' if q==p else 'EXACT ARCHIVED BASE POLICY',judgment=j+(' Exact archived declaration shares scoped analysis,not new execution authority.' if q!=p else ''),acceptanceChain=[ref(P/'public-wrapper-quiescence-rev1/PRESERVATION.json'),ref(O/'commands.json'),ref(O/'development.json')]))
  if q!=p:pairs[q]=p
strings={(p,ptr):s for p,v in sources.items() for ptr,s in walk(v)};units=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in sources:continue
  assert u['sourceSha256']==entries[u['source']]['sha256'] and strings[u['source'],u['location']['pointer']]==u['text'];units.append(u)
lookup={(u['source'],u['location']['pointer'],u['text']):u['id'] for u in units};rows=[]
for u in units:
 ptr=u['location']['pointer'];narrative=ptr.startswith(('/status','/scope','/resolvedGaps','/corrections','/acceptance')) or ptr.endswith('/scope')
 r=dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],role='POLICY / AUTHORITY / HISTORICAL LIMIT' if narrative else 'TYPED ALLOCATION DECLARATION BACKING',judgment=next(x['judgment'] for x in roles if x['path']==u['source']))
 if u['source'] in pairs:r['originalOccurrenceId']=lookup[pairs[u['source']],ptr,u['text']]
 rows.append(r)
obs=['RO-C3-001','RO-C3-007','RO-C3-008','RO-C3-019','RO-C3-020','RO-C3-021','RO-C3-022']
save(O/'review.json',dict(status='8 BASE ALLOCATION/POLICY SOURCES RECONCILED; HQ011 OPEN',sourceRoles=roles,rows=rows,sourceBindings=bindings,stringLeaves=len(strings),obligations=obs,limits=['Allocation specification checks are not fresh runtime qualification.','Probe original report is reproduced against its declared historical source list;no independent directory completeness claim.','Historical authority reconstructed only after exact recorded digest match;failed attempts preserved in development.json.']))
c=dict(status='PASS; HQ011 OPEN',sources=len(roles),originalNarrativeOccurrences=sum(r['role'].startswith('POLICY') for r in rows),originalBackingOccurrences=sum(r['role'].startswith('TYPED') for r in rows),stringLeaves=len(strings),sourceBindings=len(bindings),archiveOccurrenceJoins=sum('originalOccurrenceId'in r for r in rows),reviewSha256=sha(O/'review.json'),checkerSha256=sha(__file__))
save(O/'check.json',c);print(json.dumps(c))
