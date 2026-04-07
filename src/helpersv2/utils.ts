import { border } from "@chakra-ui/react";
import { add, differenceInHours, format } from "date-fns";
import { is } from "date-fns/locale";
import html2canvas from "html2canvas";
import { isRadialGradient } from "html2canvas/dist/types/css/types/image";
import jsPDF from "jspdf";
import { group } from "node:console";

export const convertBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      resolve(fileReader.result);
    };
    fileReader.onerror = (error) => {
      reject(error);
    };
  });
};

export const isObjectEmpty = (objectName) => {
  return (
    Object.keys(objectName).length === 0 && objectName.constructor === Object
  );
};
export const currentDate = format(new Date(), "yyyy-MM-dd");
export const pastOneDay = (dateValue) =>
  differenceInHours(new Date(), new Date(dateValue)) > 23;

export const makePdf = (ref) => {
  const image = html2canvas(ref).then((canvas) => {
    let imgWidth = 208;
    let imgHeight = (canvas.height * imgWidth) / canvas.width;
    const imgData = canvas.toDataURL("img/png", 1.0);
    const pdf = new jsPDF("p", "mm", "a4");
    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight, undefined, "FAST");
    // pdf.output('dataurlnewwindow');
    pdf.save("download.pdf");
  });
};

export function messageSort(entries) {
  const sortedResults = entries?.sort((valA, valB) => {
    if (
      valA.recordNotificationPinned === true &&
      valB.recordNotificationPinned === false
    ) {
      return -1;
    }
    if (
      valA.recordNotificationPinned === false &&
      valB.recordNotificationPinned === true
    ) {
      return 1;
    }
    if (
      valA.recordNotificationPinned === true &&
      valB.recordNotificationPinned === true
    ) {
      return valA > valB ? -1 : valA < valB ? 1 : 0;
    }
    return valA > valB ? -1 : valA < valB ? 1 : 0;
  });
  return sortedResults;
}

export function parseYYMMDD(s, type = "yyyy-MM-dd") {
  if (!/^\d{6}$/.test(s)) return null;
  const yy = Number(s.slice(0, 2));
  const mm = Number(s.slice(2, 4));
  const dd = Number(s.slice(4, 6));

  // Two-digit year pivot: 00–69 → 2000–2069, 70–99 → 1970–1999
  const year = yy + (yy <= 69 ? 2000 : 1900);
  const monthIndex = mm - 1;

  const d = new Date(year, monthIndex, dd);
  // Guard against invalid dates (e.g., 310299)
  if (
    d.getFullYear() !== year ||
    d.getMonth() !== monthIndex ||
    d.getDate() !== dd
  )
    return null;
  return format(d, type);
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
};

export function dirtyValues(
  dirtyFields: object | boolean,
  allValues: object,
): object {
  // If *any* item in an array was modified, the entire array must be submitted, because there's no way to indicate
  // "placeholders" for unchanged elements. `dirtyFields` is `true` for leaves.
  if (dirtyFields === true || Array.isArray(dirtyFields)) return allValues;
  // Here, we have an object
  return Object.fromEntries(
    Object.keys(dirtyFields).map((key) => [
      key,
      dirtyValues(dirtyFields[key], allValues[key]),
    ]),
  );
}

export const exportAsImage = async (element, imageFileName) => {
  const canvas = await html2canvas(element);
  const image = canvas.toDataURL("image/png", 1.0);
  return image;
};

