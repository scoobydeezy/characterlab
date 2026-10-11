"""Reconcile receiving intake, corrections and scoped qualification witnesses."""
from pathlib import Path
import json,hashlib,re
P=Path('docs/planning');O=P/'campaign3-history-receiving-intake-rev1';B=P/'campaign3-history-universe-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def walk(v,p=''):
 if isinstance(v,dict):
  for k,x in v.items():yield from walk(x,p+'/'+k)
 elif isinstance(v,list):
  for i,x in enumerate(v):yield from walk(x,p+'/'+str(i))
 elif isinstance(v,str):yield p,v
specs={
 'CAMPAIGN3_EMBODIED_RECEIVING_INSPECTION.md':'Actual body pressure and adopted task converge on one complete action while retaining independent grounds; response instruction means what to try, not efficacy/relief/causal truth. Registry definition differs from adoption. Old task-bound401/404 and expression/identity wrappers cannot receive fabricated task keys for body. Same arithmetic can receive explicit mixed-key successors without widening old adapters. Shared safe basis admits exact461 producer, not arbitrary reference lookup. Original qualified task identity/ADAPT controls remain; no mixed qualification, action-driven478 or learning claimed. Named historical mechanisms retained rather than retired.',
 'CAMPAIGN3_EMBODIED_RECEIVING_DRAFT.md':'Six proposed receiving components separate immutable adopted instruction487, actual source options, semantic grounds, reason consolidation, addressed arbitration, intent/expression and attempted execution. Known0/Unavailable skip body instruction read; malformed missing context rejects. Distinct adopted instruction IDs can describe one ground; repeated identical canonical IDs are invalid set data, not redundancy witness. Ground/role/sign partitions preserve task/body independence and aggregate raw coverage. NoOptions differs from NoActiveReasons. Join children contain actual complete sibling outputs before allocation; no stale cache/archive authority.18ER requirements retain later public/component scope.',
 'CAMPAIGN3_EMBODIED_RECEIVING_CLOSURE_DRAFT.md':'Explicit pressure0.2/task-source successor versions own changed outgoing edges without changing old pressure mathematics/terminal profile.16 closed registrations have NoStateWrites; source/child/sibling exact authority precedes reads. Task deadline and external body delivery retain distinct writers, read-only instructions preserved. Dormant359 stays diagnostic rather than contact/body prediction; disabled access supplies no forecast/standing. Complete finite counts17/22/26 events and14/19 ordinals, four draws,26work/25rollback are bounded profile constraints, not general runtime cost laws. Full-prefix restore reconstructs provenance; no saved token graph. Existing prospective-control route retained by subsequent clarification.',
 'CAMPAIGN3_EMBODIED_RECEIVING_MODEL_DRAFT.md':'13 committed recipes preserve nine-field data-only model authority and source-versus-world separation. Body adopts at most2 of3 definitions; two descriptions of one action are allowed, operationally identical action aliases are not extra lottery tickets. NoCoverage is runnable declared competitor with truthful own trace law, not reference-conformant. Integer S0 is profile-only, not global narrowing of body rationals. Exact probabilities221/256,1/2,2/3 distinguish grounds/duplication; hidden71/79 safe equivalence and fine/coarse35 differ for honest sensory reasons. Auto recipe alone does not force Auto under symmetric contest; later rejected witness preserved. Initial task/body adoption is fixture premise, not acquired learning.',
 'CAMPAIGN3_EMBODIED_RECEIVING_SELF_REVIEW_1.md':'Eight explicit critiques preserve corrected future-output join, named successor graph, absence of invented efficacy/mixed identity, nonvacuous duplicate and independent-ground scenes, component-only three-support aggregate, and149 versus erroneous160 schema reference. Six exact-kernel arithmetic contrasts establish discriminating calibration without source/RNG authority. Generic occurrence-family reuse needs explicit successor mapping and distinct ordinals per actual output; no inline ground identity allocated. Whole shape remained withheld at this revision.',
 'CAMPAIGN3_EMBODIED_RECEIVING_SELF_REVIEW_2.md':'Primary-agent internal symbolic acceptance only, not external approval or runtime verdict. Corrects dormant359 diagnostic semantics, schema149/DefinitionId1027, removes unused1031/1032 members (51 to49), retains runnableNoCoverage and actual deadline lifecycle. Abstract scheduler feasibility is not source-authentication proof. Mixed expression omits428/429/identity writes; absence blocks broader learning/body claim without invalidating bounded shared-choice contrast.31records110fields16stages and exact roles remain separate numeric/model/public gates.',
 'EMBODIED_RECEIVING_ARITHMETIC_REV1.json':'Fresh original exploration exactly reproduces six rational arbitration contrasts using actual shared kernel and mathematical labels. Independent2d8-v-d8 gives221/256; deleting either gives1/2. Duplicateconsolidatedd8-v-d8 gives1/2, rawstackingd12-v-d8 gives2/3, one-die-per-description gives221/256. All original margin/contest/stake/authorship/mode operands reproduce; no random sampling, canonical mixed record, source authenticity or public qualification follows.'
}
specs={(P/k).as_posix():v for k,v in specs.items()}
prior=load(P/'campaign3-history-source-roles-rev139/index.json');known={x['path'] for x in prior['roleAssignments']};assert not set(specs)&known
manifest=load(P.parent/'formal/EMBODIED_RECEIVING_SHAPE_MANIFEST.json');bound={x['path']:x for x in manifest['files']}
bindings=[]
for p in specs:
 assert ref(p)==bound[p]
 bindings.append(dict(source='docs/formal/EMBODIED_RECEIVING_SHAPE_MANIFEST.json',originalPath=p,sha256=bound[p]['sha256'],resolvedPath=p))
