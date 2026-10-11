from pathlib import Path
import json
P=Path('docs/planning')
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(P/'campaign3-history-source-roles-rev292/check.json');assert c['assignedSources']==11315
cp=P/'CAMPAIGN3_HISTORY_DEVELOPMENT_ALLOCATION_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Development allocation copies — 2026-10-08

**LOCAL DISPOSITION — accepted declaration backing, not new qualification.**
HQ-011 in progress; no owner ruling. Counters **1519 / 0**.

The accepted allocation and both development archive copies are byte-identical.
All bind the same exact native contract. Sixteen schema1 records1493..1508 reuse
namespace1155; no schema/version/allocation amendment is needed. All387 string
leaves are accounted for, including short field names/domains and three original
accepted-status occurrences. No new backing resources or source gaps.

Learning and Formation flags remain independently represented. Skill/belief roots
are separate from personality and its formation history. Optional reports and
estimates preserve absent versus negative evidence and unknown versus known zero.
Formation entries preserve event-time phase, gain, contribution and applied delta;
current ageing must not refold old weights. Constitution stays separately owned
and immutable. DiagnosticRow data is not a writable cognitive leaf or admitted truth.

These are declarations. The linked native contract/qualification separately proves
actual writer ownership, safe observations, thirteen ordered handlers, independent
learning/formation, original lineage and Save132 restoration. The two development
cohorts, test-only typecheck correction and later harness resource failures remain
preserved in that evidence. No historical runtime or test rerun in this review.
Controlled phase0..4 is not calendar ageing, critical periods, all-domain plasticity
or a universal personality law. Younger learning and greater early personality
influence remain separate bounded effects; neither implies youth grants authorship.

REV292:11,315 assigned /58 unassigned;196,185 narrative /212,373 backing;
2,516 backing resources. No model, law, allocation, verdict, corpus or obligation
status changes. Remaining source support, dependent claims, post-cutoff joins and
independent adequacy remain open. HQ-012 unstarted; Campaign3 NOT EXIT-READY.
108 verdicts;132 bounded clauses;55 /58 wrappers;corpus0.29.0 /21.
RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED.
''',encoding='utf-8',newline='\n')
rpath=P/'RESEARCH_OBLIGATIONS.json';r=load(rpath);obs=['RO-C3-008','RO-C3-009','RO-C3-010','RO-C3-013','RO-C3-017','RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
paths=[p.as_posix() for d in ['campaign3-history-development-allocation-rev1','campaign3-history-source-roles-rev292'] for p in sorted((P/d).glob('*.json'))]+[cp.as_posix()]
for p in paths:
 assert p not in existing
 r['reportReviews'].append(dict(path=p,obligations=obs))
 for o in r['obligations']:
  if o['id'] in obs:o['evidence'].append(p)
rpath.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS: three development allocation copies reconciled.
Start CAMPAIGN3_HISTORY_DEVELOPMENT_ALLOCATION_CHECKPOINT.md.
Identical16-record tables and contract binding; independent learning/formation preserved.
Source REV292:11315 assigned /58 unassigned;196185 narrative /212373 backing;
2516 backing resources. No new source gap, backing resource or runtime replay.
Next: remaining material support, dependent-claim dispositions, post-cutoff joins and independent adequacy.
Include earlier gaps in final consolidation. HQ-012 unstarted.
Campaign3 NOT EXIT-READY. Counters1519 /0;108 verdicts;55 /58 wrappers;
132 bounded clauses;corpus0.29.0 /21. RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED.
All jobs terminal;no owner ruling.
'''
cur.write_text(old.decode('utf-8-sig').split('HQ-011 IN PROGRESS:')[0]+route,encoding='utf-8',newline='\n')
a=Path('AGENTS.md');s=a.read_text(encoding='utf-8-sig');needle='**Current routing (2026-10-08):**';pos=s.index(needle)
a.write_text(s[:pos]+needle+'\n'+route+'\n'+s[pos:].replace('**Current routing','**Prior routing',1),encoding='utf-8',newline='\n')
print(json.dumps(dict(reports=len(r['reportReviews']),added=len(paths),exactChronology=True)))
