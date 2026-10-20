// Execute the original CV-SEM-012 gate as a researcher diagnostic, never a live Character renderer.
import {misrecognitionScenario,requestFor,originalSource} from './semRendererFixture';
import {PLAIN_PRESENTATION,NARRATIVE_PRESENTATION,RENDERER_VIEWPOINTS,renderAllViewpoints} from '../test/fixtures/phenSem001Renderer';
import {negativeDiagnostic} from './semNegativeRecorder';
import {digest} from './canonical';

export async function runSemRendererControls(){
 const scenario=misrecognitionScenario(), shifted=misrecognitionScenario(90000n);
 const request=requestFor(scenario), before=negativeDiagnostic(request);
 const plain=renderAllViewpoints(request,PLAIN_PRESENTATION), narrative=renderAllViewpoints(request,NARRATIVE_PRESENTATION);
 const repeated=renderAllViewpoints(request), reallocated=renderAllViewpoints(requestFor(shifted));
 const uncorrected=renderAllViewpoints({...request,resolutionLog:[scenario.contemporaneousResolution]});
 const views=RENDERER_VIEWPOINTS.map(viewpoint=>({viewpoint,plain:plain.get(viewpoint)!,narrative:narrative.get(viewpoint)!,repeated:repeated.get(viewpoint)!,reallocated:reallocated.get(viewpoint)!,withoutCorrection:uncorrected.get(viewpoint)!}));
 const exact=negativeDiagnostic({request,shiftedRequest:requestFor(shifted),experienceBeforeCorrection:scenario.experienceBeforeCorrection,experienceAfterCorrection:scenario.first.experience,requestBeforeRendering:before,requestAfterRendering:negativeDiagnostic(request),views});
 return {version:'sem-renderer-controls/0.1',source:originalSource,views,evidence:{encoding:'negative-ledger-diagnostic-json/0.1',exact,sha256:await digest(new TextEncoder().encode(exact))},scope:'CV-SEM-012 researcher diagnostic fixture only. PHEN-SEM-001 renderer remains gate machinery, not an accepted rendering seam or the live Character renderer. Omniscient ancestry is researcher-only; character views use Glen’s catalog and resolution scopes. Later reinterpretation is not contemporaneous evidence. Plain/narrative, repeated execution, shifted allocator and correction-absent controls are retained. No native persistence, full SEM qualification or general observer-safety claim.'};
}
