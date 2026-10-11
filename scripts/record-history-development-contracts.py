from pathlib import Path
import json
P=Path('docs/planning')
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(P/'campaign3-history-source-roles-rev262/check.json');assert c['assignedSources']==11162
cp=P/'CAMPAIGN3_HISTORY_DEVELOPMENT_CONTRACTS_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Preserved development contracts — 2026-10-08

**LOCAL DISPOSITION — no owner ruling.** HQ-011 remains in progress; counters **1519 / 0**.

Six preserved development contracts account for 54 original narrative occurrences.
Their failed assumptions and successor corrections remain explicit:

- Absence deficit initially borrowed reference80 from a different BODY control.
  The unchanged source actually declares50; the successor corrects the fixture,
  independently maintaining reference, current physical level and exogenous support.
- Craving's equal safe frames legitimately alias run identities. Sixty comparisons
  represent56 distinct runs; case labels must not manufacture observer differences.
- Substitution first assumed every resolution chose an action, then exceeded the
  inherited two-option domain with A/B/idle. The accepted successor respects lawful
  no-choice and narrows its scope without erasing the separate neutral HABIT policy.
- Longitudinal goal composition's coarse unit quantizes the acquired standing effect
  to zero. The fine candidate is a calibration comparison; coarse equality survives.
- Routine composition corrects text IDs to the unsigned occurrence/root grammar.
  Its separate resumption finding distinguishes availability from enactment: seed0
  skips14 and resumes15. It does not prove forgetting of its own practice episodes.

These contracts are historical evidence, not current instructions or independent
behavioral qualifications. Component composition around a native source does not
supply native authority to receiving owners. Derived/Stored equality retains raw
history and cache in this domain; no general memory reduction follows. Clinical
addiction, natural cue learning, goal fulfillment and lifelong equivalence remain
outside these bounded results. All failed cohorts remain preserved.

Source REV262: 11,162 assigned / 211 unassigned; 193,099 narrative / 212,202 backing;
1,293 indexed backing resources. No new archive, runtime test, model, law, allocation,
verdict, corpus or obligation-status change. Remaining source gaps, post-cutoff joins
and independent adequacy stay open. HQ-012 is unstarted; Campaign3 NOT EXIT-READY.
Counters1519 / 0;108 verdicts;132 bounded clauses;55 / 58 public wrappers;
corpus0.29.0 / 21. RO019 ACTIVE; RO021 UNSATISFIED; RO022 CLOSED.
''',encoding='utf-8',newline='\n')
rpath=P/'RESEARCH_OBLIGATIONS.json';r=load(rpath);obs=['RO-C3-008','RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
paths=[p.as_posix() for d in ['campaign3-history-development-contracts-rev1','campaign3-history-source-roles-rev262'] for p in sorted((P/d).glob('*.json'))]+[cp.as_posix()]
for p in paths:
 assert p not in existing
 r['reportReviews'].append(dict(path=p,obligations=obs))
 for o in r['obligations']:
  if o['id'] in obs:o['evidence'].append(p)
rpath.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS: six development contract histories reconciled.
Start CAMPAIGN3_HISTORY_DEVELOPMENT_CONTRACTS_CHECKPOINT.md.
54 original narrative occurrences preserve wrong-reference, run-identity alias,
no-choice, option-domain, calibration and typed-occurrence failures separately.
Source REV262: 11162 assigned / 211 unassigned; 193099 narrative / 212202 backing;
1293 backing resources. Successor scope does not erase failed candidates.
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
