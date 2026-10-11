"""Reconcile trace/probe allocations, accessor correction and scoped qualification."""
from pathlib import Path
import json,hashlib,collections
P=Path('docs/planning');B=P/'campaign3-history-universe-rev1';O=P/'campaign3-history-probe-trace-allocation-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def save(n,v):
 p=O/n
 if p.exists():assert load(p)==v,p
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
ip=P/'campaign3-history-source-roles-rev240/index.json';ix=load(ip);entries={r['path']:r for r in load(B/'manifest.json')['entries']}
archives={r['sha256']:r['path'] for r in ix['explicitBackingOutsideProseManifest']};bindings=[]
def bind(receipt,p,h):
 actual=p if ref(p)['sha256']==h else archives[h];assert ref(actual)['sha256']==h
 bindings.append(dict(receipt=receipt,original=dict(path=p,sha256=h),actual=ref(actual)))
notes={
'docs/formal/TRACE_SEAM_MEMBER_ALLOCATION.md':'Permanent two1036SeamId members for source110 and composite observation120, no namespace/record/occurrence/registry allocation. EventTypeId1001 remainsRecordKind, notTransitionKind cast. Each exact member/use/version fixed; numeric freeze neither emits trace nor upgrades oldmodel. Separate replacement identity gate required. Historical A..Npending remains allocation-scope, not current blanket unqualification.',
'docs/formal/PROBE_ACCESSOR_MEMBER_ALLOCATION_REVIEW.md':'Permanent one1028text member identifies only diagnostic root302/field3/key(C,V) read. No capability/observer access granted by identifier; noalias to prior ADAPT/subject accessors. No namespace/record/role/registry/state/savefield; ordinal allocator irrelevant. Frozen probe.1 cannot acquire new authoritative trace bytes; successorprofile/model required even though registrymanifest unchanged.',
'docs/formal/REGULATORY_PROBE_ALLOCATION_REVIEW.md':'Five records331..335/19fields,one1123truthoccurrence,12textmembers11roles andthreegoverned259unionentries. Original layout-only table corrected with explicit171/1024[335,tag] definitions before conditional numeric freeze; no new tags/numbers/semantics. Suppressed forbids2/3/4;Observing requires1/2/3 andforbids4;Supporting requires1/4andforbids2/3. No role forrecord-valuedSupport216;exactmember/equality profilechecksnotgenericrole. One shared runtime allocator, no padding identity/newstate.240mechanicalchecks notPROBE runtime.',
'docs/formal/REGULATORY_DIAGNOSTIC_PROBE.md':'Acceptedwhole0.1shape laterqualifiedunderRules.2; historicalNOTPASSED prose explicitlypreimplementation. TruthR0+D integer andobservedn/Scale rational,dedicatedchannel, independentavailability/permission,displacement-onlyread,eightfixedstages/fiveordinals,privatevoidpadding,authenticatedSEM->EVID. InputOnlyoriginalcompiler source atpositive110 emptydeps/parents,no publicschedule/cancel/sourceemission. Restoreexactpendingoriginalmanifest subset via scratchcompile,not historyreplay/liveallocation. Qualified F1generictemporalconsumer+F2publicexclusion andG1positive/G2genericsigned/G3publicexclusion;no temporal/signedbroaderpublicmodel. ADAPT9aonly,noscalarX/E/L,cognition,performance,rewardorwholecampaignclaim.',
'docs/planning/CAMPAIGN2_PROBE_ACCESSOR_REVIEW.md':'ActualReadRecord147requiresaccessor identity;structuralTypedIdentifierencodabilitynotsemanticnameauthority. New1028memberfillsfixeddiagnosticread,availabletrueoneactualread evenpermissionfalse;unavailablezero. No anonymous/dummyread, no extra state access or observer evidence. User explicitly rejected preserving oldRules/ModelIdentity afterfixingtraceoperand;originalproposalretained but notauthorization. Separatememberfreeze,trace.2andmodelreview required. IndependentInputOnly/componentworkdidnotprovepublicactivation/cancellation orwholePROBE-P.',
'docs/planning/CAMPAIGN2_PROBE_TRACE_SUCCESSOR_DRAFT.md':'Accepted.2trace/Rulesandlatermodelfreezesupersedeproposal/blockedwordingonlynamedgates. Soletracecompletion exact1028accessor onactualDread withactualpresence/value,emptyderivedsources/noTransformationId. Availablefalsezero;permissiondoesnotcontroltruthread. Existingregisteredpath unchanged;wrongaccessorfails evenequalpath/value. Oldmodel2cc1..immutable;expectedonlyModelIdentityfield1delta/allmanifestsequal,no registryentryfortextconstant/migrationfallback. AccessorA..Equalification separatefrommemberfreeze and laterruntimeevidence.',
'docs/planning/CAMPAIGN2_PROBE_QUALIFICATION_REVIEW.md':'UseracceptedPROBEA..P/accessorA..E/ADAPT9a bounded qualification. F temporal genericproducer+publicexclusion, Gpublicpositive/genericsigned/publicexclusion retain distinctmodels/domains. Sameactualhistories firstpermitteddifference203 whilematchedX/E/Lequal; no cognitiondivergence. Source audits are finite source qualifications,notruntimevalidators or independentmechanisms. Preserve pass3extraLoutputcommittedbecausefirst-output-onlytracecheck;exactcardinality/typeandarchiveclosurefix, laterformerlysuccessfulsubstitutionrejects. Also detachedarithmetic/fixturefailures retained.549lastfulltests beforelaterfocus+12isolation/4numeric/6SEMsubstitutions,notnewfullsuite oradditiveindependentfindings.32eventslot+18postallocationrollbacksites andcontinuation separate.9b/parent9/PHEN/wholeCampaign2notqualifiedbythisreceipt.'}
configs=[('TRACE_SEAM_MEMBER','TRACE_SEAM_MEMBER_ALLOCATION.md',110),('PROBE_ACCESSOR_MEMBER','PROBE_ACCESSOR_MEMBER_ALLOCATION_REVIEW.md',43),('REGULATORY_PROBE','REGULATORY_PROBE_ALLOCATION_REVIEW.md',240)]
for n,mdname,count in configs:
 tp='docs/formal/'+n+'_ALLOCATION_TABLE.json';ap='docs/formal/'+n+'_ALLOCATION_AUDIT.json';mp='docs/formal/'+mdname;t=load(tp);a=load(ap)
 assert len(a['checks'])==count and all(r['status']=='PASS' for r in a['checks'])
 if 'checkCount' in a:assert a['checkCount']==count
 for r in t['preservedSources']:bind(tp,r['path'],r['sha256'])
 if 'allocationSnapshot' in a:
  assert a['allocationSnapshot']==t
  for r in a['allocationSnapshot']['preservedSources']:bind(ap,r['path'],r['sha256'])
 bind(ap,tp,a['tableSha256']);bind(ap,mp,a['markdownSha256'])
 if 'authoritySha256' in a:bind(ap,t['authority'],a['authoritySha256'])
 if n!='REGULATORY_PROBE':notes[tp]='Frozen additive member descriptor; exact permanent identity/use, no capability or runtime effect. All inherited source bindings verified against current/indexedhistoricalbytes; no predecessor allocation modified. '+notes[mp]
 notes[ap]=f'Historical {count}-check mechanical receipt, not behavioral testcount or publicqualification. Source/path/check/limit fields reviewedincluding shortstrings. Exacttable/Markdown/authority hashes and inheritedreferences freshlychecked; oldregistry/probeshape bytes preserved wherecurrentheaderdiffers. '+('CompleteembeddedallocationSnapshotmatches frozen table.' if 'allocationSnapshot' in a else 'No embedded full snapshot; binds separate table bytes.')+' Mechanical pending-control language retains its historical scope under lateraccepted qualification.'
