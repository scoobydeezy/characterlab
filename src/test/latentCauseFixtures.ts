import type {Frame} from '../campaign3/latentCause';
export function latentCauseCases(){const names=['correction','limitation','obstruction','hidden','denied','deniedChanged','absent','unknownOutcome','duplicate','foreign','conflict','goalChange','late','success'] as const;
 const frames=():Frame[]=>Array.from({length:6},(_,i)=>({at:i+1,capable:false,blocked:false,outcome:i===0?false:null,motion:i===1?false:i===3?true:null,drag:i===2?false:i===4?true:null,visible:true,episode:1,receipt:i+1,goal:'ProtectRoute'}));
 const cases=Object.fromEntries(names.map(n=>[n,frames()])) as Record<typeof names[number],Frame[]>;
 for(const n of ['limitation','obstruction','hidden','denied','deniedChanged','absent','conflict','late'] as const){cases[n][3].motion=null;cases[n][4].drag=null;}
 cases.obstruction.forEach(x=>{x.capable=true;x.blocked=true;});cases.obstruction[1].motion=true;cases.obstruction[2].drag=true;
 cases.hidden.forEach(x=>{x.capable=true;x.blocked=true;});
 for(const n of ['denied','deniedChanged'] as const)cases[n].forEach((x,i)=>{if(i>0)x.visible=false;});cases.deniedChanged[1].motion=true;cases.deniedChanged[2].drag=true;
 cases.absent.forEach((x,i)=>{if(i>0){x.motion=null;x.drag=null;}});cases.unknownOutcome[0].outcome=null;
 cases.duplicate[3].receipt=2;cases.duplicate[4].receipt=3;cases.foreign[3].episode=2;cases.foreign[4].episode=2;
 cases.conflict[2].drag=true;cases.goalChange.forEach(x=>x.goal='RepairCapability');cases.late[5].motion=true;cases.late[5].drag=true;
 cases.success[0].capable=true;cases.success[0].outcome=true;return cases;
}
