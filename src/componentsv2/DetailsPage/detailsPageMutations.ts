import { gql } from "graphql-request";
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
    $recordFormsCollaborators: [Int]
    $attachedAppointments: [Int]
    $recordTreatmentSurgeons: [Int]
    $recordTreatmentDate: DateTime
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
    $recordLaboratoryStatus: String
    $recordLaboratoryMethod: String
    $recordLaboratoryShade: String
    $recordLaboratoryUpperAnteriorTeethBrandMould: [Int]
    $recordLaboratoryLowerAnteriorTeethBrandMould: [Int]
    $recordLaboratoryUpperPosteriorTeethBrandMould: [Int]
    $recordLaboratoryLowerPosteriorTeethBrandMould: [Int]
    $treatmentProposalSurgicalFacility: [Int]
    $attachedDentalCharts: [Int]
    $recordLeadStage: String
    $enableClinlog: Boolean
    $recordMedicinePrescription: [recordMedicinePrescription_TableRowInput]
    $customWarningsTable: [customWarningsTable_TableRowInput]
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
      attachedAppointments: $attachedAppointments
      recordAnaestheticProcedureTime: $recordAnaestheticProcedureTime
      recordFacilityFee: $recordFacilityFee
      recordLaboratory: $recordLaboratory
      recordLaboratorySetUpTechnician: $recordLaboratorySetUpTechnician
      recordLaboratoryStatus: $recordLaboratoryStatus
      attachedDentalCharts: $attachedDentalCharts
      recordLeadStage: $recordLeadStage
      enableClinlog: $enableClinlog
      recordMedicinePrescription: $recordMedicinePrescription
      customWarningsTable: $customWarningsTable
    ) {
      id
      recordFirstName
      recordLastName
      attachedAppointments {
        id
      }
    }
  }
`;
export const globalPatientDetailsMutation = gql`
  mutation globalPatientDetailsMutation(
    $id: ID
    $title: String
    $recordClinic: [Int]
    $recordFirstName: String
    $recordLastName: String
    $recordHomePhone: String
    $recordMobilePhone: String
    $recordDateOfBirth: DateTime
    $recordLeadType: String
    $recordLeadStatus: String
    $recordEnquiryDate: DateTime
    $recordEnquiryType: String
    $recordPatient: [Int]
    $recordEmail: String
    $attachedRecordsEntry: [Int]
    $attachedDentalCharts: [Int]
    $sex: String
    $attachedLeadsEntry: [Int]
    $recordFlaggedBy: [Int]
  ) {
    save_recordPatientGlobal_default_Entry(
      id: $id
      title: $title
      recordClinic: $recordClinic
      recordFirstName: $recordFirstName
      recordLastName: $recordLastName
      recordEmail: $recordEmail
      recordHomePhone: $recordHomePhone
      recordMobilePhone: $recordMobilePhone
      recordDateOfBirth: $recordDateOfBirth
      recordPatient: $recordPatient
      recordLeadType: $recordLeadType
      recordEnquiryDate: $recordEnquiryDate
      recordEnquiryType: $recordEnquiryType
      recordLeadStatus: $recordLeadStatus
      attachedRecordsEntry: $attachedRecordsEntry
      attachedDentalCharts: $attachedDentalCharts
      attachedLeadsEntry: $attachedLeadsEntry
      sex: $sex
      recordFlaggedBy: $recordFlaggedBy
    ) {
      id
      recordFirstName
      recordLastName
      attachedRecordsEntry {
        id
      }
    }
  }
`;
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
`;

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
`;

export const standardNoteMutation = gql`
  mutation standardNoteMutation(
    $title: String
    $recordNoteNote: String
    $recordNoteRecord: [Int] #$globalRecord: [Int]
  ) {
    save_recordNotes_standardNote_Entry(
      title: $title
      recordNoteRecord: $recordNoteRecord
      recordNoteNote: $recordNoteNote #patientFormGlobal: $globalRecord
    ) {
      id
    }
  }
