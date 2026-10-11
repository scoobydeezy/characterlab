"""HQ011: fixed producer roles, including strings missed by prose extraction."""
from pathlib import Path
import json,hashlib,re,collections,subprocess
P=Path('docs/planning');B=P/'campaign3-history-universe-rev1';O=P/'campaign3-history-regulatory-backing-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def ref(p):return dict(path=str(p).replace('\\','/'),sha256=sha(p))
def save(p,v):
 if p.exists():assert load(p)==v,p
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
def compact(v):return json.dumps(v,ensure_ascii=False,separators=(',',':'))
def keys(v,ks):assert isinstance(v,dict) and set(v)==set(ks.split()),('shape',ks)
def numbers(v,nullable=False):
 for x in v.values():assert type(x)is int or nullable and x is None,('numeric',x)
def en(x,words):assert x in words.split(),x
def hx(x):assert isinstance(x,str) and re.fullmatch(r'(?:[0-9a-f]{2})+',x)
def digest(x):assert isinstance(x,str) and re.fullmatch(r'[0-9a-f]{64}',x)
def boolean(x):assert type(x)is bool
def natural(x):assert type(x)is int and x>=0
def fraction(x):assert isinstance(x,str) and re.fullmatch(r'-?\d+/[1-9]\d*',x)
A='drug meal drink sleep relax work alternative withhold';D='pleasure withdrawal hunger thirst sleep pain stress harm';C='reward stress arousal'
S='hunger thirst sleepiness pain intoxication reward pleasure stress arousal withdrawalReward withdrawalStress withdrawalArousal'
N='NoHarm FalseHarm NoGoal DeniedHarm NoReceipt NoImpulse HiddenA HiddenB'
def domain(v):keys(v,D);numbers(v,True)
def sensation(v):keys(v,S);numbers(v,True)
def affect(v):keys(v,'pleasure distress threat');numbers(v,True)
def beliefs(v):
 keys(v,A)
 for x in v.values():domain(x)
def habit(v):keys(v,A);numbers(v)
def grounds(v):
 assert isinstance(v,list)
 for g in v:
  keys(g,'option domain strength');en(g['option'],A);en(g['domain'],'practice');assert type(g['strength'])is int
def choice(v,native=False):
 keys(v,'chosen mode probabilities draws authorship'+('' if native else ' nuclei'))
 en(v['chosen'],A);en(v['mode'],'NoActiveReasons Auto QuietRoll PlayerFacingRoll');fraction(v['authorship'])
 assert isinstance(v['probabilities'],list) and isinstance(v['draws'],list)
 for p in v['probabilities']:keys(p,'name probability');en(p['name'],A);fraction(p['probability'])
 for d in v['draws']:keys(d,'address result span');hx(d['address']);natural(d['result']);natural(d['span']);assert d['result']<d['span']
 if not native:
  assert isinstance(v['nuclei'],list)
  for n in v['nuclei']:hx(n)
def body(v):
 keys(v,'at fuel water sleepDebt damage burden phase channels');numbers({k:x for k,x in v.items() if k!='channels'});keys(v['channels'],C)
 for r in v['channels'].values():
  keys(r,'level displacement satiation tolerance sensitization');numbers({k:r[k] for k in ['level','displacement','satiation']})
  # This frozen fixture has no physiological adaptation map entries.
  keys(r['tolerance'],'');keys(r['sensitization'],'')
def terms(v):
 keys(v,C)
 for r in v.values():
  keys(r,'decay network effects beforeClip overflow target');numbers({k:x for k,x in r.items() if k!='effects'});assert isinstance(r['effects'],list)
  for e in r['effects']:
   keys(e,'channel exposure dose direction tolerance sensitization satiation potential effective');en(e['channel'],'stress');en(e['exposure'],'appraised-threat');numbers({k:x for k,x in e.items() if k not in ['channel','exposure']})
def row(r):
 keys(r,'at before after protection work maintained control inhibited beliefs habit affect grounds choice intent expression receipt errors')
 natural(r['at']);sensation(r['before'])
 if r['after'] is not None:sensation(r['after'])
 for k in ['protection','work','maintained','inhibited']:boolean(r[k])
 assert r['control'] is None or type(r['control'])is int
 beliefs(r['beliefs']);habit(r['habit']);affect(r['affect']);grounds(r['grounds']);choice(r['choice']);en(r['intent'],A)
 if r['receipt'] is not None:domain(r['receipt'])
 assert isinstance(r['errors'],dict) and set(r['errors'])<=set(D.split());numbers(r['errors'])
 expected={k:r[k] for k in ['at','intent','choice','grounds']}
 assert r['expression']==compact(expected),'serialized expression differs from declared structured decision'
def observer(v):
 keys(v,'at history protection work maintained rows');natural(v['at'])
 for k in ['protection','work','maintained']:boolean(v[k])
 assert isinstance(v['history'],list) and isinstance(v['rows'],list)
 for h in v['history']:keys(h,'at action cue outcomes');natural(h['at']);en(h['action'],A);boolean(h['cue']);domain(h['outcomes'])
 for r in v['rows']:row(r)
