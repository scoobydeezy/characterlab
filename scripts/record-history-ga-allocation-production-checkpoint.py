from pathlib import Path
import json
P=Path('docs/planning');O=P/'campaign3-history-ga-allocation-production-rev1';I=P/'campaign3-history-source-roles-rev154'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(O/'check.json');i=load(I/'check.json');assert c['freshPassingAssertions']==10 and i['assignedSources']==9857
cp=P/'CAMPAIGN3_HISTORY_GA_ALLOCATION_PRODUCTION_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# GA allocation and replenishment evidence — 2026-10-07

**LOCAL DISPOSITION — no owner ruling required.** HQ-011 remains open.
Counters **1519 / 0**. Seven sources;477 JSON string leaves;14 narrative/303
backing occurrences;four exact source bindings;one recovered historical module.

Five focused assertions pass against current localReserveSource and again with the
exact historical module loaded at its original module path. Git commit
6d54d35f3c612154658c6f9316f6f7e04071865b contains the original reviewer SHA
f91568689006686f00882444cb6313858a07da8c98cbb6f483f6bf9baa059b08.
Other imported modules remain current; this is not a complete historical environment
replay. All three original source mutation bodies are detected against that pinned
module. No production code or original report was changed.

GOA-A allocates23 source ordinals,three role claims,two selectors,two acquisitions:
30 total. Eleven supporting observations share one experience; three body groups
contain three views each and visual formation contains three children. GOA-B requests
the same unavailable surfaces:15 source ordinals plus two empty selectors,total17,
with no experience/acquisition. These are component allocator counts,not work ceilings
or canonical runtime allocation-slot proof. The initial two GOA tests failed source
construction with invalid source symbol. Their corrected successors retain both names.

LRP-A preserves stored80@0 separately from materialized70@10;delivery40 applies30,
overflows10 and anchors100@10. Old source and sibling reserves remain unchanged.
LRP-B zero delivery still anchors70@10;mutating a detached result cannot change the
source,and observations expose only the safe signal shape. LRP-C rejects invalid
target/time/delivery without mutation. The original faults replace the prior anchor,
skip zero reanchoring or mutate the prior map;each fails the intended named witness.

The first historical52-test receipt has49 passes and three new LRP setup failures:
the fixture lacked three real mapped reserves. The corrected receipt passes the same
52 names. This preserves the source admission rule;it is not a replenishment-law
failure. Only the five focused assertions per source version were freshly rerun here.
Neither trusted-source tests nor safe result shape qualify public physical-key
authority,phase110 scheduling,canonical patches,trace exclusion or persistence.

SourceREV154:9,857 assigned/1,516 unassigned;17,948 narrative/183,417 backing;
919 outside-census artifacts. Prior roles and artifacts unchanged;counts not adequacy.
Next accessor and registration carrier/compiler evidence,then remaining historical
authority reconciliation. Formula343/Values90/15,formula pin,legacy log and earlier
historical exclusions remain separate. HQ012 unstarted;exitAuditREV111 unchanged.
Campaign3 NOT EXIT-READY;108 verdicts;132 bounded clauses;55/58 wrappers;corpus0.29.0/21.
No model,allocation,verdict,corpus or obligation status changed. All jobs terminal.
''',encoding='utf-8',newline='\n')
rpath=P/'RESEARCH_OBLIGATIONS.json';r=load(rpath);obs=['RO-C3-002','RO-C3-003','RO-C3-004','RO-C3-005','RO-C3-006','RO-C3-007','RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
paths=[x.as_posix() for x in sorted(O.glob('*.json'))]+[(I/n).as_posix() for n in ['index.json','check.json']]+[cp.as_posix()]
for p in paths:
 assert p not in existing
 r['reportReviews'].append(dict(path=p,obligations=obs))
 for o in r['obligations']:
  if o['id'] in obs:o['evidence'].append(p)
rpath.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS: GA allocation/replenishment history reconciled.
Start CAMPAIGN3_HISTORY_GA_ALLOCATION_PRODUCTION_CHECKPOINT.md.
Seven sources;ten focused assertions across current/exact historical source;three
original mutants detected. GOA30/17 occurrence counts;prior/materialized/new anchor
and zero reanchor remain distinct. Both failed fixture cohorts preserved.
Four exact bindings;one Git-recovered module;no missing bytes. Other imports current.
SourceREV154:9857 assigned/1516 unassigned;17948 narrative/183417 backing;919 artifacts.
Next accessor and registration carrier/compiler evidence. All jobs terminal.
Formula343/Values90/15 separate;formula pin,legacy log and earlier exclusions OPEN.
Counts not adequacy. HQ012 unstarted;exitAuditREV111 unchanged.
Campaign3 NOT EXIT-READY.1519/0;108 verdicts;55/58 wrappers;132 bounded;corpus0.29.0/21.
RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED. No owner ruling or obligation closure.
'''
cur.write_text(old.decode('utf-8-sig').split('HQ-011 IN PROGRESS:')[0]+route,encoding='utf-8',newline='\n')
a=Path('AGENTS.md');s=a.read_text(encoding='utf-8-sig');needle='**Current routing (2026-10-07):**';pos=s.index(needle)
a.write_text(s[:pos]+needle+'\n'+route+'\n'+s[pos:].replace('**Current routing','**Prior routing',1),encoding='utf-8',newline='\n')
print(json.dumps(dict(reports=len(r['reportReviews']),added=len(paths),exactChronology=True)))
