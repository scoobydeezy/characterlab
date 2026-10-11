from pathlib import Path
import hashlib,json
P=Path('docs/planning');O=P/'campaign3-history-exit-skill-social-relationships-rev1';O.mkdir(exist_ok=True)
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def save(name,v):
 p=O/name
 if p.exists():assert load(p)==v
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
judgments={83: 'Original relationship history and rupture do not establish independent dimensions, grief, attribution correction or reliance learning. Later experiments address distinct bounded gaps.', 84: 'Assistance, competence, commitment and threat support four derived appraisal proxies and prospective distributions. They do not establish universal emotion axes or actual enacted behavior; preserve quantization and participant-field failures.', 85: 'Later event-local reports can change attribution while original harm and past appraisal remain. False exculpatory reports can reduce accuracy; correction is not causal discovery, forgiveness or repair.', 86: 'Own admitted commitment outcomes change prospective reliance through the existing mean. Known mixed and unknown can both yield1/2 without state equivalence. No new trust law, chosen delegation or execution.', 87: 'Feature familiarity and own-outcome valence use independent identity/history channels. Similarity is not identity and cannot transfer another target history. Projection independence is not whole-record equality.', 88: 'Perceived dependence and missing contact support a bounded attachment witness. Preserve reliable-satisfier alternatives and candidate two-episode Bond scaling. Prospective probes are not distress, care or search execution.', 89: 'Prior admitted promise, observed failure, incident intent/control and present willingness remain distinct. Later false revision remains possible. Target promise/action generation, moral entitlement, repair and enacted response are not established.', 90: 'Acquired history, present absence, future-contact belief and practical utility separate prospective loss/reunion responses. Report0/half/1 is uncalibrated and false correction can mislead. Ten separate clause witnesses do not qualify joint relationships or enacted mourning.', 133: 'SKILL separates competence, performance belief and impairment; LONG adds sampled rust and execution after actual episode loss. Neither diagnostic competence nor a performance mean is safe latent competence knowledge. Single-option Auto is not confidence-sensitive choice. Full/Compact equality is limited to fixed projections and horizon, not memory detail.', 142: 'Two observers with controlled commitment evidence do not establish general person-state inference, recursive beliefs or hearsay trust. Later independent profiles add bounded coverage.', 143: 'ATTRIBUTED keeps own, actual target and attributed beliefs distinct and uses finite second-order belief in actual explanation choice. Corrected report-only contrast fixes whole target state by disabling both deliveries; earlier probe-only evidence was insufficient. No recursive mentalizing or natural comprehension.', 144: 'Final social summary combines separate bounded profiles. Stable authored policy is not earned personality; appraisal130 follows intent70. Fear-as-guilt weights are uncalibrated; inferred goals use a fixed catalogue and ordinary strategy. Hearsay visible-ticket dedup is not hidden correlation detection; fallible DirectPriority is not truth access or learned trust. No joint social integration or downstream observer action is inferred.', 145: 'Adding fear-as-guilt qualifies context-relative mistaken attribution and later correction only. Private fear is controlled and an Oracle is a violating comparator. No guilt emotion, moral identity, natural incident recognition or calibrated probability.', 146: 'PERSON-GOAL adds adopted desired state versus ordinary route, failed attempts and later correction. Known catalogue and candidate9/10 weight do not establish inverse planning, learned affordances, fulfillment or observer action.', 147: 'PERSONSTATE adds mixed conduct impression and fallible current-intent inference under authored default policy. Corrected0.2 consequence appraisal130 resolves earlier future-choice timing error at50; full later-view privacy replaces terminal-only proof. Later fear/goal/hearsay additions remain separate.'}
qpath=P/'campaign3-history-exit-audit-chain-rev1/rationale-review-queue.json';q=load(qpath);text_to_i={x['text']:i for i,x in enumerate(q['rows'])}
ipath=P/'campaign3-history-source-roles-rev171/index.json';ix=load(ipath);roles={x['path']:x for x in ix['roleAssignments']}
rows=[];sources=[];supports=set();transitions=[];previous={}
for rev in range(1,112):
 path=P/f'CAMPAIGN3_EXIT_AUDIT_REV{rev}.json';v=load(path);sources.append(ref(path))
 for fi in [7,9,10]:
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
prior=[P/'campaign3-history-exit-corpus-rationales-rev1/review.json',P/'campaign3-history-exit-belief-agency-rev1/review.json',P/'campaign3-history-exit-control-goals-communication-rev1/review.json']
save('occurrences.json',dict(sources=sources,rows=rows,transitions=transitions))
save('review.json',dict(status='THREE FAMILY RATIONALE CHAINS REVIEWED; WHOLE SOURCE ADEQUACY OPEN',checker=ref(__file__),sourceIndex=ref(ipath),queue=ref(qpath),priorReviews=[ref(x) for x in prior],occurrences=ref(O/'occurrences.json'),judgments=[dict(queueIndex=i,text=q['rows'][i]['text'],disposition=judgments[i]) for i in sorted(judgments)],supports=support_rows,unassignedSupports=gaps,coverage=dict(texts=15,occurrences=3219,families=3,clauses=26,originalQueueReviewed=76,originalQueueRemaining=105,sourceRolesPromoted=0),limits=['Family PARTIAL is compatible with separate bounded clause witnesses and must not be silently normalized to integrated family qualification.','Prospective distributions in relationship profiles are not sampled intent, executed delegation, enacted repair or mourning. Preserve each cited receipt scope.','Authored policy, diagnostic competence, feature familiarity and controlled reports do not become earned personality, character knowledge, identity or natural recognition through summary reuse.','No new runtime replay, tests, build, law, verdict or corpus freshness. Source reviews retain exact historical/fresh distinctions.','Other family rationale texts, sourceText, schema prose, inherited supports and independent source adequacy remain pending; SourceREV171 unchanged and HQ012 unstarted.'],obligations=['RO-C3-019','RO-C3-020','RO-C3-021']))
assert all(ref(s['path'])==s for s in sources)
save('check.json',dict(status='PASS; SCOPED SEMANTIC ACCOUNTING',review=ref(O/'review.json'),occurrences=ref(O/'occurrences.json'),texts=15,occurrencesCount=3219,remainingQueueTexts=105,originalSnapshotsUnchanged=True,sourceRolesPromoted=0,unassignedSupports=gaps))
assert all(x.stat().st_size<50000000 for x in O.iterdir())
print(json.dumps(load(O/'check.json')))
