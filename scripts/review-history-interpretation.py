"""Whole historical interpretation authority and independent consequence/credit audit."""
from pathlib import Path
import json,hashlib,subprocess
from fractions import Fraction as F
P=Path('docs/planning');O=P/'campaign3-history-interpretation-rev1';B=P/'campaign3-history-universe-rev1'
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
specs['docs/formal/INTERPRETATION_PUBLIC_CONTRACT.md']='Accepted interpretation-public0.1: held speaker belief/context, actual purpose/intent/expression, two-glyph production, recipient-specific signal/context, interpretation and belief. Fixed conventions not learned language. Six laws/eight models,20 stages, disjoint holder leaves, private learning30 then choice, interpretation130/recipient learning140 affects next probe40. Oracle explicit negative comparator.'
add('COMMUNICATION_INTERPRETATION_READINESS.md','Prospective misunderstanding gap: earlier transparent semantic assertion channel did not prove signal interpretation. Requires same accessible signal with different admitted contexts, honest error versus misunderstanding, no private-intent shortcut, failed/denied production, later full-view provenance and replay. Natural language/trust/recursive mentalizing outside scope.')
add('CAMPAIGN3_INTERPRETATION_QUALIFICATION.md','VER-C3-INTERPRET-001 bounded public explanation:8 models29 runs116 prefixes freshly reproduced. Same glyph different context, later correction without rewriting earlier meaning, Contextual/Literal/Latest competitors, separate NoLearning/NoInterpretation, IntentOracle boundary. Negative/misleading alias counted once; no joint universal communication qualification.')
add('INTERPRETATION_PUBLIC_PLAN_REV1.json','Whole canonical eight-model29 distinct RunIdentity/ExperimentIdentity/ComparisonCase plan freshly reconstructed from empty initial state, original inputs and seed13. Six laws plus withholding/balanced pressure; no original selected action or produced signal. Negative/misleading alias deduplicated before matrix execution.')
add('INTERPRETATION_PUBLIC_RESULT_REV1.json','Fresh complete public result:29 runs116 original-input prefixes87 advancing29 terminal. Exact original worker outputs and both recipient views. Independent decoded261 learning updates174 interpretations174 probes87 intents87 executions reproduce admitted-source and receiving law, without independently deriving reason dice.')
add('INTERPRETATION_CLOSURE_REV1.json','Original read-only closure verifies distinct roster/partition, frozen model files, contiguous17 allocation records, exact source and output/view/result hashes, historical33/328 tests/build. No new allocation, law selection or native producer.')
add('INTERPRETATION_TESTS_REV1.json','Historical33 passing conformance leaves: signal/meaning distinction, corrected context, unknown/false/absence, honest error, all20 stages+commit faults after acquisition, three contested faults, exact phases, disjoint authority, forged handles/edited saves. Authenticated not a fresh fault-test run.')
add('INTERPRETATION_REFERENCE_TESTS_REV1.json','Historical328 passing reference assertion leaves; authenticated not freshly rerun.')
add('INTERPRETATION_BUILD_REV1.json','Historical PASS/exit0/date/command receipt; status-only, not raw compiler output or fresh build. No construction failure cohort claimed by this qualification.')
for i in range(4):add(f'interpretation-public-workers-rev1/{i}.json',f'Original worker{i} exact disjoint public partition freshly reproduces canonical outputs and complete recipient views. Hex records are typed executable backing, decoded and checked independently for signal/interpretation/learning/probe behavior; not new prose findings.')
prior={x['path']:x for x in load(P/'campaign3-history-source-roles-rev127/index.json')['roleAssignments']};assert not set(prior)&set(specs)
for name in ['identities','replay']+[f'worker-{i}' for i in range(4)]:
 r=load(O/(name+'.json'));assert r['status']=='PASS' and ref(r['original'])['sha256']==r['originalSha256'] and ref('scripts/replay-history-interpretation.mjs')['sha256']==r['checkerSha256']
learning=load(O/'learning.json');assert learning['status']=='PASS' and (learning['updates'],learning['interpretations'],learning['probes'],learning['intents'],learning['executions'])==(261,174,174,87,87)
for a in learning['sources']+learning['artifacts']+[learning['checker']]:assert ref(a['path'])['sha256']==a['sha256']
output=subprocess.check_output(['node','scripts/check-interpretation-closure.mjs'],text=True).strip()
plan=load(P/'INTERPRETATION_PUBLIC_PLAN_REV1.json');result=load(P/'INTERPRETATION_PUBLIC_RESULT_REV1.json')
for a in plan['artifacts']+load(P/'INTERPRETATION_CLOSURE_REV1.json')['artifacts']:assert ref(a['path'])['sha256']==a['sha256']
for name,n in [('TESTS_REV1',33),('REFERENCE_TESTS_REV1',328)]:
 t=load(P/f'INTERPRETATION_{name}.json');leaves=[a for f in t['testResults'] for a in f['assertionResults']];assert t['success'] and t['numPassedTests']==len(leaves)==n and t['numFailedTests']==t['numPendingTests']==0 and all(a['status']=='passed' and not a['failureMessages'] for a in leaves)
