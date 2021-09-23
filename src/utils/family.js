import { MONTHS } from './general';

export const getNextMonth = (family) => {  
  const { cronograma } = family;
  const lastMonth = cronograma[cronograma.length -1];
  const nextYear = lastMonth.number === 12 ? lastMonth.year + 1 : lastMonth.year;
  const nextMonth = lastMonth.number === 12 ? 1 : lastMonth.number + 1;
  return {
    number: nextMonth,
    year: nextYear,
    label: `${MONTHS[nextMonth]} ${nextYear}`,
    status: "unset",
    disabled: false
  }
}