from pathlib import Path
import json
P=Path('docs/planning')
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(P/'campaign3-history-source-roles-rev254/check.json');assert c['assignedSources']==11123
cp=P/'CAMPAIGN3_HISTORY_ACQUISITION_CREDIT_DECISIONS_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Historical acquisition and credit decisions — 2026-10-08

**LOCAL DISPOSITION — no owner ruling.** HQ011 IN PROGRESS; counters **1519 / 0**.

Eleven sources preserve177 exact original narrative occurrences. The original deferred
encoding recommendation was explicitly superseded by lifecycle B: encode from then-
available evidence, then append later consolidation without rewriting initial content.
A later same-barrier ruling clarifies that valid formation can commit with immediate
complete loss. Historical acquisition is not current recallability or transient access.
Failure commits neither new disposition and preserves prior state/history.

Attribution eligibility, perceived effect, actual retained-memory use, protection and
outcome significance remain separate. Same safe bins can conceal Applied10 versus1;
pressure relief is not hidden realized effect. Temporal adjacency alone earns no causal
credit. Authenticated evidence may still support objectively false attribution.

Successful committed use can return Supported or Unavailable. Credit follows the exact
semantically consumed child: an early exit after alpha does not credit beta or its
co-acquired siblings. Byte-equal detached evidence can give the same answer without
retained-use protection. Recall/display/validation alone earn no such protection.
The first accepted consumer uses previously committed children before later retention.

Component scheduler witnesses preserve common-B0 reads, terminal140 members and atomic
rollback. They do not authenticate public source/subject/PRJ or grant canonical memory
admission. The eight-entry fixture history is not a lifetime forgetting/compaction law.
The rational alias and validation-via-assessment corrections remain recorded, and supplied
retrieval ordering reversals do not become winner-set changes. Later bounded GA evidence
supersedes old routing only within its qualified scope, without selecting universal laws.

Source REV254:11,123 assigned /250 unassigned;192,175 narrative /212,202 backing;
1,292 indexed backing resources. No new archive/source gap, runtime/test/build rerun,
model, law, allocation, verdict, corpus or obligation status change. Formula provenance,
legacy log, post-cutoff joins and independent adequacy remain open. HQ012 unstarted;
Campaign3 NOT EXIT-READY.1519/0;108 verdicts;132 bounded clauses;55/58 wrappers;
corpus0.29.0/21. RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED.
''',encoding='utf-8',newline='\n')
rpath=P/'RESEARCH_OBLIGATIONS.json';r=load(rpath);obs=['RO-C3-008','RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
paths=[p.as_posix() for d in ['campaign3-history-acquisition-credit-decisions-rev1','campaign3-history-source-roles-rev254'] for p in sorted((P/d).glob('*.json'))]+[cp.as_posix()]
for p in paths:
 assert p not in existing
 r['reportReviews'].append(dict(path=p,obligations=obs))
 for o in r['obligations']:
  if o['id'] in obs:o['evidence'].append(p)
rpath.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS: acquisition lifecycle and credit decisions reconciled.
Start CAMPAIGN3_HISTORY_ACQUISITION_CREDIT_DECISIONS_CHECKPOINT.md.
Eleven sources;177 original narrative occurrences. Acquisition/loss, attribution,
consumed-use protection and outcome significance retain distinct evidence boundaries.
Source REV254:11123 assigned /250 unassigned;192175 narrative /212202 backing;
1292 backing resources. Values post-cutoff reviews retain separate denominators.
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
