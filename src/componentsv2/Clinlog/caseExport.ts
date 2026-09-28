// @ts-nocheck
import { differenceInDays, format } from "date-fns";
import {
  getFieldMeta,
  getRecordFieldValues,
  implantSites,
  optionLabel,
  surgeonNamesOf,
  surgeryDateOf,
  type OptionContext,
} from "./clinlogFields";
import { dateStamp, downloadCsv, toCsv } from "./csv";

const fmt = (value, pattern = "yyyy-MM-dd") =>
  value ? format(new Date(value), pattern) : "";

const isZygoma = (site) =>
  site?.attachedSiteSpecificRecords?.[0]?.implantCategory?.includes(
    "zygomatic",
  );

/** Plain-text value of an All Cases column for one record (for CSV). */
export const getCaseCellText = (
  record,
  columnId: string,
  ctx: OptionContext & { surveyByRecordId?: Map<string, any> } = {},
) => {
  switch (columnId) {
    case "caseNumber":
      return record?.caseNumber
        ? `${record.caseNumber} / SCR${record.id}`
        : `SCR${record?.id}`;
    case "patientName":
      return `${record?.patientName} (${record?.caseNumber || "-"})`;
    case "fullName":
      return `${record?.recordFirstName ?? ""} ${record?.recordLastName ?? ""}`.trim();
    case "status":
      return record?.__dataStatus === "completed"
        ? "Complete"
        : "Data missing";
    case "recordTreatmentDate":
      return fmt(surgeryDateOf(record));
    case "recordTreatmentSurgeons":
      return surgeonNamesOf(record)
        .map((name) => `Dr. ${name}`)
        .join("; ");
    case "recordClinic":
      return (record?.recordClinic ?? [])
        .map((clinic) => clinic?.locationShortName || clinic?.title || clinic?.id)
        .join("; ");
    case "zygomaImplants":
      return implantSites(record).filter(isZygoma).length;
    case "regularImplants":
      return implantSites(record).filter((site) => !isZygoma(site)).length;
    case "totalImplants":
      return implantSites(record).length;
    case "timeFromSurgery": {
      const surgery = surgeryDateOf(record);
      return record?.dateOfInsertion && surgery
        ? differenceInDays(
            new Date(fmt(record.dateOfInsertion)),
            new Date(fmt(surgery)),
          )
        : "";
    }
    case "numberOfReviews": {
      const followUp = record?.recordFollowUpMatrix?.[0];
      return followUp?.numberOfReviews || record?.recordFollowUpMatrix?.length || "";
    }
    default: {
      const meta = getFieldMeta(columnId);
      const values = getRecordFieldValues(
        record,
        columnId,
        ctx.surveyByRecordId,
      );
      if (meta?.type === "date") return values.map((v) => fmt(v)).join("; ");
      if (meta?.type === "select") {
        return values.map((v) => optionLabel(columnId, v, ctx)).join("; ");
      }
      return values.join("; ");
    }
  }
};

export const exportCasesCsv = ({
  records,
  columns,
  ctx,
  fileName = `clinlog-cases-${dateStamp()}.csv`,
}: {
  records: any[];
  columns: { id: string; label: string }[];
  ctx?: OptionContext & { surveyByRecordId?: Map<string, any> };
  fileName?: string;
}) => {
  const csv = toCsv(
    columns.map((c) => c.label),
    records.map((record) =>
      columns.map((column) => getCaseCellText(record, column.id, ctx)),
    ),
  );
  downloadCsv(fileName, csv);
};
