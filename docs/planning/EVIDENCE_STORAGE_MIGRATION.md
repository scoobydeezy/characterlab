# Lossless evidence storage migration — 2026-10-04

Owner-authorized repository maintenance; no scientific verdict or reduction.
Counters1519/0 and all scientific qualifications remain unchanged.

The generated historical units index was219,612,115 bytes; its marked-occurrence
subset78,445,920 bytes. Both were introduced in the single unpushed Values checkpoint.
The biological result receipt was60,569,215 bytes and also existed in published history.
All three current files are now stored as deterministic gzip archives with original
and compressed lengths/SHA-256 hashes in evidence-archives/manifest.json. Original
uncompressed files remain locally at the same ignored paths. Existing source hashes,
IDs, frozen methods, scientific receipts and readers are unchanged.

Compressed sizes are32,625,797;11,976,020; and1,456,868 bytes respectively. The goal
is tracked files below50,000,000 bytes, conservatively below the hosting warning.
No blanket JSON/JSONL ignore rule is introduced. Build *.tsbuildinfo and personal
.claude/settings.local.json are ignored; the tracked build cache is removed from
the current index, not from disk.

Run npm run evidence:restore after cloning and before research checks. It checks
archive hashes, verifies the complete decompressed bytes, then publishes a missing
original without replacing existing files. Changed existing evidence fails closed.
npm run evidence:verify validates archives without creating missing originals.
The restore tests cover exact bytes, repeat use, existing-file mismatch, compressed
and decompressed hash rejection, path escape and excessive decompressed size.

The unpushed checkpoint is amended to exclude the original large indexes entirely
from outgoing history. Older published commits are not rewritten; the historical
biological result remains there. npm run check:git-size checks staged/index blobs;
node scripts/check-git-file-sizes.mjs --since=origin/main checks outgoing history.
Local reflog recovery retains the old checkpoint; it is not part of the new branch
history sent by a normal push. No push or force-push is part of this maintenance.

RO019 and RO021 retain topology/history preservation duties. This is a reversible
storage change, not a new experiment, a retired comparator or Campaign3 exit.
