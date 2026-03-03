import { useState } from 'react';
import { CameraOption, CustomOptions, GlobalFormState, Option } from '../types';

type AddableKey = 'subjects' | 'actions' | 'environments';

interface SidebarProps {
  options: {
    subjects: Option[];
    actions: Option[];
    environments: Option[];
    styles: Option[];
    cameras: CameraOption[];
  };
  globalForm: GlobalFormState;
  onFormChange: (patch: Partial<GlobalFormState>) => void;
  onToggleStyle: (styleId: string) => void;
  onAddCustom: (key: AddableKey, label: string) => void;
  customOptions: CustomOptions;
}

const Sidebar = ({
  options,
  globalForm,
  onFormChange,
  onToggleStyle,
  onAddCustom
}: SidebarProps) => {
  const [customInput, setCustomInput] = useState<Record<AddableKey, string>>({
    subjects: '',
    actions: '',
    environments: ''
  });

  const handleCustomAdd = (key: AddableKey) => {
    const value = customInput[key].trim();
    if (!value) return;
    onAddCustom(key, value);
    setCustomInput(prev => ({ ...prev, [key]: '' }));
  };

  const customAdder = (key: AddableKey, label: string) => (
    <div className="custom-adder">
      <input
        type="text"
        value={customInput[key]}
        onChange={e => setCustomInput(prev => ({ ...prev, [key]: e.target.value }))}
        placeholder={`自訂${label}`}
      />
      <button type="button" onClick={() => handleCustomAdd(key)}>
        新增
      </button>
    </div>
  );

  return (
    <aside className="panel sidebar">
      <h2>全域設定</h2>

      <label>
        主體
        <select
          value={globalForm.subjectId}
          onChange={e => onFormChange({ subjectId: e.target.value })}
        >
          {options.subjects.map(opt => (
            <option key={opt.id} value={opt.id}>
              {opt.zh} / {opt.en}
            </option>
          ))}
        </select>
      </label>
      {customAdder('subjects', '主體')}

      <label>
        動作
        <select
          value={globalForm.actionId}
          onChange={e => onFormChange({ actionId: e.target.value })}
        >
          {options.actions.map(opt => (
            <option key={opt.id} value={opt.id}>
              {opt.zh} / {opt.en}
            </option>
          ))}
        </select>
      </label>
      {customAdder('actions', '動作')}

      <label>
        環境
        <select
          value={globalForm.environmentId}
          onChange={e => onFormChange({ environmentId: e.target.value })}
        >
          {options.environments.map(opt => (
            <option key={opt.id} value={opt.id}>
              {opt.zh} / {opt.en}
            </option>
          ))}
        </select>
      </label>
      {customAdder('environments', '環境')}

      <label>
        運鏡
        <select
          value={globalForm.cameraId}
          onChange={e => onFormChange({ cameraId: e.target.value })}
        >
          {options.cameras.map(cam => (
            <option key={cam.id} value={cam.id}>
              {cam.zh} / {cam.en} · {cam.level}
            </option>
          ))}
        </select>
      </label>
      <p className="hint">提示：同一段建議只套用 1 種運鏡。</p>

      <fieldset className="styles-group">
        <legend>風格（可多選）</legend>
        {options.styles.map(style => (
          <label key={style.id} className="checkbox">
            <input
              type="checkbox"
              checked={globalForm.styleIds.includes(style.id)}
              onChange={() => onToggleStyle(style.id)}
            />
            {style.zh} / {style.en}
          </label>
        ))}
      </fieldset>

      <label>
        輸出語言
        <div className="radio-row">
          <label>
            <input
              type="radio"
              name="lang"
              value="zh"
              checked={globalForm.language === 'zh'}
              onChange={() => onFormChange({ language: 'zh' })}
            />
            中文
          </label>
          <label>
            <input
              type="radio"
              name="lang"
              value="en"
              checked={globalForm.language === 'en'}
              onChange={() => onFormChange({ language: 'en' })}
            />
            English
          </label>
        </div>
      </label>

      <label>
        鏡頭 / 焦段補充
        <input
          type="text"
          value={globalForm.lensNotes}
          onChange={e => onFormChange({ lensNotes: e.target.value })}
          placeholder="例如 35mm anamorphic lens"
        />
      </label>

      <label>
        Negative Prompt
        <textarea
          value={globalForm.negativePrompt}
          onChange={e => onFormChange({ negativePrompt: e.target.value })}
          placeholder="avoid low quality, no motion blur..."
        />
      </label>
    </aside>
  );
};

export default Sidebar;
