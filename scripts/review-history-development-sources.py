"""Developmental authority, supersession and bounded qualification source review."""
from pathlib import Path
import json,hashlib,subprocess,collections
P=Path('docs/planning');B=P/'campaign3-history-universe-rev1';O=P/'campaign3-history-development-sources-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def ref(p):return dict(path=Path(p).as_posix(),sha256=sha(p))
def save(p,v):
 if p.exists():assert load(p)==v,p
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
specs={
 'docs/planning/DEVELOPMENT_OWNER_REQUIREMENTS_2026_10_01.md':('OWNER REQUIREMENT AND EXPLICIT SUPERSESSION','Two independently manipulable effects required: faster young learning and greater event-time personality formation. Supersedes STATE_READINESS exclusion of learning rates, not historical bytes. Formation weight follows existing eligibility/authorship; zero eligibility remains zero. No retroactive ageing reweight, clinical curve or irreversible destiny. Component then native gates both required.'),
 'docs/planning/DEVELOPMENT_STATE_READINESS.md':('SUPERSEDED INITIAL INTAKE SCOPE','Initial direct developmental disposition proposal excluded learning rates. The explicit owner requirements supersede that scope/order; the exclusion is historical, not current prohibition. Constitutional/developmental/plastic/standing distinctions, controlled causality and no component-to-native promotion remain valid. Later two-effect qualification is not evidence for every initial proposed direct-modifier experiment.'),
 'docs/planning/DEVELOPMENT_COVERAGE_READINESS.md':('HISTORICAL PLANNING INTAKE','Requires audit of acquired history versus maturation before allocation. Opportunity/history-driven development is not age state. The later owner directive specifies two required missing effects. This intake alone is no experiment, clause promotion or architecture ruling; corpus and history gates remain separate.'),
 'docs/planning/DEVELOPMENT_PUBLIC_READINESS.md':('NATIVE GATE LATER DISCHARGED IN BOUNDED PROFILE','Component result cannot close two-effect public ownership. Native qualification supplies distinct writers, ordered phases, original lineage, actual Save132 and publication. Historical BLOCKED label for Brief12.15-1 is resolved only by bounded DEVELOPMENT-PUBLIC; general lifespan and other clauses are not discharged by this gate.'),
 'docs/formal/DEVELOPMENT_COMPONENT_CONTRACT.md':('ACCEPTED TWO-EFFECT CANDIDATE CONTRACT','At most24 steps, phase0..4 not years. Step4/1 and Ramp independent gains. Prior competence controls execution; admitted report controls fallible belief, first known0/1 then gain/8 update. Eligible contribution times formation gain/4 enters bounded separate personality; original authorship/journal unchanged, no double-count standing. Event-time weights persist, later correction allowed. Controlled training feedback zero; probes consume personality. No natural maturation, all-domain learning or non-authored trauma route.'),
 'docs/formal/DEVELOPMENT_PUBLIC_CONTRACT.md':('ACCEPTED NATIVE SUCCESSOR CONTRACT','Records1493..1508 and13 actual stages; separate phase/learning/journal/formation writers and no constitution writer. Identity140 precedes formation child. Practice/report independent of physical success; safe projection excludes executed fields. Seed/occurrence identities preserve inherited task lineage. Empty acquired S0, copied inputs, complete Save132 and promise-tail guards; one successor per prefix, not full tails.'),
 'docs/planning/DEVELOPMENT_COMPONENT_FINDINGS.md':('PRESERVED TWO-EFFECT FINDINGS','NoLearning/NoFormation/Neither disable amplification, not baseline learning. Same original1/9 contribution yields1/9 versus1/36 formation; practice1/2 versus1/8 changes next difficulty3/8 success. False report can accelerate mistaken learning. Unknown is not zero; forced movement has no authored expression. Preserve6 pass/7 timeout cohort and test-only timeout correction, seed255 fixed control, early equal actions and later differences. No irreducibility of dual inspection stores.'),
 'docs/planning/CAMPAIGN3_DEVELOPMENT_QUALIFICATION.md':('BOUNDED COMPONENT QUALIFICATION','7 models/36 runs/668 component prefixes;13/328 historical tests. Independent effects and event-time persistence qualified under controlled sources. All8 seeds show early probability differences/equal sampled actions; full probe sequences differ A/A/A/A versus A/A/B/B. Native OPEN here is historical and closed only by separate public verdict. No calendar ageing, universal rates, critical periods or life-event-wide personality claim.'),
 'docs/planning/CAMPAIGN3_DEVELOPMENT_PUBLIC_QUALIFICATION.md':('BOUNDED NATIVE QUALIFICATION','7 models/36 public programs/668 actual native prefixes,8216 stages;21/328 historical tests. Exact component trajectories, safe-view hidden-outcome controls, native ownership/fault/publication qualified.113 earlier prefixes preserved and reexecuted plus555 fresh at original qualification; no double count. Harness decode/watch/heap repairs do not prove low-memory or long-horizon scaling. Brief12.15-1 bounded, not all lifespan or Campaign3 exit.')
}
O.mkdir(exist_ok=True);commands=O/'commands.json'
if not commands.exists():
 cs=[]
 for script in ['scripts/check-development-component.mjs','scripts/check-development-public-rev3.mjs']:
  r=subprocess.run(['node',script],capture_output=True,text=True,encoding='utf-8');assert r.returncode==0,(r.stdout,r.stderr)
  cs.append(dict(command='node '+script,exitCode=r.returncode,stdout=r.stdout,stderr=r.stderr,checker=ref(script)))
 save(commands,dict(commands=cs,scope='Read-only stored receipt checks; no fresh simulation, production tests or build.'))
