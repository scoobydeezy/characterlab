"""Bind six dated coverage entries to scoped qualification and successor evidence."""
from pathlib import Path
import json,hashlib
P=Path('docs/planning');O=P/'campaign3-history-chronology-interpretation-attribution-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def save(n,v):
    p=O/n
    if p.exists():assert load(p)==v,p
    else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
roles={x['path']:x for x in load(P/'campaign3-history-source-roles-rev313/index.json')['roleAssignments']}
def evidence(*names):
    result=[]
    for name in names:
        p=P/name;r=roles[p.as_posix()]
        assert ref(p)['sha256']==r['sha256']
        for x in r.get('evidence',[]):assert ref(x['path'])['sha256']==x['sha256']
        result.append(dict(**ref(p),sourceRole=r))
    return result
sections=[
 (3046, 3077, 'INTERPRETATION RUNNING',evidence('CAMPAIGN3_INTERPRETATION_QUALIFICATION.md'),'Dated public qualification running is not PASS. Eight models29 RunIdentities frozen; negative/misleading fixture alias is one run.33 tests/reference328/build do not replace aggregate116-prefix public evidence. Two-glyph/two-convention channel for one causal proposition is controlled semantics,not learned vocabulary or general discovery.'),
 (3078, 3112, 'INTERPRETATION QUALIFIED',evidence('CAMPAIGN3_INTERPRETATION_QUALIFICATION.md'),'Eight models29 runs116 prefixes separate speaker belief,intended meaning,produced glyph,received glyph/context,interpreted meaning and learned belief. Same raw glyph may be understood differently; later correction preserves earlier error. ContextualMean versus LiteralMean earns bounded context sensitivity,not universal law; LastInterpretation remains competitor. Missing context retains glyph without meaning; known false is zero; NoInterpretation and NoLearning distinct. Honest false causal belief can be correctly understood: misunderstanding is relative to intent,not truth. Fixed observations with changed private intended content preserve whole lawful views; IntentOracle fails. Failed delivery preserves intent/expression without sample. Actual reasons/dice choices and balanced addressed draws remain; learning140 changes later40. Nine communication clauses separately bounded do not establish joint/general communication.'),
 (3113, 3132, 'ATTRIBUTED PENDING FIRST',evidence('CAMPAIGN3_ATTRIBUTED_QUALIFICATION.md'),'Six frozen models34 tests/reference328/build are pre-public status,not30-run120-prefix PASS yet. Stale bigint requires1083/1 rejected compilation before model freeze; partial freeze ReadDomain max1 contradicted already-declared Oracle two-read contract and corrected to max2 with original partial files/allocation preserved. Scaffolding duplicate local name failed before writes. Construction corrections are not rejected psychological candidates.'),
 (3133, 3157, 'ATTRIBUTED PENDING REPEATED',evidence('CAMPAIGN3_ATTRIBUTED_QUALIFICATION.md'),'Repeated pending status with obligation table is separate original occurrence,not additional qualification. Initial34 tests passed but generic CanonicalValue record reads failed build; narrowed readers/test helper then repeated validation. Strengthened report-only comparison disables delivery in both arms so entire B actual state remains fixed throughout,not just current probes. No runtime law/model identity changed; original weaker fixtures and both development cohorts preserved.'),
 (3158, 3191, 'ATTRIBUTED QUALIFIED',evidence('CAMPAIGN3_ATTRIBUTED_QUALIFICATION.md'),'Six models30 runs120 prefixes separate A own belief,B actual belief,A/C keyed attribution and actual explanation/defer choice. Report-only intervention fixes B entire state by disabling delivery; A own belief unchanged. Unknown attribution is not reported ignorance,exposure is not comprehension,and knowledge label is not factive. LatestReport/MajorityReport retain same history but differ after contradiction; neither universal. NoPersonModel preserves genuine contested reasons/dice without importing target truth or own belief. Successful delivery can update B without updating A model; attempted explanation does not imply knowledge of success. Whole later views remain invariant under hidden target belief/access and delivery changes; PrivateStateOracle fails. Controlled semantic reports,finite depth and fixed motives do not qualify natural recognition,learned trust,deeper nesting or general theory of mind.'),
]
common=evidence('MOTIVE_AUDIT_VALIDATION_FINDING_REV1.json','CAMPAIGN3_EXIT_RECONCILIATION_READINESS.md')
ss=[dict(startLine=a,endLine=b,role=k,disposition=n,acceptanceChain=e+common,obligations=['RO-C3-019','RO-C3-020','RO-C3-021']) for a,b,k,e,n in sections]
cpath=P/'campaign3-history-chronology-candidates-rev1/occurrences.json';candidate=load(cpath);rows=[]
for item in candidate['rows']:
    u=item['original'];s=[x for x in ss if x['startLine']<=u['location']['startLine']<=x['endLine']]
    if not s:continue
    assert len(s)==1 and u['location']['endLine']<=s[0]['endLine']
    rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],sectionStartLine=s[0]['startLine'],disposition='DATED CLAIM/ROUTING; bound section specifies scoped acceptance and supersession'))
