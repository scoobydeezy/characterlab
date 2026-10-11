"""Review all343 existing supplemental formula occurrences without authenticating a false pin."""
from pathlib import Path
from fractions import Fraction as Q
import json,hashlib,copy
P=Path('docs/planning');D=P/'campaign3-history-citation-review-rev1';O=P/'campaign3-history-external-formulas-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def ref(p):return dict(path=str(p).replace('\\','/'),sha256=sha(p))
def save(p,v):
 if p.exists():assert load(p)==v,p
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
source=D/'VivariumMathematicalReference.md';unitsPath=D/'external-units.json';units=load(unitsPath);assert len(units)==343
raw=source.read_bytes().decode('utf-8-sig');rawLines=raw.splitlines(keepends=True);lines=raw.replace('\r\n','\n').splitlines(keepends=True)
# Boundaries are the manually inspected document's subsection starts, not a keyword
# classifier or automatic acceptance rule. Each subsection retains its limitations.
specs=[
 (0,'PROVENANCE / PURPOSE','The self-declared implementation/verification date and linked production sources describe intended provenance only. The local untracked copy is authenticated as bytes; the cited historical commit path is unsupported. No current or historical implementation parity is established.'),
 (9,'NUMERIC FRAME','Numeric conventions belong to this historical candidate, not universal CharacterLab units.'),
 (10,'UNITS','Scale10000 and signed64 ranges are historical conventions; CharacterLab exact rational/lattice domains remain versioned per seam. Covariance needs squared units; nominal bounds do not ensure PSD.'),
 (16,'CLAMP','Clipping removes exposed overshoot information. It does not authorize perception of hidden overflow or erase separate physical consequence/retained evidence.'),
 (19,'DIVISION','Mathematical floor/ceiling must account for divisor sign and nonzero domain. Monotonicity alone does not establish event-partition invariance.'),
 (23,'ROUNDING','Historical half-away rounding differs from current accepted ties-even. Multiplication/scaling and final64-bit clamp are candidate semantics; do not silently substitute them into immutable contracts.'),
 (30,'TIME FRAME','Historical time formulas are controls; accepted substrate owns exact anchor/remainder semantics.'),
 (31,'CALENDAR','Integral minutes and calendar conversion require defined signed quotient/remainder for negative time; no automatic adoption of production calendar units.'),
 (36,'ANALYTICAL ANCHORS','Clamped floor progression and re-anchoring can discard fractional remainder. Accepted MATH001 retains remainder/prohibits incidental reset for its linear domain; no universal nonlinear/time-unit equivalence.'),
 (44,'FIXED DURATION','Rational endpoint rate and immediate nonpositive-duration completion are authored temporal policies. Keep zero-duration handling explicit, not inferred from division.'),
 (48,'THRESHOLD CROSSING','Increasing ceil and decreasing strict-inequality floor formulas are coherent for declared linear/floor progression. Reachability, already-satisfied threshold and clamping require separate guards; finite domain/vector proof remains with accepted contract.'),
 (56,'MPS NEEDS','Hunger/social/recreation/energy rates and thresholds are content tuning, not mandatory Need ontology or biological calibration. Later body and Need distinctions remain separately qualified.'),
 (60,'WORLD SCHEDULING FRAME','Travel/activity/calendar source policies are world-side candidates, not automatic character causal state.'),
 (61,'ROUTES','Shortest-path relaxation assumes lawful nonnegative route costs and explicit stable ties. MPS route minutes are world fixtures; no learned planning or perceived path-cost inference follows.'),
 (68,'TRAVEL DISPLAY','Clamped display progress is read-only; it neither moves the character nor qualifies execution. Nonpositive duration guard is retained.'),
 (72,'CONTEXT PERFORMANCE','Sum of separately floored context intervals is partition-sensitive. Actual context changes may be causal, but incidental scheduling cuts must not silently alter accepted progress; preserve the remainder witness.'),
 (76,'RECURRENCE','Double modulo/day-mask math handles negative days only within declared positive cycle and valid bit width. Bounded one-cycle scanning does not prove general planning.'),
 (82,'WINDOWS','Half-open execution overlap and inclusive latest-start expiry are distinct scheduling boundaries. Declared earliestStart+duration overlap is not full joint feasibility.'),
 (90,'JOINT FEASIBILITY','Travel-aware complete bounded orderings can detect conflicts missed by pairwise overlap. Completeness and cost depend on enumerated finite domain; this is not arbitrary planning or character-side foresight.'),
 (99,'RANDOM FRAME','Historical FNV/avalanche identity is a control, not the current cenc/SHA256 addressed implementation.'),
 (100,'FNV','Byte order and UTF16 code units are part of this hash definition; no collision-free identity or cross-encoding equivalence is implied.'),
 (104,'ADDRESS COMBINATION','Pure semantic addressing preserves unrelated-draw independence in its defined scheme. Historical64-bit combining is superseded only by explicit structural/SHA256 contracts; semantic IDs remain distinct from hash equality.'),
 (113,'UNBIASEDNESS CLAIM','The heading and unconditional unbiasedness statement are not accepted. A deterministic total mapping of a uniform finite2^64 source cannot be exactly uniform for span3. Iterated deterministic avalanche is not independent resampling; termination/fallback and residual bias need their own proof. Preserve MATH005 ideal-candidate bound, not exact unbiasedness.'),
 (124,'DISCOVERY','Difficulty-complement chance is a declared knowledge-discovery control. Stochastic admission is not sensory truth or calibrated evidence quality; governed perception/learning remains separate.'),
 (128,'GENERATED PERSONALITY','Seven-coordinate random latent profiles, lens priors and interaction/ideal constants are CTL006 constitutional controls, not universal personality or earned identity. Uniform-sampling language inherits the mapper caveat.'),
 (134,'CANDIDATE SAMPLING','8k+16 attempts bound attempts, not guaranteed fill or unbiased distinct subsets; sorted mapping is deterministic presentation.397/XOR IDs can collide and do not establish globally unique semantic scope. Population scanning/selection cost needs actual index assumptions.'),
 (144,'SIGNAL FIELD AUTHORITY','Calling this the principal CharacterLab primitive is historical source framing, not current architecture authority. Quadratic fields remain comparison candidates.'),
 (146,'FIELD INPUTS / FACTOR ORIENTATION','Mean/covariance do not specify a whole distribution. Upper-triangle pair terms require a consistent symmetric-Q convention. P=LL^T conflicts with a literal row-factor sum unless L orientation is redefined: row factors imply L^T L. Resolve notation/dimensions before adoption; no current code-bug claim.'),
 (153,'POINT QUADRATIC','Quadratic/ideal point expression is candidate arithmetic. Off-diagonal factors and row/column ideal-factor orientation must agree before claiming sparse/matrix equivalence.'),
 (161,'EXPECTED QUADRATIC','Expectation from first/second moments is valid for a genuinely quadratic field under consistent coefficient conventions; does not require Gaussianity itself. Trace and per-pair forms must share that convention.'),
 (171,'QUADRATIC VARIANCE','Stated variance requires Gaussian fourth-moment assumptions. Equal mean/covariance can have different fourth moments and quadratic variance. Clamping a rounded negative variance to0 does not prove distribution or covariance validity.'),
 (177,'BOUNDED RESPONSE','Softsign is candidate response; g(E[s]) is explicitly a plug-in approximation and delta-method variance is first order. Exact witness E[g(X)]=1/3 versus g(E[X])=1/2 for equiprobable0/2. No calibrated output uncertainty or universal affect currency.'),
 (192,'SOCIAL FRAME','Derived trait/appraisal candidates do not retire distinct constitutional, standing, self-belief and observer-belief roles.'),
 (193,'TRAIT PROJECTION','Named trait as a latent view is a representation hypothesis. Pair expectation uses covariance; no learned self-model or separate-state redundancy proven for arbitrary future queries.'),
 (199,'CONTEXT CONDITIONING','Context changes the read-only field, not stored personality or belief. Adding factor matrices before squaring creates cross terms; not equivalent to adding independent penalty matrices without proof.'),
 (203,'COMPOSITE UNCERTAINTY','Source explicitly carries the old personality variance/derivative after adding pressures. Preserve this known approximation; do not call it recomputed composite uncertainty. Shared-tag min-absolute/sign rule is a candidate overlap law, not general correlation/provenance handling.'),
 (211,'CALIBRATION BANDS','Magnitude thresholds and separate sign are authored MPS calibration, not universal psychological intensity or accepted reason grammar thresholds.'),
 (215,'RELATIONSHIPS','Directional clamped history/familiarity/exposure remain distinct. Symmetric ordinary-interaction increments are an authored fixture; accountability is directional. No natural recognition, trust inference or general relationship necessity follows.'),
 (223,'BELIEF FRAME','Kalman social model is a historical candidate, not the currently qualified scalar BELIEF law.'),
 (225,'MEASUREMENT','Authored h/y/R and broad prior do not implement observer-safe measurement compilation or establish calibrated noise. Preserve MATH006 boundary.'),
 (230,'INNOVATION','Kalman gain requires valid covariance and positive innovation variance plus consistent units. Zero/invalid denominators need explicit admission, not assumptions from syntax.'),
 (236,'COVARIANCE UPDATE','Exact captured-prior update differs from independently rounded/clamped entries. Entrywise clamps are not generally PSD-preserving; generic counterexample does not prove it is reachable in this particular implementation.'),
 (241,'CONTRADICTION','Two-standard-deviation threshold and diagonal inflation are declared adaptive heuristics, not calibrated posterior confidence. Scaling/clamps and measurement assumptions remain material.'),
 (249,'SOCIAL MEASUREMENTS','Friendly/fulfilled/breached h/y/R values are authored controls, not semantic perception or morally correct evidence.'),
 (252,'REASONING FRAME','Historical scalar option score and reason/dice alternatives require explicit comparison; mandatory retained grammar cannot be silently replaced.'),
 (253,'SIGNAL NORMALIZATION','Need/range normalization requires nonzero range; priority/urgency/travel mappings and predicate encodings are authored semantic scales. Hidden truth must not enter cognition merely because it can be normalized.'),
 (261,'ADDITIVE OPTION SCORE','Saturated sum of bounded considerations is a preserved competitor. Same expectation or signed sum does not preserve distributions, reason provenance, modifier roles or arbitration in general.'),
 (265,'CONSOLIDATION','Max-absolute within option/channel/subject prevents this declared stacking; stable ties and AllowStacking are semantics. Labels alone do not identify arbitrary shared evidence or correlations.'),
 (269,'SCORE TO DIE','Threshold ladders, zero-threshold exceptions and legacy appraisal die mapping are historical controls. Current inherited compiler profile/version must be named; no automatic substitution of MPS thresholds.'),
 (275,'IMPORTANCE','Max reason magnitude is a candidate importance projection with authored feed floors. It is not current contest/authorship or universal affect intensity and does not justify scalar mechanism retirement.'),
 (278,'MPS FIELDS','Honorability, hunger, work, interest, rest and social coefficients are tuning. Softsign/fixed-point normalizations remain part of the candidate; no universal scale or truth access implied.'),
 (282,'FINITE REARM / REST CLAIM','Subtracting1000 eventually prevents threshold rearm, but formula alone does not prove a Rest action is selected/executed. An additional fallback/availability/decision rule is required for the stronger terminates-in-Rest sentence. Preserve it as unverified behavioral claim, not a discovered current runtime failure.'),
 (286,'DICE FRAME','Historical interaction/roll policies are controls distinct from actual character choice/execution.'),
 (287,'INFLUENCE ROLLS','Independent semantic addresses, loaded fixed face and selected reroll index have different roles. Uniform language inherits finite-mapper assumptions; player intervention does not choose an arbitrary outcome by declaration.'),
 (292,'WINNER / TIES','Supporting-minus-opposing totals, authored option-order ties and margin bands are explicit candidate semantics. Authored tie order can determine tied winners; do not equate it with incidental iteration independence or current arbitration law.'),
 (301,'DIE STEPPING','Bounded sanctioned ladder with saturating endpoints is an intervention control, not a general reason-strength metric.'),
 (305,'RESOURCE FRAME','Nudge/refresh/offline conversion are production surroundings unless a declared character seam consumes lawful evidence.'),
 (306,'CAPPED RESOURCE','Spend guards and capped increases are world/player economy semantics, not character Need, affect or earned control.'),
 (311,'ALIGNED REFRESH','Strictly later480-minute boundary needs sign-correct floor for negative time; capped regeneration is authored policy.'),
 (315,'OTHER REFRESH','Advancing refresh time across missed periods while increasing balance once is an explicit policy, not equivalent to crediting every missed interval.'),
 (319,'OFFLINE TIME','Wall time is converted into explicit bounded integral input; it must not become an uncommitted nondeterministic read during replay. Seven-day cap and ratio are tuning.'),
 (324,'DISPLAY FRAME','Player-visible projections are not cognition or physical truth mutation.'),
 (326,'TIMELINE','Clamped integer percent is display-only; preserve zero-duration guard and do not infer actual execution.'),
 (330,'CAPACITY DISPLAY','Remaining capacity projection clamps at0; it does not prove reservations/atomic allocation or create capability.'),
 (333,'LABELS','Clock quotient/remainder and speed formatting remain presentation, with negative-time convention explicit.'),
 (335,'DEPENDENCY MAP','Diagram summarizes this historical implementation, not canonical CharacterLab topology. Existing epistemic boundaries and causal owners outrank it.'),
 (339,'INTERPRETATION CAUTIONS','Retain units, plug-in approximation, directional belief, sign/magnitude and authored constants as hypotheses. Uncertainty can be causal in this candidate without establishing universal vector necessity.'),
 (341,'VERIFICATION CLAIM','Self-declared production verification and maintenance rule do not authenticate the cited commit or prove current source parity. Correct-forward provenance remains owed; accepted CharacterLab contracts are independently authoritative.')]
