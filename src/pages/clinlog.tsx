// @ts-nocheck
import {
  Box,
  Flex,
  Spacer,
  Tab,
  Table,
  TableContainer,
  TabList,
  Tabs,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  Link,
  Button,
  chakra,
  useBreakpointValue,
  Input,
  InputGroup,
  InputLeftElement,
  SimpleGrid,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  useDisclosure,
  Textarea,
  Spinner,
} from "@chakra-ui/react";
import NextLink from "next/link";
import {
  createColumnHelper,
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  flexRender,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
} from "@tanstack/react-table";
import dynamic from "next/dynamic";
import animationData from "../animationsv2/clinlog_loading.json";
import useQueryHook, { getData, sendData } from "hooks/useQueryHook";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { encryptId } from "helpersv2/Auth";
import {
  differenceInDays,
  format,
  isAfter,
  isBefore,
  subMonths,
} from "date-fns";
import ClinlogDemoGraphics from "componentsv2/Analytics/ClinlogDemoGraphics";
import ClinlogPreSurgical from "componentsv2/Analytics/ClinlogPreSurgical";
import ClinlogPostSurgical from "componentsv2/Analytics/ClinlogPostSurgical";
import ClinlogHabitsAndRiskFactors from "componentsv2/Analytics/ClinlogHabitsAndRiskFactors";
import ClinlogDataTool from "componentsv2/Analytics/ClinlogDataTool";
import { MdSearch } from "react-icons/md";
import { StylesConfig } from "react-select";

