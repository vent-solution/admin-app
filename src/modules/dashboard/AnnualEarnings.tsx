import React, { useCallback, useEffect, useState } from "react";
import AnnualIncomeChart from "../../global/charts/AnnualIncomeChart";
import { SettingsModel } from "../settings/SettingsModel";
import axios from "axios";
import { fetchData } from "../../global/api";

interface Props {
  settings: SettingsModel;
}

const currentYear = new Date().getFullYear();

let AnnualEarnings: React.FC<Props> = ({ settings }) => {
  const [annualData, setAnnualData] = useState<
    { year: number; earnings: number }[]
  >([]);

  // update annual earnings
  const updateEarningsForYear = useCallback(
    ({ year, earnings }: { year: number; earnings: number }) => {
      setAnnualData((prevData) =>
        prevData.map((data) => {
          return data.year === year
            ? { ...data, earnings: earnings + data.earnings }
            : data;
        })
      );
    },
    []
  );

  // fetch annual bid amount
  const fetchAnnualBidAmount = useCallback(
    async (year: number) => {
      try {
        const result = await fetchData(`/fetch-annual-bid-amount/${year}`);

        if (!result) {
          return;
        }

        if (result.status !== 200) {
          return;
        }
        updateEarningsForYear(result.data[0]);
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log("FETCH ANNUAL BID AMOUNT CANCELLED: ", error.message);
        }
      }
    },
    [updateEarningsForYear]
  );

  // fetch annual subscription amount
  const fetchAnnualSubscriptionAmount = useCallback(
    async (year: number) => {
      try {
        const result = await fetchData(
          `/fetch-annual-subscription-amount/${year}`
        );

        if (!result) {
          return;
        }

        if (result.status !== 200) {
          return;
        }
        updateEarningsForYear(result.data[0]);
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log("FETCH ANNUAL BID AMOUNT CANCELLED: ", error.message);
        }
      }
    },
    [updateEarningsForYear]
  );

  // fetch annual service fee amount
  const fetchAnnualServiceFeeAmount = useCallback(
    async (year: number) => {
      try {
        const result = await fetchData(
          `/fetch-annual-service-fee-amount/${year}`
        );

        updateEarningsForYear(result.data[0]);
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log(
            "FETCH ANNUAL SERVICE FEE AMOUNT CANCELLED: ",
            error.message
          );
        }
      }
    },
    [updateEarningsForYear]
  );

  // fetch annual broker fee amount
  const fetchAnnualBrokerFeeAmount = useCallback(
    async (year: number) => {
      try {
        const result = await fetchData(
          `/fetch-annual-broker-fee-amount/${year}`
        );

        if (!result) {
          return;
        }

        if (result.status !== 200) {
          return;
        }

        updateEarningsForYear(result.data[0]);
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log(
            "FETCH ANNUAL BROKER FEE AMOUNT CANCELLED: ",
            error.message
          );
        }
      }
    },
    [updateEarningsForYear]
  );

  // Initialize annual data for the past 10 years and invoke the data fetching
  useEffect(() => {
    const genData: { year: number; earnings: number }[] = [];

    for (let y = currentYear - 10; y <= currentYear; y++) {
      genData.push({ year: y, earnings: 0 });
    }

    setAnnualData(genData);

    genData.forEach((data) => {
      fetchAnnualSubscriptionAmount(data.year);
      fetchAnnualBidAmount(data.year);
      fetchAnnualServiceFeeAmount(data.year);
      fetchAnnualBrokerFeeAmount(data.year);
    });
  }, [
    fetchAnnualBidAmount,
    fetchAnnualSubscriptionAmount,
    fetchAnnualServiceFeeAmount,
    fetchAnnualBrokerFeeAmount,
  ]);

  return (
    <div className="w-full text-sm text-white px-3 lg:px-5 py-10 lg:w-1/2 bg-gradient-to-l from-blue-950 via-blue-900 to-blue-950">
      <div className="w-full">
        <div className="pb-8 w-full flex justify-center items-center">
          <h1 className="text-white">Annual Earnings</h1>
        </div>
        <AnnualIncomeChart
          currency={settings.preferedCurrency}
          data={annualData}
        />
      </div>
    </div>
  );
};

AnnualEarnings = React.memo(AnnualEarnings);
export default AnnualEarnings;
