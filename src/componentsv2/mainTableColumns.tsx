import { Text, Flex, Box } from "@chakra-ui/react"
import { createColumnHelper } from "@tanstack/react-table"
import { Patient } from "./data"
import {
  customArrayFilter,
  customDateRangeFilter,
  customInactiveFilter,
  customIncludesStringFunction,
  fuzzyFilter,
} from "./filterFns"
import { V2Link } from "./Dashboard/Helpers/routerHelpers"
import { recordStringHandles } from "../helpersv2/utils"
import { decryptId, encryptId } from "helpersv2/Auth"
import { isPast, format } from "date-fns"
import { newTabSettingAtom } from "store/store"
import { useAtom } from "jotai"

const columnHelper = createColumnHelper<Patient>()
const isMainStaff = (userGroups) => {
  return [
    "Admin",
    "Dentist",
    "Nurse",
    "Overseer",
    "Receptionist",
    "Treatment Coordinator",
  ].some((group) => userGroups.includes(group))
}

export const columnData = (sessionGroups) =>
  [
    columnHelper.accessor(
      (row) =>
        row?.recordPatient?.[0]?.fullName ??
        `${row.recordFirstName} ${row.recordLastName}`,
      {
        header: "Full Name",
        cell: (info) => {
          const firstName = info.row.original.recordFirstName
          const lastName = info.row.original.recordLastName
          const email = info.row.original.recordEmail
          const [newTabSetting, setNewTabSettings] = useAtom(newTabSettingAtom)
          //  const encryptJson = JSON.stringify({
          //   postId: info.row.original?.id,
          //   clinicIds: info.row.original?.recordClinic,
          // })
          // const encryptedData = encryptId(encryptJson);

          return (
            <V2Link
              target={newTabSetting ? "_blank" : ""}
              prefetch={false}
              href={{
                pathname: "/patientdashboard",
                query: { postId: encryptId(info.row.original?.id) },
              }}
            >
              <Flex align="center">
                {!!info.row.original?.recordPatient?.[0]?.fullName ? (
                  <Box>
                    <Text lineHeight="20px" color="#0F1F65" fontWeight="700">
                      {info.row.original?.recordPatient?.[0]?.fullName}
                    </Text>
                    <Text lineHeight="20px" color="gray.600">
                      {!!info.row.original?.recordPatient?.[0]?.email
                        ? info.row.original?.recordPatient?.[0]?.email
                        : email}
                    </Text>
                  </Box>
                ) : (
                  <Box>
                    <Text lineHeight="20px" color="#0F1F65" fontWeight="700">
                      {firstName} {lastName}
                    </Text>
                    <Text lineHeight="20px" color="gray.600">
                      {email}
                    </Text>
                  </Box>
                )}
              </Flex>
            </V2Link>
          )
        },
        footer: (info) => info.column.id,
      }
    ),
    columnHelper.accessor("recordConsultationDate", {
      header: "Consultation Date",
      filterFn: customDateRangeFilter,
      cell: (info) => {
        const consultTime = info.row.original?.recordConsultationTime
        const consultDate = info.row.original?.recordConsultationDate
        if (!!consultTime) {
          return (
            <p>{format(new Date(consultTime), "MMM d, yyyy, hh:mm aaa")}</p>
          )
        } else if (!!consultDate) {
          return <p>{format(new Date(consultDate), "MMM d, yyyy")}</p>
        } else {
          return <Text color="grey">No Consults</Text>
        }
      },
      // info && <p>{format(new Date(info.getValue()), "MMM d, yyyy")}</p>,
      footer: (info) => info.column.id,
    }),
    columnHelper.accessor("recordLeadStatus", {
      header: "Lead Status",
      // filterFn: customIncludesStringFunction,
      cell: (info) =>
        info.getValue() ? (
          <Text>{recordStringHandles[info.getValue()] || info.getValue()}</Text>
        ) : (
          <Text color="grey">N/A</Text>
        ),
      footer: (info) => info.column.id,
    }),
    columnHelper.accessor("recordFollowUpDate", {
      header: "Follow Up Date",
      cell: (info: any) => {

        if (!!info.getValue()) {

          if (info?.row?.original?.recordFollowUpRequired === true) {
            return (
              <Text color={isPast(new Date(info.getValue())) ? "red" : "black"}>
                {format(new Date(info.getValue()), "MMM d, yyyy")}
              </Text>)
          }
          else { return <Text color="black">No Follow Up Required</Text> }

        }
        return <Text color="grey">No Follow Up</Text>
      },
      footer: (info) => info.column.id,
    }),
    columnHelper.accessor("recordConsultationStatus", {
      header: "Consultation Status",
      filterFn: customArrayFilter,
      cell: (info) => recordStringHandles[info.getValue()] ?? "N/A",
      footer: (info) => info.column.id,
    }),
    columnHelper.accessor("recordTreatmentDate", {
      header: "Treatment Date",
      filterFn: customDateRangeFilter,
      cell: (info) =>
        info.getValue() ? (
          <Flex direction="column">
            <span>{format(new Date(info.getValue()), "MMM d, yyyy")}</span>
            <span>{format(new Date(info.getValue()), "h':'mm a")}</span>
          </Flex>
        ) : (
          <Text color="grey">N/A</Text>
        ),
      footer: (info) => info.column.id,
    }),
    columnHelper.accessor("recordTreatmentStatus", {
      header: "Treatment Status",
      filterFn: customArrayFilter,
      cell: (info) => {
        // const handleComplete = () => {
        //   const recordId = info.row.original.id
        //   mutationTrigger.mutate({
        //     recordId,
        //     recordCaseCompletedDate: formatISO(new Date()),
        //   })
        // }
        return info.getValue()
        const treatmentCompleted = info.getValue() === "completed"
        return <Text>{treatmentCompleted ? "Completed" : "N/A"}</Text>
      },
      footer: (info) => info.column.id,
    }),
    columnHelper.accessor("recordAnaesthetistStatus", {
      header: "General Anaesthetic",
      filterFn: customIncludesStringFunction,
      cell: (info) => {
        const treatmentAnaesthetist =
          info.row.original["recordTreatmentAnaesthetist"]?.[0]?.fullName
        if (info.getValue() === "pendingMoreInformation") {
          return <Text color="orange">Pending</Text>
        } else if (info.getValue() === "approvedByAnaesthetist") {
          return (
            <Text color="green">
              Approved{" "}
              {!!treatmentAnaesthetist && `(Dr. ${treatmentAnaesthetist})`}
            </Text>
          )
        } else if (info.getValue() === "notApprovedByAnaesthetist") {
          return <Text color="red">Rejected</Text>
        }
        return (
          <Text color="grey">
            Review {!!treatmentAnaesthetist && `(Dr. ${treatmentAnaesthetist})`}
          </Text>
        )
      },
      footer: (info) => info.column.id,
    }),
    columnHelper.accessor((row) => row?.recordEmail ?? "N/A", {
      header: "Email",
      enableColumnFilter: true,
      enableGlobalFilter: true,
      // filterFn: customIncludesStringFunction,
      filterFn: fuzzyFilter,
      cell: (info) =>
        info.getValue() !== "N/A" ? (
          info.getValue()
        ) : (
          <Text color="grey">N/A</Text>
        ),
      footer: (info) => info.column.id,
    }),
    columnHelper.accessor(
      (row) => row.recordMobilePhone?.replace(/[^+\d]+/g, ""),
      {
        header: "Mobile Phone",
        filterFn: customIncludesStringFunction,
        cell: (info) => info.getValue() ?? <Text color="grey">N/A</Text>,
        footer: (info) => info.column.id,
      }
    ),
    columnHelper.accessor("recordFollowUpStatus", {
      header: "Follow up Status",
      filterFn: customInactiveFilter,
      cell: (info) =>
        recordStringHandles[info.getValue()] ?? <Text color="grey">N/A</Text>,
      footer: (info) => info.column.id,
    }),
    columnHelper.accessor("recordLeadType", {
      header: "Lead Type",
      cell: (info) =>
        recordStringHandles[info.getValue()] ?? <Text color="grey">N/A</Text>,
      footer: (info) => info.column.id,
    }),
    columnHelper.accessor("recordTreatmentSurgeons", {
      header: "Clinician",
      cell: (info) =>
        //@ts-ignore
        info.getValue()[0]?.fullName ?? <Text color="grey">N/A</Text>,
      footer: (info) => info.column.id,
    }),
    columnHelper.accessor(
      (row) =>
        `${row?.recordClinic?.[0]?.locationShortName} - ${row?.recordClinic?.[0]?.locationOtherName}`,
      {
        header: "Clinic",
        cell: (info) =>
          //@ts-ignore
          info.getValue()?.split(" - ")[0] ?? <Text color="grey">N/A</Text>,
        footer: (info) => info.column.id,
      }
    ),
    columnHelper.accessor((row) => row?.recordTreatmentProposal?.[0], {
      header: "Confirmed Treatment",
      cell: (info) =>
      //@ts-ignore
      {
        return (
          <>
            {!!info.getValue()?.treatmentProposalTreatmentName ? (
              <Flex overflow="hidden">
                <Text w="400px" textOverflow="ellipsis">
                  {info.getValue()?.treatmentProposalTreatmentName}
                </Text>
              </Flex>
            ) : (
              <Text color="grey">N/A</Text>
            )}
          </>
        )
      },
      footer: (info) => info.column.id,
    }),
    columnHelper.accessor("recordEnquiryDate", {
      header: "Enquiry Date",
      filterFn: customDateRangeFilter,
      cell: (info) => {
        return info.getValue() ? (
          <p>{format(new Date(info.getValue()), "MMM d, yyyy")}</p>
        ) : (
          <Text color="grey">N/A</Text>
        )
      },
      footer: (info) => info.column.id,
    }),
    columnHelper.accessor("recordEnquiryType", {
      header: "Enquiry Type",
      cell: (info) =>
        recordStringHandles[info.getValue()] ?? <Text color="grey">N/A</Text>,
      footer: (info) => info.column.id,
    }),
    // columnHelper.accessor("id", {
    //   header: "Treatment",
    //   cell: (info) => {
    //     const hel = randomData?.entries.find(
    //       (first) => first.recordNoteRecord[0]?.id === info.getValue()
    //     )
    //     const upperFull = hel?.recordNoteUpperTreatment
    //       ? hel.recordNoteUpperTreatment.split(":")
    //       : ""
    //     const lowerFull = hel?.recordNoteLowerTreatment
    //       ? hel.recordNoteLowerTreatment.split(":")
    //       : ""

    //     if (!!upperFull[1]) {
    //       return (
    //         <Flex direction="column">
    //           <p>
    //             <strong>{upperFull[0]}:</strong>
    //             {upperFull[1]}
    //           </p>
    //           {!!lowerFull[0] && (
    //             <p>
    //               {" "}
    //               <strong>{lowerFull[0]}:</strong>
    //               {lowerFull[1]}
    //             </p>
    //           )}
    //         </Flex>
    //       )
    //     }
    //     return <p>N/A</p>
    //   },
    //   footer: (info) => info.column.id,
    // }),
    columnHelper.accessor("recordAccountRevenue", {
      header: "Revenue",
      cell: (info) =>
        info.getValue() ? (
          <Text>${info.getValue()}</Text>
        ) : (
          <Text color="grey">N/A</Text>
        ),
      footer: (info) => info.column.id,
    }),
    columnHelper.accessor("recordPatient", {
      header: "Referral Source",
      filterFn: customIncludesStringFunction,
      cell: (info) =>
        recordStringHandles[info.getValue()[0]?.userHowDidYouFindUs] ?? (
          <Text color="grey">N/A</Text>
        ),
      footer: (info) => info.column.id,
    }),
    // columnHelper.accessor("recordTreatmentAnaesthetist", {
    //   header: "Anaesthetist",
    //   cell: (info) =>
    //     //@ts-ignore
    //     <Text color="grey">Dr. {info.getValue()[0]?.fullName}</Text> ?? (
    //       <Text color="grey">N/A</Text>
    //     ),
    //   footer: (info) => info.column.id,
    // }),
  ] // Filter these columns unless a main staff
    .filter(
      (column: any) =>
        ![
          "recordEnquiryType",
          "recordEnquiryDate",
          "recordLeadType",
          "recordConsultationStatus",
          "recordConsultationDate",
          "recordAccountRevenue",
        ].includes(column.accessorKey) || isMainStaff(sessionGroups)
    )
