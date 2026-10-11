from pathlib import Path
import collections,hashlib,json,os
P=Path('docs/planning');B=P/'campaign3-history-universe-rev1';O=P/'campaign3-history-partial-coverage-support-rev1';O.mkdir(exist_ok=True)
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def ref(p):return dict(path=Path(p).as_posix(),sha256=sha(p))
def save(n,v):
 p=O/n
 if p.exists():assert load(p)==v
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
ip=P/'campaign3-history-source-roles-rev173/index.json';ix=load(ip);roles={x['path']:x for x in ix['roleAssignments']}
manifest={x['path']:x for x in load(B/'manifest.json')['entries']}
specs={
'BODY':(85,'Tolerance branch of disjunctive tolerance-or-sensitization earns bounded coverage, not acquired sensitization. Reciprocal/Linear/Unattenuated retain1/5,3/5,1 potentials after four exposures; retained tolerance without an effect link is insufficient. Constitutional acquisition gains250/125 yield150/75 tolerance then522/558 potential and910/940 safe reward under matched second600-dose, zero satiation/sensitization; later feedback need not stay matched.2389 component prefixes are not270 native prefixes. Clipping can hide efficacy. Interoceptive missingness/quantization is not represented quality; later REV93 supplies its bounded witness. Preserve pre-repair versus repaired-source checker rejection, not a new biological trajectory failure.'),
'MOTIVE':(86,'One relief-task referent supports alternative A/B grounds, not two motives or simultaneous action. BothAvailable admits two positive options; diversified training chooses B after removal of A; concentrated/absent demand/unavailable controls do not act. ExpectationOnly explains primary substitution; no habit necessity or endogenous physiological demand. Goal/strategy is separate native corroboration with empty RNG ledger, not native substitution admission. Base/Situation labels and different-domain importance/pressure do not isolate enduring importance from urgency; later REV92 supplies bounded comparison. Preserve two-option contract and rejected development cohorts.'),
'MEMORY':(87,'One admitted detail earns one category credit; recall uses retained detail or category fallback, not independent summed votes. Queries do not relearn; real detail loss occurs after earlier recall. ReencodeGuess is a provenance counterexample, not a double-summary-credit comparator. Current candidates all exclude recall credit, so no universal consolidation necessity follows. Vividness differs from accuracy/access/significance; later REV94 supplies bounded content-strength witness. TaskConcern attention precedent is not general Affect; later REV95 supplies the actual affect/retrieval join. Encoding suppression remains distinct from retrieval amplification.'),
'AFFECT':(89,'Fear-without-flight is operationalized as positive threat with chosen continuation, not literal locomotion or a Fear primitive. Fixed affect with changed competing commitment changes seeds4/7; continuation probability1/24 versus25/72; all eight seeds retained. Failure of researcher FearAsCommand does not mean failed mitigation execution.91 main runs/1236 restores exclude14 supplementary timing runs;90 files are18 models. Prior later-appraisal and body-stress feedback are not retrieval; REV95 supplies bounded retrieval. Four independent factors do not prove affect vector necessity: ScalarUncontrolled remains serious; later REV111 body-only reduction failure does not refute every scalar, and ScalarThreat success survives.'),
'IDENTITY_AGENCY':(90,'Distinct task/biological channels and separately qualified development do not prove shared identity transfer; later REV100 supplies bounded cross-context expression. Admitted refusal pressure, instruction, forced movement and failed free execution remain distinct; later REV101 supplies enacted coercion, not a natural recognizer. GroupedMean1,1/2,1/3 revisions and duplicate receipt equality concern one episode, not learned recurring interference; later REV98 supplies across-attempt expectation. Preserve nonrecipient-ID leak and phase70/80 mismatch as rejected cohorts. No hidden cause/source trust or universal trait transfer is selected.'),
'LONGITUDINAL':(91,'Acquired biography and retention intervention must join a named ingredient; isolated family qualification is insufficient but every ingredient need not appear in one first experiment. Scheduled opportunities are not routine; instructions are not adopted goals; practice is not habitual availability; episode expiry is not personal loss. LONG15 models/32 public runs/513 prefixes retains biography/skill/relationship bounds. Later REV105 goal,REV107 routine,REV109 habit,REV110 loss compositions supersede named gaps without lifetime or all-ingredient qualification. Preserve FullHistory/CompactRelationship, episode/history distinction, NoLearning, NoHistory and serious source/feedback alternatives. Prospective GRIEF distributions alone do not prove enacted mourning/adjustment.')}
sources={};summaries=[];refs=[]
for tag,(rev,judgment) in specs.items():
 md=P/f'CAMPAIGN3_{tag}_PARTIAL_COVERAGE_AUDIT.md';jp=P/f'{tag}_PARTIAL_COVERAGE_CHECK_REV1.json'
 script=Path('scripts')/('check-'+tag.lower().replace('_','-')+'-partial-coverage.mjs')
 for p in [md,jp]:
  s=p.as_posix();assert s in ix['unassignedCandidatePaths'] and sha(p)==manifest[s]['sha256'];sources[s]=(ref(p),judgment)
 v=load(jp);assert v['status']=='PASS' and v['counters']==[1508,0]
 snapshot=P/f'CAMPAIGN3_EXIT_AUDIT_REV{rev}.json';a=load(snapshot)
 clauses={x['id']:x for f in a['brief']['families'] for x in f['clauses']}
 for id in v['promoted']:assert clauses[id]['status']=='QUALIFIED BOUNDED'
 for id in set(v['audited'])-set(v['promoted']):assert clauses[id]['status']=='PARTIAL'
 bindings=[]
 for f in v['files']:
  assert ref(f['path'])==f
  norm=Path(os.path.normpath(f['path'])).as_posix();role=roles.get(norm)
  bindings.append(dict(**f,normalizedPath=norm,sourceRole=role['category'] if role else 'SEPARATE SOURCE ROLE STILL OPEN; EXACT HASH IS NOT ACCEPTANCE'))
 refs+=bindings
 summaries.append(dict(tag=tag,sources=[ref(md),ref(jp)],checker=ref(script),snapshot=ref(snapshot),audited=v['audited'],promoted=v['promoted'],judgment=judgment,sourceBindings=bindings))
