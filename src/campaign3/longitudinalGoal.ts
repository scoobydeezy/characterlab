/** longitudinal-goal-component/0.1-candidate; composition of an unchanged native source. */
import {canonicalEncode as enc,text,list,signed,unsigned as u,rational as q} from '../substrate/canonicalEncoding';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key} from '../campaign2/canonicalData';
import {ExactRational as Q} from '../substrate/exactMath';
import {readQ} from '../campaign2/cognitiveMath';
import {longitudinalRecipe,compileLongitudinalModel,OBSERVER,ACTOR} from './longitudinalModel';
import {longitudinalRecord as r,decodeLongitudinal as decode} from './longitudinalCodecs';
import {prepareLongitudinalModel,createLongitudinalRun,restoreLongitudinalRun} from './longitudinalFactory';
import {adoptMaintenanceGoal,settleMaintenanceGoal,readMaintenanceConcern,type MaintenanceGoal} from './bodilyMaintenanceGoal';
import {goalReceivingChoice} from './longitudinalGoalChoice';
export const VERSION='longitudinal-goal-component/0.1-candidate';
export const LAWS=['SeparateOwners','FineStanding','NoFeedback','GoalEqualsOpportunity'] as const;
export type Law=typeof LAWS[number];
export type GoalMode='Maintained'|'Withdrawn'|'Replaced';
const times=[1,2,3,4,5,6,7,8,14,15,16,17,18,19,20,21];
const kinds=[1,1,2,3,2,3,4,0,0,0,0,2,3,4,3,0];
/** Exact original LONG scenario, including its actual memory-expiry and skill interference. */
export const originalInputs=()=>enc(list(times.map((at,i)=>r(864,[signed(at),u(kinds[i]),![7,18].includes(at),true,u(at===7?1:0),true,q(0,1),q(1,2),at===16]))));
const domains=new Map([['commitment-outcome',{lower:Q.of(0n),upper:Q.of(1n)}]]);
const frac=(x:Q)=>`${x.numerator}/${x.denominator}`;
const goalView=(gs:readonly MaintenanceGoal[])=>gs.map(g=>({id:g.goal,status:g.status,adoptedAt:String(g.adoptedAt),changedAt:String(g.changedAt),activeFrom:String(g.activeFrom),expiresAt:String(g.expiresAt),desired:frac(g.desired.lower)}));
const json=(x:unknown)=>JSON.stringify(x);
export async function createLongitudinalGoalRun(law:Law,mode:GoalMode,seed=0,keepEpisodes=false){
 if(!LAWS.includes(law)||!['Maintained','Withdrawn','Replaced'].includes(mode)||!Number.isInteger(seed)||seed<0||seed>255||typeof keepEpisodes!=='boolean')throw Error('LG_PROFILE');
 const source=longitudinalRecipe(keepEpisodes?{retention:2}:{}),model=await compileLongitudinalModel(source),initialState=enc(model.initial.canonicalValue()),orderedInputs=originalInputs(),runSeed=new Uint8Array(32).fill(seed);
 let native=await createLongitudinalRun(await prepareLongitudinalModel(source),{initialState,orderedInputs,runSeed});
 let prefix=0,busy=false,goals:readonly MaintenanceGoal[]=[],rows:{at:number;sourceRun:string;sourceView:string;standing:string;usedStanding:number;episodes:number;opportunity:boolean;goalsBefore:ReturnType<typeof goalView>;goalsAfter:ReturnType<typeof goalView>;choice:Awaited<ReturnType<typeof goalReceivingChoice>>}[]=[];
 const read=()=>{if(busy)throw Error('LG_BUSY');};
 const snapshot=()=>{read();return structuredClone({prefix,actor:key(ACTOR),goals:goalView(goals),rows});};
 const save=()=>{read();return enc(text(json({version:VERSION,law,mode,seed,keepEpisodes,prefix,goals:goalView(goals),rows,native:key(decode(native.save()))})));};
 const nativeSave=()=>{read();return native.save();};
 const adopt=(prior:readonly MaintenanceGoal[],id:string,at:bigint,desired:bigint)=>adoptMaintenanceGoal(prior,{character:'longitudinal-target',goal:id,signal:'commitment-outcome',desired:{lower:Q.of(desired),upper:Q.of(desired)},adoptedAt:at,activeFrom:at+1n,expiresAt:22n},domains);
 return Object.freeze({snapshot,save,nativeSave,
  async step(fault?:'after-source'|'after-choice'|'before-commit'){
   if(busy)throw Error('LG_CONCURRENT');if(prefix===times.length)return false;busy=true;const before=native.save();
   try{
    if(!await native.settleNextInstant())throw Error('LG_SOURCE_ENDED');if(fault==='after-source')throw Error('LG_INJECTED');
    const at=times[prefix];if(native.snapshot().clock!==BigInt(at))throw Error('LG_SOURCE_TIME');
    const view=rec(decode(native.observerView(enc(OBSERVER))),881n),standing=readQ(f(view,2n));
    const episodes=items(f(rec(f(view,5n),866n),1n),'list').length,opportunity=at>=8&&at!==8;
    const active=goals.flatMap(g=>{const x=readMaintenanceConcern(goals,'longitudinal-target',g.goal,BigInt(at),domains);return x.kind==='Active'?[x.concern]:[];});
    const usedStanding=law==='NoFeedback'?0:Number(standing.numerator*1000n/standing.denominator);
    // Fixed admitted meaning: uphold expresses the acquired commitment channel; defer opposes it.
    const grounds=[{option:'uphold',domain:'commitment',strength:500,standing:usedStanding},{option:'defer',domain:'comfort',strength:500,standing:-usedStanding},...active.map(g=>({option:g.desired.lower.equals(Q.of(1n))?'uphold':'defer',domain:'goal-'+g.goal,strength:750,standing:0}))];
    const choice=await goalReceivingChoice(opportunity?['uphold','defer']:[],opportunity?grounds:[],100+at,seed,law!=='SeparateOwners');
    if(fault==='after-choice')throw Error('LG_INJECTED');
    let next=goals;
    if(at===1)next=adopt(next,'original',1n,1n);
    if(at===8&&(mode!=='Maintained'||law==='GoalEqualsOpportunity'))next=settleMaintenanceGoal(next,'longitudinal-target','original',8n,'Withdraw',domains);
    if(at===8&&mode==='Replaced')next=adopt(next,'replacement',8n,0n);
    const row={at,sourceRun:Array.from(native.runIdentity()).map(x=>x.toString(16).padStart(2,'0')).join(''),sourceView:key(view),standing:frac(standing),usedStanding,episodes,opportunity,goalsBefore:goalView(goals),goalsAfter:goalView(next),choice};
    if(fault==='before-commit')throw Error('LG_INJECTED');goals=next;rows=[...rows,row];prefix++;return true;
   }catch(error){native=await restoreLongitudinalRun(source,{initialState,orderedInputs,save:before});throw error;}finally{busy=false;}
  }
 });
}
export async function restoreLongitudinalGoalRun(law:Law,mode:GoalMode,seed:number,keepEpisodes:boolean,prefix:number,saved:Uint8Array){
 if(!Number.isInteger(prefix)||prefix<0||prefix>16||!(saved instanceof Uint8Array))throw Error('LG_RESTORE');const copy=saved.slice(),run=await createLongitudinalGoalRun(law,mode,seed,keepEpisodes);for(let i=0;i<prefix;i++)await run.step();const actual=run.save();if(actual.length!==copy.length||actual.some((x,i)=>x!==copy[i]))throw Error('LG_SAVE_MISMATCH');return run;
}