arithmetic=load(O/'arithmetic.json');assert arithmetic['status']=='PASS' and arithmetic['contrasts']==6
for k in ['original','checker']:assert ref(arithmetic[k]['path'])==arithmetic[k]
original=load(P/'EMBODIED_RECEIVING_ARITHMETIC_REV1.json')
assert [r['probabilities'][0] for r in original['contrasts']]==['221/256','1/2','1/2','1/2','2/3','221/256']
for f in original['sources']:
 assert ref(f['path'])==f
 bindings.append(dict(source='docs/planning/EMBODIED_RECEIVING_ARITHMETIC_REV1.json',originalPath=f['path'],sha256=f['sha256'],resolvedPath=f['path']))
q=load(P/'CAMPAIGN3_EMBODIED_QUALIFICATION.json');byid={x['id']:x for x in q['rows']}
draft=P/'CAMPAIGN3_EMBODIED_RECEIVING_DRAFT.md';text=draft.read_text(encoding='utf-8')
vectors=[]
for number,line in enumerate(text.splitlines(),1):
 m=re.match(r'\| (ER-[A-R]) \| (.*?) \|$',line)
 if m:
  key=m[1];assert byid[key]['status']=='PASS IN STATED PUBLIC/COMPONENT SCOPE'
  vectors.append(dict(id=key,source=draft.as_posix(),lineNumber=number,originalLine=line,obligation=m[2],qualifiedWitness=byid[key]['witness'],evidence=byid[key]['evidence']))
assert [r['id'] for r in vectors]==['ER-'+chr(65+i) for i in range(18)]
closure=P/'CAMPAIGN3_EMBODIED_RECEIVING_CLOSURE_DRAFT.md';lines=closure.read_text(encoding='utf-8').splitlines()
stages=[]
for i,line in enumerate(lines,1):
 if re.match(r'\| [a-z-]+ \|\d+\|',line):stages.append(dict(lineNumber=i,exactLine=line))
assert len(stages)==16
corrections=[
 ('CAMPAIGN3_EMBODIED_RECEIVING_SELF_REVIEW_1.md','Future input at a sibling join.','Complete actual403 must exist before mixed-raw child allocation; phase plausibility does not authenticate a future payload.'),
 ('CAMPAIGN3_EMBODIED_RECEIVING_SELF_REVIEW_1.md','Terminal old contracts.','Changed child closure gets explicit pressure0.2/task-source successor, not aliasing terminal predecessor.'),
 ('CAMPAIGN3_EMBODIED_RECEIVING_SELF_REVIEW_1.md','Invented efficacy.','World permission and contact completion do not establish learned fuel relief.'),
 ('CAMPAIGN3_EMBODIED_RECEIVING_SELF_REVIEW_1.md','Identity overclaim.','Separate expression is not428 qualification or429 learning; intact task loop preserved.'),
 ('CAMPAIGN3_EMBODIED_RECEIVING_SELF_REVIEW_1.md','Vacuous overlap comparison.','Distinct instructions share ground/action; duplicate canonical IDs are invalid and cannot prove redundancy.'),
 ('CAMPAIGN3_EMBODIED_RECEIVING_SELF_REVIEW_1.md','Observable independent grounds.','Competing body-only option makes deletion of either shared-option ground behaviorally discriminating.'),
 ('CAMPAIGN3_EMBODIED_RECEIVING_SELF_REVIEW_1.md','Aggregate scope.','Singleton public basis does not instantiate three-support aggregate; actual generic component retained.'),
 ('CAMPAIGN3_EMBODIED_RECEIVING_SELF_REVIEW_1.md','Inherited schema error.','149/1 StatePathPattern replaces erroneous160/1 in earlier inventory; no schema redefinition.'),
 ('CAMPAIGN3_EMBODIED_RECEIVING_SELF_REVIEW_2.md','channel/regulatory-diagnostic-probe','Dormant359 remains diagnostic, not contact prediction/body efficacy.'),
 ('CAMPAIGN3_EMBODIED_RECEIVING_SELF_REVIEW_2.md','Vocabularyrev2 has49 actual proposed members, not51.','Unused logical family/leaf members removed; readonly context has no writer or ADAPT route.'),
 ('CAMPAIGN3_EMBODIED_RECEIVING_SELF_REVIEW_2.md','explicitly committed no-coverage receiving control','Competing law executes with its own truthful trace rather than being rejected solely for disagreeing with reference.')]
