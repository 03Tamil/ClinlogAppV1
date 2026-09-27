import {
  Button,
  Flex,
  chakra,
  Select,
  NumberInput,
  NumberInputField,
  Input,
  Text,
  Divider,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  Spacer,
  Box,
  SimpleGrid,
  Spinner,
} from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { sendData } from "hooks/useQueryHook";
import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import {
  createSiteSpecificFollowUpMutation,
  updateSiteSpecificFollowUpMutation,
} from "../detailsPageMutations";
import { title } from "process";
import { differenceInDays, format, set } from "date-fns";

const hasSiteFollowUpValue = (value) =>
  value !== undefined && value !== null && value !== "";

const getFollowUpTimestamp = (followUp) => {
  const rawDate =
    followUp?.recordFollowUpDate ||
    followUp?.dateCreated ||
    followUp?.dateUpdated;

  if (!rawDate) {
    return 0;
  }

  const timestamp = new Date(rawDate).getTime();
  return Number.isNaN(timestamp) ? 0 : timestamp;
};

const isSameReviewDate = (followUpDate, reviewDate) => {
  if (!followUpDate || !reviewDate) {
    return false;
  }

  const parsedFollowUpDate = new Date(followUpDate);
  const parsedReviewDate = new Date(reviewDate);

  if (
    Number.isNaN(parsedFollowUpDate.getTime()) ||
    Number.isNaN(parsedReviewDate.getTime())
  ) {
    return false;
  }

  return (
    format(parsedFollowUpDate, "dd MMM yyyy") ===
    format(parsedReviewDate, "dd MMM yyyy")
  );
};

const getPreviousRecordedValue = (followUps, currentFollowUp, key) => {
  const currentValue = currentFollowUp?.[key];

  if (hasSiteFollowUpValue(currentValue)) {
    return currentValue;
  }

  const currentTimestamp = getFollowUpTimestamp(currentFollowUp);
  const previousFollowUp = followUps
    ?.filter((item) => item?.id !== currentFollowUp?.id)
    ?.filter((item) => {
      const timestamp = getFollowUpTimestamp(item);
      return currentTimestamp ? timestamp <= currentTimestamp : true;
    })
    ?.sort((a, b) => getFollowUpTimestamp(b) - getFollowUpTimestamp(a))
    ?.find((item) => hasSiteFollowUpValue(item?.[key]));

  return previousFollowUp?.[key] ?? currentValue;
};

