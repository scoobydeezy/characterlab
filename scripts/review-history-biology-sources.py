"""HQ011: scoped biological narratives and contracts, not whole backing review."""
from pathlib import Path
import json,hashlib,subprocess,collections
P=Path('docs/planning');B=P/'campaign3-history-universe-rev1';O=P/'campaign3-history-biology-sources-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def ref(p):return dict(path=Path(p).as_posix(),sha256=sha(p))
def save(p,v):
 if p.exists():assert load(p)==v,p
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
obs=['RO-C3-008','RO-C3-009','RO-C3-010','RO-C3-011','RO-C3-012','RO-C3-015','RO-C3-019','RO-C3-020','RO-C3-021','RO-C3-022']
specs={
 'docs/planning/CAMPAIGN3_BIOLOGICAL_SYSTEM_QUALIFICATION.md':('BOUNDED COMPONENT QUALIFICATION','25 models/53 distinct runs/2389 distinct prefixes;2438 executions include reused constitutional baseline. One continuous body/evidence/choice loop expresses18 declared behaviors;33 scoped/328 reference tests are historical receipts. Main seeds1/3/4/6 return under load, four do not; all resume avoidance. NoReliefLearning changes both valuation and access. No public admission, clinical biology or minimal-axis proof.'),
 'docs/planning/CAMPAIGN3_BIOLOGY_PUBLIC_QUALIFICATION.md':('BOUNDED HISTORICAL NATIVE QUALIFICATION','28 models/58 distinct runs,270 unique selected prefixes;59 row executions/273 checks include duplicate writer. All53 component trajectories match. Only main seed7 and supplements have every native prefix; others initial/acquisition/terminal plus initial full continuation. Controlled equal-learning dependence witness is not unbiased acquisition. Original wrapper qualification predates quiescence repair; authenticate archived source, not current parity.'),
 'docs/formal/BIOLOGICAL_DYNAMICS_CONTRACT.md':('ACCEPTED CANDIDATE WORLD CONTRACT','Scale1000 exact rational transitions, ties-even, complete unit boundaries; no fractional subdivision claim. Same-prior channel reads distinguish activity, exposure adaptation, displacement and satiation. Missing sensing is null. Final two-lane clarification governs integrated elapsed/consequence timing: consequence120 observes pre-adaptation targets; adaptation140 affects later instants. Whole-step API remains a world-only challenge. No autonomous cognition or intent mutation.'),
 'docs/formal/BIOLOGICAL_CHOICE_CONTRACT.md':('ACCEPTED BOUNDED DICE EXTENSION','0..8 options/0..32 nuclei; exact independent score convolution with fair ties, retained sign/consolidation/modifiers. Auto chooses top analytical probability; rolled modes use addressed nucleus dice and conditional tie draw, not weighted-choice lottery. No active reasons means no choice. Two-option and small-support compatibility evidence remains required; candidate significance thresholds are not calibrated laws.'),
 'docs/formal/BIOLOGICAL_INTEGRATION_CONTRACT.md':('ACCEPTED CONTINUOUS COMPONENT CONTRACT','One actor/12..96 ticks; controlled instruction and goal sources, actual effects and separate observed learning domains. Corrected pre-freeze intake supersedes earlier residual-pleasure wording: positive pleasure change and acquired neutral target, with BaselinePleasure comparator. Drug access requires cue history500; other restorative catalog access is bounded. Prior completed appraisal sends half-threat pulse at next consequence; no retroactive influence. Missing domains yield no sample; sensor bias is observer evidence, not truth access. No general recognition, forecasting or identity join.'),
 'docs/formal/BIOLOGY_PUBLIC_CONTRACT.md':('ACCEPTED HISTORICAL NATIVE CONTRACT','Typed biological source kinds do not semantically become task Commitments. Separate physical/adaptation/learning/goal/affect owners; fourteen stages, intent70/expression80, sensing120 before adaptation140, phase150 forbidden. Authenticated originals/children and unconditional reservations protect entire later safe views. Save132 whole canonical equality includes queue/IDs/trace/RNG. Intrinsic Uint8Array byte adapter avoids enumeration; ignored host metadata is not admitted identity. No forecast or new identity law.'),
 'docs/planning/BIOLOGICAL_SYSTEM_WORK_ORDER.md':('OWNER-DIRECTED FINITE WORK ORDER','18 numbered functional behaviors are the declared denominator, not all biology or132 Brief clauses. Independent domains must remain manipulable; naming Dopamine supplies no validation. World dynamics, safe sensing, actual effects, multi-ground retained dice and continuous histories required. Reproductive/immune/developmental targets remain future declared extensions; no generic Addicted or Willpower state. Later qualification closes only bounded expressibility.'),
 'docs/planning/BIOLOGICAL_SYSTEM_DOMAIN_FINDINGS.md':('PRESERVED DOMAIN FINDINGS','Independent resources/sleep/damage/intoxication/reward/withdrawal/stress/arousal/adaptation/cues have bounded causal roles, not proof of irreducible stored axes. Coupling changes physical paths but no action in resource case. NoReliefLearning confounds access/valuation; seed counts are not relapse probabilities. Preserve combined-time attribution, premature adaptation sensing, cue bypass and test typing failures. Constitutions and learned history remain separately committed; no all-profile integration.'),
 'docs/planning/BIOLOGICAL_SYSTEM_BEHAVIOR_COVERAGE.md':('FINITE BEHAVIOR CROSSWALK','All18 work-order rows link executable tests/trajectories; cue row12 qualifies cue-mediated access, not deliberate recall/general recognition. Row18 combines2340 main plus98 constitutional checks with one reused49-prefix run; unique2389. Serializable fields alone cannot prove behavior. Compound Brief requirements and native/component scopes remain separate; no automatic clause promotion.'),
 'docs/planning/BIOLOGY_PUBLIC_SCOPE_AND_FINDINGS.md':('PRESERVED NATIVE SCOPE','Numerical task adapters remain private; biological source meaning and intent/expression identities remain native. Matched acquired samples use deliberate sensor calibration for eight attempts then ordinary ninth sensing; same belief/history/goals differ in pressure/choice. Absent cue blocks access without erasing dependence. Current discomfort, learned consumption harm and future abstinence forecast are three distinctions; last is unqualified. No joint universal cognition/social/identity or minimal-axis claim.'),
 'docs/planning/BIOLOGY_PUBLIC_DEVELOPMENT_FINDINGS.md':('PRESERVED DEVELOPMENT AND ACCOUNTING','Preserve initial Record407 TypeScript narrowing failure, stopped serialization-heavy cohort, missing ComparisonCase wrapper packaged during execution, later prefrozen wrapper, actual long-save enumeration failure, and REV3 intrinsic-byte repair. Four original final partitions include all58 identities; tail scheduling changes execution order only. Duplicate row35 earns no extra unique coverage;59 executions/273 checks versus58/270. Port warnings and Python alias failure are not behavioral failures. No old cohort relabeled.')
}
O.mkdir(exist_ok=True)
commands=O/'commands.json'
if not commands.exists():
 cs=[]
 for script,expected in [('check-biological-system-closure.mjs',0),('check-biology-public-closure.mjs',1),('check-preserved-public-wrapper-evidence.mjs',0)]:
  r=subprocess.run(['node','scripts/'+script],capture_output=True,text=True,encoding='utf-8')
  assert r.returncode==expected,(script,r.stdout,r.stderr)
  if expected:assert '7d0f7b46b1b9d952e7a5fa0330ce87a012ac2d84a6da199b3dfe46c099177751' in r.stderr
  cs.append(dict(command='node scripts/'+script,exitCode=r.returncode,stdout=r.stdout,stderr=r.stderr,checker=ref('scripts/'+script)))
 save(commands,dict(commands=cs,scope='Read-only original receipt verification. Historical public mismatch intentionally retained, then verified against actual preserved source. No fresh simulation, test suite or build.'))
