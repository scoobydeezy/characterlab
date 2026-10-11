from pathlib import Path
import hashlib,json
P=Path('docs/planning');O=P/'campaign3-history-exit-control-goals-communication-rev1';O.mkdir(exist_ok=True)
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def save(name,v):
 p=O/name
 if p.exists():assert load(p)==v
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
judgments={
27:'Controlled false input is not chosen lying. The historical gap is superseded by separate COMM, LYING, DISPLAY and INTERPRET experiments, not by relabeling SOCIAL input.',
132:'Retention and cue expiry do not supply strategy choice, delay valuation or competing goals. Later experiments add distinct evidence; the original demand for an accepted public setup is not met by component-only additions.',
151:'Disclosure/concealment is actual choice with separate delivery and recipient learning. Honest mistaken assertion remains distinct from lying; copied familiarity scope in source plans does not enlarge the contract.',
152:'Contrary assertion is relative to speaker belief and purpose, so it may accidentally be true. Failed delivery or resistant recipient belief preserves intent without successful deception. No listener model or persuasion law.',
153:'Reassurance and accidental cue leakage have separate channels. Preserve the corrected calm intervention after an earlier passing cohort. No physiology, learned suppression or assertion/cue fusion is earned.',
154:'Fixed conventions separate intended meaning, observed glyph/context, interpreted meaning and recipient learning. Unknown context retains signal without meaning; absent signal adds no sample. Nine separate witnesses do not establish joint communication integration or natural language.',
161:'Owned goal and mutable strategy survive route gaps and support actual route-B completion. Fulfillment follows admitted criterion even when false or externally caused. Empty random ledger means this does not qualify stochastic Decision.',
162:'Actual defer requires active accessible feasible work with positive reason. Corrected0.2 preserves late-adoption failure despite earlier passing tests. A future opening does not prove enough completion capacity or optimal postponement.',
163:'Same-benefit delay choice includes waiting, physical delivery and admitted receipt. Missing/zero/unknown/unavailable remain distinct; three discount candidates survive. No subsequent adaptive choice, trust or general temporal currency.',
164:'Retained inaccessible route content differs from lost route content and from lost goal adoption. Preserve present-cue zero-score top-K behavior and superseded identity receipts. Component restore is not public scheduler or Save132 admission.',
165:'Independent goals retain losing-goal state and selective lifecycle after actual contest. Probability changes can share sampled sequence; two diagnostic lifecycle collapses coincide and both fail. Eight separate clause witnesses are not integrated general prospection or proof of public component admission.',
174:'The original finite workspace/cache experiment does not implement all later cognitive-control phenomena. Subsequent qualifications add separate mechanisms and evidence.',
175:'Maintained-goal inhibition under neutral-card load preserves underlying habit; release re-exposes it. Two-slot resource candidate and rejected0.1 cohort remain scoped, not a universal effort/control law.',
176:'Instructed prospective conditional framing changes later affect without editing retained belief. It does not supply strategy choice, physical mitigation or downstream action; later chosen-reappraisal evidence remains separate.',
177:'Monitoring supports actual route switching but B success after blocker removal does not establish superior efficacy. Visit-local threshold, OutcomeBlind and AnyFailure remain; outcome display is fallible and not causal diagnosis.',
178:'Recurrent unresolved content supports interruption/rebound and evidence-based release. Static external load can mimic immediate cost, so action alone does not identify recurrence. Preserve22 distinct identities despite23 stored rows/duplicate checks.',
179:'Experienced fatigue changes actual inhibition while motor-only execution remains a legitimate separate path. Unknown fatigue differs from rested zero. Nine separate bounded clauses do not prove one shared resource law or endogenous fatigue physiology.',
180:'The eighteen connected biological behaviors add their own component integration evidence. They do not automatically promote every Brief clause, native-source admission or whole control-family integration.'
}
qpath=P/'campaign3-history-exit-audit-chain-rev1/rationale-review-queue.json';q=load(qpath);text_to_i={x['text']:i for i,x in enumerate(q['rows'])}
ipath=P/'campaign3-history-source-roles-rev171/index.json';ix=load(ipath);roles={x['path']:x for x in ix['roleAssignments']}
rows=[];sources=[];supports=set();transitions=[];previous={}
for rev in range(1,112):
 path=P/f'CAMPAIGN3_EXIT_AUDIT_REV{rev}.json';v=load(path);sources.append(ref(path))
 for fi in [5,6,12]:
  f=v['brief']['families'][fi];assert f['status']=='PARTIAL'
  entries=[('FAMILY-'+f['family'],f['rationale'],f['status'],f'/brief/families/{fi}/rationale')]
  for j,c in enumerate(f['clauses']):
   entries.append((c['id'],c['rationale'],c['status'],f'/brief/families/{fi}/clauses/{j}/rationale'));supports.update(c['evidence'])
  for subject,text,status,pointer in entries:
   qi=text_to_i[text];assert qi in judgments
   rows.append(dict(revision=rev,pointer=pointer,subject=subject,status=status,queueIndex=qi))
   if previous.get(subject)!=(text,status):transitions.append(dict(revision=rev,subject=subject,status=status,queueIndex=qi));previous[subject]=(text,status)
