"""Reconcile memory symbolic and wrapper packaging authority without erasing historical rejected designs."""
from pathlib import Path
import json,hashlib
P=Path('docs/planning');B=P/'campaign3-history-universe-rev1';O=P/'campaign3-history-memory-allocation-review-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def save(n,v):
 p=O/n
 if p.exists():assert load(p)==v,p
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
notes={'docs/formal/MEASUREMENT_EVIDENCE_CARRIAGE.md': 'Accepted formal carriage0.1 from reviewed revision3, with exact narrow clarification onlyAuthenticatedObserverMeasurementProducer in firstV07; generic cross-version resolution grants no broader consumer admission. Accepted wording and registry/model delta supersede draftgates only atshape scope. Self-contained203+unitA retained, payloadstoreB future competitor. No persistentwrites/learningroute/CharacterIdownership; governed safeproducer/ingress, fixedpadding/ordinal topology and oldmodel preservation remain. EVC-A..P shape-timepending are later qualified only in documented component/public scopes; no ADAPT9b/wholecampaignclaim.', 'docs/formal/MEASUREMENT_EVIDENCE_CARRIAGE_ALLOCATION_REVIEW.md': 'Permanent336..341/schema1 with23requiredfields,1124occurrence,eightidentityroles,sixmembers inexistingfamilies. Reuse203field1role1115 once; add203and337occurrencerules, wrappernotsecondobservation.338directfivefieldproducer has nouniontag/futurewildcard; NoStateWrites273 reuse and existingfinite1relations no newsemantics. V04singletonplus336/341rows no intakelearningroute. Allocation authorizes packaging not runtime; sixordinal/eightchild policy must be implemented separately. No newroot/store/observerfamily.', 'docs/formal/MEASUREMENT_MEMORY_ALLOCATION_REVIEW.md': 'Permanent14records342..355, twooccurrencefamilies1125/1126,15members,14recordfieldroles. Required embeddedtyping distinct identityroles; composite344keyrecursesfieldroles, no identityatomMapKey surrogate. Cue351notoccurrence,344addressnotoccurrence, noformation/padding/certificate IDs. ReadDelay signedInt64positive, concretevalue latermodeldata. Sole346entryauthority no removal, existingtopologyspecialization unchanged exceptepisodicStorage. M1V04, formation347/348, recall353/354and355conditionaloutput separate. Projectioncollections owned by TransitionSeamContract; wrapper serialization stillpackaginggate. ExistingIDNgrammar described reuse, laterC2MEMPACK002 explicitly repairs missing mapkeyrole in attemptedmodel; allocated14memoryroles themselves not15newmemoryroles. AllocationnotMEMRpass.', 'docs/formal/MEMORY_WRAPPER_ALLOCATION_REVIEW.md': 'Three permanent wrappers356..358 withnine required record/setfields; no namespaces/members/roles/occurrences/union/staticbindingfield. Homogeneous emptysetsrequired, notoptionalabsence. 171.Definition holdswrapper rather than extrarow, profilegrammar separateinnerDefinitionVersion. M1/Ffalse356,Ftrue357,recall358; opportunitybare/inheritedbare. ExternalStaticBindings forbidden evenemptyinput; profilefixedempty derived.17newdescriptors are14memory+3wrapper;14memoryroleaddition wording superseded for completepacket by extraIDNmapkeyrole, not wrapperrole. Delay1signed/41bundle/16config unmodified bynumericfreeze. Separate laterblocked/correctedpacket and runtimequalification required; no numberingadjacencypsychology.'}
ip=P/'campaign3-history-source-roles-rev231/index.json';ix=load(ip);entries={x['path']:x for x in load(B/'manifest.json')['entries']}
chain=[ref(P/'campaign3-history-carriage-design-rev1/review.json'),ref(P/'campaign3-history-memory-packaging-rev1/review.json'),ref(P/'campaign3-history-memory-packets-rev1/review.json')]
sources=[]
for p,n in notes.items():
 assert p in ix['unassignedCandidatePaths'] and ref(p)['sha256']==entries[p]['sha256']
 sources.append(dict(**ref(p),role='FORMAL CARRIAGE/MEMORY ALLOCATION WITH LATER PACKET CORRECTION',judgment=n,acceptanceChain=chain))
rows=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in notes:continue
  assert u['sourceSha256']==entries[u['source']]['sha256']
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],category='NARRATIVE'))
assert len({x['occurrenceId'] for x in rows})==len(rows)
O.mkdir(exist_ok=True)
save('review.json',dict(status='FOUR CARRIAGE/MEMORY ALLOCATION SOURCES RECONCILED',checker=ref(__file__),sourceIndex=ref(ip),sourceRoles=sources,rows=rows,preservedArtifacts=[],limits=['Accepted formal carriage retains narrow producer clarification and separate allocation/runtime gates.','Fourteen allocated memory roles differ from fifteen total added roles in corrected packet; extra IDN role is not a wrapper or new memory role.','No runtime/test/build rerun or new allocation; original IDs/schema/text bytes preserved.','No source gap/archive/model/verdict/corpus/obligation status change; independent adequacy open.'],obligations=['RO-C3-008','RO-C3-019','RO-C3-020','RO-C3-021']))
save('check.json',dict(status='PASS CARRIAGE/MEMORY ALLOCATION REVIEW HISTORY',sources=4,originalNarrativeOccurrences=len(rows),originalBackingOccurrences=0,review=ref(O/'review.json')))
assert all(p.stat().st_size<50000000 for p in O.iterdir())
print(json.dumps(load(O/'check.json')))
