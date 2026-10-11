from pathlib import Path
import json,hashlib
P=Path('docs/planning');O=P/'campaign3-history-ga-body-carriers-rev1';B=P/'campaign3-history-universe-rev1'
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
common='Symbolic field/reachability evidence only; no source authenticity,actual owner patch,fragmentation enforcement or public persistence qualification. Exact original bytes/assertions retained; no new allocation or psychological reduction.'
notes={}
body='One safe completed source feeds separately admitted selection and cue. Requested461/463 samples and safe declarations biject without physical key/resolver;three signals/three views each,nine samples. Optional227 can be justified by panel/visual even if body unavailable;present body requires shared experience,never second reservation. Requested empty selector still owns1143;selected view borrows it and zero groups form nothing. Selected groups preserve all actual present views including contradictions. Absent cue has no signal/support but may retain actual opportunity under denied cue permission;present zero remains evidence. Cue contains no intervals,context,selection identity or resolver;absent cue avoids memory reads,not source/PRJ admission. Body recall gives no automatic presentation/use/formation credit.'
for n in ['GA_BODY_PIPELINE_CARRIER_REV2.md','GA_BODY_PIPELINE_CARRIER_REV2.json']:notes[n]=body+' Initial context expressibility gap remains historical;REV3 repairs producer attachment.'
correction='REV3 adds only optional PerceivedTrialContextEvidence to BodyOpportunityEvidence. REV2 required retained context but lacked producer transport. Experience/file identity cannot reconstruct observed panel stage. Actual panel/experience/event/observer/time/support/producer equality required;equal-looking or stale caller value invalid. Body-only and visual fallback without panel have none. Selected views copy exact companion plus their own sample,not source archive;cue excludes companion. Baseline may inspect actual source separately. Context groups observations but is not causal attribution.'
for n in ['GA_BODY_PIPELINE_CARRIER_REV3.md','GA_BODY_PIPELINE_CARRIER_REV3.json']:notes[n]=body+' '+correction
notes['GA_BODY_PIPELINE_CARRIER_REVIEW_REV3.json']=body+' Ten original faults and cue reachability reproduced:context omission,forced experience,cue-selection coupling,selection-as-experience,no empty group,source archive,sample leak,physical key,bound widening,premature number. Channel/source/context equations remain unexecuted compiler obligations.'
survivor='One immutable formation header has acquisition occurrence,observer,time,source selection,seam version and closed event/body content. Retained acquisition copies header once plus only surviving children;no initial envelope or extra episode/child/fragment/motion identity. Source selection is provenance,not key/resolver. Fresh positive child has no self-credit;state uses Boolean protection and directional presence set,not score/count. Body has actual present461 views with governed signal and optional actual context,not visual strength/role/graph. Complete loss removes child evidence/metadata and final child removes acquisition;payload-free protocol history cannot recover it. Current retained positional pair is computed later from two actual observations,not acquisition ordinal or copied earlier sample. Memory/graph/presentation owners stay independent and empty states legal.'
for n in ['GA_SURVIVING_CHILD_CARRIER_REV3.md','GA_SURVIVING_CHILD_CARRIER_REV3.json']:notes[n]=survivor+' Position-bearing proposal is not old public positional qualification;actual224 witness/time binding required. Proposed32 acquisitions/shared source cap,three children/three body views bounds pre-retention batch;source at most one success. Public finite limits not inferred from component limits.'
for n in ['GA_SURVIVING_CHILD_CARRIER_REVIEW_REV3.md','GA_SURVIVING_CHILD_CARRIER_REVIEW_REV3.json']:notes[n]=survivor+' Fourteen records/40 fields;12 original faults reproduced including initial envelope,parallel identity,selection substitution,fresh credit,body strength,unavailable view,no empty state,direction count,open union,unbounded batch,premature type and source-bound overflow.96 children per kind is a ceiling with both kinds sharing32 acquisitions,not two independent32-acquisition pools.'
replay=load(O/'replay.json');assert len(replay['rows'])==5 and sum(len(r['faults']) for r in replay['rows'])==22
for row in replay['rows']:
 for k in ['script','output']:assert ref(row[k]['path'])==row[k]
entries={x['path']:x for x in load(B/'manifest.json')['entries']};assigned={x['path'] for x in load(P/'campaign3-history-source-roles-rev159/index.json')['roleAssignments']}
roles=[];strings={};bindings=[]
for n,j in notes.items():
 p=(P/n).as_posix();assert p not in assigned and ref(p)['sha256']==entries[p]['sha256']
 roles.append(dict(**ref(p),role='BODY/SURVIVING-CHILD CARRIER HISTORY; IDENTITY/CONTENT/OWNERS DISTINCT',judgment=j+' '+common,acceptanceChain=[ref(O/'replay.json')]))
 if p.endswith('.json'):
  v=load(p)
  for ptr,s in walk(v):strings[p,ptr]=s
  for f in v['sources']:assert ref(f['path'])==f;bindings.append(dict(source=p,**f))
specs={r['path']:r['judgment'] for r in roles};rows=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in specs:continue
  ptr=u['location'].get('pointer','');assert u['sourceSha256']==entries[u['source']]['sha256']
  if u['source'].endswith('.json'):assert strings[u['source'],ptr]==u['text']
  narrative=u['source'].endswith('.md') or ptr in ['/status','/executionPolicy'] or any(k in ptr.split('/') for k in ['invariants','limits','compiler','pending'])
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],role='NARRATIVE AUTHORITY/FINDING' if narrative else 'TYPED EVIDENCE BACKING',judgment=specs[u['source']]))
r=dict(status='BODY/SURVIVING CARRIER HISTORY RECONCILED; HQ011 OPEN',sourceRoles=roles,rows=rows,stringLeaves=len(strings),bindings=bindings,preservedArtifacts=[],limits=[common,'Three exact builders/two reviewers execute symbolic checks; no new runtime qualification. Context producer gap and no-retained-original-envelope rule preserved.'])
c=dict(status='PASS; HQ011 OPEN',sources=len(roles),originalNarrativeOccurrences=sum(x['role'].startswith('NARRATIVE') for x in rows),originalBackingOccurrences=sum(x['role'].startswith('TYPED') for x in rows),stringLeaves=len(strings),resolvedBindings=len(bindings),unavailableBindings=0,freshSymbolicFaults=22,recoveredArtifacts=0,checker=ref(__file__))
save(O/'review.json',r);save(O/'check.json',c);print(json.dumps(c))
