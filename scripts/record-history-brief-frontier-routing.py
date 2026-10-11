from pathlib import Path
import json
P=Path('docs/planning')
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(P/'campaign3-history-source-roles-rev302/check.json');assert c['assignedSources']==11342
cp=P/'CAMPAIGN3_HISTORY_BRIEF_FRONTIER_ROUTING_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Historical Brief frontier routing — 2026-10-08

**LOCAL DISPOSITION — complete dated routing, no new qualification.**
HQ-011 in progress; no owner ruling. Counters **1519 / 0**.

The intake retains all132 exact REV9 clauses across15 families. Its source quotations,
family rationales, clause statuses, evidence and obligations are unchanged. Each clause
has one primary package among13:45 bounded clauses PRESERVE;39 partial and48 blocked
clauses RESEARCH. Agency before goals was a dependency/invalidation-risk choice, not
Campaign4 reduction ranking. Skill remains a preservation control. Routing does not
admit implementation, choose a final law, qualify a family or waive the corpus gate.

A document-level crosswalk joins every clause to frozen REV111, which retains every
clause text and records132 bounded claims. It preserves each later rationale and
current evidence-file hash without asserting those later bytes were the intake's
original evidence or independently proving their scientific adequacy. In particular,
component, public, observer-relative, joint-family and lifetime claims remain distinct.

Six of seven original source commitments match. The historical mechanism-ledger hash
f1fb6c4d8fe5c224987e3c541eface3f91f860e66874ab581a0d87f4e83c809d remains unresolved
in the named current path, indexed backing and census hashes. This limits exact-source
reproduction of that planning dependency; no current version is substituted. Wider
recovery and dependent-claim disposition remain due before final history closure.

Preserve first review output: its copied source-role label incorrectly named a habit
cohort. Authoritative review REV2 corrects that label and carries the first receipt;
clause results, source bindings and occurrence counts are unchanged.250 narrative/
131 backing occurrences and all1,778 string leaves retain identity. No new backing
resource or runtime run. Original intake and all old evidence remain unchanged.

Source index REV302:11,342 assigned /31 unassigned;198,115 narrative /212,699 backing;
2,773 backing resources. No model, allocation, verdict, corpus or obligation status
change. Remaining sources, dependent claims, post-cutoff joins and independent adequacy
remain open. HQ-012 unstarted; Campaign3 NOT EXIT-READY.
108 verdicts;132 bounded clauses;55 /58 wrappers;corpus0.29.0 /21.
RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED.
''',encoding='utf-8',newline='\n')
rpath=P/'RESEARCH_OBLIGATIONS.json';r=load(rpath);obs=['RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
paths=[p.as_posix() for d in ['campaign3-history-brief-frontier-routing-rev1','campaign3-history-brief-frontier-routing-rev2','campaign3-history-source-roles-rev302'] for p in sorted((P/d).glob('*.json'))]+[cp.as_posix()]
for p in paths:
 assert p not in existing
 r['reportReviews'].append(dict(path=p,obligations=obs))
 for o in r['obligations']:
  if o['id'] in obs:o['evidence'].append(p)
rpath.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS: historical Brief frontier routing reconciled.
Start CAMPAIGN3_HISTORY_BRIEF_FRONTIER_ROUTING_CHECKPOINT.md.
132 exact REV9 clauses/15 families;45 preserve/87 research routes across13 packages.
Later bounded claims joined only at document level. Six source hashes match; one ledger gap.
Review REV2 corrects preserved copied role label; original evidence unchanged.
Source REV302:11342 assigned /31 unassigned;198115 narrative /212699 backing;
2773 backing resources. No new backing or runtime run.
Next: remaining material support, dependent-claim dispositions, post-cutoff joins and independent adequacy.
Recheck earlier gaps against expanded backing index. HQ-012 unstarted.
Campaign3 NOT EXIT-READY. Counters1519 /0;108 verdicts;55 /58 wrappers;
132 bounded clauses;corpus0.29.0 /21. RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED.
All jobs terminal;no owner ruling.
'''
cur.write_text(old.decode('utf-8-sig').split('HQ-011 IN PROGRESS:')[0]+route,encoding='utf-8',newline='\n')
a=Path('AGENTS.md');s=a.read_text(encoding='utf-8-sig');needle='**Current routing (2026-10-08):**';pos=s.index(needle)
a.write_text(s[:pos]+needle+'\n'+route+'\n'+s[pos:].replace('**Current routing','**Prior routing',1),encoding='utf-8',newline='\n')
print(json.dumps(dict(reports=len(r['reportReviews']),added=len(paths),exactChronology=True)))
