"""Development build, source-preservation and operational findings; no execution."""
from pathlib import Path
import json,hashlib,collections,re
P=Path('docs/planning');B=P/'campaign3-history-universe-rev1';O=P/'campaign3-history-development-metadata-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def ref(p):return dict(path=Path(p).as_posix(),sha256=sha(p))
def save(p,v):
 if p.exists():assert load(p)==v,p
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
specs={
 'development-component-dev1/MANIFEST.json':('status files','First component source freeze; archive hash preserves original test timeout source, not passing all13 tests.'),
 'development-component-dev2/MANIFEST.json':('status files','Second component source freeze; existing shared production files match first cohort. Test-only timeout changed; new identity/roster files do not imply a changed kernel.'),
 'development-public-dev1/MANIFEST.json':('status files','First native source freeze;21 test passes remain distinct from test-only compiler failure. No retrospective source correction.'),
 'development-public-dev2/MANIFEST.json':('status change files','Second native source freeze; exact test fixture assignment correction only. Original production files match; no changed mathematics.'),
 'development-component-dev1/FINDING.json':('status receipt change','Six passes/seven timeouts; increasing timeout is not removing failed psychological assertions. Startup denial ran no tests.'),
 'development-public-dev1/PREFLIGHT.json':('sandboxStartup typecheck','Startup denial precedes execution; TS2540 is test-only readonly payload assignment. Successful21-test run does not imply typecheck success.'),
 'DEVELOPMENT_COMPONENT_BUILD_REV1.json':('status command exitCode referenceTests focusedTests note','Historical boundary/tsc/Vite success with13 focused/328 reference; not full active suite or fresh build.'),
 'DEVELOPMENT_PUBLIC_BUILD_REV1.json':('status command exitCode referenceTests focusedTests note','Historical boundary/tsc/Vite success with21 focused/328 reference; no whole active-suite or new build claim.'),
 'DEVELOPMENT_PUBLIC_WORKER_MEMORY_REV1.json':('status reason prefixesAtStop programsAtStop workerExitCodes nodeFlags','Operational memory-pressure stop at173 prefixes;1536MB cap is attempted recovery, not qualification of low-memory operation. Exit1 here is intentional stop.'),
 'DEVELOPMENT_PUBLIC_WORKER_MEMORY_FAILURE_REV1.json':('status sourceChanged modelChanged capMB failedPartsObserved lastCompletedPrefixForThoseParts exitCode diagnosticSummary preservedPrefixesAtStop nextDisposition completeStderrEvidenceForParts8Through11','1536MB allocation failure preserves280 completed prefixes. Summary explicitly incomplete for some stacks; complete captured outputs only parts8..11. No behavioral failure or supported scaling claim.'),
 'DEVELOPMENT_PUBLIC_MEMORY_STOP_OUTPUTS_REV1.json':(None,'Captured tool outputs: parts0..3 show last successful prefix before stop; parts8..11 show fatal heap limits. Promise fulfilled is tool delivery status, not process success. No complete stderr claim for uncaptured parts4..7.'),
 'development-public-batch-rev1/STATUS.json':('scope heapMB concurrency workers','Twelve partitions completed using four concurrent workers with4096MB cap. Operational start/finish times are metadata, not deterministic simulation time or benchmark guarantee.')
}
entries={e['path']:e for e in load(B/'manifest.json')['entries']};closureBindings={}
for name in ['DEVELOPMENT_COMPONENT_CLOSURE_REV1.json','DEVELOPMENT_PUBLIC_CLOSURE_REV1.json']:
 c=P/name
 for a in load(c)['files']:
  if a['path'] in {(P/n).as_posix() for n in specs}:assert sha(a['path'])==a['sha256'];closureBindings[a['path']]=ref(c)
