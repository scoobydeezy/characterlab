import {it,expect,vi} from 'vitest';
import {canonicalEncode as enc,list,set,record,unsigned} from '../substrate/canonicalEncoding';
import {firstTraceModel} from '../campaign2/firstTraceModel';
import {prepareCampaign2Model,createCampaign2Run,restoreCampaign2Run} from '../campaign2/factory';
import {decodeCampaign2} from '../campaign2/codecs';
import {dataItems as items,dataRecord as rec,dataField as f} from '../campaign2/canonicalData';
import * as runtime from '../campaign2/adaptationRuntime';

it('FCT-1/B: every committed schema descriptor rejects omission and version drift at prepare and restore',async()=>{
 const source=firstTraceModel(),orderedInputs=enc(list([])),model=await prepareCampaign2Model(source);
 const run=await createCampaign2Run(model,{initialState:enc(set([])),orderedInputs,runSeed:new Uint8Array(32)}),save=run.save();
 const slots=items(decodeCampaign2(source.registry),'list'),carrier=items(slots[0],'set');
 const descriptors=carrier.filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===172n);
 expect(descriptors.length).toBeGreaterThan(100);
 const spy=vi.spyOn(runtime,'createAdaptationRuntime');
 try{
  for(const descriptor of descriptors){
   const d=rec(descriptor,172n),version=f(d,2n);if(typeof version==='boolean'||version.kind!=='unsigned')throw Error('descriptor version');
   for(const mutation of ['omitted','version'] as const){
    const changed=carrier.flatMap(v=>v===descriptor?(mutation==='omitted'?[]:[record(d.schema,new Map([...d.fields,[2n,unsigned(version.value+1n)]]))]):[v]);
    const candidate={...source,registry:enc(list([set(changed),...slots.slice(1)]))};
    const label=`descriptor ${JSON.stringify(f(d,1n),(_,v)=>typeof v==='bigint'?String(v):v)} ${mutation}`;
    await expect(prepareCampaign2Model(candidate),label).rejects.toThrow('schema descriptors differ from complete trusted inventory');
    await expect(restoreCampaign2Run(candidate,{orderedInputs,save}),label).rejects.toThrow('schema descriptors differ from complete trusted inventory');
   }
  }
  expect(spy).not.toHaveBeenCalled();expect(run.save()).toEqual(save);
 }finally{spy.mockRestore();}
},60000);
