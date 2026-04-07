import {
  Divider,
  Flex,
  Text,
  Box,
  Spacer,
  Tabs as ChakraTabs,
  TabList as ChakraTabList,
  Tab,
  TabPanels,
  TabPanel,
  Button,
  IconButton,
  Image,
  SimpleGrid,
  useOutsideClick,
  Input,
  Portal,
  Tabs,
  TabList,
  Select,
  InputGroup,
  InputLeftElement,
  chakra,
} from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";

const customTabStyle = {
  borderRadius: "10px", // Rounded corners for the tab
  padding: "8px 16px", // Padding inside the tab
  fontWeight: "bold", // Bold text
  fontSize: "14px", // Adjust font size
  bg: "white", // Blue background for the tab
  _selected: {
    bg: "#151551", // Blue background for the selected tab
    color: "white", // White text for the selected tab
  },
  _hover: {
    bg: "#2c3edb", // Slightly darker blue on hover
    color: "white",
  },
};

export default function AdaSidebarV3({
  onClickFunction,
  surfaceLength = 0,
  highlightedChart = "proposed",
  displayType = "tabs",
  mappedChartingItems = [],
  mappedConditionItems = [],
  mappedConditionExistingItems = [],
  filteredCsvData,
  filteredCsvGroups,
  treatmentItemNumber = "",
  parentContainerRef = null,
  mappedChartingByGroup = [],
  setCsvCategory,
  csvCategory,
}) {
  const [isFlipped, setIsFlipped] = useState(false);
  const containerRef = useRef(null);
  useEffect(() => {
    const checkPosition = () => {
      if (!containerRef?.current || !parentContainerRef?.current) return;
      const containerRect = containerRef.current.getBoundingClientRect();
      const parentContainerRect =
        parentContainerRef?.current.getBoundingClientRect();
      const dropdownHeight = window?.innerHeight * 0.38;
      const spaceBelow = parentContainerRect?.bottom - containerRect?.bottom;
      // Flip if dropdown would overflow the bottom of the container
      if (dropdownHeight > spaceBelow) {
        setIsFlipped(true);
      } else {
        setIsFlipped(false);
      }
    };

    checkPosition();
    window.addEventListener("resize", checkPosition);
    return () => window.removeEventListener("resize", checkPosition);
  }, []);

  const [items, setItems] = useState(filteredCsvData || []);

  const mappedItemsTabs = items?.map((item) => {
    return (
      <Flex
        w="100%"
        key={`item - ${item?.["Item Number"]} ${item?.["Item Title"]}`}
        color="#151551"
        onClick={() => {
          if (!!onClickFunction) {
            onClickFunction(item);
            setIsOpen(false);
          }
        }}
        fontWeight={500}
        cursor={"pointer"}
      >
        <Flex direction="column" w="100%">
          <Flex
            gap="1rem"
            alignItems="center"
            px="2"
            py="2"
            _hover={{ bgColor: "gray.100" }}
            w="100%"
          >
            <Flex
              bgColor="#151551"
              padding="2px 10px"
              borderRadius="10px"
              justify="center"
            >
              <Text fontSize="11px" color="white">
                {item?.["Item Number"]}
              </Text>
            </Flex>
            <Text textAlign={"left"} fontSize="12px">
              {item?.["Item Title"]}
            </Text>
            <Flex cursor="pointer" minW="20px" minH="20px"></Flex>
          </Flex>
          <Divider opacity="1" w="100%" />
        </Flex>
      </Flex>
    );
  });

  const mappedItemsSimpleSearch = items?.map((item) => {
    return (
      <Flex
        w="100%"
        key={`item - ${item?.["Item Number"]} ${item?.["Item Title"]}`}
        onClick={() => {
          if (!!onClickFunction) {
            onClickFunction(item);
            setSearchValue(treatmentItemNumber);
            setIsOpen(false);
          }
        }}
        fontWeight={500}
        cursor={"pointer"}
        zIndex="999999999999"
      >
        <Flex direction="column" w="100%">
          <Flex
            alignItems="flex-start"
            _hover={{ bgColor: "gray.100" }}
            w="100%"
            gap="0.5rem"
            p="2"
          >
            <Text fontSize="14px" fontWeight="700">
              {item?.["Item Number"]}
            </Text>
            <Text fontSize="14px" fontWeight="700">
              {item?.["Item Title"]}
            </Text>
          </Flex>
          <Text fontSize="13px" px="2" pb="2">
            {item?.["Item Description"]}
          </Text>
          <Divider opacity="1" w="100%" />
        </Flex>
      </Flex>
    );
  });

  const [searchValue, setSearchValue] = useState<any>(
    treatmentItemNumber || "",
  );
  const mappedItemsSearch = items?.map((item) => {
    if (searchValue && item?.["Item Number"] !== searchValue) {
      return null;
    }
    return (
      <Flex
        w="100%"
        key={`item - ${item?.["Item Number"]} ${item?.["Item Title"]}`}
        onClick={() => {
          if (!!onClickFunction) {
            onClickFunction(item);
          }
        }}
        fontWeight={500}
        cursor={"pointer"}
      >
        <Flex direction="column" w="100%">
          <Flex
            gap="20px"
            alignItems="center"
            p="1"
            _hover={{ bgColor: "gray.100" }}
          >
            <Flex
              bgColor="darkBlueLogo"
              padding="4px 26px"
              w="100px"
              minW="100px"
              h="40px"
              justify="center"
              align="center"
            >
              <Text fontSize="14px" color="white" fontWeight="600">
                {item?.["Item Number"]}
              </Text>
            </Flex>
            <Flex direction="column">
              <Text textAlign={"left"} fontSize="14px" fontWeight="700">
                {item?.["Item Title"]}
              </Text>
              <Text textAlign={"left"} fontSize="12px">
                {item?.["Item Description"]}
              </Text>
            </Flex>
          </Flex>
          <Divider opacity="1" w="100%" />
        </Flex>
      </Flex>
    );
  });

  useEffect(() => {
    setItems(filteredCsvData);
  }, [filteredCsvData]);

  useEffect(() => {
    setSearchValue(treatmentItemNumber);
  }, [treatmentItemNumber]);
  const [isOpen, setIsOpen] = useState(displayType === "tabs");
  const hasRunEffect = useRef(false);

  useEffect(() => {
    if (!hasRunEffect.current) {
      hasRunEffect.current = true;
      return;
    }

    if (searchValue?.length > 0) {
      setIsOpen(true);
    }
  }, [searchValue, filteredCsvData]);

  const handleChange = (value) => {
    let newSearchValue = value;
    const splitValue = newSearchValue?.split(",");
    if (splitValue?.length > 1) {
      newSearchValue = splitValue[splitValue?.length - 1]?.trim();
    }
    if (newSearchValue?.length > 1) {
      let arrayOne = [];
      let arrayTwo = [];
      const seperatedData = filteredCsvData?.reduce((acc, item) => {
        const paddedItemNumber = item?.["Item Number"].padStart(3, "0");
        const includesItemNumber = paddedItemNumber
          .toLowerCase()
          .includes(newSearchValue);
        const includesDescription = item?.["Item Title"]
          .toLowerCase()
          .includes(newSearchValue);

        const correctSurfacesNumber =
          surfaceLength > 1 ? item?.["Surfaces"] == surfaceLength : true;
        if (
          (includesItemNumber || includesDescription) &&
          correctSurfacesNumber
        ) {
          arrayOne.push(item);
        } else {
          arrayTwo.push(item);
        }
      }, []);
      const filteredData = filteredCsvData?.filter((item) => {
        const paddedItemNumber = item?.["Item Number"].padStart(3, "0");
        const includesItemNumber = paddedItemNumber
          .toLowerCase()
          .includes(newSearchValue);
        const includesDescription = item?.["Item Title"]
          .toLowerCase()
          .includes(newSearchValue);
        const correctSurfacesNumber =
          surfaceLength > 1 ? item?.["Surfaces"] == surfaceLength : true;
        return (
          (includesItemNumber || includesDescription) && correctSurfacesNumber
        );
      });
      if (newSearchValue?.length > 1) {
        setItems([...arrayOne, ...arrayTwo]);
      } else {
        setItems(filteredCsvData);
      }
    } else {
      let arrayOne = [];
      let arrayTwo = [];
      for (const item of filteredCsvData) {
        if (item?.["Item Number"]?.[0] === newSearchValue) {
          arrayOne.push(item);
        } else {
          arrayTwo.push(item);
        }
      }
      setItems([...arrayOne, ...arrayTwo]);
    }
  };

  // useEffect(() => {
  //   if (surfaceLength > 1) {
  //     let arrayOne = []
  //     let arrayTwo = []
  //     const filteredData = csvData.reduce((acc, item) => {
  //       if (surfaceLength <= 5 && item?.["Surfaces"] == surfaceLength) {
  //         arrayOne.push(item)
  //       } else if (item?.["Surfaces"] == 5) {
  //         arrayOne.push(item)
  //       } else {
  //         arrayTwo.push(item)
  //       }
  //     }, [])

  //     setItems([...arrayOne, ...arrayTwo])
  //   } else {
  //     if (searchValue?.length > 1) {
  //       handleChange(searchValue)
  //     } else {
  //       setItems(csvData)
  //     }
  //   }
  // }, [surfaceLength])

  if (displayType == "search") {
    return (
      <Flex direction="column" p="20px">
        <Flex
          align={"center"}
          border={"2px"}
          borderRadius={"6px"}
          borderColor={"darkBlueLogo"}
          w="100%"
        >
          <Search className="mr-2 h-4 w-8 shrink-0 opacity-50 text-[#071B89]" />
          <input
            className="flex h-11 w-full bg-transparent py-3 text-sm outline-none font-semibold placeholder:text-darkBlue text-darkBlue "
            value={searchValue}
            onChange={(event) => {
              handleChange(event.target.value);
              setSearchValue(event.target.value);
            }}
            placeholder="Search (by # or name)"
          />
          <X
            className="mr-2 h-4 w-8 shrink-0 opacity-50 text-[#071B89] hover:cursor-pointer"
            onClick={() => {
              setSearchValue("");
              setItems(filteredCsvData);
              setIsOpen(false);
            }}
          />
        </Flex>
        <Flex w="100%" h="38vh">
          <Flex
            overflow="scroll"
            zIndex="100000000"
            direction="column"
            bgColor="white"
            padding="2"
          >
            {mappedItemsSearch}
          </Flex>
        </Flex>
      </Flex>
    );
  }

  useOutsideClick({
    ref: containerRef,
    handler: () => setIsOpen(displayType == "tabs" ? true : false),
  });

  if (displayType == "simpleSearch") {
    return (
      <Flex
        flexDirection="column"
        position="relative"
        ref={containerRef}
        w="100%"
      >
        <Flex
          align={"center"}
          border={"1px solid #F1ECEC"}
          borderRadius="6px"
          // borderColor={"darkBlueLogo"}
          // borderBottom="2px"
          //w="100%"
          onClick={() => {
            setIsOpen(true);
          }}
        >
          <Input
            // fontSize="14px"

            fontSize={{ base: "13px", md: "14px" }}
            border="0px solid"
            _active={{ border: "0" }}
            _focus={{ border: "0" }}
            _hover={{ border: "0" }}
            // borderColor="#ccc"
            borderRadius={"6px"}
            textAlign={"left"}
            autoFocus
            value={searchValue !== "none" ? searchValue : ""}
            // defaultValue={
            //   items?.find((item) => item?.["Item Number"] == searchValue)
            //     ? items?.find((item) => item?.["Item Number"] == searchValue)[
            //         "Item Number"
            //       ] +
            //       " - " +
            //       items?.find((item) => item?.["Item Number"] == searchValue)[
            //         "Item Title"
            //       ]
            //     : searchValue
            // }
            placeholder="Search by Item Number"
            onChange={(event) => {
              handleChange(event.target.value);
              setSearchValue(event.target.value);
            }}
          />
        </Flex>
        {isOpen && (
          <Flex
            h="36vh"
            // maxW="92%"

            //h={"500px"}
            boxShadow="lg"
            position="absolute"
            top={"100%"}
            // style={{
            //   position: "absolute",
            //   top: isFlipped ? "-38vh" : "100%",
            //   left: 0,
            //   zIndex: 999999999999999999999,
            // }}
            mt="1"
            border={"1px solid"}
            borderColor="scLightGrey"
            borderRadius="8px"
            bgColor="white"
            zIndex="999999999999999"
          >
            <Flex
              overflow="scroll"
              direction="column"
              bgColor="white"
              padding="2"
              position="relative"
              zIndex="9999999999999999999"
            >
              {searchValue === "none" ||
              searchValue === "" ||
              items
                ?.map((item) => item?.["Item Number"])
                ?.includes(searchValue) ? null : (
                <Flex
                  w="100%"
                  onClick={() => {
                    if (!!onClickFunction) {
                      const item = {
                        "Item Number": searchValue,
                        "Item Title": "",
                        "Item Description": "Custom",
                      };
                      onClickFunction(item);

                      setIsOpen(false);
                    }
                  }}
                  fontWeight={500}
                  cursor={"pointer"}
                  zIndex="999999999999"
                >
                  <Flex direction="column" w="100%">
                    <Flex
                      alignItems="flex-start"
                      _hover={{ bgColor: "gray.100" }}
                      w="100%"
                      gap="0.5rem"
                      p="2"
                    >
                      <Text fontSize="14px" fontWeight="700">
                        {searchValue}
                      </Text>
                      <Text fontSize="14px" fontWeight="700">
                        - Custom
                      </Text>
                    </Flex>

                    <Divider opacity="1" w="100%" />
                  </Flex>
                </Flex>
              )}
              {mappedItemsSimpleSearch}
            </Flex>
          </Flex>
        )}
      </Flex>
    );
  }
  if (displayType == "tabs") {
    return (
      <Flex w="100%" flexDirection={"column"}>
        <Flex w="100%" h="100%" direction="column">
          {highlightedChart == "proposed" && (
            <Flex w="100%">
              <Tabs colorScheme="blue" w="100%" defaultIndex={0}>
                <TabList>
                  <Tab
                    fontWeight="700"
                    fontSize="13px"
                    p="3"
                    m="0"
                    w="100%"
                    color="darkBlueLogo"
                    _hover={{
                      bgColor: "white",
                    }}
                    _selected={{
                      fontWeight: "700",
                      color: "#007AFF",
                      bgColor: "white",
                      borderBottom: "2px solid #007AFF",
                    }}
                    borderRadius="0px"
                  >
                    TREATMENT
                  </Tab>
                  <Tab
                    fontWeight="700"
                    fontSize="13px"
                    p="3"
                    m="0"
                    w="100%"
                    _hover={{
                      bgColor: "white",
                    }}
                    color="darkBlueLogo"
                    _selected={{
                      fontWeight: "700",
                      color: "#007AFF",
                      bgColor: "white",
                      borderBottom: "2px solid #007AFF",
                    }}
                    borderRadius="0px"
                  >
                    ADA ITEMS
                  </Tab>
                </TabList>

                <TabPanels>
                  <TabPanel h="40vh" overflow={"scroll"} py="2" px="1">
                    <SimpleGrid columns={2} spacing={1} padding={0}>
                      {mappedChartingItems}
                    </SimpleGrid>
                  </TabPanel>
                  <TabPanel h="40vh" overflow={"scroll"} py="2" px="1">
                    <Flex w="100%" flexDirection="column" gap="0.5rem" p="1">
                      <InputGroup
                        borderRadius={"8px"}
                        border="1px solid"
                        borderColor="scLightGrey"
                      >
                        <InputLeftElement pointerEvents="none">
                          <chakra.span
                            className={"material-symbols-outlined"}
                            verticalAlign={"middle"}
                            fontSize={"28px"}
                            color={"primary"}
                            ml="4"
                          >
                            interests
                          </chakra.span>
                        </InputLeftElement>

                        <Select
                          onChange={(e) => {
                            setCsvCategory(e.target.value);
                          }}
                          value={csvCategory}
                          border="none"
                          textAlign={"center"}
                          fontSize={"12px"}
                          fontWeight={"700"}
                        >
                          <option value="all">Categories (All)</option>
                          {/* <option value="all">All</option> */}
                          {filteredCsvGroups?.map((item) => (
                            <option
                              key={`${item} - search filter`}
                              value={item}
                            >
                              {item}
                            </option>
                          ))}
                        </Select>
                      </InputGroup>
                      <InputGroup
                        borderRadius={"8px"}
                        border="1px solid"
                        borderColor="scLightGrey"
                        onClick={() => {
                          setIsOpen(true);
                        }}
                      >
                        {/* <Search className="mr-2 h-4 w-8 shrink-0 opacity-50 text-[#071B89]" /> */}
                        <InputLeftElement pointerEvents="none">
                          <chakra.span
                            className={"material-symbols-outlined"}
                            verticalAlign={"middle"}
                            fontSize={"28px"}
                            color={"primary"}
                            ml={"4"}
                          >
                            manage_search
                          </chakra.span>
                        </InputLeftElement>
                        <input
                          className="flex h-11 w-full bg-transparent py-2 text-xs text-center outline-none font-bold placeholder:text-black text-black "
                          value={searchValue}
                          onChange={(event) => {
                            handleChange(event.target.value);
                            setSearchValue(event.target.value);
                          }}
                          placeholder="Search Treatments"
                        />
                        {/* <X
                          className="mr-2 h-4 w-8 shrink-0 opacity-50 text-[#071B89] hover:cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation()
                            setSearchValue("")
                            setItems(filteredCsvData)
                            setIsOpen(false)
                          }}
                        /> */}
                      </InputGroup>

                      {/* {!isOpen && csvCategory !== "all" && (
                      <SimpleGrid columns={2} spacing={1} padding={0}>
                        {mappedChartingByGroup}
                      </SimpleGrid>
                    )} */}

                      {isOpen && (
                        <Flex
                          h="29vh"
                          //boxShadow="lg"
                          //position="absolute"
                          //top="50px"
                          border={"1px solid"}
                          borderColor="scLightGrey"
                        >
                          <Flex
                            overflow="scroll"
                            //zIndex="100000000"
                            direction="column"
                            //bgColor="white"

                            //position="relative"
                          >
                            {mappedItemsTabs}
                          </Flex>
                        </Flex>
                      )}
                    </Flex>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </Flex>
            // <Flex direction="column" position="relative">
            //   <Divider opacity="1" w="100%" mb="10px" />
            //   <Flex
            //     align={"center"}
            //     border={"2px"}
            //     borderRadius={"6px"}
            //     borderColor={"darkBlueLogo"}
            //     w="100%"
            //     onClick={() => {
            //       setIsOpen(true);
            //     }}
            //   >
            //     <Search className="mr-2 h-4 w-8 shrink-0 opacity-50 text-[#071B89]" />
            //     <input
            //       className="flex h-11 w-full bg-transparent py-3 text-sm outline-none font-semibold placeholder:text-darkBlue text-darkBlue "
            //       value={searchValue}
            //       onChange={(event) => {
            //         handleChange(event.target.value);
            //         setSearchValue(event.target.value);
            //       }}
            //       placeholder="Search (by # or name)"
            //     />
            //     <X
            //       className="mr-2 h-4 w-8 shrink-0 opacity-50 text-[#071B89] hover:cursor-pointer"
            //       onClick={(e) => {
            //         e.stopPropagation();
            //         setSearchValue("");
            //         setItems(filteredCsvData);
            //         setIsOpen(false);
            //       }}
            //     />
            //   </Flex>
            //   {isOpen && (
            //     <Flex
            //       h="38vh"
            //       maxW="88%"
            //       boxShadow="lg"
            //       position="absolute"
            //       top="50px"
            //     >
            //       <Flex
            //         overflow="scroll"
            //         zIndex="100000000"
            //         direction="column"
            //         bgColor="white"
            //         padding="2"
            //         position="relative"
            //       >
            //         {mappedItemsTabs}
            //       </Flex>
            //     </Flex>
            //   )}
            //   <SimpleGrid columns={2} spacing={1} padding={2}>
            //     {mappedChartingItems}
            //   </SimpleGrid>
            // </Flex>
          )}
          {highlightedChart == "existing" && (
            <Flex w="100%">
              <Tabs colorScheme="blue" w="100%" defaultIndex={0}>
                <TabList>
                  <Tab
                    fontWeight="700"
                    fontSize="13px"
                    p="3"
                    m="0"
                    w="100%"
                    color="darkBlueLogo"
                    _hover={{
                      bgColor: "white",
                    }}
                    _selected={{
                      fontWeight: "700",
                      color: "#007AFF",
                      bgColor: "white",
                      borderBottom: "2px solid #007AFF",
                    }}
                    borderRadius="0px"
                  >
                    CONDITION
                  </Tab>
                  <Tab
                    fontWeight="700"
                    fontSize="13px"
                    p="3"
                    m="0"
                    w="100%"
                    _hover={{
                      bgColor: "white",
                    }}
                    color="darkBlueLogo"
                    _selected={{
                      fontWeight: "700",
                      color: "#007AFF",
                      bgColor: "white",
                      borderBottom: "2px solid #007AFF",
                    }}
                    borderRadius="0px"
                  >
                    EXISTING
                  </Tab>
                </TabList>

                <TabPanels>
                  <TabPanel maxH="41vh" overflow={"scroll"} py="2" px="1">
                    <SimpleGrid columns={2} spacing={1} padding={0}>
                      {mappedConditionItems}
                    </SimpleGrid>
                  </TabPanel>
                  <TabPanel h="41vh" overflow={"scroll"} py="2" px="1">
                    <SimpleGrid columns={2} spacing={1} padding={0}>
                      {mappedConditionExistingItems}
                    </SimpleGrid>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </Flex>
            // <Flex w="100%">
            //   <Flex
            //     overflow="scroll"
            //     //zIndex="100000000"
            //     direction="column"
            //     bgColor="white"
            //     padding="1"
            //     w="100%"
            //   >
            //     <SimpleGrid columns={2} spacing={1} padding={0}>
            //       {mappedConditionItems}
            //     </SimpleGrid>
            //   </Flex>
            // </Flex>
          )}
        </Flex>
      </Flex>
    );
  }
}
