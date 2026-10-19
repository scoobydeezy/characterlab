import {useEffect, useRef, useState} from 'react';
import {GeneralWorkerClient} from './generalWorkerClient';
import {compareGeneralSnapshots, GENERAL_COMPARISONS} from './generalComparison';
import catalog from './generalComparisonCatalog.json';

type Report = ReturnType<typeof compareGeneralSnapshots>;
export function GeneralComparisonPanel() {
  const pair = useRef<[GeneralWorkerClient, GeneralWorkerClient]>();
  const alive = useRef(true), locked = useRef(false);
  const [selected, setSelected] = useState(GENERAL_COMPARISONS[0].id);
  const [loaded, setLoaded] = useState(''), [busy, setBusy] = useState(false);
  const [error, setError] = useState(''), [report, setReport] = useState<Report>();
  const [complete, setComplete] = useState(false);
  const spec = GENERAL_COMPARISONS.find(s => s.id === selected)!;
  useEffect(() => {alive.current = true; return () => {alive.current = false; pair.current?.forEach(c => c.dispose());};}, []);
  async function execute(fresh: boolean) {
    if (locked.current) return;
    locked.current = true; setBusy(true); setError(''); setReport(undefined);
    const created: GeneralWorkerClient[] = [];
    try {
      if (fresh) {
        for (const recipe of [spec.control, spec.candidate]) {
          const client = await GeneralWorkerClient.create(recipe, catalog.seed); created.push(client);
          if (!alive.current) return;
        }
        pair.current?.forEach(c => c.dispose());
        pair.current = [created[0], created[1]]; setLoaded(spec.id);
      } else {
        if (!pair.current || loaded !== selected) throw Error('Create the selected pair first');
        for (const client of pair.current) {await client.advance(); if (!alive.current) return;}
      }
      const [a, b] = pair.current!;
      setReport(compareGeneralSnapshots(fresh ? spec.id : loaded, a.snapshot(), b.snapshot()));
      setComplete(a.snapshot().complete && b.snapshot().complete);
    } catch (e) {
      if (alive.current) {setError(String(e)); setLoaded('');}
      pair.current?.forEach(c => c.dispose()); pair.current = undefined;
    } finally {
      if (!alive.current || !pair.current) created.forEach(c => c.dispose());
      locked.current = false; if (alive.current) setBusy(false);
    }
  }
  return <section className="card" id="general-comparison">
    <h2>Controlled attention comparison</h2>
    <p>Compare two separate runs using the retained intervention and original frozen seed. The graph run above stays independent.</p>
    <label>Declared attention comparison<select value={selected} disabled={busy} onChange={e => {setSelected(e.target.value); setReport(undefined); setError('');}}>{GENERAL_COMPARISONS.map(s => <option key={s.id} value={s.id}>{s.id}: {s.control} → {s.candidate}</option>)}</select></label>
    <p>Declared change: {spec.changed.join(', ')}</p><p>{spec.alignment}</p>
    <div className="button-row"><button disabled={busy} onClick={() => void execute(true)}>Create comparison pair</button><button disabled={busy || loaded !== selected || complete || !!error} onClick={() => void execute(false)}>Step comparison pair</button></div>
    <p role="status">{busy ? 'Working on comparison' : error ? 'Comparison failed; recreate the pair' : report ? `Comparison ${report.control.prefix} / ${report.candidate.prefix} · instants ${report.control.clock} / ${report.candidate.clock} · ${report.status}${complete ? ' · Complete' : ''}` : 'Create a pair to inspect its actual records'}</p>
    {error && <p role="alert">{error}</p>}
    {report && <><p>{report.scope}</p><p>Control: {report.control.recipe} · Candidate: {report.candidate.recipe}</p>
      {report.status === 'ALIGNED_COMMITTED_INSTANT' && <>
        <p>{report.fields.filter(f => f.changed).length} changed state paths of {report.fields.length}; {report.graph.status === 'IDENTITY_ALIGNED' ? `${report.graph.cells.filter(c => c.changed).length} changed association cells of ${report.graph.cells.length}` : 'association graph unavailable'}.</p>
        <p>Event slots: {report.events.filter(e => e.status === 'UNIQUE_STAGE_SLOT').length} unique, {report.events.filter(e => e.status === 'MISSING_SIDE').length} missing a side, {report.events.filter(e => e.status === 'AMBIGUOUS_STAGE_SLOT').length} ambiguous. Missing values are not zero.</p>
      </>}
      <details><summary>Exact comparison records and identities</summary><pre className="exact" data-general-comparison-report>{JSON.stringify(report, null, 2)}</pre></details>
    </>}
    <p className="caption">36 retained declarations; current browser coverage is tracked separately. Exact differences describe these executions and do not establish psychological necessity or complete Campaign4 qualification.</p>
  </section>;
}
