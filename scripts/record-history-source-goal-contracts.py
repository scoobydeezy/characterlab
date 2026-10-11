from pathlib import Path
import json
P=Path('docs/planning')
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(P/'campaign3-history-source-roles-rev191/check.json');assert c['assignedSources']==10411
cp=P/'CAMPAIGN3_HISTORY_SOURCE_GOAL_CONTRACTS_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Requested source and goal contract reconciliation — 2026-10-08

**LOCAL DISPOSITION — no owner ruling.** HQ011 IN PROGRESS; counters **1519 /0**.

Eleven source,schedule,role,interoceptive,goal assessment/deadline contracts and the
owner's goal-relation decision/resolution reconciled:89 exact original narrative
occurrences. Formulas,examples and historical component evidence retain their scope.
No new test or runtime execution is claimed.

Unrequested surfaces are never sampled; requested-unavailable products still have
actual observation headers without a hidden failure reason. Present zero remains
present. Whole-run sweep/selection limits count requested work before visibility,
permission or capacity; prefix chunks cannot reset them. Role evidence derives from
actual same-experience bindings, not world IDs,position or selected winners. Shared
SEM experience does not manufacture visual detection from body evidence.

Sample-level and signal-group selectors remain distinct equal-priority comparators.
Grouping preserves every contradictory present view and rejects payload overflow
rather than truncating evidence. Shape/codec/one-use capability checks do not prove
physiological grouping,source authenticity or public admission.

The owner accepted conservative exact distance only in explicitly qualified metric
interval domains, preserving endpoint positions independently. Strict range separation
establishes closer/farther; equal singleton ranges establish SameDistance; valid overlap
is Assessed/IndeterminateRelation, distinct from Unavailable. The older packet's possible
outer-tag choice is superseded by that explicit resolution. Boundary-only remains a
simpler nonequivalent control. Distance is not importance,Need,utility or memory credit.

No source consequence means no reader or assessment occurrence; actual unavailable
assessment retains its occurrence. Scheduled deadline survives withdrawal and settles
AlreadyWithdrawn without a second lifecycle fact. Terminal owners cannot schedule
children; failed adoption discards its proposed deadline. Simultaneous assessment/
lifecycle remains outside this first source profile. Public gates remain separate.

SourceREV191:10,411 assigned/962 unassigned;131,702 narrative/211,268 backing;
1,192 indexed archives. Values post-cutoff reviews remain separate denominators.
Two Values/seven cognitive/80 exit-inventory/one scheduler identities,formula provenance,
legacy log,remaining material support and independent adequacy remain open. HQ012
unstarted;Campaign3 NOT EXIT-READY. No model/law/allocation/verdict/corpus/obligation
change.1519/0;108 verdicts;132 bounded;55/58 wrappers;corpus0.29.0/21.
RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED. No owner ruling.
''',encoding='utf-8',newline='\n')
rpath=P/'RESEARCH_OBLIGATIONS.json';r=load(rpath);obs=['RO-C3-014','RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
paths=[p.as_posix() for d in ['campaign3-history-source-goal-contracts-rev1','campaign3-history-source-roles-rev191'] for p in sorted((P/d).glob('*.json'))]+[cp.as_posix()]
for p in paths:
 assert p not in existing
 r['reportReviews'].append(dict(path=p,obligations=obs))
 for o in r['obligations']:
  if o['id'] in obs:o['evidence'].append(p)
rpath.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS:eleven requested-source/goal contracts reconciled.
Start CAMPAIGN3_HISTORY_SOURCE_GOAL_CONTRACTS_CHECKPOINT.md.
89 original narrative occurrences;owner metric/endpoint/indeterminate clarifications retained.
Unrequested/unavailable,presentzero,whole-run limits and explicit deadlines stay distinct.
SourceREV191:10411 assigned/962 unassigned;131702 narrative/211268 backing;
1192 archives. Values post-cutoff reviews retain separate denominators.
Open identities:two Values,seven cognitive,80 exit-inventory,one scheduler.
Next remaining material support,post-cutoff delta joins and independent adequacy.
Formula provenance and legacy log remain OPEN;HQ012 unstarted.
Campaign3 NOT EXIT-READY.1519/0;108 verdicts;55/58 wrappers;132 bounded;
corpus0.29.0/21. RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED.
All jobs terminal;no owner ruling.
'''
cur.write_text(old.decode('utf-8-sig').split('HQ-011 IN PROGRESS:')[0]+route,encoding='utf-8',newline='\n')
a=Path('AGENTS.md');s=a.read_text(encoding='utf-8-sig');needle='**Current routing (2026-10-08):**';pos=s.index(needle)
a.write_text(s[:pos]+needle+'\n'+route+'\n'+s[pos:].replace('**Current routing','**Prior routing',1),encoding='utf-8',newline='\n')
print(json.dumps(dict(reports=len(r['reportReviews']),added=len(paths),exactChronology=True)))
