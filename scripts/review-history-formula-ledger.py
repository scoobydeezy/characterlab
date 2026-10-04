"""Record reviewed formula-ledger occurrences against frozen source identities."""
from pathlib import Path
import json,hashlib
p=Path('docs/planning'); b=p/'campaign3-history-universe-rev1'; out=p/'campaign3-history-formula-review-rev1'
assert not out.exists(),'Use a successor; prior review is immutable'
def sha(f): return hashlib.sha256(f.read_bytes()).hexdigest()
def load(f): return json.loads(f.read_text(encoding='utf-8-sig'))
def write(f,x): f.write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
source='docs/formal/FORMULA_INTAKE_LEDGER.md'; decision='docs/formal/OPEN_DECISIONS.md'
manifest=load(b/'manifest.json'); entries={e['path']:e for e in manifest['entries']}
units=[]
for line in (b/'units.jsonl').open(encoding='utf-8'):
 u=json.loads(line)
 if u['source']==source: units.append(u)
assert len(units)==34
lines=(b/'sources'/decision).read_text(encoding='utf-8-sig').splitlines(keepends=True)
def evidence(a,z): return {'source':decision,'sourceSha256':entries[decision]['sha256'],'startLine':a,'endLine':z,'text':''.join(lines[a-1:z])}
records=[]
for u in units:
 n=u['location']['startLine']; obligations=['RO-C3-021']; ev=[]; status='REVIEWED NONFINDING'; blocked=''; trigger=''
 if n in [1,9,25,27,33,43,47,51,57,63,65,75,84]:
  why='Heading or list introduction only; substantive content is retained in separately identified following occurrences. This is not exclusion of the associated hazard.'
 elif n in [3,77,94]:
  status='PROVENANCE CLAIM PARTLY UNSUPPORTED'; why='Ledger assumes a reproducible pinned upstream document. Local Git lookup finds the commit but not the path; preserve the claimed pin and do not replace it with current untracked bytes. The no-automatic-contract-mutation rule remains authoritative.'
  blocked='Claim that the cited formula document is reproduced from the pinned commit.'; trigger='Locate authenticated historical source bytes or explicitly amend provenance with retained old evidence.'
 elif n==11:
  status='MATERIAL INTAKE TABLE REVIEW PENDING'; why='Eleven source-area rows mix candidates, mandatory controls and Vivarium-only scope. Table retained intact; no blanket adoption or retirement. Row-level contract/control crosswalk is still owed.'
  obligations+=['RO-C3-020']; blocked='Whole-table adoption, port completion or retirement claim.'; trigger='Review each source-area row against its adopted contracts, comparisons and preservation ledger.'
 elif n in [29,31]:
  status='SCOPED HISTORICAL RESOLUTION LINKED'; ev=[evidence(429,435)]
  why='TIME-001/MATH-001 explicitly closes partition-sensitive incidental re-anchoring for checked linear analytical anchors with retained remainder. Prior proof receipt is referenced, not freshly executed or independently requalified.'
  blocked='Universal nonlinear progression or changed rounding/anchor semantics.'; trigger='Time unit/range, rounding/remainder, re-anchor order, parameter identity or nonlinear algorithm changes.'
 elif n in [35,37,41]:
  status='OWNED CONDITIONAL HAZARD'; obligations+=['RO-C3-020']; ev=[evidence(222,222)]
  why='MATH-002 preserves polynomial upper-triangle versus symmetric-matrix coefficient distinction. Algebraic hazard stands independently of unverified claims about historical Vivarium implementation bytes; no signal-field law adopted.'
  blocked='Treating identical off-diagonal coefficients as equivalent in both conventions.'; trigger='Any signal-field adoption/comparison must choose convention and prove equivalence vectors with half off-diagonals where appropriate.'
 elif n==45:
  status='OWNED CONDITIONAL HAZARD'; obligations+=['RO-C3-020']; ev=[evidence(223,223)]
  why='MATH-003: mean/covariance do not determine arbitrary fourth moments. Retain distribution assumptions as a condition of quadratic variance formulas.'
  blocked='General quadratic variance from mean/covariance alone.'; trigger='Declare and validate distribution/fourth moments or reject closed-form candidate before use.'
 elif n==49:
  status='OWNED CONDITIONAL HAZARD'; obligations+=['RO-C3-010','RO-C3-020']; ev=[evidence(224,224)]
  why='MATH-004: independent entry clamps do not guarantee PSD covariance. Scalar BELIEF qualification does not discharge a covariance/Kalman representation obligation.'
  blocked='Admission of clamped fixed-point covariance as valid without PSD proof.'; trigger='PSD-preserving representation/projection proof before any covariance/Kalman candidate use.'
 elif n in [53,55]:
  status='SCOPED HISTORICAL RESOLUTION LINKED'; ev=[evidence(421,427)]
  why='RND-001/MATH-005 accepts finite bounded rejection plus fresh modulo fallback with an ideal-candidate bias bound, not mathematical unbiasedness. Current upstream implementation identity remains unverified; accepted CharacterLab contract is separately specified.'
  blocked='Unbiasedness or bound extension beyond declared128-bit candidates, two attempts and spans through2^32.'; trigger='Address/schema, candidate width/hash, range mapper, fallback/attempt count, coupling or bias evidence changes.'
 elif n in [59,61]:
  status='SCOPED HISTORICAL RESOLUTION LINKED'; ev=[evidence(409,415)]
  why='MATH-006 closes registered bounded state-change interval compilation with separate missingness and no hidden Overflow. This does not qualify arbitrary sensors, uncertain bounds or general semantic recognition.'
  blocked='General semantic compiler or arbitrary sensing inferred from the bounded observation channel.'; trigger='Measurement mode, interval vocabulary, channel knowledge, polarity, missingness, visibility, precision, timing or hidden-truth influence changes.'
 elif n in [5,7,67,73,79,86]:
  status='REVIEWED GOVERNING INTAKE PROCEDURE'; why='Classification is not adoption; versioned accepted contracts own executable semantics. Re-intake requires previous/proposed provenance, source/row impacts, hazard review, preserved history and versioned contract/corpus changes. These rules remain applicable despite the newly discovered source-pin gap.'
 else: raise AssertionError(n)
 records.append({'occurrenceId':u['id'],'source':source,'sourceSha256':u['sourceSha256'],'location':u['location'],'text':u['text'],'disposition':status,'rationale':why,'obligations':obligations,'blockedClaim':blocked,'reopenOrCompletion':trigger,'resolutionEvidence':ev})
