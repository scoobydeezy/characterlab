"""Verify recovered sources and exact reverse-extraction reconstructions, without changing originals."""
from pathlib import Path
import hashlib,json,subprocess
O=Path('docs/planning/campaign3-history-embodied-receiving-rev1')
def sha(b):return hashlib.sha256(b).hexdigest()
for name in ['scheduler','requiredProjection','taskDeclarations']:
 for r in json.loads((O/(name+'-recovery.json')).read_text())['matches']:
  assert sha(subprocess.check_output(['git','show',r['gitCommit']+':'+r['gitPath']]))==r['sha256']==sha(Path(r['path']).read_bytes())
for name in ['embodiedAdmission','embodiedTrace']:
 r=json.loads((O/(name+'-reconstruction.json')).read_text());s=Path(r['source']).read_text()
 if name=='embodiedAdmission':
  s=s.replace("import {receivingInputFacts,type ReceivingInputCompilation} from './receivingInputs';\n",'')
  start=s.index(' return beginBodyIngress(original!.events,');end=s.index(' const registrations=',start)
  s=s[:start]+s[end:];s=s.replace('for(const e of events.filter(e=>e.dueAt===instant))','for(const e of original!.events.filter(e=>e.dueAt===instant))')
 else:
  start=s.index(' return compileBodyTraceValidator(');end=s.index(' const d=items(',start);s=s[:start]+s[end:]
  s=s.replace('text(pressureVersion)',"text('embodied-pressure/0.1-candidate')").replace("phase===60n?pressureVersion:name+'/0.1-candidate'","name+'/0.1-candidate'")
 assert sha(s.encode())==r['sha256']==sha(Path(r['path']).read_bytes())
print('Three exact Git sources and two exact SHA256 reverse-extraction reconstructions verified.')