priorPaths=[P/f'campaign3-history-chronology-{n}-rev1/review.json' for n in ['tail','integration','cognition','coverage','development-audits','development-workers','development-scope','defining-public','defining-owners','embarrassment-bridge','intoxication-reappraisal','disposition-sleep','belief-wrapper-recovery','identity-admission-belief','eligibility-capability','biology-public','biology-work-order','tolerance-relapse','habit-reinforcement','prospective-goals','grief-control','relationship-history','social-attribution','personstate-fear']]
prior=[r for p in priorPaths for r in load(p)['rows']]
ids=[r['occurrenceId'] for r in prior+rows];assert len(ids)==len(set(ids))
O.mkdir(exist_ok=True)
save('review.json',dict(status='FIVE INTERPRETATION AND ATTRIBUTION ENTRIES RECONCILED; WHOLE LOG OPEN',checker=ref('scripts/review-history-chronology-interpretation-attribution.py'),candidates=ref(cpath),resolvedSource=candidate['resolvedSource'],sections=ss,rows=rows,priorReviews=[ref(p) for p in priorPaths],limits=['No runtime tests or original writer rerun. Historical counts are not fresh execution.','No whole-log assignment or HQ011 closure. Original bytes and occurrence identities preserved.']))
save('findings.json',{'status': 'OWNED LIMITS PRESERVED', 'findings': [{'owner': 'RO-C3-020', 'distinction': 'Intended meaning,admitted signal,interpretation and factual truth differ.', 'blockedClaim': 'Correct comprehension verifies truth or private intent can substitute for interpretation.', 'reopen': 'Broader semantics need controlled access and independently qualified learned conventions.'}, {'owner': 'RO-C3-020', 'distinction': 'Attribution can change actual communication choice while target entire state is fixed.', 'blockedClaim': 'Probe-only equality establishes an independent report intervention throughout the run.', 'reopen': 'New attribution interventions must control communication consequences and full target state.'}, {'owner': 'RO-C3-020', 'distinction': 'Unknown attribution,reported ignorance and target actual belief remain separate.', 'blockedClaim': 'Exposure or attempted/successful delivery gives speaker automatic knowledge of comprehension.', 'reopen': 'Delivery awareness and deeper mentalizing require admitted evidence and independent consumers.'}, {'owner': 'RO-C3-020', 'distinction': 'Construction and schema failures precede or differ from scientific qualification.', 'blockedClaim': 'Passing tests erase failed builds,partial freezes or establish public matrix completion.', 'reopen': 'New closure claims must bind exact corrected identities and preserve failed cohorts.'}]})
save('check.json',dict(status='PASS SCOPED CHRONOLOGY ACCOUNTING; HQ011 OPEN',sections=len(ss),newOccurrences=len(rows),priorOccurrences=len(prior),cumulativeReviewed=len(ids),remainingOriginalOccurrences=len(candidate['rows'])-len(ids),review=ref(O/'review.json')))
assert all(p.stat().st_size<50_000_000 for p in O.iterdir())
print(json.dumps(load(O/'check.json')))
