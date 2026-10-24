import {useEffect, useState} from 'react';
import {BATCH_LIMITS, type BatchSnapshot} from './batchSession';
import {BatchWorkerClient} from './batchWorkerClient';
import {EXPERIMENT_REGISTRY_VERSION, EXPERIMENTS, type BatchJob} from './experimentRegistry';
import catalog from './batchCatalogV10.json';
import longCatalog from './longCatalog.json';
import decisionPlan from '../../docs/planning/DECISION_PUBLIC_EXPERIMENT_PLAN_REV1.json';
import skillCatalog from './skillCatalog.json';
import socialCatalog from './socialCatalog.json';
import relationshipCatalog from './relationshipCatalog.json';
import relationshipLegacyCatalog from './relationshipLegacyCatalog.json';
import habitCatalog from './habitCatalog.json';
import workCatalog from './workCatalog.json';
import commitPlan from '../../docs/planning/COMMIT_PUBLIC_EXPERIMENT_PLAN_REV1.json';
import {bytesToHex,canonicalEncode,set} from '../substrate/canonicalEncoding';
import beliefPlan from '../../docs/planning/BELIEF_EXPERIMENT_PLAN_REV1.json';
import affectPlan from '../../docs/planning/AFFECT_PUBLIC_EXPERIMENT_PLAN_REV1.json';
import affectFixtures from './affectFixtures.json';
import affectSupplements from './affectSupplementFixtures.json';
import {PreparedExport} from './PreparedExport';
import {BatchSeed} from './BatchSeed';
import epiPlan from '../../docs/planning/EPI_PUBLIC_EXPERIMENT_PLAN_REV1.json';
import learnPlan from '../../docs/planning/LEARN_PUBLIC_EXPERIMENT_PLAN_REV1.json';
import valuesFixtures from './valuesFixtures.json';
import reasonFixtures from './reasonFixtures.json';

