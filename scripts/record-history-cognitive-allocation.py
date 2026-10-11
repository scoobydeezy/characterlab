from pathlib import Path
import json
P=Path('docs/planning')
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(P/'campaign3-history-source-roles-rev183/check.json');assert c['assignedSources']==10348
cp=P/'CAMPAIGN3_HISTORY_COGNITIVE_ALLOCATION_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Historical cognitive allocation reconciliation — 2026-10-08

**LOCAL DISPOSITION — no owner ruling.** HQ011 IN PROGRESS; counters **1519 /0**.

Seven allocation proposal, freeze and additive correction sources reconciled.
196 original narrative/4 backing occurrences; all1,056 JSON string leaves,
including short tags and names;80 exact source bindings. The old canonical registry
binds its already-preserved exact archive; no current file substitutes for old bytes.

The frozen base retains all proposed76 records244 fields,103 fixed members,
52 scalar roles, namespaces and373/schema2 successor. Its only substantive addition
is17 union payload definitions taken exactly from the reviewed allocation audit.
The displayed record fields and fixed-member table match the proposal. This preserves
373/schema1 and the distinction between discriminator tags and union payload fields.

The separately accepted leaf/task-instruction adds one member in existing namespace1032.
Its mapping is read-only field2 of373/schema2 in prospective-commitments; it adds no
record, field or namespace. The fixed-member omission is preserved as an additive
correction rather than silently inserted into the original103-member table.

Historical NOT PASSED/PENDING records allocation-time scope, not a current runtime
failure. Allocation acceptance, model construction and later behavioral/public
qualification remain separate. No old writer or fresh runtime/build was executed.
No source/model bytes, allocation, law, verdict, corpus or obligation status changed.

SourceREV183:10,348 assigned/1,025 unassigned;131,065 narrative/211,249 backing;
1,190 indexed archives. Next model declaration/join/difference/admission audits,
then earlier runtime receipts and correction chains.80 exit-inventory hashes plus
one older scheduler identity remain open, as do formula provenance, legacy log,
Values90/15 and independent adequacy. HQ012 unstarted; Campaign3 NOT EXIT-READY.
1519/0;108 verdicts;132 bounded clauses;55/58 wrappers;corpus0.29.0/21.
RO019 ACTIVE;RO021 mandatory UNSATISFIED;RO022 CLOSED. No owner ruling.
''',encoding='utf-8',newline='\n')
rpath=P/'RESEARCH_OBLIGATIONS.json';r=load(rpath);obs=['RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
paths=[p.as_posix() for d in ['campaign3-history-cognitive-allocation-rev1','campaign3-history-source-roles-rev183'] for p in sorted((P/d).glob('*.json'))]+[cp.as_posix()]
for p in paths:
 assert p not in existing
 r['reportReviews'].append(dict(path=p,obligations=obs))
 for o in r['obligations']:
  if o['id'] in obs:o['evidence'].append(p)
rpath.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS:seven cognitive allocation sources reconciled.
Start CAMPAIGN3_HISTORY_COGNITIVE_ALLOCATION_CHECKPOINT.md.
196 narrative/4 backing occurrences;1056 string leaves;80 exact source bindings.
Base76 records244 fields103 members unchanged;17 reviewed union definitions.
Separate1032 instruction leaf preserves additive correction and read-only ownership.
SourceREV183:10348 assigned/1025 unassigned;131065 narrative/211249 backing;
1190 archives.80 exit-inventory gaps plus one scheduler identity OPEN.
Next model declaration/join/difference/admission audits and earlier runtime receipts.
Formula provenance,legacy log,Values90/15 and independent adequacy OPEN.
HQ012 unstarted;Campaign3 NOT EXIT-READY.1519/0;108 verdicts;55/58 wrappers;
132 bounded;corpus0.29.0/21. RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED.
All jobs terminal;no owner ruling.
'''
cur.write_text(old.decode('utf-8-sig').split('HQ-011 IN PROGRESS:')[0]+route,encoding='utf-8',newline='\n')
a=Path('AGENTS.md');s=a.read_text(encoding='utf-8-sig');needle='**Current routing (2026-10-08):**';pos=s.index(needle)
a.write_text(s[:pos]+needle+'\n'+route+'\n'+s[pos:].replace('**Current routing','**Prior routing',1),encoding='utf-8',newline='\n')
print(json.dumps(dict(reports=len(r['reportReviews']),added=len(paths),exactChronology=True)))
