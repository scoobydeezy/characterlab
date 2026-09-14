/** requested-source-sampling-component/0.1-candidate; physical sampling, no SEM/state authority. */
import {canonicalEncode,text,typedIdentifier,type TypedIdentifierValue} from '../substrate/canonicalEncoding';
import {observeLocalReserveRecords} from './localReserveObservation';
import type {LocalReserveSource} from './localReserveSource';
import {observeTrialPanel,type TrialPanelSource} from './trialPanelSource';
import {observePositionDisplay,type PositionDisplaySource} from './positionDisplaySource';
export interface SourceSamplingRequest {readonly bodyChannels:readonly string[]|null;readonly panel:boolean;readonly visual:boolean}
export function sampleRequestedSources(body:LocalReserveSource|undefined,panel:TrialPanelSource|undefined,display:PositionDisplaySource|undefined,observer:TypedIdentifierValue,at:bigint,request:SourceSamplingRequest,allocate:()=>bigint){
 const fail=():never=>{throw Error('SOURCE_SAMPLING_REQUEST');};
 if(!request||Object.getPrototypeOf(request)!==Object.prototype)fail();
 const d=Object.getOwnPropertyDescriptors(request),names=['bodyChannels','panel','visual'];
 if(Reflect.ownKeys(d).length!==3||names.some(k=>!d[k]||!('value'in d[k])))fail();
 if(typeof request.panel!=='boolean'||typeof request.visual!=='boolean'||(request.bodyChannels!==null&&!Array.isArray(request.bodyChannels))||request.bodyChannels===null&&!request.panel&&!request.visual)fail();
 if(request.bodyChannels!==null&&!body||request.panel&&!panel||request.visual&&!display)fail();
 if(typeof at!=='bigint'||at<0n||!observer||observer.kind!=='typedIdentifier'||observer.namespaceId!==1000n||typeof observer.payload!=='object'||observer.payload.kind!=='text'||!observer.payload.value)throw Error('SOURCE_SAMPLING_REQUEST');
 canonicalEncode(observer);observer=typedIdentifier(1000,text(observer.payload.value));
 const used=new Set<bigint>(),next=()=>{const id=allocate();if(typeof id!=='bigint'||id<0n||used.has(id))throw Error('SOURCE_SAMPLING_ALLOCATION');used.add(id);return id;};
 const bodyResult=request.bodyChannels===null?undefined:observeLocalReserveRecords(body!,observer,at,request.bodyChannels,next);
 const panelResult=request.panel?{sample:observeTrialPanel(panel!,at),observation:next()}:undefined;
 const visualResult=request.visual?{sample:observePositionDisplay(display!,at),observation:next()}:undefined;
 return {observer,at,...(bodyResult?{body:bodyResult}:{}),...(panelResult?{panel:panelResult}:{}),...(visualResult?{visual:visualResult}:{})};
}
