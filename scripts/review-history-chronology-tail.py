"""Review the final three frozen log entries without assigning the whole log."""
from pathlib import Path
import json
import hashlib

P = Path('docs/planning')
O = P / 'campaign3-history-chronology-tail-rev1'
C = P / 'campaign3-history-chronology-candidates-rev1'

def load(p):
    return json.loads(Path(p).read_text(encoding='utf-8-sig'))

def ref(p):
    p = Path(p)
    return dict(path=p.as_posix(), sha256=hashlib.sha256(p.read_bytes()).hexdigest())

def save(name, v):
    p = O / name
    if p.exists():
        assert load(p) == v
    else:
        p.write_text(json.dumps(v, ensure_ascii=False, indent=2)+'\n', encoding='utf-8', newline='\n')

candidates = load(C/'occurrences.json')
index = load(P/'campaign3-history-source-roles-rev313/index.json')
roles = {x['path']: x for x in index['roleAssignments']}
sources = [P/n for n in [
    'CAMPAIGN3_LONGITUDINAL_PERSONAL_LOSS_QUALIFICATION.md',
    'CAMPAIGN3_AFFECT_REGULATORY_QUALIFICATION.md',
    'LONGITUDINAL_PERSONAL_LOSS_BOOKKEEPING_FINDING_REV1.json',
    'MOTIVE_AUDIT_VALIDATION_FINDING_REV1.json',
    'CAMPAIGN3_EXIT_RECONCILIATION_READINESS.md']]
for p in sources:
    assert roles[p.as_posix()]['sha256'] == ref(p)['sha256']

loss = ('Dated component qualification, not native admission.480 runs/6240 immediate-successor prefixes are historical receipts, not fresh runs here. '
        'Acquired relationship, report-relative belief, maintained goals, appraisal, sampled choice and execution stay separate. '
        '5/8 loss and NoAffect divergences and7/8 competing-motive divergences preserve all equal seeds. '
        'Authored adoption, masked outcomes and fixed factors bound the claim; no clinical grief or affect-dimensional necessity. '
        'The later regulatory qualification resolves the then-partial12.5-8 clause only through body-only reduction failure, not vector necessity.')
affect = ('Dated regulatory qualification: identical body history and different admitted harm evidence produce threat0/270 and later stress0/135. '
          'FullAffect and ScalarThreat preserve64/64; Stress56/64,Pain48/64,RewardDeviation56/64 preserve their successes. '
          'The source64 component runs/832 prefixes,320 substitution trials repeated twice,and4 native sentinels/16 selected saves are distinct denominators. '
          'No free-choice change or general psychological scalar impossibility follows.132 bounded clauses and106 verdicts are historical counts, not campaign exit. '
          'Native sentinels use existing biology admission; no public admission for unrelated components.')
bookkeeping = ('Two different nonbehavioral issues remain preserved: table whitespace caused a false stale-count matcher failure, '
               'and verbatim historical CRCRLF limited global diff checking with truncated output. Neither is a behavioral failure; '
               'the correction does not rewrite old experiment or log bytes. The second loss entry is a corrected index, not another480 runs.')
rows = []
for r in candidates['rows']:
    u = r['original']
    if u['location']['startLine'] < 7520:
        continue
    assert u['location']['endLine'] <= 7626
    label = 'LONGITUDINAL_LOSS_DATED_ENTRY' if u['location']['startLine'] < 7593 else 'REGULATORY_REDUCTION_DATED_ENTRY'
    rows.append(dict(occurrenceId=u['id'], source=u['source'], sourceSha256=u['sourceSha256'],
        location=u['location'], text=u['text'], category=label,
        disposition=(loss if label.startswith('LONGITUDINAL') else affect) + ' ' + bookkeeping,
        acceptanceChain=[ref(p) for p in sources], obligations=['RO-C3-019','RO-C3-020','RO-C3-021']))
assert len({r['occurrenceId'] for r in rows}) == len(rows)
O.mkdir(exist_ok=True)
save('review.json', dict(status='PARTIAL CHRONOLOGY REVIEW; WHOLE LOG UNASSIGNED',
    checker=ref('scripts/review-history-chronology-tail.py'), candidates=ref(C/'occurrences.json'),
    resolvedSource=candidates['resolvedSource'], range=dict(startLine=7520,endLine=7626), rows=rows,
    authority=[roles[p.as_posix()] for p in sources],
    materialFindings=[dict(owner='RO-C3-020', finding='Body-only reduction failure retains psychological scalar successes.',
        blockedClaim='General vector necessity or universal scalar impossibility.',
        reopen='An independently motivated consumer requires distinctions discarded by the retained psychological scalar.'),
        dict(owner='RO-C3-019', finding='Personal loss is a component witness with controlled adoption and masked later outcomes.',
        blockedClaim='Native loss admission, natural relationship formation, clinical grief or full lifetime biography.',
        reopen='A required phenomenon needs new source, native composition or unmasked feedback evidence.'),
        dict(owner='RO-C3-021', finding='Bounded clause coverage does not close history/corpus/family gates.',
        blockedClaim='Campaign3 exit or Campaign4 ranking from132 bounded clauses alone.',
        reopen='Explicit final reconciliation and required corpus/family/native-scope dispositions are accepted.')],
    limits=['No runtime suite rerun. Original log bytes and occurrence identities preserved.',
            'The other log ranges and post-cutoff chronology remain open; no whole-source assignment.']))
save('check.json', dict(status='PASS DECLARED TAIL ACCOUNTING; FULL CHRONOLOGY OPEN',
    reviewedOccurrences=len(rows), remainingOriginalOccurrences=len(candidates['rows'])-len(rows),
    review=ref(O/'review.json')))
print(json.dumps(load(O/'check.json')))