export default function SiteSpecificFollowUpV3({
  dateOfReview,
  selectedSite,
  isFollowUpOpen,
  onFollowUpOpen,
  onFollowUpClose,
  followUpId,
  selectedFollowUp,
  toastData,
  proposedTreatmentChartIds,
  queryClient,
  fromClinlog = false,
  globalPostId,
}) {
  const { toast, toastIdRef } = toastData;
  const {
    control: siteFollowUpControl,
    register: siteFollowUpRegister,
    handleSubmit: siteFollowUpSubmit,
    watch: siteFollowUpWatch,
    getValues: getSiteFollowUpValues,
    reset: resetSiteFollowUpValues,
  } = useForm({});

  const siteFollowUpFormValues = siteFollowUpWatch();
  const selectStyles = {
    border: "1px solid #D9D9D9",
    borderRadius: "6px",
    fontSize: "11px",
    _hover: { border: "1px solid #D9D9D9" },
    _focusVisible: { border: "1px solid #D9D9D9" },
    textTransform: "uppercase",
  };
  const [siteFollowUpId, setSiteFollowUpId] = useState("");
  const siteFollowUpData = useMemo(() => {
    return selectedSite?.attachedSiteSpecificRecords?.[0]
      ?.attachedSiteSpecificFollowUp;
  }, [selectedSite]);
  const [followUpDate, setFollowUpDate] = useState(null);

  useEffect(() => {
    const followUps = Array.isArray(siteFollowUpData)
      ? [...siteFollowUpData].sort(
          (a, b) => getFollowUpTimestamp(a) - getFollowUpTimestamp(b),
        )
      : [];

    const followUpDetails =
      followUps?.find((item) =>
        isSameReviewDate(item?.recordFollowUpDate, dateOfReview),
      ) || followUps?.[followUps.length - 1];

    setFollowUpDate(followUpDetails?.recordFollowUpDate);
    setSiteFollowUpId(followUpDetails?.id);
    const diff = differenceInDays(
      new Date(),
      new Date(followUpDetails?.dateCreated),
    );

    const siteFollowUp = {
      ...followUpDetails,
      abutmentFunctionAtFollowUp: getPreviousRecordedValue(
        followUps,
        followUpDetails,
        "abutmentFunctionAtFollowUp",
      ),
      isWithin24Hours: diff < 1,
    };

    resetSiteFollowUpValues({
      isWithin24Hours: siteFollowUp?.isWithin24Hours,
      implantFunctionAtFollowUp: siteFollowUp?.implantFunctionAtFollowUp,
      abutmentFunctionAtFollowUp: siteFollowUp?.abutmentFunctionAtFollowUp,
      sinusitis: siteFollowUp?.sinusitis,
      facialSwelling: siteFollowUp?.facialSwelling,
      inflammation: siteFollowUp?.inflammation,
      suppuration: siteFollowUp?.suppuration,
      pain: siteFollowUp?.pain,
      recession: siteFollowUp?.recession,
      midShaftSoftTissueDehiscence:
        siteFollowUp?.midShaftSoftTissueDehiscence || "N/A",
      firstAbutmentLevelComplication:
        siteFollowUp?.firstAbutmentLevelComplication,
      otherAbutmentLevelComplications:
        siteFollowUp?.otherAbutmentLevelComplications,
      totalNumberOfAbutmentLevelComplications:
        siteFollowUp?.totalNumberOfAbutmentLevelComplications,
      dateOfFirstAbutmentLevelComplication:
        siteFollowUp?.dateOfFirstAbutmentLevelComplication
          ? new Date(siteFollowUp?.dateOfFirstAbutmentLevelComplication)
          : null,
      firstAbutmentLevelComplicationTimeFromSurgery:
        siteFollowUp?.firstAbutmentLevelComplicationTimeFromSurgery,
      postOperativeSinusDisease: siteFollowUp?.postOperativeSinusDisease,
      boneLoss: siteFollowUp?.boneLoss,
      graftConditionAtFollowUp: siteFollowUp?.graftConditionAtFollowUp,
    });
  }, [siteFollowUpData, dateOfReview, resetSiteFollowUpValues]);

  const siteFollowUpFields = useMemo(() => {
    return [
      {
        label: "Implant Function at Follow Up",
        key: "implantFunctionAtFollowUp",
        options: [
          { name: "-- Select --", value: "" },
          { name: "Yes", value: "Yes" },
          { name: "No (failed)", value: "No (failed)" },
          { name: "Sleeper", value: "Sleeper" },
          { name: "Unknown", value: "unknown" },
        ],
        value: getSiteFollowUpValues("implantFunctionAtFollowUp") || "N/A",
      },
      {
        label: "Abutment Function at Follow Up",
        key: "abutmentFunctionAtFollowUp",
        options: [
          { name: "-- Select --", value: "" },
          { name: "Yes", value: "Yes" },
          { name: "No (failed)", value: "No (failed)" },
          { name: "Sleeper", value: "Sleeper" },
          { name: "Unknown", value: "unknown" },
        ],
        value: getSiteFollowUpValues("abutmentFunctionAtFollowUp"),
      },
      {
        label: "Sinusitis",
        key: "sinusitis",
        options: [
          { name: "-- Select --", value: "" },
          { name: "Yes", value: "Yes" },
          { name: "No", value: "No" },
          { name: "Unknown", value: "unknown" },
        ],
        value: getSiteFollowUpValues("sinusitis"),
      },
      {
        label: "Facial Swelling",
        key: "facialSwelling",
        options: [
          { name: "-- Select --", value: "" },
          { name: "Yes", value: "Yes" },
          { name: "No", value: "No" },
          { name: "Unknown", value: "unknown" },
        ],
        value: getSiteFollowUpValues("facialSwelling"),
      },
      {
        label: "Inflammation",
        key: "inflammation",
        options: [
          { name: "-- Select --", value: "" },
          { name: "Yes", value: "Yes" },
          { name: "No", value: "No" },
          { name: "Unknown", value: "unknown" },
        ],
        value: getSiteFollowUpValues("inflammation"),
      },
      {
        label: "Suppuration",
        key: "suppuration",
        options: [
          { name: "-- Select --", value: "" },
          { name: "Yes", value: "Yes" },
          { name: "No", value: "No" },
          { name: "Unknown", value: "unknown" },
        ],
        value: getSiteFollowUpValues("suppuration"),
      },
      {
        label: "Pain",
        key: "pain",
        options: [
          { name: "-- Select --", value: "" },
          { name: "Yes", value: "Yes" },
          { name: "No", value: "No" },
          { name: "Unknown", value: "unknown" },
        ],
        value: getSiteFollowUpValues("pain"),
      },
      {
        label: "Recession",
        key: "recession",
        options: [
          { name: "-- Select --", value: "" },
          { name: "None", value: "None" },
          { name: "Minor (Abutment Only)", value: "Minor (Abutment Only)" },
          {
            name: "Moderate (Implant Collar)",
            value: "Moderate (Implant Collar)",
          },
          { name: "Advanced (Shaft)", value: "Advanced (Shaft)" },
          { name: "Unknown", value: "unknown" },
        ],
        value: getSiteFollowUpValues("recession"),
      },
      {
        label: "Mid-shaft Soft tissue dehiscence",
        key: "midShaftSoftTissueDehiscence",
        options: [
          { name: "-- Select --", value: "" },
          { name: "Yes", value: "Yes" },
          { name: "No", value: "No" },
          {
            name: "N/A",
            value: "N/A",
          },
          { name: "Unknown", value: "unknown" },
        ],
        icon: "timer_arrow_up",
        info: "Entry by xxxx",
        value: getSiteFollowUpValues("midShaftSoftTissueDehiscence"),
      },
      {
        label: "First abutment-level complication",
        key: "firstAbutmentLevelComplication",
        options: [
          { name: "-- Select --", value: "" },
          { name: "None", value: "None" },
          {
            name: "Abutment Screw Loosening",
            value: "Abutment Screw Loosening",
          },
          { name: "Abutment Screw Breakage", value: "Abutment Screw Breakage" },
          {
            name: "Prosthetic Screw Loosening",
            value: "Prosthetic Screw Loosening",
          },
          {
            name: "Prosthetic Screw Breakage",
            value: "Prosthetic Screw Breakage",
          },
          { name: "Unknown", value: "unknown" },
        ],

        value: getSiteFollowUpValues("firstAbutmentLevelComplication"),
      },
      {
        label: "Other abutment-level complications",
        key: "otherAbutmentLevelComplications",
        value: getSiteFollowUpValues("otherAbutmentLevelComplications"),
      },
      {
        label: "Total number of abutment level complications",
        key: "totalNumberOfAbutmentLevelComplications",
        value: getSiteFollowUpValues("totalNumberOfAbutmentLevelComplications"),
      },
      {
        label: "Date of First Abutment-level Complication",
        key: "dateOfFirstAbutmentLevelComplication",
        value: getSiteFollowUpValues("dateOfFirstAbutmentLevelComplication"),
      },
      {
        label: "First Abutment-level complication Time from Surgery",
        key: "firstAbutmentLevelComplicationTimeFromSurgery",
        value: getSiteFollowUpValues(
          "firstAbutmentLevelComplicationTimeFromSurgery",
        ),
      },
      {
        label: "Post Operative Sinus Disease",
        key: "postOperativeSinusDisease",
        options: [
          { name: "-- Select --", value: "" },
          { name: "None", value: "None" },
          { name: "Mild Thickening", value: "Mild Thickening" },
          { name: "Moderate Thickening", value: "Moderate Thickening" },
          { name: "Total opacification", value: "Total opacification" },
          { name: "Unknown", value: "unknown" },
        ],
        value: getSiteFollowUpValues("postOperativeSinusDisease"),
      },
      {
        label: "Bone Loss",
        key: "boneLoss",
        options: [
          { name: "-- Select --", value: "" },
          { name: "No bone loss detected", value: "No bone loss detected" },
          {
            name: "Vertically less than 2mm, narrow defect",
            value: "Vertically less than 2mm, narrow defect",
          },
          {
            name: "Vertically less than 2mm, wide defect",
            value: "Vertically less than 2mm, wide defect",
          },
          {
            name: "Vertically 2-4mm, narrow defect",
            value: "Vertically 2-4mm, narrow defect",
          },
          {
            name: "Vertically 2-4mm, wide defect",
            value: "Vertically 2-4mm, wide defect",
          },
          {
            name: "Vertically >4mm, narrow defect",
            value: "Vertically >4mm, narrow defect",
          },
          {
            name: "Vertically >4mm, wide defect",
            value: "Vertically >4mm, wide defect",
          },
          { name: "Unknown", value: "unknown" },
        ],
        value: getSiteFollowUpValues("boneLoss"),
      },
      {
        label: "Graft Condition at Follow Up",
        key: "graftConditionAtFollowUp",
        options: [
          { name: "-- Select --", value: "" },
          {
            name: "Present and sound at Zygoma Critical Zone (ZCC) only",
            value: "Present and sound at Zygoma Critical Zone (ZCC) only",
          },
          {
            name: "Present and sound along Zygoma shaft and ZCC",
            value: "Present and sound along Zygoma shaft and ZCC",
          },
          {
            name: "Absent or poor mineralisation",
            value: "Absent or poor mineralisation",
          },
          { name: "Sound (non-zygoma)", value: "Sound (non-zygoma)" },
          { name: "Unknown", value: "unknown" },
        ],
        value: getSiteFollowUpValues("graftConditionAtFollowUp"),
      },
    ];
  }, [siteFollowUpFormValues]);
  const siteSpecificFollowUpMutationFunction = useMutation(
    //@ts-ignore
    (newData) => sendData(updateSiteSpecificFollowUpMutation, newData),
    {
      onMutate: (newData) => {
        toastIdRef.current = toast({
          render: () => (
            <Flex
              justify="space-around"
              color="white"
              p={3}
              bg="blue.500"
              borderRadius="6px"
            >
              Saving Site Specific Follow Up
              <Spinner color="white" />
            </Flex>
          ),
          duration: 100000,
          isClosable: true,
        });
      },
      onError: (err, newData) => {
        toast.update(toastIdRef.current, {
          description: "Error - Could not Save follow up",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      },
      onSuccess: (data, newData) => {
        toast.update(toastIdRef.current, {
          description: "Site Specific Follow up saved successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      },
      onSettled: () => {
        onFollowUpClose();
        siteSpecificFollowUpMutationFunction.reset();
        queryClient.invalidateQueries(["detailsPageNew", globalPostId]);
        queryClient.invalidateQueries([
          "proposedTreatmentChartResults",
          proposedTreatmentChartIds,
        ]);
      },
    },
  );
  const onSiteFollowUpSubmit = (data) => {
    let newData = null;
    // if (data?.isWithin24Hours === true) {

    newData = {
      id: siteFollowUpId,
      recordFollowUpDate: new Date(dateOfReview),
      implantFunctionAtFollowUp: data?.implantFunctionAtFollowUp,
      abutmentFunctionAtFollowUp: data?.abutmentFunctionAtFollowUp,
      sinusitis: data?.sinusitis,
      facialSwelling: data?.facialSwelling,
      inflammation: data?.inflammation,
      suppuration: data?.suppuration,
      pain: data?.pain,
      recession: data?.recession,
      midShaftSoftTissueDehiscence: data?.midShaftSoftTissueDehiscence,
      firstAbutmentLevelComplication: data?.firstAbutmentLevelComplication,
      otherAbutmentLevelComplications: data?.otherAbutmentLevelComplications,
      totalNumberOfAbutmentLevelComplications:
        data?.totalNumberOfAbutmentLevelComplications,
      dateOfFirstAbutmentLevelComplication:
        data?.dateOfFirstAbutmentLevelComplication,
      firstAbutmentLevelComplicationTimeFromSurgery:
        data?.firstAbutmentLevelComplicationTimeFromSurgery,
      postOperativeSinusDisease: data?.postOperativeSinusDisease,
      boneLoss: data?.boneLoss,
    };
    //}
    //  else {
    //   newData = {
    //     implantFunctionAtFollowUp: data?.implantFunctionAtFollowUp,
    //     abutmentFunctionAtFollowUp: data?.abutmentFunctionAtFollowUp,
    //     sinusitis: data?.sinusitis,
    //     facialSwelling: data?.facialSwelling,
    //     inflammation: data?.inflammation,
    //     suppuration: data?.suppuration,
    //     pain: data?.pain,
    //     recession: data?.recession,
    //     midShaftSoftTissueDehiscence: data?.midShaftSoftTissueDehiscence,
    //     firstAbutmentLevelComplication: data?.firstAbutmentLevelComplication,
    //     otherAbutmentLevelComplications: data?.otherAbutmentLevelComplications,
    //     totalNumberOfAbutmentLevelComplications:
    //       data?.totalNumberOfAbutmentLevelComplications,
    //     dateOfFirstAbutmentLevelComplication:
    //       data?.dateOfFirstAbutmentLevelComplication,
    //     firstAbutmentLevelComplicationTimeFromSurgery:
    //       data?.firstAbutmentLevelComplicationTimeFromSurgery,
    //     postOperativeSinusDisease: data?.postOperativeSinusDisease,
    //     boneLoss: data?.boneLoss,
    //     title:
    //       //@ts-ignore
    //       selectedFollowUp?.title +
    //       " - " +
    //       format(new Date(), "dd MMM yyyy HH:mm"),
    //   }
    //}

    siteSpecificFollowUpMutationFunction.mutate(newData);
  };
  return (
    <Drawer isOpen={isFollowUpOpen} onClose={onFollowUpClose} size="lg">
      <DrawerOverlay bg="blackAlpha.200" />
      <DrawerContent zIndex={1499}>
        <DrawerHeader
          p="5"
          bg={
            fromClinlog
              ? "linear-gradient(90deg, var(--clinlog-purple, #452A7E) 25%, #612ECC 100%)"
              : "#0E11C7"
          }
        >
          <Flex align={"center"} gap="0.5rem">
            <chakra.span
              className="material-symbols-outlined"
              fontSize={{ base: "18px", md: "23px" }}
              color="white"
              cursor={"pointer"}
              onClick={onFollowUpClose}
            >
              arrow_back_ios
            </chakra.span>
            <Spacer />
            <chakra.span
              className="material-symbols-outlined"
              fontSize={{ base: "18px", md: "23px" }}
              color="#91C1F5"
            >
              graph_6
            </chakra.span>
            <Text fontSize="14px" color="white">
              SITE SPECIFIC FOLLOW UP | SITE {selectedSite?.toothValue}
            </Text>
            <Spacer />
          </Flex>
        </DrawerHeader>
        <DrawerBody>
          <Flex w="100%" h="95%">
            <chakra.form
              onSubmit={siteFollowUpSubmit(onSiteFollowUpSubmit)}
              w="100%"
            >
              <Flex
                flexDirection="column"
                p={4}
                gap="0.5rem"
                w="100%"
                h="95%"
                overflowY="auto"
              >
                {" "}
                <Text>Review Date: </Text>
                <Text>
                  {followUpDate || dateOfReview
                    ? format(
                        new Date(followUpDate || dateOfReview),
                        "dd MMMM yyyy",
                      )
                    : "N/A"}
                </Text>
                <Text
                  color="#007AFF"
                  fontSize="12px"
                  fontWeight="600"
                  textTransform={"uppercase"}
                >
                  Clinical Follow Up
                </Text>
                <Divider />
                <Input
                  type="hidden"
                  value={siteFollowUpId || "new"}
                  {...siteFollowUpRegister("id")}
                />
                <Input
                  type="hidden"
                  value={selectedSite?.id}
                  {...siteFollowUpRegister("siteId")}
                />
                <Input
                  type="hidden"
                  {...siteFollowUpRegister("isWithin24Hours")}
                />
                <SimpleGrid columns={2} spacing={4}>
                  {siteFollowUpFields.map((item, index) => {
                    return (
                      <Flex
                        w="100%"
                        gap="0.5rem"
                        align="center"
                        p="2"
                        flexDirection={"column"}
                        key={`${siteFollowUpId || "new"}-${item.key}`}
                      >
                        <Text
                          fontSize="10px"
                          fontWeight="700"
                          textTransform={"uppercase"}
                          textAlign={"left"}
                          w="100%"
                        >
                          {item.label}
                        </Text>

                        <Text
                          alignSelf={"flex-start"}
                          border="1px solid #D9D9D9"
                          borderRadius="6px"
                          fontSize="11px"
                          w="100%"
                          p="3"
                          textTransform={"uppercase"}
                        >
                          {item?.key ===
                            "dateOfFirstAbutmentLevelComplication" &&
                          item?.value
                            ? format(new Date(item.value), "dd MMM yyyy")
                            : item?.value || "N/A"}
                        </Text>
                      </Flex>
                    );
                  })}
                </SimpleGrid>
              </Flex>
            </chakra.form>
          </Flex>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
