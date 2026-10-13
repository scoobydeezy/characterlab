import {it,expect} from 'vitest';
import {runSemRendererControls} from '../workbench/semRendererControls';
import {CATALOG_IDENTITIES,NON_CATALOG_TRUTH_REFERENTS,identityTokens} from '../workbench/semRendererFixture';
import {digest} from '../workbench/canonical';
it('retains original CV-SEM-012 viewpoint, presentation, allocation and historical controls',async()=>{
 const r=await runSemRendererControls();expect(await runSemRendererControls()).toEqual(r);
 expect(r.views).toHaveLength(3);expect(await digest(new TextEncoder().encode(r.evidence.exact))).toBe(r.evidence.sha256);
 for(const v of r.views){expect(v.repeated).toEqual(v.plain);expect(v.reallocated.recordLines).toEqual(v.plain.recordLines);expect(v.narrative.recordLines).toEqual(v.plain.recordLines);expect(v.narrative.displayLines).not.toEqual(v.plain.displayLines);
  if(v.viewpoint!=='omniscient'){const text=JSON.stringify(v);for(const field of ['truth-binding:','truth-referent:','truth-role:',...NON_CATALOG_TRUTH_REFERENTS])expect(text).not.toContain(field);for(const identity of identityTokens(v.plain.recordLines))expect(identity==='unrecognised'||identity==='withdrawn'||CATALOG_IDENTITIES.has(identity)).toBe(true);}
 }
 const then=r.views[1],now=r.views[2];expect(then.plain.recordLines).toEqual(then.withoutCorrection.recordLines);expect(now.withoutCorrection.recordLines).toEqual(then.plain.recordLines);expect(now.plain.recordLines).not.toEqual(then.plain.recordLines);
 const strip=(lines:readonly string[])=>lines.map(l=>l.split('|').filter(f=>!f.startsWith('identity:')).join('|'));expect(strip(now.plain.recordLines)).toEqual(strip(then.plain.recordLines));
 const e=JSON.parse(r.evidence.exact);expect(e.requestBeforeRendering).toBe(e.requestAfterRendering);
 const recover=(v:unknown):unknown=>v&&typeof v==='object'&&'$bigint' in v?String((v as {$bigint:string}).$bigint):v;
 expect(JSON.stringify(e.experienceAfterCorrection,(_k,v)=>recover(v))).toBe(e.experienceBeforeCorrection);
 expect(r.views[0].plain.recordLines.filter(l=>l.startsWith('truth-binding:'))).toHaveLength(3);
});
