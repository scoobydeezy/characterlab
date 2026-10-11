"""Review MULTISOURCE component lineage and pre-public representation corrections."""
from pathlib import Path
import json,hashlib
from collections import Counter
P=Path('docs/planning');O=P/'campaign3-history-multisource-components-rev1';B=P/'campaign3-history-universe-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def walk(v,p=''):
 if isinstance(v,dict):
  for k,x in v.items():yield from walk(x,p+'/'+k)
 elif isinstance(v,list):
  for i,x in enumerate(v):yield from walk(x,p+'/'+str(i))
 elif isinstance(v,str):yield p,v
def fingerprints(v):
 if isinstance(v,dict):
  if 'path' in v and 'sha256' in v:yield v
  for x in v.values():yield from fingerprints(x)
 elif isinstance(v,list):
  for x in v:yield from fingerprints(x)
specs={
 'docs/formal/MULTISOURCE_COVERAGE_COMPARISON.md':'Pure one-option/five-signal/four-atom exact component comparison. Ground/role/sign partitions,raw-basis union even when discounted,one final bounded transform and empty-basis convention preserved. FamilyNormalized counts families acrossroles/signs and intentionally admits orphan influence. DescriptionDice Base-only diagnostic; no new ground ontology,public evidence or unit conversion. Input-permutation invariance is not arbitrary renaming/tie invariance.',
 'docs/formal/MULTISOURCE_SELECTED_SOURCE_COMPONENT.md':'Actual once-consumed current local-reserve selection,oneview/signal,maxthree signals. Independently interpreted upper bounds and thresholds; task Base copied unchanged or absent; taskSituation requires candidate origin and holder,not inferred efficacy. No existing Situation/Standing mixture. Capability structure does not prove adoption/registry/time/public provenance; laterjoin/publicprofile separately provide those. Missing differsknownzero,criterionthreshold/polarity differbodyresponse.',
 'docs/formal/MULTISOURCE_SOURCE_JOIN.md':'Trusted private profile generatesbothsourcepaths and reads exactly268/1,373/1,373/2,487/1 before sensing/allocation; no suppliedraw/selectedparent. Active interval andactual instructions required. No statewrite; local allocationuniqueness is not scheduler rollback. Sourceauthenticity and registry/action/criterion links remain publicmodel gates; detached symbolic bundle is not frozen499 or public canonicaloutput.',
 'docs/formal/MULTISOURCE_SELECTED_DESCRIPTIONS.md':'Actual one/twoselected views form exactsingleton orconservativehull,not optimalfusion orstatisticalindependence. Missing support invalidateswholehull; knownzero keepsbasis. Three descriptions max inthis component. Equal1/3strength tie explicitlyorders bbeforehull for0versus1/6third contribution; no arbitrary IDrenamingclaim. Descriptionidentitydistinctground,not extraTaskKey; publicfourdescriptionintegration separatelyversioned.',
 'docs/planning/MULTISOURCE_EXPRESSIBILITY_AUDIT_2026_09_20.md':'Original sourcegap specific: adoptedtaskBase has emptyobservationalbasis,oldforecast-disabledtaskbranch cannot sharebody461without anew lawfulinterpretation. Fresh13fixtures/52laws/10dice/22parity reproduce componentcounterexamples. SyntheticnonemptytaskBase/negativebody controls notadmitted producers. Fixedindependentd8opponent andanalyticalprobabilities distinctfromactualtaskopponent. Laterboundedpubliccontract addressesgap without retroactively wideningoldmodels orwholeMULTIPASS.',
 'docs/planning/MULTISOURCE_COMMON_EVIDENCE_SOURCE_DRAFT.md':'Wholecurrentdraft includesstagedcomponent/join/descriptionsupdates andsixproducerobligations. Currentobservationprofile chosen,notretainedhistory. Explicit criterion/adoption,units,actual supportidentity andindependentlyintervened sources preserved. Historicalunfinishedfields resolvedonlyinlaterboundedpublicscope; permutation/renaming/generalNeed notclaimed solved. OlddraftSHAincheckpoint unavailable; this version is notitsalias.',
 'docs/planning/MULTISOURCE_SELECTED_SOURCE_CHECKPOINT.md':'13newsourcechecks pluspreservedcontrols produce38historicaltests. Sharedsameactualsupport, independentB20delivery1/2to1/6, independentthreshold/polarity-1/4,hidden21/29 equality andorphan1/3versus1/5 allcoveredbyfresh57superset. Node-onlytesthelper/buildfailure retained asreportedhistory; no freshbuildclaim. Component origin validation notpublicadoption authority; laterjoin/publicscope separate.',
 'docs/planning/MULTISOURCE_SOURCE_JOIN_CHECKPOINT.md':'11newjoinchecks extend38to49;freshsuperset covers exactfourreads/no writes,holder/adoption/window/channel mapping,Baseoff,forgery,reusedallocation,detachedprofile andrepeatequality. Correctedcapacity1workspace/inactivestatusunion fixturefinding retained. No scheduler rollback orpublicModelIdentity fromcomponent determinism; laternativepublicseam separate.',
 'docs/planning/MULTISOURCE_DESCRIPTION_CHECKPOINT.md':'Eightdescriptionchecks extend49to57 andfresh57pass. Actualsingleton/singleton/hull operands yield5/11versus1/2;duplicatebaseline1/3versusuncovered1/2. Declaration/channel order invariance withfixedIDs differsarbitraryrenaming. Missingchannelhull cannotshrink; negativepolarity andknownzero retainactualsupport. Fourteenrecordshape wasexplicitly incomplete andunallocated,not27recordpublicmodel.',
 'docs/planning/MULTISOURCE_COMPARISON_REV1.json':'Freshall13fixtures/52coverage laws/10Base-onlyDescriptionDice/22referencepartitions reproduceeveryoriginalrow,distribution,syntheticencodedargument andassertion. NoRNG,publicRunIdentity orproducer. Collective0versus1/8 gives5/9versus11/19 yetboth2/3probability; differentfromlateractualhullcalibration. OrphanFamilyNormalized1/2to3/5 retainedwithoutrepair.',
 'docs/planning/MULTISOURCE_COMPONENT_TESTS_2026_09_20.json':'Historical21assertions/twofiles; exactoccurrences retainedin38/49/57receipts andfresh57. Reporterpaths/titles/timings scopedtestbacking,not scientific claims beyond reviewedassertions. No full/reference rerun inferred.',
 'docs/planning/MULTISOURCE_SELECTED_SOURCE_TESTS_REV1.json':'Historical38assertions/fourfiles:13selectedsource tests,4body,11comparison,10receiving. Exactnames/statusmultiset survives49/57/fresh. Known/Unavailable,capability andcriterion scopes remaincomponentonly.',
 'docs/planning/MULTISOURCE_SOURCE_JOIN_TESTS_REV1.json':'Historical49assertions/fivefiles;adds11trustedjoinchecks whilepreserving38. Source/privateprofiletests coveractualboundaryconditions,notpublicoriginaladmission ortransactionrollback. Fresh57superset confirmsall49.',
 'docs/planning/MULTISOURCE_DESCRIPTION_TESTS_REV1.json':'Historical57assertions/sixfiles;freshsame57pass withallprior21/38/49preserved. Eightdescriptiontests exerciseactualselectedhull,supportloss,zero,negativepolarity,ordering andcapabilityisolation. No unexecutedwholeprogram coverage inferredfromtitles.',
 'docs/planning/MULTISOURCE_SOURCE_JOIN_RECEIPT_REV1.json':'Exactfiveartifactbindings and49/five-file historicalcount. BuildPASS remainsdated; componentonly/RO001ACTIVE describesthenfrontier,nowconditionalpublicscopewithoutgeneralclosure. Nonewallocation at706/0.',
 'docs/planning/MULTISOURCE_DESCRIPTION_RECEIPT_REV1.json':'Exactsixartifactbindings and57/six-file historicalcount. Unallocated14recordshape andcomponentdescriptionreceipt do notadmitpublicmodels. BuildPASS historical,notfresh. No newlaworcounterchange.',
 'docs/planning/MULTISOURCE_CHECKPOINT_2026_09_20.json':'DatedStageA/C13fixturecheckpoint and21tests;build predatesfinalweightedoverlaptest butproductionunchanged asreported. Sixoldrouting/draft/ledgerhashes unavailable andexcluded asauthenticatedoldcontent. Directcomparisons/currentcensus separately supportmaterialfindings. Receivingruntime workingf64/HEADa476 differexactlyCRLF/LF; text-equivalence isnotbyteidentity. Historical14verdicts/706/0notcurrentcounts.',
 'docs/planning/MULTISOURCE_PUBLIC_SHAPE_REV1.json':'Fourteenunallocatedsymbolic source/receiverrecords withclosedknown/absence variants,descriptionversusground andborrowedactualparents. Superseded byexplicit27recordpubliccontract,not byteidenticalschema promotion:criteria moveinto709,selectionactualancestry716,taskbatch717,rolesinside725,newreasonkey724. Max5signals/2nuclei becomes6/3inexplicitpublicdomain; no silentcomponentwidening. Sevenunclosedgates addressedonlyboundedpublicpath,notwholephenomenon.',
 'docs/planning/MULTISOURCE_PUBLIC_ALLOCATION_RECEIPT_REV1.json':'Historicalpermanent27records707..733/namespace1149/62members boundsto62048precorrectiontable. SHA-exact reconstructionrecoversexactbytes bydocumented711/6,7 ref149to141 reversal/removingcorrectionentry; labeledreconstructionnotGitrecovery. No modeladmittedunderwrongshape; cannotcallthisoriginaltablecurrent.',
 'docs/planning/MULTISOURCE_PUBLIC_ALLOCATION_CORRECTION_REV1.json':'MS-ALLOC-CORR-001 ispre-model711read/writepattern correction141to149,IDs/schemaunchanged. Exactold62048andcorrected07e9hashes verifiedandonlytwofieldtypespluscorrectionentry differ. Separatefromlaterinstruction/actionrejectedcohort andcodecvalidationregression; no thirdbehaviorallaw introduced.'
}
prior=load(P/'campaign3-history-source-roles-rev143/index.json');assert not set(specs)&{x['path'] for x in prior['roleAssignments']};archives={x['sha256']:x['path'] for x in prior['explicitBackingOutsideProseManifest']}
fresh=load(O/'comparison.json');assert fresh['status']=='PASS' and (fresh['fixtures'],fresh['lawRuns'],fresh['descriptionDiceRuns'],fresh['referenceParityChecks'])==(13,52,10,22)
assert fresh['rows']==load(fresh['original']['path'])['rows']
for x in [fresh['original'],fresh['checker'],*fresh['currentSources']]:assert ref(x['path'])==x
for x in fresh['bindings']:assert ref(x['resolvedPath'])['sha256']==x['sha256']
def relative(p):return p.replace('\\','/').split('/characterlab/',1)[1]
reportKeys={'numTotalTestSuites','numPassedTestSuites','numFailedTestSuites','numPendingTestSuites','numTotalTests','numPassedTests','numFailedTests','numPendingTests','numTodoTests','snapshot','startTime','success','testResults'}
suiteKeys={'assertionResults','endTime','message','name','startTime','status'};assertionKeys={'ancestorTitles','duration','failureMessages','fullName','meta','status','title'}
def tests(path,count,files):
 v=load(path);assert set(v)==reportKeys and v['success'] and v['numTotalTests']==v['numPassedTests']==count and len(v['testResults'])==files
 assert not any(v[k] for k in ['numFailedTestSuites','numPendingTestSuites','numFailedTests','numPendingTests','numTodoTests']) and not any(v['snapshot'].values())
 for r in v['testResults']:
  assert set(r)==suiteKeys and r['status']=='passed' and r['message']==''
  for a in r['assertionResults']:assert set(a)==assertionKeys and a['status']=='passed' and a['meta']=={} and a['failureMessages']==[]
 c=Counter((relative(r['name']),a['fullName'],a['status']) for r in v['testResults'] for a in r['assertionResults']);assert c.total()==count;return c
