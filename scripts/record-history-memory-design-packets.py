from pathlib import Path
import json
P=Path('docs/planning')
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(P/'campaign3-history-source-roles-rev196/check.json');assert c['assignedSources']==10499
cp=P/'CAMPAIGN3_HISTORY_MEMORY_DESIGN_PACKETS_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Memory design packet reconciliation — 2026-10-08

**LOCAL DISPOSITION — no owner ruling.** HQ011 IN PROGRESS; counters **1519 /0**.

Twenty-one memory JSON packets and the calibration-reference correction reconciled:
359 original narrative/370 backing occurrences and5,990 exact JSON string leaves,
including short labels. All78 recorded path/hash reference occurrences resolve to
exact current or indexed preserved bytes. No new provenance gap was found.

The22-stage output inventory's138 symbolic branch cases were independently recomputed.
Positive formation reaches16 events/20 outputs/17 shared slots; denied formation7/7/6;
positive cue14/20/18; denied cue7/6/5. File counters are separate from shared slots,
reserved experience is not allocated twice, and zero-winner recollection still executes.
The draft four-formation/four-cue total139 events/172 outputs/152 slots includes source
future reads, padding and deadline. These are draft arithmetic envelopes, not actual
model trajectories, final work ceilings or later acquisition-allocation bounds.

The32 proposed recipes have31 declared comparisons and22 stage bindings. Actual
parameter differences were checked against each declared intervention; receiver
feedback pairs preserve complete source and schedule. A declared axis may retain the
same value, and the Independent/RetiredFlat floor variants remain null controls.
No model or run identity, discriminating specimen or runtime execution follows from
this recipe review. Missing-glyph/position proposals remain excluded by the later
first-source grammar, and the corrected actual concern-source sequence stays separate.

The wrapper revision changes exactly EncodingEvaluation.Calibration,
RetainedEncoding.Calibration and SpatialPreparation.Calibration from
GovernedContentDefinitionId to DefinitionId. The matching role revision changes
those three scalar families and requirements. Other common packet content remains
unchanged, with added correction descriptions and historical review metadata handled
explicitly. These identity families are not aliases. Namespace membership alone does
not prove calibration purpose, schema or executing-model membership.

The116 recorded packet corruption detections are static design checks. Inspection
confirms cloned candidate inputs and rejection checks in the fingerprinted reviewers;
no historical writer was rerun. The four AMB tests separately exercised the actual
scheduler with fixture integer leaves: forbidden child-chain rejection, shared B0 and
parent, reversed sibling order, and late failure rollback. Those historical assertions
do not prove public owner authority, PRJ or source admission. Their test bodies and
scheduler references are exactly bound, without claiming fresh test execution.

Earlier selection-keyed storage, append-only limits and coupled graph/episode/history
presence retain their explicit successor dispositions. Acquisition and successful
formation remain distinct from selection; empty/lost memory and replay governance
remain distinct. No static PASS is promoted into runtime or scientific qualification.

SourceREV196:10,499 assigned/874 unassigned;132,726 narrative/211,639 backing;
1,192 indexed archives. Two composition,two Values,seven cognitive,80 exit-inventory
and one scheduler identity groups remain open, alongside formula provenance,legacy
log,remaining material support and independent adequacy. HQ012 unstarted;Campaign3
NOT EXIT-READY. No model/law/allocation/verdict/corpus or obligation status changed.
1519/0;108 verdicts;132 bounded;55/58 wrappers;corpus0.29.0/21.
RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED. No owner ruling.
''',encoding='utf-8',newline='\n')
rpath=P/'RESEARCH_OBLIGATIONS.json';r=load(rpath);obs=['RO-C3-005','RO-C3-006','RO-C3-007','RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
paths=[p.as_posix() for d in ['campaign3-history-memory-design-packets-rev1','campaign3-history-source-roles-rev196'] for p in sorted((P/d).glob('*.json'))]+[cp.as_posix()]
for p in paths:
 assert p not in existing
 r['reportReviews'].append(dict(path=p,obligations=obs))
 for o in r['obligations']:
  if o['id'] in obs:o['evidence'].append(p)
rpath.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS:22 memory packet/correction sources reconciled.
Start CAMPAIGN3_HISTORY_MEMORY_DESIGN_PACKETS_CHECKPOINT.md.
359 narrative/370 backing;5990 strings;78 exact bindings;116 static faults/4 historical tests.
138 draft arithmetic cases/31 recipe comparisons verified;three calibration types corrected.
SourceREV196:10499 assigned/874 unassigned;132726 narrative/211639 backing;
1192 archives. Values post-cutoff reviews retain separate denominators.
Open identities:two composition,two Values,seven cognitive,80 exit-inventory,one scheduler.
Next remaining material support,post-cutoff delta joins and independent adequacy.
Formula provenance and legacy log remain OPEN;HQ012 unstarted.
Campaign3 NOT EXIT-READY.1519/0;108 verdicts;55/58 wrappers;132 bounded;
corpus0.29.0/21. RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED.
All jobs terminal;no owner ruling.
'''
cur.write_text(old.decode('utf-8-sig').split('HQ-011 IN PROGRESS:')[0]+route,encoding='utf-8',newline='\n')
a=Path('AGENTS.md');s=a.read_text(encoding='utf-8-sig');needle='**Current routing (2026-10-08):**';pos=s.index(needle)
a.write_text(s[:pos]+needle+'\n'+route+'\n'+s[pos:].replace('**Current routing','**Prior routing',1),encoding='utf-8',newline='\n')
print(json.dumps(dict(reports=len(r['reportReviews']),added=len(paths),exactChronology=True)))
