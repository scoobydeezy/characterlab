"""Check short-string omissions in the four reviewed finding schemas."""
from pathlib import Path
import json,hashlib,re
P=Path('docs/planning');B=P/'campaign3-history-universe-rev1';O=P/'campaign3-history-late-qualifications-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def save(p,v):
 if p.exists():assert load(p)==v,p
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
schemas={
 'LONGITUDINAL_ROUTINE_CLOSURE_REVIEW_FINDING_REV1.json':{'status','failure','cause','observed','disposition','files'},
 'LONGITUDINAL_HABIT_FREEZE_FINDING_REV1.json':{'status','failure','scope','disposition','files'},
 'LONGITUDINAL_HABIT_ORACLE_FINDING_REV1.json':{'status','failure','conformance','disposition','files'},
 'AFFECT_REGULATORY_HISTORICAL_CHECK_FINDING_REV1.json':{'status','failedCommand','failure','actual','historicalExpected','cause','verifiedCommand','verifiedExitCode','scope','files','obligations','bookkeepingFailure'}
}
review=load(O/'review.json');original={}
for r in review['rows']:
 if 'pointer' in r['location']:original[(r['source'],r['location']['pointer'])]=r
def walk(x,pointer=''):
 if isinstance(x,str):yield pointer,x
 elif isinstance(x,list):
  for i,v in enumerate(x):yield from walk(v,pointer+'/'+str(i))
 elif isinstance(x,dict):
  for k,v in x.items():yield from walk(v,pointer+'/'+k.replace('~','~0').replace('/','~1'))
supplement=[];strings=0;found=set()
for name,keys in schemas.items():
 p=P/name;j=load(p);assert set(j)==keys
 for a in j['files']:assert set(a) in [{'path','sha256'},{'original','preserved','sha256'}]
 if 'bookkeepingFailure' in j:assert set(j['bookkeepingFailure'])=={'error','archive','sha256','disposition'}
 if 'observed' in j:assert set(j['observed'])=={'seed0LaterPerformed','seeds1to7LaterPerformed'} and all(type(t)is int for values in j['observed'].values() for t in values)
 for pointer,text in walk(j):
  strings+=1;key=(p.as_posix(),pointer)
  if key in original:assert original[key]['text']==text;found.add(key);continue
  if pointer in ['/failedCommand','/verifiedCommand']:
   assert text in ['node scripts/check-biology-public-closure.mjs','node scripts/check-preserved-public-wrapper-evidence.mjs']
   role='EXECUTION COMMAND REFERENCE';meaning='Two-word command was omitted by prose extraction; preserve as backing reference to the explained old-source verification, not a new execution claim.'
  elif re.fullmatch(r'/files/\d+/(path|original|preserved)',pointer) or pointer=='/bookkeepingFailure/archive':
   role='ARTIFACT PATH';meaning='Locator whose preserved/current role and hash were checked in the finding-source review; path alone confers no authority.'
  elif re.fullmatch(r'/files/\d+/sha256',pointer) or pointer in ['/actual','/historicalExpected','/bookkeepingFailure/sha256']:
   assert re.fullmatch('[0-9a-f]{64}',text);role='EXACT BYTE DIGEST';meaning='Commitment metadata, not independently interpretable psychological prose.'
  elif re.fullmatch(r'/obligations/\d+',pointer):
   assert text in ['RO-C3-019','RO-C3-021','RO-C3-022'];role='OBLIGATION IDENTIFIER';meaning='Preserved explicit ownership link; short identifier is not a new unresolved-finding sentence.'
  else:raise AssertionError((p,pointer,text,'unclassified omitted string'))
  supplement.append(dict(source=p.as_posix(),sourceSha256=sha(p),pointer=pointer,text=text,role=role,disposition=meaning))
assert found==set(original)
v=dict(status='FOUR FINDING SCHEMAS FULL STRING COVERAGE; WIDER EXTRACTION OPEN',allStrings=strings,originalOccurrences=len(found),supplementalOmittedStrings=supplement,
 evidence=dict(path=(O/'review.json').as_posix(),sha256=sha(O/'review.json')),checkerSha256=sha(__file__),
 obligations=['RO-C3-019','RO-C3-020','RO-C3-021'],limits=['Closed top-level/file/bookkeeping schemas and all string leaves examined; omitted commands/paths/digests/IDs retained as backing.','No new supplemental psychological finding in this batch; no change to original extraction or blanket conclusion for other JSON files.','Numeric performance arrays and verifiedExitCode remain exact original backing; no original file or finding was rewritten.'])
save(O/'schema-addendum.json',v);print(json.dumps({k:v[k] for k in ['status','allStrings','originalOccurrences']}));print('Supplemental omitted strings:',len(supplement))
