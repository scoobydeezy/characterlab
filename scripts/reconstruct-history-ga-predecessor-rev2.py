from pathlib import Path
import json,hashlib,itertools
O=Path('docs/planning/campaign3-history-ga-predecessor-rev1');prior=json.loads((O/'source-reconstruction.json').read_text());rows=[]
for row in prior['rows']:
 if row['recovered']:continue
 p=row['source']['path'];s=Path(p).read_text(encoding='utf-8');variants=[]
 if 'freeze-' in p:
  s=s.replace('general-attention-model-review-rev3','general-attention-model-review-rev2').replace('campaign3-general-attention-model-rev2','campaign3-general-attention-model-rev1').replace('GA_MODEL_IMAGE_REVIEW_REV2_2026_09_19','GA_MODEL_IMAGE_REVIEW_2026_09_19').replace('43','35').replace('129','105').replace('preservation:review.preservation,','');variants=[('remove later preservation field',s)]
 else:
  s='\n'.join(l for l in s.split('\n') if not l.startswith('export const generalFootprintRecipes='));s=s.replace(',...generalFootprintRecipes','').replace(',footprint=generalFootprintRecipes.includes(name)','').replace("footprint?'allocation-spatial':",'').replace("if(footprint){value.encoding.law=name.split('-')[1];value.selection.algorithm='Priority';value.selection.capacity=2;}",'');a=s.index(' if(generalFootprintRecipes.includes(recipeName))');b=s.index(" if(recipeName==='source-consequence-lane')",a);s=s[:a]+s[b:]
  for method,expr in [('parenthesized',s),('original conditional grouping',s.replace("r.name===(credit||name==='source-consequence-lane'?'baseline':name)","r.name===((credit||name==='source-consequence-lane')?'baseline':name)"))]:variants.append((method,expr))
 attempts=[];recovered=None
 for method,s in variants:
  for newline,data in [('LF',s.encode()),('CRLF',s.replace('\n','\r\n').encode())]:
   digest=hashlib.sha256(data).hexdigest();attempts.append(dict(method=method,newline=newline,sha256=digest,bytes=len(data)))
   if digest==row['source']['sha256']:
    dest=O/Path(p).name;dest.write_bytes(data);recovered=dict(path=dest.as_posix(),sha256=digest,bytes=len(data))
 rows.append(dict(source=row['source'],attempts=attempts,recovered=recovered))
v=dict(status='SECOND DIGEST-CONSTRAINED RECONSTRUCTION',predecessor=dict(path=(O/'source-reconstruction.json').as_posix(),sha256=hashlib.sha256((O/'source-reconstruction.json').read_bytes()).hexdigest()),rows=rows,scope='Exact original digest required. Neither Git chronology nor current production replacement is claimed.')
(O/'source-reconstruction-rev2.json').write_text(json.dumps(v,indent=2)+'\n',encoding='utf-8');print([(r['source']['path'],r['recovered']) for r in rows])
