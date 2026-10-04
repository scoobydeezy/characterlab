"""Record the first inventory checkpoint without changing frozen evidence."""
from pathlib import Path
import json, hashlib
p=Path('docs/planning'); base=p/'campaign3-history-universe-rev1'
if (p/'CAMPAIGN3_HISTORY_ROOT_REVIEW_REV1.json').exists():
 raise SystemExit('Checkpoint already recorded; refuse to overwrite its review or append chronology twice.')
def read(f): return json.loads(f.read_text(encoding='utf-8-sig'))
def write(f,x): f.write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
def sha(f): return hashlib.sha256(f.read_bytes()).hexdigest()
m=read(base/'manifest.json'); entries={e['path']:e for e in m['entries']}
refs=read(base/'references.json')['references']; review=[]
memory_sources=['docs/formal/OPEN_DECISIONS.md','docs/planning/CORPUS_0_28_0_PRESERVED_AT_GA.md','docs/planning/PHENOMENON_CORPUS.md','docs/planning/SEAM_LEDGER.md','docs/planning/VERDICT_LEDGER.md','docs/planning/CAMPAIGN2_MEASUREMENT_MEMORY_RUNTIME_REVIEW.md']
target='docs/planning/campaign2-measurement-memory-model/FREEZE.json'
assert read(Path(target))['referenceDigest']=='3396fa9887e6bed02f3d0cb72344e11a6e0fb23859d330cc45f779f931d01df9'
for r in refs:
 if r['status'] not in ['MISSING','AMBIGUOUS']: continue
 row={**r,'sourceSha256':entries[r['source']]['sha256'],'disposition':'PENDING CONTEXTUAL RESOLUTION','obligation':'RO-C3-021'}
 if r['raw']=='FREEZE.json' and r['source'] in memory_sources:
  row.update(disposition='RESOLVED CITATION ONLY',resolvedTarget=target,targetSha256=entries[target]['sha256'],rationale='C2-MEM-PACK-002 closure context identifies the accepted memory model with digest3396fa9887e6bed02f3d0cb72344e11a6e0fb23859d330cc45f779f931d01df9. Runtime review also supplies an explicit packet link. This does not accept every claim in the citing document.')
 elif 'CharacterLabMathematicalReference.md' in r['raw']:
  row.update(disposition='EXTERNAL SOURCE ADMISSION PENDING',rationale='Vivarium formula inventory exists outside this frozen repository census. Intake cites commit95e93866146fafcde25fa59f7f60ab62c9384f4a; current existence does not prove those historical bytes. Inventory is a hypothesis source, not governing formula authority.')
 elif r['raw']=='claude/characterlab-research-log.md':
  row.update(disposition='LEGACY SOURCE UNLOCATED',rationale='Not found at the cited repository path. Superseded Phase3 implementation plan is retained as hypothesis; do not silently substitute reference/RESEARCH.md or erase this unresolved citation.')
 review.append(row)
