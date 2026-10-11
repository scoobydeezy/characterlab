"""Read-only closure verifiers; records fresh integrity checks, not fresh runs."""
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
import hashlib,json,subprocess,shutil
O=Path('docs/planning/campaign3-hq012-corpus-checks-rev1')
assert not O.exists()
O.mkdir()
names=['epi','learn','reason','decision','commit','bio','body-ownership']
def run(name):
    p=Path('scripts')/f'check-{name}-closure.mjs'
    r=subprocess.run([shutil.which('node'),str(p)],capture_output=True,text=True,encoding='utf-8',timeout=300)
    return dict(command=['node',p.as_posix()],checkerSha256=hashlib.sha256(p.read_bytes()).hexdigest(),
        exitCode=r.returncode,stdout=r.stdout,stderr=r.stderr,
        scope='Fresh receipt/source integrity check; preserved experiments and test counts are not fresh execution.')
with ThreadPoolExecutor(max_workers=3) as pool: rows=list(pool.map(run,names))
(O/'check.json').write_text(json.dumps(dict(status='PASS' if all(r['exitCode']==0 for r in rows) else 'FAIL',commands=rows),ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
print(json.dumps([(r['command'][1],r['exitCode']) for r in rows]))
