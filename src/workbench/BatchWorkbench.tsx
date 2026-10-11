import {useEffect, useState} from 'react';
import {BATCH_LIMITS, type BatchSnapshot} from './batchSession';
import {BatchWorkerClient} from './batchWorkerClient';
import {EXPERIMENT_REGISTRY_VERSION, EXPERIMENTS, type BatchJob} from './experimentRegistry';
import catalog from './batchCatalog.json';
import valuesFixtures from './valuesFixtures.json';
import reasonFixtures from './reasonFixtures.json';

export function batchReport(snapshot: BatchSnapshot) {
  const jobs = snapshot.results.map(r => r.job);
  return {version: 'workbench-batch-export/0.1', registryVersion: EXPERIMENT_REGISTRY_VERSION,
    catalogVersion: catalog.version, catalogSources: catalog.sources, resourceLimits: BATCH_LIMITS,
    comparisonPolicy: 'Each prefix is compared only with its own exact frozen program/model/seed. No cross-model semantic equivalence or causal necessity is inferred.',
    scope: 'Two admitted public seams; full corpus and language acceptance remain open.',
    originals: {
      values: valuesFixtures.cases.filter(f => jobs.some(j => j.experimentId === 'values' && j.name === f.name)),
      reason: reasonFixtures.cases.filter(f => jobs.some(j => j.experimentId === 'reason' && j.name === f.name)),
    },
    experiments: EXPERIMENTS.filter(e => jobs.some(j => j.experimentId === e.id)), snapshot};
}
export function BatchWorkbench({active = true}: {active?: boolean}) {
  const [preset, setPreset] = useState('coverage-pair'), [session, setSession] = useState<BatchWorkerClient>();
  const [snapshot, setSnapshot] = useState<BatchSnapshot>(), [error, setError] = useState(''), [report, setReport] = useState('');
  useEffect(() => {if (!session) return; setSnapshot(session.snapshot()); return session.subscribe(() => setSnapshot(session.snapshot()));}, [session]);
  useEffect(() => {if (!active) session?.pause(); return () => {session?.pause();};}, [active, session]);
  useEffect(() => () => session?.dispose(), [session]);
  const running = snapshot?.status === 'running';
  function prepare() {
    try {
      const jobs = catalog.jobs.filter(j => preset === 'all' || preset === j.experimentId || preset === 'coverage-pair' && j.experimentId === 'reason' && j.name === 'collective' && [1, 3].includes(Number(j.law)));
      setSession(new BatchWorkerClient(jobs as BatchJob[])); setError(''); setReport('');
    } catch (e) {setError(String(e));}
  }
  const complete = snapshot?.results.filter(r => r.status === 'complete').length ?? 0;
  const prefixes = snapshot?.results.reduce((n, r) => n + r.prefixes.length, 0) ?? 0;
  return <main><header className="topbar">OBSERVABILITY / BATCH EXECUTION</header><div className="page-heading"><div><div className="eyebrow">EXACT PROGRAMS, EXPLICIT COVERAGE</div><h1>Run the retained comparisons.</h1><p>Sequential public execution with exact prefix checks.</p></div></div><div className="content">
    {error && <div className="error" role="alert">{error}</div>}
    <div className="two-columns"><section className="card"><h2>Prepare a bounded batch</h2><label>Frozen cohort<select value={preset} disabled={running} onChange={e => setPreset(e.target.value)}><option value="coverage-pair">Collective coverage comparison · 2 programs</option><option value="values">Values integration · 125 programs</option><option value="reason">Joined REASON · 115 programs</option><option value="all">Both available cohorts · 240 programs</option></select></label><button disabled={running} onClick={prepare}>Prepare fresh batch</button><p className="caption">Uses the exact frozen model, inputs and seed for each program. Preparing a fresh batch replaces the prior in-session summary. Export it first if needed.</p><details><summary>Capabilities and scope</summary>{EXPERIMENTS.filter(e => e.id !== 'general' && e.id !== 'epi').map(e => <div key={e.id}><h3>{e.label}</h3><p>{e.seamVersion} · {e.corpusScope}</p><p>{e.capabilities.committedStep.boundary}</p><p>Runtime intervention: {e.capabilities.runtimeIntervention.reason}</p><p>Matrix: {e.capabilities.matrix.reason}</p><p>Graph: {e.capabilities.graph.reason}</p></div>)}</details></section>
    <section className="card"><h2>{snapshot?.status ?? 'No batch prepared'}</h2><p role="status">{complete}/{snapshot?.results.length ?? 0} programs complete · {prefixes} prefixes checked</p><div className="button-row"><button className="primary" disabled={!session || running || snapshot?.status === 'complete' || snapshot?.status === 'failed'} onClick={() => {setError(''); void session!.run().catch(e => setError(String(e)));}}>Run / resume batch</button><button disabled={!running} onClick={() => session?.pause()}>Pause at committed boundary</button><button disabled={!snapshot || running} onClick={() => {setReport(JSON.stringify(batchReport(snapshot!), null, 2));}}>Prepare summary export</button></div><p className="caption">A dedicated worker executes one run at a time; at most 240 programs and 17 retained prefixes per program. Switching views requests a pause after the current committed instant. Resume continues the same run.</p><p className="caption">Every prefix hash is retained. This summary explicitly omits raw traces; its original inputs and profiles allow replay in the named adapter. A completed row establishes equality to the named frozen save, not psychological validity or full workbench acceptance.</p></section></div>
    {report && <section className="card"><h2>Portable batch summary</h2><button onClick={() => {const url = URL.createObjectURL(new Blob([report], {type: 'application/json'})); const link = document.createElement('a'); link.href = url; link.download = 'characterlab-batch-summary.json'; document.body.append(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);}}>Download summary</button><label>Prepared batch report<textarea aria-label="Prepared batch report" readOnly value={report} rows={6}/></label><button onClick={() => setReport('')}>Close report</button></section>}
    {snapshot && <section className="card"><h2>Per-program receipt</h2><div className="table-scroll"><table><thead><tr><th>Program</th><th>Law / seed</th><th>Status</th><th>Prefix checks</th><th>Exact evidence</th></tr></thead><tbody>{snapshot.results.map(r => <tr key={r.job.id}><td>{r.job.experimentId} / {r.job.name}<small>{r.job.id}</small></td><td>{r.job.law}{r.job.appraisal ? ` / ${r.job.appraisal}` : ''} / {r.job.seed}</td><td>{r.status}{r.error && <p role="alert">{r.error}</p>}</td><td>{r.prefixes.filter(p => p.matchesFrozenSave).length}/{r.job.expectedSaveHashes.length}</td><td><details><summary>Prefix hashes</summary>{r.prefixes.map(p => <div className="hash" key={p.prefix}><span>Prefix {p.prefix} · {p.matchesFrozenSave ? 'Exact match' : 'MISMATCH'}</span><code>{p.saveHash}</code><small>Expected</small><code>{p.expectedSaveHash}</code></div>)}</details></td></tr>)}</tbody></table></div></section>}
  </div></main>;
}
