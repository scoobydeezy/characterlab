import type {BatchJob} from './experimentRegistry';

/** The exact hexadecimal General seed takes precedence over its transport placeholder. */
export function BatchSeed({job}: {job: BatchJob}) {
  if (job.experimentId === 'general') {
    if (typeof job.seedHex !== 'string' || !/^[0-9a-f]{64}$/.test(job.seedHex)) {
      return <span role="alert">Exact General seed unavailable</span>;
    }
    return <span>Seed (32-byte hex): <code data-batch-seed={job.seedHex}>{job.seedHex}</code></span>;
  }
  return <span>Seed: <code data-batch-seed={String(job.seed)}>{job.seed}</code></span>;
}
