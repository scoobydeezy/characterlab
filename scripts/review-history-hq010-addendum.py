"""Correct forward the formula excerpt's omitted final line; preserve first receipt."""
from pathlib import Path
import hashlib,json
P=Path('docs/planning');O=P/'campaign3-history-hq010-rev1'
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
source=Path('docs/formal/FORMULA_INTAKE_LEDGER.md')
lines=source.read_bytes().decode('utf-8-sig').splitlines(keepends=True)
assert len(lines)==94 and lines[93].startswith('An upstream Vivarium change')
r=dict(status='CORRECT-FORWARD EXCERPT COMPLETION',
    priorReviewSha256=sha(O/'review.json'),priorCheckSha256=sha(O/'check.json'),
    source=dict(path=source.as_posix(),sha256=sha(source),startLine=94,endLine=94,text=lines[93]),
    finding='The first HQ010 formula excerpt74..93 omitted final line94. Its claim was discussed but not fully source-bound. Preserve that receipt and bind the missing line here.',
    disposition='Upstream changes do not automatically mutate accepted contracts. The claim that the cited pinned snapshot supplies a reproducible basis is unsupported under HQ009; preserve provenance debt and require correct-forward source reconciliation.',
    evidence=dict(path=(P/'CAMPAIGN3_HISTORY_HQ009_CHECKPOINT.md').as_posix(),sha256=sha(P/'CAMPAIGN3_HISTORY_HQ009_CHECKPOINT.md')),
    obligations=['RO-C3-020','RO-C3-021'],checkerSha256=sha(__file__))
out=O/'evidence-addendum.json'
if out.exists():assert json.loads(out.read_text(encoding='utf-8'))==r
else:out.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
print('PASS: final formula line94 bound; earlier excerpt and receipts preserved')
