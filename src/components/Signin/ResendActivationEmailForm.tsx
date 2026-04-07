import { Button, chakra, Flex, FormControl, FormErrorMessage, FormLabel, Input, Spacer, Heading, Box, useToast, Spinner } from "@chakra-ui/react"
import { yupResolver } from "@hookform/resolvers/yup"
import { gql, GraphQLClient } from "graphql-request"
import { useRef, useState } from "react"
import { useForm } from "react-hook-form"
import * as Yup from "yup"

export default function ResendActivationEmailForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const validationSchema = Yup.object({
    email: Yup.string().email("Please enter a valid email address").required("Email is required"),
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
    if(isSuccess) {
      toastIdRef.current = toast({
        title: "Success",
        description: "Check your email for a password reset link",
        status: "success",
        duration: 10000,
        isClosable: true,
      })
      return null
    }

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
      setIsSuccess(true)
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
    }
  }

  const onSubmit = async (data) => {
    await handleUserForgottenPasswordMutation(data)
  }

  return (
    <>
      <Spacer my={"1rem"} />
      <chakra.form 
        noValidate={true}
        onSubmit={handleSubmit(onSubmit)} 
        width={"100%"}
      >
        <fieldset disabled={isSubmitting || isSuccess}>
          <Flex flexDirection={"column"} mb={"1rem"} w={"100%"}>
            <Heading
              color={"primary"}
              textTransform={"uppercase"}
              textAlign={"center"}
              fontSize={"1.5rem"}
              mb={"0.5rem"}
              as={"h1"}
            >
              This link is invalid or has expired. 
            </Heading>
            <Heading 
              textAlign={"center"} 
              fontSize={"1.2rem"}
              as={"h2"}
            >
              Please enter your email address to receive a new activation link.
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
    </>
  )
}