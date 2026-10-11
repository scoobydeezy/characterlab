"""Review recovered narrative differences and bind exact historical code bodies."""
from pathlib import Path
from functools import cache
import json,hashlib,difflib
P=Path('docs/planning');O=P/'campaign3-history-recovered-content-rev1';I=P/'campaign3-history-source-roles-rev315'
def digest(b):return hashlib.sha256(b).hexdigest()
@cache
def sha(p):return digest(Path(p).read_bytes())
def ref(p):return dict(path=Path(p).as_posix(),sha256=sha(p))
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def save(p,v):
    if p.exists():assert load(p)==v,p
    else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
prior=P/'campaign3-history-source-roles-rev314/index.json';ix=load(prior)
recovery=P/'campaign3-history-git-object-recovery-rev1/review.json';r=load(recovery)
inventory=P/'campaign3-history-gap-census-recovery-rev2/inventory.json';orig={x['id']:x for x in load(inventory)['occurrences']}
roles={x['path']:x for x in ix['roleAssignments']};rows=[];variants=[]
judgments={
'docs/planning/CAMPAIGN3_BODY_RESEARCH_FRONTIER.md':'All recovered lines are retained in the reviewed body frontier. Later insertions document superseding qualification and obligation preservation. The older first-seam ordering does not override later execution; physical kinetics, experienced signal, Need/motive and attention questions remain distinct.',
'docs/planning/CAMPAIGN3_CORPUS_INTAKE_DRAFT.md':'Only proposal/membership and execution status changed. Eleven proposed obligations were outside corpus0.27 then; later promotion and partial execution are independently scoped. The reviewed successor erroneous ten-of-eleven summary remains corrected to all eleven, three partial/eight blocked at promotion. Requirement bodies are unchanged; no proposal was a passing experiment.',
'docs/planning/CAMPAIGN3_ENTRY_READINESS.md':'Changes are dated audit/routing statuses: September10 unexecuted intake precedes partial EMB/ATTN; later REV1/3/4/5/6/8 counts and next LEARN/EPI/REASON/DECISION/COMMIT/BIO steps precede reviewed successors. Corpus members, bounded qualification, accepted prior scope and whole-family readiness remain distinct. Matched historical body is unchanged; later notices do not retroactively apply to the old date. No owner decision is created by dated next-task language.',
'docs/planning/CURRENT.md':'This September10 index routes to historical authorities, BODY/motive receiving and attention investigation. It does not accept all referenced contents. Eleven proposals outside0.27 and unresolved ATTN/EMB are dated states, subsequently superseded only by their bounded gates. Its explicit authority hierarchy, missing-coverage restriction and implementation-versus-reduction distinction remain valid. BIO identity is not renamed. No new scientific result or whole-campaign acceptance is asserted.'}
for g in r['groups']:
    if not g['matches']:continue
    t=g['target'];s=g['matches'][0]['exactBytes'];data=Path(s['path']).read_bytes()
    assert digest(data)==s['sha256']==t['sha256']
    assert any(m['variant']=='raw' and hashlib.sha1(b'blob '+str(len(data)).encode()+b'\0'+data).hexdigest()==m['objectId'] for m in g['matches'])
    contexts=[]
    for oid in g['occurrences']:
        original=orig[oid];assert original['target']==t
        report=original['report'];assert sha(report['path'])==report['sha256']
        review=Path(report['path']).parent/'review.json';assert review.exists()
        contexts.append(dict(occurrenceId=oid,originalReport=report,pointer=original['pointer'],review=ref(review)))
    record=dict(target=t,recovered=s,originalContexts=contexts,obligations=['RO-C3-019','RO-C3-020','RO-C3-021'])
    if t['path'].endswith('.md'):
        assert t['path'] in judgments
        root=P/'campaign3-history-universe-rev1/sources'/t['path'];assert sha(root)==roles[t['path']]['sha256']
        a=data.decode('utf-8-sig').splitlines();b=root.read_text(encoding='utf-8-sig').splitlines()
        ops=difflib.SequenceMatcher(None,a,b,autojunk=False).get_opcodes();covered=[]
        for tag,i,j,k,l in ops:
            covered.extend(range(i,j))
            if tag=='equal':assert a[i:j]==b[k:l]
            rows.append(dict(recovered=s,operation=tag,recoveredRange=[i+1,j],reviewedRange=[k+1,l],recoveredText='\n'.join(a[i:j]),reviewedText='\n'.join(b[k:l]),disposition='Exact matched text retains the bound reviewed source role.' if tag=='equal' else judgments[t['path']]))
        assert covered==list(range(len(a)))
        record.update(role='RECOVERED HISTORICAL NARRATIVE VARIANT',disposition=judgments[t['path']],reviewedRoot=ref(root),rootRoleEvidence=roles[t['path']].get('evidence',[]),scope='Complete recovered text accounted by exact line comparison and content-specific dated-status disposition. No independent experimental weight; not a replacement of original census bytes.')
    else:
        assert t['path'].endswith('.ts')
        record.update(role='RECOVERED EXACT HISTORICAL SOURCE BODY',disposition='Exact original source identity now available for the bound historical receipts. Their already reviewed descriptions, failures and limits stand. No source-exact rerun or historical execution authenticity is inferred from recovery.',scope='Code body is backing evidence for the cited receipt source commitment, not a new verdict or separately qualified implementation. Other missing members of the same source manifest remain missing.')
    variants.append(record)
