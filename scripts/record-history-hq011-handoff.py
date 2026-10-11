"""Record the scoped HQ-011 acceptance and preserve separate HQ-012 exit gates."""
from pathlib import Path
import hashlib
import json

P = Path('docs/planning')
O = P / 'campaign3-history-hq011-handoff-rev1'
def load(p): return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):
    p = Path(p)
    return dict(path=p.as_posix(), sha256=hashlib.sha256(p.read_bytes()).hexdigest())
def write(p, value):
    assert not p.exists(), p
    p.write_text(json.dumps(value, ensure_ascii=False, indent=2)+'\n', encoding='utf-8', newline='\n')

assert not O.exists()
O.mkdir()
names = [
 'CAMPAIGN3_FINAL_HISTORY_GATE.md', 'HISTORY_AUTHORITY_RECONCILIATION_READINESS.md',
 'campaign3-history-source-roles-rev315/index.json',
 'campaign3-history-hq011-adequacy-rev1/review.json',
 'campaign3-history-root-accounting-rev1/review.json',
 'campaign3-history-chronology-consolidated-rev1/review.json',
 'campaign3-history-global-occurrence-links-rev1/review.json',
 'campaign3-history-global-occurrence-links-rev1/check.json',
 'campaign3-history-gap-consequences-rev1/review.json',
 'campaign3-history-recovered-content-rev1/review.json',
 'campaign3-history-legacy-log-disposition-rev1/decision.json',
 'campaign3-history-post-cutoff-join-rev1/review.json',
 'campaign3-history-external-formulas-rev1/review.json',
 'campaign3-history-provenance-correction-rev1/review.json',
 'campaign3-history-queue-rev1/review.json',
]
inputs = [ref(P/n) for n in names]
c = load(P/'campaign3-history-global-occurrence-links-rev1/check.json')
assert c['originalOccurrences'] == 413894 and c['omitted'] == c['duplicateOriginalIds'] == 0
gaps = load(P/'campaign3-history-gap-consequences-rev1/review.json')['groups']
assert len(gaps) == 208
assert sum(g['category'] == 'EXIT_NARRATIVE' for g in gaps) == 74
rows = [
 ('Universe and authority', 'ACCEPTED WITH DECLARED SOURCE ROLES',
  'REV315 freezes acceptance by scoped role and bound content review, not by filename or root status. Historical proposals, normative decisions, routing, evidence and backing records remain distinct. No historical candidate acquires current authority from inclusion.'),
 ('Marked and unmarked occurrences', 'ACCEPTED FOR DECLARED EXTRACTION',
  'The independent inventory and schema-boundary reviews are complemented by the exact disjoint 360238 individual-object /53656 receiver-schema join. Every original ID is preserved; 413894 is an occurrence count, not a finding count. Short JSON and outside-census backing roles are explicitly reviewed.'),
 ('Scientific dispositions', 'ACCEPTED WITH RETAINED CONDITIONAL DEBT',
  'The bound root, ledger, source-specific and chronology reviews supply the claim-level judgments. Failed cohorts, equalities and retained competitors are evidence, not exclusions. Accounted conditional questions are not resolved laws. Scoped derivations retain representation, query and horizon restrictions; this handoff authorizes no further reduction.'),
 ('Unavailable historical versions', 'ACCOUNTED AS RESTRICTED EVIDENCE; NOT RECOVERED',
  'All 208 targets and 299 original contexts retain the per-target supported and blocked claims in the gap-consequences report. Unseen bytes are not declared scientifically empty. Historical receipts are admitted as dated testimony only where their dependent source-exact claim is withheld. HQ012 must reject any mandatory exit claim that depends on these unavailable identities without independent adequate evidence. The corrected exit subset is 74, not 73.'),
 ('Legacy research authority', 'OWNER-DIRECTED SUCCESSOR ACCEPTED',
  'The owner directs proceeding without the unavailable legacy log; reference/RESEARCH.md is the retained successor with 339 reviewed occurrences. This removes that recovery gate, without asserting byte ancestry or historical equivalence. Earlier blocker conclusions are superseded only to this extent.'),
 ('Known post-cutoff material', 'ACCOUNTED; FINAL FRESHNESS STILL REQUIRED',
  'The formula/Values join preserves 343 formula paragraphs, 90 Values narrative paragraphs and 94036 backing strings. The unchanged 106-verdict prefix plus two Values verdicts is explicit. The provenance erratum is included through its own bound review; an available formula snapshot is not proof of the unsupported historical commit citation.'),
 ('Exit coverage', 'HQ012 REQUIRED',
  'Current 132 bounded clauses and 108 verdicts do not pass the 21-member corpus, 15 family dispositions or component/native admission gates. RO021 remains unsatisfied pending that separate acceptance and final authoritative-delta review.'),
]
review = dict(status='HQ011 SCOPED HISTORICAL RECONCILIATION ACCEPTED; HQ012 HANDOFF',
    disposition='LOCAL DISPOSITION; no owner ruling or scientific law selected',
    inputs=inputs, requirements=[dict(requirement=a,result=b,reason=d) for a,b,d in rows],
    scientificControls=[
      'Belief evidence boundaries do not confer calibrated confidence or objective-truth access.',
      'Affect/body receiving distinctions retain their scoped scalar equalities; neither universal scalar sufficiency nor universal dimensional necessity is accepted.',
      'Values NeedOnly/Joint overlap and StoredRefold comparisons remain; stronger physical readiness cases and autonomous acquisition are not manufactured by native replay.',
      'Formula arithmetic counterexamples, rounding/matrix assumptions and biological candidate tuning remain distinct from accepted executable seam laws.',
      'Historical and corrected development cohorts remain separately identified; no later bytes or build timing are attributed retroactively.'
    ],
    unavailableTargets=[dict(target=g['target'],category=g['category'],disposition=g['disposition']) for g in gaps],
    completionScope='Canonical available evidence, exact occurrence accounting and scientific dispositions are adequate for handing off to final exit review. This is not completeness over unseen historical contents or final Campaign3 acceptance.',
    ownerObligations=['RO-C3-019','RO-C3-020','RO-C3-021'],
    counters=dict(highestAllocated=1519,sinceLastVerdictOrCorpus=0), campaignExitReady=False)
