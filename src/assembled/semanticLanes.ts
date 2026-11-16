/** The two accepted SEM lanes share execution and owners; this is source/phase grammar. */
import {list,text,unsigned as u,type CanonicalValue} from '../substrate/canonicalEncoding';
import {dataItems as items,invalidModel} from '../campaign2/canonicalData';
import {recognitionSource,type RecognitionSettings} from './recognition';
import {socialSetting} from './social';
import {roleChannel} from './encoding';
import {sid} from './skill';
export const ROLE_STAGES_VERSION='assembled-character-semantic-role-stages/0.1-candidate',SEM_CAUSAL=sid(1001,'event/assembled-semantic-causal-roles');
export const LANES_VERSION='assembled-character-semantic-lanes/0.1-candidate';
export const CURRENT_SEM_SOURCE=sid(1001,'event/assembled-current-semantic-source');
export const currentPhase=(phase:bigint)=>new Map([[120n,10n],[121n,11n],[122n,12n],[123n,13n],[124n,14n],[125n,15n],[126n,20n],[127n,21n]]).get(phase)??phase;
export const consequencePhase=(phase:bigint)=>new Map([[11n,121n],[12n,122n],[13n,123n],[15n,125n],[20n,126n],[21n,127n]]).get(phase)??phase;
export function currentSource(v:CanonicalValue,settings:RecognitionSettings){
 const a=items(v,'list');if(a.length!==7||!settings.twoLanes)invalidModel('current semantic source version/grammar');
 const x=recognitionSource(list(a.slice(0,6)),settings),s=socialSetting(x.social);
 if(s.claim!==undefined||s.receipt!==0n||s.trial)invalidModel('current semantic source is sensory, not report learning');
 return {...x,s,role:roleChannel(a[6],!!settings.multiUnit,!!settings.sharedBindings)};
}
export function currentProjection(v:CanonicalValue,settings:RecognitionSettings){
 const x=currentSource(v,settings),s=x.s,visible=s.access;
 return list([u(visible?s.kind:1n),u(0),list([]),list(visible?[s.physical]:[]),list([
 visible?x.lifecycle!:list([false,false,false,false]),visible?x.appearance!:list([list([]),list([])]),
 list(visible?x.signals.map(s=>list([text(s.template),s.support])):[]),u(visible?x.role.observed:0n),
 list(visible?x.role.additional.filter(r=>r.permitted).map(r=>list([u(r.observed),r.sameFocal])):[]),
 list(visible?x.symbols.map(s=>list([text(s.symbol),s.support])):[])])]);
}
