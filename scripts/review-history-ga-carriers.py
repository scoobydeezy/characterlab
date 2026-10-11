from pathlib import Path
import json,hashlib
P=Path('docs/planning');O=P/'campaign3-history-ga-carriers-rev1';B=P/'campaign3-history-universe-rev1'
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
common='Symbolic carrier evidence only; actual source authentication,selected capability,PRJ,owner composition,allocator and public persistence remain separate. Original baseline reviewers do not qualify successor fields.'
notes={}
requested='Five records preserve exact requested modality/product equations. Requested unavailable differs from unrequested; body channels/declarations/samples biject and share holder/time. Present panel or nonempty visual yields one shared event detection,including empty-visual/present-panel;body alone does not. Unavailable headers reveal no hidden permission/visibility reason. Unsampled panel does not retire context. No world/binding/physical/registry resolver access from perception,no wrapper identity. Existing event detection215/1113 differs from feature identity. Nine original faults and exact requested builder reproduce; branch equations themselves remain compiler obligations.'
for n in ['GA_REQUESTED_SOURCE_CARRIER_REV1.md','GA_REQUESTED_SOURCE_CARRIER_REV1.json','GA_REQUESTED_SOURCE_CARRIER_REVIEW_REV1.json']:notes[n]=requested
notes['GA_REQUESTED_SOURCE_CARRIER_REV2.json']=requested+' Successor adds only optional ReservedExperience1106 to CompletedRequestedSamples and explicit reservation invariant/external alias. No second experience or reservation record. Earlier reviewer forbids Experience-named fields and is not a validator for this successor.'
notes['GA_SOURCE_RESERVATION_CORRECTION_REV1.md']='Real ordering omission: prior component reserved after binding while labeling phase10/120. One ID/envelope tests did not distinguish late call from actual early reservation. Correct source admits safe support immediately after sampling,before tracking/binding;freeze14/124 reuses it. No safe evidence means none. Counts/namespaces unchanged but order changes. GSO-K is the cited ordering witness,not freshly rerun in this structural batch; preserve its separate component/public evidence. Optional1106 transport is not a new identity. Runtime authenticity and orphan/duplicate closure remain separate.'
visual='Sixteen-record immediate baseline keeps observed role unresolved/position and glyph independently absent; actual observer/time/support joins and shared multimodal experience. Encoder receives selected-only evidence/witness subset with preselection peripheral divisor,not full source. Positive/KnownZero/Unavailable remain separate;positive child carries own binding/oneclaim/factors/witness and no original envelope. Empty selection still enrolls protocol;cue-only sensing does not. Cue independent of encoding,one actual detection/track required;ambiguous cue rejects,no coordinate/content resolver. Ten original faults reproduce against exact packet/unchanged SEM registry. Three original component hashes unavailable;visual builder and old code-content claims excluded.'
for n in ['GA_VISUAL_PIPELINE_CARRIER_REV1.md','GA_VISUAL_PIPELINE_CARRIER_REV1.json','GA_VISUAL_PIPELINE_REVIEW_REV1.json']:notes[n]=visual+' The supersedes-delayed-layout wording and formation-owner allocation invariant are corrected explicitly by later scope/claim documents.'
notes['GA_VISUAL_PIPELINE_SCOPE_CORRECTION_REV1.md']='Earlier draft overstates supersession. No-feedback EncodingJoinInput is immediate baseline only. Earlier authenticated TaskConcern delivered before encoding is lawful prior input,not future outcome leakage. Baseline Feedback-field mutation does not establish universal invalidity of concern encoding. Retain two-parent authentication,selected/preselection count and DisabledFeedback;future goal qualification cannot gate earlier formation. No replacement identity or universal concern prerequisite.'
notes['GA_VISUAL_PIPELINE_CLAIM_TRANSPORT_REV2.md']='Missing actual claim edge repaired: VisualSelectionInput receives0..3 actual phase15/125 CausalRoleEvidence240,authenticated by observer/experience/binding. No recomputation,replacement occurrence or authored-role shortcut;unavailable visual has no claims even if another modality formed experience. Encoder remains selected-only. Correct acquisition owner:positive evidence producer130 allocates,owner140 reuses;successful whole instant makes both authoritative and failure rolls back. Structural carrier does not execute this transactional rule.'
notes['GA_VISUAL_PIPELINE_CARRIER_REV2.json']=visual+' Only VisualSelectionInput.Claims field added;owner allocation invariant corrected to130 producer/140 reuse and actual claim invariant added. Other fields unchanged;prior-feedback scope correction remains authoritative. Old reviewer is not successor claim-authentication proof.'
replay=load(O/'replay.json');assert sum(len(r['faults']) for r in replay['rows'])==19
for row in replay['rows']:
 for k in ['script','output']:assert ref(row[k]['path'])==row[k]
