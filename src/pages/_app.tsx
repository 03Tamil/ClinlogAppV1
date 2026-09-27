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

  const derivedTitle = Object.entries(pageTitles)
    .sort(([a], [b]) => b.length - a.length)
    .find(([key, value]) => router.asPath.includes(key))?.[1];
  const finalTitle = derivedTitle ?? title;

  const pageTitle = finalTitle
    ? `${finalTitle} | Clinlog`
    : "Clinlog";

  const [needToSignTerms, setNeedToSignTerms] = useAtom(needToSignTermsAtom);
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
  //               // href={`/patientglobal?postId=${message?.id}&method=sms`}
  //               href={`/patientdata?postId=${message?.id}&method=sms`}
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
  //               href={`/patientglobal?postId=${message?.id}&method=voice`}
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
  //         //       // href={`/patientglobal?postId=${message?.id}&method=sms`}
  //         //       href={`/patienttable`}
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
  //               href={`/patienttable`}
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
            }
            if (isPermissionError) {
              router.push("/403");
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
          router.push("/setup-account/terms");
        }
      } else if (router.pathname === "/setup-account/terms") {
        router.push("/");
      }
    }
  }, [needToSignTerms, router.pathname]);
  const showMaintenanceBar = false;
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
            href="/clinlog_icon.svg"
            sizes="96x96"
          />
          <link
            rel="icon"
            type="image/svg+xml"
            href="/clinlog_icon.svg"
          />
          <link rel="shortcut icon" href="/clinlog_icon.svg" />
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/clinlog_icon.svg"
          />
          <link rel="manifest" href="/site.webmanifest" />
        </Head>
        {showMaintenanceBar && <MaintenanceBar />}
        <QueryClientProvider client={queryClient}>
          {/* @ts-ignore*/}
          {/* <Hydrate state={pageProps?.dehydratedState}> */}
          <Box pt={showMaintenanceBar ? "40px" : "0"}>
            <Layout>
              <Toaster position="top-right" richColors expand={true} />
              {!Component.auth?.public ? (
                <Auth component={Component}>
                  <Component {...pageProps} />
                </Auth>
              ) : (
                <Component {...pageProps} />
              )}
            </Layout>
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
      router.push("/");
    },
  });

  if (status === "loading") {
    return <FullscreenLoadingSpinner />;
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
