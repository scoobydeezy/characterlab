import React from 'react';
import { useEngine } from './ui/state/useEngine';
import { NeedPanel } from './ui/components/NeedPanel';
import { ExpectationPanel } from './ui/components/ExpectationPanel';
import { ActionPanel } from './ui/components/ActionPanel';
import { ModelParamsPanel } from './ui/components/ModelParamsPanel';
import { DeterminismPanel } from './ui/components/DeterminismPanel';
import { TraceViewer } from './ui/components/TraceViewer';
import { CounterfactualPanel } from './ui/components/CounterfactualPanel';
import { AssociationPanel } from './ui/components/AssociationPanel';
import { MemoryPanel } from './ui/components/MemoryPanel';
import { Phase2ExperimentsPanel } from './ui/components/Phase2ExperimentsPanel';
import { SaturationPanel } from './ui/components/SaturationPanel';
import { SaliencePanel } from './ui/components/SaliencePanel';

export default function App() {
  const engine = useEngine();

  return (
    <div className="app">
      <header className="app__header">
        <h1>CharacterLab</h1>
        <p>
          Deterministic cognitive reference model — Phase 0 (mathematical kernel) + Phase 1 (Need-satisfaction
          learning) + Phase 2 (associative accessibility &amp; episodic memory) + Phase 2.5a (saturated satisfaction /
          censored learning — PARTIAL, see RESEARCH.md) + Phase 2.5b (semantic salience). Tick {engine.currentTick()}.
        </p>
      </header>

      <main className="app__grid">
        <div className="app__col">
          <ModelParamsPanel engine={engine} />
          <NeedPanel engine={engine} />
          <AssociationPanel engine={engine} />
          <MemoryPanel engine={engine} />
        </div>
        <div className="app__col">
          <ActionPanel engine={engine} />
          <ExpectationPanel engine={engine} />
          <CounterfactualPanel engine={engine} />
          <Phase2ExperimentsPanel engine={engine} />
          <SaturationPanel engine={engine} />
          <SaliencePanel engine={engine} />
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
