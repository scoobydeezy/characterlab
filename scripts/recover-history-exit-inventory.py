from pathlib import Path
import collections,hashlib,json,subprocess
P=Path('docs/planning');O=P/'campaign3-history-exit-inventory-rev1';O.mkdir(exist_ok=True)
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def digest(b):return hashlib.sha256(b).hexdigest()
def ref(p):return dict(path=Path(p).as_posix(),sha256=digest(Path(p).read_bytes()))
def save(name,v):
 p=O/name
 if p.exists():assert load(p)==v
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
def archive(raw):
 p=O/'sources'/f'{digest(raw)}.md';p.parent.mkdir(exist_ok=True)
 if p.exists():assert p.read_bytes()==raw
 else:p.write_bytes(raw)
 return ref(p)
items=collections.defaultdict(list);snapshots=[]
for rev in range(1,112):
 path=P/f'CAMPAIGN3_EXIT_AUDIT_REV{rev}.json';v=load(path);snapshots.append(ref(path))
 for i,x in enumerate(v['inventory']):items[x['path'],x['sha256']].append(dict(revision=rev,pointer=f'/inventory/{i}'))
assert len(items)==820 and len({p for p,h in items})==468 and len({h for p,h in items})==819
ip=P/'campaign3-history-source-roles-rev172/index.json';ix=load(ip);manifest=P/'campaign3-history-universe-rev1/manifest.json';m=load(manifest)
aliases=collections.defaultdict(list)
for e in m['entries']:aliases[e['sha256']].append((P/'campaign3-history-universe-rev1/sources'/e['path']).as_posix())
for e in ix['explicitBackingOutsideProseManifest']:aliases[e['sha256']].append(e['path'])
cache={}
def sha(p):
 if p not in cache:cache[p]=digest(Path(p).read_bytes())
 return cache[p]
found={};pending=collections.defaultdict(set)
for path,h in items:
 candidates=[path,(P/'campaign3-history-universe-rev1/sources'/path).as_posix(),*aliases[h]]
 match=next((f for f in candidates if Path(f).is_file() and sha(f)==h),None)
 if match:found[path,h]=dict(method='EXACT AVAILABLE FILE BY SHA256; ROLE NOT INFERRED FROM ALIAS',bytes=ref(match))
 else:pending[path].add(h)
known=len(found);attempts=[]
def inspect(path,raw,basis):
 targets=pending[path]
 for mode,data in [('raw',raw),('LF',raw.replace(b'\r\n',b'\n')),('CRLF',raw.replace(b'\r\n',b'\n').replace(b'\n',b'\r\n'))]:
  if not targets:return
  h=digest(data)
  if h in targets:
   found[path,h]=dict(method='EXACT WHOLE BYTES' if mode=='raw' else 'EXACT INVENTORY HASH AFTER NEWLINE RECONSTRUCTION',basis=basis,newlineMode=mode,bytes=archive(data));targets.remove(h)
  state=hashlib.sha256();offset=0
  for line in data.splitlines(keepends=True):
   core=line.rstrip(b'\r\n');ending=line[len(core):];state.update(core);offset+=len(core)
   for suffix in [b'',b'\n',b'\r\n',b'\n\n',b'\r\n\r\n']:
    candidate=state.copy();candidate.update(suffix);h=candidate.hexdigest()
    if h in targets:
     content=data[:offset]+suffix;assert digest(content)==h
     found[path,h]=dict(method='EXACT INVENTORY-BOUND PREFIX RECONSTRUCTION; NOT HISTORICAL TIMESTAMP PROOF',basis=basis,newlineMode=mode,prefixBytes=offset,suffixHex=suffix.hex(),bytes=archive(content));targets.remove(h)
   state.update(ending);offset+=len(ending)
for path in sorted(pending):inspect(path,Path(path).read_bytes(),dict(kind='CURRENT SOURCE',**ref(path)))
after_current=len(found)
for path in sorted(pending):
 if not pending[path]:continue
 result=subprocess.run(['git','log','--all','--format=%H','--',path],capture_output=True,check=True)
 commits=result.stdout.decode().splitlines();attempts.append(dict(path=path,commits=commits,command='git log --all --format=%H -- exact-path'))
 for commit in commits:
  if not pending[path]:break
  blob=subprocess.run(['git','show',f'{commit}:{path}'],capture_output=True)
  if blob.returncode:attempts.append(dict(path=path,commit=commit,status='PATH UNAVAILABLE AT COMMIT',stderr=blob.stderr.decode(errors='replace')));continue
  inspect(path,blob.stdout,dict(kind='REACHABLE GIT PATH BLOB',commit=commit,path=path,sha256=digest(blob.stdout)))
rows=[]
for (path,h),occ in sorted(items.items()):rows.append(dict(path=path,sha256=h,occurrences=occ,resolution=found.get((path,h),dict(method='UNRECOVERED AFTER DECLARED EXACT/PREFIX/REACHABLE-GIT SEARCH; NOT GLOBAL ABSENCE'))))
summary=dict(pathHashPairs=820,distinctPaths=468,distinctHashes=819,inventoryOccurrences=sum(map(len,items.values())),exactAvailableFiles=known,currentPrefixReconstructions=after_current-known,gitBasedRecoveries=len(found)-after_current,resolvedPairs=len(found),unresolvedPairs=820-len(found),newFiles=len(list((O/'sources').glob('*.md'))))
save('review.json',dict(status='HISTORICAL INVENTORY BYTE RECONCILIATION; SEMANTIC/FINAL ADEQUACY OPEN',checker=ref(__file__),sourceIndex=ref(ip),manifest=ref(manifest),snapshots=snapshots,rows=rows,gitSearches=attempts,summary=summary,limits=['Exact byte matches authenticate the inventory commitment only; no alias or repeated hash grants source authority or scientific completeness.','Prefix/newline reconstructions are labeled as such, not recovered historical timestamps or proof of original inspection. Only exact target SHA256 matches are saved; no guessed edits.','Reachable Git exact-path history searched; no remote fetch, unreachable-object, renamed-path or global filesystem search. Unrecovered does not mean nonexistent.','No original audit, source, model, trace or verdict is modified. No simulation/tests/build or source-role promotion. Supporting source semantics and independent HQ011 adequacy remain open.'],obligations=['RO-C3-019','RO-C3-020','RO-C3-021']))
assert all(ref(x['path'])==x for x in snapshots)
assert all(p.stat().st_size<50000000 for p in O.rglob('*') if p.is_file())
save('check.json',dict(status='PASS; DECLARED BYTE SEARCH ACCOUNTED, UNRESOLVED IDENTITIES RETAINED',review=ref(O/'review.json'),summary=summary,sourceRolesPromoted=0))
print(json.dumps(summary))
