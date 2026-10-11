from pathlib import Path
s=Path('scripts/record-history-chronology-ga-integration.py').read_text(encoding='utf-8')
s=s.replace('ga-integration','correction-pass').replace('GA_INTEGRATION','CORRECTION_PASS').replace('==1354','==1386')
a=s.index("cp.write_text('''");b=s.index("''',encoding='utf-8',newline='\\n')",a)
body='''# Correction-pass chronology — 2026-10-11

**LOCAL DISPOSITION — HQ-011 continues; no owner ruling. Counters1519 /0.**

Three frozen entries, lines717–840, are reconciled against the work order, resume
brief, owner rulings, checkpoint discipline and corpus promotion.32 occurrences join
1354 reviewed:1386 reviewed /110 pending. Exact identities, text and locations remain.
REV313 stays11372 assigned /1 unassigned;199699 narrative /212699 backing;
2804 resources. Whole-log role stays open.

The dated pause is historical routing. The reported twelve verdicts included three
absent entries, explicitly corrected on September20. All eleven promoted corpus
members were blocked or partial: three partial plus eight blocked. The erroneous
ten-count remains in its original receipt; no status, version or digest is rewritten.
Corpus membership names an obligation and does not qualify it.

The namespace correction selects PHEN-ATTN-001 without inventing a reservation in a
different typed namespace. Documentation synchronization does not qualify runtime
behavior. Its described tool-output preflight is not represented here as a separately
recovered process receipt or a fresh run. Four distinctions retain owners, blocked
claims and reopen conditions. No law or reduction selected.

No runtime suite or original writer rerun. Next chronology before line717, then
consolidated gaps, post-cutoff joins and independent adequacy. HQ-012 unstarted;
Campaign3 NOT EXIT-READY.108 verdicts;132 bounded clauses;55 producers/58 factories;
corpus0.29.0/21. RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED.
'''
s=s[:a]+"cp.write_text('''"+body+s[b:]
s=s.replace('1354 reconciled/142 pending','1386 reconciled/110 pending').replace('Compiler/runtime scope,cue/retention distinctions and development failures preserved.','Dated routing,corrected corpus counts and preflight evidence limits preserved.').replace('before line841','before line717')
p=Path('scripts/record-history-chronology-correction-pass.py');assert not p.exists();p.write_text(s,encoding='utf-8',newline='\n')
