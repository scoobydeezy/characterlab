"""Exact inventory commitments via preserved prefix plus newline-normalized append.

This is a byte reconstruction, not evidence of historical filesystem chronology.
Never executes an old report writer or changes original sources.
"""
from pathlib import Path
import collections, hashlib, json

P = Path('docs/planning')
O = P / 'campaign3-history-exit-inventory-mixed-rev1'
O.mkdir(exist_ok=True)

def load(p): return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def digest(b): return hashlib.sha256(b).hexdigest()
def ref(p): return dict(path=Path(p).as_posix(), sha256=digest(Path(p).read_bytes()))
def save(name, value):
    p = O / name
    if p.exists(): assert load(p) == value, p
    else: p.write_text(json.dumps(value, ensure_ascii=False, indent=2)+'\n', encoding='utf-8', newline='\n')
def archive(raw):
    p = O / 'sources' / (digest(raw)+'.md')
    p.parent.mkdir(exist_ok=True)
    if p.exists(): assert p.read_bytes() == raw
    else: p.write_bytes(raw)
    return ref(p)

prior = P / 'campaign3-history-exit-inventory-rev1/review.json'
r = load(prior)
pending = collections.defaultdict(set)
seeds = collections.defaultdict(list)
for row in r['rows']:
    if row['resolution']['method'].startswith('UNRECOVERED'):
        pending[row['path']].add(row['sha256'])
    else:
        b = row['resolution']['bytes']
        assert ref(b['path']) == b
        seeds[row['path']].append(b)
recoveries = {}
searches = []
for path, targets in sorted(pending.items()):
    current_ref = ref(path)
    current = Path(path).read_bytes().replace(b'\r\n', b'\n')
    queue = seeds[path][:]
    seen = set()
    admitted = 0
    while queue:
        basis = queue.pop(0)
        if basis['sha256'] in seen: continue
        seen.add(basis['sha256'])
        raw = Path(basis['path']).read_bytes()
        norm = raw.replace(b'\r\n', b'\n')
        if not current.startswith(norm): continue
        admitted += 1
        tail = current[len(norm):]
        for mode, data in [('LF', tail), ('CRLF', tail.replace(b'\n', b'\r\n'))]:
            state = hashlib.sha256(raw)
            offset = 0
            for line in data.splitlines(keepends=True):
                core = line.rstrip(b'\r\n')
                ending = line[len(core):]
                state.update(core)
                offset += len(core)
                for suffix in [b'', b'\n', b'\r\n', b'\n\n', b'\r\n\r\n']:
                    z = state.copy(); z.update(suffix); h = z.hexdigest()
                    if h not in targets: continue
                    content = raw + data[:offset] + suffix
                    assert digest(content) == h
                    b = archive(content)
                    recoveries[path, h] = dict(
                        method='EXACT INVENTORY-BOUND MIXED-NEWLINE APPEND RECONSTRUCTION; NOT HISTORICAL TIMESTAMP PROOF',
                        basis=basis, continuationSource=current_ref,
                        normalizedPrefixBytes=len(norm), appendNewlineMode=mode,
                        appendPrefixBytes=offset, suffixHex=suffix.hex(), bytes=b)
                    targets.remove(h); queue.append(b)
                state.update(ending); offset += len(ending)
    searches.append(dict(source=current_ref, inspectedSeeds=len(seen),
                         normalizedPrefixSeeds=admitted, remaining=len(targets)))

rows = []
for row in r['rows']:
    resolution = recoveries.get((row['path'], row['sha256']))
    if resolution: row = {**row, 'resolution': resolution}
    rows.append(row)
assert len(recoveries) == 83
assert sum(len(t) for t in pending.values()) == 80
for resolution in recoveries.values():
    raw = Path(resolution['basis']['path']).read_bytes()
    current = Path(resolution['continuationSource']['path']).read_bytes().replace(b'\r\n', b'\n')
    assert current.startswith(raw.replace(b'\r\n', b'\n'))
    tail = current[resolution['normalizedPrefixBytes']:]
    if resolution['appendNewlineMode'] == 'CRLF': tail = tail.replace(b'\n', b'\r\n')
    rebuilt = raw + tail[:resolution['appendPrefixBytes']] + bytes.fromhex(resolution['suffixHex'])
    assert rebuilt == Path(resolution['bytes']['path']).read_bytes()
    assert ref(resolution['bytes']['path']) == resolution['bytes']
assert all(ref(s['path']) == s for s in r['snapshots'])
summary = dict(pathHashPairs=820, inventoryOccurrences=23816,
               previouslyResolved=657, newlyResolved=83, resolvedPairs=740,
               unresolvedPairs=80, newFiles=83,
               byPath=dict(collections.Counter(p for p, h in recoveries)))
save('review.json', dict(status='EXACT MIXED-NEWLINE BYTE RECOVERY; SEMANTIC ADEQUACY OPEN',
    checker=ref(__file__), predecessor=ref(prior), snapshots=r['snapshots'],
    rows=rows, searches=searches, summary=summary,
    limits=['Only exact original target hashes are preserved; no guessed prose edits.',
            'A preserved prefix followed by an LF/CRLF continuation is a reconstruction recipe, not proof of historical append operations, timestamp or original inspection.',
            '80 identities remain unresolved; current prose is not a substitute for those missing historical bytes.',
            'Inventory byte identity does not establish scientific acceptance; no source-role promotion, runtime experiment, verdict or obligation closure.'],
    obligations=['RO-C3-019', 'RO-C3-020', 'RO-C3-021']))
assert all(p.stat().st_size < 50000000 for p in O.rglob('*') if p.is_file())
save('check.json', dict(status='PASS; ALL83 RECIPES REBUILT AND ALL111 ORIGINAL SNAPSHOTS UNCHANGED',
                        review=ref(O/'review.json'), summary=summary, sourceRolesPromoted=0))
print(json.dumps(summary))
