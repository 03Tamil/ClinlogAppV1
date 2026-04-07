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
  max,
  min,
} from "date-fns";
import { Card, CardHeader, CardTitle } from "src/uicomponents/ui/card";
import dynamic from "next/dynamic";
import { id } from "date-fns/locale";
import { style } from "@mui/system";
import { title } from "process";
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});
import { ApexOptions } from "apexcharts";
export type habitsAndRiskFactorsProps = {
  clinlogRecordDetails: any[];
  filterColumns: any[];
};

function ClinlogHabitsAndRiskFactors({
  clinlogRecordDetails,
  filterColumns,
}: habitsAndRiskFactorsProps) {
  const smokingCategories = ["Yes, Heavy", "Yes", "No", "Unknown"];
  const suppurationCategories = ["Yes", "No", "Unknown"];
  const inflammationCategories = ["Yes", "No"];
  const correlationData = useMemo(() => {
    const data = clinlogRecordDetails
      .map((record) => {
        const dentalChart = record?.attachedDentalCharts?.[0] || {};
        const sites = dentalChart?.proposedTreatmentToothMatrix
          ?.map((site) => {
            return {
              id: site?.id,
              smoking: record?.smoking || "Unknown",
              suppuration:
                site?.attachedSiteSpecificRecords?.[0]
                  ?.attachedSiteSpecificFollowUp?.[0]?.suppuration || "Unknown",
              inflammation:
                site?.attachedSiteSpecificRecords?.[0]
                  ?.attachedSiteSpecificFollowUp?.[0]?.inflammation || "No",
            };
          })
          .flat();
        return sites;
      })
      .flat();

    const seriesData = data.map((site) => {
      return {
        smoking:
          site?.smoking === "" ||
          site?.smoking === null ||
          site?.smoking === "unknown"
            ? "Unknown"
            : site?.smoking,
        suppuration:
          site?.suppuration === "" ||
          site?.suppuration === null ||
          site?.suppuration === "unknown" ||
          site?.suppuration === "Unknown"
            ? "Unknown"
            : site?.suppuration,
        inflammation:
          site?.inflammation === "" ||
          site?.inflammation === null ||
          site?.inflammation === "unknown" ||
          site?.inflammation === "Unknown"
            ? "No"
            : site?.inflammation,
      };
    });
    return seriesData;
  }, [clinlogRecordDetails]);

  const correlationMatrix_1 = useMemo(() => {
    let correlationMatrix = Array(suppurationCategories.length)
      .fill(null)
      .map(() => Array(smokingCategories.length).fill(0));

    if (correlationData.length > 0) {
      correlationData.forEach((item) => {
        const smokingValue =
          item.smoking === "I smoke occasionally or socially only"
            ? "Yes"
            : item.smoking === "I smoke daily"
            ? "Yes, Heavy"
            : item.smoking === "I don’t smoke"
            ? "No"
            : "Unknown";
        const x = smokingCategories.indexOf(smokingValue);
        const y = suppurationCategories.indexOf(item.suppuration);
        if (x > 0 && y > 0) {
          correlationMatrix[y][x]++;
        }
      });
    }
    let seriesData = [];
    for (let i = 0; i < suppurationCategories.length; i++) {
      for (let j = 0; j < smokingCategories.length; j++) {
        seriesData.push({
          x: j,
          y: i,
          value: correlationMatrix[i][j],
        });
      }
    }
    return seriesData;
  }, [correlationData]);
  const correlationMatrix_2 = useMemo(() => {
    let correlationMatrix = Array(inflammationCategories.length)
      .fill(null)
      .map(() => Array(smokingCategories.length).fill(0));

    if (correlationData.length > 0) {
      correlationData.forEach((item) => {
        const smokingValue =
          item.smoking === "I smoke occasionally or socially only"
            ? "Yes"
            : item.smoking === "I smoke daily"
            ? "Yes, Heavy"
            : item.smoking === "I don’t smoke"
            ? "No"
            : "Unknown";
        const x = smokingCategories.indexOf(smokingValue);
        const y = inflammationCategories.indexOf(item.inflammation);
        if (x > 0 && y > 0) {
          correlationMatrix[y][x]++;
        }
        // correlationMatrix[y][x]++;
      });
    }
    let seriesData = [];
    for (let i = 0; i < inflammationCategories.length; i++) {
      for (let j = 0; j < smokingCategories.length; j++) {
        seriesData.push({
          x: j,
          y: i,
          value: correlationMatrix[i][j],
        });
      }
    }
    return seriesData;
  }, [correlationData]);
  const bubbleChart_state: {
    options: ApexOptions;
    series: any[];
  } = {
    series: [
      {
        name: "Suppuration - " + suppurationCategories[0],
        data: correlationMatrix_1
          .filter((item) => item.y === 0)
          ?.map((item, index) => {
            return {
              x: smokingCategories[item.x],
              y: item.value,
              z: item?.value < 100 ? 20 : item?.value < 500 ? 50 : 100,
            };
          }),
      },
      {
        name: "Suppuration - " + suppurationCategories[1],
        data: correlationMatrix_1
          .filter((item) => item.y === 1)
          ?.map((item, index) => {
            return {
              x: smokingCategories[item.x],
              y: item.value,
              z: item?.value < 100 ? 20 : item?.value < 500 ? 50 : 100,
            };
          }),
      },
      {
        name: "Suppuration - " + suppurationCategories[2],
        data: correlationMatrix_1
          .filter((item) => item.y === 2)
          ?.map((item, index) => {
            return {
              x: smokingCategories[item.x],
              y: item.value,
              z: item?.value < 100 ? 20 : item?.value < 500 ? 50 : 100,
            };
          }),
      },
      {
        name: "Inflammation - " + inflammationCategories[0],
        data: correlationMatrix_2
          .filter((item) => item.y === 0)
          ?.map((item, index) => {
            return {
              x: smokingCategories[item.x],
              y: item.value,
              z: item?.value < 100 ? 20 : item?.value < 500 ? 50 : 100,
            };
          }),
      },
      {
        name: "Inflammation - " + inflammationCategories[1],
        data: correlationMatrix_2
          .filter((item) => item.y === 1)
          ?.map((item, index) => {
            return {
              x: smokingCategories[item.x],
              y: item.value,
              z: item?.value < 100 ? 20 : item?.value < 500 ? 50 : 100,
            };
          }),
      },
    ],
    options: {
      title: {
        text: "Smoking and Complications Correlation"?.toUpperCase(),
        align: "center",
        style: {
          fontSize: "13px",
          fontWeight: "700",
        },
      },
      subtitle: {
        text: "Shows relationships between smoking status (size of bubble) and complications like inflammation or suppuration",
        align: "center",
        style: {
          fontSize: "13px",
          fontWeight: "500",
        },
      },
      dataLabels: {
        enabled: false,
      },
      fill: {
        opacity: 0.8,
        //type: "gradient",
      },
      xaxis: {
        min: 0, // Ensures that x-axis starts at 0
        tickAmount: 5,
        max: 5,
        categories: smokingCategories,
        title: {
          text: "Smoking",
        },
      },
      yaxis: {
        min: 0,
        max: 2000,
        tickAmount: 20,
        title: {
          text: "Suppuration",
        },
      },
      // theme: {
      //   palette: "palette2",
      // },
      legend: {
        show: true,
        position: "right",
        offsetY: 50,
      },
      tooltip: {
        enabled: true,
        custom: function ({ seriesIndex, dataPointIndex, w }) {
          const xLabel = smokingCategories[dataPointIndex];
          const yLabel =
            seriesIndex < 3
              ? suppurationCategories[seriesIndex]
              : inflammationCategories[seriesIndex - 3];
          const value = w.config.series[seriesIndex].data[dataPointIndex].y; // Value

          // Customize the tooltip content
          return `
            <div style="padding: 10px; background-color: #fff; border-radius: 4px; border: 1px solid #ddd;">
              <b>${
                seriesIndex < 3 ? "Suppuration" : "Inflammation"
              }:</b> ${yLabel}<br>
              <b>Smoking:</b> ${xLabel}<br>
              <b>Count:</b> ${value}<br>           
            </div>
          `;
        },
      },
    },
  };
  const treatmentTypes = [
    "AO4 One Side Zygoma",
    "AO4 Zygoma STANDARD (one each side posterior)",
    "AO4 Zygoma (one side quad/double zygoma)",
    "AO4 Zygoma (3 with one side quad/double)",
    "AO4 Zygoma Quad",
    "AO5 One Side Zygoma",
    "AO5 Zygoma (standard - one each side posterior)",
    "AO5 Zygoma (one each side anterior)",
    "AO5 Zygoma (one side quad/double zygoma)",
    "AO5 Zygoma (3 with one side quad/double)",
    "AO5 Zygoma Quad",
    "AO6 One Side Zygoma",
    "AO6 Zygoma (standard - one each side posterior)",
    "AO6 Zygoma (one side quad/double zygoma)",
    "AO6 Zygoma (3 with one side quad/double)",
    "AO6 Zygoma Quad",
    "Revision using Zygoma (Single)",
    "Revision using Zygoma (2 Single)",
    "Revision using Zygoma (double/quad)",
    "AO4 STANDARD",
    "AO5 Standard",
    "AO6 Standard",
    "AO7 Standard",
    "AO6 Zygoma Quad ( x2 pterygoids)",
    "Revision using standard",
    "AO7 Quad Zygoma Pterygoids Midline",
    "AO8 Zygoma Pterygoids",
    "AO7 Zygoma Pterygoids Midline",
    "unknown",
  ];
  const diabetesAndOsteoporosisOptions = [
    "Diabetes",
    "Osteoporosis",
    "Diabetes + Osteoporosis",
    "None",
    "unknown",
  ];
  const correlationTreatmentData = useMemo(() => {
    const data = clinlogRecordDetails?.map((record) => {
      return {
        id: record?.id,
        treatment: record?.treatmentTitle || "unknown",
        diabetesAndOsteoporosis: record?.diabetesAndOsteoporosis || "unknown",
      };
    });

    return data;
  }, [clinlogRecordDetails]);

  const correlationTreatmentMatrix = useMemo(() => {
    let correlationMatrix = Array(diabetesAndOsteoporosisOptions.length)
      .fill(null)
      .map(() => Array(treatmentTypes.length).fill(0));

    if (correlationTreatmentData.length > 0) {
      correlationTreatmentData.forEach((item) => {
        const x = treatmentTypes.indexOf(item.treatment);
        const y = diabetesAndOsteoporosisOptions.indexOf(
          item.diabetesAndOsteoporosis
        );

        if (x !== -1 && y !== -1) {
          correlationMatrix[y][x]++;
        }
      });
    }
    let seriesData = [];
    for (let i = 0; i < diabetesAndOsteoporosisOptions.length; i++) {
      // Iterate through implant success ()
      for (let j = 0; j < treatmentTypes.length; j++) {
        // Iterate through bone density ()
        seriesData.push({
          x: j, //
          y: i, //
          value: correlationMatrix[i][j], // Frequency of this combination
        });
      }
    }

    return seriesData;
  }, [correlationTreatmentData]);
  const treatmentSeries: any[] = treatmentTypes?.map((treatment, index) => {
    const obj = {
      name: treatment,
      data: correlationTreatmentMatrix
        ?.filter((item) => item.x === index)
        ?.map((d) => {
          return d.value;
          // return {
          //   x: archConditions[d.y],
          //   y: d.value,
          // };
        }),
    };
    return obj;
  });

  const treatmentOptions: ApexOptions = {
    chart: {
      stacked: true,
    },

    // colors: [
    //   "#a6cee3",
    //   "#1f78b4",
    //   "#b2df8a",
    //   "#FF33A1",
    //   "#FF8C33",
    //   "#8C33FF",
    //   "#FF3357",
    //   "#33A1FF",
    //   "#57FF33",
    //   "#A133FF",
    //   "#FF3333",
    //   "#33FFDC",
    //   "#DC33FF",
    //   "#FFCC33",
    //   "#33CCFF",
    //   "#FF33CC",
    //   "#33FF77",
    //   "#77FF33",
    //   "#33FFFF",
    //   "#FF3377",
    //   "#FF5732",
    //   "#F9FF33",
    //   "#33FF7A",
    //   "#B1FF33",
    //   "#FF6F33",
    //   "#3377FF",
    //   "#FFBC33",
    //   "#FF33BB",
    //   "#33B1FF",
    //   "#7BFF33",
    // ],
    title: {
      text: "Diabetes And Osteoporosis vs. Treatment Type"?.toUpperCase(),
      align: "center",
      style: {
        fontSize: "13px",
        fontWeight: "700",
      },
    },
    subtitle: {
      text: "Analyse how Diabetes And Osteoporosis influence treatment planning",
      align: "center",
      style: {
        fontSize: "13px",
        fontWeight: "500",
      },
    },
    xaxis: {
      categories: diabetesAndOsteoporosisOptions, // Bone Density categories
      title: {
        text: "Diabetes And Osteoporosis",
      },
      labels: {
        style: {
          fontSize: "10px", // ← change this value
        },
      },
    },
    yaxis: {
      //categories: treatmentTypes, // Implant Success categories
      title: {
        text: "Treatment",
      },
    },
    legend: {
      position: "right",
      horizontalAlign: "right", // Align the legend to the right
    },
    tooltip: {
      enabled: true,
      custom: function ({ seriesIndex, dataPointIndex }) {
        const xLabel = diabetesAndOsteoporosisOptions[dataPointIndex];
        const yLabel = treatmentTypes[seriesIndex];
        const value = treatmentSeries[seriesIndex]?.data[dataPointIndex]; // Value for that combination

        // Customize the tooltip content
        return `
          <div style="padding: 10px; background-color: #fff; border-radius: 4px; border: 1px solid #ddd;">
            <b>Treatment:</b> ${yLabel}<br>
            <b>Diabetes And Osteoporosis:</b> ${xLabel}<br>
            <b>Count:</b> ${value}<br>           
          </div>
        `;
      },
    },
  };
  const bruxism = filterColumns
    ?.find((column) => column?.key === "bruxism")
    ?.options.map((option) => option.name);
  const alcohol = filterColumns
    ?.find((column) => column?.key === "alcohol")
    ?.options.map((option) => option.name);
  const scatterPlotData = useMemo(() => {
    const alcoholMap = alcohol.reduce(
      (acc, option, index) => ({ ...acc, [option]: index + 1 }),
      {}
    );
    const bruxismMap = bruxism.reduce(
      (acc, option, index) => ({ ...acc, [option]: index + 1 }),
      {}
    );

    const seriesData = clinlogRecordDetails
      .map((record) => {
        const alcohol =
          record?.alcohol === "I don’t drink Alcohol"
            ? "Never"
            : record?.alcohol === "I drink occasionally or socially only"
            ? "Occasionally/Socially"
            : record?.alcohol === "I drink 2-4 standard drinks per week"
            ? "2-4 Times per Week"
            : record?.alcohol === "I drink daily"
            ? "Daily"
            : "Unknown";
        const bruxism =
          record?.bruxism !== "unknown" ? record?.bruxism : "Unknown";
        const x = alcoholMap[alcohol];
        const y = bruxismMap[bruxism];
        if (x && y) {
          return { x, y, alcohol, bruxism };
        }
        return null;
      })
      .filter(Boolean);

    return seriesData;
  }, [clinlogRecordDetails]);

  const scatterPlot_state: {
    options: ApexOptions;
    series: any[];
  } = {
    //series: [{ name: "Patients", data: scatterPlotData }],
    series: bruxism.map((bruxismOption) => ({
      name: bruxismOption,
      data: alcohol.map(
        (alcoholOption) =>
          clinlogRecordDetails.filter((p) => {
            const alcoholVal =
              p?.alcohol === "I don’t drink Alcohol"
                ? "Never"
                : p?.alcohol === "I drink occasionally or socially only"
                ? "Occasionally/Socially"
                : p?.alcohol === "I drink 2-4 standard drinks per week"
                ? "2-4 Times per Week"
                : p?.alcohol === "I drink daily"
                ? "Daily"
                : "Unknown";
            const bruxismVal =
              p?.bruxism !== "unknown" ? p?.bruxism : "Unknown";
            return alcoholVal === alcoholOption && bruxismVal === bruxismOption;
          }).length
      ),
    })),
    options: {
      chart: { stacked: true },
      title: {
        text: "Alcohol Consumption vs Bruxism"?.toUpperCase(),
        align: "center",
        style: {
          fontSize: "13px",
          fontWeight: "700",
        },
      },
      subtitle: {
        text: " Analyse how these risk factors overlap and influence complications.",
        align: "center",
        style: {
          fontSize: "13px",
          fontWeight: "500",
        },
      },
      xaxis: { categories: alcohol, title: { text: "Alcohol Consumption" } },
      yaxis: { title: { text: "Patient Count" } },
      legend: {
        position: "right",
        horizontalAlign: "right", // Align the legend to the right
      },
      tooltip: {
        enabled: true,
        custom: function ({ seriesIndex, dataPointIndex }) {
          const xLabel = alcohol[dataPointIndex];
          const yLabel = bruxism[seriesIndex];
          const value =
            scatterPlot_state.series[seriesIndex].data[dataPointIndex]; // Value for that combination

          const arr = scatterPlot_state.series.map(
            (item) => item.data[dataPointIndex]
          );
          const percentage = (value / arr.reduce((a, b) => a + b, 0)) * 100;

          // Customize the tooltip content
          return `
            <div style="padding: 10px; background-color: #fff; border-radius: 4px; border: 1px solid #ddd;">
                   <b>Alcohol:</b> ${xLabel}<br>
                   <b>Bruxism:</b> ${yLabel}<br>
                   <b>Count:</b> ${value}<br>
                    <b>Percentage:</b> ${percentage.toFixed(2)}%<br>
            </div>
          `;
        },
      },
    },
    // options: {
    //   chart: {
    //     type: "scatter",
    //     zoom: { enabled: true },
    //   },
    //   xaxis: {
    //     title: { text: "Alcohol Consumption" },
    //     min: 1,
    //     max: alcohol.length,
    //     tickAmount: alcohol.length - 1,
    //     labels: { formatter: (val) => alcohol[Math.round(val) - 1] },
    //   },
    //   yaxis: {
    //     title: { text: "Bruxism Severity" },
    //     min: 1,
    //     max: bruxism.length,
    //     tickAmount: bruxism.length - 1,
    //     labels: { formatter: (val) => bruxism[Math.round(val) - 1] },
    //   },
    //   tooltip: {
    //     custom: ({ seriesIndex, dataPointIndex, w }) => {
    //       const point =
    //         w.globals.initialSeries[seriesIndex].data[dataPointIndex];
    //       return `<div class="tooltip-content"><strong>Alcohol:</strong> ${point.alcohol}<br/><strong>Bruxism:</strong> ${point.bruxism}</div>`;
    //     },
    //   },
    // },
  };
  return (
    <Flex w="100%" h="100%" p="6">
      <Tabs w="100%" h="100%">
        <TabList color="darkBlueLogo" fontWeight="700">
          <Tab fontSize="12px" textTransform="uppercase">
            Smoking and Complications Correlation
          </Tab>
          <Tab fontSize="12px" textTransform="uppercase">
            Diabetes and Osteoporosis Impact
          </Tab>
          <Tab fontSize="12px" textTransform="uppercase">
            Alcohol Consumption vs Bruxism
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Card className="mt-8 flex flex-col justify-center w-full h-auto p-4">
              <ReactApexChart
                options={bubbleChart_state.options}
                series={bubbleChart_state.series}
                type="bubble"
                height={800}
              />
            </Card>
          </TabPanel>
          <TabPanel>
            <Card className="mt-8 flex flex-col justify-center w-full h-auto p-4">
              <ReactApexChart
                options={treatmentOptions}
                series={treatmentSeries}
                type="bar"
                height={450}
              />
            </Card>
          </TabPanel>
          <TabPanel>
            <Card className="mt-8 flex flex-col justify-center w-full h-auto p-4">
              <ReactApexChart
                options={scatterPlot_state.options}
                series={scatterPlot_state.series}
                type="bar"
                height={450}
              />
            </Card>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Flex>
  );
}

export default ClinlogHabitsAndRiskFactors;
