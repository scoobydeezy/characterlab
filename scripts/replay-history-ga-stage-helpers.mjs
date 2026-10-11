import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const dir='docs/planning/campaign3-history-ga-stages-rev1';
export const fp=path=>({path,sha256:createHash('sha256').update(fs.readFileSync(path)).digest('hex')});
const bindings=JSON.parse(fs.readFileSync(dir+'/bindings.json'));
export function checkPacketBindings(input,packet){
 for(const source of packet.sources){
  const row=bindings.find(r=>r.packet===input&&r.path===source.path&&r.sha256===source.sha256);
  assert(row,'Every historical binding must have an explicit disposition.');
  if(row.resolvedPath)assert.equal(fp(row.resolvedPath).sha256,source.sha256);
  else assert.equal(row.status,'EXCLUDED OLD CODE CONTENT; SYMBOLIC CHECK ONLY');
 }
}
export function auditWrite(originalPath,text){
 const computed=JSON.parse(text),original=JSON.parse(fs.readFileSync(originalPath));
 assert.deepEqual(computed,original,'Reproduce the whole historical declaration receipt.');
 const packet=original.sources.find(r=>r.path.includes('STAGE_CLOSURE'));
 checkPacketBindings(packet.path,JSON.parse(fs.readFileSync(packet.path)));
 const checker=process.argv[1].replaceAll('\\','/').split('/characterlab/').at(-1);
 const receipt={status:'PASS; SYMBOLIC DECLARATION REPLAY ONLY',original:fp(originalPath),checker:fp(checker),helper:fp('scripts/replay-history-ga-stage-helpers.mjs'),bindingInventory:fp(dir+'/bindings.json'),faults:original.faults,limits:['No scheduler, public admission or runtime component execution. Unavailable old component bytes remain excluded, not replaced by current implementations.']};
 const dest=dir+'/'+originalPath.split('/').at(-1);
 if(fs.existsSync(dest))assert.deepEqual(JSON.parse(fs.readFileSync(dest)),receipt);
 else fs.writeFileSync(dest,JSON.stringify(receipt,null,2)+'\n');
 console.log(JSON.stringify({originalPath,faults:original.faults.length,status:'PASS'}));
}
