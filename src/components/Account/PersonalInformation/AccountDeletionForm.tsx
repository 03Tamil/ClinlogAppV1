import {
  Grid,
  GridItem,
  FormControl,
  FormLabel,
  Select,
  Input,
  Textarea,
  Flex,
  Button,
  Spinner,
  chakra,
  useToast,
  FormErrorMessage,
} from "@chakra-ui/react"
import { useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { HiOutlinePencil } from "react-icons/hi2"
import { yupResolver } from "@hookform/resolvers/yup"
import { object, string, date } from "yup"
import Mailgun from "mailgun.js"
import router from "next/router"
import formData from "form-data"
import { error } from "console"

export default function AccountDeletionForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const validationSchema = object({
    fullName: string().required("Full Name is Required"),
    email: string().required("Email is Required").email("Email must be valid"),
    contactNumber: string().required("Contact Number is Required"),
    reasonForDeletion: string().required("Reason for Deletion is Required"),
  })
  const {
    getValues,
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: "onBlur" as "onBlur",
  })
  const toast = useToast()
  const toastIdRef = useRef<any>()
  const onSubmit = async (data) => {
    setIsSubmitting(true)
    const formdata = new FormData()

    const toEmail = "enquiries@madedigital.group"

    const body = `
      <div>
        <h3>SmileConnect Account Deletion Request</h3>
        <ul>
          <li><strong>Full Name:</strong> ${data.fullName}</li>
          <li><strong>Email:</strong> ${data.email}</li>
          <li><strong>Contact Number:</strong> ${data.contactNumber}</li>
          <li><strong>Reason for Deletion:</strong> ${data.reasonForDeletion}</li>
        </ul>
      </div>
    `
    formdata.append("html", body)
    formdata.append("email", "enquiries@madedigital.group")
    formdata.append("subject", "New SmileConnect Account Deletion Request")

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
            Sending Account Deletion Request
            <Spinner color="red.500" />
          </Flex>
        ),
        duration: 100000,
        isClosable: true,
      })
      let rest = await fetch("/api/mailgun", {
        method: "POST",
        body: formdata,
      })
      rest = await rest.json()

      const webhookToUse = process.env.SLACK_WEBHOOK_URL
      let slackWebhook = await fetch("/api/slack", {
        method: "POST",
        body : JSON.stringify({
              isToClinic:true,
              text: `A support request was sent in by ${data.firstName} ${data.lastName} via SmileConnect, Their message was ${data.message} :)`,
            }),
      })
      // let slackWebhook = await fetch(webhookToUse, {
      //   method: "POST",
      //   body: JSON.stringify({
      //     text: `A delete account request was sent in by ${data.fullName} via SmileConnect, Their reason for deletion was ${data.reasonForDeletion}`,
      //   }),
      // })
      toast.update(toastIdRef.current, {
        description: "Successfully Sent Account Deletion Request",
        status: "success",
        duration: 3000,
        isClosable: true,
      })
    } catch (err) {
      setIsSubmitting(false)
      toast.update(toastIdRef.current, {
        description: "Couldn't Send Account Deletion Request",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
    }
  }

  const formReady = true

  return (
    <form 
      onSubmit={handleSubmit(onSubmit)}
      noValidate={true}  
    >
      <fieldset disabled={!formReady}>
        <Grid
          templateColumns={{
            base: "repeat(1, 1fr)",
            lg: "repeat(12, 1fr)",
          }}
          gap={"1rem"}
        >
          <GridItem colSpan={{ base: 1, lg: 12 }}>
            <FormControl 
              isRequired={true} 
              isInvalid={!!errors.fullName}
            >
              <FormLabel>Full name</FormLabel>
              <Input
                type={"text"}
                bgColor={"lightBlueLogo"}
                {...register(`fullName`, { required: true })}
              />
              {errors?.fullName ? (
                <FormErrorMessage>{`${errors?.fullName?.message}`}</FormErrorMessage>
              ) : null}
            </FormControl>
          </GridItem>
          <GridItem colSpan={{ base: 1, lg: 6 }}>
            <FormControl
              isRequired={true}
              isInvalid={!!errors.email}
            >
              <FormLabel>Email</FormLabel>
              <Input
                type={"text"}
                bgColor={"lightBlueLogo"}
                {...register("email")}
              />
              {errors?.email ? (
                <FormErrorMessage>{`${errors?.email?.message}`}</FormErrorMessage>
              ) : null}
            </FormControl>
          </GridItem>
          <GridItem colSpan={{ base: 1, lg: 6 }}>
            <FormControl
              isRequired={true}
              isInvalid={!!errors.contactNumber}
            >
              <FormLabel>Contact Number</FormLabel>
              <Input
                type={"text"}
                bgColor={"lightBlueLogo"}
                {...register("contactNumber")}
              />
              {errors?.contactNumber ? (
                <FormErrorMessage>
                  {`${errors?.contactNumber?.message}`}
                </FormErrorMessage>
              ) : null}
            </FormControl>
          </GridItem>
          <GridItem colSpan={{ base: 1, lg: 12 }}>
            <FormControl
              isRequired={true}
              isInvalid={!!errors.reasonForDeletion}
            >
              <FormLabel>Reason for deletion?</FormLabel>
              <Textarea
                bgColor={"lightBlueLogo"}
                {...register("reasonForDeletion")}
              />
              {errors?.reasonForDeletion ? (
                <FormErrorMessage>
                  {`${errors?.reasonForDeletion?.message}`}
                </FormErrorMessage>
              ) : null}
            </FormControl>
          </GridItem>
          <GridItem colSpan={{ base: 1, lg: 12 }}>
            <Flex justifyContent={"flex-end"}>
              <Button
                bgColor={"darkBlueLogo"}
                rounded={"0"}
                type={"submit"}
                color={"white"}
                textTransform={"uppercase"}
                px={"1.8rem"}
                minWidth={"300px"}
                leftIcon={
                  isSubmitting ? (
                    <Flex minWidth={"1.5rem"} justifyContent={"center"}>
                      <Spinner />
                    </Flex>
                  ) : (
                    <Flex minWidth={"1.5rem"}>
                      <HiOutlinePencil />
                    </Flex>
                  )
                }
              >
                <chakra.span>Request Deletion</chakra.span>
              </Button>
            </Flex>
          </GridItem>
        </Grid>
      </fieldset>
    </form>
  )
}
