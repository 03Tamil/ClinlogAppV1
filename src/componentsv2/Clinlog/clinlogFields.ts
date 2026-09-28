// @ts-nocheck
/**
 * Shared field helpers for Clinlog tables, filters and cross-tabs.
 *
 * Every screen used to re-implement "how do I read field X from a record"
 * (follow-up matrix, site-specific records, patient survey, surgeons, ...).
 * These helpers do it once, so filters, tables, exports and cross-tabs all
 * agree, and so values can be computed once per record and reused.
 */
import { format } from "date-fns";
import { clinlogFilterColumns } from "helpersv2/utils";

export type FieldOption = { value: string; label: string };
export type FieldMeta = {
  key: string;
  label: string;
  group: string;
  type: "select" | "number" | "date" | "string";
  subGroup?: string;
  options?: { name?: string; value?: string }[];
};

export const FIELD_GROUPS: { value: string; label: string }[] = [
  { value: "generalDetails", label: "General details" },
  { value: "patientCharacteristics", label: "Patient characteristics" },
  { value: "treatmentCharacteristics", label: "Treatment characteristics" },
  { value: "followUp", label: "Follow up" },
  { value: "patientSurvey", label: "Patient survey" },
  { value: "siteSpecificCharacteristics", label: "Site specific (implants)" },
];

export const GROUP_LABEL: Record<string, string> = Object.fromEntries(
  FIELD_GROUPS.map((group) => [group.value, group.label]),
);

// Fields that exist in the data model but aren't useful to filter/pivot on.
export const HIDDEN_FILTER_FIELDS = [
  "examinerRadiographic",
  "examiner",
  "dateOfFirstAbutmentLevelComplication",
  "recordFollowUpDate",
];

const META_BY_KEY: Map<string, FieldMeta> = new Map(
  clinlogFilterColumns.map((column) => [column.key, column]),
);

export const getFieldMeta = (key: string): FieldMeta | undefined =>
  META_BY_KEY.get(key);

export const getFieldLabel = (key: string) =>
  META_BY_KEY.get(key)?.label ?? key;

export const fieldsInGroup = (group: string, types?: string[]) =>
  clinlogFilterColumns.filter(
    (column) =>
      column.group === group &&
      !HIDDEN_FILTER_FIELDS.includes(column.key) &&
      (!types || types.includes(column.type)),
  ) as FieldMeta[];

export const AGE_BUCKETS: FieldOption[] = [
  { value: "<40", label: "Under 40" },
  { value: "40-50", label: "40–50" },
  { value: "50-60", label: "50–60" },
  { value: "60-70", label: "60–70" },
  { value: ">70", label: "Over 70" },
];

export const ageInBucket = (age: any, bucket: string) => {
  if (age === null || age === undefined || age === "") return false;
  const n = Number(age);
  if (!Number.isFinite(n)) return false;
  // Same (overlapping) boundaries the existing reports use.
  if (bucket === "<40") return n < 40;
  if (bucket === "40-50") return n >= 40 && n <= 50;
  if (bucket === "50-60") return n >= 50 && n <= 60;
  if (bucket === "60-70") return n >= 60 && n <= 70;
  if (bucket === ">70") return n > 70;
  return false;
};

export type OptionContext = {
  surgeonOptions?: string[];
  locationOptions?: FieldOption[];
  implantLineOptions?: string[];
};

/** Choosable values for a field, as {value,label}. */
export const getFieldOptions = (
  key: string,
  ctx: OptionContext = {},
): FieldOption[] => {
  if (key === "recordTreatmentSurgeons") {
    return (ctx.surgeonOptions ?? []).map((name) => ({
      value: name,
      label: `Dr. ${name}`,
    }));
  }
  if (key === "recordClinic") {
    return (ctx.locationOptions ?? []).map((option) => ({
      value: String(option.value),
      label: option.label,
    }));
  }
  if (key === "implantLine") {
    return (ctx.implantLineOptions ?? []).map((line) => ({
      value: line,
      label: line,
    }));
  }
  if (key === "ageAtTimeOfSurgery") return AGE_BUCKETS;
  const meta = META_BY_KEY.get(key);
  return (meta?.options ?? [])
    .filter((option: any) => (option?.value ?? option) !== "")
    .map((option: any) => ({
      value: String(option?.value ?? option),
      label: String(option?.name ?? option?.value ?? option),
    }));
};

