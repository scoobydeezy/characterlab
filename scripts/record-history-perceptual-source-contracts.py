from pathlib import Path
import json
P=Path('docs/planning')
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(P/'campaign3-history-source-roles-rev193/check.json');assert c['assignedSources']==10436
cp=P/'CAMPAIGN3_HISTORY_PERCEPTUAL_SOURCE_CONTRACTS_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Perceptual source and context contract reconciliation — 2026-10-08

**LOCAL DISPOSITION — no owner ruling.** HQ011 IN PROGRESS; counters **1519 /0**.

Seventeen perceptual source, tracking-window, transaction and context contracts
reconciled with101 exact original narrative occurrences. No fresh runtime, test,
model, law, allocation, verdict or corpus change is claimed.

Actual observed absence breaks continuity. An unsampled channel cannot be represented
as an unavailable observation to close its context. Missing stages cannot be recovered
from a later matching glyph, private source schedule, source ordinal or array order.
Glyph matching remains fallible observer-relative tracking. Explicit neutral panel
labels establish observed context, not stroke/control roles or causality; general
segmentation remains a separate comparator.

The historical replay manager and retained-window successor keep distinct guards.
Replaying the old prefix preserves all old source ordinals and construction limits.
The retained-window operator holds only the actual SEM owner and last window, leaving
whole-run replay protection to the compiler/runtime. Local state reconstruction is
not public save admission. Typed observation/detection numbers can coincide without
aliasing. Eight-, nine- and ten-sweep constructors retain their own bounds; empty
sweeps still count. The ten-sweep successor permits thirty continuant files, not an
unbounded caller-selected budget.

Local prepare/preview/commit/abort capabilities protect their own detached candidates.
Whole-instant allocator, output, other-root and queue rollback remain runtime duties.
The historical panel transaction explicitly corrected a returned-context object alias:
caller mutation of an event identity must not alter the retained owner window. That
correction preserves canonical values and the tracking law; it is not silently erased
by the later transaction description.

Panel/body composition reserves one experience only when actual evidence is present.
Panel-only evidence can coexist with an empty body selector; current body cue access
can survive zero selection capacity. Visual composition must await actual tracking
and binding. Scene truth stays trace-side; safe ordering uses observed tuples and
preserves indistinguishable duplicate candidates. Positions and glyphs cannot stand
in for true identities or infer semantic roles. Perceived trial grouping requires
exact context membership and complete, unambiguous roles without hidden repair.

SourceREV193:10,436 assigned/937 unassigned;131,841 narrative/211,268 backing;
1,192 indexed archives. Values post-cutoff reviews retain separate denominators.
Two Values/seven cognitive/80 exit-inventory/one scheduler identities,formula provenance,
legacy log,remaining material support and independent adequacy remain open. HQ012
unstarted;Campaign3 NOT EXIT-READY.1519/0;108 verdicts;132 bounded;55/58 wrappers;
corpus0.29.0/21. RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED. No owner ruling.
''',encoding='utf-8',newline='\n')
rpath=P/'RESEARCH_OBLIGATIONS.json';r=load(rpath);obs=['RO-C3-007','RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
paths=[p.as_posix() for d in ['campaign3-history-perceptual-source-contracts-rev1','campaign3-history-source-roles-rev193'] for p in sorted((P/d).glob('*.json'))]+[cp.as_posix()]
for p in paths:
 assert p not in existing
 r['reportReviews'].append(dict(path=p,obligations=obs))
 for o in r['obligations']:
  if o['id'] in obs:o['evidence'].append(p)
rpath.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS:seventeen perceptual source/context contracts reconciled.
Start CAMPAIGN3_HISTORY_PERCEPTUAL_SOURCE_CONTRACTS_CHECKPOINT.md.
101 original narrative occurrences;absence/unsampled and missing-stage limits retained.
History/window controls and local/public transaction scope distinct;object-alias fix preserved.
SourceREV193:10436 assigned/937 unassigned;131841 narrative/211268 backing;
1192 archives. Values post-cutoff reviews retain separate denominators.
Open identities:two Values,seven cognitive,80 exit-inventory,one scheduler.
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
