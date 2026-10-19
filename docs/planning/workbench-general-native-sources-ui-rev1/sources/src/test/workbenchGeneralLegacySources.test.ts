import {it,expect} from 'vitest';
import legacyText from '../../docs/planning/workbench-general-export-rev1/browser-export.json?raw';
import {importGeneral,exportGeneral} from '../workbench/generalExport';
it('authenticates the frozen legacy browser export and versions newly enriched exports',async()=>{
 const old=JSON.parse(legacyText),run=await importGeneral(legacyText);expect(run.checkpoint()).toEqual(old.checkpoint);
 const {nativeReadMetadata,...legacy}=run.snapshot();expect(legacy).toEqual(old.snapshot);expect(nativeReadMetadata).toBeDefined();
 const current=await exportGeneral(run);expect(current.version).toBe('general-inspection-export/0.2');expect(current.nativeReadSourcesVersion).toBe('native-read-sources/0.1');
 const restored=await importGeneral(JSON.stringify(current));expect(restored.snapshot()).toEqual(run.snapshot());
 const tampered=structuredClone(current);tampered.snapshot.nativeReadMetadata![0].reads[0].accessor='forged';await expect(importGeneral(JSON.stringify(tampered))).rejects.toThrow('mismatch');
},600000);
