export const getSundaysOfYear = () => {
  const today = new Date();
  const year = today.getFullYear();

  const sundays = [];
  const date: Date = new Date(year, 0, 1);

  while (date.getDay() !== 0) {
    date.setDate(date.getDate() + 1);
  }

  while (date.getFullYear() === year) {
    sundays.push({
      startDate: new Date(date),
      endDate: new Date(date),
    });
    date.setDate(date.getDate() + 7);
  }

  return sundays;
};
