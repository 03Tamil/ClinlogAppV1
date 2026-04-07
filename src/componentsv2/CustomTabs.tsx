import {
  Tabs,
  TabList,
  TabPanels,
  TabPanel,
  Tab,
  Flex,
} from "@chakra-ui/react";
import { Fallback } from "helpersv2/Fallback";
import { useAtom } from "jotai";
import { useV2Router } from "componentsv2/Dashboard/Helpers/routerHelpers";
import { useEffect, useRef } from "react";
import { ErrorBoundary } from "react-error-boundary";
import {
  dashboardTabPageAtom,
  treatmentProposalTabPageAtom,
} from "store/store";

type TabProps = {
  tabs: any[];
  fullyLoaded?: boolean;
  customTabsRef?: any;
};

export default function CustomTabs({ tabs, customTabsRef }: TabProps) {
  const router = useV2Router();
  const isDashboard = router.pathname === "/dashboard";
  const [treatmentProposalTabPage, setTreatmentProposalTabPage] = useAtom(
    treatmentProposalTabPageAtom
  );
  const [dashboardTabPage, setDashboardTabPage] = useAtom(dashboardTabPageAtom);

  const handleTabsChange = (index) => {
    if (isDashboard) {
      setDashboardTabPage(index);
    } else {
      setTreatmentProposalTabPage(index);
    }
  };

  // if (tabs) {
  //   return null
  // }
  return (
    <Flex height={"100%"} width={"100%"} flexDirection={"column"}>
      <Tabs
        height={"100%"}
        w="100%"
        display="flex"
        flexDirection="column"
        variant="enclosed"
        /* pb="10px" */
        /* overflow="hidden" */
        onChange={handleTabsChange}
        index={isDashboard ? dashboardTabPage : treatmentProposalTabPage}
        ref={customTabsRef}
      >
        <TabList
          w="100%"
          /* position="sticky" */
          zIndex="1001"
          top="0"
          bgColor="lightBlueLogo"
          overflowX={{ base: "scroll", lg: "initial" }}
        >
          {tabs.map((tab, index) => (
            <Tab
              _selected={{
                color: "#0F1F65",
                borderBottomColor: "white",
                borderRightColor: "gray.200",
                borderLeftColor: "gray.200",
                borderTopColor: "gray.200",
                bgColor: "white",
              }}
              fontSize={{ base: "10px", md: "16px" }}
              fontWeight="700"
              letterSpacing="1.5px"
              fontFamily="Inter"
              textTransform="uppercase"
              key={index}
            >
              {tab.label}
            </Tab>
          ))}
        </TabList>
        <TabPanels
          bgColor="white"
          border={"#E2E8F0 solid 1px"}
          borderTop={"none"}
          height={"100%"}
          //overflowY={isDashboard ? "scroll" : "auto"}
        >
          {tabs.map((tab, index) => (
            <TabPanel p="10px" key={index}>
              <ErrorBoundary
                FallbackComponent={(error, resetErrorBoundary) => (
                  <Fallback
                    error={error}
                    resetErrorBoundary={resetErrorBoundary}
                    customMessage={`Error with ${tab.label} tab`}
                  />
                )}
              >
                {tab.content}
              </ErrorBoundary>
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>
    </Flex>
  );
}
