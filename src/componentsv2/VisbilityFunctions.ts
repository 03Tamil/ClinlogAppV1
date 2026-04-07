import { useAtom } from "jotai"
import { visibilityParamsFalse, visibilityParamsTrue } from "./data"

export const handleVisbilityActiveLeads = (setColumnVisibility) => {
  setColumnVisibility({
    ...visibilityParamsFalse,
    recordFirstName: true,
    recordLastName: true,
    recordFollowUpDate: true,
  })
}

export const handleVisbilityConsults = (setColumnVisibility) => {
  setColumnVisibility({
    ...visibilityParamsFalse,
    recordFirstName: true,
    recordLastName: true,
    recordConsultationDate: true,
    recordFollowUpDate: true,
  })
}

export const handleVisbilityBooked = (setColumnVisibility) => {
  setColumnVisibility({
    ...visibilityParamsFalse,
    recordFirstName: true,
    recordLastName: true,
    recordTreatmentDate: true,
    recordTreatmentAnaesthetist: true,
  })
}

export const handleVisbilityCompleted = (setColumnVisibility) => {
  setColumnVisibility({
    ...visibilityParamsFalse,
    recordFirstName: true,
    recordLastName: true,
    recordTreatmentDate: true,
    recordAccountRevenue: true,
    recordSourceOfReferral: true,
  })
}

export const handleVisbilityConsultsDesktop = {
  ...visibilityParamsFalse,
  recordFollowUpDate: true,
  recordConsultationDate: true,
  recordConsultationStatus: true,
  id: true, //treatment and quote
  recordLeadStatus: true,
  recordPatient: false,
  "Confirmed Treatment": false,
  recordFollowUpStatus: false,
}

export const handleVisbilityBookedDesktop = {
  ...visibilityParamsFalse,
  recordClinic: true,
  recordTreatmentProcedure: true,
  recordTreatmentDate: true,
  recordTreatmentSurgeons: true,
  recordTreatmentAnaesthetist: true,
  recordAnaesthetistStatus: true,
  Email: false,
  "Mobile Phone": false,
  recordPatient: false,
}

export const handleVisbilityCompletedDesktop = {
  ...visibilityParamsFalse,
  recordLeadType: true,
  recordTreatmentSurgeons: true,
  id: true, //treatment
  recordTreatmentDate: true,
  recordSourceOfReferral: true,
  recordAccountRevenue: true,
  recordFollowUpDate: true,
  recordTreatmentStatus: false,
}

export const handleVisbilityActiveLeadsDesktop = {
  ...visibilityParamsFalse,
  recordMobilePhone: true,
  recordLeadType: true,
  recordEnquiryDate: true,
  recordEnquiryType: true,
  recordFollowUpDate: true,
  recordLeadStatus: true,
  "Confirmed Treatment": false,
}

export const handleVisbilityAllDesktop = {
  ...visibilityParamsFalse,
  recordEnquiryDate: true,
  recordConsultationStatus: true,
  recordFollowUpDate: true,
  recordSourceOfReferral: true,
  recordAccountRevenue: true,
  recordLeadStatus: true,
}