out.mkdir()
write(out/'review.json',{'status':'FORMULA LEDGER SOURCE REVIEW; PARTIAL SCIENTIFIC RECONCILIATION','manifestSha256':sha(b/'manifest.json'),'sourceAuthority':{'path':source,'sha256':entries[source]['sha256'],'acceptedScope':'Intake procedure and explicitly recorded scoped dispositions; not adoption of the11 source-area rows or proof of the cited upstream snapshot.','basis':'AGENTS architectural authority4; ledger itself states no row adopted by appearance and accepted seam contract owns executable meaning.'},'records':records,'searchScope':{'currentFiles':'rg --files --hidden ../vivarium with research-log/RESEARCH.md patterns; no matches returned','gitHistory':'git log --all for claude/characterlab-research-log.md and .claude/characterlab-research-log.md in CharacterLab and Vivarium; no commits returned','limit':'No remote fetch or claim of exhaustive lost-file recovery. No equality to reference/RESEARCH.md established.'},'obligations':['RO-C3-010','RO-C3-019','RO-C3-020','RO-C3-021'],'limits':['All34 ledger paragraphs inspected, including unmarked prose. Original extraction immutable; this is a disposition overlay.','Source-pin claims and11-row table crosswalk remain OPEN.','Three historical resolutions linked to exact decision passages, not freshly rerun experiments or final proof-chain certification.','Three mathematical hazards remain conditional; no covariance or signal-field adoption.','Remaining original413860 units and343 supplemental formula paragraphs not reviewed by this pass.','No canonical universe completeness, zero-unreconciled finding or exit claim.']})
print('Recorded34 source-located formula-ledger dispositions; partial reconciliation only.')
