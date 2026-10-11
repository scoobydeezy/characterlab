from pathlib import Path
import json,hashlib
P=Path('docs/planning');O=P/'campaign3-history-ga-predecessor-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def ref(p):return dict(path=Path(p).as_posix(),sha256=sha(p))
v=load(P/'campaign3-general-attention-model-rev1/FREEZE.json');proposal=load(v['proposal']['path']);review=load(v['review']['path']);later=load(P/'campaign3-general-attention-model-rev2/FREEZE.json')
for a in [v['proposal'],v['review'],review['proposal']]:assert sha(a['path'])==a['sha256']
assert len(v['models'])==35 and review['models']==35 and review['negativeControls']==105
assert v['sources']==review['reviewedSources'];assert v['versions']==proposal['versions'] and v['budget']==proposal['budget'] and v['seed']==proposal['seed']
def copied(x):return json.loads(json.dumps(x).replace('general-attention-model-review-rev2','campaign3-general-attention-model-rev1'))
assert v['models']==copied(proposal['models']) and v['shared']==copied(proposal['shared'])
images=[*v['shared'].values(),*[a for m in v['models'] for a in m['files'].values()]]
for a in images:assert sha(a['path'])==a['sha256']
assert len(images)==247
for old in v['models']:
 new=next(m for m in later['models'] if m['name']==old['name']);assert old['modelIdentity']==new['modelIdentity'] and old['runIdentity']==new['runIdentity'];assert {k:a['sha256'] for k,a in old['files'].items()}=={k:a['sha256'] for k,a in new['files'].items()}
recovered={r['source']['path']:r['recovered'] for n in ['source-reconstruction.json','source-reconstruction-rev2.json'] for r in load(O/n)['rows'] if r['recovered']};bindings=[]
for a in [*v['sources'],v['script'],review['script']]:
 q=a['path'];status='CURRENT BYTES EXACT'
 if sha(q)!=a['sha256']:
  r=recovered.get(q)
  if r:q=r['path'];assert sha(q)==a['sha256'];status='RECONSTRUCTED BYTES EXACT'
  else:q=None;status='HISTORICAL SOURCE BYTES UNRESOLVED'
 bindings.append(dict(source=a,resolvedPath=q,status=status))
missing=[a['source'] for a in bindings if a['resolvedPath'] is None];assert len(missing)==2
receipt=dict(status='EXACT35 MODEL/RUN IMAGES VERIFIED; TWO HISTORICAL IMPLEMENTATION SOURCES UNRESOLVED',freeze=ref(P/'campaign3-general-attention-model-rev1/FREEZE.json'),proposal=v['proposal'],review=v['review'],images=247,models=35,bindings=bindings,unresolved=missing,laterEvidence=ref(P/'campaign3-history-ga-freeze-rev1/canonical-check.json'),scope=['247 original frozen images hash-verified and copied exactly from35-model proposal. Each old model/run and constituent image preserved in later43-model cohort.','Later independently rechecked43-model image qualification supports these model images without authenticating every old producer byte.','Historical105-negative-control report remains a scoped historical receipt;not a fresh replay of its old script.','Missing definition source and old review script block full historical implementation-byte reproduction,not continued material-claim reconciliation. No source hash substituted.'],checkerSha256=sha(__file__))
f=O/'predecessor-image-check.json'
if f.exists():assert load(f)==receipt
else:f.write_text(json.dumps(receipt,indent=2)+'\n',encoding='utf-8')
print(json.dumps(dict(models=35,images=247,bindings=len(bindings),unresolved=missing)))
