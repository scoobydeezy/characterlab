/** ModalFill port from recollection-public/0.1, inside the shared episodic owner. */
import {list,text,unsigned as u,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import {dataItems as items,dataKey as key,dataUnsigned as uint,dataIdentity as id,dataText as txt,invalidModel} from '../campaign2/canonicalData';
import type {StatePath,AuthoritativeState,ActualReadRecord,StatePatch} from '../substrate/state';
import {appearanceEpisode} from './familiarity';
export const SUMMARY='assembled-appearance-summary/0.1',RECOLLECTION='assembled-recollection/0.1';
const eq=(a:CanonicalValue,b:CanonicalValue)=>key(a)===key(b);
const demand=(ok:boolean,s:string)=>{if(!ok)invalidModel('recollection '+s);};
export const isSummaryPath=(p:StatePath)=>p.rootStateTypeId===346n&&p.fieldId===2n;
export const summaryPath=(C:CanonicalValue,category:CanonicalValue):StatePath=>({rootStateTypeId:346n,fieldId:2n,selectors:[{kind:'mapKey',key:list([text(SUMMARY),C,category])}]});
export function summaryValue(v:CanonicalValue){const a=items(v,'list');demand(a.length===5&&txt(a[0])===SUMMARY&&[1n,2n].includes(uint(a[1])),'summary shape');const refs=items(a[4],'list');demand(uint(a[2])+uint(a[3])===BigInt(refs.length),'summary counts');let prior=-1n;for(const r of refs){const x=id(r);demand(x.namespaceId===1115n&&uint(x.payload)>prior,'unique ordered sources');prior=uint(x.payload);}return a;}
export function checkSummary(p:StatePath,C:CanonicalValue,v?:CanonicalValue){demand(isSummaryPath(p)&&p.selectors.length===1&&p.selectors[0].kind==='mapKey','summary path');const a=items((p.selectors[0] as {key:CanonicalValue}).key,'list');demand(a.length===3&&eq(a[0],text(SUMMARY))&&eq(a[1],C)&&[1n,2n].includes(uint(a[2])),'summary holder/category');if(v)demand(eq(summaryValue(v)[1],a[2]),'summary key/value');return a;}
export function creditSummary(before:CanonicalValue|undefined,episode:CanonicalValue){const e=appearanceEpisode(episode),d=items(e[8],'list');demand(d.length===1,'known fresh detail');const a=before?summaryValue(before):[text(SUMMARY),e[4],u(0),u(0),list([])];demand(eq(a[1],e[4]),'category credit');const refs=items(a[4],'list');demand(!refs.some(r=>eq(r,e[2])),'duplicate source credit');const next=list([text(SUMMARY),e[4],u(uint(a[2])+(d[0]===false?1n:0n)),u(uint(a[3])+(d[0]===true?1n:0n)),list([...refs,e[2]])]);summaryValue(next);return next;}
export function summaryRead(state:AuthoritativeState,C:CanonicalValue,category:CanonicalValue):ActualReadRecord{const path=summaryPath(C,category),v=state.read(path);if(v.presence)checkSummary(path,C,v.value);return {accessorId:typedIdentifier(1028,text('accessor/assembled-recollection-summary')),path,presence:v.presence,...(v.presence?{value:v.value}:{}),derivedSources:[]};}
/** One known fresh imprint supplies exactly one update; guesses are never formation inputs. */
export function validateSummaryPatch(p:StatePatch){const fresh=p.operations.filter(o=>o.kind==='set'&&!o.expected.presence&&o.path.rootStateTypeId===346n&&o.path.fieldId===1n&&typeof o.newValue!=='boolean'&&o.newValue.kind==='list'&&eq(o.newValue.items[0],text('assembled-appearance-episode/0.1'))).filter(o=>o.kind==='set'&&items(appearanceEpisode(o.newValue)[8],'list').length);
 const summaries=p.operations.filter(o=>isSummaryPath(o.path));demand(summaries.length===fresh.length,'fresh credit correspondence');
 for(const op of summaries){demand(op.kind==='set','summary cannot be removed');if(op.kind!=='set')continue;const s=summaryValue(op.newValue),source=fresh.find(o=>o.kind==='set'&&eq(appearanceEpisode(o.newValue)[4],s[1]));demand(!!source&&source.kind==='set','source in same transaction');if(source?.kind==='set')demand(eq(op.newValue,creditSummary(op.expected.presence?op.expected.value:undefined,source.newValue)),'exact source credit');}
}
export function recollectAppearance(familiarity:CanonicalValue,episodes:readonly CanonicalValue[],summary?:CanonicalValue){const f=items(familiarity,'list'),supports=items(f[5],'list'),chosen=supports.length&&[4n,5n].includes(uint(f[3]))?episodes.map(appearanceEpisode).find(e=>eq(e[2],supports[0])):undefined;
 let status=0,detail:readonly CanonicalValue[]=[],refs:readonly CanonicalValue[]=[];
 if(chosen){detail=items(chosen[8],'list');status=detail.length?1:2;if(!detail.length&&summary){const s=summaryValue(summary);demand(eq(s[1],chosen[4]),'recollection category');if(uint(s[2])!==uint(s[3])){status=3;detail=[uint(s[3])>uint(s[2])];refs=items(s[4],'list');}}}
 return list([text(RECOLLECTION),f[1],u(status),list(chosen?[chosen[2]]:[]),list(chosen?[chosen[4]]:[]),list(detail),list(refs)]);
}
