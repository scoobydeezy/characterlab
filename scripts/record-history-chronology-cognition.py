"""Record partial chronology progress without promoting the whole source."""
from pathlib import Path
import json

P=Path('docs/planning');O=P/'campaign3-history-chronology-cognition-rev1'
c=json.loads((O/'check.json').read_text(encoding='utf-8'))
assert c['cumulativeReviewed']==134
cp=P/'CAMPAIGN3_HISTORY_CHRONOLOGY_COGNITION_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Chronological cognition claims — 2026-10-11

**LOCAL DISPOSITION — HQ-011 continues; no owner ruling. Counters1519 /0.**

Six frozen log entries,lines6870–7087,are reconciled against scoped qualifications
and the exact interference successor.42 occurrences join the prior92:134 reviewed /
1362 pending. Original identities,text and locations remain. Whole log assignment
is still open; source REV313 remains11372 assigned /1 unassigned,199699 narrative /
212699 backing occurrences and2804 outside-census resources.

Interval width represents admitted possibilities,not calibrated confidence. The log's
upper-deficit probability is a reason-dice action probability,not a posterior probability
of deficit. Accuracy is assessed outside cognition; biased belief can remain wrong.
Vivid recollection is the declared sensory-clarity readout,not truth or subjective
phenomenology. Empty sensory content retains observed episode identity; unrelated cue
selection through baseline ranking remains a control. Both failed assertions survive.

Completed prior affect changes actual later publication at fixed memory/history/cue.
It does not qualify same-step feedback,encoding suppression or a general gain law.
ScalarUncontrolled exactly preserves the declared retrieval consumer. Other scalar
failures and later body-only regulatory failure do not establish vector necessity or
permit global removal of exposure,belief,goals and appraisal factors.

Latent-cause inference remains one episode with authored diagnostic likelihoods and
two alternatives. Cross-episode interference expectation has its own source/learning
experiment. The primary terminal-report controls proved storage only; a separately
frozen report7/probe8 successor earns later consumer evidence. Native source and
component replay totals stay separate. Source-pooled2/4 remains an arithmetic diagnostic,
not another qualified runtime model. No original plan or result was rewritten.

Five material distinctions retain owners,blocked claims and reopen conditions. No
runtime suite or original writer rerun; no law,representation or obligation retired.
Next: chronology before line6870,then consolidated gaps,post-cutoff joins and independent
adequacy. HQ-012 unstarted. Campaign3 NOT EXIT-READY.108 verdicts;132 bounded clauses;
55 producers/58 factories;corpus0.29.0/21. RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED.
''',encoding='utf-8',newline='\n')
rpath=P/'RESEARCH_OBLIGATIONS.json';r=json.loads(rpath.read_text(encoding='utf-8-sig'))
obs=['RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
paths=[p.as_posix() for p in sorted(O.glob('*.json'))]+[cp.as_posix()]
for p in paths:
    assert p not in existing
    r['reportReviews'].append(dict(path=p,obligations=obs))
    for o in r['obligations']:
        if o['id'] in obs:o['evidence'].append(p)
rpath.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS: six cognition chronology entries reconciled.
Start CAMPAIGN3_HISTORY_CHRONOLOGY_COGNITION_CHECKPOINT.md.
Frozen log1496 occurrences/165 sections;134 reconciled/1362 pending.
Preserve uncertainty/accuracy,clear false recall,scalar successes and post-report probe limits.
Source REV313 unchanged:11372 assigned /1 unassigned;199699 narrative /212699 backing;
2804 backing resources. Partial log review does not assign its whole-source role.
Next chronology before line6870,consolidated gaps,post-cutoff joins and independent adequacy.
HQ-012 unstarted. Campaign3 NOT EXIT-READY. No runtime suite rerun.
Counters1519 /0;108 verdicts;55 /58 wrappers;132 bounded clauses;corpus0.29.0 /21.
RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED. No owner ruling.
'''
cur.write_text(old.decode('utf-8-sig').split('HQ-011 IN PROGRESS:')[0]+route,encoding='utf-8',newline='\n')
a=Path('AGENTS.md');s=a.read_text(encoding='utf-8-sig');needle='**Current routing (2026-10-11):**';pos=s.index(needle)
a.write_text(s[:pos]+needle+'\n'+route+'\n'+s[pos:].replace('**Current routing','**Prior routing',1),encoding='utf-8',newline='\n')
print(json.dumps(dict(reports=len(r['reportReviews']),added=len(paths),exactChronology=True)))
