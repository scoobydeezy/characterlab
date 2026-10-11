"""Preserve full README review, original occurrence identities and bounded test evidence."""
from pathlib import Path
import json, hashlib, collections

P = Path('docs/planning')
O = P / 'campaign3-history-reference-readme-rev2'
B = P / 'campaign3-history-universe-rev1'

def load(p):
    return json.loads(Path(p).read_text(encoding='utf-8-sig'))

def ref(p):
    return dict(path=Path(p).as_posix(), sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())

def save(p, value):
    if p.exists():
        assert load(p) == value, p
    else:
        p.write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n', encoding='utf-8', newline='\n')

prior = P / 'campaign3-history-reference-readme-rev1/review.json'
old = load(prior)
entries = {e['path']: e for e in load(B / 'manifest.json')['entries']}
index = load(P / 'campaign3-history-source-roles-rev62/index.json')
research = next(r for r in index['roleAssignments'] if r['path'] == 'reference/RESEARCH.md')
assert ref(research['path'])['sha256'] == research['sha256']
for e in research['evidence'] + old['acceptanceChain']:
    assert ref(e['path']) == e
for e in old['sources']:
    assert ref(e['path']) == e and e['sha256'] == entries[e['path']]['sha256']

groups = [
    (129, 160, 'Kernel inventory: exact rational/lattice and RoundEven arithmetic; historical FNV/SplitMix addressing is not current SHA addressing. Exact independent option distributions include fair tie sharing. Collective union-max overlap differs from pairwise maximum; the third {1,2} contribution is fully discounted after {1} and {2}. No general independence or psychological law is selected.'),
    (162, 390, 'Model inventory: rejected bounds freeze decayed tau-minus, not universally the previous stored precision. Identity history is unbounded research state, not compression. Provenance roles are governed authored mappings, not learned recognition. Synthetic dominant-referent cases do not establish natural ambiguous recognition. Participant attribution and zero-salience fallback retain their limits. Dense identity alignment excludes identity feedback to avoid bootstrap evidence. Concrete commitment instance and stakeholder remain distinct; static commitment is optional, and fresh call lists do not supply persisted lifecycle ownership. Need-only control and independent salience default are historical choices, not universal reductions. Later rebaselines supersede early default descriptions.'),
    (392, 527, 'Experiment inventory: actual cycle tests coexist with authored arithmetic and kernel-only sweeps. Identity experiments reset Need/expectation while retaining history; G/H comparisons include directly injected Caregiving and separately acquired CommitmentFidelity. Correlation F is hand-authored arithmetic, D/E use real memories. Calibration selects witnesses, not population frequencies. Historical whole-run seed divergence is distinct from later early-only BIO routing. The 500-round Auto-lock belongs to the tested permanently active extra-die setup; broad no-calibration-can-fix wording is not a universal impossibility proof. Default commitment is intentionally absent from the recurring dilemma harness. No physical learning or general motivation closure follows.'),
    (529, 571, 'Historical UI file inventory, with duplicated component listings, is research presentation and not another mechanism or character knowledge. It creates no current inspection UI work requirement.'),
    (573, 648, 'Historical test inventory preserves legacy/derived semantic packaging and collective overlap distinctions. Opposite direction keys across separate compilations do not imply two dice for mixed signs within one compilation: raw signed groups resolve to one nucleus. Missing governed mappings reject. Early commitment lifecycle supplies a fresh per-call list; later native COMMIT qualification is a separate proof. Listed tests are not themselves fresh execution receipts.'),
    (650, 719, 'Historical local npm/UI instructions are not current workspace routing; reference/README and package.json define the isolated reference test command. Scripted forced experiences differ from autonomous action. Read-only research experiment panels do not mutate active Mina, and researcher overflow displays are not character evidence. No dedicated interaction UI is needed for the four saturation/salience tests.'),
    (1068, 1227, 'Testing philosophy separates mathematical validity from falsifiable psychological hypotheses. Finite nonsingular learned graphs support examples, not a substitute for the row-substochastic beta<1 proof. Historical confidence bounds are not calibrated correctness probabilities. Censoring equality rejects precision credit after decay; full-point credit remains an approximation. Legacy/refined Habit and Avoidance findings stay distinct. One fresh-prior sweep is not a general equivalence result. Exact overflow exclusion and finite safe-evidence comparisons remain scoped. README line1181 overstates d4+d6 coverage: the actual test checks normalization and one midpoint, not every bucket; a separate d2+d2 test checks every bucket, and K2/K3 winning probabilities are independently enumerated. Phase2.95 gradual influence includes a discrete jump, not smoothness or a universal never-dictates guarantee. Fresh focused tests establish only the selected 27 checks, not a rerun of all 328 historical tests.')
]
oldrows = {r['occurrenceId']: r for r in old['rows']}
rows = []
with (B / 'units.jsonl').open(encoding='utf-8') as f:
    for line in f:
        u = json.loads(line)
        if u['source'] not in {e['path'] for e in old['sources']}:
            continue
        assert u['sourceSha256'] == entries[u['source']]['sha256']
        if u['id'] in oldrows:
            r = dict(oldrows[u['id']])
            assert all(r[k] == u[k] for k in ('source', 'sourceSha256', 'location', 'text'))
        else:
            loc = u['location']
            matching = [j for a, b, j in groups if a <= loc['startLine'] <= loc['endLine'] <= b]
            assert len(matching) == 1, loc
            r = dict(occurrenceId=u['id'], source=u['source'], sourceSha256=u['sourceSha256'], location=loc, text=u['text'], judgment=matching[0])
        r['role'] = 'NARRATIVE HISTORICAL AUTHORITY / FINDING / ROUTING'
        rows.append(r)
