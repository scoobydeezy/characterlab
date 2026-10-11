"""Receiving and enacted-domain historical proof, with separate scope limits."""
from pathlib import Path
import json,hashlib,subprocess,copy
from fractions import Fraction as F
P=Path('docs/planning');O=P/'campaign3-history-cross-context-successor-rev1';B=P/'campaign3-history-universe-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def walk(v,p=''):
 if isinstance(v,dict):
  for k,x in v.items():yield from walk(x,p+'/'+k)
 elif isinstance(v,list):
  for i,x in enumerate(v):yield from walk(x,p+'/'+str(i))
 elif isinstance(v,str):yield p,v
specs={}
def add(n,j):specs[(P/n).as_posix()]=j
specs['docs/formal/CROSS_CONTEXT_DOMAINS_COMPONENT_CONTRACT.md']='Accepted enacted-domain0.1: authenticate original actor/action through actual Attempt432/Plan431/Intent425/Resolution409; parcel ownership, private communication and attendance change independently of expression meaning. Separate holder states, safe display, transport/execution/access gates; whole-wrapper busy publication/rollback. Component only, no public/native admission.'
add('CROSS_CONTEXT_RECEIVING_PROTOCOL.md','Prospective all-seed successor using unchanged six models:144 executions18 repeated/126 new,864 prefixes756 new. Exact context-subset fold and matched receiving controls preserve all equal seeds. Receiving only, not enacted-domain proof.')
add('CAMPAIGN3_CROSS_CONTEXT_QUALIFICATION.md','VER-C3-CROSS-CONTEXT-001 closes original semantic-only and cancellation-control gaps within component scope. Matched same-context SeparateContext vsNoFeedback4/8 changes; missing meaning removes influence, reversed meaning redirects it without history rewrite.55 actual-domain compositions preserve original identity/330 embedded saves. No natural recognition/native integration/enacted coercion. Raw changedChoice across action vocabularies is not causal identity evidence.')
for pre,label in [('RECEIVING','144 all-seed receiving executions,18 repeated126 new'),('DOMAINS','55 enacted-domain compositions')]:
 add(f'CROSS_CONTEXT_{pre}_PLAN_REV1.json',f'Whole canonical model/run/experiment/comparison plan for {label} freshly reconstructs. Receiving retains original six models; domains have six new composition identities. Historical matrices separate from current identity reconstruction.')
 add(f'CROSS_CONTEXT_{pre}_RESULT_REV1.json',f'Original {label} aggregate and four part receipts match exactly. Independent receiving subset/world/knowledge calculations checked; prefix replays historical, not freshly rerun.')
 for i in range(4):add(f'CROSS_CONTEXT_{pre}_PART{i}_REV1.json',f'Original write-once {label} worker{i}; exact plan and result identity correspondence, no duplicate or missing row. Historical execution evidence.')
add('CROSS_CONTEXT_RECEIVING_TESTS_REV1.json','Historical4 passed receiving tests including independent ties-even oracle and selected-seed subset/current-meaning controls. Full eight-seed coverage belongs to matrix, not all four test bodies. Not freshly rerun.')
add('CROSS_CONTEXT_DOMAINS_TESTS_REV1.json','Historical10 passed domain tests: actual effects, original identity equality, hidden truth/failed delivery/denied execution/false or missing display/private access, prefix/fault/overlap/strict ingress. Busy publication test checks pending start; source guards cover full try/rollback/finally. Not a freshly sampled exhaustive microtask test.')
add('CROSS_CONTEXT_DOMAINS_DEVELOPMENT_TESTS_REV1.json','Preserved9 passing development tests before publication guard regression existed. Passing did not demonstrate whole-wrapper quiescence; inspection found an identity/domain commit gap. Build separately failed three overly narrow knowledge-array assignments.')
add('CROSS_CONTEXT_SUCCESSOR_REFERENCE_TESTS_REV1.json','Historical328 passed reference assertion leaves, not fresh suite.')
add('CROSS_CONTEXT_SUCCESSOR_BUILD_REV1.json','Historical PASS/exit0 with exact source bindings. Preserve prior TS2322 CanonicalValue[] annotation correction and initial publication gap; no fresh build.')
add('CROSS_CONTEXT_SUCCESSOR_CLOSURE_REV1.json','Original read-only closure passes all source/part/aggregate/identity, matched receiving, actual effects and historical tests/build.330 embedded original saves match; no atomic native scheduler or wrapper expansion.')
add('cross-context-domains-development-rev1/PRESERVATION.json','Prequalification publication gap identified by inspection: original identity may commit before domain aggregate. Apply existing whole-wrapper busy guard; preserve initial source/test/fixture/contract and9-pass test receipt. Three TS2322 errors corrected with established CanonicalValue[] result type; no learning law change.')
add('cross-context-domains-development-rev1/CROSS_CONTEXT_DOMAINS_COMPONENT_CONTRACT.md','Superseded prequalification contract before explicit whole-wrapper publication requirements; original domain scope retained, corrected contract governs public component read behavior. Not accepted proof of quiescence.')
add('cross-context-domains-development-rev1/CROSS_CONTEXT_DOMAINS_DEVELOPMENT_TESTS_REV1.json','Exact duplicate9-pass development receipt, not another test cohort or proof against subsequently found publication gap.')
add('cross-context-bookkeeping-development-rev1/PRESERVATION.json','Rejected REV100 date draft preserved verbatim. Final corrects2026-10-02 to2026-10-03 and adds this preservation record to inventory; semantic clauses, counts, models and verdicts unchanged. Metadata correction, not rerun or new scientific finding.')
add('cross-context-bookkeeping-development-rev1/REJECTED_AUDIT_DATE_DRAFT.json','Superseded generated audit snapshot: identical accepted REV100 semantic coverage after correcting date and adding preservation metadata. Not a second accepted audit or fresh behavior proof. Preserve exact rejected hash and historical partial routing.')
prior={x['path']:x for x in load(P/'campaign3-history-source-roles-rev121/index.json')['roleAssignments']};assert not set(prior)&set(specs)
for n in ['receiving','domains']:
 r=load(O/(n+'-identities.json'));assert r['status']=='PASS' and ref(r['original'])['sha256']==r['originalSha256'] and ref(f'scripts/check-history-cross-context-{n}-identities.mjs')['sha256']==r['checkerSha256']
