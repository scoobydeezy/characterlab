# General attention source integration — revision 7

2026-09-13. LOCAL DISPOSITION — no owner ruling required. GA remains OPEN.

The [panel/body opportunity component](../formal/PANEL_BODY_OPPORTUNITY_COMPONENT.md)
now samples the actual two sources and freezes one shared SEM experience. Presence
comes from returned observations. All four panel/body presence cases run in both
lanes; body absence may coexist with a real panel experience, and zero acquisition
capacity does not suppress a present body cue. Support contains exactly present
observations. No second experience is allocated for the panel.

Self-review found and corrected a panel-state alias: the returned context could
share its event-file object with the retained window. Outputs are now detached.
The [transaction wrapper](../formal/TRIAL_PANEL_TRANSACTION_COMPONENT.md) prepares
the actual event-file operation without publishing it. Freeze succeeds before
commit; discarded, failed and stale candidates cannot overwrite current context.
The enclosing public runtime still owes allocator and whole-instant rollback.

[21 focused checks](PANEL_BODY_OPPORTUNITY_TESTS_REV3.json) and
[seven source substitutions](PANEL_BODY_OPPORTUNITY_REVIEW_REV1.json) pass. Earlier
test revisions1/2 failed during test fixture construction: they omitted required
members of the accepted three-reserve source. The fixture was corrected; the
three-reserve production contract was not weakened. TypeScript also passes.

The actual before/after observations in the four-trial attribution fixture now
consume this composed source and read intervals from its canonical461/462 samples.
The after experience freezes in the consequence lane. Its prior retained baseline
remains a read through the actual body recall component. The motion observations
remain the separately sourced position-display views from revision6.
[22 integration checks](PANEL_BODY_SOURCE_COMPOSITION_TESTS_REV1.json) preserve focal
attribution, absent baseline/context/position controls, source budgets and downstream
retention distinctions. Earlier fixture mutation receipts retain historical scope.

The original motion acquisitions still use fixture SEM assembly and local JSON
encoding, and the body formation selector/subject admissions remain premises.
Full visual track/binding/selected-witness attachment, canonical carrier and owner
registration, qualified result delivery, allocation and complete-prefix persistence
are OPEN. No corpus or frozen public factory was changed. These source components
are progress toward the public bridge, not public qualification or GA completion.