`;
export const clinlogNoteMutation = gql`
  mutation clinlogNoteMutation(
    $title: String
    $recordNoteNote: String
    $recordNoteRecord: [Int]
  ) {
    save_recordNotes_clinlogNotes_Entry(
      title: $title
      recordNoteRecord: $recordNoteRecord
      recordNoteNote: $recordNoteNote
    ) {
      id
    }
  }
`;

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
`;

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
`;

export const treatmentProposalMutation = gql`
  mutation treatmentProposalMutation(
    $id: ID
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
      id: $id
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
`;

export const proposalStatusMutation = gql`
  mutation proposalStatusMutation($treatmentProposalStatus: String, $id: ID) {
    save_treatmentProposal_default_Entry(
      id: $id
      treatmentProposalStatus: $treatmentProposalStatus
    ) {
      id
    }
  }
`;

export const proposalApprovalMutation = gql`
  mutation proposalApprovalMutation(
    $treatmentProposalTreatmentName: String
    $recordTreatmentProposal: [Int]
    $recordTreatmentSurgeons: [Int]
    $recordTreatmentRestorative: [Int]
    $recordAccountRevenue: Number
    $recordAnaestheticProcedureTime: String
    $recordIssuedProposals: [Int]
    $id: ID
    $recordFacilityFee: Number
    $treatmentProposalSurgicalFacility: [Int]
    $treatmentProposalAnaestheticFeeMatrixBlocks: [treatmentProposalAnaestheticFeeMatrix_MatrixBlockContainerInput]
  ) {
    save_records_records_Entry(
      id: $id
      treatmentProposalTreatmentName: $treatmentProposalTreatmentName
      recordAccountRevenue: $recordAccountRevenue
      recordTreatmentProposal: $recordTreatmentProposal
      recordTreatmentSurgeons: $recordTreatmentSurgeons
      recordTreatmentRestorative: $recordTreatmentRestorative
      treatmentProposalAnaestheticFeeMatrix: {
        sortOrder: ["new1"]
        blocks: $treatmentProposalAnaestheticFeeMatrixBlocks
      }
      recordAnaestheticProcedureTime: $recordAnaestheticProcedureTime
      recordIssuedProposals: $recordIssuedProposals
      recordFacilityFee: $recordFacilityFee
      treatmentProposalSurgicalFacility: $treatmentProposalSurgicalFacility
    ) {
      id
    }
  }
`;

export const recordPaymentSplitMutation = gql`
  mutation recordPaymentSplitMutation(
    $recordPaymentSplitPdfs: [Int]
    $id: ID!
  ) {
    save_records_records_Entry(
      id: $id
      recordPaymentSplitPdfs: $recordPaymentSplitPdfs
    ) {
      id
    }
  }
`;
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
`;

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
`;
export const registerPatientNewMutation = gql`
  mutation registerPatientNewMutation(
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
    $globalId: Int
  ) {
    registerPatientNew(
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
      globalId: $globalId
    )
  }
`;

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
`;
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
`;
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
`;

export const updateUserFormsToCompleteMatrix = gql`
  mutation updateServedFormsMatrix(
    $entryId: Int!
    $formsToComplete: [Int]
    $legacyFormsToComplete: [String]
    $formsServedBy: [Int]
  ) {
    updateUserDetailsNew(
      entryId: $entryId
      formsToComplete: $formsToComplete
      patientForms: $legacyFormsToComplete
      formsServedBy: $formsServedBy
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
`;

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
    $recordLabInstructionsShade: String #$recordAttachedTreatments: [Int]
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
      recordLabInstructionsPlane: $recordLabInstructionsPlane #recordAttachedTreatments: $recordAttachedTreatments
    ) {
      id
    }
  }
`;

export const customWarningMutation = gql`
  mutation customWarningMutation($id: ID!, $recordCustomWarning: String) {
    save_records_records_Entry(
      id: $id
      recordCustomWarning: $recordCustomWarning
    ) {
      id
    }
  }
`;
export const attachExistingAccountToGlobalMutation = gql`
  mutation attachExistingAccountToGlobalMutation(
    $id: ID!
    $recordPatient: [Int]!
  ) {
    save_recordPatientGlobal_default_Entry(
      id: $id
      recordPatient: $recordPatient
    ) {
      id
    }
  }
