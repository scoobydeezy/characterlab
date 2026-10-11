"""Record a verified post-cutoff join without an adequacy promotion."""
from pathlib import Path
import json
P=Path('docs/planning');O=P/'campaign3-history-post-cutoff-join-rev1'
check=json.loads((O/'check.json').read_text(encoding='utf-8'));assert check['validatedBackingStrings']==94036
cp=P/'CAMPAIGN3_HISTORY_POST_CUTOFF_JOIN_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Post-cutoff source and claim join — 2026-10-11

**LOCAL DISPOSITION — HQ-011 continues; no owner ruling. Counters1519 /0.**

The named post-cutoff additions now have one explicit bound join:343 formula
paragraphs,90 Values narrative/contract paragraphs,512 run sources with77,414
string occurrences, and24 development/support sources with16,622 string occurrences.
The checker independently reconstructs complete paragraph/string pointer sets and
validates original identities/values against their exact sources.94,036 backing
strings across536 sources pass. These heterogeneous counts are not summed into
material findings or independent experiments. The earlier15 finding fields overlap
development coverage and remain bound without extra experimental weight.

The original106-verdict ledger is an exact unchanged byte prefix of the current108;
only VER-C3-VALUES-001 and VER-C3-VALUES-PUBLIC-001 are appended. Frozen AuditREV111
is not rewritten or promoted. Values development retains1,029 exact bindings and
two unrecovered early source identities, explicitly present in the refreshed229-pair
gap inventory. Rejected adapter/import/test cohorts stay preserved.

Values qualifies bounded durable preference and native ownership/replay. It does
not discharge readiness physical cases2/3 or autonomous goal retirement in7.
Controlled categories, absent appraisal/developmental integration, complete-overlap
Joint and NeedOnly equalities remain limits. Component3/8 changed choices and5/8
equal choices are same-instant evidence; native contexts59..64 have distinct time
addresses. Four laws remain candidates; no Value irreducibility is inferred.

Formula bytes support historical candidate comparison and the existing343-paragraph
review, not the unsupported historical commit pin or production parity. Known
factor-orientation, fourth-moment, plug-in uncertainty, rounding/partition and finite
random-mapper limitations remain. Finite rearm does not prove selection of Rest.
No automatic formula adoption or new runtime-failure claim is made.

The frozen REV314 census remains11,373 assigned sources /0 unassigned and413,894
original occurrences. This join adds zero to those original denominators. The
source-role index and earlier reviews remain unchanged. Subsequent audit-generated
documents and no-hash gaps are not silently included or dismissed by this join.

Next: finish source-gap consequences and no-hash provenance dispositions, then
independently assess the canonical universe and scientific adequacy before HQ-012.
No behavioral suite/build/writer rerun. RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED.
108 verdicts;132 bounded clauses;55/58 wrappers;corpus0.29.0/21 unchanged.
Campaign3 NOT EXIT-READY. Exact join checker PASS; bookkeeping checks follow.
''',encoding='utf-8',newline='\n')
rp=P/'RESEARCH_OBLIGATIONS.json';r=json.loads(rp.read_text(encoding='utf-8-sig'))
obs=['RO-C3-010','RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
for p in [O/'review.json',O/'check.json',cp]:
    path=p.as_posix();assert path not in existing
    r['reportReviews'].append(dict(path=path,obligations=obs))
    for o in r['obligations']:
        if o['id'] in obs:o['evidence'].append(path)
rp.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS: named post-cutoff source/claim join verified.
Start CAMPAIGN3_HISTORY_POST_CUTOFF_JOIN_CHECKPOINT.md.
343 formula /90 Values paragraphs;94036 exact backing strings across536 sources.
106 frozen verdict prefix unchanged;2 Values additions;1029 exact development bindings,
2 unresolved preserved within229 historical source gaps. Stronger Values cases2/3/7 open.
REV314 unchanged:11373 sources assigned /0 unassigned;413894 original occurrences.
Next source-gap/no-hash consequences, independent universe and scientific adequacy.
HQ-012 unstarted. Campaign3 NOT EXIT-READY. No runtime suite or build rerun.
Counters1519 /0;108 verdicts;55 /58 wrappers;132 bounded clauses;corpus0.29.0 /21.
RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED. No owner ruling.
'''
cur.write_text(old.decode('utf-8-sig').split('HQ-011 IN PROGRESS:')[0]+route,encoding='utf-8',newline='\n')
a=Path('AGENTS.md');s=a.read_text(encoding='utf-8-sig');needle='**Current routing (2026-10-11):**';pos=s.index(needle)
a.write_text(s[:pos]+needle+'\n'+route+'\n'+s[pos:].replace('**Current routing','**Prior routing',1),encoding='utf-8',newline='\n')
print(json.dumps(dict(reports=len(r['reportReviews']),added=3)))
