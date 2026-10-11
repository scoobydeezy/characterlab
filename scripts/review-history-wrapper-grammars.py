"""Typed grammar roles with exact original/archive occurrence joins."""
from pathlib import Path
import json,hashlib,re,collections
P=Path('docs/planning');B=P/'campaign3-history-universe-rev1';O=P/'campaign3-history-wrapper-grammars-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def ref(p):return dict(path=Path(p).as_posix(),sha256=sha(p))
def save(p,v):
 if p.exists():assert load(p)==v,p
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
def keys(v,s):assert set(v)==set(s.split()),set(v)
def typ(t):
 if isinstance(t,str):assert t in ['text','bool','unitQ','nonnegativeQ','i','u','signedUnitQ','positiveQ','data'] or re.fullmatch('(ref|id):[0-9]+',t);return
 if 'enum' in t:keys(t,'enum');assert len(t['enum'])==len(set(t['enum'])) and all(type(x)is int for x in t['enum']);return
 if 'oneOf' in t:keys(t,'oneOf');assert len(t['oneOf'])>0;[typ(x) for x in t['oneOf']];return
 assert len(set(t)-{'min','max'})==1;k=next(iter(set(t)-{'min','max'}));keys(t,k+' min max');assert k in ['list','set','map'];assert type(t['min']) is int and type(t['max']) is int and 0<=t['min']<=t['max']
 if k=='map':assert len(t[k])==2;[typ(x) for x in t[k]]
 else:typ(t[k])
def walk(v,p=''):
 if isinstance(v,dict):
  for k,x in v.items():yield from walk(x,p+'/'+k)
 elif isinstance(v,list):
  for i,x in enumerate(v):yield from walk(x,p+'/'+str(i))
 elif isinstance(v,str):yield p,v
c=load(O/'canonical-check.json');assert c['checkerSha256']==sha('scripts/check-history-wrapper-grammars.mjs');entries={e['path']:e for e in load(B/'manifest.json')['entries']};sources={};roles=[];pairs={};declarations=[]
for a in c['rows']:
 v=load(a['original']);assert set(v)<=set('version date status namespace records unions'.split());assert v['status']=='ACCEPTED before implementation';assert re.fullmatch('[a-z-]+/0\.[12]-candidate',v['version']);assert v['namespace'] is None or type(v['namespace']) is int
 if 'date'in v:assert re.fullmatch('2026-09-[0-9]{2}',v['date'])
 if 'unions'in v:assert v['unions']==[]
 for r in v['records']:
  keys(r,'typeId schemaVersion name fields');assert r['schemaVersion']==1 and type(r['typeId'])is int and re.fullmatch('[A-Za-z0-9]+',r['name'])
  assert len(set(f['id'] for f in r['fields']))==len(r['fields'])
  for f in r['fields']:keys(f,'id name required type');assert type(f['id']) is int and f['id']>0 and type(f['required'])is bool and re.fullmatch('[A-Za-z0-9]+',f['name']);typ(f['type'])
 declarations.append(dict(path=a['original'],version=v['version'],namespace=v['namespace'],records=[dict(typeId=r['typeId'],name=r['name'],fields=len(r['fields'])) for r in v['records']]))
 for p in [a['original'],a['archive']]:
  assert sha(p)==a['sha256']==entries[p]['sha256'];sources[p]=v
  j='Accepted candidate structural grammar: exact named records/fields, requiredness, primitive/reference domains and bounded containers; actual codec schema exports match. Acceptance text is a declaration, not independent timestamp or behavior verdict. Field/type labels are schema operands, not prose findings. Namespace reuse/null does not merge cognitive owners. Opaque data fields remain subject to separate admission/model semantics; structural format alone does not prove epistemic safety or general biological validity.'
  if p==a['archive']:j+=' Exact pre-repair dependency alias; shares this grammar analysis only, not later wrapper execution authority.';pairs[p]=a['original']
  roles.append(dict(path=p,sha256=sha(p),role='WHOLE TYPED ALLOCATION GRAMMAR' if p==a['original'] else 'EXACT ARCHIVED GRAMMAR ALIAS',judgment=j,acceptanceChain=[ref(O/'canonical-check.json'),a['codec'],ref(P/'public-wrapper-quiescence-rev1/PRESERVATION.json')]))
strings={(p,ptr):x for p,v in sources.items() for ptr,x in walk(v)};units=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] in sources:
   assert u['sourceSha256']==entries[u['source']]['sha256'] and strings[u['source'],u['location']['pointer']]==u['text'];units.append(u)
lookup={(u['source'],u['location']['pointer'],u['text']):u['id'] for u in units};rows=[]
for u in units:
 r=dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],role='ALLOCATION ACCEPTANCE DECLARATION' if u['location']['pointer']=='/status' else 'TYPED GRAMMAR BACKING',judgment=next(s['judgment'] for s in roles if s['path']==u['source']))
 if u['source'] in pairs:r['originalOccurrenceId']=lookup[pairs[u['source']],u['location']['pointer'],u['text']]
 rows.append(r)
obs=['RO-C3-019','RO-C3-020','RO-C3-021','RO-C3-022']
save(O/'review.json',dict(status='84 ORIGINAL/ARCHIVE GRAMMARS RECONCILED; HQ011 OPEN',sourceRoles=roles,rows=rows,declarations=declarations,stringLeaves=len(strings),obligations=obs,limits=['Structural declaration/export agreement, not decoder property tests or runtime/psychological qualification.','Original/archived occurrence identities preserved individually; copies add no independent experiment.','Other rich allocation policy documents and model freezes remain separate work.']))
v=dict(status='PASS; HQ011 OPEN',sources=len(roles),originalNarrativeOccurrences=sum(r['role'].startswith('ALLOCATION') for r in rows),originalBackingOccurrences=sum(r['role'].startswith('TYPED') for r in rows),stringLeaves=len(strings),uniqueRecords=c['records'],uniqueFields=c['fields'],archiveOccurrenceJoins=sum('originalOccurrenceId'in r for r in rows),reviewSha256=sha(O/'review.json'),checkerSha256=sha(__file__))
save(O/'check.json',v);print(json.dumps(v))
