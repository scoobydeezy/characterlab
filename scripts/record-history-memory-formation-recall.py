from pathlib import Path
import json
P=Path('docs/planning')
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(P/'campaign3-history-source-roles-rev221/check.json');assert c['assignedSources']==10911
cp=P/'CAMPAIGN3_HISTORY_MEMORY_FORMATION_RECALL_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Memory formation, recall and restore history — 2026-10-08

**LOCAL DISPOSITION — no owner ruling.** HQ011 IN PROGRESS; counters **1519 / 0**.

Four component design records and all 155 original narrative occurrences are
reconciled. Their staged acceptance joins the reviewed symbolic packaging, exact
packet history and accepted bounded memory runtime qualification.

M3 rejected a duplicate insertion capability and an independent state/restore-validator
roster lookup. Existing StateWrites permission remains separate from the exact
insert-only seam relation. Local record validity does not authenticate formation.
M4b closed the key condition by using the same preauthorized(C,E) address, with one
ordinary IDN projection and one optional direct episode read. Required IDN failure
is distinct from absent memory, and read ablation removes the read rather than
performing it and hiding its output. No secondary owner lookup is authorized.

M4a derives the content-free cue from the actual live337 output, independently of
formation. Scheduler identity, exact source association and liveness precede all
projection access. Existing immediate V04 input rules cannot impersonate this
delayed branch. Its accepted positive delay and overflow behavior are scheduling
semantics, not decay or accessibility laws. M4a did not itself select prefix replay.

M5 subsequently selected original-S0 admitted prefix execution, exact whole-save
comparison and detached pending facts before fresh capability creation. A self-consistent
certificate is insufficient without an independent authority; signing introduces a
separate trust seam. Valid old prefixes remain valid, so this is not antirollback or
checkpoint freshness. N=0 and whole-instant stopping are explicit. Validation resource
failure supplies no unchecked runnable fallback.

Rejected mixed-stage visibility and unused typed reservations remain preserved.
Real-or-void allocation, exclusive phase140 categories and historical337 trace
provenance do not add lookup permission. Derived topology tables and sixteen controls
were design obligations until separately executed; coincident source/future work
must retain its actual ordering and additive contributions.

Source REV221: 10,911 assigned /462 unassigned; 188,453 narrative /211,856 backing;
1,219 indexed backing resources. No new source gap or archive, runtime/test/build
rerun, model, law, allocation, verdict, corpus or obligation status change.
Prior source gaps, formula provenance, legacy log, post-cutoff joins and independent
adequacy remain open. HQ012 unstarted; Campaign3 NOT EXIT-READY. Counters1519/0;
108 verdicts;132 bounded clauses;55/58 wrappers;corpus0.29.0/21.
RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED. No owner ruling.
''',encoding='utf-8',newline='\n')
rpath=P/'RESEARCH_OBLIGATIONS.json';r=load(rpath);obs=['RO-C3-008','RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
paths=[p.as_posix() for d in ['campaign3-history-memory-formation-recall-rev1','campaign3-history-source-roles-rev221'] for p in sorted((P/d).glob('*.json'))]+[cp.as_posix()]
for p in paths:
 assert p not in existing
 r['reportReviews'].append(dict(path=p,obligations=obs))
 for o in r['obligations']:
  if o['id'] in obs:o['evidence'].append(p)
rpath.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS: four formation/recall/restore design records reconciled.
Start CAMPAIGN3_HISTORY_MEMORY_FORMATION_RECALL_CHECKPOINT.md.
155 narrative occurrences; exact ownership/read/history boundaries preserved.
Staged component acceptance joins later packet and bounded runtime qualification.
Source REV221:10911 assigned /462 unassigned;188453 narrative /211856 backing;
1219 backing resources. Values post-cutoff reviews retain separate denominators.
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
