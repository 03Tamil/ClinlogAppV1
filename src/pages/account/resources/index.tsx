//@ts-nocheck
import { AccountWrapper } from "componentsv2/Account/AccountWrapper";
import { gql } from "graphql-request";
import useQueryHook from "hooks/useQueryHook";
import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Grid,
  GridItem,
  Heading,
  Link,
  Skeleton,
  Spinner,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import _ from "lodash";
import NextLink from "next/link";
import React from "react";

export default function Resources() {
  const title = "Resources";
  const slug = "resources";

  const resourcesQuery = gql`
    query resourcesQuery {
      resources: entries(
        section: "adminForms"
        orderBy: "formModificationDate desc"
      ) {
        id
        title
        slug
        ... on adminForms_adminForms_Entry {
          formDescription
          formModificationDate @formatDateTime(format: "F jS Y")
          resourcesLink
          resourcesBrand
          formDownloadLink {
            ... on documents_Asset {
              id
              filename
              url
            }
          }
          resourcesCategory {
            ... on resources_Category {
              id
              title
              slug
            }
          }
        }
      }
    }
  `;
  const resourcesResult = useQueryHook(["resourcesQuery"], resourcesQuery);

  const resources = resourcesResult?.data?.resources;
  const groupedResources = resources
    ? _.groupBy(
        resources,
        (resource) =>
          resource?.resourcesCategory[0]?.title ?? "Other Resources",
      )
    : {};
  const headerText =
    "Access important documents that govern group operations (policies, protocols, branding, billing guides, and compliance references) in one place.";

  const thCSSStyle = {
    px: { base: "3", md: "4" },
    color: "scBlack",
    borderBottom: "1px",
    borderColor: "#D9D9D9",
    fontSize: {
      base: "9px",
      md: "11px",
      lg: "12px",
    },
  };
  return (
    <AccountWrapper
      title={title}
      headerText={headerText}
      breadcrumbs={[{ title: `${title}`, url: `account/${slug}` }]}
      slug={slug}
    >
      <Flex w="100%" flexDirection={"column"} minHeight={"80vh"}>
        {!groupedResources ? (
          <Text>Error: No resources</Text>
        ) : (
          <Skeleton
            isLoaded={!resourcesResult.isLoading}
            height={"100%"}
            mb="4"
          >
            {Object.entries(groupedResources).map(([key, resources]) => {
              if (!resources) {
                return null;
              }
              return (
                <React.Fragment key={key}>
                  <Heading
                    textTransform={"uppercase"}
                    color={"scBlack"}
                    fontSize={{ base: "14px", md: "16px" }}
                    mb={"1rem"}
                    mt="4"
                  >
                    {key}
                  </Heading>
                  <Table>
                    <Thead bgColor={"#F5F5F5"}>
                      <Tr borderTop="1px" borderColor="#D9D9D9" w="100%">
                        <Th borderRight="1px" sx={thCSSStyle} w="2%">
                          <Text>#</Text>
                        </Th>
                        <Th
                          borderRight="1px"
                          sx={thCSSStyle}
                          w={{ base: "50%", md: "40%" }}
                        >
                          <Text>Form Name</Text>
                        </Th>
                        <Th borderRight="1px" sx={thCSSStyle} w="33%">
                          <Text>Description</Text>
                        </Th>
                        <Th
                          borderRight="1px"
                          sx={thCSSStyle}
                          display={{ base: "none", md: "table-cell" }}
                          w={{ base: "0%", md: "10%" }}
                        >
                          <Text>Date</Text>
                        </Th>
                        <Th sx={thCSSStyle} w="15%">
                          <Text>Download Link</Text>
                        </Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {resources.map((resource, j) => {
                        return (
                          <Tr
                            key={j}
                            fontSize={{
                              base: "12px",
                              md: "12px",
                              lg: "13px",
                            }}
                            w="100%"
                          >
                            <Td py="2" px={{ base: "2", md: "4" }} w={"2%"}>
                              <Text>{j + 1}</Text>
                            </Td>
                            <Td
                              py="2"
                              w={{ base: "50%", md: "40%" }}
                              px={{ base: "2", md: "4" }}
                            >
                              <Text fontWeight={"600"}>{resource.title}</Text>
                            </Td>
                            <Td py="2" w="33%" px={{ base: "2", md: "4" }}>
                              <Text>{resource.formDescription}</Text>
                            </Td>
                            <Td
                              py="2"
                              display={{ base: "none", md: "table-cell" }}
                              w={{ base: "0%", md: "10%" }}
                              px={{ base: "2", md: "4" }}
                            >
                              <Text whiteSpace={"nowrap"}>
                                {resource.formModificationDate}
                              </Text>
                            </Td>
                            <Td py="2" w="15%" px={{ base: "2", md: "4" }}>
                              {(resource?.formDownloadLink[0]?.url ? (
                                <Link
                                  href={
                                    resource?.formDownloadLink[0]?.url ?? "#"
                                  }
                                  as={NextLink}
                                  isExternal={true}
                                >
                                  <Button
                                    bgColor={"scBlack"}
                                    borderRadius={"0px"}
                                    color={"white"}
                                    textTransform={"uppercase"}
                                    size={{ base: "xs", md: "sm" }}
                                  >
                                    <Text
                                      fontSize={{ base: "9px", md: "12px" }}
                                    >
                                      View / Download
                                    </Text>
                                  </Button>
                                </Link>
                              ) : null) ??
                                (resource.resourcesLink ? (
                                  <Link
                                    href={resource?.resourcesLink ?? "#"}
                                    as={NextLink}
                                    isExternal={true}
                                  >
                                    <Button
                                      bgColor={"scBlack"}
                                      borderRadius={"0px"}
                                      color={"white"}
                                      textTransform={"uppercase"}
                                      size={{ base: "xs", md: "sm" }}
                                    >
                                      <Text
                                        fontSize={{ base: "9px", md: "12px" }}
                                      >
                                        View / Download
                                      </Text>
                                    </Button>
                                  </Link>
                                ) : null) ?? (
                                  <Text color={"grey"} textAlign={"left"}>
                                    Error: No file
                                  </Text>
                                )}
                            </Td>
                          </Tr>
                        );
                      })}
                    </Tbody>
                  </Table>
                </React.Fragment>
              );
            })}
          </Skeleton>
        )}
      </Flex>
    </AccountWrapper>
  );
}

Resources.auth = {
  role: "Staff",
};
