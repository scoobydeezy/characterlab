from pathlib import Path
import json,hashlib
P=Path('docs/planning');O=P/'campaign3-history-ga-significance-decisions-rev1';B=P/'campaign3-history-universe-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def save(p,v):
 if p.exists():assert load(p)==v
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
def walk(v,p=''):
 if isinstance(v,dict):
  for k,x in v.items():yield from walk(x,p+'/'+k)
 elif isinstance(v,list):
  for i,x in enumerate(v):yield from walk(x,p+'/'+str(i))
 elif isinstance(v,str):yield p,v
common='Historical decisions and trusted component scope only. Accepted source/qualification/target/focus choices do not themselves qualify governed producer binding,public reads,result identity,atomic committed writes,Save132 or old-important-memory behavior. Later source/owner receipts remain separately scoped. No truth veto or reconstruction,law retirement or new owner ruling.'
outcome='Concern-relative observed consequence selected first;expectation-relative surprise remains independent candidate. Supported attribution grants target eligibility,not significance or write authority. Use can be earned even on Unavailable and cannot stand for significant attributed consequence. Concern legitimately available at assessment time,committed historical assessment not recomputed after later change. Missing concern/evidence is Unavailable,not assessed zero. Same evidence/different concerns may differ;physical magnitude is not significance. False-but-supported attribution may credit wrong target without truth veto. Equal use is necessary to isolate significance. No relabeling TaskConcern,pressure,REG,reserves,sample or authored flag;goal versus durable preference/storage/priority not selected in this initial ruling.'
qualification='Both determinate closer and farther qualify under coarse binary candidate;deterioration-only remains comparator. SameDistance assessed but not qualifying;indeterminate and missing are distinct unavailable causes. Equal-distance opposite-side crossing retains position but no qualification;positional law remains independent. Tiny/large and outside-to-outside progress prevent magnitude or boundary-only substitution. No pressure,count,use or emotional-valence inference. Actual relation component supplies basis,not authored label. Historical18 tests comprise4qualification+8relation+6lifecycle;four old mutations remain report-only here. Current qualification has7 cases including3 later narrow-projection controls preserving direction/nonqualification/absence causes without numeric basis or goal-state recovery. Those later cases do not retroactively broaden original18.'
target='Only explicitly attributed currently surviving semantic children get significance;incidental sibling and consumed stationary evidence do not. Use follows actual consumption,target credit needs attribution plus qualifying assessment. Whole-acquisition contextual spread remains separate hypothesis,not implied by grouping. Duplicate targets normalize once,foreign/lost/missing reject;hidden truth cannot correct targethood. Supplied normalizer checks owner equality,canonical address ordering,extant child and detached result using fragmentation validation without applying loss. Symbol/byte equality and read membership do not establish causal role. No new fragment identity,history resolver or write. REV1 boundary order expectation failed;accepted resolution says fixture expectation corrected to canonical byte order with implementation unchanged. REV2 preserves corrected10/10;current six boundary tests separately verified.'
focus='One prebound observer-side focal consequence/episode-specific child selected before verdict;Supported targets it,Unavailable none. Supporting same-key stroke and stationary children may earn use but no automatic targethood. Duplicate views do not multiply targets;cross-episode retrospective spread remains distinct from whole-acquisition sibling spread. Trusted focus captures detached subject/observer/consequence and strictly prior extant child;actual retained-use evaluation and session-local one-shot finish produce candidates,not committed public writes. Supplied consequence symbol does not authenticate origin,connection evidence or hypothesis selection. Whether focal trial belongs to four is not decided here;no fifth trial inferred. Actual partial Unavailable use is preserved;copied/foreign/replayed tokens rejected. Old20 comprises5focal+9use+6boundary,not20focal cases.'
replay=load(O/'replay.json');assert len(replay['sourcePaths'])==13
for f in replay['inputs']+replay['reused']+[replay['tests'],replay['checker'],replay['initialChecker'],replay['failedFinalizer']]:assert ref(f['path'])==f
fresh=load(replay['tests']['path']);assert fresh['numPassedTests']==fresh['numTotalTests']==27 and fresh['numFailedTests']==0
names={a['fullName'] for t in fresh['testResults'] for a in t['assertionResults']};entries={e['path']:e for e in load(B/'manifest.json')['entries']};assigned={r['path'] for r in load(P/'campaign3-history-source-roles-rev169/index.json')['roleAssignments']};roles=[];strings={};historical=[];failures=[]
for p in replay['sourcePaths']:
 n=Path(p).name;note=outcome if 'OUTCOME_SIGNIFICANCE' in n else qualification if 'SIGNIFICANCE_QUALIFICATION' in n else focus if 'FOCAL_ATTRIBUTION' in n or 'ATTRIBUTION_FOCUS' in n else target
 assert p not in assigned and ref(p)['sha256']==entries[p]['sha256']
 if p.endswith('.json'):
  v=load(p)
  for ptr,value in walk(v):strings[p,ptr]=value
  if 'testResults' in v:
   tests=[a for t in v['testResults'] for a in t['assertionResults']];matched=sum(a['fullName'] in names for a in tests)
   for a in tests:
    if a['status']=='failed':failures.append(dict(source=ref(p),name=a['fullName'],messages=a['failureMessages']))
   historical.append(dict(source=ref(p),total=v['numTotalTests'],passed=v['numPassedTests'],failed=v['numFailedTests'],freshNameMatches=matched,reportOnly=len(tests)-matched))
   note+=f" Historical{v['numPassedTests']}/{v['numTotalTests']};{matched} names match current cases,{len(tests)-matched} report-only. Overlapping reports are not independent cases and name equality does not authenticate old implementation."
 roles.append(dict(**ref(p),role='SIGNIFICANCE/ATTRIBUTION DECISION HISTORY; CONSUMED EVIDENCE,TARGET AND ASSESSMENT DISTINCT',judgment=note+' '+common,acceptanceChain=[ref(O/'replay.json'),*replay['reused']]))
assert len(failures)==1
specs={r['path']:r['judgment'] for r in roles};rows=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in specs:continue
  ptr=u['location'].get('pointer','');assert u['sourceSha256']==entries[u['source']]['sha256']
  if u['source'].endswith('.json'):assert strings[u['source'],ptr]==u['text']
  narrative=u['source'].endswith('.md') or any(k in ptr.split('/') for k in ['fullName','title','failureMessages'])
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],role='NARRATIVE AUTHORITY/FINDING' if narrative else 'TYPED EVIDENCE BACKING',judgment=specs[u['source']]))
r=dict(status='SIGNIFICANCE DECISION HISTORY RECONCILED;HQ011 OPEN',sourceRoles=roles,rows=rows,stringLeaves=len(strings),preservedArtifacts=[],historicalTests=historical,developmentFailures=failures,auditDevelopmentFindings=[replay['developmentFinding'],replay['finalizerFinding']],limits=[common,*replay['limits']])
c=dict(status='PASS;HQ011 OPEN',sources=len(roles),originalNarrativeOccurrences=sum(x['role'].startswith('NARRATIVE') for x in rows),originalBackingOccurrences=sum(x['role'].startswith('TYPED') for x in rows),stringLeaves=len(strings),freshTests=27,historicalTestOccurrences=sum(x['total'] for x in historical),historicalTestReports=len(historical),preservedFailedAssertions=1,auditWrapperFindings=2,recoveredArtifacts=0,checker=ref(__file__))
save(O/'review.json',r);save(O/'check.json',c);print(json.dumps(c))
