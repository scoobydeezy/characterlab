from pathlib import Path
import json
P=Path('docs/planning')
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(P/'campaign3-history-source-roles-rev240/check.json');assert c['assignedSources']==11019
cp=P/'CAMPAIGN3_HISTORY_FIRST_TRACE_PACKETS_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# First and replacement trace packet reconciliation — 2026-10-08

**LOCAL DISPOSITION — no owner ruling.** HQ011 IN PROGRESS; counters **1519 / 0**.

Nineteen sources preserve13 original narrative occurrences and all15,882 JSON string
leaves, including short model/registry fields omitted by the original prose extractor.
These typed schema descriptors, model declarations, identities and canonical renderings
are backing data rather than additional research findings. Each source retains its
individual occurrence identity and contextual role even where bytes repeat.

Fresh read-only checks decode/re-encode14 canonical/readable pairs, restore two model
identities and recompute six manifest commitments using existing shared codecs. All six
registry slots, schema/entry/grammar/role counts, independent version fields and work
limit100 match the stored declarations. The three manifests and component identities
are identical across packets; only ModelIdentity field1 RulesVersion changes. The exact
24-entry old semantic bundle gains only the two accepted trace entries, with fixed
input/persistence profiles. There is no old/new identity or save-migration equivalence.

All45 file-hash references in the two15-file materialization receipts and the15-old-file
preservation list match. Separately,14 manifest hashes match decoded canonical bytes;
hex text-file hashes and decoded binary hashes are different commitments. Fourteen
existing frozen hex files are now explicitly indexed as backing resources; no duplicate
archive copies were made. Historical delete/reconstruct scripts were not rerun.

The trace continuation receipt records two processes,18 committed records and a39786-byte
final save with matching checkpoint/final continuation and no original S0 handoff. It is
a historical summary, not retained full-save/trace evidence or a fresh continuation run.
The current writer shows temporary model/input/checkpoint handoff and cleanup, but the
receipt has no original writer fingerprint, so current code is not claimed to be its
historical exact revision. Later original-prefix restoration contracts retain separate
requirements; this earlier bounded continuation does not replace them.

Source REV240:11,019 assigned /354 unassigned;190,516 narrative /211,997 backing;
1,239 indexed backing resources. No runtime/test/build rerun, model, law, allocation,
verdict, corpus or obligation status change. Prior source gaps, formula provenance,
legacy log, post-cutoff joins and independent adequacy remain open.
HQ012 unstarted; Campaign3 NOT EXIT-READY.1519/0;108 verdicts;132 bounded clauses;
55/58 wrappers;corpus0.29.0/21. RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED.
''',encoding='utf-8',newline='\n')
rpath=P/'RESEARCH_OBLIGATIONS.json';r=load(rpath);obs=['RO-C3-008','RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
paths=[p.as_posix() for d in ['campaign3-history-first-trace-packets-rev1','campaign3-history-source-roles-rev240'] for p in sorted((P/d).glob('*.json'))]+[cp.as_posix()]
for p in paths:
 assert p not in existing
 r['reportReviews'].append(dict(path=p,obligations=obs))
 for o in r['obligations']:
  if o['id'] in obs:o['evidence'].append(p)
rpath.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS: first/trace model packets reconciled.
Start CAMPAIGN3_HISTORY_FIRST_TRACE_PACKETS_CHECKPOINT.md.
Nineteen sources;13 narrative occurrences;15882strings;14canonical/readable pairs verified.
Two model identities/sixmanifest commitments;RulesVersion-only delta;no runtime rerun.
Source REV240:11019 assigned /354 unassigned;190516 narrative /211997 backing;
1239 backing resources. Values post-cutoff reviews retain separate denominators.
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
