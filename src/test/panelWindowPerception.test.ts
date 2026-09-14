import {it,expect} from 'vitest';
import {advancePanelWindow as advance,type PanelWindow,type PanelWindowInput} from '../campaign3/panelWindowPerception';
import {emptyPerceptualEventFileState as empty} from '../semanticBinding/perceptualEventFiles';
import {createTrialPanelPerception,consumeTrialPanelAndVisual,trialPanelPerceptionSnapshot,type VisualEventDetection} from '../campaign3/trialPanelPerception';
const observer='observer/a',initial=()=>({files:empty(),window:{at:0n} as PanelWindow});
function panel(i:number,stage:'Before'|'Motion'|'After'|'Unavailable',glyph=0):PanelWindowInput{return {observer,observation:BigInt(i*10),...(stage==='Unavailable'?{}:{detection:BigInt(i*10+1)}),sample:stage==='Unavailable'?{kind:'Unavailable',at:BigInt(i)}:{kind:'Present',at:BigInt(i),glyph,stage}};}
const visual=(i:number):VisualEventDetection=>({observer,at:BigInt(i),observation:BigInt(i*10+2),detection:BigInt(i*10+1)});
const sequence=[panel(1,'Before'),panel(2,'Motion'),panel(3,'Motion',1),panel(4,'After',1),panel(5,'Before'),panel(6,'Unavailable'),panel(7,'Unavailable')];
function run(n:number){let s=initial();for(let i=0;i<n;i++)s=advance(observer,s.files,s.window,sequence[i],visual(i+1));return s;}
it('PW-A: actual event transitions/ends match the history-bearing control',()=>{
 const control=createTrialPanelPerception(observer);let s=initial();
 for(let i=0;i<sequence.length;i++){const r=advance(observer,s.files,s.window,sequence[i],visual(i+1));expect(r.result).toEqual(consumeTrialPanelAndVisual(control,sequence[i],visual(i+1)));expect(r.files).toEqual(trialPanelPerceptionSnapshot(control).files);s=r;}
 for(const first of ['Before','Motion','After','Unavailable'] as const)for(const second of ['Before','Motion','After','Unavailable'] as const)for(const glyph of [0,1]){const t=createTrialPanelPerception(observer);let s=initial();for(const p of [panel(1,first),panel(2,second,glyph)]){const r=advance(observer,s.files,s.window,p);expect(r.result).toEqual(consumeTrialPanelAndVisual(t,p,undefined));s=r;}}
});
it('PW-B: every prefix reconstructs from SEM and window only, with no candidate alias',()=>{
 const expected=run(sequence.length);for(let n=0;n<=sequence.length;n++){let s=structuredClone(run(n));for(let i=n;i<sequence.length;i++)s=advance(observer,s.files,s.window,sequence[i],visual(i+1));expect(s.files).toEqual(expected.files);expect(s.window).toEqual(expected.window);}
 const s=run(1),before=structuredClone(s),r=advance(observer,s.files,s.window,sequence[1]);r.result.context!.observerId; (r.result.context as {observerId:string}).observerId='changed';expect(s).toEqual(before);expect(r.window.active!.context.observerId).toBe(observer);
});
it('PW-C: unsampled active context cannot be closed; actual absence can close it',()=>{
 const s=run(1),prior=structuredClone(s);expect(()=>advance(observer,s.files,s.window,undefined,visual(2))).toThrow('UNSAMPLED_ACTIVE_CONTEXT');expect(s).toEqual(prior);
 const r=advance(observer,s.files,s.window,panel(2,'Unavailable'),visual(2));expect(r.result.ends).toHaveLength(2);expect(r.window.active).toBeUndefined();expect(r.result.visualEventTransition!.perceptualEventReferentId.observerEventSequence).toBe(1n);
 for(const p of [{...sequence[1],observer:'observer/b'},panel(1,'Motion')]){expect(()=>advance(observer,s.files,s.window,p)).toThrow();expect(s).toEqual(prior);}
});
it('PW-D: malformed/foreign/inactive windows and executable fields reject before access',()=>{
 const s=run(1);for(const w of [{at:1n},{...s.window,at:0n},{...s.window,active:{glyph:8,context:s.window.active!.context}},{...s.window,active:{glyph:0,context:{observerId:'observer/b',observerEventSequence:0n}}}])expect(()=>advance(observer,s.files,w,sequence[1])).toThrow();
 let reads=0;const w={at:1n,active:{get glyph(){reads++;return 0;},context:s.window.active!.context}};expect(()=>advance(observer,s.files,w,sequence[1])).toThrow();expect(reads).toBe(0);
 const p={...sequence[1],sample:{get kind(){reads++;return 'Unavailable' as const;},at:2n}};expect(()=>advance(observer,s.files,s.window,p)).toThrow();expect(reads).toBe(0);
 for(const active of [false,null,0])expect(()=>advance(observer,empty(),{at:0n,active} as unknown as PanelWindow,sequence[0])).toThrow();
});
it('PW-E: separate numeric identity payloads and at most26 actual allocated event files',()=>{
 let s=initial();for(let i=1;i<=26;i++){const n=BigInt(i);s=advance(observer,s.files,s.window,undefined,{observer,at:n,observation:n,detection:n});}
 expect(s.files.nextEventSequenceByObserver.get(observer)).toBe(26n);const prior=structuredClone(s);expect(()=>advance(observer,s.files,s.window,undefined,{observer,at:27n,observation:27n,detection:27n})).toThrow('FILE_BOUND');expect(s).toEqual(prior);
});
