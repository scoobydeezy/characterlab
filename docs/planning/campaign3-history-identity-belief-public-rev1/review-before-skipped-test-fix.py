"""Whole-source historical review; original evidence is never rewritten."""
from pathlib import Path
import json, hashlib

P=Path('docs/planning'); O=P/'campaign3-history-identity-belief-public-rev1'; B=P/'campaign3-history-universe-rev1'
def load(p): return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p): return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def walk(v,p=''):
 if isinstance(v,dict):
  for k,x in v.items(): yield from walk(x,p+'/'+k)
 elif isinstance(v,list):
  for i,x in enumerate(v): yield from walk(x,p+'/'+str(i))
 elif isinstance(v,str): yield p,v

specs={
 'docs/formal/IDENTITY_BELIEF_PUBLIC_CONTRACT.md':'Accepted native0.1: five instants, three independently owned holder leaves, controlled qualification-derived reports. Receive130 causally follows qualify130; learning140 affects next50. Alias/Oracle extra reads are negative controls only. Whole-wrapper publication guard and structural parsing plus original replay/whole-save equality enforce the existing contract, not new psychological laws.',
 'docs/planning/IDENTITY_BELIEF_PUBLIC_READINESS.md':'Prospective native admission burden. Standing is not self-belief; own evidence and estimates differ from target biography/relationship. Require source lineage, holder authority, temporal shift, whole-view noninterference and transactional restore/fault checks. No biological join, natural recognition or new downstream action follows from admission.',
 'docs/planning/CAMPAIGN3_IDENTITY_BELIEF_PUBLIC_QUALIFICATION.md':'VER-C3-IDENTITY-BELIEF-PUBLIC-001 final5 models/37 cases/222 native prefixes,185 advancing37 terminal,3330 events. Final69 affected/328 reference/build are historical evidence. Same identities and ordinary bytes across74 executions444 checks do not double coverage. Only second cohort closes the torn-publication defect. Broader recognition/trust/biology/social action remain unqualified; dated RO022 ACTIVE is superseded by later wrapper repair closure.',
 'docs/planning/IDENTITY_BELIEF_PUBLIC_FINDINGS.md':'Preserves strict fixture metadata rejection, invalid131 phase,23/5 timeouts and exact-byte source validation memo. Admitted changed data and foreign-holder mutations still reject. Component updates match same instant; native appraisal uses prior140. Polling300 misses torn save; deterministic microtask exposes it; guarded successor rejects same window with same final bytes. First serial pass is not public-quiescence closure.',
 'docs/planning/IDENTITY_BELIEF_PUBLIC_IN_PROGRESS.md':'Historical implementation chronology, not current authority. Pending tests/workers/build and temporary finalizer instructions are superseded by actual final receipts. Source/driver corrections precede first freeze; public guard correction follows preserved first serial cohort. No present worker or pending approval is implied.',
 'docs/planning/identity-belief-public-development-rev1/IDENTITY_BELIEF_PUBLIC_CONTRACT.md':'Preserved rejected phase131 draft despite its ACCEPTED heading. Its proposed receive phase is not registered; later130 causal emission supersedes that detail before freeze. Independent holders, controlled sources and next50 constraints remain authoritative through corrected contract.',
 'docs/planning/identity-belief-public-quiescence-rev1/IDENTITY_BELIEF_PUBLIC_CONTRACT.md':'Preserved first serial cohort contract with receive130 correction. Atomic-save requirement already exists, but wrapper implementation violates it. Successor explicitly guards complete wrapper settlement and documents replay-only parsing. This archive cannot establish quiescent public admission.',
 'docs/planning/identity-belief-public-development-rev1/PRESERVATION.json':'Five exact source/contract archives preserve initial strict input and rejected131 development. First tests13 pass15 fail include six BIOLOGY_FIELDS failures and nine unreached later rollback boundary assertions. No input API or phase registry widened.',
 'docs/planning/identity-belief-public-quiescence-rev1/PRESERVATION.json':'Seven exact source/contract/checker archives preserve five-model37-case first serial cohort and deterministic torn-save evidence. Repair does not rewrite first results or identities; final ordinary bytes remain equal. Earlier arbitrary-public-read claim is restricted until successor correction.',
 'docs/planning/IDENTITY_BELIEF_PUBLIC_CLOSURE_REV1.json':'Original closure freshly checked with two inherited runtime sources resolved to exact later-preserved pre-repair bytes. Validates final result, builds, test evidence, defect/correction and historical1450/0. No fresh native replay or current-runtime equivalence is claimed by this audit.',
 'docs/planning/IDENTITY_BELIEF_PUBLIC_QUIESCENCE_PROBE_REV1.json':'300 polling calls all reject, but this sampling failed to exercise the scheduler-to-wrapper commit window. Negative sampled result is insufficient evidence of atomic publication.',
 'docs/planning/IDENTITY_BELIEF_PUBLIC_QUIESCENCE_PROBE_REV2.json':'Deterministic nonmutating before-commit microtask accepts a partial save with a hash different from final. Concrete public persistence defect despite all serial prefixes passing; not an architectural choice.',
 'docs/planning/IDENTITY_BELIEF_PUBLIC_QUIESCENCE_PROBE_REV3.json':'Same deterministic window now rejects with wrapper-not-quiescent error; final save equals pre-repair final and first complete prefix. Bounded regression closure, not proof from polling or all future wrappers.',
}
for rev in [1,2]:
 for kind in ['PLAN','RESULT','BUILD']:
  name=f'IDENTITY_BELIEF_PUBLIC_{kind}_REV{rev}.json'
  specs[str(P/name).replace('\\','/')]=dict(
   PLAN='Frozen source manifest and exact five-model37-run roster. Models bind declared semantic recipe/registry, not these implementation source hashes. REV2 changes implementation manifest/experiment harness and preserves every model/run identity. Preserved source resolution is required for historical artifacts.',
   RESULT='Typed aggregate links all37 raw workers and four partitions. First serial PASS has no quiescence proof; final PASS repeats original data and closes corrected public profile. Original checker plus independent per-row history/appraisal/view reconstruction authenticate recorded scope.',
   BUILD='Historical successful production build bound to its exact cohort plan and log. This audit authenticates recorded evidence; it does not rerun the build.'
  )[kind]
 for part in range(4):
  specs[(P/f'IDENTITY_BELIEF_PUBLIC_PART{part}_REV{rev}.json').as_posix()]=f'Cohort{rev} partition{part} records exactly the indices congruent modulo4, all successful worker paths and original plan hash. No extra behavioral coverage.'
 for i in range(37):
  specs[(P/f'IDENTITY_BELIEF_PUBLIC_RUN_{i}_REV{rev}.json').as_posix()]=f'Cohort{rev} worker{i}: original model/run identity and component reference checked, five native source/update/appraisal rows, six original save-successor links,90 events and exact phase counts. Independent holder histories, safe report signs, prior-instant goal arithmetic and whole observer bytes validated. Both cohorts match; no fresh native execution.'

