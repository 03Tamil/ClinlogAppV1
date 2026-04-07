export function isAdmin(userGroups: string[]) {
  return userGroups && userGroups.includes("Admin")
}

export function isBusinessManager(userGroups: string[]) {
  return userGroups && userGroups.includes("Business Manager")
}

export function isStaff(userGroups: string[]) {
  const staffGroups = [
    "Anaesthetic Staff",
    "MAS Overseer",
    "Anaesthetist",
    "Business Manager",
    "Dentist",
    "External Dentist",
    "Laboratory Overseer",
    "Laboratory Technician",
    "Marketing Agent",
    "Nurse",
    "Overseer",
    "Receptionist",
    "Treatment Coordinator",
  ]
  return userGroups && userGroups.some((group) => staffGroups.includes(group))
}

export function isClinicStaff(userGroups: string[]) {
  const staffGroups = [
    "Dentist",
    "Nurse",
    "Overseer",
    "Receptionist",
    "Treatment Coordinator",
  ]
  return userGroups && userGroups.some((group) => staffGroups.includes(group))
}

export function isAnaesthetistStaff(userGroups: string[]) {
  const staffGroups = ["Anaesthetist", "Anaesthetic Staff", "MAS Overseer"]
  return userGroups && userGroups.some((group) => staffGroups.includes(group))
}

export function isLaboratoryStaff(userGroups: string[]) {
  const staffGroups = ["Laboratory Overseer", "Laboratory Technician"]
  return userGroups && userGroups.some((group) => staffGroups.includes(group))
}

export function isMasOverseer(userGroups: string[]) {
  return userGroups && userGroups.includes("MAS Overseer")
}

export function isOverseer(userGroups: string[]) {
  return userGroups && userGroups.includes("Overseer")
}
export function isLaboratoryOverseer(userGroups: string[]) {
  return userGroups && userGroups.includes("Laboratory Overseer")
}

export function isPatient(userGroups: string[]) {
  return userGroups && userGroups.includes("Patient")
}

export function isInternalStaff(userGroups: string[]) {
  // Basically if they are not a patient or external dentist
  return (
    isClinicStaff(userGroups) ||
    isAnaesthetistStaff(userGroups) ||
    isLaboratoryStaff(userGroups)
  )
}

export function isExternalStaff(userGroups: string[]) {
  return userGroups && userGroups.includes("External Dentist")
}
