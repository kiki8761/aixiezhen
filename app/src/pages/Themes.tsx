import { useMemo } from 'react';
import PageHeader from '../components/PageHeader';
import IcpBadge from '../components/IcpBadge';
import type { Theme } from '../lib/types';
import './Themes.css';

interface Props {
  themes: Theme[];
  query: string;
  onQueryChange: (q: string) => void;
  onBack: () => void;
  onSelect: (themeId: string) => void;
}

export default function Themes({ themes, query, onQueryChange, onBack, onSelect }: Props) {
  const filtered = useMemo(() => {
    const q = query.trim();
    if (!q) return themes;
    return themes.filter(
      (t) => t.name.includes(q) || (t.tagline && t.tagline.includes(q)),
    );
  }, [themes, query]);

  return (
    <div className="page page-themes">
      <PageHeader title="模板模式" subtitle="选一个主题方案" onBack={onBack} />

      <div className="themes-search">
        <input
          className="input"
          type="search"
          enterKeyHint="search"
          placeholder="搜索主题：赤梦流霞 / 竹林 / 雪……"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <div className="themes-empty">
          没有匹配「{query}」的主题<br />
          <span className="caption">试试换个关键词</span>
        </div>
      ) : (
        <div className="themes-grid">
          {filtered.map((t) => (
            <ThemeCard key={t.id} theme={t} onClick={() => onSelect(t.id)} />
          ))}
        </div>
      )}

      <IcpBadge />
    </div>
  );
}

function ThemeCard({ theme, onClick }: { theme: Theme; onClick: () => void }) {
  // 顶部偏深、底部留呼吸感；比一开始的 0.22→0.08 加深约 1.8 倍，识别度更强
  const bg = `linear-gradient(160deg, ${hexToRgba(theme.color, 0.42)} 0%, ${hexToRgba(theme.color, 0.16)} 100%)`;
  return (
    <button className="theme-card" onClick={onClick} style={{ background: bg }}>
      <span
        className="theme-card__badge"
        style={{ color: theme.color }}
        aria-label={`${theme.variants.length} 个变体`}
      >
        {theme.variants.length}
      </span>
      <div className="theme-card__inner">
        <div className="theme-card__name">{theme.name}</div>
        {theme.tagline ? <div className="theme-card__tag">{theme.tagline}</div> : null}
      </div>
    </button>
  );
}

function hexToRgba(hex: string, alpha: number): string {
  const h = hex.replace('#', '');
  const full = h.length === 3
    ? h.split('').map((c) => c + c).join('')
    : h;
  const n = parseInt(full, 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
