//@ts-nocheck
import {
  Divider,
  chakra,
  Flex,
  Spacer,
  Text,
  Tooltip,
  Box,
  Select,
  Image,
  Tag,
  Button,
  Input,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerBody,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  SimpleGrid,
  Table,
  Tbody,
  Td,
  Tr,
  Thead,
  Spinner,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  useBreakpointValue,
  TableContainer,
  Th,
  ModalCloseButton,
  AccordionPanel,
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  DrawerCloseButton,
  Checkbox,
} from "@chakra-ui/react";

import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getGroupedRowModel,
  getExpandedRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import React, { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { gql } from "graphql-request";
import useQueryHook, { sendData } from "hooks/useQueryHook";
import {
  addMonths,
  differenceInDays,
  differenceInHours,
  differenceInYears,
  format,
} from "date-fns";
import JSZip from "jszip";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import SiteSpecificSideBar from "./SiteSpecificSideBar";
import {
  createSiteSpecificFollowUpMutation,
  globalPatientDetailsMutation,
} from "../detailsPageMutations";
import {
  MdAddCircleOutline,
  MdCheckCircleOutline,
  MdIncompleteCircle,
  MdWarning,
} from "react-icons/md";
import SiteSpecificFollowUpV3 from "./SiteSpecificFollowUpV3";
import {
  patientCharacteristicsQuery,
  patientCharacteristicsQueryFreeform,
} from "../DetailsPageQueries";
import { useV2Router } from "componentsv2/Dashboard/Helpers/routerHelpers";

type TreatmentToothMatrix = {
  id: string;
  toothValue: string;
  treatmentItemNumber: string;
  completed: boolean;
  approved: boolean;
  attachedSiteSpecificRecords?: Array<{
    id: string;
    barType?: string;
    barMaterial?: string;
    barLengthFrom?: string;
    barLengthTo?: string;
    attachedSiteSpecificFollowUp?: Array<{
      statusOfImplant?: string;
      statusOfBar?: string;
      [key: string]: any;
    }>;
    itemSpecificationMatrix?: Array<{
      implantTypeLabel?: string;
      implantLengthLabel?: string;
      placementLabel?: string;
      graftingAppliedLabel?: string;
      [key: string]: any;
    }>;
    [key: string]: any;
  }>;
  [key: string]: any;
};

export default function SurgicalDetailsV3_2({
  setClinlogStatus,
  selectedRecord,
  toastData,
  patientName,
  proposedTreatmentChartResults,
  proposedTreatmentChartIds,
  patientDob,
  patientGender,
  globalPostId,
  isLoading,
  detailsData,
  fromClinlog = false,
}) {
  const router = useV2Router();
  const { query } = router;
  // Tab state for segmented control
  const [activeTab, setActiveTab] = useState("THIS TREATMENT");
  const siteSpecificGlobalQuery = gql`
    query siteSpecificGlobalQuery($id: [QueryArgument]) {
      entries(
        section: "dentalChartRecords"
        type: "proposedTreatmentChart"
        patientFormGlobal: $id
      ) {
        ... on dentalChartRecords_proposedTreatmentChart_Entry {
          patientFormRecord {
            ... on records_records_Entry {
              dateOfInsertion
            }
          }
          proposedTreatmentToothMatrix {
            ... on proposedTreatmentToothMatrix_toothDetails_BlockType {
              id
              initialDate
              treatmentItemTitle
              treatmentItemNumber
              treatmentItemDescription
              treatmentFriendlyName
              toothValue
              toothPosition
              completedDate
              approved
              completed
              groupTitle
              groupTitleParent
              treatmentPaid
              groupNumber
              visitTitle
              visitNumber
              patientCost
              discountReason
              vgds
              discount
              vetAffairs
              medicare
              cost
              recordTreatmentDate
              attachedSiteSpecificRecords {
                ... on treatmentItemSpecificationRecord_barSpecifications_Entry {
                  id
                  archLocation
                  barMaterial
                  barLengthFrom
                  barLengthTo
                  barType
                }
                ... on treatmentItemSpecificationRecord_itemSpecificationAndDetails_Entry {
                  id
                  itemSpecificationMatrix {
                    ... on itemSpecificationMatrix_itemSpecs_BlockType {
                      enableInClinlog
                      implantBrand
                      implantLength
                      implantType
                      angleCorrectionAbutment
                      serialSequenceBarCode
                      insertionTorque
                      insertionTorqueLabel: insertionTorque(label: true)
                      radiographicTrabecularDensityHu
                      placement
                      placementLabel: placement(label: true)
                      relevantBoneWidth
                      relevantBoneWidthLabel: relevantBoneWidth(label: true)
                      trabecularBoneDensity
                      trabecularBoneDensityLabel: trabecularBoneDensity(
                        label: true
                      )
                      boneVascularity
                      boneVascularityLabel: boneVascularity(label: true)
                      crestalRest
                      crestalRestLabel: crestalRest(label: true)
                      graftingApplied
                      graftingAppliedLabel: graftingApplied(label: true)
                      graftMaterial
                      graftMaterialLabel: graftMaterial(label: true)
                      intraOperativeSinusComplications
                      intraOperativeSinusComplicationsLabel: intraOperativeSinusComplications(
                        label: true
                      )
                      preOperativeSinusDisease
                      preOperativeSinusDiseaseLabel: preOperativeSinusDisease(
                        label: true
                      )
                      preOperativeSinusDiseaseManagement
                      preOperativeSinusDiseaseManagementLabel: preOperativeSinusDiseaseManagement(
                        label: true
                      )
                      conformanceWithTreatmentPlan
                      conformanceWithTreatmentPlanLabel: conformanceWithTreatmentPlan(
                        label: true
                      )
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  const siteSpecificGlobal = useQueryHook(
    ["siteSpecificGlobal", globalPostId],
    siteSpecificGlobalQuery,
    { id: [Number(globalPostId)] },
    {
      refetchOnWindowFocus: false,
      enabled: activeTab === "ALL",
    },
  );
  const fetchDentalComponentsQuery = gql`
    query fetchDentalComponentsQuery {
      entries(section: "dentalComponents") {
        ... on dentalComponents_implantList_Entry {
          id
          implantLength
          implantType
          componentReference
          referenceNumber
          brand
          description
          title
          typeHandle
          isGlobal
          recordClinic {
            id
          }
          implantCategory
          implantCategoryLabel: implantCategory(label: true)
          implantLine
          surface
          implantBaseDiameter
          serialSequenceCode
        }
        ... on dentalComponents_abutmentList_Entry {
          id
          brand
          angleAndDiameter
          angleCorrectionAbutment
          abutmentLength
          description
          referenceNumber
          componentReference
          title
          typeHandle
          isGlobal
          recordClinic {
            id
          }
          abutmentCategory
          abutmentCategoryLabel: abutmentCategory(label: true)
          gingivalHeight
          typeAndDiameter
          abutmentHeight
          serialSequenceCode
        }
      }
    }
  `;

  const fetchDentalComponentsQueryResult = useQueryHook(
    ["fetchDentalComponentsQueryResult"],
    fetchDentalComponentsQuery,
    {},
    { enabled: true },
  );

  const patientCharacteristicsQueryFreeformResults = useQueryHook(
    ["patientCharacteristicsQueryFreeform", selectedRecord?.id],
    patientCharacteristicsQueryFreeform,
    {
      entryId: Number(selectedRecord?.id),
      // globalId: Number(globalPostId),
    },
    {
      enabled: !fromClinlog && selectedRecord && detailsData?.recordPatient,
      refetchOnWindowFocus: false,
    },
  );

  const patientCharacteristicsQueryResults = useQueryHook(
    ["patientCharacteristicsQuery", selectedRecord?.id],
    patientCharacteristicsQuery,
    { entryId: Number(selectedRecord?.id) },
    {
      enabled: selectedRecord && detailsData?.recordPatient,
      refetchOnWindowFocus: false,
    },
  );

  const { control, register, handleSubmit, watch, setValue, getValues } =
    useForm();

  const [statusFilter, setStatusFilter] = useState("all");
  const ITEMS_PER_PAGE = 10;
  const PAGE_GROUP_SIZE = 4;
  const {
    control: controlFollowUp,
    register: registerFollowUp,
    handleSubmit: handleSubmitFollowUp,
    watch: watchFollowUp,
    setValue: setValueFollowUp,
    getValues: getValuesFollowUp,
  } = useForm();

  const formValues = watch();
  const formValuesFollowUp = watchFollowUp();

  const { toast, toastIdRef } = toastData;
  const [editTreatmentChar, setEditTreatmentChar] = useState(false);
  const [editType, setEditType] = useState("");
  const [isWithin24Hours, setIsWithin24Hours] = useState(false);
  const queryClient = useQueryClient();

  const {
    isOpen: isSidebarOpen,
    onOpen: onSidebarOpen,
    onClose: onSidebarClose,
  } = useDisclosure();

  const {
    isOpen: isReviewOpen,
    onOpen: onReviewOpen,
    onClose: onReviewClose,
  } = useDisclosure();

  const {
    isOpen: isFollowUpOpen,
    onOpen: onFollowUpOpen,
    onClose: onFollowUpClose,
  } = useDisclosure();

  const {
    isOpen: isCharcteristicsOpen,
    onOpen: onCharcteristicsOpen,
    onClose: onCharcteristicsClose,
  } = useDisclosure();

  const approvedTreatments = proposedTreatmentChartResults?.find(
    (proposal) =>
      proposal.chartStatus === "approved" ||
      proposal.chartStatus === "modified",
  );

  const barTypeOptions = [
    { name: "FIXED FP3 PROSTHESIS WITH RIGID BAR", value: "fixedFp3" },
    { name: "FP1 or FP2 IMPLANT SUPPORTED BRIDGE", value: "fp1Fp2" },
    { name: "DENTURE", value: "denture" },
    { name: "IMPLANT SUPPORTED (BAR) REMOVAL DENTURE", value: "dentureBar" },
    {
      name: "IMPLANT SUPPORTED (LOCATOR) REMOVAL DENTURE",
      value: "dentureLocator",
    },
  ];

  const sitesWithImplantsMemo = useMemo(() => {
    let approvedProposal = null;
    if (activeTab === "THIS TREATMENT") {
      approvedProposal = proposedTreatmentChartResults?.find(
        (proposal) =>
          proposal.chartStatus === "approved" ||
          proposal.chartStatus === "modified",
      );

      if (approvedProposal) {
        const filteredSites =
          approvedProposal?.proposedTreatmentToothMatrix?.filter((item) => {
            if (statusFilter === "all") {
              return true;
            } else if (statusFilter === "completed") {
              return item?.completed;
            } else if (statusFilter === "approved") {
              return item?.approved;
            } else if (statusFilter === "pending") {
              return !item?.completed;
            }
          });

        return filteredSites
          ?.filter(
            (item) =>
              item?.treatmentItemNumber == "688" ||
              item?.treatmentItemNumber == "666" ||
              item?.treatmentItemNumber == "661",
          )
          .map((item) => ({
            ...item,
            insertionDate:
              approvedProposal.patientFormRecord?.[0]?.dateOfInsertion,
          }));
      }
    } else {
      const allSites = siteSpecificGlobal?.data?.entries
        ?.map((entryItem) => {
          const addInsertionDate = entryItem?.proposedTreatmentToothMatrix?.map(
            (item) => {
              return {
                ...item,
                insertionDate:
                  entryItem.patientFormRecord?.[0]?.dateOfInsertion,
              };
            },
          );
          return addInsertionDate;
        })
        .flat();

      const filteredSites = allSites?.filter((item) => {
        if (statusFilter === "all") {
          return true;
        } else if (statusFilter === "completed") {
          return item?.completed;
        } else if (statusFilter === "approved") {
          return item?.approved;
        } else if (statusFilter === "pending") {
          return !item?.completed;
        }
      });

      return filteredSites?.filter(
        (item) =>
          item?.treatmentItemNumber === "688" ||
          item?.treatmentItemNumber === "666" ||
          item?.treatmentItemNumber === "661",
      );
    }
    return [];
  }, [
    proposedTreatmentChartResults,
    statusFilter,
    activeTab,
    siteSpecificGlobal?.data?.entries,
  ]);

  const { data: session } = useSession();
  const [selectedSite, setSelectedSite] = useState(null);

  const characteristicsMutation = gql`
    mutation characteristicsMutation(
      $id: ID!
      $ageAtTimeOfSurgery: Number
      $alcohol: String
      $archType: String
      $bruxism: String
      $diabetesAndOsteoporosis: String
      $diagnosisOrAetiology: String
      $enableClinlog: Boolean
      $immediateAesthetics: String
      $immediateFunctionSpeech: String
      $immediateRestoration: String
      $lowerArchCondition: String
      $oestrogen: String
      $oralHygiene: String
      $recordBmi: Number
      $regularImplants: Number
      $sex: String
      $smoking: String
      $upperArchCondition: String
      $dateOfInsertion: DateTime
      $zygomaImplants: Number
      $caseNumber: String
      $isImageIdentifiable: Boolean
      $preOpPhotos: String
      $preOpReconstructedOpg: String
      $postOpPhotos: String
      $postOp2DOpg: String
      $postOp3DOpg: String
    ) {
      save_records_records_Entry(
        id: $id
        ageAtTimeOfSurgery: $ageAtTimeOfSurgery
        alcohol: $alcohol
        archType: $archType
        bruxism: $bruxism
        diabetesAndOsteoporosis: $diabetesAndOsteoporosis
        diagnosisOrAetiology: $diagnosisOrAetiology
        enableClinlog: $enableClinlog
        immediateAesthetics: $immediateAesthetics
        immediateFunctionSpeech: $immediateFunctionSpeech
        immediateRestoration: $immediateRestoration
        lowerArchCondition: $lowerArchCondition
        oestrogen: $oestrogen
        oralHygiene: $oralHygiene
        recordBmi: $recordBmi
        regularImplants: $regularImplants
        sex: $sex
        smoking: $smoking
        upperArchCondition: $upperArchCondition
        dateOfInsertion: $dateOfInsertion
        zygomaImplants: $zygomaImplants
        caseNumber: $caseNumber
        isImageIdentifiable: $isImageIdentifiable
        preOpPhotos: $preOpPhotos
        preOpReconstructedOpg: $preOpReconstructedOpg
        postOpPhotos: $postOpPhotos
        postOp2DOpg: $postOp2DOpg
        postOp3DOpg: $postOp3DOpg
      ) {
        id
      }
    }
  `;
  const followUpMatrixMutation = gql`
    mutation followUpMatrixMutation(
      $id: ID!
      $recordFollowUpMatrix: [recordFollowUpMatrix_MatrixBlockContainerInput]
      $followUpMatrixSortOrder: [QueryArgument]
    ) {
      save_records_records_Entry(
        id: $id
        recordFollowUpMatrix: {
          blocks: $recordFollowUpMatrix
          sortOrder: $followUpMatrixSortOrder
        }
      ) {
        id
      }
    }
  `;

  const siteSpecificMutation = gql`
    mutation siteSpecificMutation(
      $id: ID!
      $attachedSiteSpecificFollowUp: [Int]
    ) {
      save_treatmentItemSpecificationRecord_itemSpecificationAndDetails_Entry(
        id: $id
        attachedSiteSpecificFollowUp: $attachedSiteSpecificFollowUp
      ) {
        id
      }
    }
  `;
  const updateBarSpecificMutation = gql`
    mutation updateBarSpecificMutation(
      $id: ID!
      $attachedSiteSpecificFollowUp: [Int]
    ) {
      save_treatmentItemSpecificationRecord_barSpecifications_Entry(
        id: $id
        attachedSiteSpecificFollowUp: $attachedSiteSpecificFollowUp
      ) {
        id
      }
    }
  `;

  const medicalDentalHistoryFreeformSubmission =
    patientCharacteristicsQueryFreeformResults?.data
      ?.patientFormMedicalDentalHistorySubmissions?.[0] ?? null;

  const medicalDentalHistoryMatrixSubmission =
    patientCharacteristicsQueryResults?.data?.matrixFormsEntries?.find(
      (item) => Object.keys(item)?.[0] === "patientFormMedicalDentalHistory",
    )?.patientFormMedicalDentalHistory?.[0] ?? null;

  const medicalDentalHistorySubmission = !!(
    medicalDentalHistoryFreeformSubmission &&
    medicalDentalHistoryMatrixSubmission
  )
    ? new Date(medicalDentalHistoryFreeformSubmission.dateCreated).getTime() >
      new Date(medicalDentalHistoryMatrixSubmission.dateCreated).getTime()
      ? medicalDentalHistoryFreeformSubmission
      : medicalDentalHistoryMatrixSubmission
    : (medicalDentalHistoryFreeformSubmission ??
      medicalDentalHistoryMatrixSubmission ??
      null);

  const preAnaestheticInformationFreeformSubmission =
    patientCharacteristicsQueryFreeformResults?.data
      ?.patientFormPreAnaestheticInformationSubmissions?.[0] ?? null;

  const preAnaestheticInformationMatrixSubmission =
    patientCharacteristicsQueryResults?.data?.matrixFormsEntries?.find(
      (item) =>
        Object.keys(item)?.[0] === "patientFormPreAnaestheticInformation",
    )?.patientFormPreAnaestheticInformation?.[0] ?? null;

  const preAnaestheticInformationSubmission = !!(
    preAnaestheticInformationFreeformSubmission &&
    preAnaestheticInformationMatrixSubmission
  )
    ? new Date(
        preAnaestheticInformationFreeformSubmission.dateCreated,
      ).getTime() >
      new Date(preAnaestheticInformationMatrixSubmission.dateCreated).getTime()
      ? preAnaestheticInformationFreeformSubmission
      : preAnaestheticInformationMatrixSubmission
    : (preAnaestheticInformationFreeformSubmission ??
      preAnaestheticInformationMatrixSubmission ??
      null);

  const [followUpId, setFollowUpId] = useState(null);
  const [showSiteFollowUp, setShowSiteFollowUp] = useState(false);

  const selectedFollowUp = useMemo(() => {
    if (followUpId) {
      return selectedRecord?.recordFollowUpMatrix?.find(
        (item) => item.id === followUpId,
      );
    } else return null;
  }, [followUpId, selectedRecord]);

  useEffect(() => {
    if (query?.drawer == "bmi") {
      if (!fromClinlog) {
        setEditTreatmentChar(true);
      }
      setEditType("patient");
      onCharcteristicsOpen();
    }
  }, [query?.drawer, onCharcteristicsOpen]);

  useEffect(() => {
    if (selectedFollowUp) {
      setValueFollowUp(
        "examiner",
        selectedFollowUp?.examiner ? selectedFollowUp?.examiner : "unknown",
      );
      setValueFollowUp(
        "numberOfReviews",
        selectedFollowUp?.numberOfReviews ||
          selectedRecord?.recordFollowUpMatrix?.length ||
          "unknown",
      );
      setValueFollowUp(
        "numberOfRestorativeBreakages",
        selectedFollowUp?.numberOfRestorativeBreakages || "unknown",
      );
      setValueFollowUp(
        "zirconiaUpgrade",
        selectedFollowUp?.zirconiaUpgrade || "unknown",
      );
      setValueFollowUp(
        "performanceOverFollowUpPeriod",
        selectedFollowUp?.performanceOverFollowUpPeriod || "unknown",
      );
      setValueFollowUp(
        "examinerRadiographic",
        selectedFollowUp?.examinerRadiographic,
      );
      setValueFollowUp(
        "dateOfFollowUp",
        selectedFollowUp?.dateOfFollowUp
          ? format(new Date(selectedFollowUp?.dateOfFollowUp), "yyyy-MM-dd")
          : null,
      );
      const timeFromSurgery = selectedFollowUp?.timeFromSurgery
        ? selectedFollowUp?.timeFromSurgery
        : selectedFollowUp?.dateOfFollowUp &&
            selectedRecord?.recordTreatmentDate
          ? differenceInDays(
              new Date(selectedFollowUp?.dateOfFollowUp),
              new Date(selectedRecord?.recordTreatmentDate),
            )
          : 0;
      setValueFollowUp(
        "timeFromSurgery",
        Number(timeFromSurgery) > 0 ? timeFromSurgery : "unknown",
      );
      setValueFollowUp(
        "smokingAtFollowUp",
        selectedFollowUp?.smokingAtFollowUp
          ? selectedFollowUp?.smokingAtFollowUp
          : "unknown",
      );
      setValueFollowUp(
        "hygieneAtFollowUp",
        selectedFollowUp?.hygieneAtFollowUp
          ? selectedFollowUp?.hygieneAtFollowUp
          : "unknown",
      );
    } else {
      setValueFollowUp("examiner", session?.fullName);
      setValueFollowUp("performanceOverFollowUpPeriod", "");
      setValueFollowUp("dateOfFollowUp", format(new Date(), "yyyy-MM-dd"));
      setValueFollowUp(
        "timeFromSurgery",
        differenceInDays(
          new Date(),
          new Date(selectedRecord?.recordTreatmentDate),
        ),
      );
      setValueFollowUp("smokingAtFollowUp", "");
      setValueFollowUp("hygieneAtFollowUp", "");
    }
  }, [selectedFollowUp]);

  useEffect(() => {
    setValue(
      "isImageIdentifiable",
      selectedRecord?.isImageIdentifiable || false,
    );
    setValue("preOpPhotos", selectedRecord?.preOpPhotos || "");
    setValue(
      "preOpReconstructedOpg",
      selectedRecord?.preOpReconstructedOpg || "",
    );
    setValue("postOpPhotos", selectedRecord?.postOpPhotos || "");
    setValue("postOp2DOpg", selectedRecord?.postOp2DOpg || "");
    setValue("postOp3DOpg", selectedRecord?.postOp3DOpg || "");
    if (selectedRecord?.ageAtTimeOfSurgery) {
      setValue("ageAtTimeOfSurgery", selectedRecord?.ageAtTimeOfSurgery);
    } else {
      const diff =
        patientDob && selectedRecord?.recordTreatmentDate
          ? differenceInYears(
              new Date(selectedRecord?.recordTreatmentDate),
              new Date(patientDob),
            )
          : 0;
      if (diff > 0) {
        setValue("ageAtTimeOfSurgery", diff);
      } else {
        setValue("ageAtTimeOfSurgery", "unknown");
      }
    }
    if (selectedRecord?.sex) {
      const genderValue = ["F", "Female", "female"]?.includes(
        selectedRecord?.sex,
      )
        ? "Female"
        : ["M", "Male", "male"]?.includes(selectedRecord?.sex)
          ? "Male"
          : "Other";
      setValue("sex", genderValue);
    } else if (patientGender) {
      const genderValue = ["F", "Female", "female"]?.includes(patientGender)
        ? "Female"
        : ["M", "Male", "male"]?.includes(patientGender)
          ? "Male"
          : "Other";
      setValue("sex", genderValue);
    } else {
      setValue("sex", "unknown");
    }
    if (selectedRecord?.oralHygiene) {
      setValue("oralHygiene", selectedRecord?.oralHygiene);
    } else {
      setValue("oralHygiene", "unknown");
    }
    if (selectedRecord?.bruxism) {
      setValue("bruxism", selectedRecord?.bruxism);
    } else {
      setValue("bruxism", "unknown");
    }
    if (selectedRecord?.diagnosisOrAetiology) {
      setValue("diagnosisOrAetiology", selectedRecord?.diagnosisOrAetiology);
    } else {
      setValue("diagnosisOrAetiology", "unknownOrOther");
    }
    if (selectedRecord?.caseNumber) {
      setValue("caseNumber", selectedRecord?.caseNumber);
    } else {
      setValue("caseNumber", "");
    }

    if (selectedRecord?.archType) {
      setValue("archType", selectedRecord?.archType);
    } else {
      setValue("archType", "unknown");
    }
    if (selectedRecord?.upperArchCondition) {
      setValue("upperArchCondition", selectedRecord?.upperArchCondition);
    } else {
      setValue("upperArchCondition", "unknown");
    }
    if (selectedRecord?.lowerArchCondition) {
      setValue("lowerArchCondition", selectedRecord?.lowerArchCondition);
    } else {
      setValue("lowerArchCondition", "unknown");
    }
    if (selectedRecord?.zygomaImplants) {
      setValue("zygomaImplants", selectedRecord?.zygomaImplants);
    } else {
      setValue("zygomaImplants", "unknown");
    }
    if (selectedRecord?.regularImplants) {
      setValue("regularImplants", selectedRecord?.regularImplants);
    } else {
      setValue("regularImplants", "unknown");
    }
    if (selectedRecord?.immediateRestoration) {
      setValue("immediateRestoration", selectedRecord?.immediateRestoration);
    } else {
      setValue("immediateRestoration", "unknown");
    }
    if (selectedRecord?.dateOfInsertion) {
      setValue(
        "dateOfInsertion",
        format(new Date(selectedRecord?.dateOfInsertion), "yyyy-MM-dd"),
      );
    } else {
      setValue("dateOfInsertion", null);
    }
    if (selectedRecord?.timeFromSurgeryToInsertion) {
      setValue(
        "timeFromSurgeryToInsertion",
        selectedRecord?.timeFromSurgeryToInsertion,
      );
    } else {
      setValue("timeFromSurgeryToInsertion", "unknown");
    }
    if (selectedRecord?.immediateFunctionSpeech) {
      setValue(
        "immediateFunctionSpeech",
        selectedRecord?.immediateFunctionSpeech,
      );
    } else {
      setValue("immediateFunctionSpeech", "unknown");
    }
    if (selectedRecord?.immediateAesthetics) {
      setValue("immediateAesthetics", selectedRecord?.immediateAesthetics);
    } else {
      setValue("immediateAesthetics", "unknown");
    }
    const timeFromSurgery =
      selectedRecord?.recordTreatmentDate && selectedRecord?.dateOfInsertion
        ? differenceInHours(
            new Date(selectedRecord?.dateOfInsertion),
            new Date(selectedRecord?.recordTreatmentDate),
          )
        : 0;

    if (timeFromSurgery > 0) {
      setValue("timeFromSurgeryToInsertion", Math.round(timeFromSurgery / 24));
    } else {
      setValue("timeFromSurgeryToInsertion", "unknown");
    }

    if (selectedRecord?.recordTreatmentDate) {
      const diff = differenceInDays(
        new Date(),
        new Date(selectedRecord?.recordTreatmentDate),
      );

      setIsWithin24Hours(true);
    }
  }, []);

  useEffect(() => {
    setValue("enableClinlog", selectedRecord?.enableClinlog);
    if (medicalDentalHistorySubmission || selectedRecord) {
      if (selectedRecord?.diabetesAndOsteoporosis) {
        setValue(
          "diabetesAndOsteoporosis",
          selectedRecord?.diabetesAndOsteoporosis,
        );
      } else {
        const conditions = medicalDentalHistorySubmission?.conditions;
        if (conditions && conditions.length > 0) {
          if (
            conditions.includes("diabetes") &&
            conditions.includes("osteoporosis")
          ) {
            setValue("diabetesAndOsteoporosis", "Diabetes + Osteoporosis");
          } else if (conditions.includes("diabetes")) {
            setValue("diabetesAndOsteoporosis", "Diabetes");
          } else if (conditions.includes("osteoporosis")) {
            setValue("diabetesAndOsteoporosis", "Osteoporosis");
          } else {
            setValue("diabetesAndOsteoporosis", "None");
          }
        } else {
          setValue("diabetesAndOsteoporosis", "unknown");
        }
      }
      if (selectedRecord?.oestrogen) {
        setValue("oestrogen", selectedRecord?.oestrogen);
      } else {
        const boneDisease = medicalDentalHistorySubmission?.boneDisease;
        if (boneDisease) {
          if (boneDisease.includes("no")) {
            setValue("oestrogen", "No");
          } else if (boneDisease.includes("yes")) {
            setValue("oestrogen", "Yes");
          } else {
            setValue("oestrogen", "unknown");
          }
        } else {
          setValue("oestrogen", "unknown");
        }
      }
      if (selectedRecord?.smoking) {
        setValue("smoking", selectedRecord?.smoking);
      } else {
        const smoking = medicalDentalHistorySubmission?.doesSmoke;
        if (smoking) {
          setValue("smoking", smoking);
        } else {
          setValue("smoking", "unknown");
        }
      }
      if (selectedRecord?.alcohol) {
        setValue("alcohol", selectedRecord?.alcohol);
      } else {
        const alcohol =
          medicalDentalHistorySubmission?.doesAlcohol ||
          medicalDentalHistorySubmission?.doesALCOHOL;

        if (alcohol) {
          if (alcohol.includes("I drink 4-6 standard drinks per week")) {
            setValue("alcohol", "I drink 2-4 standard drinks per week");
          } else {
            setValue("alcohol", alcohol);
          }
        } else {
          setValue("alcohol", "unknown");
        }
      }
    } else {
      setValue("diabetesAndOsteoporosis", "unknown");
      setValue("oestrogen", "unknown");
      setValue("smoking", "unknown");
      setValue("alcohol", "unknown");
      setValue("recordBmi", "unknown");
      setValue("ageAtTimeOfSurgery", "unknown");
    }
    if (preAnaestheticInformationSubmission || selectedRecord?.recordBmi) {
      const bmi =
        preAnaestheticInformationSubmission?.bmi ??
        selectedRecord?.recordBmi ??
        null;
      if (bmi) {
        setValue("recordBmi", bmi);
      } else {
        setValue("recordBmi", "unknown");
      }
    } else {
      setValue("recordBmi", "unknown");
    }
  }, [
    selectedRecord,
    patientCharacteristicsQueryResults?.data,
    patientCharacteristicsQueryFreeformResults?.data,
    medicalDentalHistorySubmission,
    preAnaestheticInformationSubmission,
  ]);

  const patientCharacteristics = useMemo(() => {
    return [
      {
        label: "BMI",
        key: "recordBmi",
        icon: "monitor_weight",
        info: "Patient’s Body Mass Index at the time of assessment. May be manually entered or verified from the Patient Medical History Form.",
        value: getValues("recordBmi"),
        boxColor:
          getValues("recordBmi") !== "unknown"
            ? selectedRecord?.recordBmi
              ? "#4ADE80"
              : "#FF9B56"
            : "#FF1111",
        edit: true,
      },
      {
        label: "Diabetes & Osteoporosis",
        key: "diabetesAndOsteoporosis",
        options: [
          { name: "Diabetes", value: "Diabetes" },
          { name: "Osteoporosis", value: "Osteoporosis" },
          { name: "Diabetes + Osteoporosis", value: "Diabetes + Osteoporosis" },
          { name: "None", value: "None" },
          { name: "Unknown", value: "unknown" },
        ],
        icon: "glucose",
        value: getValues("diabetesAndOsteoporosis"),
        info: "Indicates whether the patient has diabetes, osteoporosis, or both. May be manually entered or verified from the Patient Medical History Form.",
        boxColor:
          getValues("diabetesAndOsteoporosis") !== "unknown"
            ? selectedRecord?.diabetesAndOsteoporosis
              ? "#4ADE80"
              : "#FF9B56"
            : "#FF1111",
        edit: true,
      },
      {
        label: "Oestrogen",
        key: "oestrogen",
        options: [
          { name: "Yes", value: "Yes" },
          { name: "No", value: "No" },
          { name: "Not Applicable", value: "Not Applicable" },
          { name: "Unknown", value: "unknown" },
        ],
        icon: "share",
        info: "Whether the patient is taking oestrogen or hormone therapy. May be manually entered or verified from the Patient Medical History Form.",
        boxColor:
          getValues("oestrogen") !== "unknown"
            ? selectedRecord?.oestrogen
              ? "#4ADE80"
              : "#FF9B56"
            : "#FF1111",
        value: getValues("oestrogen"),
        edit: true,
      },
      {
        label: "Smoking",
        key: "smoking",
        options: [
          { name: "Never", value: "I don’t smoke" },
          {
            name: "Occasionally/Socially",
            value: "I smoke occasionally or socially only",
          },
          { name: "Daily", value: "I smoke daily" },
          { name: "Unknown", value: "unknown" },
        ],
        icon: "smoking_rooms",
        value: getValues("smoking"),
        info: "Patient’s smoking status. May be manually entered or verified from the Patient Medical History Form.",
        boxColor:
          getValues("smoking") !== "unknown"
            ? selectedRecord?.smoking
              ? "#4ADE80"
              : "#FF9B56"
            : "#FF1111",
        edit: true,
      },
      {
        label: "Alcohol",
        key: "alcohol",
        options: [
          { name: "Never", value: "I don’t drink Alcohol" },
          {
            name: "Occasionally / Socially",
            value: "I drink occasionally or socially only",
          },
          {
            name: "2-4 standard drinks per week",
            value: "I drink 2-4 standard drinks per week",
          },
          { name: "Daily", value: "I drink daily" },
          { name: "Unknown", value: "unknown" },
        ],
        icon: "local_bar",
        value: getValues("alcohol"),
        info: "Frequency of alcohol consumption. May be manually entered or verified from the Patient Medical History Form.",
        boxColor:
          getValues("alcohol") !== "unknown"
            ? selectedRecord?.alcohol
              ? "#4ADE80"
              : "#FF9B56"
            : "#FF1111",
        edit: true,
      },
      {
        label: "Oral Hygiene",
        key: "oralHygiene",
        options: [
          { name: "Unknown", value: "unknown" },
          { name: "Excellent", value: "Excellent" },
          { name: "Reasonable", value: "Reasonable" },
          { name: "Poor", value: "Poor" },
          { name: "Very Poor", value: "Very Poor" },
        ],
        icon: "voice_selection",
        info: "Assessment of the patient’s oral hygiene and plaque control. May be manually entered or verified from the Patient Medical History Form.",
        boxColor:
          getValues("oralHygiene") !== "unknown"
            ? selectedRecord?.oralHygiene
              ? "#4ADE80"
              : "#FF9B56"
            : "#FF1111",
        value: getValues("oralHygiene"),
        edit: true,
      },
      {
        label: "Bruxism",
        key: "bruxism",
        options: [
          { name: "Unknown", value: "unknown" },
          { name: "Not Present", value: "Not Present" },
          { name: "Mild Signs", value: "Mild Signs" },
          { name: "Moderate or At Risk", value: "Moderate or At Risk" },
          { name: "Advanced Bruxism", value: "Advanced Bruxism" },
        ],
        icon: "dentistry",
        info: "Whether the patient clenches or grinds their teeth. May be manually entered or verified from the Patient Medical History Form.",
        boxColor:
          getValues("bruxism") !== "unknown"
            ? selectedRecord?.bruxism
              ? "#4ADE80"
              : "#FF9B56"
            : "#FF1111",
        value: getValues("bruxism"),
        edit: true,
      },
      {
        label: "Diagnosis/ Aetiology",
        key: "diagnosisOrAetiology",
        options: [
          { name: "Unknown / Other", value: "unknownOrOther" },
          { name: "Trauma", value: "Trauma" },
          { name: "Caries", value: "Caries" },
          { name: "Gum Disease", value: "Gum Disease" },
          { name: "Occlusal Wear or Trauma", value: "Occlusal Wear or Trauma" },
        ],
        icon: "bar_chart",
        info: "Primary cause of the patient’s dental condition (e.g., periodontal disease, trauma). May be manually entered or verified from the Patient Medical History Form.",
        boxColor:
          getValues("diagnosisOrAetiology") !== "unknownOrOther"
            ? selectedRecord?.diagnosisOrAetiology
              ? "#4ADE80"
              : "#FF9B56"
            : "#FF1111",
        value: getValues("diagnosisOrAetiology"),
        edit: true,
      },
      {
        label: "Age at Surgery",
        key: "ageAtTimeOfSurgery",
        icon: "cake",
        info: "Patient’s age on the day of surgery. Automatically calculated from the treatment date.",
        boxColor:
          getValues("ageAtTimeOfSurgery") !== "unknown"
            ? selectedRecord?.ageAtTimeOfSurgery
              ? "#4ADE80"
              : "#FF9B56"
            : "#FF1111",
        value: getValues("ageAtTimeOfSurgery"),
        edit: false,
      },
      {
        label: "Gender at Surgery",
        key: "sex",
        options: [
          { name: "Female", value: "Female" },
          { name: "Male", value: "Male" },
          { name: "Other", value: "Other" },
          { name: "Unknown", value: "unknown" },
        ],
        icon: "wc",

        info: "Patient’s gender at the time of surgery. May be manually entered or verified from the Patient Medical History Form.",
        boxColor:
          getValues("sex") !== "unknown"
            ? selectedRecord?.sex
              ? "#4ADE80"
              : "#FF9B56"
            : "#FF1111",
        value: getValues("sex"),
        edit: true,
      },
    ];
  }, [formValues]);

  const treatmentCharacteristics = useMemo(() => {
    return [
      {
        label: "Case ID",
        key: "caseNumber",
        info:
          getValues("caseNumber") !== ""
            ? "Unique identifier for this case. Used internally by each clinic to link all related clinical and administrative records."
            : "Unique identifier for this case.",
        boxColor: getValues("caseNumber") !== "" ? "#4ADE80" : "#FF1111",
        value: getValues("caseNumber"),
        edit: true,
      },
      {
        label: "Treatment Type",
        key: "archType",
        svg: "/Layer_1.svg",
        options: [
          { name: "Upper", value: "upper" },
          { name: "Lower", value: "lower" },
          { name: "Upper & Lower", value: "upperAndLower" },
          { name: fromClinlog ? "unknown" : "-- Select --", value: "unknown" },
        ],
        info:
          getValues("archType") !== "unknown"
            ? "Select the arches involved in this treatment."
            : "Arches involved in this treatment.",
        boxColor: getValues("archType") !== "unknown" ? "#4ADE80" : "#FF1111",
        value: getValues("archType"),
        edit: true,
      },
      {
        label: "Surgical Treatment Images",
        key: "surgicalTreatmentImages",
        icon: "add_photo_alternate",
        info:
          getValues("preOpPhotos") ||
          getValues("preOpReconstructedOpg") ||
          getValues("postOpPhotos") ||
          getValues("postOp2DOpg") ||
          getValues("postOp3DOpg")
            ? "Images uploaded"
            : "No images uploaded",
        boxColor:
          getValues("preOpPhotos") ||
          getValues("preOpReconstructedOpg") ||
          getValues("postOpPhotos") ||
          getValues("postOp2DOpg") ||
          getValues("postOp3DOpg")
            ? "#4ADE80"
            : "#FF1111",
        type: "images",

        edit: true,
      },

      {
        label: "Upper Arch Condition at Surgery",
        key: "upperArchCondition",
        svg: "/Layer_1.svg",
        options: [
          { name: "Edentulous", value: "Edentulous" },
          {
            name: "Partially Dentate (5 Teeth or Less)",
            value: "Partially Dentate (5 Teeth or Less)",
          },
          {
            name: "Partially Dentate (6-10 teeth)",
            value: "Partially Dentate (6-10 teeth)",
          },
          { name: "Dentate (11+ teeth)", value: "Dentate (11+ teeth)" },
          {
            name: "Mostly Natural (10+ Teeth)",
            value: "Mostly Natural (10+ Teeth)",
          },
          {
            name: "Mostly Natural (6-9 Teeth with Denture)",
            value: "Mostly Natural (6-9 Teeth with Denture)",
          },
          {
            name: "Mostly Natural (6-9 Teeth with NO Denture)",
            value: "Mostly Natural (6-9 Teeth with NO Denture)",
          },
          {
            name: "Mostly Natural (5 Teeth and  Under with Denture)",
            value: "Mostly Natural (5 Teeth and  Under with Denture)",
          },
          {
            name: "Mostly Natural (5 Teeth and  Under with NO Denture)",
            value: "Mostly Natural (5 Teeth and  Under with NO Denture)",
          },
          { name: "Fixed Implant Bridge", value: "Fixed Implant Bridge" },
          { name: "Full Denture", value: "Full Denture" },
          { name: fromClinlog ? "unknown" : "-- Select --", value: "unknown" },
        ],
        info: "Condition of the maxillary arch at the time of surgery (e.g., dentate, failing dentition, edentulous).",
        boxColor:
          getValues("upperArchCondition") !== "unknown" ? "#4ADE80" : "#FF1111",
        value: getValues("upperArchCondition"),
        edit: true,
      },
      {
        label: "Lower Arch Condition at Surgery",
        key: "lowerArchCondition",
        svg: "/Layer_2.svg",
        options: [
          { name: "Edentulous", value: "Edentulous" },
          {
            name: "Partially Dentate (5 Teeth or Less)",
            value: "Partially Dentate (5 Teeth or Less)",
          },
          {
            name: "Partially Dentate (6-10 teeth)",
            value: "Partially Dentate (6-10 teeth)",
          },
          { name: "Dentate (11+ teeth)", value: "Dentate (11+ teeth)" },
          {
            name: "Mostly Natural (10+ Teeth)",
            value: "Mostly Natural (10+ Teeth)",
          },
          {
            name: "Mostly Natural (6-9 Teeth with Denture)",
            value: "Mostly Natural (6-9 Teeth with Denture)",
          },
          {
            name: "Mostly Natural (6-9 Teeth with NO Denture)",
            value: "Mostly Natural (6-9 Teeth with NO Denture)",
          },
          {
            name: "Mostly Natural (5 Teeth and  Under with Denture)",
            value: "Mostly Natural (5 Teeth and  Under with Denture)",
          },
          {
            name: "Mostly Natural (5 Teeth and  Under with NO Denture)",
            value: "Mostly Natural (5 Teeth and  Under with NO Denture)",
          },
          { name: "Fixed Implant Bridge", value: "Fixed Implant Bridge" },
          { name: "Full Denture", value: "Full Denture" },
          { name: fromClinlog ? "unknown" : "-- Select --", value: "unknown" },
        ],
        info: "Condition of the mandibular arch at the time of surgery.",
        boxColor:
          getValues("lowerArchCondition") !== "unknown" ? "#4ADE80" : "#FF1111",
        value: getValues("lowerArchCondition"),
        edit: true,
      },
      {
        label: "Zygoma Implants",
        key: "zygomaImplants",
        svg: "/zygoma.svg",
        info: "Automatically calculated based on the approved or modified treatment plan.",
        boxColor:
          getValues("zygomaImplants") !== "unknown" ? "#4ADE80" : "#FF1111",
        value: getValues("zygomaImplants"),
        edit: true,
      },
      {
        label: "Regular Implants",
        key: "regularImplants",
        svg: "/regular.svg",
        info: "Automatically calculated based on the approved or modified treatment plan.",
        boxColor:
          getValues("regularImplants") !== "unknown" ? "#4ADE80" : "#FF1111",
        value: getValues("regularImplants"),
        edit: true,
      },
      {
        label: "Immediate Restoration",
        key: "immediateRestoration",
        icon: "settings_backup_restore",
        options: [
          {
            name: "Implant-retained Fixed IMMEDIATE FINAL",
            value: "Implant-retained Fixed IMMEDIATE FINAL",
          },
          {
            name: "Implant-retained Fixed PROVISIONAL",
            value: "Implant-retained Fixed PROVISIONAL",
          },
          {
            name: "Implant-Supported Removable Denture",
            value: "Implant-Supported Removable Denture",
          },
          {
            name: "Tooth-supported Partial Denture",
            value: "Tooth-supported Partial Denture",
          },
          {
            name: "Tooth-supported Fixed bridge",
            value: "Tooth-supported Fixed bridge",
          },
          {
            name: "Tissue-born denture",
            value: "Tissue-born denture",
          },
          {
            name: "Unknown",
            value: "unknown",
          },
        ],

        info: "Specify whether an immediate fixed restoration was delivered at surgery (and type), or if the case was left without immediate loading.",
        boxColor:
          getValues("immediateRestoration") !== "unknown"
            ? "#4ADE80"
            : "#FF1111",
        value: getValues("immediateRestoration"),
        edit: true,
      },
      {
        label: "Date of Insertion",
        key: "dateOfInsertion",
        icon: "date_range",
        info: "Automatically populated from the “insertion” appointment type in the treatment plan, but should be verified.",
        boxColor: getValues("dateOfInsertion") !== null ? "#4ADE80" : "#FF1111",
        value: getValues("dateOfInsertion"),
        edit: true,
      },
      {
        label: "Time from Surgery to Insertion",
        key: "timeFromSurgeryToInsertion",
        icon: "alarm_on",
        info: "Automatically calculated from the surgery date to the insertion date. Please verify accuracy.",
        // getValues("timeFromSurgeryToInsertion") !== "unknown"
        //   ? getValues("timeFromSurgeryToInsertion") + " days"
        //   : !selectedRecord?.recordTreatmentDate
        //   ? "Treatment Date not available"
        //   : "Date of Insertion not available",
        boxColor:
          getValues("timeFromSurgeryToInsertion") !== "unknown"
            ? "#4ADE80"
            : "#FF1111",
        value: getValues("timeFromSurgeryToInsertion"),
        edit: false,
      },
      {
        label: "Immediate Function & Speech",
        key: "immediateFunctionSpeech",
        icon: "psychology",
        options: [
          { name: "Satisfactory", value: "Satisfactory" },
          { name: "Unsatisfactory", value: "Unsatisfactory" },
          { name: "Unknown", value: "unknown" },
        ],
        info: "Clinical assessment of the patient’s ability to chew and speak with the immediate restoration in the first days after surgery.",
        boxColor:
          getValues("immediateFunctionSpeech") !== "unknown"
            ? "#4ADE80"
            : "#FF1111",
        value: getValues("immediateFunctionSpeech"),
      },
      {
        label: "Immediate Aesthetics",
        key: "immediateAesthetics",
        icon: "sentiment_satisfied",
        options: [
          { name: "Satisfactory", value: "Satisfactory" },
          { name: "Unsatisfactory", value: "Unsatisfactory" },
          { name: "Unknown", value: "unknown" },
        ],
        info: "Clinical or patient-reported assessment of the appearance of the immediate restoration at delivery (smile line, tooth display, soft-tissue support).",
        boxColor:
          getValues("immediateAesthetics") !== "unknown"
            ? "#4ADE80"
            : "#FF1111",
        value: getValues("immediateAesthetics"),
        edit: true,
      },
    ];
  }, [formValues]);

  const followUpData = useMemo(() => {
    return [
      {
        label: "Review Carried Out By",
        key: "examiner",
        icon: "person",
        info: "Entry by xxxx",
        value: getValuesFollowUp("examiner"),
      },
      {
        label: "Date of Review",
        key: "dateOfFollowUp",
        icon: "event",
        info: "Entry by xxxx",
        value: getValuesFollowUp("dateOfFollowUp") || "N/A",
      },
      {
        label: "Time from Surgery",
        key: "timeFromSurgery",
        icon: "timer_arrow_up",
        info: "Entry by xxxx",
        value: getValuesFollowUp("timeFromSurgery"),
      },
      {
        label: "Smoking at Review",
        key: "smokingAtFollowUp",
        icon: "smoking_rooms",
        options: [
          { name: "--Select an option--", value: "" },
          { name: "Yes (Cigarettes)", value: "Yes (Cigarettes)" },
          { name: "Yes (Vape)", value: "Yes (Vape)" },
          { name: "Yes", value: "Yes" },
          { name: "No", value: "No" },
          { name: "Unknown", value: "unknown" },
        ],
        info: "Entry by xxxx",
        value: getValuesFollowUp("smokingAtFollowUp"),
      },
      {
        label: "Hygiene at Review",
        key: "hygieneAtFollowUp",
        icon: "voice_selection",
        options: [
          { name: "--Select an option--", value: "" },
          { name: "Excellent", value: "Excellent" },
          { name: "Reasonable", value: "Reasonable" },
          { name: "Poor", value: "Poor" },
          { name: "Very Poor", value: "Very Poor" },
          { name: "Unknown", value: "unknown" },
        ],
        info: "Entry by xxxx",
        value: getValuesFollowUp("hygieneAtFollowUp"),
      },
      // {
      //   label: "Number of Reviews",
      //   key: "numberOfReviews",
      //   icon: "clinical_notes",
      //   info: "Entry by xxxx",
      //   value: getValues("numberOfReviews"),
      // },
      // {
      //   label: "Number Of Restorative Breakages",
      //   key: "numberOfRestorativeBreakages",
      //   icon: "oral_disease",
      //   info: "Entry by xxxx",
      //   value: getValues("numberOfRestorativeBreakages"),
      // },
      // {
      //   label: "Zirconia Upgrade",
      //   key: "zirconiaUpgrade",
      //   icon: "dentistry",
      //   options: [
      //     { name: "Yes", value: "Yes" },
      //     { name: "No", value: "No" },
      //     { name: "Unknown", value: "unknown" },
      //   ],
      //   info: "Entry by xxxx",
      //   value: getValues("zirconiaUpgrade"),
      // },
      {
        label: "Performance over follow-up period",
        key: "performanceOverFollowUpPeriod",
        icon: "psychology_alt",
        options: [
          { name: "--Select an option--", value: "" },
          {
            name: "Continuous fixed function",
            value: "Continuous fixed function",
          },
          {
            name: "Interrupted fixed function",
            value: "Interrupted fixed function",
          },
          {
            name: "Loss of fixed function",
            value: "Loss of fixed function",
          },
          { name: "Unknown", value: "unknown" },
        ],
        info: "Entry by xxxx",
        value: getValuesFollowUp("performanceOverFollowUpPeriod"),
      },
      // {
      //   label: "Examiner Radiographic",
      //   key: "examinerRadiographic",
      //   icon: "person",
      //   info: "Entry by xxxx",
      //   value: getValues("examinerRadiographic"),
      // },
    ];
  }, [formValuesFollowUp]);
  useEffect(() => {
    if (treatmentCharacteristics && patientCharacteristics) {
      const treatmentStatus = treatmentCharacteristics?.some(
        (item) => item?.boxColor === "#FF9B56" || item?.boxColor === "#FF1111",
      )
        ? "More Data Required"
        : "Recorded data";
      const patientStatus = patientCharacteristics?.some(
        (item) => item?.boxColor === "#FF9B56" || item?.boxColor === "#FF1111",
      )
        ? "More Data Required"
        : "Recorded data";
      setClinlogStatus(
        treatmentStatus === "More Data Required" ||
          patientStatus === "More Data Required"
          ? "More Data Required"
          : "Recorded data",
      );
    }
  }, [treatmentCharacteristics, patientCharacteristics]);

  const characteristicsMutate = useMutation(
    ({ newData, mutationGql }: any) => {
      return sendData(mutationGql, newData);
    },
    {
      onMutate: async (newTodo) => {
        toastIdRef.current = toast({
          render: () => (
            <Flex
              justify="space-around"
              color="white"
              p={3}
              bg="blue.500"
              borderRadius="6px"
            >
              Updating Characteristics ...
              <Spinner color="white" />
            </Flex>
          ),
          duration: 100000,
          isClosable: true,
        });
        setShowSiteFollowUp(true);
      },
      onError: (err, newTodo, context) => {
        toast.update(toastIdRef.current, {
          description: "Error - Could not update follow up",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      },
      onSuccess: (data) => {
        toast.update(toastIdRef.current, {
          description: "Successfully Updated ",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      },
      // Always refetch after error or success:
      onSettled: (newTodo) => {
        characteristicsMutate.reset();
        queryClient.invalidateQueries(["detailsPageNew", globalPostId]);
        if (isReviewOpen) {
          // onReviewClose()
        }
        if (editTreatmentChar) {
          setEditTreatmentChar(false);
        }
      },
    },
  );

  const onSubmit = async (data) => {
    const newData = {
      ...data,
      id: Number(selectedRecord?.id),
      zygomaImplants: Number(data.zygomaImplants),
      regularImplants: Number(data.regularImplants),
      timeFromSurgeryToInsertion: Number(data.timeFromSurgeryToInsertion),
      recordBmi: data.recordBmi !== "unknown" ? Number(data.recordBmi) : null,
      ageAtTimeOfSurgery:
        data?.ageAtTimeOfSurgery !== "unknown"
          ? Number(data.ageAtTimeOfSurgery)
          : null,
    };

    characteristicsMutate.mutate({
      newData,
      mutationGql: characteristicsMutation,
    });
  };
  const isFailed = (followUps, category) => {
    if (category === "implant") {
      return followUps?.some(
        (item) => item?.implantFunctionAtFollowUp === "No (failed)",
      );
    } else if (category === "abutment") {
      return followUps?.some(
        (item) => item?.abutmentFunctionAtFollowUp === "No (failed)",
      );
    }
  };
  const useEditPatientDetailsMutation = useMutation(
    (newData: any) => sendData(globalPatientDetailsMutation, newData),
    {
      onMutate: async (newData) => {
        toastIdRef.current = toast({
          render: () => (
            <Flex
              justify="space-around"
              color="white"
              p={3}
              bg="blue.500"
              borderRadius="6px"
            >
              Editing Patient Details...
              <Spinner color="white" />
            </Flex>
          ),
          duration: 100000,
          isClosable: true,
        });
      },
      onError: (err, newTodo, context) => {
        toast.update(toastIdRef.current, {
          description: "Couldn't Edit Details",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      },
      onSuccess: () => {
        toast.update(toastIdRef.current, {
          description: "Successfully Edited Details",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      },
      onSettled: () => {
        useEditPatientDetailsMutation.reset();
        queryClient.invalidateQueries(["detailsPageNew", globalPostId]);
      },
    },
  );

  const handleEditPatientMutation = async (newData) => {
    const editPatientDetailsResult =
      await useEditPatientDetailsMutation.mutateAsync(newData);
  };
  const isBase = useBreakpointValue({
    base: true,
    md: false,
  });
  const progressBlocks = useMemo(() => {
    return [
      ...selectedRecord?.recordFollowUpMatrix,
      ...new Array(9 - selectedRecord?.recordFollowUpMatrix?.length).fill(null),
    ];
  }, [selectedRecord?.recordFollowUpMatrix]);

  const siteSpecificMutationFunction = useMutation(
    (siteSpecificData: any) => sendData(siteSpecificMutation, siteSpecificData),
    {
      onMutate: (newData) => {},
      onError: (err, newData) => {},
      onSuccess: (data, newData) => {
        toast.update(toastIdRef.current, {
          description: "Successfully Updated ",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      },
      onSettled: () => {
        siteSpecificMutationFunction.reset();
        queryClient.invalidateQueries([
          "proposedTreatmentChartResults",
          proposedTreatmentChartIds,
        ]);
      },
    },
  );
  const barSpecificMutationFunction = useMutation(
    (siteSpecificData: any) =>
      sendData(updateBarSpecificMutation, siteSpecificData),
    {
      onMutate: (newData) => {},
      onError: (err, newData) => {},
      onSuccess: (data, newData) => {
        toast.update(toastIdRef.current, {
          description: "Successfully Updated ",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      },
      onSettled: () => {
        barSpecificMutationFunction.reset();
        queryClient.invalidateQueries([
          "proposedTreatmentChartResults",
          proposedTreatmentChartIds,
        ]);
      },
    },
  );

  const siteSpecificFollowUpMutationFunction = useMutation(
    ({ siteFollowUpData, siteSpecificData }: any) =>
      sendData(createSiteSpecificFollowUpMutation, siteFollowUpData),
    {
      onMutate: (newData) => {},
      onError: (err, newData) => {},
      onSuccess: (data, newData) => {
        const followUpId = data?.save_siteSpecificFollowUp_default_Entry?.id;
        const followUpArr =
          newData?.siteSpecificData?.attachedSiteSpecificFollowUp || [];
        if (newData?.siteSpecificData?.isBar) {
          const updatedData = {
            id: newData?.siteSpecificData?.id,
            attachedSiteSpecificFollowUp: [...followUpArr, Number(followUpId)],
          };
          barSpecificMutationFunction.mutate(updatedData);
        } else {
          const updatedData = {
            id: newData?.siteSpecificData?.id,
            attachedSiteSpecificFollowUp: [...followUpArr, Number(followUpId)],
          };
          siteSpecificMutationFunction.mutate(updatedData);
        }
      },
      onSettled: () => {},
    },
  );
  function getOrdinalSuffix(number: number): string {
    if (number < 1) {
      return "1st";
    }
    const ones = number % 10;
    const tens = Math.floor((number % 100) / 10);

    if (tens === 1) {
      // Special case for 11-13 (11th, 12th, 13th, etc.)
      return `${number}th`;
    }

    switch (ones) {
      case 1:
        return `${number}st`;
      case 2:
        return `${number}nd`;
      case 3:
        return `${number}rd`;
      default:
        return `${number}th`;
    }
  }
  const followUpOnSubmit = async (data) => {
    const followUpMatrix = selectedRecord?.recordFollowUpMatrix.map((item) => {
      return {
        followUp: {
          id: item.id,
          examiner: item.examiner,
          dateOfFollowUp: item.dateOfFollowUp,
          timeFromSurgery: Number(item.timeFromSurgery),
          smokingAtFollowUp: item.smokingAtFollowUp,
          hygieneAtFollowUp: item.hygieneAtFollowUp,
          performanceOverFollowUpPeriod: item.performanceOverFollowUpPeriod,
          zirconiaUpgrade: item.zirconiaUpgrade,
          examinerRadiographic: item.examinerRadiographic,
          numberOfReviews: item.numberOfReviews,
          numberOfRestorativeBreakages: item.numberOfRestorativeBreakages,
        },
      };
    });

    const newData = {
      id: Number(selectedRecord?.id),
      recordFollowUpMatrix: [
        ...followUpMatrix,
        {
          followUp: {
            id: "new",
            examiner: data.examiner,
            dateOfFollowUp: new Date(data.dateOfFollowUp),
            timeFromSurgery: Number(data.timeFromSurgery),
            smokingAtFollowUp: data.smokingAtFollowUp,
            hygieneAtFollowUp: data.hygieneAtFollowUp,
            performanceOverFollowUpPeriod: data.performanceOverFollowUpPeriod,
          },
        },
      ],

      followUpMatrixSortOrder: [
        ...followUpMatrix.map((item) => item.followUp.id),
        "new",
      ],
    };

    await characteristicsMutate.mutate({
      newData,
      mutationGql: followUpMatrixMutation,
    });

    //creating site specific reviews
    const existingSiteFollowUps = sitesWithImplantsMemo?.map((item) => {
      return {
        id: item?.attachedSiteSpecificRecords?.[0]?.id || null,
        toothValue: item?.toothValue,
        treatmentItemNumber: item?.treatmentItemNumber,
        attachedSiteSpecificFollowUp:
          item?.attachedSiteSpecificRecords?.[0]
            ?.attachedSiteSpecificFollowUp?.[0] || null,
        followUpIds:
          item?.attachedSiteSpecificRecords?.[0]?.attachedSiteSpecificFollowUp?.map(
            (followUp) => Number(followUp.id),
          ),
      };
    });

    existingSiteFollowUps?.forEach(async (item, index) => {
      let title = "";

      if (item?.attachedSiteSpecificFollowUp) {
        title =
          item?.attachedSiteSpecificFollowUp?.title +
          " - " +
          getOrdinalSuffix(item?.followUpIds?.length + 1) +
          " Review";
      } else {
        title =
          patientName +
          " - " +
          item?.toothValue +
          " - " +
          getOrdinalSuffix(1) +
          " Review";
      }

      if (item?.treatmentItemNumber !== "661" && item?.id) {
        const siteFollowUpData = {
          title: title,
          recordFollowUpDate: new Date(data.dateOfFollowUp),
          implantFunctionAtFollowUp:
            item?.attachedSiteSpecificFollowUp?.implantFunctionAtFollowUp,
          sinusitis: item?.attachedSiteSpecificFollowUp?.sinusitis,
          facialSwelling: item?.attachedSiteSpecificFollowUp?.facialSwelling,
          inflammation: item?.attachedSiteSpecificFollowUp?.inflammation,
          suppuration: item?.attachedSiteSpecificFollowUp?.suppuration,
          pain: item?.attachedSiteSpecificFollowUp?.pain,
          recession: item?.attachedSiteSpecificFollowUp?.recession,
          midShaftSoftTissueDehiscence:
            item?.attachedSiteSpecificFollowUp?.midShaftSoftTissueDehiscence,
          firstAbutmentLevelComplication:
            item?.attachedSiteSpecificFollowUp?.firstAbutmentLevelComplication,
          otherAbutmentLevelComplications:
            item?.attachedSiteSpecificFollowUp?.otherAbutmentLevelComplications,
          dateOfFirstAbutmentLevelComplication: item
            ?.attachedSiteSpecificFollowUp?.dateOfFirstAbutmentLevelComplication
            ? new Date(
                item?.attachedSiteSpecificFollowUp
                  ?.dateOfFirstAbutmentLevelComplication,
              )
            : null,
          firstAbutmentLevelComplicationTimeFromSurgery:
            item?.attachedSiteSpecificFollowUp
              ?.firstAbutmentLevelComplicationTimeFromSurgery,
          postOperativeSinusDisease:
            item?.attachedSiteSpecificFollowUp?.postOperativeSinusDisease,
          boneLoss: item?.attachedSiteSpecificFollowUp?.boneLoss,
        };
        const siteSpecificData = {
          id: item?.id,
          attachedSiteSpecificFollowUp: item?.followUpIds || [],
          isBar: item?.treatmentItemNumber === "666",
        };
        const updatedData = {
          siteFollowUpData: siteFollowUpData,
          siteSpecificData: siteSpecificData,
        };
        await siteSpecificFollowUpMutationFunction.mutate(updatedData);
      }
    });
  };
  const tHeadCss = {
    fontSize: "12px",
    color: "#000",
    fontWeight: "600",
    border: "1px solid #D9D9D9",
    // p: "2",
  };

  // React Table setup
  const columnHelper = createColumnHelper<TreatmentToothMatrix>();
  //commented approvedby column, suggested by Steven
  const columns = useMemo(
    () => [
      columnHelper.accessor("toothValue" as any, {
        id: "site",
        header: "Site",
        cell: (info) => {
          const item = info.row.original;
          return (
            <Text fontSize={"13px"} textTransform={"uppercase"}>
              {item?.treatmentItemNumber === "666"
                ? item?.attachedSiteSpecificRecords?.[0]?.archLocation || "N/A"
                : item?.toothValue || "N/A"}
            </Text>
          );
        },
        enableSorting: true,
        sortingFn: (rowA, rowB, columnId) => {
          let valueA = rowA.getValue(columnId) as string | null | undefined;
          let valueB = rowB.getValue(columnId) as string | null | undefined;

          if (valueA == "upperMid") {
            valueA = "10";
          }
          if (valueB == "upperMid") {
            valueB = "10";
          }
          if (valueA == "lowerMid") {
            valueA = "30";
          }
          if (valueB == "lowerMid") {
            valueB = "30";
          }
          const quadrantArrays = {
            q1: [18, 17, 16, 15, 14, 13, 12, 11, 10], // Upper right
            q2: [21, 22, 23, 24, 25, 26, 27, 28], // Upper left
            q3: [38, 37, 36, 35, 34, 33, 32, 31, 30], // Lower left
            q4: [41, 42, 43, 44, 45, 46, 47, 48], // Lower right
          };

          const getQuadrant = (toothValue) => {
            const value = Number(toothValue);
            if (value >= 10 && value <= 18) return 1; // Q1
            if (value >= 21 && value <= 28) return 2; // Q2
            if (value >= 30 && value <= 38) return 3; // Q3
            if (value >= 41 && value <= 48) return 4; // Q4
            return 0; // Unknown/other
          };

          const getIndexInQuadrant = (toothValue) => {
            const value = Number(toothValue);
            const quadrant = getQuadrant(value);
            if (quadrant === 1) return quadrantArrays.q1.indexOf(value);
            if (quadrant === 2) return quadrantArrays.q2.indexOf(value);
            if (quadrant === 3) return quadrantArrays.q3.indexOf(value);
            if (quadrant === 4) return quadrantArrays.q4.indexOf(value);
            return -1;
          };

          const aQuadrant = getQuadrant(valueA);
          const bQuadrant = getQuadrant(valueB);

          // First sort by quadrant (Q1, Q2, Q3, Q4) - Q1 should be higher than Q2
          if (aQuadrant !== bQuadrant) {
            return aQuadrant - bQuadrant;
          }

          // Within same quadrant, sort by index (lower index first - index 1 before index 6)
          const aIndex = getIndexInQuadrant(valueA);
          const bIndex = getIndexInQuadrant(valueB);
          return aIndex - bIndex;
        },
      }),
      columnHelper.display({
        header: "Status",
        cell: (info) => {
          const item = info.row.original;
          const hasSpecs = item?.attachedSiteSpecificRecords?.length > 0;
          const isFailed =
            item?.attachedSiteSpecificRecords?.[0]?.attachedSiteSpecificFollowUp
              ?.length > 0 &&
            item?.attachedSiteSpecificRecords?.[0]?.attachedSiteSpecificFollowUp?.some(
              (followUp) =>
                followUp?.statusOfImplant === "failed" ||
                followUp?.statusOfBar === "failed",
            );
          if (isFailed) {
            return (
              <Flex
                align={"center"}
                gap="0.5rem"
                cursor="pointer"
                _hover={{
                  fontWeight: "700",
                  transform: "scale(1.15)",
                }}
                onClick={() => {
                  setSelectedSite(item);
                  onSidebarOpen();
                }}
              >
                <Flex
                  borderRadius="50%"
                  bgColor="#f50040"
                  width="10px"
                  height="10px"
                ></Flex>
                <Text
                  textTransform={"uppercase"}
                  fontSize={"12px"}
                  fontWeight={"500"}
                  fontFamily={"inter"}
                >
                  Failed
                </Text>
              </Flex>
            );
          }
          if (hasSpecs) {
            return (
              <Flex
                align={"center"}
                gap="0.5rem"
                cursor="pointer"
                _hover={{
                  fontWeight: "700",
                  transform: "scale(1.15)",
                }}
                onClick={() => {
                  setSelectedSite(item);
                  onSidebarOpen();
                }}
              >
                <Flex
                  borderRadius="50%"
                  bgColor="#4ADE80"
                  width="10px"
                  height="10px"
                ></Flex>
                <Text
                  textTransform={"uppercase"}
                  fontSize={"12px"}
                  fontWeight={"500"}
                  fontFamily={"inter"}
                >
                  Active
                </Text>
              </Flex>
            );
          }
          return (
            <Flex
              align={"center"}
              gap="0.5rem"
              cursor="pointer"
              _hover={{
                fontWeight: "700",
                transform: "scale(1.15)",
              }}
              onClick={() => {
                setSelectedSite(item);
                onSidebarOpen();
              }}
            >
              <Flex
                borderRadius="50%"
                bgColor="orange.400"
                width="10px"
                height="10px"
              ></Flex>
              <Text
                textTransform={"uppercase"}
                fontSize={"12px"}
                fontWeight={"500"}
                fontFamily={"inter"}
              >
                Add Data
              </Text>
            </Flex>
          );
        },
      }),
      // columnHelper.accessor("completed" as any, {
      //   id: "inFunction",
      //   header: "In Function",
      //   cell: (info) => {
      //     const item = info.row.original
      //     const isFailed =
      //       item?.attachedSiteSpecificRecords?.[0]?.attachedSiteSpecificFollowUp
      //         ?.length > 0 &&
      //       item?.attachedSiteSpecificRecords?.[0]?.attachedSiteSpecificFollowUp?.some(
      //         (followUp) =>
      //           followUp?.statusOfImplant === "failed" ||
      //           followUp?.statusOfBar === "failed"
      //       )

      //     return isFailed ? (
      //       <Text
      //         color="#E7003C"
      //         fontSize="12px"
      //         borderRadius="25px"
      //         fontFamily="Inter"
      //         // px="3"
      //         textTransform="uppercase"
      //       >
      //         Failed
      //       </Text>
      //     ) : (
      //       <Text
      //         fontSize="12px"
      //         borderRadius={"25px"}
      //         // px="3"
      //         textTransform={"uppercase"}
      //         fontFamily={"inter"}
      //       >
      //         {info.getValue() ? "Active" : "Pending"}
      //       </Text>
      //     )
      //   },
      //   enableSorting: true,
      // }),
      columnHelper.accessor("insertionDate" as any, {
        header: "Insertion Date",
        cell: (info) => {
          return (
            <Text fontSize={"12px"}>
              {info.getValue()
                ? format(new Date(info.getValue() || null), "dd MMM yyyy")
                : "N/A"}
            </Text>
          );
        },
        enableGrouping: true,
        enableSorting: true,
        sortingFn: (rowA, rowB, columnId) => {
          const dateA = rowA.getValue(columnId) as string | null | undefined;
          const dateB = rowB.getValue(columnId) as string | null | undefined;

          // If both are null/undefined, they're equal
          if (!dateA && !dateB) return 0;

          // If only A is null, B comes first (A goes to bottom)
          if (!dateA) return 1;

          // If only B is null, A comes first (B goes to bottom)
          if (!dateB) return -1;

          // Both have dates, compare them normally
          return (
            new Date(dateA as string).getTime() -
            new Date(dateB as string).getTime()
          );
        },
        getGroupingValue: (row) => row.insertionDate,
        aggregatedCell: ({ getValue }) => {
          const value = getValue();
          return (
            <Text fontSize="13px" fontWeight={"bold"}>
              {value ? format(new Date(value), "dd MMM yyyy") : "N/A"}
            </Text>
          );
        },
      }),
      columnHelper.display({
        id: "componentType",
        header: "Component Type",
        cell: (info) => {
          const item = info.row.original;
          if (item?.treatmentItemNumber === "666") {
            if (item?.attachedSiteSpecificRecords?.[0]) {
              return (
                <Text fontSize={"13px"} fontWeight={"700"}>
                  {"Prosthesis with metal frame attached to implants "}
                  (666)
                </Text>
              );
            } else {
              return (
                <Text fontSize={"12px"} fontWeight={"700"}>
                  PROSTHESIS (666)
                </Text>
              );
            }
          } else if (
            item?.treatmentItemNumber === "688" ||
            item?.treatmentItemNumber === "661"
          ) {
            return (
              <Text
                fontSize={"12px"}
                textTransform={"uppercase"}
                fontWeight={"700"}
              >
                Implant (688)+ Abutment (661)
              </Text>
            );
          } else if (item?.attachedSiteSpecificRecords?.[0]) {
            return (
              <Text fontSize={"13px"}>
                {
                  item?.attachedSiteSpecificRecords?.[0]
                    ?.itemSpecificationMatrix?.[0]?.implantTypeLabel
                }
              </Text>
            );
          } else {
            return <Text fontSize={"13px"}>N/A</Text>;
          }
        },
      }),
      columnHelper.display({
        id: "componentSpec",
        header: "Component Spec",
        cell: (info) => {
          const item = info.row.original;

          if (item?.treatmentItemNumber === "666") {
            if (item?.attachedSiteSpecificRecords?.[0]) {
              return (
                <Text fontSize={"13px"} textTransform={"uppercase"}>
                  {item?.attachedSiteSpecificRecords?.[0]
                    ?.finalProstheticMaterial || "N/A"}
                </Text>
              );
            } else {
              return <Text fontSize={"13px"}>N/A</Text>;
            }
          } else if (item?.attachedSiteSpecificRecords?.[0]) {
            return (
              <Text fontSize={"13px"}>
                {item?.attachedSiteSpecificRecords?.[0]
                  ?.itemSpecificationMatrix?.[0]?.implantLine ||
                  item?.attachedSiteSpecificRecords?.[0]
                    ?.itemSpecificationMatrix?.[0]?.implantType ||
                  ""}
                {" - "}
                {item?.attachedSiteSpecificRecords?.[0]
                  ?.itemSpecificationMatrix?.[0]?.implantLength || "N/A"}
              </Text>
            );
          } else {
            return <Text fontSize={"13px"}>N/A</Text>;
          }
        },
      }),
      columnHelper.display({
        id: "placement",
        header: "Placement",
        cell: (info) => {
          const item = info.row.original;
          if (item?.treatmentItemNumber === "666") {
            if (item?.attachedSiteSpecificRecords?.[0]) {
              const isLower =
                item?.attachedSiteSpecificRecords?.[0]?.archLocation ===
                "lower";
              const upperToothOptions = [
                18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28,
              ];
              const lowerToothOptions = [
                48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38,
              ];

              const barLengthFrom = isLower
                ? lowerToothOptions[
                    item?.attachedSiteSpecificRecords?.[0]?.barLengthFrom
                  ]
                : upperToothOptions[
                    item?.attachedSiteSpecificRecords?.[0]?.barLengthFrom
                  ];
              const barLengthTo = isLower
                ? lowerToothOptions[
                    item?.attachedSiteSpecificRecords?.[0]?.barLengthTo
                  ]
                : upperToothOptions[
                    item?.attachedSiteSpecificRecords?.[0]?.barLengthTo
                  ];
              return (
                <Text fontSize={"13px"}>
                  {"( "}
                  {barLengthFrom} - {barLengthTo}
                  {" )"}
                </Text>
              );
            } else {
              return <Text fontSize={"13px"}>N/A</Text>;
            }
          } else if (item?.attachedSiteSpecificRecords?.[0]) {
            return (
              <Text fontSize={"13px"}>
                {
                  item?.attachedSiteSpecificRecords?.[0]
                    ?.itemSpecificationMatrix?.[0]?.placementLabel
                }
              </Text>
            );
          } else {
            return <Text fontSize={"13px"}>N/A</Text>;
          }
        },
      }),
      columnHelper.display({
        id: "grafting",
        header: "Grafting",
        cell: (info) => {
          const item = info.row.original;
          if (item?.treatmentItemNumber === "666") {
            return <Text fontSize={"12px"}>N/A</Text>;
          } else if (item?.attachedSiteSpecificRecords?.[0]) {
            return (
              <Text fontSize={"12px"}>
                {
                  item?.attachedSiteSpecificRecords?.[0]
                    ?.itemSpecificationMatrix?.[0]?.graftingAppliedLabel
                }
              </Text>
            );
          } else {
            return <Text fontSize={"12px"}>N/A</Text>;
          }
        },
      }),
      // columnHelper.accessor("approved" as any, {
      //   id: "approvedBy",
      //   header: "Approved By",
      //   cell: (info) => (
      //     <Text fontSize={"12px"}>
      //       {info.getValue() ? "Patient" : "Surgeon"}
      //     </Text>
      //   ),
      //   enableSorting: true,
      // }),
      columnHelper.display({
        id: "action",
        header: "Action",
        cell: (info) => {
          const item = info.row.original;
          return (
            <Flex>
              <Button
                bg="none"
                color={"#767676"}
                size="xs"
                onClick={() => {
                  setSelectedSite(item);
                  onSidebarOpen();
                }}
              >
                <chakra.span
                  className="material-symbols-outlined"
                  fontSize="20px"
                  _hover={{
                    transform: "scale(1.15)",
                  }}
                >
                  {fromClinlog ? "visibility" : "edit_square"}
                </chakra.span>
              </Button>
              {!fromClinlog && (
                <Button bg="none" color={"#767676"} size="xs">
                  <chakra.span
                    className="material-symbols-outlined"
                    fontSize="22px"
                    _hover={{
                      transform: "scale(1.15)",
                    }}
                  >
                    delete
                  </chakra.span>
                </Button>
              )}
            </Flex>
          );
        },
      }),
    ],
    [getValues, barTypeOptions, setSelectedSite, onSidebarOpen],
  );

  const [sorting, setSorting] = useState<any>([{ id: "site", desc: false }]);

  const [grouping, setGrouping] = useState<any>([]);
  const [expanded, setExpanded] = useState<any>(true); // true expands all rows
  // Track sites that have just had specs saved so we can optimistically
  // show them as "Active" in the table before server data comes back.
  const [optimisticSites, setOptimisticSites] = useState<string[]>([]);

  // Update grouping based on active tab
  useEffect(() => {
    if (activeTab === "ALL") {
      setGrouping(["insertionDate"]);
      setExpanded(true); // Expand all when switching to ALL tab
      // setSorting([{ id: "insertionDate", desc: false }]); // Sort by date ascending, N/A at bottom
    } else {
      setGrouping([]);
      setExpanded({}); // Reset expanded state
      // setSorting([]); // Reset sorting
    }
  }, [activeTab]);

  const filteredData = useMemo(() => {
    const base =
      sitesWithImplantsMemo?.filter(
        (item) => item?.treatmentItemNumber !== "661",
      ) || [];

    // Overlay optimistic "has specs" for recently saved sites
    return base.map((item) => {
      const toothVal = String(item?.toothValue ?? "");

      if (
        toothVal &&
        optimisticSites.includes(toothVal) &&
        item?.treatmentItemNumber !== "661"
      ) {
        const existing = item?.attachedSiteSpecificRecords || [];
        if (existing.length > 0) return item;

        return {
          ...item,
          attachedSiteSpecificRecords: [
            {
              id: "temp-site-specific",
            },
          ],
        };
      }

      return item;
    });
  }, [sitesWithImplantsMemo, optimisticSites]);

  const downloadZip = async () => {
    const zip = new JSZip();

    // ▶️ Create empty folder structure
    zip.folder("Post-op 2-D OPG");
    zip.folder("Post-op 3-D OPG");
    zip.folder("Post-op Photos");
    zip.folder("Pre-Op Photos");
    zip.folder("Pre-op Reconstructed OPG");

    // ▶️ Add files to respective folders

    // ▶️ Generate ZIP as blob
    const content = await zip.generateAsync({ type: "blob" });

    // ▶️ Trigger download
    const url = URL.createObjectURL(content);
    const a = document.createElement("a");
    a.href = url;
    a.download = `TreatmentImages_${
      selectedRecord?.caseNumber || selectedRecord?.id
    }.zip`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const checkAllSitesDataInserted = useMemo(() => {
    const allDataInserted = filteredData.every((item) => {
      if (item?.treatmentItemNumber === "666") {
        return true;
      }
      const fields =
        item?.attachedSiteSpecificRecords?.[0]?.itemSpecificationMatrix?.[0];

      const allFields = fields
        ? Object.values(fields)?.every(
            (field) =>
              field !== null &&
              field !== undefined &&
              field !== "" &&
              field !== "--Select--",
          )
        : false;
      return allFields;
    });
    return allDataInserted;
  }, [filteredData]);

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      sorting,
      grouping,
      expanded,
    },
    onSortingChange: setSorting,
    onGroupingChange: setGrouping,
    onExpandedChange: setExpanded,
    autoResetExpanded: false,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getGroupedRowModel: getGroupedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: ITEMS_PER_PAGE,
      },
      expanded: true,
    },
  });

  if (isLoading) {
    return (
      <Flex height={"90vh"} w="100%" justify={"center"} align="center">
        <Spinner />
      </Flex>
    );
  }

  return (
    <Flex
      flexDirection={"column"}
      gap="1rem"
      w="100%"
      className={"force-scrollbar"}
      maxH={{ base: "none", lg: "calc(100vh - 192px)" }}
    >
      {!fromClinlog && (
        <Flex w="100%" gap="0.5rem" align="center" mt="3">
          <Flex flexDirection="column" gap="0" align="flex-start">
            <Text
              fontSize={{ base: "20px", md: "22px" }}
              fontWeight="700"
              color="gray.900"
              fontFamily="Inter"
            >
              Surgical Details
            </Text>
            <Text
              fontSize={{ base: "14px", md: "14px" }}
              fontWeight="400"
              color="gray.600"
              fontFamily="Inter"
            >
              Stores implant details and related data for clinical records,
              seamlessly integrating with Clinlog’s analytics for performance
              and outcome insights.
            </Text>
          </Flex>
          <Spacer />
          {/* <Button
          border={"1px solid #B1B1B1"}
          variant="outline"
          borderRadius={"full"}
          fontWeight="600"
          fontSize={"12px"}
          textTransform="uppercase"
          leftIcon={
            <chakra.span className="material-symbols-outlined" fontSize="14px">
              graph_6
            </chakra.span>
          }
        >
          Clinlog
        </Button> */}

          {/* <Button
            bgColor="scBlack"
            color={"white"}
            fontWeight={700}
            disabled={!approvedTreatments}
            borderRadius={"25px"}
            fontSize={"10px"}
            textTransform={"uppercase"}
            px="4"
            onClick={() => {
              setSelectedSite(null);
              onSidebarOpen();
            }}
            _hover={{
              opacity: 0.8,
            }}
          >
            <MdAddCircleOutline fontSize={"16px"} />
            <Text ml="2" mr="3">
              Add Site
            </Text>
          </Button> */}
        </Flex>
      )}
      <Flex
        w="100%"
        flexDirection={{ base: "column", md: "row" }}
        justify="space-between"
        gap="1rem"
      >
        <Card
          w={{ base: "100%", md: "33%" }}
          minHeight={"100%"}
          borderRadius="6px"
          boxShadow="0 4px 4px 0 rgba(0, 0, 0, 0.25)"
          border={"1px solid #EFF2FF"}
          bg="white"
        >
          <CardHeader>
            <Flex align={"center"} gap="0.5rem" py="2">
              <Text fontSize={"14px"} fontWeight="700">
                Treatment Details
              </Text>
              <Spacer />
              <Box
                w="10px"
                h="10px"
                bgColor={
                  treatmentCharacteristics?.some(
                    (item) =>
                      item?.boxColor === "#FF9B56" ||
                      item?.boxColor === "#FF1111",
                  )
                    ? "#FF1111"
                    : "#4ADE80"
                }
                borderRadius={"50%"}
                mr="2"
              ></Box>
            </Flex>
            <Divider />
          </CardHeader>
          <CardBody px="5" py="0" m="0">
            <Flex flexDirection="column" gap="0.5rem">
              <Flex align={"center"} gap="0.5rem">
                <Text fontSize={"13px"} fontWeight="500">
                  Treatment Date
                </Text>
                <Spacer />
                <Text fontSize={"13px"}>
                  {selectedRecord?.recordTreatmentDate
                    ? format(
                        new Date(selectedRecord?.recordTreatmentDate),
                        "dd MMMM yyyy",
                      )
                    : "N/A"}
                </Text>
              </Flex>
              <Divider />
              <Flex align={"center"} gap="0.5rem">
                <Text fontSize={"13px"} fontWeight="500">
                  Surgeon
                </Text>
                <Spacer />
                <Text fontSize={"13px"}>
                  {selectedRecord?.recordTreatmentSurgeons?.length > 0
                    ? `Dr ${selectedRecord?.recordTreatmentSurgeons?.[0]?.fullName}`
                    : "N/A"}
                </Text>
              </Flex>
              <Divider />
              <Flex align={"center"} gap="0.5rem">
                <Text fontSize={"13px"} fontWeight="500">
                  Restorative Dentist
                </Text>
                <Spacer />
                <Text fontSize={"13px"}>
                  {selectedRecord?.recordTreatmentRestorative?.length > 0
                    ? `Dr ${selectedRecord?.recordTreatmentRestorative?.[0]?.fullName}`
                    : "N/A"}
                </Text>
              </Flex>
              <Divider />
              <Flex align={"center"} gap="0.5rem">
                <Text fontSize={"13px"} fontWeight="500">
                  Planned By
                </Text>
                <Spacer />
                <Text fontSize={"13px"}>
                  {selectedRecord?.treatmentPlannedBy?.length > 0
                    ? `${selectedRecord?.treatmentPlannedBy}`
                    : "N/A"}
                </Text>
              </Flex>
              <Divider />
            </Flex>
          </CardBody>
          <CardFooter>
            <Flex
              align={"center"}
              justify="center"
              gap="0.5rem"
              fontWeight={700}
              w="100%"
              cursor={"pointer"}
              onClick={() => {
                if (!fromClinlog) {
                  setEditTreatmentChar(true);
                }
                setEditType("treatment");
                onCharcteristicsOpen();
              }}
              _hover={{
                bg: "blue.50",
                color: "#007AFF",
                transform: "scale(1.025)",
                boxShadow: "sm",
              }}
              transition="all 0.15s"
            >
              <Text color="#007AFF" fontSize={"13px"}>
                {fromClinlog ? "View" : "Edit"} Treatment Characteristics
              </Text>
              <chakra.span
                className="material-symbols-outlined"
                fontSize={"14px"}
                color="#007AFF"
                cursor={"pointer"}
              >
                arrow_outward
              </chakra.span>
            </Flex>
          </CardFooter>
        </Card>
        <Card
          w={{ base: "100%", md: "33%" }}
          minHeight={"100%"}
          borderRadius="6px"
          boxShadow="0 4px 4px 0 rgba(0, 0, 0, 0.25)"
          border={"1px solid #EFF2FF"}
          bg="white"
        >
          <CardHeader>
            <Flex align={"center"} gap="0.5rem" py="2">
              <Text fontSize={"14px"} fontWeight="700">
                Patient Details at Surgery
              </Text>
              <Spacer />
              <Box
                w="10px"
                h="10px"
                bgColor={
                  treatmentCharacteristics?.some(
                    (item) =>
                      item?.boxColor === "#FF9B56" ||
                      item?.boxColor === "#FF1111",
                  )
                    ? "#FF1111"
                    : "#4ADE80"
                }
                borderRadius={"50%"}
                mr="2"
              ></Box>
            </Flex>
            <Divider />
          </CardHeader>
          <CardBody px="5" py="0" m="0">
            <Flex flexDirection="column" gap="0.5rem">
              <Flex align={"center"} gap="0.5rem">
                <Text fontSize={"13px"} fontWeight="500">
                  Age at Time of Surgery
                </Text>
                <Spacer />
                <Text fontSize={"13px"}>
                  {selectedRecord?.ageAtTimeOfSurgery
                    ? `${selectedRecord?.ageAtTimeOfSurgery} years old`
                    : "N/A"}
                </Text>
              </Flex>
              <Divider />
              <Flex align={"center"} gap="0.5rem">
                <Text fontSize={"13px"} fontWeight="500">
                  BMI
                </Text>
                <Spacer />
                <Text fontSize={"13px"}>
                  {selectedRecord?.recordBmi
                    ? selectedRecord?.recordBmi
                    : "N/A"}
                </Text>
              </Flex>
              <Divider />
              <Flex align={"center"} gap="0.5rem">
                <Text fontSize={"13px"} fontWeight="500">
                  Gender at Surgery
                </Text>
                <Spacer />
                <Text fontSize={"13px"}>
                  {selectedRecord?.sex ? selectedRecord?.sex : "N/A"}
                </Text>
              </Flex>
              <Divider />
            </Flex>{" "}
          </CardBody>
          <CardFooter>
            <Flex
              align={"center"}
              justify="center"
              gap="0.5rem"
              fontWeight={700}
              w="100%"
              cursor={"pointer"}
              onClick={() => {
                if (!fromClinlog) {
                  setEditTreatmentChar(true);
                }
                setEditType("patient");
                onCharcteristicsOpen();
              }}
              _hover={{
                bg: "blue.50",
                color: "#007AFF",
                transform: "scale(1.025)",
                boxShadow: "sm",
              }}
              transition="all 0.15s"
            >
              {" "}
              <Text color="#007AFF" fontSize={"13px"}>
                {fromClinlog ? "View" : "Edit"} Patient Characteristics
              </Text>
              <chakra.span
                className="material-symbols-outlined"
                fontSize={"14px"}
                color="#007AFF"
                cursor={"pointer"}
              >
                arrow_outward
              </chakra.span>
            </Flex>
          </CardFooter>
        </Card>
        <Card
          w={{ base: "100%", md: "33%" }}
          minHeight={"100%"}
          borderRadius="6px"
          boxShadow="0 4px 4px 0 rgba(0, 0, 0, 0.25)"
          border={"1px solid #EFF2FF"}
          bg="white"
        >
          <CardHeader>
            <Flex align={"center"} gap="0.5rem" py="2">
              <Text fontSize={"14px"} fontWeight="700">
                Review Details
              </Text>
              <Spacer />
            </Flex>
            <Divider />
          </CardHeader>
          <CardBody px="5" py="0" m="0">
            <Flex flexDirection="column" gap="0.5rem">
              <Accordion allowToggle defaultIndex={!fromClinlog ? [1] : [0]}>
                <AccordionItem border="none">
                  <h2>
                    <AccordionButton px={0} py={2}>
                      <Box flex="1" textAlign="left">
                        <Text fontSize={"13px"} fontWeight="500">
                          Reviews Created
                        </Text>
                      </Box>
                      <Spacer />
                      <Text fontSize={"13px"} mr={2}>
                        {selectedRecord?.recordFollowUpMatrix?.length > 0
                          ? selectedRecord?.recordFollowUpMatrix?.length
                          : "N/A"}
                      </Text>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel px={0} pb={2}>
                    {/* You can add more details here about each review, if desired */}
                    {selectedRecord?.recordFollowUpMatrix?.length > 0 ? (
                      <Flex direction="column" gap="0.5rem">
                        {selectedRecord?.recordFollowUpMatrix.map(
                          (review, idx) => (
                            <Button
                              key={idx}
                              variant="ghost"
                              size="sm"
                              fontSize="13px"
                              justifyContent="flex-start"
                              leftIcon={
                                <chakra.span
                                  className="material-symbols-outlined"
                                  fontSize="18px"
                                  color="#007AFF"
                                  mr={2}
                                >
                                  history_edu
                                </chakra.span>
                              }
                              _hover={{
                                bg: "blue.50",
                                color: "#007AFF",
                                transform: "scale(1.025)",
                                boxShadow: "sm",
                              }}
                              transition="all 0.15s"
                              onClick={() => {
                                setFollowUpId(review.id);
                                setShowSiteFollowUp(true);
                                onReviewOpen();
                              }}
                            >
                              <Box>
                                <Text
                                  display="inline"
                                  fontWeight="600"
                                  mr={2}
                                  color="#222"
                                >
                                  Review {idx + 1}
                                </Text>
                                <Text
                                  display="inline"
                                  color="gray.600"
                                  fontWeight="400"
                                >
                                  {review?.dateOfFollowUp
                                    ? format(
                                        new Date(review.dateOfFollowUp),
                                        "dd MMM yyyy",
                                      )
                                    : "No Date"}
                                </Text>
                              </Box>
                            </Button>
                          ),
                        )}
                      </Flex>
                    ) : (
                      <Text fontSize="13px" color="gray.500">
                        No reviews created.
                      </Text>
                    )}
                  </AccordionPanel>
                </AccordionItem>
              </Accordion>
              <Divider />
              <Flex align={"center"} gap="0.5rem">
                <Text fontSize={"13px"} fontWeight="500">
                  Review Period
                </Text>
                <Spacer />
                <Text fontSize={"13px"}>
                  {selectedRecord?.followUpPeriod
                    ? `${selectedRecord?.followUpPeriod} months`
                    : "Annual"}
                </Text>
              </Flex>
              <Divider />
              <Flex align={"center"} gap="0.5rem">
                <Text fontSize={"13px"} fontWeight="500">
                  Next Review
                </Text>
                <Spacer />
                <Text fontSize={"13px"}>
                  {selectedRecord?.recordFollowUpMatrix?.length > 0
                    ? `${format(
                        addMonths(
                          new Date(
                            selectedRecord?.recordFollowUpMatrix?.[
                              selectedRecord?.recordFollowUpMatrix?.length - 1
                            ]?.dateOfFollowUp,
                          ),
                          12,
                        ),
                        "MMMM yyyy",
                      )}`
                    : "N/A"}
                </Text>
              </Flex>
              <Divider />
            </Flex>{" "}
          </CardBody>
          <CardFooter>
            {!fromClinlog && (
              <Flex
                align={"center"}
                justify="center"
                gap="0.5rem"
                fontWeight={700}
                w="100%"
                cursor={"pointer"}
                onClick={() => {
                  setFollowUpId(null);
                  setShowSiteFollowUp(false);
                  onReviewOpen();
                }}
                _hover={{
                  bg: "blue.50",
                  color: "#007AFF",
                  transform: "scale(1.025)",
                  boxShadow: "sm",
                }}
                transition="all 0.15s"
              >
                <Text color="#007AFF" fontSize={"13px"}>
                  Create Review
                </Text>
                <chakra.span
                  className="material-symbols-outlined"
                  fontSize={"14px"}
                  color="#007AFF"
                  cursor={"pointer"}
                >
                  arrow_outward
                </chakra.span>
              </Flex>
            )}
          </CardFooter>
        </Card>
      </Flex>
      {/* <Flex w="100%" mt="2">
        <Card
          w="100%"
          borderRadius={"0px"}
          boxShadow="0 4px 4px 0 rgba(0, 0, 0, 0.25)"
          border={"1px solid #EFF2FF"}
          bg="white"
        >
          <CardBody>
            <Flex
              gap="0.2rem"
              align={"center"}
              justify={"space-between"}
              h="30px"
              w="100%"
            >
              <Text fontSize="12px" fontWeight={"700"}>
                Reviews Carried Out
                {isBase && " (Latest Two Reviews)"}
              </Text>
              <Spacer />

              {isBase
                ? selectedRecord?.recordFollowUpMatrix
                    ?.slice(-2)
                    ?.map((item, index) => {
                      return (
                        <Flex
                          key={index}
                          bg={item ? "#CEF8FC" : "#D9D9D9"}
                          p="2"
                          borderRadius="6px"
                          color={item ? "#scBlack" : "#D9D9D9"}
                          fontSize="8px"
                          align={"center"}
                          justify={"center"}
                          textTransform={"uppercase"}
                          fontWeight={"900"}
                          h="35px"
                          onClick={() => {
                            if (item) {
                              setFollowUpId(item.id)
                              onReviewOpen()
                            }
                          }}
                        >
                          {item
                            ? item?.timeFromSurgery
                              ? `${item?.timeFromSurgery} Days`
                              : `Review ${index + 1}`
                            : "0 Days"}
                        </Flex>
                      )
                    })
                : progressBlocks?.map((item, index) => {
                    return (
                      <Flex
                        key={index}
                        bg={item ? "#CEF8FC" : "#D9D9D9"}
                        p="2"
                        borderRadius="6px"
                        color={item ? "#scBlack" : "#D9D9D9"}
                        w="8%"
                        fontSize="9px"
                        align={"center"}
                        justify={"center"}
                        textTransform={"uppercase"}
                        fontWeight={"900"}
                        h="35px"
                        onClick={() => {
                          if (item) {
                            setFollowUpId(item.id)
                            onReviewOpen()
                          }
                        }}
                      >
                        {item
                          ? item?.timeFromSurgery
                            ? `${item?.timeFromSurgery} Days`
                            : `Review ${index + 1}`
                          : "0 Days"}
                      </Flex>
                    )
                  })}
              <Spacer />
              <Button
                bgColor="#4ADE80"
                color="white"
                borderRadius="10px"
                fontSize={{ base: "8px", md: "12px" }}
                textTransform={"uppercase"}
                onClick={() => {
                  setFollowUpId(null)
                  onReviewOpen()
                }}
              >
                Review
              </Button>
            </Flex>
          </CardBody>
        </Card>
      </Flex> */}

      <Flex
        w="100%"
        mt="2"
        flexDirection={"column"}
        gap="0.5rem"
        borderRadius="6px"
        // boxShadow="0 4px 4px 0 rgba(0, 0, 0, 0.25)"
        border={"1px solid #EFF2FF"}
        bg="white"
      >
        <Flex gap={"0.5rem"} align="center" p="3">
          <Text fontSize="14px" fontWeight={"700"}>
            Site Specific Components
          </Text>
          <Spacer />

          {/* Tab-like segmented control */}
          {/* {!fromClinlog && (
            <Flex
              bg="white"
              borderRadius="md"
              border="1px solid #E5E5E5"
              p="0"
              gap="0"
              overflow="hidden"
            >
              <Button
                size="sm"
                variant="ghost"
                textTransform={"uppercase"}
                fontSize="10px"
                fontWeight="600"
                borderRadius="0"
                px="3"
                py="2"
                borderRight="1px solid #E5E5E5"
                color={activeTab === "ALL" ? "#6B7280" : "#2563EB"}
                bg={activeTab === "ALL" ? "#F3F4F6" : "transparent"}
                borderBottom={
                  activeTab === "ALL" ? "none" : "2px solid #2563EB"
                }
                _hover={{
                  bg: activeTab === "ALL" ? "#F3F4F6" : "transparent",
                  color: activeTab === "ALL" ? "#2563EB" : "#6B7280",
                }}
                onClick={() => setActiveTab("THIS TREATMENT")}
              >
                THIS TREATMENT
              </Button>
              <Button
                size="sm"
                variant="ghost"
                textTransform={"uppercase"}
                fontSize="10px"
                fontWeight="600"
                color={activeTab === "THIS TREATMENT" ? "#6B7280" : "#2563EB"}
                bg={activeTab === "THIS TREATMENT" ? "#F3F4F6" : "transparent"}
                borderBottom={
                  activeTab === "THIS TREATMENT" ? "none" : "2px solid #2563EB"
                }
                _hover={{
                  bg:
                    activeTab === "THIS TREATMENT" ? "#F3F4F6" : "transparent",
                  color: activeTab === "THIS TREATMENT" ? "#2563EB" : "#6B7280",
                }}
                borderRadius="0"
                px="3"
                py="2"
                onClick={() => setActiveTab("ALL")}
              >
                ALL
              </Button>
            </Flex>
          )} */}
          {/* <Button
            size="sm"
            variant="outline"
            textTransform={"uppercase"}
            fontSize="8px"
            color="#767676"
          >
            <chakra.span className="material-symbols-outlined" fontSize="14px">
              adf_scanner
            </chakra.span>
            <Text ml="2">Print</Text>
          </Button>
          <Button
            size="sm"
            variant="outline"
            textTransform={"uppercase"}
            fontSize="8px"
            color={"#767676"}
          >
            <Text ml="2">Download CSV</Text>
          </Button> */}
        </Flex>
        <Table variant="simple" size="md">
          <Thead
            bgColor={"#F5F5F5"}
            borderTop="1px solid #D9D9D9"
            borderBottom={"1px solid #D9D9D9"}
          >
            {table.getHeaderGroups().map((headerGroup) => (
              <Tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const displayMap = {
                    inFunction: {},
                    insertionDate: { base: "none" },
                    site: {},
                    componentType: { base: "none", md: "table-cell" },
                    componentSpec: { base: "none", md: "table-cell" },
                    placement: { base: "none", md: "none", xl: "table-cell" },
                    grafting: {
                      base: "none",
                      md: "none",
                      "2xl": "table-cell",
                    },
                    // approvedBy: {
                    //   base: "none",
                    //   md: "none",
                    //   "2xl": "table-cell",
                    // },
                    action: {},
                  };

                  return (
                    <Th
                      key={header.id}
                      sx={tHeadCss}
                      display={displayMap[header.id]}
                      // onClick={header.column.getToggleSortingHandler()}
                      // cursor={
                      //   header.column.getCanSort() ? "pointer" : "default"
                      // }
                    >
                      <Flex justify={"space-between"} align="center">
                        <Text>
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                        </Text>
                        {header.column.getCanSort() && (
                          <chakra.span
                            className="material-symbols-outlined"
                            fontSize="14px"
                          >
                            {header.column.getIsSorted()
                              ? header.column.getIsSorted() === "desc"
                                ? "arrow_downward"
                                : "arrow_upward"
                              : "swap_vert"}
                          </chakra.span>
                        )}
                      </Flex>
                    </Th>
                  );
                })}
              </Tr>
            ))}
          </Thead>
          <Tbody>
            {approvedTreatments ? (
              table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row) => {
                  // Check if this row has any grouped cells
                  const groupedCell = row
                    .getVisibleCells()
                    .find((cell) => cell.getIsGrouped());

                  if (groupedCell) {
                    // Render grouped row with single TD spanning all columns
                    return (
                      <Tr key={row.id} bgColor="#F7FAFC" fontWeight="bold">
                        <Td colSpan={columns.length}>
                          <Flex align="center" gap={2}>
                            <Button
                              size="xs"
                              onClick={row.getToggleExpandedHandler()}
                              variant="ghost"
                            >
                              <chakra.span
                                className="material-symbols-outlined"
                                fontSize="16px"
                              >
                                {row.getIsExpanded()
                                  ? "expand_more"
                                  : "chevron_right"}
                              </chakra.span>
                            </Button>
                            {flexRender(
                              groupedCell.column.columnDef.aggregatedCell ??
                                groupedCell.column.columnDef.cell,
                              groupedCell.getContext(),
                            )}
                            <Text fontSize="12px" color="gray.600" ml={2}>
                              ({row.subRows.length} items)
                            </Text>
                          </Flex>
                        </Td>
                      </Tr>
                    );
                  }
                  const hasSiteSpecificDetails =
                    row?.original?.attachedSiteSpecificRecords?.length > 0;
                  // Render normal row with all cells
                  return (
                    <Tr
                      key={row.id}
                      onClick={() => {
                        if (!hasSiteSpecificDetails) {
                          setSelectedSite(row?.original);
                          onSidebarOpen();
                        }
                      }}
                      _hover={{
                        backgroundColor: !hasSiteSpecificDetails
                          ? "gray.50"
                          : "transparent",
                      }}
                      cursor={!hasSiteSpecificDetails ? "pointer" : "default"}
                    >
                      {row.getVisibleCells().map((cell) => {
                        const displayMap = {
                          inFunction: {},
                          insertionDate: { base: "none" },
                          site: {},
                          componentType: { base: "none", md: "table-cell" },
                          componentSpec: { base: "none", md: "table-cell" },
                          placement: {
                            base: "none",
                            md: "none",
                            xl: "table-cell",
                          },
                          grafting: {
                            base: "none",
                            md: "none",
                            "2xl": "table-cell",
                          },
                          // approvedBy: {
                          //   base: "none",
                          //   md: "none",
                          //   "2xl": "table-cell",
                          // },
                          action: {},
                        };

                        // Skip placeholder cells
                        if (cell.getIsPlaceholder()) {
                          return null;
                        }

                        // Render aggregated or regular cells
                        return (
                          <Td
                            key={cell.id}
                            display={displayMap[cell.column.id]}
                          >
                            {cell.getIsAggregated()
                              ? flexRender(
                                  cell.column.columnDef.aggregatedCell ??
                                    cell.column.columnDef.cell,
                                  cell.getContext(),
                                )
                              : flexRender(
                                  cell.column.columnDef.cell,
                                  cell.getContext(),
                                )}
                          </Td>
                        );
                      })}
                    </Tr>
                  );
                })
              ) : (
                <Tr>
                  <Td colSpan={columns.length}>
                    <Flex
                      w="100%"
                      h="20%"
                      align={"center"}
                      justify={"center"}
                      fontSize="14px"
                      fontFamily={"inter"}
                      fontWeight={"500"}
                    >
                      {siteSpecificGlobal.isFetching ||
                      siteSpecificGlobal.isLoading
                        ? "Loading..."
                        : statusFilter === "completed"
                          ? "No completed treatments"
                          : "No pending treatments"}
                    </Flex>
                  </Td>
                </Tr>
              )
            ) : (
              <Tr>
                <Td colSpan={columns.length}>
                  <Flex
                    w="100%"
                    h="20%"
                    align={"center"}
                    justify={"center"}
                    fontSize="14px"
                    fontFamily={"inter"}
                    fontWeight={"500"}
                  >
                    There is currently no approved proposal for this patient to
                    provide surgical details.
                  </Flex>
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
        <Flex mt={4} justify="center" align="center" gap={2}>
          {/* Previous page */}
          <Button
            size="xs"
            onClick={() => table.previousPage()}
            isDisabled={!table.getCanPreviousPage()}
          >
            &lt;
          </Button>
          {/* Page numbers */}
          {Array.from({ length: table.getPageCount() }, (_, i) => {
            const page = i + 1;
            const currentGroup = Math.floor(
              table.getState().pagination.pageIndex / PAGE_GROUP_SIZE,
            );
            const startPage = currentGroup * PAGE_GROUP_SIZE + 1;
            const endPage = Math.min(
              startPage + PAGE_GROUP_SIZE - 1,
              table.getPageCount(),
            );

            // Only show pages in current group
            if (page >= startPage && page <= endPage) {
              return (
                <Button
                  size="xs"
                  key={page}
                  onClick={() => table.setPageIndex(i)}
                  variant={
                    i === table.getState().pagination.pageIndex
                      ? "solid"
                      : "outline"
                  }
                >
                  {page}
                </Button>
              );
            }
            return null;
          })}

          {/* Next page */}
          <Button
            size="xs"
            onClick={() => table.nextPage()}
            isDisabled={!table.getCanNextPage()}
          >
            &gt;
          </Button>
        </Flex>

        <Text m={2} textAlign="center" fontSize="xs" color="gray.600">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </Text>
      </Flex>

      {/* all Drawers required */}
      <Drawer
        isOpen={isSidebarOpen}
        placement="right"
        onClose={onSidebarClose}
        size="xl"
      >
        {/* 0107630031736543112310301728102910AWXW9
        0107630031736543112310301728102910AWXW9
        0107630031736543112411111729111010JMAK6 */}
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader bgColor={"#0E11C7"} fontWeight={"700"}>
            <Flex align={"center"} gap="0.5rem">
              <chakra.span
                className="material-symbols-outlined"
                fontSize={{ base: "18px", md: "23px" }}
                color="white"
                cursor={"pointer"}
                onClick={onSidebarClose}
              >
                arrow_back_ios
              </chakra.span>
              <Spacer />
              {/* <chakra.span
                          className="material-symbols-outlined"
                          fontSize={{ base: "18px", md: "23px" }}
                          color="#91C1F5"
                        >
                          graph_6
                        </chakra.span> */}
              <Text
                fontSize="14px"
                color="white"
                fontFamily={"inter"}
                letterSpacing={"1.3px"}
              >
                {selectedSite
                  ? selectedSite?.treatmentItemNumber === "666"
                    ? "RETAINER DETAILS"
                    : `SITE SPECIFIC DETAILS | SITE ${selectedSite?.toothValue}`
                  : "ADD SITE SPECIFICATIONS"}
              </Text>
              <Spacer />
            </Flex>
          </DrawerHeader>
          <DrawerBody>
            <SiteSpecificSideBar
              selectedSite={selectedSite}
              toastData={toastData}
              patientName={patientName}
              approvedProposal={proposedTreatmentChartResults?.find(
                (proposal) =>
                  proposal.chartStatus === "approved" ||
                  proposal.chartStatus === "modified",
              )}
              onSidebarClose={onSidebarClose}
              globalPostId={globalPostId}
              proposedTreatmentChartIds={proposedTreatmentChartIds}
              onSiteSaved={(site) => {
                const toothVal = String(site ?? "");
                if (!toothVal) return;
                setOptimisticSites((prev) =>
                  prev.includes(toothVal) ? prev : [...prev, toothVal],
                );
              }}
              fromClinlog={fromClinlog}
              fetchDentalComponentsQueryResult={
                fetchDentalComponentsQueryResult
              }
            />
          </DrawerBody>
          <DrawerFooter>
            {/* <Button variant="outline" mr={3} onClick={onClose}>
                        Cancel
                      </Button>
                      <Button colorScheme="blue">Save</Button> */}
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
      <Drawer
        isOpen={isReviewOpen}
        onClose={onReviewClose}
        size="xl"
        closeOnOverlayClick={false}
        // isCentered
      >
        <DrawerOverlay />
        <DrawerContent overflow={"hidden"} zIndex={1499} borderRadius="0px">
          <DrawerHeader
            p="6"
            bg={
              fromClinlog
                ? "linear-gradient(90deg, var(--clinlog-purple, #452A7E) 25%, #612ECC 100%)"
                : "#0E11C7"
            }
            borderRadius="0px"
          >
            <Flex w="100%" align="center">
              <chakra.span
                className="material-symbols-outlined"
                fontSize={{ base: "18px", md: "23px" }}
                color="white"
                cursor={"pointer"}
                onClick={() => {
                  onReviewClose();
                  setFollowUpId(null);
                }}
              >
                arrow_back_ios
              </chakra.span>
              <Spacer />
              <Text
                textTransform="uppercase"
                color="white"
                fontSize={{ base: "13px", md: "14px" }}
                fontFamily="inter"
                fontWeight="700"
                letterSpacing={"0.88px"}
              >
                {followUpId !== null ? "View" : "Create"} Treatment Review
              </Text>
              <Spacer />
            </Flex>
          </DrawerHeader>

          <DrawerBody p={0}>
            <chakra.form onSubmit={handleSubmitFollowUp(followUpOnSubmit)}>
              <Flex
                flexDirection={"column"}
                gap="0.5rem"
                px="6"
                py="6"
                w="100%"
              >
                <Flex align={"center"} justify={"space-between"}>
                  <Text
                    fontFamily={"inter"}
                    fontSize="12px"
                    letterSpacing={"1.3px"}
                    fontWeight={700}
                    textTransform={"uppercase"}
                  >
                    REVIEW CHARACTERISTICS
                  </Text>
                </Flex>
                <Divider />
                <Input
                  value={selectedRecord?.id}
                  type="hidden"
                  {...registerFollowUp("id")}
                />
                <SimpleGrid columns={1} spacing="0.5rem" w="100%">
                  {followUpData.map((item, index) => {
                    return (
                      <Flex
                        gap="0.2rem"
                        align="center"
                        p="1"
                        key={item.key}
                        flexDirection={"column"}
                      >
                        <Flex gap="0.5rem" align="center" w="100%">
                          <Text
                            fontSize={{ base: "9px", lg: "10px" }}
                            w="100%"
                            fontWeight={700}
                            textTransform={"uppercase"}
                            color="#007AFF"
                            letterSpacing="0.24px"
                            m="0"
                          >
                            {item.label}
                          </Text>
                        </Flex>

                        {item.options && followUpId === null ? (
                          <Select
                            fontSize={{ base: "13px", md: "14px" }}
                            borderRadius="6px"
                            border="1px solid #D9D9D9"
                            _hover={{ border: "1px solid #D9D9D9" }}
                            _focusVisible={{ border: "1px solid #D9D9D9" }}
                            defaultValue={item.value}
                            {...registerFollowUp(item.key)}
                          >
                            {item.options.map((option, index) => (
                              <option
                                key={option.value + index}
                                value={option.value}
                              >
                                {option.name}
                              </option>
                            ))}
                          </Select>
                        ) : (
                          <>
                            {followUpId ? (
                              <Text
                                fontWeight="400"
                                fontSize={{ base: "13px", md: "14px" }}
                                border="1px solid #D9D9D9"
                                borderRadius="6px"
                                p="2"
                                textTransform={"capitalize"}
                                w="100%"
                                cursor={"not-allowed"}
                              >
                                {item.value}
                              </Text>
                            ) : item?.key === "dateOfFollowUp" ? (
                              <Input
                                type="date"
                                fontWeight="400"
                                fontSize={{ base: "13px", md: "14px" }}
                                borderRadius="6px"
                                border="1px solid #D9D9D9"
                                _hover={{ border: "1px solid #D9D9D9" }}
                                _focusVisible={{ border: "1px solid #D9D9D9" }}
                                _active={{ border: "1px solid #D9D9D9" }}
                                defaultValue={item.value}
                                textTransform={"uppercase"}
                                {...registerFollowUp(item.key)}
                              />
                            ) : (
                              <Input
                                fontWeight="400"
                                fontSize="14px"
                                borderRadius="6px"
                                border="1px solid #D9D9D9"
                                _hover={{ border: "1px solid #D9D9D9" }}
                                _focusVisible={{ border: "1px solid #D9D9D9" }}
                                _active={{ border: "1px solid #D9D9D9" }}
                                defaultValue={item.value}
                                textTransform={"capitalize"}
                                {...registerFollowUp(item.key)}
                              />
                            )}
                          </>
                        )}
                      </Flex>
                    );
                  })}
                  <Spacer />
                  {followUpId === null && (
                    // <Button
                    //   type="submit"
                    //   w="50%"
                    //   size="sm"
                    //   bg="#007AFF"
                    //   color="white"
                    // >
                    //   Save
                    // </Button>
                    <Button
                      w="100%"
                      borderRadius={"0"}
                      size="lg"
                      bg="#DFDFF1"
                      _hover={{
                        bg: "#DFDFF1",
                        boxShadow: "0 2px 2px 0 rgba(0, 0, 0, 0.10)",
                      }}
                      type="submit"
                    >
                      <Text
                        fontSize={{ base: "12px", md: "13px" }}
                        textTransform="uppercase"
                        color={"#767171"}
                        fontWeight="700"
                        letterSpacing={"0.88px"}
                      >
                        Save Review
                      </Text>
                    </Button>
                  )}
                </SimpleGrid>

                {showSiteFollowUp && sitesWithImplantsMemo?.length > 0 && (
                  <>
                    <Flex align={"center"} mt="4">
                      <Text
                        fontFamily={"inter"}
                        fontSize="12px"
                        letterSpacing={"1.3px"}
                        fontWeight={700}
                        textTransform={"uppercase"}
                      >
                        Site Specific Details
                      </Text>
                    </Flex>
                    <Divider />
                    <Table variant="simple">
                      <Thead>
                        <Tr
                          fontFamily={"inter"}
                          fontSize="11px"
                          letterSpacing={"1px"}
                          fontWeight={700}
                          textTransform={"uppercase"}
                        >
                          <Td>Status</Td>
                          <Td>Site</Td>
                          <Td>Decription</Td>
                          <Td>Actions</Td>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {sitesWithImplantsMemo?.map((site, index) => {
                          const isAbutment =
                            site?.treatmentItemNumber === "661";
                          if (isAbutment) {
                            return null;
                          }
                          const siteFollowUpData =
                            site?.attachedSiteSpecificRecords?.[0]
                              ?.attachedSiteSpecificFollowUp;
                          const dateOfReview =
                            getValuesFollowUp("dateOfFollowUp");

                          const foundFollowUpAtDate = siteFollowUpData?.filter(
                            (item) =>
                              item?.recordFollowUpDate &&
                              format(
                                new Date(item?.recordFollowUpDate),
                                "dd MMM yyyy",
                              ) ===
                                format(
                                  new Date(dateOfReview || null),
                                  "dd MMM yyyy",
                                ),
                          );
                          const completedFollowUpAtDate =
                            foundFollowUpAtDate?.length > 0;
                          return (
                            <Tr
                              key={index}
                              fontSize="12px"
                              letterSpacing={"1.3px"}
                              w="100%"
                            >
                              <Td>
                                {completedFollowUpAtDate ? (
                                  <MdCheckCircleOutline
                                    color="#4ADE80"
                                    fontSize="20px"
                                  />
                                ) : (
                                  <MdIncompleteCircle
                                    color="#D9D9D9"
                                    fontSize="20px"
                                  />
                                )}
                              </Td>
                              <Td>{site?.toothValue}</Td>
                              <Td>
                                {site?.treatmentItemNumber === "666" &&
                                site?.attachedSiteSpecificRecords?.[0]
                                  ? `${site?.attachedSiteSpecificRecords?.[0]?.barMaterial}`
                                  : site?.attachedSiteSpecificRecords?.[0]
                                    ? `${site?.attachedSiteSpecificRecords?.[0]?.itemSpecificationMatrix?.[0]?.implantType}, 
                            ${site?.attachedSiteSpecificRecords?.[0]?.itemSpecificationMatrix?.[0]?.implantLength},
                            ${site?.attachedSiteSpecificRecords?.[0]?.itemSpecificationMatrix?.[0]?.angleCorrectionAbutment}`
                                    : "Specifications not available"}
                              </Td>
                              <Td
                                color={
                                  site?.attachedSiteSpecificRecords?.length > 0
                                    ? "#007AFF"
                                    : "scBlack"
                                }
                                textTransform={"uppercase"}
                                fontWeight={700}
                                cursor={"pointer"}
                                onClick={() => {
                                  if (
                                    site?.attachedSiteSpecificRecords?.length >
                                    0
                                  ) {
                                    setSelectedSite(site);
                                    onFollowUpOpen();
                                    // if (followUpId) {
                                    //   setSelectedSite(site)
                                    //   onFollowUpOpen()
                                    // } else {
                                    //   alert(
                                    //     "Save the Review Characteristics, before starting with site specific follow up"
                                    //   )
                                    // }
                                  } else {
                                    setSelectedSite(site);
                                    onSidebarOpen();
                                  }
                                }}
                                _hover={{
                                  color: "#007AFF",
                                  textDecoration: "underline",
                                  transform: "scale(1.055)",
                                  boxShadow: "sm",
                                }}
                                transition="all 0.15s"
                              >
                                {site?.attachedSiteSpecificRecords?.length > 0
                                  ? "View Follow Up"
                                  : "Add Site Details"}
                              </Td>
                            </Tr>
                          );
                        })}
                      </Tbody>
                    </Table>
                  </>
                )}
              </Flex>
            </chakra.form>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
      <Drawer
        isOpen={isCharcteristicsOpen}
        onClose={() => {
          onCharcteristicsClose();
          const { drawer, ...restQuery } = router.query;
          router.replace(
            {
              pathname: router.pathname,
              query: restQuery,
            },
            undefined,
            { shallow: true },
          );
        }}
        size="lg"
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader
            bg={
              fromClinlog
                ? "linear-gradient(90deg, var(--clinlog-purple, #452A7E) 25%, #612ECC 100%)"
                : "#0E11C7"
            }
            fontWeight={"700"}
            p="6"
          >
            <Flex align={"center"} gap="0.5rem">
              <chakra.span
                className="material-symbols-outlined"
                fontSize={{ base: "18px", md: "23px" }}
                color="white"
                cursor={"pointer"}
                onClick={onCharcteristicsClose}
              >
                arrow_back_ios
              </chakra.span>
              <Spacer />
              <Text
                fontSize="14px"
                color="white"
                fontFamily={"inter"}
                letterSpacing={"1.3px"}
                textTransform={"uppercase"}
              >
                {editType === "treatment"
                  ? "Treatment Characteristics"
                  : "Patient Characteristics"}
              </Text>
              <Spacer />
            </Flex>
          </DrawerHeader>
          <DrawerBody overflow={"hidden"}>
            <chakra.form onSubmit={handleSubmit(onSubmit)}>
              <Flex
                w="100%"
                flexDirection={"column"}
                align={"center"}
                justify={"center"}
                gap="1rem"
              >
                {!fromClinlog && (
                  <Flex
                    flexDirection={"column"}
                    gap="0.2rem"
                    align={"center"}
                    justify={"center"}
                    bgColor={"#FF1111"}
                    p="3"
                    color="white"
                    borderRadius={"6px"}
                  >
                    <Flex align={"center"} gap="0.4rem">
                      {" "}
                      {/* <MdWarning /> */}
                      <Text
                        fontWeight={"700"}
                        textTransform="uppercase"
                        fontSize={{ base: "11px", md: "12px" }}
                      >
                        {" "}
                        Data Source Notice
                      </Text>
                    </Flex>

                    <Text
                      textAlign={"center"}
                      fontSize={{ base: "10px", md: "11px" }}
                    >
                      The information in this section is sourced from multiple
                      systems. You may update these fields as needed; however,
                      any changes will immediately update and affect the data
                      stored in the Clinlog application. Please review carefully
                      before making edits.
                    </Text>
                  </Flex>
                )}

                <Flex
                  flexDirection={"column"}
                  gap="1.2rem"
                  px="1"
                  py="2"
                  //maxH={"78vh"}
                  h={fromClinlog ? "100%" : "78vh"}
                  w="100%"
                  overflowY={"scroll"}
                >
                  <Flex align={"center"} gap="0.4rem" justify={"center"}>
                    <Box
                      w="19px"
                      h="15px"
                      bgColor={"#4ADE80"}
                      borderRadius="2px"
                    ></Box>
                    <Text fontSize={"9px"} fontWeight="700" mr="4">
                      VERIFIED BY STAFF
                    </Text>
                    <Box
                      w="19px"
                      h="15px"
                      bgColor={"#FF9B56"}
                      borderRadius="2px"
                    ></Box>
                    <Text fontSize={"9px"} fontWeight="700" mr="4">
                      TO BE VERIFIED
                    </Text>
                    <Box
                      w="19px"
                      h="15px"
                      bgColor={"#FF1111"}
                      borderRadius="2px"
                    ></Box>
                    <Text fontSize={"9px"} fontWeight="700" mr="4">
                      NO DATA
                    </Text>
                  </Flex>
                  {editType === "treatment"
                    ? treatmentCharacteristics.map((item, index) => {
                        if (item?.type === "images") {
                          return (
                            <Flex
                              w="100%"
                              gap="0.5rem"
                              align="center"
                              border="1px solid"
                              borderColor="scLightGrey"
                              p="2"
                              key={item.key}
                            >
                              <Accordion w="100%" allowToggle={true}>
                                <AccordionItem w="100%" border="none" p="0">
                                  <AccordionButton w="100%" p="0">
                                    <Box
                                      w="7px"
                                      h="50px"
                                      bgColor={item?.boxColor}
                                    ></Box>
                                    <Flex
                                      w="60%"
                                      gap="0.5rem"
                                      align="center"
                                      ml="1"
                                    >
                                      <chakra.span
                                        fontSize={"24px"}
                                        color="#007AFF"
                                        className="material-symbols-outlined"
                                      >
                                        {item.icon}
                                      </chakra.span>

                                      <Text
                                        fontSize={{ base: "12px", md: "13px" }}
                                        fontWeight={600}
                                      >
                                        {item.label}
                                      </Text>
                                      <Tooltip
                                        label={item.info}
                                        placement="bottom"
                                        fontSize="11px"
                                      >
                                        <chakra.span
                                          fontSize={"16px"}
                                          color="#D9D9D9"
                                          className="material-symbols-outlined"
                                        >
                                          info
                                        </chakra.span>
                                      </Tooltip>
                                    </Flex>
                                    <Spacer />
                                    <Text
                                      fontWeight="500"
                                      border="1px solid #D9D9D9"
                                      w="40%"
                                      fontSize={{ base: "12px", md: "13px" }}
                                      borderRadius="6px"
                                      p="2"
                                      textAlign={"center"}
                                      //textTransform={"uppercase"}
                                    >
                                      Add/View Images
                                    </Text>
                                  </AccordionButton>
                                  <AccordionPanel>
                                    <Flex
                                      flexDirection={"column"}
                                      p="2"
                                      gap="0.5rem"
                                    >
                                      <Checkbox
                                        size="md"
                                        colorScheme="gray"
                                        {...register("isImageIdentifiable")}
                                        disabled={fromClinlog}
                                      >
                                        <Text ml="2" fontSize="14px">
                                          {" "}
                                          Do any of the images show Identifiable
                                          Features (Face Visible, Eyes, Tattoos,
                                          Background)
                                        </Text>
                                      </Checkbox>
                                      <Text
                                        fontSize={{
                                          base: "12px",
                                          md: "13px",
                                        }}
                                        fontWeight={600}
                                        mt="2"
                                      >
                                        Pre-Op Photos
                                      </Text>
                                      <Input
                                        type="text"
                                        fontSize={{
                                          base: "12px",
                                          md: "13px",
                                        }}
                                        disabled={fromClinlog}
                                        {...register("preOpPhotos")}
                                        placeholder="Image URL"
                                      />
                                      <Text
                                        fontSize={{
                                          base: "12px",
                                          md: "13px",
                                        }}
                                        fontWeight={600}
                                        mt="2"
                                      >
                                        Pre-op Reconstructed OPG
                                      </Text>
                                      <Input
                                        type="text"
                                        fontSize={{
                                          base: "12px",
                                          md: "13px",
                                        }}
                                        disabled={fromClinlog}
                                        {...register("preOpReconstructedOpg")}
                                        placeholder="Image URL"
                                      />
                                      <Text
                                        fontSize={{
                                          base: "12px",
                                          md: "13px",
                                        }}
                                        fontWeight={600}
                                        mt="2"
                                      >
                                        Post-op Photos
                                      </Text>
                                      <Input
                                        type="text"
                                        fontSize={{
                                          base: "12px",
                                          md: "13px",
                                        }}
                                        disabled={fromClinlog}
                                        {...register("postOpPhotos")}
                                        placeholder="Image URL"
                                      />
                                      <Text
                                        fontSize={{
                                          base: "12px",
                                          md: "13px",
                                        }}
                                        fontWeight={600}
                                        mt="2"
                                      >
                                        Post-op 2-D OPG
                                      </Text>
                                      <Input
                                        type="text"
                                        fontSize={{
                                          base: "12px",
                                          md: "13px",
                                        }}
                                        disabled={fromClinlog}
                                        {...register("postOp2DOpg")}
                                        placeholder="Image URL"
                                      />
                                      <Text
                                        fontSize={{
                                          base: "12px",
                                          md: "13px",
                                        }}
                                        fontWeight={600}
                                        mt="2"
                                      >
                                        Post-op 3-D OPG
                                      </Text>
                                      <Input
                                        type="text"
                                        fontSize={{
                                          base: "12px",
                                          md: "13px",
                                        }}
                                        disabled={fromClinlog}
                                        {...register("postOp3DOpg")}
                                        placeholder="Image URL"
                                      />
                                      {!fromClinlog && (
                                        <Button
                                          onClick={downloadZip}
                                          bg="#0E11C7"
                                          color="white"
                                          mt="4"
                                          p="6"
                                          disabled={!selectedRecord?.caseNumber}
                                        >
                                          {" "}
                                          Download Folder Structure
                                        </Button>
                                      )}
                                    </Flex>
                                  </AccordionPanel>
                                </AccordionItem>
                              </Accordion>
                            </Flex>
                          );
                        }
                        return (
                          <Flex
                            w="100%"
                            gap="0.5rem"
                            align="center"
                            border="1px solid"
                            borderColor="scLightGrey"
                            p="2"
                            key={item.key}
                          >
                            <Box
                              w="7px"
                              h="50px"
                              bgColor={item?.boxColor}
                            ></Box>
                            <Flex w="60%" gap="0.5rem" align="center">
                              {item?.svg ? (
                                <Image src={item.svg} objectFit={"contain"} />
                              ) : (
                                <chakra.span
                                  fontSize={"24px"}
                                  color="#007AFF"
                                  className="material-symbols-outlined"
                                >
                                  {item.icon}
                                </chakra.span>
                              )}
                              <Text
                                fontSize={{ base: "12px", md: "13px" }}
                                fontWeight={600}
                              >
                                {item.label}
                              </Text>
                              <Tooltip
                                label={item.info}
                                placement="bottom"
                                fontSize="11px"
                              >
                                <chakra.span
                                  fontSize={"16px"}
                                  color="#D9D9D9"
                                  className="material-symbols-outlined"
                                >
                                  info
                                </chakra.span>
                              </Tooltip>
                            </Flex>
                            {editTreatmentChar ? (
                              item.options ? (
                                <Select
                                  fontWeight="500"
                                  w="40%"
                                  fontSize={{ base: "12px", md: "13px" }}
                                  borderRadius="6px"
                                  textAlign={"center"}
                                  border={"1px solid #D9D9D9"}
                                  _hover={{ border: "1px solid #D9D9D9" }}
                                  _focusVisible={{
                                    border: "1px solid #D9D9D9",
                                  }}
                                  //textTransform={"uppercase"}
                                  defaultValue={item.value}
                                  {...register(item.key)}
                                  cursor={"pointer"}
                                >
                                  {item.options.map((option, i) => (
                                    <option
                                      key={option.value + i + item.key}
                                      value={option.value}
                                    >
                                      {option.name}
                                    </option>
                                  ))}
                                </Select>
                              ) : (
                                <>
                                  {item?.key ===
                                  "timeFromSurgeryToInsertion" ? (
                                    <Text
                                      fontWeight="500"
                                      border="1px solid #D9D9D9"
                                      w="40%"
                                      fontSize={{ base: "12px", md: "13px" }}
                                      borderRadius="6px"
                                      p="3"
                                      textAlign={"center"}
                                      textTransform={"uppercase"}
                                      cursor={"not-allowed"}
                                    >
                                      {item.value}
                                    </Text>
                                  ) : item?.key === "dateOfInsertion" ? (
                                    <Input
                                      type="date"
                                      cursor={"pointer"}
                                      fontWeight="500"
                                      border="1px solid #D9D9D9"
                                      w="40%"
                                      fontSize={{ base: "12px", md: "13px" }}
                                      borderRadius="6px"
                                      p="3"
                                      _hover={{
                                        border: "1px solid #D9D9D9",
                                      }}
                                      _focusVisible={{
                                        border: "1px solid #D9D9D9",
                                      }}
                                      _active={{
                                        border: "1px solid #D9D9D9",
                                      }}
                                      textAlign={"center"}
                                      defaultValue={item.value}
                                      textTransform={"uppercase"}
                                      {...register(item.key)}
                                    />
                                  ) : (
                                    <Input
                                      fontWeight="500"
                                      border="1px solid #D9D9D9"
                                      w="40%"
                                      fontSize={{ base: "12px", md: "13px" }}
                                      borderRadius="6px"
                                      p="3"
                                      placeholder={`Enter ${item.label}`}
                                      _hover={{
                                        border: "1px solid #D9D9D9",
                                      }}
                                      _focusVisible={{
                                        border: "1px solid #D9D9D9",
                                      }}
                                      _active={{
                                        border: "1px solid #D9D9D9",
                                      }}
                                      textAlign={"center"}
                                      defaultValue={item.value || ""}
                                      textTransform={"uppercase"}
                                      {...register(item.key)}
                                    />
                                  )}
                                </>
                              )
                            ) : (
                              <Text
                                fontWeight="500"
                                border="1px solid #D9D9D9"
                                w="40%"
                                fontSize={{ base: "12px", md: "13px" }}
                                borderRadius="6px"
                                p="3"
                                textAlign={"center"}
                                textTransform={"uppercase"}
                              >
                                {item?.options
                                  ? item?.options?.find(
                                      (opt) => opt?.value === item?.value,
                                    )?.name
                                  : item.value || "Unknown"}
                              </Text>
                            )}
                          </Flex>
                        );
                      })
                    : patientCharacteristics.map((item, index) => {
                        return (
                          <Flex
                            w="100%"
                            gap="1rem"
                            align="center"
                            border="1px solid"
                            borderColor="scLightGrey"
                            p="2"
                            key={item.key}
                          >
                            <Box
                              w="7px"
                              h="50px"
                              bgColor={item?.boxColor}
                            ></Box>
                            <Flex w="60%" gap="0.5rem" align="center">
                              <chakra.span
                                fontSize={"24px"}
                                color="#007AFF"
                                className="material-symbols-outlined"
                              >
                                {item.icon}
                              </chakra.span>
                              <Text
                                fontSize={{ base: "12px", md: "13px" }}
                                fontWeight={600}
                              >
                                {item.label}
                              </Text>
                              <Tooltip
                                label={item.info}
                                placement="bottom"
                                fontSize="11px"
                              >
                                <chakra.span
                                  fontSize={"16px"}
                                  color="#D9D9D9"
                                  className="material-symbols-outlined"
                                >
                                  info
                                </chakra.span>
                              </Tooltip>
                            </Flex>

                            {editTreatmentChar ? (
                              item.options ? (
                                <Select
                                  fontWeight="500"
                                  w="40%"
                                  fontSize={{ base: "12px", md: "13px" }}
                                  borderRadius="6px"
                                  textAlign={"center"}
                                  border={"1px solid #D9D9D9"}
                                  _hover={{ border: "1px solid #D9D9D9" }}
                                  _focusVisible={{
                                    border: "1px solid #D9D9D9",
                                  }}
                                  {...register(item.key)}
                                >
                                  {item.options.map((option, index) => (
                                    <option
                                      key={option.value + index + item.key}
                                      value={option.value}
                                    >
                                      {option.name}
                                    </option>
                                  ))}
                                </Select>
                              ) : item?.edit ? (
                                <Input
                                  fontWeight="600"
                                  // bgColor="#E2EFFC"
                                  w="40%"
                                  border="1px solid #D9D9D9"
                                  fontSize="10px"
                                  borderRadius="6px"
                                  p="3"
                                  // _hover={{ border: "none" }}
                                  // _focusVisible={{ border: "none" }}
                                  // _active={{ border: "none" }}
                                  textAlign={"center"}
                                  defaultValue={item.value}
                                  textTransform={"uppercase"}
                                  {...register(item.key)}
                                />
                              ) : (
                                <Text
                                  fontWeight="500"
                                  border="1px solid #D9D9D9"
                                  w="40%"
                                  fontSize={{ base: "12px", md: "13px" }}
                                  borderRadius="6px"
                                  p="3"
                                  textAlign={"center"}
                                  textTransform={"uppercase"}
                                >
                                  {item?.options
                                    ? item?.options?.find(
                                        (opt) => opt?.value === item?.value,
                                      )?.name
                                    : item.value}
                                </Text>
                              )
                            ) : (
                              <Text
                                fontWeight="500"
                                border="1px solid #D9D9D9"
                                w="40%"
                                fontSize={{ base: "12px", md: "13px" }}
                                borderRadius="6px"
                                p="3"
                                textAlign={"center"}
                                textTransform={"uppercase"}
                              >
                                {item?.options
                                  ? item?.options?.find(
                                      (opt) => opt?.value === item?.value,
                                    )?.name
                                  : item.value}
                              </Text>
                            )}
                          </Flex>
                        );
                      })}
                </Flex>
              </Flex>
              {!fromClinlog && (
                <Flex
                  w="100%"
                  align={"center"}
                  justify={"space-around"}
                  gap="1rem"
                  p="2"
                  position="fixed"
                  bottom="2"
                  left="2"
                  bgColor="white"
                >
                  <Button
                    size="sm"
                    bg="scBlack"
                    color="white"
                    fontWeight="700"
                    textTransform={"uppercase"}
                    fontSize="14px"
                    letterSpacing={"1.2px"}
                    py="7"
                    onClick={() => {
                      setEditTreatmentChar(!editTreatmentChar);
                      onCharcteristicsClose();
                      const { drawer, ...restQuery } = router.query;
                      router.replace(
                        {
                          pathname: router.pathname,
                          query: restQuery,
                        },
                        undefined,
                        { shallow: true },
                      );
                    }}
                    w="45%"
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    bg="scBlue"
                    color="white"
                    fontWeight="700"
                    textTransform={"uppercase"}
                    fontSize="14px"
                    letterSpacing={"1.2px"}
                    py="7"
                    type="submit"
                    w="45%"
                  >
                    Save
                  </Button>
                </Flex>
              )}
            </chakra.form>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
      <SiteSpecificFollowUpV3
        dateOfReview={getValuesFollowUp("dateOfFollowUp")}
        selectedSite={selectedSite}
        isFollowUpOpen={isFollowUpOpen}
        onFollowUpOpen={onFollowUpOpen}
        onFollowUpClose={onFollowUpClose}
        followUpId={followUpId}
        selectedFollowUp={selectedFollowUp}
        toastData={toastData}
        proposedTreatmentChartIds={proposedTreatmentChartIds}
        queryClient={queryClient}
        fromClinlog={fromClinlog}
      />
    </Flex>
  );
}