def snapshot(v):
 keys(v,'at history protection work maintained rows state world');observer({k:x for k,x in v.items() if k not in ['state','world']});body(v['state']);assert isinstance(v['world'],list)
 for w in v['world']:
  keys(w,'at state terms executed challenge');natural(w['at']);natural(w['challenge']);en(w['executed'],A);body(w['state']);keys(w['terms'],'elapsed consequence');terms(w['terms']['elapsed']);terms(w['terms']['consequence'])
def receipt(r):keys(r,'prefix saveHash successorHash advanced');natural(r['prefix']);digest(r['saveHash']);digest(r['successorHash']);boolean(r['advanced'])
def component(v):
 keys(v,'planSha256 name seed runIdentity prefixes snapshot observer');digest(v['planSha256']);en(v['name'],N);natural(v['seed']);hx(v['runIdentity']);snapshot(v['snapshot']);observer(v['observer']);assert isinstance(v['prefixes'],list)
 for r in v['prefixes']:receipt(r)
 assert v['observer']=={k:x for k,x in v['snapshot'].items() if k not in ['state','world']}
def native(v):
 keys(v,'planSha256 name seed modelIdentity runIdentity prefixes apps decisions outcomes physical hashes restored observerHash stateHash traceHash')
 for k in ['planSha256','observerHash','stateHash','traceHash']:digest(v[k])
 for k in ['modelIdentity','runIdentity']:hx(v[k])
 en(v['name'],N);natural(v['seed'])
 for p in v['prefixes']:natural(p)
 for r in v['restored']:receipt(r)
 for h in v['hashes']:keys(h,'prefix hash');natural(h['prefix']);digest(h['hash'])
 for a in v['apps']:
  keys(a,'before beliefs habit control inhibited affect grounds goals options');sensation(a['before']);beliefs(a['beliefs']);habit(a['habit']);assert a['control'] is None or type(a['control'])is int;boolean(a['inhibited']);affect(a['affect']);grounds(a['grounds']);keys(a['goals'],'protection work maintained')
  for g in a['goals'].values():boolean(g)
  for option in a['options']:en(option,A)
 for d in v['decisions']:choice(d,True)
 for o in v['outcomes']:
  if o is not None:domain(o)
 for p in v['physical']:
  keys(p,'challenge executed transition');natural(p['challenge']);en(p['executed'],A);t=p['transition'];keys(t,'state consequenceState terms');body(t['state']);body(t['consequenceState']);terms(t['terms'])

planPath=P/'AFFECT_REGULATORY_PLAN_REV1.json';resultPath=P/'AFFECT_REGULATORY_RESULT_REV1.json';plan=load(planPath);result=load(resultPath);planHash=sha(planPath)
entries={e['path']:e for e in load(B/'manifest.json')['entries']};artifacts={a['path']:a['sha256'] for a in result['artifacts']}
for a in plan['artifacts']:assert sha(a['path'])==a['sha256'],a['path']
assert result['planSha256']==planHash
sources=[];data={};counts=collections.Counter();expressions=0
def count_strings(v,p=''):
 global expressions
 if isinstance(v,dict):
  for k,x in v.items():count_strings(x,p+'/'+k)
 elif isinstance(v,list):
  for x in v:count_strings(x,p+'/*')
 elif isinstance(v,str):
  counts[p]+=1
  if p.endswith('/expression'):expressions+=1
for path in sorted((P/'affect-regulatory-execution-rev1').glob('*.json')):
 p=path.as_posix();v=load(path);h=sha(path);assert h==artifacts[p]==entries[p]['sha256'];assert v['planSha256']==planHash
 isNative=path.name.startswith('native-');(native if isNative else component)(v)
 identity=next(n for n in plan['native'] if n['name']==v['name']) if isNative else plan['sources'][int(path.stem.split('-')[1])]
 assert (v['name'],v['seed'],v['runIdentity'])==(identity['name'],identity['seed'],identity['runIdentity'])
 if isNative:assert v['modelIdentity']==identity['modelIdentity'] and v['prefixes']==identity['prefixes']
 else:
  assert v['snapshot']['at']==12 and len(v['snapshot']['rows'])==len(v['snapshot']['world'])==12 and len(v['prefixes'])==13
  for j,r in enumerate(v['prefixes']):assert r['prefix']==j and r['advanced']==(j<12) and r['successorHash']==v['prefixes'][min(j+1,12)]['saveHash']
 before=sum(counts.values());count_strings(v);sources.append(dict(path=p,sha256=h,role='WHOLE TYPED BIOLOGY NATIVE RECEIPT BACKING' if isNative else 'WHOLE TYPED BIOLOGY COMPONENT TRAJECTORY BACKING',stringLeaves=sum(counts.values())-before));data[path.name]=v
