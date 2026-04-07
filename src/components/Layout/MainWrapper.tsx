import { Box, Flex } from "@chakra-ui/react";
import { MainNavbar } from "components/Layout/MainNavbar";
import useQueryHook from "hooks/useQueryHook";
import { gql } from "graphql-request";
import MainFooter from "components/Layout/MainFooter";

type AccountWrapperType = {
  children: any;
};

export const MainWrapper = (props) => {
  const { children, ...rest }: AccountWrapperType = props;
  const viewerQuery = gql`
    query Viewer {
      viewer {
        ... on User {
          id
          fullName
          firstName
          lastName
          friendlyName
          userTitle
          userPreferredName
          photo {
            url @transform(handle: "x100x100")
          }
        }
      }
    }
  `;
  const viewerQueryResult = useQueryHook(["viewerQuery"], viewerQuery, {});

  return (
    <Flex
      height="100vh"
      w="100vw"
      direction="column"
      boxSizing="border-box"
      align="center"
      fontFamily="Inter"
    >
      <Flex
        minHeight="0"
        grow={2}
        flex="1 2 auto"
        w="100%"
        overflowX="hidden"
        direction="column"
      >
        <Box minHeight="0" mt="100px">
          <MainNavbar />
          {props.children}
          <MainFooter />
        </Box>
      </Flex>
    </Flex>
  );
};