assert len(rows)==3219 and {x['queueIndex'] for x in rows}==set(judgments)
for i in judgments:
 assert {(x['source'],x['pointer']) for x in q['rows'][i]['occurrences']}=={(sources[x['revision']-1]['path'],x['pointer']) for x in rows if x['queueIndex']==i}
support_rows=[];gaps=[]
for path in sorted(supports):
 r=roles.get(path)
 if r:
  for e in r['evidence']:assert ref(e['path'])==e
  support_rows.append(dict(path=path,frozenSha256=r['sha256'],role=r['category'],reviews=r['evidence']))
 else:
  assert path in ix['unassignedCandidatePaths'];gaps.append(path)
prior=[P/'campaign3-history-exit-corpus-rationales-rev1/review.json',P/'campaign3-history-exit-belief-agency-rev1/review.json']
save('occurrences.json',dict(sources=sources,rows=rows,transitions=transitions))
save('review.json',dict(status='THREE FAMILY RATIONALE CHAINS REVIEWED; WHOLE SOURCE ADEQUACY OPEN',checker=ref(__file__),sourceIndex=ref(ipath),queue=ref(qpath),priorReviews=[ref(x) for x in prior],occurrences=ref(O/'occurrences.json'),judgments=[dict(queueIndex=i,text=q['rows'][i]['text'],disposition=judgments[i]) for i in sorted(judgments)],supports=support_rows,unassignedSupports=gaps,coverage=dict(texts=18,occurrences=3219,families=3,clauses=26,originalQueueReviewed=61,originalQueueRemaining=120,sourceRolesPromoted=0),limits=['Family PARTIAL is compatible with separate bounded clause witnesses and must not be silently normalized to integrated family qualification.','Historical public-setup wording is not evidence that later component-only additions received native admission; preserve the unmet integration boundary.','Current experiment limitations refer to each original cited profile; later biology or chosen-reappraisal results do not rewrite earlier receipts.','No new runtime replay, tests, build, law, verdict or corpus freshness. Source reviews retain exact historical/fresh distinctions.','Other family rationale texts, sourceText, schema prose, inherited supports and independent source adequacy remain pending; SourceREV171 unchanged and HQ012 unstarted.'],obligations=['RO-C3-019','RO-C3-020','RO-C3-021']))
assert all(ref(s['path'])==s for s in sources)
save('check.json',dict(status='PASS; SCOPED SEMANTIC ACCOUNTING',review=ref(O/'review.json'),occurrences=ref(O/'occurrences.json'),texts=18,occurrencesCount=3219,remainingQueueTexts=120,originalSnapshotsUnchanged=True,sourceRolesPromoted=0,unassignedSupports=gaps))
assert all(x.stat().st_size<50000000 for x in O.iterdir())
print(json.dumps(load(O/'check.json')))
