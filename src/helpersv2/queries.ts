import { gql } from "graphql-request";

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
        recordFollowUpRequired
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
        recordFollowUpRequired
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
`;

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
        recordFollowUpRequired
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
`;
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
`;

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
`;

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
`;

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
`;

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
`;

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
`;

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
        recordFollowUpRequired
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
        recordFollowUpRequired
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
        recordFollowUpRequired
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
`;

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
        recordFollowUpRequired
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
        recordFollowUpRequired
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
        recordFollowUpRequired
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
        recordFollowUpRequired
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
`;

export const clinlogDetailsRequiredPatientsQuery = gql`
  query clinlogDetailsRequiredPatientsQuery($recordClinic: [QueryArgument]) {
    entries(
      section: "records"
      recordClinic: $recordClinic
      treatmentCharacteristicsCompleted: false
      enableClinlog: true
      limit: 5
    ) {
      ... on records_records_Entry {
        id
        recordFirstName
        recordLastName
      }
    }
  }
`;

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
        treatmentCharacteristicsCompleted
        id
        recordFirstName
        recordBmi
        recordTreatmentProcedure {
          title
        }
        recordFollowUpDate
        recordFollowUpRequired
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
        recordFollowUpRequired
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
        recordFollowUpRequired
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
        recordFollowUpRequired
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
`;

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
        recordFollowUpRequired
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
`;
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
        userMobilePhone
        email
        dentalProviderNumber
        prescriberProviderNumber
        qualificationDetails
        stripeAccountName
        stripeAccountId
        staffClinics {
          ... on locations_locations_Entry {
            id
            locationShortNameState
            locationOtherName
            locationShortName
            stripeAccountId
            stripeAccountName
            locationOtherNameShort
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
            locationOtherNameShort
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
            groups
            staffReceivesNotificationEmail
            staffReceivesCollaborationEmail
            email
            staffClinics {
              ... on locations_locations_Entry {
                locationShortNameState
                locationOtherName
                locationOtherNameShort
              }
            }
          }
        }
      }
    }
  }
`;

export const smallStaffClinicQueryForCollabs = gql`
  query smallStaffClinicQueryForCollabs {
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
        email
        groups
        staffReceivesNotificationEmail
        staffReceivesCollaborationEmail
        staffClinics {
          ... on locations_locations_Entry {
            id
            locationShortName
          }
        }
      }
    }
  }
`;

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
        dentalProviderNumber
        anaesthetistMass {
          ... on mass_default_Entry {
            id
            title
            masShortName
          }
        }
        technicianLaboratories {
          ... on laboratories_default_Entry {
            id
            title
            laboratoryShortName
          }
        }
        staffClinics {
          ... on locations_locations_Entry {
            id
            locationShortName
            locationShortNameState
            locationOtherName
            locationOtherNameShort
          }
        }
      }
    }
  }
`;
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
        recordFollowUpRequired
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
        recordFollowUpRequired
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
        recordFollowUpRequired
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
        recordFollowUpRequired
        url
        recordCaseConsultedDate
        recordCaseBookedDate
        recordCaseCompletedDate
        isRevision
      }
    }
  }
