from pathlib import Path
import json
P=Path('docs/planning')
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(P/'campaign3-history-source-roles-rev250/check.json');assert c['assignedSources']==11084
cp=P/'CAMPAIGN3_HISTORY_LONGITUDINAL_PLANS_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Historical longitudinal planning reconciliation — 2026-10-08

**LOCAL DISPOSITION — no owner ruling.** HQ011 IN PROGRESS; counters **1519 / 0**.

Six sources preserve46 exact original narrative occurrences. The historical goal
checkpoint captured20 trajectories/340 hashes with zero completed restored checks;
the72-trajectory interim review was also incomplete. Later qualification explicitly
completes120 trajectories and2040 immediate-successor restores, not full remaining tails.
Old process identifiers are historical routing, not live processes to poll or restart.
Zero acquired standing, coarse rounding and stochastic action equalities stay separate.

Routine adds actual pre-interruption practice. Its native source episode expiry does
not prove forgetting the receiving habit's own practice. The later habit REV2 supplies
a separate practice episode owner and recency/KeepAll comparison, renewed observed
practice and corrected-belief free probes. All eight restore availability; only four
act in the final probes. Episode loss is local: the full fold journal and audit remain.
Stored/Derived equality does not establish a cache-free or compressed representation.

Personal loss separately acquires valued contact before an admitted loss report changes
belief, appraisal and later choice. Physical availability and independent execution stay
separate, positive relationship history survives, and only explicit withdrawal retires
the goal. This is not clinical grief, death or general autonomous relationship formation.
Its final-coordinate consumer does not establish affect dimensionality necessity.

The four later qualifications supersede old readiness routing only in their stated
bounded component scopes. Reused native source evidence is not fresh native restores;
none admits a joined public scheduler. Prior failed harness/checker cohorts, controlled
cues/goals/meaning, receiver-specific retention equalities and comparison duties remain.

Source REV250:11,084 assigned /289 unassigned;191,570 narrative /212,202 backing;
1,255 indexed backing resources. No new archive/source gap, runtime/test/build rerun,
model, law, allocation, verdict, corpus or obligation status change. Formula provenance,
legacy log, post-cutoff joins and independent adequacy remain open. HQ012 unstarted;
Campaign3 NOT EXIT-READY.1519/0;108 verdicts;132 bounded clauses;55/58 wrappers;
corpus0.29.0/21. RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED.
''',encoding='utf-8',newline='\n')
rpath=P/'RESEARCH_OBLIGATIONS.json';r=load(rpath);obs=['RO-C3-008','RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
paths=[p.as_posix() for d in ['campaign3-history-longitudinal-plans-rev1','campaign3-history-source-roles-rev250'] for p in sorted((P/d).glob('*.json'))]+[cp.as_posix()]
for p in paths:
 assert p not in existing
 r['reportReviews'].append(dict(path=p,obligations=obs))
 for o in r['obligations']:
  if o['id'] in obs:o['evidence'].append(p)
rpath.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS: longitudinal planning and historical checkpoints reconciled.
Start CAMPAIGN3_HISTORY_LONGITUDINAL_PLANS_CHECKPOINT.md.
Six sources;46 original narrative occurrences. Later goal/routine/habit/loss evidence
supersedes old routing in bounded component scope; own practice memory stays distinct.
Source REV250:11084 assigned /289 unassigned;191570 narrative /212202 backing;
1255 backing resources. Values post-cutoff reviews retain separate denominators.
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
