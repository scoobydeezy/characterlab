/** Approved M61 follow-up: three physical tasks, no social task.
 * A target4..6; B/third0..10; same body30/rate10/width1 and seed0.
 * One normal current body sample at33; original end15 x=1/0 is the only arm difference.
 */
import {it,expect,vi} from 'vitest';
import {fixture as neutral,advance,snapshot,target,reports,bytes,live,exactProof,seamControls} from './assembledActionMemory.test';
import {changeDefinition} from './fixtures/assembledCharacter';
import {decode,enc} from './fixtures/assembledSpatialMeaning';
import {actionA,actionB} from './fixtures/assembledContraryCommunication';
import {signedValue,type Run} from './fixtures/assembledComparison';
import {list,signed,rational as q,type CanonicalValue} from '../substrate/canonicalEncoding';
import {dataItems as items,dataKey as key,dataRecord as rec,dataField as f,dataUnsigned as uint,dataText as txt} from '../campaign2/canonicalData';
import {readQ} from '../campaign2/cognitiveMath';
import {prepareCharacterModel,createCharacterRun,restoreCharacterRun} from '../assembled/character';
import {BODY_SAMPLE} from '../assembled/body';
import {JOINT_APPRAISAL} from '../assembled/appraisal';
import {ACTION_MEMORY,validateActionAnnex} from '../assembled/actionMemory';
import {SIGNIFICANCE,directions} from '../assembled/significance';
import {isPositionEpisodePath} from '../assembled/memory';
import * as stateModule from '../substrate/state';

const checkpointFile='docs/planning/ASSEMBLED_CHARACTER_M61_CONTEXT_CHECKPOINT.json.gz';
function fixture(o:Parameters<typeof neutral>[0]={}){
 const b=neutral(o);let s=changeDefinition(b.s,'definition/task-a',3n,q(4,1));s=changeDefinition(s,'definition/task-a',4n,q(6,1));
 const rows=items(decode(b.d.orderedInputs),'list'),sample=items(rows.find(v=>key(items(v,'list')[2])===key(BODY_SAMPLE))!,'list');
 expect(rows.some(v=>signedValue(items(v,'list')[0])===33n&&key(items(v,'list')[2])===key(BODY_SAMPLE))).toBe(false);
 return {...b,s,d:{...b.d,orderedInputs:enc(list([...rows,list([signed(33),...sample.slice(1)])]))}};
}
function contextGate(run:Run,moved:boolean){
 const joint=reports(run,JOINT_APPRAISAL).at(-1)!;expect(joint,'current joint report').toBeDefined();
 expect(typeof joint[2]!=='boolean'&&joint[2].kind==='record'&&joint[2].schema.typeId===461n,'live current body').toBe(true);
 const sample=rec(joint[2],461n),bounds=rec(f(sample,5n),462n),workspace=rec(f(rec(joint[1],384n),2n),381n);
 expect(f(bounds,1n)).toEqual(q(0,1));expect(f(bounds,2n)).toEqual(q(1,1));
 const forecast=rec(f(workspace,5n),380n);expect(uint(f(forecast,1n))).toBe(2n);expect(f(rec(f(forecast,2n),361n),1n)).toEqual(q(3,1));
 expect(txt(items(joint[5],'list')[1])).toBe('Current');
 const decision=live(run,moved),rawReport=reports(run,ACTION_MEMORY+'/reasons').find(v=>signedValue(v[1])===33n)!;
 const joined=items(rawReport[3],'list').map(v=>items(v,'list')),a=joined.find(v=>key(f(rec(f(rec(v[0],401n),1n),395n),2n))===key(actionA))!;
 const task=f(rec(a[0],401n),2n),row=items(joint[4],'list').map(v=>items(v,'list')).find(v=>key(v[0])===key(task))!;
 console.info('M61_CONTEXT_LIVE',JSON.stringify({moved,body:'0..1',forecast:'3',appraisal:row?.slice(1).map(key),raw:a?.slice(1).map(key),nuclei:decision.nuclei.map(v=>{const n=rec(v,407n);return {action:key(f(rec(f(rec(f(n,1n),404n),1n),395n),2n)),die:String(uint(f(n,4n))),standing:String(signedValue(f(n,5n))),situation:String(signedValue(f(n,6n)))};})}));
 expect(row).toHaveLength(5);expect(row[1]).toEqual(q(1,10));expect(row[2]).toEqual(q(59,60));expect(row[4]).toEqual(q(119,1200));
 expect(a.slice(1)).toEqual([q(119,1200),q(moved?1:0,20),q(moved?179:119,1200)]);
 for(const n0 of decision.nuclei){const n=rec(n0,407n),action=f(rec(f(rec(f(n,1n),404n),1n),395n),2n);
  expect(uint(f(n,4n))).toBe(6n);expect(signedValue(f(n,5n))).toBe(0n);expect(signedValue(f(n,6n))).toBe(key(action)===key(actionA)&&moved?1n:0n);
 }
 const probability=items(f(decision.data,2n),'list').map(v=>rec(v,421n)).find(v=>key(f(rec(f(v,1n),395n),2n))===key(actionA))!;
 expect(readQ(f(probability,2n))).toEqual(readQ(q(moved?47:36,72)));
}
async function io(){
 const fsName='node:fs',zName='node:zlib',bName='node:buffer';
 const [fs,z,{Buffer}]=await Promise.all([import(/* @vite-ignore */ fsName),import(/* @vite-ignore */ zName),import(/* @vite-ignore */ bName)]);
 return {fs,z,to:(b:Uint8Array)=>Buffer.from(b).toString('base64'),from:(s:string):Uint8Array=>new Uint8Array(Buffer.from(s,'base64'))};
}
it('M61 context pair: unchanged memory has a coupled choice effect',async()=>{
 const A=fixture(),B=fixture({moved:false});expect(A.s).toEqual(B.s);bytes(A.d.initialState,B.d.initialState);bytes(A.d.runSeed,B.d.runSeed);
 const rows=items(decode(A.d.orderedInputs),'list'),other=items(decode(B.d.orderedInputs),'list');expect(rows).toHaveLength(other.length);expect(rows.filter((v,i)=>key(v)!==key(other[i]))).toHaveLength(1);
 const handle=await prepareCharacterModel(A.s),runs:Run[]=[];let checkpoint:Uint8Array|undefined;
 for(const [b,moved] of [[A,true],[B,false]] as const){
  const run=await createCharacterRun(handle,b.d);runs.push(run);await advance(run,17n);const episode=target(run);
  expect(episode).toBeDefined();expect(directions(items(episode!,'list')[7])).toEqual(moved?['MovingCloser']:[]);
  expect(validateActionAnnex(items(episode!,'list')[8],items(episode!,'list'))?.action).toEqual(actionA);
  await advance(run,32n);if(moved)checkpoint=run.save();await advance(run,33n);expect(!!target(run)).toBe(moved);contextGate(run,moved);
 }
 await exactProof(A.s,runs);
 const tools=await io(),terminal=snapshot(runs[0]),bundle={source:'036e1969 + approved contextual test',checkpoint:tools.to(checkpoint!),terminal:{clock:String(terminal.clock),status:terminal.status,state:tools.to(terminal.state),outputs:tools.to(terminal.outputs),trace:tools.to(terminal.trace),save:tools.to(runs[0].save()),run:tools.to(runs[0].runIdentity())}};
 const packed=tools.z.gzipSync(JSON.stringify(bundle),{level:9});expect(packed.length).toBeLessThan(4*1024*1024);
 tools.fs.writeFileSync(checkpointFile,packed,{flag:'wx'});
 console.info('M61_CONTEXT_PAIR PASS original null retained;72 coupled cases; expected A47/72 vs36/72; checkpoint bytes',packed.length);
},570000);

