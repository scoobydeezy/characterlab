from pathlib import Path
import json
P=Path('docs/planning');O=P/'campaign3-history-exit-identity-longitudinal-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
assert load(O/'check.json')['occurrencesCount']==2442
cp=P/'CAMPAIGN3_HISTORY_EXIT_RATIONALES_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Historical exit-audit rationale reconciliation — 2026-10-08

**LOCAL DISPOSITION.** HQ-011 remains open; no owner ruling. Counters **1519 / 0**.

The original rationale queue is now fully reconciled:181 unique texts and18,648
exact occurrences across111 snapshots. Seven scoped semantic reviews cover all corpus
member and Brief family/clause rationales in that queue. The union checker verifies
every exact source/pointer/text, with17 explicitly reused memory-affect occurrences,
not additional coverage. A separate24,309 corpus-clause occurrences include the
TRACKED preservation/reopening text absent from the original queue. Original snapshot
bytes remain unchanged. This completes rationale review, not whole-source adequacy.

The final batch reviews47 texts/2,442 occurrences for identity and longitudinal
personhood: two family summaries and20 clauses. Standing, represented self/observer
belief, plastic disposition and immutable constitution stay separate. Native Task and
Biological channels alone do not supply shared cross-domain identity. Later enacted
parcel/assertion/attendance sources and held-out receiving supply that bounded chain.
Actual refusal and conditional penalty separately ground later pressure learning and
identity eligibility; controlled pressure operands alone had not enacted coercion.
All equalities, cancellation cases, cohort corrections and candidate laws remain.

Development expressly retains the owner's two independent effects: higher younger
learning plasticity and greater early personality-forming event weight. REV82 supplied
components, REV83 only implementation/primary correspondence, and REV84 the complete
bounded native admission. Earlier unimplemented/native-open statements remain historical.
Original eligibility, event-time authorship, immutable constitution and mature learning
stay intact. Controlled phase0..4 is not calendar ageing, critical periods or all
personality pathways. Early equal sampled actions despite different probabilities and
later sequence differences both remain; no law selected.

Later longitudinal goal, routine, habit/relearning and personal-loss qualifications
supersede only their exact earlier gaps. Native biography sources with component
receivers are not a joined native scheduler. Four joined horizons corroborate larger
decomposed routine/habit matrices without turning reused native prefixes into fresh
restores. Actual practice-episode loss is distinct from original source-memory expiry;
raw audit/fold history persists. Personal loss changes later appraisal/action through
fallible reports without rewriting relationship history. No lifetime, global erasure,
clinical grief, general cross-domain exchange rate or whole-family integration follows.

All15 family summaries remain PARTIAL in the immutable snapshots while132 clauses
are bounded atREV111. The reviewed interpretations distinguish stale missing-clause
wording from still-open generality/integration. Neither label can silently override
the exact evidence. Body-only regulatory insufficiency preserves psychological scalar
equalities; public/component distinctions and historical failed cohorts remain.

Remaining work: examine complete sourceText and other schema prose/short strings,
the shared Markdown audit and21 distinct unassigned supporting sources identified
by the union check, then determine precise whole-source roles and independent adequacy.
The completed rationale queue does not discharge these requirements. No source index
promotion, obligation closure, new verdict, runtime simulation/test/build or corpus
freshness claim. SourceREV171 remains10,107 assigned/1,266 unassigned;22,514 narrative/
184,919 backing;920 outside-census artifacts. Existing scoped review hashes verify.

Formula historical identity, missing legacy log, Values90/15 and prior exclusions
remain open. HQ012 unstarted; Campaign3 NOT EXIT-READY.108 verdicts;132 bounded clauses;
55/58 wrappers;corpus0.29.0/21;1519/0. RO019 ACTIVE;RO021 mandatory and UNSATISFIED;
RO022 CLOSED. Research bookkeeping checks are separate from scientific adequacy.
''',encoding='utf-8',newline='\n')
rpath=P/'RESEARCH_OBLIGATIONS.json';r=load(rpath);obs=['RO-C3-010','RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
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
route='''HQ-011 IN PROGRESS:all original exit-audit rationale texts reconciled.
Start CAMPAIGN3_HISTORY_EXIT_RATIONALES_CHECKPOINT.md.
181 texts/18648 exact occurrences;17 explicit reused pointers;111 snapshots unchanged.
Final47 identity/longitudinal texts preserve independent developmental effects.
Next sourceText/other schema prose,shared Markdown and21 unassigned support sources.
No whole-source promotion or independent adequacy claim from rationale coverage.
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