/** Most recent site-specific follow-up without mutating cached data. */
export const latestSiteFollowUp = (site: any) => {
  const followUps =
    site?.attachedSiteSpecificRecords?.[0]?.attachedSiteSpecificFollowUp;
  if (!followUps?.length) return undefined;
  if (followUps.length === 1) return followUps[0];
  return [...followUps].sort(
    (a, b) =>
      new Date(b?.recordFollowUpDate).getTime() -
      new Date(a?.recordFollowUpDate).getTime(),
  )[0];
};

export const implantSites = (record: any) =>
  record?.attachedDentalCharts?.[0]?.proposedTreatmentToothMatrix?.filter(
    (site: any) => site?.treatmentItemNumber === "688",
  ) ?? [];

export const surgeryDateOf = (record: any) =>
  record?.attachedDentalCharts?.[0]?.recordTreatmentDate ||
  record?.recordTreatmentDate ||
  null;

export const surgeonNamesOf = (record: any): string[] => {
  const surgeons =
    record?.recordTreatmentSurgeons?.length > 0
      ? record.recordTreatmentSurgeons
      : record?.attachedDentalCharts?.[0]?.defaultDentist ?? [];
  return surgeons.map((surgeon: any) => surgeon?.fullName).filter(Boolean);
};

const asList = (value: any): string[] => {
  if (value === null || value === undefined || value === "") return [];
  if (Array.isArray(value)) {
    return value
      .flatMap((item) => asList(item))
      .filter((item) => item !== "");
  }
  return [String(value)];
};

/**
 * All raw values a record has for a field, as strings.
 * - site-specific fields return one value per implant site
 * - surgeons return every surgeon name
 * - everything else returns 0 or 1 value
 */
export const getRecordFieldValues = (
  record: any,
  key: string,
  surveyByRecordId?: Map<string, any>,
): string[] => {
  const meta = META_BY_KEY.get(key);
  const group = meta?.group;
  if (key === "recordTreatmentSurgeons") return surgeonNamesOf(record);
  if (key === "recordClinic") {
    return (record?.recordClinic ?? []).map((clinic: any) => String(clinic?.id));
  }
  if (key === "recordTreatmentDate") {
    const date = surgeryDateOf(record);
    return date ? [format(new Date(date), "yyyy-MM-dd")] : [];
  }
  if (group === "followUp") {
    const followUp = record?.recordFollowUpMatrix?.[0];
    return asList(followUp?.[key.split("_")[0]]);
  }
  if (group === "patientSurvey") {
    const survey = surveyByRecordId?.get(String(record?.id));
    return asList(survey?.[key.split("_")[0]]);
  }
  if (group === "siteSpecificCharacteristics") {
    return implantSites(record).flatMap((site: any) => {
      if (key === "toothValue") return asList(site?.toothValue);
      if (meta?.subGroup === "ssFollowUp") {
        return asList(latestSiteFollowUp(site)?.[key]);
      }
      return asList(site?.attachedSiteSpecificRecords?.[0]?.[key]);
    });
  }
  return asList(record?.[key]);
};

/** Does the record have `optionValue` for this field? (case-level match) */
export const recordHasOption = (
  values: string[],
  key: string,
  optionValue: string,
) => {
  if (key === "ageAtTimeOfSurgery") {
    return values.some((value) => ageInBucket(value, optionValue));
  }
  return values.includes(optionValue);
};

/** Human-readable label for a stored value. */
export const optionLabel = (
  key: string,
  value: string,
  ctx: OptionContext = {},
) =>
  getFieldOptions(key, ctx).find((option) => option.value === value)?.label ??
  value;
