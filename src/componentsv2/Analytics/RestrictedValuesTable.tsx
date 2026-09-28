import React from "react";
import CrossTab from "componentsv2/Clinlog/CrossTab";

/**
 * Restricted values table: only the chosen values of each field, with an
 * optional "split columns by" level and totals. Rebuilt on the shared
 * CrossTab component (select-all per group and per field's values, instant
 * updates, CSV + PDF export).
 */
export default function RestrictedValuesTable({
  filteredData,
  groupOptions: _groupOptions,
  recordTreatmentSurgeonOptions = [],
  clinlogNotes = [],
  locationOptions = [],
  implantLineOptions = [],
}: {
  filteredData: any[];
  groupOptions?: any[];
  recordTreatmentSurgeonOptions?: string[];
  clinlogNotes?: any[];
  locationOptions?: { value: string; label: string }[];
  implantLineOptions?: string[];
}) {
  return (
    <CrossTab
      mode="restricted"
      records={filteredData ?? []}
      clinlogNotes={clinlogNotes}
      surgeonOptions={recordTreatmentSurgeonOptions}
      locationOptions={locationOptions}
      implantLineOptions={implantLineOptions}
    />
  );
}
