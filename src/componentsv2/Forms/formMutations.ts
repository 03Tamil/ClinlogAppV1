import { gql } from "graphql-request";

export const MedicalDentalHistoryFormMutation = gql`
  mutation MedicalDentalHistoryFormMutation(
    $id: ID
    $title: String
    $manualUpload: Boolean
    $patientFormRecord: [Int]
    $patientFormGlobal: [Int]
    $lastEditedBy: [Int]
    $formModificationDate: DateTime
    $patientFormUploadedPdf: [Int]
    $allergies: [String]
    $additionalAllergies: String
    $conditions: [String]
    $additionalConditions: String
    $recentHealth: [String]
    $ladyConditions: [String]
    $additionalHealth: String
    $prescribedMedication: String
    $prescribedMedicationTable: [prescribedMedicationTable_TableRowInput]
    $bloodThinners: [String]
    $vitamins: String
    $additionalVitamins: String
    $artificialBodyParts: String
    $additionalArtificialBodyParts: String
    $anyCancer: String
    $anyCancerDetails: String
    $boneDisease: String
    $additionalBoneDisease: String
    $bisphosphonate: String
    $additionalBisphosphonate: String
    $glp1Medication: String
    $additionalGlp1Medication: String
    $sglt2Inhibitors: String
    $doesSmoke: String
    $doesAlcohol: String
    $doesDrugs: String
    $dentalMaintenance: [String]
    $priorDentalMaintenance: [String]
    $dentureHistory: String
    $dentureHistoryCheck: [String]
    $oralFunctionStatements: [String]
    $appearanceOptions: [String]
    $teethOptions: [String]
    $scale: String
    $presentingComplaint: String
    $signatureName: String
    $signedPatientGuardian: String
    $formSubmissionStatus: String
    $enabled: Boolean
    $author: ID
  ) {
    save_matrixForms_patientFormMedicalDentalHistory_Entry(
      id: $id
      title: $title
      manualUpload: $manualUpload
      authorId: $author
      slug: ""
      patientFormRecord: $patientFormRecord
      patientFormGlobal: $patientFormGlobal
      patientFormUploadedPdf: $patientFormUploadedPdf
      formSubmissionStatus: $formSubmissionStatus
      lastEditedBy: $lastEditedBy
      formModificationDate: $formModificationDate
      enabled: $enabled
      patientFormMedicalDentalHistory: {
        blocks: {
          formfields: {
            id: "new1"
            allergies: $allergies
            additionalAllergies: $additionalAllergies
            conditions: $conditions
            additionalConditions: $additionalConditions
            recentHealth: $recentHealth
            ladyConditions: $ladyConditions
            additionalHealth: $additionalHealth
            prescribedMedication: $prescribedMedication
            prescribedMedicationTable: $prescribedMedicationTable
            bloodThinners: $bloodThinners
            vitamins: $vitamins
            additionalVitamins: $additionalVitamins
            artificialBodyParts: $artificialBodyParts
            additionalArtificialBodyParts: $additionalArtificialBodyParts
            anyCancer: $anyCancer
            anyCancerDetails: $anyCancerDetails
            boneDisease: $boneDisease
            additionalBoneDisease: $additionalBoneDisease
            bisphosphonate: $bisphosphonate
            additionalBisphosphonate: $additionalBisphosphonate
            glp1Medication: $glp1Medication
            additionalGlp1Medication: $additionalGlp1Medication
            sglt2Inhibitors: $sglt2Inhibitors
            doesSmoke: $doesSmoke
            doesAlcohol: $doesAlcohol
            doesDrugs: $doesDrugs
            dentalMaintenance: $dentalMaintenance
            priorDentalMaintenance: $priorDentalMaintenance
            dentureHistory: $dentureHistory
            dentureHistoryCheck: $dentureHistoryCheck
            oralFunctionStatements: $oralFunctionStatements
            appearanceOptions: $appearanceOptions
            teethOptions: $teethOptions
            scale: $scale
            presentingComplaint: $presentingComplaint
            signatureName: $signatureName
            signedPatientGuardian: $signedPatientGuardian
          }
        }
        sortOrder: ["new1"]
      }
    ) {
      id
    }
  }
`;

