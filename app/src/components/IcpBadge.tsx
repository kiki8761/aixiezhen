import './IcpBadge.css';

// 工信部 ICP 备案 + 公安网安备案 · kikiaigc.com 主体
// 流式居中页脚，跟随内容末尾
export default function IcpBadge() {
  return (
    <div className="icp-foot">
      <a
        className="icp-foot__link"
        href="https://beian.miit.gov.cn/"
        target="_blank"
        rel="noopener noreferrer"
      >
        京ICP备2026018722号-1
      </a>
      <span className="icp-foot__sep" aria-hidden="true">·</span>
      <a
        className="icp-foot__link"
        href="https://beian.mps.gov.cn/#/query/webSearch?code=11011502039877"
        target="_blank"
        rel="noopener noreferrer"
      >
        京公网安备11011502039877号
      </a>
    </div>
  );
}
