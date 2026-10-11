"""Accept scoped late qualification sources and preserve their rejected predecessors."""
from pathlib import Path
import json,hashlib,copy
P=Path('docs/planning');B=P/'campaign3-history-universe-rev1';O=P/'campaign3-history-late-qualifications-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def save(p,v):
 if p.exists():assert load(p)==v,p
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
specs={
 'CAMPAIGN3_LONGITUDINAL_GOAL_QUALIFICATION.md':dict(
  verdict='VER-C3-LONGITUDINAL-GOAL-001',closure='LONGITUDINAL_GOAL_CLOSURE_REV1.json',checker='scripts/check-longitudinal-goal-closure.mjs',
  established='Acquired biography and adopted goal survive source episode expiry; current goal changes later arbitration without rewriting source history. Fine standing differs from NoFeedback18/24 in probabilities and14/24 in actions; coarse equals NoFeedback24/24; retention pairs24/24 equal.',
  limitations='Fixed meanings/goals/opportunities and a component receiver around a native source.120 runs/2040 original immediate successors are not joined native admission or full future tails. Source expiry is not general detail irrelevance; no receiving world feedback, fulfillment or new biography.',
  failure='Preserve failed coarse NoFeedback inequality and all equalities: zero standing seeds4/5 and four further action equalities. Fine calibration earns bounded utility, not stored-standing necessity.',
  reopening='New consumer, meaning source, calibration, world feedback, horizon beyond goal expiry22, or joined-native claim needs new proof.',
  obligations=['RO-C3-009','RO-C3-012','RO-C3-013','RO-C3-014','RO-C3-017','RO-C3-019','RO-C3-020','RO-C3-021']),
 'CAMPAIGN3_LONGITUDINAL_ROUTINE_QUALIFICATION.md':dict(
  verdict='VER-C3-LONGITUDINAL-ROUTINE-001',closure='LONGITUDINAL_ROUTINE_CLOSURE_REV1.json',checker='scripts/check-longitudinal-routine-closure.mjs',
  established='Actual practice creates same-cue availability surviving reward-belief correction and opportunity loss. Maintained/withdrawn goals both resume in8/8; opposed goals inhibit.96 Stored/Derived row pairs and24 retention pairs equal.',
  limitations='504 component trajectories/8568 reconstructions use16 authenticated native sources; four fresh joined horizons/eight restores are separate. Lost native source episodes are not the new practice episodes. Both read strategies retain diagnostic cache/raw history; no cache-free compression or automatic scheduling proof.',
  failure='Preserve typed-occurrence rejection, mistaken must-resume-at14 and later ScheduledOnly availability-as-enactment assertions. Seed0 resumes at15; ScheduledOnly performs seven times for seed0, eight for others. Original wrong report/checker remain distinct.',
  reopening='Own-practice forgetting/relearning, new cues/thresholds/goals, physical biology, natural goal formation, raw-history removal or public-native admission require distinct evidence.',
  obligations=['RO-C3-009','RO-C3-012','RO-C3-013','RO-C3-014','RO-C3-015','RO-C3-017','RO-C3-019','RO-C3-020','RO-C3-021']),
 'CAMPAIGN3_LONGITUDINAL_HABIT_QUALIFICATION.md':dict(
  verdict='VER-C3-LONGITUDINAL-HABIT-001',closure='LONGITUDINAL_HABIT_CLOSURE_REV1.json',checker='scripts/check-longitudinal-habit-closure.mjs',
  established='Actual observed practice forms separately owned episodes and habit history. Own episode children can be lost while rest inhibits and later positive observed practice relearns. Hidden/unavailable practice fails relearning despite positive reports.192 Stored/Derived pairs and480 retention behavior pairs equal.',
  limitations='960 receiver trajectories/16320 immediate-prefix successors use8 native sources; four REV2 joined horizons/eight restores separately corroborate. Component memory admission and local episode loss retain full fold/audit history. Four final non-actions coexist with learned availability; no global erasure, compression or native joined admission.',
  failure='Preserve pre-freeze ?raw scanner rejection, wrong ROUTINE_INJECTED oracle, original plan and one old joined run. REV2 changes harness identity, not semantics; equal old/new seed0 save hashes do not justify counting the old run again.',
  reopening='Recall from lost content, global history erasure, natural cue acquisition/goals, free-choice policy replacement, general calibration or full-native admission require new evidence.',
  obligations=['RO-C3-009','RO-C3-012','RO-C3-013','RO-C3-014','RO-C3-015','RO-C3-017','RO-C3-019','RO-C3-020','RO-C3-021']),
 'CAMPAIGN3_LONGITUDINAL_PERSONAL_LOSS_QUALIFICATION.md':dict(
  verdict='VER-C3-LONGITUDINAL-LOSS-001',closure='LONGITUDINAL_PERSONAL_LOSS_CLOSURE_REV1.json',checker='scripts/check-longitudinal-personal-loss-closure.mjs',
  established='Two actual admitted participations support an authored continuity goal. Fallible future-contact belief changes appraisal and later chosen/executed response without erasing original relationship or retiring the goal.160 boundary pairs and5/8 loss,5/8 affect-ablation,7/8 competing-motive action contrasts retained.',
  limitations='480 component runs/6240 immediate-prefix restores. Controlled offers, adoption threshold, reports, perceived control and masked later outcomes; prior GRIEF remains richer in its own scope. Final-coordinate consumer does not establish affect dimensionality. No bereavement/clinical grief, natural sensing or native admission.',
  failure='No failed development cohort is reported here; retain three equal loss action sequences and all other equalities. Physical contact can succeed without correcting false belief because outcomes are masked. Mean2/3 versus Latest1 after correction is not calibrated correctness.',
  reopening='Unmasked later learning, natural relationship/goal formation, death/clinical scope, physiological feedback, longer horizon beyond expiries13 or native admission requires distinct proof.',
  obligations=['RO-C3-009','RO-C3-010','RO-C3-011','RO-C3-012','RO-C3-013','RO-C3-014','RO-C3-016','RO-C3-017','RO-C3-019','RO-C3-020','RO-C3-021']),
 'CAMPAIGN3_AFFECT_REGULATORY_QUALIFICATION.md':dict(
  verdict='VER-C3-AFFECT-REGULATORY-001',closure='AFFECT_REGULATORY_CLOSURE_REV1.json',checker='scripts/check-affect-regulatory.mjs',
  established='Identical full bodily prehistory/constitution/sensations with different admitted harm evidence gives threat0/270 and delayed stress0/135. Body-only deterministic reduction cannot distinguish the pair. FullAffect and ScalarThreat both preserve64/64; Stress56, Pain48, RewardDeviation56 of64.',
  limitations='64 component runs/832 immediate-prefix restores,320 substitutions repeated twice, four native sentinels/48 instants/16 selected native restores are distinct denominators. Existing threat-to-stress edge, instructed inert actions and biased sensing; no general scalar impossibility or vector necessity, changed actions or universal gain.',
  failure='No behavioral development failure reported. Historical biology checksum rejection is preserved and resolved through the actual old source, not by rewriting its checksum. Earlier ScalarUncontrolled14-case retrieval equality remains intact.',
  reopening='Additional independently motivated receiving query, new psychological operands/horizon, reduction of null versus zero, changed sensory/feedback law or broader native claim requires new evidence.',
  obligations=['RO-C3-002','RO-C3-003','RO-C3-006','RO-C3-007','RO-C3-008','RO-C3-010','RO-C3-011','RO-C3-019','RO-C3-020','RO-C3-021'])
}
findings={
 'LONGITUDINAL_ROUTINE_CLOSURE_REVIEW_FINDING_REV1.json':('REJECTED ASSERTION AND REPORT PRESERVED','Availability does not force enactment. Corrected scoped report/checker supersede the seven-versus-eight overstatement without changing frozen production, plan or trajectory bytes.','CAMPAIGN3_LONGITUDINAL_ROUTINE_QUALIFICATION.md'),
 'LONGITUDINAL_HABIT_FREEZE_FINDING_REV1.json':('PRE-FREEZE TOOLING FAILURE PRESERVED','A ?raw import suffix was wrongly used as a filesystem path. Correct-forward scanner strips it; no original plan or qualifying run existed at this failure.','CAMPAIGN3_LONGITUDINAL_HABIT_QUALIFICATION.md'),
 'LONGITUDINAL_HABIT_ORACLE_FINDING_REV1.json':('FROZEN FAILED HARNESS COHORT PRESERVED','Wrong expected exception name failed before first receiver receipt. REV2 prospective identities and complete matrix supersede that harness; old joined seed0 evidence remains separately counted.','CAMPAIGN3_LONGITUDINAL_HABIT_QUALIFICATION.md'),
 'AFFECT_REGULATORY_HISTORICAL_CHECK_FINDING_REV1.json':('EXPLAINED HISTORICAL SOURCE CHECK REJECTION','Current repaired wrapper does not match historical pre-repair bytes. Preserve both hashes and use the old-source verification mapping; new native sentinels qualify current source separately. Malformed bookkeeping writer made no changes.','CAMPAIGN3_AFFECT_REGULATORY_QUALIFICATION.md')
}
archived='longitudinal-routine-closure-review-rev1/CAMPAIGN3_LONGITUDINAL_ROUTINE_QUALIFICATION.md'
entries={e['path']:e for e in load(B/'manifest.json')['entries']};allSources={str(P/n).replace('\\','/') for n in list(specs)+list(findings)+[archived]}
units=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] in allSources:units.append(u)
commands=load(O/'commands.json');assert len(commands['commands'])==5
assert {r['command'] for r in commands['commands']}=={'node '+s['checker'] for s in specs.values()}
assert all(r['exitCode']==0 for r in commands['commands'])
ledger=(B/'sources/docs/planning/VERDICT_LEDGER.md').read_bytes().decode('utf-8-sig')
sourceRoles=[];bindings={}
for name,s in specs.items():
 path=P/name;key=path.as_posix();assert sha(path)==entries[key]['sha256']
 closure=load(P/s['closure']);assert closure['verdict']==s['verdict'] and closure['status']=='PASS'
 assert any(a['path']==key and a['sha256']==sha(path) for a in closure['artifacts'])
 assert any(a['path']==s['checker'] and a['sha256']==sha(s['checker']) for a in closure['artifacts'])
 assert '## `'+s['verdict']+'`' in ledger
 evidence=[dict(path=(P/s['closure']).as_posix(),sha256=sha(P/s['closure'])),dict(path=s['checker'],sha256=sha(s['checker'])),dict(path=(O/'commands.json').as_posix(),sha256=sha(O/'commands.json'))]
 bindings[key]=evidence
 sourceRoles.append(dict(path=key,sha256=sha(path),role='ACCEPTED SCOPED QUALIFICATION SOURCE',acceptance='Named frozen ledger verdict plus exact report hash in its closure, reviewed causal comparisons/limits and successful read-only closure recomputation. No authority inferred from filename or PASS alone.',evidence=evidence,**s))