export const PatientDetailsFormMutation = gql`
  mutation PatientDetailsFormMutation(
    $id: ID
    $title: String
    $patientFormRecord: [Int]
    $patientFormGlobal: [Int]
    $patientFormUploadedPdf: [Int]
    $workPhoneNo: String
    $state: String
    $signature: String
    $postcode: String
    $phoneNumber: String
    $occupation: String
    $nextOfKinPhoneNo: String
    $nextOfKinEmergencyContact: String
    $medicalPractitioner: String
    $lastName: String
    $formUserId: [Int]
    $honorificTitle: String
    $homePhone: String
    $firstName: String
    $email: String
    $driversLicenceNo: String
    $dateOfBirth: DateTime
    $consentCheck: [String]
    $city: String
    $address: String
    $businessFirmEmployer: String
    $formSubmissionStatus: String
    $enabled: Boolean
    $author: ID
    $lastEditedBy: [Int]
    $formModificationDate: DateTime
  ) {
    save_matrixForms_patientFormPatientDetails_Entry(
      id: $id
      title: $title
      slug: ""
      enabled: $enabled
      authorId: $author
      patientFormRecord: $patientFormRecord
      patientFormGlobal: $patientFormGlobal
      formSubmissionStatus: $formSubmissionStatus
      patientFormUploadedPdf: $patientFormUploadedPdf
      lastEditedBy: $lastEditedBy
      formModificationDate: $formModificationDate

      patientFormPatientDetails: {
        blocks: {
          formfields: {
            id: "new1"
            formUserId: $formUserId
            workPhoneNo: $workPhoneNo
            state: $state
            signature: $signature
            postcode: $postcode
            phoneNumber: $phoneNumber
            occupation: $occupation
            nextOfKinPhoneNo: $nextOfKinPhoneNo
            nextOfKinEmergencyContact: $nextOfKinEmergencyContact
            medicalPractitioner: $medicalPractitioner
            lastName: $lastName
            honorificTitle: $honorificTitle
            homePhone: $homePhone
            firstName: $firstName
            email: $email
            driversLicenceNo: $driversLicenceNo
            dateOfBirth: $dateOfBirth
            consentCheck: $consentCheck
            city: $city
            address: $address
            businessFirmEmployer: $businessFirmEmployer
          }
        }
        sortOrder: ["new1"]
      }
    ) {
      id
    }
  }
`;
export const PatientSurveyFormMutation = gql`
  mutation PatientSurveyFormMutation(
    $title: String
    $patientFormRecord: [Int]
    $patientFormUploadedPdf: [Int]
    $formModificationDate: DateTime
    $formSubmissionStatus: String
    $lastEditedBy: [Int]
    $patientSurveyMatrixBlock: [patientSurveyMatrix_MatrixBlockContainerInput]
    $sortOrder: [QueryArgument]
    $manualUpload: Boolean
    $recordTreatmentDate: DateTime
  ) {
    save_matrixForms_patientSurveyForm_Entry(
      title: $title
      manualUpload: $manualUpload
      patientFormRecord: $patientFormRecord
      formSubmissionStatus: $formSubmissionStatus
      patientFormUploadedPdf: $patientFormUploadedPdf
      formModificationDate: $formModificationDate
      lastEditedBy: $lastEditedBy
      recordTreatmentDate: $recordTreatmentDate
      patientSurveyMatrix: {
        blocks: $patientSurveyMatrixBlock
        sortOrder: $sortOrder
      }
    ) {
      id
    }
  }
`;
export const genericFormSubmissionStatusMutation = (mutationText) => {
  return gql`
    mutation PatientDetailsFormMutation(
      $id: ID
      $formSubmissionStatus: String
      $lastEditedBy: [Int]
      $formModificationDate: DateTime
    ) {
      ${mutationText}(
        id: $id
        formSubmissionStatus: $formSubmissionStatus
        lastEditedBy: $lastEditedBy
        formModificationDate: $formModificationDate
      ) {
        id
      }
    }
  `;
};
export const PreAnaestheticInformationFormMutation = gql`
  mutation PreAnaestheticInformationFormMutation(
    $title: String
    $patientFormRecord: [Int]
    $patientFormUploadedPdf: [Int]
    $email: String
    $age: String
    $addressAfterSurgery: String
    $bmi: String
    $experiencedNausea: String
    $experiencedNauseaDetails: String
    $firstName: String
    $formUserId: [Int]
    $howFarCanYouWalk: String
    $haveDenturesDetails: String
    $haveDentures: String
    $hadRadioTherapyDetails: String
    $hadRadioTherapy: String
    $hadLapBandDetails: String
    $hadLapBand: String
    $hadAnaestheticComplicationsDetails: String
    $hadAnaestheticComplications: String
    $lastName: String
    $nameOfPersonPickingYouUp: String
    $personPickingUpHomePhone: String
    $personPickingUpMobile: String
    $personPickingUpWorkPhone: String
    $pleaseListPreviousOperations: String
    $relationToPersonPickingUp: String
    $surgeryToTheHeadNeck: String
    $surgeryToTheHeadNeckDetails: String
    $yourWeight: String
    $yourHeight: String
    $formSubmissionStatus: String
  ) {
    save_matrixForms_patientFormPreAnaestheticInformation_Entry(
      title: $title
      slug: ""
      patientFormRecord: $patientFormRecord
      formSubmissionStatus: $formSubmissionStatus
      patientFormUploadedPdf: $patientFormUploadedPdf
      patientFormPreAnaestheticInformation: {
        blocks: {
          formfields: {
            id: "new1"
            addressAfterSurgery: $addressAfterSurgery
            age: $age
            yourWeight: $yourWeight
            yourHeight: $yourHeight
            surgeryToTheHeadNeckDetails: $surgeryToTheHeadNeckDetails
            surgeryToTheHeadNeck: $surgeryToTheHeadNeck
            relationToPersonPickingUp: $relationToPersonPickingUp
            pleaseListPreviousOperations: $pleaseListPreviousOperations
            personPickingUpWorkPhone: $personPickingUpWorkPhone
            personPickingUpMobile: $personPickingUpMobile
            personPickingUpHomePhone: $personPickingUpHomePhone
            nameOfPersonPickingYouUp: $nameOfPersonPickingYouUp
            lastName: $lastName
            howFarCanYouWalk: $howFarCanYouWalk
            haveDenturesDetails: $haveDenturesDetails
            haveDentures: $haveDentures
            hadRadioTherapyDetails: $hadRadioTherapyDetails
            hadRadioTherapy: $hadRadioTherapy
            hadLapBandDetails: $hadLapBandDetails
            hadLapBand: $hadLapBand
            hadAnaestheticComplicationsDetails: $hadAnaestheticComplicationsDetails
            hadAnaestheticComplications: $hadAnaestheticComplications
            formUserId: $formUserId
            firstName: $firstName
            experiencedNauseaDetails: $experiencedNauseaDetails
            experiencedNausea: $experiencedNausea
            email: $email
            bmi: $bmi
          }
        }
        sortOrder: ["new1"]
      }
    ) {
      id
    }
  }
`;

