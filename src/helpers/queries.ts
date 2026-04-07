import { gql } from "graphql-request"

export const patientsTableDataQuery = gql`
  query patientsTableDataQuery(
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
        dateCreated
        recordFirstName
        recordAccountRevenue
        recordCompletionStatus
        recordConsultationDate
        recordConsultationTime
        recordEmail
        recordFollowUpDate
        recordFollowUpRole
        recordLeadStatus
        recordTreatmentProposal {
          ... on treatmentProposal_default_Entry {
            id
            treatmentProposalTreatmentName
          }
        }
        recordPatient {
          ... on User {
            userHowDidYouFindUs
            fullName
            email
          }
        }
        recordTreatmentAnaesthetist(
          status: ["active", "pending", "suspended"]
        ) {
          fullName
        }
        recordTreatmentSurgeons {
          fullName
        }
        recordTreatmentRestorative {
          fullName
        }
        recordClinic {
          ... on locations_locations_Entry {
            id
            locationShortName
            locationOtherName
          }
        }
        recordFollowUpStaffMember {
          ... on User {
            id
            firstName
          }
        }
        recordTreatmentProcedure {
          title
        }
        recordTreatmentProposal {
          ... on treatmentProposal_default_Entry {
            id
            treatmentProposalTreatmentName
          }
        }
        recordLastName
        recordTreatmentAnaesthetistsFee
        recordCaseConsultedDate
        recordCaseBookedDate
        recordCaseCompletedDate
        recordTreatmentDate
        recordTreatmentStatus
        recordMobilePhone
        recordHomePhone
        recordEnquiryDate
        recordEnquiryType
        recordLeadType
        recordConsultationStatus
        recordFollowUpStatus
        url
        slug
        recordAnaesthetistStatus
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
        dateCreated
        recordAccountRevenue
        recordCompletionStatus
        recordConsultationDate
        recordEmail
        recordFollowUpDate
        recordFollowUpRole
        recordPatient {
          ... on User {
            userHowDidYouFindUs
            fullName
          }
        }
        recordTreatmentAnaesthetist(
          status: ["active", "pending", "suspended"]
        ) {
          fullName
        }
        recordTreatmentSurgeons {
          fullName
        }
        recordTreatmentRestorative {
          fullName
        }
        recordClinic {
          ... on locations_locations_Entry {
            id
            locationShortName
            locationOtherName
          }
        }
        recordFollowUpStaffMember {
          ... on User {
            id
            firstName
          }
        }
        recordTreatmentProcedure {
          title
        }
        recordTreatmentProposal {
          ... on treatmentProposal_default_Entry {
            id
            treatmentProposalTreatmentName
          }
        }
        recordLastName
        recordTreatmentAnaesthetistsFee
        recordTreatmentDate
        recordTreatmentStatus
        recordMobilePhone
        recordHomePhone
        recordEnquiryDate
        recordEnquiryType
        recordLeadType
        recordConsultationStatus
        recordFollowUpStatus
        url
        slug
        recordAnaesthetistStatus
      }
    }
  }
`

export const masTableDataQuery = gql`
  query patientsTableDataQuery(
    $recordMas: [QueryArgument]
    $recordLaboratory: [QueryArgument]
  ) {
    entries(
      section: "records"
      recordMas: $recordMas
      recordLaboratory: $recordLaboratory
      orderBy: "dateUpdated DESC"
    ) {
      ... on records_records_Entry {
        id
        dateCreated
        recordFirstName
        recordAccountRevenue
        recordCompletionStatus
        recordConsultationDate
        recordEmail
        recordFollowUpDate
        recordFollowUpRole
        recordPatient {
          ... on User {
            userHowDidYouFindUs
            fullName
            email
          }
        }
        recordTreatmentAnaesthetist(
          status: ["active", "pending", "suspended"]
        ) {
          fullName
        }
        recordTreatmentSurgeons {
          fullName
        }
        recordTreatmentRestorative {
          fullName
        }
        recordClinic {
          ... on locations_locations_Entry {
            id
            locationShortName
            locationOtherName
          }
        }
        recordFollowUpStaffMember {
          ... on User {
            id
            firstName
          }
        }
        recordTreatmentProcedure {
          title
        }
        recordTreatmentProposal {
          ... on treatmentProposal_default_Entry {
            id
            treatmentProposalTreatmentName
          }
        }
        recordLastName
        recordTreatmentAnaesthetistsFee
        recordCaseConsultedDate
        recordCaseBookedDate
        recordCaseCompletedDate
        recordTreatmentDate
        recordTreatmentStatus
        recordMobilePhone
        recordHomePhone
        recordEnquiryDate
        recordEnquiryType
        recordLeadType
        recordConsultationStatus
        recordFollowUpStatus
        url
        slug
        recordAnaesthetistStatus
      }
    }
  }
`
export const locationQuery = gql`
  query locationQuery {
    entries(section: "locations", type: "locations") {
      ... on locations_locations_Entry {
        locationShortName
        slug
        id
      }
    }
  }
`

export const logosQuery = gql`
  query logosQuery($recordClinic: [String] = "burwood-east") {
    entry(section: "locations", slug: $recordClinic) {
      ... on locations_locations_Entry {
        locationShortName
        locationPlusClinic
        locationOtherLogo {
          url
        }
      }
    }
  }
`

export const notesQuery = gql`
  query notesQuery {
    entries(section: "recordNotes", type: "consultationNote") {
      ... on recordNotes_consultationNote_Entry {
        id
        recordNoteRecord {
          id
        }
        recordNoteLowerTreatment
        recordNoteUpperTreatment
      }
    }
  }
`

export const inputLeadsQuery = gql`
  query inputLeadsQuery($id: [QueryArgument]) {
    entries(section: "locations", type: "locations", id: $id) {
      ... on locations_locations_Entry {
        id
        locationInputLeads {
          year
          jan
          feb
          mar
          apr
          may
          jun
          jul
          aug
          sep
          oct
          nov
          dec
        }
      }
    }
  }
`

export const inputLeadsQueryAdmin = gql`
  query inputLeadsQuery {
    entries(section: "locations", type: "locations") {
      ... on locations_locations_Entry {
        id
        locationShortName
        locationInputLeads {
          year
          jan
          feb
          mar
          apr
          may
          jun
          jul
          aug
          sep
          oct
          nov
          dec
        }
      }
    }
  }
`

