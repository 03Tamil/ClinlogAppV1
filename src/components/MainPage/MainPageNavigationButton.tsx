import {Box, Divider, Flex, Heading, Icon, Text, Link, Spacer} from "@chakra-ui/react";
import {MdArrowForward, MdAssignment, MdChevronRight} from "react-icons/md";
import {RiQuestionMark} from "react-icons/ri";
import {IconType} from "react-icons";
import NextLink from "next/link";

type MainPageNavigationButtonType = {
  heading?: String,
  description?: String,
  actionDescription?: String,
  icon?: IconType,
  url?: String
}

export default function MainPageNavigationButton({heading, description, actionDescription, icon, url}: MainPageNavigationButtonType) {
  return (
    <>
      <Link href={`${url}`} as={NextLink}>
        <Flex
          bgColor={"white"}
          rounded={"0.5rem"}
          width={"100%"}
          height={"100%"}
          flexDirection={"column"}
          justifyContent={"space-between"}
        >
          <Flex
            gap={"1rem"}
            p={"1rem"}
            alignItems={"center"}
          >
            <Icon
              as={icon ?? RiQuestionMark}
              fontSize="96px"
              color="primary"
            />
            <Box>
              <Heading color={"primary"} size={"md"} mb={"0.6rem"}>{heading ?? "#HEADING#"}</Heading>
              <Text>{description ?? "#DESCRIPTION#"}</Text>
            </Box>
          </Flex>
          <Box>
            <Divider/>
            <Flex px={"1rem"} py={"0.5rem"} justifyContent={"space-between"} alignItems={"center"}>
              <Heading color={"primary"} size={"sm"} mb={"0rem"} textTransform={"uppercase"}>{actionDescription ?? "#ACTION#"}</Heading>
              <Icon as={MdChevronRight} color={"primary"}/>
            </Flex>
          </Box>
        </Flex>
      </Link>
    </>
  )
}