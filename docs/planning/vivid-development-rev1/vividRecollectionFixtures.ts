import type {Frame} from '../campaign3/vividRecollection';
export function vividFrames():Frame[]{return Array.from({length:6},(_,i)=>({at:i+1,truth:[true,true,true],display:[true,true,true],clarity:[2,2,2],visible:true,cue:'target'}));}
export function vividCases(){const names=['rich','weak','partial','falseDisplay','hiddenTruth','denied','deniedChanged','noCue','otherCue','noQueries','empty'] as const;const c=Object.fromEntries(names.map(n=>[n,vividFrames()])) as Record<typeof names[number],Frame[]>;
 c.weak[0].clarity=[1,1,1];c.partial[0].clarity=[2,0,0];c.falseDisplay[0].display=[false,false,false];c.hiddenTruth.forEach(f=>f.truth=[false,false,false]);
 c.denied[0].visible=false;c.deniedChanged[0].visible=false;c.deniedChanged[0].display=[false,false,false];c.deniedChanged[0].clarity=[1,0,2];c.deniedChanged[0].truth=[false,false,false];
 c.noCue.forEach(f=>f.cue='absent');c.otherCue.forEach(f=>f.cue='other');c.noQueries.forEach(f=>{if(f.at<6)f.cue='absent';});c.empty[0].clarity=[0,0,0];return c;}
