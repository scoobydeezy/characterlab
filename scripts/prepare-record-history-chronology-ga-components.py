from pathlib import Path
s=Path('scripts/record-history-chronology-early-attention-body.py').read_text(encoding='utf-8')
s=s.replace('early-attention-body','ga-components').replace('EARLY_ATTENTION_BODY','GA_COMPONENTS').replace('==1423','==1438')
a=s.index("cp.write_text('''");b=s.index("''',encoding='utf-8',newline='\\n')",a)
body='''# GA component chronology — 2026-10-11

**LOCAL DISPOSITION — HQ-011 continues; no owner ruling. Counters1519 /0.**

Six frozen ranges, lines349–484, are reconciled against the component, source,
tracking, retention and scheduler reviews and later bounded GA qualification.
15 occurrences join1423 reviewed:1438 reviewed /58 pending. Exact identities, text
and locations remain. REV313 stays11372 assigned /1 unassigned;199699 narrative /
212699 backing;2804 resources. Whole-log role stays open.

Draft recipes and structural audits are not public model executions. Local output
counts and drained-run totals are not whole-model instant work bounds. The installed
phase140 barrier required terminal siblings and common-B0 composition; allocated
parent IDs and opaque Dependencies did not authenticate completed feedback inputs.

Tracking reconstruction requires the full committed sweep prefix to preserve replay
and horizon guards. A last-window snapshot is insufficient. Retained content excludes
zero/unavailable units even when their perception or selection history exists. Graph
learning zeros are not new observations of absence. Encoding strength and association
competition remain separately observable. Five distinctions retain owners, blocked
claims and reopen conditions. No law or reduction selected.

No runtime suite or original writer rerun. Next chronology before line349, then
consolidated gaps, post-cutoff joins and independent adequacy. HQ-012 unstarted;
Campaign3 NOT EXIT-READY.108 verdicts;132 bounded clauses;55 producers/58 factories;
corpus0.29.0/21. RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED.
'''
s=s[:a]+"cp.write_text('''"+body+s[b:]
s=s.replace('1423 reconciled/73 pending','1438 reconciled/58 pending').replace('Corrected identities,epistemic boundaries and distinct concurrency findings preserved.','Draft/runtime scope,completed joins and full-prefix tracking distinctions preserved.').replace('before line485','before line349')
p=Path('scripts/record-history-chronology-ga-components.py');assert not p.exists();p.write_text(s,encoding='utf-8',newline='\n')
