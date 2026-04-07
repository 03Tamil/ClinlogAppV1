import * as React from "react"

export const useIsOverflow = (ref) => {
  const [isOverflow, setIsOverflow] = React.useState(undefined)

  React.useLayoutEffect(() => {
    const { current } = ref

    const trigger = () => {
      const hasOverflow = current.scrollWidth > current.clientWidth
      setIsOverflow(hasOverflow)
    }

    if (current) {
      if ("ResizeObserver" in window) {
        new ResizeObserver(trigger).observe(current)
      }
      trigger()
    }
  }, [ref])

  return isOverflow
}
