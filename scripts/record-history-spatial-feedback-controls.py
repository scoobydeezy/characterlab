from pathlib import Path
import json
P=Path('docs/planning')
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(P/'campaign3-history-source-roles-rev273/check.json');assert c['assignedSources']==11234
cp=P/'CAMPAIGN3_HISTORY_SPATIAL_FEEDBACK_CONTROLS_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Historical spatial feedback and visual claim controls — 2026-10-08

**LOCAL DISPOSITION — no owner ruling.** HQ-011 remains in progress. Counters **1519 / 0**.

Eight receipts preserve22 original narrative occurrences and all205 JSON string
leaves. They record50 detected fault occurrences. Thirty-five binding occurrences
represent32 distinct path/hash pairs:20 match exact current/indexed bytes and15
remain explicitly unresolved. Repeated bindings and controls do not multiply
independent scientific evidence; unavailable source versions retain their claim limits.

Prior concern rejects same-instant/foreign-subject input, borrowed task responses
and appraisal leakage. Zero, unavailable and disabled remain different branches.
Its ratified precedent is transient character-state to attention, not TaskConcern
as general Affect. Candidate A remains a candidate; encoding suppression and
retrieval amplification remain separately manipulated effects.

Positive spatial projection excludes zero children, sibling bindings and diagnostic
archives. Earlier feedback influences encoding without becoming retained event
content. Prepared capabilities are consumed; detached trace values cannot mutate
owned evidence. Focal attribution selects the explicit prepared endpoint, not the
last/control trial or an assumed start child. Binding is not actual use.

Visual claim carriers transport actual admitted claims rather than truth and do
not let an owner allocate a second identity. Fallback visual detection is not
trial context; unsampled context and manufactured current cues remain forbidden.
These structural/component checks are separate from public producer/subject/
completion authentication, selected-capability admission and canonical persistence.
Later bounded GA evidence does not retroactively replace earlier source bytes.

Source REV273:11,234 assigned /139 unassigned;194,094 narrative /212,205 backing;
1,405 indexed backing resources. No historical writers or runtime tests rerun.
No model, law, allocation, verdict, corpus or obligation status changed. Source gaps,
post-cutoff joins and independent adequacy remain open. HQ-012 unstarted.
Campaign3 NOT EXIT-READY;108 verdicts;132 bounded clauses;55 /58 wrappers;
corpus0.29.0 /21. RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED.
''',encoding='utf-8',newline='\n')
rpath=P/'RESEARCH_OBLIGATIONS.json';r=load(rpath);obs=['RO-C3-008','RO-C3-010','RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
paths=[p.as_posix() for d in ['campaign3-history-spatial-feedback-controls-rev1','campaign3-history-source-roles-rev273'] for p in sorted((P/d).glob('*.json'))]+[cp.as_posix()]
for p in paths:
 assert p not in existing
 r['reportReviews'].append(dict(path=p,obligations=obs))
 for o in r['obligations']:
  if o['id'] in obs:o['evidence'].append(p)
rpath.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS: eight spatial feedback/visual claim receipts reconciled.
Start CAMPAIGN3_HISTORY_SPATIAL_FEEDBACK_CONTROLS_CHECKPOINT.md.
22 original narrative occurrences;205 string leaves;50 stored fault controls.
20 exact bindings;15 unresolved binding occurrences remain explicit.
Source REV273:11234 assigned /139 unassigned;194094 narrative /212205 backing;
1405 backing resources. Prior influence is not retained content;Candidate A unsettled.
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
