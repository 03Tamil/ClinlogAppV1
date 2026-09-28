import { ErrorState } from "componentsv2/common/QueryState"

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
    <ErrorState
      title={customMessage ?? "Something went wrong."}
      description="Try again. If the problem persists, please create a support ticket."
      onRetry={resetErrorBoundary}
    />
  )
}
