import { useForm } from "react-hook-form"
import { useRef, useState } from "react"
import { useRouter } from "next/router"
import { gql, GraphQLClient } from "graphql-request"
import {
  Alert,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Container,
  chakra,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Img,
  Input,
  Spinner,
  FormErrorMessage,
  useToast,
  Spacer,
  Link,
} from "@chakra-ui/react"
import { yupResolver } from "@hookform/resolvers/yup"
import { object, string } from "yup"
import NextLink from "next/link"

export default function ForgotPassword() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validationSchema = object({
    email: string().email("Please enter a valid email address").required("Email is required"),
  })

  const formOptions = {
    resolver: yupResolver(validationSchema),
    mode: "onBlur" as "onBlur", 
  }

  const {
    getValues,
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm(formOptions)
  
  const userForgottenPasswordMutation = gql`
    mutation userForgottenPassword($email: String!) {
      userForgottenPassword(email: $email)
    }
  `

  const toast = useToast()
  const toastIdRef = useRef<any>()
  const handleUserForgottenPasswordMutation = async (details) => {
    try {
      setIsSubmitting(true)
      toastIdRef.current = toast({
        render: () => (
          <Flex
            justify="space-around"
            color="white"
            p={3}
            bg="blue.500"
            borderRadius="6px"
          >
            <chakra.span>Sending password reset email...</chakra.span>
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
      const data = await graphQLClient.request(userForgottenPasswordMutation, {
        email: details.email,
      })
      toast.update(toastIdRef.current, {
        title: "Success",
        description: "Check your email for a password reset link",
        status: "success",
        duration: 10000,
        isClosable: true,
      })
    } catch (error) {
      setIsSubmitting(false)

      // NOTE: We want to show the same success message regardless of whether the email exists in the database or not
      //       This is to prevent users from knowing whether an email exists in the database or not
      toast.update(toastIdRef.current, {
        title: "Success",
        description: "Check your email for a password reset link",
        status: "success",
        duration: 10000,
        isClosable: true,
      })

      // toast.update(toastIdRef.current, {
      //   title: "Error",
      //   description: "Error - something went wrong",
      //   status: "error",
      //   duration: 9000,
      //   isClosable: true,
      // })
    }
  }

  const onSubmit = async (data) => {
    await handleUserForgottenPasswordMutation(data)
  }

  return (
    <Flex
      direction={"column"}
      width={"100vw"}
      align={"center"}
      justify={"center"}
      minHeight={"70vh"}
      bgColor={"lgDarkBlueLogo"}
    >
      <Container size={"small"} py={"2rem"} my={{ base: "2rem", lg: "5rem" }}>
        <Flex mb={"0.5rem"}>
          <Link 
            href={"/"} 
            as={NextLink} 
            color={"white !important"}
            className={"link"}
          >
            <chakra.span
              className="material-symbols-outlined"
              fontSize={"1.5rem"}
              fontWeight={"bold"}
              verticalAlign={"middle"}
            >
              chevron_left
            </chakra.span>
            Back to main page
          </Link>
        </Flex>
        <Flex
          flexDirection={"column"}
          w={"100%"}
          padding={"24px"}
          bgColor={"white"}
          borderRadius={"6px"}
        >
          <chakra.form
            onSubmit={handleSubmit(onSubmit)} 
            noValidate={true}
            w={"100%"}
          >
            <fieldset disabled={isSubmitting}>
              <Flex flexDirection={"column"} mb={"1rem"} w={"100%"}>
                <Heading
                  color={"primary"}
                  textTransform={"uppercase"}
                  textAlign={"center"}
                  fontSize={"2rem"}
                  mb={"0.5rem"}
                  as={"h1"}
                >
                  Forgot Password
                </Heading>
                <Heading 
                  textAlign={"center"} 
                  fontSize={"1.1rem"} 
                  as={"h2"}
                >
                  Enter your email address below to reset your password
                </Heading>
                <Spacer my={"1rem"} />
                <Box mb={"1rem"}>
                  <FormControl 
                    isInvalid={!!errors.email} 
                    isRequired={true}
                  >
                    <FormLabel>Email:</FormLabel>
                    <Input
                      type={"text"}
                      bg={"lightBlueLogo"}
                      {...register("email", { required: true })}
                    />
                    {errors?.email?.message ? (
                      <FormErrorMessage>
                        {`${errors.email.message}`}
                      </FormErrorMessage>
                    ) : null}
                  </FormControl>
                </Box>
                <Flex justifyContent={"end"}>
                  <Button
                    bgColor={"darkBlueLogo"}
                    rounded={"0"}
                    type={"submit"}
                    color={"white"}
                    textTransform={"uppercase"}
                    px={"1.8rem"}
                  >
                    Send Password Reset Email
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

ForgotPassword.auth = {
  public: true,
}
