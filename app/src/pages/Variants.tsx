import PageHeader from '../components/PageHeader';
import IcpBadge from '../components/IcpBadge';
import type { Theme, Variant } from '../lib/types';
import './Variants.css';

interface Props {
  theme: Theme;
  onBack: () => void;
  onPickVariant: (variant: Variant) => void;
}

export default function Variants({ theme, onBack, onPickVariant }: Props) {
  return (
    <div className="page page-variants">
      <PageHeader title={theme.name} subtitle={theme.tagline} onBack={onBack} />

      <div className="variants-list">
        {theme.variants.map((v, idx) => (
          <button
            key={v.id}
            className="variant-row"
            onClick={() => onPickVariant(v)}
          >
            <span className="variant-row__idx" aria-hidden="true">
              {String(idx + 1).padStart(2, '0')}
            </span>
            <div className="variant-row__body">
              <div className="variant-row__label">{v.poseLabel}</div>
              <div className="variant-row__desc">{v.description}</div>
            </div>
            <span className="variant-row__arrow" aria-hidden="true">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M4 2 L9 6 L4 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </button>
        ))}
      </div>

      <IcpBadge />
    </div>
  );
}
