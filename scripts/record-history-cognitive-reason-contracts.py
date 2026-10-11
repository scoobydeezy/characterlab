from pathlib import Path
import json
P=Path('docs/planning')
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(P/'campaign3-history-source-roles-rev180/check.json');assert c['assignedSources']==10318
cp=P/'CAMPAIGN3_HISTORY_COGNITIVE_REASON_CONTRACTS_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Historical reason and identity contracts — 2026-10-08

**LOCAL DISPOSITION — no owner ruling.** HQ011 IN PROGRESS. Counters **1519 /0**.

Six complete contracts reconciled: adopted plans/options, task reasons/meaning,
ordered identity history, TRC004 coverage, arbitration/RNG and conditional intent/
protocol execution.199 original narrative occurrences preserve exact source hashes,
locations and text. Existing qualification and later persistence/appraisal receipts
supply scoped acceptance links; no transitive acceptance of remaining components.

Material distinctions retained: adopted instruction is neither efficacy belief nor
intent; base ablation preserves options; deduplicated actions retain separate task
origins; concern/standing cannot create a generating base. Nonidentity semantic
pressure excludes standing and differs from bounded role totals, activation, dice
or win probabilities. Fidelity here means relative prioritization, not moral worth
or successful fulfillment. Direct Phase2.97 I feedback and prior alignment-scaled
comparison remain distinct, including multiple-origin amplification.

The earlier stored-counter proposal is explicitly superseded by ordered nonrecursive
history. Chronological ties-to-even, provenance and duplicate prevention preserve
nonzero evidence even when rounding makes no scalar increment. Absent history differs
from an invalid explicitly empty entry. Rejected application still executes its
required no-write stage; no new evidence output is invented at persistence.

TRC004 retains aggregate union-max weighted Jaccard and its2/3 subset residual.
Coverage membership is neither confidence nor a proof of independence; empty bases
still require source uniqueness. Raw bases enter coverage even when their effective
contribution is zero. Directional coverage and divided/alignment-scaled standing are
comparators, not silent corrections. Corpus counterexample wording remains preserved:
finite runtime qualification alone does not publish or waive a corpus requirement.

Arbitration keeps exact fair-share analytical probabilities separate from finite
SHA mapping; inactive point-zero alternatives still compete against Avoid. One
resolution identity owns semantic draw roots, and conditional intent belongs to
child emission rather than optionalizing generic exactly-one outputs. Requested
count, completed effect, overflow and observer-safe measurement remain separate.
Blocked execution still generates actual zero-count307/ADAPT. Earlier optional
coupling language is narrowed by the final natural-address-only profile, preserving
the broader substrate capability. Full-prefix reconstruction and local-oracle discard
retain failure atomicity without reviving failed runs.

TP/RI/IH/TRC4 and AR/IP requirements retain the later public/component/exclusion
proof split. Existing arithmetic, actual RNG/protocol, source admission, public
prefix/rollback and substrate controls are different kinds of evidence; no claim
of a separate public recipe or executed mutant for every proposed branch. All
source/test hashes in the prior76-test receipt were reverified unchanged, not rerun.
No new runtime tests/build, production change, verdict, law or corpus promotion.

SourceREV180:10,318 assigned/1,055 unassigned;130,564 narrative/211,150 backing;
1,190 indexed archives.80 exit-inventory identities plus one older scheduler identity
remain unresolved. Formula provenance, legacy log, Values90/15 and independent
adequacy remain open. Next remaining registration/ownership/output contracts.
HQ012 unstarted;Campaign3 NOT EXIT-READY.1519/0;108 verdicts;132 bounded clauses;
55/58 wrappers;corpus0.29.0/21. RO019 ACTIVE;RO021 mandatory UNSATISFIED;
RO022 CLOSED. No obligation closure or owner ruling.
''',encoding='utf-8',newline='\n')
rpath=P/'RESEARCH_OBLIGATIONS.json';r=load(rpath);obs=['RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
paths=[p.as_posix() for d in ['campaign3-history-cognitive-reason-contracts-rev1','campaign3-history-source-roles-rev180'] for p in sorted((P/d).glob('*.json'))]+[cp.as_posix()]
for p in paths:
 assert p not in existing
 r['reportReviews'].append(dict(path=p,obligations=obs))
 for o in r['obligations']:
  if o['id'] in obs:o['evidence'].append(p)
rpath.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS:six cognitive reason/plan/history/protocol contracts reconciled.
Start CAMPAIGN3_HISTORY_COGNITIVE_REASON_CONTRACTS_CHECKPOINT.md.
199 original narrative occurrences;availability/base,meaning/standing,ordered
history/rounded strength,subset residual and requested/completed effects preserved.
Prior76-test source fingerprints unchanged;no fresh runtime execution or new verdict.
SourceREV180:10318 assigned/1055 unassigned;130564 narrative/211150 backing;
1190 archives.80 exit-inventory gaps plus one scheduler identity OPEN.
Next remaining registration/ownership/output contracts,then independent adequacy.
Formula provenance,legacy log,Values90/15 remain OPEN;HQ012 unstarted.
Campaign3 NOT EXIT-READY.1519/0;108 verdicts;55/58 wrappers;132 bounded;
corpus0.29.0/21. RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED.
All jobs terminal;no owner ruling.
'''
cur.write_text(old.decode('utf-8-sig').split('HQ-011 IN PROGRESS:')[0]+route,encoding='utf-8',newline='\n')
a=Path('AGENTS.md');s=a.read_text(encoding='utf-8-sig');needle='**Current routing (2026-10-08):**';pos=s.index(needle)
a.write_text(s[:pos]+needle+'\n'+route+'\n'+s[pos:].replace('**Current routing','**Prior routing',1),encoding='utf-8',newline='\n')
print(json.dumps(dict(reports=len(r['reportReviews']),added=len(paths),exactChronology=True)))
