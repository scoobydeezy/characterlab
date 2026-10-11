from pathlib import Path
import json
P=Path('docs/planning');O=P/'campaign3-history-ga-root-descriptors-rev1';I=P/'campaign3-history-source-roles-rev164'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(O/'check.json');i=load(I/'check.json');assert c['freshSymbolicFaults']==40 and c['freshTests']==7 and i['assignedSources']==9961
cp=P/'CAMPAIGN3_HISTORY_GA_ROOT_DESCRIPTORS_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Root and protocol descriptor history — 2026-10-07

**LOCAL DISPOSITION — no owner ruling required.** HQ-011 remains open.
Counters **1519 / 0**. Sixteen sources;756 JSON string leaves;144 narrative/41 backing
occurrences;28 exact bindings;no missing source or new archive.

Seven exact symbolic replays reproduce the original inventories and40 structural
fault checks:two root/key reviewers11 each,protocol carrier10 and hook inventory8.
Only original output-existence guards and writes are redirected;all original field,
reachability,source-hash and fault assertions remain. Original outputs are compared
in full and remain unchanged. Three builders reproduce the two root inventories and
protocol carrier;the hook reviewer also reproduces its own generated packet.

Seven current additive-root tests and six original source substitutions pass their
intended checks. Original component source,test and reviewer commitments all match;
imported state substrate/dependencies execute current versions,not a reconstructed
entire old tree. Initial five-test and later seven-test receipts are distinct runs,
not12 distinct behaviors. No public runtime or persistence matrix is rerun.

Classification remains separate from authority. Additions preserve frozen284/285/286
and existing346/373 roots while sharing existing logical families. No new psychological
family or route override is needed. Exact positive identities,unique leaf addresses,
dense descriptors and disjoint protocol roots remain required. The32-root bound
applies to base,additional and protocol roots together. AFR-F uses the actual
StateAuthorityRegistry to deny an old owner's write to a new root,then permits the
separately authorized new owner. Classification itself grants neither read nor write.

Both inventories retain seven storage roots and six scalar key roles:four qualified
CharacterId1002 and two ObserverId1000. Protocol singleton has no scalar selector.
Perception remains its existing architectural owner,not a new learning family.
Composite keys inside leaves are not scalar StateMapKey roles. Present empty owner
values survive total child loss;goal lifecycle evidence is not deleted.

Exactly three graph maxima change27 to30:Nodes,Rows and Masses. This accounts for
the actual tenth three-detection source;all other record fields,roots,roles and
invariants are identical. It is an expressibility bound,not a psychological capacity
or permission to seed nodes. Storage-root wording does not classify these values as
bodily truth;LocalReserveState is separately PhysicalBody. Graph cross-field and
holder-equality invariants still require more than field topology.

Formation governance is payload-free RuntimeProtocol with separate admission and
success maps. Every completed eligible selection consumes a source slot,including
empty selection;cue-only sensing does not. Two completed selectors sharing one
experience consume two slots. Audit and selected child view need their actual bound
producer relation;the view has no independent occurrence merely for output matching.

Closed fixed hooks run after actual source completion/PRJ and after terminal ordinary
owner resolution,before commit. Owner disposition is bound to the actual batch and
contains only success metadata and newly complete-loss identities,not children or
samples. A transaction-local result object is not saved authority. Direct and
recursively derived cognitive reads must exclude protocol state. Generic ownership
and nonremoval cannot prevent replacing history with an empty value;separate relational
validation must reject reset,invented success/loss and reversal. Symbolic shape checks
do not establish those runtime invariants or full-prefix reconstruction.

SourceREV164:9,961 assigned/1,412 unassigned;19,985 narrative/184,028 backing;
920 outside-census artifacts. Prior roles/artifacts preserved;counts not adequacy.
Next protocol transition/owner join and retained-read history,then authority adequacy.
Formula343/Values90/15,formula pin,legacy log and prior exclusions remain separate.
HQ012 unstarted;exitAuditREV111 unchanged;Campaign3 NOT EXIT-READY.
108 verdicts;132 bounded clauses;55/58 wrappers;corpus0.29.0/21. All jobs terminal.
No production/model/allocation/verdict/corpus/obligation status changed.
''',encoding='utf-8',newline='\n')
rpath=P/'RESEARCH_OBLIGATIONS.json';r=load(rpath);obs=['RO-C3-002','RO-C3-003','RO-C3-004','RO-C3-005','RO-C3-006','RO-C3-007','RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
paths=[x.as_posix() for x in sorted(O.glob('*.json'))]+[(I/n).as_posix() for n in ['index.json','check.json']]+[cp.as_posix()]
for p in paths:
 assert p not in existing
 r['reportReviews'].append(dict(path=p,obligations=obs))
 for o in r['obligations']:
  if o['id'] in obs:o['evidence'].append(p)
rpath.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS: root/protocol descriptor history reconciled.
Start CAMPAIGN3_HISTORY_GA_ROOT_DESCRIPTORS_CHECKPOINT.md.
16 sources;seven exact symbolic replays/40 structural faults PASS.
Seven current component tests/six original substitutions pass;28 exact bindings.
Classification grants no authority;old-owner denial and composed32-root bound verified.
Only three graph maxima27-to30 change;protocol shape is not monotonicity proof.
SourceREV164:9961 assigned/1412 unassigned;19985 narrative/184028 backing;920 artifacts.
Next protocol transition/owner join and retained-read history;authority adequacy open.
All jobs terminal. Formula343/Values90/15 separate;formula pin,legacy log and prior
exclusions OPEN. Counts not adequacy. HQ012 unstarted;exitAuditREV111 unchanged.
Campaign3 NOT EXIT-READY.1519/0;108 verdicts;55/58 wrappers;132 bounded;corpus0.29.0/21.
RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED. No owner ruling or obligation closure.
'''
cur.write_text(old.decode('utf-8-sig').split('HQ-011 IN PROGRESS:')[0]+route,encoding='utf-8',newline='\n')
a=Path('AGENTS.md');s=a.read_text(encoding='utf-8-sig');needle='**Current routing (2026-10-07):**';pos=s.index(needle)
a.write_text(s[:pos]+needle+'\n'+route+'\n'+s[pos:].replace('**Current routing','**Prior routing',1),encoding='utf-8',newline='\n')
print(json.dumps(dict(reports=len(r['reportReviews']),added=len(paths),exactChronology=True)))
