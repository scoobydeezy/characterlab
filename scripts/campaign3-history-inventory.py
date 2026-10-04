"""Independent, conservative historical evidence census. No RO-driven extraction."""
from pathlib import Path
from collections import Counter,defaultdict
import argparse,hashlib,json,re,urllib.parse
root=Path.cwd();p=Path('docs/planning');out=p/'campaign3-history-universe-rev1'
protocol=Path('docs/formal/CAMPAIGN3_HISTORY_UNIVERSE_PROTOCOL_0_1.md')
script=Path('scripts/campaign3-history-inventory.py')
excluded={protocol.as_posix():'Audit method, not preexisting scientific evidence',
 (p/'RESEARCH_OBLIGATIONS.json').as_posix():'Comparison-only registry; prohibited extraction input',
 (p/'CAMPAIGN3_HISTORY_INVENTORY_CHECKPOINT.md').as_posix():'Post-cutoff audit checkpoint',
 (p/'CAMPAIGN3_HISTORY_ROOT_REVIEW_REV1.json').as_posix():'Post-cutoff audit review',
 (p/'CAMPAIGN3_HISTORY_INVENTORY_CHECK_REV1.json').as_posix():'Post-cutoff verification receipt'}
roots={
 'CharacterLab — Ideal Character Architecture North Star.md':'Governing capabilities/invariants; AGENTS architectural authority1',
 'CHARACTER_ARCHITECTURE.md':'Governing topology/ownership/order; AGENTS authority2',
 'CharacterLab — Ideal Character Research Program Brief.md':'Governing research method/proof burden; AGENTS authority3',
 'CharacterLab — Reference Architecture Build & Research Campaign Plan.md':'Active sequence and exit gates; AGENTS authority5',
 'docs/planning/VERDICT_LEDGER.md':'Active recorded verdicts; each scoped entry requires its own review',
 'docs/planning/SEAM_LEDGER.md':'Active and historical seam routing; not blanket acceptance of old statuses',
 'docs/planning/REFERENCE_MECHANISM_LEDGER.md':'Preservation dispositions and canonical historical source index',
 'reference/RESEARCH.md':'Historical evidence/control root explicitly cited by preservation ledger; not automatic authority',
 'docs/planning/PHENOMENON_CORPUS.md':'Current retained corpus and preserved version history',
 'docs/formal/OPEN_DECISIONS.md':'Formal decision register; acceptance scoped to individual recorded resolutions',
 'docs/formal/FORMULA_INTAKE_LEDGER.md':'Formula hypotheses/intake and scoped accepted dispositions',
 'docs/planning/CAMPAIGN3_PENDING_OWNER_DECISIONS.md':'Recorded owner rulings and scope amendments; zero open is not zero research debt',
 'docs/planning/CAMPAIGN3_DECISION_AND_ESCALATION_POLICY.md':'Owner-directed bounded local decision/escalation policy',
 'docs/planning/RESEARCH_OBLIGATIONS.md':'Process policy; registry data excluded from extraction',
 'docs/planning/CAMPAIGN3_FINAL_HISTORY_GATE.md':'Mandatory final historical reconciliation requirements',
 'docs/planning/CAMPAIGN3_EXIT_RECONCILIATION_READINESS.md':'Accepted active audit work order, not exit approval',
 'docs/planning/CURRENT.md':'Mutable routing only; frozen pre-audit index',
 'AGENTS.md':'Repository authority/directives and historical routing; scientific claims require underlying evidence'}
marker=re.compile(r'\b(?:unresolved|open|partial|deferred|blocked|untested|derived|compressed|merged|retracted|retired|reopen\w*|limitation\w*|unqualified|unearned|supersed\w*|equalit\w*|equivalen\w*)\b|\bnot[ -]required\b|\b(?:no|not)\s+(?:general|universal|native|public|clinical|qualified|claimed|earned|proof|whole|new)\b',re.I)
def sha(b):return hashlib.sha256(b).hexdigest()
def dumps(x):return json.dumps(x,ensure_ascii=False,separators=(',',':'))
def write(path,value):
 with path.open('x',encoding='utf-8',newline='\n') as f:json.dump(value,f,ensure_ascii=False,indent=2);f.write('\n')
