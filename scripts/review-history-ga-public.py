"""Whole GA public claim/fixture/result review; historical execution stays historical."""
from pathlib import Path
import json,hashlib
from fractions import Fraction
P=Path('docs/planning');O=P/'campaign3-history-ga-public-rev1';B=P/'campaign3-history-universe-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def walk(v,p=''):
 if isinstance(v,dict):
  for k,x in v.items():yield from walk(x,p+'/'+k)
 elif isinstance(v,list):
  for i,x in enumerate(v):yield from walk(x,p+'/'+str(i))
 elif isinstance(v,str):yield p,v
def fingerprints(v):
 if isinstance(v,dict):
  if 'path' in v and 'sha256' in v:yield v
  for x in v.values():yield from fingerprints(x)
 elif isinstance(v,list):
  for x in v:yield from fingerprints(x)
main=load(P/'general-attention-public-comparisons-rev1/RESULTS.json');replay=load(P/'general-attention-public-replay-rev1/RESULTS.json');qual=load(P/'GA_PUBLIC_QUALIFICATION_REV1.json')
prior=load(P/'campaign3-history-source-roles-rev145/index.json');archives={x['sha256']:x['path'] for x in prior['explicitBackingOutsideProseManifest']}
for name in ['evidence-audit','identities']:
 a=load(O/(name+'.json'));assert a['status']=='PASS' and a['comparisons']==36
 for f in fingerprints(a):assert ref(f['path'])==f
specs={
 (P/'GENERAL_ATTENTION_QUALIFICATION_2026_09_20.md').as_posix():'Accepted bounded GA qualification, not final psychological law or whole corpus PASS.43 distinct models/36 comparisons/7074 historical events; derived92/239/228 versus measured21.77 active event types and two replacement-only baseline templates differ from67 bound templates. Historical rollback/test/build claims remain dated and require their separately reviewed receipts. Ten historical final reexecutions include onlytwo checkpoint restores withfive tail instants each. Footprint,selected-only reinforcement,canonical ties,distinct encoding/retrieval feedback and equal protected-retention controls preserved. Corpus promotion never rewrites0.28 experiment. Mixed-module fixture failure and three backfilled verdict entries remain explicit for next evidence-history review.',
 (P/'GA_CORPUS_FIXTURE_1_0_0.md').as_posix():'Bounded deterministic empty-learned-state public fixture: authored physical/task/goal state is initial condition, not acquired memory. Ordinary3..6 encoding/7..10 cues/deadline21; credit37 attribution/38 significance/39 retention/40..41 pressure/expiry100. Positive Participants,not invented Cause/Incidental, supply footprint intervention. Permission/selection/allocation/strength/history/graph/credit remain distinct. Perceived attribution not objective cause. Requirements for rollback/replay/bounds and historical full/reference/build are not a fresh execution. No general Affect/Need/modalities/role inference/segmentation/long-horizon qualification.',
 (P/'GA_PUBLIC_QUALIFICATION_REV1.json').as_posix():'Original numerical qualification receipt freshly reconstructed exactly by evidence-audit:43 models/36 comparisons/77 active types, measured21 and derived92/239/228. Distinguishes source branch from equal multiplier; protected-retention equality denies necessity; finite footprint equality does not rehabilitate retired flat.2171/273 and328/43 tests are historical. Original fixture,freeze,results,script hashes bound; no fresh scheduler or suite claim.',
 (P/'general-attention-public-comparisons-rev1/RESULTS.json').as_posix():'Original43-run manifest and36 canonical pair commitments. Every ordered model/run pair and deterministic coupling reconstructed byte-exact with current canonical primitives; corpus0.28 ExperimentIdentity unchanged. Result summaries are measured backing, not permission to invent observations or infer general laws.29 declared comparisons plus4 footprint and3 retention pairs. No RNG sampling or statistical claim.',
 (P/'general-attention-public-replay-rev1/RESULTS.json').as_posix():'Ten historical public reexecutions have exact original final state/output/trace/save hashes. Eight footprint cases capture terminal graphs without checkpoint restore. Consequence restores at6 and significance-credit at37,each withfive complete later saves and terminal exhaustion; not every prefix of43 runs. Freshly decoded allten captured states and reconstructed graphs, not scheduler reexecution.'
}
schema={'name','modelIdentity','runIdentity','instants','finalClock','events','outputs','maximumInstantWork','stageCounts','readRoots','selected','candidates','ranks','history','graphDigest','finalMemory','attribution','modulations','hashes'}
runs={};freeze=load(main['freeze']['path']);models={m['name']:m for m in freeze['models']}
for row in main['runs']:
 assert ref(row['file']['path'])==row['file'];r=load(row['file']['path']);assert set(r)==schema
 assert all(r[k]==row[k]==models[r['name']][k] for k in ['modelIdentity','runIdentity']);runs[r['name']]=r
 for key in ['initial','originals']:
  image=models[r['name']]['files'][key];assert ref(image['path'])==image
  assert hashlib.sha256(bytes.fromhex(Path(image['path']).read_text().strip())).hexdigest()==r['hashes'][key]
 assert sum(r['stageCounts'].values())==r['events'] and r['maximumInstantWork']<=92
 assert '581' not in r['readRoots']
 assert set(r['selected'])=={'algorithm','capacity','counts'}
 if r['selected']['algorithm']!=3:assert all(n<=r['selected']['capacity'] for n in r['selected']['counts'])
 for c in r['candidates']:
  assert set(c)=={'at','units'}
  for u in c['units']:assert set(u)=={'roles','base','role','attention','raw','strength'};[Fraction(u[k]) for k in ['base','role','attention','raw','strength']]
 for rank in r['ranks']:
  assert set(rank)=={'at','scores','winners'}
  for s in rank['scores']:assert set(s)=={'acquisition','acquiredAt','base','pull','score'};[Fraction(s[k]) for k in ['base','pull','score']]
  assert set(rank['winners'])<=set(s['acquisition'] for s in rank['scores'])
 assert all(set(h)=={'acquisition','acquiredAt','presentations'} for h in r['history'])
 assert set(r['finalMemory'])=={'acquisitions','usedChildren','significantChildren','lateAcquisitions','digest'}
 assert all(set(a)=={'disposition','consumed','targets'} for a in r['attribution'])
 assert all(set(m)=={'source','branch','residual','omega'} for m in r['modulations'])
 specs[row['file']['path']]='Complete typed historical run summary for '+r['name']+'. Identity,initial/original commitments,events,selection,role-factor candidates,recall arithmetic,winners,presentation history,graph,retention,attribution and feedback inspected as schema-bound backing. Numeric/hash/role strings including omitted short leaves carry no extra narrative findings. Actual behavioral interpretation remains the fixture/qualification comparison; summary does not independently establish denied reads or runtime rollback.'