rows=[];narr=back=0;string_counts=collections.Counter()
def walk(v,p=''):
 if isinstance(v,str):yield p,v
 elif isinstance(v,dict):
  for k,x in v.items():yield from walk(x,p+'/'+k)
 elif isinstance(v,list):
  for i,x in enumerate(v):yield from walk(x,p+'/'+str(i))
for s in sources:
 if s.endswith('.json'):
  for ptr,value in walk(load(s)):
   role='NARRATIVE SCOPE' if ptr=='/scope' else 'TYPED STATUS/CLAUSE/IDENTITY; NOT NEW EXPERIMENT'
   string_counts[role]+=1
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line);s=u['source']
  if s not in sources:continue
  sr,judgment=sources[s];assert u['sourceSha256']==sr['sha256']
  category='NARRATIVE' if s.endswith('.md') or u['location'].get('pointer')=='/scope' else 'BACKING'
  narr+=category=='NARRATIVE';back+=category=='BACKING'
  rows.append(dict(occurrenceId=u['id'],source=s,sourceSha256=sr['sha256'],location=u['location'],text=u['text'],category=category,judgment=judgment))
assert len({x['occurrenceId'] for x in rows})==len(rows)
chain=[ref(P/'campaign3-history-exit-consolidation-rev2/review.json'),ref(P/'campaign3-history-exit-identity-longitudinal-rev1/rationale-union-check.json')]
source_roles=[dict(**sr,role='DATED PARTIAL-COVERAGE RECONCILIATION; NOT FRESH EXECUTION',judgment=j,acceptanceChain=chain) for sr,j in sources.values()]
save('review.json',dict(status='SIX HISTORICAL PARTIAL AUDITS AND CHECK RECEIPTS RECONCILED',checker=ref(__file__),sourceIndex=ref(ip),sourceRoles=source_roles,summaries=summaries,rows=rows,allStringRoles=dict(string_counts),preservedArtifacts=[],
 limits=['All79 referenced file hashes match. This checks existing bytes and recorded scope, not every assertion in the old checker or fresh simulation/tests/build. Old checkers were read, not executed; their child chains were not rerun.',
 'Four promotions in these six audits are preexisting bounded dispositions, not new verdicts. Belief audit accounts separately for the fifth of20 initial partial clauses. Later supersessions remain bounded and do not select a law or retire comparators.',
 'Unassigned linked source roles remain open even where exact bytes match. Mandatory historical adequacy,80 inventory identities and HQ012 remain open.'],obligations=['RO-C3-019','RO-C3-020','RO-C3-021']))
assert len(refs)==79
save('check.json',dict(status='PASS; SCOPED CLAIM/IDENTITY CHECK, NO FRESH SIMULATION',sources=12,originalNarrativeOccurrences=narr,originalBackingOccurrences=back,stringLeaves=sum(string_counts.values()),matchedReferenceOccurrences=len(refs),recoveredArtifacts=0,review=ref(O/'review.json')))
assert all(p.stat().st_size<50000000 for p in O.rglob('*') if p.is_file())
print(json.dumps(load(O/'check.json')))
