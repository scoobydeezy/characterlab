import { describe, expect, it } from 'vitest';
import { EventRoleId } from '../semanticBinding/eventBindings';
import { PerceptualFacetId } from '../semanticBinding/perceptualClassification';
import type { RecognitionResolutionRecord } from '../semanticBinding/recognition';
import {
  GLEN,
  REFERENT,
  createRunAllocator,
  projectObserver,
  stringifyWithBigInts,
  truthBindings,
  recognizeObserverContinuant,
  type CatalogCandidate,
  type ObserverProjection,
} from './fixtures/phenSem001';
import {
  NARRATIVE_PRESENTATION,
  PLAIN_PRESENTATION,
  RENDERER_VIEWPOINTS,
  renderAllViewpoints,
  renderView,
  type RenderRequest,
} from './fixtures/phenSem001Renderer';

/**
 * Glen's own catalog. Seeded observer knowledge: he independently holds these two person
 * candidates, which is why either may legitimately appear in his own account of the event. The
 * truth referents he never holds — the library, the pipe, the action, and himself — are the ones
 * whose appearance in a character view would be a leak.
 */
const MINA_CANDIDATE: CatalogCandidate = {
  candidateSemanticReferentId: 'person.mina', recognitionTemplateId: 'template/mina',
};
const DARIUS_CANDIDATE: CatalogCandidate = {
  candidateSemanticReferentId: 'person.darius', recognitionTemplateId: 'template/darius',
};
const GLEN_CATALOG: readonly CatalogCandidate[] = Object.freeze([MINA_CANDIDATE, DARIUS_CANDIDATE]);

const CATALOG_IDENTITIES: ReadonlySet<string> = new Set(
  GLEN_CATALOG.map((candidate) => candidate.candidateSemanticReferentId));

/** Truth referents that appear nowhere in Glen's catalog. None may reach a character view. */
const NON_CATALOG_TRUTH_REFERENTS: readonly string[] = Object.freeze([
  REFERENT.library.semanticReferentId,
  REFERENT.leadPipe.semanticReferentId,
  REFERENT.skipRope.semanticReferentId,
  REFERENT.glen.semanticReferentId,
]);

interface Scenario {
  readonly first: ObserverProjection;
  readonly resolutionLog: readonly RecognitionResolutionRecord[];
  readonly contemporaneousResolution: RecognitionResolutionRecord;
  readonly correction: RecognitionResolutionRecord;
  /** The first experience serialized before the correction existed. */
  readonly experienceBeforeCorrection: string;
}

/**
 * Glen perceives the actor at t=10 and contemporaneously misrecognises them as Darius. At t=40 he
 * re-encounters the same continuant-file and appends a corrective resolution naming Mina. The
 * first experience is never touched: the correction is a new record in an append-only log.
 */
function misrecognitionScenario(allocatorStart = 5000n): Scenario {
  const allocator = createRunAllocator(allocatorStart);
  const truth = truthBindings();

  const first = projectObserver({ observerId: GLEN, truth, allocator, experienceId: 1n });
  const actorTrack = first.tracksByLabel.get('glen/actor')!;

  const contemporaneousResolution = recognizeObserverContinuant({
    projection: first,
    perceptualReferentId: actorTrack,
    catalog: GLEN_CATALOG,
    assertCandidate: DARIUS_CANDIDATE,
    nextRuntimeId: allocator.next(),
  })!;

  const experienceBeforeCorrection = stringifyWithBigInts(first.experience);

  // A later experience over the same continuant-file: the track continues rather than restarting.
  const second = projectObserver({
    observerId: GLEN,
    truth,
    allocator,
    experienceId: 2n,
    occurredAt: 40n,
    continuantFiles: first.continuantFiles,
    eventFiles: first.eventFiles,
    priorTracksByLabel: first.tracksByLabel,
  });
  expect(second.tracksByLabel.get('glen/actor')).toEqual(actorTrack);

  const correction = recognizeObserverContinuant({
    projection: second,
    perceptualReferentId: actorTrack,
    catalog: GLEN_CATALOG,
    assertCandidate: MINA_CANDIDATE,
    nextRuntimeId: allocator.next(),
    priorResolutionHistory: [contemporaneousResolution],
  })!;

  return {
    first,
    contemporaneousResolution,
    correction,
    experienceBeforeCorrection,
    resolutionLog: Object.freeze([contemporaneousResolution, correction]),
  };
}

const requestFor = (scenario: Scenario): RenderRequest => ({
  projection: scenario.first, resolutionLog: scenario.resolutionLog,
});

const identityTokens = (recordLines: readonly string[]): readonly string[] => recordLines
  .flatMap((line) => line.split('|'))
  .filter((field) => field.startsWith('identity:'))
  .map((field) => field.slice('identity:'.length));

