// @ts-nocheck
import {
  Box,
  Button,
  Card,
  CardBody,
  chakra,
  Container,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Grid,
  GridItem,
  Heading,
  Icon,
  Input,
  Select,
  Skeleton,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { gql } from "graphql-request";
import useQueryHook, { sendData } from "hooks/useQueryHook";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { HiOutlinePencil } from "react-icons/hi2";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { format } from "date-fns";

export default function SetupAccountDetails() {
  const router = useRouter();
  const setupAccountViewerQuery = gql`
    query Viewer {
      viewer {
        ... on User {
          id
          fullName
          firstName
          lastName
          userTitle
          userPreferredName
          userDateOfBirth
          userDentalInsuranceFund
          userHomeAddress
          userCitySuburb
          userPostcode
          userState
          userHomePhone
          userMobilePhone
          userHowDidYouFindUs
          userHowDidYouFindUsDetails
        }
      }
    }
  `;
  const setupAccountViewerResult = useQueryHook(
    ["setupAccountViewerQuery"],
    setupAccountViewerQuery,
  );
  const viewerValues = setupAccountViewerResult?.data?.viewer;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const formReady = !setupAccountViewerResult.isLoading && !isSubmitting;

  const defaultValues = {
    userTitle: viewerValues?.userTitle ?? "",
    fullName: viewerValues?.fullName ?? "",
    userPreferredName: viewerValues?.userPreferredName ?? "",
    userDateOfBirth:
      (viewerValues?.userDateOfBirth
        ? format(new Date(viewerValues?.userDateOfBirth), "yyyy-MM-dd")
        : null) ?? "",
    userHomePhone: viewerValues?.userHomePhone ?? "",
    userMobilePhone: viewerValues?.userMobilePhone ?? "",
    userHomeAddress: viewerValues?.userHomeAddress ?? "",
    userCitySuburb: viewerValues?.userCitySuburb ?? "",
    userPostcode: viewerValues?.userPostcode ?? "",
    userState: viewerValues?.userState ?? "",
    userDentalInsuranceFund: viewerValues?.userDentalInsuranceFund ?? "",
    userHowDidYouFindUs: viewerValues?.userHowDidYouFindUs ?? "",
    whichAdvertising: viewerValues?.userHowDidYouFindUsDetails ?? "",
    userHowDidYouFindUsDetails: viewerValues?.userHowDidYouFindUsDetails ?? "",
  };

  const validationSchema = Yup.object().shape({
    fullName: Yup.string().required("Full name is required"),
    userHowDidYouFindUs: Yup.string().required(
      "How did you find us is required",
    ),
    whichAdvertising: Yup.string().when("userHowDidYouFindUs", {
      is: "advertisement",
      then: Yup.string().required("Which advertising is required"),
    }),
    userHowDidYouFindUsDetails: Yup.string().test(
      "userHowDidYouFindUsDetails",
      "Please provide details",
      function (value) {
        const { userHowDidYouFindUs, whichAdvertising } = this.parent;
        if (
          userHowDidYouFindUs === "doctorDentistOrSpecialist" ||
          userHowDidYouFindUs === "recommendation" ||
          (userHowDidYouFindUs === "advertisement" &&
            whichAdvertising === "Other") ||
          userHowDidYouFindUs === "internet" ||
          userHowDidYouFindUs === "socialMedia"
        ) {
          return value != "";
        }
        return true;
      },
    ),
    userDateOfBirth: Yup.date()
      .typeError("Date of Birth must be a valid date")
      .required("Date of birth is required"),
    userHomePhone: Yup.string().required("Home phone is required"),
    userMobilePhone: Yup.string().required("Mobile phone is required"),
    userHomeAddress: Yup.string().required("Home address is required"),
    userCitySuburb: Yup.string().required("City / Suburb is required"),
    userPostcode: Yup.string().required("Postcode is required"),
  });

  const {
    setValue,
    reset,
    getValues,
    handleSubmit,
    register,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: defaultValues,
    resolver: yupResolver(validationSchema),
    mode: "onBlur" as "onBlur",
  });

  const [userHowDidYouFindUs, whichAdvertising, userHowDidYouFindUsDetails] =
    watch([
      "userHowDidYouFindUs",
      "whichAdvertising",
      "userHowDidYouFindUsDetails",
    ]);

  // Not on inital load
  useEffect(() => {
    if (userHowDidYouFindUs === "advertisement") {
      if (
        [
          "Herald Sun",
          "The Australian",
          "Local Newspaper",
          "Cultural or Community Newspaper",
          "Radio",
          "Television",
          "Youtube",
        ].includes(userHowDidYouFindUsDetails)
      ) {
        setValue("whichAdvertising", whichAdvertising);
      } else {
        setValue("whichAdvertising", "Other");
        setValue("userHowDidYouFindUsDetails", userHowDidYouFindUsDetails);
      }
    }
  }, [userHowDidYouFindUs]);

  // Clear userHowDidYouFindUsDetails when switching whichAdvertising to Other
  useEffect(() => {
    if (
      userHowDidYouFindUs === "advertisement" &&
      whichAdvertising === "Other" &&
      [
        "Herald Sun",
        "The Australian",
        "Local Newspaper",
        "Cultural or Community Newspaper",
        "Radio",
        "Television",
        "Youtube",
      ].includes(userHowDidYouFindUsDetails)
    ) {
      setValue("userHowDidYouFindUsDetails", "");
    }
  }, [whichAdvertising]);

  // Reset form if viewerValues changes
  useEffect(() => {
    if (viewerValues) {
      reset(defaultValues, {
        keepDefaultValues: false,
        keepErrors: false,
      });
    }
  }, [viewerValues]);

  const updateSetupDetailsMutation = gql`
    mutation updateSetupDetailsMutation(
      $userTitle: String!
      $fullName: String
      $userPreferredName: String = ""
      $userDateOfBirth: DateTime
      $userHomePhone: String = ""
      $userMobilePhone: String = ""
      $userDentalInsuranceFund: String = ""
      $userHomeAddress: String
      $userCitySuburb: String
      $userPostcode: String
      $userState: String
      $userHowDidYouFindUs: String
      $userHowDidYouFindUsDetails: String = ""
    ) {
      updateViewer(
        fullName: $fullName
        userTitle: $userTitle
        userPreferredName: $userPreferredName
        userDateOfBirth: $userDateOfBirth
        userHomePhone: $userHomePhone
        userMobilePhone: $userMobilePhone
        userHomeAddress: $userHomeAddress
        userCitySuburb: $userCitySuburb
        userPostcode: $userPostcode
        userState: $userState
        userDentalInsuranceFund: $userDentalInsuranceFund
        userHowDidYouFindUs: $userHowDidYouFindUs
        userHowDidYouFindUsDetails: $userHowDidYouFindUsDetails
        patientFilledInitForm: true
      ) {
        id
        fullName
        firstName
        lastName
        ... on User {
          userTitle
          userPreferredName
          userDateOfBirth
          userHomePhone
          userMobilePhone
          userDentalInsuranceFund
          userHomeAddress
          userCitySuburb
          userPostcode
          userState
          userHowDidYouFindUs
          userHowDidYouFindUsDetails
          patientFilledInitForm
        }
      }
    }
  `;

  const toast = useToast();
  const toastIdRef = useRef<any>();
  const formSubmit = useMutation(
    (newData: any) => sendData(updateSetupDetailsMutation, newData),
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
              Confirming details...
              <Spinner color="white" />
            </Flex>
          ),
          duration: 100000,
          isClosable: true,
        });
      },
      onSuccess: (data, variables, context) => {
        toast.update(toastIdRef.current, {
          description: "Successfully Confirmed Details",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        router.push("/setup-account/terms");
      },
      onError: (error, variables, context) => {
        toast.update(toastIdRef.current, {
          title: "Error - Something went wrong",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
        setIsSubmitting(false);
      },
    },
  );
  const onSubmit = (data) => {
    const userHowDidYouFindUsDetails =
      userHowDidYouFindUs === "advertisement" && whichAdvertising !== "Other"
        ? whichAdvertising
        : data?.userHowDidYouFindUsDetails;

    formSubmit.mutate({
      userTitle: data?.userTitle,
      fullName: data?.fullName,
      userHowDidYouFindUs: data?.userHowDidYouFindUs,
      userHowDidYouFindUsDetails: userHowDidYouFindUsDetails,
      userPreferredName: data?.userPreferredName,
      userDateOfBirth: data?.userDateOfBirth,
      userHomePhone: data?.userHomePhone,
      userMobilePhone: data?.userMobilePhone,
      userDentalInsuranceFund: data?.userDentalInsuranceFund,
      userHomeAddress: data?.userHomeAddress,
      userCitySuburb: data?.userCitySuburb,
      userPostcode: data?.userPostcode,
      userState: data?.userState,
    });
  };

  return (
    <Flex
      direction={"column"}
      align={"center"}
      justify={"flex-start"}
      bgColor={"xlDarkBlueLogo"}
    >
      <Container size={"main"} maxWidth={"1200px"} py={"2rem"}>
        <Flex
          w={"100%"}
          padding={{ base: "1rem" }}
          bgColor={"white"}
          borderRadius={"6px"}
          my={{ base: "2rem", lg: "5rem" }}
        >
          <chakra.form
            noValidate={true}
            onSubmit={handleSubmit(onSubmit)}
            width={"100%"}
          >
            <chakra.fieldset disabled={!formReady}>
              <Grid
                templateColumns={{
                  base: "repeat(1, 1fr)",
                  lg: "repeat(12, 1fr)",
                }}
                gap={"1rem"}
                rowGap={"1rem"}
              >
                <GridItem colSpan={{ base: 1, lg: 12 }}>
                  <Heading
                    color={"primary"}
                    textTransform={"uppercase"}
                    textAlign={"center"}
                    fontSize={"2rem"}
                    mb={"0.5rem"}
                  >
                    Setup Your Patient Account
                  </Heading>
                  <Heading textAlign={"center"} fontSize={"1.1rem"}>
                    Please check the current details below and update any
                    missing or wrong information
                  </Heading>
                </GridItem>
                <GridItem colSpan={{ base: 1, lg: 12 }}>
                  <Divider my={"0.5rem"} />
                  <Heading
                    color={"primary"}
                    textTransform={"uppercase"}
                    fontSize={"1.6rem"}
                    mb={"1rem"}
                  >
                    Your Details
                  </Heading>
                </GridItem>
                <GridItem colSpan={{ base: 1, lg: 2 }}>
                  <FormControl
                    isRequired={false}
                    isInvalid={!!errors?.userTitle}
                  >
                    <FormLabel as={"legend"}>Title</FormLabel>
                    <Select
                      bgColor={"lightBlueLogo"}
                      {...register(`userTitle`, {})}
                    >
                      <option value="">(none)</option>
                      <option value="Mr">Mr.</option>
                      <option value="Mrs">Mrs.</option>
                      <option value="Ms">Ms.</option>
                      <option value="Miss">Miss.</option>
                      <option value="Mstr">Mstr.</option>
                      <option value="Dr">Dr.</option>
                    </Select>
                    {errors?.userTitle ? (
                      <FormErrorMessage>
                        {`${errors?.userTitle?.message}`}
                      </FormErrorMessage>
                    ) : null}
                  </FormControl>
                </GridItem>
                <GridItem colSpan={{ base: 1, lg: 5 }}>
                  <FormControl isRequired={true} isInvalid={!!errors?.fullName}>
                    <FormLabel>Full name</FormLabel>
                    <Input
                      type={"text"}
                      bgColor={"lightBlueLogo"}
                      {...register(`fullName`, { required: true })}
                    />
                    {errors?.fullName ? (
                      <FormErrorMessage>
                        {`${errors?.fullName?.message}`}
                      </FormErrorMessage>
                    ) : null}
                  </FormControl>
                </GridItem>
                <GridItem colSpan={{ base: 1, lg: 5 }}>
                  <FormControl
                    isRequired={false}
                    isInvalid={!!errors?.userPreferredName}
                  >
                    <FormLabel>Preferred name (if applicable)</FormLabel>
                    <Input
                      type={"text"}
                      bgColor={"lightBlueLogo"}
                      {...register("userPreferredName")}
                    />
                    {errors?.userPreferredName ? (
                      <FormErrorMessage>
                        {`${errors?.userPreferredName?.message}`}
                      </FormErrorMessage>
                    ) : null}
                  </FormControl>
                </GridItem>
                <GridItem colSpan={{ base: 1, lg: 4 }}>
                  <FormControl
                    isRequired={true}
                    isInvalid={!!errors?.userDateOfBirth}
                  >
                    <FormLabel>Date of Birth</FormLabel>
                    <Input
                      type={"date"}
                      bgColor={"lightBlueLogo"}
                      {...register("userDateOfBirth", {
                        valueAsDate: true,
                        required: true,
                      })}
                    />
                    {errors?.userDateOfBirth ? (
                      <FormErrorMessage>
                        {`${errors?.userDateOfBirth?.message}`}
                      </FormErrorMessage>
                    ) : null}
                  </FormControl>
                </GridItem>
                <GridItem colSpan={{ base: 1, lg: 8 }}>
                  <FormControl
                    isRequired={false}
                    isInvalid={!!errors?.userDentalInsuranceFund}
                  >
                    <FormLabel>
                      Dental Insurance Fund Name (If Applicable)
                    </FormLabel>
                    <Input
                      type={"text"}
                      bgColor={"lightBlueLogo"}
                      {...register("userDentalInsuranceFund")}
                    />
                    {errors?.userDentalInsuranceFund ? (
                      <FormErrorMessage>
                        {`${errors?.userDentalInsuranceFund?.message}`}
                      </FormErrorMessage>
                    ) : null}
                  </FormControl>
                </GridItem>
                <GridItem colSpan={{ base: 1, lg: 12 }}>
                  <Divider my={"0.5rem"} />
                </GridItem>
                <GridItem colSpan={{ base: 1, lg: 12 }}>
                  <Flex gap={"1rem"} flexDirection={"column"}>
                    <FormControl
                      isRequired={true}
                      isInvalid={!!errors?.userHowDidYouFindUs}
                    >
                      <FormLabel>How Did You Find Us?</FormLabel>
                      <Select
                        bgColor={"lightBlueLogo"}
                        {...register("userHowDidYouFindUs")}
                      >
                        <option value="">- Please Select -</option>
                        <option value="doctorDentistOrSpecialist">
                          Referred by your DOCTOR, DENTIST or SPECIALIST
                        </option>
                        <option value="recommendation">
                          By RECOMMENDATION from a patient or other
                          organization, please provide name
                        </option>
                        <option value="advertisement">
                          I saw or heard an ADVERTISEMENT, if so please tell us
                          where
                        </option>
                        <option value="internet">
                          I found you while searching the INTERNET, if so please
                          provide details
                        </option>
                        <option value="socialMedia">
                          I found you through SOCIAL MEDIA, if so please provide
                          details
                        </option>
                      </Select>
                      {errors?.userHowDidYouFindUs ? (
                        <FormErrorMessage>
                          {`${errors?.userHowDidYouFindUs?.message}`}
                        </FormErrorMessage>
                      ) : null}
                    </FormControl>
                    {userHowDidYouFindUs === "advertisement" ? (
                      <FormControl
                        isRequired={true}
                        isInvalid={!!errors?.whichAdvertising}
                      >
                        <FormLabel>Which advertising?</FormLabel>
                        <Select
                          bgColor={"lightBlueLogo"}
                          {...register("whichAdvertising")}
                        >
                          <option value="">- Please Select -</option>
                          <option value="Herald Sun">Herald Sun</option>
                          <option value="The Australian">The Australian</option>
                          <option value="Local Newspaper">
                            Local Newspaper
                          </option>
                          <option value="Cultural or Community Newspaper">
                            Cultural or Community Newspaper
                          </option>
                          <option value="Radio">Radio</option>
                          <option value="Television">Television</option>
                          <option value="Youtube">Youtube</option>
                          <option value="Other">Other</option>
                        </Select>
                        {errors?.whichAdvertising ? (
                          <FormErrorMessage>
                            {`${errors?.whichAdvertising?.message}`}
                          </FormErrorMessage>
                        ) : null}
                      </FormControl>
                    ) : null}
                    {userHowDidYouFindUs === "doctorDentistOrSpecialist" ||
                    userHowDidYouFindUs === "recommendation" ||
                    (userHowDidYouFindUs === "advertisement" &&
                      whichAdvertising === "Other") ||
                    userHowDidYouFindUs === "internet" ||
                    userHowDidYouFindUs === "socialMedia" ? (
                      <FormControl
                        isRequired={true}
                        isInvalid={!!errors?.userHowDidYouFindUsDetails}
                      >
                        <FormLabel>Please provide details</FormLabel>
                        <Input
                          type={"text"}
                          bgColor={"lightBlueLogo"}
                          {...register("userHowDidYouFindUsDetails")}
                        />
                        {errors?.userHowDidYouFindUsDetails ? (
                          <FormErrorMessage>
                            {`${errors?.userHowDidYouFindUsDetails?.message}`}
                          </FormErrorMessage>
                        ) : null}
                      </FormControl>
                    ) : (
                      <Input
                        type="hidden"
                        {...register("userHowDidYouFindUsDetails")}
                        value={whichAdvertising}
                      />
                    )}
                  </Flex>
                </GridItem>
                <GridItem colSpan={{ base: 1, lg: 12 }}>
                  <Divider my={"0.5rem"} />
                  <Heading
                    color={"primary"}
                    textTransform={"uppercase"}
                    fontSize={"1.6rem"}
                    mb={"1rem"}
                  >
                    Contact Details
                  </Heading>
                </GridItem>
                <GridItem colSpan={{ base: 1, lg: 6 }}>
                  <FormControl
                    isRequired={true}
                    isInvalid={!!errors?.userHomePhone}
                  >
                    <FormLabel>Home Phone</FormLabel>
                    <Input
                      type={"text"}
                      bgColor={"lightBlueLogo"}
                      {...register("userHomePhone", { required: true })}
                    />
                    {errors?.userHomePhone ? (
                      <FormErrorMessage>
                        {`${errors?.userHomePhone?.message}`}
                      </FormErrorMessage>
                    ) : null}
                  </FormControl>
                </GridItem>
                <GridItem colSpan={{ base: 1, lg: 6 }}>
                  <FormControl
                    isRequired={true}
                    isInvalid={!!errors?.userMobilePhone}
                  >
                    <FormLabel>Mobile Phone</FormLabel>
                    <Input
                      type={"text"}
                      bgColor={"lightBlueLogo"}
                      {...register("userMobilePhone", { required: true })}
                    />
                    {errors?.userMobilePhone ? (
                      <FormErrorMessage>
                        {`${errors?.userMobilePhone?.message}`}
                      </FormErrorMessage>
                    ) : null}
                  </FormControl>
                </GridItem>
                <GridItem colSpan={{ base: 1, lg: 12 }}>
                  <FormControl
                    isRequired={true}
                    isInvalid={!!errors?.userHomeAddress}
                  >
                    <FormLabel>Home Address</FormLabel>
                    <Input
                      type={"text"}
                      bgColor={"lightBlueLogo"}
                      {...register("userHomeAddress", { required: true })}
                    />
                    {errors?.userHomeAddress ? (
                      <FormErrorMessage>
                        {`${errors?.userHomeAddress?.message}`}
                      </FormErrorMessage>
                    ) : null}
                  </FormControl>
                </GridItem>
                <GridItem colSpan={{ base: 1, lg: 4 }}>
                  <FormControl
                    isRequired={true}
                    isInvalid={!!errors?.userCitySuburb}
                  >
                    <FormLabel>City / Suburb</FormLabel>
                    <Input
                      type={"text"}
                      bgColor={"lightBlueLogo"}
                      {...register("userCitySuburb", { required: true })}
                    />
                    {errors?.userCitySuburb ? (
                      <FormErrorMessage>
                        {`${errors?.userCitySuburb?.message}`}
                      </FormErrorMessage>
                    ) : null}
                  </FormControl>
                </GridItem>
                <GridItem colSpan={{ base: 1, lg: 4 }}>
                  <FormControl
                    isRequired={false}
                    isInvalid={!!errors?.userState}
                  >
                    <FormLabel>State</FormLabel>
                    <Select
                      bgColor={"lightBlueLogo"}
                      {...register(`userState`)}
                    >
                      <option value="">(none)</option>
                      <option value="victoria">Victoria</option>
                      <option value="newSouthWales">New South Wales</option>
                      <option value="southAustralia">South Australia</option>
                      <option value="queensland">Queensland</option>
                      <option value="westernAustralia">
                        Western Australia
                      </option>
                      <option value="tasmania">Tasmania</option>
                      <option value="australianCapitalTerritory">
                        Australian Capital Territory
                      </option>
                      <option value="northernTerritory">
                        Northern Territory
                      </option>
                      <option value="newZealand">New Zealand</option>
                    </Select>
                    {errors?.userState ? (
                      <FormErrorMessage>
                        {`${errors?.userState?.message}`}
                      </FormErrorMessage>
                    ) : null}
                  </FormControl>
                </GridItem>
                <GridItem colSpan={{ base: 1, lg: 4 }}>
                  <FormControl
                    isRequired={true}
                    isInvalid={!!errors?.userPostcode}
                  >
                    <FormLabel>Postcode</FormLabel>
                    <Input
                      type={"text"}
                      bgColor={"lightBlueLogo"}
                      {...register("userPostcode", { required: true })}
                    />
                    {errors?.userPostcode ? (
                      <FormErrorMessage>
                        {`${errors?.userPostcode?.message}`}
                      </FormErrorMessage>
                    ) : null}
                  </FormControl>
                </GridItem>
                <GridItem colSpan={{ base: 1, lg: 12 }}>
                  <Divider my={"2rem"} />
                  <Flex justifyContent={"end"}>
                    <Button
                      bgColor={"darkBlueLogo"}
                      rounded={"0"}
                      type={"submit"}
                      color={"white"}
                      textTransform={"uppercase"}
                      px={"1.8rem"}
                      opacity={formReady ? 1 : 0.5}
                      leftIcon={
                        isSubmitting ? (
                          <Flex minWidth={"1.5rem"} justifyContent={"center"}>
                            <Spinner />
                          </Flex>
                        ) : (
                          <Flex minWidth={"1.5rem"}>
                            <Icon as={HiOutlinePencil} />
                          </Flex>
                        )
                      }
                    >
                      <chakra.span>Confirm Details</chakra.span>
                    </Button>
                  </Flex>
                </GridItem>
              </Grid>
            </chakra.fieldset>
          </chakra.form>
        </Flex>
      </Container>
    </Flex>
  );
}
