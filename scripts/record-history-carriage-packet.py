from pathlib import Path
import json
P=Path('docs/planning')
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(P/'campaign3-history-source-roles-rev217/check.json');assert c['assignedSources']==10879
cp=P/'CAMPAIGN3_HISTORY_CARRIAGE_PACKET_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Measurement carriage packet roles — 2026-10-08

**LOCAL DISPOSITION — no owner ruling.** HQ011 IN PROGRESS; counters **1519 / 0**.

Eight packet JSON sources are reconciled: the accepted concrete review manifest and
seven readable canonical artifacts. The original extractor retained 115 narrative
occurrences and no backing occurrences; the complete schema review includes all
9,595 strings, including short serialized values omitted by that extractor.

A fresh read-only check confirms seven canonical/readable pairs, three manifest
commitment digests, the positive ModelIdentity and the exact six-slot registry delta
against the stored probe successor. Model fields 1/6 change. Slot 0 adds nine/removes
one entry; slot 5 adds eight/removes none. Content, parameters and their identities
remain equal. The checker uses current shared codecs and identity functions; it does
not rerun the historical constructor, runtime, rematerializer or mutation controls.

All 87 prior-file preservation fingerprints resolve exactly. These establish current
byte integrity, not dates or original process provenance. Four availability/permission
identity representations remain distinct. Only the positive packet commitment was
freshly recomputed; the other three were not reconstructed as full models.

The 102 recorded review checks include 351 missing-entry negatives grouped into two
report rows, not 102 independent runtime behaviors. Manifest PACK and EVC unpassed
labels describe the accepted pre-runtime packet stage. Later bounded carriage
qualification supplies their scoped successor disposition, preserving generic-component
versus public-exclusion evidence and finite-input limits. Serialized schema labels and
identity fields are backing data, not separate accepted scientific findings.

Source REV217: 10,879 assigned /494 unassigned; 186,970 narrative /211,832 backing;
1,204 indexed backing resources. No new source gap or archive. Prior source gaps,
formula provenance, legacy log, post-cutoff joins and independent adequacy remain open.
No model, law, allocation, verdict, corpus or obligation status changed. HQ012 unstarted;
Campaign3 NOT EXIT-READY. Counters 1519/0; 108 verdicts; 132 bounded clauses;
55/58 wrappers; corpus 0.29.0/21. RO019 ACTIVE; RO021 UNSATISFIED; RO022 CLOSED.
''',encoding='utf-8',newline='\n')
rpath=P/'RESEARCH_OBLIGATIONS.json';r=load(rpath);obs=['RO-C3-008','RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
paths=[p.as_posix() for d in ['campaign3-history-carriage-packet-rev1','campaign3-history-source-roles-rev217'] for p in sorted((P/d).glob('*.json'))]+[cp.as_posix()]
for p in paths:
 assert p not in existing
 r['reportReviews'].append(dict(path=p,obligations=obs))
 for o in r['obligations']:
  if o['id'] in obs:o['evidence'].append(p)
rpath.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS: eight measurement carriage packet sources reconciled.
Start CAMPAIGN3_HISTORY_CARRIAGE_PACKET_CHECKPOINT.md.
115 narrative /0 backing; 9595 strings; 87 exact preservation bindings.
Seven canonical/readable pairs, three commitments and exact registry delta checked.
Source REV217: 10879 assigned /494 unassigned; 186970 narrative /211832 backing;
1204 backing resources. Values post-cutoff reviews retain separate denominators.
Prior source-gap inventories remain open; no global deduplication or absence claim.
Next remaining material support, post-cutoff joins and independent adequacy.
Formula provenance and legacy log remain OPEN; HQ012 unstarted.
Campaign3 NOT EXIT-READY. 1519/0; 108 verdicts; 55/58 wrappers; 132 bounded;
corpus 0.29.0/21. RO019 ACTIVE; RO021 UNSATISFIED; RO022 CLOSED.
All jobs terminal; no owner ruling.
'''
cur.write_text(old.decode('utf-8-sig').split('HQ-011 IN PROGRESS:')[0]+route,encoding='utf-8',newline='\n')
a=Path('AGENTS.md');s=a.read_text(encoding='utf-8-sig');needle='**Current routing (2026-10-08):**';pos=s.index(needle)
a.write_text(s[:pos]+needle+'\n'+route+'\n'+s[pos:].replace('**Current routing','**Prior routing',1),encoding='utf-8',newline='\n')
print(json.dumps(dict(reports=len(r['reportReviews']),added=len(paths),exactChronology=True)))
