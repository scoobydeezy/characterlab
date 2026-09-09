/** Bounded exclusion assay; the schema inventory is not an RNG-consuming seam. */
import {canonicalEncode as enc,list,set} from '../../substrate/canonicalEncoding';
import {firstTraceModel} from '../../campaign2/firstTraceModel';
import {prepareCampaign2Model,createCampaign2Run,restoreCampaign2Run,campaign2ModelIdentity} from '../../campaign2/factory';
import {decodeCampaign2} from '../../campaign2/codecs';
import {dataRecord as rec,dataField as f} from '../../campaign2/canonicalData';
const hex=(b:Uint8Array)=>Array.from(b,x=>x.toString(16).padStart(2,'0')).join('');
export async function buildMetadata(){
 const source=firstTraceModel(),model=await prepareCampaign2Model(source),orderedInputs=enc(list([]));
 const run=await createCampaign2Run(model,{initialState:enc(set([])),orderedInputs,runSeed:new Uint8Array(32)});
 const save=run.save(),field9=hex(enc(f(rec(decodeCampaign2(save),132n),9n)));
 let restored:string|undefined,error:string|undefined;
 try{restored=hex((await restoreCampaign2Run(source,{orderedInputs,save})).save());}catch(e){error=(e as Error).message;}
 return {model:hex(campaign2ModelIdentity(model)),save:hex(save),field9,empty:hex(enc(list([]))),restored,error};
}
