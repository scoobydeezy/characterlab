import {lazy, Suspense, useState} from 'react';
import './workbench.css';
import './experimentSelector.css';
import {INSPECTION_EXPERIMENTS as EXPERIMENTS, type InspectionExperimentId as ExperimentId} from './inspectionRegistry';
const Values = lazy(() => import('./Workbench').then(m => ({default: m.Workbench})));
const Reason = lazy(() => import('./ReasonWorkbench').then(m => ({default: m.ReasonWorkbench})));
const Batch = lazy(() => import('./BatchWorkbench').then(m => ({default: m.BatchWorkbench})));
const Epi = lazy(() => import('./EpiWorkbench').then(m => ({default: m.EpiWorkbench})));
const Learn = lazy(() => import('./LearnWorkbench').then(m => ({default: m.LearnWorkbench})));
const Belief = lazy(() => import('./BeliefWorkbench').then(m => ({default: m.BeliefWorkbench})));
const Affect = lazy(() => import('./AffectWorkbench').then(m => ({default: m.AffectWorkbench})));
const Decision = lazy(() => import('./DecisionWorkbench').then(m => ({default: m.DecisionWorkbench})));
const Commit = lazy(() => import('./CommitWorkbench').then(m => ({default: m.CommitWorkbench})));
const Work = lazy(() => import('./WorkWorkbench').then(m => ({default: m.WorkWorkbench})));
const Skill = lazy(() => import('./SkillWorkbench').then(m => ({default:m.SkillWorkbench})));
const Habit = lazy(() => import('./HabitWorkbench').then(m => ({default:m.HabitWorkbench})));
const General = lazy(() => import('./GeneralWorkbench').then(m => ({default: m.GeneralWorkbench})));
const Social = lazy(() => import('./SocialWorkbench').then(m => ({default:m.SocialWorkbench})));
const Relationship = lazy(() => import('./RelationshipWorkbench').then(m => ({default:m.RelationshipWorkbench})));
const Multisource = lazy(() => import('./MultisourceWorkbench').then(m => ({default:m.MultisourceWorkbench})));
const Adapt = lazy(() => import('./AdaptWorkbench').then(m => ({default:m.AdaptWorkbench})));
const Det = lazy(() => import('./DetWorkbench').then(m => ({default:m.DetWorkbench})));
const Sem = lazy(() => import('./SemWorkbench').then(m => ({default:m.SemWorkbench})));
const Bio = lazy(() => import('./BioWorkbench').then(m => ({default:m.BioWorkbench})));
const Body = lazy(() => import('./BodyWorkbench').then(m => ({default:m.BodyWorkbench})));
const Long = lazy(() => import('./LongWorkbench').then(m => ({default:m.LongWorkbench})));
const LongGoal = lazy(() => import('./LongGoalWorkbench').then(m => ({default:m.LongGoalWorkbench})));
const LongHabit = lazy(() => import('./LongHabitWorkbench').then(m => ({default:m.LongHabitWorkbench})));
const LongLoss = lazy(() => import('./LongLossWorkbench').then(m => ({default:m.LongLossWorkbench})));
const LongRoutine = lazy(() => import('./LongRoutineWorkbench').then(m => ({default:m.LongRoutineWorkbench})));
export function WorkbenchApp() {
  const [experiment, setExperiment] = useState<ExperimentId | 'batch'>('values');
  const [visited, setVisited] = useState<Set<string>>(() => new Set(['values']));
  return <><div className="experiment-selector"><label>Inspection experiment<select value={experiment} onChange={e => {const next = e.target.value as typeof experiment; setExperiment(next); setVisited(prior => new Set([...prior, next]));}}>{EXPERIMENTS.map(e => <option key={e.id} value={e.id}>{e.label}</option>)}<option value="batch">Batch execution</option></select></label><p>Switching views preserves each session and requests a pause at the next committed boundary. Export checkpoints or reports before closing this tab.</p></div>
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
    {visited.has('work') && <div hidden={experiment !== 'work'}><Suspense fallback={<p role="status">Loading WORK…</p>}><Work active={experiment === 'work'}/></Suspense></div>}
    {visited.has('skill') && <div hidden={experiment !== 'skill'}><Suspense fallback={<p role="status">Loading SKILL…</p>}><Skill active={experiment === 'skill'}/></Suspense></div>}
    {visited.has('habit') && <div hidden={experiment !== 'habit'}><Suspense fallback={<p role="status">Loading HABIT…</p>}><Habit active={experiment === 'habit'}/></Suspense></div>}
    {visited.has('social') && <div hidden={experiment !== 'social'}><Suspense fallback={<p role="status">Loading SOCIAL…</p>}><Social active={experiment === 'social'}/></Suspense></div>}
    {visited.has('relationship') && <div hidden={experiment !== 'relationship'}><Suspense fallback={<p role="status">Loading RELATIONSHIP…</p>}><Relationship active={experiment === 'relationship'}/></Suspense></div>}
    {visited.has('multisource') && <div hidden={experiment !== 'multisource'}><Suspense fallback={<p role="status">Loading MULTISOURCE…</p>}><Multisource active={experiment === 'multisource'}/></Suspense></div>}
    {visited.has('adapt') && <div hidden={experiment !== 'adapt'}><Suspense fallback={<p role="status">Loading ADAPT…</p>}><Adapt active={experiment === 'adapt'}/></Suspense></div>}
    {visited.has('det') && <div hidden={experiment !== 'det'}><Suspense fallback={<p role="status">Loading DET…</p>}><Det active={experiment === 'det'}/></Suspense></div>}
    {visited.has('sem') && <div hidden={experiment !== 'sem'}><Suspense fallback={<p role="status">Loading SEM…</p>}><Sem active={experiment === 'sem'}/></Suspense></div>}
    {visited.has('bio') && <div hidden={experiment !== 'bio'}><Suspense fallback={<p role="status">Loading BIO…</p>}><Bio active={experiment === 'bio'}/></Suspense></div>}
    {visited.has('body') && <div hidden={experiment !== 'body'}><Suspense fallback={<p role="status">Loading BODY…</p>}><Body active={experiment === 'body'}/></Suspense></div>}
    {visited.has('long') && <div hidden={experiment !== 'long'}><Suspense fallback={<p role="status">Loading LONG…</p>}><Long active={experiment === 'long'}/></Suspense></div>}
    {visited.has('long-goal') && <div hidden={experiment !== 'long-goal'}><Suspense fallback={<p role="status">Loading LONG goal…</p>}><LongGoal active={experiment === 'long-goal'}/></Suspense></div>}
    {visited.has('long-habit') && <div hidden={experiment !== 'long-habit'}><Suspense fallback={<p role="status">Loading LONG habit…</p>}><LongHabit active={experiment === 'long-habit'}/></Suspense></div>}
    {visited.has('long-loss') && <div hidden={experiment !== 'long-loss'}><Suspense fallback={<p role="status">Loading LONG loss…</p>}><LongLoss active={experiment === 'long-loss'}/></Suspense></div>}
    {visited.has('long-routine') && <div hidden={experiment !== 'long-routine'}><Suspense fallback={<p role="status">Loading LONG routine…</p>}><LongRoutine active={experiment === 'long-routine'}/></Suspense></div>}
  </>;
}
