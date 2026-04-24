// 主题切换（默认跟随系统，用户手动切换后持久化到 localStorage）
export type ThemeMode = 'light' | 'dark' | 'system';

const KEY = 'aixiezhen.theme';

export function loadTheme(): ThemeMode {
  try {
    const v = localStorage.getItem(KEY);
    if (v === 'light' || v === 'dark' || v === 'system') return v;
  } catch {}
  return 'system';
}

export function applyTheme(mode: ThemeMode) {
  const root = document.documentElement;
  if (mode === 'system') {
    root.removeAttribute('data-theme');
  } else {
    root.setAttribute('data-theme', mode);
  }
  try {
    localStorage.setItem(KEY, mode);
  } catch {}
}

export function nextTheme(mode: ThemeMode): ThemeMode {
  // light → dark → system → light
  if (mode === 'light') return 'dark';
  if (mode === 'dark') return 'system';
  return 'light';
}

export function resolveIsDark(mode: ThemeMode): boolean {
  if (mode === 'dark') return true;
  if (mode === 'light') return false;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}
