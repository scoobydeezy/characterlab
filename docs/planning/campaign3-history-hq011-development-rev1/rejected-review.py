"""Independent census reconstruction and explicit review-coverage accounting.
No registry input, automatic source acceptance, or semantic all-clear.
"""
from pathlib import Path
from collections import Counter, defaultdict
import hashlib,json,re,sys,copy
P=Path('docs/planning');B=P/'campaign3-history-universe-rev1';O=P/'campaign3-history-hq011-rev1'
def sha(p):
    h=hashlib.sha256()
    with Path(p).open('rb') as f:
        for chunk in iter(lambda:f.read(1024*1024),b''):h.update(chunk)
    return h.hexdigest()
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def save(p,v):
    if p.exists():assert load(p)==v,p
    else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
def encoded(v):return json.dumps(v,ensure_ascii=False,separators=(',',':')).encode()
# The declared protocol predicate, implemented here without importing the extractor.
marker=re.compile(r'\b(?:unresolved|open|partial|deferred|blocked|untested|derived|compressed|merged|retracted|retired|reopen\w*|limitation\w*|unqualified|unearned|supersed\w*|equalit\w*|equivalen\w*)\b|\bnot[ -]required\b|\b(?:no|not)\s+(?:general|universal|native|public|clinical|qualified|claimed|earned|proof|whole|new)\b',re.I)
def identity(source,digest,location,text):return hashlib.sha256(encoded([source,digest,location,text])).hexdigest()
def exact_members(actual,expected):
    assert len(actual)==len(set(actual)), 'duplicate occurrence'
    assert set(actual)==set(expected), 'missing or extra occurrence'