trace=load('docs/formal/TRACE_SEAM_MEMBER_ALLOCATION_TABLE.json');md=Path('docs/formal/TRACE_SEAM_MEMBER_ALLOCATION.md').read_text()
assert trace['existingFamily']==dict(namespace=1036,name='SeamId') and len(trace['members'])==2
for m in trace['members']:
 assert f"| {m['namespace']} | SeamId | {m['name']} | {m['payload']} | {m['event']} at phase {m['phase']} | {m['seamVersion']} |" in md
for k in ['namespaces','records','bindings','unionVariants','finiteValues','occurrenceDefinitions','stateRoots','saveFields']:assert trace[k]==[]
access=load('docs/formal/PROBE_ACCESSOR_MEMBER_ALLOCATION_TABLE.json')
assert access['members']==[dict(namespace=1028,payload='accessor/regulatory-diagnostic-displacement-prior')]
assert '| 1028 | accessor/regulatory-diagnostic-displacement-prior |' in Path('docs/formal/PROBE_ACCESSOR_MEMBER_ALLOCATION_REVIEW.md').read_text()
for k in ['namespaces','records','roles','unionVariants','stateRoots','saveFields']:assert access[k]==[]
t=load('docs/formal/REGULATORY_PROBE_ALLOCATION_TABLE.json');md=Path('docs/formal/REGULATORY_PROBE_ALLOCATION_REVIEW.md').read_text()
assert len(t['records'])==5 and sum(len(r['fields']) for r in t['records'])==19 and len(t['roles'])==11 and len(t['members'])==12
for r in t['records']:
 assert f"| {r['typeId']} | {r['name']} | {r['schemaVersion']} |" in md
 for f in r['fields']:assert f"| {r['typeId']} | {f['id']} | {f['name']} | {f['type']} | {str(f['required']).lower()} |" in md
