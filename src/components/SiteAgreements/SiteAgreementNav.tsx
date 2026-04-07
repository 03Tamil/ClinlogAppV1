import {Box, Container, Divider, HStack, Link, Skeleton, Stack, Text, Wrap, WrapItem} from "@chakra-ui/react";
import { isStaff } from "helpers/Permissions";
import { useSession } from "next-auth/react";
import NextLink from "next/link";

type SiteAgreementNav = {
  isActive: "WebsiteTermsAndConditions" | "PatientTermsAndConditions" | "StaffTermsAndConditions" | "PrivacyPolicy" | "SensitiveInformationPolicy"
}

export default function SiteAgreementNav({isActive}: SiteAgreementNav) {
  const { data: session } = useSession()

  const userIsStaff = session && isStaff(session?.groups)
  
  return (
    <Skeleton isLoaded={session !== undefined}>
      <Box>
        <Wrap mb={"1rem"} flexDirection={{base: "column", lg: "row"}}>
          <WrapItem>
            <Link color={"primary"} fontWeight={isActive === "WebsiteTermsAndConditions" ? "600" : "400"} as={NextLink} href={"/terms"}>
              <Text>Website Terms &amp; Conditions</Text>
            </Link>
          </WrapItem>
          <WrapItem>
            <Text color={"dark"}>|</Text>
          </WrapItem>
          <WrapItem>
            <Link color={"primary"} fontWeight={isActive === "PatientTermsAndConditions" ? "600" : "400"} as={NextLink} href={"/terms/patient"}>
              <Text>Patient Terms &amp; Conditions</Text>
            </Link>
          </WrapItem>
          {userIsStaff ? (
            <>
              <WrapItem>
                <Text color={"dark"}>|</Text>
              </WrapItem>
              <WrapItem>
                <Link color={"primary"} fontWeight={isActive === "StaffTermsAndConditions" ? "600" : "400"} as={NextLink} href={"/terms/staff"}>
                  <Text>Staff Terms &amp; Conditions</Text>
                </Link>
              </WrapItem>
            </>
          ) : null}
          <WrapItem>
            <Text color={"dark"}>|</Text>
          </WrapItem>
          <WrapItem>
            <Link color={"primary"} fontWeight={isActive === "PrivacyPolicy" ? "600" : "400"}  as={NextLink} href={"/privacy"}>
              <Text>Privacy Policy</Text>
            </Link>
          </WrapItem>
          <WrapItem>
            <Text color={"dark"}>|</Text>
          </WrapItem>
          <WrapItem>
            <Link color={"primary"} fontWeight={isActive === "SensitiveInformationPolicy" ? "600" : "400"}  as={NextLink} href={"/sensitive-information"}>
              <Text>Sensitive Information Policy</Text>
            </Link>
          </WrapItem>
        </Wrap>
        <Divider my="1rem"/>
      </Box>
    </Skeleton>
  )
}