rows=[];adapters=0
for i,u in enumerate(units):
 assert u['sourceSha256']==sha(source) and u['text']==''.join(lines[u['startLine']-1:u['endLine']])
 original=''.join(rawLines[u['startLine']-1:u['endLine']]);adapters+=original!=u['text']
 assert original.replace('\r\n','\n')==u['text']
 encoded={k:v for k,v in u.items() if k!='id'};assert u['id']==hashlib.sha256(json.dumps([source.as_posix(),encoded],ensure_ascii=False,separators=(',',':')).encode()).hexdigest()
 _,topic,judgment=max(s for s in specs if s[0]<=i)
 rows.append(dict(occurrenceId=u['id'],source=source.as_posix(),sourceSha256=u['sourceSha256'],location=dict(startLine=u['startLine'],endLine=u['endLine']),text=u['text'],topic=topic,disposition=judgment,role='SECTION LABEL WITH SCOPE' if u['text'].lstrip().startswith('#') else 'REVIEWED HISTORICAL CANDIDATE / LIMIT',obligations=['RO-C3-010','RO-C3-019','RO-C3-020','RO-C3-021']))
assert len({r['occurrenceId'] for r in rows})==343
assert {n for r in rows for n in range(r['location']['startLine'],r['location']['endLine']+1)}=={n for n,s in enumerate(lines,1) if s.strip()}
# Exact arithmetic probes substantiate hazards; they do not simulate source programs.
L=[[1,2],[0,1]]
transpose=lambda a:list(map(list,zip(*a)))
matmul=lambda a,b:[[sum(x*y for x,y in zip(row,col)) for col in zip(*b)] for row in a]
rowP=matmul(transpose(L),L);columnP=matmul(L,transpose(L));assert rowP==[[1,2],[2,5]] and columnP==[[5,2],[2,1]]
soft=lambda x:x/(1+abs(x))
expected=(soft(Q(0))+soft(Q(2)))/2;plugin=soft(Q(1));assert expected==Q(1,3) and plugin==Q(1,2)
distA=[(Q(-1),Q(1,2)),(Q(1),Q(1,2))];distB=[(Q(-2),Q(1,8)),(Q(0),Q(3,4)),(Q(2),Q(1,8))]
moment=lambda d,n:sum(x**n*p for x,p in d)
assert moment(distA,1)==moment(distB,1)==0 and moment(distA,2)==moment(distB,2)==1
assert moment(distA,4)-1==0 and moment(distB,4)-1==3
detBefore=Q(3)*Q(1,10)-Q(1,2)**2;detAfter=Q(1)*Q(1,10)-Q(1,2)**2;assert detBefore==Q(1,20) and detAfter==Q(-3,20)
witnesses=dict(rowFactorOrientation=dict(L=L,rowFactorPenalty=rowP,literalLLTranspose=columnP,atVector10=[1,5],scope='Notation ambiguity; resolve orientation before adoption, not proof of a reachable source bug.'),softsign=dict(exactExpected=str(expected),plugin=str(plugin)),sameMeanVarianceDifferentQuadraticVariance=dict(mean=0,variance=1,quadraticVariances=[0,3]),entryClamp=dict(beforeDeterminant=str(detBefore),afterDeterminant=str(detAfter),scope='Generic PSD clamp counterexample; reachable-state claim not made.'),finiteUniform=dict(sourceBits=64,span=3,remainder=(2**64)%3,scope='No deterministic total finite-domain map can have equal preimage counts here; no claim about the ideal-candidate bound being violated.'),partition=dict(uninterrupted=1,separateFloors=0),finiteThreshold=dict(values=[2000,1000,0,-1000],conclusion='Finite rearm only; Rest selection/execution requires additional behavioral rule.'))
v=dict(status='ALL343 SUPPLEMENTAL FORMULA OCCURRENCES REVIEWED; HISTORICAL PIN AND HQ011 OPEN',source=ref(source),inventory=ref(unitsPath),rows=rows,arithmeticWitnesses=witnesses,legacyNewlineAdapters=adapters,evidence=[ref(P/'campaign3-history-intake-crosswalk-rev1/review.json'),ref(P/'campaign3-history-formula-review-rev1/review.json'),ref(P/'CAMPAIGN3_HISTORY_HQ009_CHECKPOINT.md'),ref(P/'CAMPAIGN3_HISTORY_VALUES_ADDITION_CHECKPOINT.md')],obligations=['RO-C3-010','RO-C3-019','RO-C3-020','RO-C3-021'],limits=['Preserved working-copy bytes do not authenticate the absent file at the cited Vivarium commit. No production-parity, changed pin or automatic formula adoption.', 'All343 supplemental occurrence IDs are reused from the immutable extraction, separately from original413894 census and post-cutoff Values paragraphs.', 'MATH001/005/006 bounded accepted resolutions and MATH002/003/004 conditional hazards stand; mathematical review does not independently rerun their original corpus.', 'Ideal-factor orientation and finite-rearm-versus-Rest claims need explicit proof before stronger adoption; current implementation failure is not established.', 'Wider source-role reconciliation, post-cutoff additions, missing legacy log, independent adequacy and HQ012 remain open.'])
O.mkdir(exist_ok=True);save(O/'review.json',v)
c=dict(status=v['status'],supplementalOccurrences=len(rows),topics=len(specs),originalCensusOccurrencesAdded=0,arithmeticWitnessGroups=len(witnesses),legacyNewlineAdapters=adapters,reviewSha256=sha(O/'review.json'),checkerSha256=sha(__file__))
save(O/'check.json',c);print(json.dumps(c))
