import type {dispositionResolution} from './dispositionResolution';
type Resolution=ReturnType<typeof dispositionResolution>;
const integer=(value:string)=>{
 if(typeof value!=='string'||! /^-?(0|[1-9]\d*)$/.test(value)||value==='-0')throw Error('Canonical score integer required');
 return BigInt(value);
};
/** A matrix of recorded score components, not a latent character-state matrix. */
export function dispositionScoreMatrix(resolution:Resolution){
 if(resolution.version!=='disposition-resolution-inspection/0.1'||resolution.draws.length>2)throw Error('Unqualified score matrix input');
 const seen=new Set<string>();
 const rows=resolution.draws.map(draw=>{
  const key=JSON.parse(draw.key),direction=key['Direction [4]'];
  if(key.record!=='ReasonNucleusKey#404/1'||!['1','2'].includes(direction)||JSON.stringify(key['CandidateKey [1]'])!==draw.candidate||seen.has(draw.key))throw Error('Score matrix nucleus identity mismatch');
  seen.add(draw.key);
  const sign=direction==='1'?1n:-1n,face=integer(draw.face),die=integer(draw.die);
  if(face<1n||face>die)throw Error('Score matrix face outside die');
  const values=[face,integer(draw.standing),integer(draw.situational)].map(v=>v*sign);
  const total=values.reduce((a,b)=>a+b,0n);
  if(total!==integer(draw.contribution))throw Error('Score matrix contribution mismatch');
  return {nucleus:draw.nucleus,key:draw.key,candidate:draw.candidate,direction,
   values:values.map(String),total:String(total)};
 });
 const mode=resolution.emitted?resolution.mode:null;
 if((!resolution.emitted||mode==='Auto')&&rows.length)throw Error('Unrolled resolution has score rows');
 if(resolution.emitted&&(!['Auto','QuietRoll','PlayerFacingRoll'].includes(mode!)||mode!=='Auto'&&!rows.length))throw Error('Score matrix resolution mode mismatch');
 const maximum=rows.flatMap(row=>row.values).map(integer).reduce((m,v)=>{const a=v<0n?-v:v;return a>m?a:m;},0n);
 return {version:'disposition-score-matrix/0.1',reasonEvent:resolution.reasonEvent,decisionEvent:resolution.decisionEvent,
  instant:resolution.instant,mode,availability:!resolution.emitted?'no emitted resolution':mode==='Auto'?'automatic resolution without draws':'recorded draws',
  columns:['Signed face','Signed standing modifier','Signed situational modifier'],
  rows:rows.map(row=>({...row,cells:row.values.map(exact=>({exact,
   normalized:maximum===0n?0:Number(integer(exact)*10000n/maximum)/10000}))})),
  scaleMaximum:String(maximum),
  scope:'Rows are recorded reason nuclei; columns are signed score components. Each row sums exactly to its recorded contribution. Color coordinates truncate toward zero at 1/10000 of the event-local absolute maximum; exact integers are authoritative. This is decision-score arithmetic, not latent character state, a personality embedding, subjective uncertainty or a complete explanation of the chosen option. Automatic or absent resolutions have no sampled score rows; absence is not zero. Compare separate events using exact values because color scales can differ.'};
}
