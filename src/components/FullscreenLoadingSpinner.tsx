import { Flex, Heading, Spinner } from "@chakra-ui/react"

export default function FullscreenLoadingSpinner() {
  return (
    <Flex
      minHeight={"100vh"}
      width={"100%"}
      alignItems={"center"}
      justifyContent={"center"}
    >
      <Spinner color={"primary"} size={"xl"} />
    </Flex>
  )
}
