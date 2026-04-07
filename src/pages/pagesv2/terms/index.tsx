//@ts-nocheck
import {
  Box,
  Container,
  HStack,
  Link,
  Skeleton,
  Stack,
  Text,
} from "@chakra-ui/react";
import FullscreenLoadingSpinner from "componentsv2/FullscreenLoadingSpinner";
import SiteAgreement from "componentsv2/SiteAgreements/SiteAgreement";
import SiteAgreementNav from "componentsv2/SiteAgreements/SiteAgreementNav";
import SiteAgreementWrapper from "componentsv2/SiteAgreements/SiteAgreementWrapper";
import PageHeader from "componentsv2/Styling/PageHeader";
import { TermsAndConditions } from "componentsv2/Terms/TermsAndConditions";
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
