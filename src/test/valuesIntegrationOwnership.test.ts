import {it,expect} from 'vitest';
import {compileIntegrationModel,compileIntegrationInputs,integrationRecipe,integrationInitial,integrationOrdered,path,owner,unpack,writeRoots} from '../campaign3/valuesIntegrationPublicModel';
import {createIntegrationPublicRuntime} from '../campaign3/valuesIntegrationPublicRuntime';
import {createValuesIntegration,type IntegrationFrame} from '../campaign3/valuesIntegration';
import {applyStatePatch} from '../substrate/state';
import {VALUE_LAWS} from '../campaign3/valuesComponent';
import {canonicalEncode as enc} from '../substrate/canonicalEncoding';
import {dataRecord as rec,dataField as f,dataKey as key} from '../campaign2/canonicalData';
import {valuesNativeChoice} from '../campaign3/valuesPublicMath';
it('native physical state equals the component independently of false character evidence; RNG addresses match inherited choices',async()=>{
 for(const law of VALUE_LAWS)for(const permitted of [true,false]){
  const xs:IntegrationFrame[]=[1,2,3,4].map(instant=>({instant,opportunity:instant!==1,linked:true,need:0,direction:1,mode:'ValuesOnly',command:instant===1?'Adopt':'None',world:{permitted,outcome:-1},observation:{visible:true,category:true,display:'Positive',goalVisible:true,goalDisplay:'Present',forecast:1}}));
  const model=await compileIntegrationModel(integrationRecipe(law)),input=await compileIntegrationInputs(model,integrationInitial(),integrationOrdered(xs),new Uint8Array(32)),native=createIntegrationPublicRuntime(model,input),component=createValuesIntegration({law,appraisal:'ValueRelative',seed:0},xs);
  for(const x of xs){await native.settle();await component.step();expect(unpack(native.snapshot().state.read(path(1522)).value!,1522)).toEqual(component.snapshot().world);}
  const addresses:string[]=[];for(const output of native.snapshot().outputs)if(typeof output!=='boolean'&&output.kind==='record'&&output.schema.typeId===1515n){const expected=await valuesNativeChoice(f(rec(output,1515n),1n));expect(enc(expected.output)).toEqual(enc(output));addresses.push(...expected.addresses);}
  expect(native.snapshot().randomAddresses).toEqual(addresses);
 }
},600000);
it('each state writer rejects every other owner, including Value history and projection',async()=>{
 const model=await compileIntegrationModel(integrationRecipe('Accumulated')),xs:IntegrationFrame[]=[{instant:1,opportunity:false,linked:true,need:0,direction:1,mode:'ValuesOnly',command:'Adopt',world:{permitted:true,outcome:1},observation:{visible:true,category:true,display:'Actual',goalVisible:true,goalDisplay:'Actual',forecast:1}}],input=await compileIntegrationInputs(model,integrationInitial(),integrationOrdered(xs),new Uint8Array(32));
 for(const writer of ['world','goal','consolidate','forecast'])for(const root of writeRoots('Accumulated',writer))for(const other of ['world','goal','consolidate','forecast'])if(other!==writer){
  const p=path(root),prior=input.state.read(p).value!;expect(()=>applyStatePatch(input.state,{operations:[{kind:'set',path:p,expected:{presence:true,value:prior},newValue:prior}]},owner(other),model.authority)).toThrow();
 }
},600000);
