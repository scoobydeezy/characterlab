import {canonicalDecode, canonicalEncode, RecordSchemaRegistry, bytesToHex, type CanonicalValue} from '../substrate/canonicalEncoding';
import {dataRecord as rec, dataField as f, dataItems as items, dataUnsigned as uint} from '../campaign2/canonicalData';
import {restoreAuthoritativeState} from '../substrate/state';
import {findCanonicalValueDivergence} from '../substrate/trace';
import {prepareIntegrationModel, createIntegrationPublicRun, restoreIntegrationPublicRun} from '../campaign3/valuesIntegrationPublicFactory';
import {integrationRecipe, integrationInitial, integrationOrdered, VERSION, unpack, historyOwner, projectionValue, stages} from '../campaign3/valuesIntegrationPublicModel';
import {valuesIntegrationPublicSupportedSchemas} from '../campaign3/valuesIntegrationPublicCodecs';
import {projectionData} from '../campaign3/valuesPublicModel';
import {valuesPublicRows} from '../campaign3/valuesPublicMath';
import {VALUE_LAWS, type ValueLaw} from '../campaign3/valuesComponent';
import {validateFrames, validateProfile, type IntegrationFrame, type IntegrationProfile} from '../campaign3/valuesIntegration';
import {OPTIONS} from '../campaign3/longitudinalModel';
import {readQ} from '../campaign2/cognitiveMath';
import {WORKBENCH_VERSION, SEMANTIC_VERSION, type DiagnosticField, type TimelineEvent, type Activity, type ReasonExplanation} from './contracts';
import {digest, equalBytes, exactKey, exactText, fromHex} from './canonical';

const registry = new RecordSchemaRegistry(valuesIntegrationPublicSupportedSchemas());
const decode = (b: Uint8Array) => canonicalDecode(b, registry);
const rootNames: Record<string, string> = {'1516': 'Value evidence history', '1517': 'Stored Value projection', '1522': 'Physical world', '1523': 'Goal lifecycle', '1524': 'Admitted forecast'};
const pathRoot = (v: CanonicalValue) => String(uint(f(rec(v, 140n), 1n)));
const labelPath = (v: CanonicalValue) => rootNames[pathRoot(v)] ?? `State ${pathRoot(v)}`;
const scalar = (v: CanonicalValue) => typeof v !== 'boolean' && v.kind === 'rational' ? `${v.numerator}/${v.denominator}` : typeof v !== 'boolean' && ['unsigned', 'signed', 'text'].includes(v.kind) ? String((v as {value: unknown}).value) : exactText(v);
const clone = <T>(v: T): T => structuredClone(v);
export const EXPERIMENT_ID = 'values-integration/four-instants/1';
export type EvidenceVariant = 'Baseline' | 'Withheld outcome' | 'Neutral report' | 'False positive report';
export function valuesFixture(variant: EvidenceVariant = 'Baseline'): IntegrationFrame[] {
  const frames: IntegrationFrame[] = [1, 2, 3, 4].map(instant => ({instant, opportunity: instant !== 1, linked: true, need: 0, direction: 1, mode: 'ValuesOnly', command: instant === 1 ? 'Adopt' : 'None', world: {permitted: true, outcome: 1}, observation: {visible: true, category: true, display: 'Actual', goalVisible: true, goalDisplay: 'Actual', forecast: 1}}));
  if (variant === 'Withheld outcome') frames[1].observation.visible = false;
  if (variant === 'Neutral report') frames[1].observation.display = 'Neutral';
  if (variant === 'False positive report') {frames[1].world.permitted = false; frames[1].observation.display = 'Positive'; frames[1].observation.goalDisplay = 'Present';}
  return frames;
}
export interface ValuesConfiguration {profile: IntegrationProfile; frames: IntegrationFrame[];}
export const defaultConfiguration = (): ValuesConfiguration => ({profile: {law: 'Accumulated', appraisal: 'ValueRelative', seed: 0}, frames: valuesFixture()});
export interface WorkbenchCheckpoint {version: string; experimentId: string; config: ValuesConfiguration; prefix: number; saveHex: string; saveHash: string;}
type PublicRun = Awaited<ReturnType<typeof createIntegrationPublicRun>>;
export type NativeRow = ReturnType<PublicRun['rows']>[number];
export interface ValuesSnapshot {
  experimentId: string;
  seamVersion: string;
  prefix: number;
  clock: string;
  status: string;
  modelHash: string;
  runHash: string;
  stateHash: string;
  saveHash: string;
  stateHex: string;
  prefixStates: {prefix: number; instant: string; hash: string}[];
  randomAddresses: string[];
  fields: DiagnosticField[];
  timeline: TimelineEvent[];
  rows: NativeRow[];
  reasons: ReasonExplanation[];
  activity: Activity[];
}

