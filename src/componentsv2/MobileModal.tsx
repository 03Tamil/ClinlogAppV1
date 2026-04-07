import { ChevronDownIcon, NotAllowedIcon } from "@chakra-ui/icons"
import {
  Text,
  Box,
  Button,
  Checkbox,
  CloseButton,
  Flex,
  Heading,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Radio,
  RadioGroup,
  RangeSlider,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  RangeSliderTrack,
  Select,
  Stack,
  Tag,
  TagLabel,
} from "@chakra-ui/react"
import { AnimatePresence } from "framer-motion"
import { useAtom } from "jotai"
import { useState } from "react"
import { ChakraBox } from "../helpersv2/customs"
import { filterToggleAtom, sortingAtom } from "../store/store"

export default function MobileModal() {
  const [isOpen, toggle] = useAtom(filterToggleAtom)
  const [sortingValue, setSorting] = useAtom(sortingAtom)
  const [range, setRange] = useState([100, 7000])
  return (
    <AnimatePresence exitBeforeEnter>
      {isOpen && (
        <ChakraBox
          key={102312930912}
          height="100vh"
          width="100vw"
          bgColor="#F7F7F7"
          position="fixed"
          zIndex={1001}
          initial={{ opacity: 0.25, x: 0, y: "100vh" }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: 0, y: "100vh" }}
          // @ts-ignore
          transition={{ duration: 0.5 }}
        >
          <Flex justify="space-around" padding="20px">
            <Button leftIcon={<NotAllowedIcon />} variant="solid">
              Reset
            </Button>
            <CloseButton onClick={() => toggle(false)} size="lg" />
          </Flex>
          <Flex
            justify="center"
            direction="column"
            align="center"
            padding="10px 10px"
          >
            <Flex width="100%" justify="space-around">
              <Tag size="md" colorScheme="blue" borderRadius="full">
                <TagLabel>Residency</TagLabel>
                <Checkbox ml="10px" />
              </Tag>
              <Tag size="md" colorScheme="blue" borderRadius="full">
                <TagLabel>Photoshoot</TagLabel>
                <Checkbox ml="10px" />
              </Tag>
              <Tag size="md" colorScheme="blue" borderRadius="full">
                <TagLabel>Pro Bono</TagLabel>
                <Checkbox ml="10px" />
              </Tag>
            </Flex>
            <Stack spacing={3} mt="20px" width="100%">
              <Select
                icon={<ChevronDownIcon />}
                variant="filled"
                placeholder="Follow Ups"
              >
                <option value="option1">Option 1</option>
                <option value="option2">Option 2</option>
                <option value="option3">Option 3</option>
              </Select>
              <Select
                icon={<ChevronDownIcon />}
                variant="filled"
                placeholder="Role"
              >
                <option value="option1">Option 1</option>
                <option value="option2">Option 2</option>
                <option value="option3">Option 3</option>
              </Select>
              <Select
                icon={<ChevronDownIcon />}
                variant="filled"
                placeholder="Status"
              />
              <Select
                icon={<ChevronDownIcon />}
                variant="filled"
                placeholder="Clinic"
              />
              <Select
                icon={<ChevronDownIcon />}
                variant="filled"
                placeholder="Enquiry Type"
              />
            </Stack>
            <Heading mt="20px" size="md">
              Revenue
            </Heading>
            <Heading size="md">
              min {range[0]} max {range[1]}
            </Heading>
            <RangeSlider
              onChangeEnd={(val) => setRange(val)}
              aria-label={["min", "max"]}
              defaultValue={range}
              max={50000}
            >
              <RangeSliderTrack> 
                <RangeSliderFilledTrack />
              </RangeSliderTrack>
              <RangeSliderThumb index={0} />
              <RangeSliderThumb index={1} />
            </RangeSlider>
            <Heading mt="20px" size="md">
              Sort By
            </Heading>
            {/* <RadioGroup
              onChange={(next) => setSorting(next)}
              value={sortingValue}
              width="100%"
            >
              <Stack direction="column">
                <Flex justify="space-around" w="100%">
                  <Text>Date Asc</Text>
                  <Radio value="1"></Radio>
                </Flex>
                <Radio value="2">Date Dsc</Radio>
                <Radio value="3">Revenue Asc</Radio>
              </Stack>
            </RadioGroup> */}
          </Flex>
        </ChakraBox>
      )}
    </AnimatePresence>
  )
}