describe('PHEN-SEM-001 viewpoint rendering', () => {
  it('CV-SEM-012 renders the three viewpoints deterministically from typed records', () => {
    const scenario = misrecognitionScenario();
    const request = requestFor(scenario);

    // Rendering is a function, not a process: the same request renders identically every time.
    const once = renderAllViewpoints(request);
    const twice = renderAllViewpoints(request);
    for (const viewpoint of RENDERER_VIEWPOINTS) {
      expect(stringifyWithBigInts(twice.get(viewpoint)))
        .toBe(stringifyWithBigInts(once.get(viewpoint)));
    }

    // And a function of the records rather than of where the run sat in the allocator. The same
    // scenario driven from a different allocator origin holds every occurrence ordinal different
    // while rendering byte-identically.
    const shifted = misrecognitionScenario(90000n);
    expect(shifted.first.perceivedBindings.map((binding) => binding.perceivedBindingId))
      .not.toEqual(scenario.first.perceivedBindings.map((binding) => binding.perceivedBindingId));
    expect(shifted.correction.recognitionResolutionId)
      .not.toBe(scenario.correction.recognitionResolutionId);

    const shiftedViews = renderAllViewpoints(requestFor(shifted));
    for (const viewpoint of RENDERER_VIEWPOINTS) {
      expect(shiftedViews.get(viewpoint)!.recordLines).toEqual(once.get(viewpoint)!.recordLines);
    }
  });

  it('CV-SEM-012 derives record lines from every typed record family it claims to consume', () => {
    const scenario = misrecognitionScenario();
    const view = renderView(
      'contemporaneous-character', requestFor(scenario), PLAIN_PRESENTATION);

    // Glen's permitted projection: the actor coarsened to Participant, the place preserved, the
    // instrument left unresolved. Each line carries that observer's role evidence, the facets his
    // own classifications assert of the bound continuant, and the identity his own recognition
    // resolved — three separate record families, none of them assumed by the renderer.
    expect(view.recordLines).toEqual([
      `role:${EventRoleId.Location}|continuant#0`
      + `|facets:${PerceptualFacetId.AppearsInteriorSpaceLike}=true|identity:unrecognised`,
      `role:${EventRoleId.Participant}|continuant#1`
      + `|facets:${PerceptualFacetId.AppearsPersonLike}=true|identity:person.darius`,
      'role:unresolved|continuant#2'
      + `|facets:${PerceptualFacetId.AppearsDiscreteObjectLike}=true,`
      + `${PerceptualFacetId.AppearsElongated}=true|identity:unrecognised`,
    ]);

    // The coarsened role is the one Glen observed, not the one truth holds.
    expect(view.recordLines.some((line) => line.startsWith(`role:${EventRoleId.Actor}|`))).toBe(false);

    // The renderer emits in the records' own canonical order rather than imposing one: the
    // accepted seam orders perceived bindings by role key and classification records by facet id,
    // so the rendered sequences must already satisfy those orders without the renderer sorting.
    const roleSequence = view.recordLines.map((line) => line.split('|')[0]);
    expect(roleSequence).toEqual([...roleSequence].sort());
    for (const line of view.recordLines) {
      const facets = line.split('|').find((field) => field.startsWith('facets:'))!
        .slice('facets:'.length).split(',');
      expect(facets).toEqual([...facets].sort());
    }
  });

  it('CV-SEM-012 changes no authoritative record when presentation metadata changes', () => {
    const scenario = misrecognitionScenario();
    const request = requestFor(scenario);

    const before = stringifyWithBigInts({
      projection: scenario.first, resolutionLog: scenario.resolutionLog,
    });

    const plain = renderAllViewpoints(request, PLAIN_PRESENTATION);
    const narrative = renderAllViewpoints(request, NARRATIVE_PRESENTATION);

    for (const viewpoint of RENDERER_VIEWPOINTS) {
      // The record-derived layer is presentation-independent...
      expect(narrative.get(viewpoint)!.recordLines).toEqual(plain.get(viewpoint)!.recordLines);
      // ...while the display surface genuinely responds to the metadata, so the invariance above
      // is not the trivial one of a renderer that ignores presentation entirely.
      expect(narrative.get(viewpoint)!.displayLines)
        .not.toEqual(plain.get(viewpoint)!.displayLines);
      expect(narrative.get(viewpoint)!.displayLines[0]).toBe(NARRATIVE_PRESENTATION.heading);
      expect(plain.get(viewpoint)!.displayLines[0]).toBe(PLAIN_PRESENTATION.heading);
    }

    // The role display name reaches the surface and nothing else: the record line still carries
    // the registered role token.
    const characterDisplay = narrative.get('contemporaneous-character')!.displayLines.join('\n');
    expect(characterDisplay).toContain('the place');
    expect(narrative.get('contemporaneous-character')!.recordLines.join('\n'))
      .not.toContain('the place');

    // And every authoritative record is byte-identical after both renders.
    expect(stringifyWithBigInts({
      projection: scenario.first, resolutionLog: scenario.resolutionLog,
    })).toBe(before);
  });

  it('CV-SEM-012 lets only the omniscient viewpoint reach truth identities', () => {
    const scenario = misrecognitionScenario();
    const views = renderAllViewpoints(requestFor(scenario));

    for (const viewpoint of ['contemporaneous-character', 'current-reinterpretation'] as const) {
      const rendered = stringifyWithBigInts(views.get(viewpoint));

      // No truth-side binding identity or ancestry field in a character view.
      expect(rendered).not.toContain('truth-binding:');
      expect(rendered).not.toContain('truth-referent:');
      expect(rendered).not.toContain('truth-role:');

      // No truth referent Glen does not independently hold.
      for (const referentId of NON_CATALOG_TRUTH_REFERENTS) {
        expect(rendered).not.toContain(referentId);
      }

      // The referent identities a character view does carry are exactly catalog members. Closed
      // vocabulary rather than substring scanning, so a legitimately-crossing token cannot pass
      // and an illegitimate one cannot hide.
      for (const identity of identityTokens(views.get(viewpoint)!.recordLines)) {
        if (identity === 'unrecognised' || identity === 'withdrawn') continue;
        expect(CATALOG_IDENTITIES.has(identity)).toBe(true);
      }
    }

    // The omniscient viewpoint reaches all of it: one ancestry line per perceived binding, naming
    // the truth binding and referent, including the ones no catalog holds.
    const omniscient = views.get('omniscient')!;
    const ancestryLines = omniscient.recordLines.filter((line) => line.startsWith('truth-binding:'));
    expect(ancestryLines).toHaveLength(scenario.first.perceivedBindings.length);
    const omniscientText = ancestryLines.join('\n');
    expect(omniscientText).toContain(REFERENT.library.semanticReferentId);
    expect(omniscientText).toContain(REFERENT.leadPipe.semanticReferentId);
    // It also carries the truth Actor role the character only ever saw coarsened.
    expect(omniscientText).toContain(`truth-role:${EventRoleId.Actor}`);
    expect(omniscientText).toContain(`observed-role:${EventRoleId.Participant}`);

    // The nth ancestry line is the ancestry of the nth character line: both halves are emitted in
    // the same canonical binding order, so a mis-paired ancestry cannot hide behind a sort.
    const characterLines = omniscient.recordLines.filter((line) => line.startsWith('role:'));
    expect(characterLines).toHaveLength(ancestryLines.length);
    for (const [index, ancestryLine] of ancestryLines.entries()) {
      const label = characterLines[index].split('|')[1];
      expect(ancestryLine).toContain(`perceived-as:${label}`);
    }

    // Both character viewpoints are strict subsets of the omniscient one: the omniscient view adds
    // the ancestry, it does not tell a different story about what was perceived.
    for (const line of views.get('current-reinterpretation')!.recordLines) {
      expect(omniscient.recordLines).toContain(line);
    }
  });

  it('CV-SEM-012 separates the contemporaneous account from the current reinterpretation', () => {
    const scenario = misrecognitionScenario();
    const { experienceBeforeCorrection } = scenario;
    const request = requestFor(scenario);

    const contemporaneous = renderView('contemporaneous-character', request, PLAIN_PRESENTATION);
    const current = renderView('current-reinterpretation', request, PLAIN_PRESENTATION);

    // What Glen took the actor to be at the time, and what he takes them to be now.
    expect(identityTokens(contemporaneous.recordLines)).toContain('person.darius');
    expect(identityTokens(contemporaneous.recordLines)).not.toContain('person.mina');
    expect(identityTokens(current.recordLines)).toContain('person.mina');
    expect(identityTokens(current.recordLines)).not.toContain('person.darius');

    // The correction is an appended revision of the contemporaneous resolution, not an edit of it.
    expect(scenario.correction.revisesRecognitionResolutionId)
      .toBe(scenario.contemporaneousResolution.recognitionResolutionId);
    expect(scenario.correction.occurredAt)
      .toBeGreaterThan(scenario.contemporaneousResolution.occurredAt);
    expect(scenario.resolutionLog).toContain(scenario.contemporaneousResolution);

    // Everything else about the two accounts is the same, because the underlying experience is the
    // same immutable record set. Only the identity field differs.
    const withoutIdentity = (lines: readonly string[]) => lines.map((line) =>
      line.split('|').filter((field) => !field.startsWith('identity:')).join('|'));
    expect(withoutIdentity(current.recordLines)).toEqual(withoutIdentity(contemporaneous.recordLines));

    // Rendering the current reinterpretation reads the later resolution and nothing else: with the
    // correction absent from the log, the two viewpoints coincide exactly.
    const beforeCorrection = renderAllViewpoints({
      projection: scenario.first, resolutionLog: [scenario.contemporaneousResolution],
    });
    expect(beforeCorrection.get('current-reinterpretation')!.recordLines)
      .toEqual(beforeCorrection.get('contemporaneous-character')!.recordLines);
    expect(beforeCorrection.get('contemporaneous-character')!.recordLines)
      .toEqual(contemporaneous.recordLines);

    // And the experience both viewpoints render is byte-identical to the one captured before the
    // correction was ever appended: reinterpretation changes the resolution in scope, never the
    // record it is about.
    expect(stringifyWithBigInts(scenario.first.experience)).toBe(experienceBeforeCorrection);
  });
});
