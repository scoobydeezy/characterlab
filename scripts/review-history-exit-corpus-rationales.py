from pathlib import Path
import collections, hashlib, json

P = Path('docs/planning')
O = P / 'campaign3-history-exit-corpus-rationales-rev1'
O.mkdir(exist_ok=True)
def load(p): return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def digest(b): return hashlib.sha256(b).hexdigest()
def ref(p): return dict(path=Path(p).as_posix(), sha256=digest(Path(p).read_bytes()))
def save(name, value):
    p = O / name
    if p.exists(): assert load(p) == value
    else: p.write_text(json.dumps(value, ensure_ascii=False, indent=2)+'\n', encoding='utf-8', newline='\n')

# These are judgments about the exact cited experiment, not current whole-domain status.
judgments = {
'ADAPT': 'Retain accepted prior scope and public/component separation. The inherited intervention-identity field explicitly says frozen for review, not passed; ACCEPTED PRIOR SCOPE must not convert it into a behavioral pass. Campaign2 completion support remains unassigned and requires review.',
'DET': 'Retain registered replay/address scope; later prefix restores do not establish a new aggregate or externally coupled experiment. Campaign2 persistence support remains unassigned and requires review.',
'SEM': 'Finite three-observer qualification supports the historical gate only; recognition generality and ontology are not established.',
'LEARN': 'The four-case public lower-bound realization supersedes the earlier missing exact witness. Mean-relative gating is not universal duplicate-source rejection; accepted bounds use point-like precision. Upper bounds, decay and established-prior precision remain open.',
'EPI': 'The exact 19/20 pair through the named consumers supersedes the missing horizon witness. Latest encoding and a finite roster are not all cognition; deliberate leak profiles remain violations, not lawful alternatives.',
'REASON': 'Joined role/sign/key/rescue cases supersede the earlier unjoined receipt. Symbolic task/panel mapping and calibrated standing do not establish recognition or general identity learning. Preserve nonselected aggregation candidates.',
'DECISION': 'The explicit comparator matrix supersedes the missing joined experiment. The opaque comparator matches a balanced marginal only; reason-mass significance is not general memory or identity. Preserve the failed save cohort and diagnostic/character boundary.',
'BIO': 'The early-only coupling, fixed third-seed and sustained contrary authorship cases supersede the earlier gap. Refold retains full history; equality is not compression. Research RNG coupling is not new public admission or a typicality claim.',
'COMMIT': 'Fixed earned standing across live, absent, retired and new-instance probes supersedes the missing joined witness. Truthful controlled communication and finite cancellation are not language, trust or a general lifecycle law.',
'BODY': 'The matched ownership comparison supersedes the missing comparison. Scheduled cache/meter equality does not eliminate body ownership or establish general Need; public sources and component comparison retain different scopes.',
'MEM': 'Finite recency, decay, reinforcement and rank/tie witnesses preserve acquisition, retention and selection distinctions. They do not establish reconstruction or long-horizon compression; later defining-memory results cannot retroactively broaden this receipt.',
'ATTN': 'Keep declared visual/body/panel footprint and cue limits. Candidate law and source constraints remain attached to this experiment even where later work adds separate coverage.',
'BELIEF': 'Retain truth/evidence/belief/appraisal and absent/negative/neutral distinctions. Evidence weight is diagnostic, not calibrated correctness; false-display and goal-only interventions support only the stated operands.',
'AFFECT': 'Independent factors and competing responses establish bounded appraisal contrasts. Neither unique affect dimensionality nor general feedback/regulation follows; later reappraisal work has its own receipts.',
'WORK': 'Overloaded cards and maintained access establish finite selection/control scope. The distractor supplement fixes other priorities; it is not an unrestricted priority competition result.',
'SKILL': 'Separate actual competence, performance belief and impairment. The adopted exercise and Auto choice do not establish confidence-sensitive planning.',
'SOCIAL': 'Two observers and controlled statements establish evidence-relative observer behavior. Fixed target commitment does not demonstrate language generation or general mentalizing.',
'MULTI': 'Shared/independent and collective grounds qualify named receiving laws. Role-aware normalization and arbitrary renaming are not established by these original runs; later reason work is separate.',
'HABIT': 'Neutral-opponent availability persistence is not resistance to strong reasons or addiction. Later resistance and biological studies add evidence without changing this original experiment scope.',
'REL': 'Own history and current estimate remain separate. Controlled rupture/contact/absence do not turn correction of a claim into relationship repair or attribution correction.',
'LONG': 'Acquired biography, skill and relationship coexist with actual episode loss. Fixed-fold equality is not general compression; diagnostic actual competence remains unavailable as character knowledge.'
}
transitions = {'LEARN':3, 'EPI':4, 'REASON':5, 'DECISION':6, 'COMMIT':7, 'BODY':8, 'BIO':9}
index_path = P/'campaign3-history-source-roles-rev171/index.json'
index = load(index_path)
roles = {r['path']:r for r in index['roleAssignments']}
rows=[]; snapshots=[]; texts={}; contexts=collections.defaultdict(list)
source_texts=collections.defaultdict(set); member_versions=collections.defaultdict(list)
tracked='Preservation/reopening constraint; never counted as a behavioral pass.'
for rev in range(1,112):
    path=P/f'CAMPAIGN3_EXIT_AUDIT_REV{rev}.json'; v=load(path)
    snapshots.append(dict(revision=rev, source=ref(path)))
    assert len(v['corpus']['members'])==21
    count=0
    for i,m in enumerate(v['corpus']['members']):
        name=m['id'].split('-')[1]; assert name in judgments
        source_texts[name].add(digest(m['sourceText'].encode()))
        member_versions[name].append((rev,m['rationale'],m['status']))
        entries=[(f'/corpus/members/{i}/rationale',m['rationale'],m['status'],'MEMBER')]
        for j,c in enumerate(m['clauses']):
            if c['status']=='TRACKED':
                assert c['label'] in ['Applicable seams','Reopen conditions'] and c['rationale']==tracked
                count+=1
            else: assert c['rationale']==m['rationale'] and c['status']==m['status']
            entries.append((f'/corpus/members/{i}/clauses/{j}/rationale',c['rationale'],c['status'],c['label']))
        for pointer,text,status,label in entries:
            key=digest(text.encode()); texts[key]=text
            rows.append(dict(revision=rev,pointer=pointer,member=m['id'],rationaleId=key,status=status,label=label))
            contexts[key].append(name)
    assert count==42
