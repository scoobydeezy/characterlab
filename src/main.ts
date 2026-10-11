import {createElement} from 'react';
import {createRoot} from 'react-dom/client';
import {WorkbenchApp} from './workbench/WorkbenchApp';

const root = document.getElementById('root');

if (!root) {
  throw new Error('#root element not found');
}

createRoot(root).render(createElement(WorkbenchApp));

export {};
