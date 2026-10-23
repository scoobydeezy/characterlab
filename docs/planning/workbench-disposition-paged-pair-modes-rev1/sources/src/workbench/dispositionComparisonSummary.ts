import {dispositionDivergenceHistory,type DispositionComparisonReport as Report} from './dispositionDivergenceHistory';
export function dispositionComparisonSummary(current:Report,history:readonly Report[]){
 const divergence=dispositionDivergenceHistory([...history,current]);
 if(divergence.latestPrefix!==current.a.prefix)throw Error('Summary current prefix is older than retained history');
 const rows=new Map([...history,current].map(r=>[r.a.prefix,r]));
 const artifact={
  version:'disposition-comparison-summary/0.2',seamVersion:'disposition-public/0.1-candidate',
  contrast:structuredClone(current.contrast),currentPrefix:current.a.prefix,
  branches:{a:structuredClone(current.a),b:structuredClone(current.b)},
  declaredChange:{settings:[...current.changedSettings],inputs:structuredClone(current.inputDifferences),inputHashes:[...current.inputHashes]},
  random:{runSeed:current.runSeed,policy:current.randomPolicy},
  divergence,comparison:structuredClone(current),history:structuredClone([...rows.values()].sort((a,b)=>a.a.prefix-b.a.prefix).map(r=>({prefix:r.a.prefix,a:r.a,b:r.b,stateEqual:r.stateEqual,saveEqual:r.saveEqual,mechanismProjectionEqual:r.mechanismProjectionEqual,changedPaths:r.fields.filter(f=>!f.equal).map(f=>f.path)}))),
  limitations:['Researcher diagnostics only; not a checkpoint or standalone save authenticator.','Full field values are included for the current comparison only; historical rows retain exact identities, equality results and changed paths.','Exact state and mechanism differences do not establish meaningful character divergence or causal necessity.','Retained history may omit prefixes; missing observations are not equality.','No character/player disclosure or complete integrated-entry qualification is implied.'],
 };
 const first=(v:typeof divergence.firstStateDifference)=>v?`${v.prefix} (${v.earliestProven?'earliest proven within retained prefix coverage':'earlier observations missing'})`:'none observed';
 const text=[
  'CharacterLab — DISPOSITION comparison summary',
  `Declared comparison: ${current.contrast.id}`,
  `A: ${current.a.program} | B: ${current.b.program}`,
  `Change: ${current.contrast.changed} (${current.contrast.kind})`,
  `Committed prefix: ${current.a.prefix}`,
  `Observed prefixes: ${divergence.observedPrefixes.join(', ')}`,
  `Missing prefixes: ${divergence.missingPrefixes.join(', ')||'none'}`,
  `First exact state difference: ${first(divergence.firstStateDifference)}`,
  `First mechanism projection difference: ${first(divergence.firstMechanismProjectionDifference)}`,
  ...artifact.limitations,'','Exact report:',JSON.stringify(artifact,null,2),
 ].join('\n');
 if(text.length>8_000_000)throw Error('Comparison summary exceeds explicit 8-million-character limit; no truncated report produced');
 return {artifact,text};
}
