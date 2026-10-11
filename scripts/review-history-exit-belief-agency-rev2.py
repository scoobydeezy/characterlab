from pathlib import Path
import hashlib,json,collections
P=Path('docs/planning');O=P/'campaign3-history-exit-belief-agency-rev1';O.mkdir(exist_ok=True)
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def save(name,v):
 p=O/name
 if p.exists():assert load(p)==v
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
queuePath=P/'campaign3-history-exit-audit-chain-rev1/rationale-review-queue.json';q=load(queuePath)
judgments={
3:'Initial joined agency qualification; later nonrecipient leakage and phase-admission defects supersede this cohort. Do not cite the initial result without the two corrections.',
4:'First correction preserves the original leakage finding but still lacks exact intent-phase admission; successor0.3 supersedes it.',
5:'Corrected0.3 preserves both rejected cohorts. General efficacy, blame and coercion remain outside scope. The missing cross-episode expectation assertion is superseded only by BRIEF-12.14-5 at REV98, not by episode-local agency.',
7:'Original BELIEF/AFFECT operands do not establish scalar censored inference or general cause correction. LEARN and INFER add distinct later evidence.',
8:'REV3 adds only the qualified lower-bound LEARN domain. General inference and attribution correction are not established by that promotion.',
9:'INFER corrects an observer-local reported proposition without rewriting expression; mistaken corrections preserve the epistemic boundary. General cause discovery remains unqualified. REV97 separately supplies a closed two-cause diagnostic experiment.',
10:'The REV88 family summary remains historically scoped. Its explicit uncertainty/hidden-cause partial statements are superseded for the precise clauses at REV93/97. They must not negate later bounded coverage or imply general fusion/diagnosis is solved.',
64:'A disable flag and competence failure do not establish actual external intervention with selective witnessing. The later joined agency experiment supplies that missing bounded behavior.',
105:'Repeated prediction discrepancies are researcher diagnostics of existing learning, not a new surprise state. MeanHistory updates precede subsequent choice; withheld receipts and all eight seeds preserve causality and equal outcomes. No general reinforcement law or native admission.',
106:'Evidence weight or precision alone is insufficient for uncertainty plus accuracy. This valid gap is superseded by the explicitly predeclared interval/accuracy experiment at REV93.',
107:'Correcting obstruction testimony is not identifying an alternative latent cause. This gap is superseded by the controlled competing-diagnostics experiment at REV97, not by relabeling censored potential.',
113:'Repeated testimony for one episode is not learning a shared route expectation. REV98 supplies distinct observed attempts, separate native/component replay surfaces and a later appraisal successor.',
123:'Nonzero retained interval radius and externally evaluated accuracy support bounded uncertainty, with wrong/point/unknown controls. Intervals are compatible sets, not probability or calibrated confidence. No truth read enters cognition.',
127:'Motion/resistance evidence distinguishes an authored closed pair of causes; failure alone remains ambiguous. Equal priors, diagnostic ratios, latest-per-channel and fixed attempt limit interpretation. Goal affects appraisal, not inferred evidence or earlier judgment.',
128:'Distinct observed attempts support a route expectation while repeated testimony does not create extra episodes. Later correction/appraisal is supported by the post-report successor. Preserve denied-pair and timing findings. This is separate native-source/component composition, not a combined native runtime or expectation-driven action.'
}
ixPath=P/'campaign3-history-source-roles-rev171/index.json';ix=load(ixPath);roles={x['path']:x for x in ix['roleAssignments']}
rows=[];sourceRefs=[];changes=[];previous={};supports=set();texts={}
for rev in range(1,112):
 path=P/f'CAMPAIGN3_EXIT_AUDIT_REV{rev}.json';v=load(path);sourceRefs.append(ref(path))
 for fi in [3,13]:
  f=v['brief']['families'][fi];assert f['status']=='PARTIAL'
  entries=[('FAMILY-'+f['family'],f['rationale'],f['status'],f'/brief/families/{fi}/rationale')]
  for j,c in enumerate(f['clauses']):
   entries.append((c['id'],c['rationale'],c['status'],f'/brief/families/{fi}/clauses/{j}/rationale'));supports.update(c['evidence'])
  for key,text,status,pointer in entries:
   qi=next(i for i,x in enumerate(q['rows']) if x['text']==text);assert qi in judgments
   texts[qi]=text;rows.append(dict(revision=rev,pointer=pointer,subject=key,status=status,queueIndex=qi))
   if previous.get(key)!=(text,status):
    changes.append(dict(revision=rev,subject=key,status=status,queueIndex=qi));previous[key]=(text,status)