def census():
 files=set(root.glob('*.md'))
 for folder in ['docs/planning','docs/formal','reference']:
  files.update(x for x in (root/folder).rglob('*') if x.is_file() and x.suffix.lower() in ['.md','.json'])
 return sorted(x.relative_to(root).as_posix() for x in files if not x.relative_to(root).as_posix().startswith(out.as_posix()+'/') and x.relative_to(root).as_posix() not in excluded)
def load(path):return json.loads(path.read_text(encoding='utf-8-sig'))
def manifest():
 m=load(out/'manifest.json')
 for a in m['method']:assert sha(Path(a['path']).read_bytes())==a['sha256'],a['path']
 return m
def frozen(entry):
 target=Path(entry.get('snapshot',entry['path']));b=target.read_bytes();assert sha(b)==entry['sha256'],entry['path'];return b
parser=argparse.ArgumentParser();parser.add_argument('mode',choices=['freeze','extract','verify']);args=parser.parse_args()
if args.mode=='freeze':
 assert not out.exists(),'Never overwrite a frozen universe';out.mkdir();entries=[]
 for i,name in enumerate(census()):
  b=Path(name).read_bytes();entry={'path':name,'bytes':len(b),'sha256':sha(b),'kind':'Markdown' if name.endswith('.md') else 'StructuredJSON','acceptance':'ROOT_SCOPE_REVIEWED' if name in roots else 'UNASSESSED_CANDIDATE','basis':roots.get(name,'Conservative domain census; no acceptance inferred from name, status or location')}
  if name.endswith('.md'):
   dest=out/'sources'/name;dest.parent.mkdir(parents=True,exist_ok=True);dest.write_bytes(b);entry['snapshot']=dest.as_posix()
  entries.append(entry)
  if (i+1)%2000==0:print('Hashed',i+1,'candidate files',flush=True)
 assert set(roots)<=set(e['path'] for e in entries)
 exclusions=[{'path':name,'reason':why,'sha256':sha(Path(name).read_bytes()) if Path(name).exists() else None} for name,why in excluded.items()]
 m={'version':'campaign3-history-universe/0.1','status':'CANDIDATE UNIVERSE FROZEN; ACCEPTANCE AND RECONCILIATION OPEN','cutoff':'After AuditREV111, before historical inventory checkpoint','registryUsedForSelection':False,'roots':roots,'method':[{'path':f.as_posix(),'sha256':sha(f.read_bytes())} for f in [protocol,script]],'excluded':exclusions,'entries':entries,'counts':dict(Counter(e['kind'] for e in entries))}
 write(out/'manifest.json',m);print(dumps({'status':m['status'],'counts':m['counts'],'bytes':sum(e['bytes'] for e in entries)}))