correctionRows=[]
for name,phrase,meaning in corrections:
 p=P/name;assert phrase in p.read_text(encoding='utf-8')
 correctionRows.append(dict(source=p.as_posix(),exactPhrase=phrase,disposition=meaning))
auto=load(P/'campaign3-history-embodied-receiving-rev1/auto-witness.json');assert [x['mode'] for x in auto['rows']]==['3','1']
for x in auto['rows']:assert ref(x['source']['path'])==x['source']
route=P.parent/'formal/EMBODIED_RECEIVING_DEADLINE_ROUTE_CLARIFICATION.md';assert 'maps exactly\nTaskDeadlineSettlementTransition to it' in route.read_text(encoding='utf-8')
chain=[ref(O/'arithmetic.json'),ref(P/'campaign3-history-embodied-receiving-rev1/review.json'),ref(P/'campaign3-history-embodied-receiving-rev1/auto-witness.json'),ref(route),ref(P.parent/'formal/EMBODIED_RECEIVING_SHAPE_ACCEPTANCE.md'),ref(P/'CAMPAIGN3_EMBODIED_QUALIFICATION.json')]
entries={e['path']:e for e in load(B/'manifest.json')['entries']};roles=[];strings={}
for p,j in specs.items():
 assert ref(p)['sha256']==entries[p]['sha256'];roles.append(dict(**ref(p),role='RECEIVING INTAKE / CORRECTED SHAPE / CALIBRATION',judgment=j,acceptanceChain=chain))
 if p.endswith('.json'):
  for ptr,s in walk(load(p)):strings[p,ptr]=s
rows=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in specs:continue
  assert u['sourceSha256']==entries[u['source']]['sha256'];ptr=u['location'].get('pointer','')
  if u['source'].endswith('.json'):assert strings[u['source'],ptr]==u['text']
  narrative=u['source'].endswith('.md') or ptr.startswith(('/status','/limits'))
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],role='NARRATIVE AUTHORITY/FINDING' if narrative else 'TYPED EVIDENCE BACKING',judgment=specs[u['source']]))
r=dict(status='RECEIVING INTAKE AND CORRECTED SHAPE RECONCILED; HQ011 OPEN',sourceRoles=roles,rows=rows,stringLeaves=len(strings),preservedArtifacts=[],bindings=bindings,vectorCrosswalk=vectors,stageTable=stages,correctionCrosswalk=correctionRows,obligations=['RO-C3-001','RO-C3-004','RO-C3-008','RO-C3-019','RO-C3-020','RO-C3-021'],limits=['Fresh6exact arithmetic contrasts only. Prior28public runs/86prefixes/27focused tests/20mutants remain separate dated evidence, not freshly rerun.','18ER rows retain original public/component limits. No general Need ontology, learned efficacy, fuel effect, mixed identity, source acquisition or universal normalization claim.','Abstract scheduling and inheritance machine receipts remain separate whole-source work, as do receiving inventory revisions and test metadata. Referenced feasibility counts are not promoted to public proof.','Auto symmetric-contest failure and deadline route clarification remain explicit later corrections; no historical model or receipt rewritten.','No verdict/corpus/allocation/obligation closure or HQ012 entry.'])
c=dict(status='PASS; HQ011 OPEN',sources=len(specs),originalNarrativeOccurrences=sum(x['role'].startswith('NARRATIVE') for x in rows),originalBackingOccurrences=sum(x['role'].startswith('TYPED') for x in rows),stringLeaves=len(strings),resolvedBindings=len(bindings),mappedVectors=len(vectors),stages=len(stages),explicitCorrections=len(correctionRows),freshArithmeticContrasts=6,checker=ref(__file__))
for n,v in [('review.json',r),('check.json',c)]:
 p=O/n
 if p.exists():assert load(p)==v
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
print(json.dumps(c))
