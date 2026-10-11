from pathlib import Path
import json
P=Path('docs/planning')
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(P/'campaign3-history-source-roles-rev232/check.json');assert c['assignedSources']==10954
cp=P/'CAMPAIGN3_HISTORY_MEMORY_ALLOCATION_REVIEW_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Carriage and memory allocation reviews — 2026-10-08

**LOCAL DISPOSITION — no owner ruling.** HQ011 IN PROGRESS; counters **1519 / 0**.

Four formal sources preserve129 original narrative occurrences. The accepted carriage
contract was compared against the previously reviewed revision3 draft; all differences
were inspected. Acceptance clarifies that the first V07 profile admits only the direct
authenticated diagnostic producer. Cross-version producer resolution does not broaden
consumer admission. Shape acceptance still requires separate numeric/model/runtime gates.

Carriage permanently allocates336..341,23 required fields,namespace1124,eight roles and
six members of existing families. Embedding203 does not allocate a second observation;
its existing1115 role is reused once. The new direct producer record has no union tag
or future wildcard. Existing NoStateWrites and finite ingress meanings are reused.
Allocation consistency alone does not pass carriage controls or demonstrate learning.

Memory permanently allocates342..355, two occurrence families1125/1126,15 text members
and14 record-field roles. Composite episode-key fields receive their own roles; an
identity-atom MapKey declaration cannot substitute for them. Cue351 and key344 are not
occurrences. No formation/padding identity, persistence certificate or canonical private
capability is added. Signed positive RecallDelay is distinct from its later model value.
Sole episode-entry ownership and non-removal remain separate from read projections.

Wrappers356..358 add nine required record/set fields and no identities, roles, union
tags or static-binding field. Empty sets remain required values. Each wrapper occupies
171.Definition rather than introducing another registry row; inner registration version
and wrapper grammar retain separate owners. External static bindings remain forbidden.

The original14-role packaging accounting is not the complete corrected packet count.
C2-MEM-PACK-002 added the missing IDN map-key role, yielding15 total additions while
leaving14 allocated memory roles and zero wrapper roles unchanged. The earlier blocked
packet was never admitted. Existing packet reconciliation preserves both exact cohorts.
Neither permanent numbering nor symbolic acceptance substitutes for runtime qualification.

Source REV232: 10,954 assigned /419 unassigned; 189,561 narrative /211,879 backing;
1,221 indexed backing resources. No new archive/source gap or runtime/test/build rerun.
No model, law, allocation, verdict, corpus or obligation status change. Prior gaps,
formula provenance, legacy log, post-cutoff joins and independent adequacy remain open.
HQ012 unstarted; Campaign3 NOT EXIT-READY. Counters1519/0;108 verdicts;
132 bounded clauses;55/58 wrappers;corpus0.29.0/21.
RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED. No owner ruling.
''',encoding='utf-8',newline='\n')
rpath=P/'RESEARCH_OBLIGATIONS.json';r=load(rpath);obs=['RO-C3-008','RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
paths=[p.as_posix() for d in ['campaign3-history-memory-allocation-review-rev1','campaign3-history-source-roles-rev232'] for p in sorted((P/d).glob('*.json'))]+[cp.as_posix()]
for p in paths:
 assert p not in existing
 r['reportReviews'].append(dict(path=p,obligations=obs))
 for o in r['obligations']:
  if o['id'] in obs:o['evidence'].append(p)
rpath.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS: formal carriage/memory allocation reviews reconciled.
Start CAMPAIGN3_HISTORY_MEMORY_ALLOCATION_REVIEW_CHECKPOINT.md.
Four sources;129 narrative occurrences;14 memory roles versus extra IDN role.
Wrapper/registration/version ownership and narrow V07 preserved;no runtime rerun.
Source REV232:10954 assigned /419 unassigned;189561 narrative /211879 backing;
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