`;
export const attachExistingAccountToRecordMutation = gql`
  mutation attachExistingAccountToRecordMutation(
    $id: ID!
    $recordPatient: [Int]!
  ) {
    save_records_records_Entry(id: $id, recordPatient: $recordPatient) {
      id
    }
  }
`;
export const updateTreatmentPlanItemsMutation = gql`
  mutation treatmentPlanItemsMutation(
    $id: ID!
    $chartTable: [chartTable_TableRowInput]
  ) {
    save_treatmentPlanItems_itemDetails_Entry(
      id: $id
      chartTable: $chartTable
    ) {
      id
    }
  }
`;

export const treatmentPlanItemsMutation = gql`
  mutation treatmentPlanItemsMutation(
    $id: ID
    $title: String
    $chartStatus: String
    $chartType: String
    $recordTreatmentProposal: [Int]
    $defaultDentist: [Int]
    $proposedTreatmentToothMatrixBlocks: [proposedTreatmentToothMatrix_MatrixBlockContainerInput]
    $proposedTreatmentToothMatrixSortOrder: [QueryArgument]
  ) {
    save_dentalChartRecords_proposedTreatmentChart_Entry(
      id: $id
      title: $title
      chartStatus: $chartStatus
      chartType: $chartType
      defaultDentist: $defaultDentist
      recordTreatmentProposal: $recordTreatmentProposal
      proposedTreatmentToothMatrix: {
        sortOrder: $proposedTreatmentToothMatrixSortOrder
        blocks: $proposedTreatmentToothMatrixBlocks
      }
    ) {
      id
    }
  }
`;

export const updateTreatmentPaymentStatusMutation = gql`
  mutation updateTreatmentPaymentStatusMutation(
    $id: ID
    $recordTreatmentPaymentStatus: String
    $paymentDate: DateTime
  ) {
    save_stripeInvoices_default_Entry(
      id: $id
      recordTreatmentPaymentStatus: $recordTreatmentPaymentStatus
      paymentDate: $paymentDate
    ) {
      id
    }
  }
`;
export const stripeInvoiceItemsMutation = gql`
  mutation treatmentPlanItemsMutation(
    $id: ID
    $title: String
    $recordTreatmentPaymentStatus: String
    $recordIdForRef: String
    $patientFormGlobal: [Int]
    $stripeAccountName: String
    $stripeAccountId: String
    $totalAmount: String
    $paidAmount: String
    $paymentDate: DateTime
    $paymentMethod: String
    $recordNoteNote: String
    $proposedTreatmentToothMatrixBlocks: [proposedTreatmentToothMatrix_MatrixBlockContainerInput]
    $proposedTreatmentToothMatrixSortOrder: [QueryArgument]
  ) {
    save_stripeInvoices_default_Entry(
      id: $id
      title: $title
      recordTreatmentPaymentStatus: $recordTreatmentPaymentStatus
      recordIdForRef: $recordIdForRef
      patientFormGlobal: $patientFormGlobal
      stripeAccountName: $stripeAccountName
      stripeAccountId: $stripeAccountId
      paymentDate: $paymentDate
      totalAmount: $totalAmount
      paidAmount: $paidAmount
      paymentMethod: $paymentMethod
      recordNoteNote: $recordNoteNote
      proposedTreatmentToothMatrix: {
        sortOrder: $proposedTreatmentToothMatrixSortOrder
        blocks: $proposedTreatmentToothMatrixBlocks
      }
    ) {
      id
    }
  }
`;
export const stripeTransferMutation = gql`
  mutation stripeTransferMutation(
    $id: ID
    $title: String
    $transferStatus: String
    $recordIdForRef: String
    $recordClinic: [Int]
    $transferPaymentTo: String
    $totalAmount: String
    $paidAmount: String
    $paymentDate: DateTime
    $description: String
  ) {
    save_stripeInvoices_internalTransfer_Entry(
      id: $id
      title: $title
      transferStatus: $transferStatus
      recordIdForRef: $recordIdForRef
      recordClinic: $recordClinic
      transferPaymentTo: $transferPaymentTo
      paymentDate: $paymentDate
      totalAmount: $totalAmount
    ) {
      id
    }
  }
