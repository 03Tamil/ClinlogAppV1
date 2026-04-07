type fallbackTypes = {
  error: any
  resetErrorBoundary: () => void
  customMessage?: string
}

export function Fallback({
  error,
  resetErrorBoundary,
  customMessage,
}: fallbackTypes) {
  return (
    <div role="alert">
      <p>
        Something went wrong: please try refreshing page if error persists
        please create a support ticket
      </p>
      <pre style={{ color: "red" }}>{customMessage}</pre>
    </div>
  )
}