history=[tests(P/n,c,f) for n,c,f in [('MULTISOURCE_COMPONENT_TESTS_2026_09_20.json',21,2),('MULTISOURCE_SELECTED_SOURCE_TESTS_REV1.json',38,4),('MULTISOURCE_SOURCE_JOIN_TESTS_REV1.json',49,5),('MULTISOURCE_DESCRIPTION_TESTS_REV1.json',57,6)]]
for a,b in zip(history,history[1:]):assert a<=b
assert history[-1]==tests(O/'current-tests.json',57,6)
recovery=load(O/'source-recovery.json');assert len(recovery['found'])==1 and len(recovery['unavailable'])==6
oldPath=O/'MULTISOURCE_PUBLIC_ALLOCATION_TABLE.pre-correction.json';old=load(oldPath);accepted=load('docs/formal/MULTISOURCE_PUBLIC_ALLOCATION_TABLE.json');correction=load(P/'MULTISOURCE_PUBLIC_ALLOCATION_CORRECTION_REV1.json');allocReceipt=load(P/'MULTISOURCE_PUBLIC_ALLOCATION_RECEIPT_REV1.json')
assert ref(oldPath)['sha256']==correction['priorSha256']==allocReceipt['sha256']
assert ref('docs/formal/MULTISOURCE_PUBLIC_ALLOCATION_TABLE.json')['sha256']==correction['correctedSha256']
new=json.loads(json.dumps(old));reg=next(r for r in new['records'] if r['typeId']==711)
for f in reg['fields']:
 if f['id'] in [6,7]:assert f['type']['list']=='ref:141';f['type']['list']='ref:149'
