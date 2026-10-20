import {runSemIntegratedControls} from './semIntegratedControls';
import {runSemShortcutControls} from './semShortcutControls';
export async function runSemIntegratedSuite(){return {version:'sem-integrated-suite/0.1',chain:await runSemIntegratedControls(),shortcuts:await runSemShortcutControls()};}
