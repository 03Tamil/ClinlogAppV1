import { rankItem } from "@tanstack/match-sorter-utils"
import { FilterFn, SortingFn, sortingFns } from "@tanstack/react-table"
import { format, isWithinInterval } from "date-fns"
import Fuse from "fuse.js"

// export const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
//   // Rank the item
//   const itemRank = rankItem(row.getValue(columnId), value)

//   // Store the itemRank info
//   addMeta({
//     itemRank,
//   })
//   // Return if the item should be filtered in/out
//   return itemRank.passed
// }

const filterColumnIds = ["Full Name", "Clinic"]
export const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  if (filterColumnIds.includes(columnId)) {
    const stringOptions = {
      includeScore: true,
      // minMatchCharLength: 3,
      threshold: 0.1,
    }
    const stringFuse = new Fuse([row.getValue(columnId)], stringOptions)
    const result = stringFuse.search(value)
    return result?.length > 0
  } else if (columnId === "Email") {
    const emailOptions = {
      threshold: 0.3,
      includeScore: true,
    }
    const emailString: string = row.getValue(columnId)
    const firstHalf: string = emailString?.split("@")[0]
    const secondHalf: string = emailString?.split("@")?.[1]
    const emailFuseFirstHalf = new Fuse([firstHalf], emailOptions)
    const emailFuseSecondHalf = new Fuse([secondHalf], emailOptions)

    const emailResultFirstHalf: any = emailFuseFirstHalf.search(value)
    const emailResultSecondHalf: any = emailFuseSecondHalf.search(value)
    return emailResultFirstHalf?.length > 0 || emailResultSecondHalf?.length > 0
  }
  return false
}
export const fuzzyFilterNew: FilterFn<any> = (
  row,
  columnId,
  value,
  addMeta
) => {
  const stringOptions = {
    includeScore: true,
    // minMatchCharLength: 3,
    threshold: 0.1,
  }

  // Get the value and ensure it's a string for filtering
  const cellValue = row.getValue(columnId)
  // Convert to string if it's not already (handles JSX, objects, etc.)
  const stringValue = cellValue != null ? String(cellValue) : ""
  
  const stringFuse = new Fuse([stringValue], stringOptions)
  const result = stringFuse.search(value)
  return result?.length > 0
}
export const customInactiveFilter: FilterFn<any> = (
  row,
  columnId,
  filterValue
) => {
  const lowerCaseFilterValue = filterValue.toLowerCase()
  if (lowerCaseFilterValue === "coldcase") {
    return row.getValue<unknown>(columnId) === "coldCase" ? true : false
  }
  if (lowerCaseFilterValue === "inactive") {
    return true
  } else {
    return row.getValue<unknown>(columnId) !== "inactive" &&
      row.getValue<unknown>(columnId) !== "coldCase"
      ? true
      : false
  }
}

export const customArrayFilter: FilterFn<any> = (
  row,
  columnId,
  filterValue
) => {
  return filterValue.some((val) => {
    if (row.getValue<unknown[]>(columnId) === null) {
      if (val === null) {
        return true
      }
    }
    //Changes - when redoing forms restrict empty strings, send null instead
    if (val !== "") {
      return row.getValue<unknown[]>(columnId)?.includes(val)
    }
    return row.getValue<string>(columnId) === ""
  })
}

export const customIncludesStringFunction: FilterFn<any> = (
  row,
  columnId,
  filterValue
) => {
  const search = filterValue.toLowerCase()
  return row.getValue<string>(columnId)?.toLowerCase().includes(search)
    ? true
    : false
}

// export const customDateFilter: FilterFn<any> = (row, columnId, filterValue) => {
//   if (filterValue?.startDate && filterValue.endDate) {
//     let startDate = format(new Date(filterValue.startDate), "yyyy-MM-dd")
//     let endDate = format(new Date(filterValue.endDate), "yyyy-MM-dd")
//     let dateEnquiredValue = format(
//       new Date(row.getValue<string>(columnId)),
//       "yyyy-MM-dd"
//     )

//     return dateEnquiredValue >= startDate && dateEnquiredValue <= endDate
//       ? true
//       : false
//   }
//   return true
// }

export const customDateRangeFilter: FilterFn<any> = (
  row,
  columnId,
  filterValue
) => {
  if (filterValue?.[0] && filterValue?.[1] && row.getValue<string>(columnId)) {
    let startDate = filterValue?.[0]
    let endDate = filterValue?.[1]
    let dateEnquiredValue = new Date(row.getValue<string>(columnId))

    const isWithinRange = isWithinInterval(dateEnquiredValue, {
      start: startDate,
      end: endDate,
    })
    return isWithinRange
    // return dateEnquiredValue === monthYear ? true : false
  }
  return false
}

export const customDateFilter: FilterFn<any> = (row, columnId, filterValue) => {
  if (filterValue?.startDate && row.getValue<string>(columnId)) {
    let monthYear = filterValue?.startDate
    //let endDate = format(new Date(filterValue.endDate), filterValue?.format)
    let dateEnquiredValue = format(
      new Date(row.getValue<string>(columnId)),
      "MMMM, yyyy"
    )

    return dateEnquiredValue === monthYear ? true : false
  }
  return false
}
export const customStatusFilter: FilterFn<any> = (
  row,
  columnId,
  filterValue
) => {
  if (filterValue !== null) {
    let statusarr = filterValue
    return statusarr?.includes(row.getValue<string>(columnId)) ? true : false
  }
  return false
  // else {
  //   return row.getValue<string>(columnId)!== "open" ? true : false;
  // }
}

export const customStageFilter: FilterFn<any> = (
  row,
  columnId,
  filterValue
) => {
  if (filterValue !== null) {
    let stagearr = filterValue
    return stagearr?.includes(row.getValue<string>(columnId)) ? true : false
  }
  return false
}
