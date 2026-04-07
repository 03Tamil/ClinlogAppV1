import { useOutsideClick } from "@chakra-ui/react"
import { Search } from "lucide-react"
import React, { useEffect, useRef, useState } from "react"

export default function OptionSearchbar({ options, onClickFunction }) {
  const [open, setOpen] = useState(false)
  const [searchValue, setSearchValue] = useState("")
  const ref = useRef()
  useOutsideClick({
    ref: ref,
    handler: () => setOpen(false),
  })
  useEffect(() => {
    if (searchValue.length === 0) {
      setOpen(false)
    } else {
      setOpen(true)
    }
  }, [searchValue?.length])

  const mappedOptions = options?.map((item) => {
    return (
      <div
        className="z-[20000000] relative flex 
          cursor-pointer select-none items-center rounded-md py-3 px-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground text-darkBlue 
          font-semibold w-full"
        onClick={() => {
          setOpen(false)
          if (!!onClickFunction) {
            onClickFunction(item?.title)
          }
        }}
      >
        {item?.title}
      </div>
    )
  })

  return (
    <div
      className="relative z-5 items-center justify-center shadow-md w-[100%]"
      ref={ref}
    >
      <div className="z-[1] flex items-center border-2 px-3 w-[100%] h-[40px] rounded-3xl border-white bg-[rgb(153,162,214)]">
        <Search className="mr-2 h-4 w-8 shrink-0 opacity-50" />
        <input
          className="flex h-11 w-full rounded-lg bg-transparent py-3 text-sm outline-none font-semibold placeholder:text-darkBlue text-darkBlue"
          onChange={(e) => setSearchValue(e.target.value)}
          value={searchValue}
          placeholder="Search"
          onClick={() => setOpen(true)}
        />
      </div>
      {open && mappedOptions?.length > 0 ? (
        <div className="h-[200px] absolute z-[2000] bg-white overflow-hidden py-1 px-2 w-full rounded-md shadow-xl mt-1">
          {mappedOptions}
        </div>
      ) : null}
    </div>
  )
}
