export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="status-block status-block--error" role="alert">
      <p className="status-block__title">Something went wrong</p>
      <p>{message}</p>
      {onRetry && (
        <button type="button" className="status-block__retry" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}
