from pathlib import Path
import json
P=Path('docs/planning')
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(P/'campaign3-history-cognitive-appraisal-rev2/check.json');assert c['vectors']==10
cp=P/'CAMPAIGN3_HISTORY_APPRAISAL_RECONCILIATION_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Historical appraisal evidence reconciliation — 2026-10-08

**LOCAL DISPOSITION — no owner ruling.** HQ011 IN PROGRESS. Counters **1519 /0**.

The explicit TA-A..J mapping gap is reconciled using the accepted qualification's
public/component/static-exclusion split. No historical report is rewritten and no
claim is made that every proposed draft mutation was independently executed.

Fresh follow-up evidence adds36 component cases for two incompatible-goal pairs,
with the same forecast producing opposite assessment signs and equal or unequal
distances. Across gains0,1/2,1, enabled/disabled concern and0/1/2 tasks,72 associated
base/evidence checks preserve motive ownership and original observation support.
Nine invalid-operand controls reject with INVALID_CONFIGURATION: out-of-domain gain
or forecast, invalid/reversed intervals, missing criterion and wrong selected spec.
Two in-memory production-source mutations each cause eight assertion failures:
concern promoted to base motive and fabricated independent observation support.
No compilation/anchor error is counted as detection. No source file was mutated.

Together with the unchanged first supplement, this is198 component scenario cases,
six detected source mutants and nine separate expected-rejection controls. The72
base/evidence checks belong to the36 follow-up cases, not72 extra scenarios. These
are present-source component results; no new public model or historical execution
claim follows. Public task recipes retain their original overlapping intervals.

Six selected assertions from the prior76-test receipt remain bound to unchanged
complete source/test fingerprints. They cover live generated source authentication,
zero reads/unchanged state, data-only public admission, full-instant final-trace
rollback/restore, retained-source mutations and distinct execution outcome. They
were not rerun in this pass. Six exact source anchors support the structural limits:
appraisal/concern receive no truth/state resolver or patch capability; the ordinary
cognitive adapter returns the same authoritative state; public admission requires
the exact committed cohort. Direct retirement and truth comparison are therefore
explicit bounded structural exclusions, not newly executed mutation detections or
proof against arbitrary malicious trusted-host/global code.

No immediate TA mapping item remains unaccounted. Broader host/capability claims,
new source/adaptor ownership and wider affect/public-scene scope retain explicit
RO019/RO021 triggers in the crosswalk. Overall historical-universe adequacy is still
unproven; this local reconciliation does not close RO021 or pass Campaign3.

SourceREV179 remains10,312 assigned/1,061 unassigned;130,365 narrative/211,150 backing;
1,190 indexed outside-census artifacts.80 exit-inventory identities plus one older
scheduler identity remain unresolved. Formula provenance, legacy log, Values90/15
and remaining component contracts/planning roles still require reconciliation.
Next remaining cognitive contracts, then independent adequacy. HQ012 unstarted;
Campaign3 NOT EXIT-READY.1519/0;108 verdicts;132 bounded clauses;55/58 wrappers;
corpus0.29.0/21. No new verdict, model/allocation, production change, law selection,
corpus promotion or obligation closure. RO019 ACTIVE;RO021 mandatory UNSATISFIED;
RO022 CLOSED. All execution jobs terminal; no user decision required.
''',encoding='utf-8',newline='\n')
rpath=P/'RESEARCH_OBLIGATIONS.json';r=load(rpath);obs=['RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
paths=[p.as_posix() for p in sorted((P/'campaign3-history-cognitive-appraisal-rev2').glob('*.json'))]+[cp.as_posix()]
for p in paths:
 assert p not in existing
 r['reportReviews'].append(dict(path=p,obligations=obs))
 for o in r['obligations']:
  if o['id'] in obs:o['evidence'].append(p)
rpath.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS:TA-A..J explicit evidence mapping reconciled.
Start CAMPAIGN3_HISTORY_APPRAISAL_RECONCILIATION_CHECKPOINT.md.
Fresh36 incompatible-goal cases/72 associated base/evidence checks,nine invalid
operand controls,two detected mutants. With prior supplement:198 cases/six
mutants. Six prior assertions/source hashes reverified,not freshly rerun.
Truth access/direct retirement remain explicit structural exclusions,not
executed mutants or arbitrary trusted-host noninterference. No new public model.
SourceREV179 unchanged:10312 assigned/1061 unassigned;130365 narrative/211150
backing;1190 archives.80 exit-inventory gaps plus one scheduler identity OPEN.
Next remaining cognitive contracts/planning roles,then independent adequacy.
Formula provenance,legacy log,Values90/15 remain OPEN;HQ012 unstarted.
Campaign3 NOT EXIT-READY.1519/0;108 verdicts;55/58 wrappers;132 bounded;
corpus0.29.0/21. RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED.
All jobs terminal;no owner ruling.
'''
cur.write_text(old.decode('utf-8-sig').split('HQ-011 IN PROGRESS:')[0]+route,encoding='utf-8',newline='\n')
a=Path('AGENTS.md');s=a.read_text(encoding='utf-8-sig');needle='**Current routing (2026-10-08):**';pos=s.index(needle)
a.write_text(s[:pos]+needle+'\n'+route+'\n'+s[pos:].replace('**Current routing','**Prior routing',1),encoding='utf-8',newline='\n')
print(json.dumps(dict(reports=len(r['reportReviews']),added=len(paths),exactChronology=True)))