assert len(variants)==21 and sum(v['target']['path'].endswith('.md') for v in variants)==10
O.mkdir(exist_ok=True)
save(O/'review.json',dict(status='RECOVERED CONTENT AND BACKING ROLES REVIEWED; ADEQUACY OPEN',checker=ref(__file__),recovery=ref(recovery),gapInventory=ref(inventory),priorIndex=ref(prior),variants=variants,narrativeComparisons=rows,obligations=['RO-C3-019','RO-C3-020','RO-C3-021'],limits=['No omitted recovered Markdown lines; normalized line comparison is declared, exact raw source hashes retained. No recovered-only scientific finding requires a new law or obligation.','Historical source-body recovery does not rerun original tests, independently verify execution or close other source gaps.','208 path/hash targets and separate no-hash provenance issues remain; seven of80 exit-inventory gaps recovered leaves73.','No census denominator, source assignment, verdict, allocation, corpus, runtime or law changes. Independent universe and scientific adequacy remain open.']))
ix['version']='campaign3-history-source-roles/0.315';ix['predecessor']=ref(prior)
for v in variants:
    assert not any(a['path']==v['recovered']['path'] for a in ix['explicitBackingOutsideProseManifest'])
    ix['explicitBackingOutsideProseManifest'].append(dict(**v['recovered'],role=v['role'],scope=v['scope'],evidence=ref(O/'review.json')))
ix['reviewedInputs'].append(ref(O/'review.json'))
ix['rules'].append('REV315 adds21 exact recovered backing identities:10 historical narrative variants compared in full with reviewed roots and11 source bodies tied to original receipt commitments. No original source-role or occurrence count changes. Dated routing changes are not new experiments; byte recovery is not execution authentication.208 target pairs and independent adequacy remain open.')
old=load(prior);assert ix['roleAssignments']==old['roleAssignments']
assert ix['explicitBackingOutsideProseManifest'][:-21]==old['explicitBackingOutsideProseManifest']
I.mkdir(exist_ok=True);save(I/'index.json',ix)
save(I/'check.json',dict(status=ix['status'],index=ref(I/'index.json'),assignedSources=11373,unassignedSources=0,originalNarrativeOccurrences=201195,originalBackingOccurrences=212699,outsideBackingResources=len(ix['explicitBackingOutsideProseManifest']),addedRecoveredResources=21,priorAssignmentsUnchanged=True))
save(O/'check.json',dict(status='PASS COMPLETE RECOVERED NARRATIVE/BACKING ACCOUNTING',narrativeSources=10,codeSources=11,comparisonSegments=len(rows),originalGapOccurrences=sum(len(v['originalContexts']) for v in variants),remainingTargetPairs=208,remainingExitInventoryPairs=73,review=ref(O/'review.json'),sourceIndex=ref(I/'index.json')))
print(json.dumps(load(O/'check.json')))
