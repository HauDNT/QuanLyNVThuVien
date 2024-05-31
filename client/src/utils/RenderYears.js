export const renderYears = (
  amountYearsPast,
  currentYear,
  amountYearsFuture,
) => {
  const years = [];

  for (let i = currentYear - amountYearsPast; i <= currentYear; i++) {
    years.push(i);
  }

  for (let i = currentYear + 1; i <= currentYear + amountYearsFuture; i++) {
    years.push(i);
  }

  return years;
};
