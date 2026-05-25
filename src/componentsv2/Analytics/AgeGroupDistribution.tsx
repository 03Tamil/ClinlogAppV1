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
import { format, differenceInYears } from "date-fns";
import { Card, CardHeader, CardTitle } from "src/uicomponents/ui/card";
import dynamic from "next/dynamic";
import { textTransform } from "@mui/system";
import { off } from "process";
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});
import { ApexOptions, use } from "apexcharts";
function AgeGroupDistribution({
  clinlogRecordDetails,

  fromReports = false,
}) {
  const ageDistribution = useMemo(() => {
    const keys = ["<40", "40-50", "50-60", "60-70", ">70", "Unknown"];
    const result = [];
    keys.forEach((key) => {
      // const finalData = clinlogRecordDetails?.filter((patient) => {
      //   return (
      //     patient?.ageAtTimeOfSurgery != null &&
      //     !isNaN(patient?.ageAtTimeOfSurgery) &&
      //     patient?.ageAtTimeOfSurgery !== "" &&
      //   );
      // });
      const groupedByAge = clinlogRecordDetails?.filter((patient) => {
        // patient.age =
        //   patient?.recordDateOfBirth != null
        //     ? differenceInYears(
        //         new Date(),
        //         new Date(patient?.recordDateOfBirth)
        //       )
        //     : null;
        patient.age = Number(patient?.ageAtTimeOfSurgery);
        if (key === "Unknown") {
          return !patient.age;
        }
        if (key === "<40") {
          return patient.age < 40 && patient.age > 0;
        }
        if (key === "40-50") {
          return patient.age >= 40 && patient.age < 50;
        }
        if (key === "50-60") {
          return patient.age >= 50 && patient.age < 60;
        }
        if (key === "60-70") {
          return patient.age >= 60 && patient.age < 70;
        }
        if (key === ">70") {
          return patient.age >= 70;
        }
      });
      const value_m = groupedByAge?.filter((record) => {
        return (
          record?.sex === "M" ||
          record?.sex === "m" ||
          record?.sex === "Male" ||
          record?.sex === "male"
        );
      }).length;
      const value_f = groupedByAge?.filter((record) => {
        return (
          record?.sex === "F" ||
          record?.sex === "f" ||
          record?.sex === "Female" ||
          record?.sex === "female"
        );
      }).length;

      result.push({
        x: key,
        y_m: value_m,
        y_f: value_f,
      });
    });
    return result;
  }, [clinlogRecordDetails]);

  const ageDistribution_state: {
    options: ApexOptions;
    series: any[];
  } = useMemo(() => {
    return {
      series: [
        {
          data: ageDistribution.map((item) => item.y_m),
          name:
            "Male" +
            " - (" +
            ageDistribution.reduce((acc, item) => acc + item.y_m, 0) +
            ")",
        },
        {
          data: ageDistribution.map((item) => item.y_f),
          name:
            "Female" +
            " - (" +
            ageDistribution.reduce((acc, item) => acc + item.y_f, 0) +
            ")",
        },
        {
          name:
            "Total" +
            ": " +
            ageDistribution.reduce((acc, item) => acc + item.y_f + item.y_m, 0),
          data: ageDistribution.map((item) => item.y_f + item.y_m),
        },
      ],
      options: {
        chart: {
          id: "grouped-bar",
          type: "bar",
          toolbar: {
            show: true,
            tools: {
              download: true,
            },
          },
        },
        title: {
          text: "Age Groups and Sex Distribution Analysis"?.toUpperCase(),
          align: "center",
          style: {
            fontSize: fromReports ? "11px" : "13px",
            fontWeight: "700",
          },
          //floating: true
        },
        subtitle: {
          text: fromReports
            ? "Total Number of Cases VS Age Groups VS Sex:"
            : "Understand the patient population demographics",
          align: "center",
          offsetY: 20,
          style: {
            fontSize: fromReports ? "11px" : "13px",
            fontWeight: "500",
            //m: "0",
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
            // width: 14,
            //height: 14,
            //shape: "square",
            //radius: 0,
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
          enabled: fromReports ? false : true, // Show data labels
        },
        xaxis: {
          categories: ageDistribution.map((item) => item.x),
          labels: {
            style: {
              fontSize: fromReports ? "11px" : "14px",
              fontWeight: "bold",
            },
          },
          title: {
            text: "Age Groups", // X-axis title
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
  }, [ageDistribution, fromReports, clinlogRecordDetails]);

  if (fromReports) {
    return (
      <Card className="flex flex-col justify-center w-auto h-auto p-2">
        <ReactApexChart
          key={clinlogRecordDetails?.length + "_key"}
          options={ageDistribution_state.options}
          series={ageDistribution_state.series}
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
          key={clinlogRecordDetails?.length + "_key"}
          options={ageDistribution_state.options}
          series={ageDistribution_state.series}
          type="bar"
        />
      </Card>
    );
  }
}

export default AgeGroupDistribution;
