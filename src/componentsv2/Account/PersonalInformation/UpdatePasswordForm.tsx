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
import PasswordStrengthBar from "react-password-strength-bar";

export default function UpdatePasswordForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validationSchema = object({
    currentPassword: string().required("Current Password is Required"),
    newPassword: string()
      .min(8, "Password must be at least 8 characters long")
      .max(150, "Password must be less than 150 characters")
      .test(
        "password-strength",
        "Password must meet minimum strength requirements. Choose a stronger password.",
        (value) => {
          return passwordStrength >= 1;
        }
      )
      .required("Password is required"),
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
  const newPassword = watch("newPassword");
  const [passwordStrength, setPasswordStrength] = useState(-1);

  const updatePasswordQuery = gql`
    mutation UpdatePassword($currentPassword: String!, $newPassword: String!) {
      updatePassword(
        currentPassword: $currentPassword
        newPassword: $newPassword
        confirmPassword: $newPassword
      )
    }
  `;
  const toast = useToast();
  const formSubmit = useMutation(
    (newData: any) => sendData(updatePasswordQuery, newData),
    {
      onSuccess: (data, variables, context) => {
        toast({
          title: "Password updated successfully",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
        setIsSubmitting(false);
      },
      onError: (error, variables, context) => {
        console.log(error);
        toast({
          title: "Error - Something went wrong",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
        setIsSubmitting(false);
      },
    }
  );
  const onSubmit = (data) => {
    setIsSubmitting(true);
    const formValues = getValues();
    formSubmit.mutate({
      ...formValues,
    });
  };
  const formReady = !isSubmitting;

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate={true}>
      <fieldset disabled={!formReady}>
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
              isRequired={true}
              isInvalid={!!errors?.currentPassword}
            >
              <FormLabel fontSize={{ base: "13px", md: "14px" }}>
                Current Password
              </FormLabel>
              <Input
                type={"password"}
                //bgColor={"lightBlueLogo"}
                placeholder="Enter current password"
                fontSize={{ base: "13px", md: "14px" }}
                {...register(`currentPassword`, { required: true })}
              />
              {errors?.currentPassword?.message ? (
                <FormHelperText color={"red"}>
                  {errors.currentPassword.message.toString()}
                </FormHelperText>
              ) : null}
            </FormControl>
          </GridItem>
          <GridItem colSpan={{ base: 1, lg: 6 }}>
            <FormControl
              as={"fieldset"}
              isRequired={true}
              isInvalid={!!errors?.newPassword}
            >
              <FormLabel fontSize={{ base: "13px", md: "14px" }}>
                New Password
              </FormLabel>
              <Input
                type={"password"}
                //bgColor={"lightBlueLogo"}
                placeholder="Enter new password"
                fontSize={{ base: "13px", md: "14px" }}
                {...register(`newPassword`, { required: true })}
              />
              <FormHelperText
                fontSize={{ base: "13px", md: "14px" }}
                color={"gray.500"}
                mb={"0.5rem"}
              >
                New Password Strength
              </FormHelperText>
              <PasswordStrengthBar
                password={newPassword}
                minLength={8}
                scoreWords={["weak", "okay", "good", "strong", "stronger"]}
                shortScoreWord={"weak"}
                scoreWordStyle={
                  newPassword ? { color: null } : { color: "transparent" }
                }
                onChangeScore={(score) => setPasswordStrength(score)}
              />
              {errors?.newPassword?.message ? (
                <FormHelperText
                  color={"red"}
                  fontSize={{ base: "13px", md: "14px" }}
                >
                  {errors.newPassword.message.toString()}
                </FormHelperText>
              ) : null}
            </FormControl>
          </GridItem>
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
                <chakra.span fontSize={{ base: "12px", md: "13px" }}>
                  Update Password
                </chakra.span>
              </Button>
            </Flex>
          </GridItem>
        </Grid>
      </fieldset>
    </form>
  );
}
