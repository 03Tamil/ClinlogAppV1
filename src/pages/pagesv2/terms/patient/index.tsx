// @ts-nocheck
import { Box, Container, Skeleton } from "@chakra-ui/react";
import SiteAgreement from "componentsv2/SiteAgreements/SiteAgreement";
import SiteAgreementNav from "componentsv2/SiteAgreements/SiteAgreementNav";
import SiteAgreementWrapper from "componentsv2/SiteAgreements/SiteAgreementWrapper";
import PageHeader from "componentsv2/Styling/PageHeader";
import { gql } from "graphql-request";
import { publicApiHook } from "hooks/useQueryHook";

export default function PatientTermsAndConditionsPage() {
  const patientTermsAndConditionsQuery = gql`
    query patientTermsAndConditionsQuery {
      siteAgreement: entry(
        section: "siteAgreements"
        type: "patientTermsAndConditions"
        orderBy: "dateCreated desc"
      ) {
        id
        slug
        title
        ... on siteAgreements_patientTermsAndConditions_Entry {
          id
          siteAgreementFull
        }
      }
    }
  `;
  const siteAgreementResult = publicApiHook(
    ["patientTermsAndConditionsQuery"],
    patientTermsAndConditionsQuery,
  );
  const siteAgreementEntry = siteAgreementResult?.data?.siteAgreement ?? null;

  const isLoaded = !siteAgreementResult.isLoading;

  return (
    <Box bgColor={"white"}>
      <PageHeader
        title={"Patient terms & conditions"}
        breadcrumbs={[
          {
            title: "Patient terms & conditions",
          },
        ]}
        justBreadcrumbs={true}
      />
      <SiteAgreementWrapper
        activeName={"PatientTermsAndConditions"}
        isLoaded={isLoaded}
      >
        {siteAgreementEntry?.siteAgreementFull ? (
          <SiteAgreement
            siteAgreementRichText={siteAgreementEntry.siteAgreementFull}
          />
        ) : null}
      </SiteAgreementWrapper>
    </Box>
  );
}

PatientTermsAndConditionsPage.auth = {
  public: true,
};
