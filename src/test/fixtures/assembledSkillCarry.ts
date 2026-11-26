/** M287 receiving adapter; original scenarios/controls stay immutable. */
import {fixture as current,rec,f,uint,items,key,decode,enc,list,text,signed,q,C,u,sid,actionA,cachedMemory,type CanonicalValue} from './assembledSkillMemory';
import {fixture as skillPrior,type Profile} from './assembledSkillIntegration';
import {fixture as longPrior} from './assembledLongitudinalCompletion';
import {DISUSE_RULES,DISUSE_REGISTRY} from '../../assembled/model';
import {changeDefinition} from './assembledCharacter';
import {AuthoritativeState,restoreAuthoritativeState,statePathValue} from '../../substrate/state';
import {set} from '../../substrate/canonicalEncoding';
import {SOCIAL_SOURCE} from '../../assembled/social';
import {CONTINUANT_FEATURES} from '../../assembled/semanticAppearance';
import {BODY_DELIVERY} from '../../assembled/body';
import {createCharacterRun,prepareCharacterModel} from '../../assembled/character';
const template=current('lost');
type Source=Pick<typeof template,'s'|'d'>;
export function promote<T extends Source>(b:T){
 const old=items(decode(b.s.registry),'list'),defaults=items(decode(template.s.registry),'list'),slots=defaults.map((v,i)=>i<old.length?old[i]:v);
 const merge=(a:readonly CanonicalValue[],b:readonly CanonicalValue[],id:(v:CanonicalValue)=>CanonicalValue)=>[...a,...b.filter(v=>!a.some(x=>key(id(x))===key(id(v))))];
 const defs=items(slots[0],'set');slots[0]=set([...defs,...items(defaults[0],'set').filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===171n&&!defs.some(x=>typeof x!=='boolean'&&x.kind==='record'&&x.schema.typeId===171n&&key(f(x,1n))===key(f(v,1n))))]);
 for(const i of[10,11]){const a=items(slots[i],'list'),d=items(defaults[i],'list'),at=i===10?2:1,kind=i===10?'set':'list';const rows=merge(items(a[at],kind),items(d[at],kind),v=>items(v,'list')[0]);slots[i]=list(a.map((v,n)=>n===at?(kind==='set'?set(rows):list(rows)):v));}
 const body=items(slots[6],'list');if(body.length===7)slots[6]=list([text('assembled-body/0.2'),...body.slice(1),signed(0)]);
 const recognition=items(slots[21],'list');if(recognition.length===3){const current=items(defaults[21],'list');slots[21]=list([current[0],recognition[1],recognition[2],current[3]]);}
 const encoding=items(slots[30],'list'),currentEncoding=items(defaults[30],'list');if(encoding.length===3)slots[30]=list([currentEncoding[0],encoding[1],encoding[2],...currentEncoding.slice(3)]);
 if(key(items(slots[29],'list')[0])!==key(items(defaults[29],'list')[0]))slots[29]=defaults[29];
 const retention=items(slots[8],'list'),access=items(slots[9],'list');
 if(retention.length===4)slots[8]=list([...retention,list([]),retention[2]]);
 if(access.length===2)slots[9]=list([...access,text('PresentationFrequency')]);
 if(old.length>50){const a=items(slots[50],'list'),d=items(defaults[50],'list');slots[50]=list(a.map((v,i)=>i===3?list(items(v,'list').map(v=>{const row=items(v,'list');if(row.length>=4)return v;const known=items(d[3],'list').map(v=>items(v,'list')).find(x=>key(x[0])===key(row[0]));return list([...row,known?.[3]??list([])]);})):v));}
 const prior=restoreAuthoritativeState(decode(b.d.initialState)).entries(),extra=restoreAuthoritativeState(decode(template.d.initialState)).entries().filter(e=>!prior.some(p=>key(statePathValue(p.path))===key(statePathValue(e.path))));
 const s=changeDefinition({...b.s,rulesVersion:DISUSE_RULES,registrySchemaVersion:DISUSE_REGISTRY,registry:enc(list(slots))},'definition/task-reason-dice',2n,q(0,1));
 const sourceEdits:{at:string;fields:string[]}[]=[];
 const rows=items(decode(b.d.orderedInputs),'list').map(v=>{const a=[...items(v,'list')],edits:string[]=[];if(key(a[2])===key(SOCIAL_SOURCE)){const p=[...items(a[3],'list')];if(typeof p[3]==='boolean'){p[3]=list([p[3],false,false,false]);edits.push('explicit lifecycle');}
 const form=items(p[4],'list');if(form.length<2){p[4]=list([list(form.map(value=>list([text(CONTINUANT_FEATURES.find(x=>x.endsWith('person-form'))!),value,true]))),list([])]);edits.push('person-form feature/two lanes');}
 p[5]=list(items(p[5],'list').map(v=>{const x=items(v,'list');if(x.length===2){edits.push('typed permitted appearance cue');return list([u(1),...x,true]);}if(x.length===3){edits.push('explicit cue permission');return list([...x,true]);}return v;}));const role=items(p[7],'list');if(role.length===2){p[7]=list([...role,list([])]);edits.push('empty additional role lane');}a[3]=list(p);}
 if(key(a[2])===key(BODY_DELIVERY)){const p=items(a[3],'list');if(p.length===2){a[3]=list([...p,false]);edits.push('unobserved delivery');}}
 if(edits.length)sourceEdits.push({at:String((a[0] as {value:bigint}).value),fields:edits});return list(a);});
 return {...b,s,d:{...b.d,orderedInputs:enc(list(rows)),initialState:enc(new AuthoritativeState([...prior,...extra]).canonicalValue())},receiving:{sourceEdits,oldSlots:old.length,currentSlots:slots.length,addedInitial:extra.map(e=>key(statePathValue(e.path)))}};
}
export function skillFixture(profile:Profile){return promote(skillPrior(profile));}
export function longFixture(){return promote(longPrior('main'));}
export function memoryFixture(mode:'original'|'lost'|'retained'|'untrained'){
 const b=current(mode==='original'?'lost':mode),rows=items(decode(b.d.orderedInputs),'list');
 const extra=mode==='original'?[]:rows.filter(v=>key(items(v,'list')[0])===key(signed(7))).map(v=>list([signed(6),...items(v,'list').slice(1)]));
 return {...b,s:{...b.s,rulesVersion:DISUSE_RULES,registrySchemaVersion:DISUSE_REGISTRY},d:{...b.d,orderedInputs:enc(list([...rows,...extra]))},mode};
}
const models=new Map<string,ReturnType<typeof prepareCharacterModel>>();
export async function start<T extends Source>(b:T){const k=key(decode(b.s.registry));let p=models.get(k);if(!p){p=prepareCharacterModel(b.s);models.set(k,p);}const m=await p;return {b,m,r:cachedMemory(await createCharacterRun(m,b.d))};}
export {rec,f,uint,items,key,decode,enc,list,text,signed,q,C,u,sid,actionA,cachedMemory};
export type {CanonicalValue,Profile};
