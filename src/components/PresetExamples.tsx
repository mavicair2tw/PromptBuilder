import { BuilderSnapshot } from '../types';

interface PresetExamplesProps {
  onApply: (snapshot: BuilderSnapshot) => void;
  examples: { name: string; snapshot: BuilderSnapshot }[];
}

const PresetExamples = ({ onApply, examples }: PresetExamplesProps) => (
  <section className="panel examples">
    <h3>範例 Preset</h3>
    <p className="hint">一鍵套用後可再微調內容。</p>
    <div className="example-buttons">
      {examples.map(example => (
        <button type="button" key={example.name} onClick={() => onApply(example.snapshot)}>
          {example.name}
        </button>
      ))}
    </div>
  </section>
);

export default PresetExamples;