entries={e['path']:e for e in load(B/'manifest.json')['entries']}
closures=[P/'BIOLOGICAL_SYSTEM_CLOSURE_REV1.json',P/'BIOLOGY_PUBLIC_CLOSURE_REV2.json']
plans=[P/'BIOLOGICAL_SYSTEM_PLAN_REV1.json',P/'BIOLOGY_PUBLIC_PLAN_REV3.json']
bindings={}
for c in closures:
 for a in load(c)['artifacts']:
  if a['path'] in specs:assert sha(a['path'])==a['sha256'];bindings[a['path']]=[ref(c),ref(a['path'])]
for c,p in zip(closures,plans):
 assert any(a['path']==p.as_posix() and a['sha256']==sha(p) for a in load(c)['artifacts'])
 for a in load(p)['artifacts']:
  if a['path'] in specs:assert sha(a['path'])==a['sha256'];bindings[a['path']]=[ref(c),ref(p),ref(a['path'])]
assert set(bindings)==set(specs)
ledger=(B/'sources/docs/planning/VERDICT_LEDGER.md').read_text(encoding='utf-8-sig')
for verdict in ['VER-C3-BIOLOGY-001','VER-C3-BIOLOGY-PUBLIC-001']:assert any(line.startswith('## '+verdict+' ') for line in ledger.splitlines())
rows=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in specs:continue
  path=u['source'];loc=u['location'];ls=Path(path).read_bytes().decode('utf-8-sig').splitlines(keepends=True)
  assert sha(path)==u['sourceSha256']==entries[path]['sha256']
  assert ''.join(ls[loc['startLine']-1:loc['endLine']])==u['text']
  assert hashlib.sha256(json.dumps([path,u['sourceSha256'],loc,u['text']],ensure_ascii=False,separators=(',',':')).encode()).hexdigest()==u['id']
  role,judgment=specs[path]
  rows.append(dict(occurrenceId=u['id'],source=path,sourceSha256=u['sourceSha256'],location=loc,text=u['text'],role=role,judgment=judgment,evidence=bindings[path],obligations=obs))
