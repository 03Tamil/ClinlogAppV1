import {
  chakra,
  Button,
  Flex,
  Text,
  Input,
  FormControl,
  FormLabel,
  HStack,
  PinInput,
  PinInputField,
  FormErrorMessage,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
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
  const router = useRouter();
  const clinlogPurple = "#452A7E";
  const clinlogGradient =
    "linear-gradient(90deg, var(--clinlog-purple, #452A7E) 25%, #612ECC 100%)";
  const pinInputFieldStyles = {
    width: { base: "34px", sm: "48px", md: "62px" },
    height: { base: "44px", sm: "54px", md: "68px" },
    border: "2px",
    borderColor: clinlogPurple,
    borderRadius: "8px",
    color: clinlogPurple,
    fontWeight: "700",
    fontSize: { base: "18px", md: "24px" },
    _focusVisible: {
      borderColor: clinlogPurple,
      boxShadow: `0 0 0 1px ${clinlogPurple}`,
    },
  };

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
        router.push("/dashboard")
      } else {
        throw new Error("Invalid Credentials")
      }
    } catch (err) {
      router.push("/404?error=" + err)
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
          router.push("/dashboard")
        } else {
          throw new Error("Invalid Credentials")
        }
      } catch (err) {
          router.push("/404?error=" + err)
      }
    }
    if (!!magicCode && !!id) {
      logUser()
    }
  }, [id, magicCode]) */

  useEffect(() => {
    if (!id) {
      router.push("/403");
    }
  }, [id, router]);

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

  if (!id) {
    return null;
  }

  return (
    <Flex
      direction={"column"}
      width={"100%"}
      minH={"100dvh"}
      alignItems={"center"}
      justifyContent={"center"}
      bg={clinlogGradient}
      overflowY="auto"
      px={{ base: "4", md: "6" }}
      py={{ base: "6", md: "10" }}
    >
      <Flex
        position="relative"
        w="100%"
        maxW="760px"
        h="auto"
        bgColor={"white"}
        borderRadius={"12px"}
        align={"center"}
        justify={"center"}
        flexDirection={"column"}
        boxShadow={"0px 20px 45px rgba(0, 0, 0, 0.18)"}
        zIndex="1"
        p={{ base: "6", sm: "8", md: "10" }}
        gap={{ base: "3", md: "4" }}
      >
        <chakra.span
          className="material-symbols-outlined"
          fontSize={{ base: "56px", md: "76px" }}
          fontWeight={700}
          color={clinlogPurple}
        >
          drafts
        </chakra.span>

        <Text
          color={clinlogPurple}
          fontFamily={"Avenir, Inter, sans-serif"}
          fontStyle={"normal"}
          fontSize={{ base: "28px", md: "40px" }}
          fontWeight={700}
          lineHeight="1.1"
          textAlign="center"
        >
          Please Enter Code
        </Text>
        <Text
          color={clinlogPurple}
          fontSize={{ base: "15px", md: "18px" }}
          lineHeight="1.5"
          textAlign="center"
          maxW="620px"
        >
          Please check your email and click the verification link to log in
        </Text>
        <chakra.form
          onSubmit={handleSubmit(onSubmit)}
          noValidate={true}
          w="100%"
        >
          <fieldset
            disabled={isSubmitting}
            style={{ border: 0, margin: 0, minInlineSize: 0, padding: 0 }}
          >
            <Flex direction="column" gap={{ base: "4", md: "5" }}>
              <FormControl isInvalid={!!errors.id} isRequired={true}>
                <Input type="hidden" {...register("id", { required: true })} />
                {errors?.id?.message ? (
                  <FormErrorMessage>{errors.id.message}</FormErrorMessage>
                ) : null}
              </FormControl>
              <FormControl isInvalid={!!errors.magicCode} isRequired={true}>
                <FormLabel
                  fontSize={{ base: "16px", md: "18px" }}
                  fontWeight="700"
                  textAlign={"center"}
                  color={clinlogPurple}
                  mb="0"
                >
                  Enter 6 digit code
                </FormLabel>
                <Input
                  type="hidden"
                  {...register("magicCode", { required: true })}
                />
                <Flex justifyContent={"center"} w="100%" py="2" mt="2">
                  <HStack spacing={{ base: "1", sm: "2", md: "3" }}>
                    <PinInput
                      onChange={(value) => setValue("magicCode", value)}
                      defaultValue={getValues("magicCode")}
                    >
                      {Array.from({ length: 6 }).map((_, index) => (
                        <PinInputField key={index} {...pinInputFieldStyles} />
                      ))}
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
                  bgColor={clinlogPurple}
                  borderColor={clinlogPurple}
                  borderWidth="1px"
                  rounded={"8px"}
                  size={"lg"}
                  textTransform={"uppercase"}
                  width={"100%"}
                  type={"submit"}
                  fontWeight="700"
                  _hover={{ bgColor: "#351361" }}
                  _active={{ bgColor: "#351361" }}
                >
                  Submit
                </Button>
              </Flex>
            </Flex>
          </fieldset>
        </chakra.form>
      </Flex>
    </Flex>
  );
}

AuthSignin.auth = {
  public: true,
};