export const AnaestheticConsentAuthorityFormMutation = gql`
  mutation AnaestheticConsentAuthorityFormMutation(
    $title: String
    $patientFormRecord: [Int]
    $patientFormUploadedPdf: [Int]
    $formUserId: [Int]
    $email: String
    $patientType: String
    $firstName: String
    $lastName: String
    $homeAddress: String
    $citySuburb: String
    $state: String
    $postcode: String
    $patientFullName: String
    $surgicalProcedure: String
    $dentistName: String
    $risksInvolvedConsent: String
    $risksInvolvedConsentCheck: [String]
    $signature: String
    $dateSigned: DateTime
    $serviceFee: String
    $anaestheticFee: String
    $approxMedicareRebate: String
    $facilityFee: String
    $formSubmissionStatus: String
  ) {
    save_matrixForms_patientFormAnaestheticConsentAuthority_Entry(
      title: $title
      slug: ""
      patientFormRecord: $patientFormRecord
      formSubmissionStatus: $formSubmissionStatus
      patientFormUploadedPdf: $patientFormUploadedPdf
      patientFormAnaestheticConsentAuthority: {
        sortOrder: "new1"
        blocks: {
          formfields: {
            id: "new1"
            formUserId: $formUserId
            email: $email
            patientType: $patientType
            firstName: $firstName
            lastName: $lastName
            homeAddress: $homeAddress
            citySuburb: $citySuburb
            state: $state
            postcode: $postcode
            patientFullName: $patientFullName
            surgicalProcedure: $surgicalProcedure
            dentistName: $dentistName
            risksInvolvedConsent: $risksInvolvedConsent
            risksInvolvedConsentCheck: $risksInvolvedConsentCheck
            signature: $signature
            dateSigned: $dateSigned
            serviceFee: $serviceFee
            anaestheticFee: $anaestheticFee
            approxMedicareRebate: $approxMedicareRebate
            facilityFee: $facilityFee
          }
        }
      }
    ) {
      id
    }
  }
`;

