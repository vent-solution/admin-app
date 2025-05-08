import React, { useEffect, useState } from "react";
import { MdDashboard, MdPayment } from "react-icons/md";
import { FaReceipt, FaUsers } from "react-icons/fa6";
import { ImOffice } from "react-icons/im";
import { FaScrewdriverWrench } from "react-icons/fa6";
import { RxActivityLog } from "react-icons/rx";
import { IoDiamondSharp } from "react-icons/io5";
import SideBar from "../../sidebar/sideBar";
import { NavLinkModel } from "../users/models/navLinkModel";
import LandlordProfile from "./LandlordProfile";
import { useDispatch, useSelector } from "react-redux";
import { findLandlordById } from "./landlordSlice";
import { useNavigate, useParams } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";
import { LandlordModel } from "./models/LandlordModel";
import LandlordBids from "./LandlordBids";
import LandlordLogs from "./LandlordLogs";
import Preloader from "../../other/Preloader";
import { getNumberOfUsers } from "../users/usersSlice";
import LandlordFacilities from "./facilities/LandlordFacilities";
import LandlordsUsersList from "./users/LandlordsUsersList";
import { AppDispatch } from "../../app/store";
import axios from "axios";
import { fetchData } from "../../global/api";
import { resetLandlordsUsers } from "./users/LandlordsUsersSlice";
import { fetchLandlordLogs } from "./logs/LandlordLogsSlice";
import { fetchLandlordBids } from "./bids/LandlordBidsSlice";
import { PiBuildingsFill } from "react-icons/pi";