tests={
 'DEVELOPMENT_TESTS_REV1':(13,15,'Initial rejection: six strict-input BIOLOGY_FIELDS failures; nine later rollback assertions never reached after invalid receive131 emission. Preserve the failed boundary evidence rather than claiming tested rollback success.'),
 'DEVELOPMENT_TESTS_REV2':(23,5,'Four120000ms and one5000ms validation timeouts, no other failed assertions. Exact-byte source memo and longer deadlines precede successful repeated validation.'),
 'DEVELOPMENT_TESTS_REV3':(30,0,'Historical30 native successes after memo/limits; including changed-source and foreign-holder rejection. Not a fresh audit execution.'),
 'TARGETED_TESTS_REV1':(2,0,'Historical focused read-domain and exact-source-byte memo rejection checks. Cache does not authorize changed source state or foreign-holder writes.'),
 'TESTS_REV1':(64,0,'Historical first serial cohort64 affected passes; does not cover subsequently exposed torn save.'),
 'TESTS_REV2':(69,0,'Historical final69 affected passes, including35 native and34 inherited. Preserves all18 stage and precommit faults, holder authority, exact admission, temporal correspondence, whole views and five wrapper/save-parsing regressions.'),
 'REFERENCE_TESTS_REV1':(328,0,'Historical328 preserved reference tests pass; no all-active-suite or fresh execution claim.'),
 'QUIESCENCE_TESTS_REV1':(3,0,'Historical standalone guard three successes: exact microtask, concurrent settlement/completed reads, failed transaction cleanup. Standalone success alone did not prove integration.'),
 'QUIESCENCE_TESTS_REV2':(5,0,'Historical integrated five successes add public snapshot/save/observer blocking and forged state/ledger/output plus excessive-prefix rejection. Parsing installs no saved state; fresh original replay and whole-save equality decide acceptance.'),
}
for name,(passed,failed,judgment) in tests.items():
 path=P/f'IDENTITY_BELIEF_PUBLIC_{name}.json'; t=load(path);specs[path.as_posix()]=judgment
 assert (t['numPassedTests'],t['numFailedTests'],t['success'])==(passed,failed,failed==0)
 leaves=[a for f in t['testResults'] for a in f['assertionResults']]
 assert len(leaves)==passed+failed
 assert sum(a['status']=='passed' and not a['failureMessages'] for a in leaves)==passed
 failures=[a for a in leaves if a['status']=='failed'];assert len(failures)==failed
 if name=='DEVELOPMENT_TESTS_REV1':
  assert sum(all('BIOLOGY_FIELDS' in m for m in a['failureMessages']) for a in failures)==6
  assert sum(a['fullName'].startswith('atomic rollback at ') and all('expected false to be true' in m for m in a['failureMessages']) for a in failures)==9
 if name=='DEVELOPMENT_TESTS_REV2':
  assert sum(all('Test timed out in 120000ms' in m for m in a['failureMessages']) for a in failures)==4
  assert sum(all('Test timed out in 5000ms' in m for m in a['failureMessages']) for a in failures)==1

