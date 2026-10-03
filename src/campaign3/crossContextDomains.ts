/** cross-context-domains-component/0.1-candidate; original cognition, separate actual domain effects. */
import {canonicalEncode as enc,list,text,bytes,unsigned as u,signed,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key} from '../campaign2/canonicalData';
import {chosenData} from '../campaign2/cognitiveChoice';
import {createCrossContextRun,restoreCrossContextRun,ACTOR,CONTEXTS,type Law,type Frame} from './crossContextIdentity';
import {communicationRecord as r,decodeCommunication as decode} from './communicationCodecs';
import {HOLDERS} from './communicationModel';
import {learn,claim,emptyKnowledge,estimate} from './communicationMath';
export const VERSION='cross-context-domains-component/0.1-candidate';
export interface DomainFrame {at:number;truth:boolean;display:boolean;speakerAccess:boolean;transport:boolean;accessA:boolean;accessB:boolean;}
const fields=['at','truth','display','speakerAccess','transport','accessA','accessB'];
function check(xs:readonly DomainFrame[]){
 if(!Array.isArray(xs)||Object.getPrototypeOf(xs)!==Array.prototype||xs.length!==5||Reflect.ownKeys(xs).length!==6||Object.values(Object.getOwnPropertyDescriptors(xs)).some(d=>!('value'in d)))throw Error('CCD_FRAMES');
 for(const [i,x] of xs.entries()){if(!x||Object.getPrototypeOf(x)!==Object.prototype)throw Error('CCD_DATA');const ds=Object.getOwnPropertyDescriptors(x);if(Reflect.ownKeys(ds).length!==fields.length||fields.some(k=>!ds[k]||!('value'in ds[k])))throw Error('CCD_DATA');if(x.at!==i+1||fields.slice(1).some(k=>typeof ds[k].value!=='boolean'))throw Error('CCD_DOMAIN');}
 return structuredClone(xs);
}
const clone=(x:CanonicalValue)=>decode(enc(x));
export function createDomainRun(law:Law,frames:readonly Frame[],sources:readonly DomainFrame[],seed=7){
 let base=createCrossContextRun(law,frames,seed);const originals=structuredClone(frames),source=check(sources);let prefix=0,busy=false;
 let knowledge:CanonicalValue[]=[emptyKnowledge(),emptyKnowledge(),emptyKnowledge()],receipts:CanonicalValue[]=[];
 let world={parcels:Array.from({length:5},(_,i)=>({id:'parcel/'+(i+1),owner:'Actor'})),location:'Away',hazard:true};
 const quiescent=()=>{if(busy)throw Error('CCD_BUSY');};
 const save=()=>enc(list([text(VERSION),text(law),text(JSON.stringify(originals)),text(JSON.stringify(source)),u(seed),u(prefix),bytes(base.save()),text(JSON.stringify(world)),list(knowledge),list(receipts)]));
 return Object.freeze({save:()=>{quiescent();return save();},
  identityView:()=>{quiescent();return base.observerView();},
  recipientView:(i:1|2)=>{quiescent();if(i!==1&&i!==2)throw Error('CCD_HOLDER');return clone(list([HOLDERS[i],knowledge[i],estimate(knowledge[i],false)]));},
  snapshot:()=>{quiescent();return {prefix,world:structuredClone(world),knowledge:knowledge.map(clone),receipts:receipts.map(clone),identity:base.snapshot()};},
  async step(fault?:'after-identity'|'after-world'|'before-commit'){
   if(busy)throw Error('CCD_CONCURRENT');if(prefix===5)return false;busy=true;const before=base.save();
   try{
    const x=source[prefix],input=originals[prefix],occ=(i:number)=>typedIdentifier(1168,u(x.at*8+i));
    const nextKnowledge=[...knowledge];let privateObservation:CanonicalValue=list([]);
    // Safe private display, never world truth. Existing speaker learning retains the
    // last admitted claim when a later display is unavailable.
    if(input.context==='Disclosure'){privateObservation=r(1070,[occ(0),HOLDERS[0],signed(x.at),list(x.speakerAccess?[x.display]:[])]);nextKnowledge[0]=learn(knowledge[0],privateObservation,0,1);}
    await base.step();if(fault==='after-identity')throw Error('CCD_INJECTED');
    const snapshot=items(base.snapshot(),'list'),execution=rec(items(snapshot[3],'list').at(-1)!,433n),attempt=rec(f(execution,2n),432n),plan=rec(f(attempt,2n),431n),intent=rec(f(plan,2n),425n),chosen=rec(f(chosenData(f(intent,2n)),1n),395n);
    if(key(f(chosen,1n))!==key(ACTOR))throw Error('CCD_FOREIGN_ACTOR');
    const spec=CONTEXTS[input.context],action=spec.actions.find(a=>key(f(chosen,2n))===key(typedIdentifier(1027,text('action/cross-context/'+a))));if(!action)throw Error('CCD_ACTION_CONTEXT');
    const nextWorld=structuredClone(world);nextWorld.hazard=x.truth;let delivered=false,assertion:CanonicalValue=list([]),observationA:CanonicalValue=list([]),observationB:CanonicalValue=list([]);
    if(input.context==='Custody'){
     const parcel=nextWorld.parcels.find(p=>p.id==='parcel/'+x.at)!;
     if(action==='return-parcel'&&input.permitted&&parcel.owner==='Actor')parcel.owner='Beneficiary';
    }else if(input.context==='Disclosure'){
     const frozenClaim=claim(nextKnowledge[0]);delivered=action==='disclose-hazard'&&input.permitted&&x.transport&&items(frozenClaim,'list').length===1;assertion=delivered?frozenClaim:list([]);
     observationA=r(1070,[occ(1),HOLDERS[1],signed(x.at),delivered&&x.accessA?assertion:list([])]);
     observationB=r(1070,[occ(2),HOLDERS[2],signed(x.at),delivered&&x.accessB?assertion:list([])]);
     nextKnowledge[1]=learn(knowledge[1],observationA,1,1);nextKnowledge[2]=learn(knowledge[2],observationB,2,1);
    }else if(action==='attend-appointment'&&input.permitted)nextWorld.location='WithBeneficiary';
    const receipt=list([u(x.at),ACTOR,attempt,text(input.context),text(action),text(JSON.stringify(world)),text(JSON.stringify(nextWorld)),privateObservation,delivered,assertion,observationA,observationB]);clone(receipt);
    if(fault==='after-world'||fault==='before-commit')throw Error('CCD_INJECTED');
    world=nextWorld;knowledge=nextKnowledge;receipts=[...receipts,receipt];prefix++;return true;
   }catch(error){base=await restoreCrossContextRun(law,originals,seed,prefix,before);throw error;}finally{busy=false;}
  }
 });
}
export async function restoreDomainRun(law:Law,frames:readonly Frame[],sources:readonly DomainFrame[],seed:number,prefix:number,saved:Uint8Array){
 if(!Number.isInteger(prefix)||prefix<0||prefix>5||!(saved instanceof Uint8Array))throw Error('CCD_RESTORE');const copy=saved.slice(),run=createDomainRun(law,frames,sources,seed);for(let i=0;i<prefix;i++)await run.step();const actual=run.save();if(actual.length!==copy.length||actual.some((v,i)=>v!==copy[i]))throw Error('CCD_SAVE_MISMATCH');return run;
}
