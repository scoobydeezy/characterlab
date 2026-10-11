from pathlib import Path
s=Path('scripts/record-history-chronology-correction-pass.py').read_text(encoding='utf-8')
s=s.replace('correction-pass','early-attention-body').replace('CORRECTION_PASS','EARLY_ATTENTION_BODY').replace('==1386','==1423')
a=s.index("cp.write_text('''");b=s.index("''',encoding='utf-8',newline='\\n')",a)
body='''# Early attention/body chronology — 2026-10-11

**LOCAL DISPOSITION — HQ-011 continues; no owner ruling. Counters1519 /0.**

Six frozen ranges, lines485–716, are reconciled against bounded ATTN/EMB qualification,
correct-forward implementation findings and later coverage routing.37 occurrences join
1386 reviewed:1423 reviewed /73 pending. Exact identities, text and locations remain.
REV313 stays11372 assigned /1 unassigned;199699 narrative /212699 backing;
2804 resources. Whole-log role stays open.

ATTN's incorrect list-S0 changed run commitments when corrected, while its model
identities stayed fixed. Canonical reference ordering differs from numeric ordinal
ordering. The suspected ATTN reset defect was disproved; removing its redundant guard
was not one of the eleven detected faults. EMB's actual concurrent-settlement and
handler-owned body-access repairs remain separate, affirmative findings.

Source truth, omniscient quantization trace, selected evidence and pressure retain
their epistemic boundaries. Independent motives differ from duplicate descriptions;
external replenishment does not establish learned action efficacy. Shape, allocation,
packaging and runtime evidence retain distinct scopes. Test totals composed from
full and focused runs are not represented as single fresh full runs, and public-run
versus replay-specimen denominators remain explicit. Six material distinctions retain
owners, blocked claims and reopen conditions. No law or reduction selected.

No runtime suite or original writer rerun. Next chronology before line485, then
consolidated gaps, post-cutoff joins and independent adequacy. HQ-012 unstarted;
Campaign3 NOT EXIT-READY.108 verdicts;132 bounded clauses;55 producers/58 factories;
corpus0.29.0/21. RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED.
'''
s=s[:a]+"cp.write_text('''"+body+s[b:]
s=s.replace('1386 reconciled/110 pending','1423 reconciled/73 pending').replace('Dated routing,corrected corpus counts and preflight evidence limits preserved.','Corrected identities,epistemic boundaries and distinct concurrency findings preserved.').replace('before line717','before line485')
p=Path('scripts/record-history-chronology-early-attention-body.py');assert not p.exists();p.write_text(s,encoding='utf-8',newline='\n')