assert len(rows)==2109 and set(texts)==set(judgments)
for i in judgments:
 expected={(x['source'],x['pointer']) for x in q['rows'][i]['occurrences']}
 actual={(sourceRefs[x['revision']-1]['path'],x['pointer']) for x in rows if x['queueIndex']==i}
 assert expected==actual
supportRows=[];gaps=[]
for path in sorted(supports):
 role=roles.get(path)
 if role:
  for evidence in role['evidence']:assert ref(evidence['path'])==evidence
  supportRows.append(dict(path=path,frozenSha256=role['sha256'],role=role['category'],reviews=role['evidence']))
 else:
  assert path in ix['unassignedCandidatePaths'];gaps.append(path)
assert gaps==['docs/planning/CAMPAIGN2_COGNITIVE_QUALIFICATION.md','docs/planning/CAMPAIGN3_IDENTITY_AGENCY_PARTIAL_COVERAGE_AUDIT.md','docs/planning/IDENTITY_AGENCY_PARTIAL_COVERAGE_CHECK_REV1.json']
assert [x['revision'] for x in changes if x['subject']=='BRIEF-12.4-1' and x['status']=='QUALIFIED BOUNDED']==[93]
assert [x['revision'] for x in changes if x['subject']=='BRIEF-12.4-4' and x['status']=='QUALIFIED BOUNDED']==[97]
assert [x['revision'] for x in changes if x['subject']=='BRIEF-12.14-5' and x['status']=='QUALIFIED BOUNDED']==[98]
save('occurrences.json',dict(sources=sourceRefs,rows=rows,changes=changes))
save('review.json',dict(status='TWO FAMILY RATIONALE CHAINS REVIEWED; WHOLE SOURCE ADEQUACY OPEN',checker=ref(__file__),initialChecker=ref('scripts/review-history-exit-belief-agency.py'),developmentFinding='Initial checker expected the two unassigned supports in REV111, but historical revisions also cite unassigned CAMPAIGN2_COGNITIVE_QUALIFICATION.md. It stopped before emitting reports. Successor preserves all three support gaps; no evidence or snapshot changed.',sourceIndex=ref(ixPath),queue=ref(queuePath),occurrences=ref(O/'occurrences.json'),judgments=[dict(queueIndex=i,text=texts[i],disposition=judgments[i]) for i in sorted(judgments)],supports=supportRows,unassignedSupports=gaps,currentInterpretation={'12.4':'Nine separate bounded clauses. Family summary PARTIAL does not cancel REV93 uncertainty or REV97 latent-cause qualification. General fusion, cause discovery, trust and integrated family scope remain unqualified.','12.14':'Eight separate bounded clauses. Family summary missing cross-episode expectation is historical after REV98. Efficacy, blame, coercion and combined native expectation-driven action remain outside the cited work.'},coverage=dict(texts=15,occurrences=2109,families=2,clauses=17,originalQueueReviewedIncludingCorpus=43,originalQueueRemaining=138,sourceRolesPromoted=0),limits=['Snapshots remain byte-identical; current interpretation is an explicit successor, not silent normalization.','Family PARTIAL labels cannot establish exact missing clauses once later evidence is present, nor may bounded clause totals establish joint integration.','Three historical supports (Campaign2 cognitive qualification and two identity/agency audit sources) remain unassigned; this rationale review does not close their whole-source review.','No fresh simulation, tests/build or qualification. Existing source reviews retain their own exact fresh versus historical replay limits.','SourceREV171 unchanged; other rationale texts/schema prose, independent adequacy and HQ012 remain open.'],obligations=['RO-C3-010','RO-C3-019','RO-C3-020','RO-C3-021']))
assert all(ref(x['path'])==x for x in sourceRefs)
save('check.json',dict(status='PASS; SCOPED SEMANTIC ACCOUNTING',review=ref(O/'review.json'),occurrences=ref(O/'occurrences.json'),texts=15,occurrencesCount=2109,remainingQueueTexts=138,originalSnapshotsUnchanged=True,sourceRolesPromoted=0))
assert all(x.stat().st_size<50000000 for x in O.iterdir())
print(json.dumps(load(O/'check.json')))
