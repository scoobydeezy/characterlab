/**
 * Work-order item 2 (CAMPAIGN3_WORK_ORDER_2026_09_14.md): promote the eleven reviewed
 * Campaign 3 intake proposals into corpus/0.28.0.
 *
 * Membership asserts that an obligation EXISTS. It does not assert that it passes:
 * ten of the eleven enter as BLOCKED or PARTIAL, per CAMPAIGN3_ENTRY_READINESS.md and
 * CAMPAIGN3_POST_EMB_COVERAGE.md.
 *
 * Requirement text is copied verbatim from CAMPAIGN3_CORPUS_INTAKE_DRAFT.md. Only the
 * heading, the version token and an added status line differ. The ten existing members
 * are preserved byte-for-byte and asserted so. The digest is computed by the project's
 * own cenc/1 encoder via compileCorpusManifest; nothing is hand-written.
 */
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createServer} from 'vite';

const CORPUS = 'docs/planning/PHENOMENON_CORPUS.md';
const INTAKE = 'docs/planning/CAMPAIGN3_CORPUS_INTAKE_DRAFT.md';
const RECEIPT = 'docs/planning/CORPUS_0_28_0_PROMOTION_REV1.json';
const PRIOR_DIGEST = '3cb09115d90485d5975968ffca419a4960a398326b6b6339a5b1e8e8fdcec276';

// label -> [PhenomenonId, Brief family, status at publication]
const PROMOTIONS = [
  ['ATTENTION',    'PHEN-ATTN-001',   '12.3 / 12.6',        'PARTIAL — bounded active selection witnessed (VER-C3-ATTN-001); encoding footprint and later retrieval probe BLOCKED'],
  ['BODY',         'PHEN-BODY-001',   '12.1 / 12.2',        'PARTIAL — kinetics and observer resolution witnessed (VER-C3-EMB-001); ownership three-model comparison UNRESOLVED'],
  ['BELIEF',       'PHEN-BELIEF-001', '12.4 / 12.5',        'BLOCKED — no belief seam; ORD-001 open'],
  ['AFFECT',       'PHEN-AFFECT-001', '12.5 / 12.6',        'BLOCKED — no factorized appraisal; ORD-005 open'],
  ['WORKSPACE',    'PHEN-WORK-001',   '12.6',               'BLOCKED — no general control competition'],
  ['SKILL',        'PHEN-SKILL-001',  '12.8 / 12.14',       'BLOCKED — execution is not skill-dependent'],
  ['SOCIAL',       'PHEN-SOCIAL-001', '12.10 / 12.13 / 12.14', 'BLOCKED — no social/communication seam; ORD-002 open'],
  ['MULTISOURCE',  'PHEN-MULTI-001',  '12.2 / 12.5',        'PARTIAL — two heterogeneous families witnessed (VER-C3-EMB-001); cross-family shared fact BLOCKED'],
  ['HABIT',        'PHEN-HABIT-001',  '12.9',               'BLOCKED — no habit/reinforcement contract'],
  ['RELATIONSHIP', 'PHEN-REL-001',    '12.11',              'BLOCKED — no relationship state'],
  ['LONGITUDINAL', 'PHEN-LONG-001',   '12.15',              'BLOCKED — no longitudinal horizon'],
];

const corpus = fs.readFileSync(CORPUS, 'utf8');
const intake = fs.readFileSync(INTAKE, 'utf8');
assert(corpus.includes('**CorpusVersion:** `corpus/0.27.0`'), 'corpus is not at 0.27.0');
assert(corpus.includes('**CorpusManifestDigest:** `' + PRIOR_DIGEST + '`'), 'prior digest mismatch');