for r in t['roles']:assert f"| {r['recordTypeId']} | {r['fieldId']} | {r['requiredNamespace']} | {r.get('domainValidatorId','absent')} |" in md
for r in t['members']:assert f"| {r['namespace']} | {r['payload']} |" in md
for v,e in zip(t['unionVariants'],t['unionVariantEntries']):
 assert e['stableId']==dict(namespace=1024,payload=dict(kind='list',items=[dict(kind='unsigned',value=335),dict(kind='unsigned',value=v['tag'])]))
 assert e['registryKind']==dict(namespace=1023,payload='registry/union-variant-definition') and e['definitionVersion']=='union-variant/1'
 assert e['definition']==dict(recordTypeId=259,schemaVersion=1,fields=[dict(id=1,kind='unsigned',value=335),dict(id=2,kind='unsigned',value=v['tag']),dict(id=3,kind='set',elementKind='unsigned',values=v['requiredFields']),dict(id=4,kind='set',elementKind='unsigned',values=v['forbiddenFields'])])
 assert set(v['requiredFields']).isdisjoint(v['forbiddenFields']) and set(v['requiredFields']+v['forbiddenFields'])=={1,2,3,4}
assert len(t['unionVariants'])==len(t['unionVariantEntries'])==3
assert t['occurrenceDefinitions']==[dict(recordTypeId=334,identityFieldId=1,namespace=1123,allocator='existing shared run runtime ordinal')]
assert t['stateRoots']==t['saveFields']==[]
def walk(v,p=''):
 if isinstance(v,str):yield p,v
 elif isinstance(v,dict):
  for k,x in v.items():yield from walk(x,p+'/'+k)
 elif isinstance(v,list):
  for i,x in enumerate(v):yield from walk(x,p+'/'+str(i))
def narrative(p):return any(k in p.split('/') for k in ['status','allocationStatus','scope','checks','limitations'])
chain=[ref(P/'campaign3-history-base-allocation-rev1/review.json'),ref(P/'campaign3-history-trace-packaging-authority-rev1/review.json'),ref(P/'CAMPAIGN2_PROBE_RUNTIME_QUALIFICATION.md'),ref(P/'CAMPAIGN2_PROBE_QUALIFICATION_REVIEW.md')]
sources=[];leaves=[]
for p,n in notes.items():
 assert p in ix['unassignedCandidatePaths'] and ref(p)['sha256']==entries[p]['sha256']
 sources.append(dict(**ref(p),role='TRACE/PROBE ALLOCATION AND CORRECTED ACCESSOR AUTHORITY',judgment=n,acceptanceChain=chain))
 if p.endswith('.json'):leaves.extend(dict(source=p,pointer=q,text=x,role='NARRATIVE' if narrative(q) else 'BACKING') for q,x in walk(load(p)))
rows=[];counts=collections.Counter()
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in notes:continue
  assert u['sourceSha256']==entries[u['source']]['sha256'];kind='NARRATIVE' if u['source'].endswith('.md') or narrative(u['location']['pointer']) else 'BACKING';counts[kind]+=1
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],category=kind))
assert len({r['occurrenceId'] for r in rows})==len(rows)
O.mkdir(exist_ok=True);save('schema.json',dict(shortStringsIncluded=True,leaves=leaves))
save('review.json',dict(status='TWELVE TRACE/PROBE ALLOCATION AND AUTHORITY SOURCES RECONCILED',checker=ref(__file__),sourceIndex=ref(ip),sourceRoles=sources,rows=rows,exactBindings=bindings,schema=ref(O/'schema.json'),preservedArtifacts=[],previouslyReviewedBackingTable=ref('docs/formal/REGULATORY_PROBE_ALLOCATION_TABLE.json'),limits=['Current parity/hash checks do not rerun original allocation writers or runtime controls.','Old model retention after accessor fix explicitly rejected; no trace bytes retroactively admitted under prior identity.','Diagnostic observation-only qualification preserves F/G component-versus-public scopes, output-closure failure and later fix.','No new archive/source gap/model/allocation/verdict/corpus/obligation status change; independent adequacy remains open.'],obligations=['RO-C3-008','RO-C3-019','RO-C3-020','RO-C3-021']))
save('check.json',dict(status='PASS TRACE/PROBE ALLOCATION HISTORY AND EXACT BINDINGS',sources=len(sources),originalNarrativeOccurrences=counts['NARRATIVE'],originalBackingOccurrences=counts['BACKING'],stringLeaves=len(leaves),exactBindings=len(bindings),review=ref(O/'review.json')))
assert all(p.stat().st_size<50000000 for p in O.iterdir())
print(json.dumps(load(O/'check.json')))
