import { Flex, Container, Heading, Spinner, useToast, chakra } from "@chakra-ui/react";
import { gql, GraphQLClient } from "graphql-request";
import router from "next/router";
import { useEffect, useRef } from "react";

export async function getServerSideProps({ query }) {
  const { code, id } = query;

  if (!code || !id) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: {
      code,
      id,
    },
  };
}

type VerifyEmailProps = {
  code: string
  id: string
}

export default function VerifyNewEmail({ code, id }: VerifyEmailProps) {
  if(!code || !id) return null

  const toast = useToast()
  const toastIdRef = useRef<any>()
  const verifyEmailMutation = gql`
    mutation verifyEmail($code: String!, $id: String!) {
      userVerifyNewEmail(code: $code, id: $id)
    }
  `
  const useVerifyEmailMutation = async () => {
    toastIdRef.current = toast({
      render: () => (
        <Flex
          justify="space-around"
          color="white"
          p={3}
          bg="blue.500"
          borderRadius="6px"
        >
          <chakra.span>Verifying new email...</chakra.span>
          <Spinner color="white" />
        </Flex>
      ),
      duration: 9000,
      isClosable: true,
    })
    const graphQLClient = new GraphQLClient(process.env.NEXT_PUBLIC_ENDPOINT, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    
    try {
      const data = await graphQLClient.request(verifyEmailMutation, {
        code,
        id,
      })
      toast.update(toastIdRef.current, {
        title: "Success - Email has been updated",
        status: "success",
        duration: 10000,
        isClosable: true,
      })
      setTimeout(() => {
        router.push('/signin')
      }, 2000)
    } catch (error) {
      toast.update(toastIdRef.current, {
        title: "Error",
        description: "Error - something went wrong",
        status: "error",
        duration: 9000,
        isClosable: true,
      })
    }
  }

  useEffect(() => {
    useVerifyEmailMutation()
  }, [code, id])

  return (
    <Flex
      direction={"column"}
      width={"100vw"}
      align={"center"}
      justify={"flex-start"}
      bgColor={"lgDarkBlueLogo"}
    >
      <Container size={"small"} py={"2rem"} minHeight={"75vh"}>
        <Flex
          w={"100%"}
          padding={"24px"}
          bgColor={"white"}
          borderRadius={"6px"}
          my={"5rem"}
        >
          <Flex
            flexDirection={"column"}
            mb={"1rem"} 
            gap={"1rem"} 
            w={"100%"}
          >
            <Flex align={"center"} justify={"space-between"} w={"100%"}>
              <Heading
                fontSize="24px"
                color="#448FFF"
                textTransform={"uppercase"}
              >
                Verifying new email...
              </Heading>
              <Spinner />
            </Flex>
          </Flex>
        </Flex>
      </Container>
    </Flex>
  )
}