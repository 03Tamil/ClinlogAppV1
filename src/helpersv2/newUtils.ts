export const patientFormsObject = [
  {
    id: "3181",
    slug: "patient-details",
    title: "Patient Details",
    dateCreated: "2021-01-21T11:12:47+11:00",
    patientFormsCategory: "medical",
    patientFormHandle: "patientFormPatientDetails",
    patientFormsFreeformForm: {
      id: 5,
      handle: "patientFormPatientDetails",
    },
  },
  {
    id: "3219",
    slug: "medical-dental-history-form",
    title: "Medical & Dental History Form",
    dateCreated: "2021-01-21T11:49:36+11:00",
    patientFormsCategory: "medical",
    patientFormHandle: "patientFormMedicalDentalHistory",
    patientFormsFreeformForm: {
      id: 33,
      handle: "patientFormMedicalDentalHistory",
    },
  },
  {
    id: "3420",
    slug: "treatment-proposal",
    title: "Treatment Proposal",
    dateCreated: "2021-02-02T16:51:29+11:00",
    patientFormsCategory: "medical",
    patientFormHandle: "patientFormTreatmentProposal",
    patientFormsFreeformForm: null,
  },
  {
    id: "3234",
    slug: "pre-anaesthetic-information",
    title: "Pre-Anaesthetic Information",
    dateCreated: "2021-01-21T11:51:37+11:00",
    patientFormsCategory: "medical",
    patientFormHandle: "patientFormPreAnaestheticInformation",
    patientFormsFreeformForm: {
      id: 6,
      handle: "patientFormPreAnaestheticInformation",
    },
  },
  {
    id: "3252",
    slug: "anaesthetic-consent-authority",
    title: "Anaesthetic Consent & Authority",
    dateCreated: "2021-01-21T11:57:08+11:00",
    patientFormsCategory: "consent",
    patientFormHandle: "patientFormAnaestheticConsentAuthority",
    patientFormsFreeformForm: {
      id: 12,
      handle: "patientFormAnaestheticConsentAuthority",
    },
  },
  {
    id: "3414",
    slug: "blood-tests-ecg",
    title: "Blood Tests & ECG",
    dateCreated: "2021-02-02T16:07:35+11:00",
    patientFormsCategory: "medical",
    patientFormHandle: "patientFormBloodTestsEcg",
    patientFormsFreeformForm: null,
  },
  {
    id: "3347",
    slug: "signed-surgical-consent",
    title: "Dental Implants Surgical Consent",
    dateCreated: "2021-01-28T11:21:21+11:00",
    patientFormsCategory: "consent",
    patientFormHandle: "patientFormConsentForm",
    patientFormsFreeformForm: {
      id: 36,
      handle: "patientFormConsentForm",
    },
  },
  {
    id: "11619",
    slug: "guarantees-upgrades",
    title: "Guarantees & Upgrades",
    dateCreated: "2021-03-15T14:25:24+11:00",
    patientFormsCategory: "consent",
    patientFormHandle: "patientFormGuaranteesUpgrades",
    patientFormsFreeformForm: {
      id: 46,
      handle: "patientFormGuaranteesUpgrades",
    },
  },
  {
    id: "3267",
    slug: "secured-finance-documentation",
    title: "Secured Finance Documentation",
    dateCreated: "2021-01-21T12:00:18+11:00",
    patientFormsCategory: "finance",
    patientFormHandle: "patientFormSecuredFinanceDocumentation",
    patientFormsFreeformForm: {
      id: 7,
      handle: "patientFormSecuredFinanceDocumentation",
    },
  },
  {
    id: "3282",
    slug: "loan-agreement-1",
    title: "Loan Agreement",
    dateCreated: "2021-01-21T12:02:38+11:00",
    patientFormsCategory: "finance",
    patientFormHandle: "patientFormLoanAgreement",
    patientFormsFreeformForm: {
      id: 11,
      handle: "patientFormLoanAgreement",
    },
  },
  {
    id: "39986",
    slug: "image-consent",
    title: "Image Consent",
    dateCreated: "2021-09-07T16:18:39+10:00",
    patientFormsCategory: "consent",
    patientFormHandle: "patientFormImageConsent",
    patientFormsFreeformForm: {
      id: 52,
      handle: "patientFormImageConsent",
    },
  },
  {
    id: "297020",
    slug: "medical-records-consent",
    title: "Medical Records Consent",
    dateCreated: "2024-03-21T16:17:24+11:00",
    patientFormsCategory: "consent",
    patientFormHandle: "patientFormMedicalRecordsConsent",
    patientFormsFreeformForm: null,
  },
  {
    id: "3289",
    slug: "waterpik",
    title: "Waterpik Application Form",
    dateCreated: "2021-01-21T12:07:46+11:00",
    patientFormsCategory: "other",
    patientFormHandle: "patientFormFreeWaterPikOffer",
    patientFormsFreeformForm: {
      id: 3,
      handle: "patientFormFreeWaterPikOffer",
    },
  },
  {
    id: "13796",
    slug: "correspondence",
    title: "Correspondence",
    dateCreated: "2021-03-24T12:51:01+11:00",
    patientFormsCategory: "other",
    patientFormHandle: "patientFormCorrespondence",
    patientFormsFreeformForm: null,
  },
  {
    id: "16777",
    slug: "other",
    title: "Other Documents",
    dateCreated: "2021-04-19T11:16:59+10:00",
    patientFormsCategory: "other",
    patientFormHandle: "patientFormOtherDocuments",
    patientFormsFreeformForm: null,
  },
  {
    id: "189314",
    slug: "extraction-consent-supplement",
    title: "Extraction Consent Supplement",
    dateCreated: "2023-10-04T18:11:39+11:00",
    patientFormsCategory: "consent",
    patientFormHandle: "patientFormExtractionConsentSupplement",
    patientFormsFreeformForm: null,
  },
  {
    id: "193250",
    slug: "general-cosmetic-dentistry-consent",
    title: "General & Cosmetic Dentistry Consent",
    dateCreated: "2023-10-11T16:32:32+11:00",
    patientFormsCategory: "consent",
    patientFormHandle: "patientFormGeneralCosmeticDentistryConsent",
    patientFormsFreeformForm: null,
  },
]

