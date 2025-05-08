import React, { useEffect, useState } from "react";
import { MdDashboard, MdPayment } from "react-icons/md";
import { FaUsers, FaScrewdriverWrench, FaReceipt } from "react-icons/fa6";
import { ImOffice } from "react-icons/im";
import { RxActivityLog } from "react-icons/rx";
import { IoDiamondSharp } from "react-icons/io5";
import { NavLinkModel } from "../users/models/navLinkModel";
import SideBar from "../../sidebar/sideBar";
import Preloader from "../../other/Preloader";
// import { useSelector } from "react-redux";
// import { getMessages, resetSocketMessage } from "../../webSockets/soketsSlice";
import { UserModel } from "../users/models/userModel";
// import { Client } from "@stomp/stompjs";
// import { AppDispatch } from "../../app/store";
// import { socket } from "../../webSockets/socketService";
import { PiBuildingsFill } from "react-icons/pi";
import { useSelector } from "react-redux";
import { getSettings } from "../settings/SettingsSlice";
import TotalEarnings from "./TotalEarnings";
import MonthlyEarnings from "./MonthlyEarnings";
import AnnualEarnings from "./AnnualEarnings";
import DailyEarnings from "./DailyEarnings";
import NumberOfUsers from "./NumberOfUsers";

// import { getCurrencyExchange } from "../../other/apis/CurrencyExchangeSlice";
// import { FormatMoney, FormatMoneyExt } from "../../global/actions/formatMoney";

interface Props {}

const Dashboard: React.FC<Props> = () => {
  const [navLinks] = useState<NavLinkModel[]>([
    {
      icon: <MdDashboard />,
      name: "Dashboard",
      link: "/dashboard",
      active: true,
    },
    { icon: <FaUsers />, name: "Users", link: "/users", active: false },
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
      active: false,
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
    { icon: <IoDiamondSharp />, name: "Bids", link: "/bids", active: false },
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

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // check if the user is authenticated
  useEffect(() => {
    const current_user: UserModel = JSON.parse(
      localStorage.getItem("dnap-user") as string
    );
    if (current_user) {
      setIsAuthenticated(true);
    } else {
      window.location.href = "http://localhost:3000";
    }
  }, []);

  const settingsState = useSelector(getSettings);

  if (!isAuthenticated) return <Preloader />;

  return (
    <div className="main flex relative w-full">
      <div className="left lg:w-1/5 w-full md:w-full left-0 right-0 fixed lg:relative text-white z-50">
        <SideBar navLinks={navLinks} />
      </div>
      <div
        className="lg:w-5/6 w-full h-svh px-0 py-0 uppercase overflow-y-auto  mt-20 lg:mt-0"
        // style={{ height: "calc(100vh - 10px)" }}
      >
        {/* periodic total earning */}
        <TotalEarnings settings={settingsState.settings[0]} />

        {/* annual and monthly earning statistics*/}
        <div className="w-full lg:px-10 h-fit text-sm flex flex-wrap justify-center items-center">
          {/* monthly earnings*/}
          <MonthlyEarnings settings={settingsState.settings[0]} />

          {/* Annual earnings*/}
          <AnnualEarnings settings={settingsState.settings[0]} />

          {/* daily earnings */}
          <DailyEarnings settings={settingsState.settings[0]} />

          {/* number of users in categories */}
          <NumberOfUsers />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
