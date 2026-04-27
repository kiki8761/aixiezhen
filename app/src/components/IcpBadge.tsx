import './IcpBadge.css';

// 工信部 ICP 备案号 · kikiaigc.com 主体（京ICP备2026018722号）
// 流式居中页脚，跟随内容末尾，点击跳 beian.miit.gov.cn
export default function IcpBadge() {
  return (
    <div className="icp-foot">
      <a
        className="icp-foot__link"
        href="https://beian.miit.gov.cn/"
        target="_blank"
        rel="noopener noreferrer"
      >
        京ICP备2026018722号
      </a>
    </div>
  );
}
