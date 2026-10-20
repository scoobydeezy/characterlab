import {dispositionDivergenceHistory,type DispositionComparisonReport as Report} from './dispositionDivergenceHistory';
/** Stored state only. Missing Refold plastic leaves are deliberately not synthesized. */
export function dispositionChart(reports:readonly Report[]){
 const history=dispositionDivergenceHistory(reports),ordered=[...new Map(reports.map(r=>[r.a.prefix,r])).values()].sort((a,b)=>a.a.prefix-b.a.prefix);
 const rows=ordered.map(r=>({prefix:r.a.prefix,branches:(['a','b'] as const).map(branch=>{
  const read=(root:string,type:string)=>{
   const fields=r.fields.filter(f=>f.root===root&&f[branch]!==null);if(fields.length>1)throw Error('Ambiguous disposition chart leaf');
   if(!fields.length)return null;
   const value=JSON.parse(fields[0][branch]!);if(value.record!==type)throw Error('Disposition chart record mismatch');
   const exact=value['Value [1]'];if(typeof exact!=='string'||exact.length>256||! /^-?\d+\/[1-9]\d*$/.test(exact))throw Error('Disposition chart rational required');
   const [n,d]=exact.split('/').map(Number),plot=n/d;if(!Number.isFinite(plot)||Math.abs(plot)>1)throw Error('Disposition chart plotting range exceeded');
   return {exact,plot,path:fields[0].path};
  };
  const constitution=read('1457','ImmutableConstitution#1453/1'),plastic=read('1458','PlasticDisposition#1454/1');
  if(!constitution||constitution.exact!==r[branch].constitution)throw Error('Disposition chart constitution mismatch');
  if((r[branch].law==='Refold')!==(plastic===null))throw Error('Disposition chart plastic ownership mismatch');
  return {branch,program:r[branch].program,saveHash:r[branch].saveHash,constitution,plastic};
 })}));
 return {version:'disposition-stored-state-chart/0.1',history,rows,scope:'Stored constitution and plastic contribution at committed prefixes. Floating coordinates are diagnostic; exact fractions and paths remain authoritative. Refold has no stored plastic leaf, so that series is absent. Missing prefixes break lines. These scalars are not a general personality vector, identity standing or subjective knowledge.'};
}
