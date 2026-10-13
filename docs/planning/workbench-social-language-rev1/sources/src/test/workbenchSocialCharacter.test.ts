import {expect,it} from 'vitest';
import {SocialWorkbenchRun} from '../workbench/socialAdapter';
import {projectSocialCharacter} from '../workbench/socialCharacter';
import {decodeSocial} from '../campaign3/socialCodecs';
import {fromHex} from '../workbench/canonical';
import catalog from '../workbench/socialCatalog.json';
it('separates prior probe belief from current belief and preserves past wording',async()=>{const r=await SocialWorkbenchRun.create();await r.advance();const a=r.snapshot().observerViews[0].character;expect(a.entries.find(e=>e.kind==='probe')!.human).toContain('unknown');expect(a.currentBelief!.human).toContain('0/1');await r.advance();const b=r.snapshot().observerViews[0].character;for(const e of a.entries)expect(b.entries.find(x=>x.occurrence===e.occurrence)).toEqual(e);expect(b.currentBelief!.human).toContain('1/2');});
it('suppresses violating controls and rejects non-view input',async()=>{const r=await SocialWorkbenchRun.create('private-1-control-3');await r.advance();expect(r.snapshot().observerViews.every(v=>v.character.suppressed&&v.character.entries.length===0&&v.character.currentBelief===null)).toBe(true);expect(()=>projectSocialCharacter(decodeSocial(fromHex(catalog.models[0].parameters)),1)).toThrow('forbidden');});
