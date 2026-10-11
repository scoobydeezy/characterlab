from pathlib import Path
import json,hashlib,subprocess
P=Path('docs/planning');O=P/'campaign3-history-provenance-correction-rev1';O.mkdir(exist_ok=True)
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def save(p,v):
 if p.exists():assert load(p)==v
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
pin='95e93866146fafcde25fa59f7f60ab62c9384f4a';rel='Docs/CharacterLabMathematicalReference.md';copy=P/'campaign3-history-citation-review-rev1/VivariumMathematicalReference.md'
ledger=Path('docs/formal/FORMULA_INTAKE_LEDGER.md');erratum=Path('docs/formal/FORMULA_SOURCE_PROVENANCE_ERRATUM.md')
paths=['campaign3-history-hq009-rev1/search.json','campaign3-history-hq009-rev1/review.json','campaign3-history-formula-review-rev1/review.json','campaign3-history-intake-crosswalk-rev1/review.json','campaign3-history-external-formulas-rev1/review.json','campaign3-history-phase3-plan-rev1/review.json','CAMPAIGN3_FINAL_HISTORY_GATE.md','HISTORY_AUTHORITY_RECONCILIATION_READINESS.md']
inputs=[ref(P/x) for x in paths];old=load(P/paths[1]);formula=load(P/paths[2]);cross=load(P/paths[3]);supp=load(P/paths[4]);plan=load(P/paths[5]);assert len(old['references'])==5
assert ref(copy)==supp['source'];assert copy.stat().st_size==31643
assert ref(ledger)['sha256']==formula['sourceAuthority']['sha256'];assert len(formula['records'])==34 and len(cross['rows'])==11 and len(supp['rows'])==343
assert len({r['occurrenceId'] for r in formula['records']})==34
assert len({r['occurrenceId'] for r in supp['rows']})==343
sourceLines=copy.read_text(encoding='utf-8-sig').splitlines(keepends=True)
for r in supp['rows']:
 assert r['sourceSha256']==ref(copy)['sha256']
 loc=r['location'];assert ''.join(sourceLines[loc['startLine']-1:loc['endLine']])==r['text']
assert {n for r in supp['rows'] for n in range(r['location']['startLine'],r['location']['endLine']+1)}=={n for n,line in enumerate(sourceLines,1) if line.strip()}
ledgerLines=ledger.read_text(encoding='utf-8-sig').splitlines(keepends=True)
for r in cross['rows']:
 s=r['source'];assert s['sha256']==ref(ledger)['sha256'] and ''.join(ledgerLines[s['startLine']-1:s['endLine']])==s['text']
assert sorted(r['source']['startLine'] for r in cross['rows'])==list(range(13,24))
assert any('Missing claude/characterlab-research-log.md' in r['judgment'] for r in plan['scopeFindings'])
probes=[];capture=O/'current-source-check.json'
if capture.exists():observed=load(capture)
else:
 repo=Path('../vivarium').resolve()
 for args in [['cat-file','-t',pin],['show',pin+':'+rel],['status','--porcelain','--',rel]]:
  cmd=['git','-c','safe.directory='+repo.as_posix(),*args];r=subprocess.run(cmd,cwd=repo,capture_output=True,text=True)
  assert r.returncode==(128 if args[0]=='show' else 0)
  probes.append(dict(args=cmd,cwd=repo.as_posix(),exitCode=r.returncode,stdout=r.stdout,stderr=r.stderr))
 current=repo/rel;assert current.read_bytes()==copy.read_bytes()
 observed=dict(probes=probes,currentWorkingCopy=ref(current),retainedCopy=ref(copy),limits=['Fresh checks confirm current bytes and exact pinned path only;the earlier broader local search is reused,not freshly repeated. No remote/global/unreachable-object recovery or proof of historical absence.'])
 save(capture,observed)
assert observed['retainedCopy']==ref(copy)
assert observed['probes'][0]['stdout'].strip()=='commit' and observed['probes'][1]['exitCode']==128
assert 'not in' in observed['probes'][1]['stderr'];assert observed['probes'][2]['stdout'].strip().startswith('??')
rows=[]
for x in old['references']:
 legacy=x['raw']=='claude/characterlab-research-log.md';pinned=x['source']=='docs/formal/FORMULA_INTAKE_LEDGER.md'
 rows.append(dict(original=x,successorDisposition='UNLOCATED LEGACY SOURCE; UNKNOWN CONTENT NOT REPLACED' if legacy else 'CURRENT CITATION CORRECTED; HISTORICAL IDENTITY UNVERIFIED' if pinned else 'CURRENT INVENTORY IDENTIFIED; HISTORICAL IDENTITY UNVERIFIED',presentComparison=None if legacy else ref(copy),authorityCorrection=None if legacy else ref(erratum),blockedClaim='Historical equality or complete recovery of missing findings',obligation='RO-C3-021'))
v=dict(status='CORRECT-FORWARD CURRENT FORMULA CITATION; HISTORICAL IDENTITY AND LEGACY LOG OPEN',checker=ref(__file__),erratum=ref(erratum),inputs=inputs,currentCheck=ref(capture),originalLedger=ref(ledger),references=rows,materialJoins=dict(ledgerOccurrences=[r['occurrenceId'] for r in formula['records']],intakeRows=[dict(source=r['source'],disposition=r['disposition'],contractOrScope=r['contractOrScope'],reopenOrRemaining=r['reopenOrRemaining']) for r in cross['rows']],supplementalOccurrences=[r['occurrenceId'] for r in supp['rows']],supplementalTopics=sorted({r['topic'] for r in supp['rows']})),preservedLimits=['MATH002 coefficient convention;MATH003 fourth moments;MATH004 covariance PSD.','Row-factor orientation and threshold rearm versus selected/executed Rest remain conditional.','No blanket legacy formula adoption from bounded domain qualification.','The missing log is not replaced by reference/RESEARCH.md;unexecuted plan status does not waive unknown findings.','Independent final authority/source adequacy remains open. No original source-role/occurrence denominator change or corpus promotion.'],obligations=['RO-C3-010','RO-C3-019','RO-C3-020','RO-C3-021'])
save(O/'review.json',v);c=dict(status='PASS;CURRENT CITATION CORRECTED ONLY',originalReferences=5,ledgerOccurrences=34,intakeRows=11,supplementalOccurrences=343,supplementalTopics=len(v['materialJoins']['supplementalTopics']),freshGitProbes=3,sourceIndexUnchanged='REV169',review=ref(O/'review.json'),checker=ref(__file__))
save(O/'check.json',c);print(json.dumps(c))