`;
export const stripeRecordDepositMutation = gql`
  mutation stripeRecordDepositMutation(
    $id: ID
    $title: String
    $depositStatus: String
    $recordIdForRef: String
    $recordClinic: [Int]
    $patientFormGlobal: [Int]
    $prePaymentOrDeposit: String
    $paymentDate: DateTime
    $paymentMethod: String
    $description: String
  ) {
    save_stripeInvoices_recordDeposit_Entry(
      id: $id
      title: $title
      depositStatus: $depositStatus
      recordIdForRef: $recordIdForRef
      recordClinic: $recordClinic
      patientFormGlobal: $patientFormGlobal
      prePaymentOrDeposit: $prePaymentOrDeposit
      paymentDate: $paymentDate
      paymentMethod: $paymentMethod
      description: $description
    ) {
      id
    }
  }
`;
export const treatmentPlanExistingConditionsMutation = gql`
  mutation treatmentPlanExistingConditionsMutation(
    $title: String
    $id: ID
    $existingConditionToothMatrixBlocks: [existingConditionToothMatrix_MatrixBlockContainerInput]
    $existingConditionToothMatrixSortOrder: [QueryArgument]
    $chartStatus: String
    $chartType: String
  ) {
    save_dentalChartRecords_existingConditionChart_Entry(
      id: $id
      title: $title
      chartStatus: $chartStatus
      chartType: $chartType
      existingConditionToothMatrix: {
        sortOrder: $existingConditionToothMatrixSortOrder
        blocks: $existingConditionToothMatrixBlocks
      }
    ) {
      id
    }
  }
`;

export const itemSpecificationMutation = gql`
  mutation itemSpecificationMutation(
    $id: ID
    $title: String
    $itemSpecificationMatrixBlocks: [itemSpecificationMatrix_MatrixBlockContainerInput]
    $itemSpecificationMatrixSortOrder: [QueryArgument]
  ) {
    save_treatmentItemSpecificationRecord_itemSpecificationAndDetails_Entry(
      id: $id
      title: $title
      itemSpecificationMatrix: {
        sortOrder: $itemSpecificationMatrixSortOrder
        blocks: $itemSpecificationMatrixBlocks
      }
    ) {
      id
    }
  }
`;
export const itemSpecificationBarMutation = gql`
  mutation itemSpecificationMutation(
    $id: ID
    $title: String
    $archLocation: String
    $barMaterial: String
    $barLengthFrom: String
    $barLengthTo: String
    $barType: String
  ) {
    save_treatmentItemSpecificationRecord_barSpecifications_Entry(
      id: $id
      title: $title
      archLocation: $archLocation
      barMaterial: $barMaterial
      barLengthFrom: $barLengthFrom
      barLengthTo: $barLengthTo
      barType: $barType
    ) {
      id
    }
  }
`;
export const updateTreatmentChartMutation = gql`
  mutation updateTreatmentChartMutation(
    $id: ID!
    $chartStatus: String
    $chartStage: String
    $attachedPlanItems: [Int]
  ) {
    save_treatmentChart_chart_Entry(
      id: $id
      chartStatus: $chartStatus
      chartStage: $chartStage
      attachedPlanItems: $attachedPlanItems
    ) {
      id
    }
  }
`;
export const createDentalExistingChartMutation = gql`
  mutation createDentalExistingChartMutation(
    $title: String
    $chartStatus: String
    $chartType: String
    $sortOrderIds: [QueryArgument]
    $updatedConditionBlock: [existingConditionToothMatrix_MatrixBlockContainerInput]
  ) {
    save_dentalChartRecords_existingConditionChart_Entry(
      title: $title
      chartStatus: $chartStatus
      chartType: $chartType
      existingConditionToothMatrix: {
        sortOrder: $sortOrderIds
        blocks: $updatedConditionBlock
      }
    ) {
      id
    }
  }
