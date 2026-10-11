from pathlib import Path
import json
P=Path('docs/planning')
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(P/'campaign3-history-source-roles-rev178/check.json');assert c['assignedSources']==10298
cp=P/'CAMPAIGN3_HISTORY_COGNITIVE_CONTRACTS_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Historical cognitive contracts — 2026-10-08

**LOCAL DISPOSITION — no owner ruling.** HQ011 IN PROGRESS. Counters **1519 /0**.

Thirteen full Markdown documents reconciled: four formal path/model/allocation/leaf
roots and nine whole-shape, cohort, numeric, stage, work, persistence, coupling,
trace and failure plans.175 original narrative occurrences retain their exact
source identities, text and locations. Short headings/tables were also read.
Shape, allocation and packaging acceptance remain separate from executed qualification.
Later qualification/preservation/PERSIST-I evidence is linked with its own scope;
the remaining component manifest is not transitively accepted by those links.

Preserve the physical instruction-leaf omission and separate correction: no model
was frozen or activated with the incomplete topology;103 base members plus one
separate addition did not renumber prior commitments. Immutable instruction,
task lifecycle and identity-history ownership stay distinct. Source-exclusive
probe/cognition,21 exact recipes,27-event bound and64-entry history are finite scope,
not generic architecture limits or psychological laws. Actual hashes/draws and PMF
combinations are not scheduler events. Chronological ties-to-even cannot be replaced
with final rounding or independently rounded increments.

Persistence state-ID projection differs from the consumed-address ledger: a genuine
zero-meaning roll still consumes addresses. Failed runs remain terminal; retry means
fresh authenticated prefix reconstruction after removing test injection. Diagnostic
attempts are not committed evidence. First-profile natural addresses exclude comparison
maps; equal seed alone does not establish pairing after output topology diverges.
The broader substrate map capability remains retained. Unknown, zero, no active reasons,
no options, rejected identity and infrastructure failure remain distinct.

SourceREV178:10,298 assigned/1,075 unassigned;130,045 narrative/211,150 backing;
1,190 indexed outside-census artifacts.80 unresolved exit-inventory identities and
one separate earlier scheduler identity remain open. Formula provenance, legacy log,
Values90/15, exclusions and independent adequacy remain open. No original source,
production code, verdict, law, corpus or obligation status changed. No runtime tests
or old assay writers rerun for this bookkeeping review.

Next remaining component contracts and planning reviews, then independent adequacy.
HQ012 unstarted; Campaign3 NOT EXIT-READY.108 verdicts;132 bounded clauses;
55/58 wrappers;corpus0.29.0/21. RO019 ACTIVE;RO021 CONDITIONAL, mandatory and
UNSATISFIED;RO022 CLOSED. No user decision required.
''',encoding='utf-8',newline='\n')
rpath=P/'RESEARCH_OBLIGATIONS.json';r=load(rpath);obs=['RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
paths=[p.as_posix() for d in ['campaign3-history-cognitive-contracts-rev1','campaign3-history-source-roles-rev178'] for p in sorted((P/d).glob('*.json'))]+[cp.as_posix()]
for p in paths:
 assert p not in existing
 r['reportReviews'].append(dict(path=p,obligations=obs))
 for o in r['obligations']:
  if o['id'] in obs:o['evidence'].append(p)
rpath.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS:13 cognitive contract roots/plans reconciled.
Start CAMPAIGN3_HISTORY_COGNITIVE_CONTRACTS_CHECKPOINT.md.
175 original narrative occurrences;shape/allocation/packaging versus runtime
qualification preserved. Physical leaf omission/correction, terminal failed-run
reconstruction, state-ID versus draw ledger and natural-only coupling explicit.
No transitive component-manifest acceptance or fresh runtime qualification.
SourceREV178:10298 assigned/1075 unassigned;130045 narrative/211150 backing;
1190 indexed archives.80 exit-inventory gaps plus one scheduler identity OPEN.
Next remaining component contracts/planning roles,then independent adequacy.
Formula historical identity,legacy log,Values90/15 and exclusions OPEN.
HQ012 unstarted;Campaign3 NOT EXIT-READY.1519/0;108 verdicts;55/58 wrappers;
132 bounded;corpus0.29.0/21. RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED.
No owner ruling.
'''
cur.write_text(old.decode('utf-8-sig').split('HQ-011 IN PROGRESS:')[0]+route,encoding='utf-8',newline='\n')
a=Path('AGENTS.md');s=a.read_text(encoding='utf-8-sig');needle='**Current routing (2026-10-08):**';pos=s.index(needle)
a.write_text(s[:pos]+needle+'\n'+route+'\n'+s[pos:].replace('**Current routing','**Prior routing',1),encoding='utf-8',newline='\n')
print(json.dumps(dict(reports=len(r['reportReviews']),added=len(paths),exactChronology=True)))
