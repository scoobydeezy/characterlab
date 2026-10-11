from pathlib import Path
s=Path('scripts/record-history-chronology-multisource-source.py').read_text(encoding='utf-8')
s=s.replace('multisource-source','multisource-comparison').replace('MULTISOURCE_SOURCE','MULTISOURCE_COMPARISON').replace('==1260','==1288')
a=s.index("cp.write_text('''");b=s.index("''',encoding='utf-8',newline='\\n')",a)
body='''# Multisource comparison chronology — 2026-10-11

**LOCAL DISPOSITION — HQ-011 continues; no owner ruling. Counters1519 /0.**

Four frozen entries,lines1095–1239,are reconciled against the numerical comparison,
expressibility audit and obligation-seed authority.28 occurrences join1260 reviewed:
1288 reviewed /208 pending. Exact identities,text and locations remain. REV313 stays
11372 assigned /1 unassigned;199699 narrative /212699 backing;2804 resources.
Whole-log role stays open.

Role-blind normalization preserves ground labels but permits an orphan modifier to
weaken a separate motive. Collective overlap differences survive even where calibrated
probabilities agree. The13 synthetic fixtures use actual kernels and exact enumeration;
they do not authenticate public sources. Typed occurrence IDs and independent opaque
labels cannot supply source authority or statistical independence.

The obligation seed covered eight then-current Campaign3 verdicts/eight reports;
fourteen named verdicts was the broader denominator. Zero unowned entries and passing
bookkeeping fault checks did not establish historical scientific completeness. The
original build preceded the final weighted-overlap test addition; production code was
unchanged, but that ordering remains explicit. Five material distinctions retain
owners,blocked claims and reopen conditions. No new law or reduction selected.

No runtime suite or original writer rerun. Next chronology before line1095,then
consolidated gaps,post-cutoff joins and independent adequacy. HQ-012 unstarted;
Campaign3 NOT EXIT-READY.108 verdicts;132 bounded clauses;55 producers/58 factories;
corpus0.29.0/21. RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED.
'''
s=s[:a]+"cp.write_text('''"+body+s[b:]
s=s.replace('1260 reconciled/236 pending','1288 reconciled/208 pending').replace('Trusted source authority,selected evidence and focused validation retain scope.','Synthetic comparison,orphan influence and limited obligation-seed scope preserved.').replace('before line1240','before line1095')
p=Path('scripts/record-history-chronology-multisource-comparison.py');assert not p.exists();p.write_text(s,encoding='utf-8',newline='\n')
