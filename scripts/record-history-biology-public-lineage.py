from pathlib import Path
import json
P=Path('docs/planning')
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(P/'campaign3-history-source-roles-rev307/check.json');assert c['assignedSources']==11361
cp=P/'CAMPAIGN3_HISTORY_BIOLOGY_PUBLIC_LINEAGE_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Public biology plan and closure lineage — 2026-10-11

**LOCAL DISPOSITION — historical implementation scopes and exact evidence retained.**
HQ-011 in progress; no owner ruling. Counters **1519 / 0**.

Allthree plans retain identical28 model identities,58 run recipes,inputs,seeds,
baselines,prefixes and experiment identity. Only source commitments change. REV1 to2
changes factory/harness serialization; REV2 to3 adds the intrinsic-byte adapter and
changes five source commitments. The interrupted first cohort and actual long-save
REV2 failure remain separate from final qualification. The first late ComparisonCase
wrapper remains disclosed; hash equality does not independently prove freeze timing.

The two completed REV2 partitions contain29 rows exactly equal to final REV3 rows.
They do not add unique coverage. Allplans specify270 selected native prefixes:
212 advancing/58 terminal. Full main seed7 and five supplements use every prefix;
other trajectories use0/8/terminal plus original initial-tail continuation. This is
not native replay of all2,389 component prefixes. Duplicate row35 explains59 row
executions/273 checks versus58 distinct runs/270 unique prefix tuples.

The closures differ only in artifact bindings for the preserved documentation
correction. Original scientific fields and results agree. The historical closure
checker passes through the explicit preserved-source loader. It verifies dated
56 scoped/328 reference test/build receipts; those suites were not rerun. Current
biology runtime includes the separately qualified publication barrier and is not
substituted for the original runtime. RO022 stays closed within that later scope.

Review REV1 initially left the old checker hash unresolved after its stated index/
census search. The explicit bookkeeping archive recovers exact bytes. REV2 carries
that original search and recovery; no receipt or historical source was rewritten.
All119 bindings resolve;13 existing exact resources join backing. Seven source roles
preserve eight original narrative occurrences and35,909 complete string leaves.

REV307:11,361 assigned /12 unassigned;198,188 narrative /212,699 backing;
2,803 backing resources. Remaining formal/chronological sources, consolidated gaps,
dependent claims, post-cutoff joins and independent adequacy remain open.
HQ-012 unstarted; Campaign3 NOT EXIT-READY.108 verdicts;132 bounded clauses;
55 /58 wrappers;corpus0.29.0 /21. RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED.
''',encoding='utf-8',newline='\n')
rpath=P/'RESEARCH_OBLIGATIONS.json';r=load(rpath);obs=['RO-C3-008','RO-C3-009','RO-C3-015','RO-C3-019','RO-C3-020','RO-C3-021','RO-C3-022'];existing={x['path'] for x in r['reportReviews']}
paths=[p.as_posix() for d in ['campaign3-history-biology-public-lineage-rev1','campaign3-history-biology-public-lineage-rev2','campaign3-history-source-roles-rev307'] for p in sorted((P/d).glob('*.json'))]+[cp.as_posix()]
for p in paths:
 assert p not in existing
 r['reportReviews'].append(dict(path=p,obligations=obs))
 for o in r['obligations']:
  if o['id'] in obs:o['evidence'].append(p)
rpath.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS: public biology plan/closure lineage reconciled.
Start CAMPAIGN3_HISTORY_BIOLOGY_PUBLIC_LINEAGE_CHECKPOINT.md.
Three identical58-run rosters;29 old/final rows equal;270 selected native prefixes.
119 source bindings resolved,including explicit old-checker archive recovery. Review REV2 authoritative.
Historical-source checker passes; current publication repair remains separate.
Source REV307:11361 assigned /12 unassigned;198188 narrative /212699 backing;
2803 backing resources. No runtime replay or original-source change.
Next: formal/chronological sources, consolidated gaps, dependent claims and independent adequacy.
Post-cutoff joins remain open. HQ-012 unstarted. Campaign3 NOT EXIT-READY.
Counters1519 /0;108 verdicts;55 /58 wrappers;132 bounded clauses;corpus0.29.0 /21.
RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED. All jobs terminal;no owner ruling.
'''
cur.write_text(old.decode('utf-8-sig').split('HQ-011 IN PROGRESS:')[0].replace('Updated2026-10-08','Updated2026-10-11')+route,encoding='utf-8',newline='\n')
a=Path('AGENTS.md');s=a.read_text(encoding='utf-8-sig');needle='**Current routing (2026-10-11):**';pos=s.index(needle)
a.write_text(s[:pos]+'**Current routing (2026-10-11):**'+'\n'+route+'\n'+s[pos:].replace('**Current routing','**Prior routing',1),encoding='utf-8',newline='\n')
print(json.dumps(dict(reports=len(r['reportReviews']),added=len(paths),exactChronology=True)))
