from pathlib import Path
import json
P=Path('docs/planning')
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(P/'campaign3-history-source-roles-rev277/check.json');assert c['assignedSources']==11253
cp=P/'CAMPAIGN3_HISTORY_RETRIEVAL_MEMBERSHIP_CORRECTION.md';assert not cp.exists()
cp.write_text('''# Retrieval membership claim correction — 2026-10-08

**LOCAL DISPOSITION — material claim narrowed; no owner ruling.** HQ-011 remains
in progress. Counters **1519 / 0**. Original receipts and writer remain unchanged.

CONCERN_RETRIEVAL_CEILING_REV1.json finding4 claims the K2 selected SET changes.
Its30 stored wide-selection rows always select c-old and d-oldest, changing only
order. The original S5 assertion uses array inequality rather than set inequality.
It therefore passes without proving the stated membership change. This report
corrects that claim; it does not reclassify the original report as fresh execution.

Independent exact rational arithmetic verifies all30 crossover cells,30 wide ranks
and five endpoint ceilings. Both selected episodes strictly outrank both excluded
episodes at weights1 and2. Each score difference is affine in weight, proving
unchanged membership throughout the entire[1,2] range. The response ceiling and
fixture-relative C6 remain valid. At crossover2, A reaches equality; the declared
x-before-y tie order prevents replacement, rather than proving all tie policies
would do so. No gain within the family creates strict advantage above that bound.

ATTENTION_RETRIEVAL_WITNESS_SEARCH_REV1 independently contains the same distinction:
weights1 and7/5 reverse episodes4/5 order without changing K2 membership. All8
base/pull/score rows and both rankings match fresh rational recomputation from the
stored histories and activation. Those hypothetical operands do not authenticate
graph acquisition, presentation writers, actual source or public persistence.

RO-C3-003 owns the corrected limit: a selected-set-change claim needs a separate
witness with an actual entry/exit and set comparison at declared K, including tie
policy. Neither of these receipts supplies it. No whole-corpus gate is waived,
no candidate/law is selected or retired, and no obligation closes.

Two sources preserve19 original narrative occurrences and all284 string leaves.
Both named source bindings match exact bytes; no new missing binding. Source REV277:
11,253 assigned /120 unassigned;194,174 narrative /212,205 backing;1,460 backing
resources. Post-cutoff joins, earlier gaps and independent adequacy remain open.
HQ-012 unstarted;Campaign3 NOT EXIT-READY;108 verdicts;132 bounded clauses;
55 /58 wrappers;corpus0.29.0 /21. RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED.
''',encoding='utf-8',newline='\n')
rpath=P/'RESEARCH_OBLIGATIONS.json';r=load(rpath);obs=['RO-C3-002','RO-C3-003','RO-C3-006','RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
paths=[p.as_posix() for d in ['campaign3-history-retrieval-membership-correction-rev1','campaign3-history-source-roles-rev277'] for p in sorted((P/d).glob('*.json'))]+[cp.as_posix()]
for p in paths:
 assert p not in existing
 r['reportReviews'].append(dict(path=p,obligations=obs))
 for o in r['obligations']:
  if o['id'] in obs:o['evidence'].append(p)
o=next(o for o in r['obligations'] if o['id']=='RO-C3-003')
o['established']+=' HQ-011 correction (2026-10-08): CONCERN_RETRIEVAL_CEILING_REV1 finding4 overclaims K2 set change. All stored wide selections contain c-old/d-oldest; exact affine score differences prove unchanged membership throughout weight[1,2]. Only order changes. Original array-inequality assertion cannot establish set inequality. All30 crossover cells remain correct; at crossover2 A ties and the declared canonical tie order retains x, not a universal tie-policy impossibility. The separate ATTENTION_RETRIEVAL_WITNESS_SEARCH_REV1 also changes order only; all8 scores reverified from hypothetical operands. Originals preserved.'
o['blocks'].append('Selected-set membership change inferred from either CONCERN_RETRIEVAL_CEILING_REV1 or ATTENTION_RETRIEVAL_WITNESS_SEARCH_REV1')
o['reopenTrigger']+=' A consumer or reduction relies on selected-set change rather than changed score/order.'
o['closureRequirement']+=' For a membership claim, supply an independently justified fixture with actual set entry/exit at declared K and explicit tie policy; compare sets, not only ordered arrays. These two receipts do not discharge that requirement.'
rpath.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS: retrieval selected-set overclaim corrected.
Start CAMPAIGN3_HISTORY_RETRIEVAL_MEMBERSHIP_CORRECTION.md.
Ceiling finding4 array order change is not K2 membership change;originals preserved.
Fresh exact arithmetic:30 crossovers/30 wide ranks/8 witness scores;RO003 updated.
Source REV277:11253 assigned /120 unassigned;194174 narrative /212205 backing;
1460 backing resources.19 narrative occurrences/284 strings;2 exact bindings.
Next: remaining material support, source recovery, post-cutoff joins and independent adequacy.
Prior source gaps, formula provenance and legacy log remain OPEN;HQ-012 unstarted.
Campaign3 NOT EXIT-READY. Counters1519 /0;108 verdicts;55 /58 wrappers;
132 bounded clauses;corpus0.29.0 /21. RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED.
All jobs terminal;no owner ruling.
'''
cur.write_text(old.decode('utf-8-sig').split('HQ-011 IN PROGRESS:')[0]+route,encoding='utf-8',newline='\n')
a=Path('AGENTS.md');s=a.read_text(encoding='utf-8-sig');needle='**Current routing (2026-10-08):**';pos=s.index(needle)
a.write_text(s[:pos]+needle+'\n'+route+'\n'+s[pos:].replace('**Current routing','**Prior routing',1),encoding='utf-8',newline='\n')
print(json.dumps(dict(reports=len(r['reportReviews']),added=len(paths),exactChronology=True)))
