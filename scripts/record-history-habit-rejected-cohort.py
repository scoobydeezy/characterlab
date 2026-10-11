from pathlib import Path
import json
P=Path('docs/planning')
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(P/'campaign3-history-source-roles-rev301/check.json');assert c['assignedSources']==11341
cp=P/'CAMPAIGN3_HISTORY_HABIT_REJECTED_COHORT_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Rejected longitudinal habit cohort — 2026-10-08

**LOCAL DISPOSITION — interrupted cohort preserved separately from later qualification.**
HQ-011 in progress; no owner ruling. Counters **1519 / 0**.

The original plan declares10 models/960 factorial runs across five laws, two episode
retention settings, three relearning conditions, cue/visibility controls and eight
seeds. Its16,320 receiver prefixes,136 reused native prefixes and four fresh joined
runs/eight restores are requirements, not completion evidence. The receiver checker
expected ROUTINE_INJECTED where the correct failure was LH_INJECTED and stopped
before its first receiver receipt. Production semantics did not require correction.

One complete old joined seed0 receipt survives:17 prefix comparisons and two restores
at8/16, one advancing and one terminal. Every stored result field equals corrected
joined0 except plan hash and run identity. This corroboration is excluded from the
later four-run/eight-restore counts. All960 model/run identity pairs change under the
corrected harness commitments while profiles, source rows and requirements agree.
Component episode loss is not global audit erasure or native memory admission.

Preserve the new review-checker failure: it confused250 artifact occurrences with139
unique paths. All111 repetitions have matching hashes;137 shared unique paths retain
identical commitments in the successor. The corrected checker validates both counts
without changing either plan. All403 source bindings match;38 existing exact resources
join the backing index. One narrative and195 backing occurrences retain exact identity;
all5,015 string leaves are covered. No runtime or historical qualification writer rerun.

REV301:11,341 assigned /32 unassigned;197,865 narrative /212,568 backing;
2,773 backing resources. No model, law, allocation, verdict, corpus or obligation
status change. Remaining sources, dependent claims, post-cutoff joins and independent
adequacy remain open. HQ-012 unstarted; Campaign3 NOT EXIT-READY.
108 verdicts;132 bounded clauses;55 /58 wrappers;corpus0.29.0 /21.
RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED.
''',encoding='utf-8',newline='\n')
rpath=P/'RESEARCH_OBLIGATIONS.json';r=load(rpath);obs=['RO-C3-009','RO-C3-012','RO-C3-013','RO-C3-014','RO-C3-015','RO-C3-017','RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
paths=[p.as_posix() for d in ['campaign3-history-habit-rejected-cohort-rev1','campaign3-history-habit-rejected-cohort-development-rev1','campaign3-history-source-roles-rev301'] for p in sorted((P/d).glob('*.json'))]+[cp.as_posix()]
for p in paths:
 assert p not in existing
 r['reportReviews'].append(dict(path=p,obligations=obs))
 for o in r['obligations']:
  if o['id'] in obs:o['evidence'].append(p)
rpath.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS: rejected longitudinal habit cohort reconciled.
Start CAMPAIGN3_HISTORY_HABIT_REJECTED_COHORT_CHECKPOINT.md.
960 planned runs are not completion; sole old joined receipt has17 comparisons/two restores.
All result fields equal corrected joined0 except plan/run identities; counts remain separate.
403 exact bindings/38 new backing resources; counting-checker failure preserved.
Source REV301:11341 assigned /32 unassigned;197865 narrative /212568 backing;
2773 backing resources. No new source gap or runtime run.
Next: remaining material support, dependent-claim dispositions, post-cutoff joins and independent adequacy.
Recheck earlier gaps against expanded backing index. HQ-012 unstarted.
Campaign3 NOT EXIT-READY. Counters1519 /0;108 verdicts;55 /58 wrappers;
132 bounded clauses;corpus0.29.0 /21. RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED.
All jobs terminal;no owner ruling.
'''
cur.write_text(old.decode('utf-8-sig').split('HQ-011 IN PROGRESS:')[0]+route,encoding='utf-8',newline='\n')
a=Path('AGENTS.md');s=a.read_text(encoding='utf-8-sig');needle='**Current routing (2026-10-08):**';pos=s.index(needle)
a.write_text(s[:pos]+needle+'\n'+route+'\n'+s[pos:].replace('**Current routing','**Prior routing',1),encoding='utf-8',newline='\n')
print(json.dumps(dict(reports=len(r['reportReviews']),added=len(paths),exactChronology=True)))
