"""Build receipts and context-preserving archive joins, without executing builds."""
from pathlib import Path
import json,hashlib,difflib
P=Path('docs/planning');B=P/'campaign3-history-universe-rev1';O=P/'campaign3-history-defining-metadata-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def ref(p):return dict(path=Path(p).as_posix(),sha256=sha(p))
def save(p,v):
 if p.exists():assert load(p)==v,p
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
index=load(P/'campaign3-history-source-roles-rev24/index.json');entries={x['path']:x for x in load(B/'manifest.json')['entries']};sources={};roles=[];logs=[];archives=[]
for path in index['unassignedCandidatePaths']:
 if 'DEFINING_' not in path or 'BUILD_' not in path:continue
 v=load(path);assert set(v)<=set('command exitCode log checks scope'.split()) and v['exitCode']==0
 if 'command' in v:assert v['command']=='npm run build'
 if 'checks' in v:assert all(x in ['reference boundary passed','tsc -b passed','production build passed','Vite production build passed','Vite5.4.21 production build passed;3 modules transformed'] for x in v['checks'])
 if 'log' in v:
  a=v['log'];assert set(a)=={'path','sha256'} and sha(a['path'])==a['sha256'];text=Path(a['path']).read_text(encoding='utf-8');assert 'npm run check:boundaries && tsc -b && vite build' in text and 'Reference boundary check passed.' in text and '3 modules transformed.' in text and 'built in ' in text;logs.append(a)
 assert sha(path)==entries[path]['sha256'];sources[path]=v
 roles.append(dict(**ref(path),role='WHOLE HISTORICAL BUILD RECEIPT',judgment='Historical boundary/TypeScript/Vite build result, not a fresh build, full test suite or psychological qualification. Bound logs preserve exact bytes and incidental duration/artifact sizes; identical logs do not create independent behavioral coverage. Memory bridge receipt records checks without a log field; do not invent one.',acceptanceChain=[ref(path),ref(P/'campaign3-history-defining-native-stages-rev1/commands.json'),ref(P/'campaign3-history-defining-components-rev1/commands.json')]))
assert len(sources)==10
manifests=[]
for n in [1,2]:
 p=P/f'defining-public-development-rev{n}/MANIFEST.json';v=load(p);assert set(v)=={'scope','files'} and len(v['files'])==5
 for a in v['files']:assert set(a)=={'path','original','sha256'} and sha(a['path'])==a['sha256'];archives.append(a)
 assert sha(p)==entries[p.as_posix()]['sha256'];sources[p.as_posix()]=v;manifests.append(v)
 roles.append(dict(**ref(p),role='WHOLE PUBLIC DEVELOPMENT MANIFEST',judgment='First source cohort failed browser-oriented typecheck before tests; second is first executed focused cohort. Exact source/contract archives preserve identity; focused execution does not itself qualify full matrix. Test hash differs, shared production/contract hashes do not.',acceptanceChain=[ref(P/'defining-public-development-rev1/PRESERVATION.json'),ref(P/'CAMPAIGN3_DEFINING_PUBLIC_QUALIFICATION.md')]))
a={x['original']:x for x in manifests[0]['files']};b={x['original']:x for x in manifests[1]['files']};assert a.keys()==b.keys()
for k in a:
 if not k.endswith('.test.ts'):assert a[k]['sha256']==b[k]['sha256']
