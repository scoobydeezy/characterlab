from pathlib import Path
import json
P=Path('docs/planning')
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(P/'campaign3-history-source-roles-rev249/check.json');assert c['assignedSources']==11078
cp=P/'CAMPAIGN3_HISTORY_PROBE_PACKETS_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Stored probe model packet reconciliation — 2026-10-08

**LOCAL DISPOSITION — no owner ruling.** HQ011 IN PROGRESS; counters **1519 / 0**.

Nineteen sources preserve10 original narrative occurrences and all16,988 JSON string
leaves. Current codecs verify14 canonical/readable pairs, two model identities and six
manifest commitments. Relative to the bounded trace model, probe.1 changes ModelIdentity
fields1/6, adds nine slot0 entries and11 role entries, with no removals. Probe.2 changes
only field1; all six component artifacts remain equal. Exact semantic bundle/profile
deltas agree. These are read-only stored-packet checks, not fresh runtime qualification.

The review verifies103 text-file hashes and14 decoded canonical hashes without conflating
the representations. Fourteen existing hex resources are newly indexed, not new copies.
Two pre-freeze REVIEW_MANIFEST hashes remain unresolved: original2fe5e12c... and successor
a53b2fe8.... Their14 canonical/readable companions match. The available Git path revisions,
indexed backing and17 planning manifest copies did not recover those exact metadata bytes.
Later acceptance prose explains status changes but cannot substitute for the old manifest.
No global absence claim or model-byte failure is inferred.

The historical continuation receipt reports two processes,26 trace records and55,782-byte
complete save equality without original S0 handoff. Its temporary full saves were removed
by the inspected current writer; the receipt has no historical writer fingerprint. It is
scoped historical evidence, not a fresh replay or proof reconstructed from its digest.

Preserve both rejected checker versions. First, the checker compared an empty removed set
with absent metadata; its initial diagnosis was corrected forward after inspecting the
schema. Second, it assumed every registry slot had collection items, but the unchanged
phase registry is a record. The corrected checker compares identical slots as complete
bytes and independently proves no removals in changed collections. No original artifact
or production code was changed; both rejected runs produced no packet-check receipt.

Source REV249:11,078 assigned /295 unassigned;191,524 narrative /212,202 backing;
1,255 indexed backing resources. No runtime/test/build rerun, model, law, allocation,
verdict, corpus or obligation status change. Prior source gaps plus these two metadata
gaps, formula provenance, legacy log, post-cutoff joins and independent adequacy remain
open. HQ012 unstarted; Campaign3 NOT EXIT-READY.1519/0;108 verdicts;132 bounded clauses;
55/58 wrappers;corpus0.29.0/21. RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED.
''',encoding='utf-8',newline='\n')
rpath=P/'RESEARCH_OBLIGATIONS.json';r=load(rpath);obs=['RO-C3-008','RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
paths=[p.as_posix() for d in ['campaign3-history-probe-packets-rev1','campaign3-history-probe-packets-development-rev1','campaign3-history-source-roles-rev249'] for p in sorted((P/d).glob('*.json'))]+[cp.as_posix()]
for p in paths:
 assert p not in existing
 r['reportReviews'].append(dict(path=p,obligations=obs))
 for o in r['obligations']:
  if o['id'] in obs:o['evidence'].append(p)
rpath.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS: stored probe packets and continuation receipts reconciled.
Start CAMPAIGN3_HISTORY_PROBE_PACKETS_CHECKPOINT.md.
Nineteen sources;10 narrative occurrences;16988strings;103text bindings;14canonical pairs.
Two pre-freeze manifest metadata gaps;two rejected checker runs preserved;model bytes pass.
Source REV249:11078 assigned /295 unassigned;191524 narrative /212202 backing;
1255 backing resources. Values post-cutoff reviews retain separate denominators.
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
