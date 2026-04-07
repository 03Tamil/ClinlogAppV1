import {
  Button,
  Container,
  Input,
  Flex,
  FormLabel,
  FormControl,
  Box,
} from "@chakra-ui/react"
import { useQueryClient } from "@tanstack/react-query"
import { gql } from "graphql-request"
import useQueryHook from "hooks/useQueryHook"
import { signIn, useSession } from "next-auth/react"
import { useV2Router } from "componentsv2/Dashboard/Helpers/routerHelpers"
import React, { useState } from "react"

export default function hidden() {
  const { data: session } = useSession()
  const queryClient = useQueryClient()

  const router = useV2Router()
  if (!session.groups.includes("Admin")) {
    queryClient.removeQueries()
    queryClient.clear()
    router.push("/pagesv2/")
  }

  const [stater, setStater] = useState("")
  const altLogin = async () => {
    try {

      const res = await signIn("credentials", {
        redirect: false,
        email: Number(stater),
        kinda: "impersonate",
        groups: session.groups,
        accessToken: session.accessToken,
      })
    } catch (err) {
      console.log(err)
    }
  }

  if (!session.groups.includes("Admin")) {
    return <Box height={"100vh"} />
  }

  return (
    <Container>
      <Flex
        minHeight={"20vh"}
        alignItems={"center"}
        justifyContent={"center"}
        height="100%"
      >
        <Flex gap={"1rem"} flexDirection={"column"}>
          <FormControl>
            <FormLabel htmlFor="login-alt">User Id</FormLabel>
            <Input id="login-alt" onChange={(e) => setStater(e.target.value)} />
          </FormControl>
          <Button onClick={altLogin}>Login alt</Button>
        </Flex>
      </Flex>
    </Container>
  )
}

hidden.auth = {
  role: "Admin",
}
