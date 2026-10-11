"""Reconcile memory symbolic and wrapper packaging authority without erasing historical rejected designs."""
from pathlib import Path
import json,hashlib
P=Path('docs/planning');B=P/'campaign3-history-universe-rev1';O=P/'campaign3-history-carriage-design-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def save(n,v):
 p=O/n
 if p.exists():assert load(p)==v,p
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
notes={'docs/formal/MEASUREMENT_PREDICTION.md': 'Formal0.1 composition index preserves target/draft/symbolic/shape authority and separate later allocation/model/runtime gates. Occurrence portion explicitly superseded by accepted0.2 correction, not a current uncorrected275authority. Historical PREDnotpassed wording describes shape stage, later bounded qualification supplies component/public split. Exactmean at140/laterread no truth/confidence/efficacy; no fullCampaign2 or currentlaneclosure.', 'docs/planning/CAMPAIGN2_MEASUREMENT_EVIDENCE_CARRIAGE_DRAFT.md': 'Revision3 accepted shape with older proposal language retained; allocation acceptance not runtime authority. Exact203 plus safeunit gives carriage divergence, not cognitive-state/ADAPT9b learning. Observer ownership not observedSubjectId, noIDNintake; metadata reference index not payloadresolver. EmbeddedA selected for lawful historicalhandoff; governed payloadstoreB remains future competitor requiring lifecycle/capabilities. Suppression zeroaccess/output not202/zero/inferrednegative. V07NoStateWrites only separate registration grammar; V04singletonversion/cardinality/routes unchanged, onlyoccurrencedata extended; V04/V06rows and cross-version producer resolution retained. Earlier learningroute and singleton0.7 proposals withdrawn. Actualhostoutput→sharedingress matchingexactone; producer cannot authorintake, missing/duplicatepresentmatch errors neverpadding. Separate profilepadding onlyno203; owner-bound trackingfirst/intakesecond at120;130beforeEVID viaSequence. Sixordinal/eightchild invariant, outputIDdistinct existingObservationID, no crossversionE/Lbyteequality. Fullstateunchanged/emptyReadDomain does not make payloadungoverned. Restore historicalbytes no currenttruthrecompute, no newstore/evidenceunion; broadlookup/missing/belief/physiology unqualified. EVC-A..P claims later qualification only.', 'docs/planning/CAMPAIGN2_MEASUREMENT_EVIDENCE_PACKAGING_DRAFT.md': 'Revision2 user-accepted packaging shape authorizes materialization but not runtime beforeconcretefreeze. Withdrawn neworderedinputprofile replaced by directexactprobe input reuse, EVC-PACK-I explicit universalinputequivalence obligation not assumption. New registry/trace/persistence with originalinput profile; full31-entry bundle expanded, no fallback/adapter/modelalias. Slots1..4same,slot0sixschema/tworows/twooccurrencerules,slot5eightroles; singletonV04unchanged and nolearningroute. 336safechannelprojection excludesREG/permissionhandle; V07directdiagnosticproducer only no generalregisteredproducerbranch. Source-independentinitialschedule differs generatedchildren; phase120complete trace owns changedtwochildclosure, predecessorwholetrace notreused. Sixruntime/eightgenerated/nineevent budget; privatevoidnooccurrence. Boundarysavearchive337 no persistentlearningroot; scratchcompileoriginalmanifest provespendingInputOnlysubset, nogeneratedpendingstageatboundary and no replaycertificate substitute. FourBooleanmodelidentities distinct; same-model interventionpair retained. EVC-PACK-A..I and EVC-A..P are packaging-timepending, later exactpacket/runtime evidence scopes preserve historicalgate status.'}
ip=P/'campaign3-history-source-roles-rev230/index.json';ix=load(ip);entries={x['path']:x for x in load(B/'manifest.json')['entries']}
chain=[ref(P/'campaign3-history-measurement-carriage-rev1/review.json'),ref(P/'campaign3-history-carriage-packet-rev1/review.json'),ref(P/'campaign3-history-prediction-qualification-rev1/review.json'),ref('docs/formal/MEASUREMENT_PREDICTION_OCCURRENCE_CORRECTION.md')]
sources=[]
for p,n in notes.items():
 assert p in ix['unassignedCandidatePaths'] and ref(p)['sha256']==entries[p]['sha256']
 sources.append(dict(**ref(p),role='HISTORICAL CARRIAGE DESIGN AND FORMAL PREDICTION ROUTING',judgment=n,acceptanceChain=chain))
rows=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in notes:continue
  assert u['sourceSha256']==entries[u['source']]['sha256']
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],category='NARRATIVE'))
assert len({x['occurrenceId'] for x in rows})==len(rows)
O.mkdir(exist_ok=True)
save('review.json',dict(status='THREE CARRIAGE/PREDICTION AUTHORITY SOURCES RECONCILED',checker=ref(__file__),sourceIndex=ref(ip),sourceRoles=sources,rows=rows,preservedArtifacts=[],limits=['Historical accepted headers supersede retained proposal wording only in their stated scope; shape/materialization/runtime gates remain distinct.','Carriage divergence is not learned cognitive-state divergence; payload-store competitor and broader evidence mechanisms remain conditional.','Earlier singleton/route/input-profile proposals explicitly withdrawn; existing model bytes not rewritten.','No runtime/test/build rerun, new archive/source gap, model/allocation/verdict/corpus/obligation status change; adequacy open.'],obligations=['RO-C3-008','RO-C3-019','RO-C3-020','RO-C3-021']))
save('check.json',dict(status='PASS CARRIAGE DESIGN HISTORY',sources=3,originalNarrativeOccurrences=len(rows),originalBackingOccurrences=0,review=ref(O/'review.json')))
assert all(p.stat().st_size<50000000 for p in O.iterdir())
print(json.dumps(load(O/'check.json')))
