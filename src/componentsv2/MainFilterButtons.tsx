import {
  Box,
  Button,
  Container,
  Flex,
  Grid,
  Stat,
  StatArrow,
  StatHelpText,
  StatLabel,
  StatNumber,
  Tooltip,
  useToast,
} from "@chakra-ui/react"
import { useAtom } from "jotai"
import React, { useMemo } from "react"
import {
  filtersAtom,
  filterTypeAtom,
  locationDateLimitAtom,
  visibilityAtom,
} from "../store/store"
import {
  handleVisbilityActiveLeadsDesktop,
  handleVisbilityAllDesktop,
  handleVisbilityBookedDesktop,
  handleVisbilityCompletedDesktop,
  handleVisbilityConsultsDesktop,
} from "./VisbilityFunctions"

export default function MainFilterButtons({ data }) {
  const [currentFilterType, setCurrentFilterType] = useAtom(filterTypeAtom)
  const [columnFilters, setColumnFilters] = useAtom(filtersAtom)
  const [columnVisibility, setColumnVisibility] = useAtom(visibilityAtom)
  const [locationDateLimit, setLocationDateLimit] = useAtom(
    locationDateLimitAtom
  )

  const subValues = useMemo(
    () => ({
      all: data?.all - data?.allPrior,
      leads: data?.activeLeadsCount - data?.activeLeadsCountPrior,
      consults:
        data?.consultationsLeadCount - data?.consultationsLeadCountPrior,
      booked: data?.treatmentsBookedCount - data?.treatmentsBookedCountPrior,
      recall:
        data?.treatmentsCompletedCount - data?.treatmentsCompletedCountPrior,
    }),
    [data]
  )

  function switchFilterType(filterType) {
    const activeOrInactiveFilter = columnFilters.some(
      (item) => item.value === "Inactive"
    )
      ? {
          id: "recordFollowUpStatus",
          value: "Inactive",
        }
      : {
          id: "recordFollowUpStatus",
          value: "Active",
        }

    switch (filterType) {
      case "leads":
        setColumnFilters((prev) => [
          activeOrInactiveFilter,
          { id: "recordConsultationStatus", value: [null, "noShow", ""] },
          { id: "recordTreatmentStatus", value: [null, "noAppointments"] },
        ])
        setColumnVisibility(handleVisbilityActiveLeadsDesktop)
        break
      case "consults":
        setColumnFilters((prev) => [
          activeOrInactiveFilter,
          {
            id: "recordConsultationStatus",
            value: ["attended", "booked", "noShow"],
          },
          { id: "recordTreatmentStatus", value: [null, "noAppointments"] },
        ])
        setColumnVisibility(handleVisbilityConsultsDesktop)
        break
      case "booked":
        setColumnFilters((prev) => [
          activeOrInactiveFilter,
          {
            id: "recordTreatmentStatus",
            value: [
              "bookedNoDeposit",
              "bookedWithDeposit",
              "bookedWithFullSuperFunds",
            ],
          },
        ])
        setColumnVisibility(handleVisbilityBookedDesktop)
        break
      case "recall":
        setColumnFilters((prev) => [
          activeOrInactiveFilter,
          { id: "recordTreatmentStatus", value: ["completed"] },
        ])
        setColumnVisibility(handleVisbilityCompletedDesktop)
        break
      case "cold cases":
        setColumnFilters((prev) => [
          {
            id: "recordFollowUpStatus",
            value: "coldCase",
          },
        ])
        setLocationDateLimit(false)
        setColumnVisibility(handleVisbilityAllDesktop)
        break
      case "all":
        setColumnFilters((prev) => [activeOrInactiveFilter])
        setColumnVisibility(handleVisbilityAllDesktop)
        break
    }
  }

  const handleMainFilter = (e) => {
    setCurrentFilterType(e.currentTarget.name)
    toast({
      description: `Moved To ${e.currentTarget.name}`,
      status: "success",
      duration: 1000,
      isClosable: true,
    })
    switchFilterType(e.currentTarget.name)
  }

  const toast = useToast()
  const arr = ["all", "leads", "consults", "booked", "recall", "cold cases"]

  const comparator = {
    all: "black",
    leads: "green.600",
    consults: "orange.400",
    booked: "red.500",
    recall: "gray.400",
  }

  const mappedFilterButtons = arr.map((val, i) => {
    return (
      <React.Fragment key={i}>
        <Button
          name={val}
          isActive={currentFilterType === val}
          onClick={handleMainFilter}
          variant="filterButton"
          borderBottom="6px solid"
          borderColor="darkBlueLogo"
          _active={{ borderBottom: "6px solid", borderColor: "#448FFF" }}
        >
          <Stat>
            <StatLabel fontSize="24px" fontWeight="400">
              {val.toUpperCase()}
            </StatLabel>
            {/* <StatNumber fontSize="18px" color="white">
              {data[val] || 0}
            </StatNumber> */}
            {/* <StatHelpText>
              <Tooltip
                label="VS Previous 30 Days"
                aria-label="A tooltip"
                backgroundColor="rgba(0,0,0,0.7)"
                color="white"
                fontSize="10px"
              >
                <Box>
                  <StatArrow
                    type={subValues[val] > 0 ? "increase" : "decrease"}
                    color={subValues[val] > 0 ? "green.500" : "red.500"}
                  />
                  {subValues[val] || 0}
                </Box>
              </Tooltip>
            </StatHelpText> */}
          </Stat>
        </Button>
      </React.Fragment>
    )
  })

  return (
    <Flex
      direction="column"
      bgColor="darkBlueLogo"
      color="white"
      align="center"
      // mb="8px"
      width={"100%"} // Removing w=100vw fixes a horizontal scroll issue
    >
      <Flex
        direction="column"
        bgColor="darkBlueLogo"
        color="white"
        align="center"
        width={"100%"} // Removing w=100vw fixes a horizontal scroll issue
      >
        <Flex
          w="100%"
          //maxW="1728px"
        >
          <Container size="main">
            <Grid
              flexGrow="2"
              // padding="10px 10px 0px 10px"
              templateColumns="repeat(5, 1fr)"
              minHeight="80px"
              templateRows="100px"
              gridAutoFlow="column"
              // overflow="scroll"
            >
              {mappedFilterButtons}
            </Grid>
          </Container>
        </Flex>
      </Flex>
    </Flex>
  )
}
