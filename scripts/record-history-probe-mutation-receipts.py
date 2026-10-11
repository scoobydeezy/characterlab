from pathlib import Path
import json
P=Path('docs/planning')
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(P/'campaign3-history-source-roles-rev248/check.json');assert c['assignedSources']==11059
cp=P/'CAMPAIGN3_HISTORY_PROBE_MUTATION_RECEIPTS_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Probe mutation and source-audit receipts — 2026-10-08

**LOCAL DISPOSITION — no owner ruling.** HQ011 IN PROGRESS; counters **1519 / 0**.

Five receipts preserve20 original narrative and170 backing occurrences; all425 string
leaves are accounted for, including short test states and diagnostic errors. All ten
reported source bindings match current bytes. This verifies identity, not timestamps
or a fresh runtime execution. Historical writers were read but not run.

The15-test runtime baseline and seven mutants retain failure counts1/1/3/2/1/1/3.
The one-test scalar pair has12 detected substitutions; the one-test generic numeric
cohort has four. These denominators are separate. Generic signed-domain tests do not
admit a broader public model, and passing assertions inside a mutant cohort do not
qualify the mutant's semantics.

The other-character mutant constructs a malformed character referent. Its actual error
is origin-shape rejection, not ReadDomain rejection of a different valid character key.
That narrower disposition is preserved under RO008/019/020/021; this receipt cannot be
used as a valid-alternative-character witness. Wider capability claims require their
own qualifying controls. The other-variable case likewise does not qualify a second
variable model. No existing frozen report is rewritten or test repaired retroactively.

Padding and SEM isolation audits reject six source substitutions each through exact
TypeScript AST/printer shape checks. They are source qualification, not twelve public
runtime failures or proofs against arbitrary host-code changes. Padding budgets and
later sentinel behavior, paired learning-byte equality and admitted EVID boundaries
remain separately evidenced.

Source REV248:11,059 assigned /314 unassigned;191,514 narrative /212,202 backing;
1,241 indexed backing resources. No new archive/source gap, runtime/test/build rerun,
model, law, allocation, verdict, corpus or obligation status change. Formula provenance,
legacy log, post-cutoff joins and independent adequacy remain open. HQ012 unstarted;
Campaign3 NOT EXIT-READY.1519/0;108 verdicts;132 bounded clauses;55/58 wrappers;
corpus0.29.0/21. RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED.
''',encoding='utf-8',newline='\n')
rpath=P/'RESEARCH_OBLIGATIONS.json';r=load(rpath);obs=['RO-C3-008','RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
paths=[p.as_posix() for d in ['campaign3-history-probe-mutation-receipts-rev1','campaign3-history-source-roles-rev248'] for p in sorted((P/d).glob('*.json'))]+[cp.as_posix()]
for p in paths:
 assert p not in existing
 r['reportReviews'].append(dict(path=p,obligations=obs))
 for o in r['obligations']:
  if o['id'] in obs:o['evidence'].append(p)
rpath.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS: probe mutation and source-audit receipts reconciled.
Start CAMPAIGN3_HISTORY_PROBE_MUTATION_RECEIPTS_CHECKPOINT.md.
Five sources;20 narrative/170 backing occurrences;425strings;10exact source bindings.
Malformed other-character mutant has narrower claim; source audits/runtime kept separate.
Source REV248:11059 assigned /314 unassigned;191514 narrative /212202 backing;
1241 backing resources. Values post-cutoff reviews retain separate denominators.
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
