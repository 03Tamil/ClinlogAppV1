import { Button, Flex, Heading } from "@chakra-ui/react"
import { gql, GraphQLClient } from "graphql-request"
import { useV2Router } from "componentsv2/Dashboard/Helpers/routerHelpers"
import React, { useEffect, useState } from "react"

export default function ActivatePage() {
  const router = useV2Router()
  const { code, id } = router.query
  const [status, setStatus] = useState<string>("idle")

  useEffect(() => {
    const handleActivation = async () => {
      const graphQLClient = new GraphQLClient(
        process.env.NEXT_PUBLIC_ENDPOINT,
        {
          headers: {
            Authorization: process.env.NEXT_PUBLIC_TOKEN,
          },
        }
      )
      const activateUserMutation = gql`
        mutation ActivateUser(
          $code: String!
          $id: String!
          $password: String!
        ) {
          activateUser(code: $code, id: $id)
          setPassword(code: $code, id: $id, password: $password)
        }
      `
      try {
        const data = await graphQLClient.request(activateUserMutation, {
          code,
          id,
          password: "testing123",
        })
        setStatus("success")
      } catch (err) {
        console.error(err)
      }
    }
    if (code && id) {
      handleActivation()
    }
  }, [code, id])
  if (status === "success") {
    return (
      <Flex>
        <Heading>Successfully Activated Account</Heading>
      </Flex>
    )
  }
  return <div></div>
}

ActivatePage.auth = {
  public: true,
}
