// @ts-nocheck
import { Box, Container, Skeleton } from "@chakra-ui/react";
import FullscreenLoadingSpinner from "components/FullscreenLoadingSpinner";
import SiteAgreement from "components/SiteAgreements/SiteAgreement";
import SiteAgreementNav from "components/SiteAgreements/SiteAgreementNav";
import SiteAgreementWrapper from "components/SiteAgreements/SiteAgreementWrapper";
import PageHeader from "components/Styling/PageHeader";
import { PrivacyPolicy } from "components/Terms/PrivacyPolicy";
import { gql } from "graphql-request";
import useQueryHook, { publicApiHook } from "hooks/useQueryHook";

export default function PrivacyPolicyPage() {
  const privacyPolicyQuery = gql`
    query getSiteAgreement {
      siteAgreement: entry(
        section: "siteAgreements"
        type: "privacyPolicy"
        orderBy: "dateCreated desc"
      ) {
        id
        slug
        title
        ... on siteAgreements_privacyPolicy_Entry {
          id
          siteAgreementFull
        }
      }
    }
  `;
  const privacyPolicyResult = publicApiHook(
    ["privacyPolicyQuery"],
    privacyPolicyQuery,
  );
  const privacyPolicyEntry = privacyPolicyResult?.data?.siteAgreement ?? null;

  const isLoaded = !privacyPolicyResult.isLoading;

  return (
    <Box bgColor={"white"}>
      <PageHeader
        title={"Privacy Policy"}
        breadcrumbs={[
          {
            title: "Privacy Policy",
          },
        ]}
        justBreadcrumbs={true}
      />
      <SiteAgreementWrapper activeName={"PrivacyPolicy"} isLoaded={isLoaded}>
        {privacyPolicyEntry?.siteAgreementFull ? (
          <SiteAgreement
            siteAgreementRichText={privacyPolicyEntry.siteAgreementFull}
          />
        ) : null}
      </SiteAgreementWrapper>
    </Box>
  );
}

PrivacyPolicyPage.auth = {
  public: true,
};
