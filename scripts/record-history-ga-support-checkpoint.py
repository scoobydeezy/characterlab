"""Record tested GA historical support reconciliation and exact provenance limits."""
from pathlib import Path
import json
P=Path('docs/planning');O=P/'campaign3-history-ga-support-rev1';I=P/'campaign3-history-source-roles-rev147'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(O/'check.json');i=load(I/'check.json');assert c['freshTests']==60 and c['sources']==6
cp=P/'CAMPAIGN3_HISTORY_GA_SUPPORT_CHECKPOINT.md';assert not cp.exists(),'Do not append chronology twice.'
text=f'''# GA historical regression and promotion support — 2026-10-07

**LOCAL DISPOSITION — no owner ruling required.** HQ-011 remains open.
Counters **1519 /0**. Six whole source receipts/18988 JSON string leaves;
12 narrative and11877 backing occurrences;14 exact bindings and5 explicit exclusions.

Fresh60 focused tests pass:45 public factory/admission,9 source-state integration
and6 content/corpus governance checks. The public test restores its actual baseline
prefix and compares the next complete save; this does not expand the historical
43-run/selected-two-checkpoint replay scope. Direct CLI startup first failed loading
the Vite config because of directory access; no tests ran. The existing config:false
programmatic harness then executed the exact three current-source files successfully.
startup-failure.json preserves the failure separately from the passing test receipt.

The original September19 full process remains FAIL:2163assertions/273files,
2154passed/9failed. Eight footprint recipes raised GA_UNADMITTED_RECIPE; one spatial
source fixture expected2graph keys butgot3. September20 preserves all2163 assertion
occurrences and adds8 footprint declaration checks, producing2171passes/273files.
The qualification identifies mixed loaded recipe versions and an implicit baseline
fixture; current integration explicitly selects allocation-spatial. This audit does
not claim to recover the original process's in-memory module bytes from its output.

Historical rollback coverage is reconciled exactly:77 assertion event names equal
the77 active types in the preserved public runs. Together with six precommit faults
at3,6,37,38,39,100 and one coverage assertion, these are84 rollback assertions.
The inspected harness proves reached injection and compares clock,state,three
allocators,queue,trace andoutputs across the failed instant. Two replacement-only
templates remain excluded. These use an internal conformance hook, not public ingress.
No fresh84rollback/2171full/328reference/build execution or RNG rollback claim.

Fresh read-only execution of the original promotion transformation reproduces the
entire current corpus text and original promotion receipt exactly. Both21-member
canonical commitments and the0.28/0.29 ExperimentIdentities are recomputed. ATTN
advances1.0.0-draft to1.1.0 with requirements unchanged; the other20 complete sections
remain identical. The0.28 runs are reused as unchanged evidence. There is no new
publication, rerun, outcome change or replacement of their original identities.
The six governance tests alone would not prove this: five cover generic/legacy
manifest behavior, while the sixth checks current row/section agreement.

The completion receipt's550 image checks mean247 predecessor plus303 successor
file commitments, all freshly hash checked. They do not mean550models. Its three
recovered verdict entries were recorded September20 without backdating executions;
the current ledger retains that correction. The historical13entry count remains
dated metadata; no exact old verdict-ledger snapshot was recovered in this search.

Two status commitments were recovered: AGENTS.md from an exact local Git blob, and
SEAM_LEDGER.md by explicit LF-to-CRLF conversion whose SHA exactly matches the old
receipt. The latter is labeled reconstruction, not original Git-byte recovery.
Five snapshots remain unavailable: OPEN_DECISIONS,CURRENT,REFERENCE_MECHANISM_LEDGER,
VERDICT_LEDGER andCAMPAIGN3_LOG. The bounded search checked current bytes, indexed
archives and local exact-path all-ref Git versions with explicit newline variants.
It makes no remote/all-object exhaustion claim. Unseen historical content is excluded
as authority; current documents are not aliases. Final HQ-011 adequacy must assess
those exclusions alongside the separately authenticated experiment evidence.

SourceREV147:{i['assignedSources']}assigned/{i['unassignedWithinThisIndex']}unassigned;
{i['originalNarrativeOrFindingOccurrences']}narrative/{i['originalBackingOccurrences']}backing;
{i['explicitArchivesOutsideCensus']}outside-census artifacts. Prior roles/artifacts unchanged.
Counts are accounting,not adequacy. No production code, model, allocation, verdict,
corpus or obligation status changed. All test processes terminal. Next GA component
qualification and its earlier owner/source/feedback/retention history; public and
component scope must remain distinct. Formula/legacy-log and earlier provenance
gaps stay explicit. HQ012unstarted; Campaign3NOTEXITREADY;108verdicts;132bounded;
55/58wrappers;corpus0.29.0/21;exitAuditREV111 unchanged.
'''
cp.write_text(text,encoding='utf-8',newline='\n')
rp=P/'RESEARCH_OBLIGATIONS.json';r=load(rp);obs=['RO-C3-002','RO-C3-003','RO-C3-004','RO-C3-005','RO-C3-006','RO-C3-007','RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
paths=[x.as_posix() for x in sorted(O.glob('*.json'))]+[(I/n).as_posix() for n in ['index.json','check.json']]+[cp.as_posix()];added=0
for p in paths:
 if p in existing:continue
 r['reportReviews'].append(dict(path=p,obligations=obs));added+=1
 for o in r['obligations']:
  if o['id'] in obs:o['evidence'].append(p)
rp.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
head=old.decode('utf-8-sig').split('HQ-011 IN PROGRESS:')[0]
route=f'''HQ-011 IN PROGRESS: GA test/failure/promotion support reconciled.
Start CAMPAIGN3_HISTORY_GA_SUPPORT_CHECKPOINT.md.
Fresh60focused tests andexactread-only21member promotion reconstruction PASS.
Original9failures preserved;8declaration checks added in2171historical passing suite.
77historicalstagefaults/6commitfaults/1coverage assertion;notfresh rollback/full/reference/build.
550filechecks=247old+303new. Recovered2oldstatus commitments;5snapshots unavailable
andexplicitlyexcluded asoldcontentauthority. CLIstartupfailure retained;alljobs terminal.
SourceREV147:{i['assignedSources']}assigned/{i['unassignedWithinThisIndex']}unassigned;{i['originalNarrativeOrFindingOccurrences']}narrative/{i['originalBackingOccurrences']}backing;{i['explicitArchivesOutsideCensus']}outside-census artifacts.
Next GENERAL_ATTENTION_COMPONENT_QUALIFICATION_REV1.json andearlier owner/source/
feedback/retention history. No owner ruling orobligationclosure. Counts notadequacy.
Formula343/Values90/15 separate;formula pin,legacylog,GAprovenance andhistoricalsource
exclusions OPEN. HQ012unstarted;exitAuditREV111unchanged. Campaign3NOTEXITREADY.
1519/0;108verdicts;55/58wrappers;132bounded;corpus0.29.0/21.
RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED.
'''
cur.write_text(head+route,encoding='utf-8',newline='\n');a=Path('AGENTS.md');text=a.read_text(encoding='utf-8-sig');needle='**Current routing (2026-10-07):**';pos=text.index(needle);text=text[:pos]+needle+'\n'+route+'\n'+text[pos:].replace('**Current routing','**Prior routing',1);a.write_text(text,encoding='utf-8',newline='\n')
print(json.dumps(dict(reports=len(r['reportReviews']),added=added,exactChronology=True)))
