from pathlib import Path
import json,hashlib
P=Path('docs/planning');O=P/'campaign3-history-ga-compiler-rev1';B=P/'campaign3-history-universe-rev1'
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
recovery=load(O/'source-recovery.json');tests=load(O/'tests.json');assert sum(r['status']=='EXACT' for r in recovery['rows'])==6 and sum(r['status']=='UNAVAILABLE' for r in recovery['rows'])==10
for f in tests['sources']+[tests['report']]:assert ref(f['path'])==f
v=load(tests['report']['path']);assert v['numPassedTests']==v['numTotalTests']==tests['total'] and v['numFailedTests']==0
for r in recovery['rows']:
 assert ref(r['source']['path'])==r['source']
 if r['status']=='EXACT':assert ref(r['resolved']['path'])==r['resolved'] and r['resolved']['sha256']==r['original']['sha256']
common='Historical progress summary,not independent reproduction of its full suite/build/frozen-manifest check. Ten exact intermediate source commitments remain unavailable after recorded search; exclude claims of inspecting those old implementations. Current tests/current code and unchanged test-source hashes are separate evidence. No public runtime qualification or HQ011 adequacy closure.'
notes={
'GA_REGISTRATION_COMPILER_PROGRESS_REV1.json':'Reported24 focused/15 new tests; default1866 has1851 pass/15 timeout failures in8 files,then worker-limited1866 pass with unchanged timeouts. Preserve both reports as reported history,not fresh results. Internal67 template/eight accessor fragment uses synthetic implementation bindings. Exact registration and two test sources available; original accessor implementation unavailable. Prior batch19 tests provides current bounded evidence,not historical full-suite proof.',
'GA_REGISTRATION_COMPILER_PROGRESS_REV2.json':'Reported52 new compiler tests/30 calibration projections,1918 tests252 files and build/typecheck/boundary pass,28 frozen commitments/52 version declarations. Five intermediate implementation sources unavailable; exact declaration test file survives. Current recipe set has grown; current test count is explicitly separate. No source/model/persistence identity issued by declaration admission.',
'GA_REGISTRATION_COMPILER_PROGRESS_REV3.json':'Reported146 affected tests12 files including22 new; explicitly no full suite rerun. Four intermediate implementations unavailable; protocol compiler and source test file exact. Actual source constructors/frame coverage and formation descriptor checks are declaration evidence,not runtime hook completion. FixedCompilerCollectionElement positions must never be emitted as scalar265 roles; current collection tests retain valid sets and reject wrong identities.',
'GA_CONCRETE_DECLARATION_CHECKPOINT_2026_09_19.md':'StageA concrete67 registrations with compiler-owned versions,content/spec/holder/ref-kind/signal/window coupling and eight accessors. Codec extension only arbitrary canonical payload/map-key slots,not typed operands or prior codec reinterpretation. PRJ required without ledger read; conditional physical sampling remains separate. One character/task/goal,three objects,body2 vs baseline1,retention8 each,graph30/870,goal[30,40] within[0,100] are fixture choices. Priority aliases existing RolePriority.30 recipes then were calibration projections,not whole models.80/58 GA-local ceiling excludes inherited work. Named encoding/concern competitors retained; no general Affect/archetype or mechanism necessity qualification.',
'GA_SOURCE_PROTOCOL_CHECKPOINT_2026_09_19.md':'Eight frames/originals at3..10:four combined formation opportunities followed by four cue-only;eight qualified selector sources from first four,none from cue-only. Four selector bindings cover current/consequence visual/body schemas,subject/acquisition kind. Calendar currently Current only,no goal assessment or larger attribution fixture. Cue physically displays scene-a but actual sensed track must resolve it;no authored index shortcut. Zero capacity preserves source slots;denied/unresolved controls separate. Protocol singleton descriptor cross-check is not terminal hooks/inherited ownership execution. Five collection-element role correction preserves grammar checks; no retagging collections as atoms.146 affected is separate from preceding1918 fullsuite.'}
prior=load(P/'campaign3-history-source-roles-rev155/index.json');assigned={r['path'] for r in prior['roleAssignments']};entries={r['path']:r for r in load(B/'manifest.json')['entries']}
roles=[];strings={}
for n,j in notes.items():
 p=(P/n).as_posix();assert p not in assigned and ref(p)['sha256']==entries[p]['sha256']
 roles.append(dict(**ref(p),role='HISTORICAL COMPILER PROGRESS; SOURCE EXCLUSIONS AND CURRENT CONTROLS SEPARATE',judgment=j+' '+common,acceptanceChain=[ref(O/'source-recovery.json'),ref(O/'tests.json')]))
 if p.endswith('.json'):
  for ptr,s in walk(load(p)):strings[p,ptr]=s
specs={r['path']:r['judgment'] for r in roles};rows=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in specs:continue
  ptr=u['location'].get('pointer','');assert u['sourceSha256']==entries[u['source']]['sha256']
  if u['source'].endswith('.json'):assert strings[u['source'],ptr]==u['text']
  narrative=u['source'].endswith('.md') or ptr=='/status' or any(k in ptr.split('/') for k in ['evidenceScope','remaining','failureKind'])
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],role='NARRATIVE AUTHORITY/FINDING' if narrative else 'TYPED EVIDENCE BACKING',judgment=specs[u['source']]))
r=dict(status='COMPILER PROGRESS CLAIMS SCOPED; HQ011 OPEN',sourceRoles=roles,rows=rows,stringLeaves=len(strings),bindings=recovery['rows'],preservedArtifacts=recovery['preservedArtifacts'],limits=[common,'Current focused test count:'+str(tests['total'])+'. Full historical source contents remain excluded where bytes unavailable; final authority audit must retain these exclusions.'])
c=dict(status='PASS; HQ011 OPEN',sources=len(roles),originalNarrativeOccurrences=sum(x['role'].startswith('NARRATIVE') for x in rows),originalBackingOccurrences=sum(x['role'].startswith('TYPED') for x in rows),stringLeaves=len(strings),resolvedBindings=6,unavailableBindings=10,freshPassingAssertions=tests['total'],recoveredArtifacts=len(recovery['preservedArtifacts']),checker=ref(__file__))
save(O/'review.json',r);save(O/'check.json',c);print(json.dumps(c))
