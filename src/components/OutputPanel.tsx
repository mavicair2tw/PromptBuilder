import { useState } from 'react';
import { SavedPreset } from '../types';

interface Props {
  basicPrompt: string;
  storyboardLines: string[];
  language: 'zh' | 'en';
  onCopyBasic: () => void;
  onCopyStoryboard: () => void;
  onDownload: () => void;
  charCount: { basic: number; storyboard: number };
  tokenEstimate: { basic: number; storyboard: number };
  onSavePreset: (name: string) => void;
  presets: SavedPreset[];
  onLoadPreset: (id: string) => void;
  onDeletePreset: (id: string) => void;
}

const OutputPanel = ({
  basicPrompt,
  storyboardLines,
  language,
  onCopyBasic,
  onCopyStoryboard,
  onDownload,
  charCount,
  tokenEstimate,
  onSavePreset,
  presets,
  onLoadPreset,
  onDeletePreset
}: Props) => {
  const [presetName, setPresetName] = useState('');

  return (
    <section className="panel output">
      <h2>輸出預覽</h2>

      <div className="output-block">
        <div className="output-header">
          <h3>基本提示詞</h3>
          <div className="actions">
            <button type="button" onClick={onCopyBasic}>複製</button>
            <span>
              {charCount.basic} chars · ≈ {tokenEstimate.basic} tokens
            </span>
          </div>
        </div>
        <textarea readOnly value={basicPrompt} rows={6} />
      </div>

      <div className="output-block">
        <div className="output-header">
          <h3>分鏡提示詞</h3>
          <div className="actions">
            <button type="button" onClick={onCopyStoryboard}>複製</button>
            <button type="button" onClick={onDownload}>下載 .txt</button>
          </div>
        </div>
        <textarea readOnly value={storyboardLines.join('\n')} rows={10} />
        <div className="meta-row">
          <span>
            {charCount.storyboard} chars · ≈ {tokenEstimate.storyboard} tokens
          </span>
          <span>語言：{language === 'zh' ? '中文' : 'English'}</span>
        </div>
      </div>

      <div className="preset-section">
        <h3>自訂 Preset</h3>
        <div className="preset-form">
          <input
            type="text"
            value={presetName}
            onChange={e => setPresetName(e.target.value)}
            placeholder="輸入 Preset 名稱"
          />
          <button
            type="button"
            onClick={() => {
              onSavePreset(presetName);
              setPresetName('');
            }}
          >
            儲存
          </button>
        </div>
        {presets.length === 0 ? (
          <p className="hint">尚未儲存。最多保留 5 組，依時間排序。</p>
        ) : (
          <ul className="preset-list">
            {presets.map(item => (
              <li key={item.id}>
                <div>
                  <strong>{item.name}</strong>
                  <small>{new Date(item.savedAt).toLocaleString()}</small>
                </div>
                <div className="preset-actions">
                  <button type="button" onClick={() => onLoadPreset(item.id)}>
                    載入
                  </button>
                  <button type="button" onClick={() => onDeletePreset(item.id)}>
                    刪除
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};

export default OutputPanel;
