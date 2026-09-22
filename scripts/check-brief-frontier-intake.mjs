import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const base = 'docs/planning/';
const target = `${base}CAMPAIGN3_BRIEF_FRONTIER_INTAKE_REV1.json`;
const auditPath = `${base}CAMPAIGN3_EXIT_AUDIT_REV9.json`;
const audit = JSON.parse(fs.readFileSync(auditPath, 'utf8'));
const registry = JSON.parse(fs.readFileSync(`${base}RESEARCH_OBLIGATIONS.json`, 'utf8'));
const packages = ['AGENCY', 'GOALS', 'CONTROL', 'INFERENCE', 'AFFECT', 'MEMORY',
  'SOCIAL', 'REGULATION', 'DEPENDENCE', 'RELATIONSHIP', 'IDENTITY', 'LONGITUDINAL', 'SKILL_PRESERVATION'];
const defaults = ['REGULATION', 'REGULATION', 'MEMORY', 'INFERENCE', 'AFFECT',
  'CONTROL', 'GOALS', 'SKILL_PRESERVATION', 'DEPENDENCE', 'SOCIAL', 'RELATIONSHIP',
  'IDENTITY', 'SOCIAL', 'AGENCY', 'LONGITUDINAL'];
const overrides = {
  'BRIEF-12.1-6': 'CONTROL', 'BRIEF-12.1-7': 'CONTROL',
  'BRIEF-12.2-6': 'GOALS', 'BRIEF-12.5-6': 'MEMORY',
  'BRIEF-12.6-5': 'GOALS', 'BRIEF-12.9-3': 'CONTROL',
  'BRIEF-12.12-3': 'AGENCY',
};
const families = audit.brief.families.map((family, index) => ({
  ...family,
  clauses: family.clauses.map(clause => ({ ...clause,
    primaryPackage: overrides[clause.id] ?? defaults[index],
    routing: clause.status === 'QUALIFIED BOUNDED' ? 'PRESERVE' : 'RESEARCH',
  })),
}));
const sourcePaths = [auditPath, audit.brief.source.path ?? audit.brief.source,
  'CHARACTER_ARCHITECTURE.md', `${base}CAMPAIGN3_DECISION_AND_ESCALATION_POLICY.md`,
  `${base}REFERENCE_MECHANISM_LEDGER.md`, `${base}CAMPAIGN3_BRIEF_FRONTIER_INTAKE.md`,
  `${base}AGENCY_INTERFERENCE_READINESS.md`];
const snapshot = {
  version: 'brief-frontier-intake/1', date: '2026-09-22',
  disposition: 'LOCAL DISPOSITION — prioritization only; no qualification or implementation admission',
  sources: sourcePaths.map(path => ({ path, sha256: crypto.createHash('sha256').update(fs.readFileSync(path)).digest('hex') })),
  packageOrder: packages, selectedFirstSlice: `${base}AGENCY_INTERFERENCE_READINESS.md`,
  counts: { families: families.length, clauses: families.flatMap(f => f.clauses).length,
    statuses: Object.fromEntries(['QUALIFIED BOUNDED', 'PARTIAL', 'BLOCKED'].map(status =>
      [status, families.flatMap(f => f.clauses).filter(c => c.status === status).length])) },
  families,
};
function validate(value) {
  assert.equal(value.families.length, 15);
  const clauses = value.families.flatMap(f => f.clauses);
  assert.equal(clauses.length, 132);
  assert.equal(new Set(clauses.map(c => c.id)).size, 132);
  for (const [i, family] of value.families.entries()) {
    const stripped = { ...family, clauses: family.clauses.map(({ primaryPackage, routing, ...clause }) => {
      assert(packages.includes(primaryPackage));
      assert.equal(routing, clause.status === 'QUALIFIED BOUNDED' ? 'PRESERVE' : 'RESEARCH');
      for (const path of clause.evidence) assert(fs.existsSync(path), path);
      for (const id of clause.obligations) assert(registry.obligations.some(o => o.id === id), id);
      return clause;
    }) };
    assert.deepEqual(stripped, audit.brief.families[i]);
  }
}
validate(snapshot);
if (process.argv.includes('--self-test')) {
  for (const mutate of [
    s => s.families[0].clauses.pop(),
    s => { s.families[0].clauses[0].id = s.families[0].clauses[1].id; },
    s => { s.families[0].clauses[0].primaryPackage = 'UNKNOWN'; },
    s => { s.families[0].clauses[0].status = 'BLOCKED'; },
  ]) { const bad = structuredClone(snapshot); mutate(bad); assert.throws(() => validate(bad)); }
}
if (process.argv.includes('--write')) fs.writeFileSync(target, JSON.stringify(snapshot, null, 2) + '\n', { flag: 'wx' });
const saved = JSON.parse(fs.readFileSync(target, 'utf8'));
validate(saved);
assert.deepEqual(saved, snapshot, 'Intake source or routing drift; review before creating a successor');
console.log(JSON.stringify({ checked: target, ...snapshot.counts, behavioralQualification: false }));
