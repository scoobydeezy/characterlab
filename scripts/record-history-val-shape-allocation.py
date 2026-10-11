from pathlib import Path
import json
P=Path('docs/planning')
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(P/'campaign3-history-source-roles-rev245/check.json');assert c['assignedSources']==11047
cp=P/'CAMPAIGN3_HISTORY_VAL_SHAPE_ALLOCATION_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# VAL shape and allocation authority — 2026-10-08

**LOCAL DISPOSITION — no owner ruling.** HQ011 IN PROGRESS; counters **1519 / 0**.

Three sources preserve134 original narrative occurrences and118 JSON string leaves.
Seven exact bindings match current or indexed historical bytes. The audit's complete
snapshot equals the previously reviewed VAL table; all record/field/member/binding
Markdown rows match. That table retains its prior assignment without double counting.
Forty mechanical checks froze329/330 with one required field each, two registry-kind
members and two bindings using existing identity homes. They did not qualify runtime.

The accepted revision2 shape closed the missing DomainValidator binding and exact
CONTENT domain after revision1 was insufficient. Same declarations could previously
select different supplied predicates or capture presentation/environment. The proposed
inspection identified that gap; it was not itself an executed exploit. Accepted closed
semantics and canonical operands determine the model. Changed host behavior under fixed
semantics is an implementation defect, not automatically a new valid model. Build support
may reject activation; neither a model hash nor a source hash proves conformance.

Model admission and build qualification remain separate. Minimal character CONTENT does
not invent body/roster/psychology requirements. Invariant text remains data. The character
role checks exact authored origin, committed resolution and kind; malformed declaration
and runtime role failures remain distinct. RequiredSemanticKind has no new role constraint.
Declared/referenced validator closure covers all three admitted role positions, including
unexercised branches; CONTENT precedes role validation. The later memory correction
preserves that original order. Historical shape-only/activation status is superseded only
by later bounded qualification, while the second-kind positive remains conditional.

Source REV245:11,047 assigned /326 unassigned;191,208 narrative /212,032 backing;
1,241 indexed backing resources. No new archive/source gap, runtime/test/build rerun,
model, law, allocation, verdict, corpus or obligation status change. Source gaps, formula
provenance, legacy log, post-cutoff joins and independent adequacy remain open. HQ012
unstarted; Campaign3 NOT EXIT-READY.1519/0;108 verdicts;132 bounded clauses;55/58 wrappers;
corpus0.29.0/21. RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED.
''',encoding='utf-8',newline='\n')
rpath=P/'RESEARCH_OBLIGATIONS.json';r=load(rpath);obs=['RO-C3-008','RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
paths=[p.as_posix() for d in ['campaign3-history-val-shape-allocation-rev1','campaign3-history-source-roles-rev245'] for p in sorted((P/d).glob('*.json'))]+[cp.as_posix()]
for p in paths:
 assert p not in existing
 r['reportReviews'].append(dict(path=p,obligations=obs))
 for o in r['obligations']:
  if o['id'] in obs:o['evidence'].append(p)
rpath.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS: VAL shape and allocation authority reconciled.
Start CAMPAIGN3_HISTORY_VAL_SHAPE_ALLOCATION_CHECKPOINT.md.
Three sources;134 narrative occurrences;118strings;7exact bindings and table/MD parity.
Model semantics,model admission,build support and qualification remain distinct.
Source REV245:11047 assigned /326 unassigned;191208 narrative /212032 backing;
1241 backing resources. Values post-cutoff reviews retain separate denominators.
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