write(O/'review.json', review)
write(O/'check.json', dict(status='PASS HANDOFF INPUT INTEGRITY AND COUNTS',
    review=ref(O/'review.json'), checkedInputs=len(inputs), originalOccurrences=413894,
    omitted=0, unavailableTargets=208, exitSubset=74,
    limitation='Mechanical checks validate the recorded decision inputs, not scientific truth or HQ012 acceptance.'))

cp=P/'CAMPAIGN3_HISTORY_HQ011_HANDOFF.md'
assert not cp.exists()
cp.write_text('''# HQ-011 acceptance and HQ-012 handoff — 2026-10-11

**LOCAL DISPOSITION: HQ-011 complete in its declared historical-review scope.
Campaign3 remains NOT EXIT-READY. Counters1519 /0.**

The canonical source-role and scientific reviews are accepted for the available
evidence universe. This decision combines substantive authority, ledger, mechanism,
failure-cohort and reduction reviews with independent exact occurrence accounting;
the ID join alone is not the basis for acceptance. The versioned decision is
campaign3-history-hq011-handoff-rev1/review.json.

All11,373 frozen sources have explicit roles. All413,894 original occurrences have
exact review links, with zero omissions or duplicate original IDs. The retained
RESEARCH.md successor covers339 occurrences; the owner has removed the missing
legacy log as a recovery gate. Known formula/Values additions and the formula
provenance correction remain separately joined, without altering the original count.

208 unavailable historical identities remain explicit evidence limits, including74
exit-inventory versions. They are neither recovered nor declared devoid of findings.
Their source-exact reproduction claims remain withheld. This is an adequate scoped
handoff because the final-history gate requires explicit unresolved-reference
accounting, not recovery of every obsolete draft. Any mandatory exit claim that
actually depends on unavailable evidence must still fail HQ-012 until independently
supported or explicitly resolved under the authority hierarchy. The original gap
contexts and per-claim restrictions remain binding; no evidence debt is erased.

This successor replaces the earlier HQ-011 handoff-withheld conclusion for the
declared scope, supported by the owner disposition and completed occurrence join.
It does not amend old receipts, assert unseen-content completeness, retire a
comparator or turn bounded equalities into general laws.

## HQ-012 work order and acceptance conditions

1. Freeze a final authoritative delta from the declared census and joined additions
   to the present state. Classify later audit bookkeeping separately from scientific
   changes. Fail unexplained authoritative additions, hash substitutions or broken
   evidence links. Bind a fresh registry receipt and the current source inventory.
2. Review each of the21 corpus members against its mandatory gates and accepted
   contracts. State the evidence identity, unmet conditions and exit disposition;
   bounded clause coverage cannot waive a corpus requirement.
3. Review all15 Brief families and their132 bounded clauses. Preserve wider unearned
   scope and conditional debt. Resolve actual requirement conflicts through the
   authority hierarchy, not by equating all bounded witnesses with full-family PASS.
4. Join component claims to actual native/public admission where required. Verify
   the55 producers/58 factories inventory and publication scope. Preserve Values'
   stronger unexecuted physical/autonomous cases and all named missing-source limits.
5. Publish a final exit decision only after these independent checks. RO021 remains
   UNSATISFIED until then; RO019 ACTIVE, RO020 conditional preservation, RO022 CLOSED
   only for its qualified scope. Campaign4 ranking remains withheld.

No new runtime experiment, model, law, allocation, verdict or corpus member was
created.108 verdicts, corpus0.29.0/21 and all conditional research obligations remain.
This checkpoint requires research registry validation, checker self-tests and a
scoped whitespace check; behavioral suites are not rerun for this audit-only change.
''',encoding='utf-8',newline='\n')
rp=P/'RESEARCH_OBLIGATIONS.json'; reg=load(rp)
obs=['RO-C3-019','RO-C3-020','RO-C3-021']
for p in [O/'review.json',O/'check.json',cp]:
    path=p.as_posix()
    assert not any(r['path']==path for r in reg['reportReviews'])
    reg['reportReviews'].append(dict(path=path,obligations=obs))
    for ob in reg['obligations']:
        if ob['id'] in obs: ob['evidence'].append(path)
