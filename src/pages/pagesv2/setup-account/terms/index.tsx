// @ts-nocheck
import {
  Flex,
  Container,
  Heading,
  Skeleton,
  Divider,
  Box,
  FormControl,
  Checkbox,
  Button,
  Spinner,
  Icon,
  FormLabel,
  chakra,
  Tab,
  TabList,
  Tabs,
  TabPanels,
  TabPanel,
  useToast,
} from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import DOMPurify from "dompurify";
import { gql } from "graphql-request";
import useQueryHook, { sendData } from "hooks/useQueryHook";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { MdArrowBack, MdArrowForward } from "react-icons/md";
import { isStaff, isPatient } from "helpersv2/Permissions";
import { useAtom } from "jotai";
import { needToSignTermsAtom } from "store/store";

export const patientTermsAndConditionsQuery = gql`
  query getSiteAgreements {
    privacyPolicy: entry(
      section: "siteAgreements"
      type: "privacyPolicy"
      orderBy: "dateCreated desc"
    ) {
      id
      slug
      title
      typeHandle
      dateCreated
      dateUpdated
      ... on siteAgreements_privacyPolicy_Entry {
        siteAgreementFull
      }
    }
    websiteTermsAndConditions: entry(
      section: "siteAgreements"
      type: "websiteTermsAndConditions"
      orderBy: "dateCreated desc"
    ) {
      id
      slug
      title
      typeHandle
      dateCreated
      dateUpdated
      ... on siteAgreements_websiteTermsAndConditions_Entry {
        siteAgreementFull
      }
    }
    sensitiveInformationPolicy: entry(
      section: "siteAgreements"
      type: "sensitiveInformationPolicy"
      orderBy: "dateCreated desc"
    ) {
      id
      slug
      title
      typeHandle
      dateCreated
      dateUpdated
      ... on siteAgreements_sensitiveInformationPolicy_Entry {
        siteAgreementFull
      }
    }
    patientTermsAndConditions: entry(
      section: "siteAgreements"
      type: "patientTermsAndConditions"
      orderBy: "dateCreated desc"
    ) {
      id
      slug
      title
      typeHandle
      dateCreated
      dateUpdated
      ... on siteAgreements_patientTermsAndConditions_Entry {
        siteAgreementFull
      }
    }
    staffTermsAndConditions: entry(
      section: "siteAgreements"
      type: "staffTermsAndConditions"
      orderBy: "dateCreated desc"
    ) {
      id
      slug
      title
      typeHandle
      dateCreated
      dateUpdated
      ... on siteAgreements_staffTermsAndConditions_Entry {
        siteAgreementFull
      }
    }
    viewer: viewer {
      ... on User {
        id
        userSiteAgreementsChecked {
          id
          slug
          typeHandle
          dateCreated
          dateUpdated
        }
      }
    }
  }
`;

