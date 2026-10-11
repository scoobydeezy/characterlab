"""Index frozen log occurrences for review; matches never confer claim acceptance."""
from pathlib import Path
from collections import defaultdict, Counter
import hashlib
import json
import re

P = Path('docs/planning')
B = P / 'campaign3-history-universe-rev1'
O = P / 'campaign3-history-chronology-candidates-rev1'
SOURCE = 'docs/planning/CAMPAIGN3_LOG.md'

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

manifest = load(B / 'manifest.json')
entries = {e['path']: e for e in manifest['entries']}
index_path = P / 'campaign3-history-source-roles-rev313/index.json'
index = load(index_path)
roles = {e['path']: e for e in index['roleAssignments']}
entry = entries[SOURCE]
snapshot = Path(entry['snapshot'])
assert ref(snapshot)['sha256'] == entry['sha256']
assert SOURCE in index['unassignedCandidatePaths']
lines = snapshot.read_text(encoding='utf-8-sig').splitlines()
starts = [i for i, line in enumerate(lines, 1) if line.startswith('# ')]
sections = [dict(startLine=a, endLine=b-1, title=lines[a-1])
            for a, b in zip(starts, starts[1:] + [len(lines)+1])]

original = []
with (B / 'units.jsonl').open(encoding='utf-8') as f:
    for line in f:
        u = json.loads(line)
        if u['source'] == SOURCE:
            assert u['sourceSha256'] == entry['sha256']
            original.append(u)
assert len({u['id'] for u in original}) == len(original)
# Only newline normalization is allowed, and original text/identity remains intact.
needed = {u['text'].replace('\r\n', '\n') for u in original}
matches = defaultdict(list)
with (B / 'units.jsonl').open(encoding='utf-8') as f:
    for line in f:
        u = json.loads(line)
        key = u['text'].replace('\r\n', '\n')
        if u['source'] != SOURCE and u['source'] in roles and key in needed:
            matches[key].append(dict(occurrenceId=u['id'], source=u['source'], sourceSha256=u['sourceSha256'], location=u['location']))
by_name = defaultdict(list)
for path in entries:
    by_name[Path(path).name].append(path)

rows = []
for u in original:
    key = u['text'].replace('\r\n', '\n')
    # Candidate references only; no basename resolution establishes authority.
    names = sorted(set(re.findall(r'[A-Za-z0-9_][A-Za-z0-9_.-]*\.(?:md|json)\b', u['text'])))
    candidates = [dict(token=n, candidatePaths=by_name.get(n, [])) for n in names]
    rows.append(dict(original=u, newlineNormalizedMatches=matches[key], referenceCandidates=candidates,
                     disposition='PENDING SEMANTIC REVIEW; equality and citation discovery are not acceptance'))

O.mkdir(exist_ok=True)
save('occurrences.json', dict(status='REVIEW CANDIDATES ONLY', source=entry, resolvedSource=ref(snapshot), rows=rows))
save('sections.json', dict(status='STRUCTURAL CHRONOLOGY ONLY', sections=sections))
save('check.json', dict(status='PASS ENUMERATION; SEMANTIC RECONCILIATION OPEN', checker=ref(__file__),
    manifest=ref(B/'manifest.json'), sourceIndex=ref(index_path), originalOccurrences=len(rows),
    sections=len(sections), occurrencesWithExactNormalizedMatch=sum(bool(r['newlineNormalizedMatches']) for r in rows),
    occurrencesWithReferenceCandidates=sum(bool(r['referenceCandidates']) for r in rows),
    unresolvedReferenceTokens=sorted({x['token'] for r in rows for x in r['referenceCandidates'] if not x['candidatePaths']}),
    occurrences=ref(O/'occurrences.json'), sectionInventory=ref(O/'sections.json'),
    limits=['No source-role assignment or original occurrence disposition changed.',
            'Repeated text needs contextual authority review; current log additions are outside this frozen snapshot.',
            'Unmatched text is not automatically a novel finding; matched text is not automatically scientifically adequate.']))
assert all(p.stat().st_size < 50_000_000 for p in O.iterdir())
print(json.dumps(load(O/'check.json'), ensure_ascii=False))
