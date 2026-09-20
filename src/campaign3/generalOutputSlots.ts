/** Internal output admission under general-attention-carrier/0.1-candidate.
 * Uses the scheduler's transactional ordinal allocator, never a parallel counter.
 * These tokens prove local production/slot ownership only; event ingress, state
 * ownership and complete causal-input authentication remain runtime obligations. */
import {canonicalEncode as enc,map,set,unsigned as u,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import {dataRecord as rec,dataField as f,dataItems as items,dataIdentity as id,dataKey as key,dataUnsigned as uint,invalidModel as fail,type RecordValue} from '../campaign2/canonicalData';
import {compileOccurrenceIdentities} from '../campaign2/occurrenceIdentity';
import {generalRegistrationTemplates} from './generalRegistration';
import {generalRecord as r,generalSchemaRef,generalBindingContext} from './generalBindingProfile';
import {decodeGeneralAttention as decode,generalAttentionSupportedSchemas} from './generalAttentionCodecs';

declare const receiptBrand:unique symbol;
export interface GeneralOutputReceipt {readonly [receiptBrand]:true}
type RoleContext=Parameters<typeof compileOccurrenceIdentities>[1];
export function compileGeneralOutputSlots(content:RoleContext,validateRecordRoles:(value:CanonicalValue)=>void){
 const context=generalBindingContext(),templates=generalRegistrationTemplates(),schemas=generalAttentionSupportedSchemas();
 const byType=(typeId:bigint)=>schemas.find(s=>s.typeId===typeId&&s.schemaVersion===1n)??fail('GA output schema');
 const identityTypes=new Set(templates.flatMap(t=>t.outputs.filter(o=>o.identityMode===1||o.identityMode===5).map(o=>o.schema.typeId)));
 // The world binding and sampled observations use the same required-top-field
 // extractor as ordinary identity-bearing outputs. Envelopes do not get an ID.
 [211n,461n,463n,542n,653n,610n].forEach(t=>identityTypes.add(t));
 const rules=map([...identityTypes].map(type=>{
  const role=content.recordRole(type,1n)??fail('GA missing output identity role');
  return [generalSchemaRef(type),r(278,[u(1),decode(role,context)])];
 }));
 const extractor=compileOccurrenceIdentities(enc(rules),content,{decode:b=>decode(b,context),schema:byType});
 const namespace=(type:bigint)=>uint(f(rec(decode(content.recordRole(type,1n)!,context),263n),1n));
 const extract=(value:CanonicalValue)=>id(extractor.extract(enc(value)));
 return Object.freeze({
  /** The surrounding scheduler instant owns allocator rollback. Abort discards
   * every receipt/reservation; commit requires all experience reservations used. */
  beginInstant(allocateRuntimeId:()=>bigint){
   let open=true,pending=false;
   const ordinals=new Set<bigint>(),receipts=new WeakMap<GeneralOutputReceipt,{stage:string;outputs:Uint8Array[];experience?:CanonicalValue;support?:CanonicalValue;sample?:RecordValue;consumed:boolean}>();
   const reservations:{consumed:boolean}[]=[];
   const requireOpen=()=>{if(!open)fail('GA output instant closed');};
   return Object.freeze({
    assertActive(){requireOpen();},
    beginStage(stage:string,reservedFrom?:GeneralOutputReceipt){
     requireOpen();if(pending)fail('GA unfinished output stage');
     const template=templates.find(t=>t.name===stage)??fail('GA unknown output producer');
     const reserved=reservedFrom?receipts.get(reservedFrom):undefined;
     const freeze=template.outputs.some(o=>o.identityMode===5);
     if(reservedFrom&&(!freeze||!reserved||reserved.consumed||reserved.stage!==(stage.startsWith('current-')?'current-sample':'consequence-sample')))fail('GA foreign or consumed experience producer');
     if(freeze&&!reserved)fail('GA freeze requires actual sample receipt');
     const allowed=new Map<bigint,number>();
     for(const o of template.outputs.filter(o=>o.identityMode===1))allowed.set(namespace(o.schema.typeId),(allowed.get(namespace(o.schema.typeId))??0)+o.maximum);
     if(stage==='world')allowed.set(1100n,3);
     if(stage.endsWith('-sample'))for(const [ns,max] of [[1115n,11],[1112n,3],[1113n,1],[1106n,1]] as const)allowed.set(ns,max);
     const issued=new Map<string,CanonicalValue>(),counts=new Map<bigint,number>();let done=false;pending=true;
     const live=()=>{requireOpen();if(done)fail('GA output stage already completed');};
     return Object.freeze({
      allocate(namespace:bigint){
       live();const count=(counts.get(namespace)??0)+1;if(count>(allowed.get(namespace)??0))fail('GA output namespace/count not owned by producer');
       const ordinal=allocateRuntimeId();if(typeof ordinal!=='bigint'||ordinal<0n||ordinals.has(ordinal))fail('GA shared output allocator');
       ordinals.add(ordinal);counts.set(namespace,count);const value=typedIdentifier(namespace,u(ordinal));issued.set(key(value),value);return value;
      },
      reservedExperience(){live();return reserved?.experience===undefined?undefined:decode(enc(reserved.experience),context);},
      admit(outputValues:readonly CanonicalValue[]):GeneralOutputReceipt {
       live();const outputs=outputValues.map(v=>rec(decode(enc(v),context),typeof v==='boolean'||v.kind!=='record'?-1n:v.schema.typeId));
       const owned:CanonicalValue[]=[],seen=new Set<string>();let experience:CanonicalValue|undefined,support:CanonicalValue|undefined,sample:RecordValue|undefined;
       for(const o of template.outputs){const count=outputs.filter(v=>v.schema.typeId===o.schema.typeId).length;if(count<o.minimum||count>o.maximum)fail('GA output cardinality');}
       for(const output of outputs){
        validateRecordRoles(output);
        const declaration=template.outputs.find(o=>o.schema.typeId===output.schema.typeId&&o.schema.schemaVersion===output.schema.schemaVersion);if(!declaration)fail('GA undeclared output schema');
        if(declaration.identityMode===1){owned.push(extract(output));if(stage==='world')for(const b of items(f(output,4n),'set'))owned.push(extract(b));}
        if(declaration.identityMode===2){
         const envelope=rec(output,656n),request=rec(f(envelope,3n),655n),observer=f(envelope,1n),at=f(envelope,2n);
         const equal=(a:CanonicalValue,b:CanonicalValue)=>{if(key(a)!==key(b))fail('GA sampled source association');};
         equal(f(request,1n),observer);const body=envelope.fields.get(4n),panel=envelope.fields.get(5n),visual=envelope.fields.get(6n),event=envelope.fields.get(7n);
         if((body!==undefined)!==request.fields.has(2n)||(panel!==undefined)!==(f(request,3n)===true)||(visual!==undefined)!==(f(request,4n)===true))fail('GA requested sample coverage');
         const supporting:CanonicalValue[]=[];let safe=false,detected=false,presentPanel=false;sample=envelope;
         if(body!==undefined){
          const b=rec(body,654n),br=rec(f(request,2n),650n);equal(f(b,1n),observer);equal(f(b,2n),at);equal(f(br,1n),observer);
          const channels=items(f(br,2n),'set').map(key),samples=items(f(b,3n),'list');
          if(samples.length!==channels.length)fail('GA requested body count');
          const sampled=new Set<string>();
          for(const sample of samples){const s=rec(sample,(sample as RecordValue).schema.typeId);equal(f(s,2n),observer);equal(f(s,4n),at);const channel=key(f(s,3n));if(!channels.includes(channel)||sampled.has(channel))fail('GA requested body channel');sampled.add(channel);owned.push(extract(s));safe ||= s.schema.typeId===461n;if(s.schema.typeId===461n)supporting.push(r(216,[observer,f(s,1n)]));}
          const declared=items(f(b,4n),'set').map(v=>key(f(rec(v,598n),1n)));if(declared.length!==channels.length||new Set(declared).size!==channels.length||declared.some(k=>!channels.includes(k)))fail('GA sampled signal declarations');
         }
         if(panel!==undefined){const p=rec(panel,(panel as RecordValue).schema.typeId);equal(f(p,2n),observer);equal(f(p,3n),at);owned.push(extract(p));presentPanel=p.schema.typeId===542n;safe ||= presentPanel;if(presentPanel)supporting.push(r(216,[observer,f(p,1n)]));}
         if(visual!==undefined){const v=rec(visual,610n);equal(f(v,2n),observer);equal(f(v,3n),at);owned.push(extract(v));
          const detections=items(f(v,5n),'list');detected=detections.length>0;safe ||= detected;if(detected)supporting.push(r(216,[observer,f(v,1n)]));
          for(const value of detections){const detection=rec(f(rec(value,609n),1n),214n);equal(f(detection,1n),observer);owned.push(f(detection,2n));}
          if(v.fields.has(4n)!==(event!==undefined))fail('GA visual event association');if(event!==undefined)equal(f(v,4n),event);
         }
         if((event!==undefined)!==(presentPanel||detected))fail('GA event detection coverage');
         if(event!==undefined){const e=rec(event,215n);equal(f(e,1n),observer);owned.push(f(e,2n));}
         experience=envelope.fields.get(8n);if((experience!==undefined)!==safe)fail('GA safe support reservation');if(experience!==undefined)owned.push(experience);support=set(supporting);
        }
        if(declaration.identityMode===5){
         if(!reserved?.experience||key(extract(output))!==key(reserved.experience))fail('GA wrong reserved experience');
         const sampledAt=f(reserved.sample!,2n) as Extract<CanonicalValue,{kind:'signed'}>;
         if(key(f(output,2n))!==key(f(reserved.sample!,1n))||uint(f(output,3n))!==sampledAt.value||key(f(output,8n))!==key(reserved.support!))fail('GA freeze sampled support/subject/time');
        }
       }
       if(freeze&&outputs.length!==(reserved!.experience===undefined?0:1))fail('GA experience freeze coverage');
       for(const occurrence of owned){const k=key(occurrence);if(seen.has(k)||!issued.has(k))fail('GA output not uniquely owned by actual slot');seen.add(k);}
       if(seen.size!==issued.size)fail('GA allocated output slot not emitted');
       // Paired selected views borrow this invocation's actual audit, not another
       // selector with the same schema and observer.
       for(const [auditType,viewType] of [[532n,615n],[603n,604n]]){const audit=outputs.find(v=>v.schema.typeId===auditType),view=outputs.find(v=>v.schema.typeId===viewType);if(audit&&view&&key(f(audit,1n))!==key(viewType===615n?f(rec(f(view,1n),534n),1n):f(view,1n)))fail('GA selected view producer');}
       const receipt=Object.freeze({}) as GeneralOutputReceipt,record={stage,outputs:outputs.map(enc),experience,support,sample,consumed:false};receipts.set(receipt,record);
       if(experience!==undefined)reservations.push(record);if(freeze)reserved!.consumed=true;
       pending=false;done=true;return receipt;
      },
     });
    },
    outputs(receipt:GeneralOutputReceipt){requireOpen();const r=receipts.get(receipt)??fail('GA foreign output receipt');return r.outputs.map(b=>b.slice());},
    outputsFrom(receipt:GeneralOutputReceipt,producers:readonly string[]){requireOpen();const r=receipts.get(receipt)??fail('GA foreign output receipt');if(!producers.includes(r.stage))fail('GA output receipt producer');return {stage:r.stage,bytes:r.outputs.map(b=>b.slice())};},
    commit(){requireOpen();if(pending||reservations.some(r=>!r.consumed))fail('GA unfinished output reservations');open=false;},
    abort(){requireOpen();open=false;},
   });
  },
 });
}
