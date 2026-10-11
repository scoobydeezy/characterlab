"""Classify post-cutoff Values run leaves against reviewed finite receipt schemas."""
from pathlib import Path
import json,hashlib,re,collections,subprocess
P=Path('docs/planning');O=P/'campaign3-history-values-backing-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def save(n,v):
 p=O/n
 if p.exists():assert load(p)==v,p
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
def walk(v,p=''):
 if isinstance(v,dict):
  for k,x in v.items():yield from walk(x,p+'/'+k)
 elif isinstance(v,list):
  for i,x in enumerate(v):yield from walk(x,p+'/'+str(i))
 else:yield p,v
O.mkdir(exist_ok=True)
prior=load(P/'campaign3-history-values-addition-rev1/review.json')
for x in prior['sourceRoles']+prior['findingFields']:assert ref(x['path'])['sha256']==x['sha256']
assert len(prior['rows'])==90 and sum(len(x['occurrences']) for x in prior['findingFields'])==15
sources=[];schemas=collections.defaultdict(lambda:collections.Counter());shards=[];total=0;strings=0;commands=[]
for dirname,native in [('values-matrix-rev2',False),('values-public-matrix-rev1',True)]:
 plan=load(P/dirname/'plan.json');assert len(plan['runs'])==256
 receipt=load(P/dirname/'check.json');bound={x['path']:x['sha256'] for x in receipt['artifacts']}
 for planned in plan['runs']:
  p=P/dirname/f"run-{planned['index']}.json";sr=ref(p);v=load(p);assert bound[sr['path']]==sr['sha256']
  assert v['runIdentity']==planned['runIdentity'] and v['status']=='PASS'
  rows=[]
  for pointer,value in walk(v):
   pattern=re.sub(r'/\d+(?=/|$)','/*',pointer);kind='null' if value is None else type(value).__name__;schemas[(dirname,pattern)][kind]+=1
   if not isinstance(value,str):continue
   strings+=1;leaf=pointer.rsplit('/',1)[-1]
   if pointer=='/status':assert value=='PASS';role='RECORDED RUN STATUS, NOT INDEPENDENT QUALIFICATION'
   elif pointer=='/law':assert value in ['Accumulated','Latest','NoConsolidation','Refold'];role='RETAINED COMPARATOR IDENTITY'
   elif pointer=='/name':assert value in ['Positive','Withheld','Unlinked','Neutral','Contradiction','Reversal','TargetB','Duplicate'];role='PREDECLARED CONTROL CASE'
   elif leaf=='status':assert value in ['Chosen','NoReasons','NoCandidates'];role='DISTINCT RESOLUTION VARIANT; NO INVENTED CHOICE'
   elif leaf=='chosen':assert value in ['A','B'];role='SAMPLED OUTCOME; EQUALITY/DIVERGENCE PRESERVED'
   elif leaf=='mode':assert value in ['Joint','NeedOnly','ValuesOnly'];role='CONTROLLED RECEIVING OPERAND'
   elif leaf in ['mean','weight','preference','contribution'] or '/probabilities/' in pointer:
    assert re.fullmatch(r'-?\d+/[1-9]\d*',value);role='EXACT RATIONAL OBSERVABLE; EVIDENCE WEIGHT NOT CONFIDENCE'
   elif leaf in ['runIdentity','save','reason','resolution'] or '/addresses/' in pointer:
    assert re.fullmatch(r'(?:[0-9a-f]{2})+',value);role='CANONICAL IDENTITY/STATE/TRACE BYTES; NO PROSE CLAIM'
   elif leaf.endswith('Sha256'):
    assert re.fullmatch(r'[0-9a-f]{64}',value);role='BYTE COMMITMENT; NOT TIMESTAMP OR FRESH EXECUTION'
   else:raise AssertionError((sr['path'],pointer,value[:100]))
   loc=dict(pointer=pointer);identity=hashlib.sha256(json.dumps([sr['path'],sr['sha256'],loc,value],ensure_ascii=False,separators=(',',':')).encode()).hexdigest()
   rows.append(dict(occurrenceId=identity,location=loc,valueSha256=hashlib.sha256(value.encode()).hexdigest(),role=role))
  total+=len(rows)
  out=f"{dirname}-run-{planned['index']}.json"
  save(out,dict(source=sr,role='POST-CUTOFF BACKING; EXACT TEXT RETAINED AT HASH-BOUND JSON POINTER',rows=rows))
  shards.append(ref(O/out));sources.append(dict(**sr,stringOccurrences=len(rows),evidence=ref(O/out)))
 assert len([x for x in sources if '/'+dirname+'/' in x['path']])==256
for tool in ['check-values-matrix.mjs','check-values-public-matrix.mjs','check-values-wrapper-extension.mjs']:
 cmd=['node','scripts/'+tool];r=subprocess.run(cmd,capture_output=True,text=True,encoding='utf-8');assert r.returncode==0,(cmd,r.stderr)
 commands.append(dict(command=cmd,exitCode=r.returncode,stdout=r.stdout,stderr=r.stderr,checker=ref(cmd[1]),scope='READ-ONLY STORED EVIDENCE; NO FRESH EXECUTION'))
save('commands.json',commands)
save('schema.json',dict(fields=[dict(sourceFamily=d,pointer=p,types=dict(v)) for (d,p),v in sorted(schemas.items())],shortStringsIncluded=True,nullAndNumericLeavesCounted=True,role='Exhaustive actual leaf shapes; unknown string field/value rejects. Null mean and null chosen remain typed absence, not strings or zero.'))
save('review.json',dict(status='512 POST-CUTOFF VALUES RUNS EXPLICITLY CLASSIFIED AS BACKING',checker=ref(__file__),priorNarrativeReview=ref(P/'campaign3-history-values-addition-rev1/review.json'),sources=sources,shards=shards,schema=ref(O/'schema.json'),commands=ref(O/'commands.json'),scope='Frozen run identities, prefix bytes/digests, actual rational views, resolution variants and controlled labels support the existing bounded qualification. Stable occurrence IDs bind every string including short strings to exact source bytes/pointers; text is not duplicated into giant reports.',limits=['No original census occurrence or source-role index count changes; all512 runs are post-cutoff additions.','One successor per prefix, not full tails. Four candidates retained; stored/refold equality does not prove irreducible Value or lifetime compression.','Component same-instant comparison retains3/8 divergent and5/8 equal choices; native contexts59..64 use different RNG time addresses.','Earlier90 paragraphs/15 finding fields remain authoritative scoped review. This supplement classifies512 runs, not every plan/development metadata field.','Readiness cases2/3 and autonomous part of7 remain unexecuted; no physical feedback, autonomous category/lifecycle, Values-to-appraisal or developmental qualification.','No new runtime/build, verdict, law, model or obligation closure.'],obligations=['RO-C3-010','RO-C3-019','RO-C3-020','RO-C3-021']))
save('check.json',dict(status='PASS SCOPED POST-CUTOFF BACKING REVIEW',runSources=len(sources),stringOccurrences=total,leafSchemas=len(schemas),allPrimitiveLeaves=sum(sum(v.values()) for v in schemas.values()),originalCensusOccurrencesAdded=0,readOnlyMatrixChecks=3,priorParagraphs=90,priorFindingFields=15,strongerCasesRemaining=[2,3,7],review=ref(O/'review.json')))
assert all(p.stat().st_size<50000000 for p in O.iterdir())
print(json.dumps(load(O/'check.json')))
