import { chakra, Grid, GridItem, Link, Divider, FormControl, FormLabel, Input, FormHelperText, Textarea, Button, Flex, Spinner, Text, useToast, Alert, AlertIcon, AlertDescription, Card, CardBody, CardFooter, CardHeader, Heading, Select } from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import Mailgun from "mailgun.js";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import { useV2Router } from "componentsv2/Dashboard/Helpers/routerHelpers";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { object, string } from "yup";
import { sendMadeDigitalData } from "hooks/useQueryHook";
import { gql } from "graphql-request";
import { useMutation } from "@tanstack/react-query";

type PatientSupportFormProps = {
  session: Session,
  defaultValues: {
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    message: string,
  },
  clinic: any
}

export default function PatientSupportForm({session, defaultValues, clinic}: PatientSupportFormProps) {
  const isToClinic = !!(clinic && clinic.locationEmail)
  const clinicName = isToClinic ? clinic?.locationOtherName : "SmileConnect Staff"

  const [captchaCode, setCaptchaCode] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const router = useV2Router()

  const validationSchema = object({
    firstName: string().required("First Name is required"),
    lastName: string().required("Last Name is required"),
    email: string().required("Email is Required").email("Email must be valid"),
    phone: string().required("Phone is Required"),
    message: string().required("Message is Required"),
  })

  const formOptions = {
    resolver: yupResolver(validationSchema),
  }
  
  const {
    watch,
    getValues,
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm(formOptions)

  const supportTypeValue = watch("supportType")

  useEffect(() => {
    reset(
      defaultValues,
      { keepDefaultValues: false, }
    )
  }, [defaultValues])

  const toast = useToast()
  const toastIdRef = useRef<any>()

  const smileconnectPatientSupportSubmissionMutation = gql`
    mutation save_smileconnectPatientSupport_Submission(
      $email: String, 
      $firstName: String, 
      $lastName: String,
      $message: String, 
      $phone: String, 
      $providerLocation: String,
      $formProperties: FreeformFormPropertiesInputType,
    ) {
      save_smileconnectPatientSupport_Submission(
        email: $email,
        firstName: $firstName,
        lastName: $lastName,
        message: $message,
        phone: $phone,
        providerLocation: $providerLocation
        formProperties: $formProperties
      ) {
        id
      }
    }
  `
  const useSmileconnectPatientSupportSubmissionMutation = useMutation(
    (newData: any) => sendMadeDigitalData(smileconnectPatientSupportSubmissionMutation, newData),
    {
      onMutate: (newData) => {
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
              Sending Support ticket
              <Spinner color="white" />
            </Flex>
          ),
          duration: 100000,
          isClosable: true,
        })
      },
      onError: (err, newData) => {
        toast.update(toastIdRef.current, {
          description: "Couldn't Send Support ticket",
          status: "error",
          duration: 3000,
          isClosable: true,
        })
        setIsSubmitting(false)
      },
      onSuccess: (data, newData) => {
        toast.update(toastIdRef.current, {
          description: "Sent Support ticket",
          status: "success",
          duration: 3000,
          isClosable: true,
        })
        router.push("/thank-you")
      },
    }
  )

  const onSubmit = async (data) => {
    if(supportTypeValue === "technical") {
      
      const recipients = ["admin@madedigital.group"]

      const formProperties = recipients?.length ? {
        dynamicNotification: {
          template: "support-ticket-notification.twig",
          recipients: recipients
        }
      } : null

      const newData = {
        email: data?.email,
        firstName: data?.firstName,
        lastName: data?.lastName,
        message: data?.message,
        phone: data?.phone,
        providerLocation: clinic?.locationShortNameState ?? clinic?.title ?? "Unknown",
        formProperties: formProperties
      }

      useSmileconnectPatientSupportSubmissionMutation.mutate(newData)
    }
    else if(supportTypeValue === "treatmentRelated" && isToClinic) {
      
      setIsSubmitting(true)
      const formdata = new FormData()
  
      const toEmail = clinic.locationEmail ?? null
  
      const body = `
        <div>
          <h3>SmileConnect support submission:</h3>
          <ul>
            <li>Clinic: ${clinicName}</li>
            <li>First name: ${data.firstName}</li>
            <li>Last name: ${data.lastName}</li>
            <li>Email: ${data.email}</li>
            <li>Mobile: ${data.phone}</li>
            <li>Message: ${data.message}</li>
          </ul>
        </div>
      `
      formdata.append("html", body)
      formdata.append("email", toEmail)
      formdata.append("bcc", "enquiries@madedigital.group")
      formdata.append("subject", "New submission from SmileConnect Support Form")

      try {
        // Send email
        if(!toEmail) {
          throw new Error("Error sending email, please send instead to technical support")
        }
        else {
          toastIdRef.current = toast({
            render: () => (
              <Flex
                justify="space-around"
                color="white"
                p={3}
                bg="blue.500"
                borderRadius="6px"
              >
                Sending Support Ticket...
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
    
          let slackWebhook = await fetch("/api/slack", {
            method: "POST",
            body : JSON.stringify({
              isToClinic: true,
              text: `A support request was sent in by ${data.firstName} ${data.lastName} via SmileConnect to ${clinicName}, Their message was ${data.message} :)`,
            }),
          })

          toast.update(toastIdRef.current, {
            description: "Successfully Sent Submission",
            status: "success",
            duration: 3000,
            isClosable: true,
          })
          router.push("/thank-you")
        }
      } catch (err) {
        toast.update(toastIdRef.current, {
          description: "Couldn't Send Submission",
          status: "error",
          duration: 3000,
          isClosable: true,
        })
      }
    }
  }

  const isFormReady = !isSubmitting

  return (
    <>
      <chakra.form onSubmit={handleSubmit(onSubmit)}>
        <fieldset disabled={!isFormReady}>
          <Grid
            templateColumns={"repeat(12, 1fr)"}
            columnGap={{ base: "1rem", lg: "1rem" }}
            rowGap={{ base: "1rem", lg: "1rem" }}
          >
            <GridItem colSpan={{ base: 12 }}>
              <FormLabel
                fontSize={"1.5rem"}
                color={"primary"}
                mb={"1rem"}
              >
                Please select what kind of support you need:
              </FormLabel>
              <Select
                size={"lg"}
                {...register("supportType", { required: true })}
              >
                <option value="">- Please Select -</option>  
                <option value="emergency">This is an emergency and I require immediate medical attention</option>
                <option value="treatmentRelated">This is not an emergency and I have a treatment or booking related related question</option>
                <option value="technical">This is not an emergency and I require technical support on using SmileConnect</option>
              </Select>
            </GridItem>
            {supportTypeValue === "emergency" ? (
              <GridItem colSpan={{ base: 12 }}>
                <Alert status="warning">
                  <AlertIcon />
                  <AlertDescription 
                    fontSize={24}
                    lineHeight={1.5}
                  >
                    <Text>In the case of an emergency or if you find yourself in a situation requiring immediate medical attention, do not hesitate to call <strong>000</strong>.</Text>
                    
                    <Text>Emergency services are equipped to provide rapid assistance in critical situations.</Text>
                  </AlertDescription>
                </Alert>
              </GridItem>
            ) : supportTypeValue === "treatmentRelated" && !isToClinic ? (
              <GridItem colSpan={{ base: 12 }}>
                <Card align='center' mb="1rem">
                  <CardHeader>
                    <Heading size='md'> Login to Engage with Your Clinic</Heading>
                  </CardHeader>
                  <CardBody>
                    <Text fontSize={"1.2rem"} textAlign="center">
                      To ask questions about your treatment please call your provider directly otherwise please login so we can connect you to your clinic.
                    </Text>
                  </CardBody>
                  <CardFooter>
                    <Link href={"/signin"} className={"link"}>
                      <Button colorScheme='blue' textTransform={"uppercase"}>
                        Log in to your account
                      </Button>
                    </Link>{" "}
                  </CardFooter>
                </Card>
              </GridItem>
            ) : supportTypeValue === "technical" || (supportTypeValue === "treatmentRelated" && isToClinic) ? (
              <>
                <GridItem colSpan={{ base: 12 }}>
                  {supportTypeValue === "technical" ? (
                    <Text fontSize={"1.2rem"}>
                      To contact technical support please fill out the
                      form below and one of our team members will be
                      in touch shortly.
                    </Text> 
                  ) : (
                    <Text fontSize={"1.2rem"}>
                      To contact {clinicName} please fill out the
                      form below and one of our team members will be
                      in touch shortly.
                    </Text>
                  )}
                  <Divider my={"1rem"} />
                </GridItem>
                <GridItem colSpan={{ base: 12, lg: 6 }}>
                  <FormControl
                    isRequired={true}
                    isInvalid={!!errors?.firstName}
                  >
                    <FormLabel
                      fontSize={{ base: "13px", md: "14px" }}
                    >
                      First Name
                    </FormLabel>
                    <Input
                      type={"text"}
                      fontSize={{ base: "13px", md: "14px" }}
                      {...register("firstName", { required: true })}
                    />
                    {errors?.firstName?.message ? (
                      <FormHelperText color={"red"}>
                        {errors.firstName.message.toString()}
                      </FormHelperText>
                    ) : null}
                  </FormControl>
                </GridItem>
                <GridItem colSpan={{ base: 12, lg: 6 }}>
                  <FormControl
                    isRequired={true}
                    isInvalid={!!errors?.lastName}
                  >
                    <FormLabel
                      fontSize={{ base: "13px", md: "14px" }}
                    >
                      Last Name
                    </FormLabel>
                    <Input
                      type={"text"}
                      fontSize={{ base: "13px", md: "14px" }}
                      {...register("lastName", { required: true })}
                    />
                    {errors?.lastName?.message ? (
                      <FormHelperText color={"red"}>
                        {errors.lastName.message.toString()}
                      </FormHelperText>
                    ) : null}
                  </FormControl>
                </GridItem>
                <GridItem colSpan={{ base: 12, lg: 6 }}>
                  <FormControl
                    isRequired={true}
                    isInvalid={!!errors?.email}
                  >
                    <FormLabel
                      fontSize={{ base: "13px", md: "14px" }}
                    >
                      Email
                    </FormLabel>
                    <Input
                      type={"text"}
                      fontSize={{ base: "13px", md: "14px" }}
                      {...register("email", { required: true })}
                    />
                    {errors?.email?.message ? (
                      <FormHelperText color={"red"}>
                        {errors.email.message.toString()}
                      </FormHelperText>
                    ) : null}
                  </FormControl>
                </GridItem>
                <GridItem colSpan={{ base: 12, lg: 6 }}>
                  <FormControl
                    isRequired={true}
                    isInvalid={!!errors?.phone}
                  >
                    <FormLabel
                      fontSize={{ base: "13px", md: "14px" }}
                    >
                      Phone
                    </FormLabel>
                    <Input
                      type={"text"}
                      fontSize={{ base: "13px", md: "14px" }}
                      {...register("phone", { required: true })}
                    />
                    {errors?.phone?.message ? (
                      <FormHelperText color={"red"}>
                        {errors.phone.message.toString()}
                      </FormHelperText>
                    ) : null}
                  </FormControl>
                </GridItem>
                <GridItem colSpan={{ base: 12, lg: 12 }}>
                  <FormControl
                    isRequired={false}
                    isInvalid={!!errors?.message}
                  >
                    <FormLabel
                      fontSize={{ base: "13px", md: "14px" }}
                    >
                      Message
                    </FormLabel>
                    <Textarea
                      rows={4}
                      fontSize={{ base: "13px", md: "14px" }}
                      {...register("message", { required: true })}
                    />
                    {errors?.message?.message ? (
                      <FormHelperText color={"red"}>
                        {errors.message.message.toString()}
                      </FormHelperText>
                    ) : null}
                  </FormControl>
                </GridItem>
                <GridItem colSpan={{ base: 12, lg: 12 }}>
                  <Text fontSize={"0.8rem"} mb={"1rem"}>
                    This site is protected by reCAPTCHA and the Google
                    Privacy Policy and Terms of Service apply.
                  </Text>
                  <Button
                    bgColor={"black"}
                    border={"0rem"}
                    color={"white"}
                    width={"100%"}
                    textTransform={"uppercase"}
                    p={"1rem"}
                    type={"submit"}
                    rounded={"0"}
                  >
                    Submit
                  </Button>
                </GridItem>
              </>
            ) : null}
          </Grid>
        </fieldset>
      </chakra.form>
    </>
  )
}
