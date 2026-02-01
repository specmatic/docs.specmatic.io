export default function HeadingWithBadge({ children, label }) {
    return (
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
        <h1 style={{ marginBottom: 0 }}>{children}</h1>
        <span className="badge badge--info" style={{ fontSize: '0.75rem' }}>
          {label}
        </span>
      </div>
    );
  }