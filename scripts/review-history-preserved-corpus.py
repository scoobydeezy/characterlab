"""Read-only corpus reconciliation; never run the historical promotion writer."""
from pathlib import Path
import hashlib, json, re, subprocess

P = Path('docs/planning')
B = P / 'campaign3-history-universe-rev1'
O = P / 'campaign3-history-preserved-corpus-rev1'

def load(p):
    return json.loads(Path(p).read_text(encoding='utf-8-sig'))

def ref(p):
    return dict(path=Path(p).as_posix(), sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())

def save(name, value):
    target = O / name
    if target.exists():
        assert load(target) == value, target
    else:
        target.write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n', encoding='utf-8', newline='\n')

ip = P / 'campaign3-history-source-roles-rev260/index.json'
ix = load(ip)
paths = [P / 'CORPUS_0_28_0_PRESERVED_AT_GA.md', P / 'CORPUS_0_28_0_PROMOTION_REV1.json']
entries = {e['path']: e for e in load(B / 'manifest.json')['entries']}
for p in paths:
    assert p.as_posix() in ix['unassignedCandidatePaths']
    assert ref(p)['sha256'] == entries[p.as_posix()]['sha256']

receipt = load(paths[1])
successor = load(P / 'CORPUS_0_29_0_PROMOTION_REV1.json')
assert ref(paths[0])['sha256'] == receipt['sources'][0]['sha256']
assert ref('scripts/promote-corpus-0-28-0.mjs') == receipt['sources'][2]
for record, key in [(receipt, 'corpusManifestDigest'), (receipt['priorCommitment'], 'digest'),
                    (successor, 'corpusManifestDigest')]:
    assert hashlib.sha256(bytes.fromhex(record['canonicalHex'])).hexdigest() == record[key]
assert len(receipt['promoted']) == 11
assert sum(x['statusAtPromotion'].startswith('PARTIAL') for x in receipt['promoted']) == 3
assert sum(x['statusAtPromotion'].startswith('BLOCKED') for x in receipt['promoted']) == 8

old = paths[0].read_text(encoding='utf-8')
current = (P / 'PHENOMENON_CORPUS.md').read_text(encoding='utf-8')
def sections(s):
    heads = list(re.finditer(r'^## `(PHEN-[A-Z]+-001)`.*$', s, re.M))
    return {h[1]: s[h.start():s.index('\n---', h.end())] for h in heads}
before, after = sections(old), sections(current)
assert set(before) == set(after) and len(before) == 21
changed = [k for k in before if before[k] != after[k]]
assert changed == ['PHEN-ATTN-001']
attn = after[changed[0]].split('**Executable fixture update, 2026-09-20:**')[0].rstrip()
assert attn.replace('**Version:** `1.1.0`', '**Version:** `1.0.0-draft`', 1) == before[changed[0]].rstrip()

commit = '6d54d35f3c612154658c6f9316f6f7e04071865b'
historical_path = receipt['sources'][1]['path']
historical = subprocess.check_output(['git', 'show', commit + ':' + historical_path])
assert hashlib.sha256(historical).hexdigest() == receipt['sources'][1]['sha256']
intake = historical.decode('utf-8')
heads = list(re.finditer(r'^## ([A-Z]+) — (.+)$', intake, re.M))
intake_bodies = {h[1]: intake[h.end():heads[i + 1].start() if i + 1 < len(heads) else len(intake)].rstrip()
                 for i, h in enumerate(heads)}
for member in receipt['promoted']:
    body = before[member['phenomenonId']].split('\n', 1)[1].split('**Brief family:**')[0].strip()
    expected = intake_bodies[member['intakeLabel']].replace('intake/0.1-draft', '`1.0.0-draft`').strip()
    assert body == expected, member['phenomenonId']

