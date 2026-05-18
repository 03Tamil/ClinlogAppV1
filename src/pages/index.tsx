//@ts-nocheck
import { Flex, Text, Image, Grid, GridItem, Spacer } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import SignInFormV2 from "componentsv2/Signin/SigninFormV2";

export default function MainPage() {
  const { status } = useSession({
    required: false,
  });
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/clinlog");
    }
  }, [router, status]);

  if (status === "loading" || status === "authenticated") {
    return null;
  }

  return (
    <Grid
      minH="100dvh"
      templateColumns={"repeat(12, 1fr)"}
      columnGap={{ base: "1rem", lg: "1rem", xl: "3rem" }}
      rowGap={{ base: "1rem", lg: "1rem", xl: "2rem" }}
    >
      <GridItem
        colSpan={{ base: 12, md: 6 }}
        w="100%"
        h={{ base: "auto", md: "100%" }}
      >
        <Flex
          flexDirection={"column"}
          px={{ base: "0", md: "6", lg: "12" }}
          py={{ base: "0", md: "8" }}
          bg={{
            base: "white",
            md: "linear-gradient(90deg, var(--clinlog-purple, #452A7E) 25%, #612ECC 100%)",
          }}
          w="100%"
          h={{ base: "auto", md: "100%" }}
          gap="1rem"
        >
          <Flex
            bg={{
              base: "linear-gradient(90deg, var(--clinlog-purple, #452A7E) 25%, #612ECC 100%)",
              md: "none",
            }}
            w="100%"
            align="center"
            justify={{ base: "center", md: "flex-start" }}
            h="auto"
            py="4"
            ml={{ base: "0", md: "6" }}
          >
            <Image
              src="/newclinloglogo.png"
              alt="Clinlog"
              h={{ base: "44px", md: "52px" }}
              w="auto"
              objectFit="contain"
            />
          </Flex>
          <Flex
            flexDirection={"column"}
            px={{ base: "10", md: "10", lg: "12" }}
            py={{ base: "6", md: "8" }}
            w="100%"
            h={{ base: "auto", md: "100%" }}
          >
            <Spacer display={{ base: "none", md: "flex" }} />
            <Flex
              flexDirection={"column"}
              gap={{ base: "1rem", md: "6rem" }}
              color={{ base: "scBlack", md: "white" }}
              textAlign="left"
              w={{ base: "100%", xl: "75%", "2xl": "50%" }}
            >
              <Text
                fontSize={{
                  base: "26px",
                  sm: "30px",
                  md: "34px",
                  lg: "40px",
                }}
                fontWeight={"700"}
                fontFamily="Avenir"
              >
                Login to your Clinlog® account
              </Text>
            </Flex>
            <Spacer display={{ base: "none", md: "flex" }} />
            <Spacer display={{ base: "none", md: "flex" }} />
            <Text
              color="white"
              display={{ base: "none", md: "block" }}
              textAlign="left"
              fontSize={"13px"}
              fontWeight={"500"}
            >
              SmileConnect® All Rights Reserved
            </Text>
          </Flex>
        </Flex>
      </GridItem>
      <GridItem colSpan={{ base: 12, md: 6 }}>
        <SignInFormV2 styling={"homePage"} />
      </GridItem>
    </Grid>
  );
}

MainPage.auth = {
  role: "Patient",
  public: true,
};