`;
export const updateDentalExistingChartMutation = gql`
  mutation updateDentalExistingChartMutation(
    $id: ID!
    $chartStatus: String
    $chartType: String
    $sortOrderIds: [QueryArgument]
    $updatedConditionBlock: [existingConditionToothMatrix_MatrixBlockContainerInput]
  ) {
    save_dentalChartRecords_existingConditionChart_Entry(
      id: $id
      chartStatus: $chartStatus
      chartType: $chartType
      existingConditionToothMatrix: {
        sortOrder: $sortOrderIds
        blocks: $updatedConditionBlock
      }
    ) {
      id
    }
  }
`;
export const createDentalFollowUpChartMutation = gql`
  mutation createDentalFollowUpChartMutation(
    $title: String
    $chartStatus: String
    $chartType: String
    $defaultDentist: [Int]
    $sortOrderIds: [QueryArgument]
    $updatedProposedTreatmentBlock: [proposedTreatmentToothMatrix_MatrixBlockContainerInput]
  ) {
    save_dentalChartRecords_followUpChart_Entry(
      title: $title
      chartStatus: $chartStatus
      chartType: $chartType
      defaultDentist: $defaultDentist
      proposedTreatmentToothMatrix: {
        sortOrder: $sortOrderIds
        blocks: $updatedProposedTreatmentBlock
      }
    ) {
      id
    }
  }
`;
export const updateDentalFollowUpChartMutation = gql`
  mutation updateDentalFollowUpChartMutation(
    $id: ID!
    $chartStatus: String
    $chartType: String
    $sortOrderIds: [QueryArgument]
    $updatedProposedTreatmentBlock: [proposedTreatmentToothMatrix_MatrixBlockContainerInput]
  ) {
    save_dentalChartRecords_followUpChart_Entry(
      id: $id
      chartStatus: $chartStatus
      chartType: $chartType
      proposedTreatmentToothMatrix: {
        sortOrder: $sortOrderIds
        blocks: $updatedProposedTreatmentBlock
      }
    ) {
      id
    }
  }
`;
export const updateProposalDepositMutation = gql`
  mutation updateProposalDepositMutation(
    $id: ID
    $prePaymentDepositMatrixBlocks: [prePaymentDepositMatrix_MatrixBlockContainerInput]
    $prePaymentDepositMatrixBlocksSortOrder: [QueryArgument]
  ) {
    save_dentalChartRecords_proposedTreatmentChart_Entry(
      id: $id

      prePaymentDepositMatrix: {
        sortOrder: $prePaymentDepositMatrixBlocksSortOrder
        blocks: $prePaymentDepositMatrixBlocks
      }
    ) {
      id
    }
  }
`;
export const updateInvoiceDentalProposedChartMutation = gql`
  mutation createDentalProposedChartMutation(
    $id: ID
    $attachedStripeInvoices: [Int]
    $proposedTreatmentToothMatrixBlocks: [proposedTreatmentToothMatrix_MatrixBlockContainerInput]
    $proposedTreatmentToothMatrixSortOrder: [QueryArgument]
  ) {
    save_dentalChartRecords_proposedTreatmentChart_Entry(
      id: $id

      attachedStripeInvoices: $attachedStripeInvoices

      proposedTreatmentToothMatrix: {
        sortOrder: $proposedTreatmentToothMatrixSortOrder
        blocks: $proposedTreatmentToothMatrixBlocks
      }
    ) {
      id
    }
  }
