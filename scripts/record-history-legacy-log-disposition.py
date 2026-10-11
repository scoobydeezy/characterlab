"""Apply the owner's explicit legacy-log disposition without inventing byte ancestry."""
from pathlib import Path
from functools import cache
import json,hashlib
P=Path('docs/planning');O=P/'campaign3-history-legacy-log-disposition-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
@cache
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def ref(p):return dict(path=Path(p).as_posix(),sha256=sha(p))
def save(p,v):
    if p.exists():assert load(p)==v,p
    else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
source=Path('reference/RESEARCH.md');frozen=P/'campaign3-history-universe-rev1/sources/reference/RESEARCH.md'
assert sha(source)==sha(frozen)=='bb0dde27fa64b34836ea5c182e2d96ad9aff6606c4dec8868556ddd703ea55e3'
rootpath=P/'campaign3-history-root-accounting-rev1/review.json';roots=load(rootpath)
root=next(r for r in roots['sources'] if r['path']==source.as_posix());assert root['occurrences']==339
review_paths=[P/f'campaign3-history-{n}-rev1/review.json' for n in ['research-early','research-censoring','research-salience','research-identity']]
rows=[dict(review=ref(p),row=i,occurrenceId=r['occurrenceId'],location=r['location'],text=r['text']) for p in review_paths for i,r in enumerate(load(p)['rows'])]
assert len(rows)==len({r['occurrenceId'] for r in rows})==339
assert {r['occurrenceId'] for r in rows}==set(root['occurrenceIds'])
lines=source.read_bytes().decode('utf-8-sig').splitlines(keepends=True)
for r in rows:assert r['text']==''.join(lines[r['location']['startLine']-1:r['location']['endLine']])
cp=P/'CAMPAIGN3_LEGACY_RESEARCH_LOG_DISPOSITION.md';assert not cp.exists()
cp.write_text('''# Legacy research-log disposition — owner clarification, 2026-10-11

**OWNER DIRECTIVE — proceed using reference/RESEARCH.md; legacy recovery is not a gate.**
Counters1519 /0. HQ-011 work resumes under the existing escalation policy.

The owner states: “As far as I know, that file was replaced and superceded by
RESEARCH.md. If the file is not present on the system, we need to proceed without it.”

Apply reference/RESEARCH.md as the retained research-log successor for current
reconciliation. Searches did not recover claude/characterlab-research-log.md within
their recorded local scope. Do not continue searching or block HQ-011 solely to
authenticate that unavailable legacy file. Its old companion citation is historical,
superseded for current use by this explicit owner disposition.

The owner's recollection supports the replacement direction; it is not a recovered
rename commit or proof of byte equality. No claim is made that unknown old contents
are identical to, or individually traced into, the successor. That uncertainty is
preserved as historical provenance, not reinstated as the blocker the owner removed.
No lost finding is invented, silently declared false, or used to select a law.

The retained source has exact SHA256
bb0dde27fa64b34836ea5c182e2d96ad9aff6606c4dec8868556ddd703ea55e3,
matching its frozen census copy. All339 source-located occurrences are covered by
the four existing early/censoring/salience/identity content reviews, with no missing
or duplicate IDs; their exact text and locations were rechecked. Their substantive
limits, rejected cohorts, controls and owned unresolved findings remain in force.

This supersedes the missing-log blocker in the HQ-009/HQ-011 adequacy and gap
consequence reports, and the legacy-log paragraph of the formula provenance erratum,
for current routing. Those historical receipts remain unchanged. The formula
erratum's own corrected comparison identity, unsupported commit-pin limit and
mathematical cautions remain valid. Its post-cutoff review is explicitly joined here.

This resolves the legacy-source routing question. It does not close RO-C3-021 or
promote Campaign3 exit, excuse a known unaccounted material finding, authenticate
other missing source commitments or reopen any scientific law. The208 known-hash
gaps retain their scoped claim restrictions. Assess their actual evidentiary impact
under the final-history gate, which does not require every obsolete draft or source
line; do not turn missing historical bytes alone into another blanket stop.

Continue the remaining adequacy decision and HQ-012 handoff assessment. All original
source-role/census identities remain unchanged. No original runtime/writer/build/test
rerun, new verdict, corpus promotion or architectural decision. Dedicated UI remains
deferred. RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED. Campaign3 NOT EXIT-READY.
''',encoding='utf-8',newline='\n')
O.mkdir(exist_ok=True)
erratum=Path('docs/formal/FORMULA_SOURCE_PROVENANCE_ERRATUM.md')
save(O/'decision.json',dict(status='OWNER-DIRECTED SUCCESSOR ADOPTED; LEGACY RECOVERY BLOCKER REMOVED',ownerInstruction='As far as I know, that file was replaced and superceded by RESEARCH.md. If the file is not present on the system, we need to proceed without it.',authority=ref(cp),legacyPath='claude/characterlab-research-log.md',retainedSource=ref(source),frozenSource=ref(frozen),rootAccounting=ref(rootpath),reviewedOccurrences=rows,postCutoffProvenanceJoin=dict(erratum=ref(erratum),review=ref(P/'campaign3-history-provenance-correction-rev1/review.json'),supersededScope='Only the legacy-log recovery prerequisite is superseded by owner direction. Unsupported formula pin, exact comparison bytes and mathematical limits remain.'),supersededRouting=[ref(P/'CAMPAIGN3_HISTORY_HQ011_ADEQUACY_CHECKPOINT.md'),ref(P/'campaign3-history-hq011-adequacy-rev1/review.json'),ref(P/'campaign3-history-gap-consequences-rev1/review.json')],limits=['Owner-directed current authority, not authenticated byte ancestry or recovery of unknown old contents.','Do not continue treating this legacy file as a prerequisite or repeat the archive request.','Other material claims retain their evidence limits and require independent adequacy; no automatic whole-campaign acceptance.'],obligations=['RO-C3-019','RO-C3-020','RO-C3-021']))
save(O/'check.json',dict(status='PASS OWNER DISPOSITION AND SUCCESSOR COVERAGE',successorOccurrences=339,omissions=0,duplicates=0,legacyRecoveryRequired=False,remainingKnownHashTargets=208,decision=ref(O/'decision.json')))
rp=P/'RESEARCH_OBLIGATIONS.json';registry=load(rp);obs=['RO-C3-019','RO-C3-020','RO-C3-021']
existing={x['path'] for x in registry['reportReviews']}
paths=[p.as_posix() for p in sorted(O.glob('*.json'))]+[cp.as_posix()]
for path in paths:
    assert path not in existing
    registry['reportReviews'].append(dict(path=path,obligations=obs))
    for ob in registry['obligations']:
        if ob['id'] in obs:ob['evidence'].append(path)
