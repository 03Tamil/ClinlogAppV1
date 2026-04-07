import { Box, ChakraProvider } from "@chakra-ui/react";
import theme from "../theme";
import { AppProps } from "next/app";
import Head from "next/head";
import { useEffect, useState } from "react";

import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
  useQueryClient
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Router, useRouter } from "next/router";
import { Layout } from "layouts/Layout";
import { LayoutV2 } from "layouts/LayoutV2";
import { SessionProvider, signOut, useSession } from "next-auth/react";
import { NextComponentType } from "next/types";
import FullscreenLoadingSpinner from "componentsv2/FullscreenLoadingSpinner";
import "../global.css";
import { needToSignTermsAtom } from "store/store";
import { useAtom } from "jotai";
import { Toaster } from "sonner";


import "material-symbols";
import MaintenanceBar from "components/MaintenanceBar";
import { pageTitles } from "helpersv2/PageTitles";



type CustomComponentType = NextComponentType & {
  auth: {
    public?: boolean;
    role?: "Patient" | "Staff" | "Overseer" | "Business Manager";
  };
};

const fetchClientSecret = () => {
  return fetch("/create-checkout-session", { method: "POST" })
    .then((response) => response.json())
    .then((json) => json.checkoutSessionClientSecret);
};

function CancelOnRouteChange() {
  const queryClient = useQueryClient();
  useEffect(() => {
    const cancelAll = () => queryClient.cancelQueries(); // cancels all active queries
    Router.events.on("routeChangeStart", cancelAll);
    return () => Router.events.off("routeChangeStart", cancelAll);
  }, [queryClient]);
  return null;
}

type CustomAppProps = AppProps & {
  Component: CustomComponentType; // add auth type
};

