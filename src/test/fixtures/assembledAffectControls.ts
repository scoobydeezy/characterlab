/** M79 fixed source controls. Three physical tasks/no person dependencies;
 * live position/body/catalogue channels, body30/cap100/rate10, delivery90 at9,
 * severity1/3, importanceA/B1, seed0. No learned initial state. */
import {list,unsigned as u,signed} from '../../substrate/canonicalEncoding';
import {fixture as prior,taskA,taskB,decode,items,key,enc} from './assembledAffectResponse';
import {POSITION_SOURCE} from '../../assembled/positionPerception';
import {REAPPRAISAL_SOURCE} from '../../assembled/reappraisal';
import {changeDefinition} from './assembledCharacter';
import {PHYSICAL_PERMISSION_RULES,PHYSICAL_PERMISSION_REGISTRY} from '../../assembled/model';
export type Mode='ineffective'|'historyRisk'|'contradiction'|'hidden'|'missingAction'|'deniedMotion'|'censored'|'noop'|'zeroBaseline'|'unknownCatalogue'|'emptyCatalogue'|'failed';
export function fixture(mode:Mode='ineffective',legacy=false){
 const b=prior('strong'),history=['historyRisk','contradiction','hidden'].includes(mode);
 const rows=items(decode(b.d.orderedInputs),'list').map(v=>{
  const x=[...items(v,'list')],at=x[0];
  if(typeof at==='boolean'||at.kind!=='signed')throw Error('M79 input time');
  if(key(x[2])===key(POSITION_SOURCE)){
   const p=[...items(x[3],'list')],panel=[...items(p[2],'list')],annex=[...items(p[3],'list')];
   if(history&&at.value<=3n)panel[0]=u(0);
   if((mode==='contradiction'||mode==='hidden')&&at.value===9n)annex[7]=false;
   if(mode==='zeroBaseline'&&at.value===3n)annex[7]=false;
   if(at.value>=4n&&at.value<=6n&&mode==='missingAction')annex[3]=false;
   if(mode==='deniedMotion'&&at.value===5n)panel[3]=false;
   if(at.value===6n&&mode==='censored')annex[6]=false;
   if(at.value===6n&&mode==='noop')annex[5]=false;
   if(mode==='hidden'){annex[0]=u(0);annex[1]=annex[1]!==true;}
   p[2]=list(panel);p[3]=list(annex);x[3]=list(p);
  }
  if(key(x[2])===key(REAPPRAISAL_SOURCE)&&(history||mode==='emptyCatalogue'||mode==='unknownCatalogue')){
   const p=[...items(x[3],'list')];p[9]=list([u(mode==='unknownCatalogue'?0:1),mode!=='unknownCatalogue']);x[3]=list(p);
  }
  return list(x);
 });
 const source=legacy?b.s:{...b.s,rulesVersion:PHYSICAL_PERMISSION_RULES,registrySchemaVersion:PHYSICAL_PERMISSION_REGISTRY};
 const s=mode==='failed'?changeDefinition(source,'definition/protocol-execution',1n,false):source;
 return {s,d:{...b.d,orderedInputs:enc(list(rows))}};
}
export {taskA,taskB,decode,items,key,enc};
