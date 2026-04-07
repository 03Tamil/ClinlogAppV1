import { Flex } from "@chakra-ui/react"
import { format } from "date-fns"
import { addCommas } from "./utils"

export const followUpSitesColumns = [
  { header: "Site Value", accessorKey: "site_value" },
  {
    header: "Follow Implant Function",
    accessorKey: "ssfollow_implantfunction",
    cell: ({ getValue }) => getValue() || "N/A",
  },
  {
    header: "Sinusitis",
    accessorKey: "sinusitis",
    cell: ({ getValue }) => getValue() || "N/A",
  },
  {
    header: "Facial Swelling",
    accessorKey: "facial_swelling",
    cell: ({ getValue }) => getValue() || "N/A",
  },
  {
    header: "Follow Inflammation",
    accessorKey: "ssfollow_inflammation",
    cell: ({ getValue }) => getValue() || "N/A",
  },
  {
    header: "Suppuration",
    accessorKey: "suppuration",
    cell: ({ getValue }) => getValue() || "N/A",
  },
  {
    header: "Follow Pain",
    accessorKey: "ssfollow_pain",
    cell: ({ getValue }) => getValue() || "N/A",
  },
  {
    header: "Recession",
    accessorKey: "recession",
    cell: ({ getValue }) => getValue() || "N/A",
  },
  {
    header: "Mid Shaft Soft Tissue Dehiscence",
    accessorKey: "mid_shaft_soft_tissue_dehiscence",
    cell: ({ getValue }) => getValue() || "N/A",
  },
  {
    header: "Abutment Complications",
    accessorKey: "abutment_complications",
    cell: ({ getValue }) => getValue() || "N/A",
  },
  {
    header: "Other Abutment Complications",
    accessorKey: "other_abutment_complications",
    cell: ({ getValue }) => getValue() || "N/A",
  },
  {
    header: "Total Abutment Complications Follow",
    accessorKey: "total_abutment_complications_follow",
    cell: ({ getValue }) => getValue() || "N/A",
  },
  {
    header: "Date First Abutment Complication",
    accessorKey: "date_first_abutment_complication",
    cell: ({ getValue }) =>
      !!getValue() ? format(new Date(getValue()), "dd-MM-yyyy") : "N/A",
  },
  {
    header: "First Abutment Complication Time from Surgery",
    accessorKey: "first_abutment_complication_time_from_surgery",
    cell: ({ getValue }) => getValue() || "N/A",
  },
  {
    header: "Follow Sinus Disease",
    accessorKey: "ssfollow_sinusdisease",
    cell: ({ getValue }) => getValue() || "N/A",
  },
  {
    header: "Follow Bone Loss",
    accessorKey: "ssfollow_boneloss",
    cell: ({ getValue }) => getValue() || "N/A",
  },
  {
    header: "Follow Graft Condition",
    accessorKey: "ssfollow_graftcondition",
    cell: ({ getValue }) => getValue() || "N/A",
  },
]

export const clinlogSitesColumns = [
  { header: "Site Value", accessorKey: "site_value" },
  { header: "Site ID", accessorKey: "siteid" },
  { header: "Implant Type", accessorKey: "implant_type" },
  { header: "Implant Length", accessorKey: "implant_length" },
  { header: "Sequence Bar Code", accessorKey: "sequence_bar_code" },
  { header: "Placement", accessorKey: "placement" },
  { header: "Abutment", accessorKey: "abutment" },
  {
    header: "Trabecular Bone Density",
    accessorKey: "trabecular_bone_density",
  },
  { header: "Bone Vascularity", accessorKey: "bone_vascularity" },
  { header: "Grafting Applied", accessorKey: "grafting_applied" },
  {
    header: "Intra-operative Sinus Complications",
    accessorKey: "intra_operative_sinus_complications",
  },
  { header: "Crestal Rest", accessorKey: "crestal_rest" },
  { header: "Insertion Torque", accessorKey: "insertion_torque" },
  {
    header: "Radiographic Trabecular Density (HU)",
    accessorKey: "radiographic_trabecular_density_hu",
  },
  { header: "Relevant Bone Width", accessorKey: "relevant_bone_width" },
  {
    header: "Pre-operative Sinus Disease",
    accessorKey: "pre_operative_sinus_disease",
  },
  {
    header: "Pre-operative Sinus Disease Management",
    accessorKey: "pre_operative_sinus_disease_management",
  },
  { header: "PRF", accessorKey: "prf" },
  {
    header: "Conformance with Treatment Plan",
    accessorKey: "conformance_with_treatment_plan",
  },
  { header: "Graft Material", accessorKey: "graft_material" },
  { header: "Implant Brand", accessorKey: "brand_name" },
]

