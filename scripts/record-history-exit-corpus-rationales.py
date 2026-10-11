from pathlib import Path
import json
P=Path('docs/planning');O=P/'campaign3-history-exit-corpus-rationales-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
check=load(O/'check.json');assert check['coverage']['totalOccurrences']==26640
cp=P/'CAMPAIGN3_HISTORY_EXIT_CORPUS_RATIONALES_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Historical corpus rationale reconciliation — 2026-10-08

**LOCAL DISPOSITION.** HQ-011 remains open; no owner ruling required.
Counters **1519 / 0**. This is scoped semantic review, not a new qualification.

Reviewed all 29 distinct corpus member/clause rationale texts across 111 historical
audit snapshots: 2,331 member and 24,309 clause occurrences. Every occurrence retains
its exact JSON pointer, member identity, status and source hash. Twenty-one member
judgments bind the existing scoped source reviews; those reviews were not rerun.

Seven missing-witness statements are superseded only by the bounded qualifications:
LEARN at REV3, EPI4, REASON5, DECISION6, COMMIT7, BODY8 and BIO9. Historical missing
witnesses remain valid statements of their then-current evidence. Later results do
not choose a general law, erase comparator limits or broaden original experiment
scope. The other fourteen member rationales remain scoped to their cited experiments;
later addiction, reappraisal or defining-memory work has separate evidence.

All 4,662 TRACKED clause occurrences are Applicable seams or Reopen conditions.
Their common rationale explicitly excludes them from behavioral passes. All 21
corpus sourceText blobs are unchanged across the snapshots; identity does not prove
that every source obligation was satisfied.

One additional interpretation hazard needs preservation: ADAPT's intervention
identity field explicitly says frozen for review, not passed, while its generic
status says ACCEPTED PRIOR SCOPE. That inherited label cannot supply a behavioral
pass. CAMPAIGN2_COMPLETION_REVIEW.md and
CAMPAIGN2_COGNITIVE_PERSISTENCE_QUALIFICATION.md are still unassigned source roles.
Their evidence review remains owed before final ADAPT/DET corpus adequacy. This is
an evidence reconciliation task under the existing policy, not an owner decision.

The prior 181-text queue remains immutable. This review covers its 28 member texts
and adds the separate TRACKED clause text; 153 family/Brief rationale texts remain.
Other schema fields, complete sourceText semantics and the shared Markdown audit
remain pending. No complete audit source was promoted to accepted status.

SourceREV171 stays 10,107 assigned / 1,266 unassigned; 22,514 narrative / 184,919
backing occurrences and 920 outside-census artifacts. No runtime simulation, test,
build or corpus freshness claim. Original audit hashes and existing evidence review
hashes verify. Research bookkeeping checks are required separately.

Next reconcile family/Brief rationale transitions and remaining schema prose,
then the inherited Campaign2 support and final source adequacy. Formula historical
identity, missing legacy log, Values90/15 and prior exclusions remain open. HQ012
unstarted; Campaign3 NOT EXIT-READY. 108 verdicts; 132 bounded clauses; 55/58 wrappers;
corpus0.29.0/21; 1519/0. RO019 ACTIVE; RO021 mandatory and UNSATISFIED; RO022 CLOSED.
''',encoding='utf-8',newline='\n')
rpath=P/'RESEARCH_OBLIGATIONS.json';r=load(rpath);obs=['RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
paths=[x.as_posix() for x in sorted(O.glob('*.json'))]+[cp.as_posix()]
for p in paths:
 assert p not in existing
 r['reportReviews'].append(dict(path=p,obligations=obs))
 for o in r['obligations']:
  if o['id'] in obs:o['evidence'].append(p)
rpath.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS:corpus rationale semantic review recorded;no source promotion.
Start CAMPAIGN3_HISTORY_EXIT_CORPUS_RATIONALES_CHECKPOINT.md.
29 texts/26640 exact occurrences/111 snapshots;21 scoped member judgments.
Seven bounded supersessions;4662 TRACKED constraints are not behavioral passes.
ADAPT inherited not-passed identity field and two Campaign2 source reviews remain owed.
Next153 family/Brief rationale texts,other schema prose and inherited support.
SourceREV171 unchanged:10107 assigned/1266 unassigned;22514 narrative/184919 backing;
920 artifacts. Formula historical identity,legacy log,Values90/15 and exclusions OPEN.
Independent adequacy/HQ012 unstarted. Campaign3 NOT EXIT-READY.
1519/0;108 verdicts;55/58 wrappers;132 bounded;corpus0.29.0/21.
RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED. All jobs terminal;no owner ruling.
'''
cur.write_text(old.decode('utf-8-sig').split('HQ-011 IN PROGRESS:')[0]+route,encoding='utf-8',newline='\n')
a=Path('AGENTS.md');s=a.read_text(encoding='utf-8-sig');needle='**Current routing (2026-10-08):**';pos=s.index(needle)
a.write_text(s[:pos]+needle+'\n'+route+'\n'+s[pos:].replace('**Current routing','**Prior routing',1),encoding='utf-8',newline='\n')
print(json.dumps(dict(reports=len(r['reportReviews']),added=len(paths),exactChronology=True)))
