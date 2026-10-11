"""Preserve exact newly recovered identities; content adequacy remains separate."""
from pathlib import Path
import json,hashlib
P=Path('docs/planning');O=P/'campaign3-history-git-object-recovery-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
r=load(O/'review.json');c=load(O/'check.json');assert c['recoveredPairs']==21 and c['remainingPairs']==208
files={m['exactBytes']['path']:m['exactBytes']['sha256'] for m in r['matches']}
assert len(files)==21
for path,h in files.items():assert hashlib.sha256(Path(path).read_bytes()).hexdigest()==h
assert all(p.stat().st_size<50_000_000 for p in O.rglob('*') if p.is_file())
cp=P/'CAMPAIGN3_HISTORY_GIT_OBJECT_RECOVERY_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Exact Git object recovery — 2026-10-11

**LOCAL DISPOSITION — HQ-011 continues; no owner ruling. Counters1519 /0.**

Filename-independent read-only Git object search recovers21 previously unresolved
path/hash targets.24,581 objects were enumerated, including objects Git can expose
without a reachable filename.21,856 blobs below50,000,000 bytes were examined; three
larger blobs were explicitly skipped. Raw bytes and LF/CRLF variants of NUL-free
blobs were compared against all229 target hashes. All21 recovered identities have
raw-byte matches. Original sources, references, receipts and Git state were unchanged.
No fetch, garbage collection, configuration edit or historical runtime execution.

Ten recovered Markdown versions comprise seven entry-readiness versions plus the
body-research frontier, corpus-intake draft and dated CURRENT. Eleven TypeScript
versions cover occurrence identity, ordered input, trace binding, admission,
spatial/visual formation, observation and four test sources. Copies are bound by
exact target SHA256 and Git object identity. Recovery is not authentication of
historical execution, historical timestamp or scientific claim sufficiency.

The earlier234-target census now has26 exact recoveries in total: five already
available and21 recovered here.208 remain unresolved within the declared searches.
The80-version exit-inventory gap set loses seven entry-readiness versions, leaving
73 there; no seam/verdict/reference-ledger gap is cleared by assumption. Earlier
229/234 and80 counts remain dated evidence, not rewritten.

Recovered narrative content must be compared with reviewed sources before asserting
that it contributes no additional findings. SourceREV314 remains unchanged: all
11,373 frozen census roles assigned,2,804 indexed outside-census resources. These21
new copies are search evidence pending their content/backing-role join. No original
occurrence count changes or whole-source qualification by hash equality.

The scope excludes three large blobs, temporary unregistered Git object files,
other repositories, remote objects and arbitrary transformations. Git reported
28 temporary object files outside its normal enumeration; they were not removed.
No global absence claim is made. No-hash legacy-log/formula provenance and the
source-manifest omission remain separate from this hash-target recovery.

Next: review the recovered narrative differences and remaining evidence gaps,
then independent canonical-universe and scientific adequacy before HQ-012.
RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED.108 verdicts;132 bounded clauses;
55/58 wrappers;corpus0.29.0/21. Campaign3 NOT EXIT-READY.
Recovery checker PASS;21 copied hashes verified; all output files below50MB.
''',encoding='utf-8',newline='\n')
rp=P/'RESEARCH_OBLIGATIONS.json';reg=load(rp);obs=['RO-C3-019','RO-C3-020','RO-C3-021']
existing={x['path'] for x in reg['reportReviews']}
for p in [O/'inventory.json',O/'review.json',O/'check.json',cp]:
    path=p.as_posix();assert path not in existing
    reg['reportReviews'].append(dict(path=path,obligations=obs))
    for ob in reg['obligations']:
        if ob['id'] in obs:ob['evidence'].append(path)
rp.write_text(json.dumps(reg,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS:21 additional exact historical source identities recovered.
Start CAMPAIGN3_HISTORY_GIT_OBJECT_RECOVERY_CHECKPOINT.md.
Filename-independent Git search:21856 blobs /24581 objects;3 large blobs skipped.
234 targets now26 exact recoveries /208 unresolved;73 of80 exit-inventory gaps remain.
Ten narrative /11 TypeScript copies preserved; content/backing-role join remains due.
REV314 unchanged:11373 assigned sources /0 unassigned;413894 original occurrences.
Post-cutoff formula/Values/verdict join verified; scientific adequacy remains open.
Next recovered-content comparison, remaining source gaps and independent adequacy.
HQ-012 unstarted. Campaign3 NOT EXIT-READY. No runtime suite or build rerun.
Counters1519 /0;108 verdicts;55 /58 wrappers;132 bounded clauses;corpus0.29.0 /21.
RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED. No owner ruling.
'''
cur.write_text(old.decode('utf-8-sig').split('HQ-011 IN PROGRESS:')[0]+route,encoding='utf-8',newline='\n')
a=Path('AGENTS.md');s=a.read_text(encoding='utf-8-sig');needle='**Current routing (2026-10-11):**';pos=s.index(needle)
a.write_text(s[:pos]+needle+'\n'+route+'\n'+s[pos:].replace('**Current routing','**Prior routing',1),encoding='utf-8',newline='\n')
print(json.dumps(dict(reports=len(reg['reportReviews']),added=4,verifiedCopies=len(files))))
