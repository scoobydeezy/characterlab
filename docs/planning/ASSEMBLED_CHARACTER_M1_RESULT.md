# M1 result — one character entry

2026-10-25. The existing Campaign 2 character can now be prepared, started, stepped,
inspected, saved and restored through src/assembled/character.ts. Its behavior is
unchanged. Campaign 3 mechanisms are still separate; full assembly remains ahead.

## Change and scope

The owner adopted the full pinned baseline and approved comparison c2367f16 on
2026-10-25. The new entry directly re-exports the existing composed public factory
under character names. It adds no runtime, state owner, dispatcher or save format.
This is deliberately a thin scaffold entry, not a newly independent implementation.

LOCAL DISPOSITION: use direct exports so the existing data-only admission and exact
save semantics cannot be weakened by a redundant wrapper. The unchanged runtime
composes its components around one stateModel and one adaptation scheduler.
Future capability must extend that shared composition, not select alternate pipelines.
Frozen 21-recipe admission remains; its replacement is mandatory M2a after M2 review.

Production/test scope was exactly the four predeclared files:
- src/assembled/character.ts (16 lines): entry and types.
- src/test/assembledCharacter.test.ts: three complete comparisons and two negative tests.
- src/test/fixtures/campaign2Cognitive.ts: original fixture functions extracted unchanged.
- src/test/campaign2CognitiveFactory.test.ts: shared fixture import/extraction only.

Source inspection confirms the original assertion block is identical and all extracted
fixture bodies are identical after removing export keywords. Import paths alone were
adjusted for the helper location. All six simulation/formal trees remain unchanged.
No model, law, accepted contract, historical verdict or obligation disposition changed.

## Predeclared comparison results

| Original fixture | Settled instants | Disposition |
|---|---:|---|
| Baseline | 8 | Exact equality, repeat, both restores, terminal no-op |
| Deadline overlap | 6 | Exact equality, repeat, both restores, terminal no-op |
| Equal criteria | 8 | Exact equality, repeat, both restores, terminal no-op |

Each compares model/run identity, clock/status, complete state, outputs, trace, save
and diagnostics at the initial and every settled boundary. A separate repeat uses a
fresh prepared model. After two instants, both the character entry and original factory
restore the candidate save and continue in step to exhaustion. No run reached the
32-settle cap. Extra executable input and changed original input on restore reject.
All existing factory assertions passed, including genuine-draw rollback and admission.

Validation completed once without failures or changed expectations:
- Targeted original + new suites: 2 files / 16 tests PASS; 347.74 seconds wall time.
- TypeScript: node node_modules/typescript/bin/tsc -b --pretty false, exit 0.
- Reference boundary check PASS.
- Research accounting PASS: 0 active / 18 conditional / 4 closed / 0 unowned;
  103 checked verdict headings / 4318 reports. The different historical total remains 109.
- Whitespace, document limits and staged-size checks PASS before commit.

The test command stayed below 10 minutes; remaining checks each took under a minute,
and combined validation remained below 30 minutes. One validation command ran at a
time; the existing Vitest runner scheduled its two files normally. No extra corpus,
browser, build, mutation campaign or verifier was added. New evidence is this one small
result document, within 20 files / 5 MiB. Verification stops on this pass.

## Remaining work

This does not close any of the 21 Campaign 3 member mappings or 132 family clauses,
prove joint psychological behavior, or satisfy general configuration admission.
RO-C3-011 retains its conditional diagnostic limitation; no repair is claimed.
Next is the M2 classified mechanism table and its required owner review. M2a follows
before broader integration. No M2 table review, law selection, UI or Campaign 4 entry
is implied by M1 completion.
