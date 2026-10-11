"""Consolidate exact frozen chronology occurrences and their reviewed source role."""
from pathlib import Path
from functools import cache
import hashlib,json,collections
P=Path('docs/planning');O=P/'campaign3-history-chronology-consolidated-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
@cache
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def ref(p):return dict(path=Path(p).as_posix(),sha256=sha(p))
def save(p,v):
    if p.exists():assert load(p)==v,p
    else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
def walk(v):
    if isinstance(v,dict):
        if isinstance(v.get('path'),str) and isinstance(v.get('sha256'),str):yield v
        for x in v.values():yield from walk(x)
    elif isinstance(v,list):
        for x in v:yield from walk(x)
last=P/'campaign3-history-chronology-ga-source-closure-rev1/review.json'
reviews=load(last)['priorReviews']+[ref(last)]
assert len(reviews)==47 and len({r['path'] for r in reviews})==47
cp=P/'campaign3-history-chronology-candidates-rev1/occurrences.json';c=load(cp)
originals={r['original']['id']:r['original'] for r in c['rows']};assert len(originals)==1496
source=c['resolvedSource'];assert sha(source['path'])==source['sha256']=='b1b0927aaf66da3cbc6ed85d2fb791c3678530c8d4698b4ac85e4d061fe3309b'
rows=[];inputs=[];findings=[];bindings=0
for rr in reviews:
    assert sha(rr['path'])==rr['sha256'];r=load(rr['path']);base=Path(rr['path']).parent
    fp=base/'findings.json';ch=base/'check.json';check=load(ch)
    embedded=not fp.exists()
    assert not embedded or base.name=='campaign3-history-chronology-tail-rev1'
    f=r if embedded else load(fp)
    finding_ref=rr if embedded else ref(fp)
    finding_key='materialFindings' if embedded else 'findings'
    assert check['reviewedOccurrences' if embedded else 'newOccurrences']==len(r['rows'])
    for bound in walk([r,f,check]):
        assert sha(bound['path'])==bound['sha256'],bound['path'];bindings+=1
    inputs.append(dict(review=rr,findings=finding_ref,findingsPointer='/'+finding_key,check=ref(ch)))
    sections={s['startLine']:s for s in r.get('sections',[])}
    for row_index,row in enumerate(r['rows']):
        original=originals[row['occurrenceId']]
        for key,other in [('source','source'),('sourceSha256','sourceSha256'),('location','location'),('text','text')]:assert row[key]==original[other],(row['occurrenceId'],key)
        section=dict(**r['range'],**row) if embedded else sections[row['sectionStartLine']]
        assert section['startLine']<=row['location']['startLine']<=row['location']['endLine']<=section['endLine']
        assert section['disposition'] and section['acceptanceChain'] and section['obligations']
        pointer=f'/rows/{row_index}' if embedded else f"/sections/{r['sections'].index(section)}"
        rows.append(dict(**row,review=rr,findings=finding_ref,sectionPointer=pointer))
    for i,item in enumerate(f[finding_key]):
        assert item['owner'] and item['blockedClaim'] and item['reopen']
        findings.append(dict(report=finding_ref,pointer=f'/{finding_key}/{i}',disposition=item))
assert len(rows)==len({r['occurrenceId'] for r in rows})==1496
assert {r['occurrenceId'] for r in rows}==set(originals)
rows.sort(key=lambda r:(r['location']['startLine'],r['occurrenceId']))
O.mkdir(exist_ok=True)
save(O/'review.json',dict(status='COMPLETE ORIGINAL CHRONOLOGY COVERAGE; SCIENTIFIC ADEQUACY OPEN',checker=ref(__file__),candidates=ref(cp),resolvedSource=source,inputs=inputs,rows=rows,materialDistinctions=findings,sourceRole=dict(path='docs/planning/CAMPAIGN3_LOG.md',sha256=source['sha256'],category='WHOLE_HISTORICAL_CHRONOLOGY_ROLE_REVIEWED',role='Historical checkpoint narrative, dated instructions and scoped claims',scope='Only the frozen census source is assigned. Exact dated claims are interpreted through the bound section dispositions and later evidence. Routing repetitions are not independent experiments; superseded draft instructions are not current authority. Failed cohorts, narrowed claims and conditional obligations remain. The mutable later log is outside this assignment and requires separate post-cutoff accounting.'),limits=['Full occurrence coverage is not independent scientific adequacy or zero material debt.','No historical runtime writer, behavioral suite or corpus promotion was rerun.','Exact matches of cited current evidence prove byte preservation within these reviews, not availability of every originally cited historical version.','Source-gap consolidation, post-cutoff joins and independent universe/claim review remain required before HQ-012.']))
save(O/'check.json',dict(status='PASS EXACT CHRONOLOGY CONSOLIDATION',reviewBatches=len(reviews),originalOccurrences=len(originals),reviewedOccurrences=len(rows),omitted=0,duplicates=0,materialDistinctionEntries=len(findings),validatedBindings=bindings,review=ref(O/'review.json')))
print(json.dumps(load(O/'check.json')))
