import {
  chakra,
  AspectRatio,
  Button,
  Container,
  Flex,
  Grid,
  GridItem,
  Heading,
  Icon,
  Image,
  Link,
  Text,
} from "@chakra-ui/react"
import { MdOutlineChevronRight } from "react-icons/md"
import NextLink from "next/link"

export default function MainPageHeader() {
  const mainImageUrl = "allon4plus-patient-side-hero.png"
  return (
    <Grid w={"full"} position={"relative"} bgColor={"#0F1E64"}>
      <AspectRatio
        ratio={40 / 6}
        position={"relative"}
        display={"block"}
        height={"400px"}
      >
        {mainImageUrl && <Image opacity={0.5} src={mainImageUrl} />}
      </AspectRatio>
      <Flex
        h={"100%"}
        w={"full"}
        alignItems={"center"}
        position={"absolute"}
        top={0}
        left={0}
      >
        <Container size={"main"}>
          <Grid
            templateColumns={{
              base: "repeat(1, 1fr)",
              lg: "repeat(2, 1fr)",
            }}
            py={12}
          >
            <GridItem colSpan={1} py={12}>
              <Flex
                justifyContent={"center"}
                flexDirection={"column"}
                textAlign={{ base: "center", lg: "start" }}
              >
                <Heading
                  color={"primary"}
                  textTransform={"uppercase"}
                  fontSize={"2rem"}
                >
                  Welcome to{" "}
                  <chakra.span whiteSpace={"nowrap"}>
                    All-On-4 Plus<sup>&#174;</sup>
                  </chakra.span>{" "}
                  <chakra.span whiteSpace={"nowrap"}>
                    Patient Portal
                  </chakra.span>
                </Heading>
                <Text color={"white"} my={4} fontSize={"lg"}>
                  Here you will find access to a range of relevant information
                  and online forms to save time and improve your experience.
                </Text>
                <Link href={"/signin"} as={NextLink}>
                  <Button
                    borderRadius={"25px"}
                    bgColor={"white"}
                    p={"0px 20px"}
                  >
                    <Icon
                      fontSize="24px"
                      as={MdOutlineChevronRight}
                      color="darkBlue"
                    />
                    <Text>Login to your account</Text>
                  </Button>
                </Link>
              </Flex>
            </GridItem>
          </Grid>
        </Container>
      </Flex>
    </Grid>
  )
}
