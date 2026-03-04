interface Props {
  basicPrompt: string;
  storyboardLines: string[];
  language: 'zh' | 'en';
  onCopyBasic: () => void;
  onCopyStoryboard: () => void;
  onDownload: () => void;
  charCount: { basic: number; storyboard: number };
  tokenEstimate: { basic: number; storyboard: number };
}

const OutputPanel = ({
  basicPrompt,
  storyboardLines,
  language,
  onCopyBasic,
  onCopyStoryboard,
  onDownload,
  charCount,
  tokenEstimate
}: Props) => {
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
    </section>
  );
};

export default OutputPanel;
