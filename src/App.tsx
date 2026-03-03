import { useMemo, useState } from 'react';
import Sidebar from './components/Sidebar';
import StoryboardEditor from './components/StoryboardEditor';
import OutputPanel from './components/OutputPanel';
import PresetExamples from './components/PresetExamples';
import DonateBar from './components/DonateBar';
import {
  actions,
  cameraOptions,
  defaultStylePreset,
  environments,
  styleOptions,
  subjects
} from './data/options';
import { usePresets } from './hooks/usePresets';
import {
  BuilderSnapshot,
  CustomOptions,
  GlobalFormState,
  Option,
  Segment
} from './types';
import './styles/App.css';

const makeId = () => Math.random().toString(36).slice(2, 10);

const createDefaultSegments = (): Segment[] => [
  { id: makeId(), label: '[0-3s]', notes: '' },
  { id: makeId(), label: '[4-6s]', notes: '' },
  { id: makeId(), label: '[7-9s]', notes: '' }
];

const defaultGlobal: GlobalFormState = {
  subjectId: subjects[0].id,
  actionId: actions[0].id,
  environmentId: environments[0].id,
  cameraId: cameraOptions[0].id,
  styleIds: defaultStylePreset,
  language: 'zh',
  negativePrompt: '',
  lensNotes: ''
};

const sampleSnapshots: { name: string; snapshot: BuilderSnapshot }[] = [
  {
    name: 'Cyberpunk girl in neon rain',
    snapshot: {
      global: {
        ...defaultGlobal,
        subjectId: 'sub-cyber-girl',
        actionId: 'act-walk-slow',
        environmentId: 'env-neon-alley',
        cameraId: 'cam-02',
        styleIds: ['style-cinematic', 'style-ultra', 'style-film-grain', 'style-4k'],
        language: 'en',
        negativePrompt: 'low quality, washed colors',
        lensNotes: '50mm anamorphic lens'
      },
      segments: [
        { id: makeId(), label: '[0-3s]', notes: 'neon reflections shimmer' },
        { id: makeId(), label: '[4-6s]', cameraId: 'cam-08', notes: 'orbit rain trails' },
        { id: makeId(), label: '[7-9s]', cameraId: 'cam-13', notes: 'crash zoom into her eyes' }
      ],
      customOptions: { subjects: [], actions: [], environments: [] }
    }
  },
  {
    name: 'Detective alley smoke',
    snapshot: {
      global: {
        ...defaultGlobal,
        subjectId: 'sub-detective',
        actionId: 'act-look-back',
        environmentId: 'env-smoky-alley',
        cameraId: 'cam-05',
        styleIds: ['style-cinematic', 'style-film-grain', 'style-shallow'],
        language: 'zh',
        negativePrompt: '',
        lensNotes: '35mm vintage lens'
      },
      segments: [
        { id: makeId(), label: '[0-3s]', notes: '霧氣與路燈逆光' },
        { id: makeId(), label: '[4-6s]', cameraId: 'cam-10', notes: '滑軌橫移展現巷道深度' },
        { id: makeId(), label: '[7-9s]', cameraId: 'cam-06', notes: 'tilt up 聚焦表情' }
      ],
      customOptions: { subjects: [], actions: [], environments: [] }
    }
  },
  {
    name: 'Astronaut on the moon',
    snapshot: {
      global: {
        ...defaultGlobal,
        subjectId: 'sub-astronaut',
        actionId: 'act-hover',
        environmentId: 'env-moon',
        cameraId: 'cam-09',
        styleIds: ['style-ultra', 'style-4k', 'style-high-contrast'],
        language: 'en',
        negativePrompt: '',
        lensNotes: 'drone zoom lens'
      },
      segments: [
        { id: makeId(), label: '[0-3s]', notes: 'dust particles shimmer' },
        { id: makeId(), label: '[4-6s]', cameraId: 'cam-17', notes: 'drone orbit crater' },
        { id: makeId(), label: '[7-9s]', cameraId: 'cam-20', notes: 'long take approaching Earth rise' }
      ],
      customOptions: { subjects: [], actions: [], environments: [] }
    }
  }
];

