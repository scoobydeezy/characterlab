import {canonicalDecode, RecordSchemaRegistry, bytesToHex} from '../substrate/canonicalEncoding';
import {restoreAuthoritativeState, statePathValue} from '../substrate/state';
import {dataRecord as rec, dataField as f, dataItems as items} from '../campaign2/canonicalData';
import {generalAttentionSupportedSchemas} from '../campaign3/generalAttentionCodecs';
import {generalBindingContext} from '../campaign3/generalBindingProfile';
import {generalAttentionModelSource, prepareGeneralAttentionModel, generalAttentionInitialState, generalAttentionOrderedInputs, generalAttentionModelIdentity, createGeneralAttentionRun, restoreGeneralAttentionRun} from '../campaign3/generalFactory';
import freeze from '../../docs/planning/campaign3-general-attention-model-rev2/FREEZE.json';
import {digest, exactText, exactKey, fromHex, equalBytes} from './canonical';
import {nativeTimeline} from './nativeTimeline';
import {nativeReadSources,type NativeReadSources} from './nativeReadSources';
import {projectAssociation, type AssociationProjection} from './associationProjection';
import type {TimelineEvent} from './contracts';
export const GENERAL_RECIPES = freeze.models.map(m => m.name);
const registry = new RecordSchemaRegistry(generalAttentionSupportedSchemas());
const decode = (bytes: Uint8Array) => canonicalDecode(bytes, registry);
type Run = Awaited<ReturnType<typeof createGeneralAttentionRun>>;
export interface GeneralSnapshot {
  recipe: string; seamVersion: string; prefix: number; clock: string; complete: boolean;
  modelHash: string; runHash: string; stateHash: string; saveHash: string;
  graph: AssociationProjection | null; graphPath: string | null;
  fields: {path: string; root: string; exact: string}[]; timeline: TimelineEvent[];
  nativeReadMetadata?: NativeReadSources;
}
export type GeneralSeed = number | string;
export type GeneralCheckpoint = {recipe: string; prefix: number; saveHex: string; saveHash: string;} & ({version:'general-workbench/0.1';seed:number}|{version:'general-workbench/0.2';seed:string});
export function generalSeedBytes(seed:GeneralSeed):Uint8Array {
 if(typeof seed==='number'&&Number.isInteger(seed)&&seed>=0&&seed<=255)return new Uint8Array(32).fill(seed);
 if(typeof seed==='string'&&/^[0-9a-f]{64}$/.test(seed))return fromHex(seed);
 throw Error('General attention seed must be a byte number or64 lowercase hexadecimal digits');
}
export class GeneralWorkbenchRun {
  #run: Run; #recipe: string; #seed: GeneralSeed; #modelHash: string; #prefix = 0; #busy = false; #snapshot!: GeneralSnapshot;
  private constructor(run: Run, recipe: string, seed: GeneralSeed, modelHash: string) {this.#run = run; this.#recipe = recipe; this.#seed = seed; this.#modelHash = modelHash;}
  static async create(recipe = 'baseline', seed:GeneralSeed = 0) {
    if (!GENERAL_RECIPES.includes(recipe)) throw Error('Invalid frozen general-attention configuration');
    const runSeed=generalSeedBytes(seed);
    const token = await prepareGeneralAttentionModel(generalAttentionModelSource(recipe));
    const run = await createGeneralAttentionRun(token, {initialState: generalAttentionInitialState(token), orderedInputs: generalAttentionOrderedInputs(token), runSeed});
    const adapter = new GeneralWorkbenchRun(run, recipe, seed, await digest(generalAttentionModelIdentity(token))); await adapter.#refresh(); return adapter;
  }
  snapshot() {if (this.#busy) throw Error('General-attention run is advancing'); return structuredClone(this.#snapshot);}
  checkpoint(): GeneralCheckpoint {
    if (this.#busy) throw Error('General-attention run is advancing');
    const tail={prefix:this.#prefix,saveHex:bytesToHex(this.#run.save()),saveHash:this.#snapshot.saveHash};
    return typeof this.#seed==='number'?{version:'general-workbench/0.1',recipe:this.#recipe,seed:this.#seed,...tail}:{version:'general-workbench/0.2',recipe:this.#recipe,seed:this.#seed,...tail};
  }
  static async restore(input: GeneralCheckpoint) {
    const c = structuredClone(input);
    if (!c || !((c.version==='general-workbench/0.1'&&typeof c.seed==='number')||(c.version==='general-workbench/0.2'&&typeof c.seed==='string')) || !Number.isInteger(c.prefix) || c.prefix < 0 || c.prefix > 100 || typeof c.saveHex !== 'string' || c.saveHex.length > 32_000_000) throw Error('Invalid bounded general-attention checkpoint');
    const expected = await GeneralWorkbenchRun.create(c.recipe, c.seed), save = fromHex(c.saveHex);
    if (await digest(save) !== c.saveHash) throw Error('Checkpoint digest mismatch');
    for (let i = 0; i < c.prefix; i++) if (!await expected.advance()) throw Error('Checkpoint prefix exceeds original horizon');
    if (!equalBytes(expected.#run.save(), save)) throw Error('Checkpoint configuration/prefix mismatch');
    const source = generalAttentionModelSource(c.recipe), token = await prepareGeneralAttentionModel(source);
    const run = await restoreGeneralAttentionRun(source, {initialState: generalAttentionInitialState(token), orderedInputs: generalAttentionOrderedInputs(token), save});
    const adapter = new GeneralWorkbenchRun(run, c.recipe, c.seed, expected.#modelHash); adapter.#prefix = c.prefix; await adapter.#refresh(); return adapter;
  }
  async advance() {
    if (this.#busy) throw Error('General-attention command already in flight');
    if (this.#prefix >= 100 && !this.#snapshot.complete) throw Error('Inspection limit of 100 whole instants reached; no events discarded');
    this.#busy = true;
    try {const moved = await this.#run.settleNextInstant(); if (moved) this.#prefix++; await this.#refresh(); return moved;}
    finally {this.#busy = false;}
  }
  async #refresh() {
    const snapshot = this.#run.snapshot(), save = this.#run.save(), state = restoreAuthoritativeState(decode(snapshot.state));
    const entries = state.entries(), graphs = entries.filter(e => e.path.rootStateTypeId === 631n);
    if (graphs.length > 1) throw Error('This profile requires an explicit subject selector for multiple association owners');
    const graph = graphs[0],trace=items(decode(snapshot.trace),'list');
    this.#snapshot = {recipe: this.#recipe, seamVersion: freeze.versions.rulesVersion, prefix: this.#prefix, clock: String(snapshot.clock), complete: items(f(rec(decode(save), 132n), 7n), 'list').length === 0,
      modelHash: this.#modelHash, runHash: await digest(this.#run.runIdentity()), stateHash: await digest(snapshot.state), saveHash: await digest(save),
      graph: graph ? projectAssociation(graph.value, generalBindingContext().graphScale) : null, graphPath: graph ? exactKey(statePathValue(graph.path)) : null,
      fields: entries.map(e => ({path: exactKey(statePathValue(e.path)), root: String(e.path.rootStateTypeId), exact: exactText(e.value)})), timeline: nativeTimeline(trace),nativeReadMetadata:nativeReadSources(trace)};
  }
}