it('M61 context continuation and ownership boundaries',async()=>{
 const tools=await io(),bundle=JSON.parse(tools.z.gunzipSync(tools.fs.readFileSync(checkpointFile)).toString()),b=fixture();
 const run=await restoreCharacterRun(b.s,{initialState:b.d.initialState,orderedInputs:b.d.orderedInputs,save:tools.from(bundle.checkpoint)});
 expect(run.snapshot().clock).toBe(32n);bytes(run.save(),tools.from(bundle.checkpoint));
 expect(await run.settleNextInstant()).toBe(true);const end=run.snapshot();expect(String(end.clock)).toBe(bundle.terminal.clock);expect(end.status).toBe(bundle.terminal.status);
 for(const k of ['state','outputs','trace'] as const)bytes(end[k],tools.from(bundle.terminal[k]));
 bytes(run.save(),tools.from(bundle.terminal.save));bytes(run.runIdentity(),tools.from(bundle.terminal.run));
 contextGate(run,true);await seamControls(b.s,run);
 console.info('M61_CONTEXT_CONTINUATION PASS exact repeat prefix32 and continuation33; selected/context/owner/immutable/version boundaries');
},390000);

it('M61 context privacy and reached formation rollback',async()=>{
 const A=fixture({denied:true}),B=fixture({denied:true,moved:false}),handle=await prepareCharacterModel(A.s);
 const a=await createCharacterRun(handle,A.d),b=await createCharacterRun(handle,B.d);await advance(a,17n);await advance(b,17n);
 expect(target(a)).toBeUndefined();expect(target(b)).toBeUndefined();for(const tag of [ACTION_MEMORY+'/forecast',ACTION_MEMORY+'/reasons',SIGNIFICANCE])expect(reports(a,tag)).toEqual(reports(b,tag));
 const D=fixture({reportDenied:true}),denied=await createCharacterRun(handle,D.d);await advance(denied,15n);expect(target(denied)).toBeDefined();expect(items(items(target(denied)!,'list')[8],'list')).toHaveLength(0);
 const R=fixture(),run=await createCharacterRun(handle,R.d);await advance(run,14n);const before=run.snapshot(),apply=stateModule.applyStatePatch;let reached=false;
 const spy=vi.spyOn(stateModule,'applyStatePatch').mockImplementation((...args)=>{const result=apply(...args);if(args[1].operations.some(o=>o.kind==='set'&&isPositionEpisodePath(o.path)&&items(items(o.newValue,'list')[8],'list').length===3)){reached=true;throw Error('M61 context after actual action episode patch');}return result;});
 try{await expect(run.settleNextInstant()).rejects.toThrow('M61 context after actual action episode patch');expect(reached).toBe(true);const after=run.snapshot();
  for(const k of ['state','outputs','trace'] as const)bytes(after[k],before[k]);expect(after.clock).toBe(14n);expect(after.status).not.toBe(before.status);expect(run.diagnostic()).toBeDefined();
 }finally{spy.mockRestore();}
 console.info('M61_CONTEXT_PRIVACY PASS denied evidence has equal reports; denied perceived performance has no annex; reached patch rollback');
},490000);
