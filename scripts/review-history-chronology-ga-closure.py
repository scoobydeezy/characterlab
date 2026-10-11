"""Bind six dated coverage entries to scoped qualification and successor evidence."""
from pathlib import Path
import json,hashlib
P=Path('docs/planning');O=P/'campaign3-history-chronology-ga-closure-rev1'
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
 (963, 1003, 'FROZEN PUBLIC GA BEFORE FINAL REGRESSION',evidence('GENERAL_ATTENTION_QUALIFICATION_2026_09_20.md','CORPUS_0_29_0_PROMOTION_REV1.json'),'Review1 rejected aliased recipes,uncommitted S0 and Windows source normalization. Review2 froze35models;review3 adds8footprint preserving35/247images.43models36cases7074traces;10exact reexecutions,2full-prefix restores plus5laterinstants each,not allprefix/alltail replay. Derived92invocations239outputs228slots supersedes local80;observedmax21 notbound.77active rollback plus6commitfaults internal hook notpublic input;2baseline templates replacement-only exclusions. Prior fullsuite8oldmodule failures plus1implicit-role fixture retained;54focused/reference328/build do not retroactively pass it.'),
 (1004, 1031, 'BOUNDED GA COMPLETE',evidence('GENERAL_ATTENTION_QUALIFICATION_2026_09_20.md','CORPUS_0_29_0_PROMOTION_REV1.json'),'Final stable-source2171/273pass,328/43reference,build/boundary and6postpromotion governance distinct receipts. Corpus0.28 reproduced then0.29 promoted ATTN1.1.0 requirements preserved and20members unchanged;actualruns retain0.28 identity,not rerun under0.29. Bounded qualification closesseven gates but laws unresolved. Independentstrength3/13 fixed sparse/dense while recall3/2to1;hybrid same strength butgraph92andscore57/40. Winner equality hides differences;flatretirednotrehabilitated. Protectionthreepolicies finalmemoryequal does not earn significance necessity.'),
 (1032, 1044, 'HONEST LEDGER CORRECTION',evidence('GENERAL_ATTENTION_QUALIFICATION_2026_09_20.md','CORPUS_0_29_0_PROMOTION_REV1.json'),'September14 claim threeverdicts recorded contradicted actualledger/handoff. Existing arithmetic/public receipts support SALIENCE/EMB/ATTN entries recordedSeptember20 with originalevidencedates;no backdatedledger or fabricated newrun. Thirteen actual namedentries includesGA. Correction is bookkeeping,not reopened law/allocation. Earlier false completion statement preserved as corrected-forward history.'),
 (1045, 1094, 'POSTCLOSURE STATE INDEX',evidence('GENERAL_ATTENTION_QUALIFICATION_2026_09_20.md','CORPUS_0_29_0_PROMOTION_REV1.json'),'67templates bind706,129missingdeclaration controls,77event rollback;missingglyph/position publicexcluded with componentcontrols. Dense addsnonfocalParticipants,notIncidental;K2priority/equal sourceordering samewinners andbudgetfloors1/5/1 equality bounded. Recallselected episode5/6versus1/3 without,unselectednotreinforced;disableddecay83/60tie canonical. Actual16experience attribution targetsonechild,allpoliciesretainonesignificant;14used+2fresh age versus16used protection no necessity. Knownzero/unavailable/disabled equalmultipliers retainmeaning;TaskConcern transientedge notgeneralAffect/A/B/Clawselection. Broad modalities,segmentation,horizon andothercorpuscoverage remain open.'),
]
common=evidence('MOTIVE_AUDIT_VALIDATION_FINDING_REV1.json','CAMPAIGN3_EXIT_RECONCILIATION_READINESS.md')
ss=[dict(startLine=a,endLine=b,role=k,disposition=n,acceptanceChain=e+common,obligations=['RO-C3-019','RO-C3-020','RO-C3-021']) for a,b,k,e,n in sections]
cpath=P/'campaign3-history-chronology-candidates-rev1/occurrences.json';candidate=load(cpath);rows=[]
for item in candidate['rows']:
    u=item['original'];s=[x for x in ss if x['startLine']<=u['location']['startLine']<=x['endLine']]
    if not s:continue
    assert len(s)==1 and u['location']['endLine']<=s[0]['endLine']
    rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],sectionStartLine=s[0]['startLine'],disposition='DATED CLAIM/ROUTING; bound section specifies scoped acceptance and supersession'))
