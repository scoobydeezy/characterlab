from pathlib import Path
import json
P=Path('docs/planning')
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(P/'campaign3-history-source-roles-rev303/check.json');assert c['assignedSources']==11345
cp=P/'CAMPAIGN3_HISTORY_EARLY_FIXTURE_GATES_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Early conformance gates and fixture amendment — 2026-10-11

**LOCAL DISPOSITION — accepted scope and correct-forward history preserved.**
HQ-011 in progress; no owner ruling. Counters **1519 / 0**.

Campaign0's39 vector rows require complete expected structures, independent oracles,
named negative failures, immutable identities, addressed randomness, exact time,
capability-limited reads, owned patches, whole-instant terminal rollback, quiescence
and structural continuation. Its earlier ORD003/004 pending language is superseded
by the recorded final gate and accepted resolution; candidate suffixes stay immutable.
Those dated PASS assertions do not freshly qualify all later runtime wrappers.

The observation manifest's eight rows close MATH006 only for registered exact bounded
channels. The19/20 pair has common applied1/20 despite different potential effects;
missingness, point/bound evidence, hidden overflow and visible-slot closure stay distinct.
Token projection does not prove general event binding, recognition, noisy measurement,
unknown bounds or learning. SEM001 retains its separate vectors and proof burden.

The accepted PHEN-ADAPT amendment explicitly resolves the old one-rule fixture versus
four-rule frozen-model discrepancy. Both timelines resolve the same nonempty rule set;
each rule targets one exact path. The expected changed subset is specified independently:
empty for count0, four paths for count1. Duplicate targets reject even when no-op.
Control3's leaf-family complement is non-discriminating in this fixture; exact-path3a,
wrong-key controls, ownership and collision checks carry isolation. D-only diagnostic
read/write dependency is not scheduler parentage. Measurement5 versus51/10 and later
memory/carriage joins retain the prior accepted witness's bounded limitations.

All three historical corpus commitments remain distinct:0.26/1.10 draft,0.27/1.11 draft
and accepted0.27/1.11. The accepted historical promotion does not replace current0.29.
Prior read-only timeline/manifest review is referenced by exact hash, not rerun. Missing
full old traces/saves and historical runtime source manifest remain its stated limits.
No original writer, test suite, runtime, source, allocation or model changed.

Three source roles preserve62 original narrative occurrences and47 exact vector rows.
REV303:11,345 assigned /28 unassigned;198,177 narrative /212,699 backing;
2,773 backing resources. No new source commitment gap or backing resource in this batch.
Remaining sources, dependent-claim dispositions, post-cutoff joins and independent
adequacy remain open. HQ-012 unstarted; Campaign3 NOT EXIT-READY.
108 verdicts;132 bounded clauses;55 /58 wrappers;corpus0.29.0 /21.
RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED.
''',encoding='utf-8',newline='\n')
rpath=P/'RESEARCH_OBLIGATIONS.json';r=load(rpath);obs=['RO-C3-008','RO-C3-017','RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
paths=[p.as_posix() for d in ['campaign3-history-early-fixture-gates-rev1','campaign3-history-source-roles-rev303'] for p in sorted((P/d).glob('*.json'))]+[cp.as_posix()]
for p in paths:
 assert p not in existing
 r['reportReviews'].append(dict(path=p,obligations=obs))
 for o in r['obligations']:
  if o['id'] in obs:o['evidence'].append(p)
rpath.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS: early conformance gates and ADAPT fixture amendment reconciled.
Start CAMPAIGN3_HISTORY_EARLY_FIXTURE_GATES_CHECKPOINT.md.
39 substrate/eight observation vector rows; bounded acceptance is not later whole-runtime proof.
Four-rule amendment retains old conflict, exact-path controls and three distinct corpus commitments.
Source REV303:11345 assigned /28 unassigned;198177 narrative /212699 backing;
2773 backing resources. No runtime run, original-source change or new source gap.
Next: remaining material support, dependent-claim dispositions, post-cutoff joins and independent adequacy.
Recheck earlier gaps against expanded backing index. HQ-012 unstarted.
Campaign3 NOT EXIT-READY. Counters1519 /0;108 verdicts;55 /58 wrappers;
132 bounded clauses;corpus0.29.0 /21. RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED.
All jobs terminal;no owner ruling.
'''
cur.write_text(old.decode('utf-8-sig').split('HQ-011 IN PROGRESS:')[0].replace('Updated2026-10-08','Updated2026-10-11')+route,encoding='utf-8',newline='\n')
a=Path('AGENTS.md');s=a.read_text(encoding='utf-8-sig');needle='**Current routing (2026-10-08):**';pos=s.index(needle)
a.write_text(s[:pos]+'**Current routing (2026-10-11):**'+'\n'+route+'\n'+s[pos:].replace('**Current routing','**Prior routing',1),encoding='utf-8',newline='\n')
print(json.dumps(dict(reports=len(r['reportReviews']),added=len(paths),exactChronology=True)))
