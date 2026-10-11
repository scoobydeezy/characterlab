"""Bind six dated coverage entries to scoped qualification and successor evidence."""
from pathlib import Path
import json,hashlib
P=Path('docs/planning');O=P/'campaign3-history-chronology-multisource-comparison-rev1'
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
 (1095, 1113, 'NUMERICAL COMPARISON',evidence('MULTISOURCE_EXPRESSIBILITY_AUDIT_2026_09_20.md','MULTISOURCE_CHECKPOINT_2026_09_20.json','CAMPAIGN3_MULTISOURCE_PUBLIC_QUALIFICATION.md'),'13 fixtures52 law runs10 Base-only descriptiondice controls22 exact reference partitions; synthetic inputs actual existing kernels,fixed independentd8 opponent,exact enumeration not RNGsampling or public Decision.21tests/two files;build preceded final weighted-overlap test addition with unchanged production component. No allocation,public originals or whole-phenomenon qualification.'),
 (1114, 1165, 'PUBLIC SOURCE GAP',evidence('MULTISOURCE_EXPRESSIBILITY_AUDIT_2026_09_20.md','MULTISOURCE_CHECKPOINT_2026_09_20.json','CAMPAIGN3_MULTISOURCE_PUBLIC_QUALIFICATION.md'),'Roleblind normalization retains ground labels yet orphan Situation weakens unrelated body motive probability3/5to1/2. Retain exact failed comparator,not silently repaired activeground/role/sign law. Collective third contribution0,total5/9 versus pairwise1/8,total11/19 both probability2/3;probability equality not reduction proof. Typed evidence IDs not authentication/independence;disabled taskforecast and commitment emptybasis cannot be relabelled as observed body support. Diagnostic0..10 and reserveunits distinct;GA retained evidence not automatically admitted to frozenEMB.'),
 (1166, 1182, 'OBLIGATION SEED',evidence('RESEARCH_OBLIGATIONS.md','MULTISOURCE_CHECKPOINT_2026_09_20.json','CAMPAIGN3_MULTISOURCE_PUBLIC_QUALIFICATION.md'),'RO001..009 oneactive/eightconditional accounts then-current eightC3verdicts/eightnamedreports,not whole historical corpus. Check:selftest ten in-memory faults is reference/closure structure,not scientific adequacy or new model execution. Conditional deferral not closure;retained distinction closes preservation question only,not necessity. Current routing/counts in later mutable authority do not overwrite dated seed.'),
 (1183, 1239, 'COMPARISON AFTER BOOKKEEPING',evidence('MULTISOURCE_EXPRESSIBILITY_AUDIT_2026_09_20.md','MULTISOURCE_CHECKPOINT_2026_09_20.json','CAMPAIGN3_MULTISOURCE_PUBLIC_QUALIFICATION.md'),'14 named verdicts differs eight then-current C3verdicts. Existing2171GA/328reference historical,not new21focused validation. GroundAggregate conservative baseline not canonical general law;GroundUncovered additive prebound differs DescriptionDice perdescription onlyBasefixtures. Independentfact controls require independently manipulated operands,not relabelledIDs/resamplingonequantity. Actual authenticated source successor later qualifies bounded path;no newNeed,exchange rate or general independence law.'),
]
common=evidence('MOTIVE_AUDIT_VALIDATION_FINDING_REV1.json','CAMPAIGN3_EXIT_RECONCILIATION_READINESS.md')
ss=[dict(startLine=a,endLine=b,role=k,disposition=n,acceptanceChain=e+common,obligations=['RO-C3-019','RO-C3-020','RO-C3-021']) for a,b,k,e,n in sections]
cpath=P/'campaign3-history-chronology-candidates-rev1/occurrences.json';candidate=load(cpath);rows=[]
for item in candidate['rows']:
    u=item['original'];s=[x for x in ss if x['startLine']<=u['location']['startLine']<=x['endLine']]
    if not s:continue
    assert len(s)==1 and u['location']['endLine']<=s[0]['endLine']
    rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],sectionStartLine=s[0]['startLine'],disposition='DATED CLAIM/ROUTING; bound section specifies scoped acceptance and supersession'))
priorPaths=[P/f'campaign3-history-chronology-{n}-rev1/review.json' for n in ['tail','integration','cognition','coverage','development-audits','development-workers','development-scope','defining-public','defining-owners','embarrassment-bridge','intoxication-reappraisal','disposition-sleep','belief-wrapper-recovery','identity-admission-belief','eligibility-capability','biology-public','biology-work-order','tolerance-relapse','habit-reinforcement','prospective-goals','grief-control','relationship-history','social-attribution','personstate-fear','interpretation-attribution','lying-display','recollection-communication','control-reappraisal','agency-goal','agency-intake','commit-body-biography','reason-decision','audit-learn-epi','habit-relationship-long','workspace-skill-social','belief-affect','multisource-public','multisource-source']]
prior=[r for p in priorPaths for r in load(p)['rows']]
ids=[r['occurrenceId'] for r in prior+rows];assert len(ids)==len(set(ids))
O.mkdir(exist_ok=True)
save('review.json',dict(status='FOUR COMPARISON AND BOOKKEEPING ENTRIES RECONCILED; WHOLE LOG OPEN',checker=ref('scripts/review-history-chronology-multisource-comparison.py'),candidates=ref(cpath),resolvedSource=candidate['resolvedSource'],sections=ss,rows=rows,priorReviews=[ref(p) for p in priorPaths],limits=['No runtime tests or original writer rerun. Historical counts are not fresh execution.','No whole-log assignment or HQ011 closure. Original bytes and occurrence identities preserved.']))
save('findings.json',{'status': 'OWNED LIMITS PRESERVED', 'findings': [{'owner': 'RO-C3-020', 'distinction': 'Numerical preservation of labels does not preserve causal independence.', 'blockedClaim': 'Roleblind family sharing is a harmless representation repair.', 'reopen': 'A successor normalization must declare activeground/role/sign scope and recheck orphan controls.'}, {'owner': 'RO-C3-020', 'distinction': 'Equal probabilities can hide collective-overlap differences.', 'blockedClaim': 'Distribution equality proves receiver-law equivalence.', 'reopen': 'Compare raw effective contributions and bounded role totals as well as outcomes.'}, {'owner': 'RO-C3-020', 'distinction': 'Synthetic opaque support differs authenticated observer evidence.', 'blockedClaim': 'Changing basis IDs,units or frozen taskforecast supplies a common-fact public producer.', 'reopen': 'Require actual admitted source and independent operand controls.'}, {'owner': 'RO-C3-020', 'distinction': 'Registry structural coverage differs historical scientific completeness.', 'blockedClaim': 'Seed zero-unowned or ten bookkeeping fault checks satisfies final historical audit.', 'reopen': 'Reconcile canonical source occurrences and independently assess adequacy before exit.'}, {'owner': 'RO-C3-020', 'distinction': 'Build and focused-test receipts have distinct timing.', 'blockedClaim': 'The build validated the subsequently added weighted-overlap test.', 'reopen': 'Preserve exact validation order;new compilation claims require their own receipt.'}]})
save('check.json',dict(status='PASS SCOPED CHRONOLOGY ACCOUNTING; HQ011 OPEN',sections=len(ss),newOccurrences=len(rows),priorOccurrences=len(prior),cumulativeReviewed=len(ids),remainingOriginalOccurrences=len(candidate['rows'])-len(ids),review=ref(O/'review.json')))
assert all(p.stat().st_size<50_000_000 for p in O.iterdir())
print(json.dumps(load(O/'check.json')))