assert len(rows)==26640 and len(texts)==29 and all(len(x)==1 for x in source_texts.values())
member_review=[]; support_gaps=set()
last=load(P/'CAMPAIGN3_EXIT_AUDIT_REV111.json')
for m in last['corpus']['members']:
    name=m['id'].split('-')[1]; versions=member_versions[name]; changes=[]
    for i,x in enumerate(versions):
        if i==0 or x[1:]!=versions[i-1][1:]:
            changes.append(dict(firstRevision=x[0],rationaleId=digest(x[1].encode()),status=x[2]))
    assert len(changes)==(2 if name in transitions else 1)
    if name in transitions:
        assert changes[1]['firstRevision']==transitions[name] and changes[1]['status']=='QUALIFIED BOUNDED'
    supports=[]
    for path in sorted({p for c in m['clauses'] for p in c['evidence']}):
        role=roles.get(path)
        if role:
            for r in role['evidence']: assert ref(r['path'])==r
            supports.append(dict(path=path, frozenSourceSha256=role['sha256'], sourceRole=role['category'], reviews=role['evidence']))
        else:
            assert path in index['unassignedCandidatePaths']
            support_gaps.add(path);supports.append(dict(path=path,status='SOURCE ADEQUACY REVIEW OWED'))
    member_review.append(dict(member=m['id'],judgment=judgments[name],versions=changes,supports=supports,unchangedSourceTextSha256=next(iter(source_texts[name]))))
assert support_gaps=={'docs/planning/CAMPAIGN2_COMPLETION_REVIEW.md','docs/planning/CAMPAIGN2_COGNITIVE_PERSISTENCE_QUALIFICATION.md'}
queue_path=P/'campaign3-history-exit-audit-chain-rev1/rationale-review-queue.json';queue=load(queue_path)
covered=[r for r in queue['rows'] if digest(r['text'].encode()) in texts]
assert len(covered)==28 and sum(len(r['occurrences']) for r in covered)==2331
save('occurrences.json',dict(scope='Corpus member and corpus clause rationale fields only',snapshots=snapshots,texts=texts,rows=rows))
review=dict(status='CORPUS RATIONALE SEMANTIC REVIEW; WHOLE AUDIT SOURCE ACCEPTANCE PENDING',checker=ref(__file__),sourceIndex=ref(index_path),priorQueue=ref(queue_path),occurrences=ref(O/'occurrences.json'),members=member_review,trackedDisposition='All 4662 TRACKED clause occurrences name Applicable seams or Reopen conditions. Preserve as constraints, never behavioral passes.',additionalFinding='ADAPT intervention identity label explicitly says frozen for review, not passed. Generic ACCEPTED PRIOR SCOPE is not proof of that obligation. Review inherited Campaign2 support before final corpus adequacy.',supportGaps=sorted(support_gaps),coverage=dict(snapshots=111,members=21,memberOccurrences=2331,clauseOccurrences=24309,totalOccurrences=26640,uniqueRationales=29,originalQueueTextsReviewed=28,originalQueueTextsPending=153,newTrackedText=1,sourceRolesPromoted=0),limits=['Seven early missing-witness rationales are historical and superseded only at the exact bounded qualification revisions, not disproved or deleted.','Constant rationale text retains original experiment scope; it does not assert all later domain work remains absent.','Repeated sourceText hashes establish identity only. Full sourceText, other schema prose, family/Brief rationales and shared Markdown review remain pending.','No new behavioral verdict, runtime test, build, corpus freshness or whole-source acceptance. Existing scoped review receipts are reused, not rerun.','SourceREV171 remains unchanged; independent adequacy, historical source identity and legacy-log gaps remain open. HQ012 has not started.'],obligations=['RO-C3-019','RO-C3-020','RO-C3-021'])
save('review.json',review)
check=dict(status='PASS; SCOPED RATIONALE ACCOUNTING ONLY',review=ref(O/'review.json'),occurrences=ref(O/'occurrences.json'),checker=ref(__file__),coverage=review['coverage'],unchangedSnapshotHashes=True)
assert all(ref(s['source']['path'])==s['source'] for s in snapshots)
save('check.json',check)
assert all(p.stat().st_size<50000000 for p in O.iterdir())
print(json.dumps(check))
