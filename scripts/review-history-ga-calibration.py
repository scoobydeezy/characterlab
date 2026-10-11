from pathlib import Path
import json,hashlib
P=Path('docs/planning');O=P/'campaign3-history-ga-calibration-rev1';B=P/'campaign3-history-universe-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def walk(v,p=''):
 if isinstance(v,dict):
  for k,x in v.items():yield from walk(x,p+'/'+k)
 elif isinstance(v,list):
  for i,x in enumerate(v):yield from walk(x,p+'/'+str(i))
 elif isinstance(v,str):yield p,v
def save(p,v):
 if p.exists():assert load(p)==v
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
common='Bounded policy/declaration evidence,not public model activation or psychological law selection. Six binding tests and twelve symbolic faults freshly executed; numeric encoder and complete runtime were not rerun.'
notes={
'docs/planning/GA_CALIBRATION_DEFINITIONS_REV1.md':'Twelve separate parameter records reuse governed1027. Selector519 Unlimited can select three while capacity enum remains0..2. Spatial,encoding,association,event access,body recall,retention,graph and feedback retain owners and independent budgets. Homogeneous3/10 and role factors remain bounded;floor1/5 or1,threshold1/4 are recipes. Independent/retired-flat remain footprint/floor controls;shared/hybrid are not silently conserved resource laws. Graph30/870 differs from math32 ceiling;directed positive edge loss and empty-node cleanup separate from child-slot B0 retention. Body/baseline independently bound;BothDirections/DeteriorationOnly retained. Component numeric claims remain separately evidenced,not newly proven by symbolic review.',
'docs/planning/GA_CALIBRATION_DEFINITIONS_REV1.json':'Twelve records preserve four encoding laws,four retention priorities,two qualification laws,independent recall slots and eight optional execution-policy fields. GraphScale1..1000,decay1..16,recall0..32,memory0..1024,graph0..30/0..870,body1..3 signals/views,bytes1..65536,selection count0..3 are exact bounded grammar. Beta below1 and edge<=N(N-1),B0 priority and actual LastUpdatedAt remain refinements,not enforced solely by their text. Feedback1-q/1+q is CandidateA only;disabled numeric branch retains producer checks;A/B/C remain comparisons under ratified scope. Horizon<=100/completed selection<=32 are cohort/work constraints,not psychology. Source dependencies all exact via Git archive for encoder.',
'docs/planning/GA_CALIBRATION_REVIEW_REV1.json':'Twelve original mutants reproduce graph/carrier ceilings,zero recall,body bounds,separate baseline slots,no new policy identity/allocation,no body graph coupling,retired comparator,B0 credit,definition-vs-experience and truth exclusion. Also checks source-profile ExecutionPolicy field. Structural review is not runtime refinement/value enforcement;exact reviewer output reconstructed with original encoder hash read from recovered bytes.',
'docs/formal/OBSERVATION_EXECUTION_POLICY_BINDING_COMPONENT.md':'Version observation-execution-policy-binding/0.1-candidate. Required slots iff uses requested;visual selection needs selector/spatial/encoding;bodycue and goalbaseline separate despite same definition kind;assessment also qualification; sensing-only zero resolver calls. Exact shapes validated before trusted immutable resolver;detached identities prevent resolver/caller mutation. Six unchanged source tests execute these distinctions including hostile descriptor rejection. Resolver kind is not definition value/schema/version admission. No clock/state/source/eligibility selects policy;zero capacity does not remove selector or cue.',
'docs/formal/CALIBRATED_SELECTED_SPATIAL_ENCODING_COMPONENT.md':'Version calibrated-selected-spatial-encoding/0.1-candidate. Default budget1 threshold1/4 preserved;explicit calibrated one-use selected-only entry accepts four laws,budget(0,1],threshold[0,1],calls existing exact kernel. No rescaling,learned calibration,state read or conservation reinterpretation. EqualPriority/Unlimited are existing519 values2/3,not expanded capacity enum;eligibility and533 binding/claim constraints unchanged. Selector owns1143,positive projection no identity,later producer one acquisition. Current symbolic/binding checks do not themselves execute those numeric claims;earlier component/public qualification remains separate.'}
replay=load(O/'replay.json');assert len(replay['row']['faults'])==12
for f in [replay['row']['script'],replay['row']['output'],replay['tests']]+replay['inputs']:assert ref(f['path'])==f
archive=replay['archive'];assert ref(archive['path'])['sha256']==archive['sha256']
t=load(replay['tests']['path']);assert t['numTotalTests']==t['numPassedTests']==6 and t['numFailedTests']==0
entries={x['path']:x for x in load(B/'manifest.json')['entries']};assigned={x['path'] for x in load(P/'campaign3-history-source-roles-rev158/index.json')['roleAssignments']}
roles=[];strings={};bindings=[]
for n,j in notes.items():
 p=n;assert p not in assigned and ref(p)['sha256']==entries[p]['sha256']
 roles.append(dict(**ref(p),role='CALIBRATION AND EXECUTION POLICY HISTORY; OWNERS AND COMPARATORS PRESERVED',judgment=j+' '+common,acceptanceChain=[ref(O/'replay.json')]))
 if p.endswith('.json'):
  v=load(p)
  for ptr,s in walk(v):strings[p,ptr]=s
  for f in v['sources']:
   actual=ref(f['path'])
   if actual!=f:assert f['path']==archive['originalPath'] and f['sha256']==archive['sha256'];actual=ref(archive['path'])
   bindings.append(dict(source=p,original=f,resolved=actual))
specs={r['path']:r['judgment'] for r in roles};rows=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in specs:continue
  ptr=u['location'].get('pointer','');assert u['sourceSha256']==entries[u['source']]['sha256']
  if u['source'].endswith('.json'):assert strings[u['source'],ptr]==u['text']
  narrative=u['source'].endswith('.md') or ptr in ['/status','/executionPolicy'] or any(k in ptr.split('/') for k in ['invariants','limits','compiler','refinements'])
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],role='NARRATIVE AUTHORITY/FINDING' if narrative else 'TYPED EVIDENCE BACKING',judgment=specs[u['source']]))
r=dict(status='CALIBRATION POLICY HISTORY RECONCILED; HQ011 OPEN',sourceRoles=roles,rows=rows,stringLeaves=len(strings),bindings=bindings,preservedArtifacts=[dict(**ref(archive['path']),method=archive['method'])],limits=[common,'Actual policy kind binding is not full schema/value/producer admission;CandidateA feedback is not a settled general law.'])
c=dict(status='PASS; HQ011 OPEN',sources=len(roles),originalNarrativeOccurrences=sum(x['role'].startswith('NARRATIVE') for x in rows),originalBackingOccurrences=sum(x['role'].startswith('TYPED') for x in rows),stringLeaves=len(strings),resolvedBindings=len(bindings),unavailableBindings=0,freshSymbolicFaults=12,freshPassingAssertions=6,recoveredArtifacts=1,checker=ref(__file__))
save(O/'review.json',r);save(O/'check.json',c);print(json.dumps(c))
