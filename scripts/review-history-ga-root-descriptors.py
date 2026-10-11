from pathlib import Path
import json,hashlib
P=Path('docs/planning');O=P/'campaign3-history-ga-root-descriptors-rev1';B=P/'campaign3-history-universe-rev1'
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
common='Symbolic topology and trusted classification components only; public compiler,actual source/owner binding,protocol monotonicity,holder equality,initial state and complete-prefix persistence remain separate gates. No new law,allocation or authority grant.'
root='Seven proposed storage roots separate episodic content,association,presentation,maintenance goals,tracking,panel context and runtime governance. Four character1002-qualified scalar keys and two observer1000 keys;protocol singleton has none. Cognitive whole owner values are bounded and read explicitly,not arbitrary state scans. SEM241/242 remain separate existing perception authority,not new1031 learning family;new windows do not copy counters or full observation history. Composite maintenance/formation keys inside leaves are not scalar StateMapKey roles. Closed membership and nested-holder equality exceed namespace checks. Roots remain present after complete content loss;goal finalization retains lifecycle. Restore must compare all owners,SEM windows,queue and model limits;shape alone does not prove it.'
roots1=root+' Graph0..27 follows nine-sweep3-detection empty-S0 fixture,not psychological capacity. Canonical nodes,square rows,zero diagonal,nonnegative bounded masses and row sums remain independent constraints. Episodic loss need not remove graph nodes;structurally empty graph pruning is separately governed. Tracking stores only latest observed file/glyph up to3;panel absence ends active context.'
roots2=root+' REV2 preserves roots,roles,owners,initial/removal and holder rules. Only Nodes/Rows/Masses maxima change27 to30 for actual tenth3-detection source. Three exact field deltas verified;no arbitrary seeded nodes or silent truncation. Prior physical-root wording means storage layout,not bodily truth;the separate LocalReserveState alone is explicitly PhysicalBody with composite key.'
protocol='Exact closed source binding uses existing254 schema refs,producer TransitionKindId,required DefinitionId projection,1025 authority and149 path;selection field must really own1143. Bound view borrows actual audit identity/observer,not independent occurrence. Each completed eligible selector consumes one of32 sources including empty;cue-only sensing consumes none. Two selectors sharing one experience still consume two source slots. Governance has0..32 full QualifiedFormationSource keyed admission/success maps;kind only in admission,success immutable acquisition/time plus monotone CompleteLoss. Present empty singleton is RuntimeProtocol,not StateFamily;direct and recursively derived cognitive reads excluded. Fixed runtime admit/reconcile hooks run after actual completion/PRJ and terminal owner result before commit,not140 child/repair. Owner projection carries only formed success/new total-loss IDs,including immediate total loss;no partial-loss entry or content archive. Transaction binds actual owner result,not matching caller fields or saved object identity. Final relational validator must reject reset,invented success/loss and loss reversal;generic ownership/nonremoval alone insufficient. Memory/protocol roll back together.'
hook='Original attention branches8/9 both own audit1143 and bound child-payload view,including EmptySource;view has no separate occurrence. Eligible empty source enrolls before positive formation and creates no success/experience;no completed selector creates no source. Unknown/forged/wrong-subject is rejection,not absence. Body positive/empty branches require own exact schema/PRJ membership,not borrowed visual532/534. Closed immutable profile,actual validated terminal-owner result and payload-free projection exclude callbacks,trace authority,live ContinuingRunInputs ownership and cognitive writes. Authorized leaf replacement could reset history despite nonremoval;separate monotonic validation required. Eight static corruptions are proposal checks,not FJ public qualification.'
additive='Preserve frozen284/285/286 one-root family form and existing346/373 roots/owners;successor adds explicitly declared roots to existing logical families without a parallel psychological family. Additional roots inherit exact base route and unique family leaf address;no route override. At most32 families,32 total base+additional+protocol roots and16 fields/root;positive canonical ordinals and dense descriptors. Protocol list disjoint with no learning route. Classifier detaches inputs/returned identities and rejects unknown paths/collisions;classification grants no cognitive read or mutation permission. Exact key/value grammar,authority and read/accessor closures remain independently required. New root never widens old owner. Replacement multiroot base form is a possible representation comparator only,not behavioral necessity or reduction.'
notes={
'docs/formal/ADDITIVE_FAMILY_ROOT_COMPONENT.md':additive,
'docs/planning/GA_ADDITIVE_ROOT_DESCRIPTOR_REV1.md':additive+' Descriptor bound32 roots/1..16 leaf fields cross-checks actual StateModelDeclaration;family route is inherited,not another editable copy. General episode/presentation share episodic family but separate roots;maintenance extends prospective commitments;association remains separate. Six substitutions and seven tests are component evidence,not public activation.',
'docs/planning/FORMATION_HOOK_INVENTORY_REV1.md':hook,
'docs/planning/FORMATION_HOOK_INVENTORY_REV1.json':hook,
'docs/planning/GA_FORMATION_PROTOCOL_DESCRIPTOR_REV2.md':protocol,
'docs/planning/GA_FORMATION_PROTOCOL_CARRIER_REV2.json':protocol,
'docs/planning/GA_FORMATION_PROTOCOL_CARRIER_REVIEW_REV2.json':protocol+' Ten original structural faults reproduced:classification/read/write grants,removable history,bound widening,missing PRJ,duplicated kind,selection/acquisition substitution,owner payload and premature type. Reachability proves payload-free shape,not actual success-subset/monotonicity or compiler membership.',
'docs/planning/GA_STATE_ROOT_KEY_INVENTORY_REV1.md':roots1,
'docs/planning/GA_STATE_ROOT_KEY_INVENTORY_REV1.json':roots1,
'docs/planning/GA_STATE_ROOT_KEY_INVENTORY_REV2.md':roots2,
'docs/planning/GA_STATE_ROOT_KEY_INVENTORY_REV2.json':roots2,
'docs/planning/GA_STATE_ROOT_KEY_REVIEW_REV1.json':roots1+' Eleven structural faults reproduced;no actual graph cross-field,initial-state or complete-prefix qualification.',
'docs/planning/GA_STATE_ROOT_KEY_REVIEW_REV2.json':roots2+' Eleven structural faults reproduced against successor bounds;old inventory preserved,not retroactively widened.',
'docs/planning/ADDITIVE_FAMILY_ROOT_REVIEW_REV1.json':additive+' Six original substitutions detected:erase addition,root overwrite,protocol overlap,route override,returned live identity and total-root bound removal. Original source/test/reviewer commitments match exactly; imported state/dependencies are current,not full reconstructed old tree.',
'docs/planning/ADDITIVE_FAMILY_ROOT_TESTS_REV1.json':additive+' Initial five passing cases preserve classification/collision/route/detachment/domains. Subsequent two controls add actual independent authority denial and composed-root bound;five plus seven reports are not12 distinct tests.',
'docs/planning/ADDITIVE_FAMILY_ROOT_TESTS_REV2.json':additive+' Seven fresh matching cases pass. AFR-F uses actual StateAuthorityRegistry:old owner denied new root while separately authorized new owner succeeds. AFR-G admits32 protocol-only roots but rejects33 composed roots and sparse input;classifier itself does not supply access grants.'
}
replay=load(O/'replay.json');assert len(replay['rows'])==7 and sum(len(r['faults']) for r in replay['rows'])==40 and len(replay['mutations'])==6
for row in replay['rows']:
 for k in ['script','output']:assert ref(row[k]['path'])==row[k]
