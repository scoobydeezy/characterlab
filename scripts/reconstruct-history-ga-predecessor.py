from pathlib import Path
import json,hashlib
O=Path('docs/planning/campaign3-history-ga-predecessor-rev1');O.mkdir(exist_ok=True)
expected={r['source']['path']:r['source']['sha256'] for r in json.loads(Path('docs/planning/campaign3-history-ga-freeze-rev1/source-recovery.json').read_text())['rows']}
rows=[]
for p,wanted in expected.items():
 s=Path(p).read_text(encoding='utf-8');base=s
 if 'materialize-' in p:s=s.replace('general-attention-model-review-rev3','general-attention-model-review-rev2')
 elif 'freeze-' in p:s=s.replace('general-attention-model-review-rev3','general-attention-model-review-rev2').replace('campaign3-general-attention-model-rev2','campaign3-general-attention-model-rev1').replace('GA_MODEL_IMAGE_REVIEW_REV2_2026_09_19','GA_MODEL_IMAGE_REVIEW_2026_09_19').replace('43','35').replace('129','105')
 else:
  s='\n'.join(l for l in s.split('\n') if not l.startswith('export const generalFootprintRecipes='))
  s=s.replace(',...generalFootprintRecipes','').replace(',footprint=generalFootprintRecipes.includes(name)','').replace("footprint?'allocation-spatial':",'').replace("if(footprint){value.encoding.law=name.split('-')[1];value.selection.algorithm='Priority';value.selection.capacity=2;}",'')
  a=s.index(' if(generalFootprintRecipes.includes(recipeName))');b=s.index(" if(recipeName==='source-consequence-lane')",a);s=s[:a]+s[b:]
 variants=[('LF',s.encode()),('CRLF',s.replace('\n','\r\n').encode())];attempts=[];recovered=None
 for newline,data in variants:
  digest=hashlib.sha256(data).hexdigest();attempts.append(dict(newline=newline,sha256=digest,bytes=len(data)))
  if digest==wanted:
   dest=O/Path(p).name;dest.write_bytes(data);recovered=dict(path=dest.as_posix(),sha256=digest,bytes=len(data))
 rows.append(dict(source=dict(path=p,sha256=wanted),currentSha256=hashlib.sha256(Path(p).read_bytes()).hexdigest(),method='Reverse explicit footprint cohort extension and revision/count literals; test LF and CRLF. Full precommitted SHA256 equality required;not Git provenance.',attempts=attempts,recovered=recovered))
v=dict(status='DIGEST-CONSTRAINED PREDECESSOR RECONSTRUCTION',rows=rows,scope='No production source or frozen receipt edited. Failed variants are not recovered historical evidence.')
(O/'source-reconstruction.json').write_text(json.dumps(v,indent=2)+'\n',encoding='utf-8');print([(r['source']['path'],bool(r['recovered'])) for r in rows])
