from pathlib import Path
s=Path('scripts/record-history-chronology-ga-components.py').read_text(encoding='utf-8')
s=s.replace('ga-components','ga-lifecycle').replace('GA_COMPONENTS','GA_LIFECYCLE').replace('==1438','==1451')
a=s.index("cp.write_text('''");b=s.index("''',encoding='utf-8',newline='\\n')",a)
body='''# GA lifecycle chronology — 2026-10-11

**LOCAL DISPOSITION — HQ-011 continues; no owner ruling. Counters1519 /0.**

Six frozen ranges, lines241–348, are reconciled against acquisition, retention,
body-source, attribution and lifecycle rulings and later bounded GA qualification.
13 occurrences join1438 reviewed:1451 reviewed /45 pending. Exact identities, text
and locations remain. REV313 stays11372 assigned /1 unassigned;199699 narrative /
212699 backing;2804 resources. Whole-log role stays open.

Successful acquisition can be followed by complete loss in the same atomic settlement.
History survives without a current recall target, transient access window or payload
resolver. Selection and acquisition identities remain separate. Rollback leaves a
failed scheduler terminal; it does not authorize an in-place retry.

Semantic-child scarcity differs from byte/view count. Non-borrowing kind partitions
are a bounded hypothesis, not universal biology. A declared signal per sensing
opportunity preserves multiple exact views without treating them as independent trials.
Fallible attribution supplies eligibility, not truth or an effect measurement. Later
consolidation cannot rewrite initial encoding or resurrect missing content. Five
distinctions retain owners, blocked claims and reopen conditions. No law selected.

No runtime suite or original writer rerun. Next chronology before line241, then
consolidated gaps, post-cutoff joins and independent adequacy. HQ-012 unstarted;
Campaign3 NOT EXIT-READY.108 verdicts;132 bounded clauses;55 producers/58 factories;
corpus0.29.0/21. RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED.
'''
s=s[:a]+"cp.write_text('''"+body+s[b:]
s=s.replace('1438 reconciled/58 pending','1451 reconciled/45 pending').replace('Draft/runtime scope,completed joins and full-prefix tracking distinctions preserved.','Acquisition/loss history,signal units and fallible credit distinctions preserved.').replace('before line349','before line241')
p=Path('scripts/record-history-chronology-ga-lifecycle.py');assert not p.exists();p.write_text(s,encoding='utf-8',newline='\n')
