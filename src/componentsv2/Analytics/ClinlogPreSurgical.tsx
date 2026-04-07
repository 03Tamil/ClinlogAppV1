import React, { useMemo, useState } from "react";
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
} from "@chakra-ui/react";
import { format, differenceInYears, sub } from "date-fns";
import { Card, CardHeader, CardTitle } from "src/uicomponents/ui/card";
import dynamic from "next/dynamic";
import { id } from "date-fns/locale";
import { style } from "@mui/system";
import { title } from "process";
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});
import { ApexOptions } from "apexcharts";
export type preSurgicalProps = {
  clinlogRecordDetails: any[];
};
function ClinlogPreSurgical({ clinlogRecordDetails }: preSurgicalProps) {
  const implantSuccessCategories = ["Yes", "No (failed)", "Sleeper"];
  const boneDensityCategories = [
    "Low Density",
    "Medium Density",
    "Optimal",
    "High Density",
    "Unknown",
  ];
  const correlationData = useMemo(() => {
    const data = clinlogRecordDetails
      .map((record) => {
        const dentalChart = record?.attachedDentalCharts?.[0] || {};
        const sites = dentalChart?.proposedTreatmentToothMatrix
          ?.map((site) => {
            return {
              id: site?.id,
              siteSpecificId: site?.attachedSiteSpecificRecords?.[0]?.id,
              implantSuccess:
                site?.attachedSiteSpecificRecords?.[0]
                  ?.attachedSiteSpecificFollowUp?.[0]
                  ?.implantFunctionAtFollowUp || "Unknown",
              boneDensity:
                site?.attachedSiteSpecificRecords?.[0]
                  ?.itemSpecificationMatrix?.[0]?.trabecularBoneDensity ||
                "Unknown",
              graftingApplied:
                site?.attachedSiteSpecificRecords?.[0]
                  ?.itemSpecificationMatrix?.[0]?.graftingApplied || "Unknown",
            };
          })
          .flat();
        return sites;
      })
      .flat();

    const seriesData = data.map((site) => {
      return {
        siteSpecificId: site?.siteSpecificId,
        boneDensity:
          site?.boneDensity === "" ||
          site?.boneDensity === null ||
          site?.boneDensity === "unknown"
            ? "Unknown"
            : site?.boneDensity,
        implantSuccess:
          site?.implantSuccess === "" ||
          site?.implantSuccess === null ||
          site?.implantSuccess === "unknown" ||
          site?.implantSuccess === "Unknown"
            ? "Yes"
            : site?.implantSuccess,
        graftingApplied:
          site?.graftingApplied === "" ||
          site?.graftingApplied === null ||
          site?.graftingApplied === "unknown" ||
          site?.graftingApplied === "Unknown"
            ? "No"
            : site?.graftingApplied,
      };
    });

    return seriesData;
  }, [clinlogRecordDetails]);

  const correlationMatrix_1 = useMemo(() => {
    let correlationMatrix = Array(implantSuccessCategories.length)
      .fill(null)
      .map(() => Array(boneDensityCategories.length).fill(0));

    if (correlationData.length > 0) {
      const siteSpecificIds = [];
      correlationData.forEach((item) => {
        if (siteSpecificIds.includes(item?.siteSpecificId)) return;
        if (item?.siteSpecificId) {
          siteSpecificIds.push(item?.siteSpecificId);
          const x = boneDensityCategories.indexOf(item?.boneDensity); // x-axis: bone density
          const y = implantSuccessCategories.indexOf(item?.implantSuccess); // y-axis: implant success
          // if (x > 0 && y > 0) {
          //   correlationMatrix[y][x]++;
          // }
          correlationMatrix[y][x]++;
        }
      });
    }
    let seriesData = [];
    for (let i = 0; i < implantSuccessCategories.length; i++) {
      // Iterate through implant success (3 categories)
      for (let j = 0; j < boneDensityCategories.length; j++) {
        // Iterate through bone density (4 categories)
        seriesData.push({
          x: j, // Bone density index (0 to 3)
          y: i, // Implant success index (0 to 2)
          value: correlationMatrix[i][j], // Frequency of this combination
        });
      }
    }
    return seriesData;
  }, [correlationData]);

  const heatMapOtions: ApexOptions = {
    chart: {
      height: 350,
      type: "bar",
      stacked: true,
      stackType: "100%",
    },
    plotOptions: {
      bar: {
        horizontal: false,
      },
    },
    colors: ["#4ADE80", "#FF1111", "#1f78b4"],
    title: {
      text: "Trabecular Bone Density vs Implant Success"?.toUpperCase(),
      align: "center",
      style: {
        fontSize: "13px",
        fontWeight: "700",
      },
    },
    subtitle: {
      text: "Explore correlations between Trabecular bone density and Treatment outcomes",
      align: "center",
      style: {
        fontSize: "13px",
        fontWeight: "500",
      },
    },
    stroke: {
      width: 1,
      colors: ["#fff"],
    },
    xaxis: {
      categories: boneDensityCategories, // Bone Density categories
      title: {
        text: "Bone Density",
      },
    },

    yaxis: {
      //categories: implantSuccessCategories, // Implant Success categories
      title: {
        text: "Implant Success Rate",
      },
    },
    tooltip: {
      enabled: true,
      custom: function ({ seriesIndex, dataPointIndex }) {
        const xLabel = boneDensityCategories[dataPointIndex]; // Bone Density label
        const yLabel = implantSuccessCategories[seriesIndex]; // Implant Success label
        const value = heatMapSeries[seriesIndex]?.data[dataPointIndex]?.y; // Value for that combination

        // Customize the tooltip content
        return `
          <div style="padding: 10px; background-color: #fff; border-radius: 4px; border: 1px solid #ddd;">
            <b>Implant Success:</b> ${yLabel}<br>
            <b>Bone Density:</b> ${xLabel}<br>
            <b>Count:</b> ${value}<br>           
          </div>
        `;
      },
    },
  };

  // Series data: flatten the correlation matrix
  const heatMapSeries: any[] = [
    {
      name: implantSuccessCategories[0],
      data: correlationMatrix_1
        ?.filter((item) => item.y === 0)
        ?.map((item) => {
          return {
            x: boneDensityCategories[item.x],
            y: item.value,
          };
        }),
    },
    {
      name: implantSuccessCategories[1],
      data: correlationMatrix_1
        ?.filter((item) => item.y === 1)
        ?.map((item) => {
          return {
            x: boneDensityCategories[item.x],
            y: item.value,
          };
        }),
    },
    {
      name: implantSuccessCategories[2],
      data: correlationMatrix_1
        ?.filter((item) => item.y === 2)
        ?.map((item) => {
          return {
            x: boneDensityCategories[item.x],
            y: item.value,
          };
        }),
    },
  ];
  const groupedDataByArchType = useMemo(() => {
    const data = clinlogRecordDetails?.reduce((acc, item) => {
      const { archType, zygomaImplants, regularImplants } = item;

      // Initialize this arch bucket if needed
      if (!acc[archType]) {
        acc[archType] = { regular: 0, zygoma: 0 };
      }

      // Push into the correct implant sub‑array
      if (Number(zygomaImplants) > 0) {
        acc[archType].zygoma += Number(zygomaImplants);
      }
      if (Number(regularImplants) > 0) {
        acc[archType].regular += Number(regularImplants);
      }

      return acc;
    }, {});

    return data;
  }, [clinlogRecordDetails]);

  // Prepare the series data by mapping through the arch types
  const archTypeSeries: any[] = [
    {
      name: "Regular",
      data: Object.keys(groupedDataByArchType).map(
        (arch) => groupedDataByArchType[arch].regular
      ),
    },
    {
      name: "Zygoma",
      data: Object.keys(groupedDataByArchType).map(
        (arch) => groupedDataByArchType[arch].zygoma
      ),
    },
  ];

  // Define the chart options
  const archTypeOptions: ApexOptions = {
    chart: {
      type: "bar",
      stacked: true,
      toolbar: {
        show: true,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
      },
    },
    title: {
      text: "Number of Implants by Arch Type"?.toUpperCase(),
      align: "center",
      style: {
        fontSize: "13px",
        fontWeight: "700",
      },
    },
    subtitle: {
      text: "Compare implant numbers in maxillary vs mandibular arches",
      align: "center",
      style: {
        fontSize: "13px",
        fontWeight: "500",
      },
    },
    xaxis: {
      categories: Object.keys(groupedDataByArchType)?.map((arch) =>
        arch.toUpperCase()
      ),
      title: {
        text: "Arch Type", // X-axis title
        style: {
          fontSize: "14px",
          fontWeight: "bold",
        },
      },
    },
    yaxis: {
      title: {
        text: "Number of Implants", // Y-axis title
        style: {
          fontSize: "14px",
          fontWeight: "bold",
        },
      },
    },
    legend: {
      position: "bottom",
      horizontalAlign: "right", // Align the legend to the right
      floating: true,
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

  const archConditions = [
    "Edentulous",
    "Partially Dentate (5 Teeth or Less)",
    "Partially Dentate (6-10 teeth)",
    "Dentate (11+ teeth)",
    "unknown",
  ];
  const correlationTreatmentData = useMemo(() => {
    const data = clinlogRecordDetails?.map((record) => {
      return {
        id: record?.id,
        treatment: record?.treatmentTitle || "unknown",
        archCondition: record?.upperArchCondition || "unknown",
      };
    });

    return data;
  }, [clinlogRecordDetails]);
  const correlationTreatmentMatrix = useMemo(() => {
    let correlationMatrix = Array(archConditions.length)
      .fill(null)
      .map(() => Array(treatmentTypes.length).fill(0));

    if (correlationTreatmentData.length > 0) {
      correlationTreatmentData.forEach((item) => {
        const x = treatmentTypes.indexOf(item.treatment);
        const y = archConditions.indexOf(item.archCondition);

        if (x !== -1 && y !== -1) {
          correlationMatrix[y][x]++;
        }
      });
    }
    let seriesData = [];
    for (let i = 0; i < archConditions.length; i++) {
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

  const heatMapTreatmentSeries: any[] = treatmentTypes?.map(
    (treatment, index) => {
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
    }
  );

  const heatMapTreatmentOptions: ApexOptions = {
    chart: {
      stacked: true,
    },
    plotOptions: {
      heatmap: {
        distributed: true,
      },
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
      text: "Arch Condition at Surgery vs. Treatment Type"?.toUpperCase(),
      align: "center",
      style: {
        fontSize: "13px",
        fontWeight: "700",
      },
    },
    subtitle: {
      text: "Analyse how arch conditions influence treatment planning",
      align: "center",
      style: {
        fontSize: "13px",
        fontWeight: "500",
      },
    },
    xaxis: {
      categories: archConditions, // Bone Density categories
      title: {
        text: "Arch Conditions",
      },
      labels: {
        style: {
          fontSize: "10px", // ← change this value
        },
      },
    },
    yaxis: {
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
        const xLabel = archConditions[dataPointIndex];
        const yLabel = treatmentTypes[seriesIndex];
        const value = heatMapTreatmentSeries[seriesIndex]?.data[dataPointIndex]; // Value for that combination

        // Customize the tooltip content
        return `
          <div style="padding: 10px; background-color: #fff; border-radius: 4px; border: 1px solid #ddd;">
            <b>Treatment:</b> ${yLabel}<br>
            <b>Arch Conditions:</b> ${xLabel}<br>
            <b>Count:</b> ${value}<br>           
          </div>
        `;
      },
    },
  };

  const graftingAppliedCategories = [
    "Yes, Zygoma Slot",
    "Yes, Zygoma Hockey Stick",
    "Yes, lateral approach",
    "Yes, sinus crush",
    "No",
    "Socket Fill",
    "Buccal Layered",
  ];

  const correlationMatrix_2 = useMemo(() => {
    let correlationMatrix = Array(graftingAppliedCategories.length)
      .fill(null)
      .map(() => Array(boneDensityCategories.length).fill(0));

    if (correlationData.length > 0) {
      correlationData.forEach((item) => {
        const siteSpecificIds = [];
        if (siteSpecificIds.includes(item?.siteSpecificId)) return;
        if (item?.siteSpecificId) {
          siteSpecificIds.push(item?.siteSpecificId);
          const x = boneDensityCategories.indexOf(item?.boneDensity); // x-axis: bone density
          const y = graftingAppliedCategories.indexOf(item?.graftingApplied); // y-axis: implant success
          // if (x > 0 && y > 0) {
          //   correlationMatrix[y][x]++;
          // }
          correlationMatrix[y][x]++;
        }
      });
    }
    let seriesData = [];
    for (let i = 0; i < graftingAppliedCategories.length; i++) {
      for (let j = 0; j < boneDensityCategories.length; j++) {
        seriesData.push({
          x: j, // Bone density index (0 to 3)
          y: i, // grafting applied index (0 to 6)
          value: correlationMatrix[i][j], // Frequency of this combination
        });
      }
    }
    return seriesData;
  }, [correlationData]);

  const heatMapOtions_2: ApexOptions = {
    chart: {
      height: 350,
      type: "heatmap",
    },
    plotOptions: {
      heatmap: {
        distributed: true,
      },
    },
    title: {
      text: "Trabecular Bone Density vs Grafting Applied"?.toUpperCase(),
      align: "center",
      style: {
        fontSize: "13px",
        fontWeight: "700",
      },
    },
    subtitle: {
      text: "Explore correlations between Trabecular bone density and Grafting applied",
      align: "center",
      style: {
        fontSize: "13px",
        fontWeight: "500",
      },
    },
    xaxis: {
      categories: boneDensityCategories, // Bone Density categories
      title: {
        text: "Bone Density",
      },
    },
    yaxis: {
      title: {
        text: "Grafting Applied",
      },
    },
    tooltip: {
      enabled: true,
      custom: function ({ seriesIndex, dataPointIndex }) {
        const xLabel = boneDensityCategories[dataPointIndex]; // Bone Density label
        const yLabel = graftingAppliedCategories[seriesIndex]; // Implant Success label
        const value = heatMapSeries_2[seriesIndex]?.data[dataPointIndex]?.y; // Value for that combination

        // Customize the tooltip content
        return `
          <div style="padding: 10px; background-color: #fff; border-radius: 4px; border: 1px solid #ddd;">
            <b>Grafting Applied:</b> ${yLabel}<br>
            <b>Bone Density:</b> ${xLabel}<br>
            <b>Count:</b> ${value}<br>           
          </div>
        `;
      },
    },
  };

  // Series data: flatten the correlation matrix
  const heatMapSeries_2: any[] = [
    {
      name: graftingAppliedCategories[0],
      data: correlationMatrix_2
        ?.filter((item) => item.y === 0)
        ?.map((item) => {
          return {
            x: boneDensityCategories[item.x],
            y: item.value,
          };
        }),
    },
    {
      name: graftingAppliedCategories[1],
      data: correlationMatrix_2
        ?.filter((item) => item.y === 1)
        ?.map((item) => {
          return {
            x: boneDensityCategories[item.x],
            y: item.value,
          };
        }),
    },
    {
      name: graftingAppliedCategories[2],
      data: correlationMatrix_2
        ?.filter((item) => item.y === 2)
        ?.map((item) => {
          return {
            x: boneDensityCategories[item.x],
            y: item.value,
          };
        }),
    },
    {
      name: graftingAppliedCategories[3],
      data: correlationMatrix_2
        ?.filter((item) => item.y === 3)
        ?.map((item) => {
          return {
            x: boneDensityCategories[item.x],
            y: item.value,
          };
        }),
    },
    {
      name: graftingAppliedCategories[4],
      data: correlationMatrix_2
        ?.filter((item) => item.y === 4)
        ?.map((item) => {
          return {
            x: boneDensityCategories[item.x],
            y: item.value,
          };
        }),
    },
    {
      name: graftingAppliedCategories[5],
      data: correlationMatrix_2
        ?.filter((item) => item.y === 5)
        ?.map((item) => {
          return {
            x: boneDensityCategories[item.x],
            y: item.value,
          };
        }),
    },
    {
      name: graftingAppliedCategories[6],
      data: correlationMatrix_2
        ?.filter((item) => item.y === 6)
        ?.map((item) => {
          return {
            x: boneDensityCategories[item.x],
            y: item.value,
          };
        }),
    },
  ];

  return (
    <Flex w="100%" h="100%" p="6">
      <Tabs w="100%" h="100%">
        <TabList color="darkBlueLogo" fontWeight="700">
          <Tab fontSize="12px" textTransform="uppercase">
            Trabecular Bone Density vs Implant Success
          </Tab>
          <Tab fontSize="12px" textTransform="uppercase">
            Number of Implants by Arch
          </Tab>
          <Tab fontSize="12px" textTransform="uppercase">
            Arch Condition at Surgery vs. Treatment Type
          </Tab>
          <Tab fontSize="12px" textTransform="uppercase">
            Trabecular Bone Density vs Grafting Applied
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Card className="mt-8 flex flex-col justify-center w-full h-auto p-4">
              <ReactApexChart
                options={heatMapOtions}
                series={heatMapSeries}
                type="bar"
                height={500}
              />
            </Card>
          </TabPanel>
          <TabPanel>
            <Card className="mt-8 flex flex-col justify-center w-full h-auto p-4">
              <ReactApexChart
                options={archTypeOptions}
                series={archTypeSeries}
                type="bar"
                height={500}
              />
            </Card>
          </TabPanel>
          <TabPanel>
            <Card className="mt-8 flex flex-col justify-center w-full h-auto p-4">
              <ReactApexChart
                options={heatMapTreatmentOptions}
                series={heatMapTreatmentSeries}
                type="bar"
              />
            </Card>
          </TabPanel>
          <TabPanel>
            <Card className="mt-8 flex flex-col justify-center w-full h-auto p-4">
              <ReactApexChart
                options={heatMapOtions_2}
                series={heatMapSeries_2}
                type="heatmap"
                height={500}
              />
            </Card>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Flex>
  );
}

export default ClinlogPreSurgical;
