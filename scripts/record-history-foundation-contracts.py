from pathlib import Path
import json
P=Path('docs/planning')
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(P/'campaign3-history-source-roles-rev308/check.json');assert c['assignedSources']==11363
cp=P/'CAMPAIGN3_HISTORY_FOUNDATION_CONTRACTS_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Foundational contract scope — 2026-10-11

**LOCAL DISPOSITION — accepted semantics and historical limits reconciled.**
HQ-011 in progress; no owner ruling. Counters **1519 / 0**.

The deterministic substrate requires full structural model/run manifests and separates
research identity from execution. Digests do not replace structure or establish timing.
Canonical field/collection order,exact domains/rounding/failure and addressed randomness
remain authoritative. The two-attempt/fresh-fallback bias bounds depend on the stated
ideal-candidate assumption; they do not prove SHA256 uniformity. Explicit coupling is
run input, not a second random oracle. Analytical reads remain nonmutating; signed
floor/remainders,checked time and T-forward ordering preserve partition semantics.

The old Section7 sentence leaves TIME001/MATH001 pending. Section9 and the accepted
OPEN_DECISIONS closure supersede that status explicitly; it is not an owner blocker.
Candidate identifiers remain immutable. Full continuation includes all authoritative
state; the later public-wrapper metadata barriers remain separately qualified.

Observation0.1 admits exact known-bound scalar channels,deterministic missingness and
point/directional-bound evidence. Signed zero-at-boundary rejects; polarity-specific
zero bounds are legal. Hidden overflow cannot select evidence kind. ExactEffectControl
is an explicitly omniscient experimental control. This seam does not learn or mutate
persistent cognition and does not establish noisy sensors or uncertain bounds.

Token projection requires channel-established identity; earliest-visible-slot dedup
cannot represent general multi-role event binding. The truth-record reference is
accepted only for the one-effect fixture,not general cross-event access. Actual-read
provenance wording is constrained by the closed evidence schema,forbidden truth paths
and omniscient trace ownership. It grants no permission to publish raw truth paths to
cognition. General reference replacement,recognition and later timing lanes retain
SEM001 and subsequent contracts' separate authority and proof burden.

Two full sources preserve175 original narrative occurrences across37 sections. No
original contract,implementation,verdict or allocation changed. No runtime/tests rerun.
REV308:11,363 assigned /10 unassigned;198,363 narrative /212,699 backing;
2,803 backing resources. Remaining semantic/allocation/ADAPT/chronological sources,
consolidated gaps,dependent claims,post-cutoff joins and independent adequacy remain.
HQ-012 unstarted; Campaign3 NOT EXIT-READY.108 verdicts;132 bounded clauses;
55 /58 wrappers;corpus0.29.0 /21. RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED.
''',encoding='utf-8',newline='\n')
rpath=P/'RESEARCH_OBLIGATIONS.json';r=load(rpath);obs=['RO-C3-008','RO-C3-010','RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
paths=[p.as_posix() for d in ['campaign3-history-foundation-contracts-rev1','campaign3-history-source-roles-rev308'] for p in sorted((P/d).glob('*.json'))]+[cp.as_posix()]
for p in paths:
 assert p not in existing
 r['reportReviews'].append(dict(path=p,obligations=obs))
 for o in r['obligations']:
  if o['id'] in obs:o['evidence'].append(p)
rpath.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS: deterministic substrate/observation contracts reconciled.
Start CAMPAIGN3_HISTORY_FOUNDATION_CONTRACTS_CHECKPOINT.md.
175 original paragraphs/37 sections; accepted time closure supersedes old pending sentence.
Restricted observation truth handle is not general cross-event evidence or raw-path permission.
Source REV308:11363 assigned /10 unassigned;198363 narrative /212699 backing;
2803 backing resources. No runtime/test rerun or original-source change.
Next: semantic/allocation/ADAPT/chronological sources,consolidated gaps and independent adequacy.
Dependent claims/post-cutoff joins remain open. HQ-012 unstarted. Campaign3 NOT EXIT-READY.
Counters1519 /0;108 verdicts;55 /58 wrappers;132 bounded clauses;corpus0.29.0 /21.
RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED. All jobs terminal;no owner ruling.
'''
cur.write_text(old.decode('utf-8-sig').split('HQ-011 IN PROGRESS:')[0].replace('Updated2026-10-08','Updated2026-10-11')+route,encoding='utf-8',newline='\n')
a=Path('AGENTS.md');s=a.read_text(encoding='utf-8-sig');needle='**Current routing (2026-10-11):**';pos=s.index(needle)
a.write_text(s[:pos]+'**Current routing (2026-10-11):**'+'\n'+route+'\n'+s[pos:].replace('**Current routing','**Prior routing',1),encoding='utf-8',newline='\n')
print(json.dumps(dict(reports=len(r['reportReviews']),added=len(paths),exactChronology=True)))
