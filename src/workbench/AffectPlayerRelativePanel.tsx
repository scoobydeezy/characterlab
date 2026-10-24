import type {AffectExplanation} from './affectExplanations';
import {affectPlayerRelativeReasons,affectPreviewRecipient,AFFECT_PLAYER_RELATIVE_POLICY} from './affectPlayerRelativeReasons';
export function AffectPlayerRelativePanel({card}:{card:AffectExplanation}){
 try{const report=affectPlayerRelativeReasons(card,affectPreviewRecipient(),AFFECT_PLAYER_RELATIVE_POLICY);
  return <details><summary>Compare the pull of my goal reasons</summary><section aria-label="AFFECT relative goal preview"><h4>Player-readable preview: relative goal pull</h4><p>{report.scope}</p>{report.reasons.length?<ul>{report.reasons.map(r=><li key={r.nucleus}>{r.human}</li>)}</ul>:<p>No admitted reason is available for comparison.</p>}<details><summary>Relative preview semantics</summary><pre className="exact" data-affect-player-relative>{JSON.stringify(report,null,2)}</pre></details></section><p>Researcher note: this is a separate versioned presentation. The existing reason-source controls identify the same nuclei. Absolute strength and certainty language remain unqualified.</p></details>;
 }catch(error){return <p role="alert">Relative goal preview withheld: {String(error)}</p>;}
}