attempts=load(O/'attempts.json');assert attempts['status']=='PASS' and attempts['count']==275
for a in attempts['artifacts']:assert ref(a['path'])['sha256']==a['sha256']
output=subprocess.check_output(['node','scripts/check-cross-context-successor-closure.mjs'],text=True).strip()
closure=load(P/'CROSS_CONTEXT_SUCCESSOR_CLOSURE_REV1.json');preserved=[]
for a in closure['artifacts']:
 assert ref(a['path'])['sha256']==a['sha256']
 if '/cross-context-domains-development-' in a['path']:preserved.append(a)
bk=load(P/'cross-context-bookkeeping-development-rev1/PRESERVATION.json');assert ref(bk['draftPath'])['sha256']==bk['draftSha256']
draft=load(bk['draftPath']);accepted=load(P/'CAMPAIGN3_EXIT_AUDIT_REV100.json');expected=copy.deepcopy(draft);expected['date']='2026-10-03';extra=next(x for x in accepted['inventory'] if x['path']==(P/'cross-context-bookkeeping-development-rev1/PRESERVATION.json').as_posix());assert ref(extra['path'])['sha256']==extra['sha256'];expected['inventory']=sorted(expected['inventory']+[extra],key=lambda x:x['path']);assert expected==accepted
for name,n in [('RECEIVING_TESTS_REV1',4),('DOMAINS_TESTS_REV1',10),('DOMAINS_DEVELOPMENT_TESTS_REV1',9),('SUCCESSOR_REFERENCE_TESTS_REV1',328)]:
 t=load(P/f'CROSS_CONTEXT_{name}.json');leaves=[a for f in t['testResults'] for a in f['assertionResults']];assert t['success'] and t['numPassedTests']==len(leaves)==n and all(a['status']=='passed' and not a['failureMessages'] for a in leaves)
assert load(P/'CROSS_CONTEXT_DOMAINS_DEVELOPMENT_TESTS_REV1.json')==load(P/'cross-context-domains-development-rev1/CROSS_CONTEXT_DOMAINS_DEVELOPMENT_TESTS_REV1.json')
fmt=lambda x:f'{x.numerator}/{x.denominator}'
def fold(rows):
 s=o=F(0)
 for row in rows:
  v=F(row['contribution']);s=F(round((s+max(F(0),v))*1000000),1000000);o=F(round((o+max(F(0),-v))*1000000),1000000)
 return fmt((s-o)/(1+s+o))
rr=load(P/'CROSS_CONTEXT_RECEIVING_RESULT_REV1.json');original=load(P/'CROSS_CONTEXT_IDENTITY_RESULT_REV1.json');receiving=0
for r,c in zip(rr['results'],rr['comparisons']):
 history=r['rows'][:4];probe=r['rows'][4];selected=[] if r['law']=='NoFeedback' or r['name']=='noProbeMeaning' else [x for x in history if x['context']==probe['context']] if r['law']=='SeparateContext' else history
 base=next(x for x in original['results'] if x['law']==r['law'] and x['name']=='main' and x['seed']==r['seed'])['rows'][4]
 assert probe['used']==c['expected']==fold(selected) and probe['strength']==c['global']==fold(history)
 assert c['selectedOccurrences']==[x['at'] for x in selected] and c['changedChoice']==(probe['chosen']!=base['chosen']) and c['changedProbability']==(probe['probabilities']!=base['probabilities']);receiving+=1
