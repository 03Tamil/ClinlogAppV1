import { gql } from "graphql-request"
export const patientDetailsMutation = gql`
  mutation patientDetailsMutation(
    $id: ID!
    $recordFirstName: String
    $recordLastName: String
    $recordHomePhone: String
    $recordMobilePhone: String
    $recordDateOfBirth: DateTime
    $recordSourceOfReferral: String
    $recordTreatmentWorkUpDate: DateTime
    $recordLeadType: String
    $recordEnquiryDate: DateTime
    $recordEnquiryType: String
    $recordAccountRevenue: Number
    $recordTreatmentPaymentStatus: String
    $recordConsultationDate: DateTime
    $recordConsultationStatus: String
    $recordTreatmentDate: DateTime
    $recordFormsCollaborators: [Int]
    $recordTreatmentSurgeons: [Int]
    $recordTreatmentRestorative: [Int]
    $recordTreatmentAnaesthetist: [Int]
    $recordAnaesthetistStatus: String
    $recordMas: [Int]
    $recordPatient: [Int]
    $recordEmail: String
    $recordAnaestheticProcedureTime: String
    $recordFacilityFee: Number
    $recordCaseConsultedDate: DateTime
    $recordCaseBookedDate: DateTime
    $recordCaseCompletedDate: DateTime
    $recordTreatmentStatus: String
    $recordBmi: Number
    $recordLaboratory: [Int]
    $recordLaboratorySetUpTechnician: [Int]
    $recordLaboratoryMethod: String
    $recordLaboratoryShade: String
    $recordLaboratoryUpperAnteriorTeethBrandMould: [Int]
    $recordLaboratoryLowerAnteriorTeethBrandMould: [Int]
    $recordLaboratoryUpperPosteriorTeethBrandMould: [Int]
    $recordLaboratoryLowerPosteriorTeethBrandMould: [Int]
    $treatmentProposalSurgicalFacility: [Int]
  ) {
    save_records_records_Entry(
      id: $id
      treatmentProposalSurgicalFacility: $treatmentProposalSurgicalFacility
      recordFirstName: $recordFirstName
      recordLastName: $recordLastName
      recordBmi: $recordBmi
      recordLaboratoryUpperAnteriorTeethBrandMould: $recordLaboratoryUpperAnteriorTeethBrandMould
      recordLaboratoryUpperPosteriorTeethBrandMould: $recordLaboratoryUpperPosteriorTeethBrandMould
      recordLaboratoryLowerAnteriorTeethBrandMould: $recordLaboratoryLowerAnteriorTeethBrandMould
      recordLaboratoryLowerPosteriorTeethBrandMould: $recordLaboratoryLowerPosteriorTeethBrandMould
      recordLaboratoryMethod: $recordLaboratoryMethod
      recordLaboratoryShade: $recordLaboratoryShade
      recordCaseConsultedDate: $recordCaseConsultedDate
      recordCaseBookedDate: $recordCaseBookedDate
      recordCaseCompletedDate: $recordCaseCompletedDate
      recordEmail: $recordEmail
      recordHomePhone: $recordHomePhone
      recordMobilePhone: $recordMobilePhone
      recordDateOfBirth: $recordDateOfBirth
      recordTreatmentWorkUpDate: $recordTreatmentWorkUpDate
      recordTreatmentDate: $recordTreatmentDate
      recordSourceOfReferral: $recordSourceOfReferral
      recordTreatmentStatus: $recordTreatmentStatus
      recordTreatmentSurgeons: $recordTreatmentSurgeons
      recordTreatmentRestorative: $recordTreatmentRestorative
      recordTreatmentAnaesthetist: $recordTreatmentAnaesthetist
      recordAnaesthetistStatus: $recordAnaesthetistStatus
      recordMas: $recordMas
      recordPatient: $recordPatient
      recordLeadType: $recordLeadType
      recordEnquiryDate: $recordEnquiryDate
      recordEnquiryType: $recordEnquiryType
      recordAccountRevenue: $recordAccountRevenue
      recordTreatmentPaymentStatus: $recordTreatmentPaymentStatus
      recordConsultationDate: $recordConsultationDate
      recordConsultationStatus: $recordConsultationStatus
      recordFormsCollaborators: $recordFormsCollaborators
      recordAnaestheticProcedureTime: $recordAnaestheticProcedureTime
      recordFacilityFee: $recordFacilityFee
      recordLaboratory: $recordLaboratory
      recordLaboratorySetUpTechnician: $recordLaboratorySetUpTechnician
    ) {
      id
      recordFirstName
      recordLastName
    }
  }
`

