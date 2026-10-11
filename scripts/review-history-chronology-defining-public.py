"""Bind six dated coverage entries to scoped qualification and successor evidence."""
from pathlib import Path
import json,hashlib
P=Path('docs/planning');O=P/'campaign3-history-chronology-defining-public-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def save(n,v):
    p=O/n
    if p.exists():assert load(p)==v,p
    else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
roles={x['path']:x for x in load(P/'campaign3-history-source-roles-rev313/index.json')['roleAssignments']}
def evidence(*names):
    result=[]
    for name in names:
        p=P/name;r=roles[p.as_posix()]
        assert ref(p)['sha256']==r['sha256']
        for x in r.get('evidence',[]):assert ref(x['path'])['sha256']==x['sha256']
        result.append(dict(**ref(p),sourceRole=r))
    return result
sections=[
 (5838,5880,'REHEARSAL IMPLEMENTATION',evidence('CAMPAIGN3_DEFINING_PUBLIC_QUALIFICATION.md','DEFINING_NATIVE_REHEARSAL_CHECKPOINT.md'),'Carried actual cue/focal37 generates three16-publication rehearsals; it is not fresh perception or learned rehearsal intent. Attribution/use/presentation owners remain separate from memory/history/runtime protocol.68 owner continuations are not68 native runs; three native profiles/27 repeated primary prefixes are their own evidence. Final native presentation settlement deliberately extends the frozen component omission. Capacity8 can retain35 yet select another event. Absent cue has zero reads and complete event loss no publication. Preserve wrong ScheduledEvent171/130 test decoder and unreached initial zero-cap control; production unchanged.'),
 (5881,5921,'INTERNAL NATIVE COHORT',evidence('CAMPAIGN3_DEFINING_PUBLIC_QUALIFICATION.md','DEFINING_NATIVE_COHORT_CHECKPOINT.md'),'All68 selected native programs start empty S0 and compare actual acquisition,meaning,memory,rehearsal/ranking/publication.1612 settled instants and376 selected stage hashes are neither restores nor repeated prefixes.17 cases per goal/four laws are selected interventions,not a Cartesian product. Old27 repeated prefixes and54/328/build receipts remain separate. Final publication settles once; no publication creates no presentation. worldAfter pairs vary unused diagnostics,not enacted physics. Public admission remained open until its own later successor.'),
 (5922,5962,'PUBLIC IMPLEMENTATION',evidence('CAMPAIGN3_DEFINING_PUBLIC_QUALIFICATION.md','DEFINING_PUBLIC_IMPLEMENTATION_CHECKPOINT.md'),'Closed recipe/opaque model/successor identity admits exact empty S0/original calendar/zero32 seed. Real scheduler Save132 includes allocators,queue,anchors,trace and outputs; restore replays originals rather than installing decoded state. Runtime and factory guards cover publication. One CASE14 profile27 instants/eight stage matches/nine saves and three restored clocks0/39/4000 do not qualify all1680 prefixes. Reached faults38/39/42/43/4000 remain focused evidence. First Node crypto/Buffer typing rejection preceded test execution; corrected test preserves production.'),
 (5963,6003,'PUBLIC MATRIX RUNNING',evidence('CAMPAIGN3_DEFINING_PUBLIC_QUALIFICATION.md','DEFINING_PUBLIC_IMPLEMENTATION_CHECKPOINT.md'),'Archived running status and worker commands precede completed public closure,not current live jobs. Four workers preserve write-once baselines/prefixes; internal68 native cohort and focused three restores cannot substitute for all68 public programs/1680 native public prefixes. No retrospective relabeling of prior component/internal evidence. Later completion after session-context loss is bound by actual receipts and closing checks.'),
 (6004,6043,'PUBLIC CLOSURE AND NEXT AUDIT',evidence('CAMPAIGN3_DEFINING_PUBLIC_QUALIFICATION.md'),'68 public programs/model/run identities and1680 actual original-input Save132 restores yield1612 advancing/68 terminal successors with376 exact stage comparisons. Existing17/328/build receipts reverified,not fresh matrix tests. Comparison identity derives from frozen manifest and actual baseline IDs; it is not a separate pre-execution identity packet. Preserve fixedzero32 seed,selected non-Cartesian cases,carried cue,empty graph,scheduled baseline,diagnostic worldAfter and sparse idle horizon limits. No new physical sensing,autobiographical identity or universal retention law. Brief12.3-2 bounded only; final history/corpus/family obligations remain. Range includes the original608-style spanning archive/header unit6042..6043 as next-audit routing,not a new experiment.'),
]
common=evidence('MOTIVE_AUDIT_VALIDATION_FINDING_REV1.json','CAMPAIGN3_EXIT_RECONCILIATION_READINESS.md')
ss=[dict(startLine=a,endLine=b,role=k,disposition=n,acceptanceChain=e+common,obligations=['RO-C3-019','RO-C3-020','RO-C3-021']) for a,b,k,e,n in sections]
cpath=P/'campaign3-history-chronology-candidates-rev1/occurrences.json';candidate=load(cpath);rows=[]
for item in candidate['rows']:
    u=item['original'];s=[x for x in ss if x['startLine']<=u['location']['startLine']<=x['endLine']]
    if not s:continue
    assert len(s)==1 and u['location']['endLine']<=s[0]['endLine']
    rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],sectionStartLine=s[0]['startLine'],disposition='DATED CLAIM/ROUTING; bound section specifies scoped acceptance and supersession'))
