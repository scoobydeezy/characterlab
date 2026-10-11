from pathlib import Path
import json
P=Path('docs/planning');O=P/'campaign3-history-provenance-correction-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(O/'check.json');assert c['originalReferences']==5 and c['supplementalOccurrences']==343
cp=P/'CAMPAIGN3_HISTORY_PROVENANCE_CORRECTION_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Current formula citation correction — 2026-10-08

**LOCAL DISPOSITION.** HQ-011 remains open;no owner ruling required.
Counters **1519 / 0**. No source-index count,production,model,verdict or corpus change.

FORMULA_SOURCE_PROVENANCE_ERRATUM.md now explicitly supersedes the current-use
snapshot assertion in FORMULA_INTAKE_LEDGER.md without rewriting that historical
ledger. Cite the preserved31,643-byte working-copy inventory by SHA256
7604c45e24e5b4cc84552d742a6106844c3a33236da5b94cd69c63c428ddb902.
Content identity does not authenticate Git ancestry or implementation parity.

Three fresh read-only Git probes confirm the named commit exists,the exact path
is absent from its tree,and the external working file remains untracked. Its bytes
still match the preserved comparison copy. The earlier broader14-probe local search
is reused,not newly repeated. No remote/global/unreachable-object search or historical
absence proof is claimed. No Vivarium file or Git configuration changed.

The successor explicitly joins all five earlier citation dispositions,34 ledger
occurrences,11 intake rows and343 separately reviewed supplemental paragraphs across
68 topics. The supplemental text covers every nonblank line of its identified source;
the table rows bind exact ledger lines13..23. These are documentary joins,not fresh
scientific review of every formula or independent final adequacy approval.

The three unversioned inventory links never themselves asserted the defective commit
pin. They may cite the identified present comparison bytes while historical identity
remains unverified. No guessed replacement commit,date or source parity is introduced.
Existing seam contracts remain authoritative for their executable mathematics.

Coefficient convention,fourth moments,covariance PSD,row-factor orientation and actual
Rest execution obligations remain. Bounded biology/belief/disposition/relationship
qualification does not adopt the corresponding legacy formula collection. No historical
result or source version is retroactively authenticated by this correction.

The missing claude/characterlab-research-log.md remains unresolved. The reviewed
reference/RESEARCH.md is not a replacement;the superseded plan does not establish
that the missing log's unknown findings are superseded. Recovery or an adequate explicit
source disposition remains required before the corresponding completeness claim.

SourceREV169 unchanged:10,078 assigned/1,295 unassigned;22,130 narrative/184,870 backing;
920 outside-census artifacts. This post-cutoff authority addition must participate in
the final delta review. Original receipts and occurrence IDs remain unchanged.
Next remaining retained-read/mechanism and research-authority history,then independent
source adequacy. Formula current-use citation is corrected;historical identity,legacy
log,Values90/15 and other exclusions remain open. HQ012 unstarted;exitAuditREV111
unchanged;Campaign3 NOT EXIT-READY.108 verdicts;132 bounded clauses;55/58 wrappers;
corpus0.29.0/21. No runtime test or build was needed for this documentation correction.
RO019 ACTIVE;RO021 mandatory UNSATISFIED;RO022 CLOSED. All jobs terminal.
''',encoding='utf-8',newline='\n')
rpath=P/'RESEARCH_OBLIGATIONS.json';r=load(rpath);obs=['RO-C3-010','RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
paths=[x.as_posix() for x in sorted(O.glob('*.json'))]+['docs/formal/FORMULA_SOURCE_PROVENANCE_ERRATUM.md',cp.as_posix()]
for p in paths:
 assert p not in existing
 r['reportReviews'].append(dict(path=p,obligations=obs))
 for o in r['obligations']:
  if o['id'] in obs:o['evidence'].append(p)
o=next(o for o in r['obligations'] if o['id']=='RO-C3-021')
o['unresolved']+=' HQ011 correct-forward citation (2026-10-08): FORMULA_SOURCE_PROVENANCE_ERRATUM.md identifies available comparison bytes without authenticating the unsupported historical pin. The34 ledger/11 intake/343 supplemental joins remain separately scoped. Before historical equality,require authenticated historical bytes;before final completeness,resolve or adequately disposition the missing legacy log and independently review authority/source adequacy. Reference RESEARCH is not a replacement and unknown missing-log findings are not waived. This post-cutoff erratum itself belongs in the final delta.'
rpath.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS: current formula citation corrected forward.
Start CAMPAIGN3_HISTORY_PROVENANCE_CORRECTION_CHECKPOINT.md and
docs/formal/FORMULA_SOURCE_PROVENANCE_ERRATUM.md.
Three fresh Git probes;five citation dispositions joined to34 ledger/11 intake/
343 supplemental occurrences. Current byte identity is not historical ancestry.
SourceREV169 unchanged:10078 assigned/1295 unassigned;22130 narrative/184870 backing;
920 artifacts. Prior recall batch29 tests/15 faults remains terminal and preserved.
Next remaining retained-read/mechanism and authority history;independent adequacy open.
Current inventory citation corrected;historical identity,missing legacy log,Values90/15
and prior exclusions remain OPEN. HQ012 unstarted;exitAuditREV111 unchanged.
Campaign3 NOT EXIT-READY.1519/0;108 verdicts;55/58 wrappers;132 bounded;corpus0.29.0/21.
RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED. No owner ruling or obligation closure.
'''
cur.write_text(old.decode('utf-8-sig').split('HQ-011 IN PROGRESS:')[0].replace('Updated2026-10-07','Updated2026-10-08')+route,encoding='utf-8',newline='\n')
a=Path('AGENTS.md');s=a.read_text(encoding='utf-8-sig');needle='**Current routing (2026-10-07):**';pos=s.index(needle)
a.write_text(s[:pos]+'**Current routing (2026-10-08):**\n'+route+'\n'+s[pos:].replace('**Current routing','**Prior routing',1),encoding='utf-8',newline='\n')
print(json.dumps(dict(reports=len(r['reportReviews']),added=len(paths),exactChronology=True)))
