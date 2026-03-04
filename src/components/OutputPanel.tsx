import { ChangeEvent } from 'react';
import { SoraConfig, SoraJobState } from '../types';

interface Props {
  basicPrompt: string;
  storyboardLines: string[];
  language: 'zh' | 'en';
  onCopyBasic: () => void;
  onCopyStoryboard: () => void;
  onDownload: () => void;
  charCount: { basic: number; storyboard: number };
  tokenEstimate: { basic: number; storyboard: number };
  soraConfig: SoraConfig;
  soraJob: SoraJobState;
  onSoraConfigChange: (patch: Partial<SoraConfig>) => void;
  onGenerateSora: () => void;
  onCopyVideoUrl: () => void;
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
  soraConfig,
  soraJob,
  onSoraConfigChange,
  onGenerateSora,
  onCopyVideoUrl
}: Props) => {
  const isGenerating = ['requesting', 'queued', 'in_progress'].includes(soraJob.status);
  const hasPrompt = Boolean(basicPrompt.trim() || storyboardLines.some(line => line.trim()));
  const statusLabelMap: Record<SoraJobState['status'], string> = {
    idle: '等待操作',
    requesting: '送出中',
    queued: '排程中',
    in_progress: '生成中',
    completed: '已完成',
    failed: '失敗',
    error: '錯誤',
    timeout: '逾時'
  };

  const handleSelectChange = (field: keyof SoraConfig) => (event: ChangeEvent<HTMLSelectElement>) => {
    const value = field === 'duration' ? Number(event.target.value) : event.target.value;
    onSoraConfigChange({ [field]: value } as Partial<SoraConfig>);
  };

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

      <div className="sora-panel">
        <div className="sora-header">
          <h3>OpenAI Sora 影片生成</h3>
          <button
            type="button"
            className="sora-generate"
            onClick={onGenerateSora}
            disabled={isGenerating || !hasPrompt}
          >
            {isGenerating ? 'Generating…' : 'Generate Video (Sora)'}
          </button>
        </div>

        <div className="sora-grid">
          <label>
            模型
            <select value={soraConfig.model} onChange={handleSelectChange('model')}>
              <option value="sora-2">sora-2 · Standard</option>
              <option value="sora-2-pro">sora-2-pro · Pro</option>
            </select>
          </label>
          <label>
            秒數
            <select value={soraConfig.duration} onChange={handleSelectChange('duration')}>
              <option value={5}>5s</option>
              <option value={10}>10s</option>
              <option value={20}>20s</option>
            </select>
          </label>
          <label>
            畫面比例
            <select value={soraConfig.aspectRatio} onChange={handleSelectChange('aspectRatio')}>
              <option value="16:9">16:9</option>
              <option value="9:16">9:16</option>
              <option value="1:1">1:1</option>
            </select>
          </label>
          <label>
            解析度
            <select value={soraConfig.resolution} onChange={handleSelectChange('resolution')}>
              <option value="720p">720p</option>
              <option value="1080p">1080p*</option>
            </select>
          </label>
        </div>
        <p className="hint">1080p 選項會自動對應到 Sora 可用的最高解析度。</p>

        <div className="sora-status">
          <div>
            <strong>狀態：</strong>
            <span>{statusLabelMap[soraJob.status]}</span>
            {isGenerating && soraJob.progress != null && (
              <span className="sora-progress">・ {Math.round(soraJob.progress)}%</span>
            )}
          </div>
          {soraJob.jobId && <small>Job ID: {soraJob.jobId}</small>}
          {soraJob.error && <p className="sora-error">{soraJob.error}</p>}
        </div>

        {soraJob.videoUrl && (
          <div className="sora-video">
            <video controls src={soraJob.videoUrl} preload="metadata" />
            <button type="button" onClick={onCopyVideoUrl}>
              Copy video URL
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default OutputPanel;
