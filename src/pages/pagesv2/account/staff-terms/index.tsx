// @ts-nocheck
import { Skeleton } from "@chakra-ui/react";
import { AccountWrapper } from "componentsv2/Account/AccountWrapper";
import SiteAgreement from "componentsv2/SiteAgreements/SiteAgreement";
import { gql } from "graphql-request";
import useQueryHook, { publicApiHook } from "hooks/useQueryHook";

export default function TermsConditions() {
  const title = "Staff Terms & Conditions";
  const slug = "staff-terms";

  const staffTermsAndConditionsQuery = gql`
    query getSiteAgreement {
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
    ["staffTermsAndConditions"],
    staffTermsAndConditionsQuery,
  );
  const siteAgreementEntry = siteAgreementResult?.data?.siteAgreement ?? null;

  const isLoaded = !siteAgreementResult.isLoading;
  const headerText =
    "Review the staff terms of use, confidentiality, and acceptable-use policies. Acknowledge updates here to keep your access compliant.";
  return (
    <AccountWrapper
      title={title}
      headerText={headerText}
      breadcrumbs={[{ title: `${title}`, url: `account/${slug}` }]}
      slug={slug}
      mb="4"
    >
      <Skeleton isLoaded={isLoaded} height={!isLoaded ? "95%" : null}>
        {siteAgreementEntry?.siteAgreementFull ? (
          <SiteAgreement
            siteAgreementRichText={siteAgreementEntry.siteAgreementFull}
          />
        ) : null}
      </Skeleton>
    </AccountWrapper>
  );
}

TermsConditions.auth = {
  role: "Staff",
};