export const WaterPikFormMutation = gql`
  mutation WaterPikFormMutation(
    $title: String
    $patientFormRecord: [Int]
    $patientFormUploadedPdf: [Int]
    $formUserId: [Int]
    $firstName: String
    $lastName: String
    $email: String
    $phone: String
    $acceptTermsConditions: [String]
    $formSubmissionStatus: String
  ) {
    save_matrixForms_patientFormFreeWaterpikOffer_Entry(
      title: $title
      slug: ""
      patientFormRecord: $patientFormRecord
      formSubmissionStatus: $formSubmissionStatus
      patientFormUploadedPdf: $patientFormUploadedPdf
      patientFormFreeWaterpikOffer: {
        sortOrder: "new1"
        blocks: {
          formfields: {
            id: "new1"
            formUserId: $formUserId
            firstName: $firstName
            lastName: $lastName
            email: $email
            phone: $phone
            acceptTermsConditions: $acceptTermsConditions
          }
        }
      }
    ) {
      id
    }
  }
`;

export const ImageConsentFormMutation = gql`
  mutation ImageConsentFormMutation(
    $title: String
    $patientFormRecord: [Int]
    $patientFormUploadedPdf: [Int]
    $formUserId: [Int]
    $firstName: String
    $lastName: String
    $email: String
    $homePhone: String
    $patientSignature: String
    $date: DateTime
    $formSubmissionStatus: String
  ) {
    save_matrixForms_patientFormImageConsent_Entry(
      title: $title
      slug: ""
      patientFormRecord: $patientFormRecord
      formSubmissionStatus: $formSubmissionStatus
      patientFormUploadedPdf: $patientFormUploadedPdf
      patientFormImageConsent: {
        sortOrder: "new1"
        blocks: {
          formfields: {
            id: "new1"
            formUserId: $formUserId
            firstName: $firstName
            lastName: $lastName
            email: $email
            homePhone: $homePhone
            patientSignature: $patientSignature
            date: $date
          }
        }
      }
    ) {
      id
    }
  }
`;

