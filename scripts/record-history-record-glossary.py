from pathlib import Path
import json
P=Path('docs/planning')
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(P/'campaign3-history-source-roles-rev300/check.json');assert c['assignedSources']==11339
cp=P/'CAMPAIGN3_HISTORY_RECORD_GLOSSARY_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Historical record glossary — 2026-10-08

**LOCAL DISPOSITION — reading aid verified within its dated codec scope.**
HQ-011 in progress; no owner ruling. Counters **1519 / 0**.

The JSON/Markdown glossary has298 record/schema pairs and297 distinct record IDs.
TaskCommitmentState373 appears at versions1 and2; this is not a collision. Read-only
inspection of the scoped cognitive codec verifies every semantic name and all298
field-number/name rows against the stored glossary. No original generator or runtime
was executed. Its85 namespace rows cite18 exact matching source fingerprints.

Formal allocation tables remain authority. Shared namespace role names do not alias
identity families or confer permissions. Scheduling phases are not record IDs;
a high frontier such as452 is not an implemented-schema count. The27/26 control
means event count versus insufficient work budget. Schema presence does not imply
behavioral coverage. The glossary's title does not make its2026-09-10 receiving
profile an up-to-date inventory of all Campaign3 code or allocations.

Ten original narrative occurrences and all931 string leaves (including the Markdown
text) retain scope. No new backing resource or source gap. Original glossary unchanged.
REV300:11,339 assigned /34 unassigned;197,864 narrative /212,373 backing;
2,735 backing resources. No model, law, allocation, verdict, corpus or obligation
status changes. Remaining source support, dependent claims, post-cutoff joins and
independent adequacy remain open. HQ-012 unstarted; Campaign3 NOT EXIT-READY.
108 verdicts;132 bounded clauses;55 /58 wrappers;corpus0.29.0 /21.
RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED.
''',encoding='utf-8',newline='\n')
rpath=P/'RESEARCH_OBLIGATIONS.json';r=load(rpath);obs=['RO-C3-008','RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
paths=[p.as_posix() for d in ['campaign3-history-record-glossary-rev1','campaign3-history-source-roles-rev300'] for p in sorted((P/d).glob('*.json'))]+[cp.as_posix()]
for p in paths:
 assert p not in existing
 r['reportReviews'].append(dict(path=p,obligations=obs))
 for o in r['obligations']:
  if o['id'] in obs:o['evidence'].append(p)
rpath.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS: historical JSON/Markdown record glossary reconciled.
Start CAMPAIGN3_HISTORY_RECORD_GLOSSARY_CHECKPOINT.md.
298 schema pairs/297 IDs; all scoped codec field rows match;85 namespace rows.
18 exact source bindings; dated reading aid is not full current Campaign3 inventory.
Source REV300:11339 assigned /34 unassigned;197864 narrative /212373 backing;
2735 backing resources. No new source gap/backing or runtime run.
Next: remaining material support, dependent-claim dispositions, post-cutoff joins and independent adequacy.
Recheck earlier gaps against expanded backing index. HQ-012 unstarted.
Campaign3 NOT EXIT-READY. Counters1519 /0;108 verdicts;55 /58 wrappers;
132 bounded clauses;corpus0.29.0 /21. RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED.
All jobs terminal;no owner ruling.
'''
cur.write_text(old.decode('utf-8-sig').split('HQ-011 IN PROGRESS:')[0]+route,encoding='utf-8',newline='\n')
a=Path('AGENTS.md');s=a.read_text(encoding='utf-8-sig');needle='**Current routing (2026-10-08):**';pos=s.index(needle)
a.write_text(s[:pos]+needle+'\n'+route+'\n'+s[pos:].replace('**Current routing','**Prior routing',1),encoding='utf-8',newline='\n')
print(json.dumps(dict(reports=len(r['reportReviews']),added=len(paths),exactChronology=True)))
