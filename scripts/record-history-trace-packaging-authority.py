from pathlib import Path
import json
P=Path('docs/planning')
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(P/'campaign3-history-source-roles-rev239/check.json');assert c['assignedSources']==11000
cp=P/'CAMPAIGN3_HISTORY_TRACE_PACKAGING_AUTHORITY_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Trace and model-packaging authority reconciliation — 2026-10-08

**LOCAL DISPOSITION — no owner ruling.** HQ011 IN PROGRESS; counters **1519 / 0**.

Nine sources preserve189 original narrative occurrences. Trace remains omniscient execution
history, never character knowledge. Failure diagnostics are non-authoritative and cannot
become committed ancestors. Opaque truth handles can leak through equality, ordering or
cardinality; observer-safe provenance requires more than an unreadable identifier.

The original first-profile trace gap and corrected phase120 owner/version pairing remain
explicit. The bridge composite has its own semantic owner; its private raw observation
compiler creates no second transition, trace envelope or observer occurrence. EVID retains
only admitted safe evidence and observer subjects with zero state reads. Actual scheduler
children are traced after allocation; no trace construction remints identities.

ADAPT trace must contain all effective operations and actual WRT-produced diffs after the
whole batch finishes. Requested writes cannot substitute for completed effects. Canonical
StatePath patch order, RuleId evaluation order and event-sequence envelope order remain
distinct. No-op reads/evaluations survive without mutations; phase150 stays non-schedulable.
Serialization/invariant failure still rolls back the whole instant before publication.

Adding authoritative trace output required RulesVersion0.2 and a distinct ModelIdentity.
The old0.1 packet cannot acquire new trace semantics or a save-migration alias. Symbolic
bundle acceptance, permanent member allocation, replacement byte materialization,
component wrappers and independent factory/phenomenon qualification retain separate gates.
Historical396/401/386 test counts,18-envelope continuation and save-byte receipts remain
scoped claims linked to their machine packets, not new executions in this review.

The six-slot registry commits one complete decoded snapshot. Cross-slot keyed grammar
coverage and whole-model validator references cannot be reduced to the ownership slot or
slot5 alone. Work limit is a committed parameter; supported schemas do not imply admitted
execution. Empty save metadata follows bounded closure checks, not empty initial state.
Earlier proposed/withheld language is superseded only by its explicit later acceptance.

Source REV239:11,000 assigned /373 unassigned;190,503 narrative /211,997 backing;
1,225 indexed backing resources. No new archive/source gap, runtime/test/build rerun,
model, law, allocation, verdict, corpus or obligation status change. Prior source gaps,
formula provenance, legacy log, post-cutoff joins and independent adequacy remain open.
Next bind the first/replacement machine packets and continuation evidence exactly.
HQ012 unstarted; Campaign3 NOT EXIT-READY.1519/0;108 verdicts;132 bounded clauses;
55/58 wrappers;corpus0.29.0/21. RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED.
''',encoding='utf-8',newline='\n')
rpath=P/'RESEARCH_OBLIGATIONS.json';r=load(rpath);obs=['RO-C3-008','RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
paths=[p.as_posix() for d in ['campaign3-history-trace-packaging-authority-rev1','campaign3-history-source-roles-rev239'] for p in sorted((P/d).glob('*.json'))]+[cp.as_posix()]
for p in paths:
 assert p not in existing
 r['reportReviews'].append(dict(path=p,obligations=obs))
 for o in r['obligations']:
  if o['id'] in obs:o['evidence'].append(p)
rpath.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS: trace/model packaging authority reconciled.
Start CAMPAIGN3_HISTORY_TRACE_PACKAGING_AUTHORITY_CHECKPOINT.md.
Nine sources;189 narrative occurrences; no new archive/source gap or rerun.
Corrected trace ownership, actual diffs and replacement model identity stay distinct.
Source REV239:11000 assigned /373 unassigned;190503 narrative /211997 backing;
1225 backing resources. Values post-cutoff reviews retain separate denominators.
Prior source-gap inventories remain open;no global deduplication or absence claim.
Next first/replacement packets, remaining support,post-cutoff joins and independent adequacy.
Formula provenance and legacy log remain OPEN;HQ012 unstarted.
Campaign3 NOT EXIT-READY.1519/0;108 verdicts;55/58 wrappers;132 bounded;
corpus0.29.0/21. RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED.
All jobs terminal;no owner ruling.
'''
cur.write_text(old.decode('utf-8-sig').split('HQ-011 IN PROGRESS:')[0]+route,encoding='utf-8',newline='\n')
a=Path('AGENTS.md');s=a.read_text(encoding='utf-8-sig');needle='**Current routing (2026-10-08):**';pos=s.index(needle)
a.write_text(s[:pos]+needle+'\n'+route+'\n'+s[pos:].replace('**Current routing','**Prior routing',1),encoding='utf-8',newline='\n')
print(json.dumps(dict(reports=len(r['reportReviews']),added=len(paths),exactChronology=True)))