const SingleLandlordPage: React.FC = () => {
  const numberOfUsers = useSelector(getNumberOfUsers);

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
      name: `Users ${numberOfUsers}`,
      link: "/users",
      active: false,
    },

    {
      icon: <IoDiamondSharp />,
      name: "Landlords",
      link: "/landlords",
      active: true,
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
      active: false,
    },
  ]);

  const navigate = useNavigate();

  const { landlordId } = useParams<{ landlordId: string }>();

  const dispatch = useDispatch<AppDispatch>();
  const landlord = useSelector((state: any) =>
    findLandlordById(state, Number(landlordId))
  );

  //fetch the landlord users
  useEffect(() => {
    const fetchLandlordUsers = async () => {
      try {
        const result = await fetchData(
          `/fetch-users-by-owner/${landlord?.user?.userId}/${0}/${20}`
        );
        if (result.data.status && result.data.status !== "OK") {
          return {
            landlordUsers: [],
            page: 0,
            size: 0,
            totalElements: 0,
            totalPages: 0,
          };
        }
        dispatch(resetLandlordsUsers(result.data));
        return result.data;
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log("FETCH USERS CANCELLED ", error.message);
        }
      }
    };

    fetchLandlordUsers();
  }, [landlord?.user?.userId, dispatch]);

  // fetch a list of logs that belong to the landlord
  useEffect(() => {
    if (landlordId !== undefined && !isNaN(Number(landlordId))) {
      dispatch(
        fetchLandlordLogs({
          userId: Number(landlord?.user?.userId),
          page: 0,
          size: 20,
        })
      );
    }
  }, [landlordId, dispatch, landlord?.user?.userId]);

  // fetch bids added by the landlord
  useEffect(() => {
    dispatch(
      fetchLandlordBids({
        userId: Number(landlord?.user?.userId),
        page: 0,
        size: 20,
      })
    );
  }, [landlord?.user?.userId, dispatch]);

  // redirect page if user is not authenticated
  useEffect(() => {
    const currentUser = localStorage.getItem("dnap-user");
    if (!currentUser) {
      window.location.href = "/";
    }
  }, []);

  const [currentSection, setCurrentSection] =
    useState<string>("LandlordProfile");

  // render section depending on the current active link
  const renderSection = (landlord: LandlordModel) => {
    switch (currentSection) {
      case "LandlordProfile":
        return <LandlordProfile landlord={landlord} />;
      case "LandlordFacilities":
        return <LandlordFacilities landlord={landlord} />;

      case "LandlordsUsersList":
        return <LandlordsUsersList landlord={landlord} />;
      case "LandlordBids":
        return <LandlordBids userId={landlord.user?.userId} />;
      case "LandlordLogs":
        return <LandlordLogs userId={landlord.user?.userId} />;
      default:
        return <LandlordProfile landlord={landlord} />;
    }
  };

  // function for selecting landlord section
  const selectSection = (li: HTMLLIElement) => {
    const { id } = li;
    const ul = li.parentElement;

    if (ul) {
      const lis = ul.querySelectorAll("li");
      lis.forEach((l) => {
        l !== li ? l.classList.remove("active") : l.classList.add("active");
      });
    }

    setCurrentSection(id); // Now setting the section name
  };

  if (!landlord) {
    return <Preloader />; // or a loading spinner
  }

  return (
    <div className="main h-screen flex relative w-full">
      <div className="left lg:w-1/5 w-full md:w-full left-0 right-0 fixed lg:relative text-white z-50">
        <SideBar navLinks={navLinks} />
      </div>
      <div className="right lg:w-4/5 w-full z-0 mt-20 lg:mt-0 px-2 lg:px-0">
        <div className="w-full flex flex-wrap justify-center items-center bg-white shadow-lg mb-5 py-2">
          <div className="w-full lg:w-1/2 py-2 lg:py-0 flex justify-around lg:px-3 ">
            <button
              className="bg-blue-900 hover:bg-blue-800 text-sm text-white lg:flex items-center p-1 px-3 hidden "
              onClick={() => navigate(-1)}
            >
              <IoMdArrowRoundBack />
              Back
            </button>
            {!landlord.companyName && (
              <h2 className="text-lg font-bold">
                {"LLD-" +
                  landlord.landlordId +
                  " " +
                  landlord.user?.firstName +
                  " " +
                  landlord.user?.lastName}
              </h2>
            )}

            {landlord.companyName && (
              <h2 className="text-lg font-bold">
                {"LLD-" + landlord.landlordId + ", " + landlord.companyName}
              </h2>
            )}
          </div>
          <ul className="flex flex-wrap justify-between items-center text-xs lg:text-xs text-blue-900 tracking-wider uppercase p-0 pt-2">
            <li
              id="LandlordProfile"
              className={`p-2 lg:p-5 font-bold border-b-2 hover:border-b-2  lg:hover:bg-red-200 cursor-pointer active`}
              onClick={(e: React.MouseEvent<HTMLLIElement>) =>
                selectSection(e.currentTarget)
              }
            >
              Profile
            </li>

            <li
              id="LandlordFacilities"
              className="p-2 lg:p-5 font-bold border-b-2 hover:border-b-2 lg:hover:bg-red-200 cursor-pointer"
              onClick={(e: React.MouseEvent<HTMLLIElement>) =>
                selectSection(e.currentTarget)
              }
            >
              Facilities
            </li>

            <li
              id="LandlordsUsersList"
              className="p-2 lg:p-5 font-bold border-b-2 hover:border-b-2 lg:hover:bg-red-200 cursor-pointer"
              onClick={(e: React.MouseEvent<HTMLLIElement>) =>
                selectSection(e.currentTarget)
              }
            >
              Users
            </li>

            <li
              id="LandlordBids"
              className="p-2 lg:p-5 font-bold border-b-2 hover:border-b-2 lg:hover:bg-red-200 cursor-pointer"
              onClick={(e: React.MouseEvent<HTMLLIElement>) =>
                selectSection(e.currentTarget)
              }
            >
              Bids
            </li>

            <li
              id="LandlordLogs"
              className="p-2 lg:p-5 font-bold border-b-2 hover:border-b-2 lg:hover:bg-red-200 cursor-pointer"
              onClick={(e: React.MouseEvent<HTMLLIElement>) =>
                selectSection(e.currentTarget)
              }
            >
              Logs
            </li>
          </ul>
        </div>
        {renderSection(landlord)}
      </div>
    </div>
  );
};

export default SingleLandlordPage;