assert len(rows) == len({r['occurrenceId'] for r in rows}) == 30
assert len(oldrows) == 15

O.mkdir(exist_ok=True)
tests = ['reference/src/test/discreteDistribution.test.ts', 'reference/src/test/phase2_5Saturation.test.ts', 'reference/src/test/phase2_95ReasonConsolidation.test.ts']
testreceipt = dict(status='PASS', date='2026-10-07', command='npm run test:reference -- ' + ' '.join(tests), files=3, tests=27, counts=[19, 3, 5], sourceBindings=[ref(p) for p in tests] + [ref('vite.reference.config.ts')], rejectedAttempt=dict(stage='CONFIGURATION LOAD BEFORE TEST EXECUTION', reason='Sandbox esbuild directory traversal Access is denied; config could not resolve. No scientific assertion ran.', disposition='Same command passed under approved unsandboxed execution.'), limitation='Focused run only; no fresh whole-reference-suite or Campaign3 matrix claim.')
save(O / 'tests.json', testreceipt)
chain = old['acceptanceChain'] + research['evidence'] + [ref('reference/RESEARCH.md'), ref(O / 'tests.json')]
roles = [dict(**s, role='HISTORICAL REFERENCE OVERVIEW', judgment='Whole source read and reconciled by original occurrences and subrange findings. Historical defaults, regressions, mathematical checks and bounded psychological witnesses do not define current topology or general laws. README test-coverage overstatement is corrected forward in this review; frozen source unchanged.', acceptanceChain=chain) for s in old['sources']]
review = dict(status='TWO WHOLE REFERENCE README SOURCES REVIEWED; HQ011 OPEN', predecessor=ref(prior), sourceRoles=roles, reviewedLineRanges={'reference/README.md': [[1, 13]], 'reference/IMPLEMENTATION_README.md': [[1, 1227]]}, remainingLineRanges={}, rows=rows, scopeFindings=old['scopeFindings'] + [dict(startLine=a, endLine=b, judgment=j) for a,b,j in groups], obligations=old['obligations'], acceptanceChain=chain, extractionFinding=old['extractionFinding'], limits=['Six separate historical phase briefs are not assigned by this review.', 'Preserve whole-source hashes; correct forward rather than rewriting historical assertions.', 'Formula pin, missing legacy log and GA historical source provenance remain open.', 'No production, verdict, corpus or law-selection change.'])
save(O / 'review.json', review)
save(O / 'check.json', dict(status='PASS; HQ011 OPEN', sources=2, originalNarrativeOccurrences=30, originalBackingOccurrences=0, preservedPredecessorOccurrences=15, freshFocusedTests=27, checker=ref(__file__)))

roles_by_path = {r['path']: r for r in index['roleAssignments']}
for s in roles:
    assert s['path'] not in roles_by_path
    roles_by_path[s['path']] = dict(path=s['path'], sha256=s['sha256'], category='WHOLE_REFERENCE_README_REVIEWED', role=s['role'], scope=s['judgment'], evidence=[ref(O / 'review.json')], acceptanceChain=s['acceptanceChain'])
index['version'] = 'campaign3-history-source-roles/0.63'
index['predecessor'] = ref(P / 'campaign3-history-source-roles-rev62/index.json')
index['roleAssignments'] = [roles_by_path[p] for p in sorted(roles_by_path)]
index['unassignedCandidatePaths'] = sorted(set(entries) - set(roles_by_path))
index['reviewedInputs'].append(ref(O / 'review.json'))
index['originalNarrativeOrFindingOccurrences'] += 30
index['backingBreakdown']['referenceReadme'] = 0
index['rules'].append('REV63 adds two wholly reviewed historical reference README sources, 30 original narrative occurrences. Preserved partial review did not previously assign these sources. Forward test-coverage correction and 27 focused passing tests are bounded evidence; six historical phase briefs and provenance limits remain open.')
I = P / 'campaign3-history-source-roles-rev63'
I.mkdir(exist_ok=True)
save(I / 'index.json', index)
check = dict(status=index['status'], candidateFiles=len(entries), assignedSources=len(roles_by_path), unassignedWithinThisIndex=len(index['unassignedCandidatePaths']), byCategory=dict(collections.Counter(r['category'] for r in roles_by_path.values())), originalNarrativeOrFindingOccurrences=index['originalNarrativeOrFindingOccurrences'], originalBackingOccurrences=index['originalBackingFieldOccurrences'], explicitArchivesOutsideCensus=len(index['explicitBackingOutsideProseManifest']), indexSha256=ref(I / 'index.json')['sha256'], checkerSha256=ref(__file__)['sha256'])
save(I / 'check.json', check)
print(json.dumps(check))
