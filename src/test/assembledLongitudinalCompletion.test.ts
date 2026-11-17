import {it,expect} from 'vitest';
import {prepareCharacterModel,createCharacterRun} from '../assembled/character';
import {restoreAuthoritativeState,statePathValue} from '../substrate/state';
import {ExactRational as Q} from '../substrate/exactMath';
import {skillPath,skillValue,SKILL_ACTUAL,SKILL_UPDATE} from '../assembled/skill';
import {ACTION_BODY} from '../assembled/actionBody';
import {formationPath,formationValue} from '../assembled/formation';
import {identityJournal,qualificationParts} from '../assembled/identityEligibility';
import {relationshipPath,relationshipHistory,relationshipFold} from '../assembled/relationship';
import {fixture,rec,f,uint,items,key,decode,list,text,signed,q,outputs,C,target,time,type Mode,type CanonicalValue} from './fixtures/assembledLongitudinalCompletion';
import {capture,through} from './assembledMultiReceipts.test';
let prepared:ReturnType<typeof prepareCharacterModel>|undefined;
export async function start(mode:Mode='main'){const b=fixture(mode),m=await(prepared??(prepared=prepareCharacterModel(b.s))),r=await createCharacterRun(m,b.d);return {b,m,r};}
export const state=(x:Awaited<ReturnType<typeof start>>)=>restoreAuthoritativeState(decode(x.r.snapshot().state));
export function learned(x:Awaited<ReturnType<typeof start>>){const s=state(x),entries=s.entries();return {bio:entries.filter(e=>e.path.rootStateTypeId===415n||e.path.rootStateTypeId===1503n),skill:s.read(skillPath(C,x.b.procedure)).value,rel:s.read(relationshipPath(C,target)).value,episodes:entries.filter(e=>e.path.rootStateTypeId===346n),formation:formationValue(s.read(formationPath(C)).value),journal:entries.filter(e=>e.path.rootStateTypeId===415n&&e.path.fieldId===2n).flatMap(e=>identityJournal(e.value))};}
export function report(x:Awaited<ReturnType<typeof start>>,at:number,tag=SKILL_ACTUAL){const ts=outputs(x.r.snapshot().trace,160n).filter(t=>key(f(rec(f(t,4n),130n),2n))===key(signed(at)));const rows=ts.flatMap(t=>{const v=f(t,13n);return typeof v!=='boolean'&&v.kind==='list'?[...v.items]:[];}).filter(v=>typeof v!=='boolean'&&v.kind==='list'&&v.items.length>0&&key(v.items[0])===key(text(tag))).map(v=>items(v,'list'));expect(rows.length,'live procedural assessment/update at'+at).toBeGreaterThan(0);return rows[0];}
export function actual(x:Awaited<ReturnType<typeof start>>,at:number,success:boolean){const a=report(x,at);expect(a[6],'actual engaged attempt').toBe(true);expect(a[7]).toBe(success);const ds=outputs(x.r.snapshot().outputs,409n).filter(d=>key(f(d,2n))===key(signed(at)));expect(ds).toHaveLength(1);expect(uint(f(rec(f(ds[0],4n),419n),1n))).toBe(3n);
 const physical=report(x,at,ACTION_BODY);expect(physical[5]).toEqual(text(success?'Applied':'Blocked'));
 const trace=outputs(x.r.snapshot().trace,160n).find(t=>uint(f(rec(f(t,4n),130n),1n))===uint(a[1])&&items(f(t,11n),'list').some(v=>key(f(rec(v,147n),2n))===key(statePathValue(skillPath(C,a[10])))));expect(trace,'actual execution reads own competence').toBeDefined();return a;}
it('primary152: acquired biography, skill and relationship coexist across memory loss, interference and actual relearning',async()=>{
 const x=await start();await through(x.r,4n);const bio=learned(x);console.info('M152 BIO',bio.journal.length,bio.formation.P.numerator+'/'+bio.formation.P.denominator);expect(bio.journal).toHaveLength(1);expect(qualificationParts(bio.journal[0]).accepted).toBe(true);capture(x.r,x.b,4n);
 await through(x.r,9n);const acquired=learned(x);expect(acquired.bio).toEqual(bio.bio);expect(skillValue(acquired.skill,x.b.procedure,true)).toEqual({K:Q.of(1n,2n),count:1n});expect(relationshipFold(acquired.rel)).toEqual({count:2n,rupture:false,comfort:true});expect(relationshipHistory(acquired.rel)).toHaveLength(2);expect(acquired.episodes.length).toBeGreaterThan(0);
 await through(x.r,30n);const loss=learned(x);expect(loss.bio).toEqual(acquired.bio);expect(loss.rel).toEqual(acquired.rel);expect(skillValue(loss.skill,x.b.procedure,true)).toEqual({K:Q.of(1n,4n),count:1n});
 const before=acquired.episodes.map(e=>key(statePathValue(e.path))),after=new Set(loss.episodes.map(e=>key(statePathValue(e.path))));expect(before.some(k=>!after.has(k)),'real authoritative episode loss').toBe(true);actual(x,30,true);expect(report(x,30,SKILL_UPDATE)[3]).toEqual(q(1,4));
 await through(x.r,32n);actual(x,32,false);await through(x.r,34n);actual(x,34,false);expect(skillValue(learned(x).skill,x.b.procedure,true)).toEqual({K:Q.of(3n,8n),count:2n});await through(x.r,36n);actual(x,36,true);
 expect(learned(x).bio).toEqual(acquired.bio);expect(learned(x).rel).toEqual(acquired.rel);
 console.info('M152 PRIMARY PASS BIO qualified; K1/2->1/4->3/8; REL count2; actual32 fails/36 succeeds; non-target histories byte-identical; recent episodes lost');
},590000);

it('declaration152: report duplicate original source declarations before admission',()=>{const b=fixture(),rows=items(decode(b.d.orderedInputs),'list').map(v=>items(v,'list')),seen=new Set<string>();for(const row of rows){const k=key(list([row[0],row[2]]));expect(seen.has(k),'duplicate original declaration').toBe(false);seen.add(k);}console.info('M152 frame4',rows.filter(r=>time(r[0])===4n).map(r=>r[2]));});
