from pathlib import Path
import json
P=Path('docs/planning')
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(P/'campaign3-history-source-roles-rev264/check.json');assert c['assignedSources']==11171
cp=P/'CAMPAIGN3_HISTORY_COVERAGE_STEERING_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Historical coverage and steering reviews — 2026-10-08

**LOCAL DISPOSITION — no owner ruling.** HQ-011 remains in progress; counters **1519 / 0**.

Five sources preserve 235 original narrative occurrences. The external pre-entry
review's coverage criticism remains useful, but its four-family, record-count,
loop-census and unimplemented-REG claims were corrected internally and explicitly
withdrawn by its later author. External opinions are not accepted contracts or
behavioral verdicts. PHEN-BIO's committed biography identity remains unchanged.

The original identity ablation falsified the expectation that zero integer standing
modifiers meant no influence: standing rescued a weak nonzero base through relevance.
Seed0's unchanged action remains alongside other seeds' divergence. This is not an
extra identity die, motivation from zero or proof of complete biography coverage.
Mutation sensitivity remains distinct from a serious psychological alternative.

The midpoint recommendations led to the owner-directed correction order, corpus
promotion, arithmetic comparisons, explicit verdicts, allocation counters and replaced
CURRENT index. Concern feedback was ratified as transient character-state influence,
not general Affect; encoding suppression and retrieval amplification remain separate
and CandidateA is not a final law. Review praise is not calibration or scale evidence.

The partial-coverage queues are historical. Later bounded clause closure supersedes
their routing while preserving required comparisons, native admission limits and
failed cohorts. A count of zero partial clauses cannot discharge the independent
historical gate or whole-corpus obligations. The inspection UI remains owner-deferred
until between phases3/4 unless required for testing or validation.

Source REV264: 11,171 assigned / 202 unassigned; 193,763 narrative / 212,202 backing;
1,293 indexed backing resources. No runtime tests, model, law, allocation, verdict,
corpus or obligation status changed. Source gaps, post-cutoff joins and independent
adequacy remain open. HQ-012 unstarted; Campaign3 NOT EXIT-READY. Counters1519 / 0;
108 verdicts;132 bounded clauses;55 / 58 wrappers;corpus0.29.0 / 21.
RO019 ACTIVE; RO021 UNSATISFIED; RO022 CLOSED.
''',encoding='utf-8',newline='\n')
rpath=P/'RESEARCH_OBLIGATIONS.json';r=load(rpath);obs=['RO-C3-008','RO-C3-010','RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
paths=[p.as_posix() for d in ['campaign3-history-coverage-steering-rev1','campaign3-history-source-roles-rev264'] for p in sorted((P/d).glob('*.json'))]+[cp.as_posix()]
for p in paths:
 assert p not in existing
 r['reportReviews'].append(dict(path=p,obligations=obs))
 for o in r['obligations']:
  if o['id'] in obs:o['evidence'].append(p)
rpath.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS: campaign coverage and steering histories reconciled.
Start CAMPAIGN3_HISTORY_COVERAGE_STEERING_CHECKPOINT.md.
Five sources preserve 235 original narrative occurrences. Reviewer corrections,
weak-motive rescue, feedback ratification and historical partial queues stay distinct.
Source REV264: 11171 assigned / 202 unassigned; 193763 narrative / 212202 backing;
1293 backing resources. Bounded clause coverage does not discharge whole-corpus gates.
Next: remaining material support, post-cutoff joins and independent adequacy.
Prior source gaps, formula provenance and legacy log remain OPEN; HQ-012 unstarted.
Campaign3 NOT EXIT-READY. Counters1519 / 0;108 verdicts;55 / 58 wrappers;
132 bounded clauses;corpus0.29.0 / 21. RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED.
All jobs terminal; no owner ruling.
'''
cur.write_text(old.decode('utf-8-sig').split('HQ-011 IN PROGRESS:')[0]+route,encoding='utf-8',newline='\n')
a=Path('AGENTS.md');s=a.read_text(encoding='utf-8-sig');needle='**Current routing (2026-10-08):**';pos=s.index(needle)
a.write_text(s[:pos]+needle+'\n'+route+'\n'+s[pos:].replace('**Current routing','**Prior routing',1),encoding='utf-8',newline='\n')
print(json.dumps(dict(reports=len(r['reportReviews']),added=len(paths),exactChronology=True)))
