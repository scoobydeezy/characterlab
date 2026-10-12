import {lazy, Suspense, useState} from 'react';
import './workbench.css';
import './experimentSelector.css';
import {EXPERIMENTS, type ExperimentId} from './experimentRegistry';
const Values = lazy(() => import('./Workbench').then(m => ({default: m.Workbench})));
const Reason = lazy(() => import('./ReasonWorkbench').then(m => ({default: m.ReasonWorkbench})));
const Batch = lazy(() => import('./BatchWorkbench').then(m => ({default: m.BatchWorkbench})));
const Epi = lazy(() => import('./EpiWorkbench').then(m => ({default: m.EpiWorkbench})));
const Learn = lazy(() => import('./LearnWorkbench').then(m => ({default: m.LearnWorkbench})));
const Belief = lazy(() => import('./BeliefWorkbench').then(m => ({default: m.BeliefWorkbench})));
const Affect = lazy(() => import('./AffectWorkbench').then(m => ({default: m.AffectWorkbench})));
const Decision = lazy(() => import('./DecisionWorkbench').then(m => ({default: m.DecisionWorkbench})));
const Commit = lazy(() => import('./CommitWorkbench').then(m => ({default: m.CommitWorkbench})));
const General = lazy(() => import('./GeneralWorkbench').then(m => ({default: m.GeneralWorkbench})));
export function WorkbenchApp() {
  const [experiment, setExperiment] = useState<ExperimentId | 'batch' | 'decision' | 'commit'>('values');
  const [visited, setVisited] = useState<Set<string>>(() => new Set(['values']));
  return <><div className="experiment-selector"><label>Inspection experiment<select value={experiment} onChange={e => {const next = e.target.value as typeof experiment; setExperiment(next); setVisited(prior => new Set([...prior, next]));}}>{EXPERIMENTS.map(e => <option key={e.id} value={e.id}>{e.label}</option>)}<option value="decision">DECISION · choice and consequence</option><option value="commit">COMMIT · lifecycle and knowledge</option><option value="batch">Batch execution</option></select></label><p>Switching views preserves each session and requests a pause at the next committed boundary. Export checkpoints or reports before closing this tab.</p></div>
    <div hidden={experiment !== 'values'}><Suspense fallback={<p role="status">Loading Values…</p>}><Values active={experiment === 'values'}/></Suspense></div>
    {visited.has('reason') && <div hidden={experiment !== 'reason'}><Suspense fallback={<p role="status">Loading REASON…</p>}><Reason active={experiment === 'reason'}/></Suspense></div>}
    {visited.has('batch') && <div hidden={experiment !== 'batch'}><Suspense fallback={<p role="status">Loading batch tools…</p>}><Batch active={experiment === 'batch'}/></Suspense></div>}
    {visited.has('general') && <div hidden={experiment !== 'general'}><Suspense fallback={<p role="status">Loading graph inspection…</p>}><General active={experiment === 'general'}/></Suspense></div>}
    {visited.has('epi') && <div hidden={experiment !== 'epi'}><Suspense fallback={<p role="status">Loading EPI…</p>}><Epi active={experiment === 'epi'}/></Suspense></div>}
    {visited.has('learn') && <div hidden={experiment !== 'learn'}><Suspense fallback={<p role="status">Loading LEARN…</p>}><Learn active={experiment === 'learn'}/></Suspense></div>}
    {visited.has('belief') && <div hidden={experiment !== 'belief'}><Suspense fallback={<p role="status">Loading BELIEF…</p>}><Belief active={experiment === 'belief'}/></Suspense></div>}
    {visited.has('affect') && <div hidden={experiment !== 'affect'}><Suspense fallback={<p role="status">Loading AFFECT…</p>}><Affect active={experiment === 'affect'}/></Suspense></div>}
    {visited.has('decision') && <div hidden={experiment !== 'decision'}><Suspense fallback={<p role="status">Loading DECISION…</p>}><Decision active={experiment === 'decision'}/></Suspense></div>}
    {visited.has('commit') && <div hidden={experiment !== 'commit'}><Suspense fallback={<p role="status">Loading COMMIT…</p>}><Commit active={experiment === 'commit'}/></Suspense></div>}
  </>;
}
