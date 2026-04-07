// @ts-nocheck
import { Box, Container, Skeleton } from "@chakra-ui/react";
import SiteAgreement from "components/SiteAgreements/SiteAgreement";
import SiteAgreementNav from "components/SiteAgreements/SiteAgreementNav";
import SiteAgreementWrapper from "components/SiteAgreements/SiteAgreementWrapper";
import PageHeader from "components/Styling/PageHeader";
import { gql } from "graphql-request";
import useQueryHook, { publicApiHook } from "hooks/useQueryHook";

export default function StaffTermsAndConditionsPage() {
  const staffTermsAndConditionsQuery = gql`
    query staffTermsAndConditionsQuery {
      siteAgreement: entry(
        section: "siteAgreements"
        type: "staffTermsAndConditions"
        orderBy: "dateCreated desc"
      ) {
        id
        slug
        title
        ... on siteAgreements_staffTermsAndConditions_Entry {
          id
          siteAgreementFull
        }
      }
    }
  `;
  const siteAgreementResult = useQueryHook(
    ["staffTermsAndConditionsQuery"],
    staffTermsAndConditionsQuery,
  );
  const siteAgreementEntry = siteAgreementResult?.data?.siteAgreement ?? null;

  const isLoaded = !siteAgreementResult.isLoading;

  return (
    <Box bgColor={"white"}>
      <PageHeader
        title={"Staff terms & conditions"}
        breadcrumbs={[
          {
            title: "Staff terms & conditions",
          },
        ]}
        justBreadcrumbs={true}
      />
      <SiteAgreementWrapper
        activeName={"StaffTermsAndConditions"}
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
StaffTermsAndConditionsPage.auth = {
  public: true,
};
