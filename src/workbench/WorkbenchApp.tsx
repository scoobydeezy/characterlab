import {lazy, Suspense, useState} from 'react';
import './workbench.css';
import './experimentSelector.css';
import {EXPERIMENTS, type ExperimentId} from './experimentRegistry';
const Values = lazy(() => import('./Workbench').then(m => ({default: m.Workbench})));
const Reason = lazy(() => import('./ReasonWorkbench').then(m => ({default: m.ReasonWorkbench})));
const Batch = lazy(() => import('./BatchWorkbench').then(m => ({default: m.BatchWorkbench})));
export function WorkbenchApp() {
  const [experiment, setExperiment] = useState<ExperimentId | 'batch'>('values');
  const [visited, setVisited] = useState<Set<string>>(() => new Set(['values']));
  return <><div className="experiment-selector"><label>Inspection experiment<select value={experiment} onChange={e => {const next = e.target.value as typeof experiment; setExperiment(next); setVisited(prior => new Set([...prior, next]));}}>{EXPERIMENTS.map(e => <option key={e.id} value={e.id}>{e.label}</option>)}<option value="batch">Batch execution</option></select></label><p>Switching views preserves each session and requests a pause at the next committed boundary. Export checkpoints or reports before closing this tab.</p></div>
    <div hidden={experiment !== 'values'}><Suspense fallback={<p role="status">Loading Values…</p>}><Values active={experiment === 'values'}/></Suspense></div>
    {visited.has('reason') && <div hidden={experiment !== 'reason'}><Suspense fallback={<p role="status">Loading REASON…</p>}><Reason active={experiment === 'reason'}/></Suspense></div>}
    {visited.has('batch') && <div hidden={experiment !== 'batch'}><Suspense fallback={<p role="status">Loading batch tools…</p>}><Batch active={experiment === 'batch'}/></Suspense></div>}
  </>;
}
