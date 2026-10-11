from pathlib import Path
import hashlib,json,re
P=Path('docs/planning');B=P/'campaign3-history-universe-rev1';O=P/'campaign3-history-exit-markdown-rev1';O.mkdir(exist_ok=True)
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def save(name,v):
 p=O/name
 if p.exists():assert load(p)==v
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
path='docs/planning/CAMPAIGN3_EXIT_AUDIT_2026_09_21.md';source=ref(path);entries={x['path']:x for x in load(B/'manifest.json')['entries']};assert source['sha256']==entries[path]['sha256']
ip=P/'campaign3-history-source-roles-rev171/index.json';ix=load(ip);assert path in ix['unassignedCandidatePaths']
lines=Path(path).read_text(encoding='utf-8-sig').splitlines();assert len(lines)==1295
pre_path=P/'campaign3-history-exit-predecessor-summaries-rev1/review.json';pre=load(pre_path)
pred={int(re.search(r'REV(\d+)',r['source']['path'])[1]):r for r in pre['rows']}
refs=[pre_path,P/'campaign3-history-exit-identity-longitudinal-rev1/rationale-union-check.json',P/'campaign3-history-exit-authority-quotes-rev1/review.json',P/'campaign3-history-ga-memory-decisions-rev1/review.json',P/'campaign3-history-ga-graph-decisions-rev1/review.json']
common='Historical summary of scoped evidence, not a fresh runtime/test/build execution or complete campaign qualification. Preserve failed cohorts, comparator equalities, actual public/component boundaries and dated counters. Later exact qualifications supersede missing-witness claims only in their named scope; current RO019 ACTIVE and RO021 CONDITIONAL-but-mandatory/unsatisfied. No new architecture reduction or permanent state-root inventory.'
front=[
(1,7,'HISTORICAL REPORT SCOPE','Dated documentation/evidence audit; NOT EXIT-READY. Completion of bounded domains does not mean complete Campaign3. No unimplemented mechanism is labeled executed failure.'),
(8,40,'NORMATIVE COVERAGE AND EVIDENCE DISCIPLINE','Keep21 corpus members,15 families and complete compound requirements. Prior scope is not fresh rerun; missing or blocked proof is not FAIL. Selected historical log sections and discovered reports do not establish all-history adequacy.'),
(41,72,'DATED CORPUS COVERAGE','Original11 bounded/3 prior/6 partial/1 blocked dispositions are historical REV1 scope. Seven later exact comparisons supersede gaps without rewriting earlier evidence. GA actual0.28 runs and0.29 promotion remain separate.'),
(73,106,'SCOPED MATERIAL FINDINGS AND OWNERS','Preserve orphan normalization, response ceiling, quantization, SameDistance positional nonqualification, graph-only influence, scalar censoring, diagnostic competence, failed REL/LONG cohorts and historical hypothesis status. Earlier RO008/009/018 ACTIVE labels are dated routing; exact later qualifications do not remove broader conditional limits. Prior resolved time partition and prohibited leakage controls are not current defects.'),
(107,127,'REDUCTION ASSUMPTIONS AND REOPEN CONDITIONS','Derived representation does not erase semantic ownership. Direct zero-hop is once and independent of persistent graph; orphan removal requires incoming/outgoing exactly zero and no payload after complete owner batch. Graph/episode coupled deletion fails; equal winners do not imply laws equal. WORK/HABIT/REL derivations retain full safe journals. LONG equality is fixed-query/horizon while detail differs. Physical storage sharing is not prohibited by one destructive shared-slot control. Later body comparison and affect scalar tests supersede missing comparison only; no universal scalar necessity.'),
(128,147,'NORTH STAR TRANSFER CONSTRAINTS','Preserve truth/evidence/belief/appraisal, unknown/negative/neutral/no-opportunity, memory pipeline distinctions, evidence/motive/reason roles, noncommand affect, retained/accessed goal, actual competence/belief, private/person/history and learned availability/expectation. These are semantic constraints, not mandatory distinct objects or final equations.'),
(148,191,'HISTORICAL WORK ORDER AND FINAL GATE','LEARN-first and later risk-ranked sequence is dated routing, now completed in bounded scope. External review adds mechanical evidence-universe and material-finding reconciliation gate, not permission to infer completeness from registry counts. Final gate remains unsatisfied; no automatic Phase4 ranking or exit.')]
sections=[dict(startLine=a,endLine=b,role=role,judgment=note+' '+common) for a,b,role,note in front]
heads=[i+1 for i,l in enumerate(lines) if i+1>=192 and re.match(r'^#{2,3} ',l)]
for i,start in enumerate(heads):
 end=(heads[i+1]-1 if i+1<len(heads) else len(lines));body='\n'.join(lines[start-1:end]);head=lines[start-1]
 revision={192:3,202:4,211:5}.get(start)
 if revision is None:
  m=re.search(r'(?:Audit|/\s*)?REV(\d+)',head) or re.search(r'AuditREV(\d+)',body)
  if not m:m=re.search(r'REV(\d+)',body)
  assert m,(start,head);revision=int(m[1])
 # The historical prefix uses explicit revision headings; two date-only routing headings carry AuditREV in body.
 assert 3<=revision<=111
 snapshot=P/f'CAMPAIGN3_EXIT_AUDIT_REV{revision}.json';v=load(snapshot)
 semantic=pred[revision if revision<=80 else revision+1]['judgment'] if revision<111 else 'Regulatory comparison rejects body-only reduction while ScalarThreat and earlier ScalarUncontrolled succeed; no psychological vector necessity.'
 if start==645:assert revision==55
 sections.append(dict(startLine=start,endLine=end,heading=head,revision=revision,snapshot=ref(snapshot),role='DATED FORWARD ROUTING / QUALIFICATION OR DEVELOPMENT SUMMARY',judgment=semantic+' '+common))