for name,(role,judgment,parent) in findings.items():
 path=P/name;key=path.as_posix();v=load(path);assert sha(path)==entries[key]['sha256']
 for a in v['files']:
  target=a.get('preserved',a.get('path'));assert sha(target)==a['sha256'],target
 if 'bookkeepingFailure' in v:assert sha(v['bookkeepingFailure']['archive'])==v['bookkeepingFailure']['sha256']
 sourceRoles.append(dict(path=key,sha256=sha(path),role=role,acceptance='Complete preserved finding inspected with referenced original file hashes and the accepted successor qualification.',judgment=judgment,successor=(P/parent).as_posix()))
old=(P/archived).read_bytes().decode('utf-8-sig');new=(P/'CAMPAIGN3_LONGITUDINAL_ROUTINE_QUALIFICATION.md').read_bytes().decode('utf-8-sig')
bad='| ScheduledOnly, maintained goal | Repeats at all8 later opportunities; differs from Derived in all8 seeds |'
good='| ScheduledOnly, maintained goal | Available at all8 later opportunities;7 performances at seed0 and8 at seeds1..7; differs from Derived in all8 seeds |'
assert bad in old and good in new
start=new.index('The closure review also rejected');end=new.index('## Limits and next gate',start)
assert old.replace(bad,good)==new[:start]+new[end:]
assert sha(P/archived)==entries[(P/archived).as_posix()]['sha256']
sourceRoles.append(dict(path=(P/archived).as_posix(),sha256=sha(P/archived),role='SUPERSEDED REPORT; ONE RETRACTED TABLE CLAIM',acceptance='Complete diff against accepted successor proves only the ScheduledOnly row replacement and added failure paragraph. Other content retains the same bounded review; this archived copy is not additional independent evidence.',successor=(P/'CAMPAIGN3_LONGITUDINAL_ROUTINE_QUALIFICATION.md').as_posix(),retractedClaim=bad,correction=good))
rows=[]
for u in units:
 key=u['source'];name=key[len(P.as_posix())+1:];location=u['location']
 if 'startLine' in location:
  ls=Path(key).read_bytes().decode('utf-8-sig').splitlines(keepends=True);assert ''.join(ls[location['startLine']-1:location['endLine']])==u['text']
 else:
  node=load(key)
  for part in location['pointer'].lstrip('/').split('/'):
   part=part.replace('~1','/').replace('~0','~');node=node[int(part)] if isinstance(node,list) else node[part]
  assert node==u['text']
 if name in specs:
  s=specs[name];role='SCOPED QUALIFICATION CLAIM/LIMIT/CONTEXT';judgment=s['established'];limits=s['limitations']+' '+s['failure'];reopen=s['reopening'];obs=s['obligations'];evidence=bindings[key]
 elif name in findings:
  role,judgment,parent=findings[name];limits='Preserved technical/report failure; not a new failed psychological model, erased cohort or fresh execution.';reopen='Changing the cited original or removing the finding reopens preservation.';obs=specs[parent]['obligations'];evidence=bindings[(P/parent).as_posix()]
 else:
  role='SUPERSEDED COPY WITH EXPLICIT CORRECTION';s=specs['CAMPAIGN3_LONGITUDINAL_ROUTINE_QUALIFICATION.md'];judgment=s['established'];limits=s['limitations'];reopen=s['reopening'];obs=s['obligations'];evidence=bindings[(P/'CAMPAIGN3_LONGITUDINAL_ROUTINE_QUALIFICATION.md').as_posix()]
  if bad in u['text']:judgment='RETRACTED ScheduledOnly guaranteed enactment row: actual seed0 performs7, others8. Other rows unchanged.'
 rows.append(dict(occurrenceId=u['id'],source=key,sourceSha256=u['sourceSha256'],location=location,text=u['text'],role=role,judgment=judgment,limits=limits,reopen=reopen,obligations=obs,evidence=evidence))
