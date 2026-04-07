import { Button, Card, CardBody, Center, Heading, Text } from "@chakra-ui/react";
import Link from "next/link";

export default function ForbiddenPage() {
  return (
    <Center
      width={"100%"}
      bgGradient="linear-gradient(135deg, #0F172A 0%, #1E3A8A 45%, #0EA5E9 100%)"
      minHeight={"100vh"}
      padding={"24px"}
    >
      <Card
        p={{ base: "4rem", lg: "4rem" }}
        textAlign="center"
        width={"800px"}
        maxWidth={"100%"}
      >
        <CardBody>
          <Heading
            as={"h1"}
            fontSize="42px"
            mt={3}
            mb={2}
            fontWeight={"bold"}
            color="xlDarkBlueLogo"
          >
            403 - Invalid Permissions
          </Heading>
          <Text fontSize="20px" color={"gray.500"} mb={6}>
            You do not have permission to view this page.
          </Text>
          <Link href="/pagesv2/patienttable">
            <Button
              bgGradient="linear-gradient(90deg, #1967FF 0%, #343CFF 100%)"
              color={"white"}
              variant={"solid"}
              textTransform={"uppercase"}
              _hover={{
                opacity: 0.92,
              }}
            >
              Go To Patients Page
            </Button>
          </Link>
        </CardBody>
      </Card>
    </Center>
  );
}

ForbiddenPage.auth = {
  public: true,
};
