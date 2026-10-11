"""Reconcile probe mutations and source audits without rerunning historical writers."""
from pathlib import Path
import json,hashlib,collections
P=Path('docs/planning');B=P/'campaign3-history-universe-rev1';O=P/'campaign3-history-probe-mutation-receipts-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def save(n,v):
 p=O/n
 if p.exists():assert load(p)==v,p
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
ip=P/'campaign3-history-source-roles-rev247/index.json';ix=load(ip);entries={e['path']:e for e in load(B/'manifest.json')['entries']}
notes={
'RUNTIME_MUTATION_PROOF':'Fifteen baseline tests and seven in-memory substitutions; failure counts1/1/3/2/1/1/3 are overlapping assertion observations, not independent phenomena. Displacement, denominator, availability, permission, padding, truth family and accessor remain separate interventions. Borrowed ADAPT accessor both violates expected actual-read identity and defeats the negative control that substitutes that same accessor; archive rejection is another boundary. Ordinary baseline tests passing within mutant cohort do not validate mutant semantics. Same frozen declarations, component qualification only; no whole factory/VAL/ADAPT claim.',
'ISOLATION_MUTATION_PROOF':'One paired public test fixes observation/support allocation, compares D0/1, unchanged state, different observation and equal learning bytes. Twelve mutations each fail this test through distinct boundaries: registered ReadDomain, malformed origin, trace read cardinality, learning-byte inequality or unsupported version. The other-character mutation uses atom1002 text other instead of a valid authored-origin referent; its actual error is referent origin requires a typed identifier. This is malformed-input rejection, not evidence of valid-other-character ReadDomain rejection. Other-variable uses a different identity but no independently qualified second variable. Four scalar mutations alter support identity or metadata; no generic scientific claim about arbitrary covert channels. Keep broader capability controls separate; no new public model or runtime gate.',
'NUMERIC_MUTATION_PROOF':'One generic signed-domain test with production source/observation, values-101,-100,-99,-1,0,1,99,100,101 and scale10. Seven valid point outputs, two out-of-domain rejects before ordinal allocation; state/declarations unchanged. Frozen public compiler rejects widened registration. Four substitutions clipping/saturation/threshold/gain each fail first relevant scalar comparison; this is not a public negative-level model or response-law selection. Test name is bounded scope, not nine independently qualified models.',
'PADDING_AUDIT':'Four source-structure checks and six rejected source substitutions. TypeScript AST/printer checks one private zero-argument void function, exact body/budget and two statement-only uses with discarded allocator result. Capture/return/compare/expose and altered/allocator-derived budget violate that inspected implementation shape. Not runtime validator, arbitrary-code noninterference proof or observed sentinel behavior. Separate runtime budget/sentinel/rollback evidence required; historical writer not executed.',
'SEM_ISOLATION_AUDIT':'Five source-structure checks and six rejected source substitutions. AST examines sole assemblePreRecognitionExperience call, exact properties/empty classification and binding arrays, support identity expression and fixed version. Classify/event-classify/dereference/hash/embed/version substitutions are rejected by that exact shape audit, not six public runtime failures. It does not establish arbitrary callee implementation correctness or constrain future SEM contracts. Paired public scalar and admitted EVID evidence remain separate.'}
sources=[];bindings=[];leaves=[];summaries=[]
chain=[ref(P/'campaign3-history-probe-packaging-history-rev1/review.json'),ref(P/'CAMPAIGN2_PROBE_QUALIFICATION_REVIEW.md')]
def walk(v,p=''):
 if isinstance(v,str):yield p,v
 elif isinstance(v,dict):
  for k,x in v.items():yield from walk(x,p+'/'+k)
 elif isinstance(v,list):
  for i,x in enumerate(v):yield from walk(x,p+'/'+str(i))