export function batchReport(snapshot: BatchSnapshot) {
  const jobs = snapshot.results.map(r => r.job);
  const affectRows=affectPlan.runs.filter(r=>jobs.some(j=>j.experimentId==='affect'&&j.name===r.name)),supplementRows=affectSupplements.runs.filter(r=>jobs.some(j=>j.experimentId==='affect'&&j.name===r.id));
  return {version: 'workbench-batch-export/0.10', registryVersion: EXPERIMENT_REGISTRY_VERSION,
    catalogVersion: catalog.version, catalogSources: catalog.sources, resourceLimits: BATCH_LIMITS,
    comparisonPolicy: 'Each prefix is compared only with its own exact frozen program/model/seed. No cross-model semantic equivalence or causal necessity is inferred.',
    scope: 'Seventeen admitted execution families; BODY ownership components remain separate; General serves MEM and ATTN without duplicate execution; original LONG source includes three execution probes, not component successors. Legacy RELATIONSHIP failure status retained; supplementary AFFECT rows are execution roles, not additional unique main programs. Full corpus and language acceptance remain open.',
    originals: {
      body:{...catalog.body,programs:catalog.body.programs.filter(p=>jobs.some(j=>j.experimentId==='body'&&j.name===p.name)),models:catalog.body.models.filter(m=>catalog.body.programs.some(p=>p.model===m.name&&jobs.some(j=>j.experimentId==='body'&&j.name===p.name)))},
      multisource:{...catalog.multisource,programs:catalog.multisource.programs.filter(p=>jobs.some(j=>j.experimentId==='multisource'&&j.name===p.name)),models:catalog.multisource.models.filter(m=>catalog.multisource.programs.some(p=>p.model===m.name&&jobs.some(j=>j.experimentId==='multisource'&&j.name===p.name)))},
      general:{versions:catalog.general.versions,programs:catalog.general.programs.filter(p=>jobs.some(j=>j.experimentId==='general'&&j.name===p.name))},
      long:{seedEncoding:'Each program retains its exact 32-byte runSeed; nonzero original seeds use byte31.',programs:longCatalog.programs.filter(r=>jobs.some(j=>j.experimentId==='long'&&j.name===r.name)),models:longCatalog.models.filter(m=>longCatalog.programs.some(r=>r.model===m.name&&jobs.some(j=>j.experimentId==='long'&&j.name===r.name))),sources:longCatalog.sources},
      social:{runSeed:'00'.repeat(32),programs:socialCatalog.programs.filter(r=>jobs.some(j=>j.experimentId==='social'&&j.name===r.name)),models:socialCatalog.models.filter(m=>socialCatalog.programs.some(r=>r.model===m.name&&jobs.some(j=>j.experimentId==='social'&&j.name===r.name))),sources:socialCatalog.sources},
      relationship:{runSeed:'00'.repeat(32),programs:[...relationshipCatalog.programs,...relationshipLegacyCatalog.programs].filter(r=>jobs.some(j=>j.experimentId==='relationship'&&j.name===r.name)),models:[...relationshipCatalog.models,...relationshipLegacyCatalog.models].filter(m=>[...relationshipCatalog.programs,...relationshipLegacyCatalog.programs].some(r=>r.model===m.name&&jobs.some(j=>j.experimentId==='relationship'&&j.name===r.name))),sources:[...relationshipCatalog.sources,...relationshipLegacyCatalog.sources],legacyStatus:'Retained failed0.1 cohort; parity means fidelity, not behavioral success.'},
      habit:{runSeed:'00'.repeat(32),programs:habitCatalog.programs.filter(r=>jobs.some(j=>j.experimentId==='habit'&&j.name===r.name)),models:habitCatalog.models.filter(m=>habitCatalog.programs.some(r=>r.model===m.name&&jobs.some(j=>j.experimentId==='habit'&&j.name===r.name))),sources:habitCatalog.sources},
      skill:{runSeed:'00'.repeat(32),programs:skillCatalog.programs.filter(r=>jobs.some(j=>j.experimentId==='skill'&&j.name===r.name)),models:skillCatalog.models.filter(m=>skillCatalog.programs.some(r=>r.model===m.name&&jobs.some(j=>j.experimentId==='skill'&&j.name===r.name))),sources:skillCatalog.sources},
      work:{seedEncoding:'Byte0 is the declared seed; bytes1..31 are zero',programs:workCatalog.programs.filter(r=>jobs.some(j=>j.experimentId==='work'&&j.name===r.name)),models:workCatalog.models.filter(m=>workCatalog.programs.some(r=>r.model===m.name&&jobs.some(j=>j.experimentId==='work'&&j.name===r.name))),sources:workCatalog.sources},
      decision:{initialState:bytesToHex(canonicalEncode(set([]))),seedEncoding:'Each original seed byte repeated32 times',runs:decisionPlan.runs.filter(r=>jobs.some(j=>j.experimentId==='decision'&&j.name===`${r.law}/${r.name}`)),artifacts:decisionPlan.artifacts},
      commit:{initialState:bytesToHex(canonicalEncode(set([]))),runSeed:'07'.repeat(32),runs:commitPlan.runs.filter(r=>jobs.some(j=>j.experimentId==='commit'&&j.name===`${r.law}/${r.name}`)),artifacts:commitPlan.artifacts},
      belief:{initialState:beliefPlan.initialState,runSeed:beliefPlan.runSeed,modelFreeze:beliefPlan.modelFreeze,modelFreezeSha256:beliefPlan.modelFreezeSha256,runs:beliefPlan.runs.filter(r=>jobs.some(j=>j.experimentId==='belief'&&j.name===r.name))},
      affect:{runs:affectRows,supplementaryRuns:supplementRows,models:affectFixtures.models.filter(m=>[...affectRows,...supplementRows].some(r=>r.model===m.name)),references:[...affectFixtures.references,...affectSupplements.references],identityScope:affectSupplements.identityScope},
      epi: epiPlan.runs.filter(r=>jobs.some(j=>j.experimentId==='epi'&&j.name===r.name&&j.law===r.law&&j.numeric===r.numeric)),
      learn: learnPlan.runs.filter(r=>jobs.some(j=>j.experimentId==='learn'&&j.name===r.name&&j.law===r.law&&j.numeric===r.numeric)),
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
      const jobs = catalog.jobs.filter(j => preset === 'all' || preset === j.experimentId || preset === 'evidence-feedback' && ['belief/misleading-law-1','affect/baseline','affect/interior/candidate-3-feedback-true'].includes(j.id) || preset === 'coverage-pair' && j.experimentId === 'reason' && j.name === 'collective' && [1, 3].includes(Number(j.law)));
      setSession(new BatchWorkerClient(jobs as BatchJob[])); setError(''); setReport('');
    } catch (e) {setError(String(e));}
  }
  const complete = snapshot?.results.filter(r => r.status === 'complete').length ?? 0;
  const prefixes = snapshot?.results.reduce((n, r) => n + r.prefixes.length, 0) ?? 0;
  return <main><header className="topbar">OBSERVABILITY / BATCH EXECUTION</header><div className="page-heading"><div><div className="eyebrow">EXACT PROGRAMS, EXPLICIT COVERAGE</div><h1>Run the retained comparisons.</h1><p>Sequential public execution with exact prefix checks.</p></div></div><div className="content">
    {error && <div className="error" role="alert">{error}</div>}
    <div className="two-columns"><section className="card"><h2>Prepare a bounded batch</h2><label>Frozen cohort<select value={preset} disabled={running} onChange={e => setPreset(e.target.value)}><option value="coverage-pair">Collective coverage comparison · 2 programs</option><option value="evidence-feedback">Evidence and feedback sample · 3 roles</option><option value="values">Values integration · 125 programs</option><option value="reason">Joined REASON · 115 programs</option><option value="epi">EPI · 72 programs</option><option value="learn">LEARN · 39 programs</option><option value="belief">BELIEF · 48 programs</option><option value="affect">AFFECT · 91 programs + 14 supplementary roles</option><option value="decision">DECISION · 174 programs</option><option value="commit">COMMIT · 10 programs</option><option value="work">WORK · 70 main + 8 distractor programs</option><option value="skill">SKILL · 52 original programs</option><option value="habit">HABIT · 23 original programs</option><option value="social">SOCIAL · 26 programs</option><option value="relationship">RELATIONSHIP · 24 corrected + 24 legacy programs</option><option value="long">LONG · 29 public programs + 3 execution probes</option><option value="general">General attention · 43 original recipes</option><option value="body">BODY · 16 source programs</option><option value="multisource">MULTISOURCE · 62 programs</option><option value="all">All available cohorts · {BATCH_LIMITS.jobs} execution roles</option></select></label><button disabled={running} onClick={prepare}>Prepare fresh batch</button><p className="caption">Uses the exact frozen model, inputs and seed for each program. Preparing a fresh batch replaces the prior in-session summary. Export it first if needed.</p><details><summary>Capabilities and scope</summary>{EXPERIMENTS.filter(e => catalog.jobs.some(j=>j.experimentId===e.id)).map(e => <div key={e.id}><h3>{e.label}</h3><p>{e.seamVersion} · {e.corpusScope}</p><p>{e.capabilities.committedStep.boundary}</p><p>Runtime intervention: {e.capabilities.runtimeIntervention.reason}</p><p>Matrix: {e.capabilities.matrix.reason}</p><p>Graph: {e.capabilities.graph.reason}</p></div>)}</details></section>
    <section className="card"><h2>{snapshot?.status ?? 'No batch prepared'}</h2><p role="status">{complete}/{snapshot?.results.length ?? 0} execution roles complete · {prefixes} prefixes checked</p><div className="button-row"><button className="primary" disabled={!session || running || snapshot?.status === 'complete' || snapshot?.status === 'failed'} onClick={() => {setError(''); void session!.run().catch(e => setError(String(e)));}}>Run / resume batch</button><button disabled={!running} onClick={() => session?.pause()}>Pause at committed boundary</button><button disabled={!snapshot || running} onClick={() => {setReport(JSON.stringify(batchReport(snapshot!), null, 2));}}>Prepare summary export</button></div><p className="caption">A dedicated worker executes one run at a time; at most {BATCH_LIMITS.jobs} execution roles and {BATCH_LIMITS.prefixesPerJob} retained prefixes per program. Switching views requests a pause after the current committed instant. Resume continues the same run.</p><p className="caption">Every prefix hash is retained. This summary explicitly omits raw traces; its original inputs and profiles allow replay in the named adapter. A completed row establishes equality to the named frozen save, not psychological validity or full workbench acceptance.</p></section></div>
    {report && <><PreparedExport text={report} label="Prepared batch report" filename="characterlab-batch-summary.json"/><button onClick={() => setReport('')}>Close report</button></>}
    {snapshot && <section className="card"><h2>Per-program receipt</h2><div className="table-scroll"><table><thead><tr><th>Program</th><th>Law / seed</th><th>Status</th><th>Prefix checks</th><th>Exact evidence</th></tr></thead><tbody>{snapshot.results.map(r => <tr key={r.job.id}><td>{r.job.experimentId} / {r.job.name}<small>{r.job.id}</small></td><td>{r.job.law}{r.job.appraisal ? ` / ${r.job.appraisal}` : ''} / <BatchSeed job={r.job}/></td><td>{r.status}{r.error && <p role="alert">{r.error}</p>}</td><td>{r.prefixes.filter(p => p.matchesFrozenSave).length}/{r.job.expectedSaveHashes.length}</td><td><details><summary>Prefix hashes</summary>{r.prefixes.map(p => <div className="hash" key={p.prefix}><span>Prefix {p.prefix} · {p.matchesFrozenSave ? 'Exact match' : 'MISMATCH'}</span><code>{p.saveHash}</code><small>Expected</small><code>{p.expectedSaveHash}</code></div>)}</details></td></tr>)}</tbody></table></div></section>}
  </div></main>;
}
