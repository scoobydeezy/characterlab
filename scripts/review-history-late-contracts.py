"""Bind exact late component/reuse contracts to their scoped accepted qualifications."""
from pathlib import Path
import json,hashlib
P=Path('docs/planning');F=Path('docs/formal');B=P/'campaign3-history-universe-rev1';O=P/'campaign3-history-late-contracts-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def save(p,v):
 if p.exists():assert load(p)==v,p
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
# Whole source reading supplies these judgments; path matching only selects original occurrences.
specs={
 'LONGITUDINAL_GOAL_COMPONENT_CONTRACT.md':('LONGITUDINAL_GOAL_PLAN_REV1.json','CAMPAIGN3_LONGITUDINAL_GOAL_QUALIFICATION.md',
 'ACCEPTED EXACT COMPONENT CONTRACT; PRE-EXPERIMENT STATUS HISTORICAL',
 'Original16 instants/native source, adopted/withdrawn/replaced goal timing, source-safe standing and controlled meanings remain separate. Coarse1/fine1/16 with cap3 and distinct100+instant roots are candidate calibrations. Guarded source/receiver rollback and original-prefix reconstruction do not create native admission.',
 'Literal qualification OPEN is superseded only by the accepted120-run/2040-successor scope. Preserve coarse equality and GoalEqualsPlan elsewhere; expiry22 is outside21, no world feedback or attainment.'),
 'LONGITUDINAL_ROUTINE_COMPONENT_0_1.md':('LONGITUDINAL_ROUTINE_PLAN_REV1.json','CAMPAIGN3_LONGITUDINAL_ROUTINE_QUALIFICATION.md',
 'ACCEPTED EXACT COMPONENT CONTRACT; QUALIFICATION STATUS HISTORICAL',
 'Actual visible practice appends actor-owned history; opportunity absence and separate negative report differ. Availability uses positive reward belief or same-cue strength>=1/2; goals supply reasons, not eligibility. HABIT neutral policy,200+instant addresses and physiological NoActiveReasons remain distinct.',
 'Stored/Derived share diagnostic cache and full journal; no minimal-state proof. Source/receiver composition is component ownership. Later504-run qualification does not supply habit relearning or native-public admission.'),
 'LONGITUDINAL_ROUTINE_REUSE_PROTOCOL_0_1.md':('LONGITUDINAL_ROUTINE_PLAN_REV1.json','CAMPAIGN3_LONGITUDINAL_ROUTINE_QUALIFICATION.md',
 'ACCEPTED PROSPECTIVE EVIDENCE-REUSE PROTOCOL',
 '16 predetermined native trajectories are exact same-actor functional sources, with archives,17 original prefixes and decoded881 projections authenticated.504 fresh receivers bind source identity/save hash; four joined sentinels/eight restores separately corroborate. No receiver writes source; only standing enters cognition.',
 '8568 receiver reconstructions are not fresh native restores or full future tails. Preserve contrary-biography non-resumption at14; full horizon proves seed0 resumption15, not permanent non-resumption. Reuse metadata is not character evidence.'),
 'LONGITUDINAL_HABIT_COMPONENT_0_1.md':('LONGITUDINAL_HABIT_PLAN_REV2.json','CAMPAIGN3_LONGITUDINAL_HABIT_QUALIFICATION.md',
 'ACCEPTED EXACT COMPONENT CONTRACT; FUTURE SOURCE BINDING EXTERNAL',
 'Actual observation836 forms separate practice episodes; six later admitted displays and recency6 displace them, KeepAll32 preserves them. Governance prevents regeneration of old IDs, recall reads surviving children only. Habit journal/cache, belief and goals remain independent; actual observed renewed practice is required.',
 'Online receiver authenticates prefix inputs, not future standing sequence; prospective RunIdentity supplies that closure. Full raw history persists despite local episode loss.300+instant neutral/arbitration addresses remain exact; no native GA formation, global forgetting or general recall claim.'),
 'LONGITUDINAL_HABIT_REUSE_PROTOCOL_0_2.md':('LONGITUDINAL_HABIT_PLAN_REV2.json','CAMPAIGN3_LONGITUDINAL_HABIT_QUALIFICATION.md',
 'ACCEPTED PROSPECTIVE SUCCESSOR HARNESS PROTOCOL',
 'Both receiver retention laws use the same default native source per seed.960 fresh receiver cases/16320 successors and12 receiver faults are separate from8 reused native sources/136 prefixes and four fresh joined horizons/eight restores. REV2 fixes only the expected fault label and refreezes experiment identity.',
 'Original REV1 joined seed0 is preserved but excluded from new counts; identical saves do not erase distinct run identities. Component episode formation, raw journal and diagnostic cache persist; no native joined admission or representation retirement.'),
 'LONGITUDINAL_HABIT_REUSE_PROTOCOL_0_1.md':('LONGITUDINAL_HABIT_PLAN_REV1.json','CAMPAIGN3_LONGITUDINAL_HABIT_QUALIFICATION.md',
 'SUPERSEDED FROZEN HARNESS PROTOCOL; NO COMPLETED MATRIX CLAIM',
 'Original protocol shares production semantics and prospective scope with0.2, but its bound harness expected the wrong fault label. Preserve its plan/runner and one completed original joined receipt as failed-cohort history.',
 'Superseded only by the explicit REV2 prospective harness/identity correction; do not award960-run completion to the old plan or count its joined run in REV2.'),
 'LONGITUDINAL_PERSONAL_LOSS_COMPONENT_0_1.md':('LONGITUDINAL_PERSONAL_LOSS_PLAN_REV1.json','CAMPAIGN3_LONGITUDINAL_PERSONAL_LOSS_QUALIFICATION.md',
 'ACCEPTED EXACT COMPONENT CONTRACT; GENERAL GRIEF UNQUALIFIED',
 'Actually admitted participation precedes authored goal adoption; availability reports update belief after current appraisal. Likelihood1-belief, goal-relative severity, vulnerability1 and perceived control feed retained candidate projections. Independent execution and masked outcomes preserve truth/evidence distinction.',
 'Fixed threshold/reason units and future-contact proposition do not encode death or clinical grief. Goals expire13 outside12. Final-coordinate support consumer does not establish vector necessity; no full-tail replay or native-public admission.'),
 'AFFECT_REGULATORY_REDUCTION_CONTRACT.md':('AFFECT_REGULATORY_PLAN_REV1.json','CAMPAIGN3_AFFECT_REGULATORY_QUALIFICATION.md',
 'ACCEPTED REDUCTION EXPERIMENT CONTRACT; NO NEW PRODUCTION LAW',
 'Body-only projection admits physical history/fixed constitution but excludes sensory history, belief and goals. Primary physical prehistory/current sensation collision tests delayed existing half-threat stress feedback at3. ScalarThreat is explicitly a serious successful alternative; all8 conditions/seeds retained.',
 '64 sources/832 component prefixes,320 twice-run receivers and four native sentinels/16 selected restores remain separate. No arbitrary-scalar impossibility, psychological vector necessity, clinical mechanism, new wrapper or free-choice difference follows.')
}
entries={e['path']:e for e in load(B/'manifest.json')['entries']};sources={};qualReview=load(P/'campaign3-history-late-qualifications-rev1/review.json')
qualRoles={s['path']:s for s in qualReview['sourceRoles'] if s['role']=='ACCEPTED SCOPED QUALIFICATION SOURCE'}
for name,(planName,qualName,role,judgment,limits) in specs.items():
 path=F/name;key=path.as_posix();planPath=P/planName;plan=load(planPath)
 assert sha(path)==entries[key]['sha256']==sha(B/'sources'/key)
 assert any(a['path']==key and a['sha256']==sha(path) for a in plan['artifacts']),key
 qr=qualRoles[(P/qualName).as_posix()];assert qr['sha256']==sha(P/qualName)
 sources[key]=dict(path=key,sha256=sha(path),role=role,judgment=judgment,limits=limits,
  acceptance='Exact contract bytes bound by the prospectively frozen named plan, with scoped completed evidence in the linked qualification. Old harness0.1 is explicitly superseded, not accepted as a completed matrix.',
  plan=dict(path=planPath.as_posix(),sha256=sha(planPath)),qualification=dict(path=(P/qualName).as_posix(),sha256=sha(P/qualName),verdict=qr['verdict']),obligations=qr['obligations'])