assert len(runs)==43 and len({r['modelIdentity'] for r in runs.values()})==43
assert sum(r['events'] for r in runs.values())==7074
assert len(set(k for r in runs.values() for k in r['stageCounts']))==77
assert max(r['maximumInstantWork'] for r in runs.values())==21
assert sum(r['instants'] for r in runs.values())==525
assert all(r['finalClock']==('100' if n.startswith('credit-') else '21') for n,r in runs.items())
for k in ['candidates','ranks','history','finalMemory','graphDigest']:assert runs['baseline'][k]==runs['budget-Independent-1/1'][k];assert runs['select-k2'][k]==runs['select-equal-k2'][k]
assert runs['baseline']['ranks']!=runs['local-access']['ranks'] and runs['baseline']['history']==runs['local-access']['history']
assert len(replay['runs'])==10
tails=[]
for r in replay['runs']:
 assert set(r)=={'name','modelIdentity','runIdentity','finalClock','state','hashes','graph','replay'}
 p=P/'general-attention-public-replay-rev1'/(r['name']+'.json');assert load(p)==r
 assert r['hashes']=={k:runs[r['name']]['hashes'][k] for k in ['state','outputs','trace','save']}
 assert ref(r['state']['path'])==r['state'] and r['graph']['digest']==runs[r['name']]['graphDigest']
 if r['replay']:
  assert r['replay']['continuations']==5 and r['replay']['allCompleteSavesEqual'];tails.append((r['name'],r['replay']['checkpoint']))
 specs[p.as_posix()]='Exact per-case replay row '+r['name']+'; contextual duplicate of manifest row verified whole, including original identities and captured state/graph. '+('Historical checkpoint '+r['replay']['checkpoint']+' restored once thenfive tail instants; fresh graph/identity verification only.' if r['replay'] else 'Historical final reexecution and graph capture only; no intermediate restore in this case.')
