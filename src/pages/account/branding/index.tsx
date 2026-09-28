import { gql } from "graphql-request";
import { AccountWrapper } from "componentsv2/Account/AccountWrapper";
import {
  Box,
  chakra,
  Divider,
  Flex,
  Grid,
  GridItem,
  Image,
  Link,
  Heading,
  Text,
  Button,
  AspectRatio,
  List,
  ListItem,
} from "@chakra-ui/react";
import {
  MdCheckCircle,
  MdCheckCircleOutline,
  MdHighlightOff,
  MdOutlineFileDownload,
} from "react-icons/md";
import React from "react";
import NextLink from "next/link";

export default function Branding() {
  const title = "All On 4 Plus® Branding Guidelines";
  const slug = "branding";

  const correctUseTable = [
    {
      correct: "All On 4 Plus® or All-On-4-Plus®",
      incorrect: "All On 4 Plus™ or All-On-4 Plus®",
    },
    {
      correct: "Please contact an All On 4 Plus® provider",
      incorrect: "Contact All On 4 Plus®",
    },
    {
      correct: "Provide All On 4 Plus® treatment",
      incorrect: "All On 4 Plus® a patient",
    },
    { correct: "Two All On 4 Plus patients", incorrect: "Two All On 4 Plus's" },
    {
      correct: "Show me your All On 4 Plus® teeth",
      incorrect: "Show me your All On 4 Plus®",
    },
    { correct: "All On 4 Plus® Clinic", incorrect: "Clinic of All On 4 Plus®" },
    {
      correct: "Made by an All On 4 Plus® laboratory",
      incorrect: "Made by All On 4 Plus®",
    },
    {
      correct: "This is the newest All On 4 Plus invention",
      incorrect: "All On 4 Plus's newest invention",
    },
  ];

  return (
    <AccountWrapper
      title={title}
      headerText={
        "All On 4 Plus® (the Trademark) is a brand name not a product or service and should always be used as an adjective qualifying a generic noun that defines the product or service. As an adjective, the Trademark should not be used as plurals or in the possessive form."
      }
      breadcrumbs={[{ title: `${title}`, url: `account/${slug}` }]}
      slug={slug}
      p={"2rem"}
    >
      <Flex flexDirection={"column"} rowGap={"1rem"}>
        <Box>
          {/* <Text>
            All On 4 Plus® (the Trademark) is a brand name not a product or
            service and should always be used as an adjective qualifying a
            generic noun that defines the product or service. As an adjective,
            the Trademark should not be used as plurals or in the possessive
            form.
          </Text> */}
          <Grid
            templateColumns={{
              base: "repeat(12, 1fr)",
              lg: "repeat(12, 1fr)",
            }}
            mb={"1rem"}
          >
            <GridItem
              colSpan={{ base: 12 }}
              my={"0.5rem"}
              display={{ base: "grid", md: "none" }}
            >
              <Heading
                color={"scBlack"}
                textTransform={"uppercase"}
                fontSize={{ base: "14px", md: "16px" }}
              >
                Correct & Incorrect Usage
              </Heading>
            </GridItem>
            <GridItem
              colSpan={{ base: 6, lg: 6 }}
              my={"0.5rem"}
              display={{ base: "none", md: "grid" }}
            >
              <Heading
                color={"scBlack"}
                textTransform={"uppercase"}
                fontSize={{ base: "14px", md: "16px" }}
              >
                Correct
              </Heading>
            </GridItem>
            <GridItem
              colSpan={{ base: 6, lg: 6 }}
              my={"0.5rem"}
              display={{ base: "none", md: "grid" }}
            >
              <Heading
                color={"scBlack"}
                textTransform={"uppercase"}
                fontSize={{ base: "14px", md: "16px" }}
              >
                Incorrect
              </Heading>
            </GridItem>
            {correctUseTable.map((correctOrNot, i) => {
              return (
                <React.Fragment key={correctOrNot.correct}>
                  <GridItem colSpan={{ base: 12, md: 12 }} my={"0.4rem"}>
                    <Divider />
                  </GridItem>
                  <GridItem colSpan={{ base: 12, md: 6 }} my={"0.4rem"}>
                    <Flex alignItems={"center"} gap={"0.5rem"}>
                      <MdCheckCircle fontSize={"1.4rem"} color={"darkgreen"} />
                      <chakra.span fontSize={{ base: "13px", md: "14px" }}>
                        {" "}
                        {correctOrNot.correct}
                      </chakra.span>
                    </Flex>
                  </GridItem>
                  <GridItem colSpan={{ base: 12, md: 6 }} my={"0.4rem"}>
                    <Flex alignItems={"center"} gap={"0.5rem"}>
                      <MdHighlightOff fontSize={"1.4rem"} color={"darkred"} />
                      <chakra.span fontSize={{ base: "13px", md: "14px" }}>
                        {correctOrNot.incorrect}
                      </chakra.span>
                    </Flex>
                  </GridItem>
                </React.Fragment>
              );
            })}
          </Grid>
        </Box>
        <Box>
          <Heading
            color={"scBlack"}
            textTransform={"uppercase"}
            fontSize={{ base: "14px", md: "16px" }}
          >
            Treatment Logo
          </Heading>
          <Divider mt={"0.5rem"} borderColor="gray.500" />
          <Grid
            templateColumns={{
              base: "repeat(1, 1fr)",
              lg: "repeat(12, 1fr)",
            }}
            gap={"2rem"}
            my={"2rem"}
          >
            <GridItem colSpan={{ base: 1, lg: 6 }}>
              <Image src={"/allon4plus_light_logo.svg"} maxWidth={"100%"} />
            </GridItem>
            <GridItem colSpan={{ base: 1, lg: 6 }}>
              <Image src={"/allon4plus_dark_logo.svg"} maxWidth={"100%"} />
            </GridItem>
            <GridItem colSpan={{ base: 1, lg: 6 }}>
              <Image src={"/a04plus-light-outline-x2.svg"} maxWidth={"100%"} />
            </GridItem>
            <GridItem colSpan={{ base: 1, lg: 6 }}>
              <Image src={"/a04plus-dark-outline-x2.svg"} maxWidth={"100%"} />
            </GridItem>
            <GridItem colSpan={{ base: 1, lg: 12 }}>
              <Link href={"/allon4plus_logos.zip"} as={NextLink}>
                <Button
                  py={{ base: "1rem", lg: "3rem" }}
                  px={{ base: "1rem", lg: "2rem" }}
                  my={{ base: "1rem", lg: "1rem" }}
                  minWidth={"100%"}
                  borderRadius={"0rem"}
                  bgColor={"lightBlueLogo"}
                  _hover={{
                    color: "white",
                    bgColor: "scBlue",
                  }}
                >
                  <Flex
                    w={"100%"}
                    justifyContent={"space-between"}
                    fontSize={{ base: "1rem", lg: "1.5rem" }}
                  >
                    <Text textTransform={"uppercase"}>Treatment Logo Pack</Text>
                    <MdOutlineFileDownload />
                  </Flex>
                </Button>
              </Link>
            </GridItem>
          </Grid>
        </Box>
        <Box>
          <Heading
            color={"scBlack"}
            textTransform={"uppercase"}
            fontSize={{ base: "14px", md: "16px" }}
          >
            Premium Providers Logo
          </Heading>
          <Divider mt={"0.5rem"} borderColor="gray.500" />
          <Grid
            templateColumns={{
              base: "repeat(1, 1fr)",
              lg: "repeat(12, 1fr)",
            }}
            gap={"2rem"}
            my={"2rem"}
          >
            <GridItem colSpan={{ base: 1, lg: 12 }}>
              <Text>
                Becoming an Associate and certified All On 4 Plus® Premium
                Provider is only available for suitable principal clinicians who
                have appropriate facilities at an appropriate location. A
                suitable principal clinician would have a desire and means to
                focus on growing and improving their full arch implant practice
                through more advanced training, and an adequate investment in
                marketing and in their facilities.
              </Text>
            </GridItem>
            <GridItem colSpan={{ base: 1, lg: 6 }}>
              <Image src={"/allon4plus_premium_provider_light_logo.svg"} />
            </GridItem>
            <GridItem colSpan={{ base: 1, lg: 6 }}>
              <Image src={"/allon4plus_premium_provider_dark_logo.svg"} />
            </GridItem>
            <GridItem colSpan={{ base: 1, lg: 12 }}>
              <Link
                href={"/allon4plus_premium_provider_logo.zip"}
                as={NextLink}
              >
                <Button
                  py={{ base: "1rem", lg: "3rem" }}
                  px={{ base: "1rem", lg: "2rem" }}
                  my={{ base: "1rem", lg: "1rem" }}
                  minWidth={"100%"}
                  borderRadius={"0rem"}
                  bgColor={"lightBlueLogo"}
                  _hover={{
                    color: "white",
                    bgColor: "scBlue",
                  }}
                >
                  <Flex
                    w={"100%"}
                    justifyContent={"space-between"}
                    fontSize={{ base: "1rem", lg: "1.5rem" }}
                  >
                    <Text textTransform={"uppercase"}>
                      Premium Providers Logo Pack
                    </Text>
                    <MdOutlineFileDownload />
                  </Flex>
                </Button>
              </Link>
            </GridItem>
          </Grid>
        </Box>
        <Box>
          <Heading
            color={"scBlack"}
            textTransform={"uppercase"}
            fontSize={{ base: "14px", md: "16px" }}
          >
            Senior Associate Logo
          </Heading>
          <Divider mt={"0.5rem"} borderColor="gray.500" />
          <Grid
            templateColumns={{
              base: "repeat(1, 1fr)",
              lg: "repeat(12, 1fr)",
            }}
            gap={"2rem"}
            my={"2rem"}
          >
            <GridItem colSpan={{ base: 1, lg: 12 }}>
              <Text>
                Becoming an Associate and certified All On 4 Plus® Premium
                Provider is only available for suitable principal clinicians who
                have appropriate facilities at an appropriate location. A
                suitable principal clinician would have a desire and means to
                focus on growing and improving their full arch implant practice
                through more advanced training, and an adequate investment in
                marketing and in their facilities.
              </Text>
            </GridItem>
            <GridItem colSpan={{ base: 1, lg: 6 }}>
              <Image src={"/allon4plus_senior_associate_logo.svg"} />
            </GridItem>
            <GridItem colSpan={{ base: 1, lg: 6 }}>
              <Image src={"/uniform-associate.png"} />
            </GridItem>
          </Grid>
        </Box>
        <Box>
          <Heading
            color={"scBlack"}
            textTransform={"uppercase"}
            fontSize={{ base: "14px", md: "16px" }}
          >
            Uniform Examples
          </Heading>
          <Divider mt={"0.5rem"} borderColor="gray.500" />
          <Grid
            templateColumns={{
              base: "repeat(1, 1fr)",
              lg: "repeat(12, 1fr)",
            }}
            gap={"2rem"}
            justifyContent={"center"}
            my={"2rem"}
          >
            <GridItem colSpan={{ base: 1, lg: 6 }}>
              <Image src={"/uniform-example-1.png"} />
            </GridItem>
            <GridItem colSpan={{ base: 1, lg: 6 }}>
              <Image src={"/uniform-example-2.png"} />
            </GridItem>
            <GridItem colSpan={{ base: 1, lg: 6 }}>
              <Image src={"/uniform-example-3.png"} />
            </GridItem>
          </Grid>
        </Box>
        <Box>
          <Heading
            color={"scBlack"}
            textTransform={"uppercase"}
            fontSize={{ base: "14px", md: "16px" }}
          >
            Fonts
          </Heading>
          <Divider mt={"0.5rem"} borderColor="gray.500" />
          <Link
            href={"https://fonts.google.com/specimen/Inter"}
            as={NextLink}
            isExternal={true}
          >
            <Button
              py={{ base: "1rem", lg: "3rem" }}
              px={{ base: "1rem", lg: "2rem" }}
              my={{ base: "1rem", lg: "1rem" }}
              minWidth={"100%"}
              borderRadius={"0rem"}
              bgColor={"lightBlueLogo"}
              _hover={{
                color: "white",
                bgColor: "scBlue",
              }}
            >
              <Flex
                w={"100%"}
                justifyContent={"space-between"}
                fontSize={{ base: "1rem", lg: "1.5rem" }}
              >
                <Text textTransform={"uppercase"}>Inter</Text>
                <MdOutlineFileDownload />
              </Flex>
            </Button>
          </Link>
        </Box>
        <Box>
          <Heading
            color={"scBlack"}
            textTransform={"uppercase"}
            fontSize={{ base: "14px", md: "16px" }}
          >
            Colours
          </Heading>
          <Divider mt={"0.5rem"} borderColor="gray.500" />
          <Grid
            templateColumns={{
              base: "repeat(1, 1fr)",
              lg: "repeat(12, 1fr)",
            }}
            gap={"2rem"}
            my={"2rem"}
          >
            <GridItem colSpan={{ base: 1, lg: 4 }}>
              <AspectRatio maxW={"400px"} ratio={1} mb={"1rem"}>
                <Box w={"100%"} height={"100%"} bgColor={"darkBlueLogo"} />
              </AspectRatio>
              <List>
                <ListItem>RGB: 38/39/94</ListItem>
                <ListItem>HEX: #26275e</ListItem>
                <ListItem>CMYK: 100/96/29/25</ListItem>
              </List>
            </GridItem>
            <GridItem colSpan={{ base: 1, lg: 4 }}>
              <AspectRatio maxW={"400px"} ratio={1} mb={"1rem"}>
                <Box w={"100%"} height={"100%"} bgColor={"medBlueLogo"} />
              </AspectRatio>
              <List>
                <ListItem>RGB: 103/132/193</ListItem>
                <ListItem>HEX: #6784c1</ListItem>
                <ListItem>CMYK: 97/42/0/0</ListItem>
              </List>
            </GridItem>
            <GridItem colSpan={{ base: 1, lg: 4 }}>
              <AspectRatio maxW="400px" ratio={1} mb={"1rem"}>
                <Box w={"100%"} height={"100%"} bgColor={"lightBlueLogo"} />
              </AspectRatio>
              <List>
                <ListItem>RGB: 235/235/246</ListItem>
                <ListItem>HEX: #ebebf6</ListItem>
                <ListItem>CMYK: 6/5/0/0</ListItem>
              </List>
            </GridItem>
          </Grid>
        </Box>
        <Box>
          <Heading
            color={"scBlack"}
            textTransform={"uppercase"}
            fontSize={{ base: "14px", md: "16px" }}
          >
            Colours
          </Heading>
          <Divider mt={"0.5rem"} borderColor="gray.500" />
          <Grid
            templateColumns={{
              base: "repeat(1, 1fr)",
              lg: "repeat(12, 1fr)",
            }}
            gap={"2rem"}
            my={"2rem"}
          >
            <GridItem colSpan={{ base: 1, lg: 12 }}>
              <Image src={"/building_mockup_1.jpg"} />
            </GridItem>
          </Grid>
        </Box>
        <Box>
          <Divider mt={"0.5rem"} />
          <Grid
            templateColumns={{
              base: "repeat(1, 1fr)",
              lg: "repeat(12, 1fr)",
            }}
            gap={"2rem"}
            my={"2rem"}
          >
            <GridItem colSpan={{ base: 1, lg: 12 }}>
              <Text fontWeight={"bold"}>
                IMPORTANT: This document is an important component of the
                Operations Manual for All On 4 Plus® Associates (Premium
                Providers), Affiliates and licensees. Any questions in relations
                to the use of All On 4 Plus® trademark or intellectual property
                must be made in writing to{" "}
                <Link
                  href={"mailto:franchising@allon4plus.com"}
                  color={"primary"}
                  as={NextLink}
                  isExternal
                >
                  franchising@allon4plus.com.au
                </Link>
              </Text>
            </GridItem>
          </Grid>
        </Box>
      </Flex>
    </AccountWrapper>
  );
}

Branding.auth = {
  role: "Staff",
};
