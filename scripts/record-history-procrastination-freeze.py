from pathlib import Path
import json
P=Path('docs/planning')
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(P/'campaign3-history-source-roles-rev291/check.json');assert c['assignedSources']==11312
cp=P/'CAMPAIGN3_HISTORY_PROCRASTINATION_FREEZE_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Superseded procrastination freeze — 2026-10-08

**LOCAL DISPOSITION — omitted boundary preserved, not retroactively qualified.**
HQ-011 in progress; no owner ruling. Counters **1519 / 0**.

Four sources preserve the0.1 freeze, preservation manifest and archived contract/
allocation. Four candidate model identities match their exact stored identity hex;
all29 binding occurrences resolve. Eleven original contract/allocation/source/test/
harness artifacts remain intact. The allocation differs from current0.2 only in
version, with records1353..1376/schema1 and reused namespace1155 unchanged.

The first25 tests/build passed without checking late adoption. Static review found
adoption at/after deadline6 could bypass the ordinary deadline branch and leave an
active goal without a valid work window. The targeted receipt records one failed
rejection test and eight skipped tests. No public qualification used the0.1 cohort.
Corrected0.2 admits adoption only1..5 and rejects6/7/8 before execution. Later public
qualification uses distinct model/run identities and remains separately scoped.
No historical runtime or test writer was rerun for this reconciliation.

Preserve the phenomenon boundary: actual defer with retained active desire,
maintained access, current feasibility and a positive work ground. Missing access,
inability and cancellation are separate controls. The independent immediate motive,
fallible future evidence, next40 learning lag, observed progress versus intent or
physical truth, and terminal lifecycle distinctions survive the correction.
One expected later opening does not guarantee capacity for three required units.
Fixed1/4 valuation is neither an optimal schedule nor calibrated temporal discount;
NoTemporalBias, PresentFocused and NoImmediateMotive remain comparators. Diagnostic
history leaves do not supply a habit explanation. The superseded contract retains
these limits and its exact failed admission domain.

15 original narrative/one backing occurrences retain identities;277 string leaves
(including the archived Markdown text) are inspected.25 existing backing resources
newly indexed. No new source gap in this batch; prior gaps remain explicit.
REV291:11,312 assigned /61 unassigned;196,182 narrative /212,373 backing;
2,516 backing resources. No model, law, allocation, verdict, corpus or obligation
status changes. Remaining source support, dependent claims, post-cutoff joins and
independent adequacy are open. HQ-012 unstarted; Campaign3 NOT EXIT-READY.
108 verdicts;132 bounded clauses;55 /58 wrappers;corpus0.29.0 /21.
RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED.
''',encoding='utf-8',newline='\n')
rpath=P/'RESEARCH_OBLIGATIONS.json';r=load(rpath);obs=['RO-C3-012','RO-C3-014','RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
paths=[p.as_posix() for d in ['campaign3-history-procrastination-freeze-rev1','campaign3-history-source-roles-rev291'] for p in sorted((P/d).glob('*.json'))]+[cp.as_posix()]
for p in paths:
 assert p not in existing
 r['reportReviews'].append(dict(path=p,obligations=obs))
 for o in r['obligations']:
  if o['id'] in obs:o['evidence'].append(p)
rpath.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS: four superseded procrastination sources reconciled.
Start CAMPAIGN3_HISTORY_PROCRASTINATION_FREEZE_CHECKPOINT.md.
Four model identities/29 exact bindings; original late-adoption failure preserved.
First25 tests missed boundary; corrected0.2 qualification separately scoped.
Source REV291:11312 assigned /61 unassigned;196182 narrative /212373 backing;
2516 backing resources. No new source gap or runtime replay.
Next: remaining material support, dependent-claim dispositions, post-cutoff joins and independent adequacy.
Include earlier gaps in final consolidation. HQ-012 unstarted.
Campaign3 NOT EXIT-READY. Counters1519 /0;108 verdicts;55 /58 wrappers;
132 bounded clauses;corpus0.29.0 /21. RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED.
All jobs terminal;no owner ruling.
'''
cur.write_text(old.decode('utf-8-sig').split('HQ-011 IN PROGRESS:')[0]+route,encoding='utf-8',newline='\n')
a=Path('AGENTS.md');s=a.read_text(encoding='utf-8-sig');needle='**Current routing (2026-10-08):**';pos=s.index(needle)
a.write_text(s[:pos]+needle+'\n'+route+'\n'+s[pos:].replace('**Current routing','**Prior routing',1),encoding='utf-8',newline='\n')
print(json.dumps(dict(reports=len(r['reportReviews']),added=len(paths),exactChronology=True)))
