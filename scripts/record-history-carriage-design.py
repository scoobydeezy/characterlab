from pathlib import Path
import json
P=Path('docs/planning')
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(P/'campaign3-history-source-roles-rev231/check.json');assert c['assignedSources']==10950
cp=P/'CAMPAIGN3_HISTORY_CARRIAGE_DESIGN_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Carriage design and prediction authority history — 2026-10-08

**LOCAL DISPOSITION — no owner ruling.** HQ011 IN PROGRESS; counters **1519 / 0**.

Three records preserve116 original narrative occurrences. Exact acceptance links join
reviewed carriage materialization/qualification and packet evidence, plus the corrected
prediction authority. The formal prediction0.1 index is a historical composition, whose
occurrence portion is explicitly superseded by0.2; its shape-time pending vectors are
not current missing results or permission to ignore later component/public limits.

Carriage embeds the exact admitted203 with safe unit context. This distinguishes
permitted measurement content at a named evidence consumer without qualifying learned
state, ADAPT9b or a general cognitive response. Observer ownership differs from observed
subject metadata. An evidence-reference metadata index grants no payload lookup.
The governed payload-store alternative remains a possible future design requiring its
own ownership, availability, retention and resolution rules; it was not disproved.
Suppression produces neither202 nor zero nor negative evidence.

Three earlier proposals are explicitly withdrawn: a learning route for transient intake,
a replacement0.7 shared admission singleton, and a new original-input profile. Accepted
V07 is a separate narrow NoStateWrites registration, preserving the V04 singleton and
V04/V06 rows. Only occurrence-map data changes in the successor. Existing registered-
producer cross-version resolution does not broaden this intake's direct diagnostic branch.
The successor directly reuses the probe input profile; EVC-PACK-I requires equivalence
rather than assuming it from a reused label.

Actual host-reported production reaches shared ingress, which must find exactly one
consumer. Missing or duplicate matches for present203 reject; padding cannot repair them.
Only suppressed production gets profile-owned empty padding. Tracking remains the first
child, intake/padding the second, with separate owning associations. Six private/runtime
ordinal advances and eight generated children preserve paired topology; old-model
occurrence identities are not claimed byte-equal to successor identities.

The successor owns the changed complete phase120 trace envelope. Empty state ReadDomain
is compatible with governed payload admission and must not generate fictitious state
reads. Boundary saves archive exact historical203/337 without a new persistent learning
root or current-truth recomputation. Original-manifest scratch compilation authenticates
pending original sources; generated intake stages cannot survive at a boundary. Later
prefix-based profiles do not retroactively replace this profile's save contract.

Source REV231: 10,950 assigned /423 unassigned; 189,432 narrative /211,879 backing;
1,221 indexed backing resources. No new archive/source gap or runtime/test/build rerun.
No model, law, allocation, verdict, corpus or obligation status change. Prior gaps,
formula provenance, legacy log, post-cutoff joins and independent adequacy remain open.
HQ012 unstarted; Campaign3 NOT EXIT-READY. Counters1519/0;108 verdicts;
132 bounded clauses;55/58 wrappers;corpus0.29.0/21.
RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED. No owner ruling.
''',encoding='utf-8',newline='\n')
rpath=P/'RESEARCH_OBLIGATIONS.json';r=load(rpath);obs=['RO-C3-008','RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
paths=[p.as_posix() for d in ['campaign3-history-carriage-design-rev1','campaign3-history-source-roles-rev231'] for p in sorted((P/d).glob('*.json'))]+[cp.as_posix()]
for p in paths:
 assert p not in existing
 r['reportReviews'].append(dict(path=p,obligations=obs))
 for o in r['obligations']:
  if o['id'] in obs:o['evidence'].append(p)
rpath.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS: carriage design/prediction authority reconciled.
Start CAMPAIGN3_HISTORY_CARRIAGE_DESIGN_CHECKPOINT.md.
Three sources;116 narrative occurrences;withdrawn route/singleton/input proposals.
Carriage divergence remains distinct from learning;no runtime rerun.
Source REV231:10950 assigned /423 unassigned;189432 narrative /211879 backing;
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