assert sections[0]['startLine']==1 and sections[-1]['endLine']==1295
for a,b in zip(sections,sections[1:]):assert a['endLine']+1==b['startLine']
rows=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source']!=path:continue
  assert u['sourceSha256']==source['sha256'];matches=[(i,s) for i,s in enumerate(sections) if s['startLine']<=u['location']['startLine'] and u['location']['endLine']<=s['endLine']];assert len(matches)==1,u['location']
  i,s=matches[0];rows.append(dict(occurrenceId=u['id'],source=path,sourceSha256=source['sha256'],location=u['location'],text=u['text'],role='NARRATIVE AUTHORITY/FINDING',section=i,judgment=s['judgment']))
assert len({r['occurrenceId'] for r in rows})==len(rows)
note='Complete1295-line historical audit report reviewed. Original scope/reduction tables remain dated; appended checkpoints do not imply exhaustive chronology, fresh execution or joint family qualification. See explicit section dispositions, rationale union, exact authority bindings and predecessor temporal scope. RO021 ACTIVE at original line727 is corrected to canonical CONDITIONAL at738; both preserve mandatory unsatisfied gate. Final regulatory heading qualifies the comparison that defeats body-only reduction, not acceptance of that reduction. Old sessions86267/36191 are historical handles superseded by finished-job text, never current process evidence.'
role=dict(**source,role='WHOLE HISTORICAL EXIT-AUDIT NARRATIVE; SCOPED CLAIMS AND SUPERSESSIONS',judgment=note,acceptanceChain=[ref(x) for x in refs])
save('review.json',dict(status='SHARED EXIT-AUDIT MARKDOWN RECONCILED; HQ011 OPEN',sourceRoles=[role],sections=sections,rows=rows,preservedArtifacts=[],stringLeaves=0,limits=[common,'The report jumps from early REV5 forward updates to REV20 routing; it is not an exhaustive per-revision log. All111 JSON snapshots retain separate review and source identities.','Supporting sources are not accepted transitively. Twenty-one rationale-union support paths remain unassigned; inventory provenance and independent adequacy remain open.','No runtime simulation, test/build, new verdict, law selection, corpus freshness or Campaign3 exit claim.'],obligations=['RO-C3-019','RO-C3-020','RO-C3-021']))
save('check.json',dict(status='PASS; WHOLE MARKDOWN ROLE ONLY',sources=1,originalNarrativeOccurrences=len(rows),originalBackingOccurrences=0,stringLeaves=0,recoveredArtifacts=0,lines=1295,sections=len(sections),checker=ref(__file__)))
assert ref(path)==source
print(json.dumps(load(O/'check.json')))
