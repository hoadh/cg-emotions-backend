interface IDate { year: number; month: number; day: number }

function UTCDate(year: number, month: number, day: number): Date {
  return new Date(Date.UTC(year, month - 1, day));
}

function getLocalDate(dateInput: Date): IDate {
  const nDate = dateInput.toLocaleString("en-US", {
    timeZone: "Asia/Ho_Chi_Minh"
  });
  let date = nDate.split(",")[0].split("/");
  return {
    year: Number(date[2]),
    month: Number(date[0]),
    day: Number(date[1])
  };
}

export default {
  getLocalDate,
  UTCDate
}
