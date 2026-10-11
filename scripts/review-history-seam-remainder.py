"""Reviewed seam-index summaries; preserve occurrence identities and prior scope."""
from pathlib import Path
from fractions import Fraction
import json, hashlib
P=Path('docs/planning'); B=P/'campaign3-history-universe-rev1'
O=P/'campaign3-history-seam-remainder-rev1'
def load(p): return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def sha(p): return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def save(p,v):
 if p.exists(): assert load(p)==v,p
 else: p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
# Bounds select the reviewed historical subject, not acceptance based on a label.
# The named prior overlays supply the specific scientific claims and their limits.
specs=[
 (398,'ALLOCATION','Append-only symbolic/allocation homes and explicit acceptance supersede pending-number routing only.','Shape, allocation and runtime are separate; do not reuse fixture namespaces or retroactively relabel frozen identities.','campaign2-admission'),
 (448,'VAL','Closed committed semantic operands and separate build support; content kind and validator coverage corrected before accepted shape.','Uncommitted callback admission is not allowed by successful component execution; shape and329/330 allocation alone pass no VAL runtime gate.','campaign2-admission'),
 (511,'FACTORY-PERSIST','Data-only facade and declaration-derived execution; EVID zero subject/state reads; exact empty metadata independently justified by admitted execution closure.','Retracted REG mirror remains rejected. Broader build capability does not enter model identity; current PERSIST-I executable proof is a successor receipt, not historical old-binary evidence.','factory'),
 (579,'ORIGIN-CONTENT','Two origin families, structural complete content identity and shared runtime allocator; authoritative content home separate from fixtures.','Neither generic IDN qualification nor byte representability establishes a production identity namespace. No historical/new canonical byte equivalence.','campaign2-admission'),
 (662,'BRIDGE','Exact ordered-input grammar and sole scoped observer projection; hidden-count control separates cognition from adaptation.','Preserve raw private candidate versus authoritative permitted occurrence. Observation unit allocation alone is not runtime qualification.','campaign2-admission'),
 (681,'PACKAGING','Six-slot registry, committed numeric/RNG/profile bundle, new identities for trace semantics, frozen predecessors.','Reproducible bytes and fresh-process save continuation do not alone prove whole factory/VAL/phenomenon gates.','campaign2-admission'),
 (757,'FACTORY-ASSAYS','Finite oracle comparisons, mutants and rollback witnesses progressively establish distinct boundaries.','Preserve undetected initial mutant, saved-time rejection-only false assurance, timeout and carrier-provenance gaps. Counted declaration comparisons are not all runtime mutations.','ledger-campaign2'),
 (885,'ROSTER-CAPABILITY','Accepted generic roster-positive plus bounded public exclusion split; actual state-handle leak repaired.','Generic roster evidence does not make roster intervention admitted by the narrow profile. Fixed-pulse bridge cannot prove adaptation-dependent later evidence.','ledger-campaign2'),
 (912,'PROBE','Diagnostic R0+D observation-only scope, exact lattice/permissions, nonsemantic padding, successor trace accessor and profile.','Observed203 divergence leaves matched X/E/L equal until explicit carriage; invalid seed fixtures fixed without production relaxation. Shape/packet freeze does not itself pass runtime vectors.','probe-carriage'),
 (1013,'PROBE-TIME','Time-varying generic consumer plus exact public exclusion is the accepted conjunction.','No temporal public model inferred; parent cognitive/PHEN obligation not discharged by observation-only assay.','probe-carriage'),
 (1934,'TASK-DRAFTS','Available/adopted tasks, unknown/zero forecast and lifecycle separated before cognitive runtime; raw activation assumption corrected.','Historical compiler exploration is not generated feedback. Wrong0.1 key roles corrected in0.2 without renumbering;17 construction tests/192 combinations not runtime.','cognitive'),
 (2065,'COGNITIVE-RESUME','Actual finite public runtime supersedes no-runtime routing; later qualified ledger supplies completion scope.','Twenty-one recipe progress alone does not pass all frozen vectors; PERSIST-I old status is superseded only by explicitly scoped later evidence.','ledger-campaign2'),
 (2107,'CORPUS028','Eleven obligation bodies joined ten preserved members with distinct corpus identity.','Membership is an obligation, not passing status or seam authorization;0.27 verdict commitments remain historical0.27.','ledger-early'),
 (2136,'CONCERN-RULING','Transient character-state to later attention is ratified; separate absent mechanism, absent lawful feedback and known value.','TaskConcern is not general Affect; linear law not ratified. CandidateB shape comparison and later C keep eligibility/K fixed.','ledger-early'),
 (2177,'CONCERN-LAWS','Neutral equality, exact5/3 score tie and later flip discriminate A/B/C; encoding and retrieval arms independently variable.','A-linear-limit wording is not a literal limit of fixed-encoding one-parameter C. C6 fixture relative; no universal law or general dimensionality proof.','ledger-early'),
 (2222,'CONCERN-CEILING','Finite C gains strictly below omega2; A attains2 only with zero incidental encoding.','At threshold2 A can tie, but cannot strictly cross; canonical tie selection is distinct from strict score reversal. Higher bounds remain conditional, not work required by an arbitrary harder fixture.','ledger-early'),
 (2263,'AGENCY-SOCIAL','Each named qualification supplies its bounded independent execution, observer, goal, control or communication witness.','Carry exact prior claim dispositions: probabilities versus actions; instruction versus chosen framing; appearance versus identity; current intent versus retained impression; private truth is not admitted evidence. Dated next/status lines are routing.','ledger-agency-social'),
 (2392,'SOCIAL-BIOLOGY','Historical summaries retain source-safe causal/appraisal/history distinctions and independent component/public scope.','Prospective response distributions are not enacted delegation/mourning. Cue access is not urge/action; state adaptation is not attenuated effect; feedback not pathwise harm reducing. Biology18 behaviors do not imply organ/clinical fidelity or irreducible meters.','ledger-biology'),
 (2695,'IDENTITY-MEMORY','Separate eligibility, standing, represented belief, disposition, constitution and memory owners; later native counterparts retain original component limits.','Corrected source eligibility excludes world permission/task context. Whole-wrapper publication replaces torn-save gap. No natural recognition, state retirement, general scaling or compulsory action from changed probability.','ledger-identity'),
 (2945,'DEVELOPMENT','Owner explicitly requires independent younger learning plasticity and greater event-time personality authorship weight; native successor qualifies bounded13-stage path.','Practice opportunity is not age. Original eligibility and immutable constitution remain; Step/Ramp and gain controls not universal developmental law. Intermediate running matrix superseded by full scoped receipt.','ledger-identity'),
 (3108,'RESIDUAL-CLOSURES','Late component and selected-native qualifications preserve independent perceptual, belief, affect, source, identity and action operands.','Scalar successes remain. Component/receiver reconstructions not all joined native saves; source episode loss not new-practice loss. No all-seed forced resumption, clinical law or exit from132 bounded clauses. Stale jobs/counters are dated history.','ledger-residual')]
