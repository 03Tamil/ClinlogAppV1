import {
  chakra,
  Button,
  Flex,
  Heading,
  Icon,
  Text,
  Input,
  FormControl,
  FormLabel,
  Container,
  HStack,
  PinInput,
  PinInputField,
  FormErrorMessage,
  useToast,
  Spinner,
  Link,
  Spacer,
  Box,
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import FullscreenLoadingSpinner from "componentsv2/FullscreenLoadingSpinner";
import { signIn, useSession } from "next-auth/react";
import { useV2Router } from "componentsv2/Dashboard/Helpers/routerHelpers";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { GoMail } from "react-icons/go";
import NextLink from "next/link";
import * as Yup from "yup";

export async function getServerSideProps(context) {
  const { id, magicCode } = context.query;
  return {
    props: {
      id: id ?? null,
      magicCode: magicCode ?? null,
    },
  };
}

export default function AuthSignin({
  id,
  magicCode,
}: {
  id: string;
  magicCode: string;
}) {
  const { data: session } = useSession();
  const router = useV2Router();

  /* const [magicCodeState, setMagicCodeState] = useState("")
  const [userIdState, setUserIdState] = useState("") */
  /* async function logUserWithCode() {
    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: userIdState,
        password: Number(magicCodeState),
        type: "magicLinkSignIn",
      })

      if (res.ok) {
        router.push("/pagesv2/dashboard")
      } else {
        throw new Error("Invalid Credentials")
      }
    } catch (err) {
      router.push("/pagesv2/404?error=" + err)
    }
  } */
  /* useEffect(() => {
    async function logUser() {
      try {
        const res = await signIn("credentials", {
          redirect: false,
          email: id,
          password: magicCode,
          type: "magicLinkSignIn",
        })

        if (res.ok) {
          router.push("/pagesv2/dashboard")
        } else {
          throw new Error("Invalid Credentials")
        }
      } catch (err) {
        router.push("/pagesv2/404?error=" + err)
      }
    }
    if (!!session) {
      router.push("/pagesv2/")
    } else {
      if (!!magicCode && !!id) {
        logUser()
      }
    }
  }, [id, magicCode]) */

  // Send to error page if no id
  if (!id) {
    router.push("/pagesv2/403");
  }

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [autoSubmit, setAutoSubmit] = useState(false);

  const validationSchema = Yup.object({
    id: Yup.string().required("Id is required"),
    magicCode: Yup.string()
      .required("Code is required")
      .min(6, "Code must be 6 digits")
      .max(6, "Code must be 6 digits"),
  });
  const {
    reset,
    setValue,
    getValues,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      id: id ?? "",
      magicCode: magicCode ?? "",
    },
  });

  // Fill out 6 digit code if provided
  useEffect(() => {
    if (!!id && !!magicCode) {
      setValue("magicCode", magicCode);
      setAutoSubmit(true);
    }
  }, [magicCode]);

  // Submit form if 6 digit code is provided
  useEffect(() => {
    if (autoSubmit) {
      handleSubmit((data) => {
        onSubmit(data);
      })();
    }
  }, [autoSubmit]);

  const toast = useToast();
  const toastIdRef = useRef<any>();
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    const formValues = getValues();
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
            <chakra.span>Logging in...</chakra.span>
            <Spinner color="white" />
          </Flex>
        ),
        duration: 9000,
        isClosable: true,
      });
      const res = await signIn("credentials", {
        redirect: false,
        email: formValues.id,
        password: Number(formValues.magicCode),
        type: "magicLinkSignIn",
      });
      if (res.ok) {
        toast.update(toastIdRef.current, {
          title: "Success",
          description: "Successfully logged in",
          status: "success",
          duration: 2000,
          isClosable: true,
        });

        const redirectPath =
          typeof router.query.redirect === "string"
            ? router.query.redirect
            : "/";
        router.push(redirectPath);
      } else {
        throw new Error("Invalid Credentials");
      }
    } catch (error) {
      setIsSubmitting(false);
      toast.update(toastIdRef.current, {
        title: "Error",
        description: `Error - ${error.message}`,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  return (
    <Flex
      direction={"column"}
      width={"100%"}
      height={"100vh"}
      alignItems={"center"}
      justifyContent={"center"}
      justify={"flex-start"}
      bg={"rgba(226, 239, 252, 0.95)"}
      overflow="hidden"
    >
      <Box
        position="absolute"
        top="0"
        left="0"
        width="100%"
        height="100%"
        bgImage={"/fingerprint_img.jpg"}
        backgroundSize="cover"
        backgroundPosition="center"
        backgroundBlendMode="overlay"
        opacity={0.2}
        zIndex="0"
      />
      <Flex
        position="relative"
        w={{ base: "95%", md: "60%", lg: "50%", xl: "40%" }}
        h="auto"
        bgColor={"white"}
        borderRadius={"10px"}
        align={"center"}
        justify={"center"}
        flexDirection={"column"}
        boxShadow={"0px 4px 4px 0px rgba(0, 0, 0, 0.25)"}
        zIndex="1"
        p={{ base: "10px", md: "20px", lg: "30px" }}
      >
        <chakra.span
          className="material-symbols-outlined"
          fontSize={{ base: "60px", md: "80px" }}
          fontWeight={700}
          color="#007AFF"
        >
          drafts
        </chakra.span>
        {/* <Icon as={GoMail} fontSize="60px" color="medBlueLogo" /> */}

        <Text
          color="#0E11C7"
          fontFamily="'Roboto Mono', monospace"
          fontStyle={"normal"}
          fontSize={{ base: "24px", md: "30px" }}
          fontWeight={700}
        >
          Please Enter Code
        </Text>
        <Text color="#0E11C7" fontSize={{ base: "13px", md: "16px" }}>
          Please check your email and click the verification link to log in
        </Text>
        <chakra.form onSubmit={handleSubmit(onSubmit)} noValidate={true}>
          <fieldset disabled={isSubmitting}>
            <Flex direction="column" gap="0.5rem">
              <FormControl isInvalid={!!errors.id} isRequired={true}>
                <Input type="hidden" {...register("id", { required: true })} />
                {errors?.id?.message ? (
                  <FormErrorMessage>{errors.id.message}</FormErrorMessage>
                ) : null}
              </FormControl>
              <FormControl isInvalid={!!errors.magicCode} isRequired={true}>
                <FormLabel fontSize="16px" textAlign={"center"} color="#0E11C7">
                  Enter 6 digit code
                </FormLabel>
                <Input
                  type="hidden"
                  {...register("magicCode", { required: true })}
                />
                <Flex justifyContent={"center"} w="100%" py="2" mt="4">
                  <HStack>
                    <PinInput
                      onChange={(value) => setValue("magicCode", value)}
                      defaultValue={getValues("magicCode")}
                    >
                      <PinInputField
                        width={{ base: "55px", md: "85px" }}
                        height={{ base: "45px", md: "75px" }}
                        border={"2px"}
                        borderColor={"#0E11C7"}
                      />
                      <PinInputField
                        width={{ base: "55px", md: "85px" }}
                        height={{ base: "45px", md: "75px" }}
                        border={"2px"}
                        borderColor={"#0E11C7"}
                      />
                      <PinInputField
                        width={{ base: "55px", md: "85px" }}
                        height={{ base: "45px", md: "75px" }}
                        border={"2px"}
                        borderColor={"#0E11C7"}
                      />
                      <PinInputField
                        width={{ base: "55px", md: "85px" }}
                        height={{ base: "45px", md: "75px" }}
                        border={"2px"}
                        borderColor={"#0E11C7"}
                      />
                      <PinInputField
                        width={{ base: "55px", md: "85px" }}
                        height={{ base: "45px", md: "75px" }}
                        border={"2px"}
                        borderColor={"#0E11C7"}
                      />
                      <PinInputField
                        width={{ base: "55px", md: "85px" }}
                        height={{ base: "45px", md: "75px" }}
                        border={"2px"}
                        borderColor={"#0E11C7"}
                      />
                    </PinInput>
                  </HStack>
                </Flex>
                {errors?.magicCode?.message ? (
                  <FormErrorMessage>
                    {errors.magicCode.message}
                  </FormErrorMessage>
                ) : null}
              </FormControl>
              <Flex justify="flex-end" w="100%">
                <Button
                  color={"white"}
                  bgColor={"#007AFF"}
                  rounded={"none"}
                  size={"lg"}
                  textTransform={"uppercase"}
                  width={"100%"}
                  type={"submit"}
                >
                  Submit
                </Button>
              </Flex>
            </Flex>
          </fieldset>
        </chakra.form>

        {/* <Flex direction="column" width="100%" alignItems="flex-start" px="10">
          <Link href="/pagesv2/signin" as={NextLink} className="link" textAlign={"left"}>
            {`<< Back to Sign In`}
          </Link>
        </Flex>
        <Spacer /> */}
      </Flex>
    </Flex>
  );
}

AuthSignin.auth = {
  public: true,
};
