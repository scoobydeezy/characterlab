"""Inspect unregistered temporary Git objects without changing the Git directory."""
from pathlib import Path
import json,hashlib,subprocess,zlib
P=Path('docs/planning');O=P/'campaign3-history-temporary-object-recovery-rev1';assert not O.exists()
def sha(b):return hashlib.sha256(b).hexdigest()
def ref(p):return dict(path=Path(p).as_posix(),sha256=sha(Path(p).read_bytes()))
prior=P/'campaign3-history-git-object-recovery-rev1/review.json';groups=[g for g in json.loads(prior.read_text())['groups'] if not g['matches']];assert len(groups)==208
targets={g['target']['sha256'] for g in groups}
cmd=['rg','--files','--hidden','--no-ignore','.git/objects','-g','tmp_obj_*'];run=subprocess.run(cmd,capture_output=True,check=True)
paths=sorted(run.stdout.decode().splitlines());O.mkdir();(O/'recovered').mkdir();records=[];matches=[]
for name in paths:
    p=Path(name);raw=p.read_bytes();record=dict(source=ref(p),compressedBytes=len(raw))
    try:
        decoder=zlib.decompressobj();expanded=decoder.decompress(raw,50_000_100)
        if not decoder.eof:
            record['status']='SKIPPED incomplete stream or expanded size cap';records.append(record);continue
        header,data=expanded.split(b'\0',1);kind,n=header.split(b' ',1);assert int(n)==len(data)
        record.update(kind=kind.decode(),bytes=len(data),objectId=hashlib.sha1(expanded).hexdigest())
        if kind!=b'blob' or len(data)>=50_000_000:
            record['status']='SKIPPED nonblob or size cap';records.append(record);continue
        variants={'raw':data}
        if b'\0' not in data:
            lf=data.replace(b'\r\n',b'\n');variants.update(LF=lf,CRLF=lf.replace(b'\n',b'\r\n'))
        record['variants']={k:sha(v) for k,v in variants.items()};record['status']='CHECKED'
        for k,value in variants.items():
            h=sha(value)
            if h not in targets:continue
            ts=[g['target'] for g in groups if g['target']['sha256']==h];dest=O/'recovered'/(h+Path(ts[0]['path']).suffix)
            if dest.exists():assert dest.read_bytes()==value
            else:dest.write_bytes(value)
            matches.append(dict(source=ref(p),objectId=record['objectId'],variant=k,targets=ts,exactBytes=ref(dest)))
    except (zlib.error,ValueError,AssertionError) as e:record.update(status='INVALID OBJECT STREAM',error=type(e).__name__+': '+str(e))
    records.append(record)
def save(n,v):(O/n).write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
found={t['sha256'] for m in matches for t in m['targets']}
save('review.json',dict(status='READ-ONLY TEMPORARY OBJECT SEARCH',checker=ref(__file__),predecessor=ref(prior),command=cmd,commandStderr=run.stderr.decode(),objects=records,matches=matches,remainingTargets=[g['target'] for g in groups if g['target']['sha256'] not in found],obligations=['RO-C3-019','RO-C3-020','RO-C3-021'],limits=['Temporary filenames alone do not authenticate content. Only valid blob bodies matching exact requested SHA256 recover an identity.','Expanded bodies at least50000000 bytes and incomplete/corrupt streams excluded. No Git writes, deletion, cleanup, network or historical execution.','No target-less legacy-log discovery or global-absence claim; matching bytes still require content/claim disposition.']))
save('check.json',dict(status='PASS DECLARED TEMPORARY OBJECT SEARCH',temporaryFiles=len(records),checkedBlobs=sum(x['status']=='CHECKED' for x in records),recoveredPairs=sum(g['target']['sha256'] in found for g in groups),remainingPairs=sum(g['target']['sha256'] not in found for g in groups),review=ref(O/'review.json')))
print((O/'check.json').read_text())
