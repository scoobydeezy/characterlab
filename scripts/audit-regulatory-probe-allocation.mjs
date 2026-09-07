// Allocation consistency only; no runtime or activation verdict.
import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
const root=new URL('../',import.meta.url),prefix='docs/formal/';
const raw=p=>fs.readFileSync(new URL(p,root));
const read=p=>raw(p).toString('utf8');
const hash=p=>crypto.createHash('sha256').update(raw(p)).digest('hex');
const tablePath=prefix+'REGULATORY_PROBE_ALLOCATION_TABLE.json';
const markdownPath=prefix+'REGULATORY_PROBE_ALLOCATION_REVIEW.md';
const t=JSON.parse(read(tablePath)),md=read(markdownPath),checks=[];
function eq(name,a,b){assert.deepEqual(a,b,name);checks.push({name,status:'PASS'});}
eq('allocation lifecycle',['REVIEW CANDIDATE','PERMANENT AND FROZEN'].includes(t.status),true);
eq('allocation version',t.version,t.status==='REVIEW CANDIDATE'?'regulatory-probe-allocation/0.1-draft':'regulatory-probe-allocation/0.1-candidate');
eq('accepted authority',t.authority,prefix+'REGULATORY_DIAGNOSTIC_PROBE.md');
eq('whole shape accepted',read(t.authority).includes('**Status: WHOLE SHAPE ACCEPTED.**'),true);
eq('semantic version',t.semanticVersion,'regulatory-diagnostic-probe/0.1-candidate');
eq('Markdown lifecycle',md.includes(`**Status: ${t.status}.**`),true);
eq('Markdown version',md.includes('`'+t.version+'`'),true);
const expected=[
 ['RegulatoryProbeDefinition',['CharacterId','RegulatoryVariableId','Channel','Available','ObserverPermitted'],['CharacterId','RegulatoryVariableId','DiagnosticProbeChannel','Boolean','Boolean']],
 ['DiagnosticProbeChannel',['ObservationChannelId','ObserverId','SubjectId','ModalityId','UnitId'],['ObservationChannelId','ObserverId','CharacterId','ModalityId','ObservationUnitId']],
 ['RegulatoryProbeOpportunity',['ProbeDefinitionId'],['RegistryDefinitionId']],
 ['RegulatoryProbeTruth',['RegulatoryProbeTruthId','ProbeDefinitionId','OccurredAt','EffectiveValue'],['RegulatoryProbeTruthId','RegistryDefinitionId','SignedSimInstant','SignedInteger']],
 ['RegulatoryProbeCarrier',['VariantTag','Truth','ProbeDefinitionId','Support'],['UnsignedInteger','RegulatoryProbeTruth','RegistryDefinitionId','SupportingObservationId']],
];
eq('five records',t.records.length,5);
expected.forEach(([name,names,types],i)=>{
 const r=t.records[i];
 eq(name+' exact layout',r,{name,typeId:331+i,schemaVersion:1,fields:names.map((name,j)=>({id:j+1,name,type:types[j],required:i!==4||j===0}))});
 eq(name+' Markdown',md.includes(`| ${r.typeId} | ${name} | 1 |`),true);
 for(const f of r.fields)eq(name+'.'+f.name+' Markdown',md.includes(`| ${r.typeId} | ${f.id} | ${f.name} | ${f.type} | ${f.required} |`),true);
});
eq('one distinct runtime family',t.namespaces,[{namespace:1123,name:'RegulatoryProbeTruthId',scope:'run-scoped occurrence',payload:'unsigned-runtime-ordinal'}]);
eq('family Markdown',md.includes('| 1123 | RegulatoryProbeTruthId | unsigned-runtime-ordinal |'),true);
const events=['','-observation','-tracking','-binding','-classification','-freeze','-evaluation-padding','-evidence-padding'].map(s=>({namespace:1001,payload:'event/regulatory-diagnostic-probe'+s}));
eq('complete exact member inventory',t.members,[{namespace:1027,payload:'definition/regulatory-diagnostic-probe'},{namespace:1023,payload:'registry/regulatory-diagnostic-probe'},...events,{namespace:1036,payload:'seam/regulatory-diagnostic-probe'},{namespace:1039,payload:'unit/diagnostic-regulatory-level'}]);
for(const m of t.members){eq(m.payload+' NFC',m.payload.normalize('NFC'),m.payload);eq(m.payload+' Markdown',md.includes(`| ${m.namespace} | ${m.payload} |`),true);}
eq('closed union',t.unionVariants,[{recordTypeId:335,tag:1,name:'Suppressed',requiredFields:[1],forbiddenFields:[2,3,4]},{recordTypeId:335,tag:2,name:'Observing',requiredFields:[1,2,3],forbiddenFields:[4]},{recordTypeId:335,tag:3,name:'Supporting',requiredFields:[1,4],forbiddenFields:[2,3]}]);
const governed=[[1,[1],[2,3,4]],[2,[1,2,3],[4]],[3,[1,4],[2,3]]].map(([tag,required,forbidden])=>({
 stableId:{namespace:1024,payload:{kind:'list',items:[{kind:'unsigned',value:335},{kind:'unsigned',value:tag}]}},
 registryKind:{namespace:1023,payload:'registry/union-variant-definition'},definitionVersion:'union-variant/1',
 definition:{recordTypeId:259,schemaVersion:1,fields:[{id:1,kind:'unsigned',value:335},{id:2,kind:'unsigned',value:tag},{id:3,kind:'set',elementKind:'unsigned',values:required},{id:4,kind:'set',elementKind:'unsigned',values:forbidden}]}
}));
eq('exactly three governed type-259 entries',t.unionVariantEntries,governed);
for(const [i,e] of governed.entries()){
 const tag=i+1,required=e.definition.fields[2].values,forbidden=e.definition.fields[3].values;
 eq('governed tag '+tag+' Markdown',md.includes(`| 1024 | [335,${tag}] | 259/1 | 335 | ${tag} | {${required.join(',')}} | {${forbidden.join(',')}} |`),true);
 eq('governed tag '+tag+' descriptor parity',t.unionVariants[i].requiredFields,required);
 eq('governed tag '+tag+' forbidden parity',t.unionVariants[i].forbiddenFields,forbidden);
}
for(const v of t.unionVariants)eq(v.name+' Markdown',md.includes(`| 335 | ${v.tag} | ${v.name} | ${v.requiredFields.join(',')} | ${v.forbiddenFields.join(',')} |`),true);
const roles=[[331,1,1002,true],[331,2,1029],[332,1,1005],[332,2,1000],[332,3,1002,true],[332,4,1006],[332,5,1039],[333,1,1027],[334,1,1123],[334,2,1027],[335,3,1027]].map(([recordTypeId,fieldId,requiredNamespace,qualified])=>({recordTypeId,fieldId,requiredNamespace,...(qualified?{domainValidatorId:'validator/character-qualification'}:{})}));
eq('exact identity role coverage',t.roles,roles);
for(const r of roles)eq('role '+r.recordTypeId+'/'+r.fieldId+' Markdown',md.includes(`| ${r.recordTypeId} | ${r.fieldId} | ${r.requiredNamespace} | ${r.domainValidatorId??'absent'} |`),true);
eq('single truth occurrence',t.occurrenceDefinitions,[{recordTypeId:334,identityFieldId:1,namespace:1123,allocator:'existing shared run runtime ordinal'}]);
eq('no state allocation',t.stateRoots,[]);eq('no save allocation',t.saveFields,[]);
const all=fs.readdirSync(new URL(prefix,root));
const priorNames=all.filter(n=>n.endsWith('ALLOCATION_TABLE.json')&&n!=='REGULATORY_PROBE_ALLOCATION_TABLE.json');
for(const n of priorNames){
 const p=prefix+n,prior=JSON.parse(read(p));
 eq(n+' preservation coverage',t.preservedSources.some(s=>s.path===p),true);
 for(const r of t.records)eq(n+' free record '+r.typeId,(prior.records??[]).some(x=>x.typeId===r.typeId),false);
 eq(n+' free namespace 1123',(prior.namespaces??[]).some(x=>x.namespace===1123),false);
 eq(n+' no prior carrier union identity',(prior.unionVariants??[]).some(x=>(x.typeId??x.recordTypeId)===335),false);
 for(const m of t.members)eq(n+' new member '+m.payload,(prior.members??[]).some(x=>x.namespace===m.namespace&&(x.payload??x.name)===m.payload),false);
}
const requiredPreserved=all.filter(n=>!n.startsWith('REGULATORY_PROBE_')&&(/ALLOCATION.*\.(json|md)$/.test(n)||['CANONICAL_RECORD_REGISTRY.md','EVENT_SEMANTIC_NUMERIC_REGISTRY.md','STATE_MODEL.md','CAMPAIGN2_BOUNDED_RULES_02.md','CAMPAIGN2_TRACE_BINDING.md'].includes(n))).map(n=>prefix+n).sort();
eq('complete prior artifact coverage',t.preservedSources.map(s=>s.path).sort(),requiredPreserved);
for(const s of t.preservedSources)eq('preserved '+s.path,hash(s.path),s.sha256);
for(const n of ['CANONICAL_RECORD_REGISTRY.md','EVENT_SEMANTIC_NUMERIC_REGISTRY.md','STATE_MODEL.md'])
 eq(n+' no candidate collisions',/\b(?:331|332|333|334|335|1123)\b/.test(read(prefix+n)),false);
const report={status:'PASS',allocationStatus:t.status,scope:'allocation consistency only; no runtime verdict; PROBE-A..P NOT PASSED',checks,checkCount:checks.length,tableSha256:hash(tablePath),markdownSha256:hash(markdownPath),authoritySha256:hash(t.authority)};
fs.writeFileSync(new URL(prefix+'REGULATORY_PROBE_ALLOCATION_AUDIT.json',root),JSON.stringify(report,null,2)+'\n');
console.log(`${checks.length} allocation checks PASS. No runtime verdict.`);
