/** Historical carriage validation: committed payloads and causal closure, never current REG reads. */
import {list,text,unsigned,type CanonicalValue} from '../substrate/canonicalEncoding';
import {INTAKE_EVENT,CARRIAGE_PADDING,type compileMeasurementModel} from './measurementModel';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key,dataIdentity as id} from './canonicalData';
export function validateMeasurementArchive(save:CanonicalValue,model:Awaited<ReturnType<typeof compileMeasurementModel>>){
 const root=rec(save,132n),traces=items(f(root,11n),'list'),outputs=items(f(root,12n),'list'),expected=new Map<string,CanonicalValue>(),seen=new Set<string>(),carried:CanonicalValue[]=[];
 const fail=()=>{throw Error('invalid historical carriage closure');};
 for(const value of traces){const trace=rec(value,160n),event=rec(f(trace,4n),130n),kind=f(event,5n),payload=f(event,6n),children=items(f(trace,18n),'list');
  if(key(kind)===key({kind:'typedIdentifier',namespaceId:1001n,payload:text('event/regulatory-diagnostic-probe-observation')})){
   if(children.length!==2)fail();const child=rec(children[1],130n),wanted=model.probe.permitted?INTAKE_EVENT:CARRIAGE_PADDING;
   if(key(f(child,5n))!==key(wanted)||key(f(rec(children[0],130n),5n))!==key({kind:'typedIdentifier',namespaceId:1001n,payload:text('event/regulatory-diagnostic-probe-tracking')}))fail();
   if(key(f(child,6n))!==key(model.probe.permitted?f(trace,13n):list([]))||key(f(child,2n))!==key(f(event,2n))||key(f(child,3n))!==key(unsigned(130))||key(f(child,7n))!==key(list([]))||key(f(child,8n))!==key(list([f(event,1n)])))fail();
   const k=key(f(child,1n));if(expected.has(k)||seen.has(k))fail();expected.set(k,child);
  }
  if(key(kind)!==key(INTAKE_EVENT)&&key(kind)!==key(CARRIAGE_PADDING))continue;
  const k=key(f(event,1n)),child=expected.get(k);if(!child||seen.has(k)||key(event)!==key(child))fail();seen.add(k);expected.delete(k);
  if(key(f(trace,7n))!==key(kind)||key(f(trace,5n))!==key({kind:'typedIdentifier',namespaceId:1036n,payload:text('seam/measurement-evidence-carriage')})||key(f(trace,6n))!==key(text('measurement-evidence-carriage/0.1-candidate'))||key(f(trace,12n))!==key(payload)||children.length)fail();
  for(const i of [10n,11n,14n,15n,17n,19n])if(key(f(trace,i))!==key(list([])))fail();if(key(f(rec(f(trace,16n),144n),1n))!==key(list([])))fail();
  if(key(kind)===key(CARRIAGE_PADDING)){for(const i of [8n,9n,12n,13n])if(key(f(trace,i))!==key(list([])))fail();continue;}
  const out=rec(f(trace,13n),337n),obs=rec(payload,203n);model.measurement.validateOutput(out);
  const outputOrdinal=id(f(out,1n)).payload,observationOrdinal=id(f(obs,1n)).payload,next=f(rec(f(root,6n),131n),1n);
  if(typeof outputOrdinal==='boolean'||outputOrdinal.kind!=='unsigned'||typeof observationOrdinal==='boolean'||observationOrdinal.kind!=='unsigned'||typeof next==='boolean'||next.kind!=='unsigned'||outputOrdinal.value!==observationOrdinal.value+2n||outputOrdinal.value>=next.value)fail();
  if(key(f(out,2n))!==key(obs)||key(f(trace,8n))!==key(list([id(f(obs,2n))]))||key(f(trace,9n))!==key(list([id(f(obs,1n))])))fail();carried.push(out);
 }
 if(expected.size)fail();
 const actual=outputs.filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===337n);
 if(key(list(actual))!==key(list(carried))||new Set(actual.map(v=>key(f(rec(v,337n),1n)))).size!==actual.length)fail();
}