prior_path = P / 'campaign3-history-corpus-authority-rev1/review.json'
prior = load(prior_path)
assert prior['source'] == ref(P / 'PHENOMENON_CORPUS.md')
prior_rows = {r['text'].strip(): r for r in prior['rows']}
rows = []
exceptions = {3, 7, 11, 19, 37, 466}
seen_exceptions = set()
for line in (B / 'units.jsonl').open(encoding='utf-8'):
    u = json.loads(line)
    if u['source'] not in {p.as_posix() for p in paths}:
        continue
    row = dict(occurrenceId=u['id'], source=u['source'], sourceSha256=u['sourceSha256'],
               location=u['location'], text=u['text'], category='NARRATIVE')
    if u['source'].endswith('.md'):
        match = prior_rows.get(u['text'].strip())
        if match:
            row.update(disposition=match['disposition'], limits=match['limits'],
                       inheritedFrom=dict(review=ref(prior_path), occurrenceId=match['occurrenceId']),
                       matchingRule='Exact paragraph text after outer whitespace removal; original text retained.')
        else:
            n = u['location']['startLine']
            assert n in exceptions, (n, u['text'])
            seen_exceptions.add(n)
            row.update(disposition='Historical 0.28.0 identity and promotion state, superseded by explicit 0.29.0 attention amendment. All eleven additions were partial or blocked, not ten.',
                       limits='The thirteen-family summary mixes named coverage and executable fixtures. Neither membership nor historical status proves current scientific qualification.')
    else:
        row.update(disposition='Historical promotion receipt: exact bytes and versioned membership are checked separately from scientific qualification.',
                   limits='Correct ten-of-eleven to eleven (three partial, eight blocked). Digest equality is not execution chronology or proof of all phenomenon requirements.')
    rows.append(row)
assert seen_exceptions == exceptions

def strings(value, pointer=''):
    if isinstance(value, str):
        yield dict(pointer=pointer, value=value)
    elif isinstance(value, list):
        for i, v in enumerate(value):
            yield from strings(v, pointer + '/' + str(i))
    elif isinstance(value, dict):
        for k, v in value.items():
            yield from strings(v, pointer + '/' + k.replace('~', '~0').replace('/', '~1'))

O.mkdir(exist_ok=True)
archive = O / 'intake-at-promotion.md'
if archive.exists():
    assert archive.read_bytes() == historical
else:
    archive.write_bytes(historical)
chain = [ref(prior_path), ref(P / 'PHENOMENON_CORPUS.md'), ref(P / 'CORPUS_0_29_0_PROMOTION_REV1.json'),
         ref(P / 'campaign3-history-corpus-intake-history-rev1/review.json')]
roles = [dict(**ref(p), role='PRESERVED CORPUS COMMITMENT WITH SCOPED SUCCESSOR', acceptanceChain=chain,
              judgment='Exact preserved corpus and promotion receipt. Twenty unchanged requirement sections; attention requirements preserved beneath explicit new fixture annotation. Original occurrences retained; later scientific limits inherited only through exact matching text. No corpus PASS inferred.') for p in paths]
artifacts = [dict(**ref(archive), method='Exact Git blob ' + commit + ':' + historical_path + '; raw bytes reproduce the original receipt hash.')]
bindings = [dict(original=receipt['sources'][0], resolved=ref(paths[0])),
            dict(original=receipt['sources'][1], resolved=ref(archive)),
            dict(original=receipt['sources'][2], resolved=ref('scripts/promote-corpus-0-28-0.mjs'))]
save('review.json', dict(status='PRESERVED CORPUS HISTORY RECONCILED', checker=ref(__file__), sourceIndex=ref(ip),
     sourceRoles=roles, rows=rows, allReceiptStringLeaves=list(strings(receipt)), exactBindings=bindings,
     preservedArtifacts=artifacts, obligations=['RO-C3-008', 'RO-C3-019', 'RO-C3-020', 'RO-C3-021'],
     limits=['Text equality preserves the prior reviewed dispositions, not a new behavioral experiment.',
             'Current corpus scientific adequacy, BIO comparator wording, independent universe review and HQ-012 remain open.',
             'No historical promotion writer, runtime test, model, allocation or obligation-status change.']))
save('check.json', dict(status='PASS PRESERVED CORPUS HISTORY', sources=2, originalNarrativeOccurrences=len(rows),
     originalBackingOccurrences=0, receiptStringLeaves=len(list(strings(receipt))), unchangedSections=20,
     preservedIntakeSections=11, inheritedParagraphs=sum('inheritedFrom' in r for r in rows),
     explicitHistoricalParagraphs=len(seen_exceptions), exactBindings=3, review=ref(O / 'review.json')))
print(json.dumps(load(O / 'check.json')))
