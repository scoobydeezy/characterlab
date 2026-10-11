from pathlib import Path
import json
P=Path('docs/planning')
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(P/'campaign3-history-source-roles-rev299/check.json');assert c['assignedSources']==11337
cp=P/'CAMPAIGN3_HISTORY_IDENTITY_ABLATION_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Identity feedback ablation lineage — 2026-10-08

**LOCAL DISPOSITION — matched evidence supports bounded feedback influence.**
HQ-011 in progress; no owner ruling. Counters **1519 / 0**.

Three sources retain the original review, strengthened review and decoded summary.
All twelve run results remain identical after removing newly added prefix fields;
all sixteen component comparisons and stated limits remain identical.96 stored
prefix snapshots are not96 restored prefixes or fresh runtime executions.

Read-only decoding independently verifies all four public pairs: state/history
before6 and first three decisions match; six shared addresses each carry identical
complete draw records. Three prior identity entries remain byte-identical through
final history in both branches. At6, baseline uses PlayerFacingRoll with1/2,1/2,
while standing-access-off uses Auto with0,1. Seed0 chooses the same action; seeds1..3
differ. Equal sampled action does not erase distribution/mode differences. Integer
standing modifiers are zero, but standing still affects reason activation.

The original final history/state/draw inequalities are legitimate consequences of
changed later decisions and mode. They do not prove old history was deleted or
shared random draws differed. REV2 supplies matched pre-probe evidence rather than
rewriting those final observations. All decoded summary rows match exactly.

Sixteen generated-source compiler/analyzer comparisons have nine changes and seven
equalities. These pure operand interventions remain component scope, not an admitted
combined public recipe. Four seeds and six original events do not establish whole
PHEN-BIO, general identity necessity, retraction or calibrated equivalence. Full
outputs/trace may differ at raw/read/fold evidence even with narrower behavioral
projection equality. No historical runtime, model writer or summary writer rerun.

46 original narrative occurrences and all2,258 string leaves retain scope.
476 source binding occurrences resolve exactly;138 existing backing resources newly
indexed. Recheck earlier gaps against this expanded index during final consolidation.
REV299:11,337 assigned /36 unassigned;197,854 narrative /212,373 backing;
2,735 backing resources. No model, law, allocation, verdict, corpus or obligation
status changes. Remaining source support, dependent claims, post-cutoff joins and
independent adequacy remain open. HQ-012 unstarted; Campaign3 NOT EXIT-READY.
108 verdicts;132 bounded clauses;55 /58 wrappers;corpus0.29.0 /21.
RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED.
''',encoding='utf-8',newline='\n')
rpath=P/'RESEARCH_OBLIGATIONS.json';r=load(rpath);obs=['RO-C3-008','RO-C3-013','RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
paths=[p.as_posix() for d in ['campaign3-history-identity-ablation-rev1','campaign3-history-source-roles-rev299'] for p in sorted((P/d).glob('*.json'))]+[cp.as_posix()]
for p in paths:
 assert p not in existing
 r['reportReviews'].append(dict(path=p,obligations=obs))
 for o in r['obligations']:
  if o['id'] in obs:o['evidence'].append(p)
rpath.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS: three identity-feedback ablation sources reconciled.
Start CAMPAIGN3_HISTORY_IDENTITY_ABLATION_CHECKPOINT.md.
Four matched pairs/three old entries/six shared draws each; decoded summary exact.
Twelve results/16 component rows retained;96 stored snapshots are not restores.
Source REV299:11337 assigned /36 unassigned;197854 narrative /212373 backing;
2735 backing resources.476 exact bindings; no original runtime rerun.
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
