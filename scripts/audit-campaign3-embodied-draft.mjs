// Research arithmetic only: no runtime transition or model implementation.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const hash=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
// All example amounts/rates are exact multiples of 1/6 U.
const S=6n, C=100n*S, H=60n*S;
const max=(a,b)=>a>b?a:b;
const amount=(q,r,t)=>max(0n,q-r*t);
const bin=(q,w)=>{assert(w>0n&&C%w===0n&&q>=0n&&q<=C);const l=q===C?C-w:(q/w)*w;return [l,l+w];};
const pressureNumerator=u=>max(0n,H-u); // denominator H, deliberately unreduced
const checks=[];
const check=(name,actual,expected)=>{assert.deepEqual(actual,expected,name);checks.push(name);};
check('A equal initial levels, different kinetics',[amount(80n*S,S,10n),amount(80n*S,2n*S,10n)],[70n*S,60n*S]);
check('B exact thirds partition',amount(amount(amount(80n*S,2n,1n),2n,1n),2n,1n),amount(80n*S,2n,3n));
check('B exact final amount',amount(80n*S,2n,3n),79n*S);
check('C depletion then replenishment',amount(amount(2n*S,S,3n)+5n*S,S,1n),4n*S);
check('D overflow contrast',[5n*S-(C-95n*S),9n*S-(C-95n*S)],[0n,4n*S]);
check('E hidden level alias',bin(41n*S,20n*S),bin(49n*S,20n*S));
check('E permitted upper endpoint',pressureNumerator(bin(41n*S,20n*S)[1]),0n);
check('F coarse/fine pressure numerators',[pressureNumerator(bin(45n*S,20n*S)[1]),pressureNumerator(bin(45n*S,10n*S)[1])],[0n,H/6n]);
check('G endpoint bins',[bin(0n,20n*S),bin(20n*S,20n*S),bin(C,20n*S)],[[0n,20n*S],[20n*S,40n*S],[80n*S,C]]);
assert.throws(()=>bin(0n,0n));assert.throws(()=>bin(0n,3n*S));
const prior=JSON.parse(fs.readFileSync('docs/planning/COGNITIVE_QUALIFICATION_EVIDENCE_REV1.json'));
for(const f of prior.checks)assert.equal(hash(f.path),f.sha256,f.path);
const suite=JSON.parse(fs.readFileSync('docs/planning/COGNITIVE_FINAL_SUITE_RECEIPT_REV1.json'));
for(const f of suite.sourceFingerprints)assert.equal(hash(f.path),f.sha256,f.path);
const draft='docs/planning/CAMPAIGN3_EMBODIED_MOTIVATION_DRAFT.md';
const script='scripts/audit-campaign3-embodied-draft.mjs';
const report={status:'DRAFT EXAMPLE ARITHMETIC CONSISTENT; EMB-A..O NOT PASSED',checks,
  invalidWidthChecks:2,preservedChecks:prior.checks.length,
  limitation:'Exact scaled-integer checks of finite examples only. No public execution, semantic acceptance, partition theorem proof or full-suite rerun.',
  draft:{path:draft,sha256:hash(draft)},script:{path:script,sha256:hash(script)}};
fs.writeFileSync('docs/planning/CAMPAIGN3_EMBODIED_DRAFT_AUDIT_REV1.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({status:report.status,arithmeticChecks:checks.length+2,preservedChecks:prior.checks.length}));
