// Actual ownership compiler plus independent registration/source/role review.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createServer} from 'vite';
import {cognitiveDeclarationTools} from './cognitive-model-declarations.mjs';
const output='docs/planning/COGNITIVE_DECLARATION_JOIN_REVIEW_REV1.json';assert(!fs.existsSync(output));
const paths=['scripts/cognitive-model-declarations.mjs','scripts/review-cognitive-declaration-joins.mjs','src/campaign2/stateModel.ts','src/campaign2/taskDeclarations.ts','docs/planning/campaign2-cognitive-declaration-review/REVIEW_MANIFEST.json'];
const fp=path=>({path,sha256:createHash('sha256').update(fs.readFileSync(path)).digest('hex')}),before=paths.map(fp);
const server=await createServer({configFile:false,server:{middlewareMode:true,preTransformRequests:false},optimizeDeps:{noDiscovery:true,include:[]},appType:'custom'});
try{
 const t=await cognitiveDeclarationTools(server),{canonicalEncode:enc,set,list,record}=t.c,{f,key}=t;
 const {compileCampaign2StateModel}=await server.ssrLoadModule('/src/campaign2/stateModel.ts');
 const {compileTaskDeclarations}=await server.ssrLoadModule('/src/campaign2/taskDeclarations.ts');
 const predecessor=t.predecessor(),content=await compileTaskDeclarations(predecessor.content,predecessor.registry),oldSlots=t.decode(predecessor.registry).items;
 const codec={decode:t.decode,schema:id=>{const found=t.schemas.filter(s=>s.typeId===id);return found.find(s=>s.schemaVersion===2n)??found[0];}};
 const expected=[
  ['TaskWorkspaceTransition',40,381,null],['TaskAppraisalTransition',50,384,'TaskWorkspaceTransition'],['TaskConcernTransition',50,388,'TaskAppraisalTransition'],['TaskMotiveTransition',60,394,'TaskConcernTransition'],['TaskCandidateTransition',70,398,'TaskMotiveTransition'],['TaskRawSignalTransition',80,403,'TaskCandidateTransition'],['TaskReasonCompilationTransition',80,408,'TaskRawSignalTransition'],['TaskArbitrationTransition',80,409,'TaskReasonCompilationTransition'],['TaskIntentTransition',90,425,'TaskArbitrationTransition'],['TaskExpressionTransition',90,426,'TaskIntentTransition'],['TaskPlanTransition',100,431,'TaskIntentTransition'],['TaskAttemptTransition',110,432,'TaskPlanTransition'],['ProtocolExecutionTransition',110,433,'TaskAttemptTransition'],['ProtocolActualFactBridgeTransition',110,307,'ProtocolExecutionTransition'],['TaskQualificationTransition',130,429,'TaskExpressionTransition'],['TaskIdentityApplicationTransition',140,null,'TaskQualificationTransition'],
 ];
 function review(source){
  const slots=t.decode(source.registry).items,rows=slots[0].items.filter(v=>v.schema?.typeId===171n),byName=n=>{const found=rows.filter(r=>f(r,1).payload?.value===n);assert.equal(found.length,1,n);return f(found[0],4);};
  const stages=new Map();
  for(const [name,phase,out,parent] of expected){let value=byName(name),input,outputs,childIngress,domain;
   if(value.schema.typeId===417n){input=f(value,3);outputs=f(value,7);domain=f(value,6);assert.equal(phase,40);assert.equal(f(input,1).value,377n);}
   else if(value.schema.typeId===450n){input=f(value,3);outputs=f(value,5);childIngress=f(value,7);domain=f(value,4);}
   else{if(value.schema.typeId!==272n)value=f(value,1);assert.equal(value.schema.typeId,272n);const td=f(value,3);input=f(td,1);outputs=f(td,3);childIngress=f(value,4);domain=f(td,2);assert.equal(f(f(td,4),1).value,1n);}
   if(parent){assert.equal(f(childIngress,3).value,BigInt(phase));assert.equal(f(f(input,2),1).value,2n);assert.equal(f(f(input,2),5).payload.value,parent);assert.equal(f(input,3).value,1n);}
   assert.equal(outputs.items.length,out===null?0:1);if(out!==null){assert.equal(f(f(outputs.items[0],1),1).value,BigInt(out));assert.equal(f(outputs.items[0],2).value,1n);}
   stages.set(name,{phase,out,parent,input,domain});
  }
  for(const stage of stages.values())if(stage.parent){const parent=stages.get(stage.parent);assert(parent);assert(parent.phase<=stage.phase);assert.equal(f(f(stage.input,1),1).value,BigInt(parent.out));}
  assert.deepEqual(f(byName('TaskArbitrationTransition'),3).fields.get(2n),t.c.unsigned(90));
  const roleRows=slots[5].items.filter(v=>v.schema?.typeId===265n),oldRoles=oldSlots[5].items.filter(v=>v.schema?.typeId===265n),roleAt=(type,field)=>roleRows.find(v=>f(f(v,1),1).value===1n&&f(f(v,1),2).value===BigInt(type)&&f(f(v,1),4).value===BigInt(field));
  assert.equal(f(f(roleAt(200,9),2),1).value,1141n);
  for(const old of oldRoles){const p=f(old,1);if(f(p,1).value===1n&&f(p,2).value===200n&&f(p,4).value===9n)continue;assert(roleRows.some(v=>key(v)===key(old)),'inherited role preservation');}
  assert.equal(new Set(roleRows.map(v=>key(f(v,1)))).size,roleRows.length);
  const compiled=compileCampaign2StateModel(enc(slots[2]),enc(slots[3]),enc(slots[4]),content,codec),families=compiled.declaredFamilies();
  const instruction=families.find(v=>v.pattern.rootStateTypeId===373n&&v.pattern.fieldId===2n),status=families.find(v=>v.pattern.rootStateTypeId===373n&&v.pattern.fieldId===1n),identity=families.find(v=>v.pattern.rootStateTypeId===415n);
  assert(instruction.readonly);assert.equal(instruction.owner,undefined);assert.equal(instruction.keyGrammar.typeId,371n);assert.equal(instruction.grammar.recordTypeId,390n);
  assert.equal(status.owner,'authority/prospective-commitments');assert.equal(identity.owner,'authority/task-identity-evidence');assert.equal(identity.keyGrammar.typeId,412n);assert.equal(identity.grammar.recordTypeId,414n);assert.equal(identity.removalAllowed,false);
  return {slots,stages,families};
 }
 const reports=t.recipes.map(recipe=>{const value=review(t.source(recipe));return {recipe,stages:value.stages.size,stateFamilies:value.families.length};});
 const baseline=t.source(),slots=t.decode(baseline.registry).items;
 const mutateSlots=next=>({...baseline,registry:enc(list(next))});
 // Real ownership compiler must reject a read-only plan leaf claimed by the task authority.
 const owner=slots[2],owners=f(owner,2).items,taskOwner=owners.find(v=>f(v,1).payload.value==='authority/prospective-commitments'),plan=slots[3].items.find(v=>f(f(v,1),1).value===373n);
 const badOwner=record(taskOwner.schema,new Map([[1n,f(taskOwner,1)],[2n,set([...f(taskOwner,2).items,t.r(153,[f(plan,1),f(plan,2),false])])]]));
 const ownership=record(owner.schema,new Map([[1n,f(owner,1)],[2n,set(owners.map(v=>v===taskOwner?badOwner:v))]]));
 assert.throws(()=>review(mutateSlots(slots.map((v,i)=>i===2?ownership:v))),/read-only family overlaps/);
 const missingGrammar=set(slots[4].items.filter(v=>!(f(f(v,1),1).value===373n&&f(f(v,1),2).value===2n)));
 assert.throws(()=>review(mutateSlots(slots.map((v,i)=>i===4?missingGrammar:v))),/key grammar\/family coverage mismatch/);
 assert.deepEqual(paths.map(fp),before);
 fs.writeFileSync(output,JSON.stringify({status:'DECLARATION JOIN REVIEW PASS; WHOLE MODEL STILL PENDING',sourceFingerprints:before,recipes:reports,negativeControls:['actual ownership compiler rejects plan read-only/write overlap','actual ownership compiler rejects missing plan key grammar'],scope:['all16 new source/output/phase registration joins checked','one scoped200/9 role replacement, all other inherited role rows preserved','actual owner/read-only/key grammar construction across21 recipes','predecessor content context used only for inherited IDN construction checks; new runtime value qualification is not claimed'],remaining:['Complete exact receiving registry/definition and contextual member validation','Controlled model/profile freeze','Generated runtime and persistence qualification']},null,2)+'\n');
 console.log(JSON.stringify({models:21,stages:16,ownershipRejections:2,status:'DECLARATION JOIN REVIEW PASS'}));
}finally{await server.close();}