function MyApp({ Component, pageProps }: CustomAppProps) {
  const router = useRouter();
  const title = (Component as any).title as string | undefined;

  const onPagesV2 = router.asPath.includes("pagesv2");

  const derivedTitle = Object.entries(pageTitles)
    .sort(([a], [b]) => b.length - a.length)
    .find(([key, value]) =>
      router.asPath.includes(`${onPagesV2 ? "pagesv2/" : ""}${key}`),
    )?.[1];
  const finalTitle = derivedTitle ?? title;

  const pageTitle = finalTitle
    ? `${finalTitle} | SmileConnect`
    : "SmileConnect";

  const [needToSignTerms, setNeedToSignTerms] = useAtom(needToSignTermsAtom);
  const isV2 = router.asPath.includes("pagesv2");
  // useEffect(() => {
  //   socket.connect()
  //   // Listen for chat messages
  //   const handleChatMessage = (message: string | any) => {
  //     toast.custom(
  //       (t) => (
  //         <div className="flex rounded-lg bg-white shadow-lg ring-1 ring-black/5 w-full md:max-w-[364px] items-center p-4">
  //           <div className="flex flex-1 items-center">
  //             <div className="w-full">
  //               <p className="text-sm font-medium text-gray-900">
  //                 New Message {!message?.name ? "" : `From ${message?.name}`}
  //               </p>
  //               <p className="mt-1 text-sm text-gray-500">{message?.message}</p>
  //             </div>
  //           </div>
  //           <div className="ml-5 shrink-0 rounded-md text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-hidden">
  //             <Link
  //               // href={`/pagesv2/patientglobal?postId=${message?.id}&method=sms`}
  //               href={`/pagesv2/patientdata?postId=${message?.id}&method=sms`}
  //               className="rounded bg-indigo-50 px-3 py-1 text-sm font-semibold text-indigo-600 hover:bg-indigo-100"
  //             >
  //               View Patient
  //             </Link>
  //           </div>
  //         </div>
  //       ),
  //       {
  //         description: message?.message,
  //         duration: 3000,
  //       }
  //     )
  //   }

  //   onChatMessage(handleChatMessage)
  //   const handleVoiceMessage = (message: string | any) => {
  //     toast.custom(
  //       (t) => (
  //         <div className="flex rounded-lg bg-white shadow-lg ring-1 ring-black/5 w-full md:max-w-[364px] items-center p-4">
  //           <div className="flex flex-1 items-center">
  //             <div className="w-full">
  //               <p className="text-sm font-medium text-gray-900">
  //                 {message?.message}
  //               </p>
  //             </div>
  //           </div>
  //           <div className="ml-5 shrink-0 rounded-md text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-hidden">
  //             <Link
  //               href={`/pagesv2/patientglobal?postId=${message?.id}&method=voice`}
  //               className="rounded bg-indigo-50 px-3 py-1 text-sm font-semibold text-indigo-600 hover:bg-indigo-100"
  //             >
  //               View Patient
  //             </Link>
  //           </div>
  //         </div>
  //       ),
  //       {
  //         description: message?.message,
  //         duration: 3000,
  //       }
  //     )
  //   }
  //   const handleNotification = (message: string | any) => {
  //     toast.custom(
  //       (t) => (
  //         // <div className="flex rounded-lg bg-white shadow-lg ring-1 ring-black/5 w-full md:max-w-[364px] items-center p-4">
  //         //   <div className="flex flex-1 items-center">
  //         //     <div className="w-full">
  //         //       <p className="text-sm font-medium text-gray-900">
  //         //         New Notification
  //         //       </p>
  //         //       <p className="mt-1 text-sm text-gray-500">{message?.message}</p>
  //         //     </div>
  //         //   </div>
  //         //   <div className="ml-5 shrink-0 rounded-md text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-hidden">
  //         //     <Link
  //         //       // href={`/pagesv2/patientglobal?postId=${message?.id}&method=sms`}
  //         //       href={`/pagesv2/patienttable`}
  //         //       className="rounded bg-indigo-50 px-3 py-1 text-sm font-semibold text-indigo-600 hover:bg-indigo-100"
  //         //     >
  //         //       Go To Dashboard
  //         //     </Link>
  //         //   </div>
  //         // </div>
  //         <div className="flex rounded-lg bg-white shadow-lg ring-1 ring-black/5 w-full md:max-w-[364px] items-center p-4">
  //           <Box
  //             w="42px"
  //             h="42px"
  //             borderRadius="50%"
  //             display="flex"
  //             alignItems="center"
  //             justifyContent="center"
  //             bg="#007AFF"
  //             // mr="8px"
  //           >
  //             <span
  //               className="material-symbols-outlined"
  //               style={{
  //                 color: "white",
  //                 fontSize: "24px",
  //                 fontVariationSettings:
  //                   '"FILL" 1, "wght" 400, "GRAD" 0, "opsz" 24',
  //               }}
  //             >
  //               crown
  //             </span>
  //           </Box>
  //           <div className="flex flex-1 items-center">
  //             <div className="w-full">
  //               <p className="text-sm font-medium text-gray-900">
  //                 New Notification
  //               </p>
  //             </div>
  //           </div>
  //           <div className="ml-5 shrink-0 rounded-md text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-hidden">
  //             <Link
  //               href={`/pagesv2/patienttable`}
  //               className="rounded bg-indigo-50 px-3 py-1 text-sm font-semibold text-indigo-600 hover:bg-indigo-100"
  //             >
  //               Go To Dashboard
  //             </Link>
  //           </div>
  //         </div>
  //       ),
  //       {
  //         description: message?.message,
  //         duration: 3000,
  //       }
  //     )
  //   }
  //   onNotification(handleNotification)
  //   onVoiceMessage(handleVoiceMessage)
  //   // Cleanup on component unmount
  //   return () => {
  //     offChatMessage(handleChatMessage)
  //     offVoiceMessage(handleVoiceMessage)
  //     offNotification(handleNotification)
  //     socket.disconnect()
  //   }
  // }, [])
  useEffect(() => {
    const markV2 = (url: string) => {
      if (url.includes("/pagesv2")) {
        sessionStorage.setItem("pagesv2", "1");
      }
    };
    // initial
    markV2(router.asPath);

    // on navigation
    router.events.on("routeChangeComplete", markV2);
    return () => router.events.off("routeChangeComplete", markV2);
  }, [router]);

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 2 * 60 * 1000,
          },
        },
        queryCache: new QueryCache({
          onError: (error: any, query) => {
            const isPermissionError =
              error.response?.errors?.find(
                (item) =>
                  item.message ===
                  "User doesn't have permission to access requested field(s)",
              ) !== undefined;

            const isAuthError =
              error.response?.errors?.find(
                (item) => item.message === "Invalid Authorization Header",
              ) !== undefined;

            if (!!isAuthError) {
              signOut({
                redirect: false,
              });
              queryClient.removeQueries();
              queryClient.clear();
              // router.push("/pagesv2/404?error=Login%20Timed%20Out")
            }
            if (isPermissionError) {
              if (isV2) {
                router.push("/pagesv2/403");
              } else {
                router.push("/403");
              }
            }
          },
        }),
      }),
  );

  useEffect(() => {
    if (!Component.auth?.public) {
      const pathsNotToRedirect = [
        "/setup-account",
        "/setup-account/details",
        "/setup-account/terms",
        "/terms",
        "/terms/patient",
        "/terms/staff",
        "/support",
        "/account/support-ticket",
        "/privacy",
        "/sensitive-information",
        "/thank-you",
        "/signout",
        "/forgot-password",
        "/forgot-password/reset",
        "/verify-new-email",
        "/404",
      ];

      if (needToSignTerms) {
        if (!pathsNotToRedirect.includes(router.pathname)) {
          if (isV2) {
            router.push("/pagesv2/setup-account/terms");
          } else {
            router.push("/setup-account/terms");
          }
        }
      } else if (router.pathname === "/setup-account/terms") {
        if (isV2) {
          router.push("/pagesv2/");
        } else {
          router.push("/");
        }
      }
    }
  }, [needToSignTerms, router.pathname]);
  const showMaintenanceBar = false;
  const LayoutComponent = isV2 ? LayoutV2 : Layout;
  return (
    <SessionProvider
      session={pageProps.session}
      refetchInterval={5 * 60}
      // Re-fetches session when window is focused
      // refetchWhenOffline={false}
      refetchOnWindowFocus={true}
    >
      <ChakraProvider theme={theme}>
        <Head>
          <title>{pageTitle}</title>
          <link
            rel="icon"
            type="image/png"
            href="/smileconnect-favicon-96x96.png"
            sizes="96x96"
          />
          <link
            rel="icon"
            type="image/svg+xml"
            href="/smileconnect-favicon.svg"
          />
          <link rel="shortcut icon" href="/smileconnect-favicon.ico" />
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/smileconnect-apple-touch-icon.png"
          />
          <link rel="manifest" href="/site.webmanifest" />
        </Head>
        {showMaintenanceBar && !isV2 && <MaintenanceBar />}
        <QueryClientProvider client={queryClient}>
          {/* @ts-ignore*/}
          {/* <Hydrate state={pageProps?.dehydratedState}> */}
          <Box pt={showMaintenanceBar && !isV2 ? "40px" : "0"}>
            <LayoutComponent>
              <Toaster position="top-right" richColors expand={true} />
              {!Component.auth?.public ? (
                <Auth component={Component}>
                  <Component {...pageProps} />
                </Auth>
              ) : (
                <Component {...pageProps} />
              )}
            </LayoutComponent>
          </Box>
          <ReactQueryDevtools />
          {/* </Hydrate> */}
        </QueryClientProvider>
      </ChakraProvider>
    </SessionProvider>
  );
}