new['corrections']=accepted['corrections'];assert new==accepted
assert len(old['records'])==27 and len(old['members'])==62 and correction['modelsAdmittedBeforeCorrection']==0
shape=load(P/'MULTISOURCE_PUBLIC_SHAPE_REV1.json');assert len(shape['records'])==14 and all(not x for x in shape['allocation'].values()) and len(shape['unclosedGates'])==7
shapeNames={r['name'] for r in shape['records']};borrowed=set()
def refs(v):
 if isinstance(v,dict):
  if 'ref' in v:yield v['ref']
  for x in v.values():yield from refs(x)
 elif isinstance(v,list):
  for x in v:yield from refs(x)
for r in refs(shape):assert r in shapeNames or r.startswith('inherited/');borrowed.add(r)
shapeMap={
 'MultisourceCriterionDefinition':[709], 'MultisourceDescriptionDefinition':[709], 'MultisourceSelectedSignalViews':[715], 'MultisourceSelectionSnapshot':[713,714,716], 'MultisourceDescriptionAssessment':[718], 'MultisourceOpportunity':[712], 'MultisourceSourceOutput':[717,719], 'MultisourceRawKey':[720], 'MultisourceRawSignal':[721], 'MultisourceRawOutput':[722], 'MultisourceCoverageWitness':[723], 'MultisourceRoleTotals':[725], 'MultisourceReasonNucleus':[724,725], 'MultisourceReasonsOutput':[726]}
