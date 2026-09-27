import {execFileSync} from 'node:child_process';import {pathToFileURL} from 'node:url';import path from 'node:path';
const loader=pathToFileURL(path.resolve('scripts/public-wrapper-preserved-source-loader.mjs')).href;
for(const script of ['scripts/check-identity-public-closure.mjs','scripts/check-biology-public-closure.mjs','scripts/check-identity-belief-public-closure.mjs']){
 execFileSync(process.execPath,[script],{stdio:'inherit',env:{...process.env,CHARACTERLAB_HISTORICAL_WRAPPER_CHECK:'1',NODE_OPTIONS:(process.env.NODE_OPTIONS??'')+' --import='+loader}});
}
console.log('PASS preserved-source evidence only. Current repaired behavior requires separate repair receipts.');
