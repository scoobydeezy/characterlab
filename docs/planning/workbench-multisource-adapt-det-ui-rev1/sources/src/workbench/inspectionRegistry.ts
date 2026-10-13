import {EXPERIMENTS,EXPERIMENT_REGISTRY_VERSION,type ExperimentId,type InspectionCapabilities} from './experimentRegistry';
/** UI availability is distinct from batch admission. New routes cannot silently
 * enroll programs into the frozen batch catalog or its qualification receipts. */
export const INSPECTION_REGISTRY_VERSION='workbench-inspection-routes/0.1';
export const BATCH_REGISTRY_SOURCE=EXPERIMENT_REGISTRY_VERSION;
export type InspectionExperimentId=ExperimentId|'multisource'|'adapt'|'det';
const common={committedStep:{supported:true as const,boundary:'One complete native instant.'},checkpoint:{supported:true as const,authentication:'Exact original program, model, seed, saved bytes and complete prefix.'},runtimeIntervention:{supported:false as const,reason:'Only frozen original programs on fresh runs are admitted.'},graph:{supported:false,reason:'No native graph exposed by this bounded profile.'},matrix:{supported:false,reason:'No native matrix exposed by this bounded profile.'}};
export const INSPECTION_EXPERIMENTS:readonly {id:InspectionExperimentId;label:string;seamVersion:string;corpusScope:string;capabilities:InspectionCapabilities}[]=[
 ...EXPERIMENTS,
 {id:'multisource',label:'MULTISOURCE · selected evidence',seamVersion:'multisource-public/0.1-candidate',corpusScope:'62 programs/249 prefixes;96 declared comparisons',capabilities:{...common,explanation:{supported:true,scope:'Observer assessment descriptions only',qualification:'632 descriptions across249 prefixes; full task-reason/choice/expression language remains open.'}}},
 {id:'adapt',label:'ADAPT · exposure and measurement',seamVersion:'measurement-episodic-memory/0.1-candidate',corpusScope:'Accepted PHEN-ADAPT-001/1.11.0 parent pair;2 programs/8 prefixes',capabilities:{...common,explanation:{supported:true,scope:'Admitted and recalled diagnostic measurement only',qualification:'Six descriptions across8 prefixes; hidden adaptation and exposure attribution excluded. Broader controls remain open.'}}},
 {id:'det',label:'DET · exact replay and draws',seamVersion:'campaign2-task-cognitive-persistence/0.1-candidate',corpusScope:'Cognitive successor2 programs/18 prefixes; original substrate and failure/capacity controls remain separate',capabilities:{...common,explanation:{supported:false,scope:'Researcher diagnostics only',qualification:'No observer-safe narrative qualified; actual draws are not character uncertainty.'}}},
];
