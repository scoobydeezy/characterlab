from pathlib import Path
import json
P=Path('docs/planning')
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(P/'campaign3-history-source-roles-rev173/check.json')
assert c['assignedSources']==10220 and c['unassignedWithinThisIndex']==1153
cp=P/'CAMPAIGN3_HISTORY_EXIT_CONSOLIDATION_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Historical exit-audit consolidation — 2026-10-08

**LOCAL DISPOSITION — no owner ruling required.** HQ-011 remains in progress.
Program counters **1519 / 0**. Campaign3 is **NOT EXIT-READY**.

Recovered83 additional inventory identities using an exact preserved prefix plus
an LF/CRLF continuation. All83 target hashes match; all reconstruction recipes
were rebuilt. This resolves all34 previously missing shared exit-audit versions,
26 seam-ledger and23 verdict-ledger versions. Total740/820 path/hash pairs resolve;
80 remain unresolved:28 seam,30 verdict,14 reference-mechanism and8 entry-readiness
versions. Reconstructed bytes do not prove historical append operations or dates.
The original111 audit snapshots remain unchanged; no original writer was rerun.

All265 newly recovered variants now have explicit backing roles:264 normalize to
exact text prefixes of reviewed roots. The remaining exact Git entry-readiness
variant has two dated routing replacements (REV7:16 bounded/3 prior/2 partial;
REV9:18 bounded/3 prior/0 partial after bounded BODY/BIO) and excludes later notices.
Its historical entry body is unchanged. No extra scientific finding is inferred
from newline transformations, aliases or the existence of inventory hashes.

Consolidated the prior rationale, quoted-authority, predecessor, gate and inventory
reviews into111 dated JSON claim-record roles. All551,026 string leaves across47
schema paths are accounted, including short strings. Exact original unit identities,
source hashes, pointers and extracted-text digests are preserved in per-source
occurrence shards:106,813 narrative and23,738 backing occurrences including the
whole entry-readiness document. Snapshot claim acceptance does not transitively
accept its linked evidence or establish current replay/whole-family qualification.

Entry readiness preserves dated missing-edge/intake scope,15-family denominator,
prior/PARTIAL/BLOCKED/NOT RUN/FAIL distinctions, BIO biography versus physiology,
SEM's tenth-member correction, feedback-edge versus executed-loop versus necessity,
unknown fixture discrimination and mandatory historical gate. Later bounded
qualifications supersede only their named scope. IDs remain reserved after ablation.

Preserved development failure: the first consolidation checker used off-by-one
line ranges for the old Git entry variant. It stopped after writing occurrence
shards, before a review/check/index or qualification. The successor verifies the
complete six-opcode diff and retains the original checker and shards. No historical
source was edited to satisfy the comparison.

SourceREV173:10,220 assigned/1,153 unassigned;129,517 narrative/208,657 backing;
1,185 indexed outside-census artifacts. The80 missing historical identities are
explicitly OPEN in campaign3-history-exit-consolidation-rev2/unresolved-identities.json.
Current source bytes are not replacements and no absence-of-lost-findings claim
is made. Their materiality remains part of RO-C3-021 and final independent adequacy.
Next supporting-source review and remaining evidence-universe reconciliation.

No fresh runtime simulation/test/build, scientific verdict, law selection, corpus
promotion or obligation closure. Bookkeeping checks are separate from qualification.
Formula historical identity, legacy log, Values90/15 and prior exclusions remain
open. HQ012 unstarted.108 verdicts;132 bounded clauses;55/58 wrappers;corpus0.29.0/21.
RO019 ACTIVE;RO021 CONDITIONAL but mandatory and UNSATISFIED;RO022 CLOSED.
''',encoding='utf-8',newline='\n')
rpath=P/'RESEARCH_OBLIGATIONS.json';r=load(rpath)
obs=['RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
dirs=['campaign3-history-exit-inventory-mixed-rev1','campaign3-history-exit-consolidation-rev1','campaign3-history-exit-consolidation-rev2','campaign3-history-source-roles-rev173']
paths=[p.as_posix() for d in dirs for p in sorted((P/d).rglob('*.json'))]+[cp.as_posix()]
for p in paths:
 assert p not in existing
 r['reportReviews'].append(dict(path=p,obligations=obs))
 for o in r['obligations']:
  if o['id'] in obs:o['evidence'].append(p)
rpath.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS:historical exit-audit claim records consolidated.
Start CAMPAIGN3_HISTORY_EXIT_CONSOLIDATION_CHECKPOINT.md.
111 audit JSON plus entry readiness reviewed;551026 string leaves/47 schemas.
740/820 inventory identities resolved;265 recovered archives explicitly scoped.
80 historical identities OPEN across4 roots;no current-byte substitution.
SourceREV173:10220 assigned/1153 unassigned;129517 narrative/208657 backing;
1185 indexed archives. Initial off-by-one comparison failure preserved.
Next supporting sources/remaining universe and independent adequacy.
Formula historical identity,legacy log,Values90/15 and exclusions OPEN.
HQ012 unstarted;Campaign3 NOT EXIT-READY.1519/0;108 verdicts;55/58 wrappers;
132 bounded;corpus0.29.0/21. RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED.
All jobs terminal;no owner ruling.
'''
cur.write_text(old.decode('utf-8-sig').split('HQ-011 IN PROGRESS:')[0]+route,encoding='utf-8',newline='\n')
a=Path('AGENTS.md');s=a.read_text(encoding='utf-8-sig');needle='**Current routing (2026-10-08):**';pos=s.index(needle)
a.write_text(s[:pos]+needle+'\n'+route+'\n'+s[pos:].replace('**Current routing','**Prior routing',1),encoding='utf-8',newline='\n')
print(json.dumps(dict(reports=len(r['reportReviews']),added=len(paths),exactChronology=True)))
