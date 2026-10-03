/** longitudinal-routine-component/0.1-candidate. See the versioned seam contract. */
import {canonicalEncode as enc,text,list,signed,unsigned as u,type CanonicalValue} from '../substrate/canonicalEncoding';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key} from '../campaign2/canonicalData';
import {ExactRational as Q} from '../substrate/exactMath';
import {readQ} from '../campaign2/cognitiveMath';
import {RandomRunOracle,randomAddressValue} from '../substrate/random';
import {habitRecord as hr} from './habitCodecs';
import {appendHabit,habitSummary} from './habitMath';
import {ACTOR,OBSERVER,sid,longitudinalRecipe,compileLongitudinalModel} from './longitudinalModel';
import {decodeLongitudinal as decode} from './longitudinalCodecs';
import {prepareLongitudinalModel,createLongitudinalRun,restoreLongitudinalRun} from './longitudinalFactory';
import {originalInputs} from './longitudinalGoal';
import {goalReceivingChoice} from './longitudinalGoalChoice';
import {adoptMaintenanceGoal,settleMaintenanceGoal,readMaintenanceConcern,type MaintenanceGoal} from './bodilyMaintenanceGoal';

export const ROUTINE_VERSION='longitudinal-routine-component/0.1-candidate';
export const ROUTINE_LAWS=['Derived','Stored','ExplicitBeliefOnly','ScheduledOnly','EraseHistory'] as const;
export type RoutineLaw=typeof ROUTINE_LAWS[number];
export type RoutineMode='Maintained'|'Withdrawn'|'Opposed';
export interface RoutineProfile {law:RoutineLaw;mode:RoutineMode;seed:number;alternateCue:boolean;visible:boolean;keepEpisodes:boolean}
export const routineTimes=[1,2,3,4,5,6,7,8,14,15,16,17,18,19,20,21] as const;
const domains=new Map([['practice-outcome',{lower:Q.of(0n),upper:Q.of(1n)}]]);
const settings={candidate:1,law:1};
const frac=(x:Q)=>`${x.numerator}/${x.denominator}`;
const goalView=(gs:readonly MaintenanceGoal[])=>gs.map(g=>({id:g.goal,status:g.status,adoptedAt:String(g.adoptedAt),activeFrom:String(g.activeFrom),expiresAt:String(g.expiresAt),changedAt:String(g.changedAt),desired:frac(g.desired.lower)}));
const empty=()=>hr(820,[list([])]);
function admit(p:RoutineProfile){if(!p||!ROUTINE_LAWS.includes(p.law)||!['Maintained','Withdrawn','Opposed'].includes(p.mode)||!Number.isInteger(p.seed)||p.seed<0||p.seed>255||[p.alternateCue,p.visible,p.keepEpisodes].some(x=>typeof x!=='boolean'))throw Error('ROUTINE_PROFILE');return Object.freeze({...p});}

/** Neutral choice follows the HABIT zero-score tie policy, with the actual LONG actor. */
async function choose(options:string[],grounds:Parameters<typeof goalReceivingChoice>[1],at:number,seed:number){
 const result=await goalReceivingChoice(options,grounds,200+at,seed,true);
 if(!options.length||result.mode!=='NoActiveReasons')return result;
 const names=options.slice().sort(),probability=`1/${names.length}`;
 if(names.length===1)return {...result,chosen:names[0],mode:'Auto',probabilities:[{name:names[0],probability}]};
 const address={causalRootId:sid(1135,'routine-neutral/'+at),purposeId:sid(1042,'purpose/routine/tie'),subjectBindings:[{subjectRoleId:sid(1043,'subject/actor'),subjectId:ACTOR}],drawIndex:0n};
 const d=await new RandomRunOracle(new Uint8Array(32).fill(seed)).drawBounded(address,BigInt(names.length));
 return {...result,chosen:names[Number(d.result)],mode:'QuietRoll',probabilities:names.map(name=>({name,probability})),draws:[{address:key(randomAddressValue(address)),result:Number(d.result),span:Number(d.span)}]};
}

