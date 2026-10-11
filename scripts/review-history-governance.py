"""Review frozen process/navigation occurrences with explicit contextual source roles."""
from pathlib import Path
import json, hashlib, copy
P=Path('docs/planning');B=P/'campaign3-history-universe-rev1';O=P/'campaign3-history-governance-rev1'

def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def save(p,v):
 if p.exists():assert load(p)==v,p
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')

specs={
 'docs/planning/CAMPAIGN3_DECISION_AND_ESCALATION_POLICY.md':dict(
  role='ACCEPTED PROCESS AUTHORITY AND BOUNDED SOURCE DISPOSITION',
  rationale='Owner-directed local decision policy explicitly assigned authority by AGENTS, and explicitly adopted in the ongoing user work order. Its trial-context appendix is a scoped source choice, not a result certificate.',
  judgment='Choose conservative precedent-supported implementations locally; preserve competitors and limits. Escalate ontology/authority/new causal mechanism/foreclosed phenomenon/underdetermined architectural choice/untested reduction. Explicit perceived trial context may establish episode membership but cannot disclose causal role or success.',
  limits='Different behavior, finite scope and deterministic representation do not alone require a ruling. General observer-inferred segmentation remains an alternative, not implemented merely by this source policy.',
  reopen='A required unguided segmentation or ambiguity phenomenon, new authority boundary or genuinely new causal edge requires new evidence or architectural disposition.',
  evidence=['docs/planning/campaign3-history-authority-decisions-rev1/review.json','docs/planning/campaign3-history-research-charter-rev1/review.json']),
 'docs/planning/RESEARCH_OBLIGATIONS.md':dict(
  role='ACCEPTED BOOKKEEPING POLICY; DATED STATUS PARAGRAPHS HISTORICAL',
  rationale='Defines how findings retain owners and reciprocal evidence; explicitly says registry checks cannot certify scientific completeness. Its initial seed table and successive LEARN/BIO snapshots identify their historical scope.',
  judgment='Keep established findings distinct from hypotheses; conditional is not closed, and a retained distinction does not prove necessity. Every material claim needs owned remaining scope or an evidenced none-remaining rationale. Later literal ACTIVE/CLOSED/count statements concern their dated snapshots.',
  limits='This document does not itself select a law, satisfy mandatory corpus gates, close RO021, or supersede exact verdict evidence. The final LEARN paragraph does not reopen RO018 today.',
  reopen='Changed material claim, attempted reduction or campaign exit requires relevant obligation review; registry green cannot discharge adequacy.',
  evidence=['docs/planning/campaign3-history-ledger-core-rev1/review.json','docs/planning/campaign3-history-corpus-authority-rev1/review.json']),
 'docs/planning/CAMPAIGN3_FINAL_HISTORY_GATE.md':dict(
  role='ACCEPTED MANDATORY EXIT PROCESS; HISTORICAL IMMEDIATE ROUTING',
  rationale='Explicit owner-accepted external audit gate, reiterated by repository directives and active exit-readiness order. Its five numbered requirements define this reconciliation burden.',
  judgment='Freeze canonical source inclusion with acceptance/supersession evidence; enumerate independently of registry; account for every material occurrence, omissions and exclusions; independently assess adequacy/freshness; keep corpus/family qualification separate. Correct-forward history and failures survive.',
  limits='No requirement to inspect every obsolete draft or source line. LEARN-first and883/0 are dated routing. Conditional status means mandatory when exit is proposed, not waived or automatically an owner decision.',
  reopen='Source changes, omitted findings, unreviewed canonical additions or attempted campaign exit require this gate to be rechecked.',
  evidence=['docs/planning/HISTORY_AUTHORITY_RECONCILIATION_READINESS.md']),
 'docs/planning/CAMPAIGN3_EXIT_RECONCILIATION_READINESS.md':dict(
  role='ACCEPTED AUDIT WORK ORDER; BOUNDED REGULATORY RESULT SUMMARY',
  rationale='Direct continuation order after132 bounded clauses; explicitly withholds exit and general Campaign4 ranking. Regulatory summary is supported by the separately reviewed residual verdict.',
  judgment='Five work items preserve source authority, occurrence completeness, conditional research, freshness and separate21-member/15-family gate. Body-only failure does not establish psychological vector necessity; ScalarThreat/ScalarUncontrolled successes survive.',
  limits='1508/0 and54/57 are dated pre-Values counters. Native biology sentinels do not admit unrelated components. No whole-campaign PASS or independent adequacy follows from this work order.',
  reopen='Attempted exit/ranking, changed accepted sources or scope extensions require explicit final reconciliation and exact coverage dispositions.',
  evidence=['docs/planning/campaign3-history-ledger-residual-rev1/review.json','docs/planning/campaign3-history-verdict-spine-rev1/review.json']),
 'docs/planning/CURRENT.md':dict(
  role='FROZEN HISTORICAL ROUTING AND SUMMARY; REPLACED CURRENT INDEX',
  rationale='The document instructs replacement and chronology preservation; its snapshot dates itself2026-10-03 and cites the regulatory qualification. It is not an independent scientific result or a present live-process handle.',
  judgment='Retain original regulatory component/public scope, scalar successes, unchanged-action finding, preserved checksum finding, completed-jobs statement and explicit NOT EXIT-READY. Later Values and audit work change current counts without rewriting this snapshot.',
  limits='106 verdicts/54 producers/1508 allocation are valid dated counts, not current counts. Do not rerun matrices from a historical job mention; do not promote106-verdict AuditREV111 silently.',
  reopen='Any new summary must be checked against its own source receipt; changed current routing does not erase historical findings.',
  evidence=['docs/planning/campaign3-history-ledger-residual-rev1/review.json','docs/planning/campaign3-history-verdict-spine-rev1/review.json']),
 'README.md':dict(
  role='ACCEPTED NAVIGATION/REPOSITORY BOUNDARY; STALE STATUS SUMMARY',
  rationale='Links readers to the canonical authorities and describes source/reference separation. Its mixed Campaign2 introductory and Campaign1 current-status prose is demonstrably superseded by scoped formal closure records.',
  judgment='Active src and historical read-only reference remain separate; old code/tests alone grant no authority. Campaign0 and SEM A..I.2 summaries retain scope. SEM I.3/J later close the old parent blocker, with ONT generalization still separate.',
  limits='Campaign1 active, SEM parent P0 and missing I.3/J are historical routing, not current blockers. The README does not establish whole-phenomenon qualification or accept every linked file.',
  reopen='A changed boundary, formal contract or qualification scope must use its governing source; wider ontology requires its own proof.',
  evidence=['docs/planning/campaign3-history-foundation-decisions-rev1/review.json','docs/planning/campaign3-history-cognitive-rev1/review.json']),
 'CLAUDE.md':dict(
  role='DELEGATING AGENT NAVIGATION; NO INDEPENDENT SCIENTIFIC AUTHORITY',
  rationale='Its full content delegates to AGENTS and repeats the fresh-source/read-only-reference boundary; no behavior claim or independent mechanism is asserted.',
  judgment='Follow scoped AGENTS directives. This delegation is not an acceptance certificate for historical implementations.',
  limits='No additional scientific finding or owner decision.',reopen='Changed directive boundary requires authority review.',
  evidence=['docs/planning/campaign3-history-research-charter-rev1/review.json']),
 'docs/formal/README.md':dict(
  role='FORMAL-LAYER NAVIGATION AND READINESS RULE; DATED FOUNDATION INVENTORY',
  rationale='Explicitly ranks accepted seam versions above shared substrate/registries and states that candidate equations are not silently accepted. A link is an audit target, not a blanket version acceptance.',
  judgment='Exact executable semantics sit beneath conceptual capabilities/topology; result-changing unresolved fields block affected implementation. I.1 no numeric allocation is its historical scope; adjacent I.2 and formal decision record supply later allocation.',
  limits='Known obligations and accepted substrate do not make every draft or future seam implementation-ready; formal readiness is version-scoped.',
  reopen='New or changed result-affecting field, version or topology conflict needs explicit contract/authority resolution.',
  evidence=['docs/planning/campaign3-history-foundation-decisions-rev1/review.json','docs/planning/campaign3-history-research-charter-rev1/review.json']),
 'docs/planning/README.md':dict(
  role='PLANNING NAVIGATION; HISTORICAL SHAPE/PERSISTENCE GATE SUMMARIES',
  rationale='Explains four-ledger consultation and points to the governing sequence. VAL and C2-PERSIST links explicitly describe shape-stage pending work, subsequently resolved in the formal/factory chronology.',
  judgment='Consult applicable seam/reference/corpus/verdict obligations before sequencing. Preserve the distinction between shape, allocation, construction/restore design and executable qualification.',
  limits='Old implementation-pending summaries do not reopen qualified VAL/C2 gates; later qualification is bounded, not generic permission for uncommitted callbacks or RNG metadata.',
  reopen='Changed profile, executable commitment or persistence closure needs new proof; no general factory or corpus equivalence inferred.',
  evidence=['docs/planning/campaign3-history-campaign2-admission-rev1/review.json','docs/planning/campaign3-history-factory-rev1/review.json','docs/planning/campaign3-history-persist-i-rev1/check.json'])
}
manifest=load(B/'manifest.json');entries={e['path']:e for e in manifest['entries']}
sources=[];rows=[];units=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] in specs:units.append(u)
for source,spec in specs.items():
 e=entries[source];raw=(B/'sources'/source).read_bytes();assert hashlib.sha256(raw).hexdigest()==e['sha256']
 lines=raw.decode('utf-8-sig').splitlines(keepends=True)
 if source not in ['README.md','docs/planning/CURRENT.md']:assert Path(source).read_bytes()==raw
 selected=[u for u in units if u['source']==source]
 covered=set()
 for u in selected:
  a=u['location']['startLine'];z=u['location']['endLine'];assert ''.join(lines[a-1:z])==u['text']
  covered.update(range(a,z+1))
  rows.append(dict(occurrenceId=u['id'],source=source,sourceSha256=e['sha256'],location=u['location'],text=u['text'],**spec,obligations=['RO-C3-019','RO-C3-020','RO-C3-021']))
 assert {n for n in covered if lines[n-1].strip()}=={n for n,l in enumerate(lines,1) if l.strip()}
 sources.append(dict(path=source,sha256=e['sha256'],occurrences=len(selected),**spec))
