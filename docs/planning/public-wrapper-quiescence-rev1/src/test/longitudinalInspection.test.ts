import {it,expect} from 'vitest';
import {canonicalEncode as enc} from '../substrate/canonicalEncoding';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key} from '../campaign2/canonicalData';
import {longitudinalRecipe,compileLongitudinalModel,compileLongitudinalInputs,STAGES,stageReads,eventId,OBSERVER} from '../campaign3/longitudinalModel';
import {createLongitudinalRuntime} from '../campaign3/longitudinalRuntime';
import {decodeLongitudinal as decode} from '../campaign3/longitudinalCodecs';
import {longitudinalInputs} from './longitudinalFixtures';
it('actual skill is a research diagnostic and execution operand, not character belief or a biography input',async()=>{
 const model=await compileLongitudinalModel(longitudinalRecipe());
 expect(STAGES.filter(([n])=>stageReads(n,model.settings).some(p=>p.rootStateTypeId===871n)).map(([n])=>n)).toEqual(['probe','source','skill']);
 const runs:ReturnType<typeof createLongitudinalRuntime>[]=[];for(const kind of [0,2]){const input=await compileLongitudinalInputs(model,enc(model.initial.canonicalValue()),longitudinalInputs([{at:1,kind,access:false},{at:2}]),new Uint8Array(32)),runtime=createLongitudinalRuntime(model,input);while(await runtime.settle()){}runs.push(runtime);const traces=runtime.snapshot().trace.map(v=>rec(v,160n)).filter(v=>key(f(v,7n))===key(eventId('probe')));for(const t of traces)expect(items(f(t,18n),'list')).toHaveLength(0);}
 const decisions=(i:number)=>runs[i].snapshot().outputs.filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===409n);
 expect(decisions(0)).toEqual(decisions(1));const views=runs.map(r=>rec(decode(r.view(OBSERVER)),881n));expect(f(views[0],3n)).not.toEqual(f(views[1],3n));
},120000);

