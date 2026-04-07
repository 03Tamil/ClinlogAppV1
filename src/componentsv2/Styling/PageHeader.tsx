import {
  AspectRatio,
  Box,
  Button,
  Container,
  Flex,
  Grid,
  GridItem,
  Heading,
  Icon,
  Image,
  Text,
} from "@chakra-ui/react";
import { MdOutlineChevronRight } from "react-icons/md";
import Breadcrumbs, { Breadcrumb } from "componentsv2/Styling/Breadcrumbs";
import { useSession } from "next-auth/react";
import { isPatient, isStaff } from "helpersv2/Permissions";

type pageHeaderProps = {
  title?: String;
  subheading?: String;
  imageUrl?: String;
  breadcrumbs?: Breadcrumb[];
  justBreadcrumbs?: boolean;
};

export default function PageHeader({
  title,
  subheading,
  imageUrl,
  breadcrumbs,
  justBreadcrumbs,
}: pageHeaderProps) {
  return (
    <>
      <Flex
        bgColor={"darkBlueLogo"}
        backgroundImage={`url("/blue-connect-background.jpg")`}
        backgroundSize={"cover"}
        minHeight={"25vh"}
        alignItems={"center"}
        display={justBreadcrumbs ? "none" : "flex"}
      >
        <Container size={"main"}>
          <Grid
            templateColumns={{
              base: "repeat(1, 1fr)",
              lg: "repeat(2, 1fr)",
            }}
            py={12}
          >
            <GridItem colSpan={1}>
              <Heading color={"primary"} textTransform={"uppercase"}>
                {title ?? "#TITLE#"}
              </Heading>
              {subheading && (
                <Text color={"white"} mt={4} fontSize={"lg"}>
                  {subheading}
                </Text>
              )}
            </GridItem>
          </Grid>
        </Container>
      </Flex>
      {breadcrumbs?.length && (
        <Box  bgColor={"#E2EFFC"}>
          <Container size={"main"}>
            <Breadcrumbs breadcrumbs={breadcrumbs} color={"scBlue"} />
          </Container>
        </Box>
      )}
    </>
  );
}
