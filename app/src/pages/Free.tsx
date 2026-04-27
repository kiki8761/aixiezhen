import PageHeader from '../components/PageHeader';
import IcpBadge from '../components/IcpBadge';
import { FREE_DIMENSIONS, buildFreePrompt, totalSelected } from '../lib/freeMode';
import type { Selection } from '../lib/freeMode';
import './Free.css';

interface Props {
  selection: Selection;
  onSelectionChange: (s: Selection) => void;
  onBack: () => void;
  onGenerate: (prompt: string) => void;
}

export default function Free({ selection, onSelectionChange, onBack, onGenerate }: Props) {
  const total = totalSelected(selection);
  const enough = total >= 3;

  // 单选：点已选 → 取消；点其他 → 替换为这个
  const toggle = (dimId: string, kw: string) => {
    const current = selection[dimId] || [];
    const next = current[0] === kw ? [] : [kw];
    onSelectionChange({ ...selection, [dimId]: next });
  };

  const clear = () => onSelectionChange({});

  const handleGenerate = () => {
    if (!enough) return;
    const prompt = buildFreePrompt(selection);
    onGenerate(prompt);
  };

  return (
    <div className="page page-free">
      <PageHeader
        title="自由模式"
        subtitle="关键词自由组合"
        onBack={onBack}
        rightSlot={
          total > 0 ? (
            <button
              type="button"
              className="free-clear"
              onClick={clear}
              aria-label="清空已选"
            >
              清空
            </button>
          ) : null
        }
      />

      <div className="free-body">
        {FREE_DIMENSIONS.map((dim) => {
          const selected = selection[dim.id] || [];
          return (
            <section key={dim.id} className="free-dim">
              <div className="free-dim__head">
                <h2 className="free-dim__name">{dim.name}</h2>
                <span className="free-dim__count">
                  已选 {selected.length} / {dim.keywords.length}
                </span>
              </div>
              <div className="free-dim__chips">
                {dim.keywords.map((kw) => {
                  const on = selected.includes(kw);
                  return (
                    <button
                      key={kw}
                      type="button"
                      className={`chip${on ? ' chip--on' : ''}`}
                      onClick={() => toggle(dim.id, kw)}
                    >
                      {kw}
                    </button>
                  );
                })}
              </div>
            </section>
          );
        })}

        <IcpBadge />

        <div className="free-footspace" aria-hidden="true" />
      </div>

      <div className="free-footbar">
        <div className="free-footbar__inner">
          <div className="free-footbar__meta">
            <div className="free-footbar__count">已选 {total} 项</div>
            <div className="free-footbar__hint">
              {enough ? '建议每个维度至少选 1 项' : '至少选 3 项'}
            </div>
          </div>
          <button
            type="button"
            className="btn btn-primary"
            disabled={!enough}
            onClick={handleGenerate}
          >
            生成提示词
          </button>
        </div>
      </div>
    </div>
  );
}