export const GuaranteesUpgradesFormMutation = gql`
  mutation GuaranteesUpgradesFormMutation(
    $title: String
    $patientFormRecord: [Int]
    $patientFormUploadedPdf: [Int]
    $formUserId: [Int]
    $firstName: String
    $lastName: String
    $email: String
    $patientSignature: String
    $acceptPrePaid: String
    $date: DateTime
    $formSubmissionStatus: String
  ) {
    save_matrixForms_patientFormGuaranteesUpgrades_Entry(
      title: $title
      slug: ""
      patientFormRecord: $patientFormRecord
      formSubmissionStatus: $formSubmissionStatus
      patientFormUploadedPdf: $patientFormUploadedPdf
      patientFormGuaranteesUpgrades: {
        sortOrder: "new1"
        blocks: {
          formfields: {
            id: "new1"
            formUserId: $formUserId
            firstName: $firstName
            lastName: $lastName
            acceptPrePaid: $acceptPrePaid
            email: $email
            patientSignature: $patientSignature
            date: $date
          }
        }
      }
    ) {
      id
    }
  }
`;

export const InformationConsentFormMutation = gql`
  mutation InformationConsentFormMutation(
    $title: String
    $patientFormRecord: [Int]
    $formSubmissionStatus: String
    $patientFormUploadedPdf: [Int]
    $formUserId: [Int]
    $patientName: String
    $dentistName: String
    $signaturePatient: String
    $signatureDate: DateTime
    $signersName: String
    $signersRelationshipPatient: String
  ) {
    save_matrixForms_patientFormConsentForm_Entry(
      title: $title
      slug: ""
      patientFormRecord: $patientFormRecord
      formSubmissionStatus: $formSubmissionStatus
      patientFormUploadedPdf: $patientFormUploadedPdf
      patientFormConsentForm: {
        sortOrder: "new1"
        blocks: {
          formfields: {
            id: "new1"
            formUserId: $formUserId
            patientName: $patientName
            dentistName: $dentistName
            signaturePatient: $signaturePatient
            signatureDate: $signatureDate
            signersName: $signersName
            signersRelationshipPatient: $signersRelationshipPatient
          }
        }
      }
    ) {
      id
    }
  }
`;

export const SecuredFinanceFormMutation = gql`
  mutation SecuredFinanceFormMutation(
    $title: String
    $patientFormRecord: [Int]
    $patientFormUploadedPdf: [Int]
    $formUserId: [Int]
    $firstName: String
    $lastName: String
    $email: String
    $address: String
    $estimatedValueOfProperty: String
    $estimatedCurrentHomeLoanBalance: String
    $namesAddressesOfOwners: String
    $patientFileUpload: [Int]
    $formSubmissionStatus: String
  ) {
    save_matrixForms_patientFormSecuredFinanceDocumentation_Entry(
      title: $title
      slug: ""
      patientFormRecord: $patientFormRecord
      formSubmissionStatus: $formSubmissionStatus
      patientFormUploadedPdf: $patientFormUploadedPdf
      patientFormSecuredFinanceDocumentation: {
        sortOrder: "new1"
        blocks: {
          formfields: {
            id: "new1"
            formUserId: $formUserId
            email: $email
            firstName: $firstName
            lastName: $lastName
            address: $address
            estimatedValueOfProperty: $estimatedValueOfProperty
            estimatedCurrentHomeLoanBalance: $estimatedCurrentHomeLoanBalance
            namesAddressesOfOwners: $namesAddressesOfOwners
            patientFileUpload: $patientFileUpload
          }
        }
      }
    ) {
      id
    }
  }
`;

