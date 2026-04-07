import { Box } from "@chakra-ui/react"

export const SensitiveInformation = () => {
  return (
    <>
      <Box as={"article"}>
        <div>
          <h2>1. INTRODUCTION</h2>
          <p>
            This document sets out the policy of ALL ON 4 PLUS PTY LTD ACN 164
            844 428 (referred to in this privacy policy as ‘we’, ‘us’, or ‘our’)
            in handling sensitive information (<strong>Policy</strong>).
          </p>
          <p>
            We take our privacy obligations seriously and we’ve created this
            Policy to explain how westore, maintain, use and disclose sensitive
            information.
          </p>
          <p>
            By providing sensitive information to us, you consent to our
            storage, maintenance, use and disclosing of sensitive information in
            accordance with this Policy.
          </p>
          <p>
            We may change this Policy from time to time by posting an updated
            copy on our website and we encourage you to check our website
            regularly to ensure that you are aware of our most current Policy.
          </p>
          <p>
            This Policy should be read in addition to our general privacy policy
            which can be found at{" "}
            <a href="{{ siteUrl('privacy') }}">
              www.allon4.com.au/privacy-policy
            </a>
            .
          </p>
        </div>
        <div>
          <h2>2. TYPES OF SENSITIVE INFORMATION WE COLLECT</h2>
          <p>The sensitive information we collect may include the following:</p>
          <ol type="a">
            <li>
              diagnostic or treatment information related to any medical
              condition you may have;
            </li>
            <li>your and/or family medical history;</li>
            <li>other medical records;</li>
            <li>private health insurance information;</li>
            <li>government identifiers, such as drivers license details;</li>
            <li>emergency contact details;</li>
            <li>
              Medicare details or other government or third party funding
              information; and
            </li>
            <li>
              any other information provided by you to us, whether requested by
              us or otherwise.
            </li>
          </ol>
        </div>
        <div>
          <h2>3. HOW WE COLLECT SENSITIVE INFORMATION</h2>
          <p>
            We may collect sensitive information either directly from you, or
            from third parties where necessary, during the course of providing
            you services, including where you:
          </p>
          <ol type="a">
            <li>are referred to us by another medical practitioner;</li>
            <li>provide information via our online platform;</li>
            <li>complete documentation and submit to us;</li>
            <li>
              communicate with us via our website, phone, email or text message;
              or
            </li>
            <li>receive goods or services from us.</li>
          </ol>
          <p>
            We will only collect this sensitive information where you consent
            and provide us with this information. If you consent, your sensitive
            information may only be used and disclosed for purposes relating to
            providing you with our services and/or referring you to medical or
            health service providers in circumstances where we cannot obtain
            your consent.
          </p>
        </div>
        <div>
          <h2>4. USE OF YOUR SENSITIVE INFORMATION</h2>
          <p>
            We collect and use sensitive information for the following purposes:
          </p>
          <ol type="a">
            <li>
              to provide treatment, support, services or information to you;
            </li>
            <li>to process private health insurance and Medicare claims;</li>
            <li>for record keeping and administrative purposes;</li>
            <li>to assist with queries made by you relating to your health;</li>
            <li>
              to provide information about you to our contractors, employees,
              consultants, agents or other third parties for the purpose of
              providing our goods or services to you; and
            </li>
            <li>to comply with our legal obligations.</li>
          </ol>
        </div>
        <div>
          <h2>5. DISCLOSING YOUR SENSITIVE INFORMATION</h2>
          <p>
            We may need to disclose your sensitive information to
            cloud-providers, contractors and other third parties, including
            other medical practitioners, located inside or outside of Australia.
            If we do so, we will take reasonable steps to ensure that any
            overseas recipient deals with such sensitive information in a manner
            consistent with how we deal with it. You consent to the sharing of
            your sensitive information with these third parties as required to
            provide you with the services.
          </p>
        </div>
        <div>
          <h2>6. SECURITY</h2>
          <p>
            We take reasonable steps to ensure your sensitive information is
            secure and protected from misuse or unauthorised access. Our
            information technology systems are password protected, and we use a
            range of administrative and technical measures to protect these
            systems. However, we cannot guarantee the security of your sensitive
            information.
          </p>
        </div>
        <div>
          <h2>7. LINKS</h2>
          <p>
            Our website may contain links to other websites. Those links are
            provided for convenience and may not remain current or be
            maintained. We are not responsible for the privacy practices of
            those linked websites and we suggest you review the privacy policies
            of those websites before using them.
          </p>
        </div>
        <div>
          <h2>8. REQUESTING ACCESS OR CORRECTING YOUR SENSITIVE INFORMATION</h2>
          <p>
            If you wish to request access to the sensitive information we hold
            about you, please contact us using the contact details set out below
            including your name and contact details. We may need to verify your
            identity before providing you with your sensitive information. In
            some cases, we may be unable to provide you with access to all your
            sensitive information and where this occurs, we will explain why. We
            will deal with all requests for access to sensitive information
            within a reasonable timeframe.
          </p>
          <p>
            If you think that any sensitive information we hold about you is
            inaccurate, please contact us using the contact details set out
            below and we will take reasonable steps to ensure that it is
            corrected.
          </p>
        </div>
        <div>
          <h2>9. WITHDRAWING CONSENT</h2>
          <p>
            If you wish to withdraw your consent to our collection, use or
            disclosure of your sensitive information, please contact us using
            the contact details set out below. We will deal with all such
            requests within a reasonable timeframe.
          </p>
        </div>
        <div>
          <h2>10. COMPLAINTS</h2>
          <p>
            If you wish to complain about how we handle your sensitive
            information held by us, please contact us using the details set out
            below including your name and contact details. We will investigate
            your complaint promptly and respond to you within a reasonable
            timeframe.
          </p>
        </div>
        <div>
          <h2>11. CONTACT US</h2>
          <p>
            For further information about our privacy policy or practices, or to
            access or correct your sensitive information, or make a complaint,
            please <a href="{{ siteUrl('contact') }}">contact us</a>.
          </p>
        </div>
      </Box>
    </>
  )
}

export default SensitiveInformation