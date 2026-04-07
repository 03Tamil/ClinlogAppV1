import {
  Box,
  Button,
  chakra,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Img,
  Input,
  Link,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react"
import { signIn, useSession } from "next-auth/react"
import router, { useRouter } from "next/router"
import { useForm } from "react-hook-form"
import { useEffect, useState } from "react"
import NextLink from "next/link"
import { useQueryClient } from "@tanstack/react-query"
import FullscreenLoadingSpinner from "components/FullscreenLoadingSpinner"
import SignInForm from "components/Signin/SigninForm"


export default function Signin() {
  const { data: session } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (session) {
      const redirectPath = typeof router.query.redirect === 'string' ? router.query.redirect : '/'

      // Don't redirect to signout page
      if(redirectPath === '/signout') {
        router.push('/')
      }
      else {
        router.push(redirectPath)
      }
    }
  }, [session])

  return (
    <Flex
      direction={"column"}
      width={"100%"}
      align={"center"}
      justify={"flex-start"}
      bgColor={"lgDarkBlueLogo"}
    >
      <Container size={"small"} py={"2rem"}>
        <Flex
          w={"100%"}
          padding={"24px"}
          bgColor={"white"}
          borderRadius={"6px"}
          my={{ base: "2rem", lg: "5rem" }}
        >
          <SignInForm styling={"signinPage"}/>
        </Flex>
      </Container>
    </Flex>
  )
}

Signin.auth = {
  public: true,
}