/** Pure receiving owner. Standing is an admitted operand, never physical source truth. */
export function createRoutineReceiver(input:RoutineProfile){
 const profile=admit(input);
 let prefix=0,busy=false,history:CanonicalValue=empty(),cache=habitSummary(settings,history),belief:boolean|undefined,goals:readonly MaintenanceGoal[]=[];
 const rows:{at:number;cue:boolean;opportunity:boolean;standing:string;historyBefore:string;historyAfter:string;strength:string;beliefBefore:boolean|null;beliefAfter:boolean|null;available:boolean;performed:boolean;observed:boolean;goalsBefore:ReturnType<typeof goalView>;goalsAfter:ReturnType<typeof goalView>;choice:Awaited<ReturnType<typeof choose>>}[]=[];
 const read=()=>{if(busy)throw Error('ROUTINE_BUSY');};
 const snapshot=()=>{read();return structuredClone({version:ROUTINE_VERSION,profile,actor:key(ACTOR),prefix,history:key(history),cache:key(cache),belief:belief??null,goals:goalView(goals),rows});};
 const save=()=>enc(text(JSON.stringify(snapshot())));
 const adopt=(prior:readonly MaintenanceGoal[],id:string,at:bigint,desired:bigint)=>adoptMaintenanceGoal(prior,{character:'longitudinal-target',goal:id,signal:'practice-outcome',desired:{lower:Q.of(desired),upper:Q.of(desired)},adoptedAt:at,activeFrom:at+1n,expiresAt:22n},domains);
 return Object.freeze({snapshot,save,
  async step(standing:Q,fault?:'after-choice'|'before-commit'){
   if(busy)throw Error('ROUTINE_CONCURRENT');if(prefix===routineTimes.length)return false;
   if(!(standing instanceof Q)||standing.compare(Q.of(-1n))<0||standing.compare(Q.of(1n))>0)throw Error('ROUTINE_STANDING');
   busy=true;
   try{
    const at=routineTimes[prefix],cue=profile.alternateCue&&at>=14,opportunity=at>=2&&at!==8;
    const summary=profile.law==='Stored'?cache:habitSummary(settings,history),strength=readQ(f(rec(summary,824n),cue?2n:1n));
    const available=profile.law==='ScheduledOnly'||belief===true||(profile.law!=='ExplicitBeliefOnly'&&strength.compare(Q.of(1n,2n))>=0);
    const active=goals.flatMap(g=>{const x=readMaintenanceConcern(goals,'longitudinal-target',g.goal,BigInt(at),domains);return x.kind==='Active'?[x.concern]:[];});
    const modifier=Number(standing.numerator*1000n/standing.denominator);
    const grounds:Parameters<typeof goalReceivingChoice>[1]=[
     ...(available&&belief===true?[{option:'practice',domain:'expected-reward',strength:1000,standing:modifier}]:[]),
     ...active.filter(g=>available||g.desired.lower.equals(Q.of(0n))).map(g=>({option:g.desired.lower.equals(Q.of(1n))?'practice':'idle',domain:'goal-'+g.goal,strength:750,standing:g.desired.lower.equals(Q.of(1n))?modifier:-modifier}))];
    const choice=await choose(opportunity?(available?['practice','idle']:['idle']):[],opportunity?grounds:[],at,profile.seed);
    if(fault==='after-choice')throw Error('ROUTINE_INJECTED');
    // Execution is conditional on chosen action and a real opportunity; the source never supplies the choice.
    const performed=opportunity&&choice.chosen==='practice',observed=performed&&profile.visible,reward=at<8;
    const observation=hr(836,[sid(1155,'routine-observation/'+at),signed(at),cue,observed,...(observed?[reward]:[])]);
    let nextHistory=appendHabit(history,observation).next,nextBelief=observed?reward:belief,nextGoals=goals;
    if(at===1){nextBelief=true;nextGoals=adopt(nextGoals,'practice',1n,1n);}
    // A controlled negative report changes expectation, not past practice or physical execution.
    if(at===8){nextBelief=false;if(profile.law==='EraseHistory')nextHistory=empty();
     if(profile.mode!=='Maintained')nextGoals=settleMaintenanceGoal(nextGoals,'longitudinal-target','practice',8n,'Withdraw',domains);
     if(profile.mode==='Opposed')nextGoals=adopt(nextGoals,'rest',8n,0n);
    }
    const nextCache=habitSummary(settings,nextHistory);
    const row={at,cue,opportunity,standing:frac(standing),historyBefore:key(history),historyAfter:key(nextHistory),strength:frac(strength),beliefBefore:belief??null,beliefAfter:nextBelief??null,available,performed,observed,goalsBefore:goalView(goals),goalsAfter:goalView(nextGoals),choice};
    if(fault==='before-commit')throw Error('ROUTINE_INJECTED');
    history=nextHistory;cache=nextCache;belief=nextBelief;goals=nextGoals;rows.push(row);prefix++;return true;
   }finally{busy=false;}
  }
 });
}