function timeline(trace: readonly CanonicalValue[]): TimelineEvent[] {
  return trace.map(t => {
    const r = rec(t, 160n), event = rec(f(r, 4n), 130n), phase = scalar(f(event, 3n));
    // ScheduledEvent schema order is read by name below, avoiding an assumed phase/index layout.
    const named = (name: string) => {const field = event.schema.fields.find(x => x.name === name); if (!field) throw Error(`Missing event ${name}`); return f(event, field.id);};
    const eventType = named('EventTypeId');
    const payload = typeof eventType !== 'boolean' && eventType.kind === 'typedIdentifier' ? scalar(eventType.payload) : '';
    return {id: scalar(named('EventId')), instant: scalar(named('DueAt')), phase,
      stage: payload.split('/').at(-1) ?? payload,
      parents: items(named('CausalParentEventIds'), 'list').map(scalar),
      reads: items(f(r, 11n), 'list').map(v => {const x = rec(v, 147n), path = f(x, 2n); return {path: exactKey(path), label: labelPath(path), exact: f(x, 3n) === true ? exactText(f(x, 4n)) : 'Absent'};}),
      diffs: items(f(r, 17n), 'list').map(v => {const x = rec(v, 148n), path = f(x, 1n), before = f(x, 2n) === true ? exactText(f(x, 3n)) : 'Absent', after = f(x, 4n) === true ? exactText(f(x, 5n)) : 'Absent'; return {path: exactKey(path), label: labelPath(path), before, after, changed: before !== after};}),
      input: exactText(f(r, 12n)), output: exactText(f(r, 13n)), draws: exactText(f(r, 14n)), quantization: exactText(f(r, 15n))};
  });
}

function reasons(outputs: readonly CanonicalValue[], events: TimelineEvent[]): ReasonExplanation[] {
  return valuesPublicRows(outputs).flatMap(row => {
    const bundle = rec(row.reason, 408n), raw = rec(f(bundle, 2n), 403n), nuclei = items(f(bundle, 3n), 'list');
    return nuclei.map((n, i) => {
      const nucleus = rec(n, 407n), nk = rec(f(nucleus, 1n), 404n), roles = rec(f(nucleus, 2n), 406n);
      const option = exactKey(f(nk, 1n)) === exactKey(OPTIONS[0]) ? 'A' : 'B';
      const polarity = uint(f(nk, 4n)) === 1n ? 'Supports' as const : 'Opposes' as const;
      const signal = items(f(raw, 3n), 'set').find(x => exactKey(f(rec(f(rec(x, 402n), 1n), 401n), 1n)) === exactKey(f(nk, 1n)));
      const magnitude = signal ? readQ(f(rec(signal, 402n), 2n)) : null;
      // Explicit mapping for this bounded receiver, not the inherited generic Commitment label.
      const concept = option === 'B' ? 'values.open-goal' : `values.${row.probe.mode.toLowerCase()}-preference`;
      const human = option === 'B' ? 'I have an open goal associated with option B.' : row.probe.mode === 'NeedOnly'
        ? `Past outcomes and my current need ${polarity === 'Supports' ? 'favor' : 'count against'} option A.`
        : row.probe.mode === 'Joint' ? `My retained preference or current need ${polarity === 'Supports' ? 'favors' : 'counts against'} option A.`
        : `My retained preference ${polarity === 'Supports' ? 'favors' : 'counts against'} option A.`;
      const calibrated = scalar(f(roles, 1n)), die = `d${scalar(f(nucleus, 4n))}`;
      return {id: `${row.probe.instant}/reason/${i}`, eventId: events.find(e => e.instant === String(row.probe.instant) && e.stage === 'reasons')?.id ?? '', instant: row.probe.instant,
        option, concept, polarity, human, renderer: SEMANTIC_VERSION, raw: magnitude ? `${magnitude.numerator}/${magnitude.denominator}` : 'Unavailable', calibrated, die,
        modifiers: `Standing ${scalar(f(nucleus, 5n))}; situation ${scalar(f(nucleus, 6n))}`,
        uncertainty: 'No epistemic confidence scalar in this profile. Exact die distribution is retained in provenance.',
        provenance: exactText(n), semanticKey: JSON.stringify([SEMANTIC_VERSION, concept, option, polarity, calibrated, die])};
    });
  });
}