dp=load(P/'CROSS_CONTEXT_DOMAINS_PLAN_REV1.json');dr=load(P/'CROSS_CONTEXT_DOMAINS_RESULT_REV1.json');domain=0
actionMap={x['runIdentity']:x['actions'] for x in attempts['runs']}
for case,res in zip(dp['runs'],dr['results']):
 world=dict(parcels=[dict(id=f'parcel/{i}',owner='Actor') for i in range(1,6)],location='Away',hazard=True);speaker=[];recipients=[[],[]]
 for frame,source,row,action in zip(case['inputs']['frames'],case['inputs']['sources'],res['receipts'],actionMap[case['runIdentity']]):
  assert row['before']==world and row['action']==action and row['context']==frame['context'];world=copy.deepcopy(world);world['hazard']=source['truth'];delivered=False;assertion=[]
  if frame['context']=='Custody':
   if action=='return-parcel' and frame['permitted']:world['parcels'][frame['at']-1]['owner']='Beneficiary'
  elif frame['context']=='Disclosure':
   if source['speakerAccess']:speaker.append(source['display'])
   delivered=action=='disclose-hazard' and frame['permitted'] and source['transport'] and bool(speaker);assertion=speaker[-1:] if delivered else []
   for i,key in enumerate(['accessA','accessB']):
    if delivered and source[key]:recipients[i].append(speaker[-1])
  elif action=='attend-appointment' and frame['permitted']:world['location']='WithBeneficiary'
  assert row['after']==world and row['delivered']==delivered and row['assertion']==assertion;domain+=1
 assert res['world']==world
 for samples,view in zip(recipients,res['recipientViews']):assert view['estimate']==([fmt(F(sum(samples),len(samples)))] if samples else [])
assert (receiving,domain)==(144,275)
entries={e['path']:e for e in load(B/'manifest.json')['entries']};roles=[];strings={}
chain=[ref(O/n) for n in ['receiving-identities.json','domains-identities.json','attempts.json']]+[ref(p) for p in ['scripts/check-history-cross-context-receiving-identities.mjs','scripts/check-history-cross-context-domains-identities.mjs','scripts/decode-history-cross-context-attempts.mjs','scripts/check-cross-context-successor-closure.mjs','src/campaign3/crossContextDomains.ts','src/campaign3/communicationMath.ts']]
for p,j in specs.items():
 assert ref(p)['sha256']==entries[p]['sha256'];roles.append(dict(**ref(p),role='CROSS-CONTEXT SUCCESSOR AUTHORITY / RECEIVING / ACTUAL DOMAIN / FINDING',judgment=j,acceptanceChain=chain))
 if p.endswith('.json'):
  for ptr,text in walk(load(p)):strings[p,ptr]=text
rows=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in specs:continue
  assert u['sourceSha256']==entries[u['source']]['sha256'];ptr=u['location'].get('pointer','')
  if u['source'].endswith('.json'):assert strings[u['source'],ptr]==u['text']
  narrative=u['source'].endswith('.md') or ptr.startswith(('/status','/scope','/evidence','/finding','/disposition','/buildFailure')) or '/failureMessages/' in ptr
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],role='NARRATIVE AUTHORITY/FINDING' if narrative else 'TYPED EVIDENCE BACKING',judgment=specs[u['source']]))
obs=[f'RO-C3-{n:03}' for n in [9,13,14,17,19,20,21,22]]
r=dict(status='CROSS-CONTEXT SUCCESSOR SOURCES REVIEWED; HQ011 OPEN',sourceRoles=roles,rows=rows,stringLeaves=len(strings),preservedArtifacts=preserved,obligations=obs,independentArithmeticRows=419,originalCheckerOutput=output,limits=['Fresh entire canonical144 receiving/55 domain plans,144 exact receiving subsets and275 decoded actual action/domain/recipient calculations; historical864/330 prefixes not freshly rerun.','18 receiving identities repeat earlier matrix;126 new. Raw changedChoice across action vocabulary not causal identity comparison; matched custody control earns4/8.','275 attempt chains match original selected options/actor; physical failure/delivery/access do not rewrite identity evidence.','Private latest claim and recipient mean knowledge remain separate; failed delivery or access adds no negative sample.','Publication gap discovered by inspection despite9 passing tests; corrected10-test receipt and source-wide guards authenticated, not fresh exhaustive microtask sweep.','Rejected date draft differs only by corrected date and additional preservation metadata inventory; original scientific dispositions unchanged.','Controlled meaning/acceptance, fixed communication candidate and component transaction only; no natural semantics, native admission or enacted coercion.'])
c=dict(status='PASS; HQ011 OPEN',sources=len(specs),originalNarrativeOccurrences=sum(x['role'].startswith('NARRATIVE') for x in rows),originalBackingOccurrences=sum(x['role'].startswith('TYPED') for x in rows),stringLeaves=len(strings),checker=ref(__file__))
for name,value in [('review.json',r),('check.json',c)]:
 path=O/name
 if path.exists():assert load(path)==value
 else:path.write_text(json.dumps(value,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
print(json.dumps(c))
