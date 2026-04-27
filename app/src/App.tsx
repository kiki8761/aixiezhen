import { useEffect, useMemo, useState } from 'react';
import type { PageRoute, ThemesData } from './lib/types';
import themesJson from './data/themes.json';
import Home from './pages/Home';
import Themes from './pages/Themes';
import Variants from './pages/Variants';
import Free from './pages/Free';
import Result from './pages/Result';
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

  // 路由栈：用 history.pushState 维护，浏览器返回 = 左上角返回 = 都回上一级
  useEffect(() => {
    // 初始化：把当前 home 路由写到 history 当前 entry，刷新/直接打开都回 home
    window.history.replaceState({ route: { name: 'home' } as PageRoute }, '', '#home');

    const onPop = (e: PopStateEvent) => {
      const r = (e.state && e.state.route) as PageRoute | undefined;
      setRoute(r ?? { name: 'home' });
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  // 前进操作：push 一条新 history，setRoute 同步更新
  const navigate = (next: PageRoute) => {
    setRoute(next);
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    window.history.pushState({ route: next }, '', `#${next.name}`);
  };

  // 返回操作：交给浏览器 history.back，popstate 会回放到上一个 route
  const goBack = () => {
    window.history.back();
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
            onBack={goBack}
            onSelect={(themeId) => navigate({ name: 'variants', themeId })}
          />
        );
      case 'variants': {
        const theme = data.themes.find((t) => t.id === route.themeId);
        if (!theme) {
          return (
            <div style={{ padding: 20 }}>
              主题不存在，<button className="btn btn-secondary" onClick={goBack}>返回</button>
            </div>
          );
        }
        return (
          <Variants
            theme={theme}
            onBack={goBack}
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
            onBack={goBack}
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
            onBack={goBack}
            onRestart={() => {
              if (route.from === 'free') setFreeSelection({});
              navigate({ name: 'home' });
            }}
            onChangeOne={goBack}
          />
        );
    }
  }, [route, data, freeSelection, themeQuery]);

  return page;
}
