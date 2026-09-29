import fs from 'node:fs';
const dir='docs/planning/defining-public-matrix-rev1';
const folders=fs.readdirSync(dir).filter(n=>n.startsWith('CASE_'));
let baselines=0,complete=0,restores=0;const failures=[],active=[];
for(const name of folders){const files=fs.readdirSync(dir+'/'+name),done=files.includes('RESULT.json');baselines+=Number(files.includes('BASELINE.json'));complete+=Number(done);const count=files.filter(n=>/^PREFIX_\d+\.json$/.test(n)).length;restores+=count;if(!done)active.push({case:Number(name.slice(5)),receipts:count});failures.push(...files.filter(n=>n.startsWith('FAILURE_')).map(n=>name+'/'+n));}
console.log(JSON.stringify({baselines,complete,restores,target:1680,failures,active}));
