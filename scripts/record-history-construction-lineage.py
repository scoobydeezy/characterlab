from pathlib import Path
import json
P=Path('docs/planning')
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(P/'campaign3-history-source-roles-rev294/check.json');assert c['assignedSources']==11325
cp=P/'CAMPAIGN3_HISTORY_CONSTRUCTION_LINEAGE_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# EVID/REG construction proof lineage — 2026-10-08

**LOCAL DISPOSITION — finite component assays, with changing source identities.**
HQ-011 in progress; no owner ruling. Counters **1519 / 0**.

Four earlier assays retain17/19/29/30 passing baseline test entries and18/18/23/23
reported detected mutations. Each detection has an actual failed stored test state;
these injected-fault failures are not baseline failures.82 mutation occurrences
represent23 distinct substitutions, not82 independent mechanisms. Composite group/
name keys preserve the several groups all named baseline without collapsing them.

REV2 adds Campaign1 fallible files/unresolved roles/missing-versus-false facets
through E/L, plus false-gate evaluation versus empty/nonmatching resolver dispatch.
REV3 adds the REG family/domain/Character-role and inert-content-ownership controls
that earlier limitations marked pending. It preserves sharing one parameter across
characters for one variable versus rejecting two variable owners, exact R0 bounds,
negative-rate floor, independent variable/TIME scales, endpoint totality and failure
precedence. REV4 adds distinct observers and shifted output allocation with intact
predecessor chains. The AD-E5 frozen-gate order witness remains across all revisions.

Seven/two/two retained source paths change across those increments. REV5 retains
REV4 baseline/mutation/limitation arrays exactly but changes its transition-admission
test fingerprint. Equal results do not imply equal source or a new fresh replay.
Only INVALID_CONFIGURATION is claimed as public carrier; diagnostic text is not
normative. These assertion-based controls do not constitute an independent general
EVID/REG interpreter, complete EVID-S/REG-M/FCT-6 or a release verdict. Later current
and FCT6 qualification carry their own scoped evidence.

996 original narrative occurrences and all2,268 string leaves are preserved.
23 source binding occurrences resolve; nine distinct historical source hashes remain
unresolved: transitionAdmissionV04, occurrenceIdentity, one FrozenGateOrder test,
three RegulatoryReference tests and three TransitionAdmission tests. No global
absence or source-exact rerun claimed. Include them in final gap/dependent-claim
reconciliation. No new backing resources; original assays unchanged.

REV294:11,325 assigned /48 unassigned;197,281 narrative /212,373 backing;
2,593 backing resources. No model, law, allocation, verdict, corpus or obligation
status changes. Remaining source support, dependent claims, post-cutoff joins and
independent adequacy remain open. HQ-012 unstarted; Campaign3 NOT EXIT-READY.
108 verdicts;132 bounded clauses;55 /58 wrappers;corpus0.29.0 /21.
RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED.
''',encoding='utf-8',newline='\n')
rpath=P/'RESEARCH_OBLIGATIONS.json';r=load(rpath);obs=['RO-C3-008','RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
paths=[p.as_posix() for d in ['campaign3-history-construction-lineage-rev1','campaign3-history-source-roles-rev294'] for p in sorted((P/d).glob('*.json'))]+[cp.as_posix()]
for p in paths:
 assert p not in existing
 r['reportReviews'].append(dict(path=p,obligations=obs))
 for o in r['obligations']:
  if o['id'] in obs:o['evidence'].append(p)
rpath.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS: four EVID/REG construction assays reconciled.
Start CAMPAIGN3_HISTORY_CONSTRUCTION_LINEAGE_CHECKPOINT.md.
Baseline17/19/29/30;18/18/23/23 detected substitutions; changing source identities preserved.
23 exact bindings/nine historical source gaps. No historical assay rerun.
Source REV294:11325 assigned /48 unassigned;197281 narrative /212373 backing;
2593 backing resources. Finite component assays are not general interpreter proof.
Next: remaining material support, dependent-claim dispositions, post-cutoff joins and independent adequacy.
Include earlier/new gaps in final consolidation. HQ-012 unstarted.
Campaign3 NOT EXIT-READY. Counters1519 /0;108 verdicts;55 /58 wrappers;
132 bounded clauses;corpus0.29.0 /21. RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED.
All jobs terminal;no owner ruling.
'''
cur.write_text(old.decode('utf-8-sig').split('HQ-011 IN PROGRESS:')[0]+route,encoding='utf-8',newline='\n')
a=Path('AGENTS.md');s=a.read_text(encoding='utf-8-sig');needle='**Current routing (2026-10-08):**';pos=s.index(needle)
a.write_text(s[:pos]+needle+'\n'+route+'\n'+s[pos:].replace('**Current routing','**Prior routing',1),encoding='utf-8',newline='\n')
print(json.dumps(dict(reports=len(r['reportReviews']),added=len(paths),exactChronology=True)))