old=(F/'LONGITUDINAL_HABIT_REUSE_PROTOCOL_0_1.md').read_bytes().decode('utf-8-sig');new=(F/'LONGITUDINAL_HABIT_REUSE_PROTOCOL_0_2.md').read_bytes().decode('utf-8-sig')
prefix=new[:new.index('REV2 correction:')].rstrip()
assert old.replace('— candidate0.1','— candidate0.2').replace('habit-reuse-harness/0.1-candidate','habit-reuse-harness/0.2-candidate').rstrip()==prefix
rows=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in sources:continue
  source=sources[u['source']];ls=Path(u['source']).read_bytes().decode('utf-8-sig').splitlines(keepends=True);a=u['location']['startLine'];z=u['location']['endLine'];assert ''.join(ls[a-1:z])==u['text']
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],role=source['role'],judgment=source['judgment'],limits=source['limits'],evidence=[source['plan'],source['qualification']],obligations=source['obligations']))
for path in sources:
 ls=Path(path).read_bytes().decode('utf-8-sig').splitlines();covered={n for r in rows if r['source']==path for n in range(r['location']['startLine'],r['location']['endLine']+1)}
 assert {n for n in covered if ls[n-1].strip()}=={n for n,l in enumerate(ls,1) if l.strip()}
v=dict(status='SEVEN EXACT CONTRACT/PROTOCOL SOURCES ACCEPTED IN SCOPE; ONE PREDECESSOR SUPERSEDED',sources=list(sources.values()),rows=rows,
 evidence=[dict(path=(P/'campaign3-history-late-qualifications-rev1/review.json').as_posix(),sha256=sha(P/'campaign3-history-late-qualifications-rev1/review.json'))],obligations=sorted({o for s in sources.values() for o in s['obligations']}),
 limits=['Normative exact semantics and candidate mathematics are distinct from empirical necessity; no law selected or interface widened.','Pre-experiment OPEN labels are qualified only by their named later scope; frozen bytes/versions remain unchanged.','No new production execution, simulation, tests/build, corpus pass or obligation closure.','Original contract guards and retained failed-harness controls still apply; whole-campaign history adequacy remains open.'])
O.mkdir(exist_ok=True);save(O/'review.json',v)
c=dict(status=v['status'],sourceFiles=len(sources),originalOccurrences=len(rows),bySource={p:sum(r['source']==p for r in rows) for p in sorted(sources)},reviewSha256=sha(O/'review.json'),checkerSha256=sha(__file__))
save(O/'check.json',c);print(json.dumps(c))
