import { differenceInCalendarMonths, format, subMonths } from "date-fns"

export const formattedCurrentDate = format(new Date(), "yyyy-MM-dd")
const subOneMonth = format(subMonths(new Date(), 1), "yyyy-MM-dd")
const subTwoMonth = format(subMonths(new Date(), 2), "yyyy-MM-dd")
const subOneYearOneMonth = format(subMonths(new Date(), 13), "yyyy-MM-dd")

export const queryDates = {
  // currentDate: `<= ${formattedCurrentDate}`,
  currentDate: `<= ${formattedCurrentDate}`,
  beforeCurrentDate: `< ${subOneMonth}`,
  beforeCurrentDateString: `< ${subOneMonth}`,
  afterCurrentDate: `>= ${formattedCurrentDate}`,
  oneMonthPriorDate: `>= ${subOneMonth}`,
  twoMonthPriorDate: `>= ${subTwoMonth}`,
  thirteenMonthPriorDate: `>= ${subOneYearOneMonth}`,
}
