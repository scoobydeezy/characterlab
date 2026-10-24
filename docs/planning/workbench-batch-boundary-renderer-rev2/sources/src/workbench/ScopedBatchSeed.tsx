export function ScopedBatchSeed({job}:{job:{experimentId:'bio'|'sem';seedHex?:string}}){
 if(typeof job.seedHex!=='string'||!/^([0-9a-f]{2}){32}$/.test(job.seedHex))return <span role="alert">Exact scoped run seed unavailable</span>;
 return <span>{job.experimentId==='bio'?'Early decision run seed (32-byte hex)':'Run seed (32-byte hex)'}: <code data-batch-seed={job.seedHex}>{job.seedHex}</code></span>;
}
