import { Button, Container, Flex, Heading, Link, Text } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import NextLink from "next/link";

export default function ThankYouPage() {
  const { status, data: session } = useSession({
    required: false,
  })

  return (
    <Flex
      height="70vh"
      width="100vw"
      justify="center"
      align="center"
      direction="column"
      textAlign="center"
      py={10}
      px={6}
      background={`lgDarkBlueLogo`}
    >
      <Container>
        <Heading 
          as={"h1"}
          size={"4xl"}
          color={"white"}
        >
          Thank You
        </Heading>
        <Text 
          fontSize={"2rem"} 
          mt={3} 
          mb={2} 
          color="white"
        >
          We will return you email as soon as possible alternatively you can contact us on {` `}
          <Link 
            className={"link"}
            whiteSpace={"nowrap"}
            href={`tel:1300 255 664`}
          >
            1300 255 664
          </Link>
        </Text>
        <Link href={"/"} as={NextLink}>
          <Button
            bgColor={"xlDarkBlueLogo"}
            color={"white"}
            variant={"solid"}
            textTransform={"uppercase"}
            size={"lg"}
            rounded={"none"}
          >
            Back to Main Page
          </Button>
        </Link>
      </Container>
    </Flex>
  )
}

ThankYouPage.auth = {
  public: true,
}
