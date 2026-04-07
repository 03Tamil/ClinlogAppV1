import { gql } from "graphql-request"

export const newLeadMutation = gql`
  mutation MyMutation(
    $nominatedClinic: [Int]
    $email: String
    $firstName: String!
    $lastName: String
    $homePhone: String
    $mobilePhone: String
    $recordLeadType: String
    $enquiryType: String!
    $enquiryDate: DateTime
    $enabledOrNot: Boolean
    $leadQuality: String
  ) {
    save_records_records_Entry(
      recordClinic: $nominatedClinic
      recordEmail: $email
      recordFirstName: $firstName
      recordLastName: $lastName
      recordHomePhone: $homePhone
      recordMobilePhone: $mobilePhone
      recordLeadType: $recordLeadType
      recordEnquiryDate: $enquiryDate
      recordEnquiryType: $enquiryType
      enabled: $enabledOrNot
      recordLeadQuality: $leadQuality
    ) {
      id
      recordFirstName
      recordLastName
    }
  }
`

export const followUpMutation = gql`
  mutation MyMutation(
    $id: ID
    $recordFollowUpStatus: String
    $recordFollowUpRole: String
    $recordFollowUpStaffMember: [Int]
    $recordFollowUpDate: DateTime
    $recordTreatmentDate: DateTime
    $recordTreatmentWorkUpDate: DateTime
    $recordConsultationStatus: String
    $recordTreatmentStatus: String
    $recordConsultationDate: DateTime
    $recordConsultationTime: DateTime
    $recordEnquiryType: String
    $recordCaseCompletedDate: DateTime
    $recordCaseConsultedDate: DateTime
    $recordCaseBookedDate: DateTime
    $recordLeadStatus: String
  ) {
    save_records_records_Entry(
      id: $id
      recordFollowUpStatus: $recordFollowUpStatus
      recordLeadStatus: $recordLeadStatus
      recordFollowUpStaffMember: $recordFollowUpStaffMember
      recordFollowUpRole: $recordFollowUpRole
      recordFollowUpDate: $recordFollowUpDate
      recordTreatmentDate: $recordTreatmentDate
      recordTreatmentWorkUpDate: $recordTreatmentWorkUpDate
      recordConsultationStatus: $recordConsultationStatus
      recordTreatmentStatus: $recordTreatmentStatus
      recordConsultationDate: $recordConsultationDate
      recordConsultationTime: $recordConsultationTime
      recordEnquiryType: $recordEnquiryType
      recordCaseBookedDate: $recordCaseBookedDate
      recordCaseConsultedDate: $recordCaseConsultedDate
      recordCaseCompletedDate: $recordCaseCompletedDate
    ) {
      id
    }
  }
`
export const editReminderMutation = gql`
  mutation editReminder(
    $subject: String
    $message: String
    $id: ID
    $recordNotificationCompleted: Boolean
    $recordNotificationPinned: Boolean
    $recordNotificationReadBy: [Int]
    $senderId: [Int]
    $recordNotificationReminderOrder: Number
    $recordNotificationTaskList: [recordNotificationTaskList_TableRowInput]
  ) {
    save_recordNotifications_recordNotifications_Entry(
      recordNotificationMessage: $message
      recordNotificationSubject: $subject
      id: $id
      recordNotificationCompleted: $recordNotificationCompleted
      recordNotificationReminderOrder: $recordNotificationReminderOrder
      recordNotificationSender: $senderId
      recordNotificationPinned: $recordNotificationPinned
      recordNotificationReadBy: $recordNotificationReadBy
      recordNotificationTaskList: $recordNotificationTaskList
    ) {
      id
      recordNotificationMessage
      recordNotificationSubject
      recordNotificationPinned
      recordNotificationReminderOrder
      recordNotificationReadBy {
        id
      }
    }
  }
`

export const editAdminReminderMutation = gql`
  mutation editAdminReminderMutation(
    $subject: String
    $message: String
    $id: ID
    $recordNotificationReadBy: [Int]
  ) {
    save_recordNotifications_adminNotifications_Entry(
      recordNotificationMessage: $message
      recordNotificationSubject: $subject
      id: $id
      recordNotificationReadBy: $recordNotificationReadBy
    ) {
      id
      recordNotificationMessage
      recordNotificationSubject
      recordNotificationReadBy {
        id
      }
    }
  }
`

export const addReminderMutation = gql`
  mutation addReminderMutation(
    $subject: String
    $message: String
    $id: ID = null
    $status: Boolean = false
    $authorId: ID
    $recordNotificationSender: [Int]
    $recordNotificationReminderOrder: Number
    $recordNotificationRecord: [Int]
  ) {
    save_recordNotifications_recordNotifications_Entry(
      title: $subject
      recordNotificationMessage: $message
      recordNotificationSubject: $subject
      id: $id
      recordNotificationRecord: $recordNotificationRecord
      recordNotificationCompleted: $status
      recordNotificationType: "reminder"
      recordNotificationReminderOrder: $recordNotificationReminderOrder
      recordNotificationSender: $recordNotificationSender
      authorId: $authorId
    ) {
      id
      recordNotificationReminderOrder
    }
  }
`

