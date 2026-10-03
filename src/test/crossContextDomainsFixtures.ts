import {crossContextCases} from './crossContextIdentityFixtures';
import type {DomainFrame} from '../campaign3/crossContextDomains';
export function domainFrames():DomainFrame[]{return Array.from({length:5},(_,i)=>({at:i+1,truth:true,display:true,speakerAccess:true,transport:true,accessA:true,accessB:false}));}
export function domainCases(){
 const cases=Object.fromEntries(['main','hidden','failedDelivery','deniedExecution','falseDisplay','noPrivateEvidence','noRecipients','otherRecipient'].map(name=>[name,{frames:crossContextCases().main,sources:domainFrames()}]));
 cases.hidden.sources.forEach(x=>x.truth=false);cases.failedDelivery.sources.forEach(x=>x.transport=false);cases.deniedExecution.frames.forEach(x=>x.permitted=false);cases.falseDisplay.sources.forEach(x=>x.display=false);cases.noPrivateEvidence.sources.forEach(x=>x.speakerAccess=false);cases.noRecipients.sources.forEach(x=>x.accessA=false);cases.otherRecipient.sources.forEach(x=>{x.accessA=false;x.accessB=true;});return cases;
}
