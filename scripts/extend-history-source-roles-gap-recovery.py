from pathlib import Path
import json,hashlib,collections
P=Path('docs/planning');O=P/'campaign3-history-source-roles-rev286'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
base=P/'campaign3-history-source-roles-rev285/index.json';v=load(base)
v['version']='campaign3-history-source-roles/0.286';v['predecessor']=ref(base)
for name in ['gap-census-recovery','gap-workspace-recovery']:v['reviewedInputs'].append(ref(P/f'campaign3-history-{name}-rev1/review.json'))
v['rules'].append('REV286 consolidates33 declared gap reports/279 target entries/204 distinct pairs. Four already-recovered identities verified; remaining200 have no exact match in163 matching-basename workspace files under raw/LF/CRLF variants. Original reports preserved; this is bounded search, not global absence or claim closure. Missing no-hash references and scientific adequacy remain open.')
O.mkdir(exist_ok=True)
for n,x in [('index.json',v)]:
 p=O/n
 if p.exists():assert load(p)==x
 else:p.write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
c=dict(status=v['status'],candidateFiles=len(v['roleAssignments'])+len(v['unassignedCandidatePaths']),assignedSources=len(v['roleAssignments']),unassignedWithinThisIndex=len(v['unassignedCandidatePaths']),originalNarrativeOrFindingOccurrences=v['originalNarrativeOrFindingOccurrences'],originalBackingOccurrences=v['originalBackingFieldOccurrences'],explicitArchivesOutsideCensus=len(v['explicitBackingOutsideProseManifest']),indexSha256=ref(O/'index.json')['sha256'],checkerSha256=ref(__file__)['sha256'])
(O/'check.json').write_text(json.dumps(c,indent=2)+'\n',encoding='utf-8',newline='\n');print(json.dumps(c))
