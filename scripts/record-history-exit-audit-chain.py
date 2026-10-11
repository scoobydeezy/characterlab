from pathlib import Path
import json
P=Path('docs/planning');O=P/'campaign3-history-exit-audit-chain-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(O/'check.json');assert c['snapshots']==111 and c['predecessorLinks']==110
cp=P/'CAMPAIGN3_HISTORY_EXIT_AUDIT_CHAIN_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Exit-audit chain and current delta — 2026-10-08

**LOCAL DISPOSITION.** HQ-011 remains open;no owner ruling required.
Counters **1519 / 0**. Structural verification only,no scientific promotion.

All111 exit-audit snapshots retain NOT EXIT-READY and the same documentation-only
scope. All110 predecessor path/hash links verify. Corpus version/digest remain fixed;
each snapshot enumerates21 members/219 corpus fields and15 families/132 Brief clauses.
No original audit was regenerated or overwritten.

REV111 names106 verdicts,allocation1508 and wrapper54/57. The current ledger preserves
its238,565-byte frozen prefix exactly and appends only VER-C3-VALUES-001 and
VER-C3-VALUES-PUBLIC-001,for108. The prior semantic verdict-spine review is bound by
hash. Values wrapper evidence records55 producers/58 factories;the public Values
qualification records1519. These are post-cutoff differences,not errors to erase in
REV111. Current Values readiness limitations remain as previously reviewed.

The initial checker recognized only backtick-quoted headings and found72 instead of
106. Its source is preserved. The successor accepts the actual optional-backtick
heading grammar,recovers the exact106-ID audit sequence,and verifies the two-entry
append. No ledger,qualification or snapshot changed. This audit-parser failure does
not undermine the separately verified ledger prefix or historical evidence.

REV111 has132 QUALIFIED BOUNDED clause entries while all15 family summary labels
remain PARTIAL. Do not silently normalize those fields or infer joint family
integration from separate clause coverage. Their intended scientific scope belongs
to the upcoming semantic review. The final historical gate remains NOT SATISFIED;
publication-gate status and inventory are explicitly time-scoped.

A pending review queue preserves181 distinct rationale texts with18,648 individual
source/pointer occurrences. It includes family/member/clause rationale fields only.
It does not cover every sourceText,predecessor disposition,inventory annotation or
short string. Exact repetition permits shared inspection only after context is checked;
it is not a whole-source acceptance rule. No original source role is promoted by this
chain check. The111 JSON snapshots and shared Markdown report still require semantic
reconciliation before final adequacy.

Next inspect those rationale deltas and other schema prose against accepted claims,
failed cohorts and owned limitations,then classify the audit sequence with precise
historical scope. Preserve the independent final adequacy requirement. No simulation,
runtime test,build,corpus freshness or HQ012 acceptance is claimed here.

SourceREV171 unchanged:10,107 assigned/1,266 unassigned;22,514 narrative/184,919 backing;
920 outside-census artifacts. Formula current-use erratum stands;historical identity,
missing legacy log,Values90/15 and other prior exclusions remain open. HQ012 unstarted;
exitAuditREV111 unchanged;Campaign3 NOT EXIT-READY.108 verdicts;132 bounded clauses;
55/58 wrappers;corpus0.29.0/21;1519/0. All jobs terminal;no obligation status change.
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
route='''HQ-011 IN PROGRESS:111-snapshot exit-audit chain/current delta verified.
Start CAMPAIGN3_HISTORY_EXIT_AUDIT_CHAIN_CHECKPOINT.md.
110 predecessor links;fixed21/219/15/132 denominators;frozen106/current108 verdicts.
Optional-backtick parser correction preserved. No source-role promotion or audit refresh.
Next semantic review of181 rationale texts/18648 occurrences plus other schema prose.
REV111 has132 bounded clauses/15 PARTIAL family summaries;scope requires review.
SourceREV171 unchanged:10107 assigned/1266 unassigned;22514 narrative/184919 backing;
920 artifacts. Formula current-use erratum stands;historical identity,legacy log,
Values90/15 and prior exclusions OPEN. Independent adequacy/HQ012 unstarted.
Campaign3 NOT EXIT-READY.1519/0;108 verdicts;55/58 wrappers;132 bounded;corpus0.29.0/21.
RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED. All jobs terminal;no owner ruling.
'''
cur.write_text(old.decode('utf-8-sig').split('HQ-011 IN PROGRESS:')[0].replace('Updated2026-10-07','Updated2026-10-08')+route,encoding='utf-8',newline='\n')
a=Path('AGENTS.md');s=a.read_text(encoding='utf-8-sig');needle='**Current routing (2026-10-08):**';pos=s.index(needle)
a.write_text(s[:pos]+'**Current routing (2026-10-08):**\n'+route+'\n'+s[pos:].replace('**Current routing','**Prior routing',1),encoding='utf-8',newline='\n')
print(json.dumps(dict(reports=len(r['reportReviews']),added=len(paths),exactChronology=True)))
