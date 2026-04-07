import { Input } from "@chakra-ui/react"
import { useAtom } from "jotai"
import React from "react"
import {
  filtersAtom,
  filterTypeAtom,
  globalFilterAtom,
  locationDateLimitAtom,
} from "../store/store"

export default function Searchbar({ columnName, ...props }: any) {
  const [value, setValue] = React.useState("")
  const [globalFilter, setGlobalFilter] = useAtom(globalFilterAtom)
  const [columnFilters, setColumnFilters] = useAtom(filtersAtom)
  const [filterType, setFilterType] = useAtom(filterTypeAtom)
  const [locationDateLimit, setLocationDateLimit] = useAtom(
    locationDateLimitAtom
  )

  React.useEffect(() => {
    if (columnName === "all") {
      setGlobalFilter(value)
      if (!!value) {
        setLocationDateLimit(false)
      }
    } else {
      if (value) {
        setColumnFilters((prev) => [{ id: columnName, value }])
      } else {
        setColumnFilters([])
      }
    }
    return () => {}
  }, [value])

  const searchValuePlaceHolder = {
    all: "Search",
    consults: "Search Consults",
    leads: "Search Leads",
    booked: "Search Booked",
    recall: "Search Recall",
  }

  return (
    <Input
      size="md"
      placeholder={searchValuePlaceHolder[filterType]}
      borderRadius="2000px"
      textAlign="center"
      value={value}
      focusBorderColor="gray.200"
      onChange={(e) => setValue(e.target.value)}
      {...props}
    />
  )
}
