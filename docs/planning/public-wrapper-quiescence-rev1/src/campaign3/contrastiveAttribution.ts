/** contrastive-attribution-component/0.1-candidate; no public admission or writes. */
import {ExactRational as Q} from '../substrate/exactMath';
export type AttributionPoint=readonly [number,number];
export interface AttributionInterval {readonly lower:Q;readonly upper:Q}
export interface AttributionTrial {
 readonly motion:readonly [AttributionPoint,AttributionPoint]|null;
 readonly before:AttributionInterval|null;
 readonly after:AttributionInterval|null;
}
export type ContrastiveAttribution={readonly kind:'Supported'|'Unavailable'};
const zero=Object.freeze(Q.of(0n)),max=Object.freeze(Q.of(100n));
function dense(a:unknown,n:number):a is unknown[]{
 return Array.isArray(a)&&a.length===n&&Array.from({length:n},(_,i)=>Object.hasOwn(a,i)).every(Boolean);
}
function interval(v:AttributionInterval|null){
 if(v===null)return;
 if(!v||!(v.lower instanceof Q)||!(v.upper instanceof Q)||v.lower.compare(zero)<0||v.lower.compare(v.upper)>0||v.upper.compare(max)>0)throw Error('invalid attribution interval');
}
function motion(v:AttributionTrial['motion']):'stroke'|'stationary'|'other'|'missing'{
 if(v===null)return 'missing';
 if(!dense(v,2)||!v.every(p=>dense(p,2)&&p.every(x=>typeof x==='number'&&Number.isInteger(x)&&x>=0&&x<=7)))throw Error('invalid attribution motion');
 const [a,b]=v;
 if(a[0]!==0||a[1]!==0||b[1]!==0)return 'other';
 return b[0]===1?'stroke':b[0]===0?'stationary':'other';
}
/** Domain checking alone: no attribution verdict or evidence-consumption claim. */
export function validateAttributionTrials(trials:readonly AttributionTrial[]):void{
 if(!dense(trials,4))throw Error('four dense attribution trials required');
 for(const t of trials){
  if(!t||typeof t!=='object')throw Error('invalid attribution trial');
  interval(t.before);interval(t.after);
  if(t.motion!==null&&(!dense(t.motion,2)||!t.motion.every(p=>dense(p,2)&&p.every(x=>typeof x==='number'&&Number.isInteger(x)&&x>=0&&x<=7))))throw Error('invalid attribution motion');
 }
}
export function assessContrastiveAttribution(trials:readonly AttributionTrial[]):ContrastiveAttribution{
 validateAttributionTrials(trials);
 const rows=trials.map(t=>({trial:t,movement:motion(t.motion)}));
 const unavailable=():ContrastiveAttribution=>Object.freeze({kind:'Unavailable'});
 if(rows.some(r=>!r.trial.before||!r.trial.after||!['stroke','stationary'].includes(r.movement)))return unavailable();
 const baseline=trials[0].before!;
 if(trials.some(t=>!t.before!.lower.equals(baseline.lower)||!t.before!.upper.equals(baseline.upper)))return unavailable();
 const strokes=rows.filter(r=>r.movement==='stroke'),controls=rows.filter(r=>r.movement==='stationary');
 if(strokes.length!==2||controls.length!==2)return unavailable();
 const lowers=strokes.map(r=>r.trial.after!.lower.subtract(r.trial.before!.upper));
 const uppers=controls.map(r=>r.trial.after!.upper.subtract(r.trial.before!.lower));
 return Object.freeze({kind:lowers.every(l=>l.compare(zero)>0&&uppers.every(u=>l.compare(u)>0))?'Supported':'Unavailable'});
}
