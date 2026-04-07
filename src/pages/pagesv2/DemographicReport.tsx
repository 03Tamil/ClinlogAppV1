import React from "react";
//import Chart from "react-apexcharts";
import { Flex, Box, Text, SimpleGrid, Spacer } from "@chakra-ui/react";
import { Card, CardHeader, CardTitle } from "src/uicomponents/ui/card";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "src/uicomponents/ui/hover-card";
import dynamic from "next/dynamic";
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export default function DemographicReport({
  xaxis,
  entriesByMonth,
  phoneLeadsYearData,
  newLeadsInfoByMonth,
}) {
  const state = {
    options: {
      chart: {
        id: "basic-bar",
        height: 320,
        stacked: true,
      },
      plotOptions: {
        bar: {
          horizontal: false,
        },
      },
      xaxis: {
        categories: xaxis ? xaxis : [],
      },
      tooltip: {
        shared: true,
        intersect: false,
        y: {
          formatter: function (val) {
            return val;
          },
        },
      },
      legend: {
        show: false,
      },
    },
    series: [
      {
        name: "Leads",
        color: "#8febb3d9",
        data: entriesByMonth?.leads
          .map((item) => item.y)
          ?.concat(
            new Array(xaxis.length - entriesByMonth?.leads.length).fill(0)
          ),
      },
      {
        name: "Follow Ups",
        color: "#e396d9",
        data: entriesByMonth?.followUps
          .map((item) => item.y)
          ?.concat(
            new Array(xaxis.length - entriesByMonth?.followUps.length).fill(0)
          ),
      },
      {
        name: "Cold Cases",
        color: "#a7a9b0", //"#e396d9",
        data: entriesByMonth?.coldCases
          .map((item) => item.y)
          ?.concat(
            new Array(xaxis.length - entriesByMonth?.coldCases.length).fill(0)
          ),
      },
      {
        name: "Phone Leads",
        color: "#2d95ed",
        data: phoneLeadsYearData?.chartData
          ?.map((item) => item.y)
          ?.concat(
            new Array(
              xaxis?.length - phoneLeadsYearData?.chartData?.length
            ).fill(0)
          ),
      },
      {
        name: "New Leads",
        color: "#701aa3",
        data: newLeadsInfoByMonth?.newLeadsChartData
          ?.map((item) => item.y)
          ?.concat(
            new Array(
              xaxis.length - newLeadsInfoByMonth?.newLeadsChartData.length
            ).fill(0)
          ),
      },
    ],
  };

  const bgColor_chart = (name) => {
    return state?.series?.find((item) => item.name === name)?.color;
  };
  return (
    <Flex w="100%" flexDirection="column">
      <Card className="mt-8 flex flex-col justify-center w-full">
        <ReactApexChart
          options={state.options}
          series={state.series}
          type="bar"
          width="100%"
          height="320"
        />
      </Card>
      <Flex>
        <SimpleGrid columns={5} spacing={6} p={2} ml={2}>
          <HoverCard openDelay={0} closeDelay={0}>
            <HoverCardTrigger>
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle className="text-sm">
                    <Flex>
                      <Text>Website Leads </Text>
                      <Spacer />
                      <Box
                        mt={1}
                        width="12px"
                        height="12px"
                        borderRadius="50%"
                        backgroundColor={bgColor_chart("New Leads")}
                      ></Box>
                    </Flex>
                  </CardTitle>
                  <p className="text-2xl font-bold">
                    {newLeadsInfoByMonth?.newLeadsTotal}
                  </p>
                </CardHeader>
              </Card>
            </HoverCardTrigger>
            <HoverCardContent>Website Leads Captured</HoverCardContent>
          </HoverCard>
          <HoverCard openDelay={0} closeDelay={0}>
            <HoverCardTrigger>
              {" "}
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle className="text-sm">
                    <Flex>
                      <Text>Phone Leads Reported</Text> <Spacer />
                      <Box
                        ml={1}
                        mt={1}
                        width="12px"
                        height="12px"
                        borderRadius="50%"
                        backgroundColor={bgColor_chart("Phone Leads")}
                      ></Box>
                    </Flex>
                  </CardTitle>
                  <p className="text-2xl font-bold">
                    {phoneLeadsYearData?.phoneLeadsTotal}
                  </p>
                </CardHeader>
              </Card>
            </HoverCardTrigger>
            <HoverCardContent>Phone Leads Reported</HoverCardContent>
          </HoverCard>
          <HoverCard openDelay={0} closeDelay={0}>
            <HoverCardTrigger>
              {" "}
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle className="text-sm">
                    <Flex>
                      <Text>Leads Entered </Text> <Spacer />
                      <Box
                        mt={1}
                        width="12px"
                        height="12px"
                        borderRadius="50%"
                        backgroundColor={bgColor_chart("Leads")}
                      ></Box>
                    </Flex>
                  </CardTitle>
                  <p className="text-2xl font-bold">
                    {entriesByMonth.leadTotal}
                  </p>
                </CardHeader>
              </Card>
            </HoverCardTrigger>
            <HoverCardContent>Leads Entered</HoverCardContent>
          </HoverCard>
          <HoverCard openDelay={0} closeDelay={0}>
            <HoverCardTrigger>
              {" "}
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle className="text-sm">
                    <Flex>
                      <Text>In Follow Up </Text> <Spacer />
                      <Box
                        mt={1}
                        width="12px"
                        height="12px"
                        borderRadius="50%"
                        backgroundColor={bgColor_chart("Follow Ups")}
                      ></Box>
                    </Flex>
                  </CardTitle>
                  <p className="text-2xl font-bold">
                    {entriesByMonth.followUpTotal}
                  </p>
                </CardHeader>
              </Card>
            </HoverCardTrigger>
            <HoverCardContent>Currently in follow up</HoverCardContent>
          </HoverCard>
          <HoverCard openDelay={0} closeDelay={0}>
            <HoverCardTrigger>
              {" "}
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle className="text-sm">
                    {" "}
                    <Flex>
                      <Text>Cold Case </Text> <Spacer />
                      <Box
                        mt={1}
                        width="12px"
                        height="12px"
                        borderRadius="50%"
                        backgroundColor={bgColor_chart("Cold Cases")}
                      ></Box>
                    </Flex>
                  </CardTitle>
                  <p className="text-2xl font-bold">
                    {entriesByMonth.coldCaseTotal}
                  </p>
                </CardHeader>
              </Card>
            </HoverCardTrigger>
            <HoverCardContent>Cold Case</HoverCardContent>
          </HoverCard>
        </SimpleGrid>
      </Flex>
      {/* <Flex justifyContent="center" ml={4} w="20%" flexDirection="column">
        {state?.series.map((item) => (<Flex key={item.name} mt={2}>
          <Box mt={1} width="10px" height="10px" borderRadius="50%" backgroundColor={item.color}></Box>
          <Text ml={2} fontSize="13px">{item.name}</Text>
          
        </Flex>))}
        
        </Flex> */}
    </Flex>
  );
}
