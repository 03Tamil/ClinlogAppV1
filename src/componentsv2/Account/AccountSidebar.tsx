import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  chakra,
  Collapse,
  Divider,
  Flex,
  Heading,
  Icon,
  Link,
  Skeleton,
  Spacer,
  Stack,
  StackDivider,
  Text,
  useBreakpoint,
  useBreakpointValue,
  useDisclosure,
  useMediaQuery,
} from "@chakra-ui/react";
import { V2Link as NextLink } from "componentsv2/Dashboard/Helpers/routerHelpers";
import {
  HiOutlineBell,
  HiOutlineBuildingOffice2,
  HiOutlineChartBar,
  HiOutlineClipboardDocumentCheck,
  HiOutlineCog6Tooth,
  HiOutlineDocumentCheck,
  HiOutlineDocumentText,
  HiOutlineDocument,
  HiOutlineDocumentPlus,
  HiOutlineEye,
  HiOutlineFolder,
  HiOutlineInformationCircle,
  HiOutlineNewspaper,
  HiOutlineQuestionMarkCircle,
  HiOutlineSparkles,
  HiOutlineTag,
  HiOutlineUserCircle,
  HiOutlineArchiveBox,
} from "react-icons/hi2";
import { MdArrowDownward, MdMenu, MdSettings } from "react-icons/md";

import React, { useEffect } from "react";
import { IconType } from "react-icons/lib";
import { useSession } from "next-auth/react";
import { useV2Router } from "componentsv2/Dashboard/Helpers/routerHelpers";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { isAdmin, isPatient, isStaff } from "helpersv2/Permissions";

export type ProfileSidebarMenuItemType = {
  title: string;
  slug: string;
  url: string;
  icon?: IconType;
};
export type MenuCardsType = {
  heading: string;
  menuItems: ProfileSidebarMenuItemType[];
};
export type AccountSidebarProps = {
  name?: string;
  icon?: IconType;
  slug: string;
  sidebar?: MenuCardsType[];
};

