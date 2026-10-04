import {execFileSync} from 'node:child_process';
const limit=50_000_000,args=process.argv.slice(2);
if(args.length>1||(args.length&&!args[0].startsWith('--since=')))throw Error('Usage: node scripts/check-git-file-sizes.mjs [--since=REF]');
const git=(args,input)=>execFileSync('git',args,{encoding:'utf8',input,maxBuffer:64*1024*1024});
const files=args.length?git(['rev-list','--objects',`${args[0].slice(8)}..HEAD`]).trim().split('\n').filter(Boolean).map(s=>{const i=s.indexOf(' ');return [i<0?s:s.slice(0,i),i<0?s:s.slice(i+1)];}):git(['ls-files','--stage','-z']).split('\0').filter(Boolean).map(s=>{const i=s.indexOf('\t');return [s.slice(0,i).split(' ')[1],s.slice(i+1)];});
const objects=[...new Set(files.map(x=>x[0]))];const sizes=new Map(objects.length?git(['cat-file','--batch-check=%(objectname) %(objecttype) %(objectsize)'],objects.join('\n')+'\n').trim().split('\n').map(s=>{const [id,type,size]=s.split(' ');return [id,type==='blob'?Number(size):0];}):[]);
const large=files.filter(([id])=>sizes.get(id)>=limit);
if(large.length){for(const [id,file] of large)console.error(`${sizes.get(id)} bytes: ${file}`);process.exitCode=1;}else console.log(`PASS: ${args.length?'outgoing history':'Git index'} contains no files at or above50,000,000 bytes.`);
