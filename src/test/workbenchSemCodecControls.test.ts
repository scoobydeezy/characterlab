import {it,expect} from 'vitest';
import {runSemCodecControls} from '../workbench/semCodecControls';
it('preserves exact codec round trips, layout guards and observer identity differences',async()=>{
 const r=await runSemCodecControls();expect(await runSemCodecControls()).toEqual(r);expect(r.cases).toHaveLength(23);expect(r.guards).toHaveLength(23);
 const p=Object.fromEntries(r.cases.map(c=>[c.id,JSON.parse(c.evidence.exact)]));const life:{encodedHex:string;reencodedHex:string}[]=p['lifecycle-round-trips'];expect(life).toHaveLength(7);for(const v of life)expect(v.encodedHex).toBe(v.reencodedHex);expect(life[3].encodedHex).not.toBe(life[4].encodedHex);
 expect(p['state-construction-order'].forwardRoundTrip.encodedHex).toBe(p['state-construction-order'].reversedRoundTrip.encodedHex);const namespaces:{hex:string}[]=p['occurrence-namespaces'];expect(new Set(namespaces.map(v=>v.hex)).size).toBe(3);
 const o=p['observer-ownership'];expect(o.minaFile.encodedHex).not.toBe(o.dariusFile.encodedHex);expect(o.minaDetection.encodedHex).not.toBe(o.dariusDetection.encodedHex);expect(o.typedObserver.encodedHex).not.toBe(o.plainText.encodedHex);
 expect(r.guards.filter(g=>g.code==='ILLEGAL_UNION_LAYOUT')).toHaveLength(15);expect(r.guards.find(g=>g.id==='unregistered-schema-version')?.message).toMatch(/unknown record schema 212\/2/);expect(r.scope).toContain('does not establish payload-domain admission');
});
