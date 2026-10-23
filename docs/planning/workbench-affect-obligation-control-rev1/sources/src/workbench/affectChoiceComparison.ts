import type {AffectExplanation} from './affectExplanations';
function choices(cards:readonly AffectExplanation[]){
 const rows=new Map<string,{present:boolean;chosen:unknown;provenance:string}>();
 for(const card of cards){if(card.kind!=='Decision')continue;const d=JSON.parse(card.provenance);
  if(card.renderer!=='affect-evaluation-explanation/0.1'||d?.record!=='AffectDecision#757/1'||d['At [2]']!==card.at||!/^\d+$/.test(card.at))throw Error('Unsupported AFFECT choice record');
  if(rows.has(card.at))throw Error('Ambiguous AFFECT decision instant');
  rows.set(card.at,{present:Object.hasOwn(d,'Chosen [8]'),chosen:d['Chosen [8]']??null,provenance:card.provenance});
 }return rows;
}
export function compareAffectChoices(aCards:readonly AffectExplanation[],bCards:readonly AffectExplanation[]){
 const a=choices(aCards),b=choices(bCards),times=[...new Set([...a.keys(),...b.keys()])].sort((x,y)=>BigInt(x)<BigInt(y)?-1:BigInt(x)>BigInt(y)?1:0);
 const rows=times.map(at=>{const av=a.get(at)??null,bv=b.get(at)??null;return{at,a:av,b:bv,chosenEqual:av&&bv?av.present===bv.present&&JSON.stringify(av.chosen)===JSON.stringify(bv.chosen):null};});
 return {version:'affect-choice-comparison/0.1',rows,firstDifferentChoice:rows.find(r=>r.chosenEqual===false)?.at??null,scope:'Recorded selected-option equality by decision instant. Missing decision is not a no-choice outcome. A choice difference does not establish execution success, psychological significance or causal necessity.'};
}
