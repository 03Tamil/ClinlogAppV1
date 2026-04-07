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
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import { Search, X } from "lucide-react";
import { MdClose } from "react-icons/md";
import useQueryHook, { sendData } from "hooks/useQueryHook";
import { useMutation } from "@tanstack/react-query";
import { gql } from "graphql-request";

export default function AdaSidebarV2({
  searchBarItems = [],
  onClickFunction,
  surfaceLength,
  diagnosisConditionsOptions = [],
  showCharting,
  setShowCharting,
}) {
  const [csvData, setData] = useState([]);
  const [conditionsData, setConditionsData] = useState([]);

  useEffect(() => {
    // Fetch the CSV file from the public folder
    fetch("/itemnumbers.csv")
      .then((response) => response.text())
      .then((csvText) => {
        // Parse the CSV text
        Papa.parse(csvText, {
          header: true,
          complete: (result) => {
            setData(result.data);
          },
        });
      })
      .catch((error) => console.error("Error fetching CSV file:", error));

    fetch("/conditions.csv")
      .then((response) => response.text())
      .then((csvText) => {
        // Parse the CSV text
        Papa.parse(csvText, {
          header: true,
          complete: (result) => {
            setConditionsData(result.data);
          },
        });
      })
      .catch((error) => console.error("Error fetching CSV file:", error));
  }, []);

  const [items, setItems] = useState(searchBarItems || []);

  const mappedItems = items.map((item) => {
    return (
      <Flex
        w="100%"
        key={`item - ${item?.["Item Number"]} ${item?.["Item Title"]}`}
        color="darkBlueLogo"
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
            gap="10px"
            alignItems="center"
            p="1"
            _hover={{ bgColor: "gray.100" }}
          >
            <Flex bgColor="darkBlueLogo" padding="4px 10px" borderRadius="8px">
              <Text fontSize="14px" color="white">
                {item?.["Item Number"]}
              </Text>
            </Flex>
            <Text textAlign={"left"} fontSize="14px">
              {item?.["Item Title"]}
            </Text>
            <Flex cursor="pointer" minW="20px" minH="20px"></Flex>
          </Flex>
          <Divider opacity="1" w="100%" />
        </Flex>
      </Flex>
    );
  });

  const mappedConditions = conditionsData.map((item) => {
    return (
      <Flex
        w="100%"
        color="darkBlueLogo"
        key={`item - ${item?.["condition name"]}`}
        onClick={() => {
          if (!!onClickFunction) {
            onClickFunction(item, "condition");
          }
        }}
        fontWeight={500}
        cursor={"pointer"}
      >
        <Flex direction="column" w="100%">
          <Flex
            gap="10px"
            alignItems="center"
            p="1"
            _hover={{ bgColor: "gray.100" }}
          >
            <Text fontSize="14px" color="medBlueLogo">
              {/* {item?.["condition name"]} */}
            </Text>
            <Text textAlign={"left"} fontSize="14px">
              {item?.["condition name"]}
            </Text>
          </Flex>
          <Divider opacity="1" w="100%" />
        </Flex>
      </Flex>
    );
  });

  useEffect(() => {
    setItems(csvData);
  }, [csvData]);

  // useEffect(() => {
  //   const favouriteItems =
  //     favouritesResult?.data?.viewer?.treatmentFavourites?.map(
  //       (item) => item?.col1
  //     )

  //   const filteredData = csvData.filter((item) => {
  //     const includesItemNumber = favouriteItems?.includes(item?.["Item Number"])
  //     return includesItemNumber
  //   })
  //   setFavouriteItems(filteredData)
  // }, [favouritesResult?.data])

  const [searchValue, setSearchValue] = useState("");

  const handleChange = (value) => {
    const filteredData = csvData.filter((item) => {
      const paddedItemNumber = item?.["Item Number"].padStart(3, "0");
      const includesItemNumber = paddedItemNumber.toLowerCase().includes(value);
      const includesDescription = item?.["Item Title"]
        .toLowerCase()
        .includes(value);
      const correctSurfacesNumber =
        surfaceLength > 1 ? item?.["Surfaces"] == surfaceLength : true;
      return (
        (includesItemNumber || includesDescription) && correctSurfacesNumber
      );
    });

    if (value?.length > 1) {
      setItems(filteredData);
    } else {
      setItems(csvData);
    }
  };

  useEffect(() => {
    if (surfaceLength > 1) {
      const filteredData = csvData.filter((item) => {
        if (surfaceLength <= 5) {
          return item?.["Surfaces"] == surfaceLength;
        }
        return item?.["Surfaces"] == 5;
      });
      setItems(filteredData);
      // const filteredFavouritesData = favouriteItems.filter((item) => {
      //   if (surfaceLength <= 5) {
      //     return item?.["Surfaces"] == surfaceLength
      //   }
      //   return item?.["Surfaces"] == 5
      // })
      // setFavouriteItems(filteredFavouritesData)
    } else {
      if (searchValue?.length > 1) {
        handleChange(searchValue);
      } else {
        setItems(csvData);
      }
    }
  }, [surfaceLength]);

  return (
    <Flex flexDirection={"column"} gap="1rem" minW="300px" h="100%">
      <Flex w="100%" flexDirection={"column"}>
        <Flex alignItems="center" w="100%" p="2">
          <Box
            p="1"
            cursor="pointer"
            onClick={() => {
              setShowCharting(false);
            }}
          >
            <MdClose />
          </Box>
          <Spacer />
          <Text
            w="100%"
            textAlign="center"
            textTransform="uppercase"
            fontWeight="600"
            color="#071B89"
          >
            Charting
          </Text>
          <Spacer />
        </Flex>
        <Divider opacity="1" w="100%" mb="10px" />
        <Flex w="100%" h="100%">
          <ChakraTabs w="100%" align="center" variant="soft-rounded">
            <ChakraTabList
              bgColor="#E2EFFC"
              // w="60%"
              borderRadius="25px"
              fontWeight="500"
              fontFamily="inter"
              color="#333333"
              p="1"
            >
              <Tab
                fontWeight="400"
                fontSize="12px"
                py="1"
                px="3"
                m="0"
                color="darkBlueLogo"
                _selected={{
                  fontWeight: "700",
                  color: "#007AFF",
                  bgColor: "white",
                }}
              >
                Items
              </Tab>
              <Tab
                fontWeight="400"
                fontSize="12px"
                py="1"
                px="3"
                m="0"
                color="darkBlueLogo"
                _selected={{
                  fontWeight: "700",
                  color: "#007AFF",
                  bgColor: "white",
                }}
              >
                Conditions
              </Tab>
              {/* <Tab
              fontWeight="400"
              fontSize="12px"
              py="1"
              px="3"
              m="0"
              color="darkBlueLogo"
              _selected={{
                fontWeight: "700",
                color: "#007AFF",
                bgColor: "white",
              }}
            >
              Favourites
            </Tab> */}
            </ChakraTabList>
            <TabPanels w="100%">
              <TabPanel w="100%">
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
                      setItems(csvData);
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
                    {mappedItems}
                  </Flex>
                </Flex>
              </TabPanel>
              <TabPanel>
                <Flex w="100%" h="38vh">
                  <Flex
                    overflow="scroll"
                    zIndex="100000000"
                    direction="column"
                    bgColor="white"
                    padding="1"
                  >
                    {mappedConditions}
                  </Flex>
                </Flex>
              </TabPanel>
              {/* <TabPanel w="100%">
              <Flex w="100%" h="38vh">
                <Flex
                  overflow="scroll"
                  zIndex="100000000"
                  direction="column"
                  bgColor="white"
                  padding="2"
                >
                  {mappedFavouriteItems}
                </Flex>
              </Flex>
            </TabPanel> */}
            </TabPanels>
          </ChakraTabs>
        </Flex>
      </Flex>
    </Flex>
  );
}
