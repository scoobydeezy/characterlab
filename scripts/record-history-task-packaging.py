from pathlib import Path
import json
P=Path('docs/planning')
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(P/'campaign3-history-source-roles-rev224/check.json');assert c['assignedSources']==10925
cp=P/'CAMPAIGN3_HISTORY_TASK_PACKAGING_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Task shape and packaging historical reconciliation — 2026-10-08

**LOCAL DISPOSITION — no owner ruling.** HQ011 IN PROGRESS; counters **1519 / 0**.

Seven task shape/registration/packaging documents are reconciled, preserving all
176 original narrative occurrences and exact acceptance links to the corrected
key-role contract and separately reviewed lifecycle qualification.

The early role audit's broad PASS was withdrawn for two invalid declarations.
TaskKey371 is a record key: its fields use RecordField roles after exact grammar
validation. StateMapKey addresses the state root's field, not components inside a
record key. The corrected profile retains ten RecordField roles and zero new
StateMapKey roles. Existing IDN identity-atom roles remain unchanged. Table parity
was insufficient evidence of semantic ownership. Seven schemas,34 fields and14
member payloads remain unchanged; the erroneous373/2 metadata allocated no field.
No model had been frozen or activated when this correction was made.

Earlier exact-all-keys adoption, at-most-one target and empty content delegation
proposals are superseded by optional adoption,0..2 immutable targets and explicit
same-spec field delegation, including the laterfield13 correction. The registration
draft's DeliberationOpportunity input is absent from accepted lifecycle-only packaging.
Task content is never a Character, REG receives the actual qualified-character image,
and the third prospective route grants no authority over other state families.

A+D/P+S+D/D stage grammar retains separate group validation. All sources and targets
resolve before collision sealing and common B0 prior reads. Mandatory real/padding S,
private deadlines, exactly-once handlers and whole-instant rollback remain distinct.
One observation satisfying two tasks is not two independent sensory samples. Terminal
structural support is not generative proof; complete original-prefix replay and private
pending associations supply that separate obligation. No semantic lifecycle output,
new occurrence namespace or dummy cognitive handler fills omitted topology.

Three specimens and six Boolean controls produce192 construction combinations.
Adoption remains S0 data. Sixteen construction tests in review2 and17 in acceptance
have different scopes; neither is runtime TC-A..L qualification. The same normal model
digest across review revisions does not equate changed validation-source fingerprints.
The17-event ceiling against100 requires runtime accounting; prose alone is not proof.
Symbolic acceptance, corrected construction, freeze and runtime qualification remain
separate gates. PERSIST-I and whole Campaign2 closure are not supplied by these records.

Source REV224: 10,925 assigned /448 unassigned; 188,798 narrative /211,858 backing;
1,219 indexed backing resources. No new source gap/archive, runtime/test/build rerun,
model, law, allocation, verdict, corpus or obligation status change. Prior gaps,
formula provenance, legacy log, post-cutoff joins and independent adequacy remain open.
HQ012 unstarted; Campaign3 NOT EXIT-READY. Counters1519/0;108 verdicts;
132 bounded clauses;55/58 wrappers;corpus0.29.0/21.
RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED. No owner ruling.
''',encoding='utf-8',newline='\n')
rpath=P/'RESEARCH_OBLIGATIONS.json';r=load(rpath);obs=['RO-C3-008','RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
paths=[p.as_posix() for d in ['campaign3-history-task-packaging-rev1','campaign3-history-source-roles-rev224'] for p in sorted((P/d).glob('*.json'))]+[cp.as_posix()]
for p in paths:
 assert p not in existing
 r['reportReviews'].append(dict(path=p,obligations=obs))
 for o in r['obligations']:
  if o['id'] in obs:o['evidence'].append(p)
rpath.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS: task shape and packaging history reconciled.
Start CAMPAIGN3_HISTORY_TASK_PACKAGING_CHECKPOINT.md.
Seven sources;176 narrative occurrences; withdrawn key-role claim preserved.
Corrected construction and runtime qualification remain distinct; no runtime rerun.
Source REV224:10925 assigned /448 unassigned;188798 narrative /211858 backing;
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
