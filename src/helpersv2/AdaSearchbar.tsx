import { Flex, Text } from "@chakra-ui/react"
import React, { useEffect, useState } from "react"
import Papa from "papaparse"
import { Search, X } from "lucide-react"

export default function AdaSearchbar({ searchBarItems = [], onClickFunction }) {
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

  const mappedItems = items.map((item) => {
    return (
      <div
        key={`item - ${item?.["Item Number"]} ${item?.["Item Title"]}`}
        className="relative flex 
              cursor-pointer select-none items-center rounded-md py-3 px-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground text-darkBlue 
              font-semibold w-full"
        onClick={() => {
          if (!!onClickFunction) {
            onClickFunction(item)
            setItems([])
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
          <Text fontWeight="400">{item?.["Item Description"]}</Text>
        </Flex>
      </div>
    )
  })
  const handleChange = (e) => {
    const value = e.target.value || ""
    const filteredData = csvData.filter((item) => {
      const includesItemNumber = item?.["Item Number"]
        .toLowerCase()
        .includes(value)
      const includesDescription = item?.["Item Title"]
        .toLowerCase()
        .includes(value)
      return includesItemNumber || includesDescription
    })

    if (value?.length > 1) {
      setItems(filteredData)
    } else {
      setItems([])
    }
  }
  return (
    <div>
      <div className="flex items-center border-2 px-3 w-[100%] h-[40px] rounded-lg border-[#071B89] bg-[#D3E1FB]">
        <Search className="mr-2 h-4 w-8 shrink-0 opacity-50 text-[#071B89]" />
        <input
          className="font-normal flex h-11 w-full bg-transparent py-3 text-sm outline-none font-semibold placeholder:text-darkBlue text-darkBlue "
          onChange={(event) => handleChange(event)}
          placeholder="Search Items (by # or name)"
        />
        <X
          className="mr-2 h-4 w-8 shrink-0 opacity-50 text-[#071B89] hover:cursor-pointer"
          onClick={() => {
            setItems([])
          }}
        />
      </div>
      {mappedItems?.length > 0 && (
        <Flex>
          <Flex
            w="400px"
            position="absolute"
            overflow="scroll"
            h="600px"
            zIndex="100000000"
            direction="column"
            bgColor="white"
            boxShadow="lg"
            padding="10px"
          >
            {mappedItems}
          </Flex>
        </Flex>
      )}
    </div>
  )
}
