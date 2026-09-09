import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createServer} from 'vite';
import {cognitiveDeclarationTools} from './cognitive-model-declarations.mjs';
const output='docs/planning/COGNITIVE_RECIPE_DIFFERENCE_REVIEW_REV1.json';assert(!fs.existsSync(output));
const fp=path=>({path,sha256:createHash('sha256').update(fs.readFileSync(path)).digest('hex')});
const paths=['scripts/cognitive-model-declarations.mjs','scripts/review-cognitive-recipe-differences.mjs','docs/formal/TASK_COGNITIVE_SHAPE_MANIFEST.json'];const before=paths.map(fp);
const server=await createServer({configFile:false,server:{middlewareMode:true},appType:'custom'});
try{
 const t=await cognitiveDeclarationTools(server),{f,key}=t;
 const expected={baseline:[],...Object.fromEntries(['zero','one','two'].map(n=>['workspace-'+n,['definition/task-workspace']])),'task-access-off':['definition/task-workspace'],'forecast-access-off':['definition/task-workspace'],'concern-off':['definition/task-concern'],'base-off':['definition/task-motive'],'plan-access-off':['definition/task-candidates'],'standing-access-off':['definition/task-reason-source'],'execution-blocked':['definition/protocol-execution'],'protocol-observer-off':['definition/protocol-observation'],'equal-criteria':['definition/task-b'],'deadline-overlap':['definition/task-a','definition/task-b'],'history-boundary':['definition/protocol-execution','definition/task-a','definition/task-b'],'standing-integer':['definition/task-reason-dice'],'context-integer':['definition/task-reason-dice'],...Object.fromEntries(['six','eight','ten','twelve'].map(n=>['die-'+n,['definition/task-reason-dice']]))};
 const base=t.source(),baseSlots=t.decode(base.registry).items;
 const rowMap=source=>new Map(t.decode(source.registry).items[0].items.filter(v=>v.schema?.typeId===171n).map(r=>[key(f(r,1)),r]));const normal=rowMap(base),results=[];
 for(const recipe of t.recipes){const source=t.source(recipe),rows=rowMap(source),changed=[];assert.deepEqual([...rows.keys()],[...normal.keys()]);
  for(const [id,row] of rows)if(key(row)!==key(normal.get(id)))changed.push(f(row,1).payload.value);
  assert.deepEqual(changed.sort(),expected[recipe].slice().sort(),recipe);
  assert.deepEqual(source.content,base.content);assert.deepEqual(source.parameters,base.parameters);
  const slots=t.decode(source.registry).items;for(let i=1;i<6;i++)assert.equal(key(slots[i]),key(baseSlots[i]));
  const get=name=>f([...rows.values()].find(r=>f(r,1).payload?.value==='definition/'+name),4);
  assert.equal(key(f(get('task-motive'),1)),key(t.c.rational(1,10)));
  assert.equal(key(f(get('task-concern'),1)),key(t.c.rational(1,1)));
  assert.equal(key(f(get('task-reason-source'),2)),key(t.c.rational(1,10)));
  assert.equal(f(get('protocol-contact-one'),1).value,1n);assert.equal(f(get('protocol-contact-two'),1).value,2n);
  assert.equal(f(get('task-instruction-one'),1).payload.value,'definition/protocol-contact-one');assert.equal(f(get('task-instruction-two'),1).payload.value,'definition/protocol-contact-two');
  const workspace=get('task-workspace');assert.equal(f(workspace,2).value,BigInt({'workspace-zero':0,'workspace-one':1,'workspace-two':2}[recipe]??3));assert.equal(f(workspace,3),recipe!=='task-access-off');assert.equal(f(workspace,4),recipe!=='forecast-access-off');
  assert.equal(f(get('task-concern'),2),recipe!=='concern-off');assert.equal(f(get('task-motive'),2),recipe!=='base-off');assert.equal(f(get('task-candidates'),1),recipe!=='plan-access-off');assert.equal(f(get('task-reason-source'),1),recipe!=='standing-access-off');assert.equal(f(get('protocol-execution'),1),!['execution-blocked','history-boundary'].includes(recipe));assert.equal(f(get('protocol-observation'),4),recipe!=='protocol-observer-off');
  for(const [i,suffix] of ['a','b'].entries()){const spec=get('task-'+suffix);assert.equal(f(spec,5).value,1n);assert.equal(f(spec,6).value,BigInt(recipe==='deadline-overlap'?2+i:recipe==='history-boundary'?99+i:10+i));assert.equal(key(f(spec,3)),key(t.c.rational(recipe==='equal-criteria'?4:4+i,1)));assert.equal(key(f(spec,4)),key(t.c.rational(recipe==='equal-criteria'?6:6+i,1)));}
  results.push({recipe,changedRegistryRows:changed});
 }
 assert.deepEqual(paths.map(fp),before);
 fs.writeFileSync(output,JSON.stringify({status:'EXACT RECIPE DIFFERENCE REVIEW PASS',sourceFingerprints:before,models:21,results,checks:['exact row-difference sets','content/parameters and slots1..5 byte-identical across recipes','all access/permission booleans and workspace capacities literal','all task windows/criteria and action/instruction pairs literal','shared base/gain/K retained'],runtime:'NOT PASSED'},null,2)+'\n');console.log(JSON.stringify({models:21,status:'EXACT RECIPE DIFFERENCE REVIEW PASS'}));
}finally{await server.close();}