assert load(P/'INTERPRETATION_BUILD_REV1.json')['exitCode']==0
assert len(plan['runs'])==len(result['results'])==29 and 'misleading' not in {x['name'] for x in plan['runs']}
backing=[ref('docs/formal/INTERPRETATION_PUBLIC_ALLOCATION_TABLE.json'),ref(P/'campaign3-interpretation-model-rev1/FREEZE.json')]
for a in backing:assert prior[a['path']]['sha256']==a['sha256']
entries={e['path']:e for e in load(B/'manifest.json')['entries']};roles=[];strings={}
chain=[ref(O/(n+'.json')) for n in ['identities','replay','learning']+[f'worker-{i}' for i in range(4)]]+[ref(p) for p in ['scripts/replay-history-interpretation.mjs','scripts/check-interpretation-closure.mjs','src/campaign3/interpretationRuntime.ts','src/campaign3/interpretationModel.ts','src/campaign3/interpretationMath.ts']]
for p,j in specs.items():
 assert ref(p)['sha256']==entries[p]['sha256'];roles.append(dict(**ref(p),role='COMMUNICATION INTERPRETATION AUTHORITY / QUALIFICATION / LIMIT',judgment=j,acceptanceChain=chain))
 if p.endswith('.json'):
  for ptr,text in walk(load(p)):strings[p,ptr]=text
rows=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in specs:continue
  assert u['sourceSha256']==entries[u['source']]['sha256'];ptr=u['location'].get('pointer','')
  if u['source'].endswith('.json'):assert strings[u['source'],ptr]==u['text']
  narrative=u['source'].endswith('.md') or ptr.startswith(('/status','/scope','/output')) or '/failureMessages/' in ptr
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],role='NARRATIVE AUTHORITY/FINDING' if narrative else 'TYPED EVIDENCE BACKING',judgment=specs[u['source']]))
obs=[f'RO-C3-{n:03}' for n in [14,19,20,21]]
r=dict(status='COMMUNICATION INTERPRETATION SOURCES REVIEWED; HQ011 OPEN',sourceRoles=roles,rows=rows,stringLeaves=len(strings),preservedArtifacts=[],alreadyReviewedBacking=backing,obligations=obs,originalCheckerOutput=output,limits=['Fresh8 models29 public runs116 prefixes87 advancing29 terminal; whole original worker outputs/recipient views/results equal. One successor per prefix, not all tails.','Independent261 learning updates174 interpretations174 probes87 intents87 executions; actual reason-dice choice inherited from runtime replay, not independently derived.','Same glyph1 can mean true or false by admitted context; correction changes new interpretations without editing earlier records. Unknown context retains signal without meaning; missing signal contributes no sample.','LiteralMean suffices under convention1 but fails convention2; NoInterpretation retains raw glyphs without meaning, NoLearning exposes interpretations without recipient state. LastInterpretation differs from mean; all retained.','Private intended value and speaker encoding context can change while raw recipient observations stay fixed; whole lawful recipient views equal, IntentOracle violates. Hidden truth/denied source/nonrecipient changes also controlled.','Wrong honest speaker belief can be correctly understood; meaning disagreement with truth is not itself misunderstanding. Failed delivery preserves intent/expression.','Twenty actual stages reserve occurrences, recipient learning140 follows probe40; balanced seed13 preserves genuine1/2 reasons/draws without search.','Historical33 conformance328 reference/build authenticated not rerun; no failure cohort invented. Negative/misleading exact source alias counts once.','Fixed two conventions and named causal proposition; no learned lexicon, general language, causal discovery, pragmatic inference, calibrated trust or universal communication claim.'])
c=dict(status='PASS; HQ011 OPEN',sources=len(specs),originalNarrativeOccurrences=sum(x['role'].startswith('NARRATIVE') for x in rows),originalBackingOccurrences=sum(x['role'].startswith('TYPED') for x in rows),stringLeaves=len(strings),checker=ref(__file__))
for name,value in [('review.json',r),('check.json',c)]:
 path=O/name
 if path.exists():assert load(path)==value
 else:path.write_text(json.dumps(value,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
print(json.dumps(c))
