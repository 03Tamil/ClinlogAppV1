import FocusLock from "react-focus-lock"

import { EditIcon } from "@chakra-ui/icons"
import {
  FormControl,
  FormLabel,
  Input,
  Stack,
  ButtonGroup,
  Button,
  useDisclosure,
  Popover,
  PopoverTrigger,
  IconButton,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  Box,
  Flex,
} from "@chakra-ui/react"
import { forwardRef, useRef } from "react"

const PopoverForm = (props) => {
  const { children, column, table } = props
  const firstFieldRef = useRef(null)
  const columnFilterValue = column.getFilterValue()

  return (
    <>
      <Popover initialFocusRef={firstFieldRef} size="sm">
        <PopoverTrigger>
          <Button padding=" 4px 2px" fontSize="12px" height="fit-content" backgroundColor="darkBlue">
            {children}
          </Button>
        </PopoverTrigger>
        <PopoverContent p={5}>
          <PopoverArrow />
          <PopoverCloseButton />
          <Input
            size="sm"
            mt="10px"
            ref={firstFieldRef}
            value={(columnFilterValue ?? "") as string}
            onChange={(e) => column.setFilterValue(e.target.value)}
          />
          <Flex>
            <Button size="sm" onClick={() => column.toggleSorting(false)}>
              Asc
            </Button>
            <Button size="sm" onClick={() => column.toggleSorting(true)}>
              Dsc
            </Button>
          </Flex>
        </PopoverContent>
      </Popover>
    </>
  )
}

export default PopoverForm
