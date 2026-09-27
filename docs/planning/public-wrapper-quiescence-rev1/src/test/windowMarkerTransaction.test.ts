import {it,expect} from 'vitest';
import {createWindowMarkerManager as create,prepareWindowMarkerSweep as prepare,windowMarkerSnapshot as snapshot} from '../campaign3/windowMarkerTransaction';
const observer='observer/a',sweep=(n:number)=>({observerId:observer,observationId:BigInt(n*10),occurredAt:BigInt(n),detections:[{detectionId:BigInt(n*10+1),glyph:0n}]});
it('WMT-A: actual token, one pending candidate, stale commit, abort and detached preview',()=>{
 const m=create(observer),initial=snapshot(m);expect(()=>prepare({} as typeof m,sweep(1))).toThrow();
 const p=prepare(m,sweep(1));expect(snapshot(m)).toEqual(initial);expect(()=>prepare(m,sweep(2))).toThrow();p.close();expect(()=>p.commit()).toThrow();expect(snapshot(m)).toEqual(initial);
 const q=prepare(m,sweep(1));(q.result.window.items[0].file as {observerId:string}).observerId='tampered';q.commit();expect(snapshot(m).window.items[0].file.observerId).toBe(observer);expect(()=>q.commit()).toThrow();q.close();
});
it('WMT-B: every actual prefix resumes without saved source history or recreated output identities',()=>{
 const all=Array.from({length:10},(_,i)=>sweep(i+1)),m=create(observer);for(const s of all)prepare(m,s).commit();const expected=snapshot(m);
 for(let n=0;n<=10;n++){const prior=create(observer);for(const s of all.slice(0,n))prepare(prior,s).commit();const saved=snapshot(prior),restored=create(observer,saved.files,saved.window);for(const s of all.slice(n))prepare(restored,s).commit();expect(snapshot(restored)).toEqual(expected);expect(Object.keys(snapshot(restored)).sort()).toEqual(['files','observer','window']);}
});
