from pathlib import Path
import json
P=Path('docs/planning')
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(P/'campaign3-history-source-roles-rev225/check.json');assert c['assignedSources']==10928
cp=P/'CAMPAIGN3_HISTORY_TASK_RESEARCH_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Task research target historical reconciliation — 2026-10-08

**LOCAL DISPOSITION — no owner ruling.** HQ011 IN PROGRESS; counters **1519 / 0**.

Three research drafts are reconciled, preserving125 original narrative occurrences.
Exact acceptance links connect the lifecycle, packaging, later reason/plan contracts
and appraisal crosswalk without treating proposals as executed qualification.

An adopted procedural instruction says what to try. It is not an efficacy belief,
chosen intent, learned plan, skill or guarantee of success. Availability is not
adoption. Task spelling, desired interval, registry ordering and world-effect magnitude
cannot supply the missing action relation. Later immutable instruction bindings and
candidate deduplication by action with origin union answer the bounded shape proposal;
they do not qualify general planning or learned efficacy. Missing plans may leave
motives without options. Attemptability and execution interference remain distinct.

The live commitment supplies independent base pressure. Known in-range forecasts do
not retire it; unknown forecasts do not manufacture negative motives. Concern remains
a non-generating modifier whose evidence is original forecast support, not a new
independent observation. Adopted context has traced provenance even when its
observational basis is empty. Identity cannot resurrect a retired generating base.

The original exact-all-keys state rule and stored deadline payload are superseded by
optional adoption/absent NoChange and the immutable spec deadline. Half-open target
applicability and whole-stage collision checking replace the tentative priority rule.
The final lifecycle has no semantic retirement output; trace cannot substitute for a
future evidence-production or owned state-reading seam. Relinquishment, cancellation
and social fulfillment are not aliases for the two represented terminal causes.

The initial authored-importance wording is corrected to authored goal facts plus
separate versioned calibration. Goal discrepancy is not fear, controllability, reward
or truth. Transient concern earns no persistent affect field. All nine target
comparisons retain their distinct proof burdens, and the historical four live-list
tests do not establish a generated lifecycle. Workspace versus salience, unknown versus
zero, observation support versus correlation weight, and expression versus identity
remain preserved. Historical phase numbers describe those models, not universal
current routing. Broader deferred phenomena are not waived by this review.

Source REV225: 10,928 assigned /445 unassigned; 188,923 narrative /211,858 backing;
1,219 indexed backing resources. No new source gap/archive, runtime/test/build rerun,
model, law, allocation, verdict, corpus or obligation status change. Prior gaps,
formula provenance, legacy log, post-cutoff joins and independent adequacy remain open.
HQ012 unstarted; Campaign3 NOT EXIT-READY. Counters1519/0;108 verdicts;
132 bounded clauses;55/58 wrappers;corpus0.29.0/21.
RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED. No owner ruling.
''',encoding='utf-8',newline='\n')
rpath=P/'RESEARCH_OBLIGATIONS.json';r=load(rpath);obs=['RO-C3-008','RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
paths=[p.as_posix() for d in ['campaign3-history-task-research-rev1','campaign3-history-source-roles-rev225'] for p in sorted((P/d).glob('*.json'))]+[cp.as_posix()]
for p in paths:
 assert p not in existing
 r['reportReviews'].append(dict(path=p,obligations=obs))
 for o in r['obligations']:
  if o['id'] in obs:o['evidence'].append(p)
rpath.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS: task research targets reconciled.
Start CAMPAIGN3_HISTORY_TASK_RESEARCH_CHECKPOINT.md.
Three sources;125 narrative occurrences; procedural instruction is not efficacy.
Superseded lifecycle/importance proposals preserved; no runtime rerun.
Source REV225:10928 assigned /445 unassigned;188923 narrative /211858 backing;
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
