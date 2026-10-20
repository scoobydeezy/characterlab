/** Concrete first-cohort S0. These finite fixture anchors are candidate model data;
 * they are not physiological laws or learned state seeded from expected results. */
import {canonicalEncode as enc,list,map,signed,unsigned as u,rational as q,type CanonicalValue} from '../substrate/canonicalEncoding';
import {AuthoritativeState,type StatePath} from '../substrate/state';
import {semanticReferentFromAuthoredContent} from '../substrate/referentOrigin';
import {dataKey as key,invalidModel as fail} from '../campaign2/canonicalData';
import {generalRecord as r,generalSubject,generalContentId as c,generalId as id} from './generalBindingProfile';
import type {compileGeneralInheritedSource} from './generalInheritedSource';
import type {compileGeneralState} from './generalState';
export function compileGeneralInitialState(inherited:ReturnType<typeof compileGeneralInheritedSource>,stateModel:ReturnType<typeof compileGeneralState>,credit=false){
 const who=generalSubject(),path=(root:bigint,k:CanonicalValue):StatePath=>({rootStateTypeId:root,fieldId:1n,selectors:[{kind:'mapKey',key:k}]});
 const initial=new AuthoritativeState([
  {path:path(268n,who.observer),value:r(267,[who.character])},
  {path:path(373n,r(371,[who.character,semanticReferentFromAuthoredContent(c('task'))])),value:r(372,[u(1)])},
  {path:path(630n,who.character),value:r(555,[list([])])},
  {path:path(631n,who.character),value:r(625,[list([]),list([]),signed(0)])},
  {path:path(632n,who.character),value:r(595,[list([])])},
  {path:path(633n,who.character),value:r(560,[list([])])},
  {path:path(634n,who.observer),value:r(627,new Map<bigint,CanonicalValue>([[1n,signed(0)],[3n,list([])]]))},
  {path:path(635n,who.observer),value:r(629,[signed(0)])},
  {path:{rootStateTypeId:581n,fieldId:1n,selectors:[]},value:r(580,[map([]),map([])])},
  ...['A','B','C'].map((n,i)=>({path:path(649n,r(644,[who.character,id(1044,'local-reserve/'+n)])),value:r(454,[q(credit&&n==='A'?23:40+20*i,1),signed(0)])})),
  ...inherited.initialEntries(),
 ]);
 stateModel.validateState(initial);const bytes=enc(initial.canonicalValue());
 return Object.freeze({bytes:()=>bytes.slice(),build:()=>stateModel.restoreState(bytes),admit(input:Uint8Array){const state=stateModel.restoreState(input);if(key(state.canonicalValue())!==key(initial.canonicalValue()))fail('GA first-cohort initial state mismatch');return state;}});
}
