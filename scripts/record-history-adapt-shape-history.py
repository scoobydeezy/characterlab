from pathlib import Path
import json
P=Path('docs/planning')
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(P/'campaign3-history-source-roles-rev313/check.json');assert c['assignedSources']==11372
cp=P/'CAMPAIGN3_HISTORY_ADAPT_SHAPE_HISTORY_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# ADAPT resolution and consolidation history — 2026-10-11

**LOCAL DISPOSITION — accepted shape, amended fixture and bounded proof separated.**
HQ-011 remains in progress; no owner ruling. Counters **1519 / 0**.

The two whole sources preserve authority/input separation, actual competence versus
capability belief, committed single-path rules and distinct refused/no-rule/no-op/change
outcomes. State-route closure derives from all ten logical families, independently
of EVID's empty write permissions. Eight cognitive families remain unmaterialized;
required learning-evidence outputs must nevertheless actually exist. Neither an empty
output set nor dummy cognitive storage can discharge the both-affected phenomenon.

The accepted PHEN_ADAPT_FIXTURE_AMENDMENT explicitly resolves the original one-rule
restriction. The frozen fixture has four independent rules with the same nonempty
applicable set across count0/count1, and independently expected changed-path subsets.
Count0 changes none; count1 changes all four. Isolation relies on exact paths and
wrong-key controls; the regulatory leaf-family complement alone is non-discriminating.
No frozen predecessor wording or commitment is silently rewritten.

The consolidation's exact batch lifecycle refines the earlier conceptual dispatch flow:
resolve all targets and reject collisions, including no-ops, before evaluator reads
and output allocation. Each evaluator reads the common frozen state through exact
capabilities. Allocation/trace order may vary with EventSequence; adaptation values
cannot use preceding staged writes. Same-path aggregation and ordinary phase140
coexistence remain outside this profile.

Baseline absence is a scoped current-state normal form, not a finding that history
never matters. Identical current values with history-dependent behavior reopens retained
state semantics; storage-presence bits cannot substitute. ADAPT's integer lattice is
its own numeric profile, correcting the older observation-derived claim. Proportional
response meanings are bounded modeling choices, not universal biological necessities
proved by key shape. Regulatory validity checks R0+D at T, including time-only failure
before attempted repair, with no implicit clamp or constitutional rewrite.

Six material distinctions retain owners, blocked claims and reopening conditions.
Later bounded factory/PHEN evidence supersedes dated pending labels only within its
scope. No fresh runtime/test/writer run, production edit or general biology claim.
Two original sources preserve393 occurrences across18 top-level sections.
REV313:11,372 assigned /1 unassigned;199,699 narrative /212,699 backing;
2,804 outside-census resources. Chronology remains, followed by consolidated gaps,
dependent claims, post-cutoff joins and independent adequacy. HQ-012 unstarted;
Campaign3 NOT EXIT-READY.108 verdicts;132 bounded clauses;55 /58 wrappers;
corpus0.29.0 /21. RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED.
''',encoding='utf-8',newline='\n')
rpath=P/'RESEARCH_OBLIGATIONS.json';r=load(rpath);obs=['RO-C3-008','RO-C3-010','RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
paths=[p.as_posix() for d in ['campaign3-history-adapt-shape-history-rev1','campaign3-history-source-roles-rev313'] for p in sorted((P/d).glob('*.json'))]+[cp.as_posix()]
for p in paths:
 assert p not in existing
 r['reportReviews'].append(dict(path=p,obligations=obs))
 for o in r['obligations']:
  if o['id'] in obs:o['evidence'].append(p)
rpath.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS: ADAPT resolution/consolidation history reconciled.
Start CAMPAIGN3_HISTORY_ADAPT_SHAPE_HISTORY_CHECKPOINT.md.
393 original occurrences;six material distinctions preserve amended fixture and baseline-history limits.
Logical state closure differs from inhabited output closure; exact batch refines draft dispatch prose.
Source REV313:11372 assigned /1 unassigned;199699 narrative /212699 backing;
2804 backing resources. No runtime suite or original-source change.
Next: chronological source,then consolidated gaps,post-cutoff joins and independent adequacy.
Dependent claims remain open. HQ-012 unstarted. Campaign3 NOT EXIT-READY.
Counters1519 /0;108 verdicts;55 /58 wrappers;132 bounded clauses;corpus0.29.0 /21.
RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED. All jobs terminal;no owner ruling.
'''
cur.write_text(old.decode('utf-8-sig').split('HQ-011 IN PROGRESS:')[0].replace('Updated2026-10-08','Updated2026-10-11')+route,encoding='utf-8',newline='\n')
a=Path('AGENTS.md');s=a.read_text(encoding='utf-8-sig');needle='**Current routing (2026-10-11):**';pos=s.index(needle)
a.write_text(s[:pos]+'**Current routing (2026-10-11):**'+'\n'+route+'\n'+s[pos:].replace('**Current routing','**Prior routing',1),encoding='utf-8',newline='\n')
print(json.dumps(dict(reports=len(r['reportReviews']),added=len(paths),exactChronology=True)))
