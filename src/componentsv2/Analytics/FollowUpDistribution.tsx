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
import {
  format,
  differenceInYears,
  differenceInDays,
  differenceInMonths,
} from "date-fns";
import { ApexOptions, use } from "apexcharts";
import { Card, CardHeader, CardTitle } from "src/uicomponents/ui/card";
import dynamic from "next/dynamic";
import { textTransform } from "@mui/system";
import { off } from "process";
import { time } from "console";
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});
function FollowUpDistribution({
  clinlogRecordDetails,

  fromReports = false,
}) {
  const followUpDistributionData = useMemo(() => {
    // const keys = ["<12", "12-18", "18-24", ">24"];
    const keys = ["<4", "4-8", "8-12", "12-18", "18-24", "24-30", ">30"];
    const result = [];
    keys.forEach((key) => {
      const groupedByFollowUp = clinlogRecordDetails?.filter((patient) => {
        const followUpMatrix = patient?.recordFollowUpMatrix?.sort(
          (a, b) =>
            new Date(b?.dateOfFollowUp).getTime() -
            new Date(a?.dateOfFollowUp).getTime(),
        )?.[0];
        const treatmentDate =
          patient?.attachedDentalCharts?.[0]?.recordTreatmentDate ||
          patient?.recordTreatmentDate;
        const timeDiff =
          patient?.recordTreatmentDate && followUpMatrix?.dateOfFollowUp
            ? differenceInMonths(
                new Date(followUpMatrix?.dateOfFollowUp),
                new Date(treatmentDate),
              )
            : 0;
        const followUpMonths =
          patient?.recordFollowUpMatrix?.length > 0
            ? Math.round(Number(followUpMatrix?.timeFromSurgery) / 30) || 0
            : -1;
        if (key === "<4") {
          return followUpMonths < 4 && timeDiff < 4;
        }
        if (key === "4-8") {
          return (
            followUpMonths >= 4 &&
            followUpMonths < 8 &&
            timeDiff >= 4 &&
            timeDiff < 8
          );
        }
        if (key === "8-12") {
          return (
            followUpMonths >= 8 &&
            followUpMonths < 12 &&
            timeDiff >= 8 &&
            timeDiff < 12
          );
        }
        // if (key === "<12") {
        //   return followUpMonths < 12 && timeDiff < 12;
        // }
        if (key === "12-18") {
          return (
            followUpMonths >= 12 &&
            followUpMonths < 18 &&
            timeDiff >= 12 &&
            timeDiff < 18
          );
        }
        if (key === "18-24") {
          return (
            followUpMonths >= 18 &&
            followUpMonths < 24 &&
            timeDiff >= 18 &&
            timeDiff < 24
          );
        }
        if (key === "24-30") {
          return (
            followUpMonths >= 24 &&
            followUpMonths < 30 &&
            timeDiff >= 24 &&
            timeDiff < 30
          );
        }
        if (key === ">30") {
          return followUpMonths >= 30 && timeDiff >= 30;
        }
        // if (key === ">70") {
        //   return followUpMonths >= 70;
        // }
        // if (key === "N/A") {
        //   return followUpMonths === -1;
        // }
      });
      const value_m = groupedByFollowUp?.filter((record) => {
        return record?.sex === "M";
      }).length;
      const value_f = groupedByFollowUp?.filter((record) => {
        return record?.sex === "F";
      }).length;

      result.push({
        x: key,
        y_m: value_m,
        y_f: value_f,
      });
    });
    return result;
  }, [clinlogRecordDetails]);

  const followUpDistribution_state: {
    options: ApexOptions;
    series: any[];
  } = useMemo(() => {
    return {
      series: [
        {
          data: followUpDistributionData.map((item) => item.y_m),
          name:
            "Male" +
            " - (" +
            followUpDistributionData.reduce((acc, item) => acc + item.y_m, 0) +
            ")",
        },
        {
          data: followUpDistributionData.map((item) => item.y_f),
          name:
            "Female" +
            " - (" +
            followUpDistributionData.reduce((acc, item) => acc + item.y_f, 0) +
            ")",
        },
        {
          name:
            "Total" +
            ": " +
            followUpDistributionData.reduce(
              (acc, item) => acc + item.y_f + item.y_m,
              0,
            ),
          data: followUpDistributionData.map((item) => item.y_f + item.y_m),
        },
      ],
      options: {
        chart: {
          id: "grouped-bar",

          toolbar: {
            show: true,
            tools: {
              download: true,
            },
          },
        },
        title: {
          text: "Follow Up Period and Sex Distribution Analysis"?.toUpperCase(),
          align: "center",
          style: {
            fontSize: fromReports ? "11px" : "13px",
            fontWeight: "700",
          },
          //floating: true
        },
        subtitle: {
          text: fromReports
            ? "Distribution Follow Up Period:"
            : "Understand the patient population demographics",
          align: "center",
          offsetY: 20,
          style: {
            fontSize: fromReports ? "11px" : "13px",
            fontWeight: "500",
            m: "0",
          },
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: "85%",
          },
        },

        legend: {
          show: true, // Show the legend
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
        stroke: {
          show: true,
          width: 1,
          colors: ["#fff"],
        },
        dataLabels: {
          enabled: false, // Show data labels

          style: {
            fontSize: "10px",
            fontWeight: "bold",
          },
        },
        xaxis: {
          categories: followUpDistributionData.map((item) => item.x),
          labels: {
            style: {
              fontSize: fromReports ? "11px" : "14px",
              fontWeight: "bold",
            },
          },
          title: {
            text: "Follow Up Period", // X-axis title
            style: {
              fontSize: fromReports ? "11px" : "14px",
              fontWeight: "bold",
            },
          },
        },
        yaxis: {
          labels: {
            style: {
              fontSize: fromReports ? "11px" : "14px",
              fontWeight: "bold",
            },
          },
          // title: {
          //   text: "Number of Cases", // Y-axis title
          //   style: {
          //     fontSize: fromReports ? "11px" : "14px",
          //     fontWeight: "bold", // Y-axis title style
          //   },
          // },
        },
      },
    };
  }, [followUpDistributionData]);

  if (fromReports) {
    return (
      <Card className="flex flex-col justify-center w-auto h-auto p-2">
        <ReactApexChart
          //@ts-ignore
          key={clinlogRecordDetails?.length + "_key"}
          options={followUpDistribution_state.options}
          series={followUpDistribution_state.series}
          //width="320"
          height={340}
          type="bar"
        />
      </Card>
    );
  } else {
    return (
      <Card className="mt-8 flex flex-col justify-center w-full h-auto p-4">
        <ReactApexChart
          //@ts-ignore
          key={clinlogRecordDetails?.length + "_key"}
          options={followUpDistribution_state.options}
          series={followUpDistribution_state.series}
          type="bar"
        />
      </Card>
    );
  }
}

export default FollowUpDistribution;