// ---- existing members, parsed with the audit script's own regex ----
const MEMBER_RE = /^\| `(PHEN-[A-Z]+-001)` \| `([^`]+)`/gm;
const existing = [...corpus.matchAll(MEMBER_RE)].map(([, name, version]) => ({name, version}));
assert.equal(existing.length, 10);

// ---- extract each intake section verbatim ----
const sections = new Map();
const heads = [...intake.matchAll(/^## ([A-Z]+) — (.+)$/gm)];
for (let i = 0; i < heads.length; i++) {
  const start = heads[i].index + heads[i][0].length;
  const end = i + 1 < heads.length ? heads[i + 1].index : intake.length;
  sections.set(heads[i][1], {title: heads[i][2], body: intake.slice(start, end).replace(/\s+$/, '')});
}

const rendered = [], newMembers = [];
for (const [label, id, family, status] of PROMOTIONS) {
  const s = sections.get(label);
  assert(s, `intake section missing: ${label}`);
  // Only the version token changes; every requirement clause is carried verbatim.
  assert(s.body.includes('intake/0.1-draft'), `${label} has no intake version token`);
  const body = s.body.replace('intake/0.1-draft', '`1.0.0-draft`');
  assert.equal(
    body.replace('`1.0.0-draft`', 'intake/0.1-draft'), s.body,
    `${label} body changed by more than the version token`,
  );
  rendered.push(`## \`${id}\` — ${s.title}\n${body.replace(/^\n+/, '\n')}\n\n**Brief family:** ${family}.\n**Status at promotion:** ${status}.\n\n---\n`);
  newMembers.push({name: id, version: '1.0.0-draft'});
}

const all = [...existing, ...newMembers].sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0);
assert.equal(all.length, 21);
assert.equal(new Set(all.map(m => m.name)).size, 21);

