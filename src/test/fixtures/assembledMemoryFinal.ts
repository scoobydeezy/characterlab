/** Current memory replay adapter: unchanged psychological laws and source scenarios. */
import {fixture,items,decode,enc,list,text,signed,key} from './assembledFamiliarity';
import {ATTRIBUTION_USE_RULES,ATTRIBUTION_USE_REGISTRY} from '../../assembled/model';
import {REHEARSAL} from '../../assembled/rehearsal';
import {BODY_DELIVERY} from '../../assembled/body';
import {createCharacterRun,prepareCharacterModel} from '../../assembled/character';
export type MemoryFixture=Pick<ReturnType<typeof fixture>,'s'|'d'>;
export type MemoryRun=Awaited<ReturnType<typeof createCharacterRun>>;
export function currentMemory(b:MemoryFixture):MemoryFixture{
 const slots=[...items(decode(b.s.registry),'list')],ret=items(slots[8],'list'),access=items(slots[9],'list');
 if(slots.length!==52||ret.length!==4||access.length!==2)throw Error('M174 expected frozen52-slot source');
 slots[8]=list([...ret,list([]),ret[2]]);slots[9]=list([...access,text('PresentationFrequency')]);
 slots.push(list([text(REHEARSAL),signed(0),list([]),list([])]),list([]));
 const rows=items(decode(b.d.orderedInputs),'list').map(v=>{const a=items(v,'list');if(key(a[2])!==key(BODY_DELIVERY))return v;const p=items(a[3],'list');return list([...a.slice(0,3),p.length===2?list([...p,false]):a[3],...a.slice(4)]);});
 return {s:{...b.s,rulesVersion:ATTRIBUTION_USE_RULES,registrySchemaVersion:ATTRIBUTION_USE_REGISTRY,registry:enc(list(slots))},d:{...b.d,orderedInputs:enc(list(rows))}};
}
export function cachedMemory(run:MemoryRun):MemoryRun{
 let snapshot:ReturnType<MemoryRun['snapshot']>|undefined;
 return Object.freeze({...run,snapshot(){return snapshot??(snapshot=run.snapshot());},async settleNextInstant(){snapshot=undefined;return run.settleNextInstant();}});
}
export async function startMemory(b:MemoryFixture){const m=await prepareCharacterModel(b.s);return {b,m,run:cachedMemory(await createCharacterRun(m,b.d))};}
