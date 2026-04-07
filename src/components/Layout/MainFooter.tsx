import {
  chakra,
  Flex,
  Text,
  Link,
  Container,
  Box,
  Image,
} from "@chakra-ui/react"
import NextLink from "next/link"

export default function MainFooter() {
  return (
    <Box
      width={"100%"}
      bgColor={"darkBlueLogo"}
      py={"1rem"}
      boxShadow={"0 50vh 0 50vh #293991"}
    >
      <Container size={"main"}>
        <Flex
          flexDirection={{ base: "column", lg: "row" }}
          justifyContent={"space-between"}
          alignItems={"center"}
          gap={"0.5rem"}
        >
          <Flex flexDirection={"column"} gap={"0.25rem"}>
            <Flex
              columnGap={"0.5rem"}
              rowGap={"0.5rem"}
              justifyContent={{ base: "center" }}
              alignItems={{ base: "center", lg: "center" }}
              flexWrap={{ base: "wrap", lg: "wrap" }}
              fontSize={"0.9rem"}
            >
              <Link
                className={"link"}
                as={NextLink}
                href={"/terms"}
                textTransform={"uppercase"}
              >
                Terms &amp; Conditions
              </Link>
              <Text color={"white"}>|</Text>
              <Link
                className={"link"}
                as={NextLink}
                href={"/privacy"}
                textTransform={"uppercase"}
              >
                Privacy Policy
              </Link>
              <Text color={"white"}>|</Text>
              <Link
                className={"link"}
                as={NextLink}
                href={"/sensitive-information"}
                textTransform={"uppercase"}
              >
                Sensitive Information Policy
              </Link>
            </Flex>
            <Text color={"white"} textAlign={{ base: "center", lg: "start" }}>
              <chakra.span whiteSpace={"nowrap"}>
                &copy;{new Date().getFullYear()} SmileConnect®
              </chakra.span>
              {""}
              <chakra.span whiteSpace={"nowrap"}>
                {" "}
                All rights reserved.
              </chakra.span>
            </Text>
          </Flex>
          <Link
            href="/"
            as={NextLink}
            transition={"0.2s ease-in-out"}
            _hover={{
              transform: "scale(1.1)",
              opacity: "0.7",
            }}
          >
            <Image src={"/smileconnect-white.svg"} height={"30px"} />
          </Link>
        </Flex>
      </Container>
    </Box>
  )
}
