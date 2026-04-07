import {
  Divider,
  Flex,
  Spacer,
  Text,
  Button,
  chakra,
  Select,
  Input,
  Spinner,
  RangeSlider,
  RangeSliderMark,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  SimpleGrid,
  InputGroup,
  InputRightAddon,
  useOutsideClick,
  IconButton,
  Tooltip,
} from "@chakra-ui/react";
import { GS1Parser, DecodeResult, ParsedElement } from "@valentynb/gs1-parser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { add, differenceInDays, format, set } from "date-fns";
import { gql } from "graphql-request";
import useQueryHook, { sendData } from "hooks/useQueryHook";
import { get } from "http";
import { title } from "process";
import React, { use, useEffect, useMemo, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { treatmentPlanItemsMutation } from "../detailsPageMutations";
import ScannerV2 from "componentsv2/ScannerV2";
//import query from "devextreme/data/query";
import { fr, id } from "date-fns/locale";
import { parseYYMMDD } from "helpersv2/utils";
import { V2Link } from "../../Dashboard/Helpers/routerHelpers";
import { on } from "events";

export default function SiteSpecificSideBar({
  selectedSite,
  toastData,
  patientName,
  approvedProposal,
  onSidebarClose,
  globalPostId,
  proposedTreatmentChartIds,
  onSiteSaved,
  fromClinlog = false,
  fetchDentalComponentsQueryResult,
}: {
  selectedSite: any;
  toastData: any;
  patientName: string;
  approvedProposal: any;
  onSidebarClose: () => void;
  globalPostId?: number | string;
  proposedTreatmentChartIds?: (number | string)[];
  onSiteSaved?: (site: string | number) => void;
  fromClinlog?: boolean;
  fetchDentalComponentsQueryResult?: any;
}) {
  const { toast, toastIdRef } = toastData;

  const [abutmentDetailsArray, setAbutmentDetailsArray] = useState<any[]>([]);

  const siteSpecificData =
    selectedSite?.attachedSiteSpecificRecords?.[0]
      ?.itemSpecificationMatrix?.[0] || null;
  // abutment matrix for definitive and provisional
  const abutmentDetailsData =
    selectedSite?.attachedSiteSpecificRecords?.[0]?.abutmentDetailsMatrix || [];
  const barSpecificDetails =
    selectedSite?.treatmentItemNumber === "666"
      ? selectedSite?.attachedSiteSpecificRecords?.[0]
      : null;

  const {
    control: followUpControl,
    register: followUpRegister,
    handleSubmit: followUpSubmit,
    watch: followUpWatch,
    setValue: setFollowUpValues,
    getValues: getFollowUpValues,
  } = useForm();

  const queryClient = useQueryClient();
  const viewerMainNavbarResult = queryClient.getQueryData([
    "mainViewerQuery",
  ]) as { viewer?: { isClinlogOverseer?: boolean } } | undefined;
  const userIsClinlogOverseer =
    viewerMainNavbarResult?.viewer?.isClinlogOverseer;

  const [isDrawerTransparent, setIsDrawerTransparent] = useState(false);
  const [isBarcodeScannerOpen, setIsBarcodeScannerOpen] = useState(false);
  const gs1Parser = new GS1Parser();
  function handleGs1Conversion(barcode) {
    if (!barcode) {
      return null;
    }
    try {
      const result: DecodeResult = gs1Parser.decode(barcode);

      const normalizedResult = {
        lotCode: result.data.batch?.dataString ?? null,
        dateOfExpiry: result.data.expDate?.dataString ?? null,
        dateOfManufacture: result.data.prodDate?.dataString ?? null,
        serialSequenceBarCode: result.data.gtin?.dataString ?? null,
      };
      return normalizedResult;
    } catch (error) {
      console.error("Error:", error);
      return null;
    }
  }
  const barcodeInputRef = useRef(null);
  const barcodeContainerRef = useRef(null);
  const barcodeTimeoutRef = useRef(null);

  const { control, register, handleSubmit, watch, setValue, getValues } =
    useForm();
  // having dynamic fields created for abutment matrix, so not using default values, instead setting values on data fetch
  // useForm({
  //   defaultValues: {
  //     siteId: selectedSite?.attachedSiteSpecificRecords?.[0]?.id || "new",
  //     barType: siteSpecificData?.barType || "fixedFp3",
  //     toothValue: selectedSite?.toothValue || "",
  //     implantBrand: siteSpecificData?.implantBrand || "",
  //     implantCategory: siteSpecificData?.implantCategory || "",
  //     implantLine: siteSpecificData?.implantLine || "",
  //     surface: siteSpecificData?.surface || "",
  //     implantType: siteSpecificData?.implantType || "",
  //     implantLength: siteSpecificData?.implantLength || "",
  //     implantBaseAndDiameter: siteSpecificData?.implantBaseAndDiameter || "",

  //     serialSequenceBarCode: siteSpecificData?.serialSequenceBarCode || "",
  //     lotCode:
  //       handleGs1Conversion(siteSpecificData?.serialSequenceBarCode)
  //         ?.lotCode || "",
  //     dateOfExpiry:
  //       parseYYMMDD(
  //         handleGs1Conversion(siteSpecificData?.serialSequenceBarCode)
  //           ?.dateOfExpiry,
  //       ) || "",
  //     dateOfManufacture:
  //       parseYYMMDD(
  //         handleGs1Conversion(siteSpecificData?.serialSequenceBarCode)
  //           ?.dateOfManufacture,
  //       ) || "",
  //     abutmentCategory: siteSpecificData?.abutmentCategory || "",
  //     gingivalHeight: siteSpecificData?.gingivalHeight || "",
  //     typeAndDiameter: siteSpecificData?.typeAndDiameter || "",
  //     abutmentBrand: siteSpecificData?.abutmentBrand || "",
  //     angleCorrectionAbutment:
  //       siteSpecificData?.angleCorrectionAbutment || "",
  //     abutmentLength: siteSpecificData?.abutmentLength || "",
  //     abutmentSerialSequenceBarCode:
  //       siteSpecificData?.abutmentSerialSequenceBarCode || "",
  //     abutmentLotCode:
  //       handleGs1Conversion(siteSpecificData?.abutmentSerialSequenceBarCode)
  //         ?.lotCode || "",
  //     abutmentDateOfExpiry:
  //       parseYYMMDD(
  //         handleGs1Conversion(siteSpecificData?.abutmentSerialSequenceBarCode)
  //           ?.dateOfExpiry,
  //       ) || "",
  //     abutmentDateOfManufacture:
  //       parseYYMMDD(
  //         handleGs1Conversion(siteSpecificData?.abutmentSerialSequenceBarCode)
  //           ?.dateOfManufacture,
  //       ) || "",
  //     abutmentType: siteSpecificData?.abutmentType || "",
  //     placement: siteSpecificData?.placement || "",
  //     trabecularBoneDensity: siteSpecificData?.trabecularBoneDensity || "",
  //     boneVascularity: siteSpecificData?.boneVascularity || "",
  //     graftingApplied: siteSpecificData?.graftingApplied || "",
  //     graftMaterial: siteSpecificData?.graftMaterial || "",
  //     intraOperativeSinusComplications:
  //       siteSpecificData?.intraOperativeSinusComplications || "",
  //     crestalRest: siteSpecificData?.crestalRest || "",
  //     insertionTorque: siteSpecificData?.insertionTorque || "",
  //     radiographicTrabecularDensityHu:
  //       siteSpecificData?.radiographicTrabecularDensityHu || "N/A",
  //     relevantBoneWidth: siteSpecificData?.relevantBoneWidth || "",
  //     preOperativeSinusDisease:
  //       siteSpecificData?.preOperativeSinusDisease || "",
  //     preOperativeSinusDiseaseManagement:
  //       siteSpecificData?.preOperativeSinusDiseaseManagement || "",
  //     barMaterial: barSpecificDetails?.barMaterial?.toLowerCase() || "",
  //     archLocation: barSpecificDetails?.archLocation?.toLowerCase() || "",
  //     barLengthFrom: barSpecificDetails?.barLengthFrom || 0,
  //     barLengthTo: barSpecificDetails?.barLengthTo || 15,
  //     provisionalMaterial: barSpecificDetails?.provisionalMaterial || "",
  //     finalProstheticMaterial:
  //       barSpecificDetails?.finalProstheticMaterial || "",
  //     reinforcementOfFinalProsthetic:
  //       barSpecificDetails?.reinforcementOfFinalProsthetic || "",
  //     conformanceWithTreatmentPlan:
  //       siteSpecificData?.conformanceWithTreatmentPlan || "",
  //     prf: siteSpecificData?.prf || "",
  //   },
  // });

  const siteValues = watch();
  const implantBrand = watch("implantBrand");
  const implantType = watch("implantType");
  const implantLine = watch("implantLine");
  const abutmentBrand = watch("0_abutmentBrand");
  const archLocation = watch("archLocation");

  // Focus barcode input when scanner is opened
  useEffect(() => {
    if (isBarcodeScannerOpen && barcodeInputRef.current) {
      barcodeInputRef.current.focus();
    }
  }, [isBarcodeScannerOpen]);

  // Close barcode scanner when clicking outside
  useOutsideClick({
    ref: barcodeContainerRef,
    handler: () => {
      if (isBarcodeScannerOpen) {
        if (barcodeTimeoutRef.current) {
          clearTimeout(barcodeTimeoutRef.current);
        }
        setIsBarcodeScannerOpen(false);
      }
    },
  });

  const formValues = followUpWatch();
  const sitesArray = [
    "11",
    "12",
    "13",
    "14",
    "15",
    "16",
    "17",
    "18",
    "21",
    "22",
    "23",
    "24",
    "25",
    "26",
    "27",
    "28",
    "31",
    "32",
    "33",
    "34",
    "35",
    "36",
    "37",
    "38",
    "41",
    "42",
    "43",
    "44",
    "45",
    "46",
    "47",
    "48",
  ];
  const selectStyles = {
    border: "1px solid #D9D9D9",
    borderRadius: "6px",
    fontSize: { base: "12px", md: "13px" },
    _hover: { border: "1px solid #D9D9D9" },
    _focusVisible: { border: "1px solid #D9D9D9" },
    textTransform: "uppercase",
    height: "100%",
    px: "5",
    py: "3",
  };

  const upperToothOptions = [
    18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28,
  ];

  const lowerToothOptions = [
    48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38,
  ];

  // const fetchDentalComponentsQuery = gql`
  //   query fetchDentalComponentsQuery {
  //     entries(section: "dentalComponents") {
  //       ... on dentalComponents_implantList_Entry {
  //         id
  //         implantLength
  //         implantType
  //         implantBaseDiameter
  //         implantLine
  //         implantCategory
  //         componentReference
  //         referenceNumber
  //         brand
  //         description
  //         title
  //         typeHandle
  //         isGlobal
  //         recordClinic {
  //           id
  //         }
  //       }
  //       ... on dentalComponents_abutmentList_Entry {
  //         id
  //         brand
  //         angleAndDiameter
  //         angleCorrectionAbutment
  //         abutmentLength
  //         description
  //         referenceNumber
  //         componentReference
  //         title
  //         typeHandle
  //         isGlobal
  //         recordClinic {
  //           id
  //         }
  //       }
  //     }
  //   }
  // `;
  // const fetchDentalComponentsQuery = gql`
  //   query fetchDentalComponentsQuery {
  //     entries(section: "dentalComponents") {
  //       ... on dentalComponents_implantList_Entry {
  //         id
  //         implantLength
  //         implantType
  //         componentReference
  //         referenceNumber
  //         brand
  //         description
  //         title
  //         typeHandle
  //         isGlobal
  //         recordClinic {
  //           id
  //         }
  //         implantCategory
  //         implantCategoryLabel: implantCategory(label: true)
  //         implantLine
  //         surface
  //         implantBaseDiameter
  //         serialSequenceCode
  //       }
  //       ... on dentalComponents_abutmentList_Entry {
  //         id
  //         brand
  //         angleAndDiameter
  //         angleCorrectionAbutment
  //         abutmentLength
  //         description
  //         referenceNumber
  //         componentReference
  //         title
  //         typeHandle
  //         isGlobal
  //         recordClinic {
  //           id
  //         }
  //         abutmentCategory
  //         abutmentCategoryLabel: abutmentCategory(label: true)
  //         gingivalHeight
  //         typeAndDiameter
  //         abutmentHeight
  //         serialSequenceCode
  //       }
  //     }
  //   }
  // `;
  // const fetchDentalComponentsQueryResult = useQueryHook(
  //   ["fetchDentalComponentsQueryResult"],
  //   fetchDentalComponentsQuery,
  //   {},
  //   { enabled: true },
  // );

  const [implantsData, setImplantsData] = useState<any[]>([]);
  const [abutmentsData, setAbutmentsData] = useState<any[]>([]);
  const [combinedData, setCombinedData] = useState<any[]>([]);

  const mappedImplantType = [
    ...new Set(implantsData?.map((item) => item.implantType)),
  ];

  const mappedImplantBrands = [
    ...new Set(implantsData?.map((item) => item.brand)),
  ];

  const implantBrandOptions = mappedImplantBrands?.map((item, i) => (
    <option key={`implant-brand-${String(item)}-${i}`} value={item}>
      {item}
    </option>
  ));
  const implantCategoryOptions = [
    {
      name: "Regular Implant (Bone Level)",
      value: "regularImplantBoneLevel",
    },
    {
      name: "Regular Implant (Tissue Level - Polished Collar)",
      value: "regularImplantTissueLevelPolishedCollar",
    },
    {
      name: "Regular Implant (Remote Anchorage - Polished Collar & Shaft)",
      value: "regularImplantRemoteAnchoragePolishedCollarShaft",
    },
    {
      name: "Regular Implant (Bicortical Anchorage - Polished Shaft With Threaded Collar)",
      value: "regularImplantBicorticalAnchoragePolishedShaftWithThreadedCollar",
    },
    {
      name: "Zygomatic Implant (45º Threaded Collar and Shaft)",
      value: "zygomaticImplant45oThreadedCollarAndShaft",
    },
    {
      name: "Zygomatic Implant (45º Smooth-Treated Collar and Shaft)",
      value: "zygomaticImplant45oSmoothTreatedCollarAndShaft",
    },
    {
      name: "Zygomatic Implant (55º Polished Collar and Shaft)",
      value: "zygomaticImplant55oPolishedCollarAndShaft",
    },
    {
      name: "Zygomatic Implant (55º Bicortical Threaded Collar and Polished Shaft)",
      value: "zygomaticImplant55oBicorticalThreadedCollarAndPolishedShaft",
    },
    {
      name: "Zygomatic Implant (0º Polished Shaft)",
      value: "zygomaticImplant0oPolishedShaft",
    },
    {
      name: "Zygomatic Implant (45º Polished Collar and Shaft)",
      value: "zygomaticImplant45oPolishedCollarAndShaft",
    },
    {
      name: "Zygomatic Implant (0º Smooth-Treated Collar and Shaft)",
      value: "zygomaticImplant0oSmoothTreatedCollarAndShaft",
    },
    {
      name: "Zygomatic Implant (0º Polished Collar and Shaft)",
      value: "zygomaticImplant0oPolishedCollarAndShaft",
    },
    {
      name: "Other",
      value: "other",
    },
  ];
  const implantTypeOptions = useMemo(() => {
    if (!implantBrand) {
      return [];
    }
    const filteredImplantType = implantsData?.filter((item) => {
      return item?.brand == implantBrand;
    });
    const mappedImplantType = [
      ...new Set(filteredImplantType?.map((item) => item?.implantType)),
    ];
    return mappedImplantType?.map((item, i) => (
      <option key={`implant-type-${String(item)}-${i}`} value={item}>
        {item}
      </option>
    ));
  }, [implantsData, implantBrand]);
  const implantLineOptions = useMemo(() => {
    if (!implantBrand) {
      return [];
    }
    const filteredImplantLine = implantsData?.filter((item) => {
      return item?.brand == implantBrand;
    });
    const mappedImplantLine = [
      ...new Set(filteredImplantLine?.map((item) => item?.implantLine)),
    ];

    return mappedImplantLine?.map((item, i) => (
      <option key={`implant-line-${String(item)}-${i}`} value={item}>
        {item}
      </option>
    ));
  }, [implantsData, implantBrand]);
  const implantSurfaceOptions = useMemo(() => {
    if (!implantBrand || !implantLine) {
      return [];
    }
    const filteredSurfaceLine = implantsData?.filter((item) => {
      return (
        item?.brand == implantBrand &&
        item?.implantLine == implantLine &&
        item?.surface?.length > 0
      );
    });
    const mappedImplantSurface = [
      ...new Set(filteredSurfaceLine?.map((item) => item?.surface)),
    ];

    return (
      mappedImplantSurface?.map((item, i) => (
        <option key={`implant-surface-${String(item)}-${i}`} value={item}>
          {item}
        </option>
      )) || []
    );
  }, [implantsData, implantBrand, implantLine]);
  const implantBaseAndDiameterOptions = useMemo(() => {
    if (!implantBrand || !implantLine) {
      return [];
    }
    const filteredImplantBaseAndDiameter = implantsData?.filter((item) => {
      return (
        item?.brand == implantBrand &&
        item?.implantLine == implantLine &&
        item?.implantBaseDiameter?.length > 0
      );
    });
    const mappedImplantBaseAndDiameter = [
      ...new Set(
        filteredImplantBaseAndDiameter?.map(
          (item) => item?.implantBaseDiameter,
        ),
      ),
    ];
    return (
      mappedImplantBaseAndDiameter?.map((item, i) => (
        <option key={`implant-base-${String(item)}-${i}`} value={item}>
          {item}
        </option>
      )) || []
    );
  }, [implantsData, implantLine, implantBrand]);

  const implantLengthOptions = useMemo(() => {
    if (!implantLine || !implantBrand) {
      return [];
    }

    const filteredImplantLength = [
      ...new Set(
        implantsData
          ?.filter((item) => {
            return (
              item?.implantLine == implantLine &&
              item?.brand == implantBrand &&
              item?.implantLength?.length > 0
            );
          })
          .map((item) => item?.implantLength)
          .sort((a, b) => {
            const aValue = a?.toLowerCase().split("mm")[0];
            const bValue = b?.toLowerCase().split("mm")[0];
            return aValue - bValue;
          }),
      ),
    ];

    return filteredImplantLength?.map((item, i) => (
      <option key={`implant-length-${String(item)}-${i}`} value={item}>
        {item}
      </option>
    ));
  }, [implantsData, implantLine, implantBrand]);

  const abutmentBrandOptions = useMemo(() => {
    const mappedAbutmentBrands = [
      ...new Set(abutmentsData?.map((item) => item.brand)),
    ];

    return mappedAbutmentBrands?.map((item, i) => (
      <option key={`abutment-brand-${String(item)}-${i}`} value={item}>
        {item}
      </option>
    ));
  }, [abutmentsData, implantType]);

  const abutmentTypeOptions = useMemo(() => {
    if (!abutmentBrand) {
      return [];
    }
    const filteredAbutmentType = abutmentsData?.filter(
      (item) => item?.brand == abutmentBrand,
    );

    const uniqueAbutmentType = [
      ...new Set(
        filteredAbutmentType?.map((item) => item?.angleCorrectionAbutment),
      ),
    ];
    return uniqueAbutmentType?.map((item, i) => (
      <option key={`abutment-type-${String(item)}-${i}`} value={item}>
        {item}
      </option>
    ));
  }, [abutmentsData, abutmentBrand]);
  const abutmentHeightOptions = useMemo(() => {
    if (!abutmentBrand) {
      return [];
    }
    const filteredAbutmentHeight = abutmentsData?.filter(
      (item) => item?.brand == abutmentBrand,
    );
    // ?.filter(typeFilter);

    const uniqueAbutmentHeight = [
      ...new Set(filteredAbutmentHeight?.map((item) => item?.abutmentHeight)),
    ];
    return uniqueAbutmentHeight
      ?.filter((opt) => opt?.length > 0)
      ?.map((item, i) => (
        <option key={`abutment-height-${String(item)}-${i}`} value={item}>
          {item}
        </option>
      ));
  }, [abutmentsData, abutmentBrand]);
  const gingivalHeightOptions = useMemo(() => {
    if (!abutmentBrand) {
      return [];
    }
    const filteredGingivalHeight = abutmentsData?.filter(
      (item) => item?.brand == abutmentBrand,
    );
    // ?.filter(typeFilter);

    const uniqueGingivalHeight = [
      ...new Set(filteredGingivalHeight?.map((item) => item?.gingivalHeight)),
    ];
    return uniqueGingivalHeight
      ?.filter((opt) => opt?.length > 0)
      ?.map((item, i) => (
        <option key={`gingival-height-${String(item)}-${i}`} value={item}>
          {item}
        </option>
      ));
  }, [abutmentsData, abutmentBrand]);
  const typeAndDiameterOptions = useMemo(() => {
    if (!abutmentBrand) {
      return [];
    }
    const filteredtypeAndDiameter = abutmentsData?.filter(
      (item) => item?.brand == abutmentBrand,
    );
    // ?.filter(typeFilter);

    const uniquetypeAndDiameter = [
      ...new Set(
        filteredtypeAndDiameter?.map((item) => item?.angleAndDiameter),
      ),
    ];
    return uniquetypeAndDiameter
      ?.filter((opt) => opt?.length > 0)
      ?.map((item, i) => (
        <option key={`angle-diameter-${String(item)}-${i}`} value={item}>
          {item}
        </option>
      ));
  }, [abutmentsData, abutmentBrand]);
  const implantMatrixMemo = useMemo(() => {
    return (
      <SimpleGrid columns={3} spacing={4} mt="2" h="100%">
        <Flex flexDirection={"column"} gap="0.5rem">
          <Text fontSize="11px" fontWeight="700" textTransform={"uppercase"}>
            Site
          </Text>
          {selectedSite?.toothValue || fromClinlog ? (
            <Text sx={selectStyles}>{selectedSite?.toothValue || "N/A"}</Text>
          ) : (
            <Select sx={selectStyles} {...register("toothValue")}>
              <option value="">-- site --</option>
              {sitesArray.map((site) => (
                <option key={site} value={site}>
                  {site}
                </option>
              ))}
            </Select>
          )}
        </Flex>
        <Flex flexDirection={"column"} gap="0.5rem">
          <Text fontSize="11px" fontWeight="700" textTransform={"uppercase"}>
            Implant Category
          </Text>
          {fromClinlog ? (
            <Text sx={selectStyles} textTransform={"uppercase"}>
              {siteSpecificData?.implantCategoryLabel || "N/A"}
            </Text>
          ) : (
            <Select
              sx={selectStyles}
              textTransform={"uppercase"}
              {...register("implantCategory")}
            >
              <option value="">-- Select --</option>
              {implantCategoryOptions?.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.name}
                </option>
              ))}
            </Select>
          )}
        </Flex>
        <Flex flexDirection={"column"} gap="0.5rem">
          <Text fontSize="11px" fontWeight="700" textTransform={"uppercase"}>
            Implant Brand
          </Text>
          {fromClinlog ? (
            <Text sx={selectStyles} textTransform={"uppercase"}>
              {siteSpecificData?.implantBrand || "N/A"}
            </Text>
          ) : (
            <Select
              sx={selectStyles}
              py="1px"
              textTransform={"uppercase"}
              {...register("implantBrand")}
            >
              <option value="">-- Select --</option>
              {implantBrandOptions}
            </Select>
          )}
        </Flex>
        {/* <Flex flexDirection={"column"} gap="0.5rem">
                <Text
                  fontSize="11px"
                  fontWeight="700"
                  textTransform={"uppercase"}
                >
                  Implant Type
                </Text>
                {fromClinlog ? (
                  <Text
                    px="5"
                    py="3"
                    sx={selectStyles}
                    textTransform={"uppercase"}
                  >
                    {siteSpecificData?.implantType || "N/A"}
                  </Text>
                ) : (
                  <Select
                    sx={selectStyles}
                    {...register("implantType")}
                    disabled={fromClinlog && !getValues("implantBrand")}
                  >
                    <option value="">-- Select --</option>
                    {implantTypeOptions}
                  </Select>
                )}
              </Flex> */}
        <Flex flexDirection={"column"} gap="0.5rem">
          <Text fontSize="11px" fontWeight="700" textTransform={"uppercase"}>
            Implant Line
          </Text>
          {fromClinlog ? (
            <Text sx={selectStyles} textTransform={"uppercase"}>
              {siteSpecificData?.implantLine || "N/A"}
            </Text>
          ) : (
            <Select
              sx={selectStyles}
              {...register("implantLine")}
              disabled={fromClinlog && !getValues("implantLine")}
            >
              <option value="">-- Select --</option>

              {implantLineOptions}
            </Select>
          )}
        </Flex>
        <Flex flexDirection={"column"} gap="0.5rem">
          <Text fontSize="11px" fontWeight="700" textTransform={"uppercase"}>
            Surface
          </Text>
          {fromClinlog ? (
            <Text sx={selectStyles} textTransform={"uppercase"}>
              {siteSpecificData?.surface || "N/A"}
            </Text>
          ) : (
            <Select
              sx={selectStyles}
              {...register("surface")}
              disabled={
                (fromClinlog && !getValues("surface")) ||
                implantSurfaceOptions?.length === 0
              }
            >
              <option value="">-- Select --</option>
              {/* {implantTypeOptions} */}
              {implantSurfaceOptions}
            </Select>
          )}
        </Flex>
        <Flex flexDirection={"column"} gap="0.5rem">
          <Text fontSize="11px" fontWeight="700" textTransform={"uppercase"}>
            Implant Base and Diameter
          </Text>
          {fromClinlog ? (
            <Text sx={selectStyles} textTransform={"uppercase"}>
              {siteSpecificData?.implantBaseAndDiameter || "N/A"}
            </Text>
          ) : (
            <Select
              sx={selectStyles}
              {...register("implantBaseAndDiameter")}
              disabled={
                (fromClinlog && !getValues("implantBaseAndDiameter")) ||
                implantBaseAndDiameterOptions?.length === 0
              }
            >
              <option value="">-- Select --</option>
              {/* {implantTypeOptions} */}
              {implantBaseAndDiameterOptions}
            </Select>
          )}
        </Flex>
        <Flex flexDirection={"column"} gap="0.5rem">
          <Text fontSize="11px" fontWeight="700" textTransform={"uppercase"}>
            Implant Length
          </Text>
          {fromClinlog ? (
            <Text sx={selectStyles} textTransform={"uppercase"}>
              {siteSpecificData?.implantLength || "N/A"}
            </Text>
          ) : (
            <Select
              sx={selectStyles}
              {...register("implantLength")}
              disabled={
                (fromClinlog && !getValues("implantType")) ||
                implantLengthOptions?.length === 0
              }
            >
              <option value="">-- Select --</option>
              {implantLengthOptions}
              {/* {getValues("implantType")?.includes("ZAGA") ? (
                      <>
                        <option value="30.0mm">30.0mm</option>
                        <option value="32.5mm">32.5mm</option>
                        <option value="35.0mm">35.0mm</option>
                        <option value="37.5mm">37.5mm</option>
                        <option value="40.0mm">40.0mm</option>
                        <option value="42.5mm">42.5mm</option>
                        <option value="45.0mm">45.0mm</option>
                        <option value="47.5mm">47.5mm</option>
                        <option value="50.0mm">50.0mm</option>
                        <option value="52.5mm">52.5mm</option>
                        <option value="55.0mm">55.0mm</option>
                        <option value="57.5mm">57.5mm</option>
                        <option value="60.0mm">60.0mm</option>
                      </>
                    ) : (
                      <>
                        <option value="6.0mm">6.0mm</option>
                        <option value="8.0mm">8.0mm</option>
                        <option value="10.0mm">10.0mm</option>
                        <option value="12.0mm">12.0mm</option>
                        <option value="14.0mm">14.0mm</option>
                        <option value="16.0mm">16.0mm</option>
                        <option value="18.0mm">18.0mm</option>
                        <option value="20.0mm">20.0mm</option>
                      </>
                    )} */}
            </Select>
          )}
        </Flex>
        {!fromClinlog && (
          <>
            <Flex flexDirection={"column"} gap="0.5rem">
              <Flex gap="0.5rem" alignItems="center">
                {" "}
                <Text
                  fontSize="11px"
                  fontWeight="700"
                  textTransform={"uppercase"}
                >
                  Serial/Sequence Code
                </Text>{" "}
                {/* <span
                    className="material-symbols-outlined"
                    style={{
                      fontSize: "22px",
                    }}
                  >
                    barcode_scanner
                  </span> */}
              </Flex>
              {selectedSite?.implantType ? (
                <Text
                  px="5"
                  py="3"
                  fontSize="11px"
                  borderRadius="6px"
                  border={"1px solid #D9D9D9"}
                  textTransform={"uppercase"}
                >
                  {siteSpecificData?.serialSequenceBarCode || "N/A"}
                </Text>
              ) : (
                <Input
                  type="text"
                  border="none"
                  fontSize={"12px"}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                    }
                  }}
                  sx={selectStyles}
                  placeholder="Scan QR here.."
                  {...register("serialSequenceBarCode")}
                />
              )}
            </Flex>
            <Flex flexDirection={"column"} gap="0.5rem">
              <Text
                fontSize="11px"
                fontWeight="700"
                textTransform={"uppercase"}
              >
                Lot Code
              </Text>
              <Input
                type="text"
                sx={selectStyles}
                placeholder="Type here..."
                {...register("lotCode")}
              />
            </Flex>
            <Flex flexDirection={"column"} gap="0.5rem">
              <Text
                fontSize="11px"
                fontWeight="700"
                textTransform={"uppercase"}
              >
                Date of Manufacture
              </Text>
              <Input
                type="date"
                sx={selectStyles}
                placeholder="Type here..."
                {...register("dateOfManufacture")}
              />
            </Flex>
            <Flex flexDirection={"column"} gap="0.5rem">
              <Text
                fontSize="11px"
                fontWeight="700"
                textTransform={"uppercase"}
              >
                Date of Expiry
              </Text>
              <Input
                type="date"
                sx={selectStyles}
                placeholder="Type here..."
                {...register("dateOfExpiry")}
              />
            </Flex>
          </>
        )}
      </SimpleGrid>
    );
  }, [
    siteSpecificData,
    fromClinlog,
    register,
    selectStyles,
    sitesArray,
    implantBrandOptions,
    implantCategoryOptions,
    implantLineOptions,
    implantTypeOptions,
  ]);
  const [addAbutment, setAddAbutment] = useState(false);
  const abutmentMatrixMemo = useMemo(() => {
    return abutmentDetailsArray?.map((item, i) => {
      if (i === 0 || addAbutment) {
        return (
          <Flex flexDirection="column" gap="12px" key={`abutment-memo-${i}`}>
            <Text
              color="#007AFF"
              fontSize="12px"
              fontWeight="800"
              fontFamily={"inter"}
              letterSpacing={"1.3px"}
              textTransform={"uppercase"}
              mt="8"
            >
              Abutment Details{" "}
              {item?.abutmentCategory
                ? `(${item?.abutmentCategory?.toUpperCase()})`
                : ""}
            </Text>
            <Divider />
            <SimpleGrid columns={3} spacing={4} mt="2">
              <Flex flexDirection={"column"} gap="0.5rem">
                <Text
                  fontSize="11px"
                  fontWeight="700"
                  textTransform={"uppercase"}
                >
                  Abutment Category
                </Text>
                {fromClinlog ? (
                  <Text
                    px="5"
                    py="3"
                    sx={selectStyles}
                    textTransform={"uppercase"}
                  >
                    {item?.abutmentCategory || "N/A"}
                  </Text>
                ) : (
                  <Select
                    sx={selectStyles}
                    {...register(`${i}_abutmentCategory`)}
                  >
                    <option value="">-- Select --</option>
                    <option value="definitive">Definitive</option>
                    <option value="provisional">Provisional</option>
                  </Select>
                )}
              </Flex>
              <Flex flexDirection={"column"} gap="0.5rem">
                <Text
                  fontSize="11px"
                  fontWeight="700"
                  textTransform={"uppercase"}
                >
                  Abutment Brand
                </Text>
                {fromClinlog ? (
                  <Text
                    px="5"
                    py="3"
                    sx={selectStyles}
                    textTransform={"uppercase"}
                  >
                    {item?.abutmentBrand ||
                      siteSpecificData?.implantBrand ||
                      "N/A"}
                  </Text>
                ) : (
                  <Select sx={selectStyles} {...register(`${i}_abutmentBrand`)}>
                    <option value="">-- Select --</option>
                    {abutmentBrandOptions}
                  </Select>
                )}
              </Flex>
              <Flex flexDirection={"column"} gap="0.5rem">
                <Text
                  fontSize="11px"
                  fontWeight="700"
                  textTransform={"uppercase"}
                >
                  Angle Correction Abutment
                </Text>
                {fromClinlog ? (
                  <Text
                    px="5"
                    py="3"
                    sx={selectStyles}
                    textTransform={"uppercase"}
                  >
                    {item?.angleCorrectionAbutment || "N/A"}
                  </Text>
                ) : (
                  <Select
                    sx={selectStyles}
                    {...register(`${i}_angleCorrectionAbutment`)}
                  >
                    <option value="">-- Select --</option>
                    {abutmentTypeOptions}
                  </Select>
                )}
              </Flex>
              <Flex flexDirection={"column"} gap="0.5rem">
                {" "}
                <Text
                  fontSize="11px"
                  fontWeight="700"
                  textTransform={"uppercase"}
                >
                  Abutment Height
                </Text>{" "}
                {fromClinlog ? (
                  <Text
                    px="5"
                    py="3"
                    sx={selectStyles}
                    textTransform={"uppercase"}
                  >
                    {item?.abutmentHeight || "N/A"}
                  </Text>
                ) : (
                  <Select
                    sx={selectStyles}
                    {...register(`${i}_abutmentHeight`)}
                  >
                    <option value="">-- Select --</option>
                    {abutmentHeightOptions}
                  </Select>
                )}
              </Flex>
              <Flex flexDirection={"column"} gap="0.5rem">
                {" "}
                <Text
                  fontSize="11px"
                  fontWeight="700"
                  textTransform={"uppercase"}
                >
                  Gingival Height
                </Text>{" "}
                {fromClinlog ? (
                  <Text
                    px="5"
                    py="3"
                    sx={selectStyles}
                    textTransform={"uppercase"}
                  >
                    {item?.gingivalHeight || "N/A"}
                  </Text>
                ) : (
                  <Select
                    sx={selectStyles}
                    {...register(`${i}_gingivalHeight`)}
                  >
                    <option value="">-- Select --</option>
                    {gingivalHeightOptions}
                  </Select>
                )}
              </Flex>
              <Flex flexDirection={"column"} gap="0.5rem">
                {" "}
                <Text
                  fontSize="11px"
                  fontWeight="700"
                  textTransform={"uppercase"}
                >
                  Angle and Diameter
                </Text>{" "}
                {fromClinlog ? (
                  <Text
                    px="5"
                    py="3"
                    sx={selectStyles}
                    textTransform={"uppercase"}
                  >
                    {item?.typeAndDiameter || "N/A"}
                  </Text>
                ) : (
                  <Select
                    sx={selectStyles}
                    py="1px"
                    {...register(`${i}_typeAndDiameter`)}
                  >
                    <option value="">-- Select --</option>
                    {typeAndDiameterOptions}
                  </Select>
                )}
              </Flex>
              {!fromClinlog && (
                <>
                  <Flex flexDirection={"column"} gap="0.5rem">
                    <Flex gap="0.5rem" alignItems="center">
                      {" "}
                      <Text
                        fontSize="11px"
                        fontWeight="700"
                        textTransform={"uppercase"}
                      >
                        Abutment Serial/Sequence Code
                      </Text>{" "}
                    </Flex>
                    {selectedSite?.angleCorrectionAbutment ? (
                      <Text
                        px="5"
                        py="3"
                        fontSize="11px"
                        borderRadius="6px"
                        border={"1px solid #D9D9D9"}
                        textTransform={"uppercase"}
                      >
                        {item?.abutmentSerialSequenceBarCode || "N/A"}
                      </Text>
                    ) : (
                      <Input
                        type="text"
                        border="none"
                        fontSize={"12px"}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                          }
                        }}
                        sx={selectStyles}
                        placeholder="Scan QR here.."
                        {...register(`${i}_abutmentSerialSequenceBarCode`)}
                      />
                    )}
                  </Flex>
                  <Flex flexDirection={"column"} gap="0.5rem">
                    <Text
                      fontSize="11px"
                      fontWeight="700"
                      textTransform={"uppercase"}
                    >
                      Lot Code
                    </Text>
                    <Input
                      type="text"
                      sx={selectStyles}
                      placeholder="Type here..."
                      {...register(`${i}_abutmentLotCode`)}
                    />
                  </Flex>
                  <Flex flexDirection={"column"} gap="0.5rem">
                    <Text
                      fontSize="11px"
                      fontWeight="700"
                      textTransform={"uppercase"}
                    >
                      Date of Manufacture
                    </Text>
                    <Input
                      type="date"
                      sx={selectStyles}
                      placeholder="Type here..."
                      {...register(`${i}_abutmentDateOfManufacture`)}
                    />
                  </Flex>
                  <Flex flexDirection={"column"} gap="0.5rem">
                    <Text
                      fontSize="11px"
                      fontWeight="700"
                      textTransform={"uppercase"}
                    >
                      Date of Expiry
                    </Text>
                    <Input
                      type="date"
                      sx={selectStyles}
                      placeholder="Type here..."
                      {...register(`${i}_abutmentDateOfExpiry`)}
                    />
                  </Flex>
                </>
              )}
            </SimpleGrid>
          </Flex>
        );
      }
    });
  }, [
    abutmentDetailsArray,
    abutmentBrandOptions,
    abutmentTypeOptions,
    abutmentHeightOptions,
    gingivalHeightOptions,
    typeAndDiameterOptions,
    fromClinlog,
    selectStyles,
    siteSpecificData,
    abutmentBrand,
  ]);
  //start from above memo

  useEffect(() => {
    // Combine the data from both queries into
    const components_data = [
      ...(fetchDentalComponentsQueryResult?.data?.entries || []),
    ];

    setImplantsData(
      components_data.filter((entry) => entry.typeHandle === "implantList"),
    );
    setAbutmentsData(
      components_data.filter((entry) => entry.typeHandle === "abutmentList"),
    );

    setCombinedData(components_data);
  }, [fetchDentalComponentsQueryResult?.data]);

  useEffect(() => {
    if (siteSpecificData) {
      setValue("implantBrand", siteSpecificData?.implantBrand);
      setValue("implantCategory", siteSpecificData?.implantCategory);
      setValue("implantLine", siteSpecificData?.implantLine);
      setValue("surface", siteSpecificData?.surface);
      setValue(
        "implantBaseAndDiameter",
        siteSpecificData?.implantBaseAndDiameter,
      );
      setValue("implantType", siteSpecificData?.implantType);
      setValue("implantLength", siteSpecificData?.implantLength);
      setValue(
        "serialSequenceBarCode",
        siteSpecificData?.serialSequenceBarCode,
      );
      setValue(
        "lotCode",
        siteSpecificData?.lotCode ||
          handleGs1Conversion(siteSpecificData?.serialSequenceBarCode)
            ?.lotCode ||
          "",
      );
      setValue(
        "dateOfManufacture",
        siteSpecificData?.dateOfManufacture
          ? format(new Date(siteSpecificData?.dateOfManufacture), "yyyy-MM-dd")
          : parseYYMMDD(
              handleGs1Conversion(siteSpecificData?.serialSequenceBarCode)
                ?.dateOfManufacture,
            ) || "",
      );
      setValue(
        "dateOfExpiry",
        siteSpecificData?.dateOfExpiry
          ? format(new Date(siteSpecificData?.dateOfExpiry), "yyyy-MM-dd")
          : parseYYMMDD(
              handleGs1Conversion(siteSpecificData?.serialSequenceBarCode)
                ?.dateOfExpiry,
            ) || "",
      );
      //for older entries, no abutment brand so used implant brand
      setValue(
        "abutmentBrand",
        siteSpecificData?.abutmentBrand || siteSpecificData?.implantBrand,
      );
      setValue("abutmentCategory", siteSpecificData?.abutmentCategory);
      setValue("typeAndDiameter", siteSpecificData?.typeAndDiameter);
      setValue("gingivalHeight", siteSpecificData?.gingivalHeight);
      setValue("abutmentHeight", siteSpecificData?.abutmentHeight);
      setValue("abutmentLength", siteSpecificData?.abutmentLength);
      setValue(
        "angleCorrectionAbutment",
        siteSpecificData?.angleCorrectionAbutment,
      );
      setValue(
        "abutmentSerialSequenceBarCode",
        siteSpecificData?.abutmentSerialSequenceBarCode,
      );
      setValue("abutmentType", siteSpecificData?.abutmentType);
      setValue("placement", siteSpecificData?.placement);
      setValue(
        "trabecularBoneDensity",
        siteSpecificData?.trabecularBoneDensity,
      );
      setValue("boneVascularity", siteSpecificData?.boneVascularity);
      setValue("graftingApplied", siteSpecificData?.graftingApplied);
      setValue("graftMaterial", siteSpecificData?.graftMaterial);
      setValue(
        "intraOperativeSinusComplications",
        siteSpecificData?.intraOperativeSinusComplications,
      );
      setValue("crestalRest", siteSpecificData?.crestalRest);
      setValue("insertionTorque", siteSpecificData?.insertionTorque);
      setValue(
        "radiographicTrabecularDensityHu",
        siteSpecificData?.radiographicTrabecularDensityHu || "N/A",
      );
      setValue("relevantBoneWidth", siteSpecificData?.relevantBoneWidth);
      setValue(
        "preOperativeSinusDisease",
        siteSpecificData?.preOperativeSinusDisease,
      );
      setValue(
        "preOperativeSinusDiseaseManagement",
        siteSpecificData?.preOperativeSinusDiseaseManagement,
      );
      setValue(
        "conformanceWithTreatmentPlan",
        siteSpecificData?.conformanceWithTreatmentPlan,
      );
      setValue("prf", siteSpecificData?.prf);
    }
    if (abutmentDetailsData?.length > 0) {
      if (abutmentDetailsData?.length === 1) {
        const updatedAbutmentDetails = [
          ...abutmentDetailsData,
          {
            id: `new-abutment-1`,
            abutmentBrand: "",
            abutmentCategory: "",
            angleCorrectionAbutment: "",
            abutmentLength: "",
            abutmentHeight: "",
            gingivalHeight: "",
            typeAndDiameter: "",
            abutmentSerialSequenceBarCode: "",
          },
        ];
        setAbutmentDetailsArray(updatedAbutmentDetails);
      } else {
        setAbutmentDetailsArray(abutmentDetailsData);
        setAddAbutment(true);
      }
      abutmentDetailsData.forEach((item, index) => {
        setValue(
          `${index}_abutmentBrand`,
          item?.abutmentBrand || siteSpecificData?.implantBrand,
        );
        setValue(
          `${index}_abutmentCategory`,
          item?.abutmentCategory || siteSpecificData?.abutmentCategory,
        );
        setValue(
          `${index}_gingivalHeight`,
          item?.gingivalHeight || siteSpecificData?.gingivalHeight,
        );
        setValue(
          `${index}_angleCorrectionAbutment`,
          item?.angleCorrectionAbutment,
        );
        setValue(`${index}_abutmentLength`, item?.abutmentLength);
        setValue(
          `${index}_abutmentHeight`,
          item?.abutmentHeight || siteSpecificData?.abutmentHeight,
        );
        setValue(
          `${index}_abutmentSerialSequenceBarCode`,
          item?.abutmentSerialSequenceBarCode,
        );
        setValue(
          `${index}_typeAndDiameter`,
          item?.typeAndDiameter || siteSpecificData?.typeAndDiameter,
        );
        setValue(
          `${index}_abutmentLotCode`,
          item?.abutmentLotCode ||
            handleGs1Conversion(item?.abutmentSerialSequenceBarCode)?.lotCode ||
            "",
        );
        setValue(
          `${index}_abutmentDateOfManufacture`,
          item?.abutmentDateOfManufacture
            ? format(new Date(item?.abutmentDateOfManufacture), "yyyy-MM-dd")
            : parseYYMMDD(
                handleGs1Conversion(item?.abutmentSerialSequenceBarCode)
                  ?.dateOfManufacture,
              ) || "",
        );
        setValue(
          `${index}_abutmentDateOfExpiry`,
          item?.abutmentDateOfExpiry
            ? format(new Date(item?.abutmentDateOfExpiry), "yyyy-MM-dd")
            : parseYYMMDD(
                handleGs1Conversion(item?.abutmentSerialSequenceBarCode)
                  ?.dateOfExpiry,
              ) || "",
        );
      });
    } else {
      setAbutmentDetailsArray([
        {
          id: "new-abutment-0",
          abutmentBrand: "",
          abutmentCategory: "",
          angleCorrectionAbutment: "",
          abutmentLength: "",
          abutmentHeight: "",
          gingivalHeight: "",
          typeAndDiameter: "",
          abutmentSerialSequenceBarCode: "",
        },
        {
          id: "new-abutment-1",
          abutmentBrand: "",
          abutmentCategory: "",
          angleCorrectionAbutment: "",
          abutmentLength: "",
          abutmentHeight: "",
          gingivalHeight: "",
          typeAndDiameter: "",
          abutmentSerialSequenceBarCode: "",
        },
      ]);
    }
  }, [siteSpecificData, selectedSite, implantsData, abutmentsData]);

  useEffect(() => {
    if (barSpecificDetails) {
      setValue(
        "barMaterial",
        selectedSite?.attachedSiteSpecificRecords?.[0]?.barMaterial?.toLowerCase(),
      );
      setValue(
        "archLocation",
        selectedSite?.attachedSiteSpecificRecords?.[0]?.archLocation?.toLowerCase(),
      );
      setValue(
        "barLengthFrom",
        Number(selectedSite?.attachedSiteSpecificRecords?.[0]?.barLengthFrom),
      );
      setValue(
        "barLengthTo",
        Number(selectedSite?.attachedSiteSpecificRecords?.[0]?.barLengthTo),
      );
      setValue(
        "barType",
        selectedSite?.attachedSiteSpecificRecords?.[0]?.barType,
      );
      setValue(
        "finalProstheticMaterial",
        selectedSite?.attachedSiteSpecificRecords?.[0]?.finalProstheticMaterial,
      );
      setValue(
        "provisionalMaterial",
        selectedSite?.attachedSiteSpecificRecords?.[0]?.provisionalMaterial,
      );
      setValue(
        "reinforcementOfFinalProsthetic",
        selectedSite?.attachedSiteSpecificRecords?.[0]
          ?.reinforcementOfFinalProsthetic,
      );
    } else {
      setValue("barMaterial", "");
      setValue("archLocation", "");
      setValue("barLengthFrom", 0);
      setValue("barLengthTo", 15);
      setValue("barType", "");
      setValue("finalProstheticMaterial", "");
      setValue("provisionalMaterial", "");
      setValue("reinforcementOfFinalProsthetic", "");
    }
  }, [barSpecificDetails, selectedSite]);

  const fakeDatabase = {
    "0107630031737922": {
      category: "abutment",
      brand: "straumann",
      type: "Straight 4.5mm",
      length: "1.5mm",
      serial: "0107630031737922",
    },
    "0107630031736543": {
      category: "implant",
      brand: "straumann",
      type: "BLX ø3.75mm",
      length: "18.0mm",
      serial: "0107630031736543",
    },
  };

  // useEffect(() => {
  //   if (getValues("serialSequenceBarCode")) {
  //     const localRefString = getValues("serialSequenceBarCode").slice(0, 16);
  //     const foundItem = implantsData?.find((item) => {
  //       if (item?.referenceNumber?.length < 16) {
  //         return `0${item?.referenceNumber}` === localRefString;
  //       }
  //     });

  //     setValue("implantBrand", foundItem?.brand);
  //     setValue("implantType", foundItem?.implantType);
  //     setValue("implantLength", foundItem?.implantLength);
  //     setValue("lotCode", getValues("serialSequenceBarCode").slice(-5));
  //     setValue(
  //       "dateOfExpiry",
  //       parseYYMMDD(getValues("serialSequenceBarCode").slice(-13, -7))
  //     );
  //     setValue(
  //       "dateOfManufacture",
  //       parseYYMMDD(getValues("serialSequenceBarCode").slice(-21, -15))
  //     );
  //   }
  // }, [getValues("serialSequenceBarCode")]);

  // useEffect(() => {
  //   if (getValues("abutmentSerialSequenceBarCode")) {
  //     const localRefString = getValues("abutmentSerialSequenceBarCode").slice(
  //       0,
  //       16
  //     );
  //     const foundItem = abutmentsData?.find((item) => {
  //       if (item?.referenceNumber?.length < 16) {
  //         return `0${item?.referenceNumber}` === localRefString;
  //       }
  //     });
  //     setValue("angleCorrectionAbutment", foundItem?.angleCorrectionAbutment);
  //     setValue("abutmentBrand", foundItem?.brand);
  //     setValue("abutmentLength", foundItem?.abutmentLength);
  //     setValue(
  //       "abutmentLotCode",
  //       getValues("abutmentSerialSequenceBarCode").slice(-5)
  //     );
  //     setValue(
  //       "abutmentDateOfExpiry",
  //       parseYYMMDD(getValues("abutmentSerialSequenceBarCode").slice(-13, -7))
  //     );
  //     setValue(
  //       "abutmentDateOfManufacture",
  //       parseYYMMDD(getValues("abutmentSerialSequenceBarCode").slice(-21, -15))
  //     );
  //   }
  // }, [getValues("abutmentSerialSequenceBarCode")]);

  const createSiteSpecificMutation = gql`
    mutation createSiteSpecificMutation(
      $title: String!
      $attachedSiteSpecificFollowUp: [Int]
      $itemSpecificationMatrixBlocks: [itemSpecificationMatrix_MatrixBlockContainerInput]
      $itemSpecificationMatrixSortOrder: [QueryArgument]
      $abutmentDetailsMatrixBlocks: [abutmentDetailsMatrix_MatrixBlockContainerInput]
      $abutmentDetailsMatrixSortOrder: [QueryArgument]
    ) {
      save_treatmentItemSpecificationRecord_itemSpecificationAndDetails_Entry(
        title: $title
        attachedSiteSpecificFollowUp: $attachedSiteSpecificFollowUp
        itemSpecificationMatrix: {
          blocks: $itemSpecificationMatrixBlocks
          sortOrder: $itemSpecificationMatrixSortOrder
        }
        abutmentDetailsMatrix: {
          blocks: $abutmentDetailsMatrixBlocks
          sortOrder: $abutmentDetailsMatrixSortOrder
        }
      ) {
        id
      }
    }
  `;

  const updateSiteSpecificMutation = gql`
    mutation siteSpecificMutation(
      $id: ID!
      $attachedSiteSpecificFollowUp: [Int]
      $itemSpecificationMatrixBlocks: [itemSpecificationMatrix_MatrixBlockContainerInput]
      $itemSpecificationMatrixSortOrder: [QueryArgument]
      $abutmentDetailsMatrixBlocks: [abutmentDetailsMatrix_MatrixBlockContainerInput]
      $abutmentDetailsMatrixSortOrder: [QueryArgument]
    ) {
      save_treatmentItemSpecificationRecord_itemSpecificationAndDetails_Entry(
        id: $id
        attachedSiteSpecificFollowUp: $attachedSiteSpecificFollowUp
        itemSpecificationMatrix: {
          blocks: $itemSpecificationMatrixBlocks
          sortOrder: $itemSpecificationMatrixSortOrder
        }
        abutmentDetailsMatrix: {
          blocks: $abutmentDetailsMatrixBlocks
          sortOrder: $abutmentDetailsMatrixSortOrder
        }
      ) {
        id
      }
    }
  `;

  const createBarSpecificMutation = gql`
    mutation createBarSpecificMutation(
      $title: String!
      $archLocation: String
      $barLengthFrom: String
      $barLengthTo: String
      $barMaterial: String
      $barType: String
      $provisionalMaterial: String
      $finalProstheticMaterial: String
      $reinforcementOfFinalProsthetic: String
    ) {
      save_treatmentItemSpecificationRecord_barSpecifications_Entry(
        title: $title
        archLocation: $archLocation
        barLengthFrom: $barLengthFrom
        barLengthTo: $barLengthTo
        barMaterial: $barMaterial
        barType: $barType
        provisionalMaterial: $provisionalMaterial
        finalProstheticMaterial: $finalProstheticMaterial
        reinforcementOfFinalProsthetic: $reinforcementOfFinalProsthetic
      ) {
        id
      }
    }
  `;

  const updateBarSpecificMutation = gql`
    mutation updateBarSpecificMutation(
      $id: ID!
      $archLocation: String
      $barLengthFrom: String
      $barLengthTo: String
      $barMaterial: String
      $barType: String
      $provisionalMaterial: String
      $finalProstheticMaterial: String
      $reinforcementOfFinalProsthetic: String
    ) {
      save_treatmentItemSpecificationRecord_barSpecifications_Entry(
        id: $id
        archLocation: $archLocation
        barLengthFrom: $barLengthFrom
        barLengthTo: $barLengthTo
        barMaterial: $barMaterial
        provisionalMaterial: $provisionalMaterial
        finalProstheticMaterial: $finalProstheticMaterial
        reinforcementOfFinalProsthetic: $reinforcementOfFinalProsthetic
        barType: $barType
      ) {
        id
      }
    }
  `;

  const updateDentalChartMutationFunction = useMutation<
    any,
    unknown,
    any,
    { previousDetails?: any }
  >((newData: any) => sendData(treatmentPlanItemsMutation, newData), {
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
            Saving Plan Items ...
            <Spinner color="white" />
          </Flex>
        ),
        duration: 100000,
        isClosable: true,
      });

      // Optimistically update the cached record details so dependent UIs
      // (like treatment summaries) feel responsive while the mutation runs.
      if (globalPostId) {
        await queryClient.cancelQueries(["detailsPageNew", globalPostId]);
        const previousDetails = queryClient.getQueryData([
          "detailsPageNew",
          globalPostId,
        ]);

        queryClient.setQueryData(
          ["detailsPageNew", globalPostId],
          (old: any) => {
            if (!old?.entry) return old;

            // Shallowly merge updated chart data into any matching attached chart
            // so UI elements that read from detailsPageNew see the change immediately.
            const updatedEntry = {
              ...old.entry,
              attachedDentalCharts: (old.entry.attachedDentalCharts || []).map(
                (chart: any) =>
                  chart.id === String(newData.id) ||
                  chart.id === Number(newData.id)
                    ? { ...chart, ...newData }
                    : chart,
              ),
            };

            return { ...old, entry: updatedEntry };
          },
        );

        return { previousDetails };
      }

      return {};
    },
    onError: (err, newData, context) => {
      toast.update(toastIdRef.current, {
        description: "Error - Could not save Plan Items",
        status: "error",
        duration: 3000,
        isClosable: true,
      });

      if (globalPostId && context?.previousDetails) {
        queryClient.setQueryData(
          ["detailsPageNew", globalPostId],
          context.previousDetails,
        );
      }
    },
    onSuccess: (data, newData) => {
      toast.update(toastIdRef.current, {
        description: "Saved Plan Items successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      return data;
    },
    onSettled: () => {
      updateDentalChartMutationFunction.reset();

      if (globalPostId) {
        queryClient.invalidateQueries(["detailsPageNew", globalPostId]);
      } else {
        queryClient.invalidateQueries(["detailsPageNew"]);
      }
      if (proposedTreatmentChartIds && proposedTreatmentChartIds.length > 0) {
        queryClient.invalidateQueries([
          "proposedTreatmentChartResults",
          ...proposedTreatmentChartIds,
        ]);
      }
    },
  });

  const createSiteSpecificMutate = useMutation<
    any,
    unknown,
    { formData: any; site: string | number },
    { previousCharts?: any }
  >(
    ({ formData }) => {
      return sendData(createSiteSpecificMutation, formData);
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
              Creating Site Specific Entry ...
              <Spinner color="white" />
            </Flex>
          ),
          duration: 100000,
          isClosable: true,
        });

        // Optimistically mark site as having specs so table shows "Active"
        if (
          proposedTreatmentChartIds &&
          proposedTreatmentChartIds.length > 0 &&
          approvedProposal
        ) {
          const queryKey = [
            "proposedTreatmentChartResults",
            ...proposedTreatmentChartIds,
          ];

          await queryClient.cancelQueries(queryKey);
          const previousCharts = queryClient.getQueryData(queryKey);

          queryClient.setQueryData(queryKey, (old: any) => {
            if (!old?.data?.entries) return old;

            const updatedEntries = old.data.entries.map((entry: any) => {
              if (entry.id !== approvedProposal.id) return entry;

              const currentMatrix = entry.proposedTreatmentToothMatrix || [];

              // Only care about existing rows (so hasSpecs flips from "Add Data" to "Active")
              if (selectedSite) {
                const updatedMatrix = currentMatrix.map((tooth: any) => {
                  if (
                    tooth.toothValue === selectedSite.toothValue &&
                    tooth.treatmentItemNumber !== "661"
                  ) {
                    const existing = tooth.attachedSiteSpecificRecords || [];
                    return {
                      ...tooth,
                      attachedSiteSpecificRecords:
                        existing.length > 0
                          ? existing
                          : [
                              {
                                id: "temp-site-specific",
                              },
                            ],
                    };
                  }
                  return tooth;
                });

                return {
                  ...entry,
                  proposedTreatmentToothMatrix: updatedMatrix,
                };
              }

              return entry;
            });

            return {
              ...old,
              data: {
                ...old.data,
                entries: updatedEntries,
              },
            };
          });

          return { previousCharts };
        }

        return {};
      },
      onError: (err, newTodo, context) => {
        toast.update(toastIdRef.current, {
          description: "Couldn't Create Site Specific Entry",
          status: "error",
          duration: 3000,
          isClosable: true,
        });

        if (
          proposedTreatmentChartIds &&
          proposedTreatmentChartIds.length > 0 &&
          context?.previousCharts
        ) {
          queryClient.setQueryData(
            ["proposedTreatmentChartResults", ...proposedTreatmentChartIds],
            context.previousCharts,
          );
        }
      },
      onSuccess: (data, newData) => {
        //add condition to check if selected site is null
        const siteMatrix = approvedProposal?.proposedTreatmentToothMatrix?.map(
          (item) => {
            if (selectedSite && item.toothValue === selectedSite?.toothValue) {
              return {
                toothDetails: {
                  ...item,
                  completed: false,
                  dentist: item?.dentist?.map((doc) => Number(doc?.id)),
                  attachedSiteSpecificRecords: [
                    Number(
                      data
                        ?.save_treatmentItemSpecificationRecord_itemSpecificationAndDetails_Entry
                        ?.id,
                    ),
                  ],
                },
              };
            } else {
              return {
                toothDetails: {
                  ...item,
                  dentist: item?.dentist?.map((doc) => Number(doc?.id)),
                  attachedSiteSpecificRecords:
                    item?.attachedSiteSpecificRecords?.map((item) =>
                      Number(item.id),
                    ),
                },
              };
            }
          },
        );
        let newSite = [];
        if (selectedSite === null || selectedSite?.id?.includes("new")) {
          //add condition to check if selected site from chart scanner

          const implantData = {
            toothDetails: {
              id: "new_0",
              //@ts-ignore
              toothValue: newData?.site,
              toothPosition: ["all"],
              treatmentItemNumber: "688",
              treatmentItemTitle:
                "Insertion of a one-stage endosseous implant – per implant",
              approved: false,
              completed: false,
              cost: "2250.98",
              groupTitleParent: "Additional Items",
              groupTitle: "Implant Surgery",
              treatmentNotes: "Added During Surgery",
              attachedSiteSpecificRecords: [
                Number(
                  data
                    ?.save_treatmentItemSpecificationRecord_itemSpecificationAndDetails_Entry
                    ?.id,
                ),
              ],
            },
          };
          const abutmentData = {
            toothDetails: {
              id: "new_1",
              //@ts-ignore
              toothValue: newData?.site,
              toothPosition: ["all"],
              treatmentItemNumber: "661",
              treatmentItemTitle: "Fitting of implant abutment – per abutment",
              approved: false,
              completed: false,
              cost: "1130.41",
              groupTitleParent: "Additional Items",
              groupTitle: "Implant Surgery",
              treatmentNotes: "Added During Surgery",
              attachedSiteSpecificRecords: [
                Number(
                  data
                    ?.save_treatmentItemSpecificationRecord_itemSpecificationAndDetails_Entry
                    ?.id,
                ),
              ],
            },
          };
          newSite = [implantData, abutmentData];
        }
        const updatedData = {
          id: approvedProposal?.id,
          proposedTreatmentToothMatrixBlocks: [
            ...(siteMatrix || []),
            ...(newSite || []),
          ],
          proposedTreatmentToothMatrixSortOrder: [
            ...approvedProposal?.proposedTreatmentToothMatrix?.map(
              (item) => item?.id,
            ),
            ...newSite.map((item) => item?.toothDetails?.id),
          ],
        };

        updateDentalChartMutationFunction.mutate(updatedData);

        // Let parent table optimistically treat this site as having specs
        const savedSite = selectedSite?.toothValue ?? (newData as any)?.site;
        if (onSiteSaved && savedSite) {
          onSiteSaved(savedSite);
        }

        toast.update(toastIdRef.current, {
          description: "Successfully Created Site Specific Entry",
          status: "success",
          duration: 3000,
          isClosable: true,
        });

        onSidebarClose();
      },
      onSettled: () => {
        createSiteSpecificMutate.reset();
        // queryClient.invalidateQueries(["detailsPageNew"]);
        if (proposedTreatmentChartIds && proposedTreatmentChartIds.length > 0) {
          queryClient.invalidateQueries([
            "proposedTreatmentChartResults",
            ...proposedTreatmentChartIds,
          ]);
        }
      },
    },
  );

  const createBarSpecificMutate = useMutation(
    (formData: any) => {
      return sendData(createBarSpecificMutation, formData);
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
              Creating Site Specific Entry ...
              <Spinner color="white" />
            </Flex>
          ),
          duration: 100000,
          isClosable: true,
        });
      },
      onError: (err, newTodo, context) => {
        toast.update(toastIdRef.current, {
          description: "Couldn't Create Bar Specific Entry",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      },
      onSuccess: (data: any) => {
        //add condition to check if selected site is null
        const siteMatrix = approvedProposal?.proposedTreatmentToothMatrix?.map(
          (item) => {
            if (item.id === selectedSite?.id) {
              return {
                toothDetails: {
                  ...item,
                  dentist: item?.dentist?.map((doc) => Number(doc?.id)),
                  attachedSiteSpecificRecords: [
                    Number(
                      data
                        ?.save_treatmentItemSpecificationRecord_barSpecifications_Entry
                        ?.id,
                    ),
                  ],
                },
              };
            } else {
              return {
                toothDetails: {
                  ...item,
                  dentist: item?.dentist?.map((doc) => Number(doc?.id)),
                  attachedSiteSpecificRecords:
                    item?.attachedSiteSpecificRecords?.map((item) =>
                      Number(item.id),
                    ),
                },
              };
            }
          },
        );
        const updatedData = {
          id: approvedProposal?.id,
          proposedTreatmentToothMatrixBlocks: siteMatrix || [],
          proposedTreatmentToothMatrixSortOrder:
            approvedProposal?.proposedTreatmentToothMatrix?.map(
              (item) => item?.id,
            ),
        };
        updateDentalChartMutationFunction.mutate(updatedData);

        const savedSite = selectedSite?.toothValue;
        if (onSiteSaved && savedSite) {
          onSiteSaved(savedSite);
        }

        toast.update(toastIdRef.current, {
          description: "Successfully Created Bar Specific Entry",
          status: "success",
          duration: 3000,
          isClosable: true,
        });

        onSidebarClose();
      },
      onSettled: () => {
        createBarSpecificMutate.reset();
      },
    },
  );
  const updateSiteSpecificMutate = useMutation(
    (formData: any) => {
      return sendData(updateSiteSpecificMutation, formData);
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
              Updating Site Specific Data ...
              <Spinner color="white" />
            </Flex>
          ),
          duration: 100000,
          isClosable: true,
        });
      },
      onError: (err, newTodo, context) => {
        toast.update(toastIdRef.current, {
          description: "Couldn't Update Site Specific Data",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      },
      onSuccess: (data) => {
        toast.update(toastIdRef.current, {
          description: "Successfully updated Site Specific Data",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      },
      onSettled: () => {
        if (proposedTreatmentChartIds && proposedTreatmentChartIds.length > 0) {
          queryClient.invalidateQueries([
            "proposedTreatmentChartResults",
            ...proposedTreatmentChartIds,
          ]);
        }
        //  onSidebarClose();
      },
    },
  );
  const updateBarSpecificMutate = useMutation(
    (formData: any) => {
      return sendData(updateBarSpecificMutation, formData);
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
              Updating Bar Specifications Data ...
              <Spinner color="white" />
            </Flex>
          ),
          duration: 100000,
          isClosable: true,
        });
      },
      onError: (err, newTodo, context) => {
        toast.update(toastIdRef.current, {
          description: "Couldn't Update Bar Specifications Data",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      },
      onSuccess: (data) => {
        toast.update(toastIdRef.current, {
          description: "Successfully updated Bar Specifications Data",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      },
      onSettled: () => {
        if (proposedTreatmentChartIds && proposedTreatmentChartIds.length > 0) {
          queryClient.invalidateQueries([
            "proposedTreatmentChartResults",
            ...proposedTreatmentChartIds,
          ]);
        }
      },
    },
  );

  const onSiteSpecificSubmit = (data) => {
    //check for selected site null or not

    if (selectedSite) {
      if (data?.siteId === "new") {
        if (selectedSite?.treatmentItemNumber === "666") {
          const newData = {
            title:
              patientName +
              " - " +
              data?.archLocation +
              " Arch Retainer - " +
              "Bar Specific - " +
              format(new Date(), "dd MMM yyyy HH:mm"),
            archLocation: data?.archLocation,
            barLengthFrom: data.barLengthFrom.toString(),
            barLengthTo: data.barLengthTo.toString(),
            barMaterial: data?.barMaterial,
            barType: data?.barType,
            provisionalMaterial: data?.provisionalMaterial,
            finalProstheticMaterial: data?.finalProstheticMaterial,
            reinforcementOfFinalProsthetic:
              data?.reinforcementOfFinalProsthetic,
          };
          createBarSpecificMutate.mutate(newData);
        } else {
          const newData = {
            title:
              patientName +
              " - " +
              selectedSite?.toothValue +
              " - " +
              "Site Specific - " +
              format(new Date(), "dd MMM yyyy HH:mm"),
            attachedSiteSpecificFollowUp: [],
            itemSpecificationMatrixBlocks: [
              {
                itemSpecs: {
                  id: "new_0",
                  enableInClinlog: true,
                  implantBrand: data?.implantBrand,
                  implantCategory: data?.implantCategory,
                  implantLine: data?.implantLine,
                  surface: data?.surface,
                  implantBaseAndDiameter: data?.implantBaseAndDiameter,
                  implantType: data?.implantType,
                  implantLength: data?.implantLength,
                  angleCorrectionAbutment: data?.angleCorrectionAbutment,
                  abutmentBrand: data?.abutmentBrand,
                  abutmentLength: data?.abutmentLength,
                  abutmentSerialSequenceBarCode:
                    data?.abutmentSerialSequenceBarCode || "",
                  serialSequenceBarCode: data?.serialSequenceBarCode || "",
                  placement: data?.placement,
                  trabecularBoneDensity: data?.trabecularBoneDensity,
                  boneVascularity: data?.boneVascularity,
                  graftingApplied: data?.graftingApplied,
                  graftMaterial: data?.graftMaterial,
                  intraOperativeSinusComplications:
                    data?.intraOperativeSinusComplications,
                  crestalRest: data?.crestalRest,
                  insertionTorque: data?.insertionTorque,
                  radiographicTrabecularDensityHu:
                    data?.radiographicTrabecularDensityHu || "",
                  relevantBoneWidth: data?.relevantBoneWidth,
                  preOperativeSinusDisease: data?.preOperativeSinusDisease,
                  preOperativeSinusDiseaseManagement:
                    data?.preOperativeSinusDiseaseManagement,
                  conformanceWithTreatmentPlan:
                    data?.conformanceWithTreatmentPlan,
                  prf: data?.prf,
                  lotCode:
                    data?.lotCode ||
                    handleGs1Conversion(data?.serialSequenceBarCode)?.lotCode ||
                    "",
                  dateOfManufacture:
                    data?.dateOfManufacture ||
                    parseYYMMDD(
                      handleGs1Conversion(data?.serialSequenceBarCode)
                        ?.dateOfManufacture,
                    ) ||
                    "",
                  dateOfExpiry:
                    data?.dateOfExpiry ||
                    parseYYMMDD(
                      handleGs1Conversion(data?.serialSequenceBarCode)
                        ?.dateOfExpiry,
                    ) ||
                    "",
                },
              },
            ],
            itemSpecificationMatrixSortOrder: ["new_0"],
            abutmentDetailsMatrixBlocks: addAbutment
              ? [
                  {
                    abutment: {
                      id: "new_abutment_0",
                      abutmentBrand: data?.["0_abutmentBrand"],
                      abutmentCategory: data?.["0_abutmentCategory"],
                      typeAndDiameter: data?.["0_typeAndDiameter"],
                      gingivalHeight: data?.["0_gingivalHeight"],
                      abutmentHeight: data?.["0_abutmentHeight"],
                      abutmentLength: data?.["0_abutmentLength"],
                      angleCorrectionAbutment:
                        data?.["0_angleCorrectionAbutment"],
                      abutmentSerialSequenceBarCode:
                        data?.["0_abutmentSerialSequenceBarCode"] || "",
                      abutmentLotCode:
                        data?.["0_abutmentLotCode"] ||
                        handleGs1Conversion(
                          data?.["0_abutmentSerialSequenceBarCode"],
                        )?.lotCode ||
                        "",
                      abutmentDateOfManufacture:
                        data?.["0_abutmentDateOfManufacture"] ||
                        parseYYMMDD(
                          handleGs1Conversion(
                            data?.["0_abutmentSerialSequenceBarCode"],
                          )?.dateOfManufacture,
                        ) ||
                        "",
                      abutmentDateOfExpiry:
                        data?.["0_abutmentDateOfExpiry"] ||
                        parseYYMMDD(
                          handleGs1Conversion(
                            data?.["0_abutmentSerialSequenceBarCode"],
                          )?.dateOfExpiry,
                        ) ||
                        "",
                    },
                  },
                  {
                    abutment: {
                      id: "new_abutment_1",
                      abutmentBrand: data?.["1_abutmentBrand"],
                      abutmentCategory: data?.["1_abutmentCategory"],
                      typeAndDiameter: data?.["1_typeAndDiameter"],
                      gingivalHeight: data?.["1_gingivalHeight"],
                      abutmentHeight: data?.["1_abutmentHeight"],
                      abutmentLength: data?.["1_abutmentLength"],
                      angleCorrectionAbutment:
                        data?.["1_angleCorrectionAbutment"],
                      abutmentSerialSequenceBarCode:
                        data?.["1_abutmentSerialSequenceBarCode"] || "",
                      abutmentLotCode:
                        data?.["1_abutmentLotCode"] ||
                        handleGs1Conversion(
                          data?.["1_abutmentSerialSequenceBarCode"],
                        )?.lotCode ||
                        "",
                      abutmentDateOfManufacture:
                        data?.["1_abutmentDateOfManufacture"] ||
                        parseYYMMDD(
                          handleGs1Conversion(
                            data?.["1_abutmentSerialSequenceBarCode"],
                          )?.dateOfManufacture,
                        ) ||
                        "",
                      abutmentDateOfExpiry:
                        data?.["1_abutmentDateOfExpiry"] ||
                        parseYYMMDD(
                          handleGs1Conversion(
                            data?.["1_abutmentSerialSequenceBarCode"],
                          )?.dateOfExpiry,
                        ) ||
                        "",
                    },
                  },
                ]
              : data?.["0_abutmentCategory"]?.length > 0
                ? [
                    {
                      abutment: {
                        id: "new_abutment_0",
                        abutmentBrand: data?.["0_abutmentBrand"] || "",
                        abutmentCategory: data?.["0_abutmentCategory"] || "",
                        typeAndDiameter: data?.["0_typeAndDiameter"] || "",
                        gingivalHeight: data?.["0_gingivalHeight"] || "",
                        abutmentHeight: data?.["0_abutmentHeight"] || "",
                        abutmentLength: data?.["0_abutmentLength"] || "",
                        angleCorrectionAbutment:
                          data?.["0_angleCorrectionAbutment"] || "",
                        abutmentSerialSequenceBarCode:
                          data?.["0_abutmentSerialSequenceBarCode"] || "",
                        abutmentLotCode:
                          data?.["0_abutmentLotCode"] ||
                          handleGs1Conversion(
                            data?.["0_abutmentSerialSequenceBarCode"],
                          )?.lotCode ||
                          "",
                        abutmentDateOfManufacture:
                          data?.["0_abutmentDateOfManufacture"] ||
                          parseYYMMDD(
                            handleGs1Conversion(
                              data?.["0_abutmentSerialSequenceBarCode"],
                            )?.dateOfManufacture,
                          ) ||
                          "",
                        abutmentDateOfExpiry:
                          data?.["0_abutmentDateOfExpiry"] ||
                          parseYYMMDD(
                            handleGs1Conversion(
                              data?.["0_abutmentSerialSequenceBarCode"],
                            )?.dateOfExpiry,
                          ) ||
                          "",
                      },
                    },
                  ]
                : [],
            abutmentDetailsMatrixSortOrder: addAbutment
              ? ["new_abutment_0", "new_abutment_1"]
              : data?.["0_abutmentCategory"]?.length > 0
                ? ["new_abutment_0"]
                : [],
          };
          //@ts-ignore
          createSiteSpecificMutate.mutate({
            //@ts-ignore
            formData: newData,
            //@ts-ignore
            site: data?.toothValue,
          });
        }
      } else {
        if (selectedSite?.treatmentItemNumber === "666") {
          const newData = {
            id: data?.siteId,
            barMaterial: data?.barMaterial,
            archLocation: data?.archLocation,
            barLengthFrom: data.barLengthFrom.toString(),
            barLengthTo: data.barLengthTo.toString(),
            barType: data?.barType,
            provisionalMaterial: data?.provisionalMaterial,
            finalProstheticMaterial: data?.finalProstheticMaterial,
            reinforcementOfFinalProsthetic:
              data?.reinforcementOfFinalProsthetic,
          };

          updateBarSpecificMutate.mutate(newData);
        } else {
          const newData = {
            id: data?.siteId,
            itemSpecificationMatrixBlocks: [
              {
                itemSpecs: {
                  id: "new_0",
                  enableInClinlog: true,
                  implantBrand: data?.implantBrand,
                  implantCategory: data?.implantCategory,
                  implantLine: data?.implantLine,
                  surface: data?.surface,
                  implantBaseAndDiameter: data?.implantBaseAndDiameter,
                  implantType: data?.implantType,
                  implantLength: data?.implantLength,
                  angleCorrectionAbutment: data?.angleCorrectionAbutment,
                  abutmentBrand: data?.abutmentBrand,
                  abutmentLength: data?.abutmentLength,
                  abutmentSerialSequenceBarCode:
                    data?.abutmentSerialSequenceBarCode || "",
                  serialSequenceBarCode: data?.serialSequenceBarCode || "",
                  placement: data?.placement,
                  trabecularBoneDensity: data?.trabecularBoneDensity,
                  boneVascularity: data?.boneVascularity,
                  graftingApplied: data?.graftingApplied,
                  graftMaterial: data?.graftMaterial,
                  intraOperativeSinusComplications:
                    data?.intraOperativeSinusComplications,
                  crestalRest: data?.crestalRest,
                  insertionTorque: data?.insertionTorque,
                  radiographicTrabecularDensityHu:
                    data?.radiographicTrabecularDensityHu || "",
                  relevantBoneWidth: data?.relevantBoneWidth,
                  preOperativeSinusDisease: data?.preOperativeSinusDisease,
                  preOperativeSinusDiseaseManagement:
                    data?.preOperativeSinusDiseaseManagement,
                  conformanceWithTreatmentPlan:
                    data?.conformanceWithTreatmentPlan,
                  prf: data?.prf,
                  lotCode:
                    data?.lotCode ||
                    handleGs1Conversion(data?.serialSequenceBarCode)?.lotCode ||
                    "",
                  dateOfManufacture:
                    data?.dateOfManufacture ||
                    parseYYMMDD(
                      handleGs1Conversion(data?.serialSequenceBarCode)
                        ?.dateOfManufacture,
                    ) ||
                    "",
                  dateOfExpiry:
                    data?.dateOfExpiry ||
                    parseYYMMDD(
                      handleGs1Conversion(data?.serialSequenceBarCode)
                        ?.dateOfExpiry,
                    ) ||
                    "",
                },
              },
            ],
            itemSpecificationMatrixSortOrder: ["new_0"],
            abutmentDetailsMatrixBlocks: addAbutment
              ? [
                  {
                    abutment: {
                      id: "new_abutment_0",
                      abutmentBrand: data?.["0_abutmentBrand"],
                      abutmentCategory: data?.["0_abutmentCategory"],
                      typeAndDiameter: data?.["0_typeAndDiameter"],
                      gingivalHeight: data?.["0_gingivalHeight"],
                      abutmentHeight: data?.["0_abutmentHeight"],
                      abutmentLength: data?.["0_abutmentLength"],
                      angleCorrectionAbutment:
                        data?.["0_angleCorrectionAbutment"],
                      abutmentSerialSequenceBarCode:
                        data?.["0_abutmentSerialSequenceBarCode"] || "",
                      abutmentLotCode:
                        data?.["0_abutmentLotCode"] ||
                        handleGs1Conversion(
                          data?.["0_abutmentSerialSequenceBarCode"],
                        )?.lotCode ||
                        "",
                      abutmentDateOfManufacture:
                        data?.["0_abutmentDateOfManufacture"] ||
                        parseYYMMDD(
                          handleGs1Conversion(
                            data?.["0_abutmentSerialSequenceBarCode"],
                          )?.dateOfManufacture,
                        ) ||
                        "",
                      abutmentDateOfExpiry:
                        data?.["0_abutmentDateOfExpiry"] ||
                        parseYYMMDD(
                          handleGs1Conversion(
                            data?.["0_abutmentSerialSequenceBarCode"],
                          )?.dateOfExpiry,
                        ) ||
                        "",
                    },
                  },
                  {
                    abutment: {
                      id: "new_abutment_1",
                      abutmentBrand: data?.["1_abutmentBrand"],
                      abutmentCategory: data?.["1_abutmentCategory"],
                      typeAndDiameter: data?.["1_typeAndDiameter"],
                      gingivalHeight: data?.["1_gingivalHeight"],
                      abutmentHeight: data?.["1_abutmentHeight"],
                      abutmentLength: data?.["1_abutmentLength"],
                      angleCorrectionAbutment:
                        data?.["1_angleCorrectionAbutment"],
                      abutmentSerialSequenceBarCode:
                        data?.["1_abutmentSerialSequenceBarCode"] || "",
                      abutmentLotCode:
                        data?.["1_abutmentLotCode"] ||
                        handleGs1Conversion(
                          data?.["1_abutmentSerialSequenceBarCode"],
                        )?.lotCode ||
                        "",
                      abutmentDateOfManufacture:
                        data?.["1_abutmentDateOfManufacture"] ||
                        parseYYMMDD(
                          handleGs1Conversion(
                            data?.["1_abutmentSerialSequenceBarCode"],
                          )?.dateOfManufacture,
                        ) ||
                        "",
                      abutmentDateOfExpiry:
                        data?.["1_abutmentDateOfExpiry"] ||
                        parseYYMMDD(
                          handleGs1Conversion(
                            data?.["1_abutmentSerialSequenceBarCode"],
                          )?.dateOfExpiry,
                        ) ||
                        "",
                    },
                  },
                ]
              : data?.["0_abutmentCategory"]?.length > 0
                ? [
                    {
                      abutment: {
                        id: "new_abutment_0",
                        abutmentBrand: data?.["0_abutmentBrand"] || "",
                        abutmentCategory: data?.["0_abutmentCategory"] || "",
                        typeAndDiameter: data?.["0_typeAndDiameter"] || "",
                        gingivalHeight: data?.["0_gingivalHeight"] || "",
                        abutmentHeight: data?.["0_abutmentHeight"] || "",
                        abutmentLength: data?.["0_abutmentLength"] || "",
                        angleCorrectionAbutment:
                          data?.["0_angleCorrectionAbutment"] || "",
                        abutmentSerialSequenceBarCode:
                          data?.["0_abutmentSerialSequenceBarCode"] || "",
                        abutmentLotCode:
                          data?.["0_abutmentLotCode"] ||
                          handleGs1Conversion(
                            data?.["0_abutmentSerialSequenceBarCode"],
                          )?.lotCode ||
                          "",
                        abutmentDateOfManufacture:
                          data?.["0_abutmentDateOfManufacture"] ||
                          parseYYMMDD(
                            handleGs1Conversion(
                              data?.["0_abutmentSerialSequenceBarCode"],
                            )?.dateOfManufacture,
                          ) ||
                          "",
                        abutmentDateOfExpiry:
                          data?.["0_abutmentDateOfExpiry"] ||
                          parseYYMMDD(
                            handleGs1Conversion(
                              data?.["0_abutmentSerialSequenceBarCode"],
                            )?.dateOfExpiry,
                          ) ||
                          "",
                      },
                    },
                  ]
                : [],
            abutmentDetailsMatrixSortOrder: addAbutment
              ? ["new_abutment_0", "new_abutment_1"]
              : data?.["0_abutmentCategory"]?.length > 0
                ? ["new_abutment_0"]
                : [],
          };
          updateSiteSpecificMutate.mutate(newData);
        }
      }
    } else {
      const newData = {
        title:
          patientName +
          " - " +
          data?.toothValue +
          " - " +
          "Site Specific - " +
          format(new Date(), "dd MMM yyyy HH:mm"),
        attachedSiteSpecificFollowUp: [],
        itemSpecificationMatrixBlocks: [
          {
            itemSpecs: {
              id: "new_0",
              enableInClinlog: true,
              implantBrand: data?.implantBrand,
              implantCategory: data?.implantCategory,
              implantLine: data?.implantLine,
              surface: data?.surface,
              implantBaseAndDiameter: data?.implantBaseAndDiameter,
              implantType: data?.implantType,
              implantLength: data?.implantLength,
              angleCorrectionAbutment: data?.angleCorrectionAbutment,
              abutmentBrand: data?.abutmentBrand,
              abutmentLength: data?.abutmentLength,
              abutmentSerialSequenceBarCode:
                data?.abutmentSerialSequenceBarCode || "",
              serialSequenceBarCode: data?.serialSequenceBarCode || "",
              placement: data?.placement,
              trabecularBoneDensity: data?.trabecularBoneDensity,
              boneVascularity: data?.boneVascularity,
              graftingApplied: data?.graftingApplied,
              graftMaterial: data?.graftMaterial,
              intraOperativeSinusComplications:
                data?.intraOperativeSinusComplications,
              crestalRest: data?.crestalRest,
              insertionTorque: data?.insertionTorque,
              radiographicTrabecularDensityHu:
                data?.radiographicTrabecularDensityHu || "",
              relevantBoneWidth: data?.relevantBoneWidth,
              preOperativeSinusDisease: data?.preOperativeSinusDisease,
              preOperativeSinusDiseaseManagement:
                data?.preOperativeSinusDiseaseManagement,
              conformanceWithTreatmentPlan: data?.conformanceWithTreatmentPlan,
              prf: data?.prf,
              lotCode:
                data?.lotCode ||
                handleGs1Conversion(data?.serialSequenceBarCode)?.lotCode ||
                "",
              dateOfManufacture:
                data?.dateOfManufacture ||
                parseYYMMDD(
                  handleGs1Conversion(data?.serialSequenceBarCode)
                    ?.dateOfManufacture,
                ) ||
                "",
              dateOfExpiry:
                data?.dateOfExpiry ||
                parseYYMMDD(
                  handleGs1Conversion(data?.serialSequenceBarCode)
                    ?.dateOfExpiry,
                ) ||
                "",
            },
          },
        ],
        itemSpecificationMatrixSortOrder: ["new_0"],
        abutmentDetailsMatrixBlocks: addAbutment
          ? [
              {
                abutment: {
                  id: "new_abutment_0",
                  abutmentBrand: data?.["0_abutmentBrand"],
                  abutmentCategory: data?.["0_abutmentCategory"],
                  typeAndDiameter: data?.["0_typeAndDiameter"],
                  gingivalHeight: data?.["0_gingivalHeight"],
                  abutmentHeight: data?.["0_abutmentHeight"],
                  abutmentLength: data?.["0_abutmentLength"],
                  angleCorrectionAbutment: data?.["0_angleCorrectionAbutment"],
                  abutmentSerialSequenceBarCode:
                    data?.["0_abutmentSerialSequenceBarCode"] || "",
                  abutmentLotCode:
                    data?.["0_abutmentLotCode"] ||
                    handleGs1Conversion(
                      data?.["0_abutmentSerialSequenceBarCode"],
                    )?.lotCode ||
                    "",
                  abutmentDateOfManufacture:
                    data?.["0_abutmentDateOfManufacture"] ||
                    parseYYMMDD(
                      handleGs1Conversion(
                        data?.["0_abutmentSerialSequenceBarCode"],
                      )?.dateOfManufacture,
                    ) ||
                    "",
                  abutmentDateOfExpiry:
                    data?.["0_abutmentDateOfExpiry"] ||
                    parseYYMMDD(
                      handleGs1Conversion(
                        data?.["0_abutmentSerialSequenceBarCode"],
                      )?.dateOfExpiry,
                    ) ||
                    "",
                },
              },
              {
                abutment: {
                  id: "new_abutment_1",
                  abutmentBrand: data?.["1_abutmentBrand"],
                  abutmentCategory: data?.["1_abutmentCategory"],
                  typeAndDiameter: data?.["1_typeAndDiameter"],
                  gingivalHeight: data?.["1_gingivalHeight"],
                  abutmentHeight: data?.["1_abutmentHeight"],
                  abutmentLength: data?.["1_abutmentLength"],
                  angleCorrectionAbutment: data?.["1_angleCorrectionAbutment"],
                  abutmentSerialSequenceBarCode:
                    data?.["1_abutmentSerialSequenceBarCode"] || "",
                  abutmentLotCode:
                    data?.["1_abutmentLotCode"] ||
                    handleGs1Conversion(
                      data?.["1_abutmentSerialSequenceBarCode"],
                    )?.lotCode ||
                    "",
                  abutmentDateOfManufacture:
                    data?.["1_abutmentDateOfManufacture"] ||
                    parseYYMMDD(
                      handleGs1Conversion(
                        data?.["1_abutmentSerialSequenceBarCode"],
                      )?.dateOfManufacture,
                    ) ||
                    "",
                  abutmentDateOfExpiry:
                    data?.["1_abutmentDateOfExpiry"] ||
                    parseYYMMDD(
                      handleGs1Conversion(
                        data?.["1_abutmentSerialSequenceBarCode"],
                      )?.dateOfExpiry,
                    ) ||
                    "",
                },
              },
            ]
          : data?.["0_abutmentCategory"]?.length > 0
            ? [
                {
                  abutment: {
                    id: "new_abutment_0",
                    abutmentBrand: data?.["0_abutmentBrand"] || "",
                    abutmentCategory: data?.["0_abutmentCategory"] || "",
                    typeAndDiameter: data?.["0_typeAndDiameter"] || "",
                    gingivalHeight: data?.["0_gingivalHeight"] || "",
                    abutmentHeight: data?.["0_abutmentHeight"] || "",
                    abutmentLength: data?.["0_abutmentLength"] || "",
                    angleCorrectionAbutment:
                      data?.["0_angleCorrectionAbutment"] || "",
                    abutmentSerialSequenceBarCode:
                      data?.["0_abutmentSerialSequenceBarCode"] || "",
                    abutmentLotCode:
                      data?.["0_abutmentLotCode"] ||
                      handleGs1Conversion(
                        data?.["0_abutmentSerialSequenceBarCode"],
                      )?.lotCode ||
                      "",
                    abutmentDateOfManufacture:
                      data?.["0_abutmentDateOfManufacture"] ||
                      parseYYMMDD(
                        handleGs1Conversion(
                          data?.["0_abutmentSerialSequenceBarCode"],
                        )?.dateOfManufacture,
                      ) ||
                      "",
                    abutmentDateOfExpiry:
                      data?.["0_abutmentDateOfExpiry"] ||
                      parseYYMMDD(
                        handleGs1Conversion(
                          data?.["0_abutmentSerialSequenceBarCode"],
                        )?.dateOfExpiry,
                      ) ||
                      "",
                  },
                },
              ]
            : [],
        abutmentDetailsMatrixSortOrder: addAbutment
          ? ["new_abutment_0", "new_abutment_1"]
          : data?.["0_abutmentCategory"]?.length > 0
            ? ["new_abutment_0"]
            : [],
      };
      //@ts-ignore
      createSiteSpecificMutate.mutate({
        formData: newData,
        site: data?.toothValue,
      });
    }
  };
  const preventEnterSubmit = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key !== "Enter") return;

    const target = e.target as HTMLElement;

    // Allow Enter in textareas or when the focused element is an explicit submit button
    const isTextarea = target.tagName === "TEXTAREA";
    const isSubmitButton =
      (target as HTMLButtonElement).tagName === "BUTTON" &&
      (target as HTMLButtonElement).type === "submit";

    if (!isTextarea && !isSubmitButton) {
      e.preventDefault(); // stops the implicit form submit
    }
  };

  return (
    <Flex w="100%" h="95%">
      <chakra.form
        onSubmit={handleSubmit(onSiteSpecificSubmit)}
        w="100%"
        // onKeyDown={(e) => e.preventDefault()}
        onKeyDownCapture={preventEnterSubmit}
      >
        <Input
          type="hidden"
          {...register("siteId")}
          value={selectedSite?.attachedSiteSpecificRecords?.[0]?.id || "new"}
        />
        {selectedSite?.treatmentItemNumber === "666" ? (
          <Flex
            flexDirection="column"
            w="100%"
            h="95%"
            p="20px"
            gap="2rem"
            overflow={"scroll"}
            alignItems="center"
          >
            {" "}
            <Flex flexDirection={"column"} gap="0.5rem" w="100%">
              <Text
                fontSize="10px"
                fontWeight="600"
                textTransform={"uppercase"}
              >
                Arch Location
              </Text>
              <Select
                w="50%"
                py="1px"
                sx={selectStyles}
                {...register("archLocation")}
              >
                <option value="">-- Select --</option>
                <option value="upper">Upper</option>
                <option value="lower">Lower</option>
              </Select>
            </Flex>
            <Flex flexDirection={"column"} gap="0.5rem" w="100%">
              <Text
                fontSize="10px"
                fontWeight="600"
                textTransform={"uppercase"}
              >
                Bar Length
              </Text>
              <Flex
                w="95%"
                maxW="100%"
                align={"center"}
                border="1px solid #E2E8F0"
                padding="10px 30px"
                borderRadius="6px"
              >
                <RangeSlider
                  aria-label={["min", "max"]}
                  colorScheme="pink"
                  defaultValue={[0, 15]}
                  min={0}
                  max={15}
                  minH="20"
                  value={[
                    getValues("barLengthFrom") || 0,
                    getValues("barLengthTo") || 15,
                  ]}
                  onChange={(val) => {
                    if (val[0] < 6) {
                      setValue("barLengthFrom", val[0]);
                    }
                    if (val[1] > 9) {
                      setValue("barLengthTo", val[1]);
                    }
                  }}
                >
                  {archLocation === "upper"
                    ? upperToothOptions?.map((tooth, index) => {
                        return (
                          <RangeSliderMark
                            ml="-2.5"
                            value={index}
                            fontSize={"12px"}
                            key={tooth}
                          >
                            {tooth}
                          </RangeSliderMark>
                        );
                      })
                    : lowerToothOptions?.map((tooth, index) => {
                        return (
                          <RangeSliderMark
                            ml="-2.5"
                            value={index}
                            fontSize={"12px"}
                            key={tooth}
                          >
                            {tooth}
                          </RangeSliderMark>
                        );
                      })}
                  <RangeSliderTrack>
                    <RangeSliderFilledTrack />
                  </RangeSliderTrack>
                  <RangeSliderThumb index={0} />
                  <RangeSliderThumb index={1} />
                </RangeSlider>
              </Flex>
            </Flex>
            {/* <Flex flexDirection={"column"} gap="0.5rem" w="100%">
              {" "}
              <Text
                fontSize="10px"
                fontWeight="600"
                textTransform={"uppercase"}
              >
                Bar Type
              </Text>
              <Select w="50%" sx={selectStyles} {...register("barType")}>
                <option value="">-- Select --</option>
                <option value="fixedFp3">
                  FIXED FP3 PROSTHESIS WITH RIGID BAR
                </option>
                <option value="fp1Fp2">
                  FP1 or FP2 IMPLANT SUPPORTED BRIDGE
                </option>
                <option value="denture">DENTURE</option>
                <option value="dentureBar">
                  IMPLANT SUPPORTED (BAR) REMOVAL DENTURE
                </option>
                <option value="dentureLocator">
                  IMPLANT SUPPORTED (LOCATOR) REMOVAL DENTURE
                </option>
              </Select>
            </Flex> */}
            <Flex flexDirection={"column"} gap="0.5rem" w="100%">
              <Text
                fontSize="10px"
                fontWeight="600"
                textTransform={"uppercase"}
              >
                Provisional Material
              </Text>
              <Select
                w="50%"
                sx={selectStyles}
                py="1px"
                {...register("provisionalMaterial")}
              >
                <option value="">-- Select --</option>
                <option value="Printed (Changed within 7 days)">
                  Printed (Changed within 7 days)
                </option>
                <option value="Denture Conversion (in-mouth)">
                  Denture Conversion (in-mouth)
                </option>
                <option value="Denture Conversion (laboratory)">
                  Denture Conversion (laboratory)
                </option>
                <option value="Processed Acrylic (no bar)">
                  Processed Acrylic (no bar)
                </option>
                <option value="Processed Acrylic (with bar)">
                  Processed Acrylic (with bar)
                </option>
                <option value="Milled PMMA (no bar)">
                  Milled PMMA (no bar)
                </option>
                <option value="Other Milled or Printed Material">
                  Other Milled or Printed Material
                </option>
                <option value="No Provisional (Direct Stent Indexation & Try-in)">
                  No Provisional (Direct Stent Indexation & Try-in)
                </option>
                <option value="unknown">Unknown</option>
              </Select>
            </Flex>
            <Flex flexDirection={"column"} gap="0.5rem" w="100%">
              <Text
                fontSize="10px"
                fontWeight="600"
                textTransform={"uppercase"}
              >
                Final Prosthetic Material
              </Text>
              <Select
                w="50%"
                sx={selectStyles}
                py="1px"
                {...register("finalProstheticMaterial")}
              >
                <option value="">-- Select --</option>
                <option value="Acrylic">Acrylic</option>
                <option value="PMMA">PMMA</option>
                <option value="Graphine">Graphine</option>
                <option value="Ambarino">Ambarino</option>
                <option value="Zirconia">Zirconia</option>
                <option value="unknown">Unknown</option>
              </Select>
            </Flex>
            <Flex flexDirection={"column"} gap="0.5rem" w="100%">
              <Text
                fontSize="10px"
                fontWeight="600"
                textTransform={"uppercase"}
              >
                Reinforcement of Final Prosthetic
              </Text>
              <Select
                w="50%"
                sx={selectStyles}
                py="1px"
                {...register("reinforcementOfFinalProsthetic")}
              >
                <option value="">-- Select --</option>
                <option value="No Reinforcement">No Reinforcement</option>
                <option value="Floating Bar">Floating Bar</option>
                <option value="Milled Bar">Milled Bar</option>
                <option value="ICE Zirkon Base Hotbonded to Zicron Sleeve">
                  ICE Zirkon Base Hotbonded to Zicron Sleeve
                </option>
                <option value="unknown">Unknown</option>
              </Select>
            </Flex>
          </Flex>
        ) : (
          <Flex
            flexDirection="column"
            w="100%"
            h="99%"
            px="2"
            py="4"
            gap="0.5rem"
            overflow={"scroll"}
          >
            <Flex alignItems="center" gap="12px" justifyContent="space-between">
              <Flex alignItems="center" gap="12px" w="100%">
                <Text
                  color="#007AFF"
                  fontSize="12px"
                  fontWeight="800"
                  fontFamily={"inter"}
                  letterSpacing={"1.3px"}
                  textTransform={"uppercase"}
                  mr="10px"
                >
                  Implant Details
                </Text>
                <Flex
                  ref={barcodeContainerRef}
                  align="center"
                  gap="12px"
                  display={fromClinlog ? "none" : "flex"}
                >
                  <Tooltip
                    label={
                      isBarcodeScannerOpen ? "Scanning..." : "Scan component"
                    }
                    openDelay={300}
                  >
                    <IconButton
                      aria-label="Scan component"
                      variant={isBarcodeScannerOpen ? "solid" : "outline"}
                      colorScheme={isBarcodeScannerOpen ? "blue" : "gray"}
                      size="lg"
                      borderRadius="full"
                      boxShadow={
                        isBarcodeScannerOpen
                          ? "0 8px 20px rgba(59,130,246,0.35)"
                          : "sm"
                      }
                      _hover={{
                        transform: "translateY(-1px)",
                        boxShadow: "md",
                      }}
                      _active={{ transform: "translateY(0)" }}
                      icon={
                        <chakra.span
                          className="material-symbols-outlined"
                          fontSize="26px"
                        >
                          barcode_scanner
                        </chakra.span>
                      }
                      onClick={() => {
                        if (barcodeTimeoutRef.current) {
                          clearTimeout(barcodeTimeoutRef.current);
                        }
                        setIsBarcodeScannerOpen((prev) => !prev);
                      }}
                    />
                  </Tooltip>
                  {isBarcodeScannerOpen && (
                    <Input
                      ref={barcodeInputRef}
                      type="text"
                      size="sm"
                      placeholder="Scan or paste barcode"
                      borderRadius="full"
                      maxW="260px"
                      bg="white"
                      _focus={{ boxShadow: "0 0 0 2px #3182CE" }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                        }
                      }}
                      onChange={(e) => {
                        const value = e.target.value;

                        // Clear any existing timeout
                        if (barcodeTimeoutRef.current) {
                          clearTimeout(barcodeTimeoutRef.current);
                        }

                        // Only process when exactly 39 characters are entered
                        if (value.length === 42) {
                        }

                        const handleBarcodeConversion = () => {
                          //for values missing 01 prefix, add it
                          let extendedValue = value;
                          if (value?.length < 16) {
                            if (value?.length == 15) {
                              extendedValue = `0${value}`;
                            } else {
                              extendedValue = `01${value}`;
                            }
                          }
                          const normalizedResult =
                            handleGs1Conversion(extendedValue);
                          const localRefString = `01${normalizedResult?.serialSequenceBarCode}`;
                          const lotCode = normalizedResult?.lotCode;
                          const dateOfExpiry = normalizedResult?.dateOfExpiry;
                          const dateOfManufacture =
                            normalizedResult?.dateOfManufacture;

                          const foundItem = combinedData?.find((item) => {
                            if (item?.referenceNumber?.length < 16) {
                              return (
                                `0${item?.referenceNumber}` === localRefString
                              );
                            }
                            // to check full serial code or just 16 digit serial sequence code without 01 prefix
                            return (
                              item.referenceNumber === localRefString ||
                              item.referenceNumber === value
                            );
                          });

                          if (foundItem?.typeHandle === "implantList") {
                            // Set implantBrand first and wait for it to update before setting implantType
                            // This ensures implantTypeOptions useMemo recalculates with the correct brand
                            setValue("implantBrand", foundItem?.brand, {
                              shouldValidate: true,
                              shouldDirty: true,
                            });

                            // Use setTimeout with a small delay to ensure implantBrand is processed and implantTypeOptions updates
                            setTimeout(() => {
                              setValue("implantType", foundItem?.implantType, {
                                shouldValidate: true,
                                shouldDirty: true,
                              });
                              setValue(
                                "implantCategory",
                                foundItem?.implantCategory,
                                {
                                  shouldValidate: true,
                                  shouldDirty: true,
                                },
                              );
                              setValue("implantLine", foundItem?.implantLine, {
                                shouldValidate: true,
                                shouldDirty: true,
                              });

                              // Use another setTimeout to ensure implantType is processed and implantLengthOptions updates
                              setTimeout(() => {
                                setValue("surface", foundItem?.surface, {
                                  shouldValidate: true,
                                  shouldDirty: true,
                                });
                                setValue(
                                  "implantBaseAndDiameter",
                                  foundItem?.implantBaseDiameter,
                                  {
                                    shouldValidate: true,
                                    shouldDirty: true,
                                  },
                                );
                                setValue(
                                  "implantLength",
                                  foundItem?.implantLength,
                                  {
                                    shouldValidate: true,
                                    shouldDirty: true,
                                  },
                                );
                              }, 10);
                            }, 10);

                            setValue("serialSequenceBarCode", value);
                            setValue("lotCode", lotCode);
                            setValue("dateOfExpiry", parseYYMMDD(dateOfExpiry));
                            setValue(
                              "dateOfManufacture",
                              parseYYMMDD(dateOfManufacture),
                            );
                          } else {
                            // Set abutmentBrand first and wait for it to update before setting angleCorrectionAbutment
                            // This ensures abutmentTypeOptions useMemo recalculates with the correct brand
                            if (!addAbutment) {
                              setValue("0_abutmentBrand", foundItem?.brand, {
                                shouldValidate: true,
                                shouldDirty: true,
                              });
                              // Use setTimeout with a small delay to ensure abutmentBrand is processed and abutmentTypeOptions updates
                              setTimeout(() => {
                                setValue(
                                  "0_abutmentCategory",
                                  foundItem?.abutmentCategory || "",
                                  {
                                    shouldValidate: true,
                                    shouldDirty: true,
                                  },
                                );

                                setValue(
                                  "0_typeAndDiameter",
                                  foundItem?.typeAndDiameter,
                                  {
                                    shouldValidate: true,
                                    shouldDirty: true,
                                  },
                                );
                                setValue(
                                  "0_gingivalHeight",
                                  foundItem?.gingivalHeight,
                                  {
                                    shouldValidate: true,
                                    shouldDirty: true,
                                  },
                                );
                                setValue(
                                  "0_abutmentHeight",
                                  foundItem?.abutmentHeight,
                                  {
                                    shouldValidate: true,
                                    shouldDirty: true,
                                  },
                                );
                                setValue(
                                  "0_angleCorrectionAbutment",
                                  foundItem?.angleCorrectionAbutment,
                                  {
                                    shouldValidate: true,
                                    shouldDirty: true,
                                  },
                                );
                                setValue(
                                  "0_abutmentLength",
                                  foundItem?.abutmentLength,
                                  {
                                    shouldValidate: true,
                                    shouldDirty: true,
                                  },
                                );
                              }, 10);

                              setValue(
                                "0_abutmentSerialSequenceBarCode",
                                value,
                                {
                                  shouldValidate: true,
                                  shouldDirty: true,
                                },
                              );
                              setValue("0_abutmentLotCode", lotCode);
                              setValue(
                                "0_abutmentDateOfExpiry",
                                parseYYMMDD(dateOfExpiry),
                              );
                              setValue(
                                "0_abutmentDateOfManufacture",
                                parseYYMMDD(dateOfManufacture),
                              );
                            } else {
                              setValue("1_abutmentBrand", foundItem?.brand, {
                                shouldValidate: true,
                                shouldDirty: true,
                              });
                              // Use setTimeout with a small delay to ensure abutmentBrand is processed and abutmentTypeOptions updates
                              setTimeout(() => {
                                setValue(
                                  "1_angleCorrectionAbutment",
                                  foundItem?.angleCorrectionAbutment,
                                  {
                                    shouldValidate: true,
                                    shouldDirty: true,
                                  },
                                );
                                setValue(
                                  "1_abutmentCategory",
                                  foundItem?.abutmentCategory,
                                  {
                                    shouldValidate: true,
                                    shouldDirty: true,
                                  },
                                );

                                setValue(
                                  "1_typeAndDiameter",
                                  foundItem?.typeAndDiameter,
                                  {
                                    shouldValidate: true,
                                    shouldDirty: true,
                                  },
                                );
                                setValue(
                                  "1_gingivalHeight",
                                  foundItem?.gingivalHeight,
                                  {
                                    shouldValidate: true,
                                    shouldDirty: true,
                                  },
                                );
                                setValue(
                                  "1_abutmentHeight",
                                  foundItem?.abutmentHeight,
                                  {
                                    shouldValidate: true,
                                    shouldDirty: true,
                                  },
                                );

                                setValue(
                                  "1_abutmentLength",
                                  foundItem?.abutmentLength,
                                  {
                                    shouldValidate: true,
                                    shouldDirty: true,
                                  },
                                );
                              }, 10);

                              setValue(
                                "1_abutmentSerialSequenceBarCode",
                                value,
                                {
                                  shouldValidate: true,
                                  shouldDirty: true,
                                },
                              );
                              setValue("1_abutmentLotCode", lotCode);
                              setValue(
                                "1_abutmentDateOfExpiry",
                                parseYYMMDD(dateOfExpiry),
                              );
                              setValue(
                                "1_abutmentDateOfManufacture",
                                parseYYMMDD(dateOfManufacture),
                              );
                            }
                          }
                        };
                        barcodeTimeoutRef.current = setTimeout(() => {
                          handleBarcodeConversion();
                          if (barcodeInputRef.current) {
                            barcodeInputRef.current.value = "";
                          }
                        }, 1000);
                      }}
                    />
                  )}
                </Flex>
              </Flex>
              {!fromClinlog && userIsClinlogOverseer && (
                <V2Link href={`/pagesv2/account/dental-components-management`}>
                  <Button variant="outline" colorScheme="blue">
                    <Text>Add Additional Components</Text>
                  </Button>
                </V2Link>
              )}
            </Flex>
            <Divider />
            {implantMatrixMemo}

            {abutmentMatrixMemo}
            <Flex justifyContent="flex-start">
              {!addAbutment ? (
                <Button mt="1" size="sm" onClick={() => setAddAbutment(true)}>
                  + Add Abutment
                </Button>
              ) : (
                <Button
                  mt="1"
                  color="red"
                  size="sm"
                  onClick={() => {
                    setAddAbutment(false);
                  }}
                >
                  Remove
                </Button>
              )}
            </Flex>
            <Text
              color="#007AFF"
              fontSize="12px"
              fontWeight="800"
              textTransform={"uppercase"}
              mt="8"
              fontFamily={"inter"}
              letterSpacing={"1.3px"}
            >
              Surgical Characteristics
            </Text>
            <Divider />
            <Flex gap="2rem" mt="2" w="100%">
              <Flex flexDirection={"column"} gap="0.5rem" w="50%">
                <Text
                  fontSize="11px"
                  fontWeight="700"
                  textTransform={"uppercase"}
                >
                  Placement
                </Text>
                {fromClinlog ? (
                  <Text
                    px="5"
                    py="3"
                    sx={selectStyles}
                    textTransform={"uppercase"}
                  >
                    {siteSpecificData?.placement || "N/A"}
                  </Text>
                ) : (
                  <Select sx={selectStyles} {...register("placement")}>
                    <option value="">-- Select --</option>
                    <option value="Maxillary Bone (Standard Endosseous)">
                      Maxillary Bone (Standard Endosseous)
                    </option>
                    <option value="Maxillary Bone with Nasal Floor">
                      Maxillary Bone with Nasal Floor
                    </option>
                    <option value="Nasopalatine Canal">
                      Nasopalatine Canal
                    </option>
                    <option value="Nasal Spine">Nasal Spine</option>
                    <option value="Pyriform">Pyriform</option>
                    <option value="Pterygoid">Pterygoid</option>
                    <option value="ZYGOMA Extra-maxillary">
                      ZYGOMA Extra-maxillary
                    </option>
                    <option value="ZYGOMA Partly extra-maxillary">
                      ZYGOMA Partly extra-maxillary
                    </option>
                    <option value="ZYGOMA Intra-maxillary">
                      ZYGOMA Intra-maxillary
                    </option>
                    <option value="ZYGOMA Partly extra-maxillary">
                      ZYGOMA Partly extra-maxillary
                    </option>
                    <option value="ZYGOMA Intra-sinus">
                      ZYGOMA Intra-sinus
                    </option>
                    <option value="Maxillary bone/posterior pyriform">
                      Maxillary bone/posterior pyriform
                    </option>
                    <option value="Mandibular Bone (Standard Endosseous)">
                      Mandibular Bone (Standard Endosseous)
                    </option>
                    <option value="Mandibular Cortical Base">
                      Mandibular Cortical Base
                    </option>
                    <option value="unknown">Unknown</option>
                  </Select>
                )}
              </Flex>
              <Flex flexDirection={"column"} gap="0.5rem" w="50%">
                <Text
                  fontSize="11px"
                  fontWeight="700"
                  textTransform={"uppercase"}
                >
                  Trabecular Bone Density
                </Text>
                {fromClinlog ? (
                  <Text
                    px="5"
                    py="3"
                    sx={selectStyles}
                    textTransform={"uppercase"}
                  >
                    {siteSpecificData?.trabecularBoneDensity || "N/A"}
                  </Text>
                ) : (
                  <Select
                    sx={selectStyles}
                    {...register("trabecularBoneDensity")}
                  >
                    <option value="">-- Select --</option>
                    <option value="Low Density">Low Density</option>
                    <option value="High Density">High Density</option>
                    <option value="Optimal">Optimal</option>
                    <option value="Medium Density">Medium Density</option>
                    <option value="unknown">Unknown</option>
                  </Select>
                )}
              </Flex>
            </Flex>
            <Flex gap="2rem" mt="2" w="100%">
              <Flex flexDirection={"column"} gap="0.5rem" w="50%">
                <Text
                  fontSize="11px"
                  fontWeight="700"
                  textTransform={"uppercase"}
                >
                  Bone Vascularity
                </Text>
                {fromClinlog ? (
                  <Text
                    px="5"
                    py="3"
                    sx={selectStyles}
                    textTransform={"uppercase"}
                  >
                    {siteSpecificData?.boneVascularity || "N/A"}
                  </Text>
                ) : (
                  <Select sx={selectStyles} {...register("boneVascularity")}>
                    <option value="">-- Select --</option>
                    <option value="Normal">Normal</option>
                    <option value="Low Vascularity">Low Vascularity</option>
                    <option value="Avascular">Avascular</option>
                    <option value="Vascular">Vascular</option>
                    <option value="unknown">Unknown</option>
                  </Select>
                )}
              </Flex>
              <Flex flexDirection={"column"} gap="0.5rem" w="50%">
                <Text
                  fontSize="11px"
                  fontWeight="700"
                  textTransform={"uppercase"}
                >
                  Grafting Applied
                </Text>
                {fromClinlog ? (
                  <Text
                    px="5"
                    py="3"
                    sx={selectStyles}
                    textTransform={"uppercase"}
                  >
                    {siteSpecificData?.graftingApplied || "N/A"}
                  </Text>
                ) : (
                  <Select sx={selectStyles} {...register("graftingApplied")}>
                    <option value="">-- Select --</option>
                    <option value="Yes, Zygoma Slot">Yes, Zygoma Slot</option>
                    <option value="Yes, Zygoma Hockey Stick">
                      Yes, Zygoma Hockey Stick
                    </option>
                    <option value="Yes, lateral approach">
                      Yes, lateral approach
                    </option>
                    <option value="Yes, sinus crush">Yes, sinus crush</option>
                    <option value="No">No</option>
                    <option value="Socket Fill">Socket Fill</option>
                    <option value="Buccal Layered">Buccal Layered</option>
                    <option value="unknown">Unknown</option>
                  </Select>
                )}
              </Flex>
            </Flex>
            {/* {getValues("graftingApplied")?.includes("Yes") && (
          
            )} */}
            <Flex gap="2rem" mt="2" w="100%">
              <Flex flexDirection={"column"} gap="0.5rem" w="50%">
                <Text
                  fontSize="11px"
                  fontWeight="700"
                  textTransform={"uppercase"}
                >
                  Graft Material
                </Text>
                {fromClinlog ? (
                  <Text
                    px="5"
                    py="3"
                    sx={selectStyles}
                    textTransform={"uppercase"}
                  >
                    {siteSpecificData?.graftMaterial || "N/A"}
                  </Text>
                ) : (
                  <Select sx={selectStyles} {...register("graftMaterial")}>
                    <option value="">-- Select --</option>
                    <option value="Bio Oss">Bio Oss</option>
                    <option value="Bio Oss Collagen">Bio Oss Collagen</option>
                    <option value="Bio-Oss Layered with Nano Bone">
                      Bio-Oss Layered with Nano Bone
                    </option>
                    <option value="Other">Other</option>
                    <option value="No">No</option>
                    <option value="N/A">N/A</option>
                    <option value="PRF-Derived Sticky Bone">
                      PRF-Derived Sticky Bone
                    </option>
                    <option value="PRF-Derived Sticky Bone Bio Oss Collagen">
                      PRF-Derived Sticky Bone Bio Oss Collagen
                    </option>
                    <option value="PRF-Derived Sticky Bone Bio Oss Collagen layered with nano bone">
                      PRF-Derived Sticky Bone Bio Oss Collagen layered with nano
                      bone
                    </option>
                    <option value="unknown">Unknown</option>
                  </Select>
                )}
              </Flex>
              <Flex flexDirection={"column"} gap="0.5rem" w="50%">
                <Text
                  fontSize="11px"
                  fontWeight="700"
                  textTransform={"uppercase"}
                >
                  Intra-Operative Sinus Complications
                </Text>
                {fromClinlog ? (
                  <Text
                    px="5"
                    py="3"
                    sx={selectStyles}
                    textTransform={"uppercase"}
                  >
                    {siteSpecificData?.intraOperativeSinusComplications ||
                      "N/A"}
                  </Text>
                ) : (
                  <Select
                    sx={selectStyles}
                    {...register("intraOperativeSinusComplications")}
                  >
                    <option value="">-- Select --</option>
                    <option value="Sinus perforation unmanaged">
                      Sinus perforation unmanaged
                    </option>
                    <option value="Sinus perforation managed">
                      Sinus perforation managed
                    </option>
                    <option value="N/A">N/A</option>
                    <option value="Not Detected">Not Detected</option>
                    <option value="unknown">Unknown</option>
                  </Select>
                )}
              </Flex>
            </Flex>
            <Flex gap="2rem" mt="2" w="100%">
              <Flex flexDirection={"column"} gap="0.5rem" w="50%">
                <Text
                  fontSize="11px"
                  fontWeight="700"
                  textTransform={"uppercase"}
                >
                  Crestal Rest
                </Text>
                {fromClinlog ? (
                  <Text
                    px="5"
                    py="3"
                    sx={selectStyles}
                    textTransform={"uppercase"}
                  >
                    {siteSpecificData?.crestalRest || "N/A"}
                  </Text>
                ) : (
                  <Select sx={selectStyles} {...register("crestalRest")}>
                    <option value="">-- Select --</option>
                    <option value="Present">Present</option>
                    <option value="Absent (sinus crush)">
                      Absent (sinus crush)
                    </option>
                    <option value="N/A">N/A</option>
                    <option value="unknown">Unknown</option>
                  </Select>
                )}
              </Flex>
              <Flex flexDirection={"column"} gap="0.5rem" w="50%">
                <Text
                  fontSize="11px"
                  fontWeight="700"
                  textTransform={"uppercase"}
                >
                  Insertion Torque
                </Text>
                {fromClinlog ? (
                  <Text
                    px="5"
                    py="3"
                    sx={selectStyles}
                    textTransform={"uppercase"}
                  >
                    {siteSpecificData?.insertionTorque || "N/A"}
                  </Text>
                ) : (
                  <Select sx={selectStyles} {...register("insertionTorque")}>
                    <option value="">-- Select --</option>
                    <option value="80Ncm and above">80Ncm and above</option>
                    <option value="60-75Ncm">60-75Ncm</option>
                    <option value="55Ncm and Under">55Ncm and Under</option>
                    <option value="35 Ncm (minimum)">35 Ncm (minimum)</option>
                    <option value="Zygoma Hand Driver Ideal">
                      Zygoma Hand Driver Ideal
                    </option>
                    <option value="Zygoma Hand Driver Low">
                      Zygoma Hand Driver Low
                    </option>
                    <option value="Zygoma Hand Driver – Unmeasured">
                      Zygoma Hand Driver – Unmeasured
                    </option>
                    <option value="unknown">Unknown</option>
                  </Select>
                )}
              </Flex>
            </Flex>
            <Flex gap="2rem" mt="2" w="100%">
              <Flex flexDirection={"column"} gap="0.5rem" w="50%">
                <Text
                  fontSize="11px"
                  fontWeight="700"
                  textTransform={"uppercase"}
                >
                  Radiographic Trabecular Density HU
                </Text>
                <Input
                  placeholder="Enter Value"
                  sx={selectStyles}
                  {...register("radiographicTrabecularDensityHu")}
                />
              </Flex>
              <Flex flexDirection={"column"} gap="0.5rem" w="50%">
                <Text
                  fontSize="11px"
                  fontWeight="700"
                  textTransform={"uppercase"}
                >
                  Relevant Bone Width
                </Text>
                {fromClinlog ? (
                  <Text
                    px="5"
                    py="3"
                    sx={selectStyles}
                    textTransform={"uppercase"}
                  >
                    {siteSpecificData?.relevantBoneWidth || "N/A"}
                  </Text>
                ) : (
                  <Select sx={selectStyles} {...register("relevantBoneWidth")}>
                    <option value="">-- Select --</option>
                    <option value="Alveolar Narrow (<4mm)">
                      {"Alveolar Narrow (<4mm)"}
                    </option>
                    <option value="Alveolar Wide (>7mm)">
                      {"Alveolar Wide (>7mm)"}
                    </option>
                    <option value="Alveolar Ideal (4-7mm)">
                      Alveolar Ideal (4-7mm)
                    </option>
                    <option value="Zygoma <4mm">{"Zygoma <4mm"}</option>
                    <option value="Zygoma 4-7mm">Zygoma 4-7mm</option>
                    <option value="Zygoma >7mm">{"Zygoma >7mm"}</option>
                    <option value="unknown">Unknown</option>
                  </Select>
                )}
              </Flex>
            </Flex>
            <Flex gap="2rem" mt="2" w="100%">
              <Flex flexDirection={"column"} gap="0.5rem" w="50%">
                <Text
                  fontSize="11px"
                  fontWeight="700"
                  textTransform={"uppercase"}
                >
                  Pre-Operative Sinus Disease
                </Text>
                {fromClinlog ? (
                  <Text
                    px="5"
                    py="3"
                    sx={selectStyles}
                    textTransform={"uppercase"}
                  >
                    {siteSpecificData?.preOperativeSinusDisease || "N/A"}
                  </Text>
                ) : (
                  <Select
                    sx={selectStyles}
                    {...register("preOperativeSinusDisease")}
                  >
                    <option value="">-- Select --</option>
                    <option value="None">None</option>
                    <option value="Mild Thickening">Mild Thickening</option>
                    <option value="Moderate Thickening">
                      Moderate Thickening
                    </option>
                    <option value="Total opacification">
                      Total opacification
                    </option>
                    <option value="Not Applicable">Not Applicable</option>
                    <option value="unknown">Unknown</option>
                  </Select>
                )}
              </Flex>
              <Flex flexDirection={"column"} gap="0.5rem" w="50%">
                <Text
                  fontSize="11px"
                  fontWeight="700"
                  textTransform={"uppercase"}
                >
                  Pre-operative Sinus Disease Management
                </Text>
                {fromClinlog ? (
                  <Text
                    px="5"
                    py="3"
                    sx={selectStyles}
                    textTransform={"uppercase"}
                  >
                    {siteSpecificData?.preOperativeSinusDiseaseManagement ||
                      "N/A"}
                  </Text>
                ) : (
                  <Select
                    sx={selectStyles}
                    {...register("preOperativeSinusDiseaseManagement")}
                  >
                    <option value="">-- Select --</option>
                    <option value="Not Applicable">Not Applicable</option>
                    <option value="Conservative">Conservative</option>
                    <option value="ENT Surgery">ENT Surgery</option>
                    <option value="No Treatment">No Treatment</option>
                    <option value="unknown">Unknown</option>
                  </Select>
                )}
              </Flex>
            </Flex>
            <Flex gap="2rem" mt="2" w="100%">
              <Flex flexDirection={"column"} gap="0.5rem" w="50%">
                <Text
                  fontSize="11px"
                  fontWeight="700"
                  textTransform={"uppercase"}
                >
                  Prf
                </Text>
                {fromClinlog ? (
                  <Text
                    px="5"
                    py="3"
                    sx={selectStyles}
                    textTransform={"uppercase"}
                  >
                    {siteSpecificData?.prf || "N/A"}
                  </Text>
                ) : (
                  <Select sx={selectStyles} {...register("prf")}>
                    <option value="">-- Select --</option>
                    <option value="No">No</option>
                    <option value="PRF Used">PRF Used</option>
                  </Select>
                )}
              </Flex>
              <Flex flexDirection={"column"} gap="0.5rem" w="50%">
                <Text
                  fontSize="11px"
                  fontWeight="700"
                  textTransform={"uppercase"}
                >
                  Conformance With Treatment Plan
                </Text>
                {fromClinlog ? (
                  <Text
                    px="5"
                    py="3"
                    sx={selectStyles}
                    textTransform={"uppercase"}
                  >
                    {siteSpecificData?.conformanceWithTreatmentPlan || "N/A"}
                  </Text>
                ) : (
                  <Select
                    sx={selectStyles}
                    {...register("conformanceWithTreatmentPlan")}
                  >
                    <option value="">-- Select --</option>
                    <option value="Yes, as planned">Yes, as planned</option>
                    <option value="Yes, as planned but not immediately loaded">
                      Yes, as planned but not immediately loaded
                    </option>
                    <option value="No, changed to Zygoma">
                      No, changed to Zygoma
                    </option>
                    <option value="No, changed to Standard straight">
                      No, changed to Standard straight
                    </option>
                    <option value="No, changed to Standard angled placement">
                      No, changed to Standard angled placement
                    </option>
                    <option value="No, changed to Pyriform">
                      No, changed to Pyriform
                    </option>
                    <option value="No, this is an additional implant">
                      No, this is an additional implant
                    </option>
                    <option value="No, not placed and deleted from plan/scheme">
                      No, not placed and deleted from plan/scheme
                    </option>
                    <option value="No, placed but not used as support">
                      No, placed but not used as support
                    </option>

                    <option value="unknown">Unknown</option>
                  </Select>
                )}
              </Flex>
            </Flex>
          </Flex>
        )}
        {!fromClinlog && (
          <Flex w="100%" justifyContent="space-around" gap="2rem" mt="4">
            <Button
              w="50%"
              textTransform="uppercase"
              color="white"
              py="6"
              fontFamily={"inter"}
              fontSize={"13px"}
              fontWeight={"600"}
              letterSpacing={"2.24px"}
              bgColor="scBlack"
              onClick={onSidebarClose}
            >
              Cancel
            </Button>
            <Button
              w="50%"
              py="6"
              textTransform="uppercase"
              color="white"
              bgColor="scBlue"
              fontFamily={"inter"}
              fontSize={"13px"}
              fontWeight={"600"}
              letterSpacing={"2.24px"}
              type="submit"
            >
              Save
            </Button>
          </Flex>
        )}
      </chakra.form>
    </Flex>
  );
}