assert len(sources)==68 and expressions==1536
for n in plan['native']:
 v=data['native-'+n['name']+'.json'];s=next(x for k,x in data.items() if k.startswith('source-') and x['name']==n['name'] and x['seed']==0)['snapshot']
 assert all(len(v[k])==12 for k in ['apps','decisions','outcomes','physical'])
 for i,r in enumerate(s['rows']):
  a=v['apps'][i]
  for k in ['before','beliefs','habit','control','inhibited','affect','grounds']:assert a[k]==r[k]
  assert a['goals']=={k:r[k] for k in ['protection','work','maintained']}
  assert a['options']==[r['intent']]
  assert v['decisions'][i]=={k:x for k,x in r['choice'].items() if k!='nuclei'} and v['outcomes'][i]==r['receipt']
  assert v['physical'][i]['transition']['state']==s['world'][i]['state'] and v['physical'][i]['executed']==s['world'][i]['executed']
 for r in v['restored']:
  hashes={h['prefix']:h['hash'] for h in v['hashes']};j=r['prefix'];assert r['saveHash']==hashes[j] and r['successorHash']==hashes[min(j+1,12)] and r['advanced']==(j<12)
# Corpus extraction has no prose occurrences in these68 files. Missing extraction is
# accounted by the complete string schema, not taken as evidence of empty content.
selected={s['path'] for s in sources};original=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] in selected:original.append(u['id'])
assert not original
faults=[];sample=data['source-0.json']
for label in ['extra-prose','expression-prose','unknown-choice','new-physical-field']:
 x=json.loads(json.dumps(sample))
 if label=='extra-prose':x['finding']='UNRESOLVED'
 elif label=='expression-prose':x['snapshot']['rows'][0]['expression']='This proves scalar impossibility.'
 elif label=='unknown-choice':x['snapshot']['rows'][0]['choice']['mode']='Universal'
 else:x['snapshot']['state']['diagnosis']='resolved'
 try:component(x)
 except AssertionError:faults.append(label)
 else:raise AssertionError(label)
command=['node','scripts/check-affect-regulatory.mjs'];run=subprocess.run(command,capture_output=True,text=True,encoding='utf-8');assert run.returncode==0,run.stderr
obligations=['RO-C3-002','RO-C3-006','RO-C3-008','RO-C3-010','RO-C3-011','RO-C3-019','RO-C3-020','RO-C3-021']
v=dict(status='REGULATORY BACKING ROLES REVIEWED; HQ011 OPEN',sourceRoles=sources,originalOccurrenceIds=[],originalBackingOccurrences=0,omittedStringLeaves=sum(counts.values()),serializedExpressions=expressions,stringPaths=[dict(path=p,count=n) for p,n in sorted(counts.items())],evidence=[ref(planPath),ref(resultPath),ref(P/'AFFECT_REGULATORY_CLOSURE_REV1.json'),ref(P/'campaign3-history-late-qualifications-rev1/review.json'),ref(P/'campaign3-history-late-contracts-rev1/review.json')],obligations=obligations,
 disposition='Declared producer fields and enums, numeric biological and character operands, exact digests/encoded reasons, and serialized expression records.1536 expression strings equal their structured at/intent/choice/grounds fields byte for byte; no independent free-form claims. Short labels and serialized expressions were omitted from original extraction but are fully schema-accounted here.',
 findings=['Body-history collision remains: same physical history/constitution, independently admitted harm0/600, threat0/270 and later stress0/135. This rules out a deterministic body-only projection for this consumer, not a psychological scalar.', 'FullAffect and ScalarThreat match64/64. ScalarStress56/64, ScalarPain48/64 and ScalarRewardDeviation56/64 preserve successful equalities and failed cases. Unknown and known zero remain distinct inputs despite identical zero impulse.', 'All64 trajectories use instructed inert action then withholding. No free-choice divergence, stochastic necessity, universal emotion basis or new causal edge is inferred.', 'Four native sentinels match all48 actual component instants and preserve16 selected immediate-successor restore receipts; they do not turn832 component prefixes into native restores.'],
 limits=['Schema review authenticates original produced data and closes only these68 source roles. It is not general biology validation, fresh simulation, or whole HQ011 adequacy.', 'The unchanged read-only closure checker revalidates stored bindings and discriminants. Historical tests/build are not freshly rerun.', 'Plan/result/closure/build metadata source-role reviews remain separate; reference in evidence does not claim their entire source review complete.'])
O.mkdir(exist_ok=True);save(O/'review.json',v)
save(O/'command.json',dict(command=command,exitCode=run.returncode,stdout=run.stdout,stderr=run.stderr,checker=ref(command[1]),scope='READ-ONLY AUTHENTICATION AND STORED DISCRIMINANTS; NO FRESH RUNTIME REPLAY'))
c=dict(status=v['status'],sources=68,originalOccurrences=0,omittedStringLeaves=v['omittedStringLeaves'],serializedExpressions=expressions,rejectedMutations=faults,reviewSha256=sha(O/'review.json'),commandSha256=sha(O/'command.json'),checkerSha256=sha(__file__))
save(O/'check.json',c);print(json.dumps(c))
