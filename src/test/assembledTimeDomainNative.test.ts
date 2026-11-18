import {it,expect} from 'vitest';
// Node-only evidence harness; not imported by production.
// @ts-ignore Node built-in in the test runner.
import {createHash} from 'node:crypto';
// @ts-ignore Node built-in in the test runner.
import {readFileSync,writeFileSync} from 'node:fs';
// @ts-ignore Node built-in in the test runner.
import {env} from 'node:process';
import {fixture,items,decode,key,text} from './fixtures/assembledMultiReceipts';
import {MAINTENANCE_HORIZON_RULES,MAINTENANCE_HORIZON_REGISTRY} from '../assembled/model';
import {prepareCharacterModel,createCharacterRun,restoreCharacterRun,characterModelIdentity} from '../assembled/character';
import {restoreAuthoritativeState} from '../substrate/state';
import {PERFORMANCE_OBS} from '../assembled/performance';
const digest=(v:Uint8Array)=>createHash('sha256').update(v).digest('hex');
const path='docs/planning/ASSEMBLED_CHARACTER_M158_BASELINE.json';
it('native158: unchanged current model retains every canonical boundary with actual performance learning',async()=>{
 const b=fixture('collective'),s={...b.s,rulesVersion:MAINTENANCE_HORIZON_RULES,registrySchemaVersion:MAINTENANCE_HORIZON_REGISTRY},m=await prepareCharacterModel(s),r=await createCharacterRun(m,b.d);
 const rows:unknown[]=[];let restored:typeof r|undefined,save:Uint8Array|undefined;
 function capture(){const snap=r.snapshot();return {at:String(snap.clock),status:snap.status,state:digest(snap.state),outputs:digest(snap.outputs),trace:digest(snap.trace),save:digest(r.save()),run:digest(r.runIdentity()),model:digest(characterModelIdentity(m))};}
 rows.push(capture());let done=false;
 for(let n=0;n<192;n++){const more=await r.settleNextInstant();if(restored){expect(await restored.settleNextInstant()).toBe(more);const a=r.snapshot(),z=restored.snapshot();for(const k of ['state','outputs','trace'] as const)expect(digest(a[k])).toBe(digest(z[k]));expect(digest(r.save())).toBe(digest(restored.save()));expect(digest(r.runIdentity())).toBe(digest(restored.runIdentity()));}
  rows.push(capture());if(r.snapshot().clock===6n&&!save){save=r.save();if(env.M158_CAPTURE!=='1')restored=await restoreCharacterRun(s,{initialState:b.d.initialState,orderedInputs:b.d.orderedInputs,save});}
  if(!more){done=true;break;}}
 expect(done).toBe(true);expect(save).toBeDefined();const snap=r.snapshot(),out=items(decode(snap.outputs),'list'),state=restoreAuthoritativeState(decode(snap.state));
 const observations=out.filter(v=>typeof v!=='boolean'&&v.kind==='list'&&key(v.items[0])===key(text(PERFORMANCE_OBS)));expect(observations).toHaveLength(2);
 expect(observations.map(v=>items(v,'list')[7])).toEqual([false,false]);expect(state.entries().some(e=>e.path.rootStateTypeId===1000n&&e.path.fieldId===4n)).toBe(false);expect(state.entries().some(e=>e.path.rootStateTypeId===1516n)).toBe(true);
 const receipt={baseline:'bc812f71',fixture:'assembledMultiReceipts collective promoted0.117; seed0',rows};
 if(env.M158_CAPTURE==='1')writeFileSync(path,JSON.stringify(receipt,null,2)+'\n');else expect(receipt).toEqual(JSON.parse(readFileSync(path,'utf8')));
 console.info('M158 '+(env.M158_CAPTURE==='1'?'BASELINE':'NATIVE')+' PASS '+rows.length+' canonical boundaries;2 actual performance observations, unengaged expectation null/learned value state; full queues'+snap.clock+(restored?'; exact save6 continuation':''));
},540000);