old=Path(a['src/test/definingPublic.test.ts']['path']).read_text();new=Path(b['src/test/definingPublic.test.ts']['path']).read_text()
expected=old.replace("import {createHash} from 'node:crypto';","import {sha256} from '../substrate/crypto';").replace('signed,text,bytes}', 'signed,text,bytes,bytesToHex}').replace("sha=(b:Uint8Array)=>createHash('sha256').update(b).digest('hex')",'sha=async(b:Uint8Array)=>bytesToHex(await sha256(b))').replace('state:sha(s.state),outputs:sha(s.outputs)','state:await sha(s.state),outputs:await sha(s.outputs)').replace("Uint8Array.from(Buffer.from(native.runIdentity,'hex'))","Uint8Array.from(native.runIdentity.match(/../g)!.map(x=>parseInt(x,16)))")
assert expected==new
priorPaths=[P/f'campaign3-history-{n}-rev1/review.json' for n in ['defining-components','defining-public','defining-native-stages']];priorRows=[r for p in priorPaths for r in load(p)['rows']];aliases={}
for p in P.glob('defining-*/*.md'):
 target=Path('docs/formal')/p.name
 if p.as_posix() not in index['unassignedCandidatePaths'] or not target.exists():continue
 assert p.read_bytes()==target.read_bytes();assert any(r['source']==target.as_posix() for r in priorRows);assert sha(p)==entries[p.as_posix()]['sha256']
 parent=p.parent/('MANIFEST.json' if (p.parent/'MANIFEST.json').exists() else 'PRESERVATION.json');assert any(x['path']==p.as_posix() and x['sha256']==sha(p) for x in load(parent)['files'])
 aliases[p.as_posix()]=target.as_posix();sources[p.as_posix()]=None
 roles.append(dict(**ref(p),role='EXACT ARCHIVED CONTRACT WITH CONTEXTUAL JOIN',judgment='Content exactly matches already-reviewed contract; preserve attempted development-cohort context and each original occurrence identity. Archive identity is not independent successful qualification or new coverage.',acceptanceChain=[ref(parent),ref(target)]+[ref(x) for x in priorPaths]))
assert len(aliases)==6
def walk(v,p=''):
 if isinstance(v,dict):
  for k,x in v.items():yield from walk(x,p+'/'+k)
 elif isinstance(v,list):
  for i,x in enumerate(v):yield from walk(x,p+'/'+str(i))
 elif isinstance(v,str):yield p,v
strings={(p,ptr):s for p,v in sources.items() if v is not None for ptr,s in walk(v)};rows=[];rolemap={x['path']:x for x in roles}
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line);p=u['source']
  if p not in sources:continue
  assert u['sourceSha256']==entries[p]['sha256'];links=[]
  if p in aliases:
   match=[r for r in priorRows if r['source']==aliases[p] and r['text']==u['text'] and r['location']==u['location']];assert len(match)==1;links=[match[0]['occurrenceId']]
  else:assert strings[p,u['location']['pointer']]==u['text']
  backing=p not in aliases and u['location']['pointer']=='/command'
  rows.append(dict(occurrenceId=u['id'],source=p,sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],role='COMMAND BACKING' if backing else 'ARCHIVE / BUILD SCOPE',judgment=rolemap[p]['judgment'],priorOccurrenceIds=links))
obs=['RO-C3-005','RO-C3-006','RO-C3-007','RO-C3-009','RO-C3-010','RO-C3-019','RO-C3-020','RO-C3-021','RO-C3-022'];O.mkdir(exist_ok=True)
save(O/'review.json',dict(status='18 DEFINING BUILD/ARCHIVE SOURCES RECONCILED; HQ011 OPEN',sourceRoles=roles,rows=rows,stringLeaves=len(strings),logs=logs,archiveBindings=archives,testDiff=''.join(difflib.unified_diff(old.splitlines(True),new.splitlines(True))),obligations=obs,limits=['No fresh build/tests. Log aliases preserve exact identity, not independent execution proof.','Test text comparison normalizes line endings; original file hashes remain authoritative.','Archived contract aliases inherit only the reviewed content meaning, not later source-cohort success.']))
c=dict(status='PASS; HQ011 OPEN',sources=len(roles),originalNarrativeOccurrences=sum(r['role']!='COMMAND BACKING' for r in rows),originalBackingOccurrences=sum(r['role']=='COMMAND BACKING' for r in rows),stringLeaves=len(strings),logBindings=len(logs),distinctLogHashes=len({x['sha256'] for x in logs}),exactContractAliases=len(aliases),reviewSha256=sha(O/'review.json'),checkerSha256=sha(__file__))
save(O/'check.json',c);print(json.dumps(c))