recovery=load(O/'source-recovery.json');missing={(r['original']['path'],r['original']['sha256']) for r in recovery['rows'] if r['status']=='UNAVAILABLE'};assert len(missing)==3
for stem,record,field in [('GA_REQUESTED_SOURCE_CARRIER','CompletedRequestedSamples',{'name':'ReservedExperience','type':{'kind':'optional','value':{'kind':'ref','name':'ExperienceId'}}}),('GA_VISUAL_PIPELINE_CARRIER','VisualSelectionInput',{'name':'Claims','type':{'kind':'list','element':{'kind':'ref','name':'CausalRoleEvidence'},'min':0,'max':3}})]:
 a=load(P/(stem+'_REV1.json'));b=load(P/(stem+'_REV2.json'));assert next(r for r in b['records'] if r['name']==record)['fields'].pop()==field;assert a['records']==b['records']
entries={x['path']:x for x in load(B/'manifest.json')['entries']};assigned={x['path'] for x in load(P/'campaign3-history-source-roles-rev157/index.json')['roleAssignments']}
roles=[];strings={};bindings=[]
for n,j in notes.items():
 p=(P/n).as_posix();assert p not in assigned and ref(p)['sha256']==entries[p]['sha256']
 roles.append(dict(**ref(p),role='REQUESTED/VISUAL CARRIER HISTORY; CORRECTED SCOPE/ORDER/OWNERSHIP',judgment=j+' '+common,acceptanceChain=[ref(O/'replay.json'),ref(O/'source-recovery.json')]))
 if p.endswith('.json'):
  v=load(p)
  for ptr,s in walk(v):strings[p,ptr]=s
  for f in v['sources']:
   exact=ref(f['path'])==f
   assert exact or (f['path'],f['sha256']) in missing
   bindings.append(dict(source=p,**f,status='EXACT' if exact else 'UNAVAILABLE; OLD COMPONENT CONTENT EXCLUDED'))
specs={r['path']:r['judgment'] for r in roles};rows=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in specs:continue
  ptr=u['location'].get('pointer','');assert u['sourceSha256']==entries[u['source']]['sha256']
  if u['source'].endswith('.json'):assert strings[u['source'],ptr]==u['text']
  narrative=u['source'].endswith('.md') or ptr in ['/status','/executionPolicy'] or any(k in ptr.split('/') for k in ['invariants','limits','compiler'])
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],role='NARRATIVE AUTHORITY/FINDING' if narrative else 'TYPED EVIDENCE BACKING',judgment=specs[u['source']]))
r=dict(status='REQUESTED/VISUAL CARRIER HISTORY RECONCILED; HQ011 OPEN',sourceRoles=roles,rows=rows,stringLeaves=len(strings),bindings=bindings,preservedArtifacts=[],limits=[common,'Preserve correction of overbroad feedback exclusion,late reservation and wrong acquisition allocator. No current source test or public replay in this batch.'])
c=dict(status='PASS; HQ011 OPEN',sources=len(roles),originalNarrativeOccurrences=sum(x['role'].startswith('NARRATIVE') for x in rows),originalBackingOccurrences=sum(x['role'].startswith('TYPED') for x in rows),stringLeaves=len(strings),resolvedBindings=sum(x['status']=='EXACT' for x in bindings),unavailableBindings=sum(x['status']!='EXACT' for x in bindings),freshSymbolicFaults=19,recoveredArtifacts=0,checker=ref(__file__))
save(O/'review.json',r);save(O/'check.json',c);print(json.dumps(c))