for rev in [1,2]:
 b=load(P/f'IDENTITY_BELIEF_PUBLIC_BUILD_REV{rev}.json')
 assert b['status']=='PASS' and b['exitCode']==0 and b['planSha256']==ref(P/f'IDENTITY_BELIEF_PUBLIC_PLAN_REV{rev}.json')['sha256']
poll,before,after=[load(P/f'IDENTITY_BELIEF_PUBLIC_QUIESCENCE_PROBE_REV{i}.json') for i in [1,2,3]]
assert poll['probes']==poll['rejected']==300 and not poll['accepted'] and not poll['partialSaves']
assert before['partialSave'] and before['observed']['accepted'] and before['observed']['sha256']!=before['final']
assert not after['partialSave'] and not after['observed']['accepted'] and 'not quiescent' in after['observed']['error']
assert poll['final']==before['final']==after['final']==load(P/'IDENTITY_BELIEF_PUBLIC_RUN_1_REV1.json')['prefixes'][1]['sha256']
preserved=[]
for folder in ['identity-belief-public-development-rev1','identity-belief-public-quiescence-rev1']:
 for a in load(P/folder/'PRESERVATION.json')['artifacts']:
  assert ref(a['path'])['sha256']==a['sha256'];preserved.append(ref(a['path']))
schema=load(O/'schema-check.json');assert schema['status']=='PASS' and (schema['workers'],schema['rows'],schema['observerViews'])==(74,370,222)
entries={e['path']:e for e in load(B/'manifest.json')['entries']};roles=[];strings={}
chain=[ref(O/n) for n in ['closure-check.json','current-source-finding.json','schema-check.json']]+[ref('scripts/check-history-identity-belief-public-schema.mjs'),ref('scripts/check-history-identity-belief-public-closure.mjs'),ref(P/'IDENTITY_BELIEF_PUBLIC_CLOSURE_REV1.json'),ref('scripts/check-identity-belief-public.mjs'),ref('scripts/check-identity-belief-public-closure.mjs'),ref('scripts/qualify-identity-belief-public.mjs')]
for p,j in specs.items():
 assert ref(p)['sha256']==entries[p]['sha256']
 roles.append(dict(**ref(p),role='NATIVE IDENTITY BELIEF AUTHORITY / FINDING / TYPED EVIDENCE',judgment=j,acceptanceChain=chain))
 if p.endswith('.json'):
  for ptr,s in walk(load(p)):strings[p,ptr]=s
rows=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in specs:continue
  assert u['sourceSha256']==entries[u['source']]['sha256'];ptr=u['location'].get('pointer','')
  if u['source'].endswith('.json'):assert strings[u['source'],ptr]==u['text']
  narrative=u['source'].endswith('.md') or '/failureMessages/' in ptr or ptr.startswith(('/status','/reason','/claims','/limits','/limitations','/error','/gates','/scope','/finding','/cause','/correction','/observed/error','/hook'))
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],role='NARRATIVE AUTHORITY/FINDING' if narrative else 'TYPED EVIDENCE BACKING',judgment=specs[u['source']]))
obs=['RO-C3-009','RO-C3-010','RO-C3-014','RO-C3-019','RO-C3-020','RO-C3-021','RO-C3-022']
v=dict(status='NATIVE IDENTITY BELIEF SOURCES REVIEWED; HQ011 OPEN',sourceRoles=roles,rows=rows,stringLeaves=len(strings),preservedArtifacts=preserved,obligations=obs,limits=['Fresh read-only authentication and semantic/view reconstruction, not fresh native replay/tests/build.','Two inherited runtime hashes require exact pre-repair archives; no current-runtime compatibility claim.','First serial cohort is not quiescence evidence; polling missed concrete microtask defect. Second cohort preserves same identities and ordinary bytes while enforcing whole-wrapper publication.','Controlled task reports, five instants, equal-weight scalar candidates; no biological belief join, recognition/trust model or new sampled downstream action.','Dated RO022 ACTIVE prose is historical. Later wrapper closure remains CLOSED in its bounded scope.'])
check=dict(status='PASS; HQ011 OPEN',sources=len(specs),originalNarrativeOccurrences=sum(x['role'].startswith('NARRATIVE') for x in rows),originalBackingOccurrences=sum(x['role'].startswith('TYPED') for x in rows),stringLeaves=len(strings),checker=ref(__file__))
for name,value in [('review.json',v),('check.json',check)]:
 f=O/name
 if f.exists():assert load(f)==value
 else:f.write_text(json.dumps(value,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
print(json.dumps(check))
