import React, { useEffect, useState } from "react";
import { SettingsModel } from "./SettingsModel";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../app/store";
import {
  fetchAdminFinancialSettings,
  getSettings,
  updateSettings,
} from "./SettingsSlice";
import axios from "axios";
import { postData, putData } from "../../global/api";
import { setAlert } from "../../other/alertSlice";
import { AlertTypeEnum } from "../../global/enums/alertTypeEnum";
import { getCurrencyExchange } from "../../other/apis/CurrencyExchangeSlice";

interface Props {
  showForm: boolean;
  setShowForm: React.Dispatch<React.SetStateAction<boolean>>;
}
const SettingsForm: React.FC<Props> = ({ showForm, setShowForm }) => {
  const [adminFinancialSettings, setAdminFinancialSettings] =
    useState<SettingsModel>({
      subscriptionFee: 0,
      brokerFee: 0,
      serviceFeeFreeRoom: 0,
      serviceFeeOccupiedRoom: 0,
      minimumBidFee: 0,
      otherStaffServiceFee: 0,
      preferedCurrency: "usd",
    });

  const [currencyArray, setCurrencyArray] = useState<string[]>([]);

  const dispatch = useDispatch<AppDispatch>();
  const financialSettingsState = useSelector(getSettings);
  const { settings } = financialSettingsState;
  const currencies = useSelector(getCurrencyExchange);

  // update currency array
  useEffect(() => {
    const array = Object.keys(currencies);
    setCurrencyArray(array);
  }, [currencies]);

  // handle form field change event
  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setAdminFinancialSettings({ ...adminFinancialSettings, [id]: value });
  };

  // handle save admin financial settings
  const handleSaveAdminFinancialSettings = async () => {
    try {
      const results = await postData(
        "/save-admin-financial-settings",
        adminFinancialSettings
      );

      if (results.data.status && results.data.status !== "OK") {
        dispatch(
          setAlert({
            message: results.data.message,
            type: AlertTypeEnum.danger,
            status: true,
          })
        );
      } else {
        dispatch(
          setAlert({
            message: "Settings have been saved successfully.",
            type: AlertTypeEnum.success,
            status: true,
          })
        );
        dispatch(fetchAdminFinancialSettings());
      }
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("SAVE REQUEST CANCELLED ", error.message);
      }
    }
  };

  // handle save admin financial settings
  const handleUpdateAdminFinancialSettings = async () => {
    try {
      const results = await putData(
        `/update-admin-financial-settings/${Number(settings[0].id)}`,
        adminFinancialSettings
      );

      if (results.data.status && results.data.status !== "OK") {
        dispatch(
          setAlert({
            message: results.data.message,
            type: AlertTypeEnum.danger,
            status: true,
          })
        );
        return;
      } else {
        dispatch(
          setAlert({
            message: "Settings have been saved successfully.",
            type: AlertTypeEnum.success,
            status: true,
          })
        );

        dispatch(
          updateSettings({
            id: settings[0].id,
            changes: results.data,
          })
        );
      }
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("SAVE REQUEST CANCELLED ", error.message);
      }
    }
  };

  // update the adminFinancial settings if the settings slice has a value in the settings
  useEffect(() => {
    settings.length > 0
      ? setAdminFinancialSettings(settings[0])
      : setAdminFinancialSettings({
          subscriptionFee: 0,
          brokerFee: 0,
          serviceFeeFreeRoom: 0,
          serviceFeeOccupiedRoom: 0,
          minimumBidFee: 0,
          otherStaffServiceFee: 0,
          preferedCurrency: "usd",
        });
  }, [settings]);

  return (
    <form
      className="py-10 h-fit flex flex-wrap justify-center items-center font-bold"
      onSubmit={(e: React.FormEvent<HTMLFormElement>) => e.preventDefault()}
    >
      <div className="h-full lg:h-fit w-5/6 px-5 py-40 lg:py-5 flex flex-wrap justify-center bg-cyan-200 font-bold">
        <h1 className="text-lg">
          {settings.length < 1
            ? "Add new financial settings"
            : "Update financial settings"}
        </h1>

        <div className="form-group w-full py-1 lg:py-3">
          <label htmlFor="subscriptionFee w-full">Prefered currency</label>
          <select
            name="preferedCurrency"
            id="preferedCurrency"
            className="w-full uppercase"
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setAdminFinancialSettings({
                ...adminFinancialSettings,
                preferedCurrency: e.target.value,
              })
            }
          >
            <option value="usd">USD</option>
            {currencyArray.map((ca, index) => (
              <option key={index} value={ca}>
                {ca}
              </option>
            ))}
          </select>
          <small></small>
        </div>

        <div className="form-group w-full py-1 lg:py-3">
          <label htmlFor="subscriptionFee">Landlord subscription fee</label>
          <input
            type="number"
            id="subscriptionFee"
            placeholder="$ 0.000"
            value={adminFinancialSettings.subscriptionFee}
            onChange={handleFieldChange}
            className="w-full"
          />
          <small></small>
        </div>
        <div className="form-group w-full py-1 lg:py-3">
          <label htmlFor="brokerFee">Broker fee</label>
          <input
            type="number"
            id="brokerFee"
            placeholder="$ 0.000"
            value={adminFinancialSettings.brokerFee}
            onChange={handleFieldChange}
            className="w-full"
          />
          <small></small>
        </div>
        <div className="form-group w-full py-1 lg:py-3">
          <label htmlFor="serviceFeeFreeRoom">Service fee free room</label>
          <input
            type="number"
            id="serviceFeeFreeRoom"
            placeholder="0.000 %"
            value={adminFinancialSettings.serviceFeeFreeRoom}
            onChange={handleFieldChange}
            className="w-full"
          />
          <small></small>
        </div>
        <div className="form-group w-full py-1 lg:py-3">
          <label htmlFor="serviceFeeOccupiedRoom">
            Service fee occupied room
          </label>
          <input
            type="number"
            id="serviceFeeOccupiedRoom"
            placeholder="0.000 %"
            value={adminFinancialSettings.serviceFeeOccupiedRoom}
            onChange={handleFieldChange}
            className="w-full"
          />
          <small></small>
        </div>
        <div className="form-group w-full py-1 lg:py-3">
          <label htmlFor="minimumBidFee">Minimum bid fee</label>
          <input
            type="number"
            id="minimumBidFee"
            placeholder="$ 0.000"
            value={adminFinancialSettings.minimumBidFee}
            onChange={handleFieldChange}
            className="w-full"
          />
          <small></small>
        </div>
        <div className="form-group w-full py-1 lg:py-3">
          <label htmlFor="otherStaffServiceFee">Other staff service fee</label>
          <input
            type="number"
            id="otherStaffServiceFee"
            placeholder="$ 0.000"
            value={adminFinancialSettings.otherStaffServiceFee}
            onChange={handleFieldChange}
            className="w-full"
          />
          <small></small>
        </div>
        <div className="form-group w-full py-1 lg:py-3 flex flex-wrap justify-around items-center ">
          {settings[0].subscriptionFee < 1 ? (
            <button
              className="bg-blue-900 hover:bg-blue-800 text-xl font-bold text-white w-full py-3 my-2"
              onClick={handleSaveAdminFinancialSettings}
            >
              Save settings
            </button>
          ) : (
            <button
              className="bg-blue-900 hover:bg-blue-800 text-xl font-bold text-white w-full py-3 my-2"
              onClick={handleUpdateAdminFinancialSettings}
            >
              Update settings
            </button>
          )}

          <button
            className="bg-gray-900 hover:bg-gray-800 text-xl font-bold text-white w-full py-3 my-2 lg:hidden"
            onClick={() => setShowForm(!showForm)}
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
};

export default SettingsForm;