priorPaths=[P/f'campaign3-history-chronology-{n}-rev1/review.json' for n in ['tail','integration','cognition','coverage','development-audits','development-workers','development-scope']]
prior=[r for p in priorPaths for r in load(p)['rows']]
ids=[r['occurrenceId'] for r in prior+rows];assert len(ids)==len(set(ids))
O.mkdir(exist_ok=True)
save('review.json',dict(status='FIVE DEFINING PUBLIC ENTRIES RECONCILED; WHOLE LOG OPEN',checker=ref('scripts/review-history-chronology-defining-public.py'),candidates=ref(cpath),resolvedSource=candidate['resolvedSource'],sections=ss,rows=rows,priorReviews=[ref(p) for p in priorPaths],limits=['No runtime tests or original writer rerun. Historical counts are not fresh execution.','No whole-log assignment or HQ011 closure. Original bytes and occurrence identities preserved.']))
save('findings.json',{'status': 'OWNED LIMITS PRESERVED', 'findings': [{'owner': 'RO-C3-021', 'distinction': 'Owner continuations,internal native stages,focused public restores and complete public matrix differ.', 'blockedClaim': 'Stage hashes or component/internal case counts discharge public Save132 admission.', 'reopen': 'A broader runtime or replay claim requires matching actual admission and restore evidence.'}, {'owner': 'RO-C3-020', 'distinction': 'Carried cue,scheduled baseline and diagnostic worldAfter are explicit controls.', 'blockedClaim': 'This profile proves learned rehearsal intent,fresh sensing,physical hidden-world intervention or general ageing.', 'reopen': 'A required phenomenon depends on those missing sources or mechanisms.'}, {'owner': 'RO-C3-021', 'distinction': 'Comparison identity was derived from frozen manifest and actual baseline identities.', 'blockedClaim': 'A separate comparison identity packet was prospectively frozen before these executions.', 'reopen': 'Final research-method adequacy must judge the actual chronology rather than rewrite it.'}, {'owner': 'RO-C3-020', 'distinction': 'Native final presentation settlement extends the frozen component.', 'blockedClaim': 'Component final history already included the later native append or retained memory is necessarily selected.', 'reopen': 'New retrieval consumers must preserve content,selection,use and settlement ownership.'}]})
save('check.json',dict(status='PASS SCOPED CHRONOLOGY ACCOUNTING; HQ011 OPEN',sections=len(ss),newOccurrences=len(rows),priorOccurrences=len(prior),cumulativeReviewed=len(ids),remainingOriginalOccurrences=len(candidate['rows'])-len(ids),review=ref(O/'review.json')))
assert all(p.stat().st_size<50_000_000 for p in O.iterdir())
print(json.dumps(load(O/'check.json')))
