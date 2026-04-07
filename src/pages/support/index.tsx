// @ts-nocheck
import { dehydrate, QueryClient } from "@tanstack/react-query";
import PageHeader from "componentsv2/Styling/PageHeader";
import {
  chakra,
  Box,
  Card,
  CardHeader,
  CardBody,
  Container,
  Grid,
  GridItem,
  Heading,
  Flex,
  StackDivider,
  VStack,
  List,
  ListItem,
  Circle,
  Image,
  Link,
  Text,
  Divider,
} from "@chakra-ui/react";
import { gql } from "graphql-request";
import useQueryHook from "hooks/useQueryHook";
import { useSession } from "next-auth/react";
import NextLink from "next/link";
import FullHeightLoadingSpinner from "components/FullHeightLoadingSpinner";
import PatientSupportForm from "components/Support/PatientSupportForm";
import { format } from "date-fns";
import { Divide } from "lucide-react";

export async function getServerSideProps() {
  const queryClient = new QueryClient();
  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}

export default function ContactPage() {
  const { status, data: session } = useSession({
    required: false,
  });

  const contactPageViewerQuery = gql`
    query contactPageViewerQuery {
      viewer: viewer {
        ... on User {
          id
          firstName
          lastName
          email
          userHomePhone
          userMobilePhone
          userLocation {
            ... on locations_locations_Entry {
              id
              slug
              title
              locationShortName
              locationShortNameState
              locationAddressSimple
              locationEmail
              locationGoogleBusiness
              locationIsSurgicalFacility
              locationOtherName
              locationPhoneNumber {
                countryCode
                description
                format
                formatForCountry
                number
                region
                regionCode
                type
              }
              locationOtherLogo {
                url
              }
              locationOpeningHours {
                openingTime
                closingTime
              }
            }
          }
        }
      }
    }
  `;

  const contactPageViewerResult = useQueryHook(
    ["contactPageViewerQuery"],
    contactPageViewerQuery,
    { enabled: !!session },
  );

  const viewerLocation =
    contactPageViewerResult?.data?.viewer?.userLocation[0] ?? null;

  const mainTitle = "All-On-4 Clinic";
  const mainContactNumber = "1300 255 664";
  const mainContactLocation = "1/265 Burwood Hwy Burwood East VIC 3151";

  const title = viewerLocation ? viewerLocation?.locationOtherName : mainTitle;
  const address = viewerLocation
    ? viewerLocation?.locationAddressSimple
    : mainContactLocation;
  const contactNumber = viewerLocation
    ? viewerLocation?.locationPhoneNumber?.number
    : mainContactNumber;
  const locationLogoUrl =
    viewerLocation?.locationOtherLogo?.[0]?.url ?? "/smileconnect-white.svg";

  const dayNames = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const daysOpeningHours =
    viewerLocation?.locationOpeningHours?.length === 7
      ? viewerLocation?.locationOpeningHours
      : null;

  const viewer = contactPageViewerResult?.data?.viewer ?? null;
  const defaultValues = viewer
    ? {
        firstName: viewer?.firstName ?? "",
        lastName: viewer?.lastName ?? "",
        email: viewer?.email ?? "",
        phone: viewer?.userMobilePhone ?? viewer?.userHomePhone ?? "",
        message: "",
      }
    : null;

  return (
    <Box bgColor={"#F7F9FC"} h="92vh" overflow="auto" w="100%">
      <PageHeader
        title={"Support"}
        //breadcrumbs={[{ title: "Support" }]}
        justBreadcrumbs={true}
      />
      {session === undefined ||
      (!!session && contactPageViewerResult.isLoading) ? (
        <FullHeightLoadingSpinner minHeight={"70vh"} />
      ) : (
        <Container size={"main"} py={{ base: "2rem", lg: "2rem" }}>
          <Grid
            templateColumns={{
              base: "repeat(1, 1fr)",
              lg: "repeat(12, 1fr)",
            }}
            gap={"1rem"}
          >
            {viewerLocation ? (
              <GridItem
                colSpan={{ base: 12, lg: 4 }}
                h="100%"
                py={{ base: "0", lg: "4" }}
                px="4"
              >
                <Card height={"100%"}>
                  <CardHeader>
                    <Flex justifyContent={"center"} alignItems={"center"}>
                      {locationLogoUrl ? (
                        <Circle
                          bgColor={"black"}
                          size={{ base: "100px", lg: "200px" }}
                          position={"relative"}
                          overflow={"hidden"}
                          display={"flex"}
                          alignItems={"center"}
                          justifyContent={"center"}
                        >
                          <Image
                            src={locationLogoUrl}
                            objectFit={"contain"}
                            width={"80%"}
                            height={"80%"}
                          />
                        </Circle>
                      ) : null}
                    </Flex>
                  </CardHeader>
                  <CardBody pb={{ base: "2rem", lg: "5rem" }}>
                    <Flex flexDirection={"column"} gap={"1rem"}>
                      <Box p={"0.5rem"}>
                        <Heading
                          fontSize={{ base: "14px", md: "16px" }}
                          textTransform={"uppercase"}
                          mb={"0rem"}
                        >
                          Main Contact
                        </Heading>
                        <Divider mt="2" borderColor={"gray.500"} />
                      </Box>

                      <List spacing={"0.3rem"} px={"0.5rem"}>
                        {contactNumber ? (
                          <ListItem>
                            <Link
                              href={`tel:${contactNumber}`}
                              fontWeight={"500"}
                              as={NextLink}
                              color={"scBlack !important"}
                              className={"link"}
                              fontSize={{ base: "13px", md: "14px" }}
                            >
                              <Flex
                                //justifyContent={"space-between"}
                                gap={"1rem"}
                              >
                                <chakra.span
                                  className={"material-symbols-outlined"}
                                  fontSize={{ base: "16px", md: "18px" }}
                                >
                                  call
                                </chakra.span>
                                <chakra.span>{contactNumber}</chakra.span>
                              </Flex>
                            </Link>
                          </ListItem>
                        ) : null}
                        <ListItem>
                          <chakra.span
                            fontSize={{ base: "13px", md: "14px" }}
                            fontWeight={"500"}
                          >
                            <Flex
                              //justifyContent={"space-between"}
                              gap={"1rem"}
                            >
                              <chakra.span
                                className={"material-symbols-outlined"}
                              >
                                location_on
                              </chakra.span>
                              <chakra.span textAlign={"right"}>
                                {address}
                              </chakra.span>
                            </Flex>
                          </chakra.span>
                        </ListItem>
                      </List>
                      <Box bgColor={"primary"} p={"0.5rem"}>
                        <Heading
                          fontSize={{ base: "14px", md: "16px" }}
                          color={"white"}
                          textTransform={"uppercase"}
                        >
                          Opening hours
                        </Heading>
                      </Box>
                      <VStack divider={<StackDivider />} px={"0.5rem"}>
                        {daysOpeningHours.map((day, i) => {
                          const dayName = dayNames[i];

                          const openingTime = day?.openingTime
                            ? format(new Date(day?.openingTime), "h:mm a")
                            : null;
                          const closingTime = day?.closingTime
                            ? format(new Date(day?.closingTime), "h:mm a")
                            : null;

                          return (
                            <Box key={dayName} width={"100%"}>
                              <Flex
                                justifyContent={"space-between"}
                                fontSize={{ base: "13px", md: "14px" }}
                              >
                                <chakra.span>{dayName}</chakra.span>
                                {!openingTime || !closingTime ? (
                                  <chakra.span>Closed</chakra.span>
                                ) : (
                                  <chakra.span>
                                    {openingTime} - {closingTime}
                                  </chakra.span>
                                )}
                              </Flex>
                            </Box>
                          );
                        })}
                      </VStack>
                    </Flex>
                  </CardBody>
                </Card>
              </GridItem>
            ) : (
              <GridItem colSpan={{ base: 2 }}></GridItem>
            )}
            <GridItem colSpan={{ base: 12, lg: 8 }} h="100%">
              <Flex
                w="100%"
                h="100%"
                flexDirection={"column"}
                mb="4"
                gap={"0.5rem"}
                px="4"
                py={{ base: "0", lg: "4" }}
              >
                <Text
                  //display={{ base: "none", lg: "block" }}
                  fontSize={{ base: "16px", md: "18px" }}
                  fontWeight={700}
                  color="scBlack"
                  letterSpacing={"0.36px"}
                >
                  Contact Support
                </Text>
                <Text
                  fontSize={{ base: "13px", md: "14px" }}
                  fontWeight="500"
                  mb="2"
                >
                  To contact SmileConnect Staff please fill out the form below
                  and one of our team members will be in touch shortly.
                </Text>
                <Card flexGrow={1} h="100%">
                  <CardBody>
                    <PatientSupportForm
                      session={session}
                      defaultValues={defaultValues}
                      clinic={viewerLocation}
                    />
                  </CardBody>
                </Card>
              </Flex>
            </GridItem>
          </Grid>
        </Container>
      )}
    </Box>
  );
}

ContactPage.auth = {
  public: true,
};