import { gql } from "graphql-request"

export const patientpagetest = gql`
  query patientpagetest($limit: Int = 10) {
    entries(section: "recordTreatments", limit: $limit) {
      id
    }
  }
`

export const recordAttachedTreatmentsQuery = gql`
  query detailspagetest($limit: Int = 10, $id: [QueryArgument]) {
    entry(section: "records", limit: $limit, id: $id) {
      ... on records_records_Entry {
        recordPatient {
          ... on User {
            id
            fullName
            patientFormsServed {
              ... on patientFormsServed_clinicBlock_BlockType {
                patientRecord {
                  id
                  slug
                  title
                }
                attachedTreatment {
                  id
                  title
                }
                formsToComplete {
                  id
                  slug
                  title
                }
              }
            }
          }
        }
        recordAttachedTreatments {
          ... on recordTreatments_default_Entry {
            id
            title
            recordTreatmentStatus
            recordEnquiryType
            recordFollowUpDate
            dateCreated
            recordBookingConfirmations {
              ... on staffAssets_Asset {
                id
                title
                dateCreated
                uploader {
                  ... on User {
                    fullName
                  }
                }
              }
            }
            recordTreatmentProposal {
              ... on treatmentProposal_default_Entry {
                id
                title
                dateCreated
                treatmentProposalStatus
                treatmentProposalStatusLabel: treatmentProposalStatus(
                  label: true
                )
                treatmentProposalPdfs {
                  ... on staffAssets_Asset {
                    id
                    title
                    dateCreated
                    uploader {
                      ... on User {
                        fullName
                      }
                    }
                  }
                }

                treatmentProposalSurgicalFacility {
                  ... on locations_locations_Entry {
                    id
                    locationShortName
                    locationAddressSimple
                    locationOtherName
                  }
                }
                treatmentProposalCoordinator {
                  ... on User {
                    id
                    userTitle
                    fullName
                    userMobilePhone
                  }
                }
                treatmentProposalUserRecord {
                  ... on records_records_Entry {
                    id
                    recordPatient {
                      ... on User {
                        fullName
                        email
                        firstName
                        lastName
                        userPostcode
                        userHomeAddress
                        userCitySuburb
                        userState
                      }
                    }
                    recordClinic {
                      ... on locations_locations_Entry {
                        id
                        locationShortName
                        locationAddressSimple
                        locationOtherName
                        locationEmail
                        locationPhoneNumber {
                          number
                        }
                        locationProposalCopy {
                          ... on treatmentProposalCopy_default_Entry {
                            id
                            proposalCopyTable {
                              col1
                              col2
                            }
                          }
                        }
                        locationOtherLogo {
                          id
                          url
                        }
                        mainImage {
                          url
                        }
                      }
                    }
                    recordFirstName
                    recordEmail
                    recordLastName
                    recordIssuedProposals {
                      id
                    }
                    recordTreatmentProposal {
                      id
                    }
                  }
                }
                newEnquiryType
                treatmentProposalTreatment {
                  ... on treatmentProposalTreatments_default_Entry {
                    id
                    title
                    treatmentStages {
                      ... on treatmentStages_default_Entry {
                        id
                        title
                        treatmentStageShortName
                        treatmentStageType
                        treatmentStageSingleSelection
                        treatmentStageProcedures {
                          col1
                          col2
                          col3
                          col4
                          col5
                        }
                      }
                    }
                  }
                }
                treatmentProposalTreatmentName
                treatmentProposalMatrix {
                  ... on treatmentProposalMatrix_stage_BlockType {
                    id
                    referencedStage {
                      id
                    }
                    discountDeductionMethod
                    discountDescription
                    discountDeductionValue
                    treatmentStageType
                    treatmentName
                    treatingClinician {
                      ... on User {
                        id
                        fullName
                        userTitle
                      }
                    }
                    procedures {
                      col1
                      col2
                      col3
                      col4
                      col6
                      col7
                    }
                  }
                }
                treatmentProposalSectionOptions {
                  ... on treatmentProposalSectionOptions_sectionOptions_BlockType {
                    additionalInformationContent
                    additionalInformationIncluded
                    additionalInformationTitle
                    whatToExpectTitle
                    whatToExpectIncluded
                    whatToExpectContent
                    financeRequired
                    financeSections
                    other
                  }
                }
                treatmentProposalAnaestheticFeeMatrix {
                  ... on treatmentProposalAnaestheticFeeMatrix_anaestheticFeeSummary_BlockType {
                    whichFeeType
                    facilityFee
                    whichFeeType
                    procedureTime
                    maxRebate
                    minRebate
                    serviceFee
                    anaestheticFeeType
                    anaestheticFee
                    anaestheticServicesEntity {
                      id
                      title
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`

