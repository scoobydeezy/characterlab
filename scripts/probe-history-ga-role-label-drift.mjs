import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const fp=path=>({path,sha256:createHash('sha256').update(fs.readFileSync(path)).digest('hex')});
const rows=[],sources=[];
for(const revision of [9,17]){
 const script=`scripts/review-ga-identity-role-closure-rev${revision}.mjs`;
 const packet=`docs/planning/GA_IDENTITY_ROLE_CLOSURE_REV${revision}.json`;
 const text=fs.readFileSync(script,'utf8'),original=JSON.parse(fs.readFileSync(packet));
 const begin=text.indexOf('function validate(p){'),end=text.indexOf('validatePhysical(original);');
 assert(begin>=0&&end>begin);
 const validate=Function('assert','fs','original',text.slice(begin,end)+'\nreturn validatePhysical;')(assert,fs,original);
 validate(original);
 for(const namespace of [1129,1132]){
  const changed=structuredClone(original);changed.positions.find(x=>x.identity==='ConcernOccurrenceId').namespace=namespace;
  assert.throws(()=>validate(changed));rows.push({revision,namespace,rejected:true});
 }
 sources.push(fp(script),fp(packet));
}
const result={status:'PASS; BOTH WRONG NAMESPACES REJECT',rows,sources,checker:fp('scripts/probe-history-ga-role-label-drift.mjs'),finding:'The reuse-appraisal-id-for-concern mutation uses1129 in REV3..9 and1132 in REV10..17. Both remain wrong for Concern1130. The original label is preserved; its later body must not be described as the same appraisal-specific injection. Direct probes show both inspected validators reject both values.',limits:['Symbolic declaration check, not execution of a public identity validator.']};
const out='docs/planning/campaign3-history-ga-identity-roles-rev1/label-drift.json';
if(fs.existsSync(out))assert.deepEqual(JSON.parse(fs.readFileSync(out)),result);else fs.writeFileSync(out,JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify(result.rows));