export const numbersQuery = gql`
  query numbersQuery(
    $currentDate: QueryArgument
    $beforeCurrentDate: QueryArgument
    $oneMonthPriorDate: QueryArgument
    $twoMonthPriorDate: QueryArgument
    $afterCurrentDate: QueryArgument
    $beforeCurrentDateString: [String]
    $recordClinic: [QueryArgument]
  ) {
    leads: entryCount(
      recordClinic: $recordClinic
      recordConsultationStatus: [null, "noShow"]
      recordTreatmentStatus: [null, "noAppointments"]
      section: "records"
    )
    consults: entryCount(
      recordClinic: $recordClinic
      recordConsultationStatus: ["attended", "booked", "noShow"]
      recordTreatmentStatus: [null, "noAppointments"]
      section: "records"
    )
    consultsAttended: entryCount(
      recordClinic: $recordClinic
      recordConsultationStatus: ["attended"]
      recordTreatmentStatus: [null, "noAppointments"]
      section: "records"
    )
    booked: entryCount(
      recordClinic: $recordClinic
      recordTreatmentStatus: ["bookedNoDeposit", "bookedWithDeposit"]
      section: "records"
    )
    all: entryCount(recordClinic: $recordClinic, section: "records")
    recall: entryCount(
      recordClinic: $recordClinic
      recordTreatmentStatus: "completed"
      section: "records"
    )
    allPrior: entryCount(
      section: "records"
      recordClinic: $recordClinic
      dateCreated: $beforeCurrentDateString
    )
    activeLeadsCount: entryCount(
      section: "records"
      recordClinic: $recordClinic
      recordEnquiryDate: ["and", $oneMonthPriorDate, $currentDate]
      recordCaseConsultedDate: ["or", ":empty:", $afterCurrentDate]
      recordCaseBookedDate: ["or", ":empty:", $afterCurrentDate]
      recordCaseCompletedDate: ["or", ":empty:", $afterCurrentDate]
    )
    activeLeadsCountPrior: entryCount(
      section: "records"
      recordClinic: $recordClinic
      recordEnquiryDate: ["and", $twoMonthPriorDate, $beforeCurrentDate]
      recordCaseConsultedDate: ["or", ":empty:", $oneMonthPriorDate]
      recordCaseBookedDate: ["or", ":empty:", $oneMonthPriorDate]
      recordCaseCompletedDate: ["or", ":empty:", $oneMonthPriorDate]
    )
    consultationsLeadCount: entryCount(
      section: "records"
      recordClinic: $recordClinic
      recordCaseConsultedDate: ["and", $oneMonthPriorDate, $currentDate]
      recordCaseBookedDate: ["or", ":empty:", $afterCurrentDate]
      recordCaseCompletedDate: ["or", ":empty:", $afterCurrentDate]
    )
    consultationsLeadCountPrior: entryCount(
      section: "records"
      recordClinic: $recordClinic
      recordCaseConsultedDate: ["and", $twoMonthPriorDate, $beforeCurrentDate]
      recordCaseBookedDate: ["or", ":empty:", $oneMonthPriorDate]
      recordCaseCompletedDate: ["or", ":empty:", $oneMonthPriorDate]
    )
    treatmentsBookedCount: entryCount(
      section: "records"
      recordClinic: $recordClinic
      recordCaseBookedDate: ["and", $oneMonthPriorDate, $currentDate]
      recordCaseCompletedDate: ["or", ":empty:", $afterCurrentDate]
    )
    treatmentsBookedCountPrior: entryCount(
      section: "records"
      recordClinic: $recordClinic
      recordCaseBookedDate: ["and", $twoMonthPriorDate, $beforeCurrentDate]
      recordCaseCompletedDate: ["or", ":empty:", $oneMonthPriorDate]
    )
    treatmentsCompletedCount: entryCount(
      section: "records"
      recordClinic: $recordClinic
      recordCaseCompletedDate: ["and", $oneMonthPriorDate, $currentDate]
    )
    treatmentsCompletedCountPrior: entryCount(
      section: "records"
      recordClinic: $recordClinic
      recordCaseCompletedDate: ["and", $twoMonthPriorDate, $beforeCurrentDate]
    )
  }
`

export const bookedTreatmentQuery = gql`
  query bookedTreatmentQuery(
    $surgeonId: [QueryArgument] = -1
    $anaesthetistId: [QueryArgument] = -1
    $bookedStatus: [QueryArgument] = -1
    $currentDate: [QueryArgument]
    $recordClinic: [QueryArgument]
    $recordMas: [QueryArgument]
    $userId: [QueryArgument]
  ) {
    entries(
      section: "records"
      recordClinic: $recordClinic
      recordTreatmentAnaesthetist: $anaesthetistId
      recordTreatmentSurgeons: $surgeonId
      recordTreatmentStatus: $bookedStatus
      recordTreatmentDate: $currentDate
      orderBy: "recordTreatmentDate ASC"
    ) {
      ... on records_records_Entry {
        id
        recordBmi
        recordFollowUpStaffMember {
          ... on User {
            id
            firstName
          }
        }
        recordPatient {
          ... on User {
            fullName
          }
        }
        recordFirstName
        recordTreatmentProcedure {
          title
        }
        recordLastName
        recordClinic {
          ... on locations_locations_Entry {
            id
          }
        }
        recordEmail
        recordFollowUpStatus
        recordFollowUpDate
        recordTreatmentStatus
        recordTreatmentSurgeons {
          id
          fullName
        }
        recordTreatmentAnaesthetist {
          id
          fullName
        }
        recordCompletionStatus
        recordTreatmentDate
        url
        recordClinic {
          ... on locations_locations_Entry {
            id
            locationShortName
          }
        }
        recordAnaesthetistStatus
      }
    }
    masEntries: entries(
      section: "records"
      recordMas: $recordMas
      recordTreatmentAnaesthetist: $anaesthetistId
      recordTreatmentSurgeons: $surgeonId
      recordTreatmentStatus: $bookedStatus
      recordTreatmentDate: $currentDate
      orderBy: "recordTreatmentDate ASC"
    ) {
      ... on records_records_Entry {
        id
        recordFollowUpStaffMember {
          ... on User {
            id
            firstName
          }
        }
        recordPatient {
          ... on User {
            fullName
          }
        }
        recordFirstName
        recordTreatmentProcedure {
          title
        }
        recordLastName
        recordClinic {
          ... on locations_locations_Entry {
            id
          }
        }
        recordEmail
        recordFollowUpStatus
        recordFollowUpDate
        recordTreatmentStatus
        recordTreatmentSurgeons {
          id
          fullName
        }
        recordTreatmentAnaesthetist {
          id
          fullName
        }
        recordCompletionStatus
        recordTreatmentDate
        url
        recordClinic {
          ... on locations_locations_Entry {
            id
            locationShortName
          }
        }
        recordAnaesthetistStatus
      }
    }
    formsCollaborators: entries(
      section: "records"
      recordFormsCollaborators: $userId
      recordTreatmentAnaesthetist: $anaesthetistId
      recordTreatmentSurgeons: $surgeonId
      recordTreatmentStatus: $bookedStatus
      recordTreatmentDate: $currentDate
      orderBy: "recordTreatmentDate ASC"
    ) {
      ... on records_records_Entry {
        id
        recordFollowUpStaffMember {
          ... on User {
            id
            firstName
          }
        }
        recordPatient {
          ... on User {
            fullName
          }
        }
        recordBmi
        recordFirstName
        recordTreatmentProcedure {
          title
        }
        recordLastName
        recordEmail
        recordFollowUpStatus
        recordFollowUpDate
        recordClinic {
          ... on locations_locations_Entry {
            id
          }
        }
        recordTreatmentStatus
        recordTreatmentSurgeons {
          id
          fullName
        }
        recordTreatmentAnaesthetist {
          id
          fullName
        }
        recordCompletionStatus
        recordTreatmentDate
        url
        recordClinic {
          ... on locations_locations_Entry {
            id
            locationShortName
          }
        }
        recordAnaesthetistStatus
      }
    }
  }
`