def narrative(p):return any(k in p.split('/') for k in ['status','scope','limitations','checks'])
for suffix,n in notes.items():
 p=(P/('CAMPAIGN2_PROBE_'+suffix+'.json')).as_posix();v=load(p)
 assert p in ix['unassignedCandidatePaths'] and ref(p)['sha256']==entries[p]['sha256']
 sources.append(dict(**ref(p),role='PROBE MUTATION OR SOURCE-AUDIT RECEIPT WITH OBSERVED FAILURE SCOPE',judgment=n,acceptanceChain=chain))
 for x in v.get('sourceFingerprints',[v.get('source')]):
  assert ref(x['path'])==x;bindings.append(dict(receipt=p,original=x,actual=ref(x['path'])))
 leaves.extend(dict(source=p,pointer=q,text=x,role='NARRATIVE' if narrative(q) else 'BACKING') for q,x in walk(v))
 if 'baseline' in v:
  expected={'RUNTIME_MUTATION_PROOF':(15,[1,1,3,2,1,1,3]),'ISOLATION_MUTATION_PROOF':(1,[1]*12),'NUMERIC_MUTATION_PROOF':(1,[1]*4)}[suffix]
  assert len(v['baseline']['tests'])==expected[0] and all(x['state']=='pass' for x in v['baseline']['tests'])
  assert [sum(x['state']=='fail' for x in m['tests']) for m in v['mutants']]==expected[1]
  assert all(m['status']=='DETECTED' and len(m['tests'])==expected[0] for m in v['mutants'])
  summaries.append(dict(source=p,baselineTests=expected[0],mutantFailureCounts=expected[1]))
 else:assert len(v['mutants'])==6 and all(m['status']=='REJECTED' for m in v['mutants'])
iso=load(P/'CAMPAIGN2_PROBE_ISOLATION_MUTATION_PROOF.json')
assert next(x for x in iso['mutants'] if x['name']=='other-character')['tests'][0]['errors']==['referent origin requires a typed identifier']
writer=Path('scripts/prove-campaign2-probe-isolation.mjs').read_text();assert "CharacterId:atom(1002,'other')" in writer
rows=[];counts=collections.Counter();paths={s['path'] for s in sources}
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in paths:continue
  assert u['sourceSha256']==entries[u['source']]['sha256'];kind='NARRATIVE' if narrative(u['location']['pointer']) else 'BACKING';counts[kind]+=1
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],category=kind))
assert len({r['occurrenceId'] for r in rows})==len(rows)
O.mkdir(exist_ok=True);save('schema.json',dict(shortStringsIncluded=True,backingRationale='Test titles, assertion errors, state labels and mutant names are diagnostic experimental backing; their actual failure boundaries interpreted in source judgments, not promoted from labels.',leaves=leaves))
save('review.json',dict(status='FIVE PROBE MUTATION/SOURCE AUDITS RECONCILED',checker=ref(__file__),sourceIndex=ref(ip),sourceRoles=sources,rows=rows,exactBindings=bindings,preservedArtifacts=[],summaries=summaries,schema=ref(O/'schema.json'),currentInspectionSources=[ref(p) for p in ['scripts/prove-campaign2-probe-isolation.mjs','scripts/audit-campaign2-probe-padding.mjs','scripts/audit-campaign2-probe-sem-isolation.mjs','src/test/campaign2ProbeScalarIsolation.test.ts','src/test/campaign2ProbeNumericDomain.test.ts']],limits=['All ten reported source bindings match current bytes, not proof of historical timestamps or fresh execution.','Malformed other-character mutation does not witness a valid alternative character key; no broader public claim is assigned.','Source AST rejection is distinct from runtime rejection and arbitrary host-code noninterference.','No new archive/source gap, production change, verdict, allocation or obligation status change; independent adequacy remains open.'],obligations=['RO-C3-008','RO-C3-019','RO-C3-020','RO-C3-021']))
save('check.json',dict(status='PASS PROBE RECEIPT CONTENT AND SOURCE BINDINGS',sources=len(sources),originalNarrativeOccurrences=counts['NARRATIVE'],originalBackingOccurrences=counts['BACKING'],stringLeaves=len(leaves),exactBindings=len(bindings),review=ref(O/'review.json')))
print(json.dumps(load(O/'check.json')))
