import { useEffect, useMemo, useState } from 'react';
import type { PageRoute, ThemesData } from './lib/types';
import themesJson from './data/themes.json';
import Home from './pages/Home';
import Themes from './pages/Themes';
import Variants from './pages/Variants';
import Free from './pages/Free';
import Result from './pages/Result';
import IcpBadge from './components/IcpBadge';
import { applyTheme, loadTheme } from './lib/theme';
import type { Selection } from './lib/freeMode';

export default function App() {
  const data = themesJson as ThemesData;
  const [route, setRoute] = useState<PageRoute>({ name: 'home' });

  // 自由模式的选择状态（跨页保留，满足"换一个/重新开始"）
  const [freeSelection, setFreeSelection] = useState<Selection>({});

  // 模板模式首页滚动位置与搜索词（回退时保留）
  const [themeQuery, setThemeQuery] = useState('');

  // 主题初始化（默认跟随系统；用户手动切换后持久化）
  useEffect(() => {
    applyTheme(loadTheme());
  }, []);

  // hash 路由支持（浏览器返回键能回上一步）
  useEffect(() => {
    const onPop = () => {
      // 简单处理：返回时一律回首页，避免 hash 解析复杂
      setRoute({ name: 'home' });
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const navigate = (next: PageRoute) => {
    setRoute(next);
    // 滚动到顶部
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    // 为浏览器返回键埋点
    window.history.pushState({ screen: next.name }, '', `#${next.name}`);
  };

  const page = useMemo((): React.ReactNode => {
    switch (route.name) {
      case 'home':
        return (
          <Home
            onEnterTemplate={() => navigate({ name: 'themes' })}
            onEnterFree={() => navigate({ name: 'free' })}
          />
        );
      case 'themes':
        return (
          <Themes
            themes={data.themes}
            query={themeQuery}
            onQueryChange={setThemeQuery}
            onBack={() => navigate({ name: 'home' })}
            onSelect={(themeId) => navigate({ name: 'variants', themeId })}
          />
        );
      case 'variants': {
        const theme = data.themes.find((t) => t.id === route.themeId);
        if (!theme) {
          return (
            <div style={{ padding: 20 }}>
              主题不存在，<button className="btn btn-secondary" onClick={() => navigate({ name: 'themes' })}>返回主题墙</button>
            </div>
          );
        }
        return (
          <Variants
            theme={theme}
            onBack={() => navigate({ name: 'themes' })}
            onPickVariant={(variant) =>
              navigate({
                name: 'result',
                breadcrumb: `${theme.name} · ${variant.poseLabel}`,
                prompt: variant.prompt,
                from: 'template',
                themeId: theme.id,
              })
            }
          />
        );
      }
      case 'free':
        return (
          <Free
            selection={freeSelection}
            onSelectionChange={setFreeSelection}
            onBack={() => navigate({ name: 'home' })}
            onGenerate={(prompt) =>
              navigate({
                name: 'result',
                breadcrumb: '自由组合',
                prompt,
                from: 'free',
              })
            }
          />
        );
      case 'result':
        return (
          <Result
            breadcrumb={route.breadcrumb}
            prompt={route.prompt}
            onBack={() => {
              if (route.from === 'template' && route.themeId) {
                navigate({ name: 'variants', themeId: route.themeId });
              } else {
                navigate({ name: 'free' });
              }
            }}
            onRestart={() => {
              if (route.from === 'free') setFreeSelection({});
              navigate({ name: 'home' });
            }}
            onChangeOne={() => {
              if (route.from === 'template' && route.themeId) {
                navigate({ name: 'variants', themeId: route.themeId });
              } else {
                navigate({ name: 'free' });
              }
            }}
          />
        );
    }
  }, [route, data, freeSelection, themeQuery]);

  // free 模式底部有固定操作栏会挡住，其它页面都显示
  const showIcp = route.name !== 'free';
  const icpVariant = route.name === 'home' ? 'glass' : 'plain';

  return (
    <>
      {page}
      {showIcp ? <IcpBadge variant={icpVariant} /> : null}
    </>
  );
}
