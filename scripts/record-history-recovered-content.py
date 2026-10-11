"""Record recovered content disposition and completed temporary-object search."""
from pathlib import Path
import json
P=Path('docs/planning');dirs=[P/'campaign3-history-recovered-content-rev1',P/'campaign3-history-source-roles-rev315',P/'campaign3-history-temporary-object-recovery-rev1']
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
assert load(dirs[0]/'check.json')['comparisonSegments']==62
assert load(dirs[1]/'check.json')['outsideBackingResources']==2825
assert load(dirs[2]/'check.json')['recoveredPairs']==0
cp=P/'CAMPAIGN3_HISTORY_RECOVERED_CONTENT_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Recovered content dispositions — 2026-10-11

**LOCAL DISPOSITION — HQ-011 continues; no owner ruling. Counters1519 /0.**

All21 recovered identities now have explicit roles. Ten Markdown variants are
compared in full against frozen reviewed roots through62 exact line-comparison
segments. No recovered lines are omitted. Changed text records dated routing and
status: original unexecuted proposals, later partial intake, and intermediate
REV1/3/4/5/6/8 progress toward bounded qualifications. Unchanged requirement text
retains the prior content review; dates and later notices are not projected backward.
The old CURRENT remains an index with explicit hierarchy and limits, not acceptance
of every citation. No recovered-only scientific finding requires a new law or RO.
The corpus promotion's ten-of-eleven summary remains explicitly corrected to eleven,
three partial/eight blocked; recovered older proposal text does not undo promotion.

Eleven TypeScript bodies are exact backing for their bound historical receipt
commitments. Raw SHA256 and Git blob SHA1 verify all21 copies.34 original gap
occurrences retain exact report/pointer links. Recovery does not authenticate old
execution or close other missing source versions in the same manifest. No old
writer, behavioral suite or build was rerun.

REV315 preserves every REV314 census assignment and preceding backing resource;
only the21 newly reviewed recovered copies are added, for2,825 outside-census
resources.11,373 assigned sources /0 unassigned and413,894 original occurrences
are unchanged. Hash equality alone did not assign the narrative roles.

Read-only inspection of all28 reported temporary Git objects found four admissible
blob bodies below50MB and no additional target hash. Other objects were excluded
under the recorded kind/stream/size guards. No temporary file or Git state was
changed. This closes that declared local search branch, not global source recovery.
208 path/hash targets remain;73 are the unrecovered exit-inventory versions.

Next: conclude claim-specific consequences for remaining source and no-hash gaps,
and independently review universe/scientific adequacy before HQ-012. Historical
ledger completeness cannot be inferred from role counts or later passing tests.
RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED.108 verdicts;132 bounded clauses;
55/58 wrappers;corpus0.29.0/21. Campaign3 NOT EXIT-READY.
Both content and temporary-object checkers PASS; bookkeeping checks follow.
''',encoding='utf-8',newline='\n')
rp=P/'RESEARCH_OBLIGATIONS.json';reg=load(rp);obs=['RO-C3-019','RO-C3-020','RO-C3-021']
existing={x['path'] for x in reg['reportReviews']}
paths=[p.as_posix() for d in dirs for p in sorted(d.glob('*.json'))]+[cp.as_posix()]
for path in paths:
    assert path not in existing
    reg['reportReviews'].append(dict(path=path,obligations=obs))
    for ob in reg['obligations']:
        if ob['id'] in obs:ob['evidence'].append(path)
rp.write_text(json.dumps(reg,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS: recovered narrative/source roles joined.
Start CAMPAIGN3_HISTORY_RECOVERED_CONTENT_CHECKPOINT.md.
Ten narrative variants /62 complete comparisons;11 exact source bodies;34 original
gap occurrences preserved. REV315 adds21 backing copies:2825 total; prior roles unchanged.
11373 assigned sources /0 unassigned;413894 original occurrences.
28 temporary Git objects inspected;4 eligible blobs;0 further recoveries.
208 source targets unresolved, including73 exit-inventory versions; no global absence claim.
Next remaining source/no-hash claim consequences and independent scientific adequacy.
HQ-012 unstarted. Campaign3 NOT EXIT-READY. No runtime suite or build rerun.
Counters1519 /0;108 verdicts;55 /58 wrappers;132 bounded clauses;corpus0.29.0 /21.
RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED. No owner ruling.
'''
cur.write_text(old.decode('utf-8-sig').split('HQ-011 IN PROGRESS:')[0]+route,encoding='utf-8',newline='\n')
a=Path('AGENTS.md');s=a.read_text(encoding='utf-8-sig');needle='**Current routing (2026-10-11):**';pos=s.index(needle)
a.write_text(s[:pos]+needle+'\n'+route+'\n'+s[pos:].replace('**Current routing','**Prior routing',1),encoding='utf-8',newline='\n')
print(json.dumps(dict(reports=len(reg['reportReviews']),added=len(paths))))