/** Unchanged native biography source plus transactionally joined receiving owners. */
export async function createLongitudinalRoutineRun(input:RoutineProfile){
 const profile=admit(input),source=longitudinalRecipe(profile.keepEpisodes?{retention:2}:{}),model=await compileLongitudinalModel(source),initialState=enc(model.initial.canonicalValue()),orderedInputs=originalInputs(),runSeed=new Uint8Array(32).fill(profile.seed);
 let native=await createLongitudinalRun(await prepareLongitudinalModel(source),{initialState,orderedInputs,runSeed});
 const receiver=createRoutineReceiver(profile);let busy=false;
 const read=()=>{if(busy)throw Error('ROUTINE_JOIN_BUSY');};
 const snapshot=()=>{read();return receiver.snapshot();};
 const nativeSave=()=>{read();return native.save();};
 const save=()=>{read();return enc(text(JSON.stringify({version:ROUTINE_VERSION,receiver:key(decode(receiver.save())),native:key(decode(native.save()))})));};
 const sourceView=()=>{read();return native.observerView(enc(OBSERVER));};
 return Object.freeze({snapshot,nativeSave,save,sourceView,
  async step(fault?:'after-source'|'after-choice'|'before-commit'){
   if(busy)throw Error('ROUTINE_JOIN_CONCURRENT');if(receiver.snapshot().prefix===routineTimes.length)return false;
   const before=native.save();busy=true;
   try{
    if(!await native.settleNextInstant())throw Error('ROUTINE_SOURCE_ENDED');
    if(fault==='after-source')throw Error('ROUTINE_INJECTED');
    if(native.snapshot().clock!==BigInt(routineTimes[receiver.snapshot().prefix]))throw Error('ROUTINE_SOURCE_TIME');
    const view=rec(decode(native.observerView(enc(OBSERVER))),881n);
    await receiver.step(readQ(f(view,2n)),fault);return true;
   }catch(error){native=await restoreLongitudinalRun(source,{initialState,orderedInputs,save:before});throw error;}finally{busy=false;}
  }
 });
}
export async function restoreLongitudinalRoutineRun(profile:RoutineProfile,prefix:number,saved:Uint8Array){
 if(!Number.isInteger(prefix)||prefix<0||prefix>routineTimes.length||!(saved instanceof Uint8Array))throw Error('ROUTINE_RESTORE');
 const copy=saved.slice(),run=await createLongitudinalRoutineRun(profile);for(let i=0;i<prefix;i++)await run.step();
 const actual=run.save();if(actual.length!==copy.length||actual.some((v,i)=>v!==copy[i]))throw Error('ROUTINE_SAVE_MISMATCH');return run;
}