export default function AccountSidebar({
  name,
  icon,
  slug,
  sidebar,
}: AccountSidebarProps) {
  const router = useV2Router();
  const { status, data: session } = useSession({
    required: true,
    onUnauthenticated() {
      const currentPath = router.asPath;
      router.push(
        `/pagesv2/signin?redirect=${encodeURIComponent(currentPath)}`,
      );
    },
  });
  if (session === undefined) {
    return <Skeleton width="100%" height="100%" />;
  }

  const userIsAdmin = isAdmin(session.groups);
  const userIsPatient = isPatient(session.groups);
  const userIsStaff = isStaff(session.groups);
  const userIsOverseer = !!session?.groups?.includes("Overseer");
  const userIsMasOverseer = !!session?.groups?.includes("MAS Overseer");
  const userIsLaboratoryOverseer = !!session?.groups?.includes(
    "Laboratory Overseer",
  );
  const [breakpoint] = useMediaQuery("(min-width: 1024px)");
  const [selectedPage, setSelectedPage] = React.useState("Profile Settings");
  // useEffect(() => {
  //   const heading = accountSettingsMenuItems.menuItems.find(
  //     (item) => item.slug === slug
  //   )?.title;
  //   if (heading) {
  //     setSelectedPage(heading);
  //   }
  //   // setSelectedPage(router.pathname.split("/")[1] || "profile-settings");
  // }, [router.pathname]);
  const accountSettingsMenuItems = {
    heading: "Account Settings",
    menuItems: [
      {
        title: "Profile Settings",
        slug: "profile-settings",
        url: "/account/profile-settings",
        icon: "settings",
      },
      {
        title: "Personal Information",
        slug: "personal-information",
        url: "/account/personal-information",
        icon: "person",
      },
    ],
  };
  const staffSettings = {
    heading: "Staff Settings",
    menuItems: [
      {
        title: "Appearance",
        slug: "appearance",
        url: "/account/appearance",
        icon: "palette",
      },
      {
        title: "Tags",
        slug: "tags",
        url: "/account/tags",
        icon: "sell",
      },
    ],
  };
  const overseerMenuItems = {
    heading: "Overseer Settings",
    menuItems: [
      {
        title: "Clinic Information",
        slug: "clinic-information",
        url: "/account/clinic-information",
        icon: "business",
      },
      {
        title: "Request/Invite Company",
        slug: "request-invite-new-company",
        url: "/account/request-invite-new-company",
        icon: "add_business",
      },
      {
        title: "Consultation Templates",
        slug: "consultation-templates",
        url: "/account/consultation-templates",
        icon: "description",
      },
      {
        title: "Communication Templates",
        slug: "communication-templates",
        url: "/account/communication-templates",
        icon: "mail",
      },
      /* {
        title: "Analytics",
        slug: "analytics",
        url: "/account/analytics",
        icon: HiOutlineChartBar
      }, */
      {
        title: "User Management",
        slug: "user-management",
        url: "/account/user-management",
        icon: "supervised_user_circle",
      },
      {
        title: "Dental Components Management",
        slug: "dental-components-management",
        url: "/account/dental-components-management",
        icon: "admin_meds",
      },
      {
        title: "Medication Management",
        slug: "medication-management",
        url: "/account/medication-management",
        icon: "admin_meds",
      },
      {
        title: "Clinlog Management",
        slug: "clinlog-management",
        url: "/account/clinlog-management",
        icon: "globe_book",
      },
    ],
  };
  const masOverseerMenuItems = {
    heading: "MAS Overseer Settings",
    menuItems: [
      {
        title: "MAS Information",
        slug: "mas-information",
        url: "/account/mas-information",
        icon: "business",
      },
      {
        title: "MAS User Management",
        slug: "mas-user-management",
        url: "/account/mas-user-management",
        icon: "supervised_user_circle",
      },
    ],
  };
  const laboratoryOverseerMenuItems = {
    heading: "Laboratory Overseer Settings",
    menuItems: [
      {
        title: "Laboratory Information",
        slug: "laboratory-information",
        url: "/account/laboratory-information",
        icon: "business",
      },
      {
        title: "Laboratory User Management",
        slug: "laboratory-user-management",
        url: "/account/laboratory-user-management",
        icon: "supervised_user_circle",
      },
      {
        title: "Teeth Brand/Moulds",
        slug: "teeth-brand-moulds",
        url: "/account/teeth-brand-moulds",
        icon: "dentistry",
      },
    ],
  };
  const staffMenuItems = {
    heading: "Operations Manual",
    menuItems: [
      {
        title: "Quick Overview",
        slug: "quick-overview",
        url: "/account/help-guides/getting-started",
        icon: "info",
      },
      {
        title: "Help Guides",
        slug: "help-guides",
        url: "/account/help-guides",
        icon: "help",
      },
      {
        title: "Internal News",
        slug: "internal-news",
        url: "/account/internal-news",
        icon: "newspaper",
      },
      {
        title: "Resources",
        slug: "resources",
        url: "/account/resources",
        icon: "folder_open",
      },
      {
        title: "Branding",
        slug: "branding",
        url: "/account/branding",
        icon: "auto_awesome",
      },
      {
        title: "Send a Support Ticket",
        slug: "support-ticket",
        url: "/account/support-ticket",
        icon: "support",
      },
    ],
  };
  const menuItems = [
    {
      title: "Patient Terms & Conditions",
      slug: "patient-terms",
      url: "/account/patient-terms",
      icon: "handshake",
    },
    ...(userIsStaff
      ? [
          {
            title: "Staff Terms & Conditions",
            slug: "staff-terms",
            url: "/account/staff-terms",
            icon: "order_approve",
          },
        ]
      : []),
  ];

  const legalMenuItems = {
    heading: "Legal",
    menuItems: menuItems,
  };

  const privacyMenuItems = {
    heading: "Privacy",
    menuItems: [
      {
        title: "HIPAA Business Associate Addendum with Mailgun",
        slug: "hipaa-business-associate-addendum-with-mailgun",
        url: "/account/help-guides/privacy/hipaa-business-associate-addendum-with-mailgun",
        icon: "inventory_2",
      },
    ],
  };

  const defaultProfileMenuCards = ["patient-terms", "staff-terms"]?.includes(
    slug,
  )
    ? [...(userIsStaff || userIsAdmin ? [legalMenuItems] : [])]
    : [
        accountSettingsMenuItems,
        ...(userIsStaff || userIsAdmin ? [staffSettings] : []),
        ...(userIsOverseer || userIsAdmin ? [overseerMenuItems] : []),
        ...(userIsMasOverseer || userIsAdmin ? [masOverseerMenuItems] : []),
        ...(userIsLaboratoryOverseer || userIsAdmin
          ? [laboratoryOverseerMenuItems]
          : []),
        //...(userIsStaff || userIsAdmin ? [staffMenuItems] : []),
        //...(userIsStaff || userIsAdmin ? [legalMenuItems] : []),
        //...(userIsStaff || userIsAdmin ? [privacyMenuItems] : []),
      ];

  const profileMenuCards = sidebar ?? defaultProfileMenuCards;

  const { isOpen, onToggle } = useDisclosure();

  return (
    <Box w="100%">
      {/* <Box
        width={"100%"}
        backgroundColor={"#0E11C7"}
        color={"white"}
        onClick={onToggle}
        p={"1rem"}
        display={"flex"}
        alignItems={"center"}
        justifyContent={"space-between"}
      > */}
      {/* <Flex
        w="100%"
        border={"1px"}
        borderColor="scBlue"
        bgColor="scBlue"
        align="center"
        justify="space-between"
        textAlign="start"
        padding="5px 10px"
      >
        <Flex align="center" gap="0.5rem" height={"32px"}>
          <chakra.span
            className="material-symbols-outlined"
            fontSize={"24px"}
            color="#007BFF"
          >
            {icon ?? "settings"}
          </chakra.span>
          <Heading
            textTransform="uppercase"
            color="white"
            fontSize={{ base: "12px", xl: "14px" }}
            fontFamily="inter"
            letterSpacing={"0.07rem"}
          >
            {name ?? `Menu`}
          </Heading>
        </Flex>
      </Flex> */}
      {/* <Heading
        color={"white"}
        textTransform={"uppercase"}
        size={"md"}
        gap={"1rem"}
      >
        <Flex justifyContent={"center"} alignItems={"center"} gap={"0.5rem"}>
          <Icon as={icon ?? MdSettings} />

          <chakra.span textTransform={"uppercase"}>
            {name ?? `Menu`}
          </chakra.span>
        </Flex>
      </Heading> */}
      {/* <chakra.span
        //visibility={breakpoint ? "hidden" : null}
        display={breakpoint ? "none" : "block"}
        className="material-symbols-outlined"
        fontSize={"1.5rem"}
        fontWeight={"bold"}
        onClick={onToggle}
      >
        menu
      </chakra.span> */}
      <Flex
        w="100%"
        align="center"
        gap="0.5rem"
        onClick={onToggle}
        bgColor={"#E2EFFC"}
        p="4"
        display={{ base: "flex", lg: "none" }}
      >
        <Text
          textTransform={"uppercase"}
          fontFamily={"inter"}
          letterSpacing={"1.7px"}
          fontSize="14px"
          fontWeight={"700"}
          color="scBlue"
        >
          {" "}
          {slug.replaceAll("-", " ")}
        </Text>
        <Spacer />
        <ChevronDownIcon fontSize={"26px"} color="scBlue" />
      </Flex>
      {/*</Box> */}
      <Collapse in={breakpoint || isOpen} animateOpacity>
        <Box px="4" py={{ base: "1", lg: "6" }}>
          {profileMenuCards.map((menuCard, i) => {
            return menuCard.menuItems.length ? (
              <Box key={menuCard.heading} mb={"2rem"} bg="white">
                <Stack spacing={"0.6rem"}>
                  <Text
                    w="100%"
                    fontWeight="700"
                    fontSize={"12px"}
                    bgColor="#F5F5F5"
                    color="black"
                    px="3"
                    py="2"
                    letterSpacing="0.72px"
                    textTransform={"uppercase"}
                    borderTop={"#D9D9D9 1px solid"}
                    borderBottom={"#D9D9D9 1px solid"}
                  >
                    {menuCard.heading}
                  </Text>
                  {menuCard.menuItems.map((menuItem, j) => (
                    <Link
                      key={menuItem.slug}
                      href={menuItem.url}
                      as={NextLink}
                      scroll={sidebar ? false : true}
                      _hover={{
                        transform: "scale(1.02)",
                        opacity: "0.7",
                      }}
                      transition={"0.1s ease-in-out"}
                    >
                      <Text
                        display={"flex"}
                        alignItems={"center"}
                        fontWeight={menuItem.slug === slug ? "700" : "500"}
                        fontSize={menuItem.slug === slug ? "13px" : "12px"}
                        color={menuItem.slug === slug ? "scBlue" : "black"}
                        px="2"
                        py="1"
                      >
                        {menuItem.icon ? (
                          <chakra.span
                            className="material-symbols-outlined"
                            mr="0.5rem"
                            fontWeight="regular"
                          >
                            {menuItem.icon}
                          </chakra.span>
                        ) : null}
                        <chakra.span
                          //fontSize="12px"
                          letterSpacing={"0.8px"}
                          textTransform={"uppercase"}
                        >
                          {menuItem.title}
                        </chakra.span>
                      </Text>
                      <Divider w="100%" />
                    </Link>
                  ))}
                </Stack>
              </Box>
            ) : null;
          })}
        </Box>
      </Collapse>
    </Box>
  );
}
