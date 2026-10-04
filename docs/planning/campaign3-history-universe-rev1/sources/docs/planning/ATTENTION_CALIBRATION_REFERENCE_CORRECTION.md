# Attention calibration reference correction

2026-09-12. Correct-forward draft bookkeeping before whole symbolic acceptance.

EncodingEvaluation.Calibration, RetainedEncoding.Calibration and
SpatialPreparation.Calibration name the actual committed calibration definition used
by the transition. The earlier draft typed these as GovernedContentDefinitionId,
but the concrete registry definition binding uses existing DefinitionId. Those are
different accepted identities, not interchangeable encodings or aliases.

Use DefinitionId for these three fields. No new identity family or translation table
is needed. DefinitionId remains the actual registry identity; its exact referenced
schema/purpose and membership must be checked by the successor definition compiler.
Namespace membership alone does not establish that a definition is an encoding or
spatial calibration or that it belongs to the executing committed model.

The forward wrapper revision2 changes only these three field types. The companion
role revision2 changes exactly their scalar role family/requirement. Both original
reviewed packets and receipts remain historical evidence of the earlier draft. No
allocated or public runtime record changes; no frozen model bytes are rewritten.

GovernedContentDefinitionId remains valid for its existing governed-content purposes.
This correction does not rename or repurpose it. In particular, a calibration reference
is not a character identity, perceived object or evidence occurrence.
