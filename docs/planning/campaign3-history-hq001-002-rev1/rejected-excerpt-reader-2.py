"""Source review overlay; checks accounting, not scientific adequacy."""
from pathlib import Path
import copy
import hashlib
import json
import re

P = Path('docs/planning')
OUT = P / 'campaign3-history-hq001-002-rev1'
OUT.mkdir(exist_ok=True)

def sha(path):
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()

def load(path):
    return json.loads(Path(path).read_text(encoding='utf-8-sig'))

def frozen(path, value):
    if path.exists():
        assert load(path) == value, str(path)
    else:
        path.write_text(json.dumps(value, ensure_ascii=False, indent=2)+'\n', encoding='utf-8', newline='\n')

def excerpt(path, first, last):
    lines = Path(path).read_bytes().decode('utf-8-sig').splitlines(keepends=True)
    assert 1 <= first <= last <= len(lines)
    return dict(path=path, sha256=sha(path), firstLine=first, lastLine=last,
                text=''.join(lines[first-1:last]))

sources = [
    excerpt('reference/RESEARCH.md', 37, 46),
    excerpt('reference/RESEARCH.md', 741, 819),
    excerpt('reference/src/ui/state/useEngine.ts', 305, 389),
    excerpt('reference/src/ui/state/useEngine.ts', 429, 459),
    excerpt('reference/src/model/cycle.ts', 688, 744),
    excerpt('reference/src/model/actions.ts', 135, 170),
    excerpt('reference/src/experiments/learnedSatisfaction.ts', 1, 44),
    excerpt('reference/src/experiments/saturationCounterfactual.ts', 99, 110),
    excerpt('reference/src/test/phase2_5Saturation.test.ts', 69, 122),
    excerpt('reference/src/model/decision.ts', 1, 36),
    excerpt('reference/src/model/identity.ts', 232, 278),
    excerpt('reference/src/model/cycle.ts', 912, 986),
    excerpt('reference/src/test/phase2_9Identity.test.ts', 155, 191),
    excerpt('reference/src/test/phase2_9IdentityFormation.test.ts', 1, 93),
    excerpt('docs/planning/REFERENCE_MECHANISM_LEDGER.md', 144, 148),
    excerpt('docs/planning/REFERENCE_MECHANISM_LEDGER.md', 209, 209),
]

# Search scope is explicit. No assertion that all branches, deleted files or other
# repositories have been searched, or that keyword absence proves nonexistence.
files = sorted(x for x in Path('reference/src').rglob('*') if x.suffix in ('.ts', '.tsx'))
pattern = re.compile(r'projectTrait|isConsolidated|trait.?bonus|independent.?bonus|separate.?bonus', re.I)
scan = []
for path in files:
    lines = path.read_bytes().decode('utf-8-sig').splitlines()
    scan.append(dict(path=path.as_posix(), sha256=sha(path),
                     matches=[dict(line=i, text=line) for i, line in enumerate(lines, 1) if pattern.search(line)]))
frozen(OUT/'source-scan.json', dict(pattern=pattern.pattern, files=scan,
    limit='Current reference/src TypeScript only; search supports inspection, not proof a mutant never existed.'))

prior = [P/'campaign3-history-hq001-rev1'/name for name in ('review.json', 'tests.json', 'source-manifest.json', 'check.json')]
prior += [P/'campaign3-history-counterexamples-rev1'/name for name in ('review.json', 'tests.json', 'source-manifest.json', 'check.json')]
prior += [P/'campaign3-history-queue-rev1/review.json']
for directory in ('campaign3-history-hq001-rev1', 'campaign3-history-counterexamples-rev1'):
    for entry in load(P/directory/'source-manifest.json')['files']:
        assert sha(entry['path']) == entry['sha256']