// export const addCollaboratorMutatation = gql`
//   mutation addCollaboratorMutatation(
//     $id: ID!

//   ) {
//     id
//   }
// `

export const consultationNoteMutation = gql`
  mutation consultationNoteMutation(
    $recordNoteNote: String
    $recordNoteNoteJson: String
    $id: ID
    $recordNoteRecord: [Int]
  ) {
    save_recordNotes_templatedConsultationNote_Entry(
      id: $id
      recordNoteRecord: $recordNoteRecord
      recordNoteNote: $recordNoteNote
      recordNoteNoteJson: $recordNoteNoteJson
    ) {
      id
    }
  }
`

export const caseNoteMutation = gql`
  mutation caseNoteMutation(
    $recordConversionLikelihood: String
    $recordConversionPatientEmotion: String
    $recordNoteTaggedCollaborators: [Int]
    $recordNoteDropboxUrl: String
    $recordNoteNote: String
    $recordNoteRecord: [Int]
  ) {
    save_recordNotes_caseNote_Entry(
      title: "case note"
      recordNoteRecord: $recordNoteRecord
      recordConversionLikelihood: $recordConversionLikelihood
      recordNoteTaggedCollaborators: $recordNoteTaggedCollaborators
      recordConversionPatientEmotion: $recordConversionPatientEmotion
      recordNoteDropboxUrl: $recordNoteDropboxUrl
      recordNoteNote: $recordNoteNote
    ) {
      id
    }
  }
`

export const standardNoteMutation = gql`
  mutation standardNoteMutation(
    $recordNoteNote: String
    $recordNoteRecord: [Int]
  ) {
    save_recordNotes_standardNote_Entry(
      title: "case note"
      recordNoteRecord: $recordNoteRecord
      recordNoteNote: $recordNoteNote
    ) {
      id
    }
  }
`

export const diagnosisMutation = gql`
  mutation caseNoteMutation(
    $id: ID
    $recordNoteRecord: [Int]
    $recordDiagnosisDentalChart: [recordDiagnosisDentalChart_TableRowInput]
    $recordDiagnosisUpperConditions: [Int]
    $recordDiagnosisLowerConditions: [Int]
    $recordDiagnosisBiteAlignment: [Int]
    $recordDiagnosisSoftTissues: [Int]
    $recordDiagnosisAesthetic: [Int]
    $recordDiagnosisUpperRadiographicFindings: [Int]
    $recordDiagnosisLowerRadiographicFindings: [Int]
    $recordDiagnosisNotes: String
    $recordDiagnosisTreatmentOptions: [recordDiagnosisTreatmentOptions_MatrixBlockContainerInput]
    $sortOrder: [QueryArgument]
    $recordDiagnosisRisksDiscussed: [Int]
    $recordDiagnosisExploringOtherOptions: Boolean
    $recordDiagnosisNeedsReferral: Boolean
    $recordDiagnosisDiscussedProprioception: Boolean
  ) {
    save_recordNotes_diagnosisAndOptions_Entry(
      id: $id
      recordNoteRecord: $recordNoteRecord
      recordDiagnosisDentalChart: $recordDiagnosisDentalChart
      recordDiagnosisUpperConditions: $recordDiagnosisUpperConditions
      recordDiagnosisLowerConditions: $recordDiagnosisLowerConditions
      recordDiagnosisBiteAlignment: $recordDiagnosisBiteAlignment
      recordDiagnosisSoftTissues: $recordDiagnosisSoftTissues
      recordDiagnosisAesthetic: $recordDiagnosisAesthetic
      recordDiagnosisUpperRadiographicFindings: $recordDiagnosisUpperRadiographicFindings
      recordDiagnosisLowerRadiographicFindings: $recordDiagnosisLowerRadiographicFindings
      recordDiagnosisNotes: $recordDiagnosisNotes
      recordDiagnosisTreatmentOptions: {
        sortOrder: $sortOrder
        blocks: $recordDiagnosisTreatmentOptions
      }
      recordDiagnosisRisksDiscussed: $recordDiagnosisRisksDiscussed
      recordDiagnosisExploringOtherOptions: $recordDiagnosisExploringOtherOptions
      recordDiagnosisNeedsReferral: $recordDiagnosisNeedsReferral
      recordDiagnosisDiscussedProprioception: $recordDiagnosisDiscussedProprioception
    ) {
      id
    }
  }
`

