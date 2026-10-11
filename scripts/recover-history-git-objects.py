"""Read-only filename-independent local Git blob recovery by exact target SHA256."""
from pathlib import Path
import json,hashlib,subprocess,collections
P=Path('docs/planning');O=P/'campaign3-history-git-object-recovery-rev1'
assert not O.exists(),'Use a successor directory rather than overwrite the search receipt.'
def digest(b):return hashlib.sha256(b).hexdigest()
def ref(p):return dict(path=Path(p).as_posix(),sha256=digest(Path(p).read_bytes()))
prior=P/'campaign3-history-gap-census-recovery-rev2/review.json'
groups=[g for g in json.loads(prior.read_text(encoding='utf-8'))['groups'] if not g['exactMatches']]
assert len(groups)==229
targets=collections.defaultdict(list)
for g in groups:targets[g['target']['sha256']].append(g['target'])
command=['git','cat-file','--batch-all-objects','--unordered','--batch-check=%(objectname) %(objecttype) %(objectsize)']
scan=subprocess.run(command,capture_output=True,check=True)
objects=[dict(oid=o,kind=k,bytes=int(n)) for o,k,n in (line.split() for line in scan.stdout.decode().splitlines())]
selected=[o for o in objects if o['kind']=='blob' and o['bytes']<50_000_000]
skipped=[o for o in objects if o['kind']=='blob' and o['bytes']>=50_000_000]
O.mkdir();(O/'recovered').mkdir()
process=subprocess.Popen(['git','cat-file','--batch'],stdin=subprocess.PIPE,stdout=subprocess.PIPE,stderr=subprocess.PIPE)
inventory=[];matches=[]
for i,obj in enumerate(selected):
    process.stdin.write((obj['oid']+'\n').encode());process.stdin.flush()
    head=process.stdout.readline().decode().strip().split();assert head==[obj['oid'],'blob',str(obj['bytes'])],head
    data=process.stdout.read(obj['bytes']);assert len(data)==obj['bytes'] and process.stdout.read(1)==b'\n'
    variants={'raw':data}
    if b'\0' not in data:
        lf=data.replace(b'\r\n',b'\n');variants.update(LF=lf,CRLF=lf.replace(b'\n',b'\r\n'))
    hashes={k:digest(v) for k,v in variants.items()}
    inventory.append(dict(**obj,variants=hashes))
    for variant,h in hashes.items():
        if h not in targets:continue
        dest=O/'recovered'/(h+Path(targets[h][0]['path']).suffix)
        if dest.exists():assert dest.read_bytes()==variants[variant]
        else:dest.write_bytes(variants[variant])
        matches.append(dict(objectId=obj['oid'],variant=variant,targets=targets[h],exactBytes=ref(dest)))
    if (i+1)%2000==0:print(json.dumps(dict(blobsScanned=i+1,total=len(selected),matchingVariants=len(matches))),flush=True)
process.stdin.close();assert process.wait()==0;stderr=process.stderr.read().decode()
def save(n,v):(O/n).write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
save('inventory.json',dict(command=command,enumerationSha256=digest(scan.stdout),enumerationStderr=scan.stderr.decode(),objectCount=len(objects),selectedBlobs=inventory,skippedBlobs=skipped,batchStderr=stderr,scope='All objects currently discoverable by local Git, including unreachable objects and alternates exposed by cat-file; no filename filtering. Blobs below50000000 bytes only. Raw bytes plus LF/CRLF variants for NUL-free blobs. No fetch, garbage collection, Git configuration edits or source mutations. Temporary unregistered object files are outside cat-file enumeration.'))
found={t['sha256'] for m in matches for t in m['targets']}
save('review.json',dict(status='EXACT LOCAL GIT OBJECT SEARCH; CLAIM ADEQUACY SEPARATE',checker=ref(__file__),predecessor=ref(prior),inventory=ref(O/'inventory.json'),matches=matches,groups=[dict(target=g['target'],occurrences=g['occurrences'],matches=[m for m in matches if g['target'] in m['targets']],status='EXACT BYTES RECOVERED' if g['target']['sha256'] in found else 'UNRESOLVED AFTER DECLARED GIT OBJECT SEARCH') for g in groups],limits=['Byte recovery does not authenticate historical execution time or establish scientific adequacy.','No global absence claim. Blobs50000000 bytes or larger, temporary unregistered files, remote objects, other repositories and arbitrary non-newline transformations are excluded.','Original missing references and dependent-claim limits remain; exact matched bytes are copied to new evidence files only.'],obligations=['RO-C3-019','RO-C3-020','RO-C3-021']))
save('check.json',dict(status='PASS DECLARED GIT OBJECT RECOVERY',objects=len(objects),blobsScanned=len(selected),largeBlobsSkipped=len(skipped),targetPairs=229,recoveredPairs=sum(g['target']['sha256'] in found for g in groups),remainingPairs=sum(g['target']['sha256'] not in found for g in groups),review=ref(O/'review.json')))
print((O/'check.json').read_text(),flush=True)
