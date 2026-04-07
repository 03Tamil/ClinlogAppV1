import {
  Button,
  Checkbox,
  filter,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Select,
  SimpleGrid,
  Spacer,
  Tab,
  Table,
  TableContainer,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import { de, fi } from "date-fns/locale";
import { Card, CardHeader, CardTitle } from "src/uicomponents/ui/card";
import React, { use, useEffect, useMemo, useState } from "react";
import { MdAdd, MdDelete, MdRefresh, MdSearch } from "react-icons/md";
import { TbFilterMinus } from "react-icons/tb";
import ReactSelect, { StylesConfig } from "react-select";
import dynamic from "next/dynamic";
import { Check } from "lucide-react";
import { differenceInDays, format, set } from "date-fns";
import ClinlogDemoGraphics from "./ClinlogDemoGraphics";
import AgeGroupDistribution from "./AgeGroupDistribution";
import FollowUpDistribution from "./FollowUpDistribution";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import FilterComponent from "./FilterComponent";
import FluidTable from "./FluidTable";
import RestrictedValuesTable from "./RestrictedValuesTable";
import { ApexOptions } from "apexcharts";
import {
  clinlogFilterColumns,
  filterReportOptions,
  reportOptions,
} from "helpersv2/utils";
import { DownloadIcon } from "@chakra-ui/icons";
import StandardReports from "./StandardReports";
import { report } from "process";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});
export type dataToolProps = {
  filterColumns: any[];
  clinlogRecordDetails: any[];
  allCasesData: any[];
  columnData: any[];
  selectCustomStyle: StylesConfig;
  globalFilterFunction: (row: any, columnId: string, value: any[]) => boolean;
  locationOptions?: any[];
  clinlogNotes?: any[];
  implantLineOptions?: any[];
  surgeonOptions?: any[];
};
export default function ClinlogDataTool({
  filterColumns,
  clinlogRecordDetails,
  allCasesData,
  columnData,
  selectCustomStyle,
  globalFilterFunction,
  locationOptions = [],
  clinlogNotes = [],
  implantLineOptions = [],
  surgeonOptions = [],
}: dataToolProps) {
  const [columnFilters, setColumnFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    if (globalFilter.length > 0) {
      const data = allCasesData?.filter((record) => {
        const row = {
          original: record,
        };
        return globalFilterFunction(row, "", globalFilter);
      });
      setFilteredData(data);
    } else {
      setFilteredData(allCasesData);
    }
  }, [globalFilter, allCasesData]);

  const groupOptions = [
    { value: "generalDetails", label: "General Details" },
    { value: "patientCharacteristics", label: "Patient Characteristics" },
    { value: "treatmentCharacteristics", label: "Treatment Characteristics" },
    { value: "followUp", label: "Follow Up" },
    { value: "patientSurvey", label: "Patient Survey" },
    {
      value: "siteSpecificCharacteristics",
      label: "Site Specific Characteristics",
    },
  ];
  const [filterArray, setFilterArray] = React.useState({
    group: "",
    key: "",
    value: [],
    condition: "",
  });
  const [selectedRows, setSelectedRows] = React.useState([
    { group: "", fields: [], isChosen: false },
  ]);
  const [selectedColumns, setSelectedColumns] = React.useState([
    { group: "", fields: [] },
  ]);
  const [selectedGroup, setSelectedGroup] = React.useState("");
  const [selectedField, setSelectedField] = React.useState("");
  const [selectedValue, setSelectedValue] = React.useState("");
  const [compareParams, setCompareParams] = React.useState({
    group1: "",
    field1: "",
    value1: "",
    group2: "",
    field2: "",
    value2: "",
  });
  const implantsData = useMemo(() => {
    const result = [];
    const regularImplants = filteredData?.reduce((acc, record) => {
      const count = acc + Number(record?.regularImplants || 0);
      return count;
    }, 0);
    const zygomaImplants = filteredData?.reduce((acc, record) => {
      const count = acc + Number(record?.zygomaImplants || 0);
      return count;
    }, 0);

    result.push({
      x: "Regular Implants",
      y: regularImplants,
    });
    result.push({
      x: "Zygoma Implants",
      y: zygomaImplants,
    });
    return result;
  }, [filteredData]);
  const implantsData_state: {
    options: ApexOptions;
    series: any[];
  } = useMemo(() => {
    return {
      series: implantsData?.map((item) => item.y),
      options: {
        chart: {
          //width: 380,
          type: "pie",
        },
        title: {
          text: `ANALYSIS BASED ON IMPLANTS`,
          align: "center",
          style: {
            fontSize: "11px",
            fontWeight: "600",
          },
        },
        subtitle: {
          text: `Standard Implants VS Zygoma Implants`,
          align: "center",
          offsetY: 20,
          style: {
            fontSize: "11px",
            fontWeight: "500",
          },
        },
        dataLabels: {
          enabled: false,
        },
        labels: [
          ...implantsData?.map((item) => item?.x + " (" + item.y + ")"),
          "TOTAL - " + implantsData?.reduce((acc, item) => acc + item.y, 0),
        ],
        legend: {
          show: true, // Show the legend
          onItemClick: {
            toggleDataSeries: false,
          },
          position: "bottom",
          //offsetY: 100,
          //offsetX: 0,
          floating: false,
          markers: {
            width: 14,
            height: 14,
            shape: "square",
            radius: 0,
            offsetX: -2,
            offsetY: 0,
          },
        },
      },
    };
  }, [implantsData]);

  const recordTreatmentSurgeonOptions = useMemo(
    () => [
      ...new Set(
        filteredData
          ?.map((record) =>
            record["recordTreatmentSurgeons"]?.map(
              (surgeon) => surgeon.fullName,
            ),
          )
          .flat(),
      ),
    ],
    [filteredData],
  );

  const reactApexChart_data = useMemo(() => {
    if (selectedField === "") return [];
    const column = filterColumns.find((column) => column.key === selectedField);
    const options = column?.options;

    //if (!options) return [];
    const result = [];
    if (selectedField === "ageAtTimeOfSurgery") {
      const ageGroups = ["<40", "40-50", "50-60", "60-70", ">70", "Unknown"];
      ageGroups.forEach((ageGroup) => {
        const value = filteredData?.filter((record) => {
          if (ageGroup === "<40") return Number(record[selectedField]) < 40;
          if (ageGroup === "40-50")
            return (
              Number(record[selectedField]) >= 40 &&
              Number(record[selectedField]) <= 50
            );
          if (ageGroup === "50-60")
            return (
              Number(record[selectedField]) >= 50 &&
              Number(record[selectedField]) <= 60
            );
          if (ageGroup === "60-70")
            return (
              Number(record[selectedField]) >= 60 &&
              Number(record[selectedField]) <= 70
            );
          if (ageGroup === ">70") return Number(record[selectedField]) > 70;
        }).length;
        result.push({
          x: ageGroup,
          y: value,
        });
      });
    } else if (selectedField === "recordTreatmentSurgeons") {
      const surgeonOptions = [
        ...new Set(
          filteredData
            ?.map((record) =>
              record[selectedField]?.map((surgeon) => surgeon.fullName),
            )
            .flat(),
        ),
      ];
      surgeonOptions?.forEach((key) => {
        const value = filteredData?.filter((record) => {
          return record[selectedField]
            ?.map((surgeon) => surgeon.fullName)
            .includes(key);
        }).length;
        result.push({
          x: key ? key : "Unknown",
          y: value,
        });
      });
    } else {
      if (filteredData?.some((record) => selectedField in record)) {
        options?.forEach((key) => {
          const value = filteredData?.filter((record) => {
            return record[selectedField] === key?.value;
          }).length;
          result.push({
            x: key?.value,
            y: value,
          });
        });
      } else if (column?.group === "followUp") {
        const followUpData = filteredData?.map((record) => {
          return record.recordFollowUpMatrix?.[0];
        });
        options?.forEach((key) => {
          const value = followUpData?.filter((record) => {
            // if (key.value === "N/A") return record?.[selectedField] === null;
            return record?.[selectedField] === key?.value;
          }).length;
          result.push({
            x: key?.value,
            y: value,
          });
        });
      } else if (column?.group === "patientSurvey") {
        const surveyDataArr = filteredData?.map((record) => {
          const patientSurveyData = clinlogNotes?.find((note) => {
            return (
              note?.recordNoteRecord?.[0]?.id === record?.id &&
              note?.attachedSurveyForm?.length > 0
            );
          })?.attachedSurveyForm?.[0]?.patientSurveyMatrix?.[0];
          return patientSurveyData || null;
        });
        options?.forEach((key) => {
          const value = surveyDataArr?.filter((survey) => {
            if (!survey) return false;
            return (
              survey?.[selectedField?.split("_")?.[0]] ===
              key?.value?.split("_")?.[0]
            );
          }).length;
          result.push({
            x: key?.value,
            y: value,
          });
        });
      } else if (column?.group === "siteSpecificCharacteristics") {
        const siteDetails = filteredData
          ?.map((record) => {
            const chartData = record?.attachedDentalCharts?.[0];

            if (!chartData) return [];
            return (
              chartData?.proposedTreatmentToothMatrix?.filter(
                (site) =>
                  site.treatmentItemNumber === "688" &&
                  site?.attachedSiteSpecificRecords?.length > 0,
              ) || []
            );
          })
          ?.flat();

        options?.forEach((key) => {
          const value = siteDetails?.filter((record) => {
            // if (key.value === "N/A") return record?.[selectedField] === null;
            if (selectedField === "toothValue") {
              return record?.toothValue === key?.value;
            } else if (
              record?.attachedSiteSpecificRecords?.[0]
                ?.attachedSiteSpecificFollowUp?.length > 0 &&
              clinlogFilterColumns?.find((col) => col.key === selectedField)
                ?.subGroup === "ssFollowUp"
            ) {
              return (
                record?.attachedSiteSpecificRecords?.[0]
                  ?.attachedSiteSpecificFollowUp?.[0]?.[selectedField] ===
                key?.value
              );
            }

            return (
              record?.attachedSiteSpecificRecords?.[0]
                ?.itemSpecificationMatrix?.[0]?.[selectedField] === key?.value
            );
          }).length;
          result.push({
            x: key?.name,
            y: value,
          });
        });
      }
    }
    return result;
  }, [selectedField, filteredData]);

  const reactApexChart_state: {
    options: ApexOptions;
    series: any[];
  } = useMemo(() => {
    return {
      series: reactApexChart_data?.map((item) => item.y),
      options: {
        chart: {
          width: 380,

          type: "pie",
        },
        title: {
          text: `ANALYSIS BASED ON FIELD - ${filterColumns
            .find((column) => column.key === selectedField)
            ?.label?.toUpperCase()}`,
          //align: "center",
          style: {
            fontSize: "12px",
            fontWeight: "600",
            color: "#007AFF",
            fontFamily: "monospace",
          },
        },
        labels: [
          ...reactApexChart_data?.map((item) => item?.x + " (" + item.y + ")"),
          "TOTAL - " +
            reactApexChart_data?.reduce((acc, item) => acc + item.y, 0),
        ],
        legend: {
          show: true,
          onItemClick: {
            toggleDataSeries: false,
          },

          markers: {
            width: 14,
            height: 14,
            shape: "square",
            radius: 0,
            offsetX: -2,
            offsetY: 2,
          },

          floating: false,
          fontSize: "14px",
          fontWeight: 600,
          fontFamily: "Inter, sans-serif",
          labels: {
            colors: "#071B89",
          },
        },
      },
    };
  }, [reactApexChart_data]);
  const compareParams_data = useMemo(() => {
    if (compareParams.value1 === "" || compareParams.value2 === "") return [];
    const group1 = compareParams.group1;
    const field1Obj = filterColumns.find(
      (col) => col.key === compareParams.field1,
    );
    const field1 = field1Obj?.label;
    const value1 = compareParams.value1;
    const value1Label =
      field1Obj?.options?.find((option) => option.value === value1)?.name || "";

    const group2 = compareParams.group2;
    const field2Obj = filterColumns.find(
      (col) => col.key === compareParams.field2,
    );
    const field2 = field2Obj?.label;
    const value2 = compareParams.value2;
    const value2Label =
      field2Obj?.options?.find((option) => option.value === value2)?.name || "";
    const result = [];
    if (value1 !== "" && value2 !== "") {
      let group1Data = 0;
      if (group1 === "siteSpecificCharacteristics") {
        const siteDetails = filteredData
          ?.map((record) => {
            const chartData = record?.attachedDentalCharts?.[0];

            if (!chartData) return [];
            return (
              chartData?.proposedTreatmentToothMatrix?.filter(
                (site) =>
                  site.treatmentItemNumber === "688" &&
                  site?.attachedSiteSpecificRecords?.length > 0,
              ) || []
            );
          })
          ?.flat();
        group1Data = siteDetails?.filter((record) => {
          if (compareParams.field1 === "toothValue") {
            return record.toothValue === compareParams.value1;
          } else if (
            clinlogFilterColumns?.find(
              (col) => col.key === compareParams.field1,
            )?.subGroup === "ssFollowUp"
          ) {
            return (
              record?.attachedSiteSpecificRecords?.[0]
                ?.attachedSiteSpecificFollowUp?.[0]?.[compareParams.field1] ===
              compareParams.value1
            );
          }
          return (
            record.attachedSiteSpecificRecords?.[0]
              ?.itemSpecificationMatrix?.[0]?.[compareParams.field1] ===
            compareParams.value1
          );
        }).length;
      } else {
        group1Data = filteredData?.filter((record) => {
          if (group1 === "followUp") {
            const followUpData = record.recordFollowUpMatrix?.[0];
            return followUpData?.[compareParams.field1] === value1;
          } else if (group1 === "patientSurvey") {
            const surveyData = clinlogNotes?.find((note) => {
              return (
                note?.recordNoteRecord?.[0]?.id === record?.id &&
                note?.attachedSurveyForm?.length > 0
              );
            })?.attachedSurveyForm?.[0]?.patientSurveyMatrix?.[0];
            return (
              surveyData?.[compareParams.field1?.split("_")?.[0]] ===
              value1?.split("_")?.[0]
            );
          }
          //  else if (group1 === "siteSpecificCharacteristics") {
          //   const siteDetails =
          //     record?.attachedDentalCharts?.[0]?.proposedTreatmentToothMatrix?.filter(
          //       (site) =>
          //         site.treatmentItemNumber === "688" &&
          //         site?.attachedSiteSpecificRecords?.length > 0
          //     );

          //   const siteSpecificData = siteDetails?.map((site) => {
          //     if (compareParams.field1 === "toothValue") {
          //       return site.toothValue;
          //     }
          //     return site.attachedSiteSpecificRecords?.[0]
          //       ?.itemSpecificationMatrix?.[0]?.[compareParams.field1];
          //   });
          //   return siteSpecificData?.includes(value1);
          // }
          return record[compareParams.field1] === value1;
        }).length;
      }

      result.push({
        x: field1 + " - " + value1Label,
        y: group1Data,
      });
      // Group 2
      let group2Data = 0;
      if (group2 === "siteSpecificCharacteristics") {
        const siteDetails = filteredData
          ?.map((record) => {
            const chartData = record?.attachedDentalCharts?.[0];

            if (!chartData) return [];
            return (
              chartData?.proposedTreatmentToothMatrix?.filter(
                (site) =>
                  site.treatmentItemNumber === "688" &&
                  site?.attachedSiteSpecificRecords?.length > 0,
              ) || []
            );
          })
          ?.flat();
        group2Data = siteDetails?.filter((record) => {
          if (compareParams.field2 === "toothValue") {
            return record.toothValue === compareParams.value2;
          } else if (
            clinlogFilterColumns?.find(
              (col) => col.key === compareParams.field2,
            )?.subGroup === "ssFollowUp"
          ) {
            return (
              record?.attachedSiteSpecificRecords?.[0]
                ?.attachedSiteSpecificFollowUp?.[0]?.[compareParams.field2] ===
              compareParams.value2
            );
          }
          return (
            record.attachedSiteSpecificRecords?.[0]
              ?.itemSpecificationMatrix?.[0]?.[compareParams.field2] ===
            compareParams.value2
          );
        }).length;
      } else {
        group2Data = filteredData?.filter((record) => {
          if (group2 === "followUp") {
            const followUpData = record.recordFollowUpMatrix?.[0];
            return followUpData?.[compareParams.field2] === value2;
          } else if (group2 === "patientSurvey") {
            const surveyData = clinlogNotes?.find((note) => {
              return (
                note?.recordNoteRecord?.[0]?.id === record?.id &&
                note?.attachedSurveyForm?.length > 0
              );
            })?.attachedSurveyForm?.[0]?.patientSurveyMatrix?.[0];
            return (
              surveyData?.[compareParams.field2?.split("_")?.[0]] ===
              value2?.split("_")?.[0]
            );
          }
          // else if (group2 === "siteSpecificCharacteristics") {
          //   const siteDetails =
          //     record.attachedDentalCharts?.[0]?.proposedTreatmentToothMatrix?.filter(
          //       (site) => site.treatmentItemNumber === "688"
          //     );
          //   const siteSpecificData = siteDetails?.map((site) => {
          //     if (compareParams.field2 === "toothValue") {
          //       return site.toothValue;
          //     }
          //     return site.attachedSiteSpecificRecords?.[0]
          //       ?.itemSpecificationMatrix?.[0]?.[compareParams.field2];
          //   });
          //   return siteSpecificData?.includes(value2);
          // }
          return record[compareParams.field2] === value2;
        }).length;
      }
      result.push({
        x: field2 + " - " + value2Label,
        y: group2Data,
      });
    }
    return result;
  }, [compareParams, filteredData]);

  const compareParams_state: {
    options: ApexOptions;
    series: any[];
  } = useMemo(() => {
    return {
      series: [
        {
          name: "Count",
          data: [
            ...compareParams_data?.map((item) => item.y),
            compareParams?.group1 === "siteSpecificCharacteristics" &&
            compareParams?.group2 === "siteSpecificCharacteristics"
              ? filteredData
                  ?.map((record) =>
                    record?.attachedDentalCharts?.[0]?.proposedTreatmentToothMatrix?.filter(
                      (site) => site?.treatmentItemNumber === "688",
                    ),
                  )
                  ?.flat()?.length
              : filteredData?.length,
          ],
        },
      ],
      options: {
        chart: {
          type: "bar",
        },
        plotOptions: {
          bar: {
            distributed: true, // This enables different colors per bar
          },
        },
        // labels: [
        //   ...compareParams_data?.map(
        //     (item) => item?.x?.toUpperCase()
        //   ),
        //   "TOTAL",
        // ],
        xaxis: {
          categories: [...compareParams_data?.map((item) => item?.x), "TOTAL"],
          labels: {
            style: {
              fontSize: "10px",
              fontWeight: "600",
            },
          },
        },
        legend: {
          show: true,
          position: "bottom",
          horizontalAlign: "center",
          formatter: function (val) {
            const total =
              compareParams?.group1 === "siteSpecificCharacteristics" &&
              compareParams?.group2 === "siteSpecificCharacteristics"
                ? filteredData
                    ?.map((record) =>
                      record?.attachedDentalCharts?.[0]?.proposedTreatmentToothMatrix?.filter(
                        (site) => site?.treatmentItemNumber === "688",
                      ),
                    )
                    ?.flat()?.length
                : filteredData?.length;
            if (val === "TOTAL") {
              return val + " - <b>" + total + " (100%)</b>";
            } else {
              const count = compareParams_data?.find(
                (item) => item.x === val,
              )?.y;
              const percentage = (count / total) * 100;
              return (
                val + " - <b>" + count + " (" + percentage.toFixed(2) + "%)</b>"
              );
            }
          },

          markers: {
            width: 14,
            height: 14,
            shape: "square",
            radius: 0,
            offsetX: -1,
            offsetY: 0,
          },
          offsetY: 5,

          floating: false,
          fontSize: "12px",
          fontWeight: 500,
          fontFamily: "Inter, sans-serif",
        },
      },
    };
  }, [compareParams_data]);
  const tableData = useMemo(() => {
    const result = [];
    if (selectedRows.length > 0 && selectedColumns.length > 0) {
      const fields = [
        ...selectedRows.map((row) => row.fields).flat(),
        ...selectedColumns.map((col) => col.fields).flat(),
      ];
      if (fields.length > 0) {
        const patientData = filteredData?.map((record) => {
          const data = { id: record.id };
          fields.forEach((field) => {
            if (field === "recordTreatmentDate") {
              data[field] = record[field]
                ? format(new Date(record[field]), "dd MMM yyyy")
                : "";
            } else if (field === "recordTreatmentSurgeons") {
              data[field] =
                record[field].map((surgeon) => surgeon.fullName).flat() || [];
            } else {
              data[field] = record[field];
            }
          });
          return data;
        });

        const columnFields = selectedColumns.map((col) => col.fields).flat();
        const rowFields = selectedRows.map((row) => row.fields).flat();

        columnFields.forEach((col) => {
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
          } else {
            colOptions = filterColumns.find(
              (column) => column.key === col,
            )?.options;
          }

          rowFields.forEach((row) => {
            let rowOptions = [];
            if (row === "ageAtTimeOfSurgery") {
              rowOptions = [
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
            } else {
              rowOptions = filterColumns.find(
                (column) => column.key === row,
              )?.options;
            }
            colOptions?.forEach((option) => {
              rowOptions?.forEach((rowOpt) => {
                const columnFilteredData = patientData?.filter((record) => {
                  if (col === "ageAtTimeOfSurgery") {
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
                  }
                  if (col === "recordTreatmentSurgeons") {
                    return record[col]?.includes(option);
                  }
                  if (col === "recordTreatmentDate") {
                    return record[col] === option;
                  }
                  return record[col] === option.value;
                });
                const data = columnFilteredData?.filter((record) => {
                  if (row === "ageAtTimeOfSurgery") {
                    if (rowOpt.value === "<40") return Number(record[row]) < 40;
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
                    if (rowOpt.value === ">70") return Number(record[row]) > 70;
                  }
                  if (row === "recordTreatmentSurgeons") {
                    return record[row].includes(rowOpt);
                  }
                  if (row === "recordTreatmentDate") {
                    return record[row] === rowOpt;
                  }
                  return record[row] === rowOpt.value;
                }).length;

                result.push({
                  columnHeader: col,
                  columnValue: option?.name ? option.name : option,
                  colSampleSize: columnFilteredData.length,
                  rowHeader: row,
                  rowValue: rowOpt?.name ? rowOpt.name : rowOpt,
                  count: data,
                });
              });
            });
          });
        });
      }
    }
    return result;
  }, [selectedRows, selectedColumns, filteredData]);
  const [columnVisibility, setColumnVisibility] = useState({
    caseNumber: true,
    patientName: false,
    fullName: false,
    status: false,
    images: false,
    recordTreatmentDate: false,
    tools: false,
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
    numberOfReviews: false,
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
    recordTreatmentSurgeons: false,
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
  const [reportType, setReportType] = useState("");
  const reportColumns = {
    surveyVsArchCondition: [
      "patientSatisfactionAesthetic",
      "patientSatisfactionFunction",
      "patientSatisfactionMaintenance",
      "patientSatisfactionTreatment",
      "postOpPain",
      "upperArchCondition",
      "ageAtTimeOfSurgery",
      "timeFromSurgery_ps",
      "lowerArchCondition",
      "totalImplants",
      "zygomaImplants",
    ],
    surveyVsOpposingArch: [
      "patientSatisfactionAesthetic",
      "patientSatisfactionFunction",
      "patientSatisfactionMaintenance",
      "patientSatisfactionTreatment",
      "postOpPain",
      "lowerArchCondition",
      "ageAtTimeOfSurgery",
      "timeFromSurgery_ps",
      "upperArchCondition",
      "totalImplants",
      "zygomaImplants",
      "implantCategory",
      "implantLine",
    ],
    surveyVsTotalImplants: [
      "zygomaImplants",

      "totalImplants",
      "implantCategory",
      "implantLine",
      "patientSatisfactionAesthetic",
      "patientSatisfactionFunction",
      "patientSatisfactionMaintenance",
      "patientSatisfactionTreatment",
      "postOpPain",
      "ageAtTimeOfSurgery",
      "timeFromSurgery_ps",
      "upperArchCondition",
      "lowerArchCondition",
    ],
    surveyVsZygomaImplants: [
      "zygomaImplants",
      "patientSatisfactionAesthetic",
      "patientSatisfactionFunction",
      "patientSatisfactionMaintenance",
      "patientSatisfactionTreatment",
      "postOpPain",
      "ageAtTimeOfSurgery",
      "timeFromSurgery_ps",
      "upperArchCondition",
      "lowerArchCondition",

      "totalImplants",
      "implantCategory",
      "implantLine",
    ],
    numberOfImplantsAll: [
      "zygomaImplants",
      "regularImplants",
      "totalImplants",
      "upperArchCondition",
      "diagnosisOrAetiology",
      "bruxism",
      "lowerArchCondition",
      "ageAtTimeOfSurgery",
      "timeFromSurgery_fs",
      "implantCategory",
      "implantLine",
    ],
    placementDistribution: [
      "toothValue",
      "placement",
      "implantType",
      "implantLength",
      "trabecularBoneDensity",
      "boneVascularity",
      "insertionTorque",
      "graftingApplied",
      "graftMaterial",
      "crestalRest",
      "conformanceWithTreatmentPlan",
      "upperArchCondition",
      "ageAtTimeOfSurgery",
      "timeFromSurgery_fs",
      "implantCategory",
      "implantLine",
    ],
    immediacy: [
      "immediateRestoration",
      "timeFromSurgery",
      "immediateFunctionSpeech",
      "immediateAesthetics",
    ],
    caseSuccessRate: [
      "performanceOverFollowUpPeriod",
      "timeFromSurgery_fs",
      "numberOfReviews",
      "numberOfRestorativeBreakages",
      "zirconiaUpgrade",
      "smokingAtFollowUp",
      "hygieneAtFollowUp",
      "site",
      "implantType",
      "implantCategory",
      "implantLine",
      "placement",
      "trabecularBoneDensity",
      "insertionTorque",
      "conformanceWithTreatmentPlan",
      "implantFunctionAtFollowUp",
      "performanceOverFollowUpPeriod",
      "sinusitis",
      "facialSwelling",
      "inflammation",
      "pain",
      "suppuration",
      "recession",
      "midShaftSoftTissueDehiscence",
      "totalNumberOfAbutmentLevelComplications",
      "boneLoss",
      "postOperativeSinusDisease",
    ],
  };
  const table = useReactTable({
    data: filteredData,
    columns: columnData,
    state: {
      columnFilters,
      columnVisibility,
    },

    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
  });

  const exportToCSV = () => {
    // const headers = table
    //   .getAllLeafColumns()
    //   .filter(
    //     col =>
    //       !col.id.includes('recordTreatmentStatus') &&
    //       !col.id.includes('recordConsultationStatus')
    //   )
    //   .map(col => col.columnDef.header);
    const siteSpecificColumns = clinlogFilterColumns
      .filter(
        (col) => col.group === "siteSpecificCharacteristics" && !col?.subGroup,
      )
      ?.map((col) => col.key);
    const ssFollowUpColumns = clinlogFilterColumns
      .filter(
        (col) =>
          col.group === "siteSpecificCharacteristics" &&
          col?.subGroup === "ssFollowUp",
      )
      ?.map((col) => col.key);
    const followUpColumns = clinlogFilterColumns
      .filter((col) => col.group === "followUp")
      ?.map((col) => col.key);
    const patientSurveyColumns = clinlogFilterColumns
      .filter((col) => col.group === "patientSurvey")
      ?.map((col) => col.key);
    const headers = table
      .getHeaderGroups()
      .map((headerGroup) =>
        headerGroup.headers.map((header) => header.column.columnDef.header),
      )
      .flat();
    const columnsData = table
      ?.getAllLeafColumns()
      ?.filter((col) => col.getIsVisible());
    const rows = table?.getRowModel()?.rows.map((row, i) => {
      let rowsData = [];
      let sitesRowsData = [];
      const rowFormatted = row?.getVisibleCells()?.map((cell) => {
        if (cell.column.id === "recordTreatmentDate") {
          const chartData = row.original?.attachedDentalCharts?.[0];

          const surgeryDate = chartData?.recordTreatmentDate;
          const dateValue = surgeryDate
            ? surgeryDate
            : cell.getValue()?.toString();
          if (dateValue) {
            const formattedDate = format(new Date(dateValue), "dd-MM-yyyy");
            return formattedDate;
          } else {
            return "";
          }
        } else if (cell.column.id === "fullName") {
          return (
            cell.row.original.recordFirstName +
            " " +
            cell.row.original.recordLastName
          );
        } else if (cell.column.id === "totalImplants") {
          const regularImplants =
            Number(cell.row.original?.regularImplants) || 0;
          const zygomaImplants = Number(cell.row.original?.zygomaImplants) || 0;
          return regularImplants + zygomaImplants;
        } else if (cell.column.id === "recordTreatmentSurgeons") {
          const surgeons = cell.row.original?.recordTreatmentSurgeons || [];
          const surgeonNames = surgeons
            ?.map(
              (surgeon) =>
                `${surgeon.fullName?.split(" ")?.[0]?.slice(0, 2)} ${surgeon.fullName?.split(" ")?.[1]?.slice(0, 2)}`,
            )
            .join("\n");
          return `"${surgeonNames}"`;
        } else if (followUpColumns?.includes(cell.column.id)) {
          const followUpData = cell.row.original?.recordFollowUpMatrix?.[0];
          return (
            followUpData?.[cell.column.id?.split("_")?.[0]]?.toString() || ""
          );
        } else if (patientSurveyColumns?.includes(cell.column.id)) {
          const surveyData = clinlogNotes?.find((note) => {
            return (
              note?.recordNoteRecord?.[0]?.id === cell.row.original?.id &&
              note?.attachedSurveyForm?.length > 0
            );
          })?.attachedSurveyForm?.[0]?.patientSurveyMatrix?.[0];
          return (
            surveyData?.[cell.column.id?.split("_")?.[0]]?.replace(",", "") ||
            ""
          );
        } else if (
          siteSpecificColumns?.includes(cell.column.id) ||
          ssFollowUpColumns?.includes(cell.column.id)
        ) {
          const siteDetails =
            cell.row.original.attachedDentalCharts?.[0]?.proposedTreatmentToothMatrix?.filter(
              (site) => site.treatmentItemNumber === "688",
            );
          const siteSpecificData = siteDetails?.map((site) => {
            if (cell.column.id === "toothValue") {
              return site.toothValue;
            } else if (cell.column.id === "implantCategory") {
              return (
                site.attachedSiteSpecificRecords?.[0]
                  ?.itemSpecificationMatrix?.[0]?.implantCategoryLabel || ""
              );
            } else if (ssFollowUpColumns?.includes(cell.column.id)) {
              const siteFollowUpRecords =
                site?.attachedSiteSpecificRecords?.[0]
                  ?.attachedSiteSpecificFollowUp?.[0];

              return (
                siteFollowUpRecords?.[cell.column.id]?.replaceAll(",", "") || ""
              );
            }
            return (
              site.attachedSiteSpecificRecords?.[0]?.itemSpecificationMatrix?.[0]?.[
                cell.column.id
              ]?.replaceAll(",", "") || ""
            );
          });
          // const arrayToMultilineCell =
          //   siteSpecificData?.length > 0
          //     ? `"${siteSpecificData?.map((o) => `${o}`).join("\n")}"`
          //     : "";

          //   return arrayToMultilineCell;

          return siteSpecificData;
        } else if (cell.column.id === "timeFromSurgery") {
          const timeDiff =
            cell.row.original.dateOfInsertion &&
            cell.row.original.recordTreatmentDate
              ? differenceInDays(
                  new Date(
                    format(
                      new Date(cell.row.original.dateOfInsertion),
                      "yyyy-MM-dd",
                    ),
                  ),
                  new Date(
                    format(
                      new Date(cell.row.original.recordTreatmentDate),
                      "yyyy-MM-dd",
                    ),
                  ),
                )
              : null;
          return timeDiff > 0 ? timeDiff : "";
        }

        return cell.getValue()?.toString()?.replaceAll(",", "") || "";
      });

      //rowsData = rowFormatted;
      return rowFormatted;
    });
    const siteRows = rows
      ?.map((row) => {
        const siteCells = row?.filter((cell, index) => {
          return Array.isArray(cell) && cell?.length > 0;
        });

        const rowCount = siteCells?.[0]?.length || 1;
        const rowsValues = Array.from({ length: rowCount }, (_, i) =>
          siteCells.map((cell) =>
            cell instanceof Array ? cell[i] || "" : cell,
          ),
        );
        const otherCells = row?.filter((cell) => {
          return !Array.isArray(cell);
        });
        const combinedRows = rowsValues.map((siteRow) => [
          ...otherCells,
          ...siteRow,
        ]);
        return combinedRows;
      })
      ?.flat();

    const csvContent = [headers, ...siteRows]
      .map((row) => row.map(String).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download =
      reportType?.length > 0
        ? `${reportOptions?.find((o) => o.value === reportType)?.name?.replaceAll(" ", "_")}.csv`
        : "clinlog-data.csv";
    link.click();
  };
  const exportToCSV_case = () => {
    const siteSpecificColumns = clinlogFilterColumns
      .filter(
        (col) => col.group === "siteSpecificCharacteristics" && !col?.subGroup,
      )
      ?.map((col) => col.key);
    const ssFollowUpColumns = clinlogFilterColumns
      .filter(
        (col) =>
          col.group === "siteSpecificCharacteristics" &&
          col?.subGroup === "ssFollowUp",
      )
      ?.map((col) => col.key);
    const followUpColumns = clinlogFilterColumns
      .filter((col) => col.group === "followUp")
      ?.map((col) => col.key);
    const patientSurveyColumns = clinlogFilterColumns
      .filter((col) => col.group === "patientSurvey")
      ?.map((col) => col.key);
    const headers = table
      .getHeaderGroups()
      .map((headerGroup) =>
        headerGroup.headers.map((header) => header.column.columnDef.header),
      )
      .flat();
    const columnsData = table
      ?.getAllLeafColumns()
      ?.filter((col) => col.getIsVisible());
    const rows = table?.getRowModel()?.rows.map((row, i) => {
      let rowsData = [];
      let sitesRowsData = [];
      const rowFormatted = row?.getVisibleCells()?.map((cell) => {
        if (cell.column.id === "recordTreatmentDate") {
          const chartData = row.original?.attachedDentalCharts?.[0];

          const surgeryDate = chartData?.recordTreatmentDate;
          const dateValue = surgeryDate
            ? surgeryDate
            : cell.getValue()?.toString();
          if (dateValue) {
            const formattedDate = format(new Date(dateValue), "dd-MM-yyyy");
            return formattedDate;
          } else {
            return "";
          }
        } else if (cell.column.id === "fullName") {
          return (
            cell.row.original.recordFirstName +
            " " +
            cell.row.original.recordLastName
          );
        } else if (cell.column.id === "totalImplants") {
          const regularImplants =
            Number(cell.row.original?.regularImplants) || 0;
          const zygomaImplants = Number(cell.row.original?.zygomaImplants) || 0;
          return regularImplants + zygomaImplants;
        } else if (cell.column.id === "recordTreatmentSurgeons") {
          const surgeons = cell.row.original?.recordTreatmentSurgeons || [];
          const surgeonNames = surgeons
            ?.map(
              (surgeon) =>
                `${surgeon.fullName?.split(" ")?.[0]?.slice(0, 2)} ${surgeon.fullName?.split(" ")?.[1]?.slice(0, 2)}`,
            )
            .join("\n");
          return `"${surgeonNames}"`;
        } else if (followUpColumns?.includes(cell.column.id)) {
          const followUpData = cell.row.original?.recordFollowUpMatrix?.[0];
          return (
            followUpData?.[cell.column.id?.split("_")?.[0]]?.toString() || ""
          );
        } else if (patientSurveyColumns?.includes(cell.column.id)) {
          const surveyData = clinlogNotes?.find((note) => {
            return (
              note?.recordNoteRecord?.[0]?.id === cell.row.original?.id &&
              note?.attachedSurveyForm?.length > 0
            );
          })?.attachedSurveyForm?.[0]?.patientSurveyMatrix?.[0];
          return (
            surveyData?.[cell.column.id?.split("_")?.[0]]?.replace(",", "") ||
            ""
          );
        } else if (
          siteSpecificColumns?.includes(cell.column.id) ||
          ssFollowUpColumns?.includes(cell.column.id)
        ) {
          const siteDetails =
            cell.row.original.attachedDentalCharts?.[0]?.proposedTreatmentToothMatrix?.filter(
              (site) => site.treatmentItemNumber === "688",
            );
          const siteSpecificData = siteDetails?.map((site) => {
            if (cell.column.id === "toothValue") {
              return site.toothValue;
            } else if (cell.column.id === "implantCategory") {
              return (
                site.attachedSiteSpecificRecords?.[0]
                  ?.itemSpecificationMatrix?.[0]?.implantCategoryLabel || ""
              );
            } else if (ssFollowUpColumns?.includes(cell.column.id)) {
              const siteFollowUpRecords =
                site?.attachedSiteSpecificRecords?.[0]
                  ?.attachedSiteSpecificFollowUp?.[0];

              return (
                siteFollowUpRecords?.[cell.column.id]?.replaceAll(",", "") || ""
              );
            }
            return (
              site.attachedSiteSpecificRecords?.[0]?.itemSpecificationMatrix?.[0]?.[
                cell.column.id
              ]?.replaceAll(",", "") || ""
            );
          });
          const arrayToMultilineCell =
            siteSpecificData?.length > 0
              ? `"${siteSpecificData?.map((o) => `${o}`).join("\n")}"`
              : "";

          return arrayToMultilineCell;

          // return siteSpecificData;
        } else if (cell.column.id === "timeFromSurgery") {
          const timeDiff =
            cell.row.original.dateOfInsertion &&
            cell.row.original.recordTreatmentDate
              ? differenceInDays(
                  new Date(
                    format(
                      new Date(cell.row.original.dateOfInsertion),
                      "yyyy-MM-dd",
                    ),
                  ),
                  new Date(
                    format(
                      new Date(cell.row.original.recordTreatmentDate),
                      "yyyy-MM-dd",
                    ),
                  ),
                )
              : null;
          return timeDiff > 0 ? timeDiff : "";
        }

        return cell.getValue()?.toString()?.replaceAll(",", "") || "";
      });

      //rowsData = rowFormatted;
      return rowFormatted;
    });
    const siteRows = rows
      ?.map((row) => {
        const siteCells = row?.filter((cell, index) => {
          return Array.isArray(cell) && cell?.length > 0;
        });

        const rowCount = siteCells?.[0]?.length || 1;
        const rowsValues = Array.from({ length: rowCount }, (_, i) =>
          siteCells.map((cell) =>
            cell instanceof Array ? cell[i] || "" : cell,
          ),
        );
        const otherCells = row?.filter((cell) => {
          return !Array.isArray(cell);
        });
        const combinedRows = rowsValues.map((siteRow) => [
          ...otherCells,
          ...siteRow,
        ]);
        return combinedRows;
      })
      ?.flat();

    const csvContent = [headers, ...siteRows]
      .map((row) => row.map(String).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download =
      reportType?.length > 0
        ? `${reportOptions?.find((o) => o.value === reportType)?.name?.replaceAll(" ", "_")}.csv`
        : "clinlog-data-case.csv";
    link.click();
  };

  return (
    <Flex flexDirection="column" w="100%" h="100%" gap="1rem">
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
            DATA TOOL
          </Text>
          {/* <Text fontSize={"11px"} fontFamily={"inter"} color={"#351361"}>
            All information displayed within Clinlog is fully de-identified to
            protect patient privacy and meet clinical research standards.
          </Text> */}
        </Flex>
        <Spacer />
      </Flex>
      <Tabs colorScheme={"purple"}>
        <TabList>
          <Tab
            onClick={() => {
              setGlobalFilter([]);
              setReportType("");
            }}
            fontSize={{ base: "12px", md: "13px" }}
            textTransform={"uppercase"}
            fontWeight={"700"}
          >
            Reports
          </Tab>
          <Tab
            onClick={() => {
              setGlobalFilter([]);
              setReportType("");
            }}
            fontSize={{ base: "12px", md: "13px" }}
            textTransform={"uppercase"}
            fontWeight={"700"}
          >
            Data Tables
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel px="0">
            <Flex flexDirection={"column"} w="100%" gap="1rem">
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
                surgeonOptions={recordTreatmentSurgeonOptions}
                selectCustomStyle={selectCustomStyle}
                locationOptions={locationOptions}
              />
              <SimpleGrid
                columns={{ base: 1, md: 1, lg: 2, xl: 3 }}
                spacing="2"
                w="100%"
              >
                <AgeGroupDistribution
                  clinlogRecordDetails={filteredData}
                  fromReports={true}
                />

                <Card className="flex flex-col justify-center w-auto p-2">
                  <ReactApexChart
                    series={implantsData_state.series}
                    options={implantsData_state.options}
                    type="pie"
                    width="340"
                    height={390}
                  />
                </Card>
                <FollowUpDistribution
                  clinlogRecordDetails={filteredData}
                  fromReports={true}
                />
              </SimpleGrid>
              <Card className="mt-2 flex flex-col justify-center w-full p-4">
                <Text
                  fontSize="13px"
                  textTransform={"uppercase"}
                  fontWeight={"700"}
                  p="2"
                >
                  Compare Specific Parameters:
                </Text>
                <Flex gap="0.5rem" w="100%" mb="8">
                  <Select
                    w="35%"
                    fontSize={"13px"}
                    value={compareParams.group1}
                    onChange={(e) => {
                      const key = e.target.value;
                      setCompareParams((prev) => ({
                        ...prev,
                        group1: key,
                        field1: "",
                        value1: "",
                      }));
                    }}
                  >
                    <option value="">-- Select Group --</option>
                    <option value="generalDetails">General Details</option>
                    <option value="patientCharacteristics">
                      Patient Characteristics
                    </option>{" "}
                    <option value="treatmentCharacteristics">
                      Treatment Characteristics
                    </option>
                    <option value="followUp">Follow Up</option>
                    <option value="patientSurvey">Patient Survey</option>
                    <option value="siteSpecificCharacteristics">
                      Site Specific Characteristics
                    </option>
                  </Select>
                  {compareParams.group1 !== "" && (
                    <>
                      <Select
                        w="35%"
                        fontSize={"13px"}
                        onChange={(e) => {
                          const key = e.target.value;
                          setCompareParams((prev) => ({
                            ...prev,
                            field1: key,
                          }));
                        }}
                        value={compareParams.field1}
                      >
                        <option value="">-- Select Field --</option>
                        {filterColumns
                          .filter(
                            (column) =>
                              column.group === compareParams?.group1 &&
                              column.type !== "date" &&
                              column.type !== "number",
                          )
                          .map((column) => (
                            <option
                              key={column.key + "field1"}
                              value={column.key}
                            >
                              {column.label}
                            </option>
                          ))}
                      </Select>{" "}
                      {compareParams.field1 != "" && (
                        <Select
                          w="30%"
                          fontSize={"13px"}
                          onChange={(e) => {
                            const key = e.target.value;
                            setCompareParams((prev) => ({
                              ...prev,
                              value1: key,
                            }));
                          }}
                          value={compareParams.value1}
                        >
                          <option value="">-- Select Value --</option>
                          {filterColumns
                            .find(
                              (column) => column.key === compareParams.field1,
                            )
                            ?.options?.map((option) => (
                              <option
                                key={(option.value || option) + "value1"}
                                value={option.value || option}
                              >
                                {option.name || option}
                              </option>
                            ))}
                        </Select>
                      )}
                    </>
                  )}
                </Flex>
                <Flex gap="0.5rem" w="100%" mb="8">
                  <Select
                    w="35%"
                    fontSize={"13px"}
                    value={compareParams.group2}
                    onChange={(e) => {
                      const key = e.target.value;
                      setCompareParams((prev) => ({
                        ...prev,
                        group2: key,
                        field2: "",
                        value2: "",
                      }));
                    }}
                  >
                    <option value="">-- Select Group --</option>
                    <option value="generalDetails">General Details</option>
                    <option value="patientCharacteristics">
                      Patient Characteristics
                    </option>{" "}
                    <option value="treatmentCharacteristics">
                      Treatment Characteristics
                    </option>
                    <option value="followUp">Follow Up</option>
                    <option value="patientSurvey">Patient Survey</option>
                    <option value="siteSpecificCharacteristics">
                      Site Specific Characteristics
                    </option>
                  </Select>
                  {compareParams.group2 !== "" && (
                    <>
                      <Select
                        w="35%"
                        fontSize={"13px"}
                        onChange={(e) => {
                          const key = e.target.value;
                          setCompareParams((prev) => ({
                            ...prev,
                            field2: key,
                            value2: "",
                          }));
                        }}
                        value={compareParams.field2}
                      >
                        <option value="">-- Select Field --</option>
                        {filterColumns
                          .filter(
                            (column) =>
                              column.group === compareParams?.group2 &&
                              column.type !== "date" &&
                              column.type !== "number",
                          )
                          .map((column) => (
                            <option
                              key={column.key + "field2"}
                              value={column.key}
                            >
                              {column.label}
                            </option>
                          ))}
                      </Select>{" "}
                      {compareParams.field2 != "" && (
                        <Select
                          w="30%"
                          fontSize={"13px"}
                          onChange={(e) => {
                            const key = e.target.value;
                            setCompareParams((prev) => ({
                              ...prev,
                              value2: key,
                            }));
                          }}
                          value={compareParams.value2}
                        >
                          <option value="">-- Select Value --</option>
                          {filterColumns
                            .find(
                              (column) => column.key === compareParams.field2,
                            )
                            ?.options?.map((option) => (
                              <option
                                key={(option.value || option) + "value2"}
                                value={option?.value || option}
                              >
                                {option.name || option}
                              </option>
                            ))}
                        </Select>
                      )}
                    </>
                  )}
                </Flex>
                {compareParams.value1 !== "" && compareParams.value2 !== "" && (
                  <ReactApexChart
                    options={compareParams_state.options}
                    series={compareParams_state.series}
                    type="bar"
                    height={400}
                  />
                )}
              </Card>
              <Card className="mt-2 flex flex-col justify-center w-full p-4">
                <Text
                  fontSize="13px"
                  textTransform={"uppercase"}
                  fontWeight={"700"}
                  p="2"
                >
                  Distribution Within a field:
                </Text>
                <Flex gap="0.5rem" w="100%" mb="8">
                  <Select
                    w="45%"
                    fontSize={"13px"}
                    value={selectedGroup}
                    onChange={(e) => {
                      setSelectedGroup(e.target.value);
                      setSelectedField("");
                    }}
                  >
                    <option value="">-- Select Group --</option>
                    <option value="generalDetails">General Details</option>
                    <option value="patientCharacteristics">
                      Patient Characteristics
                    </option>{" "}
                    <option value="treatmentCharacteristics">
                      Treatment Characteristics
                    </option>
                    <option value="followUp">Follow Up</option>
                    <option value="patientSurvey">Patient Survey</option>
                    <option value="siteSpecificCharacteristics">
                      Site Specific Characteristics
                    </option>
                  </Select>
                  {selectedGroup != "" && (
                    <>
                      <Select
                        w="45%"
                        fontSize={"13px"}
                        onChange={(e) => {
                          const key = e.target.value;
                          setSelectedField(key);
                        }}
                        value={selectedField}
                      >
                        <option value="">-- Select Field --</option>
                        {filterColumns
                          .filter(
                            (column) =>
                              column.group === selectedGroup &&
                              column.type !== "date" &&
                              (column.type !== "number" ||
                                column.key === "ageAtTimeOfSurgery"),
                          )
                          .map((column) => (
                            <option
                              key={column.key + "field"}
                              value={column.key}
                            >
                              {column.label}
                            </option>
                          ))}
                      </Select>{" "}
                    </>
                  )}
                </Flex>
                {/* <Flex w="100%" h="100%" align={"center"} justify={"center"}> */}
                {selectedField != "" && (
                  <ReactApexChart
                    options={reactApexChart_state.options}
                    series={reactApexChart_state.series}
                    type="pie"
                    height={350}
                  />
                )}
                {/* </Flex> */}
              </Card>
              <Flex
                gap="0.5rem"
                align={"center"}
                w="100%"
                p="2"
                bg="white"
                borderRadius="6px"
                border="1px solid #F7F0F0"
              >
                <Text
                  fontSize={{ base: "12px", md: "13px" }}
                  textTransform={"uppercase"}
                  fontWeight={"600"}
                >
                  Reports:
                </Text>
                <Select
                  fontSize={{ base: "12px", md: "13px" }}
                  value={reportType}
                  onChange={(e) => {
                    const selectedReport = e.target.value;
                    setReportType(selectedReport);

                    setColumnVisibility((prev) => {
                      const newVisibility = { ...prev };
                      Object.keys(newVisibility).forEach((key) => {
                        if (key === "caseNumber") {
                          newVisibility[key] = true;
                        } else if (
                          reportColumns[selectedReport]?.includes(key)
                        ) {
                          newVisibility[key] = true;
                        } else {
                          newVisibility[key] = false;
                        }
                      });
                      return newVisibility;
                    });
                    setGlobalFilter(filterReportOptions[selectedReport] || []);
                  }}
                >
                  <option value="">-- Select Report Type --</option>
                  {reportOptions
                    ?.filter((opt) => opt?.isCsv)
                    ?.map((option) => (
                      <option
                        key={option.value + "report"}
                        value={option.value}
                      >
                        {option.name}
                      </option>
                    ))}
                </Select>
              </Flex>
              <Flex
                gap="0.5rem"
                align={"center"}
                w="100%"
                p="2"
                bg="white"
                borderRadius="6px"
                border="1px solid #F7F0F0"
              >
                <Text
                  fontSize={{ base: "12px", md: "13px" }}
                  textTransform={"uppercase"}
                  fontWeight={"600"}
                >
                  Display Columns:
                </Text>

                {groupOptions.map((option) => (
                  <Flex
                    flexDirection={"column"}
                    key={option.value + "group_col"}
                  >
                    <ReactSelect
                      isMulti
                      placeholder={option.label}
                      key={option.value}
                      options={filterColumns
                        .filter((column) => column.group === option.value)
                        .map((column) => ({
                          value: column.key,
                          label: column.label,
                        }))}
                      value={Object.keys(columnVisibility)
                        .filter((key) => columnVisibility[key] === true)
                        .map((key) => {
                          const column = filterColumns.find(
                            (col) => col.key === key,
                          );
                          if (column?.group === option.value) {
                            return {
                              value: key,
                              label: column.label,
                            };
                          }
                          return null;
                        })
                        .filter((item) => item !== null)}
                      onChange={(selectedOptions: any[]) => {
                        const selectedValues = selectedOptions.map(
                          (option: any) => option.value,
                        );
                        setColumnVisibility((prev) => {
                          const newVisibility = { ...prev };
                          const removedValues = Object.keys(
                            newVisibility,
                          ).filter((key) => newVisibility[key] === true);
                          selectedValues.forEach((value) => {
                            if (value in newVisibility) {
                              newVisibility[value] = true;
                            }
                          });
                          removedValues.forEach((value) => {
                            const group = filterColumns.find(
                              (column) => column.key === value,
                            )?.group;
                            if (group === option.value) {
                              if (
                                !selectedValues.includes(value) &&
                                value !== "caseNumber"
                              ) {
                                newVisibility[value] = false;
                              }
                            }
                          });
                          return newVisibility;
                        });
                      }}
                      styles={selectCustomStyle}
                    />
                  </Flex>
                ))}
              </Flex>
              <Flex gap="0.5rem" w="100%">
                <Text
                  p="2"
                  fontSize={"13px"}
                  textTransform={"uppercase"}
                  fontWeight={600}
                >
                  Total: {filteredData.length}
                </Text>
                <Spacer />
                <Button
                  fontSize={"14px"}
                  leftIcon={<MdRefresh fontSize={"22px"} />}
                  fontWeight={700}
                  fontFamily={"inter"}
                  color={"#351361"}
                  textTransform={"uppercase"}
                  letterSpacing={"2.52px"}
                  onClick={() => {
                    setColumnVisibility((prev) => {
                      const newVisibility = { ...prev };
                      Object.keys(newVisibility).forEach((key) => {
                        if (key === "caseNumber") {
                          newVisibility[key] = true;
                        } else {
                          newVisibility[key] = false;
                        }
                      });
                      return newVisibility;
                    });
                    setGlobalFilter([]);
                    setReportType("");
                  }}
                >
                  Reset
                </Button>
                <Button
                  fontSize={"14px"}
                  fontWeight={700}
                  leftIcon={<DownloadIcon fontSize={"22px"} />}
                  fontFamily={"inter"}
                  color={"#351361"}
                  textTransform={"uppercase"}
                  letterSpacing={"2.52px"}
                  onClick={exportToCSV}
                >
                  Export As Sites
                </Button>
                <Button
                  fontSize={"14px"}
                  fontWeight={700}
                  leftIcon={<DownloadIcon fontSize={"22px"} />}
                  fontFamily={"inter"}
                  color={"#351361"}
                  textTransform={"uppercase"}
                  letterSpacing={"2.52px"}
                  onClick={exportToCSV_case}
                >
                  Export As Cases
                </Button>
              </Flex>
              <TableContainer
                w="100%"
                maxHeight="50vh"
                overflowY="auto"
                overflowX="auto"
                width="100%"
                bg="white"
                borderRadius="6px"
                border="1px solid #F7F0F0"
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
                              p="6"
                            >
                              {header?.isPlaceholder
                                ? null
                                : flexRender(
                                    header.column.columnDef.header,
                                    header.getContext(),
                                  )}
                            </Th>
                          );
                        })}
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
                              !cell.id.includes("recordConsultationStatus") && (
                                <Td key={cell.id} p="6">
                                  {flexRender(
                                    cell.column.columnDef.cell,
                                    cell.getContext(),
                                  )}
                                </Td>
                              ),
                          )}
                        </Tr>
                      ))
                    ) : (
                      <Tr>
                        <Th colSpan={columnData.length}>No results.</Th>
                      </Tr>
                    )}
                  </Tbody>
                </Table>
              </TableContainer>
            </Flex>
          </TabPanel>
          <TabPanel px="0">
            <Flex flexDirection={"column"} w="100%" gap="1rem">
              {/* <InputGroup >
                <InputLeftElement
                  pointerEvents="none"
                  children={<MdSearch fontSize={"22px"} />}
                />
                <Input
                  type="text"
                  placeholder="Search by Patient Name or Case Number"
                  fontSize={"13px"}
                  onChange={(e) => {
                    const value = e.target.value
                    setColumnFilters([
                      {
                        id: "patientName",
                        value: value,
                      },
                    ])
                  }}
                />
              </InputGroup> */}
              <FilterComponent
                globalFilter={globalFilter}
                setGlobalFilter={setGlobalFilter}
                surgeonOptions={recordTreatmentSurgeonOptions}
                selectCustomStyle={selectCustomStyle}
                locationOptions={locationOptions}
              />
              <Tabs colorScheme={"purple"}>
                <TabList>
                  <Tab
                    fontSize={{ base: "12px", md: "13px" }}
                    textTransform={"uppercase"}
                    fontWeight={"700"}
                    onClick={() => {
                      setGlobalFilter([]);
                    }}
                  >
                    Fluid Table
                  </Tab>
                  <Tab
                    fontSize={{ base: "12px", md: "13px" }}
                    textTransform={"uppercase"}
                    fontWeight={"700"}
                    onClick={() => {
                      setGlobalFilter([]);
                    }}
                  >
                    Restricted Values Table
                  </Tab>
                  <Tab
                    fontSize={{ base: "12px", md: "13px" }}
                    textTransform={"uppercase"}
                    fontWeight={"700"}
                    onClick={() => {
                      setGlobalFilter([]);
                    }}
                  >
                    Standard Reports
                  </Tab>
                </TabList>
                <TabPanels>
                  <TabPanel px="0">
                    <FluidTable
                      filteredData={filteredData}
                      groupOptions={groupOptions}
                      recordTreatmentSurgeonOptions={
                        recordTreatmentSurgeonOptions
                      }
                      clinlogNotes={clinlogNotes}
                    />
                  </TabPanel>
                  <TabPanel px="0">
                    <RestrictedValuesTable
                      filteredData={filteredData}
                      groupOptions={groupOptions}
                      recordTreatmentSurgeonOptions={
                        recordTreatmentSurgeonOptions
                      }
                    />
                  </TabPanel>
                  <TabPanel px="0">
                    <StandardReports
                      filteredData={filteredData}
                      groupOptions={groupOptions}
                      recordTreatmentSurgeonOptions={
                        recordTreatmentSurgeonOptions
                      }
                      clinlogNotes={clinlogNotes}
                      globalFilter={globalFilter}
                      setGlobalFilter={setGlobalFilter}
                      implantLineOptions={implantLineOptions}
                    />
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </Flex>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Flex>
  );
}
