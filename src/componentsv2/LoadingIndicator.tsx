import { Skeleton } from "@chakra-ui/react";
import Router from "next/router";
import { useEffect, useRef, useState } from "react";

export function LoadingIndicator() {
  const [loading, setLoading] = useState(false);

  // Small UX improvement: avoid flashing for super-fast navigations
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    const start = () => {
      // delay showing a tiny bit to prevent flicker
      timerRef.current = window.setTimeout(() => setLoading(true), 80);
    };

    const end = () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      setLoading(false);
    };

    Router.events.on("routeChangeStart", start);
    Router.events.on("routeChangeComplete", end);
    Router.events.on("routeChangeError", end);

    return () => {
      Router.events.off("routeChangeStart", start);
      Router.events.off("routeChangeComplete", end);
      Router.events.off("routeChangeError", end);
      end();
    };
  }, []);

  const isLoading = loading;

  return (
    <Skeleton
      position="fixed"
      top="0"
      left="0"
      height="5px"
      startColor="#00fee6"
      endColor="#08beff"
      transition={`width ${isLoading ? 0.1 : 0}s, opacity ${isLoading ? 0.1 : 1}s`}
      width={isLoading ? "100%" : "0%"}
      opacity={isLoading ? 0.5 : 0}
      zIndex={9999}
      borderRadius={0}
    />
  );
}