"""Documentary claim accounting only; does not rerun or certify simulations."""
from pathlib import Path
import copy
import hashlib
import json

P = Path('docs/planning')
O = P / 'campaign3-history-hq008-rev1'
DOC = P / 'CAMPAIGN3_HISTORY_HQ008_CROSSWALK.md'
OBLIGATIONS = ['RO-C3-011', 'RO-C3-014', 'RO-C3-019', 'RO-C3-020', 'RO-C3-021']

def sha(path):
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()

def excerpt(path, first=1, last=None):
    lines = Path(path).read_bytes().decode('utf-8-sig').splitlines(keepends=True)
    last = last or len(lines)
    assert 1 <= first <= last <= len(lines)
    return dict(path=str(path).replace('\\', '/'), sha256=sha(path), firstLine=first,
                lastLine=last, text=''.join(lines[first-1:last]))

rows = []
for line in DOC.read_text(encoding='utf-8').splitlines():
    if not line.startswith('| H08-'):
        continue
    identity, question, finding, witnesses, obligation = [s.strip() for s in line.strip('|').split('|')]
    ident, ledger = identity.split(' / ')
    paths = [str(P / ('CAMPAIGN3_' + w.strip() + '_QUALIFICATION.md')).replace('\\', '/')
             for w in witnesses.split(';')]
    rows.append(dict(id=ident, ledger=ledger, question=question, finding=finding,
                     witnesses=paths, obligation=obligation))
assert [r['id'] for r in rows] == [f'H08-{n:02}' for n in range(1, 31)]
assert {r['ledger'] for r in rows} == {'P3-005','P3-006','P3-008','P3-010','P3-011','P3-012'}
assert all(r['obligation'].split(':')[0] in OBLIGATIONS for r in rows)
paths = sorted({p for r in rows for p in r['witnesses']})
sources = [excerpt(p) for p in paths]
sources += [excerpt('src/campaign3/beliefMath.ts'),
            excerpt(P / 'REFERENCE_MECHANISM_LEDGER.md',170,177),
            excerpt('reference/CharacterLab — Phase 3 Research Brief.md')]
expected = dict(status='HQ-008 CLAIM ACCOUNTING COMPLETE; SCIENTIFIC LIMITS RETAINED',
    crosswalk=dict(path=DOC.as_posix(),sha256=sha(DOC)), claims=rows, sources=sources,
    queueSourceSha256=sha(P/'campaign3-history-queue-rev1/review.json'),
    obligations=OBLIGATIONS, nextGate='HQ-009 external provenance',
    limits=['Documentary evidence mapping; no fresh behavioral tests, matrices, build or scientific verdict.',
            'Qualification text is bound, not independently reexecuted or a substitute for linked original receipts.',
            'Partial and unmapped claims are not implementation-absence findings or waived mandatory gates.',
            'No corpus, clause, allocation, wrapper or obligation-status change.'])

def validate(value):
    assert value == expected, 'Changed claim, scope, binding or obligation'
    for source in value['sources']:
        assert source == excerpt(source['path'],source['firstLine'],source['lastLine'])
    assert value['crosswalk']['sha256'] == sha(DOC)
    assert value['queueSourceSha256'] == sha(P/'campaign3-history-queue-rev1/review.json')

def save(path, value):
    if path.exists():
        assert json.loads(path.read_text(encoding='utf-8-sig')) == value, path
    else:
        path.write_text(json.dumps(value,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')

validate(expected)
faults=[]
for mode in ['lost-claim','erased-limit','changed-source','false-qualification','missing-obligation']:
    value=copy.deepcopy(expected)
    if mode=='lost-claim': value['claims'].pop()
    elif mode=='erased-limit': value['limits'].clear()
    elif mode=='changed-source': value['sources'][0]['text']+='changed'
    elif mode=='false-qualification': value['claims'][4]['finding']='Bounded: all generalization solved'
    else: value['obligations'].pop()
    try: validate(value)
    except AssertionError: faults.append(mode)
    else: raise AssertionError(mode)
O.mkdir(exist_ok=True)
save(O/'review.json',expected)
check=dict(status='PASS DOCUMENTARY ACCOUNTING ONLY',claims=len(rows),
    dispositions={k:sum(r['finding'].startswith(k+':') for r in rows) for k in ['Bounded','Partial','Unmapped']},
    boundDocuments=len(sources),freshBehavioralTests=0, faultChecks=faults,
    reviewSha256=sha(O/'review.json'), checkerSha256=sha(__file__))
save(O/'check.json',check)
print(json.dumps(check))