export async function urlToBase64(url) {
  try {
    const response = await fetch(url);
    if (response.ok) {
      const blob = await response.blob();
      const reader = new FileReader();
      return new Promise((resolve, reject) => {
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
}

export const addCommas = (num) =>
  num?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") || 0;
export const removeCommas = (num) => {
  return Number(num?.toString().replaceAll(",", "") || 0);
};
export const removeNonNumeric = (num) =>
  num?.toString().replace(/[^0-9]/g, "") || 0;

export const toFindDuplicates = (arry) =>
  arry.filter((item, index) => arry.indexOf(item) !== index);

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
  1106909: "Maroochydore",
  1144867: "Ipswich",
  // 190: "Armadale",
};
export const cancellationReasonOptions = [
  { value: "requestedCallBack", label: "Requested Call Back" },
  {
    value: "lookingAtOtherTreatments",
    label: "Looking at other treatments",
  },
  { value: "waitingOnResponse", label: "Waiting on response" },
  { value: "notResponding", label: "Not Responding" },
  { value: "tooExpensive", label: "Too Expensive" },
  { value: "seekingSecondOpinion", label: "Seeking Second Opinion" },
  { value: "wentElsewhere", label: "Went Elsewhere" },
  { value: "treatmentNotSuitable", label: "Treatment not suitable" },
  { value: "other", label: "Other" },
];
export const enquiryTypeOptions = [
  {
    value: "allOn4",
    label: "All On 4 Plus®",
  },
  {
    value: "sleepDentistry",
    label: "Sleep Dentistry",
  },
  {
    value: "cosmeticDentistry",
    label: "Cosmetic Dentistry",
  },
  {
    value: "generalDentistry",
    label: "General Dentistry & Cosmetic",
  },
  {
    value: "facialAesthetics",
    label: "Facial Aesthetics",
  },
  {
    value: "individualDentalImplants",
    label: "Individual Dental Implants",
  },
];
export const enquiryTypeOptionsColor = [
  {
    value: "allOn4",
    label: "All On 4 Plus®",
    color: "#BADAFF",
    borderColor: "#0077FF",
  },
  {
    value: "sleepDentistry",
    label: "Sleep Dentistry",
    color: "#E6DEFC",
    borderColor: "#A686FF",
  },
  {
    value: "cosmeticDentistry",
    label: "Cosmetic Dentistry",
    color: "#ECD1CE",
    borderColor: "#FE9A8F",
  },
  {
    value: "generalDentistry",
    label: "General Dentistry",
    color: "#C2FFD9",
    borderColor: "#3DFF84",
  },
  {
    value: "facialAesthetics",
    label: "Facial Aesthetics",
    color: "#FEC1C1",
    borderColor: "#FF4747",
  },
  {
    value: "individualDentalImplants",
    label: "Individual Dental Implants",
    color: "#EDDAFF",
    borderColor: "#9220FF",
  },
  {
    value: "blockTime",
    label: "Block Time",
    color: "#CED2D5",
    borderColor: "#A5ABB2",
  },
];
export const appointmentTypeOptions = {
  allOn4: [
    { label: "All On 4 Plus® Consultation", value: "allOn4Consultation" },
    { label: "Work Up", value: "preliminaryWorkUp" },
    { label: "All On 4 Plus® Treatment", value: "allOn4Treatment" },
    { label: "Insertion", value: "insertion" },
    { label: "Treatment Follow Up", value: "followUp" },
    { label: "Review", value: "review" },
  ],
  sleepDentistry: [
    {
      label: "Sleep Dentistry Consultation",
      value: "sleepDentistryConsultation",
    },
    { label: "Work Up", value: "preliminaryWorkUp" },
    {
      label: "Sleep Dentistry Treatment",
      value: "sleepDentistryTreatment",
    },
    { label: "Treatment Follow Up", value: "followUp" },
  ],
  cosmeticDentistry: [
    {
      label: "Cosmetic Dentistry Consultation",
      value: "cosmeticConsultation",
    },
    {
      label: "Cosmetic Dentistry Treatment",
      value: "cosmeticTreatment",
    },
    { label: "Veneers", value: "veneers" },
    { label: "Invisalign", value: "invisalign" },
    { label: "Porcelain Veneers", value: "porcelainVeneers" },
    { label: "Treatment Follow Up", value: "followUp" },
  ],
  generalDentistry: [
    {
      label: "General Dentistry Consultation",
      value: "generalDentistryConsultation",
    },
    {
      label: "General Dentistry Treatment",
      value: "generalDentistryTreatment",
    },
    { label: "Exam and/or Clean", value: "examAndOrClean" },
    { label: "Root Canal", value: "rootCanal" },
    { label: "Extraction", value: "extraction" },
    { label: "Hygiene Appointment", value: "hygieneAppointment" },
    { label: "Treatment Follow Up", value: "followUp" },
  ],
  facialAesthetics: [
    {
      label: "Facial Aesthetics Consultation",
      value: "facialAestheticsConsultation",
    },
    {
      label: "Facial Aesthetics Treatment",
      value: "facialAestheticsTreatment",
    },
    { label: "Treatment Follow Up", value: "followUp" },
  ],

  blockTime: [
    { label: "Lunch", value: "lunch" },
    { label: "Staff Meeting", value: "staffMeeting" },
    { label: "Not In", value: "notIn" },
    { label: "Holiday", value: "holiday" },
    { label: "Personal Leave", value: "personalLeave" },
  ],
};
export const appointmentTypeOptions2 = [
  {
    label: "Adjustment",
    value: "adjustment",
  },
  {
    label: "All On 4 Consultation",
    value: "allOn4Consultation",
  },
  {
    label: "All On 4 Treatment",
    value: "allOn4Treatment",
  },
  {
    label: "Broken Prosthesis",
    value: "brokenProsthesis",
  },
  {
    label: "Broken Tooth",
    value: "brokenTooth",
  },
  {
    label: "Cbct Scan",
    value: "cbctScan",
  },
  {
    label: "Clean",
    value: "clean",
  },
  {
    label: "Cosmetic Consultation",
    value: "cosmeticConsultation",
  },
  {
    label: "Crown Prep",
    value: "crownPrep",
  },
  {
    label: "Endodontics",
    value: "endodontics",
  },
  {
    label: "Exam",
    value: "exam",
  },
  {
    label: "Exam and Clean",
    value: "examAndClean",
  },
  {
    label: "Extraction",
    value: "extraction",
  },
  {
    label: "Facial Aesthetics And Tmd Assessment",
    value: "facialAestheticsAndTmdAssessment",
  },
  {
    label: "Filling",
    value: "filling",
  },
  {
    label: "Ga - All-on-4 Surgery",
    value: "gaAllOn4Surgery",
  },
  {
    label: "Ga - General",
    value: "gaGeneral",
  },
  {
    label: "General Dentistry Treatment",
    value: "generalDentistryTreatment",
  },
  {
    label: "Implant Consultation",
    value: "implantConsultation",
  },

  {
    label: "Implant Impressions",
    value: "implantImpressions",
  },
  {
    label: "Implant Surgery",
    value: "implantSurgery",
  },
  {
    label: "Impressions",
    value: "impressions",
  },
  {
    label: "Individual Dental Implants Treatment",
    value: "individualDentalImplantsTreatment",
  },
  {
    label: "Sleep Dentistry Treatment",
    value: "sleepDentistryTreatment",
  },
  {
    label: "Sedation Consultation",
    value: "sedationConsultation",
  },
  {
    label: "Root Planning",
    value: "rootPlanning",
  },
  {
    label: "Review",
    value: "review",
  },

  {
    label: "Preliminary Work-up",
    value: "preliminaryWorkUp",
  },

  {
    label: "Multiple Fillings",
    value: "multipleFillings",
  },

  {
    label: "Toothache",
    value: "toothache",
  },

  {
    label: "Insert",
    value: "insert",
  },
  {
    label: "Try-in",
    value: "tryIn",
  },

  {
    label: "Lunch",
    value: "lunch",
  },
  {
    label: "Staff Meeting",
    value: "staffMeeting",
  },
  {
    label: "Not In",
    value: "notIn",
  },
  {
    label: "Process Payment",
    value: "processPayment",
  },
];
// included to be scheduled option - by tamil
export const appointmentStatusOptions = [
  {
    label: "Booked",
    value: "booked",
    color: "#007AFF",
    isConsultation: true,
    isTreatment: true,
  },
  {
    label: "Attended",
    value: "attended",
    color: "#29CC6A",
    isConsultation: true,
    isTreatment: false,
  },
  {
    label: "Completed",
    value: "completed",
    color: "#29CC6A",
    isConsultation: false,
    isTreatment: true,
  },
  {
    label: "To Be Scheduled",
    value: "toBeScheduled",
    color: "#29CC6A",
    isConsultation: true,
    isTreatment: true,
  },

  {
    label: "No Show",
    value: "noShow",
    color:
      "repeating-linear-gradient(135deg,rgba(244, 80, 58, 0.2),rgba(244, 80, 58, 0.2) 4px,transparent 3px,transparent 6px)",
    isConsultation: true,
    isTreatment: true,
  },
  // {
  //   label: "No Appointment",
  //   value: "noAppointment",
  //   color: "#eb9c5b",
  // },
  {
    label: "Cancelled",
    value: "cancelled",
    color:
      "repeating-linear-gradient(135deg,rgba(244, 80, 58, 0.2),rgba(244, 80, 58, 0.2) 4px,transparent 3px,transparent 6px)",
    isConsultation: true,
    isTreatment: true,
  },

  {
    label: "Follow Up TLC",
    value: "followUpTlc",
    color: "#29CC6A",
    isConsultation: false,
    isTreatment: true,
  },
  // {
  //   label: "Confirmed",
  //   value: "confirmed",
  //   color: "#007AFF",
  // },
  // {
  //   label: "Blocked",
  //   value: "blocked",
  //   color: "#9bb3e0",
  // },
  // {
  //   label: "No Response",
  //   value: "noResponse",
  //   color: "#eb9c5b",
  // },
  // {
  //   label: "In the Chair",
  //   value: "inTheChair",
  //   color: "#7B61FF",
  // },
];
export function roundNumberToFactorsOfTen(num) {
  // Round to 2 decimal places
  var roundedNum = Math.round(num * 100) / 100;

  // Round off the decimal places to factors of 10
  roundedNum = Math.ceil(roundedNum * 10) / 10;

  return roundedNum;
}

export const clinlogFilterColumns = [
  {
    label: "Location",
    group: "generalDetails",

    key: "recordClinic",
    type: "select",
  },
  // {
  //   label: "Full Name",
  //   group: "generalDetails",
  //   key: "fullName",
  //   type: "string",
  // },
  {
    label: "Sex",
    group: "generalDetails",

    key: "sex",
    type: "select",
    options: [
      { name: "M", value: "M" },
      { name: "F", value: "F" },
    ],
  },
  {
    label: "Age At Time Of Surgery",
    group: "generalDetails",
    key: "ageAtTimeOfSurgery",
    type: "number",
  },
  {
    label: "Surgery Date",
    group: "generalDetails",
    key: "recordTreatmentDate",
    type: "date",
  },
  {
    label: "Arch Type",
    key: "archType",
    group: "generalDetails",
    type: "select",
    options: [
      { name: "Upper", value: "upper" },
      { name: "Lower", value: "lower" },
    ],
  },
  {
    label: "Treatment",
    key: "treatmentTitle",
    group: "generalDetails",
    type: "select",
    options: [
      { name: "AO4 One Side Zygoma", value: "AO4 One Side Zygoma" },
      {
        name: "AO4 Zygoma STANDARD (one each side posterior)",
        value: "AO4 Zygoma STANDARD (one each side posterior)",
      },
      {
        name: "AO4 Zygoma (one side quad/double zygoma)",
        value: "AO4 Zygoma (one side quad/double zygoma)",
      },
      {
        name: "AO4 Zygoma (3 with one side quad/double)",
        value: "AO4 Zygoma (3 with one side quad/double)",
      },
      { name: "AO4 Zygoma Quad", value: "AO4 Zygoma Quad" },
      { name: "AO5 One Side Zygoma", value: "AO5 One Side Zygoma" },
      {
        name: "AO5 Zygoma (standard - one each side posterior)",
        value: "AO5 Zygoma (standard - one each side posterior)",
      },
      {
        name: "AO5 Zygoma (one each side anterior)",
        value: "AO5 Zygoma (one each side anterior)",
      },
      {
        name: "AO5 Zygoma (one side quad/double zygoma)",
        value: "AO5 Zygoma (one side quad/double zygoma)",
      },
      {
        name: "AO5 Zygoma (3 with one side quad/double)",
        value: "AO5 Zygoma (3 with one side quad/double)",
      },
      { name: "AO5 Zygoma Quad", value: "AO5 Zygoma Quad" },
      { name: "AO6 One Side Zygoma", value: "AO6 One Side Zygoma" },
      {
        name: "AO6 Zygoma (standard - one each side posterior)",
        value: "AO6 Zygoma (standard - one each side posterior)",
      },
      {
        name: "AO6 Zygoma (one side quad/double zygoma)",
        value: "AO6 Zygoma (one side quad/double zygoma)",
      },
      {
        name: "AO6 Zygoma (3 with one side quad/double)",
        value: "AO6 Zygoma (3 with one side quad/double)",
      },
      { name: "AO6 Zygoma Quad", value: "AO6 Zygoma Quad" },
      {
        name: "Revision using Zygoma (Single)",
        value: "Revision using Zygoma (Single)",
      },
      {
        name: "Revision using Zygoma (2 Single)",
        value: "Revision using Zygoma (2 Single)",
      },
      {
        name: "Revision using Zygoma (double/quad)",
        value: "Revision using Zygoma (double/quad)",
      },
      { name: "AO4 STANDARD", value: "AO4 STANDARD" },
      { name: "AO5 Standard", value: "AO5 Standard" },
      { name: "AO6 Standard", value: "AO6 Standard" },
      { name: "AO7 Standard", value: "AO7 Standard" },
      {
        name: "AO6 Zygoma Quad ( x2 pterygoids)",
        value: "AO6 Zygoma Quad ( x2 pterygoids)",
      },
      { name: "Revision using standard", value: "Revision using standard" },
      {
        name: "AO7 Quad Zygoma Pterygoids Midline",
        value: "AO7 Quad Zygoma Pterygoids Midline",
      },
      { name: "AO8 Zygoma Pterygoids", value: "AO8 Zygoma Pterygoids" },
      {
        name: "AO7 Zygoma Pterygoids Midline",
        value: "AO7 Zygoma Pterygoids Midline",
      },
      { name: "Unknown", value: "unknown" },
    ],
  },
  {
    label: "Edentulous",
    key: "edentulous",
    group: "generalDetails",
    type: "select",
    options: [
      { name: "Yes", value: "Yes" },
      { name: "No", value: "No" },
      { name: "Unknown", value: "unknown" },
    ],
  },
  {
    label: "Surgeon",
    key: "recordTreatmentSurgeons",
    group: "generalDetails",
    type: "select",
    options: [], // list of dentist based on clinic id
  },
  {
    label: "Treatment Planned By",
    key: "treatmentPlannedBy",
    group: "generalDetails",
    type: "select",
    options: [
      { name: "Surgeon", value: "Surgeon" },
      {
        name: "Restorative Dentist (Without Consulting the Surgeon)",
        value: "Restorative Dentist (Without Consulting the Surgeon)",
      },
      {
        name: "Restorative Dentist With Surgeon's Feedback",
        value: "Restorative Dentist With Surgeon's Feedback",
      },
      { name: "Unknown", value: "unknown" },
    ],
  },
  {
    label: "Diabetes And Osteoporosis",
    key: "diabetesAndOsteoporosis",
    group: "patientCharacteristics",
    type: "select",
    options: [
      { name: "Diabetes", value: "Diabetes" },
      { name: "Osteoporosis", value: "Osteoporosis" },
      { name: "Diabetes + Osteoporosis", value: "Diabetes + Osteoporosis" },
      { name: "None", value: "None" },
      { name: "Unknown", value: "unknown" },
    ],
  },
  {
    label: "Oestrogen",
    key: "oestrogen",
    group: "patientCharacteristics",
    type: "select",
    options: [
      { name: "Yes", value: "Yes" },
      { name: "No", value: "No" },
      { name: "Not Applicable", value: "Not Applicable" },
      { name: "Unknown", value: "unknown" },
    ],
  },
  {
    label: "Smoking",
    key: "smoking",
    group: "patientCharacteristics",
    type: "select",
    options: [
      { name: "Yes, Heavy", value: "I smoke daily", isReport: true },
      {
        name: "Yes",
        value: "I smoke occasionally or socially only",
        isReport: true,
      },
      { name: "No", value: "I don’t smoke", isReport: true },
      { name: "Unknown", value: "unknown" },
    ],
  },
  {
    label: "Alcohol",
    key: "alcohol",
    type: "select",
    group: "patientCharacteristics",
    options: [
      { name: "Daily", value: "I drink daily" },
      {
        name: "2-4 Times per Week",
        value: "I drink 2-4 standard drinks per week",
      },
      {
        name: "Occasionally/Socially",
        value: "I drink occasionally or socially only",
      },
      { name: "Never", value: "I don’t drink Alcohol" },
      { name: "Unknown", value: "unknown" },
    ],
  },
  {
    label: "Oral Hygiene",
    key: "oralHygiene",
    group: "patientCharacteristics",
    type: "select",
    options: [
      { name: "Excellent", value: "Excellent", isReport: true },
      { name: "Reasonable", value: "Reasonable", isReport: true },
      { name: "Poor", value: "Poor", isReport: true },
      { name: "Very Poor", value: "Very Poor", isReport: true },
      { name: "Unknown", value: "unknown" },
    ],
  },
  {
    label: "Bruxism",
    key: "bruxism",
    group: "patientCharacteristics",
    type: "select",
    options: [
      { name: "Advanced Bruxism", value: "Advanced Bruxism", isReport: true },
      {
        name: "Moderate or At Risk",
        value: "Moderate or At Risk",
        isReport: true,
      },
      { name: "Mild Signs", value: "Mild Signs", isReport: true },
      { name: "Not Present", value: "Not Present", isReport: true },
      { name: "Unknown", value: "unknown" },
    ],
  },
  {
    label: "Diagnosis Or Aetiology",
    key: "diagnosisOrAetiology",
    group: "patientCharacteristics",
    type: "select",
    options: [
      { name: "Trauma", value: "Trauma", isReport: true },
      { name: "Caries", value: "Caries", isReport: true },
      { name: "Gum Disease", value: "Gum Disease", isReport: true },
      {
        name: "Occlusal Wear or Trauma",
        value: "Occlusal Wear or Trauma",
        isReport: true,
      },
      { name: "Unknown Or Other", value: "unknownOrOther" },
    ],
  },
  {
    label: "Upper Arch Condition",
    key: "upperArchCondition",
    group: "treatmentCharacteristics",
    type: "select",
    options: [
      { name: "Edentulous", value: "Edentulous", isReport: true },
      {
        name: "Partially Dentate (5 Teeth or Less)",
        value: "Partially Dentate (5 Teeth or Less)",
        isReport: true,
      },
      {
        name: "Partially Dentate (6-10 teeth)",
        value: "Partially Dentate (6-10 teeth)",
        isReport: true,
      },
      {
        name: "Dentate (11+ teeth)",
        value: "Dentate (11+ teeth)",
        isReport: true,
      },
      {
        name: "Mostly Natural (10+ Teeth)",
        value: "Mostly Natural (10+ Teeth)",
      },
      {
        name: "Mostly Natural (6-9 Teeth with Denture)",
        value: "Mostly Natural (6-9 Teeth with Denture)",
      },
      {
        name: "Mostly Natural (6-9 Teeth with NO Denture)",
        value: "Mostly Natural (6-9 Teeth with NO Denture)",
      },
      {
        name: "Mostly Natural (5 Teeth and  Under with Denture)",
        value: "Mostly Natural (5 Teeth and  Under with Denture)",
      },
      {
        name: "Mostly Natural (5 Teeth and  Under with NO Denture)",
        value: "Mostly Natural (5 Teeth and  Under with NO Denture)",
      },
      { name: "Fixed Implant Bridge", value: "Fixed Implant Bridge" },
      { name: "Full Denture", value: "Full Denture" },
      { name: "Unknown", value: "Unknown" },
    ],
  },

  {
    label: "Opposing Arch Condition",
    key: "lowerArchCondition",
    group: "treatmentCharacteristics",
    type: "select",
    options: [
      { name: "Edentulous", value: "Edentulous" },
      {
        name: "Partially Dentate (5 Teeth or Less)",
        value: "Partially Dentate (5 Teeth or Less)",
      },
      {
        name: "Partially Dentate (6-10 teeth)",
        value: "Partially Dentate (6-10 teeth)",
      },
      { name: "Dentate (11+ teeth)", value: "Dentate (11+ teeth)" },
      {
        name: "Mostly Natural (10+ Teeth)",
        value: "Mostly Natural (10+ Teeth)",
        isReport: true,
      },
      {
        name: "Mostly Natural (6-9 Teeth with Denture)",
        value: "Mostly Natural (6-9 Teeth with Denture)",
        isReport: true,
      },
      {
        name: "Mostly Natural (6-9 Teeth with NO Denture)",
        value: "Mostly Natural (6-9 Teeth with NO Denture)",
        isReport: true,
      },
      {
        name: "Mostly Natural (5 Teeth and  Under with Denture)",
        value: "Mostly Natural (5 Teeth and  Under with Denture)",
        isReport: true,
      },
      {
        name: "Mostly Natural (5 Teeth and  Under with NO Denture)",
        value: "Mostly Natural (5 Teeth and  Under with NO Denture)",
        isReport: true,
      },
      {
        name: "Fixed Implant Bridge",
        value: "Fixed Implant Bridge",
        isReport: true,
      },
      {
        name: "Opposing Arch Condition (Not Recorded)",
        value: "lowerArchCondition (Not Recorded)",
        isReport: true,
      },
      { name: "Full Denture", value: "Full Denture", isReport: true },
      { name: "Unknown", value: "Unknown" },
    ],
  },
  {
    label: "Number Of Zygoma Implants",
    key: "zygomaImplants",
    group: "treatmentCharacteristics",
    type: "number",
    isReport: true,
  },
  {
    label: "Number Of Regular Implants",
    key: "regularImplants",
    group: "treatmentCharacteristics",
    type: "number",
  },
  {
    label: "Total Number Of Implants",
    key: "totalImplants",
    group: "treatmentCharacteristics",
    type: "number",
    isReport: true,
  },
  {
    label: "Immediate Restoration",
    key: "immediateRestoration",
    group: "treatmentCharacteristics",
    type: "select",
    options: [
      {
        name: "Implant-retained Fixed IMMEDIATE FINAL",
        value: "Implant-retained Fixed IMMEDIATE FINAL",
      },
      {
        name: "Implant-retained Fixed PROVISIONAL",
        value: "Implant-retained Fixed PROVISIONAL",
      },
      {
        name: "Implant-Supported Removable Denture",
        value: "Implant-Supported Removable Denture",
      },
      {
        name: "Tooth-supported Partial Denture",
        value: "Tooth-supported Partial Denture",
      },
      {
        name: "Tooth-supported Fixed bridge",
        value: "Tooth-supported Fixed bridge",
      },
      { name: "Tissue-born denture", value: "Tissue-born denture" },
      { name: "Unknown", value: "unknown" },
    ],
  },
  {
    label: "Date Of Insertion",
    key: "dateOfInsertion",
    group: "treatmentCharacteristics",
    type: "date",
  },
  {
    label: "Time from Surgery to Insertion",
    key: "timeFromSurgery",
    group: "treatmentCharacteristics",
    type: "number",
  },
  {
    label: "Immediate Function Speech",
    key: "immediateFunctionSpeech",
    group: "treatmentCharacteristics",
    type: "select",
    options: [
      { name: "Satisfactory", value: "Satisfactory", isReport: true },
      { name: "Unsatisfactory", value: "Unsatisfactory", isReport: true },
      { name: "Unknown", value: "unknown" },
    ],
  },
  {
    label: "Immediate Aesthetics",
    key: "immediateAesthetics",
    group: "treatmentCharacteristics",
    type: "select",
    options: [
      { name: "Satisfactory", value: "Satisfactory", isReport: true },
      { name: "Unsatisfactory", value: "Unsatisfactory", isReport: true },
      { name: "Unknown", value: "unknown" },
    ],
  },
  {
    label: "Examiner",
    key: "examiner",
    group: "followUp",
    type: "string",
  },
  {
    group: "followUp",
    key: "numberOfReviews",
    label: "Number Of Reviews",
    type: "number",
  },
  {
    group: "followUp",
    key: "numberOfRestorativeBreakages",
    label: "Number Of Restorative Breakages",
    type: "number",
  },
  {
    group: "followUp",
    key: "examinerRadiographic",
    label: "Examiner Radiographic",
    type: "string",
  },
  {
    group: "followUp",
    key: "zirconiaUpgrade",
    label: "Zirconia Upgrade",
    type: "select",
    options: [
      { name: "Yes", value: "Yes" },
      { name: "No", value: "No" },
      { name: "Unknown", value: "unknown" },
    ],
  },
  {
    group: "followUp",
    key: "dateOfFollowUp",
    label: "Date Of Follow Up",
    type: "date",
  },

  {
    group: "followUp",
    key: "timeFromSurgery_fs",
    label: "Time From Surgery To Follow Up",
    type: "number",
  },

  {
    group: "followUp",
    key: "smokingAtFollowUp",
    label: "Smoking At Follow Up",
    type: "select",
    options: [
      { name: "Yes (Cigarettes)", value: "Yes (Cigarettes)" },
      { name: "Yes (Vape)", value: "Yes (Vape)" },
      { name: "Yes", value: "Yes" },
      { name: "No", value: "No" },
      { name: "Unknown", value: "unknown" },
    ],
  },
  {
    group: "followUp",
    key: "hygieneAtFollowUp",
    label: "Hygiene At Follow Up",
    type: "select",
    options: [
      { name: "Excellent", value: "Excellent" },
      { name: "Reasonable", value: "Reasonable" },
      { name: "Poor", value: "Poor" },
      { name: "Very Poor", value: "Very Poor" },
      { name: "Unknown", value: "unknown" },
    ],
  },
  {
    group: "followUp",
    key: "performanceOverFollowUpPeriod",
    label: "Performance Over Follow Up Period",
    type: "select",
    options: [
      {
        name: "Continuous fixed function",
        value: "Continuous fixed function",
      },
      {
        name: "Interrupted fixed function",
        value: "Interrupted fixed function",
      },
      {
        name: "Loss of fixed function",
        value: "Loss of fixed function",
      },
      { name: "Unknown", value: "unknown" },
    ],
  },
  {
    group: "patientSurvey",
    key: "surveyDate",
    label: "Survey Date",
    type: "date",
  },
  {
    group: "patientSurvey",
    key: "timeFromSurgery_ps",
    label: "Time From Surgery To Survey",
    type: "number",
  },
  {
    group: "patientSurvey",
    key: "patientSatisfactionAesthetic",
    label: "How do you feel about the OUTCOME?",
    type: "select",
    options: [
      {
        name: "Exceeded my expectations and life changing",
        value: "Exceeded my expectations and life changing",
        isReport: true,
      },
      {
        name: "Exceeded my expectations",
        value: "Exceeded my expectations",
        isReport: true,
      },
      {
        name: "Met my expectations",
        value: "Met my expectations",
        isReport: true,
      },
      {
        name: "Did not meet my expectations",
        value: "Did not meet my expectations",
        isReport: true,
      },
      {
        name: "How do you feel about the OUTCOME? (Not Recorded)",
        value: "patientSatisfactionAesthetic (Not Recorded)",
        isReport: true,
      },
    ],
  },
  {
    group: "patientSurvey",
    key: "patientSatisfactionFunction",
    label: "How is your FUNCTION?",
    type: "select",
    options: [
      {
        name: "I can chew and function normally, better than before",
        value: "I can chew and function normally, better than before",
        isReport: true,
      },
      {
        name: "I can chew and function normally, similar to before",
        value: "I can chew and function normally, similar to before",
        isReport: true,
      },
      {
        name: "I feel restricted in some ways",
        value: "I feel restricted in some ways",
        isReport: true,
      },
      {
        name: "I am unable to chew or function normally",
        value: "I am unable to chew or function normally",
        isReport: true,
      },
      {
        name: "How is your FUNCTION? (Not Recorded)",
        value: "patientSatisfactionFunction (Not Recorded)",
        isReport: true,
      },
    ],
  },
  {
    group: "patientSurvey",
    key: "patientSatisfactionTreatment",
    label: "How was the TREATMENT PROCESS?",
    type: "select",
    options: [
      {
        name: "It was better than I expected",
        value: "It was better than I expected",
        isReport: true,
      },
      {
        name: "It was what I expected",
        value: "It was what I expected",
        isReport: true,
      },
      {
        name: "It was worse than I expected",
        value: "It was worse than I expected",
        isReport: true,
      },
      {
        name: "How was the TREATMENT PROCESS? (Not Recorded)",
        value: "patientSatisfactionTreatment (Not Recorded)",
        isReport: true,
      },
    ],
  },
  {
    group: "patientSurvey",
    key: "patientSatisfactionMaintenance",
    label: "How is the maintenance?",
    type: "select",
    options: [
      {
        name: "I find it simple to clean and easier than cleaning of my natural teeth just before treatment",
        value:
          "I find it simple to clean and easier than cleaning of my natural teeth just before treatment",
        isReport: true,
      },
      {
        name: "I find cleaning process simple and similar to before treatment",
        value: "I find cleaning process simple and similar to before treatment",
        isReport: true,
      },
      {
        name: "I find it difficult to clean",
        value: "I find it difficult to clean",
        isReport: true,
      },
      {
        name: "How is the maintenance? (Not Recorded)",
        value: "patientSatisfactionMaintenance (Not Recorded)",
        isReport: true,
      },
    ],
  },
  {
    group: "patientSurvey",
    key: "postOpPain",
    label: "Have you had pain following your surgery?",
    type: "select",
    options: [
      {
        name: "I had no pain",
        value: "I had no pain",
        isReport: true,
      },
      {
        name: "I had mild pain which I managed without medication",
        value: "I had mild pain which I managed without medication",
        isReport: true,
      },
      {
        name: "I had mild pain which I managed with medication",
        value: "I had mild pain which I managed with medication",
        isReport: true,
      },
      {
        name: "I had moderate pain which I managed with medication",
        value: "I had moderate pain which I managed with medication",
        isReport: true,
      },
      {
        name: "I had moderate pain which I  managed without medication",
        value: "I had moderate pain which I  managed without medication",
        isReport: true,
      },
      {
        name: "I had severe pain which I managed with medication ",
        value: "I had severe pain which I managed with medication ",
        isReport: true,
      },
      {
        name: "I had severe pain that I could NOT manage with medication ",
        value: "I had severe pain that I could NOT manage with medication ",
        isReport: true,
      },
      {
        name: "Have you had pain following your surgery? (Not Recorded)",
        value: "postOpPain (Not Recorded)",
        isReport: true,
      },
    ],
  },
  {
    group: "patientSurvey",
    key: "smoking_ps",
    label: "Smoking",
    type: "select",
    options: [
      {
        name: "I was and continue to be a non-smoker",
        value: "I was and continue to be a non-smoker",
        isReport: true,
      },
      {
        name: "I was a non-smoker but smoked after the procedure now",
        value: "I was a non-smoker but smoked after the procedure now",
        isReport: true,
      },
      {
        name: "I was a smoker but did not smoke any cigarettes after the procedure",
        value:
          "I was a smoker but did not smoke any cigarettes after the procedure",
        isReport: true,
      },
      {
        name: "I was a smoker and continue to smoked occassionally after the procedure",
        value:
          "I was a smoker and continue to smoked occassionally after the procedure",
        isReport: true,
      },
      {
        name: "I am a smoker and continue to smoke after the procedure",
        value: "I am a smoker and continue to smoke after the procedure",
        isReport: true,
      },
    ],
  },

  {
    group: "siteSpecificCharacteristics",
    key: "toothValue",
    label: "Site",
    type: "select",
    options: [
      { name: "Upper Midline", value: "Upper Midline", isReport: true },
      { name: "11", value: "11", isReport: true },
      { name: "12", value: "12", isReport: true },
      { name: "13", value: "13", isReport: true },
      { name: "14", value: "14", isReport: true },
      { name: "15", value: "15", isReport: true },
      { name: "16", value: "16", isReport: true },
      { name: "17", value: "17", isReport: true },
      { name: "18", value: "18", isReport: true },

      { name: "21", value: "21", isReport: true },
      { name: "22", value: "22", isReport: true },
      { name: "23", value: "23", isReport: true },
      { name: "24", value: "24", isReport: true },
      { name: "25", value: "25", isReport: true },
      { name: "26", value: "26", isReport: true },
      { name: "27", value: "27", isReport: true },
      { name: "28", value: "28", isReport: true },
      { name: "Lower Midline", value: "Lower Midline", isReport: true },
      { name: "31", value: "31", isReport: true },
      { name: "32", value: "32", isReport: true },
      { name: "33", value: "33", isReport: true },
      { name: "34", value: "34", isReport: true },
      { name: "35", value: "35", isReport: true },
      { name: "36", value: "36", isReport: true },
      { name: "37", value: "37", isReport: true },
      { name: "38", value: "38", isReport: true },
      { name: "41", value: "41", isReport: true },
      { name: "42", value: "42", isReport: true },
      { name: "43", value: "43", isReport: true },
      { name: "44", value: "44", isReport: true },
      { name: "45", value: "45", isReport: true },
      { name: "46", value: "46", isReport: true },
      { name: "47", value: "47", isReport: true },
      { name: "48", value: "48", isReport: true },
    ],
  },
  {
    group: "siteSpecificCharacteristics",
    key: "implantBrand",
    label: "Implant Brand",
    type: "select",
    options: [
      { name: "Straumann", value: "straumann" },
      { name: "Nobel Biocare", value: "nobelBiocare" },
      { name: "Southern Implants", value: "southernImplants" },
      { name: "Other", value: "other" },
    ],
  },
  {
    group: "siteSpecificCharacteristics",
    key: "implantCategory",
    label: "Implant Category",
    type: "select",
    options: [
      {
        name: "Regular Implant (Bone Level)",
        value: "regularImplantBoneLevel",
        isReport: true,
      },
      {
        name: "Regular Implant (Tissue Level - Polished Collar)",
        value: "regularImplantTissueLevelPolishedCollar",
        isReport: true,
      },
      {
        name: "Regular Implant (Remote Anchorage - Polished Collar & Shaft)",
        value: "regularImplantRemoteAnchoragePolishedCollarShaft",
        isReport: true,
      },
      {
        name: "Regular Implant (Bicortical Anchorage - Polished Shaft With Threaded Collar)",
        value:
          "regularImplantBicorticalAnchoragePolishedShaftWithThreadedCollar",
        isReport: true,
      },
      {
        name: "Zygomatic Implant (45º Threaded Collar and Shaft)",
        value: "zygomaticImplant45oThreadedCollarAndShaft",
        isReport: true,
      },
      {
        name: "Zygomatic Implant (45º Smooth-Treated Collar and Shaft)",
        value: "zygomaticImplant45oSmoothTreatedCollarAndShaft",
        isReport: true,
      },
      {
        name: "Zygomatic Implant (55º Polished Collar and Shaft)",
        value: "zygomaticImplant55oPolishedCollarAndShaft",
        isReport: true,
      },
      {
        name: "Zygomatic Implant (55º Bicortical Threaded Collar and Polished Shaft)",
        value: "zygomaticImplant55oBicorticalThreadedCollarAndPolishedShaft",
        isReport: true,
      },
      {
        name: "Zygomatic Implant (0º Polished Shaft)",
        value: "zygomaticImplant0oPolishedShaft",
        isReport: true,
      },
      {
        name: "Zygomatic Implant (45º Polished Collar and Shaft)",
        value: "zygomaticImplant45oPolishedCollarAndShaft",
        isReport: true,
      },
      {
        name: "Zygomatic Implant (0º Smooth-Treated Collar and Shaft)",
        value: "zygomaticImplant0oSmoothTreatedCollarAndShaft",
        isReport: true,
      },
      {
        name: "Zygomatic Implant (0º Polished Collar and Shaft)",
        value: "zygomaticImplant0oPolishedCollarAndShaft",
        isReport: true,
      },
      {
        name: "Other",
        value: "other",
        isReport: true,
      },
    ],
  },
  {
    group: "siteSpecificCharacteristics",
    key: "implantLine",
    label: "Implant Line",
    type: "select",
  },
  {
    group: "siteSpecificCharacteristics",
    key: "implantType",
    label: "Implant Type",
    type: "select",
    options: [
      {
        brand: "straumann",
        name: "ZAGA Flat",
        value: "ZAGA Flat",
        isReport: true,
      },
      {
        brand: "straumann",
        name: "ZAGA Round",
        value: "ZAGA Round",
        isReport: true,
      },
      {
        brand: "straumann",
        name: "BLX ø3.5mm",
        value: "BLX ø3.5mm",
        isReport: true,
      },
      {
        brand: "straumann",
        name: "BLX ø3.75mm",
        value: "BLX ø3.75mm",
        isReport: true,
      },
      {
        brand: "straumann",
        name: "BLX ø4mm",
        value: "BLX ø4mm",
        isReport: true,
      },
      {
        brand: "straumann",
        name: "BLX ø4.5mm",
        value: "BLX ø4.5mm",
        isReport: true,
      },
      {
        brand: "straumann",
        name: "BLX ø5mm",
        value: "BLX ø5mm",
        isReport: true,
      },
      {
        brand: "straumann",
        name: "BLX ø5.5",
        value: "BLX ø5.5mm",
        isReport: true,
      },
      {
        brand: "straumann",
        name: "BLX ø6.5mm",
        value: "BLX ø6.5mm",
        isReport: true,
      },
      {
        brand: "straumann",
        name: "TLC NT 3.3mm",
        value: "TLC NT 3.3mm",
        isReport: true,
      },
      {
        brand: "straumann",
        name: "TLC NT 3.75mm",
        value: "TLC NT 3.75mm",
        isReport: true,
      },
      {
        brand: "straumann",
        name: "TLC RT 3.75mm",
        value: "TLC RT 3.75mm",
        isReport: true,
      },
      {
        brand: "nobelBiocare",
        name: "Nobel Zygoma",
        value: "Nobel Zygoma",
        isReport: true,
      },
      {
        brand: "nobelBiocare",
        name: "Nobel Active RP ø4.3mm",
        value: "Nobel Active RP ø4.3mm",
        isReport: true,
      },
      {
        brand: "southernImplants",
        name: " Southern Soft Bone PT-DC ø4.0",
        value: " Southern Soft Bone PT-DC ø4.0",
        isReport: true,
      },
      {
        brand: "other",
        name: "Existing Integrated Implant",
        value: "Existing Integrated Implant",
        isReport: true,
      },
    ],
  },
  {
    group: "siteSpecificCharacteristics",
    key: "implantLength",
    label: "Implant Length",
    type: "select",
    options: [
      { type: "ZAGA", name: "30.0mm", value: "30.0mm" },
      { type: "ZAGA", name: "32.5mm", value: "32.5mm" },
      { type: "ZAGA", name: "35.0mm", value: "35.0mm" },
      { type: "ZAGA", name: "37.5mm", value: "37.5mm" },
      { type: "ZAGA", name: "40.0mm", value: "40.0mm" },
      { type: "ZAGA", name: "42.5mm", value: "42.5mm" },
      { type: "ZAGA", name: "45.0mm", value: "45.0mm" },
      { type: "ZAGA", name: "47.5mm", value: "47.5mm" },
      { type: "ZAGA", name: "50.0mm", value: "50.0mm" },
      { type: "ZAGA", name: "52.5mm", value: "52.5mm" },
      { type: "ZAGA", name: "55.0mm", value: "55.0mm" },
      { type: "ZAGA", name: "57.5mm", value: "57.5mm" },
      { type: "ZAGA", name: "60.0mm", value: "60.0mm" },
      {
        type: "Other",
        name: "8.0mm",
        value: "8.0mm",
      },
      {
        type: "Other",
        name: "10.0mm",
        value: "10.0mm",
      },
      {
        type: "Other",
        name: "12.0mm",
        value: "12.0mm",
      },
      {
        type: "Other",
        name: "14.0mm",
        value: "14.0mm",
      },
      {
        type: "Other",
        name: "16.0mm",
        value: "16.0mm",
      },
      {
        type: "Other",
        name: "18.0mm",
        value: "18.0mm",
      },
      {
        type: "Other",
        name: "20.0mm",
        value: "20.0mm",
      },
    ],
  },
  {
    group: "siteSpecificCharacteristics",
    key: "angleCorrectionAbutment",
    label: "Abutment",
    type: "select",
    options: [
      {
        type: "ZAGA",
        name: "Straight 1.5mm",
        value: "Straight 1.5mm",
      },
      {
        type: "ZAGA",
        name: "Straight 2.5mm",
        value: "Straight 2.5mm",
      },
      {
        type: "ZAGA",
        name: "Straight 3.5mm",
        value: "Straight 3.5mm",
      },
      {
        type: "ZAGA",
        name: "Straight 4.5mm",
        value: "Straight 4.5mm",
      },
      {
        type: "Other",
        name: "Straight 1.5mm",
        value: "Straight 1.5mm",
      },
      {
        type: "Other",
        name: "Straight 2.5mm",
        value: "Straight 2.5mm",
      },
      {
        type: "Other",
        name: "Straight 3.5mm",
        value: "Straight 3.5mm",
      },
      {
        type: "Other",
        name: "Straight 4.5mm",
        value: "Straight 4.5mm",
      },
      { type: "Other", name: "17º 3.5mm", value: "17º 3.5mm" },
      { type: "Other", name: "17º 4.5mm", value: "17º 4.5mm" },
      { type: "Other", name: "17º 5.5mm", value: "17º 5.5mm" },
      { type: "Other", name: "30º 3.5mm", value: "30º 3.5mm" },
      { type: "Other", name: "30º 4.5mm", value: "30º 4.5mm" },
      { type: "Other", name: "30º 5.5mm", value: "30º 5.5mm" },
      { type: "Nobel Zygoma", name: "2mm", value: "2mm" },
      { type: "Nobel Zygoma", name: "3mm", value: "3mm" },
      { type: "Nobel Zygoma", name: "17 deg 2mm", value: "17 deg 2mm" },
      { type: "Nobel Zygoma", name: "17 deg 3mm", value: "17 deg 3mm" },
      { type: "Nobel Active RP ø4.3mm", name: "1.5mm", value: "1.5mm" },
      { type: "Nobel Active RP ø4.3mm", name: "2.5mm", value: "2.5mm" },
      { type: "Nobel Active RP ø4.3mm", name: "3.5mm", value: "3.5mm" },
      {
        type: "Nobel Active RP ø4.3mm",
        name: "17 deg 2.5mm",
        value: "17 deg 2.5mm",
      },
      {
        type: "Nobel Active RP ø4.3mm",
        name: "17 deg 3.5mm",
        value: "17 deg 3.5mm",
      },
      {
        type: "Nobel Active RP ø4.3mm",
        name: "30 deg 3.5mm",
        value: "30 deg 3.5mm",
      },
      {
        type: "Nobel Active RP ø4.3mm",
        name: "30 deg 4.5mm",
        value: "30 deg 4.5mm",
      },
    ],
  },
  {
    group: "siteSpecificCharacteristics",
    key: "placement",
    label: "Placement",
    type: "select",
    options: [
      {
        name: "Maxillary Bone (Standard Endosseous)",
        value: "Maxillary Bone (Standard Endosseous)",
        isReport: true,
      },
      {
        name: "Maxillary Bone with Nasal Floor",
        value: "Maxillary Bone with Nasal Floor",
        isReport: true,
      },
      {
        name: "Nasopalatine Canal",
        value: "Nasopalatine Canal",
        isReport: true,
      },
      { name: "Nasal Spine", value: "Nasal Spine", isReport: true },
      { name: "Pyriform", value: "Pyriform", isReport: true },
      { name: "Pterygoid", value: "Pterygoid", isReport: true },
      {
        name: "Maxillary bone/posterior pyriform",
        value: "Maxillary bone/posterior pyriform",
        isReport: true,
      },
      {
        name: "ZYGOMA Extra-maxillary",
        value: "ZYGOMA Extra-maxillary",
        isReport: true,
      },
      {
        name: "ZYGOMA Partly extra-maxillary",
        value: "ZYGOMA Partly extra-maxillary",
        isReport: true,
      },
      {
        name: "ZYGOMA Intra-sinus",
        value: "ZYGOMA Intra-sinus",
        isReport: true,
      },

      {
        name: "ZYGOMA Intra-maxillary",
        value: "ZYGOMA Intra-maxillary",
        isReport: true,
      },
      {
        name: "Mandibular Bone (Standard Endosseous)",
        value: "Mandibular Bone (Standard Endosseous)",
        isReport: true,
      },
      {
        name: "Mandibular Cortical Base",
        value: "Mandibular Cortical Base",
        isReport: true,
      },
      {
        name: "Placement (Not Recorded)",
        value: "Placement (Not Recorded)",
        isReport: true,
      },
      { name: "Unknown", value: "unknown" },
    ],
  },
  {
    group: "siteSpecificCharacteristics",
    key: "trabecularBoneDensity",
    label: "Trabecular Bone Density",
    type: "select",
    options: [
      { name: "Low Density", value: "Low Density" },
      { name: "High Density", value: "High Density" },
      { name: "Optimal", value: "Optimal" },
      { name: "Medium Density", value: "Medium Density" },
      { name: "Unknown", value: "unknown" },
    ],
  },
  {
    group: "siteSpecificCharacteristics",
    key: "boneVascularity",
    label: "Bone Vascularity",
    type: "select",
    options: [
      { name: "Normal", value: "Normal" },
      { name: "Low Vascularity", value: "Low Vascularity" },
      { name: "Avascular", value: "Avascular" },
      { name: "Vascular", value: "Vascular" },
      { name: "Unknown", value: "unknown" },
    ],
  },
  {
    group: "siteSpecificCharacteristics",
    key: "graftingApplied",
    label: "Grafting Applied",
    type: "select",
    options: [
      { name: "Yes, Zygoma Slot", value: "Yes, Zygoma Slot" },
      { name: "Yes, Zygoma Hockey Stick", value: "Yes, Zygoma Hockey Stick" },
      { name: "Yes, lateral approach", value: "Yes, lateral approach" },
      { name: "Yes, sinus crush", value: "Yes, sinus crush" },
      { name: "No", value: "No" },
      { name: "Socket Fill", value: "Socket Fill" },
      { name: "Buccal Layered", value: "Buccal Layered" },
      { name: "Unknown", value: "unknown" },
    ],
  },
  {
    group: "siteSpecificCharacteristics",
    key: "graftMaterial",
    label: "Graft Material",
    type: "select",
    options: [
      { name: "Bio Oss", value: "Bio Oss" },
      { name: "Bio Oss Collagen", value: "Bio Oss Collagen" },
      {
        name: "Bio-Oss Layered with Nano Bone",
        value: "Bio-Oss Layered with Nano Bone",
      },
      { name: "PRF-Derived Sticky Bone", value: "PRF-Derived Sticky Bone" },
      {
        name: "PRF-Derived Sticky Bone Bio Oss Collagen",
        value: "PRF-Derived Sticky Bone Bio Oss Collagen",
      },
      {
        name: "PRF-Derived Sticky Bone Bio Oss Collagen layered with nano bone",
        value:
          "PRF-Derived Sticky Bone Bio Oss Collagen layered with nano bone",
      },
      { name: "Other", value: "Other" },
      { name: "No", value: "No" },
      { name: "N/A", value: "N/A" },

      { name: "Unknown", value: "unknown" },
    ],
  },
  {
    group: "siteSpecificCharacteristics",
    key: "intraOperativeSinusComplications",
    label: "Intra-Operative Sinus Complications",
    type: "select",
    options: [
      {
        name: "Sinus perforation managed",
        value: "Sinus perforation managed",
      },
      {
        name: "Sinus perforation unmanaged",
        value: "Sinus perforation unmanaged",
      },
      { name: "N/A", value: "N/A" },
      { name: "Not Detected", value: "Not Detected" },
      { name: "Unknown", value: "unknown" },
    ],
  },
  {
    group: "siteSpecificCharacteristics",
    key: "crestalRest",
    label: "Crestal Rest",
    type: "select",
    options: [
      { name: "Present", value: "Present" },
      { name: "Absent (sinus crush)", value: "Absent (sinus crush)" },
      { name: "N/A", value: "N/A" },
      { name: "Unknown", value: "unknown" },
    ],
  },
  {
    group: "siteSpecificCharacteristics",
    key: "insertionTorque",
    label: "Insertion Torque",
    type: "select",
    options: [
      { name: "80Ncm and above", value: "80Ncm and above" },
      { name: "60-75Ncm", value: "60-75Ncm" },
      { name: "55Ncm and Under", value: "55Ncm and Under" },
      { name: "35 Ncm (minimum)", value: "35 Ncm (minimum)" },
      { name: "Zygoma Hand Driver Ideal", value: "Zygoma Hand Driver Ideal" },
      { name: "Zygoma Hand Driver Low", value: "Zygoma Hand Driver Low" },
      {
        name: "Zygoma Hand Driver – Unmeasured",
        value: "Zygoma Hand Driver – Unmeasured",
      },
      { name: "Unknown", value: "unknown" },
    ],
  },
  {
    group: "siteSpecificCharacteristics",
    key: "relevantBoneWidth",
    label: "Relevant Bone Width",
    type: "select",
    options: [
      { name: "Alveolar Narrow (<4mm)", value: "Alveolar Narrow (<4mm)" },
      { name: "Alveolar Wide (>7mm)", value: "Alveolar Wide (>7mm)" },
      { name: "Alveolar Ideal (4-7mm)", value: "Alveolar Ideal (4-7mm)" },
      { name: "Zygoma <4mm", value: "Zygoma <4mm" },
      { name: "Zygoma 4-7mm", value: "Zygoma 4-7mm" },
      { name: "Zygoma >7mm", value: "Zygoma >7mm" },
      { name: "Unknown", value: "unknown" },
    ],
  },
  {
    group: "siteSpecificCharacteristics",
    key: "preOperativeSinusDisease",
    label: "Pre-Operative Sinus Disease",
    type: "select",
    options: [
      { name: "None", value: "None", isReport: true },
      { name: "Mild Thickening", value: "Mild Thickening", isReport: true },
      {
        name: "Moderate Thickening",
        value: "Moderate Thickening",
        isReport: true,
      },
      {
        name: "Total opacification",
        value: "Total opacification",
        isReport: true,
      },
      { name: "Not Applicable", value: "Not Applicable" },
      { name: "Unknown", value: "unknown" },
    ],
  },
  {
    group: "siteSpecificCharacteristics",
    key: "preOperativeSinusDiseaseManagement",
    label: "Pre-Operative Sinus Disease Management",
    type: "select",
    options: [
      { name: "Not Applicable", value: "Not Applicable" },
      { name: "Conservative", value: "Conservative", isReport: true },
      { name: "ENT Surgery", value: "ENT Surgery" },
      { name: "No Treatment", value: "No Treatment", isReport: true },
      { name: "Unknown", value: "unknown" },
    ],
  },
  {
    group: "siteSpecificCharacteristics",
    key: "conformanceWithTreatmentPlan",
    label: "Conformance With Treatment Plan",
    type: "select",
    options: [
      { name: "Yes, as planned", value: "Yes, as planned", isReport: true },
      {
        name: "Yes, as planned but not immediately loaded",
        value: "Yes, as planned but not immediately loaded",
        isReport: true,
      },
      {
        name: "No, changed to Zygoma",
        value: "No, changed to Zygoma",
        isReport: true,
      },
      {
        name: "No, changed to Standard straight",
        value: "No, changed to Standard straight",
        isReport: true,
      },
      {
        name: "No, changed to Standard angled placement",
        value: "No, changed to Standard angled placement",
        isReport: true,
      },
      {
        name: "No, changed to Pyriform",
        value: "No, changed to Pyriform",
        isReport: true,
      },
      {
        name: "No, this is an additional implant",
        value: "No, this is an additional implant",
        isReport: true,
      },
      {
        name: "No, not placed and deleted from plan/scheme",
        value: "No, not placed and deleted from plan/scheme",
        isReport: true,
      },
      {
        name: "No, placed but not used as support",
        value: "No, placed but not used as support",
        isReport: true,
      },
      {
        name: "Conformance With Treatment Plan (Not Recorded)",
        value: "conformanceWithTreatmentPlan (Not Recorded)",
        isReport: true,
      },
      { name: "Unknown", value: "unknown" },
    ],
  },

  {
    group: "siteSpecificCharacteristics",
    key: "recordFollowUpDate",
    label: "Record Follow Up Date",
    subGroup: "ssFollowUp",
    type: "date",
  },
  {
    group: "siteSpecificCharacteristics",
    key: "implantFunctionAtFollowUp",
    label: "Implant Function At Follow Up",
    subGroup: "ssFollowUp",
    type: "select",
    options: [
      { name: "Yes", value: "Yes", isReport: true },
      { name: "No (failed)", value: "No (failed)", isReport: true },
      { name: "Sleeper", value: "Sleeper", isReport: true },
      {
        name: "Implant Function At Follow Up (Not Recorded)",
        value: "implantFunctionAtFollowUp (Not Recorded)",
        isReport: true,
      },
      { name: "Unknown", value: "unknown" },
    ],
  },
  {
    group: "siteSpecificCharacteristics",
    key: "abutmentFunctionAtFollowUp",
    label: "Abutment Function At Follow Up",
    subGroup: "ssFollowUp",
    type: "select",
    options: [
      { name: "Yes", value: "Yes" },
      { name: "No (failed)", value: "No (failed)" },
      { name: "Sleeper", value: "Sleeper" },
      { name: "Unknown", value: "unknown" },
    ],
  },
  {
    group: "siteSpecificCharacteristics",
    key: "sinusitis",
    label: "Sinusitis",
    subGroup: "ssFollowUp",
    type: "select",
    options: [
      { name: "No", value: "No", isReport: true },
      { name: "Yes", value: "Yes", isReport: true },

      { name: "N/A", value: "N/A" },
      { name: "Unknown", value: "unknown" },
    ],
  },
  {
    group: "siteSpecificCharacteristics",
    key: "facialSwelling",
    label: "Facial Swelling",
    subGroup: "ssFollowUp",
    type: "select",
    options: [
      { name: "Yes", value: "Yes" },
      { name: "No", value: "No" },
      { name: "Unknown", value: "unknown" },
    ],
  },
  {
    group: "siteSpecificCharacteristics",
    key: "inflammation",
    label: "Inflammation",
    subGroup: "ssFollowUp",
    type: "select",
    options: [
      { name: "No", value: "No", isReport: true },
      { name: "Yes", value: "Yes", isReport: true },

      // { name: "Not Recorded", value: "Not Recorded", isReport: true },
      { name: "Unknown", value: "unknown" },
    ],
  },
  {
    group: "siteSpecificCharacteristics",
    key: "suppuration",
    label: "Suppuration",
    subGroup: "ssFollowUp",
    type: "select",
    options: [
      { name: "No", value: "No", isReport: true },
      { name: "Yes", value: "Yes", isReport: true },

      { name: "Unknown", value: "unknown" },
    ],
  },
  {
    group: "siteSpecificCharacteristics",
    key: "pain",
    label: "Pain",
    subGroup: "ssFollowUp",
    type: "select",
    options: [
      { name: "Yes", value: "Yes" },
      { name: "No", value: "No" },
      { name: "Unknown", value: "unknown" },
    ],
  },
  {
    group: "siteSpecificCharacteristics",
    key: "recession",
    label: "Recession",
    subGroup: "ssFollowUp",
    type: "select",
    options: [
      { name: "None", value: "None", isReport: true },
      {
        name: "Minor (Abutment Only)",
        value: "Minor (Abutment Only)",
        isReport: true,
      },
      {
        name: "Moderate (Implant Collar)",
        value: "Moderate (Implant Collar)",
        isReport: true,
      },
      { name: "Advanced (Shaft)", value: "Advanced (Shaft)", isReport: true },
      { name: "Unknown", value: "unknown" },
    ],
  },
  {
    group: "siteSpecificCharacteristics",
    key: "midShaftSoftTissueDehiscence",
    label: "Mid-shaft Soft tissue dehiscence",
    subGroup: "ssFollowUp",
    type: "select",
    options: [
      { name: "No", value: "No", isReport: true },
      { name: "Yes", value: "Yes", isReport: true },
      { name: "N/A", value: "N/A", isReport: true },
      { name: "Unknown", value: "unknown" },
    ],
  },
  {
    group: "siteSpecificCharacteristics",
    key: "firstAbutmentLevelComplication",
    label: "First Abutment-level Complication",
    subGroup: "ssFollowUp",
    type: "select",
    options: [
      { name: "None", value: "None" },
      { name: "Abutment Screw Loosening", value: "Abutment Screw Loosening" },
      { name: "Abutment Screw Breakage", value: "Abutment Screw Breakage" },
      {
        name: "Prosthetic Screw Loosening",
        value: "Prosthetic Screw Loosening",
      },
      { name: "Prosthetic Screw Breakage", value: "Prosthetic Screw Breakage" },
      { name: "Unknown", value: "unknown" },
    ],
  },
  {
    group: "siteSpecificCharacteristics",
    key: "otherAbutmentLevelComplications",
    label: "Other Abutment-level Complications",
    subGroup: "ssFollowUp",
    type: "string",
  },
  {
    group: "siteSpecificCharacteristics",
    key: "totalNumberOfAbutmentLevelComplications",
    label: "Total Number Of Abutment-level Complications",
    subGroup: "ssFollowUp",
    type: "string",
  },
  {
    group: "siteSpecificCharacteristics",
    key: "dateOfFirstAbutmentLevelComplication",
    label: "Date Of First Abutment-level Complication",
    subGroup: "ssFollowUp",
    type: "date",
  },
  {
    group: "siteSpecificCharacteristics",
    key: "firstAbutmentLevelComplicationTimeFromSurgery",
    label: "First Abutment-level Complication Time From Surgery",
    subGroup: "ssFollowUp",
    type: "string",
  },
  {
    group: "siteSpecificCharacteristics",
    key: "postOperativeSinusDisease",
    label: "Post-Operative Sinus Disease",
    subGroup: "ssFollowUp",
    type: "select",
    options: [
      { name: "None", value: "None" },
      { name: "Mild Thickening", value: "Mild Thickening" },
      { name: "Moderate Thickening", value: "Moderate Thickening" },
      { name: "Total opacification", value: "Total opacification" },
      { name: "Unknown", value: "unknown" },
    ],
  },
  {
    group: "siteSpecificCharacteristics",
    key: "boneLoss",
    label: "Bone Loss",
    subGroup: "ssFollowUp",
    type: "select",
    options: [
      { name: "No bone loss detected", value: "No bone loss detected" },
      {
        name: "Vertically less than 2mm, narrow defect",
        value: "Vertically less than 2mm, narrow defect",
      },
      {
        name: "Vertically less than 2mm, wide defect",
        value: "Vertically less than 2mm, wide defect",
      },
      {
        name: "Vertically 2-4mm, narrow defect",
        value: "Vertically 2-4mm, narrow defect",
      },
      {
        name: "Vertically 2-4mm, wide defect",
        value: "Vertically 2-4mm, wide defect",
      },
      {
        name: "Vertically >4mm, narrow defect",
        value: "Vertically >4mm, narrow defect",
      },
      {
        name: "Vertically >4mm, wide defect",
        value: "Vertically >4mm, wide defect",
      },
      { name: "Unknown", value: "unknown" },
    ],
  },
];
export const reportOptions = [
  {
    name: "SURVEY RESULTS BY ARCH CONDITION AT SURGERY",
    value: "surveyVsArchCondition",
    isCsv: true,
    type: "CASES",
  },
  {
    name: "SURVEY RESULTS BY OPPOSING ARCH",
    value: "surveyVsOpposingArch",
    type: "CASES",
  },
  {
    name: "SURVEY RESULTS BY TOTAL NUMBER OF IMPLANTS",
    value: "surveyVsTotalImplants",
    type: "CASES",
  },
  {
    name: "SURVEY RESULTS BY NUMBER OF ZYGOMA IMPLANTS",
    value: "surveyVsZygomaImplants",
    type: "CASES",
  },
  {
    name: "NUMBER OF IMPLANTS IN A GROUP",
    value: "numberOfImplantsAll",
    isCsv: true,
    type: "CASES / SITES",
  },
  {
    name: "NUMBER OF ZYGOMA IMPLANTS IN A GROUP ",
    value: "numberOfImplantsZygoma",
    type: "CASES / SITES",
  },
  {
    name: "NUMBER OF REGULAR IMPLANTS IN A GROUP ",
    value: "numberOfImplantsRegular",
    type: "CASES / SITES",
  },
  {
    name: "PLACEMENT DISTRIBUTION BY SITES",
    value: "placementDistribution",
    isCsv: true,
    type: "SITES",
  },
  {
    name: "CONFORMANCE WITH TREATMENT PLAN BY ARCH CONDITION - EDENTULOUS",
    value: "conformanceVsArchConditionEdentulous",
    type: "SITES",
  },
  {
    name: "CONFORMANCE WITH TREATMENT PLAN BY ARCH CONDITION - NON EDENTULOUS",
    value: "conformanceVsArchConditionOther",
    type: "SITES",
  },

  {
    name: "IMMEDIACY REPORT",
    value: "immediacy",
    isCsv: true,
    type: "CASES",
  },
  {
    name: "TIME FROM SURGERY TO INSERTION OF IMMEDIATE FINAL TEETH",
    value: "timeToImmediateFinalTeeth",
    type: "CASES",
  },
  {
    name: "CASE SUCCESS RATE",
    value: "caseSuccessRate",
    isCsv: true,
  },
  {
    name: "COMPLICATIONS REPORT BY IMPLANT LINE VS IMPLANT FUNCTION",
    value: "complicationsReportByImplantType",
    type: "SITES",
  },
  {
    name: "COMPLICATIONS REPORT BY DIAGNOSIS/AETIOLOGY VS IMPLANT FUNCTION",
    value: "complicationsReportByDiagnosisAetiology",
    type: "SITES",
  },
  {
    name: "COMPLICATIONS REPORT BY BRUXISM VS IMPLANT FUNCTION",
    value: "complicationsReportByBruxism",
    type: "SITES",
  },
  {
    name: "COMPLICATIONS REPORT BY HYGIENE VS IMPLANT FUNCTION",
    value: "complicationsReportByHygiene",
    type: "SITES",
  },
  {
    name: "COMPLICATIONS REPORT BY SMOKING VS IMPLANT FUNCTION",
    value: "complicationsReportBySmoking",
    type: "SITES",
  },
  {
    name: "INFLAMMATION VS IMPLANT LINE",
    value: "inflammationVsImplantType",
    type: "SITES",
  },
  {
    name: "INFLAMMATION VS DIAGNOSIS/AETIOLOGY",
    value: "inflammationVsDiagnosisAetiology",
    type: "SITES",
  },
  {
    name: "INFLAMMATION VS BRUXISM",
    value: "inflammationVsBruxism",
    type: "SITES",
  },
  {
    name: "INFLAMMATION VS HYGIENE",
    value: "inflammationVsHygiene",
    type: "SITES",
  },
  {
    name: "RECESSION VS IMPLANT LINE",
    value: "recessionVsImplantType",
    type: "SITES",
  },
  {
    name: "RECESSION VS DIAGNOSIS/AETIOLOGY",
    value: "recessionVsDiagnosisAetiology",
    type: "CASES",
  },
  {
    name: "RECESSION VS BRUXISM",
    value: "recessionVsBruxism",
    type: "CASES",
  },
  {
    name: "RECESSION VS HYGIENE",
    value: "recessionVsHygiene",
    type: "CASES",
  },
  {
    name: "MID-SHAFT DEHISCENCE VS IMPLANT LINE",
    value: "midShaftDehiscenceVsImplantType",
    type: "SITES",
  },
  {
    name: "MID-SHAFT DEHISCENCE VS DIAGNOSIS/AETIOLOGY",
    value: "midShaftDehiscenceVsDiagnosisAetiology",
    type: "CASES",
  },
  {
    name: "MID-SHAFT DEHISCENCE VS BRUXISM",
    value: "midShaftDehiscenceVsBruxism",
    type: "CASES",
  },
  {
    name: "MID-SHAFT DEHISCENCE VS HYGIENE",
    value: "midShaftDehiscenceVsHygiene",
    type: "CASES",
  },
  {
    name: "SUPURATION VS IMPLANT LINE",
    value: "suppurationVsImplantType",
    type: "SITES",
  },
  {
    name: "SINUSITIS AT FOLLOW UP BY PRE-OP SINUS DISEASE",
    value: "sinusitisAtFollowUpVsPreOpSinusDisease",
    type: "SITES",
  },
  {
    name: "SINUSITIS AT FOLLOW UP BY PRE-OP SINUS DISEASE MANAGEMENT",
    value: "sinusitisAtFollowUpVSPreOpSinusDiseaseManagement",
    type: "SITES",
  },
];
export const filterReportOptions = {
  surveyVsArchCondition: [
    {
      id: "patientSatisfactionAesthetic",
      value: {
        value: [],
        toValue: [],
        condition: "hasAValue",
        operation: "OR",
      },
    },
    {
      id: "patientSatisfactionFunction",
      value: {
        value: [],
        toValue: [],
        condition: "hasAValue",
        operation: "OR",
      },
    },
    {
      id: "patientSatisfactionTreatment",
      value: {
        value: [],
        toValue: [],
        condition: "hasAValue",
        operation: "OR",
      },
    },
    {
      id: "patientSatisfactionMaintenance",
      value: {
        value: [],
        toValue: [],
        condition: "hasAValue",
        operation: "OR",
      },
    },
    {
      id: "postOpPain",
      value: {
        value: [],
        toValue: [],
        condition: "hasAValue",
        operation: "",
      },
    },
  ],
  surveyVsOpposingArch: [
    {
      id: "patientSatisfactionAesthetic",
      value: {
        value: [],
        toValue: [],
        condition: "hasAValue",
        operation: "OR",
      },
    },
    {
      id: "patientSatisfactionFunction",
      value: {
        value: [],
        toValue: [],
        condition: "hasAValue",
        operation: "OR",
      },
    },
    {
      id: "patientSatisfactionTreatment",
      value: {
        value: [],
        toValue: [],
        condition: "hasAValue",
        operation: "OR",
      },
    },
    {
      id: "patientSatisfactionMaintenance",
      value: {
        value: [],
        toValue: [],
        condition: "hasAValue",
        operation: "OR",
      },
    },
    {
      id: "postOpPain",
      value: {
        value: [],
        toValue: [],
        condition: "hasAValue",
        operation: "",
      },
    },
  ],
  surveyVsTotalImplants: [
    {
      id: "patientSatisfactionAesthetic",
      value: {
        value: [],
        toValue: [],
        condition: "hasAValue",
        operation: "OR",
      },
    },
    {
      id: "patientSatisfactionFunction",
      value: {
        value: [],
        toValue: [],
        condition: "hasAValue",
        operation: "OR",
      },
    },
    {
      id: "patientSatisfactionTreatment",
      value: {
        value: [],
        toValue: [],
        condition: "hasAValue",
        operation: "OR",
      },
    },
    {
      id: "patientSatisfactionMaintenance",
      value: {
        value: [],
        toValue: [],
        condition: "hasAValue",
        operation: "OR",
      },
    },
    {
      id: "postOpPain",
      value: {
        value: [],
        toValue: [],
        condition: "hasAValue",
        operation: "",
      },
    },
  ],
  surveyVsZygomaImplants: [
    {
      id: "patientSatisfactionAesthetic",
      value: {
        value: [],
        toValue: [],
        condition: "hasAValue",
        operation: "OR",
      },
    },
    {
      id: "patientSatisfactionFunction",
      value: {
        value: [],
        toValue: [],
        condition: "hasAValue",
        operation: "OR",
      },
    },
    {
      id: "patientSatisfactionTreatment",
      value: {
        value: [],
        toValue: [],
        condition: "hasAValue",
        operation: "OR",
      },
    },
    {
      id: "patientSatisfactionMaintenance",
      value: {
        value: [],
        toValue: [],
        condition: "hasAValue",
        operation: "OR",
      },
    },
    {
      id: "postOpPain",
      value: {
        value: [],
        toValue: [],
        condition: "hasAValue",
        operation: "",
      },
    },
  ],
  numberOfImplantsAll: [
    {
      id: "regularImplants",
      value: {
        value: [1],
        toValue: [],
        condition: "isGreaterThanOrEquals",
        operation: "OR",
      },
    },
    {
      id: "zygomaImplants",
      value: {
        value: [1],
        toValue: [],
        condition: "isGreaterThanOrEquals",
        operation: "AND",
      },
    },
    // {
    //   id: "totalImplants",
    //   value: {
    //     value: [3],
    //     toValue: [],
    //     condition: "isGreaterThan",
    //     operation: "",
    //   },
    // },
  ],
  numberOfImplantsZygoma: [
    {
      id: "regularImplants",
      value: {
        value: [1],
        toValue: [],
        condition: "isGreaterThanOrEquals",
        operation: "OR",
      },
    },
    {
      id: "zygomaImplants",
      value: {
        value: [1],
        toValue: [],
        condition: "isGreaterThanOrEquals",
        operation: "AND",
      },
    },
  ],
  numberOfImplantsRegular: [
    {
      id: "regularImplants",
      value: {
        value: [1],
        toValue: [],
        condition: "isGreaterThanOrEquals",
        operation: "OR",
      },
    },
    {
      id: "zygomaImplants",
      value: {
        value: [1],
        toValue: [],
        condition: "isGreaterThanOrEquals",
        operation: "AND",
      },
    },
  ],
  conformanceVsArchConditionEdentulous: [
    {
      id: "upperArchCondition",
      value: {
        value: [
          {
            value: "Edentulous",
            label: "Edentulous",
          },
        ],
        toValue: [],
        condition: "isOneOf",
        operation: "",
      },
    },
  ],
  conformanceVsArchConditionOther: [
    {
      id: "upperArchCondition",
      value: {
        value: [
          {
            value: "Edentulous",
            label: "Edentulous",
          },
        ],
        toValue: [],
        condition: "isNotOneOf",
        operation: "",
      },
    },
  ],

  placementDistribution: [
    {
      id: "placement",
      value: {
        value: [],
        toValue: [],
        condition: "hasAValue",
        operation: "",
      },
    },
  ],
  immediacy: [
    {
      id: "dateOfInsertion",
      value: {
        value: [],
        toValue: [],
        condition: "hasAValue",
        operation: "AND",
      },
    },
    {
      id: "recordTreatmentDate",
      value: {
        value: [],
        toValue: [],
        condition: "hasAValue",
        operation: "",
      },
    },
  ],
  timeToImmediateFinalTeeth: [
    {
      id: "dateOfInsertion",
      value: {
        value: [],
        toValue: [],
        condition: "hasAValue",
        operation: "AND",
      },
    },
    {
      id: "recordTreatmentDate",
      value: {
        value: [],
        toValue: [],
        condition: "hasAValue",
        operation: "",
      },
    },
  ],
  caseSuccessRate: [
    // {
    //   id: "performanceOverFollowUpPeriod",
    //   value: {
    //     value: [],
    //     toValue: [],
    //     condition: "hasAValue",
    //     operation: "",
    //   },
    // },
    {
      id: "implantFunctionAtFollowUp",
      value: {
        value: [],
        toValue: [],
        condition: "hasAValue",
        operation: "AND",
      },
    },
    {
      id: "implantLine",
      value: {
        value: [],
        toValue: [],
        condition: "hasAValue",
        operation: "",
      },
    },
  ],
  complicationsReportByImplantType: [
    // {
    //   id: "performanceOverFollowUpPeriod",
    //   value: {
    //     value: [],
    //     toValue: [],
    //     condition: "hasAValue",
    //     operation: "AND",
    //   },
    // },
    {
      id: "implantFunctionAtFollowUp",
      value: {
        value: [],
        toValue: [],
        condition: "hasAValue",
        operation: "AND",
      },
    },
    {
      id: "implantLine",
      value: {
        value: [],
        toValue: [],
        condition: "hasAValue",
        operation: "",
      },
    },
  ],
  complicationsReportByDiagnosisAetiology: [
    {
      id: "implantFunctionAtFollowUp",
      value: {
        value: [
          {
            value: "Yes",
            label: "Yes",
          },
          {
            value: "No (failed)",
            label: "No (failed)",
          },
          {
            value: "Sleeper",
            label: "Sleeper",
          },
        ],
        toValue: [],
        condition: "isOneOf",
        operation: "AND",
      },
    },
    {
      id: "diagnosisOrAetiology",
      value: {
        value: [
          {
            value: "Trauma",
            label: "Trauma",
          },
          {
            value: "Gum Disease",
            label: "Gum Disease",
          },
          {
            value: "Occlusal Wear or Trauma",
            label: "Occlusal Wear or Trauma",
          },
          {
            value: "Caries",
            label: "Caries",
          },
        ],
        toValue: [],
        condition: "isOneOf",
        operation: "",
      },
    },
  ],
  complicationsReportByBruxism: [
    {
      id: "implantFunctionAtFollowUp",
      value: {
        value: [
          {
            value: "Yes",
            label: "Yes",
          },
          {
            value: "No (failed)",
            label: "No (failed)",
          },
          {
            value: "Sleeper",
            label: "Sleeper",
          },
        ],
        toValue: [],
        condition: "isOneOf",
        operation: "AND",
      },
    },
    {
      id: "bruxism",
      value: {
        value: [
          {
            value: "Advanced Bruxism",
            label: "Advanced Bruxism",
          },
          {
            value: "Moderate or At Risk",
            label: "Moderate or At Risk",
          },
          {
            value: "Mild Signs",
            label: "Mild Signs",
          },
          {
            value: "Not Present",
            label: "Not Present",
          },
        ],
        toValue: [],
        condition: "isOneOf",
        operation: "",
      },
    },
  ],
  complicationsReportByHygiene: [
    {
      id: "implantFunctionAtFollowUp",
      value: {
        value: [
          {
            value: "Yes",
            label: "Yes",
          },
          {
            value: "No (failed)",
            label: "No (failed)",
          },
          {
            value: "Sleeper",
            label: "Sleeper",
          },
        ],
        toValue: [],
        condition: "isOneOf",
        operation: "AND",
      },
    },
    {
      id: "oralHygiene",
      value: {
        value: [
          {
            value: "Poor",
            label: "Poor",
          },
          {
            value: "Excellent",
            label: "Excellent",
          },
          {
            value: "Reasonable",
            label: "Reasonable",
          },
          {
            value: "Very Poor",
            label: "Very Poor",
          },
        ],
        toValue: [],
        condition: "isOneOf",
        operation: "",
      },
    },
  ],
  complicationsReportBySmoking: [
    {
      id: "implantFunctionAtFollowUp",
      value: {
        value: [
          {
            value: "Yes",
            label: "Yes",
          },
          {
            value: "No (failed)",
            label: "No (failed)",
          },
          {
            value: "Sleeper",
            label: "Sleeper",
          },
        ],
        toValue: [],
        condition: "isOneOf",
        operation: "AND",
      },
    },
    {
      id: "smoking",
      value: {
        value: [],
        toValue: [],
        condition: "hasAValue",
        operation: "",
      },
    },
  ],
  inflammationVsImplantType: [
    {
      id: "inflammation",
      value: {
        value: [
          {
            value: "Yes",
            label: "Yes",
          },
          {
            value: "No",
            label: "No",
          },
        ],
        toValue: [],
        condition: "isOneOf",
        operation: "AND",
      },
    },
    {
      id: "implantLine",
      value: {
        value: [],
        toValue: [],
        condition: "hasAValue",
        operation: "",
      },
    },
  ],
  inflammationVsDiagnosisAetiology: [
    {
      id: "inflammation",
      value: {
        value: [
          {
            value: "Yes",
            label: "Yes",
          },
          {
            value: "No",
            label: "No",
          },
          // {
          //   value: "Unknown",
          //   label: "Unknown",
          // },
        ],
        toValue: [],
        condition: "isOneOf",
        operation: "AND",
      },
    },
    {
      id: "diagnosisOrAetiology",
      value: {
        value: [
          {
            value: "Trauma",
            label: "Trauma",
          },
          {
            value: "Gum Disease",
            label: "Gum Disease",
          },
          {
            value: "Occlusal Wear or Trauma",
            label: "Occlusal Wear or Trauma",
          },
          {
            value: "Caries",
            label: "Caries",
          },
        ],
        toValue: [],
        condition: "isOneOf",
        operation: "",
      },
    },
  ],
  inflammationVsBruxism: [
    {
      id: "inflammation",
      value: {
        value: [
          {
            value: "Yes",
            label: "Yes",
          },
          {
            value: "No",
            label: "No",
          },
        ],
        toValue: [],
        condition: "isOneOf",
        operation: "AND",
      },
    },
    {
      id: "bruxism",
      value: {
        value: [
          {
            value: "Advanced Bruxism",
            label: "Advanced Bruxism",
          },
          {
            value: "Moderate or At Risk",
            label: "Moderate or At Risk",
          },
          {
            value: "Mild Signs",
            label: "Mild Signs",
          },
          {
            value: "Not Present",
            label: "Not Present",
          },
        ],
        toValue: [],
        condition: "isOneOf",
        operation: "",
      },
    },
  ],
  inflammationVsHygiene: [
    {
      id: "inflammation",
      value: {
        value: [
          {
            value: "Yes",
            label: "Yes",
          },
          {
            value: "No",
            label: "No",
          },
        ],
        toValue: [],
        condition: "isOneOf",
        operation: "AND",
      },
    },
    {
      id: "oralHygiene",
      value: {
        value: [
          {
            value: "Poor",
            label: "Poor",
          },
          {
            value: "Excellent",
            label: "Excellent",
          },
          {
            value: "Reasonable",
            label: "Reasonable",
          },
          {
            value: "Very Poor",
            label: "Very Poor",
          },
        ],
        toValue: [],
        condition: "isOneOf",
        operation: "",
      },
    },
  ],
  recessionVsImplantType: [
    {
      id: "recession",
      value: {
        value: [
          {
            value: "None",
            label: "None",
          },
          {
            value: "Minor (Abutment Only)",
            label: "Minor (Abutment Only)",
          },
          {
            value: "Moderate (Implant Collar)",
            label: "Moderate (Implant Collar)",
          },
          {
            value: "Advanced (Shaft)",
            label: "Advanced (Shaft)",
          },
        ],
        toValue: [],
        condition: "isOneOf",
        operation: "AND",
      },
    },
    {
      id: "implantLine",
      value: {
        value: [],
        toValue: [],
        condition: "hasAValue",
        operation: "",
      },
    },
  ],
  recessionVsDiagnosisAetiology: [
    {
      id: "recession",
      value: {
        value: [
          {
            value: "None",
            label: "None",
          },
          {
            value: "Minor (Abutment Only)",
            label: "Minor (Abutment Only)",
          },
          {
            value: "Moderate (Implant Collar)",
            label: "Moderate (Implant Collar)",
          },
          {
            value: "Advanced (Shaft)",
            label: "Advanced (Shaft)",
          },
        ],
        toValue: [],
        condition: "isOneOf",
        operation: "AND",
      },
    },
    {
      id: "diagnosisOrAetiology",
      value: {
        value: [
          {
            value: "Trauma",
            label: "Trauma",
          },
          {
            value: "Gum Disease",
            label: "Gum Disease",
          },
          {
            value: "Occlusal Wear or Trauma",
            label: "Occlusal Wear or Trauma",
          },
          {
            value: "Caries",
            label: "Caries",
          },
        ],
        toValue: [],
        condition: "isOneOf",
        operation: "",
      },
    },
  ],
  recessionVsBruxism: [
    {
      id: "recession",
      value: {
        value: [
          {
            value: "None",
            label: "None",
          },
          {
            value: "Minor (Abutment Only)",
            label: "Minor (Abutment Only)",
          },
          {
            value: "Moderate (Implant Collar)",
            label: "Moderate (Implant Collar)",
          },
          {
            value: "Advanced (Shaft)",
            label: "Advanced (Shaft)",
          },
        ],
        toValue: [],
        condition: "isOneOf",
        operation: "AND",
      },
    },
    {
      id: "bruxism",
      value: {
        value: [
          {
            value: "Advanced Bruxism",
            label: "Advanced Bruxism",
          },
          {
            value: "Moderate or At Risk",
            label: "Moderate or At Risk",
          },
          {
            value: "Mild Signs",
            label: "Mild Signs",
          },
          {
            value: "Not Present",
            label: "Not Present",
          },
        ],
        toValue: [],
        condition: "isOneOf",
        operation: "",
      },
    },
  ],
  recessionVsHygiene: [
    {
      id: "recession",
      value: {
        value: [
          {
            value: "None",
            label: "None",
          },
          {
            value: "Minor (Abutment Only)",
            label: "Minor (Abutment Only)",
          },
          {
            value: "Moderate (Implant Collar)",
            label: "Moderate (Implant Collar)",
          },
          {
            value: "Advanced (Shaft)",
            label: "Advanced (Shaft)",
          },
        ],
        toValue: [],
        condition: "isOneOf",
        operation: "AND",
      },
    },
    {
      id: "oralHygiene",
      value: {
        value: [
          {
            value: "Poor",
            label: "Poor",
          },
          {
            value: "Excellent",
            label: "Excellent",
          },
          {
            value: "Reasonable",
            label: "Reasonable",
          },
          {
            value: "Very Poor",
            label: "Very Poor",
          },
        ],
        toValue: [],
        condition: "isOneOf",
        operation: "",
      },
    },
  ],
  midShaftDehiscenceVsImplantType: [
    {
      id: "midShaftSoftTissueDehiscence",
      value: {
        value: [
          {
            value: "Yes",
            label: "Yes",
          },
          {
            value: "No",
            label: "No",
          },
        ],
        toValue: [],
        condition: "isOneOf",
        operation: "AND",
      },
    },
    {
      id: "implantLine",
      value: {
        value: [],
        toValue: [],
        condition: "hasAValue",
        operation: "",
      },
    },
  ],
  midShaftDehiscenceVsDiagnosisAetiology: [
    {
      id: "midShaftSoftTissueDehiscence",
      value: {
        value: [
          {
            value: "Yes",
            label: "Yes",
          },
          {
            value: "No",
            label: "No",
          },
        ],
        toValue: [],
        condition: "isOneOf",
        operation: "AND",
      },
    },
    {
      id: "diagnosisOrAetiology",
      value: {
        value: [
          {
            value: "Trauma",
            label: "Trauma",
          },
          {
            value: "Gum Disease",
            label: "Gum Disease",
          },
          {
            value: "Occlusal Wear or Trauma",
            label: "Occlusal Wear or Trauma",
          },
          {
            value: "Caries",
            label: "Caries",
          },
        ],
        toValue: [],
        condition: "isOneOf",
        operation: "",
      },
    },
  ],
  midShaftDehiscenceVsBruxism: [
    {
      id: "midShaftSoftTissueDehiscence",
      value: {
        value: [
          {
            value: "Yes",
            label: "Yes",
          },
          {
            value: "No",
            label: "No",
          },
        ],
        toValue: [],
        condition: "isOneOf",
        operation: "AND",
      },
    },
    {
      id: "bruxism",
      value: {
        value: [
          {
            value: "Advanced Bruxism",
            label: "Advanced Bruxism",
          },
          {
            value: "Moderate or At Risk",
            label: "Moderate or At Risk",
          },
          {
            value: "Mild Signs",
            label: "Mild Signs",
          },
          {
            value: "Not Present",
            label: "Not Present",
          },
        ],
        toValue: [],
        condition: "isOneOf",
        operation: "",
      },
    },
  ],
  midShaftDehiscenceVsHygiene: [
    {
      id: "midShaftSoftTissueDehiscence",
      value: {
        value: [
          {
            value: "Yes",
            label: "Yes",
          },
          {
            value: "No",
            label: "No",
          },
        ],
        toValue: [],
        condition: "isOneOf",
        operation: "AND",
      },
    },
    {
      id: "oralHygiene",
      value: {
        value: [
          {
            value: "Poor",
            label: "Poor",
          },
          {
            value: "Excellent",
            label: "Excellent",
          },
          {
            value: "Reasonable",
            label: "Reasonable",
          },
          {
            value: "Very Poor",
            label: "Very Poor",
          },
        ],
        toValue: [],
        condition: "isOneOf",
        operation: "",
      },
    },
  ],
  suppurationVsImplantType: [
    {
      id: "suppuration",
      value: {
        value: [],
        toValue: [],
        condition: "hasAValue",
        operation: "AND",
      },
    },
    {
      id: "implantType",
      value: {
        value: [],
        toValue: [],
        condition: "hasAValue",
        operation: "",
      },
    },
  ],
  sinusitisAtFollowUpVsPreOpSinusDisease: [
    {
      id: "sinusitis",
      value: {
        value: [
          {
            value: "Yes",
            label: "Yes",
          },
          {
            value: "No",
            label: "No",
          },
        ],
        toValue: [],
        condition: "isOneOf",
        operation: "AND",
      },
    },
    {
      id: "preOperativeSinusDisease",
      value: {
        value: [],
        toValue: [],
        condition: "hasAValue",
        operation: "",
      },
    },
  ],
  sinusitisAtFollowUpVSPreOpSinusDiseaseManagement: [
    {
      id: "sinusitis",
      value: {
        value: [
          {
            value: "Yes",
            label: "Yes",
          },
          {
            value: "No",
            label: "No",
          },
        ],
        toValue: [],
        condition: "isOneOf",
        operation: "AND",
      },
    },
    {
      id: "preOperativeSinusDiseaseManagement",
      value: {
        value: [],
        toValue: [],
        condition: "hasAValue",
        operation: "",
      },
    },
  ],
};
export const chartStatusOptions = [
  { name: "In Draft", value: "created" },
  { name: "Issued To Patient", value: "sentToPatient" },
  { name: "Approved By Patient", value: "approved" },
  { name: "Unapproved", value: "unapproved" },
  { name: "Revoked", value: "revoked" },
];

export const customTreatmentGroupsData = [
  {
    id: "sleepDentistry_0",
    groupTitleParent: `Sleep Dentistry`,

    items: [
      {
        visitNumber: 1,
        groupTitle:
          "Dental treatment (outlined separately) under General Anaesthetic",
        addOn: true,
        items: [],
      },
      {
        visitNumber: 1,
        groupTitle: "Removal of wisdom teeth",
        addOn: true,
        items: [
          {
            id: "1_324",
            toothValue: "none",
            visitNumber: 1,

            groupTitle: "Removal of wisdom teeth",
            treatmentItemNumber: "324",
            treatmentItemTitle: "",
            treatmentFriendlyName: "",
            treatmentItemDescription: "",
            cost: "500",
            medicare: "0",
            vetAffairs: "0",
            vgds: "0",
          },
          {
            id: "2_324",
            toothValue: "none",
            visitNumber: 1,

            groupTitle: "Removal of wisdom teeth",
            treatmentItemNumber: "324",
            treatmentItemTitle: "",
            treatmentFriendlyName: "",
            treatmentItemDescription: "",
            cost: "500",
            medicare: "0",
            vetAffairs: "0",
            vgds: "0",
          },
          {
            id: "3_324",
            toothValue: "none",
            visitNumber: 1,

            groupTitle: "Removal of wisdom teeth",
            treatmentItemNumber: "324",
            treatmentItemTitle: "",
            treatmentFriendlyName: "",
            treatmentItemDescription: "",
            cost: "500",
            medicare: "0",
            vetAffairs: "0",
            vgds: "0",
          },
          {
            id: "4_324",
            toothValue: "none",
            visitNumber: 1,

            groupTitle: "Removal of wisdom teeth",
            treatmentItemNumber: "324",
            treatmentItemTitle: "",
            treatmentFriendlyName: "",
            treatmentItemDescription: "",
            cost: "500",
            medicare: "0",
            vetAffairs: "0",
            vgds: "0",
          },
        ],
      },
    ],
  },
  {
    id: "generalDentistry_0",
    groupTitleParent: `Root Canal`,

    items: [
      {
        visitNumber: 1,
        groupTitle: "1 Root",
        addOn: true,
        items: [
          {
            id: "0_22",
            toothValue: "none",

            visitNumber: 1,
            groupTitle: "1 Root",
            treatmentItemNumber: "022",
            treatmentItemTitle: "Intraoral radiograph – per exposure",
            treatmentFriendlyName: "Intra Oral periapical x-ray",
            treatmentItemDescription:
              "Taking and interpreting an intraoral radiograph.",
            cost: "60",
            medicare: "26",
            vetAffairs: "42.1",
            vgds: "24.45",
          },
          {
            id: "0_415",
            toothValue: "none",

            visitNumber: 1,
            groupTitle: "1 Root",
            treatmentItemNumber: "415",
            treatmentItemTitle:
              "Complete chemo-mechanical preparation of root canal – one canal",
            treatmentFriendlyName: "Compl chemo-mech prep root canal 1",
            treatmentItemDescription:
              "Complete chemo-mechanical preparation, including removal of pulp or necrotic debris from a canal.",
            cost: "300",
            medicare: "115",
            vetAffairs: "230",
            vgds: "130.9",
          },
          {
            id: "0_417",
            toothValue: "none",

            visitNumber: 1,
            groupTitle: "1 Root",
            treatmentItemNumber: "417",
            treatmentItemTitle: "Root canal obturation – one canal",
            treatmentFriendlyName: "Root canal obturation - 1 canal",
            treatmentItemDescription:
              "The filling of a root canal, following chemo-mechanical preparation.",
            cost: "300",
            medicare: "148",
            vetAffairs: "224.1",
            vgds: "106.05",
          },
          {
            id: "0_521",
            toothValue: "none",
            visitNumber: 1,
            groupTitle: "1 Root",

            treatmentItemNumber: "521",
            treatmentItemTitle:
              "Adhesive restoration – one surface – anterior tooth – direct",
            treatmentFriendlyName: "Adhesive restoration -1 surf - anterior",
            treatmentItemDescription:
              "Direct restoration, using an adhesive technique and a tooth-coloured material, involving one surface of an anterior tooth.",
            cost: "230",
            medicare: "65",
            vetAffairs: "123.95",
            vgds: "65.5",
          },
          {
            id: "0_531",
            toothValue: "none",
            visitNumber: 1,
            groupTitle: "1 Root",

            treatmentItemNumber: "531",
            treatmentItemTitle:
              "Adhesive restoration – one surface – posterior tooth – direct",
            treatmentFriendlyName: "Adhesive restoration -1 surf - posterior",
            treatmentItemDescription:
              "Direct restoration, using an adhesive technique and a tooth-coloured material, involving one surface of a posterior tooth.",
            cost: "230",
            medicare: "68",
            vetAffairs: "132.5",
            vgds: "69.2",
          },
        ],
      },
      {
        visitNumber: 1,
        groupTitle: "2 Root",
        addOn: true,
        items: [
          {
            id: "1_22",
            toothValue: "none",
            visitNumber: 1,

            groupTitle: "2 Root",
            treatmentItemNumber: "022",
            treatmentItemTitle: "Intraoral radiograph – per exposure",
            treatmentFriendlyName: "Intra Oral periapical x-ray",
            treatmentItemDescription:
              "Taking and interpreting an intraoral radiograph.",
            cost: "60",
            medicare: "26",
            vetAffairs: "42.1",
            vgds: "24.45",
          },
          {
            id: "1_415",
            toothValue: "none",
            visitNumber: 1,
            groupTitle: "2 Root",

            treatmentItemNumber: "415",
            treatmentItemTitle:
              "Complete chemo-mechanical preparation of root canal – one canal",
            treatmentFriendlyName: "Compl chemo-mech prep root canal 1",
            treatmentItemDescription:
              "Complete chemo-mechanical preparation, including removal of pulp or necrotic debris from a canal.",
            cost: "300",
            medicare: "115",
            vetAffairs: "230",
            vgds: "130.9",
          },
          {
            id: "1_416",
            toothValue: "none",
            visitNumber: 1,

            groupTitle: "2 Root",
            treatmentItemNumber: "416",
            treatmentItemTitle:
              "Complete chemo-mechanical preparation of root canal – each additional canal",
            treatmentFriendlyName: "Compl chemo-mech prep root canal add",
            treatmentItemDescription:
              "Complete chemo-mechanical preparation, including removal of pulp or necrotic debris from each additional canal of a tooth with multiple canals.",
            cost: "200",
            medicare: "46",
            vetAffairs: "109.6",
            vgds: "45.35",
          },
          {
            id: "1_417",
            toothValue: "none",
            visitNumber: 1,
            groupTitle: "2 Root",

            treatmentItemNumber: "417",
            treatmentItemTitle: "Root canal obturation – one canal",
            treatmentFriendlyName: "Root canal obturation - 1 canal",
            treatmentItemDescription:
              "The filling of a root canal, following chemo-mechanical preparation.",
            cost: "300",
            medicare: "148",
            vetAffairs: "224.1",
            vgds: "106.05",
          },
          {
            id: "1_418",
            toothValue: "none",
            visitNumber: 1,
            groupTitle: "2 Root",

            treatmentItemNumber: "418",
            treatmentItemTitle: "Root canal obturation – each additional canal",
            treatmentFriendlyName: "Root canal obturation - each add",
            treatmentItemDescription:
              "The filling, following chemo-mechanical preparation, of each additional canal in a tooth with multiple canals.",
            cost: "200",
            medicare: "52",
            vetAffairs: "104.8",
            vgds: "25.15",
          },
        ],
      },
      {
        visitNumber: 1,
        groupTitle: "3 Root",
        addOn: true,
        items: [
          {
            id: "2_22",
            toothValue: "none",
            visitNumber: 1,
            groupTitle: "3 Root",

            treatmentItemNumber: "022",
            treatmentItemTitle: "Intraoral radiograph – per exposure",
            treatmentFriendlyName: "Intra Oral periapical x-ray",
            treatmentItemDescription:
              "Taking and interpreting an intraoral radiograph.",
            cost: "60",
            medicare: "26",
            vetAffairs: "42.1",
            vgds: "24.45",
            discount: "0",
          },
          {
            id: "2_415",
            toothValue: "none",
            visitNumber: 1,
            groupTitle: "3 Root",

            treatmentItemNumber: "415",
            treatmentItemTitle:
              "Complete chemo-mechanical preparation of root canal – one canal",
            treatmentFriendlyName: "Compl chemo-mech prep root canal 1",
            treatmentItemDescription:
              "Complete chemo-mechanical preparation, including removal of pulp or necrotic debris from a canal.",
            cost: "300",
            medicare: "115",
            vetAffairs: "230",
            vgds: "130.9",
            discount: "0",
          },
          {
            id: "2_0_416",
            toothValue: "none",
            visitNumber: 1,
            groupTitle: "3 Root",

            treatmentItemNumber: "416",
            treatmentItemTitle:
              "Complete chemo-mechanical preparation of root canal – each additional canal",
            treatmentFriendlyName: "Compl chemo-mech prep root canal add",
            treatmentItemDescription:
              "Complete chemo-mechanical preparation, including removal of pulp or necrotic debris from each additional canal of a tooth with multiple canals.",
            cost: "200",
            medicare: "46",
            vetAffairs: "109.6",
            vgds: "45.35",
            discount: "0",
          },
          {
            id: "2_1_416",
            toothValue: "none",
            visitNumber: 1,
            groupTitle: "3 Root",

            treatmentItemNumber: "416",
            treatmentItemTitle:
              "Complete chemo-mechanical preparation of root canal – each additional canal",
            treatmentFriendlyName: "Compl chemo-mech prep root canal add",
            treatmentItemDescription:
              "Complete chemo-mechanical preparation, including removal of pulp or necrotic debris from each additional canal of a tooth with multiple canals.",
            cost: "200",
            medicare: "46",
            vetAffairs: "109.6",
            vgds: "45.35",
            discount: "0",
          },
          {
            id: "2_417",
            visitNumber: 1,
            groupTitle: "3 Root",

            toothValue: "none",
            treatmentItemNumber: "417",
            treatmentItemTitle: "Root canal obturation – one canal",
            treatmentFriendlyName: "Root canal obturation - 1 canal",
            treatmentItemDescription:
              "The filling of a root canal, following chemo-mechanical preparation.",
            cost: "300",
            medicare: "148",
            vetAffairs: "224.1",
            vgds: "106.05",
            discount: "0",
          },
          {
            id: "2_0_418",
            toothValue: "none",
            visitNumber: 1,
            groupTitle: "3 Root",

            treatmentItemNumber: "418",
            treatmentItemTitle: "Root canal obturation – each additional canal",
            treatmentFriendlyName: "Root canal obturation - each add",
            treatmentItemDescription:
              "The filling, following chemo-mechanical preparation, of each additional canal in a tooth with multiple canals.",
            cost: "200",
            medicare: "52",
            vetAffairs: "104.8",
            vgds: "25.15",
            discount: "0",
          },
          {
            id: "2_1_418",
            toothValue: "none",
            visitNumber: 1,
            groupTitle: "3 Root",

            treatmentItemNumber: "418",
            treatmentItemTitle: "Root canal obturation – each additional canal",
            treatmentFriendlyName: "Root canal obturation - each add",
            treatmentItemDescription:
              "The filling, following chemo-mechanical preparation, of each additional canal in a tooth with multiple canals.",
            cost: "200",
            medicare: "52",
            vetAffairs: "104.8",
            vgds: "25.15",
            discount: "0",
          },
        ],
        addOns: [
          {
            id: "0_521",
            toothValue: "none",
            visitNumber: 1,
            groupTitle: "3 Root",

            treatmentItemNumber: "521",
            treatmentItemTitle:
              "Adhesive restoration – one surface – anterior tooth – direct",
            treatmentFriendlyName: "Adhesive restoration -1 surf - anterior",
            treatmentItemDescription:
              "Direct restoration, using an adhesive technique and a tooth-coloured material, involving one surface of an anterior tooth.",
            cost: "230",
            medicare: "65",
            vetAffairs: "123.95",
            vgds: "65.5",
          },
          {
            id: "0_531",
            toothValue: "none",
            visitNumber: 1,
            groupTitle: "3 Root",

            treatmentItemNumber: "531",
            treatmentItemTitle:
              "Adhesive restoration – one surface – posterior tooth – direct",
            treatmentFriendlyName: "Adhesive restoration -1 surf - posterior",
            treatmentItemDescription:
              "Direct restoration, using an adhesive technique and a tooth-coloured material, involving one surface of a posterior tooth.",
            cost: "230",
            medicare: "68",
            vetAffairs: "132.5",
            vgds: "69.2",
          },
        ],
      },
    ],
  },
  {
    id: "generalDentistry_1",
    groupTitleParent: `Teeth Whitening`,

    items: [
      {
        visitNumber: 1,
        groupTitle: "Whitening - Take Home & In Chair",
        addOn: true,
        items: [
          ...Array.from({ length: 20 }, (_, i) => ({
            id: `0_${i}_118`,
            toothValue: "none",
            visitNumber: 1,
            groupTitle: "Whitening - Take Home & In Chair",

            treatmentItemNumber: "118",
            treatmentItemTitle: "Bleaching, external – per tooth",
            treatmentFriendlyName: "Bleaching. extern - per tooth",
            treatmentItemDescription:
              "Modification of the color of a tooth using chemical and/or physical methods applied externally.",
            cost: "50",
            medicare: "0",
            vetAffairs: "0",
            vgds: "0",
            discount: "0",
          })),
          {
            id: "0_0_119",
            toothValue: "none",
            visitNumber: 1,
            groupTitle: "Whitening - Take Home & In Chair",

            treatmentItemNumber: "119",
            treatmentItemTitle: "Bleaching, home application",
            treatmentFriendlyName:
              "Bleaching, external - per tooth Bleaching, home applic - per arch",
            treatmentItemDescription:
              "Provision of clinical advice, risk advice, use instructions, and necessary professional supervision for application by a patient at home.",
            cost: "100",
            medicare: "0",
            vetAffairs: "0",
            vgds: "0",
          },
          {
            id: "0_1_119",
            toothValue: "none",
            visitNumber: 1,
            groupTitle: "Whitening - Take Home & In Chair",

            treatmentItemNumber: "119",
            treatmentItemTitle: "Bleaching, home application",
            treatmentFriendlyName:
              "Bleaching, external - per tooth Bleaching, home applic - per arch",
            treatmentItemDescription:
              "Provision of clinical advice, risk advice, use instructions, and necessary professional supervision for application by a patient at home.",
            cost: "100",
            medicare: "0",
            vetAffairs: "0",
            vgds: "0",
          },
          {
            id: "0_0_926",
            toothValue: "none",
            visitNumber: 1,
            groupTitle: "Whitening - Take Home & In Chair",

            treatmentItemNumber: "926",
            treatmentItemTitle: "Individually made tray – medicament(s)",
            treatmentFriendlyName: "Indivdiually made tray medicaments",
            treatmentItemDescription:
              "A tray made for the application of medicaments to the teeth or supporting tissues.",
            cost: "190",
            medicare: "0",
            vetAffairs: "170.25",
            vgds: "0",
          },
          {
            id: "0_1_926",
            toothValue: "none",
            visitNumber: 1,
            groupTitle: "Whitening - Take Home & In Chair",

            treatmentItemNumber: "926",
            treatmentItemTitle: "Individually made tray – medicament(s)",
            treatmentFriendlyName: "Indivdiually made tray medicaments",
            treatmentItemDescription:
              "A tray made for the application of medicaments to the teeth or supporting tissues.",
            cost: "190",
            medicare: "0",
            vetAffairs: "170.25",
            vgds: "0",
          },
          {
            id: "0_927",
            toothValue: "none",
            visitNumber: 1,
            groupTitle: "Whitening - Take Home & In Chair",

            treatmentItemNumber: "927",
            treatmentItemTitle: "Provision of medication/medicament",
            treatmentFriendlyName: "Provision of medication/medicaments",
            treatmentItemDescription:
              "The supply, or administration under professional supervision, of appropriate medications and medicaments required for dental treatments.",
            cost: "0",
            medicare: "0",
            vetAffairs: "29.5",
            vgds: "0",
          },
        ],
      },
      {
        visitNumber: 1,
        addOn: true,
        groupTitle: "Whitening - In Chair",
        items: [
          ...Array.from({ length: 20 }, (_, i) => ({
            id: `1_${i}_118`,
            toothValue: "none",
            visitNumber: 1,
            groupTitle: "Whitening - In Chair",

            treatmentItemNumber: "118",
            treatmentItemTitle: "Bleaching, external – per tooth",

            treatmentFriendlyName: "Bleaching. extern - per tooth",
            treatmentItemDescription:
              "Modification of the color of a tooth using chemical and/or physical methods applied externally.",
            cost: "50",
            medicare: "0",
            vetAffairs: "0",
            vgds: "0",
            discount: "0",
          })),
          {
            id: "1_0_926",
            toothValue: "none",
            visitionNumber: 1,
            groupTitle: "Whitening - In Chair",

            treatmentItemNumber: "926",
            treatmentItemTitle: "Individually made tray – medicament(s)",
            treatmentFriendlyName: "Indivdiually made tray medicaments",
            treatmentItemDescription:
              "A tray made for the application of medicaments to the teeth or supporting tissues.",
            cost: "190",
            medicare: "0",
            vetAffairs: "170.25",
            vgds: "0",
            discount: "0",
          },
          {
            id: "1_1_926",
            toothValue: "none",
            visitNumber: 1,
            groupTitle: "Whitening - In Chair",

            treatmentItemNumber: "926",
            treatmentItemTitle: "Individually made tray – medicament(s)",
            treatmentFriendlyName: "Indivdiually made tray medicaments",
            treatmentItemDescription:
              "A tray made for the application of medicaments to the teeth or supporting tissues.",
            cost: "190",
            medicare: "0",
            vetAffairs: "170.25",
            vgds: "0",
            discount: "0",
          },
        ],
      },
      {
        visitNumber: 1,
        groupTitle: "Whitening - Take Home Kit",
        addOn: true,
        items: [
          ...Array.from({ length: 20 }, (_, i) => ({
            id: `1_${i}_118`,
            toothValue: "none",
            visitNumber: 1,
            groupTitle: "Whitening - Take Home Kit",

            treatmentItemNumber: "118",
            treatmentItemTitle: "Bleaching, external – per tooth",
            treatmentFriendlyName: "Bleaching. extern - per tooth",
            treatmentItemDescription:
              "Modification of the color of a tooth using chemical and/or physical methods applied externally.",
            cost: "50",
            medicare: "0",
            vetAffairs: "0",
            vgds: "0",
            discount: "0",
          })),
          {
            id: "2_0_926",
            toothValue: "none",
            visitNumber: 1,
            groupTitle: "Whitening - Take Home Kit",

            treatmentItemNumber: "926",
            treatmentItemTitle: "Individually made tray – medicament(s)",
            treatmentFriendlyName: "Indivdiually made tray medicaments",
            treatmentItemDescription:
              "A tray made for the application of medicaments to the teeth or supporting tissues.",
            cost: "190",
            medicare: "0",
            vetAffairs: "170.25",
            vgds: "0",
            discount: "0",
          },
          {
            id: "2_1_926",
            toothValue: "none",
            visitNumber: 1,
            groupTitle: "Whitening - Take Home Kit",

            treatmentItemNumber: "926",
            treatmentItemTitle: "Individually made tray – medicament(s)",
            treatmentFriendlyName: "Indivdiually made tray medicaments",
            treatmentItemDescription:
              "A tray made for the application of medicaments to the teeth or supporting tissues.",
            cost: "190",
            medicare: "0",
            vetAffairs: "170.25",
            vgds: "0",
            discount: "0",
          },
          {
            id: "2_927",
            toothValue: "none",
            visitNumber: 1,
            groupTitle: "Whitening - Take Home Kit",

            treatmentItemNumber: "927",
            treatmentItemTitle: "Provision of medication/medicament",
            treatmentFriendlyName: "Provision of medication/medicaments",
            treatmentItemDescription:
              "The supply, or administration under professional supervision, of appropriate medications and medicaments required for dental treatments.",
            cost: "0",
            medicare: "0",
            vetAffairs: "29.5",
            vgds: "0",
            discount: "0",
          },
        ],
      },
    ],
  },
  {
    id: "generalDentistry_2",
    groupTitleParent: `Single Implant`,

    items: [
      {
        visitNumber: 1,
        groupTitle: "Visit 1 - Placement of Implant & Exo",
        addOn: true,
        items: [
          {
            id: "0_311",
            toothValue: "none",
            visitNumber: 1,
            groupTitle: "Visit 1 - Placement of Implant & Exo",

            treatmentItemNumber: "311",
            treatmentItemTitle: "Removal of a tooth or part(s) thereof",
            treatmentFriendlyName: "Removal of tooth/part(s)",
            treatmentItemDescription:
              "A procedure consisting of the removal of a tooth or part(s) thereof.",
            cost: "300",
            medicare: "66",
            vetAffairs: "141",
            vgds: "66.7",
            discount: "0",
          },
          {
            id: "0_688",
            toothValue: "none",
            visitNumber: 1,
            groupTitle: "Visit 1 - Placement of Implant & Exo",

            treatmentItemNumber: "688",
            treatmentItemTitle:
              "Insertion of a one-stage endosseous implant – per implant",
            treatmentFriendlyName:
              "Insert 2nd stage endosseous implant (per implant)",
            treatmentItemDescription:
              "Surgical insertion of an implant, made of biocompatible material.",
            cost: "2290",
            medicare: "0",
            vetAffairs: "0",
            vgds: "0",
            discount: "0",
          },
        ],
      },
      {
        visitNumber: 2,
        groupTitle: "Visit 2 - Implant Crown (4 Month Laster)",
        addOn: true,
        items: [
          {
            id: "1_672",
            visitNumber: 2,
            groupTitle: "Visit 2 - Implant Crown (4 Month Laster)",

            toothValue: "none",
            treatmentItemNumber: "672",
            treatmentItemTitle:
              "Full crown attached to osseointegrated implant – veneered – indirect",
            treatmentFriendlyName:
              "Full Crown att Osseointegrated implant Veneered-indirect",
            treatmentItemDescription:
              "An artificial crown constructed with a metallic base veneered with a tooth-coloured material attached to an osseointegrated implant.",
            cost: "2980",
            medicare: "0",
            vetAffairs: "1634.45",
            vgds: "0",
            discount: "0",
          },
        ],
      },
    ],
  },
  {
    id: "allOn4_0",
    groupTitleParent: `Preparation & Work-up (Double Arch)`,
    items: [
      {
        visitNumber: 1,
        groupTitle: "Work-up Double Arch",
        addOn: false,
        items: [
          {
            id: "073_0",
            toothValue: "none",

            visitNumber: 1,
            groupTitle: "Work-up Double Arch",
            treatmentItemNumber: "073",
            treatmentItemTitle:
              "Photographic records – extraoral – per appointment",
            treatmentFriendlyName: "Extra Oral photographic records",
            treatmentItemDescription: "",
            cost: "2250.00",
            medicare: "0",
            vetAffairs: "0",
            vgds: "0",
            discount: "0",
          },
          {
            id: "075_0",
            toothValue: "none",

            visitNumber: 1,
            groupTitle: "Work-up Double Arch",
            treatmentItemNumber: "075",
            treatmentItemTitle: "Diagnostic modelling – digital – per tooth",
            treatmentFriendlyName: "Diagnostic Modeling",
            treatmentItemDescription: "",
            cost: "1750.00",
            medicare: "0",
            vetAffairs: "0",
            vgds: "0",
            discount: "0",
          },
        ],
      },
    ],
  },
  {
    id: "allOn4_0_1",
    groupTitleParent: `Preparation & Work-up (Single Arch)`,
    items: [
      {
        visitNumber: 1,
        groupTitle: "Work-up Single Arch",
        groupTitleParent: `Preparation & Work-up (Single Arch)`,
        addOn: false,
        items: [
          {
            id: "073_0",
            toothValue: "none",
            groupTitleParent: `Preparation & Work-up (Single Arch)`,

            visitNumber: 1,
            groupTitle: "Work-up Single Arch",
            treatmentItemNumber: "073",
            treatmentItemTitle:
              "Photographic records – extraoral – per appointment",
            treatmentFriendlyName: "Extra Oral photographic records",
            treatmentItemDescription: "",
            cost: "250.00",
            medicare: "0",
            vetAffairs: "0",
            vgds: "0",
            discount: "0",
          },
          {
            id: "075_0",
            toothValue: "none",
            groupTitleParent: `Preparation & Work-up (Single Arch)`,
            visitNumber: 1,
            groupTitle: "Work-up Single Arch",
            treatmentItemNumber: "075",
            treatmentItemTitle: "Diagnostic modelling – digital – per tooth",
            treatmentFriendlyName: "Diagnostic Modeling",
            treatmentItemDescription: "",
            cost: "1750.00",
            medicare: "0",
            vetAffairs: "0",
            vgds: "0",
            discount: "0",
          },
        ],
      },
    ],
  },
  {
    id: "allOn4_1",
    groupTitleParent: `LOWER Surgery`,
    items: [
      {
        visitNumber: 1,
        groupTitle: "LOWER Surgery",
        addOn: false,
        items: [
          {
            id: "688_0",
            visitNumber: 1,
            groupTitle: "LOWER Surgery",
            toothValue: "35",
            treatmentItemNumber: "688",
            treatmentItemTitle:
              "Insertion of a one-stage endosseous implant – per implant",
            treatmentFriendlyName:
              "Insert 2nd stage endosseous implant (per implant)",
            treatmentItemDescription: "",
            cost: "2290.00",
            discount: "29",
            medicare: "0",
            vetAffairs: "0",
            vgds: "0",
          },
          {
            id: "688_1",
            visitNumber: 1,
            groupTitle: "LOWER Surgery",
            toothValue: "32",
            treatmentItemNumber: "688",
            treatmentItemTitle:
              "Insertion of a one-stage endosseous implant – per implant",
            treatmentFriendlyName:
              "Insert 2nd stage endosseous implant (per implant)",
            treatmentItemDescription: "",
            cost: "2290.00",
            discount: "29",
            medicare: "0",
            vetAffairs: "0",
            vgds: "0",
          },
          {
            id: "688_2",
            visitNumber: 1,
            groupTitle: "LOWER Surgery",
            toothValue: "42",
            treatmentItemNumber: "688",
            treatmentItemTitle:
              "Insertion of a one-stage endosseous implant – per implant",
            treatmentFriendlyName:
              "Insert 2nd stage endosseous implant (per implant)",
            treatmentItemDescription: "",
            cost: "2290.00",
            discount: "29",
            medicare: "0",
            vetAffairs: "0",
            vgds: "0",
          },
          {
            id: "688_3",
            visitNumber: 1,
            groupTitle: "LOWER Surgery",
            toothValue: "45",
            treatmentItemNumber: "688",
            treatmentItemTitle:
              "Insertion of a one-stage endosseous implant – per implant",
            treatmentFriendlyName:
              "Insert 2nd stage endosseous implant (per implant)",
            treatmentItemDescription: "",
            cost: "2290.00",
            discount: "29",
            medicare: "0",
            vetAffairs: "0",
            vgds: "0",
          },
          {
            id: "331_0",
            toothValue: "none",
            visitNumber: 1,
            groupTitle: "LOWER Surgery",
            treatmentItemNumber: "331",
            treatmentItemTitle: "Alveoloplasty – per segment",
            treatmentFriendlyName: "Alveolectomy - per seg",
            treatmentItemDescription: "",
            cost: "1500.00",
            discount: "29",
            medicare: "0",
            vetAffairs: "0",
            vgds: "0",
          },
          {
            id: "661_0",
            toothValue: "35",
            visitNumber: 1,
            groupTitle: "LOWER Surgery",
            treatmentItemNumber: "661",
            treatmentItemTitle: "Fitting of implant abutment – per abutment",
            treatmentFriendlyName: "Fitting implant abutment - per abutment",
            treatmentItemDescription: "",
            cost: "1150.00",
            discount: "29",
            medicare: "0",
            vetAffairs: "0",
            vgds: "0",
          },
          {
            id: "661_1",
            toothValue: "32",
            visitNumber: 1,
            groupTitle: "LOWER Surgery",
            treatmentItemNumber: "661",
            treatmentItemTitle: "Fitting of implant abutment – per abutment",
            treatmentFriendlyName: "Fitting implant abutment - per abutment",
            treatmentItemDescription: "",
            cost: "1150.00",
            discount: "29",
            medicare: "0",
            vetAffairs: "0",
            vgds: "0",
          },
          {
            id: "661_2",
            toothValue: "42",
            visitNumber: 1,
            groupTitle: "LOWER Surgery",
            treatmentItemNumber: "661",
            treatmentItemTitle: "Fitting of implant abutment – per abutment",
            treatmentFriendlyName: "Fitting implant abutment - per abutment",
            treatmentItemDescription: "",
            cost: "1150.00",
            discount: "29",
            medicare: "0",
            vetAffairs: "0",
            vgds: "0",
          },
          {
            id: "661_3",
            toothValue: "45",
            visitNumber: 1,
            groupTitle: "LOWER Surgery",
            treatmentItemNumber: "661",
            treatmentItemTitle: "Fitting of implant abutment – per abutment",
            treatmentFriendlyName: "Fitting implant abutment - per abutment",
            treatmentItemDescription: "",
            cost: "1150.00",
            discount: "28",
            medicare: "0",
            vetAffairs: "0",
            vgds: "0",
          },
        ],
      },
      {
        visitNumber: 1,
        groupTitle: "Nerve Transposition",
        addOn: true,
        items: [
          {
            id: "389_0",
            visitNumber: 1,
            groupTitle: "Nerve Transposition",
            toothValue: "none",
            treatmentItemNumber: "389",
            treatmentItemTitle:
              "Surgery to isolate and preserve neurovascular tissue",
            treatmentFriendlyName:
              "Surgery to isolate/preserve neurovascular tissue",
            treatmentItemDescription:
              "Additional surgery performed at the time of dento-alveolar surgery where damage to the neurovascular bundle may occur.",
            cost: "2000.00",
            discount: "0",
            medicare: "0",
            vetAffairs: "0",
            vgds: "0",
          },
        ],
      },
      {
        visitNumber: 1,
        groupTitle: "Nerve Transposition (Bilateral)",
        addOn: true,
        items: [
          {
            id: "389_1_0",
            visitNumber: 1,
            groupTitle: "Nerve Transposition (Bilateral)",
            toothValue: "none",
            treatmentItemNumber: "389",
            treatmentItemTitle:
              "Surgery to isolate and preserve neurovascular tissue",
            treatmentFriendlyName:
              "Surgery to isolate/preserve neurovascular tissue",
            treatmentItemDescription:
              "Additional surgery performed at the time of dento-alveolar surgery where damage to the neurovascular bundle may occur.",
            cost: "2000.00",
            discount: "0",
            medicare: "0",
            vetAffairs: "0",
            vgds: "0",
          },
          {
            id: "389_1_1",
            visitNumber: 1,
            groupTitle: "Nerve Transposition (Bilateral)",
            toothValue: "none",
            treatmentItemNumber: "389",
            treatmentItemTitle:
              "Surgery to isolate and preserve neurovascular tissue",
            treatmentFriendlyName:
              "Surgery to isolate/preserve neurovascular tissue",
            treatmentItemDescription:
              "Additional surgery performed at the time of dento-alveolar surgery where damage to the neurovascular bundle may occur.",
            cost: "2000.00",
            discount: "0",
            medicare: "0",
            vetAffairs: "0",
            vgds: "0",
          },
        ],
      },
      {
        visitNumber: 1,
        groupTitle: "Lower Surgical Guide",
        addOn: true,
        items: [
          {
            id: "679_0",
            visitNumber: 1,
            groupTitle: "Lower Surgical Guide",
            toothValue: "none",
            treatmentItemNumber: "679",
            treatmentItemTitle: "Surgical Implant guide",
            treatmentFriendlyName: "Surgical Implant guide",
            treatmentItemDescription:
              "Provision of an appliance that indicates the ideal location and angulation for insertion of implants.",
            cost: "2650.00",
            discount: "0",
            medicare: "0",
            vetAffairs: "0",
            vgds: "0",
          },
        ],
      },
    ],
  },
  {
    id: "allOn4_2",
    groupTitleParent: `UPPER Surgery`,
    items: [
      {
        visitNumber: 1,
        groupTitle: "UPPER Implant Surgery",
        addOn: false,
        items: [
          {
            id: "688_upper_0",
            visitNumber: 1,
            groupTitle: "UPPER Implant Surgery",
            toothValue: "15",
            treatmentItemNumber: "688",
            treatmentItemTitle:
              "Insertion of a one-stage endosseous implant – per implant",
            treatmentFriendlyName:
              "Insert 2nd stage endosseous implant (per implant)",
            treatmentItemDescription: "",
            cost: "2290.00",
            discount: "29",
            medicare: "0",
            vetAffairs: "0",
            vgds: "0",
          },
          {
            id: "688_upper_1",
            visitNumber: 1,
            groupTitle: "UPPER Implant Surgery",
            toothValue: "12",
            treatmentItemNumber: "688",
            treatmentItemTitle:
              "Insertion of a one-stage endosseous implant – per implant",
            treatmentFriendlyName:
              "Insert 2nd stage endosseous implant (per implant)",
            treatmentItemDescription: "",
            cost: "2290.00",
            discount: "29",
            medicare: "0",
            vetAffairs: "0",
            vgds: "0",
          },
          {
            id: "688_upper_2",
            visitNumber: 1,
            groupTitle: "UPPER Implant Surgery",
            toothValue: "22",
            treatmentItemNumber: "688",
            treatmentItemTitle:
              "Insertion of a one-stage endosseous implant – per implant",
            treatmentFriendlyName:
              "Insert 2nd stage endosseous implant (per implant)",
            treatmentItemDescription: "",
            cost: "2290.00",
            discount: "29",
            medicare: "0",
            vetAffairs: "0",
            vgds: "0",
          },
          {
            id: "688_upper_3",
            visitNumber: 1,
            groupTitle: "UPPER Implant Surgery",
            toothValue: "25",
            treatmentItemNumber: "688",
            treatmentItemTitle:
              "Insertion of a one-stage endosseous implant – per implant",
            treatmentFriendlyName:
              "Insert 2nd stage endosseous implant (per implant)",
            treatmentItemDescription: "",
            cost: "2290.00",
            discount: "29",
            medicare: "0",
            vetAffairs: "0",
            vgds: "0",
          },
          {
            id: "331_upper_0",
            toothValue: "none",
            visitNumber: 1,
            groupTitle: "UPPER Implant Surgery",
            treatmentItemNumber: "331",
            treatmentItemTitle: "Alveoloplasty – per segment",
            treatmentFriendlyName: "Alveolectomy - per seg",
            treatmentItemDescription: "",
            cost: "1500.00",
            discount: "29",
            medicare: "0",
            vetAffairs: "0",
            vgds: "0",
          },
          {
            id: "661_upper_0",
            toothValue: "15",
            visitNumber: 1,
            groupTitle: "UPPER Implant Surgery",
            treatmentItemNumber: "661",
            treatmentItemTitle: "Fitting of implant abutment – per abutment",
            treatmentFriendlyName: "Fitting implant abutment - per abutment",
            treatmentItemDescription: "",
            cost: "1150.00",
            discount: "29",
            medicare: "0",
            vetAffairs: "0",
            vgds: "0",
          },
          {
            id: "661_upper_1",
            toothValue: "12",
            visitNumber: 1,
            groupTitle: "UPPER Implant Surgery",
            treatmentItemNumber: "661",
            treatmentItemTitle: "Fitting of implant abutment – per abutment",
            treatmentFriendlyName: "Fitting implant abutment - per abutment",
            treatmentItemDescription: "",
            cost: "1150.00",
            discount: "29",
            medicare: "0",
            vetAffairs: "0",
            vgds: "0",
          },
          {
            id: "661_upper_2",
            toothValue: "22",
            visitNumber: 1,
            groupTitle: "UPPER Implant Surgery",
            treatmentItemNumber: "661",
            treatmentItemTitle: "Fitting of implant abutment – per abutment",
            treatmentFriendlyName: "Fitting implant abutment - per abutment",
            treatmentItemDescription: "",
            cost: "1150.00",
            discount: "29",
            medicare: "0",
            vetAffairs: "0",
            vgds: "0",
          },
          {
            id: "661_upper_3",
            toothValue: "25",
            visitNumber: 1,
            groupTitle: "UPPER Implant Surgery",
            treatmentItemNumber: "661",
            treatmentItemTitle: "Fitting of implant abutment – per abutment",
            treatmentFriendlyName: "Fitting implant abutment - per abutment",
            treatmentItemDescription: "",
            cost: "1150.00",
            discount: "28",
            medicare: "0",
            vetAffairs: "0",
            vgds: "0",
          },
        ],
      },
      {
        visitNumber: 1,
        groupTitle: "Zygoma Surgery",
        addOn: true,
        items: [
          {
            id: "990_zygoma_0",
            visitNumber: 1,
            groupTitle: "Zygoma Surgery",
            toothValue: "none",
            treatmentItemNumber: "990",
            treatmentItemTitle:
              "Zygomatic Implant/s Supplement - Inclusive of site-specific bone grafting as required",
            treatmentFriendlyName:
              "Zygomatic Implant/s Supplement - Inclusive of site-specific bone grafting as required",
            treatmentItemDescription: "",
            cost: "6000.00",
            discount: "0",
            medicare: "0",
            vetAffairs: "0",
            vgds: "0",
          },
        ],
      },
      {
        visitNumber: 1,
        groupTitle: "Quad Zygoma Surgery",
        addOn: true,
        items: [
          {
            id: "990_quad_zygoma_0",
            visitNumber: 1,
            groupTitle: "Quad Zygoma Surgery",
            toothValue: "none",
            treatmentItemNumber: "990",
            treatmentItemTitle:
              "Zygomatic Implant/s Supplement - Inclusive of site-specific bone grafting as required",
            treatmentFriendlyName:
              "Zygomatic Implant/s Supplement - Inclusive of site-specific bone grafting as required",
            treatmentItemDescription: "",
            cost: "7700.00",
            discount: "0",
            medicare: "0",
            vetAffairs: "0",
            vgds: "0",
          },
        ],
      },
      {
        visitNumber: 1,
        groupTitle: "Additional grafting for repair or contingency",
        addOn: true,
        items: [
          {
            id: "990_additional_graft_0",
            visitNumber: 1,
            groupTitle: "Additional grafting for repair or contingency",
            toothValue: "none",
            treatmentItemNumber: "990",
            treatmentItemTitle: "Item 990 or 243 and/or 247",
            treatmentFriendlyName: "",
            treatmentItemDescription: "",
            cost: "2000.00",
            discount: "0",
            medicare: "0",
            vetAffairs: "0",
            vgds: "0",
          },
        ],
      },
      {
        visitNumber: 1,
        groupTitle: "Upper Surgical Guide",
        addOn: true,
        items: [
          {
            id: "679_upper_0",
            visitNumber: 1,
            groupTitle: "Upper Surgical Guide",
            toothValue: "none",
            treatmentItemNumber: "679",
            treatmentItemTitle: "Surgical Implant guide",
            treatmentFriendlyName: "Surgical Implant guide",
            treatmentItemDescription:
              "Provision of an appliance that indicates the ideal location and angulation for insertion of implants.",
            cost: "2000.00",
            discount: "0",
            medicare: "0",
            vetAffairs: "0",
            vgds: "0",
          },
        ],
      },
      {
        visitNumber: 1,
        groupTitle: "Midline Implant",
        addOn: true,
        items: [
          {
            id: "688_uppermid_0",
            visitNumber: 1,
            groupTitle: "Upper Surgical Guide",
            toothValue: "upperMid",
            treatmentItemNumber: "688",
            treatmentItemTitle:
              "Insertion of a one-stage endosseous implant – per implant",
            treatmentFriendlyName:
              "Insert 2nd stage endosseous implant (per implant)",
            treatmentItemDescription: "",
            cost: "2290.00",
            discount: "220",
            medicare: "0",
            vetAffairs: "0",
            vgds: "0",
          },
          {
            id: "661_uppermid_0",
            visitNumber: 1,
            groupTitle: "Upper Surgical Guide",
            toothValue: "upperMid",
            treatmentItemNumber: "661",
            treatmentItemTitle: "Fitting of implant abutment – per abutment",
            treatmentFriendlyName: "Fitting of implant abutment – per abutment",
            treatmentItemDescription: "",
            cost: "1150.00",
            discount: "220",
            medicare: "0",
            vetAffairs: "0",
            vgds: "0",
          },
        ],
      },
      {
        visitNumber: 1,
        groupTitle: "Pterygoid Implants Surgery",
        addOn: true,
        items: [
          {
            id: "688_pterygoid_0",
            visitNumber: 1,
            groupTitle: "Pterygoid Implants Surgery",
            toothValue: "18",
            treatmentItemNumber: "688",
            treatmentItemTitle:
              "Insertion of a one-stage endosseous implant – per implant",
            treatmentFriendlyName:
              "Insert 2nd stage endosseous implant (per implant)",
            treatmentItemDescription: "",
            cost: "2290.00",
            discount: "220",
            medicare: "0",
            vetAffairs: "0",
            vgds: "0",
          },
          {
            id: "661_pterygoid_0",
            visitNumber: 1,
            groupTitle: "Pterygoid Implants Surgery",
            toothValue: "18",
            treatmentItemNumber: "661",
            treatmentItemTitle: "Fitting of implant abutment – per abutment",
            treatmentFriendlyName: "Fitting of implant abutment – per abutment",
            treatmentItemDescription: "",
            cost: "1150.00",
            discount: "220",
            medicare: "0",
            vetAffairs: "0",
            vgds: "0",
          },
          {
            id: "688_pterygoid_1",
            visitNumber: 1,
            groupTitle: "Pterygoid Implants Surgery",
            toothValue: "28",
            treatmentItemNumber: "688",
            treatmentItemTitle:
              "Insertion of a one-stage endosseous implant – per implant",
            treatmentFriendlyName:
              "Insert 2nd stage endosseous implant (per implant)",
            treatmentItemDescription: "",
            cost: "2290.00",
            discount: "220",
            medicare: "0",
            vetAffairs: "0",
            vgds: "0",
          },
          {
            id: "661_pterygoid_1",
            visitNumber: 1,
            groupTitle: "Pterygoid Implants Surgery",
            toothValue: "28",
            treatmentItemNumber: "661",
            treatmentItemTitle: "Fitting of implant abutment – per abutment",
            treatmentFriendlyName: "Fitting of implant abutment – per abutment",
            treatmentItemDescription: "",
            cost: "1150.00",
            discount: "220",
            medicare: "0",
            vetAffairs: "0",
            vgds: "0",
          },
        ],
      },
    ],
  },
  {
    id: "allOn4_3",
    groupTitleParent: `Intraoperative Impressions, Indexation and Try-in (Double Arch)`,
    items: [
      {
        visitNumber: 1,
        groupTitle:
          "Intraoperative Impressions, Indexation and Try-in (Double Arch)",
        addOn: false,
        items: [
          {
            id: "990_intraoperative_0",
            toothValue: "none",
            visitNumber: 1,
            groupTitle:
              "Intraoperative Impressions, Indexation and Try-in (Double Arch)",
            treatmentItemNumber: "990",
            treatmentItemTitle: "Intraoperative Impressions",
            treatmentFriendlyName: "",
            treatmentItemDescription: "",
            cost: "4000.00",
            medicare: "0",
            vetAffairs: "0",
            vgds: "0",
            discount: "0",
          },
        ],
      },
      {
        visitNumber: 1,
        groupTitle: "Design, Production & Case Management (Double)",
        addOn: true,
        items: [
          {
            id: "990_intraoperative_1",
            toothValue: "none",
            visitNumber: 1,
            groupTitle: "Design, Production & Case Management (Double)",
            treatmentItemNumber: "990",
            treatmentItemTitle: "",
            treatmentFriendlyName: "",
            treatmentItemDescription: "",
            cost: "9000.00",
            medicare: "0",
            vetAffairs: "0",
            vgds: "0",
            discount: "0",
          },
        ],
      },
    ],
  },
  {
    id: "allOn4_4",
    groupTitleParent: `Intraoperative Impressions, Indexation and Try-in (Single Arch)`,
    items: [
      {
        visitNumber: 1,
        groupTitle:
          "Intraoperative Impressions, Indexation and Try-in (Single Arch)",
        addOn: false,
        items: [
          {
            id: "990_intraoperative_single_0",
            toothValue: "none",
            visitNumber: 1,
            groupTitle:
              "Intraoperative Impressions, Indexation and Try-in (Double Arch)",
            treatmentItemNumber: "990",
            treatmentItemTitle: "Intraoperative Impressions",
            treatmentFriendlyName: "",
            treatmentItemDescription: "",
            cost: "2000.00",
            medicare: "0",
            vetAffairs: "0",
            vgds: "0",
            discount: "0",
          },
        ],
      },
      {
        visitNumber: 1,
        groupTitle: "Design, Production & Case Management (Single)",
        addOn: true,
        items: [
          {
            id: "990_intraoperative_single_1",
            toothValue: "none",
            visitNumber: 1,
            groupTitle: "Design, Production & Case Management (Single)",
            treatmentItemNumber: "990",
            treatmentItemTitle: "",
            treatmentFriendlyName: "",
            treatmentItemDescription: "",
            cost: "4500.00",
            medicare: "0",
            vetAffairs: "0",
            vgds: "0",
            discount: "0",
          },
        ],
      },
    ],
  },
  {
    id: "allOn4_5",
    groupTitleParent: `Upper All On 4 Plus® Immediate Final Teeth`,
    items: [
      {
        visitNumber: 1,
        groupTitle: "Upper Prosthesis with Titanium Frame",
        addOn: false,
        items: [
          {
            id: "666_upper_0",
            toothValue: "none",
            visitNumber: 1,
            groupTitle: "Upper Prosthesis with Titanium Frame",
            treatmentItemNumber: "666",
            treatmentItemTitle:
              "Prosthesis with metal frame attached to implants – fixed – per arch",
            treatmentFriendlyName:
              "Prosthesis with metal frame attached to implants – fixed – per arch",
            treatmentItemDescription: "",
            cost: "6000.00",
            medicare: "0",
            vetAffairs: "0",
            vgds: "0",
            discount: "0",
          },
        ],
      },
    ],
  },
  {
    id: "allOn4_6",
    groupTitleParent: `Lower All On 4 Plus® Immediate Final Teeth`,
    items: [
      {
        visitNumber: 1,
        groupTitle: "Lower Prosthesis with Titanium Frame",
        addOn: false,
        items: [
          {
            id: "666_lower_0",
            toothValue: "none",
            visitNumber: 1,
            groupTitle: "Lower Prosthesis with Titanium Frame",
            treatmentItemNumber: "666",
            treatmentItemTitle:
              "Prosthesis with metal frame attached to implants – fixed – per arch",
            treatmentFriendlyName:
              "Prosthesis with metal frame attached to implants – fixed – per arch",
            treatmentItemDescription: "",
            cost: "6000.00",
            medicare: "0",
            vetAffairs: "0",
            vgds: "0",
            discount: "0",
          },
        ],
      },
    ],
  },
  {
    id: "allOn4_7",
    groupTitleParent: `All On 4 Plus® Immediate Final Teeth`,
    items: [
      {
        visitNumber: 1,
        groupTitle: "Upper Prosthesis with Titanium Frame",
        addOn: false,
        items: [
          {
            id: "666_upper_1",
            toothValue: "none",
            visitNumber: 1,
            groupTitle: "Upper Prosthesis with Titanium Frame",
            treatmentItemNumber: "666",
            treatmentItemTitle:
              "Prosthesis with metal frame attached to implants – fixed – per arch",
            treatmentFriendlyName:
              "Prosthesis with metal frame attached to implants – fixed – per arch",
            treatmentItemDescription: "",
            cost: "6000.00",
            medicare: "0",
            vetAffairs: "0",
            vgds: "0",
            discount: "0",
          },
        ],
      },
      {
        visitNumber: 1,
        groupTitle: "Lower Prosthesis with Titanium Frame",
        addOn: false,
        items: [
          {
            id: "666_lower_1",
            toothValue: "none",
            visitNumber: 1,
            groupTitle: "Lower Prosthesis with Titanium Frame",
            treatmentItemNumber: "666",
            treatmentItemTitle:
              "Prosthesis with metal frame attached to implants – fixed – per arch",
            treatmentFriendlyName:
              "Prosthesis with metal frame attached to implants – fixed – per arch",
            treatmentItemDescription: "",
            cost: "6000.00",
            medicare: "0",
            vetAffairs: "0",
            vgds: "0",
            discount: "0",
          },
        ],
      },
    ],
  },
  {
    id: "allOn4_8",
    groupTitleParent: `Additional Requirements`,
    items: [
      {
        visitNumber: 1,
        groupTitle: "Advanced Digital Smile Design (Single Arch)",
        addOn: true,
        items: [
          {
            id: "990_smile_design_single_0",
            toothValue: "none",
            visitNumber: 1,
            groupTitle: "Advanced Digital Smile Design (Single Arch)",
            treatmentItemNumber: "990",
            treatmentItemTitle: "Digital Smile Design",
            treatmentFriendlyName: "Digital Smile Design",
            treatmentItemDescription: "",
            cost: "2500.00",
            medicare: "0",
            vetAffairs: "0",
            vgds: "0",
            discount: "0",
          },
        ],
      },
      {
        visitNumber: 1,
        groupTitle: "Advanced Digital Smile Design (Double Arch)",
        addOn: true,
        items: [
          {
            id: "990_smile_design_double_0",
            toothValue: "none",
            visitNumber: 1,
            groupTitle: "Advanced Digital Smile Design (Double Arch)",
            treatmentItemNumber: "990",
            treatmentItemTitle: "Digital Smile Design",
            treatmentFriendlyName: "Digital Smile Design",
            treatmentItemDescription: "",
            cost: "5000.00",
            medicare: "0",
            vetAffairs: "0",
            vgds: "0",
            discount: "0",
          },
        ],
      },
      {
        visitNumber: 1,
        groupTitle: "Anti Clenching Injections",
        addOn: true,
        items: [
          {
            id: "990_anti_clenching_0",
            toothValue: "none",
            visitNumber: 1,
            groupTitle: "Anti Clenching Injections",
            treatmentItemNumber: "990",
            treatmentItemTitle: "Anti Clenching Injections",
            treatmentFriendlyName: "Anti Clenching Injections",
            treatmentItemDescription: "",
            cost: "650.00",
            medicare: "0",
            vetAffairs: "0",
            vgds: "0",
            discount: "0",
          },
        ],
      },
    ],
  },
];

export const toothOptions = [
  { label: "none", value: "none" },
  { label: "All", value: "all" },
  { label: "Upper", value: "upperAll" },
  { label: "Lower", value: "lowerAll" },
  { label: "18", value: "18" },
  { label: "17", value: "17" },
  { label: "16", value: "16" },
  { label: "15", value: "15" },
  { label: "14", value: "14" },
  { label: "13", value: "13" },
  { label: "12", value: "12" },
  { label: "11", value: "11" },
  { label: "Upper Mid", value: "upperMid" },
  { label: "21", value: "21" },
  { label: "22", value: "22" },
  { label: "23", value: "23" },
  { label: "24", value: "24" },
  { label: "25", value: "25" },
  { label: "26", value: "26" },
  { label: "27", value: "27" },
  { label: "28", value: "28" },
  { label: "48", value: "48" },
  { label: "47", value: "47" },
  { label: "46", value: "46" },
  { label: "45", value: "45" },
  { label: "44", value: "44" },
  { label: "43", value: "43" },
  { label: "42", value: "42" },
  { label: "41", value: "41" },
  { label: "Lower Mid", value: "lowerMid" },
  { label: "31", value: "31" },
  { label: "32", value: "32" },
  { label: "33", value: "33" },
  { label: "34", value: "34" },
  { label: "35", value: "35" },
  { label: "36", value: "36" },
  { label: "37", value: "37" },
  { label: "38", value: "38" },
];
export const treatmentProposalEnquiryTypes = {
  allOn4: "All On 4 Plus®",
  sleepDentistry: "Sleep Dentistry",
  cosmeticDentistry: "Cosmetic Dentistry",
  generalDentistry: "General Dentistry",
  facialAesthetics: "Facial Aesthetics",
  individualDentalImplants: "Individual Dental Implants",
};
