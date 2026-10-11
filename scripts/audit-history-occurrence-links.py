"""Bind every original occurrence to an explicit reviewed object or typed schema set."""
from pathlib import Path
from functools import cache
import json,hashlib,collections
P=Path('docs/planning');O=P/'campaign3-history-global-occurrence-links-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
@cache
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def ref(p):return dict(path=Path(p).as_posix(),sha256=sha(p))
def save(p,v):
    if p.exists():assert load(p)==v,p
    else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
ip=P/'campaign3-history-source-roles-rev315/index.json';index=load(ip)
up=P/'campaign3-history-universe-rev1/units.jsonl';original={}
for line in up.open(encoding='utf-8'):
    u=json.loads(line);assert u['id'] not in original;original[u['id']]=u['source']
assert len(original)==413894
pending=list(index['reviewedInputs'])+[x for r in index['roleAssignments'] for x in r['evidence']]
seen={};objects={};schema={}
while pending:
    rr=pending.pop();path=rr['path']
    if path in seen:
        assert seen[path]==rr['sha256'];continue
    assert sha(path)==rr['sha256'],path;seen[path]=rr['sha256'];v=load(path)
    stack=[('',v)]
    while stack:
        pointer,obj=stack.pop()
        if isinstance(obj,dict):
            for key in ['occurrenceId','originalOccurrenceId','originalId','id']:
                oid=obj.get(key)
                if isinstance(oid,str) and oid in original:
                    objects.setdefault(oid,dict(report=path,pointer=pointer,key=key))
            if 'originalOccurrenceIds' in obj and path==str(P/'campaign3-history-receiver-schemas-rev1/review.json').replace('\\','/'):
                ids=obj['originalOccurrenceIds'];assert len(ids)==len(set(ids))==53656
                assert obj['disposition'] and obj['schemas'] and obj['sourceRoles']
                reviewed_sources={s['path'] for s in obj['sourceRoles']}
                for i,oid in enumerate(ids):
                    assert oid in original and original[oid] in reviewed_sources
                    schema[oid]=dict(report=path,pointer=pointer+'/originalOccurrenceIds/'+str(i),key='originalOccurrenceIds')
            p=obj.get('path');h=obj.get('sha256')
            if isinstance(p,str) and isinstance(h,str) and p.startswith('docs/planning/campaign3-history-') and p.endswith('.json') and '/sources/' not in p and 'source-roles-rev' not in p and 'history-universe-' not in p:
                pending.append(dict(path=p,sha256=h))
            stack.extend((pointer+'/'+k.replace('~','~0').replace('/','~1'),x) for k,x in obj.items())
        elif isinstance(obj,list):stack.extend((pointer+'/'+str(i),x) for i,x in enumerate(obj))
    if len(seen)%300==0:print(json.dumps(dict(boundJsonFiles=len(seen),individualIds=len(objects),schemaIds=len(schema))),flush=True)
assert len(objects)==360238 and len(schema)==53656
assert not set(objects)&set(schema)
assert set(objects)|set(schema)==set(original)
reports=[dict(path=p,sha256=h) for p,h in sorted(seen.items())];report_index={r['path']:i for i,r in enumerate(reports)}
links={**objects,**schema};counts=collections.Counter(original.values())
O.mkdir(exist_ok=True);shards=[];ordered=sorted(original)
for offset in range(0,len(ordered),25000):
    rows=[]
    for oid in ordered[offset:offset+25000]:
        w=links[oid];rows.append([oid,report_index[w['report']],w['pointer'],w['key']])
    p=O/f'links-{offset//25000:02d}.json';save(p,dict(columns=['originalOccurrenceId','reportIndex','pointer','identityField'],rows=rows));assert p.stat().st_size<50_000_000
    shards.append(ref(p))
save(O/'review.json',dict(status='COMPLETE ORIGINAL OCCURRENCE LINK COVERAGE; SCIENTIFIC ACCEPTANCE SEPARATE',checker=ref(__file__),sourceIndex=ref(ip),originalUnits=ref(up),reports=reports,shards=shards,bySource=[dict(path=p,occurrences=n) for p,n in sorted(counts.items())],meaning='Every original ID has a concrete location in the hash-bound content-review graph. Individual objects retain their original review schema. Receiver backing IDs belong to the expressly reviewed closed-schema source set. This is an independently reconstructed join, not new content review or proof that every occurrence is a material finding.',limits=['An ID-only link is not scientific acceptance by itself; its source role and bound substantive disposition remain necessary.','No original extraction, source bytes, source-role assignments, failed cohorts or obligations changed.','Repeated quotations and earlier reviews can provide multiple links; one deterministic witness is retained here without adding experimental weight.','Missing historical-source claim restrictions and the owner-directed legacy-log disposition remain in force.','Post-cutoff formula/Values/owner clarifications are separate joins and not added to the413894 original denominator.'],obligations=['RO-C3-019','RO-C3-020','RO-C3-021']))
save(O/'check.json',dict(status='PASS INDEPENDENT GLOBAL OCCURRENCE JOIN',originalOccurrences=413894,individualObjectIds=len(objects),closedSchemaIds=len(schema),omitted=0,duplicateOriginalIds=0,boundJsonFiles=len(reports),shards=len(shards),review=ref(O/'review.json')))
print(json.dumps(load(O/'check.json')))
