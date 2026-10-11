from pathlib import Path
import json
P=Path('docs/planning')
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(P/'campaign3-history-source-roles-rev215/check.json');assert c['assignedSources']==10866
cp=P/'CAMPAIGN3_HISTORY_BRIDGE_BATCH_COHORTS_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Bridge, applicability and batch receipt reconciliation — 2026-10-08

**LOCAL DISPOSITION — no owner ruling.** HQ011 IN PROGRESS; counters **1519 / 0**.

Five historical receipts are reconciled: 71 original narrative and six backing
occurrences, with all 395 JSON string leaves retained. Nine source bindings resolve
exactly; one refreshed evaluator identity remains unresolved after bounded searches.

The two bridge receipts have identical payloads. Each records two contact counts
(0/2), a fixed safe pulse and five substitutions. Observation publication omission
changes outputs and trace without changing state or raising an error. Retained raw
truth provenance, omitted/duplicate SEM support and shifted SEM time instead cause
TRANSITION_FAILURE and rollback. Fresh checks reproduce every reported changed-field
list from stored hashes. They do not recreate the historical exact-byte comparisons
or independently reconstruct full rollback. The later sixth hidden-count pulse
mutation in the current writer is absent from these two receipts.

Two applicability receipts preserve the same results under different evaluator
fingerprints. Their two-rule specimen distinguishes structural applicability from
gate outcome: false gates retain evaluations; empty/nonmatching resolvers still emit
one dispatch. Reversing rule identities preserves frozen-snapshot tolerance 1/load 2
while changing model identity and evaluation order. Three mutations fail 1/1/2 tests.
The refreshed evaluator hash remains unrecovered; equal rows cannot authenticate it.

The batch receipt preserves five tests and four substitutions, with failure counts
2/3/1/1. Zero-count rules retain topology and allocation positions. Collision rejection
precedes target/gate reads even when a gate would be false. Same-path target and gate
reads remain ordered, distinct accessor evidence. Noncolliding input permutation
preserves settled state; this is not a trace, allocator or run-identity equality claim.
The receipt lacks mutation source strings, so the current writer provides interpretation
without retroactively authenticating those historical transformation bytes.

The new checker initially looked only in archives for an already exact current source,
raising KeyError before review publication. Its original script and error are preserved;
the corrected checker uses exact current bindings or exact archives. This is an audit
checker failure, not an ADAPT runtime failure or a newly missing source.

Source REV215: 10,866 assigned / 507 unassigned; 186,805 narrative / 211,832 backing;
1,197 indexed archives. The additional evaluator gap has been searched in current/indexed
sources, three reachable exact-path Git revisions and three workspace basename candidates.
No runtime, mutant, test, build or historical writer was rerun. No model, law, allocation,
verdict, corpus or obligation status changed. Prior gap inventories and independent
adequacy remain open. HQ012 is unstarted; Campaign3 NOT EXIT-READY. Counters 1519/0;
108 verdicts; 132 bounded clauses; 55/58 wrappers; corpus 0.29.0/21.
RO019 ACTIVE; RO021 UNSATISFIED; RO022 CLOSED. No owner ruling.
''',encoding='utf-8',newline='\n')
rpath=P/'RESEARCH_OBLIGATIONS.json';r=load(rpath);obs=['RO-C3-008','RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
paths=[p.as_posix() for d in ['campaign3-history-bridge-batch-cohorts-rev1','campaign3-history-source-roles-rev215'] for p in sorted((P/d).glob('*.json'))]+[cp.as_posix()]
for p in paths:
 assert p not in existing
 r['reportReviews'].append(dict(path=p,obligations=obs))
 for o in r['obligations']:
  if o['id'] in obs:o['evidence'].append(p)
rpath.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS: five bridge/applicability/batch receipts reconciled.
Start CAMPAIGN3_HISTORY_BRIDGE_BATCH_COHORTS_CHECKPOINT.md.
71 narrative /6 backing; 395 strings; nine exact bindings; one refresh source gap.
Duplicate bridge results and distinct dispatch/read/rollback obligations preserved.
Source REV215: 10866 assigned /507 unassigned; 186805 narrative /211832 backing;
1197 archives. Values post-cutoff reviews retain separate denominators.
Open identities include the new refresh evaluator, two PRJ tests and prior ADAPT,
composition, Values, cognitive, exit-inventory and scheduler groups; no global deduplication.
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
