from pathlib import Path
import collections,hashlib,json,re
P=Path('docs/planning');O=P/'campaign3-history-exit-authority-quotes-rev1';O.mkdir(exist_ok=True)
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def digest(b):return hashlib.sha256(b).hexdigest()
def ref(p):return dict(path=Path(p).as_posix(),sha256=digest(Path(p).read_bytes()))
def save(name,v):
 p=O/name
 if p.exists():assert load(p)==v
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
ip=P/'campaign3-history-source-roles-rev171/index.json';ix=load(ip);roles={r['path']:r for r in ix['roleAssignments']}
last=load(P/'CAMPAIGN3_EXIT_AUDIT_REV111.json');quotes=[];bindings=[];sources=[];schemas=collections.defaultdict(lambda:dict(occurrences=0,values=set()));gates=[]
for kind,path,rows in [('corpus','docs/planning/PHENOMENON_CORPUS.md',last['corpus']['members']),('brief',last['brief']['source'],last['brief']['families'])]:
 role=roles[path];f=P/'campaign3-history-universe-rev1/sources'/path;assert ref(f)['sha256']==role['sha256'];text=f.read_text(encoding='utf-8-sig')
 for e in role['evidence']:assert ref(e['path'])==e
 bindings.append(dict(authority=path,frozenSource=ref(f),sourceRole=role['category'],reviewEvidence=role['evidence']))
 for i,row in enumerate(rows):
  base=f'/corpus/members/{i}' if kind=='corpus' else f'/brief/families/{i}'
  assert row['sourceText'] in text
  quotes.append(dict(pointer=base+'/sourceText',text=row['sourceText'],authority=path,sourceStartLine=text[:text.index(row['sourceText'])].count('\n')+1,role='QUOTED NORMATIVE REQUIREMENTS; NOT EXECUTION EVIDENCE'))
  for j,c in enumerate(row['clauses']):
   assert c['text'] in row['sourceText']
   quotes.append(dict(pointer=base+f'/clauses/{j}/text',text=c['text'],authority=path,sectionPointer=base+'/sourceText',role='EXACT NORMATIVE SUBCLAUSE; STATUS DOES NOT WAIVE COMPOUND REQUIREMENTS'))
assert len(quotes)==387
def at(v,pointer):
 for key in pointer.split('/')[1:]:v=v[int(key)] if isinstance(v,list) else v[key]
 return v
def walk(v,pointer=''):
 if isinstance(v,str):
  schema=re.sub(r'/\d+(?=/|$)','/*',pointer);schemas[schema]['occurrences']+=1;schemas[schema]['values'].add(v)
 elif isinstance(v,dict):
  for k,x in v.items():walk(x,pointer+'/'+k)
 elif isinstance(v,list):
  for i,x in enumerate(v):walk(x,pointer+'/'+str(i))
for rev in range(1,112):
 path=P/f'CAMPAIGN3_EXIT_AUDIT_REV{rev}.json';v=load(path);sources.append(dict(revision=rev,source=ref(path)))
 for quote in quotes:assert at(v,quote['pointer'])==quote['text']
 walk(v)
 gates.append(dict(revision=rev,publicWrapperGate=v.get('publicWrapperGate'),finalHistoricalGate=v.get('finalHistoricalGate')))
