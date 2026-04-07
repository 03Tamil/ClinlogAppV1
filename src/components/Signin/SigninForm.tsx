import {
  Box,
  Button,
  Card,
  CardBody,
  chakra,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Grid,
  GridItem,
  Heading,
  Image,
  Input,
  Link,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react"
import { useForm } from "react-hook-form"
import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { signIn, useSession } from "next-auth/react"
import NextLink from "next/link"
import { yupResolver } from "@hookform/resolvers/yup"
import { object, string } from "yup"
import { useQueryClient } from "@tanstack/react-query"
import React from "react"

type SigninFormProps = {
  styling: "homePage" | "signinPage"
}

export default function SignInForm({ styling, ...rest }: SigninFormProps) {
  const queryClient = useQueryClient()
  const validationSchema = object({
    username: string()
      .required("Email is required")
      .email("Email must be valid"),
    password: string().required("Password is required"),
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  })

  const [status, setStatus] = useState("idle")
  const [loginError, setLoginError] = useState(null)
  const router = useRouter()

  async function onSubmit({ username, password }) {
    setStatus("isLoading")
    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: username,
        password: password,
      })
      setStatus("success")

      if (res?.error?.includes("sent magic link to email")) {
        queryClient.removeQueries()
        queryClient.clear()

        // Get part of string from id onwards
        const uid = res.error.split("id=")[1]

        const redirect = typeof router.query.redirect === 'string' ? router.query.redirect : '/'
        router.push({
          pathname: "/auth/signin",
          query: { id: uid, redirect: redirect }
        })
      } else if (res.ok) {
        queryClient.removeQueries()
        queryClient.clear()

        const redirectPath = typeof router.query.redirect === 'string' ? router.query.redirect : '/'
        router.push(redirectPath)
      } else {
        throw new Error("Invalid Credentials")
      }
    } catch (err) {
      setStatus("error")
      setLoginError("The Details You Provided Are Incorrect. If you have forgotten your password please use Forgot Password.")
    }
  }

  const toast = useToast()
  useEffect(() => {
    if (status === "success") {
      toast({
        title: "Logged In",
        description: "Just a moment...",
        status: "success",
        duration: 5000,
        position: "top",
        isClosable: true,
      })
    } else if (status === "error") {
      toast({
        title: "Error",
        description: loginError,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      })
    }
  }, [status])

  if(styling === "homePage") {
    return (
      <Card p={{ base: "0.2rem", lg: "4rem" }}>
        <CardBody>
          <Flex flexDirection={"column"} gap={{ base: "1rem", lg: "1rem" }}>
            <Flex
              flexDirection={{ base: "column", lg: "row" }}
              justifyContent={"space-between"}
            >
              <Flex flexDirection={"column"} gap={"0.0rem"}>
                <Text
                  textTransform={"uppercase"}
                  color={"xlDarkBlueLogo"}
                  fontWeight={"bold"}
                  mb={"0"}
                >
                  To get started
                </Text>
                <Heading textTransform={"uppercase"}>
                  <chakra.span color={"primary"}>Please</chakra.span> Login
                </Heading>
              </Flex>
              <Flex
                justifyContent={"end"}
                alignItems={"end"}
                display={{ base: "none", lg: "flex" }}
              >
                <Link 
                  className={"link"} 
                  href={"/forgot-password"} 
                  as={NextLink}
                >
                  <chakra.span
                    textTransform={"uppercase"}
                    color={"primary"}
                    fontSize={"0.8rem"}
                  >
                    Forgot Password?
                  </chakra.span>
                </Link>
              </Flex>
            </Flex>
            <chakra.form 
              onSubmit={handleSubmit(onSubmit)}
              width={"100%"}
              noValidate={true}
            >
              <fieldset disabled={status === "isLoading"}>
                <Grid
                  templateColumns={{
                    base: "repeat(1, 1fr)",
                    lg: "repeat(11, 1fr)",
                  }}
                  rowGap={{ base: "1.0rem", lg: "1rem" }}
                  columnGap={{ base: "0rem", lg: "1.0rem" }}
                >
                  <GridItem colSpan={{ base: 12, lg: 5 }}>
                    <FormControl 
                      isInvalid={!!errors.username} 
                      isRequired={true}
                    >
                      <Flex justifyContent={"space-between"}>
                        <FormLabel
                          display={{ base: null, lg: "none" }}
                          mb={"0.2rem"}
                        >
                          Email:
                        </FormLabel>
                      </Flex>
                      <Input
                        type={"email"}
                        placeholder={"Enter Email"}
                        bgColor={"lightBlueLogo"}
                        autoComplete={"email"}
                        {...register("username", { required: true })}
                      />
                      {errors?.username?.message ? (
                        <FormErrorMessage fontSize={"0.8rem"} color={"red"}>
                          {`${errors.username.message}`}
                        </FormErrorMessage>
                      ) : null}
                    </FormControl>
                  </GridItem>
                  <GridItem colSpan={{ base: 12, lg: 5 }}>
                    <FormControl 
                      isInvalid={!!errors.password} 
                      isRequired={true}
                    >
                      <Flex
                        justifyContent={"space-between"}
                        alignItems={"center"}
                      >
                        <FormLabel
                          display={{ base: null, lg: "none" }}
                          mb={"0.2rem"}
                        >
                          Password:
                        </FormLabel>
                        <Link
                          color={"primary"}
                          className={"link"}
                          href={"/forgot-password"}
                          as={NextLink}
                          display={{ base: "flex", lg: "none" }}
                        >
                          <chakra.span
                            textTransform={"uppercase"}
                            color={"primary"}
                            fontSize={"0.8rem"}
                          >
                            Forgot Password?
                          </chakra.span>
                        </Link>
                      </Flex>
                      <Input
                        type={"password"}
                        placeholder={"Your Password"}
                        bgColor={"lightBlueLogo"}
                        autoComplete={"current-password"}
                        {...register("password", { required: true })}
                      />
                      {errors?.password?.message ? (
                        <FormErrorMessage fontSize={"0.8rem"} color={"red"}>
                          {`${errors.password.message}`}
                        </FormErrorMessage>
                      ) : null}
                    </FormControl>
                  </GridItem>
                  <GridItem colSpan={{ base: 12, lg: 1 }}>
                    <Flex justifyContent={"flex-end"}>
                      <Button
                        type={"submit"}
                        bgColor={"lgDarkBlueLogo"}
                        color={"white"}
                        textTransform={"uppercase"}
                        width={{ base: null, lg: "100%" }}
                        px={"2rem"}
                        borderRadius={"0"}
                      >
                        Go
                      </Button>
                    </Flex>
                  </GridItem>
                  <GridItem colSpan={{ base: 12, lg: 12 }}>
                    <Text
                      fontSize={"sm"}
                      textTransform={"uppercase"}
                      fontWeight={"500"}
                    >
                      This Patient Management Portal Is{" "}
                      <chakra.span fontWeight={"bold"}>
                        By Invitation Only
                      </chakra.span>
                      . Please Contact Your Clinician To Receive An Invitation.
                    </Text>
                  </GridItem>
                </Grid>
              </fieldset>
            </chakra.form>
          </Flex>
        </CardBody>
      </Card>
    )
  }
  else { // styling === "signinPage"
    return (
      <chakra.form 
        onSubmit={handleSubmit(onSubmit)} 
        w={"100%"}
        noValidate={true}
      >
        <fieldset disabled={status === "isLoading"}>
          <Flex
            align={"center"}
            flexDirection={"column"}
            gap={"1rem"}
            mb={"1rem"}
          >
            <Image
              src="/smileconnect-colour.svg"
              h={{ base: "45px", lg: "70px" }}
            />
            <Text
              fontSize={"sm"}
              textTransform={"uppercase"}
              fontWeight={"500"}
              textAlign={"center"}
            >
              This Patient Management Portal Is By Invitation Only. Please
              Contact Your Clinician To Receive An Invite
            </Text>
          </Flex>
          <Box mb={"1rem"}>
          <FormControl 
            isInvalid={!!errors.username} 
            isRequired={true}
          >
              <FormLabel>Email:</FormLabel>
              <Input
                type={"text"}
                bg={"lightBlueLogo"}
                autoComplete={"email"}
                {...register("username", { required: true })}
              />
              {errors?.username?.message ? (
                <FormErrorMessage>
                  {`${errors.username.message}`}
                </FormErrorMessage>
              ) : null}
            </FormControl>
          </Box>
          <Box mb={"3rem"}>
            <FormControl
              isInvalid={!!errors.password}
              isRequired={true}
            >
              <Flex justifyContent={"space-between"}>
                <FormLabel>Password:</FormLabel>
                <Link 
                  href={"forgot-password"} 
                  as={NextLink}
                >
                  <Text fontSize={"0.8rem"} color={"primary"}>
                    Forgot Password?
                  </Text>
                </Link>
              </Flex>
              <Input
                type={"password"}
                bg={"lightBlueLogo"}
                autoComplete={"current-password"}
                {...register("password", { required: true })}
              />
              {errors?.password?.message ? (
                <FormErrorMessage>
                  {`${errors.password.message}`}
                </FormErrorMessage>
              ) : null}
            </FormControl>
          </Box>
          <Button
            color={"white"}
            bgColor={"xlDarkBlueLogo"}
            rounded={"none"}
            size={"lg"}
            textTransform={"uppercase"}
            width={"100%"}
            type={"submit"}
          >
            {status === "isLoading" ? <Spinner mr={"1rem"} /> : null}
            Login
          </Button>
        </fieldset>
      </chakra.form>
    )
  }
}
