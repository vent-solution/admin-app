import React, { useEffect, useState } from "react";
import { fetchData } from "../../global/api";
import axios from "axios";
import { FormatMoney } from "../../global/actions/formatMoney";
import { monthFullNames } from "../../global/monthNames";
import { SettingsModel } from "../settings/SettingsModel";

interface Props {
  settings: SettingsModel;
}

let TotalEarnings: React.FC<Props> = ({ settings }) => {
  const [totalEarning, setTotalEarnings] = useState<number>(0);

  const [curentYearTotalEarning, setCurentYearTotalEarning] =
    useState<number>(0);

  const [curentMonthTotalEarning, setCurentMonthTotalEarning] =
    useState<number>(0);

  const [currentWeekTotalEarning, setCurrentWeekTotalEarning] =
    useState<number>(0);

  const [todayTotalEarning, setTodayTotalEarning] = useState<number>(0);

  // fetch total earnings
  const fetchTotalEarningsAmount = async () => {
    try {
      const result = await fetchData("/fetch-total-earnings-amount");

      if (!result) {
        return;
      }

      if (result.status !== 200) {
        return;
      }
      setTotalEarnings(result.data);
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("FETCH TOTAL BID AMOUNT CANCELLED: ", error.message);
      }
    }
  };

  // fetch current year's total earnings
  const fetchCurentYearTotalAmount = async () => {
    try {
      const result = await fetchData(`/fetch-current-year-total-earnings`);

      if (!result) {
        return;
      }

      if (result.status !== 200) {
        return;
      }
      setCurentYearTotalEarning(result.data);
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log(
          "FETCH CURRENT YEAR'S TOTAL EARNINGS CANCELLED: ",
          error.message
        );
      }
    }
  };

  // fetch current month's total earnings
  const fetchCurentmonthTotalEarning = async () => {
    try {
      const result = await fetchData(`/fetch-current-month-total-earnings`);

      if (!result) {
        return;
      }

      if (result.status !== 200) {
        return;
      }
      setCurentMonthTotalEarning(result.data);
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log(
          "FETCH CURRENT MONTH'S TOTAL EARNINGS CANCELLED: ",
          error.message
        );
      }
    }
  };

  // fetch current week's total earnings
  const fetchCurentWeekTotalEarning = async () => {
    try {
      const result = await fetchData(`/fetch-current-week-total-earnings`);

      if (!result) {
        return;
      }

      if (result.status !== 200) {
        return;
      }
      setCurrentWeekTotalEarning(result.data);
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log(
          "FETCH CURRENT WEEK'S TOTAL EARNING CANCELLED: ",
          error.message
        );
      }
    }
  };

  // fetch today's total earnings
  const fetchTodayTotalEarning = async () => {
    try {
      const result = await fetchData(`/fetch-today-total-earnings`);

      if (!result) {
        return;
      }

      if (result.status !== 200) {
        return;
      }
      setTodayTotalEarning(result.data);
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log(
          "FETCH CURRENT WEEK'S TOTAL EARNING CANCELLED: ",
          error.message
        );
      }
    }
  };

  // use effect for fetching total earnings
  useEffect(() => {
    fetchTotalEarningsAmount();
    fetchCurentYearTotalAmount();
    fetchCurentmonthTotalEarning();
    fetchCurentWeekTotalEarning();
    fetchTodayTotalEarning();
  }, []);

  return (
    <div className="w-full bg-gradient-to-t from-blue-800 via-blue-900 to-blue-950 text-white text-center flex flex-wrap justify-center items-center lg:sticky lg:top-0 mb-5 lg:z-10">
      <div className="w-full text-orange-300 lg:w-1/5 py-10">
        <h1 className="text-2xl font-light font-mono">
          {FormatMoney(totalEarning, 2, settings.preferedCurrency)}
        </h1>
      </div>
      <div className="w-1/2 lg:w-1/6 py-10">
        <h4 className="text-xs text-gray-400 font-extrabold">
          {new Date().getFullYear()}
        </h4>
        <h1 className="font-light text-sm">
          {FormatMoney(curentYearTotalEarning, 2, settings.preferedCurrency)}
        </h1>
      </div>
      <div className="w-1/2 lg:w-1/6 py-10">
        <h4 className="text-xs text-gray-400 font-extrabold">
          {monthFullNames[new Date().getMonth()]}
        </h4>
        <h1 className="font-light text-sm">
          {FormatMoney(curentMonthTotalEarning, 2, settings.preferedCurrency)}
        </h1>
      </div>
      <div className="w-1/2 lg:w-1/6 py-10">
        <h4 className="text-xs text-gray-400 font-extrabold">this week</h4>
        <h1 className="font-light text-sm">
          {FormatMoney(currentWeekTotalEarning, 2, settings.preferedCurrency)}
        </h1>
      </div>
      <div className="w-1/2 lg:w-1/6 py-10">
        <h4 className="text-xs text-gray-400 font-extrabold">today</h4>
        <h1 className="font-light text-sm">
          {FormatMoney(todayTotalEarning, 2, settings.preferedCurrency)}
        </h1>
      </div>
    </div>
  );
};

TotalEarnings = React.memo(TotalEarnings);

export default TotalEarnings;
