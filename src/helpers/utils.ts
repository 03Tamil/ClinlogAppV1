import { differenceInHours, format } from "date-fns"
import { gql } from "graphql-request"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"

export const convertBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader()
    fileReader.readAsDataURL(file)
    fileReader.onload = () => {
      resolve(fileReader.result)
    }
    fileReader.onerror = (error) => {
      reject(error)
    }
  })
}

export const isObjectEmpty = (objectName) => {
  return (
    Object.keys(objectName).length === 0 && objectName.constructor === Object
  )
}
export const currentDate = format(new Date(), "yyyy-MM-dd")
export const pastOneDay = (dateValue) =>
  differenceInHours(new Date(), new Date(dateValue)) > 23

export const makePdf = (ref) => {
  const image = html2canvas(ref).then((canvas) => {
    let imgWidth = 208
    let imgHeight = (canvas.height * imgWidth) / canvas.width
    const imgData = canvas.toDataURL("img/png", 1.0)
    const pdf = new jsPDF("p", "mm", "a4")
    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight, undefined, "FAST")
    // pdf.output('dataurlnewwindow');
    pdf.save("download.pdf")
  })
}

export function messageSort(entries) {
  const sortedResults = entries?.sort((valA, valB) => {
    if (
      valA.recordNotificationPinned === true &&
      valB.recordNotificationPinned === false
    ) {
      return -1
    }
    if (
      valA.recordNotificationPinned === false &&
      valB.recordNotificationPinned === true
    ) {
      return 1
    }
    if (
      valA.recordNotificationPinned === true &&
      valB.recordNotificationPinned === true
    ) {
      return valA > valB ? -1 : valA < valB ? 1 : 0
    }
    return valA > valB ? -1 : valA < valB ? 1 : 0
  })
  return sortedResults
}

export const recordStringHandles = {
  followUp: "Follow Up",
  inactive: "Inactive",
  onHold: "On Hold",
  inTreatment: "In Treatment",
  followUpTlc: "Follow Up TLC",
  coldCase: "Cold Case",
  placedOnRecall: "Placed On Recall",
  externalUse: "External Use",
  attended: "Attended",
  completed: "Completed",
  booked: "Booked",
  bookedWithDeposit: "Booked",
  noShow: "No Show",
  noAppointments: "No Appointments",
  directContactOrReferral: "Direct Contact Or Referral",
  socialMediaInquiry: "Social Media Inquiry",
  webInquiry: "Web Inquiry",
  bookletDownload: "Booklet Download",
  webinarAttendee: "Webinar Attendee",
  webinarOnDemandAttendee: "Webinar On-Demand Attendee",
  webinarNoShow: "Webinar No Show",
  seminarAttendee: "Seminar Attendee",
  seminarNoShow: "Seminar No Show",
  inHouseSocialMediaMessage: "In-House Social Media Message",
  inHouseWebsiteContactForm: "In-House Website Contact Form",
  inHouseLead: "In-house/Existing Patient",
  leadFrom3rdParty: "Lead From 3rd Party",
  allOn4: "All-On-4",
  sleepDentistry: "Sleep Dentistry",
  cosmeticDentistry: "Cosmetic Dentistry",
  generalDentistry: "General Dentistry",
  facialAesthetics: "Facial Aesthetics",
  individualDentalImplants: "Individual Dental Implants",
  doctorDentistOrSpecialist: "Doctor, Dental, Specialist",
  recommendation: "Recommendation from Patient or Oraganization",
  advertisement: "From an Advertisement",
  internet: "Searching the Internet",
  socialMedia: "From Social Media",
  recordAnaesthetistStatus: "General Anaesthetic",
  recordFollowUpStatus: "Follow Up Status",
  recordLeadType: "Lead Type",
  recordEnquiryDate: "Enquiry Date",
  recordEnquiryType: "Enquiry Type",
  recordConsultationStatus: "Consultation Status",
  recordConsultationDate: "Consultation Date",
  recordTreatmentStatus: "Completed",
  recordEmail: "Email",
  recordTreatmentSurgeons: "Clinician",
  recordTreatmentProcedure: "Confirmed Treatment",
  recordTreatmentDate: "Treatment Date",
  recordFollowUpDate: "Follow Up Date",
  recordAccountRevenue: "Revenue",
  recordTreatmentAnaesthetist: "Anaesthetist",
  recordPatient: "Source of referal",
  allFollowUps: "All Follow Ups",
  myFollowUps: "My Follow Ups",
  unassigned: "Unassigned",
  treatmentAsap: "Treatment ASAP",
  treatmentWithin6Months: "Treatment within 6 months",
  tooExpensive: "Too Expensive",
  seekingSecondOpinion: "Seeking Second Opinion",
  wentElsewhere: "Went Elsewhere",
  treatmentNotSuitable: "Treatment not suitable",
  pendingSuper: "Pending Super",
  pendingFinance: "Pending finance",
  pleaseSelect: "Please select option",
  requestedCallBack: "Requested Call Back",
  lookingAtOtherTreatments: "Looking at other treatments",
  timeToThink: "Time to think",
  waitingOnResponse: "Waiting on Response",
  recordLeadStatus: "Lead Status",
  notResponding: "Not Responding",
  none: "none",
}

