import { id } from "date-fns/locale";
import { gql } from "graphql-request";

export const initalCheckQuery = gql`
  query checkRecordPermission($id: [QueryArgument]!) {
    entry(id: $id, section: "records") {
      ... on records_records_Entry {
        recordClinic {
          id
        }
        recordLaboratory {
          id
        }
        recordMas {
          id
        }
        recordFormsCollaborators {
          id
        }
      }
    }
  }
`;

export const initalCheckQueryNew = gql`
  query checkRecordPermissionNew(
    $id: [QueryArgument]!
    $recordLaboratory: [QueryArgument]
    $recordMas: [QueryArgument]
  ) {
    entry(id: $id, section: "recordPatientGlobal") {
      ... on recordPatientGlobal_default_Entry {
        recordClinic {
          id
        }
        attachedRecordsEntry(
          recordLaboratory: $recordLaboratory
          recordMas: $recordMas
        ) {
          ... on records_records_Entry {
            id
            recordLaboratory {
              id
            }
            recordMas {
              id
            }
            recordFormsCollaborators {
              id
            }
          }
        }
      }
    }
  }
`;

export const initalCheckQueryNew2 = gql`
  query checkRecordPermissionNew(
    $id: [QueryArgument]!
    $recordLaboratory: [QueryArgument]
    $recordMas: [QueryArgument]
  ) {
    entry(id: $id, section: "recordPatientGlobal") {
      ... on recordPatientGlobal_default_Entry {
        recordClinic {
          id
        }
        attachedRecordsEntry(
          recordLaboratory: $recordLaboratory
          recordMas: $recordMas
        ) {
          ... on records_records_Entry {
            id
            recordClinic {
              id
            }
            recordLaboratory {
              id
            }
            recordMas {
              id
            }
            recordFormsCollaborators {
              id
            }
          }
        }
      }
    }
  }
`;

export const initalTreatmentCheckQuery = gql`
  query checkRecordPermissionNew(
    $id: [QueryArgument]!
    $recordId: [QueryArgument]
    $recordLaboratory: [QueryArgument]
    $recordMas: [QueryArgument]
  ) {
    entry(id: $id, section: "recordPatientGlobal") {
      ... on recordPatientGlobal_default_Entry {
        attachedRecordsEntry(
          id: $recordId
          recordLaboratory: $recordLaboratory
          recordMas: $recordMas
        ) {
          ... on records_records_Entry {
            id
            recordLaboratory {
              id
            }
            recordMas {
              id
            }
            recordFormsCollaborators {
              id
            }
            recordClinic {
              id
            }
          }
        }
      }
    }
  }
`;

export const detailsEntryQuery = gql`
  query detailsEntryQuery($id: [QueryArgument]!) {
    entry(id: $id, section: "records") {
      ... on records_records_Entry {
        id
        slug
        recordFirstName
        recordLastName
        recordPreferredName
        recordFollowUpStatus
        recordEmail
        recordHomePhone
        recordMobilePhone
        recordDateOfBirth
        recordCaseConsultedDate
        recordCaseBookedDate
        recordCaseCompletedDate
        recordLeadType
        recordAdditionalNotes
        recordEnquiryDate
        recordBmi
        recordFollowUpDate
        recordFollowUpRole
        recordFollowUpRequired
        recordConsultationStatus
        recordEnquiryType
        recordEnquiryTypeLabel: recordEnquiryType(label: true)
        recordConsultationDate
        recordConsultationTime
        recordLeadStatus
        recordTreatmentWorkUpDate
        recordTreatmentStatus
        recordSourceOfReferral
        recordSourceOfReferralLabel: recordSourceOfReferral(label: true)
        recordCustomWarning
        recordLaboratoryShade
        recordTheatreStartTime
        recordTheatreEndTime
        recordLaboratoryMethod
        recordLaboratoryMethodLabel: recordLaboratoryMethod(label: true)
        recordBookingConfirmations {
          ... on staffAssets_Asset {
            id
            title
            dateCreated
          }
        }
        recordLaboratory {
          id
        }
        recordLaboratorySetUpTechnician {
          id
        }
        recordLaboratoryStatus
        recordLaboratoryStatusLabel: recordLaboratoryStatus(label: true)
        recordLaboratoryLowerPosteriorTeethBrandMould {
          id
        }
        recordLaboratoryLowerAnteriorTeethBrandMould {
          id
        }
        recordLaboratoryUpperPosteriorTeethBrandMould {
          id
        }
        recordLaboratoryUpperAnteriorTeethBrandMould {
          id
        }
        recordFormsCollaborators {
          ... on User {
            fullName
            id
            photo {
              url @transform(handle: "x100x100")
            }
            groups
            staffReceivesCollaborationEmail
            email
            staffClinics {
              ... on locations_locations_Entry {
                id
                locationShortNameState
                locationOtherName
              }
            }
            anaesthetistMass {
              ... on mass_default_Entry {
                id
                title
                masShortName
                masEmail
                locationAccountName
                locationBsb
                locationAccountNumber
              }
            }
            technicianLaboratories {
              ... on laboratories_default_Entry {
                id
                title
              }
            }
            staffPrivacyCertificate {
              ... on staffAssets_Asset {
                id
              }
            }
          }
        }
        treatmentProposalSurgicalFacility {
          ... on locations_locations_Entry {
            id
            locationShortName
            locationOtherName
          }
        }
        recordClinic {
          ... on locations_locations_Entry {
            id
            locationShortName
            locationOtherName
            locationShortNameState
            locationEmail
            locationPhoneNumber {
              number
            }
            locationOtherLogo {
              id
              url @transform(handle: "x100x100")
            }
            locationClinicType
            locationClinicTypeLabel: locationClinicType(label: true)
          }
        }
        recordTreatmentProcedure {
          title
          id
        }
        recordTreatment {
          ... on treatmentProposalTreatments_default_Entry {
            id
            title
          }
        }
        recordTreatmentDate
        recordAccountRevenue
        recordTreatmentRestorative {
          fullName
          id
          photo {
            url @transform(handle: "x100x100")
          }
          ... on User {
            email
            staffClinics {
              ... on locations_locations_Entry {
                locationShortNameState
              }
            }
          }
        }
        recordAnaestheticProcedureTime
        recordFacilityFee
        recordTreatmentSurgeons {
          fullName
          id
          photo {
            url @transform(handle: "x100x100")
          }
          ... on User {
            email
            staffClinics {
              ... on locations_locations_Entry {
                locationShortNameState
              }
            }
          }
        }
        recordMas {
          ... on mass_default_Entry {
            id
            title
            masShortName
            masEmail
            locationAccountName
            locationBsb
            locationAccountNumber
            locationAddressSimple
            locationPhoneNumber {
              number
            }
          }
        }
        recordTreatmentAnaesthetist(
          status: ["active", "pending", "suspended"]
        ) {
          ... on User {
            id
            fullName
            email
            groups
            photo {
              url @transform(handle: "x100x100")
            }
            anaesthetistMass {
              ... on mass_default_Entry {
                id
                title
                masShortName
                masEmail
                locationAccountName
                locationBsb
                locationAccountNumber
              }
            }
            staffReceivesCollaborationEmail
          }
        }
        recordAnaesthetistStatus
        recordAnaesthetistStatusLabel: recordAnaesthetistStatus(label: true)
        recordLaboratory {
          ... on laboratories_default_Entry {
            id
            title
            laboratoryShortName
            locationPhoneNumber {
              number
            }
            laboratoryEmail
            locationAddressSimple
            locationAccountName
            locationBsb
            locationAccountNumber
            locationAbn
          }
        }
        recordLaboratorySetUpTechnician {
          ... on User {
            id
            fullName
            email
            groups
            technicianLaboratories {
              ... on laboratories_default_Entry {
                id
                title
                laboratoryShortName
                locationPhoneNumber {
                  number
                }
                laboratoryEmail
                locationAddressSimple
                locationAccountName
                locationBsb
                locationAccountNumber
              }
            }
            staffReceivesCollaborationEmail
          }
        }
        recordLaboratoryMethod
        recordLaboratoryShade
        recordLaboratoryUpperAnteriorTeethBrandMould {
          id
        }
        recordLaboratoryLowerAnteriorTeethBrandMould {
          id
        }
        recordLaboratoryUpperPosteriorTeethBrandMould {
          id
        }
        recordLaboratoryLowerPosteriorTeethBrandMould {
          id
        }
        recordTreatmentPaymentStatus
        recordIssuedProposals {
          id
        }
        recordTreatmentProposal {
          ... on treatmentProposal_default_Entry {
            id
            title
            dateCreated
            treatmentProposalUserRecord {
              ... on records_records_Entry {
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
                    locationOtherLogo {
                      id
                      url
                    }
                    mainImage {
                      url
                    }
                  }
                }
              }
            }
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
                locationPhoneNumber {
                  number
                }
              }
            }
            treatmentProposalCoordinator {
              ... on User {
                id
                userTitle
                fullName
                userMobilePhone
                email
              }
            }
            treatmentProposalTreatmentName
            treatmentProposalMatrix {
              ... on treatmentProposalMatrix_stage_BlockType {
                treatmentStageType
                treatingClinician {
                  ... on User {
                    id
                    fullName
                    userTitle
                    userLocation {
                      ... on locations_locations_Entry {
                        id
                        locationShortNameState
                        locationOtherName
                        locationAccountName
                        locationBsb
                        locationAccountNumber
                        locationEmail
                      }
                    }
                    staffPrimaryLocation {
                      ... on locations_locations_Entry {
                        id
                        locationShortNameState
                        locationOtherName
                        locationAccountName
                        locationBsb
                        locationAccountNumber
                        locationEmail
                      }
                    }
                    staffClinics {
                      ... on locations_locations_Entry {
                        id
                        locationShortNameState
                        locationOtherName
                        locationAccountName
                        locationBsb
                        locationAccountNumber
                        locationEmail
                      }
                    }
                  }
                }
                discountDescription
                discountDeductionValue
                procedures {
                  col1
                  col2
                  col4
                  col6
                }
              }
            }
            treatmentProposalAnaestheticFeeMatrix {
              ... on treatmentProposalAnaestheticFeeMatrix_anaestheticFeeSummary_BlockType {
                procedureTime
                whichFeeType
                whichFeeTypeLabel: whichFeeType(label: true)
                anaestheticFeeType
                anaestheticFeeTypeLabel: anaestheticFeeType(label: true)
                anaestheticFee
                minRebate
                maxRebate
                serviceFee
                facilityFee
                anaestheticServicesEntity {
                  ... on anaestheticServiceEntities_default_Entry {
                    id
                    title
                    aseTable {
                      col1
                      col2
                      col3
                      col4
                      col5
                      col6
                    }
                  }
                }
              }
            }
            treatmentProposalStatus
            treatmentProposalStatusLabel: treatmentProposalStatus(label: true)
          }
        }
        recordPatient {
          ... on User {
            id
            email
            fullName
            firstName
            lastName
            userTitle
            sex
            userPreferredName
            userHomePhone
            userMobilePhone
            userHomeAddress
            userCitySuburb
            userState
            userDateOfBirth
            userDateOfBirthFormatted: userDateOfBirth
              @formatDateTime(format: "Y-m-d")
            userPostcode
            status
            userHowDidYouFindUs
            userHowDidYouFindUsLabel: userHowDidYouFindUs(label: true)
            userHowDidYouFindUsDetails

            userLocation {
              id
            }
            photo {
              url @transform(handle: "x100x100")
            }
            formLabels: patientForms(label: true)
            formSlugs: patientForms(label: false)
            patientForms
            patientFormsServed {
              ... on patientFormsServed_clinicBlock_BlockType {
                id
                formsServedBy {
                  ... on User {
                    id
                    fullName
                  }
                }
                dateCreated
                patientRecord {
                  ... on records_records_Entry {
                    id
                    recordClinic {
                      id
                      slug
                      title
                      ... on locations_locations_Entry {
                        locationShortName
                        locationShortNameState
                        locationPhoneNumber {
                          number
                        }
                        locationOtherName
                        locationOtherLogo {
                          id
                          url @transform(handle: "x100x100")
                        }
                      }
                    }
                  }
                }
                formsToComplete {
                  id
                  title
                  slug
                  ... on patientForms_patientForms_Entry {
                    summary
                    patientFormHandle
                  }
                  ... on patientForms_waterPikApplication_Entry {
                    summary
                    patientFormHandle
                  }
                }
              }
            }
          }
        }
        recordFollowUpStaffMember {
          ... on User {
            id
            fullName
            photo {
              url @transform(handle: "x100x100")
            }
            staffClinics {
              id
              slug
              title
            }
          }
        }
        treatmentProposalMatrix {
          ... on treatmentProposalMatrix_stage_BlockType {
            procedures {
              col1
              col2
              col4
              col6
            }
          }
        }
        treatmentProposalAnaestheticFeeMatrix {
          ... on treatmentProposalAnaestheticFeeMatrix_anaestheticFeeSummary_BlockType {
            id
            anaestheticServicesEntity {
              ... on anaestheticServiceEntities_default_Entry {
                id
                title
                aseTable {
                  col1
                  col2
                  col3
                  col4
                  col5
                  col6
                }
              }
            }
            procedureTime
            whichFeeType
            whichFeeTypeLabel: whichFeeType(label: true)
            anaestheticFeeType
            anaestheticFeeTypeLabel: anaestheticFeeType(label: true)
            anaestheticFee
            minRebate
            maxRebate
            serviceFee
            facilityFee
          }
        }
      }
    }
  }
`;