export const proposalToolColumns = [
  // {
  //   header: "Item #",
  //   accessorKey: "itemNumber",
  //   cell: ({ row }) => {
  //     const { itemNumber, quantity } = row?.original
  //     if (quantity > 0) {
  //       return `${quantity} x ${itemNumber}`
  //     }
  //     return `1 x ${itemNumber}`
  //   },
  // },
  { header: "Item", accessorKey: "itemNumber" },
  {
    header: "Provider",
    accessorKey: "dentist",
    cell: ({ getValue }) => {
      return getValue()?.[0]?.fullName || getValue()?.[0]?.label || "N/A"
    },
  },
  { header: "Description", accessorKey: "treatmentItemTitle" },
  {
    header: "Tooth",
    accessorKey: "toothValue",
  },
  {
    header: "Cost",
    accessorKey: "cost",
    cell: ({ cell, table, getValue }) => {
      return `$${addCommas(getValue())}`
    },
    aggregatedCell: ({ cell, table, getValue }) => {
      return (
        <Flex position="relative" top="4px" align="flex-end" fontWeight="700">
          ${addCommas(Math.round(getValue()))}
        </Flex>
      )
    },
  },
  {
    header: "Completed",
    accessorKey: "completed",
    cell: ({ cell, table, getValue }) => {
      if (getValue()) {
        return (
          <span
            className="material-symbols-outlined"
            style={{
              color: "#4ADE80",
              left: "50px",
              justifyContent: "center",
              display: "flex",
            }}
          >
            check_circle
          </span>
        )
      } else {
        return (
          <span
            className="material-symbols-outlined"
            style={{
              color: "#ccc",
              left: "50px",
              justifyContent: "center",
              display: "flex",
            }}
          >
            timelapse
          </span>
        )
      }
    },
  },
  {
    header: "Paid",
    accessorKey: "treatmentPaid",
    cell: ({ cell, table, getValue }) => {
      if (getValue()) {
        return (
          <span
            className="material-symbols-outlined"
            style={{
              color: "#4ADE80",
              //left: "50px",
              justifyContent: "center",
              display: "flex",
            }}
          >
            check_circle
          </span>
        )
      }
      return (
        <span
          className="material-symbols-outlined"
          style={{
            color: "#ccc",
            //left: "50px",
            justifyContent: "center",
            display: "flex",
          }}
        >
          timelapse
        </span>
      )
    },
  },
  {
    header: "",
    accessorKey: "groupTitle",
  },
  {
    header: "",
    accessorKey: "groupTitleParent",
  },
]

export const proposalToolColumnsTwo = [
  // {
  //   header: "Item #",
  //   accessorKey: "itemNumber",
  //   cell: ({ row }) => {
  //     const { itemNumber, quantity } = row?.original
  //     if (quantity > 0) {
  //       return `${quantity} x ${itemNumber}`
  //     }
  //     return `1 x ${itemNumber}`
  //   },
  // },
  { header: "Item", accessorKey: "treatmentItemNumber" },
  {
    header: "Provider",
    accessorKey: "dentist",
    cell: ({ getValue }) => getValue()?.[0]?.fullName || "N/A",
  },
  { header: "Visit", accessorKey: "visitNumber" },
  { header: "Description", accessorKey: "treatmentItemTitle" },
  {
    header: "Site",
    accessorKey: "toothValue",
  },
  {
    header: "Surfaces",
    accessorKey: "toothPosition",
  },
  {
    header: "Fee",
    accessorKey: "cost",
    cell: ({ cell, table, getValue }) => {
      return `$${addCommas(getValue())}`
    },
    aggregatedCell: ({ cell, table, getValue }) => {
      return (
        <Flex position="relative" top="10px" align="flex-end" fontWeight="700">
          ${addCommas(Math.round(getValue()))}
        </Flex>
      )
    },
  },
  {
    header: "Complete",
    accessorKey: "completed",
  },

  {
    header: "Remove",
    accessorKey: "remove",
  },
  // {
  //   header: "Complete",
  //   accessorKey: "completed",
  // },
  {
    header: "Group",
    accessorKey: "groupTitle",
  },
]
