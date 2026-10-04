"""HQ011 memory/parent authority chronology and retained defect controls."""
from pathlib import Path
import json,hashlib,copy
P=Path('docs/planning');B=P/'campaign3-history-universe-rev1';O=P/'campaign3-history-memory-parent-rev1'
SOURCE='docs/formal/OPEN_DECISIONS.md'
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def save(p,x):
 if p.exists():assert load(p)==x,p
 else:p.write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
def excerpt(p,a=1,z=None):
 ls=Path(p).read_bytes().decode('utf-8-sig').splitlines(keepends=True);z=z or len(ls)
 return dict(path=str(p).replace('\\','/'),sha256=sha(p),startLine=a,endLine=z,text=''.join(ls[a-1:z]))
specs=[
 (1135,'Memory target','Historical observed measurement, not current truth. Formation and usable recall are distinct; SubjectId cannot supply ownership.','No general retrieval/decay/top-K, appraisal or parent9b from target acceptance.'),
 (1157,'Inspection and alternatives','Cue authority and character-owned addressing split; nested projection versus copied selector remains a comparison. Expected-absent WRT can reject duplicates without semantic reads.','Design only; generated pending recall creates a separate restore obligation.'),
 (1175,'M1 grammar correction','Use existing V04 registered producer with empty ReadDomain and exactly one learning-evidence output. Only IDN lookup is ActualRead.','Rejected new registration grammar preserved; nested path and whole seam still gated.'),
 (1195,'M1/M2 accepted; M3 draft','Bounded field-path accepted with exact role and requirement closure. Sparse episode insertion proposed.','Write/read key consistency, historical validity and phase ordering still open; no runtime authority.'),
 (1211,'M3 withheld','Duplicate insertion capability and independent validator IDN access rejected; accepted StateWrites reused, local structure separated from live ownership.','No validation-only roster resolver. M5 must establish restore legitimacy.'),
 (1227,'M3 accepted / read draft','Insert-only sole owner, exact patch/diff and local validation accepted; key conditional on preauthorized read.','No inferred direct trace-source encoding or global memory lookup.'),
 (1243,'M4b accepted','IDN-to-exact-key authorization precedes optional episode read; direct trace has no derived source/transformation.','Same write/read key now accepted; no post-read owner check or alternate roster authority. Cue/replay still proposals.'),
 (1259,'M4a accepted','Content-free two-identity cue from live337, positive checked delay, scheduler identity and exact parent/multiplicity.','No new CueId. Replay is recommended against certificate/signature alternatives, not yet accepted.'),
 (1274,'M5 revision2','Real recall allocation or private void slot; exclusive ADAPT or memory/control batch. Proposes original-S0, quiescent N-event prefix and full-save equality.','Proposed16 configurations and7+1 advances are not runtime passes; no invented cue trace identity.'),
 (1291,'M5 behavior accepted','Original-S0 validation, quiescent stopping, whole-save comparison and detached association rehydration accepted.','Symbolic closure pending; delay is packaging data. No duplicate control capability, save field or identity required.'),
 (1307,'Symbolic ownership correction','Remove global projection rows/kind; requirements remain transition-owned. Retain family definition version; padding uses seam version; roster stays S0.','Serialization gaps belong to packaging, not permission for a new global registry. Whole shape still withheld here.'),
 (1325,'Whole shape','M1..M5 shape accepted under measurement-episodic-memory/0.1-candidate.','Allocation next; no runtime authorization or MEMR/parent pass.'),
 (1336,'Memory allocation','342..355 and1125..1126 permanent; serialization gap and one-tick packaging proposed.','Numeric freeze is not materialized model or runtime qualification.'),
 (1347,'Anonymous envelope rejected','One-tick delay and16 configurations accepted; anonymous projection list replaced by three typed wrapper proposals.','Frozen342..355 unchanged; wrapper shape/allocation separate.'),
 (1359,'Wrapper shape','Three transition-owned wrappers accepted; StaticBindings fixed empty and injection rejected.','Numeric freeze and model materialization remain separate gates.'),
 (1368,'Wrapper allocation','356..358 permanent with no new identity/member/role/occurrence/union surfaces.','Materialization authorized, not model acceptance or runtime.'),
 (1377,'Inadmissible packet','Missing inherited268/1 map-key role makes16 review specimens blocked and inadmissible.','Repair only proposed; never label blocked specimens frozen models.'),
 (1387,'Role repair accepted','Exact slot5 amended from14 to15 declarations; blocked specimens retained while all16 commitments recomputed.','No schema/allocation/version change or rewrite of fingerprinted authority; freeze pending.'),
 (1397,'Corrected packet','All16 distinct commitments change; actual stateModel/VAL fragment and adversarial checks support review.','589 component checks and150 preserved files do not themselves freeze or activate runtime.'),
 (1408,'Freeze and runtime submission','Corrected16 models frozen; actual M1/IDN/formation/cue/recall and original-S0 restore execute.','Blocked58a491 family never admitted, not a migration source. Qualification still submitted, not silently promoted.'),
 (1427,'Memory and joined parent','Bounded memory accepted; different-adaptation-S0 pair insufficient for parent. Same model/S0/seed and count0/1 actual exposure joins D read, observation, episode and recall.','Prefix integrity is not antirollback. Generic/public B and historical-change/immutability G scopes preserved; PHEN-MEM and blanket factory/VAL remain open.'),
 (1449,'Fixture conflict','Same-S0 pair accepted; historical one-rule fixture conflicts with four actual frozen rules. Correct-forward amendment requires independent expected changed paths.','Control3 mechanically satisfied but non-discriminating at leaf-family level; exact-path/WRT controls retain isolation burden. No silent PHEN promotion.'),
 (1470,'PHEN accepted / serialization conflict','Fixture amendment and bounded PHEN-ADAPT PASS accepted, preserving original source and four-rule limits.','Draft1.11 and suffix-free1.11 commit different bytes; research PASS does not choose canonical serialization. No PHEN-MEM or blanket completion.'),
 (1486,'Canonical promotion','Suffix-free PHEN-ADAPT1.11/corpus0.27 explicitly frozen; original draft remains a superseded reviewed commitment, not alias or invalid artifact.','Historical promotion is not current corpus0.29; no model/runtime change or new behavioral evidence implied.')]

