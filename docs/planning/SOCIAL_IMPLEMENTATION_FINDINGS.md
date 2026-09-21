# SOCIAL validation findings — 2026-09-21

SOCIAL-IMPL-001: the initial public test supplied an extra runSeed property to the
closed restore argument record. Restore correctly rejected it (BELIEF_FIELDS is
the inherited data-only ingress diagnostic). The fixture now uses exactly the
three restore fields. SOCIAL_PUBLIC_TESTS_REV1.json preserves the failed receipt.

SOCIAL-IMPL-002: the first experiment evaluator removed required occurrence fields
before canonical encoding its order-insensitive comparison. Encoding correctly
rejected that malformed record. The evaluator now normalizes only occurrence IDs
to a common typed zero, retaining every semantic field. The original failed receipt
is SOCIAL_PUBLIC_EXPERIMENT_FAILURE_REV1.json. Model, contract and input-plan bytes
were unchanged. This normalization is only for the reverse-order comparator;
private-state and nonrecipient comparisons require unnormalized byte equality.

SOCIAL-IMPL-003: an invalid-time test accidentally used its timestamp as a receipt
outside the receipt enum, causing the fixture builder to reject before the intended
async admission assertion. The fixture now holds a valid receipt fixed while varying
time and input count. SOCIAL_PRESERVATION_TESTS_REV1.json preserves this failure.
The final read audit also compares full observer-keyed paths, not merely root types.
