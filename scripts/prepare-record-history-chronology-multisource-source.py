from pathlib import Path
s=Path('scripts/record-history-chronology-multisource-public.py').read_text(encoding='utf-8')
s=s.replace('multisource-public','multisource-source').replace('MULTISOURCE_PUBLIC','MULTISOURCE_SOURCE').replace('==1237','==1260')
start=s.index("cp.write_text('''");end=s.index("''',encoding='utf-8',newline='\\n')",start)
body='''# Multisource source chronology — 2026-10-11

**LOCAL DISPOSITION — HQ-011 continues; no owner ruling. Counters1519 /0.**

Four frozen entries,lines1240–1354,are reconciled against selected-source and
source-join checkpoints and bounded public successor qualification.23 occurrences
join1237 reviewed:1260 reviewed /236 pending. Exact identities,text and locations
remain. REV313 stays11372 assigned /1 unassigned;199699 narrative /212699 backing;
2804 resources. Whole-log role stays open.

Trusted component declarations do not establish public registry authority. Local
allocation uniqueness and deterministic repeats do not establish transactional
rollback or original-prefix replay. Audit samples and state-read provenance remain
distinct from selected character evidence. Base-off preserves adoption and task
modifiers without manufacturing a motive; removing adoption is a different control.

The original38/49 focused-test receipts cover four/five files. They do not rerun the
full suites. The initial Node-only helper failure and source-join fixture corrections
remain preserved. Four material distinctions retain owners,blocked claims and reopen
conditions. Later bounded public admission does not retroactively authorize the
earlier trusted API or select a general receiving law.

No runtime suite or original writer rerun. Next chronology before line1240,then
consolidated gaps,post-cutoff joins and independent adequacy. HQ-012 unstarted;
Campaign3 NOT EXIT-READY.108 verdicts;132 bounded clauses;55 producers/58 factories;
corpus0.29.0/21. RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED.
'''
s=s[:start]+"cp.write_text('''"+body+s[end:]
s=s.replace('1237 reconciled/259 pending','1260 reconciled/236 pending').replace('Description-ground identity,matched receiving and corrected public validation retain scope.','Trusted source authority,selected evidence and focused validation retain scope.').replace('before line1355','before line1240')
p=Path('scripts/record-history-chronology-multisource-source.py');assert not p.exists();p.write_text(s,encoding='utf-8',newline='\n')
