//@ts-nocheck
import { gql } from "graphql-request";
import useQueryHook, { sendData } from "hooks/useQueryHook";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import {
  Box,
  Button,
  chakra,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Grid,
  GridItem,
  Input,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import { HiOutlinePencil } from "react-icons/hi2";
import { yupResolver } from "@hookform/resolvers/yup";
import { object, string } from "yup";

export default function ResetEmailForm() {
  const viewerProfilePersonalEmailQuery = gql`
    query Viewer {
      viewer {
        ... on User {
          id
          email
        }
      }
    }
  `;
  const profilePersonalEmailResult = useQueryHook(
    ["viewerProfilePersonalEmailQuery"],
    viewerProfilePersonalEmailQuery,
  );
  const viewerValues = profilePersonalEmailResult?.data?.viewer;

  const [isSubmitting, setIsSubmitting] = useState(false);
  //default Values must be whole object
  const validationSchema = object({
    email: string().required("Email is Required").email("Email must be valid"),
  });
  const formOptions = {
    resolver: yupResolver(validationSchema),
    mode: "onBlur" as "onBlur",
  };
  const {
    watch,
    getValues,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm(formOptions);
  const updateEmailAddressQuery = gql`
    mutation updateEmailAddressQuery($id: ID!, $email: String!) {
      userSendVerifyNewEmail(id: $id, email: $email)
    }
  `;
  const toast = useToast();
  const formSubmit = useMutation(
    (newData: any) => sendData(updateEmailAddressQuery, newData),
    {
      onSuccess: (data, variables, context) => {
        toast({
          title:
            "An email has been sent to your new email address. Please check your inbox to confirm the change.",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
        setIsSubmitting(false);
      },
      onError: (error, variables, context) => {
        toast({
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
    setIsSubmitting(true);
    const formValues = getValues();
    formSubmit.mutate({
      id: viewerValues?.id,
      ...formValues,
    });
  };
  const formReady = !profilePersonalEmailResult.isLoading && !isSubmitting;

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate={true}>
      <chakra.fieldset disabled={!formReady}>
        <Grid
          templateColumns={{
            base: "repeat(1, 1fr)",
            lg: "repeat(12, 1fr)",
          }}
          gap={"1rem"}
        >
          <GridItem colSpan={{ base: 1, lg: 6 }}>
            <FormControl
              as={"fieldset"}
              isRequired={false}
              isReadOnly={true}
              isInvalid={!!errors?.currentEmail}
            >
              <FormLabel fontSize={{ base: "13px", md: "14px" }}>
                Your Current Email
              </FormLabel>
              <Input
                type={"text"}
                //bgColor={"lightBlueLogo"}
                defaultValue={viewerValues?.email}
                {...register(`currentEmail`, { required: false })}
                fontSize={{ base: "13px", md: "14px" }}
              />
              {errors?.currentEmail?.message ? (
                <FormHelperText color={"red"}>
                  {errors.currentEmail.message.toString()}
                </FormHelperText>
              ) : null}
            </FormControl>
          </GridItem>
          <GridItem colSpan={{ base: 1, lg: 6 }}>
            <FormControl
              as={"fieldset"}
              isRequired={true}
              isInvalid={!!errors?.email}
            >
              <FormLabel fontSize={{ base: "13px", md: "14px" }}>
                Enter New Email
              </FormLabel>
              <Input
                type={"email"}
                //bgColor={"lightBlueLogo"}
                placeholder={"Enter New Email"}
                {...register(`email`, { required: true })}
                fontSize={{ base: "13px", md: "14px" }}
              />
              {errors?.email?.message ? (
                <FormHelperText color={"red"}>
                  {errors.email.message.toString()}
                </FormHelperText>
              ) : null}
              <Box my={"1rem"}>
                <Text color={"grey"} fontSize={{ base: "13px", md: "14px" }}>
                  <chakra.strong>
                    New email addresses need to be verified:
                  </chakra.strong>
                </Text>
                <Text color={"grey"} fontSize={{ base: "13px", md: "14px" }}>
                  You will receive an email at the address you entered, click
                  the link in the email to verify.
                </Text>
              </Box>
            </FormControl>
          </GridItem>
          <GridItem
            colSpan={{ base: 1, lg: 6 }}
            display={{ base: "none", lg: null }}
          />
          <GridItem colSpan={{ base: 1, lg: 12 }}>
            <Flex width={"100%"} justifyContent={"flex-end"}>
              <Button
                size={{ base: "sm", md: "md" }}
                bgColor={"scBlack"}
                rounded={"0"}
                type={"submit"}
                color={"white"}
                textTransform={"uppercase"}
                w={{ base: "50%", md: "30%", xl: "20%" }}
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
                <chakra.span fontSize={{ base: "12px", md: "13px" }}>
                  Update Email
                </chakra.span>
              </Button>
            </Flex>
          </GridItem>
        </Grid>
      </chakra.fieldset>
    </form>
  );
}
