// @ts-nocheck
import {
  Flex,
  Container,
  Heading,
  Spacer,
  chakra,
  FormLabel,
  FormControl,
  Input,
  Button,
  useToast,
  Spinner,
  FormHelperText,
  FormErrorMessage,
  Text,
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import FullHeightLoadingSpinner from "components/FullHeightLoadingSpinner";
import ResendActivationEmailForm from "components/Signin/ResendActivationEmailForm";
import { error } from "console";
import { set } from "date-fns";
import { gql, GraphQLClient } from "graphql-request";
import { setPassword } from "helpers/mutations";
import { isStaff } from "helpers/Permissions";
import useQueryHook, { publicApiHook } from "hooks/useQueryHook";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import PasswordStrengthBar from "react-password-strength-bar";
import * as Yup from "yup";

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

  const router = useRouter();
  const toast = useToast();
  const toastIdRef = useRef<any>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();
  const { data: session } = useSession();

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

  const setPasswordMutation = gql`
    mutation setPasswordReturnUser(
      $code: String!
      $id: String!
      $password: String!
    ) {
      setPasswordReturnUser(code: $code, id: $id, password: $password)
    }
  `;
  const handleSetPassword = async (details) => {
    const graphQLClient = new GraphQLClient(process.env.NEXT_PUBLIC_ENDPOINT, {
      headers: {
        Authorization: process.env.NEXT_PUBLIC_TOKEN,
      },
    });
    const result = await graphQLClient.request(setPasswordMutation, {
      code,
      id,
      password: details.password,
    });
    //console.log("result", result)

    return result;
  };
  const setPasswordResult = useMutation(
    (newData: any) => handleSetPassword(newData),
    {
      onMutate: () => {
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
              Setting Password...
              <Spinner color="white" />
            </Flex>
          ),
          duration: 100000,
          isClosable: true,
        });
      },
      onError: (err) => {
        toast.update(toastIdRef.current, {
          description: "Couldn't Set Password",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        console.log("error", err);
        setIsSubmitting(false);
      },
      onSuccess: () => {
        toast.update(toastIdRef.current, {
          description: "Successfully Set Password. Just a moment...",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      },
    },
  );
  const formReady = !isSubmitting;
  const validationSchema = Yup.object().shape({
    id: Yup.string().required("Id is missing. Please resend activation email."),
    code: Yup.string().required(
      "Code is missing. Please resend activation email.",
    ),
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
  const defaultValues = {
    id,
    code,
    password: "",
  };
  const {
    watch,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: "onBlur" as "onBlur",
    defaultValues: defaultValues,
  });

  const password = watch("password");
  const [passwordStrength, setPasswordStrength] = useState(0);

  const onSubmit = async (data) => {
    try {
      const result = await setPasswordResult.mutateAsync(data);
      const email = result?.setPasswordReturnUser;

      const res = await signIn("credentials", {
        redirect: false,
        email: email,
        password: data.password,
        type: "ignore",
      });

      if (res.ok) {
        // all fine
      } else {
        throw new Error("Invalid Credentials");
      }
    } catch (error) {}
  };

  // On login redirect to dashboard if staff, or setup-account/details if patient
  useEffect(() => {
    if (session) {
      if (isStaff(session?.groups)) {
        router.push("/dashboard");
      } else {
        router.push("/setup-account/details");
      }
    }
  }, [session]);

  const isLoading = isVerificationCodeValidForUserResult.isLoading;
  const isValid =
    isVerificationCodeValidForUserResult.data?.isVerificationCodeValidForUser ||
    false;

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
          padding={{ base: "1rem" }}
          bgColor={"white"}
          borderRadius={"6px"}
          flexDirection={"column"}
          my={{ base: "2rem", lg: "5rem" }}
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
            <>
              <ResendActivationEmailForm />
            </>
          ) : (
            <>
              <Heading
                color={"primary"}
                textTransform={"uppercase"}
                textAlign={"center"}
                fontSize={"2rem"}
                mb={"0.5rem"}
                as={"h1"}
              >
                Welcome
              </Heading>
              <Heading textAlign={"center"} fontSize={"1.1rem"} as={"h2"}>
                To begin choose a password
              </Heading>
              <Spacer my={"1rem"} />
              <chakra.form
                noValidate={true}
                onSubmit={handleSubmit(onSubmit)}
                width={"100%"}
              >
                <chakra.fieldset disabled={!formReady}>
                  <Flex gap={"1rem"} flexDirection={"column"}>
                    <FormControl
                      isRequired={true}
                      isInvalid={!!errors?.password}
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
                      <FormLabel>Password</FormLabel>
                      <Input
                        type={"password"}
                        bgColor={"lightBlueLogo"}
                        {...register(`password`, { required: true })}
                      />
                      {errors?.password ? (
                        <FormErrorMessage>
                          {`${errors?.password?.message}`}
                        </FormErrorMessage>
                      ) : null}
                    </FormControl>
                    <Flex flexDirection={"column"}>
                      <FormControl isRequired={true} isInvalid={!!errors?.id}>
                        <Input
                          type={"hidden"}
                          {...register(`id`, { required: true })}
                        />
                        {errors?.id ? (
                          <FormErrorMessage>
                            {`${errors?.id?.message}`}
                          </FormErrorMessage>
                        ) : null}
                      </FormControl>
                      <FormControl isRequired={true} isInvalid={!!errors?.code}>
                        <Input
                          type={"hidden"}
                          {...register(`code`, { required: true })}
                        />
                        {errors?.code ? (
                          <FormErrorMessage>
                            {`${errors?.code?.message}`}
                          </FormErrorMessage>
                        ) : null}
                      </FormControl>
                    </Flex>

                    <Flex justifyContent={"end"}>
                      <Button
                        bgColor={"darkBlueLogo"}
                        rounded={"0"}
                        type={"submit"}
                        color={"white"}
                        textTransform={"uppercase"}
                        px={"1.8rem"}
                      >
                        Confirm
                      </Button>
                    </Flex>
                  </Flex>
                </chakra.fieldset>
              </chakra.form>
            </>
          )}
        </Flex>
      </Container>
    </Flex>
  );
}

SetupAccountPassword.auth = {
  public: true,
};