prior={}
for name in sorted({s[4] for s in specs}):
 path=P/('campaign3-history-'+name+'-rev1/review.json')
 prior[name]=dict(path=path.as_posix(),sha256=sha(path))
remaining=load(P/'campaign3-history-seam-correspondence-rev1/review.json')['remaining']
ids={r['occurrenceId'] for r in remaining}; rows=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['id'] not in ids: continue
  start,name,claim,limits,basis=max((s for s in specs if s[0]<=u['location']['startLine']),key=lambda s:s[0])
  rows.append(dict(occurrenceId=u['id'],location=u['location'],text=u['text'],claim=name,disposition=claim,limits=limits,priorReview=prior[basis]))
assert len(rows)==267 and {r['occurrenceId'] for r in rows}==ids
raw=(B/'sources/docs/planning/SEAM_LEDGER.md').read_bytes()
assert Path('docs/planning/SEAM_LEDGER.md').read_bytes()==raw
lines=raw.decode('utf-8-sig').splitlines(keepends=True)
for r in rows: assert ''.join(lines[r['location']['startLine']-1:r['location']['endLine']])==r['text']
# Endpoint precision is independently checked without rerunning a production model.
gains=[1,3,10,100]
ceilings=[dict(gain=g,omega=str(1+Fraction(g,1+g))) for g in gains]
assert all(Fraction(r['omega'])<2 for r in ceilings)
evidence=[prior[n] for n in sorted(prior)]
for name in ['CAMPAIGN3_HISTORY_PERSIST_I_CHECKPOINT.md','CAMPAIGN2_FCT6_QUALIFICATION.md','CAMPAIGN3_PENDING_OWNER_DECISIONS.md','DEVELOPMENT_OWNER_REQUIREMENTS_2026_10_01.md']:
 p=P/name;evidence.append(dict(path=p.as_posix(),sha256=sha(p)))
v=dict(status='ALL REMAINING FROZEN SEAM OCCURRENCES REVIEWED; WIDER HQ011 OPEN',source=dict(path='docs/planning/SEAM_LEDGER.md',sha256=sha(B/'sources/docs/planning/SEAM_LEDGER.md')),rows=rows,evidence=evidence,exactRationalCeilings=ceilings,obligations=['RO-C3-019','RO-C3-020','RO-C3-021'],limits=['Grouped summaries refer to their already reviewed exact claim spine; no new experiment, acceptance, law selection or retirement.','Dated counters, next routes and tool sessions do not control current work.','No fresh production simulation, test suite or build; exact endpoint arithmetic is an audit check only.'])
O.mkdir(exist_ok=True);save(O/'review.json',v)
c=dict(status=v['status'],originalOccurrences=len(rows),claimGroups=len(specs),totalFrozenSeamOccurrences=557,indexedWholeOccurrenceLinks=1801,reviewSha256=sha(O/'review.json'),checkerSha256=sha(__file__))
save(O/'check.json',c);print(json.dumps(c))
