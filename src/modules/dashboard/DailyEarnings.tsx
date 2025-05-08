import React, { useCallback, useEffect, useState } from "react";
import DailyEarningsChart from "../../global/charts/DailyEarningsChart";
import { SettingsModel } from "../settings/SettingsModel";
import axios from "axios";
import { fetchData } from "../../global/api";
import { FormatMoney } from "../../global/actions/formatMoney";

interface Props {
  settings: SettingsModel;
}

const today = new Date();
const year = today.getFullYear();
const month = today.getMonth() + 1;

let DailyEarnings: React.FC<Props> = ({ settings }) => {
  const [isMonthChanged, setIsMonthChanged] = useState<boolean>(false);
  const [totalDailyAmount, setTotalDailyAmount] = useState<number>(0);
  const [yearMonth, setYearMonth] = useState<string>(`${year}-${month}`);
  const [dailyData, setDailyData] = useState<
    { day: number; earnings: number }[]
  >([]);

  // compute the total of daily earnings for a given month
  useEffect(() => {
    setTotalDailyAmount(
      dailyData.length > 0
        ? dailyData
            .map((data) => data.earnings)
            .reduce((calc, add) => calc + add)
        : 0
    );
  }, [dailyData]);

  // update annual earnings
  const updateDailyEarnings = useCallback(
    ({ day, earnings }: { day: number; earnings: number }) => {
      setDailyData((prevData) =>
        prevData.map((data) => {
          return yearMonth && data.day === day
            ? { ...data, earnings: earnings + data.earnings }
            : data;
        })
      );
    },
    [yearMonth]
  );

  // fetch daily bid amount
  const fetchDailyBidAmount = useCallback(
    async (day: number) => {
      const date = new Date(yearMonth + "-" + day).toISOString().slice(0, 10);
      try {
        const result = await fetchData(`/fetch-daily-bid-amount/${date}`);

        if (!result) {
          return;
        }

        if (result.status !== 200) {
          return;
        }
        updateDailyEarnings(result.data[0]);
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log("FETCH DAILY BID AMOUNT CANCELLED: ", error.message);
        }
      }
    },
    [updateDailyEarnings, yearMonth]
  );

  // fetch daily subscription amount
  const fetchDailySubscriptionAmount = useCallback(
    async (day: number) => {
      const date = new Date(yearMonth + "-" + day).toISOString().slice(0, 10);

      try {
        const result = await fetchData(
          `/fetch-daily-subscription-amount/${date}`
        );

        if (!result) {
          return;
        }

        if (result.status !== 200) {
          return;
        }
        updateDailyEarnings(result.data[0]);
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log(
            "FETCH DAILY SUBSCRIPTIOM AMOUNT CANCELLED: ",
            error.message
          );
        }
      }
    },
    [updateDailyEarnings, yearMonth]
  );

  useEffect(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    setYearMonth(`${year}-${month}`);
  }, []);

  // fetch daily service fee amount
  const fetchDailyServiceFeeAmount = useCallback(
    async (day: number) => {
      const date = new Date(yearMonth + "-" + day).toISOString().slice(0, 10);
      try {
        const result = await fetchData(
          `/fetch-daily-service-fee-amount/${date}`
        );

        if (!result) {
          return;
        }

        if (result.status !== 200) {
          return;
        }
        updateDailyEarnings(result.data[0]);
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log(
            "FETCH DAILY SERVICE FEE AMOUNT CANCELLED: ",
            error.message
          );
        }
      }
    },
    [updateDailyEarnings, yearMonth]
  );

  // fetch daily broker fee amount
  const fetchDailyBrokerFeeAmount = useCallback(
    async (day: number) => {
      const date = new Date(yearMonth + "-" + day).toISOString().slice(0, 10);
      try {
        const result = await fetchData(
          `/fetch-daily-broker-fee-amount/${date}`
        );

        if (!result) {
          return;
        }

        if (result.status !== 200) {
          return;
        }
        updateDailyEarnings(result.data[0]);
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log(
            "FETCH DAILY BROKER FEE AMOUNT CANCELLED: ",
            error.message
          );
        }
      }
    },
    [updateDailyEarnings, yearMonth]
  );

  // Initialize annual data for the past 10 years and invoke the data fetching
  useEffect(() => {
    const today = new Date(yearMonth);
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const daysInMonth = new Date(year, month, 0).getDate();

    const genData: { day: number; earnings: number }[] = [];

    for (let day = 1; day <= daysInMonth; day++) {
      genData.push({ day: day, earnings: 0 });
    }

    setDailyData(genData);

    genData.forEach((data) => {
      fetchDailyBidAmount(data.day);
      fetchDailySubscriptionAmount(data.day);
      fetchDailyServiceFeeAmount(data.day);
      fetchDailyBrokerFeeAmount(data.day);
    });
  }, [
    yearMonth,
    fetchDailyBidAmount,
    fetchDailySubscriptionAmount,
    fetchDailyServiceFeeAmount,
    fetchDailyBrokerFeeAmount,
  ]);

  return (
    <div className="w-full text-sm text-gray-100 pb-11 px-3 lg:px-5 pt-5 shadow-lg font-extralight bg-gradient-to-t from-blue-950 via-blue-900 to-blue-800 uppercase">
      <div className="w-full py-5 px-10 flex justify-between items-center">
        <h1>
          daily earnings{" "}
          <span className="text-gray-300 text-xs">
            (
            {FormatMoney(
              isMonthChanged ? totalDailyAmount : totalDailyAmount / 2,
              2,
              settings.preferedCurrency
            )}
            )
          </span>
        </h1>
        <input
          type="month"
          name=""
          id="year-month"
          value={yearMonth}
          className="text-sm text-center py-2 px-3 w-fit outline-none border-none rounded-lg bg-blue-900 hover:bg-blue-950"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setIsMonthChanged(true);
            setYearMonth(e.target.value);
          }}
        />
      </div>
      <DailyEarningsChart
        currency={settings.preferedCurrency}
        data={dailyData}
        yearMonth={yearMonth}
        isMonthChanged={isMonthChanged}
      />
    </div>
  );
};

DailyEarnings = React.memo(DailyEarnings);

export default DailyEarnings;
