from pathlib import Path
import json,hashlib
p=Path('docs/planning')
files=['src/campaign3/biologyPublicRuntime.ts','docs/planning/public-wrapper-quiescence-rev1/src/campaign3/biologyPublicRuntime.ts','docs/planning/public-wrapper-quiescence-rev1/PRESERVATION.json','scripts/check-biology-public-closure.mjs','scripts/check-preserved-public-wrapper-evidence.mjs','scripts/public-wrapper-preserved-source-loader.mjs','docs/planning/AFFECT_REGULATORY_PLAN_REV1.json']
finding={'status':'EXPLAINED; PRESERVED-SOURCE CHECK PASS','failedCommand':'node scripts/check-biology-public-closure.mjs','failure':'src/campaign3/biologyPublicRuntime.ts hash mismatch against historical closure','actual':'811c9a0d4f111c64a26e6f4e29da8c9c8113a5d685d2c10527f7083802b626f4','historicalExpected':'7d0f7b46b1b9d952e7a5fa0330ce87a012ac2d84a6da199b3dfe46c099177751','cause':'The historical biological qualification predates the accepted public-wrapper quiescence repair; its old source is retained in the dedicated preservation manifest. No production source changed in this affect experiment.','verifiedCommand':'node scripts/check-preserved-public-wrapper-evidence.mjs','verifiedExitCode':0,'scope':'Historical receipt/source verification only. Current native behavior is freshly verified by four AFFECT_REGULATORY native sentinels and16 restores, against source hashes frozen before execution. Do not rewrite the old checksum or count preserved receipts as new execution.','files':[{'path:f,'sha256':hashlib.sha256(Path(f).read_bytes()).hexdigest()} for f in files],'obligations':['RO-C3-019','RO-C3-021','RO-C3-022']}
path=p/'AFFECT_REGULATORY_HISTORICAL_CHECK_FINDING_REV1.json'
with path.open('x',encoding='utf-8',newline='\n') as f:f.write(json.dumps(finding,indent=2)+'\n')
registry=p/'RESEARCH_OBLIGATIONS.json';r=json.loads(registry.read_text(encoding='utf-8'));r['reportReviews'].append({'path':path.as_posix(),'obligations':finding['obligations']})
for o in r['obligations']:
 if o['id'] in finding['obligations']:o['evidence'].append(path.as_posix())
registry.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
current=p/'CURRENT.md'
with (p/'CAMPAIGN3_LOG.md').open('ab') as f:f.write(b'\n\n'+current.read_bytes())
current.write_text(current.read_text(encoding='utf-8')+'\nHistorical biology checksum requires the existing preserved-source checker; it passed.\nSee AFFECT_REGULATORY_HISTORICAL_CHECK_FINDING_REV1.json. Current native source is\nseparately frozen and exercised by the new regulatory experiment.\n',encoding='utf-8',newline='\n')
print('Historical checksum failure and successful preserved-source verification recorded; frozen receipts unchanged.')
