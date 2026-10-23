import {createNegativeRecorder} from './semNegativeRecorder';

/** Runs original synchronous and asynchronous gate assertions in declaration order. */
export function createAcceptanceRecorder(){
 const queued:{name:string;body:()=>void|Promise<void>}[]= [];
 type Case=ReturnType<ReturnType<typeof createNegativeRecorder>['finish']>[number];
 const cases:Case[]=[];let current:Case|undefined;
 const expect=Object.assign((actual:unknown,_context?:string)=>{
  const matchers=(negated:boolean)=>{
   const invoke=(method:'toBe'|'toEqual'|'toHaveLength'|'toContain'|'toThrow',expected?:unknown)=>{
    if(!current)throw Error('Assertion outside acceptance case');
    const r=createNegativeRecorder();r.it(current.name,()=>{const m=negated?r.expect(actual).not:r.expect(actual);if(method==='toHaveLength')m.toHaveLength(expected as number);else if(method==='toThrow')m.toThrow();else m[method](expected);});current.assertions.push(...r.finish()[0].assertions);
   };
   return {toBe:(v:unknown)=>invoke('toBe',v),toEqual:(v:unknown)=>invoke('toEqual',v),toHaveLength:(v:number)=>invoke('toHaveLength',v),toContain:(v:unknown)=>invoke('toContain',v),toThrow:()=>invoke('toThrow'),toBeNull:()=>invoke('toBe',null)};
  };
  return {...matchers(false),not:matchers(true),
   toBeDefined:()=>expect({actual,defined:actual!==undefined}).toEqual({actual,defined:true}),
   toBeGreaterThan:(minimum:number|bigint)=>{
    if((typeof actual!=='number'&&typeof actual!=='bigint')||typeof actual!==typeof minimum)throw Error('Same-domain numeric operands required');
    expect({actual,minimum,greater:actual>minimum}).toEqual({actual,minimum,greater:true});
   },
   toThrowError:(expected:{code:string})=>{
    if(!current||typeof actual!=='function')throw Error('Coded throw assertion requires active case/function');
    let thrown:unknown;try{actual();}catch(e){thrown=e;}
    if(!thrown||typeof thrown!=='object'||!('code' in thrown)||typeof thrown.code!=='string')throw Error('Expected coded acceptance failure');
    current.failures.push({code:thrown.code,message:thrown instanceof Error?thrown.message:String(thrown)});
    expect(thrown.code).toBe(expected.code);
   },
  };
 },{objectContaining:(expected:{code:string})=>expected});
 return {expect,describe:(_name:string,body:()=>void)=>body(),it:(name:string,body:()=>void|Promise<void>)=>queued.push({name,body}),finish:async()=>{
  for(const q of queued){current={name:q.name,assertions:[],failures:[]};try{await q.body();if(!current.assertions.length)throw Error('Empty acceptance case');cases.push(current);}finally{current=undefined;}}
  return cases;
 }};
}
