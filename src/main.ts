import {createElement} from 'react';
import {createRoot} from 'react-dom/client';
import {Workbench} from './workbench/Workbench';

const root = document.getElementById('root');

if (!root) {
  throw new Error('#root element not found');
}

createRoot(root).render(createElement(Workbench));

export {};