for source in allSources:
 if not source.endswith('.md'):continue
 ls=Path(source).read_bytes().decode('utf-8-sig').splitlines();covered={n for r in rows if r['source']==source for n in range(r['location']['startLine'],r['location']['endLine']+1)}
 assert {n for n in covered if ls[n-1].strip()}=={n for n,l in enumerate(ls,1) if l.strip()}
v=dict(status='FIVE SCOPED QUALIFICATIONS AND PRESERVED FAILURES REVIEWED; HQ011 OPEN',sourceRoles=sourceRoles,rows=rows,
 evidence=[dict(path=(P/'campaign3-history-ledger-residual-rev1/review.json').as_posix(),sha256=sha(P/'campaign3-history-ledger-residual-rev1/review.json'))],
 obligations=sorted({o for s in specs.values() for o in s['obligations']}),
 limits=['All source roles are claim-scoped; neither exact bytes nor a passed checker alone establishes authority or whole-phenomenon adequacy.','Stored fresh/prior test/build labels concern original qualifications. This review reruns only five read-only closure checkers.','Frozen prose source occurrences and failed report are retained. No new model, production change, execution matrix, clause promotion, comparator retirement or obligation closure.','Other supporting sources and post-cutoff additions remain outside this batch.'])
def validate(x):
 assert x==v
 assert len({r['occurrenceId'] for r in x['rows']})==len(units)
faults=[]
for mode in ['drop-failure','promote-native','retire-scalar','fresh-build-inflation']:
 x=copy.deepcopy(v)
 if mode=='drop-failure':x['rows'].pop()
 elif mode=='promote-native':x['sourceRoles'][0]['limitations']='All native admitted'
 elif mode=='retire-scalar':x['sourceRoles'][4]['established']='Scalar impossible'
 else:x['limits']=[]
 try:validate(x)
 except AssertionError:faults.append(mode)
 else:raise AssertionError(mode)
save(O/'review.json',v)
c=dict(status=v['status'],sourceFiles=len(allSources),originalOccurrences=len(rows),bySource={s:sum(r['source']==s for r in rows) for s in sorted(allSources)},acceptedQualifications=5,preservedFindingSources=4,supersededReportSources=1,readOnlyClosureChecks=5,rejectedAccountingMutations=faults,reviewSha256=sha(O/'review.json'),checkerSha256=sha(__file__))
save(O/'check.json',c);print(json.dumps(c))