assert set(shapeMap)==shapeNames and all(n in {r['typeId'] for r in accepted['records']} for ids in shapeMap.values() for n in ids)
checkpoint=load(P/'MULTISOURCE_CHECKPOINT_2026_09_20.json');preservation=[]
for f in checkpoint['preservation']:
 p=f['path'] if ref(f['path'])['sha256']==f['workingCopySha256'] else archives.get(f['workingCopySha256']);assert p and ref(p)['sha256']==f['workingCopySha256']
 if f['headSha256']!=f['workingCopySha256']:assert f['path']=='src/campaign3/receivingRuntime.ts' and hashlib.sha256(Path(p).read_bytes().replace(b'\r\n',b'\n')).hexdigest()==f['headSha256']
 preservation.append(dict(**f,resolvedPath=p,scope='Exact working bytes; historical HEAD text equality independently reproducible by CRLF-to-LF only where hashes differ. No current HEAD identity claim.'))
chain=[ref(O/n) for n in ['comparison.json','current-tests.json','source-recovery.json']]+[ref('docs/formal/MULTISOURCE_PUBLIC_CONTRACT.md'),ref(P/'CAMPAIGN3_MULTISOURCE_PUBLIC_QUALIFICATION.md'),ref(P/'campaign3-history-multisource-freeze-rev1/review.json')]
entries={x['path']:x for x in load(B/'manifest.json')['entries']};roles=[];strings={};bindings=[];unavailable=[];missing={(x['path'],x['sha256']) for x in recovery['unavailable']}
for p,j in specs.items():
 assert ref(p)['sha256']==entries[p]['sha256'];roles.append(dict(**ref(p),role='MULTISOURCE COMPONENT CLAIM / SUPERSEDED SOURCE SHAPE / PRE-MODEL CORRECTION',judgment=j,acceptanceChain=chain))
 if not p.endswith('.json'):continue
 data=load(p)
 for ptr,s in walk(data):strings[p,ptr]=s
 for f in fingerprints(data):
  path=f['path'] if Path(f['path']).exists() and ref(f['path'])['sha256']==f['sha256'] else archives.get(f['sha256'])
  if path:assert ref(path)['sha256']==f['sha256'];bindings.append(dict(source=p,originalPath=f['path'],sha256=f['sha256'],resolvedPath=path))
  else:
   assert (f['path'],f['sha256']) in missing
   unavailable.append(dict(source=p,**f,disposition='Excluded as authenticated old document-content authority. Whole census versions separately reviewed; exact comparison/test evidence supports bounded claims without inferring unseen historical prose. Final HQ011adequacy must assess exclusions.'))
