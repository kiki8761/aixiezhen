import { useState } from 'react';
import PageHeader from '../components/PageHeader';
import IcpBadge from '../components/IcpBadge';
import { copyText } from '../lib/clipboard';
import './Result.css';

interface Props {
  breadcrumb: string;
  prompt: string;
  onBack: () => void;
  onRestart: () => void;
  onChangeOne: () => void;
}

const DRAW_TOOLS: { name: string; url: string; hint: string }[] = [
  { name: '即梦', url: 'https://jimeng.jianying.com/', hint: '抖音·即梦' },
  { name: '可灵', url: 'https://klingai.com/', hint: '快手·可灵' },
  { name: '豆包', url: 'https://www.doubao.com/', hint: '字节·豆包' },
  { name: '吐司', url: 'https://tusiart.com/', hint: '国内社区' },
  { name: 'MJ', url: 'https://www.midjourney.com/', hint: 'Midjourney' },
];

export default function Result({ breadcrumb, prompt, onBack, onRestart, onChangeOne }: Props) {
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);

  const handleCopy = async () => {
    const ok = await copyText(prompt);
    if (ok) {
      setCopied(true);
      setCopyFailed(false);
      setTimeout(() => setCopied(false), 2000);
    } else {
      setCopyFailed(true);
      setTimeout(() => setCopyFailed(false), 2500);
    }
  };

  return (
    <div className="page page-result">
      <PageHeader title="提示词" subtitle={breadcrumb} onBack={onBack} />

      <div className="result-body">
        <div className="prompt-card">
          <div className="prompt-card__head">
            <div className="prompt-card__crumb">{breadcrumb}</div>
            <div className="prompt-card__count">{prompt.length} 字</div>
          </div>
          <pre className="prompt-card__text">{prompt}</pre>
          <button
            type="button"
            className={`btn btn-primary prompt-card__copy${copied ? ' is-copied' : ''}`}
            onClick={handleCopy}
          >
            {copied ? '✓ 已复制' : copyFailed ? '复制失败，请长按文本' : '复制提示词'}
          </button>
        </div>

        <div className="result-goto">
          <div className="result-goto__label">
            <span className="rule-dash">现在去哪里出图</span>
          </div>
          <div className="result-goto__grid">
            {DRAW_TOOLS.map((t) => (
              <a
                key={t.name}
                className="goto-item"
                href={t.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="goto-item__name">{t.name}</span>
                <span className="goto-item__hint">{t.hint}</span>
              </a>
            ))}
          </div>
        </div>

        <div className="result-actions">
          <button type="button" className="btn btn-secondary" onClick={onChangeOne}>
            换一个
          </button>
          <button type="button" className="btn btn-secondary" onClick={onRestart}>
            重新开始
          </button>
        </div>
      </div>

      <IcpBadge />
    </div>
  );
}