export function dirtyValues(
  dirtyFields: object | boolean,
  allValues: object
): object {
  // If *any* item in an array was modified, the entire array must be submitted, because there's no way to indicate
  // "placeholders" for unchanged elements. `dirtyFields` is `true` for leaves.
  if (dirtyFields === true || Array.isArray(dirtyFields)) return allValues
  // Here, we have an object
  return Object.fromEntries(
    Object.keys(dirtyFields).map((key) => [
      key,
      dirtyValues(dirtyFields[key], allValues[key]),
    ])
  )
}

export const exportAsImage = async (element, imageFileName) => {
  const canvas = await html2canvas(element)
  const image = canvas.toDataURL("image/png", 1.0)
  return image
}

export async function urlToBase64(url) {
  try {
    const response = await fetch(url)
    if (response.ok) {
      const blob = await response.blob()
      const reader = new FileReader()
      return new Promise((resolve, reject) => {
        reader.onload = () => resolve(reader.result)
        reader.onerror = reject
        reader.readAsDataURL(blob)
      })
    } else {
      return null
    }
  } catch (error) {
    return null
  }
}

export const addCommas = (num) =>
  num?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") || 0
export const removeCommas = (num) => {
  return Number(num?.toString().replaceAll(",", "") || 0)
}
export function removeCommasAndDollarSign(input) {
  return Number(input?.replace(/[$,]/g, ""))
}

export const removeNonNumeric = (num) =>
  num?.toString().replace(/[^0-9]/g, "") || 0

export const toFindDuplicates = (arry) =>
  arry.filter((item, index) => arry.indexOf(item) !== index)

export const locationShortNames = {
  186: ["Burwood East", "Head Office"],
  205: "Kew",
  212: "Ballarat",
  218: "Wonthaggi",
  193: "Brunswick",
  117730: "Mornington",
  117733: "Oakleigh",
  126179: "Brighton",
  59289: "Yarrawonga",
  127397: "Melton",
  215: "Double Bay",
  199: ["Ultimo", "Sydney"],
  202: ["Perth / Subiaco", "Perth", "Subiaco"],
  105479: "Bond Street Dental",
  2615: "Burwood",
  29452: "Townsville",
  196: ["Brisbane", "Fortitude Valley"],
  1783: "Gold Coast",
  7528: ["Westbury", "Launceston", "Tasmania"],
  1580: "Webinar",
  139420: "New Gisborne",
  195384: "Sunshine Coast",
  208: "Liverpool",
  313369: "Clayton",
  411176: "Mudgee",
  423709: "Kirrawee",
  436827: "Sunbury",
  486518: "Hobart",
  612430: "Mount Eliza",
  613091: "Hervey Bay",
  621595: "Newtown",
  1106909: "Maroochydore",
  1144867: "Ipswich",
  // 190: "Armadale",
}

export function roundNumberToFactorsOfTen(num) {
  // Round to 2 decimal places
  var roundedNum = Math.round(num * 100) / 100

  // Round off the decimal places to factors of 10
  roundedNum = Math.ceil(roundedNum * 10) / 10

  return roundedNum
}

export const patientSearchBarQuery = gql`
  query patientSearchBarQuery(
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
