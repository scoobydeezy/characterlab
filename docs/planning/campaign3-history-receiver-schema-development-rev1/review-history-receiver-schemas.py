"""Read-only HQ011 classification of three frozen receiver artifact families.

Schemas are explicit producer-derived allowlists, not inferred acceptance from files.
This authenticates historical backing; it does not execute a character simulation.
"""
from pathlib import Path
from fractions import Fraction
import json, hashlib, re, collections, gzip, base64

P=Path('docs/planning'); B=P/'campaign3-history-universe-rev1'
O=P/'campaign3-history-receiver-schemas-rev1'
def load(p): return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def digest(b): return hashlib.sha256(b).hexdigest()
def sha(p): return digest(Path(p).read_bytes())
def ref(p): return dict(path=str(p).replace('\\','/'),sha256=sha(p))
def save(p,v):
 if p.exists(): assert load(p)==v,p
 else: p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
def text_bytes(s):
 b=s.encode('utf-8'); n=len(b); length=[]
 while n>=128: length.append((n&127)|128); n>>=7
 return bytes([5,*length,n])+b

def schema(family,joined=False):
 loss=family=='personal-loss'; habit=family=='habit'
 shape={}; leaf={}; arrays=set()
 def obj(p,keys): shape[p]=set(keys.split())
 def fields(p,kind,keys):
  for k in keys.split():leaf[p+'/'+k]=kind
 def enum(p,values):leaf[p]=('enum',set(values.split()))
 def array(p):arrays.add(p)
 obj('', 'planSha256 runIdentity profile prefixes restored' if joined else 'profile modelIdentity runIdentity planSha256 prefixes faults state '+('saveArchiveSha256' if loss else 'sourceRun'))
 fields('', 'hex','runIdentity')
 fields('', 'digest','planSha256')
 if not joined:
  fields('', 'hex','modelIdentity'+('' if loss else ' sourceRun'))
  if loss: fields('', 'digest','saveArchiveSha256')
 for p in ['/profile']+([] if joined else ['/state/profile']):
  obj(p,'law seed '+('condition' if loss else 'alternateCue visible keepEpisodes '+('relearning' if habit else 'mode')))
  fields(p,'uint','seed')
  enum(p+'/law','Latest Mean NoLearning NoAffect HistoricalProduct' if loss else 'Derived Stored ExplicitBeliefOnly ScheduledOnly EraseHistory')
  if loss:enum(p+'/condition','ReportedLoss HiddenLoss NoLoss FalseLoss Corrected Recovered OneInteraction MaskedAcquisition WithdrawnGoal HighControl FailedSupport StrongContinuity')
  else:
   fields(p,'bool','alternateCue visible keepEpisodes')
   enum(p+('/relearning' if habit else '/mode'),'Observed Hidden Unavailable' if habit else 'Maintained Withdrawn Opposed')
 array('/prefixes'); p='/prefixes/*'
 obj(p,'prefix nativeHash receiverHash pairHash joinedHash' if joined else 'prefix saveHash successorHash advanced'+('' if loss else ' pairHash successorPairHash'))
 fields(p,'uint','prefix'); fields(p,'digest','nativeHash receiverHash pairHash joinedHash' if joined else 'saveHash successorHash'+('' if loss else ' pairHash successorPairHash'))
 if not joined:fields(p,'bool','advanced')
 if joined:
  array('/restored');obj('/restored/*','prefix saveHash successorHash advanced');fields('/restored/*','uint','prefix');fields('/restored/*','digest','saveHash successorHash');fields('/restored/*','bool','advanced')
  return shape,leaf,arrays
 array('/faults');obj('/faults/*','prefix fault unchanged successorHash');fields('/faults/*','uint','prefix');fields('/faults/*','digest','successorHash');enum('/faults/*/fault','after-choice before-commit');fields('/faults/*','bool','unchanged')
 obj('/state','version profile actor prefix history belief goals rows '+('target' if loss else 'cache'+(' memory protocol' if habit else '')))
 enum('/state/version',f'longitudinal-{family}-component/0.1-candidate');fields('/state','hex','actor history '+('target' if loss else 'cache'));fields('/state','uint','prefix');fields('/state','hex?' if loss else 'bool?','belief')
 for p in ['/state/goals','/state/rows/*/goalsBefore','/state/rows/*/goalsAfter']:
  array(p);obj(p+'/*','id status adoptedAt activeFrom expiresAt changedAt'+('' if loss else ' desired'))
  fields(p+'/*','decimal','adoptedAt activeFrom expiresAt changedAt');enum(p+'/*/status','Open Withdrawn Expired');enum(p+'/*/id','continuity support' if loss else 'practice rest'+(' renew' if habit else ''))
  if not loss:enum(p+'/*/desired','0/1 1/1')
 array('/state/rows');r='/state/rows/*'
 obj(r,'at historyBefore historyAfter beliefBefore beliefAfter goalsBefore goalsAfter choice '+('appraisal participated admitted report physicalContact contactCompleted supportCompleted' if loss else 'cue opportunity standing strength available performed observed'+(' episodesBefore episodesAfter practiceBefore practiceAfter losses' if habit else '')))
 fields(r,'uint','at');fields(r,'hex','historyBefore historyAfter');fields(r,'hex?' if loss else 'bool?','beliefBefore beliefAfter')
 if loss:
  fields(r,'bool','participated admitted physicalContact contactCompleted supportCompleted');fields(r,'bool?','report')
  a=r+'/appraisal';obj(a,'count continuity support availability likelihood severity control coordinates modifier');fields(a,'uint','count modifier');fields(a,'bool','continuity support');fields(a,'fraction?','availability likelihood');fields(a,'fraction','severity control');array(a+'/coordinates');leaf[a+'/coordinates/*']='fraction'
 else:
  fields(r,'bool','cue opportunity available performed observed');fields(r,'fraction','standing strength')
 c=r+'/choice';obj(c,'chosen mode probabilities nuclei draws authorship');leaf[c+'/chosen']=('enum?',set(('contact support' if loss else 'practice idle').split()));enum(c+'/mode','NoActiveReasons Auto QuietRoll PlayerFacingRoll');fields(c,'fraction','authorship')
 for k in ['probabilities','nuclei','draws']:array(c+'/'+k)
 obj(c+'/probabilities/*','name probability');enum(c+'/probabilities/*/name','contact support' if loss else 'practice idle');fields(c+'/probabilities/*','fraction','probability');leaf[c+'/nuclei/*']='hex'
 obj(c+'/draws/*','address result span');fields(c+'/draws/*','hex','address');fields(c+'/draws/*','uint','result span')
 if habit:
  fields(r,'uint','episodesBefore episodesAfter practiceBefore practiceAfter');array(r+'/losses');obj(r+'/losses/*','acquisition unit');fields(r+'/losses/*','decimal','acquisition');enum(r+'/losses/*/unit','context practice')
  array('/state/memory');m='/state/memory/*';obj(m,'id acquiredAt kind units');fields(m,'decimal','id acquiredAt');enum(m+'/kind','EventContinuant');array(m+'/units');obj(m+'/units/*','key views');enum(m+'/units/*/key','context practice');array(m+'/units/*/views');array(m+'/units/*/views/*');leaf[m+'/units/*/views/*/*']='byte'
  array('/state/protocol');p='/state/protocol/*';obj(p,'source character kind acquisition formedAt completeLoss');fields(p,'source','source');enum(p+'/character','longitudinal-target');enum(p+'/kind','EventContinuant');fields(p,'decimal','acquisition formedAt');fields(p,'bool','completeLoss')
 return shape,leaf,arrays