if '--capture' in sys.argv:
    assert not O.exists(), 'Preserve the existing receipt'
    m=load(B/'manifest.json');extraction=load(B/'extraction.json')
    entries={e['path']:e for e in m['entries']};assert len(entries)==len(m['entries'])
    assert not m['registryUsedForSelection'] and not extraction['registryUsed']
    assert 'docs/planning/RESEARCH_OBLIGATIONS.json' not in entries
    for a in m['method']+extraction['artifacts']:assert sha(a['path'])==a['sha256'],a['path']
    # Index only explicit primary review records. Evidence arrays are never reviews.
    review_specs=[('formula-review','records'),('queue','amendments'),('hq010','rows')]
    unit_links=defaultdict(list);bindings=[]
    for name,key in review_specs:
        path=P/f'campaign3-history-{name}-rev1/review.json';r=load(path);bindings.append(dict(path=path.as_posix(),sha256=sha(path)))
        for row in r[key]:unit_links[row['occurrenceId']].append(dict(report=path.as_posix(),recordField=key))
    fragment_links=[]
    for name in ['mechanisms','corpus','proposals','controls','retirements','limitations','intake-crosswalk']:
        path=P/f'campaign3-history-{name}-rev1/review.json';r=load(path);bindings.append(dict(path=path.as_posix(),sha256=sha(path)))
        for row in r.get('items',r.get('rows',[])):
            s=row['source'];entry=entries[s['path']];assert s['sha256']==entry['sha256']
            lines=Path(entry.get('snapshot',entry['path'])).read_bytes().decode('utf-8-sig').splitlines(keepends=True)
            assert ''.join(lines[s['startLine']-1:s['endLine']])==s['text']
            fragment_links.append(dict(report=path.as_posix(),source=s['path'],startLine=s['startLine'],endLine=s['endLine']))
    actual=defaultdict(lambda:dict(count=0,marked=0,fingerprint=hashlib.sha256()))
    ids=set();marked_ids=set();coverage=[];markdown=[]
    with (B/'units.jsonl').open(encoding='utf-8') as f:
        for line in f:
            u=json.loads(line);entry=entries[u['source']]
            assert u['sourceSha256']==entry['sha256']
            assert u['id']==identity(u['source'],u['sourceSha256'],u['location'],u['text'])
            assert u['id'] not in ids;ids.add(u['id'])
            flags=[dict(label=x.group(),offset=x.start()) for x in marker.finditer(u['text'])]
            assert u['markers']==flags
            a=actual[u['source']];a['count']+=1;a['marked']+=bool(flags);a['fingerprint'].update(bytes.fromhex(u['id']))
            if flags:marked_ids.add(u['id'])
            if u['kind']=='markdownParagraph':markdown.append(dict(id=u['id'],source=u['source'],**u['location'],marked=bool(flags)))
            if u['id'] in unit_links:coverage.append(dict(id=u['id'],source=u['source'],location=u['location'],marked=bool(flags),reviews=unit_links[u['id']]))
    assert set(unit_links)<=ids
    occurrence_ids=[]
    with (B/'occurrences.jsonl').open(encoding='utf-8') as f:
        for line in f:occurrence_ids.append(json.loads(line)['id'])
    exact_members(occurrence_ids,marked_ids)
    source_counts=[]
    for n,e in enumerate(m['entries']):
        path=e.get('snapshot',e['path']);assert sha(path)==e['sha256'],path
        text=Path(path).read_bytes().decode('utf-8-sig');fingerprint=hashlib.sha256();count=0
        def emit(location,value):
            global count
            count+=1;fingerprint.update(bytes.fromhex(identity(e['path'],e['sha256'],location,value)))
        if e['kind']=='Markdown':
            lines=text.splitlines(keepends=True);begin=None
            for i,line in enumerate(lines+[''],1):
                if line.strip():
                    if begin is None:begin=i
                elif begin is not None:
                    emit(dict(startLine=begin,endLine=i-1),''.join(lines[begin-1:i-1]));begin=None
        else:
            def visit(v,pointer=''):
                if isinstance(v,dict):
                    for k,x in v.items():visit(x,pointer+'/'+str(k).replace('~','~0').replace('/','~1'))
                elif isinstance(v,list):
                    for i,x in enumerate(v):visit(x,pointer+'/'+str(i))
                elif isinstance(v,str) and (marker.search(v) or len(v.split())>=3 and re.search('[A-Za-z]',v)):
                    emit(dict(pointer=pointer),v)
            visit(json.loads(text))
        a=actual[e['path']];assert count==a['count'] and fingerprint.digest()==a['fingerprint'].digest(),e['path']
        source_counts.append(dict(path=e['path'],kind=e['kind'],units=count,marked=a['marked'],unmarked=count-a['marked'],
                                  authority= 'ROOT ROLE ONLY; CLAIM REVIEW STILL REQUIRED' if e['path'] in m['roots'] else 'CANDIDATE; NO BLANKET ACCEPTANCE',
                                  explicitOccurrenceReviews=sum(x['source']==e['path'] for x in coverage)))
        if (n+1)%3000==0:print('Reconstructed',n+1,'source files',flush=True)
    # Fragment review is useful but cannot silently cover the rest of a table paragraph.
    mapped_fragments=[]
    for frag in fragment_links:
        hits=[u for u in markdown if u['source']==frag['source'] and u['startLine']<=frag['startLine'] and u['endLine']>=frag['endLine']]
        assert len(hits)==1,frag
        mapped_fragments.append({**frag,'parentOccurrenceId':hits[0]['id'],'wholeParentReviewed':False})
    assert len(ids)==extraction['counts']['units'] and len(marked_ids)==extraction['counts']['markedUnits']
    faults=[]
    for name,values in [('omission',['a']),('duplicate-marker',['a','a']),('foreign-unit',['a','c'])]:
        try:exact_members(values,['a','b'])
        except AssertionError:faults.append(name)
        else:raise AssertionError(name)
    totals=dict(files=len(entries),units=len(ids),marked=len(marked_ids),unmarked=len(ids)-len(marked_ids),
                explicitOccurrenceLinked=len(coverage),explicitMarked=sum(x['marked'] for x in coverage),
                withoutExplicitOccurrenceLink=len(ids)-len(coverage),reviewFragments=len(mapped_fragments),
                fragmentParentUnits=len({x['parentOccurrenceId'] for x in mapped_fragments}),
                roots=len(m['roots']),nonRootCandidates=len(entries)-len(m['roots']))
    report=dict(status='MECHANICAL RECONSTRUCTION PASS; HQ-011 SCIENTIFIC ADEQUACY OPEN',totals=totals,
        bindings=[dict(path=(B/'manifest.json').as_posix(),sha256=sha(B/'manifest.json')),dict(path=(B/'extraction.json').as_posix(),sha256=sha(B/'extraction.json'))]+bindings,
        sourceAccounting=source_counts,explicitOccurrenceLinks=coverage,fragmentReviews=mapped_fragments,
        reviewCoverageScope='Explicit primary occurrence IDs from formula/queue/HQ010 plus primary fragments from seven named ledger reviews. Other HQ reports supply scoped scientific comparisons and citations; those are not silently promoted to whole-parent occurrence reviews.',
        findings=[
          'All frozen source files, including files with zero extracted units, independently reconstruct the declared paragraph/JSON-selection inventory.',
          'Marked occurrence membership is checked as an exact duplicate-free set. The older checker checks membership/count but not uniqueness of that subset; immutable artifact hashes protect the existing receipt, not generic extractor completeness.',
          'Filename census and18 root roles establish candidate inclusion/relevance, not accepted authority for11373 files. Acceptance/supersession and scientific adequacy remain necessary.',
          'Evidence excerpts, report presence, table-row coverage and an occurrence review with retained debt are not scientific closure. No count here means resolved findings.',
          'JSON selection can omit substantive short prose such as Needs review, while longer diagnostic labels can be included. This is a protocol boundary, not proof those examples occur in the corpus.',
          'Markdown references omit suffixless citations and code/assets outside the census. Hash-bound backing evidence is not independent acceptance or proof-chain review.',
          'HQ009 retains unauthenticated formula snapshot and missing legacy log. Supplemental343 formula paragraphs and post-cutoff additions require separate admission/accounting; they are not retroactively counted here.'
        ],faultChecks=faults,obligations=['RO-C3-019','RO-C3-020','RO-C3-021'],
        nextGate='Continue HQ-011: authority-scoped source acceptance and substantive occurrence dispositions; do not advance to exit from census counts.',
        limits=['No runtime tests, behavioral matrix, new verdict, corpus approval or source acceptance by filename.',
                'The independent implementation checks the same declared lexical selection rule; it cannot prove semantic completeness.',
                'Unlinked units are not all material findings. Candidates and repetitive backing narrative require explicit scoped disposition, not automatic exclusion or universal manual rereading.'])
    O.mkdir();save(O/'review.json',report)
else:report=load(O/'review.json')
for b in report['bindings']:assert sha(b['path'])==b['sha256'],b['path']
check=dict(status=report['status'],totals=report['totals'],faultChecks=report['faultChecks'],reviewSha256=sha(O/'review.json'),checkerSha256=sha(__file__))
save(O/'check.json',check);print(json.dumps(check))
