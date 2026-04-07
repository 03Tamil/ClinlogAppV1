import { SettingsIcon } from "@chakra-ui/icons"
import {
  Avatar,
  Button,
  Divider,
  Flex,
  Heading,
  Icon,
  Image,
  Text,
} from "@chakra-ui/react"
import { AnimatePresence, motion } from "framer-motion"
import { useAtom } from "jotai"
import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import { GoMail } from "react-icons/go"
import { ImTable } from "react-icons/im"
import { RiDashboardFill, RiLogoutBoxRLine } from "react-icons/ri"
import { sidebarToggleAtom } from "../store/store"
// import { useV2Router } from "./Dashboard/Helpers/routerHelpers"

export default function Sidebar() {
  const [sidebarOpen, sidebarToggle] = useAtom(sidebarToggleAtom)
  const { data: session } = useSession()
  const router = useRouter()
  const variants = {
    exit: {
      width: 0,
      opacity: 0,
      transition: { delay: 0, duration: 0.3, type: "linear" },
    },
    open: {
      width: 300,
      opacity: 1,
      transition: { delay: 0, duration: 0.3, type: "linear" },
    },
    closed: {
      width: 0,
      opacity: 0,
      transition: { delay: 0, duration: 0.3, type: "linear" },
    },
  }
  return (
    <Flex
      borderLeft={sidebarOpen && "1px solid"}
      borderColor="gray.300"
      bgColor="gray.300"
    >
      <AnimatePresence exitBeforeEnter>
        {sidebarOpen && (
          <Flex
            as={motion.div}
            w="100%"
            direction="column"
            // initial={{ width: 0, opacity: 0 }}
            // initial={false}
            animate={sidebarOpen ? "open" : "exit"}
            exit="exit"
            variants={variants}
            width="0px"
          >
            <Flex
              direction="column"
              padding="30px"
              height="100vh"
              align="flex-start"
            >
              <Flex align="center" mb="10px">
                <Avatar name="Alex" />
                <Flex direction="column" ml="10px">
                  <Heading size="md" noOfLines={1}>
                    {session.fullName}
                  </Heading>
                  <Text>Burwood East</Text>
                  <Text>{session.groups}</Text>
                </Flex>
              </Flex>
              <Divider variant="sidebar" />

              <Button
                onClick={() => {
                  sidebarToggle(false)
                  router.push("/pagesv2/signout")
                }}
                leftIcon={<Icon as={RiLogoutBoxRLine} />}
                variant="ghost"
                w="100%"
                justifyContent="flex-start"
              >
                Log Out
              </Button>
              <Button
                leftIcon={<Icon as={RiDashboardFill} />}
                justifyContent="flex-start"
                w="100%"
                variant="ghost"
              >
                DASHBOARD
              </Button>
              <Button
                leftIcon={<Icon as={ImTable} />}
                justifyContent="flex-start"
                w="100%"
                variant="ghost"
              >
                ALL RECORDS
              </Button>
              <Button
                leftIcon={<Icon as={GoMail} />}
                justifyContent="flex-start"
                w="100%"
                variant="ghost"
              >
                MESSAGES
              </Button>
              <Divider variant="sidebar" />
              <Button
                leftIcon={<SettingsIcon />}
                justifyContent="flex-start"
                w="100%"
                variant="ghost"
              >
                RESOURCES
              </Button>
              <Button
                leftIcon={<SettingsIcon />}
                justifyContent="flex-start"
                w="100%"
                variant="ghost"
              >
                SUPPORT / GUIDES
              </Button>
              <Button
                leftIcon={<SettingsIcon />}
                justifyContent="flex-start"
                w="100%"
                variant="ghost"
              >
                SETTINGS
              </Button>
            </Flex>
          </Flex>
        )}
      </AnimatePresence>
    </Flex>
  )
}
