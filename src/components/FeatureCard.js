export default function FeatureCard({ title, description }) {
  return (
    <div
      style={{
        border: '1px solid #e5e7eb',
        borderRadius: 8,
        padding: 16,
        marginTop: 16,
      }}
    >
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}
