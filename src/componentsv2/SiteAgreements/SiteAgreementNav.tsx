import {Box, Container, Divider, HStack, Link, Skeleton, Stack, Text, Wrap, WrapItem} from "@chakra-ui/react";
import { isStaff } from "helpersv2/Permissions";
import { useSession } from "next-auth/react";
import { V2Link } from "../Dashboard/Helpers/routerHelpers";

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
            <Link color={"primary"} fontWeight={isActive === "WebsiteTermsAndConditions" ? "600" : "400"} as={V2Link} href={"/pagesv2/terms"}>
              <Text>Website Terms &amp; Conditions</Text>
            </Link>
          </WrapItem>
          <WrapItem>
            <Text color={"dark"}>|</Text>
          </WrapItem>
          <WrapItem>
            <Link color={"primary"} fontWeight={isActive === "PatientTermsAndConditions" ? "600" : "400"} as={V2Link} href={"/pagesv2/terms/patient"}>
              <Text>Patient Terms &amp; Conditions</Text>
            </Link>
          </WrapItem>
          {userIsStaff ? (
            <>
              <WrapItem>
                <Text color={"dark"}>|</Text>
              </WrapItem>
              <WrapItem>
                <Link color={"primary"} fontWeight={isActive === "StaffTermsAndConditions" ? "600" : "400"} as={V2Link} href={"/pagesv2/terms/staff"}>
                  <Text>Staff Terms &amp; Conditions</Text>
                </Link>
              </WrapItem>
            </>
          ) : null}
          <WrapItem>
            <Text color={"dark"}>|</Text>
          </WrapItem>
          <WrapItem>
            <Link color={"primary"} fontWeight={isActive === "PrivacyPolicy" ? "600" : "400"}  as={V2Link} href={"/pagesv2/privacy"}>
              <Text>Privacy Policy</Text>
            </Link>
          </WrapItem>
          <WrapItem>
            <Text color={"dark"}>|</Text>
          </WrapItem>
          <WrapItem>
            <Link color={"primary"} fontWeight={isActive === "SensitiveInformationPolicy" ? "600" : "400"}  as={V2Link} href={"/pagesv2/sensitive-information"}>
              <Text>Sensitive Information Policy</Text>
            </Link>
          </WrapItem>
        </Wrap>
        <Divider my="1rem"/>
      </Box>
    </Skeleton>
  )
}