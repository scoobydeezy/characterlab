import type {AffectSnapshot,AffectCheckpoint} from './affectSession';
import {AFFECT_CONTRASTS,compareAffect} from './affectComparison';

export interface AffectPairRun {
 snapshot():AffectSnapshot;
 advance():Promise<boolean>;
 checkpoint():AffectCheckpoint|Promise<AffectCheckpoint>;
 dispose?():void;
}
export interface AffectPairFactory {
 create(program:string):Promise<AffectPairRun>;
 restore(checkpoint:AffectCheckpoint):Promise<AffectPairRun>;
}
export interface AffectPairCheckpoint {
 version:'affect-pair-checkpoint/0.1';
 contrast:string;
 a:AffectCheckpoint;
 b:AffectCheckpoint;
}
export type AffectPairBranch='a'|'b';

/** Publishes a detached pair only after both requested operations succeed. */
export class AffectPairSession {
 #a:AffectPairRun;#b:AffectPairRun;#id:string;#busy=false;#disposed=false;#failure:string|null=null;
 #view:ReturnType<typeof compareAffect>;
 private constructor(id:string,a:AffectPairRun,b:AffectPairRun){this.#id=id;this.#a=a;this.#b=b;this.#view=compareAffect(a.snapshot(),b.snapshot());}
 static async create(id:string,factory:AffectPairFactory){
  const spec=AFFECT_CONTRASTS.find(c=>c.id===id);if(!spec)throw Error('Unknown AFFECT pair');
  const a=await factory.create(spec.a);let b:AffectPairRun|undefined;
  try{b=await factory.create(spec.b);return new AffectPairSession(id,a,b);}catch(error){a.dispose?.();b?.dispose?.();throw error;}
 }
 static async restore(input:AffectPairCheckpoint,factory:AffectPairFactory){
  const c=structuredClone(input),spec=AFFECT_CONTRASTS.find(s=>s.id===c?.contrast);
  if(c?.version!=='affect-pair-checkpoint/0.1'||!spec||c.a?.program!==spec.a||c.b?.program!==spec.b)throw Error('Invalid AFFECT pair checkpoint');
  const a=await factory.restore(c.a);let b:AffectPairRun|undefined;
  try{b=await factory.restore(c.b);return new AffectPairSession(spec.id,a,b);}catch(error){a.dispose?.();b?.dispose?.();throw error;}
 }
 #ready(){if(this.#disposed)throw Error('AFFECT pair disposed');if(this.#busy)throw Error('AFFECT pair command in flight');if(this.#failure)throw Error('AFFECT pair failed; restore or create a new pair');}
 snapshot(){if(this.#busy)throw Error('AFFECT pair command in flight');if(this.#disposed)throw Error('AFFECT pair disposed');return {comparison:structuredClone(this.#view),failure:this.#failure};}
 async advance(branch:AffectPairBranch|'both'='both'){
  this.#ready();if(!['a','b','both'].includes(branch))throw Error('Invalid AFFECT pair branch');
  if(branch==='both'&&!this.#view.aligned)throw Error('Align AFFECT prefixes before advancing both');
  this.#busy=true;
  try{
   const a=branch!=='b'?await this.#a.advance():false,b=branch!=='a'?await this.#b.advance():false;
   if(this.#disposed)throw Error('AFFECT pair disposed');
   this.#view=compareAffect(this.#a.snapshot(),this.#b.snapshot());return a||b;
  }catch(error){this.#failure=String(error);throw error;}finally{this.#busy=false;}
 }
 async checkpoint():Promise<AffectPairCheckpoint>{
  this.#ready();this.#busy=true;
  try{
   const a=await this.#a.checkpoint(),b=await this.#b.checkpoint();
   if(this.#disposed)throw Error('AFFECT pair disposed');
   for(const [branch,c] of [['a',a],['b',b]] as const){const s=this.#view[branch];if(c.program!==s.program||c.prefix!==s.prefix||c.saveHash!==s.saveHash)throw Error('AFFECT checkpoint revision mismatch');}
   return structuredClone({version:'affect-pair-checkpoint/0.1',contrast:this.#id,a,b});
  }finally{this.#busy=false;}
 }
 dispose(){if(this.#disposed)return;this.#disposed=true;this.#a.dispose?.();this.#b.dispose?.();}
}