export const addPdfTreatmentProposalMutation = gql`
  mutation addPdfTreatmentProposalMutation(
    $proposalId: ID
    $treatmentProposalPdfs: [Int]
    $treatmentProposalStatus: String
  ) {
    save_treatmentProposal_default_Entry(
      id: $proposalId
      treatmentProposalPdfs: $treatmentProposalPdfs
      treatmentProposalStatus: $treatmentProposalStatus
    ) {
      id
    }
  }
`

export const treatmentProposalMutation = gql`
  mutation treatmentProposalMutation(
    $treatmentBlocks: [treatmentProposalMatrix_MatrixBlockContainerInput]
    $treatmentSortOrder: [QueryArgument]
    $anaestheticFeeBlocks: [treatmentProposalAnaestheticFeeMatrix_MatrixBlockContainerInput]
    $treatmentProposalSectionBlocks: [treatmentProposalSectionOptions_MatrixBlockContainerInput]
    $treatmentProposalSurgicalFacility: [Int]
    $treatmentProposalTreatmentName: String
    $treatmentProposalUserRecord: [Int]
    $treatmentProposalCoordinator: [Int]
    $newEnquiryType: [String]
    $title: String
  ) {
    save_treatmentProposal_default_Entry(
      title: $title
      slug: $title
      treatmentProposalSurgicalFacility: $treatmentProposalSurgicalFacility
      treatmentProposalUserRecord: $treatmentProposalUserRecord
      treatmentProposalCoordinator: $treatmentProposalCoordinator
      treatmentProposalTreatmentName: $treatmentProposalTreatmentName
      newEnquiryType: $newEnquiryType
      treatmentProposalMatrix: {
        sortOrder: $treatmentSortOrder
        blocks: $treatmentBlocks
      }
      treatmentProposalAnaestheticFeeMatrix: {
        sortOrder: ["new1"]
        blocks: $anaestheticFeeBlocks
      }
      treatmentProposalSectionOptions: {
        sortOrder: ["new2"]
        blocks: $treatmentProposalSectionBlocks
      }
    ) {
      id
    }
  }
`

export const proposalStatusMutation = gql`
  mutation proposalStatusMutation($treatmentProposalStatus: String, $id: ID) {
    save_treatmentProposal_default_Entry(
      id: $id
      treatmentProposalStatus: $treatmentProposalStatus
    ) {
      id
    }
  }
`

export const proposalApprovalMutation = gql`
  mutation proposalApprovalMutation(
    $recordTreatmentProposal: [Int]
    $recordTreatmentSurgeons: [Int]
    $recordTreatmentRestorative: [Int]
    $recordAccountRevenue: Number
    $recordAnaestheticProcedureTime: String
    $recordIssuedProposals: [Int]
    $id: ID
    $recordFacilityFee: Number
    $treatmentProposalSurgicalFacility: [Int]
  ) {
    save_records_records_Entry(
      id: $id
      recordAccountRevenue: $recordAccountRevenue
      recordTreatmentProposal: $recordTreatmentProposal
      recordTreatmentSurgeons: $recordTreatmentSurgeons
      recordTreatmentRestorative: $recordTreatmentRestorative
      recordAnaestheticProcedureTime: $recordAnaestheticProcedureTime
      recordIssuedProposals: $recordIssuedProposals
      recordFacilityFee: $recordFacilityFee
      treatmentProposalSurgicalFacility: $treatmentProposalSurgicalFacility
    ) {
      id
    }
  }
`

export const bookingConfirmationMutation = gql`
  mutation bookingConfirmationMutation(
    $recordBookingConfirmations: [Int]
    $id: ID!
  ) {
    save_records_records_Entry(
      id: $id
      recordBookingConfirmations: $recordBookingConfirmations
    ) {
      id
    }
  }
`

