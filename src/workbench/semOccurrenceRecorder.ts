import {createAuthorityRecorder} from './semAuthorityRecorder';
export function createOccurrenceRecorder(){
 const recorder=createAuthorityRecorder();
 const expect=Object.assign((actual:unknown)=>({...recorder.expect(actual),
  toBeUndefined:()=>recorder.expect({actual,undefined:actual===undefined}).toMatchObject({undefined:true}),
  toBeDefined:()=>recorder.expect({actual,defined:actual!==undefined}).toMatchObject({defined:true}),
  toThrowError:(expected:{code:string})=>{
   if(typeof actual!=='function')throw Error('Throw matcher requires function');
   let thrown:unknown;try{actual();}catch(e){thrown=e;}
   if(!thrown||typeof thrown!=='object'||!('code' in thrown)||typeof thrown.code!=='string')throw Error('Expected coded occurrence failure');
   recorder.recordFailure(thrown.code,thrown);recorder.expect({code:thrown.code,message:thrown instanceof Error?thrown.message:String(thrown)}).toMatchObject(expected);
  },
 }),{objectContaining:(expected:{code:string})=>expected});
 return {...recorder,expect};
}
