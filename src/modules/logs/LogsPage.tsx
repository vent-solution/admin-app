import React, { useEffect, useState } from "react";
import { FaReceipt, FaUsers } from "react-icons/fa";
import { FaScrewdriverWrench } from "react-icons/fa6";
import { ImOffice } from "react-icons/im";
import { IoDiamondSharp } from "react-icons/io5";
import { MdDashboard, MdPayment } from "react-icons/md";
import { RxActivityLog } from "react-icons/rx";
import Preloader from "../../other/Preloader";
import SideBar from "../../sidebar/sideBar";
import { NavLinkModel } from "../users/models/navLinkModel";
import LogsList from "./LogsList";
import { PiBuildingsFill } from "react-icons/pi";

interface Props {}
const LogsPage: React.FC<Props> = () => {
  // LOCAL STATES
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
      active: true,
    },
  ]);

  const [isAuthenticated, setIsAuthenticated] = useState(false);

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
      <div className="right lg:w-4/5 w-full z-0">
        <LogsList />
      </div>
    </div>
  );
};

export default LogsPage;