const server = await createServer({configFile: false, server: {middlewareMode: true, preTransformRequests: false}, optimizeDeps: {noDiscovery: true, include: []}, appType: 'custom'});
try {
  const {compileCorpusManifest} = await server.ssrLoadModule('/src/substrate/contentManifest.ts');
  const {typedIdentifier, text} = await server.ssrLoadModule('/src/substrate/canonicalEncoding.ts');
  const hex = b => Buffer.from(b).toString('hex');
  const compile = ms => compileCorpusManifest(ms.map(m => ({phenomenonId: typedIdentifier(23010n, text(m.name)), version: m.version})));

  // Encoder validation: reproduce the accepted 0.27.0 digest before trusting a new one.
  const prior = await compile(existing);
  assert.equal(hex(prior.digest), PRIOR_DIGEST, 'could not reproduce the accepted 0.27.0 digest');

  const next = await compile(all);
  const digest = hex(next.digest);
  assert.notEqual(digest, PRIOR_DIGEST);

  // ---- rewrite the corpus document ----
  let out = corpus
    .replace('**CorpusVersion:** `corpus/0.27.0`', '**CorpusVersion:** `corpus/0.28.0`')
    .replace('**CorpusManifestDigest:** `' + PRIOR_DIGEST + '`', '**CorpusManifestDigest:** `' + digest + '`');

  const table = all.map(m => {
    const p = PROMOTIONS.find(x => x[1] === m.name);
    if (p) return `| \`${m.name}\` | \`${m.version}\` | Campaign 3 intake, promoted 2026-09-14 | see the entry below; ${p[3].split(' — ')[0]} at promotion |`;
    return corpus.split('\n').find(l => l.startsWith(`| \`${m.name}\` |`));
  }).join('\n');
  const tableStart = out.indexOf('| PhenomenonId | Version | Historical intake | Primary obligation |');
  const headerEnd = out.indexOf('\n', out.indexOf('\n', tableStart) + 1);
  const tableEnd = out.indexOf('\n\n---', tableStart);
  out = out.slice(0, headerEnd + 1) + table + out.slice(tableEnd);

  const anchor = '## Entry template for subsequent intake';
  assert(out.includes(anchor));
  out = out.replace(anchor, rendered.join('\n') + '\n' + anchor);

  const note = `**Current commitment:** corpus/0.28.0, accepted 2026-09-14. The ten corpus/0.27.0 members are
preserved byte-for-byte in identity, version and obligation. Eleven reviewed Campaign 3
intake proposals are promoted to membership with their requirement text carried verbatim
from CAMPAIGN3_CORPUS_INTAKE_DRAFT.md. **Membership asserts that an obligation exists; it
does not assert that the obligation passes** — ten of the eleven enter BLOCKED or PARTIAL.
Thirteen of the Brief's fifteen required families now have at least one named member.
See CORPUS_0_28_0_PROMOTION_REV1.json and CORPUS_0_28_0_SUCCESSOR_MANIFEST.md.

**Prior commitment:** corpus/0.27.0 at digest
\`${PRIOR_DIGEST}\` remains a distinct historical
commitment. Verdicts recorded against it keep that version and digest.`;
  const oldNote = out.match(/\*\*Current commitment:\*\*[\s\S]*?Acceptance of this manifest does not imply every member phenomenon has passed\./);
  assert(oldNote, 'could not locate the prior commitment note');
  out = out.replace(oldNote[0], note + '\n\nAcceptance of this manifest does not imply every member phenomenon has passed.');

  fs.writeFileSync(CORPUS, out);

  // ---- preservation assertions on the written document ----
  const written = fs.readFileSync(CORPUS, 'utf8');
  const writtenMembers = [...written.matchAll(MEMBER_RE)].map(([, name, version]) => ({name, version}));
  assert.equal(writtenMembers.length, 21);
  for (const e of existing) {
    const w = writtenMembers.find(x => x.name === e.name);
    assert(w && w.version === e.version, `existing member altered: ${e.name}`);
    // each preserved member's own section body must be unchanged
    const body = s => {
      const i = s.indexOf(`## \`${e.name}\` —`);
      return i < 0 ? null : s.slice(i, s.indexOf('\n---', i));
    };
    assert.equal(body(written), body(corpus), `preserved section changed: ${e.name}`);
  }
  const reparsed = await compile(writtenMembers);
  assert.equal(hex(reparsed.digest), digest, 'written document does not reproduce the computed digest');

  const fp = p => ({path: p, sha256: createHash('sha256').update(fs.readFileSync(p)).digest('hex')});
  fs.writeFileSync(RECEIPT, JSON.stringify({
    status: 'CORPUS 0.28.0 COMPILED AND PINNED',
    workOrder: 'CAMPAIGN3_WORK_ORDER_2026_09_14.md item 2',
    corpusVersion: 'corpus/0.28.0',
    corpusManifestDigest: digest,
    canonicalHex: hex(next.canonicalBytes),
    priorCommitment: {corpusVersion: 'corpus/0.27.0', digest: PRIOR_DIGEST, canonicalHex: hex(prior.canonicalBytes)},
    encoderValidation: 'The accepted corpus/0.27.0 digest was recomputed from its ten members before any new digest was trusted; it reproduced exactly.',
    members: {total: 21, preserved: existing.length, promoted: newMembers.length},
    preserved: existing,
    promoted: PROMOTIONS.map(([label, id, family, status]) => ({intakeLabel: label, phenomenonId: id, version: '1.0.0-draft', briefFamily: family, statusAtPromotion: status})),
    ordinalDiscipline: 'PHEN-ATTN-001 takes the first ordinal. ATTN-001 is a seam/decision identifier in a different typed namespace; no PHEN-ATTN-* entry or reservation exists. Ordinals are never skipped for resemblance to another namespace.',
    verbatimGuarantee: 'Each promoted section differs from CAMPAIGN3_CORPUS_INTAKE_DRAFT.md only in its heading, the version token and an appended Brief-family/status line; the script asserts that reversing the version token restores the source body exactly.',
    limits: [
      'Membership is an obligation, not a pass. Ten of the eleven promoted members are BLOCKED or PARTIAL.',
      'No seam is unblocked, no implementation authorized and no mechanism accepted by this promotion.',
      'Verdicts already recorded against corpus/0.27.0 retain that version and digest; they are not invalidated.',
      'Brief families 12.13 (communication, partially covered by PHEN-SOCIAL-001) and the full 12.15 combination remain without a dedicated executable fixture.',
    ],
    sources: [CORPUS, INTAKE, 'scripts/promote-corpus-0-28-0.mjs',
      'docs/planning/CORPUS_0_28_0_SUCCESSOR_MANIFEST.md', 'docs/planning/CAMPAIGN3_ENTRY_READINESS.md',
      'docs/planning/CAMPAIGN3_POST_EMB_COVERAGE.md'].filter(p => fs.existsSync(p)).map(fp),
  }, null, 2) + '\n');

  console.log(JSON.stringify({corpusVersion: 'corpus/0.28.0', digest, members: 21, preserved: 10, promoted: 11,
    priorDigestReproduced: true, briefFamiliesWithAMember: 13}, null, 2));
} finally {
  await server.close();
}