export const deleteMutation = gql`
  mutation MyMutation($id: Int!) {
    deleteEntry(id: $id)
  }
`

export const addMessageMutation = gql`
  mutation addMessageMutation(
    $recordNotificationSubject: String
    $recordNotificationMessage: String
    $recordNotificationRecordUrl: String
    $recordNotificationRecordName: String
    $recordNotificationSender: [Int]
    $recordNotificationRecord: [Int]
    $recordNotificationRecipients: [Int]
  ) {
    save_recordNotifications_recordNotifications_Entry(
      title: $recordNotificationSubject
      recordNotificationRecipients: $recordNotificationRecipients
      recordNotificationMessage: $recordNotificationMessage
      recordNotificationSubject: $recordNotificationSubject
      recordNotificationRecord: $recordNotificationRecord
      recordNotificationType: "notifyCollaborator"
      recordNotificationSender: $recordNotificationSender
      recordNotificationRecordName: $recordNotificationRecordName
      recordNotificationRecordUrl: $recordNotificationRecordUrl
    ) {
      id
      recordNotificationReminderOrder
    }
  }
`

export const completeTableRecord = gql`
  mutation editReminder(
    $id: ID = null
    $authorId: ID
    $recordTreatmentStatus: String
    $recordCaseCompletedDate: DateTime
  ) {
    save_records_records_Entry(
      id: $id
      authorId: $authorId
      recordTreatmentStatus: $recordTreatmentStatus
      recordCaseCompletedDate: $recordCaseCompletedDate
    ) {
      id
    }
  }
`

export const registerMutation = gql`
  mutation Register {
    register(email: "test.com", password: "testing123", fullName: "test test") {
      jwt
      jwtExpiresAt
      refreshToken
      refreshTokenExpiresAt
      user {
        id
        fullName
        ... on User {
          customField
        }
      }
    }
  }
`

export const setPassword = gql`
  mutation SetPassword {
    setPassword(
      password: "testing1234"
      code: "aY6MHG5NhKvA5tzrxKXuAvOLKca3fjJQ"
      id: "b50acbd9-c905-477a-a3f5-d0972a5a4356"
    )
  }
`

/* Mutations  related to New Leads use case*/
export const changeLeadStatus = gql`
  mutation changeLeadStatus($id: ID, $submissionStatus: String, $authorId: ID) {
    save_newLeadInfo_default_Entry(
      id: $id
      leadStatus: $submissionStatus
      authorId: $authorId
    ) {
      id
    }
  }
`
export const changeLeadStatusCraft5 = gql`
  mutation changeLeadStatusCraft5($id: ID, $submissionStatus: String, $authorId: ID) {
    save_newLeadInfo_newLeadInfo_default_Entry(
      id: $id
      leadStatus: $submissionStatus
      authorId: $authorId
    ) {
      id
    }
  }
`
export const changeLeadLocation = gql`
  mutation changeLeadLocation($id: ID, $locationInfo: String, $authorId: ID) {
    save_newLeadInfo_default_Entry(
      id: $id
      locationInfo: $locationInfo
      authorId: $authorId
    ) {
      id
    }
  }
`
export const changeLeadLocationCraft5 = gql`
  mutation changeLeadLocationCraft5($id: ID, $locationInfo: String, $authorId: ID) {
    save_newLeadInfo_newLeadInfo_default_Entry(
      id: $id
      locationInfo: $locationInfo
      authorId: $authorId
    ) {
      id
    }
  }
`

export const theatreTimePatientMutaion = gql`
  mutation theatreTimePatientMutaion(
    $id: ID!
    $recordTheatreEndTime: DateTime
    $recordTheatreStartTime: DateTime
    $recordServiceFeeInvoiceSentMas: Boolean
    $recordServiceFeeInvoiceSentSurgeons: Boolean
    $recordRequiresTheatreFee: Boolean
    $recordFollowUpDate: DateTime
    $recordFollowUpStatus: String
  ) {
    save_records_records_Entry(
      id: $id
      recordTheatreStartTime: $recordTheatreStartTime
      recordTheatreEndTime: $recordTheatreEndTime
      recordServiceFeeInvoiceSentMas: $recordServiceFeeInvoiceSentMas
      recordServiceFeeInvoiceSentSurgeons: $recordServiceFeeInvoiceSentSurgeons
      recordRequiresTheatreFee: $recordRequiresTheatreFee
      recordFollowUpDate: $recordFollowUpDate
      recordFollowUpStatus: $recordFollowUpStatus
    ) {
      id
    }
  }
`