export const ExtractionConsentSupplementFormMutation = gql`
  mutation ExtractionConsentSupplementFormMutation(
    $title: String
    $patientFormRecord: [Int]
    $patientFormUploadedPdf: [Int]
    $formUserId: [Int]
    $patientName: String
    $dentistName: String
    $signaturePatient: String
    $signatureDate: DateTime
    $signersName: String
    $formSubmissionStatus: String
  ) {
    save_matrixForms_patientFormExtractionConsentSupplement_Entry(
      title: $title
      slug: ""
      patientFormRecord: $patientFormRecord
      formSubmissionStatus: $formSubmissionStatus
      patientFormUploadedPdf: $patientFormUploadedPdf
      patientFormExtractionConsentSupplement: {
        sortOrder: "new1"
        blocks: {
          formfields: {
            id: "new1"
            formUserId: $formUserId
            patientName: $patientName
            dentistName: $dentistName
            signaturePatient: $signaturePatient
            signatureDate: $signatureDate
            signersName: $signersName
          }
        }
      }
    ) {
      id
    }
  }
`;

export const GeneralCosmeticDentistryConsentFormMutation = gql`
  mutation GeneralCosmeticDentistryConsent(
    $title: String
    $patientFormRecord: [Int]
    $formSubmissionStatus: String
    $patientFormUploadedPdf: [Int]
    $formUserId: [Int]
    $patientName: String
    $dentistName: String
    $signaturePatient: String
    $signatureDate: DateTime
    $signersName: String
  ) {
    save_matrixForms_patientFormGeneralCosmeticDentistryConsent_Entry(
      title: $title
      slug: ""
      patientFormRecord: $patientFormRecord
      formSubmissionStatus: $formSubmissionStatus
      patientFormUploadedPdf: $patientFormUploadedPdf
      patientFormGeneralCosmeticDentistryConsent: {
        sortOrder: "new1"
        blocks: {
          formfields: {
            id: "new1"
            formUserId: $formUserId
            patientName: $patientName
            dentistName: $dentistName
            signaturePatient: $signaturePatient
            signatureDate: $signatureDate
            signersName: $signersName
          }
        }
      }
    ) {
      id
    }
  }
`;

export const MedicalRecordsConsentFormMutation = gql`
  mutation MedicalRecordsConsentFormMutation(
    $title: String
    $patientFormRecord: [Int]
    $patientFormUploadedPdf: [Int]
    $formUserId: [Int]
    $nameOfPatient: String
    $descriptionOfRecords: String
    $firstName: String
    $lastName: String
    $patientSignature: String
    $date: DateTime
  ) {
    save_matrixForms_patientFormMedicalRecordsConsent_Entry(
      title: $title
      slug: ""
      patientFormRecord: $patientFormRecord
      patientFormUploadedPdf: $patientFormUploadedPdf
      patientFormMedicalRecordsConsent: {
        sortOrder: "new1"
        blocks: {
          formfields: {
            id: "new1"
            formUserId: $formUserId
            nameOfPatient: $nameOfPatient
            descriptionOfRecords: $descriptionOfRecords
            firstName: $firstName
            lastName: $lastName
            patientSignature: $patientSignature
            date: $date
          }
        }
      }
    ) {
      id
    }
  }
`;

export const ClinlogSurveyFormMutation = gql`
  mutation ClinlogSurveyFormMutation(
    $title: String
    $surveyDate: DateTime
    $timeFromSurgery: String
    $patientSatisfactionAesthetic: String
    $patientSatisfactionFunction: String
    $patientSatisfactionTreatment: String
    $patientSatisfactionMaintenance: String
    $postOpPain: String
    $smoking: String
    $manualUpload: Boolean
    $lastEditedBy: [Int]
    $formModificationDate: DateTime
    $patientFormRecord: [Int]
    $patientFormGlobal: [Int]
    $patientFormUploadedPdf: [Int]
    $formSubmissionStatus: String
  ) {
    save_matrixForms_patientSurveyForm_Entry(
      title: $title
      manualUpload: $manualUpload
      patientFormRecord: $patientFormRecord
      patientFormGlobal: $patientFormGlobal
      formSubmissionStatus: $formSubmissionStatus
      patientFormUploadedPdf: $patientFormUploadedPdf
      lastEditedBy: $lastEditedBy
      formModificationDate: $formModificationDate
      patientSurveyMatrix: {
        blocks: {
          patientSurvey: {
            id: "new1"
            surveyDate: $surveyDate
            timeFromSurgery: $timeFromSurgery
            patientSatisfactionAesthetic: $patientSatisfactionAesthetic
            patientSatisfactionFunction: $patientSatisfactionFunction
            patientSatisfactionTreatment: $patientSatisfactionTreatment
            patientSatisfactionMaintenance: $patientSatisfactionMaintenance
            postOpPain: $postOpPain
            smoking: $smoking
          }
        }
        sortOrder: ["new1"]
      }
    ) {
      id
    }
  }
`;

