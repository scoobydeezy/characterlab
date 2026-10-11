from pathlib import Path
import json
P=Path('docs/planning');O=P/'campaign3-history-exit-authority-quotes-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
assert load(O/'check.json')['quoteOccurrences']==42957
cp=P/'CAMPAIGN3_HISTORY_EXIT_AUTHORITY_QUOTES_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Historical exit-audit quoted authority and schema — 2026-10-08

**LOCAL DISPOSITION.** HQ-011 remains open; no owner ruling. Counters **1519 / 0**.

Bound all36 embedded normative sections and351 clause texts to the exact already-
reviewed frozen PHENOMENON_CORPUS and Research Brief sources. Every quoted string
matches its authority section in all111 snapshots:42,957 exact quote occurrences.
Both frozen authority hashes and prior semantic review hashes verify. The quoted
setup, interventions, comparison, horizon, trace and preservation requirements retain
their full meaning; copying them under QUALIFIED BOUNDED is not proof that every
compound requirement passed. ADAPT's explicitly not-passed intervention field remains
visible. No original snapshot or authority source changed.

Enumerated every string leaf, including short values omitted by the original three-
word prose predicate, into47 schema paths. This schema review distinguishes quoted
requirements, separately reviewed rationale text, typed identities/paths/hashes,
historical status/citation labels, inspection assertions, gate annotations and still-
pending predecessor-summary narrative. It does not infer semantic acceptance from
string length or filename. Source-line values remain historical navigation metadata;
content and section binding are explicit.

The two inventory-inspection labels describe historical coverage, not fresh replay
or whole-log review. Inventory path/hash membership is not transitive source acceptance
or proof of current file identity. Authority labels that cite controls/limitations
are not executed new verdicts. PARTIAL/BLOCKED denote evidence gaps rather than failed
experiments; TRACKED constraints are not behavioral passes.

FinalHistoricalGate remains NOT SATISFIED and blocks final exit while permitting
admitted bounded implementation. PublicWrapperGate ACTIVE/CLOSED is limited to its
then-declared49..54-producer inventory. Publication checking can precede a still-open
full prefix matrix; closure of54/57 does not certify current55/58. The original gate
annotations and all predecessor inventory scopes remain unchanged.

Remaining: semantically reconcile109 distinct predecessor summaries against their
exact prior revisions, review the shared1295-line Markdown report, reconcile historical
inventory identities as needed for source adequacy, and complete21 union-identified
support-source reviews. The181 rationale texts/18,648 occurrences are already covered;
this quote/schema step does not confer whole-source acceptance or final adequacy.

SourceREV171 remains10,107 assigned/1,266 unassigned;22,514 narrative/184,919 backing;
920 outside-census artifacts. No simulation, runtime tests/build, scientific verdict,
corpus freshness, obligation closure or source-role promotion. Research bookkeeping
checks are separate. Formula historical identity, missing legacy log, Values90/15 and
prior exclusions remain open. HQ012 unstarted; Campaign3 NOT EXIT-READY.108 verdicts;
132 bounded clauses;55/58 wrappers;corpus0.29.0/21;1519/0. RO019 ACTIVE;RO021 mandatory
and UNSATISFIED;RO022 CLOSED.
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
route='''HQ-011 IN PROGRESS:quoted authority and exit-audit schema reviewed.
Start CAMPAIGN3_HISTORY_EXIT_AUTHORITY_QUOTES_CHECKPOINT.md.
36 normative sections/351 clauses/42957 exact quotes bind reviewed frozen authorities.
47 string schema paths include short values;gate/inspection scope remains historical.
Next109 predecessor summaries,shared1295-line Markdown,inventory/support adequacy.
181 rationale texts already reconciled;no whole-source promotion or final adequacy.
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
