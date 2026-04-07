// @ts-nocheck
import {
  useToast,
  Flex,
  Spinner,
  Stack,
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Container,
  Heading,
  chakra,
  FormErrorMessage,
  Spacer,
  Box,
  FormHelperText,
  Link,
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import { gql, GraphQLClient } from "graphql-request";
import { publicApiHook, sendData } from "hooks/useQueryHook";
import { signIn } from "next-auth/react";
import { Head } from "next/document";
import { useV2Router } from "componentsv2/Dashboard/Helpers/routerHelpers";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { object, string } from "yup";
import PasswordStrengthBar from "react-password-strength-bar";
import * as Yup from "yup";
import NextLink from "next/link";
import FullHeightLoadingSpinner from "componentsv2/FullHeightLoadingSpinner";

export async function getServerSideProps({ query }) {
  const { code, id } = query;

  if (!code || !id) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      code,
      id,
    },
  };
}

type SetupAccountPasswordProps = {
  code: string;
  id: string;
};

export default function SetupAccountPassword({
  code,
  id,
}: SetupAccountPasswordProps) {
  if (!code || !id) return null;

  const router = useV2Router();
  const toast = useToast();
  const toastIdRef = useRef<any>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isVerificationCodeValidForUserQuery = gql`
    query isVerificationCodeValidForUser($code: String!, $userId: String!) {
      isVerificationCodeValidForUser: isVerificationCodeValidForUser(
        code: $code
        userId: $userId
      )
    }
  `;
  const isVerificationCodeValidForUserResult = publicApiHook(
    ["isVerificationCodeValidForUser"],
    isVerificationCodeValidForUserQuery,
    { code: code, userId: id },
    { enabled: true },
  );

  const isLoading = isVerificationCodeValidForUserResult.isLoading;
  const isValid =
    isVerificationCodeValidForUserResult.data?.isVerificationCodeValidForUser ||
    false;

  const setPasswordMutation = gql`
    mutation setPassword($code: String!, $id: String!, $password: String!) {
      setPassword(code: $code, id: $id, password: $password)
    }
  `;

  const useSetPasswordMutation = async (details) => {
    try {
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
            <chakra.span>Setting Password...</chakra.span>
            <Spinner color="white" />
          </Flex>
        ),
        duration: 9000,
        isClosable: true,
      });
      const graphQLClient = new GraphQLClient(
        process.env.NEXT_PUBLIC_ENDPOINT,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      const data = await graphQLClient.request(setPasswordMutation, {
        password: details.password,
        code,
        id,
      });
      toast.update(toastIdRef.current, {
        title: "Success - Please login with your new password",
        status: "success",
        duration: 10000,
        isClosable: true,
      });
      setTimeout(() => {
        router.push("/pagesv2/signin");
      }, 2000);
    } catch (error) {
      setIsSubmitting(false);
      //console.log(error)
      toastIdRef.current = toast({
        title: "Error",
        description: "Error - something went wrong",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  const validationSchema = object({
    password: Yup.string()
      .min(8, "Password must be at least 8 characters long")
      .max(150, "Password must be less than 150 characters")
      .test(
        "password-strength",
        "Password must meet minimum strength requirements. Choose a stronger password.",
        (value) => {
          return passwordStrength >= 1;
        },
      )
      .required("Password is required"),
  });
  const formOptions = {
    resolver: yupResolver(validationSchema),
    mode: "onBlur" as "onBlur",
  };
  const {
    watch,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm(formOptions);

  const password = watch("password");
  const [passwordStrength, setPasswordStrength] = useState(0);

  const onSubmit = async (data) => {
    await useSetPasswordMutation(data);
  };

  return (
    <Flex
      direction={"column"}
      width={"100vw"}
      align={"center"}
      justify={"center"}
      minHeight={"70vh"}
      bgColor={"lgDarkBlueLogo"}
    >
      <Container size={"main"} maxWidth={"600px"} py={"2rem"}>
        <Flex
          w={"100%"}
          padding={"24px"}
          bgColor={"white"}
          borderRadius={"6px"}
          my={"5rem"}
        >
          {isLoading ? (
            <Flex
              justifyContent={"center"}
              align="center"
              height={"400px"}
              width={"100%"}
            >
              <FullHeightLoadingSpinner />
            </Flex>
          ) : !isValid ? (
            <Flex
              justifyContent={"center"}
              align="center"
              flexDirection={"column"}
              width={"100%"}
            >
              <Heading
                color={"primary"}
                textTransform={"uppercase"}
                textAlign={"center"}
                fontSize={"1.5rem"}
                mb={"0.5rem"}
                as={"h1"}
              >
                Reset Password
              </Heading>
              <Heading textAlign={"center"} fontSize={"1.2rem"} as={"h2"}>
                This link is invalid or has expired. Please request a new
                password reset link.
              </Heading>
              <Spacer my={"1rem"} />
              <Link href={"/pagesv2/forgot-password"} as={NextLink}>
                <Button
                  bgColor={"darkBlueLogo"}
                  rounded={"0"}
                  color={"white"}
                  textTransform={"uppercase"}
                  px={"1.8rem"}
                >
                  {"<<"} Return to Forgot Password
                </Button>
              </Link>
            </Flex>
          ) : (
            <chakra.form
              onSubmit={handleSubmit(onSubmit)}
              width={"100%"}
              noValidate={true}
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
                    Reset Password
                  </Heading>
                  <Heading textAlign={"center"} fontSize={"1.1rem"} as={"h2"}>
                    Enter your new password below
                  </Heading>
                  <Spacer my={"1rem"} />
                  <Box mb={"1rem"}>
                    <FormControl
                      isRequired={true}
                      isInvalid={!!errors.password}
                    >
                      <FormHelperText
                        fontSize={"0.8rem"}
                        color={"gray.500"}
                        mb={"0.5rem"}
                      >
                        Password Strength
                      </FormHelperText>
                      <PasswordStrengthBar
                        password={password}
                        minLength={8}
                        scoreWords={[
                          "weak",
                          "okay",
                          "good",
                          "strong",
                          "very strong",
                        ]}
                        shortScoreWord={"weak"}
                        scoreWordStyle={
                          password ? { color: null } : { color: "transparent" }
                        }
                        onChangeScore={(score) => setPasswordStrength(score)}
                      />
                      <FormLabel>New Password</FormLabel>
                      <Input
                        type={"password"}
                        bgColor={"lightBlueLogo"}
                        {...register("password")}
                      />
                      {errors?.password?.message ? (
                        <FormErrorMessage>
                          {`${errors.password.message}`}
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
                      {isSubmitting ? <Spinner /> : "Submit"}
                    </Button>
                  </Flex>
                </Flex>
              </fieldset>
            </chakra.form>
          )}
        </Flex>
      </Container>
    </Flex>
  );
}

SetupAccountPassword.auth = {
  public: true,
};
