import { chakra, Button, Flex, Heading, Icon, Text, Input, FormControl, FormLabel, Container, HStack, PinInput, PinInputField, FormErrorMessage, useToast, Spinner, Link } from "@chakra-ui/react"
import { yupResolver } from "@hookform/resolvers/yup"
import FullscreenLoadingSpinner from "components/FullscreenLoadingSpinner"
import { signIn, useSession } from "next-auth/react"
import { useRouter } from "next/router"
import React, { useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { GoMail } from "react-icons/go"
import NextLink from "next/link"
import * as Yup from "yup"

export async function getServerSideProps(context) {
  const { id, magicCode } = context.query
  return {
    props: {
      id: id ?? null,
      magicCode: magicCode ?? null,
    },
  }
}

export default function AuthSignin({ id, magicCode }: { id: string, magicCode: string }) {
  const { data: session } = useSession()
  const router = useRouter()

  /* const [magicCodeState, setMagicCodeState] = useState("")
  const [userIdState, setUserIdState] = useState("") */
  /* async function logUserWithCode() {
    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: userIdState,
        password: Number(magicCodeState),
        type: "magicLinkSignIn",
      })

      if (res.ok) {
        router.push("/dashboard")
      } else {
        throw new Error("Invalid Credentials")
      }
    } catch (err) {
      router.push("/404?error=" + err)
    }
  } */
  /* useEffect(() => {
    async function logUser() {
      try {
        const res = await signIn("credentials", {
          redirect: false,
          email: id,
          password: magicCode,
          type: "magicLinkSignIn",
        })

        if (res.ok) {
          router.push("/dashboard")
        } else {
          throw new Error("Invalid Credentials")
        }
      } catch (err) {
        router.push("/404?error=" + err)
      }
    }
    if (!!session) {
      router.push("/")
    } else {
      if (!!magicCode && !!id) {
        logUser()
      }
    }
  }, [id, magicCode]) */
  
  // Send to error page if no id
  if (!id) {
    router.push("/403")
  }

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [autoSubmit, setAutoSubmit] = useState(false)

  const validationSchema = Yup.object({
    id: Yup.string().required("Id is required"),
    magicCode: Yup.string().required("Code is required").min(6, "Code must be 6 digits").max(6, "Code must be 6 digits"),
  })
  const {
    reset,
    setValue,
    getValues,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      id: id ?? "",
      magicCode: magicCode ?? "",
    }
  })

  // Fill out 6 digit code if provided
  useEffect(() => {
    if (!!id && !!magicCode) {
      setValue("magicCode", magicCode)
      setAutoSubmit(true)
    }
  }, [magicCode])

  // Submit form if 6 digit code is provided
  useEffect(() => {
    if (autoSubmit) {
      handleSubmit((data) => {
        onSubmit(data)
      })()
    }
  }, [autoSubmit])
  
  const toast = useToast()
  const toastIdRef = useRef<any>()
  const onSubmit = async (data) => {
    setIsSubmitting(true)
    const formValues = getValues()
    try {
      toastIdRef.current = toast({
        render: () => (
          <Flex
            justify="space-around"
            color="white"
            p={3}
            bg="blue.500"
            borderRadius="6px"
          >
            <chakra.span>
              Logging in...
            </chakra.span>
            <Spinner color="white" />
          </Flex>
        ),
        duration: 9000,
        isClosable: true,
      })
      const res = await signIn("credentials", {
        redirect: false,
        email: formValues.id,
        password: Number(formValues.magicCode),
        type: "magicLinkSignIn",
      })
      if (res.ok) {
        toast.update(toastIdRef.current, {
          title: "Success",
          description: "Successfully logged in",
          status: "success",
          duration: 2000,
          isClosable: true,
        })

        const redirectPath = typeof router.query.redirect === 'string' ? router.query.redirect : '/'
        router.push(redirectPath)
      } else {
        throw new Error("Invalid Credentials")
      }
    } catch (error) {
      setIsSubmitting(false)
      toast.update(toastIdRef.current, {
        title: "Error",
        description: `Error - ${error.message}`,
        status: "error",
        duration: 9000,
        isClosable: true,
      })
    }
  }

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
          alignItems="center"
          flexDirection={"column"}
          my={{ base: "2rem", lg: "5rem" }}
        >
          <Flex direction="column" width="100%" alignItems="flex-start">
            <Link href="/signin" as={NextLink} className="link" textAlign={"left"}>
              {`<< Back to Sign In`}
            </Link>
          </Flex>

          <Icon as={GoMail} fontSize="60px" color="medBlueLogo" />
          <Heading>Please check your email</Heading>
          <Text>
            Please check your email and click the verification link to log in
          </Text>
          <chakra.form 
            onSubmit={handleSubmit(onSubmit)} 
            noValidate={true}
          >
            <fieldset disabled={isSubmitting}>
              <Flex direction="column" mt="10px">
                <FormControl 
                  isInvalid={!!errors.id}
                  isRequired={true}  
                >
                  <Input
                    type="hidden"
                    {...register("id", { required: true })}
                  />
                  {errors?.id?.message ? (
                    <FormErrorMessage>
                      {errors.id.message}
                    </FormErrorMessage>
                  ) : null}
                </FormControl>
                <FormControl
                  isInvalid={!!errors.magicCode}
                  isRequired={true}
                >
                  <FormLabel my="6px" fontSize="16px" textAlign={"center"}>
                    Or enter 6 digit code
                  </FormLabel>
                  <Input
                    type="hidden"
                    {...register("magicCode", { required: true })}
                  />
                  <Flex justifyContent={"center"}>
                    <HStack>
                      <PinInput 
                        size='lg'
                        onChange={(value) => setValue("magicCode", value)}
                        defaultValue={getValues("magicCode")}
                      >
                        <PinInputField/>
                        <PinInputField/>
                        <PinInputField/>
                        <PinInputField/>
                        <PinInputField/>
                        <PinInputField/>
                      </PinInput>
                    </HStack>
                  </Flex>
                  {errors?.magicCode?.message ? (
                    <FormErrorMessage>
                      {errors.magicCode.message}
                    </FormErrorMessage>
                  ) : null}
                </FormControl>
                <Flex justify="flex-end" gap="20px" mt="10px">
                  <Button
                    color={"white"}
                    bgColor={"xlDarkBlueLogo"}
                    rounded={"none"}
                    size={"lg"}
                    textTransform={"uppercase"}
                    width={"100%"}
                    type={"submit"}
                  >
                    Submit
                  </Button>
                </Flex>
              </Flex>
            </fieldset>
          </chakra.form>
        </Flex>
      </Container>
    </Flex>
  )
}

AuthSignin.auth = {
  public: true,
}
