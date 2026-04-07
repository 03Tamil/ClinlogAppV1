import { Box, Button, Flex, FlexProps, Icon, Image } from "@chakra-ui/react";
import { MdOutlineHome } from "react-icons/md";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { MainNavbar } from "componentsv2/Layout/MainNavbar";
import MainFooter from "componentsv2/Layout/MainFooter";
import Sidebar from "componentsv2/Sidebar";
import { AlwaysScrollToTop } from "helpers/customs";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { LoadingIndicator } from "componentsv2/LoadingIndicator";

export function Layout(props: FlexProps) {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <Flex direction={"column"} align={"center"} fontFamily={"Inter"}>
      <LoadingIndicator />
      <AlwaysScrollToTop />
      <Flex width={"100%"} direction={"column"}>
        {session &&  <MainNavbar />}
        {props.children}
        {session && <Sidebar />}
        {session && router?.pathname !== "pagesv2/clinlog" && null}
      </Flex>
    </Flex>
  );
}