//add back below
// fromDate
// bmiRecordedby {
//   id
//   fullName
// }
// recordFollowUpDate
// recordFollowUpRole
// recordFollowUpNotes
// recordFollowUpRequired

export const getGlobalRecordIdQuery = gql`
  query getGlobalRecordIdQuery($treatmentId: [QueryArgument]!) {
    entry(section: "recordPatientGlobal", attachedRecordsEntry: $treatmentId) {
      ... on recordPatientGlobal_default_Entry {
        id
      }
    }
  }
`;

export const stripeInvoicesQuery = gql`
  query stripeInvoicesQuery($id: [QueryArgument]!) {
    entries(patientFormGlobal: $id, section: "stripeInvoices") {
      ... on stripeInvoices_default_Entry {
        id
        recordIdForRef
        title
        dateCreated
        recordTreatmentPaymentStatus
        paidAmount
        totalAmount
        proposedTreatmentToothMatrix {
          ... on proposedTreatmentToothMatrix_toothDetails_BlockType {
            id
            initialDate
            treatmentItemTitle
            treatmentItemNumber
            treatmentItemDescription
            treatmentFriendlyName
            toothValue
            toothPosition
            completedDate
            approved
            completed
            groupTitle
            groupTitleParent
            customGroupTitle
            customGroupTitleParent
            treatmentPaid
            groupNumber
            visitTitle
            visitNumber
            patientCost
            discountReason
            vgds
            discount
            vetAffairs
            medicare
            cost
            dentist {
              ... on User {
                id
                fullName
                dentalProviderNumber
                prescriberProviderNumber
                userTitle
              }
            }
            treatmentNotes
          }
        }
      }
    }
  }
`;

