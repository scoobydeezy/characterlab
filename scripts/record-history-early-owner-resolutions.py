from pathlib import Path
import json
P=Path('docs/planning')
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(P/'campaign3-history-source-roles-rev263/check.json');assert c['assignedSources']==11166
cp=P/'CAMPAIGN3_HISTORY_EARLY_OWNER_RESOLUTIONS_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Early owner and timing resolutions — 2026-10-08

**LOCAL DISPOSITION — no owner ruling.** HQ-011 remains in progress; counters **1519 / 0**.

Four sources preserve 429 original narrative occurrences. Shape acceptance, numeric
allocation, implementation qualification and psychological necessity remain distinct.

EVID's accepted shape transports complete observer evidence through two distinct
occurrences; it does not interpret success or prove evaluation irreducible. Actual
producer admission, output closure and generative ingress have separate failure
boundaries. Empty declared reads are insufficient if the live handler exposes state.
Unbound observers remain valid and need no widened permission to produce evidence.

IDN separates authored character qualification from observer belief and content-kind
validation. The roster supplies one state-addressing subject, never recognition or
binding-topology evidence. Its schema belongs to ModelIdentity and its pairs to
RunIdentity. Alternate direct, derived and event-dependent roster reads are forbidden.
The inherited executable-closure finding is preserved through later VAL qualification.

REG keeps unadapted reference, signed displacement and current physiology distinct.
Time can invalidate retained displacement without a write; ADAPT owns enforcement.
Copies of parameters are not additional authoritative owners. Abstract variable domains,
full-clock linear bounds and exact TIME arithmetic do not establish biological realism.

ORD-001 remains an inspected proposal for immediate current-lane belief timing. Later
phase140 learning and next-cycle appraisal do not close it. Its common-prior and
collision rules are proposed bounded semantics, not accepted universal update laws.
This open extension is owned by RO-C3-010 and is not an owner blocker for this audit.

Later bounded qualifications supersede historical OPEN/NOT PASSED routing only within
their exact profiles. No contract, law, runtime, allocation or verdict changed here.
Source REV263: 11,166 assigned / 207 unassigned; 193,528 narrative / 212,202 backing;
1,293 indexed backing resources. Source gaps, post-cutoff joins and independent
adequacy remain open. HQ-012 unstarted; Campaign3 NOT EXIT-READY. Counters1519 / 0;
108 verdicts;132 bounded clauses;55 / 58 wrappers;corpus0.29.0 / 21.
RO019 ACTIVE; RO021 UNSATISFIED; RO022 CLOSED. No obligation status changes.
''',encoding='utf-8',newline='\n')
rpath=P/'RESEARCH_OBLIGATIONS.json';r=load(rpath);obs=['RO-C3-008','RO-C3-010','RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
paths=[p.as_posix() for d in ['campaign3-history-early-owner-resolutions-rev1','campaign3-history-source-roles-rev263'] for p in sorted((P/d).glob('*.json'))]+[cp.as_posix()]
for p in paths:
 assert p not in existing
 r['reportReviews'].append(dict(path=p,obligations=obs))
 for o in r['obligations']:
  if o['id'] in obs:o['evidence'].append(p)
rpath.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS: early owner and timing resolutions reconciled.
Start CAMPAIGN3_HISTORY_EARLY_OWNER_RESOLUTIONS_CHECKPOINT.md.
Four sources preserve 429 original narrative occurrences. EVID, IDN and REG shape
acceptance remains distinct from qualification; ORD001 current-lane timing stays open.
Source REV263: 11166 assigned / 207 unassigned; 193528 narrative / 212202 backing;
1293 backing resources. No owner ruling or obligation status change.
Next: remaining material support, post-cutoff joins and independent adequacy.
Prior source gaps, formula provenance and legacy log remain OPEN; HQ-012 unstarted.
Campaign3 NOT EXIT-READY. Counters1519 / 0;108 verdicts;55 / 58 wrappers;
132 bounded clauses;corpus0.29.0 / 21. RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED.
All jobs terminal; no owner ruling.
'''
cur.write_text(old.decode('utf-8-sig').split('HQ-011 IN PROGRESS:')[0]+route,encoding='utf-8',newline='\n')
a=Path('AGENTS.md');s=a.read_text(encoding='utf-8-sig');needle='**Current routing (2026-10-08):**';pos=s.index(needle)
a.write_text(s[:pos]+needle+'\n'+route+'\n'+s[pos:].replace('**Current routing','**Prior routing',1),encoding='utf-8',newline='\n')
print(json.dumps(dict(reports=len(r['reportReviews']),added=len(paths),exactChronology=True)))
