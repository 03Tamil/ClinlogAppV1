import {
  Box,
  Button,
  chakra,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Img,
  Input,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import { signIn, useSession } from "next-auth/react";
import { useV2Router } from "componentsv2/Dashboard/Helpers/routerHelpers";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { V2Link as Link } from "componentsv2/Dashboard/Helpers/routerHelpers";
import { useQueryClient } from "@tanstack/react-query";
import FullscreenLoadingSpinner from "componentsv2/FullscreenLoadingSpinner";
import SignInForm from "componentsv2/Signin/SigninForm";

export default function Signin() {
  const { data: session } = useSession();
  const router = useV2Router();

  useEffect(() => {
    if (session) {
      const redirectPath =
        typeof router.query.redirect === "string" ? router.query.redirect : "/";
      console.log("redirectPath", redirectPath);
      // Don't redirect to signout page
      if (redirectPath === "/signout") {
        router.push("/pagesv2/");
      } else {
        router.push(redirectPath);
      }
    } else {
      router.push("/pagesv2/");
    }
  }, [session]);

  return (
    // <Flex
    //   direction={"column"}
    //   width={"100%"}
    //   align={"center"}
    //   justify={"flex-start"}
    //   bgColor={"lgDarkBlueLogo"}
    //   h="91vh"
    // >
    //   <Container size={"small"} py={"2rem"}>
    //     <Flex
    //       w={"100%"}
    //       padding={"24px"}
    //       bgColor={"white"}
    //       borderRadius={"6px"}
    //       my={{ base: "2rem", lg: "5rem" }}
    //     >
    //       <SignInForm styling={"signinPage"} />
    //     </Flex>
    //   </Container>
    // </Flex>
    <FullscreenLoadingSpinner />
  );
}

Signin.auth = {
  public: true,
};
