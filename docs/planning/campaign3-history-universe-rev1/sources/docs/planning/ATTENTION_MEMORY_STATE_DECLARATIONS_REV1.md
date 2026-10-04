# Attention memory state declaration checkpoint

2026-09-12. Draft symbolic root and accessor declarations, not permanent allocation.

Four separate proposed root records each contain one Entries map: tracking windows
keyed by ObserverId, and episode ledgers, association graphs and presentation ledgers
keyed by actual qualified CharacterId. Each root has one proposed direct accessor;
the three character roots retain separate mutation authorities. Sharing an episodic
state-family label does not merge episode formation and presentation ownership.
Leaves start absent and become complete bounded values. No authored learned history,
partial leaf construction, generic iterator or removal operation is admitted.

Existing SEM241/242 layouts stay unchanged. Counter paths are keyed by ObserverId;
active membership paths use full212/213 perceptual file keys. Reuse the four already
declared attention perception accessors without renumbering, broadening their meaning
or replacing file keys with observer keys. The new tracking window has its own root
and accessor. All required canonical reads must agree with reconstructed tracking;
a private replay cache does not grant unlogged state access.

Character readers first consume the exact required PRJ/IDN descriptor from their
committed registration, read its roster path at the admitted observer, and validate
the returned character under the accepted character-content role. Raw namespace
membership alone is insufficient. The exact qualified character then supplies the
map key for each declared memory leaf. IDN remains immutable and confers no write
capability. No new roster root or projection algorithm is introduced.

Available-cue rank reads all three qualified memory leaves, including absence.
All absent means no episodes; partial presence or inconsistent membership rejects.
Unavailable cue performs only its required projection and no memory reads. Writers
read only their own expected-old leaf and produce their own candidate patch. The
common-B0 sibling barrier and whole-state consistency checks remain mandatory.

The machine review verifies root/key/owner relationships, reuse of existing perception
descriptors, projection prerequisites and exact rank domains. Nine corrupted packets
reject. These are structural checks, not executed canonical role/path validation or
public state access. New names and field layouts are proposed symbols only; no root
number, field number, accessor member or schema version has been permanently allocated.

Next: finish the wrapper scalar/collection roles and source PRJ/registration dependency
manifest, then compose the whole symbolic shape. Numeric review, codecs, model packaging
and public read/write/persistence proof follow that gate.
