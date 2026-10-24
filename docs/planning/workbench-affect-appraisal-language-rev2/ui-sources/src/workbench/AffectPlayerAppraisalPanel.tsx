import {useState} from 'react';
import type {AffectExplanation} from './affectExplanations';
import {affectPlayerAppraisalContribution,affectPreviewRecipient,AFFECT_PLAYER_APPRAISAL_POLICY} from './affectPlayerAppraisalContribution';
import {affectReasonSources} from './affectReasonSources';
export function AffectPlayerAppraisalPanel({card}:{card:AffectExplanation}){
 const [inspect,setInspect]=useState(false);
 try{const report=affectPlayerAppraisalContribution(card,affectPreviewRecipient(),AFFECT_PLAYER_APPRAISAL_POLICY),source=inspect?affectReasonSources(card):null;
  return <details><summary>How my appraisal contributes</summary><section aria-label="AFFECT appraisal contribution preview"><h4>Player-readable preview: appraisal contribution</h4><p>{report.scope}</p>{report.components.length?<ul>{report.components.map(c=><li key={c.nucleus}>{c.human}</li>)}</ul>:<p>No admitted positive appraisal contribution sentence is available.</p>}<details><summary>Appraisal contribution semantics</summary><pre className="exact" data-affect-player-appraisal>{JSON.stringify(report,null,2)}</pre></details></section><section aria-label="AFFECT appraisal preview researcher sources"><p>Researcher source inspection is outside the player preview. Effective support, bounded net and rounded modifier remain distinct.</p><button type="button" onClick={()=>setInspect(!inspect)}>{inspect?'Hide':'Inspect'} appraisal contribution sources</button>{source&&<pre className="exact" data-affect-player-appraisal-sources>{JSON.stringify({rows:source.rows.filter(r=>r.role==='situational'),nuclei:source.nuclei.filter(n=>report.components.some(c=>c.nucleus===n.index))},null,2)}</pre>}</section></details>;
 }catch(error){return <p role="alert">Appraisal contribution preview withheld: {String(error)}</p>;}
}
