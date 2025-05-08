import React, { useEffect, useState, useCallback } from "react";
import MonthlyIncomeChart from "../../global/charts/MonthlyEarningsChart";
import { SettingsModel } from "../settings/SettingsModel";
import axios from "axios";
import { fetchData } from "../../global/api";
import { FormatMoney } from "../../global/actions/formatMoney";

interface Props {
  settings: SettingsModel;
}

const INITIAL_MONTHLY_DATA = [
  { monthNumber: 1, month: "Jan", earnings: 0 },
  { monthNumber: 2, month: "Feb", earnings: 0 },
  { monthNumber: 3, month: "Mar", earnings: 0 },
  { monthNumber: 4, month: "Apr", earnings: 0 },
  { monthNumber: 5, month: "May", earnings: 0 },
  { monthNumber: 6, month: "Jun", earnings: 0 },
  { monthNumber: 7, month: "Jul", earnings: 0 },
  { monthNumber: 8, month: "Aug", earnings: 0 },
  { monthNumber: 9, month: "Sep", earnings: 0 },
  { monthNumber: 10, month: "Oct", earnings: 0 },
  { monthNumber: 11, month: "Nov", earnings: 0 },
  { monthNumber: 12, month: "Dec", earnings: 0 },
];

const currentYear = new Date().getFullYear();

let MonthlyEarnings: React.FC<Props> = ({ settings }) => {
  const [monthlyData, setMonthlyData] = useState(INITIAL_MONTHLY_DATA);
  const [selectedYear, setSelectedYear] = useState<number>(0);
  const [totalAnnualEarning, setTotalAnnualEarnings] = useState<number>(0);

  const availableYears = [];

  // set the array of available years starting from th current year up to the system initial year
  for (
    let y = currentYear;
    y >= new Date(String(settings.dateCreated)).getFullYear() - 1;
    y--
  ) {
    availableYears.push(y);
  }

  // Handle year selection change
  const handleChangeSelectYear = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(Number(e.target.value));
  };

  // compute the total monthly earnings for a given year
  useEffect(() => {
    setTotalAnnualEarnings(
      monthlyData.map((data) => data.earnings).reduce((calc, add) => calc + add)
    );
  }, [monthlyData]);

  // Update earnings for months based on fetched data
  const updateEarningsForMonths = useCallback(
    (newData: { month: number; earnings: number }[]) => {
      if (selectedYear === 0) {
        setSelectedYear(currentYear);
      }
      if (newData.length === 0) {
        setMonthlyData(INITIAL_MONTHLY_DATA);
      } else {
        setMonthlyData((prevData) =>
          prevData.map((data) => {
            const matchingNewData = newData.find(
              (newItem) => newItem.month === data.monthNumber
            );

            return matchingNewData
              ? {
                  ...data,
                  earnings:
                    Number(matchingNewData.earnings) + Number(data.earnings),
                }
              : { ...data, earnings: Number(data.earnings) };
          })
        );
      }
    },
    [selectedYear]
  );

  // Fetch total monthly subscription amount when the selected year changes
  useEffect(() => {
    const fetchTotalMonthSubscription = async (year: number) => {
      try {
        const result = await fetchData(
          `/fetch-total-monthly-subscription/${year}`
        );

        if (!result) {
          return;
        }

        if (result.status !== 200) {
          console.error("Failed to fetch data:");
          return;
        }

        updateEarningsForMonths(result.data);
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log("FETCH CANCELLED: ", error.message);
        } else {
          console.error("Error fetching monthly subscription:", error);
        }
      }
    };

    fetchTotalMonthSubscription(selectedYear);
  }, [selectedYear, updateEarningsForMonths]);

  // Fetch total monthly bid amount when the selected year changes
  useEffect(() => {
    const fetchTotalMonthBid = async (year: number) => {
      try {
        const result = await fetchData(
          `/fetch-total-monthly-bid-amount/${year}`
        );
        if (result.status === 200) {
          updateEarningsForMonths(result.data);
        } else {
          console.error("Failed to fetch monthly bid amount.");
        }
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log("FETCH CANCELLED: ", error.message);
        } else {
          console.error("Error fetching monthly bid:", error);
        }
      }
    };

    fetchTotalMonthBid(selectedYear);
  }, [selectedYear, updateEarningsForMonths]);

  // Fetch total monthly broker fee amount when the selected year changes
  useEffect(() => {
    const fetchTotalMonthlyBrokerFees = async (year: number) => {
      try {
        const result = await fetchData(
          `/fetch-total-monthly-broker-fee-amount/${year}`
        );
        if (result.status === 200) {
          updateEarningsForMonths(result.data);
        } else {
          console.error("Failed to fetch data:", result.data);
        }
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log("FETCH CANCELLED: ", error.message);
        } else {
          console.error("Error fetching monthly broker fee:", error);
        }
      }
    };

    fetchTotalMonthlyBrokerFees(selectedYear);
  }, [selectedYear, updateEarningsForMonths]);

  // Fetch total monthly service fee amount when the selected year changes
  useEffect(() => {
    const fetchTotalMonthlyServiceFees = async (year: number) => {
      try {
        const result = await fetchData(
          `/fetch-total-monthly-service-fee-amount/${year}`
        );
        if (result.status === 200) {
          updateEarningsForMonths(result.data);
        } else {
          console.error("Failed to fetch data:", result.data);
        }
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log("FETCH CANCELLED: ", error.message);
        } else {
          console.error("Error fetching monthly broker fee:", error);
        }
      }
    };

    fetchTotalMonthlyServiceFees(selectedYear);
  }, [selectedYear, updateEarningsForMonths]);

  return (
    <div className="w-full px-3 lg:px-5 py-10 lg:w-1/2 bg-gradient-to-l from-blue-950 via-blue-900 to-blue-950">
      <div className="w-full">
        <div className="pb-5 px-2 w-full flex justify-between items-center">
          <h1 className="text-white">
            Monthly earnings{" "}
            <span className="text-gray-300">
              ({FormatMoney(totalAnnualEarning, 2, settings.preferedCurrency)})
            </span>
          </h1>
          <select
            className="text-sm outline-none border-none bg-blue-900 hover:bg-blue-800 h-8 p-0 px-3 text-white rounded-lg cursor-pointer"
            onChange={handleChangeSelectYear}
            value={selectedYear}
          >
            {availableYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
        <MonthlyIncomeChart
          currency={settings.preferedCurrency}
          data={monthlyData}
        />
      </div>
    </div>
  );
};

MonthlyEarnings = React.memo(MonthlyEarnings);

export default MonthlyEarnings;