export const upcomingConsultationsQuery = gql`
  query upcomingConsultationsQuery(
    $recordClinic: [QueryArgument]
    $recordMas: [QueryArgument]
    $recordLaboratory: [QueryArgument]
    $currentDate: [QueryArgument]
    $userId: [QueryArgument]
  ) {
    entries(
      section: "records"
      recordClinic: $recordClinic
      recordConsultationStatus: ["attended", "booked", "noShow"]
      recordTreatmentStatus: [null, "noAppointments"]
      recordConsultationDate: $currentDate
      orderBy: "recordConsultationDate ASC"
    ) {
      ... on records_records_Entry {
        id
        recordFirstName
        recordFollowUpDate
        recordLastName
        recordEmail
        recordMobilePhone
        recordClinic {
          ... on locations_locations_Entry {
            id
          }
        }
        recordPatient {
          ... on User {
            fullName
          }
        }
        recordTreatmentSurgeons {
          id
          fullName
        }
        recordTreatmentAnaesthetist {
          id
          fullName
        }
        recordCompletionStatus
        recordConsultationDate
        recordTreatmentDate
        url
      }
    }
    masEntries: entries(
      section: "records"
      recordMas: $recordMas
      recordConsultationStatus: ["attended", "booked", "noShow"]
      recordTreatmentStatus: [null, "noAppointments"]
      recordConsultationDate: $currentDate
      orderBy: "recordConsultationDate ASC"
    ) {
      ... on records_records_Entry {
        id
        recordFirstName
        recordFollowUpDate
        recordLastName
        recordEmail
        recordMobilePhone
        recordClinic {
          ... on locations_locations_Entry {
            id
          }
        }
        recordPatient {
          ... on User {
            fullName
          }
        }
        recordTreatmentSurgeons {
          id
          fullName
        }
        recordTreatmentAnaesthetist {
          id
          fullName
        }
        recordCompletionStatus
        recordConsultationDate
        recordTreatmentDate
        url
      }
    }
    laboratoryEntries: entries(
      section: "records"
      recordLaboratory: $recordLaboratory
      recordConsultationStatus: ["attended", "booked", "noShow"]
      recordTreatmentStatus: [null, "noAppointments"]
      recordConsultationDate: $currentDate
      orderBy: "recordConsultationDate ASC"
    ) {
      ... on records_records_Entry {
        id
        recordFirstName
        recordFollowUpDate
        recordLastName
        recordEmail
        recordMobilePhone
        recordClinic {
          ... on locations_locations_Entry {
            id
          }
        }
        recordPatient {
          ... on User {
            fullName
          }
        }
        recordTreatmentSurgeons {
          id
          fullName
        }
        recordTreatmentAnaesthetist {
          id
          fullName
        }
        recordCompletionStatus
        recordConsultationDate
        recordTreatmentDate
        url
      }
    }
    formsCollaborators: entries(
      section: "records"
      recordFormsCollaborators: $userId
      recordConsultationStatus: "booked"
      recordTreatmentStatus: [null, "noAppointments"]
      recordConsultationDate: $currentDate
      orderBy: "recordConsultationDate ASC"
    ) {
      ... on records_records_Entry {
        id
        recordFirstName
        recordFollowUpDate
        recordLastName
        recordEmail
        recordMobilePhone
        recordPatient {
          ... on User {
            fullName
          }
        }
        recordClinic {
          ... on locations_locations_Entry {
            id
            locationShortName
          }
        }
        recordTreatmentSurgeons {
          id
          fullName
        }
        recordTreatmentAnaesthetist {
          id
          fullName
        }
        recordCompletionStatus
        recordConsultationDate
        recordTreatmentDate
        url
      }
    }
  }
`
export const upcomingTreatmentsQuery = gql`
  query upcomingTreatmentsQuery(
    $recordClinic: [QueryArgument]
    $recordMas: [QueryArgument]
    $currentDate: [QueryArgument]
    $userId: [QueryArgument]
    $recordLaboratory: [QueryArgument]
  ) {
    entries(
      section: "records"
      recordClinic: $recordClinic
      recordTreatmentDate: $currentDate
      orderBy: "recordTreatmentDate ASC"
    ) {
      ... on records_records_Entry {
        id
        recordFirstName
        recordBmi
        recordTreatmentProcedure {
          title
        }
        recordFollowUpDate
        recordLastName
        recordEmail
        recordMobilePhone
        recordClinic {
          ... on locations_locations_Entry {
            id
          }
        }
        recordTreatmentProposal {
          ... on treatmentProposal_default_Entry {
            id
            treatmentProposalTreatmentName
          }
        }
        recordTreatmentSurgeons {
          id
          fullName
        }
        recordTreatmentAnaesthetist {
          id
          fullName
        }
        recordTreatmentRestorative {
          id
          fullName
        }
        recordTreatmentStatus
        recordCompletionStatus
        recordConsultationDate
        recordTreatmentDate
        url
        recordPatient {
          ... on User {
            id
            userDateOfBirth
            fullName
          }
        }
        recordAnaesthetistStatus
      }
    }
    laboratoryEntries: entries(
      section: "records"
      recordLaboratory: $recordLaboratory
      recordTreatmentDate: $currentDate
      orderBy: "recordTreatmentDate ASC"
    ) {
      ... on records_records_Entry {
        id
        recordFirstName
        recordTreatmentProcedure {
          title
        }
        recordFollowUpDate
        recordTreatmentStatus
        recordLastName
        recordEmail
        recordMobilePhone
        recordClinic {
          ... on locations_locations_Entry {
            id
          }
        }
        recordTreatmentProposal {
          ... on treatmentProposal_default_Entry {
            id
            treatmentProposalTreatmentName
          }
        }
        recordTreatmentSurgeons {
          id
          fullName
        }
        recordTreatmentAnaesthetist {
          id
          fullName
        }
        recordCompletionStatus
        recordConsultationDate
        recordTreatmentDate
        url
        recordPatient {
          ... on User {
            id
            userDateOfBirth
            fullName
          }
        }
      }
    }
    masEntries: entries(
      section: "records"
      recordMas: $recordMas
      recordTreatmentDate: $currentDate
      orderBy: "recordTreatmentDate ASC"
    ) {
      ... on records_records_Entry {
        id
        recordFirstName
        recordTreatmentProcedure {
          title
        }
        recordFollowUpDate
        recordLastName
        recordEmail
        recordMobilePhone
        recordClinic {
          ... on locations_locations_Entry {
            id
          }
        }
        recordTreatmentStatus
        recordTreatmentProposal {
          ... on treatmentProposal_default_Entry {
            id
            treatmentProposalTreatmentName
          }
        }
        recordTreatmentSurgeons {
          id
          fullName
        }
        recordTreatmentAnaesthetist {
          id
          fullName
        }
        recordAnaesthetistStatus
        recordCompletionStatus
        recordConsultationDate
        recordTreatmentDate
        url
        recordPatient {
          ... on User {
            id
            userDateOfBirth
            fullName
          }
        }
      }
    }
    formsCollaborators: entries(
      section: "records"
      recordFormsCollaborators: $userId
      recordTreatmentDate: $currentDate
      orderBy: "recordTreatmentDate ASC"
    ) {
      ... on records_records_Entry {
        id
        recordFirstName
        recordTreatmentProcedure {
          title
        }
        recordBmi
        recordFollowUpDate
        recordLastName
        recordEmail
        recordMobilePhone
        recordClinic {
          ... on locations_locations_Entry {
            id
            locationShortName
          }
        }
        recordTreatmentProposal {
          ... on treatmentProposal_default_Entry {
            id
            treatmentProposalTreatmentName
          }
        }
        recordTreatmentSurgeons {
          id
          fullName
        }
        recordTreatmentAnaesthetist {
          id
          fullName
        }
        recordTreatmentRestorative {
          id
          fullName
        }
        recordAnaesthetistStatus
        recordTreatmentStatus
        recordCompletionStatus
        recordConsultationDate
        recordTreatmentDate
        url
        recordPatient {
          ... on User {
            id
            userDateOfBirth
            fullName
          }
        }
      }
    }
  }
`

