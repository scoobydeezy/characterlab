import {useState} from 'react';
import type {runSemRecognitionBoundaryControls} from './semRecognitionBoundaryControls';
import type {SemWorkerClient} from './semWorkerClient';
type Report=Awaited<ReturnType<typeof runSemRecognitionBoundaryControls>>;
export function SemRecognitionBoundaryPanel({client,busy,execute,onExport}:{client?:SemWorkerClient;busy:boolean;execute:(fn:()=>Promise<void>)=>Promise<void>;onExport:(text:string)=>void}){
 const [report,setReport]=useState<Report>();
 const rows=report?[
  ['Replacement retains perceptual track',report.continuity.sameTrackAfterReplacement],['Replacement changes recognition',report.continuity.changedRecognition],['Split uses a different track',report.continuity.splitTrack],['Split preserves recognized candidate',report.continuity.sameRecognitionAcrossSplit],
  ['Same allocator replays exactly',report.allocation.exactReplay],['Shifted allocator preserves recognition',report.allocation.sameSemanticView],['Shifted allocator changes resolution ID',report.allocation.differentResolutionId],
  ...Object.entries(report.rollback.preserved).map(([key,value])=>['Failed settlement preserves '+key,value]),
 ]:[];
 return <section className="card"><h2>Recognition boundary controls</h2><p>Inspect track continuity, identity mappings and recognition authority using the original component experiments. The active integrated run stays unchanged.</p><button disabled={busy||!client} onClick={()=>void execute(async()=>setReport(await client!.recognitionBoundaries()))}>Run recognition boundary controls</button>{report&&<>
 <p>{report.contract}. Mapped candidate: {report.mapping.semanticView}. Alternative model: {report.authority.alternativeModel}.</p>
 <table><thead><tr><th>Distinction</th><th>Verified</th></tr></thead><tbody>{rows.map(([label,value])=><tr key={String(label)}><td>{label}</td><td>{String(value)}</td></tr>)}</tbody></table>
 <h3>Rejection guards</h3><table><thead><tr><th>Case</th><th>Guard</th></tr></thead><tbody>{[['Missing mapping',report.mapping.missing],['Injected truth',report.mapping.truthGuard],...report.authority.guards.map((guard,i)=>[['Missing authority','Duplicate authority','Event carrier','Unknown derivation'][i],guard] as const),['Branched history',report.allocation.historyGuard]].map(([label,guard])=><tr key={String(label)}><td>{String(label)}</td><td>{typeof guard==='string'?guard:guard.code}</td></tr>)}</tbody></table>
 <h3>Failed settlement</h3><p>Allocated evaluation {report.rollback.allocatedEvaluation}. {report.rollback.failure}. Status: {report.rollback.before.status} → {report.rollback.after.status}. Preserved data does not mean the failed scheduler resumed.</p>
 <h3>Emission boundaries</h3><table><thead><tr><th>Target</th><th>Accepted</th><th>Guard</th></tr></thead><tbody>{report.emission.targets.map(t=><tr key={t.target}><td>{t.target}</td><td>{String(t.accepted)}</td><td>{t.failure?.code??'None'}</td></tr>)}</tbody></table>
 <p>Repeated recognition: {report.emission.result.kind==='no-update'?report.emission.result.reason:report.emission.result.kind}. New resolution: {report.emission.resolutionEmitted?'Emitted':'None'}.</p><p>{report.scope}</p><details><summary>Exact recognition boundary report</summary><pre className="exact">{JSON.stringify(report,null,2)}</pre></details><button onClick={()=>onExport(JSON.stringify(report,null,2))}>Export recognition boundary report</button></>}</section>;
}
