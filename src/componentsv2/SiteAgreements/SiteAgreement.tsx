import { Box } from "@chakra-ui/react";
import DOMPurify from "dompurify";

type SiteAgreementProps = {
  siteAgreementRichText: any;
  fontSize?: string;
};

export default function SiteAgreement({
  siteAgreementRichText,
  fontSize = "xl",
}: SiteAgreementProps) {
  return (
    <Box
      fontSize={{ base: "12px", md: "14px" }}
      pb={8}
      className={"rich-text"}
      as={"article"}
      dangerouslySetInnerHTML={{
        __html: DOMPurify.sanitize(siteAgreementRichText),
      }}
    />
  );
}
