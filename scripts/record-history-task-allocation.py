from pathlib import Path
import json
P=Path('docs/planning')
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(P/'campaign3-history-source-roles-rev234/check.json');assert c['assignedSources']==10963
cp=P/'CAMPAIGN3_HISTORY_TASK_ALLOCATION_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Task allocation artifact reconciliation — 2026-10-08

**LOCAL DISPOSITION — no owner ruling.** HQ011 IN PROGRESS; counters **1519 / 0**.

Six artifacts preserve53 original narrative and60 backing occurrences plus all1399 JSON
string leaves. All580 referenced fingerprints match current or previously indexed bytes.
The190 inherited source paths in the proposal are distinct. These repeated bindings
across artifacts are not580 independent experiments or unique sources.

Fresh checks confirm records370..376,34 fields,14 members,ten RecordField roles and three
status variants, with no namespace or occurrence allocation. Every displayed Markdown
field/member row matches its machine counterpart; the complete embedded JSON equals
the proposal exactly. Draft and frozen table payloads differ only in version, status,
acceptance and reviewed-artifact metadata. This confirms inventory preservation, not
semantic correctness of the original key-role claim.

The original tables also contain two invalid StateMapKey declarations for373. The later
corrected table removes both while preserving records, fields, members, scalar roles
and status variants. Record-key371 fields are validated recursively through their
RecordField roles. No373 field2 was allocated by the mistaken metadata, and no permanent
number is reused. The original audit's broad role-ownership PASS remains explicitly
withdrawn for those declarations, even though its table-parity and hash results hold.

TaskSpecIds remains a set checked by its receiving compiler, not a scalar265 role.
Open and DeadlineMissed forbid the two optional support payloads; PerceivedSatisfied
requires both original observation reference and time. Neither allocation audit supplies
runtime lifecycle, model admission or psychological qualification. The separate freeze
makes identifiers permanent; the later correction and bounded implementation govern
which metadata a public model may admit.

Source REV234: 10,963 assigned /410 unassigned; 189,693 narrative /211,939 backing;
1,221 indexed backing resources. No new archive/source gap or runtime/test/build rerun.
No model, law, allocation, verdict, corpus or obligation status change. Prior gaps,
formula provenance, legacy log, post-cutoff joins and independent adequacy remain open.
HQ012 unstarted; Campaign3 NOT EXIT-READY. Counters1519/0;108 verdicts;
132 bounded clauses;55/58 wrappers;corpus0.29.0/21.
RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED. No owner ruling.
''',encoding='utf-8',newline='\n')
rpath=P/'RESEARCH_OBLIGATIONS.json';r=load(rpath);obs=['RO-C3-008','RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
paths=[p.as_posix() for d in ['campaign3-history-task-allocation-rev1','campaign3-history-source-roles-rev234'] for p in sorted((P/d).glob('*.json'))]+[cp.as_posix()]
for p in paths:
 assert p not in existing
 r['reportReviews'].append(dict(path=p,obligations=obs))
 for o in r['obligations']:
  if o['id'] in obs:o['evidence'].append(p)
rpath.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS: task allocation artifacts reconciled.
Start CAMPAIGN3_HISTORY_TASK_ALLOCATION_CHECKPOINT.md.
Six sources;53 narrative/60backing;1399strings;580exact reference bindings.
Original role-ownership error preserved despite valid table parity;no rerun.
Source REV234:10963 assigned /410 unassigned;189693 narrative /211939 backing;
1221 backing resources. Values post-cutoff reviews retain separate denominators.
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
