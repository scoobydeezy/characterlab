"""Join existing substantive post-cutoff reviews; independently verify exact coverage."""
from pathlib import Path
from functools import cache
import json,hashlib,re
P=Path('docs/planning');O=P/'campaign3-history-post-cutoff-join-rev1'
def digest(b):return hashlib.sha256(b).hexdigest()
@cache
def sha(p):return digest(Path(p).read_bytes())
@cache
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=sha(p))
def checkref(r):assert sha(r['path'])==r['sha256'],r['path']
def save(p,v):
    if p.exists():assert load(p)==v,p
    else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
def identity(path,h,loc,value):return digest(json.dumps([path,h,loc,value],ensure_ascii=False,separators=(',',':')).encode())
def leaves(v,p=''):
    if isinstance(v,dict):
        for k,x in v.items():yield from leaves(x,p+'/'+k.replace('~','~0').replace('/','~1'))
    elif isinstance(v,list):
        for i,x in enumerate(v):yield from leaves(x,p+'/'+str(i))
    else:yield p,v
names=['external-formulas','values-addition','values-backing','values-development','verdict-spine']
paths={n:P/f'campaign3-history-{n}-rev1/review.json' for n in names}
reports={n:load(p) for n,p in paths.items()}
formula=reports['external-formulas'];checkref(formula['source']);checkref(formula['inventory'])
units=load(formula['inventory']['path']);rows=formula['rows'];assert len(rows)==len(units)==343
assert len({x['occurrenceId'] for x in rows})==343
assert {x['id'] for x in units}=={x['occurrenceId'] for x in rows}
byid={x['id']:x for x in units};lines=Path(formula['source']['path']).read_bytes().decode('utf-8-sig').splitlines(keepends=True)
for r in rows:
    u=byid[r['occurrenceId']]
    assert r['sourceSha256']==formula['source']['sha256']==u['sourceSha256']
    assert r['text']==u['text']==''.join(lines[r['location']['startLine']-1:r['location']['endLine']])
    assert r['disposition'] and r['obligations']
values=reports['values-addition'];assert len(values['rows'])==90
assert len({r['occurrenceId'] for r in values['rows']})==90
for s in values['sourceRoles']:
    checkref(s);raw=Path(s['path']).read_bytes().decode('utf-8-sig')
    expected=[]
    for m in re.finditer(r'\S[\s\S]*?(?=\r?\n[ \t]*\r?\n|\Z)',raw):
        loc=dict(startLine=raw[:m.start()].count('\n')+1,endLine=raw[:m.end()].count('\n')+1)
        expected.append((identity(s['path'],s['sha256'],loc,m.group()),loc,m.group()))
    actual=[r for r in values['rows'] if r['source']==s['path']]
    assert len(actual)==len(expected)==s['paragraphs']
    assert [(r['occurrenceId'],r['location'],r['text']) for r in actual]==expected
    assert all(r['disposition'] and r['obligations'] for r in actual)
string_counts={};source_count={}
for name in ['values-backing','values-development']:
    report=reports[name];groups=[]
    if name=='values-backing':
        for s in report['shards']:
            checkref(s);shard=load(s['path']);groups.append((shard['source'],shard['rows']))
    else:
        for s in report['sourceRoles']:groups.append((s,[r for r in report['rows'] if r['source']==s['path']]))
    total=0;allids=set()
    for source,records in groups:
        checkref(source);expected={p:v for p,v in leaves(load(source['path'])) if isinstance(v,str)}
        assert len(records)==len(expected)
        assert {r['location']['pointer'] for r in records}==set(expected)
        for r in records:
            value=expected[r['location']['pointer']]
            assert r['valueSha256']==digest(value.encode())
            assert r['occurrenceId']==identity(source['path'],source['sha256'],r['location'],value)
            assert r.get('judgment',r.get('role'))
            assert r['occurrenceId'] not in allids;allids.add(r['occurrenceId'])
        total+=len(records)
    source_count[name]=len(groups);string_counts[name]=total
assert source_count=={'values-backing':512,'values-development':24}
assert string_counts=={'values-backing':77414,'values-development':16622}
development=reports['values-development']
for b in development['exactBindings']:
    checkref(b['actual']);assert b['actual']['sha256']==b['original']['sha256']
