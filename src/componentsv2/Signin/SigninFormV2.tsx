import {
  Box,
  Button,
  Card,
  CardBody,
  Center,
  chakra,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Grid,
  GridItem,
  Heading,
  Image,
  Input,
  Link,
  Spacer,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useV2Router } from "componentsv2/Dashboard/Helpers/routerHelpers";
import { signIn, useSession } from "next-auth/react";
import { V2Link as NextLink } from "componentsv2/Dashboard/Helpers/routerHelpers";
import { yupResolver } from "@hookform/resolvers/yup";
import { object, string } from "yup";
import { useQueryClient } from "@tanstack/react-query";
import React from "react";
import { Space } from "lucide-react";

type SigninFormProps = {
  styling: "homePage" | "signinPage";
};

export default function SignInFormV2({ styling, ...rest }: SigninFormProps) {
  const queryClient = useQueryClient();
  const validationSchema = object({
    username: string()
      .required("Email is required")
      .email("Email must be valid"),
    password: string().required("Password is required"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const [status, setStatus] = useState("idle");
  const [loginError, setLoginError] = useState(null);
  const router = useV2Router();

  async function onSubmit({ username, password }) {
    setStatus("isLoading");
    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: username,
        password: password,
      });
      setStatus("success");

      if (res?.error?.includes("sent magic link to email")) {
        queryClient.removeQueries();
        queryClient.clear();

        // Get part of string from id onwards
        const uid = res.error.split("id=")[1];

        const redirect =
          typeof router.query.redirect === "string"
            ? router.query.redirect
            : "/";
        router.push({
          pathname: "/auth/signin",
          query: { id: uid, redirect: redirect },
        });
      } else if (res.ok) {
        queryClient.removeQueries();
        queryClient.clear();

        const redirectPath =
          typeof router.query.redirect === "string"
            ? router.query.redirect
            : "/clinlog";
        router.push(redirectPath);
      } else {
        throw new Error("Invalid Credentials");
      }
    } catch (err) {
      setStatus("error");
      setLoginError(
        "The Details You Provided Are Incorrect. If you have forgotten your password please use Forgot Password."
      );
    }
  }

  const toast = useToast();
  useEffect(() => {
    if (status === "success") {
      toast({
        title: "Logged In",
        description: "Just a moment...",
        status: "success",
        duration: 5000,
        position: "top",
        isClosable: true,
      });
    } else if (status === "error") {
      toast({
        title: "Error",
        description: loginError,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }
  }, [status]);

  if (styling === "homePage") {
    return (
      <Flex
        w="100%"
        align={"center"}
        h={{ base: "auto", md: "100vh" }}
        px={{ base: "10", md: "10", lg: "12" }}
      >
        {/* <Flex
            justifyContent={"end"}
            alignItems={"end"}
            display={{ base: "none", lg: "flex" }}
          >
            <Link
              className={"link"}
              href={"/pagesv2/forgot-password"}
              as={NextLink}
            >
              <chakra.span
                textTransform={"uppercase"}
                color={"primary"}
                fontSize={"0.8rem"}
              >
                Forgot Password?
              </chakra.span>
            </Link>
          </Flex> */}

        <chakra.form
          onSubmit={handleSubmit(onSubmit)}
          width={"100%"}
          noValidate={true}
        >
          <fieldset disabled={status === "isLoading"}>
            <Flex
              flexDirection={"column"}
              gap={{ base: "1rem", md: "2rem" }}
              w="100%"
              align={"center"}
            >
              {/* <Grid
              templateColumns={{
                base: "repeat(1, 1fr)",
                lg: "repeat(11, 1fr)",
              }}
              rowGap={{ base: "1.0rem", lg: "1rem" }}
              columnGap={{ base: "0rem", lg: "1.0rem" }}
            >
              <GridItem colSpan={{ base: 12, lg: 5 }}> */}
              <FormControl
                isInvalid={!!errors.username}
                isRequired={true}
                w={{ base: "100%", md: "90%", lg: "70%" }}
              >
                <Text
                  fontSize={{ base: "12px", md: "16px" }}
                  fontWeight={"700"}
                  mb="2"
                >
                  Email
                </Text>

                <Input
                  type={"email"}
                  placeholder={"Enter Email"}
                  border={"1px solid"}
                  borderColor={"scBlack"}
                  h={{ base: "50px", md: "60px", lg: "80px" }}
                  autoComplete={"email"}
                  {...register("username", { required: true })}
                  fontSize={{ base: "12px", md: "16px" }}
                />
                {errors?.username?.message ? (
                  <FormErrorMessage fontSize={"0.8rem"} color={"red"}>
                    {`${errors.username.message}`}
                  </FormErrorMessage>
                ) : null}
              </FormControl>
              {/* </GridItem>
              <GridItem colSpan={{ base: 12, lg: 5 }}> */}
              <FormControl
                isInvalid={!!errors.password}
                isRequired={true}
                w={{ base: "100%", md: "90%", lg: "70%" }}
              >
                <Text
                  fontSize={{ base: "12px", md: "16px" }}
                  fontWeight={"700"}
                  mb="2"
                >
                  Password
                </Text>
                <Input
                  type={"password"}
                  placeholder={"Your Password"}
                  border={"1px solid"}
                  borderColor={"scBlack"}
                  h={{ base: "50px", md: "60px", lg: "80px" }}
                  autoComplete={"current-password"}
                  {...register("password", { required: true })}
                  fontSize={{ base: "12px", md: "16px" }}
                />
                {errors?.password?.message ? (
                  <FormErrorMessage fontSize={"0.8rem"} color={"red"}>
                    {`${errors.password.message}`}
                  </FormErrorMessage>
                ) : null}
                <Flex
                  w={{ base: "100%", md: "90%", lg: "70%" }}
                  mt="1"
                  justify={"space-between"}
                >
                  <Link
                    className={"link"}
                    href={"/pagesv2/forgot-password"}
                    as={NextLink}
                  >
                    <chakra.span
                      textDecoration="underline"
                      color={"#351361"}
                      fontSize={{ base: "12px", md: "14px", lg: "16px" }}
                    >
                      Forgot your Password?
                    </chakra.span>
                  </Link>
                </Flex>
              </FormControl>

              {/* </GridItem>
              <GridItem colSpan={{ base: 12, lg: 1 }}> */}
              <Flex
                w={{ base: "100%", md: "90%", lg: "70%" }}
                mt={{ base: "1", md: "2" }}
              >
                <Button
                  type={"submit"}
                  bg={"linear-gradient(90deg, var(--clinlog-purple, #452A7E) 25%, #612ECC 100%)"}
                  color={"white"}
                  width={"100%"}
                  p={{ base: "4", md: "6", lg: "9" }}
                  borderRadius={"60px"}
                  fontSize={{ base: "14px", md: "16px", lg: "22px" }}
                >
                  Continue
                </Button>
              </Flex>
              {/* </GridItem>
              <GridItem colSpan={{ base: 12, lg: 12 }}> */}
              <Text
                fontSize={{ base: "12px", md: "14px", lg: "16px" }}
                fontWeight={"700"}
              >
                Require Technical Assistance?{" "}
                <Link
                  p="2"
                  color="scBlack"
                  _hover={{
                    color: "#1331DC",
                    textDecoration: "underline",
                  }}
                  href={"/pagesv2/support"}
                  as={NextLink}
                >
                  Click here
                </Link>
              </Text>

              <Text
                bgColor={"white"}
                color="scBlack"
                bottom={"0"}
                position={"fixed"}
                display={{ base: "flex", md: "none" }}
                textAlign="left"
                fontSize={{ base: "11px", md: "13px" }}
                fontWeight={"500"}
                p="4"
                w="100%"
                justifyContent={"center"}
              >
                SmileConnect® All Rights Reserved
              </Text>
              {/* </GridItem>
            </Grid> */}
            </Flex>
          </fieldset>
        </chakra.form>
      </Flex>
    );
  } else {
    // styling === "signinPage"
    return (
      <chakra.form
        onSubmit={handleSubmit(onSubmit)}
        w={"100%"}
        noValidate={true}
      >
        <fieldset disabled={status === "isLoading"}>
          <Flex
            align={"center"}
            flexDirection={"column"}
            gap={"1rem"}
            mb={"1rem"}
          >
            <Image
              src="/smileconnect-colour.svg"
              h={{ base: "45px", lg: "70px" }}
            />
            <Text
              fontSize={"sm"}
              textTransform={"uppercase"}
              fontWeight={"500"}
              textAlign={"center"}
            >
              This Patient Management Portal Is By Invitation Only. Please
              Contact Your Clinician To Receive An Invite
            </Text>
          </Flex>
          <Box mb={"1rem"}>
            <FormControl isInvalid={!!errors.username} isRequired={true}>
              <FormLabel>Email:</FormLabel>
              <Input
                type={"text"}
                bg={"lightBlueLogo"}
                autoComplete={"email"}
                {...register("username", { required: true })}
              />
              {errors?.username?.message ? (
                <FormErrorMessage>
                  {`${errors.username.message}`}
                </FormErrorMessage>
              ) : null}
            </FormControl>
          </Box>
          <Box mb={"3rem"}>
            <FormControl isInvalid={!!errors.password} isRequired={true}>
              <Flex justifyContent={"space-between"}>
                <FormLabel>Password:</FormLabel>
                <Link href={"forgot-password"} as={NextLink}>
                  <Text fontSize={"0.8rem"} color={"primary"}>
                    Forgot Password?
                  </Text>
                </Link>
              </Flex>
              <Input
                type={"password"}
                bg={"lightBlueLogo"}
                autoComplete={"current-password"}
                {...register("password", { required: true })}
              />
              {errors?.password?.message ? (
                <FormErrorMessage>
                  {`${errors.password.message}`}
                </FormErrorMessage>
              ) : null}
            </FormControl>
          </Box>
          <Button
            color={"white"}
            bgColor={"xlDarkBlueLogo"}
            rounded={"none"}
            size={"lg"}
            textTransform={"uppercase"}
            width={"100%"}
            type={"submit"}
          >
            {status === "isLoading" ? <Spinner mr={"1rem"} /> : null}
            Login
          </Button>
        </fieldset>
      </chakra.form>
    );
  }
}
