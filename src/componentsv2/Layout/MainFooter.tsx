import {
  chakra,
  Flex,
  Text,
  Container,
  Box,
  Image,
  Link,
  Spacer,
  Divider,
} from "@chakra-ui/react";
import { V2Link as NextLink } from "componentsv2/Dashboard/Helpers/routerHelpers";

export default function MainFooter() {
  return (
    <Box
      width={"100%"}
      //bgColor={"darkBlueLogo"}
      //py={"0.5rem"}
      //boxShadow={"0 50vh 0 50vh #293991"}
      bottom={"0"}
      h="4vh"
      m="0"
      bg={"white"}
    >
      <Divider />
      {/* <Container size={"main"}> */}
      <Flex
        //flexDirection={{ base: "column", lg: "row" }}
        //justifyContent={"space-between"}
        //alignItems={"center"}
        gap={"0.5rem"}
        p="2"
        w="100%"
        h="100%"
        align={"center"}
      >
        <Link
          href="/pagesv2/"
          as={NextLink}
          transition={"0.2s ease-in-out"}
          _hover={{
            transform: "scale(1.1)",
            opacity: "0.7",
          }}
          textAlign={"left"}
        >
          <Image src={"/loop-02.svg"} height={"20px"} />
        </Link>

        <Flex
          //flexDirection={{ base: "column", lg: "row" }}
          justifyContent={{ base: "center" }}
          alignItems={{ base: "center", lg: "center" }}
          //flexWrap={{ base: "wrap", lg: "wrap" }}
          fontSize={{ base: "10px", md: "12px" }}
          color="scGrey"
          display={{ base: "none", md: "flex" }}
          gap={{ base: "0.5rem", md: "1rem" }}
        >
          <Link
            //className={"link"}
            as={NextLink}
            href={"/pagesv2/terms"}
          >
            Terms &amp; Conditions
          </Link>
          <Text color={"white"}>|</Text>
          <Link
            //className={"link"}
            as={NextLink}
            href={"/pagesv2/privacy"}
            //textTransform={"uppercase"}
          >
            Privacy Policy
          </Link>
          <Text color={"white"}>|</Text>
          <Link
            //className={"link"}
            as={NextLink}
            href={"/pagesv2/sensitive-information"}
            //textTransform={"uppercase"}
          >
            Sensitive Information Policy
          </Link>
        </Flex>
        <Spacer />
        <Flex justifyContent="flex-end" align="center" mr="2">
          <Text color={"scGrey"} fontSize={{ base: "10px", md: "12px" }}>
            <chakra.span whiteSpace={"nowrap"}>
              {/* &copy;{new Date().getFullYear()} */}
              SmileConnect®
            </chakra.span>
            {""}
            <chakra.span whiteSpace={"nowrap"}>
              {" "}
              All Rights Reserved
            </chakra.span>
          </Text>
        </Flex>
      </Flex>
      {/* </Container> */}
    </Box>
  );
}
