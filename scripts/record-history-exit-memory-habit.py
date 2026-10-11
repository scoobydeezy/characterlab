from pathlib import Path
import json
P=Path('docs/planning');O=P/'campaign3-history-exit-memory-habit-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
assert load(O/'check.json')['occurrencesCount']==2553
cp=P/'CAMPAIGN3_HISTORY_EXIT_MEMORY_HABIT_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Historical memory and habit reconciliation — 2026-10-08

**LOCAL DISPOSITION.** HQ-011 remains open; no owner ruling. Counters **1519 / 0**.

Reviewed25 rationale texts across2,553 occurrences for Brief12.3 and12.9: two family
summaries and21 clauses over111 snapshots. Twenty-four texts/2,536 occurrences are
newly reconciled; the affect-retrieval text and its17 memory-clause occurrences were
already accepted in the preceding scoped rationale review and are explicitly reused,
not counted twice. Exact source hashes, pointers and transition history remain.

Memory coverage advances from GA access and finite SEM recognition through tagged
routine reconstruction, feature familiarity, defining-memory bridge, meaning/use and
native defining admission. Removing detail is not reconstruction; similarity is not
instance identity. Retained detail precedes conflicting category majority, and each
known observation credits category once. ReencodeGuess is a provenance comparator,
not a duplicate-credit ablation. Defining retention does not imply rank selection;
actual rehearsal, historical credit and current judgment remain separate. Native
1680-prefix coverage has one successor per prefix, not full tails. Carried cue, empty
graph, scheduled baseline and diagnostic worldAfter remain controls.

The older vividness/affect-bias gap statements are superseded only by REV94/95's
component witnesses. False recollection can be vivid; vividness is not correctness,
importance or subjective phenomenology. Actual prior affect changes published recall
at fixed memory/encoding/cue; native admission and general salience/encoding remain
outside that component result. No general consolidation or reconstruction law chosen.

Habit coverage distinguishes actual acquisition after practice, persistence after
reward correction, inhibition preserving history, concentrated reliance and substitute
use, learned outcome feedback, tolerance, physical absence deficit, represented urge,
load-triggered return and costly pursuit. ADAPT state alone does not qualify addiction.
ExpectationOnly explains primary substitution; zero-correction history effects concern
candidate availability, not isolated habit necessity. Craving is not action; absence
deficit is not subjective distress. All declared seeds and equal trajectories remain.
Higher harm belief is not pathwise harm-reducing; instructed withholding is not learned
abstinence or physiological recovery. Later biology adds its own connected functional
evidence without rewriting earlier component/public distinctions or qualifying a
universal addiction law. Legacy identity-wrapper and prior audit reconstruction limits
remain attached to their original evidence.

Three cited support sources remain unassigned: Campaign2 completion review and the
memory partial-coverage audit/check. Existing scoped evidence hashes verify, but this
batch does not close those whole-source obligations. Original111 snapshots remain
unchanged.134 of181 queue texts are reconciled;47 remain, plus schema prose, inherited
support and independent adequacy. No complete audit source is promoted.

SourceREV171 remains10,107 assigned/1,266 unassigned;22,514 narrative/184,919 backing;
920 outside-census artifacts. No new runtime simulation, test, build, law, verdict or
corpus freshness claim. Research bookkeeping is checked separately. Formula historical
identity, missing legacy log, Values90/15 and exclusions remain open. HQ012 unstarted;
Campaign3 NOT EXIT-READY.108 verdicts;132 bounded clauses;55/58 wrappers;corpus0.29.0/21;
1519/0. RO019 ACTIVE;RO021 mandatory and UNSATISFIED;RO022 CLOSED.
''',encoding='utf-8',newline='\n')
rpath=P/'RESEARCH_OBLIGATIONS.json';r=load(rpath);obs=['RO-C3-010','RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
paths=[x.as_posix() for x in sorted(O.glob('*.json'))]+[cp.as_posix()]
for p in paths:
 assert p not in existing
 r['reportReviews'].append(dict(path=p,obligations=obs))
 for o in r['obligations']:
  if o['id'] in obs:o['evidence'].append(p)
rpath.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS:memory/habit rationale chains reconciled.
Start CAMPAIGN3_HISTORY_EXIT_MEMORY_HABIT_CHECKPOINT.md.
25 texts/2553 occurrences;24 new texts/2536 new occurrences;17 explicit reused pointers.
Acquisition/access/reconstruction and adaptation/urge/action distinctions preserved.
Three inherited supports still unassigned;no new whole-source promotion.
134/181 queue texts reviewed;47 remain plus other schema/inherited support.
SourceREV171 unchanged:10107 assigned/1266 unassigned;22514 narrative/184919 backing;
920 artifacts. Formula historical identity,legacy log,Values90/15 and exclusions OPEN.
Independent adequacy/HQ012 unstarted. Campaign3 NOT EXIT-READY.
1519/0;108 verdicts;55/58 wrappers;132 bounded;corpus0.29.0/21.
RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED. All jobs terminal;no owner ruling.
'''
cur.write_text(old.decode('utf-8-sig').split('HQ-011 IN PROGRESS:')[0]+route,encoding='utf-8',newline='\n')
a=Path('AGENTS.md');s=a.read_text(encoding='utf-8-sig');needle='**Current routing (2026-10-08):**';pos=s.index(needle)
a.write_text(s[:pos]+needle+'\n'+route+'\n'+s[pos:].replace('**Current routing','**Prior routing',1),encoding='utf-8',newline='\n')
print(json.dumps(dict(reports=len(r['reportReviews']),added=len(paths),exactChronology=True)))