for f in replay['componentInputs']+[replay['tests'],replay['componentOriginal']]:assert ref(f['path'])==f
for row in replay['mutations']:assert ref(row['report']['path'])==row['report']
entries={x['path']:x for x in load(B/'manifest.json')['entries']};assigned={x['path'] for x in load(P/'campaign3-history-source-roles-rev163/index.json')['roleAssignments']}
roles=[];strings={};bindings=[]
for n,j in notes.items():
 p=n;assert p not in assigned and ref(p)['sha256']==entries[p]['sha256']
 roles.append(dict(**ref(p),role='ROOT/PROTOCOL DESCRIPTOR HISTORY; CLASSIFICATION IS NOT AUTHORITY',judgment=j+' '+common,acceptanceChain=[ref(O/'replay.json')]))
 if p.endswith('.json'):
  v=load(p)
  for ptr,s in walk(v):strings[p,ptr]=s
  for f in v.get('sources',[]):assert ref(f['path'])==f;bindings.append(dict(source=p,**f))
specs={r['path']:r['judgment'] for r in roles};rows=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in specs:continue
  ptr=u['location'].get('pointer','');assert u['sourceSha256']==entries[u['source']]['sha256']
  if u['source'].endswith('.json'):assert strings[u['source'],ptr]==u['text']
  narrative=u['source'].endswith('.md') or ptr in ['/status','/executionPolicy'] or any(k in ptr.split('/') for k in ['invariants','limits','compiler','pending','fullName','title','boundaries','profile','eligibility'])
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],role='NARRATIVE AUTHORITY/FINDING' if narrative else 'TYPED EVIDENCE BACKING',judgment=specs[u['source']]))
r=dict(status='ROOT/PROTOCOL DESCRIPTOR HISTORY RECONCILED; HQ011 OPEN',sourceRoles=roles,rows=rows,stringLeaves=len(strings),bindings=bindings,preservedArtifacts=[],limits=[common,*replay['limits']])
c=dict(status='PASS; HQ011 OPEN',sources=len(roles),originalNarrativeOccurrences=sum(x['role'].startswith('NARRATIVE') for x in rows),originalBackingOccurrences=sum(x['role'].startswith('TYPED') for x in rows),stringLeaves=len(strings),resolvedBindings=len(bindings),unavailableBindings=0,freshSymbolicFaults=40,freshOriginalComponentMutations=6,freshTests=7,recoveredArtifacts=0,checker=ref(__file__))
save(O/'review.json',r);save(O/'check.json',c);print(json.dumps(c))
