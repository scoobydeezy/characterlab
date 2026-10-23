/** longitudinal-habit-component/0.1-candidate. Controlled component sources; no native admission. */
import {canonicalEncode as enc,text,list,signed,unsigned as u,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import {dataRecord as rec,dataField as f,dataKey as key} from '../campaign2/canonicalData';
import {ExactRational as Q} from '../substrate/exactMath';
import {readQ} from '../campaign2/cognitiveMath';
import {RandomRunOracle,randomAddressValue} from '../substrate/random';
import {habitRecord as hr} from './habitCodecs';
import {appendHabit,habitSummary} from './habitMath';
import {ACTOR,sid} from './longitudinalModel';
import {retainByRecency,type TimedAcquisition} from './recencyRetention';
import {reconcileFormationGovernance,type GovernanceEntry,type FormationCommit} from './formationGovernance';
import {goalReceivingChoice} from './longitudinalGoalChoice';
import {adoptMaintenanceGoal,settleMaintenanceGoal,readMaintenanceConcern,type MaintenanceGoal} from './bodilyMaintenanceGoal';

export const HABIT_VERSION='longitudinal-habit-component/0.1-candidate';
export const HABIT_LAWS=['Derived','Stored','ExplicitBeliefOnly','ScheduledOnly','EraseHistory'] as const;
export type HabitLaw=typeof HABIT_LAWS[number];
export interface HabitProfile {law:HabitLaw;seed:number;alternateCue:boolean;visible:boolean;keepEpisodes:boolean;relearning:'Observed'|'Hidden'|'Unavailable'}
export const habitTimes=[1,2,3,4,5,6,7,8,14,15,16,17,18,19,20,21] as const;
const domains=new Map([['practice-outcome',{lower:Q.of(0n),upper:Q.of(1n)}]]);
const settings={candidate:1,law:1};
const frac=(x:Q)=>`${x.numerator}/${x.denominator}`;
const goalView=(gs:readonly MaintenanceGoal[])=>gs.map(g=>({id:g.goal,status:g.status,adoptedAt:String(g.adoptedAt),activeFrom:String(g.activeFrom),expiresAt:String(g.expiresAt),changedAt:String(g.changedAt),desired:frac(g.desired.lower)}));
const empty=()=>hr(820,[list([])]);
function admit(p:HabitProfile){if(!p||!HABIT_LAWS.includes(p.law)||!['Observed','Hidden','Unavailable'].includes(p.relearning)||!Number.isInteger(p.seed)||p.seed<0||p.seed>255||[p.alternateCue,p.visible,p.keepEpisodes].some(x=>typeof x!=='boolean'))throw Error('LH_PROFILE');return Object.freeze({...p});}

/** Neutral choice follows the HABIT zero-score tie policy, with the actual LONG actor. */
async function choose(options:string[],grounds:Parameters<typeof goalReceivingChoice>[1],at:number,seed:number){
 const result=await goalReceivingChoice(options,grounds,300+at,seed,true);
 if(!options.length||result.mode!=='NoActiveReasons')return result;
 const names=options.slice().sort(),probability=`1/${names.length}`;
 if(names.length===1)return {...result,chosen:names[0],mode:'Auto',probabilities:[{name:names[0],probability}]};
 const address={causalRootId:typedIdentifier(1135,u(300+at)),purposeId:sid(1042,'purpose/longitudinal-habit/tie'),subjectBindings:[{subjectRoleId:sid(1043,'subject/actor'),subjectId:ACTOR}],drawIndex:0n};
 const d=await new RandomRunOracle(new Uint8Array(32).fill(seed)).drawBounded(address,BigInt(names.length));
 return {...result,chosen:names[Number(d.result)],mode:'QuietRoll',probabilities:names.map(name=>({name,probability})),draws:[{address:key(randomAddressValue(address)),result:Number(d.result),span:Number(d.span)}]};
}

/** Pure receiving owner. Standing is an admitted operand, never physical source truth. */
export function createHabitReceiver(input:HabitProfile){
 const profile=admit(input);
 let prefix=0,busy=false,history:CanonicalValue=empty(),cache=habitSummary(settings,history),belief:boolean|undefined,goals:readonly MaintenanceGoal[]=[];
 let memory:TimedAcquisition[]=[],protocol:readonly GovernanceEntry[]=[];
 const rows:{episodesBefore:number;episodesAfter:number;practiceBefore:number;practiceAfter:number;losses:{acquisition:string;unit:string}[];at:number;cue:boolean;opportunity:boolean;standing:string;historyBefore:string;historyAfter:string;strength:string;beliefBefore:boolean|null;beliefAfter:boolean|null;available:boolean;performed:boolean;observed:boolean;goalsBefore:ReturnType<typeof goalView>;goalsAfter:ReturnType<typeof goalView>;choice:Awaited<ReturnType<typeof choose>>}[]=[];
 const read=()=>{if(busy)throw Error('LH_BUSY');};
 const snapshot=()=>{read();return structuredClone({version:HABIT_VERSION,profile,actor:key(ACTOR),prefix,memory:memory.map(a=>({id:String(a.id),acquiredAt:String(a.acquiredAt),kind:a.kind,units:a.units.map(u=>({key:u.key,views:u.views.map(b=>Array.from(b))}))})),protocol:protocol.map(e=>({...e,acquisition:String(e.acquisition),formedAt:String(e.formedAt)})),history:key(history),cache:key(cache),belief:belief??null,goals:goalView(goals),rows});};
 const save=()=>enc(text(JSON.stringify(snapshot())));
 const adopt=(prior:readonly MaintenanceGoal[],id:string,at:bigint,desired:bigint)=>adoptMaintenanceGoal(prior,{character:'longitudinal-target',goal:id,signal:'practice-outcome',desired:{lower:Q.of(desired),upper:Q.of(desired)},adoptedAt:at,activeFrom:at+1n,expiresAt:22n},domains);
 const recallPractice=()=>{read();return memory.flatMap(a=>a.units.filter(u=>u.key==='practice').flatMap(u=>u.views.map(b=>b.slice())));};
 return Object.freeze({snapshot,save,recallPractice,
  async step(standing:Q,fault?:'after-choice'|'before-commit'){
   if(busy)throw Error('LH_CONCURRENT');if(prefix===habitTimes.length)return false;
   if(!(standing instanceof Q)||standing.compare(Q.of(-1n))<0||standing.compare(Q.of(1n))>0)throw Error('LH_STANDING');
   busy=true;
   try{
    const at=habitTimes[prefix],cue=profile.alternateCue&&at>=14,opportunity=at>=2&&at!==8&&!(profile.relearning==='Unavailable'&&(at===18||at===19));
    const summary=profile.law==='Stored'?cache:habitSummary(settings,history),strength=readQ(f(rec(summary,824n),cue?2n:1n));
    const available=profile.law==='ScheduledOnly'||belief===true||(profile.law!=='ExplicitBeliefOnly'&&strength.compare(Q.of(1n,2n))>=0);
    const active=goals.flatMap(g=>{const x=readMaintenanceConcern(goals,'longitudinal-target',g.goal,BigInt(at),domains);return x.kind==='Active'?[x.concern]:[];});
    const modifier=Number(standing.numerator*1000n/standing.denominator);
    const grounds:Parameters<typeof goalReceivingChoice>[1]=[
     ...(available&&belief===true?[{option:'practice',domain:'expected-reward',strength:1000,standing:modifier}]:[]),
     ...active.filter(g=>available||g.desired.lower.equals(Q.of(0n))).map(g=>({option:g.desired.lower.equals(Q.of(1n))?'practice':'idle',domain:'goal-'+g.goal,strength:750,standing:g.desired.lower.equals(Q.of(1n))?modifier:-modifier}))];
    const choice=await choose(opportunity?(available?['practice','idle']:['idle']):[],opportunity?grounds:[],at,profile.seed);
    if(fault==='after-choice')throw Error('LH_INJECTED');
    // Execution is conditional on chosen action and a real opportunity; the source never supplies the choice.
    const performed=opportunity&&choice.chosen==='practice',observed=performed&&profile.visible&&!(profile.relearning==='Hidden'&&(at===18||at===19)),reward=at<8||at===18||at===19;
    const observation=hr(836,[typedIdentifier(1155,u(300+at)),signed(at),cue,observed,...(observed?[reward]:[])]);
    let nextHistory=appendHabit(history,observation).next,nextBelief=observed?reward:belief,nextGoals=goals;
    if(at===1){nextBelief=true;nextGoals=adopt(nextGoals,'practice',1n,1n);}
    // A controlled negative report changes expectation, not past practice or physical execution.
    if(at===8){nextBelief=false;if(profile.law==='EraseHistory')nextHistory=empty();
     nextGoals=settleMaintenanceGoal(nextGoals,'longitudinal-target','practice',8n,'Withdraw',domains);
     nextGoals=adopt(nextGoals,'rest',8n,0n);
    }
    if(at===15)nextGoals=settleMaintenanceGoal(nextGoals,'longitudinal-target','rest',15n,'Withdraw',domains);
    if(at===16)nextGoals=adopt(nextGoals,'renew',16n,1n);
    if(at===17)nextBelief=true;
    if(at===19){nextBelief=false;nextGoals=settleMaintenanceGoal(nextGoals,'longitudinal-target','renew',19n,'Withdraw',domains);}
    // Only actually admitted outcomes form practice episodes. Intervening displays are a controlled source.
    const fresh:TimedAcquisition[]=observed?[{id:BigInt(300+at),acquiredAt:BigInt(at),kind:'EventContinuant',units:[{key:'practice',views:[enc(observation)]}]}]:[];
    if(at===8)for(let i=0;i<6;i++)fresh.push({id:BigInt(800+i),acquiredAt:8n,kind:'EventContinuant',units:[{key:'context',views:[enc(text('admitted-context-display-'+i))]}]});
    const retained=retainByRecency([...memory,...fresh],BigInt(at),{EventContinuant:profile.keepEpisodes?32:6,Interoceptive:0});
    const formed:FormationCommit[]=fresh.map(a=>({source:'admitted-'+a.id,character:'longitudinal-target',kind:a.kind,acquisition:a.id,formedAt:a.acquiredAt}));
    const domain=[...protocol,...formed].map(e=>({source:e.source,character:e.character,kind:e.kind}));
    const nextProtocol=reconcileFormationGovernance(domain,protocol,formed,retained.acquisitions.map(a=>a.id),BigInt(at));
    const practice=(xs:readonly TimedAcquisition[])=>xs.flatMap(a=>a.units).filter(u=>u.key==='practice').length;
    const nextCache=habitSummary(settings,nextHistory);
    const row={episodesBefore:memory.length,episodesAfter:retained.acquisitions.length,practiceBefore:practice(memory),practiceAfter:practice(retained.acquisitions),losses:retained.losses.map(l=>({acquisition:String(l.acquisition),unit:l.unit})),at,cue,opportunity,standing:frac(standing),historyBefore:key(history),historyAfter:key(nextHistory),strength:frac(strength),beliefBefore:belief??null,beliefAfter:nextBelief??null,available,performed,observed,goalsBefore:goalView(goals),goalsAfter:goalView(nextGoals),choice};
    if(fault==='before-commit')throw Error('LH_INJECTED');
    memory=retained.acquisitions;protocol=nextProtocol;history=nextHistory;cache=nextCache;belief=nextBelief;goals=nextGoals;rows.push(row);prefix++;return true;
   }finally{busy=false;}
  }
 });
}

export async function restoreHabitReceiver(profile:HabitProfile,standing:readonly Q[],prefix:number,saved:Uint8Array){
 if(!Array.isArray(standing)||standing.length!==habitTimes.length||!Number.isInteger(prefix)||prefix<0||prefix>habitTimes.length||!(saved instanceof Uint8Array))throw Error('LH_RESTORE');
 const copy=saved.slice(),run=createHabitReceiver(profile);for(let i=0;i<prefix;i++)await run.step(standing[i]);
 const actual=run.save();if(actual.length!==copy.length||actual.some((v,i)=>v!==copy[i]))throw Error('LH_SAVE_MISMATCH');return run;
}