export const detailsEntryQueryNew = gql`
  query detailsEntryQueryNew(
    $id: [QueryArgument]!
    $recordId: [QueryArgument]
  ) {
    entry(id: $id, section: "recordPatientGlobal") {
      ... on recordPatientGlobal_default_Entry {
        id
        recordFirstName
        recordLastName
        recordPreferredName
        recordEmail
        recordHomePhone
        recordMobilePhone
        recordDateOfBirth
        recordEnquiryDate
        recordEnquiryType
        dateCreated
        recordLeadStatus
        recordLeadType
        recordLeadTypeLabel: recordLeadType(label: true)
        recordFlaggedBy {
          id
        }
        sex
        recordEnquiryTypeLabel: recordEnquiryType(label: true)
        author {
          id
          fullName
        }
        attachedDentalCharts {
          id
          typeHandle
        }
        recordClinic {
          ... on locations_locations_Entry {
            id
            stripeAccountName
            stripeAccountId
            locationShortName
            locationOtherName
            locationShortNameState
            locationAddressSimple
            locationEmail
            locationPhoneNumber {
              number
            }
            locationOtherLogo {
              id
              url @transform(handle: "x100x100")
            }
            mainImage {
              url
            }
            locationAbn
            locationClinicType
            locationClinicTypeLabel: locationClinicType(label: true)
          }
        }
        recordPatient {
          ... on User {
            id
            email
            fullName
            firstName
            lastName
            userTitle
            sex
            userPreferredName
            userHomePhone
            userMobilePhone
            userHomeAddress
            userCitySuburb
            userState
            userStateLabel: userState(label: true)
            userDateOfBirth
            userDateOfBirthFormatted: userDateOfBirth
              @formatDateTime(format: "Y-m-d")
            userPostcode
            status
            userHowDidYouFindUs
            userHowDidYouFindUsLabel: userHowDidYouFindUs(label: true)
            userHowDidYouFindUsDetails
            userLocation {
              ... on locations_locations_Entry {
                id
                locationShortNameState
                locationOtherName
                locationEmail
                locationAbn
                locationAddressSimple
                locationPhoneNumber {
                  number
                }
              }
            }
            photo {
              url @transform(handle: "x100x100")
            }
            formLabels: patientForms(label: true)
            formSlugs: patientForms(label: false)
            patientForms
            patientFormsServed {
              ... on patientFormsServed_clinicBlock_BlockType {
                id
                formsServedBy {
                  ... on User {
                    id
                    fullName
                  }
                }
                dateCreated
                patientRecord {
                  ... on records_records_Entry {
                    id
                    recordClinic {
                      id
                      slug
                      title
                      ... on locations_locations_Entry {
                        locationShortName
                        locationShortNameState
                        locationAddressSimple
                        locationPhoneNumber {
                          number
                        }
                        locationOtherName
                        locationOtherLogo {
                          id
                          url @transform(handle: "x100x100")
                        }
                      }
                    }
                  }
                }
                formsToComplete {
                  id
                  title
                  slug
                  ... on patientForms_patientForms_Entry {
                    summary
                    patientFormHandle
                  }
                  ... on patientForms_waterPikApplication_Entry {
                    summary
                    patientFormHandle
                  }
                }
              }
            }
          }
        }
        attachedLeadsEntry {
          id
        }
        attachedRecordsEntry(id: $recordId, orderBy: "dateCreated DESC") {
          id
          ... on records_records_Entry {
            id
            author {
              id
              fullName
            }
            enableClinlog
            recordEmail
            slug
            dateCreated
            dateUpdated
            caseNumber
            diabetesAndOsteoporosis
            oestrogen
            smoking
            alcohol
            oralHygiene
            bruxism
            diagnosisOrAetiology
            treatmentCharacteristicsCompleted
            sex
            ageAtTimeOfSurgery
            treatmentTitle
            treatmentDescription
            edentulous
            treatmentPlannedBy
            archType
            archTypeLabel: archType(label: true)
            upperArchCondition
            lowerArchCondition
            zygomaImplants
            regularImplants
            immediateRestoration
            dateOfInsertion
            immediateFunctionSpeech
            immediateAesthetics
            isImageIdentifiable
            preOpPhotos
            preOpReconstructedOpg
            postOpPhotos
            postOp2DOpg
            postOp3DOpg
            followUpPeriod
            recordFollowUpMatrix {
              ... on recordFollowUpMatrix_followUp_BlockType {
                id
                dateCreated
                dateOfFollowUp
                examiner
                examinerRadiographic
                hygieneAtFollowUp
                hygieneAtFollowUpLabel: hygieneAtFollowUp(label: true)
                numberOfRestorativeBreakages
                performanceOverFollowUpPeriod
                smokingAtFollowUp
                sortOrder
                timeFromSurgery
                zirconiaUpgrade
              }
            }
            recordEnquiryType
            recordEnquiryTypeLabel: recordEnquiryType(label: true)
            recordLeadStage
            recordLeadStageLabel: recordLeadStage(label: true)
            recordFollowUpStatus
            recordFollowUpDate
            recordFollowUpRole
            recordFollowUpRequired
            recordFollowUpNotes
            reviewPeriod
            recordCaseConsultedDate
            recordCaseBookedDate
            recordCaseCompletedDate
            recordLeadType
            recordAdditionalNotes
            recordBmi
            recordConsultationStatus
            recordConsultationDate
            recordConsultationTime
            recordLeadStatus
            recordLeadStatusLabel: recordLeadStatus(label: true)
            recordTreatmentWorkUpDate
            recordTreatmentStatus
            recordSourceOfReferral
            recordSourceOfReferralLabel: recordSourceOfReferral(label: true)
            recordCustomWarning
            recordLaboratoryShade
            recordTheatreStartTime
            recordTheatreEndTime
            recordLaboratoryMethod
            recordLaboratoryMethodLabel: recordLaboratoryMethod(label: true)
            recordLaboratoryStatus
            recordLaboratoryStatusLabel: recordLaboratoryStatus(label: true)
            recordMedicinePrescription {
              nameOfMedicine
              strength
              dose
              description
              dateOfPrescription
              prescribedBy
              frequency
              quantity
            }
            customWarningsTable {
              dateOfWarning
              warningAddedBy
              warningDescription
            }
            attachedDentalCharts {
              ... on dentalChartRecords_proposedTreatmentChart_Entry {
                id
                typeHandle
                title
                dateCreated
                chartStatus
                treatmentProposalTreatmentName
                recordTreatmentDate
                author {
                  id
                  fullName
                }
              }
            }
            attachedAppointments(orderBy: "recordConsultationDate DESC") {
              ... on caseAppointments_default_Entry {
                id
                title
                dateCreated
                waitingRoomStatus
                appointmentCategory
                recordEnquiryType
                author {
                  id
                  fullName
                }
                isSurgical
                recordConsultationDate
                recordConsultationTime
                recordConsultationStatus
                recordConsultationStatusLabel: recordConsultationStatus(
                  label: true
                )
                recordLeadStatus

                recordLeadStatusLabel: recordLeadStatus(label: true)
                appointmentCategoryLabel: appointmentCategory(label: true)
                appointmentType
                appointmentTypeLabel: appointmentType(label: true)
                appointmentMinutes
                appointmentDescription
                recordAdditionalNotes
                appointmentDoctors {
                  ... on User {
                    id
                    fullName
                    photo {
                      url @transform(handle: "x100x100")
                    }
                    email
                    groups
                    staffReceivesNotificationEmail
                    staffReceivesCollaborationEmail
                    anaesthetistMass {
                      ... on mass_default_Entry {
                        id
                        title
                      }
                    }
                    technicianLaboratories {
                      ... on laboratories_default_Entry {
                        id
                        title
                      }
                    }
                    staffClinics {
                      ... on locations_locations_Entry {
                        id
                        locationShortName
                        locationShortNameState
                        locationOtherName
                      }
                    }
                  }
                }
                treatmentProposalSurgicalFacility {
                  ... on locations_locations_Entry {
                    id
                    locationShortName
                    locationOtherName
                  }
                }
              }
            }
            recordBookingConfirmations(orderBy: "dateCreated desc") {
              ... on staffAssets_Asset {
                id
                title
                dateCreated
              }
            }
            recordPaymentSplitPdfs(orderBy: "dateCreated desc") {
              ... on staffAssets_Asset {
                id
                title
                dateCreated
              }
            }
            recordLaboratory {
              id
            }
            recordLaboratorySetUpTechnician {
              id
            }
            recordLaboratoryLowerPosteriorTeethBrandMould {
              id
              title
            }
            recordLaboratoryLowerAnteriorTeethBrandMould {
              id
              title
            }

            recordLaboratoryUpperPosteriorTeethBrandMould {
              id
              title
            }
            recordLaboratoryUpperAnteriorTeethBrandMould {
              id
              title
            }
            recordFormsCollaborators {
              ... on User {
                fullName
                id
                photo {
                  url @transform(handle: "x100x100")
                }
                groups
                staffReceivesCollaborationEmail
                email
                staffClinics {
                  ... on locations_locations_Entry {
                    id
                    locationShortNameState
                    locationOtherName
                  }
                }
                anaesthetistMass {
                  ... on mass_default_Entry {
                    id
                    title
                    masShortName
                    masEmail
                    stripeAccountId
                    stripeAccountName
                    locationAccountName
                    locationBsb
                    locationAccountNumber
                  }
                }
                technicianLaboratories {
                  ... on laboratories_default_Entry {
                    id
                    title
                  }
                }
                staffPrivacyCertificate {
                  ... on staffAssets_Asset {
                    id
                  }
                }
              }
            }
            treatmentProposalSurgicalFacility {
              ... on locations_locations_Entry {
                id
                locationShortName
                locationOtherName
              }
            }

            recordTreatmentProcedure {
              title
              id
            }
            recordTreatment {
              ... on treatmentProposalTreatments_default_Entry {
                id
                title
              }
            }
            recordTreatmentDate
            recordAccountRevenue
            recordTreatmentRestorative {
              fullName
              id
              photo {
                url @transform(handle: "x100x100")
              }
              ... on User {
                email
                staffClinics {
                  ... on locations_locations_Entry {
                    locationShortNameState
                  }
                }
              }
            }
            recordAnaestheticProcedureTime
            recordFacilityFee
            recordTreatmentSurgeons {
              fullName
              id
              photo {
                url @transform(handle: "x100x100")
              }
              ... on User {
                email
                staffClinics {
                  ... on locations_locations_Entry {
                    locationShortNameState
                  }
                }
              }
            }
            recordMas {
              ... on mass_default_Entry {
                id
                title
                masShortName
                masEmail
                locationAccountName
                locationBsb
                locationAccountNumber
                locationAddressSimple
                locationPhoneNumber {
                  number
                }
                locationAbn
              }
            }
            recordTreatmentAnaesthetist(
              status: ["active", "pending", "suspended"]
            ) {
              ... on User {
                id
                fullName
                email
                groups
                photo {
                  url @transform(handle: "x100x100")
                }
                anaesthetistMass {
                  ... on mass_default_Entry {
                    id
                    title
                    masShortName
                    masEmail
                    locationAccountName
                    locationBsb
                    locationAccountNumber
                  }
                }
                staffReceivesCollaborationEmail
              }
            }
            recordAnaesthetistStatus
            recordAnaesthetistStatusLabel: recordAnaesthetistStatus(label: true)
            recordLaboratory {
              ... on laboratories_default_Entry {
                id
                title
                laboratoryShortName
                locationPhoneNumber {
                  number
                }
                laboratoryEmail
                locationAddressSimple
                locationAccountName
                locationBsb
                locationAccountNumber
                locationAbn
              }
            }
            recordLaboratorySetUpTechnician {
              ... on User {
                id
                fullName
                email
                groups
                technicianLaboratories {
                  ... on laboratories_default_Entry {
                    id
                    title
                    laboratoryShortName
                    locationPhoneNumber {
                      number
                    }
                    laboratoryEmail
                    locationAddressSimple
                    locationAccountName
                    locationBsb
                    locationAccountNumber
                  }
                }
                staffReceivesCollaborationEmail
              }
            }
            recordLaboratoryMethod
            recordLaboratoryShade
            recordLaboratoryUpperAnteriorTeethBrandMould {
              id
            }
            recordLaboratoryLowerAnteriorTeethBrandMould {
              id
            }
            recordLaboratoryUpperPosteriorTeethBrandMould {
              id
            }
            recordLaboratoryLowerPosteriorTeethBrandMould {
              id
            }
            recordTreatmentPaymentStatus
            recordIssuedProposals {
              id
            }
            recordTreatmentProposal {
              ... on treatmentProposal_default_Entry {
                id
                title
                dateCreated
                dateUpdated
                treatmentProposalUserRecord {
                  ... on records_records_Entry {
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
                        locationOtherLogo {
                          id
                          url
                        }
                        mainImage {
                          url
                        }
                      }
                    }
                  }
                }
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
                    locationPhoneNumber {
                      number
                    }
                  }
                }
                treatmentProposalCoordinator {
                  ... on User {
                    id
                    userTitle
                    fullName
                    userMobilePhone
                    email
                  }
                }
                treatmentProposalTreatmentName
                treatmentProposalMatrix {
                  ... on treatmentProposalMatrix_stage_BlockType {
                    treatmentStageType
                    treatingClinician {
                      ... on User {
                        id
                        fullName
                        userTitle
                        additionalUserInformation {
                          ... on additionalUserInformation_default_Entry {
                            locationBsb
                            locationAccountNumber
                            locationAccountName
                          }
                        }
                        userLocation {
                          ... on locations_locations_Entry {
                            id
                            locationShortNameState
                            locationOtherName
                            locationAccountName
                            locationBsb
                            locationAccountNumber
                            locationEmail
                          }
                        }
                        staffPrimaryLocation {
                          ... on locations_locations_Entry {
                            id
                            locationShortNameState
                            locationOtherName
                            locationAccountName
                            locationBsb
                            locationAccountNumber
                            locationEmail
                          }
                        }
                        staffClinics {
                          ... on locations_locations_Entry {
                            id
                            locationShortNameState
                            locationOtherName
                            locationAccountName
                            locationBsb
                            locationAccountNumber
                            locationEmail
                          }
                        }
                      }
                    }
                    discountDescription
                    discountDeductionValue
                    procedures {
                      col1
                      col2
                      col4
                      col6
                    }
                  }
                }
                treatmentProposalAnaestheticFeeMatrix {
                  ... on treatmentProposalAnaestheticFeeMatrix_anaestheticFeeSummary_BlockType {
                    procedureTime
                    whichFeeType
                    whichFeeTypeLabel: whichFeeType(label: true)
                    anaestheticFeeType
                    anaestheticFeeTypeLabel: anaestheticFeeType(label: true)
                    anaestheticFee
                    minRebate
                    maxRebate
                    serviceFee
                    facilityFee
                    anaestheticServicesEntity {
                      ... on anaestheticServiceEntities_default_Entry {
                        id
                        title
                        aseTable {
                          col1
                          col2
                          col3
                          col4
                          col5
                          col6
                        }
                      }
                    }
                  }
                }
                treatmentProposalStatus
                treatmentProposalStatusLabel: treatmentProposalStatus(
                  label: true
                )
              }
            }

            recordFollowUpStaffMember {
              ... on User {
                id
                fullName
                photo {
                  url @transform(handle: "x100x100")
                }
                staffClinics {
                  id
                  slug
                  title
                }
              }
            }
            treatmentProposalMatrix {
              ... on treatmentProposalMatrix_stage_BlockType {
                procedures {
                  col1
                  col2
                  col4
                  col6
                }
              }
            }
            treatmentProposalAnaestheticFeeMatrix {
              ... on treatmentProposalAnaestheticFeeMatrix_anaestheticFeeSummary_BlockType {
                id
                anaestheticServicesEntity {
                  ... on anaestheticServiceEntities_default_Entry {
                    id
                    title
                    aseTable {
                      col1
                      col2
                      col3
                      col4
                      col5
                      col6
                    }
                  }
                }
                procedureTime
                whichFeeType
                whichFeeTypeLabel: whichFeeType(label: true)
                anaestheticFeeType
                anaestheticFeeTypeLabel: anaestheticFeeType(label: true)
                anaestheticFee
                minRebate
                maxRebate
                serviceFee
                facilityFee
              }
            }
            recordClinic {
              ... on locations_locations_Entry {
                id
                title
                locationShortName
                locationShortNameState
                locationOtherName
                locationOtherNameShort
                locationClinicType
                locationPhoneNumber {
                  number
                }
                locationAddressSimple
                locationEmail
                locationClinicTypeLabel: locationClinicType(label: true)
                locationAbn
              }
            }
            recordFlaggedBy {
              id
            }
          }
        }
      }
    }
  }
`;