const App = () => {
  const [globalForm, setGlobalForm] = useState<GlobalFormState>(defaultGlobal);
  const [segments, setSegments] = useState<Segment[]>(createDefaultSegments());
  const [customOptions, setCustomOptions] = useState<CustomOptions>({
    subjects: [],
    actions: [],
    environments: []
  });

  const allSubjects: Option[] = [...subjects, ...customOptions.subjects];
  const allActions: Option[] = [...actions, ...customOptions.actions];
  const allEnvironments: Option[] = [...environments, ...customOptions.environments];

  const { presets, savePreset, removePreset } = usePresets();

  const updateGlobalForm = (patch: Partial<GlobalFormState>) => {
    setGlobalForm(prev => ({ ...prev, ...patch }));
  };

  const toggleStyle = (styleId: string) => {
    setGlobalForm(prev => {
      const exists = prev.styleIds.includes(styleId);
      return {
        ...prev,
        styleIds: exists ? prev.styleIds.filter(id => id !== styleId) : [...prev.styleIds, styleId]
      };
    });
  };

  const addCustomOption = (key: keyof CustomOptions, label: string) => {
    const option = { id: `${key}-${makeId()}`, zh: label, en: label };
    setCustomOptions(prev => ({
      ...prev,
      [key]: [...prev[key], option]
    }));
  };

  const updateSegment = (id: string, patch: Partial<Segment>) => {
    setSegments(prev => prev.map(seg => (seg.id === id ? { ...seg, ...patch } : seg)));
  };

  const addSegment = () => {
    const start = segments.length * 3;
    const end = start + 3;
    setSegments(prev => [...prev, { id: makeId(), label: `[${start}-${end}s]`, notes: '' }]);
  };

  const removeSegment = (id: string) => {
    setSegments(prev => prev.filter(seg => seg.id !== id));
  };

  const moveSegment = (id: string, direction: 'up' | 'down') => {
    setSegments(prev => {
      const index = prev.findIndex(seg => seg.id === id);
      if (index === -1) return prev;
      const target = direction === 'up' ? index - 1 : index + 1;
      if (target < 0 || target >= prev.length) return prev;
      const copy = [...prev];
      [copy[index], copy[target]] = [copy[target], copy[index]];
      return copy;
    });
  };

  const getLabel = (id: string | undefined, list: Option[]): string | null => {
    if (!id) return null;
    const found = list.find(item => item.id === id);
    if (!found) return null;
    return globalForm.language === 'zh' ? found.zh : found.en;
  };

  const getCameraLabel = (id: string | undefined): string | null => {
    if (!id) return null;
    const found = cameraOptions.find(item => item.id === id);
    if (!found) return null;
    return globalForm.language === 'zh' ? found.zh : found.en;
  };

  const stylesText = globalForm.styleIds
    .map(id => {
      const found = styleOptions.find(opt => opt.id === id);
      if (!found) return null;
      return globalForm.language === 'zh' ? found.zh : found.en;
    })
    .filter(Boolean)
    .join(', ');

  const basicPrompt = useMemo(() => {
    const parts: string[] = [];
    const push = (value: string | null) => value && parts.push(value);

    push(getLabel(globalForm.subjectId, allSubjects));
    push(getLabel(globalForm.actionId, allActions));
    push(getLabel(globalForm.environmentId, allEnvironments));
    push(getCameraLabel(globalForm.cameraId));
    if (stylesText) push(stylesText);
    if (globalForm.lensNotes.trim()) push(globalForm.lensNotes.trim());
    if (globalForm.negativePrompt.trim()) {
      push(
        globalForm.language === 'zh'
          ? `負面提示：${globalForm.negativePrompt.trim()}`
          : `negative prompt: ${globalForm.negativePrompt.trim()}`
      );
    }
    return parts.join(', ');
  }, [globalForm, allSubjects, allActions, allEnvironments, stylesText]);

  const storyboardLines = useMemo(() => {
    return segments.map(seg => {
      const lineParts: string[] = [];
      lineParts.push(seg.label || '[segment]');
      const subject = getLabel(seg.subjectId ?? globalForm.subjectId, allSubjects);
      const action = getLabel(seg.actionId ?? globalForm.actionId, allActions);
      const environment = getLabel(seg.environmentId ?? globalForm.environmentId, allEnvironments);
      const camera = getCameraLabel(seg.cameraId ?? globalForm.cameraId);

      if (subject) lineParts.push(subject);
      if (action) lineParts.push(action);
      if (environment) lineParts.push(environment);
      if (camera) lineParts.push(camera);
      if (seg.notes.trim()) lineParts.push(seg.notes.trim());

      return lineParts.join(', ');
    });
  }, [segments, globalForm, allSubjects, allActions, allEnvironments]);

  const copyText = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      alert('複製失敗，請手動複製。');
    }
  };

  const downloadTxt = () => {
    const blob = new Blob(
      [`Basic Prompt:\n${basicPrompt}\n\nStoryboards:\n${storyboardLines.join('\n')}`],
      { type: 'text/plain' }
    );
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'prompt-builder.txt';
    link.click();
    URL.revokeObjectURL(url);
  };

  const snapshotCurrent = (): BuilderSnapshot => ({
    global: globalForm,
    segments,
    customOptions
  });

  const applySnapshot = (snapshot: BuilderSnapshot) => {
    setGlobalForm(snapshot.global);
    setSegments(snapshot.segments.length ? snapshot.segments : createDefaultSegments());
    setCustomOptions(snapshot.customOptions);
  };

  const handleSavePreset = (name: string) => {
    savePreset(name, snapshotCurrent());
  };

  const handleLoadPreset = (id: string) => {
    const preset = presets.find(p => p.id === id);
    if (preset) applySnapshot(preset.snapshot);
  };

  const charCount = {
    basic: basicPrompt.length,
    storyboard: storyboardLines.join('\n').length
  };

  const tokenEstimate = {
    basic: Math.ceil(charCount.basic / 4),
    storyboard: Math.ceil(charCount.storyboard / 4)
  };

  return (
    <div className="app-shell">
      <div className="page-tag-row">
        <a className="pill" href="/">Home</a>
        <span className="pill active">Prompt Builder</span>
      </div>
      <header>
        <h1>Prompt Builder · AI 圖生影片提示詞</h1>
        <p className="hint">左側全域參數、中間分鏡、右側輸出與 Preset。</p>
      </header>

      <div className="layout">
        <Sidebar
          options={{
            subjects: allSubjects,
            actions: allActions,
            environments: allEnvironments,
            styles: styleOptions,
            cameras: cameraOptions
          }}
          globalForm={globalForm}
          onFormChange={updateGlobalForm}
          onToggleStyle={toggleStyle}
          onAddCustom={addCustomOption}
          customOptions={customOptions}
        />

        <StoryboardEditor
          segments={segments}
          options={{
            subjects: allSubjects,
            actions: allActions,
            environments: allEnvironments,
            cameras: cameraOptions
          }}
          onSegmentChange={updateSegment}
          onAddSegment={addSegment}
          onRemoveSegment={removeSegment}
          onMoveSegment={moveSegment}
        />

        <OutputPanel
          basicPrompt={basicPrompt}
          storyboardLines={storyboardLines}
          language={globalForm.language}
          onCopyBasic={() => copyText(basicPrompt)}
          onCopyStoryboard={() => copyText(storyboardLines.join('\n'))}
          onDownload={downloadTxt}
          charCount={charCount}
          tokenEstimate={tokenEstimate}
          onSavePreset={handleSavePreset}
          presets={presets}
          onLoadPreset={handleLoadPreset}
          onDeletePreset={removePreset}
        />
      </div>

      <PresetExamples examples={sampleSnapshots} onApply={applySnapshot} />
    </div>
  );
};

export default App;
