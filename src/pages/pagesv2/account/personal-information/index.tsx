import {
  Alert,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  chakra,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Icon,
  Img,
  Input,
  Spinner,
  Container,
  Text,
  AspectRatio,
  Image,
  Grid,
  GridItem,
  Divider,
  Link,
  Select,
  IconButton,
} from "@chakra-ui/react";
import { AccountWrapper } from "componentsv2/Account/AccountWrapper";
import { useV2Router } from "componentsv2/Dashboard/Helpers/routerHelpers";
import useQueryHook, { sendData } from "hooks/useQueryHook";
import { notesQuery, ViewerQuery } from "helpersv2/queries";
import { useAtom } from "jotai";
import { gql, GraphQLClient } from "graphql-request";
import { setJwtToken, setRefreshToken } from "helpersv2/Auth";
import jwt_decode from "jwt-decode";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { PatientDetailsFormMutation } from "componentsv2/Forms/formMutations";
import NextLink from "next/link";

import { HiOutlinePencil } from "react-icons/hi2";
import { Breadcrumb } from "componentsv2/Styling/Breadcrumbs";
import { useState } from "react";
import PersonalInformationForm from "componentsv2/Account/PersonalInformation/PersonalInformationForm";

export default function ProfilePersonalInformation() {
  const title = "Personal Information";
  const slug = "personal-information";
  const headerText =
    "Review and edit your personal details (name, role, contact information). From here you can also download the “Request for Access to or Correction of Patient Records” form to formally request a copy of records or to correct information where appropriate.";
  return (
    <AccountWrapper
      title={title}
      headerText={headerText}
      breadcrumbs={[{ title: `${title}`, url: `account/${slug}` }]}
      slug={slug}
      p={"2rem"}
    >
      <Grid
        templateColumns={{
          base: "repeat(1, 1fr)",
          lg: "repeat(12, 1fr)",
        }}
        gap={"1rem"}
        rowGap={"1rem"}
      >
        <GridItem colSpan={{ base: 1, lg: 12 }}>
          <Heading
            color={"medBlueLogo"}
            size={"md"}
            textTransform={"uppercase"}
            fontSize={{ base: "14px", md: "16px" }}
          >
            Your Details
          </Heading>
          <Divider mt={"0.5rem"} mb={"1.0rem"} borderColor={"gray.500"} />
          <PersonalInformationForm />
        </GridItem>
        <GridItem colSpan={{ base: 1, lg: 12 }}>
          <Heading
            color={"medBlueLogo"}
            textTransform={"uppercase"}
            fontSize={{ base: "13px", md: "16px" }}
          >
            Request for access to or correction of patient records
          </Heading>
          <Divider mt={"0.5rem"} mb={"1.0rem"} borderColor={"gray.500"} />
          <Text fontSize={{ base: "13px", md: "14px" }}>
            If you would like to request your stored patient health record
            please{" "}
            <Link
              href={
                "/documents/03.12-Patient-request-to-access-records-held-at-the-practice.pdf"
              }
              color={"primary"}
              as={NextLink}
              isExternal={true}
            >
              download
            </Link>{" "}
            and fill this form in writing, and then post to:
          </Text>
          <Box mb="8" fontSize={{ base: "13px", md: "14px" }}>
            <Text fontWeight={"bold"}>The Privacy Officer</Text>
            <Text>All-On-4 Clinic</Text>
            <Text>265 Burwood Hwy,</Text>
            <Text>Burwood East VIC 3151</Text>
          </Box>
        </GridItem>
      </Grid>
    </AccountWrapper>
  );
}