checkref(development['unresolved'])
gaps=load(P/'campaign3-history-gap-census-recovery-rev2/review.json')
unresolved={(g['target']['path'],g['target']['sha256']) for g in gaps['groups'] if not g['exactMatches']}
for g in load(development['unresolved']['path'])['search']:assert (g['path'],g['sha256']) in unresolved
old=P/'campaign3-history-universe-rev1/sources/docs/planning/VERDICT_LEDGER.md';current=P/'VERDICT_LEDGER.md'
before=old.read_bytes();after=current.read_bytes();delta=reports['verdict-spine']['delta']
assert after.startswith(before) and len(before)==delta['unchangedPrefixBytes']
assert sha(old)==delta['frozenSha256'] and sha(current)==delta['currentSha256']
assert after[len(before):].decode('utf-8')==delta['appendedText']
assert delta['addedVerdicts']==['VER-C3-VALUES-001','VER-C3-VALUES-PUBLIC-001']
assert len(re.findall(rb'^## `?(VER-[A-Z0-9-]+)',before,re.M))==106
assert len(re.findall(rb'^## `?(VER-[A-Z0-9-]+)',after,re.M))==108
assert [x['case'] for x in values['readinessCrosswalk'] if x['status'].startswith('PARTIAL')]==[2,3,7]
O.mkdir(exist_ok=True)
save(O/'review.json',dict(status='NAMED POST-CUTOFF REVIEWS JOINED; INDEPENDENT ADEQUACY OPEN',checker=ref(__file__),inputs=[ref(p) for p in paths.values()],sourceIndex=ref(P/'campaign3-history-source-roles-rev314/index.json'),gapInventory=ref(P/'campaign3-history-gap-census-recovery-rev2/review.json'),counts=dict(formulaParagraphs=343,valuesNarrativeParagraphs=90,valuesRunSources=512,valuesRunStringOccurrences=77414,valuesDevelopmentSources=24,valuesDevelopmentStringOccurrences=16622,exactDevelopmentBindings=1029,unresolvedDevelopmentBindings=2,addedVerdicts=2),dispositions=[dict(subject='Historical formula inventory',supported='All343 preserved paragraphs reviewed through68 topics and seven exact arithmetic witness groups. Current bytes support candidate comparison.',blockedClaim='Authentication of the absent file at the cited Vivarium commit, production parity, automatic adoption or universal scalar/vector law.',owner='RO-C3-021',reopen='Recover exact historical identity or adopt an explicit correct-forward provenance disposition with independent material-finding review.',evidence=[ref(paths['external-formulas']),ref(P/'campaign3-history-hq009-rev1/review.json')]),dict(subject='Values bounded component and native admission',supported='Separate expectation/preference/Need/goal; four retained laws; exact externally committed component and native prefix evidence. Same-instant3/8 difference and5/8 equality remain distinct from native different-time contexts.',blockedClaim='Physical outcome-feedback/hidden-world intervention, autonomous goal completion/retirement, learned category recognition, appraisal or developmental integration, general overlap handling or irreducible Value necessity.',owner='RO-C3-019',reopen='A required stronger phenomenon is implemented and qualified; cases2/3 and autonomous portion of7 are not discharged by current bounded matrices.',evidence=[ref(paths['values-addition']),ref(paths['values-backing'])]),dict(subject='Values development provenance',supported='Correct-forward failures and exact rejected sources remain;1029 exact bindings support their stated scopes. Both remaining early source hashes are joined to the refreshed gap inventory.',blockedClaim='Reconstruction or expanded build scope for the two unrecovered early source versions; erasing earlier adapter/import/test failures.',owner='RO-C3-020',reopen='Recover exact versions or independently bound affected historical claims without altering original receipts.',evidence=[ref(paths['values-development'])]),dict(subject='Verdict ledger delta',supported='Exact106-verdict prefix unchanged; only two Values verdicts appended for108 total. Frozen AuditREV111 remains historical.',blockedClaim='Treating old exit audit as a current108-verdict acceptance or declaring HQ011/HQ012 complete from this delta.',owner='RO-C3-021',reopen='Independent historical adequacy and subsequent corpus/family/native freshness gates pass.',evidence=[ref(paths['verdict-spine'])])],limits=['No original census sources or occurrence totals changed. Supplemental paragraphs, string backing and ledger additions are distinct denominators, not additive independent findings.','The15 previously reviewed finding fields overlap the24-source development review; retain original references without counting them as additional experiments.','Existing source reviews remain exact immutable evidence; dated OPEN routing is not erased by this join.','This joins the named formula/Values/verdict additions, not every later audit-generated document or all no-hash gaps. Final universe and scientific adequacy remain open.','No original runtime writer, simulation, build or corpus promotion rerun.'],obligations=['RO-C3-010','RO-C3-019','RO-C3-020','RO-C3-021']))
save(O/'check.json',dict(status='PASS EXACT POST-CUTOFF JOIN',review=ref(O/'review.json'),formulaParagraphs=343,valuesNarrativeParagraphs=90,validatedBackingStrings=sum(string_counts.values()),backingSources=sum(source_count.values()),exactBindings=1029,preservedUnresolvedBindings=2,unchangedFrozenVerdicts=106,addedVerdicts=2,originalCensusOccurrencesAdded=0))
print(json.dumps(load(O/'check.json')))
