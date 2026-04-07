//@ts-nocheck
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
} from "@chakra-ui/react";
import { FaWandMagicSparkles } from "react-icons/fa6";
import { MdArrowDropDown } from "react-icons/md";
import NextLink from "next/link";
import { useRouter } from "next/router";
import useQueryHook, { newLeadApiHook } from "hooks/useQueryHook";
import { mainViewerQuery, newLeadCountQuery } from "helpers/queries";
import { signOut, useSession } from "next-auth/react";
import { logger } from "../../utils/logger";
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
  isOverseer,
  isPatient,
  isStaff,
} from "helpers/Permissions";
import { getCookie } from "cookies-next";

export function MainNavbar({}) {
  //const apiTokens = pageProps;
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
  //   {},
  //   apiTokens,
  //   {}
  // );
  const [hasCookie, setHasCookie] = useState(null);
  useEffect(() => {
    const cookie = getCookie("announcements");
    if (!!cookie) {
      setHasCookie(true);
    } else {
      setHasCookie(false);
    }
  }, []);

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

  const loggedIn = !!session ?? false;
  const fullName = session?.fullName ?? null;

  const viewerValues = viewerMainNavbarResult?.data?.viewer;
  const friendlyName =
    session?.fullName?.replace(/ .*/, "") ?? viewerValues?.friendlyName ?? null;
  const avatarUrl = viewerValues?.photo?.url ?? null;

  const userIsAdmin = session && isAdmin(session?.groups);
  const userIsBusinessManager = session && isBusinessManager(session?.groups);
  const userIsPatient = session && isPatient(session?.groups);
  const userIsStaff = session && isStaff(session?.groups);
  const userIsOverseer = session && isOverseer(session?.groups);
  const userIsClinicStaffOrAdmin =
    session && (isClinicStaff(session?.groups) || isAdmin(session?.groups));
  const userShouldUseV2 = session && session?.locationIds?.includes(186);
  const staffLinks = (
    <>
      <Link
        paddingY="10px"
        transition={"0.1s ease-in-out"}
        _hover={{
          transform: "scale(1.1)",
          opacity: "0.7",
        }}
        href={"/dashboard"}
        as={NextLink}
      >
        <Button variant={"clear"} px={"0.4rem"} hidden={needToSignTerms}>
          <Flex flexDir={"column"} alignItems={"center"} rowGap={"0.2rem"}>
            <chakra.span
              fontSize={{ base: "20px", md: "32px" }}
              className="material-symbols-outlined"
            >
              dashboard
            </chakra.span>
            <Text
              fontSize={{ base: "8px", md: "12px" }}
              textTransform={"uppercase"}
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
        href="/table"
        as={NextLink}
      >
        <Button variant={"clear"} px={"0.4rem"} hidden={needToSignTerms}>
          <Flex flexDir={"column"} alignItems={"center"} rowGap={"0.2rem"}>
            {/* <Icon fontSize={"32px"} as={MdOutlineSearch} /> */}
            <chakra.span
              className="material-symbols-outlined"
              fontSize={{ base: "20px", md: "32px" }}
            >
              group
            </chakra.span>
            <Text
              fontSize={{ base: "8px", md: "12px" }}
              textTransform={"uppercase"}
            >
              Patients
            </Text>
          </Flex>
        </Button>
      </Link>
      {/* Button added to navigate to new lead info page */}

      {userIsClinicStaffOrAdmin && (
        <Link
          paddingY="10px"
          transition={"0.1s ease-in-out"}
          _hover={{
            transform: "scale(1.1)",
            opacity: "0.7",
          }}
          href={userShouldUseV2 ? "/pagesv2/newleadinfo" : "/newleadinfo"}
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
              <chakra.span fontSize={{ base: "15px", md: "26px" }} mt="6px">
                {" "}
                <FaWandMagicSparkles />
              </chakra.span>

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
                fontSize={{ base: "8px", md: "12px" }}
                textTransform={"uppercase"}
              >
                New Leads
              </Text>
            </Flex>
          </Button>
        </Link>
      )}
    </>
  );

  const adminRole = session?.groups?.includes("Admin") ? ["Admin"] : [];

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

  return (
    <>
      {/* {loggedIn ? (
        <Flex
          align={"center"}
          justify={"center"}
          width={"100%"}
          backgroundColor={"red.900"}
          color={"white"}
          padding={"0.5rem"}
          fontSize={{
            base: "12px",
            md: "14px",
          }}
          textAlign={"center"}
        >
          <chakra.span
            className="material-symbols-outlined"
            marginRight={"0.5rem"}
          >
            warning
          </chakra.span>
          <Text fontWeight={"bold"}>
            There will be scheduled maintenance: Monday 29th April 2024, 5:00pm
            - 10:00pm AET (UTC +10)
          </Text>
        </Flex>
      ) : null} */}
      <Flex
        bgColor={"white"}
        align={"center"}
        justify={"center"}
        top={"0px"}
        zIndex={"1002"}
      >
        <Container size={"main"} my={"0.5rem"}>
          {/* Scheduled maintaince */}
          <Flex align={"center"} justify={"space-between"} width={"100%"}>
            <Link
              paddingY="10px"
              transition={"0.2s ease-in-out"}
              _hover={{
                transform: "scale(1.1)",
                opacity: "0.7",
              }}
              href={
                !needToSignTerms
                  ? userIsStaff && !userIsPatient
                    ? "/dashboard"
                    : "/"
                  : "/setup-account/terms"
              }
              as={NextLink}
              display={{ base: "block", lg: "block" }}
            >
              <Image
                src={"/smileconnect-colour-beta.svg"}
                alt={"SmileConnect Logo"}
                height={{ base: "25px", lg: "32px" }}
              />
            </Link>
            <Flex
              gap={"0.2rem"}
              alignItems={"center"}
              justifyContent={"flex-end"}
              minWidth={{ base: null, lg: "400px" }}
            >
              {process.env.NODE_ENV === "development" ? (
                <Flex
                  fontSize={{ base: "8px", md: "12px" }}
                  display={{ base: "none", md: "flex" }}
                >
                  {`${differenceInMinutes(
                    session?.accessTokenExpiresAt,
                    new Date(),
                  )} - ${differenceInMinutes(session?.expires, new Date())}`}
                </Flex>
              ) : null}
              <Flex gap={"0.2rem"} alignItems={"center"}>
                {userIsPatient ? (
                  <Link
                    paddingY="10px"
                    transition={"0.3s ease-in-out"}
                    _hover={{
                      transform: "scale(1.1)",
                      opacity: "0.7",
                    }}
                    href={!needToSignTerms ? "/" : "/setup-account/terms"}
                    as={NextLink}
                  >
                    <Button
                      variant={"clear"}
                      px={"0.4rem"}
                      hidden={needToSignTerms}
                    >
                      <Flex
                        flexDir={"column"}
                        alignItems={"center"}
                        rowGap={"0.2rem"}
                      >
                        <chakra.span
                          className="material-symbols-outlined"
                          fontSize={{ base: "20px", md: "32px" }}
                        >
                          Home
                        </chakra.span>
                        <Text
                          fontSize={{ base: "8px", md: "12px" }}
                          textTransform={"uppercase"}
                        >
                          Home
                        </Text>
                      </Flex>
                    </Button>
                  </Link>
                ) : null}
                {userIsStaff ? staffLinks : null}
                <div className="w-70 mx-6">
                  {loggedIn && (userIsAdmin || userIsStaff) ? (
                    <PatientSearchBar />
                  ) : null}
                </div>
              </Flex>
              <Menu>
                <Skeleton isLoaded={session !== undefined}>
                  {!loggedIn ? (
                    <>
                      <MenuButton
                        as={Button}
                        px={"0.2rem"}
                        color={"xlDarkBlueLogo"}
                        border={"2px"}
                        borderColor={"xlDarkBlueLogo"}
                        bgColor={"white"}
                        columnGap={"0px"}
                        borderRadius={"full"}
                        rightIcon={
                          <chakra.span className={"material-symbols-outlined"}>
                            arrow_drop_down
                          </chakra.span>
                        }
                        iconSpacing={{ base: "0rem" }}
                        ml={{ base: "0.5rem", lg: "1.0rem" }}
                      >
                        <Text ml={"0.5rem"} mr={"0.1rem"}>
                          Menu
                        </Text>
                      </MenuButton>
                      <MenuList padding={"1.5rem"}>
                        <Link
                          paddingY="10px"
                          _hover={{
                            transform: "scale(1.1)",
                            bgColor: "gray.200",
                          }}
                          href={"/signin"}
                          as={NextLink}
                        >
                          <MenuItem
                            icon={
                              <chakra.span
                                className="material-symbols-outlined"
                                verticalAlign={"middle"}
                              >
                                settings
                              </chakra.span>
                            }
                          >
                            Login
                          </MenuItem>
                        </Link>
                        <Link
                          paddingY="10px"
                          _hover={{
                            transform: "scale(1.1)",
                            bgColor: "gray.200",
                          }}
                          href={"/support"}
                          as={NextLink}
                        >
                          <MenuItem
                            icon={
                              <chakra.span
                                className="material-symbols-outlined"
                                verticalAlign={"middle"}
                              >
                                support
                              </chakra.span>
                            }
                          >
                            Support
                          </MenuItem>
                        </Link>
                      </MenuList>
                    </>
                  ) : (
                    <>
                      <MenuButton
                        as={Button}
                        px={{ base: "0rem", md: "0.2rem" }}
                        color={"xlDarkBlueLogo"}
                        border={"2px"}
                        borderColor={"xlDarkBlueLogo"}
                        bgColor={"white"}
                        columnGap={"0px"}
                        borderRadius={"full"}
                        leftIcon={
                          <SkeletonCircle isLoaded={viewerValues}>
                            <Avatar
                              borderRadius={"full"}
                              name={fullName}
                              src={avatarUrl}
                              size={{ base: "xs", md: "sm" }}
                              mt={{ base: "0.2rem", md: "0" }}
                            />
                          </SkeletonCircle>
                        }
                        rightIcon={
                          <chakra.span
                            className={"material-symbols-outlined"}
                            fontSize={{ base: "16px" }}
                          >
                            arrow_drop_down
                          </chakra.span>
                        }
                        iconSpacing={{ base: "0rem" }}
                        ml={{ base: "0rem", lg: "1.0rem" }}
                      >
                        <Text
                          display={{ base: "none", lg: "block" }}
                          ml={"0.5rem"}
                          mr={"0.1rem"}
                        >
                          {friendlyName}
                        </Text>
                      </MenuButton>
                      <MenuList padding={"1.5rem"}>
                        <Flex align="center" mb="10px">
                          <Avatar name={fullName} src={avatarUrl} size={"md"} />
                          <Flex direction={"column"} ml="10px">
                            <Heading size={"sm"} noOfLines={1}>
                              {fullName}
                            </Heading>
                            <Text
                              fontSize={"sm"}
                              display={{ base: "none", lg: "block" }}
                            ></Text>
                            {allUserLocations.length ? (
                              <List>
                                {allUserLocations.map((location, i) => (
                                  <ListItem key={i}>{location}</ListItem>
                                ))}
                              </List>
                            ) : null}

                            {/* <Text>{userData.groups.map((item) => `${item} `)}</Text> */}
                          </Flex>
                        </Flex>
                        <MenuDivider />
                        {!needToSignTerms ? (
                          <Link
                            paddingY="10px"
                            _hover={{
                              transform: "scale(1.1)",
                              bgColor: "gray.200",
                            }}
                            href={"/account/profile-settings"}
                            as={NextLink}
                          >
                            <MenuItem
                              icon={
                                <chakra.span className="material-symbols-outlined">
                                  settings
                                </chakra.span>
                              }
                            >
                              Settings
                            </MenuItem>
                          </Link>
                        ) : null}
                        {(userIsAdmin || (userIsStaff && !needToSignTerms)) &&
                        accessToV2 ? (
                          <Link
                            paddingY="10px"
                            _hover={{
                              transform: "scale(1.1)",
                              bgColor: "gray.200",
                            }}
                            background="gray.200"
                            color={"#343CFF"}
                            href={"/pagesv2/patienttable"}
                            as={NextLink}
                          >
                            <MenuItem
                              icon={
                                <chakra.span className="material-symbols-outlined">
                                  auto_awesome
                                </chakra.span>
                              }
                            >
                              Try V2
                            </MenuItem>
                          </Link>
                        ) : null}
                        {!needToSignTerms &&
                        (userIsBusinessManager ||
                          userIsAdmin ||
                          userIsOverseer) ? (
                          <Link
                            paddingY="10px"
                            _hover={{
                              transform: "scale(1.1)",
                              bgColor: "gray.200",
                            }}
                            href={"/tools"}
                            as={NextLink}
                          >
                            <MenuItem
                              icon={
                                <chakra.span className="material-symbols-outlined">
                                  construction
                                </chakra.span>
                              }
                            >
                              Tools
                            </MenuItem>
                          </Link>
                        ) : null}
                        {userIsAdmin || userIsPatient || needToSignTerms ? (
                          <Link
                            paddingY="10px"
                            _hover={{
                              transform: "scale(1.1)",
                              bgColor: "gray.200",
                            }}
                            href={"/support"}
                            as={NextLink}
                          >
                            <MenuItem
                              icon={
                                <chakra.span className="material-symbols-outlined">
                                  call
                                </chakra.span>
                              }
                            >
                              {`Support${userIsAdmin ? ` (For Patients)` : ``}`}
                            </MenuItem>
                          </Link>
                        ) : null}
                        {userIsAdmin || (userIsStaff && !needToSignTerms) ? (
                          <Link
                            paddingY="10px"
                            _hover={{
                              transform: "scale(1.1)",
                              bgColor: "gray.200",
                            }}
                            href={"/account/support-ticket"}
                            as={NextLink}
                          >
                            <MenuItem
                              icon={
                                <chakra.span className="material-symbols-outlined">
                                  support
                                </chakra.span>
                              }
                            >
                              {`${userIsAdmin ? `(Staff) ` : ``}Support Ticket`}
                            </MenuItem>
                          </Link>
                        ) : null}

                        {userIsStaff && !needToSignTerms ? (
                          <>
                            <MenuDivider />
                            <MenuOptionGroup
                              title="Operations Manual"
                              type="checkbox"
                              color="medBlueLogo"
                              textTransform={"uppercase"}
                            >
                              <Link
                                paddingY="10px"
                                _hover={{
                                  transform: "scale(1.1)",
                                  bgColor: "gray.200",
                                }}
                                href={"/account/help-guides/getting-started"}
                                as={NextLink}
                              >
                                <MenuItem
                                  icon={
                                    <chakra.span className="material-symbols-outlined">
                                      info
                                    </chakra.span>
                                  }
                                >
                                  Quick Overview
                                </MenuItem>
                              </Link>
                              <Link
                                paddingY="10px"
                                _hover={{
                                  transform: "scale(1.1)",
                                  bgColor: "gray.200",
                                }}
                                href={"/account/help-guides"}
                                as={NextLink}
                              >
                                <MenuItem
                                  icon={
                                    <chakra.span className="material-symbols-outlined">
                                      help
                                    </chakra.span>
                                  }
                                >
                                  Help Guides
                                </MenuItem>
                              </Link>
                              <Link
                                paddingY="10px"
                                _hover={{
                                  transform: "scale(1.1)",
                                  bgColor: "gray.200",
                                }}
                                href={"/account/internal-news"}
                                as={NextLink}
                              >
                                <MenuItem
                                  icon={
                                    <chakra.span className="material-symbols-outlined">
                                      feed
                                    </chakra.span>
                                  }
                                >
                                  Internal News
                                </MenuItem>
                              </Link>
                              <Link
                                paddingY="10px"
                                _hover={{
                                  transform: "scale(1.1)",
                                  bgColor: "gray.200",
                                }}
                                href={"/account/resources"}
                                as={NextLink}
                              >
                                <MenuItem
                                  icon={
                                    <chakra.span className="material-symbols-outlined">
                                      folder_open
                                    </chakra.span>
                                  }
                                >
                                  Resources
                                </MenuItem>
                              </Link>
                              <Link
                                paddingY="10px"
                                _hover={{
                                  transform: "scale(1.1)",
                                  bgColor: "gray.200",
                                }}
                                href={"/account/help-guides/change-log"}
                                as={NextLink}
                              >
                                <MenuItem
                                  icon={
                                    <chakra.span className="material-symbols-outlined">
                                      history
                                    </chakra.span>
                                  }
                                >
                                  Change Logs
                                </MenuItem>
                              </Link>
                            </MenuOptionGroup>
                          </>
                        ) : null}
                        <MenuDivider />
                        <MenuItem
                          icon={
                            <chakra.span className="material-symbols-outlined">
                              logout
                            </chakra.span>
                          }
                          onClick={() => {
                            logger(
                              session?.userId,
                              "INFO",
                              "sc-user-logout",
                              "SmileConnect - User logout successful",
                            );
                            router.push("/signout");
                          }}
                        >
                          Log Out
                        </MenuItem>
                      </MenuList>
                    </>
                  )}
                </Skeleton>
              </Menu>
            </Flex>
          </Flex>
        </Container>
      </Flex>
    </>
  );
}