evidence=[dict(path=p,sha256=sha(p)) for p in sorted({p for s in specs.values() for p in s['evidence']})]
# README storage instructions are a separately identified post-cutoff addition.
old=(B/'sources/README.md').read_bytes().decode('utf-8-sig');now=Path('README.md').read_bytes().decode('utf-8-sig')
start=now.index('After cloning, run `npm run evidence:restore`');end=now.index('```text',start)
addition=now[start:end];assert now[:start]+now[end:]==old
delta=dict(path='README.md',sha256=sha('README.md'),text=addition,
 role='POST-CUTOFF STORAGE INSTRUCTIONS; NOT PSYCHOLOGICAL EVIDENCE',
 disposition='Two command paragraphs explain exact-byte archive restoration and Git-index size checks. Restore validates compressed and uncompressed length/hash, refuses existing mismatches and publishes without replacement; verify does not create missing files. Size checker examines staged blobs by default, not unstaged/untracked bytes.',
 limits='Source inspection only in this review; not a fresh full archive or index execution. Staging and check before commit remain necessary.',
 evidence=[dict(path=p,sha256=sha(p)) for p in ['package.json','scripts/restore-evidence.mjs','scripts/check-git-file-sizes.mjs','evidence-archives/manifest.json']])
v=dict(status='GOVERNANCE/NAVIGATION SOURCE ROLES REVIEWED; HQ011 OPEN',sources=sources,rows=rows,evidence=evidence,postCutoff=[delta],
 obligations=['RO-C3-019','RO-C3-020','RO-C3-021'],limits=['No artifact is accepted merely because of filename, PASS label or hash. Roles derive from reviewed content and scoped later decisions.','No fresh behavior tests, archive execution, corpus pass or Campaign3 exit.','Remaining AGENTS chronology and supporting artifacts are not covered by this batch.'])
