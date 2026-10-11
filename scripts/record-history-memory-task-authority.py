from pathlib import Path
import json
P=Path('docs/planning')
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(P/'campaign3-history-source-roles-rev233/check.json');assert c['assignedSources']==10957
cp=P/'CAMPAIGN3_HISTORY_MEMORY_TASK_AUTHORITY_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Formal memory and task authority — 2026-10-08

**LOCAL DISPOSITION — no owner ruling.** HQ011 IN PROGRESS; counters **1519 / 0**.

Three formal sources preserve79 original narrative occurrences, with exact acceptance
links to the reviewed memory and task packaging/qualification and task key-role correction.
Historical shape acceptance supersedes pending proposal wording only at that stage;
it does not supply allocation, materialization or runtime evidence by itself.

Memory retains and recalls historical observer-safe measurements. It does not infer
current truth, belief, reward or appraisal. Formation alone owns insert-only episode
writes through PRJ/IDN; recall authorizes the exact subject-owned key before access.
The existing topology semantic version remains unchanged while episodic storage data
changes. Projection collections stay owned by their transition contract, with concrete
wrapper serialization resolved separately. No new private-capability certificate or
cue/episode/formation/padding occurrence is licensed by the formal composition index.

The task contract supersedes early draft ambiguity with optional adoption,0..2 overlapping
tasks, explicit field13 spec delegation and no stored duplicate deadline. Immutable
source/holder/criterion/window resolution precedes stage collision checking, then prior
reads. One admitted observation may satisfy two tasks without becoming two sensory
samples. All declared tasks receive private deadline slots irrespective of adoption.
The task0.1 map-key role wording is explicitly superseded by the0.2 record-key correction;
it is not current permission for the rejected StateMapKey373 declarations.

Numeric task criteria admit any canonical rational endpoints in[0,10], while observed
points remain on the predecessor's tenths grid. There is no snapping or REG conversion.
Reading satisfaction is inclusive; temporal eligibility is half-open, and the clock
requires exact equality at its deadline. Quiescent expiry follows legitimate settlement,
not a premature pre-handler rejection. Key order supplies no psychological magnitude.
No pressure, forecast accumulator, countdown, host clock or calibration is introduced.

The17-event design bound retains14 predecessor work plus one measurement settlement and
at most two deadlines. This numeric-profile statement was not then an executed runtime
witness. Arbitrary authored overload still fails at100 with rollback; deadlines are not
exempted. Later scoped qualification supplies actual execution evidence, while dynamic
adoption, social causes, efficacy and wider cognition remain separate requirements.

Source REV233: 10,957 assigned /416 unassigned; 189,640 narrative /211,879 backing;
1,221 indexed backing resources. No new archive/source gap or runtime/test/build rerun.
No model, law, allocation, verdict, corpus or obligation status change. Prior gaps,
formula provenance, legacy log, post-cutoff joins and independent adequacy remain open.
HQ012 unstarted; Campaign3 NOT EXIT-READY. Counters1519/0;108 verdicts;
132 bounded clauses;55/58 wrappers;corpus0.29.0/21.
RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED. No owner ruling.
''',encoding='utf-8',newline='\n')
rpath=P/'RESEARCH_OBLIGATIONS.json';r=load(rpath);obs=['RO-C3-008','RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
paths=[p.as_posix() for d in ['campaign3-history-memory-task-authority-rev1','campaign3-history-source-roles-rev233'] for p in sorted((P/d).glob('*.json'))]+[cp.as_posix()]
for p in paths:
 assert p not in existing
 r['reportReviews'].append(dict(path=p,obligations=obs))
 for o in r['obligations']:
  if o['id'] in obs:o['evidence'].append(p)
rpath.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS: formal memory/task authority reconciled.
Start CAMPAIGN3_HISTORY_MEMORY_TASK_AUTHORITY_CHECKPOINT.md.
Three sources;79 narrative occurrences;corrected task key roles preserved.
Measurement grid, rational criteria and temporal window stay distinct;no rerun.
Source REV233:10957 assigned /416 unassigned;189640 narrative /211879 backing;
1221 backing resources. Values post-cutoff reviews retain separate denominators.
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
