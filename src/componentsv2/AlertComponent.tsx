import { WarningTwoIcon } from "@chakra-ui/icons"
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  chakra,
  Container,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  InputLeftAddon,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  Radio,
  RadioGroup,
  Select,
  Textarea,
  Tooltip,
  Stack,
  Text,
  Box,
} from "@chakra-ui/react"
// import { addLead, spamOrLeadBtnClick } from 'helpers/leadUtils';
import React, { useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { FaExclamationCircle, FaPlusCircle } from "react-icons/fa"
import { MdWarningAmber } from "react-icons/md"
import { IoIosCloseCircleOutline, IoMdCloseCircle } from "react-icons/io"
import { IoPersonAddOutline } from "react-icons/io5"
const AlertComponent: React.FC<{
  addLeadBtnClick?: any
  handleSpamLeadBtnClick?: any
  message?: any
  data?: any
  leadStatusMessage?: string
  locationChange?: boolean
  handleLocationChange?: any
  showAlert?: boolean
  setShowAlert?: any
}> = ({
  addLeadBtnClick,
  handleSpamLeadBtnClick,
  message,
  data,
  leadStatusMessage,
  locationChange,
  handleLocationChange,
  showAlert,
  setShowAlert
}) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const queryClient = useQueryClient()
    const addLeadBtnHandler = () => {
      const leadData = data
      leadData.duplicateStatus = false
      //addLead(leadData,queryClient);
      addLeadBtnClick(leadData)
      onClose()
    }
    const spamRemoveBtnHandler = (status) => {
      //spamOrLeadBtnClick(data?.id, "spam",queryClient, data?.websiteenquired);
      handleSpamLeadBtnClick(data?.id, status, data?.firstName, data)
      onClose()
    }
    // Trigger the alert when there's a message
    React.useEffect(() => {
      if ((message || data) && showAlert) {
        onOpen()
      }
    }, [message, data, showAlert, onOpen])

    return (
      // <AlertDialog isOpen={isOpen} onClose={onClose} leastDestructiveRef={undefined}>
      //   <AlertDialogOverlay>
      //     <AlertDialogContent>
      //       <AlertDialogHeader>Alert</AlertDialogHeader>
      //       <AlertDialogBody >{message}</AlertDialogBody>
      //       <AlertDialogFooter>
      //         <Button onClick={onClose}>Close</Button>
      //       </AlertDialogFooter>
      //     </AlertDialogContent>
      //   </AlertDialogOverlay>
      // </AlertDialog>
      <Modal isOpen={isOpen} size={"md"} onClose={onClose} onCloseComplete={() => setShowAlert(false)}>
        <ModalOverlay />
        <ModalContent borderRadius="none">
          <ModalHeader
            fontSize={"14px"}
            bgColor={"xlDarkBlueLogo"}
            color={"white"}
            textTransform={"uppercase"}
            border={"1px solid #fff"}
            padding={"8px 20px"}
          >
            <Stack spacing={2} direction={"row"}>
              <Flex mr={2} fontSize={"32px"}>
                <MdWarningAmber />{" "}
              </Flex>
              {locationChange ? (
                <Flex align="center">New Lead Location Update</Flex>
              ) : (
                <Flex align="center">Duplicate Lead Detected</Flex>
              )}
              {/* header */}
            </Stack>
          </ModalHeader>
          <ModalCloseButton my={"0.1rem"} color={"white"} />
          <ModalBody padding={"0px"}>
            <Container mt={"2rem"} mb={"3rem"} fontFamily="Inter" whiteSpace="normal">
              {locationChange
                ? ""
                : <Text fontSize={"14px"} textAlign="center" >Information from this lead has been detected as a possible duplicate.</Text>}
              <br></br>
              {locationChange ? (
                <Box>
                  <Flex>
                    <Text fontSize={"14px"} textAlign="center" >Are you sure you want to update the location of this lead?
                      <br></br>
                      Selected Location : <b>{data?.locationInfo}</b>
                    </Text>
                  </Flex>
                  <br></br>
                  <Flex>
                    <Button colorScheme={'blue'} onClick={() => { handleLocationChange(data); onClose(); }}>Update</Button>
                  </Flex>

                </Box>
              ) : (
                <Flex direction={"column"} fontSize="14px">
                  {(data && data?.firstName) && (<Text align="center">
                    <Text fontWeight="bold">Name </Text>
                    <Text>{data?.firstName} {data?.lastName}</Text><br />
                  </Text>)
                  }
                  {message?.email && (
                    <Text align="center">
                      <Text fontWeight="bold">Email</Text>
                      <Text>{message?.email}</Text><br />
                    </Text>
                  )}

                  {message?.homePhone && (
                    <Text align="center">
                      <Text fontWeight="bold">Home Phone </Text>
                      <Text>{message?.homePhone}</Text><br />
                    </Text>
                  )}
                  {message?.mobilePhone && (
                    <Text align="center">
                      <Text fontWeight="bold">Mobile Phone </Text>
                      <Text>{message?.mobilePhone}</Text><br />
                    </Text>
                  )}
                </Flex>
              )}
              {locationChange ? (
                ""
              ) : (
                <>
                  {/* <Text>
                    Verify and click to make it as <b>Spam</b> or proceed to add
                    as <b>Lead</b>.
                  </Text> */}
                  <Stack mt={4} direction={"column"} spacing="2">
                    <Button
                      borderRadius={"none"}
                      border={"none"}
                      leftIcon={<FaPlusCircle fontSize={"22px"} />}
                      size="sm"
                      variant="outline"
                      onClick={addLeadBtnHandler}
                      backgroundColor={"green.400"}
                      color="white"
                      textTransform="uppercase"
                      px={"2rem"}
                    >
                      Add Lead Anyway
                    </Button>
                    {/* <Button
                      px={"2rem"}
                      borderRadius={"none"}
                      leftIcon={<FaExclamationCircle fontSize={"24px"} />}
                      size="sm"
                      display={data?.duplicateStatus ? "none" : "flex"}
                      variant="outline"
                      onClick={() => spamRemoveBtnHandler("spam")}
                      backgroundColor={"#da8d01"}
                      color="white"
                      textTransform="uppercase">
                      Spam
                    </Button> */}
                    <Button
                      px={"2rem"}
                      borderRadius={"none"}
                      border={"none"}
                      leftIcon={<IoMdCloseCircle fontSize={"22px"} />}
                      size="sm"
                      display={data?.duplicateStatus ? "flex" : "none"}
                      variant="outline"
                      onClick={() => spamRemoveBtnHandler("duplicate")}
                      backgroundColor={"#ce4129"}
                      color="white"
                      textTransform="uppercase">
                      Remove
                    </Button>

                  </Stack>
                </>
              )}
            </Container>
          </ModalBody>
        </ModalContent>
      </Modal>
    )
  }

export default AlertComponent
