from pathlib import Path
import json
P=Path('docs/planning')
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(P/'campaign3-history-source-roles-rev194/check.json');assert c['assignedSources']==10459
cp=P/'CAMPAIGN3_HISTORY_CONCERN_SOURCE_DESIGNS_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Concern source design and receipt reconciliation — 2026-10-08

**LOCAL DISPOSITION — no owner ruling.** HQ011 IN PROGRESS; counters **1519 /0**.

Eleven design/decision/checkpoint documents and twelve JSON receipts reconciled:
291 exact original narrative occurrences, one backing occurrence and242 JSON string
leaves, including short strings. Eleven exact source/reference bindings verified.
Nine historical test cohorts and ten recorded fixture substitutions retain their
original scope. No runtime, old writer, mutant or build was executed in this review.

The proposed warmup and the actual frozen-model experiment differ materially. An
in-range measurement fulfills an already-active task, so the later empty workspace
is no selected task, not known-zero concern. An explicit zero displacement entry is
invalid; absence represents baseline. The upper measurement commits prediction10,
but the later full-choice continuation fails and rolls back its entire instant.
Transient concern from that failed instant cannot be exported as committed feedback.
The successor activates its task after warmup and uses an explicitly governed
terminal-at-concern adapter; it does not truncate or rewrite frozen choice models.
The rejected two-task projection and corrected public error-code assertion remain.

The generic scheduler accepts allocated future additional parents and treats
Dependencies as opaque data. That is not a scheduler defect. A receiving adapter
must prove actual completion, exact output, target original, subject and one-use
before content reads. Delivered Unavailable differs from a missing expected parent.
JXP fixtures and their four substitutions establish graph/guard sensitivity, not
public TaskConcern authentication or save qualification. Candidate A remains a
comparator under the later independent encoding/retrieval-arm ruling.

The first scene grammar requires glyph and position, so the old draft's missing-facet
controls were not public models. Maintenance goal A was accepted separately from
its proposed boundary-only assessment. The latter misses5->7 worsening outside[2,4]
and remains a simpler control; the later metric-distance relation preserves endpoint
positions and Assessed/Indeterminate rather than inheriting draft Ambiguous->Unavailable.
Neither state-source acceptance nor distance establishes a universal importance law.

The significance composition's REV4 schedule-pairing shortcut is preserved. REV5
uses grouped experience IDs to find unique admitted retained views and adds a
permutation witness. The three wiring faults target that controlled fixture; they
do not discharge public admission. REV2's baseline is the named position-pair receipt,
not the earlier REV5 report. JSON child codecs, supplied event access/newer use and
local immutable assessment remain declared component premises.

Two old exact test-file identities remain unrecovered: the hashes named by
CONCERN_SIGNIFICANCE_SOURCE_COMPOSITION_REVIEW_REV1/REV2 for
src/test/concernSignificanceSourceComposition.test.ts. The current file,1192 indexed
archives, reachable exact-path Git raw/LF/CRLF candidates and the preserved wrapper
copy do not supply those hashes. This bounded search is not proof of global absence.
The historical reports remain evidence of their recorded results, with exact-body
reproduction unverified. Current changed tests cannot replace them. RO-C3-021 owns
recovery or an explicit adequate claim disposition before HQ012; no closure is claimed.

SourceREV194:10,459 assigned/914 unassigned;132,132 narrative/211,269 backing;
1,192 indexed archives. Open identities now include two composition,two Values,
seven cognitive,80 exit-inventory and one scheduler group. Formula provenance,
legacy log,remaining material support and independent adequacy remain open.
HQ012 unstarted;Campaign3 NOT EXIT-READY. No model/law/allocation/verdict/corpus or
obligation status changed.1519/0;108 verdicts;132 bounded;55/58 wrappers;
corpus0.29.0/21. RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED. No owner ruling.
''',encoding='utf-8',newline='\n')
rpath=P/'RESEARCH_OBLIGATIONS.json';r=load(rpath);obs=['RO-C3-002','RO-C3-003','RO-C3-007','RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
paths=[p.as_posix() for d in ['campaign3-history-concern-source-designs-rev1','campaign3-history-source-roles-rev194'] for p in sorted((P/d).glob('*.json'))]+[cp.as_posix()]
for p in paths:
 assert p not in existing
 r['reportReviews'].append(dict(path=p,obligations=obs))
 for o in r['obligations']:
  if o['id'] in obs:o['evidence'].append(p)
rpath.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS:23 concern-source designs/receipts reconciled.
Start CAMPAIGN3_HISTORY_CONCERN_SOURCE_DESIGNS_CHECKPOINT.md.
291 narrative/one backing occurrence;242 strings;11 exact bindings;9 test cohorts/10 faults.
No-task/known-zero,failed-instant nonexport and schedule-pairing correction preserved.
SourceREV194:10459 assigned/914 unassigned;132132 narrative/211269 backing;
1192 archives. Values post-cutoff reviews retain separate denominators.
Open identities:two composition,two Values,seven cognitive,80 exit-inventory,one scheduler.
Next remaining material support,post-cutoff delta joins and independent adequacy.
Formula provenance and legacy log remain OPEN;HQ012 unstarted.
Campaign3 NOT EXIT-READY.1519/0;108 verdicts;55/58 wrappers;132 bounded;
corpus0.29.0/21. RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED.
All jobs terminal;no owner ruling.
'''
cur.write_text(old.decode('utf-8-sig').split('HQ-011 IN PROGRESS:')[0]+route,encoding='utf-8',newline='\n')
a=Path('AGENTS.md');s=a.read_text(encoding='utf-8-sig');needle='**Current routing (2026-10-08):**';pos=s.index(needle)
a.write_text(s[:pos]+needle+'\n'+route+'\n'+s[pos:].replace('**Current routing','**Prior routing',1),encoding='utf-8',newline='\n')
print(json.dumps(dict(reports=len(r['reportReviews']),added=len(paths),exactChronology=True)))
