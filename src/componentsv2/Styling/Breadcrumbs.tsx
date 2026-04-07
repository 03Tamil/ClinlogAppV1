import {
  Container,
  Divider,
  Flex,
  Link,
  Text,
  Wrap,
  Box,
  chakra,
  Icon,
} from "@chakra-ui/react";
import { isPatient, isStaff } from "helpersv2/Permissions";
import { useSession } from "next-auth/react";
import { V2Link } from "../Dashboard/Helpers/routerHelpers";
import { IoHomeSharp } from "react-icons/io5";

export type Breadcrumb = {
  title: string;
  url?: string;
};

export type BreadcrumbProps = {
  color?: string;
  breadcrumbs?: Breadcrumb[];
};

export default function Breadcrumbs({
  breadcrumbs: breadCrumbs,
  color = "white",
}: BreadcrumbProps) {
  const { data: session } = useSession();
  const userIsStaff = session && isStaff(session?.groups);
  const userIsPatient = session && isPatient(session?.groups);

  return (
    <Wrap
      textTransform={"uppercase"}
      fontSize={{ base: "12px", lg: "15px" }}
      color={color}
      py={{ base: 3, lg: 4 }}
      px={"5"}
      fontWeight={"700"}
      align="center"
    >
      <Link
        href={userIsStaff && !userIsPatient ? `/pagesv2/dashboard` : `/pagesv2`}
        as={V2Link}
        _hover={{
          opacity: 0.8,
          scale: 1.05,
        }}
        transition={"all 0.2s ease-in-out"}
      >
        <Text mb={0} display={{ base: "block", lg: "none" }}>
          <Icon
            as={IoHomeSharp}
            verticalAlign={"middle"}
            color={"#007AFF"}
            fontSize={"1.5rem"}
          />
        </Text>
        <Text mb={0} display={{ base: "none", lg: "block" }}>
          Home
        </Text>
      </Link>
      {breadCrumbs.map((breadcrumb, i) => {
        return (
          <Flex key={i}>
            <Text px={{ base: 2, lg: 5 }} mb={0}>
              {">"}
            </Text>
            {i == breadCrumbs.length - 1 ? (
              <Text mb={0}>{breadcrumb.title}</Text>
            ) : (
              <Link
                href={breadcrumb.url}
                as={V2Link}
                mb={0}
                _hover={{
                  opacity: 0.8,
                  scale: 1.05,
                }}
                transition={"all 0.2s ease-in-out"}
              >
                {breadcrumb.title}
              </Link>
            )}
          </Flex>
        );
      })}
    </Wrap>
  );
}