rp.write_text(json.dumps(reg,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md'; old=cur.read_bytes()
with (P/'CAMPAIGN3_LOG.md').open('ab') as f: f.write(b'\n\n'+old)
route='''HQ-011 scoped historical reconciliation ACCEPTED; HQ-012 is next.
Start CAMPAIGN3_HISTORY_HQ011_HANDOFF.md and its versioned decision.
11373 source roles /413894 exact original occurrence links;0 omissions.
Owner-directed RESEARCH.md successor accepted; legacy recovery is not a gate.
208 missing historical identities retain claim limits;74 exit-inventory subset.
Next final authoritative freshness,21 corpus members,15 families and native scopes.
No missing source-exact evidence may be used to pass a mandatory exit claim.
Counters1519 /0;108 verdicts;55 /58 wrappers;132 bounded clauses;corpus0.29.0 /21.
RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED. Campaign3 NOT EXIT-READY.
'''
cur.write_text(old.decode('utf-8-sig').split('HQ-011')[0]+route,encoding='utf-8',newline='\n')
a=Path('AGENTS.md'); s=a.read_text(encoding='utf-8-sig'); needle='**Current routing (2026-10-11):**'; pos=s.index(needle)
a.write_text(s[:pos]+needle+'\n'+route+'\n'+s[pos:].replace('**Current routing','**Prior routing',1),encoding='utf-8',newline='\n')
print(json.dumps(dict(status=review['status'],reports=len(reg['reportReviews']))))
