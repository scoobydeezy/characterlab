import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createServer} from 'vite';
const root = 'docs/planning/workbench-general-export-rev1';
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
assert(!fs.existsSync(`${root}/receipt.json`), 'immutable receipt exists');
const server = await createServer({configFile: false, server: {middlewareMode: true, hmr: false}, appType: 'custom'});
try {
  const {importGeneral, exportGeneral} = await server.ssrLoadModule('/src/workbench/generalExport.ts');
  const text = fs.readFileSync(`${root}/browser-export.json`, 'utf8');
  const run = await importGeneral(text);
  assert.deepEqual(await exportGeneral(run), JSON.parse(text));
  assert.equal(run.snapshot().prefix, 1);
  await run.advance();
  const browser = JSON.parse(fs.readFileSync(`${root}/browser-check.json`, 'utf8'));
  assert.equal(browser.finalPrefix, 2);
  assert(browser.finalHashes.includes(run.snapshot().saveHash));
  assert(browser.finalHashes.includes(run.snapshot().stateHash));
  const paths = ['src/workbench/generalExport.ts','src/workbench/generalAdapter.ts','src/workbench/generalWorker.ts','src/workbench/generalWorkerClient.ts','src/workbench/GeneralWorkbench.tsx','src/workbench/experimentRegistry.ts','src/workbench/WorkbenchApp.tsx','src/workbench/BatchWorkbench.tsx','scripts/check-workbench-general-export.mjs'];
  const sources = paths.map(path => ({path, sha256: sha(fs.readFileSync(path))}));
  for (const source of sources) {const path = `${root}/sources/${source.path}`; fs.mkdirSync(path.slice(0,path.lastIndexOf('/')), {recursive:true}); fs.writeFileSync(path,fs.readFileSync(source.path),{flag:'wx'});}
  fs.writeFileSync(`${root}/receipt.json`, JSON.stringify({status:'PASS BROWSER EXPORT AUTHENTICATION AND CONTINUATION', sources, evidence:['browser-export.json','browser-check.json'].map(path=>({path,sha256:sha(fs.readFileSync(`${root}/${path}`))})), scope:'Baseline prefix1 export/import and next prefix2; no all-recipe or full-corpus claim.'},null,2)+'\n',{flag:'wx'});
  console.log('PASS exact browser export, native authenticated restore and prefix2 continuation');
} finally {await server.close();}