import { clinlogFilterColumns } from "helpersv2/utils";
import { useSession } from "next-auth/react";
import {
  allClinicsQuery,
  clinlogDataQuery,
  clinlogNotesQuery,
  globalIdsQuery,
  mainViewerQuery,
} from "helpersv2/queries";
import FilterComponent from "componentsv2/Analytics/FilterComponent";
import { keyframes } from "@emotion/react";
import SurgicalDetailsV3_2 from "componentsv2/DetailsPage/Clinical/SurgicalDetailsV3_2";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { clinlogNoteMutation } from "componentsv2/DetailsPage/detailsPageMutations";
import { useV2Router } from "componentsv2/Dashboard/Helpers/routerHelpers";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });
function Clinlog() {
  const [filterArray, setFilterArray] = React.useState([]);
  const [openTab, setOpenTab] = useState("allCases");
  const { data: session } = useSession();
  console.log("session", session);
  const [viewPatient, setViewPatient] = useState(null);
  const [locationArr, setLocationArr] = useState([session?.locationIds?.[0]]);
  const [clinlogStatus, setClinlogStatus] = useState("More Data Required");
  const [newNote, setNewNote] = useState("");
  //const [notesPageIndex, setNotesPageIndex] = useState(1);
  const toast = useToast();
  const toastIdRef = useRef<any>(null);
  const queryClient = useQueryClient();
  const isBase = useBreakpointValue({ base: true, md: false });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isSurveyOpen,
    onOpen: onSurveyOpen,
    onClose: onSurveyClose,
  } = useDisclosure();

  const [openMenu, setOpenMenu] = useState(true);
  const [patientSurveyData, setPatientSurveyData] = useState(null);
  const viewerMainNavbarResult = useQueryHook(
    ["mainViewerQuery"],
    mainViewerQuery,
    {},
    { enabled: !!session },
  );
  const viewerValues = useMemo(() => {
    return viewerMainNavbarResult?.data?.viewer;
  }, [viewerMainNavbarResult?.data?.viewer]);
  const [collapseTabs, setCollapseTabs] = useState(true);
  const isAdmin = session?.groups?.includes("Admin");
  const router = useV2Router();

  const allClinicsQueryResult = useQueryHook(
    ["clinics"],
    allClinicsQuery,
    {},
    {
      enabled: !!session,
    },
  );

  const locationOptions = useMemo(() => {
    // if (isAdmin) {
    //   return allClinicsQueryResult?.data?.clinics?.map((clinic) => ({
    //     value: clinic?.id,
    //     label: `${clinic?.locationShortName}`,
    //   }));
    // } else {
    //   const allClinicIds = allClinicsQueryResult?.data?.clinics?.map(
    //     (clinic) => clinic?.id,
    //   );
    //   const location = session?.locationIds
    //     ?.filter((item) => allClinicIds?.includes(item.toString()))
    //     .map((clinic) => ({
    //       value: clinic.toString(),
    //       label: allClinicsQueryResult?.data?.clinics?.find(
    //         (item) => item.id === clinic.toString(),
    //       )?.locationShortName,
    //     }));
    //   return location || [];
    // }
    return allClinicsQueryResult?.data?.clinics?.map((clinic) => ({
      value: clinic?.id,
      label: `${clinic?.locationShortName}`,
    }));
  }, [allClinicsQueryResult?.data?.clinics, session?.locationIds]);

  useEffect(() => {
    if (!locationArr?.includes("all") && allClinicsQueryResult?.data?.clinics) {
      const allClinicIds = allClinicsQueryResult?.data?.clinics?.map(
        (clinic) => clinic.id,
      );
      const filteredArr = locationArr.filter((item) =>
        allClinicIds.includes(item.toString()),
      );
      setLocationArr(filteredArr.map((item) => item.toString()));
    }
  }, [allClinicsQueryResult?.data?.clinics]);
  const globalIdsResults = useQueryHook(
    ["globalIds", locationArr],
    globalIdsQuery,
    {
      // recordClinic: isAdmin
      //   ? allClinicsQueryResult?.data?.clinics?.map((clinic) => clinic?.id)
      //   : session?.locationIds,
      recordClinic: allClinicsQueryResult?.data?.clinics?.map(
        (clinic) => clinic?.id,
      ),
    },
    { enabled: locationArr?.length > 0 && allClinicsQueryResult?.isSuccess },
  );
  const clinlogNotesQueryResult = useQueryHook(
    ["clinlogNotesQueryResult"],
    clinlogNotesQuery,
    {},
    { enabled: !!session },
  );
  const {
    data: clinlogDataInfinite,
    fetchNextPage,
    isLoading,
    hasNextPage,
    isFetching,
  } = useInfiniteQuery(
    ["clinlogData", "infinite"],
    async ({ pageParam = 0 }) => {
      // First page gets 20 items (covers page 1 & 2), subsequent pages get 10

      const limit = 100;

      const res = await getData(
        clinlogDataQuery,
        {
          id:
            globalIdsResults?.data?.entries
              ?.map((record) =>
                record?.attachedRecordsEntry?.map((entry) => entry.id),
              )
              .flat() || [],
          offset: pageParam,
          limit: limit,

          userId: session?.userId,
        },
        session?.accessToken,
      );
      return res;
    },
    {
      getNextPageParam: (lastPage, allPages) => {
        if (lastPage?.entries?.length === 0) {
          return undefined;
        }

        return allPages.length * 100;
      },
      enabled:
        locationArr?.length > 0 &&
        globalIdsResults?.isSuccess &&
        clinlogNotesQueryResult?.isSuccess,
    },
  );

  const clinlogDataQueryResults = useMemo(() => {
    //if (!clinlogDataInfinite) return [];

    //fetchNextPage();
    const allPages = clinlogDataInfinite?.pages.flat();
    return allPages?.map((p) => p.entries)?.flat() ?? [];
  }, [clinlogDataInfinite?.pages?.length]);

  // const clinlogDataQueryResults = useQueryHook(
  //   ["clinlogDataQueryResults", "all"],
  //   clinlogDataQuery,
  //   {
  //     id:
  //       globalIdsResults?.data?.entries
  //         ?.map((record) =>
  //           record?.attachedRecordsEntry?.map((entry) => entry.id)
  //         )
  //         .flat() || [],
  //     limit: 100,
  //     offset: 0,
  //   },
  //   { enabled: globalIdsResults?.isSuccess }
  // );
  // const surgeonOptions = useMemo(() => {
  //   return [
  //     ...new Set(
  //       clinlogDataQueryResults?.data?.entries
  //         ?.map(
  //           (record) =>
  //             record["recordTreatmentSurgeons"]?.map(
  //               (surgeon) => surgeon.fullName
  //             ) // Extract the IDs of the surgeons
  //         )
  //         .flat()
  //     ),
  //   ]?.filter((surgeon) => surgeon !== null && surgeon !== undefined);
  // }, [clinlogDataQueryResults?.data?.entries]);
  const surgeonOptions = useMemo(() => {
    return [
      ...new Set(
        clinlogDataQueryResults
          ?.map(
            (record) =>
              record["recordTreatmentSurgeons"]?.map(
                (surgeon) => surgeon.fullName,
              ), // Extract the IDs of the surgeons
          )
          .flat(),
      ),
    ]?.filter((surgeon) => surgeon !== null && surgeon !== undefined);
  }, [clinlogDataQueryResults]);

  const implantLineOptions = useMemo(() => {
    return [
      ...new Set(
        clinlogDataQueryResults
          ?.map((record) => {
            const allSites =
              record.attachedDentalCharts?.[0]?.proposedTreatmentToothMatrix?.filter(
                (site) => site.treatmentItemNumber === "688",
              );
            return allSites?.map(
              (site) =>
                site.attachedSiteSpecificRecords?.[0]
                  ?.itemSpecificationMatrix?.[0]?.implantLine,
            );
          })
          .flat(),
      ),
      ,
      "Not Recorded",
    ]?.filter(
      (implantLine) => implantLine !== null && implantLine !== undefined,
    );
  }, [clinlogDataQueryResults]);

  const selectCustomStyle: StylesConfig = {
    menu: (styles) => ({
      ...styles,
      fontSize: "13px",
      zIndex: 100002,
    }),
    control: (styles, state) => ({
      ...styles,
      borderRadius: "6px",
      borderColor: "gray.400",
    }),
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
      return {
        ...styles,
        fontSize: "13px",
      };
    },
    input: (styles) => ({
      ...styles,
      fontSize: "13px",
    }),
    placeholder: (styles) => ({
      ...styles,
      fontSize: "13px",
      color: "#767676",
    }),
    singleValue: (styles, { data }) => ({
      ...styles,
      fontSize: "13px",
    }),
  };
  const [xaxis, setXaxis] = useState([]);
  const getMonths = (num) => {
    const xaxisMonths = [];
    const months = [];
    const today = new Date();

    for (let i = 0; i < num; i++) {
      const month = subMonths(today, i);
      xaxisMonths.push(format(month, "MMM yyyy"));
      const monthYear = format(month, "MMM yyyy");
      months.push(monthYear);
    }
    setXaxis(xaxisMonths.reverse());
    //return months.reverse();
  };
  useEffect(() => {
    getMonths(12);
  }, []);
  useEffect(() => {
    if (isBase) {
      setOpenMenu(false);
    } else {
      setOpenMenu(true);
    }
  }, [isBase]);
  const [pagination, setPagination] = useState({
    pageSize: 8,
    pageIndex: 0,
  });
  const [globalFilter, setGlobalFilter] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({
    caseNumber: false,
    patientName: true,
    fullName: false,
    status: true,
    images: true,
    recordTreatmentDate: true,
    tools: true,
    sex: false,
    ageAtTimeOfSurgery: false,
    archType: false,
    treatmentTitle: false,
    edentulous: false,
    treatmentPlannedBy: false,
    diabetesAndOsteoporosis: false,
    oestrogen: false,
    smoking: false,
    alcohol: false,
    oralHygiene: false,
    bruxism: false,
    diagnosisOrAetiology: false,
    upperArchCondition: false,
    lowerArchCondition: false,
    zygomaImplants: false,
    regularImplants: false,
    totalImplants: false,
    immediateRestoration: false,
    dateOfInsertion: false,
    timeFromSurgery: false,
    immediateFunctionSpeech: false,
    immediateAesthetics: false,
    examiner: false,
    numberOfReviews: true,
    numberOfRestorativeBreakages: false,
    examinerRadiographic: false,
    zirconiaUpgrade: false,
    dateOfFollowUp: false,
    smokingAtFollowUp: false,
    hygieneAtFollowUp: false,
    performanceOverFollowUpPeriod: false,
    toothValue: false,
    implantBrand: false,
    implantType: false,
    implantLength: false,
    angleCorrectionAbutment: false,
    placement: false,
    trabecularBoneDensity: false,
    boneVascularity: false,
    graftingApplied: false,
    graftMaterial: false,
    intraOperativeSinusComplications: false,
    crestalRest: false,
    insertionTorque: false,
    relevantBoneWidth: false,
    preOperativeSinusDisease: false,
    conformanceWithTreatmentPlan: false,
    preOperativeSinusDiseaseManagement: false,
    recordTreatmentSurgeons: true,
    recordClinic: false,
    recordFollowUpDate: false,
    implantFunctionAtFollowUp: false,
    abutmentFunctionAtFollowUp: false,
    sinusitis: false,
    facialSwelling: false,
    inflammation: false,
    pain: false,
    suppuration: false,
    recession: false,
    timeFromSurgery_fs: false,
    midShaftSoftTissueDehiscence: false,
    firstAbutmentLevelComplication: false,
    otherAbutmentLevelComplications: false,
    totalNumberOfAbutmentLevelComplications: false,
    dateOfFirstAbutmentLevelComplication: false,
    firstAbutmentLevelComplicationTimeFromSurgery: false,
    postOperativeSinusDisease: false,
    boneLoss: false,
    surveyDate: false,
    timeFromSurgery_ps: false,
    patientSatisfactionAesthetic: false,
    patientSatisfactionFunction: false,
    patientSatisfactionMaintenance: false,
    patientSatisfactionTreatment: false,
    postOpPain: false,
    smoking_ps: false,
    implantCategory: false,
    implantLine: false,
  });
  const selectTypeFilterFunction = (actualValue, filterValue, condition) => {
    if (condition === "hasAValue" && actualValue) {
      return true;
    }

    if (
      condition === "isEmpty" &&
      (actualValue === "" || actualValue === null || actualValue === undefined)
    ) {
      return true;
    }

    if (condition === "isOneOf") {
      return (
        filterValue.map((val) => val.value).includes(actualValue) ||
        filterValue.some((val) =>
          actualValue?.split(",").includes(val.value?.replaceAll(",", "")),
        )
      );
    }
    if (condition === "isNotOneOf") {
      return !filterValue.map((val) => val.value).includes(actualValue);
    }
    if (condition === "" && filterValue.length === 0) {
      return true;
    }
    return false;
  };
  const numberTypeFilterFunction = (
    actualValue,
    filterValue,
    toValue,
    condition,
  ) => {
    if (condition === "hasAValue" && actualValue) {
      return true;
    }

    if (condition === "isEmpty" && (actualValue === null || actualValue < 0)) {
      return true;
    }

    if (condition === "equals") {
      const value = filterValue?.[0];

      return actualValue === value;
    }
    if (condition === "notEquals") {
      const value = filterValue?.[0];
      return actualValue !== value;
    }
    if (condition === "isGreaterThan") {
      const value = filterValue?.[0];
      return actualValue > value;
    }
    if (condition === "isGreaterThanOrEquals") {
      const value = filterValue?.[0];
      return actualValue >= value;
    }
    if (condition === "isLessThan") {
      const value = filterValue?.[0];
      return actualValue < value;
    }
    if (condition === "isLessThanOrEquals") {
      const value = filterValue?.[0];
      return actualValue <= value;
    }
    if (condition === "isBetween") {
      const fromValue = filterValue?.[0];
      const toValue_ = toValue?.[0];
      return actualValue >= fromValue && actualValue <= toValue_;
    }
    if (condition === "" && filterValue.length === 0) {
      return true;
    }
    return false;
  };

  const dateTypeFilterFunction = (
    actualValue,
    filterValue,
    toValue,
    condition,
  ) => {
    if (condition === "hasAValue" && actualValue) {
      return true;
    }

    if (
      condition === "isEmpty" &&
      (actualValue === "" || actualValue === null)
    ) {
      return true;
    }

    if (condition === "isBefore" && actualValue) {
      const dateValue = filterValue?.[0];

      return isBefore(new Date(actualValue), new Date(dateValue));
    }
    if (condition === "isAfter" && actualValue) {
      const dateValue = filterValue?.[0];
      return isAfter(new Date(actualValue), new Date(dateValue));
    }

    if (
      condition === "isBetween" &&
      filterValue.length > 0 &&
      toValue.length > 0 &&
      actualValue
    ) {
      const dateFromValue = filterValue?.[0];
      const dateToValue = toValue?.[0];
      return (
        isAfter(new Date(actualValue), new Date(dateFromValue)) &&
        isBefore(new Date(actualValue), new Date(dateToValue))
      );
    }
    if (condition === "" && filterValue.length === 0) {
      return true;
    }

    return false;
  };

  const statusCheck = (data) => {
    let status = "noData";
    const generalDetailsStatus = clinlogFilterColumns
      .filter((column) => column.group === "generalDetails")
      ?.map((column) => {
        if (
          data[column.key] !== null &&
          data[column.key] !== undefined &&
          data[column.key] !== ""
        ) {
          return "completed";
        } else {
          return "noData";
        }
      });
    const patientCharStatus = clinlogFilterColumns
      .filter((column) => column.group === "patientCharacteristics")
      ?.map((column) => {
        if (
          data[column.key] !== null &&
          data[column.key] !== undefined &&
          data[column.key] !== ""
        ) {
          return "completed";
        } else {
          return "noData";
        }
      });
    const treatmentCharStatus = clinlogFilterColumns
      .filter((column) => column.group === "treatmentCharacteristics")
      .map((column) => {
        if (
          (data[column.key] !== null &&
            data[column.key] !== undefined &&
            data[column.key] !== "") ||
          column.key === "lowerArchCondition" ||
          column.key === "timeFromSurgery"
        ) {
          return "completed";
        } else {
          return "noData";
        }
      });
    const followUpStatus = clinlogFilterColumns
      .filter((column) => column.group === "followUp")
      ?.map((column) => {
        const followUpData = data?.recordFollowUpMatrix?.[0];
        if (
          (followUpData?.[column.key] !== null &&
            followUpData?.[column.key] !== undefined &&
            followUpData?.[column.key] !== "") ||
          column.key === "timeFromSurgery_fs"
        ) {
          return "completed";
        } else {
          return "noData";
        }
      });
    if (
      patientCharStatus.every((status) => status === "completed") &&
      generalDetailsStatus.every((status) => status === "completed") &&
      treatmentCharStatus.every((status) => status === "completed") &&
      followUpStatus.every((status) => status === "completed")
    ) {
      status = "completed";
    } else {
      status = "inProgress";
    }
    return status;
  };
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const columnHelper = createColumnHelper<any>();
  const columns = useMemo(
    () => [
      {
        accessorKey: "caseNumber",
        id: "caseNumber",
        header: "Case Number",
        cell: (row) => {
          return row.row.original.caseNumber;
        },
      },
      {
        accessorKey: "patientName",
        id: "patientName",
        header: "Patient Name",
        cell: (row) => {
          return `${row.row.original.patientName} (${
            row.row.original.caseNumber || "-"
          })`;
        },
        filterFn: (row, columnId, filterValue) => {
          const patientName = `${row.original.patientName} (${
            row.original.caseNumber || "-"
          })`;

          return patientName.toLowerCase().includes(filterValue.toLowerCase());
        },
      },
      {
        accessorKey: "fullName",
        id: "fullName",
        header: "Full Name",
        cell: (row) => {
          return (
            row.row.original.recordFirstName +
            " " +
            row.row.original.recordLastName
          );
        },
      },
      {
        id: "status",
        header: "Data Status",
        cell: (row) => {
          const status = statusCheck(row.row.original);
          return (
            <Flex w="100%" align={"center"} justify={"center"}>
              <Box
                w="12px"
                h="12px"
                borderRadius={"full"}
                bgColor={
                  status === "completed"
                    ? "#4ADE80"
                    : status === "inProgress"
                      ? "orange.400"
                      : "red.400"
                }
              ></Box>
            </Flex>
          );
        },
      },
      // {
      //   id: "images",
      //   header: "Images",
      //   cell: (row) => {
      //     return (
      //       <Box
      //         w="15px"
      //         h="15px"
      //         borderRadius={"full"}
      //         bgColor={"green.400"}
      //       ></Box>
      //     );
      //   },
      // },
      {
        accessorKey: "recordTreatmentDate",
        id: "recordTreatmentDate",
        header: "Surgery Date",

        cell: (row) => {
          const chartData = row?.row?.original?.attachedDentalCharts?.[0];

          const cellValue = chartData?.recordTreatmentDate
            ? format(new Date(chartData?.recordTreatmentDate), "yyyy-MM-dd")
            : row?.row.original?.recordTreatmentDate
              ? format(
                  new Date(row?.row.original?.recordTreatmentDate),
                  "yyyy-MM-dd",
                )
              : "N/A";
          return cellValue;
        },
      },
      {
        accessorKey: "recordTreatmentSurgeons",
        id: "recordTreatmentSurgeons",
        header: "Surgeon",
        cell: (row) => {
          if (row.row.original.recordTreatmentSurgeons?.length > 0) {
            return (
              <Flex flexDirection={"column"} gap="0.1rem" w="100%">
                {row.row.original.recordTreatmentSurgeons?.map((surgeon, i) => (
                  <Text key={i} w="70%">
                    Dr. {surgeon.fullName}
                  </Text>
                )) || "N/A"}
              </Flex>
            );
          } else {
            return (
              <Flex flexDirection={"column"} gap="0.1rem" w="100%">
                {row.row.original.attachedDentalCharts?.[0]?.defaultDentist?.map(
                  (surgeon, i) => (
                    <Text key={i} w="70%">
                      Dr. {surgeon.fullName}
                    </Text>
                  ),
                ) || "N/A"}
              </Flex>
            );
          }
        },
      },
      // {
      //   id: "tools",
      //   header: "Tools",
      //   cell: (row) => {
      //     return (
      //       <Button bg="none" _hover={{ bg: "none" }}>
      //         <chakra.span
      //           fontSize={{ base: "18px", md: "22px" }}
      //           className="material-symbols-outlined"
      //           color={"#007AFF"}
      //         >
      //           delete
      //         </chakra.span>
      //       </Button>
      //     );
      //   },
      // },
      {
        id: "sex",
        accessorKey: "sex",
        header: "Gender",
        cell: (row) => {
          return row.row.original.sex;
        },
        // filterFn: (row, columnId, filterValue) => {
        //   const gender = row.original.sex;
        //   return selectTypeFilterFunction(
        //     gender,
        //     filterValue?.value,
        //     filterValue?.condition
        //   );
        // },
      },
      {
        id: "ageAtTimeOfSurgery",
        accessorKey: "ageAtTimeOfSurgery",
        header: "Age At Time Of Surgery",
        cell: (row) => {
          return row.row.original.ageAtTimeOfSurgery;
        },
        filterFn: (row, columnId, filterValue) => {
          const age = row.original.ageAtTimeOfSurgery
            ? Number(row.original.ageAtTimeOfSurgery)
            : null;
          return numberTypeFilterFunction(
            age,
            filterValue?.value,
            filterValue?.toValue,
            filterValue?.condition,
          );
        },
      },
      {
        header: "Arch Type",
        accessorKey: "archType",
        id: "archType",
        cell: (row) => {
          return row.row.original.archType.toUpperCase();
        },
        filterFn: (row, columnId, filterValue) => {
          const archType = row.original.archType;
          return selectTypeFilterFunction(
            archType,
            filterValue?.value,
            filterValue?.condition,
          );
        },
      },
      {
        id: "treatmentTitle",
        accessorKey: "treatmentTitle",
        header: "Treatment",
        cell: (row) => {
          return row.row.original.treatmentTitle;
        },
        filterFn: (row, columnId, filterValue) => {
          const treatment = row.original.treatmentTitle;
          return selectTypeFilterFunction(
            treatment,
            filterValue?.value,
            filterValue?.condition,
          );
        },
      },
      {
        id: "edentulous",
        accessorKey: "edentulous",
        header: "Edentulous",
        cell: (row) => {
          return row.row.original.edentulous;
        },
        filterFn: (row, columnId, filterValue) => {
          const edentulous = row.original.edentulous;
          return selectTypeFilterFunction(
            edentulous,
            filterValue?.value,
            filterValue?.condition,
          );
        },
      },

      {
        id: "treatmentPlannedBy",
        accessorKey: "treatmentPlannedBy",
        header: "Treatment Planned By",
        cell: (row) => {
          return row.row.original.treatmentPlannedBy;
        },
        filterFn: (row, columnId, filterValue) => {
          const treatmentPlannedBy = row.original.treatmentPlannedBy;
          return selectTypeFilterFunction(
            treatmentPlannedBy,
            filterValue?.value,
            filterValue?.condition,
          );
        },
      },
      {
        id: "diabetesAndOsteoporosis",
        accessorKey: "diabetesAndOsteoporosis",
        header: "Diabetes & Osteoporosis",
        cell: (row) => {
          return row.row.original.diabetesAndOsteoporosis;
        },
        filterFn: (row, columnId, filterValue) => {
          const diabetesAndOsteoporosis = row.original.diabetesAndOsteoporosis;
          return selectTypeFilterFunction(
            diabetesAndOsteoporosis,
            filterValue?.value,
            filterValue?.condition,
          );
        },
      },
      {
        id: "oestrogen",
        accessorKey: "oestrogen",
        header: "Oestrogen",
        cell: (row) => {
          return row.row.original.oestrogen?.toUpperCase();
        },
        filterFn: (row, columnId, filterValue) => {
          const oestrogen = row.original.oestrogen;
          return selectTypeFilterFunction(
            oestrogen,
            filterValue?.value,
            filterValue?.condition,
          );
        },
      },
      {
        id: "smoking",
        accessorKey: "smoking",
        header: "Smoking",
        cell: (row) => {
          return row.row.original.smoking;
        },
        filterFn: (row, columnId, filterValue) => {
          const smoking = row.original.smoking;
          return selectTypeFilterFunction(
            smoking,
            filterValue?.value,
            filterValue?.condition,
          );
        },
      },
      {
        id: "alcohol",
        accessorKey: "alcohol",
        header: "Alcohol",
        cell: (row) => {
          return row.row.original.alcohol;
        },
        filterFn: (row, columnId, filterValue) => {
          const alcohol = row.original.alcohol;
          return selectTypeFilterFunction(
            alcohol,
            filterValue?.value,
            filterValue?.condition,
          );
        },
      },
      {
        id: "oralHygiene",
        accessorKey: "oralHygiene",
        header: "Oral Hygiene",
        cell: (row) => {
          return row.row.original.oralHygiene;
        },
        filterFn: (row, columnId, filterValue) => {
          const oralHygiene = row.original.oralHygiene;
          return selectTypeFilterFunction(
            oralHygiene,
            filterValue?.value,
            filterValue?.condition,
          );
        },
      },
      {
        id: "bruxism",
        accessorKey: "bruxism",
        header: "Bruxism",
        cell: (row) => {
          return row.row.original.bruxism;
        },
        filterFn: (row, columnId, filterValue) => {
          const bruxism = row.original.bruxism;
          return selectTypeFilterFunction(
            bruxism,
            filterValue?.value,
            filterValue?.condition,
          );
        },
      },
      {
        id: "diagnosisOrAetiology",
        accessorKey: "diagnosisOrAetiology",
        header: "Diagnosis Or Aetiology",
        cell: (row) => {
          return row.row.original.diagnosisOrAetiology;
        },
        filterFn: (row, columnId, filterValue) => {
          const diagnosisOrAetiology = row.original.diagnosisOrAetiology;
          return selectTypeFilterFunction(
            diagnosisOrAetiology,
            filterValue?.value,
            filterValue?.condition,
          );
        },
      },
      {
        id: "upperArchCondition",
        accessorKey: "upperArchCondition",
        header: "Upper Arch Condition",
        cell: (row) => {
          return row.row.original.upperArchCondition;
        },
        filterFn: (row, columnId, filterValue) => {
          const upperArchCondition = row.original.upperArchCondition;
          return selectTypeFilterFunction(
            upperArchCondition,
            filterValue?.value,
            filterValue?.condition,
          );
        },
      },
      {
        id: "lowerArchCondition",
        accessorKey: "lowerArchCondition",
        header: "Opposing Arch Condition",
        cell: (row) => {
          return row.row.original.lowerArchCondition;
        },
        filterFn: (row, columnId, filterValue) => {
          const lowerArchCondition = row.original.lowerArchCondition;
          return selectTypeFilterFunction(
            lowerArchCondition,
            filterValue?.value,
            filterValue?.condition,
          );
        },
      },
      {
        id: "zygomaImplants",
        accessorKey: "zygomaImplants",
        header: "Zygoma Implants",
        cell: (row) => {
          return row.row.original.zygomaImplants;
        },
        filterFn: (row, columnId, filterValue) => {
          const zygomaImplants = Number(row.original.zygomaImplants);

          return numberTypeFilterFunction(
            zygomaImplants,
            filterValue?.value,
            filterValue?.toValue,
            filterValue?.condition,
          );
        },
      },
      {
        id: "regularImplants",
        accessorKey: "regularImplants",
        header: "Regular Implants",
        cell: (row) => {
          return row.row.original.regularImplants;
        },
        filterFn: (row, columnId, filterValue) => {
          const regularImplants = Number(row.original.regularImplants);

          return numberTypeFilterFunction(
            regularImplants,
            filterValue?.value,
            filterValue?.toValue,
            filterValue?.condition,
          );
        },
      },
      {
        id: "totalImplants",
        accessorKey: "totalImplants",
        header: "Total Implants",
        cell: (row) => {
          const zygomaImplants = Number(row.row.original.zygomaImplants) || 0;
          const regularImplants = Number(row.row.original.regularImplants) || 0;
          return zygomaImplants + regularImplants;
        },
      },
      {
        id: "immediateRestoration",
        accessorKey: "immediateRestoration",
        header: "Immediate Restoration",
        cell: (row) => {
          return row.row.original.immediateRestoration;
        },
        filterFn: (row, columnId, filterValue) => {
          const immediateRestoration = row.original.immediateRestoration;
          return selectTypeFilterFunction(
            immediateRestoration,
            filterValue?.value,
            filterValue?.condition,
          );
        },
      },
      {
        id: "dateOfInsertion",
        accessorKey: "dateOfInsertion",
        header: "Date Of Insertion",
        cell: (row) => {
          const cellValue = row?.row.original?.dateOfInsertion
            ? format(new Date(row?.row.original?.dateOfInsertion), "yyyy-MM-dd")
            : "N/A";
          return cellValue;
        },
        filterFn: (row, columnId, filterValue) => {
          const dateOfInsertion = row.original.dateOfInsertion
            ? format(new Date(row.original.dateOfInsertion), "yyyy-MM-dd")
            : null;
          return dateTypeFilterFunction(
            dateOfInsertion,
            filterValue?.value,
            filterValue?.toValue,
            filterValue?.condition,
          );
        },
      },
      {
        id: "timeFromSurgery",
        accessorKey: "timeFromSurgery",
        header: "Time from Surgery to Insertion (days)",
        cell: (row) => {
          const chartData = row?.row?.original?.attachedDentalCharts?.[0];
          const surgeryDate =
            chartData?.recordTreatmentDate ||
            row?.row.original?.recordTreatmentDate;

          const timeDiff =
            row.row.original.dateOfInsertion && surgeryDate
              ? differenceInDays(
                  new Date(
                    format(
                      new Date(row.row.original.dateOfInsertion),
                      "yyyy-MM-dd",
                    ),
                  ),
                  new Date(format(new Date(surgeryDate), "yyyy-MM-dd")),
                )
              : null;

          return timeDiff > 0 ? timeDiff : "";
        },
        filterFn: (row, columnId, filterValue) => {
          const chartData = row?.original?.attachedDentalCharts?.[0];
          const surgeryDate =
            chartData?.recordTreatmentDate || row.original?.recordTreatmentDate;
          const timeDiff =
            row.original.dateOfInsertion && surgeryDate
              ? differenceInDays(
                  new Date(
                    format(
                      new Date(row.original.dateOfInsertion),
                      "yyyy-MM-dd",
                    ),
                  ),
                  new Date(format(new Date(surgeryDate), "yyyy-MM-dd")),
                )
              : null;

          return numberTypeFilterFunction(
            timeDiff > 0 ? timeDiff : null,
            filterValue?.value,
            filterValue?.toValue,
            filterValue?.condition,
          );
        },
      },
      {
        id: "immediateFunctionSpeech",
        accessorKey: "immediateFunctionSpeech",
        header: "Immediate Function Speech",
        cell: (row) => {
          return row.row.original.immediateFunctionSpeech;
        },
        filterFn: (row, columnId, filterValue) => {
          const immediateFunctionSpeech = row.original.immediateFunctionSpeech;
          return selectTypeFilterFunction(
            immediateFunctionSpeech,
            filterValue?.value,
            filterValue?.condition,
          );
        },
      },
      {
        id: "immediateAesthetics",
        accessorKey: "immediateAesthetics",
        header: "Immediate Aesthetics",
        cell: (row) => {
          return row.row.original.immediateAesthetics;
        },
        filterFn: (row, columnId, filterValue) => {
          const immediateAesthetics = row.original.immediateAesthetics;
          return selectTypeFilterFunction(
            immediateAesthetics,
            filterValue?.value,
            filterValue?.condition,
          );
        },
      },
      {
        id: "recordClinic",
        accessorKey: "recordClinic",
        header: "Location",
        cell: (row) => {
          return row?.row?.original?.recordClinic
            ?.map((clinic) => clinic?.locationShortName)
            .join(", ");
        },
        filterFn: (row, columnId, filterValue) => {
          const recordClinic = row.original.recordClinic
            ?.map((clinic) => clinic.id)
            .join(", ");

          return selectTypeFilterFunction(
            recordClinic,
            filterValue?.value,
            filterValue?.condition,
          );
        },
      },
      ...clinlogFilterColumns
        .filter((column) =>
          ["followUp", "siteSpecificCharacteristics", "patientSurvey"].includes(
            column.group,
          ),
        )
        ?.map((column) => ({
          id: `${column.key}`,
          accessorKey: `${column.key}_${column.group}`,
          header:
            column.key === "dateOfFollowUp" ? "Date Of FollowUp" : column.label,
          cell: (row) => {
            if (column.group === "followUp") {
              const followUpData = row.row.original.recordFollowUpMatrix?.[0];
              if (column.key === "numberOfReviews") {
                return (
                  followUpData?.[column.key] ||
                  row.row.original.recordFollowUpMatrix?.length
                );
              }
              if (column.key === "dateOfFollowUp") {
                return followUpData?.[column.key]
                  ? format(new Date(followUpData?.[column.key]), "yyyy-MM-dd")
                  : "N/A";
              }
              return followUpData?.[column.key?.split("_")?.[0]] || "N/A";
            } else if (column.group === "siteSpecificCharacteristics") {
              const siteDetails =
                row.row.original.attachedDentalCharts?.[0]?.proposedTreatmentToothMatrix?.filter(
                  (site) => site.treatmentItemNumber === "688",
                );

              const siteSpecificData = siteDetails?.map((site) => {
                if (column.key === "toothValue") {
                  return site.toothValue;
                } else if (column?.subGroup === "ssFollowUp") {
                  const siteFollowUpRecords =
                    site?.attachedSiteSpecificRecords?.[0]
                      ?.attachedSiteSpecificFollowUp?.[0];

                  return siteFollowUpRecords?.[column.key] || "-";
                } else if (column.key === "implantCategory") {
                  const implantCategory =
                    site?.attachedSiteSpecificRecords?.[0]
                      ?.itemSpecificationMatrix?.[0]?.implantCategoryLabel;
                  return implantCategory || "-";
                }
                return site.attachedSiteSpecificRecords?.[0]
                  ?.itemSpecificationMatrix?.[0]?.[column.key];
              });

              return siteSpecificData?.map((data) => {
                return <Tr>{data || "-"}</Tr>;
              });
            } else if (column.group === "patientSurvey") {
              const patientSurveyData =
                clinlogNotesQueryResult?.data?.recordNotes?.find((note) => {
                  return (
                    note?.recordNoteRecord?.[0]?.id === row.row.original.id &&
                    note?.attachedSurveyForm?.length > 0
                  );
                })?.attachedSurveyForm?.[0]?.patientSurveyMatrix?.[0];
              if (column.type === "date") {
                return patientSurveyData?.[column.key]
                  ? format(
                      new Date(patientSurveyData?.[column.key]),
                      "dd-MM-yyyy",
                    )
                  : "";
              }

              return patientSurveyData?.[column.key?.split("_")?.[0]] || "";
            }
            return "";
          },
          enableSorting: false,
          enableHiding: true,
          filterFn: (row, columnId, filterValue) => {
            let cellValue = "";
            if (column.group === "followUp") {
              const followUpData = row.original.recordFollowUpMatrix?.[0];
              cellValue = followUpData[column.key];
            } else if (column.group === "siteSpecificCharacteristics") {
              const siteDetails =
                row.original.attachedDentalCharts?.[0]?.proposedTreatmentToothMatrix?.filter(
                  (site) => site.treatmentItemNumber === "688",
                );
              const siteSpecificData = siteDetails?.map((site) => {
                if (column.key === "toothValue") {
                  return site.toothValue;
                } else if (column?.subGroup === "ssFollowUp") {
                  const siteFollowUpRecords =
                    site?.attachedSiteSpecificRecords?.[0]
                      ?.attachedSiteSpecificFollowUp?.[0];

                  return siteFollowUpRecords?.[column.key];
                }
                return site.attachedSiteSpecificRecords?.[0]
                  ?.itemSpecificationMatrix?.[0]?.[column.key];
              });
              cellValue = siteSpecificData.join(",");
            }

            if (column.type === "select") {
              return selectTypeFilterFunction(
                cellValue,
                filterValue?.value,
                filterValue?.condition,
              );
            } else if (column.type === "number") {
              return numberTypeFilterFunction(
                Number(cellValue) || null,
                filterValue?.value,
                filterValue?.toValue,
                filterValue?.condition,
              );
            } else {
              return true;
            }
          },
        })),
    ],
    [clinlogNotesQueryResult?.data],
  );
  function evaluateConditions(conditions) {
    if (!conditions.length) return true;

    let result = conditions[0]?.isTrue;
    if (conditions.length === 1) return result;
    for (let i = 1; i < conditions.length; i++) {
      const operation = conditions[i - 1].operation;

      const isTrue = conditions[i].isTrue;

      if (operation.toLowerCase() === "and") {
        result = result && isTrue;
      } else if (operation.toLowerCase() === "or") {
        result = result || isTrue;
      } else {
        // throw new Error(`Unknown operation: ${current.operation}`)
      }
    }

    return result;
  }
  const tableData = useMemo(() => {
    if (clinlogDataQueryResults?.length > 0 && globalIdsResults?.isSuccess) {
      const data = clinlogDataQueryResults?.map((entry) => {
        const globaldata = globalIdsResults.data?.entries?.find((global) => {
          return global.attachedRecordsEntry?.some(
            (record) => record.id === entry.id,
          );
        });
        return {
          ...entry,
          globalId: globaldata?.id,
          patientName: globaldata?.patientShortName,
        };
      });
      return data;
    }
    return [];
  }, [clinlogDataQueryResults, globalIdsResults?.data?.entries]);
  const globalFilterFunction = (row, columnId, filters) => {
    const conditionChecks = filters.map((filter) => {
      const filterValue = filter.value.value;
      const condition = filter.value.condition;
      const filterColumnId = filter.id;
      const group = clinlogFilterColumns.find(
        (column) => column.key === filterColumnId,
      )?.group;
      const subGroup = clinlogFilterColumns.find(
        (column) => column.key === filterColumnId,
      )?.subGroup;
      const type = clinlogFilterColumns.find(
        (column) => column.key === filterColumnId,
      )?.type;
      let cellValue: any;
      if (group === "followUp") {
        const followUpData = row.original.recordFollowUpMatrix?.[0];
        if (filterColumnId === "numberOfReviews") {
          cellValue =
            followUpData?.[filterColumnId] ||
            row.original?.recordFollowUpMatrix?.length;
        } else {
          cellValue = followUpData?.[filterColumnId];
        }
      } else if (group === "siteSpecificCharacteristics") {
        const siteDetails =
          row.original.attachedDentalCharts?.[0]?.proposedTreatmentToothMatrix?.filter(
            (site) => site?.treatmentItemNumber === "688",
          );
        const siteSpecificData = siteDetails?.map((site) => {
          if (filterColumnId === "toothValue") {
            return site.toothValue;
          } else if (subGroup === "ssFollowUp") {
            const siteFollowUpRecords =
              site?.attachedSiteSpecificRecords?.[0]
                ?.attachedSiteSpecificFollowUp?.[0];

            return siteFollowUpRecords?.[filterColumnId]?.replaceAll(",", "");
          }
          return site.attachedSiteSpecificRecords?.[0]?.itemSpecificationMatrix?.[0]?.[
            filterColumnId
          ]?.replaceAll(",", "");
        });
        cellValue = siteSpecificData?.join(",");
      } else if (group === "patientSurvey") {
        const patientSurveyData =
          clinlogNotesQueryResult?.data?.recordNotes?.find((note) => {
            return (
              note?.recordNoteRecord?.[0]?.id === row.original.id &&
              note?.attachedSurveyForm?.length > 0
            );
          })?.attachedSurveyForm?.[0]?.patientSurveyMatrix?.[0];
        cellValue =
          patientSurveyData?.[filterColumnId?.split("_")?.[0]] || null;
      } else {
        if (filterColumnId === "recordTreatmentSurgeons") {
          cellValue =
            row.original?.recordTreatmentSurgeons?.length > 0
              ? row.original?.recordTreatmentSurgeons
                  ?.map((surgeon) => surgeon?.fullName)
                  ?.join(",")
              : row?.original?.attachedDentalCharts?.[0]?.defaultDentist
                  ?.map((surgeon) => surgeon?.fullName)
                  ?.join(",") || null;
        } else if (filterColumnId === "timeFromSurgery") {
          const chartData = row?.original?.attachedDentalCharts?.[0];
          const surgeryDate =
            chartData?.recordTreatmentDate || row.original?.recordTreatmentDate;
          cellValue =
            row.original?.dateOfInsertion && surgeryDate
              ? differenceInDays(
                  new Date(
                    format(
                      new Date(row.original?.dateOfInsertion),
                      "yyyy-MM-dd",
                    ),
                  ),
                  new Date(format(new Date(surgeryDate), "yyyy-MM-dd")),
                )
              : null;
        } else if (filterColumnId === "recordClinic") {
          cellValue =
            row.original.recordClinic?.map((clinic) => clinic.id).join(", ") ||
            null;
        } else if (filterColumnId === "totalImplants") {
          const zygomaImplants = Number(row.original.zygomaImplants) || 0;
          const regularImplants = Number(row.original.regularImplants) || 0;
          cellValue = zygomaImplants + regularImplants;
        } else {
          cellValue = row.original?.[filterColumnId] || null;
        }
      }
      if (type === "select") {
        return {
          operation: filter.value.operation || "AND",
          isTrue: selectTypeFilterFunction(cellValue, filterValue, condition),
        };
      } else if (type === "number") {
        return {
          operation: filter.value.operation || "AND",
          isTrue: numberTypeFilterFunction(
            Number(cellValue) || null,
            filterValue,
            filter?.value?.toValue,
            condition,
          ),
        };
      } else if (type === "date") {
        const dateValue = cellValue
          ? format(new Date(cellValue), "yyyy-MM-dd")
          : null;
        return {
          operation: filter.value.operation || "AND",
          isTrue: dateTypeFilterFunction(
            dateValue,
            filterValue,
            filter?.value?.toValue,
            condition,
          ),
        };
      }
    });

    return evaluateConditions(conditionChecks);
  };

  const table = useReactTable({
    data: tableData,
    columns,
    state: {
      globalFilter,
      columnFilters,
      columnVisibility,
      pagination,
      sorting,
    },
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: globalFilterFunction,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
  });

  const handleFilter = (arrowClicked: string) => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    if (arrowClicked === "left") {
      let numOfPagesfiltered = Math.ceil(
        table.getFilteredRowModel().rows.length / 30,
      );
      //setPageCount(numOfPagesfiltered);
    } else if (arrowClicked === "right") {
      let numOfPagesfiltered = Math.ceil(
        table.getFilteredRowModel().rows.length / 30,
      );
      //setPageCount(numOfPagesfiltered);
    }
  };

  useEffect(() => {
    if (filterArray.length === 0 || filterArray[0].group === "") {
      setGlobalFilter([]);
    }
  }, [filterArray]);
  const slide = keyframes`
  0% { transform: translateX(-50%); }
  100% { transform: translateX(50%); }
`;
  const fadeInSlide = keyframes`
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`;
  const tabsList = [
    { name: "allCases", label: "All Cases" },
    { name: "dataTool", label: "Data Tool" },
    //  { name: "implants", label: "Implants" },
  ];
  //const animation = `${fadeInSlide} 2s ease-in-out infinite`;

  const InitialLoader = () => {
    return (
      <Flex
        zIndex={99999999999999}
        align="center"
        justify="center"
        position="absolute"
        top="0px"
        left="0px"
        w="100vw"
        h="100vh"
        //h="80%"
        //minHeight={"50vh"}
        p="4"
        bgColor="#FCF8FF"
      >
        <Lottie
          animationData={animationData}
          loop={true}
          autoplay={true}
          style={{ width: 100, height: 100 }}
        />
      </Flex>
    );
  };
  const selectedGlobalPatientData = useMemo(() => {
    if (viewPatient && globalIdsResults?.isSuccess) {
      const patientData = globalIdsResults?.data?.entries?.find((entry) => {
        const records = entry?.attachedRecordsEntry?.map(
          (record) => record?.id,
        );
        return records?.includes(viewPatient?.id);
      });
      return patientData;
    }
    return null;
  }, [viewPatient, globalIdsResults?.data?.entries]);
  const selectedPatientNotes = useMemo(() => {
    if (viewPatient && clinlogNotesQueryResult?.isSuccess) {
      const notes = clinlogNotesQueryResult.data?.recordNotes?.filter(
        (note) =>
          note.recordNoteRecord?.[0]?.id?.toString() ===
          viewPatient?.id?.toString(),
      );
      return notes;
    }
    return [];
  }, [viewPatient, clinlogNotesQueryResult?.data?.recordNotes]);

  const addClinlogNotesMutationFunction = useMutation(
    (newData: any) => sendData(clinlogNoteMutation, newData),
    {
      onMutate: () => {
        toastIdRef.current = toast({
          render: () => (
            <Flex
              justify="space-around"
              color="white"
              p={3}
              bg="blue.500"
              borderRadius="6px"
            >
              Adding Note...
              <Spinner color="white" />
            </Flex>
          ),
          duration: 2000,
          isClosable: true,
        });
      },
      onError: (err) => {
        toast.update(toastIdRef.current, {
          description: "Error Adding Note",
          status: "error",
          duration: 2000,
          isClosable: true,
        });
      },
      onSuccess: () => {
        toast.update(toastIdRef.current, {
          description: "Successfully Added Note",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      },
      onSettled: () => {
        onClose();
        setNewNote("");
        queryClient.invalidateQueries(["clinlogNotesQueryResult"]);
      },
    },
  );
  const handleAddNote = () => {
    const notesData = {
      recordNoteRecord: Number(viewPatient?.id),
      recordNoteNote: newNote,
      title: `Clinlog Notes - ${viewPatient?.patientName}`,
    };
    addClinlogNotesMutationFunction.mutate(notesData);
  };
  useEffect(() => {
    if (hasNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, clinlogDataInfinite]);
  return clinlogDataQueryResults?.length === 0 ? (
    <Flex h="100vh" w="100%" bgColor="#FCF8FF">
      <InitialLoader />
    </Flex>
  ) : (
    <Flex w="100%" flexDirection={"column"} bgColor="#FCF8FF" minH="100vh">
      <Flex
        w="100%"
        flexDirection={"column"}
        position={"sticky"}
        top="0"
        zIndex={"99"}
      >
        <Flex
          w="100%"
          bgColor="white"
          align="center"
          justify={"center"}
          position="sticky"
          p="2"
        >
          <Flex w="100%" align="start" py="10px" maxW="2000px" mx="auto">
            <Tabs
              variant="unstyled"
              w="100%"
              align={"start"}
              orientation={isBase ? "vertical" : "horizontal"}
            >
              <TabList
                w="100%"
                gap="8px"
                fontWeight="500"
                fontFamily="inter"
                color="#333333"
                bg="transparent"
                border="none"
              >
                {tabsList.map((tab, index) => (
                  <Tab
                    key={index}
                    fontSize={{ base: "12px", md: "11px", lg: "13px" }}
                    display={
                      isBase && openTab !== tab.name
                        ? collapseTabs
                          ? "none"
                          : "block"
                        : "block"
                    }
                    px={{ base: "16px", md: "20px", lg: "24px" }}
                    py="10px"
                    textTransform={"none"}
                    borderRadius="full"
                    color={openTab === tab.name ? "white" : "black"}
                    bgGradient={
                      openTab === tab.name
                        ? "linear-gradient(90deg, var(--clinlog-purple, #452A7E) 25%, #612ECC 100%)"
                        : undefined
                    }
                    bgColor={openTab === tab.name ? undefined : "#F5F5F5"}
                    fontWeight={openTab === tab.name ? "600" : "500"}
                    _hover={{
                      bgColor: openTab === tab.name ? undefined : "#E5E5E5",
                    }}
                    transition="all 0.2s"
                    onClick={() => {
                      setOpenTab(tab.name);
                      // if (collapseTabs) {
                      //   setCollapseTabs(!collapseTabs);
                      // }
                    }}
                    border="none"
                  >
                    <Flex align={"center"} gap="8px">
                      {/* <chakra.span
                        className="material-symbols-outlined"
                        fontSize="18px"
                        style={{
                          color: openTab === tab.name ? "#00D4FF" : "black",
                          fill: openTab === tab.name ? "#00D4FF" : "black",
                        }}
                      >
                        {tab.icon}
                      </chakra.span> */}
                      <Text
                        fontFamily={"inter"}
                        letterSpacing={"0px"}
                        fontWeight={openTab === tab.name ? "600" : "500"}
                        color={openTab === tab.name ? "white" : "black"}
                      >
                        {tab.label}
                      </Text>
                      <Spacer display={{ base: "block", md: "none" }} />
                      {/* <ChevronDownIcon
                        fontSize="28px"
                        display={
                          isBase && openTab === tab.name
                            ? "block"
                            : isBase && index === 0
                              ? "block"
                              : "none"
                        }
                      /> */}
                    </Flex>
                  </Tab>
                ))}
              </TabList>
            </Tabs>
            {hasNextPage && (
              <Flex align="center" mt="2" gap={"1rem"} w="15%">
                <Spinner size="sm" color="#351361" />
                <Text fontSize={"14px"} fontWeight="600" color="#351361">
                  Loading more records...
                </Text>
              </Flex>
            )}
          </Flex>
        </Flex>
      </Flex>
      <Flex p="2" w="100%" justify={"center"}>
        {/* {clinlogDataQueryResults.isLoading ? (
          <InitialLoader />
        ) : (
          <> */}
        {openTab === "demographics" && (
          <Flex w="100%" justify="center" ml={4}>
            <ClinlogDemoGraphics
              clinlogRecordDetails={clinlogDataQueryResults}
              xaxis={xaxis}
            />
          </Flex>
        )}
        {openTab === "preSurgical" && (
          <Flex w="100%" justify="center" ml={4}>
            <ClinlogPreSurgical
              clinlogRecordDetails={clinlogDataQueryResults}
            />
          </Flex>
        )}
        {openTab === "postSurgical" && (
          <Flex w="100%" justify="center" ml={4}>
            <ClinlogPostSurgical
              clinlogRecordDetails={clinlogDataQueryResults}
            />
          </Flex>
        )}
        {openTab === "habitsAndRisk" && (
          <Flex w="100%" justify="center" ml={4}>
            <ClinlogHabitsAndRiskFactors
              clinlogRecordDetails={clinlogDataQueryResults}
              filterColumns={clinlogFilterColumns}
            />
          </Flex>
        )}
        {openTab === "allCases" && (
          <Flex
            flexDirection={"column"}
            gap="1rem"
            w="100%"
            maxW={{ base: "100%", lg: "2000px" }}
            align={"center"}
          >
            {viewPatient ? (
              <Flex w="100%" height={"100%"}>
                {" "}
                <Flex direction="column" gap="1rem" w="80%" p="4">
                  <Flex w="100%" gap="0.5rem" align="center">
                    <Flex flexDirection={"column"} gap="0.2rem">
                      <Flex align={"center"} gap="1rem">
                        <chakra.span
                          className="material-symbols-outlined"
                          fontSize="36px"
                          onClick={() => setViewPatient(null)}
                          cursor="pointer"
                        >
                          arrow_circle_left
                        </chakra.span>
                        <Text fontSize={"18px"} fontWeight="700">
                          {`${viewPatient.patientName} (${
                            viewPatient.caseNumber || "-"
                          })`}
                        </Text>
                      </Flex>
                      <Text
                        fontSize="12px"
                        fontWeight={500}
                        //textTransform="uppercase"
                        color="scBlack"
                        letterSpacing={"0.36px"}
                        opacity={0.9}
                      >
                        Stores implant details and related data for clinical
                        records, seamlessly integrating with Clinlog’s analytics
                        for performance and outcome insights.
                      </Text>
                    </Flex>
                    <Spacer />
                    {session?.locationIds?.includes(
                      Number(selectedGlobalPatientData?.recordClinic?.[0]?.id),
                    ) && (
                      <Link
                        as={NextLink}
                        target="_blank"
                        bgColor="scBlack"
                        color={"white"}
                        fontWeight={700}
                        borderRadius={"25px"}
                        _hover={{ bgColor: "scBlack" }}
                        href={`/pagesv2/patientdata?postId=${encryptId(
                          selectedGlobalPatientData?.id?.toString(),
                        )}&entryId=${encryptId(
                          viewPatient?.id?.toString(),
                        )}&tabName=surgical`}
                      >
                        <Flex align="center" p="3">
                          <chakra.span
                            className="material-symbols-outlined"
                            fontSize={"24px"}
                          >
                            account_circle
                          </chakra.span>
                          <Text
                            ml="2"
                            mr="3"
                            fontSize={"12px"}
                            textTransform={"uppercase"}
                          >
                            View Patient
                          </Text>
                        </Flex>
                      </Link>
                    )}
                  </Flex>
                  <SurgicalDetailsV3_2
                    setClinlogStatus={setClinlogStatus}
                    selectedRecord={viewPatient}
                    toastData={{ toast: toast, toastIdRef: toastIdRef }}
                    patientName={`${viewPatient.patientName} (${
                      viewPatient.caseNumber || "-"
                    })`}
                    proposedTreatmentChartResults={
                      viewPatient?.attachedDentalCharts || []
                    }
                    isLoading={isLoading}
                    //@ts-ignore
                    proposedTreatmentChartIds={viewPatient?.attachedDentalCharts?.map(
                      (chart) => chart.id,
                    )}
                    patientDob={
                      viewPatient?.recordPatient?.[0]?.userDateOfBirth ||
                      viewPatient?.recordDateOfBirth
                    }
                    patientGender={
                      viewPatient?.recordPatient?.[0]?.sex || viewPatient?.sex
                    }
                    globalPostId={globalIdsResults?.data?.entries
                      ?.find((entry) => {
                        const records = entry?.attachedRecordsEntry?.map(
                          (record) => record?.id,
                        );
                        return records?.includes(viewPatient.id.toString());
                      })
                      ?.id.toString()}
                    detailsData={globalIdsResults?.data?.entries?.find(
                      (entry) => {
                        const records = entry?.attachedRecordsEntry?.map(
                          (record) => record?.id,
                        );
                        return records?.includes(viewPatient.id.toString());
                      },
                    )}
                    fromClinlog={true}
                  />
                </Flex>
                <Flex direction={"column"} w="20%" p="4" gap="1rem">
                  <Flex
                    flexDirection={"column"}
                    gap="0.5rem"
                    p="4"
                    borderRadius={"6px"}
                    border="1px solid #F7F0F0"
                    bg="white"
                  >
                    <Flex w="100%" justify="space-between" align="center">
                      <Text
                        fontSize={{ base: "12px", md: "13px" }}
                        fontWeight="700"
                      >
                        Marked for attention
                      </Text>
                      <chakra.span
                        className="material-symbols-outlined"
                        fontSize={"28px"}
                      >
                        {selectedGlobalPatientData?.globalIsFlagged
                          ? "toggle_on"
                          : "toggle_off"}
                      </chakra.span>
                    </Flex>
                    <Flex w="100%" justify="space-between" align="center">
                      <Text
                        fontSize={{ base: "12px", md: "13px" }}
                        fontWeight="700"
                      >
                        Included in Analysis{" "}
                      </Text>
                      <chakra.span
                        className="material-symbols-outlined"
                        fontSize={"28px"}
                      >
                        {viewPatient?.enableClinlog
                          ? "toggle_on"
                          : "toggle_off"}
                      </chakra.span>
                    </Flex>
                  </Flex>
                  <Flex
                    flexDirection={"column"}
                    borderRadius={"6px"}
                    border="1px solid #F7F0F0"
                  >
                    <Flex
                      w="100%"
                      p="4"
                      borderRadius={"6px 6px 0px 0px"}
                      background={
                        "linear-gradient(90deg, var(--clinlog-purple, #452A7E) 25%, #612ECC 100%)"
                      }
                    >
                      <Flex flexDirection={"column"} gap="0.2rem" color="white">
                        <Text
                          fontSize={{ base: "10px", md: "11px" }}
                          fontWeight="400"
                          letterSpacing={"0.84px"}
                        >
                          NOTIFICATIONS{" "}
                        </Text>
                        <Text
                          fontSize={{ base: "12px", md: "13px" }}
                          fontWeight="700"
                          letterSpacing={"0.84px"}
                        >
                          CASE HISTORY
                        </Text>
                      </Flex>
                      <Spacer />
                      <Button
                        size="sm"
                        onClick={() => {
                          onOpen();
                        }}
                      >
                        Note
                      </Button>
                    </Flex>
                    <Flex
                      w="100%"
                      p="4"
                      flexDirection={"column"}
                      gap="0.5rem"
                      bg="white"
                      borderRadius={"0px 0px 6px 6px"}
                      h="100%"
                    >
                      {clinlogNotesQueryResult.isLoading ? (
                        <Text>Loading Notes...</Text>
                      ) : selectedPatientNotes.length > 0 ? (
                        selectedPatientNotes?.map((note, index) => (
                          <Flex
                            key={index}
                            w="100%"
                            bg="#FDF7F7"
                            p="4"
                            flexDirection="column"
                            gap="0.2rem"
                          >
                            <Flex>
                              <Text
                                fontSize={{ base: "11px", md: "12px" }}
                                fontWeight="600"
                              >
                                Note Added by {note?.author?.fullName}
                              </Text>
                              <Spacer />
                              <Text fontSize={{ base: "11px", md: "12px" }}>
                                {note?.postDate
                                  ? format(
                                      new Date(note.postDate),
                                      "dd MMM, yyyy",
                                    )
                                  : ""}
                              </Text>
                            </Flex>
                            <Text fontSize={{ base: "11px", md: "12px" }}>
                              {note.recordNoteNote}
                            </Text>
                            {note?.attachedSurveyForm?.length > 0 && (
                              <Button
                                size="xs"
                                bgColor={"#351361"}
                                color="white"
                                onClick={() => {
                                  setPatientSurveyData(
                                    note.attachedSurveyForm?.[0],
                                  );
                                  onSurveyOpen();
                                }}
                              >
                                View Patient Survey
                              </Button>
                            )}
                          </Flex>
                        ))
                      ) : (
                        <Text fontSize={{ base: "11px", md: "12px" }}>
                          No notes available.
                        </Text>
                      )}
                      {/* <Flex
                        w="100%"
                        justify="center"
                        align="center"
                        gap="0.5rem"
                      >
                        <Button
                          size="sm"
                          bg="none"
                          border="1px solid #F5F5F5"
                          disabled={notesPageIndex === 1}
                          onClick={() => {
                            setNotesPageIndex((prev) => prev - 1);
                          }}
                        >
                          {"<"}
                        </Button>
                        <Text
                          fontSize={{ base: "12px", md: "13px" }}
                          fontWeight="600"
                        >
                          {notesPageIndex} of{" "}
                          {Math.ceil(selectedPatientNotes?.length / 5)}
                        </Text>
                        <Button
                          size="sm"
                          size="sm"
                          bg="none"
                          border="1px solid #F5F5F5"
                          disabled={
                            notesPageIndex >
                            Math.ceil(selectedPatientNotes?.length / 5) - 1
                          }
                          onClick={() => {
                            setNotesPageIndex((prev) => prev + 1);
                          }}
                        >
                          {">"}
                        </Button>
                      </Flex> */}
                    </Flex>
                  </Flex>
                  {/* <Flex
                    flexDirection={"column"}
                    borderRadius={"6px"}
                    border="1px solid #F7F0F0"
                    maxH="60%"
                  >
                    <Flex
                      w="100%"
                      p="4"
                      borderRadius={"6px 6px 0px 0px"}
                      background={
                        "linear-gradient(90deg, var(--clinlog-purple, #452A7E) 25%, #612ECC 100%)"
                      }
                    >
                      <Flex flexDirection={"column"} gap="0.2rem" color="white">
                        <Text
                          fontSize={{ base: "10px", md: "11px" }}
                          fontWeight="400"
                          letterSpacing={"0.84px"}
                        >
                          IMAGES{" "}
                        </Text>
                        <Text
                          fontSize={{ base: "12px", md: "13px" }}
                          fontWeight="700"
                          letterSpacing={"0.84px"}
                        >
                          CLINICAL IMAGING
                        </Text>
                      </Flex>
                      <Spacer />
                    </Flex>
                    <Flex
                      w="100%"
                      p="4"
                      flexDirection={"column"}
                      gap="0.5rem"
                      bg="white"
                      borderRadius={"0px 0px 6px 6px"}
                    >
                      <Text
                        fontSize={{ base: "12px", md: "13px" }}
                        fontWeight="600"
                      >
                        Pre-op Imaging
                      </Text>
                      <Flex align={"center"} gap="0.2rem">
                        <chakra.span
                          className="material-symbols-outlined"
                          fontSize={"18px"}
                        >
                          {viewPatient?.preOpPhotos
                            ? "check_box"
                            : "check_box_outline_blank"}{" "}
                        </chakra.span>
                        <Text
                          fontSize={{ base: "13px", md: "14px" }}
                          fontWeight="500"
                        >
                          Photos
                        </Text>
                      </Flex>

                    
                      <Flex align={"center"} gap="0.2rem">
                        <chakra.span
                          className="material-symbols-outlined"
                          fontSize={"18px"}
                        >
                          {viewPatient?.preOpReconstructedOpg
                            ? "check_box"
                            : "check_box_outline_blank"}{" "}
                        </chakra.span>
                        <Text
                          fontSize={{ base: "13px", md: "14px" }}
                          fontWeight="500"
                        >
                          Reconstructed OPG
                        </Text>
                      </Flex>
                      <Text
                        fontSize={{ base: "12px", md: "13px" }}
                        fontWeight="600"
                      >
                        Post-op Imaging
                      </Text>
                      <Flex align={"center"} gap="0.2rem">
                        <chakra.span
                          className="material-symbols-outlined"
                          fontSize={"18px"}
                        >
                          {viewPatient?.postOpPhotos
                            ? "check_box"
                            : "check_box_outline_blank"}{" "}
                        </chakra.span>
                        <Text
                          fontSize={{ base: "13px", md: "14px" }}
                          fontWeight="500"
                        >
                          Photos
                        </Text>
                      </Flex>

                      <Flex align={"center"} gap="0.2rem">
                        <chakra.span
                          className="material-symbols-outlined"
                          fontSize={"18px"}
                        >
                          {viewPatient?.postOp2DOpg
                            ? "check_box"
                            : "check_box_outline_blank"}{" "}
                        </chakra.span>
                        <Text
                          fontSize={{ base: "13px", md: "14px" }}
                          fontWeight="500"
                        >
                          2-D OPG
                        </Text>
                      </Flex>

                      <Flex align={"center"} gap="0.2rem">
                        <chakra.span
                          className="material-symbols-outlined"
                          fontSize={"18px"}
                        >
                          {viewPatient?.postOp3DOpg
                            ? "check_box"
                            : "check_box_outline_blank"}{" "}
                        </chakra.span>
                        <Text
                          fontSize={{ base: "13px", md: "14px" }}
                          fontWeight="500"
                        >
                          3-D CBCT
                        </Text>
                      </Flex>
                      {viewPatient?.isImageIdentifiable && (
                        <>
                          <Flex
                            p="4"
                            bg="#D9D9D9"
                            justify="center"
                            borderRadius="6px"
                            mt="2"
                          >
                            <Text fontSize={{ base: "11px", md: "12px" }}>
                              IMAGES UNAVAILABLE FOR VIEWING
                            </Text>
                          </Flex>
                          <Flex
                            p="4"
                            bg="#FFB1B1"
                            align={"center"}
                            borderRadius="6px"
                            gap={"0.2rem"}
                            color="#B12C2C"
                            fontWeight={"600"}
                            mt="2"
                          >
                            <chakra.span
                              className="material-symbols-outlined"
                              fontSize={"18px"}
                            >
                              gpp_maybe
                            </chakra.span>
                            <Text fontSize={{ base: "11px", md: "12px" }}>
                              Contains Identifiable Features (Face Visible,
                              Eyes, Tattoos, Background){" "}
                            </Text>
                          </Flex>
                        </>
                      )}
                    </Flex>
                  </Flex> */}
                </Flex>
                <Modal
                  isOpen={isOpen}
                  onClose={onClose}
                  size="lg"
                  scrollBehavior="inside"
                >
                  <ModalOverlay />
                  <ModalContent top="20">
                    <ModalHeader
                      background={
                        "linear-gradient(90deg, var(--clinlog-purple, #452A7E) 25%, #612ECC 100%)"
                      }
                      color="white"
                      textTransform={"uppercase"}
                      fontSize={{ base: "15px", md: "16px" }}
                    >
                      Add Clinlog Note
                    </ModalHeader>
                    <ModalCloseButton color="white" />
                    <ModalBody>
                      <Flex p="4" flexDirection={"column"} gap="1rem">
                        <Text
                          fontSize={{ base: "11px", md: "12px" }}
                          fontWeight="600"
                          color="#970000"
                          bg="#FFB1B1"
                          p="2"
                          borderRadius={"6px"}
                        >
                          Important: Notes must not include any
                          patient-identifiable information. Enter only
                          non-identifiable details.
                        </Text>
                        <Textarea
                          minH="150px"
                          fontSize={{ base: "13px", md: "14px" }}
                          value={newNote}
                          onChange={(e) => setNewNote(e.target.value)}
                          placeholder="Enter your note here..."
                        />
                        <Button
                          size="sm"
                          bgColor="scBlack"
                          color={"white"}
                          _hover={{ bgColor: "scBlack" }}
                          alignSelf="flex-end"
                          onClick={() => {
                            handleAddNote();
                          }}
                        >
                          Add Note
                        </Button>
                      </Flex>
                    </ModalBody>
                  </ModalContent>
                </Modal>
                <Modal
                  isOpen={isSurveyOpen}
                  onClose={onSurveyClose}
                  size="2xl"
                  scrollBehavior="inside"
                >
                  <ModalOverlay />
                  <ModalContent top="20">
                    <ModalHeader
                      background={
                        "linear-gradient(90deg, var(--clinlog-purple, #452A7E) 25%, #612ECC 100%)"
                      }
                      color="white"
                      textTransform={"uppercase"}
                      fontSize={{ base: "15px", md: "16px" }}
                    >
                      Patient Survey Responses
                    </ModalHeader>
                    <ModalCloseButton color="white" />
                    <ModalBody>
                      <Flex px="4" py="8" flexDirection={"column"} gap="1rem">
                        {patientSurveyData && (
                          <SimpleGrid columns={1} gap="1rem" w="100%" h="100%">
                            <Flex flexDirection={"column"} gap="0.5rem">
                              <Text
                                fontSize={{ base: "10px", md: "11px" }}
                                fontWeight="700"
                                textTransform={"uppercase"}
                              >
                                Survey Date
                              </Text>
                              <Text
                                fontWeight={500}
                                fontSize={{ base: "13px", md: "14px" }}
                                p="3"
                                border="1px solid #E2E8F0"
                                borderRadius={"6px"}
                              >
                                {patientSurveyData.patientSurveyMatrix?.[0]
                                  ?.surveyDate
                                  ? format(
                                      new Date(
                                        patientSurveyData
                                          .patientSurveyMatrix?.[0]?.surveyDate,
                                      ),
                                      "dd MMM, yyyy",
                                    )
                                  : "N/A"}
                              </Text>
                            </Flex>
                            <Flex flexDirection={"column"} gap="0.5rem">
                              <Text
                                fontSize={{ base: "10px", md: "11px" }}
                                fontWeight="700"
                                textTransform={"uppercase"}
                                mt="1"
                              >
                                Time From Surgery
                              </Text>
                              <Text
                                fontWeight={500}
                                fontSize={{ base: "13px", md: "14px" }}
                                p="3"
                                border="1px solid #E2E8F0"
                                borderRadius={"6px"}
                              >
                                {patientSurveyData.patientSurveyMatrix?.[0]
                                  ?.timeFromSurgery || "N/A"}
                              </Text>
                            </Flex>
                            <Flex flexDirection={"column"} gap="0.5rem">
                              <Text
                                fontSize={{ base: "10px", md: "11px" }}
                                fontWeight="700"
                                textTransform={"uppercase"}
                                mt="1"
                              >
                                How do you feel about the OUTCOME?
                              </Text>
                              <Text
                                fontWeight={500}
                                fontSize={{ base: "13px", md: "14px" }}
                                p="3"
                                border="1px solid #E2E8F0"
                                borderRadius={"6px"}
                              >
                                {patientSurveyData.patientSurveyMatrix?.[0]
                                  ?.patientSatisfactionAesthetic || "N/A"}
                              </Text>
                            </Flex>
                            <Flex flexDirection={"column"} gap="0.5rem">
                              <Text
                                fontSize={{ base: "10px", md: "11px" }}
                                fontWeight="700"
                                textTransform={"uppercase"}
                                mt="1"
                              >
                                How is your FUNCTION?
                              </Text>
                              <Text
                                fontWeight={500}
                                fontSize={{ base: "13px", md: "14px" }}
                                p="3"
                                border="1px solid #E2E8F0"
                                borderRadius={"6px"}
                              >
                                {patientSurveyData.patientSurveyMatrix?.[0]
                                  ?.patientSatisfactionFunction || "N/A"}
                              </Text>
                            </Flex>
                            <Flex flexDirection={"column"} gap="0.5rem">
                              <Text
                                fontSize={{ base: "10px", md: "11px" }}
                                fontWeight="700"
                                textTransform={"uppercase"}
                                mt="1"
                              >
                                How was the TREATMENT PROCESS?
                              </Text>
                              <Text
                                fontWeight={500}
                                fontSize={{ base: "13px", md: "14px" }}
                                p="3"
                                border="1px solid #E2E8F0"
                                borderRadius={"6px"}
                              >
                                {patientSurveyData.patientSurveyMatrix?.[0]
                                  ?.patientSatisfactionTreatment || "N/A"}
                              </Text>
                            </Flex>
                            <Flex flexDirection={"column"} gap="0.5rem">
                              <Text
                                fontSize={{ base: "10px", md: "11px" }}
                                fontWeight="700"
                                textTransform={"uppercase"}
                                mt="1"
                              >
                                How is the maintenance?
                              </Text>
                              <Text
                                fontWeight={500}
                                fontSize={{ base: "13px", md: "14px" }}
                                p="3"
                                border="1px solid #E2E8F0"
                                borderRadius={"6px"}
                              >
                                {patientSurveyData.patientSurveyMatrix?.[0]
                                  ?.patientSatisfactionMaintenance || "N/A"}
                              </Text>
                            </Flex>
                            <Flex flexDirection={"column"} gap="0.5rem">
                              <Text
                                fontSize={{ base: "10px", md: "11px" }}
                                fontWeight="700"
                                textTransform={"uppercase"}
                                mt="1"
                              >
                                Have you had pain following your surgery?
                              </Text>
                              <Text
                                fontWeight={500}
                                fontSize={{ base: "13px", md: "14px" }}
                                p="3"
                                border="1px solid #E2E8F0"
                                borderRadius={"6px"}
                              >
                                {patientSurveyData.patientSurveyMatrix?.[0]
                                  ?.postOpPain || "N/A"}
                              </Text>
                            </Flex>
                            <Flex flexDirection={"column"} gap="0.5rem">
                              <Text
                                fontSize={{ base: "10px", md: "11px" }}
                                fontWeight="700"
                                textTransform={"uppercase"}
                                mt="1"
                              >
                                Smoking
                              </Text>
                              <Text
                                fontWeight={500}
                                fontSize={{ base: "13px", md: "14px" }}
                                p="3"
                                border="1px solid #E2E8F0"
                                borderRadius={"6px"}
                              >
                                {patientSurveyData.patientSurveyMatrix?.[0]
                                  ?.smoking || "N/A"}
                              </Text>
                            </Flex>
                          </SimpleGrid>
                        )}
                      </Flex>
                    </ModalBody>
                  </ModalContent>
                </Modal>
              </Flex>
            ) : (
              <Flex flexDirection={"column"} gap="1rem" w="100%">
                {" "}
                <Flex gap="0.5rem" align="center">
                  <Flex flexDirection={"column"} gap="0.2rem">
                    <Text
                      fontSize={"18px"}
                      fontWeight={700}
                      fontFamily={"inter"}
                      color={"#351361"}
                      textTransform={"uppercase"}
                      letterSpacing={"2.52px"}
                    >
                      All Cases
                    </Text>
                    <Text
                      fontSize={"11px"}
                      fontFamily={"inter"}
                      color={"#351361"}
                    >
                      All information displayed within Clinlog is fully
                      de-identified to protect patient privacy and meet clinical
                      research standards.
                    </Text>
                  </Flex>
                  <Spacer />

                  {/* {locationOptions?.length > 1 && (
                    <>
                      <Flex gap="0.2rem">
                        {locationArr.length > 0 &&
                          locationArr?.map((item) => {
                            if (item === "all") {
                              return (
                                <Tag
                                  key={item}
                                  size="sm"
                                  variant="solid"
                                  colorScheme="blue"
                                >
                                  <TagLabel>All</TagLabel>
                                  <TagCloseButton
                                    onClick={() => {
                                      setLocationArr(
                                        session.locationIds?.map((item) =>
                                          item.toString()
                                        )
                                      );
                                    }}
                                  />
                                </Tag>
                              );
                            } else if (
                              locationOptions
                                .map((item) => item.value)
                                .includes(item)
                            ) {
                              return (
                                <Tag
                                  key={item}
                                  size="sm"
                                  variant="solid"
                                  colorScheme="blue"
                                >
                                  <TagLabel>
                                    {
                                      allClinicsQueryResult?.data?.clinics?.find(
                                        (clinic) =>
                                          Number(clinic.id) === Number(item)
                                      )?.locationShortName
                                    }
                                  </TagLabel>
                                  <TagCloseButton
                                    onClick={() => {
                                      setLocationArr(
                                        locationArr.filter(
                                          (loc) => loc !== item
                                        )?.length > 0
                                          ? locationArr.filter(
                                              (loc) => loc !== item
                                            )
                                          : [session?.locationIds?.[0]]
                                      );
                                    }}
                                  />
                                </Tag>
                              );
                            }
                          })}
                      </Flex>
                      <Select
                        fontSize={"13px"}
                        w="15%"
                        onChange={(e) => {
                          const location = e.target.value;

                          if (location === "all") {
                            setLocationArr(["all"]);
                          } else if (location === "") {
                            setLocationArr([]);
                          } else {
                            if (locationArr.includes("all")) {
                              setLocationArr([location]);
                            } else {
                              setLocationArr((prev) => {
                                return [...prev, location];
                              });
                            }
                          }
                        }}
                      >
                        <option value="">-- Location --</option>
                        <option value="all">All</option>
                        {locationOptions?.map((item) => {
                          if (!locationArr.includes(item.value)) {
                            return (
                              <option key={item.value} value={item.value}>
                                {item.label}
                              </option>
                            );
                          }
                        })}
                      </Select>
                    </>
                  )} */}
                </Flex>
                <Flex
                  w="100%"
                  gap="1rem"
                  bg="white"
                  p="4"
                  borderRadius="6px"
                  border="1px solid #F7F0F0"
                  align="center"
                >
                  <Text fontSize="13px" fontWeight={"600"} whiteSpace="nowrap">
                    Search Case:
                  </Text>
                  <InputGroup>
                    <InputLeftElement
                      pointerEvents="none"
                      children={<MdSearch fontSize={"22px"} />}
                    />
                    <Input
                      type="text"
                      placeholder="Search by Patient Name or Case Number"
                      fontSize={"13px"}
                      onChange={(e) => {
                        const value = e.target.value;
                        setColumnFilters([
                          {
                            id: "patientName",
                            value: value,
                          },
                        ]);
                      }}
                    />
                  </InputGroup>
                </Flex>
                <FilterComponent
                  globalFilter={globalFilter}
                  setGlobalFilter={setGlobalFilter}
                  surgeonOptions={surgeonOptions}
                  selectCustomStyle={selectCustomStyle}
                  locationOptions={locationOptions}
                  implantLineOptions={implantLineOptions}
                />
                <TableContainer
                  overflowY="auto"
                  borderRadius="6px"
                  border="1px solid #F7F0F0"
                  bg="white"
                >
                  <Table variant="simple">
                    <Thead
                      position="sticky"
                      zIndex={1001}
                      bgColor={"scLightGrey"}
                      top={0}
                    >
                      {table.getHeaderGroups().map((headerGroup) => (
                        <Tr key={headerGroup.id}>
                          {headerGroup.headers.map((header) => {
                            return (
                              <Th
                                key={header.id + "_clinlog"}
                                color="scBlack"
                                fontFamily={"Inter"}
                                fontSize={"12px"}
                                textAlign={"center"}
                                p="6"
                                onClick={() => {
                                  setSorting([
                                    {
                                      id: header.id,
                                      desc:
                                        header?.column?.getIsSorted() === "asc"
                                          ? true
                                          : false,
                                    },
                                  ]);
                                }}
                                title={
                                  header.column?.getCanSort()
                                    ? header.column?.getNextSortingOrder() ===
                                      "asc"
                                      ? "Sort ascending"
                                      : header.column?.getNextSortingOrder() ===
                                          "desc"
                                        ? "Sort descending"
                                        : "Clear sort"
                                    : undefined
                                }
                              >
                                {header.isPlaceholder
                                  ? null
                                  : flexRender(
                                      header.column.columnDef.header,
                                      header.getContext(),
                                    )}
                                {{
                                  asc: " 🔼",
                                  desc: " 🔽",
                                }[header.column.getIsSorted() as string] ??
                                  null}
                              </Th>
                            );
                          })}
                          <Th
                            color="scBlack"
                            fontFamily={"Inter"}
                            fontSize={"12px"}
                            p="6"
                            textAlign={"center"}
                          >
                            Action
                          </Th>
                        </Tr>
                      ))}
                    </Thead>
                    <Tbody>
                      {table?.getRowModel()?.rows?.length ? (
                        table.getRowModel().rows.map((row, i) => (
                          <Tr key={row.id + "_clinlog"} fontSize="14px">
                            {row.getVisibleCells().map(
                              (cell) =>
                                !cell.id.includes("recordTreatmentStatus") &&
                                !cell.id.includes(
                                  "recordConsultationStatus",
                                ) && (
                                  <Td key={cell.id} p="6" textAlign={"center"}>
                                    {flexRender(
                                      cell.column.columnDef.cell,
                                      cell.getContext(),
                                    )}
                                  </Td>
                                ),
                            )}
                            <Td textAlign={"center"}>
                              {" "}
                              <Link
                                //target={"_blank"}

                                //as={NextLink}
                                // href={{
                                //   pathname: "/patientdata",
                                //   query: {
                                //     postId: encryptId(postId),
                                //     entryId: encryptId(treatment.id),
                                //   },
                                // }}
                                // href={`/patientdata?postId=${encryptId(
                                //   globalIdsResults?.data?.entries
                                //     ?.find((entry) => {
                                //       const records =
                                //         entry?.attachedRecordsEntry?.map(
                                //           (record) => record?.id
                                //         );
                                //       return records?.includes(
                                //         row.original.id.toString()
                                //       );
                                //     })
                                //     ?.id.toString()
                                // )}&entryId=${encryptId(
                                //   row.original.id.toString()
                                // )}&tabName=surgical`}
                                onClick={() => {
                                  setViewPatient(row.original);
                                }}
                                bgColor={"scBlack"}
                                py="1"
                                px="2"
                                color="white"
                                borderRadius="25px"
                                fontSize={"12px"}
                                fontWeight="700"
                              >
                                View
                              </Link>
                            </Td>
                          </Tr>
                        ))
                      ) : (
                        <Tr>
                          <Th colSpan={columns.length}>No results.</Th>
                        </Tr>
                      )}
                    </Tbody>
                  </Table>
                  <Flex
                    display={"flex"}
                    //justify="flex-end"
                    align="center"
                    mt={"1.5rem"}
                    mb={"1rem"}
                    p="4"
                  >
                    {" "}
                    <Text
                      fontSize="14px"
                      fontWeight={700}
                      textTransform={"uppercase"}
                      mr="4"
                    >
                      Total Cases:{" "}
                    </Text>
                    <Text fontSize="14px">
                      {table.getFilteredRowModel().rows.length}
                    </Text>
                    {hasNextPage && (
                      <Spinner ml="10px" size="sm" color="#351361" />
                    )}
                    <Spacer />
                    <Button
                      onClick={
                        () => table.setPageIndex(0)
                        //table.firstPage()
                        //setPagination({...pagination, pageIndex: 0 })
                      }
                      isDisabled={!table.getCanPreviousPage()}
                      variant="ghost"
                    >
                      {"<<"}
                    </Button>
                    <Button
                      onClick={() => {
                        table.previousPage();
                      }}
                      isDisabled={!table.getCanPreviousPage()}
                      variant="ghost"
                    >
                      {"<"}
                    </Button>
                    <Button
                      onClick={() => {
                        table.nextPage();
                      }}
                      isDisabled={!table.getCanNextPage()}
                      variant="ghost"
                    >
                      {">"}
                    </Button>
                    <Button
                      onClick={() =>
                        table.setPageIndex(table.getPageCount() - 1)
                      }
                      isDisabled={!table.getCanNextPage()}
                      variant="ghost"
                    >
                      {">>"}
                    </Button>
                    <Box ml="20px" minWidth={"75px"} textAlign={"right"}>
                      {pagination.pageIndex + 1} of {table.getPageCount()}
                    </Box>
                  </Flex>
                </TableContainer>
              </Flex>
            )}
          </Flex>
        )}
        {openTab === "dataTool" && (
          <Flex
            flexDirection={"column"}
            gap="1rem"
            w="100%"
            maxW={{ base: "100%", lg: "2000px" }}
            align={"center"}
          >
            <ClinlogDataTool
              filterColumns={clinlogFilterColumns}
              clinlogRecordDetails={clinlogDataQueryResults}
              allCasesData={tableData}
              columnData={columns}
              selectCustomStyle={selectCustomStyle}
              globalFilterFunction={globalFilterFunction}
              locationOptions={locationOptions}
              surgeonOptions={surgeonOptions}
              implantLineOptions={implantLineOptions}
              clinlogNotes={clinlogNotesQueryResult?.data?.recordNotes || []}
            />
          </Flex>
        )}
      </Flex>
    </Flex>
  );
}
export default Clinlog;
Clinlog.auth = {
  role: "Staff",
};
