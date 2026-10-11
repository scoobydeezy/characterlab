from pathlib import Path
import json
P=Path('docs/planning')
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(P/'campaign3-history-source-roles-rev223/check.json');assert c['assignedSources']==10918
cp=P/'CAMPAIGN3_HISTORY_TASK_LIFECYCLE_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Task lifecycle historical reconciliation — 2026-10-08

**LOCAL DISPOSITION — no owner ruling.** HQ011 IN PROGRESS; counters **1519 / 0**.

Five sources are reconciled: four internal task reviews and the explicit identity
activation exploration. All 79 original narrative and two backing occurrences are
preserved. The exploration includes all 49 string leaves and five exact current
reference-source bindings. Internal adversarial review is not external review.

Authored task availability remains distinct from adoption. S0 admits any declared-key
subset with present tasks Open; absence is not zero or implicit adoption. Runtime
cannot insert or remove keys. Deadlines are allocated for every declared key regardless
of adoption, preserving coupling without introducing character knowledge or motives.
Immutable target resolution precedes the whole-stage collision seal and B0 prior reads.
Same-instant observation-time validation remains required even with lawful producers.
Terminal support/status/time are immutable; recurrence requires a new instance.
Actual admitted M1 can satisfy a task; forecasting cannot.

Component collision tests and public closed-profile exclusion are separate witnesses.
Externally selected live lists do not qualify a generated motive/workspace producer or
an intact cognitive cycle. Historical 974-test pre-hardening, 24 focused, nine
preservation, 64 control combinations, 17 declaration/68 model-state and 328 reference
counts retain separate scopes. The inherited intentional-mutant shell failure and
corrected exit-zero receipt remain distinct, as do config-loader failure and explicit
reference API success. Changed runtime sources require their own proof identities.

The CONTENT field13 correction explicitly delegates ValidationInvariants to one spec.
Exact workspace parent association is stronger than nested well-formedness or trace
identity lookup. Quiescent saves do not permit mid-instant restoration. TaskConcern is
not automatically a calibrated dice modifier or consolidated RecentExperience.

Independent Fraction arithmetic checks all five two-option exploration cohorts.
Base1/11 and situation3/13 activate A above threshold3/10 before standing. The first
raw-standing1/4 choice consolidates to1/5 and leaves B below threshold; that failed
assumption remains preserved. Corrected raw1/3 consolidates to1/4, activating both.
Retired motives yield no nucleus; symmetric inputs remain symmetric. All quantized
modifiers remain zero, demonstrating eligibility changes without a modifier change.
This is explicit component arithmetic, not generated cognition, RNG/arbitration,
identity learning, efficacy or a selected production calibration.

Source REV223: 10,918 assigned /455 unassigned; 188,622 narrative /211,858 backing;
1,219 indexed backing resources. No new source gap/archive, runtime/test/build rerun,
model, law, allocation, verdict, corpus or obligation status change. Prior gaps,
formula provenance, legacy log, post-cutoff joins and independent adequacy remain open.
HQ012 unstarted; Campaign3 NOT EXIT-READY. Counters1519/0;108 verdicts;
132 bounded clauses;55/58 wrappers;corpus0.29.0/21.
RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED. No owner ruling.
''',encoding='utf-8',newline='\n')
rpath=P/'RESEARCH_OBLIGATIONS.json';r=load(rpath);obs=['RO-C3-008','RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
paths=[p.as_posix() for d in ['campaign3-history-task-lifecycle-rev1','campaign3-history-source-roles-rev223'] for p in sorted((P/d).glob('*.json'))]+[cp.as_posix()]
for p in paths:
 assert p not in existing
 r['reportReviews'].append(dict(path=p,obligations=obs))
 for o in r['obligations']:
  if o['id'] in obs:o['evidence'].append(p)
rpath.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS: task lifecycle and activation history reconciled.
Start CAMPAIGN3_HISTORY_TASK_LIFECYCLE_CHECKPOINT.md.
Five sources;79 narrative/two backing occurrences;five exact arithmetic cohorts.
Adoption, deadlines and internal-review limits preserved; no runtime rerun.
Source REV223:10918 assigned /455 unassigned;188622 narrative /211858 backing;
1219 backing resources. Values post-cutoff reviews retain separate denominators.
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