rows=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in specs:continue
  assert u['sourceSha256']==entries[u['source']]['sha256'];ptr=u['location'].get('pointer','')
  if u['source'].endswith('.json'):assert strings[u['source'],ptr]==u['text']
  narrative=u['source'].endswith('.md') or ptr.startswith(('/status','/scope','/disposition','/limits','/models','/distributionProbe','/validation','/nextGate','/unclosedGates','/comparators')) or '/constraints/' in ptr or ptr.endswith('/authority')
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],role='NARRATIVE AUTHORITY/FINDING' if narrative else 'TYPED EVIDENCE BACKING',judgment=specs[u['source']]))
r=dict(status='MULTISOURCE COMPONENT LINEAGE RECONCILED; SIX HISTORICAL CONTENT EXCLUSIONS; HQ011 OPEN',sourceRoles=roles,rows=rows,stringLeaves=len(strings),bindings=bindings,unavailableSourceBindings=unavailable,preservation=preservation,preservedArtifacts=[ref(oldPath)],reconstructionMethod=recovery['found'][0]['method'],shapeSuccessorMap=shapeMap,obligations=['RO-C3-001','RO-C3-007','RO-C3-008','RO-C3-019','RO-C3-020','RO-C3-021'],limits=['Fresh13fixtures/52lawruns/10dice/22parity/57tests only; nofreshbuild/reference/public result claimedhere.','Sixoldrouting/draft/ledger hashes remain unavailable after boundedlocalexactpathGit plusCRLFcandidates; currentcensus versions notaliases.','Precorrectionallocation reconstructed toexactSHA,notoriginalGitrecovery; this doesnotproveindependenthistoricalchronology.','Symbolic14recordproposal superseded byexplicit27recordintegration,notdirectnumericfreeze. Componentdomains remain unchanged; actualpublicopponent/sourceancestry requires separateevidence.','No generalNeed,optimalfusion,statisticalindependence,renaminginvariance ornormalizationlaw chosen; noobligationclosure/HQ012entry.'])
c=dict(status='PASS WITH SIX HISTORICAL CONTENT EXCLUSIONS; HQ011 OPEN',sources=len(specs),originalNarrativeOccurrences=sum(x['role'].startswith('NARRATIVE') for x in rows),originalBackingOccurrences=sum(x['role'].startswith('TYPED') for x in rows),stringLeaves=len(strings),resolvedBindings=len(bindings),unavailableBindings=len(unavailable),reconstructedSources=1,freshFixtures=13,freshLawRuns=52,freshDescriptionDice=10,freshParity=22,freshTests=57,checker=ref(__file__))
for n,v in [('review.json',r),('check.json',c)]:
 p=O/n
 if p.exists():assert load(p)==v
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
print(json.dumps(c))