def validate(x):
 assert x==v
 assert len({r['occurrenceId'] for r in x['rows']})==len(units)
 for item in x['evidence']+x['postCutoff'][0]['evidence']:assert sha(item['path'])==item['sha256']
validate(v);faults=[]
for mode in ['missing-unmarked','stale-blocker-as-current','readme-delta-as-frozen','missing-limits']:
 x=copy.deepcopy(v)
 if mode=='missing-unmarked':x['rows'].pop(0)
 elif mode=='stale-blocker-as-current':x['sources'][5]['role']='CURRENT P0 BLOCKER'
 elif mode=='readme-delta-as-frozen':x['postCutoff']=[]
 else:x['rows'][-1]['limits']=''
 try:validate(x)
 except AssertionError:faults.append(mode)
 else:raise AssertionError(mode)
O.mkdir(exist_ok=True);save(O/'review.json',v)
c=dict(status=v['status'],sources=len(sources),wholeOriginalOccurrences=len(rows),bySource={s['path']:s['occurrences'] for s in sources},indexedWholeOccurrenceLinks=4500+len(rows),postCutoffParagraphs=2,rejectedAccountingMutations=faults,reviewSha256=sha(O/'review.json'),checkerSha256=sha(__file__))
save(O/'check.json',c);print(json.dumps(c))
