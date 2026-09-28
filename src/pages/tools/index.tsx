import { ChevronRightIcon } from "@chakra-ui/icons"
import {
  Box,
  Heading,
  Text,
  Button,
  Flex,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  SimpleGrid,
} from "@chakra-ui/react"
import { isPatient, isStaff } from "helpersv2/Permissions"
import { useSession } from "next-auth/react"
import Link from "next/link"
import NextLink from "next/link"
import { useV2Router } from "componentsv2/Dashboard/Helpers/routerHelpers"
import { useEffect } from "react"

export default function Tools() {
  const router = useV2Router()
  const { error } = router.query
  const { data: session } = useSession()
  const userIsStaff = session && isStaff(session?.groups)
  const userIsPatient = session && isPatient(session?.groups)
  const financeCards = [
    {
      href: "/tools/CDMTable",
      label: "Cost Distribution Methods",
      summary: "Create new CDMs or edit existing ones",
      icon: "data_table",
    },
    {
      href: "/tools/workbooks",
      label: "Workbooks",
      summary:
        "Create workbooks, update campaign cost and manage cost of marketing for each clinic",
      icon: "finance",
    },
    {
      href: "/tools/Campaigns",
      label: "Campaigns",
      summary:
        "Manage active campaigns or disable old campaigns and create and edit suppliers",
      icon: "account_tree",
    },
    {
      href: "/tools/Invoices",
      label: "Invoices",
      summary: "View invoices from Xero",
      icon: "summarize",
    },
    {
      href: "/tools/Reports",
      label: "Reports",
      summary:
        "Create reports and charts for revenue, total marketing spend and cost per customer",
      icon: "monitoring",
    },
  ]
  const analyticsCards = [
    {
      href: "/analytics/analyticsDashboard",
      label: "Analytics Dashboard",
      summary: "View your Analytics Dashboard",
      icon: "data_table",
    },
  ]

  const mappedFinanceCards = financeCards.map((card) => {
    return (
      <Card
        key={card.href}
        _hover={{
          // boxShadow: "0 0 0 3px #3182ce",
          boxShadow: "0 2px 3px 0 #3182ce,0 6px 6px 0 #3182ce",
          transform: "scale(1.05)",
          cursor: "pointer",
        }}
        padding="20px"
        boxShadow="0px 6px 3px 0 rgba(0, 0, 0, 0.1),0 6px 6px 0 rgba(0, 0, 0, 0.06)"
      >
        <Link href={card.href}>
          <CardHeader textAlign="start">
            <Flex align={"center"} gap="10px">
              <span
                style={{ fontSize: "34px" }}
                className="material-symbols-outlined"
              >
                {card.icon}
              </span>
              <Heading size="md">{card.label}</Heading>
            </Flex>
          </CardHeader>
          <CardBody>
            <Text textAlign="start">{card.summary}</Text>
          </CardBody>
        </Link>
      </Card>
    )
  })

  const mappedAnalyticsCards = analyticsCards.map((card) => {
    return (
      <Card
        key={card.href}
        _hover={{
          // boxShadow: "0 0 0 3px #3182ce",
          boxShadow: "0 2px 3px 0 #3182ce,0 6px 6px 0 #3182ce",
          transform: "scale(1.05)",
          cursor: "pointer",
        }}
        padding="20px"
        boxShadow="0px 6px 3px 0 rgba(0, 0, 0, 0.1),0 6px 6px 0 rgba(0, 0, 0, 0.06)"
      >
        <Link href={card.href}>
          <CardHeader textAlign="start">
            <Flex align={"center"} gap="10px">
              <span
                style={{ fontSize: "34px" }}
                className="material-symbols-outlined"
              >
                {card.icon}
              </span>
              <Heading size="md">{card.label}</Heading>
            </Flex>
          </CardHeader>
          <CardBody>
            <Text textAlign="start">{card.summary}</Text>
          </CardBody>
        </Link>
      </Card>
    )
  })

  return (
    <Flex
      minHeight="90vh"
      // width="100vw"
      // justify="center"
      align="center"
      direction="column"
      textAlign="center"
      padding="0px 20px 20px 20px"
      bgColor="lightBlueLogo"
      // overflow="scroll"
    >
      <Heading
        style={{
          backgroundImage: "linearGradient(180deg,#fff,#adadad)",
          backgroundClip: "text",
        }}
        my="30px"
        fontFamily="inter"
        fontWeight="500"
        fontSize="36px"
      >
        TOOLS
      </Heading>
      {/* <Flex gap="10px" flexWrap="wrap" w="80%" mt="20px" justify="center"> */}
      <SimpleGrid
        w="50%"
        spacing={4}
        templateColumns="repeat(auto-fill, minmax(200px, 1fr))"
      >
        {mappedFinanceCards}
      </SimpleGrid>
      <Heading
        style={{
          backgroundImage: "linearGradient(180deg,#fff,#adadad)",
          backgroundClip: "text",
        }}
        my="30px"
        fontFamily="inter"
        fontWeight="500"
        fontSize="36px"
      >
        Analytics
      </Heading>
      <SimpleGrid
        w="50%"
        spacing={4}
        templateColumns="repeat(auto-fill, minmax(200px, 1fr))"
        mb="20px"
      >
        {mappedAnalyticsCards}
      </SimpleGrid>
    </Flex>
  )
}

Tools.auth = {
  role: "Business Manager",
}
