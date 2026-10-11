"""Search sister-repo bytes and local tree entries, including unreachable objects."""
from pathlib import Path
import json,hashlib,subprocess,re
P=Path('docs/planning');O=P/'campaign3-history-sister-object-recovery-rev1';assert not O.exists()
def sha(b):return hashlib.sha256(b).hexdigest()
def ref(p):return dict(path=Path(p).as_posix(),sha256=sha(Path(p).read_bytes()))
prior=P/'campaign3-history-git-object-recovery-rev1/review.json'
groups=[g for g in json.loads(prior.read_text())['groups'] if not g['matches']];assert len(groups)==208
targets={g['target']['sha256'] for g in groups}
O.mkdir();(O/'recovered').mkdir();runs=[];matches=[];tree_hits=[]
for repo in [Path('.').resolve(),Path('../vivarium').resolve()]:
    prefix=['git','-c','safe.directory='+repo.as_posix(),'-C',str(repo)]
    cmd=prefix+['cat-file','--batch-all-objects','--unordered','--batch-check=%(objectname) %(objecttype) %(objectsize)']
    result=subprocess.run(cmd,capture_output=True,check=True)
    objects=[dict(oid=o,kind=k,bytes=int(n)) for o,k,n in (line.split() for line in result.stdout.decode().splitlines())]
    selected=[o for o in objects if o['bytes']<50_000_000 and (o['kind']=='tree' or (repo.name.lower()=='vivarium' and o['kind']=='blob'))]
    proc=subprocess.Popen(prefix+['cat-file','--batch'],stdin=subprocess.PIPE,stdout=subprocess.PIPE,stderr=subprocess.PIPE)
    entries=[]
    for obj in selected:
        proc.stdin.write((obj['oid']+'\n').encode());proc.stdin.flush()
        header=proc.stdout.readline().decode().strip().split();assert header==[obj['oid'],obj['kind'],str(obj['bytes'])]
        data=proc.stdout.read(obj['bytes']);assert len(data)==obj['bytes'] and proc.stdout.read(1)==b'\n'
        item=dict(**obj,sha256=sha(data))
        if obj['kind']=='tree':
            offset=0
            while offset<len(data):
                end=data.index(b'\0',offset);mode,name=data[offset:end].split(b' ',1);oid=data[end+1:end+21].hex();assert len(oid)==40
                if re.search(rb'research.?log',name,re.I):tree_hits.append(dict(repository=repo.as_posix(),tree=obj['oid'],mode=mode.decode(),name=name.decode('utf-8',errors='replace'),objectId=oid))
                offset=end+21
            assert offset==len(data)
        else:
            variants={'raw':data}
            if b'\0' not in data:
                lf=data.replace(b'\r\n',b'\n');variants.update(LF=lf,CRLF=lf.replace(b'\n',b'\r\n'))
            item['variants']={k:sha(v) for k,v in variants.items()}
            for k,b in variants.items():
                h=sha(b)
                if h not in targets:continue
                ts=[g['target'] for g in groups if g['target']['sha256']==h];dest=O/'recovered'/(h+Path(ts[0]['path']).suffix)
                if dest.exists():assert dest.read_bytes()==b
                else:dest.write_bytes(b)
                matches.append(dict(repository=repo.as_posix(),objectId=obj['oid'],variant=k,targets=ts,exactBytes=ref(dest)))
        entries.append(item)
    proc.stdin.close();assert proc.wait()==0
    runs.append(dict(repository=repo.as_posix(),command=cmd,enumerationSha256=sha(result.stdout),enumerationStderr=result.stderr.decode(),batchStderr=proc.stderr.read().decode(),objects=len(objects),checked=entries,largeObjectsSkipped=[o for o in objects if o['bytes']>=50_000_000]))
def save(n,v):(O/n).write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
save('inventory.json',dict(runs=runs,scope='All cat-file-discoverable local trees in CharacterLab and Vivarium, plus all Vivarium blobs below50MB. Tree basenames matched research.?log case-insensitively. Main repository blobs are covered by the predecessor; not repeated here. Safe-directory supplied per command, not saved to Git configuration.'))
found={t['sha256'] for m in matches for t in m['targets']}
save('review.json',dict(status='SISTER BLOB AND BOTH REPOSITORY TREE SEARCH',checker=ref(__file__),predecessor=ref(prior),inventory=ref(O/'inventory.json'),matches=matches,legacyTreeCandidates=tree_hits,remainingTargets=[g['target'] for g in groups if g['target']['sha256'] not in found],limits=['Exact hash recovery only; tree basename matches are candidates, not authenticated missing logs.','No remote fetch, arbitrary legacy-content recognition, >=50MB object inspection, Git mutation or global-absence claim.','No original runtime/build execution or source-role/claim adequacy promotion.'],obligations=['RO-C3-019','RO-C3-020','RO-C3-021']))
save('check.json',dict(status='PASS DECLARED SISTER/TREE SEARCH',repositories=len(runs),trees=sum(o['kind']=='tree' for r in runs for o in r['checked']),sisterBlobs=sum(o['kind']=='blob' for r in runs for o in r['checked']),legacyTreeCandidates=len(tree_hits),recoveredPairs=sum(g['target']['sha256'] in found for g in groups),remainingPairs=sum(g['target']['sha256'] not in found for g in groups),review=ref(O/'review.json')))
print((O/'check.json').read_text())
