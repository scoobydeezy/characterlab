/** Research fixtures only; every cognitive operand must traverse the public source. */
import {canonicalEncode as enc,list,unsigned as u,signed,rational as q,type CanonicalValue} from '../substrate/canonicalEncoding';
import {affectRecord as r} from '../campaign3/affectCodecs';
export interface Trial {glyph:number;action?:number;outcome:boolean;hidden?:boolean;missingMotion?:boolean;actionVisible?:boolean;opportunity?:boolean;monitor?:boolean;outcomeVisible?:boolean;reserve?:number;reserveVisible?:boolean;catalogue?:number;permitted?:boolean;}
export function affectOriginals(trials:readonly Trial[],probes=2){
 const rows:CanonicalValue[]=[];
 for(const t of trials)for(const stage of [1,2,3])rows.push(r(749,[signed(rows.length+1),r(748,[u(t.glyph),u(stage),!(t.missingMotion&&stage===2),t.permitted??true,t.actionVisible??true,u(t.action??1),t.outcomeVisible??true,t.opportunity??true,t.monitor??true,t.outcome,t.hidden??false,u(t.hidden?2:1),t.reserveVisible??true,q(BigInt(Math.round((t.reserve??0)*2)),2),q(t.hidden?0:1,1),u(t.catalogue??2)])]));
 for(let i=0;i<probes;i++)rows.push(r(749,[signed(rows.length+1)]));return enc(list(rows));
}
export const trained=(overrides:Partial<Trial>={}):Trial[]=>[{glyph:0,outcome:true},{glyph:1,action:1,outcome:true},{glyph:1,action:2,outcome:false}].map(t=>({...t,...overrides}));