for path in specs:
 lines=Path(path).read_bytes().decode('utf-8-sig').splitlines()
 covered={n for r in rows if r['source']==path for n in range(r['location']['startLine'],r['location']['endLine']+1)}
 assert {n for n in covered if lines[n-1].strip()}=={n for n,l in enumerate(lines,1) if l.strip()}
v=dict(status='ELEVEN BIOLOGICAL NARRATIVE/CONTRACT SOURCES REVIEWED; HQ011 OPEN',sourceRoles=[dict(**ref(p),role=specs[p][0],judgment=specs[p][1],acceptanceChain=bindings[p]) for p in sorted(specs)],rows=rows,commands=ref(commands),historicalMismatch=ref(P/'AFFECT_REGULATORY_HISTORICAL_CHECK_FINDING_REV1.json'),obligations=obs,limits=['Original historical and repaired current runtimes are distinct evidence identities. No checksum rewrite or current-parity claim.','All source paragraphs are reviewed; cited JSON metadata/test/backing sources are not thereby whole-reviewed.','Work-order12 is bounded cue access, not a general learned recall policy; domain necessity, future forecast and all-profile integration remain open.','Source-role accounting does not establish independent universe adequacy or satisfy HQ012.'])
save(O/'review.json',v)
save(O/'check.json',dict(status=v['status'],sources=len(specs),originalOccurrences=len(rows),bySource=dict(collections.Counter(r['source'] for r in rows)),reviewSha256=sha(O/'review.json'),checkerSha256=sha(__file__)))
print(json.dumps(load(O/'check.json')))
