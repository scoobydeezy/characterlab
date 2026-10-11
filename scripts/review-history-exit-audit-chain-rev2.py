from pathlib import Path
import json,hashlib,re,collections
P=Path('docs/planning');O=P/'campaign3-history-exit-audit-chain-rev1';O.mkdir(exist_ok=True)
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def save(p,v):
 if p.exists():assert load(p)==v
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
snapshots=[];rationales=collections.defaultdict(list);previous=None;verdictChanges=[]
for revision in range(1,112):
 path=P/f'CAMPAIGN3_EXIT_AUDIT_REV{revision}.json';v=load(path);c=v['counts']
 assert v['disposition']=='NOT EXIT-READY'
 assert v['scope']=='Documentation coverage audit, not behavioral execution or all-history completeness certification.'
 assert tuple(c[k] for k in ['members','corpusFields','families','briefCases'])==(21,219,15,132)
 assert len(v['corpus']['members'])==21 and sum(len(m['clauses']) for m in v['corpus']['members'])==219
 assert len(v['brief']['families'])==15 and sum(len(f['clauses']) for f in v['brief']['families'])==132
 assert len(set(v['verdicts']))==len(v['verdicts'])
 if previous:
  pre=v['predecessor'];assert pre['path']==(P/f'CAMPAIGN3_EXIT_AUDIT_REV{revision-1}.json').as_posix();assert ref(pre['path'])['sha256']==pre['sha256']
  assert v['corpus']['version']==previous['corpus']['version'] and v['corpus']['digest']==previous['corpus']['digest']
  assert v['finalHistoricalGate']['status']=='NOT SATISFIED'
  verdictChanges.append(dict(revision=revision,added=sorted(set(v['verdicts'])-set(previous['verdicts'])),removed=sorted(set(previous['verdicts'])-set(v['verdicts']))))
 for i,m in enumerate(v['corpus']['members']):rationales[m['rationale']].append(dict(source=path.as_posix(),pointer=f'/corpus/members/{i}/rationale'))
 for i,f in enumerate(v['brief']['families']):
  rationales[f['rationale']].append(dict(source=path.as_posix(),pointer=f'/brief/families/{i}/rationale'))
  for j,clause in enumerate(f['clauses']):rationales[clause['rationale']].append(dict(source=path.as_posix(),pointer=f'/brief/families/{i}/clauses/{j}/rationale'))
 snapshots.append(dict(source=ref(path),revision=revision,date=v['date'],counts=c,counters=v['counters'],verdicts=len(v['verdicts']),briefClauseStatuses=dict(collections.Counter(cl['status'] for f in v['brief']['families'] for cl in f['clauses'])),familySummaryStatuses=dict(collections.Counter(f['status'] for f in v['brief']['families'])),historicalGate=v.get('finalHistoricalGate'),wrapperGate=v.get('publicWrapperGate'),predecessor=v.get('predecessor')))
 previous=v