def validate(x,s,p='',counts=None):
 shape,leaf,arrays=s
 if isinstance(x,dict):
  assert p in shape and set(x)==shape[p],(p,'unknown/missing fields')
  for k,v in x.items():validate(v,s,p+'/'+k,counts)
 elif isinstance(x,list):
  assert p in arrays,(p,'array')
  for v in x:validate(v,s,p+'/*',counts)
 else:
  assert p in leaf,(p,'undeclared leaf');kind=leaf[p];tag=kind[0] if isinstance(kind,tuple) else kind
  if x is None:assert tag.endswith('?'),(p,'null');return
  tag=tag.rstrip('?')
  if tag=='enum':assert isinstance(x,str) and x in kind[1],(p,x)
  elif tag=='bool':assert type(x)is bool,p
  elif tag in ['uint','byte']:assert type(x)is int and 0<=x and (tag!='byte' or x<=255),p
  else:
   assert isinstance(x,str),p
   if tag=='hex':assert re.fullmatch(r'(?:[0-9a-f]{2})+',x),p
   elif tag=='digest':assert re.fullmatch(r'[0-9a-f]{64}',x),p
   elif tag=='decimal':assert re.fullmatch(r'0|[1-9]\d*',x),p
   elif tag=='source':assert re.fullmatch(r'admitted-[1-9]\d*',x),p
   elif tag=='fraction':
    assert re.fullmatch(r'-?\d+/[1-9]\d*',x),p
    q=Fraction(x);assert x==f'{q.numerator}/{q.denominator}',p
   else:raise AssertionError((p,tag))
  if isinstance(x,str) and counts is not None:counts[(p,tag)]+=1

