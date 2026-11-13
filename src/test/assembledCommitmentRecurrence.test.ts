import {it,expect} from 'vitest';
import {workspaceOutput} from '../assembled/configurationWorkspace';
import {walk} from './fixtures/campaign2Cognitive';
import {typedIdentifier} from '../substrate/canonicalEncoding';
import {recurrenceFixture,taskA,taskB,taskC,decode,rec,r,f,key,items,list,text,signed,u,enc} from './fixtures/assembledCommitmentRecurrence';
import {prepareCharacterModel,createCharacterRun,restoreCharacterRun} from '../assembled/character';
import {compileCharacterModel,ADOPTION_RULES,ADOPTION_REGISTRY} from '../assembled/model';
import {compileCharacterState} from '../assembled/state';
import {restoreAuthoritativeState} from '../substrate/state';
import {formationValue} from '../assembled/formation';
import {identityJournal} from '../assembled/identityEligibility';
import {formationStatePath,jp} from './fixtures/assembledStandingSources';
import {through,snap,bytes} from './fixtures/assembledAffectReceiving';
import {outputs,signedValue,type Run} from './fixtures/assembledComparison';
import {compileDescribedReasons} from '../assembled/reasons';
import {definition} from './fixtures/assembledReasonReference';
import {ZERO} from '../campaign2/cognitiveMath';
import type {CanonicalValue} from '../substrate/canonicalEncoding';
const state=(run:Run)=>restoreAuthoritativeState(decode(run.snapshot().state));
const path=(task:CanonicalValue)=>({rootStateTypeId:373n,fieldId:1n,selectors:[{kind:'mapKey' as const,key:task}]});
const status=(run:Run,task:CanonicalValue)=>state(run).read(path(task)).value;
const history=(run:Run)=>{const s=state(run);return {formation:formationValue(s.read(formationStatePath).value),journal:identityJournal(s.read(jp).value),history:s.read({...jp,fieldId:1n}).value};};
async function create(at=10n){const b=recurrenceFixture(),run=await createCharacterRun(await prepareCharacterModel(b.s),b.d);await through(run,at);return {b,run};}
function probe(run:Run,b:ReturnType<typeof recurrenceFixture>,at:bigint,active?:CanonicalValue){
 const d=outputs(snap(run).outputs,409n).find(v=>signedValue(f(v,2n))===at)!;expect(d).toBeDefined();const context=rec(f(d,3n),408n),raw=f(context,2n),ns=items(f(context,3n),'list'),compiled=compileDescribedReasons(raw,definition(b.s),4,'SourceCoverage',true);expect(ns).toEqual(compiled.nuclei);expect(ns).toHaveLength(active?1:0);
 if(active){expect(f(rec(f(d,4n),419n),1n)).toEqual(u(3));expect(f(rec(f(rec(ns[0],407n),1n),404n),3n)).toEqual(f(rec(active,371n),2n));expect(signedValue(f(rec(ns[0],407n),5n))).toBeGreaterThan(0n);expect(outputs(snap(run).outputs,433n).some(o=>key(f(rec(f(rec(f(rec(f(o,2n),432n),2n),431n),2n),425n),2n))===key(d))).toBe(true);}
 return {d,raw,ns};
}
function exact(a:Run,b:Run){const x=a.snapshot(),y=b.snapshot();expect([y.clock,y.status]).toEqual([x.clock,x.status]);for(const k of ['state','outputs','trace'] as const)bytes(x[k],y[k]);bytes(a.save(),b.save());bytes(a.runIdentity(),b.runIdentity());}
it('M99 native recurrence preserves earned identity and terminal predecessors with exact new referents',async()=>{
 const {b,run}=await create(),earned=history(run),component=await compileCharacterState(await compileCharacterModel(b.s));expect(earned.formation.entries.length).toBeGreaterThan(0);expect(earned.formation.P.compare(ZERO)).toBeGreaterThan(0);const retiredA=status(run,taskA)!;expect(f(rec(retiredA,372n),1n)).toEqual(u(4));expect(status(run,taskB)).toBeUndefined();expect(status(run,taskC)).toBeUndefined();const counts:number[]=[],standing:bigint[]=[];
 for(const [at,active] of [[12n,undefined],[14n,taskB],[16n,undefined],[18n,taskC],[19n,taskC]] as const){await through(run,at);const p=probe(run,b,at,active);counts.push(p.ns.length);if(at===14n){const d=rec(component.definition('task-workspace'),378n),w=workspaceOutput(typedIdentifier(1128,u(1)),component.tasks[0].character,f(rec(f(p.d,3n),408n),1n),r(378,[f(d,1n),u(5),true,false]),component.tasks,14n,{status:()=>r(372,[u(1)]),prediction:()=>undefined},4);expect(items(f(rec(w.output,381n),4n),'list')).toHaveLength(4);const raw=rec(p.raw,403n),descriptions=items(f(raw,6n),'list'),receiving=r(403,[...Array.from({length:5},(_,i)=>f(raw,BigInt(i+1))),list(component.tasks.flatMap(t=>descriptions.map(v=>walk(v,x=>key(x)===key(taskB)?t.key:x))))],3);expect(compileDescribedReasons(receiving,definition(b.s),4,'SourceCoverage',true).nuclei).toHaveLength(4);expect(()=>compileDescribedReasons(receiving,definition(b.s),3,'SourceCoverage',true)).toThrow();}if(active)standing.push(signedValue(f(rec(p.ns[0],407n),5n)));expect(history(run)).toEqual(earned);expect(status(run,taskA)).toEqual(retiredA);if(at>=14n)expect(f(rec(status(run,taskB)!,372n),1n)).toEqual(u(4));if(at>=18n)expect(status(run,taskC)).toEqual(r(372,[u(1)]));}
 expect(counts).toEqual([0,1,0,1,1]);expect(key(taskB)).not.toEqual(key(taskC));console.info('M99 RECURRENCE PASS counts '+counts+'; actual B then distinct C decision/execution; fixed earned identity; standing '+standing+'; immutable cancelled training A and B.');
},570000);
it('M99 continuation preserves all instances and actual addressed history across every remaining instant',async()=>{
 const {b,run:a}=await create(),{run:repeat}=await create();exact(a,repeat);const restored=await restoreCharacterRun(b.s,{initialState:b.d.initialState,orderedInputs:b.d.orderedInputs,save:a.save()});exact(a,restored);const clocks:bigint[]=[];
 for(let n=0;;n++){expect(n).toBeLessThan(32);const stepped=[];for(const run of [a,repeat,restored])stepped.push(await run.settleNextInstant());expect(stepped[1]).toBe(stepped[0]);expect(stepped[2]).toBe(stepped[0]);exact(a,repeat);exact(a,restored);if(!stepped[0])break;clocks.push(a.snapshot().clock);}expect(a.snapshot().clock).toBe(101n);expect(clocks).toContain(18n);expect(f(rec(status(a,taskA)!,372n),1n)).toEqual(u(4));expect(f(rec(status(a,taskB)!,372n),1n)).toEqual(u(4));console.info('M99 CONTINUATION PASS10 -> '+clocks.join(',')+'; full saves/state/outputs/trace/run identity exact');
},570000);
it('M99 admission keeps old task bounds and governed mappings closed',async()=>{
 const b=recurrenceFixture(),model=await compileCharacterModel(b.s),component=await compileCharacterState(model);expect(component.tasks).toHaveLength(4);await expect(compileCharacterModel({...b.s,rulesVersion:ADOPTION_RULES,registrySchemaVersion:ADOPTION_REGISTRY})).rejects.toThrow('one to 3');await expect(compileCharacterModel({...b.s,registrySchemaVersion:ADOPTION_REGISTRY})).rejects.toThrow('version bundle');
 const slots=[...items(decode(b.s.registry),'list')],s=items(slots[12],'list'),routes=items(s[1],'list');slots[12]=list([s[0],list(routes.slice(0,3))]);await expect(compileCharacterModel({...b.s,registry:enc(list(slots))})).rejects.toThrow('complete task');slots[12]=list([s[0],list([...routes.slice(0,3),routes[0]])]);await expect(compileCharacterModel({...b.s,registry:enc(list(slots))})).rejects.toThrow('complete task');console.info('M99 ADMISSION PASS fourth governed task accepted only0.83; missing/duplicate strategy and version bundle reject');
});