priorPaths=[P/f'campaign3-history-chronology-{n}-rev1/review.json' for n in ['tail','integration','cognition','coverage','development-audits','development-workers','development-scope','defining-public','defining-owners','embarrassment-bridge','intoxication-reappraisal','disposition-sleep','belief-wrapper-recovery','identity-admission-belief','eligibility-capability','biology-public','biology-work-order','tolerance-relapse','habit-reinforcement','prospective-goals','grief-control','relationship-history','social-attribution','personstate-fear','interpretation-attribution','lying-display','recollection-communication','control-reappraisal','agency-goal','agency-intake','commit-body-biography','reason-decision','audit-learn-epi','habit-relationship-long','workspace-skill-social','belief-affect','multisource-public','multisource-source','multisource-comparison']]
prior=[r for p in priorPaths for r in load(p)['rows']]
ids=[r['occurrenceId'] for r in prior+rows];assert len(ids)==len(set(ids))
O.mkdir(exist_ok=True)
save('review.json',dict(status='FOUR GA CLOSURE ENTRIES RECONCILED; WHOLE LOG OPEN',checker=ref('scripts/review-history-chronology-ga-closure.py'),candidates=ref(cpath),resolvedSource=candidate['resolvedSource'],sections=ss,rows=rows,priorReviews=[ref(p) for p in priorPaths],limits=['No runtime tests or original writer rerun. Historical counts are not fresh execution.','No whole-log assignment or HQ011 closure. Original bytes and occurrence identities preserved.']))
save('findings.json',{'status': 'OWNED LIMITS PRESERVED', 'findings': [{'owner': 'RO-C3-020', 'distinction': 'Derived work bound differs observed work and public replay scope is finite.', 'blockedClaim': 'Observed21 replaces bound92 or two restores qualify everyprefix and fulltails.', 'reopen': 'New horizons/events require ownership budgets and declared replay coverage.'}, {'owner': 'RO-C3-020', 'distinction': 'Internal rollback injection differs public ingress.', 'blockedClaim': '77 rollback witnesses are public fault inputs or replacement-only templates are active.', 'reopen': 'Public admission claims must inspect actual event inventory and hook scope.'}, {'owner': 'RO-C3-020', 'distinction': 'Encoding,association,recallscore and winner membership differ.', 'blockedClaim': 'Stable encoding or equal winners proves footprint immunity or reduction.', 'reopen': 'New retrieval sources must compare intermediate state and scores.'}, {'owner': 'RO-C3-020', 'distinction': 'Retention policies agree on this finite significant-child source.', 'blockedClaim': 'Significance-first necessity has been proven over use-only/shared protection.', 'reopen': 'Discriminating credit and retention fixtures required before selecting protection law.'}, {'owner': 'RO-C3-020', 'distinction': 'Promotion and ledger correction preserve original temporal identity.', 'blockedClaim': 'Runs executed against0.29 or absent September14 entries were historically written then.', 'reopen': 'Use original execution commitments and explicit correction dates.'}, {'owner': 'RO-C3-020', 'distinction': 'Rejected images and failed regression retain their status.', 'blockedClaim': 'Corrected freeze or later stable-suite PASS rehabilitates failed original receipts.', 'reopen': 'Preserve exact failed images,fixture correction and successful successor identity.'}]})
save('check.json',dict(status='PASS SCOPED CHRONOLOGY ACCOUNTING; HQ011 OPEN',sections=len(ss),newOccurrences=len(rows),priorOccurrences=len(prior),cumulativeReviewed=len(ids),remainingOriginalOccurrences=len(candidate['rows'])-len(ids),review=ref(O/'review.json')))
assert all(p.stat().st_size<50_000_000 for p in O.iterdir())
print(json.dumps(load(O/'check.json')))
