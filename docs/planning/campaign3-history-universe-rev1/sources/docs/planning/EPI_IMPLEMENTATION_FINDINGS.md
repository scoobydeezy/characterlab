# EPI implementation findings — 2026-09-21

EPI-PREFLIGHT-001: initial model freeze attempt rejected the stage descriptor
with EPI_CODEC list bound before writing any model bytes. The copied LEARN
read-domain list allowed two entries; EPI probe reads two belief and two encoding
leaves. Corrected the unfrozen allocation grammar to four read entries, preserving
two write entries. Subsequent type check at this point only lacked the not-yet
created freeze manifest. No public experiment had run.

EPI-PREFLIGHT-002: plan generation rejected a two-byte fixture seed; run identity
requires exactly32 bytes. The first test receipt records the same admission
failure (no run settlement). Corrected the seed before freezing the public plan;
preserve EPI_PUBLIC_TESTS_REV1.json and use a successor test receipt. No model change.