`;

export const flaggedPatientsQuery = gql`
  query flaggedPatientsQuery($userId: Int!, $recordClinic: [Int]) {
    entries: flaggedRecordPatientGlobal(
      recordClinic: $recordClinic
      userId: $userId
      orderBy: "dateUpdated DESC"
      limit: 20
    ) {
      ... on recordPatientGlobal_default_Entry {
        id
        recordFirstName
        recordLastName
        patientShortName
        status
        flaggedReason(userId: $userId)
        recordLeadStatus
        recordLeadStatusLabel: recordLeadStatus(label: true)
        recordEnquiryType
        recordEnquiryTypeLabel: recordEnquiryType(label: true)
        attachedRecordsEntry(orderBy: "dateUpdated ASC") {
          ... on records_records_Entry {
            id
            recordEnquiryType
            recordEnquiryTypeLabel: recordEnquiryType(label: true)
          }
        }
        recordClinic {
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
`;

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
`;
export const inboxMessagesQuery = gql`
  query inboxMessagesQuery($recordNotificationRecipients: [QueryArgument]) {
    inboxMessages: entries(
      recordNotificationRecipients: $recordNotificationRecipients
      limit: 50
      section: "recordNotifications"
      type: "recordNotifications"
      recordNotificationType: "not reminder"
      recordNotificationArchived: false
    ) {
      id
      typeHandle
      dateUpdated
      dateCreated
      ... on recordNotifications_recordNotifications_Entry {
        recordNotificationArchived
        recordNotificationCompleted
        recordNotificationMessage
        recordNotificationSubject
        recordNotificationPinned
        recordNotificationRecord {
          id
        }
        recordNotificationRecordName
        recordNotificationReadBy {
          id
        }
        recordNotificationSender {
          ... on User {
            id
            fullName
          }
        }
        recordNotificationRecipients {
          id
          fullName
        }
        recordNotificationType
      }
    }
  }
`;
export const combinedMessagesQueriesQuery = gql`
  query combinedMessagesQueriesQuery(
    $recordNotificationSender: [QueryArgument]
    $recordNotificationRecipients: [QueryArgument]
  ) {
    archivedMessages: entries(
      recordNotificationRecipients: $recordNotificationRecipients
      limit: 50
      section: "recordNotifications"
      type: "recordNotifications"
      recordNotificationType: "not reminder"
      recordNotificationArchived: true
    ) {
      id
      slug
      typeHandle
      dateUpdated
      dateCreated
      ... on recordNotifications_recordNotifications_Entry {
        recordNotificationArchived
        recordNotificationMessage
        recordNotificationSubject
        recordNotificationRecord {
          id
        }
        recordNotificationRecordName
        recordNotificationRecordUrl
        recordNotificationReadBy {
          id
        }
        recordNotificationSender {
          ... on User {
            id
            fullName
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
          ... on User {
            id
            fullName
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
          ... on User {
            id
            fullName
          }
        }
      }
    }
  }
`;
export const adminMessagesQuery = gql`
  query adminMessagesQuery(
    $recordNotificationRecipients: [QueryArgument]
    $primaryClinic: [QueryArgument]
  ) {
    adminMessages: entries(
      limit: 50
      dateCreated: ">= 2023-12-01"
      section: "recordNotifications"
      type: "adminNotifications"
    ) {
      id
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
          ... on User {
            id
            fullName
          }
        }
      }
    }
    patientTransfer: entries(
      limit: 50
      dateCreated: ">= 2023-12-01"
      section: "recordNotifications"
      type: "patientTransferNotifications"
      primaryClinic: $primaryClinic
    ) {
      id
      slug
      typeHandle
      dateUpdated
      dateCreated
      ... on recordNotifications_patientTransferNotifications_Entry {
        recordNotificationMessage
        recordNotificationSubject
        recordNotificationPinned
        recordNotificationReadBy {
          id
        }
        recordNotificationSender {
          ... on User {
            id
            fullName
          }
          patientFormGlobal {
            id
          }
          attachedConsentForm {
            ... on matrixForms_patientTransferForm_Entry {
              id
              formSubmissionStatus
              lastEditedBy {
                fullName
              }
            }
          }
        }
      }
    }
  }
`;
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
          ... on User {
            id
            fullName
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
`;

export const archivedMessagesQuery = gql`
  query archivedMessagesQuery($recordNotificationSender: [QueryArgument]) {
    archivedMessages: entries(
      recordNotificationSender: $recordNotificationSender
      limit: 50
      section: "recordNotifications"
      type: "recordNotifications"
      recordNotificationType: "not reminder"
      recordNotificationArchived: true
    ) {
      id
      slug
      typeHandle
      dateUpdated
      dateCreated
      ... on recordNotifications_recordNotifications_Entry {
        recordNotificationArchived
        recordNotificationMessage
        recordNotificationSubject
        recordNotificationRecord {
          id
        }
        recordNotificationRecordName
        recordNotificationRecordUrl
        recordNotificationReadBy {
          id
        }
        recordNotificationSender {
          ... on User {
            id
            fullName
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
`;

export const notificationHistoryQuery = gql`
  query notificationHistoryQuery(
    $recordNotificationRecord: [QueryArgument]
    $offset: Int
  ) {
    entries(
      section: "recordNotifications"
      offset: $offset
      type: "recordNotifications"
      recordNotificationType: "not reminder"
      recordNotificationRecord: $recordNotificationRecord
      limit: 3
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
`;
//gql queryargument for recordFollowUpStatus not inactive
export const myFollowUpsQueryV2 = gql`
  query myFollowUpsQueryV2(
    $recordFollowUpStaffMember: [QueryArgument]
    $recordClinic: [QueryArgument]!
    $userId: [QueryArgument]
  ) {
    entries(
      section: "recordPatientGlobal"
      recordClinic: $recordClinic
      relatedToEntries: [
        {
          section: "records"
          recordFollowUpStatus: "followUp"
          recordFollowUpStaffMember: $recordFollowUpStaffMember
          orderBy: "recordFollowUpDate ASC"
        }
      ]
    ) {
      ... on recordPatientGlobal_default_Entry {
        id
        recordFirstName
        recordLastName

        recordEnquiryType
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
        attachedRecordsEntry(
          recordFollowUpStatus: "followUp"
          recordFollowUpStaffMember: $recordFollowUpStaffMember
        ) {
          ... on records_records_Entry {
            recordFollowUpDate
            recordFollowUpRequired
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
    }
    formsCollaborators: entries(
      section: "recordPatientGlobal"
      recordClinic: $recordClinic
      relatedToEntries: [
        {
          section: "records"
          recordFollowUpStatus: "followUp"
          recordFollowUpStaffMember: $recordFollowUpStaffMember
          recordFormsCollaborators: $userId
          orderBy: "recordFollowUpDate ASC"
        }
      ]
    ) {
      ... on recordPatientGlobal_default_Entry {
        id
        recordFirstName
        recordLastName
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
        attachedRecordsEntry(
          recordFollowUpStatus: "followUp"
          recordFollowUpStaffMember: $recordFollowUpStaffMember
          recordFormsCollaborators: $userId
          orderBy: "recordFollowUpDate ASC"
        ) {
          ... on records_records_Entry {
            recordFollowUpDate
            recordFollowUpRequired
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
    }
  }
`;
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
        recordFollowUpRequired
        recordFollowUpStatus
        recordFollowUpStatusLabel: recordFollowUpStatus(label: true)
        recordEnquiryType
        recordEnquiryTypeLabel: recordEnquiryType(label: true)
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
        recordFollowUpRequired
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
`;

export const roleFollowUpsQuery = gql`
  query roleFollowUpsQuery(
    $recordFollowUpRole: [QueryArgument]
    $recordClinic: [QueryArgument]!
    $limit: Int
  ) {
    entries(
      section: "records"
      recordClinic: $recordClinic
      recordFollowUpStatus: "followUp"
      recordFollowUpRole: $recordFollowUpRole
      orderBy: "recordFollowUpDate ASC"
      limit: $limit
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
        recordFollowUpRequired
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
        recordEnquiryType
        recordEnquiryTypeLabel: recordEnquiryType(label: true)
        url
      }
    }
  }
`;
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
`;
// query MedicalWarningsQuery($id: [QueryArgument]) {
//   matrixFormsEntries(recordPatient: $id) {
export const medicalWarningsQuery = gql`
  query MedicalWarningsQuery(patientFormGlobal: [QueryArgument]) {
    matrixFormsEntries(
    type: "patientFormMedicalDentalHistory"
    patientFormGlobal: $patientFormGlobal) {
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
`;

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
`;
export const formQueriesGlobal = gql`
  query formQueries($postId: [QueryArgument]!, $typeHandle: [String]) {
    entries(
      section: "matrixForms"
      patientFormGlobal: $postId
      type: $typeHandle
      manualUpload: false
    ) {
      ... on matrixForms_patientFormMedicalDentalHistory_Entry {
        id
        slug
        title
        typeHandle
        dateCreated
        formSubmissionStatus
        patientFormGlobal {
          id
        }
        formModificationDate
        lastEditedBy {
          ... on User {
            id
            fullName
          }
        }
        patientFormRecord {
          id
        }
        author {
          id
          fullName
        }
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
            dentureHistoryCheck
            dentureHistory
            oralFunctionStatements
            appearanceOptions
            teethOptions
            scale
            presentingComplaint
            signatureName
          }
        }
      }
      ... on matrixForms_patientFormPatientDetails_Entry {
        id
        slug
        title
        typeHandle
        dateCreated
        patientFormGlobal {
          id
        }
        formSubmissionStatus
        formSubmissionStatusLabel: formSubmissionStatus(label: true)
        patientFormRecord {
          id
        }
        author {
          id
        }
        lastEditedBy {
          ... on User {
            id
            fullName
          }
        }
        formModificationDate
        patientFormPatientDetails {
          ... on patientFormPatientDetails_formfields_BlockType {
            formUserId {
              id
            }
            email
            honorificTitle
            firstName
            lastName
            address
            city
            state
            homePhone
            dateOfBirth
            postcode
            occupation
            businessFirmEmployer
            driversLicenceNo
            workPhoneNo
            nextOfKinEmergencyContact
            nextOfKinPhoneNo
            medicalPractitioner
            phoneNumber
          }
        }
      }
    }
  }
`;
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
        dateUpdated
        formSubmissionStatus
        formSubmissionStatusLabel: formSubmissionStatus(label: true)
        lastEditedBy {
          ... on User {
            id
            fullName
          }
        }
      }
      ... on matrixForms_patientFormImageConsent_Entry {
        id
        slug
        title
        typeHandle
        dateCreated
        dateUpdated
        formSubmissionStatus
        formSubmissionStatusLabel: formSubmissionStatus(label: true)
        lastEditedBy {
          ... on User {
            id
            fullName
          }
        }
      }
      ... on matrixForms_patientFormSecuredFinanceDocumentation_Entry {
        id
        slug
        title
        typeHandle
        dateCreated
        dateUpdated
        formSubmissionStatus
        formSubmissionStatusLabel: formSubmissionStatus(label: true)
        lastEditedBy {
          ... on User {
            id
            fullName
          }
        }
      }
      ... on matrixForms_patientFormFreeWaterpikOffer_Entry {
        id
        slug
        title
        typeHandle
        dateCreated
        dateUpdated
        formSubmissionStatus
        formSubmissionStatusLabel: formSubmissionStatus(label: true)
        lastEditedBy {
          ... on User {
            id
            fullName
          }
        }
      }
      ... on matrixForms_patientFormConsentForm_Entry {
        id
        slug
        title
        typeHandle
        dateCreated
        dateUpdated
        formSubmissionStatus
        formSubmissionStatusLabel: formSubmissionStatus(label: true)
        lastEditedBy {
          ... on User {
            id
            fullName
          }
        }
      }
      ... on matrixForms_patientFormPreAnaestheticInformation_Entry {
        id
        slug
        title
        typeHandle
        dateCreated
        dateUpdated
        formSubmissionStatus
        formSubmissionStatusLabel: formSubmissionStatus(label: true)
        lastEditedBy {
          ... on User {
            id
            fullName
          }
        }
      }
      ... on matrixForms_patientFormAnaestheticConsentAuthority_Entry {
        id
        slug
        title
        typeHandle
        dateCreated
        dateUpdated
        formSubmissionStatus
        formSubmissionStatusLabel: formSubmissionStatus(label: true)
        lastEditedBy {
          ... on User {
            id
            fullName
          }
        }
      }
      ... on matrixForms_patientFormMedicalDentalHistory_Entry {
        id
        slug
        title
        typeHandle
        dateCreated
        dateUpdated
        formSubmissionStatus
        formSubmissionStatusLabel: formSubmissionStatus(label: true)
        lastEditedBy {
          ... on User {
            id
            fullName
          }
        }
      }
      ... on matrixForms_patientFormPatientDetails_Entry {
        id
        slug
        title
        typeHandle
        dateCreated
        dateUpdated
        formSubmissionStatus
        formSubmissionStatusLabel: formSubmissionStatus(label: true)
        formModificationDate
        lastEditedBy {
          ... on User {
            id
            fullName
          }
        }
      }
      ... on matrixForms_patientFormExtractionConsentSupplement_Entry {
        id
        slug
        title
        typeHandle
        dateCreated
        dateUpdated
        formSubmissionStatus
        formSubmissionStatusLabel: formSubmissionStatus(label: true)
        lastEditedBy {
          ... on User {
            id
            fullName
          }
        }
      }
      ... on matrixForms_patientFormGeneralCosmeticDentistryConsent_Entry {
        id
        slug
        title
        typeHandle
        dateCreated
        dateUpdated
        formSubmissionStatus
        formSubmissionStatusLabel: formSubmissionStatus(label: true)
        lastEditedBy {
          ... on User {
            id
            fullName
          }
        }
      }
      ... on matrixForms_patientSurveyForm_Entry {
        id
        slug
        title
        typeHandle
        dateCreated
        dateUpdated
        formSubmissionStatus
        formSubmissionStatusLabel: formSubmissionStatus(label: true)
        lastEditedBy {
          ... on User {
            id
            fullName
          }
        }
      }
    }
  }
`;

export const freeformAllPatientForms = gql`
  query freeformAllPatientForms($entryId: Int!, $globalId: Int!) {
    patientFormPatientDetails(entryId: $entryId, globalId: $globalId) {
      id
      dateCreated
    }
    patientFormMedicalDentalHistory(entryId: $entryId, globalId: $globalId) {
      id
      dateCreated
    }
    patientFormPreAnaestheticInformation(
      entryId: $entryId
      globalId: $globalId
    ) {
      id
      dateCreated
    }
    patientFormAnaestheticConsentAuthority(
      entryId: $entryId
      globalId: $globalId
    ) {
      id
      dateCreated
    }
    patientFormConsentForm(entryId: $entryId, globalId: $globalId) {
      id
      dateCreated
    }
    patientFormGuaranteesUpgrades(entryId: $entryId, globalId: $globalId) {
      id
      dateCreated
    }
    patientFormSecuredFinanceDocumentation(
      entryId: $entryId
      globalId: $globalId
    ) {
      id
      dateCreated
    }
    patientFormImageConsent(entryId: $entryId, globalId: $globalId) {
      id
      dateCreated
    }
    patientFormFreeWaterPikOffer(entryId: $entryId, globalId: $globalId) {
      id
      dateCreated
    }
  }
`;
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
`;

/* TIM QUEIRES */
export const mainViewerQuery = gql`
  query Viewer {
    viewer {
      ... on User {
        id
        friendlyName
        staffRecordTableOpenInNewTab
        staffRecordTickedCardStyle
        photo {
          url @transform(handle: "x100x100")
        }
        userLocation {
          ... on locations_locations_Entry {
            locationOtherName
          }
        }
        staffPrimaryLocation {
          id
        }
        staffClinics {
          ... on locations_locations_Entry {
            locationOtherName
          }
        }
        isClinlogOverseer
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
`;

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
`;
export const userIdByemailQuery = gql`
  query userIdByemailQuery($email: [String]) {
    user(email: $email) {
      id
    }
  }
`;
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
`;

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
`;
export const locationIdquery = gql`
  query locationIdquery($locationShortName: [QueryArgument]) {
    entry(section: "locations", locationShortName: $locationShortName) {
      ... on locations_locations_Entry {
        id
      }
    }
  }
`;

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
`;

export const surgicalFacilityPatients = gql`
  query patientsTableDataQuery(
    $treatmentProposalSurgicalFacility: [QueryArgument] = -1
    $limit: Int = 10000
    $thirteenMonthPriorDate: [String]
  ) {
    zx
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
`;

export const patientTableQueryInfinite = gql`
  query patientTableQueryInfinite(
    $recordClinic: [QueryArgument]!
    $limit: Int = 10000
    $offset: Int
    $attachedRecordsEntry: [QueryArgument]
  ) {
    entries(
      section: "recordPatientGlobal"
      recordClinic: $recordClinic
      limit: $limit
      orderBy: "recordEnquiryDate DESC"
      offset: $offset
      attachedRecordsEntry: $attachedRecordsEntry
    ) {
      ... on recordPatientGlobal_default_Entry {
        attachedRecordsEntry {
          ... on records_records_Entry {
            id
            attachedAppointments(limit: 2) {
              ... on caseAppointments_default_Entry {
                id
                appointmentType
                recordConsultationStatus
                recordConsultationDate
                appointmentDoctors {
                  ... on User {
                    id
                    fullName
                  }
                }
              }
            }
          }
        }
        id
        recordFirstName
        recordLastName
        recordEmail
        recordMobilePhone
        recordFollowUpDate
        recordClinic {
          ... on locations_locations_Entry {
            locationShortName
          }
        }
      }
    }
  }
`;
////
export const masTableDataQueryV2 = gql`
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
      }
    }
  }
`;
////
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
      orderBy: "dateCreated DESC"
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
        recordTreatmentStatus
        recordConsultationStatus
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
`;

export const caseAppointmentsQuery = gql`
  query caseAppointmentsQuery(
    $attachedRecordsEntry: [QueryArgument]
    $patientFormGlobal: [QueryArgument]
  ) {
    entries(
      section: "caseAppointments"
      attachedRecordsEntry: $attachedRecordsEntry
      patientFormGlobal: $patientFormGlobal
    ) {
      ... on caseAppointments_default_Entry {
        id
        title
        dateCreated
        author {
          id
          fullName
        }
        recordConsultationDate
        recordConsultationTime
        recordConsultationStatus
        recordConsultationStatusLabel: recordConsultationStatus(label: true)
        recordLeadStatus
        recordLeadStatusLabel: recordLeadStatus(label: true)
        appointmentType
        appointmentTypeLabel: appointmentType(label: true)
        appointmentMinutes
        recordAdditionalNotes
        patientFormGlobal {
          ... on patientFormGlobal_default_Entry {
            id
            recordFirstName
            recordLastName
          }
        }
        appointmentDoctors {
          ... on User {
            id
            fullName
          }
        }
      }
    }
  }
`;

export const clinlogNotesQuery = gql`
  query clinlogNotesQuery {
    recordNotes: entries(
      section: "recordNotes"
      type: "clinlogNotes"
      orderBy: "dateCreated DESC"
    ) {
      title
      ... on recordNotes_clinlogNotes_Entry {
        recordNoteNote
        recordNoteRecord {
          id
          title
        }
        postDate
        author {
          id
          fullName
        }
        attachedSurveyForm {
          ... on matrixForms_patientSurveyForm_Entry {
            id
            patientSurveyMatrix {
              ... on patientSurveyMatrix_patientSurvey_BlockType {
                id
                surveyDate
                timeFromSurgery
                patientSatisfactionAesthetic
                patientSatisfactionFunction
                patientSatisfactionTreatment
                patientSatisfactionMaintenance
                postOpPain
                smoking
              }
            }
          }
        }
      }
    }
  }
`;

export const clinlogDataQuery = gql`
  query clinlogDataQuery($id: [QueryArgument], $limit: Int, $offset: Int) {
    entries(
      section: "records"
      enableClinlog: true
      caseNumber: ["not", ""]
      # orderBy: "recordTreatmentDate desc"
      orderBy: "caseNumber desc"
      id: $id
      limit: $limit
      offset: $offset
    ) {
      ... on records_records_Entry {
        id
        recordFirstName
        recordLastName
        recordClinic {
          ... on locations_locations_Entry {
            id
            locationShortName
            locationOtherName
          }
        }
        caseNumber
        recordTreatmentDate
        attachedAppointments {
          ... on caseAppointments_default_Entry {
            id
            appointmentType
            recordConsultationDate
          }
        }
        dateCreated
        dateUpdated
        sex
        recordDateOfBirth
        ageAtTimeOfSurgery
        archType
        alcohol
        bruxism
        dateOfInsertion
        diabetesAndOsteoporosis
        diagnosisOrAetiology
        edentulous
        enableClinlog
        immediateAesthetics
        immediateFunctionSpeech
        immediateRestoration
        lowerArchCondition
        oestrogen
        oralHygiene
        recordEnquiryType
        recordEnquiryTypeLabel: recordEnquiryType(label: true)
        treatmentTitle
        treatmentPlannedBy
        upperArchCondition
        zygomaImplants
        regularImplants
        isImageIdentifiable
        preOpPhotos
        preOpReconstructedOpg
        postOpPhotos
        postOp2DOpg
        postOp3DOpg
        # preOpImaging
        # postOpImaging
        recordTreatmentRestorative {
          id
          firstName
          lastName
        }
        recordTreatmentSurgeons {
          id
          fullName
        }
        smoking
        recordFollowUpMatrix {
          ... on recordFollowUpMatrix_followUp_BlockType {
            id
            dateOfFollowUp
            examiner
            examinerRadiographic
            hygieneAtFollowUp
            numberOfRestorativeBreakages
            numberOfReviews
            performanceOverFollowUpPeriod
            timeFromSurgery
            zirconiaUpgrade
            smokingAtFollowUp
          }
        }
        attachedDentalCharts(chartStatus: ["approved", "modified"]) {
          ... on dentalChartRecords_proposedTreatmentChart_Entry {
            id
            chartStatus
            defaultDentist {
              id
              fullName
            }
            recordTreatmentDate
            proposedTreatmentToothMatrix {
              ... on proposedTreatmentToothMatrix_toothDetails_BlockType {
                id
                toothValue
                treatmentItemNumber
                attachedSiteSpecificRecords {
                  ... on treatmentItemSpecificationRecord_itemSpecificationAndDetails_Entry {
                    id
                    attachedSiteSpecificFollowUp {
                      ... on siteSpecificFollowUp_default_Entry {
                        id
                        recordFollowUpDate
                        implantFunctionAtFollowUp
                        abutmentFunctionAtFollowUp
                        sinusitis
                        facialSwelling
                        inflammation
                        pain
                        suppuration
                        recession
                        midShaftSoftTissueDehiscence
                        firstAbutmentLevelComplication
                        otherAbutmentLevelComplications
                        totalNumberOfAbutmentLevelComplications
                        dateOfFirstAbutmentLevelComplication
                        firstAbutmentLevelComplicationTimeFromSurgery
                        postOperativeSinusDisease
                        boneLoss
                      }
                    }
                    itemSpecificationMatrix {
                      ... on itemSpecificationMatrix_itemSpecs_BlockType {
                        id
                        implantBrand
                        implantCategory
                        implantCategoryLabel: implantCategory(label: true)
                        implantLine
                        implantType
                        implantBaseAndDiameter
                        surface
                        implantLength
                        angleCorrectionAbutment
                        placement
                        placementLabel: placement(label: true)
                        trabecularBoneDensity
                        boneVascularity
                        graftingApplied
                        graftMaterial
                        intraOperativeSinusComplications
                        crestalRest
                        insertionTorque
                        relevantBoneWidth
                        preOperativeSinusDisease
                        preOperativeSinusDiseaseManagement
                        conformanceWithTreatmentPlan
                        prf
                      }
                    }
                    abutmentDetailsMatrix {
                      ... on abutmentDetailsMatrix_abutment_BlockType {
                        id
                        abutmentCategory
                        abutmentCategoryLabel: abutmentCategory(label: true)
                        abutmentBrand
                        gingivalHeight
                        typeAndDiameter
                        abutmentHeight
                        angleCorrectionAbutment
                        abutmentLength
                        abutmentSerialSequenceBarCode
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
  }
`;

export const globalIdsQuery = gql`
  query globalIdsQuery($recordClinic: [QueryArgument]) {
    entries(
      section: "recordPatientGlobal"
      relatedToEntries: { enableClinlog: true }
      recordClinic: $recordClinic
    ) {
      ... on recordPatientGlobal_default_Entry {
        id
        patientShortName
        globalIsFlagged
        recordPatient {
          id
          fullName
        }
        attachedRecordsEntry(enableClinlog: true) {
          ... on records_records_Entry {
            id
            enableClinlog
          }
        }
        recordClinic {
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

export const allClinicsQuery = gql`
  query adminAllClinicsQuery {
    clinics: entries(
      section: "locations"
      type: "locations"
      limit: 1000
      #locationClinicType: "allOn4PlusPremiumProvider"
      enableGlobalStudy: true
    ) {
      ... on locations_locations_Entry {
        id
        title
        locationShortName
      }
    }
  }
`;
