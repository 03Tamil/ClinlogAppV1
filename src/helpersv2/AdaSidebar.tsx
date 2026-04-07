import { Divider, Flex, Text } from "@chakra-ui/react"
import React, { useEffect, useState } from "react"
import Papa from "papaparse"
import { Search, X } from "lucide-react"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "src/uicomponents/ui/tabs"

export default function AdaSidebar({
  searchBarItems = [],
  onClickFunction,
  surfaceLength,
}) {
  const [csvData, setData] = useState([])
  useEffect(() => {
    // Fetch the CSV file from the public folder
    fetch("/itemnumbers.csv")
      .then((response) => response.text())
      .then((csvText) => {
        // Parse the CSV text
        Papa.parse(csvText, {
          header: true,
          complete: (result) => {
            setData(result.data)
          },
        })
      })
      .catch((error) => console.error("Error fetching CSV file:", error))
  }, [])

  const [items, setItems] = useState(searchBarItems || [])
  const conditions = [
    {
      "Item Number": "1",
      "Item Title": "Condition 1",
    },
    {
      "Item Number": "2",
      "Item Title": "Condition 2",
    },
    {
      "Item Number": "3",
      "Item Title": "Condition 3",
    },
    {
      "Item Number": "4",
      "Item Title": "Condition 4",
    },
    {
      "Item Number": "5",
      "Item Title": "Condition 5",
    },
    {
      "Item Number": "6",
      "Item Title": "Condition 6",
    },
    {
      "Item Number": "7",
      "Item Title": "Condition 7",
    },
    {
      "Item Number": "8",
      "Item Title": "Condition 8",
    },
    {
      "Item Number": "9",
      "Item Title": "Condition 9",
    },
    {
      "Item Number": "10",
      "Item Title": "Condition 10",
    },
  ]

  const mappedItems = items.map((item) => {
    return (
      <div
        key={`item - ${item?.["Item Number"]} ${item?.["Item Title"]}`}
        className="relative flex 
              cursor-pointer select-none items-center rounded-md py-1 px-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground text-darkBlue 
              font-semibold w-full"
        onClick={() => {
          if (!!onClickFunction) {
            onClickFunction(item)
          }
        }}
      >
        <Flex direction="column">
          <Flex gap="10px" mb="6px" alignItems="center">
            <Text fontSize="16px" color="medBlueLogo">
              {item?.["Item Number"]}
            </Text>
            <Text>{item?.["Item Title"]}</Text>
          </Flex>
          <Divider opacity="1" w="100%" />
        </Flex>
      </div>
    )
  })

  const mappedConditions = conditions.map((item) => {
    return (
      <div
        key={`item - ${item?.["Item Number"]} ${item?.["Item Title"]}`}
        className="relative flex 
              cursor-pointer select-none items-center rounded-md py-1 px-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground text-darkBlue 
              font-semibold w-full"
        onClick={() => {
          if (!!onClickFunction) {
            onClickFunction(item)
          }
        }}
      >
        <Flex direction="column">
          <Flex gap="10px" mb="6px" alignItems="center">
            <Text fontSize="16px" color="medBlueLogo">
              {item?.["Item Number"]}
            </Text>
            <Text>{item?.["Item Title"]}</Text>
          </Flex>
          <Divider opacity="1" w="100%" />
        </Flex>
      </div>
    )
  })

  useEffect(() => {
    setItems(csvData)
  }, [csvData])

  const [searchValue, setSearchValue] = useState("")
  const handleChange = (value) => {
    const filteredData = csvData.filter((item) => {
      const includesItemNumber = item?.["Item Number"]
        .toLowerCase()
        .includes(value)
      const includesDescription = item?.["Item Title"]
        .toLowerCase()
        .includes(value)
      const correctSurfacesNumber =
        surfaceLength > 1 ? item?.["Surfaces"] == surfaceLength : true

      return (
        (includesItemNumber || includesDescription) && correctSurfacesNumber
      )
    })

    if (value?.length > 1) {
      setItems(filteredData)
    } else {
      setItems(csvData)
    }
  }

  useEffect(() => {
    if (surfaceLength > 1) {
      const filteredData = csvData.filter((item) => {
        if (surfaceLength <= 5) {
          return item?.["Surfaces"] == surfaceLength
        }
        return item?.["Surfaces"] == 5
      })
      setItems(filteredData)
    } else {
      if (searchValue?.length > 1) {
        handleChange(searchValue)
      } else {
        setItems(csvData)
      }
    }
  }, [surfaceLength])

  return (
    <div className="border-l p-2 flex flex-col w-full">
      <Flex alignItems="center" w="100%" padding="10px">
        <Text
          w="100%"
          textAlign="center"
          textTransform="uppercase"
          fontWeight="600"
          color="#071B89"
        >
          Charting
        </Text>
      </Flex>
      <Divider opacity="1" w="100%" mb="10px" />
      <Tabs defaultValue="items" className="w-full my-2 h-[100%]">
        <TabsList>
          <TabsTrigger value="items">Items</TabsTrigger>
          <TabsTrigger value="conditions">Conditions</TabsTrigger>
        </TabsList>
        <TabsContent value="items" className="">
          <div className="flex items-center border-2 px-3 w-[100%] h-[40px] rounded-lg border-[#071B89] bg-[#D3E1FB]">
            <Search className="mr-2 h-4 w-8 shrink-0 opacity-50 text-[#071B89]" />
            <input
              className="font-normal flex h-11 w-full bg-transparent py-3 text-sm outline-none font-semibold placeholder:text-darkBlue text-darkBlue "
              value={searchValue}
              onChange={(event) => {
                handleChange(event.target.value)
                setSearchValue(event.target.value)
              }}
              placeholder="Search Items (by # or name)"
            />
            <X
              className="mr-2 h-4 w-8 shrink-0 opacity-50 text-[#071B89] hover:cursor-pointer"
              onClick={() => {
                setSearchValue("")
                setItems(csvData)
              }}
            />
          </div>
          <Flex h="40%" position="fixed">
            <Flex
              // position="absolute"
              overflow="scroll"
              zIndex="100000000"
              direction="column"
              bgColor="white"
              padding="10px"
            >
              {mappedItems}
            </Flex>
          </Flex>
        </TabsContent>
        <TabsContent value="conditions">
          <Flex>
            <Flex
              // position="absolute"
              overflow="scroll"
              h="80%"
              zIndex="100000000"
              direction="column"
              bgColor="white"
              padding="10px"
            >
              {mappedConditions}
            </Flex>
          </Flex>
        </TabsContent>
      </Tabs>
    </div>
  )
}
