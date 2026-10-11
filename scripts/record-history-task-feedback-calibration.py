from pathlib import Path
import json
P=Path('docs/planning')
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(P/'campaign3-history-source-roles-rev281/check.json');assert c['assignedSources']==11261
cp=P/'CAMPAIGN3_HISTORY_TASK_FEEDBACK_CALIBRATION_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Historical task feedback calibration — 2026-10-08

**LOCAL DISPOSITION — calibration lineage reconciled; no owner ruling.**
HQ-011 remains in progress. Counters **1519 / 0**. Original receipts unchanged.

The two earned-feedback revisions retain the same 32 three-choice histories and
quantized identity evidence. Independent rational checks verify 192 evidence steps,
64 final strengths/contact-derived means and both copies of the older alignment-
scaled pulls. REV1 changes resolution mode in 23/32 seeds; its nine equalities
remain evidence. REV2 changes mode in 32/32 using Phase2.97 direct standing strength
for both task options, retaining the older option-alignment projection as comparison.
This is a mapping distinction, not a stronger learning result or universal benefit.
No stochastic choice or historical writer was freshly rerun.

The choices and updates came from reference components with proposed semantic
operands. Later means were hypothesized from contacts, not executed physical effects
or current prediction evidence. Research-only source strings do not authenticate
canonical evidence. REV2 exposed the existing standing builder in memory; it did
not edit reference files. Public cognitive qualification is separately committed
and cannot retroactively upgrade these exploratory receipts.

The generated-operand receipt does use actual prediction history: ten authored
exposures, observations 0 and 1, retained means 0 and 1/2. Its rejected thirty-
exposure construction exceeded frozen bounds; the repair did not widen them.
Concern remains proposed, standing 1/3 is an intervention rather than earned
identity, and the task deadline predates completion of that history. Active nuclei
change 2 to 1 and return to 2 under standing; equal semantic meanings retain zero
alignment. These are not an intact live-task or generated-action witness.

Three sources preserve 23 original narrative occurrences and all 1,655 string
leaves. All 19 fingerprint occurrences / 12 distinct pairs match exact bytes;
ten existing source files are newly indexed. No new source gap.
Source REV281: 11,261 assigned / 112 unassigned; 194,270 narrative / 212,205 backing;
1,477 backing resources. Material limits remain referenced under RO-C3-009 and the
historical audit obligations. No model, law, allocation, verdict, corpus or
obligation status changed. Earlier gaps, post-cutoff joins and independent adequacy
remain open. HQ-012 unstarted; Campaign3 NOT EXIT-READY.
108 verdicts; 132 bounded clauses; 55 / 58 wrappers; corpus 0.29.0 / 21.
RO019 ACTIVE; RO021 UNSATISFIED; RO022 CLOSED.
''',encoding='utf-8',newline='\n')
rpath=P/'RESEARCH_OBLIGATIONS.json';r=load(rpath);obs=['RO-C3-009','RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
paths=[p.as_posix() for d in ['campaign3-history-task-feedback-calibration-rev1','campaign3-history-source-roles-rev281'] for p in sorted((P/d).glob('*.json'))]+[cp.as_posix()]
for p in paths:
 assert p not in existing
 r['reportReviews'].append(dict(path=p,obligations=obs))
 for o in r['obligations']:
  if o['id'] in obs:o['evidence'].append(p)
rpath.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS: task feedback calibration lineage reconciled.
Start CAMPAIGN3_HISTORY_TASK_FEEDBACK_CALIBRATION_CHECKPOINT.md.
Three receipts;192 evidence steps;32 retained histories;19 exact source bindings.
Alignment-scaled23 versus direct-standing32 mode shifts; outcomes hypothetical.
Source REV281:11261 assigned /112 unassigned;194270 narrative /212205 backing;
1477 backing resources. No public qualification inferred from calibration.
Next: remaining material support, source recovery, post-cutoff joins and independent adequacy.
Prior source gaps, formula provenance and legacy log remain OPEN; HQ-012 unstarted.
Campaign3 NOT EXIT-READY. Counters1519 /0;108 verdicts;55 /58 wrappers;
132 bounded clauses;corpus0.29.0 /21. RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED.
All jobs terminal;no owner ruling.
'''
cur.write_text(old.decode('utf-8-sig').split('HQ-011 IN PROGRESS:')[0]+route,encoding='utf-8',newline='\n')
a=Path('AGENTS.md');s=a.read_text(encoding='utf-8-sig');needle='**Current routing (2026-10-08):**';pos=s.index(needle)
a.write_text(s[:pos]+needle+'\n'+route+'\n'+s[pos:].replace('**Current routing','**Prior routing',1),encoding='utf-8',newline='\n')
print(json.dumps(dict(reports=len(r['reportReviews']),added=len(paths),exactChronology=True)))
