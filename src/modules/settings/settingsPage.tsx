import React, { useEffect, useState } from "react";
import { MdDashboard, MdPayment } from "react-icons/md";
import { FaReceipt, FaUsers } from "react-icons/fa6";
import { ImOffice } from "react-icons/im";
import { FaScrewdriverWrench } from "react-icons/fa6";
import { RxActivityLog } from "react-icons/rx";
import { IoDiamondSharp } from "react-icons/io5";
import Preloader from "../../other/Preloader";
import SideBar from "../../sidebar/sideBar";
import { NavLinkModel } from "../users/models/navLinkModel";
import SettingsForm from "./SettingsForm";
import { useSelector } from "react-redux";
import { getSettings } from "./SettingsSlice";
import { PiBuildingsFill } from "react-icons/pi";
import { FormatMoney } from "../../global/actions/formatMoney";

interface Props {}
const SettingsPage: React.FC<Props> = () => {
  // LOCAL STATES
  const [showForm, setShowForm] = useState<boolean>(false);
  const [navLinks] = useState<NavLinkModel[]>([
    {
      icon: <MdDashboard />,
      name: "Dashboard",
      link: "/dashboard",
      active: false,
    },
    {
      icon: <FaUsers />,
      name: "Users",
      link: "/users",
      active: false,
    },

    {
      icon: <IoDiamondSharp />,
      name: "Landlords",
      link: "/landlords",
      active: false,
    },
    {
      icon: <IoDiamondSharp />,
      name: "Our staff",
      link: "/staffs",
      active: false,
    },
    {
      icon: <PiBuildingsFill />,
      name: "Facilties",
      link: "/facilies",
      active: false,
    },

    {
      icon: <ImOffice />,
      name: "Our offices",
      link: "/offices",
      active: false,
    },
    {
      icon: <FaScrewdriverWrench />,
      name: "Settings",
      link: "/settings",
      active: true,
    },
    {
      icon: <MdPayment />,
      name: "Subscription fees",
      link: "/subscription",
      active: false,
    },
    {
      icon: <IoDiamondSharp />,
      name: "Broker fees",
      link: "/brokerFees",
      active: false,
    },
    {
      icon: <IoDiamondSharp />,
      name: "Bids",
      link: "/bids",
      active: false,
    },
    {
      icon: <FaReceipt />,
      name: "Receipts",
      link: "/receipts",
      active: false,
    },
    {
      icon: <RxActivityLog />,
      name: "Activity Logs",
      link: "/logs",
      active: false,
    },
  ]);

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const settingsState = useSelector(getSettings);
  const { settings } = settingsState;

  /*
   *create a delay of 3sec and check authication
   * to proceed to page or go back to login page
   */
  useEffect(() => {
    const currentUser = localStorage.getItem("dnap-user");
    if (currentUser) {
      setIsAuthenticated(true);
    } else {
      window.location.href = "/";
    }
  }, []);

  // render preloader screen if not authenticated or page still loading
  if (!isAuthenticated) {
    return <Preloader />;
  }

  return (
    <div className="main flex relative w-full">
      <div className="left lg:w-1/5 w-full md:w-full left-0 right-0 fixed lg:relative text-white z-50">
        <SideBar navLinks={navLinks} />
      </div>
      <div className="right relative h-svh overflow-auto lg:w-4/5 w-full z-0 flex flex-wrap justify-between items-start ">
        <div className="w-full lg:w-2/3 h-full py-20 lg:py-5 flex flex-wrap justify-center ">
          <div className="w-full lg:w-1/2 h-5/6 text-start px-10">
            <h1 className="text-3xl lg:text-4xl font-bold font-sans w-full py-5">
              Financial settings
            </h1>

            <div className="py-3">
              <h4 className="text-lg">Prefered currency</h4>
              <h1 className="px-3">
                <span className=" text-2xl font-bold uppercase">
                  {settings.length > 0 ? settings[0].preferedCurrency : "USD"}
                </span>
              </h1>
            </div>

            <div className="py-3">
              <h4 className="text-lg">Landlord Subscription fee (Once)</h4>
              <h1 className="px-3">
                <span className=" text-2xl font-bold font-mono">
                  {settings.length > 0
                    ? FormatMoney(
                        settings[0].subscriptionFee,
                        2,
                        settings[0].preferedCurrency
                      )
                    : 0}
                </span>
              </h1>
            </div>

            <div className="py-3">
              <h4 className="text-lg">Broker fee (Per day)</h4>
              <h1 className="px-3">
                <span className=" text-2xl font-bold font-mono">
                  {settings.length > 0
                    ? FormatMoney(
                        settings[0].brokerFee,
                        2,
                        settings[0].preferedCurrency
                      )
                    : 0}
                </span>
              </h1>
            </div>

            <div className="py-3">
              <h4 className="text-lg">Service fee free room</h4>
              <h1 className="px-3">
                <span className="text-2xl font-bold font-mono">
                  {settings.length > 0
                    ? settings[0].serviceFeeFreeRoom.toFixed(2)
                    : 0}
                </span>{" "}
                <span className=" text-xl font-semibold italic">%</span>
              </h1>
            </div>

            <div className="py-3">
              <h4 className="text-lg">Service fee occupied room</h4>
              <h1 className="px-3">
                <span className="text-2xl font-bold font-mono">
                  {settings.length > 0
                    ? settings[0].serviceFeeOccupiedRoom.toFixed(2)
                    : 0}
                </span>{" "}
                <span className=" text-xl font-semibold italic">%</span>
              </h1>
            </div>

            <div className="py-3">
              <h4 className="text-lg">Minimun bid fee (per facility)</h4>
              <h1 className="px-3">
                <span className=" text-2xl font-bold font-mono">
                  {settings.length > 0
                    ? FormatMoney(
                        settings[0].minimumBidFee,
                        2,
                        settings[0].preferedCurrency
                      )
                    : 0}
                </span>
              </h1>
            </div>

            <div className="py-3">
              <h4 className="text-lg">Other staff service fee (per month)</h4>
              <h1 className="px-3">
                <span className=" text-2xl font-bold font-mono">
                  {settings.length > 0
                    ? FormatMoney(
                        settings[0].otherStaffServiceFee,
                        2,
                        settings[0].preferedCurrency
                      )
                    : 0}
                </span>
              </h1>
            </div>

            <div className="w-full py-10 flex justify-center items-center lg:hidden">
              <button
                className="py-2 px-10 bg-gray-700 text-white text-lg font-bold"
                onClick={() => setShowForm(!showForm)}
              >
                Update settings
              </button>
            </div>
          </div>
        </div>
        <div
          className={`${
            showForm ? "w-full" : "w-0 overflow-hidden"
          }  lg:w-1/3 absolute  lg:relative`}
        >
          <SettingsForm showForm={showForm} setShowForm={setShowForm} />
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
