import {it,expect} from 'vitest';
// @ts-expect-error Evidence.
import {readFileSync,writeFileSync} from 'node:fs';
// @ts-expect-error Evidence.
import {createHash} from 'node:crypto';
// @ts-expect-error Evidence.
import {inflateSync,deflateSync} from 'node:zlib';
import {fixture,enc,decode,items,list,text,q,type Case} from './fixtures/assembledIntentionSchedules';
import {changeDefinition} from './fixtures/assembledCharacter';
import {WORK_CUE_RULES,WORK_CUE_REGISTRY,POSITIVE_ACTIVATION_RULES,POSITIVE_ACTIVATION_REGISTRY} from '../assembled/model';
import {BENEFIT} from '../assembled/delayedBenefit';
import {COUNT} from '../assembled/countedGoal';
import {prepareCharacterModel,createCharacterRun,restorePreparedCharacterRun} from '../assembled/character';
import {cachedMemory} from './fixtures/assembledMemoryFinal';
const hash=(b:Uint8Array)=>createHash('sha256').update(b).digest('hex'),zip=(b:Uint8Array)=>({hash:hash(b),bytes:b.length,deflate:deflateSync(b,{level:9}).toString('base64')});
const old=JSON.parse(readFileSync('docs/planning/ASSEMBLED_CHARACTER_M269_INTENTION_EVIDENCE.json','utf8')),file='docs/planning/ASSEMBLED_CHARACTER_M281_INTENTION.json';
const unzip=(v:{deflate:string;hash:string;bytes:number})=>{const b=new Uint8Array(inflateSync(Uint8Array.from(atob(v.deflate),c=>c.charCodeAt(0))));expect(hash(b)).toBe(v.hash);expect(b.length).toBe(v.bytes);return b;};
it('intention281 current receiving and old exact carry',async()=>{
 const evidence:Record<string,unknown>={};
 for(const name of ['main','noCue','lost'] as Case[]){
  const b=fixture(name),base=changeDefinition(b.s,'definition/task-reason-dice',2n,q(0,1)),slots=[...items(decode(base.registry),'list')];expect(slots).toHaveLength(61);slots.push(list([text(BENEFIT),list([])]),list([text(COUNT),list([])]));
  const s={...base,rulesVersion:WORK_CUE_RULES,registrySchemaVersion:WORK_CUE_REGISTRY,registry:enc(list(slots))},m=await prepareCharacterModel(s),r=cachedMemory(await createCharacterRun(m,b.d));
  while(r.snapshot().clock<8n)expect(await r.settleNextInstant()).toBe(true);
  expect(r.snapshot().clock).toBe(8n);const snap=r.snapshot();evidence[name]={state:zip(snap.state),outputs:zip(snap.outputs),save:zip(r.save())};writeFileSync(file,JSON.stringify(evidence,null,2)+'\n');
  expect(snap.state,name+' full state').toEqual(unzip(old[name+'-8'].state));expect(snap.outputs,name+' full outputs').toEqual(unzip(old[name+'-8'].outputs));
  if(name==='main'){
   const restore=cachedMemory(await restorePreparedCharacterRun(m,{initialState:b.d.initialState,orderedInputs:b.d.orderedInputs,save:r.save()}));expect(restore.save()).toEqual(r.save());let done=false;
   for(let n=0;n<128;n++){const a=await r.settleNextInstant();expect(await restore.settleNextInstant()).toBe(a);expect(restore.save()).toEqual(r.save());if(!a){done=true;break;}}expect(done).toBe(true);
   const om=await prepareCharacterModel({...base,rulesVersion:POSITIVE_ACTIVATION_RULES,registrySchemaVersion:POSITIVE_ACTIVATION_REGISTRY}),or=cachedMemory(await createCharacterRun(om,b.d));done=false;
   for(let n=0;n<128;n++){if(!await or.settleNextInstant()){done=true;break;}}expect(done).toBe(true);expect(hash(or.save())).toBe(old['main-terminal'].save);
   evidence['continuation']={currentTerminal:hash(r.save()),oldExactTerminal:hash(or.save())};
  }
 }
 writeFileSync(file,JSON.stringify(evidence,null,2)+'\n');
},590000);
