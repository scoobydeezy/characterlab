"""Record an unsuccessful completion audit without lowering the history gate."""
from pathlib import Path
import json
P=Path('docs/planning');O=P/'campaign3-history-hq011-adequacy-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(O/'check.json');assert c['handoffAllowed'] is False and c['verifiedRoleBackingBindings']==50825
cp=P/'CAMPAIGN3_HISTORY_HQ011_ADEQUACY_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# HQ-011 completion audit: source adequacy not demonstrated — 2026-10-11

**LOCAL DISPOSITION — HQ-012 handoff withheld. Counters1519 /0.**

The nine-part audit derives its requirements from CAMPAIGN3_FINAL_HISTORY_GATE.md
and HISTORY_AUTHORITY_RECONCILIATION_READINESS.md. It revalidates every11,373
census source body, all50,825 role/evidence/backing references and the exact original
413,894-unit artifact. The full frozen source-role set,4,739 root/navigation links,
chronology, named post-cutoff additions and correct-forward findings are accounted.
No missing current bound artifact or changed source hash was found in that scope.

Completion nevertheless is NOT proven. The required scientific/source adequacy is
not supplied by those integrity checks.208 unavailable historical path/hash versions
retain dependent-claim limits;74 are old exit-inventory narrative versions. A missing
source commitment is not its content. Later passing code does not authenticate old
execution, and later narrative text does not prove that earlier findings were never
lost or retracted. These gaps are accounted as limitations, not automatically excluded
from the material-finding obligation.

The concrete missing-input issue is the referenced legacy companion log,
claude/characterlab-research-log.md, and any authenticated archive/supersession
evidence needed to reconcile unavailable historical narrative findings. Searches
covered both repositories, reachable history, all locally discoverable Git objects,
temporary objects and tree-name candidates within their recorded bounds. No
authenticated log or evidence that all its material findings were superseded was
found. The hypothesis plan's superseded build sequence does not prove that proposition.
reference/RESEARCH.md remains independently reviewed, not silently substituted.
An archive/backup/earlier-location question has been sent to the user. This requests
evidence, not permission to waive the gate or select a psychological architecture.

The unsupported formula pin is explicitly restricted: preserved comparison bytes
and independently accepted contracts support their own scopes. No guessed pin,
formula adoption or historical production-parity claim is made. It does not invalidate
independently proven mathematics merely by association.

Two audit-development failures are preserved. The first assumed every manifest
entry had a snapshot key; JSON commits named paths while Markdown uses mirrors.
The second assumed every role rationale was called scope; ten earlier roles use
judgment. Both corrected schema adapters preserve exact source bytes. Additional
schema/canonical evidence fields are included in the50,825 verified bindings.

The objective remains unchanged and uncompleted. This is the first completed
blocked-condition assessment for the missing external provenance, not a request
to pause or a completed three-turn blocked audit. Continue only if new evidence or
a concrete independent resolution can change this condition; do not create more
bookkeeping checkpoints as a substitute for source adequacy. HQ-012 stays unstarted.

REV315:11,373 assigned sources;413,894 original occurrences;2,825 backing resources.
RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED.108 verdicts;132 bounded clauses;
55/58 wrappers;corpus0.29.0/21. No runtime/test/build/writer execution or scientific
verdict, allocation, law or corpus change. Campaign3 NOT EXIT-READY. Integrity audit
PASS; historical acceptance NOT PASSED. Registry/fault checks follow separately.
''',encoding='utf-8',newline='\n')
rp=P/'RESEARCH_OBLIGATIONS.json';reg=load(rp);obs=['RO-C3-019','RO-C3-020','RO-C3-021']
existing={x['path'] for x in reg['reportReviews']}
paths=[p.as_posix() for p in sorted(O.glob('*.json'))]+[cp.as_posix()]
for path in paths:
    assert path not in existing
    reg['reportReviews'].append(dict(path=path,obligations=obs))
    for ob in reg['obligations']:
        if ob['id'] in obs:ob['evidence'].append(path)
rp.write_text(json.dumps(reg,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 completion audit: source adequacy NOT DEMONSTRATED; HQ-012 withheld.
Start CAMPAIGN3_HISTORY_HQ011_ADEQUACY_CHECKPOINT.md.
Nine requirements assessed;11373 source hashes /50825 role/backing bindings pass.
208 historical targets remain, including74 exit-inventory versions; named legacy log
content/material supersession unproven. Archive/location information requested.
First blocked-condition assessment; goal remains active, not paused or complete.
Next new provenance evidence or concrete independent resolution; no bookkeeping-only loop.
REV315 unchanged:11373 roles /413894 original occurrences /2825 backing resources.
Counters1519 /0;108 verdicts;55 /58 wrappers;132 bounded clauses;corpus0.29.0 /21.
RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED. Campaign3 NOT EXIT-READY.
'''
cur.write_text(old.decode('utf-8-sig').split('HQ-011 IN PROGRESS:')[0]+route,encoding='utf-8',newline='\n')
a=Path('AGENTS.md');s=a.read_text(encoding='utf-8-sig');needle='**Current routing (2026-10-11):**';pos=s.index(needle)
a.write_text(s[:pos]+needle+'\n'+route+'\n'+s[pos:].replace('**Current routing','**Prior routing',1),encoding='utf-8',newline='\n')
print(json.dumps(dict(reports=len(reg['reportReviews']),added=len(paths))))
