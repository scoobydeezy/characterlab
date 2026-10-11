from pathlib import Path
import json
P=Path('docs/planning')
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(P/'campaign3-history-source-roles-rev189/check.json');assert c['assignedSources']==10396
cp=P/'CAMPAIGN3_HISTORY_GA_ACCEPTANCE_RECEIPTS_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# General Attention acceptance receipt reconciliation — 2026-10-08

**LOCAL DISPOSITION — no owner ruling.** HQ011 IN PROGRESS; counters **1519 /0**.

Nine GA acceptance manifests/numeric audit receipts reconciled:14 original narrative
occurrences, all124 string leaves including short fault labels/statuses.36 direct
source bindings and63 prior-allocation reference occurrences match exact bytes.
The latter cover20/21/22 prior-table scopes, not63 unique allocation tables.

Thirty-one historical static mutation rejections retain numerical scope:16 carrier,
eight fixed-member and seven write-scope controls. Source inspection confirms cloned
proposals and assert.throws checks, without rerunning historical writers. Collision,
omission,renumbering,optionality,type,tag,union,namespace,payload,role,owner,boundary,
member-smuggling and early-permanence controls do not qualify runtime branches,
source authenticity,rollback or persistence. Exact member labels confer no authority.

Six manifests bind shape/allocation acceptance separately. The output-declaration
receipt already had a reviewed disposition; its exact evidence was rebound without
counting original occurrences again. Numeric draft/table contents are not silently
whole-reviewed by receipt linkage. Later bounded GA qualification remains separate.

SourceREV189:10,396 assigned/977 unassigned;131,591 narrative/211,258 backing;
1,192 indexed archives. Values post-cutoff sources retain separate denominators.
Two Values/seven cognitive/80 exit-inventory/one scheduler source identities,formula
provenance,legacy log,remaining material support and independent adequacy remain open.
HQ012 unstarted;Campaign3 NOT EXIT-READY. No runtime/build/model/law/allocation/verdict/
corpus/obligation change.1519/0;108 verdicts;132 bounded;55/58 wrappers;corpus0.29.0/21.
RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED. No owner ruling.
''',encoding='utf-8',newline='\n')
rpath=P/'RESEARCH_OBLIGATIONS.json';r=load(rpath);obs=['RO-C3-014','RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
paths=[p.as_posix() for d in ['campaign3-history-ga-acceptance-receipts-rev1','campaign3-history-source-roles-rev189'] for p in sorted((P/d).glob('*.json'))]+[cp.as_posix()]
for p in paths:
 assert p not in existing
 r['reportReviews'].append(dict(path=p,obligations=obs))
 for o in r['obligations']:
  if o['id'] in obs:o['evidence'].append(p)
rpath.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS:nine GA acceptance receipts reconciled.
Start CAMPAIGN3_HISTORY_GA_ACCEPTANCE_RECEIPTS_CHECKPOINT.md.
14 original narrative occurrences;124 strings;36 direct/63 prior reference bindings.
31 recorded static faults retain numeric scope;prior output review not recounted.
SourceREV189:10396 assigned/977 unassigned;131591 narrative/211258 backing;
1192 archives. Values post-cutoff reviews retain separate denominators.
Open identities:two Values,seven cognitive,80 exit-inventory,one scheduler.
Next numeric draft/table scope,remaining material support and independent adequacy.
Formula provenance and legacy log remain OPEN;HQ012 unstarted.
Campaign3 NOT EXIT-READY.1519/0;108 verdicts;55/58 wrappers;132 bounded;
corpus0.29.0/21. RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED.
All jobs terminal;no owner ruling.
'''
cur.write_text(old.decode('utf-8-sig').split('HQ-011 IN PROGRESS:')[0]+route,encoding='utf-8',newline='\n')
a=Path('AGENTS.md');s=a.read_text(encoding='utf-8-sig');needle='**Current routing (2026-10-08):**';pos=s.index(needle)
a.write_text(s[:pos]+needle+'\n'+route+'\n'+s[pos:].replace('**Current routing','**Prior routing',1),encoding='utf-8',newline='\n')
print(json.dumps(dict(reports=len(r['reportReviews']),added=len(paths),exactChronology=True)))