sources={};roles=[];artifacts=[]
for name,(ks,judgment) in specs.items():
 path=P/name;v=load(path);assert sha(path)==entries[path.as_posix()]['sha256'];assert path.as_posix() in closureBindings
 if ks is not None:assert set(v)==set(ks.split())
 if name.endswith('MANIFEST.json'):
  for a in v['files']:
   assert set(a) in [{'path','sha256'},{'path','sha256','preserved'}]
   archive=Path(a.get('preserved',path.parent/Path(a['path']).name));assert sha(archive)==a['sha256'];artifacts.append(ref(archive))
 if name.endswith('PREFLIGHT.json'):assert set(v['typecheck'])=={'status','diagnostic','scope'} and v['typecheck']['status']=='FAIL'
 if 'BUILD' in name:assert v['status']=='PASS' and v['exitCode']==0 and v['referenceTests']==328 and v['focusedTests']==(13 if 'COMPONENT' in name else 21)
 if name.endswith('STATUS.json'):
  assert v['heapMB']==4096 and v['concurrency']==4 and len(v['workers'])==12
  for i,w in enumerate(v['workers']):assert set(w)=={'part','status','started','exitCode','finished'} and w['part']==i and w['status']=='PASS' and w['exitCode']==0 and w['started']<w['finished']
 if name=='DEVELOPMENT_PUBLIC_MEMORY_STOP_OUTPUTS_REV1.json':
  assert [x['part'] for x in v]==[0,1,2,3,8,9,10,11]
  for x in v:
   assert set(x)=={'part','status','value'} and x['status']=='fulfilled';r=x['value'];assert set(r)=={'chunk_id','wall_time_seconds','exit_code','original_token_count','output'} and r['exit_code']==1
   if x['part']<4:assert r['output']==f"PASS prefix {x['part']+12}:16\n"
   else:assert 'FATAL ERROR: Reached heap limit Allocation failed - JavaScript heap out of memory' in r['output'] and 'Native stack trace' in r['output']
 sources[path.as_posix()]=v;roles.append(dict(**ref(path),role='WHOLE DEVELOPMENT PRESERVATION / OPERATIONAL METADATA',judgment=judgment,acceptanceChain=[closureBindings[path.as_posix()],ref(path)]))
# Exact archived correction diffs; do not assert production equality from prose.
for lane in ['component','public']:
 a=P/f'development-{lane}-dev1';b=P/f'development-{lane}-dev2'
 ma=load(a/'MANIFEST.json');mb=load(b/'MANIFEST.json');bm={x['path']:x for x in mb['files']}
 for x in ma['files']:
  if not x['path'].endswith('.test.ts'):assert x['sha256']==bm[x['path']]['sha256']
 old=(a/f'development{lane.capitalize()}.test.ts').read_text();new=(b/f'development{lane.capitalize()}.test.ts').read_text()
 if lane=='component':
  expected=old.replace("import {describe,it,expect} from 'vitest';","import {describe,it,expect,vi} from 'vitest';")
  marker="import {profile,developmentFrames,simpleFrame} from './developmentFixtures';"
  expected=expected.replace(marker,marker+'\nvi.setConfig({testTimeout:180000});')
 else:expected=old.replace('s.input.events[0].payload=list([]);','Object.assign(s.input.events[0],{payload:list([])});')
 assert expected==new
def walk(v,p=''):
 if isinstance(v,dict):
  for k,x in v.items():yield from walk(x,p+'/'+k)
 elif isinstance(v,list):
  for i,x in enumerate(v):yield from walk(x,p+'/'+str(i))
 elif isinstance(v,str):yield p,v
allStrings={(p,ptr):s for p,v in sources.items() for ptr,s in walk(v)};rows=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in sources:continue
  assert allStrings[(u['source'],u['location']['pointer'])]==u['text']
  name=u['source'][len(P.as_posix())+1:];backing=name=='DEVELOPMENT_PUBLIC_MEMORY_STOP_OUTPUTS_REV1.json' or u['location']['pointer']=='/command'
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],role='OPERATIONAL BACKING' if backing else 'PRESERVED FINDING / SCOPE',judgment=specs[name][1]))
obs=['RO-C3-008','RO-C3-009','RO-C3-010','RO-C3-013','RO-C3-017','RO-C3-019','RO-C3-020','RO-C3-021','RO-C3-022'];O.mkdir(exist_ok=True)
v=dict(status='TWELVE DEVELOPMENT METADATA SOURCES RECONCILED; HQ011 OPEN',sourceRoles=roles,rows=rows,stringLeaves=len(allStrings),preservedArtifacts=artifacts,obligations=obs,limits=['Component test LF-to-CRLF conversion is normalized only for textual comparison; exact archive hashes remain distinct. Exact test-only diffs preserve production hashes; new second-cohort support sources retain their distinct identities.','Captured tool output is not complete diagnostics for every failed worker. Historical elapsed times do not establish a scaling guarantee.','No fresh build, tests, simulation or restore. Referenced archives are not wholesale narrative acceptance.'])
save(O/'review.json',v);c=dict(status=v['status'],sources=12,originalOccurrences=len(rows),originalNarrativeOccurrences=sum(r['role']=='PRESERVED FINDING / SCOPE' for r in rows),originalBackingOccurrences=sum(r['role']=='OPERATIONAL BACKING' for r in rows),stringLeaves=len(allStrings),preservedArtifacts=len(artifacts),reviewSha256=sha(O/'review.json'),checkerSha256=sha(__file__));save(O/'check.json',c);print(json.dumps(c))
