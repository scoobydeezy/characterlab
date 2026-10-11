# EPI corpus adapter qualification

2026-10-11. Workbench IN PROGRESS. PHEN-EPI-001 now has an executable read adapter
covering its entire retained frozen public cohort. Browser integration, explanation
language qualification and full workbench acceptance remain open.

`epiAdapter.ts` executes `epi-public/0.1-candidate` through unchanged prepare/create/
restore public functions. It admits exactly the72 frozen programs in
EPI_PUBLIC_EXPERIMENT_PLAN_REV1.json:12 original calendars across three observation
profiles and two numeric profiles, all with the original seed19. Empty initial state,
original byte calendars and model/run identities are preserved. The adapter does not
import test fixtures, invent stimuli or expose runtime intervention.

Safe applied measurement, PotentialLeak and OverflowLeak remain distinct. The latter
two are deliberately VIOLATING researcher controls and carry lawfulCharacterAccess=false;
they are not lawful sensor or character access. `characterOutputs` comes directly from
the public character projection. `researchOutputs` and the full raw trace remain
separate diagnostic surfaces. Raw Record912 physical truth is never renamed character
knowledge. The finite six-output roster and two state owners retain their contract
scope; no arbitrary trace redactor or general observer-access theory is inferred.

Detached snapshots preserve exact state paths, committed events, character projection,
research outputs and separate model/run/state/save/character hashes. Complete-prefix
checkpoint restore authenticates the original program, seed and every preceding save
before native restore. Limits:64 complete instants and16MB checkpoint bytes. Concurrent
commands and mismatched programs/prefixes fail explicitly. No authoritative runtime or
formal seam semantics were changed.

Verification:

- Two focused tests pass: safe hidden-truth pair has equal character outputs/state and
  different researcher outputs/save; snapshots are detached; leakage is visibly classified;
  prefix1 restoration of a leak control continues the entire exact tail, and cross-program
  restoration fails rather than relabeling the checkpoint.
- `workbench-epi-parity-rev1/receipt.json` PASS:72 programs/240 exact prefixes. Every
  adapter prefix is compared with direct public native save/state/character hashes.
  Every final save, character state and output hash agrees with the retained original
  EPI_PUBLIC_EXPERIMENT_REV1 result, including terminal/prefix counts.
- Both numeric profiles preserve all four Safe hidden-truth pairs' character outputs
  and state while researcher outputs differ. Both violating laws remain detectable on
  the established pair under both numeric profiles. This preserves the accepted finite
  boundary; it is not a new psychological or general observer qualification.
- Three hash-bound instrument source versions and original plan/result digests are
  preserved. Production TypeScript/build/reference boundary pass; no UI chunk uses
  this adapter yet, so this build is not browser execution evidence.
- Evidence restore/research checks pass:0 active/18 conditional/4 closed/0 unowned;
  103 C3 verdicts/4317 reports. The corpus coverage manifest records adapter parity,
  not UI or language completion. No verdict or research obligation was amended.

LOCAL DISPOSITION: retain the native explicit character/research projection separation
and known violating controls. Next integrate the EPI profile into the workbench with
equally explicit authority labels, controlled pair inspection, replay and participation.
Remaining corpus adapters, full language audit and the integrated Campaign4 entry
demonstration remain mandatory. No owner ruling or reduction work is introduced.
