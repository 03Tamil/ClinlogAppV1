// @ts-nocheck
import {
  Box,
  Container,
  HStack,
  Link,
  Skeleton,
  Stack,
  Text,
} from "@chakra-ui/react";
import FullscreenLoadingSpinner from "components/FullscreenLoadingSpinner";
import SiteAgreement from "components/SiteAgreements/SiteAgreement";
import SiteAgreementNav from "components/SiteAgreements/SiteAgreementNav";
import SiteAgreementWrapper from "components/SiteAgreements/SiteAgreementWrapper";
import PageHeader from "components/Styling/PageHeader";
import { TermsAndConditions } from "components/Terms/TermsAndConditions";
import { gql } from "graphql-request";
import useQueryHook, { publicApiHook } from "hooks/useQueryHook";
import DOMPurify from "isomorphic-dompurify";
import NextLink from "next/link";

export default function WebsiteTermsAndConditionsPage() {
  const websiteTermsAndConditionsQuery = gql`
    query websiteTermsAndConditionsQuery {
      siteAgreement: entry(
        section: "siteAgreements"
        type: "websiteTermsAndConditions"
        orderBy: "dateCreated desc"
      ) {
        id
        slug
        title
        ... on siteAgreements_websiteTermsAndConditions_Entry {
          id
          siteAgreementFull
        }
      }
    }
  `;
  const siteAgreementResult = publicApiHook(
    ["websiteTermsAndConditionsQuery"],
    websiteTermsAndConditionsQuery,
  );
  const siteAgreementEntry = siteAgreementResult?.data?.siteAgreement ?? null;

  const isLoaded = !siteAgreementResult.isLoading;

  return (
    <Box bgColor={"white"}>
      <PageHeader
        title={"Website terms & conditions"}
        breadcrumbs={[
          {
            title: "Website terms & conditions",
          },
        ]}
        justBreadcrumbs={true}
      />
      <SiteAgreementWrapper
        activeName={"WebsiteTermsAndConditions"}
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

WebsiteTermsAndConditionsPage.auth = {
  public: true,
};
