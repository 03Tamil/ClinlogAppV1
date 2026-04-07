import { SortingState } from "@tanstack/react-table"
import { subDays } from "date-fns"
import { atom, WritableAtom } from "jotai"
import { atomWithStorage } from "jotai/utils"
import { DateRange } from "react-day-picker"

function atomWithToggle(
  initialValue?: boolean
): WritableAtom<boolean, any, boolean> {
  const anAtom = atom(initialValue, (get, set, nextValue?: boolean) => {
    const update = nextValue ?? !get(anAtom)
    set(anAtom, update)
  })
  return anAtom as WritableAtom<boolean, any, any>
}

export const filterToggleAtom = atomWithToggle(false)
export const sidebarToggleAtom = atomWithToggle(false)
export const dashModalToggle = atomWithToggle(false)
export const dashModalNumber = atom(0)
export const newTabSettingAtom = atomWithStorage("newTabSetting", false)
export const primaryLocationAtom = atom("")
export const formToggleAtom = atomWithToggle(false)
export const filterTypeAtom = atomWithStorage("leadType", "all")
export const visibilityAtom = atomWithStorage("visibilityStorage", {})
export const filtersAtom = atomWithStorage<any>("columnFilters", [
  {
    id: "recordFollowUpStatus",
    value: "Active",
  },
])
export const printButtonToggleAtom = atom(false)
export const patientSearchBarValueAtom = atom(false)
export const selectedTreatmentIdAtom = atom("")
export const selectedRecordIdAtom = atom("")
export const selectedPatientIdAtom = atom("")
export const selectedCaseIdAtom = atom("")
export const locationDateLimitAtom = atom(true)
export const sortingAtom = atom<SortingState>([])
export const globalFilterAtom = atom("")
export const treatmentProposalIdAtom = atom<number>(0)
export const treatmentProposalTabPageAtom = atom<number>(0)
export const dashboardTabPageAtom = atomWithStorage<number>(
  "dashboardTabPage",
  1
)
export const needToSignTermsAtom = atom(false)

export const handleTagRemoval = (
  id: any,
  filters: any,
  setFilter: any,
  setFilterType: any
) => {
  if (id === "recordTreatmentStatus" || id === "recordConsultationStatus") {
    setFilterType("all")
  }

  const newFilters = filters.filter((fil) => fil.id !== id)
  setFilter(newFilters)
}

type authorizedUser = {
  isLoggedIn: boolean
  jwt?: string
  userId?: any
  fullName?: string
  groups?: any[]
  locationId?: number
}

// export const loginAtom = atomWithStorage<authorizedUser>("authUser", {
//   isLoggedIn: false,
//   userId: "",
//   fullName: "",
//   groups: [],
//   locationId: 0,
// })

export const authAtom = atom("")
export const dateRangeAtom = atom<DateRange | undefined>({
  from: subDays(new Date(), 365),
  to: new Date(),
})
export const dateAtom = atom<Date | undefined>(new Date())
export const errorAtom = atom("")

export const messagesQueryKeyAtom = atom("recordNotificationRecipients")
