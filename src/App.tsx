import React from 'react';
import { useEngine } from './ui/state/useEngine';
import { NeedPanel } from './ui/components/NeedPanel';
import { ExpectationPanel } from './ui/components/ExpectationPanel';
import { ActionPanel } from './ui/components/ActionPanel';
import { ModelParamsPanel } from './ui/components/ModelParamsPanel';
import { DeterminismPanel } from './ui/components/DeterminismPanel';
import { TraceViewer } from './ui/components/TraceViewer';
import { CounterfactualPanel } from './ui/components/CounterfactualPanel';

export default function App() {
  const engine = useEngine();

  return (
    <div className="app">
      <header className="app__header">
        <h1>CharacterLab</h1>
        <p>
          Deterministic cognitive reference model — Phase 0 (mathematical kernel) + Phase 1 (Need-satisfaction
          learning). Tick {engine.currentTick()}.
        </p>
      </header>

      <main className="app__grid">
        <div className="app__col">
          <ModelParamsPanel engine={engine} />
          <NeedPanel engine={engine} />
        </div>
        <div className="app__col">
          <ActionPanel engine={engine} />
          <ExpectationPanel engine={engine} />
          <CounterfactualPanel engine={engine} />
          <DeterminismPanel engine={engine} />
        </div>
        <div className="app__col app__col--trace">
          <TraceViewer engine={engine} />
        </div>
      </main>

      <footer className="app__footer">
        <p>
          Research tool, not a game — every number on this page is reproducible from (Model version, Initial state,
          Input sequence, Seed). See README.md and RESEARCH.md.
        </p>
      </footer>
    </div>
  );
}
