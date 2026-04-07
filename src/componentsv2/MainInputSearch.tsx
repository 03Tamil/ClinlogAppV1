import { SearchIcon, HamburgerIcon, ChevronDownIcon } from "@chakra-ui/icons"
import { FaFilter, FaPlusCircle } from "react-icons/fa"
import {
  InputGroup,
  InputLeftElement,
  Input,
  InputRightElement,
  Button,
  useMediaQuery,
  Flex,
  Text,
  useDisclosure,
  ModalOverlay,
  CloseButton,
  Box,
  Tag,
  TagLabel,
  TagCloseButton,
  HStack,
  useOutsideClick,
  VStack,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  InputLeftAddon,
  Icon,
} from "@chakra-ui/react"
import { useAtom } from "jotai"
import { CiFilter } from "react-icons/ci"
import { useEffect, useMemo, useRef, useState } from "react"
import {
  filtersAtom,
  filterTypeAtom,
  handleTagRemoval,
  sortingAtom,
  filterToggleAtom,
  formToggleAtom,
  dateRangeAtom,
  dateAtom,
} from "../store/store"
import Searchbar from "./Searchbar"
import { DateRange } from "react-day-picker"
import { add, endOfMonth, format, startOfMonth, sub, subDays } from "date-fns"
import { RangeDatePicker } from "src/uicomponents/RangeDatePicker"
import { MdChevronLeft, MdChevronRight } from "react-icons/md"

export default function MainInputSearch({ showLeadData }) {
  const { isOpen: searchIsOpen, onOpen, onClose } = useDisclosure()
  const [isOpen, toggle] = useAtom(filterToggleAtom)
  const [isFormOpen, toggleForm] = useAtom(formToggleAtom)
  const [columnFilters, setColumnFilters] = useAtom(filtersAtom)
  const [sorting, setSorting] = useAtom(sortingAtom)
  const [currentFilterType, setCurrentFilterType] = useAtom(filterTypeAtom)
  const [searchFilter, setSearchFilter] = useState("all")
  const [isUnder480] = useMediaQuery("(max-width: 680px)")

  // const [date, setDate] = useState<DateRange | undefined>({
  //   from: subDays(new Date(), 365),
  //   to: new Date(),
  // })
  // const [date, setDate] = useAtom(dateRangeAtom)
  const [monthYear, setMonthYear] = useAtom(dateAtom)

  // useEffect(() => {
  //   if (!!monthYear) {
  //     const filterValues = {
  //       consults: "recordConsultationDate",
  //       booked: "recordTreatmentDate",
  //       recall: "recordTreatmentDate",
  //       leads: "recordEnquiryDate",
  //       all: "recordEnquiryDate",
  //     }
  //     setColumnFilters((prev) => {
  //       // const filterExists = prev.some((item) => idArray.includes(item.id))
  //       const filterExists = prev.some(
  //         (item) => item.id === filterValues?.[currentFilterType]
  //       )
  //       if (!filterExists) {
  //         return [
  //           ...prev,
  //           {
  //             id: filterValues?.[currentFilterType],
  //             value: [startOfMonth(monthYear), endOfMonth(monthYear)],
  //           },
  //         ]
  //       } else {
  //         const newFilterValues = prev.map((item) => {
  //           if (item.id === filterValues?.[currentFilterType]) {
  //             return {
  //               id: filterValues?.[currentFilterType],
  //               value: [startOfMonth(monthYear), endOfMonth(monthYear)],
  //             }
  //           }
  //           return item
  //         })
  //         return newFilterValues
  //       }
  //     })
  //   }
  // }, [monthYear, currentFilterType])

  const ref = useRef()
  useOutsideClick({
    ref: ref,
    handler: () => onClose(),
  })

  const desktopLayout = () => {
    return (
      <Flex
        border="1px solid lightGrey"
        padding="20px 20px 10px 20px"
        borderBottom="0px"
        // borderRadius="10px 10px 0px 0px"
        bgColor="white"
        zIndex="1"
        align="center"
      >
        {/* <RangeDatePicker
          dateState={{ date, setDate }}
          className="border-[1px] border-[#0F1F65] rounded-[5px] text-[#0F1F65] p-[3px]"
          type="patientsTable"
        /> */}
        <Flex>
          {["all", "cold cases"].includes(currentFilterType) ? null : (
            <Button
              justifyContent={"flex-start"}
              size={"sm"}
              variant={"ghost"}
              onClick={() =>
                setMonthYear((prev) => {
                  return sub(monthYear, { months: 1 })
                })
              }
              padding={"4px"}
            >
              <Icon fontSize={"20px"} as={MdChevronLeft} />
            </Button>
          )}
        </Flex>
        <Box width={"30%"}>
          <Text mt={1} fontSize="22px" fontWeight="600" align={"center"}>
            {["all", "cold cases"].includes(currentFilterType)
              ? currentFilterType.toUpperCase()
              : format(monthYear, "MMMM yyyy")}
          </Text>
        </Box>
        <Flex justifyContent={"flex-end"}>
          {["all", "cold cases"].includes(currentFilterType) ? null : (
            <Button
              size={"sm"}
              variant={"ghost"}
              onClick={() =>
                setMonthYear((prev) => {
                  return add(monthYear, { months: 1 })
                })
              }
              borderRadius={"40%"}
              padding={"4px"}
            >
              <Icon fontSize={"20px"} as={MdChevronRight} />
            </Button>
          )}
        </Flex>
        <InputGroup size="lg" ml="20px" mr="20px">
          <InputLeftAddon
            children={
              <Menu matchWidth={true}>
                <MenuButton as={Flex} direction="row">
                  <ChevronDownIcon />{" "}
                  {searchFilter === "recordEmail"
                    ? "EMAIL"
                    : searchFilter.toUpperCase()}
                </MenuButton>
                <MenuList zIndex="1001">
                  <MenuItem onClick={() => setSearchFilter("Full Name")}>
                    Full Name
                  </MenuItem>
                  <MenuItem onClick={() => setSearchFilter("Email")}>
                    Email
                  </MenuItem>
                  <MenuItem onClick={() => setSearchFilter("Mobile Phone")}>
                    Phone Number
                  </MenuItem>
                  <MenuItem onClick={() => setSearchFilter("Clinic")}>
                    Clinic
                  </MenuItem>
                  <MenuItem onClick={() => setSearchFilter("all")}>
                    All
                  </MenuItem>
                </MenuList>
              </Menu>
            }
          />
          <Searchbar borderRadius="0 5px 5px 0px" columnName={searchFilter} />
          <InputRightElement
            onClick={() => toggle(true)}
            _hover={{
              cursor: "pointer",
            }}
            children={<CiFilter fontSize="20px" color="black.900" />}
          />
        </InputGroup>
        {showLeadData ? (
          <Button
            leftIcon={<FaPlusCircle />}
            size="lg"
            variant="outline"
            borderRadius="5px"
            onClick={() => toggleForm(true)}
            backgroundColor="green.400"
            color="white"
            padding="0px 40px"
          >
            Add Lead
          </Button>
        ) : null}
      </Flex>
    )
  }
  // return <>{isUnder480 ? mobileLayout() : desktopLayout()}</>
  return <>{desktopLayout()}</>
}