entries={e['path']:e for e in load(B/'manifest.json')['entries']}
sources=[];archives=[];evidence=[];totals={};schemas={};original=[];samples=[]
for family,rev,total in [('routine',1,504),('habit',2,960),('personal-loss',1,480)]:
 name=family.upper().replace('-','_');directory=P/f'longitudinal-{family}-execution-rev{rev}'
 pp=P/f'LONGITUDINAL_{name}_PLAN_REV{rev}.json';mp=P/f'LONGITUDINAL_{name}_MATRIX_REV{rev}.json';plan=load(pp);matrix=load(mp);ph=sha(pp)
 assert matrix['planSha256']==ph and len(plan['runs'])==total
 artifacts={a['path']:a['sha256'] for a in matrix['artifacts']}
 for a in plan['artifacts']:assert sha(a['path'])==a['sha256'],a['path']
 evidence.extend([ref(pp),ref(mp)])
 allCounts=collections.Counter();stringCount=0;prefixCount=0;faultCount=0;joinedCount=0
 for path in sorted(directory.glob('*.json')):
  p=path.as_posix();v=load(path);h=sha(path);assert h==artifacts[p]==entries[p]['sha256'],p
  joined=path.stem.startswith('joined-');i=int(path.stem.split('-')[-1]);identity=plan['runs'][i]
  assert v['planSha256']==ph and v['profile']==identity['profile'] and v['runIdentity']==identity['runIdentity']
  s=schema(family,joined);counts=collections.Counter();validate(v,s,counts=counts);allCounts.update(counts);n=sum(counts.values());stringCount+=n
  horizon=12 if family=='personal-loss' else 16;prefixes=v['prefixes'];assert len(prefixes)==horizon+1
  if joined:
   joinedCount+=1;parent=load(directory/f'{i:03}.json')
   source=next(x for x in plan['sources'] if x['seed']==v['profile']['seed'] and (family=='habit' or x['keepEpisodes']==v['profile']['keepEpisodes']))
   for j,r in enumerate(prefixes):
    assert r['prefix']==j and r['nativeHash']==source['nativeHashes'][j] and r['receiverHash']==parent['prefixes'][j]['saveHash'] and r['pairHash']==parent['prefixes'][j]['pairHash']
   assert [r['prefix'] for r in v['restored']]==[8,16]
   for r in v['restored']:
    j=r['prefix'];assert r['saveHash']==prefixes[j]['joinedHash'] and r['successorHash']==prefixes[min(j+1,16)]['joinedHash'] and r['advanced']==(j<16)
  else:
   assert v['modelIdentity']==identity['modelIdentity'] and v['state']['profile']==v['profile'] and v['state']['prefix']==horizon
   assert [r['at'] for r in v['state']['rows']]==(list(range(1,13)) if horizon==12 else list(range(1,9))+list(range(14,22)))
   for j,r in enumerate(prefixes):
    assert r['prefix']==j and r['advanced']==(j<horizon) and r['successorHash']==prefixes[min(j+1,horizon)]['saveHash']
    if horizon==16:assert r['successorPairHash']==prefixes[min(j+1,horizon)]['pairHash']
   prefixCount+=len(prefixes);faultCount+=len(v['faults'])
   for f in v['faults']:assert f['unchanged'] is True and f['successorHash']==prefixes[f['prefix']+1]['saveHash']
   for row in v['state']['rows']:
    for d in row['choice']['draws']:assert 0<=d['result']<d['span']
   if horizon==16:
    source=next(x for x in plan['sources'] if x['seed']==v['profile']['seed'] and (family=='habit' or x['keepEpisodes']==v['profile']['keepEpisodes']))
    assert v['sourceRun']==source['sourceRun']
    assert [(r['at'],r['standing']) for r in v['state']['rows']]==[(r['at'],r['standing']) for r in source['observations']]
   else:
    ap=path.with_suffix('.saves.gz');ah=sha(ap);assert ah==v['saveArchiveSha256']==artifacts[ap.as_posix()]
    saved=json.loads(gzip.decompress(ap.read_bytes()));assert len(saved)==13
    for j,encoded in enumerate(saved):
     raw=base64.b64decode(encoded,validate=True);assert digest(raw)==prefixes[j]['saveHash']
     assert raw[0]==5;offset=1;size=0;shift=0
     while True:
      byte=raw[offset];offset+=1;size|=(byte&127)<<shift;shift+=7
      if byte<128:break
     assert len(raw)-offset==size
     state=json.loads(raw[offset:].decode('utf-8'));validate(state,s,'/state')
     assert state['prefix']==j and state['profile']==v['profile'] and len(state['rows'])==j
     if j==12:assert state==v['state']
    archives.append(dict(path=ap.as_posix(),sha256=ah,saves=13,role='AUTHENTICATED ORIGINAL CANONICAL TEXT SAVES; CLOSED RECEIVER STATE SCHEMA'))
   final=text_bytes(json.dumps(v['state'],ensure_ascii=False,separators=(',',':')))
   assert digest(final)==prefixes[-1]['saveHash'],p
   if i==0:samples.append((family,v,s))
  sources.append(dict(path=p,sha256=h,family=family,role='JOINED REPLAY RECEIPT BACKING' if joined else 'WHOLE CLOSED-SCHEMA RECEIVER TRAJECTORY BACKING',stringLeaves=n))
 assert joinedCount==(0 if horizon==12 else 4)
 totals[family]=dict(receivers=total,joined=joinedCount,receiverPrefixes=prefixCount,faultReceipts=faultCount,stringLeaves=stringCount)
 schemas[family]=[dict(path=k[0],role=k[1],count=n) for k,n in sorted(allCounts.items())]
