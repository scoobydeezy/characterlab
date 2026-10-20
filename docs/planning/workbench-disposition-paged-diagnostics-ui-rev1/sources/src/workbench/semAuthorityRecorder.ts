import {createNegativeRecorder,negativeDiagnostic} from './semNegativeRecorder';
const subset=(actual:unknown,expected:unknown):boolean=>{
 if(Object.is(actual,expected))return true;
 if(!actual||!expected||typeof actual!=='object'||typeof expected!=='object')return false;
 if(Array.isArray(expected))return Array.isArray(actual)&&actual.length===expected.length&&expected.every((v,i)=>subset(actual[i],v));
 return Object.entries(expected).every(([k,v])=>Object.prototype.hasOwnProperty.call(actual,k)&&subset((actual as Record<string,unknown>)[k],v));
};
export function createAuthorityRecorder(){
 const queued:{name:string;body:()=>void|Promise<void>}[]=[],results:ReturnType<ReturnType<typeof createNegativeRecorder>['finish']>=[];
 let current:typeof results[number]|undefined;
 const recordFailure=(code:string,error:unknown)=>{if(!current)throw Error('Failure outside authority case');current.failures.push({code,message:error instanceof Error?error.message:String(error)});};
 const expect=(actual:unknown)=>{
  const matchers=(negated:boolean)=>{
   const invoke=(method:'toBe'|'toEqual'|'toHaveLength'|'toThrow',expected?:unknown)=>{
    if(!current)throw Error('Assertion outside authority case');
    const r=createNegativeRecorder();r.it(current.name,()=>{const m=negated?r.expect(actual).not:r.expect(actual);if(method==='toHaveLength')m.toHaveLength(expected as number);else if(method==='toThrow')m.toThrow();else m[method](expected);});current.assertions.push(...r.finish()[0].assertions);
   };
   return {toBe:(v:unknown)=>invoke('toBe',v),toEqual:(v:unknown)=>invoke('toEqual',v),toHaveLength:(v:number)=>invoke('toHaveLength',v),toThrow:()=>invoke('toThrow'),toMatchObject:(expected:unknown)=>{if(!current)throw Error('Assertion outside authority case');const passed=negated?!subset(actual,expected):subset(actual,expected);current.assertions.push({matcher:'toMatchObject',negated,actual:negativeDiagnostic(actual),expected:negativeDiagnostic(expected),passed});if(!passed)throw Error('Authority subset assertion failed');}};
  };return {...matchers(false),not:matchers(true)};
 };
 return {expect,recordFailure,describe:(_name:string,body:()=>void)=>body(),it:(name:string,body:()=>void|Promise<void>)=>queued.push({name,body}),finish:async()=>{for(const q of queued){current={name:q.name,assertions:[],failures:[]};try{await q.body();if(!current.assertions.length)throw Error('Empty authority case');results.push(current);}finally{current=undefined;}}return results;}};
}
