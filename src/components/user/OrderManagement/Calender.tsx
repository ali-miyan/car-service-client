import { useState } from "react";
import { Calendar } from "@demark-pro/react-booking-calendar";
import "@demark-pro/react-booking-calendar/dist/react-booking-calendar.css";
import "../../../styles/Global.css";
import { useDispatch, useSelector } from "react-redux";
import { setDate, setServiceDate } from "../../../context/OrderContext";
import { useGetSinglServicesQuery } from "../../../store/slices/companyApiSlice";
import { getSundaysOfYear } from "../../../helpers/getSundays";

const BookingCalendar = ({ setDateChange }: any) => {
  
  const { serviceId, date } = useSelector((state: any) => state.order);
  const { data: dates } = useGetSinglServicesQuery(serviceId as string);
  const reserved = dates?.selectedHours === "mon-sat" ? getSundaysOfYear() : [];

  const [selectedDates, setSelectedDates] = useState<any>(date || []);
  const dispatch = useDispatch();

  const handleDateChange = (newDates:any) => {
    setDateChange(true);
    setSelectedDates(newDates);
    dispatch(setDate(newDates));
    const date = new Date(newDates);
    const options: any = { year: "numeric", month: "long", day: "numeric" };
    const formattedDate = date.toLocaleDateString("en-US", options);
    dispatch(setServiceDate(formattedDate));
  };

  return (
    <>
      <h2 className="text-xl font-bai-bold font-semibold mb-4 text-center text-gray-800 uppercase">
        choose a date
      </h2>
      <div className="w-full max-w-md mx-auto p-4 bg-white shadow-lg lowercase font-bai-regular  border border-gray-300">
        <Calendar
          selected={selectedDates}
          reserved={reserved}
          onChange={handleDateChange}
          className="text-black rounded-lg font-bai-regular"
        />
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Select your dates from the calendar. Reserved dates are not
            available for booking.
          </p>
        </div>
      </div>
    </>
  );
};

export default BookingCalendar;
