/// <reference types="vite/client" />
import freeze from '../../docs/planning/campaign3-attention-model-rev2/FREEZE.json';
import type {Campaign2ModelSource} from '../campaign2/factory';
const data=import.meta.glob('../../docs/planning/campaign3-attention-model-rev2/**/*.cenc.hex',{query:'?raw',import:'default',eager:true}) as Record<string,string>;
const fromHex=(s:string)=>Uint8Array.from(s.trim().match(/../g)??[],b=>parseInt(b,16));
export const attentionFixtureRead=(p:string)=>fromHex(data['../../docs/planning/campaign3-attention-model-rev2/'+p]);
export const attentionFixtureSource=(name:string):Campaign2ModelSource=>({...freeze.versions,content:attentionFixtureRead(name+'/content.cenc.hex'),registry:attentionFixtureRead(name+'/registry.cenc.hex'),parameters:attentionFixtureRead(name+'/parameters.cenc.hex')});
export const attentionFixtureInitial=()=>attentionFixtureRead('initial-state.cenc.hex');
export const attentionFixtureSeed=()=>fromHex(freeze.seed);
export {freeze as attentionFixtureFreeze};
