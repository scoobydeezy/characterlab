import {dispositionDivergenceHistory,type DispositionComparisonReport as Report} from './dispositionDivergenceHistory';
export function retainDispositionReport(previous:readonly Report[],next:Report,mode:'append'|'reset'|'restore'='append'){
 const base=mode==='reset'||(mode==='restore'&&previous[0]?.contrast.id!==next.contrast.id)?[]:previous;
 // Authenticate consistency against even future observations before truncating the horizon.
 dispositionDivergenceHistory([...base,next]);
 const rows=new Map(base.filter(r=>mode!=='restore'||r.a.prefix<=next.a.prefix).map(r=>[r.a.prefix,r]));
 rows.set(next.a.prefix,next);
 return structuredClone([...rows.values()].sort((a,b)=>a.a.prefix-b.a.prefix));
}
