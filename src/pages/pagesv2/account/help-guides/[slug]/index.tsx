// @ts-nocheck
import {
  Container,
  Box,
  chakra,
  Flex,
  Grid,
  GridItem,
  Heading,
  Divider,
  Text,
  Skeleton,
} from "@chakra-ui/react";
import AccountSidebar from "componentsv2/Account/AccountSidebar";
import { AccountWrapper } from "componentsv2/Account/AccountWrapper";
import FullscreenLoadingSpinner from "componentsv2/FullscreenLoadingSpinner";
import { PageMatrix } from "componentsv2/Matrices/PageMatrix";
import Breadcrumbs, { Breadcrumb } from "componentsv2/Styling/Breadcrumbs";
import { dehydrate, QueryClient } from "@tanstack/react-query";
import { gql } from "graphql-request";
import useQueryHook from "hooks/useQueryHook";
import { useV2Router } from "componentsv2/Dashboard/Helpers/routerHelpers";
import { MdHelp, MdHelpOutline } from "react-icons/md";
import { useEffect, useRef } from "react";

export async function getServerSideProps({ params }) {
  const queryClient = new QueryClient();

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      slug: params.slug,
    },
  };
}

export default function HelpGuidesCategory({ slug, topic }) {
  const dynamicRoute = useV2Router().asPath;

  const helpGuidesQuery = gql`
    query helpGuidesQuery {
      currentHelpGuideCategory:category(group: "helpGuides", slug: "${slug}") {
        id
        title
        slug
      }
      helpGuideCategories:categories(group: "helpGuides") {
        id
        title
        slug
      }
      helpGuidesEntries:entries(section: "helpGuides") {
        id
        slug
        title
        ... on helpGuides_helpGuides_Entry {
          helpGuideCategories {
            id 
            slug
            title
          }
        }
      }
    }
  `;
  const helpGuidesResult = useQueryHook(["helpGuides", slug], helpGuidesQuery);

  const categoryEntry = helpGuidesResult?.data?.currentHelpGuideCategory;
  const categoryId = categoryEntry?.id;

  const helpGuideEntriesQuery = gql`
    query helpGuideEntriesQuery {
      helpGuidesEntries:entries(section: "helpGuides", relatedTo: "${categoryId}") {
        id
        slug
        title
        ... on helpGuides_helpGuides_Entry {
          pageMatrix {
            ... on pageMatrix_largeHeading_BlockType {
              typeHandle
              heading
            }
            ... on pageMatrix_smallHeading_BlockType {
              typeHandle
              heading
            }
            ... on pageMatrix_richTextParagraph_BlockType {
              typeHandle
              paragraph
            }
            ... on pageMatrix_paragraphPrimaryBg_BlockType {
              typeHandle
              heading
              paragraph
            }
            ... on pageMatrix_largeImage_BlockType {
              typeHandle
              image {
                  id
                  url
              }
              caption
            }
            ... on pageMatrix_video_BlockType {
              typeHandle
              embedUrl
            }
            ... on pageMatrix_paragraph_BlockType {
              typeHandle
              paragraph
            }
          }
        }
      }
    }
  `;
  const helpGuideEntriesResult = useQueryHook(
    ["helpGuideEntries", categoryId],
    helpGuideEntriesQuery,
    { enabled: categoryId },
  );
  const helpGuidesEntries = helpGuideEntriesResult?.data?.helpGuidesEntries;

  const handleScroll = () => {
    const element = document.getElementById(topic);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };
  useEffect(() => {
    handleScroll();
  });

  if (helpGuidesResult.isLoading) {
    return <FullscreenLoadingSpinner />;
  }

  const sidebarMenu =
    helpGuidesResult?.data?.helpGuideCategories.reduce(
      (accumulator: any[], category: any) => {
        const categoryTitle = category.title;
        const allEntriesInCategory =
          helpGuidesResult?.data?.helpGuidesEntries.reduce(
            (accumulator, entry) => {
              const entriesInCategory = entry.helpGuideCategories.reduce(
                (accumulator, category) => {
                  accumulator.push(category.id);
                  return accumulator;
                },
                [],
              );
              if (!entriesInCategory.includes(category.id)) {
                return accumulator;
              }
              accumulator.push({
                title: entry.title,
                slug: entry.slug,
                url: `/account/help-guides/${category.slug}/${entry.slug}`,
              });
              return accumulator;
            },
            [],
          );
        const categoryGroup = {
          heading: categoryTitle,
          menuItems: allEntriesInCategory,
        };
        accumulator.push(categoryGroup);
        return accumulator;
      },
      [],
    ) ?? null;

  const categoryEntryTitle = `${categoryEntry.title}`;
  const categoryEntrySlug = `${categoryEntry.slug}`;

  const breadcrumbs = [
    // { title: `Account`, url: `/account` },
    { title: `Help Guides`, url: `/pagesv2/account/help-guides` },
    { title: `${categoryEntryTitle}` },
  ];

  return (
    <Box bgColor={"#F7F9FC"} h="100%">
      <Box bgColor={"#E2EFFC"}>
        <Container size={"main"}>
          <Breadcrumbs
            breadcrumbs={(
              [{ title: "Account", url: "/pagesv2/account" }] as Breadcrumb[]
            ).concat(breadcrumbs ?? [])}
            color={"scBlue"}
          />
        </Container>
      </Box>
      <Container size={"main"}>
        {/* <Container size={"lg"} py={"1rem"}> */}
        <Grid
          templateColumns={{
            base: "repeat(1, 1fr)",
            lg: "repeat(12, 1fr)",
          }}
          gap={"1rem"}
        >
          <GridItem colSpan={{ base: 1, lg: 3 }}>
            <AccountSidebar
              name={"Help Guides"}
              icon={MdHelp}
              slug={categoryEntry.slug}
              sidebar={sidebarMenu}
            />
          </GridItem>
          <GridItem colSpan={{ base: 1, lg: 9 }} px="4">
            <Flex flexDirection={"column"} gap="1rem" mb="8">
              <Text
                fontSize={{ base: "16px", md: "18px" }}
                fontWeight={700}
                color="scBlack"
                letterSpacing={"0.36px"}
                px="4"
                mt="8"
              >
                {categoryEntryTitle}
              </Text>
              <Text
                px="4"
                mb="4"
                fontSize={{ base: "13px", md: "14px" }}
                fontWeight="500"
              >
                A guided overview of how to use SmileConnect, covering logins,
                roles, navigation, and the essential first-week workflows for
                clinics, MAS, and labs.
              </Text>
              {/* <Box bgColor={"lgDarkBlueLogo"} padding={"1rem"}>
                  <Heading
                    color={"white"}
                    textTransform={"uppercase"}
                    size={"md"}
                    display={"flex"}
                    alignItems={"center"}
                  >
                    <chakra.span>{categoryEntryTitle}</chakra.span>
                  </Heading>
                </Box> */}
              <Box
                bgColor={"white"}
                boxShadow="0 4px 4px 0 rgba(0, 0, 0, 0.10)"
                borderRadius={"8px"}
                p="5"
                mb="4"
              >
                <Skeleton
                  height={"100%"}
                  isLoaded={helpGuidesEntries}
                  fadeDuration={1}
                >
                  {helpGuidesEntries ? (
                    <Grid
                      templateColumns={{
                        base: "repeat(1, 1fr)",
                        lg: "repeat(12, 1fr)",
                      }}
                      gap={{ base: "1rem", lg: "1rem" }}
                    >
                      {helpGuidesEntries.map((helpGuideEntry, i) => {
                        return (
                          <GridItem
                            id={`${helpGuideEntry.slug}`}
                            key={helpGuideEntry.id}
                            colSpan={{ base: 12, lg: 12 }}
                            mb={"1rem"}
                          >
                            <Heading
                              id={helpGuideEntry.slug}
                              fontSize={{ base: "12px", md: "14px" }}
                              textTransform={"uppercase"}
                              color={"scBlack"}
                              mb={"1rem"}
                            >
                              {helpGuideEntry.title}
                            </Heading>
                            {/* <Divider mt={"0.5rem"} mb={"1rem"} /> */}
                            <PageMatrix blocks={helpGuideEntry?.pageMatrix} />
                          </GridItem>
                        );
                      })}
                    </Grid>
                  ) : null}
                </Skeleton>
              </Box>
            </Flex>
          </GridItem>
        </Grid>
        {/* </Container> */}
      </Container>
    </Box>
  );
}

HelpGuidesCategory.auth = {
  role: "Staff",
};