export const upcomingTreatmentsMasAndLabQuery = gql`
  query upcomingTreatmentsMasAndLabQuery(
    $recordClinic: [QueryArgument]
    $recordMas: [QueryArgument]
    $currentDate: [QueryArgument]
    $userId: [QueryArgument]
    $recordLaboratory: [QueryArgument]
  ) {
    masEntries: entries(
      section: "records"
      recordMas: $recordMas
      recordTreatmentDate: $currentDate
      orderBy: "recordTreatmentDate ASC"
    ) {
      ... on records_records_Entry {
        id
        recordFirstName
        recordTreatmentProcedure {
          title
        }
        recordFollowUpDate
        recordLastName
        recordEmail
        recordMobilePhone
        recordClinic {
          ... on locations_locations_Entry {
            id
          }
        }
        recordTreatmentProposal {
          ... on treatmentProposal_default_Entry {
            id
            treatmentProposalTreatmentName
          }
        }
        recordTreatmentSurgeons {
          id
          fullName
        }
        recordTreatmentAnaesthetist {
          id
          fullName
        }
        recordAnaesthetistStatus
        recordCompletionStatus
        recordConsultationDate
        recordTreatmentDate
        url
        recordPatient {
          ... on User {
            id
            userDateOfBirth
            fullName
          }
        }
      }
    }
  }
`
export const staffClinicQuery = gql`
  query staffClinicQuery(
    $role: [QueryArgument] = null
    $staffClinics: [QueryArgument]
    $anaesthetistMass: [QueryArgument]
    $technicianLaboratories: [QueryArgument]
    $id: [QueryArgument]
  ) {
    users(
      staffClinics: $staffClinics
      group: $role
      status: "active"
      anaesthetistMass: $anaesthetistMass
      technicianLaboratories: $technicianLaboratories
    ) {
      ... on User {
        id
        fullName
        groups
        photo {
          url @transform(handle: "x100x100")
        }
        staffReceivesNotificationEmail
        staffReceivesCollaborationEmail
        email
        staffClinics {
          ... on locations_locations_Entry {
            locationShortNameState
            locationOtherName
            locationShortName
          }
        }
        anaesthetistMass {
          ... on mass_default_Entry {
            id
            masShortName
            title
          }
        }
        technicianLaboratories {
          ... on laboratories_default_Entry {
            id
            title
          }
        }
      }
    }
    formCollaborators: entry(id: $id, section: "records") {
      ... on records_records_Entry {
        recordFormsCollaborators(group: $role) {
          fullName
          id
          photo {
            url @transform(handle: "x100x100")
          }
          ... on User {
            staffReceivesNotificationEmail
            staffReceivesCollaborationEmail
            groups
            email
            staffClinics {
              ... on locations_locations_Entry {
                locationShortNameState
                locationOtherName
              }
            }
          }
        }
      }
    }
  }
`

