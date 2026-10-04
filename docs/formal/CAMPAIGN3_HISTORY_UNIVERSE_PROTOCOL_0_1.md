# Campaign3 historical evidence census and occurrence protocol — 0.1

2026-10-03. LOCAL DISPOSITION. Implements the first inventory stages of RO-C3-021;
it does not certify complete reconciliation or Campaign3 exit. Counters1508/0.

Freeze before extraction. Enumerate all Markdown and JSON files physically present
under docs/planning, docs/formal and reference, plus root Markdown documents. Inclusion
is deliberately conservative: this is a candidate evidence universe, not an assertion
that every included draft, archived copy or data row has architectural authority.
Accepted status must come from a reviewed authority/ledger passage, never filename,
regex, date, recency, location or the presence of a PASS field alone. Record every
candidate's path, byte length and SHA256. Snapshot Markdown byte-for-byte; retain JSON
as hash-bound backing files. Do not rewrite earlier source or frozen receipts.

Explicit roots are the North Star, Architecture Map, Research Program Brief, Campaign
Plan, verdict/seam/reference-mechanism ledgers, corpus, formal decision/formula registers,
owner-decision register, escalation and research-bookkeeping policies, final-history gate,
and current routing. Governing scope follows AGENTS.md, not graph traversal. A reference
edge establishes relevance, not acceptance. The historical RESEARCH log is a root because
the preservation ledger explicitly cites it; its findings do not automatically govern.

The RO JSON registry is recorded as a comparison-only exclusion: neither its references,
status nor wording may generate the independent occurrence inventory. It is consulted
only after extraction, when reviewed findings are mapped to owners. This method and its
own generated inventory/checkpoint files are audit machinery, excluded from the historical
candidate census by an explicit path list. No failed cohort or inconvenient result is
excluded by its name or status. All other files in the enumerated domains are included.

For Markdown, retain every nonblank paragraph with exact text, line range and enclosing
heading, including unmarked paragraphs and quoted/code examples. Flag unresolved,
partial, deferred, blocked, untested, derived, compressed, merged, retracted, retired,
not-required, reopen, limitation, equality and explicit nonclaim language. Flags are
review cues, not dispositions. A reviewer must assess unmarked prose too.

For JSON, enumerate string leaves independently of key naming. Keep exact strings that
contain a marker, or ordinary whitespace-delimited prose of at least three words, with
an RFC6901-style pointer. Numerical/canonical-hex payloads remain hash-bound backing
data. Candidate narrative selection is mechanical, not a finding-acceptance test; report
parse errors, ignored primitive counts and unmarked narrative counts. Historical raw
execution data may generate repeated or nonfinding units; do not silently classify them.

Assign each unit a stable SHA256 over original path, original source hash, location and
exact text. Preserve all duplicates as separate occurrences. Track exact relative/link/
bare-filename references from Markdown with source location and deterministic resolution:
source directory, repository root, standard planning/formal/reference locations, then a
unique census basename. Ambiguous and missing citations stay explicit review queues.
Version/contract shorthand and prose references without file suffixes need manual review;
the lexical graph is not a claim of complete semantic bibliography.

Fail verification for missing or altered frozen snapshots/backing files, duplicate unit
IDs, changed extraction machinery, missing inventory artifacts or malformed output.
Separately enumerate live-source drift and additions after the cutoff. A preserved
snapshot can verify while live freshness remains open. A later exit receipt must resolve
every authoritative addition/change through a reviewed delta or successor universe.

Required later work: authority/acceptance classification; semantic review of marked and
unmarked units; exact resolution/supersession or owned conditional debt per material
occurrence; independent adequacy review; source freshness and corpus/family/native-scope
exit dispositions. No automatic RO mapping, closure, verdict, clause promotion or law
retirement is authorized by this extractor. RO019/020/021/022 retain these obligations.
