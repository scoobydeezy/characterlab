# Later matched challenge — proposed first regulatory probe

2026-09-07. **RESEARCH TARGET ACCEPTED; drafting authorized. No shape acceptance, allocation or implementation.**

The user selected the diagnostic R0+D probe, with a separate later instant and separate governed
opportunity. The proposal below is retained as the reviewed history. The
[first shape draft](CAMPAIGN2_REGULATORY_PROBE_DRAFT.md) records the accepted constraints and an
expressibility gap: existing X contains observation references, so scalar differences do not
automatically change X/E/L bytes. The user subsequently accepted the narrow first witness at
permitted 203, explicitly preserving equal X/E/L and leaving cognitive divergence/parent gates
open. Revision 2 proposes the remaining shape, without allocation or implementation authority.

## Why this needs a decision

ADAPT's frozen control 9 requires later divergence through changed adaptation state, with the
first character-side divergence descending from a later permitted observation. PHEN-ADAPT-001
1.10.0-draft explicitly includes a later sensor/performance opportunity. The current fixed-pulse
bridge never consumes adaptation state. Neither REG's exact reference formula nor observation's
measurement contract defines a physiological or performance response law.

`campaign2LaterChallengeScope.test.ts` runs the same frozen model with first counts 0/1, followed
by the same later count-zero source. Adaptation states differ and allocator positions match,
but the later observation/X/E/L bytes remain identical. This is correct fixed-pulse behavior.
It is evidence of the missing response seam, not a PHEN-ADAPT PASS or a reason to change that model.

## Recommended research choice

Use a **governed diagnostic regulatory probe** as the first thin later challenge. The probe
observes the already-defined effective regulatory operating point R0(C,V,T)+D(C,V).
It is a synthetic measurement fixture, not a claim that this number is an ordinary visible
physiological outcome, an appraisal, reward, skill score or success expectation.

The proposed causal path is:

    retained regulatory displacement
        + accepted REG reference at the probe instant
        → governed truth-side diagnostic readout
        → permitted observation through an explicit probe channel
        → existing observer-safe SEM/EVID handling where applicable

The experimental pair would retain the same model, initial state, seed, input topology and
allocation positions. Only the first exposure count differs. A first observation made before
that instant's adaptation write remains equal. A matched later readout can differ because the
retained displacement differs. A separately governed unavailable-probe control must preserve
the absence of character access. An unobserved readout must not leak through E/L or provenance.

This choice reuses REG's accepted R0+D meaning; it does not choose a new saturation, decay,
threshold or stimulus-response equation. The unknown is whether this explicitly diagnostic
phenomenon is the intended first positive challenge, rather than a physiological/performance one.

## Required shape work after that choice

- Declare the exact read capability, regulatory key, truth-side output and event relation.
  REG remains immutable and does not acquire a body/state callback; its consumer owns the
  admitted displacement read. No cognitive state or character-learning write is added.
- Define probe availability and observer permission explicitly. Neither state presence nor
  an occurrence ID grants observation. Fix first-divergence and hidden-readout controls.
- Set the exact scalar encoding/domain and observation-unit/profile relation. Reusing
  RegulatoryVariableId as ObservationUnitId is forbidden. The current singleton
  unit/fixture-pulse is not silently reinterpreted as a regulatory measurement unit.
- Preserve the existing SEM reservation, provenance and lane boundaries. Do not assume
  numeric readouts create new classification, appraisal or expectation fields in X/E/L.
  A later observation can be the first character-side divergence without inventing richer EVID.
- Establish a separately reviewed bridge/model/profile binding. Keep the frozen bounded .2
  model as its accepted fixed-pulse control. Review symbolic identities before any permanent
  member allocation; no new identifier or RulesVersion name is assigned by this proposal.

## Alternative

Start with an ordinary physiological response or procedural-performance challenge. That needs
a separately accepted response/attempt/outcome contract: what it reads, the causal transfer
rule, units/bounds, observation opportunity and historical controls. REG and ADAPT do not
determine that rule. It would be a broader semantic undertaking than the diagnostic probe.

SUB-012 remains an available bounded-response candidate/control, not authority to select a
curve here. SUB-009 governs the paired intervention and SUB-008 the first-divergence evidence.
No historical mechanism is imported, retired or promoted by this proposal.

## Current disposition

FCT-C is qualified under its accepted split scope, and remaining mechanical qualification can
continue independently. ADAPT/PHEN-ADAPT and Campaign 2 remain open. This is the next substantive
choice for the missing later-observation positive witness, not a request to weaken the gate or
to widen the frozen fixed-pulse model.

**Original requested ruling (now accepted):** accept the diagnostic R0+D probe as the first later-challenge target for
shape drafting, or select an ordinary physiological/procedural response instead. Choosing the
probe authorizes drafting only; its semantics, profile, allocation and implementation gates
still require their normal closure.
