import './IcpBadge.css';

// 工信部 ICP 备案号 · kikiaigc.com 主体（京ICP备2026018722号）
// 点击跳 beian.miit.gov.cn
export default function IcpBadge({ variant = 'glass' }: { variant?: 'glass' | 'plain' }) {
  return (
    <a
      className={`icp-badge icp-badge--${variant}`}
      href="https://beian.miit.gov.cn/"
      target="_blank"
      rel="noopener noreferrer"
    >
      京ICP备2026018722号
    </a>
  );
}
