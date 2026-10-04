"""Capture bounded local provenance searches, or verify the frozen HQ009 receipt."""
from pathlib import Path
import copy, hashlib, json, re, subprocess, sys

P=Path('docs/planning'); O=P/'campaign3-history-hq009-rev1'
PRIOR=P/'campaign3-history-citation-review-rev1/review.json'
PIN='95e93866146fafcde25fa59f7f60ab62c9384f4a'
SOURCE='Docs/CharacterLabMathematicalReference.md'
COPY=P/'campaign3-history-citation-review-rev1/VivariumMathematicalReference.md'

def digest(data): return hashlib.sha256(data).hexdigest()
def sha(path): return digest(Path(path).read_bytes())
def load(path): return json.loads(Path(path).read_text(encoding='utf-8-sig'))
def save(path,value):
    assert not path.exists(), 'Frozen output exists: '+str(path)
    path.write_text(json.dumps(value,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')

def run(args,cwd):
    p=subprocess.run(args,cwd=cwd,capture_output=True)
    return dict(args=args,cwd=Path(cwd).resolve().as_posix(),exitCode=p.returncode,
                stdout=p.stdout.decode('utf-8',errors='replace'),stderr=p.stderr.decode('utf-8',errors='replace'))

def git(repo,args):
    root=Path(repo).resolve().as_posix()
    return run(['git','-c','safe.directory='+root,*args],repo)

if '--capture' in sys.argv:
    assert not O.exists(), 'Use a successor directory for a new search'
    probes=[]
    for repo in ['.','../vivarium']:
        for args in [['rev-parse','HEAD'],['show-ref'],
                     ['log','--all','--format=%H','--',SOURCE,'claude/characterlab-research-log.md','.claude/characterlab-research-log.md']]:
            item=git(repo,args); assert item['exitCode']==0; probes.append(item)
        item=git(repo,['rev-list','--all','--reflog','--objects']); assert item['exitCode']==0
        raw=item.pop('stdout'); item['outputSha256']=digest(raw.encode()); item['outputLines']=len(raw.splitlines())
        item['matchingLines']=[s for s in raw.splitlines() if re.search(r'research.?log|mathematicalreference',s,re.I)]
        item['filter']='case-insensitive research.?log|mathematicalreference over reachable object names'
        probes.append(item)
        item=run(['rg','--files','--hidden','--no-ignore','--iglob','*research*log*',
                  '--iglob','*mathematicalreference*','-g','!.git/**','-g','!node_modules/**'],repo)
        assert item['exitCode'] in [0,1] and not item['stderr']; probes.append(item)
    for args in [['show','--no-patch','--format=fuller',PIN],['show',PIN+':'+SOURCE],
                 ['status','--porcelain','--',SOURCE],['ls-tree','-r','--name-only',PIN]]:
        item=git('../vivarium',args)
        assert item['exitCode']==(128 if args==['show',PIN+':'+SOURCE] else 0)
        if args[0]=='ls-tree':
            raw=item.pop('stdout');item['outputSha256']=digest(raw.encode());item['outputLines']=len(raw.splitlines())
            item['matchingLines']=[s for s in raw.splitlines() if re.search(r'research.?log|mathematicalreference',s,re.I)]
        probes.append(item)
    current=Path('../vivarium')/SOURCE
    assert current.read_bytes()==COPY.read_bytes()
    record=dict(probes=probes,currentComparison=dict(path=current.resolve().as_posix(),sha256=sha(current),bytes=current.stat().st_size),
                retainedComparison=dict(path=COPY.as_posix(),sha256=sha(COPY)),
                scope='Local working filenames including ignored/hidden names; local refs and reflog-reachable object names; exact pinned tree/path. No remote fetch, unreachable-object recovery, arbitrary renamed-content search or global filesystem search.')
    O.mkdir();save(O/'search.json',record)

search=load(O/'search.json'); prior=load(PRIOR)
pending=[x for x in prior['references'] if x['disposition'] in ['EXTERNAL HISTORICAL PROVENANCE UNRESOLVED','LEGACY SOURCE UNLOCATED']]
assert len(pending)==5
rows=[]
for x in pending:
    source=P/'campaign3-history-universe-rev1/sources'/x['source']
    assert sha(source)==x['sourceSha256']
    lines=source.read_text(encoding='utf-8-sig').splitlines(keepends=True)
    assert ''.join(lines[max(0,x['line']-2):x['line']+1])==x['context']
    if x['raw']=='claude/characterlab-research-log.md':
        disposition='UNLOCATED LEGACY SOURCE; NO SUBSTITUTION'
        finding='Exact named legacy log not recovered. Superseded plan remains a hypothesis source; reference/RESEARCH.md is independently retained, not authenticated as the missing file.'
        trigger='Recover authenticated original or independently establish explicit supersession and account its material findings before relying on completeness.'
    elif x['source']=='docs/formal/FORMULA_INTAKE_LEDGER.md':
        disposition='PIN CONTRADICTED BY LOCAL COMMIT TREE; HISTORICAL BYTES UNRECOVERED'
        finding='The commit exists but its tree lacks the named path. Current untracked bytes equal the preserved comparison copy, not a recovered commit snapshot. Do not repair the pin by guessing a date or commit.'
        trigger='Recover authenticated historical source, or explicitly correct-forward its authority and independently reconcile affected material claims under the final history gate.'
    else:
        disposition='UNVERSIONED INVENTORY REFERENCE LOCATED; HISTORICAL IDENTITY STILL UNVERIFIED'
        finding='This occurrence names a formula inventory without asserting a commit. Its current target is present; the earlier review inherited the ledger pin across all four references. Locating this unversioned target does not authenticate the historical version or adopt formulas.'
        trigger='Historical use must identify supported bytes or retain the provenance exclusion; current comparison use must cite its own preserved hash and scope.'
    rows.append(dict(source=x['source'],line=x['line'],raw=x['raw'],sourceSha256=x['sourceSha256'],context=x['context'],
                     disposition=disposition,finding=finding,reopen=trigger,obligation='RO-C3-021'))
expected=dict(status='HQ-009 LOCAL SEARCH AND FIVE OCCURRENCE DISPOSITIONS COMPLETE; PROVENANCE DEBT OPEN',
    predecessor=dict(path=PRIOR.as_posix(),sha256=sha(PRIOR)), searchSha256=sha(O/'search.json'),
    retainedComparison=dict(path=COPY.as_posix(),sha256=sha(COPY)),references=rows,
    obligations=['RO-C3-021'], nextGate='HQ-010 remaining ledger amendments',
    limits=['All five original occurrences remain preserved; three unversioned links are located but historical identity remains unverified.',
            'No historical snapshot equivalence, formula adoption, missing-log replacement or final-history closure.',
            'Search is bounded to the recorded local scope. Negative path/name searches do not prove global absence.',
            'No runtime experiment, verdict, allocation, corpus promotion or architectural ruling.'])

def validate(value):
    assert value==expected
    assert search['currentComparison']['sha256']==sha(COPY)==search['retainedComparison']['sha256']
    pin=[p for p in search['probes'] if p['args'][-2:]==['show',PIN+':'+SOURCE]]
    assert len(pin)==1 and pin[0]['exitCode']==128 and 'not in' in pin[0]['stderr']
    assert len(search['probes'])==14
    assert not any('characterlab-research-log.md' in line.lower() for p in search['probes'] for line in p.get('matchingLines',[]))

validate(expected)
faults=[]
for mode in ['missing-occurrence','invented-pin','substituted-log','lost-limits','missing-obligation']:
    v=copy.deepcopy(expected)
    if mode=='missing-occurrence':v['references'].pop()
    elif mode=='invented-pin':v['references'][3]['disposition']='HISTORICAL BYTES RECOVERED'
    elif mode=='substituted-log':v['references'][4]['finding']='reference/RESEARCH.md is the missing log'
    elif mode=='lost-limits':v['limits']=[]
    else:v['obligations']=[]
    try:validate(v)
    except AssertionError:faults.append(mode)
    else:raise AssertionError(mode)
if '--capture' in sys.argv:save(O/'review.json',expected)
else:validate(load(O/'review.json'))
check=dict(status='PASS SCOPED PROVENANCE ACCOUNTING; HISTORICAL DEBT OPEN',occurrences=5,localProbes=14,
    unversionedInventoryReferences=3,unsupportedSnapshotPins=1,unlocatedLegacyReferences=1,
    faultChecks=faults,reviewSha256=sha(O/'review.json'),checkerSha256=sha(__file__))
if '--capture' in sys.argv:save(O/'check.json',check)
else:assert load(O/'check.json')==check
print(json.dumps(check))
