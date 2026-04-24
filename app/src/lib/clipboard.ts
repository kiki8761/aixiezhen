// iOS Safari / 微信内置浏览器兼容的复制实现
// 先用 navigator.clipboard.writeText，失败降级到 execCommand
export async function copyText(text: string): Promise<boolean> {
  // 现代 API（需要 https + user gesture，iOS Safari 14+ 支持）
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // 落入降级
    }
  }

  // 降级：选区 + execCommand
  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.top = '0';
    ta.style.left = '0';
    ta.style.opacity = '0';
    ta.style.pointerEvents = 'none';
    ta.style.fontSize = '16px'; // iOS 避免缩放
    document.body.appendChild(ta);

    const sel = document.getSelection();
    const savedRange = sel && sel.rangeCount > 0 ? sel.getRangeAt(0) : null;

    // iOS Safari 需要 setSelectionRange
    ta.focus();
    ta.setSelectionRange(0, text.length);

    const ok = document.execCommand('copy');
    document.body.removeChild(ta);

    if (savedRange && sel) {
      sel.removeAllRanges();
      sel.addRange(savedRange);
    }
    return ok;
  } catch {
    return false;
  }
}

export function copyTextSync(text: string): boolean {
  // 某些 iOS 场景下 async 会丢失用户手势；此版本是纯同步的兜底
  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.top = '0';
    ta.style.left = '0';
    ta.style.opacity = '0';
    ta.style.pointerEvents = 'none';
    ta.style.fontSize = '16px';
    document.body.appendChild(ta);
    ta.focus();
    ta.setSelectionRange(0, text.length);
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}