export const baseChartQuery = gql`
  query baseChartQuery($id: [QueryArgument]) {
    entries(
      section: "dentalChartRecords"
      type: "existingConditionChart"
      id: $id
      orderBy: "dateCreated ASC"
    ) {
      ... on dentalChartRecords_existingConditionChart_Entry {
        id
        typeHandle
        title
        author {
          id
          fullName
        }
        defaultDentist {
          id
          fullName
        }

        chartingNurse {
          id
          fullName
        }
        chartStatus
        chartType
        dateCreated
        dateUpdated
        lastEditedBy {
          ... on User {
            id
            fullName
          }
        }
        existingConditionToothMatrix {
          ... on existingConditionToothMatrix_toothDetails_BlockType {
            id
            treatmentNotes
            toothValue
            toothPosition
            toothCondition
            initialDate
            completedTreatmentTitle
            treatmentItemNumber
            attachedSiteSpecificRecords {
              ... on treatmentItemSpecificationRecord_barSpecifications_Entry {
                id
                archLocation
                barMaterial
                barLengthFrom
                barLengthTo
                barType
              }
              ... on treatmentItemSpecificationRecord_itemSpecificationAndDetails_Entry {
                id
                attachedSiteSpecificFollowUp(orderBy: "dateCreated ASC") {
                  ... on siteSpecificFollowUp_default_Entry {
                    id
                    title
                    dateCreated
                    dateUpdated
                    implantFunctionAtFollowUp
                    implantFunctionAtFollowUpLabel: implantFunctionAtFollowUp(
                      label: true
                    )
                    sinusitis
                    sinusitisLabel: sinusitis(label: true)
                    facialSwelling
                    facialSwellingLabel: facialSwelling(label: true)
                    inflammation
                    inflammationLabel: inflammation(label: true)
                    suppuration
                    suppurationLabel: suppuration(label: true)
                    pain
                    painLabel: pain(label: true)
                    recession
                    recessionLabel: recession(label: true)
                    midShaftSoftTissueDehiscence
                    midShaftSoftTissueDehiscenceLabel: midShaftSoftTissueDehiscence(
                      label: true
                    )
                    firstAbutmentLevelComplication
                    firstAbutmentLevelComplicationLabel: firstAbutmentLevelComplication(
                      label: true
                    )
                    otherAbutmentLevelComplications
                    totalNumberOfAbutmentLevelComplications
                    dateOfFirstAbutmentLevelComplication
                    firstAbutmentLevelComplicationTimeFromSurgery
                    postOperativeSinusDisease
                    postOperativeSinusDiseaseLabel: postOperativeSinusDisease(
                      label: true
                    )
                    boneLoss
                    boneLossLabel: boneLoss(label: true)
                  }
                }
                itemSpecificationMatrix {
                  ... on itemSpecificationMatrix_itemSpecs_BlockType {
                    enableInClinlog
                    implantBrand
                    implantCategory
                    implantLine
                    surface
                    implantBaseAndDiameter
                    abutmentBrand
                    abutmentLength
                    abutmentSerialSequenceBarCode
                    implantLength
                    implantType
                    angleCorrectionAbutment
                    serialSequenceBarCode
                    insertionTorque
                    radiographicTrabecularDensityHu
                    placement
                    relevantBoneWidth
                    trabecularBoneDensity
                    boneVascularity
                    crestalRest
                    graftingApplied
                    graftMaterial
                    intraOperativeSinusComplications
                    preOperativeSinusDisease
                    preOperativeSinusDiseaseManagement
                    prf
                    conformanceWithTreatmentPlan
                    lotCode
                    dateOfManufacture
                    dateOfExpiry
                  }
                }
                abutmentDetailsMatrix {
                  ... on abutmentDetailsMatrix_abutment_BlockType {
                    id
                    abutmentCategory
                    abutmentBrand
                    gingivalHeight
                    typeAndDiameter
                    abutmentHeight
                    angleCorrectionAbutment
                    abutmentLength
                    abutmentSerialSequenceBarCode
                    abutmentLotCode
                    abutmentDateOfManufacture
                    abutmentDateOfExpiry
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;
export const proposedTreatmentChartApprovedQuery = gql`
  query proposedTreatmentChartQuery($id: [QueryArgument]) {
    entries(
      section: "dentalChartRecords"
      type: "proposedTreatmentChart"
      # chartStatus: "approved"
      orderBy: "dateCreated DESC"
      id: $id
      limit: 1
    ) {
      ... on dentalChartRecords_proposedTreatmentChart_Entry {
        isOldVersion
        patientFormRecord {
          ... on records_records_Entry {
            dateOfInsertion
          }
        }
        treatmentProposalPdfs {
          ... on staffAssets_Asset {
            id
            title
            dateCreated
            url
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
            dateCreated
            treatmentProposalStatus
            treatmentProposalSurgicalFacility {
              ... on locations_locations_Entry {
                id
                locationShortName
                locationAddressSimple
                locationOtherName
                locationPhoneNumber {
                  number
                }
                locationOtherLogo {
                  url
                }
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
            treatmentProposalTreatmentName
            treatmentProposalMatrix {
              ... on treatmentProposalMatrix_stage_BlockType {
                id
                discountDescription
                discountDeductionValue
                treatmentStageType
                treatmentName
                referencedStage {
                  id
                }
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
        id
        typeHandle
        title
        author {
          id
          fullName
        }
        defaultDentist {
          ... on User {
            id
            fullName
            staffPrimaryLocation {
              ... on locations_locations_Entry {
                id
                locationShortNameState
                locationOtherName
                locationAccountName
                locationBsb
                locationAccountNumber
                locationEmail
              }
            }
            staffClinics {
              ... on locations_locations_Entry {
                id
                locationShortNameState
                locationOtherName
                locationAccountName
                locationBsb
                locationAccountNumber
                locationEmail
              }
            }
          }
        }
        isExternalDentist
        chartingNurse {
          id
          fullName
        }
        chartStatus
        treatmentProposalTreatmentName
        recordTreatmentProposal {
          id
        }
        treatmentProposalTreatment {
          id
        }
        recordEnquiryType
        recordEnquiryTypeLabel: recordEnquiryType(label: true)
        treatmentProposalCoordinator {
          id
          fullName
        }
        chartType
        dateCreated
        dateUpdated
        recordTreatmentDate
        lastEditedBy {
          ... on User {
            id
            fullName
          }
        }
        attachedStripeInvoices {
          ... on stripeInvoices_default_Entry {
            id
            paymentMethod
            recordTreatmentPaymentStatus
            recordTreatmentPaymentStatusLabel: recordTreatmentPaymentStatus(
              label: true
            )
            recordNoteNote
            recordIdForRef
            totalAmount
            paidAmount
            stripeAccountId
            stripeAccountName
            paymentDate
            dateCreated
            dateUpdated
            proposedTreatmentToothMatrix {
              ... on proposedTreatmentToothMatrix_toothDetails_BlockType {
                id
                initialDate
                treatmentItemTitle
                treatmentItemNumber
                treatmentItemDescription
                treatmentFriendlyName
                toothValue
                toothPosition
                completedDate
                approved
                completed
                groupTitle
                customGroupTitle
                groupTitleParent
                customGroupTitleParent
                treatmentPaid
                groupNumber
                visitTitle
                visitNumber
                patientCost
                discountReason
                vgds
                discount
                vetAffairs
                medicare
                cost
                dentist {
                  ... on User {
                    id
                    fullName
                    dentalProviderNumber
                    userTitle
                    stripeAccountId
                    stripeAccountName
                  }
                }
              }
            }
          }
        }
        proposedTreatmentToothMatrix {
          ... on proposedTreatmentToothMatrix_toothDetails_BlockType {
            id
            uniqueId
            initialDate
            treatmentItemTitle
            treatmentItemNumber
            treatmentItemDescription
            treatmentFriendlyName
            toothValue
            toothPosition
            completedDate
            approved
            completed
            groupTitle
            groupTitleParent
            customGroupTitle
            customGroupTitleParent
            treatmentPaid
            groupNumber
            visitTitle
            visitNumber
            patientCost
            discountReason
            vgds
            discount
            vetAffairs
            medicare
            cost
            dentist {
              ... on User {
                id
                fullName
                dentalProviderNumber
                userTitle
                stripeAccountId
                stripeAccountName

                staffPrimaryLocation {
                  ... on locations_locations_Entry {
                    id
                    locationShortNameState
                    locationOtherName
                    locationAccountName
                    locationBsb
                    locationAccountNumber
                    locationEmail
                  }
                }
                staffClinics {
                  ... on locations_locations_Entry {
                    id
                    locationShortNameState
                    locationOtherName
                    locationAccountName
                    locationBsb
                    locationAccountNumber
                    locationEmail
                  }
                }
              }
            }
            isExternalDentist
            treatmentNotes
            attachedSiteSpecificRecords {
              ... on treatmentItemSpecificationRecord_barSpecifications_Entry {
                id
                archLocation
                barMaterial
                barLengthFrom
                barLengthTo
                barType
                provisionalMaterial
                finalProstheticMaterial
                reinforcementOfFinalProsthetic
              }
              ... on treatmentItemSpecificationRecord_itemSpecificationAndDetails_Entry {
                id
                revisedTreatment {
                  id
                }
                attachedSiteSpecificFollowUp(orderBy: "dateCreated ASC") {
                  ... on siteSpecificFollowUp_default_Entry {
                    id
                    title
                    dateCreated
                    dateUpdated
                    #while merging, dont miss this field
                    recordFollowUpDate
                    implantFunctionAtFollowUp
                    implantFunctionAtFollowUpLabel: implantFunctionAtFollowUp(
                      label: true
                    )
                    abutmentFunctionAtFollowUp
                    abutmentFunctionAtFollowUpLabel: abutmentFunctionAtFollowUp(
                      label: true
                    )
                    sinusitis
                    sinusitisLabel: sinusitis(label: true)
                    facialSwelling
                    facialSwellingLabel: facialSwelling(label: true)
                    inflammation
                    inflammationLabel: inflammation(label: true)
                    suppuration
                    suppurationLabel: suppuration(label: true)
                    pain
                    painLabel: pain(label: true)
                    recession
                    recessionLabel: recession(label: true)
                    midShaftSoftTissueDehiscence
                    midShaftSoftTissueDehiscenceLabel: midShaftSoftTissueDehiscence(
                      label: true
                    )
                    firstAbutmentLevelComplication
                    firstAbutmentLevelComplicationLabel: firstAbutmentLevelComplication(
                      label: true
                    )
                    otherAbutmentLevelComplications
                    totalNumberOfAbutmentLevelComplications
                    dateOfFirstAbutmentLevelComplication
                    firstAbutmentLevelComplicationTimeFromSurgery
                    postOperativeSinusDisease
                    postOperativeSinusDiseaseLabel: postOperativeSinusDisease(
                      label: true
                    )
                    boneLoss
                    boneLossLabel: boneLoss(label: true)
                  }
                }
                itemSpecificationMatrix {
                  ... on itemSpecificationMatrix_itemSpecs_BlockType {
                    enableInClinlog
                    implantBrand
                    implantCategory
                    implantLine
                    surface
                    implantBaseAndDiameter
                    abutmentBrand
                    abutmentLength
                    abutmentSerialSequenceBarCode
                    implantLength
                    implantType
                    angleCorrectionAbutment
                    serialSequenceBarCode
                    insertionTorque
                    insertionTorqueLabel: insertionTorque(label: true)
                    radiographicTrabecularDensityHu
                    placement
                    placementLabel: placement(label: true)
                    relevantBoneWidth
                    relevantBoneWidthLabel: relevantBoneWidth(label: true)
                    trabecularBoneDensity
                    trabecularBoneDensityLabel: trabecularBoneDensity(
                      label: true
                    )
                    boneVascularity
                    boneVascularityLabel: boneVascularity(label: true)
                    crestalRest
                    crestalRestLabel: crestalRest(label: true)
                    graftingApplied
                    graftingAppliedLabel: graftingApplied(label: true)
                    graftMaterial
                    graftMaterialLabel: graftMaterial(label: true)
                    intraOperativeSinusComplications
                    intraOperativeSinusComplicationsLabel: intraOperativeSinusComplications(
                      label: true
                    )
                    preOperativeSinusDisease
                    preOperativeSinusDiseaseLabel: preOperativeSinusDisease(
                      label: true
                    )
                    preOperativeSinusDiseaseManagement
                    preOperativeSinusDiseaseManagementLabel: preOperativeSinusDiseaseManagement(
                      label: true
                    )
                    conformanceWithTreatmentPlan
                    conformanceWithTreatmentPlanLabel: conformanceWithTreatmentPlan(
                      label: true
                    )
                    prf
                    lotCode
                    dateOfManufacture
                    dateOfExpiry
                  }
                }
                abutmentDetailsMatrix {
                  ... on abutmentDetailsMatrix_abutment_BlockType {
                    id
                    abutmentBrand
                    abutmentCategory
                    typeAndDiameter
                    gingivalHeight
                    abutmentHeight
                    angleCorrectionAbutment
                    abutmentLength
                    abutmentSerialSequenceBarCode
                    abutmentLotCode
                    abutmentDateOfManufacture
                    abutmentDateOfExpiry
                  }
                }
              }
            }
            treatmentFriendlyName
          }
        }
        anaestheticDetailsMatrix {
          ... on anaestheticDetailsMatrix_anaestheticDetails_BlockType {
            id
            visitNumber
            visitTitle
            groupNumber
            dateCreated
            dateUpdated
            groupTitle
            treatmentPaid
            surgicalFacility {
              ... on locations_locations_Entry {
                id
                locationShortName
                locationAddressSimple
                locationOtherName
              }
            }
            mas {
              ... on mass_default_Entry {
                id
                title
                masShortName
                masEmail
                locationAccountName
                locationBsb
                locationAccountNumber
                locationAddressSimple
              }
            }
            facilityFee
            whichFeeType
            whichFeeTypeLabel: whichFeeType(label: true)
            procedureTime
            maxRebate
            minRebate
            serviceFee
            anaestheticFeeType
            anaestheticFeeTypeLabel: anaestheticFeeType(label: true)
            anaesthetistStatus
            anaesthetistStatusLabel: anaesthetistStatus(label: true)
            anaestheticFee
            treatmentAnaesthetist {
              ... on User {
                id
                fullName
              }
            }
            anaestheticServicesEntity {
              id
              title
            }
            showInProposal
            assignedAppointment {
              id
            }
          }
        }
        laboratoryDetailsMatrix {
          ... on laboratoryDetailsMatrix_laboratory_BlockType {
            id
            visitNumber
            visitTitle
            groupNumber
            dateCreated
            dateUpdated
            groupTitle
            recordLaboratory {
              ... on laboratories_default_Entry {
                id
                title
                laboratoryShortName
              }
            }
            recordLaboratorySetUpTechnician {
              ... on User {
                id
                fullName
              }
            }
            recordLaboratoryMethod
            recordLaboratoryMethodLabel: recordLaboratoryMethod(label: true)
            recordLaboratoryShade
            recordLaboratoryStatus
            recordLaboratoryStatusLabel: recordLaboratoryStatus(label: true)
            recordLabInstructionsDueDateTime
            recordLabInstructionsOvd
            recordLabInstructionsMidline
            recordLabInstructionsPlane
            recordLabOtherInstructions
            recordLabInstructionsShade
            assignedAppointment {
              id
            }
          }
        }
        treatmentProposalSectionOptions {
          ... on treatmentProposalSectionOptions_sectionOptions_BlockType {
            id
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
        prePaymentDepositMatrix {
          ... on prePaymentDepositMatrix_deposit_BlockType {
            id
            prePaymentOrDeposit
            attachedDepositEntry {
              ... on stripeInvoices_recordDeposit_Entry {
                id
                recordClinic {
                  ... on locations_locations_Entry {
                    id
                    locationShortName
                    locationOtherName
                    stripeAccountId
                    stripeAccountName
                  }
                }
              }
            }

            dateOfDeposit
            attachedDepositEntry {
              ... on stripeInvoices_recordDeposit_Entry {
                id
                recordClinic {
                  ... on locations_locations_Entry {
                    id
                    locationShortName
                    locationOtherName
                    stripeAccountId
                    stripeAccountName
                  }
                }
                stripeUser {
                  ... on User {
                    id
                    fullName
                    email
                    stripeAccountId
                    stripeAccountName
                  }
                }
              }
            }
            attachedTransferEntry {
              ... on stripeInvoices_internalTransfer_Entry {
                id
              }
            }
            balance
          }
        }
      }
    }
  }
`;

export const proposedTreatmentChartQuery = gql`
  query proposedTreatmentChartQuery($id: [QueryArgument], $limit: Int = 10) {
    entries(
      section: "dentalChartRecords"
      type: "proposedTreatmentChart"
      orderBy: "dateCreated DESC"
      limit: $limit
      id: $id
    ) {
      ... on dentalChartRecords_proposedTreatmentChart_Entry {
        isOldVersion
        patientFormRecord {
          ... on records_records_Entry {
            dateOfInsertion
          }
        }
        treatmentProposalPdfs {
          ... on staffAssets_Asset {
            id
            title
            dateCreated
            url
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
            dateCreated
            treatmentProposalStatus
            treatmentProposalSurgicalFacility {
              ... on locations_locations_Entry {
                id
                locationShortName
                locationAddressSimple
                locationOtherName
                locationPhoneNumber {
                  number
                }
                locationOtherLogo {
                  url
                }
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
            treatmentProposalTreatmentName
            treatmentProposalMatrix {
              ... on treatmentProposalMatrix_stage_BlockType {
                id
                discountDescription
                discountDeductionValue
                treatmentStageType
                treatmentName
                referencedStage {
                  id
                }
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
        id
        typeHandle
        title
        author {
          id
          fullName
        }
        defaultDentist {
          ... on User {
            id
            fullName
            staffPrimaryLocation {
              ... on locations_locations_Entry {
                id
                locationShortNameState
                locationOtherName
                locationAccountName
                locationBsb
                locationAccountNumber
                locationEmail
              }
            }
            staffClinics {
              ... on locations_locations_Entry {
                id
                locationShortNameState
                locationOtherName
                locationAccountName
                locationBsb
                locationAccountNumber
                locationEmail
              }
            }
          }
        }
        isExternalDentist
        chartingNurse {
          id
          fullName
        }
        chartStatus
        treatmentProposalTreatmentName
        recordTreatmentProposal {
          id
        }
        treatmentProposalTreatment {
          id
        }
        recordEnquiryType
        recordEnquiryTypeLabel: recordEnquiryType(label: true)
        treatmentProposalCoordinator {
          id
          fullName
        }
        chartType
        dateCreated
        dateUpdated
        recordTreatmentDate
        lastEditedBy {
          ... on User {
            id
            fullName
          }
        }
        attachedStripeInvoices {
          ... on stripeInvoices_default_Entry {
            id
            paymentMethod
            recordTreatmentPaymentStatus
            recordTreatmentPaymentStatusLabel: recordTreatmentPaymentStatus(
              label: true
            )
            recordNoteNote
            recordIdForRef
            totalAmount
            paidAmount
            stripeAccountId
            stripeAccountName
            paymentDate
            dateCreated
            dateUpdated
            proposedTreatmentToothMatrix {
              ... on proposedTreatmentToothMatrix_toothDetails_BlockType {
                id
                initialDate
                treatmentItemTitle
                treatmentItemNumber
                treatmentItemDescription
                treatmentFriendlyName
                toothValue
                toothPosition
                completedDate
                approved
                completed
                groupTitle
                groupTitleParent
                customGroupTitle
                customGroupTitleParent
                treatmentPaid
                groupNumber
                visitTitle
                visitNumber
                patientCost
                discountReason
                vgds
                discount
                vetAffairs
                medicare
                cost
                dentist {
                  ... on User {
                    id
                    fullName
                    dentalProviderNumber
                    userTitle
                    stripeAccountId
                    stripeAccountName
                  }
                }
              }
            }
          }
        }
        proposedTreatmentToothMatrix {
          ... on proposedTreatmentToothMatrix_toothDetails_BlockType {
            id
            uniqueId
            initialDate
            treatmentItemTitle
            treatmentItemNumber
            treatmentItemDescription
            treatmentFriendlyName
            toothValue
            toothPosition
            completedDate
            approved
            completed
            groupTitle
            groupTitleParent
            customGroupTitle
            customGroupTitleParent
            treatmentPaid
            groupNumber
            visitTitle
            visitNumber
            patientCost
            discountReason
            vgds
            discount
            vetAffairs
            medicare
            cost
            dentist {
              ... on User {
                id
                fullName
                dentalProviderNumber
                userTitle
                stripeAccountId
                stripeAccountName

                staffPrimaryLocation {
                  ... on locations_locations_Entry {
                    id
                    locationShortNameState
                    locationOtherName
                    locationAccountName
                    locationBsb
                    locationAccountNumber
                    locationEmail
                  }
                }
                staffClinics {
                  ... on locations_locations_Entry {
                    id
                    locationShortNameState
                    locationOtherName
                    locationAccountName
                    locationBsb
                    locationAccountNumber
                    locationEmail
                  }
                }
              }
            }
            isExternalDentist
            treatmentNotes
            attachedSiteSpecificRecords {
              ... on treatmentItemSpecificationRecord_barSpecifications_Entry {
                id
                archLocation
                barMaterial
                barLengthFrom
                barLengthTo
                barType
                provisionalMaterial
                finalProstheticMaterial
                reinforcementOfFinalProsthetic
              }
              ... on treatmentItemSpecificationRecord_itemSpecificationAndDetails_Entry {
                id
                revisedTreatment {
                  id
                }
                attachedSiteSpecificFollowUp(orderBy: "dateCreated ASC") {
                  ... on siteSpecificFollowUp_default_Entry {
                    id
                    title
                    dateCreated
                    dateUpdated
                    #while merging, dont miss this field
                    recordFollowUpDate
                    implantFunctionAtFollowUp
                    implantFunctionAtFollowUpLabel: implantFunctionAtFollowUp(
                      label: true
                    )
                    abutmentFunctionAtFollowUp
                    abutmentFunctionAtFollowUpLabel: abutmentFunctionAtFollowUp(
                      label: true
                    )
                    sinusitis
                    sinusitisLabel: sinusitis(label: true)
                    facialSwelling
                    facialSwellingLabel: facialSwelling(label: true)
                    inflammation
                    inflammationLabel: inflammation(label: true)
                    suppuration
                    suppurationLabel: suppuration(label: true)
                    pain
                    painLabel: pain(label: true)
                    recession
                    recessionLabel: recession(label: true)
                    midShaftSoftTissueDehiscence
                    midShaftSoftTissueDehiscenceLabel: midShaftSoftTissueDehiscence(
                      label: true
                    )
                    firstAbutmentLevelComplication
                    firstAbutmentLevelComplicationLabel: firstAbutmentLevelComplication(
                      label: true
                    )
                    otherAbutmentLevelComplications
                    totalNumberOfAbutmentLevelComplications
                    dateOfFirstAbutmentLevelComplication
                    firstAbutmentLevelComplicationTimeFromSurgery
                    postOperativeSinusDisease
                    postOperativeSinusDiseaseLabel: postOperativeSinusDisease(
                      label: true
                    )
                    boneLoss
                    boneLossLabel: boneLoss(label: true)
                  }
                }
                itemSpecificationMatrix {
                  ... on itemSpecificationMatrix_itemSpecs_BlockType {
                    enableInClinlog
                    implantBrand
                    implantCategory
                    implantLine
                    surface
                    implantBaseAndDiameter
                    abutmentBrand
                    abutmentLength
                    abutmentSerialSequenceBarCode
                    implantLength
                    implantType
                    angleCorrectionAbutment
                    serialSequenceBarCode
                    insertionTorque
                    insertionTorqueLabel: insertionTorque(label: true)
                    radiographicTrabecularDensityHu
                    placement
                    placementLabel: placement(label: true)
                    relevantBoneWidth
                    relevantBoneWidthLabel: relevantBoneWidth(label: true)
                    trabecularBoneDensity
                    trabecularBoneDensityLabel: trabecularBoneDensity(
                      label: true
                    )
                    boneVascularity
                    boneVascularityLabel: boneVascularity(label: true)
                    crestalRest
                    crestalRestLabel: crestalRest(label: true)
                    graftingApplied
                    graftingAppliedLabel: graftingApplied(label: true)
                    graftMaterial
                    graftMaterialLabel: graftMaterial(label: true)
                    intraOperativeSinusComplications
                    intraOperativeSinusComplicationsLabel: intraOperativeSinusComplications(
                      label: true
                    )
                    preOperativeSinusDisease
                    preOperativeSinusDiseaseLabel: preOperativeSinusDisease(
                      label: true
                    )
                    preOperativeSinusDiseaseManagement
                    preOperativeSinusDiseaseManagementLabel: preOperativeSinusDiseaseManagement(
                      label: true
                    )
                    conformanceWithTreatmentPlan
                    conformanceWithTreatmentPlanLabel: conformanceWithTreatmentPlan(
                      label: true
                    )
                    prf
                    lotCode
                    dateOfManufacture
                    dateOfExpiry
                  }
                }
                abutmentDetailsMatrix {
                  ... on abutmentDetailsMatrix_abutment_BlockType {
                    id
                    abutmentBrand
                    abutmentCategory
                    typeAndDiameter
                    gingivalHeight
                    abutmentHeight
                    angleCorrectionAbutment
                    abutmentLength
                    abutmentSerialSequenceBarCode
                    abutmentLotCode
                    abutmentDateOfManufacture
                    abutmentDateOfExpiry
                  }
                }
              }
            }
            treatmentFriendlyName
          }
        }
        anaestheticDetailsMatrix {
          ... on anaestheticDetailsMatrix_anaestheticDetails_BlockType {
            id
            visitNumber
            visitTitle
            groupNumber
            dateCreated
            dateUpdated
            groupTitle
            treatmentPaid
            surgicalFacility {
              ... on locations_locations_Entry {
                id
                locationShortName
                locationAddressSimple
                locationOtherName
              }
            }
            mas {
              ... on mass_default_Entry {
                id
                title
                masShortName
                masEmail
                locationAccountName
                locationBsb
                locationAccountNumber
                locationAddressSimple
              }
            }
            facilityFee
            whichFeeType
            whichFeeTypeLabel: whichFeeType(label: true)
            procedureTime
            maxRebate
            minRebate
            serviceFee
            anaestheticFeeType
            anaestheticFeeTypeLabel: anaestheticFeeType(label: true)
            anaesthetistStatus
            anaesthetistStatusLabel: anaesthetistStatus(label: true)
            anaestheticFee
            treatmentAnaesthetist {
              ... on User {
                id
                fullName
              }
            }
            anaestheticServicesEntity {
              id
              title
            }
            showInProposal
            assignedAppointment {
              id
            }
          }
        }
        laboratoryDetailsMatrix {
          ... on laboratoryDetailsMatrix_laboratory_BlockType {
            id
            visitNumber
            visitTitle
            groupNumber
            dateCreated
            dateUpdated
            groupTitle
            recordLaboratory {
              ... on laboratories_default_Entry {
                id
                title
                laboratoryShortName
              }
            }
            recordLaboratorySetUpTechnician {
              ... on User {
                id
                fullName
              }
            }
            recordLaboratoryMethod
            recordLaboratoryMethodLabel: recordLaboratoryMethod(label: true)
            recordLaboratoryShade
            recordLaboratoryStatus
            recordLaboratoryStatusLabel: recordLaboratoryStatus(label: true)
            recordLabInstructionsDueDateTime
            recordLabInstructionsOvd
            recordLabInstructionsMidline
            recordLabInstructionsPlane
            recordLabOtherInstructions
            recordLabInstructionsShade
            assignedAppointment {
              id
            }
          }
        }
        treatmentProposalSectionOptions {
          ... on treatmentProposalSectionOptions_sectionOptions_BlockType {
            id
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
        prePaymentDepositMatrix {
          ... on prePaymentDepositMatrix_deposit_BlockType {
            id
            prePaymentOrDeposit
            attachedDepositEntry {
              ... on stripeInvoices_recordDeposit_Entry {
                id
                recordClinic {
                  ... on locations_locations_Entry {
                    id
                    locationShortName
                    locationOtherName
                    stripeAccountId
                    stripeAccountName
                  }
                }
              }
            }

            dateOfDeposit
            attachedDepositEntry {
              ... on stripeInvoices_recordDeposit_Entry {
                id
                recordClinic {
                  ... on locations_locations_Entry {
                    id
                    locationShortName
                    locationOtherName
                    stripeAccountId
                    stripeAccountName
                  }
                }
                stripeUser {
                  ... on User {
                    id
                    fullName
                    email
                    stripeAccountId
                    stripeAccountName
                  }
                }
              }
            }
            attachedTransferEntry {
              ... on stripeInvoices_internalTransfer_Entry {
                id
              }
            }
            balance
          }
        }
      }
    }
  }
`;

export const followUpChartQuery = gql`
  query followUpChartQuery($id: [QueryArgument]) {
    entries(
      section: "dentalChartRecords"
      type: "followUpChart"
      id: $id
      orderBy: "dateCreated ASC"
    ) {
      ... on dentalChartRecords_followUpChart_Entry {
        id
        typeHandle
        title
        author {
          id
          fullName
        }
        chartStatus
        chartType
        dateCreated
        dateUpdated
        lastEditedBy {
          ... on User {
            id
            fullName
          }
        }
        proposedTreatmentToothMatrix {
          ... on proposedTreatmentToothMatrix_toothDetails_BlockType {
            id
            initialDate
            treatmentItemTitle
            treatmentItemNumber
            treatmentItemDescription
            toothValue
            toothPosition
            completedDate
            completed
          }
        }
      }
    }
  }
`;
export const freeformOnlyMedicalForms = gql`
  query freeformOnlyMedicalForms($entryId: Int!) {
    patientFormMedicalDentalHistory(entryId: $entryId) {
      id
      dateCreated
    }
  }
`;

export const medicalFormsDataQuery = gql`
  query medicalFormsDataQuery($patientFormRecord: [QueryArgument]) {
    matrixFormsEntries(
      type: "patientFormMedicalDentalHistory"
      patientFormRecord: $patientFormRecord
    ) {
      ... on matrixForms_patientFormMedicalDentalHistory_Entry {
        id
        dateCreated
        patientFormMedicalDentalHistory {
          ... on patientFormMedicalDentalHistory_formfields_BlockType {
            allergies
            additionalAllergies
            conditions
            additionalConditions
            recentHealth
            ladyConditions
            additionalHealth
            prescribedMedication
            prescribedMedicationTable {
              col1
              col2
              col3
            }
            bloodThinners
            vitamins
            additionalVitamins
            artificialBodyParts
            additionalArtificialBodyParts
            anyCancer
            anyCancerDetails
            boneDisease
            additionalBoneDisease
            bisphosphonate
            additionalBisphosphonate
            sglt2Inhibitors
            doesSmoke
            doesAlcohol
            doesDrugs
            dentalMaintenance
            priorDentalMaintenance
            dentureHistory
            dentureHistoryCheck
            oralFunctionStatements
            appearanceOptions
            teethOptions
            scale
            presentingComplaint
            signatureName
            signedPatientGuardian
          }
        }
      }
    }
  }
`;
export const patientFormsDataQuery = gql`
  query patientFormsDataQuery {
    patientForms: entries(section: "patientForms") {
      id
      slug
      title
      dateCreated
      ... on patientForms_patientForms_Entry {
        patientFormsCategory
        patientFormsCategoryLabel: patientFormsCategory(label: true)
        patientFormHandle
        patientFormsFreeformForm {
          id
          handle
        }
      }
      ... on patientForms_waterPikApplication_Entry {
        patientFormsCategory
        patientFormsCategoryLabel: patientFormsCategory(label: true)
        patientFormHandle
        patientFormsFreeformForm {
          id
          handle
        }
      }
    }
  }
`;
export const consultationNotesQuery = gql`
  query consultationNotesQuery {
    consultationNotes: entries(
      section: "consultationNotes"
      orderBy: "consultationNoteSequence asc"
    ) {
      ... on consultationNotes_default_Entry {
        id
        consultationNoteContent
        consultationNoteGroup
        title
        consultationNoteSearchable
        consultationNoteSequence
        consultationNoteClinics {
          ... on locations_locations_Entry {
            id
            locationShortName
            locationOtherName
          }
        }
      }
    }
  }
`;

export const diagnosisOptionsQuery = gql`
  query riskAssesmentQuery {
    other: entries(section: "riskAssessmentQuestion") {
      ... on riskAssessmentQuestion_default_Entry {
        id
        title
        slug
        riskAssessmentQuestionScoreType
        riskAssessmentQuestionAnswers {
          ... on riskAssessmentAnswer_default_Entry {
            id
            title
            slug
            riskAssessmentAnswer
            riskAssessmentAnswerScore
          }
        }
      }
    }
  }
`;

export const treatmentProposalTreatments = gql`
  query treatmentProposalTreatments($filters: [QueryArgument]) {
    treatments: entries(
      section: "treatmentProposalTreatments"
      newEnquiryType: $filters
    ) {
      ... on treatmentProposalTreatments_default_Entry {
        id
        newEnquiryType
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
  }
`;

export const staffLocationsQuery = gql`
  query staffClinicsQuery($id: [QueryArgument]) {
    entries(section: "locations", id: $id) {
      ... on locations_locations_Entry {
        stripePayments
        locationShortName
        # locationAddressSimple
        # stripeAccountName
        locationOtherName
        # stripeAccountId
        # locationShortNameState
        # locationAse {
        #   id
        #   title
        # }
        # mainImage {
        #   id
        #   url
        # }
        # locationOtherLogo {
        #   id
        #   url
        # }
        # slug
        id
      }
    }
  }
`;
export const surgicalFacilityQuery = gql`
  query surgicalFacilityQuery {
    facilities: entries(
      section: "locations"
      locationIsSurgicalFacility: true
    ) {
      ... on locations_locations_Entry {
        locationShortName
        locationAddressSimple
        stripeAccountName
        locationOtherName
        stripeAccountId
        locationShortNameState
        locationAse {
          id
          title
        }
        mainImage {
          id
          url
        }
        locationOtherLogo {
          id
          url
        }
        slug
        id
      }
    }
    ase: entries(section: "anaestheticServiceEntities") {
      ... on anaestheticServiceEntities_default_Entry {
        title
        id
        aseTable {
          col1
          col2
          col3
          col4
          col5
          col6
        }
      }
    }
  }
`;

export const treatmentProposalQuery = gql`
  query treatmentProposalQuery($id: [QueryArgument]) {
    entry(id: $id, section: "treatmentProposal") {
      ... on treatmentProposal_default_Entry {
        id
        dateCreated
        treatmentProposalStatus
        treatmentProposalSurgicalFacility {
          ... on locations_locations_Entry {
            id
            locationShortName
            locationAddressSimple
            locationOtherName
            locationPhoneNumber {
              number
            }
            locationOtherLogo {
              url
            }
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
        treatmentProposalTreatmentName
        treatmentProposalMatrix {
          ... on treatmentProposalMatrix_stage_BlockType {
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
`;

export const treatmentProposalEntriesQuery = gql`
  query treatmentProposalEntriesQuery(
    $treatmentProposalUserRecord: [QueryArgument] = -1
  ) {
    entries(
      section: "treatmentProposal"
      orderBy: "dateCreated Desc"
      treatmentProposalUserRecord: $treatmentProposalUserRecord
    ) {
      ... on treatmentProposal_default_Entry {
        id
        dateCreated
        treatmentProposalStatus
        treatmentProposalStatusLabel: treatmentProposalStatus(label: true)
        treatmentProposalPdfs {
          ... on staffAssets_Asset {
            id
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
`;

export const recordFormEntry = gql`
  query recordFormEntry($id: [QueryArgument]!, $recordClinic: [QueryArgument]) {
    entry(id: $id, recordClinic: $recordClinic, section: "records") {
      ... on records_records_Entry {
        id
        recordTreatmentProposal {
          ... on treatmentProposal_default_Entry {
            id
            treatmentProposalSurgicalFacility {
              ... on locations_locations_Entry {
                id
                locationShortName
                locationAddressSimple
                locationOtherName
                locationOtherLogo {
                  url
                }
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
                recordFirstName
                recordLastName
              }
            }
            newEnquiryType
            treatmentProposalTreatmentName
            treatmentProposalMatrix {
              ... on treatmentProposalMatrix_stage_BlockType {
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
                serviceFee
                minRebate
                maxRebate
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
`;
export const labInstructionsQuery = gql`
  query labInstructionsQuery(
    $recordNoteRecord: [QueryArgument]!
    $recordAttachedTreatments: [QueryArgument]
  ) {
    entry(
      section: "recordNotes"
      recordNoteRecord: $recordNoteRecord
      recordAttachedTreatments: $recordAttachedTreatments
      type: "labInstructions"
      orderBy: "dateCreated DESC"
    ) {
      ... on recordNotes_labInstructions_Entry {
        id
        recordLabInstructionsLab {
          id
          title
          slug
        }
        recordLabInstructionsDueDateTime
        recordLabInstructionsOvd
        recordLabInstructionsMidline
        recordLabInstructionsPlane
        recordLabInstructionsOtherInstructions
        recordLabInstructionsShade
      }
    }
  }
`;
export const caseNoteQuery_v1 = gql`
  query caseNoteQuery($type: [String], $recordNoteRecord: [QueryArgument]) {
    recordNotes: entries(
      section: "recordNotes"
      recordNoteRecord: $recordNoteRecord
      limit: 100
      type: $type
      orderBy: "dateCreated DESC"
    ) {
      id
      title
      typeHandle
      dateCreated
      postDate
      postDateFormatted: postDate @formatDateTime(format: "M jS, Y, g:i a")
      author {
        ... on User {
          id
          fullName
          firstName
          lastName
          email
          groups
          photo {
            url @transform(handle: "x100x100")
          }
          staffClinics {
            id
            title
            ... on locations_locations_Entry {
              locationShortName
              locationOtherName
            }
          }
          technicianLaboratories {
            id
            title
            ... on laboratories_default_Entry {
              laboratoryShortName
            }
          }
          anaesthetistMass {
            id
            title
            ... on mass_default_Entry {
              masShortName
            }
          }
        }
      }
      ... on recordNotes_labPictures_Entry {
        recordNoteImages {
          id
          mimeType
        }
        recordNoteIsPinned
      }
      ... on recordNotes_standardNote_Entry {
        recordNoteNote
        recordNoteIsPinned
      }
      ... on recordNotes_dropboxLink_Entry {
        recordNoteNote
        recordNoteDropboxUrl
      }
      ... on recordNotes_consultationNote_Entry {
        recordNoteNote
        recordNoteClinician
        recordNoteUpperTreatment
        recordNoteLowerTreatment
        recordNoteOtherTreatment
        recordNoteQuoteAmount
        recordNoteDiscountsDiscussed
        recordNoteOkayForResidency
        recordNoteIsPinned
      }
      ... on recordNotes_conversionLikelihood_Entry {
        recordConversionLikelihood
      }
      ... on recordNotes_caseNote_Entry {
        recordNoteNote
        recordNoteIsPinned
        recordNoteDropboxUrl
        recordNoteTaggedCollaborators {
          id
          photo {
            url @transform(handle: "x100x100")
          }
          firstName
          lastName
          fullName
          ... on User {
            email
            staffClinics {
              ... on locations_locations_Entry {
                locationShortNameState
                locationOtherName
              }
            }
          }
        }
        recordConversionLikelihood
        recordConversionPatientEmotion
      }
      ... on recordNotes_riskAssessment_Entry {
        recordNoteIsPinned
        recordRiskAnswers {
          ... on riskAssessmentAnswer_default_Entry {
            id
            slug
            riskAssessmentAnswerScore
            riskAssessmentAnswerWarning
            riskAssessmentAnswerOptions
            riskAssessmentAnswerLink
            riskAssessmentAnswer
            riskAssessmentAnswerQuestion {
              ... on riskAssessmentQuestion_default_Entry {
                id
                riskAssessmentQuestionScoreType
                title
                slug
              }
            }
          }
        }
      }
      ... on recordNotes_templatedConsultationNote_Entry {
        recordNoteNote
        recordNoteNoteJson
        recordNoteIsPinned
      }
      ... on recordNotes_diagnosisAndOptions_Entry {
        recordNoteIsPinned
        recordNoteRecord {
          id
        }
        recordDiagnosisUpperConditions {
          id
          title
          slug
        }
        recordDiagnosisLowerConditions {
          id
          title
          slug
        }
        recordDiagnosisBiteAlignment {
          id
          title
          slug
        }
        recordDiagnosisSoftTissues {
          id
          title
          slug
        }
        recordDiagnosisAesthetic {
          id
          title
          slug
        }
        recordDiagnosisUpperRadiographicFindings {
          id
          title
          slug
        }
        recordDiagnosisLowerRadiographicFindings {
          id
          title
          slug
        }
        recordDiagnosisNotes
        recordDiagnosisDentalChart {
          col1
        }
        recordDiagnosisTreatmentOptions {
          ... on recordDiagnosisTreatmentOptions_treatmentOption_BlockType {
            treatments {
              id
              title
              slug
            }
            lowerTreatments {
              id
              title
              slug
            }
            patientFeedback
            timeframe
            approxCost
            treatmentNotes
            benefitsLimitationsDiscussed
          }
        }
        recordDiagnosisRisksDiscussed {
          id
          title
          slug
        }
        recordDiagnosisExploringOtherOptions
        recordDiagnosisNeedsReferral
        recordDiagnosisDiscussedProprioception
      }
      ... on recordNotes_labInstructions_Entry {
        recordNoteIsPinned
        id
        recordNoteRecord {
          id
        }
        recordLabInstructionsLab {
          id
          title
          slug
        }
        recordLabInstructionsDueDateTime
        recordLabInstructionsOvd
        recordLabInstructionsMidline
        recordLabInstructionsPlane
        recordLabInstructionsOtherInstructions
        recordLabInstructionsShade
      }
    }
  }
`;
export const caseNoteQuery = gql`
  query caseNoteQuery(
    $type: [String]
    $recordNoteRecord: [QueryArgument]
    $offset: Int
    $isPinned: Boolean = null
    $limit: Int = 5
    $orderBy: String = "dateCreated DESC"
  ) {
    recordNotes: entries(
      section: "recordNotes"
      recordNoteRecord: $recordNoteRecord
      limit: $limit
      type: $type
      orderBy: $orderBy
      offset: $offset
      recordNoteIsPinned: $isPinned
    ) {
      id
      title
      typeHandle
      dateCreated
      postDate
      # preDatedNotesDate
      postDateFormatted: postDate @formatDateTime(format: "M jS, Y, g:i a")
      author {
        ... on User {
          id
          fullName
          firstName
          lastName
          email
          groups
          photo {
            url @transform(handle: "x100x100")
          }
          staffClinics {
            id
            title
            ... on locations_locations_Entry {
              locationShortName
              locationOtherName
            }
          }
          technicianLaboratories {
            id
            title
            ... on laboratories_default_Entry {
              laboratoryShortName
            }
          }
          anaesthetistMass {
            id
            title
            ... on mass_default_Entry {
              masShortName
            }
          }
        }
      }
      ... on recordNotes_labPictures_Entry {
        recordNoteImages {
          id
          mimeType
        }
        recordNoteRecord {
          id
        }
        recordNoteIsPinned
      }
      ... on recordNotes_standardNote_Entry {
        recordNoteNote
        recordNoteIsPinned
        recordNoteIsFlagged
        recordNoteRecord {
          id
        }
      }
      ... on recordNotes_clinlogNotes_Entry {
        recordNoteNote
        recordNoteIsPinned
        recordNoteIsFlagged
        recordNoteRecord {
          id
        }
      }
      ... on recordNotes_dropboxLink_Entry {
        recordNoteNote
        recordNoteDropboxUrl
        recordNoteRecord {
          id
        }
      }
      ... on recordNotes_consultationNote_Entry {
        recordNoteNote
        recordNoteClinician
        recordNoteUpperTreatment
        recordNoteLowerTreatment
        recordNoteOtherTreatment
        recordNoteQuoteAmount
        recordNoteDiscountsDiscussed
        recordNoteOkayForResidency
        recordNoteIsPinned
        recordNoteRecord {
          id
        }
      }
      ... on recordNotes_conversionLikelihood_Entry {
        recordConversionLikelihood
        recordNoteRecord {
          id
        }
      }
      ... on recordNotes_caseNote_Entry {
        recordNoteNote
        preDatedNotesDate
        recordNoteIsPinned
        recordNoteDropboxUrl
        recordNoteRecord {
          id
        }
        recordNoteTaggedCollaborators {
          id
          photo {
            url @transform(handle: "x100x100")
          }
          firstName
          lastName
          fullName
          ... on User {
            email
            staffClinics {
              ... on locations_locations_Entry {
                locationShortNameState
                locationOtherName
              }
            }
          }
        }
        recordConversionLikelihood
        recordConversionPatientEmotion
      }
      ... on recordNotes_riskAssessment_Entry {
        recordNoteIsPinned
        recordNoteRecord {
          id
        }
        recordRiskAnswers {
          ... on riskAssessmentAnswer_default_Entry {
            id
            slug
            riskAssessmentAnswerScore
            riskAssessmentAnswerWarning
            riskAssessmentAnswerOptions
            riskAssessmentAnswerLink
            riskAssessmentAnswer
            riskAssessmentAnswerQuestion {
              ... on riskAssessmentQuestion_default_Entry {
                id
                slug
                riskAssessmentQuestionScoreType
                title
              }
            }
          }
        }
      }
      ... on recordNotes_templatedConsultationNote_Entry {
        recordNoteRecord {
          id
        }
        recordNoteNote
        recordNoteNoteJson
        recordNoteIsPinned
      }
      ... on recordNotes_diagnosisAndOptions_Entry {
        recordNoteIsPinned
        recordNoteRecord {
          id
        }
        recordDiagnosisUpperConditions {
          id
          title
          slug
        }
        recordDiagnosisLowerConditions {
          id
          title
          slug
        }
        recordDiagnosisBiteAlignment {
          id
          title
          slug
        }
        recordDiagnosisSoftTissues {
          id
          title
          slug
        }
        recordDiagnosisAesthetic {
          id
          title
          slug
        }
        recordDiagnosisUpperRadiographicFindings {
          id
          title
          slug
        }
        recordDiagnosisLowerRadiographicFindings {
          id
          title
          slug
        }
        recordDiagnosisNotes
        recordDiagnosisDentalChart {
          col1
        }
        recordDiagnosisTreatmentOptions {
          ... on recordDiagnosisTreatmentOptions_treatmentOption_BlockType {
            treatments {
              id
              title
              slug
            }
            lowerTreatments {
              id
              title
              slug
            }
            patientFeedback
            timeframe
            approxCost
            treatmentNotes
            benefitsLimitationsDiscussed
          }
        }
        recordDiagnosisRisksDiscussed {
          id
          title
          slug
        }
        recordDiagnosisExploringOtherOptions
        recordDiagnosisNeedsReferral
        recordDiagnosisDiscussedProprioception
      }
      ... on recordNotes_labInstructions_Entry {
        recordNoteIsPinned
        id
        recordNoteRecord {
          id
        }
        recordLabInstructionsLab {
          id
          title
          slug
        }
        recordLabInstructionsDueDateTime
        recordLabInstructionsOvd
        recordLabInstructionsMidline
        recordLabInstructionsPlane
        recordLabInstructionsOtherInstructions
        recordLabInstructionsShade
      }
    }
  }
`;

export const linkQuery = gql`
  query getImage {
    getImage
  }
`;

export const tagsQuery = gql`
  query tagsQuery {
    tags(tagSearchable: true) {
      ... on diagnosisSoftTissues_Tag {
        id
        title
        groupHandle
      }
      ... on diagnosisAesthetics_Tag {
        id
        title
        groupHandle
      }
      ... on diagnosisRisks_Tag {
        id
        title
        groupHandle
      }
      ... on diagnosisRadiographicFindings_Tag {
        id
        title
        groupHandle
      }
      ... on diagnosisConditions_Tag {
        id
        title
        groupHandle
      }
      ... on diagnosisBiteAlignment_Tag {
        id
        title
        groupHandle
      }
      ... on diagnosisTreatments_Tag {
        id
        title
        groupHandle
      }
    }
  }
`;

export const labBrandAndMouldQuery = gql`
  query labBrandAndMouldQuery {
    entries(section: "teethBrandMoulds") {
      id
      title
    }
  }
`;

export const labLocationQuery = gql`
  query labLocationQuery {
    entries(section: "laboratories") {
      ... on laboratories_default_Entry {
        id
        title
        laboratoryShortName
      }
    }
  }
`;

export const masLocationQuery = gql`
  query masLocationQuery($locationAse: [QueryArgument]) {
    entries(section: "mass", locationAse: $locationAse) {
      ... on mass_default_Entry {
        id
        title
        masShortName
        locationAse {
          ... on anaestheticServiceEntities_default_Entry {
            id
            title
            aseTable {
              col1
              col2
              col3
              col4
              col5
              col6
            }
          }
        }
      }
    }
  }
`;

export const itemTableQuery = gql`
  query createThing {
    entries(section: "treatmentPlanItems") {
      ... on treatmentPlanItems_default_Entry {
        title
        id
        itemTable {
          col1
          col2
          col3
          col4
        }
      }
    }
  }
`;

// Query to fetch patient characteristics data from freeform submissions
export const patientCharacteristicsQueryFreeform = gql`
  query patientCharacteristicsQueryFreeform(
    $entryId: Int! #  $globalId: Int!
  ) {
    patientFormMedicalDentalHistorySubmissions: patientFormMedicalDentalHistory(
      entryId: $entryId
      # globalId: $globalId
      limit: 1
    ) {
      id
      dateCreated
      conditions
      doesSmoke
      doesALCOHOL
      boneDisease
      ladyConditions
    }
    patientFormPreAnaestheticInformationSubmissions: patientFormPreAnaestheticInformation(
      entryId: $entryId # globalId: $globalId
    ) {
      id
      dateCreated
      bmi
    }
  }
`;

// Query to fetch patient characteristics data from matrix form submissions
export const patientCharacteristicsQuery = gql`
  query patientMedicalWarningQueryMatrix($entryId: [QueryArgument]) {
    matrixFormsEntries(
      patientFormRecord: $entryId
      type: [
        "patientFormMedicalDentalHistory"
        "patientFormPreAnaestheticInformation"
      ]
      orderBy: "dateCreated DESC"
    ) {
      ... on matrixForms_patientFormMedicalDentalHistory_Entry {
        patientFormMedicalDentalHistory {
          ... on patientFormMedicalDentalHistory_formfields_BlockType {
            id
            dateCreated
            conditions
            doesSmoke
            doesAlcohol
            boneDisease
            ladyConditions
          }
        }
      }
      ... on matrixForms_patientFormPreAnaestheticInformation_Entry {
        patientFormPreAnaestheticInformation {
          ... on patientFormPreAnaestheticInformation_formfields_BlockType {
            id
            dateCreated
            bmi
          }
        }
      }
    }
  }
`;

export const dentalComponentsQuery = gql`
  query dentalComponentsQuery {
    entries(section: "dentalComponents") {
      ... on dentalComponents_implantList_Entry {
        id
        implantLength
        implantType
        componentReference
        referenceNumber
        brand
        description
        title
        typeHandle
      }
      ... on dentalComponents_abutmentList_Entry {
        id
        title
        typeHandle
        brand
        angleAndDiameter
        angleCorrectionAbutment
        abutmentLength
        description
        referenceNumber
        componentReference
      }
    }
  }
`;
