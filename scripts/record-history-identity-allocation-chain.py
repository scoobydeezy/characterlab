from pathlib import Path
import json
P=Path('docs/planning')
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(P/'campaign3-history-source-roles-rev237/check.json');assert c['assignedSources']==10986
cp=P/'CAMPAIGN3_HISTORY_IDENTITY_ALLOCATION_CHAIN_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Identity decision and allocation chain reconciliation — 2026-10-08

**LOCAL DISPOSITION — no owner ruling.** HQ011 IN PROGRESS; counters **1519 / 0**.

Twelve sources preserve266 original narrative and10 backing occurrences, including all499
JSON string leaves. Fresh checks bind63 referenced hashes to current or already indexed
historical bytes, compare complete audit snapshots to frozen tables, and verify each
namespace/member Markdown row. No new archive or unresolved source identity was needed.

The reviewed decisions preserve the original discovered flaws: canonical encodability
alone did not supply a legitimate production identity home, and the old text-only SEM
construction did not implement the specified nested-origin grammar. The accepted
correction allocates1037/1122 for origins,1038 for authored content and1039 for the fixed
observation vocabulary. It promotes no fixture namespace, reuses no permanent number,
adds no record or state and does not create an occurrence rule for runtime entity IDs.
Only observation vocabulary has a fixed member; individual content keys remain authored.

The origin alternative selecting reviewed append-only homes supersedes its earlier
owner-decision request. The two alternatives and migration consequences remain visible.
Complete typed content identity, authored/runtime origin, contextual character role and
observer evidence are separate. Historical PHEN-SEM and corrected regression retain
different committed bytes; no earlier result is rewritten as equivalent.

Stored mechanical check counts37/43/77 describe separate allocation audits. They are
neither behavioral test counts nor fresh replay totals. Snapshot/row/hash checks above
were performed now; historical audit writers and runtime suites were not rerun. Allocation
freeze, component qualification and public factory admission remain separate gates.
The later scoped component/factory evidence supplies its own claims and limitations.

Source REV237:10,986 assigned /387 unassigned;190,191 narrative /211,949 backing;
1,221 indexed backing resources. No model, law, allocation, verdict, corpus or obligation
status change. Prior source gaps, formula provenance, legacy log, post-cutoff joins and
independent adequacy remain open. HQ012 unstarted; Campaign3 NOT EXIT-READY.
1519/0;108 verdicts;132 bounded clauses;55/58 wrappers;corpus0.29.0/21.
RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED.
''',encoding='utf-8',newline='\n')
rpath=P/'RESEARCH_OBLIGATIONS.json';r=load(rpath);obs=['RO-C3-008','RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
paths=[p.as_posix() for d in ['campaign3-history-identity-allocation-chain-rev1','campaign3-history-source-roles-rev237'] for p in sorted((P/d).glob('*.json'))]+[cp.as_posix()]
for p in paths:
 assert p not in existing
 r['reportReviews'].append(dict(path=p,obligations=obs))
 for o in r['obligations']:
  if o['id'] in obs:o['evidence'].append(p)
rpath.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS: identity decision/allocation chains reconciled.
Start CAMPAIGN3_HISTORY_IDENTITY_ALLOCATION_CHAIN_CHECKPOINT.md.
Twelve sources;266 narrative/10backing;499strings;63exact bindings checked.
Original missing identity authority/text-only conformance flaw and migration preserved.
Source REV237:10986 assigned /387 unassigned;190191 narrative /211949 backing;
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