`;
export const createDentalProposedChartMutation = gql`
  mutation createDentalProposedChartMutation(
    $id: ID
    $title: String
    $chartStatus: String
    $chartType: String
    $defaultDentist: [Int]
    $isExternalDentist: Boolean
    $treatmentProposalCoordinator: [Int]
    $attachedStripeInvoices: [Int]
    $chartingNurse: [Int]
    $recordEnquiryType: String
    $treatmentProposalTreatment: [Int]
    $treatmentProposalTreatmentName: String
    $proposedTreatmentToothMatrixBlocks: [proposedTreatmentToothMatrix_MatrixBlockContainerInput]
    $proposedTreatmentToothMatrixSortOrder: [QueryArgument]
    $anaestheticDetailsMatrixBlocks: [anaestheticDetailsMatrix_MatrixBlockContainerInput]
    $anaestheticDetailsMatrixBlocksSortOrder: [QueryArgument]
    $treatmentProposalSectionBlocks: [treatmentProposalSectionOptions_MatrixBlockContainerInput]
    $treatmentProposalSectionBlocksSortOrder: [QueryArgument]
    $prePaymentDepositMatrixBlocks: [prePaymentDepositMatrix_MatrixBlockContainerInput]
    $prePaymentDepositMatrixBlocksSortOrder: [QueryArgument]
    $laboratoryDetailsMatrixBlocks: [laboratoryDetailsMatrix_MatrixBlockContainerInput]
    $laboratoryDetailsMatrixBlocksSortOrder: [QueryArgument]
    $patientFormRecord: [Int]
    $patientFormGlobal: [Int]
  ) {
    save_dentalChartRecords_proposedTreatmentChart_Entry(
      id: $id
      title: $title
      chartStatus: $chartStatus
      chartType: $chartType
      defaultDentist: $defaultDentist
      isExternalDentist: $isExternalDentist
      chartingNurse: $chartingNurse
      recordEnquiryType: $recordEnquiryType
      attachedStripeInvoices: $attachedStripeInvoices
      treatmentProposalTreatment: $treatmentProposalTreatment
      treatmentProposalCoordinator: $treatmentProposalCoordinator
      treatmentProposalTreatmentName: $treatmentProposalTreatmentName
      proposedTreatmentToothMatrix: {
        sortOrder: $proposedTreatmentToothMatrixSortOrder
        blocks: $proposedTreatmentToothMatrixBlocks
      }
      anaestheticDetailsMatrix: {
        sortOrder: $anaestheticDetailsMatrixBlocksSortOrder
        blocks: $anaestheticDetailsMatrixBlocks
      }
      treatmentProposalSectionOptions: {
        sortOrder: $treatmentProposalSectionBlocksSortOrder
        blocks: $treatmentProposalSectionBlocks
      }
      prePaymentDepositMatrix: {
        sortOrder: $prePaymentDepositMatrixBlocksSortOrder
        blocks: $prePaymentDepositMatrixBlocks
      }
      laboratoryDetailsMatrix: {
        sortOrder: $laboratoryDetailsMatrixBlocksSortOrder
        blocks: $laboratoryDetailsMatrixBlocks
      }
      patientFormRecord: $patientFormRecord
      patientFormGlobal: $patientFormGlobal
    ) {
      id
    }
  }
`;
export const legacyProposalStatusMutation = gql`
  mutation legacyProposalStatusMutation(
    $id: ID!
    $treatmentProposalStatus: String
  ) {
    save_dentalChartRecords_proposedTreatmentChart_Entry(
      id: $id
      chartStatus: $treatmentProposalStatus
    ) {
      id
    }
  }
`;

export const updateDentalProposedChartMutation = gql`
  mutation updateDentalProposedChartMutation(
    $id: ID!
    $chartStatus: String
    $chartType: String
    $recordTreatmentDate: DateTime
    $sortOrderIds: [QueryArgument]
    $updatedProposedTreatmentBlock: [proposedTreatmentToothMatrix_MatrixBlockContainerInput]
  ) {
    save_dentalChartRecords_proposedTreatmentChart_Entry(
      id: $id
      chartStatus: $chartStatus
      chartType: $chartType
      recordTreatmentDate: $recordTreatmentDate
      proposedTreatmentToothMatrix: {
        sortOrder: $sortOrderIds
        blocks: $updatedProposedTreatmentBlock
      }
    ) {
      id
    }
  }
`;

export const createTreatmentChartMutation = gql`
  mutation createTreatmentChartMutation(
    $title: String
    $chartStatus: String
    $chartStage: String
    $attachedPlanItems: [Int]
    $baseChart: [Int]
    $chartType: String
    $defaultDentist: [Int]
  ) {
    save_treatmentChart_chart_Entry(
      title: $title
      chartStatus: $chartStatus
      chartStage: $chartStage
      attachedPlanItems: $attachedPlanItems
      baseChart: $baseChart
      chartType: $chartType
      defaultDentist: $defaultDentist
    ) {
      id
    }
  }
