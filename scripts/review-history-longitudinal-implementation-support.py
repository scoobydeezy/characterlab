from pathlib import Path
import collections,hashlib,json
P=Path('docs/planning');B=P/'campaign3-history-universe-rev1';O=P/'campaign3-history-longitudinal-implementation-support-rev1';O.mkdir(exist_ok=True)
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def save(n,v):
 p=O/n
 if p.exists():assert load(p)==v
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
ip=P/'campaign3-history-source-roles-rev174/index.json';ix=load(ip)
manifest={x['path']:x for x in load(B/'manifest.json')['entries']}
judgments={
'GOAL':'Development only, later bounded qualification is separate. Same native actor and safe source projection join goals/receiving; replacement creates a new goal, never rewrites biography. Adopt1 active2; goal histories diverge8, opportunities resume14 after native episode expiry. Seed0 standing -100733/600733 quantizes -167/1000; coarse unit1 yields genuine NoFeedback equality. Preserve failed assertion and initial passing build; FineStanding unit1/16 is a comparator, not chosen calibration. GoalEqualsOpportunity differs from original GoalEqualsPlan. Seven focused plus one horizon test explain receipt8; selected replay/seed0 is not all-seed qualification. Native source does not make composition one scheduler/Save132; decisions do not enact additional effects or fulfill maintenance goal; expiry22 beyond21. Later REV105 closure supersedes development-open matrix only.',
'ROUTINE':'Development only. Actual practice2..7 earns cue history; negative report8 corrects belief without deleting history; return14 is after native episode expiry. Goal reasons require availability, which does not guarantee action; later negative consequences can extinguish it. Preserve all-nine HABIT_CODEC adapter failures for text rather than unsigned occurrence IDs, then8/9 cohort where seed0 with strength63/64 selects idle. Native seed1 resumes without calibration change; no all-seed claim. Ten final tests include pure eight-seed Stored/Derived equality but native0/1 only through14 and selected prefix1/8 successors. Both strategies retain diagnostic cache; not cache-free authority or compression. Later REV107 qualification separately binds source reuse; old goal counts are not routine runs. Habit relearning/loss and native joined admission remain separate.',
'HABIT':'Development only. Actual admitted practice creates distinct habit evidence and episodic acquisition; six intervening displays displace practice children under recency, KeepAll preserves. Surviving episodic accessor cannot read displaced content from journal/protocol/diagnostics, but complete raw history still exists for folding: not global erasure. Zero-standing tests, not native biography. Rest inhibits14/15, release16; negative feedback gives63/128, observed practices18/19 restore447/512, then correction/retirement expose free probes20/21. Hidden/unavailable outcomes do not relearn; changed cue earns separate3/4. Ten tests/17 prefixes,16 memory-owner and328 reference tests/build are historical receipts. No failed new cohort. Derived keeps diagnostic cache. Later REV109 joins native sources prospectively; component episode admission is not native GA, prefix authentication is not future-input admission.'}
sources={};receipts=[];string_counts=collections.Counter()
for tag,j in judgments.items():
 for name in [f'LONGITUDINAL_{tag}_IMPLEMENTATION_CHECKPOINT.md',f'LONGITUDINAL_{tag}_IMPLEMENTATION_CHECK_REV1.json']:
  p=P/name;s=p.as_posix();assert s in ix['unassignedCandidatePaths'] and ref(p)['sha256']==manifest[s]['sha256'];sources[s]=(ref(p),j)
 p=P/f'LONGITUDINAL_{tag}_IMPLEMENTATION_CHECK_REV1.json';v=load(p)
 assert v['qualified'] is False and v['counters']==[1508,0] and v['referenceTests']==328
 for a in v['artifacts']:assert ref(a['path'])==a
 receipts.append(dict(source=ref(p),metadata={k:x for k,x in v.items() if k!='artifacts'},exactArtifactBindings=v['artifacts']))
 def walk(x,pointer=''):
  if isinstance(x,str):string_counts['NARRATIVE' if pointer=='/scope' else 'TYPED METADATA']+=1
  elif isinstance(x,dict):
   for k,y in x.items():walk(y,pointer+'/'+k)
  elif isinstance(x,list):
   for i,y in enumerate(x):walk(y,pointer+'/'+str(i))
 walk(v)
rows=[];counts=collections.Counter()
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line);s=u['source']
  if s not in sources:continue
  sr,j=sources[s];assert u['sourceSha256']==sr['sha256']
  category='NARRATIVE' if s.endswith('.md') or u['location'].get('pointer')=='/scope' else 'BACKING';counts[category]+=1
  rows.append(dict(occurrenceId=u['id'],source=s,sourceSha256=sr['sha256'],location=u['location'],text=u['text'],category=category,judgment=j))
assert len({r['occurrenceId'] for r in rows})==len(rows)
chain=[ref(P/'campaign3-history-exit-consolidation-rev2/review.json'),ref(P/'campaign3-history-partial-coverage-support-rev1/review.json')]
save('review.json',dict(status='THREE DEVELOPMENT CHECKPOINTS AND RECEIPTS RECONCILED; NOT FRESH QUALIFICATION',checker=ref(__file__),sourceIndex=ref(ip),sourceRoles=[dict(**s,role='DATED DEVELOPMENT EVIDENCE; QUALIFIED FALSE PRESERVED',judgment=j,acceptanceChain=chain) for s,j in sources.values()],rows=rows,receipts=receipts,allStringRoles=dict(string_counts),preservedArtifacts=[],limits=['383 original artifact references match exactly. This is historical byte/scope verification, not fresh tests/build/simulation or transitive acceptance of every dependency.','Preserve source reuse versus fresh native execution, candidate equalities, failed cohorts and component/native admission boundary. Later frozen qualification is separate from these development receipts.','No law selection, corpus promotion, new verdict or obligation closure. HQ011 adequacy and80 historical inventory identities remain open.'],obligations=['RO-C3-019','RO-C3-020','RO-C3-021']))
assert sum(len(r['exactArtifactBindings']) for r in receipts)==383
save('check.json',dict(status='PASS; SIX DATED SOURCE ROLES',sources=6,originalNarrativeOccurrences=counts['NARRATIVE'],originalBackingOccurrences=counts['BACKING'],stringLeaves=sum(string_counts.values()),matchedReferenceOccurrences=383,recoveredArtifacts=0,review=ref(O/'review.json')))
assert all(p.stat().st_size<50000000 for p in O.rglob('*') if p.is_file())
print(json.dumps(load(O/'check.json')))