ob=next(o for o in registry['obligations'] if o['id']=='RO-C3-021')
ob['established']+=' Owner clarification2026-10-11 adopts reference/RESEARCH.md as the current retained successor to the unavailable legacy log and explicitly directs proceeding without the old file. All339 successor occurrences are reverified against existing content reviews. See CAMPAIGN3_LEGACY_RESEARCH_LOG_DISPOSITION.md; no byte-ancestry or unknown-content equivalence claim.'
ob['unresolved']+=' Current owner disposition2026-10-11 supersedes earlier statements requiring legacy-log recovery or forbidding current replacement by reference/RESEARCH.md. Missing legacy bytes are no longer a gate. Preserve historical uncertainty without reinstating that blocker. Remaining known material claims, other source limits and final corpus/family/native acceptance are unchanged.'
rp.write_text(json.dumps(registry,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 resumed by owner clarification: legacy research-log recovery is NOT a gate.
Start CAMPAIGN3_LEGACY_RESEARCH_LOG_DISPOSITION.md.
Use reference/RESEARCH.md as the retained successor;339 exact occurrences reverified.
Historical byte ancestry remains unproven but is not a reason to stop or search again.
Prior HQ011 missing-log blocker superseded; other208 known-hash gaps keep scoped limits.
Formula provenance erratum/review explicitly joined; its formula cautions remain.
Next conclude independent adequacy under explicit source dispositions, then assess HQ-012.
REV315 unchanged:11373 roles /413894 original occurrences /2825 backing resources.
Counters1519 /0;108 verdicts;55 /58 wrappers;132 bounded clauses;corpus0.29.0 /21.
RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED. Campaign3 NOT EXIT-READY.
'''
cur.write_text(old.decode('utf-8-sig').split('HQ-011')[0]+route,encoding='utf-8',newline='\n')
a=Path('AGENTS.md');text=a.read_text(encoding='utf-8-sig');needle='**Current routing (2026-10-11):**';pos=text.index(needle)
a.write_text(text[:pos]+needle+'\n'+route+'\n'+text[pos:].replace('**Current routing','**Prior routing',1),encoding='utf-8',newline='\n')
print(json.dumps(dict(reports=len(registry['reportReviews']),added=len(paths),legacyBlockerRemoved=True,successorOccurrences=339)))