export const staffClinicQueryForCollabs = gql`
  query staffClinicQueryForCollabs {
    users(
      group: [
        "businessManager"
        "dentist"
        "nurse"
        "overseer"
        "receptionist"
        "treatmentCoordinator"
        "externalDentist"
      ]
      status: "active"
    ) {
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
  }
`
export const lastEditedQuery = gql`
  query lastEditedQuery(
    $recordClinic: [QueryArgument]
    $recordMas: [QueryArgument]
    $recordLaboratory: [QueryArgument]
    $userId: [QueryArgument]
  ) {
    entries(
      section: "records"
      recordClinic: $recordClinic
      orderBy: "dateUpdated DESC"
      limit: 20
    ) {
      ... on records_records_Entry {
        id
        recordFirstName
        recordLastName
        status
        recordPatient {
          ... on User {
            fullName
          }
        }
        recordClinic {
          ... on locations_locations_Entry {
            id
          }
        }
        recordFollowUpStatus
        recordFollowUpDate
        url
        recordCaseConsultedDate
        recordCaseBookedDate
        recordCaseCompletedDate
        isRevision
      }
    }
    masEntries: entries(
      section: "records"
      recordMas: $recordMas
      orderBy: "dateUpdated DESC"
      limit: 20
    ) {
      ... on records_records_Entry {
        id
        recordFirstName
        recordLastName
        status
        recordPatient {
          ... on User {
            fullName
          }
        }
        recordClinic {
          ... on locations_locations_Entry {
            id
          }
        }
        recordFollowUpStatus
        recordFollowUpDate
        url
        recordCaseConsultedDate
        recordCaseBookedDate
        recordCaseCompletedDate
        isRevision
      }
    }
    laboratoryEntries: entries(
      section: "records"
      recordLaboratory: $recordLaboratory
      orderBy: "dateUpdated DESC"
      limit: 20
    ) {
      ... on records_records_Entry {
        id
        recordFirstName
        recordLastName
        status
        recordPatient {
          ... on User {
            fullName
          }
        }
        recordClinic {
          ... on locations_locations_Entry {
            id
          }
        }
        recordFollowUpStatus
        recordFollowUpDate
        url
        recordCaseConsultedDate
        recordCaseBookedDate
        recordCaseCompletedDate
        isRevision
      }
    }
    formsCollaborators: entries(
      section: "records"
      recordFormsCollaborators: $userId
      orderBy: "dateUpdated DESC"
      limit: 20
    ) {
      ... on records_records_Entry {
        id
        recordFirstName
        recordLastName
        status
        recordPatient {
          ... on User {
            fullName
          }
        }
        recordClinic {
          ... on locations_locations_Entry {
            id
            locationShortName
          }
        }
        recordFollowUpStatus
        recordFollowUpDate
        url
        recordCaseConsultedDate
        recordCaseBookedDate
        recordCaseCompletedDate
        isRevision
      }
    }
  }
`

export const remindersQuery = gql`
  query remindersQuery($recordNotificationSender: [QueryArgument]) {
    entries(
      orderBy: "recordNotificationReminderOrder ASC"
      section: "recordNotifications"
      recordNotificationType: "reminder"
      recordNotificationSender: $recordNotificationSender
    ) {
      ... on recordNotifications_recordNotifications_Entry {
        id
        recordNotificationSubject
        recordNotificationCompleted
        recordNotificationMessage
        recordNotificationRecord {
          id
        }
        recordNotificationReminderOrder
        recordNotificationTaskList {
          col1
          col2
          col3
        }
      }
    }
  }
`

export const inboxMessagesQuery = gql`
  query inboxMessagesQuery($recordNotificationRecipients: [QueryArgument]) {
    inboxMessages: entries(
      recordNotificationRecipients: $recordNotificationRecipients
      limit: 50
      section: "recordNotifications"
      type: "recordNotifications"
      recordNotificationType: "not reminder"
    ) {
      id
      slug
      typeHandle
      dateUpdated
      dateCreated
      ... on recordNotifications_recordNotifications_Entry {
        recordNotificationCompleted
        recordNotificationMessage
        recordNotificationSubject
        recordNotificationPinned
        recordNotificationRecord {
          id
        }
        recordNotificationRecordName
        recordNotificationRecordUrl
        recordNotificationReadBy {
          id
        }
        recordNotificationSender {
          id
          fullName
          email
          photo {
            url @transform(handle: "x100x100")
          }
        }
        recordNotificationRecipients {
          id
          fullName
        }
        recordNotificationType
        recordNotificationTypeLabel: recordNotificationType(label: true)
      }
    }
    adminMessages: entries(
      limit: 50
      dateCreated: ">= 2023-12-01"
      section: "recordNotifications"
      type: "adminNotifications"
    ) {
      id
      slug
      typeHandle
      dateUpdated
      dateCreated
      ... on recordNotifications_adminNotifications_Entry {
        recordNotificationMessage
        recordNotificationSubject
        recordNotificationRecordUrl
        recordNotificationReadBy {
          id
        }
        recordNotificationSender {
          id
          fullName
          email
          photo {
            url @transform(handle: "x100x100")
          }
        }
      }
    }
  }
`
export const sentMessagesQuery = gql`
  query sentMessagesQuery($recordNotificationSender: [QueryArgument]) {
    sentMessages: entries(
      recordNotificationSender: $recordNotificationSender
      limit: 50
      section: "recordNotifications"
      type: "recordNotifications"
      recordNotificationType: "not reminder"
    ) {
      id
      slug
      typeHandle
      dateUpdated
      dateCreated
      ... on recordNotifications_recordNotifications_Entry {
        recordNotificationCompleted
        recordNotificationMessage
        recordNotificationSubject
        recordNotificationPinned
        recordNotificationRecord {
          id
        }
        recordNotificationRecordName
        recordNotificationRecordUrl
        recordNotificationReadBy {
          id
        }
        recordNotificationSender {
          id
          fullName
          email
          photo {
            url @transform(handle: "x100x100")
          }
        }
        recordNotificationRecipients {
          id
          fullName
        }
        recordNotificationType
        recordNotificationTypeLabel: recordNotificationType(label: true)
      }
    }
  }
`