export const userPatientFormsMutation = gql`
  mutation userPatientFormsMutation(
    $patientForms: [String]
    $userTitle: String
    $entryId: Int!
  ) {
    updateUserDetails(
      patientForms: $patientForms
      userTitle: $userTitle
      entryId: $entryId
    ) {
      id
    }
  }
`
export const registerPatientMutation = gql`
  mutation registerPatientMutation(
    $newUser: Boolean
    $entryId: Int
    $resetUserId: Int
    $userTitle: String
    $username: String
    $email: String
    $userLocation: [Int]
    $firstName: String
    $lastName: String
    $fullName: String
    $userPreferredName: String
    $userDateOfBirth: String
    $userDentalInsuranceFund: String
    $userHomePhone: String
    $userMobilePhone: String
    $userHomeAddress: String
    $userCitySuburb: String
    $userState: String
    $userPostcode: String
  ) {
    registerPatient(
      entryId: $entryId
      newUser: $newUser
      resetUserId: $resetUserId
      firstName: $firstName
      lastName: $lastName
      fullName: $fullName
      userPreferredName: $userPreferredName
      userTitle: $userTitle
      username: $username
      userLocation: $userLocation
      email: $email
      userDateOfBirth: $userDateOfBirth
      userDentalInsuranceFund: $userDentalInsuranceFund
      userHomePhone: $userHomePhone
      userMobilePhone: $userMobilePhone
      userHomeAddress: $userHomeAddress
      userCitySuburb: $userCitySuburb
      userState: $userState
      userPostcode: $userPostcode
    )
  }
`

export const registerStaffMutation = gql`
  mutation registerStaffMutation(
    $userRole: String!
    $staffClinics: [Int]
    $userTitle: String
    $username: String
    $email: String!
    $fullName: String!
  ) {
    registerStaff(
      userRole: $userRole
      userTitle: $userTitle
      username: $username
      staffClinics: $staffClinics
      email: $email
      fullName: $fullName
    )
  }
`
export const registerAnaesthetistMutation = gql`
  mutation registerStaffMutation(
    $userRole: String!
    $anaesthetistMass: [Int]
    $userTitle: String
    $username: String
    $email: String!
    $fullName: String!
  ) {
    registerStaff(
      userRole: $userRole
      userTitle: $userTitle
      username: $username
      anaesthetistMass: $anaesthetistMass
      email: $email
      fullName: $fullName
    )
  }
`
export const registerLaboratoryMutation = gql`
  mutation registerStaffMutation(
    $userRole: String!
    $technicianLaboratories: [Int]
    $userTitle: String
    $username: String
    $email: String!
    $fullName: String!
  ) {
    registerStaff(
      userRole: $userRole
      userTitle: $userTitle
      username: $username
      technicianLaboratories: $technicianLaboratories
      email: $email
      fullName: $fullName
    )
  }
`

export const updateUserFormsToCompleteMatrix = gql`
  mutation updateServedFormsMatrix(
    $entryId: Int!,
    $formsToComplete: [Int], 
    $legacyFormsToComplete: [String]
  ) {
    updateUserDetails(
      entryId: $entryId, 
      formsToComplete: $formsToComplete, 
      patientForms: $legacyFormsToComplete
    ) {
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
            formsToComplete {
              id
              slug
              title
            }
          }
        }
      }
    }
  }
`

export const labShadingMutation = gql`
  mutation labShadingMutation(
    $id: ID
    $recordNoteRecord: [Int]
    $recordLabInstructionsLab: [Int]
    $recordLabInstructionsDueDateTime: DateTime
    $recordLabInstructionsOvd: String
    $recordLabInstructionsMidline: String
    $recordLabInstructionsPlane: String
    $recordLabInstructionsOtherInstructions: String
    $recordLabInstructionsShade: String
  ) {
    save_recordNotes_labInstructions_Entry(
      id: $id
      recordLabInstructionsDueDateTime: $recordLabInstructionsDueDateTime
      recordLabInstructionsLab: $recordLabInstructionsLab
      recordLabInstructionsMidline: $recordLabInstructionsMidline
      recordLabInstructionsOtherInstructions: $recordLabInstructionsOtherInstructions
      recordLabInstructionsOvd: $recordLabInstructionsOvd
      recordNoteRecord: $recordNoteRecord
      recordLabInstructionsShade: $recordLabInstructionsShade
      recordLabInstructionsPlane: $recordLabInstructionsPlane
    ) {
      id
    }
  }
`

export const customWarningMutation = gql`
  mutation customWarningMutation($id: ID!, $recordCustomWarning: String) {
    save_records_records_Entry(
      id: $id
      recordCustomWarning: $recordCustomWarning
    ) {
      id
    }
  }
`

export const attachExistingAccountToRecordMutation = gql`
  mutation attachExistingAccountToRecordMutation($id: ID!, $recordPatient: [Int]!) {
    save_records_records_Entry(id: $id, recordPatient: $recordPatient) {
      id
    }
  }
`
