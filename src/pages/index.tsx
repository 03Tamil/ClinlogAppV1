//@ts-nocheck
import { Flex, Text, Image, Grid, GridItem, Spacer } from "@chakra-ui/react";
import useQueryHook from "hooks/useQueryHook";
import { gql } from "graphql-request";

import FullscreenLoadingSpinner from "components/FullscreenLoadingSpinner";
import { useSession } from "next-auth/react";

import { useRouter } from "next/router";
import { InferGetStaticPropsType } from "next";
import { GraphQLClient } from "graphql-request";
import SignInFormV2 from "componentsv2/Signin/SigninFormV2";

export default function MainPage({
  mainPageArticlesResult,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const { status, data: session } = useSession({
    required: false,
  });
  const router = useRouter();

  // if (!!session) {
  //   if (
  //     !session?.groups.includes("Admin") &&
  //     !session?.groups.includes("Patient")
  //   )
  //     router.push("/dashboard");
  // }

  if (!!session) {
    if (session?.groups.includes("Clinlog User")) {
      router.push("/clinlog");
    } else {
      router.push("/"); // If user is logged in but doesn't have correct group, redirect to 403 page
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

  const mainPageViewerResult = useQueryHook(
    ["mainPageViewerQuery", !!session],
    mainPageViewerQuery,
    {},
    { enabled: !!session?.accessToken },
  );

  const recordIdQuery = gql`
    query patientMedicalWarningQuery($userId: [QueryArgument]) {
      entry(section: "records", recordPatient: $userId) {
        id
      }
    }
  `;

  const recordIdQueryResult = useQueryHook(
    ["recordId"],
    recordIdQuery,
    {},
    { enabled: !!session?.accessToken },
  );

  const entryId = recordIdQueryResult.data?.entry?.id;

  const contactPhoneNumber =
    mainPageViewerResult?.data?.viewer?.userLocation[0]?.locationPhoneNumber
      ?.number ?? "1300 255 664";

  const { locationOtherLogo, locationOtherName } =
    mainPageViewerResult?.data?.viewer?.userLocation[0] ?? {};
  const mainImageUrl = "blue-connect-background.jpg";

  // get recordEnquiryType
  const patientFormsServed =
    mainPageViewerResult?.data?.viewer?.patientFormsServed;
  const recordEnquiryTypes = patientFormsServed
    ?.map((patientFormServed) => {
      return patientFormServed?.patientRecord?.[0]?.recordEnquiryType;
    })
    .filter((recordEnquiryType) => !!recordEnquiryType);

  // TODO: Grab a single recordEnquiryType for now, but handle multiple in future
  const articleCategoriesSlugs = recordEnquiryTypes ?? null;
  const articleCategories = {
    allOn4: "all-on-4-plus",
    cosmeticDentistry: "cosmetic-dentistry",
    sleepDentistry: "sleep-dentistry",
    generalDentistry: "general-dentistry",
    facialAesthetics: "facial-aesthetics",
    individualDentalImplants: "individual-dental-implants",
  };
  // Get each of the category slugs that match the recordEnquiryType
  const categorySlugs =
    recordEnquiryTypes
      ?.map((recordEnquiryType) => {
        return articleCategories[recordEnquiryType];
      })
      .filter((categorySlug) => !!categorySlug) ?? [];
  // Above line - changed to empty array instead of null to prevent multiple calls to same api before and after login

  const mainPageArticlesQuery = gql`
    query mainPageArticlesQuery($categorySlugs: [String], $postDate: [String]) {
      articles: entries(
        section: "articles"
        limit: 4
        relatedToCategories: [
          { group: "articleCategories", slug: $categorySlugs }
        ]
        postDate: $postDate
      ) {
        ... on articles_articles_Entry {
          id
          title
          slug
          mainImage {
            filename
            url @transform(width: 1920)
          }
          summary
          articleCategories {
            id
            slug
            title
          }
        }
      }
    }
  `;

  // const mainPageArticlesResult = publicApiHook(
  //   ["mainPageQueryPublic", categorySlugs],
  //   mainPageArticlesQuery,
  //   { categorySlugs: categorySlugs, postDate: "> 2021-01-01" },
  //   { enabled: !session || mainPageViewerResult.isSuccess }
  // )

  if (!!session && mainPageViewerResult.isLoading) {
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
              bg={{
                base: "white",
                md: "linear-gradient(90deg, var(--clinlog-purple, #452A7E) 25%, #612ECC 100%)",
              }}
              w="100%"
              h={{ base: "auto", md: "100%" }}
              gap="1rem"
            >
              <Flex
                // bg={"linear-gradient(90deg, var(--clinlog-purple, #452A7E) 25%, #612ECC 100%)"}
                bg={{
                  base: "linear-gradient(90deg, var(--clinlog-purple, #452A7E) 25%, #612ECC 100%)",
                  md: "none",
                }}
                w="100%"
                align="center"
                justify={{ base: "center", md: "flex-start" }}
                h="auto"
                py="4"
                ml={{ base: "0", md: "6" }}
              >
                <Image
                  src="../../clinlog_icon.svg"
                  alt="CLINLOG"
                  width={"36px"}
                  height="39px"
                />

                <Text
                  fontSize={"50px"}
                  fontWeight="700"
                  color="#F1EFE0"
                  marginLeft={"12px"}
                  fontFamily="Avenir"
                  letterSpacing={"1.24px"}
                >
                  Clinlog
                </Text>
                <Text fontSize={"30px"} fontWeight="800" color="#F1EFE0" mb="3">
                  ®
                </Text>
              </Flex>
              <Flex
                flexDirection={"column"}
                px={{ base: "10", md: "10", lg: "12" }}
                py={{ base: "6", md: "8" }}
                // bg={{ base: "white", md: "linear-gradient(90deg, var(--clinlog-purple, #452A7E) 25%, #612ECC 100%)" }}
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
                    fontFamily="Avenir"
                  >
                    Login to your Clinlog® account
                  </Text>
                  <Text
                    fontSize={{ base: "12px", md: "16px" }}
                    fontWeight={"500"}
                    color={{ base: "#979595", md: "white" }}
                  >
                    Need a content to add here about this app.
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

export async function getStaticProps() {
  const mainPageArticlesQuery = gql`
    query mainPageArticlesQuery($categorySlugs: [String], $postDate: [String]) {
      articles: entries(
        section: "articles"
        limit: 4
        relatedToCategories: [
          { group: "articleCategories", slug: $categorySlugs }
        ]
        postDate: $postDate
      ) {
        ... on articles_articles_Entry {
          id
          title
          slug
          mainImage {
            filename
            url @transform(width: 1920)
          }
          summary
          articleCategories {
            id
            slug
            title
          }
        }
      }
    }
  `;
  process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";
  const graphQLClient = new GraphQLClient(process.env.NEXT_PUBLIC_ENDPOINT, {
    headers: {
      Authorization: process.env.NEXT_PUBLIC_TOKEN,
    },
    // fetchOptions: {
    //   agent: new https.Agent({
    //     rejectUnauthorized: false,
    //   }),
    // }
  });
  const variables = { categorySlugs: [], postDate: "> 2021-01-01" };
  const fullVariables = { ...variables };
  try {
    const mainPageArticlesResult = await graphQLClient.request(
      mainPageArticlesQuery,
      fullVariables,
    );
    return {
      props: {
        mainPageArticlesResult: mainPageArticlesResult,
      },
    };
  } catch (e) {
    console.log(e);
    return {
      props: {
        mainPageArticlesResult: null,
      },
    };
  }
}
MainPage.auth = {
  role: "Patient",
  public: true,
};