`;

export const createSiteSpecificFollowUpMutation = gql`
  mutation createSiteSpecificFollowUpMutation(
    $boneLoss: String
    $dateOfFirstAbutmentLevelComplication: DateTime
    $firstAbutmentLevelComplication: String
    $firstAbutmentLevelComplicationTimeFromSurgery: String
    $implantFunctionAtFollowUp: String
    $midShaftSoftTissueDehiscence: String
    $otherAbutmentLevelComplications: String
    $facialSwelling: String
    $inflammation: String
    $pain: String
    $postOperativeSinusDisease: String
    $recession: String
    $sinusitis: String
    $suppuration: String
    $title: String
    $totalNumberOfAbutmentLevelComplications: String
    $recordFollowUpDate: DateTime
  ) {
    save_siteSpecificFollowUp_default_Entry(
      boneLoss: $boneLoss
      dateOfFirstAbutmentLevelComplication: $dateOfFirstAbutmentLevelComplication
      firstAbutmentLevelComplication: $firstAbutmentLevelComplication
      firstAbutmentLevelComplicationTimeFromSurgery: $firstAbutmentLevelComplicationTimeFromSurgery
      implantFunctionAtFollowUp: $implantFunctionAtFollowUp
      midShaftSoftTissueDehiscence: $midShaftSoftTissueDehiscence
      otherAbutmentLevelComplications: $otherAbutmentLevelComplications
      facialSwelling: $facialSwelling
      inflammation: $inflammation
      pain: $pain
      postOperativeSinusDisease: $postOperativeSinusDisease
      recession: $recession
      sinusitis: $sinusitis
      suppuration: $suppuration
      title: $title
      totalNumberOfAbutmentLevelComplications: $totalNumberOfAbutmentLevelComplications
      recordFollowUpDate: $recordFollowUpDate
    ) {
      id
    }
  }
`;

export const updateSiteSpecificFollowUpMutation = gql`
  mutation updateSiteSpecificFollowUpMutation(
    $id: ID!
    $boneLoss: String
    $dateOfFirstAbutmentLevelComplication: DateTime
    $firstAbutmentLevelComplication: String
    $firstAbutmentLevelComplicationTimeFromSurgery: String
    $implantFunctionAtFollowUp: String
    $abutmentFunctionAtFollowUp: String
    $midShaftSoftTissueDehiscence: String
    $otherAbutmentLevelComplications: String
    $facialSwelling: String
    $inflammation: String
    $pain: String
    $postOperativeSinusDisease: String
    $recession: String
    $sinusitis: String
    $suppuration: String
    $totalNumberOfAbutmentLevelComplications: String
    $recordFollowUpDate: DateTime
  ) {
    save_siteSpecificFollowUp_default_Entry(
      id: $id
      boneLoss: $boneLoss
      dateOfFirstAbutmentLevelComplication: $dateOfFirstAbutmentLevelComplication
      firstAbutmentLevelComplication: $firstAbutmentLevelComplication
      firstAbutmentLevelComplicationTimeFromSurgery: $firstAbutmentLevelComplicationTimeFromSurgery
      implantFunctionAtFollowUp: $implantFunctionAtFollowUp
      abutmentFunctionAtFollowUp: $abutmentFunctionAtFollowUp
      midShaftSoftTissueDehiscence: $midShaftSoftTissueDehiscence
      otherAbutmentLevelComplications: $otherAbutmentLevelComplications
      facialSwelling: $facialSwelling
      inflammation: $inflammation
      pain: $pain
      postOperativeSinusDisease: $postOperativeSinusDisease
      recession: $recession
      sinusitis: $sinusitis
      suppuration: $suppuration
      totalNumberOfAbutmentLevelComplications: $totalNumberOfAbutmentLevelComplications
      recordFollowUpDate: $recordFollowUpDate
    ) {
      id
    }
  }
`;