export const MedicalClinicalDataConsentFormMutation = gql`
  mutation MedicalClinicalDataConsentFormMutation(
    $title: String
    $patientFormRecord: [Int]
    $patientFormUploadedPdf: [Int]
    $formUserId: [Int]
    $firstName: String
    $lastName: String
    $patientSignature: String
    $date: DateTime
  ) {
    save_matrixForms_patientFormMedicalClinicalDataConsent_Entry(
      title: $title
      slug: ""
      patientFormRecord: $patientFormRecord
      patientFormUploadedPdf: $patientFormUploadedPdf
      patientFormMedicalClinicalDataConsent: {
        sortOrder: "new1"
        blocks: {
          formfields: {
            id: "new1"
            formUserId: $formUserId
            firstName: $firstName
            lastName: $lastName
            patientSignature: $patientSignature
            date: $date
          }
        }
      }
    ) {
      id
    }
  }
`;

export const fileSaveStaffAssets = gql`
  mutation fileSaveStaffAssets($fileData: String, $filename: String) {
    save_staffAssets_Asset(
      _file: { fileData: $fileData, filename: $filename }
    ) {
      id
    }
  }
`;

export const fileSaveImagesAssets = gql`
  mutation fileSaveImagesAssets($fileData: String, $filename: String, $id: ID) {
    save_images_Asset(
      id: $id
      _file: { fileData: $fileData, filename: $filename }
    ) {
      id
    }
  }
`;

export const fileSavePatientAssets = gql`
  mutation fileSavePatientAssets($fileData: String, $filename: String) {
    save_patientAssets_Asset(
      _file: { fileData: $fileData, filename: $filename }
    ) {
      id
    }
  }
`;

export const saveLabRecordNote = gql`
  mutation saveLabRecordNote($id: [Int], $recordNoteRecord: [Int]) {
    save_recordNotes_labPictures_Entry(
      recordNoteImages: $id
      recordNoteRecord: $recordNoteRecord
    ) {
      id
    }
  }
`;

export const saveFormAsDraftMutation = gql`
  mutation saveFormAsDraft($formId: Int!) {
    saveFormAsDraft(formId: $formId) {
      id
    }
  }
`;

export const uploadPatientAssetMutation = gql`
  mutation fileSavePatientAsset($fileData: String, $filename: String) {
    save_patientAssets_Asset(
      _file: { fileData: $fileData, filename: $filename }
    ) {
      id
    }
  }
`;

export const uploadedPatientFormMutation = gql`
  mutation uploadedPatientFormMutation(
    $id: ID
    $uploadAttachedUser: [Int]
    $uploadAttachedRecord: [Int]
    $uploadAttachedUploads: [Int]
    $uploadFormDescription: String
    $uploadFormName: String
    $formSubmissionStatus: String
    $lastEditedBy: [Int]
  ) {
    save_uploadedPatientForms_uploadedPatientForms_Entry(
      id: $id
      uploadAttachedUser: $uploadAttachedUser
      uploadAttachedRecord: $uploadAttachedRecord
      uploadAttachedUploads: $uploadAttachedUploads
      uploadFormDescription: $uploadFormDescription
      uploadFormName: $uploadFormName
      formSubmissionStatus: $formSubmissionStatus
      lastEditedBy: $lastEditedBy
    ) {
      id
    }
  }
`;
