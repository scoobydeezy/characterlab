/** craving-component/0.1-candidate; current character appraisal from safe inputs. */
import {ExactRational as Q} from '../substrate/exactMath';
import {canonicalEncode as enc,list,text,unsigned} from '../substrate/canonicalEncoding';
import {decodeReceiving} from './receivingCodecs';
import {dataItems,dataUnsigned} from '../campaign2/canonicalData';
export const VERSION='craving-component/0.1-candidate';
export const LAWS=['MeanProduct','MeanBottleneck','LatestProduct','NoLearning'] as const;
export type Law=typeof LAWS[number];
export type Frame={body:string|null;report:0|1|null;reportVisible:boolean;cue:boolean;deliberateRecall:boolean;available:boolean;restrained:boolean;privateTruth:boolean};
export type Row={at:number;body:string|null;belief:string|null;accessible:boolean;urge:string|null;available:boolean;restrained:boolean;eligible:boolean};
const clone=<T>(v:T):T=>structuredClone(v),str=(q:Q)=>`${q.numerator}/${q.denominator}`;
function number(v:string){if(!/^\d+\/[1-9]\d*$/.test(v))throw Error('CRAVING_RATIONAL');const [n,d]=v.split('/').map(BigInt),q=Q.of(n,d);if(str(q)!==v||q.compare(Q.of(1n))>0)throw Error('CRAVING_DOMAIN');return q;}
export function createCravingRun(law:Law,observer:string,frames:readonly Frame[]){
 if(!LAWS.includes(law)||!observer||frames.length!==4)throw Error('CRAVING_PROFILE');
 const original=clone(frames);
 for(const x of original){if(Object.keys(x).sort().join(',')!=='available,body,cue,deliberateRecall,privateTruth,report,reportVisible,restrained'||![null,0,1].includes(x.report))throw Error('CRAVING_FRAME');if(x.body!==null)number(x.body);for(const k of ['reportVisible','cue','deliberateRecall','available','restrained','privateTruth'] as const)if(typeof x[k]!=='boolean')throw Error('CRAVING_BOOLEAN');}
 let at=0,history:number[]=[],rows:Row[]=[];
 const snapshot=()=>clone({observer,at,history,rows});
 const save=()=>enc(list([text(VERSION),text(law),text(observer),text(JSON.stringify(original)),unsigned(at),text(JSON.stringify(snapshot()))]));
 return Object.freeze({snapshot,save,step(){
  if(at===4)return false;
  const x=original[at],belief=history.length?(law==='LatestProduct'?Q.of(BigInt(history.at(-1)!)):Q.of(BigInt(history.reduce((a,b)=>a+b,0)),BigInt(history.length))):null,accessible=x.cue||x.deliberateRecall;
  let urge:Q|null=null;
  if(accessible&&belief&&x.body!==null){const body=number(x.body);urge=law==='MeanBottleneck'?(body.compare(belief)<0?body:belief):body.multiply(belief);}
  rows.push({at:at+1,body:x.body,belief:belief?str(belief):null,accessible,urge:urge?str(urge):null,available:x.available,restrained:x.restrained,eligible:!!urge&&urge.compare(Q.of(0n))>0&&x.available&&!x.restrained});
  if(law!=='NoLearning'&&x.reportVisible&&x.report!==null)history.push(x.report);
  at++;return true;
 }});
}
export function restoreCravingRun(law:Law,observer:string,frames:readonly Frame[],saved:Uint8Array){
 const values=dataItems(decodeReceiving(saved),'list');if(values.length!==6)throw Error('CRAVING_SAVE');const count=dataUnsigned(values[4]);if(count>4n)throw Error('CRAVING_PREFIX');
 const run=createCravingRun(law,observer,frames);for(let i=0n;i<count;i++)run.step();const actual=run.save();if(actual.length!==saved.length||!actual.every((v,i)=>v===saved[i]))throw Error('CRAVING_MISMATCH');return run;
}
