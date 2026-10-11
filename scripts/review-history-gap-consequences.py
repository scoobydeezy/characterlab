"""Preserve dependent-claim limits and derive missing-source subsets by exact identity."""
from pathlib import Path
from functools import cache
import json,hashlib,collections
P=Path('docs/planning');O=P/'campaign3-history-gap-consequences-rev1'
@cache
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def ref(p):return dict(path=Path(p).as_posix(),sha256=sha(p))
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def save(p,v):
    if p.exists():assert load(p)==v,p
    else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
ip=P/'campaign3-history-gap-census-recovery-rev2/inventory.json';inventory=load(ip);occ={x['id']:x for x in inventory['occurrences']}
gp=P/'campaign3-history-git-object-recovery-rev1/review.json';recovery=load(gp)
ep=P/'campaign3-history-exit-consolidation-rev2/unresolved-identities.json';exitrows=load(ep)['rows']
exitpairs={(x['path'],x['sha256']) for x in exitrows};assert len(exitpairs)==80
found={(g['target']['path'],g['target']['sha256']) for g in recovery['groups'] if g['matches']}
recovered_exit=exitpairs&found;assert len(recovered_exit)==6
groups=[g for g in recovery['groups'] if not g['matches']];assert len(groups)==208
metadata={'docs/planning/campaign2-probe-model/REVIEW_MANIFEST.json','docs/planning/campaign2-probe-successor-model/REVIEW_MANIFEST.json'}
other={'docs/formal/GENERAL_ATTENTION_CODEC_COMPONENT.md','docs/planning/CURRENT.md','docs/planning/CAMPAIGN3_ENTRY_READINESS.md','docs/planning/CAMPAIGN3_PRE_ENTRY_REVIEW_DISPOSITION.md','docs/planning/CAMPAIGN3_CORPUS_INTAKE_DRAFT.md'}
policies={
'EXIT_NARRATIVE':dict(owner='RO-C3-021',supported='The exact dated audit inventory and its claim-record dispositions are retained. Later reviewed roots support only their own text and accepted scope.',blockedClaim='Complete reconstruction of this earlier ledger/readiness version, absence of lost or retracted findings, or acceptance of its unseen contents merely from its hash.',completion='Recover and reconcile the body, or independently establish a claim-specific supersession/exclusion with sufficient material-finding coverage. This report does not assert that exclusion is earned.'),
'OTHER_NARRATIVE':dict(owner='RO-C3-021',supported='Bound original discovery/codec receipts remain dated evidence; later root reviews are independently scoped.',blockedClaim='Attribution of exact earlier plan/contract content or proof that its omitted findings are immaterial from later status alone.',completion='Recover the exact text or establish specific accepted authority/content coverage for the dependent claim; do not substitute the current file.'),
'PROBE_METADATA':dict(owner='RO-C3-020',supported='Fourteen canonical/readable pairs, model identities and explicit packet deltas are independently checked by the probe-packet review.',blockedClaim='Byte-identical historical pre-freeze manifest, historical timestamp or original metadata attestation. Model byte equality does not authenticate missing review metadata.',completion='Recover exact manifest bytes or keep this historical-metadata claim excluded while independently retaining model-byte evidence.'),
'SOURCE_TEST':dict(owner='RO-C3-021',supported='Exact stored test/mutation/qualification reports and original source commitments remain preserved with content-specific receipt reviews.',blockedClaim='Source-exact reproduction or build attribution for this missing version, rewriting a rejected source cohort, or using later passing code as the original source. A recorded PASS remains a dated report, not reconstructed execution.',completion='Recover exact source or independently assess and restrict each dependent qualification claim using its surviving direct evidence. Other recovered members of the same manifest do not close this gap.'),
'WRITER':dict(owner='RO-C3-021',supported='Original generated receipts and their reviewed output fields retain their bounded evidentiary value.',blockedClaim='Reproduction of the original proof/declaration writer, equivalence of changed current evaluator code, or reconstruction of historical execution from matching rows alone.',completion='Recover original writer or independently establish the surviving-output claim without asserting source-exact reproduction; preserve any unresolved methodological limitation.')}
rows=[]
for g in groups:
    t=g['target'];pair=(t['path'],t['sha256']);path=t['path']
    if pair in exitpairs:category='EXIT_NARRATIVE'
    elif path in metadata:category='PROBE_METADATA'
    elif path in other:category='OTHER_NARRATIVE'
    elif path.startswith('src/'):category='SOURCE_TEST'
    elif path.startswith('scripts/'):category='WRITER'
    else:raise AssertionError(t)
    contexts=[]
    for oid in g['occurrences']:
        x=occ[oid];assert x['target']==t
        assert sha(x['report']['path'])==x['report']['sha256']
        original=load(x['report']['path'])
        for part in x['pointer'].split('/')[1:]:original=original[int(part)] if isinstance(original,list) else original[part.replace('~1','/').replace('~0','~')]
        assert original==x['originalEntry']
        review=Path(x['report']['path']).parent/'review.json';assert review.exists()
        contexts.append(dict(occurrenceId=oid,originalReport=x['report'],pointer=x['pointer'],originalEntry=x['originalEntry'],contentReview=ref(review)))
    rows.append(dict(target=t,category=category,originalContexts=contexts,disposition=policies[category]))