export const notificationHistoryQuery = gql`
  query notificationHistoryQuery($recordNotificationRecord: [QueryArgument]) {
    entries(
      section: "recordNotifications"
      type: "recordNotifications"
      recordNotificationType: "not reminder"
      recordNotificationRecord: $recordNotificationRecord
    ) {
      ... on recordNotifications_recordNotifications_Entry {
        id
        recordNotificationMessage
        recordNotificationSubject
        dateUpdated
        dateCreated
        typeHandle
        recordNotificationRecord {
          id
        }
        recordNotificationRecordName
        recordNotificationSender {
          ... on User {
            id
            fullName
            firstName
            lastName
            groups
            photo {
              url @transform(handle: "x100x100")
            }
            staffClinics {
              ... on locations_locations_Entry {
                id
                title
                locationShortNameState
                locationOtherName
                locationShortName
              }
            }
            anaesthetistMass {
              ... on mass_default_Entry {
                id
                masShortName
                title
              }
            }
            technicianLaboratories {
              ... on laboratories_default_Entry {
                id
                title
              }
            }
          }
        }
        postDateFormatted: postDate @formatDateTime(format: "M jS, Y, g:i a")
        recordNotificationRecipients {
          ... on User {
            id
            fullName
            firstName
            lastName
            groups
            photo {
              url @transform(handle: "x100x100")
            }
            staffClinics {
              ... on locations_locations_Entry {
                id
                title
                locationShortNameState
                locationOtherName
                locationShortName
              }
            }
            anaesthetistMass {
              ... on mass_default_Entry {
                id
                masShortName
                title
              }
            }
            technicianLaboratories {
              ... on laboratories_default_Entry {
                id
                title
              }
            }
          }
        }
      }
    }
  }
`
//gql queryargument for recordFollowUpStatus not inactive

export const myFollowUpsQuery = gql`
  query myFollowUpsQuery(
    $recordFollowUpStaffMember: [QueryArgument]
    $recordFollowUpRole: [QueryArgument]
    $recordClinic: [QueryArgument]!
    $userId: [QueryArgument]
  ) {
    entries(
      section: "records"
      recordClinic: $recordClinic
      recordFollowUpStatus: "followUp"
      recordFollowUpStaffMember: $recordFollowUpStaffMember
      recordFollowUpRole: $recordFollowUpRole
      orderBy: "recordFollowUpDate ASC"
    ) {
      ... on records_records_Entry {
        id
        recordFirstName
        recordLastName
        recordFollowUpDate
        recordFollowUpStatus
        recordPatient {
          ... on User {
            fullName
          }
        }
        recordClinic {
          ... on locations_locations_Entry {
            id
          }
        }
        recordFollowUpStaffMember {
          ... on User {
            id
            firstName
            fullName
          }
        }
        url
      }
    }
    formsCollaborators: entries(
      section: "records"
      recordFollowUpStatus: "followUp"
      recordFollowUpStaffMember: $recordFollowUpStaffMember
      recordFollowUpRole: $recordFollowUpRole
      recordFormsCollaborators: $userId
      orderBy: "recordFollowUpDate ASC"
    ) {
      ... on records_records_Entry {
        id
        recordFirstName
        recordLastName
        recordFollowUpDate
        recordPatient {
          ... on User {
            fullName
          }
        }
        recordClinic {
          ... on locations_locations_Entry {
            id
            locationShortName
          }
        }
        recordFollowUpStatus
        recordFollowUpStaffMember {
          ... on User {
            id
            firstName
            fullName
          }
        }
        url
      }
    }
  }
`

export const roleFollowUpsQuery = gql`
  query roleFollowUpsQuery(
    $recordFollowUpRole: [QueryArgument]
    $recordClinic: [QueryArgument]!
    $limit: Int
    $offset: Int
  ) {
    entries(
      section: "records"
      recordClinic: $recordClinic
      recordFollowUpStatus: "followUp"
      recordFollowUpRole: $recordFollowUpRole
      orderBy: "recordFollowUpDate ASC"
      limit: $limit
      offset: $offset
      recordTreatmentStatus: [
        null
        "noAppointments"
        "bookedWithDeposit"
        "bookedNoDeposit"
        "bookedWithFullSuperFunds"
      ]
    ) {
      ... on records_records_Entry {
        id
        recordFirstName
        recordLastName
        recordFollowUpDate
        recordFollowUpStatus
        recordPatient {
          ... on User {
            fullName
          }
        }
        recordClinic {
          ... on locations_locations_Entry {
            id
          }
        }
        recordFollowUpStaffMember {
          ... on User {
            id
            firstName
            fullName
          }
        }
        recordLeadStatus
        recordLeadStatusLabel: recordLeadStatus(label: true)
        url
      }
    }
  }
`

export const roleFollowUpsCountQuery = gql`
  query roleFollowUpsCountQuery(
    $recordFollowUpRole: [QueryArgument]
    $recordClinic: [QueryArgument]!
  ) {
    entryCount(
      section: "records"
      recordClinic: $recordClinic
      recordFollowUpStatus: "followUp"
      recordFollowUpRole: $recordFollowUpRole
      recordTreatmentStatus: [
        null
        "noAppointments"
        "bookedWithDeposit"
        "bookedNoDeposit"
        "bookedWithFullSuperFunds"
      ]
    )
  }
`
export const ViewerQuery = gql`
  query Viewer {
    viewer {
      id
      fullName
      ... on User {
        staffClinics {
          id
          slug
        }
      }
    }
  }
`
// query MedicalWarningsQuery($id: [QueryArgument]) {
//   matrixFormsEntries(recordPatient: $id) {
export const medicalWarningsQuery = gql`
  query MedicalWarningsQuery {
    matrixFormsEntries(type: "patientFormMedicalDentalHistory") {
      ... on matrixForms_patientFormMedicalDentalHistory_Entry {
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
`

// export const caseNoteQuery = gql`
//   query caseNoteQuery {
//     entries(id: 115718) {
//       ... on recordNotes_caseNote_Entry {
//         id
//         recordConversionLikelihood(label: true)
//         recordNoteDropboxUrl
//         recordNoteNote
//         recordTaggedUser {
//           fullName
//           id
//         }
//         recordNoteRecord {
//           id
//         }
//       }
//     }
//   }
// `

