from pathlib import Path
s=Path('scripts/record-history-chronology-ga-lifecycle.py').read_text(encoding='utf-8')
s=s.replace('ga-lifecycle','ga-governance').replace('GA_LIFECYCLE','GA_GOVERNANCE').replace('==1451','==1463')
a=s.index("cp.write_text('''");b=s.index("''',encoding='utf-8',newline='\\n')",a)
body='''# GA governance chronology — 2026-10-11

**LOCAL DISPOSITION — HQ-011 continues; no owner ruling. Counters1519 /0.**

Four frozen ranges, lines158–240, are reconciled against context/use, protocol,
graph and direct-access evidence and later bounded GA qualification.12 occurrences
join1451 reviewed:1463 reviewed /33 pending. Exact identities, text and locations
remain. REV313 stays11372 assigned /1 unassigned;199699 narrative /212699 backing;
2804 resources. Whole-log role stays open.

Use credit follows memory actually consumed even when an attribution answer is
Unavailable; bound but unread operands do not earn it. Protocol enrollment includes
never-successful sources. The payload-free success map differs from the admitted
domain, and an authorized non-removal writer still needs exact transition validation
to prevent resets or repairs of invalid prior state.

Uniform weakening preserves order; quantization ties are not selective reversal.
The selective-producer obligation remains conditional and unpassed. Exact zero-state
normalization is distinct from positive-edge forgetting. Direct episodic matching and
learned spread remain separate, with one final rounding and no graph-created memory
target. Five distinctions retain owners, blocked claims and reopen conditions.

No runtime suite or original writer rerun. Next chronology before line158, then
consolidated gaps, post-cutoff joins and independent adequacy. HQ-012 unstarted;
Campaign3 NOT EXIT-READY.108 verdicts;132 bounded clauses;55 producers/58 factories;
corpus0.29.0/21. RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED.
'''
s=s[:a]+"cp.write_text('''"+body+s[b:]
s=s.replace('1451 reconciled/45 pending','1463 reconciled/33 pending').replace('Acquisition/loss history,signal units and fallible credit distinctions preserved.','Consumed use,protocol enrollment and graph/access distinctions preserved.').replace('before line241','before line158')
p=Path('scripts/record-history-chronology-ga-governance.py');assert not p.exists();p.write_text(s,encoding='utf-8',newline='\n')
