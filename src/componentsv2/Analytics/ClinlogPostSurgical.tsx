import React, { use, useMemo, useState } from "react";
import {
  Flex,
  Text,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  SimpleGrid,
  Select,
  Box,
  color,
} from "@chakra-ui/react";
import {
  format,
  differenceInYears,
  differenceInDays,
  differenceInMonths,
} from "date-fns";
import { Card, CardHeader, CardTitle } from "src/uicomponents/ui/card";
import dynamic from "next/dynamic";
import { id } from "date-fns/locale";
import { style } from "@mui/system";
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});
import { ApexOptions } from "apexcharts";
export type postSurgicalProps = {
  clinlogRecordDetails: any[];
};
function ClinlogPostSurgical({ clinlogRecordDetails }: postSurgicalProps) {
  const immediateRestoration_options = [
    "Implant-retained Fixed IMMEDIATE FINAL",
    "Implant-retained Fixed PROVISIONAL",
    "Implant-Supported Removable Denture",
    "Tooth-supported Partial Denture",
    "Tooth-supported Fixed bridge",
    "Tissue-born denture",
    "unknown",
  ];
  const immediateRestoration_data = useMemo(() => {
    const result = [];
    immediateRestoration_options.forEach((key) => {
      const value = clinlogRecordDetails?.filter((record) => {
        if (key === "Implant-retained Fixed IMMEDIATE FINAL") {
          return (
            record.immediateRestoration ===
            "Implant-retained Fixed IMMEDIATE FINAL"
          );
        }
        if (key === "Implant-retained Fixed PROVISIONAL") {
          return (
            record.immediateRestoration === "Implant-retained Fixed PROVISIONAL"
          );
        }
        if (key === "Implant-Supported Removable Denture") {
          return (
            record.immediateRestoration ===
            "Implant-Supported Removable Denture"
          );
        }
        if (key === "Tooth-supported Partial Denture") {
          return (
            record.immediateRestoration === "Tooth-supported Partial Denture"
          );
        }
        if (key === "Tooth-supported Fixed bridge") {
          return record.immediateRestoration === "Tooth-supported Fixed bridge";
        }
        if (key === "Tissue-born denture") {
          return record.immediateRestoration === "Tissue-born denture";
        }
        if (key === "unknown") {
          return (
            record.immediateRestoration === "unknown" ||
            record.immediateRestoration === ""
          );
        }
      }).length;
      result.push({
        x: key,
        y: value,
      });
    });
    return result;
  }, [clinlogRecordDetails]);
  const immediateRestoration_state: {
    options: ApexOptions;
    series: any[];
  } = {
    series: immediateRestoration_data?.map((item) => item.y),
    options: {
      chart: {
        id: "pie-chart_ir",
      },
      legend: {
        show: true,
        position: "bottom",
        horizontalAlign: "center",
        //floating: true,
      },

      labels: immediateRestoration_data?.map((item) => item.x),
    },
  };
  const timeFromSurgeryCategories = [
    "Immediate(1 day)",
    "Short-term(2-3 days)",
    "Week-based (4-14 Days)",
    "Month-based (15-30 Days)",
    "Long-term (> 30 Days)",
  ];
  const timeFromSurgeryToInsertion_data = useMemo(() => {
    const patientData = clinlogRecordDetails?.filter(
      (record) => record.recordTreatmentDate && record.dateOfInsertion
    );
    const result = [];
    timeFromSurgeryCategories.forEach((key) => {
      const value = patientData?.filter((record) => {
        const timeDiff = differenceInDays(
          new Date(record.dateOfInsertion),
          new Date(record.recordTreatmentDate)
        );
        if (key === "Immediate(1 day)") {
          return timeDiff <= 1;
        }
        if (key === "Short-term(2-3 days)") {
          return timeDiff > 1 && timeDiff <= 3;
        }
        if (key === "Week-based (4-14 Days)") {
          return timeDiff >= 4 && timeDiff <= 14;
        }
        if (key === "Month-based (15-30 Days)") {
          return timeDiff >= 15 && timeDiff <= 30;
        }
        if (key === "Long-term (> 30 Days)") {
          return timeDiff > 30;
        }
      }).length;
      result.push({
        x: key,
        y: value,
      });
    });
    return result;
  }, [clinlogRecordDetails]);
  const timeFromSurgeryToInsertion_state: {
    options: ApexOptions;
    series: any[];
  } = {
    series: [
      {
        name: "Count",
        data: timeFromSurgeryToInsertion_data.map((item) => item.y),
      },
    ],
    options: {
      plotOptions: {
        bar: {
          barHeight: "100%",
          distributed: true,
        },
      },
      legend: {
        show: true, // Show the legend
        position: "bottom", // Position the legend at the top of the chart
        horizontalAlign: "right", // Align the legend to the right
        //floating: true, // Allow the legend to float above the chart
      },

      xaxis: {
        categories: timeFromSurgeryCategories,
        title: {
          text: "Time", // X-axis title
          style: {
            fontSize: "14px",
            fontWeight: "bold",
          },
        },
      },
      yaxis: {
        title: {
          text: "Number of Cases", // X-axis title
          style: {
            fontSize: "14px",
            fontWeight: "bold",
          },
        },
      },
      title: {
        text: "Time from Surgery to Insertion"?.toUpperCase(),
        align: "center",
        style: {
          fontSize: "13px",
          fontWeight: "700",
        },
        //floating: true
      },
      subtitle: {
        text: "Visualise the distribution of the time taken for prosthesis placement",
        align: "center",
        style: {
          fontSize: "13px",
          fontWeight: "400",
        },
      },
    },
  };
  const complicationsCategories = [
    "< 1 Month",
    "1-3 Months",
    "3-6 Months",
    "6-12 Months",
    "> 12 Months",
  ];
  const complicationsTrend_data = useMemo(() => {
    const patientData = clinlogRecordDetails?.filter(
      (record) =>
        record?.recordFollowUpMatrix?.length > 0 &&
        record?.recordFollowUpMatrix?.[0]?.dateOfFollowUp
    );
    const groupedPatientData = [];

    complicationsCategories.forEach((key) => {
      const value = patientData?.filter((record) => {
        const timeDiff = differenceInMonths(
          new Date(record?.recordFollowUpMatrix?.[0]?.dateOfFollowUp),
          new Date(record.recordTreatmentDate)
        );
        if (key === "< 1 Month") {
          return timeDiff < 1;
        }
        if (key === "1-3 Months") {
          return timeDiff >= 1 && timeDiff <= 3;
        }
        if (key === "3-6 Months") {
          return timeDiff >= 3 && timeDiff <= 6;
        }
        if (key === "6-12 Months") {
          return timeDiff >= 6 && timeDiff <= 12;
        }
        if (key === "> 12 Months") {
          return timeDiff > 12;
        }
      });
      groupedPatientData.push({
        key: key,
        patients: value,
      });
    });
    const result = [];
    groupedPatientData.forEach((item) => {
      const data = item.patients
        ?.map((record) => {
          const dentalChart = record?.attachedDentalCharts?.[0] || {};
          const followUps = dentalChart?.proposedTreatmentToothMatrix
            ?.map((site) => {
              return {
                id: site?.id,
                sinusitis:
                  site?.attachedSiteSpecificRecords?.[0]
                    ?.attachedSiteSpecificFollowUp?.[0]?.sinusitis || "No",
                inflammation:
                  site?.attachedSiteSpecificRecords?.[0]
                    ?.itemSpecificationMatrix?.[0]?.inflammation || "No",
                pain:
                  site?.attachedSiteSpecificRecords?.[0]
                    ?.itemSpecificationMatrix?.[0]?.pain || "No",
              };
            })
            .flat();
          return followUps;
        })
        .flat();
      result.push({
        key: item.key,
        followUps: data,
      });
    });
    return result;
  }, [clinlogRecordDetails]);
  const complicationsTrend_state_sinusitis: {
    options: ApexOptions;
    series: any[];
  } = {
    series: [
      {
        name: "Sinusitis - Yes",
        data: complicationsTrend_data?.map((item) => {
          const data = item.followUps;
          return data.filter((site) => site.sinusitis === "Yes").length;
        }),
      },
      {
        name: "Sinusitis - No",
        data: complicationsTrend_data?.map((item) => {
          const data = item.followUps;
          return data.filter((site) => site.sinusitis !== "Yes").length;
        }),
      },
    ],
    options: {
      chart: {
        height: 350,
        type: "line",
      },
      xaxis: {
        categories: complicationsCategories,
        title: {
          text: "Time", // X-axis title
        },
      },
      colors: ["#FF4560", "#FEB019"],
    },
  };
  const complicationsTrend_state_inflammation: {
    options: ApexOptions;
    series: any[];
  } = {
    series: [
      {
        name: "Inflammation - Yes",
        data: complicationsTrend_data?.map((item) => {
          const data = item.followUps;
          return data.filter((site) => site.inflammation === "Yes").length;
        }),
      },
      {
        name: "Inflammation - No",
        data: complicationsTrend_data?.map((item) => {
          const data = item.followUps;
          return data.filter((site) => site.inflammation !== "Yes").length;
        }),
      },
    ],
    options: {
      chart: {
        height: 350,
        type: "line",
      },
      xaxis: {
        categories: complicationsCategories,
        title: {
          text: "Time", // X-axis title
        },
      },
      colors: ["#00E396", "#775DD0"],
    },
  };
  const complicationsTrend_state_pain: {
    options: ApexOptions;
    series: any[];
  } = {
    series: [
      {
        name: "Pain - Yes",
        data: complicationsTrend_data?.map((item) => {
          const data = item.followUps;
          return data.filter((site) => site.pain === "Yes").length;
        }),
      },
      {
        name: "Pain - No",
        data: complicationsTrend_data?.map((item) => {
          const data = item.followUps;
          return data.filter((site) => site.pain === "No").length;
        }),
      },
    ],
    options: {
      chart: {
        height: 350,
        type: "line",
      },
      xaxis: {
        categories: complicationsCategories,
        title: {
          text: "Time", // X-axis title
        },
      },
      colors: ["#ff0000", "#0088ee"],
    },
  };
  const calculateStatistics = (sortedData) => {
    // Step 1: Sort the data in ascending order

    const n = sortedData.length;

    // Step 2: Calculate Min and Max
    const min = sortedData[0];
    const max = sortedData[n - 1];

    // Step 3: Calculate Median (Q2)
    const median =
      n % 2 === 0
        ? (sortedData[n / 2 - 1] + sortedData[n / 2]) / 2
        : sortedData[Math.floor(n / 2)];

    // Step 4: Calculate Q1 and Q3
    let lowerHalf = sortedData.slice(0, Math.floor(n / 2)); // Lower half excluding the median if odd

    let upperHalf = sortedData.slice(Math.ceil(n / 2)); // Upper half excluding the median if odd

    // Calculate Q1 (median of lower half)
    const q1 =
      lowerHalf.length % 2 === 0
        ? (lowerHalf[lowerHalf.length / 2 - 1] +
            lowerHalf[lowerHalf.length / 2]) /
          2
        : lowerHalf[Math.floor(lowerHalf.length / 2)];

    // Calculate Q3 (median of upper half)
    const q3 =
      upperHalf.length % 2 === 0
        ? (upperHalf[upperHalf.length / 2 - 1] +
            upperHalf[upperHalf.length / 2]) /
          2
        : upperHalf[Math.floor(upperHalf.length / 2)];

    // Step 5: Calculate IQR (Interquartile Range)
    const iqr = q3 - q1;

    // Step 6: Calculate Outliers
    const lowerFence = q1 - 1.5 * iqr;
    const upperFence = q3 + 1.5 * iqr;

    const outliers = sortedData.filter(
      (value) => value < lowerFence || value > upperFence
    );

    return {
      min: min === q1 ? q1 - 1 : min,
      q1,
      median,
      q3,
      max,
      outliers,
    };
  };

  const reviewStats = useMemo(() => {
    const patientData = clinlogRecordDetails?.filter(
      (record) =>
        record?.recordFollowUpMatrix?.length > 0 &&
        record?.recordFollowUpMatrix?.[0]?.numberOfReviews
    );
    const result = [];
    const reviews = patientData
      ?.map((record) => {
        const noOfReviews = Number(
          record?.recordFollowUpMatrix?.[0]?.numberOfReviews
        );
        return noOfReviews === 0 ? 1 : noOfReviews;
      })
      .sort((a, b) => a - b);

    const stats = calculateStatistics(reviews);
    return stats;
  }, [clinlogRecordDetails]);

  const reviewStats_state: {
    options: ApexOptions;
    series: any[];
  } = {
    series: [
      {
        name: "Patient Reviews",
        data: [
          {
            x: "Reviews",
            y: [
              reviewStats.min,
              reviewStats.q1,
              reviewStats.median,
              reviewStats.q3,
              reviewStats.max,
            ],
            metadata: {
              outliers: [-2, 12],
            },
          },
        ],
      },
    ],
    options: {
      chart: {
        type: "boxPlot",
        height: 350,
      },
      title: {
        text: "Number of Reviews During Review Period"?.toUpperCase(),
        align: "center",
        style: {
          fontSize: "13px",
          fontWeight: "700",
        },
      },
      subtitle: {
        text: "Understand variability in follow-up frequency by patient group",
        align: "center",
        style: {
          fontSize: "13px",
          fontWeight: "500",
        },
      },
      xaxis: {
        categories: ["Patient Reviews"],
      },
      yaxis: {
        title: {
          text: "Number of Reviews",
        },
      },
      tooltip: {
        y: {
          formatter: (val) => `Number of reviews: ${val}`,
        },
      },
      plotOptions: {
        boxPlot: {
          colors: {
            upper: "#ff6600",
            lower: "#0099cc",
          },
        },
      },
      markers: {
        size: 5,
        colors: ["black"],
        shape: "circle",
        hover: {
          sizeOffset: 3,
        },
      },
    },
  };

  return (
    <Flex w="100%" h="100%" p="6">
      <Tabs w="100%" h="100%">
        <TabList color="darkBlueLogo" fontWeight="700">
          {/* <Tab fontSize="12px" textTransform="uppercase">
            Number of Patients Report{" "}
          </Tab> */}
          <Tab fontSize="12px" textTransform="uppercase">
            Immediate Restoration Success Analysis
          </Tab>
          <Tab fontSize="12px" textTransform="uppercase">
            Time from Surgery to Insertion
          </Tab>
          <Tab fontSize="12px" textTransform="uppercase">
            Complications Over Time
          </Tab>
          <Tab fontSize="12px" textTransform="uppercase">
            Number of Reviews During Review Period
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            {" "}
            <Card className="mt-8 flex flex-col justify-center w-full h-auto p-4">
              <Text
                w="100%"
                align={"center"}
                fontSize="13px"
                fontWeight="700"
                textTransform={"uppercase"}
              >
                Immediate Restoration Success Analysis
              </Text>
              <Text w="100%" align={"center"} fontSize="13px" fontWeight="500">
                Show percentages of cases with successful immediate restoration
              </Text>

              <ReactApexChart
                options={immediateRestoration_state.options}
                series={immediateRestoration_state.series}
                type="pie"
                height="420"
              />
            </Card>
          </TabPanel>
          <TabPanel>
            {" "}
            <Card className="mt-8 flex flex-col justify-center w-full h-auto p-4">
              <ReactApexChart
                options={timeFromSurgeryToInsertion_state.options}
                series={timeFromSurgeryToInsertion_state.series}
                type="bar"
                height="420"
              />
            </Card>
          </TabPanel>
          <TabPanel>
            <SimpleGrid columns={2} spacing={6}>
              {" "}
              <Card className="mt-8 flex flex-col justify-center w-full h-auto p-4">
                <ReactApexChart
                  options={complicationsTrend_state_sinusitis.options}
                  series={complicationsTrend_state_sinusitis.series}
                  type="line"
                  height="250"
                />
              </Card>
              <Card className="mt-8 flex flex-col justify-center w-full h-auto p-4">
                <ReactApexChart
                  options={complicationsTrend_state_inflammation.options}
                  series={complicationsTrend_state_inflammation.series}
                  type="line"
                  height="250"
                />
              </Card>
              <Card className="mt-8 flex flex-col justify-center w-full h-auto p-4">
                <ReactApexChart
                  options={complicationsTrend_state_pain.options}
                  series={complicationsTrend_state_pain.series}
                  type="line"
                  height="250"
                />
              </Card>
            </SimpleGrid>
          </TabPanel>
          <TabPanel>
            <Card className="mt-8 flex flex-col justify-center w-full h-auto p-4">
              <ReactApexChart
                options={reviewStats_state.options}
                series={reviewStats_state.series}
                type="boxPlot"
                height="420"
              />
            </Card>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Flex>
  );
}

export default ClinlogPostSurgical;
