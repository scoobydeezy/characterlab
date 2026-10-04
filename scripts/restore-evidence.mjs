import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {createGunzip} from 'node:zlib';
import {Transform, Writable} from 'node:stream';
import {pipeline} from 'node:stream/promises';

export async function digest(file) {
 const hash=createHash('sha256');let bytes=0;
 for await(const chunk of fs.createReadStream(file)){hash.update(chunk);bytes+=chunk.length;}
 return {sha256:hash.digest('hex'),bytes};
}
function within(root,relative){
 if(typeof relative!=='string'||path.isAbsolute(relative)||relative.includes('\\')||relative.split('/').some(p=>!p||p==='..'||p==='.'))throw Error('Invalid evidence path');
 const full=path.resolve(root,relative);if(!full.startsWith(path.resolve(root)+path.sep))throw Error('Evidence path escapes repository');return full;
}
function match(actual,expected,label){if(actual.sha256!==expected.sha256||actual.bytes!==expected.bytes)throw Error(`${label}: hash or length mismatch`);}
export async function restoreOne(root,entry,verifyOnly=false){
 const target=within(root,entry.path),archive=within(root,entry.archive.path);
 if(!Number.isSafeInteger(entry.bytes)||entry.bytes<0||!Number.isSafeInteger(entry.archive.bytes)||entry.archive.bytes<0)throw Error('Invalid evidence size');
 match(await digest(archive),entry.archive,entry.archive.path);
 const exists=fs.existsSync(target);if(exists)match(await digest(target),entry,entry.path);
 let tempDir,temp;const hash=createHash('sha256');let bytes=0;
 try{
  if(!exists&&!verifyOnly){fs.mkdirSync(path.dirname(target),{recursive:true});tempDir=fs.mkdtempSync(path.join(path.dirname(target),'.restore-evidence-'));temp=path.join(tempDir,'verified-output');}
  const check=new Transform({transform(chunk,encoding,done){bytes+=chunk.length;if(bytes>entry.bytes)return done(Error('Decompressed evidence exceeds declared size'));hash.update(chunk);done(null,chunk);}});
  await pipeline(fs.createReadStream(archive),createGunzip(),check,temp?fs.createWriteStream(temp,{flags:'wx'}):new Writable({write(chunk,encoding,done){done();}}));
  match({bytes,sha256:hash.digest('hex')},entry,entry.path);
  // Publish verified bytes without replacing a file created by another process.
  if(temp)fs.linkSync(temp,target);
  return exists?'already verified':verifyOnly?'archive verified':'restored';
 }finally{if(temp&&fs.existsSync(temp))fs.unlinkSync(temp);if(tempDir)fs.rmdirSync(tempDir);}
}
export async function main(args){
 if(args.some(a=>a!=='--verify'))throw Error('Usage: node scripts/restore-evidence.mjs [--verify]');
 const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
 const manifest=JSON.parse(fs.readFileSync(path.join(root,'evidence-archives/manifest.json'),'utf8'));
 if(manifest.version!==1)throw Error('Unsupported evidence archive version');
 for(const entry of manifest.files)console.log(`${await restoreOne(root,entry,args.includes('--verify'))}: ${entry.path}`);
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))main(process.argv.slice(2)).catch(e=>{console.error(e.message);process.exitCode=1;});
