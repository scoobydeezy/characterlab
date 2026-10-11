"""Record partial chronology progress without promoting the whole source."""
from pathlib import Path
import json

P=Path('docs/planning');O=P/'campaign3-history-chronology-correction-pass-rev1'
c=json.loads((O/'check.json').read_text(encoding='utf-8'))
assert c['cumulativeReviewed']==1386
cp=P/'CAMPAIGN3_HISTORY_CHRONOLOGY_CORRECTION_PASS_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Correction-pass chronology — 2026-10-11

**LOCAL DISPOSITION — HQ-011 continues; no owner ruling. Counters1519 /0.**

Three frozen entries, lines717–840, are reconciled against the work order, resume
brief, owner rulings, checkpoint discipline and corpus promotion.32 occurrences join
1354 reviewed:1386 reviewed /110 pending. Exact identities, text and locations remain.
REV313 stays11372 assigned /1 unassigned;199699 narrative /212699 backing;
2804 resources. Whole-log role stays open.

The dated pause is historical routing. The reported twelve verdicts included three
absent entries, explicitly corrected on September20. All eleven promoted corpus
members were blocked or partial: three partial plus eight blocked. The erroneous
ten-count remains in its original receipt; no status, version or digest is rewritten.
Corpus membership names an obligation and does not qualify it.

The namespace correction selects PHEN-ATTN-001 without inventing a reservation in a
different typed namespace. Documentation synchronization does not qualify runtime
behavior. Its described tool-output preflight is not represented here as a separately
recovered process receipt or a fresh run. Four distinctions retain owners, blocked
claims and reopen conditions. No law or reduction selected.

No runtime suite or original writer rerun. Next chronology before line717, then
consolidated gaps, post-cutoff joins and independent adequacy. HQ-012 unstarted;
Campaign3 NOT EXIT-READY.108 verdicts;132 bounded clauses;55 producers/58 factories;
corpus0.29.0/21. RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED.
''',encoding='utf-8',newline='\n')
rpath=P/'RESEARCH_OBLIGATIONS.json';r=json.loads(rpath.read_text(encoding='utf-8-sig'))
obs=['RO-C3-010','RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
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
route='''HQ-011 IN PROGRESS: correction-pass chronology reconciled.
Start CAMPAIGN3_HISTORY_CHRONOLOGY_CORRECTION_PASS_CHECKPOINT.md.
Frozen log1496 occurrences/165 sections;1386 reconciled/110 pending.
Dated routing,corrected corpus counts and preflight evidence limits preserved.
Source REV313 unchanged:11372 assigned /1 unassigned;199699 narrative /212699 backing;
2804 backing resources. Partial log review does not assign its whole-source role.
Next chronology before line717,consolidated gaps,post-cutoff joins and independent adequacy.
HQ-012 unstarted. Campaign3 NOT EXIT-READY. No runtime suite rerun.
Counters1519 /0;108 verdicts;55 /58 wrappers;132 bounded clauses;corpus0.29.0 /21.
RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED. No owner ruling.
'''
cur.write_text(old.decode('utf-8-sig').split('HQ-011 IN PROGRESS:')[0]+route,encoding='utf-8',newline='\n')
a=Path('AGENTS.md');s=a.read_text(encoding='utf-8-sig');needle='**Current routing (2026-10-11):**';pos=s.index(needle)
a.write_text(s[:pos]+needle+'\n'+route+'\n'+s[pos:].replace('**Current routing','**Prior routing',1),encoding='utf-8',newline='\n')
print(json.dumps(dict(reports=len(r['reportReviews']),added=len(paths),exactChronology=True)))
