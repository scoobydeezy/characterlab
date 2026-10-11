"""Bind six dated coverage entries to scoped qualification and successor evidence."""
from pathlib import Path
import json,hashlib
P=Path('docs/planning');O=P/'campaign3-history-chronology-development-workers-rev1'
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
 (6248,6294,'REV2 HISTORICAL EXECUTION',evidence('DEVELOPMENT_PUBLIC_IMPLEMENTATION_CHECKPOINT.md','CAMPAIGN3_DEVELOPMENT_PUBLIC_QUALIFICATION.md','DEVELOPMENT_PUBLIC_HARNESS_REV2_FINDING.json'),'REV1 four programs/94 actual restore receipts survive intentional stops. REV2 substitutes structural canonical decoding only for the trusted final-trace RNG audit reader; public/input/state validation and actual Save132/original-input successor checks remain. Twelve partitions do not change36 model/run identities,seeds or fixtures. Earlier hashes and four completed full trace audits must match again. Implementation primary18 rows/234 traces and21 focused tests did not by themselves qualify full668 native prefixes. Archived worker IDs and write commands are superseded historical routing,not present execution instructions.'),
 (6295,6347,'REV3 WATCHER CORRECTION',evidence('DEVELOPMENT_PUBLIC_IMPLEMENTATION_CHECKPOINT.md','CAMPAIGN3_DEVELOPMENT_PUBLIC_QUALIFICATION.md','DEVELOPMENT_PUBLIC_HARNESS_REV2_FINDING.json','DEVELOPMENT_PUBLIC_HARNESS_REV3_FINDING.json'),'REV3 changes only Vite watch=null for frozen batch execution. Five-second profile sampled4677 idle versus2 program samples with filesystem backlog;3.209-second no-watch probe is startup evidence,not matrix throughput or psychological behavior. REV1 has94 restores,REV2 has99 receipts with overlap,union113. These are not193 unique prefixes. All originals and successful restore lineage remain; final qualification reexecutes113 and adds555,not duplicate counting. No source/model/fixture or public validation weakened.'),
 (6348,6405,'OPERATIONAL HEAP CAP',evidence('DEVELOPMENT_PUBLIC_IMPLEMENTATION_CHECKPOINT.md','CAMPAIGN3_DEVELOPMENT_PUBLIC_QUALIFICATION.md','DEVELOPMENT_PUBLIC_WORKER_MEMORY_REV1.json','DEVELOPMENT_PUBLIC_HARNESS_REV3_FINDING.json'),'At173 REV3 prefixes/four completed programs,twelve workers used roughly23GB resident with roughly2GB free. Intentional stops and unchanged-harness resume with1536MB V8 old-space cap are operational changes,not failed behavioral assertions or completed native qualification. Historical statuses do not establish live jobs now. Preserve completed receipt identity rather than restarting from progress estimates; component668 restores remain distinct from native668.'),
 (6406,6466,'HEAP FAILURE AND QUEUED RECOVERY',evidence('DEVELOPMENT_PUBLIC_IMPLEMENTATION_CHECKPOINT.md','CAMPAIGN3_DEVELOPMENT_PUBLIC_QUALIFICATION.md','DEVELOPMENT_PUBLIC_WORKER_MEMORY_FAILURE_REV1.json','DEVELOPMENT_PUBLIC_HARNESS_REV3_FINDING.json'),'Eight parts4..11 failed V8 allocation after prefix16 under1536MB cap;280 prefix receipts and four complete programs survived. Remaining workers were deliberately stopped. Some original tool stack output was truncated,so summary is not complete stderr; separate parts8..11 evidence remains. Four concurrent4096MB workers queue the same12 partitions without production/model changes. The later native closure resolves execution status,not a low-memory or long-horizon scaling claim. Preserve original failure and successful-prefix lineage without adding cumulative checkpoints to final668 distinct prefixes.'),
]
common=evidence('MOTIVE_AUDIT_VALIDATION_FINDING_REV1.json','CAMPAIGN3_EXIT_RECONCILIATION_READINESS.md')
ss=[dict(startLine=a,endLine=b,role=k,disposition=n,acceptanceChain=e+common,obligations=['RO-C3-019','RO-C3-020','RO-C3-021']) for a,b,k,e,n in sections]
cpath=P/'campaign3-history-chronology-candidates-rev1/occurrences.json';candidate=load(cpath);rows=[]
for item in candidate['rows']:
    u=item['original'];s=[x for x in ss if x['startLine']<=u['location']['startLine']<=x['endLine']]
    if not s:continue
    assert len(s)==1 and u['location']['endLine']<=s[0]['endLine']
    rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],sectionStartLine=s[0]['startLine'],disposition='DATED CLAIM/ROUTING; bound section specifies scoped acceptance and supersession'))
priorPaths=[P/f'campaign3-history-chronology-{n}-rev1/review.json' for n in ['tail','integration','cognition','coverage','development-audits']]
prior=[r for p in priorPaths for r in load(p)['rows']]
ids=[r['occurrenceId'] for r in prior+rows];assert len(ids)==len(set(ids))
O.mkdir(exist_ok=True)
save('review.json',dict(status='FOUR DEVELOPMENT EXECUTION ENTRIES RECONCILED; WHOLE LOG OPEN',checker=ref('scripts/review-history-chronology-development-workers.py'),candidates=ref(cpath),resolvedSource=candidate['resolvedSource'],sections=ss,rows=rows,priorReviews=[ref(p) for p in priorPaths],limits=['No runtime tests or original writer rerun. Historical counts are not fresh execution.','No whole-log assignment or HQ011 closure. Original bytes and occurrence identities preserved.']))
save('findings.json',{'status': 'OWNED LIMITS PRESERVED', 'findings': [{'owner': 'RO-C3-021', 'distinction': 'Revision receipt counts overlap and require original-prefix identity accounting.', 'blockedClaim': '94+99 historical receipts or repeated replay add distinct native cases.', 'reopen': 'Any future reuse requires exact original-source hashes and declared unique denominators.'}, {'owner': 'RO-C3-020', 'distinction': 'Operational trace/watch/heap revisions do not change psychological laws or public validation.', 'blockedClaim': 'Successful recovery proves low-memory,long-horizon scalability or erases allocation failures.', 'reopen': 'A required scaling claim needs a separately declared resource/horizon experiment.'}, {'owner': 'RO-C3-021', 'distinction': 'Historical running sessions and partial captures are dated routing.', 'blockedClaim': 'Old session IDs prove current live computation or qualify an incomplete matrix.', 'reopen': 'Resume only against authoritative current process state and preserved receipt identity.'}]})
save('check.json',dict(status='PASS SCOPED CHRONOLOGY ACCOUNTING; HQ011 OPEN',sections=len(ss),newOccurrences=len(rows),priorOccurrences=len(prior),cumulativeReviewed=len(ids),remainingOriginalOccurrences=len(candidate['rows'])-len(ids),review=ref(O/'review.json')))
assert all(p.stat().st_size<50_000_000 for p in O.iterdir())
print(json.dumps(load(O/'check.json')))
