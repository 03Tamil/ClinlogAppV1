import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import Link from "next/link"

// lib/withPagesV2.js
export function withPagesV2(href, enabled) {
  if (!enabled) return href

  // string href
  if (typeof href === "string") {
    // don't touch external links
    if (
      /^(https?:)?\/\//.test(href) ||
      href.startsWith("mailto:") ||
      href.startsWith("tel:")
    ) {
      return href
    }

    const [pathAndQuery, hash = ""] = href.split("#")
    const [path, query = ""] = pathAndQuery.split("?")

    if (path.startsWith("/pagesv2")) return href

    const nextPath = path.startsWith("/")
      ? `/pagesv2${path}`
      : `/pagesv2/${path}`
    return `${nextPath}${query ? `?${query}` : ""}${hash ? `#${hash}` : ""}`
  }

  // UrlObject href (Link supports this) :contentReference[oaicite:1]{index=1}
  const pathname = href.pathname || ""
  if (pathname.startsWith("/pagesv2")) return href

  return {
    ...href,
    pathname: pathname.startsWith("/")
      ? `/pagesv2${pathname}`
      : `/pagesv2/${pathname}`,
  }
}

// hooks/useV2Router.js

export function useV2Router() {
  const router = useRouter()
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const v2 =
      router.asPath.includes("/pagesv2") ||
      sessionStorage.getItem("pagesv2") === "1"
    setEnabled(v2)
  }, [router.asPath])

  return {
    ...router,
    push: (url, as?, options?) =>
      router.push(withPagesV2(url, enabled), as, options),
    replace: (url, as?, options?) =>
      router.replace(withPagesV2(url, enabled), as, options),
  }
}

// components/V2Link.jsx

export function V2Link({ href, ...props }) {
  const router = useRouter()
  const [enabled, setEnabled] = useState(false)

  // Avoid hydration mismatches: decide on the client after mount
  useEffect(() => {
    const v2 =
      router.asPath.includes("/pagesv2") ||
      sessionStorage.getItem("pagesv2") === "1"
    setEnabled(v2)
  }, [router.asPath])

  return <Link href={withPagesV2(href, enabled)} {...props} />
}
