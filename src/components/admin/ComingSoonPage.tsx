export default function ComingSoonPage({ title, description }: { title: string; description: string }) {
  return (
    <div className="empty" style={{ padding: "80px 20px" }}>
      <svg width="40" height="40" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" style={{ margin: "0 auto 16px" }}>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 8v4l2.5 2.5" />
      </svg>
      <p style={{ fontWeight: 700, fontSize: 15, marginBottom: 6, color: "var(--text)" }}>{title}</p>
      <p>{description}</p>
    </div>
  );
}