counts=dict(collections.Counter(r['category'] for r in rows));assert counts==dict(EXIT_NARRATIVE=74,OTHER_NARRATIVE=5,PROBE_METADATA=2,SOURCE_TEST=124,WRITER=3)
hp=P/'campaign3-history-hq009-rev1/review.json';h=load(hp)
assert len(h['references'])==5
nohash=[]
for i,x in enumerate(h['references']):
    body=P/'campaign3-history-universe-rev1/sources'/x['source'];assert sha(body)==x['sourceSha256']
    if i<3:
        disposition='Unversioned inventory reference is located. Use only explicitly preserved comparison bytes as hypotheses; no historical equality or formula adoption is implied. No unsupported commit claim is attached to these three references.'
        blocked='Historical identity or production parity inferred from an unversioned link.'
    elif i==3:
        disposition='The literal snapshot pin is unsupported and must not serve as source authority. The preserved working-copy formula review independently supports scoped candidate mathematics; accepted CharacterLab contracts stand on their own adoption/evidence chains. This is a correct-forward provenance limit, not a guessed replacement pin or alteration of the old ledger.'
        blocked='Authentication of the formula inventory at the named commit, or inherited source/production parity for any adopted formula.'
    else:
        disposition='The legacy log remains unlocated after documented repository searches. Superseded implementation-plan routing does not establish that all of its referenced log findings were superseded or preserved elsewhere. reference/RESEARCH.md is not substituted.'
        blocked='Zero unaccounted material findings across this missing historical companion log without recovery or independently evidenced material-finding supersession.'
    nohash.append(dict(originalReference=x,originalPointer=f'/references/{i}',source=ref(hp),disposition=disposition,blockedClaim=blocked,owner='RO-C3-021',completion=x['reopen']))
O.mkdir(exist_ok=True)
save(O/'review.json',dict(status='CLAIM CONSEQUENCES ACCOUNTED; SOURCE ADEQUACY NOT YET DEMONSTRATED',checker=ref(__file__),inputs=[ref(ip),ref(gp),ref(ep),ref(hp),ref(P/'campaign3-history-sister-object-recovery-rev1/review.json'),ref(P/'campaign3-history-temporary-object-recovery-rev1/review.json')],groups=rows,noHashReferences=nohash,subsetCorrection=dict(priorClaims=[ref(P/'CAMPAIGN3_HISTORY_GIT_OBJECT_RECOVERY_CHECKPOINT.md'),ref(P/'CAMPAIGN3_HISTORY_RECOVERED_CONTENT_CHECKPOINT.md'),ref(P/'campaign3-history-recovered-content-rev1/check.json')],incorrectRemainingExitPairs=73,correctRemainingExitPairs=74,recoveredExitPairs=[dict(path=p,sha256=h) for p,h in sorted(recovered_exit)],additionalReadinessRecoveryOutsideExitInventory=dict(path='docs/planning/CAMPAIGN3_ENTRY_READINESS.md',sha256='5c38f7ce9eebe43b4e98462053c71361ec02b057054aa22f67d37e29043eb3a0'),reason='Seven readiness versions recovered overall, but only six belong to the exact80-pair exit-inventory set. The seventh belongs to the earlier discovery audit. Overall21 recoveries/208 remaining and all source hashes are unchanged.'),limits=['These are restrictions on dependent claims, not blanket exclusion or closure of208 missing bodies.','Categories use explicit original identity/context sets; a filename, hash or PASS marker never accepts missing contents.','Five no-hash references and the source-manifest omission are separate from208 known-hash targets; this report does not conflate those denominators.','Next independent adequacy must decide whether surviving accepted evidence suffices for each claimed historical scope; absent legacy-log content cannot be declared reconciled by bookkeeping.','No original source, rejected cohort, runtime, verdict, law, allocation or corpus changed.'],obligations=['RO-C3-019','RO-C3-020','RO-C3-021']))
save(O/'check.json',dict(status='PASS EXACT GAP CONSEQUENCE ACCOUNTING; ADEQUACY OPEN',targetPairs=len(rows),byCategory=counts,originalGapOccurrences=sum(len(r['originalContexts']) for r in rows),noHashReferences=5,recoveredExitPairs=6,remainingExitPairs=74,review=ref(O/'review.json')))
print(json.dumps(load(O/'check.json')))