export const patientFormsIdQuery = gql`
  query patientFormsIdQuery {
    entries(section: "patientForms") {
      ... on patientForms_patientForms_Entry {
        id
        patientFormHandle
      }
    }
  }
`

export const formQueries = gql`
  query formQueries($recordId: [QueryArgument]!, $typeHandle: [String]) {
    entries(
      section: "matrixForms"
      patientFormRecord: $recordId
      type: $typeHandle
    ) {
      ... on matrixForms_patientFormGuaranteesUpgrades_Entry {
        id
        slug
        title
        typeHandle
        dateCreated
      }
      ... on matrixForms_patientFormImageConsent_Entry {
        id
        slug
        title
        typeHandle
        dateCreated
      }
      ... on matrixForms_patientFormSecuredFinanceDocumentation_Entry {
        id
        slug
        title
        typeHandle
        dateCreated
      }
      ... on matrixForms_patientFormFreeWaterpikOffer_Entry {
        id
        slug
        title
        typeHandle
        dateCreated
      }
      ... on matrixForms_patientFormConsentForm_Entry {
        id
        slug
        title
        typeHandle
        dateCreated
      }
      ... on matrixForms_patientFormPreAnaestheticInformation_Entry {
        id
        slug
        title
        typeHandle
        dateCreated
      }
      ... on matrixForms_patientFormAnaestheticConsentAuthority_Entry {
        id
        slug
        title
        typeHandle
        dateCreated
      }
      ... on matrixForms_patientFormMedicalDentalHistory_Entry {
        id
        slug
        title
        typeHandle
        dateCreated
      }
      ... on matrixForms_patientFormPatientDetails_Entry {
        id
        slug
        title
        typeHandle
        dateCreated
      }
      ... on matrixForms_patientFormExtractionConsentSupplement_Entry {
        id
        slug
        title
        typeHandle
        dateCreated
      }
      ... on matrixForms_patientFormGeneralCosmeticDentistryConsent_Entry {
        id
        slug
        title
        typeHandle
        dateCreated
      }
      ... on matrixForms_patientFormMedicalRecordsConsent_Entry {
        id
        slug
        title
        typeHandle
        dateCreated
      }
    }
  }
`

export const freeformAllPatientForms = gql`
  query freeformAllPatientForms($entryId: Int!) {
    patientFormPatientDetails(entryId: $entryId) {
      id
      dateCreated
    }
    patientFormMedicalDentalHistory(entryId: $entryId) {
      id
      dateCreated
    }
    patientFormPreAnaestheticInformation(entryId: $entryId) {
      id
      dateCreated
    }
    patientFormAnaestheticConsentAuthority(entryId: $entryId) {
      id
      dateCreated
    }
    patientFormConsentForm(entryId: $entryId) {
      id
      dateCreated
    }
    patientFormGuaranteesUpgrades(entryId: $entryId) {
      id
      dateCreated
    }
    patientFormSecuredFinanceDocumentation(entryId: $entryId) {
      id
      dateCreated
    }
    patientFormImageConsent(entryId: $entryId) {
      id
      dateCreated
    }
    patientFormFreeWaterPikOffer(entryId: $entryId) {
      id
      dateCreated
    }
  }
`
export const freeformOnlyMedicalConsentPatientForms = gql`
  query freeformOnlyMedicalConsentPatientForms($entryId: Int!) {
    patientFormPatientDetails(entryId: $entryId) {
      id
      dateCreated
    }
    patientFormMedicalDentalHistory(entryId: $entryId) {
      id
      dateCreated
    }
    patientFormPreAnaestheticInformation(entryId: $entryId) {
      id
      dateCreated
    }
    patientFormAnaestheticConsentAuthority(entryId: $entryId) {
      id
      dateCreated
    }
    patientFormConsentForm(entryId: $entryId) {
      id
      dateCreated
    }
    patientFormGuaranteesUpgrades(entryId: $entryId) {
      id
      dateCreated
    }
    patientFormImageConsent(entryId: $entryId) {
      id
      dateCreated
    }
  }
`

/* TIM QUEIRES */
export const mainViewerQuery = gql`
  query Viewer {
    viewer {
      ... on User {
        id
        fullName
        firstName
        lastName
        friendlyName
        userTitle
        groups
        email
        userPreferredName
        staffRecordTableOpenInNewTab
        staffRecordTickedCardStyle
        userMobilePhone
        photo {
          url @transform(handle: "x100x100")
        }
        userLocation {
          ... on locations_locations_Entry {
            title
            locationShortName
            locationOtherName
          }
        }
        staffPrimaryLocation {
          id
        }
        staffClinics {
          ... on locations_locations_Entry {
            title
            locationShortName
            locationOtherName
          }
        }
        anaesthetistMass {
          ... on mass_default_Entry {
            title
          }
        }
        technicianLaboratories {
          ... on laboratories_default_Entry {
            title
          }
        }
        patientFilledInitForm
        userSiteAgreementsChecked {
          id
        }
      }
    }
    privacyPolicy: entry(
      section: "siteAgreements"
      type: "privacyPolicy"
      orderBy: "dateCreated desc"
    ) {
      id
    }
    websiteTermsAndConditions: entry(
      section: "siteAgreements"
      type: "websiteTermsAndConditions"
      orderBy: "dateCreated desc"
    ) {
      id
    }
    sensitiveInformationPolicy: entry(
      section: "siteAgreements"
      type: "sensitiveInformationPolicy"
      orderBy: "dateCreated desc"
    ) {
      id
    }
    patientTermsAndConditions: entry(
      section: "siteAgreements"
      type: "patientTermsAndConditions"
      orderBy: "dateCreated desc"
    ) {
      id
    }
    staffTermsAndConditions: entry(
      section: "siteAgreements"
      type: "staffTermsAndConditions"
      orderBy: "dateCreated desc"
    ) {
      id
    }
  }
`

export const patientViewerQuery = gql`
  query Viewer {
    viewer {
      ... on User {
        id
        email
        fullName
        firstName
        lastName
        userTitle
        userPreferredName
        userHomePhone
        userMobilePhone
        userHomeAddress
        userCitySuburb
        userState
        userDateOfBirth @formatDateTime(format: "Y-m-d")
        userPostcode
      }
    }
  }
`
export const userIdByemailQuery = gql`
  query userIdByemailQuery($email: [String]) {
    user(email: $email) {
      id
    }
  }
`
/* Queries related to new lead use case */
//dateEnquired: ">"+$dateEnquired  , $dateEnquired: String!
export const newLeadCountQuery = gql`
  query newLeadCountQuery(
    $locationInfo: [QueryArgument]
    $dateEnquired: [QueryArgument]
  ) {
    entryCount(
      locationInfo: $locationInfo
      section: "newLeadInfo"
      leadStatus: "open"
      dateEnquired: $dateEnquired
    )
  }
`

