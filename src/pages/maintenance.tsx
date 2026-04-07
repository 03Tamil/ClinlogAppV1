import { Card, CardBody, Center, Heading } from "@chakra-ui/react"
import React from "react"

export default function Maintenance() {
  return (
    <Center
      width={"100%"}
      bgColor={"lgDarkBlueLogo"}
      minHeight={"70vh"}
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
            color="red.700"
            textTransform="uppercase"
          >
            SmileConnect is currently in maintenance
          </Heading>
        </CardBody>
      </Card>
    </Center>
  )
}

Maintenance.auth = {
  public: true,
}
