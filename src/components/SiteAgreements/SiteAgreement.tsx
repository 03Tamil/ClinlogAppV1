import { Box } from "@chakra-ui/react";
import DOMPurify from "dompurify";

type SiteAgreementProps = {
  siteAgreementRichText: any,
  fontSize?: string,
}

export default function SiteAgreement({siteAgreementRichText, fontSize = 'xl'}: SiteAgreementProps) {
  return (
    <Box
      fontSize={fontSize}
      className={'rich-text'}
      as={"article"}
      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(siteAgreementRichText) }}
    />
  )
}