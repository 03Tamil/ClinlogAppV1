import {
  Flex,
  SimpleGrid,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Spacer,
  Text,
  Box,
} from "@chakra-ui/react";
import { format, isAfter, isBefore, subMonths } from "date-fns";
import dynamic from "next/dynamic";
import React, { useMemo } from "react";
import { Card, CardHeader, CardTitle } from "src/uicomponents/ui/card";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "src/uicomponents/ui/hover-card";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export default function FollowUpReportsMarketing({
  tableEntriesQueryResult,
  session,
  date,
  xaxis,
}) {
  const entriesByMonth = useMemo(() => {
    let coldCaseCount = {};
    let followUpCount = {};
    let inactiveCount = {};

    const filteredEntries = tableEntriesQueryResult.data?.entries;

    for (const item of filteredEntries || []) {
      const leadMonth = format(
        new Date(item?.dateCreated || null),
        "MM/01/yyyy"
      );
      if (item?.recordFollowUpStatus === "coldCase") {
        coldCaseCount[leadMonth] = (coldCaseCount[leadMonth] || 0) + 1;
      }
      if (item?.recordFollowUpStatus === "followUp") {
        followUpCount[leadMonth] = (followUpCount[leadMonth] || 0) + 1;
      }
      if (item?.recordFollowUpStatus === "inactive") {
        inactiveCount[leadMonth] = (inactiveCount[leadMonth] || 0) + 1;
      }
    }

    const returnObject = {
      followUps: followUpCount,
      coldCases: coldCaseCount,
      inactive: inactiveCount,
    };

    for (const key in returnObject) {
      if (Object.hasOwnProperty.call(returnObject, key)) {
        const element = returnObject[key];
        returnObject[key] = Object.keys(element)
          .map((key) => ({
            x: key,
            y: element[key],
          }))
          .sort((a, b) => {
            if (new Date(a?.x) < new Date(b?.x)) {
              return -1;
            }
            if (new Date(a?.x) > new Date(b?.x)) {
              return 1;
            }
          });
      }
    }

    let followUpTotal = 0;
    let coldCaseTotal = 0;
    let inactiveTotal = 0;

    if (Array.isArray(returnObject.followUps)) {
      followUpTotal = returnObject.followUps.reduce(
        (acc, next) => acc + next?.y,
        0
      );
    }
    if (Array.isArray(returnObject.coldCases)) {
      coldCaseTotal = returnObject.coldCases.reduce(
        (acc, next) => acc + next?.y,
        0
      );
    }
    if (Array.isArray(returnObject.inactive)) {
      inactiveTotal = returnObject.inactive.reduce(
        (acc, next) => acc + next?.y,
        0
      );
    }
    return { ...returnObject, coldCaseTotal, followUpTotal, inactiveTotal };
  }, [tableEntriesQueryResult.data?.entries]);

  // const follow_up_state = {
  //   options: {
  //     chart: {
  //       id: "basic-bar",
  //       height: 320,
  //       stacked: true,
  //     },
  //     plotOptions: {
  //       bar: {
  //         horizontal: false,
  //       },
  //     },
  //     xaxis: {
  //       type: "category",
  //       labels: {
  //         formatter: function (value) {
  //           if (value) {
  //             const date = new Date(value);
  //             return format(date, "MMM yyyy");
  //           }
  //         },
  //       },
  //     },
  //     tooltip: {
  //       shared: true,
  //       intersect: false,
  //       y: {
  //         formatter: function (val) {
  //           return val;
  //         },
  //       },
  //     },
  //     legend: {
  //       show: false,
  //     },
  //   },
  //   series: [
  //     {
  //       name: "Follow Ups",
  //       color: "#e396d9",
  //       data: xaxis.map((item) => {
  //         const formattedKey = format(new Date(item), "MM/01/yyyy");
  //         if (
  //           entriesByMonth?.followUps?.find((lead) => lead.x === formattedKey)
  //         ) {
  //           return entriesByMonth?.followUps?.find(
  //             (lead) => lead.x === formattedKey
  //           );
  //         }
  //         return { x: formattedKey, y: 0 };
  //       }),
  //     },
  //     {
  //       name: "Cold Cases",
  //       color: "#a7a9b0",
  //       data: xaxis.map((item) => {
  //         const formattedKey = format(new Date(item), "MM/01/yyyy");
  //         if (
  //           entriesByMonth?.coldCases?.find((lead) => lead.x === formattedKey)
  //         ) {
  //           return entriesByMonth?.coldCases?.find(
  //             (lead) => lead.x === formattedKey
  //           );
  //         }
  //         return { x: formattedKey, y: 0 };
  //       }),
  //     },
  //     {
  //       name: "Inactive",
  //       color: "#f57c73", 
  //       data: xaxis.map((item) => {
  //         const formattedKey = format(new Date(item), "MM/01/yyyy");
  //         if (
  //           entriesByMonth?.inactive?.find((lead) => lead.x === formattedKey)
  //         ) {
  //           return entriesByMonth?.inactive?.find(
  //             (lead) => lead.x === formattedKey
  //           );
  //         }
  //         return { x: formattedKey, y: 0 };
  //       }),
  //     },
  //   ],
  // };

  // const bgColor_chart = (name) => {
  //   return follow_up_state?.series?.find((item) => item.name === name)?.color;
  // };
  return (
    <Flex padding="20px" h="100%" w="100%">
      <Flex minH="50vh" h="100%" w="100%">
        <Tabs w="100%">
          <TabList color="darkBlueLogo" fontWeight="700">
            <Tab fontSize="12px" textTransform="uppercase">
              Follow Up Status Report{" "}
            </Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              {/* <Card className="mt-8 flex flex-col justify-center w-full">
                <ReactApexChart
                  //@ts-ignore
                  options={follow_up_state.options}
                  //@ts-ignore
                  series={follow_up_state.series}
                  type="bar"
                  width="100%"
                  height="380"
                />
              </Card> */}
              <SimpleGrid columns={3} spacing={6} p={2} ml={2}>
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
                            //backgroundColor={bgColor_chart("Follow Ups")}
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
                            //backgroundColor={bgColor_chart("Cold Cases")}
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
                <HoverCard openDelay={0} closeDelay={0}>
                  <HoverCardTrigger>
                    {" "}
                    <Card className="shadow-md">
                      <CardHeader>
                        <CardTitle className="text-sm">
                          {" "}
                          <Flex>
                            <Text>Inactive</Text> <Spacer />
                            <Box
                              mt={1}
                              width="12px"
                              height="12px"
                              borderRadius="50%"
                            //backgroundColor={bgColor_chart("Inactive")}
                            ></Box>
                          </Flex>
                        </CardTitle>
                        <p className="text-2xl font-bold">
                          {entriesByMonth.inactiveTotal}
                        </p>
                      </CardHeader>
                    </Card>
                  </HoverCardTrigger>
                  <HoverCardContent>Inactive</HoverCardContent>
                </HoverCard>
              </SimpleGrid>
            </TabPanel>

          </TabPanels>
        </Tabs>
      </Flex>
    </Flex>
  );
}
