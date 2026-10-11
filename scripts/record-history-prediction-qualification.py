from pathlib import Path
import json
P=Path('docs/planning')
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(P/'campaign3-history-source-roles-rev226/check.json');assert c['assignedSources']==10932
cp=P/'CAMPAIGN3_HISTORY_PREDICTION_QUALIFICATION_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Measurement prediction historical qualification — 2026-10-08

**LOCAL DISPOSITION — no owner ruling.** HQ011 IN PROGRESS; counters **1519 / 0**.

Four target/packaging/qualification documents are reconciled, preserving107 original
narrative occurrences. Internal review is not an external verdict. Exact acceptance
links preserve the occurrence-governance correction and its earlier audit disposition.

The predictor estimates the next admitted diagnostic reading, not current truth,
action efficacy, reward or confidence. Unknown absence differs from learned zero.
Support count does not prove independence or calibrated certainty. Exact arithmetic
without intermediate rounding supports numerical permutation equality, not identical
trace order or equivalence to the quantizing historical estimator. Last-reading,
constant-gain, censored evidence, surprise and correlation mechanisms retain their
separate comparison obligations. Consequence-only timing did not close current-lane
producer questions merely by avoiding them.

The early allocation audit missed a semantic reference error:275 is an input producer,
not an occurrence identity rule. Corrected367/2 and368/2 retain field allocations while
retiring367 field2; its encoded presence is zero. Shared279/3 is the sole occurrence
rule source. Rules0.1 and component0.2 name different version owners. Same model bytes
across review packets do not equate changed generator or negative-test fingerprints.

Public ablations and matched point interventions remain distinct from component-only
fixed-safe hidden-cause,64/65 support-limit and certain target controls. The one-character,
one-key profile does not demonstrate multi-character or independent-target numerical
freeze discrimination. It instead requires actual common-B0 capabilities and pair
lifecycle controls. Synthetic component envelopes are not public canonical traces.
Named rollback failures do not establish arbitrary host-failure coverage.

The qualified path uses actual203/337/342 and owned prediction state, then a separately
generated later read. Application and read ablations preserve opportunities without
recovering absent belief from memory or trace. New wrappers cannot recount an existing
observation; duplicate precedence survives the support limit. Authenticated formation/
application pairs and matched padding retain separate owners and atomic rollback.

Derived packaging counts12/14/2 were not then execution evidence; later public checks
supply that scope. The1124-test combined run contains796 fresh and328 reference tests.
Later eight stage tests and one forgery test are separate runs, not a1133-test suite.
Five named source substitutions are reported detected; no non-discriminating freeze
mutant is counted. Referenced runtime proof/audit and preservation receipts remain
historical bindings requiring their own review, not fresh execution or global adequacy.

Source REV226: 10,932 assigned /441 unassigned; 189,030 narrative /211,858 backing;
1,219 indexed backing resources. No new source gap/archive, runtime/test/build rerun,
model, law, allocation, verdict, corpus or obligation status change. Prior gaps,
formula provenance, legacy log, post-cutoff joins and independent adequacy remain open.
HQ012 unstarted; Campaign3 NOT EXIT-READY. Counters1519/0;108 verdicts;
132 bounded clauses;55/58 wrappers;corpus0.29.0/21.
RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED. No owner ruling.
''',encoding='utf-8',newline='\n')
rpath=P/'RESEARCH_OBLIGATIONS.json';r=load(rpath);obs=['RO-C3-008','RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
paths=[p.as_posix() for d in ['campaign3-history-prediction-qualification-rev1','campaign3-history-source-roles-rev226'] for p in sorted((P/d).glob('*.json'))]+[cp.as_posix()]
for p in paths:
 assert p not in existing
 r['reportReviews'].append(dict(path=p,obligations=obs))
 for o in r['obligations']:
  if o['id'] in obs:o['evidence'].append(p)
rpath.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS: prediction qualification history reconciled.
Start CAMPAIGN3_HISTORY_PREDICTION_QUALIFICATION_CHECKPOINT.md.
Four sources;107 narrative occurrences; component/public proof scopes preserved.
Exact-mean and occurrence-correction limits retained; no runtime rerun.
Source REV226:10932 assigned /441 unassigned;189030 narrative /211858 backing;
1219 backing resources. Values post-cutoff reviews retain separate denominators.
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