export const treatmentsIdTitleQuery = gql`
  query treatmentsIdTitleQuery(
    $limit: Int = 10
    $patientFormRecord: [QueryArgument]!
  ) {
    entries(
      section: "recordTreatments"
      limit: $limit
      patientFormRecord: $patientFormRecord
    ) {
      id
      title
      dateCreated
    }
  }
`
export const formsTest = gql`
  query formQueries(
    $recordId: [QueryArgument]! #$recordAttachedTreatments: [QueryArgument] = -1
  ) {
    entries(
      section: "matrixForms"
      patientFormRecord: $recordId
      recordAttachedTreatments: $recordAttachedTreatments
    ) {
      id
      title
      typeHandle
      dateCreated
      # ... on matrixForms_patientFormAnaestheticConsentAuthority_Entry {
      #   recordAttachedTreatments {
      #     ... on recordTreatments_default_Entry {
      #       id
      #     }
      #   }
      # }
    }
  }
`

export const appointmentsQuery = gql`
  query appointmentsQuery(
    $limit: Int = 5
    $patientFormRecord: [QueryArgument]!
  ) {
    entries(
      section: "appointments"
      limit: $limit
      patientFormRecord: $patientFormRecord
    ) {
      ... on appointments_default_Entry {
        dateCreated
        title
        id
        recordFollowUpDate
        recordFollowUpStaffMember {
          ... on User {
            id
            fullName
          }
        }
      }
    }
  }
`

