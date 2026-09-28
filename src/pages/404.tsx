import { Box, Heading, Text, Button, Flex, Container, Center, CardBody, Card } from "@chakra-ui/react"
import { isPatient, isStaff } from "helpersv2/Permissions"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { useV2Router } from "componentsv2/Dashboard/Helpers/routerHelpers"
import { useEffect } from "react"
import type { GetStaticProps } from 'next';

type Props = Record<string, never>;
export const getStaticProps: GetStaticProps<Props> = () => {
  return { props: {} }
}

export default function NotFound() {
  const router = useV2Router()
  
  const { query: { error }, asPath } = router
  const { data: session } = useSession()
  const userIsStaff = session && isStaff(session?.groups)
  const userIsPatient = session && isPatient(session?.groups)

  const errorCodes = {
    "403": {
      title: "Invalid Permissions",
      message: "You do not have permission to view this page",
    },
    "404": {
      title: "Page Not Found",
      message: "The page you're looking for does not seem to exist",
    },
    "500": {
      title: "Unable to connect",
      message: "Something unexpected happened. Please try again later.",
    },
  }
  const firstSegment = asPath?.split("/")?.[1] || "404"
  const isErrorCode = Object.keys(errorCodes).includes(firstSegment)
  const errorNumber = isErrorCode ? firstSegment : "404"
  const errorTitle = isErrorCode ? errorCodes[firstSegment]?.title : "Page Not Found"
  const errorMessage = (
    error ? 
    error : isErrorCode ? 
    errorCodes[firstSegment]?.message : "The page you're looking for does not seem to exist"
  )

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
          <Heading as={"h1"} fontSize="42px" mt={3} mb={2} fontWeight={"bold"} color="xlDarkBlueLogo">
            {errorNumber != "500" ? `${errorNumber} - ` : `` }{errorTitle}
          </Heading>
          <Text fontSize="20px" color={"gray.500"} mb={6}>
            {errorMessage}
          </Text>
          <Link href={userIsStaff && !userIsPatient ? `/dashboard` : `/`}>
            <Button
              bgColor={"xlDarkBlueLogo"}
              color={"white"}
              variant={"solid"}
              textTransform={"uppercase"}
            >
              {`Go to Main Page`}
            </Button>
          </Link>
        </CardBody>
      </Card>
    </Center>
  )
}

NotFound.auth = {
  public: true,
}
