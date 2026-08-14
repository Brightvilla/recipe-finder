export default function Loading({ label = "Loading recipes…" }) {
  return (
    <div className="status-block" role="status" aria-live="polite">
      <div className="status-block__spinner" aria-hidden="true" />
      <p>{label}</p>
    </div>
  );
}
