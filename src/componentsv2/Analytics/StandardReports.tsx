import {
  Flex,
  Select,
  Text,
  Checkbox,
  Table,
  Th,
  Tr,
  Td,
  Tbody,
  Thead,
  Button,
  TableContainer,
  filter,
} from "@chakra-ui/react";
import { differenceInDays, format, set } from "date-fns";
import {
  clinlogFilterColumns,
  filterReportOptions,
  reportOptions,
} from "helpersv2/utils";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { MdRefresh } from "react-icons/md";
import { Card, CardHeader, CardTitle } from "src/uicomponents/ui/card";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { DownloadIcon } from "@chakra-ui/icons";
import { table } from "console";
import { number } from "yup/lib/locale";
import domtoimage from "dom-to-image";

import { fi, ro, ta } from "date-fns/locale";
import { report } from "process";
import { m } from "framer-motion";
type optionsType = {
  name: string;
  value: string;
  isReport?: boolean;
};
export default function StandardReports({
  filteredData,
  groupOptions,
  recordTreatmentSurgeonOptions,
  clinlogNotes = [],
  globalFilter,
  setGlobalFilter,
  locationOptions = [],
  implantLineOptions = [],
}) {
  const [reportType, setReportType] = useState("");
  const [selectedColumns, setSelectedColumns] = useState([
    { group: "", fields: [], isChosen: false },
  ]);
  const [selectedRows, setSelectedRows] = useState([
    { group: "", fields: [], isChosen: false },
  ]);
  //survey and arch conditions
  const toothValueBygroup = [
    {
      value: ["Upper Midline", "Lower Midline"],
      name: "Midline",
    },
    {
      value: [
        "11",
        "12",
        "13",
        "21",
        "22",
        "23",
        "31",
        "32",
        "33",
        "41",
        "42",
        "43",
      ],
      name: "Anterior",
    },
    {
      value: [
        "14",
        "15",
        "16",
        "24",
        "25",
        "26",
        "34",
        "35",
        "36",
        "44",
        "45",
        "46",
      ],
      name: "Posterior",
    },
    {
      value: ["17", "18", "27", "28", "37", "38", "47", "48"],
      name: "Far Posterior",
    },
  ];
  const timeFromSurgeryOptions = [
    {
      value: 1,
      name: "Within 24 hours",
    },
    {
      value: 4,
      name: "24 hours up to 4 days",
    },
    {
      value: 7,
      name: "5-7 days",
    },
    {
      value: 8,
      name: "8 days and over",
    },
  ];

  const columnsRows = {
    surveyVsArchCondition: {
      columns: [
        {
          group: "treatmentCharacteristics",
          fields: ["upperArchCondition"],
          isChosen: true,
        },
      ],
      rows: [
        {
          group: "patientSurvey",
          fields: [
            "patientSatisfactionAesthetic",
            "patientSatisfactionFunction",
            "patientSatisfactionTreatment",
            "patientSatisfactionMaintenance",
            "postOpPain",
          ],
          isChosen: true,
        },
      ],
    },
    surveyVsOpposingArch: {
      columns: [
        {
          group: "treatmentCharacteristics",
          fields: ["lowerArchCondition"],
          isChosen: true,
        },
      ],
      rows: [
        {
          group: "patientSurvey",
          fields: [
            "patientSatisfactionAesthetic",
            "patientSatisfactionFunction",
            "patientSatisfactionTreatment",
            "patientSatisfactionMaintenance",
            "postOpPain",
          ],
          isChosen: true,
        },
      ],
    },
    surveyVsTotalImplants: {
      columns: [
        {
          group: "treatmentCharacteristics",
          fields: ["totalImplants"],
          isChosen: true,
        },
      ],
      rows: [
        {
          group: "patientSurvey",
          fields: [
            "patientSatisfactionAesthetic",
            "patientSatisfactionFunction",
            "patientSatisfactionTreatment",
            "patientSatisfactionMaintenance",
            "postOpPain",
          ],
          isChosen: true,
        },
      ],
    },
    surveyVsZygomaImplants: {
      columns: [
        {
          group: "treatmentCharacteristics",
          fields: ["zygomaImplants"],
          isChosen: true,
        },
      ],
      rows: [
        {
          group: "patientSurvey",
          fields: [
            "patientSatisfactionAesthetic",
            "patientSatisfactionFunction",
            "patientSatisfactionTreatment",
            "patientSatisfactionMaintenance",
            "postOpPain",
          ],
          isChosen: true,
        },
      ],
    },
    numberOfImplantsAll: {
      columns: [
        {
          group: "treatmentCharacteristics",
          fields: ["totalCases"],
          isChosen: true,
        },
      ],
      rows: [
        {
          group: "treatmentCharacteristics",
          fields: ["totalImplants"],
          isChosen: true,
        },
      ],
    },
    numberOfImplantsZygoma: {
      columns: [
        {
          group: "treatmentCharacteristics",
          fields: ["totalCases"],
          isChosen: true,
        },
      ],
      rows: [
        {
          group: "treatmentCharacteristics",
          fields: ["zygomaImplants"],
          isChosen: true,
        },
      ],
    },
    numberOfImplantsRegular: {
      columns: [
        {
          group: "treatmentCharacteristics",
          fields: ["totalCases"],
          isChosen: true,
        },
      ],
      rows: [
        {
          group: "treatmentCharacteristics",
          fields: ["regularImplants"],
          isChosen: true,
        },
      ],
    },
    conformanceVsArchConditionEdentulous: {
      columns: [
        {
          group: "siteSpecificCharacteristics",
          fields: ["toothValue"],
          isChosen: true,
        },
      ],
      rows: [
        {
          group: "siteSpecificCharacteristics",
          fields: ["conformanceWithTreatmentPlan"],
          isChosen: true,
        },
      ],
    },
    conformanceVsArchConditionOther: {
      columns: [
        {
          group: "siteSpecificCharacteristics",
          fields: ["toothValue"],
          isChosen: true,
        },
      ],
      rows: [
        {
          group: "siteSpecificCharacteristics",
          fields: ["conformanceWithTreatmentPlan"],
          isChosen: true,
        },
      ],
    },

    immediacy: {
      columns: [
        {
          group: "treatmentCharacteristics",
          fields: ["totalCases"],
          isChosen: true,
        },
      ],
      rows: [
        {
          group: "treatmentCharacteristics",
          fields: ["immediateAesthetics", "immediateFunctionSpeech"],
          isChosen: true,
        },
      ],
    },
    timeToImmediateFinalTeeth: {
      columns: [
        {
          group: "treatmentCharacteristics",
          fields: ["totalCases"],
          isChosen: true,
        },
      ],
      rows: [
        {
          group: "treatmentCharacteristics",
          fields: ["timeFromSurgery"],
          isChosen: true,
        },
      ],
    },
    complicationsReportByImplantType: {
      columns: [
        {
          group: "siteSpecificCharacteristics",
          fields: ["implantLine"],
          isChosen: true,
        },
      ],
      rows: [
        {
          group: "siteSpecificCharacteristics",
          fields: ["implantFunctionAtFollowUp"],
          isChosen: true,
        },
      ],
    },
    complicationsReportByDiagnosisAetiology: {
      columns: [
        {
          group: "treatmentCharacteristics",
          fields: ["diagnosisOrAetiology"],
          isChosen: true,
        },
      ],
      rows: [
        {
          group: "siteSpecificCharacteristics",
          fields: ["implantFunctionAtFollowUp"],
          isChosen: true,
        },
      ],
    },
    complicationsReportByBruxism: {
      columns: [
        {
          group: "patientCharacteristics",
          fields: ["bruxism"],
          isChosen: true,
        },
      ],
      rows: [
        {
          group: "siteSpecificCharacteristics",
          fields: ["implantFunctionAtFollowUp"],
          isChosen: true,
        },
      ],
    },
    complicationsReportByHygiene: {
      columns: [
        {
          group: "patientCharacteristics",
          fields: ["oralHygiene"],
          isChosen: true,
        },
      ],
      rows: [
        {
          group: "siteSpecificCharacteristics",
          fields: ["implantFunctionAtFollowUp"],
          isChosen: true,
        },
      ],
    },
    complicationsReportBySmoking: {
      columns: [
        {
          group: "patientCharacteristics",
          fields: ["smoking"],
          isChosen: true,
        },
      ],
      rows: [
        {
          group: "siteSpecificCharacteristics",
          fields: ["implantFunctionAtFollowUp"],
          isChosen: true,
        },
      ],
    },

    inflammationVsImplantType: {
      columns: [
        {
          group: "siteSpecificCharacteristics",
          fields: ["implantLine"],
          isChosen: true,
        },
      ],
      rows: [
        {
          group: "siteSpecificCharacteristics",
          fields: ["inflammation"],

          isChosen: true,
        },
      ],
    },
    inflammationVsDiagnosisAetiology: {
      columns: [
        {
          roup: "treatmentCharacteristics",
          fields: ["diagnosisOrAetiology"],

          isChosen: true,
        },
      ],

      rows: [
        {
          group: "siteSpecificCharacteristics",
          fields: ["inflammation"],
          isChosen: true,
        },
      ],
    },
    inflammationVsBruxism: {
      columns: [
        {
          group: "patientCharacteristics",
          fields: ["bruxism"],
          isChosen: true,
        },
      ],
      rows: [
        {
          group: "siteSpecificCharacteristics",
          fields: ["inflammation"],
          isChosen: true,
        },
      ],
    },

    inflammationVsHygiene: {
      columns: [
        {
          group: "patientCharacteristics",
          fields: ["oralHygiene"],

          isChosen: true,
        },
      ],
      rows: [
        {
          group: "siteSpecificCharacteristics",
          fields: ["inflammation"],
          isChosen: true,
        },
      ],
    },
    recessionVsImplantType: {
      columns: [
        {
          group: "siteSpecificCharacteristics",
          fields: ["implantLine"],
          isChosen: true,
        },
      ],
      rows: [
        {
          group: "siteSpecificCharacteristics",
          fields: ["recession"],
          isChosen: true,
        },
      ],
    },
    recessionVsDiagnosisAetiology: {
      columns: [
        {
          group: "treatmentCharacteristics",
          fields: ["diagnosisOrAetiology"],
          isChosen: true,
        },
      ],
      rows: [
        {
          group: "siteSpecificCharacteristics",
          fields: ["recession"],

          isChosen: true,
        },
      ],
    },
    recessionVsBruxism: {
      columns: [
        {
          group: "patientCharacteristics",
          fields: ["bruxism"],
          isChosen: true,
        },
      ],
      rows: [
        {
          group: "siteSpecificCharacteristics",
          fields: ["recession"],
          isChosen: true,
        },
      ],
    },
    recessionVsHygiene: {
      columns: [
        {
          group: "patientCharacteristics",
          fields: ["oralHygiene"],
          isChosen: true,
        },
      ],
      rows: [
        {
          group: "siteSpecificCharacteristics",
          fields: ["recession"],
          isChosen: true,
        },
      ],
    },
    midShaftDehiscenceVsImplantType: {
      columns: [
        {
          group: "siteSpecificCharacteristics",
          fields: ["implantLine"],
          isChosen: true,
        },
      ],
      rows: [
        {
          group: "siteSpecificCharacteristics",
          fields: ["midShaftSoftTissueDehiscence"],
          isChosen: true,
        },
      ],
    },
    midShaftDehiscenceVsDiagnosisAetiology: {
      columns: [
        {
          group: "treatmentCharacteristics",
          fields: ["diagnosisOrAetiology"],
          isChosen: true,
        },
      ],
      rows: [
        {
          group: "siteSpecificCharacteristics",
          fields: ["midShaftSoftTissueDehiscence"],
          isChosen: true,
        },
      ],
    },
    midShaftDehiscenceVsBruxism: {
      columns: [
        {
          group: "patientCharacteristics",
          fields: ["bruxism"],
          isChosen: true,
        },
      ],
      rows: [
        {
          group: "siteSpecificCharacteristics",
          fields: ["midShaftSoftTissueDehiscence"],
          isChosen: true,
        },
      ],
    },
    midShaftDehiscenceVsHygiene: {
      columns: [
        {
          group: "patientCharacteristics",
          fields: ["oralHygiene"],
          isChosen: true,
        },
      ],
      rows: [
        {
          group: "siteSpecificCharacteristics",
          fields: ["midShaftSoftTissueDehiscence"],

          isChosen: true,
        },
      ],
    },
    suppurationVsImplantType: {
      columns: [
        {
          group: "siteSpecificCharacteristics",
          fields: ["implantLine"],

          isChosen: true,
        },
      ],
      rows: [
        {
          group: "siteSpecificCharacteristics",
          fields: ["suppuration"],
          isChosen: true,
        },
      ],
    },
    placementDistribution: {
      columns: [
        {
          group: "siteSpecificCharacteristics",
          fields: ["implantCategory"],
          isChosen: true,
        },
      ],
      rows: [
        {
          group: "siteSpecificCharacteristics",
          fields: ["placement"],
          isChosen: true,
        },
      ],
    },
    sinusitisAtFollowUpVsPreOpSinusDisease: {
      columns: [
        {
          group: "siteSpecificCharacteristics",
          fields: ["preOperativeSinusDisease"],
          isChosen: true,
        },
      ],
      rows: [
        {
          group: "siteSpecificCharacteristics",
          fields: ["sinusitis"],
          isChosen: true,
        },
      ],
    },
    sinusitisAtFollowUpVSPreOpSinusDiseaseManagement: {
      columns: [
        {
          group: "siteSpecificCharacteristics",
          fields: ["preOperativeSinusDiseaseManagement"],
          isChosen: true,
        },
      ],
      rows: [
        {
          group: "siteSpecificCharacteristics",
          fields: ["sinusitis"],
          isChosen: true,
        },
      ],
    },
  };

  const tableRef = useRef(null);
  const tableData = useMemo(() => {
    const result = [];
    let siteTotalCounts = 0;
    if (selectedRows?.length > 0 && selectedColumns?.length > 0) {
      const fields = [
        ...selectedRows.map((row) => row.fields).flat(),
        ...selectedColumns.map((col) => col.fields).flat(),
      ];
      if (reportType === "placementDistribution") {
        const allSites = filteredData
          ?.map(
            (record) =>
              record.attachedDentalCharts?.[0]?.proposedTreatmentToothMatrix,
          )
          ?.flat()
          ?.filter((site) => site.treatmentItemNumber === "688");
        const onlyRegularImplants = allSites?.filter((site) => {
          const implantCategory =
            site.attachedSiteSpecificRecords?.[0]?.itemSpecificationMatrix?.[0]
              ?.implantCategoryLabel;
          return implantCategory?.includes("Regular Implant");
        });

        const placementData = onlyRegularImplants?.reduce((acc, site) => {
          const placement =
            site?.attachedSiteSpecificRecords?.[0]?.itemSpecificationMatrix?.[0]
              ?.placement;
          const placementKey =
            placement?.length > 0 ? placement : "Placement (Not Recorded)";
          acc[placementKey] = (acc[placementKey] || 0) + 1;
          return acc;
        }, {});
        Object.keys(placementData || {}).forEach((key) => {
          result.push({
            columnHeader: "implantCategory",
            columnValue: "Regular Implant",
            colSampleSize: onlyRegularImplants.length,
            rowHeader: "placement",
            rowValue: key,
            count: placementData[key],
            totalCount: allSites.length,
          });
        });
        const onlyZygomaImplants = allSites?.filter((site) => {
          const implantCategory =
            site.attachedSiteSpecificRecords?.[0]?.itemSpecificationMatrix?.[0]
              ?.implantCategoryLabel;
          return implantCategory?.includes("Zygomatic Implant");
        });
        const zygomaPlacementData = onlyZygomaImplants?.reduce((acc, site) => {
          const placement =
            site?.attachedSiteSpecificRecords?.[0]?.itemSpecificationMatrix?.[0]
              ?.placement;
          const placementKey =
            placement?.length > 0 ? placement : "Placement (Not Recorded)";
          acc[placementKey] = (acc[placementKey] || 0) + 1;
          return acc;
        }, {});

        Object.keys(zygomaPlacementData || {}).forEach((key) => {
          result.push({
            columnHeader: "implantCategory",
            columnValue: "Zygomatic Implant",
            colSampleSize: onlyZygomaImplants.length,
            rowHeader: "placement",
            rowValue: key,
            count: zygomaPlacementData[key],
            totalCount: allSites.length,
          });
        });

        const otherImplants = allSites?.filter((site) => {
          const implantCategory =
            site.attachedSiteSpecificRecords?.[0]?.itemSpecificationMatrix?.[0]
              ?.implantCategoryLabel;
          return (
            !implantCategory?.includes("Regular Implant") &&
            !implantCategory?.includes("Zygomatic Implant")
          );
        });
        const otherPlacementData = otherImplants?.reduce((acc, site) => {
          const placement =
            site?.attachedSiteSpecificRecords?.[0]?.itemSpecificationMatrix?.[0]
              ?.placement;
          const placementKey = "Placement (Not Recorded)";
          acc[placementKey] = (acc[placementKey] || 0) + 1;
          return acc;
        }, {});
        Object.keys(otherPlacementData || {}).forEach((key) => {
          result.push({
            columnHeader: "implantCategory",
            columnValue: "Not Recorded",
            colSampleSize: otherImplants.length,
            rowHeader: "placement",
            rowValue: key,
            count: otherPlacementData[key],
            totalCount: allSites.length,
          });
        });
      } else if (reportType?.includes("complicationsReport")) {
        const colField = selectedColumns?.[0]?.fields?.[0];

        const rowField = selectedRows?.[0]?.fields?.[0];
        const allSites = filteredData
          ?.map((record) =>
            record.attachedDentalCharts?.[0]?.proposedTreatmentToothMatrix?.map(
              (site) => {
                return {
                  ...site,
                  key:
                    record?.[colField] ||
                    site?.attachedSiteSpecificRecords?.[0]
                      ?.itemSpecificationMatrix?.[0]?.[colField] ||
                    "Not Recorded",
                };
              },
            ),
          )
          ?.flat()
          ?.filter(
            (site) =>
              site.treatmentItemNumber === "688" &&
              site.attachedSiteSpecificRecords?.[0]
                ?.attachedSiteSpecificFollowUp?.[0]?.implantFunctionAtFollowUp
                ?.length > 0,
          );
        const colOptions =
          colField === "implantLine"
            ? [
                ...implantLineOptions?.map((opt) => {
                  return {
                    name: opt,
                    value: opt,
                    isReport: true,
                  };
                }),
              ]
            : clinlogFilterColumns
                .find((col: any) => col.key === colField)
                ?.options?.map((val) => {
                  return {
                    name: val.name,
                    value: val.value,
                    isReport: val?.isReport || false,
                  };
                })
                ?.filter((opt) => opt?.isReport);

        colOptions?.forEach((option) => {
          const yesfilteredSites = allSites?.filter((site) => {
            const implantFunction =
              site.attachedSiteSpecificRecords?.[0]
                ?.attachedSiteSpecificFollowUp?.[0]?.implantFunctionAtFollowUp;
            return site?.key === option.value && implantFunction === "Yes";
          });
          const noFilteredSites = allSites?.filter((site) => {
            const implantFunction =
              site.attachedSiteSpecificRecords?.[0]
                ?.attachedSiteSpecificFollowUp?.[0]?.implantFunctionAtFollowUp;
            return (
              site?.key === option.value && implantFunction === "No (failed)"
            );
          });
          const sleeperFilteredSites = allSites?.filter((site) => {
            const implantFunction =
              site.attachedSiteSpecificRecords?.[0]
                ?.attachedSiteSpecificFollowUp?.[0]?.implantFunctionAtFollowUp;
            return site?.key === option.value && implantFunction === "Sleeper";
          });
          const notRecordedFilteredSites = allSites?.filter((site) => {
            const implantFunction =
              site.attachedSiteSpecificRecords?.[0]
                ?.attachedSiteSpecificFollowUp?.[0]?.implantFunctionAtFollowUp;

            return (
              site?.key === option.value &&
              implantFunction !== "Sleeper" &&
              implantFunction !== "No (failed)" &&
              implantFunction !== "Yes"
            );
          });
          result.push({
            columnHeader: colField,
            columnValue: colField === "smoking" ? option.name : option.value,
            colSampleSize:
              allSites?.filter((site) => site?.key === option.value)?.length ||
              0,
            rowHeader: "implantFunctionAtFollowUp",
            rowValue: "Yes",
            count: yesfilteredSites?.length || 0,
            totalCount: allSites.length,
          });
          result.push({
            columnHeader: colField,
            columnValue: colField === "smoking" ? option.name : option.value,
            colSampleSize:
              allSites?.filter((site) => site?.key === option.value)?.length ||
              0,
            rowHeader: "implantFunctionAtFollowUp",
            rowValue: "No (failed)",
            count: noFilteredSites?.length || 0,
            totalCount: allSites.length,
          });
          result.push({
            columnHeader: colField,
            columnValue: colField === "smoking" ? option.name : option.value,
            colSampleSize:
              allSites?.filter((site) => site?.key === option.value)?.length ||
              0,
            rowHeader: "implantFunctionAtFollowUp",
            rowValue: "Sleeper",
            count: sleeperFilteredSites?.length || 0,
            totalCount: allSites.length,
          });
          result.push({
            columnHeader: colField,
            columnValue: colField === "smoking" ? option.name : option.value,
            colSampleSize:
              allSites?.filter((site) => site?.key === option.value)?.length ||
              0,
            rowHeader: "implantFunctionAtFollowUp",
            rowValue: "implantFunctionAtFollowUp (Not Recorded)",
            count: notRecordedFilteredSites?.length || 0,
            totalCount: allSites.length,
          });
        });

        // const onlyYesImplantFunction = allSites?.filter((site) => {
        //   const implantFunction =
        //     site.attachedSiteSpecificRecords?.[0]
        //       ?.attachedSiteSpecificFollowUp?.[0]?.implantFunctionAtFollowUp;
        //   return implantFunction === "Yes";
        // });
        // const bruxismData = onlyYesImplantFunction?.reduce((acc, site) => {
        //   const bruxism = site?.bruxism || "Not Recorded";
        //   acc[bruxism] = (acc[bruxism] || 0) + 1;
        //   return acc;
        // }, {});
        // Object.keys(bruxismData || {}).forEach((key) => {
        //   result.push({
        //     columnHeader: "implantFunctionAtFollowUp",
        //     columnValue: "Yes",
        //     colSampleSize: onlyYesImplantFunction.length,
        //     rowHeader: "bruxism",
        //     rowValue: key,
        //     count: bruxismData[key],
        //     totalCount: allSites.length,
        //   });
        // });
        // const onlyNoImplantFunction = allSites?.filter((site) => {
        //   const implantFunction =
        //     site.attachedSiteSpecificRecords?.[0]
        //       ?.attachedSiteSpecificFollowUp?.[0]?.implantFunctionAtFollowUp;
        //   return implantFunction === "No (failed)";
        // });
        // const noImplantFunctionData = onlyNoImplantFunction?.reduce(
        //   (acc, site) => {
        //     const bruxism = site?.bruxism || "Not Recorded";
        //     acc[bruxism] = (acc[bruxism] || 0) + 1;
        //     return acc;
        //   },
        //   {},
        // );
        // Object.keys(noImplantFunctionData || {}).forEach((key) => {
        //   result.push({
        //     columnHeader: "implantFunctionAtFollowUp",
        //     columnValue: "No (failed)",
        //     colSampleSize: onlyNoImplantFunction.length,
        //     rowHeader: "bruxism",
        //     rowValue: key,
        //     count: noImplantFunctionData[key],
        //     totalCount: allSites.length,
        //   });
        // });
        // const onlySleeperImplantFunction = allSites?.filter((site) => {
        //   const implantFunction =
        //     site.attachedSiteSpecificRecords?.[0]
        //       ?.attachedSiteSpecificFollowUp?.[0]?.implantFunctionAtFollowUp;
        //   return implantFunction === "Sleeper";
        // });
        // const sleeperImplantFunctionData = onlySleeperImplantFunction?.reduce(
        //   (acc, site) => {
        //     const bruxism = site?.bruxism || "Not Recorded";
        //     acc[bruxism] = (acc[bruxism] || 0) + 1;
        //     return acc;
        //   },
        //   {},
        // );
        // Object.keys(sleeperImplantFunctionData || {}).forEach((key) => {
        //   result.push({
        //     columnHeader: "implantFunctionAtFollowUp",
        //     columnValue: "Sleeper",
        //     colSampleSize: onlySleeperImplantFunction.length,
        //     rowHeader: "bruxism",
        //     rowValue: key,
        //     count: sleeperImplantFunctionData[key],
        //     totalCount: allSites.length,
        //   });
        // });
      } else if (reportType?.includes("inflammationVs")) {
        const colField = selectedColumns?.[0]?.fields?.[0];
        const rowField = selectedRows?.[0]?.fields?.[0];
        const allSites = filteredData
          ?.map((record) =>
            record.attachedDentalCharts?.[0]?.proposedTreatmentToothMatrix?.map(
              (site) => {
                return {
                  ...site,
                  key:
                    record?.[colField] ||
                    site?.attachedSiteSpecificRecords?.[0]
                      ?.itemSpecificationMatrix?.[0]?.[colField],
                };
              },
            ),
          )
          ?.flat()
          ?.filter(
            (site) =>
              site.treatmentItemNumber === "688" &&
              site?.key?.length > 0 &&
              site.attachedSiteSpecificRecords?.[0]
                ?.attachedSiteSpecificFollowUp?.[0]?.inflammation,
          );
        const colOptions =
          colField === "implantLine"
            ? implantLineOptions?.map((opt) => {
                return {
                  name: opt,
                  value: opt,
                  isReport: true,
                };
              })
            : clinlogFilterColumns
                .find((col) => col.key === colField)
                ?.options?.map((val) => {
                  return {
                    name: val.name,
                    value: val.value,
                    isReport: val?.isReport || false,
                  };
                })
                ?.filter((opt) => opt?.isReport);

        colOptions?.forEach((option) => {
          const filteredSites = allSites?.filter(
            (site) => site?.key === option.value,
          );
          const inflammationData = filteredSites?.reduce((acc, site) => {
            const inflammation =
              site?.attachedSiteSpecificRecords?.[0]
                ?.attachedSiteSpecificFollowUp?.[0]?.inflammation ||
              "Not Recorded";
            acc[inflammation] = (acc[inflammation] || 0) + 1;
            return acc;
          }, {});

          Object.keys(inflammationData || {}).forEach((key) => {
            result.push({
              columnHeader: colField,
              columnValue: colField === "smoking" ? option.name : option.value,
              colSampleSize: filteredSites?.length || 0,
              rowHeader: "inflammation",
              rowValue: key,
              count: inflammationData[key],
              totalCount: allSites.length,
            });
          });
        });
      } else if (reportType?.includes("recessionVs")) {
        const colField = selectedColumns?.[0]?.fields?.[0];
        const rowField = selectedRows?.[0]?.fields?.[0];
        const allSites = filteredData
          ?.map((record) =>
            record.attachedDentalCharts?.[0]?.proposedTreatmentToothMatrix?.map(
              (site) => {
                return {
                  ...site,
                  key:
                    record?.[colField] ||
                    site?.attachedSiteSpecificRecords?.[0]
                      ?.itemSpecificationMatrix?.[0]?.[colField],
                };
              },
            ),
          )
          ?.flat()
          ?.filter(
            (site) =>
              site.treatmentItemNumber === "688" &&
              site?.key?.length > 0 &&
              site.attachedSiteSpecificRecords?.[0]
                ?.attachedSiteSpecificFollowUp?.[0]?.recession,
          );

        const colOptions =
          colField === "implantLine"
            ? implantLineOptions?.map((opt) => {
                return {
                  name: opt,
                  value: opt,
                  isReport: true,
                };
              })
            : clinlogFilterColumns
                .find((col) => col.key === colField)
                ?.options?.map((val) => {
                  return {
                    name: val.name,
                    value: val.value,
                    isReport: val?.isReport || false,
                  };
                })
                ?.filter((opt) => opt?.isReport);

        colOptions?.forEach((option) => {
          const filteredSites = allSites?.filter(
            (site) => site?.key === option.value,
          );
          const recessionData = filteredSites?.reduce((acc, site) => {
            const recession =
              site?.attachedSiteSpecificRecords?.[0]
                ?.attachedSiteSpecificFollowUp?.[0]?.recession ||
              "Not Recorded";
            acc[recession] = (acc[recession] || 0) + 1;
            return acc;
          }, {});

          Object.keys(recessionData || {}).forEach((key) => {
            result.push({
              columnHeader: colField,
              columnValue: colField === "smoking" ? option.name : option.value,
              colSampleSize: filteredSites?.length || 0,
              rowHeader: "recession",
              rowValue: key,
              count: recessionData[key],
              totalCount: allSites.length,
            });
          });
        });
      } else if (reportType?.includes("midShaftDehiscenceVs")) {
        const colField = selectedColumns?.[0]?.fields?.[0];
        const rowField = selectedRows?.[0]?.fields?.[0];
        const allSites = filteredData
          ?.map((record) =>
            record.attachedDentalCharts?.[0]?.proposedTreatmentToothMatrix?.map(
              (site) => {
                return {
                  ...site,
                  key:
                    record?.[colField] ||
                    site?.attachedSiteSpecificRecords?.[0]
                      ?.itemSpecificationMatrix?.[0]?.[colField],
                };
              },
            ),
          )
          ?.flat()
          ?.filter(
            (site) =>
              site.treatmentItemNumber === "688" &&
              site?.key?.length > 0 &&
              site.attachedSiteSpecificRecords?.[0]
                ?.attachedSiteSpecificFollowUp?.[0]
                ?.midShaftSoftTissueDehiscence,
          );

        const colOptions =
          colField === "implantLine"
            ? implantLineOptions?.map((opt) => {
                return {
                  name: opt,
                  value: opt,
                  isReport: true,
                };
              })
            : clinlogFilterColumns
                .find((col) => col.key === colField)
                ?.options?.map((val) => {
                  return {
                    name: val.name,
                    value: val.value,
                    isReport: val?.isReport || false,
                  };
                })
                ?.filter((opt) => opt?.isReport);

        colOptions?.forEach((option) => {
          const filteredSites = allSites?.filter(
            (site) => site?.key === option.value,
          );
          const midShaftSoftTissueDehiscenceData = filteredSites?.reduce(
            (acc, site) => {
              const midShaftSoftTissueDehiscence =
                site?.attachedSiteSpecificRecords?.[0]
                  ?.attachedSiteSpecificFollowUp?.[0]
                  ?.midShaftSoftTissueDehiscence || "Not Recorded";
              acc[midShaftSoftTissueDehiscence] =
                (acc[midShaftSoftTissueDehiscence] || 0) + 1;
              return acc;
            },
            {},
          );

          Object.keys(midShaftSoftTissueDehiscenceData || {}).forEach((key) => {
            result.push({
              columnHeader: colField,
              columnValue: colField === "smoking" ? option.name : option.value,
              colSampleSize: filteredSites?.length || 0,
              rowHeader: "midShaftSoftTissueDehiscence",
              rowValue: key,
              count: midShaftSoftTissueDehiscenceData[key],
              totalCount: allSites.length,
            });
          });
        });
      } else if (reportType?.includes("suppurationVs")) {
        const colField = selectedColumns?.[0]?.fields?.[0];
        const rowField = selectedRows?.[0]?.fields?.[0];
        const allSites = filteredData
          ?.map((record) =>
            record.attachedDentalCharts?.[0]?.proposedTreatmentToothMatrix?.map(
              (site) => {
                return {
                  ...site,
                  key:
                    record?.[colField] ||
                    site?.attachedSiteSpecificRecords?.[0]
                      ?.itemSpecificationMatrix?.[0]?.[colField],
                };
              },
            ),
          )
          ?.flat()
          ?.filter(
            (site) =>
              site.treatmentItemNumber === "688" &&
              site?.key?.length > 0 &&
              site.attachedSiteSpecificRecords?.[0]
                ?.attachedSiteSpecificFollowUp?.[0]?.suppuration,
          );

        const colOptions =
          colField === "implantLine"
            ? implantLineOptions?.map((opt) => {
                return {
                  name: opt,
                  value: opt,
                  isReport: true,
                };
              })
            : clinlogFilterColumns
                .find((col) => col.key === colField)
                ?.options?.map((val) => {
                  return {
                    name: val.name,
                    value: val.value,
                    isReport: val?.isReport || false,
                  };
                })
                ?.filter((opt) => opt?.isReport);

        colOptions?.forEach((option) => {
          const filteredSites = allSites?.filter(
            (site) => site?.key === option.value,
          );
          const supperationData = filteredSites?.reduce((acc, site) => {
            const suppuration =
              site?.attachedSiteSpecificRecords?.[0]
                ?.attachedSiteSpecificFollowUp?.[0]?.suppuration ||
              "Not Recorded";
            acc[suppuration] = (acc[suppuration] || 0) + 1;
            return acc;
          }, {});

          Object.keys(supperationData || {}).forEach((key) => {
            result.push({
              columnHeader: colField,
              columnValue: colField === "smoking" ? option.name : option.value,
              colSampleSize: filteredSites?.length || 0,
              rowHeader: "suppuration",
              rowValue: key,
              count: supperationData[key],
              totalCount: allSites.length,
            });
          });
        });
      } else if (reportType?.includes("sinusitisAtFollowUp")) {
        const colField = selectedColumns?.[0]?.fields?.[0];

        const rowField = selectedRows?.[0]?.fields?.[0];
        const colOptions = clinlogFilterColumns
          .find((col) => col.key === colField)
          ?.options?.map((val) => {
            return {
              name: val.name,
              value: val.value,
              isReport: val?.isReport || false,
            };
          })
          ?.filter((opt) => opt?.isReport);

        const allSites = filteredData
          ?.map((record) =>
            record.attachedDentalCharts?.[0]?.proposedTreatmentToothMatrix?.map(
              (site) => {
                return {
                  ...site,
                  key:
                    record?.[colField] ||
                    site?.attachedSiteSpecificRecords?.[0]
                      ?.itemSpecificationMatrix?.[0]?.[colField],
                };
              },
            ),
          )
          ?.flat()
          ?.filter(
            (site) =>
              site.treatmentItemNumber === "688" &&
              colOptions?.map((op) => op?.value)?.includes(site?.key) &&
              ["Yes", "No"]?.includes(
                site.attachedSiteSpecificRecords?.[0]
                  ?.attachedSiteSpecificFollowUp?.[0]?.sinusitis || "",
              ),
          );

        colOptions?.forEach((option) => {
          const filteredSites = allSites?.filter(
            (site) => site?.key === option.value,
          );
          const sinusitisData = filteredSites?.reduce((acc, site) => {
            const sinusitis =
              site?.attachedSiteSpecificRecords?.[0]
                ?.attachedSiteSpecificFollowUp?.[0]?.sinusitis ||
              "Not Recorded";
            acc[sinusitis] = (acc[sinusitis] || 0) + 1;
            return acc;
          }, {});

          Object.keys(sinusitisData || {}).forEach((key) => {
            result.push({
              columnHeader: colField,
              columnValue: option.value,
              colSampleSize: filteredSites?.length || 0,
              rowHeader: "sinusitis",
              rowValue: key,
              count: sinusitisData[key],
              totalCount: allSites.length,
            });
          });
        });
      } else if (fields?.includes("totalCases")) {
        if (fields?.includes("totalImplants")) {
          const patientData = filteredData?.reduce((acc, record) => {
            const allSites =
              record.attachedDentalCharts?.[0]?.proposedTreatmentToothMatrix?.filter(
                (site) => site.treatmentItemNumber === "688",
              ) || [];
            const key = allSites.length;
            // Number(record["regularImplants"] || 0) +
            // Number(record["zygomaImplants"] || 0);

            acc[key] = (acc[key] || 0) + 1;
            return acc;
          }, {});

          Object.keys(patientData).forEach((key) => {
            if (Number(key) > 0) {
              result.push({
                columnHeader: "totalCases",
                columnValue: key,
                colSampleSize: filteredData.length,
                rowHeader: "totalImplants",
                rowValue: key,
                count: patientData[key],
                totalCount: filteredData.length,
              });
            } else {
              result.push({
                columnHeader: "totalCases",
                columnValue: 0,
                colSampleSize: filteredData.length,
                rowHeader: "totalImplants",
                rowValue: "Not Recorded",
                count: patientData[key],
                totalCount: filteredData.length,
              });
            }
          });
        } else if (fields?.includes("zygomaImplants")) {
          const patientData = filteredData?.reduce((acc, record) => {
            const zygomaSites =
              record.attachedDentalCharts?.[0]?.proposedTreatmentToothMatrix?.filter(
                (site) =>
                  site.treatmentItemNumber === "688" &&
                  site.attachedSiteSpecificRecords?.[0]?.itemSpecificationMatrix?.[0].implantCategoryLabel?.includes(
                    "Zygomatic Implant",
                  ),
              ) || [];

            //const key = Number(record["zygomaImplants"] || 0);
            const key = zygomaSites.length;
            acc[key] = (acc[key] || 0) + 1;
            return acc;
          }, {});

          Object.keys(patientData).forEach((key) => {
            result.push({
              columnHeader: "totalCases",
              columnValue: key,
              colSampleSize: filteredData.length,
              rowHeader: "zygomaImplants",
              rowValue: key,
              count: patientData[key],
              totalCount: filteredData.length,
            });
          });
        } else if (fields?.includes("regularImplants")) {
          const patientData = filteredData?.reduce((acc, record) => {
            const regularSites =
              record.attachedDentalCharts?.[0]?.proposedTreatmentToothMatrix?.filter(
                (site) =>
                  site.treatmentItemNumber === "688" &&
                  site.attachedSiteSpecificRecords?.[0]?.itemSpecificationMatrix?.[0].implantCategoryLabel?.includes(
                    "Regular Implant",
                  ),
              ) || [];

            //const key = Number(record["regularImplants"] || 0);
            const key = regularSites.length;
            acc[key] = (acc[key] || 0) + 1;
            return acc;
          }, {});
          Object.keys(patientData).forEach((key) => {
            result.push({
              columnHeader: "totalCases",
              columnValue: key,
              colSampleSize: filteredData.length,
              rowHeader: "regularImplants",
              rowValue: key,
              count: patientData[key],
              totalCount: filteredData.length,
            });
          });
        } else if (
          fields?.includes("immediateAesthetics") ||
          fields?.includes("immediateFunctionSpeech")
        ) {
          const patientData = filteredData?.reduce((acc, record) => {
            const key = record["immediateAesthetics"];

            acc[key] = (acc[key] || 0) + 1;
            return acc;
          }, {});
          Object.keys(patientData).forEach((key) => {
            result.push({
              columnHeader: "totalCases",
              columnValue: key,
              colSampleSize: filteredData.length,
              rowHeader: "immediateAesthetics",
              rowValue: key,
              count: patientData[key],
              totalCount: filteredData.length,
            });
          });
          const patientDataFunction = filteredData?.reduce((acc, record) => {
            const key = record["immediateFunctionSpeech"];
            acc[key] = (acc[key] || 0) + 1;
            return acc;
          }, {});

          if (fields?.includes("immediateFunctionSpeech")) {
            Object.keys(patientDataFunction).forEach((key) => {
              result.push({
                columnHeader: "totalCases",
                columnValue: key,
                colSampleSize: filteredData.length,
                rowHeader: "immediateFunctionSpeech",
                rowValue: key,
                count: patientDataFunction[key],
                totalCount: filteredData.length,
              });
            });
          }
        } else if (fields?.includes("timeFromSurgery")) {
          const patientData = filteredData?.reduce((acc, record) => {
            const timeDiff =
              record?.dateOfInsertion && record?.recordTreatmentDate
                ? differenceInDays(
                    new Date(
                      format(new Date(record.dateOfInsertion), "yyyy-MM-dd"),
                    ),
                    new Date(
                      format(
                        new Date(record.recordTreatmentDate),
                        "yyyy-MM-dd",
                      ),
                    ),
                  )
                : null;

            if (timeDiff > 0 && timeDiff <= 1) {
              acc["A) Within 24 hours"] = (acc["A) Within 24 hours"] || 0) + 1;
            } else if (timeDiff > 1 && timeDiff <= 4) {
              acc["B) 24 hours up to 4 days"] =
                (acc["B) 24 hours up to 4 days"] || 0) + 1;
            } else if (timeDiff > 4 && timeDiff <= 7) {
              acc["C) 5-7 days"] = (acc["C) 5-7 days"] || 0) + 1;
            } else if (timeDiff > 7) {
              acc["D) 8 days and over"] = (acc["D) 8 days and over"] || 0) + 1;
            } else {
              acc["E) Not Recorded"] = (acc["E) Not Recorded"] || 0) + 1;
            }

            return acc;
          }, {});
          Object.keys(patientData).forEach((key) => {
            result.push({
              columnHeader: "totalCases",
              columnValue: key,
              colSampleSize: filteredData.length,
              rowHeader: "timeFromSurgery",
              rowValue: key,
              count: patientData[key],
              totalCount: filteredData.length,
            });
          });
        }
      } else if (fields?.length > 0) {
        let options_unique = new Set();
        const patientData = filteredData?.map((record) => {
          const data = { id: record.id };
          fields.forEach((field) => {
            const groupField = clinlogFilterColumns.find(
              (column) => column.key === field,
            );
            if (groupField?.group === "followUp") {
              const followUpData = record.recordFollowUpMatrix?.[0];
              data[field] = followUpData?.[field];
            } else if (groupField.group === "patientSurvey") {
              const patientSurveyData = clinlogNotes?.find((note) => {
                return (
                  note?.recordNoteRecord?.[0]?.id === record?.id &&
                  note?.attachedSurveyForm?.length > 0
                );
              })?.attachedSurveyForm?.[0]?.patientSurveyMatrix?.[0];

              data[field] =
                patientSurveyData?.[field?.split("_")?.[0]]?.length > 0
                  ? patientSurveyData?.[field?.split("_")?.[0]]
                  : `${field} (Not Recorded)`;
              options_unique.add(data[field]);
            } else if (groupField.group === "siteSpecificCharacteristics") {
              const siteDetails =
                record.attachedDentalCharts?.[0]?.proposedTreatmentToothMatrix?.filter(
                  (site) => site.treatmentItemNumber === "688",
                );
              const siteSpecificData = siteDetails?.map((site) => {
                if (field === "toothValue") {
                  return { id: site?.id, field: site.toothValue };
                } else if (
                  clinlogFilterColumns?.find((col) => col.key === field)
                    ?.subGroup === "ssFollowUp"
                ) {
                  const siteFollowUpRecords =
                    site?.attachedSiteSpecificRecords?.[0]
                      ?.attachedSiteSpecificFollowUp?.[0];

                  return {
                    id: site?.id,
                    field:
                      siteFollowUpRecords?.[field] || `${field} (Not Recorded)`,
                  };
                }
                return {
                  id: site?.id,
                  field:
                    site.attachedSiteSpecificRecords?.[0]
                      ?.itemSpecificationMatrix?.[0]?.[field] ||
                    `${field} (Not Recorded)`,
                };
              });

              data[field] = siteSpecificData;
            } else if (groupField.type === "number") {
              if (field === "totalImplants") {
                const totalImplants =
                  Number(record["regularImplants"] || 0) +
                  Number(record["zygomaImplants"] || 0);
                data[field] = totalImplants;
              } else {
                data[field] = record[field] ? Number(record[field]) : null;
              }
            } else if (field === "recordTreatmentDate") {
              data[field] = record[field]
                ? format(new Date(record[field]), "dd MMM yyyy")
                : "";
            } else if (field === "recordTreatmentSurgeons") {
              data[field] =
                record[field].map((surgeon) => surgeon.fullName).flat() || [];
            } else {
              data[field] = record[field]
                ? record[field]
                : field + " (Not Recorded)";
            }
          });
          return data;
        });

        // if (
        //   selectedColumns?.some(
        //     (col) => col.group === "siteSpecificCharacteristics",
        //   ) ||
        //   selectedRows?.some(
        //     (row) => row.group === "siteSpecificCharacteristics",
        //   )
        // ) {
        //   if (fields.includes("toothValue")) {
        //     siteTotalCounts = patientData?.reduce((acc, record) => {
        //       const toothValues = record["toothValue"] || [];
        //       console.log("toothValues", toothValues);
        //       acc += toothValues.length;
        //       return acc;
        //     }, 0);
        //   }
        // }

        const columnFields = selectedColumns.map((col) => col.fields).flat();
        const rowFields = selectedRows.map((row) => row.fields).flat();

        columnFields.forEach((col) => {
          const groupCol = clinlogFilterColumns.find(
            (column) => column.key === col,
          );

          let colOptions = [];
          if (col === "ageAtTimeOfSurgery") {
            colOptions = [
              { value: "<40", name: "<40" },
              { value: "40-50", name: "40-50" },
              { value: "50-60", name: "50-60" },
              { value: "60-70", name: "60-70" },
              { value: ">70", name: ">70" },
            ];
          } else if (col === "recordTreatmentDate") {
            colOptions = [
              ...new Set(patientData?.map((record) => record[col])),
            ];
          } else if (col === "recordTreatmentSurgeons") {
            colOptions = [
              ...new Set(
                patientData
                  ?.map((record) => record[col]?.map((surgeon) => surgeon))
                  .flat(),
              ),
            ];
          } else if (col === "implantLine") {
            colOptions = implantLineOptions;
          } else if (groupCol?.type === "number") {
            colOptions = [
              ...new Set(patientData?.map((record) => record[col])),
            ];
          } else if (col === "toothValue") {
            colOptions = toothValueBygroup;
          } else {
            colOptions = groupCol?.options
              ?.map((val) => {
                return {
                  name: val.name,
                  value: val.value,
                  isReport: val?.isReport || false,
                };
              })
              ?.filter((option) => option?.isReport);
          }

          rowFields.forEach((row) => {
            const groupRow = clinlogFilterColumns.find(
              (column) => column.key === row,
            );

            let rowOptions = [];
            if (row === "ageAtTimeOfSurgery") {
              //@ts-ignore
              options = [
                { value: "<40", name: "<40" },
                { value: "40-50", name: "40-50" },
                { value: "50-60", name: "50-60" },
                { value: "60-70", name: "60-70" },
                { value: ">70", name: ">70" },
              ];
            } else if (row === "recordTreatmentDate") {
              rowOptions = [
                ...new Set(patientData?.map((record) => record[row])),
              ];
            } else if (row === "recordTreatmentSurgeons") {
              rowOptions = [
                ...new Set(
                  patientData
                    ?.map((record) => record[row]?.map((surgeon) => surgeon))
                    .flat(),
                ),
              ];
            } else if (row === "implantLine") {
              rowOptions = implantLineOptions;
            } else if (groupRow?.type === "number") {
              rowOptions = [
                ...new Set(patientData?.map((record) => record[row])),
              ];
            } else if (row === "toothValue") {
              rowOptions = toothValueBygroup;
            } else {
              rowOptions = groupRow?.options;
            }

            colOptions?.forEach((option) => {
              const columnFilteredData = patientData?.filter((record) => {
                if (groupCol.group === "siteSpecificCharacteristics") {
                  if (col === "toothValue") {
                    return option.value.some((val) =>
                      record[col]?.map((obj) => obj.field).includes(val),
                    );
                  }

                  return record[col]
                    ?.map((obj) => obj.field)
                    .includes(option.value);
                } else if (col === "ageAtTimeOfSurgery") {
                  if (option.value === "<40") return Number(record[col]) < 40;
                  if (option.value === "40-50")
                    return (
                      Number(record[col]) >= 40 && Number(record[col]) <= 50
                    );
                  if (option.value === "50-60")
                    return (
                      Number(record[col]) >= 50 && Number(record[col]) <= 60
                    );
                  if (option.value === "60-70")
                    return (
                      Number(record[col]) >= 60 && Number(record[col]) <= 70
                    );
                  if (option.value === ">70") return Number(record[col]) > 70;
                } else if (col === "recordTreatmentSurgeons") {
                  return record[col]?.includes(option);
                } else if (col === "recordTreatmentDate") {
                  return record[col] === option;
                }
                return record[col] === option?.value || record[col] === option;
              });
              if (fields.includes("toothValue")) {
                siteTotalCounts = siteTotalCounts + columnFilteredData?.length;
              }
              rowOptions
                ?.filter((op) => op?.isReport || typeof op === "string")
                ?.forEach((rowOpt) => {
                  const data = columnFilteredData?.filter((record) => {
                    if (groupRow.group === "siteSpecificCharacteristics") {
                      let found = false;
                      if (row === "toothValue") {
                        record[col]?.forEach((site) => {
                          record[row]?.forEach((siteRow) => {
                            if (site?.id === siteRow?.id) {
                              found = rowOpt.value.some(
                                (val) => siteRow.field === val,
                              );
                            }
                          });
                        });
                        return found;
                        // return rowOpt.value.some((val) =>
                        //   record[row].includes(val),
                        // );
                      }

                      record[col]?.forEach((site) => {
                        record[row]?.forEach((siteRow) => {
                          if (site?.id === siteRow?.id) {
                            // const foundObj =
                            //   rowOpt?.value?.find((val) => {
                            //     return siteRow.field === val;
                            //   }) || null;
                            const foundObj = null;

                            found =
                              rowOpt?.value === siteRow.field ||
                              rowOpt === siteRow.field;
                          }
                        });
                      });
                      return found;

                      //return record[row].includes(rowOpt.value);
                    } else if (row === "ageAtTimeOfSurgery") {
                      if (rowOpt.value === "<40")
                        return Number(record[row]) < 40;
                      if (rowOpt.value === "40-50")
                        return (
                          Number(record[row]) >= 40 && Number(record[row]) <= 50
                        );
                      if (rowOpt.value === "50-60")
                        return (
                          Number(record[row]) >= 50 && Number(record[row]) <= 60
                        );
                      if (rowOpt.value === "60-70")
                        return (
                          Number(record[row]) >= 60 && Number(record[row]) <= 70
                        );
                      if (rowOpt.value === ">70")
                        return Number(record[row]) > 70;
                    } else if (row === "recordTreatmentSurgeons") {
                      return record[row].includes(rowOpt);
                    } else if (groupRow.type === "number") {
                      return record[row] === Number(rowOpt);
                    } else if (row === "recordTreatmentDate") {
                      return record[row] === rowOpt;
                    }

                    return record[row] === rowOpt.value;
                  }).length;

                  result.push({
                    columnHeader: col,
                    columnValue: option?.name
                      ? option.name
                      : option?.toString(),
                    colSampleSize: columnFilteredData.length,
                    rowHeader: row,
                    rowValue: rowOpt?.name ? rowOpt.name : rowOpt?.toString(),
                    count: data,
                    totalCount:
                      siteTotalCounts > 0
                        ? siteTotalCounts
                        : filteredData.length,
                  });
                });
            });
          });
        });
      }
    }

    return result;
  }, [selectedRows, selectedColumns, filteredData]);

  // useEffect(() => {
  //   if (reportType === "placementDistribution") {
  //     const allSites = filteredData
  //       ?.map(
  //         (record) =>
  //           record.attachedDentalCharts?.[0]?.proposedTreatmentToothMatrix,
  //       )
  //       .flat()
  //       .filter((site) => site.treatmentItemNumber === "688");
  //     const onlyRegularImplants = allSites?.filter((site) => {
  //       const implantCategory =
  //         site.attachedSiteSpecificRecords?.[0]?.itemSpecificationMatrix?.[0]
  //           ?.implantCategoryLabel;
  //       return (
  //         implantCategory?.includes("Regular Implant") ||
  //         implantCategory?.includes("Other")
  //       );
  //     });
  //     const placementData = onlyRegularImplants?.map((site) => {
  //       return {
  //         id: site.id,
  //         toothValue: site.toothValue,
  //         placement:
  //           site.attachedSiteSpecificRecords?.[0]?.itemSpecificationMatrix?.[0]
  //             ?.placement,
  //       };
  //     });
  //   }
  // }, [reportType]);
  // const downloadPDF = async () => {
  //   if (!tableRef.current) return;
  //   const element = tableRef.current;
  //   const originalOverflow = element.style.overflow;
  //   const originalHeight = element.style.height;

  //   // Force full content visibility
  //   element.style.overflow = "visible";
  //   element.style.height = `${element.scrollHeight}px`;

  //   const canvas = await html2canvas(element, {
  //     backgroundColor: "#ffffff",
  //     useCORS: true,
  //     scale: 2,
  //   });

  //   element.style.overflow = originalOverflow;
  //   element.style.height = originalHeight;
  //   const imgData = canvas.toDataURL("image/png");

  //   // const pdf = new jsPDF("p", "mm", "a4");

  //   // const pdfWidth = pdf.internal.pageSize.getWidth();
  //   // const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

  //   // Create a PDF with custom height
  //   const pdfWidth = canvas.width * 0.264583; // px → mm (1px ≈ 0.264583 mm)
  //   const pdfHeight = canvas.height * 0.264583;
  //   const margin = 10; // 10mm margin on each side
  //   const pdf = new jsPDF({
  //     orientation: "landscape",
  //     unit: "mm",
  //     format: [pdfWidth + 2 * margin, pdfHeight + 2 * margin], // freeform page size
  //   });

  //   // Add image (auto scales)

  //   pdf.addImage(imgData, "PNG", 10, 10, pdfWidth, pdfHeight);
  //   const pdfname = `${reportOptions?.find((o) => o.value === reportType)?.name?.replaceAll(" ", "_")}.pdf`;
  //   pdf.save(pdfname);
  // };
  const downloadPDF = async () => {
    if (!tableRef.current) return;
    const node = tableRef.current;

    // Save original styles
    const originalOverflow = node.style.overflow;
    const originalHeight = node.style.height;

    // Temporarily show full content
    node.style.overflow = "visible";
    node.style.height = "auto";
    node.style.width = "auto";
    const wrapper = document.createElement("div");
    wrapper.style.background = "#ffffff";
    wrapper.style.padding = "24px 40px 24px 20px"; // top, right, bottom, left

    // wrapper.style.paddingBottom = "24px";

    wrapper.style.display = "inline-block"; // important

    // Insert wrapper
    node.parentNode!.insertBefore(wrapper, node);
    wrapper.appendChild(node);

    try {
      const dataUrl = await domtoimage.toPng(wrapper, {
        bgcolor: "#ffffff",
      });

      const link = document.createElement("a");
      const pdfname = `${reportOptions?.find((o) => o.value === reportType)?.name?.replaceAll(" ", "_")}.png`;
      link.download = pdfname;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("Error generating PNG:", error);
    } finally {
      // Restore original styles
      wrapper.parentNode!.insertBefore(node, wrapper);
      wrapper.remove();
      node.style.overflow = originalOverflow;
      node.style.height = originalHeight;
    }
  };
  useEffect(() => {
    if (globalFilter.length === 0) {
      setReportType("");
      setSelectedColumns([{ group: "", fields: [], isChosen: false }]);
      setSelectedRows([{ group: "", fields: [], isChosen: false }]);
    } else {
      const selectedReport = columnsRows[reportType];
      setSelectedColumns(selectedReport?.columns);
      setSelectedRows(selectedReport?.rows);
    }
  }, [globalFilter]);
  // useEffect(() => {
  //   if (reportType === "timeToImmediateFinalTeeth") {
  //     const selectedReport = columnsRows[reportType];
  //     setSelectedColumns(selectedReport?.columns);
  //     setSelectedRows(selectedReport?.rows);
  //   }
  // }, [reportType]);
  return (
    <Flex flexDirection={"column"} w="100%" gap="1rem">
      <Card className="mt-2 flex flex-col justify-center w-full p-8">
        <Text mb="2" fontWeight={"700"}>
          Reports:
        </Text>
        <Flex gap="0.5rem" w="100%" mb="8">
          <Flex flexDirection={"column"}>
            <Select
              value={reportType}
              onChange={(e) => {
                setReportType(e.target.value);
                // console.log("e.target.value", e.target.value);
                // const selectedReport = columsRows[e.target.value];

                if (filterReportOptions[e.target.value]) {
                  setGlobalFilter(filterReportOptions[e.target.value] || []);
                }
                // setSelectedColumns(selectedReport?.columns);
                // setSelectedRows(selectedReport?.rows);
              }}
            >
              <option value="">-- Select --</option>
              {reportOptions.map((report) => (
                <option key={report.value} value={report.value}>
                  {report.name}
                </option>
              ))}
            </Select>
          </Flex>
        </Flex>
      </Card>
      <Flex flexDirection={"column"} w="100%">
        <Flex justify={"flex-end"} gap="2">
          <Button
            size="sm"
            mb="2"
            leftIcon={<DownloadIcon />}
            bg="linear-gradient(90deg, var(--clinlog-purple, #452A7E) 25%, #612ECC 100%)"
            color={"white"}
            onClick={downloadPDF}
            disabled={tableData?.length === 0}
          >
            Download Report
          </Button>
          <Button
            size="sm"
            leftIcon={<MdRefresh />}
            bg="linear-gradient(90deg, var(--clinlog-purple, #452A7E) 25%, #612ECC 100%)"
            color={"white"}
            disabled={tableData?.length === 0}
            onClick={() => {
              setReportType("");
              setGlobalFilter([]);
              setSelectedColumns([{ group: "", fields: [], isChosen: false }]);

              setSelectedRows([{ group: "", fields: [], isChosen: false }]);
            }}
          >
            Reset
          </Button>
        </Flex>
        {tableData?.length > 0 && (
          <Text mb="2" fontSize={"14px"} fontWeight={"600"}>
            Total:
            {tableData?.[tableData?.length - 1]?.totalCount
              ? tableData?.[tableData?.length - 1]?.totalCount
              : filteredData?.length}
          </Text>
        )}
        {tableData?.length > 0 && (
          <TableContainer
            ref={tableRef}
            // border="1px solid"
            // borderRadius="6px"
            // h="100%"
            // w="auto"
            // overflowX={"scroll"}
            mx="4"
          >
            <Table variant="unstyled" borderLeft={"1px solid"}>
              <Thead>
                <Tr>
                  {selectedColumns?.map((col) =>
                    col.fields.map((field) => {
                      if (
                        field === "totalCases" ||
                        field === "implantCategory" ||
                        field === "toothValue" ||
                        reportType?.includes("complicationsReport") ||
                        reportType?.includes("inflammationVs") ||
                        reportType?.includes("recessionVs") ||
                        reportType?.includes("midShaftDehiscenceVs") ||
                        reportType?.includes("suppurationVs") ||
                        reportType?.includes("sinusitisAtFollowUp")
                      ) {
                        return (
                          <Th
                            key={field + "h1"}
                            colSpan={
                              field === "toothValue"
                                ? toothValueBygroup.length + 2
                                : field === "implantCategory"
                                  ? 5
                                  : reportType === "immediacy" ||
                                      reportType === "timeToImmediateFinalTeeth"
                                    ? 2
                                    : reportType?.includes(
                                          "complicationsReport",
                                        )
                                      ? 10
                                      : 3
                            }
                            textAlign={"center"}
                            bgColor={"#452A7E"}
                            border="1px solid black"
                            color={"white"}
                          >
                            <Flex align={"center"} gap="2" justify={"center"}>
                              <Text fontSize={"18px"}>
                                {" "}
                                {reportOptions?.find(
                                  (o) => o.value === reportType,
                                )?.name || "Total Cases"}
                              </Text>
                              ({" "}
                              <Text fontSize={"15px"}>
                                Total Cases: {filteredData?.length}
                              </Text>
                              {![
                                "immediacy",
                                "timeToImmediateFinalTeeth",
                              ].includes(reportType) && (
                                <Text fontSize={"15px"}>
                                  & Total Sites:{" "}
                                  {reportType === "numberOfImplantsAll" ||
                                  reportType === "numberOfImplantsZygoma" ||
                                  reportType === "numberOfImplantsRegular"
                                    ? // ? tableData?.reduce((acc, curr) => {
                                      //     return (
                                      //       acc +
                                      //       curr.count *
                                      //         Number(
                                      //           curr?.rowValue === "Not Recorded"
                                      //             ? 0
                                      //             : curr.columnValue || 1,
                                      //         )
                                      //     );
                                      //   }, 0)
                                      filteredData
                                        ?.map(
                                          (record) =>
                                            record.attachedDentalCharts?.[0]
                                              ?.proposedTreatmentToothMatrix,
                                        )
                                        ?.flat()
                                        .filter(
                                          (site) =>
                                            site?.treatmentItemNumber === "688",
                                        ).length
                                    : tableData?.[tableData?.length - 1]
                                          ?.totalCount
                                      ? tableData?.[tableData?.length - 1]
                                          ?.totalCount
                                      : filteredData?.length}
                                </Text>
                              )}
                              )
                            </Flex>
                          </Th>
                        );
                      }

                      return (
                        <Th
                          key={field + "h1"}
                          bgColor={"#452A7E"}
                          border="1px solid black"
                          colSpan={
                            field === "toothValue"
                              ? toothValueBygroup.length + 2
                              : field === "recordTreatmentSurgeons"
                                ? recordTreatmentSurgeonOptions.length + 2
                                : field === "implantLine"
                                  ? implantLineOptions.length + 2
                                  : [
                                        "totalImplants",
                                        "regularImplants",
                                        "zygomaImplants",
                                      ].includes(field)
                                    ? [
                                        ...new Set(
                                          tableData
                                            ?.filter(
                                              (data) =>
                                                data.columnHeader === field,
                                            )
                                            .map((data) => data.columnValue),
                                        ),
                                      ]?.length + 2
                                    : clinlogFilterColumns
                                        ?.find((column) => column.key === field)
                                        ?.options?.map((val) => {
                                          return {
                                            name: val.name,
                                            value: val.value,
                                            isReport: val?.isReport || false,
                                          };
                                        })
                                        ?.filter((op) => op?.isReport)?.length +
                                      2
                          }
                          textAlign={"center"}
                          color={"white"}
                          fontSize={"18px"}
                        >
                          <Flex align={"center"} gap="2" justify={"center"}>
                            {/* {
                              clinlogFilterColumns.find(
                                (column) => column.key === field,
                              )?.label
                            }{" "} */}
                            <Text fontSize={"18px"}>
                              {" "}
                              {reportOptions?.find(
                                (o) => o.value === reportType,
                              )?.name || "Total Cases"}
                            </Text>
                            ({" "}
                            <Text fontSize={"15px"}>
                              Total Cases: {filteredData?.length}
                            </Text>
                            )
                          </Flex>
                        </Th>
                      );
                    }),
                  )}

                  {/* <Th
                    position="sticky"
                    top={0}
                    left={0}
                    zIndex={3}
                    bgColor={"#452A7E"}
                  ></Th> */}
                </Tr>

                <Tr bg="white">
                  <Th
                    // position="sticky"
                    // left={0}
                    // top={0}
                    // zIndex={2}
                    borderRight={"1px Solid"}
                    bg="white"
                  ></Th>
                  {selectedColumns?.map((col) =>
                    col?.fields?.map((field) => {
                      const column = clinlogFilterColumns.find(
                        (column) => column.key === field,
                      );

                      const colOptions =
                        field === "recordTreatmentSurgeons"
                          ? recordTreatmentSurgeonOptions
                          : field === "implantLine"
                            ? implantLineOptions
                            : field === "toothValue"
                              ? toothValueBygroup
                              : column?.type === "number"
                                ? [
                                    ...new Set(
                                      tableData
                                        ?.filter(
                                          (data) => data.columnHeader === field,
                                        )
                                        .map((data) => data.columnValue),
                                    ),
                                  ]?.sort((a, b) => {
                                    if (
                                      typeof a === "number" &&
                                      typeof b === "number"
                                    ) {
                                      return a - b;
                                    }
                                    return a
                                      .toString()
                                      .localeCompare(b.toString());
                                  })
                                : column?.options
                                    ?.map((val) => {
                                      return {
                                        name: val.name,
                                        value: val.value,
                                        isReport: val?.isReport || false,
                                      };
                                    })
                                    ?.filter((opt) => opt?.isReport) || [];
                      if (field === "totalCases") {
                        return (
                          <Td
                            key={field + "totalCases"}
                            borderRight={"1px Solid"}
                            textAlign={"center"}
                          >
                            Cases
                          </Td>
                        );
                      } else if (field === "implantCategory") {
                        return (
                          <>
                            <Td
                              key={"regularImplants_count"}
                              borderRight={"1px Solid"}
                              textAlign={"center"}
                            >
                              Regular Implants
                            </Td>
                            <Td
                              key={"zygomaImplants_count"}
                              borderRight={"1px Solid"}
                              textAlign={"center"}
                            >
                              Zygoma Implants
                            </Td>
                            <Td
                              key={"otherImplants_count"}
                              borderRight={"1px Solid"}
                              textAlign={"center"}
                            >
                              Implant Type (Not Recorded)
                            </Td>
                          </>
                        );
                      }

                      return colOptions?.map((option) => (
                        <Td
                          key={option?.value || option}
                          borderRight={"1px Solid"}
                          textAlign={"center"}
                        >
                          <Text fontWeight={"500"}>
                            {option?.name || option || "None"}
                          </Text>
                        </Td>
                      ));
                    }),
                  )}
                  <Td
                    textAlign={"center"}
                    fontWeight={600}
                    borderRight={"1px solid"}
                    display={
                      reportType === "immediacy" ||
                      reportType === "timeToImmediateFinalTeeth"
                        ? "none"
                        : "table-cell"
                    }
                  >
                    {selectedRows
                      ?.map((row) => row?.fields)
                      ?.flat()
                      ?.some((r) =>
                        [
                          "regularImplants",
                          "zygomaImplants",
                          "totalImplants",
                        ]?.includes(r),
                      )
                      ? "Sites"
                      : "Total"}
                  </Td>
                  <Td width={"10%"} border="0px" bg="white"></Td>
                </Tr>
              </Thead>
              <Tbody>
                {selectedRows
                  ?.map((group) => group.fields)
                  ?.flat()
                  ?.map((row, index) => {
                    const rowData = tableData?.filter(
                      (data) => data.rowHeader === row,
                    );

                    const rowField = clinlogFilterColumns.find(
                      (column) => column.key === row,
                    );
                    const rowOptions =
                      row === "recordTreatmentSurgeons"
                        ? recordTreatmentSurgeonOptions
                        : row === "toothValue"
                          ? toothValueBygroup
                          : row === "implantLine"
                            ? implantLineOptions
                            : rowField?.type === "number"
                              ? [
                                  ...new Set(
                                    tableData
                                      ?.filter((data) => data.rowHeader === row)
                                      .map((data) => data.rowValue),
                                  ),
                                ]?.sort((a, b) => {
                                  if (
                                    typeof a === "number" &&
                                    typeof b === "number"
                                  ) {
                                    return a - b;
                                  }
                                  return a
                                    .toString()
                                    .localeCompare(b.toString());
                                })
                              : rowField?.options;
                    return (
                      <React.Fragment key={row + index}>
                        {index === 0 && (
                          <Tr key={row + index + "sample"} bgColor="#E2EFFC">
                            <Td
                              // position="sticky"
                              // left={0}
                              // top={0}
                              // zIndex={2}
                              bg="#E2EFFC"
                              borderRight={"1px Solid"}
                              borderBottom={"1px solid"}
                              fontWeight={600}
                            >
                              {"Sample Size"}
                              {" ("}
                              {
                                reportOptions?.find(
                                  (o) => o.value === reportType,
                                )?.type
                              }
                              {") "}
                            </Td>
                            {selectedColumns
                              ?.filter((col) => col.fields.length > 0)
                              ?.map((col) => {
                                return col.fields.map((field) => {
                                  const colGroup = clinlogFilterColumns.find(
                                    (column) => column.key === field,
                                  );
                                  if (field === "totalCases") {
                                    const sampleSize = tableData?.find(
                                      (data) => {
                                        return data.columnHeader === field;
                                      },
                                    )?.colSampleSize;
                                    return (
                                      <Td
                                        key={`totalCases sample size`}
                                        borderRight={"1px solid"}
                                        borderBottom={"1px solid"}
                                        textAlign={"center"}
                                        fontWeight={600}
                                      >
                                        {sampleSize ? sampleSize : 0}{" "}
                                      </Td>
                                    );
                                  } else if (field === "implantCategory") {
                                    const regularImplantsSample =
                                      tableData?.find(
                                        (data) =>
                                          data.columnValue ===
                                          "Regular Implant",
                                      );
                                    const regularPercentage =
                                      regularImplantsSample
                                        ? (
                                            (regularImplantsSample.colSampleSize /
                                              regularImplantsSample.totalCount) *
                                            100
                                          ).toFixed(2) + "%"
                                        : "0%";
                                    const zygomaImplantsSampleSize =
                                      tableData?.find(
                                        (data) =>
                                          data.columnValue ===
                                          "Zygomatic Implant",
                                      );
                                    const zygomaPercentage =
                                      zygomaImplantsSampleSize
                                        ? (
                                            (zygomaImplantsSampleSize.colSampleSize /
                                              zygomaImplantsSampleSize.totalCount) *
                                            100
                                          ).toFixed(2) + "%"
                                        : "0%";
                                    const otherImplantsSampleSize =
                                      tableData?.find(
                                        (data) =>
                                          data.columnValue === "Not Recorded",
                                      );
                                    const otherImplantsPercentage =
                                      otherImplantsSampleSize
                                        ? (
                                            (otherImplantsSampleSize.colSampleSize /
                                              otherImplantsSampleSize.totalCount) *
                                            100
                                          ).toFixed(2) + "%"
                                        : "0%";

                                    return (
                                      <>
                                        <Td
                                          key={`regularImplants sample size`}
                                          borderRight={"1px solid"}
                                          borderBottom={"1px solid"}
                                          textAlign={"center"}
                                          fontWeight={600}
                                        >
                                          {regularImplantsSample
                                            ? regularImplantsSample?.colSampleSize
                                            : 0}
                                          {" ("} {regularPercentage} {")"}
                                        </Td>
                                        <Td
                                          key={`zygomaImplants sample size`}
                                          borderRight={"1px solid"}
                                          borderBottom={"1px solid"}
                                          textAlign={"center"}
                                          fontWeight={600}
                                        >
                                          {zygomaImplantsSampleSize
                                            ? zygomaImplantsSampleSize?.colSampleSize
                                            : 0}
                                          {" ("} {zygomaPercentage} {")"}
                                        </Td>
                                        <Td
                                          key={`otherImplants sample size`}
                                          borderRight={"1px solid"}
                                          borderBottom={"1px solid"}
                                          textAlign={"center"}
                                          fontWeight={600}
                                        >
                                          {otherImplantsSampleSize
                                            ? otherImplantsSampleSize?.colSampleSize
                                            : 0}
                                          {" ("} {otherImplantsPercentage} {")"}
                                        </Td>
                                      </>
                                    );
                                  }
                                  const options =
                                    field === "recordTreatmentSurgeons"
                                      ? recordTreatmentSurgeonOptions
                                      : field === "implantLine"
                                        ? implantLineOptions
                                        : field === "toothValue"
                                          ? toothValueBygroup
                                          : colGroup?.type === "number"
                                            ? [
                                                ...new Set(
                                                  tableData
                                                    ?.filter(
                                                      (data) =>
                                                        data.columnHeader ===
                                                        field,
                                                    )
                                                    .map(
                                                      (data) =>
                                                        data.columnValue,
                                                    ),
                                                ),
                                              ]?.sort((a, b) => {
                                                if (
                                                  typeof a === "number" &&
                                                  typeof b === "number"
                                                ) {
                                                  return a - b;
                                                }
                                                return a
                                                  .toString()
                                                  .localeCompare(b.toString());
                                              })
                                            : clinlogFilterColumns
                                                .find(
                                                  (column) =>
                                                    column.key === field,
                                                )
                                                ?.options?.map((val) => {
                                                  return {
                                                    name: val.name,
                                                    value: val.value,
                                                    isReport:
                                                      val?.isReport || false,
                                                  };
                                                })
                                                ?.filter(
                                                  (opt) => opt?.isReport,
                                                ) || [];
                                  return options?.map((option, i) => {
                                    const rowSample = rowData?.find((data) => {
                                      return (
                                        data.columnHeader === field &&
                                        data.columnValue ===
                                          (option?.name || option) &&
                                        data.rowHeader === row
                                      );
                                    });

                                    const sampleSize = rowSample?.colSampleSize;
                                    return (
                                      <Td
                                        key={`${
                                          option?.value || option
                                        } ${i} sample`}
                                        borderRight={"1px solid"}
                                        borderBottom={"1px solid"}
                                        textAlign={"center"}
                                        fontWeight={600}
                                      >
                                        {sampleSize ? sampleSize : 0}{" "}
                                      </Td>
                                    );
                                  });
                                });
                              })}
                            <Td
                              textAlign={"center"}
                              fontWeight={600}
                              borderRight={"1px solid"}
                              borderBottom={"1px solid"}
                              borderColor={"black"}
                              display={
                                reportType === "immediacy" ||
                                reportType === "timeToImmediateFinalTeeth"
                                  ? "none"
                                  : "table-cell"
                              }
                            >
                              {selectedColumns
                                ?.map((col) => col.fields)
                                .flat()
                                ?.includes("totalCases") &&
                              [
                                "regularImplants",
                                "zygomaImplants",
                                "totalImplants",
                              ].includes(row)
                                ? filteredData
                                    ?.map(
                                      (record) =>
                                        record.attachedDentalCharts?.[0]
                                          ?.proposedTreatmentToothMatrix,
                                    )
                                    ?.flat()
                                    .filter(
                                      (site) =>
                                        site?.treatmentItemNumber === "688",
                                    ).length || 0
                                : tableData?.[tableData?.length - 1]
                                    ?.totalCount || 0}{" "}
                            </Td>
                            <Td border="0px" bg="white"></Td>
                          </Tr>
                        )}
                        {/* tableData?.reduce((acc, curr) => {
                                    return (
                                      acc +
                                      curr.count * Number(curr.columnValue || 1)
                                    );
                                  }, 0) */}
                        <Tr
                          key={row + index + "_val"}
                          bgColor="#9981ca"
                          color={"white"}
                          borderColor={"black"}
                        >
                          <Td
                            // position="sticky"
                            // left={0}
                            // top={0}
                            // zIndex={2}
                            bg="#9981ca"
                            fontWeight={600}
                            borderRight={"1px solid"}
                            borderBottom={"1px solid"}
                            borderColor={"black"}
                          >
                            {rowField?.label}
                          </Td>
                          {selectedColumns
                            ?.filter((col) => col.fields.length > 0)
                            ?.map((col, i) => {
                              return col?.fields?.map((field, j) => {
                                if (field === "totalCases") {
                                  const totalCases = rowData?.reduce(
                                    (acc, curr) => {
                                      return acc + curr.count;
                                    },
                                    0,
                                  );
                                  const percentage =
                                    (totalCases /
                                      tableData?.[tableData?.length - 1]
                                        ?.totalCount) *
                                    100;
                                  const percentageText = percentage
                                    ? percentage.toFixed(2) + "%"
                                    : "0%";
                                  return (
                                    <Td
                                      key={`totalCases col ${row}`}
                                      borderRight="1px solid"
                                      borderBottom={"1px solid"}
                                      textAlign={"center"}
                                      borderColor={"black"}
                                    >
                                      {totalCases} ({percentageText}){" "}
                                    </Td>
                                  );
                                } else if (field === "implantCategory") {
                                  const regularImplantsData = rowData?.filter(
                                    (data) =>
                                      data.columnValue === "Regular Implant",
                                  );

                                  const regularImplantsCount =
                                    regularImplantsData?.reduce(
                                      (acc, curr) => acc + curr.count,
                                      0,
                                    );

                                  const regularPercentage =
                                    (regularImplantsCount /
                                      rowData?.[0]?.colSampleSize) *
                                      100 || 0;
                                  const zygomaImplantsData = rowData?.filter(
                                    (data) =>
                                      data.columnValue === "Zygomatic Implant",
                                  );
                                  const zygomaImplantsCount =
                                    zygomaImplantsData?.reduce(
                                      (acc, curr) => acc + curr.count,
                                      0,
                                    );
                                  const zygomaPercentage =
                                    (zygomaImplantsCount /
                                      zygomaImplantsData?.[0]?.colSampleSize) *
                                      100 || 0;
                                  const otherImplantsData = rowData?.filter(
                                    (data) =>
                                      data.columnValue === "Not Recorded",
                                  );
                                  const otherImplantsCount =
                                    otherImplantsData?.reduce(
                                      (acc, curr) => acc + curr.count,
                                      0,
                                    );
                                  const otherImplantsPercentage =
                                    (otherImplantsCount /
                                      otherImplantsData?.[0]?.colSampleSize) *
                                      100 || 0;

                                  return (
                                    <>
                                      <Td
                                        key={`regularImplants col ri`}
                                        borderRight="1px solid"
                                        borderBottom={"1px solid"}
                                        textAlign={"center"}
                                        borderColor={"black"}
                                      >
                                        {regularImplantsCount || 0}{" "}
                                        {/* {` (${regularPercentage.toFixed(2)}%)`} */}
                                      </Td>
                                      <Td
                                        key={`zygomaImplants col zi`}
                                        borderRight="1px solid"
                                        borderBottom={"1px solid"}
                                        textAlign={"center"}
                                        borderColor={"black"}
                                      >
                                        {zygomaImplantsCount || 0}{" "}
                                        {/* {` (${zygomaPercentage.toFixed(2)}%)`} */}
                                      </Td>
                                      <Td
                                        key={`otherImplants col oi`}
                                        borderRight="1px solid"
                                        borderBottom={"1px solid"}
                                        textAlign={"center"}
                                        borderColor={"black"}
                                      >
                                        {otherImplantsCount || 0}{" "}
                                        {/* {` (${otherImplantsPercentage.toFixed(2)}%)`} */}
                                      </Td>
                                    </>
                                  );
                                }

                                const colGroup = clinlogFilterColumns.find(
                                  (column) => column.key === field,
                                );

                                const options =
                                  field === "recordTreatmentSurgeons"
                                    ? recordTreatmentSurgeonOptions
                                    : field === "implantLine"
                                      ? implantLineOptions
                                      : field === "toothValue"
                                        ? toothValueBygroup
                                        : colGroup?.type === "number"
                                          ? [
                                              ...new Set(
                                                tableData
                                                  ?.filter(
                                                    (data) =>
                                                      data.columnHeader ===
                                                      field,
                                                  )
                                                  .map(
                                                    (data) => data.columnValue,
                                                  ),
                                              ),
                                            ]?.sort((a, b) => {
                                              if (
                                                typeof a === "number" &&
                                                typeof b === "number"
                                              ) {
                                                return a - b;
                                              }
                                              return a
                                                .toString()
                                                .localeCompare(b.toString());
                                            })
                                          : clinlogFilterColumns
                                              .find(
                                                (column) =>
                                                  column?.key === field,
                                              )
                                              ?.options?.map((val) => {
                                                return {
                                                  name: val.name,
                                                  value: val.value,
                                                  isReport:
                                                    val?.isReport || false,
                                                };
                                              })
                                              ?.filter(
                                                (opt) => opt?.isReport,
                                              ) || [];

                                return options?.map((option, k) => {
                                  const data = rowData?.filter((data) => {
                                    return (
                                      data.columnHeader === field &&
                                      data.columnValue ===
                                        (option?.name || option)
                                    );
                                  });
                                  const sampleSize = data?.reduce(
                                    (acc, curr) => {
                                      return acc + curr.count;
                                    },
                                    0,
                                  );

                                  return (
                                    <Td
                                      key={`${option?.value || option} ${
                                        row + k
                                      } _val`}
                                      borderRight={"1px solid"}
                                      borderBottom={"1px solid"}
                                      textAlign={"center"}
                                      borderColor={"black"}
                                    >
                                      {sampleSize ? sampleSize : 0}
                                    </Td>
                                  );
                                });
                              });
                            })}
                          <Td
                            textAlign={"center"}
                            borderRight={"1px solid"}
                            borderBottom={"1px solid"}
                            borderColor={"black"}
                            display={
                              reportType === "immediacy" ||
                              reportType === "timeToImmediateFinalTeeth"
                                ? "none"
                                : "table-cell"
                            }
                          >
                            {selectedColumns
                              ?.filter((col) => col.fields.length > 0)
                              ?.map((col, i) => {
                                return col?.fields?.map((field, j) => {
                                  const colGroup = clinlogFilterColumns.find(
                                    (column) => column.key === field,
                                  );
                                  if (field === "totalCases") {
                                    if (
                                      row === "totalImplants" ||
                                      row === "zygomaImplants" ||
                                      row === "regularImplants"
                                    ) {
                                      const totalCases = rowData?.reduce(
                                        (acc, curr) => {
                                          return (
                                            acc +
                                            curr.count *
                                              Number(
                                                curr?.rowValue ===
                                                  "Not Recorded"
                                                  ? 0
                                                  : curr.columnValue || 1,
                                              )
                                          );
                                        },
                                        0,
                                      );
                                      const allSites =
                                        filteredData
                                          ?.map(
                                            (record) =>
                                              record.attachedDentalCharts?.[0]
                                                ?.proposedTreatmentToothMatrix,
                                          )
                                          .flat()
                                          .filter(
                                            (site) =>
                                              site?.treatmentItemNumber ===
                                              "688",
                                          ) || [];
                                      const zygomaSites =
                                        allSites?.filter(
                                          (site) =>
                                            site?.treatmentItemNumber ===
                                              "688" &&
                                            site.attachedSiteSpecificRecords?.[0]?.itemSpecificationMatrix?.[0].implantCategoryLabel?.includes(
                                              "Zygomatic Implant",
                                            ),
                                        ) || [];
                                      const regularSites =
                                        allSites?.filter(
                                          (site) =>
                                            site?.treatmentItemNumber ===
                                              "688" &&
                                            site.attachedSiteSpecificRecords?.[0]?.itemSpecificationMatrix?.[0].implantCategoryLabel?.includes(
                                              "Regular Implant",
                                            ),
                                        ) || [];
                                      const otherSites =
                                        allSites?.filter(
                                          (site) =>
                                            site?.treatmentItemNumber ===
                                              "688" &&
                                            !site.attachedSiteSpecificRecords?.[0]?.itemSpecificationMatrix?.[0].implantCategoryLabel?.includes(
                                              "Zygomatic Implant",
                                            ) &&
                                            !site.attachedSiteSpecificRecords?.[0]?.itemSpecificationMatrix?.[0].implantCategoryLabel?.includes(
                                              "Regular Implant",
                                            ),
                                        ) || [];

                                      const count = allSites?.length;

                                      const percentage = count
                                        ? ((totalCases / count) * 100).toFixed(
                                            2,
                                          ) + "%"
                                        : "0%";
                                      return totalCases + ` (${percentage})`;
                                    } else if (
                                      row === "immediateAesthetics" ||
                                      row === "immediateFunctionSpeech"
                                    ) {
                                      const totalCases = rowData?.reduce(
                                        (acc, curr) => {
                                          return acc + curr.count;
                                        },
                                        0,
                                      );
                                      return totalCases + ` (100.00%)`;
                                    }
                                  } else if (field === "implantCategory") {
                                    const count = tableData?.reduce(
                                      (acc, curr) => {
                                        return acc + curr.count;
                                      },
                                      0,
                                    );
                                    const percentage = count
                                      ? (
                                          (count /
                                            tableData?.[tableData?.length - 1]
                                              ?.totalCount) *
                                          100
                                        ).toFixed(2) + "%"
                                      : "0%";
                                    return `${count} (${percentage})`;
                                  }
                                  const options =
                                    field === "recordTreatmentSurgeons"
                                      ? recordTreatmentSurgeonOptions
                                      : field === "implantLine"
                                        ? implantLineOptions
                                        : field === "toothValue"
                                          ? toothValueBygroup
                                          : colGroup?.type === "number"
                                            ? [
                                                ...new Set(
                                                  tableData
                                                    ?.filter(
                                                      (data) =>
                                                        data.columnHeader ===
                                                        field,
                                                    )
                                                    .map(
                                                      (data) =>
                                                        data.columnValue,
                                                    ),
                                                ),
                                              ]?.sort((a, b) => {
                                                if (
                                                  typeof a === "number" &&
                                                  typeof b === "number"
                                                ) {
                                                  return a - b;
                                                }
                                                return a
                                                  .toString()
                                                  .localeCompare(b.toString());
                                              })
                                            : clinlogFilterColumns
                                                .find(
                                                  (column) =>
                                                    column?.key === field,
                                                )
                                                ?.options?.map((val) => {
                                                  return {
                                                    name: val.name,
                                                    value: val.value,
                                                    isReport:
                                                      val?.isReport || false,
                                                  };
                                                })
                                                ?.filter(
                                                  (opt) => opt?.isReport,
                                                ) || [];
                                  const value = options
                                    ?.map((option, k) => {
                                      const data = rowData?.filter((data) => {
                                        return (
                                          data.columnHeader === field &&
                                          data.columnValue ===
                                            (option?.name || option)
                                        );
                                      });

                                      const sampleSize = data?.reduce(
                                        (acc, curr) => {
                                          return acc + curr.count;
                                        },
                                        0,
                                      );
                                      return sampleSize;
                                    })
                                    ?.reduce((acc, curr) => acc + curr, 0);

                                  const percentage =
                                    (value /
                                      tableData?.[tableData?.length - 1]
                                        ?.totalCount) *
                                    100;
                                  const percentageText = percentage
                                    ? percentage.toFixed(2) + "%"
                                    : "0%";
                                  return `${value} (${percentageText})`;
                                });
                              })}
                          </Td>
                          <Td border="0px" bg="white"></Td>
                        </Tr>
                        {rowOptions
                          ?.filter(
                            (op) =>
                              op?.isReport ||
                              rowField?.type === "number" ||
                              typeof op === "string",
                          )
                          ?.map((rowOpt) => {
                            return (
                              <>
                                <Tr
                                  key={`${rowOpt?.value || rowOpt} _row`}
                                  bg="white"
                                >
                                  <Td
                                    // position="sticky"
                                    // bg="white"
                                    // left={0}
                                    // top={0}
                                    // zIndex={2}
                                    borderRight={"1px Solid"}
                                    borderBottom={"1px solid"}
                                  >
                                    {rowOpt?.name || rowOpt || "None"}
                                  </Td>
                                  {selectedColumns
                                    .filter((col) => col.fields.length > 0)
                                    .map((col, index) => {
                                      return col.fields.map((field, j) => {
                                        const colGroup =
                                          clinlogFilterColumns.find(
                                            (column) => column.key === field,
                                          );

                                        if (field === "totalCases") {
                                          const caseCount =
                                            tableData?.find((data) => {
                                              return (
                                                data.columnHeader === field &&
                                                data.rowHeader === row &&
                                                data.rowValue ===
                                                  (rowOpt?.name || rowOpt)
                                              );
                                            })?.count || 0;

                                          const percentage =
                                            (caseCount /
                                              tableData?.[0]?.totalCount) *
                                            100;
                                          const percentageText = percentage
                                            ? percentage.toFixed(2) + "%"
                                            : "0%";
                                          return (
                                            <Td
                                              key={`totalCases col ${row} ${
                                                rowOpt?.name || rowOpt
                                              }`}
                                              borderRight="1px solid"
                                              borderBottom={"1px solid"}
                                              textAlign={"center"}
                                            >
                                              {caseCount} ({percentageText}
                                              ){" "}
                                            </Td>
                                          );
                                        } else if (
                                          field === "implantCategory"
                                        ) {
                                          const regularcount =
                                            tableData?.find(
                                              (data) =>
                                                data.columnHeader === field &&
                                                data.columnValue ===
                                                  "Regular Implant" &&
                                                data.rowHeader === row &&
                                                data.rowValue ===
                                                  (rowOpt?.name || rowOpt),
                                            ) || {};
                                          const regularPercentage =
                                            regularcount?.count > 0
                                              ? (regularcount?.count /
                                                  regularcount?.colSampleSize) *
                                                100
                                              : 0;
                                          const zygomacount =
                                            tableData?.find(
                                              (data) =>
                                                data.columnHeader === field &&
                                                data.columnValue ===
                                                  "Zygomatic Implant" &&
                                                data.rowHeader === row &&
                                                data.rowValue ===
                                                  (rowOpt?.name || rowOpt),
                                            ) || {};

                                          const zygomaPercentage =
                                            zygomacount?.count > 0
                                              ? (zygomacount?.count /
                                                  zygomacount?.colSampleSize) *
                                                100
                                              : 0;
                                          const otherImplantsCount =
                                            tableData?.find(
                                              (data) =>
                                                data.columnHeader === field &&
                                                data.columnValue ===
                                                  "Not Recorded" &&
                                                data.rowHeader === row &&
                                                data.rowValue ===
                                                  (rowOpt?.name || rowOpt),
                                            )?.count || 0;
                                          const otherImplantsPercentage =
                                            otherImplantsCount > 0
                                              ? (otherImplantsCount /
                                                  tableData?.find(
                                                    (data) =>
                                                      data.columnHeader ===
                                                        field &&
                                                      data.columnValue ===
                                                        "Not Recorded" &&
                                                      data.rowHeader === row &&
                                                      data.rowValue ===
                                                        (rowOpt?.name ||
                                                          rowOpt),
                                                  )?.colSampleSize) *
                                                100
                                              : 0;
                                          return (
                                            <>
                                              <Td
                                                key={`regularImplants col ${row} ${rowOpt?.name || rowOpt}`}
                                                borderRight="1px solid"
                                                borderBottom={"1px solid"}
                                                textAlign={"center"}
                                              >
                                                {regularcount?.count || 0}{" "}
                                                {` (${regularPercentage.toFixed(2)}%)`}
                                              </Td>
                                              <Td
                                                key={`zygomaImplants col ${row} ${rowOpt?.name || rowOpt}`}
                                                borderRight="1px solid"
                                                borderBottom={"1px solid"}
                                                textAlign={"center"}
                                              >
                                                {zygomacount?.count || 0}{" "}
                                                {` (${zygomaPercentage.toFixed(2)}%)`}
                                              </Td>
                                              <Td
                                                key={`otherImplants col ${row} ${rowOpt?.name || rowOpt}`}
                                                borderRight="1px solid"
                                                borderBottom={"1px solid"}
                                                textAlign={"center"}
                                              >
                                                {otherImplantsCount || 0}{" "}
                                                {` (${otherImplantsPercentage.toFixed(2)}%)`}
                                              </Td>
                                            </>
                                          );
                                        }
                                        const options =
                                          field === "recordTreatmentSurgeons"
                                            ? recordTreatmentSurgeonOptions
                                            : field === "implantLine"
                                              ? implantLineOptions
                                              : field === "toothValue"
                                                ? toothValueBygroup
                                                : colGroup?.type === "number"
                                                  ? [
                                                      ...new Set(
                                                        tableData
                                                          ?.filter(
                                                            (data) =>
                                                              data.columnHeader ===
                                                              field,
                                                          )
                                                          .map(
                                                            (data) =>
                                                              data.columnValue,
                                                          ),
                                                      ),
                                                    ]?.sort((a, b) => {
                                                      if (
                                                        typeof a === "number" &&
                                                        typeof b === "number"
                                                      ) {
                                                        return a - b;
                                                      }
                                                      return a
                                                        .toString()
                                                        .localeCompare(
                                                          b.toString(),
                                                        );
                                                    })
                                                  : clinlogFilterColumns
                                                      .find(
                                                        (column) =>
                                                          column.key === field,
                                                      )
                                                      ?.options?.map((val) => {
                                                        return {
                                                          name: val.name,
                                                          value: val.value,
                                                          isReport:
                                                            val?.isReport ||
                                                            false,
                                                        };
                                                      })
                                                      ?.filter(
                                                        (opt) => opt?.isReport,
                                                      ) || [];
                                        return options?.map((option, i) => {
                                          const cellValue = rowData?.find(
                                            (data) => {
                                              return (
                                                data.columnHeader === field &&
                                                data.columnValue ===
                                                  (option?.name || option) &&
                                                data.rowValue ===
                                                  (rowOpt?.name || rowOpt)
                                              );
                                            },
                                          );
                                          const data = rowData?.filter(
                                            (data) => {
                                              return (
                                                data.columnHeader === field &&
                                                data.columnValue ===
                                                  (option?.name || option)
                                              );
                                            },
                                          );
                                          const sampleSize = data?.reduce(
                                            (acc, curr) => {
                                              return acc + curr.count;
                                            },
                                            0,
                                          );
                                          const count = cellValue?.count || 0;
                                          const percentage =
                                            (cellValue?.count / sampleSize) *
                                            100;
                                          const percentageText = percentage
                                            ? percentage.toFixed(2) + "2%"
                                            : "0%";

                                          return (
                                            <Td
                                              key={`${
                                                option?.value || option
                                              } ${row} ${
                                                rowOpt?.name || rowOpt
                                              } col`}
                                              borderRight="1px solid"
                                              borderBottom={"1px solid"}
                                              textAlign={"center"}
                                            >
                                              {count} ({percentageText}){" "}
                                            </Td>
                                          );
                                        });
                                      });
                                    })}
                                  <Td
                                    textAlign={"center"}
                                    borderRight={"1px solid"}
                                    borderBottom={"1px solid"}
                                    display={
                                      reportType === "immediacy" ||
                                      reportType === "timeToImmediateFinalTeeth"
                                        ? "none"
                                        : "table-cell"
                                    }
                                  >
                                    {selectedColumns
                                      .filter((col) => col.fields.length > 0)
                                      .map((col, index) => {
                                        const subTotal = col.fields.map(
                                          (field, j) => {
                                            if (field === "totalCases") {
                                              const rowVal = tableData?.find(
                                                (data) => {
                                                  return (
                                                    data.columnHeader ===
                                                      field &&
                                                    data.rowValue ===
                                                      (rowOpt?.name ||
                                                        rowOpt) &&
                                                    data.rowHeader === row
                                                  );
                                                },
                                              );
                                              if (
                                                rowVal?.rowHeader ===
                                                  "immediateAesthetics" ||
                                                rowVal?.rowHeader ===
                                                  "immediateFunctionSpeech"
                                              ) {
                                                return {
                                                  totalCount:
                                                    rowVal?.count || 0,
                                                  totalPercentage:
                                                    (rowVal?.count /
                                                      rowVal?.totalCount) *
                                                    100,
                                                };
                                              }
                                              const caseCount =
                                                rowVal?.count *
                                                  Number(
                                                    rowVal?.rowValue ===
                                                      "Not Recorded"
                                                      ? "0"
                                                      : rowVal?.columnValue ||
                                                          1,
                                                  ) || 0;
                                              // const totalCount =
                                              //   tableData?.reduce(
                                              //     (acc, curr) => {
                                              //       return (
                                              //         acc +
                                              //         curr.count *
                                              //           Number(
                                              //             curr.columnValue || 1,
                                              //           )
                                              //       );
                                              //     },
                                              //     0,
                                              //   );
                                              const totalCount =
                                                filteredData
                                                  ?.map(
                                                    (record) =>
                                                      record
                                                        .attachedDentalCharts?.[0]
                                                        ?.proposedTreatmentToothMatrix,
                                                  )
                                                  .flat()
                                                  .filter(
                                                    (site) =>
                                                      site?.treatmentItemNumber ===
                                                      "688",
                                                  )?.length || 0;
                                              return {
                                                totalCount: caseCount,
                                                totalPercentage:
                                                  (caseCount / totalCount) *
                                                  100,
                                              };
                                            } else if (
                                              field === "implantCategory"
                                            ) {
                                              const count =
                                                tableData
                                                  ?.filter((data) => {
                                                    return (
                                                      data.rowHeader === row &&
                                                      data.rowValue ===
                                                        (rowOpt?.name || rowOpt)
                                                    );
                                                  })
                                                  .reduce((acc, curr) => {
                                                    return acc + curr.count;
                                                  }, 0) || 0;
                                              const totalCount =
                                                tableData?.[0]?.totalCount || 0;

                                              return {
                                                totalCount: count,
                                                totalPercentage:
                                                  (count / totalCount) * 100,
                                              };
                                            }

                                            const options =
                                              field ===
                                              "recordTreatmentSurgeons"
                                                ? recordTreatmentSurgeonOptions
                                                : field === "implantLine"
                                                  ? implantLineOptions
                                                  : field === "toothValue"
                                                    ? toothValueBygroup
                                                    : field ===
                                                          "totalImplants" ||
                                                        field ===
                                                          "regularImplants" ||
                                                        field ===
                                                          "zygomaImplants"
                                                      ? [
                                                          ...new Set(
                                                            tableData
                                                              ?.filter(
                                                                (data) =>
                                                                  data.columnHeader ===
                                                                  field,
                                                              )
                                                              .map(
                                                                (data) =>
                                                                  data.columnValue,
                                                              ),
                                                          ),
                                                        ]
                                                      : clinlogFilterColumns
                                                          .find(
                                                            (column) =>
                                                              column.key ===
                                                              field,
                                                          )
                                                          ?.options?.map(
                                                            (val) => {
                                                              return {
                                                                name: val.name,
                                                                value:
                                                                  val.value,
                                                                isReport:
                                                                  val?.isReport ||
                                                                  false,
                                                              };
                                                            },
                                                          )
                                                          ?.filter(
                                                            (opt) =>
                                                              opt?.isReport,
                                                          ) || [];

                                            const obj = options?.map(
                                              (option, i) => {
                                                const cellValue = rowData?.find(
                                                  (data) => {
                                                    return (
                                                      data.columnHeader ===
                                                        field &&
                                                      data.columnValue ===
                                                        (option?.name ||
                                                          option) &&
                                                      data.rowValue ===
                                                        (rowOpt?.name || rowOpt)
                                                    );
                                                  },
                                                );
                                                const data = rowData?.filter(
                                                  (data) => {
                                                    return (
                                                      data.columnHeader ===
                                                        field &&
                                                      data.columnValue ===
                                                        (option?.name || option)
                                                    );
                                                  },
                                                );

                                                const sampleSize = data?.reduce(
                                                  (acc, curr) => {
                                                    return acc + curr.count;
                                                  },
                                                  0,
                                                );

                                                const count =
                                                  cellValue?.count || 0;
                                                const percentage =
                                                  (cellValue?.count /
                                                    sampleSize) *
                                                  100;

                                                return {
                                                  count,
                                                  // percentage: percentage / 4,
                                                };
                                              },
                                            );

                                            const totalCount = obj?.reduce(
                                              (acc, curr) => acc + curr.count,
                                              0,
                                            );
                                            const totalPercentage =
                                              (totalCount /
                                                (tableData?.[0]?.totalCount ||
                                                  1)) *
                                              100;
                                            // const totalPercentage = obj?.reduce(
                                            //   (acc, curr) =>
                                            //     acc + curr.percentage,
                                            //   0,
                                            // );
                                            return {
                                              totalCount,
                                              totalPercentage,
                                            };
                                          },
                                        );
                                        const grandTotalCount =
                                          subTotal?.reduce(
                                            (acc, curr) =>
                                              acc + curr.totalCount,
                                            0,
                                          );

                                        const grandTotalPercentage =
                                          (grandTotalCount /
                                            tableData?.[tableData?.length - 1]
                                              ?.totalCount) *
                                          100;
                                        return `${grandTotalCount} (${
                                          grandTotalPercentage
                                            ? grandTotalPercentage.toFixed(2)
                                            : "0.00"
                                        }%)`;
                                      })}
                                  </Td>
                                  <Td border="0px" bg="white"></Td>
                                </Tr>
                              </>
                            );
                          })}
                      </React.Fragment>
                    );
                  })}
              </Tbody>
            </Table>
          </TableContainer>
        )}
        {/* </Card> */}
      </Flex>
    </Flex>
  );
}
