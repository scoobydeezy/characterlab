/** Inspection of the frozen REASON public seam; all mathematics comes from its recorded outputs. */
import {canonicalEncode as enc, bytesToHex, set, type CanonicalValue} from '../substrate/canonicalEncoding';
import {dataRecord as rec, dataField as f, dataItems as items} from '../campaign2/canonicalData';
import {prepareReasonModel, createReasonRun, restoreReasonRun} from '../campaign3/reasonFactory';
import {reasonRecipe, VERSION} from '../campaign3/reasonModel';
import {OPTIONS, TASKS} from '../campaign3/longitudinalModel';
import {decodeReason as decode} from '../campaign3/reasonCodecs';
import {digest, equalBytes, exactKey, exactText, fromHex} from './canonical';
import {nativeTimeline, scalar} from './nativeTimeline';
import type {TimelineEvent} from './contracts';
import catalog from './reasonFixtures.json';

export const REASON_LAWS = ['Aggregate', 'PooledChannel', 'PairwiseOnly', 'PerFactDie', 'IdentityIndependentDie'] as const;
export const REASON_CASES = catalog.cases.map(c => c.name);
export const REASON_RENDERER = 'joined-reason-inspection/0.1';
export interface ReasonConfiguration {law: number; name: string; seed: number;}
export interface ReasonWitness {
  description: string; role: string; sign: string; magnitude: string; overlap: string; effective: string;
  provenance: string; exact: string;
}
export interface JoinedReason {
  key: string; option: string; motive: string; referent: string; polarity: string;
  base: string; standing: string; situation: string; context: string; relevance: string;
  die: string; modifiers: string[]; distribution: string; witnesses: ReasonWitness[]; human: string;
}
export interface RejectedReason {key: string; cause: string; exact: string; witnesses: ReasonWitness[];}
export interface ReasonProbe {
  eventId: string; instant: string; renderer: string; kind: 'Compilation probe';
  reasons: JoinedReason[]; rejected: RejectedReason[]; rawRejected: {cause: string; exact: string}[]; exact: string;
}
export interface ReasonSnapshot {
  seamVersion: string; prefix: number; total: number; clock: string; complete: boolean;
  modelHash: string; runHash: string; stateHash: string; saveHash: string;
  state: string; outputs: string; timeline: TimelineEvent[]; probes: ReasonProbe[];
  randomAddresses: string[]; prefixHashes: string[];
}
export interface ReasonCheckpoint {
  version: 'reason-workbench/0.1'; config: ReasonConfiguration; prefix: number; saveHex: string; saveHash: string;
}
const roles: Record<string, string> = {'1': 'Base', '2': 'Situation', '3': 'Standing', '4': 'Context'};
const clone = <T,>(v: T): T => structuredClone(v);
const originalInputs = (name: string) => {
  const fixture = catalog.cases.find(c => c.name === name);
  if (!fixture) throw Error('Unknown frozen REASON case');
  return fromHex(fixture.orderedInputs);
};
function validate(config: ReasonConfiguration) {
  if (!Number.isInteger(config.law) || config.law < 1 || config.law > 5 || !Number.isInteger(config.seed) || config.seed < 0 || config.seed > 255) throw Error('Invalid REASON configuration');
  originalInputs(config.name);
  return {law: config.law, name: config.name, seed: config.seed};
}
function label(value: CanonicalValue): string {
  const option = OPTIONS.findIndex(v => exactKey(v) === exactKey(value));
  if (option >= 0) return `Option ${option === 0 ? 'A' : 'B'}`;
  const task = TASKS.findIndex(v => exactKey(f(rec(v, 371n), 2n)) === exactKey(value));
  if (task >= 0) return `Task ${task === 0 ? 'A' : 'B'}`;
  if (typeof value !== 'boolean' && value.kind === 'typedIdentifier' && typeof value.payload !== 'boolean' && value.payload.kind === 'text') return value.payload.value;
  return exactText(value);
}
function projectProbe(value: CanonicalValue, event: TimelineEvent, law: number): ReasonProbe {
  const compilation = rec(value, 924n), raw = rec(f(compilation, 2n), 920n);
  const signals = items(f(raw, 2n), 'list').map(v => rec(v, 919n));
  const witnesses = (values: CanonicalValue) => items(values, 'list').map(value => {
    const w = rec(value, 921n), description = rec(f(w, 1n), 916n);
    const signal = signals.find(s => exactKey(f(s, 1n)) === exactKey(description));
    if (!signal) throw Error('Unbound recorded REASON witness');
    return {description: label(f(description, 1n)), role: roles[scalar(f(w, 6n))], sign: scalar(f(w, 5n)) === '1' ? 'Positive' : 'Negative',
      magnitude: scalar(f(w, 2n)), overlap: scalar(f(w, 3n)), effective: scalar(f(w, 4n)), provenance: exactText(signal), exact: exactText(w)};
  });
  const reasons = items(f(compilation, 3n), 'list').map(value => {
    const r = rec(value, 923n), key = rec(f(r, 1n), 922n);
    const option = label(f(key, 1n)), motive = label(f(key, 2n)), referent = label(f(key, 3n));
    const polarity = scalar(f(key, 4n)) === '1' ? 'Supports' : 'Opposes';
    const base = scalar(f(r, 2n)), die = `d${scalar(f(r, 7n))}`, ws = witnesses(f(r, 12n));
    // These are deterministic diagnostic sentences, never inferred inner speech or confidence.
    return {key: exactKey(key), option, motive, referent, polarity, base, standing: scalar(f(r, 3n)), situation: scalar(f(r, 4n)), context: scalar(f(r, 5n)),
      relevance: scalar(f(r, 6n)), die, modifiers: [8n, 9n, 10n].map(id => scalar(f(r, id))), distribution: exactText(f(r, 11n)), witnesses: ws,
      human: `${polarity} ${option}. ${law === 2 ? 'This comparator pools source motives and referents; inspect each recorded source for its meaning.' : `The group concerns ${referent}, with motive ${motive}.`} Recorded base ${base} selects ${die}; ${ws.length} recorded contributions retain their role and overlap below.`};
  });
  return {eventId: event.id, instant: event.instant, renderer: REASON_RENDERER, kind: 'Compilation probe', reasons,
    rejected: items(f(compilation, 4n), 'list').map(value => {const r = rec(value, 928n); return {key: exactKey(f(r, 1n)), cause: scalar(f(r, 2n)) === '1' ? 'Zero net base: no die' : 'Below relevance threshold', exact: exactText(r), witnesses: witnesses(f(r, 5n))};}),
    rawRejected: items(f(raw, 3n), 'list').map(value => {const r = rec(value, 927n); return {cause: ({'1': 'Missing accessible source support', '2': 'Zero raw strength', '3': 'No acquired identity history'} as Record<string, string>)[scalar(f(r, 2n))], exact: exactText(r)};}), exact: exactText(compilation)};
}
type PublicRun = Awaited<ReturnType<typeof createReasonRun>>;
export class ReasonWorkbenchRun {
  #run: PublicRun; #config: ReasonConfiguration; #prefix = 0; #busy = false; #snapshot!: ReasonSnapshot; #hashes: string[] = [];
  private constructor(run: PublicRun, config: ReasonConfiguration) {this.#run = run; this.#config = clone(config);}
  static async create(input: ReasonConfiguration = {law: 1, name: 'collective', seed: 7}) {
    const config = validate(input);
    const run = await createReasonRun(await prepareReasonModel(reasonRecipe(config.law)), {initialState: enc(set([])), orderedInputs: originalInputs(config.name), runSeed: new Uint8Array(32).fill(config.seed)});
    const result = new ReasonWorkbenchRun(run, config); await result.#refresh(); return result;
  }
  configuration() {return clone(this.#config);}
  snapshot() {if (this.#busy) throw Error('REASON run is advancing'); return clone(this.#snapshot);}
  checkpoint(): ReasonCheckpoint {
    if (this.#busy) throw Error('REASON run is advancing');
    return {version: 'reason-workbench/0.1', config: this.configuration(), prefix: this.#prefix, saveHex: bytesToHex(this.#run.save()), saveHash: this.#snapshot.saveHash};
  }
  static async restore(input: ReasonCheckpoint) {
    const c = clone(input), config = validate(c.config), total = items(decode(originalInputs(config.name)), 'list').length;
    if (c.version !== 'reason-workbench/0.1' || !Number.isInteger(c.prefix) || c.prefix < 0 || c.prefix > total || typeof c.saveHex !== 'string' || c.saveHex.length > 16_000_000) throw Error('Invalid REASON checkpoint');
    const save = fromHex(c.saveHex); if (await digest(save) !== c.saveHash) throw Error('Checkpoint digest mismatch');
    const run = await restoreReasonRun(reasonRecipe(config.law), {initialState: enc(set([])), orderedInputs: originalInputs(config.name), save});
    const expected = await ReasonWorkbenchRun.create(config);
    for (let i = 0; i < c.prefix; i++) await expected.advance();
    if (!equalBytes(expected.#run.save(), save)) throw Error('Checkpoint configuration/prefix mismatch');
    const result = new ReasonWorkbenchRun(run, config); result.#prefix = c.prefix; result.#hashes = clone(expected.#hashes); await result.#refresh(); return result;
  }
  async advance() {
    if (this.#busy) throw Error('REASON command already in flight');
    this.#busy = true;
    try {const progress = await this.#run.settleNextInstant(); if (progress) this.#prefix++; await this.#refresh(); return progress;}
    finally {this.#busy = false;}
  }
  async #refresh() {
    const snapshot = this.#run.snapshot(), traces = items(decode(snapshot.trace), 'list'), timeline = nativeTimeline(traces);
    const probes = traces.flatMap((value, i) => items(f(rec(value, 160n), 13n), 'list').filter(v => typeof v !== 'boolean' && v.kind === 'record' && v.schema.typeId === 924n).map(v => projectProbe(v, timeline[i], this.#config.law)));
    const identity = rec(decode(this.#run.runIdentity()), 104n), save = this.#run.save();
    const [modelHash, runHash, stateHash, saveHash] = await Promise.all([digest(enc(f(identity, 1n))), digest(this.#run.runIdentity()), digest(snapshot.state), digest(save)]);
    this.#hashes[this.#prefix] = stateHash;
    const total = items(decode(originalInputs(this.#config.name)), 'list').length;
    this.#snapshot = {seamVersion: VERSION, prefix: this.#prefix, total, clock: String(snapshot.clock ?? 'initial'), complete: this.#prefix === total,
      modelHash, runHash, stateHash, saveHash, state: exactText(decode(snapshot.state)), outputs: exactText(decode(snapshot.outputs)), timeline, probes,
      randomAddresses: items(f(rec(decode(save), 132n), 10n), 'list').map(scalar), prefixHashes: clone(this.#hashes)};
  }
}