selected={s['path'] for s in sources};occurrences=collections.Counter()
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in selected:continue
  assert u['sourceSha256']==entries[u['source']]['sha256']
  # Every extracted original unit is an explicit closed goal lifecycle field.
  assert re.fullmatch(r'/state/(goals/\d+|rows/\d+/goals(?:Before|After)/\d+)/status',u['location']['pointer']),u['location']
  assert u['text']=='Open',u['text']
  original.append(u['id']);occurrences[u['source']]+=1
for s in sources:s['originalBackingOccurrences']=occurrences[s['path']]
faults=[]
for family,v,s in samples:
 for mutation in ['new-prose','unknown-status','numeric-prose']:
  x=json.loads(json.dumps(v))
  if mutation=='new-prose':x['finding']='OPEN'
  elif mutation=='unknown-status':x['state']['goals'][0]['status']='UNRESOLVED'
  else:x['state']['rows'][0]['choice']['authorship']='strong'
  try:validate(x,s)
  except AssertionError:faults.append(family+':'+mutation)
  else:raise AssertionError(mutation)
assert len(sources)==1952 and len(archives)==480
obligations=['RO-C3-009','RO-C3-012','RO-C3-013','RO-C3-014','RO-C3-017','RO-C3-019','RO-C3-020','RO-C3-021']
review=dict(status='THREE RECEIVER FAMILIES AUTHENTICATED AND SCHEMA-REVIEWED; HQ011 OPEN',sourceRoles=sources,archives=archives,totals=totals,schemas=schemas,originalOccurrenceIds=original,originalBackingOccurrences=len(original),allStringLeaves=sum(t['stringLeaves'] for t in totals.values()),evidence=evidence+[ref(P/'campaign3-history-late-qualifications-rev1/review.json'),ref(P/'campaign3-history-late-contracts-rev1/review.json')],obligations=obligations,
 disposition='All fields checked against inspected fixed producers, identities/plans/matrix and original census bytes. Open is goal lifecycle, not an outstanding research finding. Other closed strings are counted by schema and remain reconstructible in exact originals. No original source is deleted or superseded.',
 limits=['No fresh runtime reconstruction, native admission or psychological law is qualified by this check. Stored receipts are historical evidence, not new executions.', 'Routine native episode loss differs from habit practice episode loss; neither proves global erasure or removal of retained raw journals.', 'Personal-loss physical fields remain separate from cognitive operands; last-coordinate choice consumption does not establish vector necessity.', 'Joined receipts authenticate eight selected original horizons only; they do not promote all receiver runs to native admission.', 'The 6240 archived personal-loss saves are authenticated original state bytes and schema-checked, not 6240 new narrative occurrences.'])
O.mkdir(exist_ok=True);save(O/'review.json',review)
check=dict(status=review['status'],sources=len(sources),archives=len(archives),originalBackingOccurrences=len(original),allStringLeaves=review['allStringLeaves'],omittedStringLeaves=review['allStringLeaves']-len(original),totals=totals,rejectedSchemaMutations=faults,reviewSha256=sha(O/'review.json'),checkerSha256=sha(__file__))
save(O/'check.json',check);print(json.dumps(check))
