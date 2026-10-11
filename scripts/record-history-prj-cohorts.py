from pathlib import Path
import json
P=Path('docs/planning')
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(P/'campaign3-history-source-roles-rev214/check.json');assert c['assignedSources']==10861
cp=P/'CAMPAIGN3_HISTORY_PRJ_COHORTS_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Projection substitution receipt reconciliation — 2026-10-08

**LOCAL DISPOSITION — no owner ruling.** HQ011 IN PROGRESS; counters **1519 / 0**.

Three historical receipts are reconciled: 48 original narrative and nine backing
occurrences, with all 180 JSON string leaves retained. Four source references resolve
exactly. The original test file was recovered from reachable Git with its committed
hash; the two later test-file identities remain unresolved after bounded searches.
The already preserved production compiler matches all six unique substitution anchors.

Each receipt records one selected baseline test and six selected mutant failures.
The six substitutions distinguish observer selection, field exposure, preservation
of the source wrapper, required presence, the roster static-read ban and required
roster projection. The original test also rejects forged input before any read and
checks one admitted read, field-only access and full source-wrapper evidence.

These are generic projection controls, not frozen zero-read EVID activation or an
independent projection interpreter. The three payloads are identical apart from
test-file fingerprints. Eighteen recorded failures are six repeated substitutions,
not eighteen independent mechanisms. The inspected current writer excludes skipped
tasks and requires exactly one selected test and one source transformation. Its
current bytes are not represented as the authenticated historical writer.

The original test was recovered from commit
`542cef006fcccfe5defc71bf557eb9049417f175` without changing historical receipts.
Two later test hashes could not be recovered from current/indexed files, four
reachable exact-path Git revisions or two exact-basename workspace candidates.
This is a bounded search, not proof of global absence. Their dependent claims need
explicit limitation or exact recovery during independent adequacy before HQ012.

Source REV214: 10,861 assigned / 512 unassigned; 186,734 narrative / 211,826 backing;
1,197 indexed archives. No runtime, test, mutant, build or historical writer rerun.
No model, law, allocation, verdict, corpus or obligation status changed.
Prior gap inventories, formula provenance, the legacy log, remaining material support,
post-cutoff joins and independent adequacy remain open. HQ012 is unstarted;
Campaign3 is NOT EXIT-READY. Counters 1519/0; 108 verdicts; 132 bounded clauses;
55/58 wrappers; corpus 0.29.0/21. RO019 ACTIVE; RO021 UNSATISFIED; RO022 CLOSED.
''',encoding='utf-8',newline='\n')
rpath=P/'RESEARCH_OBLIGATIONS.json';r=load(rpath);obs=['RO-C3-008','RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
paths=[p.as_posix() for d in ['campaign3-history-prj-cohorts-rev1','campaign3-history-source-roles-rev214'] for p in sorted((P/d).glob('*.json'))]+[cp.as_posix()]
for p in paths:
 assert p not in existing
 r['reportReviews'].append(dict(path=p,obligations=obs))
 for o in r['obligations']:
  if o['id'] in obs:o['evidence'].append(p)
rpath.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS: three projection substitution receipts reconciled.
Start CAMPAIGN3_HISTORY_PRJ_COHORTS_CHECKPOINT.md.
48 narrative /9 backing; 180 strings; four exact bindings; one recovered test.
Six repeated substitutions retain selected-test scope; two later test identities open.
Source REV214: 10861 assigned /512 unassigned; 186734 narrative /211826 backing;
1197 archives. Values post-cutoff reviews retain separate denominators.
Open identities include two PRJ tests plus prior ADAPT, composition, Values,
cognitive, exit-inventory and scheduler groups; inventories are not globally deduplicated.
Next remaining material support, post-cutoff joins and independent adequacy.
Formula provenance and legacy log remain OPEN; HQ012 unstarted.
Campaign3 NOT EXIT-READY. 1519/0; 108 verdicts; 55/58 wrappers; 132 bounded;
corpus 0.29.0/21. RO019 ACTIVE; RO021 UNSATISFIED; RO022 CLOSED.
All jobs terminal; no owner ruling.
'''
cur.write_text(old.decode('utf-8-sig').split('HQ-011 IN PROGRESS:')[0]+route,encoding='utf-8',newline='\n')
a=Path('AGENTS.md');s=a.read_text(encoding='utf-8-sig');needle='**Current routing (2026-10-08):**';pos=s.index(needle)
a.write_text(s[:pos]+needle+'\n'+route+'\n'+s[pos:].replace('**Current routing','**Prior routing',1),encoding='utf-8',newline='\n')
print(json.dumps(dict(reports=len(r['reportReviews']),added=len(paths),exactChronology=True)))
