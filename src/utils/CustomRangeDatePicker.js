import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";

dayjs.extend(isSameOrBefore);

const CustomRangeDatePicker = ({ formik }) => {
  const [range, setRange] = useState([null, null]);
  const [startDate, endDate] = range;

  const holidays = [
    "2025-08-15",
    "2025-10-02",
    "2025-12-25",
    // 2026
    "2026-01-01",
    "2026-01-14",
    "2026-01-26",
    "2026-02-15",
    "2026-03-04",
    "2026-03-19",
    "2026-03-21",
    "2026-03-26",
    "2026-04-03",
    "2026-03-31",
    "2026-08-15",
    "2026-10-02",
  ];

  const isWeekend = (date) => {
    const day = date.day();
    return day === 0 || day === 6;
  };

  const generateWorkingDates = (start, end) => {
    const dates = [];
    let curr = dayjs(start);
    while (curr.isSameOrBefore(end, "day")) {
      const formatted = curr.format("YYYY-MM-DD");
      if (!isWeekend(curr) && !holidays.includes(formatted)) {
        dates.push(formatted);
      }
      curr = curr.add(1, "day");
    }
    return dates;
  };

  return (
    <div className="w-full">
      <label className="block mb-1 font-semibold">
        Select Leave Date Range
      </label>
      <DatePicker
        selectsRange
        startDate={startDate}
        endDate={endDate}
        onChange={(update) => {
          setRange(update);
          if (update[0] && update[1]) {
            const [start, end] = update;
            const validDates = generateWorkingDates(start, end);
            formik.setFieldValue("dates", validDates);
          }
        }}
        onBlur={() => formik.setFieldTouched("dates", true)}
        dateFormat="yyyy-MM-dd"
        className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
        wrapperClassName="w-full"
      />
      {formik.values.dates?.length > 0 && (
        <p className="text-xs text-gray-500 mt-2">
          {formik.values.dates.length} working day(s) selected (excluding
          weekends & holidays)
        </p>
      )}
    </div>
  );
};

export default CustomRangeDatePicker;