export default MyApp;

type AuthProps = {
  component: CustomComponentType;
  children: any;
};

function Auth({ component, children }: AuthProps) {
  // if `{ required: true }` is supplied, `status` can only be "loading" or "authenticated"
  const router = useRouter();

  const { status, data: session } = useSession({
    required: true,
    onUnauthenticated() {
      // if (router.asPath.includes("pagesv2")) {
      //   const locationAccessArray = [186, 196, 215, 199, 160733];
      //   if (
      //     session?.locationIds?.some((id: number) =>
      //       locationAccessArray.includes(id),
      //     )
      //   ) {
      //   } else {
      //     if (typeof window !== "undefined") {
      //       router.push("/403");
      //     }
      //   }
      //   const currentPath = router.asPath;
      //   router.push(
      //     `/pagesv2/signin?redirect=${encodeURIComponent(currentPath)}`,
      //   );
      // } else {
      //   const currentPath = router.asPath;
      //   router.push(`/signin?redirect=${encodeURIComponent(currentPath)}`);
      // }
      router.push("/");
    },
  });

  if (status === "loading") {
    return <FullscreenLoadingSpinner />;
  }
  // If the route contains "pagesv2", always redirect to 403
  if (router.asPath.includes("pagesv2")) {
    const locationAccessArray = [186, 196, 215, 199, 160733];
    if (
      session?.locationIds?.some((id: number) =>
        locationAccessArray.includes(id),
      )
    ) {
    } else {
      if (typeof window !== "undefined") {
        router.push("/403");
      }
    }
  }
  const role = component?.auth?.role;
  if (role === "Patient" && !session.groups?.includes("Patient")) {
    router.push("/403");
    return null;
  } else if (
    role === "Staff" &&
    !session.groups?.some((r) =>
      [
        "Anaesthetic Staff",
        "MAS Overseer",
        "Anaesthetist",
        "Dentist",
        "External Dentist",
        "Laboratory Overseer",
        "Laboratory Technician",
        "Nurse",
        "Overseer",
        "Receptionist",
        "Treatment Coordinator",
      ].includes(r),
    )
  ) {
    router.push("/403");
    return null;
  } else if (
    role === "Overseer" &&
    !session.groups?.some((r) =>
      ["MAS Overseer", "Laboratory Overseer", "Overseer"].includes(r),
    )
  ) {
    router.push("/403");
    return null;
  } else if (
    role === "Business Manager" &&
    !session.groups?.some((r) => ["Business Manager", "Admin"].includes(r))
  ) {
    router.push("/404?error=Invalid%20Permissions");
    return null;
  } else if (
    !session.groups?.some((r) =>
      [
        "Dentist",
        "Nurse",
        "Overseer",
        "Receptionist",
        "Treatment Coordinator",
        "Admin",
        "Business Manager",
      ].includes(r),
    ) &&
    router.pathname === "/newleadinfo"
  ) {
    router.push("/403");
  }
  /*
    const componentRolesInit = component?.auth?.role ?? []
    const componentRoles = componentRolesInit.includes("Staff") ? [...componentRolesInit, "Anaesthetic Staff", "MAS Overseer", "Anaesthetist", "Dentist", "External Dentist", "Laboratory Overseer", "Laboratory Technician", "Nurse", "Overseer"] : componentRolesInit

    // If just a string, convert to array
    const userRoles = Array.isArray(session.groups) ? session.groups : [session.groups]

    if(componentRoles.length > 0) {
      if(!componentRoles.some(r => userRoles.includes(r))) {
        router.push("/403")
        return null
      }
    }
  */

  return children;
}
