/** Observer instrument qualification. Original research artifacts are read-only. */
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createServer} from 'vite';
const sha = b => createHash('sha256').update(b).digest('hex');
const planPath = 'docs/planning/REASON_PUBLIC_EXPERIMENT_PLAN_REV3.json';
const referencePath = 'docs/planning/REASON_PUBLIC_EXPERIMENT_REV3.json';
const planBytes = fs.readFileSync(planPath), plan = JSON.parse(planBytes), referenceBytes = fs.readFileSync(referencePath), reference = JSON.parse(referenceBytes);
const catalog = JSON.parse(fs.readFileSync('src/workbench/reasonFixtures.json'));
assert.equal(catalog.sourceSha256, sha(planBytes));
assert.deepEqual(catalog.cases, plan.runs.filter(r => r.law === 1).map(({name, orderedInputs}) => ({name, orderedInputs})));
assert.equal(reference.planSha256, sha(planBytes));
const out = 'docs/planning/workbench-reason-parity-rev1';
assert(!fs.existsSync(`${out}/receipt.json`), 'immutable receipt exists');
const sourcePaths = ['src/workbench/reasonAdapter.ts', 'src/workbench/nativeTimeline.ts', 'src/workbench/canonical.ts', 'src/workbench/reasonFixtures.json', 'scripts/check-workbench-reason.mjs'];
const sources = sourcePaths.map(path => ({path, sha256: sha(fs.readFileSync(path))}));
const server = await createServer({configFile: false, server: {middlewareMode: true, hmr: false}, appType: 'custom'});
try {
  const {ReasonWorkbenchRun} = await server.ssrLoadModule('/src/workbench/reasonAdapter.ts');
  const {prepareReasonModel, createReasonRun} = await server.ssrLoadModule('/src/campaign3/reasonFactory.ts');
  const {reasonRecipe} = await server.ssrLoadModule('/src/campaign3/reasonModel.ts');
  const {canonicalEncode: enc, set, bytesToHex} = await server.ssrLoadModule('/src/substrate/canonicalEncoding.ts');
  const results = [];
  for (const row of plan.runs) {
    const adapter = await ReasonWorkbenchRun.create({law: row.law, name: row.name, seed: 7});
    const native = await createReasonRun(await prepareReasonModel(reasonRecipe(row.law)), {initialState: enc(set([])), orderedInputs: new Uint8Array(Buffer.from(row.orderedInputs, 'hex')), runSeed: new Uint8Array(32).fill(7)});
    assert.equal(bytesToHex(native.runIdentity()), row.runIdentity);
    const prefixes = [];
    do {
      const snapshot = adapter.snapshot();
      assert.equal(adapter.checkpoint().saveHex, bytesToHex(native.save()));
      prefixes.push({prefix: snapshot.prefix, saveHash: snapshot.saveHash, stateHash: snapshot.stateHash});
      const a = await adapter.advance(), b = await native.settleNextInstant();
      assert.equal(a, b); if (!a) break;
    } while (true);
    const snapshot = adapter.snapshot(), old = reference.results.find(x => x.law === row.law && x.name === row.name);
    assert.equal(snapshot.saveHash, old.saveSha256);
    assert.equal(snapshot.stateHash, old.stateSha256);
    assert.equal(sha(native.snapshot().outputs), old.outputsSha256);
    assert.equal(prefixes.length, old.prefixes);
    const probe = snapshot.probes.at(-1);
    assert.deepEqual(probe.reasons.map(r => ({key: r.key, base: r.base, standing: r.standing, situation: r.situation, context: r.context, die: r.die.slice(1), standingModifier: r.modifiers[0]})), old.nuclei);
    const witnesses = [...probe.reasons, ...probe.rejected].flatMap(r => r.witnesses);
    assert.deepEqual(witnesses.map(w => ({overlap: w.overlap, effective: w.effective, role: String(['Base', 'Situation', 'Standing', 'Context'].indexOf(w.role) + 1)})), old.coverage.map(({overlap, effective, role}) => ({overlap, effective, role})));
    assert.equal(probe.rawRejected.length, old.rejectedSources);
    results.push({law: row.law, name: row.name, prefixes, probes: snapshot.probes.length, activeReasons: snapshot.probes.reduce((n, p) => n + p.reasons.length, 0), rejected: snapshot.probes.reduce((n, p) => n + p.rejected.length + p.rawRejected.length, 0)});
    if (results.length % 10 === 0) console.log(`PASS ${results.length}/${plan.runs.length} native programs`);
  }
  const receipt = {status: 'PASS REASON WORKBENCH INSTRUMENT PARITY', sources, planPath, planSha256: sha(planBytes), referencePath, referenceSha256: sha(referenceBytes), runs: results.length, prefixes: results.reduce((n, r) => n + r.prefixes.length, 0), limitations: ['Public native parity and exact output projection only; no new psychological verdict.', 'Checkpoint continuation, observer safety and command isolation tested separately.', 'Human language adequacy, generic corpus coverage and full Campaign 4 entry acceptance remain open.'], results};
  fs.mkdirSync(out, {recursive: true});
  fs.writeFileSync(`${out}/receipt.json`, JSON.stringify(receipt, null, 2) + '\n', {flag: 'wx'});
  console.log(`PASS ${receipt.runs} runs / ${receipt.prefixes} native prefixes`);
} finally {await server.close();}
