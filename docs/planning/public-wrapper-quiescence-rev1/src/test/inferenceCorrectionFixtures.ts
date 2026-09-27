import {original,ordered,seed,initialState} from './agencyFixtures';
export {ordered,seed,initialState};
export function correctionCases(){
 const attempt=original(1,1,1,{competent:false,blocker:0,obstruction:[]});
 const claim=(at:number,receipt:number,positive:boolean,recipients=[2],episode=1)=>original(at,2,episode,{receipt,positive,recipients});
 const probe=(at:number)=>original(at,3);
 const main=[attempt,claim(2,1,true),probe(3),claim(4,2,false),probe(5),claim(6,3,false),probe(7)];
 return {
  main,
  duplicate:[attempt,claim(2,1,true),probe(3),claim(4,2,false),probe(5),claim(6,2,false),probe(7)],
  noCorrection:[attempt,claim(2,1,true),probe(3),probe(4),probe(5),probe(6),probe(7)],
  wrongEpisode:[attempt,claim(2,1,true),original(3,1,2,{competent:false,blocker:0,obstruction:[]}),claim(4,2,false,[2],2),probe(5),claim(6,3,false,[2],2),probe(7)],
  denied:[attempt,claim(2,1,true),probe(3),claim(4,2,false,[1]),probe(5),claim(6,3,false,[1]),probe(7)],
  hiddenBlock:[original(1,1,1,{competent:false,blocker:1,obstruction:[]}),...main.slice(1)],
  swapped:[attempt,claim(2,1,true,[1]),probe(3),claim(4,2,false,[1]),probe(5),claim(6,3,false,[1]),probe(7)],
  noInitialClaim:[attempt,probe(2),probe(3),claim(4,2,false),probe(5),claim(6,3,false),probe(7)],
  reordered:[attempt,claim(2,2,false),probe(3),claim(4,3,false),probe(5),claim(6,1,true),probe(7)],
 };
}
