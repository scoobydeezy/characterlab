"""HQ003 provenance overlay; not an executable Values qualification."""
from pathlib import Path
import hashlib, json, copy, re
P=Path('docs/planning'); O=P/'campaign3-history-hq003-rev1'; O.mkdir(exist_ok=True)
def sha(p): return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def save(p,v):
    if p.exists(): assert json.loads(p.read_text(encoding='utf-8-sig'))==v
    else: p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
def excerpt(p,a,z):
    ls=Path(p).read_bytes().decode('utf-8-sig').splitlines(keepends=True)
    assert 1<=a<=z<=len(ls)
    return dict(path=p,sha256=sha(p),firstLine=a,lastLine=z,text=''.join(ls[a-1:z]))
sources=[
 excerpt('reference/CharacterLab — Deterministic Cognitive Reference Model Brief.md',1198,1234),
 excerpt('reference/CharacterLab — Deterministic Cognitive Reference Model Brief.md',1630,1634),
 excerpt('reference/RESEARCH.md',77,82),
 excerpt('reference/IMPLEMENTATION_README.md',87,94),
 excerpt('reference/src/model/cycle.ts',1,27),
 excerpt('reference/src/model/types.ts',1,27),
 excerpt('reference/src/model/actions.ts',10,24),
 excerpt('reference/src/model/salience.ts',194,207),
 excerpt('reference/src/model/salience.ts',229,240),
 excerpt('CHARACTER_ARCHITECTURE.md',198,205),
 excerpt('CharacterLab — Ideal Character Research Program Brief.md',2061,2074),
 excerpt('CharacterLab — Reference Architecture Build & Research Campaign Plan.md',136,138),
 excerpt('docs/planning/REFERENCE_MECHANISM_LEDGER.md',177,177),
 excerpt('docs/planning/REFERENCE_MECHANISM_LEDGER.md',189,189),
 excerpt('docs/planning/CAMPAIGN3_REINFORCEMENT_QUALIFICATION.md',9,27),
 excerpt('docs/planning/CAMPAIGN3_TEMPORAL_QUALIFICATION.md',9,25),
]
files=sorted(set(Path('src').rglob('*.ts'))|set(Path('reference/src').rglob('*.ts')))
pattern=re.compile(r'ValueConcept|derived.?Values?|value.?formation|value.?revision|durable.?preferences?',re.I)
scan=[]
for p in files:
    lines=p.read_bytes().decode('utf-8-sig').splitlines()
    scan.append(dict(path=p.as_posix(),sha256=sha(p),matches=[dict(line=i,text=s) for i,s in enumerate(lines,1) if pattern.search(s)]))
save(O/'source-scan.json',dict(pattern=pattern.pattern,files=scan,limit='Current src/reference TypeScript lexical inventory; not proof no implementation exists under another name or in another revision.'))
r=dict(status='HQ-003 PROVENANCE REVIEWED; VALUES QUALIFICATION NOT LOCATED',sources=sources,
 sourceScanSha256=sha(O/'source-scan.json'),queueSourceSha256=sha(P/'campaign3-history-queue-rev1/review.json'),
 dispositions=[
  dict(id='CTL-007',finding='Original section21 supplies a Need-importance/confidence/expectation projection candidate. Section28 formation/revision entries are proposed experiment specifications. The reference log/readme and skipped cycle step do not provide execution receipts for them.',decision='Preserve proposed tests and candidate; do not interpret ledger wording as proof original tests executed.'),
  dict(id='P3-012/value',finding='ValueConcept exists as a semantic category/salience prior, not evidence of a durable Values owner or formation/revision experiment. Temporal goal lifecycle and reinforcement expectations qualify their own phenomena, not Values by relabeling.',decision='Values formation/revision remains an explicit evidence gap; other P3-012 subclaims are outside this batch.'),
  dict(id='authority',finding='Canonical architecture retains Values/Durable Preferences separately. Research Brief26 rejects necessary derivation from Need satisfaction. Build Plan2A requires versioned seams and mutation authority for persistent targets including Values.',decision='Do not select original derivation as law, remove Values, or waive ownership/exit review because all132 Brief clauses are bounded.'),
 ],
 obligations=['RO-C3-019','RO-C3-020','RO-C3-021'],
 nextGate='RO019 final topology/family review must locate a contract, owner and formation/revision/consumer evidence, or explicitly establish admissible scope before exit. If genuinely missing, prepare bounded readiness and comparators under existing architecture. No architectural ruling needed merely to investigate.',
 limits=['Source audit only; no new runtime execution, verdict, allocation or law selection.','Search absence is bounded; no universal claim that Values is absent from every implementation.','HQ003 provenance action disposition is not Values completion, scientific obligation closure or corpus waiver.'])
def validate(v):
 assert len(v['dispositions'])==3 and v['obligations']==['RO-C3-019','RO-C3-020','RO-C3-021']
 for s in v['sources']: assert s==excerpt(s['path'],s['firstLine'],s['lastLine'])
 assert v['sourceScanSha256']==sha(O/'source-scan.json')
 assert v['queueSourceSha256']==sha(P/'campaign3-history-queue-rev1/review.json')
validate(r);save(O/'review.json',r)
faults=[]
for mode in ['changed-source','missing-obligation','missing-disposition','wrong-scan']:
 v=copy.deepcopy(r)
 if mode=='changed-source': v['sources'][0]['text']+='x'
 elif mode=='missing-obligation':v['obligations'].pop()
 elif mode=='missing-disposition':v['dispositions'].pop()
 else:v['sourceScanSha256']='0'*64
 try:validate(v)
 except AssertionError:faults.append(mode)
 else:raise AssertionError(mode)
c=dict(status='PASS PROVENANCE ACCOUNTING; VALUES GAP RETAINED',sourceExcerpts=len(sources),scannedFiles=len(scan),faultChecks=faults,reviewSha256=sha(O/'review.json'),checkerSha256=sha(__file__))
save(O/'check.json',c);print(json.dumps(c))
