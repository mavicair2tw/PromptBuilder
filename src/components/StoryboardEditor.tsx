import { CameraOption, Option, Segment } from '../types';

interface Props {
  segments: Segment[];
  options: {
    subjects: Option[];
    actions: Option[];
    environments: Option[];
    cameras: CameraOption[];
  };
  onSegmentChange: (id: string, patch: Partial<Segment>) => void;
  onAddSegment: () => void;
  onRemoveSegment: (id: string) => void;
  onMoveSegment: (id: string, direction: 'up' | 'down') => void;
}

const StoryboardEditor = ({
  segments,
  options,
  onSegmentChange,
  onAddSegment,
  onRemoveSegment,
  onMoveSegment
}: Props) => (
  <section className="panel storyboard">
    <header className="panel-header">
      <h2>分鏡編輯器</h2>
      <button type="button" onClick={onAddSegment}>
        新增段落
      </button>
    </header>
    <p className="hint">未填主體 / 環境會沿用左側全域設定。</p>
    {segments.map((segment, index) => (
      <div key={segment.id} className="segment-card">
        <div className="segment-header">
          <input
            type="text"
            value={segment.label}
            onChange={e => onSegmentChange(segment.id, { label: e.target.value })}
          />
          <div className="segment-actions">
            <button
              type="button"
              onClick={() => onMoveSegment(segment.id, 'up')}
              disabled={index === 0}
            >
              ↑
            </button>
            <button
              type="button"
              onClick={() => onMoveSegment(segment.id, 'down')}
              disabled={index === segments.length - 1}
            >
              ↓
            </button>
            <button type="button" onClick={() => onRemoveSegment(segment.id)}>
              刪除
            </button>
          </div>
        </div>

        <div className="segment-grid">
          <label>
            主體（覆蓋）
            <select
              value={segment.subjectId ?? ''}
              onChange={e =>
                onSegmentChange(segment.id, { subjectId: e.target.value || undefined })
              }
            >
              <option value="">沿用全域</option>
              {options.subjects.map(opt => (
                <option key={opt.id} value={opt.id}>
                  {opt.zh} / {opt.en}
                </option>
              ))}
            </select>
          </label>

          <label>
            動作（覆蓋）
            <select
              value={segment.actionId ?? ''}
              onChange={e =>
                onSegmentChange(segment.id, { actionId: e.target.value || undefined })
              }
            >
              <option value="">沿用全域</option>
              {options.actions.map(opt => (
                <option key={opt.id} value={opt.id}>
                  {opt.zh} / {opt.en}
                </option>
              ))}
            </select>
          </label>

          <label>
            環境（覆蓋）
            <select
              value={segment.environmentId ?? ''}
              onChange={e =>
                onSegmentChange(segment.id, { environmentId: e.target.value || undefined })
              }
            >
              <option value="">沿用全域</option>
              {options.environments.map(opt => (
                <option key={opt.id} value={opt.id}>
                  {opt.zh} / {opt.en}
                </option>
              ))}
            </select>
          </label>

          <label>
            運鏡
            <select
              value={segment.cameraId ?? ''}
              onChange={e =>
                onSegmentChange(segment.id, { cameraId: e.target.value || undefined })
              }
            >
              <option value="">沿用全域</option>
              {options.cameras.map(opt => (
                <option key={opt.id} value={opt.id}>
                  {opt.zh} / {opt.en} · {opt.level}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label>
          補充描述
          <textarea
            value={segment.notes}
            onChange={e => onSegmentChange(segment.id, { notes: e.target.value })}
            placeholder="光線 / 氣氛 / 動作細節..."
          />
        </label>
      </div>
    ))}
  </section>
);

export default StoryboardEditor;
