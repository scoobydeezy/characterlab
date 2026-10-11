from pathlib import Path
import json
P=Path('docs/planning');O=P/'campaign3-history-exit-predecessor-summaries-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
assert load(O/'check.json')['rows']==110
cp=P/'CAMPAIGN3_HISTORY_EXIT_PREDECESSOR_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Historical exit-audit predecessor summaries — 2026-10-08

**LOCAL DISPOSITION.** HQ-011 remains open; no owner ruling. Counters **1519 / 0**.

Reviewed all110 predecessor-summary occurrences (109 distinct texts) against the
exact linked predecessor and described snapshot. The field has mixed temporal scope:
REV2 describes predecessor1; REV3..80 describe successor work or the transition;
REV81..111 describe the linked predecessor. Explicit per-occurrence scope now prevents
reading every predecessor.disposition as an earlier qualification. Original paths,
hashes and snapshot bytes are preserved. REV80/81 repeat the same text about actual
REV80 history-audit work; this is not two experiments.

All stated summary counts agree with their intended snapshot:46 Brief-status triples,
50 named-verdict totals and46 program-counter pairs. Actual successor clause changes
and added verdict IDs are recorded independently. These mechanical comparisons support
the scoped semantic dispositions; they do not newly execute the cited experiments.
The separately reviewed rationale/qualification spine retains their behavioral scope.

Preserved distinctions include corrected agency leakage/phase70 evidence, personstate
consequence appraisal130, prospective relationship responses, component/public
admission, actual habit/urge/adaptation differences, duplicate run accounting and
biological bookkeeping repair. Defining-memory implementation stages,68 internal
programs and focused public checks are not the later68-program public matrix.
Development component, primary native implementation and full native qualification
are separate. Running longitudinal matrices and interim trajectories are historical
work states, not current live process handles or closure. Later goal/routine/habit/
loss results retain decomposition, actual practice-memory loss and fallible reports.

Revision-cap explanations concern real coverage changes, not a waiver of mandatory
gates. No passing development test, scalar equality, closed historical wrapper inventory
or bounded clause total implies Campaign3 exit. No law, corpus member, verdict or
obligation status changed. No original summary was rewritten for cosmetic consistency.

The181-text rationale queue and36-section/351-clause authority binding remain intact.
Next complete the shared1295-line Markdown audit and inventory/support source adequacy,
then classify complete audit-source roles.21 supporting sources identified by the
rationale union remain unassigned. SourceREV171 stays10,107 assigned/1,266 unassigned;
22,514 narrative/184,919 backing;920 outside-census artifacts. No source promotion,
new runtime simulation/test/build or corpus freshness claim; bookkeeping checks are
separate from scientific adequacy.

Formula historical identity, missing legacy log, Values90/15 and prior exclusions
remain open. HQ012 unstarted; Campaign3 NOT EXIT-READY.108 verdicts;132 bounded clauses;
55/58 wrappers;corpus0.29.0/21;1519/0. RO019 ACTIVE;RO021 mandatory and UNSATISFIED;
RO022 CLOSED.
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
route='''HQ-011 IN PROGRESS:exit-audit predecessor summaries reconciled.
Start CAMPAIGN3_HISTORY_EXIT_PREDECESSOR_CHECKPOINT.md.
110 occurrences/109 texts;explicit predecessor-versus-successor temporal scope.
46 Brief triples/50 verdict totals/46 program counters match described snapshots.
Next shared1295-line Markdown,inventory/support adequacy and whole-source roles.
181 rationales and42957 authority quotes already reconciled;no final adequacy claim.
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
