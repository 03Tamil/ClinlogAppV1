import {
  Box,
  Button,
  Flex,
  Heading,
  Container,
  Text,
  Image,
  Grid,
  GridItem,
  chakra,
  CardBody,
  Card,
  CardHeader,
  CardFooter,
  Circle,
  Spacer,
  Skeleton,
  Divider,
  Link,
} from "@chakra-ui/react";
import useQueryHook, { publicApiHook } from "hooks/useQueryHook";
import animationData from "../../animationsv2/loader.json";
import { gql } from "graphql-request";

import FullscreenLoadingSpinner from "componentsv2/FullscreenLoadingSpinner";
import { V2Link as NextLink } from "componentsv2/Dashboard/Helpers/routerHelpers";
import { useSession } from "next-auth/react";

import SignInForm from "componentsv2/Signin/SigninForm";
import { useV2Router } from "componentsv2/Dashboard/Helpers/routerHelpers";
import { InferGetStaticPropsType } from "next";
import { GraphQLClient } from "graphql-request";
import https from "https";
import SignInFormV2 from "componentsv2/Signin/SigninFormV2";

import Lottie from "lottie-react";

import { dehydrate, QueryClient } from "@tanstack/react-query";

export default function MainPage({
  encryptedId,
  slug,
  recordId,
  messageIdParam,
  propParam,
}) {
  const { status, data: session } = useSession({
    required: false,
  });
  const router = useV2Router();

  if (!!session) {
    if (
      !session?.groups.includes("Admin") &&
      !session?.groups.includes("Patient")
    ) {
      router.push("/pagesv2/dashboard");
    }
  }

  const mainPageViewerQuery = gql`
    query mainPageViewerQuery {
      viewer: viewer {
        ... on User {
          patientForms
          userLocation {
            ... on locations_locations_Entry {
              title
              locationShortName
              locationShortNameState
              locationPhoneNumber {
                number
              }
              locationOtherName
              locationOtherLogo {
                id
                url
              }
              locationAddressSimple
            }
          }
          patientFormsServed {
            ... on patientFormsServed_clinicBlock_BlockType {
              id
              patientRecord {
                ... on records_records_Entry {
                  id
                  recordClinic {
                    id
                  }
                  recordEnquiryType
                }
              }
            }
          }
        }
      }
    }
  `;

  const mainPageViewerEnabled = !!session?.accessToken;
  const mainPageViewerResult = useQueryHook(
    ["mainPageViewerQuery", !!session],
    mainPageViewerQuery,
    {},
    {
      enabled: mainPageViewerEnabled,
      refetchOnWindowFocus: true,
      staleTime: 0,
    },
  );
  if (
    session === undefined ||
    (mainPageViewerEnabled && mainPageViewerResult.isLoading)
  ) {
    return <FullscreenLoadingSpinner />;
  }
  return (
    <Flex flexDirection={"column"} gap={"1rem"}>
      {!session ? (
        <Grid
          templateColumns={"repeat(12, 1fr)"}
          columnGap={{ base: "1rem", lg: "1rem", xl: "3rem" }}
          rowGap={{ base: "1rem", lg: "1rem", xl: "2rem" }}
        >
          <GridItem
            colSpan={{ base: 12, md: 6 }}
            w="100%"
            h={{ base: "auto", md: "100%" }}
          >
            <Flex
              flexDirection={"column"}
              px={{ base: "0", md: "6", lg: "12" }}
              py={{ base: "0", md: "8" }}
              bgColor={{ base: "white", md: "scBlue" }}
              w="100%"
              h={{ base: "auto", md: "100%" }}
              gap="1rem"
            >
              <Flex
                bgColor={"scBlue"}
                w="100%"
                align="center"
                justify={{ base: "center", md: "flex-start" }}
                h="auto"
                py="4"
                ml={{ base: "0", md: "6" }}
              >
                <Image
                  src={"/smileconnect-white.png"}
                  alt={"SmileConnect Logo"}
                  maxW="310px"
                />
              </Flex>
              <Flex
                flexDirection={"column"}
                px={{ base: "10", md: "10", lg: "12" }}
                py={{ base: "6", md: "8" }}
                bgColor={{ base: "white", md: "scBlue" }}
                w="100%"
                h={{ base: "auto", md: "100%" }}
              >
                <Spacer display={{ base: "none", md: "flex" }} />
                <Flex
                  flexDirection={"column"}
                  gap={{ base: "1rem", md: "6rem" }}
                  color={{ base: "scBlack", md: "white" }}
                  textAlign="left"
                  w={{ base: "100%", xl: "75%", "2xl": "50%" }}
                >
                  <Text
                    fontSize={{
                      base: "26px",
                      sm: "30px",
                      md: "34px",
                      lg: "40px",
                    }}
                    fontWeight={"700"}
                  >
                    <Box as="span" color={{ base: "#007AFF", md: "#65CCFF" }}>
                      Login{" "}
                    </Box>
                    to your SmileConnect® account
                  </Text>
                  <Text
                    fontSize={{ base: "12px", md: "16px" }}
                    fontWeight={"500"}
                    color={{ base: "#979595", md: "white" }}
                  >
                    This Patient Management Portal Is By Invitation Only. Please
                    Contact Your Clinician To Receive An Invitation.
                  </Text>
                </Flex>
                <Spacer display={{ base: "none", md: "flex" }} />
                <Spacer display={{ base: "none", md: "flex" }} />
                <Text
                  color="white"
                  display={{ base: "none", md: "block" }}
                  textAlign="left"
                  fontSize={"13px"}
                  fontWeight={"500"}
                >
                  SmileConnect® All Rights Reserved
                </Text>
              </Flex>
            </Flex>
          </GridItem>
          <GridItem colSpan={{ base: 12, md: 6 }}>
            <SignInFormV2 styling={"homePage"} />
          </GridItem>
        </Grid>
      ) : null}
    </Flex>
  );
}

export async function getServerSideProps({ query, params }) {
  const queryClient = new QueryClient();
  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      encryptedId: query?.encryptedId || "",
      slug: query?.slug || "",
      recordId: query?.recordId || "",
      messageIdParam: query?.messageId || "",
      propParam: query?.prop || "",
    },
  };
}

MainPage.auth = {
  role: "Patient",
  public: true,
};
