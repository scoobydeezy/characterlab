/** M284 plan04476483. Test-only proposal; no native law adoption or coverage claim. */
import {it,expect} from 'vitest';
// @ts-expect-error Node evidence access.
import {readFileSync,writeFileSync} from 'node:fs';
// @ts-expect-error Lossless M283 archive.
import {inflateRawSync} from 'node:zlib';
// @ts-expect-error Original-byte identity.
import {createHash} from 'node:crypto';
import {ExactRational as Q} from '../substrate/exactMath';
import {canonicalEncode as enc,list,text,unsigned as u,signed,rational as q,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import {dataRecord as rec,dataField as f,dataItems as items,dataUnsigned as uint,dataKey as key} from '../campaign2/canonicalData';
import {readQ} from '../campaign2/cognitiveMath';
import {decodeCognitive as decode} from '../assembled/codecs';
import {restoreAuthoritativeState} from '../substrate/state';
import {practiced,skillValue,SKILL_ACTUAL,SKILL_UPDATE} from '../assembled/skill';
import {evolveSkill} from '../campaign3/longitudinalMath';
import {DEFAULT_SETTINGS} from '../campaign3/longitudinalModel';
import {longitudinalRecord} from '../campaign3/longitudinalCodecs';
import {skillRecord} from '../campaign3/skillCodecs';
const H=4n,MAX=1000000n,zero=Q.of(0n),one=Q.of(1n);
type Anchor=Readonly<{K:Q;count:bigint;anchorAt:bigint}>;
const hash=(v:Uint8Array)=>createHash('sha256').update(v).digest('hex');
const fraction=(v:Q)=>v.numerator+'/'+v.denominator;
function valid(a:Anchor|undefined,now:bigint){
 if(now<0n||now>MAX)throw Error('time domain');
 if(a&&(a.anchorAt<0n||a.anchorAt>now||a.count<1n||a.count>100n||a.K.compare(zero)<0||a.K.compare(one)>0))throw Error('anchor domain');
}
function current(a:Anchor|undefined,now:bigint){valid(a,now);return !a||a.K.equals(zero)?zero:a.K.divide(Q.of(2n**((now-a.anchorAt)/H)));}
function transition(a:Anchor|undefined,now:bigint,practice:boolean,interference=false,phase=4):Anchor|undefined {
 const before=current(a,now),reduced=interference?before.subtract(Q.of(1n,4n)):before,afterLoss=reduced.compare(zero)<0?zero:reduced;
 if(practice){const p=practiced(afterLoss,a?.count??0n,phase);return Object.freeze({K:p.after,count:(a?.count??0n)+1n,anchorAt:now});}
 if(!a||!interference||before.equals(afterLoss))return a;
 return Object.freeze({K:afterLoss,count:a.count,anchorAt:a.anchorAt+((now-a.anchorAt)/H)*H});
}
const encoded=(a:Anchor|undefined)=>enc(a?list([text('PeriodicDisuse/0.1-proposal'),q(a.K.numerator,a.K.denominator),u(a.count),signed(a.anchorAt)]):list([]));
function restored(bytes:Uint8Array):Anchor|undefined {
 const a=items(decode(bytes),'list');if(!a.length)return undefined;
 if(a.length!==4||key(a[0])!==key(text('PeriodicDisuse/0.1-proposal'))||typeof a[3]==='boolean'||a[3].kind!=='signed')throw Error('anchor codec');
 const result={K:readQ(a[1]),count:uint(a[2]),anchorAt:a[3].value};valid(result,result.anchorAt);return Object.freeze(result);
}
const sourcePath='docs/planning/ASSEMBLED_CHARACTER_M283_EVIDENCE.json';
const sourceBytes=readFileSync(sourcePath),source=JSON.parse(sourceBytes.toString());
function unpack(a:{deflateBase64:string;sha256:string;length:number}){
 const raw=inflateRawSync(Uint8Array.from(atob(a.deflateBase64),c=>c.charCodeAt(0)));
 expect(raw.length).toBe(a.length);expect(hash(raw)).toBe(a.sha256);return rec(decode(raw),132n);
}
const prefix=unpack(source.controls.prefix4),terminal=unpack(source.controls.terminal);
const trace=items(f(terminal,11n),'list').map(v=>rec(v,160n));
const at=(t:CanonicalValue)=>f(rec(f(rec(t,160n),4n),130n),2n);
const projection=(t:CanonicalValue)=>{const p=f(rec(t,160n),13n);return typeof p!=='boolean'&&p.kind==='list'?p.items:[p];};
function report(n:number,tag:string){
 const rows=trace.filter(t=>key(at(t))===key(signed(n))).flatMap(projection).filter(v=>typeof v!=='boolean'&&v.kind==='list'&&v.items.length&&key(v.items[0])===key(text(tag))).map(v=>items(v,'list'));
 expect(rows.length,'live captured '+tag).toBeGreaterThan(0);return rows[0];
}
const actual=report(7,SKILL_ACTUAL),training=report(3,SKILL_ACTUAL);
const learned=restoreAuthoritativeState(f(prefix,5n)).entries().filter(e=>e.path.rootStateTypeId===785n);
expect(learned).toHaveLength(1);
const prior=skillValue(learned[0].value,actual[10],true),acquired:Anchor=Object.freeze({...prior,anchorAt:3n});
const impairment=readQ(actual[4]),difficulty=readQ(actual[5]);
const predicts=(K:Q)=>actual[6]===true&&K.multiply(one.subtract(impairment)).compare(difficulty)>=0;
const evidence:Record<string,unknown>={status:'PROPOSED kernel comparison only; no native rust acceptance',plan:'04476483',source:{path:sourcePath,sha256:hash(sourceBytes),prefix:source.controls.prefix4.sha256,terminal:source.controls.terminal.sha256},proposal:'PeriodicDisuse/0.1',H:'4',fraction:'1/2',reference:'0.165/NoRust unchanged'};
const save=()=>writeFileSync('docs/planning/ASSEMBLED_CHARACTER_M284_EVIDENCE.json',JSON.stringify(evidence,null,2)+'\n');
function historical(times:readonly bigint[],rust:0|1){
 let K=acquired.K,clock=3n,count=acquired.count;
 return times.map(now=>{
  const before=K,src=longitudinalRecord(878,[typedIdentifier(1157n,u(now)),signed(now),u(0),false,false,false,false,false,u(now-clock)]);
  const out=evolveSkill(skillRecord(784,[q(K.numerator,K.denominator),u(count)]),src,{...DEFAULT_SETTINGS,rust});
  K=readQ(f(rec(out,784n),1n));count=uint(f(rec(out,784n),2n));clock=now;
  return {at:String(now),before:fraction(before),after:fraction(K),predictedExecution:predicts(before),count:String(count)};
 });
}
it('comparison284: distinguish disuse from commit gaps and historical post-execution timing',()=>{
 expect(acquired.K).toEqual(Q.of(1n,2n));expect(acquired.count).toBe(1n);
 expect(training[6]).toBe(true);expect(training[8]).toBe(true);expect(training[3]).toEqual(q(0,1));expect(report(3,SKILL_UPDATE)).toBeDefined();
 expect(actual[3]).toEqual(q(1,2));expect(actual[7]).toBe(true);expect(predicts(acquired.K)).toBe(actual[7]);
 const sparse=[7n,8n,11n],dense=[4n,5n,6n,7n,8n,9n,10n,11n];
 const oldSparse=historical(sparse,1),oldDense=historical(dense,1),none=historical(sparse,0);
 expect(oldSparse.map(x=>[x.before,x.after])).toEqual([['1/2','1/4'],['1/4','1/4'],['1/4','1/4']]);
 expect(oldDense.every(x=>x.before==='1/2'&&x.after==='1/2')).toBe(true);
 expect(none.every(x=>x.before==='1/2'&&x.after==='1/2')).toBe(true);
 const projection=(times:readonly bigint[])=>times.map(t=>({at:String(t),K:fraction(current(acquired,t)),predictedExecution:predicts(current(acquired,t))}));
 const p=projection(sparse),d=projection(dense);expect(p).toEqual(d.filter(x=>sparse.includes(BigInt(x.at))));
 expect(p.map(x=>x.K)).toEqual(['1/4','1/4','1/8']);expect(p.every(x=>!x.predictedExecution)).toBe(true);
 expect(current(acquired,6n)).toEqual(Q.of(1n,2n));expect(current(acquired,7n)).toEqual(Q.of(1n,4n));
 evidence.comparison={actualNative7:{K:'1/2',success:true},noRust:none,halfAtGap:{sparse:oldSparse,dense:oldDense},periodic:{sparse:p,dense:d},boundary6:'1/2',boundary7:'1/4'};
 save();console.info('M284 comparison PASS: captured native NoRust; HalfAtGap clock/order mismatch; proposed exact procedure time invariant');
});
it('controls284: independent procedures, decay-before-practice recovery, interference, boundaries and canonical continuation',()=>{
 const other:Anchor={K:Q.of(1n,2n),count:1n,anchorAt:6n};
 expect(current(other,7n)).toEqual(Q.of(1n,2n));expect(current(acquired,7n)).toEqual(Q.of(1n,4n));
 const after7=transition(acquired,7n,true)!,after8=transition(after7,8n,true)!;
 expect(after7.K).toEqual(Q.of(3n,8n));expect(after8.K).toEqual(Q.of(1n,2n));expect(predicts(current(after8,9n))).toBe(true);
 expect(after8.count).toBe(3n);expect(current(other,9n)).toEqual(Q.of(1n,2n));
 expect(transition(acquired,7n,false)).toBe(acquired);expect(current(transition(acquired,7n,false),11n)).toEqual(Q.of(1n,8n));
 // Interference at6 leaves the original cutoff7 in force; it cannot buy four new units.
 const loss=transition(acquired,6n,false,true)!;expect(loss.anchorAt).toBe(3n);expect(loss.K).toEqual(Q.of(1n,4n));expect(current(loss,7n)).toEqual(Q.of(1n,8n));
 expect(transition(acquired,7n,true,true)!.K).toEqual(Q.of(1n,8n));
 expect(current({K:zero,count:1n,anchorAt:3n},MAX)).toEqual(zero);
 expect(current(undefined,MAX)).toEqual(zero);expect(transition(undefined,7n,false)).toBeUndefined();
 const saturated=transition({K:one,count:1n,anchorAt:6n},7n,true)!;expect(saturated.K).toEqual(one);
 expect(()=>current(acquired,2n)).toThrow('anchor domain');expect(()=>current(acquired,MAX+1n)).toThrow('time domain');
 expect(()=>current({...acquired,count:0n},7n)).toThrow('anchor domain');
 expect(()=>transition({...acquired,count:100n},7n,true)).toThrow('practice count');
 const snapshots=[acquired,after8,loss];let comparisons=0;
 for(const a of snapshots){const bytes=encoded(a),b=restored(bytes);expect(hash(encoded(b))).toBe(hash(bytes));
  for(const now of [a.anchorAt,a.anchorAt+3n,a.anchorAt+4n,a.anchorAt+8n]){expect(current(a,now)).toEqual(current(b,now));expect(hash(encoded(transition(a,now,true)))).toBe(hash(encoded(transition(b,now,true))));comparisons++;}
 }
 // Restoring before the first cutoff and after recovery preserves each phase.
 expect(current(restored(encoded(acquired)),7n)).toEqual(Q.of(1n,4n));expect(current(restored(encoded(after8)),12n)).toEqual(Q.of(1n,4n));
 const max=current(acquired,MAX);expect(max.numerator).toBe(1n);expect(max.denominator).toBe(2n**250000n);
 evidence.controls={secondProcedureAt7:'1/2',practice7:'3/8',practice8:'1/2',recovered9:true,interference6:{anchorAt:'3',K:'1/4',at7:'1/8'},blockedReset:false,canonicalContinuations:comparisons,maxTime:String(MAX),denominatorBits:max.denominator.toString(2).length,receivingRuntimeRestore:'NOT TESTED: test-only representation',nativeRustConsumer:'NOT IMPLEMENTED'};
 save();console.info('M284 controls PASS: separate clocks; D3 recovery; interference retains phase; canonical round trips; million-unit exact domain');
});
