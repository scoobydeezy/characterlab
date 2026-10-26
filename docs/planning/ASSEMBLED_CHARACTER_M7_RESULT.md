# M7 — body recall searches shared memory

2026-10-26. PASS. A later body-channel cue now searches the character's surviving
body episodes and accesses the newest matches within a fixed slot budget. It can
leave an episode retained but unrecalled. One state, episodic owner, scheduler and
save remain; no new psychological store or standalone runtime was introduced.

Before-code card/contract commit dbafa2f5; base602a22c6.
[Contract](../formal/ASSEMBLED_CHARACTER_RETRIEVAL_CONTRACT.md).
[Raw checks, including failures](ASSEMBLED_CHARACTER_M7_CHECKS.txt).
Rules/registry0.7 adds retrieval slots0..32; reference1 is an engineering default.
Reference retention8/8 and delay2 remain. Earlier model versions stay controls.

## Observed behavior

- Episodes acquired at3 and4 both remain stored. At5, the cue originating from3
  recalls4 under slots1. Slots2 recalls4 then3; slots0 recalls neither. All three
  runs finish with exactly identical state. The0.6 exact-key control recalls3.
- With retention capacity1, lost episode3 never reappears; the same channel cue
  can access surviving4. Actual consulted346/1 records and selected IDs are traced.
- Four M3 history/body cells at seed7 preserve all state, non-recall outputs,
  actual random draws and non-memory traces apart from model/run identity.
  Singleton recalled episode bytes agree. Memory differences are the predeclared
  version, cue, read domain/records and report; other compared memory fields agree.
- Repeat and restore after4 match whole snapshots/saves at every later boundary.
  Hidden truth with equal evidence gives equal episodes/access/recall. Exclusion
  and denial give no cue; selected zero-pressure evidence remains recallable.
  Recall at a later unsensed decision cannot supply current body appraisal.
- A24-event instant reads and reports prior memory, then forms new body/diagnostic
  episodes. Work limit23 fails late and rolls back the entire instant. Authored
  cues, invalid slots and version mismatch reject.

## Law mapping and checks

LOCAL DISPOSITION: port the accepted BODY_RECALL_RECENCY_COMPONENT ranking:
exact channel match, original age descending, canonical acquisition ID ascending.
Do not inspect intensity, refresh time, reinforce or reconstruct. The source kernel
has an incidental32-acquisition bound. The port matches it within that domain,
including permutations/ties/zero slots; a65-candidate check confirms no truncation.
This is a ranking-domain extension, not evidence for a new psychological law.

23 distinct tests pass:7 new integration/port tests,8 original bodyRecall tests,
8 M6 regressions. First functional run had two test-only field-reference errors:
EmittedEvents is18, not19; scheduled payload is6, not5. Failed output is retained.
Only those two affected tests reran and passed with unchanged expected semantics;
the other13 original-run passes and later8 regressions stand. No production fix
or comparison-meaning change followed execution. Both typecheck runs passed.
Frozen105 dependencies/config/fixture and M1 entry/test guard passed. Boundary and
research checks passed:0 active/18 conditional/4 closed/0 unowned;103 C3 verdicts.
No full frozen-control rerun: unchanged dependency/entry closure cannot invalidate it.

Six production/test files, two new evidence files (this result and raw log).
Timed checks 197.55s, longest 72.15s, within30min total/10min command.
Document/evidence/size budgets checked before completion commit. No browser work.

## Remaining scope

Cue timing is still a controlled generated opportunity, not autonomous context-cue
production. Access reports are not semantic presentation/workspace events. Recalled
body evidence has no reasoning consumer yet. Diagnostic recall remains exact-key.
General event retrieval, association, rich perception, selective encoding, credit,
reconstruction and the other architecture areas remain open. No corpus member,
132-clause requirement or conditional obligation closes; RO-C3-011 unchanged.
UI and Campaign4 remain stopped. Passing this package opens no further package.