assert sha(SOURCE)==sha(B/'sources'/SOURCE)
rows=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source']!=SOURCE or not 1135<=u['location']['startLine']<=1498:continue
  assert u['location']['endLine']<=1498
  _,name,judgment,reopen=max((s for s in specs if s[0]<=u['location']['startLine']),key=lambda s:s[0])
  e=excerpt(B/'sources'/SOURCE,u['location']['startLine'],u['location']['endLine']);assert e['text']==u['text']
  rows.append(dict(occurrenceId=u['id'],source=e,decision=name,judgment=judgment,reopen=reopen,obligations=['RO-C3-020','RO-C3-021']))
lines=Path(B/'sources'/SOURCE).read_bytes().decode('utf-8-sig').splitlines()
assert {n for r in rows for n in range(r['source']['startLine'],r['source']['endLine']+1)}=={n for n in range(1135,1499) if lines[n-1].strip()}
prior=load(P/'campaign3-history-probe-carriage-rev1/review.json')['rows']
assert not {r['occurrenceId'] for r in rows}&{r['occurrenceId'] for r in prior}
manifest=load(O/'source-manifest.json')
for x in manifest['files']:assert sha(x['path'])==x['sha256'],x['path']
t=load(O/'tests.json');assert t['success'] and t['numPassedTests']==34 and t['numFailedTests']==t['numPendingTests']==0
assert len(t['testResults'])==2 and all(a['status']=='passed' for f in t['testResults'] for a in f['assertionResults'])
r=dict(status='HQ011 MEMORY/PARENT BATCH REVIEWED; WIDER AUDIT OPEN',rows=rows,
 evidence=[excerpt(P/'CAMPAIGN2_MEASUREMENT_MEMORY_QUALIFICATION.md'),excerpt(P/'CAMPAIGN2_MEASUREMENT_MEMORY_RUNTIME_REVIEW.md'),excerpt(P/'CAMPAIGN2_PHEN_ADAPT_CONSOLIDATION_REVIEW.md'),excerpt('docs/formal/PHEN_ADAPT_FIXTURE_AMENDMENT.md'),excerpt(P/'PHEN_ADAPT_CORPUS_PROMOTION_ACCEPTED.json')],
 preservedFindings=['Different-adaptation-S0 memory pair did not satisfy parent9b; same-S0 actual exposure witness later closed the causal gap.',
 'Missing inherited IDN map-key role made original16 packets inadmissible; retained specimens were never frozen or migration sources.',
 'One-rule fixture prose conflicted with frozen four-rule execution; explicit amendment retained non-discriminating control3 and independent exact-path obligations.',
 'Draft versus suffix-free corpus serialization required explicit version/digest reconciliation; reviewed draft is not an alias.'],
 tests=dict(path=(O/'tests.json').as_posix(),sha256=sha(O/'tests.json'),passed=34,files=2,titles=[a['fullName'] for f in t['testResults'] for a in f['assertionResults']]),
 sourceManifestSha256=sha(O/'source-manifest.json'),obligations=['RO-C3-007','RO-C3-008','RO-C3-005','RO-C3-019','RO-C3-020','RO-C3-021'],
 limits=['Formal register1135..1498 only; later persistence/VAL/ADAPT/factory qualification remains outside this batch.',
 '34 fresh focused memory/parent tests, not a full historical regression, fresh-process restore/rematerialization, reference suite or build. Historical599 full plus2 later focused is not601 full.',
 'Historical observation, formation, recall and same-S0 causal qualification remain distinct. Scheduler parent edges differ from exact state write/read dependencies; no hidden provenance enters cognition.'],
 nextGate='Continue HQ011 at formal register1499: persistence scope, VAL reconciliation and ADAPT/factory qualification.')

def validate(v):
 assert v==r
 for e in [x['source'] for x in v['rows']]+v['evidence']:assert e==excerpt(e['path'],e['startLine'],e['endLine'])
 assert sha(v['tests']['path'])==v['tests']['sha256']
validate(r);faults=[]
for mode in ['omitted-occurrence','memory-as-parent-proof','lost-rejected-packet','false-test-total','lost-split-scope']:
 v=copy.deepcopy(r)
 if mode=='omitted-occurrence':v['rows'].pop()
 elif mode=='memory-as-parent-proof':v['rows'][0]['judgment']='Different adaptation S0 proves same-S0 causal intervention'
 elif mode=='lost-rejected-packet':v['preservedFindings'].pop(0)
 elif mode=='false-test-total':v['tests']['passed']=328
 else:v['rows'][-1]['reopen']='Generic evidence proves arbitrary public profiles'
 try:validate(v)
 except AssertionError:faults.append(mode)
 else:raise AssertionError(mode)
save(O/'review.json',r)
c=dict(status=r['status'],originalOccurrences=len(rows),decisionGroups=len(specs),indexedWholeOccurrenceLinks=369+len(rows),freshTests=34,boundSourceFiles=len(manifest['files']),faultChecks=faults,reviewSha256=sha(O/'review.json'),checkerSha256=sha(__file__))
save(O/'check.json',c);print(json.dumps(c))
