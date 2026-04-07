// @ts-nocheck
import {
  Box,
  Container,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
} from "@chakra-ui/react";
import FullscreenLoadingSpinner from "componentsv2/FullscreenLoadingSpinner";
import SiteAgreement from "componentsv2/SiteAgreements/SiteAgreement";
import SiteAgreementNav from "componentsv2/SiteAgreements/SiteAgreementNav";
import SiteAgreementWrapper from "componentsv2/SiteAgreements/SiteAgreementWrapper";
import PageHeader from "componentsv2/Styling/PageHeader";
import { SensitiveInformation } from "componentsv2/Terms/SensitiveInformation";
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
