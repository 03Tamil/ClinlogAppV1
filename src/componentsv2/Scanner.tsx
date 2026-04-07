import { Button, Flex, Heading, Input, useDisclosure } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Text,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { on } from "events";
import test from "node:test";
import { ref } from "yup";

export default function Scanner({
  type = "standard",
  handleScanImplant,
  selectedFullTooth = undefined,
  chartStatus = "",
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [testInput, setTestInput] = useState<string>();
  const [testInput2, setTestInput2] = useState<string>();
  const [refString, setRefString] = useState<string>();
  const [lotString, setLotString] = useState<string>();
  const [firstDate, setFirstDate] = useState<string>();
  const [secondDate, setSecondDate] = useState<string>();

  const { control, register, setValue, getValues } = useForm({});

  const initialRef = React.useRef(null);
  const fakeDatabase = {
    "0107630031737922": {
      brand: "Straumann",
      type: "Straight 4.6mm",
      length: "1.5mm",
      serial: testInput,
    },
  };
  console.log(selectedFullTooth, "selectedFullTooth");
  useEffect(() => {
    if (testInput?.length > 0) {
      const localRefString = testInput?.slice(0, 16);
      setLotString(testInput?.slice(-5));
      setRefString(testInput?.slice(0, 16));
      setFirstDate(testInput?.slice(-15, -7));
      setSecondDate(testInput?.slice(-23, -15));
      // setValue("implantBrand", fakeDatabase[localRefString]?.brand)
      setValue("implantBrand", fakeDatabase[localRefString]?.brand);
      // setValue("implantType", fakeDatabase[localRefString]?.type)
      // setValue("implantLength", fakeDatabase[localRefString]?.length)
      // setValue("serial", fakeDatabase[localRefString]?.serial)

      if (type !== "standard") {
        const refId = testInput?.slice(0, 16);
        console.log("refId scanner", refId);
        handleScanImplant(selectedFullTooth?.[1], refId);
      }
      onClose();
      setTestInput2(testInput);
      setTestInput("");
    }
  }, [testInput]);

  return (
    <Flex
      direction="column"
      h="100%"
      w="100%"
      padding="0px 10px"
      justify="center"
    >
      <Button onClick={onOpen} variant="outline" padding="30px" border="0px">
        <Flex direction="column">
          <span
            className="material-symbols-outlined"
            style={{
              fontSize: "40px",
            }}
          >
            barcode_scanner
          </span>
          <Heading fontSize="10px" textAlign="center">
            SCAN COMPONENT
          </Heading>
        </Flex>
      </Button>
      {/* <Flex
        direction="column"
        borderRadius="0px 0px 6px 6px"
        border="1px solid #F5F5F5"
        background="#FFF"
        boxShadow="0px 4px 4px 0px rgba(0, 0, 0, 0.05)"
        mb="20px"
      >
        <Flex
          w="100%"
          bgColor="#0E11C7"
          h="35px"
          align="center"
          justify="center"
        >
          <Heading color="white" textTransform="uppercase" fontSize="12px">
            Selected Area
          </Heading>
        </Flex>
        <Flex w="100%">
          <Flex w="50%" justify="center" padding="16px" gap="10px">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="33"
              height="46"
              viewBox="0 0 33 46"
              fill="none"
            >
              <path
                d="M16.5 26.6667C22.0456 26.6667 20.2717 45 23.3889 45C26.5061 45 27.8581 27.07 28.5556 23C29.1842 19.37 32 15.6667 32 9.25C32 2.485 26.9883 1 25.0078 1C21.4944 1 20.3061 2.14583 16.5 2.14583C12.6939 2.14583 11.5142 1 7.99222 1C6.01167 1 1 2.485 1 9.25C1 15.6667 3.81583 19.37 4.44444 23C5.14194 27.07 6.49389 45 9.61111 45C12.7283 45 10.9544 26.6667 16.5 26.6667Z"
                stroke="#4D4D4D"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <Flex direction="column" justify="center" align="center">
              <Text
                fontWeight="900"
                fontSize="12px"
                mb="0px"
                lineHeight="normal"
              >
                TOOTH
              </Text>
              <Text fontWeight="800" fontSize="32px" lineHeight="normal">
                18
              </Text>
            </Flex>
          </Flex>
          <Flex w="50%" align="center">
            <Button
              onClick={onOpen}
              variant="outline"
              padding="30px"
              border="0px"
            >
              <Flex direction="column">
                <span
                  className="material-symbols-outlined"
                  style={{
                    fontSize: "40px",
                  }}
                >
                  barcode_scanner
                </span>
                <Heading fontSize="10px" textAlign="center">
                  SCAN COMPONENT
                </Heading>
              </Flex>
            </Button>
          </Flex>
        </Flex>
      </Flex> */}
      {type === "standard" && (
        <Flex direction="column">
          <Heading fontSize="22px">Tst: {testInput2}</Heading>
          <Heading fontSize="22px">Ref: {refString}</Heading>
          <Heading fontSize="22px">Lot: {lotString}</Heading>
          <Heading fontSize="22px">First Date: {firstDate}</Heading>
          <Heading fontSize="22px">Second Date: {secondDate}</Heading>
          <Flex direction="column" mt="20px">
            <Text
              color="#0E11C7"
              textTransform={"uppercase"}
              fontSize={"14px"}
              fontWeight={"900"}
              textAlign={"left"}
            >
              Implant Brand
            </Text>
            <Input
              borderColor="#E4E4E7"
              color="#071B89"
              fontSize="13px"
              {...register("implantBrand")}
              _placeholder={{
                opacity: 1,
                color: "darkBlueLogo",
              }}
            />
            <Flex>
              <Flex direction="column">
                <Text
                  color="#0E11C7"
                  textTransform={"uppercase"}
                  fontSize={"14px"}
                  fontWeight={"900"}
                  textAlign={"left"}
                >
                  Implant Type
                </Text>
                <Input
                  borderColor="#E4E4E7"
                  color="#071B89"
                  fontSize="13px"
                  {...register("implantType")}
                  _placeholder={{
                    opacity: 1,
                    color: "darkBlueLogo",
                  }}
                />
              </Flex>
              <Flex direction="column">
                <Text
                  color="#0E11C7"
                  textTransform={"uppercase"}
                  fontSize={"14px"}
                  fontWeight={"900"}
                  textAlign={"left"}
                >
                  Implant Length
                </Text>
                <Input
                  borderColor="#E4E4E7"
                  color="#071B89"
                  fontSize="13px"
                  {...register("implantLength")}
                  _placeholder={{
                    opacity: 1,
                    color: "darkBlueLogo",
                  }}
                />
              </Flex>
            </Flex>
            <Text
              color="#0E11C7"
              textTransform={"uppercase"}
              fontSize={"14px"}
              fontWeight={"900"}
              textAlign={"left"}
            >
              Serial
            </Text>
            <Input
              borderColor="#E4E4E7"
              color="#071B89"
              fontSize="13px"
              {...register("serial")}
              _placeholder={{
                opacity: 1,
                color: "darkBlueLogo",
              }}
            />
          </Flex>
        </Flex>
      )}
      <Modal isOpen={isOpen} onClose={onClose} initialFocusRef={initialRef}>
        <ModalOverlay />
        <ModalContent
          onClick={() => {
            initialRef.current.focus();
          }}
        >
          <ModalHeader
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            padding="14px 20px"
            borderBottom="1px solid #E2E8F0"
            bgColor="#F7FAFC"
            borderTopRadius="8"
          >
            <Heading
              color="#0099FF"
              fontSize="14px"
              fontWeight="700"
              fontFamily="Inter"
              textTransform="uppercase"
            >
              Scan Component
            </Heading>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {chartStatus === "approved" ? (
              <Flex gap="10px">
                <span
                  className="material-symbols-outlined"
                  style={{
                    fontSize: "40px",
                  }}
                >
                  barcode_scanner
                </span>
                <Input
                  // type="hidden"
                  ref={initialRef}
                  //onChange={(e) => setTestInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      setTestInput(e.currentTarget.value);
                    }
                  }}
                />
              </Flex>
            ) : (
              <Text color="red" fontSize="14px">
                Proposal Chart should be approved before adding components.
              </Text>
            )}
          </ModalBody>
          {/* <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button variant="ghost">Secondary Action</Button>
          </ModalFooter> */}
        </ModalContent>
      </Modal>
    </Flex>
  );
}
