from pathlib import Path
import json
P=Path('docs/planning')
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(P/'campaign3-history-source-roles-rev290/check.json');assert c['assignedSources']==11308
cp=P/'CAMPAIGN3_HISTORY_TASK_FREEZE_LINEAGE_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Task declaration freeze lineage — 2026-10-08

**LOCAL DISPOSITION — construction and lifecycle execution remain distinct.**
HQ-011 in progress; no owner ruling. Counters **1519 / 0**.

Four sources preserve the initial declaration review, its successor/copy and the
separate accepted freeze. Only taskDeclarations and its test source fingerprint
change between reviews. Five model/control files are identical across all three
packets. The freeze retains the baseline digest, complete bundle/profiles, six
file commitments and separate canonical-source/construction-evidence identities.

Three specimens and all64 inherited Boolean combinations yield192 distinct stored
model identities. These are construction variants, not192 runtime trajectories.
Eight check descriptions summarize compilation;193 preservation fingerprints are
not193 behavioral tests. The budget17 is explicitly derived as14+1+2, under ceiling100;
actual deadline/event accounting and authored overload remain runtime obligations.
No historical materializer, codec or runtime was executed for this reconciliation.

The accepted scope has separate task/character kinds, seven schemas, thirteen
registry rows/descriptors, ten record-field roles and zero new state-map-key roles.
Lifecycle output closures are empty. Workspace/appraisal/motives/options are absent.
Both private deadlines must count after original inputs regardless of adoption.
The freeze authorizes implementation while TC-A..L remains not passed at that point.
Later lifecycle qualification supplies separately scoped runtime/rollback/restore
proof; a declaration PASS cannot replace it. Shared-criterion validation corrections
retain their distinct construction source identities without changing model bytes.

623 binding occurrences resolve exactly. Two old initial-review identities remain
unresolved: taskDeclarations.ts at2f8b461b and its test at63300f4f. Current/indexed
backing and census hashes were checked; no global absence or source-exact historical
rerun is claimed. Preserve these in final gap/dependent-claim reconciliation.
47 narrative/51 backing occurrences and all1,557 string leaves retain scope.
Eight existing backing resources newly indexed.

REV290:11,308 assigned /65 unassigned;196,167 narrative /212,372 backing;
2,491 backing resources. No model, law, allocation, verdict, corpus or obligation
status changes. Earlier gaps, post-cutoff joins and independent adequacy remain open.
HQ-012 unstarted; Campaign3 NOT EXIT-READY.108 verdicts;132 bounded clauses;
55 /58 wrappers;corpus0.29.0 /21. RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED.
''',encoding='utf-8',newline='\n')
rpath=P/'RESEARCH_OBLIGATIONS.json';r=load(rpath);obs=['RO-C3-008','RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
paths=[p.as_posix() for d in ['campaign3-history-task-freeze-lineage-rev1','campaign3-history-source-roles-rev290'] for p in sorted((P/d).glob('*.json'))]+[cp.as_posix()]
for p in paths:
 assert p not in existing
 r['reportReviews'].append(dict(path=p,obligations=obs))
 for o in r['obligations']:
  if o['id'] in obs:o['evidence'].append(p)
rpath.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS: four task declaration/freeze sources reconciled.
Start CAMPAIGN3_HISTORY_TASK_FREEZE_LINEAGE_CHECKPOINT.md.
192 stored construction identities; derived17-event budget; unchanged model bytes.
623 exact bindings/two old construction-source gaps; no new runtime replay.
Source REV290:11308 assigned /65 unassigned;196167 narrative /212372 backing;
2491 backing resources. Qualification remains separately scoped.
Next: remaining material support, dependent-claim dispositions, post-cutoff joins and independent adequacy.
Include earlier/new gaps in final consolidation. HQ-012 unstarted.
Campaign3 NOT EXIT-READY. Counters1519 /0;108 verdicts;55 /58 wrappers;
132 bounded clauses;corpus0.29.0 /21. RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED.
All jobs terminal;no owner ruling.
'''
cur.write_text(old.decode('utf-8-sig').split('HQ-011 IN PROGRESS:')[0]+route,encoding='utf-8',newline='\n')
a=Path('AGENTS.md');s=a.read_text(encoding='utf-8-sig');needle='**Current routing (2026-10-08):**';pos=s.index(needle)
a.write_text(s[:pos]+needle+'\n'+route+'\n'+s[pos:].replace('**Current routing','**Prior routing',1),encoding='utf-8',newline='\n')
print(json.dumps(dict(reports=len(r['reportReviews']),added=len(paths),exactChronology=True)))
