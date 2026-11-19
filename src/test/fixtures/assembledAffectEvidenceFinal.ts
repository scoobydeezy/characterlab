/** M184 e0a9aeae: M79 source interventions on the one current character. */
import {fixture as prior} from './assembledCalibratedSensing';
import {decode,items,key,enc,list,u,signed} from './assembledFamiliarity';
import {POSITION_SOURCE} from '../../assembled/positionPerception';
import {REAPPRAISAL_SOURCE} from '../../assembled/reappraisal';
export type Mode='ineffective'|'historyRisk'|'contradiction'|'hidden'|'missingAction'|'deniedMotion'|'censored'|'noop'|'zeroBaseline'|'unknownCatalogue'|'emptyCatalogue';
export function fixture(mode:Mode='ineffective'){
 const b=prior(0),history=['historyRisk','contradiction','hidden'].includes(mode);
 const rows=items(decode(b.d.orderedInputs),'list').map(v=>{
  const a=[...items(v,'list')],at=a[0];if(typeof at==='boolean'||at.kind!=='signed')throw Error('M184 time');
  if(key(a[2])===key(POSITION_SOURCE)){
   const p=[...items(a[3],'list')],panel=[...items(p[2],'list')],annex=[...items(p[3],'list')];
   if(history&&at.value<=3n)panel[0]=u(0);
   if((mode==='contradiction'||mode==='hidden')&&at.value===9n)annex[7]=false;
   if(mode==='zeroBaseline'&&at.value===3n)annex[7]=false;
   if(mode==='missingAction'&&at.value>=4n&&at.value<=6n)annex[3]=false;
   if(mode==='deniedMotion'&&at.value===5n)panel[3]=false;
   if(mode==='censored'&&at.value===6n)annex[6]=false;
   if(mode==='noop'&&at.value===6n)annex[5]=false;
   if(mode==='hidden'){annex[0]=u(0);annex[1]=annex[1]!==true;}
   p[2]=list(panel);p[3]=list(annex);a[3]=list(p);
  }
  if(key(a[2])===key(REAPPRAISAL_SOURCE)&&(history||mode==='emptyCatalogue'||mode==='unknownCatalogue')){
   const p=[...items(a[3],'list')];p[9]=list([u(mode==='unknownCatalogue'?0:1),mode!=='unknownCatalogue']);a[3]=list(p);
  }
  return list(a);
 });
 return {s:b.s,d:{...b.d,orderedInputs:enc(list(rows))}};
}
