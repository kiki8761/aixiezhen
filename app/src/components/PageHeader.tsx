import './PageHeader.css';

interface Props {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  rightSlot?: React.ReactNode;
}

export default function PageHeader({ title, subtitle, onBack, rightSlot }: Props) {
  return (
    <header className="page-head">
      <button
        type="button"
        className="page-head__back hit"
        onClick={onBack}
        aria-label="返回"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path d="M9 2 L4 7 L9 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <div className="page-head__center">
        <h1 className="page-head__title">{title}</h1>
        {subtitle ? (
          <div className="page-head__sub">
            <span className="rule-dash">{subtitle}</span>
          </div>
        ) : null}
      </div>
      <div className="page-head__right">{rightSlot}</div>
    </header>
  );
}