/** Owns only the public handle and detached presentation snapshots; no runtime fields. */
export class ValuesWorkbenchRun {
  #run: PublicRun;
  #config: ValuesConfiguration;
  #busy = false;
  #snapshot!: ValuesSnapshot;
  #prefix = 0;
  #prefixStates: {prefix: number; instant: string; hash: string}[] = [];
  private constructor(run: PublicRun, config: ValuesConfiguration) {this.#run = run; this.#config = clone(config);}
  static async create(input: ValuesConfiguration = defaultConfiguration()) {
    const config = {profile: validateProfile(input.profile), frames: validateFrames(input.frames)};
    if (config.frames.length !== 4 || config.frames.some((frame, i) => frame.instant !== i + 1)) throw Error('This workbench experiment requires exactly instants 1 through 4');
    const run = await createIntegrationPublicRun(await prepareIntegrationModel(integrationRecipe(config.profile.law, config.profile.appraisal)), {initialState: integrationInitial(), orderedInputs: integrationOrdered(config.frames), runSeed: new Uint8Array(32).fill(config.profile.seed)});
    const adapter = new ValuesWorkbenchRun(run, config); await adapter.#refresh(); return adapter;
  }
  static async restore(checkpoint: WorkbenchCheckpoint) {
    const c = clone(checkpoint);
    if (c.version !== WORKBENCH_VERSION || c.experimentId !== EXPERIMENT_ID || !Number.isInteger(c.prefix) || c.prefix < 0 || c.prefix > c.config.frames.length) throw Error('Invalid workbench checkpoint');
    if (typeof c.saveHex !== 'string' || c.saveHex.length > 16_000_000) throw Error('Workbench checkpoint exceeds the 8 MB save limit');
    validateProfile(c.config.profile); validateFrames(c.config.frames);
    const save = fromHex(c.saveHex); if (await digest(save) !== c.saveHash) throw Error('Checkpoint digest mismatch');
    const run = await restoreIntegrationPublicRun(integrationRecipe(c.config.profile.law, c.config.profile.appraisal), {initialState: integrationInitial(), orderedInputs: integrationOrdered(c.config.frames), save});
    const expected = await ValuesWorkbenchRun.create(c.config);
    // Authenticate seed and claimed prefix as well as the public save's original-input binding.
    for (let i = 0; i < c.prefix; i++) await expected.advance();
    if (!equalBytes(expected.#run.save(), save)) throw Error('Checkpoint configuration/prefix mismatch');
    const adapter = new ValuesWorkbenchRun(run, c.config); adapter.#prefix = c.prefix;
    adapter.#prefixStates = clone(expected.#prefixStates); await adapter.#refresh(); return adapter;
  }
  configuration() {return clone(this.#config);}
  snapshot() {if (this.#busy) throw Error('Workbench run is advancing'); return clone(this.#snapshot);}
  checkpoint(): WorkbenchCheckpoint {
    if (this.#busy) throw Error('Workbench run is advancing');
    return {version: WORKBENCH_VERSION, experimentId: EXPERIMENT_ID, config: this.configuration(), prefix: this.#prefix, saveHex: bytesToHex(this.#run.save()), saveHash: this.#snapshot.saveHash};
  }
  async advance() {
    if (this.#busy) throw Error('Workbench command already in flight');
    this.#busy = true;
    try {const advanced = await this.#run.settleNextInstant(); if (advanced) this.#prefix++; await this.#refresh(); return advanced;}
    finally {this.#busy = false;}
  }
  async #refresh() {
    const s = this.#run.snapshot(), trace = items(decode(s.trace), 'list'), outputs = items(decode(s.outputs), 'list');
    const state = restoreAuthoritativeState(decode(s.state)), events = timeline(trace);
    const fields: DiagnosticField[] = state.entries().map(entry => ({key: String(entry.path.rootStateTypeId), label: rootNames[String(entry.path.rootStateTypeId)] ?? 'Unknown state', group: entry.path.rootStateTypeId === 1522n ? 'World' : 'Character', exact: exactText(entry.value), authority: 'Runtime', scope: entry.path.rootStateTypeId === 1522n ? 'World truth' : 'Character state', revision: `instant ${s.clock ?? 'initial'}`, editPolicy: 'Read only'}));
    const history = state.entries().find(e => e.path.rootStateTypeId === 1516n)!;
    const projection = state.entries().find(e => e.path.rootStateTypeId === 1517n)?.value ?? projectionValue(historyOwner(this.#config.profile.law, history.value).view(65));
    const view = projectionData(projection);
    fields.push(...Object.entries(view).map(([name, value]): DiagnosticField => ({key: `view.${name}`, label: `Value ${name}`, group: 'Value projection', exact: value === null ? 'Unknown / no admitted value' : String(value), authority: 'Derived', scope: 'Character state', revision: `instant ${s.clock ?? 'initial'}`, editPolicy: 'Read only'})));
    const activity: Activity[] = state.entries().map(entry => {
      const root = String(entry.path.rootStateTypeId), label = rootNames[root] ?? root;
      return {root, label, reads: events.reduce((n, e) => n + e.reads.filter(r => r.label === label).length, 0), writes: events.reduce((n, e) => n + e.diffs.filter(d => d.label === label).length, 0), changes: events.reduce((n, e) => n + e.diffs.filter(d => d.label === label && d.changed).length, 0), persisted: true, contribution: 'Not established by read/change instrumentation'};
    });
    const [modelHash, runHash, stateHash, saveHash] = await Promise.all([digest(this.#run.modelIdentity()), digest(this.#run.runIdentity()), digest(s.state), digest(this.#run.save())]);
    this.#prefixStates[this.#prefix] = {prefix: this.#prefix, instant: String(s.clock ?? 'initial'), hash: stateHash};
    this.#snapshot = {experimentId: EXPERIMENT_ID, seamVersion: VERSION, prefix: this.#prefix, clock: String(s.clock ?? 'initial'), status: this.#prefix === this.#config.frames.length ? 'Complete' : String(s.status), modelHash, runHash, stateHash, saveHash, stateHex: bytesToHex(s.state), prefixStates: clone(this.#prefixStates), randomAddresses: [...s.randomAddresses], fields, timeline: events, rows: this.#run.rows(), reasons: reasons(outputs, events), activity};
  }
}

export function compareValues(a: ValuesWorkbenchRun, b: ValuesWorkbenchRun) {
  const ca = a.configuration(), cb = b.configuration(), sa = a.snapshot(), sb = b.snapshot();
  const modelChanged = ca.profile.law !== cb.profile.law || ca.profile.appraisal !== cb.profile.appraisal;
  const inputChanged = JSON.stringify(ca.frames) !== JSON.stringify(cb.frames);
  const seedMatched = ca.profile.seed === cb.profile.seed;
  const controlled = seedMatched && !(modelChanged && inputChanged);
  const count = Math.min(sa.rows.length, sb.rows.length);
  let firstSemantic: number | null = null;
  // Compare complete observer rows; representation-only serialized resolution fields are separate.
  const semantic = ({intent, expression, resolution, ...row}: NativeRow) => row;
  for (let i = 0; i < count; i++) if (JSON.stringify(semantic(sa.rows[i])) !== JSON.stringify(semantic(sb.rows[i]))) {firstSemantic = i; break;}
  const difference = findCanonicalValueDivergence(decode(fromHex(sa.stateHex)), decode(fromHex(sb.stateHex)));
  const matchedAddresses = sa.randomAddresses.filter(x => sb.randomAddresses.includes(x)).length;
  const firstExact = sa.prefixStates.find((entry, i) => sb.prefixStates[i] && entry.hash !== sb.prefixStates[i].hash);
  return {version: SEMANTIC_VERSION, protocol: modelChanged ? 'Model comparison' : 'Input comparison', controlled,
    controlledDifference: {profileA: ca.profile, profileB: cb.profile, inputsDiffer: inputChanged, inputChanges: inputDifferences(ca.frames, cb.frames)},
    coupling: {policy: 'Identical native semantic random addresses share draws; unmatched addresses remain explicit', seedMatched, matchedAddresses, addressesA: sa.randomAddresses.length, addressesB: sb.randomAddresses.length},
    runIdentityEqual: sa.runHash === sb.runHash, stateEqual: sa.stateHash === sb.stateHash,
    currentStateDifference: difference ? {path: difference.structuralField, before: difference.oldValue === undefined ? 'Absent' : exactText(difference.oldValue), after: difference.newValue === undefined ? 'Absent' : exactText(difference.newValue)} : null,
    firstSemanticInstant: firstSemantic === null ? null : sa.rows[firstSemantic].instant,
    firstExactStatePrefix: firstExact?.prefix ?? null,
    equalObservedPrefixes: firstSemantic ?? count, comparedPrefixes: count,
    aligned: sa.rows.slice(0, count).every((x, i) => x.instant === sb.rows[i].instant),
    complete: sa.prefix === ca.frames.length && sb.prefix === cb.frames.length,
    limits: 'Finite observer-row comparison; equality excludes serialized intent/expression/resolution identities. Does not establish general redundancy or unique causal attribution.'};
}

function inputDifferences(a: unknown, b: unknown, path = 'frames'): {path: string; before: unknown; after: unknown}[] {
  if (JSON.stringify(a) === JSON.stringify(b)) return [];
  if (a !== null && b !== null && typeof a === 'object' && typeof b === 'object') {
    const x = a as Record<string, unknown>, y = b as Record<string, unknown>;
    return [...new Set([...Object.keys(x), ...Object.keys(y)])].flatMap(k => inputDifferences(x[k], y[k], `${path}.${k}`));
  }
  return [{path, before: a, after: b}];
}

export function auditReasons(reasons: readonly ReasonExplanation[]) {
  const issues: {kind: string; reasonId: string; detail: string}[] = [];
  const semantics = new Map<string, string>();
  for (const r of reasons) {
    if (!r.human || !r.concept) issues.push({kind: 'MISSING', reasonId: r.id, detail: 'No human semantic mapping'});
    const prior = semantics.get(r.semanticKey);
    if (prior !== undefined && prior !== r.human) issues.push({kind: 'UNSTABLE', reasonId: r.id, detail: 'Equivalent semantics rendered differently'});
    semantics.set(r.semanticKey, r.human);
  }
  return {renderer: SEMANTIC_VERSION, factors: reasons.length, issues,
    reviewRequired: 'Wording adequacy, misleading collisions, redundancy and observer safety also require curated tests and human review.'};
}
export {VALUE_LAWS, stages};