entries={e['path']:e for e in load(B/'manifest.json')['entries']};binding={}
for cname in ['DEVELOPMENT_COMPONENT_CLOSURE_REV1.json','DEVELOPMENT_PUBLIC_CLOSURE_REV1.json']:
 c=P/cname
 for a in load(c)['files']:
  if a['path'] in specs:assert sha(a['path'])==a['sha256'];binding[a['path']]=[ref(c),ref(a['path'])]
for name in ['DEVELOPMENT_COMPONENT_PLAN_REV1.json','DEVELOPMENT_PUBLIC_PLAN_REV3.json']:
 plan=P/name
 for a in load(plan)['files']:
  if a['path'] in specs:assert sha(a['path'])==a['sha256'];binding[a['path']]=[ref(plan),ref(a['path'])]
owner=P/'DEVELOPMENT_OWNER_REQUIREMENTS_2026_10_01.md';contract=Path('docs/formal/DEVELOPMENT_COMPONENT_CONTRACT.md')
assert owner.name in contract.read_text(encoding='utf-8')
assert 'supersedes the' in owner.read_text(encoding='utf-8') and 'DEVELOPMENT_STATE_READINESS.md' in owner.read_text(encoding='utf-8')
for name in ['DEVELOPMENT_OWNER_REQUIREMENTS_2026_10_01.md','DEVELOPMENT_STATE_READINESS.md','DEVELOPMENT_COVERAGE_READINESS.md']:
 binding[(P/name).as_posix()]=[ref(owner),ref(contract),ref(P/name)]
obs=['RO-C3-008','RO-C3-009','RO-C3-010','RO-C3-013','RO-C3-017','RO-C3-019','RO-C3-020','RO-C3-021','RO-C3-022'];rows=[]
for path in specs:assert sha(path)==entries[path]['sha256']
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in specs:continue
  path=u['source'];loc=u['location'];ls=Path(path).read_bytes().decode('utf-8-sig').splitlines(keepends=True)
  assert ''.join(ls[loc['startLine']-1:loc['endLine']])==u['text']
  role,judgment=specs[path];rows.append(dict(occurrenceId=u['id'],source=path,sourceSha256=u['sourceSha256'],location=loc,text=u['text'],role=role,judgment=judgment,evidence=binding[path],obligations=obs))
for path in specs:
 ls=Path(path).read_bytes().decode('utf-8-sig').splitlines();covered={i for r in rows if r['source']==path for i in range(r['location']['startLine'],r['location']['endLine']+1)}
 assert {i for i in covered if ls[i-1].strip()}=={i for i,l in enumerate(ls,1) if l.strip()}
v=dict(status='NINE DEVELOPMENTAL SOURCES RECONCILED; HQ011 OPEN',sourceRoles=[dict(**ref(p),role=specs[p][0],judgment=specs[p][1],acceptanceChain=binding[p]) for p in sorted(specs)],rows=rows,commands=ref(commands),obligations=obs,limits=['Source acceptance is scoped: early readiness remains a historical proposal, not retroactively executed evidence.','Controlled phase, authored eligibility and selected procedural/evidence learning are not all biology or all personality formation.','Cited JSON backing/test schemas and preserved source bodies are not whole-reviewed by source references.','HQ011 universe adequacy and HQ012 corpus gates remain open.'])
save(O/'review.json',v);c=dict(status=v['status'],sources=len(specs),originalOccurrences=len(rows),bySource=dict(collections.Counter(r['source'] for r in rows)),reviewSha256=sha(O/'review.json'),checkerSha256=sha(__file__));save(O/'check.json',c);print(json.dumps(c))
