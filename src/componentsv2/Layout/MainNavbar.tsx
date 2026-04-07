// @ts-nocheck
import {
  chakra,
  Text,
  Button,
  Flex,
  Icon,
  Image,
  Link,
  Menu,
  MenuButton,
  Avatar,
  MenuList,
  MenuItem,
  Heading,
  MenuDivider,
  MenuOptionGroup,
  Skeleton,
  Container,
  SkeletonCircle,
  List,
  ListItem,
  Badge,
  Input,
  Spacer,
  Grid,
  GridItem,
  Box,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerBody,
  DrawerHeader,
  useDisclosure,
  IconButton,
  useBreakpointValue,
  Divider,
  DrawerFooter,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
} from "@chakra-ui/react";
import { FaWandMagicSparkles } from "react-icons/fa6";
import { MdArrowDropDown } from "react-icons/md";
import { V2Link as NextLink } from "componentsv2/Dashboard/Helpers/routerHelpers";
import { useV2Router } from "componentsv2/Dashboard/Helpers/routerHelpers";
import useQueryHook, { newLeadApiHook } from "hooks/useQueryHook";
import { mainViewerQuery, newLeadCountQuery } from "helpersv2/queries";
import { signOut, useSession } from "next-auth/react";
import {
  needToSignTermsAtom,
  newTabSettingAtom,
  primaryLocationAtom,
} from "store/store";
import { useAtom } from "jotai";
import { differenceInMinutes } from "date-fns";
import { useEffect, useState } from "react";
import {
  isAdmin,
  isBusinessManager,
  isClinicStaff,
  isPatient,
  isStaff,
} from "helpersv2/Permissions";
import {
  IoMdInformationCircleOutline,
  IoMdNotifications,
} from "react-icons/io";

import { HamburgerIcon } from "@chakra-ui/icons";
import { Divide } from "lucide-react";