//leadStatus: "open"
export const newLeadInfoQuery = gql`
  query newLeadInfoQuery(
    $locationInfo: [QueryArgument]
    $dateFilter: [QueryArgument]
  ) {
    entries(locationInfo: $locationInfo, dateEnquired: $dateFilter) {
      ... on newLeadInfo_default_Entry {
        id
        email
        firstName
        lastName
        leadStatus
        message
        leadQuality
        submissionId
        locationInfo
        contactNumber
        dateEnquired
        websiteEnquired
        submittedFormName
        referer
      }
    }
  }
`
export const locationIdquery = gql`
  query locationIdquery($locationShortName: [QueryArgument]) {
    entry(section: "locations", locationShortName: $locationShortName) {
      ... on locations_locations_Entry {
        id
      }
    }
  }
`

export const dmagToolQuery = gql`
  query patientsTableDataQuery(
    $recordClinic: [QueryArgument]
    $limit: Int = 10000
    $thirteenMonthPriorDate: [String]
    $treatmentProposalSurgicalFacility: [QueryArgument] = -1
  ) {
    entries(
      section: "records"
      recordClinic: $recordClinic
      limit: $limit
      orderBy: "dateUpdated DESC"
      dateUpdated: $thirteenMonthPriorDate
    ) {
      ... on records_records_Entry {
        id
        dateCreated
        recordFirstName
        recordPatient {
          ... on User {
            userHowDidYouFindUs
            fullName
            email
          }
        }
        recordServiceFeeInvoiceSentMas
        recordServiceFeeInvoiceSentSurgeons
        recordRequiresTheatreFee
        recordTheatreEndTime
        recordTheatreStartTime
        recordTreatmentAnaesthetist(
          status: ["active", "pending", "suspended"]
        ) {
          fullName
        }
        recordTreatmentSurgeons {
          fullName
          ... on User {
            id
            staffClinics {
              ... on locations_locations_Entry {
                id
              }
            }
          }
        }
        recordTreatmentRestorative {
          fullName
          ... on User {
            id
            staffClinics {
              ... on locations_locations_Entry {
                id
              }
            }
          }
        }
        recordClinic {
          ... on locations_locations_Entry {
            id
            locationShortName
            locationOtherName
          }
        }
        recordTreatmentProcedure {
          title
        }
        recordTreatmentStatus
        recordLastName
        recordTreatmentAnaesthetistsFee
        recordTreatmentDate
        recordLeadType
        recordAnaestheticProcedureTime
        recordMas {
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
      }
    }
    surgicalFacilityPatients: entries(
      section: "records"
      treatmentProposalSurgicalFacility: $treatmentProposalSurgicalFacility
      limit: $limit
      orderBy: "dateUpdated DESC"
      dateUpdated: $thirteenMonthPriorDate
    ) {
      ... on records_records_Entry {
        id
        dateCreated
        recordFirstName
        recordPatient {
          ... on User {
            userHowDidYouFindUs
            fullName
            email
          }
        }
        recordServiceFeeInvoiceSentMas
        recordServiceFeeInvoiceSentSurgeons
        recordRequiresTheatreFee
        recordTheatreEndTime
        recordTheatreStartTime
        recordTreatmentAnaesthetist(
          status: ["active", "pending", "suspended"]
        ) {
          fullName
        }
        recordTreatmentSurgeons {
          fullName
          ... on User {
            id
            staffClinics {
              ... on locations_locations_Entry {
                id
              }
            }
          }
        }
        recordTreatmentRestorative {
          fullName
          ... on User {
            id
            staffClinics {
              ... on locations_locations_Entry {
                id
              }
            }
          }
        }
        recordClinic {
          ... on locations_locations_Entry {
            id
            locationShortName
            locationOtherName
          }
        }
        recordTreatmentProcedure {
          title
        }
        recordTreatmentStatus
        recordLastName
        recordTreatmentAnaesthetistsFee
        recordTreatmentDate
        recordLeadType
        recordAnaestheticProcedureTime
        recordMas {
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
      }
    }
  }
`

export const surgicalFacilityPatients = gql`
  query patientsTableDataQuery(
    $treatmentProposalSurgicalFacility: [QueryArgument] = -1
    $limit: Int = 10000
    $thirteenMonthPriorDate: [String]
  ) {
    entries(
      section: "records"
      treatmentProposalSurgicalFacility: $treatmentProposalSurgicalFacility
      limit: $limit
      orderBy: "dateUpdated DESC"
      dateUpdated: $thirteenMonthPriorDate
    ) {
      ... on records_records_Entry {
        id
        dateCreated
        recordFirstName
        recordPatient {
          ... on User {
            userHowDidYouFindUs
            fullName
            email
          }
        }
        recordRequiresTheatreFee
        recordTheatreEndTime
        recordTheatreStartTime
        recordTreatmentAnaesthetist(
          status: ["active", "pending", "suspended"]
        ) {
          fullName
        }
        recordTreatmentSurgeons {
          fullName
          ... on User {
            id
            staffClinics {
              ... on locations_locations_Entry {
                id
              }
            }
          }
        }
        recordTreatmentRestorative {
          fullName
          ... on User {
            id
            staffClinics {
              ... on locations_locations_Entry {
                id
              }
            }
          }
        }
        recordClinic {
          ... on locations_locations_Entry {
            id
            locationShortName
            locationOtherName
          }
        }
        recordTreatmentProcedure {
          title
        }
        recordTreatmentStatus
        recordLastName
        recordTreatmentAnaesthetistsFee
        recordTreatmentDate
        recordLeadType
        recordAnaestheticProcedureTime
        recordMas {
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
      }
    }
  }
`

export const newLeadsInfoPatients = gql`
  query newLeadsInfoPatients(
    $recordClinic: [QueryArgument]!
    $limit: Int = 10000
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
        dateCreated
        recordEmail
        recordMobilePhone
        recordHomePhone
      }
    }
  }
`
