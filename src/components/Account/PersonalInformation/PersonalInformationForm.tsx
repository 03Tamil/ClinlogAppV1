import {
  Button,
  Text,
  chakra,
  Divider,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Grid,
  GridItem,
  Input,
  Select,
  Spinner,
  useToast,
} from "@chakra-ui/react"
import { HiOutlinePencil } from "react-icons/hi2"
import { gql } from "graphql-request"
import useQueryHook, { sendData } from "hooks/useQueryHook"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useMutation, useQuery } from "@tanstack/react-query"
import { yupResolver } from "@hookform/resolvers/yup"
import { object, string, date } from "yup"
import { useSession } from "next-auth/react"

export default function PersonalInformationForm() {
  const { data: session } = useSession()

  const viewerProfilePersonalInformationQuery = gql`
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
        }
      }
    }
  `

  const profilePersonalInformationResult = useQueryHook(
    ["viewerProfilePersonalInformation"],
    viewerProfilePersonalInformationQuery
  )
  const viewerValues = (profilePersonalInformationResult?.data as any)?.viewer

  const [isSubmitting, setIsSubmitting] = useState(false)

  const isPatient = !!session.groups?.includes("Patient")
  const validationSchema = object(
    isPatient
      ? {
          fullName: string().required("Full Name is Required"),
          userDateOfBirth: date().required("Date of Birth is Required").typeError(
            "Date of Birth must be a valid date"
          ),
          userHomeAddress: string().required("Home Address is Required"),
          userCitySuburb: string().required("City/Suburb is Required"),
          userPostcode: string().required("Postcode is Required"),
          // Require either userHomePhone or userMobilePhone
          userHomePhone: string().required("Home Phone is Required"),
          userMobilePhone: string().required("Mobile Phone is Required"),
        }
      : {
          fullName: string().required("Full Name is Required"),
        }
  )

  const defaultValues = {
    ...viewerValues,
    userDateOfBirth: viewerValues?.userDateOfBirth
      ? new Date(viewerValues.userDateOfBirth).toISOString().split("T")[0]
      : "",
  }
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
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: defaultValues,
    mode: "onBlur" as "onBlur",
  })

  const updateProfilePersonalInformationMutation = gql`
    mutation UpdateViewer(
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
        }
      }
    }
  `

  const toast = useToast()
  const formSubmit = useMutation(
    (newData: any) =>
      sendData(updateProfilePersonalInformationMutation, newData),
    {
      onSuccess: (data, variables, context) => {
        toast({
          title: "Your personal information has been updated",
          status: "success",
          duration: 9000,
          isClosable: true,
        })
        setIsSubmitting(false)
      },
      onError: (error, variables, context) => {
        toast({
          title: "Error - Something went wrong",
          status: "error",
          duration: 9000,
          isClosable: true,
        })
        setIsSubmitting(false)
      },
    }
  )
  const onSubmit = (data) => {
    // Get rid of nulls
    const formValues = Object.fromEntries(
      Object.entries(data).filter(([_, v]) => v != null)
    )

    setIsSubmitting(true)
    formSubmit.mutate({
      ...formValues,
    })
  }
  const formReady = !profilePersonalInformationResult.isLoading && !isSubmitting

  // Reset form on load
  useEffect(() => {
    reset(defaultValues, {
        keepDirtyValues: false,
        keepDefaultValues: false,
    })
  }, [formReady])

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
          <GridItem colSpan={{ base: 1, lg: 2 }}>
            <FormControl
              as={"fieldset"}
              isRequired={false}
              isInvalid={!!errors?.userTitle}
            >
              <FormLabel as={"legend"}>Title</FormLabel>
              <Select
                {...register(`userTitle`, {})}
                bgColor={"lightBlueLogo"}
                defaultValue={viewerValues?.userTitle}
              >
                <option value="">(none)</option>
                <option value="Mr">Mr.</option>
                <option value="Mrs">Mrs.</option>
                <option value="Ms">Ms.</option>
                <option value="Miss">Miss.</option>
                <option value="Mstr">Mstr.</option>
                <option value="Dr">Dr.</option>
              </Select>
              {errors?.userTitle?.message ? (
                <FormHelperText color={"red"}>
                  {errors.userTitle.message.toString()}
                </FormHelperText>
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
              {errors?.fullName?.message ? (
                <FormHelperText color={"red"}>
                  {errors.fullName.message.toString()}
                </FormHelperText>
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
              {errors?.userPreferredName?.message ? (
                <FormHelperText color={"red"}>
                  {errors.userPreferredName.message.toString()}
                </FormHelperText>
              ) : null}
            </FormControl>
          </GridItem>
          <GridItem colSpan={{ base: 1, lg: 4 }}>
            <FormControl
              isRequired={isPatient}
              isInvalid={!!errors?.userDateOfBirth}
            >
              <FormLabel>Date of Birth</FormLabel>
              <Input
                type={"date"}
                bgColor={"lightBlueLogo"}
                {...register("userDateOfBirth", {
                  valueAsDate: true,
                  required: isPatient,
                })}
              />
              {errors?.userDateOfBirth?.message ? (
                <FormHelperText color={"red"}>
                  {errors.userDateOfBirth.message.toString()}
                </FormHelperText>
              ) : null}
            </FormControl>
          </GridItem>
          <GridItem colSpan={{ base: 1, lg: 8 }}>
            <FormControl
              isRequired={false}
              isInvalid={!!errors?.userDentalInsuranceFund}
            >
              <FormLabel>Dental Insurance Fund Name (If Applicable)</FormLabel>
              <Input
                type={"text"}
                bgColor={"lightBlueLogo"}
                {...register("userDentalInsuranceFund")}
              />
              {errors?.userDentalInsuranceFund?.message ? (
                <FormHelperText color={"red"}>
                  {errors.userDentalInsuranceFund.message.toString()}
                </FormHelperText>
              ) : null}
            </FormControl>
          </GridItem>
          <GridItem colSpan={{ base: 1, lg: 12 }}>
            <Divider my={"0.5rem"} />
          </GridItem>
          <GridItem colSpan={{ base: 1, lg: 12 }}>
            <FormControl
              isRequired={isPatient}
              isInvalid={!!errors?.userHomeAddress}
            >
              <FormLabel>Home Address</FormLabel>
              <Input
                type={"text"}
                bgColor={"lightBlueLogo"}
                {...register("userHomeAddress", { required: isPatient })}
              />
              {errors?.userHomeAddress?.message ? (
                <FormHelperText color={"red"}>
                  {errors.userHomeAddress.message.toString()}
                </FormHelperText>
              ) : null}
            </FormControl>
          </GridItem>
          <GridItem colSpan={{ base: 1, lg: 4 }}>
            <FormControl
              isRequired={isPatient}
              isInvalid={!!errors?.userCitySuburb}
            >
              <FormLabel>City / Suburb</FormLabel>
              <Input
                type={"text"}
                bgColor={"lightBlueLogo"}
                {...register("userCitySuburb", { required: isPatient })}
              />
              {errors?.userCitySuburb?.message ? (
                <FormHelperText color={"red"}>
                  {errors.userCitySuburb.message.toString()}
                </FormHelperText>
              ) : null}
            </FormControl>
          </GridItem>
          <GridItem colSpan={{ base: 1, lg: 4 }}>
            <FormControl
              isRequired={isPatient}
              isInvalid={!!errors?.userPostcode}
            >
              <FormLabel>Postcode</FormLabel>
              <Input
                type={"text"}
                bgColor={"lightBlueLogo"}
                {...register("userPostcode", { required: isPatient })}
              />
              {errors?.userPostcode?.message ? (
                <FormHelperText color={"red"}>
                  {errors.userPostcode.message.toString()}
                </FormHelperText>
              ) : null}
            </FormControl>
          </GridItem>
          <GridItem colSpan={{ base: 1, lg: 4 }}>
            <FormControl isRequired={false} isInvalid={!!errors?.userState}>
              <FormLabel>State</FormLabel>
              <Select
                bgColor={"lightBlueLogo"}
                defaultValue={viewerValues?.userState}
                {...register(`userState`)}
              >
                <option value="">(none)</option>
                <option value="victoria">Victoria</option>
                <option value="newSouthWales">New South Wales</option>
                <option value="southAustralia">South Australia</option>
                <option value="queensland">Queensland</option>
                <option value="westernAustralia">Western Australia</option>
                <option value="tasmania">Tasmania</option>
                <option value="australianCapitalTerritory">
                  Australian Capital Territory
                </option>
                <option value="northernTerritory">Northern Territory</option>
                <option value="newZealand">New Zealand</option>
              </Select>
              {errors?.userState?.message ? (
                <FormHelperText color={"red"}>
                  {errors.userState.message.toString()}
                </FormHelperText>
              ) : null}
            </FormControl>
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
                {...register("userHomePhone", { required: isPatient })}
              />
              {errors?.userHomePhone?.message ? (
                <FormHelperText color={"red"}>
                  {errors.userHomePhone.message.toString()}
                </FormHelperText>
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
                {...register("userMobilePhone", { required: isPatient })}
              />
              {errors?.userMobilePhone?.message ? (
                <FormHelperText color={"red"}>
                  {errors.userMobilePhone.message.toString()}
                </FormHelperText>
              ) : null}
            </FormControl>
          </GridItem>
          <GridItem colSpan={{ base: 1, lg: 12 }}>
            <Flex width={"100%"} justifyContent={"flex-end"}>
              <Button
                bgColor={"darkBlueLogo"}
                rounded={"0"}
                type={"submit"}
                color={"white"}
                textTransform={"uppercase"}
                px={"1.8rem"}
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
                <chakra.span>Update Details</chakra.span>
              </Button>
            </Flex>
          </GridItem>
        </Grid>
      </fieldset>
    </form>
  )
}
