//@ts-nocheck
import {
  Button,
  Card,
  CardBody,
  Container,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Input,
  Select,
  Spinner,
  Text,
  Textarea,
  useToast,
  chakra,
  FormHelperText,
  Link,
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { AccountWrapper } from "componentsv2/Account/AccountWrapper";
import { useSession } from "next-auth/react";
import { useV2Router } from "componentsv2/Dashboard/Helpers/routerHelpers";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { object, string, mixed } from "yup";
import { gql } from "graphql-request";
import useQueryHook, { sendMadeDigitalData } from "hooks/useQueryHook";
import { convertBase64 } from "helpersv2/utils";
import { useMutation } from "@tanstack/react-query";

export default function SupportTicket() {
  const title = "Support Ticket";
  const slug = "support-ticket";

  const [captchaCode, setCaptchaCode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useV2Router();
  const { status, data: session } = useSession({
    required: false,
  });

  const supportTicketViewerQuery = gql`
    query contactPageViewerQuery {
      viewer: viewer {
        ... on User {
          id
          firstName
          lastName
          email
          userHomePhone
          userMobilePhone
          userLocation {
            ... on locations_locations_Entry {
              id
              slug
              title
              locationShortNameState
            }
          }
          staffClinics {
            ... on locations_locations_Entry {
              id
              slug
              title
              locationShortNameState
            }
          }
          anaesthetistMass {
            ... on mass_default_Entry {
              id
              slug
              title
              masShortName
            }
          }
          technicianLaboratories {
            ... on laboratories_default_Entry {
              id
              slug
              title
              laboratoryShortName
            }
          }
        }
      }
    }
  `;
  const supportTicketViewerResult = useQueryHook(
    ["supportTicketViewer"],
    supportTicketViewerQuery,
    {},
    {
      enabled: !!session,
    },
  );

  const validationSchema = object({
    firstName: string().required("First Name is required"),
    lastName: string().required("Last Lame is required"),
    email: string().required("Email is Required").email("Email must be valid"),
    phone: string().required("Phone is Required"),
    message: string().required("Message is Required"),
    isRelatedToPatient: string().required("Please select an option"),
    patientsFirstName: string().when("isRelatedToPatient", {
      is: "Yes",
      then: string().required("Patient's First Name is required"),
    }),
    patientsLastName: string().when("isRelatedToPatient", {
      is: "Yes",
      then: string().required("Patient's Last Name is required"),
    }),
    fileUpload: mixed()
      .test("amountOfFiles", "No more than 4 Files.", (value) => {
        if (!value.length) return true;
        return value.length <= 4;
      })
      .test("fileSize", "The file(s) are too large.", (value) => {
        if (!value.length) return true;
        return (
          (Object.values(value).reduce(
            (acc: number, file: any) => acc + file.size,
            0,
          ) as number) <= 32000000
        );
      }),
  });
  const formOptions = {
    resolver: yupResolver(validationSchema),
  };
  const {
    watch,
    getValues,
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm(formOptions);

  const isRelatedToPatient = watch("isRelatedToPatient") === "Yes";

  const toast = useToast();
  const toastIdRef = useRef<any>();

  const smileconnectStaffSupportSubmissionMutation = gql`
    mutation save_smileconnectStaffSupport_Submission(
      $email: String
      $firstName: String
      $lastName: String
      $isRelatedToPatient: String
      $patientsFirstName: String
      $patientsLastName: String
      $message: String
      $phone: String
      $providerLocation: String
      $fileUpload: [FreeformFileUploadInputType]
    ) {
      save_smileconnectStaffSupport_Submission(
        email: $email
        firstName: $firstName
        lastName: $lastName
        isRelatedToPatient: $isRelatedToPatient
        patientsFirstName: $patientsFirstName
        patientsLastName: $patientsLastName
        message: $message
        phone: $phone
        providerLocation: $providerLocation
        fileUpload: $fileUpload
      ) {
        submissionId
        success
      }
    }
  `;
  const useSmileconnectStaffSupportSubmissionMutation = useMutation(
    (newData: any) =>
      sendMadeDigitalData(smileconnectStaffSupportSubmissionMutation, newData),
    {
      onMutate: (newData) => {
        setIsSubmitting(true);
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
        });
      },
      onError: (err, newData) => {
        toast.update(toastIdRef.current, {
          description: "Couldn't Send Support ticket",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        setIsSubmitting(false);
      },
      onSuccess: (data, newData) => {
        toast.update(toastIdRef.current, {
          description: "Sent Support ticket",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      },
      onSettled: () => {},
    },
  );

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    const filesToUpload = getValues("fileUpload");
    const filesToUploadBase64 = await new Promise((resolve) => {
      const filesToUploadArray = Array.from(filesToUpload);
      const filesToUploadBase64Array = filesToUploadArray.map(
        async (file: any) => {
          const base64 = await convertBase64(file);
          return {
            fileData: base64,
            filename: file.name,
          };
        },
      );
      resolve(Promise.all(filesToUploadBase64Array));
    });

    const dataViewer = supportTicketViewerResult?.data?.viewer;
    const providerLocation =
      dataViewer?.staffClinics?.[0]?.locationShortNameState ??
      dataViewer?.staffClinics?.[0]?.title ??
      dataViewer?.anaesthetistMass?.[0]?.masShortName ??
      dataViewer?.anaesthetistMass?.[0]?.title ??
      dataViewer?.technicianLaboratories?.[0]?.laboratoryShortName ??
      dataViewer?.technicianLaboratories?.[0]?.title ??
      "Unknown";

    const newData = {
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      isRelatedToPatient: data.isRelatedToPatient,
      patientsFirstName: data.patientsFirstName,
      patientsLastName: data.patientsLastName,
      message: data.message,
      phone: data.phone,
      providerLocation: providerLocation,
      fileUpload: filesToUploadBase64,
    };

    useSmileconnectStaffSupportSubmissionMutation.mutate(newData);
  };

  const viewerFirstName =
    supportTicketViewerResult?.data?.viewer?.firstName ?? "";
  const viewerLastName =
    supportTicketViewerResult?.data?.viewer?.lastName ?? "";
  const viewerEmail = supportTicketViewerResult?.data?.viewer?.email ?? "";
  const viewerPhone =
    supportTicketViewerResult?.data?.viewer?.userMobilePhone ??
    supportTicketViewerResult?.data?.viewer?.userHomePhone ??
    "";

  // reset form values if viewer changes
  useEffect(() => {
    reset(
      {
        firstName: viewerFirstName,
        lastName: viewerLastName,
        email: viewerEmail,
        phone: viewerPhone,
        message: "",
      },
      {
        keepDefaultValues: false,
      },
    );
  }, [supportTicketViewerResult?.data?.viewer]);

  const headerText =
    " Report issues, request features, or ask for help. Include screenshots and links where possible; your ticket is logged, triaged, and you’ll be notified by email as it progresses.";

  return (
    <AccountWrapper
      title={title}
      headerText={headerText}
      breadcrumbs={[{ title: `${title}`, url: `account/${slug}` }]}
      slug={slug}
      p={"2rem"}
    >
      <chakra.form onSubmit={handleSubmit(onSubmit)} noValidate={true}>
        <fieldset disabled={isSubmitting}>
          <Grid
            templateColumns={"repeat(12, 1fr)"}
            columnGap={{ base: "1rem", lg: "1rem" }}
            rowGap={{ base: "1rem", lg: "1rem" }}
          >
            <GridItem colSpan={{ base: 12 }}>
              {!session ? (
                <>
                  <Text
                    fontWeight={"bold"}
                    fontSize={{ base: "13px", md: "14px" }}
                  >
                    You are not logged into your account - If you have an
                    account and are not experencing log in issues{" "}
                    <Link href={"/pagesv2/"} className={"link"}>
                      log in to your account
                    </Link>{" "}
                    and then use this form to contact your clinic directly.
                    <br />
                    <br />
                    Otherwise please fill out the form below and one of our team
                    members will be in touch shortly.
                  </Text>
                </>
              ) : // <Text
              //   fontWeight={"bold"}
              //   fontSize={{ base: "13px", md: "14px" }}
              // >
              //   Please fill out the form below and one of our team members
              //   will be in touch shortly.
              // </Text>
              null}
            </GridItem>
            <GridItem colSpan={{ base: 12, lg: 6 }}>
              <FormControl isRequired={true} isInvalid={!!errors?.firstName}>
                <FormLabel fontSize={{ base: "13px", md: "14px" }}>
                  First Name
                </FormLabel>
                <Input
                  type={"text"}
                  //bgColor={"lightBlueLogo"}
                  fontSize={{ base: "13px", md: "14px" }}
                  {...register("firstName", { required: true })}
                />
                {errors?.firstName?.message ? (
                  <FormHelperText
                    color={"red"}
                    fontSize={{ base: "12px", md: "13px" }}
                  >
                    {errors.firstName.message.toString()}
                  </FormHelperText>
                ) : null}
              </FormControl>
            </GridItem>
            <GridItem colSpan={{ base: 12, lg: 6 }}>
              <FormControl isRequired={true} isInvalid={!!errors?.lastName}>
                <FormLabel fontSize={{ base: "13px", md: "14px" }}>
                  Last Name
                </FormLabel>
                <Input
                  type={"text"}
                  //bgColor={"lightBlueLogo"}
                  fontSize={{ base: "13px", md: "14px" }}
                  {...register("lastName", { required: true })}
                />
                {errors?.lastName?.message ? (
                  <FormHelperText
                    color={"red"}
                    fontSize={{ base: "12px", md: "13px" }}
                  >
                    {errors.lastName.message.toString()}
                  </FormHelperText>
                ) : null}
              </FormControl>
            </GridItem>
            <GridItem colSpan={{ base: 12, lg: 6 }}>
              <FormControl isRequired={true} isInvalid={!!errors?.email}>
                <FormLabel fontSize={{ base: "13px", md: "14px" }}>
                  Email
                </FormLabel>
                <Input
                  type={"text"}
                  //bgColor={"lightBlueLogo"}
                  fontSize={{ base: "13px", md: "14px" }}
                  {...register("email", { required: true })}
                />
                {errors?.email?.message ? (
                  <FormHelperText
                    color={"red"}
                    fontSize={{ base: "12px", md: "13px" }}
                  >
                    {errors.email.message.toString()}
                  </FormHelperText>
                ) : null}
              </FormControl>
            </GridItem>
            <GridItem colSpan={{ base: 12, lg: 6 }}>
              <FormControl isRequired={true} isInvalid={!!errors?.phone}>
                <FormLabel fontSize={{ base: "13px", md: "14px" }}>
                  Phone
                </FormLabel>
                <Input
                  type={"text"}
                  //bgColor={"lightBlueLogo"}
                  fontSize={{ base: "13px", md: "14px" }}
                  {...register("phone", { required: true })}
                />
                {errors?.phone?.message ? (
                  <FormHelperText
                    color={"red"}
                    fontSize={{ base: "12px", md: "13px" }}
                  >
                    {errors.phone.message.toString()}
                  </FormHelperText>
                ) : null}
              </FormControl>
            </GridItem>
            <GridItem colSpan={{ base: 12, lg: 12 }}>
              <FormControl
                isRequired={true}
                isInvalid={!!errors?.isRelatedToPatient}
              >
                <FormLabel fontSize={{ base: "13px", md: "14px" }}>
                  Is this support ticket related to a patient?
                </FormLabel>
                <Select
                  {...register("isRelatedToPatient", { required: true })}
                  fontSize={{ base: "13px", md: "14px" }}
                >
                  <option value={""}>- Select an option -</option>
                  <option value={"Yes"}>Yes</option>
                  <option value={"No"}>No</option>
                </Select>
                {errors?.isRelatedToPatient?.message ? (
                  <FormHelperText color={"red"}>
                    {errors.isRelatedToPatient.message.toString()}
                  </FormHelperText>
                ) : null}
              </FormControl>
            </GridItem>
            {isRelatedToPatient ? (
              <>
                <GridItem colSpan={{ base: 12, lg: 6 }}>
                  <FormControl
                    isRequired={true}
                    isInvalid={!!errors?.patientsFirstName}
                  >
                    <FormLabel fontSize={{ base: "13px", md: "14px" }}>
                      Patient's First Name
                    </FormLabel>
                    <Input
                      type={"text"}
                      fontSize={{ base: "13px", md: "14px" }}
                      {...register("patientsFirstName", { required: true })}
                    />
                    {errors?.patientsFirstName?.message ? (
                      <FormHelperText color={"red"}>
                        {errors.patientsFirstName.message.toString()}
                      </FormHelperText>
                    ) : null}
                  </FormControl>
                </GridItem>
                <GridItem colSpan={{ base: 12, lg: 6 }}>
                  <FormControl
                    isRequired={true}
                    isInvalid={!!errors?.patientsLastName}
                  >
                    <FormLabel fontSize={{ base: "13px", md: "14px" }}>
                      Patient's Last Name
                    </FormLabel>
                    <Input
                      type={"text"}
                      {...register("patientsLastName", { required: true })}
                      fontSize={{ base: "13px", md: "14px" }}
                    />
                    {errors?.patientsLastName?.message ? (
                      <FormHelperText color={"red"}>
                        {errors.patientsLastName.message.toString()}
                      </FormHelperText>
                    ) : null}
                  </FormControl>
                </GridItem>
              </>
            ) : null}
            <GridItem colSpan={{ base: 12, lg: 12 }}>
              <FormControl isRequired={true} isInvalid={!!errors?.message}>
                <FormLabel fontSize={{ base: "13px", md: "14px" }}>
                  Describe the problem you're experiencing or the questions you
                  have
                </FormLabel>
                <Textarea
                  rows={8}
                  placeholder={""}
                  //bgColor={"lightBlueLogo"}
                  fontSize={{ base: "13px", md: "14px" }}
                  {...register("message", { required: true })}
                />
                {errors?.message?.message ? (
                  <FormHelperText
                    color={"red"}
                    fontSize={{ base: "12px", md: "13px" }}
                  >
                    {errors.message.message.toString()}
                  </FormHelperText>
                ) : null}
                <Text
                  color={"red"}
                  my={"1rem"}
                  fontSize={{ base: "12px", md: "13px" }}
                >
                  Note: If you are unable to change/or delete a record, user
                  details, etc. please provide us with the details of what it is
                  and what to change it to as we may be able to do it for you.
                </Text>
              </FormControl>
            </GridItem>
            <GridItem colSpan={{ base: 12, lg: 12 }}>
              <FormControl isRequired={false} isInvalid={!!errors?.fileUpload}>
                <FormLabel fontSize={{ base: "13px", md: "14px" }}>
                  File Upload
                </FormLabel>
                <Input
                  py={"0.5rem"}
                  height={"3rem"}
                  type={"file"}
                  //bgColor={"lightBlueLogo"}
                  fontSize={{ base: "13px", md: "14px" }}
                  multiple={true}
                  {...register("fileUpload")}
                />
                {errors?.fileUpload?.message ? (
                  <FormHelperText
                    color={"red"}
                    fontSize={{ base: "12px", md: "13px" }}
                  >
                    {errors.fileUpload.message.toString()}
                  </FormHelperText>
                ) : null}
                <Text
                  //size={"0.8rem"}
                  my={"0.7rem"}
                  fontSize={{ base: "12px", md: "13px" }}
                >
                  Upload any screeenshots or videos which may assist (max 4
                  files, 32MB total)
                </Text>
              </FormControl>
            </GridItem>
            <GridItem colSpan={{ base: 12, lg: 12 }} textAlign={"right"}>
              <Button
                isDisabled={isSubmitting}
                borderRadius={"0px"}
                w="25%"
                bgColor={"scBlack"}
                border={"0rem"}
                color={"white"}
                textTransform={"uppercase"}
                type={"submit"}
                fontSize={{ base: "13px", md: "14px" }}
                size={{ base: "sm", md: "md" }}
              >
                Submit
              </Button>
            </GridItem>
          </Grid>
        </fieldset>
      </chakra.form>
    </AccountWrapper>
  );
}

SupportTicket.auth = {
  role: "Staff",
};