assert len(review)==44
dev=p/'campaign3-history-inventory-development-rev1'
write(p/'CAMPAIGN3_HISTORY_ROOT_REVIEW_REV1.json',{'status':'PARTIAL ROOT AND CITATION REVIEW; SEMANTIC RECONCILIATION OPEN','manifestSha256':sha(base/'manifest.json'),'scope':'18 root authority roles recorded in manifest; no blanket acceptance of root claims or candidate documents. Six citation ambiguities resolved;38 remain pending, external or unlocated. All413894 extracted units remain semantically UNREVIEWED.','obligations':['RO-C3-019','RO-C3-021'],'references':review,'developmentFindings':[{'path':str(dev/'FINDING.json').replace('\\','/'),'sha256':sha(dev/'FINDING.json')},{'source':str(dev/'check-campaign3-history-inventory.mjs').replace('\\','/'),'sha256':sha(dev/'check-campaign3-history-inventory.mjs'),'failure':'First checker split lines only at LF and rejected an existing verbatim-log CRCRLF paragraph.','correction':'Use Python-equivalent line boundaries. Original log, snapshot and extracted units unchanged; all413894 exact source comparisons now pass.'}],'remaining':['Canonical source acceptance/supersession and universe adequacy review','Semantic disposition of marked and unmarked prose, including duplicates and non-findings','Remaining citation resolution and external source admission','Live post-cutoff delta review','Independent scientific adequacy review and final corpus/family/native-scope gates']})
checkpoint='''# Campaign3 historical inventory checkpoint — 2026-10-03

LOCAL DISPOSITION; counters **1508 /0**. No new verdict or owner ruling.
Campaign3 remains **NOT EXIT-READY**. AuditREV111 remains the latest coverage audit:
132 bounded clauses,106 verdicts,21 corpus members,15 families;54 producers/57 factories.

The frozen candidate universe contains11,373 files:1,063 Markdown documents and
10,310 JSON artifacts. Markdown snapshots retain exact original bytes; structured
artifacts remain hash-bound in place. Source authority is assigned only to18 root
document roles; remaining candidate acceptance/supersession is open. This is not yet
an accepted final canonical universe. Registry data did not drive selection or extraction.

Extraction retains413,894 source-located review units:119,284 marked and294,610
unmarked. These include repeated rows, quoted proposals and non-findings. All remain
semantically UNREVIEWED; counts are not a count of material research findings.
The independent checker validates exact text, locations, source hashes, stable IDs,
marked-subset membership and eight fault cases. Mechanical PASS is inventory-only.

Of44 missing/ambiguous lexical citations, six memory FREEZE references now resolve
to their original accepted packet.38 remain pending, including four external formula
references and one unlocated legacy log. Wildcard fragments and abbreviated packet
names require contextual resolution; they are not automatically missing evidence.
See CAMPAIGN3_HISTORY_ROOT_REVIEW_REV1.json for exact occurrences and scoped rationale.

Preserve both development failures: pre-freeze Python parse failure and first-checker
CRCRLF line-boundary mismatch. Corrected methods pass without rewriting historical
log bytes or original extraction. No production code or experiment changed.

Evidence: campaign3-history-universe-rev1/manifest.json and extraction.json;
CAMPAIGN3_HISTORY_INVENTORY_CHECK_REV1.json; formal protocol
../formal/CAMPAIGN3_HISTORY_UNIVERSE_PROTOCOL_0_1.md. RO-C3-019 owns final coverage;
RO-C3-021 owns the still-unsatisfied historical gate. No obligation closes here.

Next: resolve remaining citations and source acceptance, then semantically reconcile
occurrences to scoped obligations/resolutions. Review post-cutoff changes separately;
a valid frozen snapshot does not certify live freshness. Final corpus/family/native
scope review and independent scientific adequacy remain mandatory before exit.
'''
(p/'CAMPAIGN3_HISTORY_INVENTORY_CHECKPOINT.md').write_text(checkpoint,encoding='utf-8')
r=read(p/'RESEARCH_OBLIGATIONS.json')
paths=['docs/formal/CAMPAIGN3_HISTORY_UNIVERSE_PROTOCOL_0_1.md','docs/planning/CAMPAIGN3_HISTORY_INVENTORY_CHECKPOINT.md','docs/planning/CAMPAIGN3_HISTORY_ROOT_REVIEW_REV1.json','docs/planning/CAMPAIGN3_HISTORY_INVENTORY_CHECK_REV1.json','docs/planning/campaign3-history-universe-rev1/manifest.json','docs/planning/campaign3-history-universe-rev1/extraction.json','docs/planning/campaign3-history-inventory-development-rev1/FINDING.json']
for path in paths:
 r['reportReviews'].append({'path':path,'obligations':['RO-C3-019','RO-C3-021']})
 for o in r['obligations']:
  if o['id'] in ['RO-C3-019','RO-C3-021']: o['evidence'].append(path)
write(p/'RESEARCH_OBLIGATIONS.json',r)
current=p/'CURRENT.md'; old=current.read_bytes()
with (p/'CAMPAIGN3_LOG.md').open('ab') as f: f.write(b'\n\n'); f.write(old)
head=old.decode('utf-8').split('VER-C3-AFFECT-REGULATORY-001:')[0]
route='''Historical candidate inventory frozen; independent source-text checks PASS.
11,373 files/413,894 review units; all semantic dispositions OPEN. Six of44 lexical
citation issues resolved;38 pending. No new verdict; AuditREV111 unchanged.
Start CAMPAIGN3_HISTORY_INVENTORY_CHECKPOINT.md and
CAMPAIGN3_HISTORY_ROOT_REVIEW_REV1.json. Next source acceptance/citation resolution,
semantic reconciliation, live-delta review and final corpus/family/native-scope gates.
RO019 ACTIVE;RO021 mandatory historical gate UNSATISFIED;RO022 CLOSED. No owner ruling.
All prior runtime jobs finished; do not relaunch matrices for this documentation audit.
Do not begin Campaign4 ranking or declare Campaign3 PASS from bounded clause coverage.
'''
current.write_text(head+route,encoding='utf-8')
a=Path('AGENTS.md'); text=a.read_text(encoding='utf-8'); needle='**Current routing (2026-10-03):**'
pos=text.index(needle); text=text[:pos]+'**Current routing (2026-10-03):** Historical inventory checkpoint; no new verdict.\n'+route+'\n**Prior routing (2026-10-03):**'+text[pos+len(needle):]; a.write_text(text,encoding='utf-8')
