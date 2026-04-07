export type Patient = {
  id: string
  recordFirstName: string
  recordLastName: string
  recordEmail: string //email?
  recordMobilePhone: string
  recordHomePhone: string
  recordClinic: any[]
  recordCompletionStatus: string
  recordTreatmentStatus: string
  recordEnquiryDate: any
  recordEnquiryType: any
  recordConsultationStatus: any
  recordFollowUpDate: Date
  recordPatient: any
  recordLeadType: any
  recordTreatmentSurgeons: string
  upperTreatment: string
  lowerTreatment: string
  recordConsultationDate: Date
  recordConsultationTime: Date
  recordTreatmentDate: Date
  recordTreatmentAnaesthetist: any
  recordTreatmentAnaesthetistsFee: number
  recordAccountRevenue: number
  recordTreatmentProcedure: any
  recordFollowUpStatus: string
  dateCreated: Date
  url: string
  slug: string
  recordAnaesthetistStatus: string
  recordSourceOfReferral: string
  recordLeadStatus: string
  recordTreatmentProposal: any
}

export type DashboardPatient = {
  id: string
  recordTreatmentStatus: string
  recordTreatmentProcedure: any
  recordFirstName: string
  recordLastName: string
  recordEmail: string //email?
  recordTreatmentSurgeons: any
  recordTreatmentRestorative: any
  recordTreatmentAnaesthetist: any
  recordCompletionStatus: string
  recordTreatmentDate: Date
  url: string
  recordConsultationDate: Date
  recordMobilePhone: string
  recordFollowUpDate: Date
  recordClinic: any
  recordFollowUpStaffMember: any
  recordTreatmentProposal: any
  recordPatient: any
  recordBmi: number | string
  recordAnaesthetistStatus: string
}

export const visibilityParamsFalse = {
  recordFirstName: false,
  recordLastName: false,
  recordEmail: false,
  recordMobilePhone: false,
  recordClinic: false,
  recordCompletionStatus: false,
  recordTreatmentStatus: false,
  recordEnquiryDate: false,
  recordEnquiryType: false,
  recordConsultationStatus: false,
  recordFollowUpDate: false,
  recordSourceOfReferral: false,
  recordLeadType: false,
  recordTreatmentSurgeons: false,
  upperTreatment: false,
  lowerTreatment: false,
  recordConsultationDate: false,
  recordTreatmentDate: false,
  recordTreatmentAnaesthetist: false,
  recordTreatmentAnaesthetistsFee: false,
  recordAccountRevenue: false,
  recordTreatmentProcedure: false,
  id: false,
  recordAnaesthetistStatus: false,
  recordLeadStatus: false,
}

export const visibilityParamsTrue = {
  recordFirstName: true,
  recordLastName: true,
  recordEmail: true,
  recordMobilePhone: true,
  recordClinic: true,
  recordCompletionStatus: true,
  recordTreatmentStatus: true,
  recordEnquiryDate: true,
  recordEnquiryType: true,
  recordConsultationStatus: true,
  recordFollowUpDate: true,
  recordSourceOfReferral: true,
  recordLeadType: true,
  recordTreatmentSurgeons: true,
  upperTreatment: true,
  lowerTreatment: true,
  recordConsultationDate: true,
  recordTreatmentDate: true,
  recordTreatmentAnaesthetist: true,
  recordTreatmentAnaesthetistsFee: true,
  recordAccountRevenue: true,
  recordTreatmentProcedure: true,
  id: true,
}