save('quotes.json',dict(authorities=bindings,snapshots=sources,quotes=quotes,occurrences=42957,interpretation='Repeated requirements retain authoritative source scope. Exact quotation is not satisfaction of the requirement; use separately reviewed bounded rationale/evidence and mandatory final gates.'))
metadata_judgments={
'scope':'Documentation coverage only; cannot assert behavioral execution or all-history completeness.',
'status':'QUALIFIED BOUNDED is experiment-scoped; ACCEPTED PRIOR SCOPE is inherited, not current rerun; PARTIAL/BLOCKED are coverage gaps, not executed failures; TRACKED marks preservation/reopen constraints. Fifteen PARTIAL summaries do not negate later exact bounded clauses.',
'authority':'Twenty-eight exact citation labels identify historical claim sources or explicit limitation controls. Names such as Campaign2 cognitive qualification or MEC/RET are not new verdicts, inferred execution or current authorization.',
'inventoryInspection':'Both labels assert historical inspection scope only. Selected reference sections are not the whole research log; coverage review does not imply fresh replay. Listed path/hash does not accept every referenced source or prove current source bytes.',
'finalHistoricalGate':'NOT SATISFIED blocks final exit but does not prohibit admitted bounded implementation. Historical LEARN-specific wording is narrower routing, not a waiver of the final gate.',
'publicWrapperGate':'ACTIVE blocks unrestricted public read/save claims until repair. CLOSED is limited to the exact49..54 producer inventories and corresponding factory scope; additions reopen extension checking. Checked publication may coexist with an open full prefix matrix. Historical54/57 does not certify current55/58.',
'identifiers':'Member/family/clause IDs, semantic versions, paths, digests, obligation IDs and report references are typed identity/routing metadata in this schema. Their exact occurrence remains necessary; they are not independent scientific findings.',
'predecessorDisposition':'PENDING semantic reconciliation of109 distinct predecessor summaries against exact prior revisions; prior chain check verified110 links only.',
'otherSources':'Shared1295-line Markdown report and21 union-identified support sources still require complete role review; quoted authority and rationale acceptance do not close them.'
}
schema_rows=[]
for path,data in sorted(schemas.items()):
 if path.endswith('/sourceText') or path.endswith('/text'):role='EXACT QUOTED AUTHORITY; THIS REVIEW'
 elif path.endswith('/rationale'):role='BOUND SEPARATELY BY RATIONALE UNION'
 elif path=='/predecessor/disposition':role='PENDING NARRATIVE REVIEW'
 elif path.endswith('/inspection'):role='HISTORICAL INSPECTION ASSERTION; NO TRANSITIVE ACCEPTANCE'
 elif path.startswith('/publicWrapperGate/') or path.startswith('/finalHistoricalGate/'):role='TIME-SCOPED GATE ANNOTATION'
 else:role='TYPED METADATA OR HISTORICAL STATUS/CITATION; SEE FIELD JUDGMENTS'
 schema_rows.append(dict(path=path,occurrences=data['occurrences'],uniqueValues=len(data['values']),role=role))
save('schema.json',dict(status='ALL STRING LEAVES ENUMERATED INCLUDING SHORT STRINGS; NOT ALL SEMANTICALLY CLOSED',fields=schema_rows,totalStringLeaves=sum(x['occurrences'] for x in schema_rows),gates=gates,metadataJudgments=metadata_judgments))
save('review.json',dict(status='QUOTED AUTHORITY AND GATE SCOPE RECONCILED; WHOLE SOURCE REVIEW OPEN',checker=ref(__file__),sourceIndex=ref(ip),quotes=ref(O/'quotes.json'),schema=ref(O/'schema.json'),rationaleUnion=ref(P/'campaign3-history-exit-identity-longitudinal-rev1/rationale-union-check.json'),normativeSections=36,normativeClauses=351,quotedOccurrences=42957,judgments=metadata_judgments,limits=['SourceText includes setup, interventions, trace, horizon and preservation obligations; a bounded status never reduces their compound requirements to an easy subclause. ADAPT not-passed intervention field remains explicit.','All strings, including fewer-than-three-word values, are counted by schema. Enumeration is not a materiality verdict or whole-source acceptance.','Exact sourceLine numbers are historical navigation metadata; this review binds content/section and current frozen-source line separately, not an execution trace.','Snapshot inventory paths/hashes remain historical commitments, not automatically verified current aliases or evidence of exhaustive original inspection.','No new simulation, tests/build, source-role promotion, corpus freshness, scientific verdict or obligation closure. HQ011 independent adequacy and HQ012 remain open.'],obligations=['RO-C3-019','RO-C3-020','RO-C3-021']))
assert all(ref(x['source']['path'])==x['source'] for x in sources)
save('check.json',dict(status='PASS; SCOPED QUOTE AND SCHEMA ACCOUNTING',review=ref(O/'review.json'),quotes=ref(O/'quotes.json'),schema=ref(O/'schema.json'),sections=36,clauses=351,quoteOccurrences=42957,stringSchemaPaths=len(schemas),shortStringsIncluded=True,sourceRolesPromoted=0))
assert all(x.stat().st_size<50000000 for x in O.iterdir())
print(json.dumps(load(O/'check.json')))
