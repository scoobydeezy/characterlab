"""One-shot contextual citation review; never rewrites the frozen census."""
from pathlib import Path
import json, hashlib, subprocess, fnmatch
p=Path('docs/planning'); b=p/'campaign3-history-universe-rev1'; out=p/'campaign3-history-citation-review-rev1'
assert not (out/'review.json').exists(), 'Preserve prior review; create a successor instead'
def load(f): return json.loads(f.read_text(encoding='utf-8-sig'))
def sha(data): return hashlib.sha256(data).hexdigest()
def write(f,obj): f.write_text(json.dumps(obj,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
m=load(b/'manifest.json'); entries={e['path']:e for e in m['entries']}
prior=load(p/'CAMPAIGN3_HISTORY_ROOT_REVIEW_REV1.json'); out.mkdir(exist_ok=True)
commit='95e93866146fafcde25fa59f7f60ab62c9384f4a'; source='Docs/CharacterLabMathematicalReference.md'
cmd=['git','-c','safe.directory=C:/Users/scoob/Documents/GitHub/vivarium','-C','../vivarium']
probe=subprocess.run(cmd+['show',commit+':'+source],capture_output=True)
assert probe.returncode!=0, 'Historical source now available: revise admission explicitly'
data=Path('../vivarium',source).read_bytes(); blob=None
external=out/'VivariumMathematicalReference.md'; external.write_bytes(data)
external_meta={'path':external.as_posix(),'sha256':sha(data),'repository':'../vivarium','claimedCommit':commit,'sourcePath':source,'gitBlob':blob,'bytes':len(data),'authority':'Current working-tree formula inventory only; historical identity UNVERIFIED; no formula adoption inferred','admission':'Supplemental comparison copy, NOT the cited historical snapshot; semantic review OPEN','historicalLookup':{'exitCode':probe.returncode,'stderr':probe.stderr.decode().strip()}}
rows=[]
for old in prior['references']:
 r=dict(old); s=r['source']; raw=r['raw']; name=Path(s).name
 lines=(b/'sources'/s).read_text(encoding='utf-8-sig').splitlines(keepends=True)
 r['context']=''.join(lines[max(0,r['line']-2):r['line']+1]); targets=[]; why=''; status='RESOLVED CITATION ONLY'
 if old['disposition']=='RESOLVED CITATION ONLY': targets=[old['resolvedTarget']]; why=old['rationale']
 elif 'CharacterLabMathematicalReference.md' in raw:
  status='EXTERNAL HISTORICAL PROVENANCE UNRESOLVED'; why='Pinned commit exists but does not contain the cited path. Working-tree comparison copy is preserved separately; no historical equivalence inferred.'; r['comparisonCopy']=external_meta
 elif raw=='claude/characterlab-research-log.md':
  status='LEGACY SOURCE UNLOCATED'; why='Cited path absent. Superseded implementation plan does not prove this source is identical to reference/RESEARCH.md. Preserve the unresolved occurrence under RO-C3-021; no exit waiver.'
 elif name in ['CAMPAIGN2_FACTORY_IMPLEMENTATION.md','CAMPAIGN2_FIRST_MODEL_BYTE_REVIEW.md','CAMPAIGN2_TRACE_COMMITMENT_UPDATE.md']:
  targets=['docs/planning/campaign2-first-model/'+raw]; why='First-model byte review explicitly links this packet; factory cites that review. Trace update expressly preserves the OLD0.1 packet, not replacement0.2 bytes.'
 elif name in ['CAMPAIGN2_MEASUREMENT_MEMORY_DRAFT.md','CAMPAIGN2_MEASUREMENT_MEMORY_M3_DRAFT.md']:
  targets=['docs/planning/campaign2-measurement-evidence-model/registry.json']; why='Parent measurement model registry, before the memory delta; context explicitly reuses inherited203/2 ObserverId role. This does not admit the later memory specimen.'
 elif name=='CAMPAIGN2_MEASUREMENT_MEMORY_MATERIALIZATION_REVIEW.md':
  targets=['docs/planning/campaign2-measurement-memory-blocked-review/'+raw]; why='Review explicitly labels C2-MEM-PACK-002 and digest58a49146718a42ec918787fbce5c5aac86b41b84baeedada7140ee685838ff46 BLOCKED. Retain rejected specimen, not accepted successor.'
 elif name=='CAMPAIGN2_MEASUREMENT_MEMORY_REMATERIALIZATION_REVIEW.md':
  targets=['docs/planning/campaign2-measurement-memory-model/'+raw]; why='Exact adjacent Markdown link identifies accepted successor packet.'
 elif name=='CAMPAIGN3_AGENCY_QUALIFICATION.md':
  targets=['docs/planning/agency-rev2/PRESERVATION.json']; why='Packet directory is immediately before the wrapped filename.'
 elif name=='CAMPAIGN3_LONGITUDINAL_ROUTINE_QUALIFICATION.md':
  targets=['docs/planning/longitudinal-routine-development-rev1/PRESERVATION.json','docs/planning/longitudinal-routine-development-rev2/PRESERVATION.json']; why='Both development cohorts preserve occurrence-adapter rejection and mistaken must-resume-at14 assertion. Plural reference intentionally resolves to two packets.'
 elif name=='CAMPAIGN3_REAPPRAISAL_QUALIFICATION.md':
  targets=['docs/planning/campaign3-reappraisal-model-rev1/FREEZE.json']; why='Reappraisal model freeze has the preserved copied2026-09-22 metadata date; qualification states2026-09-23 without rewriting it.'
 elif name=='LONGITUDINAL_GOAL_IMPLEMENTATION_CHECKPOINT.md':
  targets=['docs/planning/longitudinal-goal-development-rev1/PRESERVATION.json']; why='Immediately preceding line names the preservation directory.'
 elif name=='PUBLIC_WRAPPER_QUIESCENCE_FINDINGS.md':
  targets=['docs/planning/public-wrapper-quiescence-rev1/PRESERVATION.json']; why='Publication repair preservation packet retains1108 artifacts and is used by the preserved-source checker.'
 elif name=='GENERAL_ATTENTION_PAUSE_CHECKPOINT_2026_09_13.md':
  targets=['docs/formal/GENERAL_ATTENTION_'+raw]; why='Shared GENERAL_ATTENTION prefix omitted in prose; adjacent shape manifest and allocation scope identify the exact formal artifact.'
 elif raw=='Brief.md':
  targets=['reference/CharacterLab — Deterministic Cognitive Reference Model Brief.md']; why='Lexical suffix of the full backtick-quoted title split across lines; not an additional file called Brief.md.'
 elif raw=='_PROOF.json':
  status='RESOLVED NAMING CONVENTION'; why='Sentence defines a filename suffix, not a standalone artifact citation. Specific assay references remain independently enumerated.'
 else:
  pattern=None
  if raw=='*_VAL_REFRESH.json': pattern='docs/planning/*_VAL_REFRESH.json'
  elif raw=='*_RESOLUTION.md': pattern='docs/planning/*_RESOLUTION.md'
  elif raw=='BIOLOGY_PUBLIC_RESULT_PART0..3_REV3.json':
   targets=[f'docs/planning/BIOLOGY_PUBLIC_RESULT_PART{i}_REV3.json' for i in range(4)]
  elif raw.startswith('_REV'):
   kind='COMPONENT' if r['line']==6157 else 'PUBLIC'
   pattern=f'docs/planning/DEVELOPMENT_{kind}_RUN_*{raw}'
  else: raise AssertionError((s,raw))
  if pattern:
   targets=sorted(n for n in entries if fnmatch.fnmatchcase(n,pattern) and Path(n).parent==p)
   assert targets,pattern
   r['expandedPattern']=pattern
  status='RESOLVED PATTERN REFERENCE'; why='Explicit wildcard/range in source context, not a missing literal file. Targets are frozen-census matches only; no result acceptance or current execution is inferred.'
 r['disposition']=status; r['rationale']=why
 r['resolvedTargets']=[{'path':t,'sha256':external_meta['sha256'] if t==external.as_posix() else entries[t]['sha256']} for t in targets]
 for t in r['resolvedTargets']: assert sha(Path(t['path']).read_bytes())==t['sha256'],t
 rows.append(r)
assert len(rows)==44 and sum(x['disposition']=='LEGACY SOURCE UNLOCATED' for x in rows)==1
# Supplemental extraction preserves every paragraph; no scientific dispositions assigned.
units=[]; start=None; block=[]
for n,line in enumerate(data.decode('utf-8-sig').splitlines(keepends=True),1):
 if line.strip():
  if start is None: start=n
  block.append(line)
 elif block:
  units.append({'startLine':start,'endLine':n-1,'text':''.join(block),'review':'UNREVIEWED'}); block=[]; start=None
if block: units.append({'startLine':start,'endLine':n,'text':''.join(block),'review':'UNREVIEWED'})
for u in units:
 u['sourceSha256']=external_meta['sha256']; u['id']=sha(json.dumps([external.as_posix(),u],ensure_ascii=False,separators=(',',':')).encode())
write(out/'external-units.json',units)
write(out/'review.json',{'status':'39 LEXICAL CITATIONS DISPOSITIONED; FIVE REFERENCES OPEN; SEMANTIC REVIEW OPEN','predecessor':{'path':(p/'CAMPAIGN3_HISTORY_ROOT_REVIEW_REV1.json').as_posix(),'sha256':sha((p/'CAMPAIGN3_HISTORY_ROOT_REVIEW_REV1.json').read_bytes())},'manifestSha256':sha((b/'manifest.json').read_bytes()),'methodSha256':sha(Path(__file__).read_bytes()),'externalSource':external_meta,'externalUnits':{'path':(out/'external-units.json').as_posix(),'sha256':sha((out/'external-units.json').read_bytes()),'count':len(units)},'obligations':['RO-C3-019','RO-C3-021'],'references':rows,'limits':['No canonical-universe adequacy or scientific-completeness claim','No semantic disposition of original413894 units or supplemental paragraphs','Legacy log remains unlocated; no equality to retained RESEARCH log assumed','No new verdict, allocation, acceptance of rejected specimens or campaign exit'],'developmentNotes':['Initial read-only Git access rejected ownership mismatch; command-scoped safe.directory permitted reading the user-named adjacent repository without changing global configuration.','Initial extraction assumed cited file existed in pinned commit; Git rejected it before any review or external copy was written. Rejected script preserved; successor records working-tree copy without historical identity.']})
print(json.dumps({'citations':len(rows),'dispositioned':39,'unresolved':5,'supplementalParagraphs':len(units),'externalBytes':len(data)}))
