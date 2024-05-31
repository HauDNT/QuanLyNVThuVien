export const renderDays = (month, year) => {
  const days = [];
  const amountDays = new Date(year, month, 0).getDate();

  for (let i = 1; i <= amountDays; i++) days.push(i);

  return days;
};
