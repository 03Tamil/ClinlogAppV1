import { Box, Container, Skeleton } from "@chakra-ui/react";
import SiteAgreementNav from "./SiteAgreementNav";

type SiteAgreementWrapper = {
  children: React.ReactNode;
  activeName:
    | "WebsiteTermsAndConditions"
    | "PatientTermsAndConditions"
    | "StaffTermsAndConditions"
    | "PrivacyPolicy"
    | "SensitiveInformationPolicy";
  isLoaded: boolean;
};

export default function SiteAgreementWrapper({
  children,
  activeName,
  isLoaded,
  ...props
}) {
  return (
    // <Container size={"main"} {...props}>
    <Box p="2rem">
      {/* <SiteAgreementNav isActive={activeName} /> */}
      <Skeleton isLoaded={isLoaded} height={!isLoaded ? "100vw" : null}>
        {children}
      </Skeleton>
    </Box>
    // </Container>
  );
}
