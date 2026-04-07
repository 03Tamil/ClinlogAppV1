// @ts-nocheck
import {
  Box,
  Container,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
} from "@chakra-ui/react";
import FullscreenLoadingSpinner from "components/FullscreenLoadingSpinner";
import SiteAgreement from "components/SiteAgreements/SiteAgreement";
import SiteAgreementNav from "components/SiteAgreements/SiteAgreementNav";
import SiteAgreementWrapper from "components/SiteAgreements/SiteAgreementWrapper";
import PageHeader from "components/Styling/PageHeader";
import { SensitiveInformation } from "components/Terms/SensitiveInformation";
import { gql } from "graphql-request";
import useQueryHook, { publicApiHook } from "hooks/useQueryHook";

export default function SensitiveInformationPage() {
  const sensitiveInformationPolicyQuery = gql`
    query getSiteAgreement {
      siteAgreement: entry(
        section: "siteAgreements"
        type: "sensitiveInformationPolicy"
        orderBy: "dateCreated desc"
      ) {
        id
        slug
        title
        ... on siteAgreements_sensitiveInformationPolicy_Entry {
          id
          siteAgreementFull
        }
      }
    }
  `;
  const sensitiveInformationPolicyResult = publicApiHook(
    ["sensitiveInformationPolicyQuery"],
    sensitiveInformationPolicyQuery,
  );
  const sensitiveInformationPolicyEntry =
    sensitiveInformationPolicyResult?.data?.siteAgreement ?? null;

  const isLoaded = !sensitiveInformationPolicyResult.isLoading;

  return (
    <Box bgColor={"white"}>
      <PageHeader
        title={"Sensitive Information Policy"}
        breadcrumbs={[
          {
            title: "Sensitive Information Policy",
          },
        ]}
        justBreadcrumbs={true}
      />
      <SiteAgreementWrapper
        activeName={"SensitiveInformationPolicy"}
        isLoaded={isLoaded}
      >
        {!sensitiveInformationPolicyResult.isLoading ? (
          <SiteAgreement
            siteAgreementRichText={
              sensitiveInformationPolicyEntry.siteAgreementFull
            }
          />
        ) : null}
      </SiteAgreementWrapper>
    </Box>
  );
}

SensitiveInformationPage.auth = {
  public: true,
};
