/** M191 plan85a59af1: current schema transfer of unchanged M105 sources.
 * Three nonsocial physical tasks; significance adds two perceived passive people.
 * Body30/cap100/rate10, delivery90@9, importance3/5,severity1/2, seed0.
 * No learned psychological state is supplied. Original catalog knowledge is retained. */
import {expect} from 'vitest';
import * as prior from './assembledDecisionReference';
import {fixture as donor} from './assembledAffectMemoryCurrent';
import {prepareCharacterModel,createCharacterRun} from '../../assembled/character';
import {CALIBRATED_SENSING_RULES,CALIBRATED_SENSING_REGISTRY} from '../../assembled/model';
import {AuthoritativeState,restoreAuthoritativeState} from '../../substrate/state';
import {STRESS,stressPath,stressValue} from '../../assembled/regulatoryStress';
import {RECOGNITION_SYMBOL_DOMAIN} from '../../assembled/recognition';
import {LEARNED_AFFECT_MEMORY} from '../../assembled/affectMemory';
import {SEMANTIC_EVENTS_ENCODING} from '../../assembled/encoding';
import {SOCIAL_SOURCE} from '../../assembled/social';
import {BODY_DELIVERY} from '../../assembled/body';
import {PerceptualFeatureId as CF} from '../../semanticBinding/perceptualClassification';
import {changeDefinition} from './assembledCharacter';
import {C} from './campaign2Cognitive';
import {decode,items,enc,list,text,signed,u,key,through,type CanonicalValue} from './assembledDecisionReference';
export * from './assembledDecisionReference';
let current:ReturnType<typeof donor>|undefined;
export function promote(b:ReturnType<typeof prior.fixture>|ReturnType<typeof prior.significant>){
 const slots=[...items(decode(b.s.registry),'list')],known=items(decode((current??(current=donor())).s.registry),'list');
 expect(slots).toHaveLength(46);expect(known).toHaveLength(55);
 const body=items(slots[6],'list'),ret=items(slots[8],'list'),access=items(slots[9],'list'),catalog=items(slots[21],'list'),affect=items(slots[29],'list'),encoding=items(slots[30],'list');
 expect(body).toHaveLength(7);expect(ret).toHaveLength(4);expect(access).toHaveLength(2);expect(catalog).toHaveLength(3);expect(encoding).toHaveLength(3);
 slots[6]=list([text('assembled-body/0.2'),...body.slice(1),signed(0)]);
 slots[8]=list([...ret,list([]),ret[2]]);slots[9]=list([...access,text('PresentationFrequency')]);
 slots[21]=list([text(RECOGNITION_SYMBOL_DOMAIN),...catalog.slice(1),list([text('name/visitor')])]);
 slots[29]=list([text(LEARNED_AFFECT_MEMORY),affect[1],items(known[29],'list')[2]]);
 slots[30]=list([text(SEMANTIC_EVENTS_ENCODING),...encoding.slice(1),text('historical-shared'),text('UnitBudget')]);
 // Empty/new declarations use already accepted current contracts. Preserve task/recipient identities.
 slots.push(...known.slice(46));
 slots[47]=list([items(known[47],'list')[0],false,list([])]);
 const socialWitness=items(slots[50],'list'),task=items(items(slots[12],'list')[1],'list')[0];
 slots[50]=list([socialWitness[0],items(task,'list')[0],...socialWitness.slice(2)]);
 slots[52]=list([items(known[52],'list')[0],signed(0),list([]),list([])]);
 slots[53]=list([]);slots[54]=list([text(STRESS),true,u(0),u(500)]);
 const initial=restoreAuthoritativeState(decode(b.d.initialState));
 expect(initial.read(stressPath(C)).value).toBeUndefined();
 const rows=items(decode(b.d.orderedInputs),'list').map(v=>{
  if(typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===116n)return v; // authenticated comparison map, never a world event
  const row=[...items(v,'list')];
  if(key(row[2])===key(BODY_DELIVERY)){const p=items(row[3],'list');expect(p).toHaveLength(2);row[3]=list([...p,false]);}
  if(key(row[2])===key(SOCIAL_SOURCE)){
   const p=[...items(row[3],'list')],form=items(p[4],'list'),role=items(p[7],'list');
   expect(typeof p[3]).toBe('boolean');expect(form.length).toBeLessThanOrEqual(1);expect(role).toHaveLength(2);
   p[3]=list([p[3],false,false,false]);
   p[4]=list([list(form.map(v=>list([text(CF.ObservedPersonForm),v,true]))),list([])]);
   p[5]=list(items(p[5],'list').map(v=>{const a=items(v,'list');expect(a).toHaveLength(2);return list([u(1),...a,true]);}));
   p[7]=list([...role,list([])]);row[3]=list(p);
  }
  return list(row);
 });
 const s=changeDefinition({...b.s,rulesVersion:CALIBRATED_SENSING_RULES,registrySchemaVersion:CALIBRATED_SENSING_REGISTRY,registry:enc(list(slots))},'definition/task-reason-source',1n,true);
 return {...b,s,d:{...b.d,orderedInputs:enc(list(rows)),initialState:enc(new AuthoritativeState([...initial.entries(),{path:stressPath(C),value:stressValue(0n,0)}]).canonicalValue())}};
}
export const fixture=(...args:Parameters<typeof prior.fixture>)=>promote(prior.fixture(...args));
export const significant=(...args:Parameters<typeof prior.significant>)=>promote(prior.significant(...args));
export async function create(b=fixture(),at=10n){const run=await createCharacterRun(await prepareCharacterModel(b.s),b.d);await through(run,at);return {b,run};}