export default function SetupAccountTerms() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const [needToSignTerms, setNeedToSignTerms] = useAtom(needToSignTermsAtom);

  const patientTermsAndConditionsResult = useQueryHook(
    ["patientTermsAndConditionsQuery"],
    patientTermsAndConditionsQuery,
  );

  const isLoaded = !!(session && !patientTermsAndConditionsResult.isLoading);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { handleSubmit } = useForm();

  const patientTermsAndConditionsResultData =
    patientTermsAndConditionsResult?.data;
  const termsAndConditionsToSignIds = [
    patientTermsAndConditionsResultData?.privacyPolicy?.id,
    //viewerMainNavbarResultData?.websiteTermsAndConditions?.id,
    //viewerMainNavbarResultData?.sensitiveInformationPolicy?.id,
    ...(isPatient(session?.groups)
      ? [patientTermsAndConditionsResultData?.patientTermsAndConditions?.id]
      : []),
    ...(isStaff(session?.groups)
      ? [patientTermsAndConditionsResultData?.staffTermsAndConditions?.id]
      : []),
  ];
  const viewerSiteAgreementsSignedIds =
    patientTermsAndConditionsResultData?.viewer?.userSiteAgreementsChecked?.map(
      (item) => item.id,
    ) ?? [];

  const needsToSign = !termsAndConditionsToSignIds.every((item) =>
    viewerSiteAgreementsSignedIds.includes(item),
  );

  const patientSignTermsMutation = gql`
    mutation patientSignTermsMutation($userSiteAgreementsChecked: [Int]) {
      updateViewer(
        userSiteAgreementsChecked: $userSiteAgreementsChecked
        patientCheckedTerms: true
      ) {
        ... on User {
          userSiteAgreementsChecked {
            id
          }
          patientCheckedTerms
        }
      }
    }
  `;

  const toast = useToast();
  const formSubmit = useMutation(
    (newData: any) => sendData(patientSignTermsMutation, newData),
    {
      onMutate: () => {
        setIsSubmitting(true);
      },
      onSuccess: (data, variables, context) => {
        queryClient.invalidateQueries(["mainViewerQuery"]);
      },
      onError: (error, variables, context) => {
        toast({
          title: "Error - Something went wrong",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
        setIsSubmitting(false);
      },
    },
  );

  const onSubmit = (data) => {
    // Merge the checked agreements with the ones already signed
    const mergedAgreementsIds = [
      ...(termsAndConditionsToSignIds ?? []),
      ...(viewerSiteAgreementsSignedIds ?? []),
    ]
      .map((id) => Number(id))
      .filter((item) => item !== null);

    formSubmit.mutate({
      userSiteAgreementsChecked: mergedAgreementsIds,
    });
  };

  const [page, setPage] = useState(0);
  const [upToPage, setUpToPage] = useState(0);
  const agreementsToSign =
    [
      //viewerMainNavbarResultData?.websiteTermsAndConditions,
      //viewerMainNavbarResultData?.sensitiveInformationPolicy,
      ...(isPatient(session?.groups)
        ? [patientTermsAndConditionsResultData?.patientTermsAndConditions]
        : []),
      ...(isStaff(session?.groups)
        ? [patientTermsAndConditionsResultData?.staffTermsAndConditions]
        : []),
      patientTermsAndConditionsResultData?.privacyPolicy,
    ].filter((item) => item !== null) ?? [];

  const amountOfPages = agreementsToSign.length;
  const handleTabsChange = (index) => {
    setPage(index);
    topOfPageRef.current.scrollIntoView({ behavior: "smooth" });
    if (index > upToPage) {
      setUpToPage(index);
    }
  };
  const handleNextPage = () => {
    handleTabsChange(page + 1);
  };
  const handlePreviousPage = () => {
    handleTabsChange(page - 1);
  };

  const topOfPageRef = useRef(null);

  DOMPurify.addHook("afterSanitizeAttributes", function (node) {
    // set all elements owning target to target=_blank
    if ("target" in node) {
      node.setAttribute("target", "_blank");
      node.setAttribute("rel", "noopener");
    }

    // Replace "https://www.smileconnect.com.au" and "https://smileconnect.com.au" with the current domain
    if (process.env.NODE_ENV === "development") {
      if ("href" in node) {
        node.setAttribute(
          "href",
          node
            .getAttribute("href")
            .replace(
              /https:\/\/(www\.)?smileconnect\.com\.au/g,
              window.location.origin,
            ),
        );
      }
    }
  });

  return (
    <Flex
      direction={"column"}
      align={"center"}
      justify={"flex-start"}
      bgColor={"lgDarkBlueLogo"}
    >
      <Container size={"main"} maxWidth={"1000px"} padding={{ base: "0.5rem" }}>
        <Flex
          w={"100%"}
          padding={{ base: "1rem" }}
          bgColor={"white"}
          borderRadius={"6px"}
          flexDirection={"column"}
          my={{ base: "0.5rem", lg: "5rem" }}
          ref={topOfPageRef}
        >
          <Heading
            fontSize={{ base: "1.0rem", lg: "1.0rem" }}
            color={"darkBlueLogo"}
            as={"h1"}
            textTransform={"uppercase"}
            width={"100%"}
            textAlign={"center"}
          >
            Please read through and accept the terms to continue
          </Heading>
          <Divider my={{ base: "0.5rem" }} />
          <Skeleton isLoaded={isLoaded} height={!isLoaded ? "100vw" : null}>
            <Flex
              gap={"0.5rem"}
              flexDirection={"column"}
              justifyContent={"space-between"}
              minHeight={{ base: "50vw", lg: "40vw" }}
            >
              <Tabs index={page} onChange={handleTabsChange}>
                <TabList flexDirection={{ base: "column", lg: "row" }}>
                  {agreementsToSign.map((agreement, index) => {
                    return (
                      <Tab
                        key={agreement?.id ?? index}
                        isDisabled={index > upToPage}
                        p={"0.2rem"}
                        flexGrow={1}
                      >
                        <chakra.span fontSize={"0.8rem"}>
                          {agreement?.title}
                        </chakra.span>
                      </Tab>
                    );
                  })}
                </TabList>
                <TabPanels>
                  {agreementsToSign.map((agreement, index) => {
                    return (
                      <TabPanel
                        key={agreement?.id ?? index}
                        p={"0rem"}
                        my={"1rem"}
                      >
                        <Box
                          border={"solid 1px"}
                          rounded={"6px"}
                          borderColor={"lightBlueLogo"}
                          p={{ base: "0.5rem", lg: "2rem" }}
                          maxHeight={{ base: "50vh", lg: "70vh" }}
                          overflowY={"scroll"}
                        >
                          <Heading
                            fontSize={"1.6rem"}
                            textTransform={"uppercase"}
                            textAlign={"center"}
                          >
                            {agreement?.title ?? "error"}
                          </Heading>
                          <Divider mt={"0.5rem"} mb={"1.0rem"} />
                          <Box
                            fontSize={{ base: "0.8rem", lg: "1rem" }}
                            className={"rich-text"}
                            as={"article"}
                            dangerouslySetInnerHTML={{
                              __html: DOMPurify.sanitize(
                                agreement?.siteAgreementFull,
                              ),
                            }}
                          />
                        </Box>
                      </TabPanel>
                    );
                  })}
                </TabPanels>
              </Tabs>
              {amountOfPages > 0 && page < amountOfPages - 1 ? (
                <Flex
                  justifyContent={"space-between"}
                  gap={"1.5rem"}
                  flexDirection={"row"}
                >
                  <Button
                    bgColor={"darkBlueLogo"}
                    rounded={"0"}
                    type={"submit"}
                    color={"white"}
                    textTransform={"uppercase"}
                    px={"1.8rem"}
                    leftIcon={<Icon as={MdArrowBack} />}
                    isDisabled={page <= 0}
                    onClick={handlePreviousPage}
                    visibility={page <= 0 ? "hidden" : null}
                  >
                    Prev
                  </Button>
                  <Button
                    bgColor={"darkBlueLogo"}
                    rounded={"0"}
                    type={"submit"}
                    color={"white"}
                    textTransform={"uppercase"}
                    px={"1.8rem"}
                    rightIcon={<Icon as={MdArrowForward} />}
                    onClick={handleNextPage}
                    isDisabled={page >= amountOfPages - 1}
                  >
                    Next
                  </Button>
                </Flex>
              ) : (
                <chakra.form onSubmit={handleSubmit(onSubmit)} width={"100%"}>
                  <Flex
                    justifyContent={"end"}
                    alignItems={"center"}
                    gap={"1rem"}
                    flexDirection={{ base: "column", lg: "row" }}
                  >
                    <FormControl isRequired={true} width={"auto"}>
                      <Checkbox size={"lg"}>
                        <FormLabel
                          mb={"0rem"}
                          textTransform={null}
                          fontSize={{ base: "1.0rem", lg: "1.2rem" }}
                        >
                          I agree to the Terms and Conditions
                        </FormLabel>
                      </Checkbox>
                    </FormControl>
                    <Button
                      bgColor={"darkBlueLogo"}
                      rounded={"0"}
                      type={"submit"}
                      color={"white"}
                      textTransform={"uppercase"}
                      px={"1.8rem"}
                      isDisabled={isSubmitting}
                      rightIcon={
                        isSubmitting ? (
                          <Flex
                            minWidth={"1.5rem"}
                            justifyContent={"center"}
                            alignItems={"center"}
                          >
                            <Spinner />
                          </Flex>
                        ) : (
                          <Flex
                            minWidth={"1.5rem"}
                            justifyContent={"center"}
                            alignItems={"center"}
                          >
                            <Icon as={MdArrowForward} />
                          </Flex>
                        )
                      }
                    >
                      Accept
                    </Button>
                  </Flex>
                </chakra.form>
              )}
            </Flex>
          </Skeleton>
        </Flex>
      </Container>
    </Flex>
  );
}
