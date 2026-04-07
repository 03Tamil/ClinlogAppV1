import { Flex, Heading, Spinner } from "@chakra-ui/react"

export default function FullHeightLoadingSpinner({ ...rest }) {
  return (
    <Flex
      height={"100%"}
      width={"100%"}
      alignItems={"center"}
      justifyContent={"center"}
      bgColor={"gray.100"}
      {...rest}
    >
      <Spinner color={"primary"} size={"xl"} />
    </Flex>
  )
}