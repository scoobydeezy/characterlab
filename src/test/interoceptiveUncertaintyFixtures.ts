import type {Frame} from '../campaign3/interoceptiveUncertainty';
export function uncertaintyFrames(width=200,bias=0,actual=550):Frame[]{return Array.from({length:4},(_,i)=>({at:i+1,actual,bias,width,available:i===0||i===2}));}
export function uncertaintyCases(){
 const cases={narrow:uncertaintyFrames(),wide:uncertaintyFrames(600),biased:uncertaintyFrames(200,400),hidden:uncertaintyFrames(200,0,580),point:uncertaintyFrames(0,0,500),neutral:uncertaintyFrames(200,0,900),absent:uncertaintyFrames(),deniedChanged:uncertaintyFrames(600,400,100),duplicate:uncertaintyFrames(),corrected:uncertaintyFrames(200,400)};
 cases.absent.forEach(f=>f.available=false);cases.deniedChanged.forEach(f=>f.available=false);cases.duplicate.forEach(f=>f.available=true);cases.corrected[2].bias=0;return cases;
}
