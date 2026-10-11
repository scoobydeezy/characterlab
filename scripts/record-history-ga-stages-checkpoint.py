"""Record GA symbolic-stage history without changing historical claims or obligations."""
from pathlib import Path
import json
P=Path('docs/planning');O=P/'campaign3-history-ga-stages-rev1';I=P/'campaign3-history-source-roles-rev150'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(O/'check.json');i=load(I/'check.json');assert c['freshSymbolicFaultExecutions']==81
cp=P/'CAMPAIGN3_HISTORY_GA_STAGES_CHECKPOINT.md';assert not cp.exists(),'Do not append chronology twice.'
cp.write_text('''# General Attention symbolic stage history — 2026-10-07

**LOCAL DISPOSITION — no owner ruling required.** HQ-011 remains open.
Counters **1519 / 0**. Twenty whole sources, 1,219 JSON string leaves,
272 narrative and four backing occurrences; 48 exact bindings and two exclusions.

Six historical declaration reviewers were replayed without changing their original
assertions or receipts. All 81 fault-check executions reproduced the original results.
These check symbolic packets, not running handlers, public admission or persistence.
The source, acquisition/recall, concern, goal/attribution, presentation and retention
proposals keep separate ownership, causal ordering and work subtotals. Named state
roots are not executable ReadDomains; local event totals are not whole-model ceilings.

The first acquisition review's `encoder-physical-read` fault actually injected a
write. Its successor adds the missing read guard and changes the mutation to a read.
A fresh paired witness confirms that a physical read passes the first validator
and fails the second; both reject a write. Identical fault labels and PASS results
therefore do not prove identical coverage. This is a historical validator coverage
gap, not evidence of a runtime truth leak. Both original receipts remain unchanged.

The goal/attribution correction also matters: completed sensing with no experience
is explicit absence, not an unavailable assessment or a missing delivery. It allocates
no synthetic assessment/result, reads no goal, and still completes authenticated
absence envelopes. Missing or forged envelopes remain errors. Frozen qualification,
actual semantic use and attributed target remain distinct. Later public execution
must provide its own evidence; symbolic consistency never supplied that proof.

Actual presentation requires an explicit plan and nonempty event recollection.
Recall alone, body baseline and cognitive use do not acquire presentation credit.
Retention cleanup removes histories only after actual complete memory loss and
does not append presentation times. Memory loss and graph loss remain independent;
terminal owners use their common pre-batch state and validated result descriptors.

Two old component snapshots are unavailable: generalSourceOpportunity.ts at
e41afbba0ba5ecf1e4625bfa86f1ec8de73f9e19cdce9fad96acc020eb2fd811,
and visualFormationEvidence.ts at
7766369e5712de9d0c34771e8c40b8c8c64e271afc3f7579014b7978177bd53b.
Exact-path local all-ref Git history and LF/CRLF checks found neither. Their original
component-content authority is excluded; current code is not substituted. The
symbolic packets and their exact reviewers are available independently. These
exclusions remain part of final source adequacy, not silent closure of missing proof.

SourceREV150: 9,776 assigned / 1,597 unassigned; 17,338 narrative / 183,032 backing;
916 outside-census artifacts. Prior assignments and archives are unchanged. Counts
are accounting, not adequacy. No production code, model, allocation, verdict,
corpus or obligation status changed. No runtime or component tests were newly run.

Next: GA carrier, source/component and complete-package history. Start the goal/result
carrier and binding revisions, then reconcile their identity-role inventories and
output/occurrence closure against actual components and later public qualification.
Earlier formula/legacy-log and historical-source exclusions remain open. HQ012 is
unstarted; Campaign3 is NOT EXIT-READY. 108 verdicts; 132 bounded clauses; 55/58
wrappers; corpus0.29.0/21; exitAuditREV111 unchanged.
''',encoding='utf-8',newline='\n')
rp=P/'RESEARCH_OBLIGATIONS.json';r=load(rp);obs=['RO-C3-002','RO-C3-003','RO-C3-004','RO-C3-005','RO-C3-006','RO-C3-007','RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
paths=[x.as_posix() for x in sorted(O.glob('*.json'))]+[(I/n).as_posix() for n in ['index.json','check.json']]+[cp.as_posix()];added=0
for p in paths:
 if p in existing:continue
 r['reportReviews'].append(dict(path=p,obligations=obs));added+=1
 for o in r['obligations']:
  if o['id'] in obs:o['evidence'].append(p)
rp.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS: GA symbolic stage history reconciled.
Start CAMPAIGN3_HISTORY_GA_STAGES_CHECKPOINT.md.
20 sources;81 original symbolic fault executions and4 paired read/write outcomes PASS.
First encoder-read fault actually injected writes; forward revision adds read guard.
48 exact bindings;2 unavailable old component snapshots explicitly excluded.
Source/recall/use/presentation/retention and completed absence remain distinct.
No new runtime execution; symbolic consistency is not public qualification.
SourceREV150:9776 assigned/1597 unassigned;17338 narrative/183032 backing;916 outside-census artifacts.
Next GA goal/result carrier and binding revisions, identity-role inventories,
output/occurrence and component/whole-package history. All jobs terminal.
Formula343/Values90/15 separate;formula pin,legacylog,GA provenance and earlier
historical exclusions OPEN. Counts not adequacy. HQ012 unstarted;exitAuditREV111 unchanged.
Campaign3 NOT EXIT-READY.1519/0;108verdicts;55/58wrappers;132bounded;corpus0.29.0/21.
RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED. No owner ruling or obligation closure.
'''
head=old.decode('utf-8-sig').split('HQ-011 IN PROGRESS:')[0];cur.write_text(head+route,encoding='utf-8',newline='\n')
a=Path('AGENTS.md');s=a.read_text(encoding='utf-8-sig');needle='**Current routing (2026-10-07):**';pos=s.index(needle);s=s[:pos]+needle+'\n'+route+'\n'+s[pos:].replace('**Current routing','**Prior routing',1);a.write_text(s,encoding='utf-8',newline='\n')
print(json.dumps(dict(reports=len(r['reportReviews']),added=added,exactChronology=True)))