assert tails==[('source-consequence-lane','6'),('credit-significance-first','37')]
assert len(specs)==58 and not set(specs)&{r['path'] for r in prior['roleAssignments']}
entries={e['path']:e for e in load(B/'manifest.json')['entries']};roles=[];strings={};bindings=[]
chain=[ref(O/n) for n in ['evidence-audit.json','identities.json']]+[ref(P/'campaign3-history-ga-freeze-rev1/review.json')]
for p,judgment in specs.items():
 assert ref(p)['sha256']==entries[p]['sha256'];roles.append(dict(**ref(p),role='BOUNDED GA PUBLIC CLAIM / FIXTURE / TYPED EXECUTION BACKING',judgment=judgment,acceptanceChain=chain))
 if not p.endswith('.json'):continue
 v=load(p)
 for ptr,s in walk(v):strings[p,ptr]=s
 for f in fingerprints(v):
  target=f['path'] if Path(f['path']).exists() and ref(f['path'])['sha256']==f['sha256'] else archives.get(f['sha256']);assert target and ref(target)['sha256']==f['sha256'],f
  bindings.append(dict(source=p,originalPath=f['path'],sha256=f['sha256'],resolvedPath=target))
rows=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in specs:continue
  assert u['sourceSha256']==entries[u['source']]['sha256'];ptr=u['location'].get('pointer','')
  if u['source'].endswith('.json'):assert strings[u['source'],ptr]==u['text']
  narrative=u['source'].endswith('.md') or ptr.startswith(('/limits/','/feedback/law')) or (u['source'].endswith('comparisons-rev1/RESULTS.json') and ptr.startswith('/comparisons/') and ('/changed/' in ptr or ptr.endswith('/alignment')))
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],role='NARRATIVE AUTHORITY/FINDING' if narrative else 'TYPED EVIDENCE BACKING',judgment=specs[u['source']]))
r=dict(status='BOUNDED GA PUBLIC CLAIM HISTORY RECONCILED; HQ011 OPEN',sourceRoles=roles,rows=rows,stringLeaves=len(strings),bindings=bindings,preservedArtifacts=[],obligations=['RO-C3-002','RO-C3-003','RO-C3-004','RO-C3-005','RO-C3-006','RO-C3-007','RO-C3-019','RO-C3-020','RO-C3-021'],limits=['Fresh measured-receipt audit and36comparison/oneexperiment identity reconstruction/ten captured-state decoding only; no scheduler,restore,test-suite or build rerun.','Original ten final reexecutions include onlytwo restored checkpoints withfive subsequent saves each,not every prefix.','Historical full/focused/reference/rollback/build/promotion andmixed-module failure sources still require their own whole-source review. No full claim-spine closure from this batch.','No psychological law selection,retired-control rehabilitation,objective attribution or general Affect/Need/long-horizon qualification.','Earlier missing GA source bytes and formula/legacy-log provenance exclusions remain for final HQ011adequacy; HQ012unstarted.'])
c=dict(status='PASS; HQ011 OPEN',sources=len(specs),originalNarrativeOccurrences=sum(x['role'].startswith('NARRATIVE') for x in rows),originalBackingOccurrences=sum(x['role'].startswith('TYPED') for x in rows),stringLeaves=len(strings),resolvedBindings=len(bindings),historicalRuns=43,historicalEvents=7074,historicalInstants=525,historicalFinalReexecutions=10,historicalRestoredCheckpoints=2,historicalTailInstants=10,freshIdentityComparisons=36,freshCapturedStateDecodes=10,freshRuntimeRuns=0,checker=ref(__file__))
for n,v in [('review.json',r),('check.json',c)]:
 p=O/n
 if p.exists():assert load(p)==v
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
print(json.dumps(c))
