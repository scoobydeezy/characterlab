from pathlib import Path
import json,hashlib,collections
P=Path('docs/planning');O=P/'campaign3-history-exit-identity-longitudinal-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
qpath=P/'campaign3-history-exit-audit-chain-rev1/rationale-review-queue.json';q=load(qpath)
expected={(r['source'],r['pointer']):x['text'] for x in q['rows'] for r in x['occurrences']}
assert len(expected)==18648
batches=['corpus-rationales','belief-agency','control-goals-communication','skill-social-relationships','body-need-affect','memory-habit','identity-longitudinal']
seen=collections.Counter();texts=set();receipts=[];gaps=set();extra=[]
for batch in batches:
 d=P/f'campaign3-history-exit-{batch}-rev1';review=load(d/'review.json');v=load(d/'occurrences.json')
 assert ref(d/'occurrences.json')==review['occurrences']
 receipts.append(ref(d/'review.json'));gaps.update(review.get('supportGaps',review.get('unassignedSupports',[])))
 for row in v['rows']:
  if batch=='corpus-rationales':
   source=v['snapshots'][row['revision']-1]['source'];text=v['texts'][row['rationaleId']]
  else:source=v['sources'][row['revision']-1];text=q['rows'][row['queueIndex']]['text']
  key=(source['path'],row['pointer'])
  if key in expected:
   assert text==expected[key];seen[key]+=1;texts.add(text)
  else:
   assert batch=='corpus-rationales' and '/clauses/' in row['pointer'];extra.append(key)
assert set(seen)==set(expected) and len(texts)==181 and len(extra)==24309 and len(set(extra))==24309
duplicates=[dict(source=k[0],pointer=k[1],reviews=n) for k,n in seen.items() if n>1]
assert len(duplicates)==17 and all(x['reviews']==2 and x['pointer']=='/brief/families/2/clauses/8/rationale' for x in duplicates)
for batch in batches:
 v=load(P/f'campaign3-history-exit-{batch}-rev1/occurrences.json')
 sources=[x['source'] for x in v['snapshots']] if batch=='corpus-rationales' else v['sources']
 assert all(ref(x['path'])==x for x in sources)
report=dict(status='PASS; ORIGINAL RATIONALE QUEUE SEMANTIC COVERAGE UNION VERIFIED',checker=ref(__file__),queue=ref(qpath),reviews=receipts,uniqueTexts=181,originalOccurrences=18648,reviewedOccurrenceRecords=sum(seen.values()),explicitReuse=duplicates,additionalCorpusClauseOccurrences=24309,unassignedSupportSources=sorted(gaps),limits=['This verifies the union of separately documented semantic judgments, not whole-source acceptance or independent scientific adequacy.','Original queue excludes sourceText, other schema prose and shared Markdown audit. These remain pending, as do the listed supporting source roles.','All111 original audit snapshots remain unchanged. No new verdict, runtime replay, law, native admission or Campaign3 exit qualification.'],obligations=['RO-C3-019','RO-C3-020','RO-C3-021'])
out=O/'rationale-union-check.json'
if out.exists():assert load(out)==report
else:out.write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
print(json.dumps(dict(status=report['status'],texts=181,occurrences=18648,reused=17,unassignedSupportSources=len(gaps))))
