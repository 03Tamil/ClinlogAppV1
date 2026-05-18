import { useRouter } from "next/router"
import Link from "next/link"

export function withPagesV2(href, enabled) {
  return href
}

export function useV2Router() {
  return useRouter()
}

export function V2Link({ href, ...props }) {
  return <Link href={href} {...props} />
}
