import {
  Box,
  chakra,
  Container,
  Flex,
  Grid,
  GridItem,
  Heading,
  Text,
} from "@chakra-ui/react";
import AccountSidebar from "componentsv2/Account/AccountSidebar";
import Breadcrumbs, { Breadcrumb } from "componentsv2/Styling/Breadcrumbs";

type AccountWrapperType = {
  breadcrumbs: Breadcrumb[];
  title: string;
  slug: string;
  headerText?: string;
  children: any;
  [key: string]: any;
};

export function AccountWrapper({
  breadcrumbs,
  children,
  title,
  slug,
  headerText,
  ...rest
}: AccountWrapperType) {
  return (
    <Box 
      bgColor={"#F7F9FC"}
      minHeight={"92vh"}
    >
      <Box
        bgColor={"#E2EFFC"}
        display={
          [
            "resources",
            "support-ticket",
            "patient-terms",
            "staff-terms",
          ]?.includes(slug)
            ? "none"
            : { base: "none", lg: "block" }
        }
        w="100%"
      >
        <Flex w="100%" maxW="2000px" mx="auto" px="10px">
          {/* <Container size={"main"}> */}
          <Breadcrumbs
            breadcrumbs={(
              [{ title: "Account", url: "/pagesv2/account" }] as Breadcrumb[]
            ).concat(breadcrumbs ?? [])}
            color={"scBlue"}
          />
          {/* </Container> */}
        </Flex>
      </Box>
      <Flex w="100%" maxW="2000px" mx="auto" px="10px">
        {/* <Container size={"main"} py={"2rem"} overflow="scroll" h="100%" > */}
        <Grid
          w="100%"
          templateColumns={{
            base: "repeat(12, 1fr)",
            lg: "repeat(12, 1fr)",
          }}
          py={["resources", "support-ticket"]?.includes(slug) ? "2rem" : "0"}
          gap={"2rem"}
          //p="10"
        >
        <GridItem
          colSpan={{ base: 12, lg: 3, xl: 3 }}
          display={
            ["resources", "support-ticket"]?.includes(slug) ? "none" : "grid"
          }
          //minHeight={{ base: null, lg: "70vw" }}
        >
          <AccountSidebar slug={slug} />
        </GridItem>
        {["resources", "support-ticket"]?.includes(slug) ? (
          <>
            <GridItem colSpan={{ base: 12, lg: 1, xl: 1 }} px="4"></GridItem>
            <GridItem colSpan={{ base: 12, lg: 10, xl: 10 }} px="4">
              <Flex flexDirection={"column"}>
                {/* <Box bgColor={"lgDarkBlueLogo"} padding={"1rem"}> */}
                {/* <Heading
                color={"white"}
                textTransform={"uppercase"}
                size={"md"}
                display={"flex"}
                alignItems={"center"}
              >
                <chakra.span>{title}</chakra.span>
              </Heading> */}
                <Flex
                  w="100%"
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
                    {title}
                  </Text>
                  <Text
                    fontSize={{ base: "13px", md: "14px" }}
                    fontWeight="500"
                  >
                    {headerText}
                  </Text>
                </Flex>
                {/* </Box> */}
                <Box
                  bgColor={"white"}
                  boxShadow="0 4px 4px 0 rgba(0, 0, 0, 0.10)"
                  borderRadius={"8px"}
                  padding={"1rem"}
                  height={"100%"}
                  mb={"8"}
                  {...rest}
                >
                  {children}
                </Box>
              </Flex>
            </GridItem>
          </>
        ) : (
          <GridItem colSpan={{ base: 12, lg: 9, xl: 9 }} px="4">
            <Flex flexDirection={"column"}>
              {/* <Box bgColor={"lgDarkBlueLogo"} padding={"1rem"}> */}
              {/* <Heading
                color={"white"}
                textTransform={"uppercase"}
                size={"md"}
                display={"flex"}
                alignItems={"center"}
              >
                <chakra.span>{title}</chakra.span>
              </Heading> */}
              <Flex
                w="100%"
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
                  {title}
                </Text>
                <Text fontSize={{ base: "13px", md: "14px" }} fontWeight="500">
                  {headerText}
                </Text>
              </Flex>
              {/* </Box> */}
              <Box
                bgColor={"white"}
                boxShadow="0 4px 4px 0 rgba(0, 0, 0, 0.10)"
                borderRadius={"8px"}
                padding={"1rem"}
                height={"100%"}
                mb={"8"}
                {...rest}
              >
                {children}
              </Box>
            </Flex>
          </GridItem>
        )}
        </Grid>
        {/* </Container> */}
      </Flex>
    </Box>
  );
}