elif args.mode=='extract':
 m=manifest();assert not (out/'units.jsonl').exists();counts=Counter();ids=set();references=[];names={e['path'] for e in m['entries']};bybase=defaultdict(list)
 for n in sorted(names):bybase[Path(n).name].append(n)
 link=re.compile(r'\]\(([^)]+)\)|`([^`\n]+\.(?:md|json)(?:#[^`\n]*)?)`|(?<![\w/.-])([A-Za-z0-9_][A-Za-z0-9_./-]*\.(?:md|json))')
 def resolve(source,target):
  raw=urllib.parse.unquote(target.strip().strip('<>'));raw=raw.split('#')[0]
  if not raw or re.match(r'^[a-zA-Z]+://',raw):return 'EXTERNAL_OR_ANCHOR',[]
  raw=raw.replace('\\','/');candidate=Path(raw)
  if candidate.suffix.lower() not in ['.md','.json']:return 'OTHER_RESOURCE',[]
  for base in [Path(source).parent,Path('.'),Path('docs/planning'),Path('docs/formal'),Path('reference')]:
   try:q=(root/base/candidate).resolve().relative_to(root).as_posix()
   except ValueError:continue
   if q in names:return 'RESOLVED',[q]
   if q in excluded:return 'EXPLICITLY_EXCLUDED',[q]
  found=bybase.get(candidate.name,[])
  return ('RESOLVED_UNIQUE_BASENAME',found) if len(found)==1 else ('AMBIGUOUS',found) if found else ('MISSING',[])
 with (out/'units.jsonl').open('x',encoding='utf-8',newline='\n') as units,(out/'occurrences.jsonl').open('x',encoding='utf-8',newline='\n') as occurrences:
  def emit(e,location,text,kind,heading=None):
   markers=[{'label':x.group(0),'offset':x.start()} for x in marker.finditer(text)]
   identity=sha(dumps([e['path'],e['sha256'],location,text]).encode());assert identity not in ids;ids.add(identity)
   row={'id':identity,'source':e['path'],'sourceSha256':e['sha256'],'location':location,'kind':kind,'heading':heading,'text':text,'markers':markers,'review':'UNREVIEWED'}
   units.write(dumps(row)+'\n');counts[kind]+=1;counts['units']+=1
   if markers:occurrences.write(dumps(row)+'\n');counts['markedUnits']+=1;counts['markerHits']+=len(markers)
   else:counts['unmarkedUnits']+=1
  for i,e in enumerate(m['entries']):
   b=frozen(e);text=b.decode('utf-8-sig')
   if e['kind']=='Markdown':
    lines=text.splitlines(keepends=True);start=None;block=[];heading=None;blockheading=None
    for n,line in enumerate(lines,1):
     for match in link.finditer(line):
      target=next(x for x in match.groups() if x is not None);status,targets=resolve(e['path'],target);references.append({'source':e['path'],'line':n,'raw':target,'status':status,'targets':targets})
     if line.startswith('#'):heading=line.strip()
     if line.strip():
      if start is None:start=n;blockheading=heading
      block.append(line)
     elif block:emit(e,{'startLine':start,'endLine':n-1},''.join(block),'markdownParagraph',blockheading);start=None;block=[]
    if block:emit(e,{'startLine':start,'endLine':len(lines)},''.join(block),'markdownParagraph',blockheading)
   else:
    obj=json.loads(text)
    def walk(value,pointer=''):
     if isinstance(value,dict):
      for k,v in value.items():walk(v,pointer+'/'+str(k).replace('~','~0').replace('/','~1'))
     elif isinstance(value,list):
      for n,v in enumerate(value):walk(v,pointer+'/'+str(n))
     elif isinstance(value,str):
      if marker.search(value) or len(value.split())>=3 and re.search('[A-Za-z]',value):emit(e,{'pointer':pointer},value,'jsonNarrative')
      else:counts['nonNarrativeStrings']+=1
     else:counts['primitiveBackingValues']+=1
    walk(obj)
   if (i+1)%2000==0:print('Extracted',i+1,'files;',counts['units'],'review units',flush=True)
 write(out/'references.json',{'references':references,'counts':dict(Counter(r['status'] for r in references))})
 files=['manifest.json','units.jsonl','occurrences.jsonl','references.json'];result={'status':'EXTRACTED; ALL SEMANTIC DISPOSITIONS OPEN','manifestSha256':sha((out/'manifest.json').read_bytes()),'registryUsed':False,'counts':dict(counts),'references':dict(Counter(r['status'] for r in references)),'artifacts':[{'path':(out/f).as_posix(),'sha256':sha((out/f).read_bytes())} for f in files]};write(out/'extraction.json',result);print(dumps(result['counts']));print(dumps(result['references']))
else:
 m=manifest();result=load(out/'extraction.json')
 for a in result['artifacts']:assert sha(Path(a['path']).read_bytes())==a['sha256'],a['path']
 for e in m['entries']:frozen(e)
 ids=set();marked=0
 with (out/'units.jsonl').open(encoding='utf-8') as f:
  for line in f:
   x=json.loads(line);assert x['id']==sha(dumps([x['source'],x['sourceSha256'],x['location'],x['text']]).encode());assert x['id'] not in ids;ids.add(x['id']);marked+=bool(x['markers'])
 assert len(ids)==result['counts']['units'] and marked==result['counts']['markedUnits']
 old={e['path']:e for e in m['entries']};now=set(census());changed=[n for n,e in old.items() if not Path(n).exists() or sha(Path(n).read_bytes())!=e['sha256']]
 print(dumps({'status':'FROZEN INVENTORY VERIFIED; SEMANTIC RECONCILIATION OPEN','files':len(old),'units':len(ids),'marked':marked,'liveChanges':changed,'liveAdditions':sorted(now-set(old)),'liveRemovals':sorted(set(old)-now),'registryUsed':False}))