import { useRouter } from "next/router";
export function MainNavbar() {
  const isBase = useBreakpointValue({ base: true, lg: false });
  const isLarge = useBreakpointValue({ base: false, xl: true });
  const router = useRouter();
  const [leadCount, setLeadCount] = useState(0);
  // Nav is disabled when user is on a page that requires them to sign all terms and conditions
  const [needToSignTerms, setNeedToSignTerms] = useAtom(needToSignTermsAtom);

  const [newTabSetting, setNewTabSettings] = useAtom(newTabSettingAtom);
  const [primaryLocation, setPrimaryLocation] = useAtom(primaryLocationAtom);
  const { status, data: session } = useSession({
    required: false,
  });

  const locationAccessArray = [186, 196, 215, 199, 160733];
  const accessToV2 = session?.locationIds?.some((id: number) =>
    locationAccessArray.includes(id),
  );
  const { isOpen, onOpen, onClose } = useDisclosure();

  const {
    isOpen: isMenuOpen,
    onOpen: onMenuOpen,
    onClose: onMenuClose,
  } = useDisclosure();
  const viewerMainNavbarResult = useQueryHook(
    ["mainViewerQuery"],
    mainViewerQuery,
    {},
  );

  //const {data, isLoading, isError} = useQuery(['leadCountQuery'], newLeadsCount);
  // const newLeadCount = newLeadApiHook(
  //   ["newLeadCount"],
  //   newLeadCountQuery,
  //   false,
  //   {}
  // );

  useEffect(() => {
    if (isMenuOpen) {
      onMenuClose();
    }
  }, [router.pathname]);

  useEffect(() => {
    if (viewerMainNavbarResult?.data?.viewer?.staffClinics?.length > 1) {
      setPrimaryLocation(
        viewerMainNavbarResult?.data?.viewer?.staffPrimaryLocation?.[0]?.id,
      );
    }
    if (viewerMainNavbarResult?.data?.viewer?.staffRecordTableOpenInNewTab) {
      setNewTabSettings(true);
    } else {
      setNewTabSettings(false);
    }
    // Check if user has signed all terms and conditions
    if (!viewerMainNavbarResult.isLoading) {
      const viewerMainNavbarResultData = viewerMainNavbarResult?.data;

      const termsAndConditionsToSignIds = [
        viewerMainNavbarResultData?.privacyPolicy?.id,
        //viewerMainNavbarResultData?.websiteTermsAndConditions?.id,
        //viewerMainNavbarResultData?.sensitiveInformationPolicy?.id,
        ...(isPatient(session?.groups)
          ? [viewerMainNavbarResultData?.patientTermsAndConditions?.id]
          : []),
        ...(isStaff(session?.groups)
          ? [viewerMainNavbarResultData?.staffTermsAndConditions?.id]
          : []),
      ];
      const viewerSiteAgreementsSignedIds =
        viewerMainNavbarResultData?.viewer?.userSiteAgreementsChecked?.map(
          (item) => item.id,
        ) ?? [];

      const needsToSign = !termsAndConditionsToSignIds.every((item) =>
        viewerSiteAgreementsSignedIds.includes(item),
      );

      if (needsToSign) {
        setNeedToSignTerms(true);
      } else {
        setNeedToSignTerms(false);
      }
    }
  }, [viewerMainNavbarResult, router]);

  const loggedIn = !!session;
  const fullName = session?.fullName ?? null;

  const viewerValues = viewerMainNavbarResult?.data?.viewer;
  const friendlyName =
    session?.fullName?.replace(/ .*/, "") ?? viewerValues?.friendlyName ?? null;
  const avatarUrl = viewerValues?.photo?.url ?? null;

  const userIsAdmin = session && isAdmin(session?.groups);
  const userIsBusinessManager = session && isBusinessManager(session?.groups);
  const userIsPatient = session && isPatient(session?.groups);
  const userIsStaff = session && isStaff(session?.groups);
  const userIsClinicStaffOrAdmin =
    session && (isClinicStaff(session?.groups) || isAdmin(session?.groups));
  const userIsClinlogOverseer =
    viewerMainNavbarResult?.data?.viewer?.isClinlogOverseer;
  const staffLinks = [
    {
      label: "Dashboard",
      href: "/pagesv2/dashboard",
      icon: "dashboard",
    },

    {
      label: "Leads",
      href: "/pagesv2/newleadinfo",
      icon: "calendar_month",
    },
    // {
    //   label: "Billing",
    //   href: "/pagesv2/billing",
    //   icon: "receipt",
    // },
    {
      label: "Patients",
      href: "/pagesv2/patienttable",
      icon: "group",
    },
    {
      label: "Scheduler",
      href: "/pagesv2/appointments_2",
      icon: "calendar_month",
    },
    // {
    //   label: "Reports",
    //   href: "/pagesv2/newleadinfo",
    //   icon: "monitoring",
    // },
    // {
    //   label: "Tasks",
    //   onClick: onOpen,
    //   icon: "task",
    // },
    {
      label: "Clinlog",
      href: "/pagesv2/clinlog",
      icon: "graph_6",
    },
  ];

  const staffLinksMapped = (
    <>
      <Link
        paddingY="10px"
        transition={"0.1s ease-in-out"}
        // _hover={{
        //   transform: "scale(1.1)",
        //   opacity: "0.7",
        // }}
        href={"/pagesv2/dashboard"}
        as={NextLink}
      >
        <Button variant={"clear"} px={"0.4rem"} hidden={needToSignTerms}>
          <Flex flexDir={"column"} alignItems={"center"} rowGap={"0.2rem"}>
            {/* <chakra.span
              fontSize={{ base: "20px", md: "32px" }}
              className="material-symbols-outlined"
            >
              dashboard
            </chakra.span> */}
            <Text
              fontSize={{ base: "15px", md: "12px", lg: "15px" }}
              textTransform={"uppercase"}
              fontWeight={700}
              fontFamily={"inter"}
              letterSpacing={"2.76px"}
              _hover={{
                borderBottom: "2px",
                borderBottomColor: "#007AFF",
              }}
            >
              Dashboard
            </Text>
          </Flex>
        </Button>
      </Link>
      <Link
        paddingY="10px"
        transition={"0.1s ease-in-out"}
        _hover={{
          transform: "scale(1.1)",
          opacity: "0.7",
        }}
        href="/pagesv2/patienttable"
        as={NextLink}
      >
        <Button variant={"clear"} px={"0.4rem"} hidden={needToSignTerms}>
          <Flex flexDir={"column"} alignItems={"center"} rowGap={"0.2rem"}>
            {/* <Icon fontSize={"32px"} as={MdOutlineSearch} /> */}
            {/* <chakra.span
              className="material-symbols-outlined"
              fontSize={{ base: "20px", md: "32px" }}
            >
              group
            </chakra.span> */}
            <Text
              fontSize={{ base: "15px", md: "12px", lg: "15px" }}
              textTransform={"uppercase"}
              fontWeight={700}
              fontFamily={"inter"}
              letterSpacing={"2.76px"}
              _hover={{
                borderBottom: "2px",
                borderBottomColor: "#007AFF",
              }}
            >
              Patients
            </Text>
          </Flex>
        </Button>
      </Link>
      {/* Button added to navigate to new lead info page */}

      {userIsClinicStaffOrAdmin && (
        <>
          <Link
            paddingY="10px"
            transition={"0.1s ease-in-out"}
            _hover={{
              transform: "scale(1.1)",
              opacity: "0.7",
            }}
            href="/pagesv2/appointments_2"
            as={NextLink}
          >
            <Button variant={"clear"} px={"0.4rem"} hidden={needToSignTerms}>
              <Flex flexDir={"column"} alignItems={"center"} rowGap={"0.2rem"}>
                {/* <Icon fontSize={"32px"} as={MdOutlineSearch} /> */}
                {/* <chakra.span
              className="material-symbols-outlined"
              fontSize={"32px"}
            >
              groups_3
            </chakra.span> */}
                {/* <chakra.span fontSize={{ base: "15px", md: "26px" }} mt="6px">
                {" "}
                <FaWandMagicSparkles />
              </chakra.span> */}

                {/* {newLeadCount?.data?.entryCount > 0 && (
                <Badge
                  position="absolute"
                  top="1"
                  right="2"
                  borderRadius="full"
                  bg="#97bf15"
                  color="white"
                  fontSize={{ base: "4px", md: "10px" }}
                  px="1"
                  py="0.5"
                >
                  {"+" + newLeadCount?.data?.entryCount}
                </Badge>
              )} */}
                <Text
                  fontSize={{ base: "15px", md: "12px", lg: "15px" }}
                  textTransform={"uppercase"}
                  fontWeight={700}
                  fontFamily={"inter"}
                  letterSpacing={"2.76px"}
                  _hover={{
                    borderBottom: "2px",
                    borderBottomColor: "#007AFF",
                  }}
                >
                  Scheduler
                </Text>
              </Flex>
            </Button>
          </Link>
          <Link
            paddingY="10px"
            transition={"0.1s ease-in-out"}
            _hover={{
              transform: "scale(1.1)",
              opacity: "0.7",
            }}
            href="/pagesv2/billing"
            as={NextLink}
          >
            <Button variant={"clear"} px={"0.4rem"} hidden={needToSignTerms}>
              <Flex flexDir={"column"} alignItems={"center"} rowGap={"0.2rem"}>
                <Text
                  fontSize={{ base: "15px", md: "12px", lg: "15px" }}
                  textTransform={"uppercase"}
                  fontFamily={"inter"}
                  letterSpacing={"2.76px"}
                  _hover={{
                    borderBottom: "2px",
                    borderBottomColor: "#007AFF",
                  }}
                >
                  Billing
                </Text>
              </Flex>
            </Button>
          </Link>
          <Link
            paddingY="10px"
            transition={"0.1s ease-in-out"}
            _hover={{
              transform: "scale(1.1)",
              opacity: "0.7",
            }}
            href="/pagesv2/newleadinfo"
            as={NextLink}
          >
            <Button variant={"clear"} px={"0.4rem"} hidden={needToSignTerms}>
              <Flex flexDir={"column"} alignItems={"center"} rowGap={"0.2rem"}>
                {/* <Icon fontSize={"32px"} as={MdOutlineSearch} /> */}
                {/* <chakra.span
              className="material-symbols-outlined"
              fontSize={"32px"}
            >
              groups_3
            </chakra.span> */}
                {/* <chakra.span fontSize={{ base: "15px", md: "26px" }} mt="6px">
                {" "}
                <FaWandMagicSparkles />
              </chakra.span> */}

                {/* {newLeadCount?.data?.entryCount > 0 && (
                <Badge
                  position="absolute"
                  top="1"
                  right="2"
                  borderRadius="full"
                  bg="#97bf15"
                  color="white"
                  fontSize={{ base: "4px", md: "10px" }}
                  px="1"
                  py="0.5"
                >
                  {"+" + newLeadCount?.data?.entryCount}
                </Badge>
              )} */}
                <Text
                  fontSize={{ base: "15px", md: "12px", lg: "15px" }}
                  textTransform={"uppercase"}
                  fontWeight={700}
                  fontFamily={"inter"}
                  letterSpacing={"2.76px"}
                  _hover={{
                    borderBottom: "2px",
                    borderBottomColor: "#007AFF",
                  }}
                >
                  Reports
                </Text>
              </Flex>
            </Button>
          </Link>
          <Link
            paddingY="10px"
            transition={"0.1s ease-in-out"}
            _hover={{
              transform: "scale(1.1)",
              opacity: "0.7",
            }}
            href="/pagesv2/clinlog"
            as={NextLink}
            target="_blank"
          >
            <Button variant={"clear"} px={"0.4rem"} hidden={needToSignTerms}>
              <Flex flexDir={"column"} alignItems={"center"} rowGap={"0.2rem"}>
                {/* <Icon fontSize={"32px"} as={MdOutlineSearch} /> */}
                {/* <chakra.span
              className="material-symbols-outlined"
              fontSize={"32px"}
            >
              groups_3
            </chakra.span> */}
                {/* <chakra.span fontSize={{ base: "15px", md: "26px" }} mt="6px">
                {" "}
                <FaWandMagicSparkles />
              </chakra.span> */}

                {/* {newLeadCount?.data?.entryCount > 0 && (
                <Badge
                  position="absolute"
                  top="1"
                  right="2"
                  borderRadius="full"
                  bg="#97bf15"
                  color="white"
                  fontSize={{ base: "4px", md: "10px" }}
                  px="1"
                  py="0.5"
                >
                  {"+" + newLeadCount?.data?.entryCount}
                </Badge>
              )} */}
                <Text
                  fontSize={{ base: "15px", md: "11px", lg: "15px" }}
                  textTransform={"uppercase"}
                  fontWeight={700}
                  fontFamily={"inter"}
                  letterSpacing={"2.76px"}
                  _hover={{
                    borderBottom: "2px",
                    borderBottomColor: "#007AFF",
                  }}
                >
                  Clinlog
                </Text>
              </Flex>
            </Button>
          </Link>
          <Flex
            paddingY="10px"
            transition={"0.1s ease-in-out"}
            _hover={{
              transform: "scale(1.1)",
              opacity: "0.7",
            }}
          >
            <Button
              variant={"clear"}
              px={"0.4rem"}
              hidden={needToSignTerms}
              onClick={() => {
                onOpen();
              }}
            >
              <Flex flexDir={"column"} alignItems={"center"} rowGap={"0.2rem"}>
                <Text
                  fontSize={{ base: "15px", md: "12px", lg: "15px" }}
                  textTransform={"uppercase"}
                  fontWeight={700}
                  fontFamily={"inter"}
                  letterSpacing={"2.76px"}
                  // _hover={{
                  //   borderBottom: "2px",
                  //   borderBottomColor: "#007AFF",
                  // }}
                >
                  Tasks
                </Text>
              </Flex>
            </Button>
          </Flex>
        </>
      )}
    </>
  );
  const staffLinksMenuMapped = (
    <List
      display={"flex"}
      flexDirection={"column"}
      gap="0.2rem"
      //h="100%"
      justifyContent={"left"}
      w="100%"
    >
      <ListItem>
        <Link
          //paddingY="10px"
          transition={"0.1s ease-in-out"}
          _hover={{
            transform: "scale(1.1)",
            opacity: "0.7",
          }}
          href={"/pagesv2/dashboard"}
          as={NextLink}
        >
          <Button
            variant={"clear"}
            px={"0.4rem"}
            hidden={needToSignTerms}
            onClick={onMenuClose}
          >
            <Flex alignItems={"center"} gap="1rem">
              <chakra.span
                fontSize={{ base: "26px", md: "32px" }}
                className="material-symbols-outlined"
                color={"#007AFF"}
              >
                dashboard
              </chakra.span>
              <Text
                fontSize={"15px"}
                textTransform={"uppercase"}
                fontWeight={700}
                fontFamily={"inter"}
                letterSpacing={"2.76px"}
              >
                Dashboard
              </Text>
            </Flex>
          </Button>
        </Link>
      </ListItem>
      <ListItem>
        <Link
          paddingY="10px"
          transition={"0.1s ease-in-out"}
          _hover={{
            transform: "scale(1.1)",
            opacity: "0.7",
          }}
          href="/pagesv2/newleadinfo"
          as={NextLink}
        >
          <Button
            variant={"clear"}
            px={"0.4rem"}
            hidden={needToSignTerms}
            onClick={onMenuClose}
          >
            <Flex alignItems={"center"} gap={"1rem"}>
              {/* <Icon fontSize={"32px"} as={MdOutlineSearch} /> */}
              <chakra.span
                className="material-symbols-outlined"
                fontSize={{ base: "26px", md: "32px" }}
                color={"#007AFF"}
              >
                group
              </chakra.span>
              <Text
                fontSize={"15px"}
                textTransform={"uppercase"}
                fontWeight={700}
                fontFamily={"inter"}
                letterSpacing={"2.76px"}
              >
                Leads
              </Text>
            </Flex>
          </Button>
        </Link>
      </ListItem>
      <ListItem>
        <Link
          paddingY="10px"
          transition={"0.1s ease-in-out"}
          _hover={{
            transform: "scale(1.1)",
            opacity: "0.7",
          }}
          href="/pagesv2/patienttable"
          as={NextLink}
        >
          <Button
            variant={"clear"}
            px={"0.4rem"}
            hidden={needToSignTerms}
            onClick={onMenuClose}
          >
            <Flex alignItems={"center"} gap={"1rem"}>
              {/* <Icon fontSize={"32px"} as={MdOutlineSearch} /> */}
              <chakra.span
                className="material-symbols-outlined"
                fontSize={{ base: "26px", md: "32px" }}
                color={"#007AFF"}
              >
                group
              </chakra.span>
              <Text
                fontSize={"15px"}
                textTransform={"uppercase"}
                fontWeight={700}
                fontFamily={"inter"}
                letterSpacing={"2.76px"}
              >
                Patients
              </Text>
            </Flex>
          </Button>
        </Link>
      </ListItem>
      {/* Button added to navigate to new lead info page */}

      {userIsClinicStaffOrAdmin && (
        <>
          <ListItem>
            <Link
              paddingY="10px"
              transition={"0.1s ease-in-out"}
              _hover={{
                transform: "scale(1.1)",
                opacity: "0.7",
              }}
              href="/pagesv2/appointments_2"
              as={NextLink}
            >
              <Button
                variant={"clear"}
                px={"0.4rem"}
                hidden={needToSignTerms}
                onClick={onMenuClose}
              >
                <Flex alignItems={"center"} gap="1rem">
                  {/* <Icon fontSize={"32px"} as={MdOutlineSearch} /> */}
                  <chakra.span
                    className="material-symbols-outlined"
                    fontSize={"26px"}
                    color={"#007AFF"}
                  >
                    calendar_month
                  </chakra.span>
                  {/* <chakra.span fontSize={{ base: "15px", md: "26px" }} mt="6px">
                {" "}
                <FaWandMagicSparkles />
              </chakra.span> */}

                  {/* {newLeadCount?.data?.entryCount > 0 && (
                <Badge
                  position="absolute"
                  top="1"
                  right="2"
                  borderRadius="full"
                  bg="#97bf15"
                  color="white"
                  fontSize={{ base: "4px", md: "10px" }}
                  px="1"
                  py="0.5"
                >
                  {"+" + newLeadCount?.data?.entryCount}
                </Badge>
              )} */}
                  <Text
                    fontSize={"15px"}
                    textTransform={"uppercase"}
                    fontWeight={700}
                    fontFamily={"inter"}
                    letterSpacing={"2.76px"}
                  >
                    Scheduler
                  </Text>
                </Flex>
              </Button>
            </Link>
          </ListItem>
          {/* <ListItem>
            <Link
              paddingY="10px"
              transition={"0.1s ease-in-out"}
              _hover={{
                transform: "scale(1.1)",
                opacity: "0.7",
              }}
              href="/pagesv2/billing"
              as={NextLink}
            >
              <Button
                variant={"clear"}
                px={"0.4rem"}
                hidden={needToSignTerms}
                onClick={onMenuClose}
              >
                <Flex alignItems={"center"} gap="1rem">
                  <chakra.span
                    className="material-symbols-outlined"
                    fontSize={"26px"}
                    color={"#007AFF"}
                  >
                    receipt
                  </chakra.span>
                  <Text
                    fontSize={"15px"}
                    textTransform={"uppercase"}
                    fontFamily={"inter"}
                    letterSpacing={"2.76px"}
                    fontWeight={700}
                  >
                    Billing
                  </Text>
                </Flex>
              </Button>
            </Link>
          </ListItem> */}
          {/* <ListItem>
            <Link
              paddingY="10px"
              transition={"0.1s ease-in-out"}
              _hover={{
                transform: "scale(1.1)",
                opacity: "0.7",
              }}
              href="/pagesv2/newleadinfo"
              as={NextLink}
            >
              <Button
                variant={"clear"}
                px={"0.4rem"}
                hidden={needToSignTerms}
                onClick={onMenuClose}
              >
                <Flex alignItems={"center"} gap={"1rem"}>
                  <chakra.span
                    className="material-symbols-outlined"
                    fontSize={"26px"}
                    color={"#007AFF"}
                  >
                    monitoring
                  </chakra.span>

                  <Text
                    fontSize={"15px"}
                    textTransform={"uppercase"}
                    fontWeight={700}
                    fontFamily={"inter"}
                    letterSpacing={"2.76px"}
                  >
                    Reports
                  </Text>
                </Flex>
              </Button>
            </Link>
          </ListItem> */}
          {userIsClinlogOverseer && (
            <ListItem>
              <Link
                paddingY="10px"
                transition={"0.1s ease-in-out"}
                _hover={{
                  transform: "scale(1.1)",
                  opacity: "0.7",
                }}
                href="/pagesv2/clinlog"
                as={NextLink}
                target="_blank"
              >
                <Button
                  variant={"clear"}
                  px={"0.4rem"}
                  hidden={needToSignTerms}
                  onClick={onMenuClose}
                >
                  <Flex alignItems={"center"} gap={"1rem"}>
                    <chakra.span
                      className="material-symbols-outlined"
                      fontSize={"26px"}
                      color={"#007AFF"}
                    >
                      graph_6
                    </chakra.span>

                    <Text
                      fontSize={"15px"}
                      textTransform={"uppercase"}
                      fontWeight={700}
                      fontFamily={"inter"}
                      letterSpacing={"2.76px"}
                    >
                      Clinlog
                    </Text>
                  </Flex>
                </Button>
              </Link>
            </ListItem>
          )}
          {/* <ListItem>
            <Link
              paddingY="10px"
              transition={"0.1s ease-in-out"}
              _hover={{
                transform: "scale(1.1)",
                opacity: "0.7",
              }}
            >
              <Button
                variant={"clear"}
                px={"0.4rem"}
                hidden={needToSignTerms}
                onClick={() => {
                  onOpen();
                  onMenuClose();
                }}
              >
                <Flex alignItems={"center"} gap={"1rem"}>
                  <chakra.span
                    className="material-symbols-outlined"
                    fontSize={"26px"}
                    color={"#007AFF"}
                  >
                    task
                  </chakra.span>
                  <Text
                    fontSize={"15px"}
                    textTransform={"uppercase"}
                    fontWeight={700}
                    fontFamily={"inter"}
                  >
                    Tasks
                  </Text>
                </Flex>
              </Button>
            </Link>
          </ListItem> */}
        </>
      )}
    </List>
  );
  const adminRole = session?.groups?.includes("Admin") ? ["Admin"] : [];
  const detectDevice = () => {
    const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    const width = window.innerWidth;

    if (isTouch && width > 767 && width <= 1024) return "Tablet";
    if (isTouch && width <= 767) return "Mobile";
    return "Desktop";
  };

  const patientClinics =
    viewerValues?.userLocation.map(
      (location, i) => location.locationOtherName,
    ) ?? [];
  const staffClinics =
    viewerValues?.staffClinics.map(
      (location, i) => location.locationOtherName,
    ) ?? [];
  const anaesthetistMass =
    viewerValues?.anaesthetistMass.map((mass, i) => mass.title) ?? [];
  const technicianLaboratories =
    viewerValues?.technicianLaboratories.map(
      (laboratory, i) => laboratory.title,
    ) ?? [];

  // We could list all role locations but since the only users that have multiple role types are admins we just use one
  const allUserLocations = adminRole ??
    patientClinics ??
    staffClinics ??
    anaesthetistMass ??
    technicianLaboratories ?? ["No Location"];

  // useEffect(() => {
  //   if (loggedIn) {
  //     const deviceType = detectDevice();
  //     if (deviceType === "Tablet") {
  //       alert(
  //         "please rotate your device to landscape mode for better experience"
  //       );
  //     }
  //   }
  // }, [loggedIn, router]);

  return (
    <Flex
      background="linear-gradient(90deg, var(--clinlog-purple, #452A7E) 25%, #612ECC 100%)"
      height={"77px"}
      align="center"
      justify={"center"}
      w="100%"
      p="2"
    >
      <Flex
        w="100%"
        maxW={{ base: "100%", lg: "2000px" }}
        align="center"
        justify={"space-between"}
      >
        <Flex
          align="center"
          w="100%"
          cursor="pointer"
          onClick={() => {
            router.push("/pagesv2/clinlog");
          }}
        >
          <Image
            src="../../clinlog_icon.svg"
            alt="CLINLOG"
            width={"36px"}
            height="39px"
          />
          <Text
            fontSize={"30px"}
            fontWeight="700"
            color="#F1EFE0"
            marginLeft={"12px"}
            fontFamily="Avenir"
            letterSpacing={"1.24px"}
          >
            clinlog
          </Text>
          <Text fontSize={"11px"} fontWeight="800" color="#F1EFE0" mb="3">
            ®
          </Text>
        </Flex>
        <Spacer />
        <Flex
          align={"center"}
          gap={"1rem"}
          h="100%"
          display={{ base: "none", lg: "flex" }}
          zIndex="100"
        >
          <Menu>
            <Skeleton isLoaded={session !== undefined}>
              <MenuButton
                as={Button}
                color={"xlDarkBlueLogo"}
                bg="none"
                border="none"
                h="100%"
                columnGap={"0px"}
                borderRadius={"full"}
                _hover={{
                  color: "white",
                  border: "none",
                  transform: "scale(1.1)",
                  bgColor: "none",
                }}
                _active={{
                  bgColor: "none",
                }}
                padding="0px"
              >
                <SkeletonCircle
                  isLoaded={viewerValues}
                  alignContent={"center"}
                  w="100%"
                  h="100%"
                >
                  <Avatar
                    borderRadius={"full"}
                    borderWidth="2px"
                    borderColor="white"
                    backgroundColor="white"
                    fontWeight={"700"}
                    color="#452A7E"
                    name={session?.fullName}
                    src={viewerValues?.photo?.url}
                    size={{ base: "sm", md: "xs", xl: "sm" }}
                    height="48px"
                    width="48px"
                  />
                </SkeletonCircle>
              </MenuButton>
              <MenuList padding={"1.5rem"} color="black">
                <Flex align="center" mb="10px">
                  <Avatar
                    name={session?.fullName}
                    src={viewerValues?.photo?.url}
                    size={"md"}
                  />
                  <Flex direction={"column"} ml="10px">
                    <Heading size={"sm"} noOfLines={1}>
                      {session?.fullName}
                    </Heading>
                    <Text
                      fontSize={"sm"}
                      display={{ base: "none", lg: "block" }}
                    ></Text>
                  </Flex>
                </Flex>
                <MenuDivider />

                <Link
                  paddingY="10px"
                  _hover={{
                    transform: "scale(1.1)",
                    bgColor: "gray.200",
                  }}
                  href={"/pagesv2/account/support-ticket"}
                  as={NextLink}
                >
                  <MenuItem
                    icon={
                      <chakra.span className="material-symbols-outlined">
                        support
                      </chakra.span>
                    }
                  >
                    <Text fontWeight="500">
                      {" "}
                      {`${session && isAdmin ? `(Staff) ` : ``}Support Ticket`}
                    </Text>
                  </MenuItem>
                </Link>
                {/* <MenuDivider /> */}
                {/* <Link
                      paddingY="10px"
                      _hover={{
                        transform: "scale(1.1)",
                        bgColor: "gray.200",
                      }}
                      href={"/"}
                      target="_blank"
                      as={NextLink}
                    >
                      <MenuItem>
                        <Image
                          src="../../sc_icon.svg"
                          alt="CLINLOG"
                          width={"28px"}
                          height="22px"
                          mr="3"
                        />{" "}
                        <Text fontWeight="500">SmileConnect®</Text>
                      </MenuItem>
                    </Link> */}

                <MenuDivider />
                <MenuItem
                  icon={
                    <chakra.span className="material-symbols-outlined">
                      logout
                    </chakra.span>
                  }
                  onClick={() => router.push("/pagesv2/signout/")}
                >
                  Log Out
                </MenuItem>
              </MenuList>
            </Skeleton>
          </Menu>
        </Flex>
      </Flex>
    </Flex>
  );
}
