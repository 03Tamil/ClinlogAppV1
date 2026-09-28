import React from "react";
import CrossTab from "componentsv2/Clinlog/CrossTab";

/**
 * Fluid table: every value of the chosen column fields against every value of
 * the chosen row fields. Rebuilt on the shared CrossTab component (grouped
 * field picker with select-all, instant updates, CSV + PDF export).
 */
export default function FluidTable({
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
      mode="fluid"
      records={filteredData ?? []}
      clinlogNotes={clinlogNotes}
      surgeonOptions={recordTreatmentSurgeonOptions}
      locationOptions={locationOptions}
      implantLineOptions={implantLineOptions}
    />
  );
}
