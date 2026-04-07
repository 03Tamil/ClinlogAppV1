import { HamburgerIcon } from "@chakra-ui/icons"
import {
  Flex,
  Button,
  Icon,
  IconButton,
  Image,
  useQuery,
  Heading,
} from "@chakra-ui/react"
import { info } from "console"
import { motion } from "framer-motion"
import { useAtom } from "jotai"
import { useV2Router } from "componentsv2/Dashboard/Helpers/routerHelpers"
import React from "react"
import { ImTable } from "react-icons/im"
import { RiDashboardFill } from "react-icons/ri"
import { logosQuery } from "../helpersv2/queries"
import useQueryHook from "../hooks/useQueryHook"
import { sidebarToggleAtom } from "../store/store"

function Logos({ data }) {
  const secondaryLogo = () => {
    const actualUrl =
      data.entry?.locationOtherLogo.length > 0 &&
      data.entry?.locationOtherLogo[0]?.url.split("/assets")
    if (!!actualUrl) {
      return (
        <Image
          src={`https://allon4portal-2022-11-30.ddev.site/assets${actualUrl[1]}`}
          alt="AllOn4Logo"
          maxWidth="100%"
          // maxHeight="100%"
          height="80px"
          flexBasis="50%"
          flexShrink={1}
          mr="20px"
        />
      )
    }
  }
  // data.entry.locationOtherLogo.length > 0
  //   ? data.entry.locationOtherLogo[0]?.url.split("/assets")
  //   : "hellos"
  return (
    <Flex
      as={motion.div}
      align="center"
      p="10px 30px"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition="0.5s"
    >
      {/* {mappedLogos} */}
      <Image
        src={data.entry?.locationPlusClinic ? "./silver.svg" : "./gold.svg"}
        padding="5px"
        alt="AllOn4Logo"
        maxWidth="100%"
        // maxHeight="100%"
        height="80px"
        flexBasis="50%"
        flexShrink={1}
        mr="20px"
      />
      {secondaryLogo()}
    </Flex>
  )
}

export default function Navbar() {
  const [sidebarOpen, sidebarToggle] = useAtom(sidebarToggleAtom)
  const { isLoading, data, error } = useQueryHook(["loc"], logosQuery, {})
  const router = useV2Router()

  return (
    <Flex
      height="95px"
      borderBottom="1px solid"
      borderColor="gray.300"
      bgColor="darkBlueLogo"
      width="100vw"
      maxWidth="100%"
      position="absolute"
      justify="center"
    >
      <Flex w="100%" maxW="1780px" align="center" justify="space-between">
        {isLoading ? (
          <Heading color="white">Loading</Heading>
        ) : error ? (
          <Heading color="white">Error</Heading>
        ) : (
          <Logos data={data} />
        )}

        <Flex mr="16px">
          <Button
            leftIcon={<Icon h="20px" w="20px" as={ImTable} />}
            variant=""
            bgColor="white"
            size="md"
            // color="white"
            ml="10px"
            onClick={() => router.push("/pagesv2/table")}
          >
            All Records
          </Button>
          <Button
            leftIcon={<Icon h="20px" w="20px" as={RiDashboardFill} />}
            variant=""
            bgColor="white"
            size="md"
            // color="white"
            ml="10px"
            onClick={() => router.push("/pagesv2/dashboard")}
          >
            Dashboard
          </Button>
          <IconButton
            ml="10px"
            bgColor="white"
            aria-label="Toggle Sidebar"
            onClick={() => sidebarToggle(!sidebarOpen)}
            icon={<HamburgerIcon />}
          />
        </Flex>
      </Flex>
    </Flex>
  )
}
