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
import AgeGroupDistribution from "./AgeGroupDistribution";
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});
import { ApexOptions } from "apexcharts";

export type demographicsProps = {
  clinlogRecordDetails: any;
  xaxis: any;
  fromReports?: boolean;
};
function ClinlogDemoGraphics({
  clinlogRecordDetails,
  xaxis,
  fromReports = false,
}: demographicsProps) {
  const groupedData = useMemo(
    () =>
      clinlogRecordDetails?.reduce((result, patient) => {
        //const dateCreated = format(new Date(patient.dateCreated), "MMM yyyy");
        const dateCreated = format(
          new Date(patient.recordTreatmentDate),
          "MMM yyyy",
        );
        if (!result[dateCreated]) {
          result[dateCreated] = {};
        }
        if (
          !result[dateCreated]["allPatients"] &&
          !result[dateCreated]["female"] &&
          !result[dateCreated]["male"]
        ) {
          result[dateCreated]["allPatients"] = 0;
          result[dateCreated]["female"] = 0;
          result[dateCreated]["male"] = 0;
        }

        if (result[dateCreated]) {
          result[dateCreated]["allPatients"]++;
        }
        if (patient.sex === "F") {
          result[dateCreated]["female"]++;
        }
        if (patient.sex === "M") {
          result[dateCreated]["male"]++;
        }
        return result;
      }, {}),
    [clinlogRecordDetails],
  );
  const group_fields = [
    {
      key: "generalDetails",
      label: "General Details",
    },
    {
      key: "patientCharacteristics",
      label: "Patient Characteristics",
    },
    {
      key: "treatmentCharacteristics",
      label: "Treatment Characteristics",
    },
    {
      key: "followUp",
      label: "Follow Up",
    },
    {
      key: "siteSpecific",
      label: "Site-Specific Characteristics",
    },
  ];
  const clinlogFields = [
    {
      group: "generalDetails",
      key: "sex",
      label: "Sex",
      options: ["M", "F", "Unknown"],
    },
    {
      group: "generalDetails",
      key: "arch",
      label: "Arch",
      options: ["Upper", "Lower"],
    },
    {
      group: "generalDetails",
      key: "treatment",
      label: "Treatment",
      options: [
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
      ],
    },
  ];
  const [selectedGroupField, setSelectedGroupField] = useState("");
  const [selectedField, setSelectedField] = useState("");

  const clinlogPatientsChartData = useMemo(() => {
    if (groupedData) {
      const allPatientsArray = Object.keys(groupedData)?.map((key) => ({
        x: key,
        y: groupedData[key]["allPatients"],
      }));
      const femalePatientsArray = Object.keys(groupedData)?.map((key) => ({
        x: key,
        y: groupedData[key]["female"],
      }));
      const malePatientsArray = Object.keys(groupedData)?.map((key) => ({
        x: key,
        y: groupedData[key]["male"],
      }));
      return {
        allPatientsArray,
        femalePatientsArray,
        malePatientsArray,
      };
    } else {
      return {
        allPatientsArray: [],
        femalePatientsArray: [],
        malePatientsArray: [],
      };
    }
  }, [groupedData]);
  const ageDistribution = useMemo(() => {
    const keys = ["<40", "40-50", "50-60", "60-70", ">70", "Unknown"];
    const result = [];
    keys.forEach((key) => {
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
          return patient.age < 40;
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
        return record?.sex === "M";
      }).length;
      const value_f = groupedByAge?.filter((record) => {
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

  const diabetes_osteoporosis_options = [
    "Diabetes",
    "Osteoporosis",
    "Diabetes + Osteoporosis",
    "None",
  ];
  const diabetes_osteoporosis_data = useMemo(() => {
    const result = [];
    diabetes_osteoporosis_options.forEach((key) => {
      const value = clinlogRecordDetails?.filter((record) => {
        if (key === "Diabetes") {
          return record.diabetesAndOsteoporosis === "Diabetes";
        }
        if (key === "Osteoporosis") {
          return record.diabetesAndOsteoporosis === "Osteoporosis";
        }
        if (key === "Diabetes + Osteoporosis") {
          return record.diabetesAndOsteoporosis === "Diabetes + Osteoporosis";
        }
        if (key === "None") {
          return (
            record.diabetesAndOsteoporosis === "None" ||
            record.diabetesAndOsteoporosis === null
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
  const alcohol_consumption_options = [
    "Unknown",
    "Never",
    "Occasionally/Socially",
    "2-4 Times per Week",
    "Daily",
  ];

  const alcohol_consumption_data = useMemo(() => {
    const result = [];
    alcohol_consumption_options.forEach((key) => {
      const value = clinlogRecordDetails?.filter((record) => {
        if (key === "Unknown") {
          return (
            record.alcohol === null ||
            record.alcohol === "Unknown" ||
            record.alcohol === ""
          );
        }
        if (key === "Never") {
          return record.alcohol === "I don’t drink Alcohol";
        }
        if (key === "Occasionally/Socially") {
          return record.alcohol === "I drink occasionally or socially only";
        }
        if (key === "2-4 Times per Week") {
          return record.alcohol === "I drink 2-4 standard drinks per week";
        }
        if (key === "Daily") {
          return record.alcohol === "I drink daily";
        }
      }).length;
      result.push({
        x: key,
        y: value,
      });
    });
    return result;
  }, [clinlogRecordDetails]);

  const smoking_options = ["Yes, Heavy", "Yes", "No", "Unknown"];
  const smoking_data = useMemo(() => {
    const result = [];
    smoking_options.forEach((key) => {
      const value = clinlogRecordDetails?.filter((record) => {
        if (key === "Unknown") {
          return (
            record.smoking === null ||
            record.smoking === "" ||
            record.smoking === "unknown"
          );
        }
        if (key === "Yes, Heavy") {
          return record.smoking === "I smoke daily";
        }
        if (key === "Yes") {
          return record.smoking === "I smoke occasionally or socially only";
        }
        if (key === "No") {
          return record.smoking === "I don’t smoke";
        }
      }).length;
      result.push({
        x: key,
        y: value,
      });
    });
    return result;
  }, [clinlogRecordDetails]);

  const hygiene_options = [
    "Excellent",
    "Reasonable",
    "Poor",
    "Very Poor",
    "Unknown",
  ];
  const oral_hygiene_data = useMemo(() => {
    const result = [];
    hygiene_options.forEach((key) => {
      const value = clinlogRecordDetails?.filter((record) => {
        if (key === "Unknown") {
          return record.oral_hygiene === null || record.oral_hygiene === "";
        }
        if (key === "Excellent") {
          return record.oral_hygiene === "Excellent";
        }
        if (key === "Reasonable") {
          return record.oral_hygiene === "Reasonable";
        }
        if (key === "Poor") {
          return record.oral_hygiene === "Poor";
        }
        if (key === "Very Poor") {
          return record.oral_hygiene === "Very Poor";
        }
      }).length;
      result.push({
        x: key,
        y: value,
      });
    });
    return result;
  }, [clinlogRecordDetails]);
  const diagnosisAetiology_options = [
    "Trauma",
    "Caries",
    "Gum Disease",
    "Occlusal Wear or Trauma",
    "Unknown Or Other",
  ];
  const diagnosisAetiology_data = useMemo(() => {
    const result = [];
    diagnosisAetiology_options.forEach((key) => {
      const value = clinlogRecordDetails?.filter((record) => {
        if (key === "Unknown Or Other") {
          return (
            record.diagnosisOrAetiology === null ||
            record.diagnosisOrAetiology === "" ||
            record.diagnosisOrAetiology === "unknownOrOther"
          );
        }
        if (key === "Trauma") {
          return record.diagnosisOrAetiology === "Trauma";
        }
        if (key === "Caries") {
          return record.diagnosisOrAetiology === "Caries";
        }
        if (key === "Gum Disease") {
          return record.diagnosisOrAetiology === "Gum Disease";
        }
        if (key === "Occlusal Wear or Trauma") {
          return record.diagnosisOrAetiology === "Occlusal Wear or Trauma";
        }
      }).length;
      result.push({
        x: key,
        y: value,
      });
    });
    return result;
  }, [clinlogRecordDetails]);
  // const reactApexChart_data = useMemo(() => {
  //   const options = clinlogFields?.filter(
  //     (field) => field.name === selectedField
  //   )[0]?.options;
  //   const result = [];
  //   const fieldName =
  //     selectedField === "medical" ? "diabetes_and_osteoporosis" : selectedField;

  //   if (clinlogPatients.some((record) => fieldName in record)) {
  //     options?.forEach((key) => {
  //       const value = clinlogPatients?.filter((record) => {
  //         return record[fieldName] === key;
  //       }).length;
  //       result.push({
  //         x: key,
  //         y: value,
  //       });
  //     });
  //   } else if (clinlogRecordDetails?.some((record) => fieldName in record)) {
  //     options?.forEach((key) => {
  //       const value = clinlogRecordDetails?.filter((record) => {
  //         return record[fieldName] === key;
  //       }).length;
  //       result.push({
  //         x: key,
  //         y: value,
  //       });
  //     });
  //   }
  //   return result;
  // }, [selectedField]);

  // const group_fields = useMemo(() => {
  //   const groupFields = new Set();
  //   const fieldsArray = clinlogFields?.map((field) => {
  //     return {
  //       key: field.group_field,
  //       label: field.group_field.split("_").join(" ").toUpperCase(),
  //     };
  //   });
  //   const result = fieldsArray?.filter((item) => {
  //     const value = item["key"];
  //     if (groupFields.has(value)) {
  //       return false;
  //     }
  //     groupFields.add(value);
  //     return true;
  //   });
  //   return result;
  // }, [clinlogFields]);

  const allpatients_state: {
    options: ApexOptions;
    series: any[];
  } = useMemo(() => {
    return {
      options: {
        chart: {
          id: "line-chart",
        },
        legend: {
          show: false,
        },
        title: {
          text: "Surgical Volume Over Time Analysis"?.toUpperCase(),
          align: "center",
          style: {
            fontSize: "13px",
            align: "center",
            fontWeight: "700",
          },
          //floating: true
        },
        subtitle: {
          text: "Track the number of surgeries performed monthly/annually.",
          align: "center",
          style: {
            fontSize: "13px",
            fontWeight: "500",
            align: "center",
          },
        },
        xaxis: {
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
            text: "Number of Surgeries", // X-axis title
            style: {
              fontSize: "14px",
              fontWeight: "bold",
            },
          },
        },
      },
      series: [
        {
          name: "Number of Surgeries",
          color: "#34eba1",
          data: xaxis.map((item) => {
            //const formattedKey = format(new Date(item), "MM/01/yyyy");
            if (
              clinlogPatientsChartData?.allPatientsArray?.find(
                (e) => e.x === item,
              )
            ) {
              return clinlogPatientsChartData?.allPatientsArray?.find(
                (e) => e.x === item,
              );
            }
            return { x: item, y: 0 };
          }),
        },
        // {
        //   name: "Female",
        //   color: "#ed7ec4",
        //   data: xaxis?.map((item) => {
        //     //const formattedKey = format(new Date(item), "MM/01/yyyy");
        //     if (
        //       clinlogPatientsChartData?.femalePatientsArray?.find(
        //         (e) => e.x === item
        //       )
        //     ) {
        //       return clinlogPatientsChartData?.femalePatientsArray?.find(
        //         (e) => e.x === item
        //       );
        //     }
        //     return { x: item, y: 0 };
        //   }),
        // },
        // {
        //   name: "Male",
        //   color: "#7ec8ed",
        //   data: xaxis?.map((item) => {
        //     //const formattedKey = format(new Date(item), "MM/01/yyyy");
        //     if (
        //       clinlogPatientsChartData?.malePatientsArray?.find(
        //         (e) => e.x === item
        //       )
        //     ) {
        //       return clinlogPatientsChartData?.malePatientsArray?.find(
        //         (e) => e.x === item
        //       );
        //     }
        //     return { x: item, y: 0 };
        //   }),
        // },
      ],
    };
  }, [clinlogPatientsChartData]);
  // const ageDistribution_state ={
  //   series: ageDistribution.map((item) => item.y),
  //   options: {
  //     chart: {
  //       width: 380,
  //       type: 'pie',
  //     },
  //     labels: ageDistribution.map((item) => item.x),
  //       responsive: [{
  //       breakpoint: 480,
  //       options: {
  //         chart: {
  //           width: 200
  //         },
  //         legend: {
  //           position: 'bottom'
  //         }
  //       }
  //     }]
  //   },
  // }

  const ageDistribution_state: {
    options: ApexOptions;
    series: any[];
  } = {
    series: [
      { data: ageDistribution.map((item) => item.y_m), name: "Male" },
      { data: ageDistribution.map((item) => item.y_f), name: "Female" },
    ],
    options: {
      chart: {
        id: "grouped-bar",
      },
      title: {
        text: "Age Groups and Sex Distribution Analysis"?.toUpperCase(),
        align: "center",
        style: {
          fontSize: fromReports ? "10px" : "13px",
          fontWeight: "700",
        },
        //floating: true
      },
      subtitle: {
        text: "Understand the patient population demographics",
        align: "center",
        style: {
          fontSize: fromReports ? "10px" : "13px",
          fontWeight: "500",
          //m: "0",
        },
      },
      plotOptions: {
        bar: {
          horizontal: false,
        },
      },
      labels: [...ageDistribution.map((item) => item.x)],
      legend: {
        show: true, // Show the legend
        position: "right",
        offsetY: 100,
        offsetX: 0,
        floating: false,
        markers: {
          // width: 14,
          // height: 14,
          //shape: "square",
          // radius: 0,
          offsetX: -2,
          offsetY: 2,
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
            fontSize: fromReports ? "10px" : "14px",
            fontWeight: "bold",
          },
        },
        title: {
          text: "Age Groups", // X-axis title
          style: {
            fontSize: fromReports ? "10px" : "14px",
            fontWeight: "bold",
          },
        },
      },
      yaxis: {
        labels: {
          style: {
            fontSize: fromReports ? "10px" : "14px",
            fontWeight: "bold",
          },
        },
        title: {
          text: "Number of Cases", // Y-axis title
          style: {
            fontSize: fromReports ? "10px" : "14px",
            fontWeight: "bold", // Y-axis title style
          },
        },
      },
    },
  };

  const diagnosisAetiology_state: {
    options: ApexOptions;
    series: any[];
  } = {
    series: diagnosisAetiology_data?.map((item) => item.y),
    options: {
      chart: {
        id: "pie-chart_da",
      },
      title: {
        text: "Diagnosis/Aetiology Distribution Analysis"?.toUpperCase(),
        align: "center",
        style: {
          fontSize: "13px",
          fontWeight: "700",
        },
        //floating: true
      },
      subtitle: {
        text: "Identify the most common diagnoses leading to treatment.",
        align: "center",
        style: {
          fontSize: "13px",
          fontWeight: "500",
        },
      },
      legend: {
        show: true,
        position: "bottom",
        horizontalAlign: "center",
        //floating: true,
      },

      labels: diagnosisAetiology_data?.map((item) => item.x),
    },
  };

  return (
    <Flex w="100%" h="100%" p="6">
      <Tabs w="100%" h="100%">
        <TabList color="darkBlueLogo" fontWeight="700">
          <Tab fontSize="12px" textTransform="uppercase">
            Age Groups and Sex Distribution
          </Tab>
          <Tab fontSize="12px" textTransform="uppercase">
            Surgical Volume Over Time{" "}
          </Tab>
          <Tab fontSize="12px" textTransform="uppercase">
            Diagnosis/Aetiology Distribution
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel w="100%" h="100%">
            <AgeGroupDistribution clinlogRecordDetails={clinlogRecordDetails} />
          </TabPanel>
          <TabPanel>
            <Card className="mt-8 flex flex-col justify-center w-full h-auto p-4">
              <ReactApexChart
                options={allpatients_state.options}
                series={allpatients_state.series}
                type="area"
              />
            </Card>
          </TabPanel>
          <TabPanel>
            <Card className="mt-8 flex flex-col justify-center w-full h-auto p-4">
              <ReactApexChart
                options={diagnosisAetiology_state.options}
                series={diagnosisAetiology_state.series}
                type="pie"
                height="420"
              />
            </Card>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Flex>
  );
}

export default ClinlogDemoGraphics;
