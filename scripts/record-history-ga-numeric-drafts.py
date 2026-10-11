from pathlib import Path
import json
P=Path('docs/planning')
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(P/'campaign3-history-source-roles-rev190/check.json');assert c['assignedSources']==10400
cp=P/'CAMPAIGN3_HISTORY_GA_NUMERIC_DRAFTS_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# General Attention numeric draft reconciliation — 2026-10-08

**LOCAL DISPOSITION — no owner ruling.** HQ011 IN PROGRESS; counters **1519 /0**.

Four GA allocation proposal sources reconciled:22 original narrative/10 backing
occurrences, all3,621 string leaves and73 exact source bindings. The three frozen
allocation tables already had reviewed roles; their evidence is rebound without
counting original occurrences again.

Carrier,registry-member andwrite-scope proposals match their exact frozen successors
except version,status and added acceptedReview. All163 Markdown record rows andsix
namespace rows match field order,ordinals,optionality and payloads.38 finite field-tag
sets,11 record unions,165 roles andfive actual-producer ownership annotations remain
unchanged. Reference positions allocate nothing; numeric namespace agreement does
not replace symbolic domain predicates or source/subject authentication.

The218 members occupy existing namespaces with no new record/namespace.705/706 remain
a separate two-record13-field successor with closed322/705union; old704 is unchanged.
No reissued allocation,renumbering,alias or new authority. Draft OPEN/pending wording
is historical; exact later acceptance supersedes only the corresponding numeric gate.
Model/compiler/output/trace/work/replay claims remain separately qualified.

SourceREV190:10,400 assigned/973 unassigned;131,613 narrative/211,268 backing;
1,192 indexed archives. Values post-cutoff reviews remain separate denominators.
Two Values/seven cognitive/80 exit-inventory/one scheduler identities,formula provenance,
legacy log,remaining material support and independent adequacy remain open. HQ012
unstarted;Campaign3 NOT EXIT-READY. No old writer/runtime/test/build/model/law/allocation/
verdict/corpus/obligation change.1519/0;108 verdicts;132 bounded;55/58 wrappers;
corpus0.29.0/21. RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED. No owner ruling.
''',encoding='utf-8',newline='\n')
rpath=P/'RESEARCH_OBLIGATIONS.json';r=load(rpath);obs=['RO-C3-014','RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
paths=[p.as_posix() for d in ['campaign3-history-ga-numeric-drafts-rev1','campaign3-history-source-roles-rev190'] for p in sorted((P/d).glob('*.json'))]+[cp.as_posix()]
for p in paths:
 assert p not in existing
 r['reportReviews'].append(dict(path=p,obligations=obs))
 for o in r['obligations']:
  if o['id'] in obs:o['evidence'].append(p)
rpath.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS:four GA numeric draft sources reconciled.
Start CAMPAIGN3_HISTORY_GA_NUMERIC_DRAFTS_CHECKPOINT.md.
22 narrative/10 backing occurrences;3621 strings;73 exact bindings.
Three draft/freeze pairs preserve assignments;163 Markdown record/six namespace rows match.
SourceREV190:10400 assigned/973 unassigned;131613 narrative/211268 backing;
1192 archives. Values post-cutoff reviews retain separate denominators.
Open identities:two Values,seven cognitive,80 exit-inventory,one scheduler.
Next remaining material support,post-cutoff delta joins and independent adequacy.
Formula provenance and legacy log remain OPEN;HQ012 unstarted.
Campaign3 NOT EXIT-READY.1519/0;108 verdicts;55/58 wrappers;132 bounded;
corpus0.29.0/21. RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED.
All jobs terminal;no owner ruling.
'''
cur.write_text(old.decode('utf-8-sig').split('HQ-011 IN PROGRESS:')[0]+route,encoding='utf-8',newline='\n')
a=Path('AGENTS.md');s=a.read_text(encoding='utf-8-sig');needle='**Current routing (2026-10-08):**';pos=s.index(needle)
a.write_text(s[:pos]+needle+'\n'+route+'\n'+s[pos:].replace('**Current routing','**Prior routing',1),encoding='utf-8',newline='\n')
print(json.dumps(dict(reports=len(r['reportReviews']),added=len(paths),exactChronology=True)))
