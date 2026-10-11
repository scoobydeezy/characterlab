from pathlib import Path
import json
P=Path('docs/planning')
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(P/'campaign3-history-source-roles-rev238/check.json');assert c['assignedSources']==10991
cp=P/'CAMPAIGN3_HISTORY_TASK_RUNTIME_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Task lifecycle receipt and source reconciliation — 2026-10-08

**LOCAL DISPOSITION — no owner ruling.** HQ011 IN PROGRESS; counters **1519 / 0**.

Five receipts preserve123 original narrative/48 backing occurrences and all1290 JSON
string leaves.470 exact reference bindings are available. Three original production
sources were recovered from Git: taskExecution, taskBootstrap and orderedInputs.
The original mutation writer was recovered by reversing its documented report-filename
and expected-mutation exit-code changes; the full4137 bytes match its recorded SHA-256.
The first bounded-search gap is preserved in review.json, corrected forward by
writer-recovery.json and authoritative review-rev2.json. Hash equality verifies bytes,
not execution or timestamp. Earlier five-test preservation source and the already known
scheduler snapshot remain unresolved; current/later receipts do not replace them.

The actual historical comparison records five quiescent checkpoints0/2/3/4/7 and live
lists[]/[0]/[0]/[1]/[]. Its external harness selects Open tasks within their half-open
windows and passes that list to the real reference commitmentSignals function. The
reference does not implement automatic lifecycle, and this is not a canonical workspace
or motive-producing join. Same-holder obligations retain separate task referents; fixed
1/10 pressure and control/action are controls, not acquired efficacy or social fulfillment.

The mutation receipts share all result rows:24 passing baseline tests and seven named
substitutions, with failed-test counts3/1/1/1/1/1/1. The baseline excludes64 fixed-slot
combinations. Public controls and the synthetic duplicate-clock component are distinct;
seven named rollback injection sites do not qualify every arbitrary fault. Exact lower
reading endpoints, half-open time windows, terminal immutability, authenticated sources,
preflight sealing and collision-before-prior checks preserve separate responsibilities.
The original and later writers differ only in destination and explicit expected-mutation
exit-status cleanup. No runtime or historical writer was rerun here.

Both artifact audits preserve the same212 entries and model digest. REV1 has five
changed-source inherited packets; REV2 advances those five receipt identities and records
all18 as current in its own snapshot. The preservation-test count advances5 to9, while
974 pre-hardening baseline,24 focused and328 reference tests retain separate denominators.
The reference config-loader failure and later explicit-config success remain visible.
These receipt revisions are not additive independent qualification or raw execution logs.

Source REV238:10,991 assigned /382 unassigned;190,314 narrative /211,997 backing;
1,225 indexed backing resources. No production/model/law/allocation/verdict/corpus or
obligation status change. Prior source gaps plus the earlier task-preservation-test group,
formula provenance, legacy log, post-cutoff joins and independent adequacy remain open.
HQ012 unstarted; Campaign3 NOT EXIT-READY.1519/0;108 verdicts;132 bounded clauses;
55/58 wrappers;corpus0.29.0/21. RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED.
''',encoding='utf-8',newline='\n')
rpath=P/'RESEARCH_OBLIGATIONS.json';r=load(rpath);obs=['RO-C3-008','RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
paths=[p.as_posix() for d in ['campaign3-history-task-runtime-rev1','campaign3-history-source-roles-rev238'] for p in sorted((P/d).glob('*.json'))]+[cp.as_posix()]
for p in paths:
 assert p not in existing
 r['reportReviews'].append(dict(path=p,obligations=obs))
 for o in r['obligations']:
  if o['id'] in obs:o['evidence'].append(p)
rpath.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS: task runtime receipts and source identities reconciled.
Start CAMPAIGN3_HISTORY_TASK_RUNTIME_CHECKPOINT.md; review-rev2 is authoritative.
Five sources;123 narrative/48backing;1290strings;470exact bindings;four recovered sources.
Original writer recovered exactly; earlier preservation-test/repeated scheduler gaps remain.
Source REV238:10991 assigned /382 unassigned;190314 narrative /211997 backing;
1225 backing resources. Values post-cutoff reviews retain separate denominators.
Prior source-gap inventories remain open;no global deduplication or absence claim.
Next remaining material support,post-cutoff joins and independent adequacy.
Formula provenance and legacy log remain OPEN;HQ012 unstarted.
Campaign3 NOT EXIT-READY.1519/0;108 verdicts;55/58 wrappers;132 bounded;
corpus0.29.0/21. RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED.
All jobs terminal;no owner ruling.
'''
cur.write_text(old.decode('utf-8-sig').split('HQ-011 IN PROGRESS:')[0]+route,encoding='utf-8',newline='\n')
a=Path('AGENTS.md');s=a.read_text(encoding='utf-8-sig');needle='**Current routing (2026-10-08):**';pos=s.index(needle)
a.write_text(s[:pos]+needle+'\n'+route+'\n'+s[pos:].replace('**Current routing','**Prior routing',1),encoding='utf-8',newline='\n')
print(json.dumps(dict(reports=len(r['reportReviews']),added=len(paths),exactChronology=True)))
