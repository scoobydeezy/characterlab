import {defineConfig} from 'vitest/config';
import base from '../vite.config';
export default defineConfig({...base,test:{...base.test,pool:'forks',poolOptions:{forks:{singleFork:true}},setupFiles:['scripts/assembled-verification-profile.setup.ts']}});