export const newTableQuery = gql`
  query newTableQuery(
    $recordClinic: [QueryArgument]!
    $limit: Int = 10000
    $limitCollaborators: Int = 10000
    $userId: [QueryArgument]
    $leadsDateFilter: [String]
    $consultsDateFilter: [QueryArgument]
    $bookedDateFilter: [QueryArgument]
    $completedDateFilter: [QueryArgument]
  ) {
    entries(
      section: "records"
      recordClinic: $recordClinic
      limit: $limit
      orderBy: "dateUpdated DESC"
      dateUpdated: $leadsDateFilter
      recordConsultationDate: $consultsDateFilter
      recordTreatmentDate: $bookedDateFilter
      recordCaseCompletedDate: $completedDateFilter
    ) {
      ... on records_records_Entry {
        id
        recordFirstName
        recordLastName
        recordEmail
        recordMobilePhone
        dateCreated
        recordFollowUpStatus
        recordLeadStatus
      }
    }
    formsCollaborators: entries(
      section: "records"
      recordFormsCollaborators: $userId
      orderBy: "dateCreated DESC"
      limit: $limitCollaborators
      dateUpdated: $leadsDateFilter
      recordConsultationDate: $consultsDateFilter
      recordTreatmentDate: $bookedDateFilter
      recordCaseCompletedDate: $completedDateFilter
    ) {
      ... on records_records_Entry {
        id
        recordFirstName
        recordLeadStatus
        recordLastName
        recordEmail
        recordMobilePhone
        dateCreated
      }
    }
  }
`
export const newTableQueryInfinite = gql`
  query newTableQueryInfinite(
    $recordClinic: [QueryArgument]!
    $limit: Int = 10000
    $limitCollaborators: Int = 10000
    $userId: [QueryArgument]
    $offset: Int
  ) {
    entries(
      section: "records"
      recordClinic: $recordClinic
      limit: $limit
      orderBy: "dateUpdated DESC"
      offset: $offset
    ) {
      ... on records_records_Entry {
        id
        recordFirstName
        recordLastName
        recordEmail
        recordMobilePhone
        dateCreated
        recordFollowUpStatus
        recordLeadStatus
      }
    }
    formsCollaborators: entries(
      section: "records"
      recordFormsCollaborators: $userId
      orderBy: "dateCreated DESC"
      limit: $limitCollaborators
    ) {
      ... on records_records_Entry {
        id
        recordFirstName
        recordLeadStatus
        recordLastName
        recordEmail
        recordMobilePhone
        dateCreated
      }
    }
  }
`

export const newTableQuerySearch = gql`
  query newTableQueryInfinite(
    $recordClinic: [QueryArgument]!
    $limit: Int = 10000
    $limitCollaborators: Int = 10000
    $userId: [QueryArgument]
    $offset: Int
  ) {
    entries(
      section: "records"
      recordClinic: $recordClinic
      limit: $limit
      orderBy: "dateUpdated DESC"
      offset: $offset
    ) {
      ... on records_records_Entry {
        id
        recordFirstName
        recordLastName
      }
    }
    formsCollaborators: entries(
      section: "records"
      recordFormsCollaborators: $userId
      orderBy: "dateCreated DESC"
      limit: $limitCollaborators
    ) {
      ... on records_records_Entry {
        id
        recordFirstName
        recordLastName
      }
    }
  }
`

// Modified query to access global patients data
export const patientSearchBarQuery = gql`
  query patientSearchBarQuery(
    $recordClinic: [QueryArgument]!
    $limit: Int = 10000
    $limitCollaborators: Int = 10000
    $offset: Int
    $userId: [QueryArgument]
  ) {
    entries(
      section: "recordPatientGlobal"
      recordClinic: $recordClinic
      limit: $limit
      orderBy: "dateUpdated DESC"
      offset: $offset
    ) {
      ... on recordPatientGlobal_default_Entry {
        id
        recordFirstName
        recordLastName
        recordEmail
      }
    }
    formsCollaborators: entries(
      section: "recordPatientGlobal"
      orderBy: "dateCreated DESC"
      limit: $limitCollaborators
      relatedToEntries: {
        section: "records"
        recordFormsCollaborators: $userId
      }
    ) {
      ... on recordPatientGlobal_default_Entry {
        id
        recordFirstName
        recordLastName
      }
    }
  }
`

export const addTreatmentMutation = gql`
  mutation addTreatmentMutation(
    $patientFormRecord: [Int]!
    $title: String
    $recordEnquiryType: String
  ) {
    save_recordTreatments_default_Entry(
      patientFormRecord: $patientFormRecord
      title: $title
      recordEnquiryType: $recordEnquiryType
    ) {
      id
    }
  }
`
