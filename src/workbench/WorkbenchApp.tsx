import {lazy, Suspense, useState} from 'react';
import './workbench.css';
import './experimentSelector.css';
const Values = lazy(() => import('./Workbench').then(m => ({default: m.Workbench})));
const Reason = lazy(() => import('./ReasonWorkbench').then(m => ({default: m.ReasonWorkbench})));
export function WorkbenchApp() {
  const [experiment, setExperiment] = useState('Values integration');
  return <><div className="experiment-selector"><label>Inspection experiment<select value={experiment} onChange={e => setExperiment(e.target.value)}><option>Values integration</option><option>Joined reasoning</option></select></label><p>Switching experiments starts a new browser session for that experiment. Preserve a checkpoint first.</p></div><Suspense fallback={<p role="status">Loading experiment…</p>}>{experiment === 'Values integration' ? <Values/> : <Reason/>}</Suspense></>;
}
