import themesData from '../data/themes.json';
import type { ThemesData } from '../lib/types';
import { FREE_DIMENSIONS } from '../lib/freeMode';
import './Home.css';

interface Props {
  onEnterTemplate: () => void;
  onEnterFree: () => void;
}

export default function Home({ onEnterTemplate, onEnterFree }: Props) {
  const data = themesData as ThemesData;
  const themeCount = data.themes.length;
  const variantCount = data.themes.reduce((acc, t) => acc + t.variants.length, 0);
  const dimCount = FREE_DIMENSIONS.length;
  const keywordCount = FREE_DIMENSIONS.reduce((acc, d) => acc + d.keywords.length, 0);

  return (
    <div className="home">
      <div className="home-hero" aria-hidden="true" />
      <div className="home-overlay" aria-hidden="true" />

      <main className="home-inner">
        <header className="home-head">
          <img
            className="home-logo"
            src="/assets/logo.png"
            alt=""
            width={80}
            height={80}
          />
          <h1 className="home-title">古风提示词生成器</h1>
          <div className="home-subtitle">
            <span className="rule-dash rule-dash--hero">选一选，就能出图</span>
          </div>
        </header>

        <section className="home-cards">
          <button
            className="mode-card mode-card--primary"
            onClick={onEnterTemplate}
            aria-label="进入模板模式"
          >
            <div className="mode-card__head">
              <span className="mode-card__icon" aria-hidden="true">📖</span>
              <h2 className="mode-card__title">模板模式</h2>
            </div>
            <p className="mode-card__desc">选现成方案，一键出图</p>
            <p className="mode-card__meta">{themeCount} 个主题 × {variantCount} 种姿势</p>
          </button>

          <button
            className="mode-card mode-card--secondary"
            onClick={onEnterFree}
            aria-label="进入自由模式"
          >
            <div className="mode-card__head">
              <span className="mode-card__icon" aria-hidden="true">🎨</span>
              <h2 className="mode-card__title">自由模式</h2>
            </div>
            <p className="mode-card__desc">关键词自由组合，玩出花</p>
            <p className="mode-card__meta">{dimCount} 个维度 × {keywordCount} 个关键词</p>
          </button>
        </section>

        <footer className="home-foot">
          <div className="home-foot__brand">
            by <span className="home-foot-brand">kiki</span> 的 AI 日常
          </div>
          <a
            className="home-foot__icp"
            href="https://beian.miit.gov.cn/"
            target="_blank"
            rel="noopener noreferrer"
          >
            京ICP备2026018722号
          </a>
        </footer>
      </main>
    </div>
  );
}
