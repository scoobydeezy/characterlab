"""Reconcile attribution and interoceptive source component limits."""
from pathlib import Path
import json,hashlib
P=Path('docs/planning');B=P/'campaign3-history-universe-rev1';O=P/'campaign3-history-corpus-intake-history-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def save(n,v):
 p=O/n
 if p.exists():assert load(p)==v,p
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
notes={'docs/planning/CORPUS_0_28_0_SUCCESSOR_MANIFEST.md': 'Executed successor plan, not current corpus authority. The 21 members consist of ten preserved identities and eleven additions. All eleven additions were partial or blocked (three partial, eight blocked), contrary to the closing ten-of-eleven sentence. Membership is an obligation commitment, not behavioral success. Typed ATTN and PHEN-ATTN namespaces do not justify skipping an ordinal. The digest commits to canonical member identity/version records, not proof that each prose obligation passes. The verdict-before-digest statement is a historical report, not a timestamp independently established by present hashes. Old PREPARED and no-modification language is explicitly superseded by the executed header. The 13-family coverage sentence mixes named membership with dedicated executable fixtures and must not replace current family/clauses audit. Preserve all required comparisons, including permitted COMMIT witness, BODY three-model comparison, cross-family shared facts and attention footprint/probe.', 'docs/planning/CAMPAIGN3_CORPUS_INTAKE_DRAFT.md': 'Historical intake superseded as governing obligation text by the corpus. Correct the ten-of-eleven summary to all eleven, three partial and eight blocked; historical blocked statuses do not override subsequent bounded verdicts. ATTENTION separates admission, selection, encoding and later access; BODY separates kinetics, observer evidence and motive. BELIEF separates fixed truth, admitted evidence, goal context and opportunity; AFFECT factors are independently manipulable conditions, not mandatory stored meters or product law. WORKSPACE requires actual excess candidates and distinguishes retained from accessible intentions. SKILL separates competence, belief, intent and impairment. SOCIAL requires independent observers and permitted correction, never shared private knowledge. MULTISOURCE requires genuinely different families, shared versus independent evidence and serious receiving-law alternatives; task IDs do not establish diversity. HABIT needs acquired history matched against current belief/body/identity, without assuming a persistent root. RELATIONSHIP compares matched person estimates and distinct dyadic history, without treating rupture as grief. LONGITUDINAL requires actual acquisition and interference over a bounded horizon, not authored learned state or lifelong equivalence. Missing future planning and prospective-goal clauses remain requirements; intake alone cannot qualify them.'}
ip=P/'campaign3-history-source-roles-rev259/index.json';ix=load(ip);entries={e['path']:e for e in load(B/'manifest.json')['entries']}
chain=[ref(P/n) for n in ['CORPUS_0_28_0_PROMOTION_REV1.json','CORPUS_0_28_0_PRESERVED_AT_GA.md','PHENOMENON_CORPUS.md','CAMPAIGN3_FINAL_HISTORY_GATE.md']]
sources=[]
for p,n in notes.items():
 assert p in ix['unassignedCandidatePaths'] and ref(p)['sha256']==entries[p]['sha256']
 sources.append(dict(**ref(p),role='HISTORICAL CORPUS INTAKE WITH EXPLICIT LIMITS',judgment=n,acceptanceChain=chain))
rows=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in notes:continue
  assert u['sourceSha256']==entries[u['source']]['sha256']
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],category='NARRATIVE'))
assert len({r['occurrenceId'] for r in rows})==len(rows)
receipt=load(P/'CORPUS_0_28_0_PROMOTION_REV1.json')
assert len(receipt['promoted'])==11
assert sum(x['statusAtPromotion'].startswith('PARTIAL') for x in receipt['promoted'])==3
assert sum(x['statusAtPromotion'].startswith('BLOCKED') for x in receipt['promoted'])==8
assert hashlib.sha256(bytes.fromhex(receipt['canonicalHex'])).hexdigest()==receipt['corpusManifestDigest']
assert hashlib.sha256(bytes.fromhex(receipt['priorCommitment']['canonicalHex'])).hexdigest()==receipt['priorCommitment']['digest']
O.mkdir(exist_ok=True)
save('review.json',dict(status='TWO CORPUS INTAKE HISTORY SOURCES RECONCILED',checker=ref(__file__),sourceIndex=ref(ip),sourceRoles=sources,rows=rows,preservedArtifacts=[],limits=['Planning and captured hashes do not establish completed replay; later qualifications preserve component/native distinctions.','Later bounded completion supersedes routing only within named profiles, not all ideal-loop phenomena.','No runtime/test/build rerun, source gap closure, law/model/verdict/corpus/obligation status change or historical adequacy claim.'],obligations=['RO-C3-008','RO-C3-019','RO-C3-020','RO-C3-021']))
save('check.json',dict(status='PASS CORPUS INTAKE HISTORY',sources=len(sources),originalNarrativeOccurrences=len(rows),originalBackingOccurrences=0,review=ref(O/'review.json')))
print(json.dumps(load(O/'check.json')))
