from pathlib import Path
import json,hashlib
p=Path('docs/planning');d=p/'longitudinal-personal-loss-bookkeeping-rev1';d.mkdir(exist_ok=False)
files=[]
for source,name in [(p/'CURRENT.md','CURRENT.md'),(Path('scripts/record-longitudinal-personal-loss-closure.py'),'record-longitudinal-personal-loss-closure.py')]:
 target=d/name;target.write_bytes(source.read_bytes());files.append({'path':target.as_posix(),'sha256':hashlib.sha256(target.read_bytes()).hexdigest()})
finding=p/'LONGITUDINAL_PERSONAL_LOSS_BOOKKEEPING_FINDING_REV1.json'
finding.write_text(json.dumps({'status':'PRESERVED AND CORRECTED','failure':'CURRENT obligation counts are stale','commands':['npm run check:research','node scripts/check-research-obligations.mjs --self-test'],'cause':'Exact table matcher requires spaces after slash delimiters; values1 active/19 conditional/0 unowned were correct.','correction':'Fix CURRENT formatting only; preserve original index and one-time writer. Append original index bytes to chronology before replacement.','scope':'Post-qualification bookkeeping failure, not a development or scientific execution failure. Frozen plan,480 runs,6240 restores,matrix,closure report and AuditREV110 unchanged.','files':files,'obligations':['RO-C3-019','RO-C3-021']},indent=2)+'\n',encoding='utf-8',newline='\n')
current=p/'CURRENT.md'
with (p/'CAMPAIGN3_LOG.md').open('ab') as f:f.write(b'\n\n'+current.read_bytes())
s=current.read_text(encoding='utf-8').replace('**1 active /19 conditional /0 unowned**','**1 active / 19 conditional / 0 unowned**')
s+='\nPost-qualification index-format failure preserved and corrected in\nLONGITUDINAL_PERSONAL_LOSS_BOOKKEEPING_FINDING_REV1.json; scientific receipts unchanged.\n'
current.write_text(s,encoding='utf-8',newline='\n')
registry=p/'RESEARCH_OBLIGATIONS.json';r=json.loads(registry.read_text(encoding='utf-8'));name=finding.as_posix();obs=['RO-C3-019','RO-C3-021'];r['reportReviews'].append({'path':name,'obligations':obs})
for o in r['obligations']:
 if o['id'] in obs:o['evidence'].append(name)
registry.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
print('Preserved exact failed index and writer; corrected delimiter spacing without changing science or audit receipts.')