review = dict(
    status='HQ-001/002 SOURCE AUDITS DISPOSITIONED; PROOF LIMITS RETAINED',
    counters=[1508, 0], newRuntimeExecutions=0,
    priorEvidence=[dict(path=x.as_posix(), sha256=sha(x)) for x in prior],
    sourceScanSha256=sha(OUT/'source-scan.json'), sources=sources,
    queueDispositions=[
        dict(id='HQ-001', status='AUDIT DISPOSITION COMPLETE; HISTORICAL CLAIMS PARTIALLY VERIFIED',
             findings=[
                 'UI scripted action commits result.nextState; later autonomous action reads that character and records probabilities. Read-only counterfactual panel does not commit its trained branch.',
                 'Autonomous evaluation reads learned expectations, but also current urgency and accessibility-selected candidates. Source connectivity is not an executed proof of monotonically increasing preference or a sampled preference trajectory.',
                 'Single-shot same-seed capacity sweep proves clipped observations and naive confidence growth at total saturation. Fresh-prior censored and naive means are equal: the sweep does not itself prove recovery of true efficacy.',
                 'Multi-step A/B has distinct seed addresses. Preserve within-timeline naive/censored coupling, finite divergence reduction, and original precision corrections. Do not claim identical realized effects across A/B or generally unbiased efficacy.',
                 'Upper-bound avoidance remains a forced-experience/read-only probability witness; no sampled autonomous avoidance claim.'],
             remaining='Before claiming exact integrated monotone preference or capacity-independent efficacy, supply matched executable evidence or explicitly exclude the stronger claim. No corpus gate waived.',
             obligations=['RO-C3-010', 'RO-C3-020', 'RO-C3-021']),
        dict(id='HQ-002', status='AUDIT DISPOSITION COMPLETE; AUTHENTICATED BONUS MUTANT UNLOCATED',
             findings=[
                 'Named traits are projections of identity evidence. Projection/consolidation and acquired-label tests verify those semantics, not an added-bonus counterexample.',
                 'Decision source explicitly scopes personality-source integration as absent in this historical implementation. Later identity contribution joins compatible ordinary pressure; a second trait bonus is prohibited.',
                 'No authenticated executed extra-trait-bonus mutant was located in this scoped review. RET-012 remains a derived-state/prohibition disposition, not a newly demonstrated mutant failure.'],
             remaining='Retain provenance gap. A future empirical claim that an extra trait bonus fails requires an identified mutant, baseline and execution receipt; no need to implement a prohibited mechanism merely to clear this audit.',
             obligations=['RO-C3-009', 'RO-C3-020', 'RO-C3-021']),
    ],
    limits=['Prior 29-test and 55-test receipts reverified by source/hash, not rerun.',
            'No scientific obligation closed, historical receipt rewritten, new verdict or production change.',
            'Queue overlay does not modify original queue or satisfy full-history/final corpus gates.'],
)

def validate(value):
    assert [x['id'] for x in value['queueDispositions']] == ['HQ-001', 'HQ-002']
    assert value['newRuntimeExecutions'] == 0
    for x in value['sources']:
        assert x == excerpt(x['path'], x['firstLine'], x['lastLine'])
    for x in value['priorEvidence']:
        assert sha(x['path']) == x['sha256']
    assert value['sourceScanSha256'] == sha(OUT/'source-scan.json')

validate(review)
frozen(OUT/'review.json', review)
faults=[]
for name in ('altered-excerpt', 'false-receipt-hash', 'missing-queue-item', 'invented-fresh-execution'):
    changed=copy.deepcopy(review)
    if name == 'altered-excerpt': changed['sources'][0]['text'] += 'x'
    elif name == 'false-receipt-hash': changed['priorEvidence'][0]['sha256'] = '0'*64
    elif name == 'missing-queue-item': changed['queueDispositions'].pop()
    else: changed['newRuntimeExecutions'] = 29
    try: validate(changed)
    except AssertionError: faults.append(name)
    else: raise AssertionError(name)
check=dict(status='PASS SOURCE/RECEIPT ACCOUNTING; SCIENTIFIC LIMITS RETAINED',
           sourceExcerpts=len(sources), scannedFiles=len(files), faultChecks=faults,
           reviewSha256=sha(OUT/'review.json'), checkerSha256=sha(__file__))
frozen(OUT/'check.json', check)
print(json.dumps(check))
