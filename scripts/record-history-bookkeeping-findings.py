from pathlib import Path
import json
P=Path('docs/planning')
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(P/'campaign3-history-source-roles-rev267/check.json');assert c['assignedSources']==11183
cp=P/'CAMPAIGN3_HISTORY_BOOKKEEPING_FINDINGS_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Historical checker and bookkeeping findings — 2026-10-08

**LOCAL DISPOSITION — no owner ruling.** HQ-011 remains in progress; counters **1519 / 0**.

Six sources preserve 32 original narrative occurrences. All string leaves of the five
JSON receipts are included, including values shorter than the original extraction limit.

The biological historical checker encountered repaired wrapper bytes, not a failed
simulation. Both the original preserved source and repaired current source reproduce
the recorded hashes. Separate quiescence qualification supplies the repair evidence.
Two obligation-count check failures concern literal slash spacing; numeric values
remained1/19/0. The original BODY CURRENT is recovered exactly from chronology bytes
386290:388408 and matches its recorded SHA-256. Personal-loss index and recorder hashes
also match. No historical writer or simulation was executed.

The initial inventory script independently reproduces its unterminated-string
SyntaxError under parsing only. It could not have frozen a universe or extracted
findings. The truncated historical global whitespace diagnostic remains explicitly
incomplete; exact log bytes are retained and only the log is excluded from diff checking.

This pass also caught its own classification defect before adoption: prepared source
REV266 duplicated a census member as outside-census backing. The rejected review and
index remain preserved with a finding. Corrected review REV2 excludes all census
members from that resource list; authoritative REV267 extends accepted REV265.
No original occurrence or scientific disposition changed in that correction.

Source REV267: 11,183 assigned / 190 unassigned; 193,881 narrative / 212,202 backing;
1,296 indexed backing resources. No runtime tests, model, law, allocation, verdict,
corpus or obligation status changed. Source gaps, post-cutoff joins and independent
adequacy remain open. HQ-012 unstarted; Campaign3 NOT EXIT-READY. Counters1519 / 0;
108 verdicts;132 bounded clauses;55 / 58 wrappers;corpus0.29.0 / 21.
RO019 ACTIVE; RO021 UNSATISFIED; RO022 CLOSED.
''',encoding='utf-8',newline='\n')
rpath=P/'RESEARCH_OBLIGATIONS.json';r=load(rpath);obs=['RO-C3-008','RO-C3-010','RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
paths=[p.as_posix() for d in ['campaign3-history-bookkeeping-findings-rev1','campaign3-history-source-roles-rev266','campaign3-history-bookkeeping-findings-rev2','campaign3-history-source-roles-rev267','campaign3-history-bookkeeping-classification-finding-rev1'] for p in sorted((P/d).glob('*.json'))]+[cp.as_posix()]
for p in paths:
 assert p not in existing
 r['reportReviews'].append(dict(path=p,obligations=obs))
 for o in r['obligations']:
  if o['id'] in obs:o['evidence'].append(p)
rpath.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS: checker and bookkeeping findings reconciled.
Start CAMPAIGN3_HISTORY_BOOKKEEPING_FINDINGS_CHECKPOINT.md.
Six sources preserve32 original narrative occurrences and all receipt string leaves.
Old CURRENT recovered exactly; original/repaired runtime and recorder hashes verified.
Prepared REV266 rejected for duplicate census/backing classification; REV267 extends265.
Source REV267:11183 assigned /190 unassigned;193881 narrative /212202 backing;
1296 backing resources. No scientific result changed by bookkeeping repairs.
Next: remaining material support, post-cutoff joins and independent adequacy.
Prior source gaps, formula provenance and legacy log remain OPEN; HQ-012 unstarted.
Campaign3 NOT EXIT-READY. Counters1519 /0;108 verdicts;55 /58 wrappers;
132 bounded clauses;corpus0.29.0 /21. RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED.
All jobs terminal; no owner ruling.
'''
cur.write_text(old.decode('utf-8-sig').split('HQ-011 IN PROGRESS:')[0]+route,encoding='utf-8',newline='\n')
a=Path('AGENTS.md');s=a.read_text(encoding='utf-8-sig');needle='**Current routing (2026-10-08):**';pos=s.index(needle)
a.write_text(s[:pos]+needle+'\n'+route+'\n'+s[pos:].replace('**Current routing','**Prior routing',1),encoding='utf-8',newline='\n')
print(json.dumps(dict(reports=len(r['reportReviews']),added=len(paths),exactChronology=True)))