spinePath=P/'campaign3-history-verdict-spine-rev1/review.json';spine=load(spinePath)
frozen=P/'campaign3-history-universe-rev1/sources/docs/planning/VERDICT_LEDGER.md';current=P/'VERDICT_LEDGER.md';a=frozen.read_bytes();b=current.read_bytes()
assert b.startswith(a) and len(a)==spine['delta']['unchangedPrefixBytes']
assert ref(frozen)['sha256']==spine['delta']['frozenSha256'];assert ref(current)['sha256']==spine['delta']['currentSha256']
names=lambda raw:re.findall(r'^##\s+`?(VER-[A-Z0-9-]+)',raw.decode('utf-8-sig'),re.M)
oldNames=names(a);newNames=names(b);assert oldNames==previous['verdicts'];assert len(oldNames)==106 and len(newNames)==108
assert newNames[106:]==['VER-C3-VALUES-001','VER-C3-VALUES-PUBLIC-001']==spine['delta']['addedVerdicts']
wrapper=P/'VALUES_WRAPPER_EXTENSION_REV1.json';w=load(wrapper);assert w['status']=='PASS' and w['producers']==55 and w['factories']==58
assert snapshots[-1]['counters']=={'highestAllocatedRecordType':1508,'allocatedSinceVerdict':0}
assert snapshots[-1]['briefClauseStatuses']=={'QUALIFIED BOUNDED':132}
assert snapshots[-1]['familySummaryStatuses']=={'PARTIAL':15}
reviewQueue=[dict(text=text,occurrences=where,status='SEMANTIC DELTA REVIEW PENDING; NOT ACCEPTED BY THIS CHAIN CHECK') for text,where in sorted(rationales.items())]
save(O/'rationale-review-queue.json',dict(status='EXTRACTED REPEATED RATIONALES; SEMANTIC REVIEW PENDING',uniqueTexts=len(reviewQueue),occurrences=sum(len(x['occurrences']) for x in reviewQueue),rows=reviewQueue,limits=['Only rationale fields;sourceText,predecessor dispositions,inventory annotations and other short/long strings still need source-role review. Exact repetition preserves every pointer but does not establish contextual equivalence.']))
v=dict(status='AUDIT CHAIN AND POST-CUTOFF VERDICT DELTA VERIFIED; SEMANTIC SOURCE ACCEPTANCE PENDING',checker=ref(__file__),initialChecker=ref('scripts/review-history-exit-audit-chain.py'),developmentFinding='Initial parser accepted only backtick-quoted headings and extracted72 of106. Corrected optional-backtick heading grammar preserves all106 original IDs;no source/audit changed.',snapshots=snapshots,verdictChanges=verdictChanges,sourceCount=111,predecessorLinks=110,unchangedDenominators=dict(corpusMembers=21,corpusFields=219,briefFamilies=15,briefClauses=132),lastSnapshot=ref(P/'CAMPAIGN3_EXIT_AUDIT_REV111.json'),currentDelta=dict(frozenLedger=ref(frozen),currentLedger=ref(current),unchangedPrefixBytes=len(a),frozenVerdicts=106,currentVerdicts=108,addedVerdicts=newNames[106:],frozenAllocation=1508,currentAllocation=1519,frozenWrapper=[54,57],currentWrapper=[55,58],evidence=[ref(spinePath),ref(wrapper),ref(P/'CAMPAIGN3_HISTORY_VALUES_ADDITION_CHECKPOINT.md'),ref(P/'CAMPAIGN3_VALUES_PUBLIC_QUALIFICATION.md')]),rationaleQueue=ref(O/'rationale-review-queue.json'),limits=['Chain integrity is not scientific or whole-source adequacy. The111 snapshots and shared Markdown report remain unassigned in source-roleREV171.','REV111 retains132 bounded clauses but15 PARTIAL family summary labels;do not infer joint family integration or silently normalize them.','All111 snapshots say NOT EXIT-READY. RO021 remains unsatisfied;RO022 publication scope differs across time. Current108 verdicts/1519 allocation/55x58 wrapper do not silently update frozen106/1508/54x57.','No corpus freshness,simulation,tests or build run. Values stronger readiness cases remain open as explicitly reviewed.','The181 unique rationale texts are a pending semantic review queue,not181 resolved findings. All other schema fields and post-cutoff additions still require review.'],obligations=['RO-C3-019','RO-C3-020','RO-C3-021'])
assert len(reviewQueue)==181
save(O/'review.json',v);c=dict(status='PASS;STRUCTURAL CHAIN ONLY',snapshots=111,predecessorLinks=110,rationaleTexts=181,rationaleOccurrences=sum(len(x['occurrences']) for x in reviewQueue),addedVerdicts=newNames[106:],sourceRolesPromoted=0,review=ref(O/'review.json'),checker=ref(__file__))
save(O/'check.json',c);print(json.dumps(c))
