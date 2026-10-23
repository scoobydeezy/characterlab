import {createNegativeRecorder} from './semNegativeRecorder';
export function createPhenomenonRecorder(){
 const recorder=createNegativeRecorder();
 const expect=(actual:unknown)=>({...recorder.expect(actual),
  toBeDefined:()=>recorder.expect({actual,defined:actual!==undefined}).toEqual({actual,defined:true}),
  toBeGreaterThan:(minimum:number)=>{if(typeof actual!=='number')throw Error('Numeric comparison required');recorder.expect({actual,minimum,greater:actual>minimum}).toEqual({actual,minimum,greater:true});},
 });return {...recorder,expect};
}
